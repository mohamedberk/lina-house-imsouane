#!/usr/bin/env node
/**
 * PEN SPLIT - Universal .pen to Code-Ready Sections Converter
 *
 * Works with ANY .pen file from ANY project.
 * Reads .pen files DIRECTLY - no MCP export needed!
 *
 * USAGE:
 *   node pen-split.js pencil.pen [output-folder]
 *
 * WORKFLOW:
 *   1. Design in Pencil → saves as pencil.pen
 *   2. Run: node pen-split.js pencil.pen ./sections
 *   3. In Claude Code: "Read ./sections/[screen]/[section].json, generate Next.js code"
 */

const fs = require('fs');
const path = require('path');

// ============================================
// UTILITIES
// ============================================

function slugify(name) {
  return (name || 'unnamed')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function cleanNode(node) {
  const cleaned = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'id') continue; // Remove internal IDs
    if (value === undefined || value === null) continue;
    if (key === 'children' && Array.isArray(value)) {
      cleaned.children = value.map(cleanNode);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function extractTokens(nodes) {
  const colors = new Set();
  const fonts = new Set();

  function traverse(node) {
    if (node.fill && typeof node.fill === 'string' && node.fill.startsWith('#')) {
      colors.add(node.fill);
    }
    if (node.stroke?.fill && typeof node.stroke.fill === 'string') {
      colors.add(node.stroke.fill);
    }
    if (node.fontFamily) fonts.add(node.fontFamily);
    if (node.children) node.children.forEach(traverse);
  }

  nodes.forEach(traverse);
  return {
    colors: [...colors].sort(),
    fonts: [...fonts].sort(),
  };
}

function parseInput(inputFile) {
  const raw = fs.readFileSync(inputFile, 'utf-8');
  const parsed = JSON.parse(raw);

  // Handle different formats:

  // 1. Direct .pen file format: { version: "...", children: [...] }
  if (parsed.version && parsed.children) {
    return parsed.children;
  }

  // 2. MCP export wrapper: [{type: "text", text: "..."}]
  if (Array.isArray(parsed) && parsed[0]?.type === 'text') {
    return JSON.parse(parsed[0].text);
  }

  // 3. Direct array of screens
  if (Array.isArray(parsed)) {
    return parsed;
  }

  throw new Error('Unknown file format');
}

// ============================================
// MAIN
// ============================================

function main() {
  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || './pen-sections';

  if (!inputFile) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  PEN SPLIT - Convert .pen designs to code-ready sections     ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
  node pen-split.js pencil.pen [output-folder]

EXAMPLE:
  node pen-split.js pencil.pen ./sections

THEN IN CLAUDE CODE:
  "Read ./sections/_tokens.json and
   ./sections/landing-page/01-header.json
   Generate a Next.js component with Tailwind CSS"

WHY THIS WORKS:
  - Your .pen file: 200+ KB (fills Claude's context)
  - Each section: 5-20 KB (fits easily)
  - Claude generates identical code, no guessing
`);
    process.exit(0);
  }

  // Check file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }

  // Parse input
  console.log(`\n📖 Reading: ${inputFile}`);
  let data;
  try {
    data = parseInput(inputFile);
  } catch (e) {
    console.error(`❌ Failed to parse: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.error('❌ No screens found in file');
    process.exit(1);
  }

  const fileSize = fs.statSync(inputFile).size;
  console.log(`   Size: ${(fileSize / 1024).toFixed(1)} KB`);
  console.log(`   Screens: ${data.length}\n`);

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Extract and save tokens
  const tokens = extractTokens(data);
  fs.writeFileSync(
    path.join(outputDir, '_tokens.json'),
    JSON.stringify(tokens, null, 2)
  );
  console.log(`📦 _tokens.json (${tokens.colors.length} colors, ${tokens.fonts.length} fonts)`);

  // Process each screen
  const manifest = {
    source: path.basename(inputFile),
    generated: new Date().toISOString(),
    screens: []
  };
  let totalSections = 0;

  for (const screen of data) {
    const screenName = screen.name || 'unnamed-screen';
    const screenSlug = slugify(screenName);
    const screenDir = path.join(outputDir, screenSlug);

    fs.mkdirSync(screenDir, { recursive: true });

    const screenInfo = {
      name: screenName,
      folder: screenSlug,
      layout: {
        type: screen.type,
        layout: screen.layout || 'vertical',
        width: screen.width,
        height: screen.height,
        fill: screen.fill,
      },
      sections: [],
    };

    console.log(`\n📁 ${screenName}/`);

    const children = screen.children || [];
    for (let i = 0; i < children.length; i++) {
      const section = children[i];
      const sectionName = section.name || `section-${i + 1}`;
      const filename = `${String(i + 1).padStart(2, '0')}-${slugify(sectionName)}.json`;

      const cleaned = cleanNode(section);
      const json = JSON.stringify(cleaned, null, 2);
      const sizeKB = (json.length / 1024).toFixed(1);

      fs.writeFileSync(path.join(screenDir, filename), json);

      screenInfo.sections.push({ name: sectionName, file: filename, size: `${sizeKB}KB` });
      console.log(`   ${filename} (${sizeKB} KB)`);
      totalSections++;
    }

    // Save screen manifest
    fs.writeFileSync(
      path.join(screenDir, '_screen.json'),
      JSON.stringify(screenInfo, null, 2)
    );

    manifest.screens.push(screenInfo);
  }

  // Save global manifest
  fs.writeFileSync(
    path.join(outputDir, '_manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Done! ${totalSections} sections across ${data.length} screens`);
  console.log(`📂 Output: ${outputDir}/\n`);

  console.log(`🚀 NEXT STEP - In Claude Code, say:\n`);
  console.log(`   "Read ${outputDir}/_tokens.json and`);
  console.log(`    ${outputDir}/${manifest.screens[0]?.folder || 'screen'}/01-*.json`);
  console.log(`    Generate a Next.js component with Tailwind CSS"\n`);
}

main();

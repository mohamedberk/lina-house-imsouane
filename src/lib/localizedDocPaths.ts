/**
 * Schema-path ↔ document traversal utilities.
 *
 * A "schema path" looks like:  `"a.b[].c.d[].e"`
 * A "concrete path" looks like: `"a.b[0].c.d[2].e"` (array indices resolved).
 *
 * `extractStrings` walks a document along a list of schema paths and returns
 * every string value it finds, keyed by its concrete path.
 *
 * `buildPatch` takes the source doc + a map of (concretePath → translated
 * string) and returns a minimal nested object that mirrors the source doc's
 * structure but contains ONLY the translated strings (plus array-item
 * scaffolding so Payload's array validation passes).
 */

export type ExtractedString = { path: string; value: string }

export function extractStrings(doc: any, schemaPaths: string[]): ExtractedString[] {
  return schemaPaths.flatMap((p) => walkSchemaPath(doc, p))
}

function walkSchemaPath(doc: any, schemaPath: string): ExtractedString[] {
  const parts = schemaPath.split('.')
  const out: ExtractedString[] = []

  const visit = (node: any, remaining: string[], concretePath: string) => {
    if (node == null) return

    if (remaining.length === 0) {
      if (typeof node === 'string' && node.trim().length > 0) {
        out.push({ path: concretePath, value: node })
      }
      return
    }

    const [head, ...rest] = remaining

    if (head.endsWith('[]')) {
      const key = head.slice(0, -2)
      const arr = node[key]
      if (Array.isArray(arr)) {
        arr.forEach((item, idx) => {
          visit(item, rest, concretePath ? `${concretePath}.${key}[${idx}]` : `${key}[${idx}]`)
        })
      }
    } else {
      const next = node[head]
      visit(next, rest, concretePath ? `${concretePath}.${head}` : head)
    }
  }

  visit(doc, parts, '')
  return out
}

/**
 * Build a minimal object mirroring `sourceDoc`'s shape, containing only the
 * translated strings at their paths. Array items copy non-string fields from
 * the source (id, icon, uploaded media ids, relationships, etc.) so Payload
 * doesn't wipe them when saving the new locale.
 */
export function buildPatch(sourceDoc: any, translations: Map<string, string>): Record<string, any> {
  const result: any = {}

  for (const [path, translated] of translations.entries()) {
    setAtPath(result, path, translated, sourceDoc)
  }

  return result
}

function setAtPath(target: any, concretePath: string, value: string, sourceDoc: any) {
  const tokens: (string | number)[] = []
  const regex = /([^.[\]]+)|\[(\d+)\]/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(concretePath)) !== null) {
    if (m[1] !== undefined) tokens.push(m[1])
    else if (m[2] !== undefined) tokens.push(Number(m[2]))
  }

  let cur = target
  let src = sourceDoc
  for (let i = 0; i < tokens.length - 1; i++) {
    const tok = tokens[i]
    const nextTok = tokens[i + 1]
    const isArrayNext = typeof nextTok === 'number'

    if (typeof tok === 'number') {
      if (cur[tok] === undefined) {
        const srcItem = src?.[tok]
        cur[tok] = seedArrayItem(srcItem)
      }
      cur = cur[tok]
      src = src?.[tok]
    } else {
      if (cur[tok] === undefined) {
        cur[tok] = isArrayNext ? [] : {}
      }
      cur = cur[tok]
      src = src?.[tok]
    }
  }

  const last = tokens[tokens.length - 1]
  cur[last as any] = value
}

function seedArrayItem(srcItem: any): any {
  if (srcItem == null || typeof srcItem !== 'object') return {}
  const seeded: any = {}
  for (const [k, v] of Object.entries(srcItem)) {
    if (typeof v !== 'string') {
      seeded[k] = v
      continue
    }
    // Preserve select values (icons, enums) — they'd fail validation otherwise.
    // Standard Payload internals we must keep:
    if (k === 'id' || k === 'icon') seeded[k] = v
  }
  return seeded
}

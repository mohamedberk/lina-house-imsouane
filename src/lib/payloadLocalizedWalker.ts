import type { Field } from 'payload'

/**
 * Walks a Payload `Field[]` configuration and returns every localized string
 * path in the shape expected by the translation engine:
 *
 *   - `"a.b.c"`    → scalar localized string at that path
 *   - `"a.b[].c"`  → localized string at property `c` of each item in array `a.b`
 *
 * Handles: group, array, tabs (named + unnamed), row, collapsible, text,
 * textarea, email. Skips: richText, select, upload, relationship, number,
 * checkbox, date, code, json, point, blocks (not used in this codebase),
 * and any field without `localized: true`.
 *
 * If `blocks` becomes needed later, extend the walker to recurse into each
 * block's fields with a `[].<blockType>.<path>` style.
 */
export function extractLocalizedPaths(fields: Field[], prefix = ''): string[] {
  const out: string[] = []

  for (const field of fields) {
    const type = (field as any).type as string
    const name = (field as any).name as string | undefined
    const localized = (field as any).localized === true

    const push = (p: string) => {
      if (p) out.push(p)
    }

    const joinName = (pfx: string, n: string) => (pfx ? `${pfx}.${n}` : n)

    switch (type) {
      // ── Terminal localized fields ─────────────────────────────────────
      case 'text':
      case 'textarea':
      case 'email': {
        if (localized && name) push(joinName(prefix, name))
        break
      }

      // ── Named nesting ─────────────────────────────────────────────────
      case 'group': {
        if (!name) break
        const inner = extractLocalizedPaths((field as any).fields || [], '')
        for (const p of inner) push(joinName(prefix, `${name}.${p}`.replace(/\.$/, '')))
        break
      }

      case 'array': {
        if (!name) break
        // Two cases in Payload:
        //   a) The array itself has `localized: true` — the whole array stores
        //      a separate copy per locale. Items can still have inner fields
        //      that aren't individually marked; we translate all string-typed
        //      inner fields.
        //   b) Individual inner fields have `localized: true`.
        // The walker emits any inner field whose own `localized: true` is set,
        // AND if the array itself is localized, also emits every inner string
        // field regardless of its own flag.
        const innerFields: Field[] = (field as any).fields || []
        const pathsByOwnFlag = extractLocalizedPaths(innerFields, '')

        let paths = pathsByOwnFlag

        if (localized) {
          const allStringPaths = collectAllStringPaths(innerFields, '')
          paths = Array.from(new Set([...pathsByOwnFlag, ...allStringPaths]))
        }

        for (const p of paths) push(joinName(prefix, `${name}[].${p}`))
        break
      }

      // ── Unnamed visual groupings (flatten) ────────────────────────────
      case 'row':
      case 'collapsible': {
        const inner = extractLocalizedPaths((field as any).fields || [], prefix)
        inner.forEach(push)
        break
      }

      // ── Tabs: named tabs nest like groups, unnamed tabs flatten ──────
      case 'tabs': {
        const tabs: any[] = (field as any).tabs || []
        for (const tab of tabs) {
          const tabName: string | undefined = tab?.name
          if (tabName) {
            const inner = extractLocalizedPaths(tab.fields || [], '')
            for (const p of inner) push(joinName(prefix, `${tabName}.${p}`))
          } else {
            const inner = extractLocalizedPaths(tab.fields || [], prefix)
            inner.forEach(push)
          }
        }
        break
      }

      default:
        // Skip everything else (richText, upload, relationship, number, etc.)
        break
    }
  }

  return out
}

/**
 * Emits every string-typed path under `fields` regardless of the field's own
 * `localized` flag. Used only when a parent array is itself localized.
 */
function collectAllStringPaths(fields: Field[], prefix: string): string[] {
  const out: string[] = []

  for (const field of fields) {
    const type = (field as any).type as string
    const name = (field as any).name as string | undefined
    const joinName = (pfx: string, n: string) => (pfx ? `${pfx}.${n}` : n)

    switch (type) {
      case 'text':
      case 'textarea':
      case 'email':
        if (name) out.push(joinName(prefix, name))
        break
      case 'group': {
        if (!name) break
        const inner = collectAllStringPaths((field as any).fields || [], '')
        for (const p of inner) out.push(joinName(prefix, `${name}.${p}`))
        break
      }
      case 'array': {
        if (!name) break
        const inner = collectAllStringPaths((field as any).fields || [], '')
        for (const p of inner) out.push(joinName(prefix, `${name}[].${p}`))
        break
      }
      case 'row':
      case 'collapsible': {
        const inner = collectAllStringPaths((field as any).fields || [], prefix)
        out.push(...inner)
        break
      }
      case 'tabs': {
        const tabs: any[] = (field as any).tabs || []
        for (const tab of tabs) {
          const tabName: string | undefined = tab?.name
          const inner = collectAllStringPaths(tab.fields || [], tabName ? '' : prefix)
          if (tabName) for (const p of inner) out.push(joinName(prefix, `${tabName}.${p}`))
          else out.push(...inner)
        }
        break
      }
    }
  }

  return out
}

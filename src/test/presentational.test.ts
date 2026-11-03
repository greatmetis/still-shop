/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Backs up the lint rule in .oxlintrc.json, which only sees named imports
// (it misses `React.useState` after `import * as React from 'react'`).
// Reads the folder at run time on purpose: an `import.meta.glob` version was cached by Vitest and
// kept seeing the old (empty) folder, so it passed without checking any component.
const componentsDir = join(process.cwd(), 'src/components')
const files = readdirSync(componentsDir, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .map((file) => [file, readFileSync(join(componentsDir, file), 'utf8')] as const)

const banned = /\b(useState|useEffect|useReducer|useLayoutEffect|useRef|useSearchParams|useNavigate|useLoaderData|fetch)\s*\(/

describe('team components are presentational', () => {
  it('finds the components to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s has no state, effects or fetching', (_file, source) => {
    expect(source).not.toMatch(banned)
  })
})

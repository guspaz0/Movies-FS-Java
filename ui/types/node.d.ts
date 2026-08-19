// Minimal Node.js type shims so vite.config.ts can be type-checked
// without installing @types/node.
declare module 'node:module' {
  export function createRequire(base: string | URL): NodeRequire
}
declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
  export function pathToFileURL(path: string): URL
  export class URL {
    constructor(input: string, base?: string | URL)
    href: string
    protocol: string
    pathname: string
    search: string
    hash: string
  }
}
interface NodeRequire {
  (id: string): any
  resolve(id: string): string
  cache: Record<string, unknown>
}
declare const process: {
  env: Record<string, string | undefined>
  argv: string[]
  cwd(): string
  platform: string
  exit(code?: number): never
}

/**
 * Prefixa um caminho absoluto ("/algo") com o `base` configurado em
 * astro.config.mjs, para que links internos e assets funcionem tanto em
 * `npm run dev`/`npm run preview` quanto publicados sob um subcaminho
 * (GitHub Pages: /GymLog-Site/). Usar sempre em vez de hrefs "/..." fixos.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

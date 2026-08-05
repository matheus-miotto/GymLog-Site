/**
 * Breakpoints do projeto, espelhando os valores definidos em
 * src/styles/theme.css. Mantidos aqui para uso futuro em lógica
 * JavaScript/TypeScript (ex.: matchMedia), já que CSS não permite
 * reaproveitar var() dentro de @media.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

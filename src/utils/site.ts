/**
 * Constantes globais do site, usadas pelo Layout e pelo Footer para
 * preencher metadados de SEO, Open Graph e informações institucionais.
 */
export const SITE = {
  name: "GymLog",
  // Usada como base para resolver canonical/Open Graph quando Astro.site
  // não estiver disponível (fallback defensivo; hoje sempre definido via
  // `site` em astro.config.mjs). Deve ser mantida igual ao `site` de lá.
  url: "https://matheus-miotto.github.io",
  // E-mail oficial de suporte — único ponto de atualização do projeto.
  supportEmail: "gymlog.support@gmail.com",
  // Versão atual do aplicativo GymLog (projeto separado deste site).
  // Atualizar manualmente a cada release do app.
  appVersion: "0.31.0",
  // Preencher quando o repositório do projeto for publicado no GitHub.
  // O Footer só exibe o link quando este valor não estiver vazio.
  githubUrl: "",
} as const;

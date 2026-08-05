/**
 * Constantes globais do site, usadas pelo Layout e pelo Footer para
 * preencher metadados de SEO, Open Graph e informações institucionais.
 */
export const SITE = {
  name: "GymLog",
  description:
    "GymLog é o aplicativo para registro e acompanhamento de treinos. Conteúdo institucional em preparação.",
  // URL definitiva a ser configurada na Sprint de publicação (GitHub Pages).
  url: "https://gymlog.app",
  // Temporário — atualizar quando houver e-mail oficial de suporte.
  supportEmail: "suporte@gymlog.app",
  // Versão atual do aplicativo GymLog (projeto separado deste site).
  // Atualizar manualmente a cada release do app.
  appVersion: "0.1.0",
  // Preencher quando o repositório do projeto for publicado no GitHub.
  // O Footer só exibe o link quando este valor não estiver vazio.
  githubUrl: "",
} as const;

import type { IconName } from "./icons";

/**
 * Conteúdo textual da Home, separado dos componentes visuais para
 * permitir ajustes futuros (textos, ícones) sem tocar em markup ou estilo.
 *
 * Consolidado na Sprint 1.2 (revisão de design): a Home passou de ~20
 * cards espalhados em 3 seções quase idênticas para 3 recursos
 * consolidados + 3 fatos de confiança embutidos no Hero — ver
 * DECISIONS.md para o raciocínio completo.
 */
export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "clipboard-list",
    title: "Registre cada treino",
    description:
      "Séries, cargas, repetições e exercícios, registrados em poucos toques.",
  },
  {
    icon: "trending-up",
    title: "Acompanhe sua evolução",
    description:
      "Histórico completo e avaliações corporais para ver seu progresso ao longo do tempo.",
  },
  {
    icon: "repeat",
    title: "Organize em ciclos",
    description: "Periodize seus treinos e mantenha consistência, sessão após sessão.",
  },
];

export interface TrustPoint {
  icon: IconName;
  label: string;
}

/**
 * Fatos curtos exibidos no Hero (não são "recursos", são características
 * que diferenciam o GymLog — por isso ficam junto da mensagem principal,
 * não em uma seção própria).
 */
export const TRUST_POINTS: TrustPoint[] = [
  { icon: "wifi-off", label: "100% offline" },
  { icon: "user-x", label: "Sem criar conta" },
  { icon: "lock", label: "Seus dados, seu controle" },
];

export interface FaqEntry {
  question: string;
  answer: string;
}

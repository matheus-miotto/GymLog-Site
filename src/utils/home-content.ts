import type { IconName } from "./icons";

/**
 * Conteúdo textual da Home, separado dos componentes visuais para
 * permitir ajustes futuros (textos, ícones) sem tocar em markup ou estilo.
 */
export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "clipboard-list",
    title: "Registro de treinos",
    description:
      "Registre cada série, repetição e carga em poucos toques, direto durante o treino.",
  },
  {
    icon: "dumbbell",
    title: "Controle de cargas",
    description:
      "Acompanhe a evolução de carga em cada exercício ao longo do tempo.",
  },
  {
    icon: "history",
    title: "Histórico completo",
    description: "Consulte todos os treinos já realizados, sem limite de tempo.",
  },
  {
    icon: "layout-dashboard",
    title: "Dashboard",
    description:
      "Visualize seu progresso e os principais indicadores em um painel único.",
  },
  {
    icon: "trending-up",
    title: "Evolução física",
    description:
      "Acompanhe sua evolução de peso, medidas e desempenho ao longo dos meses.",
  },
  {
    icon: "ruler",
    title: "Avaliações corporais",
    description: "Registre medidas corporais e acompanhe sua composição física.",
  },
  {
    icon: "repeat",
    title: "Ciclos de treino",
    description: "Organize seus treinos em ciclos e periodize sua evolução.",
  },
  {
    icon: "hard-drive",
    title: "Backup local",
    description: "Seus dados ficam salvos localmente, com backup sob seu controle.",
  },
];

export interface ValueProp {
  icon: IconName;
  title: string;
  description: string;
}

/**
 * Seção "Por que escolher o GymLog?" — cada item explica a filosofia por
 * trás do recurso, não apenas o recurso em si.
 */
export const VALUE_PROPS: ValueProp[] = [
  {
    icon: "wifi-off",
    title: "100% Offline",
    description:
      "Registre seus treinos sem depender de internet, onde quer que você esteja.",
  },
  {
    icon: "lock",
    title: "Seus dados permanecem no dispositivo",
    description:
      "Suas informações ficam armazenadas localmente, sob seu controle.",
  },
  {
    icon: "user-x",
    title: "Sem necessidade de criar conta",
    description: "Comece a usar imediatamente, sem cadastros ou senhas.",
  },
  {
    icon: "zap",
    title: "Interface rápida",
    description: "Poucos toques entre você e o registro do seu treino.",
  },
  {
    icon: "target",
    title: "Desenvolvido para quem realmente treina",
    description: "Pensado por quem treina, para quem treina — sem distrações.",
  },
  {
    icon: "history",
    title: "Histórico completo de evolução",
    description: "Acompanhe sua jornada do primeiro treino até hoje.",
  },
  {
    icon: "hard-drive",
    title: "Backup local",
    description:
      "Seus dados ficam protegidos localmente, com backup sob seu controle.",
  },
];

export interface UpcomingFeature {
  icon: IconName;
  title: string;
}

/**
 * Seção "Em desenvolvimento" — funcionalidades futuras, sem datas
 * ou promessas de lançamento.
 */
export const UPCOMING_FEATURES: UpcomingFeature[] = [
  { icon: "crown", title: "Sistema Premium" },
  { icon: "brain", title: "Inteligência para progressão de carga" },
  { icon: "gauge", title: "RIR / RPE" },
  { icon: "bar-chart-3", title: "Novas estatísticas" },
  { icon: "refresh-cw", title: "Melhorias contínuas" },
];

export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQ: FaqEntry[] = [
  {
    question: "O aplicativo funciona offline?",
    answer:
      "Sim. O GymLog foi projetado para funcionar 100% offline, sem depender de conexão com a internet.",
  },
  {
    question: "Preciso criar conta?",
    answer:
      "Não é necessário criar conta para utilizar os recursos principais do aplicativo.",
  },
  {
    question: "O backup é local?",
    answer:
      "Sim. Seus dados ficam armazenados localmente no seu dispositivo, com backup sob seu controle.",
  },
  {
    question: "O aplicativo será gratuito?",
    answer: "Os detalhes sobre planos e preços serão divulgados em breve.",
  },
];

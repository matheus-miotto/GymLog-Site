import type { FaqEntry } from "./home-content";

/**
 * Perguntas frequentes da página de Suporte — reaproveita o tipo `FaqEntry`
 * já usado no FAQ da Home, mas com conteúdo próprio, focado em atendimento.
 */
export const SUPPORT_FAQ: FaqEntry[] = [
  {
    question: "O GymLog funciona offline?",
    answer:
      "Sim. O GymLog funciona 100% offline, sem depender de conexão com a internet.",
  },
  {
    question: "Como faço backup?",
    answer:
      "Você pode exportar um backup dos seus dados diretamente no aplicativo, sempre que quiser.",
  },
  {
    question: "Posso restaurar meus dados?",
    answer:
      "Sim. Basta importar um backup criado anteriormente para restaurar seus dados.",
  },
  {
    question: "Preciso criar uma conta?",
    answer: "Não. O GymLog não exige criação de conta nem login.",
  },
  {
    question: "Existe versão Premium?",
    answer:
      "Ainda não. Estamos avaliando a possibilidade de disponibilizar funcionalidades Premium no futuro.",
  },
];

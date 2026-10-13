import type { FaqEntry } from "./home-content";

/**
 * Perguntas frequentes da página de Suporte — reaproveita o tipo `FaqEntry`
 * já usado no FAQ da Home, mas com conteúdo próprio, focado em atendimento.
 */
export const SUPPORT_FAQ: FaqEntry[] = [
  {
    question: "O GymLog funciona offline?",
    answer:
      "Os principais dados de treino ficam armazenados no seu dispositivo, e você não precisa criar uma conta para usar o GymLog. Algumas funcionalidades, como publicidade e gerenciamento de assinaturas, podem depender de conexão com a internet.",
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

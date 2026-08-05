# Roadmap

Histórico das Sprints do site institucional do GymLog, da estrutura
inicial até o congelamento da versão 1.0.

- **Sprint 0.1 — Estrutura e arquitetura** ✅ concluída
  Estrutura de pastas, componentes reutilizáveis, sistema de tema e páginas com conteúdo temporário.

- **Sprint 0.2 — Home Page** ✅ concluída
  Conteúdo definitivo da página inicial: Hero, Recursos, Diferenciais e FAQ.

- **Sprint 0.2.1 — Acabamento da Home** ✅ concluída
  Mockup do app no Hero, seção "Por que escolher o GymLog?", seção "Em desenvolvimento", menu mobile, contraste WCAG AA.

- **Sprint 0.2.2 — Publicação automática** ✅ concluída
  `site`/`base` no Astro e workflow de publicação via GitHub Actions.

- **Sprint 0.3 — Política de Privacidade** ✅ concluída
  Texto oficial da Política de Privacidade, refletindo o comportamento atual do GymLog (offline, sem conta, sem servidores próprios).

- **Sprint 0.4 — Termos de Uso** ✅ concluída
  Texto oficial dos Termos de Uso, preparado para futuras funcionalidades Premium sem afirmar que já existem. E-mail oficial de suporte (`gymlog.support@gmail.com`) padronizado em todo o projeto.

- **Sprint 0.5 — Página de Suporte** ✅ concluída
  Conteúdo oficial de suporte, contato centralizado, FAQ de atendimento e card de informações do projeto. Última página institucional obrigatória.

- **Sprint 1.0 — Acabamento final e congelamento da v1.0** ✅ concluída
  `robots.txt`, sitemap automático (`@astrojs/sitemap`), página 404, revisão completa de SEO e acessibilidade, limpeza de código morto e dependências. **O site institucional está funcionalmente concluído.**

## Modo de manutenção

A partir da v1.0.0, o site não recebe novas funcionalidades por conta
própria. Alterações futuras devem refletir mudanças reais no aplicativo
GymLog:

- lançamento de novas funcionalidades do app (ex.: novas seções em "Em desenvolvimento" na Home deixam de ser "em desenvolvimento");
- publicação do GymLog nas lojas (App Store / Google Play) — troca dos `StoreBadge` por links reais;
- screenshots oficiais do aplicativo — substituição do placeholder em `AppMockup`;
- adoção de domínio próprio;
- atualizações de conteúdo em Política de Privacidade, Termos de Uso ou Suporte, caso o comportamento do app mude.

Tarefas técnicas puramente do site (novas páginas, novos componentes,
redesenhos) não devem ser adicionadas sem uma necessidade concreta —
ver a observação correspondente no [README.md](../README.md).

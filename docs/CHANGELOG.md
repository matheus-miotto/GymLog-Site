# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.2.1] — 2026-08-05

### Adicionado

- Ilustração do aplicativo no Hero (`AppMockup.astro`): moldura de smartphone com placeholder em CSS puro, pronta para receber a captura oficial futuramente sem mudar a estrutura da página.
- Nova seção "Por que escolher o GymLog?" (`ValueProp.astro`), com narrativa voltada à filosofia do produto.
- Nova seção "Em desenvolvimento", listando funcionalidades futuras sem datas ou promessas de lançamento (variante `upcoming` do `FeatureCard`).
- Menu de navegação responsivo no `Header`: hambúrguer em telas móveis, 100% CSS (sem JavaScript).
- Rodapé enriquecido: versão do site (lida de `package.json`) e do aplicativo, e-mail de suporte temporário, link condicional para o GitHub e navegação em colunas — já preparado para receber selos de loja futuramente.
- Imagem de Open Graph definitiva da Home (`public/images/og-home.png`, 1200×630) e metadados adicionais de Open Graph/Twitter Card (`og:locale`, `og:image:width/height/alt`, `twitter:image`).
- Indicador de foco visível (`:focus-visible`) global para navegação por teclado.

### Alterado

- Seção "Diferenciais" removida e substituída por "Por que escolher o GymLog?" (ver [DECISIONS.md](./DECISIONS.md) para o motivo).
- Hero reestruturado em duas colunas (texto + ilustração) em telas médias e maiores.
- Description da Home reduzida para caber melhor em resultados de busca e compartilhamentos.
- `--color-text-muted` ajustado para atender ao contraste mínimo do WCAG AA (4.5:1).
- Ícones (`Icon.astro`) marcados como decorativos (`aria-hidden="true"`) por padrão.

### Observações

- Responsividade validada sem rolagem horizontal em 390px, 768px, 1024px, 1280px e 1440px de largura.
- GitHub Pages e GitHub Actions seguem fora do escopo desta Sprint (ver Sprint 0.6 no [ROADMAP.md](./ROADMAP.md)).

## [0.2.0] — 2026-08-05

### Adicionado

- Conteúdo definitivo da Home, com seções: Hero, Recursos, Diferenciais e Perguntas Frequentes.
- Componentes reutilizáveis: `Icon`, `HeroSection`, `StoreBadge`, `FeatureCard` (com variante `compact`), `FeatureGrid` e `FAQItem`.
- Ícones da biblioteca [Lucide](https://lucide.dev) via `lucide-static`, inline via SVG puro (sem JavaScript em runtime).
- Conteúdo de Recursos, Diferenciais e FAQ centralizado em `src/utils/home-content.ts`.
- Navegação completa no `Header` (Início, Política, Termos, Suporte), preparada para novas páginas futuras.
- Título e descrição definitivos da Home para SEO/Open Graph.
- `docs/DECISIONS.md` com o registro de decisões arquiteturais do projeto.

### Alterado

- `Layout`: título da página não duplica mais o nome do site quando o `title` informado já o contém (ver [DECISIONS.md](./DECISIONS.md)).

### Observações

- Botões de loja ("Em breve na App Store" / "Em breve no Google Play") permanecem sem link de destino real, conforme escopo desta Sprint.
- Política de Privacidade, Termos de Uso e demais páginas seguem com conteúdo temporário (ver [ROADMAP.md](./ROADMAP.md)).

## [0.1.0] — 2026-08-05

### Adicionado

- Estrutura inicial do projeto Astro (arquitetura, organização de pastas e componentes reutilizáveis).
- Sistema de tema centralizado em `src/styles/theme.css` (cores, tipografia, espaçamentos, raios de borda e breakpoints), com tema único Dark Theme.
- Reset e estilos globais em `src/styles/global.css`.
- Componentes reutilizáveis: `Layout`, `Header`, `Footer`, `Container`, `Button` e `Section`.
- Layout principal com HTML semântico, meta tags básicas, Open Graph e SEO preparados.
- Páginas institucionais com conteúdo temporário: Home (`index.astro`), Política de Privacidade (`privacy.astro`), Termos de Uso (`terms.astro`) e Suporte (`support.astro`).
- Utilitários em TypeScript: constantes do site (`src/utils/site.ts`) e breakpoints (`src/utils/breakpoints.ts`).
- Documentação inicial do projeto (`docs/README.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`).

### Observações

- Projeto preparado para publicação futura via GitHub Pages, porém sem workflows de GitHub Actions e sem publicação nesta Sprint.
- Nenhum conteúdo definitivo, animação ou tema claro foi implementado — escopo reservado para Sprints futuras (ver [ROADMAP.md](./ROADMAP.md)).

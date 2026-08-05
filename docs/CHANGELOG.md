# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] — 2026-08-05

Unificação da identidade visual do site com o Design System do
aplicativo GymLog: paleta laranja oficial e suporte completo a temas
Claro/Escuro/Seguir sistema. Sprint exclusivamente visual — nenhum
conteúdo, SEO, sitemap, robots ou página foi alterado.

### Adicionado

- Suporte completo a 3 temas — Claro, Escuro e Seguir sistema —, com preferência persistida em `localStorage` e aplicada via `data-theme` no `<html>` + `prefers-color-scheme`. Sem bibliotecas: JavaScript puro e mínimo.
- `src/components/ThemeToggle.astro`: botão cíclico (ícone `monitor`/`sun`/`moon`) que alterna entre os 3 temas, integrado ao `Header`.
- Script anti-flash (`is:inline`) no `<head>` do `Layout`, aplicando o tema salvo antes da primeira renderização.
- Tokens de tema novos em `theme.css`: `--color-header` (fundo do AppBar), `--shadow-sm` (sombra discreta de hover), `--transition-fast`/`--transition-base` (transições centralizadas).
- Palheta completa do tema Claro em `theme.css` (antes o site era exclusivamente escuro).
- `::selection` com a cor oficial do GymLog.
- Destaque da palavra "evolução" em laranja no título do Hero.

### Alterado

- **Cor de destaque oficial trocada de verde (`#22c55e`) para laranja (`#FF5A1F`)**, com variante de hover `#E64A19` — aplicada em botões primários, links ativos, ícones ativos, item de navegação ativo e hover de links/nav/footer.
- `Header`: fundo passou a usar `--color-header` (tom "AppBar", distinto do fundo da página); reestruturado (`header__end`) para acomodar o `ThemeToggle` mantendo o menu mobile 100% CSS.
- `Button`, `FeatureCard`, `ValueProp`, `FAQItem` e o card "Informações do projeto" (Suporte) ganharam transições suaves de hover (cor/borda/sombra) usando os novos tokens de transição.
- `ValueProp` (seção "Por que escolher o GymLog?") e o card de informações do Suporte passaram a usar a mesma superfície/borda/hover de `FeatureCard`, unificando o tratamento de "card" em todo o site.
- Hover de links de texto passou a manter a cor principal (em vez da variante escura) e ganhou sublinhado, conforme a especificação de cor do briefing.

### Observações

- Nenhuma biblioteca foi adicionada para troca de tema (JavaScript puro, ~40 linhas).
- Contraste (WCAG AA) verificado para toda a nova paleta; dois pontos ficam abaixo ou na margem do limite de 4.5:1 (texto branco sobre o botão laranja, ~3,1:1; texto secundário do tema claro, ~4,4:1) — mantidos por serem valores exatos da paleta oficial do aplicativo, com o trade-off documentado em [DECISIONS.md](./DECISIONS.md).
- Responsividade e ausência de rolagem horizontal validadas nos dois temas (claro e escuro), em 390/480/768/1024/1280/1440px, nas 4 páginas.
- Persistência da preferência de tema validada via automação: alternância cíclica (sistema → claro → escuro → sistema), `localStorage` e recarregamento de página.
- Conteúdo, SEO, sitemap, `robots.txt`, páginas e documentação (além de `CHANGELOG.md`/`DECISIONS.md`) permaneceram inalterados, conforme escopo desta Sprint.

## [1.0.0] — 2026-08-05

Encerramento do desenvolvimento da versão 1.0 do site institucional. A
partir desta versão, o projeto entra em **modo de manutenção** — ver
observação no final desta entrada e a seção correspondente no
[README.md](../README.md).

### Adicionado

- `public/robots.txt`, permitindo indexação e referenciando o sitemap.
- Sitemap automático via integração oficial `@astrojs/sitemap`, com a página 404 filtrada do resultado.
- Página `src/pages/404.astro`, usando o mesmo `Layout` do restante do site, com `noindex` e botão de volta para a Home (primeiro uso real do componente `Button`).
- Prop `noindex` no `Layout`, usada apenas pela página 404.

### Alterado

- `SITE.url` (`src/utils/site.ts`) corrigida de um domínio fictício (`gymlog.app`, nunca registrado) para a URL real do site publicado.

### Removido

- Dependências `@astrojs/check` e `typescript`, instaladas incidentalmente ao tentar rodar `astro check` e revertidas por não estarem no escopo desta Sprint ("não adicionar bibliotecas apenas para esta Sprint").
- Ícones não utilizados `shield-check` e `smile` (sobras da seção "Diferenciais", removida na Sprint 0.2.1).
- Variáveis de tema não utilizadas: `--font-size-2xl`, `--font-size-4xl`, `--font-weight-regular`, `--space-xs`.
- `SITE.description`, nunca lida em nenhum lugar do código e com texto desatualizado.

### Observações

- Revisão completa de SEO: todas as páginas confirmadas com um único `<h1>`, `title`, `description`, `canonical`, Open Graph e Twitter Card próprios e consistentes.
- Revisão de acessibilidade: contraste, foco por teclado, `aria-label` e landmarks já atendiam ao padrão do projeto — nenhuma mudança adicional necessária além da limpeza acima.
- Todos os links internos das 4 páginas validados via automação (sem 404s), sem rolagem horizontal em 390/480/768/1024/1280/1440px.
- Workflow `.github/workflows/deploy.yml` (Sprint 0.2.2) não foi alterado.
- Nenhuma nova página, funcionalidade, formulário, Analytics ou domínio próprio foi implementado — Sprint dedicada exclusivamente a acabamento técnico (ver [DECISIONS.md](./DECISIONS.md)).
- **A partir desta versão, o site é considerado funcionalmente concluído.** Futuras alterações devem refletir mudanças reais no aplicativo GymLog (novas funcionalidades, publicação nas lojas, screenshots oficiais, domínio próprio), não novas funcionalidades do site em si.

## [0.5.0] — 2026-08-05

### Adicionado

- Conteúdo definitivo da página de Suporte (`src/pages/support.astro`): Suporte, Contato, Tempo de resposta, Antes de entrar em contato, Perguntas frequentes, Informações do projeto e Sugestões.
- `src/utils/support-content.ts` com o FAQ específico de atendimento (`SUPPORT_FAQ`), reaproveitando o tipo `FaqEntry` já existente em `home-content.ts`.
- Card "Informações do projeto", exibindo nome do app, versão do app (`SITE.appVersion`), versão do site (`package.json`), plataforma e licença — sem nenhum valor duplicado no código.
- SEO específico da página de Suporte: `title`, `description`, `canonical` e Open Graph próprios (via `Layout`).

### Observações

- Nenhum componente novo foi criado — a página reutiliza `Layout`, `Section`, `Container`, `FAQItem` e as classes `.legal-document` já existentes (ver [DECISIONS.md](./DECISIONS.md)).
- Esta é a última página institucional obrigatória do site. Todas as páginas (Home, Política de Privacidade, Termos de Uso, Suporte) têm conteúdo definitivo.
- Nenhum formulário de contato, backend, envio de e-mails, Analytics ou integração com GitHub foi implementado, conforme escopo desta Sprint.
- Responsividade e navegação validadas em 390px, 480px, 768px, 1024px, 1280px e 1440px, sem rolagem horizontal.

## [0.4.0] — 2026-08-05

### Adicionado

- Conteúdo definitivo dos Termos de Uso (`src/pages/terms.astro`): Introdução, Aceitação, Utilização do aplicativo, Responsabilidade do usuário, Armazenamento dos dados, Funcionalidades Premium, Limitação de responsabilidade, Propriedade intelectual, Alterações dos Termos e Contato.
- Seção "Funcionalidades Premium" preparada para uma futura monetização (linguagem condicional, sem preços ou planos definidos).
- Link cruzado entre Termos de Uso e Política de Privacidade, reforçando a coerência entre as duas páginas.
- SEO específico dos Termos: `title`, `description`, `canonical` e Open Graph próprios (via `Layout`).

### Alterado

- **E-mail oficial de suporte atualizado em todo o projeto**: de `suporte@gymlog.app` para `gymlog.support@gmail.com`, alterado em um único ponto (`SITE.supportEmail`, `src/utils/site.ts`) e propagado automaticamente para `Footer`, Política de Privacidade e Termos de Uso.
- Estilos de documento legal (antes locais em `privacy.astro`) extraídos para `src/styles/global.css` como classes `.legal-document`, reutilizadas por `privacy.astro` e `terms.astro` (ver [DECISIONS.md](./DECISIONS.md)).

### Observações

- Nenhuma referência ao e-mail antigo restou no projeto (confirmado por busca em todos os arquivos).
- Nenhuma funcionalidade Premium, assinatura, formulário de contato, Analytics ou sistema de consentimento foi implementada — apenas a preparação textual dos Termos.
- Página de Suporte segue com conteúdo temporário (ver [ROADMAP.md](./ROADMAP.md)).
- Responsividade e navegação (incluindo o novo link cruzado) validadas em 390px, 768px, 1024px, 1280px e 1440px, sem rolagem horizontal.

## [0.3.0] — 2026-08-05

### Adicionado

- Conteúdo definitivo da Política de Privacidade (`src/pages/privacy.astro`): Introdução, Dados coletados, Dados que não coletamos, Armazenamento, Compartilhamento de dados, Direitos do usuário, Segurança, Alterações nesta Política e Contato.
- SEO específico da página: `title`, `description`, `canonical` e Open Graph próprios (via `Layout`).

### Observações

- O texto reflete exclusivamente o comportamento atual do GymLog (100% offline, sem conta/login, sem servidores próprios, backup manual pelo usuário) — nenhuma funcionalidade inexistente foi mencionada (ver [DECISIONS.md](./DECISIONS.md)).
- E-mail de contato reaproveitado de `SITE.supportEmail` (`src/utils/site.ts`), ainda marcado como temporário — nenhum e-mail novo foi criado.
- Termos de Uso e Suporte seguem com conteúdo temporário (ver [ROADMAP.md](./ROADMAP.md)).
- Responsividade e navegação validadas em 390px, 768px, 1024px, 1280px e 1440px, sem rolagem horizontal.

## [0.2.2] — 2026-08-05

### Adicionado

- `.github/workflows/deploy.yml`: publicação automática no GitHub Pages a cada `git push` para `main`, usando o fluxo oficial do Astro (`withastro/action` + `actions/deploy-pages`).
- `src/utils/paths.ts` (`withBase`): garante que links internos e assets (favicon, imagem de Open Graph) funcionem corretamente sob o subcaminho do GitHub Pages.

### Alterado

- `astro.config.mjs`: `site`, `base` e `output` configurados definitivamente para `https://matheus-miotto.github.io/GymLog-Site/`.
- `Header`, `Footer` e `Layout`: todos os links internos e referências a assets (favicon, imagem de Open Graph) passaram a usar `withBase()`, em vez de caminhos absolutos fixos.

### Observações

- Build (`npm run build`) e navegação completa validados localmente simulando o `base` do GitHub Pages (`npm run preview`, que já serve em `/GymLog-Site/`), sem erros de console ou requisições quebradas.
- Nenhuma mudança de layout, conteúdo ou componente — Sprint dedicada exclusivamente à infraestrutura de publicação (ver [DECISIONS.md](./DECISIONS.md)).
- Domínio personalizado segue fora do escopo (ver [ROADMAP.md](./ROADMAP.md)).

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

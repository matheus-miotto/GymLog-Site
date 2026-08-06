# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.4.0] — 2026-08-05

Refinamento visual da Home — sprint de polimento, não de funcionalidade.
Objetivo: elevar a percepção de qualidade (espaçamento, tipografia,
cards, screenshots e hierarquia visual) sem alterar textos, arquitetura
ou paleta de cores.

### Alterado

- **Ritmo entre seções**: `Section` ganhou a prop opcional `tight` (reduz só o `padding-block-start`), usada na seção "Recursos" para eliminar o vão duplicado entre o fim do Hero e o início da seção seguinte — antes dois `padding-block` de `--space-3xl` (96px) somavam 192px; agora o total é 144px (48px mobile).
- **Hero**: hierarquia interna reorganizada para seguir marca → título → descrição → screenshots → botões também no layout de duas colunas (desktop) — os screenshots agora começam na altura do subtítulo, não do topo do bloco, então o olhar percorre título e descrição antes de encontrar as telas do app. Espaçamento entre blocos deixou de ser uniforme (`row-gap` único) e passou a ser deliberado por transição (`margin-bottom` individual por elemento).
- Título do Hero: `line-height` mais fechado (1.08 no desktop) para um tom mais "display type", como títulos grandes de produtos como Linear/Apple.
- Subtítulo do Hero: `max-width` ajustada (42ch/34ch → 42ch bem calibrado) para formar 3 linhas equilibradas em vez de 2 linhas muito longas ou 4 muito curtas.
- **Screenshots**: sombra da tela principal usa o novo token `--shadow-md` (mais profunda que a sombra padrão de cards), reforçando que é o elemento de maior destaque visual da página; telas laterais mantêm a sombra discreta original. Rotação e deslocamento das telas laterais aumentados (±4°→±5°, `--space-lg`→`--space-xl`) para uma composição mais dinâmica.
- **Cards de Recursos**: ícone passou a ficar dentro de um "chip" quadrado com fundo (`--color-bg-elevated`, `--radius-md`), em vez de flutuar sozinho — visual mais alinhado a um Design System coeso. Hover ganhou leve elevação (`translateY(-4px)`), além da borda/sombra já existentes.

### Adicionado

- Token `--shadow-md` em `theme.css` — sombra de maior profundidade, reservada para o elemento de maior destaque visual da página (hoje, a screenshot principal do Hero).

### Observações

- Nenhum texto, componente novo, biblioteca ou funcionalidade foi adicionado — sprint exclusivamente de refinamento visual.
- Build, ausência de rolagem horizontal (390–1440px), ausência de erros de console, troca de tema em runtime e hover dos cards validados nos dois temas após as mudanças.
- Ver [DECISIONS.md](./DECISIONS.md) para o racional de cada ajuste.

## [1.3.0] — 2026-08-05

O mockup ilustrativo do Hero foi substituído por capturas de tela reais
do aplicativo GymLog. Sem mudança de arquitetura, texto, paleta de
cores, Header, Footer, páginas institucionais ou SEO.

### Adicionado

- `src/components/ScreenshotShowcase.astro`: composição de 3 capturas reais do aplicativo (`treino`, `home`, `evolucao`) em arranjo escalonado (a tela central em destaque, as duas laterais levemente rotacionadas e deslocadas para baixo, criando profundidade) — inspirado na linguagem visual de Apple/Linear/Arc/Notion, sem copiar nenhuma delas literalmente.
- Capturas reais em `public/images/screenshots/{dark,light}/*.jpg` — a versão exibida (clara/escura) segue automaticamente o tema ativo do site (`data-theme` + `prefers-color-scheme`), sem JavaScript próprio: reaproveita os mesmos seletores já usados em `theme.css`.

### Alterado

- **Hero**: `<AppMockup />` substituído por `<ScreenshotShowcase />`.
- `HeroSection`: coluna do mockup ganhou um pouco mais de espaço em telas grandes (≥1024px, `grid-template-columns: 1fr 1.05fr`) para acomodar a composição de 3 telas — texto e demais proporções do Hero inalterados.

### Removido

- `src/components/AppMockup.astro` — sem nenhum uso após a substituição pelo `ScreenshotShowcase`; o placeholder ilustrativo do mockup deixou de fazer sentido agora que existem capturas reais.

### Observações

- Responsivo sem JavaScript: 1 captura no mobile (<768px), 2 no tablet (768–1023px), 3 no desktop (≥1024px) — controlado inteiramente por `display: none` por breakpoint.
- Cada captura é renderizada em duas versões (`dark`/`light`); a troca de tema já existente do site decide qual fica visível — nenhuma implementação paralela de tema foi criada.
- `width`/`height` reais de cada imagem (obtidos diretamente dos arquivos) evitam layout shift (CLS) no carregamento; a captura central da Hero usa `loading="eager"`, as demais `loading="lazy"`; todas usam `decoding="async"`.
- Build, ausência de rolagem horizontal (390–1440px), ausência de erros de console, ausência de links quebrados e troca de tema em tempo real (sem recarregar a página) validados nos dois temas.
- Ver [DECISIONS.md](./DECISIONS.md) para o racional de cada decisão (curadoria das 3 telas, ausência de moldura de celular falsa, custo aceito de buscar a imagem das duas variantes de tema na tela principal).

## [1.2.1] — 2026-08-05

Complemento da revisão de design (Sprint 1.2): a Home passa a ser
construída em torno do aplicativo, não em torno de texto. Sem novas
funcionalidades, sem mudança de paleta de cores.

### Adicionado

- `src/components/Logo.astro`: marca do GymLog (símbolo + wordmark) centralizada em um único componente, usada no `Header` e na Hero — antes o Header tinha apenas texto "GymLog", sem símbolo.
- Token `--font-size-2xl` (1.5rem) em `theme.css`, preenchendo o intervalo entre `xl` (1.25rem) e `3xl` (2rem) usado pelo wordmark grande da Hero.

### Alterado

- **Header**: logo ganhou o símbolo do GymLog ao lado do wordmark (antes só texto), dando mais presença de marca sem alterar a altura do cabeçalho.
- **Hero reestruturada** em torno da hierarquia marca → mensagem → interface → chamada para ação: a marca (símbolo + wordmark, em tamanho maior que o Header) passou a abrir a Hero; o mockup do smartphone passa a aparecer antes dos selos de loja também no layout empilhado (mobile), não só no desktop.
- `AppMockup`: moldura simplificada (bezel mais fino, sem preenchimento interno) e imagem passa a usar `object-fit: contain` — quando uma captura real for adicionada via `src`, ela é exibida com proporção preservada e sem corte, em vez de recortada (`cover`).

### Removido

- Placeholder abstrato do `AppMockup` (barras, "gráfico" de barras e linhas simulando uma tela) — não representava a interface real do aplicativo e é exatamente o tipo de "mockup genérico" que o briefing pediu para evitar.

### Observações

- **Sem capturas reais do aplicativo disponíveis nesta Sprint.** Em vez de simular uma tela (o que soaria falso) ou deixar a moldura vazia, o `AppMockup` sem `src` exibe apenas o símbolo do GymLog centralizado — um estado honesto de "aguardando conteúdo", não uma interface fake. Basta passar `src`/`alt` para o componente exibir a captura real; nenhuma outra mudança estrutural é necessária.
- Composição de screenshots (1 captura grande vs. 2 lado a lado vs. 3 sobrepostas) não foi decidida nesta Sprint — sem capturas reais para avaliar, a escolha mais responsável é preparar a estrutura mais simples (1 captura grande) e revisitar a composição quando as telas reais existirem. Ver [DECISIONS.md](./DECISIONS.md).
- Build, ausência de rolagem horizontal (390–1440px), ausência de erros de console e ausência de links quebrados validados nos dois temas após a mudança.

## [1.2.0] — 2026-08-05

Revisão crítica de design da Home — sprint de design review, não de
desenvolvimento. Objetivo: reduzir a percepção de "landing page gerada"
e aumentar a de "produto real". Nenhuma funcionalidade nova, nenhuma
mudança de paleta de cores.

### Alterado

- **Hero reescrito**: novo título "Sem conta. Sem nuvem. Só o seu treino." (antes "Treine melhor. Acompanhe sua evolução."), novo subtítulo, kicker "GYMLOG" removido (redundante com o logo do Header).
- **Seção "Recursos" reduzida de 8 para 3 itens** consolidados ("Registre cada treino", "Acompanhe sua evolução", "Organize em ciclos"), com heading próprio ("Feito para quem treina de verdade" em vez do rótulo genérico "Recursos").
- Três fatos de confiança (100% offline, sem criar conta, seus dados sob seu controle) migraram de cards na seção "Por que escolher o GymLog?" para uma lista compacta dentro do próprio Hero.
- `AppMockup`: sombra (`--shadow-sm`) agora permanente, não só no hover — reforça a composição do mockup sem inventar telas novas.
- Tagline do `Footer` trocada de "Treine melhor. Acompanhe sua evolução." para "Seu treino. Seus dados. Sempre com você." (mesma frase genérica citada como exemplo a evitar).
- `FeatureCard`/`FeatureGrid` simplificados: props `compact` e `upcoming` removidas (sem uso após a remoção da seção que as motivou).

### Removido

- Seção "Por que escolher o GymLog?" (7 cards) — absorvida pelo Hero e pelo novo heading de Recursos.
- Seção "Em desenvolvimento" (5 cards tracejados) — conteúdo de roadmap interno, não ajuda a primeira impressão de um visitante.
- Seção "Perguntas frequentes" da Home (4 itens) — duplicava fatos já cobertos pelo Hero e a maior parte do FAQ da página de Suporte.
- `src/components/ValueProp.astro` — sem nenhum uso após a remoção acima.
- 12 ícones não utilizados em `icons.ts` (`dumbbell`, `history`, `layout-dashboard`, `ruler`, `hard-drive`, `zap`, `crown`, `brain`, `gauge`, `bar-chart-3`, `refresh-cw`, `target`).

### Observações

- A Home caiu de ~20 cards espalhados em 3 seções quase idênticas para 3 cards + 3 itens de texto no Hero — ver diagnóstico completo em [DECISIONS.md](./DECISIONS.md).
- Paleta de cores, temas (Claro/Escuro/Seguir sistema) e demais páginas (Política, Termos, Suporte) não foram alterados.
- Build, links internos, ausência de rolagem horizontal (390–1440px) e ausência de erros de console validados nos dois temas após o redesign.
- Hierarquia de títulos da Home simplificada para 1 `h1` + 1 `h2` + 3 `h3` (antes eram 4 `h2` do mesmo peso visual).

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

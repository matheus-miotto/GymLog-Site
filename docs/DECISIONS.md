# Decisões Arquiteturais

Registro das decisões de arquitetura tomadas ao longo do projeto, com o
motivo por trás de cada uma. Novas decisões relevantes devem ser
adicionadas aqui nas Sprints em que forem tomadas.

## Sprint 1.0.0 — Acabamento final e congelamento da v1.0

### Sitemap via `@astrojs/sitemap`, com a página 404 filtrada

Instalada a integração oficial `@astrojs/sitemap` (v3.7.3), configurada em
`astro.config.mjs` com um `filter` excluindo `/404/` do resultado.

**Motivo**: o briefing pede explicitamente a integração oficial em vez de
uma solução manual. A página 404 não é conteúdo navegável e não deve ser
indexada nem listada — por isso o filtro, e também `noindex` na própria
página (ver abaixo). Validado que o `base` (`/GymLog-Site`) é aplicado
corretamente em todas as URLs geradas (checado no `dist/sitemap-0.xml`
após build).

### `Layout` ganhou a prop `noindex`, usada apenas em `404.astro`

Adicionada uma prop opcional `noindex?: boolean` ao `Layout`, que emite
`<meta name="robots" content="noindex, nofollow" />` quando `true`. É a
única página do site que a utiliza.

**Motivo**: uma página 404 não deveria ser indexada por buscadores nem
aparecer em resultados de busca — é uma prática de SEO padrão. Como o
`Layout` já centraliza todo o `<head>` do site, adicionar uma prop opcional
ali (em vez de duplicar tags `<head>` em `404.astro`) manteve a página 404
consistente com o restante do site sem duplicar lógica.

### `robots.txt` referencia o `sitemap-index.xml` sob o próprio subcaminho

`public/robots.txt` aponta para
`https://matheus-miotto.github.io/GymLog-Site/sitemap-index.xml`.

**Motivo/limitação conhecida**: como o site é um "repositório de projeto"
do GitHub Pages (não `matheus-miotto.github.io` na raiz), o `robots.txt`
só pode ser servido em `/GymLog-Site/robots.txt`, não em `/robots.txt` na
raiz do domínio `github.io`. Rastreadores que só verificam a raiz do
domínio (comportamento antigo, hoje incomum) podem não encontrar este
arquivo automaticamente — é uma limitação inerente à hospedagem escolhida
(GitHub Pages em subcaminho), não algo corrigível dentro deste projeto sem
adotar um domínio próprio (fora de escopo). Mecanismos modernos (Google
Search Console, submissão manual do sitemap) não dependem da raiz do
domínio.

### Botão da página 404 reaproveita o `Button` (primeiro uso real no site)

`404.astro` usa `<Button href={withBase("/")}>Voltar para o início</Button>`.

**Motivo**: o `Button` foi criado na Sprint 0.1 como parte da biblioteca
inicial de componentes, mas nunca havia sido usado em nenhuma página até
agora (`StoreBadge` resolveu o caso de uso da Home de forma mais
específica). A página 404 é exatamente o tipo de call-to-action simples
para o qual o `Button` foi desenhado — nenhuma nova variante ou alteração
foi necessária.

### Limpeza de código morto: dois ícones e quatro variáveis de tema removidos

Removidos de `src/utils/icons.ts`: os ícones `shield-check` e `smile`,
importados desde a Sprint 0.2 mas sem nenhum uso — sobras da seção
"Diferenciais", removida na Sprint 0.2.1 e substituída por "Por que
escolher o GymLog?" com um conjunto de ícones diferente.

Removidas de `src/styles/theme.css`: `--font-size-2xl`, `--font-size-4xl`,
`--font-weight-regular` e `--space-xs` — variáveis declaradas desde a
Sprint 0.1 mas nunca referenciadas por nenhum componente ou página
(confirmado varrendo todo `src/` em busca de `var(--nome-da-variável)`).

**Motivo**: pedido explícito desta Sprint ("remover código morto, imports
não utilizados, estilos não utilizados"), reforçado pelo caráter de
congelamento da v1.0 — manter apenas o que está de fato em uso reduz a
superfície de manutenção. Os tokens de breakpoint
(`--breakpoint-sm/md/lg/xl`) **não** foram removidos apesar de também não
serem referenciados em nenhum `var()`: eles têm uma justificativa
explícita e documentada desde a Sprint 0.1 (espelhados em
`src/utils/breakpoints.ts` para uso futuro em JavaScript), diferente das
demais variáveis removidas, que não tinham nenhuma razão documentada para
existir sem uso. As variantes `secondary`/`ghost` do `Button` também foram
mantidas mesmo sem uso atual: fazem parte da API pública do componente
(prop `variant`), não são código morto no mesmo sentido — permanecem
alcançáveis e prontas para uso, e removê-las reduziria a reutilização
futura do componente sem nenhum ganho real.

### `SITE.description` removida; `SITE.url` corrigida para a URL real

`SITE.description` foi removida de `src/utils/site.ts` — nunca era lida em
nenhum lugar do código (cada página já define sua própria `description`
específica passada ao `Layout`) e seu texto estava desatualizado ("Conteúdo
institucional em preparação", falso desde que todas as páginas passaram a
ter conteúdo definitivo). `SITE.url` foi corrigida de `https://gymlog.app`
(domínio fictício, nunca registrado) para `https://matheus-miotto.github.io`
— o mesmo valor do `site` em `astro.config.mjs`, usado apenas como
fallback defensivo caso `Astro.site` não esteja disponível.

**Motivo**: alinhado à revisão de "nenhuma informação fictícia" já seguida
desde a Sprint 0.3, e ao objetivo desta Sprint de eliminar código/dados
não utilizados ou incorretos antes do congelamento da v1.0.

## Sprint 0.5.0 — Página de Suporte

### Reaproveitamento total: nenhum componente novo criado

A página de Suporte reutiliza `Layout`, `Section`, `Container` e
`FAQItem` (já existente, criado para o FAQ da Home) e as classes
`.legal-document` (compartilhadas com Política de Privacidade e Termos de
Uso). O único elemento visual novo — o card "Informações do projeto" — foi
resolvido com um `<dl>` semântico e um pequeno bloco `<style>` local a
`support.astro`, sem virar componente.

**Motivo**: pedido explícito do briefing ("antes de criar qualquer
componente novo, verificar se algum componente existente já resolve o
problema") e reforçado pela observação de que este é o "acabamento" das
páginas institucionais obrigatórias — o próximo foco é o app em si, não
mais expandir a biblioteca de componentes do site. O card de informações
é usado uma única vez no projeto; criar um componente para um único uso
seria abstração prematura. Se um segundo caso de uso surgir no futuro
(outra lista de "rótulo: valor"), extrair um componente `InfoCard`
nesse momento será trivial, já que o CSS já está isolado num único bloco.

### FAQ do Suporte com dados próprios, reaproveitando o tipo `FaqEntry` da Home

`src/utils/support-content.ts` exporta `SUPPORT_FAQ`, com perguntas
específicas de atendimento (diferentes das perguntas do FAQ da Home).
O tipo é importado de `home-content.ts` (`import type { FaqEntry }`) em
vez de redeclarado.

**Motivo**: o conteúdo é diferente (perguntas de suporte vs. perguntas de
apresentação do produto), mas a *forma* dos dados é idêntica
(pergunta + resposta) — reaproveitar o tipo evita duas interfaces
idênticas competindo no projeto, sem forçar os dois FAQs a compartilhar
o mesmo array.

### Card "Informações do projeto" sem inventar uma licença

O campo "Licença" exibe "Proprietária — todos os direitos reservados", em
vez de nomear uma licença de código aberto (MIT, Apache etc.) ou omitir o
campo.

**Motivo**: não existe arquivo `LICENSE` no repositório, então afirmar uma
licença open source específica seria fictício. O texto escolhido apenas
repete, em outras palavras, o que os Termos de Uso já declaram na seção
"Propriedade intelectual" (código, marca e conteúdo pertencem ao
desenvolvedor do GymLog) — não é uma informação nova ou inventada.

## Sprint 0.4.0 — Termos de Uso e e-mail oficial

### Estilos de documento legal extraídos para `global.css`

Os estilos antes locais de `privacy.astro` (classe `.policy`) foram
renomeados para `.legal-document` e movidos para `src/styles/global.css`,
onde ficam disponíveis para qualquer página. `privacy.astro` e
`terms.astro` agora compartilham exatamente as mesmas regras CSS.

**Motivo**: o briefing desta Sprint exige que Termos de Uso e Política de
Privacidade tenham "mesma estrutura visual, mesma tipografia, mesmo
espaçamento, mesma organização". Duplicar o bloco `<style>` em cada
página garantiria isso apenas no momento da cópia — qualquer ajuste
futuro em uma página (ex.: espaçamento entre seções) exigiria lembrar de
replicar manualmente na outra, com risco real de as páginas divergirem
ao longo do tempo. Compartilhar uma única fonte de estilo elimina esse
risco por construção.

### Preparação para Premium com linguagem condicional, sem inventar planos

A seção "Funcionalidades Premium" dos Termos usa exclusivamente
linguagem condicional ("Caso o GymLog disponibilize..."), aborda
cobrança/cancelamento/período de teste apenas de forma genérica, e afirma
explicitamente que nenhum valor ou plano está definido nesta versão.

**Motivo**: pedido explícito do briefing — preparar os Termos para uma
futura monetização sem afirmar que ela já existe nem inventar preços.
Isso evita que os Termos precisem ser reescritos do zero quando/se um
plano Premium for lançado: bastará detalhar as condições específicas
dentro da seção já existente.

### E-mail de suporte: troca única em `site.ts`, sem duplicar a string em nenhum outro lugar

O e-mail `gymlog.support@gmail.com` foi escrito uma única vez, em
`SITE.supportEmail` (`src/utils/site.ts`). `Footer.astro`, `privacy.astro`
e o novo `terms.astro` sempre leem essa constante — nenhum deles contém a
string do e-mail escrita manualmente.

**Motivo**: já era a arquitetura estabelecida desde a Sprint 0.2.1; esta
Sprint apenas confirma seu valor prático — trocar o e-mail oficial do
projeto exigiu editar **um único arquivo** (`site.ts`), e a mudança se
propagou automaticamente para as 4 páginas do site. Validado via busca
por `suporte@gymlog.app` (e-mail antigo) em todo o projeto após a
alteração: nenhuma ocorrência restante.

## Sprint 0.3.0 — Política de Privacidade

### Conteúdo escrito diretamente em `privacy.astro`, sem arquivo de dados em `src/utils/`

Ao contrário do conteúdo da Home (`FEATURES`, `VALUE_PROPS`, `FAQ` em
`home-content.ts`), o texto da Política de Privacidade foi escrito
diretamente no markup de `src/pages/privacy.astro`, como HTML semântico
(`h2`, `p`, `ul`) dentro de um único `<article>`.

**Motivo**: a convenção de extrair conteúdo para `src/utils/*.ts` existe
para dados estruturados e repetíveis (cards com ícone+título+descrição,
perguntas e respostas). A Política de Privacidade é texto corrido de
política — modelá-la como array de objetos (`{ heading, paragraphs, list
}`) apenas reproduziria HTML dentro de strings JavaScript, dificultando a
leitura e a edição do texto legal. Para este tipo de conteúdo, escrever
diretamente como HTML na página é mais direto e continua fácil de revisar
(cada seção é um `h2` + parágrafos/listas, na ordem em que aparece na
página).

### Uma única `<Section>`/`<Container>` envolvendo todo o documento

Diferente da Home (que empilha várias seções de marketing, cada uma com
`padding` vertical generoso via `Section.astro`), a Política de
Privacidade usa **uma única** `Section`/`Container`, com os tópicos
organizados como `h2` dentro de um `<article>` contínuo.

**Motivo**: a Política é um documento para ler de forma corrida, não uma
página de apresentação com blocos visuais distintos. Empilhar oito
`Section` (cada uma com ~6rem de respiro vertical) tornaria a leitura
fragmentada e a página desproporcionalmente longa. O espaçamento entre
tópicos foi resolvido com uma regra local (`margin-top` nos `h2` dentro de
`.policy`), suficiente para separar visualmente as seções sem os
intervalos de uma landing page.

### Dados de contato reaproveitados de `SITE.supportEmail`

O e-mail exibido na seção "Contato" vem de `SITE.supportEmail`
(`src/utils/site.ts`), o mesmo já usado no `Footer` — nenhum e-mail novo
foi inventado.

**Motivo**: pedido explícito do briefing ("utilizar a constante
centralizada já criada em `site.ts`"). Como esse valor já está marcado no
código como temporário (`// Temporário — atualizar quando houver e-mail
oficial de suporte`), atualizá-lo lá no futuro propaga automaticamente
para o Footer e para esta página, sem precisar editar a Política.

## Sprint 0.2.2 — Publicação automática no GitHub Pages

### `site` e `base` definitivos, sem valores temporários

`astro.config.mjs` foi configurado com:

```js
site: 'https://matheus-miotto.github.io',
base: '/GymLog-Site',
output: 'static',
```

O usuário e o nome do repositório foram confirmados a partir do remote Git
já configurado no projeto (`origin` apontando para
`github.com/matheus-miotto/GymLog-Site`), conforme a documentação oficial
do Astro para GitHub Pages: como o repositório **não** é do tipo
`<usuário>.github.io` (é um repositório de projeto), `site` recebe apenas
o domínio do GitHub Pages e `base` recebe `/GymLog-Site` — sem essa
combinação, o site funcionaria apenas na raiz do domínio, o que não é o
caso aqui.

**Motivo de não haver uma segunda opção considerada**: a alternativa
seria publicar em um domínio próprio (`base: '/'` + `public/CNAME`), mas
domínio personalizado está explicitamente fora do escopo desta Sprint.

### Helper `withBase()` centralizando o prefixo de `base`

Como `base` passou a ser um subcaminho (`/GymLog-Site`), todo `href`/`src`
absoluto fixo (`"/privacy"`, `"/favicon.svg"`, `"/images/og-home.png"`)
pararia de funcionar em produção — apontaria para a raiz do domínio do
GitHub Pages, não para dentro do subcaminho do repositório. Em vez de
espalhar `import.meta.env.BASE_URL` manualmente em cada componente, foi
criado `src/utils/paths.ts` com uma função `withBase(path)` única, usada
em `Layout`, `Header`, `Footer` e `index.astro`.

**Motivo**: consistente com a convenção já adotada no projeto de
centralizar lógica reaproveitável em `src/utils/` (ver `site.ts`,
`icons.ts`). Uma única função testável evita repetir a mesma lógica de
normalização (barra inicial/final) em múltiplos arquivos e reduz o risco
de esquecer o prefixo em um link novo no futuro.

Importante: `Astro.url.pathname` **já inclui** o `base` automaticamente
(comportamento confirmado via build local — ver `docs/README.md`), então
`canonical`, `og:url` e `og:image` **não** precisam passar por
`withBase()` na própria URL final — apenas o caminho relativo do
`ogImage` passado para o `Layout` precisa (ele é resolvido depois contra
`Astro.site`).

### Workflow oficial `withastro/action`, sem workflow customizado

`.github/workflows/deploy.yml` usa o fluxo oficial recomendado pela
documentação do Astro para GitHub Pages: `actions/checkout` →
`withastro/action` (instala dependências, roda `astro build` e faz upload
do artefato) → `actions/deploy-pages`.

**Motivo**: o projeto não usa nenhum passo de build especial (sem
adapter, sem monorepo, sem variáveis de ambiente de build) — o template
oficial atende integralmente, e o próprio briefing desta Sprint pede para
não criar um workflow customizado quando o oficial for suficiente. A
alternativa seria montar manualmente os passos
`actions/upload-pages-artifact` + `actions/deploy-pages` com `npm ci` e
`npm run build`; foi descartada por ser estritamente mais verbosa sem
nenhum ganho, já que `withastro/action` faz exatamente isso internamente.

## Sprint 0.2.1 — Acabamento da Home

### Seção "Diferenciais" substituída por "Por que escolher o GymLog?"

A seção "Diferenciais" da Sprint 0.2 (chips curtos: ícone + rótulo) foi
removida e seu conteúdo incorporado — de forma mais completa — à nova
seção "Por que escolher o GymLog?" (`VALUE_PROPS` em `home-content.ts`),
que traz ícone + título + uma frase explicando a filosofia por trás de
cada ponto.

**Motivo**: as duas seções tratavam essencialmente do mesmo assunto
(100% Offline, interface rápida, histórico completo apareciam em ambas).
Manter as duas lado a lado na Home geraria repetição de conteúdo bem
próxima uma da outra. A nova seção aprofunda o mesmo conteúdo com uma
narrativa mais madura, alinhada ao pedido desta Sprint de "transmitir a
filosofia do produto, não apenas listar funcionalidades".

### `FeatureCard` ganhou a prop `upcoming`, reaproveitada na seção "Em desenvolvimento"

Em vez de criar um componente novo para a seção "Em desenvolvimento", o
`FeatureCard` (já usado em "Recursos") ganhou uma prop `upcoming`, que
aplica borda tracejada e cores neutras — deixando claro visualmente que
aquele item ainda não está disponível, sem depender de texto adicional.

**Motivo**: mesmo padrão estrutural (ícone + título), mudando apenas o
tratamento visual conforme o status do item. Evita duplicar componente
para uma variação puramente visual.

### `AppMockup`: ilustração substituível sem alterar a estrutura da Home

O Hero ganhou uma ilustração (`AppMockup.astro`) dentro de uma moldura de
smartphone. Sem a prop `src`, o componente desenha um placeholder
abstrato (barras representando progresso/histórico) via CSS puro — sem
nenhuma imagem, portanto sem custo de download. Quando a captura oficial
do aplicativo existir, basta passar `src` (e `alt`) para o componente
trocar automaticamente o placeholder por uma `<img>` dentro da mesma
moldura, na mesma posição do Hero.

**Motivo**: atende diretamente ao pedido de usar um mockup temporário que
"facilite a futura substituição pela captura oficial sem necessidade de
alterar a estrutura da página".

### Menu mobile via "checkbox hack" (100% CSS, sem JavaScript)

O menu hambúrguer do `Header` usa um `<input type="checkbox">` oculto
(mas mantido focável) e um seletor `:checked ~` para mostrar/ocultar a
navegação e alternar entre os ícones `menu`/`x`. Nenhum JavaScript é
usado.

**Motivo**: segue a mesma filosofia já aplicada ao FAQ (`<details>`) —
manter a Home extremamente leve, sem JavaScript desnecessário — e atende
explicitamente ao pedido de não usar bibliotecas externas para esse
menu. Trade-off consciente: como não há JavaScript, o atributo
`aria-expanded` do botão não é atualizado dinamicamente; o rótulo
(`aria-label`) permanece estático. Se uma Sprint futura exigir esse nível
de refinamento de acessibilidade, um pequeno script poderá ser
adicionado especificamente para isso.

### Contraste de `--color-text-muted` ajustado para atender WCAG AA

O tom `--color-text-muted` (usado em textos pequenos e secundários, como
o rodapé) foi alterado de `#71717a` para `#85858c`.

**Motivo**: o valor anterior produzia contraste de ~4.1:1 sobre
`--color-bg`, abaixo do mínimo de 4.5:1 exigido pelo WCAG AA para texto
normal. O novo valor mede ~5.4:1 sobre `--color-bg` e ~4.75:1 sobre
`--color-surface`, atendendo ao critério com margem em ambos os fundos
usados no site.

### Imagem de Open Graph gerada localmente, sem adicionar dependência ao projeto

A imagem `public/images/og-home.png` (1200×630) foi gerada renderizando
um HTML autocontido (mesma paleta do tema) com o Chromium do Playwright,
usado apenas como ferramenta pontual de build — o Playwright **não** foi
adicionado a `package.json`.

**Motivo**: SVG como `og:image` tem suporte inconsistente em redes
sociais (Facebook/LinkedIn geralmente não renderizam), então uma imagem
raster é necessária. Gerar a imagem localmente evitou adicionar uma
dependência pesada (Playwright) ao projeto apenas para produzir um único
arquivo estático.

## Sprint 0.2 — Home Page

### Ícones via `lucide-static`, sem JavaScript em runtime

Optou-se pelo pacote [`lucide-static`](https://www.npmjs.com/package/lucide-static),
que distribui apenas arquivos `.svg` puros (sem componente JS). Cada ícone é
importado como texto (`?raw`) em `src/utils/icons.ts` e injetado inline pelo
componente `Icon.astro`.

**Motivo**: atende ao pedido de usar uma biblioteca de ícones leve e amplamente
utilizada (Lucide), mantendo a Home extremamente leve — nenhum JavaScript é
enviado ao navegador apenas para exibir ícones, e a cor de cada ícone segue
`currentColor`, herdando o tema automaticamente.

### Conteúdo textual da Home separado em `src/utils/home-content.ts`

Os textos de Recursos, Diferenciais e FAQ foram extraídos para um arquivo de
dados tipado (`FEATURES`, `DIFFERENTIALS`, `FAQ`), em vez de ficarem
hardcoded dentro de `index.astro`.

**Motivo**: a Home deve durar até a v1.0 recebendo apenas ajustes pontuais.
Separar conteúdo de apresentação permite editar textos, ícones ou adicionar
itens sem tocar em markup ou estilo.

### `FeatureCard` com variante `compact` reaproveitada em Diferenciais

Em vez de criar um componente paralelo para a seção Diferenciais, o mesmo
`FeatureCard` ganhou uma prop `compact` que remove a descrição longa e
organiza o conteúdo em linha.

**Motivo**: evitar duplicação de componente para um padrão visual muito
semelhante (ícone + texto), conforme orientação de não criar componentes
além do necessário.

### FAQ com `<details>`/`<summary>` nativos

O acordeão de perguntas frequentes (`FAQItem.astro`) usa os elementos HTML
nativos `<details>`/`<summary>`, sem nenhum JavaScript.

**Motivo**: mantém a página totalmente funcional e acessível com zero JS,
alinhado ao requisito de performance e à orientação de evitar JavaScript
desnecessário.

### Selos de loja (`StoreBadge`) como botões desabilitados, não links

Os selos "Em breve na App Store" / "Em breve no Google Play" são renderizados
como `<button disabled>`, e não como links (`<a href="#">`).

**Motivo**: nesta Sprint não há destino real para esses selos. Um `href="#"`
criaria um link "morto" (comportamento inesperado ao clicar); um botão
desabilitado comunica visualmente e semanticamente que a ação ainda não está
disponível, e poderá ser trocado por um link real na Sprint em que os apps
forem publicados nas lojas.

### `Layout`: título não duplica o nome do site quando já o contém

A regra de título do `Layout` (`src/layouts/Layout.astro`) foi ajustada: se o
`title` informado já começar com o nome do site (`GymLog`), ele é usado como
está; caso contrário, recebe o sufixo ` · GymLog` (comportamento já existente
desde a Sprint 0.1).

**Motivo**: a Home agora recebe um título de SEO completo e definitivo
(`"GymLog — Registre treinos e acompanhe sua evolução física"`); sem o
ajuste, o Layout duplicaria o nome do site no final do título.

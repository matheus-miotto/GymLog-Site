# Decisões Arquiteturais

Registro das decisões de arquitetura tomadas ao longo do projeto, com o
motivo por trás de cada uma. Novas decisões relevantes devem ser
adicionadas aqui nas Sprints em que forem tomadas.

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

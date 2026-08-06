# Decisões Arquiteturais

Registro das decisões de arquitetura tomadas ao longo do projeto, com o
motivo por trás de cada uma. Novas decisões relevantes devem ser
adicionadas aqui nas Sprints em que forem tomadas.

## Sprint 1.4.0 — Refinamento visual da Home

Sprint de polimento puro: nenhuma seção nova, nenhum texto alterado.
O objetivo foi auditar a Home inteira (espaçamento, tipografia, cards,
screenshots, hierarquia) e refinar o que já existia. Resumo abaixo.

### `tight` como prop, não como mudança global de `Section`

O maior problema de espaçamento encontrado na auditoria: o fim do Hero
e o início de "Recursos" somavam dois `padding-block` de 96px (o token
`--space-3xl`, usado por todo `Section` do site) — um vão de 192px,
visivelmente maior que qualquer outro respiro da página. `Section` é
compartilhado por **todas** as páginas (Home, Política, Termos,
Suporte, 404); reduzir `--space-3xl` ou o padding base de `Section`
diretamente mudaria o ritmo vertical de páginas que a Sprint não pediu
para tocar. Em vez disso, `Section` ganhou uma prop opcional `tight`
(reduz só `padding-block-start`, default `false`) — todas as páginas
que não passam essa prop continuam pixel-idênticas a antes; só a seção
"Recursos" da Home usa `tight`.

**Motivo**: a Sprint pediu explicitamente para não alterar arquitetura
e focar na Home. Uma prop opcional aditiva, com default que preserva o
comportamento atual, é uma mudança local e reversível — o oposto de
editar um token global usado por 5 páginas para resolver um problema
de uma seção específica de uma delas.

### Screenshots reposicionadas: de "centralizadas no bloco" para "depois da descrição"

Antes, a `grid-area` das screenshots ocupava todas as linhas do Hero
(marca, título, subtítulo, pontos de confiança, botões) e ficava
centralizada verticalmente nesse espaço inteiro — na prática, a tela
principal aparecia ao lado do título e do subtítulo ao mesmo tempo, sem
uma relação clara de "o que vem depois do quê". O briefing pediu uma
ordem de leitura específica: logo → título → descrição → screenshots →
botões. Para expressar isso mesmo no layout de duas colunas do desktop,
a área das screenshots agora começa na linha do subtítulo (não na da
marca/título) — `grid-template-areas` deixa uma célula vazia (`.`) nas
linhas de marca e título da segunda coluna.

**Motivo**: em duas colunas, é impossível ter uma ordem de leitura
100% linear (marca/título e screenshots sempre vão aparecer lado a
lado em algum ponto) — mas é possível controlar *em qual altura* cada
elemento aparece. Fazer a screenshot "nascer" na altura do subtítulo
em vez de na altura da marca aproxima o layout da leitura pedida: o
olhar encontra título e descrição isolados por um instante antes das
telas aparecerem.

### Duas sombras, não uma: `--shadow-md` só para o elemento principal

`--shadow-sm` (a sombra padrão de hover de cards) já era usada em todo
lugar — inclusive nas screenshots. Isso achatava a hierarquia visual:
cards de "Recursos" e as telas do aplicativo, o elemento que deveria
ser o maior destaque da página, tinham a mesma profundidade. Criamos
`--shadow-md` (mais forte) só para a tela principal da composição; as
duas telas laterais continuam com `--shadow-sm`.

**Motivo**: o briefing pediu "apenas um foco principal por seção" e
para refinar especificamente a profundidade das screenshots. Duas
sombras diferentes, uma para o elemento em destaque e outra para os
elementos de apoio, comunica essa hierarquia sem precisar de nenhum
elemento decorativo novo (glow, gradiente etc.) — que o projeto já
evita desde a Sprint 1.2.

### Espaçamento do Hero: de `row-gap` uniforme para margens deliberadas

O Hero antes usava um único `row-gap` para todas as transições (marca
→título, título→subtítulo, subtítulo→ações). Passou a usar
`margin-bottom` individual por elemento — maior entre título e
subtítulo (`--space-sm`) do que entre marca e título (`--space-md`), e
maior ainda depois do subtítulo e depois das screenshots (`--space-lg`)
antes de pontos de confiança e botões.

**Motivo**: o briefing pediu que "o usuário perceba hierarquia clara
apenas pelo espaçamento" — um `row-gap` uniforme comunica que todos os
elementos têm a mesma relação entre si, o que não é verdade (título e
subtítulo são um par; pontos de confiança e botões são outro,
secundário). Espaçamento desigual e intencional é o que faz esses
agrupamentos ficarem visíveis sem nenhum texto ou marcador adicional.

## Sprint 1.3.0 — Screenshots reais no lugar do mockup

Capturas reais do aplicativo GymLog ficaram disponíveis
(`public/images/screenshots/{dark,light}/*.jpg`), tornando o mockup
ilustrativo do `AppMockup` (Sprint 1.2.1) obsoleto — o próprio briefing
pediu para substituí-lo completamente. Resumo das decisões abaixo.

### Troca de tema das screenshots: 2 `<img>` por tela, não `<picture>`

Cada uma das 3 telas da composição é renderizada como dois elementos
`<img>` (um `dark`, um `light`); qual fica visível é decidido por CSS
puro, usando os mesmos seletores que `theme.css` já usa para cores
(`[data-theme="light"]`, e `@media (prefers-color-scheme: light)` para
quando não há tema salvo). A alternativa mais óbvia — um `<picture>`
com `<source media="(prefers-color-scheme: dark)">` — foi descartada:
`media` em `<source>` só reage a media queries reais (viewport, SO), e
o GymLog tem um terceiro estado ("claro"/"escuro" escolhidos
manualmente, persistidos em `localStorage`, que **sobrepõem** a
preferência do sistema). Um usuário com o SO em modo claro que escolheu
"Escuro" manualmente no site precisa ver as screenshots escuras — isso
só é possível espelhando o mesmo `data-theme` que já dirige as
cores, não reagindo à preferência do sistema diretamente.

**Motivo**: o briefing pediu explicitamente para reaproveitar o sistema
de temas existente, não criar uma implementação paralela. `<picture>` +
`prefers-color-scheme` seria, na prática, um segundo sistema de tema,
ignorando a escolha manual do usuário justamente no elemento mais
vistoso da Home.

**Custo aceito**: a tela central (`home`) tem as duas variantes
(`dark`+`light`) carregadas com `loading="eager"`, já que não é
possível saber em build time (site estático) qual tema o visitante
escolherá em tempo de execução — carregar as duas garante que a
imagem certa já esteja pronta assim que o tema for aplicado, sem
flash de imagem ausente. Isso custa uma imagem extra (~algumas dezenas
de KB) só na tela principal; as duas telas laterais usam
`loading="lazy"` nas duas variantes, então esse custo não se repete 3x.

### Por que só 3 das 5 capturas disponíveis foram usadas

`public/images/screenshots/` tem 5 telas (`home`, `treino`,
`exercicios`, `evolucao`, `perfil`); a composição usa 3: `treino`
(esquerda), `home` (centro), `evolucao` (direita). `exercicios` e
`perfil` continuam disponíveis em `public/` para uso futuro (ex.: uma
seção mais adiante na Home, ou a página de Suporte), mas não foram
encaixadas nesta composição.

**Motivo**: o briefing pediu exatamente 3 telas no desktop. As 3
escolhidas mapeiam diretamente para os 3 cards já existentes na seção
"Recursos" logo abaixo ("Registre cada treino", "Acompanhe sua
evolução", tela inicial cobrindo a visão geral/organização) — a Hero
mostra o produto, a seção seguinte nomeia o que foi mostrado. Adicionar
uma 4ª ou 5ª tela só para usar todos os arquivos disponíveis seria
"encher espaço", o oposto do princípio "menos é melhor" já estabelecido
na Sprint 1.2.0.

### Sem moldura de celular

O `AppMockup` anterior desenhava um bezel (moldura fina simulando um
smartphone) ao redor do conteúdo. O `ScreenshotShowcase` não tem
moldura alguma — cada captura é exibida com apenas `border-radius`
(igual ao raio de borda do próprio app), uma borda de 1px discreta e
`box-shadow` sutil (`--shadow-sm`, o mesmo token já usado em todo o
projeto).

**Motivo**: o briefing foi explícito — "não criar molduras falsas de
celular... as screenshots são o próprio produto". As capturas já têm a
barra de status e os cantos arredondados do aparelho real dentro da
própria imagem; uma moldura adicional por cima seria redundante e
competiria visualmente com o conteúdo.

### Profundidade sem sobreposição física

A composição de 3 telas no desktop usa deslocamento vertical
(`translateY`) e rotação leve (±4°) nas duas telas laterais, mantendo a
central alinhada e sem rotação — cria a sensação de profundidade
("leve profundidade", pedida no briefing) sem sobrepor fisicamente as
imagens (sem `margin` negativa, sem `z-index` competindo por espaço).

**Motivo**: sobreposição literal (uma tela cobrindo parte da outra)
aumenta o risco de recorte inesperado em larguras intermediárias e de
overflow horizontal — um dos requisitos explícitos era "sem overflow
horizontal" em qualquer largura. Deslocamento vertical com espaçamento
(`gap`) preservado é visualmente quase tão dinâmico e é robusto em
qualquer largura de tela, incluindo os breakpoints intermediários entre
tablet e desktop.

## Sprint 1.2.1 — Humanização da Home (complemento da Sprint 1.2)

Complemento direto da revisão de design anterior. O diagnóstico desta
Sprint: a Home estava estruturalmente melhor (ver Sprint 1.2.0 abaixo),
mas ainda comunicava o GymLog inteiramente por texto — nenhum elemento
da própria marca ou do próprio aplicativo tinha presença visual real.
Resumo das decisões abaixo.

### Por que a marca ganhou um símbolo, e não só um logo maior

O Header tinha apenas o texto "GymLog" — nenhum símbolo, nenhuma forma
reconhecível fora do texto. Criamos `Logo.astro` reaproveitando o
mesmo traço do `favicon.svg` (já existente, já é a identidade visual do
projeto) como um símbolo de marca reutilizável, e não apenas aumentamos
o tamanho da fonte do wordmark.

**Motivo**: aumentar só o tamanho do texto "GymLog" reforça a marca
tanto quanto gritar mais alto reforça um argumento — maior, mas não mais
memorável. Um símbolo consistente (mesmo traço no Header, pequeno, e na
Hero, grande) é o que fica na memória; foi por isso que reaproveitamos o
próprio favicon como fonte da verdade do símbolo, em vez de desenhar um
novo.

### Ordem de leitura da Hero: marca → mensagem → interface → CTA

A Hero foi reestruturada com `grid-template-areas` para que a ordem
visual seja marca, título, subtítulo, mockup do aplicativo, fatos de
confiança e, por fim, os selos de loja — nessa ordem tanto no layout
empilhado (mobile) quanto no layout em duas colunas (desktop). Antes, o
mockup só aparecia visualmente ao lado do texto no desktop; no mobile
empilhado, ele caía depois dos selos de loja (a chamada para ação
aparecia antes do usuário ver a interface do aplicativo).

**Motivo**: o briefing pediu explicitamente essa ordem de impacto
visual. A ordem de leitura no HTML permanece marca → título → subtítulo
→ fatos de confiança → CTA → mockup (a imagem, com `alt` descritivo, vem
por último no documento) — quem usa leitor de tela recebe o discurso
completo antes da imagem ilustrativa; `grid-template-areas` reordena
apenas a apresentação visual, sem prejudicar a ordem de leitura.

### Mockup: sem tela real disponível, mas também sem tela falsa

O `AppMockup` anterior (Sprint 0.2.1) desenhava barras, um "gráfico" de
barras e linhas simulando uma tela de evolução — um placeholder
abstrato, mas ainda assim uma *simulação de interface*. O briefing desta
Sprint pediu explicitamente para não usar mockups genéricos nem imagens
de banco. Como nenhuma captura real do aplicativo está disponível ainda,
a opção que sobra — e a única honesta — é não fingir uma interface:
`AppMockup` sem `src` agora mostra apenas o símbolo do GymLog centralizado
sobre um fundo neutro, dentro da mesma moldura que vai receber a captura
real.

**Motivo**: um "gráfico" falso comunica uma mentira pequena, mas ainda
assim uma mentira — o usuário vê barras que não representam nenhum dado
real do aplicativo. Um símbolo de marca centralizado comunica "aqui vai
aparecer o aplicativo em breve", sem fingir ser algo que não é. Quando a
captura real existir, basta passar `src`/`alt` para `AppMockup` — a
moldura, a posição na Hero e o restante do layout não precisam mudar.

### Moldura do mockup simplificada, não mais decorada

O `AppMockup` antigo tinha padding interno considerável ao redor do
conteúdo (pensado para o placeholder abstrato "respirar" dentro da
moldura). A nova versão usa uma moldura fina, sem padding interno, com
`object-fit: contain` na imagem — para que, quando a captura real for
adicionada, ela preencha a moldura de borda a borda, com proporção
preservada e sem corte.

**Motivo**: o briefing pediu explicitamente para evitar "molduras
exageradas" e priorizar que o usuário veja a interface. Um bezel grosso
ou muito decorado chamaria atenção para a moldura em vez de para o
conteúdo — o oposto do que "mostrar o produto" pede.

### Composição de screenshots (1 grande / 2 lado a lado / 3 sobrepostas): decisão adiada

O briefing deu liberdade para escolher a composição que melhor
apresentasse o aplicativo. Sem nenhuma captura real disponível para
avaliar qual composição fica melhor com conteúdo de verdade, decidimos
não especular: a estrutura atual comporta uma única captura grande (a
opção mais simples e a que funciona melhor em qualquer largura de tela,
inclusive mobile). Compor 2 capturas lado a lado ou 3 sobrepostas fica
para quando houver telas reais para testar — não faz sentido construir
uma composição de sobreposição para uma imagem que ainda não existe.

**Motivo**: construir uma composição elaborada em cima de conteúdo
hipotético seria decidir no escuro — exatamente o tipo de escolha que só
faz sentido revisitar com dados reais na mão.

## Sprint 1.2.0 — Revisão de design da Home

Sprint de revisão crítica, não de desenvolvimento. Nenhuma funcionalidade
foi adicionada; o objetivo foi reduzir a Home a apenas o que comunica com
clareza, eliminando os padrões que fazem um site parecer "gerado", não
"desenhado". Resumo do diagnóstico e das decisões abaixo.

### Diagnóstico: 3 grids de card quase idênticos, com conteúdo duplicado

A Home tinha "Recursos" (8 cards), "Por que escolher o GymLog?" (7 cards)
e "Em desenvolvimento" (5 cards) — 20 caixas no mesmo padrão visual
(ícone + título + borda), seguidas de um FAQ (4 perguntas) que repetia os
mesmos fatos já ditos nas seções acima. "Backup local" aparecia
*literalmente* em duas seções diferentes; "Histórico completo" também.
O FAQ da Home ainda duplicava 3 das 5 perguntas do FAQ da página de
Suporte. O Hero usava textualmente "Treine melhor." — um dos exemplos
citados no briefing como frase a evitar.

**Motivo de agir**: esse é exatamente o padrão de landing page "gerada
por IA" citado no briefing — muitas seções repetindo a mesma estrutura,
conteúdo se sobrepondo, nenhuma hierarquia tipográfica (todo `h2` do
mesmo tamanho), sensação de checklist. Cada card adicional child de uma
seção genérica ("Recursos") sem curadoria não comunica confiança — pelo
contrário, sinaliza "preenchimento de espaço".

### Hero reescrito com uma mensagem específica, não genérica

Novo texto: **"Sem conta. Sem nuvem. Só o seu treino."** (título) +
"Registre treinos, cargas e repetições, e acompanhe sua evolução ao
longo do tempo — tudo direto no seu aparelho, no seu ritmo." (subtítulo).
O "kicker" ("GYMLOG" em texto pequeno acima do título) foi removido — o
logo já está no Header, um parágrafo inteiro dedicado a repetir o nome
da marca duas vezes na dobra inicial era redundância pura, não reforço
de marca.

**Motivo**: em vez de "treine melhor" (poderia ser qualquer app de
treino do mundo), a nova headline usa o diferencial mais concreto e
verificável do GymLog — não precisa de conta, não depende de nuvem — em
uma estrutura de negação-depois-afirmação (duas frases negativas em
branco, a frase positiva em laranja) que cria ênfase tipográfica real,
não decorativa.

### Três fatos de confiança migraram das seções para dentro do Hero

Os itens "100% Offline", "Sem necessidade de criar conta" e "Seus dados
permanecem no dispositivo" — antes 3 dos 7 cards de "Por que escolher o
GymLog?" — viraram uma lista compacta de 3 itens (ícone pequeno + texto
curto, sem card, sem descrição) dentro do próprio Hero, entre o
subtítulo e os selos de loja.

**Motivo**: são exatamente os fatos que constroem confiança imediata —
faz sentido que apareçam nos primeiros segundos de leitura, não depois
de rolar a página. Ao mesmo tempo, isso elimina a necessidade de uma
seção inteira (com `Section`, `Container`, heading, grid) só para dizer
3 frases curtas — usar o peso visual de uma seção completa para tão
pouco conteúdo era desproporcional.

### Seção "Recursos" reduzida de 8 para 3 itens, com heading específico

`FEATURES` foi reescrita: "Registre cada treino" (cobre registro,
cargas, repetições, exercícios), "Acompanhe sua evolução" (cobre
histórico, dashboard, avaliações corporais, evolução física) e "Organize
em ciclos" (ciclos de treino). O heading da seção passou de "Recursos"
(rótulo genérico, o nome mais comum de seção em qualquer landing page)
para **"Feito para quem treina de verdade"**.

**Motivo**: 8 cards de peso igual não comunicam prioridade — parece uma
lista exaustiva de funcionalidades, não uma escolha editorial. Agrupar
em 3 pilares força a decidir o que realmente importa, e cada descrição
ficou mais rica (cobre 2-3 conceitos antigos em uma frase) em vez de mais
rasa. O heading "Feito para quem treina de verdade" também absorve a
frase de posicionamento que existia como um card isolado em "Por que
escolher" ("Desenvolvido para quem realmente treina") — em vez de *dizer*
que é para quem treina sério, a seção *mostra* isso através de
vocabulário específico ("cargas", "periodize", "avaliações corporais").

### Seções "Por que escolher o GymLog?", "Em desenvolvimento" e FAQ removidas da Home

"Por que escolher o GymLog?" foi absorvida (parte no Hero, parte no novo
heading de Recursos — ver acima). "Em desenvolvimento" (5 cards
tracejados de funcionalidades futuras) e o FAQ (4 perguntas) foram
removidos por completo, não substituídos.

**Motivo**: "Em desenvolvimento" é conteúdo de roadmap interno, não
material de primeira impressão — não ajuda um visitante a entender ou
confiar no produto, e é um padrão típico de página gerada ("aqui está
tudo que ainda não existe"). O FAQ da Home duplicava fatos já
estabelecidos pelo próprio Hero (offline, sem conta, backup) *e*
duplicava a maior parte do FAQ da página de Suporte — mantê-lo nos dois
lugares não agregava informação nova, só repetia. A página de Suporte
segue sendo o lugar correto e único para essas perguntas.

### Componentes/dados removidos por decorrência direta, não por "faxina" avulsa

Como consequência direta das remoções acima, ficaram sem nenhum uso:
`ValueProp.astro` (componente inteiro, apagado), as props `compact` e
`upcoming` de `FeatureCard`/`FeatureGrid` (removidas, o componente voltou
a ter uma única forma), e 12 ícones em `icons.ts`
(`dumbbell`, `history`, `layout-dashboard`, `ruler`, `hard-drive`, `zap`,
`crown`, `brain`, `gauge`, `bar-chart-3`, `refresh-cw`, `target`).

**Motivo**: diferente da limpeza de código morto da Sprint 1.0 (que
recolhia sobras antigas de decisões passadas), esta é consequência
imediata das próprias mudanças desta Sprint — deixar esse código para
trás seria contradizer o espírito da revisão ("prefira remover a
adicionar"). `compact`/`upcoming` foram removidas (e não preservadas como
"API pronta para o futuro", ao contrário das variantes `secondary`/`ghost`
do `Button` na Sprint 1.0) porque foram desenhadas para o caso de uso
específico que acabou de ser removido, não como parte de um sistema de
design genérico.

### `AppMockup` ganhou sombra permanente; nenhuma tela nova foi inventada

A moldura do `AppMockup` passou a ter `box-shadow: var(--shadow-sm)` em
repouso (antes só cards tinham sombra, e só no hover). O conteúdo interno
do mockup (barras abstratas) não foi alterado.

**Motivo**: pedido explícito do briefing era melhorar a composição sem
inventar telas. Uma sombra sutil e permanente (reaproveitando o token já
existente, não uma sombra nova) dá ao mockup a presença de "objeto
fotografado" em vez de "retângulo desenhado", sem adicionar nenhum
elemento visual novo ao vocabulário do site.

### Tagline do Footer também reescrita (fora da Home, mas fixado por consistência)

O Footer (visível em todas as páginas) tinha a tagline "Treine melhor.
Acompanhe sua evolução." — a mesma frase citada no briefing como exemplo
a evitar, e que antes vivia também no Hero. Trocada para "Seu treino.
Seus dados. Sempre com você."

**Motivo**: mesmo não sendo parte da Home isoladamente, deixar a frase
genérica sobrevivendo no rodapé de toda página contradiria diretamente o
objetivo desta Sprint — o Footer é renderizado pelo mesmo `Layout` usado
pela Home, e a frase antiga era um eco literal do problema que acabou de
ser corrigido no Hero.

## Sprint 1.1.0 — Identidade visual GymLog (paleta laranja + temas)

### Temas via `data-theme` + `prefers-color-scheme`, sem biblioteca

Três preferências — Claro, Escuro, Seguir sistema — implementadas com:
`data-theme="light"`/`"dark"` no `<html>` (persistido em `localStorage`
como `gymlog-theme`) para escolha explícita, e `@media
(prefers-color-scheme: light)` combinado com `:root:not([data-theme])`
para "Seguir sistema" (ausência de preferência salva). Os valores de cor
de cada tema ficam duplicados entre o bloco `@media` e o bloco
`[data-theme="light"]` em `theme.css` — não há como evitar isso em CSS
puro sem pré-processador (sem nesting sofisticado), mas é um padrão
amplamente usado e documentado com um comentário lembrando de manter os
dois blocos sincronizados.

**Motivo**: o briefing veta explicitamente bibliotecas de troca de tema
("não adicionar bibliotecas para troca de tema"). O padrão
atributo+media-query é o modo padrão de mercado para essa funcionalidade
sem JavaScript de terceiros, e reaproveita a mesma arquitetura de
variáveis CSS já centralizada em `theme.css` desde a Sprint 0.1.

### Script anti-flash (`is:inline`) no `<head>`, antes de qualquer CSS

Um script inline síncrono (não um `<script>` de módulo, que o Astro
adiaria) foi colocado logo após `<meta charset>` no `<head>` do `Layout`,
antes de qualquer folha de estilo. Ele lê `localStorage` e aplica
`data-theme` no `<html>` antes da primeira renderização.

**Motivo**: sem isso, a página renderizaria brevemente no tema padrão
(escuro) antes do JavaScript aplicar o tema salvo (Claro), causando um
"flash" visível — o problema clássico de temas com preferência
persistida. Confirmado via inspeção do HTML gerado que o script aparece
antes dos `<link rel="stylesheet">` no `<head>`. Pelo mesmo motivo, o
próprio botão `ThemeToggle` também usa `is:inline` (script síncrono, não
módulo) para sincronizar seu ícone imediatamente, sem esperar o
carregamento adiado padrão dos `<script>` do Astro.

### `ThemeToggle`: um botão cíclico, não três botões separados

Um único botão alterna entre Seguir sistema → Claro → Escuro (nessa
ordem), trocando o ícone (`monitor`/`sun`/`moon`) conforme o estado
ativo, em vez de três botões/abas separados.

**Motivo**: o Header já acumula logo, navegação (4 itens) e o menu
hambúrguer em telas pequenas — três controles adicionais de tema
disputariam espaço e contrariariam a característica "minimalista, poucos
elementos decorativos" citada como referência visual. Um único botão
compacto com ícone dinâmico e `aria-label` descritivo (ex.: "Tema:
escuro (clique para seguir o sistema)") mantém a funcionalidade completa
(3 estados, acessível por teclado e leitor de tela) sem adicionar
elementos visuais extras ao Header.

### Header reestruturado (`header__end`) para acomodar o `ThemeToggle`

O `Header` ganhou um wrapper `header__end` agrupando nav, `ThemeToggle` e
o botão hambúrguer, mantendo `header__inner` com apenas dois filhos
(logo + `header__end`) para preservar o `justify-content: space-between`
original. A ordem real no HTML é checkbox → nav → `ThemeToggle` → label,
porque o "checkbox hack" do menu mobile (Sprint 0.2.1) exige que o
checkbox venha *antes* de `.header__nav` no HTML para o seletor `~`
funcionar; a ordem visual desejada (nav, tema, hambúrguer) sai de graça
porque o checkbox é visualmente oculto e os demais elementos já seguem
essa sequência no HTML — sem precisar da propriedade `order`.

**Motivo**: manter o menu mobile 100% CSS (sem JavaScript, decisão já
tomada na Sprint 0.2.1) impôs essa restrição de ordem; entender a fundo
como o seletor `~` opera evitou introduzir `order` ou JavaScript
adicional só para reorganizar visualmente os itens.

### Paleta oficial aplicada literalmente, incluindo onde o contraste é limítrofe

Os hexadecimais exatos do briefing (`#FF5A1F`, `#E64A19`, bordas do tema
claro `#374151`, texto secundário `#6B7280`) foram usados sem ajustes.
Verificação de contraste (WCAG AA, 4.5:1 — padrão já seguido pelo projeto
desde a Sprint 0.2.1):

- Laranja (`#FF5A1F`) como texto sobre o fundo escuro (`#121212`): ~6:1 — OK.
- Texto branco sobre o botão primário laranja: ~3,1:1 — abaixo de 4.5:1 (WCAG AA para texto), mas o briefing pede explicitamente "texto branco" no botão primário, e é uma combinação já usada pelo aplicativo (mesma cor oficial). Botões têm affordance visual além da cor (formato, preenchimento), o que atenua o impacto prático.
- Texto secundário do tema claro (`#6B7280` sobre `#F4F4F5`): ~4,4:1, marginalmente abaixo de 4.5:1 — dentro da margem de arredondamento/perfil de cor, mantido como especificado.
- `--color-text-muted` do tema claro foi igualado a `--color-text-secondary` (`#6B7280`): no tema claro não há uma cor ainda mais clara que `#6B7280` com margem de contraste sobre `#F4F4F5`/`#FFFFFF`, então criar um tom "mais apagado" quebraria a acessibilidade. No tema escuro, o `--color-text-muted` (`#85858c`, já validado na Sprint 0.2.1) foi mantido — segue compatível com o novo fundo `#121212`.

**Motivo**: o objetivo explícito desta Sprint é paridade visual exata com
o aplicativo ("o visual deverá seguir exatamente a linguagem do
aplicativo"), com valores hexadecimais fornecidos com precisão de dígito
— não é meu lugar suavizar a cor oficial da marca unilateralmente. Optei
por documentar o trade-off de contraste com transparência (como já feito
para o `robots.txt` na Sprint 1.0.0) em vez de silenciosamente alterar a
paleta fornecida.

### `--color-bg-elevated` mantida como token interno (não pedida no briefing)

O tom "elevado" usado internamente pelo `AppMockup` (barras/linhas do
placeholder) e pelo ícone do `ValueProp` recebeu valores novos em ambos
os temas (`#181818` escuro / `#efeff1` claro), interpolados entre
`--color-bg` e `--color-surface` — o briefing não especifica esse tom.

**Motivo**: esse token já existia desde a Sprint 0.1 para um uso
puramente decorativo interno; extinguir ou fundir com `--color-surface`
quebraria o contraste sutil que o `AppMockup` usa para simular linhas de
conteúdo. Escolhido um valor consistente com a "distância" proporcional
entre bg/surface que já existia no tema escuro original.

### `ValueProp` e o card "Informações do projeto" ganharam superfície/borda

A seção "Por que escolher o GymLog?" (`ValueProp`) e o card de
informações do Suporte passaram a usar a mesma superfície/borda/hover de
`FeatureCard`, quando antes (Sprint 0.2.1) eram deliberadamente mais
"leves" (sem borda) para gerar variedade visual entre seções.

**Motivo**: o briefing agrupa explicitamente "recursos; FAQ; diferenciais;
suporte" sob o mesmo padrão de card ("mesma superfície do aplicativo;
bordas discretas; hover suave") — a variedade visual buscada na Sprint
0.2.1 foi conscientemente trocada por consistência de Design System,
que é o objetivo explícito desta Sprint.

### Hover de links de texto usa a cor principal (não a variante escura)

`--color-primary-hover` (`#E64A19`) segue reservada a elementos que já
têm fundo laranja em repouso (botão primário). Para links de texto (que
já usam `--color-primary` no estado normal), o hover mantém a mesma cor
e ganha sublinhado — atendendo literalmente ao "Links: Hover: #FF5A1F"
do briefing sem tornar o hover visualmente idêntico ao estado normal.

**Motivo**: o briefing especifica dois hex de hover diferentes em duas
seções distintas (`#E64A19` junto à "Cor principal", `#FF5A1F` na seção
"Links") — interpretados como dois tratamentos de hover distintos
conforme o elemento já parte ou não de um fundo laranja.

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

# GymLog — Site Institucional

## Objetivo do projeto

Site institucional do GymLog, construído com [Astro](https://astro.build), responsável por apresentar o projeto e hospedar páginas institucionais (Política de Privacidade, Termos de Uso e Suporte).

A Sprint 0.1.0 teve foco exclusivo em **arquitetura, organização e componentes reutilizáveis**. A partir da Sprint 0.2.0, a Home passou a ter conteúdo definitivo, e a Sprint 0.2.1 tratou do acabamento visual, de responsividade e de acessibilidade — a Home deve permanecer estável até a v1.0, recebendo apenas ajustes pontuais (screenshots reais, links das lojas). As demais páginas (Política de Privacidade, Termos de Uso, Suporte) seguem com conteúdo temporário, a ser substituído em Sprints futuras (ver [ROADMAP.md](./ROADMAP.md)).

## Stack utilizada

- **[Astro](https://docs.astro.build)** — geração de site estático (SSG).
- **TypeScript** — tipagem em componentes, layouts e utilitários.
- **CSS puro** — sem frameworks de utilitários (sem Tailwind). Sistema de tema baseado em variáveis CSS (custom properties).
- **[lucide-static](https://www.npmjs.com/package/lucide-static)** — ícones SVG puros da biblioteca Lucide, sem JavaScript em runtime.

Nenhuma outra dependência foi adicionada ao projeto.

## Estrutura de pastas

```
docs/                   Documentação do projeto
    README.md
    CHANGELOG.md
    ROADMAP.md
    DECISIONS.md

public/                 Arquivos estáticos servidos como estão
    favicon.svg
    favicon.ico
    images/
        og-home.png          Imagem de Open Graph da Home (1200×630)

src/
    assets/              Assets processados pelo pipeline de build do Astro (placeholder nesta Sprint)
    components/          Componentes reutilizáveis
        Header.astro          Cabeçalho com navegação principal e menu mobile (100% CSS)
        Footer.astro          Rodapé com links, contato, versões e navegação em colunas
        Container.astro       Largura máxima e respiro lateral
        Button.astro          Botão/link genérico (primary, secondary, ghost)
        Section.astro         Espaçamento vertical padronizado
        Icon.astro             Ícone Lucide inline (SVG puro, sem JS, decorativo por padrão)
        HeroSection.astro     Seção de apresentação da Home (texto + AppMockup)
        AppMockup.astro       Ilustração do app em moldura de smartphone (placeholder substituível por screenshot real)
        StoreBadge.astro      Selo "em breve" para App Store / Google Play
        FeatureCard.astro     Card de recurso (ícone + título + descrição), com variantes `compact` e `upcoming`
        FeatureGrid.astro     Grid responsivo de FeatureCard/ValueProp
        ValueProp.astro       Item da seção "Por que escolher o GymLog?" (ícone + título + frase)
        FAQItem.astro          Item de FAQ (<details>/<summary> nativos)
    layouts/             Layout principal do site (Layout.astro)
    pages/               Rotas do site (uma página por arquivo)
        index.astro        Home
        privacy.astro      Política de Privacidade
        terms.astro        Termos de Uso
        support.astro      Suporte
    styles/              Sistema de tema e reset global (theme.css, global.css)
    utils/               Funções e constantes auxiliares
        site.ts              Constantes globais do site (inclui contato e versão do app)
        breakpoints.ts        Breakpoints (espelham theme.css)
        icons.ts              Registro central dos ícones Lucide usados no site
        home-content.ts       Conteúdo textual da Home (Recursos, Por que escolher, Em desenvolvimento, FAQ)
```

### Pastas adicionadas além do briefing original

- `public/images/` e `src/assets/` foram criadas vazias (com `.gitkeep`) pois a estrutura solicitada as previa, mas nenhuma imagem definitiva existe ainda.

Nenhuma pasta além das solicitadas nos briefings foi criada. Decisões de arquitetura com o respectivo motivo ficam registradas em [DECISIONS.md](./DECISIONS.md).

## Como executar localmente

Pré-requisito: Node.js `>= 22.12.0` (ver campo `engines` em `package.json`).

```sh
npm install
npm run dev
```

O site ficará disponível em `http://localhost:4321`.

## Como gerar build

```sh
npm run build
```

O resultado da build estática é gerado em `./dist`, pronto para publicação em qualquer hospedagem estática (ex.: GitHub Pages, em Sprint futura).

Para pré-visualizar a build localmente:

```sh
npm run preview
```

## Convenções do projeto

- **Componentes** (`src/components/`): um componente por arquivo `.astro`, nome em `PascalCase`, sempre independentes e reutilizáveis (recebem dados via `Props`, nunca dependem de contexto externo implícito).
- **Páginas** (`src/pages/`): nome do arquivo em `kebab-case`/minúsculo, correspondendo à rota final. Toda página deve usar o `Layout` principal (`src/layouts/Layout.astro`) e informar `title` e `description`.
- **Estilos**: todo valor de cor, espaçamento, tipografia, raio de borda ou largura de container deve vir das variáveis definidas em `src/styles/theme.css` — não usar valores fixos repetidos diretamente nos componentes.
- **Breakpoints**: como CSS não permite `var()` dentro de `@media`, os breakpoints são definidos como referência em `theme.css` e replicados em `src/utils/breakpoints.ts` para uso futuro em JavaScript/TypeScript. Ao escrever uma media query, usar o valor literal correspondente ao token documentado.
- **SEO/Open Graph**: toda página deve fornecer `title` e `description` ao `Layout`; `ogImage` é opcional e só deve ser informado quando a imagem existir de fato — por convenção, sempre 1200×630. Se `title` já começar com o nome do site (`GymLog`), ele é usado como está; caso contrário, o `Layout` adiciona o sufixo ` · GymLog` automaticamente.
- **Ícones**: usar sempre o componente `Icon` (`src/components/Icon.astro`) com um nome já registrado em `src/utils/icons.ts`. Para adicionar um novo ícone, importar o `.svg` correspondente de `lucide-static` nesse arquivo antes de usá-lo. O `Icon` é sempre decorativo (`aria-hidden`) — deve ser usado ao lado de um texto visível que comunique o significado.
- **Acessibilidade**: todo elemento interativo deve permanecer operável por teclado (o indicador de foco global em `global.css` cobre isso automaticamente) e manter contraste mínimo de 4.5:1 (WCAG AA) sobre os fundos do tema.
- **Conteúdo de seções extensas** (Recursos, Diferenciais, FAQ, etc.): manter em arquivos de dados tipados dentro de `src/utils/` (ex.: `home-content.ts`), em vez de hardcoded dentro da página — facilita ajustes de texto sem tocar em markup ou estilo.
- **Idioma**: toda documentação, comentários de código e mensagens de commit devem ser escritos em português.
- **Versionamento**: o projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/). Alterações devem ser registradas em [CHANGELOG.md](./CHANGELOG.md).

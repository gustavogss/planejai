# PlanejAI

PlanejAI é uma aplicação web de educação financeira que ajuda pessoas a simularem metas, entenderem sua capacidade de economia mensal e receberem insights personalizados com apoio de inteligência artificial.

A experiência guia o usuário por um formulário simples sobre renda, gastos, dívidas e objetivo financeiro. Ao final, a aplicação calcula a economia mensal disponível, exibe um resumo da simulação e gera uma análise com diagnóstico, viabilidade da meta, sugestões práticas, ideias de renda extra, recomendações de investimento e uma mensagem motivacional personalizada.

## Funcionalidades

- Simulação financeira em etapas com perguntas guiadas.
- Máscara de moeda em padrão brasileiro para campos financeiros.
- Cálculo da economia mensal disponível com base em renda, custos fixos e dívidas.
- Tela de resultado com cartões de resumo da meta, prazo, renda, despesas e economia necessária.
- Geração de insights financeiros personalizados com Gemini.
- Conversa com mentor financeiro baseada no insight personalizado gerado.
- Persistência das simulações no `localStorage`.
- Reaproveitamento de insights já gerados para uma simulação salva.
- Estado de carregamento com skeleton durante a geração da análise.
- Tratamento de erro com opção para tentar gerar o insight novamente.
- Tema claro e escuro com preferência salva localmente.
- Navegação entre nova simulação, resultado e histórico.
- Página de erro para rotas não encontradas.

## Tecnologias

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router DOM 7
- Gemini API
- Lucide React
- React Loading Skeleton
- ESLint
- Prettier
- pnpm

## Estrutura do Projeto

```text
src/
  assets/                  # Imagens e recursos estáticos usados pela interface
  components/
    features/              # Componentes ligados às funcionalidades da aplicação
      Insigths/            # Exibição de conteúdo e erro dos insights de IA
      Simulation/          # Formulário, progresso, cards e insights da simulação
    layout/                # Layout base da aplicação
    shared/                # Componentes reutilizáveis de UI
  context/
    theme/                 # Contexto e provider do tema claro/escuro
  data/                    # Dados das etapas da simulação e prompt da IA
  hooks/                   # Hooks de tema, armazenamento e geração de insight
  pages/                   # Páginas principais: Home, Result e History
  services/                # Integração com serviços externos
  styles/                  # Variáveis e tema visual
  utils/                   # Funções utilitárias de moeda e simulação
```

## Rotas

| Rota             | Descrição                                                 |
| ---------------- | --------------------------------------------------------- |
| `/`              | Inicia uma nova simulação financeira.                     |
| `/resultado/:id` | Exibe o resultado da simulação salva e os insights de IA. |
| `/resultado`     | Redireciona para a página inicial.                        |
| `/historico`     | Exibe o histórico de simulações salvas localmente.        |
| `*`              | Exibe a página de erro para rotas não encontradas.        |

## Como Executar

### Pré-requisitos

- Node.js em versão compatível com o projeto.
- pnpm instalado.
- Chave de API do Gemini.

### Instalação

```bash
pnpm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione a chave da API do Gemini:

```env
VITE_GEMINI_API_KEY=sua_chave_do_gemini
```

A integração utiliza o modelo `gemini-flash-latest` através da API `generativelanguage.googleapis.com`.

Você também pode usar o arquivo `.env.example` como referência para configurar as variáveis necessárias.

### Ambiente de Desenvolvimento

```bash
pnpm dev
```

Depois, acesse a URL exibida pelo Vite no terminal.

### Build de Produção

```bash
pnpm build
```

### Preview do Build

```bash
pnpm preview
```

## Scripts Disponíveis

| Script              | Descrição                                                 |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Inicia o servidor de desenvolvimento com Vite.            |
| `pnpm build`        | Executa a checagem TypeScript e gera o build de produção. |
| `pnpm preview`      | Serve localmente o build gerado.                          |
| `pnpm lint`         | Executa o ESLint no projeto.                              |
| `pnpm lint:fix`     | Executa o ESLint aplicando correções automáticas.         |
| `pnpm format`       | Formata os arquivos com Prettier.                         |
| `pnpm format:check` | Verifica se os arquivos seguem a formatação configurada.  |

## Fluxo da Aplicação

1. O usuário informa renda mensal, custos fixos, dívidas, nome da meta, custo da meta e prazo desejado.
2. A aplicação salva a simulação no `localStorage` com um identificador único.
3. O usuário é redirecionado para a página de resultado.
4. A aplicação calcula a economia mensal disponível.
5. O PlanejAI monta um prompt com os dados da simulação e solicita um diagnóstico financeiro à API do Gemini.
6. O insight retornado é salvo junto da simulação para evitar novas chamadas desnecessárias.

## Observações

- O projeto é uma aplicação frontend. A chave `VITE_GEMINI_API_KEY` fica disponível no bundle final, como é comum em variáveis `VITE_*`. Para produção, considere proteger chamadas sensíveis por meio de um backend ou função serverless.
- As simulações são armazenadas localmente no navegador. Limpar os dados do navegador remove o histórico salvo.
- A página de histórico já possui rota e entrada no menu, mas ainda está preparada para evolução da funcionalidade.

## Deploy na Vercel

O projeto está preparado para deploy na Vercel como uma aplicação Vite/React estática.

O arquivo `vercel.json` define:

- `buildCommand`: `pnpm build`
- `outputDirectory`: `dist`
- `rewrites`: redireciona rotas do React Router para `index.html`, evitando erro 404 ao acessar URLs como `/historico` ou `/resultado/:id` diretamente.

Antes do deploy, configure a variável de ambiente abaixo no painel da Vercel:

```env
VITE_GEMINI_API_KEY=sua_chave_do_gemini
```

Para validar localmente antes de subir:

```bash
pnpm build
```

## Testar a aplicação:

[PlanejAI](https://planejai-one.vercel.app/)

# PROMPT.md: transforme este app no **seu** produto

Este é o arquivo mais importante do repositório. Você não vai programar: vai
copiar um prompt daqui, preencher seis lacunas e colar no Claude Code (ou no
Gemini / Antigravity, ou no Cursor). Em poucos minutos o app genérico vira o
produto que você quer mostrar no portfólio.

---

## O que este app já é

Um SaaS completo e funcionando: landing page de venda, tela de entrada, painel
com indicadores, cadastro de clientes, quadro de pedidos em kanban e agenda
semanal. Tudo responsivo, acessível e com um design system trocável.

Os dados ficam no seu navegador (localStorage) e ninguém precisa se autenticar,
e isso é de propósito: você foca na experiência, não em infraestrutura. O login
com Google e o banco no Neon já estão escritos e desligados no projeto, esperando
só as chaves no `.env.local`, então ligar cada um é preencher uma linha, não
programar.

Portanto: **não falta nada para você começar a redesenhar.** O que falta são as
palavras e as cores que fazem dele *o seu* produto.

---

## A ideia central: só **dois** arquivos mudam

| Arquivo | O que controla |
|---|---|
| `src/content/site.ts` | **Toda** a copy: nome da marca, landing inteira, rótulos do sistema, estados vazios, mensagens de erro, textos de ajuda. |
| `design-system.json` | **Todo** o visual: cores, tipografia, raio de borda. Landing, sistema e Storybook leem daqui. |

Nenhum texto visível está escrito dentro de componente. Nenhuma cor fixa está
escrita dentro de componente. Foi construído assim de propósito.

### Por que isso importa (e economiza tokens de verdade)

Um pedido do tipo *"personalize este app para uma clínica"* normalmente faz a IA
abrir 40+ componentes, ler cada um, reescrever texto espalhado, errar um tipo do
TypeScript e quebrar o build. Isso é caro, lento e frágil.

Aqui a IA abre **dois arquivos**. A mesma personalização custa uma fração do
contexto, roda em uma passada só e não tem como quebrar componente, porque
componente nenhum é tocado.

Tradução prática: você consegue fazer várias versões do seu produto (testar
outro segmento, outro tom de voz, outro visual) sem estourar limite de uso.

---

## Antes de colar: preencha estas seis lacunas

Escreva as respostas num papel ou num bloco de notas. Quanto mais específico,
melhor o resultado. Resposta vaga gera copy vaga.

| Marcador | O que responder | Exemplo bom |
|---|---|---|
| `[MEU PRODUTO]` | Nome + o que é, em uma frase | "Raiz, sistema de gestão para nutricionistas autônomos" |
| `[MEU PUBLICO]` | Quem usa, com contexto | "Nutricionistas que atendem sozinhos, entre 20 e 60 pacientes ativos" |
| `[PROBLEMA QUE RESOLVE]` | A dor concreta de hoje | "O acompanhamento vive espalhado entre WhatsApp, planilha e caderno; ninguém sabe quem sumiu há 3 semanas" |
| `[3 BENEFICIOS]` | Três ganhos, curtos e diferentes entre si | "Ver quem está em risco de abandono; montar plano em 5 minutos; histórico do paciente numa tela" |
| `[SEGMENTO]` | O nicho, para a IA escolher o vocabulário | "Saúde / nutrição clínica" |
| `[DESIGN SYSTEM ESCOLHIDO]` | Um id da lista no fim deste arquivo | `notion` |

> **Dica para escolher o design system:** rode o app, entre em
> **Configurações → Design system**, clique nos cards e veja o app inteiro se
> repintar na hora. Quando gostar de um, anote o nome dele.

---

## Prompt 1: personalização completa

Copie o bloco inteiro, substitua os seis marcadores pelas suas respostas e cole
na IA com o projeto aberto.

````text
Você vai personalizar um app Next.js que já está pronto e funcionando.
Leia estas regras inteiras antes de escrever qualquer coisa.

## Meu produto

- PRODUTO: [MEU PRODUTO]
- PÚBLICO: [MEU PUBLICO]
- PROBLEMA QUE RESOLVE: [PROBLEMA QUE RESOLVE]
- 3 BENEFÍCIOS: [3 BENEFICIOS]
- SEGMENTO: [SEGMENTO]
- DESIGN SYSTEM ESCOLHIDO: [DESIGN SYSTEM ESCOLHIDO]

## Você só pode editar DOIS arquivos

1. src/content/site.ts  (toda a copy do produto)
2. design-system.json   (todo o visual)

Não abra, não leia e não altere nada dentro de src/components, src/app ou
src/lib. Não crie arquivo novo. Não instale dependência. Se achar que precisa,
pare e me explique por quê em vez de fazer.

## Tarefa 1: reescrever src/content/site.ts

Reescreva TODO o texto visível para o meu produto: marca, landing inteira
(cabeçalho, herói, prévia do produto, benefícios, como funciona, planos, time,
rodapé), rótulos do sistema, estados vazios, mensagens de erro, textos de ajuda
e o passo a passo da tela de entrada.

Regras de escrita:
- Português do Brasil, tom humano e direto. Nada de "revolucione", "solução
  inovadora", "potencialize", "leve seu negócio ao próximo nível".
- Nada de travessão. Se a frase pedir um, quebre em duas frases ou use
  dois-pontos, vírgula ou parênteses.
- Todo título diz o que a PESSOA ganha, nunca descreve a mecânica. "Cadastre
  seus clientes" é mecânica; "Seus clientes entram em dez minutos" é ganho.
- Fale do problema real do meu público, com as palavras que ele usa.
- Os 3 benefícios que eu dei viram a seção de benefícios. Desenvolva cada um
  em título curto + uma frase concreta.
- Números e provas sociais precisam ser plausíveis para o meu tamanho de
  operação, não inventados grandes demais.
- Texto de botão é verbo. Estado vazio explica o que fazer, não só o que falta.
- Respeite o tamanho: título de herói é uma linha, não um parágrafo. Se o texto
  novo for muito mais longo que o antigo, ele vai quebrar o layout.

## Tarefa 2: renomear as entidades para o vocabulário do meu segmento

O app tem três entidades genéricas. Troque os RÓTULOS delas para as palavras
que o meu segmento usa de verdade. Exemplos: cliente pode virar "paciente",
"aluno", "hóspede", "veículo"; pedido pode virar "consulta", "matrícula",
"ordem de serviço", "reserva"; compromisso pode virar "sessão", "aula",
"visita", "atendimento".

Onde mexer: o objeto `sistema.entidades` no site.ts (singular, plural, artigo)
e todo lugar do site.ts onde essas palavras aparecem escritas por extenso.
Ajuste o artigo ("o"/"a") para concordar com a palavra nova. É isso que faz
as mensagens automáticas saírem em português correto.

Ajuste também `sistema.etapas`, que são os nomes das colunas do quadro: troque
os RÓTULOS ("Novo", "Em andamento", "Aguardando", "Concluído") pelo fluxo real
do meu segmento, mas mantenha exatamente as quatro chaves.

## Tarefa 3: trocar o design system

Substitua o conteúdo de design-system.json pelo sistema
[DESIGN SYSTEM ESCOLHIDO], que está catalogado em src/lib/design-systems.json.

O catálogo é incompleto de propósito (falta surfaceElevated, inkMuted,
primaryInk, primaryHover e as cores semânticas). Derive o que faltar seguindo a
lógica que já existe em src/lib/tema.ts, e garanta contraste mínimo de 4.5:1
entre texto e fundo. O arquivo final tem que ter exatamente o mesmo formato do
design-system.json atual, com todos os campos preenchidos.

## O que NÃO pode quebrar

- Não mude nenhum nome de campo nem nenhuma chave de objeto no site.ts. Só os
  VALORES em texto mudam. A estrutura é contrato com os componentes.
- Não mexa em src/lib/types.ts. Cliente, Pedido e Agendamento continuam com os
  mesmos campos. Só os rótulos na tela mudam.
- As chaves de `sistema.etapas` continuam sendo exatamente:
  novo, em_andamento, aguardando, concluido.
- As chaves de `sistema.entidades` continuam sendo exatamente:
  cliente, pedido, agendamento.
- Em `sistema.nav`, mude só `rotulo`. Os `href` apontam para rotas que existem
  e os `icone` são nomes já registrados. Trocar qualquer um dos dois quebra a
  navegação ou some com o ícone.
- Não remova nenhuma chave, mesmo que ache que não usa. Componente nenhum
  checa se o texto existe: chave faltando vira tela em branco ou erro de build.
- Sem `any`. Sem cor fixa (#fff, bg-zinc-900). Sem texto novo fora do site.ts.

## Quando terminar

Rode `npm run build` e me mostre o resultado. Se der erro de tipo, conserte
dentro dos dois arquivos permitidos, nunca afrouxando o tipo em src/lib.
Depois me diga em uma lista curta o que você mudou.
````

---

## Prompt 2: só trocar o design system

Use este quando já personalizou a copy e só quer testar outra cara. É muito mais
barato que o prompt completo.

````text
Troque o visual deste projeto para o design system [DESIGN SYSTEM ESCOLHIDO].

Edite APENAS o arquivo design-system.json da raiz. Não toque em mais nada.

Pegue os valores do sistema com esse id em src/lib/design-systems.json. O
catálogo é incompleto: derive surfaceElevated, inkMuted, primaryInk,
primaryHover, success, danger e warning seguindo a mesma lógica de
src/lib/tema.ts, garantindo contraste mínimo de 4.5:1 entre texto e fundo.

O arquivo final precisa ter exatamente os mesmos campos do atual: mesmo
formato, nada faltando. `tracking` vai em `em` (o catálogo guarda em número:
-2 vira "-0.02em"). `radius` vai com unidade ("8px").

Depois rode `npm run build`.
````

> **Atalho sem IA:** entre em **Configurações → Design system**, escolha um,
> clique em **Copiar JSON** e cole no `design-system.json` da raiz. O JSON já
> vem com as cores derivadas e é exatamente a tela que você acabou de ver.

---

## Depois de rodar o prompt: confira

Sempre, nesta ordem:

```bash
npm run build
```

Se aparecer erro, copie a mensagem inteira e cole na IA. Ela conserta. Erro no
build quase sempre é chave de texto apagada por engano.

Depois abra o app e passe os olhos:

- [ ] A landing fala do **meu** produto, sem sobra do texto antigo
- [ ] O menu lateral usa as palavras do meu segmento
- [ ] As colunas do quadro de pedidos fazem sentido no meu fluxo
- [ ] Os estados vazios explicam o que fazer (limpe os dados em
      **Configurações → Dados de exemplo → Limpar tudo** para vê-los)
- [ ] Em 375px de largura nada estoura nem cria barra de rolagem horizontal
- [ ] Nenhum texto ficou em inglês ou com marcador `[MEU PRODUTO]` esquecido

---

## Os 71 design systems disponíveis

Use o `id` exatamente como está escrito aqui.

`airbnb` · `airtable` · `apple` · `binance` · `bmw` · `bmw-m` · `bugatti` ·
`cal` · `claude` · `clay` · `clickhouse` · `cohere` · `coinbase` · `composio` ·
`cursor` · `elevenlabs` · `expo` · `ferrari` · `figma` · `framer` ·
`hashicorp` · `ibm` · `intercom` · `kraken` · `lamborghini` · `linear.app` ·
`lovable` · `mastercard` · `meta` · `minimax` · `mintlify` · `miro` ·
`mistral.ai` · `mongodb` · `nike` · `notion` · `nvidia` · `ollama` ·
`opencode.ai` · `pinterest` · `playstation` · `posthog` · `raycast` ·
`renault` · `replicate` · `resend` · `revolut` · `runwayml` · `sanity` ·
`sentry` · `shopify` · `slack` · `spacex` · `spotify` · `starbucks` ·
`stripe` · `supabase` · `superhuman` · `tesla` · `theverge` · `together.ai` ·
`uber` · `vercel` · `vodafone` · `voltagent` · `warp` · `webflow` · `wired` ·
`wise` · `x.ai` · `zapier`

---

## E depois?

Personalizado o app, o exercício de verdade começa: **melhorar a UX dele.**
Redesenhe o onboarding, repense o quadro, invente uma tela nova. Aí sim vale
mexer nos componentes.

Quando quiser plugar coisas de gente grande (login com Google, banco de dados,
e-mail, WhatsApp), o roteiro está em [`PROXIMOS-PASSOS.md`](./PROXIMOS-PASSOS.md).

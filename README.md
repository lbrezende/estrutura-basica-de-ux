# Órbita: um SaaS pronto pra você redesenhar

Este é um aplicativo web completo e funcionando. Landing page de venda, tela de
entrada, painel com indicadores, cadastro de clientes, quadro de pedidos e
agenda. Tudo responsivo, acessível e com o visual trocável em um arquivo.

Ele é um presente para designers de UX que nunca programaram. A ideia é simples:
você não precisa construir um produto do zero para ter o que redesenhar. Já está
construído. Personalize, quebre, melhore, mostre no portfólio.

---

## Como rodar

Você precisa do [Node.js](https://nodejs.org) instalado (versão 20 ou mais
nova). Baixe o instalador, clique em avançar até o fim, pronto.

Abra o Terminal, entre na pasta do projeto e rode:

```bash
npm install
npm run dev
```

Depois abra <http://localhost:3000> no navegador.

O `npm install` baixa as peças que o app usa. Demora um minuto e só precisa ser
feito uma vez. O `npm run dev` liga o app. Enquanto ele estiver rodando, o
Terminal fica ocupado; para desligar, aperte `Ctrl + C`.

Para gerar a versão final (a mesma que vai para o ar) e conferir se está tudo
inteiro:

```bash
npm run build
```

---

## O que já existe

| Tela | Endereço | O que tem |
|---|---|---|
| Landing | `/` | Herói, prévia do produto, benefícios, como funciona, planos, time e rodapé |
| Entrada | `/entrar` | Formulário e um modal que ensina o passo a passo do login com Google |
| Painel | `/app` | Indicadores do período, pedidos por etapa, próximos compromissos |
| Clientes | `/app/clientes` | Lista, busca, cadastro, edição, remoção e ficha lateral |
| Pedidos | `/app/pedidos` | Quadro kanban com quatro colunas, prioridade, valor e prazo |
| Agenda | `/app/agenda` | Visão de semana e visão de lista |
| Configurações | `/app/configuracoes` | Troca de design system (71 opções), dados de exemplo e perfil |

Também já está pronto:

- **Design system trocável.** Cores e tipografia saem todas de um arquivo só
- **Componentes próprios.** Botão, campo, card, modal, drawer, badge, estado
  vazio. Sem biblioteca de terceiros, então dá pra mexer em tudo
- **Acessibilidade.** Navegação por teclado, foco visível, rótulo em todo campo
- **Responsivo.** Funciona de verdade em 375px de largura
- **Estados vazios.** Toda lista tem uma tela pra quando não há nada
- **Dados de exemplo.** 5 clientes, 6 pedidos e 4 compromissos já cadastrados

---

## O que NÃO existe (e por quê)

Este app **não tem** banco de dados, servidor, login de verdade nem pagamento.

Os dados ficam guardados no seu próprio navegador. Se você abrir em outro
computador, começa do zero. Se limpar os dados do site, some tudo. O botão
"Entrar com Google" abre um modal explicando como seria. Ele não autentica
ninguém.

Isso é **de propósito**, por três motivos:

1. **Roda em qualquer lugar, na hora.** Sem chave de API, sem cadastro em
   serviço, sem arquivo de configuração. Dois comandos e está no ar.
2. **Nada quebra.** Não tem servidor para cair nem cota para estourar. Você
   pode apagar tudo e restaurar os exemplos quantas vezes quiser.
3. **O foco é a experiência.** Seu exercício é de UX, não de infraestrutura.
   Um banco de dados não deixaria o produto melhor de usar, só mais difícil de
   ligar.

Quando quiser plugar as coisas de verdade, o roteiro está em
[`PROXIMOS-PASSOS.md`](./PROXIMOS-PASSOS.md).

---

## Como transformar isso no *seu* produto

Leia [`PROMPT.md`](./PROMPT.md).

Resumo: existe um prompt pronto lá. Você preenche seis lacunas (seu produto, seu
público, o problema que resolve, três benefícios, seu segmento e o design system
escolhido), cola no Claude Code ou no Gemini, e a IA reescreve o app inteiro para
você.

Funciona porque só **dois arquivos** precisam mudar:

- `src/content/site.ts`: todo o texto do app
- `design-system.json`: todo o visual

Nenhuma palavra e nenhuma cor estão escritas dentro dos componentes.

---

## Como trocar só o visual, sem IA

1. Rode o app
2. Vá em **Configurações → Design system**
3. Clique nos cards e o app inteiro se repinta na hora
4. Gostou de um? Clique em **Copiar JSON**
5. Cole no arquivo `design-system.json` da raiz, substituindo o conteúdo

Pronto: landing, sistema e Storybook passam a usar o novo visual.

> A troca feita na tela é só uma prévia, e vale apenas no seu navegador. O que
> vale para o projeto inteiro é o `design-system.json`.

---

## Como abrir o Storybook

O Storybook é uma vitrine dos componentes. Cada botão, campo e card aparece
isolado, em todos os estados (normal, desabilitado, com erro, carregando). É
onde você olha uma peça de perto sem precisar navegar até a tela dela.

```bash
npm run storybook
```

Depois abra <http://localhost:6006>. Ele usa o mesmo `design-system.json` do
app, então trocar o visual troca a vitrine junto.

---

## Como publicar na internet (Vercel)

A Vercel hospeda de graça e é da mesma empresa que faz o Next.js, então não tem
configuração nenhuma.

1. Crie uma conta em <https://vercel.com> (dá para entrar com o GitHub)
2. Suba o projeto pro GitHub. Se nunca fez isso, o
   [GitHub Desktop](https://desktop.github.com) faz na interface, sem terminal
3. Na Vercel, clique em **Add New → Project** e escolha o repositório
4. Não mude nenhuma configuração. Clique em **Deploy**
5. Em dois minutos você recebe um endereço público, tipo
   `seu-projeto.vercel.app`

Toda vez que você atualizar o código no GitHub, a Vercel publica sozinha.

> Como não existe banco de dados, cada visitante do seu link vê os dados de
> exemplo e mexe na própria cópia, no próprio navegador. Ninguém vê os dados de
> ninguém. Pra portfólio, é exatamente o que você quer.

---

## Estrutura de pastas

```text
.
├── design-system.json        ← O VISUAL INTEIRO. Cores, fontes, raio de borda.
├── PROMPT.md                 ← O prompt que transforma o app no seu produto.
├── PROXIMOS-PASSOS.md        ← Roteiro para plugar login, banco, e-mail etc.
├── .env.example              ← Modelo de arquivo de senhas (todos vazios).
├── n8n/                      ← Automações. Opcional, o app roda sem isso.
├── public/                   ← Imagens e ícones servidos direto (favicon, svg).
└── src/
    ├── content/
    │   └── site.ts           ← TODO O TEXTO DO APP. Nenhuma palavra fora daqui.
    │
    ├── app/                  ← As páginas. Cada pasta vira um endereço.
    │   ├── page.tsx          ← A landing (/)
    │   ├── layout.tsx        ← A moldura de todas as páginas
    │   ├── globals.css       ← Onde os tokens do design system viram CSS
    │   ├── entrar/           ← /entrar
    │   └── app/              ← A área logada
    │       ├── page.tsx      ← /app, o painel
    │       ├── clientes/     ← /app/clientes
    │       ├── pedidos/      ← /app/pedidos
    │       ├── agenda/       ← /app/agenda
    │       └── configuracoes/ ← /app/configuracoes
    │
    ├── components/           ← As peças que montam as telas.
    │   ├── ui/               ← Os primitivos: botão, campo, card, modal, badge
    │   ├── marketing/        ← As dobras da landing
    │   ├── auth/             ← Tela de entrada e modal do Google
    │   └── app/              ← As peças da área logada, por tela
    │
    └── lib/                  ← O motor. Mexa aqui só quando souber o que faz.
        ├── types.ts          ← O formato dos dados (Cliente, Pedido, Agendamento)
        ├── store.ts          ← Onde os dados são guardados e alterados
        ├── seed.ts           ← Os dados de exemplo
        ├── design-system.ts  ← Ponte entre o design-system.json e o CSS
        ├── design-systems.json ← Catálogo dos 71 visuais prontos
        ├── tema.ts           ← A prévia de design system em tempo real
        ├── formato.ts        ← Formatação de data, dinheiro e telefone
        └── cn.ts             ← Utilitário para juntar classes CSS
```

### Por onde começar a mexer

- **Quer mudar uma palavra?** `src/content/site.ts`
- **Quer mudar uma cor?** `design-system.json`
- **Quer mudar como um botão se comporta?** `src/components/ui/button.tsx`
- **Quer mudar o layout de uma tela?** a pasta dela em `src/components/app/`
- **Quer criar uma tela nova?** uma pasta nova em `src/app/app/` com um
  `page.tsx` dentro, e um item novo em `sistema.nav` no `site.ts`

---

## Tecnologias usadas

Next.js 16, React 19, TypeScript e Tailwind CSS 4. Ícones da biblioteca
[lucide](https://lucide.dev). Nada além disso. Sem biblioteca de componentes,
sem biblioteca de animação, sem estado global complicado.

Se você não conhece nenhum desses nomes, tudo bem. Você não precisa conhecer
para personalizar o app.

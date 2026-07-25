# Próximos passos

O app que você recebeu é completo de propósito: ele funciona sozinho, sem
servidor, sem banco e sem chave de API. Isso é o que permite rodar em dois
comandos.

Este arquivo é o mapa do que vem **depois**, quando você quiser que ele deixe
de ser uma maquete e vire um produto de verdade.

**Não é um passo a passo.** Cada item explica o que é, por que vale a pena e
onde está a documentação oficial. Ligar cada um é o exercício.

---

## A ordem importa

Faça na ordem abaixo. Cada item depende do anterior estar de pé:

- [ ] 1. **Login com Google**: saber *quem* está usando
- [ ] 2. **Banco de dados (Neon)**: ter *onde* guardar
- [ ] 3. **E-mail (Resend)**: falar com quem usa
- [ ] 4. **WhatsApp**: falar onde a pessoa realmente lê
- [ ] 5. **n8n**: fazer tudo isso acontecer sozinho
- [ ] 6. **MCP do Figma**: encurtar a ponte entre desenho e código
- [ ] 7. **Deploy na Vercel**: colocar no ar

> A Vercel está no fim por dependência, não por prioridade. Se quiser só um link
> pra mostrar no portfólio, **pule direto para o item 7**. O app publica hoje,
> do jeito que está.

---

## 1. Login com Google

**O que é.** Hoje o botão "Entrar com Google" abre um modal que *explica* como
seria. Não existe autenticação: qualquer nome e e-mail entram, e a sessão fica
guardada no navegador. Ligar isso de verdade significa a pessoa clicar, escolher
a conta Google dela e voltar autenticada.

**Por que vale a pena.** É o primeiro item porque tudo depois depende dele. Sem
saber quem é a pessoa, não existe "os pedidos *dela*", só "os pedidos". Login é
o que separa uma demonstração de um produto multiusuário.

Como designer, é aqui que você encosta na parte mais subestimada da experiência:
o que acontece quando a pessoa cancela no meio, quando volta depois de um mês,
quando entra com a conta errada.

**Onde está.** Você vai precisar de duas coisas: uma biblioteca de autenticação
no app e uma credencial no Google.

- Auth.js (a biblioteca padrão do Next.js): <https://authjs.dev/getting-started/authentication/oauth>
- Credencial do Google: <https://console.cloud.google.com/apis/credentials>

**Variáveis:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (veja o `.env.example`)

---

## 2. Banco de dados (Neon)

**O que é.** Hoje os dados vivem no `localStorage` do navegador. Trocou de
computador, começou do zero. Limpou os dados do site, sumiu tudo. Um banco de
dados guarda isso num servidor, de forma permanente.

O Neon é um Postgres que roda na nuvem, tem plano gratuito generoso e liga na
Vercel em dois cliques.

**Por que vale a pena.** É o que faz o produto existir fora da sua máquina.
Também é o que permite duas pessoas usarem o mesmo sistema, que é o começo de
qualquer coisa colaborativa.

Detalhe importante para você: o arquivo `src/lib/store.ts` foi escrito com a
mesma cara que uma versão com banco teria (`criarCliente`, `atualizarPedido`,
`removerAgendamento`). A troca é por dentro; nenhuma tela precisa mudar.

**Onde está.** <https://neon.com/docs/introduction>

**Variável:** `DATABASE_URL`

---

## 3. E-mail (Resend)

**O que é.** Mandar e-mail de verdade a partir do app: boas-vindas, confirmação
de compromisso, aviso de prazo estourando, recuperação de acesso.

O Resend é o serviço mais simples para isso hoje. A parte boa para designers: os
e-mails são escritos como componentes React, então dá para desenhar de verdade,
sem tabela HTML de 1998.

**Por que vale a pena.** E-mail é a única tela do seu produto que a pessoa vê
sem abrir o produto. Um bom e-mail transacional traz gente de volta; um ruim vira
spam mentalmente. É um exercício de UX writing e de hierarquia num espaço muito
apertado.

**Onde está.** <https://resend.com/docs/introduction>

**Variável:** `RESEND_API_KEY`

---

## 4. WhatsApp

**O que é.** No Brasil, é onde a comunicação acontece de fato. Confirmar
compromisso, avisar de pedido novo, lembrar de prazo. Tudo isso funciona muito
melhor no WhatsApp do que no e-mail.

A API oficial é a WhatsApp Cloud API, da Meta. O cadastro é burocrático (exige
verificação do negócio), então dá para começar pela sandbox da Twilio, que
funciona em minutos.

**Por que vale a pena.** É o canal com a maior taxa de leitura que existe e, por
isso mesmo, o mais fácil de estragar. Definir *o que* merece uma mensagem e
*quando* ela pode ser mandada é decisão de produto, não de engenharia. E é uma
ótima história pro seu portfólio.

**Onde está.**

- Oficial (Meta): <https://developers.facebook.com/docs/whatsapp/cloud-api>
- Caminho mais rápido para testar: <https://www.twilio.com/docs/whatsapp>

**Variável:** `WHATSAPP_TOKEN`

---

## 5. n8n (automações)

**O que é.** Um app onde você monta automações arrastando caixinhas: *quando
entrar um pedido novo, me avise no WhatsApp*. Sem escrever código.

Já está preparado neste repositório: a pasta [`n8n/`](./n8n/) tem um
`docker-compose.yml` pronto e um README explicando tudo em linguagem simples.

**Por que vale a pena.** É o que junta os itens 3 e 4 numa coisa só. E é o item
com melhor relação entre esforço e resultado: em uma tarde você tem uma
automação real funcionando, que dá para gravar em vídeo e mostrar.

Também é um jeito confortável de pensar como sistema. Os fluxos do n8n se
parecem muito com os fluxos que você já desenha no Figma.

**Onde está.** <https://docs.n8n.io>, e o [`n8n/README.md`](./n8n/README.md)
deste projeto.

**Variável:** `N8N_WEBHOOK_URL`

---

## 6. MCP do Figma

**O que é.** MCP é um jeito de dar ferramentas para a IA. O MCP do Figma deixa
o Claude Code (ou o Cursor) **ler o seu arquivo do Figma** (frames, cores,
espaçamentos, nomes de camada) em vez de adivinhar a partir de um print.

Na prática: você seleciona um frame no Figma, pede "implemente esta tela" no
Claude Code, e ele monta o componente usando as medidas e os tokens do seu
próprio arquivo.

**Por que vale a pena.** Este é o item mais transformador da lista para quem é
designer. Ele inverte o jogo: em vez de você aprender a programar para ver seu
desenho de pé, o desenho vira código com você continuando no Figma.

Funciona muito bem com este projeto, porque o design system aqui já é um
conjunto de tokens, o mesmo vocabulário que o Figma exporta.

**Onde está.** <https://developers.figma.com/docs/figma-mcp-server/>

---

## 7. Deploy na Vercel

**O que é.** Colocar o app num endereço público, que qualquer pessoa abre.

**Por que vale a pena.** Um link vale mais que dez prints. Recrutador abre o
link no celular e usa o seu produto; ninguém abre um PDF de 40 páginas.

E, como já dito lá em cima: **isso funciona hoje.** Você não precisa de nenhum
dos seis itens anteriores para publicar. O app roda inteiro no navegador de quem
visita, cada pessoa com a própria cópia dos dados de exemplo.

**Onde está.** <https://vercel.com/docs/frameworks/nextjs>, e o passo a passo
resumido está no [`README.md`](./README.md#como-publicar-na-internet-vercel).

---

## Antes de qualquer um desses passos

Uma regra que vale para os sete itens:

**Chave de API é senha.** Ela vai no arquivo `.env.local`, que nunca sobe para o
GitHub. O [`.env.example`](./.env.example) existe justamente para você saber
quais chaves precisa, sem ninguém precisar te mandar as dela.

Se vazar uma chave, apague-a no painel do serviço e gere outra. Não existe
desvazar.

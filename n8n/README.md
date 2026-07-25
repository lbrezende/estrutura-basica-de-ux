# n8n: automações (opcional)

> **Leia isto primeiro:** o app funciona 100% sem o n8n. Esta pasta é um extra,
> para quando você quiser que as coisas aconteçam sozinhas. Se estiver com
> pressa para redesenhar o produto, pule.

---

## O que é o n8n

É um app onde você monta automações arrastando caixinhas e ligando com fios.
Cada caixinha é um passo. Você liga uma na outra e desenha o caminho.

Em vez de escrever código, você monta um desenho tipo:

> **quando** entrar um pedido novo → **então** me avise no WhatsApp

A primeira caixinha é o gatilho (o que faz a automação começar). As outras são
as ações. É bem parecido com um fluxo de usuário no Figma, só que ele roda.

O n8n é gratuito, roda na sua própria máquina e se conecta com centenas de
serviços prontos: Gmail, Google Sheets, WhatsApp, Slack, Notion, Telegram.

---

## Como subir

### O que você precisa antes

O [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e
aberto. Docker é um programa que roda outros programas dentro de uma caixinha
isolada, sem bagunçar sua máquina. Baixe, instale, abra e espere o ícone da
baleia ficar verde.

### Os comandos

Abra o Terminal, entre nesta pasta (`n8n`) e rode:

```bash
docker compose up -d
```

Espere um minuto na primeira vez, porque ele está baixando o n8n. Depois abra:

**<http://localhost:5678>**

Na primeira visita ele pede para você criar um usuário. Esse usuário fica só na
sua máquina; não é uma conta na internet.

### Para desligar

```bash
docker compose down
```

Seus fluxos **não** se perdem. Eles ficam guardados num volume do Docker
(`n8n_dados`), configurado no `docker-compose.yml`. Da próxima vez que você
subir, está tudo lá.

Se quiser apagar tudo de propósito, aí sim:

```bash
docker compose down -v
```

### Se der erro de porta ocupada

Alguma outra coisa já está usando a porta 5678. Abra o `docker-compose.yml` e
troque o número da **esquerda**:

```yaml
ports:
  - "5679:5678"
```

Depois acesse <http://localhost:5679>.

---

## Exemplo 1: avisar no WhatsApp quando entrar um pedido novo

**A dor:** você só descobre que chegou pedido quando lembra de abrir o sistema.

**A automação:**

```text
[Webhook]  →  [Filtro]  →  [Enviar WhatsApp]
   ↑              ↑                ↑
o app avisa    só passa se     mensagem chega
que criou      a prioridade    no seu celular
um pedido      for "alta"
```

**Como montar:**

1. No n8n, clique em **Create Workflow**
2. Adicione o nó **Webhook**. Ele te dá uma URL, tipo
   `http://localhost:5678/webhook/pedido-novo`. Essa URL é o "telefone" da sua
   automação: quem ligar nele dispara o fluxo
3. Copie a URL e cole no `.env.local` do projeto, na variável `N8N_WEBHOOK_URL`
4. Adicione o nó **Filter** e configure: só continuar se `prioridade` for igual
   a `alta`. Sem isso você recebe mensagem de tudo e desliga em dois dias
5. Adicione o nó **WhatsApp Business Cloud** (ou **Twilio**, que é mais fácil de
   testar) e escreva a mensagem usando os dados que chegaram, por exemplo:
   *"Pedido novo: {{ $json.titulo }}, de {{ $json.cliente }}"*
6. Clique em **Test workflow**, depois em **Active** no canto superior direito

**Falta a última peça:** hoje o app não chama esse webhook, porque não tem
servidor. Essa é justamente uma das tarefas do
[`PROXIMOS-PASSOS.md`](../PROXIMOS-PASSOS.md): criar uma rota no app que avisa
o n8n quando um pedido é criado.

---

## Exemplo 2: e-mail de confirmação quando marcar um compromisso

**A dor:** cliente esquece o horário e você fica com a agenda furada.

**A automação:**

```text
[Webhook]  →  [Enviar e-mail]  →  [Esperar até 1 dia antes]  →  [Enviar e-mail]
   ↑                ↑                        ↑                          ↑
o app avisa    "seu horário         segura o fluxo até            "é amanhã,
que marcou     está confirmado"     a véspera                     te espero"
```

**Como montar:**

1. Nó **Webhook**: recebe os dados do compromisso (nome, e-mail, data, hora)
2. Nó **Send Email** (ou **Gmail**, ou **Resend**): escreva o texto de
   confirmação usando os campos recebidos
3. Nó **Wait**: configure para esperar até 24 horas antes da data do
   compromisso
4. Nó **Send Email** de novo: o lembrete da véspera

Repare que a segunda mensagem é a que evita o furo na agenda. A primeira só
tranquiliza. As duas juntas viram um produto bom.

---

## Dicas para não se perder

- **Comece com dois nós.** Webhook + uma ação. Funcionou? Aí adicione o
  terceiro. Fluxo grande montado de uma vez é impossível de depurar.
- **Use o botão "Test workflow" o tempo todo.** Cada nó mostra exatamente o que
  entrou e o que saiu dele. É o melhor jeito de entender o que está acontecendo.
- **Fluxo só roda quando está "Active".** No modo de teste ele espera uma
  execução manual e depois desliga.
- **Credencial fica no n8n, não no código.** Ao conectar Gmail ou WhatsApp, o
  n8n guarda o acesso dele mesmo. Não copie chave nenhuma para arquivo do
  projeto.
- **Nunca coloque senha de verdade no `docker-compose.yml`.** Esse arquivo vai
  para o GitHub. Valor sensível mora no `.env.local`, que não vai.

---

## Para aprender mais

- Documentação oficial: <https://docs.n8n.io>
- Fluxos prontos para copiar: <https://n8n.io/workflows>
- Como funciona o nó Webhook: <https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/>

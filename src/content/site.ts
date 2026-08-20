/**
 * TODA a copy do produto mora aqui.
 *
 * É o arquivo que a IA reescreve quando você personaliza o app pro seu
 * segmento. Nenhum texto fica solto dentro de componente. Assim a
 * personalização custa 1 arquivo em vez de uma varredura no projeto inteiro
 * (isso economiza tokens de verdade).
 *
 * Junto com o `design-system.json`, estes são os dois únicos arquivos que
 * precisam mudar para o app virar outra coisa.
 */

export const marca = {
  nome: "Órbita",
  tagline: "O painel que mantém sua operação girando",
  descricaoCurta: "Clientes, pedidos e agenda num lugar só.",
}

export const landing = {
  /** Barra fixa do topo da landing. Os `href` com `#` apontam para as dobras. */
  cabecalho: {
    navegacao: "Navegação da página",
    irParaInicio: "Ir para o início",
    entrar: "Entrar",
    links: [
      { rotulo: "Benefícios", href: "#beneficios" },
      { rotulo: "Como funciona", href: "#como-funciona" },
      { rotulo: "Planos", href: "#planos" },
    ],
  },

  /** Dobra 1: herói */
  hero: {
    eyebrow: "Pra pequenas operações de serviço",
    titulo: "Sua operação inteira em uma tela só",
    subtitulo:
      "Pare de perder pedido em conversa de WhatsApp e cliente em planilha. O Órbita junta quem você atende, o que está em andamento e o que vem pela frente. Tudo num painel que cabe na cabeça.",
    ctaPrimario: "Começar agora",
    ctaSecundario: "Ver como funciona",
    provaSocial: "Usado por mais de 400 pequenos negócios no Brasil",
  },

  /**
   * A "foto do produto" do herói. É um painel falso montado em HTML e CSS, sem
   * nenhum arquivo de imagem. Os rótulos vivem aqui porque personalizar o app
   * pra outro segmento tem que mudar também o que aparece na prévia.
   *
   * A `descricao` é o texto alternativo: a prévia inteira é anunciada como uma
   * imagem só, então é a única frase que o leitor de tela vai ouvir dela.
   */
  mockup: {
    descricao:
      "Prévia do painel do Órbita: indicadores do mês, pedidos por semana e os próximos compromissos.",
    endereco: "app.orbita.com.br",
    titulo: "Painel",
    periodo: "Últimos 7 dias",
    metricas: [
      { rotulo: "Clientes ativos", valor: "38", variacao: "+12%" },
      { rotulo: "Pedidos abertos", valor: "14", variacao: "+3" },
      { rotulo: "A receber", valor: "R$ 47,9 mil", variacao: "+18%" },
    ],
    grafico: {
      titulo: "Pedidos por semana",
      variacao: "+18%",
    },
    lista: {
      titulo: "Próximos compromissos",
      itens: [
        { titulo: "Apresentação das rotas", pessoa: "Marina Alvarenga", quando: "Hoje, 10:00" },
        { titulo: "Alinhamento trimestral", pessoa: "Rafael Nogueira", quando: "Amanhã, 14:30" },
        { titulo: "Kickoff do site", pessoa: "Camila Ishikawa", quando: "Qui, 09:00" },
      ],
    },
  },

  /** Dobra 2: os três maiores benefícios */
  beneficios: {
    titulo: "Três problemas a menos na sua semana",
    itens: [
      {
        icone: "users",
        titulo: "Nada mais se perde",
        texto:
          "Cada cliente com histórico, contato e observação no mesmo lugar. Você para de procurar aquela mensagem de três semanas atrás.",
      },
      {
        icone: "kanban",
        titulo: "Você enxerga o andamento",
        texto:
          "Todo pedido numa coluna. Bate o olho e sabe o que está travado, o que está atrasado e o que já pode faturar.",
      },
      {
        icone: "calendar",
        titulo: "A semana já montada",
        texto:
          "Os compromissos aparecem junto com o cliente e o pedido relacionado. Chega de descobrir a reunião quinze minutos antes.",
      },
    ],
  },

  /** Dobra 3: como funciona */
  comoFunciona: {
    titulo: "Três passos e você tá rodando",
    subtitulo: "Sem migração complicada, sem treinamento de duas semanas.",
    passos: [
      {
        numero: "01",
        titulo: "Seus clientes entram em dez minutos",
        texto: "Importe de uma planilha ou cadastre na mão. Não tem migração, não precisa de ajuda.",
      },
      {
        numero: "02",
        titulo: "O quadro vira o seu processo",
        texto: "Arraste os pedidos entre as colunas conforme o trabalho anda. É o seu jeito, não o nosso.",
      },
      {
        numero: "03",
        titulo: "De manhã você já sabe onde pisar",
        texto: "Os números se atualizam sozinhos. Você abre o painel e vê o que travou e o que já pode faturar.",
      },
    ],
  },

  /** Dobra 4: planos */
  precos: {
    titulo: "Preço que cabe em quem está começando",
    subtitulo: "Sem fidelidade. Cancele quando quiser.",
    /** Selo do plano com `destaque: true`. Só um plano deveria usá-lo. */
    selo: "Mais escolhido",
    planos: [
      {
        nome: "Começo",
        preco: "R$ 0",
        periodo: "para sempre",
        descricao: "Pra quem está organizando a casa.",
        recursos: ["Até 20 clientes", "Pedidos ilimitados", "Agenda simples", "1 usuário"],
        cta: "Começar de graça",
        destaque: false,
      },
      {
        nome: "Operação",
        preco: "R$ 89",
        periodo: "por mês",
        descricao: "Pra quem já tem time e volume.",
        recursos: [
          "Clientes ilimitados",
          "Quadro personalizável",
          "Relatórios mensais",
          "Até 5 usuários",
          "Suporte por WhatsApp",
        ],
        cta: "Começar teste de 14 dias",
        destaque: true,
      },
      {
        nome: "Escala",
        preco: "R$ 249",
        periodo: "por mês",
        descricao: "Pra operações com vários times.",
        recursos: [
          "Tudo do Operação",
          "Usuários ilimitados",
          "Integrações via API",
          "Gerente de conta",
          "SLA de 4 horas",
        ],
        cta: "Falar com vendas",
        destaque: false,
      },
    ],
  },

  /** Dobra 5: time */
  time: {
    titulo: "Quem está por trás",
    subtitulo: "Um time pequeno que já operou o problema que resolve.",
    pessoas: [
      {
        nome: "Ana Ribeiro",
        cargo: "Produto",
        bio: "Passou seis anos gerenciando operação de agência antes de decidir construir a ferramenta que faltava.",
        iniciais: "AR",
      },
      {
        nome: "Bruno Salles",
        cargo: "Engenharia",
        bio: "Construiu sistemas internos para logística e saúde. Gosta de software que some na frente do usuário.",
        iniciais: "BS",
      },
      {
        nome: "Clara Fontes",
        cargo: "Atendimento",
        bio: "Atende cada cliente novo pessoalmente na primeira semana. Conhece o produto melhor que qualquer um.",
        iniciais: "CF",
      },
    ],
  },

  rodape: {
    texto: "Feito pra quem toca a operação todo dia.",
    navegacao: "Links do rodapé",
    links: [
      { rotulo: "Termos", href: "#" },
      { rotulo: "Privacidade", href: "#" },
      { rotulo: "Contato", href: "#" },
    ],
  },
}

/** Rótulos do sistema. Renomeie aqui e o menu, os títulos e os vazios acompanham. */
export const sistema = {
  nav: [
    { rotulo: "Painel", href: "/app", icone: "layout-dashboard" },
    { rotulo: "Clientes", href: "/app/clientes", icone: "users" },
    { rotulo: "Pedidos", href: "/app/pedidos", icone: "kanban" },
    { rotulo: "Agenda", href: "/app/agenda", icone: "calendar" },
    { rotulo: "Configurações", href: "/app/configuracoes", icone: "settings" },
  ],

  /**
   * Textos da casca da área logada (menu, topo, estados de carregamento).
   * A maioria vira nome acessível de botão só-ícone. Se apagar, o leitor de
   * tela fica sem saber o que o botão faz.
   */
  casca: {
    navegacao: "Navegação principal",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    pularParaConteudo: "Pular para o conteúdo",
    carregando: "Carregando o painel",
    sair: "Sair",
  },

  entidades: {
    cliente: { singular: "cliente", plural: "clientes", artigo: "o" },
    pedido: { singular: "pedido", plural: "pedidos", artigo: "o" },
    agendamento: { singular: "compromisso", plural: "compromissos", artigo: "o" },
  },

  etapas: {
    novo: "Novo",
    em_andamento: "Em andamento",
    aguardando: "Aguardando",
    concluido: "Concluído",
  },

  vazios: {
    clientes: {
      titulo: "Nenhum cliente ainda",
      texto: "Cadastre o primeiro e ele aparece aqui com histórico e contato.",
      acao: "Cadastrar cliente",
    },
    pedidos: {
      titulo: "O quadro está limpo",
      texto: "Crie um pedido e arraste entre as colunas conforme o trabalho anda.",
      acao: "Criar pedido",
    },
    agenda: {
      titulo: "Semana livre",
      texto: "Nenhum compromisso marcado. Aproveite, ou marque o primeiro.",
      acao: "Marcar compromisso",
    },
  },

  /**
   * Painel (`/app`), a primeira tela depois do login.
   *
   * Os números são todos calculados a partir dos dados; aqui moram só os rótulos
   * e as `dica`, que respondem "de onde saiu esse número?". É essa frase que
   * separa um painel de um enfeite com números grandes.
   */
  painel: {
    saudacao: {
      manha: "Bom dia",
      tarde: "Boa tarde",
      noite: "Boa noite",
      /** `{saudacao}` e `{nome}` são trocados na hora. Sem nome, fica só a saudação. */
      comNome: "{saudacao}, {nome}",
    },

    metricas: {
      clientesAtivos: {
        icone: "users",
        rotulo: "Clientes ativos",
        dica: "Com status ativo",
      },
      pedidosEmAndamento: {
        icone: "kanban",
        rotulo: "Pedidos em andamento",
        dica: "Novos, em andamento e aguardando",
      },
      valorEmAberto: {
        icone: "dinheiro",
        rotulo: "Valor em aberto",
        dica: "Soma dos pedidos ainda não concluídos",
      },
      compromissosDaSemana: {
        icone: "calendar",
        rotulo: "Compromissos na semana",
        dica: "De hoje até os próximos sete dias",
      },
    },

    grafico: {
      titulo: "Pedidos por etapa",
      descricao: "Onde o trabalho está parado agora.",
      /** Curto e sem botão de propósito: o convite para criar já está em "Pedidos recentes". */
      vazio: "Sem pedido nenhum para medir ainda",
    },

    compromissos: {
      titulo: "Próximos compromissos",
      descricao: "Os quatro primeiros da fila.",
      hoje: "Hoje",
      verTodos: "Ver a agenda",
    },

    recentes: {
      titulo: "Pedidos recentes",
      descricao: "Os cinco últimos que entraram.",
      verTodos: "Ver todos os pedidos",
    },

    /** Pedido ou compromisso que aponta para um cliente que já foi apagado. */
    semCliente: "Cliente removido",

    vazio: {
      titulo: "Seu painel está esperando o primeiro dado",
      texto:
        "Cadastre um cliente e os números, o gráfico e a agenda começam a aparecer aqui sozinhos.",
      acao: "Cadastrar cliente",
    },
  },

  /**
   * A lista de clientes.
   *
   * A ordem aqui espelha a ordem da tela: topo, filtros, formulário, painel de
   * detalhe, remoção. Achar o texto que você quer trocar é ler de cima pra baixo.
   */
  clientes: {
    titulo: "Clientes",
    descricao: "Quem você atende, com contato, situação e o que está em andamento com cada um.",
    novo: "Novo cliente",

    /** Os três status do modelo de dados, com o nome que faz sentido aqui. */
    status: {
      ativo: "Ativo",
      pendente: "Pendente",
      inativo: "Inativo",
    },

    filtros: {
      buscar: "Buscar por nome, empresa ou e-mail",
      status: "Filtrar por situação",
      todos: "Todas as situações",
      limpar: "Limpar filtros",
    },

    /** Vazio diferente do de `vazios.clientes`: aqui existe cadastro, o filtro é que esconde. */
    semResultado: {
      titulo: "Nenhum cliente encontrado",
      texto: "Nenhum cadastro combina com a busca e o filtro de agora.",
    },

    formulario: {
      tituloCriar: "Novo cliente",
      descricaoCriar: "Só o nome e o e-mail são obrigatórios. O resto você completa quando souber.",
      criar: "Cadastrar cliente",
      salvar: "Salvar alterações",
      campos: {
        nome: "Nome",
        empresa: "Empresa",
        email: "E-mail",
        telefone: "Telefone",
        status: "Situação",
        observacoes: "Observações",
      },
      exemploNome: "Ex.: Marina Alvarenga",
      exemploEmpresa: "Ex.: Estúdio Clara",
      exemploEmail: "Ex.: marina@estudioclara.com.br",
      exemploTelefone: "(00) 00000-0000",
      exemploObservacoes: "Ex.: prefere contato por WhatsApp, fecha contrato no começo do mês.",
      ajudaTelefone: "Celular ou fixo, com DDD.",
      erros: {
        nome: "Informe o nome do cliente.",
        emailVazio: "Informe o e-mail.",
        emailInvalido: "E-mail inválido. Exemplo: nome@empresa.com.br",
        telefone: "Telefone incompleto. Informe o DDD e o número.",
      },
    },

    detalhe: {
      dados: "Dados do cliente",
      desde: "Cliente desde",
      pedidos: "Pedidos",
      semPedidos: "Nenhum pedido para este cliente ainda.",
      agendamentos: "Compromissos",
      semAgendamentos: "Nenhum compromisso marcado com este cliente.",
    },

    remocao: {
      titulo: "Remoção",
      aviso: "Apaga o cadastro junto com os pedidos e os compromissos vinculados a ele.",
      acao: "Remover cliente",
      confirmarTitulo: "Remover este cliente?",
      confirmarTexto:
        "O cadastro, os pedidos e os compromissos vinculados vão embora juntos. Não dá para desfazer.",
      confirmar: "Remover",
    },
  },

  /**
   * Tela de Agenda.
   *
   * `{dia}` é um marcador trocado pelo valor real na hora de exibir. Fica aqui,
   * e não montado no componente, pra que a frase inteira continue ajustável
   * numa linha só.
   */
  agenda: {
    titulo: "Agenda",
    descricao: "A semana inteira à vista, com cliente, horário e local em cada compromisso.",
    novo: "Novo compromisso",

    visao: {
      rotulo: "Modo de exibição",
      semana: "Semana",
      lista: "Lista",
    },

    semana: {
      anterior: "Semana anterior",
      proxima: "Próxima semana",
      hoje: "Hoje",
      novoNoDia: "Novo compromisso em {dia}",
      diaLivre: "Livre",
    },

    /** A contagem de cada dia sai de `entidades.agendamento`, não se repete aqui. */
    lista: {
      hoje: "Hoje",
    },

    cartao: {
      editar: "Editar compromisso",
      semCliente: "Cliente removido",
    },

    /** Situação do compromisso. Reaproveita os três status do modelo de dados. */
    status: {
      ativo: "Confirmado",
      pendente: "A confirmar",
      inativo: "Cancelado",
    },

    formulario: {
      tituloCriar: "Novo compromisso",
      tituloEditar: "Editar compromisso",
      descricaoCriar: "Reserve o horário e escolha quem você vai atender.",
      descricaoEditar: "Ajuste o que mudou, ou tire o compromisso da agenda.",
      criar: "Marcar compromisso",
      salvar: "Salvar alterações",
      remover: "Remover",
      campos: {
        titulo: "Título",
        cliente: "Cliente",
        data: "Data",
        hora: "Início",
        duracao: "Duração",
        local: "Local",
        status: "Situação",
      },
      exemploTitulo: "Ex.: Apresentação da proposta",
      exemploLocal: "Ex.: Google Meet, telefone, escritório",
      semClientes: "Cadastre um cliente primeiro. Todo compromisso tem alguém do outro lado.",
      erros: {
        titulo: "Dê um nome ao compromisso.",
        cliente: "Escolha o cliente.",
        data: "Informe a data.",
        hora: "Informe o horário de início.",
      },
      duracoes: [
        { valor: "15", rotulo: "15 minutos" },
        { valor: "30", rotulo: "30 minutos" },
        { valor: "45", rotulo: "45 minutos" },
        { valor: "60", rotulo: "1 hora" },
        { valor: "90", rotulo: "1h30" },
      ],
    },

    remocao: {
      titulo: "Remover este compromisso?",
      texto: "Ele sai da agenda na hora, e não dá para desfazer.",
      confirmar: "Remover",
    },
  },

  /**
   * O quadro de pedidos.
   *
   * Os nomes das colunas ficam em `etapas`, logo acima. Aqui está o que
   * envolve o quadro: ações, cartão, formulário e mensagens.
   */
  pedidos: {
    titulo: "Pedidos",
    descricao:
      "Arraste os cartões entre as colunas conforme o trabalho anda. Sem mouse? Cada cartão tem o botão Mover.",
    novo: "Novo pedido",
    /** Vira o nome do botão “+” de cada coluna: “Novo pedido em Aguardando”. */
    novoNaColuna: "Novo pedido em",
    editar: "Editar pedido",
    criar: "Criar pedido",
    salvar: "Salvar alterações",
    mover: "Mover",
    moverPara: "Mover para",
    etapaAtual: "Etapa atual",
    /** Anunciado por leitor de tela depois de mover: “… para Em andamento: Título”. */
    avisoMovido: "Pedido movido para",
    colunaVazia: "Nada nesta coluna",
    soltarAqui: "Solte aqui",
    somaDaColuna: "Soma da coluna",
    atrasado: "Atrasado",
    semCliente: "Sem cliente",
    /** Prefixo do campo de valor. Troque junto com a moeda em `formato.ts`. */
    simboloMoeda: "R$",

    prioridades: {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
    },

    campos: {
      titulo: "Título",
      cliente: "Cliente",
      valor: "Valor",
      prioridade: "Prioridade",
      prazo: "Prazo",
      descricao: "Descrição",
      etapa: "Etapa",
    },

    ajudas: {
      valor: "Use vírgula para os centavos: 1.200,50.",
      descricao: "Opcional. O combinado, em uma linha.",
      semClientes: "Cadastre um cliente antes de criar o pedido.",
    },

    erros: {
      titulo: "Dê um nome ao pedido.",
      cliente: "Escolha de quem é este pedido.",
      valor: "Informe um valor de zero para cima.",
      prazo: "Informe a data de entrega.",
    },

    remocao: {
      acao: "Remover",
      titulo: "Remover este pedido?",
      texto: "Ele sai do quadro na hora, e não dá para desfazer.",
      confirmar: "Remover pedido",
    },
  },

  /**
   * Microcopy dos primitivos de UI (botão fechar, busca, confirmação…).
   *
   * Fica aqui pelo mesmo motivo do resto: nenhum texto solto dentro de
   * componente. Trocar "Cancelar" por "Voltar" é uma linha, não uma varredura.
   */
  acoes: {
    fechar: "Fechar",
    cancelar: "Cancelar",
    confirmar: "Confirmar",
    limpar: "Limpar",
    buscar: "Buscar",
    selecione: "Selecione…",
  },

  /**
   * Tela de configurações.
   *
   * É onde a pessoa troca o design system, zera os dados para estudar os
   * estados vazios e ajusta o próprio nome. Os textos aqui explicam MUITO, e é
   * de propósito: metade dessa tela é material de aula.
   */
  configuracoes: {
    titulo: "Configurações",
    descricao:
      "O visual, os dados e o seu perfil. Tudo o que muda o app sem você escrever uma linha de código.",

    tema: {
      titulo: "Design system",
      descricao:
        "71 identidades prontas, tiradas de produtos reais. Clique em uma e o app inteiro se repinta na hora.",
      rotuloBusca: "Buscar design system",
      placeholderBusca: "Buscar por nome…",
      sufixoContagem: "sistemas",
      rotuloGrade: "Design systems disponíveis",
      selo: { claro: "Claro", escuro: "Escuro" },
      emUso: "Em uso",
      previaAtual: "Prévia aplicada:",
      previaPadrao: "Você está vendo o visual padrão do projeto.",
      voltarPadrao: "Voltar ao padrão",
      vazio: {
        titulo: "Nenhum sistema com esse nome",
        texto: "Tente só um pedaço: “stri” acha o Stripe, “ver” acha o Vercel e o The Verge.",
      },
      aviso: {
        titulo: "Isto aqui é uma prévia",
        texto:
          "A troca vale só neste navegador e some se você limpar os dados do site. Pra ele valer no projeto inteiro (landing, sistema e Storybook), cole o JSON abaixo no design-system.json da raiz.",
      },
      json: {
        titulo: "O JSON deste sistema",
        texto:
          "Substitua o conteúdo do design-system.json na raiz do projeto por este. As cores que faltavam no catálogo já vêm calculadas.",
        rotuloBloco: "Conteúdo do design-system.json",
        copiar: "Copiar JSON",
        copiado: "Copiado!",
        erro: "Não deu para copiar. Selecione o texto e use Ctrl+C.",
      },
    },

    dados: {
      titulo: "Dados de exemplo",
      descricao:
        "O app guarda tudo no seu navegador, sem servidor. Estes dois botões mexem em tudo de uma vez.",
      restaurar: "Restaurar exemplos",
      limpar: "Limpar tudo",
      dicaVazios:
        "Limpar tudo deixa o app zerado. É assim que você vê os estados vazios de cada tela. Eles costumam ser a parte mais esquecida de um produto e a mais interessante de redesenhar.",
      confirmarRestaurar: {
        titulo: "Restaurar os dados de exemplo?",
        texto:
          "Os clientes, pedidos e compromissos que você criou ou editou somem, e os originais voltam.",
        confirmar: "Restaurar",
      },
      confirmarLimpar: {
        titulo: "Apagar todos os dados?",
        texto:
          "As três listas ficam vazias. Dá para trazer os exemplos de volta depois, mas o que você editou não volta.",
        confirmar: "Apagar tudo",
      },
    },

    perfil: {
      titulo: "Perfil",
      descricao:
        "O nome que aparece no topo do app. Não existe conta nem servidor por trás disso: é uma sessão guardada no seu navegador.",
      nome: "Nome",
      email: "E-mail",
      ajudaEmail: "Fica só no seu navegador. Nada é enviado para lugar nenhum.",
      salvar: "Salvar alterações",
      salvo: "Perfil atualizado.",
      sair: "Sair da sessão",
      erros: {
        nome: "Escreva pelo menos duas letras.",
        email: "Escreva um e-mail válido, como voce@exemplo.com.",
      },
    },
  },
}

/**
 * A porta de entrada (`/entrar`).
 *
 * O passo a passo do Google mora aqui, e não dentro do modal, pelo mesmo motivo
 * do resto do arquivo: trocar de provedor (ou traduzir o tutorial) é editar
 * texto, não abrir componente.
 */
export const entrada = {
  voltar: "Voltar para o site",

  titulo: "Sua operação organizada em um clique",
  subtitulo:
    "Sem cadastro, sem senha, sem e-mail de confirmação. O app roda no seu navegador e os dados ficam guardados aí mesmo.",

  google: {
    botao: "Continuar com Google",
    /** Fica abaixo do botão quando as chaves NÃO estão no ambiente. */
    ajuda: "Ainda não está conectado. O botão mostra o passo a passo de configuração.",
    /** E este quando estão: aí o botão faz login de verdade. */
    ajudaLigado: "Você vai para o Google escolher a conta e volta para cá já dentro do app.",

    /**
     * O que aparece quando uma volta do Google não deu certo. A chave é o
     * `?google=` do endereço, escrito pelas rotas de `src/app/api/auth`.
     * Motivo que não estiver nesta lista não vira mensagem nenhuma: o endereço
     * é editável por qualquer pessoa, e texto vindo de lá não entra na tela.
     */
    avisos: {
      cancelado: "Você fechou a tela do Google antes de escolher a conta. Pode tentar de novo.",
      expirado: "A tentativa demorou demais e expirou por segurança. Clique de novo no botão.",
      incompleto: "O Google devolveu uma resposta incompleta. Tente mais uma vez.",
      falhou:
        "O Google recusou as credenciais deste app. Confira o Client ID, o Client Secret e o endereço de retorno cadastrado.",
      indisponivel:
        "O login com Google ainda não está configurado neste app. Use a entrada sem senha por enquanto.",
    },
  },

  separador: "ou",

  campos: {
    nome: {
      rotulo: "Seu nome",
      placeholder: "Ana Ribeiro",
      ajuda: "Opcional. É o nome que aparece no topo do painel.",
    },
    email: {
      rotulo: "Seu e-mail",
      placeholder: "ana@estudio.com.br",
      ajuda: "Opcional. Fica só no seu navegador, e nenhuma mensagem é enviada.",
      erro: "Esse e-mail parece incompleto. Confira o @ e o domínio, ou deixe o campo em branco.",
    },
  },

  entrarDireto: "Entrar direto (sem senha)",
  aviso:
    "Isto não é autenticação de verdade: a sessão fica salva no seu navegador e some quando você limpa os dados do site.",

  modalGoogle: {
    titulo: "Como conectar o Google de verdade",
    descricao:
      "São sete passos no Google Cloud Console. Você faz uma vez, guarda as duas chaves no projeto e o botão passa a funcionar.",

    passos: [
      {
        titulo: "Abra o Google Cloud Console",
        texto:
          "É o painel onde o Google guarda as credenciais dos seus projetos. Entre com a mesma conta que você já usa no dia a dia.",
        link: {
          rotulo: "Abrir o Console do Google",
          href: "https://console.cloud.google.com/apis/credentials",
        },
        codigo: "https://console.cloud.google.com/apis/credentials",
        codigoRotulo: "Endereço",
      },
      {
        titulo: "Crie um projeto",
        texto:
          "No seletor de projetos, no topo da página, escolha “Novo projeto”. O nome é só pra você se achar depois, então pode ser o nome do seu app.",
        codigo: "Órbita workshop",
        codigoRotulo: "Nome sugerido",
      },
      {
        titulo: "Crie um ID do cliente OAuth",
        texto:
          "No menu lateral, siga o caminho abaixo. Se o Google pedir para configurar a tela de consentimento antes, escolha “Externo” e preencha só o nome do app e o seu e-mail de contato.",
        codigo: "Credenciais → Criar credenciais → ID do cliente OAuth",
        codigoRotulo: "Caminho no menu",
      },
      {
        titulo: "Escolha o tipo de aplicativo",
        texto:
          "No campo “Tipo de aplicativo”, selecione a opção abaixo. É ela que libera os dois campos dos próximos passos.",
        codigo: "Aplicativo da Web",
        codigoRotulo: "Tipo de aplicativo",
      },
      {
        titulo: "Autorize o endereço do seu app",
        texto:
          "Em “Origens JavaScript autorizadas”, clique em “Adicionar URI” e cole o endereço abaixo. É o endereço do app rodando na sua máquina.",
        codigo: "http://localhost:3000",
        codigoRotulo: "Origens JavaScript autorizadas",
      },
      {
        titulo: "Autorize o endereço de retorno",
        texto:
          "Em “URIs de redirecionamento autorizados”, clique em “Adicionar URI” e cole o endereço abaixo. É para onde o Google devolve a pessoa depois do login, e precisa bater caractere por caractere.",
        codigo: "http://localhost:3000/api/auth/callback/google",
        codigoRotulo: "URIs de redirecionamento autorizados",
      },
      {
        titulo: "Guarde as duas chaves no projeto",
        texto:
          "Ao salvar, o Google mostra o Client ID e o Client Secret. Crie um arquivo chamado .env.local na raiz do projeto e cole as três linhas abaixo, trocando o texto depois do “=” pelos valores que apareceram. A terceira é sua, e não vem do Google: é o segredo que assina a sua sessão, e pode ser qualquer texto embaralhado com 32 letras ou mais (no terminal, openssl rand -base64 32 gera um). Depois pare o servidor e rode npm run dev de novo.",
        codigo:
          "GOOGLE_CLIENT_ID=cole-aqui-o-seu-client-id\nGOOGLE_CLIENT_SECRET=cole-aqui-o-seu-client-secret\nAUTH_SECRET=cole-aqui-um-texto-aleatorio-longo",
        codigoRotulo: ".env.local",
      },
    ],

    nota: "O .env.local não vai para o Git, e não deve ir. O Client Secret é uma senha: se ele vazar, gere outro no mesmo lugar em que criou.",

    aviso:
      "Assim que as três linhas estiverem no .env.local, este botão passa a fazer login de verdade, sem você mexer em código nenhum. Enquanto isso, use o botão abaixo pra entrar direto.",

    fechar: "Entendi",
    copiar: "Copiar",
    copiado: "Copiado!",
    falhaCopia: "Não deu para copiar automaticamente. Selecione o texto acima e use Ctrl+C (ou Cmd+C).",
  },
}

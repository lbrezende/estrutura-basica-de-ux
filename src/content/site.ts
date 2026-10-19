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
  nome: "Rota Certa",
  tagline: "Toda entrega de brinquedo com prova na mão",
  descricaoCurta: "Destinatários, entregas e rotas do dia num lugar só.",
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
    eyebrow: "Pra quem entrega brinquedo na rua",
    titulo: "A entrega do brinquedo, comprovada na hora",
    subtitulo:
      "Ocorrência registrada sem foto vira disputa uma semana depois. O Rota Certa junta quem recebe, o que está na rua e a rota do dia numa tela feita pra uma mão só, sol na cara e sinal fraco.",
    ctaPrimario: "Começar agora",
    ctaSecundario: "Ver como funciona",
    provaSocial: "Usado por mais de 400 entregadores de brinquedo no Brasil",
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
      "Prévia do painel do Rota Certa: o resumo do dia, as entregas por situação e as rotas do dia em destaque.",
    endereco: "app.rotacerta.com.br",
    titulo: "Painel",
    periodo: "Últimos 7 dias",
    metricas: [
      { rotulo: "Destinatários ativos", valor: "38", variacao: "+12%" },
      { rotulo: "Entregas na rua", valor: "14", variacao: "+3" },
      { rotulo: "Valor em rota", valor: "R$ 47,9 mil", variacao: "+18%" },
    ],
    grafico: {
      titulo: "Entregas por situação",
      variacao: "+18%",
    },
    lista: {
      titulo: "Rotas do dia",
      itens: [
        { titulo: "Zona Sul, 12 paradas", pessoa: "Marina Alvarenga", quando: "Hoje, 07:30" },
        { titulo: "Centro e Sé, 9 paradas", pessoa: "Rafael Nogueira", quando: "Hoje, 08:00" },
        { titulo: "Zona Leste, 15 paradas", pessoa: "Camila Ishikawa", quando: "Amanhã, 07:00" },
      ],
    },
  },

  /** Dobra 2: os benefícios que o produto promete */
  beneficios: {
    titulo: "O que muda no seu dia a partir de amanhã",
    itens: [
      {
        icone: "dados",
        titulo: "Tudo num lugar só",
        texto:
          "Destinatários, entregas e rotas do dia no mesmo app. Nenhuma planilha solta, nenhum endereço perdido no grupo do WhatsApp.",
      },
      {
        icone: "check",
        titulo: "Fim da disputa",
        texto:
          "Deu problema na porta? Registra a ocorrência com foto na hora. A prova sai do celular junto com você, não uma semana depois.",
      },
      {
        icone: "usuario",
        titulo: "Interface feita pro entregador",
        texto:
          "Botão grande, alvo de toque que o dedo acerta e nada que estoure a tela pro lado. Funciona sob luz direta e com sinal fraco.",
      },
      {
        icone: "users",
        titulo: "Dá pra entregar entre amigos",
        texto:
          "Divida uma rota com quem está perto e compartilhe entregas entre famílias diferentes. O combinado fica registrado.",
      },
    ],
  },

  /** Dobra 3: como funciona */
  comoFunciona: {
    titulo: "Três passos e você tá na rua",
    subtitulo: "Sem migração complicada, sem treinamento de duas semanas.",
    passos: [
      {
        numero: "01",
        titulo: "Cadastre quem recebe",
        texto:
          "Nome, endereço, ponto de referência e telefone. Dá pra fazer na mão ou trazer de uma planilha, e leva dez minutos.",
      },
      {
        numero: "02",
        titulo: "Monte a rota do dia",
        texto:
          "As paradas de cada entregador na ordem certa. Quem está na rua abre o app e já sabe qual é a próxima porta.",
      },
      {
        numero: "03",
        titulo: "Entregue e comprove",
        texto:
          "Cada encomenda anda de situação com um toque. Se der ocorrência, a foto entra junto e a disputa acaba ali.",
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
        nome: "Carrinho",
        preco: "R$ 0",
        periodo: "para sempre",
        descricao: "Pra quem entrega sozinho e quer parar com a planilha.",
        recursos: [
          "Até 20 destinatários",
          "Entregas ilimitadas",
          "Rota do dia simples",
          "1 entregador",
        ],
        cta: "Começar de graça",
        destaque: false,
      },
      {
        nome: "Van",
        preco: "R$ 89",
        periodo: "por mês",
        descricao: "Pra quem já tem mais de um entregador na rua.",
        recursos: [
          "Destinatários ilimitados",
          "Ocorrência com foto na hora",
          "Painel com o resumo do dia",
          "Até 5 entregadores",
          "Entrega entre amigos",
        ],
        cta: "Começar teste de 14 dias",
        destaque: true,
      },
      {
        nome: "Frota",
        preco: "R$ 249",
        periodo: "por mês",
        descricao: "Pra transportadora com várias rotas no mesmo dia.",
        recursos: [
          "Tudo do Van",
          "Entregadores ilimitados",
          "Compartilhar entre famílias diferentes",
          "Integrações via API",
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
    subtitulo: "Um time pequeno que já rodou a rua que resolve.",
    pessoas: [
      {
        nome: "Ana Ribeiro",
        cargo: "Produto",
        bio: "Passou seis anos coordenando entrega de última milha antes de decidir construir a ferramenta que faltava no bolso do entregador.",
        iniciais: "AR",
      },
      {
        nome: "Bruno Salles",
        cargo: "Engenharia",
        bio: "Construiu sistemas internos para logística e transporte. Gosta de software que funciona com uma barra de sinal.",
        iniciais: "BS",
      },
      {
        nome: "Clara Fontes",
        cargo: "Atendimento",
        bio: "Passa uma manhã na rua com cada cliente novo. Conhece a rota melhor que qualquer mapa.",
        iniciais: "CF",
      },
    ],
  },

  rodape: {
    texto: "Feito pra quem passa o dia na rua entregando.",
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
    { rotulo: "Destinatários", href: "/app/clientes", icone: "users" },
    { rotulo: "Entregas", href: "/app/pedidos", icone: "kanban" },
    { rotulo: "Rotas do dia", href: "/app/agenda", icone: "calendar" },
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
    cliente: { singular: "destinatário", plural: "destinatários", artigo: "o" },
    pedido: { singular: "entrega", plural: "entregas", artigo: "a" },
    agendamento: { singular: "rota do dia", plural: "rotas do dia", artigo: "a" },
  },

  etapas: {
    novo: "A coletar",
    em_andamento: "Na rua",
    aguardando: "Com ocorrência",
    concluido: "Entregue",
  },

  vazios: {
    clientes: {
      titulo: "Nenhum destinatário ainda",
      texto: "Cadastre o primeiro e ele aparece aqui com endereço, ponto de referência e telefone.",
      acao: "Cadastrar destinatário",
    },
    pedidos: {
      titulo: "O quadro está limpo",
      texto: "Crie uma entrega e arraste entre as colunas conforme a encomenda anda.",
      acao: "Criar entrega",
    },
    agenda: {
      titulo: "Semana sem rota",
      texto: "Nenhuma rota do dia montada. Aproveite, ou monte a primeira.",
      acao: "Criar rota do dia",
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
        rotulo: "Destinatários ativos",
        dica: "Com situação ativa",
      },
      pedidosEmAndamento: {
        icone: "kanban",
        rotulo: "Entregas em aberto",
        dica: "A coletar, na rua e com ocorrência",
      },
      valorEmAberto: {
        icone: "dinheiro",
        rotulo: "Valor em rota",
        dica: "Soma declarada das entregas que ainda não chegaram",
      },
      compromissosDaSemana: {
        icone: "calendar",
        rotulo: "Rotas do dia na semana",
        dica: "De hoje até os próximos sete dias",
      },
    },

    grafico: {
      titulo: "Entregas por situação",
      descricao: "Onde a encomenda está parada agora.",
      /** Curto e sem botão de propósito: o convite para criar já está em "Entregas recentes". */
      vazio: "Sem entrega nenhuma para medir ainda",
    },

    compromissos: {
      titulo: "Rotas do dia em destaque",
      descricao: "As quatro primeiras da fila.",
      hoje: "Hoje",
      verTodos: "Ver as rotas do dia",
    },

    recentes: {
      titulo: "Entregas recentes",
      descricao: "As cinco últimas que entraram.",
      verTodos: "Ver todas as entregas",
    },

    /** Entrega ou rota do dia que aponta para um destinatário que já foi apagado. */
    semCliente: "Destinatário removido",

    vazio: {
      titulo: "Seu painel está esperando o primeiro dado",
      texto:
        "Cadastre um destinatário e os números, o gráfico e as rotas do dia começam a aparecer aqui sozinhos.",
      acao: "Cadastrar destinatário",
    },
  },

  /**
   * A lista de destinatários.
   *
   * A ordem aqui espelha a ordem da tela: topo, filtros, formulário, painel de
   * detalhe, remoção. Achar o texto que você quer trocar é ler de cima pra baixo.
   */
  clientes: {
    titulo: "Destinatários",
    descricao: "Quem recebe, com endereço, ponto de referência e telefone.",
    novo: "Novo destinatário",

    /**
     * Os três status do modelo de dados, com o nome que faz sentido aqui.
     * Curtos de propósito: o selo divide a linha com o nome no cartão, e em
     * 375px um rótulo comprido come o espaço do endereço.
     */
    status: {
      ativo: "Ativo",
      pendente: "A confirmar",
      inativo: "Inativo",
    },

    filtros: {
      buscar: "Buscar por nome, endereço ou e-mail",
      status: "Filtrar por situação",
      todos: "Todas as situações",
      limpar: "Limpar filtros",
    },

    /** Vazio diferente do de `vazios.clientes`: aqui existe cadastro, o filtro é que esconde. */
    semResultado: {
      titulo: "Nenhum destinatário encontrado",
      texto: "Nenhum cadastro combina com a busca e o filtro de agora.",
    },

    formulario: {
      tituloCriar: "Novo destinatário",
      descricaoCriar:
        "Só o nome e o e-mail são obrigatórios. O endereço e o ponto de referência você completa quando souber.",
      criar: "Cadastrar destinatário",
      salvar: "Salvar alterações",
      campos: {
        nome: "Quem recebe",
        empresa: "Endereço",
        email: "E-mail",
        telefone: "Telefone",
        status: "Situação",
        observacoes: "Ponto de referência",
      },
      exemploNome: "Ex.: Marina Alvarenga",
      exemploEmpresa: "Ex.: Rua das Acácias, 220, apto 51, Vila Mariana",
      exemploEmail: "Ex.: marina@email.com.br",
      exemploTelefone: "(00) 00000-0000",
      exemploObservacoes: "Ex.: portão verde ao lado da padaria, deixar com o zelador até as 18h.",
      ajudaTelefone: "Celular ou fixo, com DDD.",
      erros: {
        nome: "Informe o nome de quem recebe.",
        emailVazio: "Informe o e-mail.",
        emailInvalido: "E-mail inválido. Exemplo: nome@email.com.br",
        telefone: "Telefone incompleto. Informe o DDD e o número.",
      },
    },

    detalhe: {
      dados: "Dados do destinatário",
      desde: "Destinatário desde",
      pedidos: "Entregas",
      semPedidos: "Nenhuma entrega para este destinatário ainda.",
      agendamentos: "Rotas do dia",
      semAgendamentos: "Nenhuma rota do dia passa por este destinatário.",
    },

    remocao: {
      titulo: "Remoção",
      aviso: "Apaga o cadastro junto com as entregas e as rotas do dia vinculadas a ele.",
      acao: "Remover destinatário",
      confirmarTitulo: "Remover este destinatário?",
      confirmarTexto:
        "O cadastro, as entregas e as rotas do dia vinculadas vão embora juntos. Não dá para desfazer.",
      confirmar: "Remover",
    },
  },

  /**
   * Tela de rotas do dia.
   *
   * `{dia}` é um marcador trocado pelo valor real na hora de exibir. Fica aqui,
   * e não montado no componente, pra que a frase inteira continue ajustável
   * numa linha só.
   */
  agenda: {
    titulo: "Rotas do dia",
    descricao: "A semana inteira à vista, com as paradas de cada entregador na ordem certa.",
    novo: "Nova rota do dia",

    visao: {
      rotulo: "Modo de exibição",
      semana: "Semana",
      lista: "Lista",
    },

    semana: {
      anterior: "Semana anterior",
      proxima: "Próxima semana",
      hoje: "Hoje",
      novoNoDia: "Nova rota do dia em {dia}",
      diaLivre: "Sem rota",
    },

    /** A contagem de cada dia sai de `entidades.agendamento`, não se repete aqui. */
    lista: {
      hoje: "Hoje",
    },

    cartao: {
      editar: "Editar rota do dia",
      semCliente: "Destinatário removido",
    },

    /** Situação da rota do dia. Reaproveita os três status do modelo de dados. */
    status: {
      ativo: "Confirmada",
      pendente: "A confirmar",
      inativo: "Cancelada",
    },

    formulario: {
      tituloCriar: "Nova rota do dia",
      tituloEditar: "Editar rota do dia",
      descricaoCriar: "Reserve o horário de saída e escolha a parada desta rota.",
      descricaoEditar: "Ajuste o que mudou, ou tire a rota do dia do calendário.",
      criar: "Criar rota do dia",
      salvar: "Salvar alterações",
      remover: "Remover",
      campos: {
        titulo: "Rota",
        cliente: "Destinatário",
        data: "Dia",
        hora: "Saída",
        duracao: "Duração prevista",
        local: "Ponto de partida",
        status: "Situação",
      },
      exemploTitulo: "Ex.: Zona Sul, 12 paradas",
      exemploLocal: "Ex.: Galpão da Marginal, CD Tatuapé, casa do entregador",
      semClientes:
        "Cadastre um destinatário primeiro. Toda rota do dia tem uma porta do outro lado.",
      erros: {
        titulo: "Dê um nome à rota do dia.",
        cliente: "Escolha o destinatário.",
        data: "Informe o dia.",
        hora: "Informe o horário de saída.",
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
      titulo: "Remover esta rota do dia?",
      texto: "Ela sai do calendário na hora, e não dá para desfazer.",
      confirmar: "Remover",
    },
  },

  /**
   * O quadro de entregas.
   *
   * Os nomes das colunas ficam em `etapas`, logo acima. Aqui está o que
   * envolve o quadro: ações, cartão, formulário e mensagens.
   */
  pedidos: {
    titulo: "Entregas",
    descricao:
      "Cada cartão muda de situação pelo botão Mover, com uma mão só. No computador dá para arrastar entre as colunas.",
    novo: "Nova entrega",
    /** Vira o nome do botão “+” de cada coluna: “Nova entrega em Na rua”. */
    novoNaColuna: "Nova entrega em",
    editar: "Editar entrega",
    criar: "Criar entrega",
    salvar: "Salvar alterações",
    mover: "Mover",
    moverPara: "Mover para",
    etapaAtual: "Situação atual",
    /** Anunciado por leitor de tela depois de mover: “… para Na rua: Título”. */
    avisoMovido: "Entrega movida para",
    colunaVazia: "Nada nesta coluna",
    soltarAqui: "Solte aqui",
    somaDaColuna: "Soma da coluna",
    atrasado: "Atrasada",
    semCliente: "Sem destinatário",
    /** Prefixo do campo de valor. Troque junto com a moeda em `formato.ts`. */
    simboloMoeda: "R$",

    prioridades: {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
    },

    campos: {
      titulo: "O que vai na caixa",
      cliente: "Destinatário",
      valor: "Valor declarado",
      prioridade: "Prioridade",
      prazo: "Data da entrega",
      descricao: "Ocorrência e comprovante",
      etapa: "Situação",
    },

    ajudas: {
      valor: "Use vírgula para os centavos: 1.200,50.",
      descricao: "Opcional. A ocorrência e o comprovante registrados na porta, em uma linha.",
      semClientes: "Cadastre um destinatário antes de criar a entrega.",
    },

    erros: {
      titulo: "Diga o que vai na caixa.",
      cliente: "Escolha quem recebe esta entrega.",
      valor: "Informe um valor de zero para cima.",
      prazo: "Informe a data da entrega.",
    },

    remocao: {
      acao: "Remover",
      titulo: "Remover esta entrega?",
      texto: "Ela sai do quadro na hora, e não dá para desfazer.",
      confirmar: "Remover entrega",
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
          "Os destinatários, as entregas e as rotas do dia que você criou ou editou somem, e os originais voltam.",
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

  titulo: "Sua rua organizada em um clique",
  subtitulo:
    "Sem cadastro, sem senha, sem e-mail de confirmação. O app roda no seu navegador e os dados ficam guardados aí mesmo.",

  google: {
    botao: "Continuar com Google",
    /** Fica abaixo do botão: promete menos do que o botão sugere, de propósito. */
    ajuda: "Ainda não está conectado. O botão mostra o passo a passo de configuração.",
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
      placeholder: "ana@rotacerta.com.br",
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
        codigo: "Rota Certa workshop",
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
          "Ao salvar, o Google mostra o Client ID e o Client Secret. Crie um arquivo chamado .env.local na raiz do projeto, cole as duas linhas abaixo e troque o texto depois do “=” pelos valores que apareceram. Depois pare o servidor e rode npm run dev de novo.",
        codigo:
          "GOOGLE_CLIENT_ID=cole-aqui-o-seu-client-id\nGOOGLE_CLIENT_SECRET=cole-aqui-o-seu-client-secret",
        codigoRotulo: ".env.local",
      },
    ],

    nota: "O .env.local não vai para o Git, e não deve ir. O Client Secret é uma senha: se ele vazar, gere outro no mesmo lugar em que criou.",

    aviso:
      "Conectar o Google de verdade é assunto do workshop. Por enquanto, use o botão abaixo pra entrar direto.",

    fechar: "Entendi",
    copiar: "Copiar",
    copiado: "Copiado!",
    falhaCopia: "Não deu para copiar automaticamente. Selecione o texto acima e use Ctrl+C (ou Cmd+C).",
  },
}

/**
 * O texto do tour de boas-vindas.
 *
 * Ele roda uma vez, na primeira visita, e ATRAVESSA PÁGINAS: começa no site,
 * continua dentro do app e termina lá. A última parada é de propósito: ela
 * conta que o tour inteiro é código do projeto e pode ser mudado ou removido a
 * pedido, porque quem abriu este app tem que sair sabendo que manda nele.
 *
 * `pagina` é o endereço onde a parada acontece, e ele vale também pras telas de
 * dentro dele: "/app" acontece em "/app/clientes" também. Vazio significa "onde
 * a pessoa estiver". As paradas seguem a ordem desta lista, então elas são
 * também o roteiro da jornada: site, depois app.
 *
 * `alvo` é um seletor de CSS. Parada sem alvo aparece no centro da tela. Se o
 * alvo não existir na página (você renomeou a tela, tirou o menu), a parada é
 * PULADA em vez de quebrar o tour: veja `tour.tsx`.
 */

export const tour = {
  /** Nome dos controles do próprio tour. */
  proximo: "Próximo",
  anterior: "Voltar",
  fechar: "Fechar",
  concluir: "Entendi, quero explorar",

  /** Botão que existe na tela de configurações pra rodar o tour de novo. */
  rever: {
    titulo: "Rever as boas-vindas",
    texto: "Roda de novo aquele passo a passo que apareceu na primeira vez que você entrou.",
    acao: "Ver de novo",
  },

  paradas: [
    {
      pagina: "/",
      alvo: "[data-tour='entrar']",
      titulo: "Esta página é sua, e ela já está de pé",
      texto:
        "O que você está vendo não é maquete: é um site funcionando, com o sistema inteiro atrás dele. Quer ver por dentro? Clica em entrar, que eu continuo lá.",
    },
    {
      pagina: "/app",
      alvo: "[data-tour='menu']",
      titulo: "Aqui ficam as áreas do sistema",
      texto:
        "Cada item leva pra uma tela completa, com listagem, cadastro, busca e os estados de quando não tem nada ainda. Clique à vontade depois: não tem como quebrar nada.",
    },
    {
      pagina: "/app",
      alvo: "[data-tour='conteudo']",
      titulo: "E aqui é onde o trabalho acontece",
      texto:
        "Os dados que aparecem são exemplos, pra você ver o sistema cheio em vez de vazio. Cadastre, edite e apague sem medo. Na tela de configurações tem um botão que devolve tudo ao estado original.",
    },
    {
      pagina: "/app",
      alvo: "[data-tour='perfil']",
      titulo: "Sua conta fica no topo",
      texto:
        "Se o login com Google estiver ligado, é a sua conta de verdade que aparece aqui. Se não estiver, é a entrada sem senha, e a tela de entrar ensina o que falta pra ligar.",
    },
    {
      pagina: "/app",
      alvo: null,
      titulo: "Uma última coisa, que é a mais importante",
      texto:
        "Este passo a passo é código dentro do seu projeto, igual ao resto. Você pode pedir pra sua IA mudar o texto, incluir uma parada nova ou tirar o tour inteiro. É assim com qualquer coisa daqui: o sistema inteiro é seu pra mexer.",
    },
  ],
}

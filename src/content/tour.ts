/**
 * O texto do tour de boas-vindas.
 *
 * Ele roda uma vez, na primeira vez que a pessoa entra no app, e explica o que
 * está pronto e o que ela vai construir. A última parada é de propósito: ela
 * conta que o tour inteiro é código do projeto e pode ser mudado ou removido a
 * pedido, porque a pessoa que abriu este app tem que sair sabendo que manda
 * nele.
 *
 * `alvo` é um seletor de CSS. Parada sem alvo aparece no centro da tela. Se o
 * alvo não existir (você renomeou a tela, tirou o menu), a parada é PULADA em
 * vez de quebrar o tour: veja `tour.tsx`.
 */

export const tour = {
  /** Nome acessível dos controles do próprio tour. */
  proximo: "Próximo",
  anterior: "Voltar",
  fechar: "Fechar",
  concluir: "Entendi, quero explorar",
  progresso: "{{current}} de {{total}}",

  /** Botão que existe na tela de configurações pra rodar o tour de novo. */
  rever: {
    titulo: "Rever as boas-vindas",
    texto: "Roda de novo aquele passo a passo que apareceu na primeira vez que você entrou.",
    acao: "Ver de novo",
  },

  paradas: [
    {
      alvo: null,
      titulo: "Este app é seu, e ele já está de pé",
      texto:
        "O que você está vendo não é maquete: é um aplicativo funcionando, com telas, cadastros e dados que respondem de verdade. Em trinta segundos eu te mostro onde está cada coisa.",
    },
    {
      alvo: "[data-tour='menu']",
      titulo: "Aqui ficam as áreas do app",
      texto:
        "Cada item leva pra uma tela completa, com listagem, cadastro, busca e os estados de quando não tem nada ainda. Clique à vontade depois: não tem como quebrar nada.",
    },
    {
      alvo: "[data-tour='conteudo']",
      titulo: "E aqui é onde o trabalho acontece",
      texto:
        "Os dados que aparecem são exemplos, pra você ver o app cheio em vez de vazio. Cadastre, edite e apague sem medo. Na tela de configurações tem um botão que devolve tudo ao estado original.",
    },
    {
      alvo: "[data-tour='perfil']",
      titulo: "Sua conta fica no topo",
      texto:
        "Se o login com Google estiver ligado, é a sua conta de verdade que aparece aqui. Se não estiver, é a entrada sem senha, e a tela de entrar ensina o que falta pra ligar.",
    },
    {
      alvo: null,
      titulo: "Uma última coisa, que é a mais importante",
      texto:
        "Este passo a passo é código dentro do seu projeto, igual ao resto. Você pode pedir pra sua IA mudar o texto, incluir uma parada nova ou tirar o tour inteiro. É assim com qualquer coisa daqui: o app inteiro é seu pra mexer.",
    },
  ],
}

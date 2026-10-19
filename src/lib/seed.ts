import type { Dados } from "./types"

/**
 * Dados de exemplo carregados no primeiro acesso.
 *
 * Existe por um motivo de UX: um app vazio na primeira abertura parece quebrado.
 * Com dados dentro, dá pra ver as telas funcionando de verdade. E dá pra
 * testar com uma pessoa, que é o que o briefing vai pedir.
 *
 * Há um botão em Configurações para limpar tudo e ver os estados vazios.
 *
 * Aqui `clientes` são os DESTINATÁRIOS (`empresa` guarda o endereço e
 * `observacoes` o ponto de referência), `pedidos` são as ENTREGAS e
 * `agendamentos` são as ROTAS DO DIA. Os rótulos vivem em `src/content/site.ts`.
 */
export const SEED: Dados = {
  clientes: [
    {
      id: "cli-1",
      nome: "Marina Alvarenga",
      email: "marina.alvarenga@email.com.br",
      telefone: "(11) 98844-2130",
      empresa: "Rua das Acácias, 220, apto 51 — Vila Mariana, São Paulo",
      status: "ativo",
      observacoes: "Portão verde ao lado da padaria. Se não atender, deixar com o zelador até as 18h.",
      criadoEm: "2026-05-12T09:20:00.000Z",
    },
    {
      id: "cli-2",
      nome: "Rafael Nogueira",
      email: "rafael.nogueira@email.com.br",
      telefone: "(21) 99712-0044",
      empresa: "Av. Nossa Senhora de Copacabana, 1417, sala 3 — Copacabana, Rio de Janeiro",
      status: "ativo",
      observacoes: "Prédio comercial. A portaria só recebe caixa até as 17h, e pede assinatura.",
      criadoEm: "2026-06-02T14:05:00.000Z",
    },
    {
      id: "cli-3",
      nome: "Juliana Prado",
      email: "juliana.prado@email.com",
      telefone: "(31) 98120-7788",
      empresa: "Rua Timbiras, 890, casa 2 — Funcionários, Belo Horizonte",
      status: "pendente",
      observacoes: "Número da casa não bate com o mapa. Confirmar por telefone antes de sair.",
      criadoEm: "2026-06-18T11:40:00.000Z",
    },
    {
      id: "cli-4",
      nome: "Otávio Bezerra",
      email: "otavio.bezerra@email.com.br",
      telefone: "(85) 99433-1276",
      empresa: "Rua Ana Bilhar, 74 — Meireles, Fortaleza",
      status: "inativo",
      observacoes: "Mudou de endereço em maio. Não entregar até o cadastro novo chegar.",
      criadoEm: "2026-03-07T16:15:00.000Z",
    },
    {
      id: "cli-5",
      nome: "Camila Ishikawa",
      email: "camila.ishikawa@email.com.br",
      telefone: "(41) 98877-6501",
      empresa: "Rua Trajano Reis, 310, bloco B — São Francisco, Curitiba",
      status: "ativo",
      observacoes: "Condomínio com dois portões. Usar o da esquerda, o da direita fica trancado.",
      criadoEm: "2026-07-01T08:30:00.000Z",
    },
  ],
  pedidos: [
    {
      id: "ped-1",
      titulo: "Triciclo vermelho, caixa grande",
      clienteId: "cli-1",
      etapa: "em_andamento",
      valor: 389.9,
      prioridade: "alta",
      prazo: "2026-08-14",
      descricao: "Caixa alta, não deitar. Aniversário no sábado.",
      criadoEm: "2026-07-02T10:00:00.000Z",
    },
    {
      id: "ped-2",
      titulo: "Kit de blocos de montar, 500 peças",
      clienteId: "cli-2",
      etapa: "novo",
      valor: 249,
      prioridade: "media",
      prazo: "2026-08-30",
      descricao: "Coletar no galpão da Marginal junto com a rota da manhã.",
      criadoEm: "2026-07-18T13:25:00.000Z",
    },
    {
      id: "ped-3",
      titulo: "Casinha de boneca desmontada",
      clienteId: "cli-3",
      etapa: "aguardando",
      valor: 720.5,
      prioridade: "baixa",
      prazo: "2026-09-05",
      descricao:
        "Ocorrência: ninguém na porta às 14h20. Foto do portão fechado anexada. Reagendar com a destinatária.",
      criadoEm: "2026-06-20T09:10:00.000Z",
    },
    {
      id: "ped-4",
      titulo: "Pista de carrinhos com looping",
      clienteId: "cli-5",
      etapa: "em_andamento",
      valor: 515,
      prioridade: "alta",
      prazo: "2026-09-20",
      descricao: "Duas caixas, entregar juntas. Portão da esquerda.",
      criadoEm: "2026-07-05T15:45:00.000Z",
    },
    {
      id: "ped-5",
      titulo: "Ursinho de pelúcia grande",
      clienteId: "cli-1",
      etapa: "concluido",
      valor: 179.9,
      prioridade: "media",
      prazo: "2026-07-10",
      descricao: "Entregue em mãos às 11h05. Foto do comprovante assinado registrada.",
      criadoEm: "2026-06-01T08:00:00.000Z",
    },
    {
      id: "ped-6",
      titulo: "Quebra-cabeça 1000 peças e jogo de tabuleiro",
      clienteId: "cli-2",
      etapa: "concluido",
      valor: 134.8,
      prioridade: "baixa",
      prazo: "2026-06-28",
      descricao: "Recebido pela portaria às 16h40, com assinatura e foto.",
      criadoEm: "2026-05-15T11:00:00.000Z",
    },
  ],
  agendamentos: [
    {
      id: "age-1",
      titulo: "Zona Sul, 12 paradas",
      clienteId: "cli-1",
      data: "2026-07-28",
      hora: "07:30",
      duracaoMin: 90,
      status: "ativo",
      local: "Galpão da Marginal",
    },
    {
      id: "age-2",
      titulo: "Centro e Sé, 9 paradas",
      clienteId: "cli-2",
      data: "2026-07-29",
      hora: "08:00",
      duracaoMin: 60,
      status: "ativo",
      local: "CD Tatuapé",
    },
    {
      id: "age-3",
      titulo: "Zona Leste, 15 paradas",
      clienteId: "cli-5",
      data: "2026-07-30",
      hora: "07:00",
      duracaoMin: 90,
      status: "pendente",
      local: "Galpão da Marginal",
    },
    {
      id: "age-4",
      titulo: "Reentrega da casinha de boneca",
      clienteId: "cli-3",
      data: "2026-08-04",
      hora: "16:00",
      duracaoMin: 30,
      status: "pendente",
      local: "Casa do entregador",
    },
  ],
}

/**
 * O modelo de dados do produto.
 *
 * As três entidades são propositalmente genéricas: "clientes", "pedidos" e
 * "agenda" existem em quase todo segmento (clínica, oficina, agência, turismo,
 * escola). Ao personalizar o app, a IA só troca os RÓTULOS em `src/content/site.ts`.
 * A estrutura continua valendo.
 */

export type Status = "ativo" | "inativo" | "pendente"

export type Prioridade = "baixa" | "media" | "alta"

/** As colunas do kanban de pedidos. A ordem aqui é a ordem na tela. */
export const ETAPAS = ["novo", "em_andamento", "aguardando", "concluido"] as const
export type Etapa = (typeof ETAPAS)[number]

export type Cliente = {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  status: Status
  observacoes: string
  criadoEm: string
}

export type Pedido = {
  id: string
  titulo: string
  clienteId: string
  etapa: Etapa
  valor: number
  prioridade: Prioridade
  prazo: string
  descricao: string
  criadoEm: string
}

export type Agendamento = {
  id: string
  titulo: string
  clienteId: string
  data: string
  hora: string
  duracaoMin: number
  status: Status
  local: string
}

export type Dados = {
  clientes: Cliente[]
  pedidos: Pedido[]
  agendamentos: Agendamento[]
}

export type Sessao = {
  nome: string
  email: string
  entrouEm: string
}

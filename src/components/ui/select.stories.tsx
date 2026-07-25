import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { sistema } from "@/content/site"
import { Select, type OpcaoSelect } from "./select"

const situacoes: OpcaoSelect[] = [
  { valor: "ativo", rotulo: sistema.clientes.status.ativo },
  { valor: "pendente", rotulo: sistema.clientes.status.pendente },
  { valor: "inativo", rotulo: sistema.clientes.status.inativo },
]

const prioridades: OpcaoSelect[] = [
  { valor: "baixa", rotulo: sistema.pedidos.prioridades.baixa },
  { valor: "media", rotulo: sistema.pedidos.prioridades.media },
  { valor: "alta", rotulo: sistema.pedidos.prioridades.alta },
]

const meta = {
  title: "Primitivos/Select",
  component: Select,
  parameters: { layout: "padded" },
  argTypes: {
    rotulo: { control: "text" },
    ajuda: { control: "text" },
    erro: { control: "text" },
    placeholder: { control: "text" },
    obrigatorio: { control: "boolean" },
    disabled: { control: "boolean" },
    opcoes: { control: false },
  },
  args: {
    rotulo: sistema.clientes.formulario.campos.status,
    opcoes: situacoes,
    defaultValue: "",
    obrigatorio: false,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Começa no placeholder: nada escolhido é diferente de "Ativo" por acidente. */
export const Padrao: Story = {}

export const ComValor: Story = {
  args: { defaultValue: "ativo" },
}

export const ComErro: Story = {
  args: {
    rotulo: sistema.pedidos.campos.cliente,
    erro: sistema.pedidos.erros.cliente,
    obrigatorio: true,
  },
}

export const ComAjuda: Story = {
  args: {
    rotulo: sistema.pedidos.campos.prioridade,
    opcoes: prioridades,
    defaultValue: "media",
    ajuda: sistema.pedidos.ajudas.descricao,
  },
}

/** Sem placeholder quando toda escolha é válida e uma já vem marcada. */
export const SemPlaceholder: Story = {
  args: {
    rotulo: sistema.agenda.formulario.campos.duracao,
    opcoes: sistema.agenda.formulario.duracoes,
    placeholder: null,
    defaultValue: "60",
  },
}

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: "inativo" },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { sistema } from "@/content/site"
import { Textarea } from "./textarea"

const campos = sistema.clientes.formulario

const meta = {
  title: "Primitivos/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  argTypes: {
    rotulo: { control: "text" },
    ajuda: { control: "text" },
    erro: { control: "text" },
    obrigatorio: { control: "boolean" },
    ocultarRotulo: { control: "boolean" },
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 2, max: 12 } },
  },
  args: {
    rotulo: campos.campos.observacoes,
    placeholder: campos.exemploObservacoes,
    rows: 4,
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComAjuda: Story = {
  args: {
    rotulo: sistema.pedidos.campos.descricao,
    ajuda: sistema.pedidos.ajudas.descricao,
    placeholder: undefined,
  },
}

export const ComErro: Story = {
  args: {
    rotulo: sistema.pedidos.campos.descricao,
    erro: sistema.pedidos.erros.titulo,
    obrigatorio: true,
  },
}

export const ComTexto: Story = {
  args: {
    defaultValue:
      "Prefere contato por WhatsApp e fecha contrato sempre no começo do mês. Não gosta de ligação depois das 18h.",
  },
}

export const Desabilitado: Story = {
  args: {
    disabled: true,
    defaultValue: "Prefere contato por WhatsApp.",
  },
}

/** Só cresce na vertical: encolher a largura quebraria a coluna do formulário. */
export const Alto: Story = {
  args: { rows: 8 },
}

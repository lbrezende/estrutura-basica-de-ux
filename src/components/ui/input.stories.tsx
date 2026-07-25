import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AtSign, Phone } from "lucide-react"
import { sistema } from "@/content/site"
import { Input } from "./input"

const campos = sistema.clientes.formulario

const meta = {
  title: "Primitivos/Input",
  component: Input,
  parameters: { layout: "padded" },
  argTypes: {
    rotulo: { control: "text" },
    ajuda: { control: "text" },
    erro: { control: "text" },
    obrigatorio: { control: "boolean" },
    ocultarRotulo: { control: "boolean" },
    disabled: { control: "boolean" },
    iconeEsquerda: { control: false },
    iconeDireita: { control: false },
  },
  args: {
    rotulo: campos.campos.nome,
    placeholder: campos.exemploNome,
    obrigatorio: false,
    ocultarRotulo: false,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Obrigatorio: Story = {
  args: { obrigatorio: true },
}

/** A ajuda some quando aparece um erro. Duas mensagens ao mesmo tempo viram ruído. */
export const ComAjuda: Story = {
  args: {
    rotulo: campos.campos.telefone,
    placeholder: campos.exemploTelefone,
    ajuda: campos.ajudaTelefone,
    iconeEsquerda: <Phone />,
  },
}

export const ComErro: Story = {
  args: {
    rotulo: campos.campos.email,
    placeholder: campos.exemploEmail,
    erro: campos.erros.emailInvalido,
    defaultValue: "marina@",
    iconeEsquerda: <AtSign />,
  },
}

export const ComIcone: Story = {
  args: {
    rotulo: campos.campos.email,
    placeholder: campos.exemploEmail,
    type: "email",
    iconeEsquerda: <AtSign />,
  },
}

export const Desabilitado: Story = {
  args: {
    disabled: true,
    defaultValue: "Marina Alvarenga",
  },
}

/** Os três estados juntos: é assim que se compara altura, cor e espaçamento. */
export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Input {...args} rotulo={campos.campos.nome} placeholder={campos.exemploNome} />
      <Input
        {...args}
        rotulo={campos.campos.telefone}
        placeholder={campos.exemploTelefone}
        ajuda={campos.ajudaTelefone}
      />
      <Input
        {...args}
        rotulo={campos.campos.email}
        defaultValue="marina@"
        erro={campos.erros.emailInvalido}
      />
      <Input
        {...args}
        rotulo={campos.campos.empresa}
        defaultValue="Estúdio Clara"
        disabled
      />
    </div>
  ),
}

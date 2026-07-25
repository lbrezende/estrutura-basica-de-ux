import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowRight, Plus, Trash2 } from "lucide-react"
import { landing, sistema } from "@/content/site"
import { Button, type TamanhoBotao, type VarianteBotao } from "./button"

/**
 * Nas grades comparativas o rótulo é o próprio nome da variante/tamanho.
 * Numa vitrine de componente esse é o texto mais útil que existe: liga o que se
 * vê ao que se digita.
 */
const VARIANTES: VarianteBotao[] = ["primaria", "secundaria", "fantasma", "perigo"]
const TAMANHOS: TamanhoBotao[] = ["sm", "md", "lg"]

const meta = {
  title: "Primitivos/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variante: { control: "inline-radio", options: VARIANTES },
    tamanho: { control: "inline-radio", options: TAMANHOS },
    carregando: { control: "boolean" },
    larguraTotal: { control: "boolean" },
    comChip: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    iconeEsquerda: { control: false },
    iconeDireita: { control: false },
  },
  args: {
    children: sistema.clientes.formulario.salvar,
    variante: "primaria",
    tamanho: "md",
    carregando: false,
    larguraTotal: false,
    comChip: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Variantes: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTES.map((variante) => (
        <Button key={variante} {...args} variante={variante}>
          {variante}
        </Button>
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {TAMANHOS.map((tamanho) => (
        <Button key={tamanho} {...args} tamanho={tamanho}>
          {tamanho}
        </Button>
      ))}
    </div>
  ),
}

export const ComIcone: Story = {
  args: {
    children: sistema.clientes.novo,
    iconeEsquerda: <Plus />,
  },
}

export const IconeADireita: Story = {
  args: {
    children: landing.hero.ctaPrimario,
    variante: "secundaria",
    iconeDireita: <ArrowRight />,
  },
}

/**
 * A seta dentro do chip redondo. É a anatomia do CTA que abre o produto, e não
 * a de um botão de lista: use no herói e na chamada final, não na tabela.
 */
export const ComChip: Story = {
  parameters: { layout: "padded" },
  args: {
    children: landing.hero.ctaPrimario,
    comChip: true,
    iconeDireita: <ArrowRight />,
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} tamanho="md" />
      <Button {...args} tamanho="lg" />
    </div>
  ),
}

/** Sem rótulo o botão vira quadrado, e aí `aria-label` deixa de ser opcional. */
export const SoIcone: Story = {
  parameters: { layout: "padded" },
  args: {
    children: undefined,
    variante: "fantasma",
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {TAMANHOS.map((tamanho) => (
        <Button
          key={tamanho}
          {...args}
          tamanho={tamanho}
          aria-label={sistema.clientes.remocao.acao}
          iconeEsquerda={<Trash2 />}
        />
      ))}
    </div>
  ),
}

/** O rótulo continua na tela para o botão não encolher no meio do clique. */
export const Carregando: Story = {
  parameters: { layout: "padded" },
  args: { carregando: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTES.map((variante) => (
        <Button key={variante} {...args} variante={variante}>
          {variante}
        </Button>
      ))}
    </div>
  ),
}

export const Desabilitado: Story = {
  args: { disabled: true },
}

export const LarguraTotal: Story = {
  parameters: { layout: "padded" },
  args: { larguraTotal: true, children: sistema.clientes.formulario.criar },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Button {...args} />
    </div>
  ),
}

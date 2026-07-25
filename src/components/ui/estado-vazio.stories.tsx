import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CalendarDays, Kanban, Plus, SearchX, Users } from "lucide-react"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { Button } from "./button"
import { EstadoVazio } from "./estado-vazio"

const meta = {
  title: "Primitivos/EstadoVazio",
  component: EstadoVazio,
  parameters: { layout: "padded" },
  argTypes: {
    titulo: { control: "text" },
    texto: { control: "text" },
    tamanho: { control: "inline-radio", options: ["sm", "md"] },
    icone: { control: false },
    acao: { control: false },
  },
  args: {
    titulo: sistema.vazios.clientes.titulo,
    texto: sistema.vazios.clientes.texto,
    tamanho: "md",
  },
  decorators: [
    // O vazio nunca aparece solto na página: ele mora dentro de uma superfície.
    // A largura acompanha o tamanho, porque `sm` existe justamente para caber
    // numa coluna estreita do quadro de pedidos.
    (Story, contexto) => (
      <div
        className={cn(
          "w-full rounded-ds border border-hairline bg-surface",
          contexto.args.tamanho === "sm" ? "max-w-[280px]" : "max-w-2xl"
        )}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EstadoVazio>

export default meta
type Story = StoryObj<typeof meta>

/** Vazio sem saída é beco: todo estado vazio de lista carrega a ação que o resolve. */
export const Clientes: Story = {
  args: {
    icone: <Users />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.clientes.acao}</Button>,
  },
}

export const Pedidos: Story = {
  args: {
    titulo: sistema.vazios.pedidos.titulo,
    texto: sistema.vazios.pedidos.texto,
    icone: <Kanban />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.pedidos.acao}</Button>,
  },
}

export const Agenda: Story = {
  args: {
    titulo: sistema.vazios.agenda.titulo,
    texto: sistema.vazios.agenda.texto,
    icone: <CalendarDays />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.agenda.acao}</Button>,
  },
}

/**
 * Busca sem resultado é outro vazio: existe cadastro, o filtro é que esconde.
 * Por isso a saída aqui é limpar o filtro, e não cadastrar de novo.
 */
export const SemResultado: Story = {
  args: {
    titulo: sistema.clientes.semResultado.titulo,
    texto: sistema.clientes.semResultado.texto,
    icone: <SearchX />,
    acao: <Button variante="secundaria">{sistema.clientes.filtros.limpar}</Button>,
  },
}

/** `sm` para vazios apertados: dentro de card ou de coluna do quadro. */
export const Pequeno: Story = {
  args: {
    tamanho: "sm",
    titulo: sistema.pedidos.colunaVazia,
    texto: undefined,
    icone: <Kanban />,
  },
}

export const SemAcao: Story = {
  args: {
    titulo: sistema.clientes.detalhe.semPedidos,
    texto: undefined,
    tamanho: "sm",
  },
}

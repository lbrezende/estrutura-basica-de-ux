import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useEffect, useState } from "react"
import { fn } from "storybook/test"
import { sistema } from "@/content/site"
import { CampoBusca, type CampoBuscaProps } from "./campo-busca"
import { EstadoVazio } from "./estado-vazio"

/**
 * O campo é controlado: quem chama guarda o texto. Sem alguém segurando o
 * estado, digitar no Storybook não mudaria nada na tela.
 */
function BuscaComEstado({ valor, aoMudar, ...props }: CampoBuscaProps) {
  const [texto, setTexto] = useState(valor)

  useEffect(() => setTexto(valor), [valor])

  return (
    <CampoBusca
      {...props}
      valor={texto}
      aoMudar={(novo) => {
        setTexto(novo)
        aoMudar(novo)
      }}
    />
  )
}

const CLIENTES = ["Marina Alvarenga", "Rafael Nogueira", "Camila Ishikawa", "Bruno Sato"]

const meta = {
  title: "Primitivos/CampoBusca",
  component: CampoBusca,
  parameters: { layout: "padded" },
  argTypes: {
    valor: { control: "text" },
    rotulo: { control: "text" },
    placeholder: { control: "text" },
    ocultarRotulo: { control: "boolean" },
    aoMudar: { control: false },
  },
  args: {
    valor: "",
    rotulo: sistema.clientes.filtros.buscar,
    placeholder: sistema.clientes.filtros.buscar,
    ocultarRotulo: true,
    // `aoMudar` é obrigatório no componente. Sem um valor aqui, toda story
    // precisaria repeti-lo; com `fn()` o Storybook ainda registra as chamadas.
    aoMudar: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => <BuscaComEstado {...args} />,
} satisfies Meta<typeof CampoBusca>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

/** Com texto aparece o botão de limpar, que devolve o foco ao campo. */
export const ComTexto: Story = {
  args: { valor: "marina" },
}

/** O rótulo pode aparecer quando a busca tem peso de campo, não de filtro rápido. */
export const ComRotuloVisivel: Story = {
  args: {
    ocultarRotulo: false,
    rotulo: sistema.configuracoes.tema.rotuloBusca,
    placeholder: sistema.configuracoes.tema.placeholderBusca,
  },
}

/** A busca só faz sentido junto do que ela filtra, inclusive quando não acha nada. */
export const FiltrandoUmaLista: Story = {
  render: function ListaFiltrada(args) {
    const [texto, setTexto] = useState(args.valor)
    const encontrados = CLIENTES.filter((nome) =>
      nome.toLowerCase().includes(texto.trim().toLowerCase())
    )

    return (
      <div className="flex flex-col gap-3">
        <CampoBusca {...args} valor={texto} aoMudar={setTexto} />

        {encontrados.length > 0 ? (
          <ul className="divide-y divide-hairline rounded-ds border border-hairline bg-surface">
            {encontrados.map((nome) => (
              <li key={nome} className="px-4 py-3 text-sm text-ink">
                {nome}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-ds border border-hairline bg-surface">
            <EstadoVazio
              tamanho="sm"
              titulo={sistema.clientes.semResultado.titulo}
              texto={sistema.clientes.semResultado.texto}
            />
          </div>
        )}
      </div>
    )
  },
}

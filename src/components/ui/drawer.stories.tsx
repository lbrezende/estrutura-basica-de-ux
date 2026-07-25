import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useEffect, useState } from "react"
import { fn } from "storybook/test"
import { sistema } from "@/content/site"
import { Badge } from "./badge"
import { Button } from "./button"
import { Drawer, type DrawerProps, type LarguraDrawer } from "./drawer"
import { EstadoVazio } from "./estado-vazio"
import { Input } from "./input"
import { Select } from "./select"

/** Mesmo motivo do modal: aberto por padrão cobriria a documentação inteira. */
function DrawerComGatilho({ aberto, aoFechar, ...props }: DrawerProps) {
  const [visivel, setVisivel] = useState(aberto)

  useEffect(() => setVisivel(aberto), [aberto])

  return (
    <>
      <Button variante="secundaria" onClick={() => setVisivel(true)}>
        {props.titulo}
      </Button>

      <Drawer
        {...props}
        aberto={visivel}
        aoFechar={() => {
          setVisivel(false)
          aoFechar()
        }}
      />
    </>
  )
}

const LARGURAS: LarguraDrawer[] = ["sm", "md", "lg"]

const formulario = sistema.clientes.formulario
const detalhe = sistema.clientes.detalhe

const meta = {
  title: "Primitivos/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
  argTypes: {
    largura: { control: "inline-radio", options: LARGURAS },
    mostrarFechar: { control: "boolean" },
    fecharNoOverlay: { control: "boolean" },
    titulo: { control: "text" },
    descricao: { control: "text" },
    aberto: { control: "boolean" },
    rodape: { control: false },
    children: { control: false },
    refFocoInicial: { control: false },
  },
  args: {
    aberto: false,
    aoFechar: fn(),
    titulo: "Marina Alvarenga",
    descricao: "Estúdio Clara",
    largura: "md",
    mostrarFechar: true,
    fecharNoOverlay: true,
  },
  render: (args) => <DrawerComGatilho {...args} />,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

/** O painel lateral existe para editar sem perder a lista de vista. */
export const Padrao: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm text-ink">{detalhe.dados}</h3>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campos.email}</dt>
              <dd className="text-ink">marina@estudioclara.com.br</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campos.telefone}</dt>
              <dd className="text-ink">(11) 98877-1200</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campos.status}</dt>
              <dd>
                <Badge variante="sucesso" ponto>
                  {sistema.clientes.status.ativo}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{detalhe.desde}</dt>
              <dd className="text-ink">12/03/2024</dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm text-ink">{detalhe.agendamentos}</h3>
          <div className="rounded-ds border border-hairline bg-elevated">
            <EstadoVazio tamanho="sm" titulo={detalhe.semAgendamentos} />
          </div>
        </section>
      </div>
    ),
    rodape: (
      <>
        <Button variante="perigo">{sistema.clientes.remocao.acao}</Button>
        <Button>{formulario.salvar}</Button>
      </>
    ),
  },
}

export const ComFormulario: Story = {
  args: {
    titulo: formulario.tituloCriar,
    descricao: formulario.descricaoCriar,
    children: (
      <div className="flex flex-col gap-4">
        <Input rotulo={formulario.campos.nome} placeholder={formulario.exemploNome} obrigatorio />
        <Input rotulo={formulario.campos.empresa} placeholder={formulario.exemploEmpresa} />
        <Input
          rotulo={formulario.campos.email}
          placeholder={formulario.exemploEmail}
          type="email"
          obrigatorio
        />
        <Input
          rotulo={formulario.campos.telefone}
          placeholder={formulario.exemploTelefone}
          ajuda={formulario.ajudaTelefone}
        />
        <Select
          rotulo={formulario.campos.status}
          opcoes={[
            { valor: "ativo", rotulo: sistema.clientes.status.ativo },
            { valor: "pendente", rotulo: sistema.clientes.status.pendente },
            { valor: "inativo", rotulo: sistema.clientes.status.inativo },
          ]}
          defaultValue="ativo"
        />
      </div>
    ),
    rodape: (
      <>
        <Button variante="secundaria">{sistema.acoes.cancelar}</Button>
        <Button>{formulario.criar}</Button>
      </>
    ),
  },
}

export const Larguras: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {LARGURAS.map((largura) => (
        <DrawerComGatilho
          key={largura}
          {...args}
          largura={largura}
          titulo={largura}
          descricao={sistema.clientes.descricao}
        >
          <p className="text-sm leading-relaxed text-muted">{sistema.clientes.descricao}</p>
        </DrawerComGatilho>
      ))}
    </div>
  ),
}

export const SemRodape: Story = {
  args: {
    titulo: detalhe.dados,
    descricao: undefined,
    children: (
      <p className="text-sm leading-relaxed text-muted">{sistema.clientes.descricao}</p>
    ),
  },
}

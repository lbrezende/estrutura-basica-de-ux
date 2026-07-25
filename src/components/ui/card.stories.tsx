import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { sistema } from "@/content/site"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardRodape,
  CardTitulo,
} from "./card"

const meta = {
  title: "Primitivos/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    interativo: { control: "boolean" },
  },
  args: {
    interativo: false,
  },
  // A largura fica dentro de cada `render`, e não num decorator do meta:
  // decorator de meta envolve o da story, então o de fora sempre venceria e
  // a story em grade nunca conseguiria ser mais larga que as outras.
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <CardTitulo>{sistema.clientes.detalhe.dados}</CardTitulo>
          <CardDescricao>{sistema.clientes.descricao}</CardDescricao>
        </CardCabecalho>
        <CardConteudo>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">{sistema.clientes.formulario.campos.nome}</dt>
              <dd className="text-ink">Marina Alvarenga</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.clientes.formulario.campos.empresa}</dt>
              <dd className="text-ink">Estúdio Clara</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.clientes.formulario.campos.email}</dt>
              <dd className="text-ink">marina@estudioclara.com.br</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.clientes.formulario.campos.telefone}</dt>
              <dd className="text-ink">(11) 98877-1200</dd>
            </div>
          </dl>
        </CardConteudo>
      </Card>
    </div>
  ),
}

/** Cabeçalho, conteúdo e rodapé com divisor: o card completo. */
export const ComRodape: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <CardTitulo>{sistema.configuracoes.dados.titulo}</CardTitulo>
          <CardDescricao>{sistema.configuracoes.dados.descricao}</CardDescricao>
        </CardCabecalho>
        <CardConteudo>
          <p className="text-sm leading-relaxed text-muted">
            {sistema.configuracoes.dados.dicaVazios}
          </p>
        </CardConteudo>
        <CardRodape divisor>
          <Button variante="secundaria" tamanho="sm">
            {sistema.configuracoes.dados.restaurar}
          </Button>
          <Button variante="perigo" tamanho="sm">
            {sistema.configuracoes.dados.limpar}
          </Button>
        </CardRodape>
      </Card>
    </div>
  ),
}

/** Ligue `interativo` quando o card inteiro leva para algum lugar. */
export const Interativo: Story = {
  args: { interativo: true },
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <div className="flex items-start justify-between gap-3">
            <CardTitulo>Rafael Nogueira</CardTitulo>
            <Badge variante="sucesso" ponto>
              {sistema.clientes.status.ativo}
            </Badge>
          </div>
          <CardDescricao>Nogueira Logística</CardDescricao>
        </CardCabecalho>
        <CardConteudo className="pt-3 text-sm text-muted">
          3 {sistema.entidades.pedido.plural} · 1 {sistema.entidades.agendamento.singular}
        </CardConteudo>
      </Card>
    </div>
  ),
}

/** Dois cards lado a lado: o ritmo de espaçamento é o mesmo em qualquer largura. */
export const EmGrade: Story = {
  render: (args) => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {[sistema.clientes, sistema.pedidos].map((secao) => (
        <Card key={secao.titulo} {...args}>
          <CardCabecalho>
            <CardTitulo>{secao.titulo}</CardTitulo>
            <CardDescricao>{secao.descricao}</CardDescricao>
          </CardCabecalho>
          <CardConteudo className="pt-3">
            <Button variante="secundaria" tamanho="sm">
              {secao.novo}
            </Button>
          </CardConteudo>
        </Card>
      ))}
    </div>
  ),
}

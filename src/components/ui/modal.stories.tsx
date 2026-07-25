import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TriangleAlert, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { fn } from "storybook/test"
import { sistema } from "@/content/site"
import { Button } from "./button"
import { Input } from "./input"
import { Modal, type ModalProps, type TamanhoModal } from "./modal"
import { Select } from "./select"
import { Textarea } from "./textarea"

/**
 * As stories abrem por clique, e não já abertas.
 *
 * O modal é `fixed inset-0`: uma story aberta por padrão cobriria a página de
 * documentação inteira. O gatilho também mostra o que mais importa aqui: o
 * foco entra no diálogo ao abrir e volta para este botão ao fechar.
 */
function ModalComGatilho({ aberto, aoFechar, ...props }: ModalProps) {
  const [visivel, setVisivel] = useState(aberto)

  useEffect(() => setVisivel(aberto), [aberto])

  return (
    <>
      <Button variante="secundaria" onClick={() => setVisivel(true)}>
        {props.titulo}
      </Button>

      <Modal
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

const TAMANHOS: TamanhoModal[] = ["sm", "md", "lg"]

const formulario = sistema.clientes.formulario

const meta = {
  title: "Primitivos/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  argTypes: {
    tamanho: { control: "inline-radio", options: TAMANHOS },
    papel: { control: "inline-radio", options: ["dialog", "alertdialog"] },
    mostrarFechar: { control: "boolean" },
    fecharNoOverlay: { control: "boolean" },
    titulo: { control: "text" },
    descricao: { control: "text" },
    aberto: { control: "boolean" },
    icone: { control: false },
    rodape: { control: false },
    children: { control: false },
    refFocoInicial: { control: false },
  },
  args: {
    aberto: false,
    // `fn()` deixa cada fechamento aparecer na aba Actions. Dá pra ver o
    // Esc, o clique no fundo e o botão de fechar chamando a mesma coisa.
    aoFechar: fn(),
    titulo: formulario.tituloCriar,
    descricao: formulario.descricaoCriar,
    tamanho: "md",
    papel: "dialog",
    mostrarFechar: true,
    fecharNoOverlay: true,
  },
  render: (args) => <ModalComGatilho {...args} />,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  args: {
    children: (
      <p className="text-sm leading-relaxed text-muted">{sistema.clientes.descricao}</p>
    ),
    rodape: (
      <>
        <Button variante="secundaria">{sistema.acoes.cancelar}</Button>
        <Button>{formulario.criar}</Button>
      </>
    ),
  },
}

export const ComIcone: Story = {
  args: {
    ...Padrao.args,
    icone: <UserPlus className="text-primary" />,
  },
}

/** No celular sobe pela base como uma folha; no desktop fica centralizado. */
export const ComFormulario: Story = {
  args: {
    icone: <UserPlus className="text-primary" />,
    children: (
      <div className="flex flex-col gap-4">
        <Input rotulo={formulario.campos.nome} placeholder={formulario.exemploNome} obrigatorio />
        <Input
          rotulo={formulario.campos.email}
          placeholder={formulario.exemploEmail}
          type="email"
          obrigatorio
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
        <Textarea
          rotulo={formulario.campos.observacoes}
          placeholder={formulario.exemploObservacoes}
          rows={3}
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

export const Tamanhos: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {TAMANHOS.map((tamanho) => (
        <ModalComGatilho
          key={tamanho}
          {...args}
          tamanho={tamanho}
          titulo={tamanho}
          descricao={formulario.descricaoCriar}
        />
      ))}
    </div>
  ),
}

/** Só o miolo rola; cabeçalho e rodapé ficam parados. */
export const ConteudoLongo: Story = {
  args: {
    titulo: sistema.configuracoes.tema.titulo,
    descricao: sistema.configuracoes.tema.descricao,
    children: (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }, (_, indice) => (
          <p key={indice} className="text-sm leading-relaxed text-muted">
            {sistema.configuracoes.tema.aviso.texto}
          </p>
        ))}
      </div>
    ),
    rodape: <Button>{sistema.acoes.confirmar}</Button>,
  },
}

export const SemRodape: Story = {
  args: {
    titulo: sistema.configuracoes.tema.aviso.titulo,
    descricao: sistema.configuracoes.tema.aviso.texto,
  },
}

/**
 * `alertdialog` para decisão que interrompe o fluxo: o leitor de tela anuncia
 * como interrupção e a saída é escolher uma das opções (ou Esc).
 */
export const Alerta: Story = {
  args: {
    papel: "alertdialog",
    tamanho: "sm",
    mostrarFechar: false,
    titulo: sistema.clientes.remocao.confirmarTitulo,
    descricao: sistema.clientes.remocao.confirmarTexto,
    icone: <TriangleAlert className="text-danger" />,
    rodape: (
      <>
        <Button variante="secundaria">{sistema.acoes.cancelar}</Button>
        <Button variante="perigo">{sistema.clientes.remocao.confirmar}</Button>
      </>
    ),
  },
}

"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Icone } from "@/components/app/icone"
import { Button, Input, Modal, Select, type OpcaoSelect } from "@/components/ui"
import { sistema } from "@/content/site"
import type { DataISO } from "@/lib/formato"
import type { Agendamento, Cliente, Status } from "@/lib/types"

/**
 * Criar e editar compromisso no mesmo formulário.
 *
 * `agendamento` nulo = criação. Duas telas separadas para os mesmos sete campos
 * só criariam duas oportunidades de divergir.
 */

const copia = sistema.agenda.formulario

type PropsFormularioCompromisso = {
  aberto: boolean
  /** Nulo cria; preenchido edita. */
  agendamento: Agendamento | null
  /** Data já preenchida ao criar, normalmente o dia que a pessoa clicou. */
  dataInicial: DataISO
  clientes: Cliente[]
  aoFechar: () => void
  aoSalvar: (valores: Omit<Agendamento, "id">) => void
  /** Ausente na criação: não existe compromisso para remover ainda. */
  aoRemover?: () => void
}

/** O formulário guarda tudo como texto. É o que os campos devolvem. */
type Valores = {
  titulo: string
  clienteId: string
  data: string
  hora: string
  duracao: string
  local: string
  status: Status
}

type Erros = Partial<Record<"titulo" | "clienteId" | "data" | "hora", string>>

const DURACAO_PADRAO = "60"
const HORA_PADRAO = "09:00"

/** Evita o `as Status` de um `<select>`: valor estranho cai no mais conservador. */
function paraStatus(valor: string): Status {
  return valor === "ativo" || valor === "inativo" ? valor : "pendente"
}

const OPCOES_STATUS: OpcaoSelect[] = [
  { valor: "ativo", rotulo: sistema.agenda.status.ativo },
  { valor: "pendente", rotulo: sistema.agenda.status.pendente },
  { valor: "inativo", rotulo: sistema.agenda.status.inativo },
]

export function FormularioCompromisso({
  aberto,
  agendamento,
  dataInicial,
  clientes,
  aoFechar,
  aoSalvar,
  aoRemover,
}: PropsFormularioCompromisso) {
  const idFormulario = useId()
  const refTitulo = useRef<HTMLInputElement>(null)
  const refFormulario = useRef<HTMLFormElement>(null)

  const [valores, setValores] = useState<Valores>(() => valoresIniciais(agendamento, dataInicial))
  const [erros, setErros] = useState<Erros>({})

  const semClientes = clientes.length === 0

  // Reabrir o modal precisa mostrar o compromisso da vez, não o resto do
  // anterior. Zerar no fechamento faria o conteúdo sumir durante a animação.
  useEffect(() => {
    if (!aberto) return
    setValores(valoresIniciais(agendamento, dataInicial))
    setErros({})
  }, [aberto, agendamento, dataInicial])

  function alterar(patch: Partial<Valores>) {
    setValores((atuais) => ({ ...atuais, ...patch }))

    // O erro sai no primeiro toque no campo: manter a mensagem enquanto a pessoa
    // corrige é insistir num erro que já não existe.
    setErros((atuais) => {
      const proximos = { ...atuais }
      for (const campo of Object.keys(patch)) delete proximos[campo as keyof Erros]
      return proximos
    })
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const encontrados: Erros = {}
    if (!valores.titulo.trim()) encontrados.titulo = copia.erros.titulo
    if (!valores.clienteId) encontrados.clienteId = copia.erros.cliente
    if (!valores.data) encontrados.data = copia.erros.data
    if (!valores.hora) encontrados.hora = copia.erros.hora

    setErros(encontrados)

    if (Object.keys(encontrados).length > 0) {
      // Levar o foco ao primeiro campo inválido: sem isso, quem navega por
      // teclado fica no botão de salvar sem saber onde está o problema.
      requestAnimationFrame(() => {
        refFormulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    aoSalvar({
      titulo: valores.titulo.trim(),
      clienteId: valores.clienteId,
      data: valores.data,
      hora: valores.hora,
      duracaoMin: Number(valores.duracao),
      status: valores.status,
      local: valores.local.trim(),
    })
  }

  const editando = agendamento !== null

  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={editando ? copia.tituloEditar : copia.tituloCriar}
      descricao={editando ? copia.descricaoEditar : copia.descricaoCriar}
      refFocoInicial={refTitulo}
      rodape={
        <>
          {aoRemover && (
            <Button
              variante="fantasma"
              onClick={aoRemover}
              iconeEsquerda={<Icone nome="remover" />}
              className="text-danger hover:bg-danger/10 hover:text-danger sm:mr-auto"
            >
              {copia.remover}
            </Button>
          )}

          <Button variante="secundaria" onClick={aoFechar}>
            {sistema.acoes.cancelar}
          </Button>

          {/* Fora do <form>: o `form` liga o botão do rodapé ao formulário. */}
          <Button type="submit" form={idFormulario} disabled={semClientes}>
            {editando ? copia.salvar : copia.criar}
          </Button>
        </>
      }
    >
      <form
        ref={refFormulario}
        id={idFormulario}
        noValidate
        onSubmit={enviar}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Input
          ref={refTitulo}
          rotulo={copia.campos.titulo}
          obrigatorio
          value={valores.titulo}
          onChange={(evento) => alterar({ titulo: evento.target.value })}
          erro={erros.titulo}
          placeholder={copia.exemploTitulo}
          classeCampo="sm:col-span-2"
        />

        <Select
          rotulo={copia.campos.cliente}
          obrigatorio
          value={valores.clienteId}
          onChange={(evento) => alterar({ clienteId: evento.target.value })}
          erro={erros.clienteId}
          ajuda={semClientes ? copia.semClientes : undefined}
          disabled={semClientes}
          opcoes={clientes.map((cliente) => ({ valor: cliente.id, rotulo: cliente.nome }))}
          classeCampo="sm:col-span-2"
        />

        <Input
          type="date"
          rotulo={copia.campos.data}
          obrigatorio
          value={valores.data}
          onChange={(evento) => alterar({ data: evento.target.value })}
          erro={erros.data}
        />

        <Input
          type="time"
          rotulo={copia.campos.hora}
          obrigatorio
          value={valores.hora}
          onChange={(evento) => alterar({ hora: evento.target.value })}
          erro={erros.hora}
        />

        <Select
          rotulo={copia.campos.duracao}
          value={valores.duracao}
          onChange={(evento) => alterar({ duracao: evento.target.value })}
          opcoes={copia.duracoes}
          placeholder={null}
        />

        <Select
          rotulo={copia.campos.status}
          value={valores.status}
          onChange={(evento) => alterar({ status: paraStatus(evento.target.value) })}
          opcoes={OPCOES_STATUS}
          placeholder={null}
        />

        <Input
          rotulo={copia.campos.local}
          value={valores.local}
          onChange={(evento) => alterar({ local: evento.target.value })}
          placeholder={copia.exemploLocal}
          classeCampo="sm:col-span-2"
        />
      </form>
    </Modal>
  )
}

function valoresIniciais(agendamento: Agendamento | null, dataInicial: DataISO): Valores {
  if (agendamento) {
    return {
      titulo: agendamento.titulo,
      clienteId: agendamento.clienteId,
      data: agendamento.data,
      hora: agendamento.hora,
      duracao: String(agendamento.duracaoMin),
      local: agendamento.local,
      status: agendamento.status,
    }
  }

  return {
    titulo: "",
    clienteId: "",
    data: dataInicial,
    hora: HORA_PADRAO,
    duracao: DURACAO_PADRAO,
    local: "",
    // Compromisso novo nasce "a confirmar": quem marcou ainda vai avisar o cliente.
    status: "pendente",
  }
}

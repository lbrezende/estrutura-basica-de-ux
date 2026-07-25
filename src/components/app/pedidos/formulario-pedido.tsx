"use client"

import { useState, type FormEvent, type RefObject } from "react"
import { z } from "zod"
import { Input, Select, Textarea, type OpcaoSelect } from "@/components/ui"
import { sistema } from "@/content/site"
import { ETAPAS, type Cliente, type Etapa, type Pedido, type Prioridade } from "@/lib/types"

const textos = sistema.pedidos

/** O que o formulário devolve. O `id` e o `criadoEm` são responsabilidade do store. */
export type ValoresPedido = Omit<Pedido, "id" | "criadoEm">

/** Enquanto está sendo preenchido, tudo é texto: é o que o `<input>` devolve. */
type Rascunho = {
  titulo: string
  clienteId: string
  valor: string
  prioridade: Prioridade
  prazo: string
  descricao: string
  etapa: Etapa
}

type CampoComErro = "titulo" | "clienteId" | "valor" | "prazo"

/**
 * "1.200,50" → 1200.5.
 *
 * Ninguém digita dinheiro em notação de computador. O ponto é separador de
 * milhar aqui no Brasil, então só a vírgula pode virar casa decimal, e apenas
 * quando ela existe, senão "1.200" viraria um real e vinte.
 */
function parsearValor(bruto: string): number | null {
  const limpo = bruto.replace(/[^\d,.-]/g, "").trim()
  if (!limpo) return null

  const normalizado = limpo.includes(",") ? limpo.replace(/\./g, "").replace(",", ".") : limpo
  const numero = Number(normalizado)
  return Number.isFinite(numero) ? numero : null
}

const esquema = z.object({
  titulo: z.string().trim().min(1, textos.erros.titulo),
  clienteId: z.string().min(1, textos.erros.cliente),
  valor: z.string().refine((bruto) => {
    const numero = parsearValor(bruto)
    return numero !== null && numero >= 0
  }, textos.erros.valor),
  prazo: z.string().min(1, textos.erros.prazo),
})

const OPCOES_PRIORIDADE: OpcaoSelect[] = (["baixa", "media", "alta"] as const).map(
  (prioridade) => ({ valor: prioridade, rotulo: textos.prioridades[prioridade] })
)

const OPCOES_ETAPA: OpcaoSelect[] = ETAPAS.map((etapa) => ({
  valor: etapa,
  rotulo: sistema.etapas[etapa],
}))

type PropsFormularioPedido = {
  /** Liga os botões do rodapé do modal, que ficam fora do `<form>`. */
  idFormulario: string
  /** Ausente = criando. */
  pedido?: Pedido
  /** Coluna de onde veio o "+", para o pedido novo já nascer no lugar certo. */
  etapaInicial?: Etapa
  clientes: Cliente[]
  aoSalvar: (valores: ValoresPedido) => void
  /** O modal manda o foco para cá ao abrir, em vez de para o botão de fechar. */
  refTitulo?: RefObject<HTMLInputElement | null>
}

export function FormularioPedido({
  idFormulario,
  pedido,
  etapaInicial,
  clientes,
  aoSalvar,
  refTitulo,
}: PropsFormularioPedido) {
  const [rascunho, setRascunho] = useState<Rascunho>(() => ({
    titulo: pedido?.titulo ?? "",
    clienteId: pedido?.clienteId ?? "",
    // O número volta para o formato de quem digita: 1200.5 → "1200,5".
    valor: pedido ? String(pedido.valor).replace(".", ",") : "",
    prioridade: pedido?.prioridade ?? "media",
    prazo: pedido?.prazo ?? "",
    descricao: pedido?.descricao ?? "",
    etapa: pedido?.etapa ?? etapaInicial ?? ETAPAS[0],
  }))
  const [erros, setErros] = useState<Partial<Record<CampoComErro, string>>>({})

  const semClientes = clientes.length === 0

  /** Corrigir um campo apaga o erro dele na hora. Não precisa reenviar pra ver sumir. */
  function definir(mudanca: Partial<Rascunho>) {
    setRascunho((atual) => ({ ...atual, ...mudanca }))
    setErros((atuais) => {
      const restantes = { ...atuais }
      for (const campo of Object.keys(mudanca)) delete restantes[campo as CampoComErro]
      return restantes
    })
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const resultado = esquema.safeParse(rascunho)
    if (!resultado.success) {
      const encontrados: Partial<Record<CampoComErro, string>> = {}
      for (const problema of resultado.error.issues) {
        const campo = problema.path[0] as CampoComErro
        if (!encontrados[campo]) encontrados[campo] = problema.message
      }
      setErros(encontrados)
      return
    }

    aoSalvar({
      titulo: rascunho.titulo.trim(),
      clienteId: rascunho.clienteId,
      etapa: rascunho.etapa,
      valor: parsearValor(rascunho.valor) ?? 0,
      prioridade: rascunho.prioridade,
      prazo: rascunho.prazo,
      descricao: rascunho.descricao.trim(),
    })
  }

  return (
    <form id={idFormulario} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input
        ref={refTitulo}
        rotulo={textos.campos.titulo}
        obrigatorio
        value={rascunho.titulo}
        onChange={(evento) => definir({ titulo: evento.target.value })}
        erro={erros.titulo}
        classeCampo="sm:col-span-2"
      />

      <Select
        rotulo={textos.campos.cliente}
        obrigatorio
        value={rascunho.clienteId}
        onChange={(evento) => definir({ clienteId: evento.target.value })}
        erro={erros.clienteId}
        ajuda={semClientes ? textos.ajudas.semClientes : undefined}
        opcoes={clientes.map((cliente) => ({
          valor: cliente.id,
          rotulo: cliente.empresa ? `${cliente.nome} (${cliente.empresa})` : cliente.nome,
        }))}
        classeCampo="sm:col-span-2"
      />

      <Input
        rotulo={textos.campos.valor}
        obrigatorio
        // `decimal` abre o teclado numérico no celular sem recusar a vírgula.
        inputMode="decimal"
        value={rascunho.valor}
        onChange={(evento) => definir({ valor: evento.target.value })}
        erro={erros.valor}
        ajuda={textos.ajudas.valor}
        iconeEsquerda={<span className="text-xs font-medium">{textos.simboloMoeda}</span>}
      />

      <Select
        rotulo={textos.campos.prioridade}
        value={rascunho.prioridade}
        onChange={(evento) => definir({ prioridade: evento.target.value as Prioridade })}
        opcoes={OPCOES_PRIORIDADE}
        placeholder={null}
      />

      <Input
        rotulo={textos.campos.prazo}
        obrigatorio
        type="date"
        value={rascunho.prazo}
        onChange={(evento) => definir({ prazo: evento.target.value })}
        erro={erros.prazo}
      />

      <Select
        rotulo={textos.campos.etapa}
        value={rascunho.etapa}
        onChange={(evento) => definir({ etapa: evento.target.value as Etapa })}
        opcoes={OPCOES_ETAPA}
        placeholder={null}
      />

      <Textarea
        rotulo={textos.campos.descricao}
        rows={3}
        value={rascunho.descricao}
        onChange={(evento) => definir({ descricao: evento.target.value })}
        ajuda={textos.ajudas.descricao}
        classeCampo="sm:col-span-2"
      />
    </form>
  )
}

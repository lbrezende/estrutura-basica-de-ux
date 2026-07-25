"use client"

import { Icone } from "@/components/app/icone"
import { Badge, type VarianteBadge } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { paraAtributoDateTime, somarMinutos } from "@/lib/formato"
import type { Agendamento, Cliente, Status } from "@/lib/types"

/**
 * Um compromisso, em dois formatos.
 *
 * `denso` é a versão que cabe numa coluna de ~150px da visão de semana; sem ele
 * o cartão se espalha na visão de lista. Um componente só porque as informações
 * são as mesmas. O que muda é quanto espaço elas têm.
 */

type PropsCartaoCompromisso = {
  agendamento: Agendamento
  /** Ausente quando o cliente foi removido. O cartão avisa em vez de sumir. */
  cliente?: Cliente
  aoEditar: (agendamento: Agendamento) => void
  denso?: boolean
}

/** Barra colorida na lateral: dá para varrer a semana pelo status sem ler o badge. */
const ACENTO_POR_STATUS: Record<Status, string> = {
  ativo: "border-l-success",
  pendente: "border-l-warning",
  inativo: "border-l-muted",
}

const BADGE_POR_STATUS: Record<Status, VarianteBadge> = {
  ativo: "sucesso",
  pendente: "aviso",
  inativo: "neutra",
}

export function CartaoCompromisso({
  agendamento,
  cliente,
  aoEditar,
  denso = false,
}: PropsCartaoCompromisso) {
  const { data, hora, duracaoMin, status } = agendamento
  const horaFim = somarMinutos(hora, duracaoMin)
  const nomeCliente = cliente?.nome ?? sistema.agenda.cartao.semCliente

  // Cancelado recua por tachado, não por opacidade: opacidade derrubaria o
  // contraste do texto justamente onde ele ainda precisa ser lido.
  const cancelado = status === "inativo"

  return (
    <button
      type="button"
      onClick={() => aoEditar(agendamento)}
      className={cn(
        // `.superficie` é o fundo com gradiente e o fio de 1px por dentro. A
        // borda esquerda de 2px continua sendo o acento de status.
        "superficie w-full rounded-ds border border-l-2 border-hairline text-left",
        "transition-colors duration-150 hover:border-primary/40 hover:bg-elevated",
        ACENTO_POR_STATUS[status],
        denso ? "flex flex-col gap-1.5 p-3 md:gap-1 md:p-2" : "flex gap-3 p-3 sm:gap-4 sm:p-4"
      )}
    >
      <span className="sr-only">{sistema.agenda.cartao.editar}</span>

      {/*
        No celular a coluna vira linha e sobra largura: o corpo do cartão volta ao
        tamanho normal. A tipografia miúda só faz sentido na grade de sete colunas.
      */}
      {denso ? (
        <>
          <span className="flex items-center gap-1 text-xs font-medium text-ink md:text-[11px]">
            <time dateTime={paraAtributoDateTime(data, hora)}>{hora}</time>–
            <time dateTime={paraAtributoDateTime(data, horaFim)}>{horaFim}</time>
          </span>

          <span
            className={cn(
              "line-clamp-2 text-sm leading-snug font-medium text-ink md:text-xs",
              cancelado && "line-through"
            )}
          >
            {agendamento.titulo}
          </span>

          <span className="truncate text-xs text-muted md:text-[11px]">{nomeCliente}</span>

          {agendamento.local && (
            <span className="flex min-w-0 items-center gap-1 text-xs text-muted md:text-[11px]">
              <Icone nome="local" className="size-3 shrink-0" />
              <span className="truncate">{agendamento.local}</span>
            </span>
          )}

          <Badge
            variante={BADGE_POR_STATUS[status]}
            className="mt-0.5 self-start md:text-[10px]"
          >
            {sistema.agenda.status[status]}
          </Badge>
        </>
      ) : (
        <>
          <span className="flex w-14 shrink-0 flex-col border-r border-hairline pr-3 sm:pr-4">
            <time
              dateTime={paraAtributoDateTime(data, hora)}
              className="text-sm font-medium text-ink"
            >
              {hora}
            </time>
            <time dateTime={paraAtributoDateTime(data, horaFim)} className="text-xs text-muted">
              {horaFim}
            </time>
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "text-sm leading-snug font-medium text-ink",
                  cancelado && "line-through"
                )}
              >
                {agendamento.titulo}
              </span>
              <Badge variante={BADGE_POR_STATUS[status]} className="mt-px shrink-0">
                {sistema.agenda.status[status]}
              </Badge>
            </span>

            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span className="flex min-w-0 items-center gap-1.5">
                <Icone nome="usuario" className="size-3.5 shrink-0" />
                <span className="truncate">{nomeCliente}</span>
              </span>

              {agendamento.local && (
                <span className="flex min-w-0 items-center gap-1.5">
                  <Icone nome="local" className="size-3.5 shrink-0" />
                  <span className="truncate">{agendamento.local}</span>
                </span>
              )}
            </span>
          </span>
        </>
      )}
    </button>
  )
}

"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { contar, ehHoje, ehPassado, formatarDataPorExtenso, type DataISO } from "@/lib/formato"
import type { Agendamento, Cliente } from "@/lib/types"
import { CartaoCompromisso } from "./cartao-compromisso"

/**
 * A agenda inteira em sequência, agrupada por dia.
 *
 * Diferente da visão de semana em dois pontos que valem a existência dela: não
 * tem recorte de período (dá para ver o que vem em setembro sem clicar sete
 * vezes) e não mostra dia vazio. Aqui só aparece o que existe.
 */

type PropsVisaoLista = {
  /** Já ordenados por data e hora pela página; o agrupamento depende disso. */
  agendamentos: Agendamento[]
  clientesPorId: Map<string, Cliente>
  aoEditar: (agendamento: Agendamento) => void
}

export function VisaoLista({ agendamentos, clientesPorId, aoEditar }: PropsVisaoLista) {
  // `Map` preserva a ordem de inserção: como a entrada vem ordenada, os dias
  // saem em ordem e os compromissos de cada dia também. Sem sort extra.
  const dias = useMemo(() => {
    const mapa = new Map<DataISO, Agendamento[]>()
    for (const agendamento of agendamentos) {
      const doDia = mapa.get(agendamento.data)
      if (doDia) doDia.push(agendamento)
      else mapa.set(agendamento.data, [agendamento])
    }
    return [...mapa]
  }, [agendamentos])

  return (
    <section aria-label={sistema.agenda.visao.lista} className="flex flex-col gap-7">
      {dias.map(([dia, doDia]) => {
        const eHoje = ehHoje(dia)

        return (
          <div key={dia}>
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-hairline pb-2">
              {/* A data fica sempre em `ink`: quem marca "hoje" é o selo ao lado,
                  que não depende do contraste de `primary` no tema da vez. */}
              <h2 className={cn("font-display text-sm", ehPassado(dia) ? "text-muted" : "text-ink")}>
                {formatarDataPorExtenso(dia)}
              </h2>

              {eHoje && <Badge variante="destaque">{sistema.agenda.lista.hoje}</Badge>}

              <span className="ml-auto text-xs text-muted">
                {contar(
                  doDia.length,
                  sistema.entidades.agendamento.singular,
                  sistema.entidades.agendamento.plural
                )}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {doDia.map((agendamento) => (
                <CartaoCompromisso
                  key={agendamento.id}
                  agendamento={agendamento}
                  cliente={clientesPorId.get(agendamento.clienteId)}
                  aoEditar={aoEditar}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

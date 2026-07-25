"use client"

import { useMemo } from "react"
import { Icone } from "@/components/app/icone"
import { Button } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import {
  diasDaSemana,
  ehFimDeSemana,
  ehHoje,
  formatarDataPorExtenso,
  formatarDiaDaSemana,
  formatarDiaDoMes,
  formatarDiaDaSemanaCurto,
  formatarIntervaloDeDatas,
  hoje,
  inicioDaSemana,
  somarDias,
  type DataISO,
} from "@/lib/formato"
import type { Agendamento, Cliente } from "@/lib/types"
import { CartaoCompromisso } from "./cartao-compromisso"

/**
 * A semana de segunda a domingo.
 *
 * No desktop são sete colunas lado a lado; no celular as mesmas sete viram
 * linhas empilhadas. É a mesma marcação, muda só o `grid-cols`. Sete colunas
 * em 375px não cabem, e resolver isso com rolagem horizontal esconde metade da
 * semana atrás de um gesto que ninguém descobre.
 */

type PropsVisaoSemana = {
  /** Segunda-feira da semana exibida. */
  inicioSemana: DataISO
  /** Todos os compromissos, já ordenados por data e hora pela página. */
  agendamentos: Agendamento[]
  clientesPorId: Map<string, Cliente>
  aoMudarSemana: (inicio: DataISO) => void
  aoEditar: (agendamento: Agendamento) => void
  aoCriarNoDia: (data: DataISO) => void
}

export function VisaoSemana({
  inicioSemana,
  agendamentos,
  clientesPorId,
  aoMudarSemana,
  aoEditar,
  aoCriarNoDia,
}: PropsVisaoSemana) {
  const dias = useMemo(() => diasDaSemana(inicioSemana), [inicioSemana])
  const fimSemana = dias[6]

  // Agrupar uma vez custa menos que sete filtragens e mantém a ordem por hora
  // que a página já garantiu.
  const porDia = useMemo(() => {
    const mapa = new Map<DataISO, Agendamento[]>()
    for (const agendamento of agendamentos) {
      const doDia = mapa.get(agendamento.data)
      if (doDia) doDia.push(agendamento)
      else mapa.set(agendamento.data, [agendamento])
    }
    return mapa
  }, [agendamentos])

  return (
    <section aria-label={sistema.agenda.visao.semana}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* `aria-live` porque trocar de semana muda o conteúdo sem mover o foco. */}
        <h2 aria-live="polite" className="font-display text-base text-ink">
          {formatarIntervaloDeDatas(inicioSemana, fimSemana)}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variante="secundaria"
            tamanho="sm"
            aria-label={sistema.agenda.semana.anterior}
            onClick={() => aoMudarSemana(somarDias(inicioSemana, -7))}
            iconeEsquerda={<Icone nome="anterior" />}
          />
          <Button
            variante="secundaria"
            tamanho="sm"
            onClick={() => aoMudarSemana(inicioDaSemana(hoje()))}
            className="min-w-16"
          >
            {sistema.agenda.semana.hoje}
          </Button>
          <Button
            variante="secundaria"
            tamanho="sm"
            aria-label={sistema.agenda.semana.proxima}
            onClick={() => aoMudarSemana(somarDias(inicioSemana, 7))}
            iconeEsquerda={<Icone nome="proximo" />}
          />
        </div>
      </div>

      <div className="superficie overflow-hidden rounded-ds border border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-7">
          {dias.map((dia) => (
            <ColunaDia
              key={dia}
              dia={dia}
              agendamentos={porDia.get(dia) ?? []}
              clientesPorId={clientesPorId}
              aoEditar={aoEditar}
              aoCriarNoDia={aoCriarNoDia}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ColunaDia({
  dia,
  agendamentos,
  clientesPorId,
  aoEditar,
  aoCriarNoDia,
}: {
  dia: DataISO
  agendamentos: Agendamento[]
  clientesPorId: Map<string, Cliente>
  aoEditar: (agendamento: Agendamento) => void
  aoCriarNoDia: (data: DataISO) => void
}) {
  const eHoje = ehHoje(dia)
  const fimDeSemana = ehFimDeSemana(dia)

  return (
    <div
      // `aria-current` é o que anuncia "hoje" pra quem usa leitor de tela. O
      // destaque visual sozinho não diz nada.
      aria-current={eHoje ? "date" : undefined}
      className={cn(
        "group flex min-w-0 flex-col border-hairline",
        "border-b last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0",
        eHoje && "bg-primary/6",
        !eHoje && fimDeSemana && "bg-elevated/40"
      )}
    >
      {/* Altura fixa: a pastilha de hoje é mais alta que um número solto, e sem
          isso a linha divisória do cabeçalho desalinharia entre as colunas. */}
      <div
        className={cn(
          "flex h-11 items-center gap-2 border-b px-3",
          eHoje ? "border-primary/25 bg-primary/8" : "border-hairline"
        )}
      >
        <span className="sr-only">{formatarDataPorExtenso(dia)}</span>

        <span aria-hidden="true" className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "text-[11px] font-medium tracking-wide uppercase",
              eHoje ? "text-ink" : "text-muted"
            )}
          >
            {formatarDiaDaSemanaCurto(dia)}
          </span>

          {/*
            Hoje vira pastilha cheia em vez de número colorido: `primary` sobre
            `canvas` tem contraste baixo em alguns dos 71 temas, enquanto
            `primary-ink` sobre `primary` é o par que o próprio tema garante.
          */}
          <span
            className={cn(
              "text-sm",
              eHoje
                ? "flex size-6 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-primary-ink"
                : "text-ink"
            )}
          >
            {formatarDiaDoMes(dia)}
          </span>
        </span>

        {/*
          Atalho para marcar no dia certo, sem passar pelo campo de data.
          Escondido no celular (onde não existe hover) e revelado por hover ou
          foco na coluna. `group-focus-within` também cobre o próprio botão
          focado pelo teclado, então ele nunca fica invisível em uso.
        */}
        <button
          type="button"
          onClick={() => aoCriarNoDia(dia)}
          aria-label={sistema.agenda.semana.novoNoDia.replace("{dia}", formatarDiaDaSemana(dia))}
          className={cn(
            "ml-auto hidden size-6 shrink-0 items-center justify-center rounded-ds text-muted",
            "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
            "hover:bg-elevated hover:text-ink md:inline-flex"
          )}
        >
          <Icone nome="mais" className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2 md:min-h-40">
        {agendamentos.length === 0 ? (
          <p className="px-1 py-1 text-xs text-muted md:py-2 md:text-[11px]">
            {sistema.agenda.semana.diaLivre}
          </p>
        ) : (
          agendamentos.map((agendamento) => (
            <CartaoCompromisso
              key={agendamento.id}
              denso
              agendamento={agendamento}
              cliente={clientesPorId.get(agendamento.clienteId)}
              aoEditar={aoEditar}
            />
          ))
        )}
      </div>
    </div>
  )
}

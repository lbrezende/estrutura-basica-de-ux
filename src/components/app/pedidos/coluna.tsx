"use client"

import { useId, type DragEvent } from "react"
import { Icone } from "@/components/app/icone"
import { Button } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { contar } from "@/lib/formato"
import type { Etapa, Pedido } from "@/lib/types"
import { CartaoPedido, valorEmReais } from "./cartao-pedido"

const textos = sistema.pedidos

type PropsColuna = {
  etapa: Etapa
  pedidos: Pedido[]
  nomeDoCliente: (clienteId: string) => string
  /** Ligado enquanto um cartão sobrevoa esta coluna. */
  destacada: boolean
  idArrastando: string | null
  idParaFocar: string | null
  aoAssumirFoco: () => void
  aoEditar: (pedido: Pedido) => void
  aoMover: (pedido: Pedido, etapa: Etapa) => void
  aoCriar: () => void
  aoArrastarSobre: (evento: DragEvent<HTMLElement>) => void
  aoArrastarFora: (evento: DragEvent<HTMLElement>) => void
  aoSoltar: (evento: DragEvent<HTMLElement>) => void
  aoIniciarArraste: (id: string) => void
  aoTerminarArraste: () => void
}

/**
 * Uma etapa do quadro: cabeçalho com o resumo e a pilha de cartões.
 *
 * A coluna inteira é a área de soltar, não só a lista. Mira estreita em
 * arraste é frustração garantida, e o cabeçalho está sempre visível.
 */
export function Coluna({
  etapa,
  pedidos,
  nomeDoCliente,
  destacada,
  idArrastando,
  idParaFocar,
  aoAssumirFoco,
  aoEditar,
  aoMover,
  aoCriar,
  aoArrastarSobre,
  aoArrastarFora,
  aoSoltar,
  aoIniciarArraste,
  aoTerminarArraste,
}: PropsColuna) {
  const idTitulo = useId()
  const rotuloEtapa = sistema.etapas[etapa]
  const soma = pedidos.reduce((total, pedido) => total + pedido.valor, 0)

  return (
    <section
      aria-labelledby={idTitulo}
      onDragOver={aoArrastarSobre}
      onDragLeave={aoArrastarFora}
      onDrop={aoSoltar}
      className={cn(
        "flex w-[17.5rem] shrink-0 snap-start flex-col rounded-ds border transition-colors duration-150 xl:w-auto",
        // A coluna é um degrau ABAIXO do cartão (`elevated` diluído), senão em
        // temas onde canvas e surface são a mesma cor os dois somem juntos. O
        // degradê vertical faz o topo da pilha pegar luz e a base assentar.
        //
        // `bg-none` no estado destacado apaga o degradê: sem isso ele ficaria por
        // cima do tingimento na cor de ação, que é justamente o aviso de mira.
        destacada
          ? "border-primary bg-none bg-primary/10"
          : "border-hairline bg-linear-to-b from-elevated/70 to-elevated/25"
      )}
    >
      <header className="flex flex-col gap-0.5 border-b border-hairline px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h2 id={idTitulo} className="truncate text-[13px] font-medium text-ink">
            {rotuloEtapa}
          </h2>

          <span
            aria-hidden="true"
            className="pilula-relevo rounded-full px-1.5 py-0.5 text-[11px] font-medium text-muted tabular-nums"
          >
            {pedidos.length}
          </span>
          <span className="sr-only">
            {contar(
              pedidos.length,
              sistema.entidades.pedido.singular,
              sistema.entidades.pedido.plural
            )}
          </span>

          <Button
            variante="fantasma"
            tamanho="sm"
            aria-label={`${textos.novoNaColuna} ${rotuloEtapa}`}
            onClick={aoCriar}
            iconeEsquerda={<Icone nome="mais" />}
            className="-my-1 -mr-1.5 ml-auto shrink-0"
          />
        </div>

        <p className="text-xs text-muted tabular-nums">
          <span className="sr-only">{textos.somaDaColuna}: </span>
          {valorEmReais(soma)}
        </p>
      </header>

      {pedidos.length === 0 ? (
        <div className="flex min-h-28 flex-1 p-2">
          {/* A área tracejada ocupa a coluna inteira: o alvo do arraste é o que se vê. */}
          <p
            className={cn(
              "flex flex-1 items-center justify-center rounded-ds border border-dashed px-3 py-6 text-center text-xs",
              "transition-colors duration-150",
              destacada ? "border-primary/60 text-primary" : "border-hairline text-muted"
            )}
          >
            {destacada ? textos.soltarAqui : textos.colunaVazia}
          </p>
        </div>
      ) : (
        <ul className="flex min-h-28 flex-1 flex-col gap-2 p-2">
          {pedidos.map((pedido) => (
            <CartaoPedido
              key={pedido.id}
              pedido={pedido}
              nomeCliente={nomeDoCliente(pedido.clienteId)}
              arrastando={idArrastando === pedido.id}
              focar={idParaFocar === pedido.id}
              aoAssumirFoco={aoAssumirFoco}
              aoEditar={() => aoEditar(pedido)}
              aoMover={(destino) => aoMover(pedido, destino)}
              aoIniciarArraste={() => aoIniciarArraste(pedido.id)}
              aoTerminarArraste={aoTerminarArraste}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

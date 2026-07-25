"use client"

import { useEffect, useRef, useState, type DragEvent, type FocusEvent, type KeyboardEvent } from "react"
import { Icone } from "@/components/app/icone"
import { Badge, type VarianteBadge } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { ehPassado, formatarData, formatarMoeda, moeda } from "@/lib/formato"
import { ETAPAS, type Etapa, type Pedido, type Prioridade } from "@/lib/types"

const textos = sistema.pedidos

/**
 * Valor cheio só quando existe centavo.
 *
 * "R$ 12.400,00" em quatro colunas é ruído; "R$ 1.201" no lugar de R$ 1.200,50
 * é mentira. Mostrar centavo só quando ele existe resolve os dois.
 */
export function valorEmReais(valor: number) {
  return Number.isInteger(valor) ? formatarMoeda(valor) : moeda(valor)
}

/** Alta grita, média avisa, baixa só informa. */
const BADGE_POR_PRIORIDADE: Record<Prioridade, VarianteBadge> = {
  alta: "perigo",
  media: "aviso",
  baixa: "neutra",
}

type PropsCartaoPedido = {
  pedido: Pedido
  nomeCliente: string
  /** O cartão que está sendo arrastado neste momento fica translúcido. */
  arrastando: boolean
  /** Ligado quando o cartão acabou de ser movido pelo teclado. Ele busca o foco. */
  focar: boolean
  aoAssumirFoco: () => void
  aoEditar: () => void
  aoMover: (etapa: Etapa) => void
  aoIniciarArraste: () => void
  aoTerminarArraste: () => void
}

/**
 * Um pedido do quadro.
 *
 * Duas maneiras de mover o cartão, de propósito: arrastar (rápido, com mouse) e
 * o menu "Mover" (teclado, leitor de tela, celular, onde arrastar não existe).
 * Se só existisse o arraste, metade das pessoas não conseguiria usar a tela.
 */
export function CartaoPedido({
  pedido,
  nomeCliente,
  arrastando,
  focar,
  aoAssumirFoco,
  aoEditar,
  aoMover,
  aoIniciarArraste,
  aoTerminarArraste,
}: PropsCartaoPedido) {
  const [menuAberto, setMenuAberto] = useState(false)
  const refTitulo = useRef<HTMLButtonElement>(null)
  const refMover = useRef<HTMLButtonElement>(null)
  const refMenu = useRef<HTMLDivElement>(null)

  // Concluído não está atrasado: prazo vencido de algo entregue é história, não risco.
  const atrasado = pedido.etapa !== "concluido" && !!pedido.prazo && ehPassado(pedido.prazo)

  // Ao trocar de coluna o cartão é desmontado e remontado no destino. Sem isto,
  // quem moveu pelo teclado perderia o foco pro começo da página.
  useEffect(() => {
    if (!focar) return
    refTitulo.current?.focus()
    aoAssumirFoco()
  }, [focar, aoAssumirFoco])

  useEffect(() => {
    if (!menuAberto) return
    refMenu.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus()
  }, [menuAberto])

  function fecharMenu(devolverFoco = true) {
    setMenuAberto(false)
    if (devolverFoco) refMover.current?.focus()
  }

  function iniciarArraste(evento: DragEvent<HTMLLIElement>) {
    // Firefox só começa o arraste se houver algum dado no transporte.
    evento.dataTransfer.setData("text/plain", pedido.id)
    evento.dataTransfer.effectAllowed = "move"
    aoIniciarArraste()
  }

  function teclarNoMenu(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape") {
      evento.stopPropagation()
      fecharMenu()
      return
    }
    if (evento.key !== "ArrowDown" && evento.key !== "ArrowUp") return

    evento.preventDefault()
    const itens = Array.from(
      refMenu.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []
    )
    if (itens.length === 0) return

    const atual = itens.indexOf(document.activeElement as HTMLButtonElement)
    const passo = evento.key === "ArrowDown" ? 1 : -1
    itens[(atual + passo + itens.length) % itens.length].focus()
  }

  /** Foco saiu do bloco do menu (Tab ou clique em outro lugar): fecha sem sequestrar o foco. */
  function perderFoco(evento: FocusEvent<HTMLDivElement>) {
    if (evento.currentTarget.contains(evento.relatedTarget)) return
    setMenuAberto(false)
  }

  return (
    <li
      draggable
      onDragStart={iniciarArraste}
      onDragEnd={aoTerminarArraste}
      className={cn(
        // `.superficie` é o fundo com gradiente e o fio de 1px por dentro;
        // `.elevar-no-ponteiro` é o brilho na cor de ação que sai por `filter`,
        // já que o `box-shadow` do cartão está ocupado com o fio.
        "superficie elevar-no-ponteiro relative flex flex-col gap-2 rounded-ds border border-hairline p-3",
        // A mãozinha é o único aviso de que o cartão pode ser arrastado.
        "cursor-grab transition-[opacity,border-color] duration-150 active:cursor-grabbing",
        "hover:border-primary/40 has-[:focus-visible]:border-primary/40",
        // Em arraste o cartão continua translúcido (é o fantasma de onde ele
        // estava), mas ganha o contorno na cor de ação: dá pra achar a origem
        // sem procurar.
        arrastando && "opacity-55 border-primary outline-2 outline-offset-2 outline-primary/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-[13px] leading-snug font-medium text-ink">
          {/*
            O `::after` esticado transforma o cartão inteiro em área de clique sem
            aninhar botão dentro de botão. E leva o anel de foco com ele.
          */}
          <button
            ref={refTitulo}
            type="button"
            onClick={aoEditar}
            className={cn(
              // O `::after` cobre o cartão inteiro, então é ele quem manda no cursor:
              // sem isto o miolo do cartão volta para a setinha padrão do <button>.
              "cursor-grab text-left active:cursor-grabbing",
              "after:absolute after:inset-0 after:rounded-ds after:content-['']",
              // O `!` derruba o foco global do globals.css (que está fora de camada
              // e venceria a utility): o anel fica só no `::after`, contornando o
              // cartão inteiro em vez de apenas as palavras do título.
              "focus-visible:outline-none! focus-visible:after:outline-2",
              "focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
            )}
          >
            {pedido.titulo}
          </button>
        </h3>

        <Badge variante={BADGE_POR_PRIORIDADE[pedido.prioridade]} className="shrink-0">
          <span className="sr-only">{textos.campos.prioridade}: </span>
          {textos.prioridades[pedido.prioridade]}
        </Badge>
      </div>

      <p className="truncate text-xs text-muted">{nomeCliente}</p>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-ink tabular-nums">
          <span className="sr-only">{textos.campos.valor}: </span>
          {valorEmReais(pedido.valor)}
        </span>

        {pedido.prazo && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] tabular-nums",
              atrasado ? "text-danger" : "text-muted"
            )}
          >
            <Icone nome={atrasado ? "alerta" : "calendar"} className="size-3 shrink-0" />
            <span className="sr-only">
              {atrasado ? `${textos.atrasado}. ` : ""}
              {textos.campos.prazo}:{" "}
            </span>
            <time dateTime={pedido.prazo}>{formatarData(pedido.prazo)}</time>
          </span>
        )}
      </div>

      {/* `relative` para ficar acima da área de clique esticada do título. */}
      <div className="relative flex flex-col gap-1" onBlur={perderFoco}>
        <button
          ref={refMover}
          type="button"
          aria-expanded={menuAberto}
          onClick={() => (menuAberto ? fecharMenu(false) : setMenuAberto(true))}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 self-end rounded-ds px-2 py-1.5 text-[11px] font-medium",
            "text-muted transition-colors duration-150 hover:bg-elevated hover:text-ink",
            menuAberto && "bg-elevated text-ink"
          )}
        >
          <Icone nome="mover" className="size-3" />
          {textos.mover}
          {/* Distingue este "Mover" dos outros cartões na lista do leitor de tela. */}
          <span className="sr-only">: {pedido.titulo}</span>
        </button>

        {menuAberto && (
          <div
            ref={refMenu}
            role="group"
            aria-label={textos.moverPara}
            onKeyDown={teclarNoMenu}
            className="superficie-elevada flex flex-col gap-0.5 rounded-ds border border-hairline p-1"
          >
            {ETAPAS.map((etapa) => {
              const etapaAtual = etapa === pedido.etapa

              return (
                <button
                  key={etapa}
                  type="button"
                  disabled={etapaAtual}
                  onClick={() => {
                    setMenuAberto(false)
                    aoMover(etapa)
                  }}
                  className={cn(
                    // `py-2.5` é alvo de toque, não estética: no celular este menu é
                    // o único jeito de mover o cartão.
                    "flex items-center justify-between gap-2 rounded-ds px-2 py-2.5 text-left text-xs",
                    "transition-colors duration-150",
                    etapaAtual ? "text-muted" : "cursor-pointer text-ink hover:bg-surface"
                  )}
                >
                  {sistema.etapas[etapa]}
                  {etapaAtual && (
                    <>
                      <Icone nome="check" className="size-3.5 shrink-0 text-primary" />
                      <span className="sr-only">{textos.etapaAtual}</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </li>
  )
}

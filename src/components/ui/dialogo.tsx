"use client"

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"

/**
 * A parte difícil de modal e drawer, escrita uma vez só.
 *
 * Prender o foco, empilhar diálogos, destravar o scroll na ordem certa e
 * devolver o foco para quem abriu são quatro problemas que sempre dão errado
 * juntos. Duas cópias disso divergem no primeiro bug, e por isso um arquivo só.
 *
 * Não é exportado pelo `index.ts`: é infraestrutura, não um primitivo de tela.
 */

const SELETOR_FOCAVEL = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

/**
 * Só o diálogo do topo responde ao Esc e prende o Tab.
 *
 * Sem essa pilha, abrir um "confirmar" dentro de um drawer fecharia os dois
 * com um único Esc.
 */
const pilha: string[] = []

// --- trava de scroll ------------------------------------------------------

let travas = 0
let overflowAnterior = ""
let paddingAnterior = ""

function travarScroll() {
  travas += 1
  if (travas > 1) return

  // Compensa a barra de rolagem que some, senão a página inteira dá um pulo.
  const larguraDaBarra = window.innerWidth - document.documentElement.clientWidth
  overflowAnterior = document.body.style.overflow
  paddingAnterior = document.body.style.paddingRight
  document.body.style.overflow = "hidden"
  if (larguraDaBarra > 0) document.body.style.paddingRight = `${larguraDaBarra}px`
}

function liberarScroll() {
  travas = Math.max(0, travas - 1)
  if (travas > 0) return
  document.body.style.overflow = overflowAnterior
  document.body.style.paddingRight = paddingAnterior
}

function focaveisDe(raiz: HTMLElement) {
  return Array.from(raiz.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)).filter(
    (elemento) =>
      elemento.getClientRects().length > 0 && elemento.getAttribute("aria-hidden") !== "true"
  )
}

export type OpcoesDialogo = {
  aberto: boolean
  aoFechar: () => void
  /** Para onde o foco vai ao abrir. Sem isso, vai para o primeiro elemento focável. */
  focoInicial?: RefObject<HTMLElement | null>
}

export function useDialogoAcessivel({ aberto, aoFechar, focoInicial }: OpcoesDialogo) {
  const painelRef = useRef<HTMLDivElement>(null)
  const id = useId()

  // `createPortal` precisa de `document`; no servidor não existe.
  const [montado, setMontado] = useState(false)
  const [visivel, setVisivel] = useState(false)

  // Guardar os callbacks em ref deixa o efeito pesado depender só de `aberto`.
  // Sem isso, uma função inline no `aoFechar` reiniciaria o foco a cada render.
  const aoFecharRef = useRef(aoFechar)
  const focoInicialRef = useRef(focoInicial)
  useEffect(() => {
    aoFecharRef.current = aoFechar
    focoInicialRef.current = focoInicial
  })

  useEffect(() => {
    setMontado(true)
  }, [])

  const ativo = aberto && montado

  useEffect(() => {
    if (!ativo) return

    const quemAbriu = document.activeElement as HTMLElement | null
    const painel = painelRef.current
    pilha.push(id)
    travarScroll()

    const alvo =
      focoInicialRef.current?.current ?? (painel ? (focaveisDe(painel)[0] ?? painel) : null)
    alvo?.focus()

    function aoTeclar(evento: KeyboardEvent) {
      if (pilha[pilha.length - 1] !== id) return
      const painel = painelRef.current
      if (!painel) return

      if (evento.key === "Escape") {
        evento.preventDefault()
        aoFecharRef.current()
        return
      }
      if (evento.key !== "Tab") return

      const focaveis = focaveisDe(painel)
      if (focaveis.length === 0) {
        evento.preventDefault()
        painel.focus()
        return
      }

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      const ativo = document.activeElement

      // Foco escapou para o fundo (clique no overlay, por exemplo): traz de volta.
      if (!painel.contains(ativo)) {
        evento.preventDefault()
        ;(evento.shiftKey ? ultimo : primeiro).focus()
        return
      }
      if (evento.shiftKey && (ativo === primeiro || ativo === painel)) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && ativo === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    // Fase de captura: o diálogo decide antes de qualquer campo lá dentro.
    document.addEventListener("keydown", aoTeclar, true)

    return () => {
      document.removeEventListener("keydown", aoTeclar, true)
      const indice = pilha.lastIndexOf(id)
      if (indice >= 0) pilha.splice(indice, 1)
      liberarScroll()
      // Devolve o foco pro botão que abriu, se ele ainda estiver na tela.
      if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus()
    }
  }, [ativo, id])

  // Entrada suave sem keyframes: pinta uma vez no estado inicial e só então
  // troca as classes, deixando a transição do Tailwind fazer o resto.
  useEffect(() => {
    if (!ativo) {
      setVisivel(false)
      return
    }
    const quadro = requestAnimationFrame(() => setVisivel(true))
    return () => cancelAnimationFrame(quadro)
  }, [ativo])

  return { painelRef, ativo, visivel, id }
}

export function PortalDialogo({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}

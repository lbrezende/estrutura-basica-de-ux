"use client"

import { Search, X } from "lucide-react"
import { useId, useRef, type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/cn"
import { sistema } from "@/content/site"
import { ALTURA_CONTROLE, classesControle, EnvelopeCampo } from "./campo"

export type CampoBuscaProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "type"
> & {
  valor: string
  aoMudar: (valor: string) => void
  /** Rótulo acessível. Fica escondido dos olhos por padrão. Ver `ocultarRotulo`. */
  rotulo?: string
  ocultarRotulo?: boolean
  classeCampo?: string
}

/**
 * Busca controlada: quem chama guarda o texto e filtra a lista.
 *
 * O botão de limpar só aparece quando há o que limpar e devolve o foco ao
 * campo. Quem está filtrando pelo teclado continua de onde parou.
 */
export function CampoBusca({
  valor,
  aoMudar,
  rotulo = sistema.acoes.buscar,
  ocultarRotulo = true,
  classeCampo,
  className,
  id,
  placeholder = sistema.acoes.buscar,
  ...props
}: CampoBuscaProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado
  const entradaRef = useRef<HTMLInputElement>(null)

  function limpar() {
    aoMudar("")
    entradaRef.current?.focus()
  }

  return (
    <EnvelopeCampo id={idCampo} rotulo={rotulo} ocultarRotulo={ocultarRotulo} className={classeCampo}>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        />

        <input
          ref={entradaRef}
          id={idCampo}
          type="search"
          value={valor}
          onChange={(evento) => aoMudar(evento.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            classesControle(),
            ALTURA_CONTROLE,
            "pr-11 pl-10",
            // Escondemos o "x" nativo do WebKit: já temos o nosso, alinhado ao tema.
            "[&::-webkit-search-cancel-button]:appearance-none",
            className
          )}
          {...props}
        />

        {valor.length > 0 && (
          <button
            type="button"
            onClick={limpar}
            aria-label={sistema.acoes.limpar}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-ds text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </EnvelopeCampo>
  )
}

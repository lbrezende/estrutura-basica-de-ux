import { Inbox } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export type EstadoVazioProps = {
  icone?: ReactNode
  titulo: string
  texto?: string
  /** Normalmente um `<Button>` que cria o primeiro item. */
  acao?: ReactNode
  /** `sm` para vazios dentro de card ou coluna de kanban. */
  tamanho?: "sm" | "md"
  className?: string
}

/**
 * Lista vazia não é erro. É a primeira tela que a pessoa vê.
 *
 * Por isso todo vazio tem uma saída: os textos vêm de `sistema.vazios` no
 * `site.ts` e a ação leva direto para o que destrava a tela.
 */
export function EstadoVazio({
  icone,
  titulo,
  texto,
  acao,
  tamanho = "md",
  className,
}: EstadoVazioProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        tamanho === "sm" ? "gap-2 px-4 py-8" : "gap-3 px-6 py-14",
        className
      )}
    >
      {/* O ícone fica num disco com relevo, não solto sobre o fundo. Um vazio
          sem esse peso parece página que não terminou de carregar. */}
      <span
        aria-hidden="true"
        className={cn(
          "superficie-elevada flex items-center justify-center rounded-full border border-hairline text-muted",
          tamanho === "sm" ? "size-9 [&_svg]:size-4" : "size-12 [&_svg]:size-5"
        )}
      >
        {icone ?? <Inbox />}
      </span>

      <div className="flex flex-col gap-1">
        <p className={cn("font-display text-ink", tamanho === "sm" ? "text-sm" : "text-base")}>
          {titulo}
        </p>
        {texto && (
          <p className="max-w-sm text-sm leading-relaxed text-balance text-muted">{texto}</p>
        )}
      </div>

      {acao && <div className="mt-2">{acao}</div>}
    </div>
  )
}

import type { ComponentPropsWithRef } from "react"
import { cn } from "@/lib/cn"

export type VarianteBadge = "neutra" | "sucesso" | "aviso" | "perigo" | "destaque"

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  variante?: VarianteBadge
  /** Bolinha antes do rótulo. Ajuda a ler status numa lista longa. */
  ponto?: boolean
}

/**
 * Fundo e borda são tintas da própria cor semântica (`/12`, `/25`).
 *
 * Cor sólida exigiria escolher um texto legível em cima dela, e isso muda a cada
 * um dos 71 temas. Tinta sobre o fundo mantém o contraste do texto onde já
 * sabemos que funciona: a cor semântica sobre o canvas.
 *
 * A neutra é a única sem cor própria para se apoiar, e é justo ela a que mais
 * aparece. Ganha o relevo da pílula: uma linha clara no canto de cima e uma
 * escura no de baixo, o suficiente para virar objeto em vez de mancha.
 */
const VARIANTES: Record<VarianteBadge, string> = {
  neutra: "pilula-relevo border-hairline text-muted",
  sucesso: "border-success/25 bg-success/12 text-success",
  aviso: "border-warning/25 bg-warning/12 text-warning",
  perigo: "border-danger/25 bg-danger/12 text-danger",
  destaque: "border-primary/30 bg-primary/12 text-primary",
}

export function Badge({ variante = "neutra", ponto = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        VARIANTES[variante],
        className
      )}
      {...props}
    >
      {ponto && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

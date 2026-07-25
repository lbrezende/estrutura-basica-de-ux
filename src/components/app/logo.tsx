import { marca } from "@/content/site"
import { cn } from "@/lib/cn"

type PropsLogo = {
  className?: string
  /** Só o símbolo, sem o nome ao lado (o nome continua no leitor de tela). */
  somenteSimbolo?: boolean
}

/**
 * A marca é desenhada em SVG e pintada com `currentColor` para herdar o
 * `text-primary`. Trocar o design system no JSON repinta o logo junto.
 */
export function Logo({ className, somenteSimbolo = false }: PropsLogo) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0 text-primary"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="16"
          cy="16"
          r="12.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M16 3.5a12.5 12.5 0 0 1 10.83 6.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="5" fill="currentColor" />
      </svg>

      {somenteSimbolo ? (
        <span className="sr-only">{marca.nome}</span>
      ) : (
        <span
          className="truncate font-display text-base text-ink"
          style={{ fontWeight: "var(--ds-display-weight)", letterSpacing: "var(--ds-tracking)" }}
        >
          {marca.nome}
        </span>
      )}
    </span>
  )
}

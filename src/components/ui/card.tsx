import type { ComponentPropsWithRef } from "react"
import { cn } from "@/lib/cn"

/**
 * Superfície padrão do produto. O espaçamento interno é sempre 20px (`p-5`), e
 * cabeçalho, conteúdo e rodapé se encaixam sem que você precise pensar nisso.
 *
 * O fundo vem da `.superficie`: um gradiente vertical quase imperceptível mais
 * um fio de 1px por dentro da borda. É o que separa "retângulo com borda" de
 * "painel". A receita mora no `globals.css` e vale nos 71 temas.
 */

export type CardProps = ComponentPropsWithRef<"div"> & {
  /** Sinaliza que o card inteiro é clicável (lista de clientes, card do kanban). */
  interativo?: boolean
}

export function Card({ interativo = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "superficie rounded-ds border border-hairline text-ink",
        interativo &&
          "cursor-pointer transition-colors duration-150 hover:border-primary/40 hover:bg-elevated",
        className
      )}
      {...props}
    />
  )
}

export function CardCabecalho({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} {...props} />
}

export type CardTituloProps = ComponentPropsWithRef<"h3"> & {
  /** Ajuste a hierarquia conforme a página. Nunca pule níveis de título. */
  como?: "h2" | "h3" | "h4"
}

export function CardTitulo({ como: Tag = "h3", className, ...props }: CardTituloProps) {
  return <Tag className={cn("font-display text-base text-ink", className)} {...props} />
}

export function CardDescricao({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p className={cn("text-sm leading-relaxed text-muted", className)} {...props} />
}

export function CardConteudo({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("p-5", className)} {...props} />
}

export type CardRodapeProps = ComponentPropsWithRef<"div"> & {
  /** Linha separando o rodapé do conteúdo. Útil quando o rodapé tem ações. */
  divisor?: boolean
}

export function CardRodape({ divisor = false, className, ...props }: CardRodapeProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-5 pb-5",
        divisor ? "mt-1 border-t border-hairline pt-4" : "pt-0",
        className
      )}
      {...props}
    />
  )
}

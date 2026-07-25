import Link from "next/link"
import type { ComponentPropsWithRef, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Um link com cara de botão.
 *
 * Existe porque a landing quase só navega: "Começar agora" leva para `/entrar`,
 * "Ver como funciona" desce até uma dobra. Isso é trabalho de `<a>`: quem usa
 * teclado espera Enter, quem usa leitor de tela espera ouvir "link", e o menu do
 * botão direito precisa oferecer "abrir em nova aba". O primitivo `Button`
 * renderiza `<button>` e não troca de elemento, então em vez de forçar a barra
 * (um `<button>` com `router.push` dentro) repetimos aqui só as classes visuais.
 *
 * Elas são deliberadamente idênticas às de `@/components/ui/button`. Mexeu numa
 * variante lá, espelhe aqui.
 */

export type VarianteBotaoLink = "primaria" | "secundaria"
export type TamanhoBotaoLink = "sm" | "md" | "lg"
/** Tamanho da poça de luz colorida sob o botão. Só a primária acende. */
export type BrilhoBotaoLink = "suave" | "marca"

export type BotaoLinkProps = ComponentPropsWithRef<typeof Link> & {
  variante?: VarianteBotaoLink
  tamanho?: TamanhoBotaoLink
  iconeEsquerda?: ReactNode
  iconeDireita?: ReactNode
  larguraTotal?: boolean
  /**
   * Coloca o ícone da direita dentro do chip redondo escuro. É a anatomia do CTA
   * de referência, e serve ao botão que abre o app, não a um link de rodapé.
   */
  comChip?: boolean
  /** `marca` é o brilho grande do herói. O resto da página fica no `suave`. */
  brilho?: BrilhoBotaoLink
}

const BASE =
  "group inline-flex select-none items-center justify-center rounded-ds font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,opacity,filter] duration-150 active:translate-y-px " +
  // Espelha o mínimo de 44px do primitivo `Button` para dedo.
  "pointer-coarse:min-h-11 pointer-coarse:min-w-11"

const VARIANTES: Record<VarianteBotaoLink, string> = {
  primaria: "preenchimento-acao text-primary-ink hover:brightness-[1.08]",
  secundaria: "superficie border border-hairline text-ink hover:bg-elevated",
}

/**
 * Os dois brilhos são `box-shadow`, e `box-shadow` é uma propriedade só. Por
 * isso o brilho entra por prop e nunca por `className`: assim só uma das duas
 * classes chega ao HTML, e não é a ordem do CSS que decide qual vence.
 */
const BRILHOS: Record<BrilhoBotaoLink, string> = {
  suave: "brilho-suave",
  marca: "brilho-marca",
}

const TAMANHOS: Record<TamanhoBotaoLink, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px] [&_svg]:size-3.5",
  md: "h-10 gap-2 px-4 text-sm [&_svg]:size-4",
  lg: "h-12 gap-2 px-6 text-[15px] [&_svg]:size-[18px]",
}

/** O chip é redondo e quase da altura do botão. Sobra pouco espaço à direita. */
const RECUO_DO_CHIP: Record<TamanhoBotaoLink, string> = {
  sm: "pr-1",
  md: "pr-1.5",
  lg: "pr-2",
}

export function BotaoLink({
  variante = "primaria",
  tamanho = "md",
  iconeEsquerda,
  iconeDireita,
  larguraTotal = false,
  comChip = false,
  brilho = "suave",
  className,
  children,
  ...props
}: BotaoLinkProps) {
  const chip = comChip && !!iconeDireita

  return (
    <Link
      className={cn(
        BASE,
        VARIANTES[variante],
        variante === "primaria" && BRILHOS[brilho],
        TAMANHOS[tamanho],
        chip && RECUO_DO_CHIP[tamanho],
        larguraTotal && "w-full",
        className
      )}
      {...props}
    >
      {iconeEsquerda}
      {children}
      {chip ? (
        <span aria-hidden="true" className="chip-seta">
          {iconeDireita}
        </span>
      ) : (
        iconeDireita
      )}
    </Link>
  )
}

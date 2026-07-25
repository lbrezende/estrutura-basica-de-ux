import { LoaderCircle } from "lucide-react"
import type { ComponentPropsWithRef, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * O nome do componente sempre acompanha o nome do arquivo (`button.tsx` →
 * `Button`). As PROPRIEDADES é que são em português, porque é o que você lê e
 * escreve o dia inteiro montando tela.
 */

export type VarianteBotao = "primaria" | "secundaria" | "fantasma" | "perigo"
export type TamanhoBotao = "sm" | "md" | "lg"

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
  /** Mostra o spinner e bloqueia o clique. O rótulo continua visível para o botão não encolher. */
  carregando?: boolean
  iconeEsquerda?: ReactNode
  iconeDireita?: ReactNode
  larguraTotal?: boolean
  /**
   * Coloca o ícone da direita dentro do chip redondo escuro. É a anatomia do CTA
   * de referência, e serve ao botão que abre o app, não a um botão de lista.
   */
  comChip?: boolean
}

const BASE =
  "inline-flex select-none items-center justify-center rounded-ds font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,opacity,filter] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 " +
  // 44px é o mínimo confortável para o dedo. Só onde o ponteiro é grosso, para
  // não inchar a interface de quem usa mouse. É a mesma regra que o briefing
  // entregue ao aluno cobra, então o app tem que cumprir.
  "pointer-coarse:min-h-11 pointer-coarse:min-w-11"

/**
 * As receitas de acabamento moram no `globals.css` e valem nos 71 temas.
 *
 * `.preenchimento-acao` é o gradiente da cor de ação com o fio de luz no topo,
 * `.brilho-suave` é a sombra colorida embaixo e `.superficie` é o mesmo fundo
 * com profundidade do cartão. O hover acende com `brightness`, sem trocar de
 * tinta: mudar de cor no hover é o que faz botão parecer barato.
 */
const VARIANTES: Record<VarianteBotao, string> = {
  primaria: "preenchimento-acao brilho-suave text-primary-ink hover:brightness-[1.08]",
  secundaria: "superficie border border-hairline text-ink hover:bg-elevated",
  fantasma: "text-muted hover:bg-elevated hover:text-ink",
  // `text-canvas` em vez de uma cor fixa: o contraste sobre o vermelho fica
  // igual ao do texto vermelho sobre o fundo. Logo, funciona nos 71 temas.
  // Fica com o fio de luz, mas sem brilho: destruir não se celebra.
  perigo: "realce-topo bg-danger text-canvas shadow-sm hover:brightness-[1.08]",
}

const TAMANHOS: Record<TamanhoBotao, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px] [&_svg]:size-3.5",
  md: "h-10 gap-2 px-4 text-sm [&_svg]:size-4",
  lg: "h-12 gap-2 px-6 text-[15px] [&_svg]:size-[18px]",
}

/** Sem rótulo o botão vira quadrado, senão o ícone fica solto no meio do padding. */
const SO_ICONE: Record<TamanhoBotao, string> = {
  sm: "w-8 px-0",
  md: "w-10 px-0",
  lg: "w-12 px-0",
}

/** O chip é redondo e quase da altura do botão. Sobra pouco espaço à direita. */
const RECUO_DO_CHIP: Record<TamanhoBotao, string> = {
  sm: "pr-1",
  md: "pr-1.5",
  lg: "pr-2",
}

export function Button({
  variante = "primaria",
  tamanho = "md",
  carregando = false,
  iconeEsquerda,
  iconeDireita,
  larguraTotal = false,
  comChip = false,
  className,
  children,
  disabled,
  // Um primitivo dentro de <form> não pode enviar o formulário sem alguém pedir.
  type = "button",
  ...props
}: ButtonProps) {
  const soIcone = children === undefined || children === null || children === false
  const chip = comChip && !!iconeDireita && !soIcone

  return (
    <button
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={cn(
        BASE,
        VARIANTES[variante],
        TAMANHOS[tamanho],
        soIcone && SO_ICONE[tamanho],
        chip && RECUO_DO_CHIP[tamanho],
        larguraTotal && "w-full",
        className
      )}
      {...props}
    >
      {carregando ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : iconeEsquerda}
      {children}
      {chip ? (
        <span aria-hidden="true" className="chip-seta">
          {iconeDireita}
        </span>
      ) : (
        iconeDireita
      )}
    </button>
  )
}

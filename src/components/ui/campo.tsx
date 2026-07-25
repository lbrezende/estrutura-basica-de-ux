"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * A parte chata de um campo de formulário, escrita uma vez só.
 *
 * Rótulo ligado ao controle, mensagem de erro anunciada, texto de ajuda
 * referenciado por `aria-describedby`: input, textarea e select compartilham
 * exatamente isto. Duas cópias dessa fiação divergem no primeiro ajuste.
 */

export type PropsCompartilhadasDeCampo = {
  /** Sempre obrigatório: campo sem rótulo é campo inacessível. */
  rotulo: string
  /** Mensagem de erro. Presente = campo inválido (`aria-invalid`). */
  erro?: string
  /** Dica curta abaixo do campo. Some quando há erro, para não competir. */
  ajuda?: string
  obrigatorio?: boolean
  /** Esconde o rótulo dos olhos, não do leitor de tela. Use com muita parcimônia. */
  ocultarRotulo?: boolean
  /** Classe do bloco inteiro (rótulo + controle + mensagens). */
  classeCampo?: string
}

/**
 * Id da mensagem que descreve o campo agora.
 *
 * Segue a mesma precedência do render (erro cala a ajuda). Apontar
 * `aria-describedby` para um id que não está na tela deixa o leitor de tela mudo.
 */
export function descricaoDoCampo(id: string, ajuda?: string, erro?: string) {
  if (erro) return `${id}-erro`
  if (ajuda) return `${id}-ajuda`
  return undefined
}

/**
 * Altura dos controles: 48px.
 *
 * Um campo de 40px cabe no dedo, mas parece um campo de formulário de 2014. Os
 * 48px são o que dá ao controle a mesma presença da superfície em que ele está.
 * Vale para input, select e busca. O textarea cresce, então usa `min-height`.
 */
export const ALTURA_CONTROLE = "h-12"

/**
 * Classes do controle em si. `pr` fica de fora para quem tem ícone à direita.
 *
 * `.superficie-elevada` no lugar da cor chapada: o mesmo gradiente e o mesmo fio
 * de 1px por dentro que o resto do app usa, mais uma sombra externa de 1px que
 * levanta o campo do cartão. O anel de foco continua saindo do `:focus-visible`
 * global (2px na cor de ação), que é `outline` e não briga com esse `box-shadow`.
 */
export function classesControle(temErro?: boolean) {
  return cn(
    "superficie-elevada w-full rounded-ds border px-3 text-sm text-ink transition-colors duration-150",
    "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60",
    temErro
      ? "border-danger focus-visible:outline-danger"
      : "border-hairline hover:border-muted/40 focus-visible:border-primary"
  )
}

export function EnvelopeCampo({
  id,
  rotulo,
  ajuda,
  erro,
  obrigatorio,
  ocultarRotulo,
  className,
  children,
}: Omit<PropsCompartilhadasDeCampo, "classeCampo"> & {
  id: string
  /** Já vem de `classeCampo` nos campos; aqui é só o bloco todo. */
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-[13px] font-medium text-ink",
          ocultarRotulo && "sr-only"
        )}
      >
        {rotulo}
        {obrigatorio && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>

      {children}

      {/* O erro cala a ajuda: duas mensagens ao mesmo tempo viram ruído. */}
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="text-[13px] text-danger">
          {erro}
        </p>
      ) : (
        ajuda && (
          <p id={`${id}-ajuda`} className="text-[13px] leading-relaxed text-muted">
            {ajuda}
          </p>
        )
      )}
    </div>
  )
}

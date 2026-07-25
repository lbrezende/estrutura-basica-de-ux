"use client"

import { X } from "lucide-react"
import { useId, type ReactNode, type RefObject } from "react"
import { cn } from "@/lib/cn"
import { sistema } from "@/content/site"
import { Button } from "./button"
import { PortalDialogo, useDialogoAcessivel } from "./dialogo"

export type TamanhoModal = "sm" | "md" | "lg"

export type ModalProps = {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  descricao?: string
  /** Ícone à esquerda do título. Passe a cor no próprio ícone: `<X className="text-danger" />`. */
  icone?: ReactNode
  children?: ReactNode
  /** Ações do rodapé. Empilham no celular, alinham à direita no desktop. */
  rodape?: ReactNode
  tamanho?: TamanhoModal
  /** `alertdialog` para decisões que interrompem o fluxo. Ver `Confirmar`. */
  papel?: "dialog" | "alertdialog"
  fecharNoOverlay?: boolean
  mostrarFechar?: boolean
  refFocoInicial?: RefObject<HTMLElement | null>
  className?: string
}

const TAMANHOS: Record<TamanhoModal, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
}

/**
 * No celular sobe pela base como uma folha; no desktop aparece centralizado.
 * É a mesma marcação, só muda o ponto de ancoragem.
 */
export function Modal({
  aberto,
  aoFechar,
  titulo,
  descricao,
  icone,
  children,
  rodape,
  tamanho = "md",
  papel = "dialog",
  fecharNoOverlay = true,
  mostrarFechar = true,
  refFocoInicial,
  className,
}: ModalProps) {
  const idBase = useId()
  const { painelRef, ativo, visivel } = useDialogoAcessivel({
    aberto,
    aoFechar,
    focoInicial: refFocoInicial,
  })

  if (!ativo) return null

  return (
    <PortalDialogo>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <div
          aria-hidden="true"
          onMouseDown={fecharNoOverlay ? aoFechar : undefined}
          className={cn(
            "absolute inset-0 bg-canvas/75 backdrop-blur-sm transition-opacity duration-200",
            visivel ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={painelRef}
          role={papel}
          aria-modal="true"
          aria-labelledby={`${idBase}-titulo`}
          aria-describedby={descricao ? `${idBase}-descricao` : undefined}
          tabIndex={-1}
          className={cn(
            "superficie-elevada fio-luz relative flex max-h-[92dvh] w-full flex-col overflow-hidden",
            "rounded-t-ds border border-hairline outline-none sm:max-h-[85dvh] sm:rounded-ds",
            // A sombra grande sai por `filter` e não por `box-shadow`: o
            // `box-shadow` do painel já carrega o fio de 1px da superfície, e a
            // segunda declaração apagaria a primeira.
            "drop-shadow-[0_24px_56px_var(--sombra-difusa)]",
            "transition-[opacity,transform] duration-200 ease-out",
            visivel
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-95",
            TAMANHOS[tamanho],
            className
          )}
        >
          <div className="flex shrink-0 items-start gap-3 p-5 pb-4">
            {icone && (
              <span
                aria-hidden="true"
                className="superficie-elevada mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-[18px]"
              >
                {icone}
              </span>
            )}

            <div className="flex min-w-0 flex-col gap-1">
              <h2 id={`${idBase}-titulo`} className="font-display text-base text-ink">
                {titulo}
              </h2>
              {descricao && (
                <p id={`${idBase}-descricao`} className="text-sm leading-relaxed text-muted">
                  {descricao}
                </p>
              )}
            </div>

            {mostrarFechar && (
              <Button
                variante="fantasma"
                tamanho="sm"
                aria-label={sistema.acoes.fechar}
                onClick={aoFechar}
                iconeEsquerda={<X />}
                className="-mt-1 -mr-1 ml-auto shrink-0"
              />
            )}
          </div>

          {children && (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
          )}

          {rodape && (
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-hairline px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end sm:pb-4">
              {rodape}
            </div>
          )}
        </div>
      </div>
    </PortalDialogo>
  )
}

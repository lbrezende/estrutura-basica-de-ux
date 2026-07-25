"use client"

import { X } from "lucide-react"
import { useId, type ReactNode, type RefObject } from "react"
import { cn } from "@/lib/cn"
import { sistema } from "@/content/site"
import { Button } from "./button"
import { PortalDialogo, useDialogoAcessivel } from "./dialogo"

export type LarguraDrawer = "sm" | "md" | "lg"

export type DrawerProps = {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  descricao?: string
  children?: ReactNode
  rodape?: ReactNode
  largura?: LarguraDrawer
  fecharNoOverlay?: boolean
  mostrarFechar?: boolean
  refFocoInicial?: RefObject<HTMLElement | null>
  className?: string
}

const LARGURAS: Record<LarguraDrawer, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
}

/**
 * Painel lateral para edição sem perder a lista de vista.
 *
 * Mesmas garantias de acessibilidade do modal (foco preso, Esc, scroll travado,
 * foco devolvido), porque as duas telas usam a mesma infraestrutura. No celular
 * ocupa a largura toda: 375px não comporta lista e painel ao mesmo tempo.
 */
export function Drawer({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  rodape,
  largura = "md",
  fecharNoOverlay = true,
  mostrarFechar = true,
  refFocoInicial,
  className,
}: DrawerProps) {
  const idBase = useId()
  const { painelRef, ativo, visivel } = useDialogoAcessivel({
    aberto,
    aoFechar,
    focoInicial: refFocoInicial,
  })

  if (!ativo) return null

  return (
    <PortalDialogo>
      <div className="fixed inset-0 z-50 flex justify-end">
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
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${idBase}-titulo`}
          aria-describedby={descricao ? `${idBase}-descricao` : undefined}
          tabIndex={-1}
          className={cn(
            "superficie-elevada fio-luz relative flex h-dvh w-full flex-col border-l border-hairline outline-none",
            // Mesma razão do modal: o `box-shadow` do painel já é o fio da
            // superfície, então a sombra grande vem por `filter`.
            "drop-shadow-[0_0_56px_var(--sombra-difusa)]",
            "transition-transform duration-200 ease-out",
            visivel ? "translate-x-0" : "translate-x-full",
            LARGURAS[largura],
            className
          )}
        >
          <div className="flex shrink-0 items-start gap-3 border-b border-hairline p-5">
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

          <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>

          {rodape && (
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-hairline px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end">
              {rodape}
            </div>
          )}
        </div>
      </div>
    </PortalDialogo>
  )
}

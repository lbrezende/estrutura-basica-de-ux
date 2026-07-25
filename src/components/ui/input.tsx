"use client"

import { useId, type ComponentPropsWithRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import {
  ALTURA_CONTROLE,
  classesControle,
  descricaoDoCampo,
  EnvelopeCampo,
  type PropsCompartilhadasDeCampo,
} from "./campo"

export type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> &
  PropsCompartilhadasDeCampo & {
    iconeEsquerda?: ReactNode
    iconeDireita?: ReactNode
  }

export function Input({
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  ocultarRotulo,
  classeCampo,
  iconeEsquerda,
  iconeDireita,
  className,
  id,
  type = "text",
  ...props
}: InputProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado

  return (
    <EnvelopeCampo
      id={idCampo}
      rotulo={rotulo}
      erro={erro}
      ajuda={ajuda}
      obrigatorio={obrigatorio}
      ocultarRotulo={ocultarRotulo}
      className={classeCampo}
    >
      <div className="relative">
        {iconeEsquerda && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted [&_svg]:size-4"
          >
            {iconeEsquerda}
          </span>
        )}

        <input
          id={idCampo}
          type={type}
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoDoCampo(idCampo, ajuda, erro)}
          className={cn(
            classesControle(!!erro),
            ALTURA_CONTROLE,
            iconeEsquerda && "pl-10",
            iconeDireita && "pr-10",
            className
          )}
          {...props}
        />

        {iconeDireita && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted [&_svg]:size-4"
          >
            {iconeDireita}
          </span>
        )}
      </div>
    </EnvelopeCampo>
  )
}

"use client"

import { useId, type ComponentPropsWithRef } from "react"
import { cn } from "@/lib/cn"
import {
  classesControle,
  descricaoDoCampo,
  EnvelopeCampo,
  type PropsCompartilhadasDeCampo,
} from "./campo"

export type TextareaProps = ComponentPropsWithRef<"textarea"> & PropsCompartilhadasDeCampo

export function Textarea({
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  ocultarRotulo,
  classeCampo,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
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
      <textarea
        id={idCampo}
        rows={rows}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricaoDoCampo(idCampo, ajuda, erro)}
        // `resize-y`: crescer é útil, encolher a largura quebra o layout da coluna.
        // O piso é 96px, quatro vezes a linha, para o campo nascer com a mesma
        // presença dos controles de 48px ao lado dele.
        className={cn(classesControle(!!erro), "min-h-24 resize-y py-3 leading-relaxed", className)}
        {...props}
      />
    </EnvelopeCampo>
  )
}

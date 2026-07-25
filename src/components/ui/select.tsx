"use client"

import { ChevronDown } from "lucide-react"
import { useId, type ComponentPropsWithRef } from "react"
import { cn } from "@/lib/cn"
import { sistema } from "@/content/site"
import {
  ALTURA_CONTROLE,
  classesControle,
  descricaoDoCampo,
  EnvelopeCampo,
  type PropsCompartilhadasDeCampo,
} from "./campo"

export type OpcaoSelect = {
  valor: string
  rotulo: string
  desabilitada?: boolean
}

export type SelectProps = ComponentPropsWithRef<"select"> &
  PropsCompartilhadasDeCampo & {
    opcoes?: OpcaoSelect[]
    /** Primeira opção, vazia e não selecionável. Passe `null` para não ter nenhuma. */
    placeholder?: string | null
  }

/**
 * `<select>` nativo, de propósito.
 *
 * No celular ele abre a roleta do sistema, funciona com teclado, com leitor de
 * tela e com busca por digitação sem uma linha de JavaScript. Reimplementar
 * isso à mão costuma piorar. O que fazemos aqui é só vestir.
 */
export function Select({
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  ocultarRotulo,
  classeCampo,
  opcoes,
  placeholder = sistema.acoes.selecione,
  className,
  id,
  children,
  ...props
}: SelectProps) {
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
        <select
          id={idCampo}
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoDoCampo(idCampo, ajuda, erro)}
          className={cn(
            classesControle(!!erro),
            ALTURA_CONTROLE,
            "cursor-pointer appearance-none pr-10",
            // Alguns navegadores pintam a lista com as cores do sistema; isto ajuda.
            "[&>option]:bg-elevated [&>option]:text-ink",
            className
          )}
          {...props}
        >
          {placeholder !== null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {opcoes?.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor} disabled={opcao.desabilitada}>
              {opcao.rotulo}
            </option>
          ))}
          {children}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </EnvelopeCampo>
  )
}

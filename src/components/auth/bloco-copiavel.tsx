"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Icone } from "@/components/app/icone"
import { Button } from "@/components/ui"
import { entrada } from "@/content/site"
import { cn } from "@/lib/cn"

type EstadoCopia = "parado" | "copiado" | "falhou"

export type BlocoCopiavelProps = {
  /** Pode ter mais de uma linha: o bloco preserva as quebras. */
  codigo: string
  /** Cabeçalho do bloco. Também descreve o botão para quem usa leitor de tela. */
  rotulo?: string
  className?: string
}

/**
 * Trecho de código com botão de copiar.
 *
 * Quem nunca programou digita `localhost:3000/api/auth/callback/google` errado
 * na primeira tentativa e passa meia hora atrás do motivo. Copiar é o recurso
 * de acessibilidade real desta tela.
 */
export function BlocoCopiavel({ codigo, rotulo, className }: BlocoCopiavelProps) {
  const [estado, setEstado] = useState<EstadoCopia>("parado")
  const idRotulo = useId()
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current)
    },
    []
  )

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setEstado("copiado")
    } catch {
      // A área de transferência exige contexto seguro (https ou localhost) e
      // permissão do navegador. Quando falha, a saída é selecionar e usar Ctrl+C.
      setEstado("falhou")
    }

    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setEstado("parado"), 2500)
  }

  const copiado = estado === "copiado"

  return (
    <div
      className={cn("overflow-hidden rounded-ds border border-hairline bg-elevated", className)}
    >
      <div className="flex items-center gap-2 border-b border-hairline py-1.5 pr-1.5 pl-3">
        {rotulo && (
          <span
            id={idRotulo}
            className="truncate font-mono text-[11px] tracking-wide text-muted"
          >
            {rotulo}
          </span>
        )}

        <Button
          variante="fantasma"
          tamanho="sm"
          onClick={copiar}
          // Descrição, não rótulo: o nome acessível continua sendo o texto
          // visível do botão (exigência do "rótulo no nome", WCAG 2.5.3).
          aria-describedby={rotulo ? idRotulo : undefined}
          iconeEsquerda={
            <Icone
              nome={copiado ? "check" : "copiar"}
              className={copiado ? "text-success" : undefined}
            />
          }
          className="ml-auto shrink-0"
        >
          {copiado ? entrada.modalGoogle.copiado : entrada.modalGoogle.copiar}
        </Button>
      </div>

      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-ink">
        <code>{codigo}</code>
      </pre>

      {estado === "falhou" && (
        <p className="border-t border-hairline px-3 py-2 text-[12px] leading-relaxed text-warning">
          {entrada.modalGoogle.falhaCopia}
        </p>
      )}

      {/* O troco visual do botão não é anunciado sozinho. Esta região é. */}
      <p role="status" className="sr-only">
        {copiado ? entrada.modalGoogle.copiado : ""}
      </p>
    </div>
  )
}

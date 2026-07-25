"use client"

import { TriangleAlert } from "lucide-react"
import { useRef } from "react"
import { sistema } from "@/content/site"
import { Button } from "./button"
import { Modal } from "./modal"

export type ConfirmarProps = {
  aberto: boolean
  titulo: string
  texto?: string
  aoConfirmar: () => void
  aoCancelar: () => void
  rotuloConfirmar?: string
  rotuloCancelar?: string
  /** Ação irreversível: botão vermelho e foco no cancelar. Ligado por padrão. */
  destrutivo?: boolean
  carregando?: boolean
}

/**
 * Confirmação para o que não dá para desfazer.
 *
 * Três decisões de propósito: `alertdialog` (o leitor de tela anuncia como
 * interrupção), foco inicial no cancelar (o caminho seguro é o padrão) e sem
 * botão de fechar no canto. A saída é escolher uma das duas opções, ou Esc.
 */
export function Confirmar({
  aberto,
  titulo,
  texto,
  aoConfirmar,
  aoCancelar,
  rotuloConfirmar = sistema.acoes.confirmar,
  rotuloCancelar = sistema.acoes.cancelar,
  destrutivo = true,
  carregando = false,
}: ConfirmarProps) {
  const cancelarRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal
      aberto={aberto}
      // Enquanto processa, fechar por fora deixaria a ação no meio do caminho.
      aoFechar={carregando ? () => {} : aoCancelar}
      papel="alertdialog"
      tamanho="sm"
      titulo={titulo}
      descricao={texto}
      mostrarFechar={false}
      fecharNoOverlay={!carregando}
      refFocoInicial={cancelarRef}
      icone={
        destrutivo ? <TriangleAlert className="text-danger" /> : <TriangleAlert className="text-warning" />
      }
      rodape={
        <>
          <Button
            ref={cancelarRef}
            variante="secundaria"
            onClick={aoCancelar}
            disabled={carregando}
          >
            {rotuloCancelar}
          </Button>
          <Button
            variante={destrutivo ? "perigo" : "primaria"}
            onClick={aoConfirmar}
            carregando={carregando}
          >
            {rotuloConfirmar}
          </Button>
        </>
      }
    />
  )
}

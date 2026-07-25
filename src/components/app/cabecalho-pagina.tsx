import type { ReactNode } from "react"

type PropsCabecalhoPagina = {
  titulo: string
  descricao?: string
  /** Botões da página (criar, filtrar, exportar…). Alinham à direita no desktop. */
  acoes?: ReactNode
}

/**
 * O topo de toda página interna. Existe para que o `h1`, o espaçamento e a
 * linha divisória sejam idênticos em Painel, Clientes, Pedidos e Agenda. É
 * consistência que ninguém precisa lembrar de reproduzir.
 */
export function CabecalhoPagina({ titulo, descricao, acoes }: PropsCabecalhoPagina) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-hairline pb-5 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className="text-xl text-ink sm:text-2xl">{titulo}</h1>
        {descricao && <p className="mt-1.5 max-w-prose text-sm text-muted">{descricao}</p>}
      </div>

      {acoes && <div className="flex shrink-0 flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  )
}

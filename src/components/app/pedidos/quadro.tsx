"use client"

import { useCallback, useMemo, useState, type DragEvent } from "react"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { ETAPAS, type Cliente, type Etapa, type Pedido } from "@/lib/types"
import { Coluna } from "./coluna"

const textos = sistema.pedidos

type PropsQuadro = {
  pedidos: Pedido[]
  clientes: Cliente[]
  aoMover: (id: string, etapa: Etapa) => void
  aoEditar: (pedido: Pedido) => void
  aoCriarEm: (etapa: Etapa) => void
}

/**
 * O quadro inteiro: quatro colunas e o estado do arraste.
 *
 * Arrastar usa a API nativa do HTML (`draggable` + os eventos `drag*`), sem
 * biblioteca. Em troca de umas poucas regras chatas (`preventDefault` no
 * `dragover`, senão o navegador recusa o drop), o cartão fica com o
 * comportamento de arraste do sistema operacional, de graça.
 */
export function Quadro({ pedidos, clientes, aoMover, aoEditar, aoCriarEm }: PropsQuadro) {
  const [idArrastando, setIdArrastando] = useState<string | null>(null)
  const [colunaAlvo, setColunaAlvo] = useState<Etapa | null>(null)
  const [idParaFocar, setIdParaFocar] = useState<string | null>(null)
  const [aviso, setAviso] = useState("")

  const porEtapa = useMemo(() => {
    const mapa = Object.fromEntries(ETAPAS.map((etapa) => [etapa, [] as Pedido[]])) as Record<
      Etapa,
      Pedido[]
    >
    for (const pedido of pedidos) (mapa[pedido.etapa] ?? mapa[ETAPAS[0]]).push(pedido)
    return mapa
  }, [pedidos])

  const nomePorCliente = useMemo(
    () => new Map(clientes.map((cliente) => [cliente.id, cliente.nome])),
    [clientes]
  )

  const nomeDoCliente = useCallback(
    (clienteId: string) => nomePorCliente.get(clienteId) ?? textos.semCliente,
    [nomePorCliente]
  )

  /**
   * `porTeclado` decide o destino do foco: quem arrastou está com a mão no
   * mouse e não precisa dele; quem usou o menu perderia o lugar sem ele.
   */
  const mover = useCallback(
    (pedido: Pedido, etapa: Etapa, porTeclado: boolean) => {
      if (pedido.etapa === etapa) return
      aoMover(pedido.id, etapa)
      setAviso(`${textos.avisoMovido} ${sistema.etapas[etapa]}: ${pedido.titulo}`)
      if (porTeclado) setIdParaFocar(pedido.id)
    },
    [aoMover]
  )

  const moverPeloMenu = useCallback(
    (pedido: Pedido, etapa: Etapa) => mover(pedido, etapa, true),
    [mover]
  )

  const limparFoco = useCallback(() => setIdParaFocar(null), [])

  const arrastarSobre = useCallback((etapa: Etapa, evento: DragEvent<HTMLElement>) => {
    // Sem isto o navegador entende "aqui não pode soltar" e nem dispara o drop.
    evento.preventDefault()
    evento.dataTransfer.dropEffect = "move"
    setColunaAlvo((atual) => (atual === etapa ? atual : etapa))
  }, [])

  const arrastarFora = useCallback((etapa: Etapa, evento: DragEvent<HTMLElement>) => {
    // O ponteiro passando por um cartão dispara `dragleave` na coluna; só apaga
    // o destaque quem realmente saiu dela.
    if (evento.currentTarget.contains(evento.relatedTarget as Node | null)) return
    setColunaAlvo((atual) => (atual === etapa ? null : atual))
  }, [])

  const soltar = useCallback(
    (etapa: Etapa, evento: DragEvent<HTMLElement>) => {
      evento.preventDefault()
      const id = evento.dataTransfer.getData("text/plain") || idArrastando
      setColunaAlvo(null)
      setIdArrastando(null)

      const pedido = pedidos.find((candidato) => candidato.id === id)
      if (pedido) mover(pedido, etapa, false)
    },
    [idArrastando, pedidos, mover]
  )

  const terminarArraste = useCallback(() => {
    setIdArrastando(null)
    setColunaAlvo(null)
  }, [])

  return (
    <div>
      {/*
        No celular as quatro etapas EMPILHAM.

        O quadro rolando de lado é exatamente a queixa de quem entrega: uma mão
        ocupada, o polegar no meio da tela e metade da coluna escondida fora da
        borda. Empilhado, cada etapa aparece inteira e a rolagem é a vertical, a
        única que o polegar faz sem soltar a caixa.

        A partir de `sm` (tablet, duas mãos) volta a faixa que rola na horizontal,
        com as margens negativas devolvendo o respiro da página para as bordas e o
        `overflow` preso aqui dentro. A partir de `xl` cabem as quatro colunas e o
        quadro vira grade.
      */}
      <div
        className={cn(
          "flex flex-col gap-3",
          "sm:-mx-6 sm:snap-x sm:snap-mandatory sm:flex-row sm:overflow-x-auto sm:overscroll-x-contain sm:scroll-px-6 sm:px-6 sm:pb-2",
          "lg:-mx-8 lg:scroll-px-8 lg:px-8",
          "xl:mx-0 xl:grid xl:grid-cols-4 xl:px-0 xl:pb-0"
        )}
      >
        {ETAPAS.map((etapa) => (
          <Coluna
            key={etapa}
            etapa={etapa}
            pedidos={porEtapa[etapa]}
            nomeDoCliente={nomeDoCliente}
            destacada={colunaAlvo === etapa}
            idArrastando={idArrastando}
            idParaFocar={idParaFocar}
            aoAssumirFoco={limparFoco}
            aoEditar={aoEditar}
            aoMover={moverPeloMenu}
            aoCriar={() => aoCriarEm(etapa)}
            aoArrastarSobre={(evento) => arrastarSobre(etapa, evento)}
            aoArrastarFora={(evento) => arrastarFora(etapa, evento)}
            aoSoltar={(evento) => soltar(etapa, evento)}
            aoIniciarArraste={setIdArrastando}
            aoTerminarArraste={terminarArraste}
          />
        ))}
      </div>

      {/* Mover é uma mudança silenciosa: sem este aviso, quem usa leitor de tela não saberia. */}
      <p role="status" aria-live="polite" className="sr-only">
        {aviso}
      </p>
    </div>
  )
}

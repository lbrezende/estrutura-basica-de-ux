"use client"

import { useCallback, useRef, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { FormularioPedido, type ValoresPedido } from "@/components/app/pedidos/formulario-pedido"
import { Quadro } from "@/components/app/pedidos/quadro"
import { Button, Confirmar, EstadoVazio, Modal } from "@/components/ui"
import { sistema } from "@/content/site"
import { useDados } from "@/lib/store"
import { ETAPAS, type Etapa, type Pedido } from "@/lib/types"

const textos = sistema.pedidos
const ID_FORMULARIO = "formulario-pedido"

/** O que o modal está fazendo agora. `null` = fechado. */
type Edicao = { modo: "criar"; etapa: Etapa } | { modo: "editar"; pedido: Pedido }

export default function PaginaPedidos() {
  const { dados, criarPedido, atualizarPedido, removerPedido } = useDados()
  const [edicao, setEdicao] = useState<Edicao | null>(null)
  const [removendo, setRemovendo] = useState<Pedido | null>(null)
  const refTitulo = useRef<HTMLInputElement>(null)

  const editando = edicao?.modo === "editar" ? edicao.pedido : null

  const criarEm = useCallback((etapa: Etapa) => setEdicao({ modo: "criar", etapa }), [])
  const editar = useCallback((pedido: Pedido) => setEdicao({ modo: "editar", pedido }), [])
  const fecharModal = useCallback(() => setEdicao(null), [])

  const mover = useCallback(
    (id: string, etapa: Etapa) => atualizarPedido(id, { etapa }),
    [atualizarPedido]
  )

  const salvar = useCallback(
    (valores: ValoresPedido) => {
      if (editando) atualizarPedido(editando.id, valores)
      else criarPedido(valores)
      setEdicao(null)
    },
    [editando, atualizarPedido, criarPedido]
  )

  const confirmarRemocao = useCallback(() => {
    if (!removendo) return
    removerPedido(removendo.id)
    setRemovendo(null)
    setEdicao(null)
  }, [removendo, removerPedido])

  return (
    <>
      <CabecalhoPagina
        titulo={textos.titulo}
        descricao={textos.descricao}
        acoes={
          <Button onClick={() => criarEm(ETAPAS[0])} iconeEsquerda={<Icone nome="mais" />}>
            {textos.novo}
          </Button>
        }
      />

      {dados.pedidos.length === 0 ? (
        <div className="superficie rounded-ds border border-hairline">
          <EstadoVazio
            icone={<Icone nome="kanban" />}
            titulo={sistema.vazios.pedidos.titulo}
            texto={sistema.vazios.pedidos.texto}
            acao={
              <Button onClick={() => criarEm(ETAPAS[0])} iconeEsquerda={<Icone nome="mais" />}>
                {sistema.vazios.pedidos.acao}
              </Button>
            }
          />
        </div>
      ) : (
        <Quadro
          pedidos={dados.pedidos}
          clientes={dados.clientes}
          aoMover={mover}
          aoEditar={editar}
          aoCriarEm={criarEm}
        />
      )}

      <Modal
        aberto={edicao !== null}
        aoFechar={fecharModal}
        titulo={editando ? textos.editar : textos.novo}
        tamanho="lg"
        refFocoInicial={refTitulo}
        rodape={
          <>
            {editando && (
              <Button
                variante="fantasma"
                onClick={() => setRemovendo(editando)}
                iconeEsquerda={<Icone nome="remover" />}
                className="text-danger hover:bg-danger/10 hover:text-danger sm:mr-auto"
              >
                {textos.remocao.acao}
              </Button>
            )}

            <Button variante="secundaria" onClick={fecharModal}>
              {sistema.acoes.cancelar}
            </Button>

            {/* O botão vive no rodapé do modal, fora do `<form>`: `form` costura os dois. */}
            <Button type="submit" form={ID_FORMULARIO}>
              {editando ? textos.salvar : textos.criar}
            </Button>
          </>
        }
      >
        {edicao && (
          <FormularioPedido
            // Trocar de pedido (ou de coluna de origem) recomeça o formulário do zero.
            key={edicao.modo === "editar" ? edicao.pedido.id : `novo-${edicao.etapa}`}
            idFormulario={ID_FORMULARIO}
            pedido={editando ?? undefined}
            etapaInicial={edicao.modo === "criar" ? edicao.etapa : undefined}
            clientes={dados.clientes}
            aoSalvar={salvar}
            refTitulo={refTitulo}
          />
        )}
      </Modal>

      <Confirmar
        aberto={removendo !== null}
        titulo={textos.remocao.titulo}
        texto={textos.remocao.texto}
        rotuloConfirmar={textos.remocao.confirmar}
        aoConfirmar={confirmarRemocao}
        aoCancelar={() => setRemovendo(null)}
      />
    </>
  )
}

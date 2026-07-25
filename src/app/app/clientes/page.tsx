"use client"

import { useMemo, useRef, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { CartaoCliente } from "@/components/app/clientes/cartao-cliente"
import { DrawerCliente } from "@/components/app/clientes/drawer-cliente"
import { FormularioCliente } from "@/components/app/clientes/formulario-cliente"
import { Icone } from "@/components/app/icone"
import {
  Button,
  CampoBusca,
  EstadoVazio,
  Modal,
  Select,
  type OpcaoSelect,
} from "@/components/ui"
import { sistema } from "@/content/site"
import { chaveDeBusca, contar } from "@/lib/formato"
import { useDados } from "@/lib/store"
import type { Status } from "@/lib/types"

const textos = sistema.clientes
const ID_FORMULARIO_NOVO = "formulario-novo-cliente"

type FiltroDeStatus = Status | "todos"

const OPCOES_FILTRO: OpcaoSelect[] = [
  { valor: "todos", rotulo: textos.filtros.todos },
  { valor: "ativo", rotulo: textos.status.ativo },
  { valor: "pendente", rotulo: textos.status.pendente },
  { valor: "inativo", rotulo: textos.status.inativo },
]

export default function PaginaClientes() {
  const { dados, criarCliente, atualizarCliente, removerCliente } = useDados()

  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState<FiltroDeStatus>("todos")
  const [cadastrando, setCadastrando] = useState(false)
  const [idAberto, setIdAberto] = useState<string | null>(null)
  const refNomeNovo = useRef<HTMLInputElement>(null)

  const termo = chaveDeBusca(busca.trim())

  const visiveis = useMemo(
    () =>
      dados.clientes
        .filter((cliente) => filtro === "todos" || cliente.status === filtro)
        .filter(
          (cliente) =>
            termo === "" ||
            chaveDeBusca(`${cliente.nome} ${cliente.empresa} ${cliente.email}`).includes(termo)
        )
        // Mais recentes primeiro: quem acabou de cadastrar vê o cartão novo no
        // topo, sem precisar procurar onde a ordem alfabética o jogou.
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)),
    [dados.clientes, filtro, termo]
  )

  const vinculos = useMemo(() => {
    const mapa = new Map<string, { pedidos: number; agendamentos: number }>()
    const doCliente = (id: string) => {
      const atual = mapa.get(id) ?? { pedidos: 0, agendamentos: 0 }
      mapa.set(id, atual)
      return atual
    }

    for (const pedido of dados.pedidos) doCliente(pedido.clienteId).pedidos += 1
    for (const agendamento of dados.agendamentos) doCliente(agendamento.clienteId).agendamentos += 1
    return mapa
  }, [dados.pedidos, dados.agendamentos])

  // Lido do store a cada render, não copiado para o estado: salvar no painel
  // atualiza o que está na tela sem uma segunda cópia para sincronizar.
  const aberto = idAberto ? (dados.clientes.find((c) => c.id === idAberto) ?? null) : null

  const nenhumCadastrado = dados.clientes.length === 0
  const filtrandoAlgo = termo !== "" || filtro !== "todos"

  function limparFiltros() {
    setBusca("")
    setFiltro("todos")
  }

  return (
    <>
      <CabecalhoPagina
        titulo={textos.titulo}
        descricao={textos.descricao}
        acoes={
          <Button onClick={() => setCadastrando(true)} iconeEsquerda={<Icone nome="mais" />}>
            {textos.novo}
          </Button>
        }
      />

      {nenhumCadastrado ? (
        <div className="superficie rounded-ds border border-hairline">
          <EstadoVazio
            icone={<Icone nome="users" />}
            titulo={sistema.vazios.clientes.titulo}
            texto={sistema.vazios.clientes.texto}
            acao={
              <Button onClick={() => setCadastrando(true)} iconeEsquerda={<Icone nome="mais" />}>
                {sistema.vazios.clientes.acao}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CampoBusca
              valor={busca}
              aoMudar={setBusca}
              rotulo={textos.filtros.buscar}
              placeholder={textos.filtros.buscar}
              classeCampo="sm:min-w-0 sm:max-w-sm sm:flex-1"
            />

            <Select
              rotulo={textos.filtros.status}
              ocultarRotulo
              opcoes={OPCOES_FILTRO}
              placeholder={null}
              value={filtro}
              onChange={(evento) => setFiltro(evento.target.value as FiltroDeStatus)}
              classeCampo="sm:w-56"
            />

            {/* Anunciado a cada mudança do filtro: sem isso, quem usa leitor de
                tela digita na busca e não recebe notícia de quantos sobraram. */}
            <p aria-live="polite" className="text-sm text-muted sm:ml-auto">
              {contar(
                visiveis.length,
                sistema.entidades.cliente.singular,
                sistema.entidades.cliente.plural
              )}
            </p>
          </div>

          {visiveis.length === 0 ? (
            <div className="superficie rounded-ds border border-hairline">
              <EstadoVazio
                icone={<Icone nome="users" />}
                titulo={textos.semResultado.titulo}
                texto={textos.semResultado.texto}
                acao={
                  <Button variante="secundaria" onClick={limparFiltros}>
                    {textos.filtros.limpar}
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visiveis.map((cliente) => {
                const contagem = vinculos.get(cliente.id)
                return (
                  <li key={cliente.id}>
                    <CartaoCliente
                      cliente={cliente}
                      pedidos={contagem?.pedidos ?? 0}
                      agendamentos={contagem?.agendamentos ?? 0}
                      aoAbrir={(escolhido) => setIdAberto(escolhido.id)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      <Modal
        aberto={cadastrando}
        aoFechar={() => setCadastrando(false)}
        titulo={textos.formulario.tituloCriar}
        descricao={textos.formulario.descricaoCriar}
        refFocoInicial={refNomeNovo}
        rodape={
          <>
            <Button variante="secundaria" onClick={() => setCadastrando(false)}>
              {sistema.acoes.cancelar}
            </Button>
            <Button type="submit" form={ID_FORMULARIO_NOVO}>
              {textos.formulario.criar}
            </Button>
          </>
        }
      >
        <FormularioCliente
          id={ID_FORMULARIO_NOVO}
          refNome={refNomeNovo}
          aoEnviar={(valores) => {
            criarCliente(valores)
            setCadastrando(false)
            // Um cadastro novo escondido por um filtro pareceria que nada aconteceu.
            if (filtrandoAlgo) limparFiltros()
          }}
        />
      </Modal>

      {aberto && (
        <DrawerCliente
          cliente={aberto}
          pedidos={dados.pedidos.filter((pedido) => pedido.clienteId === aberto.id)}
          agendamentos={dados.agendamentos.filter(
            (agendamento) => agendamento.clienteId === aberto.id
          )}
          aoFechar={() => setIdAberto(null)}
          aoSalvar={(id, valores) => {
            atualizarCliente(id, valores)
            setIdAberto(null)
          }}
          aoRemover={(id) => {
            setIdAberto(null)
            removerCliente(id)
          }}
        />
      )}
    </>
  )
}

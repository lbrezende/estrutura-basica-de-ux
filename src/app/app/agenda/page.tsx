"use client"

import { useCallback, useMemo, useState } from "react"
import { FormularioCompromisso } from "@/components/app/agenda/formulario-compromisso"
import { VisaoLista } from "@/components/app/agenda/visao-lista"
import { VisaoSemana } from "@/components/app/agenda/visao-semana"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { Button, Confirmar, EstadoVazio } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { hoje, inicioDaSemana, somarDias, type DataISO } from "@/lib/formato"
import { useDados } from "@/lib/store"
import type { Agendamento } from "@/lib/types"

const VISOES = [
  { valor: "semana", rotulo: sistema.agenda.visao.semana },
  { valor: "lista", rotulo: sistema.agenda.visao.lista },
] as const

type Visao = (typeof VISOES)[number]["valor"]

export default function PaginaAgenda() {
  const { dados, criarAgendamento, atualizarAgendamento, removerAgendamento } = useDados()

  const [visao, setVisao] = useState<Visao>("semana")
  const [inicioSemana, setInicioSemana] = useState(() => semanaDeAbertura(dados.agendamentos))
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<Agendamento | null>(null)
  const [dataInicial, setDataInicial] = useState<DataISO>(() => hoje())
  const [paraRemover, setParaRemover] = useState<Agendamento | null>(null)

  // Ordenar aqui, uma vez: as duas visões dependem da mesma ordem (dia, depois
  // hora) e as strings "AAAA-MM-DD" e "HH:MM" já comparam corretamente como texto.
  const ordenados = useMemo(
    () =>
      [...dados.agendamentos].sort((a, b) =>
        a.data === b.data ? a.hora.localeCompare(b.hora) : a.data.localeCompare(b.data)
      ),
    [dados.agendamentos]
  )

  const clientesPorId = useMemo(
    () => new Map(dados.clientes.map((cliente) => [cliente.id, cliente])),
    [dados.clientes]
  )

  /** Ao criar sem escolher o dia, cai em hoje, ou na semana que está na tela. */
  const dataSugerida = useMemo(() => {
    const agora = hoje()
    if (visao === "lista") return agora
    const fim = somarDias(inicioSemana, 6)
    return agora >= inicioSemana && agora <= fim ? agora : inicioSemana
  }, [visao, inicioSemana])

  const abrirCriacao = useCallback((data: DataISO) => {
    setEmEdicao(null)
    setDataInicial(data)
    setFormularioAberto(true)
  }, [])

  const abrirEdicao = useCallback((agendamento: Agendamento) => {
    setEmEdicao(agendamento)
    setFormularioAberto(true)
  }, [])

  const fecharFormulario = useCallback(() => setFormularioAberto(false), [])

  const salvar = useCallback(
    (valores: Omit<Agendamento, "id">) => {
      if (emEdicao) atualizarAgendamento(emEdicao.id, valores)
      else criarAgendamento(valores)

      // Salvar um compromisso de outra semana e continuar olhando a semana antiga
      // dá a impressão de que nada aconteceu. A visão acompanha a data salva.
      setInicioSemana(inicioDaSemana(valores.data))
      setFormularioAberto(false)
    },
    [emEdicao, atualizarAgendamento, criarAgendamento]
  )

  const confirmarRemocao = useCallback(() => {
    if (paraRemover) removerAgendamento(paraRemover.id)
    setParaRemover(null)
    setFormularioAberto(false)
  }, [paraRemover, removerAgendamento])

  const vazio = ordenados.length === 0

  return (
    <>
      <CabecalhoPagina
        titulo={sistema.agenda.titulo}
        descricao={sistema.agenda.descricao}
        acoes={
          <>
            <AlternadorVisao visao={visao} aoMudar={setVisao} />
            <Button onClick={() => abrirCriacao(dataSugerida)} iconeEsquerda={<Icone nome="mais" />}>
              {sistema.agenda.novo}
            </Button>
          </>
        }
      />

      {vazio ? (
        <div className="superficie rounded-ds border border-hairline">
          <EstadoVazio
            icone={<Icone nome="calendar" />}
            titulo={sistema.vazios.agenda.titulo}
            texto={sistema.vazios.agenda.texto}
            acao={
              <Button onClick={() => abrirCriacao(dataSugerida)}>
                {sistema.vazios.agenda.acao}
              </Button>
            }
          />
        </div>
      ) : visao === "semana" ? (
        <VisaoSemana
          inicioSemana={inicioSemana}
          agendamentos={ordenados}
          clientesPorId={clientesPorId}
          aoMudarSemana={setInicioSemana}
          aoEditar={abrirEdicao}
          aoCriarNoDia={abrirCriacao}
        />
      ) : (
        <VisaoLista
          agendamentos={ordenados}
          clientesPorId={clientesPorId}
          aoEditar={abrirEdicao}
        />
      )}

      <FormularioCompromisso
        aberto={formularioAberto}
        agendamento={emEdicao}
        dataInicial={dataInicial}
        clientes={dados.clientes}
        aoFechar={fecharFormulario}
        aoSalvar={salvar}
        aoRemover={emEdicao ? () => setParaRemover(emEdicao) : undefined}
      />

      <Confirmar
        aberto={paraRemover !== null}
        titulo={sistema.agenda.remocao.titulo}
        texto={sistema.agenda.remocao.texto}
        rotuloConfirmar={sistema.agenda.remocao.confirmar}
        aoConfirmar={confirmarRemocao}
        aoCancelar={() => setParaRemover(null)}
      />
    </>
  )
}

/**
 * Em que semana a tela abre.
 *
 * O normal é a semana de hoje. A exceção existe porque abrir numa semana vazia
 * tendo compromissos duas colunas adiante faz o app parecer quebrado logo no
 * primeiro acesso. Quando a semana atual não tem nada, pulamos pra próxima
 * que tem. O botão "Hoje" traz de volta a qualquer momento.
 */
function semanaDeAbertura(agendamentos: Agendamento[]): DataISO {
  const semanaAtual = inicioDaSemana(hoje())
  const fim = somarDias(semanaAtual, 6)

  if (agendamentos.some((a) => a.data >= semanaAtual && a.data <= fim)) return semanaAtual

  const proximo = agendamentos
    .filter((a) => a.data > fim)
    .reduce<DataISO | null>((menor, a) => (menor === null || a.data < menor ? a.data : menor), null)

  return proximo ? inicioDaSemana(proximo) : semanaAtual
}

/**
 * Dois botões de pressão em vez de abas: não existem painéis irmãos aqui, e
 * `aria-pressed` já diz qual está ativo sem prometer semântica de tabs.
 */
function AlternadorVisao({
  visao,
  aoMudar,
}: {
  visao: Visao
  aoMudar: (visao: Visao) => void
}) {
  return (
    <div
      role="group"
      aria-label={sistema.agenda.visao.rotulo}
      className="superficie inline-flex rounded-ds border border-hairline p-0.5"
    >
      {VISOES.map((opcao) => {
        const ativa = opcao.valor === visao

        return (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={ativa}
            onClick={() => aoMudar(opcao.valor)}
            className={cn(
              "h-8 rounded-ds px-3 text-[13px] transition-colors duration-150",
              ativa
                ? "bg-primary/12 font-medium text-primary"
                : "text-muted hover:bg-elevated hover:text-ink"
            )}
          >
            {opcao.rotulo}
          </button>
        )
      })}
    </div>
  )
}

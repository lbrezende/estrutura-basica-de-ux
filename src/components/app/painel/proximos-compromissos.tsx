import Link from "next/link"
import { Icone } from "@/components/app/icone"
import {
  Badge,
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardRodape,
  CardTitulo,
  EstadoVazio,
} from "@/components/ui"
import { sistema } from "@/content/site"
import {
  diaDoMes,
  ehHoje,
  ehPassado,
  horaMinuto,
  mesAbreviado,
  paraAtributoDateTime,
} from "@/lib/formato"
import type { Agendamento, Cliente } from "@/lib/types"

const copia = sistema.painel.compromissos

/** Quantos cabem sem transformar o painel em lista de agenda. */
const QUANTOS = 4

type PropsProximosCompromissos = {
  agendamentos: Agendamento[]
  /** Para resolver o `clienteId` em nome. O painel mostra gente, não id. */
  clientes: Cliente[]
}

export function ProximosCompromissos({ agendamentos, clientes }: PropsProximosCompromissos) {
  const nomePorId = new Map(clientes.map((cliente) => [cliente.id, cliente.nome]))

  const proximos = agendamentos
    // Cancelado ocupa espaço sem exigir nada de você. O dia inteiro de hoje
    // continua na lista mesmo já tendo passado a hora: às 15h você ainda quer
    // ver como foi o seu dia.
    .filter((agendamento) => agendamento.status !== "inativo" && !ehPassado(agendamento.data))
    .sort((a, b) =>
      paraAtributoDateTime(a.data, horaMinuto(a.hora)).localeCompare(
        paraAtributoDateTime(b.data, horaMinuto(b.hora))
      )
    )
    .slice(0, QUANTOS)

  return (
    <Card className="flex h-full flex-col">
      <CardCabecalho>
        <CardTitulo como="h2">{copia.titulo}</CardTitulo>
        <CardDescricao>{copia.descricao}</CardDescricao>
      </CardCabecalho>

      <CardConteudo className="flex-1">
        {proximos.length === 0 ? (
          <EstadoVazio
            tamanho="sm"
            icone={<Icone nome="calendar" />}
            titulo={sistema.vazios.agenda.titulo}
            texto={sistema.vazios.agenda.texto}
            acao={<LinkAgenda rotulo={sistema.vazios.agenda.acao} />}
          />
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {proximos.map((agendamento) => (
              // O recuo negativo devolve o espaço em `px-2`: a linha inteira
              // acende no ponteiro, e não só o pedaço onde o texto passa.
              <li
                key={agendamento.id}
                className="-mx-2 flex items-center gap-3 rounded-ds px-2 py-3 transition-colors duration-150 first:pt-0 last:pb-0 hover:bg-elevated/60"
              >
                <time
                  dateTime={agendamento.data}
                  className="superficie-elevada grid size-11 shrink-0 place-items-center rounded-ds leading-none"
                >
                  <span className="font-display text-sm tabular-nums text-ink">
                    {diaDoMes(agendamento.data)}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase text-muted">
                    {mesAbreviado(agendamento.data)}
                  </span>
                </time>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink">{agendamento.titulo}</p>
                    {ehHoje(agendamento.data) && (
                      <Badge variante="destaque" className="shrink-0">
                        {copia.hoje}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">
                    {nomePorId.get(agendamento.clienteId) ?? sistema.painel.semCliente}
                    {agendamento.local && ` · ${agendamento.local}`}
                  </p>
                </div>

                <time
                  dateTime={paraAtributoDateTime(agendamento.data, horaMinuto(agendamento.hora))}
                  className="shrink-0 text-sm tabular-nums text-muted"
                >
                  {horaMinuto(agendamento.hora)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardConteudo>

      {proximos.length > 0 && (
        <CardRodape divisor>
          <LinkAgenda rotulo={copia.verTodos} />
        </CardRodape>
      )}
    </Card>
  )
}

/** Ir para outra tela é navegação: `<Link>`, nunca `<button>`. */
function LinkAgenda({ rotulo }: { rotulo: string }) {
  return (
    <Link
      href="/app/agenda"
      className="inline-flex items-center gap-1.5 rounded-ds text-sm font-medium text-primary transition-colors hover:text-primary-hover"
    >
      {rotulo}
      <Icone nome="seta-direita" className="size-4" />
    </Link>
  )
}

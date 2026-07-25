"use client"

import { useState, type ReactNode } from "react"
import { Icone } from "@/components/app/icone"
import { Badge, Button, Confirmar, Drawer, type VarianteBadge } from "@/components/ui"
import { sistema } from "@/content/site"
import {
  formatarCarimbo,
  formatarData,
  formatarMoeda,
  paraAtributoDateTime,
} from "@/lib/formato"
import type { Agendamento, Cliente, Etapa, Pedido } from "@/lib/types"
import { BadgeStatus } from "./cartao-cliente"
import { FormularioCliente, type ValoresCliente } from "./formulario-cliente"

const textos = sistema.clientes
const ID_FORMULARIO = "formulario-editar-cliente"

/** Só o fim da esteira ganha verde; o resto é andamento, não conquista. */
const VARIANTE_DA_ETAPA: Record<Etapa, VarianteBadge> = {
  novo: "neutra",
  em_andamento: "destaque",
  aguardando: "aviso",
  concluido: "sucesso",
}

type PropsDrawerCliente = {
  cliente: Cliente
  /** Já filtrados por `clienteId`. O painel não sabe procurar, só mostrar. */
  pedidos: Pedido[]
  agendamentos: Agendamento[]
  aoFechar: () => void
  aoSalvar: (id: string, valores: ValoresCliente) => void
  aoRemover: (id: string) => void
}

/**
 * Editar sem sair da lista.
 *
 * O painel mostra os pedidos e os compromissos do cliente por um motivo prático:
 * é a informação que decide se você pode removê-lo. Descobrir depois do clique
 * que três pedidos foram junto seria tarde.
 */
export function DrawerCliente({
  cliente,
  pedidos,
  agendamentos,
  aoFechar,
  aoSalvar,
  aoRemover,
}: PropsDrawerCliente) {
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false)

  const proximos = [...agendamentos].sort((a, b) =>
    `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`)
  )

  return (
    <Drawer
      aberto
      aoFechar={aoFechar}
      titulo={cliente.nome}
      descricao={cliente.empresa || undefined}
      largura="lg"
      rodape={
        <>
          <Button variante="secundaria" onClick={aoFechar}>
            {sistema.acoes.cancelar}
          </Button>
          <Button type="submit" form={ID_FORMULARIO}>
            {textos.formulario.salvar}
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <BadgeStatus status={cliente.status} />
        <p className="text-[13px] text-muted">
          {textos.detalhe.desde} {formatarCarimbo(cliente.criadoEm)}
        </p>
      </div>

      <Secao titulo={textos.detalhe.dados} icone="usuario">
        {/* `key` no id: trocar de cliente tem que recarregar os campos, não mesclar. */}
        <FormularioCliente
          key={cliente.id}
          id={ID_FORMULARIO}
          cliente={cliente}
          aoEnviar={(valores) => aoSalvar(cliente.id, valores)}
        />
      </Secao>

      <Secao titulo={textos.detalhe.pedidos} icone="kanban" contagem={pedidos.length}>
        {pedidos.length === 0 ? (
          <p className="text-sm text-muted">{textos.detalhe.semPedidos}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pedidos.map((pedido) => (
              <li
                key={pedido.id}
                className="superficie-elevada rounded-ds border border-hairline px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-ink">{pedido.titulo}</p>
                  <Badge variante={VARIANTE_DA_ETAPA[pedido.etapa]} className="shrink-0">
                    {sistema.etapas[pedido.etapa]}
                  </Badge>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  {formatarMoeda(pedido.valor)} · {sistema.pedidos.campos.prazo}{" "}
                  {formatarData(pedido.prazo)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <Secao titulo={textos.detalhe.agendamentos} icone="calendar" contagem={proximos.length}>
        {proximos.length === 0 ? (
          <p className="text-sm text-muted">{textos.detalhe.semAgendamentos}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {proximos.map((agendamento) => (
              <li
                key={agendamento.id}
                className="superficie-elevada rounded-ds border border-hairline px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-ink">{agendamento.titulo}</p>
                  <Badge variante="neutra" className="shrink-0">
                    {sistema.agenda.status[agendamento.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  <time dateTime={paraAtributoDateTime(agendamento.data, agendamento.hora)}>
                    {formatarData(agendamento.data)} · {agendamento.hora}
                  </time>
                  {agendamento.local && ` · ${agendamento.local}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <Secao titulo={textos.remocao.titulo} icone="alerta">
        <p className="text-sm leading-relaxed text-muted">{textos.remocao.aviso}</p>
        <Button
          variante="secundaria"
          onClick={() => setConfirmandoRemocao(true)}
          iconeEsquerda={<Icone nome="remover" />}
          className="mt-3 border-danger/30 text-danger hover:bg-danger/10"
        >
          {textos.remocao.acao}
        </Button>
      </Secao>

      <Confirmar
        aberto={confirmandoRemocao}
        titulo={textos.remocao.confirmarTitulo}
        texto={textos.remocao.confirmarTexto}
        rotuloConfirmar={textos.remocao.confirmar}
        aoCancelar={() => setConfirmandoRemocao(false)}
        aoConfirmar={() => {
          setConfirmandoRemocao(false)
          aoRemover(cliente.id)
        }}
      />
    </Drawer>
  )
}

/**
 * Bloco do painel: título com ícone, contagem opcional e uma linha acima.
 *
 * Existe para as quatro seções terem o mesmo ritmo. Quando o espaçamento é
 * escrito à mão em cada uma, uma delas sempre fica com 4px de diferença.
 */
function Secao({
  titulo,
  icone,
  contagem,
  children,
}: {
  titulo: string
  icone: string
  contagem?: number
  children: ReactNode
}) {
  return (
    <section className="mt-7 border-t border-hairline pt-5">
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm text-ink">
        <Icone nome={icone} className="size-4 text-muted" />
        {titulo}
        {contagem !== undefined && contagem > 0 && (
          <span className="ml-auto text-[13px] font-normal text-muted">{contagem}</span>
        )}
      </h3>
      {children}
    </section>
  )
}

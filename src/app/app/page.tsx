"use client"

import { useState } from "react"
import Link from "next/link"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { CartaoMetrica } from "@/components/app/painel/cartao-metrica"
import { GraficoEtapas } from "@/components/app/painel/grafico-etapas"
import { PedidosRecentes } from "@/components/app/painel/pedidos-recentes"
import { ProximosCompromissos } from "@/components/app/painel/proximos-compromissos"
import { Card, EstadoVazio } from "@/components/ui"
import { sistema } from "@/content/site"
import { dataPorExtenso, moeda, numero, paraISO, somarDias } from "@/lib/formato"
import { useDados, useSessao } from "@/lib/store"

const copia = sistema.painel

/** "Na semana" é de hoje em diante, não a semana do calendário: no domingo a semana do calendário já acabou e a operação não. */
const DIAS_DA_SEMANA = 7

export default function PaginaPainel() {
  const { dados } = useDados()
  const sessao = useSessao()

  // Uma leitura só do relógio para a página inteira. Se cada bloco chamasse
  // `new Date()`, um render às 23h59m59s poderia misturar dois dias diferentes.
  const [agora] = useState(() => new Date())

  const { clientes, pedidos, agendamentos } = dados
  const hoje = paraISO(agora)
  const fimDaSemana = somarDias(hoje, DIAS_DA_SEMANA)

  const clientesAtivos = clientes.filter((cliente) => cliente.status === "ativo")
  const pedidosEmAberto = pedidos.filter((pedido) => pedido.etapa !== "concluido")
  const valorEmAberto = pedidosEmAberto.reduce((soma, pedido) => soma + pedido.valor, 0)

  // Data em "AAAA-MM-DD" compara direto como texto: a ordem alfabética é a
  // ordem cronológica. Sem `Date`, sem fuso horário, sem surpresa.
  const compromissosDaSemana = agendamentos.filter(
    (agendamento) =>
      agendamento.status !== "inativo" &&
      agendamento.data >= hoje &&
      agendamento.data < fimDaSemana
  )

  const primeiroNome = sessao?.nome.trim().split(/\s+/)[0] ?? ""
  const saudacao = saudacaoPara(agora.getHours())

  const semNadaCadastrado =
    clientes.length === 0 && pedidos.length === 0 && agendamentos.length === 0

  return (
    <>
      <CabecalhoPagina
        titulo={
          primeiroNome
            ? copia.saudacao.comNome.replace("{saudacao}", saudacao).replace("{nome}", primeiroNome)
            : saudacao
        }
        descricao={dataPorExtenso(hoje)}
      />

      {semNadaCadastrado ? (
        <Card>
          <EstadoVazio
            icone={<Icone nome="layout-dashboard" />}
            titulo={copia.vazio.titulo}
            texto={copia.vazio.texto}
            acao={
              // Parece um botão, mas leva pra outra tela, então é `<Link>`.
              // As classes repetem a variante primária de propósito: `Button`
              // renderiza `<button>` e não empresta a aparência para um link.
              <Link
                href="/app/clientes"
                className="inline-flex h-10 items-center gap-2 rounded-ds bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-ink shadow-sm transition-colors duration-150 hover:bg-primary-hover active:translate-y-px"
              >
                {copia.vazio.acao}
                <Icone nome="seta-direita" className="size-4" />
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Lista de definições: cada cartão é um termo (rótulo) e a sua
              definição (número). O leitor de tela lê os dois como um par. */}
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CartaoMetrica
              icone={copia.metricas.clientesAtivos.icone}
              rotulo={copia.metricas.clientesAtivos.rotulo}
              dica={copia.metricas.clientesAtivos.dica}
              valor={numero(clientesAtivos.length)}
            />
            <CartaoMetrica
              icone={copia.metricas.pedidosEmAndamento.icone}
              rotulo={copia.metricas.pedidosEmAndamento.rotulo}
              dica={copia.metricas.pedidosEmAndamento.dica}
              valor={numero(pedidosEmAberto.length)}
            />
            <CartaoMetrica
              icone={copia.metricas.valorEmAberto.icone}
              rotulo={copia.metricas.valorEmAberto.rotulo}
              dica={copia.metricas.valorEmAberto.dica}
              valor={moeda(valorEmAberto)}
            />
            <CartaoMetrica
              icone={copia.metricas.compromissosDaSemana.icone}
              rotulo={copia.metricas.compromissosDaSemana.rotulo}
              dica={copia.metricas.compromissosDaSemana.dica}
              valor={numero(compromissosDaSemana.length)}
            />
          </dl>

          {/* `*:min-w-0` = min-width 0 nos filhos diretos. Sem isso o título
              longo de um compromisso define a largura mínima da coluna, o cartão
              estoura o grid e a página inteira ganha rolagem lateral no celular. */}
          <div className="grid gap-4 *:min-w-0 lg:grid-cols-2">
            <GraficoEtapas pedidos={pedidos} />
            <ProximosCompromissos agendamentos={agendamentos} clientes={clientes} />
          </div>

          <PedidosRecentes pedidos={pedidos} clientes={clientes} />
        </div>
      )}
    </>
  )
}

function saudacaoPara(hora: number) {
  if (hora < 12) return copia.saudacao.manha
  if (hora < 18) return copia.saudacao.tarde
  return copia.saudacao.noite
}

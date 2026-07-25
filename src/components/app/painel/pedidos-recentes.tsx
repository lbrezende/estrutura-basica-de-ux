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
  type VarianteBadge,
} from "@/components/ui"
import { sistema } from "@/content/site"
import { moeda } from "@/lib/formato"
import type { Cliente, Etapa, Pedido } from "@/lib/types"

const copia = sistema.painel.recentes

/** Cinco: o suficiente para ver o movimento sem virar a tela de Pedidos. */
const QUANTOS = 5

type PropsPedidosRecentes = {
  pedidos: Pedido[]
  clientes: Cliente[]
}

/**
 * O que está andando ganha a cor de ação; o que terminou fica verde e sai do
 * caminho. "Novo" é neutro de propósito: ainda não é notícia.
 */
const BADGE_POR_ETAPA: Record<Etapa, VarianteBadge> = {
  novo: "neutra",
  em_andamento: "destaque",
  aguardando: "aviso",
  concluido: "sucesso",
}

export function PedidosRecentes({ pedidos, clientes }: PropsPedidosRecentes) {
  const nomePorId = new Map(clientes.map((cliente) => [cliente.id, cliente.nome]))

  const recentes = [...pedidos]
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .slice(0, QUANTOS)

  return (
    <Card>
      <CardCabecalho>
        <CardTitulo como="h2">{copia.titulo}</CardTitulo>
        <CardDescricao>{copia.descricao}</CardDescricao>
      </CardCabecalho>

      <CardConteudo>
        {recentes.length === 0 ? (
          <EstadoVazio
            tamanho="sm"
            icone={<Icone nome="kanban" />}
            titulo={sistema.vazios.pedidos.titulo}
            texto={sistema.vazios.pedidos.texto}
            acao={<LinkPedidos rotulo={sistema.vazios.pedidos.acao} />}
          />
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {recentes.map((pedido) => (
              // O recuo negativo devolve o espaço em `px-2`: a linha inteira
              // acende no ponteiro, e não só o pedaço onde o texto passa.
              <li
                key={pedido.id}
                className="-mx-2 flex items-center gap-3 rounded-ds px-2 py-3 transition-colors duration-150 first:pt-0 last:pb-0 hover:bg-elevated/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{pedido.titulo}</p>
                  <p className="truncate text-xs text-muted">
                    {nomePorId.get(pedido.clienteId) ?? sistema.painel.semCliente}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-sm tabular-nums text-ink">{moeda(pedido.valor)}</span>
                  <Badge variante={BADGE_POR_ETAPA[pedido.etapa]}>
                    {sistema.etapas[pedido.etapa]}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardConteudo>

      {recentes.length > 0 && (
        <CardRodape divisor>
          <LinkPedidos rotulo={copia.verTodos} />
        </CardRodape>
      )}
    </Card>
  )
}

function LinkPedidos({ rotulo }: { rotulo: string }) {
  return (
    <Link
      href="/app/pedidos"
      className="inline-flex items-center gap-1.5 rounded-ds text-sm font-medium text-primary transition-colors hover:text-primary-hover"
    >
      {rotulo}
      <Icone nome="seta-direita" className="size-4" />
    </Link>
  )
}

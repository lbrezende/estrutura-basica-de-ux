import { Icone } from "@/components/app/icone"
import {
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardTitulo,
  EstadoVazio,
} from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { contar, porcentagem } from "@/lib/formato"
import { ETAPAS, type Etapa, type Pedido } from "@/lib/types"

const copia = sistema.painel.grafico

type PropsGraficoEtapas = {
  pedidos: Pedido[]
}

/**
 * A tinta escurece conforme o pedido avança na esteira: "novo" é o mais claro,
 * "concluído" é o `primary` cheio. Dá para ler o progresso da operação pela
 * intensidade, sem depender de cor nova nenhuma.
 *
 * Cada barra é um degradê da esquerda para a direita, não um retângulo chapado:
 * a ponta acende e a base fica um degrau atrás. É a mesma tinta, com volume.
 */
const TINTA_POR_ETAPA: Record<Etapa, string> = {
  novo: "bg-linear-to-r from-primary/20 to-primary/40",
  em_andamento: "bg-linear-to-r from-primary/35 to-primary/65",
  aguardando: "bg-linear-to-r from-primary/50 to-primary/85",
  concluido: "bg-linear-to-r from-primary/65 to-primary",
}

/**
 * Barras horizontais em CSS puro: largura em porcentagem e olha o gráfico.
 *
 * Uma biblioteca de gráfico custaria dezenas de kB para desenhar quatro
 * retângulos, e ainda traria as cores dela junto. Com `div` a barra herda o
 * `primary` do design system e troca de tema com o resto do app.
 */
export function GraficoEtapas({ pedidos }: PropsGraficoEtapas) {
  const total = pedidos.length

  return (
    <Card className="flex h-full flex-col">
      <CardCabecalho>
        <div className="flex items-start justify-between gap-3">
          <CardTitulo como="h2">{copia.titulo}</CardTitulo>
          {total > 0 && (
            <span className="shrink-0 text-xs tabular-nums text-muted">
              {contar(total, sistema.entidades.pedido.singular, sistema.entidades.pedido.plural)}
            </span>
          )}
        </div>
        <CardDescricao>{copia.descricao}</CardDescricao>
      </CardCabecalho>

      <CardConteudo className="flex flex-1 flex-col">
        {total === 0 ? (
          <EstadoVazio
            tamanho="sm"
            className="m-auto"
            icone={<Icone nome="kanban" />}
            titulo={copia.vazio}
          />
        ) : (
          // Centralizado no espaço que sobra: o cartão vizinho é mais alto e,
          // empilhado no topo, o gráfico ficaria com meio cartão vazio embaixo.
          // Distribuir (`justify-between`) afastaria demais as barras.
          <ul className="flex flex-1 flex-col justify-center gap-5">
            {ETAPAS.map((etapa) => {
              const quantidade = pedidos.filter((pedido) => pedido.etapa === etapa).length
              const fracao = quantidade / total

              return (
                <li key={etapa}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm text-ink">{sistema.etapas[etapa]}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      <span className="font-medium text-ink">{quantidade}</span>
                      <span aria-hidden="true" className="px-1 opacity-50">
                        ·
                      </span>
                      {porcentagem(fracao)}
                    </span>
                  </div>

                  {/* Decorativa: a contagem e a porcentagem já estão em texto acima.
                      O trilho é a mesma `.superficie-elevada` do resto do app, então
                      ele tem o fio de 1px por dentro em vez de ser um vão chapado. */}
                  <div
                    aria-hidden="true"
                    className="superficie-elevada mt-2 h-2 overflow-hidden rounded-full"
                  >
                    <div
                      className={cn("h-full rounded-full", TINTA_POR_ETAPA[etapa])}
                      // O `max()` garante que 1 pedido em 90 continue visível como
                      // um traço em vez de virar uma barra de zero pixel.
                      style={{ width: quantidade === 0 ? 0 : `max(0.375rem, ${fracao * 100}%)` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardConteudo>
    </Card>
  )
}

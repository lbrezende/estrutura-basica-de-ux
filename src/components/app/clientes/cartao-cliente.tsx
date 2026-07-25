import { Icone } from "@/components/app/icone"
import { Badge, Card, CardTitulo, type VarianteBadge } from "@/components/ui"
import { sistema } from "@/content/site"
import { contar, iniciais } from "@/lib/formato"
import type { Cliente, Status } from "@/lib/types"

const textos = sistema.clientes

/**
 * Pendente é aviso, não erro: significa "falta uma resposta", e o amarelo diz
 * isso sem alarmar. Inativo fica neutro de propósito. Não é problema, é
 * história.
 */
const VARIANTE_DO_STATUS: Record<Status, VarianteBadge> = {
  ativo: "sucesso",
  pendente: "aviso",
  inativo: "neutra",
}

/** Reutilizado pelo painel de detalhe. O status do cliente tem uma cor só no app. */
export function BadgeStatus({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge variante={VARIANTE_DO_STATUS[status]} ponto className={className}>
      {textos.status[status]}
    </Badge>
  )
}

type PropsCartaoCliente = {
  cliente: Cliente
  /** Quantos pedidos e compromissos apontam para este cliente. */
  pedidos: number
  agendamentos: number
  aoAbrir: (cliente: Cliente) => void
}

/**
 * Cartão em vez de linha de tabela: em 375px uma tabela vira rolagem horizontal,
 * e aqui os quatro dados de contato empilham sem apertar nada.
 *
 * Só o nome é botão, e o `after:inset-0` estica a área de clique para o cartão
 * inteiro. Envolver tudo num `<button>` seria mais curto e pior: o leitor de tela
 * anunciaria "Marina Alvarenga Estúdio Clara Ativo marina@… (11) …" como se fosse
 * o nome do botão.
 */
export function CartaoCliente({ cliente, pedidos, agendamentos, aoAbrir }: PropsCartaoCliente) {
  const vinculos = [
    pedidos > 0 && contar(pedidos, sistema.entidades.pedido.singular, sistema.entidades.pedido.plural),
    agendamentos > 0 &&
      contar(
        agendamentos,
        sistema.entidades.agendamento.singular,
        sistema.entidades.agendamento.plural
      ),
  ].filter((parte): parte is string => typeof parte === "string")

  return (
    <Card
      interativo
      className="relative flex h-full flex-col gap-4 p-5 has-[:focus-visible]:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="superficie-elevada flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[13px] text-muted"
        >
          {iniciais(cliente.nome)}
        </span>

        <div className="min-w-0 flex-1">
          <CardTitulo como="h2" className="text-[15px] leading-snug">
            <button
              type="button"
              onClick={() => aoAbrir(cliente)}
              className="text-left after:absolute after:inset-0"
            >
              {cliente.nome}
            </button>
          </CardTitulo>

          {cliente.empresa && (
            <p className="mt-0.5 truncate text-sm text-muted">{cliente.empresa}</p>
          )}
        </div>

        <BadgeStatus status={cliente.status} className="shrink-0" />
      </div>

      <dl className="flex flex-col gap-1.5 text-sm text-muted">
        <div className="flex min-w-0 items-center gap-2">
          <dt className="sr-only">{textos.formulario.campos.email}</dt>
          <Icone nome="email" className="size-4 shrink-0" />
          <dd className="truncate">{cliente.email}</dd>
        </div>

        {cliente.telefone && (
          <div className="flex min-w-0 items-center gap-2">
            <dt className="sr-only">{textos.formulario.campos.telefone}</dt>
            <Icone nome="telefone" className="size-4 shrink-0" />
            <dd className="truncate">{cliente.telefone}</dd>
          </div>
        )}
      </dl>

      {vinculos.length > 0 && (
        <p className="mt-auto border-t border-hairline pt-3 text-[13px] text-muted">
          {vinculos.join(" · ")}
        </p>
      )}
    </Card>
  )
}

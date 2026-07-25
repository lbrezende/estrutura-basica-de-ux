import { Icone } from "@/components/app/icone"
import { Card } from "@/components/ui"
import { cn } from "@/lib/cn"

/**
 * Um número da operação.
 *
 * Não calcula nada de propósito: recebe o valor já formatado. Quem decide o que
 * é "cliente ativo" é a página. O cartão só sabe desenhar.
 *
 * Vai dentro de um `<dl>`: o rótulo é o termo (`dt`) e o número é a definição
 * (`dd`). Num leitor de tela isso vira "Clientes ativos: 3" em vez de dois
 * pedaços soltos de texto.
 */
type PropsCartaoMetrica = {
  /** Nome do mapa em `components/app/icone.tsx`. */
  icone: string
  rotulo: string
  /** Já formatado (`moeda()`, `numero()`). O cartão exibe como veio. */
  valor: string
  /** De onde o número saiu. É o que transforma um número grande em informação. */
  dica?: string
}

export function CartaoMetrica({ icone, rotulo, valor, dica }: PropsCartaoMetrica) {
  // "R$ 47.900,00" tem o dobro do comprimento de uma contagem. Sem baixar um
  // degrau de tipo, ele quebra em duas linhas e desalinha a fileira de cartões.
  const valorLongo = valor.length > 9

  return (
    // `.faixa-topo` é a faixa de 2px na cor de ação que fecha a aresta superior
    // do cartão. Ela mora no globals.css e desbota antes do canto arredondado.
    <Card className="faixa-topo p-5">
      {/* `min-h-10` = duas linhas de rótulo. Sem isso, "Clientes ativos" (uma
          linha) sobe o número 4px e a fileira de cartões perde a linha de base. */}
      <dt className="flex min-h-10 items-start justify-between gap-3">
        <span className="text-sm font-medium text-ink">{rotulo}</span>
        {/* Disco elevado em vez de quadrado tingido: o ícone vira um objeto
            apoiado no cartão, não uma mancha da cor de ação. */}
        <span
          aria-hidden="true"
          className="superficie-elevada grid size-10 shrink-0 place-items-center rounded-full text-primary [&_svg]:size-[18px]"
        >
          <Icone nome={icone} />
        </span>
      </dt>

      <dd className="mt-3">
        <span
          className={cn(
            "block font-display leading-none tabular-nums text-ink",
            valorLongo ? "text-[26px] sm:text-3xl" : "text-3xl sm:text-4xl"
          )}
        >
          {valor}
        </span>
        {dica && <span className="mt-2 block text-xs leading-snug text-muted">{dica}</span>}
      </dd>
    </Card>
  )
}

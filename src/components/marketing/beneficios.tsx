import { Icone } from "@/components/app/icone"
import { Card, CardConteudo } from "@/components/ui"
import { landing } from "@/content/site"

/**
 * Dobra 2. Três benefícios, um por entidade do produto (clientes, pedidos,
 * agenda). O ícone de cada card é o mesmo do menu lá dentro, então quem entra
 * depois já chega reconhecendo o lugar.
 */
export function Beneficios() {
  const { beneficios } = landing

  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-titulo"
      className="scroll-mt-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2
          id="beneficios-titulo"
          className="max-w-2xl text-2xl leading-tight text-balance text-ink sm:text-3xl lg:text-4xl"
        >
          {beneficios.titulo}
        </h2>

        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-12">
          {beneficios.itens.map((item) => (
            <li key={item.titulo} className="h-full">
              <Card className="h-full transition-colors duration-150 hover:border-primary/30">
                <CardConteudo className="p-6 lg:p-7">
                  {/* Disco elevado, o mesmo do `EstadoVazio` lá dentro: o ícone
                      pousa sobre uma peça com relevo em vez de sobre um
                      quadrado tingido. Quem entra no app reconhece a forma. */}
                  <span className="superficie-elevada grid size-11 place-items-center rounded-full border border-hairline">
                    <Icone nome={item.icone} className="size-5 text-primary" />
                  </span>

                  <h3 className="mt-5 text-lg text-ink">{item.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.texto}</p>
                </CardConteudo>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { Card, CardConteudo } from "@/components/ui"
import { landing } from "@/content/site"

/**
 * Dobra 5. Time sem foto: o projeto não hospeda imagem nenhuma, então as
 * iniciais em círculo cheio fazem o papel do avatar, e continuam legíveis nos
 * 71 design systems, porque `primary-ink` é justamente a tinta que o tema
 * escolheu para escrever sobre a cor de ação.
 */
export function Time() {
  const { time } = landing

  return (
    <section id="time" aria-labelledby="time-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="time-titulo"
            className="text-2xl leading-tight text-balance text-ink sm:text-3xl lg:text-4xl"
          >
            {time.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{time.subtitulo}</p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-12">
          {time.pessoas.map((pessoa) => (
            <li key={pessoa.nome} className="h-full">
              <Card className="h-full">
                <CardConteudo className="p-6 lg:p-7">
                  <div className="flex items-center gap-3.5">
                    {/* `.realce-interno` é a luz de cima e o peso de baixo por
                        dentro da borda. Numa peça redonda isso vira aro, e o
                        avatar deixa de ser um disco chapado de cor. */}
                    <span
                      aria-hidden="true"
                      className="realce-interno grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-base font-semibold text-primary-ink"
                    >
                      {pessoa.iniciais}
                    </span>

                    <span className="min-w-0">
                      <h3 className="truncate text-base text-ink">{pessoa.nome}</h3>
                      {/* Cargo em `muted` e não em `primary`: 12px na cor de ação
                          fica abaixo de 4.5:1. O avatar já carrega a cor. */}
                      <span className="mt-0.5 block truncate text-xs font-medium tracking-wide text-muted uppercase">
                        {pessoa.cargo}
                      </span>
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{pessoa.bio}</p>
                </CardConteudo>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

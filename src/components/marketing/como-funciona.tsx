import { landing } from "@/content/site"

/**
 * Dobra 3. Um `<ol>` de verdade, porque a ordem dos passos é conteúdo, não decoração,
 * e quem usa leitor de tela precisa ouvir que são três em sequência.
 *
 * O fio que liga os passos nasce colado na pílula e morre no transparente antes
 * de chegar na próxima: ele mostra a sequência sem virar uma grade. É um por
 * item, vertical no celular (a lista empilha) e horizontal no desktop (a lista
 * vira três colunas). O último passo não recebe fio, senão apontaria para o nada.
 *
 * São dois elementos e não um com classes responsivas porque o gradiente muda de
 * direção junto com o eixo, e direção de gradiente não cabe numa classe.
 */
export function ComoFunciona() {
  const { comoFunciona } = landing

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="scroll-mt-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="como-funciona-titulo"
            className="text-2xl leading-tight text-balance text-ink sm:text-3xl lg:text-4xl"
          >
            {comoFunciona.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {comoFunciona.subtitulo}
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3">
          {comoFunciona.passos.map((passo, indice) => {
            const ultimo = indice === comoFunciona.passos.length - 1

            return (
              <li key={passo.numero} className="relative flex gap-4 md:flex-col md:gap-5">
                {!ultimo && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-10 -bottom-8 left-[27px] w-px md:hidden"
                      style={{
                        backgroundImage:
                          "linear-gradient(to bottom, var(--ds-hairline), transparent)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-4 left-16 -right-8 hidden h-px md:block"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, var(--ds-hairline), transparent)",
                      }}
                    />
                  </>
                )}

                {/* A pílula tem largura fixa (`w-14`) porque os três números têm
                    o mesmo desenho em `tabular-nums`: assim o fio sabe onde a
                    peça termina sem depender do texto. O `self-start` é
                    obrigatório: no celular o item é uma linha flex, e sem ele a
                    pílula estica até a altura do parágrafo ao lado. O número
                    fica em `ink` porque `primary` como TEXTO em 13px não alcança
                    4.5:1 na maioria dos temas — a cor da marca já está no herói. */}
                <span className="pilula w-14 shrink-0 justify-center self-start font-display text-[13px] font-semibold tabular-nums text-ink">
                  {passo.numero}
                </span>

                <div className="min-w-0">
                  <h3 className="text-lg text-ink">{passo.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{passo.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

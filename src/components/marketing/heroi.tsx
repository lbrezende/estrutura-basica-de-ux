import { Icone } from "@/components/app/icone"
import { landing } from "@/content/site"
import { SEED } from "@/lib/seed"
import { BotaoLink } from "./botao-link"
import { MockupProduto } from "./mockup-produto"

/**
 * Dobra 1. Promessa, dois caminhos (entrar ou entender) e a prova de que o
 * produto existe, nesta ordem, porque é a ordem em que a dúvida aparece.
 */

/** Avatares da prova social: decorativos, então iniciais bastam. */
const ROSTOS = SEED.clientes.slice(0, 4).map((cliente) => ({
  id: cliente.id,
  iniciais: cliente.nome
    .split(" ")
    .map((parte) => parte.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase(),
}))

export function Heroi() {
  const { hero } = landing

  return (
    /*
      `-mt-16 pt-16` sobe a dobra os 64px do cabeçalho e devolve o mesmo tanto
      por dentro. O espaçamento visível não muda; o que muda é que a grade, a
      aura e o brilho passam POR BAIXO da barra em vez de começarem embaixo
      dela. Sem isso fica um degrau de tom na altura do cabeçalho, que no topo
      da página é transparente.
    */
    <section className="relative -mt-16 overflow-hidden pt-16">
      {/*
        Cenário decorativo. A grade é desenhada com a cor da borda e some numa
        máscara radial: sem imagem, sem cor fixa, e continua coerente nos temas
        claros e escuros. (O preto da máscara é opacidade, não tinta: máscara só
        enxerga o canal alfa.)
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--ds-hairline) 1px, transparent 1px), linear-gradient(to bottom, var(--ds-hairline) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 75%)",
        }}
      />

      {/*
        A luz da marca, em duas camadas: a `.aura-secao` é a larga e rasa, a bola
        embaixo dela é o foco logo acima do título. Uma só ou tinge a dobra
        inteira, ou apaga antes de chegar na headline.

        Elas vivem dentro de um container mascarado, e não soltas na seção, por
        um motivo de contraste: a `.aura-secao` acende no TOPO do elemento em que
        mora, e o topo desta dobra agora é o cabeçalho. Com a luz ali, o link do
        menu (que é `muted`, e `muted` é derivado para 4.5:1 EM CIMA DO CANVAS)
        cai para 4.16:1 no Notion e 4.42:1 no Airbnb. A máscara segura a luz até
        o fim da barra e a acende ao longo de 128px, sem emenda visível.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 4rem, #000 12rem)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 4rem, #000 12rem)",
        }}
      >
        <div className="aura-secao size-full">
          <div className="absolute -top-80 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 pt-14 pb-14 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* O relevo da `.pilula` dispensa borda: o fio claro em cima e o
              escuro embaixo já desenham o objeto. Somar `border` viraria anel. */}
          <p className="pilula text-xs text-muted sm:text-[13px]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {hero.eyebrow}
          </p>

          {/* Sem `text-ink`: a `.titulo-gradiente` pinta por `background-clip` e
              precisa da cor transparente. A primeira linha continua sólida. */}
          <h1 className="titulo-gradiente mt-6 text-[2rem] leading-[1.08] text-balance sm:text-5xl lg:text-[3.5rem]">
            {hero.titulo}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {hero.subtitulo}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <BotaoLink
              href="/entrar"
              tamanho="lg"
              brilho="marca"
              comChip
              iconeDireita={
                <Icone
                  nome="seta-direita"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              }
            >
              {hero.ctaPrimario}
            </BotaoLink>

            <BotaoLink href="#como-funciona" variante="secundaria" tamanho="lg">
              {hero.ctaSecundario}
            </BotaoLink>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ul aria-hidden="true" className="flex -space-x-2">
              {ROSTOS.map((rosto) => (
                <li
                  key={rosto.id}
                  className="superficie-elevada grid size-7 place-items-center rounded-full border-2 border-canvas text-[10px] font-medium text-muted"
                >
                  {rosto.iniciais}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">{hero.provaSocial}</p>
          </div>
        </div>

        <div className="mt-14 sm:mt-16 lg:mt-20">
          <MockupProduto />
        </div>
      </div>
    </section>
  )
}

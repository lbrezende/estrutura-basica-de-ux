import { Icone } from "@/components/app/icone"
import { Logo } from "@/components/app/logo"
import { landing, sistema } from "@/content/site"
import { cn } from "@/lib/cn"

/**
 * A imagem do herói, montada em HTML.
 *
 * Não existe arquivo de imagem no projeto de propósito: um PNG de painel
 * envelhece na primeira mudança de design system, e aqui a prévia é pintada
 * pelos mesmos tokens do produto. Troque o `design-system.json` e ela troca junto.
 *
 * A prévia inteira é anunciada como UMA imagem (`role="img"` + `aria-label`).
 * Por isso nada aqui dentro pode receber foco: seriam paradas de teclado sem
 * nome nenhum. Os itens do menu são `<li>`, não links.
 */

/** Altura relativa das barras (0–100). A última é a semana corrente. */
const BARRAS = [38, 52, 44, 61, 49, 70, 58, 76, 66, 92]

/** Duas letras bastam para um avatar decorativo, e nunca estouram o círculo. */
function iniciaisDe(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  const primeira = partes[0]?.charAt(0) ?? ""
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : ""
  return (primeira + ultima).toUpperCase()
}

export function MockupProduto() {
  const { mockup } = landing

  return (
    /*
      Dois elementos para dois trabalhos. O de fora carrega só a poça de luz
      colorida: `.brilho-marca` é `box-shadow`, e a moldura já gastou o dela com
      o fio de 1px da `.superficie-elevada`. O `rounded-ds` aqui existe apenas
      para a sombra sair com o mesmo canto da moldura.
    */
    <div className="brilho-marca rounded-ds">
      <div
        role="img"
        aria-label={mockup.descricao}
        className="superficie-elevada overflow-hidden rounded-ds border border-hairline"
      >
        {/* Moldura de janela: dá contexto de "isto é um software" em dois traços.
            Sem fundo próprio, de propósito. É nesta faixa que a luz de cima da
            `.superficie-elevada` aparece, na aresta superior da janela. */}
        <div className="flex h-9 items-center gap-2 border-b border-hairline px-3 lg:h-11">
          <span aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="size-2 rounded-full bg-hairline" />
            <span className="size-2 rounded-full bg-hairline" />
            <span className="size-2 rounded-full bg-hairline" />
          </span>
          <span className="mx-auto truncate rounded-full border border-hairline bg-surface px-3 py-0.5 text-[10px] text-muted lg:text-xs">
            {mockup.endereco}
          </span>
          {/* Ocupa o mesmo espaço dos três pontos para o endereço ficar centrado. */}
          <span aria-hidden="true" className="w-[38px] shrink-0" />
        </div>

        {/* O corpo volta para `surface`: é a "página" do app falso, e os cartões
            de dentro são `elevated`. Sem isso a moldura elevada engoliria os dois. */}
        <div className="flex bg-surface">
          <div className="hidden w-[150px] shrink-0 flex-col gap-3 border-r border-hairline p-3 sm:flex lg:w-[204px] lg:gap-4 lg:p-4">
            <Logo className="[&_svg]:size-5 [&_span]:text-xs lg:[&_svg]:size-6 lg:[&_span]:text-sm" />

            <ul className="flex flex-col gap-0.5">
              {sistema.nav.map((item, indice) => {
                const ativo = indice === 0

                return (
                  <li
                    key={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-ds px-2 py-1.5 text-[11px] lg:gap-2.5 lg:text-[13px]",
                      ativo ? "bg-primary/10 font-medium text-ink" : "text-muted"
                    )}
                  >
                    <Icone
                      nome={item.icone}
                      className={cn("size-3.5 shrink-0 lg:size-4", ativo ? "text-primary" : "text-muted")}
                    />
                    <span className="truncate">{item.rotulo}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:gap-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-display text-sm text-ink lg:text-xl">{mockup.titulo}</span>
              <span className="shrink-0 rounded-full border border-hairline bg-elevated px-2.5 py-1 text-[10px] text-muted lg:text-xs">
                {mockup.periodo}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              {mockup.metricas.map((metrica) => (
                <div
                  key={metrica.rotulo}
                  className="superficie-elevada min-w-0 rounded-ds border border-hairline px-2.5 py-2 lg:px-4 lg:py-3.5"
                >
                  <p className="truncate text-[10px] text-muted lg:text-xs">{metrica.rotulo}</p>
                  <p className="mt-0.5 truncate font-display text-sm text-ink lg:mt-1.5 lg:text-2xl">
                    {metrica.valor}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-success lg:text-xs">{metrica.variacao}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-2 lg:grid-cols-[1.35fr_1fr] lg:gap-4">
              <div className="rounded-ds border border-hairline bg-elevated p-3 lg:p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[11px] text-muted lg:text-sm">{mockup.grafico.titulo}</span>
                  <span className="shrink-0 text-[10px] font-medium text-success lg:text-xs">
                    {mockup.grafico.variacao}
                  </span>
                </div>

                <div className="mt-3 flex h-16 items-end gap-1 border-b border-hairline sm:h-20 lg:mt-4 lg:h-32 lg:gap-1.5">
                  {BARRAS.map((altura, indice) => (
                    <span
                      key={indice}
                      style={{ height: `${altura}%` }}
                      className={cn(
                        "min-w-0 flex-1 rounded-t-[3px]",
                        // A última semana em cheio; as anteriores em tinta. O olho
                        // vai pro "agora" sem precisar de rótulo.
                        indice === BARRAS.length - 1 ? "bg-primary" : "bg-primary/25"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-ds border border-hairline bg-elevated p-3 lg:p-4">
                <span className="block truncate text-[11px] text-muted lg:text-sm">
                  {mockup.lista.titulo}
                </span>

                <ul className="mt-2.5 flex flex-col gap-2 lg:mt-4 lg:gap-3">
                  {mockup.lista.itens.map((item) => (
                    <li key={item.titulo} className="flex items-center gap-2 lg:gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-[9px] font-semibold text-primary lg:size-8 lg:text-[11px]">
                        {iniciaisDe(item.pessoa)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] text-ink lg:text-[13px]">
                          {item.titulo}
                        </span>
                        <span className="block truncate text-[10px] text-muted lg:text-xs">
                          {item.quando}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

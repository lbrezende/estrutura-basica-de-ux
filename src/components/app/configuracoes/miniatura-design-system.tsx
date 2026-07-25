import { cn } from "@/lib/cn"
import type { DesignSystem } from "@/lib/design-system"

export type PropsMiniatura = {
  /** Já derivado por `paraDesignSystem`. Aqui só se desenha. */
  ds: DesignSystem
  /** Cor de apoio do catálogo, quando o sistema tem uma. */
  accent?: string | null
  className?: string
}

/**
 * O acabamento da miniatura NÃO pode vir das variáveis do globals.css.
 *
 * Lá `--realce` e companhia são derivadas do modo do tema EM USO. Aqui cada
 * miniatura desenha um sistema diferente, e metade do catálogo é clara enquanto
 * a outra é escura. Usar as variáveis do app deixaria realce branco em cima de
 * miniatura branca (some) ou sombra preta em cima de miniatura preta (some).
 *
 * Então a polaridade é recalculada por miniatura, com os mesmos valores da
 * camada premium: no escuro a luz é branca e a sombra é forte; no claro o
 * realce branco precisa ser quase opaco e a sombra vira um cinza discreto.
 */
function acabamentoDe(modo: DesignSystem["mode"]) {
  const escuro = modo === "dark"
  return {
    realce: escuro ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.9)",
    realceSuave: escuro ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.55)",
    realceFio: escuro ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    sombra: escuro ? "rgba(0,0,0,0.5)" : "rgba(15,23,42,0.12)",
  }
}

/**
 * Prévia de um design system em CSS puro. Sem imagem, sem screenshot.
 *
 * Único lugar do app onde cor entra por `style` em vez de token: estas cores
 * são de OUTRO sistema, não do tema em uso. Se usássemos as classes do
 * Tailwind, as 71 miniaturas sairiam todas iguais.
 *
 * A geometria continua em classe (é a mesma para todos); só cor e raio variam.
 */
export function MiniaturaDesignSystem({ ds, accent, className }: PropsMiniatura) {
  const { canvas, surface, ink, inkMuted, primary, primaryInk, hairline } = ds.tokens
  const { realce, realceSuave, realceFio, sombra } = acabamentoDe(ds.mode)

  // O raio é identidade (Framer arredonda, Wired não), mas o raio cheio de um
  // card grande engoliria uma miniatura de 90px. Daí o teto por elemento.
  const raioMoldura = `min(${ds.radius}, 14px)`
  const raioBotao = `min(${ds.radius}, 8px)`
  const raioSimbolo = `min(${ds.radius}, 6px)`

  return (
    <div
      aria-hidden="true"
      className={cn("flex aspect-[16/10] w-full flex-col overflow-hidden border", className)}
      style={{
        backgroundColor: canvas,
        borderColor: hairline,
        borderRadius: raioMoldura,
        // Fio de 1px por dentro e sombra curta por fora: a miniatura deixa de ser
        // um adesivo e passa a ser uma telinha apoiada na grade.
        boxShadow: `inset 0 0 0 1px ${realceFio}, 0 2px 8px -3px ${sombra}`,
      }}
    >
      <div
        className="flex shrink-0 items-center gap-1.5 border-b px-2.5 py-2"
        style={{
          backgroundColor: surface,
          borderColor: hairline,
          backgroundImage: `linear-gradient(to bottom, ${realceSuave}, transparent 70%)`,
        }}
      >
        <span
          className="size-2.5 shrink-0"
          style={{
            backgroundColor: primary,
            borderRadius: raioSimbolo,
            boxShadow: `inset 0 1px 0 0 ${realce}`,
          }}
        />
        <span className="h-[3px] w-7 rounded-full" style={{ background: inkMuted }} />
        {accent && (
          <span className="ml-auto size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Menu lateral: repete a moldura do app de verdade, com o item ativo em primary. */}
        <div
          className="flex w-[26%] shrink-0 flex-col gap-1 border-r px-1.5 py-2"
          style={{
            backgroundColor: surface,
            borderColor: hairline,
            backgroundImage: `linear-gradient(to bottom, ${realceSuave}, transparent 45%)`,
          }}
        >
          <span className="h-[3px] w-full rounded-full" style={{ background: primary }} />
          <span className="h-[3px] w-3/4 rounded-full" style={{ background: inkMuted }} />
          <span className="h-[3px] w-5/6 rounded-full" style={{ background: inkMuted }} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-2 py-2">
          <span className="h-[5px] w-4/5 rounded-full" style={{ background: ink }} />
          <span className="h-[3px] w-full rounded-full" style={{ background: inkMuted }} />
          <span className="h-[3px] w-2/3 rounded-full" style={{ background: inkMuted }} />

          <span
            className="mt-auto flex h-4 w-14 max-w-full shrink-0 items-center justify-center"
            style={{
              backgroundColor: primary,
              borderRadius: raioBotao,
              // O mesmo desenho do `.preenchimento-acao`: fio de luz no topo e um
              // brilho curto na própria cor de ação embaixo.
              backgroundImage: `linear-gradient(to bottom, ${realceSuave} 0 1px, transparent 1px)`,
              boxShadow: `0 2px 6px -2px color-mix(in srgb, ${primary} 55%, transparent)`,
            }}
          >
            {/* O "rótulo" do botão prova que primary e primaryInk convivem. */}
            <span className="h-[3px] w-7 max-w-[60%] rounded-full" style={{ background: primaryInk }} />
          </span>
        </div>
      </div>
    </div>
  )
}

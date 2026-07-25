import { create } from "storybook/theming/create"
import { marca } from "../src/content/site"
import { designSystem } from "../src/lib/design-system"

/**
 * O `--font-inter` nasce do next/font dentro do `layout.tsx`, que não roda no
 * Storybook. Sem um valor, a família declarada no `design-system.json`
 * (`var(--font-inter), …`) não resolveria e a tipografia cairia no padrão do
 * navegador, diferente do produto.
 */
export const FONTE_FALLBACK = "Inter, ui-sans-serif, system-ui, sans-serif"

const tokens = designSystem.tokens
const raio = Number.parseInt(designSystem.radius, 10) || 0

/**
 * A casca do Storybook (barra, menu lateral, painel de documentação) vestida
 * com os mesmos tokens dos componentes.
 *
 * Sem isto o catálogo apareceria numa interface branca de fábrica em volta de
 * componentes escuros: a comparação de contraste, que é metade do trabalho de
 * quem abre o Storybook, ficaria impossível.
 */
export const temaStorybook = create({
  base: designSystem.mode === "dark" ? "dark" : "light",

  brandTitle: `${marca.nome} · ${designSystem.name}`,
  brandTarget: "_self",

  colorPrimary: tokens.primary,
  colorSecondary: tokens.primary,

  appBg: tokens.canvas,
  appContentBg: tokens.surface,
  appPreviewBg: tokens.canvas,
  appHoverBg: tokens.surfaceElevated,
  appBorderColor: tokens.hairline,
  appBorderRadius: raio,

  textColor: tokens.ink,
  textInverseColor: tokens.canvas,
  textMutedColor: tokens.inkMuted,

  barBg: tokens.surface,
  barTextColor: tokens.inkMuted,
  barHoverColor: tokens.primaryHover,
  barSelectedColor: tokens.primary,

  buttonBg: tokens.surfaceElevated,
  buttonBorder: tokens.hairline,
  booleanBg: tokens.surfaceElevated,
  booleanSelectedBg: tokens.primary,

  inputBg: tokens.surfaceElevated,
  inputBorder: tokens.hairline,
  inputTextColor: tokens.ink,
  inputBorderRadius: raio,

  fontBase: designSystem.type.body,
  fontCode: "ui-monospace, SFMono-Regular, Menlo, monospace",
})

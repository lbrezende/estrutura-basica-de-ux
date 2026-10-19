import config from "../../design-system.json"

/**
 * Ponte entre o `design-system.json` e o CSS.
 *
 * O layout injeta essas variáveis no `<html>`, então trocar o JSON troca o
 * visual inteiro (landing, sistema e Storybook) sem tocar em nenhum componente.
 */

export type DesignTokens = {
  canvas: string
  surface: string
  surfaceElevated: string
  ink: string
  inkMuted: string
  primary: string
  primaryInk: string
  primaryHover: string
  hairline: string
  success: string
  danger: string
  warning: string
}

/**
 * Ritmo do layout: a unidade base de espaçamento e a altura de linha.
 *
 * É opcional porque o catálogo dos 71 sistemas (`tema.ts`) não traz essas duas
 * medidas. Quem não declara herda o ritmo do projeto, definido logo abaixo.
 */
export type DesignLayout = {
  density: string
  space: string
  lineHeight: number
}

export type DesignSystem = {
  id: string
  name: string
  mode: "dark" | "light"
  tokens: DesignTokens
  type: {
    display: string
    body: string
    displayWeight: number
    tracking: string
  }
  radius: string
  layout?: DesignLayout
}

export const designSystem = config as DesignSystem

/** Usado quando a prévia de um sistema do catálogo não traz `layout` próprio. */
const LAYOUT_PADRAO: DesignLayout = designSystem.layout ?? {
  density: "comfortable",
  space: "14px",
  lineHeight: 1.65,
}

/** Converte os tokens nas custom properties que o `globals.css` consome. */
export function toCssVars(ds: DesignSystem): Record<string, string> {
  const layout = ds.layout ?? LAYOUT_PADRAO

  return {
    "--ds-canvas": ds.tokens.canvas,
    "--ds-surface": ds.tokens.surface,
    "--ds-surface-elevated": ds.tokens.surfaceElevated,
    "--ds-ink": ds.tokens.ink,
    "--ds-ink-muted": ds.tokens.inkMuted,
    "--ds-primary": ds.tokens.primary,
    "--ds-primary-ink": ds.tokens.primaryInk,
    "--ds-primary-hover": ds.tokens.primaryHover,
    "--ds-hairline": ds.tokens.hairline,
    "--ds-success": ds.tokens.success,
    "--ds-danger": ds.tokens.danger,
    "--ds-warning": ds.tokens.warning,
    "--ds-font-display": ds.type.display,
    "--ds-font-body": ds.type.body,
    "--ds-display-weight": String(ds.type.displayWeight),
    "--ds-tracking": ds.type.tracking,
    "--ds-radius": ds.radius,
    "--ds-density": layout.density,
    "--ds-space": layout.space,
    "--ds-line-height": String(layout.lineHeight),
  }
}

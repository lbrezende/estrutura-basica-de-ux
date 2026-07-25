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
}

export const designSystem = config as DesignSystem

/** Converte os tokens nas custom properties que o `globals.css` consome. */
export function toCssVars(ds: DesignSystem): Record<string, string> {
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
  }
}

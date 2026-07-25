import type { Preview } from "@storybook/nextjs-vite"
import { designSystem, toCssVars } from "../src/lib/design-system"
import { FONTE_FALLBACK, temaStorybook } from "./tema"
import "../src/app/globals.css"

const variaveis = toCssVars(designSystem)

/**
 * No app quem injeta os tokens é o layout do Next (`src/app/layout.tsx`).
 * Aqui não existe layout: sem isto os componentes apareceriam sem cor nenhuma,
 * porque toda classe do projeto (`bg-surface`, `text-ink`…) aponta para uma
 * dessas variáveis. Trocar o `design-system.json` repinta o Storybook junto.
 */
function aplicarTokens() {
  const raiz = document.documentElement

  for (const [nome, valor] of Object.entries(variaveis)) {
    raiz.style.setProperty(nome, valor)
  }

  raiz.style.setProperty("--font-inter", FONTE_FALLBACK)

  raiz.dataset.ds = designSystem.id
  raiz.dataset.mode = designSystem.mode
}

const preview: Preview = {
  // Toda story ganha uma página de documentação com a tabela de propriedades.
  tags: ["autodocs"],

  decorators: [
    (Story) => {
      aplicarTokens()
      return Story()
    },
  ],

  parameters: {
    // O fundo sai do token `canvas`, o mesmo do app, não um cinza qualquer.
    backgrounds: {
      options: {
        canvas: { name: "Fundo da página", value: designSystem.tokens.canvas },
        surface: { name: "Superfície", value: designSystem.tokens.surface },
        elevada: { name: "Superfície elevada", value: designSystem.tokens.surfaceElevated },
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    a11y: {
      // "todo" só relata; não derruba nada. A leitura fica na aba Accessibility.
      test: "todo",
    },

    // A página de documentação usa a mesma casca do resto do Storybook.
    docs: {
      theme: temaStorybook,
    },
  },

  initialGlobals: {
    backgrounds: { value: "canvas" },
  },
}

export default preview

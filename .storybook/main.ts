import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/nextjs-vite"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")

/**
 * Storybook = a vitrine dos componentes soltos, sem tela em volta.
 *
 * As stories ficam ao lado do componente (`button.tsx` → `button.stories.tsx`),
 * e não numa pasta separada: quem abre a pasta vê a peça e a demonstração dela
 * juntas, e renomear um componente não deixa a story órfã do outro lado do projeto.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],

  addons: [
    "@storybook/addon-docs",
    // Roda o axe em cada story e lista o que falha na aba "Accessibility".
    "@storybook/addon-a11y",
  ],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },

  staticDirs: ["../public"],

  viteFinal: (configuracao) => {
    // O Vite do Storybook não lê os `paths` do tsconfig, e os componentes
    // importam tudo por `@/`. Sem este alias nenhuma story resolve.
    configuracao.resolve ??= {}
    configuracao.resolve.alias = {
      ...configuracao.resolve.alias,
      "@": join(raiz, "src"),
    }

    configuracao.build ??= {}
    configuracao.build.rollupOptions ??= {}
    const avisoOriginal = configuracao.build.rollupOptions.onwarn

    configuracao.build.rollupOptions.onwarn = (aviso, avisar) => {
      // O `"use client"` é recado do componente para o servidor do Next, que
      // aqui não existe. Sem este filtro, o build cospe uma parede de avisos
      // amarelos que não significam nada, e assusta quem nunca programou.
      if (aviso.code === "MODULE_LEVEL_DIRECTIVE" || aviso.code === "SOURCEMAP_ERROR") return

      if (typeof avisoOriginal === "function") avisoOriginal(aviso, avisar)
      else avisar(aviso)
    }

    return configuracao
  },
}

export default config

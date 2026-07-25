import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Junta classes do Tailwind resolvendo conflitos. A última vence.
 *
 * Sem isso, `cn("bg-surface", "bg-elevated")` deixaria as duas no HTML e quem
 * ganharia seria a ordem do CSS gerado, não a sua intenção. É o que permite
 * todo componente aceitar `className` e ser ajustado por quem usa.
 */
const mesclar = extendTailwindMerge({
  extend: {
    classGroups: {
      // `ds` é o raio do nosso design system e não existe na escala padrão do
      // Tailwind. Sem registrar aqui, `rounded-ds` nunca conflitaria com
      // `rounded-full` e os dois sobreviveriam à mesclagem.
      rounded: [{ rounded: ["ds"] }],
      "rounded-t": [{ "rounded-t": ["ds"] }],
      "rounded-b": [{ "rounded-b": ["ds"] }],
      "rounded-l": [{ "rounded-l": ["ds"] }],
      "rounded-r": [{ "rounded-r": ["ds"] }],
    },
  },
})

export function cn(...classes: ClassValue[]) {
  return mesclar(clsx(classes))
}

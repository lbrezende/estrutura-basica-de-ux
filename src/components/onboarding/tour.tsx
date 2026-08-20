"use client"

import { useCallback, useEffect, useRef } from "react"
import type { Driver } from "driver.js"
// O CSS é estático porque são 3 KB e ele precisa estar de pé no instante em que
// o primeiro balão aparece. O JavaScript, que é oito vezes maior, é que chega
// depois.
import "driver.js/dist/driver.css"
import { tour } from "@/content/tour"

/**
 * O tour de boas-vindas, com driver.js.
 *
 * Três decisões que valem ler antes de mexer:
 *
 * 1. A BIBLIOTECA CHEGA DEPOIS. O `import()` do driver.js acontece dentro da
 *    função, não no topo do arquivo. Assim os 25 KB dele não entram no pacote
 *    que a primeira tela precisa baixar: quem já viu o tour nunca paga por ele.
 *
 * 2. PARADA SEM ALVO NA TELA É PULADA. O tour aponta pra elementos marcados com
 *    `data-tour`, e este projeto existe pra ser reescrito: você vai renomear
 *    telas e mover peças. Apontar pra um elemento que sumiu deixaria um balão
 *    perdido no canto, então a parada some junto e o resto continua.
 *
 * 3. QUEM PEDIU MENOS MOVIMENTO RECEBE MENOS MOVIMENTO. Com
 *    `prefers-reduced-motion`, a animação de deslizar entre paradas desliga. O
 *    tour continua inteiro, só que sem o movimento.
 *
 * Não tem emoji, não tem confete e não tem passo obrigatório: dá pra fechar no
 * Esc, no X ou clicando fora, e o tour não volta.
 */

/** Onde fica registrado que este navegador já viu o tour. */
const CHAVE = "ebu:tour:v1"

/**
 * Monta e roda o tour. Devolve a instância pra quem chamou poder desmontar, ou
 * `null` quando nenhuma parada tinha alvo na tela.
 */
async function conduzir(): Promise<Driver | null> {
  const { driver } = await import("driver.js")

  const paradas = tour.paradas
    // Alvo que não existe mais nesta tela sai da fila.
    .filter((parada) => !parada.alvo || document.querySelector(parada.alvo))
    .map((parada) => ({
      element: parada.alvo ?? undefined,
      popover: { title: parada.titulo, description: parada.texto },
    }))

  if (paradas.length === 0) return null

  const instancia = driver({
    steps: paradas,
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    showProgress: paradas.length > 1,
    progressText: tour.progresso,
    nextBtnText: tour.proximo,
    prevBtnText: tour.anterior,
    doneBtnText: tour.concluir,
    popoverClass: "tour-do-app",
  })

  instancia.drive()
  return instancia
}

/**
 * Roda o tour uma vez, na primeira visita. Fica montado na casca da área
 * logada e não desenha nada: todo o desenho é do driver.js.
 */
export function Tour() {
  const instancia = useRef<Driver | null>(null)

  useEffect(() => {
    let cancelado = false

    try {
      if (window.localStorage.getItem(CHAVE)) return
    } catch {
      // Modo privado: sem onde marcar que já viu, melhor não rodar do que
      // rodar em toda visita.
      return
    }

    // Um respiro pra casca do app terminar de montar. Sem isso, o primeiro alvo
    // pode ainda não estar no DOM quando o tour procura por ele.
    const id = window.setTimeout(() => {
      void conduzir().then((criada) => {
        // Desmontou enquanto a biblioteca carregava: fecha o que acabou de abrir.
        if (cancelado) {
          criada?.destroy()
          return
        }
        instancia.current = criada

        // A marca é gravada QUANDO O TOUR ABRE, e não antes.
        //
        // Gravar antes parece mais seguro e é o contrário: em desenvolvimento o
        // React monta cada efeito duas vezes de propósito, então a primeira
        // montagem gravaria a marca e a segunda encontraria ela e desistiria.
        // Resultado: o tour nunca apareceria no `npm run dev`, que é exatamente
        // onde a pessoa abre o app dela pela primeira vez.
        //
        // Gravando aqui, quem fecha no primeiro balão continua não vendo de
        // novo, que era a intenção original.
        if (criada) {
          try {
            window.localStorage.setItem(CHAVE, new Date().toISOString())
          } catch {
            // Sem onde gravar. O tour rodou, e é o que importava.
          }
        }
      })
    }, 400)

    return () => {
      cancelado = true
      window.clearTimeout(id)
      // Sair da área logada no meio do tour não pode deixar overlay órfão.
      instancia.current?.destroy()
      instancia.current = null
    }
  }, [])

  return null
}

/**
 * Roda o tour a pedido, quantas vezes a pessoa quiser. É o que o botão da tela
 * de configurações usa. Aqui não tem marca no localStorage pra conferir: quem
 * clicou quer ver, então vê.
 */
export function useRodarTour() {
  return useCallback(() => {
    void conduzir()
  }, [])
}

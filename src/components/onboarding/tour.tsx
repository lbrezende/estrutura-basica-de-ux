"use client"

import { usePathname } from "next/navigation"
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
 * Quatro decisões que valem ler antes de mexer:
 *
 * 1. ELE ATRAVESSA PÁGINAS. As paradas de `tour.ts` vêm com o endereço onde
 *    acontecem, e a jornada começa no site e termina dentro do app. Quando a
 *    pessoa clica no elemento destacado e navega, o tour RETOMA de onde parou
 *    na página seguinte, em vez de recomeçar. O lugar onde ele parou fica no
 *    sessionStorage, e não no endereço, porque o endereço deste app vai ser
 *    compartilhado: um link carregando estado de tour reabriria o tour na tela
 *    de quem recebeu.
 *
 * 2. A BIBLIOTECA CHEGA DEPOIS. O `import()` do driver.js acontece dentro da
 *    função, não no topo do arquivo. Assim os 25 KB dele não entram no pacote
 *    que a primeira tela precisa baixar: quem já viu o tour nunca paga por ele.
 *
 * 3. PARADA SEM ALVO NA TELA É PULADA. O tour aponta pra elementos marcados com
 *    `data-tour`, e este projeto existe pra ser reescrito: você vai renomear
 *    telas e mover peças. Apontar pra um elemento que sumiu deixaria um balão
 *    perdido no canto, então a parada some junto e o resto continua.
 *
 * 4. QUEM PEDIU MENOS MOVIMENTO RECEBE MENOS MOVIMENTO. Com
 *    `prefers-reduced-motion`, a animação de deslizar entre paradas desliga. O
 *    tour continua inteiro, só que sem o movimento.
 *
 * Não tem emoji, não tem confete e não tem passo obrigatório: dá pra fechar no
 * Esc, no X ou clicando fora, e fechar conta como terminado.
 *
 * PRA REMOVER O TOUR INTEIRO, que é uma coisa que a última parada promete que dá
 * pra fazer: apague esta pasta, apague `src/content/tour.ts`, e tire as duas
 * linhas que montam `<Tour />` (uma em `src/app/page.tsx`, outra em
 * `src/app/app/layout.tsx`) mais o botão "Ver de novo" da tela de perfil. Nada
 * mais no app depende dele.
 */

/** Onde fica registrado que este navegador já viu o tour. Não expira. */
const CHAVE_VISTO = "ebu:tour:v1"

/** Em que parada a jornada está. Vale só enquanto a aba estiver aberta. */
const CHAVE_PASSO = "ebu:tour:passo"

function jaViu() {
  try {
    return !!window.localStorage.getItem(CHAVE_VISTO)
  } catch {
    // Modo privado: sem onde marcar que já viu, melhor não rodar do que rodar
    // em toda visita.
    return true
  }
}

function marcarVisto() {
  try {
    window.localStorage.setItem(CHAVE_VISTO, new Date().toISOString())
    window.sessionStorage.removeItem(CHAVE_PASSO)
  } catch {
    // Sem onde gravar. O tour rodou, e é o que importava.
  }
}

function passoAtual() {
  try {
    return Number(window.sessionStorage.getItem(CHAVE_PASSO)) || 0
  } catch {
    return 0
  }
}

function guardarPasso(indice: number) {
  try {
    window.sessionStorage.setItem(CHAVE_PASSO, String(indice))
  } catch {
    // Sem onde guardar, o tour não retoma na próxima página. Paciência: é
    // melhor que travar a navegação.
  }
}

/**
 * A parada acontece nesta página?
 *
 * O endereço da parada vale pra ela E pra tudo que mora dentro dela, então uma
 * parada de "/app" também acontece em "/app/clientes". É de propósito: as
 * paradas do app apontam pra peças da casca (o menu, o topo), que existem em
 * todas as telas de dentro, e exigir o endereço exato faria o tour sumir só
 * porque a pessoa estava numa subtela. A raiz é a exceção, senão ela casaria
 * com o site inteiro.
 */
function ehDaPagina(pagina: string | undefined, caminho: string) {
  // Endereço vazio quer dizer "onde a pessoa estiver".
  if (!pagina) return true
  if (pagina === "/") return caminho === "/"
  return caminho === pagina || caminho.startsWith(`${pagina}/`)
}

/**
 * O trecho da jornada que cabe NESTA página, a partir de onde ela parou.
 *
 * Pega as paradas em sequência enquanto elas forem desta página, e para na
 * primeira que for de outra. É isso que faz o tour continuar do passo 2 quando
 * a pessoa chega no app, em vez de recomeçar do 1.
 */
function trechoDaPagina(inicio: number, caminho: string) {
  const trecho: Array<{ indice: number; alvo: string | null; titulo: string; texto: string }> = []

  for (let i = inicio; i < tour.paradas.length; i++) {
    const parada = tour.paradas[i]
    if (!ehDaPagina(parada.pagina, caminho)) break
    // Alvo que não existe nesta tela sai da fila, e a jornada segue.
    if (parada.alvo && !document.querySelector(parada.alvo)) continue
    trecho.push({ indice: i, alvo: parada.alvo, titulo: parada.titulo, texto: parada.texto })
  }

  return trecho
}

/**
 * Monta e roda um trecho do tour. Devolve a instância pra quem chamou poder
 * desmontar, ou `null` quando não sobrou parada nenhuma pra esta página.
 *
 * `aoTerminarTrecho` recebe o índice da próxima parada da jornada. Se ele for
 * o fim da lista, a jornada acabou.
 */
async function conduzir(
  trecho: ReturnType<typeof trechoDaPagina>,
  aoTerminarTrecho: (proximoIndice: number) => void,
  aoFechar: () => void
): Promise<Driver | null> {
  if (trecho.length === 0) return null

  const { driver } = await import("driver.js")

  const conduzir: Driver = driver({
    steps: trecho.map((parada) => ({
      element: parada.alvo ?? undefined,
      popover: {
        title: parada.titulo,
        description: parada.texto,
        // O contador é escrito parada a parada, com o número da JORNADA, e não
        // com o do trecho. Deixar o driver.js contar sozinho faria quem chega
        // no app ver "1 de 4" depois de já ter visto o primeiro balão no site.
        progressText: `${parada.indice + 1} de ${tour.paradas.length}`,
      },
    })),
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    showProgress: tour.paradas.length > 1,
    nextBtnText: tour.proximo,
    prevBtnText: tour.anterior,
    doneBtnText: tour.concluir,
    popoverClass: "tour-do-app",
    onNextClick: () => {
      const passo = conduzir.getActiveIndex() ?? 0
      if (passo < trecho.length - 1) {
        conduzir.moveNext()
        return
      }
      // Fim do trecho desta página. Guarda onde a jornada continua e sai de
      // cena: quem retoma é a próxima página, quando a pessoa navegar.
      aoTerminarTrecho(trecho[trecho.length - 1].indice + 1)
      conduzir.destroy()
    },
    /*
      A PESSOA FECHOU: Esc, X ou clique fora. Fechar conta como terminado, em
      qualquer parada, e o tour não volta mais.

      Este gancho é o único que separa "fechou" de "terminou", e a separação
      importa: terminar o trecho do site tem que guardar onde a jornada
      continua, e fechar tem que encerrar ela. O `destroy()` que o nosso próprio
      código chama NÃO passa por aqui (o driver.js pula este gancho quando o
      pedido vem do código, e não da pessoa), que é exatamente o que faz os dois
      caminhos não se confundirem.

      Quem define este gancho fica responsável por fechar de verdade, senão o
      Esc não fecha nada.
    */
    onDestroyStarted: () => {
      aoFechar()
      conduzir.destroy()
    },
  })

  conduzir.drive()
  return conduzir
}

/**
 * Roda o tour na primeira visita e retoma ele a cada página da jornada. Não
 * desenha nada: todo o desenho é do driver.js.
 *
 * Fica montado nas duas pontas da jornada, o site e a casca da área logada.
 */
export function Tour() {
  const caminho = usePathname()
  const instancia = useRef<Driver | null>(null)

  useEffect(() => {
    if (jaViu()) return

    let cancelado = false

    // Um respiro pra página terminar de montar. Sem isso, o alvo da parada pode
    // ainda não estar no DOM quando o tour procura por ele.
    const relogio = window.setTimeout(() => {
      const inicio = passoAtual()
      const trecho = trechoDaPagina(inicio, caminho)
      if (trecho.length === 0) return

      const ultima = trecho[trecho.length - 1].indice
      const acabaAqui = ultima >= tour.paradas.length - 1

      void conduzir(
        trecho,
        (proximo) => {
          if (acabaAqui) marcarVisto()
          else guardarPasso(proximo)
        },
        marcarVisto
      ).then((criada) => {
        // Saiu da página enquanto a biblioteca carregava: fecha o que abriu, e
        // sem marcar como visto, porque ninguém viu nada.
        if (cancelado) {
          criada?.destroy()
          return
        }
        instancia.current = criada
      })
    }, 400)

    return () => {
      cancelado = true
      window.clearTimeout(relogio)
      // Navegar no meio do tour não pode deixar overlay órfão na tela seguinte.
      instancia.current?.destroy()
      instancia.current = null
    }
  }, [caminho])

  return null
}

/**
 * Roda o tour a pedido, do começo, quantas vezes a pessoa quiser. É o que o
 * botão da tela de configurações usa.
 *
 * Aqui não tem marca de "já viu" pra conferir: quem clicou quer ver. E ele
 * mostra só o trecho desta página, porque quem clicou está dentro do app e não
 * vai querer ser mandado pro site pra começar do primeiro balão.
 */
export function useRodarTour() {
  const caminho = usePathname()

  return useCallback(() => {
    // A primeira parada desta página, e não a primeira da jornada.
    const inicio = tour.paradas.findIndex((p) => ehDaPagina(p.pagina, caminho))
    if (inicio < 0) return
    void conduzir(
      trechoDaPagina(inicio, caminho),
      () => {},
      () => {}
    )
  }, [caminho])
}

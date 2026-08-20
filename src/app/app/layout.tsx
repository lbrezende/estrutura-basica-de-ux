"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { BarraLateral } from "@/components/app/barra-lateral"
import { BarraSuperior } from "@/components/app/barra-superior"
import { Logo } from "@/components/app/logo"
import { Tour } from "@/components/onboarding/tour"
import { sistema } from "@/content/site"
import { sair, useDados, useSessao } from "@/lib/store"

export default function LayoutSistema({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const sessao = useSessao()
  // O store ainda não sabe se os dados moram no navegador ou no banco. Enquanto
  // não souber, a casca segura o esqueleto: mostrar os dados de exemplo e
  // trocar depois pelos do banco seria piscar conteúdo falso na tela.
  const { carregando } = useDados()
  const [menuAberto, setMenuAberto] = useState(false)
  const [hidratado, setHidratado] = useState(false)
  const refBotaoMenu = useRef<HTMLButtonElement>(null)
  const menuJaAbriu = useRef(false)

  // A sessão mora no localStorage, que não existe no servidor. Só depois da
  // hidratação dá pra saber se tem alguém logado. Decidir antes disso pisca
  // a tela errada ou expulsa quem já estava dentro.
  useEffect(() => {
    setHidratado(true)
  }, [])

  useEffect(() => {
    if (hidratado && !sessao) router.replace("/entrar")
  }, [hidratado, sessao, router])

  const abrirMenu = useCallback(() => setMenuAberto(true), [])
  const fecharMenu = useCallback(() => setMenuAberto(false), [])

  // Quem abriu o menu pelo teclado precisa voltar para o botão de origem, não
  // para o começo da página.
  useEffect(() => {
    if (menuAberto) {
      menuJaAbriu.current = true
      return
    }
    if (menuJaAbriu.current) refBotaoMenu.current?.focus()
  }, [menuAberto])

  const encerrarSessao = useCallback(() => {
    sair()
    router.replace("/entrar")
  }, [router])

  if (!hidratado || !sessao || carregando) return <EsqueletoSistema />

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-ds focus-visible:bg-primary focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-primary-ink"
      >
        {sistema.casca.pularParaConteudo}
      </a>

      <BarraLateral aberta={menuAberto} aoFechar={fecharMenu} />

      {/* O recuo compensa a coluna fixa; no celular ela é drawer e não ocupa espaço. */}
      <div className="lg:pl-[248px]">
        <BarraSuperior
          sessao={sessao}
          menuAberto={menuAberto}
          aoAbrirMenu={abrirMenu}
          aoSair={encerrarSessao}
          refBotaoMenu={refBotaoMenu}
        />

        <main
          id="conteudo"
          // O tour de boas-vindas aponta pra este bloco. Ver src/content/tour.ts.
          data-tour="conteudo"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1200px] px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>

      {/* Roda uma vez, na primeira visita, e não desenha nada fora disso. Fica
          aqui na casca porque as paradas apontam pro menu e pro topo, que só
          existem depois que a sessão confirma. */}
      <Tour />
    </div>
  )
}

/**
 * Mesma moldura da tela real, só que vazia. Quando a sessão confirma, nada
 * salta de lugar. É a diferença entre "carregou" e "piscou".
 */
function EsqueletoSistema() {
  return (
    <div className="min-h-dvh bg-canvas" role="status" aria-label={sistema.casca.carregando}>
      <div className="painel-lateral fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-hairline lg:flex">
        <div className="flex h-16 items-center border-b border-hairline px-4">
          <Logo className="realce-marca" />
        </div>
      </div>

      <div className="lg:pl-[248px]">
        <div className="h-16 border-b border-hairline" />
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="h-6 w-40 animate-pulse rounded-ds bg-elevated" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-ds bg-elevated" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((indice) => (
              <div
                key={indice}
                className="h-28 animate-pulse rounded-ds border border-hairline bg-surface"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

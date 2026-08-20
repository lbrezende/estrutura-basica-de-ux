import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { googleConfigurado } from "@/lib/google"
import {
  COOKIE_SESSAO,
  lerCookieDeSessao,
  opcoesDoCookie,
  sessaoConfigurada,
} from "@/lib/sessao-servidor"

/**
 * O que o navegador pergunta pro servidor sobre login.
 *
 * GET responde duas coisas de uma vez: se o login com Google está ligado neste
 * ambiente, e quem está logado agora, se tiver alguém. É por aqui que a sessão
 * assinada do servidor chega até o `store`, que é quem as telas consultam.
 *
 * DELETE encerra: apaga o cookie. O `sair()` do store chama esta rota antes de
 * limpar o lado do navegador, senão a sessão do servidor sobreviveria ao logout
 * e a pessoa voltaria logada no próximo carregamento.
 */

export async function GET() {
  const pote = await cookies()
  return NextResponse.json({
    ligado: googleConfigurado() && sessaoConfigurada(),
    sessao: lerCookieDeSessao(pote.get(COOKIE_SESSAO)?.value),
  })
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true })
  // `maxAge: 0` em vez de `delete` porque assim as opções (path, secure,
  // sameSite) vão iguais às da gravação, que é o que o navegador exige pra
  // aceitar a remoção.
  resposta.cookies.set(COOKIE_SESSAO, "", opcoesDoCookie(0))
  return resposta
}

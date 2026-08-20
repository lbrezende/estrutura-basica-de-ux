import { NextResponse } from "next/server"
import { googleConfigurado, urlDeAutorizacao } from "@/lib/google"
import { opcoesDoCookie, sessaoConfigurada, valorAleatorio } from "@/lib/sessao-servidor"

/**
 * A ida: manda a pessoa pro Google.
 *
 * Antes de mandar, sorteia um `state` e guarda ele num cookie curto. Na volta,
 * a outra rota confere se o `state` que o Google devolveu é o mesmo que saiu
 * daqui. É isso que impede alguém de forjar uma volta de login e entrar com o
 * navegador de outra pessoa.
 */

export const COOKIE_STATE = "oauth_state"

export async function GET(requisicao: Request) {
  // As duas condições contam: chaves do Google pra falar com eles, e segredo
  // de sessão pra assinar o resultado. Faltando qualquer uma, a tela de entrar
  // continua sendo a que ensina a configurar.
  if (!googleConfigurado() || !sessaoConfigurada()) {
    return NextResponse.redirect(new URL("/entrar?google=indisponivel", requisicao.url))
  }

  const state = valorAleatorio()
  const destino = urlDeAutorizacao(requisicao, state)
  if (!destino) {
    return NextResponse.redirect(new URL("/entrar?google=indisponivel", requisicao.url))
  }

  const resposta = NextResponse.redirect(destino)
  // Dez minutos: tempo de escolher a conta no Google, e não mais que isso.
  resposta.cookies.set(COOKIE_STATE, state, opcoesDoCookie(60 * 10))
  return resposta
}

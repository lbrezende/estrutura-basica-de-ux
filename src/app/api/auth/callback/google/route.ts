import { NextResponse } from "next/server"
import { COOKIE_STATE } from "@/app/api/auth/google/route"
import { perfilDoGoogle } from "@/lib/google"
import { COOKIE_SESSAO, criarCookieDeSessao, opcoesDoCookie } from "@/lib/sessao-servidor"

/**
 * A volta: confere o `state`, troca o código pelo perfil e grava a sessão.
 *
 * Este é o endereço que a tela de entrar manda cadastrar no Google, caractere
 * por caractere. Mudar o nome desta pasta quebra o login de quem já configurou.
 */

function recusar(requisicao: Request, motivo: string) {
  // A pessoa volta pra tela de entrar com um motivo curto, e o cookie de
  // `state` sai junto: ele é de uso único, e sobrando vira porta aberta.
  const resposta = NextResponse.redirect(new URL(`/entrar?google=${motivo}`, requisicao.url))
  resposta.cookies.delete(COOKIE_STATE)
  return resposta
}

export async function GET(requisicao: Request) {
  const url = new URL(requisicao.url)
  const codigo = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  // A pessoa clicou em cancelar na tela do Google. Não é erro, é desistência.
  if (url.searchParams.get("error")) return recusar(requisicao, "cancelado")
  if (!codigo || !state) return recusar(requisicao, "incompleto")

  const guardado = requisicao.headers
    .get("cookie")
    ?.split(";")
    .map((parte) => parte.trim())
    .find((parte) => parte.startsWith(`${COOKIE_STATE}=`))
    ?.slice(COOKIE_STATE.length + 1)

  if (!guardado || guardado !== state) return recusar(requisicao, "expirado")

  const sessao = await perfilDoGoogle(requisicao, codigo)
  if (!sessao) return recusar(requisicao, "falhou")

  const cookie = criarCookieDeSessao(sessao)
  if (!cookie) return recusar(requisicao, "indisponivel")

  const resposta = NextResponse.redirect(new URL("/app", requisicao.url))
  resposta.cookies.set(COOKIE_SESSAO, cookie, opcoesDoCookie())
  resposta.cookies.delete(COOKIE_STATE)
  return resposta
}

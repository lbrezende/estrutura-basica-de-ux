import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import type { Sessao } from "./types"

/**
 * A sessão de verdade, assinada no servidor.
 *
 * Diferente do `entrar()` do store, que só finge estado de logado no
 * navegador, esta sessão nasce de um login real com o Google e mora num cookie
 * que o JavaScript da página não consegue ler nem forjar: `httpOnly` fecha a
 * porta pro script, e a assinatura HMAC fecha a porta pra quem editar o cookie
 * na mão. Sem `AUTH_SECRET` no ambiente nada disso liga, e o app volta a ser o
 * de sempre, sem quebrar nada.
 *
 * O corpo do cookie é o JSON da sessão em base64url, com a assinatura colada
 * depois de um ponto. Ele NÃO é criptografado, e não precisa ser: o que está
 * ali dentro é o nome, o e-mail e a hora, tudo coisa que a própria pessoa já vê
 * na tela. O que a assinatura garante é que ninguém trocou o e-mail por outro.
 */

export const COOKIE_SESSAO = "sessao"

/** Trinta dias. Tempo de quem volta no app amanhã sem ter que entrar de novo. */
export const DURACAO_DA_SESSAO = 60 * 60 * 24 * 30

function segredo(): string | null {
  const valor = process.env.AUTH_SECRET?.trim()
  // Segredo curto demais não é segredo. Melhor a sessão não ligar do que ligar fraca.
  return valor && valor.length >= 32 ? valor : null
}

/** O login por senha assinada só existe quando o ambiente traz o segredo. */
export function sessaoConfigurada(): boolean {
  return segredo() !== null
}

function base64url(valor: Buffer | string): string {
  return Buffer.from(valor).toString("base64url")
}

function assinar(corpo: string, chave: string): string {
  return createHmac("sha256", chave).update(corpo).digest("base64url")
}

/**
 * Um valor aleatório para o `state` do OAuth e outros usos de uso único.
 * `randomBytes` porque `Math.random` não serve pra nada que precise ser
 * imprevisível.
 */
export function valorAleatorio(bytes = 32): string {
  return randomBytes(bytes).toString("base64url")
}

/** Monta o valor do cookie. Devolve `null` quando a sessão não está configurada. */
export function criarCookieDeSessao(sessao: Sessao): string | null {
  const chave = segredo()
  if (!chave) return null
  const corpo = base64url(JSON.stringify(sessao))
  return `${corpo}.${assinar(corpo, chave)}`
}

/**
 * Lê o cookie e devolve a sessão só se a assinatura bater.
 *
 * A comparação é `timingSafeEqual` porque comparar com `===` vaza, pelo tempo
 * de resposta, quantos caracteres da assinatura o atacante já acertou.
 */
export function lerCookieDeSessao(valor: string | undefined): Sessao | null {
  const chave = segredo()
  if (!chave || !valor) return null

  const ponto = valor.lastIndexOf(".")
  if (ponto <= 0) return null

  const corpo = valor.slice(0, ponto)
  const recebida = Buffer.from(valor.slice(ponto + 1), "base64url")
  const esperada = Buffer.from(assinar(corpo, chave), "base64url")

  if (recebida.length !== esperada.length) return null
  if (!timingSafeEqual(recebida, esperada)) return null

  try {
    const sessao = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8")) as Sessao
    // Cookie assinado com um formato antigo do tipo continua sendo cookie inválido.
    if (typeof sessao?.nome !== "string" || typeof sessao?.email !== "string") return null
    return sessao
  } catch {
    return null
  }
}

/** As opções do cookie, iguais em todo lugar que grava sessão. */
export function opcoesDoCookie(duracaoSegundos = DURACAO_DA_SESSAO) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    // Em desenvolvimento o app roda em http, e `secure` impediria o cookie de existir.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: duracaoSegundos,
  }
}

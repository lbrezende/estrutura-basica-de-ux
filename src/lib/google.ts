import type { Sessao } from "./types"

/**
 * Login com Google, montado e desligado.
 *
 * Tudo que o fluxo OAuth precisa já está escrito aqui. O que falta é só o par
 * de chaves no `.env.local`: com elas, o botão "Continuar com Google" faz login
 * de verdade; sem elas, `googleConfigurado()` responde `false` e a tela de
 * entrar continua mostrando o passo a passo de configuração, como sempre fez.
 *
 * Nenhuma biblioteca de autenticação entra nisso. O fluxo do Google é uma
 * ida e uma volta de HTTP, e escrever essas duas trocas na mão deixa visível o
 * que uma biblioteca esconderia: pra onde a pessoa foi, o que voltou de lá, e
 * qual campo virou a sessão.
 *
 * O CLIENT_SECRET nunca sai daqui. Este arquivo só é importado por rotas de
 * `src/app/api`, que rodam no servidor, então ele não vai parar no pacote que
 * o navegador baixa.
 */

/** O caminho de volta. O mesmo que a tela de entrar manda cadastrar no Google. */
export const CAMINHO_DE_RETORNO = "/api/auth/callback/google"

const AUTORIZAR = "https://accounts.google.com/o/oauth2/v2/auth"
const TOKEN = "https://oauth2.googleapis.com/token"
const PERFIL = "https://www.googleapis.com/oauth2/v2/userinfo"

function credenciais() {
  const id = process.env.GOOGLE_CLIENT_ID?.trim()
  const segredo = process.env.GOOGLE_CLIENT_SECRET?.trim()
  return id && segredo ? { id, segredo } : null
}

export function googleConfigurado(): boolean {
  return credenciais() !== null
}

/**
 * O endereço de retorno, derivado do endereço que o navegador está usando.
 *
 * Derivar em vez de fixar é o que faz o mesmo código valer em `localhost` e na
 * Vercel sem trocar variável. A ressalva é que o endereço precisa estar
 * cadastrado no Google dos dois jeitos: o `localhost:3000` do começo e o
 * endereço público depois que o app subir.
 */
export function enderecoDeRetorno(requisicao: Request): string {
  return new URL(CAMINHO_DE_RETORNO, requisicao.url).toString()
}

/** Para onde mandar a pessoa. O `state` volta na ida de volta e é conferido lá. */
export function urlDeAutorizacao(requisicao: Request, state: string): string | null {
  const cred = credenciais()
  if (!cred) return null

  const url = new URL(AUTORIZAR)
  url.searchParams.set("client_id", cred.id)
  url.searchParams.set("redirect_uri", enderecoDeRetorno(requisicao))
  url.searchParams.set("response_type", "code")
  // Só o básico: quem é e qual o e-mail. Pedir mais escopo é pedir uma tela de
  // permissão mais assustadora em troca de dado que o app não usa.
  url.searchParams.set("scope", "openid email profile")
  url.searchParams.set("state", state)
  // Sem refresh token: a sessão é o cookie assinado, e o app não age em nome
  // da pessoa no Google depois que ela entra.
  url.searchParams.set("access_type", "online")
  url.searchParams.set("prompt", "select_account")
  return url.toString()
}

/**
 * A volta: troca o código por um token e o token pelo perfil.
 *
 * Devolve `null` em qualquer tropeço, e quem chama transforma isso numa
 * mensagem na tela. Erro de OAuth costuma trazer detalhe do provedor que não
 * ajuda quem está usando o app e ajuda quem está sondando ele.
 */
export async function perfilDoGoogle(
  requisicao: Request,
  codigo: string
): Promise<Sessao | null> {
  const cred = credenciais()
  if (!cred) return null

  const resposta = await fetch(TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: codigo,
      client_id: cred.id,
      client_secret: cred.segredo,
      redirect_uri: enderecoDeRetorno(requisicao),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  })

  if (!resposta.ok) return null
  const token = (await resposta.json()) as { access_token?: string }
  if (!token.access_token) return null

  const perfil = await fetch(PERFIL, {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: "no-store",
  })

  if (!perfil.ok) return null
  const dados = (await perfil.json()) as { name?: string; email?: string }
  if (!dados.email) return null

  return {
    nome: dados.name?.trim() || dados.email.split("@")[0],
    email: dados.email,
    entrouEm: new Date().toISOString(),
  }
}

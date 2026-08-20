import { NextResponse } from "next/server"
import {
  bancoConfigurado,
  ehColecao,
  inserir,
  lerTudo,
  remover,
  atualizar,
  substituirTudo,
} from "@/lib/banco"
import type { Dados } from "@/lib/types"

/**
 * A porta do banco.
 *
 * Só o `store` fala com esta rota, e ele só fala quando o GET responde que o
 * banco está ligado. Enquanto não estiver, tudo isto responde `ligado: false` e
 * o app segue guardando no navegador, sem erro na tela e sem código apagado.
 *
 * Cada verbo faz uma coisa: GET lê tudo, POST cria, PATCH altera um campo,
 * DELETE apaga, PUT troca o conteúdo inteiro (é o "restaurar exemplos" e o
 * "limpar tudo" da tela de configurações).
 *
 * SOBRE PROTEÇÃO, e isto importa antes de publicar: esta rota ainda não
 * pergunta quem está chamando. Rodando na sua máquina não faz diferença; no ar,
 * qualquer pessoa com o endereço lê e grava. Amarrar cada registro à sessão
 * assinada de `src/lib/sessao-servidor.ts`, e recusar o que não for do dono, é
 * um dos assuntos do workshop, e o PROXIMOS-PASSOS.md mostra onde encaixa.
 */

// Dados de gente não têm o que cachear: a resposta é sempre a de agora.
export const dynamic = "force-dynamic"

function desligado() {
  return NextResponse.json({ ligado: false, dados: null })
}

export async function GET() {
  if (!bancoConfigurado()) return desligado()
  try {
    return NextResponse.json({ ligado: true, dados: await lerTudo() })
  } catch (erro) {
    // O banco existe mas não respondeu (conexão errada, projeto dormindo, rede
    // caída). Responder "desligado" é melhor que estourar: o app volta pro
    // navegador e a pessoa continua trabalhando.
    console.error("[dados] leitura falhou", erro)
    return desligado()
  }
}

export async function POST(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const corpo = (await requisicao.json()) as { colecao?: unknown; item?: { id?: string } }
  if (!ehColecao(corpo.colecao) || !corpo.item?.id) {
    return NextResponse.json({ erro: "pedido inválido" }, { status: 400 })
  }
  await inserir(corpo.colecao, corpo.item as { id: string })
  return NextResponse.json({ ok: true })
}

export async function PATCH(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const corpo = (await requisicao.json()) as {
    colecao?: unknown
    id?: unknown
    patch?: Record<string, unknown>
  }
  if (!ehColecao(corpo.colecao) || typeof corpo.id !== "string" || !corpo.patch) {
    return NextResponse.json({ erro: "pedido inválido" }, { status: 400 })
  }
  await atualizar(corpo.colecao, corpo.id, corpo.patch)
  return NextResponse.json({ ok: true })
}

export async function DELETE(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const corpo = (await requisicao.json()) as { colecao?: unknown; id?: unknown }
  if (!ehColecao(corpo.colecao) || typeof corpo.id !== "string") {
    return NextResponse.json({ erro: "pedido inválido" }, { status: 400 })
  }
  await remover(corpo.colecao, corpo.id)
  return NextResponse.json({ ok: true })
}

export async function PUT(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const corpo = (await requisicao.json()) as { dados?: Dados }
  const dados = corpo.dados
  if (
    !dados ||
    !Array.isArray(dados.clientes) ||
    !Array.isArray(dados.pedidos) ||
    !Array.isArray(dados.agendamentos)
  ) {
    return NextResponse.json({ erro: "pedido inválido" }, { status: 400 })
  }
  await substituirTudo(dados)
  return NextResponse.json({ ok: true })
}

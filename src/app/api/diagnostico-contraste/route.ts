import { NextResponse } from "next/server"
import { CATALOGO, derivarTokensComRelatorio } from "@/lib/tema"
import { contrasteEntre } from "@/lib/contraste"

/**
 * Verificação de contraste dos 71 design systems.
 *
 * Roda dentro do Next de propósito: assim exercita exatamente o mesmo código
 * que a tela de configurações usa, em vez de uma reimplementação que poderia
 * divergir. Só existe fora de produção.
 */

const PARES: Array<[string, string, number]> = [
  ["ink", "canvas", 4.5],
  ["ink", "surface", 4.5],
  ["ink", "surfaceElevated", 4.5],
  ["inkMuted", "canvas", 3],
  ["inkMuted", "surface", 3],
  ["primaryInk", "primary", 4.5],
  ["primary", "canvas", 3],
  ["primary", "surface", 3],
]

export function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ erro: "indisponível" }, { status: 404 })
  }

  const reprovados: Array<{ sistema: string; falhas: string[] }> = []
  let comReparo = 0
  const reparosPorToken: Record<string, number> = {}

  for (const sistema of CATALOGO) {
    const { tokens, reparos } = derivarTokensComRelatorio(sistema)
    if (reparos.length) comReparo++
    for (const r of reparos) {
      reparosPorToken[r.token] = (reparosPorToken[r.token] ?? 0) + 1
    }

    const falhas: string[] = []
    for (const [frente, fundo, minimo] of PARES) {
      const razao = contrasteEntre(
        tokens[frente as keyof typeof tokens],
        tokens[fundo as keyof typeof tokens]
      )
      if (razao < minimo) {
        falhas.push(`${frente}/${fundo} ${razao.toFixed(2)}:1 (mín ${minimo})`)
      }
    }
    if (falhas.length) reprovados.push({ sistema: sistema.name, falhas })
  }

  return NextResponse.json({
    total: CATALOGO.length,
    precisaramReparo: comReparo,
    reparosPorToken,
    reprovados: reprovados.length,
    detalhes: reprovados,
  })
}

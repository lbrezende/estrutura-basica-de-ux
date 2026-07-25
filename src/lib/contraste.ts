/**
 * Rede de segurança de contraste.
 *
 * O catálogo dos 71 design systems é engenharia reversa de sites reais, então
 * os papéis nem sempre batem com os do nosso app. O caso clássico: a marca usa
 * fundo de página claro e um painel escuro isolado. O extrator grava
 * `canvas: #ffffff` e `surface: #1a1a1a`, e a tinta preta some no cartão.
 *
 * Nenhum tema é aplicado sem passar por aqui. Validar é obrigatório, confiar
 * no dado de origem não é opção: um app ilegível é pior que um app feio, e o
 * briefing que a gente entrega ao aluno cobra exatamente esse cuidado.
 */

export type Cor = { r: number; g: number; b: number }

export function lerCor(valor: string | null | undefined): Cor | null {
  if (!valor) return null
  const s = valor.trim()

  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }

  const rgb = s.match(/^rgba?\(([^)]+)\)$/i)
  if (rgb) {
    const p = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number)
    if (p.length >= 3 && p.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return { r: p[0], g: p[1], b: p[2] }
    }
  }
  return null
}

export function paraHex({ r, g, b }: Cor): string {
  const p = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")
  return `#${p(r)}${p(g)}${p(b)}`
}

/** Luminância relativa (WCAG 2.1). */
export function luminancia(c: Cor): number {
  const canal = (v: number) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * canal(c.r) + 0.7152 * canal(c.g) + 0.0722 * canal(c.b)
}

/** Razão de contraste WCAG. Vai de 1 (igual) a 21 (preto no branco). */
export function razaoDeContraste(a: Cor, b: Cor): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

export function contrasteEntre(a: string, b: string): number {
  const ca = lerCor(a)
  const cb = lerCor(b)
  if (!ca || !cb) return 1
  return razaoDeContraste(ca, cb)
}

/** Mistura duas cores. `peso` 0 devolve `a`, 1 devolve `b`. */
function misturar(a: Cor, b: Cor, peso: number): Cor {
  return {
    r: a.r + (b.r - a.r) * peso,
    g: a.g + (b.g - a.g) * peso,
    b: a.b + (b.b - a.b) * peso,
  }
}

const BRANCO: Cor = { r: 255, g: 255, b: 255 }
const PRETO: Cor = { r: 0, g: 0, b: 0 }

/**
 * Ajusta `frente` até ela atingir o contraste mínimo sobre `fundo`.
 *
 * Empurra na direção que já tem mais distância (clareia sobre fundo escuro,
 * escurece sobre fundo claro), preservando o matiz o quanto der. Se nem o
 * extremo resolver, devolve branco ou preto puro, o que ganhar.
 */
export function ajustarParaContraste(frente: string, fundo: string, minimo = 4.5): string {
  const cf = lerCor(frente)
  const cb = lerCor(fundo)
  if (!cf || !cb) return frente
  if (razaoDeContraste(cf, cb) >= minimo) return frente

  const alvo = luminancia(cb) > 0.5 ? PRETO : BRANCO

  for (let peso = 0.1; peso <= 1.0001; peso += 0.05) {
    const tentativa = misturar(cf, alvo, peso)
    if (razaoDeContraste(tentativa, cb) >= minimo) return paraHex(tentativa)
  }
  return paraHex(alvo)
}

/** A cor de texto que melhor se lê sobre um fundo. */
export function tintaSobre(fundo: string): string {
  const cb = lerCor(fundo)
  if (!cb) return "#111111"
  return razaoDeContraste(BRANCO, cb) >= razaoDeContraste(PRETO, cb) ? "#ffffff" : "#111111"
}

/** Clareia ou escurece uma cor em direção ao extremo mais distante. */
function afastarDoExtremo(c: Cor, quantidade: number): Cor {
  return misturar(c, luminancia(c) > 0.5 ? PRETO : BRANCO, quantidade)
}

export type TokensTema = {
  canvas: string
  surface: string
  surfaceElevated: string
  ink: string
  inkMuted: string
  primary: string
  primaryInk: string
  primaryHover: string
  hairline: string
  success: string
  danger: string
  warning: string
}

/**
 * Cada par que o app realmente pinta, com o mínimo que ele precisa atingir.
 *
 * `primaryInk` NÃO entra aqui: ele depende da primária final, e a primária
 * ainda pode mudar nesta lista. Corrigi-lo antes e mexer na primária depois
 * desfaz o conserto sem ninguém perceber.
 */
const PARES: Array<{ frente: keyof TokensTema; fundo: keyof TokensTema; minimo: number }> = [
  { frente: "ink", fundo: "canvas", minimo: 4.5 },
  { frente: "ink", fundo: "surface", minimo: 4.5 },
  { frente: "ink", fundo: "surfaceElevated", minimo: 4.5 },
  // Texto secundário pode ser mais suave, mas ainda tem que ser legível.
  { frente: "inkMuted", fundo: "canvas", minimo: 3 },
  { frente: "inkMuted", fundo: "surface", minimo: 3 },
  // A primária também vira ícone e texto de destaque sobre o fundo.
  { frente: "primary", fundo: "canvas", minimo: 3 },
  { frente: "primary", fundo: "surface", minimo: 3 },
  { frente: "success", fundo: "surface", minimo: 3 },
  { frente: "danger", fundo: "surface", minimo: 3 },
  { frente: "warning", fundo: "surface", minimo: 3 },
]

export type Reparo = { token: string; de: string; para: string; motivo: string }

/**
 * Deixa um tema seguro para aplicar, e conta o que precisou mexer.
 *
 * A ordem importa: primeiro as superfícies (elas são o fundo de tudo), depois
 * as tintas, e só então os pares restantes.
 */
export function sanitizarTema(tokens: TokensTema): { tokens: TokensTema; reparos: Reparo[] } {
  const t: TokensTema = { ...tokens }
  const reparos: Reparo[] = []
  const anotar = (token: string, de: string, para: string, motivo: string) => {
    if (de.toLowerCase() !== para.toLowerCase()) reparos.push({ token, de, para, motivo })
  }

  // 1. A superfície é um degrau do fundo, nunca uma inversão.
  //
  // Sem isso, marcas como NVIDIA (página branca, painel preto) e Lamborghini
  // (página preta, painel branco) fazem a tinta sumir dentro do cartão.
  const cCanvas = lerCor(t.canvas)
  const cSurface = lerCor(t.surface)
  if (cCanvas && cSurface && Math.abs(luminancia(cCanvas) - luminancia(cSurface)) > 0.3) {
    const nova = paraHex(afastarDoExtremo(cCanvas, 0.07))
    anotar("surface", t.surface, nova, "invertia a luminância do fundo")
    t.surface = nova
  }

  // A superfície elevada é mais um degrau na mesma direção.
  const base = lerCor(t.surface)
  if (base) {
    const cElevated = lerCor(t.surfaceElevated)
    const precisa =
      !cElevated || Math.abs(luminancia(base) - luminancia(cElevated)) > 0.3
    if (precisa) {
      const nova = paraHex(afastarDoExtremo(base, 0.06))
      anotar("surfaceElevated", t.surfaceElevated, nova, "destoava da superfície")
      t.surfaceElevated = nova
    }
  }

  // 2. A tinta precisa funcionar nas TRÊS superfícies, não só no fundo.
  for (const fundo of ["canvas", "surface", "surfaceElevated"] as const) {
    const corrigida = ajustarParaContraste(t.ink, t[fundo], 4.5)
    anotar("ink", t.ink, corrigida, `contraste insuficiente sobre ${fundo}`)
    t.ink = corrigida
  }

  // 3. A primária como ícone e destaque. Se ela some no fundo (Hashicorp usa
  //    preto sobre preto), clareia até aparecer.
  for (const fundo of ["canvas", "surface"] as const) {
    const corrigida = ajustarParaContraste(t.primary, t[fundo], 3)
    anotar("primary", t.primary, corrigida, `sumia sobre ${fundo}`)
    t.primary = corrigida
  }

  // 4. O resto dos pares, que ainda pode mexer na primária.
  for (const par of PARES) {
    const corrigida = ajustarParaContraste(t[par.frente], t[par.fundo], par.minimo)
    anotar(par.frente, t[par.frente], corrigida, `abaixo de ${par.minimo}:1 sobre ${par.fundo}`)
    t[par.frente] = corrigida
  }

  // 5. Reconciliação da primária.
  //
  // Duas exigências disputam a mesma cor: o texto em cima dela precisa de
  // 4.5:1, e ela mesma precisa de 3:1 contra a superfície quando vira ícone.
  // Em alguns temas nenhuma tonalidade atende as duas. O vermelho da Ferrari
  // sobre cinza escuro é o caso: clarear serve ao ícone e afunda o texto,
  // escurecer faz o contrário.
  //
  // Quando não dá para ter tudo, o texto do botão ganha. Ele é funcional, e
  // ninguém deixa de usar um app porque o ícone está discreto demais.
  const primariaOriginal = t.primary
  const corPrimaria = lerCor(t.primary) ?? PRETO

  type Candidata = { cor: string; tinta: string; noBotao: number; naSuperficie: number }
  const candidatas: Candidata[] = []

  for (let peso = -0.6; peso <= 0.6001; peso += 0.04) {
    const cor =
      peso === 0
        ? paraHex(corPrimaria)
        : paraHex(misturar(corPrimaria, peso > 0 ? BRANCO : PRETO, Math.abs(peso)))
    const tinta = tintaSobre(cor)
    candidatas.push({
      cor,
      tinta,
      noBotao: contrasteEntre(tinta, cor),
      naSuperficie: contrasteEntre(cor, t.surface),
    })
  }

  // Primeiro: alguma que atenda as duas? Entre elas, a mais perto da original.
  const distanciaDaOriginal = (c: string) => {
    const a = lerCor(c)!
    return Math.abs(luminancia(a) - luminancia(corPrimaria))
  }

  const atendeTudo = candidatas
    .filter((c) => c.noBotao >= 4.5 && c.naSuperficie >= 3)
    .sort((a, b) => distanciaDaOriginal(a.cor) - distanciaDaOriginal(b.cor))[0]

  const escolhida =
    atendeTudo ??
    // Ninguém atende tudo: garante o texto do botão e pega a que sobrar com
    // melhor presença sobre a superfície.
    candidatas
      .filter((c) => c.noBotao >= 4.5)
      .sort((a, b) => b.naSuperficie - a.naSuperficie)[0]

  if (escolhida) {
    t.primary = escolhida.cor
    t.primaryInk = escolhida.tinta
    if (!atendeTudo) {
      anotar(
        "primary",
        primariaOriginal,
        escolhida.cor,
        `conflito: texto do botão priorizado, ícone ficou em ${escolhida.naSuperficie.toFixed(2)}:1`
      )
    } else {
      anotar("primary", primariaOriginal, escolhida.cor, "ajuste para atender botão e ícone")
    }
  } else {
    t.primaryInk = tintaSobre(t.primary)
  }

  t.primaryHover = paraHex(afastarDoExtremo(lerCor(t.primary) ?? PRETO, 0.18))

  // 6. A linha divisória não é texto, mas some se não destoar do fundo.
  if (contrasteEntre(t.hairline, t.surface) < 1.15) {
    const nova = paraHex(afastarDoExtremo(lerCor(t.surface) ?? PRETO, 0.14))
    anotar("hairline", t.hairline, nova, "borda invisível")
    t.hairline = nova
  }

  return { tokens: t, reparos }
}

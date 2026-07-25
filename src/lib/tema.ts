import catalogo from "./design-systems.json"
import { designSystem, toCssVars, type DesignSystem, type DesignTokens } from "./design-system"
import { sanitizarTema } from "./contraste"

/**
 * Prévia de design system em tempo de execução.
 *
 * O catálogo foi extraído de sites reais, então chega incompleto: 46 sistemas
 * sem `accent`, 15 sem `surface`, 6 sem `hairline`, 10 sem `radius` e nenhum
 * com as cores semânticas (sucesso/perigo/aviso). Este módulo deriva o que
 * falta a partir do que existe. Sem isso, metade do catálogo pintaria a tela
 * com buracos.
 *
 * O que a tela de configurações aplica é SÓ uma prévia (custom properties no
 * `<html>`). O visual de verdade continua saindo do `design-system.json` da
 * raiz, que é o que a landing, o sistema e o Storybook leem.
 */

/** Formato cru do catálogo. Todo campo que pode faltar está tipado como nulo. */
export type SistemaDoCatalogo = {
  id: string
  name: string
  vibe: string
  mode: "light" | "dark"
  tokens: {
    canvas: string
    surface: string | null
    ink: string
    primary: string
    accent: string | null
    hairline: string | null
  }
  type: {
    display: string | null
    body: string | null
    displayWeight: number | null
    tracking: number | null
  }
  radius: string | null
}

export const CATALOGO = (catalogo as unknown as { systems: SistemaDoCatalogo[] }).systems

export const CHAVE_TEMA = "ebu:tema:v1"

/** Empilhada depois de fontes de marca que ninguém tem instalada (SoDoSans, LamboType…). */
const PILHA_FALLBACK = "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif"

const TEM_GENERICA = /sans-serif|serif|monospace|system-ui|cursive|fantasy|-apple-system/i

// --- cor ------------------------------------------------------------------

type Rgb = { r: number; g: number; b: number }

/** Aceita `#rgb`, `#rrggbb`, `#rrggbbaa` e `rgb()/rgba()`. O catálogo usa os dois formatos. */
function paraRgb(cor: string): Rgb | null {
  const limpa = cor.trim()

  if (limpa.startsWith("#")) {
    const hex = limpa.slice(1)
    const cheio =
      hex.length === 3 || hex.length === 4
        ? hex
            .slice(0, 3)
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.slice(0, 6)
    if (cheio.length !== 6 || !/^[0-9a-f]{6}$/i.test(cheio)) return null
    return {
      r: parseInt(cheio.slice(0, 2), 16),
      g: parseInt(cheio.slice(2, 4), 16),
      b: parseInt(cheio.slice(4, 6), 16),
    }
  }

  const numeros = limpa.match(/-?\d*\.?\d+/g)
  if (!numeros || numeros.length < 3) return null
  const [r, g, b] = numeros.slice(0, 3).map(Number)
  return { r, g, b }
}

function paraHex({ r, g, b }: Rgb) {
  const canal = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0")
  return `#${canal(r)}${canal(g)}${canal(b)}`
}

/** Caminha `proporcao` do caminho de `origem` até `alvo` (0 = origem, 1 = alvo). */
function misturar(origem: string, alvo: string, proporcao: number) {
  const a = paraRgb(origem)
  const b = paraRgb(alvo)
  if (!a || !b) return origem
  return paraHex({
    r: a.r + (b.r - a.r) * proporcao,
    g: a.g + (b.g - a.g) * proporcao,
    b: a.b + (b.b - a.b) * proporcao,
  })
}

function canalLinear(valor: number) {
  const v = valor / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminancia(rgb: Rgb) {
  return 0.2126 * canalLinear(rgb.r) + 0.7152 * canalLinear(rgb.g) + 0.0722 * canalLinear(rgb.b)
}

/** Razão de contraste da WCAG (1 a 21). Cor ilegível devolve 1, o pior caso. */
export function contraste(a: string, b: string) {
  const ca = paraRgb(a)
  const cb = paraRgb(b)
  if (!ca || !cb) return 1
  const la = luminancia(ca)
  const lb = luminancia(cb)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function distancia(a: string, b: string) {
  const ca = paraRgb(a)
  const cb = paraRgb(b)
  if (!ca || !cb) return 255
  return Math.max(Math.abs(ca.r - cb.r), Math.abs(ca.g - cb.g), Math.abs(ca.b - cb.b))
}

// --- derivação dos tokens que faltam --------------------------------------

/**
 * Corrige a tinta que não enxerga o próprio fundo.
 *
 * Um sistema do catálogo (Kraken: cinza #9497a9 sobre roxo #5b1ecf, 2.87:1) traz
 * um par que reprova em AA. Como `ink` é o texto de TODO o app, reproduzi-lo fiel
 * entregaria um tema ilegível. Clareamos (ou escurecemos) o mínimo para passar.
 */
function derivarInk(ink: string, canvas: string) {
  if (contraste(ink, canvas) >= 4.5) return ink

  const extremo = contraste("#ffffff", canvas) >= contraste("#000000", canvas) ? "#ffffff" : "#000000"
  for (let proporcao = 0.1; proporcao < 1; proporcao += 0.1) {
    const candidata = misturar(ink, extremo, proporcao)
    if (contraste(candidata, canvas) >= 4.5) return candidata
  }
  return extremo
}

/**
 * Texto secundário: o mais apagado que ainda passa em AA (4.5:1) sobre o canvas.
 *
 * Uma proporção fixa funcionaria no tema escuro e reprovaria num claro de tinta
 * clara. Por isso a busca desce de degrau em degrau até o contraste fechar.
 */
function derivarInkMuted(ink: string, canvas: string) {
  for (let proporcao = 0.45; proporcao > 0; proporcao -= 0.05) {
    const candidata = misturar(ink, canvas, proporcao)
    if (contraste(candidata, canvas) >= 4.5) return candidata
  }
  return ink
}

/** Texto em cima da cor de ação: prefere uma cor do próprio tema; só cai no preto/branco se precisar. */
function derivarPrimaryInk(primary: string, canvas: string, ink: string) {
  const candidatas = [canvas, ink, "#ffffff", "#000000"]
  const aprovada = candidatas.find((cor) => contraste(cor, primary) >= 4.5)
  if (aprovada) return aprovada
  return candidatas.reduce((melhor, cor) =>
    contraste(cor, primary) > contraste(melhor, primary) ? cor : melhor
  )
}

/**
 * Hover da ação: puxa a cor na direção da tinta.
 *
 * Vários sistemas usam a própria tinta como cor de ação (Airtable, Vercel). Aí
 * puxar para a tinta não mudaria nada e o botão ficaria sem resposta ao mouse.
 */
function derivarPrimaryHover(primary: string, ink: string, canvas: string) {
  const alvo = distancia(primary, ink) > 40 ? ink : canvas
  return misturar(primary, alvo, 0.16)
}

/**
 * As semânticas não existem no catálogo: escolhemos o par que enxerga melhor
 * o canvas daquele sistema, em vez de assumir "claro = escuro sobre branco".
 */
const SEMANTICAS = {
  claro: { success: "#15803d", danger: "#b91c1c", warning: "#a16207" },
  escuro: { success: "#4ade80", danger: "#f87171", warning: "#fbbf24" },
}

function derivarSemantica(chave: "success" | "danger" | "warning", canvas: string) {
  const claro = SEMANTICAS.claro[chave]
  const escuro = SEMANTICAS.escuro[chave]
  return contraste(claro, canvas) >= contraste(escuro, canvas) ? claro : escuro
}

export function derivarTokens(sistema: SistemaDoCatalogo): DesignTokens {
  const { canvas, primary } = sistema.tokens
  const ink = derivarInk(sistema.tokens.ink, canvas)

  // Misturar em direção à tinta serve aos dois modos: no escuro clareia, no
  // claro escurece. Um degrau para a superfície, outro para a elevada.
  const surface = sistema.tokens.surface ?? misturar(canvas, ink, 0.05)
  const surfaceElevated = misturar(surface, ink, 0.06)

  const derivados: DesignTokens = {
    canvas,
    surface,
    surfaceElevated,
    ink,
    inkMuted: derivarInkMuted(ink, canvas),
    primary,
    primaryInk: derivarPrimaryInk(primary, canvas, ink),
    primaryHover: derivarPrimaryHover(primary, ink, canvas),
    hairline: sistema.tokens.hairline ?? misturar(canvas, ink, 0.16),
    success: derivarSemantica("success", canvas),
    danger: derivarSemantica("danger", canvas),
    warning: derivarSemantica("warning", canvas),
  }

  // Portão final: as derivações acima olham só para o `canvas`, mas o app
  // também pinta texto sobre `surface` (cartão, barra lateral) e sobre a
  // primária. Marcas com painel de luminância invertida passavam por aqui e
  // entregavam preto no preto: NVIDIA (página branca, painel #1a1a1a),
  // Lamborghini (página preta, painel branco), Sentry (ink igual ao surface),
  // Hashicorp (primária preta sobre fundo preto).
  return sanitizarTema(derivados).tokens
}

/** Igual a `derivarTokens`, mas conta o que precisou ser reparado. Serve ao teste. */
export function derivarTokensComRelatorio(sistema: SistemaDoCatalogo) {
  const { canvas, primary } = sistema.tokens
  const ink = derivarInk(sistema.tokens.ink, canvas)
  const surface = sistema.tokens.surface ?? misturar(canvas, ink, 0.05)

  return sanitizarTema({
    canvas,
    surface,
    surfaceElevated: misturar(surface, ink, 0.06),
    ink,
    inkMuted: derivarInkMuted(ink, canvas),
    primary,
    primaryInk: derivarPrimaryInk(primary, canvas, ink),
    primaryHover: derivarPrimaryHover(primary, ink, canvas),
    hairline: sistema.tokens.hairline ?? misturar(canvas, ink, 0.16),
    success: derivarSemantica("success", canvas),
    danger: derivarSemantica("danger", canvas),
    warning: derivarSemantica("warning", canvas),
  })
}

function familiaSegura(familia: string | null) {
  if (!familia) return PILHA_FALLBACK
  return TEM_GENERICA.test(familia) ? familia : `${familia}, ${PILHA_FALLBACK}`
}

/**
 * Converte um item do catálogo no formato do `design-system.json`.
 *
 * O que sai daqui é ao mesmo tempo o que a prévia aplica e o que o bloco
 * copiável mostra. Assim o JSON que a pessoa cola no projeto produz
 * exatamente a tela que ela acabou de ver.
 */
export function paraDesignSystem(sistema: SistemaDoCatalogo): DesignSystem {
  return {
    id: sistema.id,
    name: sistema.name,
    mode: sistema.mode,
    tokens: derivarTokens(sistema),
    type: {
      display: familiaSegura(sistema.type.display),
      body: familiaSegura(sistema.type.body ?? sistema.type.display),
      displayWeight: sistema.type.displayWeight ?? 600,
      // O catálogo guarda tracking como número (a convenção de porcentagem do
      // Figma). Em `em` isso vira centésimos. Sem dividir, `-2` fecharia as
      // letras umas sobre as outras.
      tracking: `${(sistema.type.tracking ?? 0) / 100}em`,
    },
    radius: sistema.radius ?? "8px",
  }
}

export function acharSistema(id: string) {
  return CATALOGO.find((sistema) => sistema.id === id)
}

// --- aplicação e persistência ---------------------------------------------

/** Escreve os tokens como custom properties no `<html>`. Repinta o app inteiro no mesmo frame. */
export function aplicarTema(ds: DesignSystem) {
  if (typeof document === "undefined") return
  const raiz = document.documentElement
  for (const [chave, valor] of Object.entries(toCssVars(ds))) {
    raiz.style.setProperty(chave, valor)
  }
  raiz.dataset.ds = ds.id
  raiz.dataset.mode = ds.mode
}

export function lerTemaSalvo(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(CHAVE_TEMA)
  } catch {
    return null
  }
}

export function salvarTema(id: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CHAVE_TEMA, id)
  } catch {
    // Modo privado ou cota estourada: a prévia continua valendo nesta sessão.
  }
}

/**
 * Volta ao visual do projeto.
 *
 * Reescreve os tokens do `design-system.json` em vez de apagar as custom
 * properties: o `<html>` já vem com elas do servidor, e apagar cairia no
 * fallback do `globals.css`, que pode ser outro tema.
 */
export function limparTema() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CHAVE_TEMA)
    } catch {
      // Sem persistência para limpar; a aplicação abaixo já resolve a tela.
    }
  }
  aplicarTema(designSystem)
}

/** Devolve o id reaplicado, ou `null` se não havia prévia salva. */
export function reaplicarTemaSalvo(): string | null {
  const id = lerTemaSalvo()
  if (!id) return null

  const sistema = acharSistema(id)
  if (!sistema) {
    limparTema()
    return null
  }

  aplicarTema(paraDesignSystem(sistema))
  return id
}

export { designSystem as sistemaDoProjeto }

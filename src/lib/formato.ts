/**
 * Formatação de data, hora e dinheiro em pt-BR.
 *
 * REGRA DE OURO DESTE ARQUIVO: nada aqui converte para UTC.
 *
 * O app guarda data como `"2026-07-28"` e hora como `"14:30"`. São strings
 * locais, do jeito que a pessoa digitou no formulário. `new Date("2026-07-28")` seria
 * lido como meia-noite em UTC e, num fuso negativo como o do Brasil, voltaria
 * dia 27 às 21h: o compromisso apareceria na coluna do dia anterior. Por isso
 * toda data é montada por componentes (ano, mês, dia) e toda conta de horário é
 * feita em minutos, sobre a string.
 */

/** Data no formato `AAAA-MM-DD`. */
export type DataISO = string
/** Hora no formato `HH:MM`, 24 horas. */
export type HoraISO = string

const MINUTOS_NO_DIA = 24 * 60

function doisDigitos(n: number) {
  return String(n).padStart(2, "0")
}

/** Só a primeira letra. O resto vem do Intl e já está certo ("terça-feira"). */
function comInicialMaiuscula(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** O Intl em pt-BR devolve "ter." e "jul." com ponto; na interface o ponto só polui. */
function semPontoFinal(texto: string) {
  return texto.replace(/\.$/, "")
}

// --- conversão entre string e Date ----------------------------------------

/** `Date` na meia-noite LOCAL do dia informado. */
export function deISO(iso: DataISO): Date {
  const [ano, mes, dia] = iso.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

export function paraISO(data: Date): DataISO {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

export function hoje(): DataISO {
  return paraISO(new Date())
}

export function ehHoje(iso: DataISO) {
  return iso === hoje()
}

export function ehPassado(iso: DataISO) {
  return iso < hoje()
}

export function ehFimDeSemana(iso: DataISO) {
  const diaDaSemana = deISO(iso).getDay()
  return diaDaSemana === 0 || diaDaSemana === 6
}

// --- aritmética de dias e semanas ------------------------------------------

export function somarDias(iso: DataISO, dias: number): DataISO {
  const data = deISO(iso)
  data.setDate(data.getDate() + dias)
  return paraISO(data)
}

/** Segunda-feira da semana que contém `iso`. A semana brasileira começa nela. */
export function inicioDaSemana(iso: DataISO): DataISO {
  const data = deISO(iso)
  // getDay(): 0 é domingo. O `+ 6) % 7` reancora a contagem na segunda.
  const desdeSegunda = (data.getDay() + 6) % 7
  return somarDias(iso, -desdeSegunda)
}

/** Os sete dias, de segunda a domingo, a partir de uma segunda-feira. */
export function diasDaSemana(inicioISO: DataISO): DataISO[] {
  return Array.from({ length: 7 }, (_, indice) => somarDias(inicioISO, indice))
}

// --- datas por extenso -----------------------------------------------------

const nomeDiaCurto = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
const nomeDiaLongo = new Intl.DateTimeFormat("pt-BR", { weekday: "long" })
const mesLongo = new Intl.DateTimeFormat("pt-BR", { month: "long" })
const mesCurto = new Intl.DateTimeFormat("pt-BR", { month: "short" })
const dataNumerica = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})
const dataLongaComDiaDaSemana = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

/** "28/07/2026" */
export function formatarData(iso: DataISO) {
  return dataNumerica.format(deISO(iso))
}

/** "Terça-feira, 28 de julho de 2026" */
export function formatarDataPorExtenso(iso: DataISO) {
  return comInicialMaiuscula(dataLongaComDiaDaSemana.format(deISO(iso)))
}

/** "Ter" */
export function formatarDiaDaSemanaCurto(iso: DataISO) {
  return comInicialMaiuscula(semPontoFinal(nomeDiaCurto.format(deISO(iso))))
}

/** "terça-feira" */
export function formatarDiaDaSemana(iso: DataISO) {
  return nomeDiaLongo.format(deISO(iso))
}

/** "28", o número do dia, pro cabeçalho da coluna. */
export function formatarDiaDoMes(iso: DataISO) {
  return String(deISO(iso).getDate())
}

/** "jul", o mês abreviado, pro quadradinho de calendário de uma lista. */
export function mesAbreviado(iso: DataISO) {
  return semPontoFinal(mesCurto.format(deISO(iso)))
}

/*
  Atalhos de nome curto para os MESMOS formatos acima (`dataCurta` é
  literalmente `formatarData`).

  As duas famílias de nome existem porque as telas foram escritas em paralelo.
  Use a que ler melhor no seu componente. Só não crie uma terceira.
*/
export const dataCurta = formatarData
export const dataPorExtenso = formatarDataPorExtenso
export const diaDoMes = formatarDiaDoMes

/**
 * Intervalo de uma semana, o mais curto que continue sem ambiguidade:
 * "27 a 31 de julho de 2026", "27 de jul a 2 de ago de 2026" ou
 * "29 de dez de 2025 a 4 de jan de 2026".
 */
export function formatarIntervaloDeDatas(inicioISO: DataISO, fimISO: DataISO) {
  const inicio = deISO(inicioISO)
  const fim = deISO(fimISO)

  if (inicio.getFullYear() !== fim.getFullYear()) {
    return `${inicio.getDate()} de ${semPontoFinal(mesCurto.format(inicio))} de ${inicio.getFullYear()} a ${fim.getDate()} de ${semPontoFinal(mesCurto.format(fim))} de ${fim.getFullYear()}`
  }

  if (inicio.getMonth() !== fim.getMonth()) {
    return `${inicio.getDate()} de ${semPontoFinal(mesCurto.format(inicio))} a ${fim.getDate()} de ${semPontoFinal(mesCurto.format(fim))} de ${fim.getFullYear()}`
  }

  return `${inicio.getDate()} a ${fim.getDate()} de ${mesLongo.format(fim)} de ${fim.getFullYear()}`
}

// --- horas -----------------------------------------------------------------

function horaParaMinutos(hora: HoraISO) {
  const [h, m] = hora.split(":").map(Number)
  return h * 60 + m
}

function minutosParaHora(minutos: number): HoraISO {
  // Um compromisso que atravessa a meia-noite volta para o começo do dia em vez
  // de virar "25:30". O relógio dá a volta, o horário não estoura.
  const normalizado = ((minutos % MINUTOS_NO_DIA) + MINUTOS_NO_DIA) % MINUTOS_NO_DIA
  return `${doisDigitos(Math.floor(normalizado / 60))}:${doisDigitos(normalizado % 60)}`
}

/** Horário final a partir do inicial e da duração em minutos. */
export function somarMinutos(hora: HoraISO, minutos: number): HoraISO {
  return minutosParaHora(horaParaMinutos(hora) + minutos)
}

/** "10:00". Normaliza o campo `hora` antes de exibir ("9:5" vira "09:05"). */
export function horaMinuto(hora: HoraISO): string {
  const [h, m] = hora.split(":").map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return ""
  return minutosParaHora(h * 60 + m)
}

/** `datetime` de um `<time>`: "2026-07-28T14:30". */
export function paraAtributoDateTime(iso: DataISO, hora: HoraISO) {
  return `${iso}T${hora}`
}

// --- números ---------------------------------------------------------------

const moedaCheia = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const moedaRedonda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
})
const numeroSimples = new Intl.NumberFormat("pt-BR")
const proporcao = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 })

/** "R$ 12.400,00". Com `{ centavos: false }`, "R$ 12.400". */
export function moeda(valor: number, opcoes?: { centavos?: boolean }) {
  if (!Number.isFinite(valor)) return ""
  return (opcoes?.centavos === false ? moedaRedonda : moedaCheia).format(valor)
}

/** "R$ 12.400", sem centavos, que numa lista só atrapalham a leitura. */
export function formatarMoeda(valor: number) {
  return moeda(valor, { centavos: false })
}

/** "1.240", milhar com ponto, sem casa decimal inventada. */
export function numero(valor: number) {
  return Number.isFinite(valor) ? numeroSimples.format(valor) : ""
}

/** Recebe a fração (`0.33`) e devolve "33%". */
export function porcentagem(fracao: number) {
  return Number.isFinite(fracao) ? proporcao.format(fracao) : ""
}

/** "1 pedido" / "3 pedidos". Os substantivos vêm do `site.ts`, nunca daqui. */
export function contar(quantidade: number, singular: string, plural: string) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`
}

// --- carimbos de criação ---------------------------------------------------

/**
 * `criadoEm` é o único campo que guarda ISO completo com fuso (o `Date.now()` de
 * quem cadastrou). Convertemos para o dia LOCAL antes de formatar, senão a regra
 * de ouro lá de cima seria furada justamente aqui.
 */
export function formatarCarimbo(carimbo: string) {
  return formatarData(paraISO(new Date(carimbo)))
}

// --- texto, contato e busca -------------------------------------------------

export function apenasDigitos(texto: string) {
  return texto.replace(/\D/g, "")
}

/**
 * Máscara progressiva de telefone brasileiro: "(11) 98844-2130".
 *
 * Aceita fixo (10 dígitos) e celular (11), porque os dois aparecem na agenda de
 * qualquer negócio. O hífen anda uma casa quando entra o nono dígito. É por
 * isso que o corte é calculado em vez de fixo.
 */
export function formatarTelefone(entrada: string) {
  const digitos = apenasDigitos(entrada).slice(0, 11)
  if (digitos.length === 0) return ""
  if (digitos.length <= 2) return `(${digitos}`

  const corte = digitos.length > 10 ? 7 : 6
  if (digitos.length <= corte) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, corte)}-${digitos.slice(corte)}`
}

/** DDD mais 8 dígitos (fixo) ou 9 (celular). */
export function telefoneCompleto(texto: string) {
  const total = apenasDigitos(texto).length
  return total === 10 || total === 11
}

/**
 * Checagem prática, não a RFC 5322.
 *
 * O objetivo é pegar erro de digitação na hora, não recusar endereço exótico.
 * Um e-mail que passa aqui e não existe só se descobre enviando mensagem.
 */
export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/** "Marina Alvarenga" → "MA". Primeiro e último nome, para o avatar. */
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return ""

  const primeira = partes[0][0]
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ""
  return (primeira + ultima).toLocaleUpperCase("pt-BR")
}

/**
 * Normaliza para comparar em busca: minúsculas e sem acento.
 *
 * Quem digita "otavio" com pressa espera achar "Otávio". Obrigar o acento
 * transforma a busca num teste de ortografia.
 */
export function chaveDeBusca(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
}

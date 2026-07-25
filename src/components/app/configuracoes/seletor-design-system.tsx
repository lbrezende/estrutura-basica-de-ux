"use client"

import { useEffect, useMemo, useState } from "react"
import { Icone } from "@/components/app/icone"
import {
  Badge,
  Button,
  CampoBusca,
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardTitulo,
  EstadoVazio,
} from "@/components/ui"
import { sistema as textos } from "@/content/site"
import { cn } from "@/lib/cn"
import {
  acharSistema,
  aplicarTema,
  CATALOGO,
  limparTema,
  paraDesignSystem,
  reaplicarTemaSalvo,
  salvarTema,
  type SistemaDoCatalogo,
} from "@/lib/tema"
import { MiniaturaDesignSystem } from "./miniatura-design-system"

const copy = textos.configuracoes.tema

/**
 * Derivar os 71 sistemas custa uma volta de contraste por cor. É barato, mas não
 * de graça. Feito uma vez na carga do módulo, nunca a cada tecla digitada.
 */
const SISTEMAS = CATALOGO.map((sistema) => ({ sistema, ds: paraDesignSystem(sistema) }))

export function SeletorDesignSystem() {
  const [busca, setBusca] = useState("")
  const [idAtual, setIdAtual] = useState<string | null>(null)
  const [copia, setCopia] = useState<"ocioso" | "copiado" | "erro">("ocioso")

  // A prévia salva só pode ser lida depois da hidratação. O servidor não tem
  // localStorage e decidir antes disso pintaria a tela duas vezes.
  useEffect(() => {
    setIdAtual(reaplicarTemaSalvo())
  }, [])

  useEffect(() => {
    if (copia === "ocioso") return
    const relogio = window.setTimeout(() => setCopia("ocioso"), 2500)
    return () => window.clearTimeout(relogio)
  }, [copia])

  const termo = busca.trim().toLowerCase()

  const visiveis = useMemo(() => {
    if (!termo) return SISTEMAS
    return SISTEMAS.filter(
      ({ sistema }) =>
        sistema.name.toLowerCase().includes(termo) || sistema.id.toLowerCase().includes(termo)
    )
  }, [termo])

  const sistemaAtual = idAtual ? acharSistema(idAtual) : undefined
  const dsAtual = sistemaAtual ? paraDesignSystem(sistemaAtual) : null
  const json = dsAtual ? JSON.stringify(dsAtual, null, 2) : null

  function selecionar(sistema: SistemaDoCatalogo, ds: ReturnType<typeof paraDesignSystem>) {
    aplicarTema(ds)
    salvarTema(sistema.id)
    setIdAtual(sistema.id)
    setCopia("ocioso")
  }

  function voltarAoPadrao() {
    limparTema()
    setIdAtual(null)
    setCopia("ocioso")
  }

  async function copiarJson() {
    if (!json) return
    try {
      await navigator.clipboard.writeText(json)
      setCopia("copiado")
    } catch {
      // Área de transferência bloqueada (http, permissão negada): a saída é
      // selecionar o texto na mão, e o aviso diz isso.
      setCopia("erro")
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <Card>
        <CardCabecalho>
          <div className="flex items-center gap-2">
            <span className="superficie-elevada flex size-8 shrink-0 items-center justify-center rounded-ds text-primary">
              <Icone nome="paleta" className="size-4" />
            </span>
            <CardTitulo como="h2">{copy.titulo}</CardTitulo>
          </div>
          <CardDescricao>{copy.descricao}</CardDescricao>
        </CardCabecalho>

        <CardConteudo className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <CampoBusca
              valor={busca}
              aoMudar={setBusca}
              rotulo={copy.rotuloBusca}
              placeholder={copy.placeholderBusca}
              classeCampo="sm:max-w-xs sm:flex-1"
            />
            <p className="text-[13px] text-muted sm:ml-auto" aria-live="polite">
              {visiveis.length}/{SISTEMAS.length} {copy.sufixoContagem}
            </p>
          </div>

          <div className="superficie-elevada flex flex-col gap-3 rounded-ds border border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-muted">
              {sistemaAtual ? (
                <>
                  {copy.previaAtual}{" "}
                  <strong className="font-medium text-ink">{sistemaAtual.name}</strong>
                </>
              ) : (
                copy.previaPadrao
              )}
            </p>

            <Button
              variante="secundaria"
              tamanho="sm"
              onClick={voltarAoPadrao}
              disabled={!sistemaAtual}
              iconeEsquerda={<Icone nome="restaurar" />}
              className="sm:shrink-0"
            >
              {copy.voltarPadrao}
            </Button>
          </div>

          {visiveis.length === 0 ? (
            <EstadoVazio
              tamanho="sm"
              icone={<Icone nome="paleta" />}
              titulo={copy.vazio.titulo}
              texto={copy.vazio.texto}
            />
          ) : (
            <div
              role="group"
              aria-label={copy.rotuloGrade}
              className="-mx-1 grid max-h-[26rem] grid-cols-2 gap-3 overflow-y-auto px-1 py-1 sm:max-h-[32rem] sm:grid-cols-3 xl:grid-cols-4"
            >
              {visiveis.map(({ sistema, ds }) => {
                const escolhido = sistema.id === idAtual

                return (
                  <button
                    key={sistema.id}
                    type="button"
                    onClick={() => selecionar(sistema, ds)}
                    aria-pressed={escolhido}
                    className={cn(
                      "group flex flex-col gap-2 rounded-ds border p-2 text-left transition-colors duration-150",
                      // O sistema escolhido É o tema aplicado, então o
                      // `.brilho-marca` sai exatamente na cor dele. Só ele
                      // levanta da grade.
                      escolhido
                        ? "brilho-marca border-primary bg-primary/8"
                        : "superficie border-hairline hover:border-muted/50 hover:bg-elevated"
                    )}
                  >
                    <MiniaturaDesignSystem ds={ds} accent={sistema.tokens.accent} />

                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                        {sistema.name}
                      </span>
                      {escolhido && (
                        <Icone nome="check" className="size-3.5 shrink-0 text-primary" />
                      )}
                    </span>

                    <span className="flex flex-wrap items-center gap-1.5">
                      <Badge variante="neutra" className="px-1.5 text-[11px]">
                        {sistema.mode === "dark" ? copy.selo.escuro : copy.selo.claro}
                      </Badge>
                      {escolhido && (
                        <Badge variante="destaque" className="px-1.5 text-[11px]">
                          {copy.emUso}
                        </Badge>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </CardConteudo>
      </Card>

      <Card>
        <CardCabecalho>
          <CardTitulo como="h2">{copy.json.titulo}</CardTitulo>
          <CardDescricao>{copy.json.texto}</CardDescricao>
        </CardCabecalho>

        <CardConteudo className="flex flex-col gap-4">
          <div className="flex gap-3 rounded-ds border border-warning/25 bg-warning/8 px-4 py-3">
            <Icone nome="alerta" className="mt-0.5 size-4 shrink-0 text-warning" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">{copy.aviso.titulo}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{copy.aviso.texto}</p>
            </div>
          </div>

          {json ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variante="secundaria"
                  tamanho="sm"
                  onClick={copiarJson}
                  iconeEsquerda={<Icone nome={copia === "copiado" ? "check" : "copiar"} />}
                >
                  {copia === "copiado" ? copy.json.copiado : copy.json.copiar}
                </Button>

                {/* Sempre no DOM: região viva que aparece depois não é anunciada. */}
                <p role="status" className="text-[13px] text-danger">
                  {copia === "erro" ? copy.json.erro : ""}
                </p>
              </div>

              <pre
                tabIndex={0}
                role="region"
                aria-label={copy.json.rotuloBloco}
                className="superficie-elevada max-h-80 overflow-auto rounded-ds border border-hairline p-4 font-mono text-xs leading-relaxed text-ink"
              >
                {json}
              </pre>
            </>
          ) : (
            <p className="text-[13px] text-muted">{copy.previaPadrao}</p>
          )}
        </CardConteudo>
      </Card>
    </div>
  )
}

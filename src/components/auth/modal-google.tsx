"use client"

import { Icone } from "@/components/app/icone"
import { Button, Modal } from "@/components/ui"
import { entrada } from "@/content/site"
import { BlocoCopiavel } from "./bloco-copiavel"
import { IconeGoogle } from "./icone-google"

/**
 * Um passo do tutorial. O `site.ts` guarda os passos como dado puro (sem
 * anotação de tipo, para continuar sendo só texto); a forma é declarada aqui.
 */
export type PassoGoogle = {
  titulo: string
  texto: string
  /** Abre em outra aba quando o passo acontece fora do app. */
  link?: { rotulo: string; href: string }
  /** Trecho para colar no Google. Sem isso, o passo é só leitura. */
  codigo?: string
  codigoRotulo?: string
}

export type ModalGoogleProps = {
  aberto: boolean
  aoFechar: () => void
  /** O modal explica, não autentica. Por isso oferece a saída que funciona hoje. */
  aoEntrarDireto: () => void
}

const PASSOS: PassoGoogle[] = entrada.modalGoogle.passos

/**
 * O botão do Google não autentica: ele ensina.
 *
 * Fingir um login que não existe seria pior que não ter o botão. Aqui a pessoa
 * descobre exatamente o que falta, com tudo pronto para copiar, e sai com um
 * caminho que funciona agora.
 */
export function ModalGoogle({ aberto, aoFechar, aoEntrarDireto }: ModalGoogleProps) {
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={entrada.modalGoogle.titulo}
      descricao={entrada.modalGoogle.descricao}
      tamanho="lg"
      icone={<IconeGoogle />}
      rodape={
        <>
          <Button variante="secundaria" onClick={aoFechar}>
            {entrada.modalGoogle.fechar}
          </Button>
          <Button onClick={aoEntrarDireto}>{entrada.entrarDireto}</Button>
        </>
      }
    >
      <ol className="flex flex-col gap-6">
        {PASSOS.map((passo, indice) => (
          <li key={passo.titulo} className="flex gap-3">
            {/* A numeração é decorativa: a ordem já vem da lista. */}
            <span
              aria-hidden="true"
              className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full border border-hairline bg-elevated font-mono text-[12px] text-muted"
            >
              {indice + 1}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-ink">{passo.titulo}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{passo.texto}</p>

              {passo.link && (
                <a
                  href={passo.link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  // Tinta no texto e cor da marca só no sublinhado: um link de
                  // 13px em `text-primary` não passa em contraste nos temas de
                  // primária clara.
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-ds text-[13px] font-medium text-ink underline decoration-primary underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-2"
                >
                  {passo.link.rotulo}
                  <Icone nome="link-externo" className="size-3.5" />
                </a>
              )}

              {passo.codigo && (
                <BlocoCopiavel
                  codigo={passo.codigo}
                  rotulo={passo.codigoRotulo}
                  className="mt-2.5"
                />
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-7 rounded-ds border border-hairline bg-elevated p-3.5 text-[13px] leading-relaxed text-muted">
        {entrada.modalGoogle.nota}
      </p>

      <div className="mt-3 flex items-start gap-2.5 rounded-ds border border-warning/40 bg-warning/10 p-3.5">
        <Icone nome="alerta" className="mt-px size-4 shrink-0 text-warning" />
        <p className="text-[13px] leading-relaxed text-ink">{entrada.modalGoogle.aviso}</p>
      </div>
    </Modal>
  )
}

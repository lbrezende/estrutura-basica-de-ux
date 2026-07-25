import type { Metadata } from "next"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { DadosExemplo } from "@/components/app/configuracoes/dados-exemplo"
import { Perfil } from "@/components/app/configuracoes/perfil"
import { SeletorDesignSystem } from "@/components/app/configuracoes/seletor-design-system"
import { marca, sistema } from "@/content/site"

const copy = sistema.configuracoes

export const metadata: Metadata = {
  title: `${copy.titulo} · ${marca.nome}`,
}

/**
 * A página é servidor: quem precisa de estado (a prévia do tema, os dados, o
 * perfil) é cada bloco. Assim o JavaScript que chega ao navegador é só o das
 * três ilhas, não o da tela inteira.
 */
export default function PaginaConfiguracoes() {
  return (
    <>
      <CabecalhoPagina titulo={copy.titulo} descricao={copy.descricao} />

      <div className="flex flex-col gap-6 sm:gap-8">
        <SeletorDesignSystem />

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <DadosExemplo />
          <Perfil />
        </div>
      </div>
    </>
  )
}

import Link from "next/link"
import { Logo } from "@/components/app/logo"
import { landing, sistema } from "@/content/site"
import { BotaoLink } from "./botao-link"

/**
 * Barra fixa da landing: marca à esquerda, âncoras das dobras no meio, "Entrar"
 * sempre visível à direita.
 *
 * No celular as âncoras somem em vez de virarem menu sanfona. A página tem
 * cinco dobras e rola rápido, então um hambúrguer só adicionaria um toque entre
 * a pessoa e o único botão que importa aqui.
 *
 * O fundo e o desfoque chegam com a rolagem, pela `.cabecalho-condensa`: no topo
 * a barra é invisível e a arte do herói passa inteira por baixo dela. Isso é CSS
 * puro (a animação é presa à barra de rolagem), então a landing continua sem
 * uma linha de JavaScript.
 */
export function CabecalhoMarketing() {
  return (
    <header className="cabecalho-condensa sticky top-0 z-50">
      {/* Primeiro foco da página: pula o cabeçalho inteiro e cai no conteúdo. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-ds focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-ink"
      >
        {sistema.casca.pularParaConteudo}
      </a>

      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={landing.cabecalho.irParaInicio}
          className="flex shrink-0 items-center rounded-ds transition-opacity hover:opacity-80 pointer-coarse:min-h-11"
        >
          <Logo />
        </Link>

        <nav aria-label={landing.cabecalho.navegacao} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {landing.cabecalho.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
                >
                  {link.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* O tour de boas-vindas começa aqui. Ver src/content/tour.ts. */}
        <BotaoLink
          href="/entrar"
          tamanho="sm"
          data-tour="entrar"
          className="ml-auto shrink-0 md:ml-3"
        >
          {landing.cabecalho.entrar}
        </BotaoLink>
      </div>
    </header>
  )
}

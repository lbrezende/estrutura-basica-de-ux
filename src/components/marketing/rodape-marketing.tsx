import { Logo } from "@/components/app/logo"
import { landing, marca } from "@/content/site"

/**
 * Rodapé da landing. O ano vem do relógio. Nada de data escrita à mão que
 * envelhece sozinha no dia 1º de janeiro.
 */
export function RodapeMarketing() {
  const { rodape } = landing
  const ano = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-12">
        <div className="min-w-0">
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{rodape.texto}</p>
        </div>

        <nav aria-label={rodape.navegacao}>
          {/* `gap-x-2` em vez de `gap-x-6`: o alvo de 44px já dá o respiro. */}
          <ul className="-mx-3 flex flex-wrap items-center gap-x-2">
            {rodape.links.map((link) => (
              <li key={link.rotulo}>
                <a
                  href={link.href}
                  className="inline-flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:text-ink pointer-coarse:min-h-11"
                >
                  {link.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-hairline">
        <p className="mx-auto max-w-[1200px] px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
          © {ano} {marca.nome}
        </p>
      </div>
    </footer>
  )
}

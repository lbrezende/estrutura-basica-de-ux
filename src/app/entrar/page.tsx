import { FormularioDeEntrada } from "@/components/auth/formulario-de-entrada"
import { entrada } from "@/content/site"
import { googleConfigurado } from "@/lib/google"
import { sessaoConfigurada } from "@/lib/sessao-servidor"

/**
 * A tela de entrar, agora com uma decisão que só o servidor pode tomar.
 *
 * As chaves do Google e o `AUTH_SECRET` moram em variável de ambiente, e
 * variável de ambiente não chega no navegador. Então quem confere se o login
 * está ligado é esta página, no servidor, e ela passa a resposta como uma
 * única palavra (`ligado` ou não) pro formulário, que é de cliente. Nenhuma
 * chave atravessa: só o `sim` ou o `não`.
 *
 * O componente de cliente inteiro está em `src/components/auth`.
 */

// O que decide a tela vem do ambiente, então nada de página estática de build.
export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ google?: string }> }

export default async function PaginaEntrar({ searchParams }: Props) {
  const { google } = await searchParams
  const avisos = entrada.google.avisos as Record<string, string | undefined>

  return (
    <FormularioDeEntrada
      googleLigado={googleConfigurado() && sessaoConfigurada()}
      // Motivo desconhecido no endereço não vira mensagem: o parâmetro vem da
      // barra do navegador, e qualquer pessoa pode escrever o que quiser nele.
      aviso={google ? avisos[google] : undefined}
    />
  )
}

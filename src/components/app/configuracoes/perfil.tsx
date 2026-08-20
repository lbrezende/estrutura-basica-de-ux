"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"
import { Icone } from "@/components/app/icone"
import { useRodarTour } from "@/components/onboarding/tour"
import {
  Button,
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardRodape,
  CardTitulo,
  Input,
} from "@/components/ui"
import { sistema as textos } from "@/content/site"
import { tour } from "@/content/tour"
import { entrar, sair, useSessao } from "@/lib/store"

const copy = textos.configuracoes.perfil

const esquema = z.object({
  nome: z.string().trim().min(2, copy.erros.nome),
  email: z.string().trim().pipe(z.email(copy.erros.email)),
})

type Erros = { nome?: string; email?: string }

export function Perfil() {
  const router = useRouter()
  const sessao = useSessao()
  const rodarTour = useRodarTour()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [erros, setErros] = useState<Erros>({})
  const [salvo, setSalvo] = useState(false)

  // A sessão só existe depois da hidratação. Dependemos dos valores em si (não
  // do objeto): `useSessao` devolve um objeto novo a cada render.
  const nomeSalvo = sessao?.nome ?? ""
  const emailSalvo = sessao?.email ?? ""

  useEffect(() => {
    setNome(nomeSalvo)
    setEmail(emailSalvo)
  }, [nomeSalvo, emailSalvo])

  useEffect(() => {
    if (!salvo) return
    const relogio = window.setTimeout(() => setSalvo(false), 3000)
    return () => window.clearTimeout(relogio)
  }, [salvo])

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const resultado = esquema.safeParse({ nome, email })
    if (!resultado.success) {
      const novos: Erros = {}
      for (const problema of resultado.error.issues) {
        const campo = problema.path[0]
        if (campo === "nome" && !novos.nome) novos.nome = problema.message
        if (campo === "email" && !novos.email) novos.email = problema.message
      }
      setErros(novos)
      setSalvo(false)
      return
    }

    // O `entrar` avisa a própria aba, então o nome no topo do app troca na hora.
    entrar(resultado.data.nome, resultado.data.email)
    setErros({})
    setSalvo(true)
  }

  function encerrar() {
    sair()
    router.replace("/entrar")
  }

  return (
    <Card className="flex flex-col">
      <CardCabecalho>
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-ds bg-primary/12 text-primary">
            <Icone nome="usuario" className="size-4" />
          </span>
          <CardTitulo como="h2">{copy.titulo}</CardTitulo>
        </div>
        <CardDescricao>{copy.descricao}</CardDescricao>
      </CardCabecalho>

      <CardConteudo className="flex-1">
        {/* `noValidate`: as mensagens são nossas, em português e ligadas ao campo. */}
        <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
          <Input
            rotulo={copy.nome}
            obrigatorio
            value={nome}
            onChange={(evento) => {
              setNome(evento.target.value)
              setSalvo(false)
            }}
            erro={erros.nome}
            autoComplete="name"
          />

          <Input
            rotulo={copy.email}
            type="email"
            obrigatorio
            value={email}
            onChange={(evento) => {
              setEmail(evento.target.value)
              setSalvo(false)
            }}
            erro={erros.email}
            ajuda={copy.ajudaEmail}
            autoComplete="email"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" iconeEsquerda={<Icone nome="check" />}>
              {copy.salvar}
            </Button>

            {/* Sempre no DOM: região viva que só aparece depois não é anunciada. */}
            <p role="status" className="text-[13px] text-success">
              {salvo ? copy.salvo : ""}
            </p>
          </div>
        </form>
      </CardConteudo>

      <CardRodape divisor>
        <Button variante="secundaria" onClick={encerrar} iconeEsquerda={<Icone nome="sair" />}>
          {copy.sair}
        </Button>

        {/* O tour de boas-vindas roda uma vez e some. Quem quiser rever, revê:
            escondê-lo pra sempre depois do primeiro fechamento transformaria
            uma ajuda em algo que a pessoa perdeu por clicar rápido demais. */}
        <Button variante="fantasma" onClick={rodarTour} iconeEsquerda={<Icone nome="ajuda" />}>
          {tour.rever.acao}
        </Button>
      </CardRodape>
    </Card>
  )
}

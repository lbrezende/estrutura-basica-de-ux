"use client"

import { useRef, useState, type FormEvent, type RefObject } from "react"
import { Input, Select, Textarea, type OpcaoSelect } from "@/components/ui"
import { sistema } from "@/content/site"
import { emailValido, formatarTelefone, telefoneCompleto } from "@/lib/formato"
import type { Cliente, Status } from "@/lib/types"

const textos = sistema.clientes.formulario

/** O que o formulário devolve. `id` e `criadoEm` são do store, não da pessoa. */
export type ValoresCliente = Omit<Cliente, "id" | "criadoEm">

type CampoComErro = "nome" | "email" | "telefone"
type Erros = Partial<Record<CampoComErro, string>>

const STATUS: Status[] = ["ativo", "pendente", "inativo"]

const OPCOES_STATUS: OpcaoSelect[] = STATUS.map((status) => ({
  valor: status,
  rotulo: sistema.clientes.status[status],
}))

const EM_BRANCO: ValoresCliente = {
  nome: "",
  empresa: "",
  email: "",
  telefone: "",
  // Quem está cadastrando alguém agora quase sempre acabou de fechar com ele.
  status: "ativo",
  observacoes: "",
}

/**
 * Validação num lugar só, rodando tanto no envio quanto na correção.
 *
 * Telefone é opcional, mas se tem algo digitado tem que estar completo. Meio
 * telefone salvo é pior que telefone nenhum: parece que dá pra ligar.
 */
function validar(valores: ValoresCliente): Erros {
  const erros: Erros = {}

  if (!valores.nome.trim()) erros.nome = textos.erros.nome

  if (!valores.email.trim()) erros.email = textos.erros.emailVazio
  else if (!emailValido(valores.email)) erros.email = textos.erros.emailInvalido

  if (valores.telefone.trim() && !telefoneCompleto(valores.telefone)) {
    erros.telefone = textos.erros.telefone
  }

  return erros
}

type PropsFormularioCliente = {
  /**
   * Id do `<form>`. É o que permite ao botão de enviar morar no rodapé do modal
   * ou do drawer, fora da árvore do formulário, via `<button form={id}>`.
   */
  id: string
  /** Ausente = cadastro novo. Presente = edição, com os campos preenchidos. */
  cliente?: Cliente
  aoEnviar: (valores: ValoresCliente) => void
  /** Para o diálogo abrir com o cursor já no primeiro campo. */
  refNome?: RefObject<HTMLInputElement | null>
}

export function FormularioCliente({ id, cliente, aoEnviar, refNome }: PropsFormularioCliente) {
  const [valores, setValores] = useState<ValoresCliente>(() =>
    cliente
      ? {
          nome: cliente.nome,
          empresa: cliente.empresa,
          email: cliente.email,
          telefone: cliente.telefone,
          status: cliente.status,
          observacoes: cliente.observacoes,
        }
      : EM_BRANCO
  )
  const [erros, setErros] = useState<Erros>({})
  const [jaTentou, setJaTentou] = useState(false)

  const refNomeInterno = useRef<HTMLInputElement>(null)
  const refEmail = useRef<HTMLInputElement>(null)
  const refTelefone = useRef<HTMLInputElement>(null)
  const refDoNome = refNome ?? refNomeInterno

  function mudar<Campo extends keyof ValoresCliente>(campo: Campo, valor: ValoresCliente[Campo]) {
    const proximos = { ...valores, [campo]: valor }
    setValores(proximos)

    // Antes do primeiro envio ninguém é corrigido no meio da digitação. Depois
    // dele, o erro sai no instante em que o campo fica válido. Esperar o próximo
    // envio pra dizer "agora está certo" é castigar quem já corrigiu.
    if (jaTentou) setErros(validar(proximos))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setJaTentou(true)

    const encontrados = validar(valores)
    setErros(encontrados)

    if (encontrados.nome || encontrados.email || encontrados.telefone) {
      // Mensagem na tela não basta: sem levar o foco, quem navega por teclado
      // fica sem saber para onde voltar.
      const primeiro = encontrados.nome ? refDoNome : encontrados.email ? refEmail : refTelefone
      primeiro.current?.focus()
      return
    }

    aoEnviar({
      ...valores,
      nome: valores.nome.trim(),
      empresa: valores.empresa.trim(),
      email: valores.email.trim(),
      telefone: valores.telefone.trim(),
      observacoes: valores.observacoes.trim(),
    })
  }

  return (
    // `noValidate`: a validação é nossa, em português e por campo. Sem isso o
    // navegador interrompe antes com a bolha dele, que não segue o tema nem o texto.
    <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input
        ref={refDoNome}
        rotulo={textos.campos.nome}
        obrigatorio
        erro={erros.nome}
        value={valores.nome}
        onChange={(evento) => mudar("nome", evento.target.value)}
        placeholder={textos.exemploNome}
        autoComplete="name"
        classeCampo="sm:col-span-2"
      />

      <Input
        rotulo={textos.campos.empresa}
        value={valores.empresa}
        onChange={(evento) => mudar("empresa", evento.target.value)}
        placeholder={textos.exemploEmpresa}
        autoComplete="organization"
      />

      <Select
        rotulo={textos.campos.status}
        opcoes={OPCOES_STATUS}
        placeholder={null}
        value={valores.status}
        onChange={(evento) => mudar("status", evento.target.value as Status)}
      />

      <Input
        ref={refEmail}
        rotulo={textos.campos.email}
        type="email"
        obrigatorio
        erro={erros.email}
        value={valores.email}
        onChange={(evento) => mudar("email", evento.target.value)}
        placeholder={textos.exemploEmail}
        autoComplete="email"
      />

      <Input
        ref={refTelefone}
        rotulo={textos.campos.telefone}
        type="tel"
        inputMode="tel"
        erro={erros.telefone}
        ajuda={textos.ajudaTelefone}
        value={valores.telefone}
        // A máscara é aplicada no valor digitado, não numa camada por cima: o
        // que está na tela é exatamente o que vai para o store.
        onChange={(evento) => mudar("telefone", formatarTelefone(evento.target.value))}
        placeholder={textos.exemploTelefone}
        autoComplete="tel"
      />

      <Textarea
        rotulo={textos.campos.observacoes}
        value={valores.observacoes}
        onChange={(evento) => mudar("observacoes", evento.target.value)}
        placeholder={textos.exemploObservacoes}
        rows={3}
        classeCampo="sm:col-span-2"
      />
    </form>
  )
}

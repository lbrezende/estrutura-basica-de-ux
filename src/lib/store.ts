"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"
import { SEED } from "./seed"
import type { Agendamento, Cliente, Dados, Pedido, Sessao } from "./types"

/**
 * Persistência local, de propósito.
 *
 * O app precisa funcionar com `npm install && npm run dev` e mais nada. Sem
 * banco, sem variável de ambiente, sem conta em serviço nenhum. Quem está
 * abrindo um terminal pela primeira vez não vai configurar Postgres no passo 3.
 *
 * Trocar isso por um banco de verdade é justamente o assunto do workshop.
 * A interface deste módulo (listar/criar/atualizar/remover) foi desenhada para
 * que essa troca seja quase só reescrever o corpo das funções.
 */

const CHAVE_DADOS = "ebu:dados:v1"
const CHAVE_SESSAO = "ebu:sessao:v1"

// --- núcleo reativo -------------------------------------------------------

type Ouvinte = () => void
const ouvintes = new Set<Ouvinte>()

/** Cache do snapshot: useSyncExternalStore exige identidade estável. */
let cache: Dados | null = null

function notificar() {
  cache = null
  for (const o of ouvintes) o()
}

function inscrever(o: Ouvinte) {
  ouvintes.add(o)
  return () => {
    ouvintes.delete(o)
  }
}

function ler(): Dados {
  if (cache) return cache
  if (typeof window === "undefined") return SEED

  try {
    const bruto = window.localStorage.getItem(CHAVE_DADOS)
    if (!bruto) {
      cache = SEED
      return cache
    }
    const parsed = JSON.parse(bruto) as Partial<Dados>
    // Tolerante a dados antigos ou corrompidos: cada coleção cai no seed.
    cache = {
      clientes: Array.isArray(parsed.clientes) ? parsed.clientes : SEED.clientes,
      pedidos: Array.isArray(parsed.pedidos) ? parsed.pedidos : SEED.pedidos,
      agendamentos: Array.isArray(parsed.agendamentos) ? parsed.agendamentos : SEED.agendamentos,
    }
    return cache
  } catch {
    cache = SEED
    return cache
  }
}

function gravar(dados: Dados) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados))
  } catch {
    // Cota estourada ou modo privado: seguimos com o estado em memória.
  }
  notificar()
}

function atualizar(fn: (d: Dados) => Dados) {
  gravar(fn(ler()))
}

export function novoId(prefixo: string) {
  return `${prefixo}-${Math.random().toString(36).slice(2, 9)}`
}

// --- hook público ---------------------------------------------------------

export function useDados() {
  const dados = useSyncExternalStore(inscrever, ler, () => SEED)

  const criarCliente = useCallback((c: Omit<Cliente, "id" | "criadoEm">) => {
    const novo: Cliente = { ...c, id: novoId("cli"), criadoEm: new Date().toISOString() }
    atualizar((d) => ({ ...d, clientes: [novo, ...d.clientes] }))
    return novo
  }, [])

  const atualizarCliente = useCallback((id: string, patch: Partial<Cliente>) => {
    atualizar((d) => ({
      ...d,
      clientes: d.clientes.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [])

  /** Remove o cliente e tudo que dependia dele, sem deixar órfão na tela. */
  const removerCliente = useCallback((id: string) => {
    atualizar((d) => ({
      clientes: d.clientes.filter((c) => c.id !== id),
      pedidos: d.pedidos.filter((p) => p.clienteId !== id),
      agendamentos: d.agendamentos.filter((a) => a.clienteId !== id),
    }))
  }, [])

  const criarPedido = useCallback((p: Omit<Pedido, "id" | "criadoEm">) => {
    const novo: Pedido = { ...p, id: novoId("ped"), criadoEm: new Date().toISOString() }
    atualizar((d) => ({ ...d, pedidos: [novo, ...d.pedidos] }))
    return novo
  }, [])

  const atualizarPedido = useCallback((id: string, patch: Partial<Pedido>) => {
    atualizar((d) => ({
      ...d,
      pedidos: d.pedidos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  }, [])

  const removerPedido = useCallback((id: string) => {
    atualizar((d) => ({ ...d, pedidos: d.pedidos.filter((p) => p.id !== id) }))
  }, [])

  const criarAgendamento = useCallback((a: Omit<Agendamento, "id">) => {
    const novo: Agendamento = { ...a, id: novoId("age") }
    atualizar((d) => ({ ...d, agendamentos: [novo, ...d.agendamentos] }))
    return novo
  }, [])

  const atualizarAgendamento = useCallback((id: string, patch: Partial<Agendamento>) => {
    atualizar((d) => ({
      ...d,
      agendamentos: d.agendamentos.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }))
  }, [])

  const removerAgendamento = useCallback((id: string) => {
    atualizar((d) => ({ ...d, agendamentos: d.agendamentos.filter((a) => a.id !== id) }))
  }, [])

  const restaurarExemplos = useCallback(() => gravar(SEED), [])

  const limparTudo = useCallback(
    () => gravar({ clientes: [], pedidos: [], agendamentos: [] }),
    []
  )

  return {
    dados,
    criarCliente,
    atualizarCliente,
    removerCliente,
    criarPedido,
    atualizarPedido,
    removerPedido,
    criarAgendamento,
    atualizarAgendamento,
    removerAgendamento,
    restaurarExemplos,
    limparTudo,
  }
}

// --- sessão ---------------------------------------------------------------

/**
 * Sessão local, sem servidor.
 *
 * ATENÇÃO: isto NÃO é autenticação. Não protege nada. É só uma simulação para
 * as telas terem estado de "logado". Colocar login de verdade (Google OAuth,
 * sessão assinada no servidor) é conteúdo do workshop.
 */
export function lerSessao(): Sessao | null {
  if (typeof window === "undefined") return null
  try {
    const bruto = window.localStorage.getItem(CHAVE_SESSAO)
    return bruto ? (JSON.parse(bruto) as Sessao) : null
  } catch {
    return null
  }
}

export function entrar(nome = "Visitante", email = "voce@exemplo.com"): Sessao {
  const s: Sessao = { nome, email, entrouEm: new Date().toISOString() }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(s))
  }
  return s
}

export function sair() {
  if (typeof window !== "undefined") window.localStorage.removeItem(CHAVE_SESSAO)
}

/** Lê a sessão só depois da hidratação, evitando divergência com o SSR. */
export function useSessao() {
  const assinar = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb)
    return () => window.removeEventListener("storage", cb)
  }, [])

  const sessao = useSyncExternalStore(
    assinar,
    () => window.localStorage.getItem(CHAVE_SESSAO),
    () => null
  )

  useEffect(() => {}, [sessao])

  try {
    return sessao ? (JSON.parse(sessao) as Sessao) : null
  } catch {
    return null
  }
}

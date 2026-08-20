import { neon } from "@neondatabase/serverless"
import type { Agendamento, Cliente, Dados, Pedido } from "./types"

/**
 * O banco no Neon, montado e desligado.
 *
 * O app inteiro funciona sem ele: o `store` guarda tudo no navegador e ninguém
 * precisa criar conta em lugar nenhum pra rodar `npm run dev`. Quando a
 * `DATABASE_URL` aparece no `.env.local`, este arquivo acorda, cria a tabela
 * sozinho na primeira chamada e o `store` passa a falar com o Postgres em vez
 * do navegador. Não tem código pra escrever no meio: é colar a conexão.
 *
 * SOBRE O FORMATO DA TABELA. É uma tabela só, com a coleção, o id e o registro
 * em `jsonb`. Não é preguiça, é a escolha que sobrevive ao que este projeto
 * existe pra fazer: você vai renomear "cliente" pra "paciente" ou pra
 * "destinatário", trocar os campos e inventar entidade nova, e nada disso pede
 * migração aqui. Numa coluna por campo, cada mudança de ideia no produto viraria
 * `ALTER TABLE`. Trocar isso por tabelas com colunas de verdade, com índice e
 * chave estrangeira, é justamente o assunto do workshop, e o `banco/schema.sql`
 * já mostra o desenho.
 *
 * Este arquivo só é importado pelas rotas de `src/app/api`. A `DATABASE_URL`
 * traz a senha do banco dentro dela e nunca chega no navegador.
 */

const TABELA = "registros"

/** As coleções que o app guarda hoje. Serve de porteiro do que vem da rede. */
export const COLECOES = ["clientes", "pedidos", "agendamentos"] as const
export type Colecao = (typeof COLECOES)[number]

export function ehColecao(valor: unknown): valor is Colecao {
  return typeof valor === "string" && (COLECOES as readonly string[]).includes(valor)
}

function conexao() {
  const url = process.env.DATABASE_URL?.trim()
  return url ? neon(url) : null
}

export function bancoConfigurado(): boolean {
  return conexao() !== null
}

/**
 * Cria a tabela na primeira chamada e nunca mais.
 *
 * A promessa fica guardada de propósito: sem isso, duas requisições ao mesmo
 * tempo no primeiro acesso rodariam o `CREATE TABLE` em paralelo. O `IF NOT
 * EXISTS` já protege do erro, mas a corrida gastaria duas idas ao banco em toda
 * inicialização.
 */
let preparacao: Promise<void> | null = null

async function preparar(sql: NonNullable<ReturnType<typeof conexao>>) {
  if (!preparacao) {
    preparacao = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS registros (
          colecao    text        NOT NULL,
          id         text        NOT NULL,
          dados      jsonb       NOT NULL,
          criado_em  timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (colecao, id)
        )
      `
      // A ordem das telas é sempre "mais novo primeiro". Sem este índice, cada
      // listagem varre a tabela inteira pra ordenar.
      await sql`
        CREATE INDEX IF NOT EXISTS registros_colecao_criado_em
        ON registros (colecao, criado_em DESC)
      `
    })().catch((erro) => {
      // Falhou a preparação, esquece a promessa: a próxima requisição tenta de
      // novo em vez de herdar o erro pra sempre.
      preparacao = null
      throw erro
    })
  }
  return preparacao
}

/** Devolve a conexão já com a tabela garantida, ou `null` se não tem banco. */
async function pronto() {
  const sql = conexao()
  if (!sql) return null
  await preparar(sql)
  return sql
}

type Linha = { colecao: string; id: string; dados: unknown }

function montar(linhas: Linha[]): Dados {
  const dados: Dados = { clientes: [], pedidos: [], agendamentos: [] }
  for (const linha of linhas) {
    if (linha.colecao === "clientes") dados.clientes.push(linha.dados as Cliente)
    else if (linha.colecao === "pedidos") dados.pedidos.push(linha.dados as Pedido)
    else if (linha.colecao === "agendamentos") dados.agendamentos.push(linha.dados as Agendamento)
  }
  return dados
}

export async function lerTudo(): Promise<Dados | null> {
  const sql = await pronto()
  if (!sql) return null
  const linhas = (await sql`
    SELECT colecao, id, dados FROM registros ORDER BY criado_em DESC
  `) as Linha[]
  return montar(linhas)
}

export async function inserir(colecao: Colecao, item: { id: string }): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    INSERT INTO registros (colecao, id, dados)
    VALUES (${colecao}, ${item.id}, ${JSON.stringify(item)}::jsonb)
    ON CONFLICT (colecao, id) DO UPDATE SET dados = EXCLUDED.dados
  `
}

/**
 * Aplica um patch parcial sem trazer o registro pra cá primeiro.
 *
 * O `||` do jsonb funde os dois objetos dentro do banco, numa ida só. Ler,
 * mesclar em JavaScript e gravar de volta seriam duas idas com uma janela no
 * meio onde outra aba poderia gravar por cima.
 */
export async function atualizar(
  colecao: Colecao,
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    UPDATE registros
    SET dados = dados || ${JSON.stringify(patch)}::jsonb
    WHERE colecao = ${colecao} AND id = ${id}
  `
}

export async function remover(colecao: Colecao, id: string): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`DELETE FROM registros WHERE colecao = ${colecao} AND id = ${id}`

  // Apagar um cliente apaga o que dependia dele. A regra é a mesma do
  // `removerCliente` do store, e ela mora nos dois lugares porque cada um pode
  // ser o único ligado. Um dia isso vira chave estrangeira com ON DELETE
  // CASCADE, e aí o banco passa a garantir sozinho.
  if (colecao === "clientes") {
    await sql`
      DELETE FROM registros
      WHERE colecao IN ('pedidos', 'agendamentos')
        AND dados ->> 'clienteId' = ${id}
    `
  }
}

/**
 * Troca todo o conteúdo de uma vez, numa transação.
 *
 * É o que está por trás de "restaurar exemplos" e "limpar tudo" na tela de
 * configurações. Apagar e inserir em duas idas soltas deixaria o banco vazio se
 * a segunda falhasse; dentro da transação, ou troca inteiro ou não troca.
 */
export async function substituirTudo(dados: Dados): Promise<void> {
  const sql = await pronto()
  if (!sql) return

  const linhas: Array<[Colecao, string, string]> = []
  for (const colecao of COLECOES) {
    for (const item of dados[colecao] as Array<{ id: string }>) {
      linhas.push([colecao, item.id, JSON.stringify(item)])
    }
  }

  await sql.transaction((tx) => [
    tx`DELETE FROM registros`,
    ...linhas.map(
      ([colecao, id, corpo]) => tx`
        INSERT INTO registros (colecao, id, dados)
        VALUES (${colecao}, ${id}, ${corpo}::jsonb)
      `
    ),
  ])
}

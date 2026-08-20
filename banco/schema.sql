-- =============================================================================
-- O QUE O APP CRIA SOZINHO NO NEON
-- =============================================================================
--
-- Você NÃO precisa rodar este arquivo. Na primeira vez que o app fala com o
-- banco, ele executa exatamente isto (veja `preparar()` em src/lib/banco.ts).
-- O arquivo existe pra você poder LER o desenho sem caçar dentro do código, e
-- pra rodar na mão se um dia quiser recriar o banco do zero.
--
-- Como rodar na mão, se quiser: abra o SQL Editor no painel do Neon
-- (https://console.neon.tech), cole tudo e execute.
-- =============================================================================

CREATE TABLE IF NOT EXISTS registros (
  colecao    text        NOT NULL,   -- 'clientes', 'pedidos', 'agendamentos'
  id         text        NOT NULL,   -- o mesmo id que o app já usa (cli-a1b2c3)
  dados      jsonb       NOT NULL,   -- o registro inteiro, do jeito que a tela lê
  criado_em  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (colecao, id)
);

CREATE INDEX IF NOT EXISTS registros_colecao_criado_em
  ON registros (colecao, criado_em DESC);


-- =============================================================================
-- O PRÓXIMO DESENHO, QUANDO VOCÊ QUISER IR ALÉM
-- =============================================================================
--
-- Uma tabela com jsonb aguenta o app inteiro e sobrevive a você renomear as
-- entidades. O que ela não te dá é o banco conferindo as suas regras: hoje nada
-- impede um pedido apontar pra um cliente que não existe, e "somar o valor de
-- todos os pedidos atrasados" vira uma consulta feia.
--
-- Quando fizer sentido trocar, o desenho é este. Repare no que ele ganha: o
-- REFERENCES não deixa pedido órfão existir, o ON DELETE CASCADE apaga os
-- filhos sozinho (hoje isso é código nosso, em dois lugares), e cada campo
-- ganha tipo de verdade, então valor vira número e prazo vira data.
--
-- CREATE TABLE clientes (
--   id          text PRIMARY KEY,
--   nome        text NOT NULL,
--   email       text NOT NULL,
--   telefone    text NOT NULL DEFAULT '',
--   empresa     text NOT NULL DEFAULT '',
--   status      text NOT NULL DEFAULT 'ativo',
--   observacoes text NOT NULL DEFAULT '',
--   criado_em   timestamptz NOT NULL DEFAULT now()
-- );
--
-- CREATE TABLE pedidos (
--   id         text PRIMARY KEY,
--   titulo     text NOT NULL,
--   cliente_id text NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
--   etapa      text NOT NULL DEFAULT 'novo',
--   valor      numeric(12,2) NOT NULL DEFAULT 0,
--   prioridade text NOT NULL DEFAULT 'media',
--   prazo      date,
--   descricao  text NOT NULL DEFAULT '',
--   criado_em  timestamptz NOT NULL DEFAULT now()
-- );
--
-- CREATE TABLE agendamentos (
--   id          text PRIMARY KEY,
--   titulo      text NOT NULL,
--   cliente_id  text NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
--   data        date NOT NULL,
--   hora        time NOT NULL,
--   duracao_min integer NOT NULL DEFAULT 60,
--   status      text NOT NULL DEFAULT 'ativo',
--   local       text NOT NULL DEFAULT ''
-- );

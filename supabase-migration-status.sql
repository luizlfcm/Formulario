-- Rode isso no SQL Editor do Supabase para adicionar os novos campos
-- à tabela "briefings" que você já criou.

alter table briefings add column if not exists status text default 'pendente';
alter table briefings add column if not exists observacao_interna text;
alter table briefings add column if not exists site_publicado text;

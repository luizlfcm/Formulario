create table briefings (
  id uuid default gen_random_uuid() primary key,

  -- Bloco 1: Identificação
  nome_cliente text not null,
  email_cliente text not null,
  telefone text,

  -- Bloco 2: Produto
  nome_produto text,
  whatsapp_contato text,
  link_checkout text,
  tipo_produto text,
  promessa text,
  problema_dor text,
  publico_alvo text,
  preco text,

  -- Bloco 3: Prova
  tem_depoimentos boolean,
  resultados_numeros text,
  credenciais text,

  -- Bloco 4: Oferta
  oferta_inclusa text,
  garantia text,
  tem_escassez boolean,
  escassez_desc text,

  -- Bloco 5: Hospedagem
  tem_hospedagem boolean,
  hospedagem_login_senha text,
  quer_contratar_hospedagem boolean,

  -- Bloco 6: Pixel
  tem_pixel boolean,
  pixel_info text,

  -- Bloco 7: Copy
  status_copy text,
  copy_texto text,

  -- Bloco 8: Visual
  link_vsl text,
  cores_preferencia text,
  referencia_pagina text,
  estilo_layout text,
  quer_contagem_regressiva boolean,
  quer_faq boolean,

  -- Bloco 9: Fechamento
  order_bumps text[],
  observacao_extra text,

  created_at timestamp with time zone default now()
);

# Webmap — instalação no WordPress com Elementor

Este pacote mantém o mapa, as funcionalidades e a identidade visual da versão final. A adaptação é somente de integração.

## A regra principal

**Não cole o conteúdo de `index.html` no widget HTML do Elementor.** O `index.html` é uma página completa e deve ser aberto isoladamente pelo servidor. No Elementor entra apenas um `iframe` apontando para a URL pública dessa página.

## Passo a passo

1. No servidor, crie uma pasta exclusiva, por exemplo:

   `/webmaps/usinas-ne/`

2. Extraia **todo o conteúdo deste ZIP** dentro dela. A estrutura deve ficar assim:

   - `/webmaps/usinas-ne/index.html`
   - `/webmaps/usinas-ne/assets/mapa.css`
   - `/webmaps/usinas-ne/assets/mapa.js`
   - `/webmaps/usinas-ne/assets/integracao.js`
   - `/webmaps/usinas-ne/assets/images/...`

   Não coloque os arquivos soltos na pasta geral do WordPress e não envie somente o `index.html`.

3. Teste primeiro a URL direta no navegador:

   `https://SEU-DOMINIO.com.br/webmaps/usinas-ne/index.html`

   O mapa precisa funcionar nessa URL antes de abrir o Elementor. Se não funcionar, abra:

   `https://SEU-DOMINIO.com.br/webmaps/usinas-ne/diagnostico.html`

4. Abra `COLE_NO_ELEMENTOR.html`, troque somente a URL de `src=` pela URL pública confirmada no passo 3 e copie o bloco inteiro.

5. No Elementor, arraste o widget **HTML** para o ponto da reportagem e cole o bloco. Em **Layout**, deixe a largura do contêiner em 100%. Atualize a página e, se houver cache, limpe o cache do WordPress/CDN.

## Código mínimo do Elementor

```html
<div style="width:100%;height:clamp(640px,85svh,900px);position:relative;overflow:hidden;">
  <iframe
    title="Mapa interativo das usinas solares do Nordeste"
    src="https://SEU-DOMINIO.com.br/webmaps/usinas-ne/index.html"
    loading="eager"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    style="display:block;width:100%;height:100%;border:0;"
  ></iframe>
</div>
```

O endereço deve usar `https://`. Não use caminho de disco, URL de pré-visualização do painel, shortcode ou o endereço da pasta sem confirmar que ele abre o `index.html`.

## Se o iframe ficar vazio

- Se a URL direta do `index.html` também estiver vazia: verifique `diagnostico.html`, permissões e se a estrutura de pastas foi preservada.
- Se a URL direta funcionar, mas o iframe não: o servidor provavelmente envia `X-Frame-Options: DENY/SAMEORIGIN` ou uma CSP com `frame-ancestors` incompatível. Como o mapa e a reportagem devem estar no mesmo domínio, permita o próprio domínio como ancestral do frame.
- Se aparecer aviso de conteúdo misto: a reportagem está em HTTPS e a URL do iframe ou algum redirecionamento está em HTTP. Use HTTPS em tudo.
- Se a versão antiga continuar aparecendo: limpe cache do plugin de desempenho, cache do servidor/CDN e cache do navegador.
- Se apenas o mapa-base falhar: revise a CSP. O pacote usa Leaflet em `unpkg.com`, fontes Google e mosaicos de mapa via HTTPS. As fotografias dos complexos estão hospedadas localmente no próprio pacote.

## Requisitos do servidor

- servir `.html`, `.css`, `.js`, `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` e `.json` com MIME types corretos;
- não bloquear o `index.html` em iframe no domínio da reportagem;
- permitir `https://unpkg.com` em `script-src` e `style-src`;
- permitir `https://fonts.googleapis.com` em `style-src` e `https://fonts.gstatic.com` em `font-src`;
- permitir em `img-src` o próprio domínio (`'self'`), `data:` e o servidor HTTPS dos mosaicos do mapa-base.

## Fotografias e atribuições

Todas as 63 feições possuem uma fotografia local em `assets/images/`. A fonte, o arquivo, o tipo de correspondência e eventuais ressalvas estão documentados em `atribuicao_imagens_complexos.xlsx` e `atribuicao_imagens.json`.

## O que foi preservado

`index.html`, `assets/mapa.css`, `assets/mapa.js`, `assets/integracao.js`, dados, imagens, comportamento responsivo e design do mapa permanecem iguais à versão final recebida. Os arquivos adicionados servem apenas para instalação, teste e diagnóstico no WordPress/Elementor.

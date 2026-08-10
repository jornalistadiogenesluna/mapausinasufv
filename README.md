# Mapa interativo das usinas solares do Nordeste

Webmap estático integrante de uma reportagem. Esta versão está preparada para publicação no GitHub Pages e também pode ser incorporada em WordPress/Elementor por `iframe`.

## Publicar no GitHub Pages

1. Crie um repositório vazio no GitHub.
2. Envie **o conteúdo desta pasta para a raiz do repositório**. O arquivo `index.html` deve permanecer na raiz.
3. Use a branch `main`.
4. No GitHub, abra **Settings → Pages**.
5. Em **Build and deployment → Source**, selecione **GitHub Actions**.
6. Abra a aba **Actions** e aguarde a execução “Publicar webmap no GitHub Pages”.

A URL publicada seguirá este formato:

```text
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

Todos os caminhos internos são relativos, portanto o mapa funciona no subdiretório criado pelo GitHub Pages.

## Testar antes do envio

Não abra `index.html` diretamente pelo Explorador de Arquivos. Sirva a pasta com um servidor HTTP local. Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000/`.

## Inserir no Elementor

Após confirmar que a URL do GitHub Pages abre o mapa completo, use um widget **HTML** do Elementor:

```html
<div style="width:100%;height:clamp(640px,85svh,900px);position:relative;overflow:hidden;">
  <iframe
    title="Mapa interativo das usinas solares do Nordeste"
    src="https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/"
    loading="eager"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    style="display:block;width:100%;height:100%;border:0;"
  ></iframe>
</div>
```

O widget recebe apenas o `iframe`; não cole o conteúdo integral do `index.html` no Elementor.

## Estrutura principal

- `index.html`: entrada do webmap.
- `assets/mapa.css`: identidade visual e responsividade.
- `assets/mapa.js`: dados e interatividade.
- `assets/images/`: fotografias locais dos complexos.
- `atribuicao_imagens_complexos.xlsx`: planilha de atribuição das imagens.
- `atribuicao_imagens.json`: registro estruturado das atribuições.
- `.github/workflows/deploy-pages.yml`: publicação automática.
- `.nojekyll`: impede processamento desnecessário pelo Jekyll.

## Fonte dos dados

[Sistema de Informações de Geração da ANEEL (SIGA)](https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel).

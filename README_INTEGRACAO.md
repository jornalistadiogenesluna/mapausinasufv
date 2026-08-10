# Webmap interativo das usinas solares do Nordeste

## Entrega

Este diretorio e o pacote estatico final do mapa. O arquivo de entrada e
`index.html`. Publique o diretorio inteiro no mesmo dominio da reportagem,
mantendo a estrutura de arquivos.

O arquivo `mapa_interativo_usinasne_final.zip`, gerado ao lado deste diretorio,
contem a mesma estrutura pronta para transferencia e extracao no servidor.

A versao `mapa_interativo_usinasne_v3.html` e seu gerador nao foram alterados.
O pacote final foi produzido a partir dessa versao validada, incorporando as
geometrias de `complexos_final.gpkg` e as usinas geradoras de
`usinasufvNeagosto2026.gpkg`. A relacao usa exclusivamente a chave `cod_ceg`
definida nos projetos QGIS de calculo e design.

## Integracao recomendada

Use um `iframe`. O isolamento evita conflitos entre Leaflet, estilos do mapa e
o CSS ou JavaScript do site jornalistico.

```html
<section class="reportagem-webmap" aria-label="Mapa interativo das usinas solares do Nordeste">
  <iframe
    id="mapa-usinas-ne"
    title="Mapa interativo das usinas solares do Nordeste"
    src="/caminho-publico/mapa_interativo_usinasne_final/index.html"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</section>
```

```css
.reportagem-webmap {
  position: relative;
  width: 100%;
  height: clamp(640px, 85svh, 900px);
  margin: 32px 0;
}

.reportagem-webmap iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 760px) {
  .reportagem-webmap {
    height: 100svh;
    min-height: 520px;
    margin: 20px 0;
  }
}

@media (max-height: 560px) and (orientation: landscape) {
  .reportagem-webmap {
    height: 100svh;
    min-height: 360px;
  }
}
```

O arquivo `exemplo_integracao.html` demonstra esse encaixe e pode ser usado em
homologacao. Ele nao precisa ser publicado na versao de producao.

## Comportamento responsivo

Em larguras de ate 760 px, os paineis funcionam como folhas inferiores e
respeitam a area segura do dispositivo. Os controles `-` e `+` recolhem ou
expandem o conteudo, liberando a area do mapa para os toques nos estados e nas
usinas. O botao `x` continua executando o retorno entre os niveis 3, 2 e 1.

Em celulares na horizontal, o painel ocupa a lateral direita e o mapa permanece
visivel a esquerda. Em desktop, os controles de recolhimento ficam ocultos e o
layout validado da v3 e preservado.

## Comunicacao opcional com a reportagem

O mapa envia mensagens `postMessage` com `source: "mapa-usinas-ne"`:

- `mapa-usinas-ne:ready`: mapa carregado;
- `mapa-usinas-ne:levelchange`: mudanca entre os niveis 1, 2 e 3;
- `mapa-usinas-ne:resize`: altura interna disponivel.

A pagina hospedeira pode solicitar o retorno ao nivel inicial:

```js
document.getElementById('mapa-usinas-ne').contentWindow.postMessage(
  { source: 'reportagem-host', type: 'mapa-usinas-ne:reset' },
  window.location.origin
);
```

Para restringir as mensagens ao dominio da reportagem, informe a origem como
parametro codificado na URL do iframe:

```html
src="/caminho-publico/mapa_interativo_usinasne_final/index.html?parentOrigin=https%3A%2F%2Fwww.exemplo.com.br"
```

## Requisitos do servidor

- servir `.html`, `.css`, `.js`, `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` e `.json` com os MIME types corretos;
- nao enviar `X-Frame-Options: DENY` para `index.html`;
- em CSP, permitir o proprio dominio no `frame-src` da reportagem;
- para os recursos do mapa, permitir HTTPS em `img-src` e os dominios registrados em `manifest.json`;
- permitir `https://unpkg.com` em `script-src` e `style-src`;
- permitir `https://fonts.googleapis.com` em `style-src` e `https://fonts.gstatic.com` em `font-src`.

O basemap Google Satellite exige conexao com a internet. As fotografias e os
dados vetoriais estao incorporados no pacote. Os creditos das imagens estao no
`manifest.json` e em `assets/images/fontesDasImagens.txt`.

## Atualizacao do pacote

Execute na pasta `geopackage`:

```powershell
python gerar_pacote_webmap_final.py
```

O gerador usa somente a biblioteca padrao do Python. Ele publica os 63
complexos consolidados e registra a auditoria da relacao com as 317 usinas em
`assets/data/complexos_fotovoltaicos.json`. Registros sem `cod_ceg` permanecem
explicitamente documentados e nao sao associados por aproximacao nominal.
Antes da publicacao, confira
`manifest.json`, `CHECKSUMS.sha256` e abra `exemplo_integracao.html` em um
servidor HTTP local.

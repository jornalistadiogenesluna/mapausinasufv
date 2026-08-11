(() => {
  'use strict';

  const SOURCE = 'mapa-usinas-ne';
  const params = new URLSearchParams(window.location.search);
  const parentOrigin = params.get('parentOrigin') || '*';
  let ultimoNivel = null;
  let ultimaAltura = null;

  function nivelAtual() {
    const painelStory = document.getElementById('painel-story');
    const painel = document.getElementById('painel');
    if (painel && painel.classList.contains('visivel')) {
      return painel.classList.contains('detalhe') ? 3 : 2;
    }
    return painelStory && !painelStory.classList.contains('oculto') ? 1 : 1;
  }

  function atualizarIndicadorContinuidade(elemento) {
    if (!elemento) return;
    const interfaceMobile = window.matchMedia('(max-width: 760px)').matches;
    const recolhido = elemento.classList.contains('painel-story-recolhido')
      || elemento.classList.contains('painel-recolhido');
    const restante = elemento.scrollHeight - elemento.clientHeight - elemento.scrollTop;
    elemento.classList.toggle('tem-continuidade', interfaceMobile && !recolhido && restante > 6);
  }

  function atualizarIndicadoresContinuidade() {
    atualizarIndicadorContinuidade(document.getElementById('painel-story'));
    atualizarIndicadorContinuidade(document.getElementById('painel'));
  }

  function enviar(type, detail = {}) {
    if (window.parent === window) return;
    window.parent.postMessage({ source: SOURCE, type, ...detail }, parentOrigin);
  }

  function informarEstado() {
    const level = nivelAtual();
    if (level !== ultimoNivel) {
      if (level > 1) definirPainelUsinaRecolhido(false);
      ultimoNivel = level;
      enviar('mapa-usinas-ne:levelchange', { level });
    }

    const height = Math.ceil(document.documentElement.getBoundingClientRect().height);
    if (height !== ultimaAltura) {
      ultimaAltura = height;
      enviar('mapa-usinas-ne:resize', { height });
    }
    atualizarIndicadoresContinuidade();
  }

  function origemPermitida(event) {
    return parentOrigin === '*' || event.origin === parentOrigin;
  }

  function configurarPainelEditorialMobile() {
    const painelStory = document.getElementById('painel-story');
    if (!painelStory || painelStory.querySelector('.story-toggle')) return;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'story-toggle';
    botao.textContent = '−';
    botao.title = 'Recolher painel editorial';
    botao.setAttribute('aria-label', 'Recolher painel editorial');
    botao.setAttribute('aria-expanded', 'true');
    botao.addEventListener('click', (event) => {
      event.stopPropagation();
      const recolhido = painelStory.classList.toggle('painel-story-recolhido');
      botao.textContent = recolhido ? '+' : '−';
      botao.title = recolhido ? 'Expandir painel editorial' : 'Recolher painel editorial';
      botao.setAttribute('aria-label', botao.title);
      botao.setAttribute('aria-expanded', String(!recolhido));
      informarEstado();
    });
    painelStory.prepend(botao);
  }

  function definirPainelUsinaRecolhido(recolhido) {
    const painel = document.getElementById('painel');
    const botao = painel?.querySelector('.painel-toggle');
    if (!painel || !botao) return;
    painel.classList.toggle('painel-recolhido', recolhido);
    botao.textContent = recolhido ? '+' : '−';
    botao.title = recolhido ? 'Expandir painel' : 'Recolher painel';
    botao.setAttribute('aria-label', botao.title);
    botao.setAttribute('aria-expanded', String(!recolhido));
  }

  function configurarPainelUsinaMobile() {
    const painel = document.getElementById('painel');
    const topo = painel?.querySelector('.painel-topo');
    const fechar = document.getElementById('fechar-painel');
    if (!painel || !topo || !fechar || topo.querySelector('.painel-toggle')) return;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'painel-toggle';
    botao.addEventListener('click', (event) => {
      event.stopPropagation();
      definirPainelUsinaRecolhido(!painel.classList.contains('painel-recolhido'));
      informarEstado();
    });
    topo.insertBefore(botao, fechar);
    definirPainelUsinaRecolhido(false);
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!origemPermitida(event) || !data || data.source !== 'reportagem-host') return;
    if (data.type === 'mapa-usinas-ne:reset' && typeof window.irParaInicio === 'function') {
      window.irParaInicio(true);
      informarEstado();
    }
  });

  configurarPainelEditorialMobile();
  configurarPainelUsinaMobile();

  document.getElementById('painel-story')?.addEventListener('scroll', atualizarIndicadoresContinuidade, { passive: true });
  document.getElementById('painel')?.addEventListener('scroll', atualizarIndicadoresContinuidade, { passive: true });

  const estadoTimer = window.setInterval(informarEstado, 250);
  window.addEventListener('resize', informarEstado, { passive: true });
  window.addEventListener('pagehide', () => window.clearInterval(estadoTimer), { once: true });

  informarEstado();
  enviar('mapa-usinas-ne:ready', { version: '3.0.1', level: nivelAtual() });
})();

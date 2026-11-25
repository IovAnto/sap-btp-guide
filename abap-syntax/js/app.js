/**
 * ABAP Sintassi & Semantica — Manuale Tecnico del Linguaggio
 * Controller per la navigazione gerarchica, ricerca istantanea e lettura continua (unrolled)
 */

(function () {
  'use strict';

  // State
  const state = {
    dataset: window.ABAP_SYNTAX || null,
    activeCategory: 'DATA_DEF',
    searchQuery: '',
    expandedCategories: new Set([
      'DATA_DEF', 'ASSIGN_STRING', 'SQL_ACCESS', 'ITAB_OPS',
      'CONSTRUCTORS', 'POINTERS', 'CONTROL_FLOW', 'DEBUG_TRACE',
      'PRINT_LIST', 'SELECTION_SCREEN', 'MODULARIZATION', 'MEMORY_PARAM', 'ERROR_MESSAGE'
    ]),
    theme: localStorage.getItem('abap-wiki-theme') || 'dark'
  };

  // DOM Elements
  const el = {
    searchInput: document.getElementById('search-input'),
    tocNav: document.getElementById('toc-nav'),
    manualContainer: document.getElementById('manual-container'),
    footerCount: document.getElementById('footer-count'),
    themeBtn: document.getElementById('theme-btn'),
    readingScroll: document.getElementById('reading-scroll'),
    inspectorModal: document.getElementById('inspector-modal'),
    modalBadge: document.getElementById('modal-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalBody: document.getElementById('modal-body')
  };

  /**
   * Theme Controller (synchronized with abap-wiki and portal)
   */
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeBtn();

    el.themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('abap-wiki-theme', state.theme);
      updateThemeBtn();
    });
  }

  function updateThemeBtn() {
    el.themeBtn.textContent = state.theme === 'dark' ? 'Tema: Dark' : 'Tema: Light';
  }

  /**
   * Initialize Data
   */
  function initData() {
    if (!state.dataset || !state.dataset.categories) return;

    const totalConstructs = state.dataset.constructs ? state.dataset.constructs.length : 0;
    el.footerCount.textContent = `${totalConstructs} Costrutti ABAP`;

    renderTOC();
    renderCategoryChapter(state.activeCategory);
  }

  /**
   * Render Table of Contents (TOC)
   */
  function renderTOC() {
    if (!state.dataset) return;

    const q = state.searchQuery.toLowerCase().trim();
    el.tocNav.innerHTML = '';

    state.dataset.categories.forEach(cat => {
      // Find constructs for this category
      const allCategoryConstructs = state.dataset.constructs.filter(c => c.category === cat.id);
      let matchingConstructs = allCategoryConstructs;

      if (q) {
        matchingConstructs = allCategoryConstructs.filter(c => {
          const nameMatch = c.name.toLowerCase().includes(q);
          const synMatch = c.syntax.toLowerCase().includes(q);
          const textMatch = c.shortText && c.shortText.toLowerCase().includes(q);
          const semMatch = c.semantic && c.semantic.toLowerCase().includes(q);
          const gotchaMatch = c.gotchas && c.gotchas.toLowerCase().includes(q);
          const tagsMatch = c.tags && c.tags.some(t => t.toLowerCase().includes(q));
          return nameMatch || synMatch || textMatch || semMatch || gotchaMatch || tagsMatch;
        });

        if (matchingConstructs.length === 0 && !cat.name.toLowerCase().includes(q)) {
          return; // Skip category if nothing matches
        }

        state.expandedCategories.add(cat.id);
      }

      const isCatExpanded = state.expandedCategories.has(cat.id);
      const isCatActive = (state.activeCategory === cat.id);

      const catGroup = document.createElement('div');
      catGroup.className = 'toc-cat-group';

      const catTitle = document.createElement('div');
      catTitle.className = `toc-cat-title ${isCatActive ? 'active' : ''}`;
      catTitle.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
          <span class="toc-arrow ${isCatExpanded ? 'expanded' : ''}" data-toggle-cat="${escapeHtml(cat.id)}">▶</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent);">${escapeHtml(cat.number)}.</span>
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(cat.name)}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${matchingConstructs.length}</span>
      `;

      catTitle.addEventListener('click', (e) => {
        if (e.target.dataset.toggleCat) {
          if (state.expandedCategories.has(cat.id)) {
            state.expandedCategories.delete(cat.id);
          } else {
            state.expandedCategories.add(cat.id);
          }
          renderTOC();
          return;
        }

        state.expandedCategories.add(cat.id);
        selectCategory(cat.id);
      });

      catGroup.appendChild(catTitle);

      // Render nested constructs
      if (isCatExpanded && matchingConstructs.length > 0) {
        const constructList = document.createElement('div');
        constructList.className = 'toc-construct-list';

        matchingConstructs.forEach(c => {
          const item = document.createElement('a');
          item.className = 'toc-construct-link';

          let miniBadgeClass = 'cls';
          let miniBadgeText = 'CLS';
          if (c.status === 'deprecated') {
            miniBadgeClass = 'dep';
            miniBadgeText = 'DEP';
          } else if (c.status === 'modern') {
            miniBadgeClass = 'mod';
            miniBadgeText = 'MOD';
          }

          item.innerHTML = `
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(c.name.split('(')[0].trim())}</span>
            <span class="toc-mini-badge ${miniBadgeClass}">${miniBadgeText}</span>
          `;

          item.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToConstruct(cat.id, c.id);
          });

          constructList.appendChild(item);
        });

        catGroup.appendChild(constructList);
      }

      el.tocNav.appendChild(catGroup);
    });
  }

  /**
   * Select and Render Category Chapter
   */
  function selectCategory(catId) {
    state.activeCategory = catId;
    closeInspector();
    renderTOC();
    renderCategoryChapter(catId);
    el.readingScroll.scrollTop = 0;
  }

  /**
   * Scroll smoothly directly to a specific construct
   */
  function scrollToConstruct(catId, constructId) {
    closeInspector();
    if (state.activeCategory !== catId) {
      state.activeCategory = catId;
      renderCategoryChapter(catId);
    }
    renderTOC();

    setTimeout(() => {
      const target = document.getElementById(`construct-${constructId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 2000);
      }
    }, 50);
  }

  /**
   * Render Category Chapter (Unrolled continuous reading)
   */
  function renderCategoryChapter(catId) {
    if (!state.dataset) return;
    const cat = state.dataset.categories.find(c => c.id === catId);
    if (!cat) return;

    const constructs = state.dataset.constructs.filter(c => c.category === catId);

    let html = `
      <!-- Category Header -->
      <div class="category-header">
        <div class="category-number-tag">CATEGORIA ${escapeHtml(cat.number)} — ${escapeHtml(cat.id)}</div>
        <h1 class="category-title">${escapeHtml(cat.name)}</h1>
        <p class="category-desc">${escapeHtml(cat.description)}</p>
      </div>

      <!-- Section 1: Panoramica Sintetica della Categoria -->
      <h2 class="manual-h2">1. Panoramica Sintetica (${constructs.length} Costrutti)</h2>
      <p class="manual-p">Tabella di consultazione rapida. Clicca sul nome di un costrutto per scorrere direttamente alla sua trattazione dettagliata:</p>
      
      <div class="syntax-summary-box">
        <table class="syntax-summary-table">
          <thead>
            <tr>
              <th style="width: 220px;">Costrutto</th>
              <th style="width: 140px;">Stato</th>
              <th>Definizione & Ruolo Operativo</th>
            </tr>
          </thead>
          <tbody>
            ${constructs.map(c => {
              let badgeCls = 'classic';
              if (c.status === 'deprecated') badgeCls = 'deprecated';
              if (c.status === 'modern') badgeCls = 'modern';

              return `
                <tr>
                  <td>
                    <span class="link-construct" onclick="window.ABAP_SYNTAX_APP.scrollToConstruct('${escapeHtml(cat.id)}', '${escapeHtml(c.id)}')">
                      ${escapeHtml(c.name)}
                    </span>
                  </td>
                  <td>
                    <span class="badge-status ${badgeCls}">${escapeHtml(c.statusBadge)}</span>
                  </td>
                  <td style="color: var(--text-main); font-size: 0.85rem;">
                    ${escapeHtml(c.shortText)}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: Dettaglio Completo dei Costrutti (Unrolled) -->
      <h2 class="manual-h2">2. Dettaglio Tecnico & Semantica dei Singoli Costrutti</h2>
      <p class="manual-p">Specifiche formali, semantica di esecuzione passo-passo, trappole d'esame, casi limite ed esempi compilabili:</p>
    `;

    constructs.forEach((c, idx) => {
      let badgeCls = 'classic';
      if (c.status === 'deprecated') badgeCls = 'deprecated';
      if (c.status === 'modern') badgeCls = 'modern';

      html += `
        <div class="construct-chapter" id="construct-${escapeHtml(c.id)}">
          
          <div class="construct-head-row">
            <div class="construct-head-title">
              <span style="font-family: var(--font-mono); color: var(--accent); font-size: 0.9rem;">#${idx + 1}</span>
              <span>${escapeHtml(c.name)}</span>
            </div>
            <span class="badge-status ${badgeCls}">${escapeHtml(c.statusBadge)}</span>
          </div>

          <!-- Syntax Signature Box -->
          <div class="syntax-sig-box">${escapeHtml(c.syntax)}</div>

          <!-- Description & Semantic -->
          <p class="manual-p" style="font-size: 0.98rem; font-weight: 600; color: var(--text-title); margin-bottom: 6px;">
            ${escapeHtml(c.shortText)}
          </p>
          <p class="manual-p">
            ${escapeHtml(c.semantic)}
          </p>

          <!-- Deprecation Alert Box & Clean ABAP Alternative -->
          ${c.whyDeprecated ? `
            <div class="deprec-box">
              <strong>⚠️ Perché è Deprecato:</strong><br>
              ${escapeHtml(c.whyDeprecated)}
            </div>
          ` : ''}

          ${c.modernEquivalent ? `
            <div class="modern-box">
              <strong>💡 Alternativa Moderna (Clean ABAP):</strong><br>
              ${escapeHtml(c.modernEquivalent)}
            </div>
          ` : ''}

          <!-- Gotchas & Pitfalls Alert Box -->
          ${c.gotchas ? `
            <div class="gotcha-box">
              <strong>⚡ Insidie & Casi Limite (Runtime Gotchas):</strong><br>
              ${escapeHtml(c.gotchas)}
            </div>
          ` : ''}

          <!-- System Fields -->
          ${c.systemFields && c.systemFields.length > 0 && c.systemFields[0] !== 'Nessuno' ? `
            <div class="sysfields-strip">
              <span>Campi di sistema influenzati:</span>
              ${c.systemFields.map(sf => `<code>${escapeHtml(sf)}</code>`).join(' ')}
            </div>
          ` : ''}

          <!-- Code Example Box -->
          ${c.exampleCode ? `
            <div class="code-header-bar">
              <span>Esempio Pratico Compilabile</span>
              <button class="btn-copy-code" onclick="window.ABAP_SYNTAX_APP.copySnippet(${escapeHtml(JSON.stringify(c.exampleCode))})">Copia Codice</button>
            </div>
            <pre class="manual-code-box"><code>${escapeHtml(c.exampleCode)}</code></pre>
          ` : ''}

        </div>
      `;
    });

    el.manualContainer.innerHTML = html;
  }

  /**
   * Inspector Modal (Detail sheet)
   */
  function inspectConstruct(constructId) {
    if (!state.dataset) return;
    const construct = state.dataset.constructs.find(c => c.id === constructId);
    if (!construct) return;

    el.modalTitle.textContent = construct.name;
    el.modalBadge.textContent = construct.statusBadge;

    let html = `
      <div style="margin-bottom: 14px;">
        <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-title); margin-bottom: 4px;">Firma Sintattica</h3>
        <div class="syntax-sig-box" style="margin: 4px 0 12px 0;">${escapeHtml(construct.syntax)}</div>
        <p class="manual-p">${escapeHtml(construct.semantic)}</p>
      </div>

      ${construct.whyDeprecated ? `
        <div class="deprec-box">
          <strong>Perché è Deprecato:</strong><br>
          ${escapeHtml(construct.whyDeprecated)}
        </div>
      ` : ''}

      ${construct.modernEquivalent ? `
        <div class="modern-box">
          <strong>Equivalente Moderno:</strong><br>
          ${escapeHtml(construct.modernEquivalent)}
        </div>
      ` : ''}

      ${construct.gotchas ? `
        <div class="gotcha-box">
          <strong>Insidie:</strong><br>
          ${escapeHtml(construct.gotchas)}
        </div>
      ` : ''}

      ${construct.exampleCode ? `
        <div class="code-header-bar" style="margin-top: 14px;">
          <span>Esempio di Codice</span>
          <button class="btn-copy-code" onclick="window.ABAP_SYNTAX_APP.copySnippet(${escapeHtml(JSON.stringify(construct.exampleCode))})">Copia</button>
        </div>
        <pre class="manual-code-box"><code>${escapeHtml(construct.exampleCode)}</code></pre>
      ` : ''}
    `;

    el.modalBody.innerHTML = html;
    el.inspectorModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeInspector() {
    if (!el.inspectorModal) return;
    el.inspectorModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Clipboard Helper
   */
  function copySnippet(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Codice copiato negli appunti!');
    }).catch(() => {
      showToast('Codice copiato!');
    });
  }

  function showToast(text) {
    let toast = document.getElementById('syntax-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'syntax-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Event Listeners
   */
  function initEvents() {
    let searchDebounce;
    el.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = e.target.value;
        renderTOC();
      }, 100);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeInspector();
      } else if (e.key === '/' && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
        el.searchInput.select();
      }
    });

    if (el.modalCloseBtn) {
      el.modalCloseBtn.addEventListener('click', closeInspector);
    }

    if (el.inspectorModal) {
      el.inspectorModal.addEventListener('click', (e) => {
        if (e.target === el.inspectorModal) {
          closeInspector();
        }
      });
    }
  }

  // Public API
  window.ABAP_SYNTAX_APP = {
    selectCategory,
    scrollToConstruct,
    inspectConstruct,
    copySnippet,
    closeInspector
  };

  // Bootstrap
  initTheme();
  initEvents();
  initData();

})();

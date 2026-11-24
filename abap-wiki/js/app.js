/**
 * ABAP Data Dictionary Wiki — Minimal Technical Documentation Script
 * Ispirato allo stile e all'architettura di SAP BTP Master Guide
 */

(function () {
    'use strict';

    const state = {
        dictionary: window.ABAP_DICTIONARY || null,
        activeTable: 'VBRK',
        searchQuery: '',
        theme: localStorage.getItem('abap-wiki-theme') || 'dark'
    };

    const el = {
        searchInput: document.getElementById('search-input'),
        sidebarNav: document.getElementById('sidebar-nav'),
        docContainer: document.getElementById('doc-container'),
        footerCount: document.getElementById('footer-count'),
        themeBtn: document.getElementById('theme-btn')
    };

    /**
     * Theme Controller
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
     * Initialize Application Data
     */
    function initData() {
        if (!state.dictionary || !state.dictionary.tables) return;

        el.footerCount.textContent = `${state.dictionary.tables.length} Tabelle DDIC`;
        renderSidebar();
        renderTable(state.activeTable);
    }

    /**
     * Render Sidebar Navigation
     */
    function renderSidebar() {
        if (!state.dictionary) return;

        const q = state.searchQuery.toLowerCase().trim();
        const moduleMap = {};

        state.dictionary.modules.forEach(m => {
            moduleMap[m.id] = { ...m, tables: [] };
        });

        state.dictionary.tables.forEach(table => {
            const modId = table.module || 'SD';
            if (!moduleMap[modId]) {
                moduleMap[modId] = { id: modId, name: modId, description: '', tables: [] };
            }

            // Search filter
            if (!q) {
                moduleMap[modId].tables.push(table);
            } else {
                const matchTable = table.tableName.toLowerCase().includes(q) ||
                                   (table.shortText && table.shortText.toLowerCase().includes(q));
                const matchField = table.fields && table.fields.some(f => 
                    f.fieldname.toLowerCase().includes(q) ||
                    (f.shortText && f.shortText.toLowerCase().includes(q)) ||
                    (f.dataElement && f.dataElement.name.toLowerCase().includes(q)) ||
                    (f.examples && f.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)))
                );

                if (matchTable || matchField) {
                    moduleMap[modId].tables.push(table);
                }
            }
        });

        el.sidebarNav.innerHTML = '';

        Object.values(moduleMap).forEach(mod => {
            if (mod.tables.length === 0) return;

            const groupTitle = document.createElement('div');
            groupTitle.className = 'nav-group-title';
            groupTitle.textContent = `${mod.id} — ${mod.name}`;
            el.sidebarNav.appendChild(groupTitle);

            mod.tables.forEach(tbl => {
                const navItem = document.createElement('a');
                navItem.className = `nav-item ${state.activeTable === tbl.tableName ? 'active' : ''}`;
                navItem.href = `#${tbl.tableName}`;
                navItem.innerHTML = `
                    <div style="display: flex; align-items: center; overflow: hidden;">
                        <span class="nav-item-name">${escapeHtml(tbl.tableName)}</span>
                        <span class="nav-item-desc">${escapeHtml(tbl.shortText || '')}</span>
                    </div>
                    <span class="nav-dot"></span>
                `;

                navItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    selectTable(tbl.tableName);
                });

                el.sidebarNav.appendChild(navItem);
            });
        });
    }

    /**
     * Select & Display a Table
     */
    function selectTable(tableName) {
        state.activeTable = tableName;
        renderSidebar();
        renderTable(tableName);
        
        // Scroll reading area to top
        const scrollArea = document.querySelector('.reading-scroll');
        if (scrollArea) scrollArea.scrollTop = 0;
    }

    /**
     * Render Complete Table Document (Minimal & Rich in Content)
     */
    function renderTable(tableName) {
        if (!state.dictionary) return;
        const table = state.dictionary.tables.find(t => t.tableName === tableName);
        if (!table) {
            el.docContainer.innerHTML = `<div class="empty-view">Tabella ${escapeHtml(tableName)} non trovata.</div>`;
            return;
        }

        const keys = table.mainKey ? table.mainKey.join(', ') : 'MANDT';
        const mod = state.dictionary.modules.find(m => m.id === table.module) || { name: table.module };

        let html = `
            <div class="doc-header">
                <div class="doc-part">Modulo ${escapeHtml(table.module)} — ${escapeHtml(mod.name)}</div>
                <div class="doc-title">${escapeHtml(table.tableName)}</div>
                <p class="doc-p" style="font-size: 1.05rem; margin-bottom: 12px;"><strong>${escapeHtml(table.shortText)}</strong></p>
                <div class="doc-meta">
                    <span class="doc-meta-item">Chiave Primaria: <strong>${escapeHtml(keys)}</strong></span>
                    <span class="doc-meta-item">Categoria: <strong>${escapeHtml(table.tableCategory || 'TRANSP')}</strong></span>
                    <span class="doc-meta-item">Classe di consegna: <strong>${escapeHtml(table.deliveryClass || 'A')}</strong></span>
                    <span class="doc-meta-item">Totale Campi: <strong>${table.fields ? table.fields.length : 0}</strong></span>
                </div>
            </div>

            <!-- German Etymology Quote -->
            ${table.germanEtymology ? `
                <div class="doc-quote">
                    <strong>Etimologia Tedesca:</strong> <em>${escapeHtml(table.germanEtymology)}</em><br>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(table.description || '')}</span>
                </div>
            ` : ''}

            <!-- Quick Table Declarations -->
            <div class="snippet-action-bar">
                <span><code>DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}.</code> <span style="color: var(--text-muted);">" Singola Riga (Struttura)</span></span>
                <button class="btn-snippet-copy" onclick="copyCode('DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}.')">Copia</button>
            </div>
            <div class="snippet-action-bar" style="margin-top: 4px;">
                <span><code>DATA lt_${table.tableName.toLowerCase()} TYPE TABLE OF ${table.tableName.toLowerCase()}.</code> <span style="color: var(--text-muted);">" Tabella Interna (Elenco Righe)</span></span>
                <button class="btn-snippet-copy" onclick="copyCode('DATA lt_${table.tableName.toLowerCase()} TYPE TABLE OF ${table.tableName.toLowerCase()}.')">Copia</button>
            </div>
        `;

        // Relationships Section
        if (table.relationships && table.relationships.length > 0) {
            html += `
                <h2 class="doc-section-h2">Relazioni Strutturali con altre Tabelle SAP</h2>
                <p class="doc-p">Come questa tabella si connette alle altre tabelle standard del flusso aziendale:</p>
                <div class="rel-grid">
            `;
            table.relationships.forEach(rel => {
                html += `
                    <div class="rel-row">
                        <span class="rel-target-link" onclick="window.ABAP_WIKI.navigate('${escapeHtml(rel.targetTable)}')">${escapeHtml(rel.targetTable)}</span>
                        <code class="doc-code">${escapeHtml(rel.foreignKey)}</code>
                        <span style="color: var(--text-muted); font-size: 0.82rem;">— ${escapeHtml(rel.description)}</span>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Fields Hierarchical Tree View with Rich Real Examples
        html += `
            <h2 class="doc-section-h2">
                <span>Campi & Modello Dati ad Albero</span>
                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: none; font-weight: 400;">Tree: Tabella → Colonna → Data Element → Dominio</span>
            </h2>
            <p class="doc-p">Dettaglio approfondito di ogni colonna con il rispettivo Elemento Dati, Dominio e <strong>valori reali ammessi dal business</strong>:</p>
        `;

        if (table.fields && table.fields.length > 0) {
            table.fields.forEach(field => {
                const elem = field.dataElement || {};
                const dom = elem.domain || {};
                const domType = dom.dataType ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : 'N/A';
                const isKey = field.isKey;

                html += `
                    <div class="field-card" id="field-${escapeHtml(field.fieldname)}">
                        <div class="field-card-header">
                            <div class="field-title-group">
                                <span class="field-pos">#${field.position || '—'}</span>
                                <span class="field-name-mono">${escapeHtml(field.fieldname)}</span>
                                ${isKey ? '<span class="badge-key">PRIMARY KEY</span>' : ''}
                                ${field.germanName ? `<span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">(${escapeHtml(field.germanName)})</span>` : ''}
                            </div>
                            <span class="badge-type-mono">${escapeHtml(domType)}</span>
                        </div>

                        <div class="field-card-body">
                            <!-- Hierarchical Tree Path -->
                            <div class="field-tree-path">
                                <span>Albero DDIC:</span>
                                <span>Tabella <strong class="tree-tag">${escapeHtml(table.tableName)}</strong></span>
                                <span>→</span>
                                <span>Colonna <strong class="tree-tag">${escapeHtml(field.fieldname)}</strong></span>
                                <span>→</span>
                                <span>Data Element <strong class="tree-tag">${escapeHtml(elem.name || field.fieldname)}</strong></span>
                                <span>→</span>
                                <span>Dominio <strong class="tree-tag">${escapeHtml(dom.name || 'N/A')}</strong></span>
                            </div>

                            <p class="field-desc-text">
                                <strong>${escapeHtml(field.shortText || '')}</strong>
                                ${field.businessMeaning ? `<br><span style="color: var(--text-muted); font-size: 0.88rem;">${escapeHtml(field.businessMeaning)}</span>` : ''}
                            </p>

                            <!-- Rich Real-World Examples Box -->
                            ${field.examples && field.examples.length > 0 ? `
                                <div class="examples-container">
                                    <div class="examples-header">
                                        <span>Valori & Esempi Reali di Business (${escapeHtml(field.fieldname)})</span>
                                    </div>
                                    <ul class="example-list">
                                        ${field.examples.map(ex => `
                                            <li class="example-item">
                                                <span class="example-code">${escapeHtml(ex.code)}</span>
                                                <span class="example-desc">${escapeHtml(ex.desc)}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}

                            <!-- Snippet for this single field -->
                            <div class="snippet-action-bar">
                                <span>Dichiarazione: <code>DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.</code></span>
                                <button class="btn-snippet-copy" onclick="copyCode('DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.')">Copia</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Real ABAP SQL Query Example
        html += `
            <h2 class="doc-section-h2">Esempio Pratico di Query ABAP (Modern SQL)</h2>
            <p class="doc-p">Esempio concreto di codice ABAP per interrogare ed estrarre i dati da questa tabella in memoria:</p>
            <div class="doc-blueprint-box">
<span class="com">* Interrogazione moderna su ${table.tableName} con dichiarazione inline</span>
<span class="kw">SELECT</span> ${table.fields.slice(0, 5).map(f => f.fieldname.toLowerCase()).join(', ')}
  <span class="kw">FROM</span> <span class="tbl">${table.tableName.toLowerCase()}</span>
  <span class="kw">WHERE</span> mandt = @sy-mandt
  <span class="kw">ORDER BY</span> ${table.fields.find(f => f.isKey && f.fieldname !== 'MANDT')?.fieldname.toLowerCase() || 'vbeln'}
  <span class="kw">INTO TABLE</span> @<span class="kw">DATA</span>(lt_${table.tableName.toLowerCase()})
  <span class="kw">UP TO</span> 50 <span class="kw">ROWS</span>.

<span class="kw">IF</span> sy-subrc = 0.
  <span class="kw">LOOP AT</span> lt_${table.tableName.toLowerCase()} <span class="kw">ASSIGNING FIELD-SYMBOL</span>(&lt;ls_row&gt;).
    <span class="com">" Elaborazione record...</span>
  <span class="kw">ENDLOOP</span>.
<span class="kw">ENDIF</span>.
            </div>
        `;

        el.docContainer.innerHTML = html;
    }

    /**
     * Copy Code to Clipboard
     */
    window.copyCode = function (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiato: ' + text);
        }).catch(() => {
            showToast('Copiato: ' + text);
        });
    };

    /**
     * Minimal Toast Notification
     */
    function showToast(text) {
        let toast = document.getElementById('wiki-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'wiki-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                background-color: var(--accent);
                color: #ffffff;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 0.82rem;
                font-family: var(--font-mono);
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: opacity 0.2s ease;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.style.opacity = '1';
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2200);
    }

    /**
     * Helper to escape HTML
     */
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
     * Initialize Events
     */
    function initEvents() {
        let debounceTimer;
        el.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                state.searchQuery = e.target.value;
                renderSidebar();
            }, 120);
        });

        // Keyboard shortcut /
        window.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== el.searchInput) {
                e.preventDefault();
                el.searchInput.focus();
                el.searchInput.select();
            }
        });
    }

    // Public API for in-page navigation links
    window.ABAP_WIKI = {
        navigate: (tableName) => selectTable(tableName)
    };

    // Bootstrap
    initTheme();
    initEvents();
    initData();

})();

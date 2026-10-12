// @versione 2026-10-09.1 | prova_estetica_unita.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  PROVA ESTETICA DEL BOTTONE DELL'UNITA` — da approvare (Paolo, 8-9 ottobre)
// ----------------------------------------------------------------------------
//  File di PROVA. Non lo carica l'app vera: lo carica solo app_PROVA.html,
//  DOPO tutti gli altri script (anche dopo lo script della pagina, dove nasce
//  window.rigaUnitaConFoto). Non modifica nessun file esistente: sostituisce,
//  nella sola pagina di prova, il disegno di window.rigaUnitaConFoto. Se Paolo
//  approva, il disegno passa in app.html; se no, si butta questo file.
//
//  Perche` basta sostituire UNA funzione: tutti gli elenchi di unita` la
//  usano gia` (roster reattivo, elenco attivo, bersagli, ARO, secondari dello
//  Speculativo, Intuitivo, Scoprire, Piazzamento). Stessa firma, stesse
//  opzioni: chi la chiama non se ne accorge.
//
//  Il disegno segue il fac simile di Paolo (claude/ESTETICA_BOTTONI_standby.md):
//   - un TONDO grande a sinistra, a cavallo delle due righe, con la FOTO
//     della miniatura (window.fotoUnita); senza foto, la sigla del tipo;
//   - riga ALTA piena nel colore della fazione: il NOME dell'unita`;
//   - riga BASSA piu` scura e piu` stretta, rientrata dopo il tondo: il
//     SOPRANNOME, e a DESTRA le ICONE DEGLI STATI (Paolo, 9 ottobre: a
//     destra, come nel fac simile);
//   - SCELTA: riga del nome piu` chiara e contorno luminoso nel colore della
//     fazione;
//   - PanOceania nei suoi blu.
//  I colori di base vengono da window.COLORI_FAZIONE (app.html); le tinte
//  della riga alta e bassa sono SOLO di questa prova: se si approva, vanno
//  accanto a COLORI_FAZIONE, non restano scritte qui.
// ============================================================================
(function (G) {
    'use strict';
    if (typeof G.rigaUnitaConFoto !== 'function' || !G.COLORI_FAZIONE) {
        console.error('prova_estetica_unita.js: app.html non caricata prima di questo file (manca window.rigaUnitaConFoto).');
        return;
    }
    const ORIGINALE = G.rigaUnitaConFoto;

    // Le tinte della prova, una fazione per riga.
    //   alta / altaScelta   fondo della riga del nome, normale e scelta
    //   bassa               fondo della riga del soprannome
    //   luce                contorno luminoso della riga scelta
    //   tondo               bordo del tondo con la foto
    const TINTE = {
        NOMADI:     { alta: '#a80000', altaScelta: '#e02424', bassa: '#3a0000', luce: '#ff6a6a', tondo: G.COLORI_FAZIONE.NOMADI.bordo },
        PANOCEANIA: { alta: '#005f94', altaScelta: '#168fcf', bassa: '#00263b', luce: '#7fe3ff', tondo: G.COLORI_FAZIONE.PANOCEANIA.bordo }
    };

    function stile() {
        if (!G.document || typeof G.document.createElement !== 'function' || !G.document.head) return;
        if (G.document.getElementById && G.document.getElementById('stile-riga-unita-prova') &&
            G.document.getElementById('stile-riga-unita-prova').tagName) return;
        const s = G.document.createElement('style');
        s.id = 'stile-riga-unita-prova';
        // Le icone degli stati le disegna window.generaIconeStati con stili
        // in linea grandi (45px): qui si rimpiccioliscono con !important,
        // senza toccare quella funzione.
        s.textContent = `
            .riga-unita-prova { position:relative; display:block; width:100%; min-height:98px; margin:0 0 12px; padding:0;
                background:transparent !important; border:0 !important; box-shadow:none; text-align:left; cursor:pointer;
                -webkit-tap-highlight-color:transparent; transition:transform .12s ease; }
            .riga-unita-prova:active { transform:scale(0.985); }
            .riga-unita-prova .rup-tondo { position:absolute; left:0; top:50%; transform:translateY(-50%); width:88px; height:88px;
                border-radius:50%; overflow:hidden; background:#000; border:3px solid var(--rup-tondo); z-index:3;
                display:flex; align-items:center; justify-content:center; box-sizing:border-box; }
            .riga-unita-prova .rup-tondo img { width:100%; height:100%; object-fit:cover; }
            .riga-unita-prova .rup-sigla { color:#ccc; font-family:'Teko',sans-serif; font-size:28px; }
            .riga-unita-prova .rup-alta { position:relative; margin-left:30px; padding:8px 12px 8px 68px; min-height:46px;
                background:var(--rup-alta); border-radius:10px; color:#fff; font-family:'Teko',sans-serif; font-size:25px;
                font-weight:bold; line-height:1.05; z-index:2; display:flex; align-items:center; box-sizing:border-box; }
            .riga-unita-prova .rup-bassa { position:relative; margin:-4px 8px 0 94px; padding:8px 8px 6px 12px; min-height:38px;
                background:var(--rup-bassa); border-radius:0 0 10px 10px; display:flex; align-items:center; gap:8px; z-index:1;
                box-sizing:border-box; }
            .riga-unita-prova .rup-testo { flex:1; min-width:0; }
            .riga-unita-prova .rup-alias { color:#e6e6e6; font-style:italic; font-size:16px; }
            .riga-unita-prova .rup-icone { display:flex; flex-wrap:wrap; justify-content:flex-end; align-items:center; gap:2px; max-width:55%; }
            .riga-unita-prova .rup-icone img { width:30px !important; height:30px !important; margin:0 !important; }
            .riga-unita-prova .rup-icone span { font-size:20px !important; margin:0 !important; }
            .riga-unita-prova[data-scelta="si"] .rup-alta { background:var(--rup-alta-scelta);
                box-shadow:0 0 0 2px var(--rup-luce), 0 0 16px var(--rup-luce); }
            .riga-unita-prova[data-scelta="si"] .rup-tondo { box-shadow:0 0 14px var(--rup-luce); }
        `;
        G.document.head.appendChild(s);
    }

    // Di quale fazione e` la riga. Senza opz.fazione e` una truppa PROPRIA:
    // cosi` la chiamano gli elenchi del proprio roster e degli ARO.
    function fazioneDi(opz) {
        if (opz.fazione === 'NEMICA') return G.fazioneNemica();
        if (opz.fazione === 'NOMADI' || opz.fazione === 'PANOCEANIA') return opz.fazione;
        return G.fazionePropria();
    }

    // Chi chiama esprime "scelta" in due modi: opz.scelta (bersagli,
    // secondari, Intuitivo) oppure, nel roster attivo, passando lo sfondo
    // della selezione SENZA fazione ne` id. Questa prova li legge tutti e due:
    // non si cambia chi chiama per una prova.
    function sceltaDi(opz) {
        if (opz.scelta === true) return true;
        return opz.sfondo !== undefined && opz.id === undefined && opz.fazione === undefined;
    }

    // Il bordo passato a mano dice qualcosa che va tenuto: TRATTEGGIATO =
    // non attivabile o morto; azzurro = Punta di Lancia; arancio = scelto
    // per il Coordinato. Il rosso generico della pagina non dice niente.
    function bordoDi(opz) {
        const b = String(opz.bordo || '');
        if (!b || /var\(--nomad-red\)/.test(b)) return '';
        const colore = (b.match(/#[0-9a-fA-F]{3,6}/) || [])[0];
        if (!colore) return '';
        if (/dashed/.test(b)) return `outline:2px dashed ${colore}; outline-offset:2px;`;
        return `box-shadow:0 0 0 2px ${colore}, 0 0 12px ${colore};`;
    }

    G.rigaUnitaConFoto = function (u, opz) {
        opz = opz || {};
        stile();
        const f = fazioneDi(opz);
        const t = TINTE[f] || TINTE.NOMADI;
        const s = (u && u.states) || {};
        const morto = !!u && u.state === 'DEAD';
        const opacita = opz.opacita || (morto ? '0.35' : (s.unconscious ? '0.6' : '1'));
        const scelta = sceltaDi(opz);

        const nomePuro = G.nomeInElenco(u);
        let nome = (opz.nome !== undefined) ? opz.nome : (morto ? `<s>${nomePuro}</s>` : nomePuro);
        if (opz.dopoNome) nome += opz.dopoNome;
        if (s.fireteam) nome += ` <span style="color:#9ff; font-size:15px;">[ TEAM ${s.fireteam} ]</span>`;
        const alias = (u && u.alias && u.alias !== nomePuro) ? `<div class="rup-alias">"${u.alias}"</div>` : '';
        const destra = (opz.destra !== undefined) ? opz.destra : G.generaIconeStati(u);

        const foto = G.fotoUnita(u);
        const sigla = String((u && u.tipo) || '').slice(0, 3) || '?';
        const tondo = foto
            ? `<img src="${foto}" alt="" onerror="this.outerHTML='<span class=&quot;rup-sigla&quot;>${sigla}</span>';">`
            : `<span class="rup-sigla">${sigla}</span>`;

        const variabili = `--rup-alta:${t.alta}; --rup-alta-scelta:${t.altaScelta}; --rup-bassa:${t.bassa}; --rup-luce:${t.luce}; --rup-tondo:${t.tondo};`;
        return `
                    <button ${opz.id ? `id="${opz.id}" ` : ''}type="button" class="huge-btn riga-unita riga-unita-prova" data-fazione="${f}" data-scelta="${scelta ? 'si' : 'no'}"
                        style="${variabili} opacity:${opacita};"
                        ${opz.attributi || ''}
                        oncontextmenu="return false;">
                        <div class="rup-tondo">${tondo}</div>
                        <div class="rup-alta" style="${bordoDi(opz)}">${nome}</div>
                        <div class="rup-bassa">
                            <div class="rup-testo">${alias}${opz.sotto || ''}</div>
                            <div class="rup-icone">${destra}</div>
                        </div>
                    </button>
                `;
    };
    G.rigaUnitaConFoto.originale = ORIGINALE;

    // L'elenco degli ARO accende la scelta cambiando lo stile del bottone
    // (logica_aro.js, toggleAroUnit): col bottone trasparente di questa prova
    // si colorerebbe il riquadro intorno, non la riga. Qui, solo nella prova,
    // dopo il suo tocco si riporta il bottone trasparente e si accende la
    // riga nel modo della prova.
    if (typeof G.toggleAroUnit === 'function') {
        const tocco = G.toggleAroUnit;
        G.toggleAroUnit = function (id) {
            const esito = tocco.apply(this, arguments);
            const btn = G.document && G.document.getElementById(`aro-btn-${id}`);
            if (btn && btn.style) { btn.style.background = 'transparent'; btn.style.borderColor = 'transparent'; }
            const scelto = (G.selectedAroUnits || []).indexOf(id) >= 0;
            if (btn && typeof btn.setAttribute === 'function') btn.setAttribute('data-scelta', scelto ? 'si' : 'no');
            else if (btn) btn.datasetScelta = scelto ? 'si' : 'no';
            return esito;
        };
    }

    console.log('🎨 prova_estetica_unita.js: bottone dell\'unita` in prova.');
})(typeof window !== 'undefined' ? window : globalThis);


// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'prova_estetica_unita.js', versione: '2026-10-09.1', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

// @versione 2026-10-08.1 | prova_estetica_armi.js | proprieta`: chat MOTORE
// ============================================================================
//  PROVA ESTETICA DEI BOTTONI DELLE ARMI — da approvare (Paolo, 8 ottobre)
// ----------------------------------------------------------------------------
//  File di PROVA: non e` caricato dall'app vera. Lo carica solo la pagina di
//  prova (app_PROVA.html), DOPO tutti gli altri script. Non modifica nessun
//  file esistente: aggiunge M.bottoneArma e ridisegna, nella sola pagina di
//  prova, l'elenco delle armi dell'Attacco BS. Se Paolo approva, il disegno
//  passa nel motore e lo usano tutti i moduli; se no, si butta questo file.
//
//  Il disegno segue il fac simile di Paolo (claude/facsimile_bottoni_armi.html):
//   - banda alta grigio scuro, angoli tagliati: NOME dell'arma e a destra
//     un'etichetta per ogni MUNIZIONE (AP, DA, EXP...);
//   - banda bassa grigio chiaro, rientrata: la striscia delle GITTATE, celle
//     raggruppate dove il MOD non cambia (sopra la distanza, sotto il MOD:
//     verde se positivo, grigio a 0, giallo a -3, rosso da -6);
//   - Sagoma Diretta: al posto delle gittate la scritta della Sagoma;
//     Sagoma Circolare: le gittate e in piu` l'etichetta della Sagoma;
//   - a sinistra l'immagine dell'arma, UNA PER TIPO (non per munizione ne`
//     per modalita`): img/armi/<nome_base>.png. Se il file manca, sparisce.
//   - il colore della FAZIONE sta sul bordo e sulle pieghe degli angoli.
//   - nessuno stato "scelto" (scelta di Paolo): solo l'effetto al tocco.
// ============================================================================
(function (G) {
    const M = G.MotoreN5;
    if (!M) { console.error('prova_estetica_armi.js: motore non caricato.'); return; }

    // Il nome dell'immagine: il nome base dell'arma, senza modalita` ne`
    // notazioni. "MULTI Sniper Rifle (AP Mode) (+1SD)" -> multi_sniper_rifle.
    // Il TIPO, non la munizione (Paolo, 8 ottobre): "AP Heavy Machine Gun"
    // usa l'immagine della Heavy Machine Gun, "Shock Mine" quella della Mine.
    const PREFISSI_MUNIZIONE = /^(AP|BREAKER|K1|SHOCK|T2|VIRAL|PARA|E\/M|SMOKE|ECLIPSE)\s+/i;
    M.nomeImmagineArma = function (nome) {
        let n = String(nome || '').replace(/\([^)]*\)/g, ' ').trim();
        while (PREFISSI_MUNIZIONE.test(n)) n = n.replace(PREFISSI_MUNIZIONE, '');
        return n.toLowerCase().replace(/mines\b/, 'mine').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    };

    // Le bande da 8" raggruppate dove il MOD resta uguale: [{fino, mod}].
    M.gittateRaggruppate = function (bande) {
        const out = [];
        (bande || []).forEach(function (b) {
            const m = /(\d+)\s*-\s*(\d+)/.exec(String(b.label || ''));
            if (!m) return;
            const fino = parseInt(m[2], 10);
            if (out.length && out[out.length - 1].mod === b.mod) out[out.length - 1].fino = fino;
            else out.push({ fino: fino, mod: b.mod });
        });
        return out;
    };

    // Colori delle munizioni: solo per la prova. Se si approva, vanno nel
    // catalogo (un fatto, un campo), non restano scritti qui.
    const COLORE_MUNIZIONE = {
        N: '#b0b8c6', AP: '#ff6600', DA: '#ff0055', EXP: '#ff3333', SHOCK: '#ffcc00',
        'E/M': '#33aaff', T2: '#cc66ff', FIRE: '#ff7733', PARA: '#66ffcc', STUN: '#99ccff',
        VIRAL: '#66ff66', PLASMA: '#ff66ff', K1: '#ffffff', ADH: '#cccc66', SMOKE: '#999999',
        ECLIPSE: '#7777aa', NANOTECH: '#66dddd', BREAKER: '#ffaa00'
    };
    function coloreMunizione(a) {
        const k = String(a || '').toUpperCase().replace(/\s+/g, '');
        return COLORE_MUNIZIONE[k] || '#b0b8c6';
    }
    function coloreMod(mod) {
        if (mod > 0) return { fondo: '#3f9a44', testo: '#ffffff' };
        if (mod === 0) return { fondo: '#5a6475', testo: '#ffffff' };
        if (mod === -3) return { fondo: '#ffb300', testo: '#000000' };
        return { fondo: '#e53935', testo: '#ffffff' };
    }

    // Lo stile, una volta sola.
    function inserisciStile() {
        if (!G.document || G.document.getElementById('stile-bottone-arma')) return;
        const s = G.document.createElement('style');
        s.id = 'stile-bottone-arma';
        s.innerHTML = `
            .bottone-arma { position:relative; display:block; width:100%; margin:0 0 18px; padding:0; background:none; border:0; cursor:pointer; text-align:left; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6)); transition:transform .15s ease; font-family:'Teko',sans-serif; }
            .bottone-arma:active { transform:scale(0.98); }
            .bottone-arma .ba-alta { position:relative; margin-right:20px; min-height:74px; padding:10px 16px 38px 92px; box-sizing:border-box; display:flex; justify-content:space-between; align-items:flex-start; gap:8px; background:#1f242d; border:1px solid #4f5866;
                clip-path:polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px); }
            .bottone-arma .ba-piega { position:absolute; width:15px; height:15px; }
            .bottone-arma .ba-nome { flex:1 1 auto; min-width:0; overflow-wrap:anywhere; font-size:26px; font-weight:700; color:#fff; text-transform:uppercase; line-height:.95; letter-spacing:1px; text-shadow:0 2px 4px rgba(0,0,0,.5); }
            .bottone-arma .ba-burst { display:block; font-family:'Share Tech Mono',monospace; font-size:14px; color:#b0b8c6; letter-spacing:0; text-transform:none; margin-top:4px; }
            .bottone-arma .ba-mun { flex:0 0 auto; display:flex; flex-wrap:wrap; gap:4px; justify-content:flex-end; max-width:40%; }
            .bottone-arma .ba-tag { font-size:19px; font-weight:700; padding:0 7px; border-radius:3px; line-height:1.15; letter-spacing:1px; border:1px solid; }
            .bottone-arma .ba-bassa { position:relative; margin:-32px 0 0 72px; padding:6px 10px 6px 12px; background:#3a4150; border:1px solid #5a6475; border-radius:0 8px 8px 8px; box-shadow:0 4px 10px rgba(0,0,0,.4); }
            .bottone-arma .ba-strip { display:grid; gap:4px; text-align:center; }
            .bottone-arma .ba-cella { display:flex; flex-direction:column; border-radius:3px; overflow:hidden; border:1px solid rgba(0,0,0,.3); }
            .bottone-arma .ba-dist { background:#1f242d; color:#b0b8a6; font-family:'Share Tech Mono',monospace; font-size:11px; padding:1px 0; }
            .bottone-arma .ba-mod { font-size:17px; font-weight:700; padding:1px 0; }
            .bottone-arma .ba-sagoma { color:#fff; font-size:19px; letter-spacing:1px; text-align:center; padding:2px 0; }
            .bottone-arma .ba-img { position:absolute; left:-4px; top:6px; width:86px; height:52px; object-fit:contain; filter:drop-shadow(0 4px 8px rgba(0,0,0,.9)); z-index:5; }
        `;
        (G.document.head || G.document.body).appendChild(s);
    }

    // Il bottone. `p` e` il profilo dell'arma (M.profiloArma); `o.attributi`
    // gli attributi del <button> (onclick...); `o.colore` il colore della
    // fazione che usa l'app.
    M.bottoneArma = function (p, o) {
        o = o || {};
        inserisciStile();
        const colore = o.colore || '#cc0000';
        const munizioni = (p.ammoOpzioni && p.ammoOpzioni.length ? p.ammoOpzioni : [p.ammo || 'N']);
        const tag = munizioni.map(function (a) {
            const c = coloreMunizione(a);
            return `<span class="ba-tag" style="color:${c}; border-color:${c}; background:${c}26;">${a}</span>`;
        }).join('');
        const tpl = p.isTemplate ? M.regoleTemplate(p) : null;
        const diretta = !!(tpl && tpl.tipo === 'DIRETTO');
        let bassa;
        if (diretta) {
            bassa = `<div class="ba-sagoma">SAGOMA DIRETTA${p.template ? ' · ' + String(p.template).replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase() : ''}</div>`;
        } else {
            const celle = M.gittateRaggruppate(p.bands);
            bassa = `<div class="ba-strip" style="grid-template-columns:repeat(${Math.max(1, celle.length)}, minmax(0,1fr));">` +
                celle.map(function (c) {
                    const k = coloreMod(c.mod);
                    return `<div class="ba-cella"><span class="ba-dist">${c.fino}"</span><span class="ba-mod" style="background:${k.fondo}; color:${k.testo};">${c.mod > 0 ? '+' + c.mod : c.mod}</span></div>`;
                }).join('') + `</div>`;
            if (tpl) bassa += `<div class="ba-sagoma" style="font-size:15px; margin-top:3px;">+ SAGOMA CIRCOLARE</div>`;
        }
        const img = 'img/armi/' + M.nomeImmagineArma(p.nome) + '.png';
        // Il nome grande e` quello base; la modalita` va nella riga piccola.
        const base = String(p.nome || '').replace(/\s*\([^)]*\)/g, '').trim();
        const modo = (String(p.nome || '').match(/\(([^)]*)\)/g) || []).map(s => s.slice(1, -1)).join(' · ');
        return `<button type="button" class="bottone-arma" ${o.attributi || ''}>
            <img class="ba-img" src="${img}" alt="" onerror="this.style.display='none';">
            <div class="ba-alta" style="border-color:${colore};">
                <span class="ba-piega" style="top:0; left:0; background:${colore}; clip-path:polygon(0 15px,15px 0,15px 15px);"></span>
                <span class="ba-piega" style="top:0; right:0; background:${colore}; clip-path:polygon(0 0,15px 15px,0 15px);"></span>
                <span class="ba-piega" style="bottom:0; right:0; background:${colore}; clip-path:polygon(0 15px,15px 0,0 0);"></span>
                <div class="ba-nome">${base}<span class="ba-burst">${modo ? modo + ' · ' : ''}B${p.burst}</span></div>
                <div class="ba-mun">${tag}</div>
            </div>
            <div class="ba-bassa">${bassa}</div>
        </button>`;
    };

    // ATTACCO BS, solo nella pagina di prova: lo stesso elenco di
    // ordine_attacco_bs.js (stesse armi, stessi scarti, stesso nome grezzo
    // passato a declareAttackBS), cambia solo il bottone.
    const vecchio = G.startUnitAllocationLoopBS;
    G.startUnitAllocationLoopBS = function () {
        if (typeof vecchio !== 'function') return;
        vecchio.apply(this, arguments);
        const container = G.document.getElementById('weapon-buttons-container');
        if (!container) return;
        const unita = G.coordUnits[G.coordIndex];
        const coloreF = (G.COLORI_FAZIONE && G.fazionePropria && G.COLORI_FAZIONE[G.fazionePropria()]) || {};
        const profili = [];
        M.dividiLista(unita.weapon).forEach(function (nome) {
            let v = M.variantiArma(nome);
            if (v.length === 0) { const p = M.profiloArma(nome); if (p.nonTrovata) return; v = [p]; }
            v.forEach(function (p) { if (!p.isCC && !profili.some(x => x.nome === p.nome)) profili.push(p); });
        });
        // I bottoni vecchi si sostituiscono uno a uno, nello stesso ordine:
        // intestazione e riquadro degli scarti restano quelli del modulo.
        const html = container.innerHTML;
        let i = 0;
        container.innerHTML = html.replace(/<button class="huge-btn"[^>]*onclick="window\.declareAttackBS\('((?:[^'\\]|\\.)*)'\)"[^>]*>[\s\S]*?<\/button>/g, function (tutto, nomeEsc) {
            const p = profili[i++];
            if (!p) return tutto;
            return M.bottoneArma(p, { colore: coloreF.bordo, attributi: `onclick="window.declareAttackBS('${nomeEsc}')"` });
        });
    };
})(typeof window !== 'undefined' ? window : globalThis);

// @versione 2026-09-14.2 | ordine_fuoco_speculativo.js | proprieta`: chat MOTORE
// ==========================================
// ☄️ FUOCO SPECULATIVO (N5) - ordine_fuoco_speculativo.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Tre errori della versione precedente (verificati sulla wiki N5.2):
//
//  1. FILTRO ARMI SBAGLIATO. Cercava GRENADE o LAUNCHER nel nome, e così
//     offriva Missile Launcher, Heavy Rocket Launcher e Adhesive Launcher
//     Rifle — nessuno dei quali ha il Tratto "Speculative Attack". Il
//     requisito è il Tratto, non la parola nel nome.
//
//  2. LE GRANATE TIRANO SU PH, NON SU BS. Hanno il Tratto "BS Weapon (PH)".
//     Il modulo mandava tutto all'Hub come tiro BS.
//
//  3. IL -6 NON È L'UNICA COSA CHE CAMBIA. Lo Speculativo ignora anche
//     Mimetismo e Copertura, cosa che né la schermata né il payload dicevano.
//     Ma i MOD di gittata SI applicano — ed è la differenza chiave con
//     l'Attacco Intuitivo, dove invece non si applica nulla.
//
// Limite noto: i Tratti d'arma stanno in catalogo_n5.js perché
// RULES_WEAPONS non ha un campo traits. Le voci dedotte sono segnalate.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il Fuoco Speculativo non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#cc00ff', sfondo: '#330033' };

    window.avviaFaseSpeculativo = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        window.currentOrder.isLongSkill = true;   // Long Skill: Ordine Intero
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        // 🔴 NON si ramifica su `isSecondHalf`: la seconda metà salta la
        // scelta dell'arma e dei bersagli solo se la prima metà era essa
        // stessa un attacco dello stesso tipo. Partendo da un Movimento —
        // il caso più comune al tavolo — arma e bersagli non ci sono, e si
        // arrivava ai modificatori con weapon undefined.
        const _M = window.MotoreN5;
        const ripresa = _M
            ? _M.riprendiOrdineDaFinestra(actionId, isSecondHalf)
            : { riprende: false, motivo: 'motore non caricato' };
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.pendingTargets = [];
            window.startUnitSpeculativoLoop();
        } else {
            window.preparaModificatoriSpeculativo();
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA
    // ==============================================================
    window.startUnitSpeculativoLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const container = document.getElementById('weapon-buttons-container');
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">☄️ FUOCO SPECULATIVO</b><br>
            <span style="font-size:14px; color:#ccc;">Ordine Intero · Non richiede LoF · -6 fisso · Burst 1</span>
        </div>`;

        const esito = M.armiSpeculative(unita);

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">❌ Nessuna arma col Tratto "Speculative Attack".</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const attr = M.attributoArma(p, M.AZIONI.SPECULATIVO);
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.declareSpeculativoAttack('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${COL.bordo}; font-size:14px;">Tira su ${attr.attributo} | ${p.ammoOpzioni.join('/')} | Burst 1</span>
                </button>`;
            });
        }

        // Le armi escluse col motivo: prima sparivano o, peggio, comparivano a torto.
        if (esito.escluse.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non utilizzabili per il Fuoco Speculativo:</b><br>` +
                esito.escluse.map(x => `• <b>${x.nome}</b> — ${x.motivo}`).join('<br>') + `</div>`;
        }
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">
                ⚠️ ${esito.avvisi[0].messaggio}</div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareSpeculativoAttack = function (nomeArma) {
        window.currentOrder.weapon = nomeArma;
        window.setupTargetSelectionSpeculativo();
    };

    // ==============================================================
    // 2. BERSAGLIO PRINCIPALE
    // ==============================================================
    window.setupTargetSelectionSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];

        const nemici = M.rosterNemico();
        if (nemici.length === 0) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        // Lo Speculativo non richiede LoF: i Marker sono bersagli validi,
        // ed è proprio uno degli usi tipici (evita Mimetismo e Copertura).
        const giudizi = M.bersagliValidi(M.AZIONI.SPECULATIVO, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        if (window.validTargets.length === 0) {
            alert('❌ Nessun bersaglio valido.\n\n' + window.targetsScartati.map(t => `• ${t.nome}: ${t.motivo}`).join('\n'));
            return window.goToStep('step-weapon');
        }

        if (window.renderTargetButtons) window.renderTargetButtons();
        window.goToStep('step-wait-aro');
    };

    // ==============================================================
    // 3. MODIFICATORI (solo la gittata: il resto è fisso)
    // ==============================================================
    window.preparaModificatoriSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nIl Fuoco Speculativo richiede comunque un Bersaglio Principale valido.');
            return window.setupTargetSelectionSpeculativo();
        }

        const arma = M.profiloArma(window.currentOrder.weapon);

        // Burst 1 per regolamento, e un solo Bersaglio Principale.
        if (window.combatTargets.length > 1) window.combatTargets = [window.combatTargets[0]];
        const tgt = window.combatTargets[0];
        tgt.burst = 1;
        tgt.cover = false;
        if (typeof tgt.rangeIndex !== 'number' || tgt.rangeIndex < 0 || tgt.rangeIndex >= arma.bands.length) tgt.rangeIndex = 0;
        tgt.rangeMod = arma.bands.length ? arma.bands[tgt.rangeIndex].mod : 0;
        if (!tgt.ammo || arma.ammoOpzioni.indexOf(tgt.ammo) < 0) tgt.ammo = arma.ammoOpzioni[0];

        window.renderSpeculativo();
        window.goToStep('step-modifiers');
    };

    window.renderSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const tgt = window.combatTargets[0];
        const regole = M.regoleSpeculativo(arma, { rangeIndex: tgt.rangeIndex });

        const valoreBase = unita[String(regole.attributo).toLowerCase()] || 0;

        let segmenti = '', etichette = '';
        arma.bands.forEach(function (b, i) {
            let cls = 'seg-2';
            if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
            const attivo = (tgt.rangeIndex === i) ? 'active' : '';
            segmenti += `<div class="range-seg ${cls} ${attivo}" onclick="window.setTargetRangeSpeculativo(${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
            etichette += `<span>${b.label}</span>`;
        });

        const dettaglio = regole.voci.map(v =>
            `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:#aaa;">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b>
             </div>`).join('');

        document.getElementById('targets-allocation-container').innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">FUOCO SPECULATIVO</h2>

            <div style="background:#220022; border:1px solid ${COL.bordo}; padding:15px; border-radius:5px; margin-bottom:20px;">
                <div style="text-align:center; margin-bottom:12px;">
                    <b style="color:#ff33ff; font-size:18px;">TIRO SU ${regole.attributo} ${valoreBase}</b>
                    ${regole.noteAttributo ? `<br><span style="color:#cc99cc; font-size:12px;">${regole.noteAttributo}</span>` : ''}
                </div>
                <div style="border-top:1px solid #553355; padding-top:10px; font-size:14px;">
                    ${dettaglio}
                    <div style="display:flex; justify-content:space-between; border-top:1px solid #553355; margin-top:8px; padding-top:8px;">
                        <b style="color:#fff;">MOD totale</b>
                        <b style="color:${regole.modTotale >= 0 ? '#00ff00' : '#ff6666'}; font-size:18px;">${regole.modTotale > 0 ? '+' + regole.modTotale : regole.modTotale}</b>
                    </div>
                </div>
            </div>

            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:15px; background:rgba(204,0,255,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:#fff; font-size:22px;">🎯 ${tgt.name}</b>
                    <div style="font-size:20px; font-weight:bold; color:${COL.bordo};">1 B</div>
                </div>
                <div style="text-align:center; color:#aaa; font-size:12px; margin-bottom:5px;">Seleziona la gittata (in linea retta fino al punto d'impatto):</div>
                <div class="range-bar">${segmenti}</div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${etichette}</div>
            </div>

            <div style="padding:12px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:12px; line-height:1.7;">
                <b style="color:#aaa;">Cosa NON si applica a questo tiro:</b><br>
                • Mimetismo del bersaglio — ignorato<br>
                • Copertura — ignorata (né il -6 al tiro, né il +3 alla salvezza del bersaglio)<br>
                • LoF — non serve: bersaglio e punto d'impatto si scelgono senza vederli<br>
                <b style="color:#aaa;">Si applica invece:</b> la gittata, che nell'Attacco Intuitivo non conta.
                ${regole.noteSagoma ? `<br><br><b style="color:#aaa;">Sagoma Circolare:</b> ${regole.noteSagoma}` : ''}
            </div>`;

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            nuovo.onclick = function () { window.eseguiCalcoloSpeculativo(); };
            nuovo.innerText = 'LANCIA ATTACCO SPECULATIVO';
        }
    };

    window.setTargetRangeSpeculativo = function (rangeIdx) {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.currentOrder.weapon);
        window.combatTargets[0].rangeIndex = rangeIdx;
        window.combatTargets[0].rangeMod = arma.bands[rangeIdx] ? arma.bands[rangeIdx].mod : 0;
        window.renderSpeculativo();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = Object.assign({}, M.profiloArma(window.currentOrder.weapon), { burst: 1 });
        const regole = M.regoleSpeculativo(arma, { rangeIndex: window.combatTargets[0].rangeIndex });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.SPECULATIVO,
            arma: arma,
            bersagli: window.combatTargets,
            burstDisponibile: 1,
            // Esplicitiamo all'Hub cosa vale e cosa no, invece del solo flag -6.
            regole: {
                attributo: regole.attributo,
                malusFisso: regole.malusFisso,
                modGittata: regole.modGittata,
                modTotale: regole.modTotale,
                ignoraMimetismo: true,
                ignoraCopertura: true,
                coperturaAnnullaSalvezza: regole.coperturaAnnullaSalvezza,
                criticoSoloSulPrincipale: regole.criticoSoloSulPrincipale
            }
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.startUnitSpeculativoLoop();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) {
            window.coordIndex--;
            window.coordPayloads.pop();
            return;
        }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(204,0,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">ATTACCO INVIATO ALL'HUB</h2>
                    <p style="font-size:12px; color:#aaa;">Calcolo Speculativo in corso...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('☄️ ordine_fuoco_speculativo.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_fuoco_speculativo.js', versione: '2026-09-14.2', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

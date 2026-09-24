// @versione 2026-09-21.1 | ordine_piazzamento.js | proprieta`: chat MOTORE
// ==========================================
// 📦 PIAZZARE EQUIPAGGIAMENTO (N5) - ordine_piazzamento.js
// ------------------------------------------
// MODULO NUOVO. Il router cercava `window.avviaFaseDeployable` e non lo
// trovava: verificaRouter() lo elencava fra i mancanti.
//
// 🔴 NON APRE NESSUN CALCOLATORE.
// azioneSenzaTiro('PIAZZARE EQUIPAGGIAMENTO') restituisce
// { tipo: 'SHORT_SKILL', generaAro: true }: il piazzamento serve a far
// comparire il token fra i bersagli, non a calcolare. Il modulo crea il
// token e chiude l'ordine, come fa il Movimento.
//
// Due cose che il modulo NON fa, di proposito:
//
//  - il Disco Ball non passa da qui. Nasce dall'ESITO del tiro del Disco
//    Baller, quindi lo crea il modulo del Fuoco Speculativo con
//    viaEsito: true. M.deployableDaEsito() dà null per i CrazyKoalas,
//    così i due percorsi non si confondono.
//
//  - il token NON viene spedito all'Hub: quel canale non esiste ancora.
//    Oggi il roster viaggia una volta sola allo schieramento. Il modulo
//    lo dichiara a schermo invece di far credere che sia arrivato.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il piazzamento non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#cc88ff', sfondo: '#2a1a33' };

    window.avviaFaseDeployable = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        window.coordIndex = window.coordIndex || 0;
        window.coordPayloads = window.coordPayloads || [];
        window.deployableRisposte = {};
        window.deployableScelta = null;
        window.mostraArmiPiazzabili();
    };

    // ==============================================================
    // 1. QUALE EQUIPAGGIAMENTO
    // ==============================================================
    window.mostraArmiPiazzabili = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const e = M.armiPiazzabili(unita);
        window.targetsScartati = e.escluse.map(x => ({ nome: x.nome, motivo: x.motivo }));

        const container = document.getElementById('weapon-buttons-container');
        if (!container) return;

        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <b style="color:${COL.bordo}; font-size:19px;">📦 PIAZZA EQUIPAGGIAMENTO</b><br>
            <span style="color:#aaa; font-size:13px;">Abilità Breve, nessun tiro.<br>
            Il nemico può reagire contro di te, mai contro ciò che piazzi.</span>
        </div>`;

        if (e.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-weight:bold;">
                Questa unità non ha equipaggiamento da piazzare.</p>`;
        } else {
            e.armi.forEach(function (a) {
                // Il nome GREZZO, con le notazioni: il modulo lo ririsolve dopo.
                const nomeEsc = String(a.nomeRichiesto || a.nome).replace(/'/g, "\\'");
                const usi = a.usi ? `${a.usi.residui}/${a.usi.totali} usi` : 'usi illimitati';
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:62px; font-size:19px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                    onclick="window.scegliArmaDaPiazzare('${nomeEsc}')">
                    📦 ${a.nome}<br><span style="font-size:13px; color:${COL.bordo};">${usi}</span></button>`;
            });
        }

        if (window.targetsScartati.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non piazzabili:</b><br>` +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>') + `</div>`;
        }
        window.goToStep('step-weapon');
    };

    window.scegliArmaDaPiazzare = function (nomeGrezzo) {
        const M = motore(); if (!M) return;
        window.deployableScelta = nomeGrezzo;
        window.deployableBersaglio = null;
        // 🔴 Un'arma che si piazza A CONTATTO di un bersaglio — le D-Charges
        // in Demolition Mode — chiede prima SU COSA. Il filtro legge i campi
        // che l'arma dichiara (bersagliAmmessi / bersagliEsclusi): un nemico
        // sano non e` ammesso. Prima questo passo non esisteva, e la funzione
        // del filtro non veniva mai raggiunta dall'app. (Chat REGOLE, 21 sett.)
        const arma = M.profiloArma(nomeGrezzo);
        const W = window.RULES_WEAPONS || {};
        const voce = W[arma.nome] || arma;
        if (Array.isArray(voce.bersagliAmmessi) || Array.isArray(voce.bersagliEsclusi)) {
            return window.mostraBersagliPiazzamento(arma);
        }
        window.mostraDomandeDeployable();
    };

    window.mostraBersagliPiazzamento = function (arma) {
        const M = motore(); if (!M) return;
        const giudizi = M.bersagliDaPiazzamento(arma);
        window.bersagliPiazzamento = giudizi;
        const container = document.getElementById('enemy-target-buttons');
        if (!container) return;
        const ammessi = giudizi.filter(g => g.ammesso), scartati = giudizi.filter(g => !g.ammesso);
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <b style="color:${COL.bordo}; font-size:18px;">📦 ${arma.nome}</b><br>
            <span style="color:#aaa; font-size:13px;">Si piazza a contatto del bersaglio. Scegli su cosa.</span></div>` +
            (ammessi.length ? ammessi.map(g => `<button class="huge-btn" style="width:100%; min-height:56px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                onclick="window.scegliBersaglioPiazzamento('${String(g.unita.id).replace(/'/g, "\\'")}')">🎯 ${g.nome}</button>`).join('')
             : `<p style="color:#ff3333; text-align:center; font-weight:bold;">Nessun bersaglio ammesso da quest'arma.</p>`) +
            (scartati.length ? `<div style="margin-top:12px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non ammessi:</b><br>` + scartati.map(g => `• <b>${g.nome}</b> — ${g.motivo}`).join('<br>') + `</div>` : '');
        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioPiazzamento = function (id) {
        const g = (window.bersagliPiazzamento || []).find(x => String(x.unita.id) === String(id));
        if (!g || !g.ammesso) return alert('⛔ Bersaglio non ammesso da quest\'arma.');
        window.deployableBersaglio = g.unita;
        window.mostraDomandeDeployable();
    };

    // ==============================================================
    // 2. LE DOMANDE — l'app non ha la mappa
    // ==============================================================
    window.mostraDomandeDeployable = function () {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.deployableScelta);

        let domande = M.domandeDeployable('PIAZZAMENTO');
        // Col Tratto Perimeter si piazza ovunque dentro la ZdC, ma il
        // percorso dev'essere percorribile: è una domanda in più.
        if (/PERIMETER/i.test(String(arma.traits || ''))) {
            domande = domande.concat(M.domandeDeployable('PERIMETER'));
        }
        window.deployableDomande = domande;

        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        container.innerHTML = `<h2 style="color:${COL.bordo}; text-align:center; margin-bottom:12px;">${arma.nome}</h2>
            <div style="color:#aaa; font-size:13px; text-align:center; margin-bottom:18px;">
                Il calcolatore non ha la mappa: queste cose le sai solo tu.</div>` +
            domande.map(function (d, i) {
                const r = window.deployableRisposte[d.id];
                return `<div style="background:#1a1020; border:1px solid #442255; padding:14px; border-radius:5px; margin-bottom:12px;">
                    <div style="color:#fff; font-size:16px; margin-bottom:10px;">${d.testo}</div>
                    <div style="display:flex; gap:8px;">
                        <button class="huge-btn" style="flex:1; min-height:48px; ${r === true ? 'background:#553300; border-color:#ffaa33;' : 'background:#111;'}"
                            onclick="window.rispondiDeployable('${d.id}', true)">SÌ</button>
                        <button class="huge-btn" style="flex:1; min-height:48px; ${r === false ? 'background:#004400; border-color:#00ff00;' : 'background:#111;'}"
                            onclick="window.rispondiDeployable('${d.id}', false)">NO</button>
                    </div>
                    ${window.avvisoDomanda(d, r)}
                </div>`;
            }).join('');

        window.aggiornaPulsantePiazza();
        window.goToStep('step-modifiers');
    };

    window.avvisoDomanda = function (d, risposta) {
        if (risposta === undefined) return '';
        const bloccante = (d.rispostaBloccante === false) ? (risposta === false) : (risposta === true);
        if (!bloccante) return '';
        const testo = (risposta === true ? d.seSi : d.seNo) || 'Piazzamento non consentito.';
        return `<div style="margin-top:10px; padding:10px; background:#330000; border:1px solid #ff3333; border-radius:4px; color:#ff9999; font-size:13px;">⛔ ${testo}</div>`;
    };

    window.rispondiDeployable = function (id, valore) {
        window.deployableRisposte[id] = valore;
        window.mostraDomandeDeployable();
    };

    // Il piazzamento è bloccato da una delle risposte?
    window.piazzamentoBloccato = function () {
        const d = window.deployableDomande || [];
        for (let i = 0; i < d.length; i++) {
            const r = window.deployableRisposte[d[i].id];
            if (r === undefined) return { bloccato: true, motivo: 'Manca una risposta.', incompleto: true };
            const bloccante = (d[i].rispostaBloccante === false) ? (r === false) : (r === true);
            if (bloccante && d[i].blocca) {
                return { bloccato: true, motivo: (r === true ? d[i].seSi : d[i].seNo) || 'Piazzamento non consentito.' };
            }
        }
        return { bloccato: false };
    };

    window.aggiornaPulsantePiazza = function () {
        const stato = window.piazzamentoBloccato();
        const btn = document.getElementById('btn-esegui-calcolo') ||
                    document.querySelector('#step-modifiers .huge-btn');
        if (!btn) return;
        const nuovo = btn.cloneNode(true);
        btn.parentNode.replaceChild(nuovo, btn);
        // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
        nuovo.onclick = function () { window.eseguiPiazzamento(); };
        nuovo.innerText = stato.bloccato
            ? (stato.incompleto ? 'RISPONDI ALLE DOMANDE' : 'PIAZZAMENTO NON CONSENTITO')
            : 'PIAZZA';
    };

    // ==============================================================
    // 3. IL TOKEN
    // ==============================================================
    window.eseguiPiazzamento = function () {
        const M = motore(); if (!M) return;

        const stato = window.piazzamentoBloccato();
        if (stato.bloccato) {
            return alert(stato.incompleto
                ? '⚠️ Rispondi a tutte le domande prima di piazzare.'
                : `⛔ ${stato.motivo}\n\nL'ordine NON è stato eseguito.`);
        }

        const unita = window.coordUnits[window.coordIndex];
        // 🔴 Il PROFILO, non il nome: creaDeployable dà E18 su una stringa.
        // E il nome GREZZO, con le notazioni della scheda.
        const arma = M.profiloArma(window.deployableScelta);
        const ordineId = (window.currentOrder && window.currentOrder.id) ||
                         `ord_${Date.now()}`;
        window.currentOrder.id = ordineId;

        const e = M.creaDeployable(unita, arma, { ordineId: ordineId, viaEsito: false });

        if (e.errori.length > 0) {
            return alert('⛔ ' + e.errori.map(x => x.messaggio + (x.dettaglio ? '\n   ' + x.dettaglio : '')).join('\n\n'));
        }

        // Il portatore con l'uso scalato: va tenuto, altrimenti le due app
        // contano usi diversi.
        window.coordUnits[window.coordIndex] = e.portatoreAggiornato;
        if (window.aggiornaUnitaRoster) window.aggiornaUnitaRoster(e.portatoreAggiornato);

        window.tokenPiazzati = window.tokenPiazzati || [];
        window.tokenPiazzati.push(e.token);

        window.coordPayloads.push({
            attaccante: e.portatoreAggiornato,
            azione: M.AZIONI.PIAZZA_DEPLOYABLE,
            arma: arma,
            bersagli: [],
            burstDisponibile: 0,
            regole: {
                senzaTiro: true,
                token: e.token,
                portatoreAggiornato: e.portatoreAggiornato,
                ordineDiPiazzamento: ordineId,
                nonBersagliabileInQuestOrdine: true,
                avvisi: e.avvisi
            }
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.deployableRisposte = {};
            window.deployableScelta = null;
            return window.mostraArmiPiazzabili();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        window.mostraEsitoPiazzamento(e.token, e.avvisi);
    };

    window.mostraEsitoPiazzamento = function (token, avvisi) {
        const div = document.getElementById('calc-result');
        if (!div) return;
        div.innerHTML = `
            <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(204,136,255,0.1); margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">${token.nome} PIAZZATO</h2>
                <p style="font-size:13px; color:#ccc; margin:8px 0;">
                    ${token.isCamo ? 'Entra in gioco come Marker: va Scoperto prima di bersagliarlo.'
                                   : 'Visibile sul tavolo, bersagliabile dal prossimo Ordine.'}
                </p>
                <p style="font-size:12px; color:#999;">
                    In questo Ordine il nemico può reagire solo contro chi lo ha piazzato.
                </p>
                <div style="margin-top:12px; padding:10px; background:#221100; border:1px solid #664400; border-radius:4px; color:#cc9955; font-size:12px;">
                    ⚠️ Il token NON è stato spedito all'avversario: il canale per aggiungere
                    un'unità a partita iniziata non esiste ancora. Comunicaglielo a voce.
                </div>
                ${(avvisi || []).length ? `<div style="margin-top:10px; color:#cc9955; font-size:12px;">` +
                    avvisi.map(a => `⚠️ ${a.messaggio}`).join('<br>') + `</div>` : ''}
            </div>`;
        div.style.display = 'block';
    };

    console.log('📦 ordine_piazzamento.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_piazzamento.js', versione: '2026-09-21.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

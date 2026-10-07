// @versione 2026-10-07.5 | ordine_piazzamento.js | proprieta`: chat MOTORE
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

    // La scelta del giocatore, come l'ha OFFERTA armiPiazzabili — non riletta
    // per nome. Un EQUIPAGGIAMENTO Deployable (il Deployable Repeater di 29
    // profili) non e` un'arma: riletto con profiloArma era "non trovato", e
    // il segnalino offerto veniva poi rifiutato. (29 settembre.)
    function armaScelta(M, unita) {
        const offerta = unita ? (M.armiPiazzabili(unita).armi || []).find(a => a.nome === window.deployableScelta) : null;
        return offerta || M.profiloArma(window.deployableScelta);
    }

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
        // Dichiarato come PRIMA cosa dell'Ordine: e` IDLE + PIAZZARE. L'ARO
        // si dichiara subito dopo la prima Abilita` (righe 1088-1090), quindi
        // l'allarme parte ORA, con l'Idle, prima delle domande: l'avversario
        // sceglie l'ARO mentre qui si risponde.
        window.currentOrder.aroDaIdleImplicito = false;
        if (!isSecondHalf && !(window.coordMode && window.coordIndex > 0)) {
            const al = M.allarmeOrdine('IDLE', {
                unita: window.currentOrder.unit, coordUnits: window.coordUnits, coordMode: window.coordMode,
                azioneSeconda: actionId
            });
            if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
            window.currentOrder.aroDaIdleImplicito = !!(al.aro && al.aro.genera);
        }
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
            <span style="color:#aaa; font-size:13px;">Abilità Breve, nessun tiro: è sempre la SECONDA metà dell'Ordine
            (dopo Movimento, Scoprire o Idle).${window.currentOrder && !window.currentOrder.isSecondHalf ? ' Dichiarata per prima vale <b>IDLE + PIAZZARE</b>: l\'Ordine finisce qui.' : ''}<br>
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
            // La riga con la foto la disegna la pagina (window.rigaUnitaConFoto);
            // dove non c'e` resta il bottone semplice.
            (ammessi.length ? ammessi.map(function (g) {
                const clic = `onclick="window.scegliBersaglioPiazzamento('${String(g.unita.id).replace(/'/g, "\\'")}')"`;
                return (typeof window.rigaUnitaConFoto === 'function')
                    ? window.rigaUnitaConFoto(g.unita, { attributi: clic, fazione: 'NEMICA' })
                    : `<button class="huge-btn" style="width:100%; min-height:56px; margin-bottom:6px; background:#111; border-color:${COL.bordo};" ${clic}>🎯 ${g.nome}</button>`;
            }).join('')
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
        const arma = armaScelta(M, window.coordUnits[window.coordIndex]);

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
                // 🔴 IL COLORE LO DA` LA RISPOSTA, NON LA PAROLA. Verde la
                // risposta che lascia piazzare, giallo quella che porta
                // all'Idle. Prima il SI` era sempre arancio e il NO sempre
                // verde: giusto per "c'e` un Marker nell'area?", rovesciato
                // per "il percorso e` libero?", dove la risposta buona e` SI`.
                // Chi blocca lo decide il motore (M.valutaDomanda), domanda
                // per domanda. (A-07 al tavolo di Paolo, 6 ottobre.)
                const colore = function (valore) {
                    if (r !== valore) return 'background:#111;';
                    return M.valutaDomanda(d, valore).esito === 'BLOCCATA'
                        ? 'background:#554400; border-color:#ffcc00; color:#ffcc00;'
                        : 'background:#004400; border-color:#00ff00; color:#00ff00;';
                };
                return `<div style="background:#1a1020; border:1px solid #442255; padding:14px; border-radius:5px; margin-bottom:12px;">
                    <div style="color:#fff; font-size:16px; margin-bottom:10px;">${d.testo}</div>
                    <div style="display:flex; gap:8px;">
                        <button class="huge-btn" style="flex:1; min-height:48px; ${colore(true)}"
                            onclick="window.rispondiDeployable('${d.id}', true)">SÌ</button>
                        <button class="huge-btn" style="flex:1; min-height:48px; ${colore(false)}"
                            onclick="window.rispondiDeployable('${d.id}', false)">NO</button>
                    </div>
                    ${window.avvisoDomanda(d, r)}
                </div>`;
            }).join('');

        window.aggiornaPulsantePiazza();
        window.goToStep('step-modifiers');
    };

    window.avvisoDomanda = function (d, risposta) {
        // Chi decide se una risposta blocca e` il motore (M.valutaDomanda),
        // non questa pagina: la regola sta in un posto solo.
        const M = motore(); if (!M) return '';
        const v = M.valutaDomanda(d, risposta);
        if (v.esito !== 'BLOCCATA' && !v.avviso) return '';
        const testo = v.motivo || v.avviso || 'Piazzamento non consentito.';
        return `<div style="margin-top:10px; padding:10px; background:#330000; border:1px solid #ff3333; border-radius:4px; color:#ff9999; font-size:13px;">⛔ ${testo}</div>`;
    };

    window.rispondiDeployable = function (id, valore) {
        window.deployableRisposte[id] = valore;
        window.mostraDomandeDeployable();
    };

    // Il piazzamento è bloccato da una delle risposte?
    window.piazzamentoBloccato = function () {
        // Il meccanismo e` del motore (M.valutaDomande): tre esiti, e NON
        // RISPOSTO non esegue. Qui c'era una copia che riconosceva "non
        // risposto" solo con undefined: con null il piazzamento passava.
        const M = motore(); if (!M) return { bloccato: true, motivo: 'Motore non caricato.', incompleto: true };
        const v = M.valutaDomande(window.deployableDomande || [], window.deployableRisposte || {});
        if (v.esito === 'LIBERA') return { bloccato: false };
        if (v.esito === 'NON_RISPOSTO') return { bloccato: true, motivo: v.motivo, incompleto: true };
        return { bloccato: true, motivo: v.motivo || 'Piazzamento non consentito.' };
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
        // 🔴 TRE STATI, UN TASTO SOLO: RISPONDI ALLE DOMANDE finche` manca una
        // risposta, PIAZZA se sono tutte verdi, IDLE se una e` gialla. Prima
        // il terzo stato diceva "PIAZZAMENTO NON CONSENTITO" e non portava da
        // nessuna parte: per l'Idle serviva il tasto giallo fisso sotto.
        // (Richiesta di Paolo, A-07, 6 ottobre.)
        const idle = stato.bloccato && !stato.incompleto;
        nuovo.onclick = function () { return idle ? window.idleDaPiazzamento() : window.eseguiPiazzamento(); };
        nuovo.innerText = stato.bloccato ? (stato.incompleto ? 'RISPONDI ALLE DOMANDE' : 'IDLE') : 'PIAZZA';
        const Mc = motore();
        nuovo.style.background = idle ? ((Mc && Mc.COLORE_TASTO) ? Mc.COLORE_TASTO.idle : '#ffcc00') : ((Mc && Mc.COLORE_TASTO) ? Mc.COLORE_TASTO.valido : '');
    };

    // Una risposta gialla: l'Abilita` e` dichiarata ma il requisito non c'e`.
    // L'Idle da requisito fallito e` UNO per tutta l'app e sta nella pagina
    // (window.dichiaraRequisitoFallito, chat INTERFACCIA): qui lo si chiama,
    // col motivo che il motore ha gia` scritto. Non se ne fa una copia.
    window.idleDaPiazzamento = function () {
        const stato = window.piazzamentoBloccato();
        if (!stato.bloccato || stato.incompleto) return;
        if (typeof window.dichiaraRequisitoFallito === 'function') return window.dichiaraRequisitoFallito(stato.motivo);
        alert(`⛔ ${stato.motivo}\n\nL'Idle da requisito fallito non è disponibile (pagina non caricata).`);
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
        const arma = armaScelta(M, window.coordUnits[window.coordIndex]);
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

        // Nel ROSTER, come le unita`: e` li` che stanno i token dello
        // schieramento, e un solo elenco dice cosa c'e` sul tavolo. Non puo`
        // ricevere Ordini (M.puoRicevereOrdine), ma e` bersagliabile e, se
        // reagisce, risponde in ARO. (Decisione di Paolo, 26 settembre.)
        window.roster = window.roster || [];
        window.roster.push(e.token);
        // 🔴 Il token deve ESISTERE per l'avversario: prima restava in
        // tokenPiazzati e non partiva — il CrazyKoala non si poteva bersagliare.
        // Parte col roster, dal mittente unico, filtrato: una mina mimetica
        // arriva come segnalino. (Collaudo al tavolo, 26 settembre.)
        if (typeof window.inviaSchieramentoAllHub === 'function') {
            window.inviaSchieramentoAllHub(document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA', {
                roster: window.roster, strutture: window.activeStructures || [],
                terreni: window.activeTerrains || [], motivo: 'AGGIORNAMENTO'
            });
        }

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

        // 🔴 PLACE DEPLOYABLE E` UNA SHORT SKILL: E` SEMPRE LA SECONDA META`
        // (riga 7550; combinazioni alle righe 1047-1054: Basic Short + Short,
        // "always declared in the order shown"). Le tre forme ammesse sono
        // MOVIMENTO + PIAZZARE, SCOPRIRE + PIAZZARE, IDLE + PIAZZARE.
        // Chi "piazza e basta" ha dichiarato IDLE + PIAZZARE: l'Ordine e`
        // intero, e l'allarme e` partito ALL'INGRESSO (avviaFaseDeployable),
        // cioe` alla prima Abilita`, non qui.
        // La 2026-10-07.1 faceva il contrario — Piazzare come prima meta` e un
        // Movimento dopo — ed era una lettura MIA sbagliata, corretta dalla
        // chat REGOLE il 7 ottobre. Qui parte SOLO la busta, mai l'allarme:
        // prima partivano insieme, e l'Hub chiudeva il calcolo mentre il
        // reattivo sceglieva ancora l'ARO (Paolo al tavolo, 6 ottobre).
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode,
                                                               aroAtteso: !!window.currentOrder.aroDaIdleImplicito });
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
    var v = { file: 'ordine_piazzamento.js', versione: '2026-10-07.5', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

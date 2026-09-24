// @versione 2026-09-23.1 | fase_schieramento.js | proprieta`: chat MOTORE
// ==========================================
// 🚀 FASE DI SCHIERAMENTO
// ------------------------------------------
// Il filtro anti-spoiler e i promemoria passano da MotoreN5.
//
// CORREZIONE: il filtro lavorava per sottrazione e lasciava passare tutto
// il profilo dei Marker. Ora lavora per elenco dei campi ammessi.
// ==========================================

window.faseSchieramento = {

    // 1. Promemoria dei tiri automatici da fare dopo lo schieramento.
    validaSchieramento: function(roster) {
        const M = window.MotoreN5;
        if (!M) return [];
        return M.promemoriaSchieramento(roster)
                .map(p => `- ${p.unita} ha ${p.skill}: ${p.testo}`);
    },

    // 2. Dati per l'Hub, filtrati per l'avversario.
    //
    // 🔴 IL FILTRO PRECEDENTE PERDEVA INFORMAZIONI. Copiava l'unita` intera
    // e cambiava solo alias, name e tipo: di un Marker Mimetico l'avversario
    // riceveva comunque il nome vero dell'Unita`, CC, BS, PH, WIP, ARM, BTS,
    // armi, Abilita` ed Equipaggiamento. Bastava aprire i dati ricevuti per
    // sapere cosa c'era sotto il segnalino.
    //
    // Ora il filtro sta nel motore e lavora per ELENCO dei campi ammessi:
    // quel che non e` in lista non parte, nemmeno se domani il profilo ne
    // guadagna di nuovi.
    preparaPayloadHub: function(roster, strutture, terreni) {
        const M = window.MotoreN5;
        if (!M) {
            console.error('⛔ motore_regole_n5.js non caricato: schieramento non filtrato, invio annullato.');
            return null;
        }
        return {
            roster: M.rosterPubblico(roster),   // quello che vede l'avversario
            rosterPrivato: roster,              // quello che vedi tu
            strutture: strutture,
            terreni: terreni,
            timestamp: Date.now()
        };
    },

    // 3. Conclusione Schieramento e Sync
    concludiSchieramento: function() {
        if (!window.roster || window.roster.length === 0) {
            return alert("Errore: Roster vuoto!");
        }

        // --- CONTROLLO POST-SCHIERAMENTO (Tiri automatici) ---
        let messaggiAvviso = this.validaSchieramento(window.roster);
        if (messaggiAvviso.length > 0) {
            let conferma = confirm("⚠️ PROMEMORIA TIRI POST-SCHIERAMENTO:\n\n" + messaggiAvviso.join("\n") + "\n\nHai già effettuato questi tiri? Clicca OK per inviare i dati all'avversario, oppure Annulla per tornare indietro.");
            if (!conferma) return; // Ferma l'invio, permettendo all'utente di tirare i dadi
        }

        // --- PREPARAZIONE PAYLOAD ---
        const payload = this.preparaPayloadHub(
            window.roster,
            window.activeStructures || [],
            window.activeTerrains || []
        );
        // Senza motore il filtro non gira: meglio non spedire nulla che
        // spedire il roster in chiaro.
        if (!payload) {
            return alert('⛔ Motore non caricato: lo schieramento NON è stato inviato.\n\nSpedirlo senza filtro rivelerebbe all\'avversario le truppe nascoste.');
        }

        // 🟢 RILEVAMENTO DINAMICO DELLA FAZIONE
        let fazioneAttuale = document.title.includes("NOMADS") ? 'NOMADI' : 'PANOCEANIA';

        // 🟢 DELEGA AL CORE L'INVIO DEI DATI
        if (window.inviaSchieramentoAllHub) {
            window.inviaSchieramentoAllHub(payload, fazioneAttuale);
        } else {
            console.error("Errore critico: Funzione inviaSchieramentoAllHub non trovata nel Core.");
            // Fallback dinamico in caso di test senza core
            let fallbackCanale = window.MotoreN5.canaleSetup(fazioneAttuale);
            localStorage.setItem(fallbackCanale, JSON.stringify(payload));
        }

        window.schieramentoCompletato = true;
        console.log(`✅ Fase Schieramento conclusa per ${fazioneAttuale}, passo il controllo al Core.`);

        // Aggiorna l'interfaccia
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        document.getElementById('step-sync').style.display = 'flex';
        
        document.getElementById('sync-status-msg').innerHTML = 
            `SCHIERAMENTO COMPLETATO.<br>Dati inviati all'Hub Centrale.<br>In attesa del Turno 1...`;
    }
};

// Registrazione globale per il pulsante HTML
// 🔴 MINELAYER. Il token piazzato entra in window.roster PRIMA della conferma:
// preparaPayloadHub pubblica window.roster, quindi il token arriva
// all'avversario col resto dello schieramento — senza un canale nuovo.
// Il motore calcola, qui si sostituisce: come applicaIdle e creaDeployable.
window.faseSchieramento.minelayer = {
    opzioni: function (idUnita) {
        const M = window.MotoreN5;
        const u = (window.roster || []).find(x => x && String(x.id) === String(idUnita));
        return (M && u) ? M.opzioniMinelayer(u) : null;
    },
    piazza: function (idUnita, nomeArma, risposte) {
        const M = window.MotoreN5;
        const i = (window.roster || []).findIndex(x => x && String(x.id) === String(idUnita));
        if (!M || i < 0) return null;
        const r = M.piazzaConMinelayer(window.roster[i], nomeArma, risposte);
        if (r.token) {
            window.roster[i] = r.portatoreAggiornato;
            window.roster.push(r.token);
        }
        return r;
    },
    tiroFallito: function (idUnita, nomeArma) {
        const M = window.MotoreN5;
        const i = (window.roster || []).findIndex(x => x && String(x.id) === String(idUnita));
        if (!M || i < 0) return null;
        const r = M.minelayerTiroFallito(window.roster[i], nomeArma);
        window.roster[i] = r.portatoreAggiornato;
        return r;
    }
};

window.confermaSchieramento = function() {
    window.faseSchieramento.concludiSchieramento();
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'fase_schieramento.js', versione: '2026-09-22.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

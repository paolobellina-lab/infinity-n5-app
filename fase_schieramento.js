// @versione 2026-09-27.1 | fase_schieramento.js | proprieta`: chat MOTORE
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
    // REMDRIVER: il giocatore sceglie il REM accanto a cui piazzare il
    // segnalino. Il REM nel roster riceve i valori del pilota (M.applicaRemDriver).
    //   assegnaRemDriver(idPilota, idRem) -> { ok, motivo?, nota? }
    assegnaRemDriver: function (idPilota, idRem) {
        const M = window.MotoreN5; const r = window.roster || [];
        const pilota = r.find(u => u && u.id === idPilota), rem = r.find(u => u && u.id === idRem);
        if (!pilota || !rem) return { ok: false, motivo: 'Pilota o REM non trovati nel roster.' };
        const e = M.applicaRemDriver(rem, pilota);
        if (e.ok) Object.assign(rem, e.rem);   // stesso oggetto: chi lo tiene lo vede
        return { ok: e.ok, motivo: e.motivo, nota: e.nota };
    },

    // La busta la costruisce il motore, in un posto solo (M.bustaSchieramento).
    // Resta qui per chi la chiamava; senza motore restituisce null.
    preparaPayloadHub: function(roster, strutture, terreni) {
        const M = window.MotoreN5;
        if (!M || typeof M.bustaSchieramento !== 'function') return null;
        return M.bustaSchieramento(roster, strutture, terreni);
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

        // 🟢 RILEVAMENTO DINAMICO DELLA FAZIONE
        let fazioneAttuale = document.title.includes("NOMADS") ? 'NOMADI' : 'PANOCEANIA';

        // Si spedisce SOLO dal mittente unico, che costruisce la busta dal
        // roster privato. Tolto il ripiego "senza core": l'unica pagina che
        // carica questo file carica anche motore_core, e il ripiego scriveva
        // il canale a mano. (25 settembre.)
        const esito = window.inviaSchieramentoAllHub
            ? window.inviaSchieramentoAllHub(fazioneAttuale, {
                  roster: window.roster,
                  strutture: window.activeStructures || [],
                  terreni: window.activeTerrains || [],
                  motivo: 'SCHIERAMENTO'
              })
            : { inviato: false, motivo: 'inviaSchieramentoAllHub non trovata' };
        if (!esito.inviato) {
            return alert('⛔ Lo schieramento NON è stato inviato: ' + esito.motivo + '.');
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

// @versione 2026-09-23.1 | ordine_coordinato.js | proprieta`: chat MOTORE
// ==========================================
// 🔗 ORDINE COORDINATO E SELEZIONE (N5) - ordine_coordinato.js
// ------------------------------------------
// Appoggiato a MotoreN5 per le regole.
//
// Correzioni:
//
//  1. LA PUNTA DI LANCIA NON HA IL BURST PIENO. Il regolamento dice META`
//     del Burst, bonus compresi, arrotondata per eccesso. La schermata
//     scriveva "FULL BURST", cioe` il contrario, e il motore calcolava il
//     Burst pieno: con una HMG erano 4 dadi invece di 2.
//     (Il Leader del FIRETEAM invece ha il Burst pieno: i due casi erano
//     trattati allo stesso modo.)
//
//  2. I CONTROLLI DI STATO ERANO SCRITTI DUE VOLTE — in selezionaUnita e
//     in impostaPuntaDiLancia — e in nessun altro posto del progetto.
//     Ora sono M.puoEssereAttivata().
//
//  3. L ADDESTRAMENTO NON ERA CONTROLLATO. Un Ordine Coordinato richiede
//     lo stesso Addestramento (Regolare/Irregolare) oltre allo stesso
//     Gruppo di Combattimento.
// ==========================================

// --- VARIABILI GLOBALI DI STATO ---
window.isCoordinated = false;
window.selectedCoordinatedUnits = [];
window.spearheadUnit = null;

// --- GESTIONE PRESSIONE SUI GRUPPI (MENU PRINCIPALE) ---
let pressTimer = null;

window.startGroupPress = (groupNum) => {
    pressTimer = setTimeout(() => {
        pressTimer = null;
        window.apriSelezioneTruppe(groupNum, true); // TRUE = Ordine Coordinato!
    }, 600); // 600ms per attivare la pressione lunga
};

window.endGroupPress = (groupNum) => {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
        window.apriSelezioneTruppe(groupNum, false); // FALSE = Ordine Normale
    }
};

window.cancelPress = () => { 
    if (pressTimer) clearTimeout(pressTimer); 
    pressTimer = null; 
};

// --- INIZIALIZZAZIONE SELEZIONE TRUPPE ---
window.apriSelezioneTruppe = (groupNum, isCoord) => {
    window.isCoordinated = isCoord;
    window.selectedCoordinatedUnits = [];
    window.spearheadUnit = null;
    window.currentGroup = groupNum;

    // Reset UI e navigazione
    document.getElementById('battle').style.display = 'none';
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-unit').style.display = 'flex';
    
    // Gestione dell'Header Globale
    let header = document.getElementById('battle-header');
    if (!header) {
        header = document.createElement('div');
        header.id = 'battle-header';
        document.getElementById('step-unit').parentNode.insertBefore(header, document.getElementById('step-unit'));
    }
    header.style.display = 'block';
    
    if (isCoord) {
        // Colori dinamici in base alla fazione (Nomadi = Rosso, PanO = Azzurro)
        const accentColor = document.title.includes("NOMADS") ? "var(--nomad-red)" : "#00ccff";
        header.innerHTML = `<h1 style="text-align:center; margin-bottom:15px; font-family:'Teko'; font-size:42px; color:${accentColor}; letter-spacing:2px; text-shadow: 0 0 10px ${accentColor};">ORDINE COORDINATO</h1>
                            <p style="text-align:center; color:#aaa; font-size:14px; margin-top:-10px;">(Max 4 unità. Tieni premuto per cambiare Punta di Lancia)</p>`;
        header.style.border = "none";
        header.style.background = "transparent";
    } else {
        header.innerHTML = "";
        header.style.border = "none";
        header.style.background = "transparent";
        header.style.padding = "0";
        header.style.margin = "0";
    }
    
    window.aggiornaGraficaRoster();
};

// --- GESTIONE PRESSIONE SULLE SINGOLE UNITÀ ---
let unitPressTimer = null;
let longPressTriggered = false;

window.startUnitPress = (index) => {
    longPressTriggered = false; 
    unitPressTimer = setTimeout(() => {
        longPressTriggered = true; 
        if (!window.isCoordinated) {
            window.apriPaginaStati(index); // Apre Stati (Tocco Lungo su Ordine Normale)
        } else {
            window.impostaPuntaDiLancia(index); // Assegna Punta Lancia (Tocco Lungo su Coordinato)
        }
    }, 600);
};

window.endUnitPress = (index) => {
    if (unitPressTimer) clearTimeout(unitPressTimer);
    if (!longPressTriggered) {
        // Ritardo di 50ms per evitare il "Tocco Fantasma" del browser durante lo scroll
        setTimeout(() => {
            window.selezionaUnita(index);
        }, 50);
    }
};

window.cancelUnitPress = () => { 
    if(unitPressTimer) clearTimeout(unitPressTimer); 
    longPressTriggered = false; 
};

// --- CONTROLLI DI ATTIVAZIONE (dal motore) ---
window.controllaAttivazione = (u) => {
    const M = window.MotoreN5;
    if (!M) { alert('⛔ motore_regole_n5.js non caricato.'); return false; }

    const esito = M.puoEssereAttivata(u);
    if (!esito.puo) {
        alert(`⚠️ ${M.nomeUnita(u)} — ${esito.blocchi[0].nome || esito.blocchi[0].stato}\n\n${esito.motivo}`);
        return false;
    }
    // Attivare la miniatura annulla il Fuoco di Soppressione.
    if (esito.annullaSoppressione) {
        u.states.suppressive = false;
        alert(`🔥 ${M.nomeUnita(u)}: ${esito.notaSoppressione}`);
        if (window.aggiornaGraficaRoster) window.aggiornaGraficaRoster();
    }
    return true;
};

// --- LOGICA DI SELEZIONE E VALIDAZIONE (CUORE DEL COORDINATO) ---
window.selezionaUnita = (index) => {
    let u = window.roster[index];
    
    // Controlli di attivazione: una regola sola, nel motore.
    // Stavano scritti QUI e di nuovo in impostaPuntaDiLancia().
    if (!window.controllaAttivazione(u)) return;

    if (!window.isCoordinated) {
        // --- ORDINE SINGOLO NORMALE ---
        window.spearheadUnit = u;
        window.selectedCoordinatedUnits = [u];
        window.procediAlleAzioni(); 
    } else {
        // --- COSTRUZIONE ORDINE COORDINATO ---
        if (window.selectedCoordinatedUnits.includes(u)) {
            // Deseleziona
            window.selectedCoordinatedUnits = window.selectedCoordinatedUnits.filter(x => x !== u);
            
            // Se ho rimosso la Punta di Lancia, passala al primo gregario rimasto (se c'è)
            if (window.spearheadUnit === u) {
                window.spearheadUnit = window.selectedCoordinatedUnits.length > 0 ? window.selectedCoordinatedUnits[0] : null;
            }
        } else {
            // Seleziona (Limite N5: 4 Unità)
            const maxT = (window.CATALOGO_N5 && window.CATALOGO_N5.ORDINE_COORDINATO)
                ? window.CATALOGO_N5.ORDINE_COORDINATO.massimoTruppe : 4;
            if (window.selectedCoordinatedUnits.length >= maxT) {
                return alert(`⚠️ Limite di regolamento: massimo ${maxT} unità per un Ordine Coordinato.`);
            }
            window.selectedCoordinatedUnits.push(u);
            
            // Automatismo: Il primo che tocchi diventa Punta di Lancia
            if (!window.spearheadUnit) {
                window.spearheadUnit = u;
            }
        }
        window.aggiornaGraficaRoster();
    }
};

window.impostaPuntaDiLancia = (index) => {
    let u = window.roster[index];

    if (!window.controllaAttivazione(u)) return;

    if (!window.selectedCoordinatedUnits.includes(u)) {
        const maxT = (window.CATALOGO_N5 && window.CATALOGO_N5.ORDINE_COORDINATO)
            ? window.CATALOGO_N5.ORDINE_COORDINATO.massimoTruppe : 4;
        if (window.selectedCoordinatedUnits.length >= maxT) return alert(`Massimo ${maxT} unità!`);
        window.selectedCoordinatedUnits.push(u);
    }
    window.spearheadUnit = u;
    window.aggiornaGraficaRoster();
};

window.confermaCoordinato = () => {
    const M = window.MotoreN5;
    if (!M) return alert('⛔ motore_regole_n5.js non caricato.');

    const esito = M.validaCoordinato(window.selectedCoordinatedUnits, window.spearheadUnit);
    if (!esito.ok) {
        return alert('⛔ ORDINE COORDINATO NON VALIDO\n\n' +
            esito.errori.map(e => `• ${e.messaggio}` + (e.dettaglio ? `\n   ${e.dettaglio}` : '')).join('\n\n'));
    }

    // Promemoria delle regole che l'app non puo` far rispettare da sola.
    const promemoria = [
        esito.costo,
        esito.stessaSequenza,
        esito.stessoBersaglio
    ].filter(Boolean);
    console.log('🔗 Ordine Coordinato valido. Promemoria:\n' + promemoria.join('\n'));

    window.procediAlleAzioni();
};

// --- UI: AGGIORNAMENTO TITOLO DURANTE L'ESECUZIONE ---
window.mostraTitoloUnitaCorrente = () => {
    let currentUnit = window.coordUnits[window.coordIndex];
    let header = document.getElementById('battle-header');
    
    if (window.coordMode && currentUnit) {
        let nomePuro = (currentUnit.name || currentUnit.nome).split('(')[0].trim().toUpperCase();
        let alias = (currentUnit.alias || "").toUpperCase().trim();
        let testoAlias = (alias !== "" && alias !== nomePuro) ? ` "${alias}"` : "";
        
        let isSpearhead = (currentUnit.id === window.spearheadUnit.id);
        
        // UI Dinamica: Spiega all'utente cosa sta succedendo ai dadi (Regola N5)
        // 🔴 La Punta di Lancia usa META` del Burst, non il Burst pieno.
        // Qui c'era scritto "FULL BURST", che e` il contrario della regola.
        let dadi = '';
        if (window.MotoreN5 && currentUnit.weapon) {
            const arma = window.MotoreN5.profiloArma(String(currentUnit.weapon).split(',')[0]);
            if (!arma.nonTrovata && !arma.soloModalita) {
                const b = window.MotoreN5.burstIniziale(currentUnit, arma, {
                    azione: window.MotoreN5.AZIONI.BS_ATTACK,
                    coordMode: true, indiceCoord: window.coordIndex
                });
                dadi = ` — B${b.valore}`;
            }
        }
        let lanciaStr = isSpearhead 
            ? `<br><span style="font-size:16px; color:#00ff00;">[🎯 PUNTA DI LANCIA — metà Burst${dadi}]</span>` 
            : `<br><span style="font-size:16px; color:#ff9900;">[GREGARIO — Burst 1]</span>`;
        
        header.style.display = 'block';
        header.innerHTML = `<h2 style="margin-bottom:0;">-- ${nomePuro}${testoAlias} --</h2>${lanciaStr}`;
    } else {
        header.style.display = 'none';
        header.innerHTML = "";
    }
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_coordinato.js', versione: '2026-09-10.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

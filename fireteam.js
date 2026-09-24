// @versione 2026-09-10.1 | fireteam.js | proprieta`: chat MOTORE
// ==========================================
// 🔥 FIRETEAM (N5) - fireteam.js
// ------------------------------------------
// I bonus passano da MotoreN5.
//
// CORREZIONE: il Livello del Fireteam NON e` il numero di membri, ma il
// numero di truppe della STESSA UNITA`. Un Fireteam di cinque truppe di
// Unita` diverse e` di Livello 1. Contando le teste, questo file dava a
// ogni Fireteam misto tutti e cinque i bonus.
// ==========================================

window.fireteamManager = {
    /**
     * Calcola i membri attivi di un Fireteam specifico.
     * Usa lo stesso criterio di checkRottura() per restare coerente: un membro che ha
     * rotto l'appartenenza al Fireteam non va contato tra i membri attivi.
     */
    getMembriAttivi: function(roster, combatGroup, teamId) {
        if (!teamId) return [];
        return roster.filter(m => 
            m.combatGroup === combatGroup && 
            m.states && m.states.fireteam === teamId &&
            !window.fireteamManager.checkRottura(m.states, m.state === 'DEAD')
        );
    },

    /**
     * Bonus Fireteam, secondo il regolamento N5.
     *
     * 🔴 IL LIVELLO NON E` IL NUMERO DI MEMBRI. E` il numero di truppe
     * della STESSA UNITA`. Un Fireteam di cinque truppe di Unita` diverse
     * e` di Livello 1: nessun bonus oltre l'attivazione con un Ordine solo.
     *
     * Questa funzione prendeva il conteggio delle teste, quindi dava a ogni
     * Fireteam misto +1 SD, +3 Discover, +1 Dodge, +1 BS e Sesto Senso.
     *
     * Accetta un ARRAY di membri (corretto) o un numero (comportamento
     * vecchio, tenuto per i chiamanti non ancora aggiornati ma segnalato).
     */
    getBonus: function(membri) {
        const M = window.MotoreN5;
        if (!M) return { specialDie: false, discover: 0, dodge: 0, bs: 0, sixthSense: false, livello: 0 };

        if (typeof membri === 'number') {
            console.warn('fireteamManager.getBonus: ricevuto un NUMERO di membri. ' +
                'Il Livello del Fireteam si calcola sulle truppe della stessa Unità: ' +
                'passare l\'array dei membri.');
            const finto = [];
            for (let i = 0; i < membri; i++) finto.push({ nome: 'Sconosciuta ' + i });
            membri = finto;
        }

        const b = M.bonusFireteam(membri || []);
        return {
            livello: b.livello,
            membri: b.membri,
            specialDie: b.sd > 0,
            discover: b.discover,
            dodge: b.dodge,
            bs: b.bs,
            sixthSense: b.sestoSenso,
            elenco: b.elenco,
            note: b.note
        };
    },

    /**
     * Una truppa esce dal Fireteam? Regola sola, nel motore.
     *
     * Le dieci cause ufficiali stanno in CATALOGO_N5.FIRETEAM_INTEGRITA.
     * Questo file ne conosceva quattro, logica_stati.js quattro diverse, e
     * le due liste si contraddicevano su Immobilizzato e Soppressione.
     *
     * Firma invariata per i chiamanti esistenti: (stati, isDead).
     * Si puo` passare anche l'unita` intera piu` un evento.
     */
    checkRottura: function(s, isDead, evento) {
        const M = window.MotoreN5;
        if (!M) return !!(s && (s.unconscious || s.isolated)) || !!isDead;

        // (stati, isDead) oppure (unita, evento)
        const unita = (s && s.states) ? s : { states: s || {}, state: isDead ? 'DEAD' : 'ACTIVE' };
        return M.rotturaFireteam(unita, evento || (typeof isDead === 'object' ? isDead : {})).esce;
    },

    /** Il dettaglio, quando serve spiegare perché. */
    dettaglioRottura: function(unita, evento) {
        const M = window.MotoreN5;
        if (!M) return { esce: false, cause: [] };
        return M.rotturaFireteam(unita, evento);
    },

    /** Una truppa può ENTRARE in un Fireteam? Non c'era. */
    puoEntrare: function(unita) {
        const M = window.MotoreN5;
        if (!M) return { puo: true, blocchi: [] };
        return M.puoEntrareInFireteam(unita);
    }
};

// ==========================================
// 🎨 INTERFACCIA E UI (Pannello Stati)
// ==========================================

window.renderFTPanel = () => {
    let panel = document.getElementById('ft-dynamic-panel');
    if(!panel) return;
    
    // Salva se avevi già cliccato il leader prima di cambiare team
    let leaderCb = document.getElementById('st-ft-leader');
    if (leaderCb) window.tempLeader = leaderCb.checked;

    // Conta i membri per determinare l'icona
    let count = 0;
    if (window.tempFT !== "") {
        count = window.roster.filter(m => 
            m !== window.unitToEdit && 
            m.combatGroup === window.unitToEdit.combatGroup && 
            m.states && m.states.fireteam === window.tempFT && 
            !window.fireteamManager.checkRottura(m.states, m.state === 'DEAD')
        ).length + 1;
    }

    let ftType = "NESSUNO";
    let ftIcon = "img/icon_ft_core.png"; 
    if (count > 0 && count <= 2) { ftType = "DUO"; ftIcon = "img/icon_ft_duo.png"; }
    else if (count === 3) { ftType = "HARIS"; ftIcon = "img/icon_ft_haris.png"; }
    else if (count >= 4) { ftType = "CORE"; ftIcon = "img/icon_ft_core.png"; }

    // Colore dinamico in base alla fazione (legge il tag dal CSS/Title)
    const accentColor = document.title.includes("NOMADS") ? "#00ffff" : "#00ccff";
    let btnText = window.tempFT === "" ? "NESSUNO" : `TEAM ${window.tempFT}`;
    let btnColor = window.tempFT === "" ? "#555" : accentColor;
    let btnBg = window.tempFT === "" ? "#111" : "#002244";

    let leaderHtml = "";
    if (window.tempFT !== "") {
        leaderHtml = `
            <div style="text-align:center;">
                <label class="state-label" title="Fireteam Leader" style="margin:0; width:auto;">
                    <input type="checkbox" id="st-ft-leader" class="state-checkbox" ${window.tempLeader ? 'checked' : ''}>
                    <img src="${ftIcon}" class="state-icon" style="width:70px; height:70px;" onerror="this.outerHTML='<span class=\\'fallback-emoji\\' style=\\'font-size:50px; line-height:70px;\\'>👑</span>'">
                </label>
            </div>
        `;
    } else {
        leaderHtml = `<input type="hidden" id="st-ft-leader" value="false">`;
    }

    panel.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px; flex:1;">
            <button class="huge-btn" style="flex:none; width:150px; min-height:70px; margin:0; background:${btnBg}; border-color:${btnColor}; color:${window.tempFT==='' ? '#888' : '#fff'}; font-size:26px;" onclick="window.cycleFireteam()">
                ${btnText}
            </button>
            <div style="color:var(--nomad-orange); font-size:18px; font-weight:bold; text-align:center; flex:1;">
                ${window.tempFT !== "" ? `TIPO:<br><span style="color:#fff; font-size:28px; text-shadow: 0 0 5px #fff;">${ftType}</span>` : ''}
            </div>
        </div>
        ${leaderHtml}
        <input type="hidden" id="st-ft-team" value="${window.tempFT}">
    `;
};

window.cycleFireteam = () => {
    if (window.tempFT === "") window.tempFT = "A";
    else if (window.tempFT === "A") window.tempFT = "B";
    else if (window.tempFT === "B") window.tempFT = "C";
    else window.tempFT = "";
    
    if (window.tempFT === "") window.tempLeader = false;
    window.renderFTPanel();
};

// ==========================================
// 🚩 BANNER FASE ATTIVA
// ==========================================

window.calcolaEMostraFireteam = () => {
    let banner = document.getElementById('fireteam-banner');
    if (!banner || !window.currentOrder || !window.currentOrder.unit) return;
    
    let u = window.currentOrder.unit;
    let teamId = u.states ? u.states.fireteam : "";
    
    if (!teamId) {
        banner.style.display = 'none';
        return;
    }

    let teamMembers = window.fireteamManager.getMembriAttivi(window.roster, u.combatGroup, teamId);
    let membriAttivi = teamMembers.length;
    let hasLeader = teamMembers.some(m => m.states.isFireteamLeader);

    if (membriAttivi < 2) {
         banner.style.display = 'block';
         banner.innerHTML = `⚠️ TEAM ${teamId} INATTIVO (Solo ${membriAttivi} membro valido rimasto)`;
         banner.style.background = '#8b0000';
         banner.style.borderColor = '#ff0000';
         banner.style.boxShadow = '0 0 10px #ff0000';
         return;
    }

    // Si passa l'ARRAY dei membri: il Livello dipende da quante truppe
    // appartengono alla stessa Unita`, non da quante sono in tutto.
    let stats = window.fireteamManager.getBonus(teamMembers);
    let bonus = stats.elenco && stats.elenco.length ? stats.elenco.slice() : [];
    
    let leaderText = hasLeader ? "" : "<br><span style='color:#ff0000;'>[ NESSUN LEADER ASSEGNATO! ]</span>";

    banner.style.display = 'block';
    banner.style.background = '#8b4500';
    banner.style.borderColor = '#ffa500';
    banner.style.boxShadow = '0 0 10px #ffa500';
    // Il Livello e` l'informazione che conta: con 5 membri di Unita` diverse
    // e` 1, e i bonus non ci sono.
    const notaLivello = stats.livello < membriAttivi
        ? `<br><span style="font-size:13px; color:#ffaa66;">Livello ${stats.livello} su ${membriAttivi} membri: solo ${stats.livello} appartengono alla stessa Unità.</span>`
        : '';
    banner.innerHTML = `🔥 FIRETEAM ${teamId} — LIVELLO ${stats.livello} (${membriAttivi} membri) 🔥${leaderText}${notaLivello}` +
        `<br><span style="font-size:15px; font-weight:normal;">Bonus: <b style="color:#ffff00;">${bonus.join(' | ') || 'nessuno'}</b></span>`;
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'fireteam.js', versione: '2026-09-10.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

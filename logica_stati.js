// @versione 2026-09-23.3 | logica_stati.js | proprieta`: chat MOTORE
// ==========================================
// NOTA: le regole di questo file passano da MotoreN5.
//  - la cancellazione degli stati Marker (Ritirata!, Ingaggiato, Stati Nulli)
//  - l'uscita dal Fireteam, che qui includeva a torto gli Immobilizzati e
//    ometteva il Fuoco di Soppressione. Le dieci cause ufficiali stanno in
//    CATALOGO_N5.FIRETEAM_INTEGRITA.
// ==========================================
// 🟢 LOGICA STATI E FIRETEAM (N5) - AGGIORNATA
// ==========================================

window.unitToEdit = null;
window.tempFT = "";
window.tempLeader = false;
window.tempCamoState = "CAMO";
window.tempImpState = "IMP_1";

/**
 * Apre l'interfaccia degli Stati per l'unità selezionata
 */
window.apriPaginaStati = (index) => {
    window.unitToEdit = window.roster[index];
    
    // 1. INIZIALIZZAZIONE DI SICUREZZA (con i nuovi stati N5)
    if(!window.unitToEdit.states) {
        window.unitToEdit.states = { 
            unconscious: false, immobilizedA: false, immobilizedB: false, 
            isolated: false, targeted: false, stunned: false, suppressive: false, 
            camo: false, impersonation: false, fireteam: "", isFireteamLeader: false,
            disconnected: false, possessed: false, sepsitorized: false,
            hidden: false, reserve: false,
            engaged: false, retreat: false, foxhole: false, holoecho: false, holomask: false, decoy: false
        };
    }
    
    let s = window.unitToEdit.states;
    let isDead = window.unitToEdit.state === 'DEAD';
    
    // 2. LETTURA PROFILO PER LIMITARE GLI STATI SPECIALI
    let skills = (window.unitToEdit.skills || "").toLowerCase();
    
    // Verifica permessi per gli stati Marker / Speciali
    let canCamo = skills.includes('camo') || window.unitToEdit.tipo === "MARKER";
    // Camouflage (1 Use): dopo averlo usato non si ripropone la casella (F07).
    let notaCamo = '';
    const Mc = window.MotoreN5;
    if (canCamo && Mc && typeof Mc.puoEntrareInCamo === 'function') {
        const pc = Mc.puoEntrareInCamo(window.unitToEdit);
        if (!pc.puo) { canCamo = false; notaCamo = pc.motivo || ''; }
    }
    let canImp = skills.includes('impersonation') || skills.includes('imp-1') || skills.includes('imp-2');
    let canHolo = skills.includes('holoprojector') || skills.includes('holomask') || skills.includes('holo');
    let canDecoy = skills.includes('decoy');
    let canFoxhole = skills.includes('sapper');

    // Livelli intelligenti Camo/Imp
    // 🔴 UN SOLO stato CAMO: in N5 il Marker Mimetico e` uno e mostra il
    // Mimetism (-N) del profilo (riga 13607). Qui c'erano tre livelli
    // (CAMO_0/3/6) scelti cercando "-6" e "-3" in TUTTA la stringa delle skill:
    // un Helot prendeva il -3 dal suo "Surprise Attack (-3)". Il MOD si legge
    // con M.valoreMimetismo, come fa lo schieramento. (Chat INTERFACCIA/REGOLE.)
    window.tempCamoState = "CAMO";
    let camoIcon = "img/icon_camo.png";
    let camoTitle = "Camo";
    const Mcamo = window.MotoreN5;
    const modMim = (Mcamo && typeof Mcamo.valoreMimetismo === 'function') ? (Mcamo.valoreMimetismo(window.unitToEdit) || 0) : 0;
    if (modMim) camoTitle = `Camo (${modMim})`;
    // Le icone per MOD vanno bene — il segnalino MOSTRA il Mimetism (riga
    // 13607) — ma la fonte e` il profilo via motore, non la stringa delle
    // skill: prima 6 profili con Camouflage senza Mimetism ma con "Surprise
    // Attack (-3)" mostravano CAMO (-3). Lo stato resta uno: 'CAMO'.
    // (Chat REGOLE, 21 settembre.)
    if (modMim <= -6) camoIcon = "img/icon_camo6.png";
    else if (modMim <= -3) camoIcon = "img/icon_camo3.png";
    // Le icone per MOD vanno bene (riga 13607: il segnalino mostra il MOD del
    // Mimetism). Sbagliata era la FONTE: ora e` il profilo, via il motore.
    if (modMim <= -6) camoIcon = "img/icon_camo6.png";
    else if (modMim <= -3) camoIcon = "img/icon_camo3.png";

    window.tempImpState = "IMP_1";
    let impIcon = "img/icon_imp1.png";
    let impTitle = "Impersonation-1";
    if (skills.includes('impersonation-2') || skills.includes('imp-2') || skills.includes('imp 2')) {
        window.tempImpState = "IMP_2"; impIcon = "img/icon_imp2.png"; impTitle = "Impersonation-2";
    }

    // Nascondi le altre schermate e mostra gli stati
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-states').style.display = 'block';
    let header = document.getElementById('battle-header');
    if(header) header.style.display = 'none';

    // 3. GENERAZIONE DINAMICA DELLA GRIGLIA UI
    // Inseriamo prima tutti gli stati COMUNI (accessibili a tutti)
    let html = `
        <div style="background:#111; padding:15px; border:1px solid #444; border-radius:8px; height: 60vh; overflow-y: auto;">
            <div class="state-grid" id="main-state-grid">
                <label class="state-label" title="Morto">
                    <input type="checkbox" id="st-dead" class="state-checkbox" ${isDead ? 'checked' : ''}>
                    <img src="img/icon_dead.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>☠️</span>'">
                </label>
                <label class="state-label" title="Incosciente">
                    <input type="checkbox" id="st-unc" class="state-checkbox" ${s.unconscious ? 'checked' : ''}>
                    <img src="img/icon_unc.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>💤</span>'">
                </label>
                <label class="state-label" title="Ingaggiato in CC">
                    <input type="checkbox" id="st-engaged" class="state-checkbox" ${s.engaged ? 'checked' : ''}>
                    <img src="img/icon_engaged.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>⚔️</span>'">
                </label>
                <label class="state-label" title="Isolato">
                    <input type="checkbox" id="st-iso" class="state-checkbox" ${s.isolated ? 'checked' : ''}>
                    <img src="img/icon_isolated.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>📵</span>'">
                </label>
                <label class="state-label" title="Immobilizzato-A">
                    <input type="checkbox" id="st-imma" class="state-checkbox" ${s.immobilizedA ? 'checked' : ''}>
                    <img src="img/icon_imma.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🛑</span>'">
                </label>
                <label class="state-label" title="Immobilizzato-B">
                    <input type="checkbox" id="st-immb" class="state-checkbox" ${s.immobilizedB ? 'checked' : ''}>
                    <img src="img/icon_immb.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🛑</span>'">
                </label>
                <label class="state-label" title="Bersagliato">
                    <input type="checkbox" id="st-tgt" class="state-checkbox" ${s.targeted ? 'checked' : ''}>
                    <img src="img/icon_targeted.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🎯</span>'">
                </label>
                <label class="state-label" title="Stordito">
                    <input type="checkbox" id="st-stun" class="state-checkbox" ${s.stunned ? 'checked' : ''}>
                    <img src="img/icon_stunned.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>😵</span>'">
                </label>
                <label class="state-label" title="Fuoco di Soppressione">
                    <input type="checkbox" id="st-supp" class="state-checkbox" ${s.suppressive ? 'checked' : ''}>
                    <img src="img/icon_suppressive.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🔥</span>'">
                </label>
                <label class="state-label" title="In Ritirata! (Retreat)">
                    <input type="checkbox" id="st-retreat" class="state-checkbox" ${s.retreat ? 'checked' : ''}>
                    <img src="img/icon_retreat.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🏳️</span>'">
                </label>
                <label class="state-label" title="Disconnesso">
                    <input type="checkbox" id="st-disc" class="state-checkbox" ${s.disconnected ? 'checked' : ''}>
                    <img src="img/icon_disconnected.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🔌</span>'">
                </label>
                <label class="state-label" title="Posseduto (TAG)">
                    <input type="checkbox" id="st-poss" class="state-checkbox" ${s.possessed ? 'checked' : ''}>
                    <img src="img/icon_possessed.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>👾</span>'">
                </label>
                <label class="state-label" title="Sepsitorizzato">
                    <input type="checkbox" id="st-seps" class="state-checkbox" ${s.sepsitorized ? 'checked' : ''}>
                    <img src="img/icon_sepsitorized.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>👽</span>'">
                </label>`;

    // 4. INSERIMENTO CONDIZIONALE DEGLI STATI SPECIALI (RESTRIZIONI N5)
    if (canCamo) {
        html += `<label class="state-label" title="${camoTitle}">
                    <input type="checkbox" id="st-camo" class="state-checkbox" ${s.camo ? 'checked' : ''}>
                    <img src="${camoIcon}" class="state-icon" onerror="this.src='img/icon_camo.png'; this.onerror=function(){this.outerHTML='<span class=\\'fallback-emoji\\'>👻</span>'};">
                 </label>`;
    }
    if (canImp) {
        html += `<label class="state-label" title="${impTitle}">
                    <input type="checkbox" id="st-imp" class="state-checkbox" ${s.impersonation ? 'checked' : ''}>
                    <img src="${impIcon}" class="state-icon" onerror="this.src='img/icon_imp1.png'; this.onerror=function(){this.outerHTML='<span class=\\'fallback-emoji\\'>👤</span>'};">
                 </label>`;
    }
    if (canHolo) {
        html += `<label class="state-label" title="HoloMask / HoloEcho">
                    <input type="checkbox" id="st-holo" class="state-checkbox" ${(s.holoecho || s.holomask) ? 'checked' : ''}>
                    <img src="img/icon_holo.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>👥</span>'">
                 </label>`;
    }
    if (canDecoy) {
        html += `<label class="state-label" title="Decoy">
                    <input type="checkbox" id="st-decoy" class="state-checkbox" ${s.decoy ? 'checked' : ''}>
                    <img src="img/icon_decoy.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🃏</span>'">
                 </label>`;
    }
    if (canFoxhole) {
        html += `<label class="state-label" title="Foxhole (Trincea S3, Cov, Mim-3)">
                    <input type="checkbox" id="st-foxhole" class="state-checkbox" ${s.foxhole ? 'checked' : ''}>
                    <img src="img/icon_foxhole.png" class="state-icon" onerror="this.outerHTML='<span class=\\'fallback-emoji\\'>🕳️</span>'">
                 </label>`;
    }

    html += `</div></div>
        <div id="ft-dynamic-panel" style="background:#222; border:1px solid #444; padding:10px; margin-top:15px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
        </div>
        <div style="display:flex; gap:10px; margin-top:20px;">
            <button class="huge-btn" style="flex:1; background:#330000; border-color:#ff0000;" onclick="window.annullaStati()">ANNULLA</button>
            <button class="huge-btn" style="flex:2; background:#003300; border-color:#00ff00;" onclick="window.salvaStatiUnita()">CONFERMA E SALVA</button>
        </div>`;
    
    document.getElementById('states-content').innerHTML = html;

    window.tempFT = s.fireteam || "";
    window.tempLeader = s.isFireteamLeader || false;
    setTimeout(() => window.renderFTPanel(), 50);
};

/**
 * Gestisce l'interfaccia di selezione dei Fireteam
 */
window.renderFTPanel = () => {
    let panel = document.getElementById('ft-dynamic-panel');
    if(!panel) return;
    
    let leaderCb = document.getElementById('st-ft-leader');
    if (leaderCb) window.tempLeader = leaderCb.checked;

    let count = 0;
    if (window.tempFT !== "") {
        count = window.roster.filter(m => 
            m !== window.unitToEdit && 
            m.combatGroup === window.unitToEdit.combatGroup && 
            m.states && m.states.fireteam === window.tempFT && 
            m.state !== 'DEAD'
        ).length + 1;
    }

    let ftType = "NESSUNO";
    let ftIcon = "img/icon_ft_core.png";
    if (count > 0 && count <= 2) { ftType = "DUO"; ftIcon = "img/icon_ft_duo.png"; }
    else if (count === 3) { ftType = "HARIS"; ftIcon = "img/icon_ft_haris.png"; }
    else if (count >= 4) { ftType = "CORE"; ftIcon = "img/icon_ft_core.png"; }

    let btnText = window.tempFT === "" ? "NESSUNO" : `TEAM ${window.tempFT}`;
    let btnColor = window.tempFT === "" ? "#555" : "var(--nomad-red)"; 
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

// ⚠️ CONTRATTO — l'interfaccia (app.html) si appoggia a queste due cose:
//   1. annullaStati resta una funzione su window, con questo nome;
//   2. salvaStatiUnita chiude passando da annullaStati (riga ~393).
// Se una delle due cambia, avvisare la chat INTERFACCIA.
//
// Tre ritorni possibili. Il terzo — lo schieramento — l'interfaccia lo
// gestiva con un ponte in app.html; ora e` qui, letto dallo stesso flag
// che mette lei, cosi` il ponte si puo` togliere. (21 settembre.)
window.annullaStati = () => {
    if (window.statiApertiDalloSchieramento) {
        window.statiApertiDalloSchieramento = false;
        if (typeof window.goToStep === 'function') {
            window.goToStep('step-deploy-units');
        } else {
            document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
            const d = document.getElementById('step-deploy-units');
            if (d) d.style.display = 'flex';
        }
        // La pagina degli stati scrive deployState, e la riga dello
        // schieramento lo mostra: senza ridisegnare, un'unita` riportata in
        // chiaro teneva l'etichetta "SEGNALINO CAMO". (Chat INTERFACCIA.)
        if (typeof window.renderDeployUnits === 'function') window.renderDeployUnits();
        return;
    }
    if (window.isReactiveMode) {
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        document.getElementById('step-reactive-turn').style.display = 'flex';
        if(window.renderReactiveRoster) window.renderReactiveRoster();
    } else {
        let header = document.getElementById('battle-header');
        if(header) header.style.display = 'block';
        window.apriSelezioneTruppe(window.currentGroup, window.isCoordinated);
    }
};

/**
 * Salva i dati, gestisce le regole di rottura Fireteam ed Esclusività N5
 */
window.salvaStatiUnita = () => {
    let s = window.unitToEdit.states;
    
    // 1. LETTURA CHECKBOX COMUNI
    let isDead = document.getElementById('st-dead').checked;
    s.unconscious = document.getElementById('st-unc').checked;
    s.engaged = document.getElementById('st-engaged').checked;
    s.immobilizedA = document.getElementById('st-imma').checked;
    s.immobilizedB = document.getElementById('st-immb').checked;
    s.isolated = document.getElementById('st-iso').checked;
    // Prono ritirato (23 sett.): la casella non c'e` piu`, e leggerla qui rompeva il salvataggio.
    s.targeted = document.getElementById('st-tgt').checked;
    s.stunned = document.getElementById('st-stun').checked;
    s.suppressive = document.getElementById('st-supp').checked;
    s.retreat = document.getElementById('st-retreat').checked;
    // Scarico non gestito dall'app (23 sett.): casella tolta, e con lei questa lettura.
    s.disconnected = document.getElementById('st-disc').checked;
    s.possessed = document.getElementById('st-poss').checked;
    s.sepsitorized = document.getElementById('st-seps').checked;

    // 2. LETTURA CHECKBOX SPECIALI (se presenti nel DOM)
    s.camo = document.getElementById('st-camo') ? document.getElementById('st-camo').checked : false;
    s.impersonation = document.getElementById('st-imp') ? document.getElementById('st-imp').checked : false;
    
    let isHolo = document.getElementById('st-holo') ? document.getElementById('st-holo').checked : false;
    if(isHolo) { s.holoecho = true; s.holomask = true; } else { s.holoecho = false; s.holomask = false; }
    
    s.decoy = document.getElementById('st-decoy') ? document.getElementById('st-decoy').checked : false;
    s.foxhole = document.getElementById('st-foxhole') ? document.getElementById('st-foxhole').checked : false;

    // 3. LOGICA ESCLUSIVITÀ E RISOLUZIONE CONFLITTI N5
    if (isDead) s.unconscious = false; 
    
    // Ritirata!, Ingaggiato e Stati Nulli cancellano gli stati Marker.
    // La regola sta nel motore: qui si applica soltanto.
    if (window.MotoreN5) {
        const canc = window.MotoreN5.cancellaStatiMarker(Object.assign(s, { dead: isDead }));
        delete s.dead;
        if (canc.cancellati.length) console.log('🔄 Stati Marker cancellati: ' + canc.cancellati.join(', ') + ' — ' + canc.motivo);
    }

    // Gestione Testo DeployState Plancia per la UI visiva
    if (s.camo) {
        window.unitToEdit.deployState = window.tempCamoState;
        // Entrare in CAMO consuma il Camouflage (1 Use).
        if (window.MotoreN5 && typeof window.MotoreN5.consumaCamo === 'function') {
            window.unitToEdit.camoUsato = window.MotoreN5.consumaCamo(window.unitToEdit).unitaAggiornata.camoUsato;
        }
    }
    else if (s.impersonation) window.unitToEdit.deployState = window.tempImpState;
    else if (window.unitToEdit.deployState && (window.unitToEdit.deployState.startsWith('CAMO') || window.unitToEdit.deployState.startsWith('IMP'))) {
        window.unitToEdit.deployState = "NORMAL";
    }
    
    // 4. GESTIONE FIRETEAM E ROTTURE N5
    let ftTeam = document.getElementById('st-ft-team').value;
    let leaderEl = document.getElementById('st-ft-leader');
    let isLeader = leaderEl ? (leaderEl.checked || false) : false;

    if (!ftTeam) isLeader = false;

    // 🔴 Le condizioni che rompono il Fireteam vengono dal motore.
    // Questa riga includeva Immobilizzato-A e -B, che NON sono cause di
    // rottura, e ometteva il Fuoco di Soppressione, che invece lo e`.
    let rottura = { esce: false, cause: [], note: [] };
    if (window.MotoreN5) {
        rottura = window.MotoreN5.rotturaFireteam(
            { states: s, state: isDead ? 'DEAD' : 'ACTIVE' }, {});
    }
    let isBroken = rottura.esce;

    if (rottura.note.length) console.log('ℹ️ ' + rottura.note.join(' '));

    if (isBroken && ftTeam) {
        alert(`⚠️ ${rottura.motivo}\n\nEsce dal Fireteam ${ftTeam}.` +
              (rottura.rientro ? `\n\n${rottura.rientro}` : ''));
        
        if (isLeader) {
            alert(`🚨 IL LEADER È STATO NEUTRALIZZATO! Il Fireteam ${ftTeam} si è sciolto!`);
            window.roster.forEach(m => {
                if (m.states && m.states.fireteam === ftTeam) {
                    m.states.fireteam = "";
                    m.states.isFireteamLeader = false;
                }
            });
        }
        ftTeam = "";
        isLeader = false;
    }

    // Assicura che esista un solo leader per team
    if (isLeader && ftTeam) {
        window.roster.forEach(m => {
            if (m !== window.unitToEdit && m.states && m.states.fireteam === ftTeam && m.states.isFireteamLeader) {
                m.states.isFireteamLeader = false;
            }
        });
    }

    s.fireteam = ftTeam;
    s.isFireteamLeader = isLeader;

    // Aggiorna lo stato vitale principale
    if (isDead) window.unitToEdit.state = 'DEAD';
    else if (s.unconscious) window.unitToEdit.state = 'UNCONSCIOUS';
    else window.unitToEdit.state = 'ACTIVE';

    // --- NUOVA LOGICA DI SINCRONIZZAZIONE POTENZIATA ---
    const fazione = document.title.includes("NOMADS") ? "NOMADI" : "PANOCEANIA";
    
    // Invia il pacchetto completo all'Hub
    const updatePayload = {
        fazione: fazione,
        unitId: window.unitToEdit.id,
        newState: window.unitToEdit.state,    // Stato vitale (ACTIVE, DEAD, UNCONSCIOUS) [cite: 1810, 1843]
        fullStates: window.unitToEdit.states, // TUTTI i flag (prone, engaged, camo, ecc.) [cite: 154]
        timestamp: Date.now()
    };
    
    localStorage.setItem(window.MotoreN5.CANALI.HUB_STATO, JSON.stringify(updatePayload));
    
    // Aggiorna anche il roster completo per sicurezza
    if (typeof window.sendDataToServer === "function") {
        const setupPayload = { 
            roster: window.roster, 
            strutture: window.activeStructures || [], 
            terreni: window.activeTerrains || [], 
            timestamp: Date.now() 
        };
        let canaleStr = window.MotoreN5.canaleSetup(fazione);
        localStorage.setItem(canaleStr, JSON.stringify(setupPayload));
    }

    // I profili hanno `nome`, non sempre `alias`: stampava "undefined". (Chat TEST.)
    console.log("Stati salvati e sincronizzati per:", window.unitToEdit.alias || window.unitToEdit.nome);
    window.annullaStati(); 
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'logica_stati.js', versione: '2026-09-21.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

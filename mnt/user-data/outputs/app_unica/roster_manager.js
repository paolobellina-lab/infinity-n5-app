// @versione 2026-09-19.1 | roster_manager.js | proprieta`: chat INTERFACCIA
// ==========================================
// 📋 GESTORE SCHIERAMENTO E ROSTER (UNIVERSALE)
// ==========================================

// Variabili globali di stato per il setup
window.roster = window.roster || [];
window.activeTerrains = window.activeTerrains || [];
window.activeStructures = window.activeStructures || [];

// Variabili per la UI di dispiegamento
window.deployGroup = 1;
window.deployPressTimer = null;
window.isDeployPressing = false;
window.schieramentoCompletato = false;

// ==========================================
// 🛠️ HELPER GLOBALI FAZIONE
// ==========================================
window.isNomadsApp = () => {
    return document.title.toUpperCase().includes("NOMADS");
};

// Nomi canonici dei database di fazione: DB_NOMADI e DB_PANOCEANIA, nessun
// sinonimo. Qui si leggeva DB_PANO, che non e` definito da nessun file del
// progetto: la app PanOceania non trovava il database pur avendo il file
// regolarmente collegato. Niente ripiego sul nome vecchio — accettare un
// simbolo che non esiste lo fa sembrare una variante legittima e nasconde
// l'errore invece di segnalarlo. Se il nome e` sbagliato deve dare errore.
window.getDbFazione = () => {
    return window.isNomadsApp() ? window.DB_NOMADI : window.DB_PANOCEANIA;
};

window.getStorageKey = () => {
    return window.isNomadsApp() ? 'infinityRosters_Nomads' : 'infinityRosters_Panoceania';
};

window.getPlayerTag = () => {
    return window.isNomadsApp() ? 'G_NOMADS' : 'G_PANO';
};

window.getSetupChannel = () => {
    return window.isNomadsApp() ? 'canale_setup_nomadi' : 'canale_setup_panoceania';
};


// --- INIZIALIZZAZIONE ---
window.inizializzaApp = () => {
    const dbFazione = window.getDbFazione();
    
    // Il messaggio dice QUALE dato manca e con che nome: "controlla il file"
    // mandava a cercare un collegamento rotto quando il file c'era e il nome
    // della variabile no.
    const mancanti = [];
    if (!dbFazione) mancanti.push(window.isNomadsApp() ? 'DB_NOMADI (database_nomad.js)' : 'DB_PANOCEANIA (database_panoceania.js)');
    if (!window.DB_TERRENI) mancanti.push('DB_TERRENI (database_comune.js)');

    if (mancanti.length) {
        const messaggio = 'Database non leggibile.\n\nManca: ' + mancanti.join('\n') + 
            '\n\nIl file puo` essere collegato e il nome della variabile diverso: controlla entrambi.';
        console.error('\u26d4', messaggio);
        alert(messaggio);
        return;
    }
    
    // 1. Popola la tendina delle TRUPPE.
    //    Le strutture non stanno piu` qui: erano sepolte in mezzo a oltre
    //    duecento gruppi di truppe, e per aggiungere una console bisognava
    //    sapere che era li`. Ora hanno la loro tendina nella sezione terreno,
    //    che e` il posto dove si decide com'e` fatto il tavolo.
    let tuttiIProfili = [...dbFazione];

    const gruppiUnici = [...new Set(tuttiIProfili.map(u => u.nome.split('(')[0].trim()))].sort();
    const groupSelect = document.getElementById('groupSelect');
    gruppiUnici.forEach(nome => { 
        const opt = document.createElement('option'); 
        opt.value = nome; 
        opt.textContent = nome; 
        groupSelect.appendChild(opt); 
    });

    // 2. Popola la tendina dei Terreni leggendo il database
    const terrSelect = document.getElementById('terrainSelect');
    terrSelect.innerHTML = '<option value="">-- Seleziona Terreno --</option>';
    window.DB_TERRENI.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.nome;
        terrSelect.appendChild(opt);
    });

    // 3. Ricarica liste salvate e genera menu gruppi
    window.popolaTendinaStrutture();
    window.refreshSavedRostersList();
    if (window.aggiornaMenuGruppi) window.aggiornaMenuGruppi();
};

window.updateProfileSelect = () => {
    const groupName = document.getElementById('groupSelect').value;
    const profileSelect = document.getElementById('profileSelect');
    profileSelect.innerHTML = '<option value="">-- 2. SELEZIONA PROFILO --</option>';
    profileSelect.disabled = !groupName;
    
    if (groupName) {
        const dbFazione = window.getDbFazione();
        let tuttiIProfili = [...dbFazione];

        tuttiIProfili.filter(u => u.nome.startsWith(groupName)).forEach(unit => {
            const opt = document.createElement('option'); 
            opt.value = unit.id; 
            let armaPrincipale = unit.weapon ? unit.weapon.split(',')[0].trim() : "Senza Arma";
            opt.textContent = `${unit.nome} - [${armaPrincipale}]`;
            profileSelect.appendChild(opt);
        });
    }
};

// --- GESTIONE TERRENI E STRUTTURE ---

// Gli elementi scenici (torrette, console, antenne, porte) stanno sul tavolo
// e non appartengono a nessuno dei due giocatori: si scelgono dove si
// descrive il terreno, non dove si schiera la propria truppa.
// Alcuni elementi non portano un'arma propria: l'Armed Turret ha
// weapon: null e armaDalProfilo: true, perche` il regolamento dice che l'arma
// e` quella indicata nel profilo della truppa che la schiera. Le armi
// possibili non le inventiamo: sono le voci di RULES_WEAPONS intestate
// all'elemento, oggi "Armed Turret (Combi Rifle)" e "(Marksman Rifle)".
window.armiPossibiliStruttura = (modello) => {
    if (!modello || !modello.armaDalProfilo) return [];
    const W = window.RULES_WEAPONS || {};
    const prefisso = (modello.nome || '') + ' (';
    return Object.keys(W).filter(k => k.indexOf(prefisso) === 0);
};

window.popolaTendinaStrutture = () => {
    const sel = document.getElementById('structureSelect');
    if (!sel) return;
    if (!window.DB_STRUTTURE) {
        console.error('\u26d4 DB_STRUTTURE assente (database_comune.js): nessun elemento scenico disponibile.');
        return;
    }
    sel.innerHTML = '<option value="">-- Seleziona Elemento --</option>';
    window.DB_STRUTTURE.forEach(st => {
        const armi = window.armiPossibiliStruttura(st);

        // Nessuna arma da scegliere: una voce sola, come prima.
        if (armi.length === 0) {
            const opt = document.createElement('option');
            opt.value = st.id;
            opt.textContent = st.nome;
            sel.appendChild(opt);
            return;
        }

        // Una voce per arma: si scegli\u0065 dalla tendina invece che con un
        // secondo passaggio, come si fa per le varianti di una truppa.
        armi.forEach(nomeArma => {
            const opt = document.createElement('option');
            opt.value = st.id + '|' + nomeArma;
            opt.textContent = nomeArma;
            sel.appendChild(opt);
        });
    });
};

window.aggiungiStruttura = () => {
    const sel = document.getElementById('structureSelect');
    if (!sel || !sel.value) return;

    const [idModello, armaScelta] = String(sel.value).split('|');
    const modello = (window.DB_STRUTTURE || []).find(st => st.id === idModello);
    if (!modello) return;

    // Un elemento con armaDalProfilo NON deve entrare in campo senz'arma:
    // il motore la cercherebbe e non la troverebbe.
    if (modello.armaDalProfilo && !armaScelta) {
        console.error('\u26d4 ' + modello.nome + ' richiede un\'arma dal profilo e non ne e` stata scelta nessuna.');
        return;
    }

    // Stesse copie ammesse: due console identiche sul tavolo sono normali,
    // quindi ognuna prende un id proprio e un soprannome numerato.
    //
    // Per un elemento con arma dal profilo il nome porta l'arma: due torrette
    // chiamate "Armed Turret" e "Armed Turret 2" non direbbero quale ha la
    // Combi e quale la Marksman, che al tavolo e` l'unica cosa che conta.
    const etichetta = armaScelta || modello.nome;
    const quante = window.activeStructures.filter(x => x.modelId === modello.id && (x.weapon || '') === (armaScelta || modello.weapon || '')).length;
    window.activeStructures.push({
        id: 's_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        modelId: modello.id,
        alias: quante ? etichetta + ' ' + (quante + 1) : etichetta,
        name: modello.nome,
        nome: modello.nome,
        tipo: modello.tipo,
        weapon: armaScelta || modello.weapon,
        ccWeapon: modello.ccWeapon,
        bs: modello.bs, ph: modello.ph, cc: modello.cc, wip: modello.wip,
        arm: modello.arm, bts: modello.bts, str: modello.str, s: modello.s,
        skills: modello.skills, equip: modello.equip,
        state: 'ACTIVE',
        neutrale: true
    });
    window.renderStructures();
};
window.addTerrain = () => {
    const val = document.getElementById('terrainSelect').value;
    if(!val) return;
    const t = window.DB_TERRENI.find(x => x.id === val);
    if(t && !window.activeTerrains.some(x => x.id === val)) {
        window.activeTerrains.push(t);
        window.renderTerrains();
    }
};

window.renderTerrains = () => {
    const container = document.getElementById('activeTerrainsList');
    if(window.activeTerrains.length === 0) return container.innerHTML = "<i>Nessun terreno speciale impostato.</i>";
    
    let borderColor = window.isNomadsApp() ? '#ff6600' : '#00ccff';
    let textColor = window.isNomadsApp() ? '#ff9900' : '#00ffff';
    let subColor = window.isNomadsApp() ? '#cc6600' : '#0088cc';

    container.innerHTML = "";
    window.activeTerrains.forEach((ter, i) => {
        let stringaTratti = ter.tratti && ter.tratti.length > 0 ? ter.tratti.join(' | ') : 'Nessun malus tattico';
        container.innerHTML += `<div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:5px 10px; margin-bottom:5px; border-left:3px solid ${borderColor}; color:#fff;">
            <span style="flex:1;"><b>${ter.nome}</b> <br><span style="font-size:11px; color:${subColor};">[${stringaTratti}]</span></span>
            <span style="color:red; font-weight:bold; cursor:pointer; padding:5px 10px;" onclick="window.activeTerrains.splice(${i},1); window.renderTerrains();">X</span>
        </div>`;
    });
};

window.renderStructures = () => {
    const container = document.getElementById('activeStructuresList');
    if(window.activeStructures.length === 0) return container.innerHTML = "<i>Nessuna struttura schierata.</i>";
    container.innerHTML = "";
    window.activeStructures.forEach((u, i) => {
        container.innerHTML += `<div class="roster-item" style="border-left-color:#888; background:#222;">
            <div><b style="color:#aaa;">[${u.tipo || 'STRUTTURA'}]</b> <b style="color:#fff;">${u.alias}</b>
                ${u.weapon && u.weapon !== '-' ? `<span style="color:#aaa; font-size:12px;"> | ${u.weapon}</span>` : ''}
                ${u.skills && u.skills !== '-' ? `<span style="color:#777; font-size:12px;"> | ${u.skills}</span>` : ''}
                ${window.modelloStrutturaMancante(u) ? `<div style="color:#ff6666; font-size:13px; font-weight:bold;">\u26a0\ufe0f MODELLO NON PIÙ NEL DATABASE (${u.modelId}) \u2014 da rimettere</div>` : ''}</div>
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="cursor:pointer; font-size:18px;" title="Assegna o cambia il soprannome" onclick="window.rinominaStruttura(${i})">✏️</div>
                <div class="del-btn" style="color:red; cursor:pointer;" onclick="window.activeStructures.splice(${i}, 1); window.renderStructures();">X</div>
            </div>
        </div>`;
    });
};

// --- IMPORTAZIONE E COSTRUZIONE ROSTER ---
window.importaDaTesto = () => {
    let text = document.getElementById('army-import-text').value;
    if(!text) return alert("Incolla prima il testo della lista dal tasto 'Plain Text' dell'Army!");

    let lines = text.split('\n');
    let count = 0;
    let currentParseGroup = 1;
    const dbFazione = window.getDbFazione();

    lines.forEach(line => {
        let lineUpper = line.toUpperCase().trim();
        if (lineUpper.length < 4) return;
        if (lineUpper.includes('SWC') || lineUpper.includes('NOMADS') || lineUpper.includes('PANOCEANIA') || lineUpper.includes('CORVUS BELLI') || lineUpper.includes('UNDEFINED')) return; 

        if (lineUpper.includes('GROUP 1') || lineUpper.includes('GRUPPO 1')) { currentParseGroup = 1; return; }
        if (lineUpper.includes('GROUP 2') || lineUpper.includes('GRUPPO 2')) { currentParseGroup = 2; return; }
        if (lineUpper.includes('GROUP 3') || lineUpper.includes('GRUPPO 3')) { currentParseGroup = 3; return; }
        if (lineUpper.includes('GROUP 4') || lineUpper.includes('GRUPPO 4')) { currentParseGroup = 4; return; }

        let bestMatch = null;
        let highestScore = 0;

        dbFazione.forEach(dbU => {
            let score = 0;
            let nomeUpper = dbU.nome.toUpperCase();
            let weaponUpper = (dbU.weapon || "").toUpperCase();
            let skillsUpper = (dbU.skills || "").toUpperCase();
            let nomeBase = nomeUpper.split('(')[0].trim();

            if (lineUpper.includes(nomeBase)) score += 5;
            if (weaponUpper.split(',')[0].trim().length > 2 && lineUpper.includes(weaponUpper.split(',')[0].trim())) score += 3;
            if (lineUpper.includes('HACKER') && skillsUpper.includes('HACKER')) score += 3;
            if (lineUpper.includes('PARAMEDIC') && skillsUpper.includes('PARAMEDIC')) score += 3;
            if (lineUpper.includes('LIEUTENANT') && skillsUpper.includes('LIEUTENANT')) score += 3;

            if (score > highestScore && score >= 5) {
                highestScore = score;
                bestMatch = dbU;
            }
        });

        if (bestMatch) {
            const unit = {
                id: "u_" + Date.now() + "_" + Math.floor(Math.random()*1000),
                alias: bestMatch.nome, 
                name: bestMatch.nome,
                tipo: bestMatch.tipo || 'LI',
                weapon: bestMatch.weapon, 
                bs: bestMatch.bs, ph: bestMatch.ph, cc: bestMatch.cc, wip: bestMatch.wip,
                arm: bestMatch.arm, bts: bestMatch.bts, str: bestMatch.str, w: bestMatch.w, s: bestMatch.s, 
                skills: bestMatch.skills, equip: bestMatch.equip,
                state: "ACTIVE", 
                player: window.getPlayerTag(),
                combatGroup: currentParseGroup
            };
            window.roster.push(unit);
            count++;
        }
    });

    if(count > 0) {
        alert(`✅ Trovate e importate ${count} unità dal testo!\nSono state smistate correttamente nei rispettivi Gruppi di Combattimento.`);
        document.getElementById('army-import-text').value = ""; 
        window.renderRoster(); 
    } else {
        alert("❌ Nessuna unità riconosciuta. Assicurati di aver copiato il formato 'Plain Text' (in INGLESE) dall'Infinity Army.");
    }
};

window.addUnitToRoster = () => {
    const idProfilo = document.getElementById('profileSelect').value;
    const cGroup = document.getElementById('combatGroupSelect').value;
    let aliasInput = document.getElementById('unitAlias').value.trim(); 
    if (!idProfilo) return;
    
    const dbFazione = window.getDbFazione();
    let dbUnit = dbFazione.find(u => u.id === idProfilo);
    if (!dbUnit && window.DB_STRUTTURE) dbUnit = window.DB_STRUTTURE.find(u => u.id === idProfilo);
    
    if (!dbUnit) return;

    const unit = { 
        id: "u_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        alias: aliasInput || dbUnit.nome, 
        name: dbUnit.nome, 
        tipo: dbUnit.tipo || 'LI', 
        weapon: dbUnit.weapon,
        bs: dbUnit.bs, ph: dbUnit.ph, cc: dbUnit.cc, wip: dbUnit.wip, 
        arm: dbUnit.arm, bts: dbUnit.bts, str: dbUnit.str, w: dbUnit.w, s: dbUnit.s,
        skills: dbUnit.skills, equip: dbUnit.equip, 
        state: "ACTIVE", 
        player: window.getPlayerTag(),
        combatGroup: parseInt(cGroup)
    };

    if (dbUnit.tipo === "STRUTTURA" || dbUnit.tipo === "TORRETTA") {
        window.activeStructures.push(unit); 
        document.getElementById('unitAlias').value = ""; 
        window.renderStructures();
    } else {
        window.roster.push(unit); 
        document.getElementById('unitAlias').value = ""; 
        window.renderRoster();
    }
    
    if (window.aggiornaMenuGruppi) window.aggiornaMenuGruppi();
};

window.removeUnit = (index) => { window.roster.splice(index, 1); window.renderRoster(); };

// --- SOPRANNOMI ---------------------------------------------------------
// Il soprannome si assegnava solo al momento dell'inserimento, quindi una
// lista caricata da un salvataggio non era piu` rinominabile: tutte le unita`
// restavano col nome del profilo e in partita non si distinguevano.
window.rinominaUnita = (index) => {
    const u = window.roster[index];
    if (!u) return;
    const nomeProfilo = u.name || u.nome || '';
    const nuovo = prompt(`Soprannome per ${nomeProfilo}:\n(vuoto = usa il nome del profilo)`, u.alias || '');
    if (nuovo === null) return;                       // annullato: non si tocca niente
    u.alias = nuovo.trim() || nomeProfilo;
    window.renderRoster();
    if (window.aggiornaMenuGruppi) window.aggiornaMenuGruppi();
};

// Un elemento salvato il cui modello non esiste piu` nel database porta
// statistiche vecchie che nessuno rivede: le due torrette turret_combi e
// turret_hmg sono state sostituite da armed_turret, e i valori della HMG
// erano inventati. Non lo riscriviamo da soli \u2014 l'arma della torretta
// dipende dal profilo che la schiera e non possiamo indovinarla \u2014 ma non
// lo lasciamo passare in silenzio.
window.modelloStrutturaMancante = (u) => {
    if (!u || !u.modelId || !Array.isArray(window.DB_STRUTTURE)) return false;
    return !window.DB_STRUTTURE.some(st => st.id === u.modelId);
};

window.rinominaStruttura = (index) => {
    const u = window.activeStructures[index];
    if (!u) return;
    const nomeProfilo = u.name || u.nome || '';
    const nuovo = prompt(`Soprannome per ${nomeProfilo}:\n(vuoto = usa il nome del profilo)`, u.alias || '');
    if (nuovo === null) return;
    u.alias = nuovo.trim() || nomeProfilo;
    window.renderStructures();
};

window.renderRoster = () => {
    const container = document.getElementById('localRoster');
    if(window.roster.length === 0) return container.innerHTML = "<i>Nessuna unità schierata.</i>";
    
    let groupColor = window.isNomadsApp() ? '#00ff00' : '#00ffff';
    
    container.innerHTML = "";
    window.roster.forEach((u, i) => {
        const armaCorta = u.weapon.split('/')[0].split(',')[0];
        container.innerHTML += `<div class="roster-item"><div><b style="color:${groupColor};">[G${u.combatGroup}]</b> <b>${u.alias}</b> <span style="color:#aaa;">| ${armaCorta}</span></div>
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="cursor:pointer; font-size:18px;" title="Assegna o cambia il soprannome" onclick="window.rinominaUnita(${i})">✏️</div>
                <div class="del-btn" onclick="window.removeUnit(${i})">X</div>
            </div></div>`;
    });
};

// --- GESTIONE ARCHIVIO LOCALE (CRUD) ---
window.saveRoster = () => {
    const name = document.getElementById('saveName').value.trim().toUpperCase();
    if(!name || window.roster.length === 0) return alert("Inserisci un nome valido e aggiungi almeno un'unità alla lista!");
    
    const key = window.getStorageKey();
    const savedData = JSON.parse(localStorage.getItem(key) || '{}');

    // Si salvava solo window.roster: strutture e terreni andavano persi, e
    // ricaricando la lista le strutture non c'erano piu`. Nuovo formato a
    // oggetto; quello vecchio (array di sole unita`) resta leggibile.
    savedData[name] = {
        formato: 2,
        unita: window.roster,
        strutture: window.activeStructures || [],
        terreni: window.activeTerrains || []
    };
    localStorage.setItem(key, JSON.stringify(savedData));
    
    document.getElementById('saveName').value = ""; 
    window.refreshSavedRostersList(); 
    alert(`Squadra "${name}" salvata con successo!`);
};

window.loadRoster = () => {
    const name = document.getElementById('savedRostersSelect').value;
    if(!name) return;
    
    const key = window.getStorageKey();
    const salvato = JSON.parse(localStorage.getItem(key) || '{}')[name];
    if (!salvato) return;

    // Formato 1 (vecchio): array di sole unita`. Formato 2: oggetto con
    // unita`, strutture e terreni. Le liste vecchie non hanno strutture
    // salvate, quindi si azzerano invece di trascinare quelle di prima.
    const eVecchio = Array.isArray(salvato);
    const unita = eVecchio ? salvato : (salvato.unita || []);

    window.roster = unita.map(u => ({ ...u, combatGroup: u.combatGroup || 1, state: u.state || "ACTIVE" }));
    window.activeStructures = eVecchio ? [] : (salvato.strutture || []);
    window.activeTerrains = eVecchio ? [] : (salvato.terreni || []);

    window.renderRoster();
    if (window.renderStructures) window.renderStructures();
    if (window.renderTerrains) window.renderTerrains();
    if (window.aggiornaMenuGruppi) window.aggiornaMenuGruppi();
};

window.deleteRoster = () => {
    const name = document.getElementById('savedRostersSelect').value;
    if(!name) return alert("Seleziona una squadra dalla tendina prima di eliminarla.");
    if(confirm(`Sei sicuro di voler eliminare la squadra salvata "${name}"?`)) {
        const key = window.getStorageKey();
        const savedData = JSON.parse(localStorage.getItem(key) || '{}');
        delete savedData[name]; 
        localStorage.setItem(key, JSON.stringify(savedData)); 
        window.refreshSavedRostersList();
    }
};

window.refreshSavedRostersList = () => {
    const key = window.getStorageKey();
    const savedData = JSON.parse(localStorage.getItem(key) || '{}');
    const select = document.getElementById('savedRostersSelect');
    select.innerHTML = '<option value="">-- SQUADRE SALVATE --</option>';
    Object.keys(savedData).forEach(n => { const opt = document.createElement('option'); opt.value = n; opt.textContent = n; select.appendChild(opt); });
};

// --- SINCRONIZZAZIONE HUB ---
window.sendDataToServer = () => { 
    if(window.roster.length === 0 && window.activeStructures.length === 0) return alert("Schiera un'unità o una struttura!");
    
    const setupPayload = { 
        roster: window.roster, 
        strutture: window.activeStructures, 
        terreni: window.activeTerrains,
        timestamp: Date.now() 
    };
    
    const channel = window.getSetupChannel();
    localStorage.setItem(channel, JSON.stringify(setupPayload));

    document.getElementById('setup').style.display = 'none'; 
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-sync').style.display = 'flex'; 
};

// --- FASE DI DISPIEGAMENTO (FOG OF WAR, DEPLOYABLES) ---
window.apriSchieramento = () => {
    if(window.roster.length === 0) return alert("Inserisci almeno un'unità prima di schierare!");
    
    document.getElementById('setup').style.display = 'none';
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-groups').style.display = 'flex';
    
    const container = document.getElementById('deploy-groups-container');
    container.innerHTML = "";

    let bgBtn = window.isNomadsApp() ? '#8b0000' : '#001a33';
    let borderColor = window.isNomadsApp() ? 'var(--nomad-orange)' : '#00ccff';

    let gruppiAttivi = [...new Set(window.roster.map(u => parseInt(u.combatGroup) || 1))].sort();
    if(gruppiAttivi.length === 0) gruppiAttivi = [1];

    gruppiAttivi.forEach(g => {
        let truppeNelGruppo = window.roster.filter(u => parseInt(u.combatGroup) === g).length;
        container.innerHTML += `<button class="huge-btn" style="min-height:80px; margin-bottom:15px; width:100%; border-color:${borderColor}; background:${bgBtn};" 
            onclick="window.apriGruppoDeploy(${g})">
            GRUPPO ${g} <br><span style="font-size:14px; color:#aaa;">(${truppeNelGruppo} Unità Operative)</span>
        </button>`;
    });
};

window.tornaAlSetup = () => {
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('setup').style.display = 'block';
};

window.apriGruppoDeploy = (g) => {
    window.deployGroup = g;
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-units').style.display = 'flex';
    window.renderDeployUnits();
};

window.cambiaIconaDeploy = (event, index) => {
    if(event) event.stopPropagation(); 
    let u = window.roster[index];
    let current = parseInt(u.imgVariant || "0");
    u.imgVariant = ((current + 1) % 4).toString(); 
    window.renderDeployUnits();
};

window.startDeployPress = (index) => {
    window.isDeployPressing = true;
    window.deployPressTimer = setTimeout(() => {
        if (window.isDeployPressing) {
            window.isDeployPressing = false;
            window.apriDeployStati(index); 
        }
    }, 500);
};

window.endDeployPress = (index) => {
    if (window.isDeployPressing) {
        clearTimeout(window.deployPressTimer);
        window.isDeployPressing = false;
        window.apriDeployAzioni(index); 
    }
};

window.cancelDeployPress = () => {
    clearTimeout(window.deployPressTimer);
    window.isDeployPressing = false;
};

window.renderDeployUnits = () => {
    const container = document.getElementById('deploy-units-container');
    // Gli stati di schieramento si aprivano SOLO col tocco lungo: un gesto
    // che sul telefono si annulla appena la lista scorre di un pixel, e che
    // nessuno indovina. Ora ogni unita` ha il suo pulsante, e il tocco lungo
    // resta come scorciatoia per chi lo conosce.
    container.innerHTML = `<p style="color:#aaa; font-size:14px; text-align:center;">Tocco sull'icona = Cambia Foto<br>Tocco rapido = Azioni / Mine<br>Pulsante sotto (o tocco lungo) = Schieramento speciale</p>`;

    let isNomads = window.isNomadsApp();
    let aliasColor = isNomads ? 'var(--nomad-orange)' : '#00ffff';
    let btnBorder = isNomads ? 'var(--nomad-orange)' : '#0088ff';
    let markerColor = isNomads ? 'orange' : '#00ccff';
    let hiddenColor = isNomads ? 'red' : '#0088ff';
    let reserveColor = isNomads ? 'yellow' : '#00ffff';

    let truppeDelGruppo = window.roster.filter(u => parseInt(u.combatGroup) === window.deployGroup);

    truppeDelGruppo.forEach(u => {
        let originalIndex = window.roster.indexOf(u); 
        let nomePuro = (u.nome || u.name || "").split('(')[0].trim();
        let aliasDisplay = u.alias ? `<div style="color:${aliasColor}; font-size:15px; font-style:italic; margin-top:2px; line-height:1;">"${u.alias}"</div>` : "";
        
        let variant = u.imgVariant && u.imgVariant !== "0" ? `_${u.imgVariant}` : "";
        let imgSrc = `img/${nomePuro.replace(/\s+/g, '_')}${variant}.png`;

        let stateLabel = "";
        // CAMO_1 = Camouflage, CAMO_2 = TO Camouflage: il numero e` il LIVELLO
        // di occultamento, non il malus. Il malus viene da Mimetism (-N) e lo
        // legge il motore con M.valoreMimetismo(): sono due dati diversi dello
        // stesso profilo e prima li confondevamo.
        // Le vecchie etichette CAMO_0/3/6 restano riconosciute in LETTURA,
        // altrimenti una lista salvata prima di oggi perderebbe il segnalino.
        if(u.deployState === "CAMO_1") stateLabel += `<br><span style='color:${markerColor}; font-size:14px;'>[ SEGNALINO CAMO ]</span>`;
        if(u.deployState === "CAMO_2") stateLabel += `<br><span style='color:${markerColor}; font-size:14px;'>[ SEGNALINO TO CAMO ]</span>`;
        if(u.deployState === "CAMO_0" || u.deployState === "CAMO_3" || u.deployState === "CAMO_6")
            stateLabel += `<br><span style='color:${markerColor}; font-size:14px;'>[ SEGNALINO CAMO (etichetta vecchia: ${u.deployState}) ]</span>`;
        if(u.deployState === "IMP_1") stateLabel += `<br><span style='color:${markerColor}; font-size:14px;'>[ IMP-1 ]</span>`;
        if(u.deployState === "IMP_2") stateLabel += `<br><span style='color:${markerColor}; font-size:14px;'>[ IMP-2 ]</span>`;
        if(u.deployState === "HIDDEN") stateLabel += `<br><span style='color:${hiddenColor}; font-size:14px;'>[ HIDDEN DEPLOYMENT ]</span>`;
        if(u.deployState === "RESERVE") stateLabel += `<br><span style='color:${reserveColor}; font-size:14px;'>[ RISERVA / AD ]</span>`;
        
        if(u.deployState === "FOXHOLE") stateLabel += `<br><span style='color:#ff8800; font-size:14px;'>[ FOXHOLE ]</span>`;
        if(u.deployState === "SEED") stateLabel += `<br><span style='color:#00ff66; font-size:14px;'>[ SEED-EMBRYO ]</span>`;
        if(u.deployState === "HOLOMASK") stateLabel += `<br><span style='color:#cc00ff; font-size:14px;'>[ HOLOMASK ]</span>`;

        if(u.tipo === "HOLOECHO") stateLabel += `<br><span style='color:#00ffff; font-size:14px;'>[ OLO-ECO ]</span>`;

        container.innerHTML += `
            <button class="huge-btn" style="background:#111; border:2px solid ${btnBorder}; padding:10px; margin-bottom:10px; display:flex; flex-direction:row; align-items:center; width:100%; max-height:120px; overflow:hidden;"
                onpointerdown="window.startDeployPress(${originalIndex})" 
                onpointerup="window.endDeployPress(${originalIndex})" 
                onpointerleave="window.cancelDeployPress()"
                oncontextmenu="return false;">
                
                <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; text-align:center;">
                    <div style="font-size:22px; line-height:1; color:#fff; font-weight:bold;">${nomePuro}${stateLabel}</div>
                    ${aliasDisplay}
                </div>

                <img src="${imgSrc}" style="width:70px; height:70px; flex-shrink:0; object-fit:contain; margin-left:15px; background: rgba(0,0,0,0.5); border-radius:5px; border: 1px solid #444; position:relative; z-index:10; color:#555; text-align:center; font-size:10px;" 
                    alt="NO IMG"
                    onerror="this.onerror=null; this.src=''; this.style.backgroundColor='#222';" 
                    onpointerdown="event.stopPropagation()" 
                    onclick="window.cambiaIconaDeploy(event, ${originalIndex})">
            </button>
            <button class="huge-btn" style="background:#1a1a1a; border:2px solid ${btnBorder}; color:${btnBorder}; margin:-6px 0 14px 0; padding:10px; font-size:16px; width:100%;"
                onclick="window.apriDeployStati(${originalIndex})">
                \u{1F441}\uFE0F SCHIERAMENTO SPECIALE (CAMO, NASCOSTO, RISERVA)
            </button>
        `;
    });
};

window.apriDeployStati = (index) => {
    window.unitToEdit = window.roster[index];
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-states').style.display = 'flex';
    
    let u = window.unitToEdit;
    let st = u.deployState || "NORMAL";
    let skills = (u.skills || "").toLowerCase();
    
    let isNomads = window.isNomadsApp();
    let btnBorderActive = isNomads ? '#00ff00' : '#00ffff';
    let hiddenBg = isNomads ? '#8b0000' : '#002244';
    let hiddenBorder = isNomads ? '#ff0000' : '#00ccff';
    let markerBg = isNomads ? '#8b4500' : '#004466';
    let markerBorder = isNomads ? '#ffa500' : '#00ccff';

    let html = `<div style="background:#111; padding:15px; border:1px solid #444; border-radius:8px; display:flex; flex-direction:column; gap:10px; max-height:70vh; overflow-y:auto;">`;
    
    // NORMALE
    html += `<button class="huge-btn" style="background:${st === 'NORMAL' ? '#004400' : '#222'}; border-color:${st === 'NORMAL' ? btnBorderActive : '#555'};" onclick="window.setDeployState(${index}, 'NORMAL')">NORMALE</button>`;
    
    // CAMO
    if (skills.includes('camo') || u.tipo === "MARKER") {
        // Il livello del segnalino viene dall'abilita` Camouflage:
        // Camouflage = CAMO_1, TO Camouflage = CAMO_2. NON da Mimetism (-N),
        // che e` il MOD subito dai nemici ed e` un'altra skill dello stesso
        // profilo. Prima si cercava "-3"/"-6" in tutta la stringa: su 54
        // profili 49 pescavano per caso il valore di Mimetism e l'Helot
        // Militiaman pescava il -3 di "Surprise Attack (-3)".
        //
        // Il livello NON si deduce, e qui non si finge il contrario.
        // "TO Camouflage" non esiste in N5: le schede ufficiali lo hanno
        // sciolto in Camouflage + Hidden Deployment + Mimetism (-6), e nei
        // database infatti compare zero volte. Restano due criteri possibili
        // per riconoscere un TO, e NON danno la stessa risposta:
        //   Camouflage + Hidden Deployment ....... 25 profili
        //   Camouflage + Mimetism (-6) ........... 29 profili
        // I quattro di differenza sono i Locust, che hanno il -6 senza
        // Hidden Deployment. Quale dei due valga e` una regola e la decide
        // la chat MOTORE: finche` non risponde, si offrono i due livelli
        // senza suggerirne uno. Una casella marcata "dal profilo" sarebbe
        // una risposta inventata, e sarebbe sbagliata su quei quattro.
        const livelli = [["CAMO_1", "SEGNALINO CAMO"], ["CAMO_2", "SEGNALINO TO CAMO"]];
        livelli.forEach(([tipo, etichetta]) => {
            const attivo = (st === tipo);
            html += `<button class="huge-btn" style="background:${attivo ? markerBg : '#222'}; border-color:${attivo ? markerBorder : '#555'}; min-height:50px;" onclick="window.setDeployState(${index}, '${tipo}')">${etichetta}</button>`;
        });
        html += `<div style="color:#888; font-size:14px; margin:2px 0 8px 0;">Il profilo non registra il livello del segnalino: scegli tu.</div>`;
    }
    
    // IMPERSONATION
    if (skills.includes('impersonation') || skills.includes('impersonator') || skills.includes('imp-1') || skills.includes('imp-2')) {
        let impType = "IMP_1"; let impLabel = "IMPERSONATION (IMP-1)";
        if (skills.includes('impersonation-2') || skills.includes('imp-2') || skills.includes('imp 2')) { impType = "IMP_2"; impLabel = "IMPERSONATION (IMP-2)"; }
        html += `<button class="huge-btn" style="background:${st.startsWith('IMP') ? markerBg : '#222'}; border-color:${st.startsWith('IMP') ? markerBorder : '#555'}; min-height:50px;" onclick="window.setDeployState(${index}, '${impType}')">${impLabel}</button>`;
    }

    // FOXHOLE (Sapper)
    if (skills.includes('sapper') || skills.includes('zappatore')) {
        html += `<button class="huge-btn" style="background:${st === 'FOXHOLE' ? '#442200' : '#222'}; border-color:${st === 'FOXHOLE' ? '#ff8800' : '#555'}; margin-top:10px;" onclick="window.setDeployState(${index}, 'FOXHOLE')">FOXHOLE (Sapper)</button>`;
    }

    // SEED-EMBRYO (Transmutation Hatching)
    if (skills.includes('transmutation (hatching)') || skills.includes('seed-embryo') || skills.includes('seed embryo')) {
        html += `<button class="huge-btn" style="background:${st === 'SEED' ? '#004422' : '#222'}; border-color:${st === 'SEED' ? '#00ff66' : '#555'}; margin-top:10px;" onclick="window.setDeployState(${index}, 'SEED')">SEED-EMBRYO</button>`;
    }

    // HOLOMASK
    if (skills.includes('holomask')) {
        html += `<button class="huge-btn" style="background:${st === 'HOLOMASK' ? '#220044' : '#222'}; border-color:${st === 'HOLOMASK' ? '#cc00ff' : '#555'}; margin-top:10px;" onclick="window.setDeployState(${index}, 'HOLOMASK')">HOLOMASK</button>`;
    }

    // OLO-ECO / DECOY 
    if (skills.includes('holoprojector') || skills.includes('decoy') || skills.includes('ologramma')) {
        html += `<button class="huge-btn" style="background:#004444; border-color:#00ffff; margin-top:10px;" onclick="window.generaOloEco(${index})">GENERA OLO-ECO / DECOY</button>`;
    }
    
    // HIDDEN DEPLOYMENT
    if (skills.includes('hidden deployment') || skills.includes('schieramento nascosto')) {
        html += `<button class="huge-btn" style="background:${st === 'HIDDEN' ? hiddenBg : '#222'}; border-color:${st === 'HIDDEN' ? hiddenBorder : '#555'}; margin-top:10px;" onclick="window.setDeployState(${index}, 'HIDDEN')">HIDDEN DEPLOYMENT</button>`;
    }
    
    // RISERVA / AD
    if (skills.includes('parachutist') || skills.includes('combat jump') || skills.includes('ad:') || skills.includes('airborne deployment') || skills.includes('paracadutista')) {
        html += `<button class="huge-btn" style="background:${st === 'RESERVE' ? '#444400' : '#222'}; border-color:${st === 'RESERVE' ? '#ffff00' : '#555'}; margin-top:10px;" onclick="window.setDeployState(${index}, 'RESERVE')">RISERVA / AD</button>`;
    }
    
    html += `</div>`;
    document.getElementById('deploy-states-content').innerHTML = html;
};

window.setDeployState = (index, state) => {
    window.roster[index].deployState = state;
    if(!window.roster[index].states) window.roster[index].states = {};
    window.roster[index].states.camo = state.startsWith('CAMO');
    window.roster[index].states.impersonation = state.startsWith('IMP');
    window.goToStep('step-deploy-units');
    window.renderDeployUnits();
};

window.generaOloEco = (index) => {
    let genitore = window.roster[index];
    let num = prompt("Quanti Olo-Eco vuoi generare?\n(Inserisci 1 o 2)", "2");
    num = parseInt(num);
    if(isNaN(num) || num < 1 || num > 3) return;
    
    for(let i=1; i<=num; i++) {
        let eco = JSON.parse(JSON.stringify(genitore));
        eco.id = 'eco_' + Date.now() + '_' + i;
        eco.nome = (genitore.nome || "").split('(')[0].trim() + " (ECO)";
        eco.alias = "OLO-ECO";
        eco.tipo = "HOLOECHO";
        eco.deployState = genitore.deployState || "NORMAL"; 
        window.roster.push(eco);
    }
    alert(`✅ Generati ${num} Olo-Eco di ${genitore.nome}!`);
    window.goToStep('step-deploy-units');
    window.renderDeployUnits();
};

window.apriDeployAzioni = (index) => {
    window.unitToEdit = window.roster[index];
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-actions').style.display = 'flex';
    
    let container = document.getElementById('deploy-action-list-container');
    container.innerHTML = ""; 
    
    let u = window.unitToEdit;
    let skills = (u.skills || "").toLowerCase();
    let weapons = ((u.weapon || "") + " " + (u.equip || "")).toLowerCase();
    let hasBottoni = false;

    let btnBg = window.isNomadsApp() ? '#330000' : '#002244';
    let btnBorder = window.isNomadsApp() ? '#ff0000' : '#00ccff';

    if (skills.includes('minelayer') || weapons.includes('mine') || weapons.includes('koala') || weapons.includes('panda') || weapons.includes('dropbear') || weapons.includes('deployable') || weapons.includes('crazykoalas') || weapons.includes('fastpanda')) {
        container.innerHTML += `<button class="huge-btn" style="background:${btnBg}; border-color:${btnBorder}; width:100%; margin-bottom:10px;" onclick="window.mostraMenuDeployables(${index})">SCHIERA EQUIPAGGIAMENTO / MINE</button>`;
        hasBottoni = true;
    }

    if (!hasBottoni) {
        container.innerHTML = `<p style="color:#aaa; text-align:center; margin-top:20px; font-size:18px;">Questa unità non ha abilità o equipaggiamenti speciali da dispiegamento.</p>`;
    }
};

window.mostraMenuDeployables = (parentIndex) => {
    let container = document.getElementById('deploy-action-list-container');
    
    let titleColor = window.isNomadsApp() ? 'var(--nomad-orange)' : '#00ccff';
    container.innerHTML = `<p style="color:${titleColor}; text-align:center; margin-bottom:10px;">SELEZIONA COSA PIAZZARE:</p>`;

    let u = window.roster[parentIndex];
    let unitGear = ((u.weapon || u.armi || "") + " " + (u.equip || u.skills || "")).toLowerCase();

    let allowedDeployables = window.DB_DEPLOYABLES.filter(dep => {
        let check = false;
        if (dep.nome.includes("Mina AP") && (unitGear.includes("ap mine") || unitGear.includes("mine ap") || unitGear.includes("mina ap"))) check = true;
        if (dep.nome.includes("Mina Shock") && (unitGear.includes("shock mine") || unitGear.includes("mine shock") || unitGear.includes("mina shock"))) check = true;
        if (dep.nome.includes("Mina E/M") && (unitGear.includes("e/m mine") || unitGear.includes("mine e/m") || unitGear.includes("mina e/m"))) check = true;
        if (dep.nome.includes("Drop Bear") && (unitGear.includes("dropbear") || unitGear.includes("drop bear"))) check = true;
        if (dep.nome.includes("FastPanda") && (unitGear.includes("fastpanda") || unitGear.includes("fast panda"))) check = true;
        if (dep.nome.includes("CrazyKoala") && (unitGear.includes("crazykoala") || unitGear.includes("crazy koala"))) check = true;
        if (dep.nome.includes("WildParrot") && (unitGear.includes("wildparrot") || unitGear.includes("wild parrot"))) check = true;
        if (dep.nome.includes("Repeater") && (unitGear.includes("deployable repeater") || unitGear.includes("ripetitore schierabile") || unitGear.includes("ripetitore posizionabile"))) check = true;
        return check;
    });

    if (allowedDeployables.length === 0 && (unitGear.includes("mine") || unitGear.includes("mina") || unitGear.includes("minelayer") || unitGear.includes("posamina"))) {
        allowedDeployables = window.DB_DEPLOYABLES.filter(dep => dep.nome.includes("Mina"));
    }

    if (allowedDeployables.length === 0) {
         container.innerHTML += `<p style="color:red; text-align:center; margin-top:20px; font-size:18px;">Errore: Nessun equipaggiamento schierabile rilevato nel profilo di questa unità.</p>`;
         return;
    }

    let camoBtnBg = window.isNomadsApp() ? '#8b4500' : '#004466';

    allowedDeployables.forEach(dep => {
        let color = dep.isCamo ? camoBtnBg : "#222"; 
        container.innerHTML += `
            <button class="huge-btn" style="background:${color}; border-color:#888; margin-bottom:8px; min-height:60px;" onclick="window.schieraDeployableSelezionato(${parentIndex}, '${dep.id}')">
                ${dep.nome} <br>
                <span style="font-size:12px; color:#aaa;">[S:${dep.s} | STR:${dep.str} | ARM:${dep.arm} | BTS:${dep.bts}] - ${dep.equip}</span>
            </button>
        `;
    });
};

window.schieraDeployableSelezionato = (parentIndex, depId) => {
    let genitore = window.roster[parentIndex];
    let depBase = window.DB_DEPLOYABLES.find(d => d.id === depId);
    
    let nuovoMarker = {
        id: 'dep_' + Date.now(),
        nome: depBase.nome + " (" + (genitore.nome || "").split('(')[0].trim() + ")",
        name: depBase.nome,
        alias: depBase.nome,
        combatGroup: genitore.combatGroup, 
        imgVariant: "0",
        deployState: depBase.isCamo ? "CAMO_3" : "NORMAL", 
        states: { camo: depBase.isCamo, impersonation: false, hidden: false, reserve: false },
        tipo: depBase.tipo,
        arm: depBase.arm,
        bts: depBase.bts,
        str: depBase.str,
        s: depBase.s,
        skills: depBase.equip,
        weapon: depBase.armi,
        state: "ACTIVE" 
    };
    
    window.roster.push(nuovoMarker);
    alert(`✅ ${depBase.nome} posizionato sul tavolo!`);
    window.goToStep('step-deploy-units');
    window.renderDeployUnits();
};

window.confermaSchieramento = () => {
    window.schieramentoCompletato = true;
    window.roster.forEach(u => {
        if(!u.states) u.states = {};
        u.states.camo = (u.deployState || "").startsWith("CAMO");
        u.states.impersonation = (u.deployState || "").startsWith("IMP");
        u.states.hidden = (u.deployState === "HIDDEN");
        u.states.reserve = (u.deployState === "RESERVE");
    });
    
    if (window.aggiornaMenuGruppi) window.aggiornaMenuGruppi();
    
    if (typeof window.sendDataToServer === "function") {
        window.sendDataToServer();
    } else {
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        let header = document.getElementById('battle-header');
        if(header) header.style.display = 'none';
        document.getElementById('battle').style.display = 'flex'; 
    }
};

// Auto-avvio sicuro
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.inizializzaApp);
} else {
    window.inizializzaApp();
}
// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'roster_manager.js', versione: '2026-09-19.1', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

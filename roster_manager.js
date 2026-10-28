// @versione 2026-10-28.2 | roster_manager.js | proprieta`: chat INTERFACCIA
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
    return window.isNomadsApp() ? window.MotoreN5.CANALI.SETUP_NOMADI : window.MotoreN5.CANALI.SETUP_PANOCEANIA;
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
                ${window.modelloStrutturaMancante(u) ? `<div style="color:#ff6666; font-size:13px; font-weight:bold;">\u26a0\ufe0f ${window.cosaFareStrutturaMancante(u)}</div>` : ''}</div>
            <div style="display:flex; align-items:center; gap:14px;">
                <button type="button" class="tasto-riga-lista" title="Assegna o cambia il soprannome" aria-label="Soprannome" onclick="window.rinominaStruttura(${i})">✏️</button>
                <button type="button" class="tasto-riga-lista togli del-btn" aria-label="Togli" onclick="window.activeStructures.splice(${i}, 1); window.renderStructures();">X</button>
            </div>
        </div>`;
    });
};

// --- IMPORTAZIONE E COSTRUZIONE ROSTER ---
// ==========================================================================
//  IMPORTAZIONE DAL TESTO DI INFINITY ARMY ("Plain Text")
// ==========================================================================
// 19 ottobre (misura di MOTORE sulla lista di collaudo di Paolo: 8 profili
// Nomadi sbagliati su 39). Il punteggio di prima guardava il nome base (+5),
// la PRIMA arma del profilo (+3) e tre parole (HACKER, PARAMEDIC,
// LIEUTENANT, +3); a pari punti vinceva il primo profilo del database. Due
// difetti insieme:
//  - la prima arma e` spesso uguale per tutti i profili di una truppa
//    (sei Alguacil col Combi Rifle, tutti i Morlock con la Chain Rifle), e
//    la parentesi dopo il nome ("WARCOR (Sixth Sense)") non contava;
//  - Army scrive "MULTI Sniper Rifle(+1SD)" senza spazio, il database
//    "MULTI Sniper Rifle (+1SD)": la prima arma non coincideva nemmeno.
// Risultato: Alguacil (Forward Observer) diventava Alguacil (Combi Rifle),
// Clockmaker (Armed Turret) diventava Clockmaker (Engineer), in silenzio.
// Ora: i due testi si normalizzano allo stesso modo; si confrontano TUTTE
// le voci della riga (armi, equipaggiamento, le parole fra parentesi dopo il
// nome) con quelle del profilo (+1 per voce in comune, -1 per ogni arma o
// equipaggiamento del profilo che nella riga non c'e`); e a pari punti NON
// si sceglie: la riga e` ambigua e la sceglie il giocatore.

// Lo stesso testo, scritto come lo scrivono Army e il database: maiuscole,
// niente "REINF.", niente punti, niente spazio prima di "(", virgolette
// uniformate, spazi singoli.
window.normalizzaTestoArmy = (t) => String(t || '')
    .replace(/\u00a0/g, ' ')
    .toUpperCase()
    .replace(/\bREINF\.?/g, ' ')
    .replace(/[\u2018\u2019\u00b4`]/g, "'")
    .replace(/[\u201c\u201d\u2033]/g, '"')
    .replace(/\s+\(/g, '(')
    .replace(/\./g, ' ')
    // Il database scrive "Drumbot_1", Army "DRUMBOT-1": stesso nome. Senza
    // questa riga il periferico letto dalla riga sotto non combaciava mai.
    .replace(/_/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

// Il NUCLEO di una voce: senza quello che sta fra parentesi o quadre.
// "GIZMOKIT(+1B)" e "GIZMOKIT" sono la stessa voce; "AP CC WEAPON(PS=6)" e
// "DA CC WEAPON(PS=6)" no.
window.nucleoVoceArmy = (v) => window.normalizzaTestoArmy(v).replace(/[\(\[][^\)\]]*[\)\]]/g, ' ').replace(/\s+/g, ' ').trim();

// Le voci di una lista separata da virgole, senza tagliare dentro le
// parentesi: "Hacking Device Plus (UPGRADE: Oblivion, +1B)" resta una.
window.vociSeparate = (testo) => {
    const out = []; let livello = 0, cur = '';
    for (const ch of String(testo || '')) {
        if (ch === '(' || ch === '[') livello++;
        if (ch === ')' || ch === ']') livello = Math.max(0, livello - 1);
        // Solo la virgola separa: una "/" sta dentro i nomi (E/M CC Weapon,
        // E/Mitter) e spezzarla li` faceva due voci finte.
        if (ch === ',' && livello === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur);
    return out.map(x => x.trim()).filter(x => x && x !== '-');
};

// Il nome base di un profilo: "Interventor (Hacker) - Boarding Shotgun" ->
// "INTERVENTOR".
window.nomeBaseArmy = (u) => window.normalizzaTestoArmy(String((u && u.nome) || '').split('(')[0].split(' - ')[0]);

// Le voci di un profilo, gia` ridotte al nucleo.
//   armiEquip  armi ed equipaggiamento: se mancano nella riga, -1
//   opzione    le parole fra parentesi del nome: se mancano nella riga, -1
//              (e` cio` che distingue "Alguacil (Lieutenant)" da
//              "Alguacil (Combi Rifle)", che hanno le stesse armi)
//   tutte      anche Abilita` e le parole fra parentesi del nome
window.vociProfiloArmy = (u) => {
    const armiEquip = window.vociSeparate(u.weapon).concat(window.vociSeparate(u.equip)).map(window.nucleoVoceArmy).filter(Boolean);
    const nome = String(u.nome || '');
    // Dalla PRIMA "(" all'ULTIMA ")" del nome: "Bambabot-1 (Chain Rifle
    // (ps=6))" ha una parentesi dentro l'altra.
    const testa = nome.split(' - ')[0];
    const a = testa.indexOf('('), b = testa.lastIndexOf(')');
    const fraParentesi = (a >= 0 && b > a) ? testa.slice(a + 1, b) : '';
    const dopoTrattino = nome.indexOf(' - ') >= 0 ? nome.split(' - ').slice(1).join(' - ') : '';
    const altre = window.vociSeparate(u.skills).concat(window.vociSeparate(fraParentesi), window.vociSeparate(dopoTrattino)).map(window.nucleoVoceArmy).filter(Boolean);
    // " - 27 pt" in coda al nome distingue due voci del database, non due
    // opzioni di Army: non e` una voce da cercare nella riga.
    const opzione = window.vociSeparate(fraParentesi).concat(window.vociSeparate(dopoTrattino)).map(window.nucleoVoceArmy).filter(v => v && !/^\d+ ?PT$/.test(v));
    return { armiEquip: [...new Set(armiEquip)], opzione: [...new Set(opzione)], tutte: [...new Set(armiEquip.concat(altre))] };
};

// Le voci di una riga di Army, dopo il nome base. Si taglia anche il costo
// in coda, "(0 | 10)": e` un numero, non una voce.
window.vociRigaArmy = (rigaNorm, base) => {
    const resto = rigaNorm.slice(rigaNorm.indexOf(base) + base.length)
        .replace(/\(\s*[\d,]+\s*\|\s*\d+\s*\)\s*$/, ' ');
    // Separatori di Army: la virgola, " / " fra armi e armi da CC, le
    // parentesi dopo il nome, e "|" che dentro "( Abilita` | Equipaggiamento )"
    // separa le due parti. Una "/" SENZA spazi intorno (E/Mitter) e` del nome.
    return [...new Set(resto.split(/\s\/\s|[,\(\)\[\]|]/).map(window.nucleoVoceArmy).filter(v => v && v !== '-' && /[A-Z]/.test(v)))];
};

// UNA riga di Army contro il database della fazione.
//   { stato: 'OK' | 'AMBIGUA' | 'NESSUNO', profilo, candidati, punteggi }
// candidati: i profili a pari punti in testa (piu` d'uno se AMBIGUA).
// Il nome base con cui si apre una riga di Army ('' se nessuno).
// Il nome base deve aprire la riga (o stare dopo un numero/ segno, come
// "1x"): si prende il piu` LUNGO che coincide, cosi` "PUPPET MASTERS"
// non si confonde con un "PUPPET..." piu` corto.
window.baseRigaArmy = (riga, db) => {
    const r = window.normalizzaTestoArmy(riga);
    const parola = (b) => new RegExp('^(?:[^A-Z]*\\s)?' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Z0-9])').test(r);
    let base = '';
    (db || []).forEach(u => { const b = window.nomeBaseArmy(u); if (b && b.length > base.length && parola(b)) base = b; });
    return base;
};

// vociExtra (facoltativo): voci gia` normalizzate che vengono dalle righe
// VICINE, non da questa. 19 ottobre (DATABASE, Drummer opz 7 e 8): Army
// scrive i periferici su righe rientrate SOTTO la truppa, e la riga della
// truppa da sola non dice quale periferico porta. Tre Drummer osservatori
// (Drumbot_5 / Drumbot_1+5 / Drumbot_3+5) hanno la stessa riga: misurato
// sul file di prima, i due da 47 pt diventavano in silenzio quello da 21.
// Lo stesso per i Coyote (Bambabot-1 o -2) e per il Turtlemek, che si
// riconosce dal TAG sopra di lui (Triphammer o Scarface).
window.riconosciRigaArmy = (riga, db, vociExtra) => {
    const r = window.normalizzaTestoArmy(riga);
    const esito = { stato: 'NESSUNO', profilo: null, candidati: [], punteggi: [], base: '' };
    if (!r) return esito;
    const base = window.baseRigaArmy(riga, db);
    if (!base) return esito;
    esito.base = base;
    const voci = [...new Set(window.vociRigaArmy(r, base).concat((vociExtra || []).filter(Boolean)))];
    // I profili SECONDARI (Battle-Ravaged, Enhanced Profile, Inactive
    // Symbiont Armor) non stanno in una lista di Army: sono lo stato di una
    // truppa gia` schierata. Prima pareggiavano col profilo vero.
    const punteggi = (db || []).filter(u => window.nomeBaseArmy(u) === base && u.profiloSecondario !== true).map(u => {
        const p = window.vociProfiloArmy(u);
        const comuni = voci.filter(v => p.tutte.indexOf(v) >= 0).length;
        // L'opzione del database non e` sempre scritta come in Army: il
        // database dice "Interventor (Hacker Plus)", Army "(Hacker, Hacking
        // Device Plus)". Una voce dell'opzione conta come presente se c'e`
        // uguale, oppure se TUTTE le sue parole stanno nella riga.
        const parole = ' ' + voci.join(' ').split(' ').join(' ') + ' ';
        const presente = (v) => voci.indexOf(v) >= 0 || v.split(' ').every(w => parole.indexOf(' ' + w + ' ') >= 0);
        const mancanti = p.armiEquip.filter(v => voci.indexOf(v) < 0).length + p.opzione.filter(v => !presente(v)).length;
        return { profilo: u, punti: comuni - mancanti, comuni: comuni, mancanti: mancanti };
    }).sort((a, b) => b.punti - a.punti);
    esito.punteggi = punteggi;
    if (!punteggi.length) return esito;
    esito.candidati = punteggi.filter(x => x.punti === punteggi[0].punti).map(x => x.profilo);
    if (esito.candidati.length === 1) { esito.stato = 'OK'; esito.profilo = esito.candidati[0]; }
    else esito.stato = 'AMBIGUA';
    return esito;
};

// L'unita` del roster costruita da un profilo: la stessa forma di prima.
window.unitaDaProfiloArmy = (p, gruppo) => ({
    id: "u_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    alias: p.nome,
    name: p.nome,
    tipo: p.tipo || 'LI',
    weapon: p.weapon,
    bs: p.bs, ph: p.ph, cc: p.cc, wip: p.wip,
    arm: p.arm, bts: p.bts, str: p.str, w: p.w, s: p.s,
    skills: p.skills, equip: p.equip,
    state: "ACTIVE",
    player: window.getPlayerTag(),
    combatGroup: gruppo
});

// Le righe ambigue dell'ultima importazione, da scegliere a mano.
window.righeAmbigueImport = [];

window.disegnaRigheAmbigue = () => {
    const box = document.getElementById('import-ambigue');
    if (!box) return;
    const lista = window.righeAmbigueImport;
    if (!lista.length) { box.innerHTML = ''; box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = `<div style="color:#ffcc66; font-size:14px; margin:8px 0;">\u26a0\ufe0f ${lista.length} ${lista.length === 1 ? 'riga ambigua' : 'righe ambigue'}: pi\u00f9 profili hanno gli stessi punti. Scegli tu quale.</div>` +
        lista.map((a, i) => `<div class="riga-ambigua" style="border:1px solid #886600; border-radius:5px; padding:8px; margin-bottom:8px; background:#1a1400;">
            <div style="color:#ddd; font-size:13px; margin-bottom:6px;">G${a.gruppo} \u00b7 ${a.riga.replace(/</g, '&lt;')}</div>
            ${a.candidati.map(c => `<button type="button" class="scelta-ambigua" onclick="window.scegliRigaAmbigua(${i}, '${String(c.id).replace(/'/g, "\\'")}')">${c.nome}</button>`).join('')}
            <button type="button" class="scelta-ambigua salta" onclick="window.scegliRigaAmbigua(${i}, null)">NESSUNO: SALTA LA RIGA</button>
        </div>`).join('');
};

window.scegliRigaAmbigua = (i, idProfilo) => {
    const a = window.righeAmbigueImport[i];
    if (!a) return;
    const p = idProfilo ? a.candidati.find(c => c.id === idProfilo) : null;
    if (p) { window.roster.push(window.unitaDaProfiloArmy(p, a.gruppo)); window.renderRoster(); }
    window.righeAmbigueImport.splice(i, 1);
    window.disegnaRigheAmbigue();
};

window.importaDaTesto = () => {
    let text = document.getElementById('army-import-text').value;
    if(!text) return alert("Incolla prima il testo della lista dal tasto 'Plain Text' dell'Army!");

    let lines = text.split('\n');
    let count = 0;
    let currentParseGroup = 1;
    const dbFazione = window.getDbFazione();
    window.righeAmbigueImport = [];

    // Prima si raccolgono le righe con il loro RIENTRO: Army mette i
    // periferici (Drumbot, Bambabot, Turtlemek...) su righe piu` rientrate
    // sotto la truppa che li porta. Prima ogni riga si leggeva da sola, e la
    // riga della truppa non diceva quale periferico avesse (vedi
    // riconosciRigaArmy).
    const righe = [];
    lines.forEach(line => {
        let lineUpper = line.toUpperCase().trim();
        if (lineUpper.length < 4) return;
        if (lineUpper.includes('SWC') || lineUpper.includes('NOMADS') || lineUpper.includes('PANOCEANIA') || lineUpper.includes('CORVUS BELLI')) return;
        // Il codice di Infinity Army in fondo al testo: non e` una truppa.
        if (/HTTPS?:\/\//.test(lineUpper)) return;

        // Army scrive il Gruppo e i suoi Ordini attaccati: "GROUP 28 / 2 / 3"
        // e` il Gruppo 2 con 8 Ordini. Il Gruppo e` la PRIMA cifra. Prima si
        // cercava "GROUP 1".."GROUP 4" dentro la riga: "GROUP 51" (Gruppo 5)
        // non cambiava Gruppo e le sue truppe finivano nel 4.
        const intest = lineUpper.match(/^(?:GROUP|GRUPPO)\s*(\d)/);
        if (intest) { currentParseGroup = parseInt(intest[1], 10); righe.push({ intestazione: true }); return; }

        // "ZONDNAUTICA-A undefined / undefined" non si importa, ma resta come
        // riga madre: le righe rientrate sotto sono SUE, non della truppa
        // prima.
        righe.push({ line: line, gruppo: currentParseGroup, rientro: line.replace(/\t/g, '    ').match(/^\s*/)[0].length,
                     salta: lineUpper.includes('UNDEFINED'), base: window.baseRigaArmy(line, dbFazione) });
    });

    // 20 ottobre (MOTORE, DATABASE 20.1): pilota e moto della Zondnautica,
    // e l'Operator di un TAG con Escape System, NON sono truppe della lista:
    // nascono in partita (SCENDI DALLA MOTO, Escape System). Army li scrive
    // rientrati sotto la loro truppa, e prima diventavano unita` a se`
    // (Zondnautica + Zondnaut + Zondmate: tre unita` per una). Qui si
    // raccolgono, per ogni nome base, i nomi base dei profili che il database
    // lega a lui (smonta.pilota, smonta.periferico, espelle.pilota).
    const perId = {};
    dbFazione.forEach(u => { perId[u.id] = u; });
    const legatiA = (base) => {
        const out = [];
        dbFazione.filter(u => window.nomeBaseArmy(u) === base).forEach(u => {
            [u.smonta && u.smonta.pilota, u.smonta && u.smonta.periferico, u.espelle && u.espelle.pilota]
                .filter(Boolean).forEach(id => { if (perId[id]) out.push(window.nomeBaseArmy(perId[id])); });
        });
        return out;
    };
    let assorbite = 0;

    righe.forEach((x, i) => {
        if (x.intestazione || x.salta) return;
        const extra = [];
        // La riga madre: la piu` vicina sopra, meno rientrata, senza passare
        // un'intestazione di Gruppo.
        let madre = null;
        for (let j = i - 1; j >= 0 && !righe[j].intestazione; j--) {
            if (righe[j].rientro < x.rientro) { madre = righe[j]; if (righe[j].base) extra.push(righe[j].base); break; }
        }
        // Pilota o moto della truppa madre: fa parte di lei, non si importa.
        if (madre && madre.base && x.base && legatiA(madre.base).indexOf(x.base) >= 0) { assorbite++; return; }
        // Le righe figlie: quelle sotto, piu` rientrate, fino alla prossima
        // riga allo stesso livello.
        for (let j = i + 1; j < righe.length && !righe[j].intestazione && righe[j].rientro > x.rientro; j++) {
            if (righe[j].base) extra.push(righe[j].base);
        }
        const e = window.riconosciRigaArmy(x.line, dbFazione, extra);
        if (e.stato === 'OK') {
            window.roster.push(window.unitaDaProfiloArmy(e.profilo, x.gruppo));
            count++;
        } else if (e.stato === 'AMBIGUA') {
            window.righeAmbigueImport.push({ riga: x.line.trim(), gruppo: x.gruppo, candidati: e.candidati });
        }
    });
    window.disegnaRigheAmbigue();
    // Per il banco e per chi guarda la console: quante righe rientrate sono
    // state lette come parte della truppa sopra.
    window.righeAssorbiteImport = assorbite;

    const amb = window.righeAmbigueImport.length;
    if(count > 0 || amb > 0) {
        alert(`✅ Importate ${count} unità dal testo, nei rispettivi Gruppi di Combattimento.` +
              (amb ? `\n\n⚠️ ${amb} ${amb === 1 ? 'riga è ambigua' : 'righe sono ambigue'}: scegli tu il profilo sotto il riquadro del testo.` : ''));
        if (!amb) document.getElementById('army-import-text').value = "";
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
    
    // Qui arrivano SOLO truppe. Gli elementi scenici hanno la loro tendina
    // (aggiungiStruttura) dal 14 settembre, e non passano piu` di qui:
    // il vecchio ripiego su DB_STRUTTURE e il ramo "STRUTTURA o TORRETTA ->
    // scenografia" sono stati tolti. Il secondo era anche sbagliato per
    // regola: una torretta e` un equipaggiamento che una truppa piazza, non
    // scenografia neutra, e se un giorno fosse rientrata da questa strada
    // sarebbe tornata a essere trattata come tale (segnalato dalla chat TEST).
    const dbFazione = window.getDbFazione();
    const dbUnit = dbFazione.find(u => u.id === idProfilo);
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

    window.roster.push(unit); 
    document.getElementById('unitAlias').value = ""; 
    window.renderRoster();
    
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

// Un avviso che dice solo "manca" lascia il giocatore a chiedersi cosa
// fare. Se il modello sparito dalla scenografia esiste ora fra i piazzabili,
// e` cambiato di natura e lo si dice; altrimenti si dice di rimetterlo.
// Nessuna regola qui: si legge solo dove sta adesso il modello nei dati.
window.cosaFareStrutturaMancante = (u) => {
    const piazzabile = (window.DB_DEPLOYABLES || []).find(d => d.id === u.modelId);
    if (piazzabile) {
        return `${piazzabile.nome}: non \u00e8 pi\u00f9 scenografia neutra ma un equipaggiamento. ` +
               `Toglila da qui e piazzala dalla truppa che la porta.`;
    }
    return `Modello non pi\u00f9 nel database (${u.modelId}): toglilo e rimettilo dalla tendina.`;
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
            <div style="display:flex; align-items:center; gap:8px;">
                <button type="button" class="tasto-riga-lista" title="Assegna o cambia il soprannome" aria-label="Soprannome" onclick="window.rinominaUnita(${i})">✏️</button>
                <button type="button" class="tasto-riga-lista togli del-btn" aria-label="Togli" onclick="window.removeUnit(${i})">X</button>
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
// ==========================================================================
//  COPIA LOCALE DELLA PARTITA
// ==========================================================================
// Il roster che l'app manda all'Hub e` FILTRATO per l'avversario: un
// mimetico diventa un segnalino senza profilo ne` ferite, e un'unita` in
// Hidden Deployment non parte affatto. Riaprendo l'app, quindi, dall'Hub
// non si puo` ricostruire la propria squadra: si riavrebbero segnalini
// anonimi e mancherebbero i nascosti.
//
// La copia intera resta percio` su QUESTO dispositivo, dove nessun
// avversario la legge. L'Hub resta l'arbitro di cio` che e` pubblico.
//
// SULLE FERITE vince sempre questa copia, per tutte le proprie unita`.
// Non e` una regola del regolamento: le ferite le scrive un punto solo,
// la pagina stati dell'app del proprietario, e l'Hub le COPIA senza mai
// calcolarle. Uno specchio puo` essere uguale o piu` vecchio, mai piu`
// nuovo. (Misurato dalla chat MOTORE, 25 settembre.)
//
// Si salva PRIMA di mandare all'Hub: al contrario, un'interruzione fra i
// due passi lascerebbe l'Hub piu` aggiornato del dispositivo.
window.chiavePartitaLocale = () => 'partita_locale_' + (window.isNomadsApp() ? 'nomadi' : 'panoceania');

window.salvaPartitaLocale = () => {
    try {
        localStorage.setItem(window.chiavePartitaLocale(), JSON.stringify({
            versione: 1,
            roster: window.roster || [],
            // I token NON si salvano a parte: dal 26 settembre stanno nel
            // roster come unita`, e di li` vengono salvati insieme a tutto il
            // resto. Le copie piu` vecchie hanno ancora il campo, e la ripresa
            // lo fonde nel roster: vedi riprendiPartita in app.html.
            strutture: window.activeStructures || [],
            terreni: window.activeTerrains || [],
            schieramentoCompletato: !!window.schieramentoCompletato,
            timestamp: Date.now()
        }));
        return true;
    } catch (e) {
        // Memoria piena o negata: non si blocca la partita per il salvataggio,
        // ma non si finge nemmeno che sia andato bene.
        console.error('\u26d4 Copia locale della partita NON salvata:', e);
        window.ultimaEccezione = e;
        return false;
    }
};

window.leggiPartitaLocale = () => {
    try {
        const grezzo = localStorage.getItem(window.chiavePartitaLocale());
        if (!grezzo) return null;
        const p = JSON.parse(grezzo);
        return (p && Array.isArray(p.roster) && p.roster.length) ? p : null;
    } catch (e) {
        window.ultimaEccezione = e;
        return null;
    }
};

window.scordaPartitaLocale = () => {
    try { localStorage.removeItem(window.chiavePartitaLocale()); } catch (e) {}
};

window.sendDataToServer = () => { 
    if(window.roster.length === 0 && window.activeStructures.length === 0) return alert("Schiera un'unit\u00e0 o una struttura!");

    // Mandare una lista nuova mentre una partita e` in corso sostituisce
    // all'Hub ferite e stati della propria fazione. Non deve poter
    // succedere con un tocco distratto sul pulsante di invio.
    // Sta PRIMA dell'invio perche` e` una domanda al giocatore, non al motore.
    const inCorso = window.leggiPartitaLocale && window.leggiPartitaLocale();
    if (inCorso && inCorso.schieramentoCompletato) {
        if (!confirm('C\'e` gia` una partita in corso per la tua fazione.\n\nInviando questa lista, all\'Hub sostituisci ferite e stati di quelle unita`.\n\nSe volevi solo riprendere la partita, annulla e usa RIPRENDI PARTITA.\n\nProcedo?')) return;
    }

    // UN SOLO MITTENTE. Qui si passava il roster al canale a mano, ed era
    // l'ultimo punto dell'app che lo faceva: bastava dimenticare il filtro
    // una volta perche` le truppe nascoste finissero sul telefono
    // dell'avversario, che ascolta tutti i canali. Ora si consegna il roster
    // PRIVATO al mittente del motore, che costruisce lui la busta filtrata e
    // scrive lui il canale — cosi` nessun chiamante puo` piu` sbagliare.
    // Salva anche la copia locale prima di spedire, quindi qui non si
    // richiama salvaPartitaLocale.
    if (typeof window.inviaSchieramentoAllHub !== 'function') {
        return alert('\u26d4 Core non caricato: i dati NON sono stati inviati.\n\nSenza il mittente del motore la busta non verrebbe filtrata, e l\'avversario vedrebbe le truppe nascoste.');
    }

    const esito = window.inviaSchieramentoAllHub(
        window.isNomadsApp() ? 'NOMADI' : 'PANOCEANIA',
        { roster: window.roster, strutture: window.activeStructures, terreni: window.activeTerrains }
    );

    if (!esito || !esito.inviato) {
        return alert('\u26d4 Dati NON inviati all\'Hub.\n\nMotivo: ' + ((esito && esito.motivo) || 'sconosciuto') + '\n\nRiprova, o controlla che l\'Hub sia aperto.');
    }

    document.getElementById('setup').style.display = 'none'; 
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-sync').style.display = 'flex'; 
};

// --- FASE DI DISPIEGAMENTO (FOG OF WAR, DEPLOYABLES) ---
// 27 ottobre sera: la ⓘ delle schermate dello schieramento (app.html).
window.passoInfo = (idStep) => { if (typeof window.segnaStepCorrente === 'function') window.segnaStepCorrente(idStep); };
// tasto: il data-nota del bottone a cui la nota appartiene (28 ottobre:
// con l'opzione "sotto i tasti" la nota si disegna li`).
window.infoSchieramento = (titolo, testo, tasto) => {
    // Dal 28 ottobre passa da M.nota (MOTORE): senza app.html resta in window.INFO.
    const M = window.MotoreN5;
    if (M && typeof M.nota === 'function') M.nota('step-deploy-states', titolo, testo, { tipo: 'regole', tasto: tasto || '' });
    else console.error('\u26d4 M.nota assente (serve motore_regole_n5.js dalla 2026-10-28.1): spiegazione persa: ' + titolo);
};

window.apriSchieramento = () => {
    if(window.roster.length === 0) return alert("Inserisci almeno un'unità prima di schierare!");
    
    document.getElementById('setup').style.display = 'none';
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-groups').style.display = 'flex';
    window.passoInfo('step-deploy-groups');
    
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
    window.passoInfo('setup');
};

window.apriGruppoDeploy = (g) => {
    window.deployGroup = g;
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-units').style.display = 'flex';
    window.passoInfo('step-deploy-units');
    window.renderDeployUnits();
};

// ==========================================================================
//  📷 LE FOTO DELLE MINIATURE (modello deciso da Paolo, 7 ottobre)
// ==========================================================================
// Le foto sono le miniature FISICHE, una per file, nella cartella img.
// - Ogni unita` schierata ha UNA foto; ogni foto sta su UNA sola unita`.
// - Qualunque foto va su qualunque unita` (i proxy): serve a riconoscere
//   sul tavolo la pedina vera. Profilo, armi e regole non c'entrano.
// - Niente numero fisso di foto per unita`.
//
// PRIMA: toccando la foto si girava fra 4 varianti (imgVariant 0..3) del
// file che porta il nome dell'unita`. Con sei Alguaciles le ultime due non
// si vedevano mai, con una miniatura sola comparivano tre riquadri neri, e
// un proxy non si poteva rappresentare. Due unita` potevano avere la stessa
// foto.
//
// QUALI FILE ESISTONO lo dice elenco_foto.js (window.FOTO_MINIATURE), che
// dal 15 ottobre sta nella cartella del giocatore (img/nomadi/ o
// img/panoceania/): ciascuno vede e assegna solo le sue miniature.
// un browser non puo` leggere una cartella. Lo rigenera la pagina
// avvia_elenco_foto.html ogni volta che Paolo aggiunge foto.
//
// DOVE STA LA SCELTA: nel campo imgVariant dell'unita`, che ora porta il
// NOME DEL FILE ("alguaciles_2.png") invece di un numero. Non e` un campo
// nuovo perche` l'elenco dei campi che arrivano all'avversario
// (catalogo_n5.js, campiVisibili) e` chiuso: un campo nuovo non passerebbe,
// imgVariant passa gia`. E di un Marker il motore lo riporta a '0': la foto
// della miniatura non rivela chi c'e` sotto il segnalino.
window.elencoFoto = () => Array.isArray(window.FOTO_MINIATURE) ? window.FOTO_MINIATURE : null;

// La foto assegnata a un'unita`, o null. Un valore vecchio ('0'..'3') non e`
// una foto assegnata.
window.fotoAssegnata = (u) => {
    const v = u && u.imgVariant;
    return (typeof v === 'string' && /\.(png|jpe?g|webp)$/i.test(v)) ? v : null;
};

// 23 ottobre (Paolo, via MOTORE): le FOTO COLLEGATE. Il pilota che scende
// dalla moto, la moto, il pilota uscito con l'Escape System sono miniature a
// parte: la loro foto si sceglie allo schieramento, subito dopo quella
// dell'unita`, e sta in u.fotoCollegate[chiave] (solo il nome del file, come
// imgVariant). Quali chiedere lo dice il motore (M.fotoCollegateDa). Anche
// queste sono miniature: una foto sta su UNA sola, quindi contano fra le
// prese.
window.fotoCollegateDi = (u) => {
    const M = window.MotoreN5;
    if (!M || typeof M.fotoCollegateDa !== 'function') {
        console.error('\u26d4 M.fotoCollegateDa assente (serve motore_regole_n5.js dalla 2026-10-23.2): non si chiedono le foto di pilota e moto.');
        return [];
    }
    return M.fotoCollegateDa(u) || [];
};
// Tutte le foto che un'unita` tiene: la sua e quelle collegate.
// `salvo` (facoltativo): la chiave da NON contare ('' = la foto principale).
window.fotoDiUnita = (u, salvo) => {
    const out = [];
    if (salvo !== '' && window.fotoAssegnata(u)) out.push(window.fotoAssegnata(u));
    const c = (u && u.fotoCollegate) || {};
    Object.keys(c).forEach(k => { if (k !== salvo && typeof c[k] === 'string' && c[k]) out.push(c[k]); });
    return out;
};

// Le foto ancora libere per quest'unita`: tutte, meno quelle che stanno gia`
// su un'ALTRA unita` del roster o su un altro posto della stessa (la foto
// principale e le collegate). `chiave`: il posto che si sta scegliendo
// (undefined = la foto dell'unita`).
// Prima contava solo la foto principale delle altre unita`.
window.fotoLibere = (u, chiave) => {
    const prese = [];
    (window.roster || []).filter(x => x && x !== u).forEach(x => prese.push.apply(prese, window.fotoDiUnita(x)));
    // Della stessa unita` contano gli ALTRI posti: scegliendo la foto
    // principale le collegate, scegliendo una collegata la principale e le
    // altre collegate.
    prese.push.apply(prese, window.fotoDiUnita(u, chiave === undefined ? '' : chiave));
    return (window.elencoFoto() || []).filter(f => prese.indexOf(f) < 0);
};
// Chi tiene gia` questa foto, fuori dal posto che si sta scegliendo.
window.chiTieneFoto = (u, chiave, file) => {
    const altra = (window.roster || []).find(x => x && x !== u && window.fotoDiUnita(x).indexOf(file) >= 0);
    if (altra) return altra.alias || altra.nome;
    if (window.fotoDiUnita(u, chiave === undefined ? '' : chiave).indexOf(file) >= 0) return (u.alias || u.nome) + ' (un altro posto della stessa unita`)';
    return null;
};

window.assegnaFoto = (index, file) => {
    const u = window.roster[index];
    if (!u) return false;
    if (file) {
        if ((window.elencoFoto() || []).indexOf(file) < 0) { alert('⛔ "' + file + '" non e` nell\'elenco delle foto.'); return false; }
        const chi = window.chiTieneFoto(u, undefined, file);
        if (chi) { alert('⛔ Questa foto e` gia` su ' + chi + ': una miniatura sta su una sola unita`.'); return false; }
    }
    u.imgVariant = file || '0';
    // Subito dopo, le foto collegate (pilota, moto), se l'unita` ne ha.
    const coll = window.fotoCollegateDi(u);
    if (coll.length) { window.apriGalleriaFoto(index, coll[0].chiave); return true; }
    window.chiudiGalleriaFoto();
    window.renderDeployUnits();
    return true;
};

// La foto di un'unita` collegata (u.fotoCollegate[chiave]). Poi la prossima
// collegata, o si chiude. file null = nessuna foto: il motore lascia il
// pilota senza e da` alla moto la foto dell'unita` montata.
window.assegnaFotoCollegata = (index, chiave, file) => {
    const u = window.roster[index];
    if (!u) return false;
    const coll = window.fotoCollegateDi(u);
    const k = coll.findIndex(c => c.chiave === chiave);
    if (k < 0) { console.error('\u26d4 assegnaFotoCollegata: "' + chiave + '" non e` una foto collegata di ' + (u.alias || u.nome)); return false; }
    if (file) {
        if ((window.elencoFoto() || []).indexOf(file) < 0) { alert('⛔ "' + file + '" non e` nell\'elenco delle foto.'); return false; }
        const chi = window.chiTieneFoto(u, chiave, file);
        if (chi) { alert('⛔ Questa foto e` gia` su ' + chi + ': una miniatura sta su una sola unita`.'); return false; }
    }
    const nuove = Object.assign({}, u.fotoCollegate || {});
    if (file) nuove[chiave] = file; else delete nuove[chiave];
    u.fotoCollegate = nuove;
    if (k + 1 < coll.length) { window.apriGalleriaFoto(index, coll[k + 1].chiave); return true; }
    window.chiudiGalleriaFoto();
    window.renderDeployUnits();
    return true;
};

window.chiudiGalleriaFoto = () => {
    const g = document.getElementById('galleria-foto');
    if (g) { g.style.display = 'none'; g.innerHTML = ''; }
};

// 8 ottobre (misura di TEST): due righe di questa funzione avevano le
// lettere accentate SCOMPOSTE (lettera + accento a parte, U+0300). Il
// browser le mostra uguali, ma copiando il file da una cartella all'altra
// qualcuno le ricompone: stessa versione, due impronte diverse, e
// l'impronta non identificava piu` il file. Ora quelle lettere sono entita`
// HTML (&egrave;, &agrave;): solo caratteri ASCII, nessuna ricomposizione.
// `chiave` (facoltativa): una foto collegata ('pilota', 'moto'), chiesta
// subito dopo quella dell'unita` (vedi window.fotoCollegateDi).
window.apriGalleriaFoto = (index, chiave) => {
    const u = window.roster[index];
    if (!u) return;
    const coll = (chiave !== undefined) ? window.fotoCollegateDi(u) : [];
    const posto = (chiave !== undefined) ? coll.find(c => c.chiave === chiave) : null;
    if (chiave !== undefined && !posto) { console.error('\u26d4 apriGalleriaFoto: "' + chiave + '" non e` una foto collegata di ' + (u.alias || u.nome)); return; }
    let g = document.getElementById('galleria-foto');
    if (!g || !g.style) {
        g = document.createElement('div');
        g.id = 'galleria-foto';
        document.body.appendChild(g);
    }
    g.style.cssText = 'position:fixed; inset:0; z-index:9500; background:rgba(0,0,0,.95); overflow-y:auto; padding:14px; box-sizing:border-box;';
    g.style.display = 'block';

    const elenco = window.elencoFoto();
    const chi = (u.alias || u.nome || '') + (posto ? ' \u2014 ' + posto.nome : '');
    const sottotitolo = posto
        ? `<div class="foto-collegata" style="color:#ffcc66; font-size:14px; margin-bottom:10px;">Miniatura a parte: ${posto.perche || posto.nome} (${coll.indexOf(posto) + 1} di ${coll.length}). Senza foto: ${posto.chiave === 'moto' ? 'la moto prende la foto dell\'unit&agrave; montata' : 'il pilota resta senza foto'}.</div>`
        : '';
    const comando = posto ? `window.assegnaFotoCollegata(${index}, '${posto.chiave}', ` : `window.assegnaFoto(${index}, `;
    // 15 ottobre: le foto di questo giocatore stanno nella SUA cartella
    // (img/nomadi/ o img/panoceania/, vedi CARTELLA_FOTO in app.html). Prima
    // la galleria le cercava in img/, dove ora restano solo le icone comuni.
    const cartella = (typeof window.cartellaFoto === 'function') ? window.cartellaFoto() : 'img/';
    let corpo;
    if (!elenco) {
        // Niente ripiego muto: senza elenco le foto non si possono scegliere,
        // e lo si dice con il rimedio.
        corpo = `<div style="border:2px solid #ffaa00; color:#ffdd88; padding:14px; border-radius:6px; font-size:15px;">
            ⚠️ L'elenco delle foto non &egrave; stato caricato (manca <b>${cartella}elenco_foto.js</b>).<br>
            Si genera con la pagina <b>avvia_elenco_foto.html</b> e va messo nella cartella <b>${cartella}</b>, insieme alle foto.</div>`;
    } else {
        const mia = posto ? ((u.fotoCollegate || {})[posto.chiave] || null) : window.fotoAssegnata(u);
        const libere = window.fotoLibere(u, posto ? posto.chiave : undefined);
        const tessera = (f) => `<button onclick="${comando}'${f.replace(/'/g, "\\'")}')" style="width:104px; padding:4px; background:${f === mia ? '#553300' : '#111'}; border:2px solid ${f === mia ? '#ffaa00' : '#444'}; border-radius:6px; color:#aaa; font-size:11px; overflow:hidden;">
                <img src="${cartella}${f}" style="width:92px; height:92px; object-fit:contain; display:block;" alt="">
                ${f.replace(/\.[a-z]+$/i, '')}</button>`;
        corpo = `<div style="color:#888; font-size:13px; margin-bottom:10px;">${libere.length} foto libere su ${elenco.length}. Quelle gi&agrave; su un'altra unit&agrave; non compaiono.</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">${libere.map(tessera).join('')}</div>
            <button class="btn-status" style="margin-top:14px;" onclick="${comando}null)">NESSUNA FOTO</button>`;
    }
    g.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <b style="color:#fff; font-size:20px;">📷 Foto per ${chi}</b>
            <button class="btn-status" style="width:auto; margin:0;" onclick="window.chiudiGalleriaFoto()">CHIUDI</button>
        </div>${sottotitolo}${corpo}`;
};

// Il tocco sulla foto, nella schermata di schieramento: apre la galleria.
// Il nome resta quello di prima perche` lo chiama la riga dell'unita`.
window.cambiaIconaDeploy = (event, index) => {
    if(event) event.stopPropagation();
    window.apriGalleriaFoto(index);
};

// PRESSIONE SULLA RIGA DELL'UNITA` (fase di schieramento)
//
//   tocco breve      -> schieramento e piazzamento (una pagina sola)
//   tocco prolungato -> stati e Fireteam
//   tocco sull'icona -> cambia foto
//
// Il gesto lungo prima si annullava di continuo: la riga aveva
// onpointerleave, che sul telefono scatta appena il dito esce dal bottone,
// cioe` al primo pixel di scorrimento. Ora si ascolta onpointercancel, che
// e` il segnale con cui il BROWSER dichiara di aver preso lui il gesto per
// scorrere, piu` una tolleranza di movimento: fermo il dito si apre, se
// scorri non si apre niente.
window.TOLLERANZA_PRESSIONE = 12;   // pixel
window.origineePressione = null;

window.startDeployPress = (index, evento) => {
    window.isDeployPressing = true;
    window.origineePressione = evento ? { x: evento.clientX, y: evento.clientY } : null;
    window.deployPressTimer = setTimeout(() => {
        if (window.isDeployPressing) {
            window.isDeployPressing = false;
            // Il dito e` ancora giu`: il click arrivera` al sollevamento,
            // sulla pagina degli stati appena aperta (vedi il clic fantasma).
            window.ingoiaClicDelGesto();
            window.apriStatiDaSchieramento(index);
        }
    }, 500);
};

window.moveDeployPress = (evento) => {
    if (!window.isDeployPressing || !window.origineePressione || !evento) return;
    const dx = Math.abs(evento.clientX - window.origineePressione.x);
    const dy = Math.abs(evento.clientY - window.origineePressione.y);
    if (dx > window.TOLLERANZA_PRESSIONE || dy > window.TOLLERANZA_PRESSIONE) window.cancelDeployPress();
};

window.endDeployPress = (index) => {
    if (window.isDeployPressing) {
        clearTimeout(window.deployPressTimer);
        window.isDeployPressing = false;
        window.ingoiaClicDelGesto();
        window.apriDeployStati(index);
    }
};

// IL CLIC FANTASMA (15 ottobre, segnalato da Paolo al tavolo via MOTORE:
// toccando l'Interventor il FastPanda si piazzava da solo).
// La pagina si cambiava al SOLLEVAMENTO del dito (pointerup). Sul telefono,
// subito dopo, il browser manda anche il "click" di quel tocco, e lo manda
// a cio` che c'e` in quel punto ADESSO: la pagina nuova. Se li` era appena
// stato disegnato un bottone (PIAZZA FastPanda, ma anche NORMALE o CAMO),
// veniva premuto senza che nessuno l'avesse toccato. Riprodotto in Chromium
// con tocco da telefono: dopo un solo tocco il roster aveva il FastPanda #1.
// Ora chi cambia pagina dentro un gesto chiede di ingoiare il click di
// QUEL gesto. Il segno si spegne al tocco successivo (pointerdown), cosi`
// se il dispositivo il click non lo manda, non si perde il tocco dopo.
window._ingoiaClic = false;
window.ingoiaClicDelGesto = () => { window._ingoiaClic = true; };
document.addEventListener('pointerdown', () => { window._ingoiaClic = false; }, true);
document.addEventListener('click', (e) => {
    if (!window._ingoiaClic) return;
    window._ingoiaClic = false;
    e.stopPropagation();
    e.preventDefault();
}, true);

window.cancelDeployPress = () => {
    clearTimeout(window.deployPressTimer);
    window.isDeployPressing = false;
    window.origineePressione = null;
};

// Apre stati e Fireteam SAPENDO di venire dallo schieramento: serve perche`
// annullaStati e salvaStatiUnita (logica_stati.js, non nostro) tornano
// sempre alla schermata di battaglia. Il ponte che riporta indietro sta
// nello script in coda ad app.html.
window.apriStatiDaSchieramento = (index) => {
    window.statiApertiDalloSchieramento = true;
    if (window.apriPaginaStati) window.apriPaginaStati(index);
};

// I TIRI DA FARE PRIMA DI COMINCIARE, tutti insieme
//
// Prima erano una finestra di conferma al momento dell'invio: arrivava a
// schieramento finito, elencava le unita` in un blocco di testo e chiedeva
// "hai gia` tirato?". Al tavolo si preme OK senza leggere, e i tiri si
// fanno dopo o non si fanno.
//
// Ora stanno nella pagina di schieramento, sempre visibili mentre si
// dispongono le truppe: una riga per unita`, con la sua skill e cosa deve
// tirare. Chi legge vede tutto in una volta e tira in un giro solo.
//
// Le righe le decide il MOTORE (M.promemoriaSchieramento): quali unita`,
// quale skill, quale testo. Qui non si stabilisce chi deve tirare.
window.tiriDiSchieramento = () => {
    const M = window.MotoreN5;
    if (!M || typeof M.promemoriaSchieramento !== 'function') return [];
    try { return M.promemoriaSchieramento(window.roster || []) || []; }
    catch (e) { window.ultimaEccezione = e; return []; }
};

window.pannelloTiriSchieramento = () => {
    const tiri = window.tiriDiSchieramento();
    if (!tiri.length) return '';

    // Il NUMERO lo dice gia` il motore, in coda al testo ("Tiro a 9 (PH 12 - 3)"):
    // non si ricalcola e non si aggiunge il PH per conto proprio, che sarebbe
    // un secondo numero per lo stesso fatto.
    const righe = tiri.map(t => `
            <div style="padding:6px 0; border-bottom:1px solid #332200;">
                <b style="color:#ffcc66;">${t.unita}</b> <span style="color:#aa8866; font-size:13px;">${t.skill}</span>
                <div style="color:#ccc; font-size:13px; margin-top:2px;">${t.testo}</div>
            </div>`).join('');

    return `<div class="section" style="border-color:#ffaa00; background:#1a1200; margin-bottom:12px;">
            <h3 style="margin-top:0; color:#ffcc66;">\u{1F3B2} TIRI DA FARE (${tiri.length})</h3>
            <div style="color:#aa8866; font-size:13px; margin-bottom:6px;">Si tirano al tavolo, prima di cominciare. L'app non conosce l'esito: segna tu il risultato.</div>
            ${righe}
        </div>`;
};

// 26 ottobre (Paolo, via MOTORE 26.1): i PILOTI DI LISTA di Gator,
// Szalamandra e Gecko partono A BORDO del loro TAG: non si piazzano, restano
// nel roster (stessi usi, stessi stati), l'avversario non li vede e non
// ricevono Ordini. Lo stato (M.mettiABordo) e il TAG giusto (M.tagDelPilota:
// il nome del pilota senza "Pilot", stesso Gruppo preferito, non occupato) li
// da` il motore; qui si applicano soltanto.
window.mettiABordoPilotiDiLista = () => {
    const M = window.MotoreN5;
    if (!M || typeof M.mettiABordo !== 'function' || typeof M.tagDelPilota !== 'function') {
        console.error('\u26d4 M.mettiABordo o M.tagDelPilota assente (serve motore_regole_n5.js dalla 2026-10-26.2): i piloti di lista restano da schierare.');
        return [];
    }
    const fatti = [];
    (window.roster || []).forEach(p => {
        if (!p || p.pilotaDiLista || p.deployable) return;
        // Quale TAG lo dice il motore (M.tagDelPilota, dal 26.2): prima la
        // ricerca stava qui, in roster_manager.
        const tag = M.tagDelPilota(p, window.roster);
        if (!tag) return;
        Object.assign(p, M.mettiABordo(p, tag));
        fatti.push({ pilota: p, tag: tag });
    });
    return fatti;
};

window.renderDeployUnits = () => {
    const container = document.getElementById('deploy-units-container');
    window.mettiABordoPilotiDiLista();
    // Gli stati di schieramento si aprivano SOLO col tocco lungo: un gesto
    // che sul telefono si annulla appena la lista scorre di un pixel, e che
    // nessuno indovina. Ora ogni unita` ha il suo pulsante, e il tocco lungo
    // resta come scorciatoia per chi lo conosce.
    container.innerHTML = window.pannelloTiriSchieramento() +
        `<p class="sottotitolo-step">Tocco rapido = Schieramento e piazzamento<br>Tocco prolungato = Stati e Fireteam<br>Tocco sulla foto = Cambia foto</p>`;

    let isNomads = window.isNomadsApp();
    let markerColor = isNomads ? 'orange' : '#00ccff';
    let reserveColor = isNomads ? 'yellow' : '#00ffff';

    let truppeDelGruppo = window.roster.filter(u => parseInt(u.combatGroup) === window.deployGroup);

    // 27 ottobre (collaudo grafico, B02-B03): la riga e` quella di tutti gli
    // altri elenchi, window.rigaUnitaConFoto (app.html), con la foto, la
    // forma, il soprannome. Prima era scritta a mano qui: un'altra forma,
    // e senza foto un'immagine ROTTA col testo "TOCCA PER LA FOTO". Ora
    // senza foto c'e` la sigla del tipo, e il tocco sulla foto (o sulla
    // sigla) apre la galleria (opzione toccoFoto). Le note di schieramento
    // vanno nella fascia bassa (opzione sotto).
    if (typeof window.rigaUnitaConFoto !== 'function') {
        console.error('⛔ window.rigaUnitaConFoto manca (app.html non caricato?): lista dello schieramento senza la riga con la foto.');
    }

    truppeDelGruppo.forEach(u => {
        let originalIndex = window.roster.indexOf(u);
        const note = [];
        const dep = String(u.deployState || '').toUpperCase();
        // In N5 il Marker Mimetico e` UNO SOLO (chat REGOLE, regolamento
        // v5.1.1 riga 13607): il segnalino porta il MOD del Mimetismo della
        // truppa, se ce l'ha, e nient'altro. Si riconosce QUALUNQUE
        // deployState che cominci per CAMO (liste salvate con CAMO_0..6).
        if (dep.indexOf('CAMO') === 0) note.push(`<span style='color:${markerColor};'>[ SEGNALINO CAMO${window.testoMimetismo(u)} ]</span>`);
        if (dep === "IMP_1") note.push(`<span style='color:${markerColor};'>[ IMP-1 ]</span>`);
        if (dep === "IMP_2") note.push(`<span style='color:${markerColor};'>[ IMP-2 ]</span>`);
        // 27 ottobre (MOTORE 27.5): con l'icona dell'Hidden Deployment (window.iconaSegnalinoSenzaNumero, app.html).
        // 27 ottobre sera (Paolo): niente scritta [ HIDDEN DEPLOYMENT ]: il
        // segnalino grande sta con le icone degli stati (vedi destra, sotto).
        // 27 ottobre (BS-29): lo Schieramento Aereo e` lo stato 'AD'
        // (M.opzioniSchieramento). La "Riserva" del regolamento non e` uno
        // stato: una lista salvata prima di oggi con 'RESERVE' lo dice, e la
        // truppa si rimette con la pagina degli stati.
        if (dep === "AD") note.push(`<span class='etichetta-ad' style='color:${reserveColor};'>[ SCHIERAMENTO AEREO ]</span>`);
        if (dep === "RESERVE") note.push(`<span class='etichetta-riserva-vecchia' style='color:#ffaa66;'>[ RISERVA: non e\` uno stato, sceglilo di nuovo ]</span>`);
        if (dep === "FOXHOLE") note.push(`<span style='color:#ff8800;'>[ FOXHOLE ]</span>`);
        if (dep === "SEED") note.push(`<span style='color:#00ff66;'>[ SEED-EMBRYO ]</span>`);
        if (dep === "HOLOMASK") note.push(`<span style='color:#cc00ff;'>[ HOLOMASK ]</span>`);
        if (u.tipo === "HOLOECHO") note.push(`<span style='color:#00ffff;'>[ OLO-ECO ]</span>`);
        // 26 ottobre: piloti a bordo, repliche (Decoy, Holoecho) e HoloMask.
        if (dep === 'A_BORDO') {
            const tag = (window.roster || []).find(t => t && t.id === u.aBordoDi);
            note.push(`<span class='etichetta-a-bordo' style='color:#ccccff;'>[ A BORDO ${tag ? 'DEL ' + String(tag.nome || tag.name || 'TAG').split('(')[0].trim().toUpperCase() : 'DEL TAG'}: NON SI SCHIERA ]</span>`);
        }
        const Mr = window.MotoreN5;
        if (u.replica) note.push(`<span class='etichetta-replica' style='color:#99ffff;'>[ ${u.tipoRepliche === 'DECOY' ? 'DECOY' : 'COPIA OLOGRAFICA'} ${u.numeroReplica || ''} — REPLICA ]</span>`);
        else if (u.gruppoRepliche) note.push(`<span class='etichetta-replica' style='color:#99ffff;'>[ ${u.tipoRepliche === 'DECOY' ? 'DECOY' : 'HOLOECHO'} ${u.numeroReplica || ''} — VERA ]</span>`);
        if (u.states && u.states.holomask && Mr && typeof Mr.mostraComeHolomask === 'function') {
            const mc = Mr.mostraComeHolomask(u);
            note.push(`<span class='etichetta-holomask' style='color:#cc00ff;'>[ HOLOMASK: SEMBRA ${mc ? String(mc.nome).toUpperCase() : '?'} ]</span>`);
        }

        const gesti = `onpointerdown="window.startDeployPress(${originalIndex}, event)"
                onpointerup="window.endDeployPress(${originalIndex})"
                onpointermove="window.moveDeployPress(event)"
                onpointercancel="window.cancelDeployPress()"`;
        const sotto = note.length ? `<div class="note-schieramento" style="font-size:var(--fs-s, 14px); line-height:1.3; margin-top:2px; white-space:normal;">${note.join('<br>')}</div>` : '';

        if (typeof window.rigaUnitaConFoto === 'function') {
            // Il segnalino dell'Hidden Deployment sta con le icone degli
            // stati (window.generaIconeStati, app.html), grande come loro.
            container.innerHTML += window.rigaUnitaConFoto(u, {
                fazione: 'PROPRIA', opacita: '1',
                attributi: gesti, sotto: sotto,
                toccoFoto: `window.cambiaIconaDeploy(event, ${originalIndex})`
            });
        } else {
            const nomePuro = (u.nome || u.name || "").split('(')[0].trim();
            container.innerHTML += `<button class="huge-btn" style="width:100%; margin-bottom:10px;" ${gesti} oncontextmenu="return false;">${nomePuro}${sotto}</button>`;
        }
    });
};

// Il MOD del Mimetismo da scrivere accanto al segnalino, chiesto al motore.
// Nessun MOD -> niente parentesi: un segnalino senza Mimetismo non ne ha.
window.testoMimetismo = (u) => {
    const M = window.MotoreN5;
    if (!M || typeof M.valoreMimetismo !== 'function') return '';
    try {
        const mod = M.valoreMimetismo(u);
        return (mod && mod !== 0) ? ` (${mod})` : '';
    } catch (e) {
        window.ultimaEccezione = e;
        return '';
    }
};

// CAMOUFLAGE (1 USE) E TIRO DI INFILTRAZIONE FALLITO (FAQ F07)
// Una truppa col CAMO monouso che tenta di schierarsi come Marker e
// fallisce il Tiro di Infiltrazione ha consumato l'uso. Il tiro si fa al
// tavolo, quindi l'app non puo` saperlo: lo dichiara il giocatore.
//
// Chi e` nel caso lo decide il MOTORE, non una ricerca di parole nelle
// skill: M.camoUnUso per il CAMO monouso, e per l'Infiltrazione lo
// stesso promemoriaSchieramento che oggi chiede "hai fatto il Tiro di
// Infiltrazione?". Chiamato su UNA sola unita`, cosi` non si confrontano
// soprannomi, che con due truppe uguali sarebbero ambigui.
window.puoFallireInfiltrazioneCamo = (u) => {
    const M = window.MotoreN5;
    if (!u || !M || typeof M.camoUnUso !== 'function' || typeof M.promemoriaSchieramento !== 'function') return false;
    if (u.camoUsato) return false;
    if (String(u.deployState || '').indexOf('CAMO') !== 0) return false;
    try {
        if (!M.camoUnUso(u)) return false;
        return (M.promemoriaSchieramento([u]) || []).some(p => p.skill === 'INFILTRATION');
    } catch (e) {
        window.ultimaEccezione = e;
        return false;
    }
};

window.infiltrazioneFallita = (index) => {
    const M = window.MotoreN5;
    const u = window.roster[index];
    if (!u || !M || typeof M.consumaCamo !== 'function') {
        console.error('\u26d4 M.consumaCamo assente: serve motore_regole_n5.js dalla 2026-09-21.25 in su.');
        return;
    }
    const ok = confirm(
        (u.alias || u.nome) + ': Tiro di Infiltrazione FALLITO.\n\n' +
        'Con Camouflage (1 Use) l\'uso del CAMO e` consumato (FAQ F07): ' +
        'per il resto della partita la truppa non potra` rientrare nello stato CAMO.\n\n' +
        'Confermi?'
    );
    if (!ok) return;

    // L'unita` aggiornata la calcola il motore; qui si sostituisce e basta,
    // come per applicaIdle. Non si toccano altri campi di nostra iniziativa.
    const esito = M.consumaCamo(u);
    // 6 ottobre: non piu` roster[index] scritto a mano ma il posto unico,
    // window.sostituisciUnita. SENZA INVIO: siamo in schieramento, prima
    // della conferma, e l'avversario non deve ancora vedere niente (chat
    // MOTORE). L'invio vero parte con la conferma dello schieramento.
    if (esito && esito.unitaAggiornata) {
        if (typeof window.sostituisciUnita === 'function') {
            window.sostituisciUnita(u, esito.unitaAggiornata, 'Infiltrazione fallita: uso del CAMO consumato', { senzaInvio: true });
        } else {
            // Senza motore_core.js il cambio non si perde: come prima.
            window.roster[index] = esito.unitaAggiornata;
            console.error('\u26d4 window.sostituisciUnita manca (motore_core.js non caricato?): uso del CAMO segnato a mano.');
        }
    }
    window.apriDeployStati(index);
    if (window.renderDeployUnits) window.renderDeployUnits();
};

// REMDRIVER: il pilota guida un REM, e quel REM prende i suoi valori.
// La regola e i controlli stanno nel motore (M.applicaRemDriver, chiamato
// da faseSchieramento.assegnaRemDriver): qui si chiede soltanto QUALE REM,
// perche` e` una cosa che sa solo chi guarda il tavolo.
//
// Il pulsante compare nella pagina di schieramento del pilota, e solo se
// nel roster c'e` almeno un REM. Il motore rifiuta da solo un secondo
// segnalino sullo stesso REM e un REM che non sia Pesante: qui non si
// duplica nessuno di quei controlli, si mostra il motivo che risponde.
window.haRemDriver = (u) => /remdriver/i.test(String((u && u.skills) || '') + ' ' + String((u && u.equip) || ''));

window.remDisponibili = () => (window.roster || []).filter(u => u && u.tipo === 'REM');

window.bottoneRemDriver = (index) => {
    const pilota = (window.roster || [])[index];
    if (!pilota || !window.haRemDriver(pilota)) return '';

    const rem = window.remDisponibili();
    if (!rem.length) {
        return `<div style="color:#aa8866; font-size:13px; margin:6px 0;">RemDriver: nessun REM nella lista a cui assegnarlo.</div>`;
    }

    // "Questo pilota ha gia` usato il suo segnalino" e` un fatto SUL PILOTA,
    // e dal 28 settembre il motore lo scrive li`: remDriverSu col nome del
    // REM. Prima scandagliavamo i REM per dedurlo, e prima ancora ne
    // tenevamo una copia nostra. Si legge dove la cosa e` scritta.
    if (pilota.remDriverSu) {
        return `<div style="color:#88cc88; font-size:14px; margin:6px 0;">RemDriver assegnato a <b>${pilota.remDriverSuNome || pilota.remDriverSu}</b>.</div>`;
    }

    return rem.map(r => `
        <button class="huge-btn tasto-opzione"
            onclick="window.assegnaRemDriverA(${index}, '${String(r.id).replace(/'/g, "\\'")}')">
            \u{1F916} REMDRIVER \u2192 ${r.alias || r.nome}
        </button>`).join('');
};

window.assegnaRemDriverA = (indexPilota, idRem) => {
    const pilota = (window.roster || [])[indexPilota];
    if (!pilota) return;
    if (!window.faseSchieramento || typeof window.faseSchieramento.assegnaRemDriver !== 'function') {
        return alert('\u26d4 fase_schieramento non caricato: il RemDriver non pu\u00f2 essere assegnato.');
    }

    const e = window.faseSchieramento.assegnaRemDriver(pilota.id, idRem) || {};
    if (!e.ok) return alert('\u26a0\ufe0f RemDriver non assegnato.\n\n' + (e.motivo || ''));

    // Il REM nel roster lo ha gia` aggiornato il motore, segnalino compreso:
    // qui si salva e si ridisegna, e basta. Il segnalino lo toglie lui
    // quando il pilota va Null.

    if (window.salvaPartitaLocale) window.salvaPartitaLocale();
    if (e.nota) alert('\u2705 ' + e.nota);
    window.apriDeployStati(indexPilota);
    if (window.renderDeployUnits) window.renderDeployUnits();
};

// 27 ottobre sera (collaudo, B07): nella scelta HoloMask c'erano due
// INDIETRO uno sotto l'altro, quello della scelta (al passo prima) e quello
// dello step (alla lista). Durante la scelta quello dello step si nasconde.
window.indietroDelloStepStati = (visibile) => {
    const b = document.getElementById('indietro-deploy-stati');
    if (b && b.style) b.style.display = visibile ? '' : 'none';
};

// L'icona di uno stato di schieramento, da mettere accanto alla scritta del
// suo tasto: il segnalino dell'Hidden Deployment (M.segnalinoSenzaNumero),
// l'icona del CAMO e quella dell'IMP (cartella dell'esercito, poi comune in
// img/, poi l'emoji). '' per gli altri stati.
window.iconaStatoSchieramento = (stato) => {
    const px = 34;
    if (stato === 'HIDDEN') return (typeof window.iconaSegnalinoSenzaNumero === 'function') ? window.iconaSegnalinoSenzaNumero({ deployState: 'HIDDEN' }, null, px) : '';
    const file = stato === 'CAMO' ? 'icon_camo' : stato === 'IMP_1' ? 'icon_imp1' : stato === 'IMP_2' ? 'icon_imp2' : null;
    if (!file || typeof window.attributiIconaStato !== 'function') return '';
    const emoji = stato === 'CAMO' ? '\ud83d\udc7b' : '\ud83c\udfad';
    return `<img class="icona-stato-schieramento" ${window.attributiIconaStato(file, window.fazionePropria(), `<span style=&quot;font-size:${px - 6}px; line-height:1;&quot;>${emoji}</span>`)} alt="" style="width:${px}px; height:${px}px; object-fit:contain;">`;
};

window.apriDeployStati = (index) => {
    window.unitToEdit = window.roster[index];
    window.indietroDelloStepStati(true);
    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-deploy-states').style.display = 'flex';
    window.passoInfo('step-deploy-states');
    if (window.MotoreN5 && typeof window.MotoreN5.azzeraNote === 'function') window.MotoreN5.azzeraNote('step-deploy-states');
    else console.error('\u26d4 M.azzeraNote assente (serve motore_regole_n5.js dalla 2026-10-28.1): note dello schieramento non azzerate.');

    let u = window.unitToEdit;
    let st = u.deployState || "NORMAL";

    // 27 ottobre (collaudo grafico, B04-B08): le scelte di questa pagina
    // sono EQUIVALENTI, e hanno lo stesso aspetto: tutta la larghezza, la
    // stessa altezza, e la scelta attiva accesa nel colore della fazione
    // (classe attivo; lo stile sta in app.html, #deploy-states-content).
    // Prima: quattro colori diversi, e i tasti delle mine (CRAZYKOALAS,
    // SHOCK MINE) stretti quanto il loro nome.
    const tasto = (attivo, comando, testo, extra) =>
        `<button class="huge-btn tasto-opzione${attivo ? ' attivo' : ''}${extra ? ' ' + extra : ''}" onclick="${comando}">${testo}</button>`;

    let html = `<div class="opzioni-schieramento">`;

    // NORMALE
    html += tasto(st === 'NORMAL', `window.setDeployState(${index}, 'NORMAL')`, 'NORMALE');

    // GLI STATI DI SCHIERAMENTO (27 ottobre sera, MOTORE 27.9): tutti dal
    // motore, M.opzioniSchieramento -> [{ stato, etichetta, nota, disponibile,
    // acceso }], nell'ordine CAMO, IMP, FOXHOLE, SEED, AD, HIDDEN. NORMALE resta
    // qui. Prima CAMO, IMPERSONATION, FOXHOLE e SEED si decidevano con quattro
    // ricerche di parole nelle skill, e il MOD del Mimetismo lo aggiungevamo
    // noi al testo del tasto: ora l'etichetta e` del motore, MOD compreso.
    //   acceso      la scelta attuale (classe attivo)
    //   disponibile false: tasto spento, con la nota del motore (Camouflage
    //               1 Use gia` consumato, F07)
    // La nota e` testo semplice: si scappa prima di metterla nell'HTML.
    {
        const M = window.MotoreN5;
        const testo = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (!M || typeof M.opzioniSchieramento !== 'function') {
            console.error('⛔ M.opzioniSchieramento assente (serve motore_regole_n5.js dalla 2026-10-27.9): nessuno stato di schieramento oltre NORMALE.');
            html += `<p style="color:#ff6666;">⛔ Stati di schieramento: serve motore_regole_n5.js dalla 2026-10-27.9.</p>`;
        } else {
            (M.opzioniSchieramento(u) || []).forEach(v => {
                if (typeof v.acceso !== 'boolean' || typeof v.disponibile !== 'boolean') {
                    console.error('⛔ M.opzioniSchieramento: la voce ' + v.stato + ' non ha acceso/disponibile (serve motore_regole_n5.js dalla 2026-10-27.9).');
                }
                const stato = String(v.stato).replace(/[^A-Z0-9_]/gi, '');
                // 27 ottobre sera (Paolo): il segnalino (Hidden, CAMO, IMP) a
                // SINISTRA della scritta, sulla stessa riga; prima stava sopra.
                const icona = window.iconaStatoSchieramento(stato);
                const classi = 'huge-btn tasto-opzione opzione-schieramento' + (v.acceso === true ? ' attivo' : '');
                const dentro = icona ? `<div class="voce-con-icona" style="display:flex; flex-direction:row; align-items:center; justify-content:center; gap:10px;">${icona}${testo(v.etichetta)}</div>` : testo(v.etichetta);
                html += (v.disponibile === false)
                    ? `<button class="${classi}" data-stato="${stato}" disabled>${dentro}</button>`
                    : `<button class="${classi}" data-stato="${stato}" onclick="window.setDeployState(${index}, '${stato}')">${dentro}</button>`;
                // 27 ottobre sera (Paolo): sotto le voci niente spiegazioni; la
                // nota resta solo per una voce SPENTA, perche` dice perche`.
                if (v.nota && v.disponibile === false) html += `<div class="nota-opzione">${testo(v.nota)}</div>`;
                // Le note delle voci accese stanno nella ⓘ della pagina.
                else if (v.nota) window.infoSchieramento(v.etichetta, v.nota);   // va al tasto con la stessa scritta
                // Sotto la voce CAMO: il tiro di Infiltrazione fallito (Camouflage
                // 1 Use, FAQ F07). Chi e` nel caso lo decide il motore
                // (puoFallireInfiltrazioneCamo chiede M.camoUnUso e M.promemoriaSchieramento).
                if (stato === 'CAMO' && window.puoFallireInfiltrazioneCamo(u)) {
                    html += `<button class="tasto-uscita" style="border-color:#ffaa00; color:#ffaa00; margin:0 0 10px 0;" onclick="window.infiltrazioneFallita(${index})">TIRO DI INFILTRAZIONE FALLITO</button>`;
                }
            });
        }
    }

    // HOLOMASK (26 ottobre, MOTORE 26.1): si sceglie il Modello da imitare
    // fra quelli che il motore ammette (M.profiliImitabili).
    html += window.bottoniHolomask(index);

    // DECOY / HOLOECHO (26 ottobre): le repliche le crea il motore.
    html += window.bottoniRepliche(index);

    html += `</div>`;

    // Piazzamento nella stessa pagina: schieramento e mine si decidono nello
    // stesso momento.
    const rem = window.bottoneRemDriver(index);
    if (rem) {
        html += `<p class="titolo-opzioni">REMDRIVER</p>${rem}`;
    }

    const piazzabili = window.bottoniDeployables(index);
    if (piazzabili) {
        html += `<p class="titolo-opzioni">EQUIPAGGIAMENTO DA PIAZZARE</p>${piazzabili}`;
    }

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

// --- HoloMask ---------------------------------------------------------
window.bottoniHolomask = (index) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || u.replica) return '';
    if (!/\bholomask\b/i.test(String(u.skills || '') + ',' + String(u.equip || ''))) return '';
    if (!M || typeof M.applicaHolomask !== 'function' || typeof M.profiliImitabili !== 'function') {
        return `<p style="color:#ff6666;">\u26d4 HoloMask: serve motore_regole_n5.js dalla 2026-10-26.1.</p>`;
    }
    const mc = (typeof M.mostraComeHolomask === 'function') ? M.mostraComeHolomask(u) : null;
    if (u.states && u.states.holomask) {
        return `<div class="riquadro-holomask" style="margin-top:10px; padding:10px; border:1px solid #cc00ff; border-radius:6px; background:#1a0022;">
            <div style="color:#e6aaff; font-size:15px;">\ud83c\udfad HOLOMASK: l'avversario vede <b>${mc ? mc.nome : '?'}</b>.</div>
            <button class="huge-btn tasto-opzione" style="margin-top:8px;" onclick="window.apriSceltaHolomask(${index})">CAMBIA MODELLO IMITATO</button>
            <button class="huge-btn tasto-opzione" onclick="window.togliHolomask(${index})">TOGLI HOLOMASK</button>
        </div>`;
    }
    return `<button class="huge-btn tasto-opzione" onclick="window.apriSceltaHolomask(${index})">HOLOMASK: SCEGLI IL MODELLO DA IMITARE</button>`;
};
// 26 ottobre (motore 26.2): la scelta in DUE passi, come dice la regola
// ("declaring which weapon option it is duplicating", pag. 161): prima la
// truppa, poi l'opzione d'arma. I gruppi li da` il motore
// (M.profiliImitabiliRaggruppati); con una sola opzione il secondo passo si
// salta. Prima l'elenco era piatto: 290 voci per un Bashi Bazouk.
window.apriSceltaHolomask = (index) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || !M) return;
    const box = document.getElementById('deploy-states-content');
    if (!box) return;
    if (typeof M.profiliImitabiliRaggruppati !== 'function') {
        box.innerHTML = `<p style="color:#ff6666; text-align:center;">\u26d4 HoloMask: serve motore_regole_n5.js dalla 2026-10-26.2 (M.profiliImitabiliRaggruppati).</p>` +
            `<button class="tasto-uscita" onclick="window.apriDeployStati(${index})">INDIETRO</button>`;
        return;
    }
    const gruppi = M.profiliImitabiliRaggruppati(u) || [];
    window._gruppiHolomask = gruppi;
    window.indietroDelloStepStati(false);
    // 27 ottobre (collaudo grafico, B07): 108 truppe, una pagina alta 9276 px.
    // Secondo giro (sera): con la ricerca l'elenco restava lungo, perche` a
    // campo vuoto c'erano tutte. Ora, con piu` di 8 truppe, l'elenco parte
    // VUOTO: si scrive una parte del nome o si tocca l'iniziale, e compaiono
    // solo quelle. Con 8 o meno si vedono subito tutte.
    const molte = gruppi.length > 8;
    const iniziali = [...new Set(gruppi.map(g => String(g.unita || '?').trim().charAt(0).toUpperCase()))].sort();
    box.innerHTML = `<p style="color:#e6aaff; text-align:center;">HOLOMASK \u2014 ${String(u.nome || '').split('(')[0].trim()}: chi deve vedere l'avversario?<br><span style="color:#aaa; font-size:13px;">Una truppa della tua fazione con la stessa Silhouette. Poi l'opzione d'arma.</span></p>` +
        (molte ? `<input type="search" id="cerca-holomask" class="cerca-holomask" placeholder="Cerca la truppa (${gruppi.length})\u2026" autocomplete="off" oninput="window.filtraHolomask(${index}, this.value)" style="margin:0 0 10px;">` +
                 `<div class="lettere-holomask">${iniziali.map(l => `<button type="button" class="huge-btn lettera-holomask" onclick="window.filtraHolomask(${index}, '', '${l.replace(/'/g, "\\'")}')">${l}</button>`).join('')}</div>` : '') +
        `<div id="lista-holomask">${molte ? window.righeHolomask(index, '', '', true) : window.righeHolomask(index, '')}</div>` +
        `<button class="tasto-uscita" onclick="window.apriDeployStati(${index})">INDIETRO</button>`;
};
// I bottoni delle truppe imitabili: il nome contiene `testo`, oppure comincia
// con `iniziale`. Vuoti tutti e due: tutte, o (vuotoSeNiente) nessuna con
// l'invito a cercare. L'indice di ogni gruppo resta quello dell'elenco intero,
// perche` lo usa apriVariantiHolomask.
window.righeHolomask = (index, testo, iniziale, vuotoSeNiente) => {
    const gruppi = window._gruppiHolomask || [];
    const cerca = String(testo || '').trim().toUpperCase();
    const lettera = String(iniziale || '').trim().toUpperCase();
    if (!cerca && !lettera && vuotoSeNiente) {
        return `<p class="invito-holomask" style="color:#aaa; text-align:center;">Scrivi una parte del nome o tocca l'iniziale.</p>`;
    }
    const righe = gruppi.map((g, k) => {
        const nome = String(g.unita || '').trim().toUpperCase();
        if (cerca && nome.indexOf(cerca) < 0) return '';
        if (lettera && nome.charAt(0) !== lettera) return '';
        const una = g.varianti.length === 1;
        const tocco = una ? `window.scegliHolomask(${index}, '${String(g.varianti[0].id).replace(/'/g, "\\'")}')` : `window.apriVariantiHolomask(${index}, ${k})`;
        return `<button class="huge-btn scelta-holomask-unita" onclick="${tocco}">${g.unita} <span style="color:#aaa; font-size:13px;">${una ? '' : '(' + g.varianti.length + ' opzioni d\'arma)'}</span></button>`;
    }).join('');
    return righe || `<p style="color:#888; text-align:center;">${cerca ? 'Nessuna truppa col nome che contiene \u201c' + String(testo).replace(/</g, '&lt;') + '\u201d.' : 'Nessun Modello imitabile.'}</p>`;
};
window.filtraHolomask = (index, testo, iniziale) => {
    const lista = document.getElementById('lista-holomask');
    if (lista) lista.innerHTML = window.righeHolomask(index, testo, iniziale, (window._gruppiHolomask || []).length > 8);
};
window.apriVariantiHolomask = (index, k) => {
    const u = (window.roster || [])[index];
    const g = (window._gruppiHolomask || [])[k];
    const box = document.getElementById('deploy-states-content');
    if (!u || !g || !box) return;
    window.indietroDelloStepStati(false);
    const righe = g.varianti.map(v => `<button class="huge-btn scelta-holomask"
            onclick="window.scegliHolomask(${index}, '${String(v.id).replace(/'/g, "\\'")}')">${v.nome}</button>`).join('');
    box.innerHTML = `<p style="color:#e6aaff; text-align:center;">HOLOMASK \u2014 sembra <b>${g.unita}</b>: quale opzione d'arma?</p>` + righe +
        `<button class="tasto-uscita" onclick="window.apriSceltaHolomask(${index})">INDIETRO</button>`;
};
window.scegliHolomask = (index, idProfilo) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || !M) return;
    const e = M.applicaHolomask(u, idProfilo);
    if (!e.possibile) return alert('\u26d4 HoloMask: ' + (e.motivo || 'non applicabile.'));
    window.sostituisciUnita(u, e.unitaAggiornata, 'HoloMask allo schieramento', { senzaInvio: true });
    alert('\ud83c\udfad ' + (e.note || []).join('\n\n'));
    window.apriDeployStati(index);
    if (window.renderDeployUnits) window.renderDeployUnits();
};
window.togliHolomask = (index) => {
    const u = (window.roster || [])[index];
    if (!u) return;
    const agg = Object.assign({}, u, { holomaskImita: null, states: Object.assign({}, u.states || {}, { holomask: false }) });
    if (String(agg.deployState || '').toUpperCase() === 'HOLOMASK') agg.deployState = 'NORMAL';
    window.sostituisciUnita(u, agg, 'HoloMask tolto allo schieramento', { senzaInvio: true });
    window.apriDeployStati(index);
    if (window.renderDeployUnits) window.renderDeployUnits();
};

// --- Decoy e Holoecho ---------------------------------------------------
window.bottoniRepliche = (index) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || u.replica || u.deployable) return '';
    if (!M || typeof M.puoReplicare !== 'function' || typeof M.creaRepliche !== 'function') {
        return /holoprojector|decoy/i.test(String(u.skills || '') + ',' + String(u.equip || ''))
            ? `<p style="color:#ff6666;">\u26d4 Decoy / Holoecho: serve motore_regole_n5.js dalla 2026-10-26.1.</p>` : '';
    }
    const gia = (typeof M.replicheDi === 'function') ? M.replicheDi(window.roster, u.id) : [];
    if (gia.length) {
        return `<div class="riquadro-repliche" style="margin-top:10px; padding:10px; border:1px solid #00ffff; border-radius:6px; background:#002222;">
            <div style="color:#99ffff; font-size:15px;">\ud83e\ude9e ${u.tipoRepliche === 'DECOY' ? 'DECOY' : 'HOLOECHO'}: ${gia.length} replica/e schierate. Questa \u00e8 la VERA (numero ${u.numeroReplica || '?'}).</div>
            <button class="huge-btn tasto-opzione" style="margin-top:8px;" onclick="window.togliRepliche(${index})">TOGLI LE REPLICHE</button>
        </div>`;
    }
    let html = '';
    ['HOLOECHO', 'DECOY'].forEach(tipo => {
        const ok = M.puoReplicare(u, tipo);
        if (!ok.puo) return;
        const testo = tipo === 'DECOY' ? `DECOY: ${ok.n} BERSAGLI DECOY` : `HOLOECHO: ${ok.n} COPIE OLOGRAFICHE`;
        html += `<button class="huge-btn bottone-repliche" onclick="window.creaRepliche(${index}, '${tipo}')">${testo}</button>`;
    });
    return html;
};
window.creaRepliche = (index, tipo) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || !M) return;
    const e = M.creaRepliche(u, tipo);
    if (!e.possibile) return alert('\u26d4 ' + (e.motivo || 'Repliche non possibili.'));
    // La vera si aggiorna sul posto (stesso oggetto), le repliche entrano nel
    // roster subito dopo di lei. SENZA INVIO: siamo in schieramento.
    window.sostituisciUnita(u, e.unitaAggiornata, tipo + ' allo schieramento', { senzaInvio: true });
    const i = window.roster.indexOf(u);
    window.roster.splice(i + 1, 0, ...e.repliche);
    alert('\ud83e\ude9e ' + (e.note || []).join('\n\n'));
    window.apriDeployStati(window.roster.indexOf(u));
    if (window.renderDeployUnits) window.renderDeployUnits();
};
window.togliRepliche = (index) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (!u || !M || typeof M.togliRepliche !== 'function') return;
    M.togliRepliche(window.roster, u.id);
    const flag = u.tipoRepliche === 'DECOY' ? 'decoy' : 'holoecho';
    const agg = Object.assign({}, u, { gruppoRepliche: undefined, tipoRepliche: undefined, numeroReplica: undefined,
                                       states: Object.assign({}, u.states || {}, { [flag]: false }) });
    window.sostituisciUnita(u, agg, 'Repliche tolte allo schieramento', { senzaInvio: true });
    window.apriDeployStati(window.roster.indexOf(u));
    if (window.renderDeployUnits) window.renderDeployUnits();
};

// Il vecchio GENERA OLO-ECO (prima del 26 ottobre): copiava la truppa a mano
// col tipo HOLOECHO. Ora passa dal motore; resta il nome per chi lo chiama.
window.generaOloEco = (index) => {
    const M = window.MotoreN5;
    const u = (window.roster || [])[index];
    if (M && u && typeof M.puoReplicare === 'function') {
        const tipo = M.puoReplicare(u, 'HOLOECHO').puo ? 'HOLOECHO' : 'DECOY';
        return window.creaRepliche(index, tipo);
    }
    return window.generaOloEcoVecchio(index);
};
window.generaOloEcoVecchio = (index) => {
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



// COSA PUO' PIAZZARE UNA TRUPPA, E COME
//
// Prima era un elenco di nomi scritto qui, che sbagliava in entrambi i
// versi: non conosceva la Armed Turret (offerta a 0 dei 3 portatori) ne` i
// Drop Bears, e a chi aveva una parola "mine" nel profilo offriva TUTTE e
// sei le mine (Gator col Mine Dispenser, Krakot con la Chest Mine). Il
// gettone poi lo costruiva a mano: scriveva ancora CAMO_3 e non scalava gli
// usi, quindi una truppa con una mina ne piazzava quante voleva.
//
// Ora: la lista viene da M.armiPiazzabili, il gettone e il portatore con
// l'uso scalato da M.creaDeployable. E` la stessa strada dell'ordine
// PIAZZARE EQUIPAGGIAMENTO a partita iniziata, quindi schieramento e partita
// contano gli usi allo stesso modo.
window._piazzabiliMostrati = {};

window.bottoniDeployables = (index) => {
    const M = window.MotoreN5;
    const u = window.roster[index];
    if (!u) return '';
    // 26 ottobre (DEP-10, Paolo: "ne piazzava 3 e nessuna domanda"): chi ha
    // MINELAYER piazza in schieramento dal percorso del motore
    // (window.faseSchieramento.minelayer): il limite (1, o il numero fra
    // parentesi) e le due domande dei requisiti. Il percorso qui sotto non li
    // conosceva.
    const ml = window.opzioniMinelayerDi(u);
    if (ml && ml.ha) return window.bottoniMinelayer(index, ml);
    if (!M || typeof M.armiPiazzabili !== 'function' || typeof M.creaDeployable !== 'function') {
        return `<p style="color:#ff6666; text-align:center;">\u26d4 Motore assente: impossibile sapere cosa piazza questa truppa.</p>`;
    }

    let esito;
    try { esito = M.armiPiazzabili(u) || {}; }
    catch (e) { window.ultimaEccezione = e; return `<p style="color:#ff6666;">\u26d4 Errore leggendo i piazzabili: ${e.message}</p>`; }

    const armi = esito.armi || [];
    window._piazzabiliMostrati[index] = armi;

    // 27 ottobre sera (Paolo): sotto il nome dell'equipaggiamento niente
    // tratti (Intuitive Attack, Disposable...): solo il nome.
    // I tratti, tolti dal tasto, stanno nella ⓘ della pagina.
    armi.forEach(a => { if (a.traits) window.infoSchieramento(a.nome, Array.isArray(a.traits) ? a.traits.join(', ') : a.traits); });   // va al tasto col nome
    let html = armi.map((arma, k) => `
        <button class="huge-btn tasto-opzione" onclick="window.schieraPiazzabile(${index}, ${k})">
            ${arma.nome}
        </button>`).join('');

    // Le escluse col motivo: "Usi esauriti (Disposable 1)" spiega perche` un
    // pulsante non c'e` piu` invece di farlo sparire in silenzio.
    (esito.escluse || []).forEach(x => {
        html += `<div style="color:#888; font-size:14px; margin:4px 0 8px 0;">${x.nome}: ${x.motivo}</div>`;
    });

    return html;
};

// --- Minelayer ----------------------------------------------------------
window.opzioniMinelayerDi = (u) => {
    const F = window.faseSchieramento && window.faseSchieramento.minelayer;
    if (!u || !F || typeof F.opzioni !== 'function') return null;
    try { return F.opzioni(u.id); } catch (e) { window.ultimaEccezione = e; console.error('\u26d4 minelayer.opzioni ha sollevato:', e); return null; }
};
window.bottoniMinelayer = (index, ml) => {
    const u = window.roster[index];
    window._minelayerMostrati = window._minelayerMostrati || {};
    window._minelayerMostrati[index] = ml.armi || [];
    let html = `<div class="riquadro-minelayer" style="color:#ffcc66; font-size:15px; text-align:center; margin-bottom:8px;">\ud83d\udca3 MINELAYER: piazzati ${ml.usati} su ${ml.pezzi}${ml.restanti > 0 ? ` \u2014 ne resta${ml.restanti > 1 ? 'no' : ''} ${ml.restanti}` : ' \u2014 nessuno da piazzare'}</div>`;
    (ml.armi || []).forEach((a, k) => {
        const attivo = ml.restanti > 0 && a.disponibile;
        const usi = (a.usiResidui != null) ? `<br><span style="font-size:12px; color:#aaa;">Usi residui: ${a.usiResidui}</span>` : '';
        html += `<button class="huge-btn bottone-minelayer" ${attivo ? `onclick="window.piazzaConMinelayer(${index}, ${k})"` : 'disabled'}>${a.nome}${usi}</button>`;
    });
    if (!(ml.armi || []).length) html += `<p style="color:#888; text-align:center;">Nessuna arma da piazzare col Minelayer.</p>`;
    return html;
};
window.piazzaConMinelayer = (index, k) => {
    const u = window.roster[index];
    const a = ((window._minelayerMostrati || {})[index] || [])[k];
    const F = window.faseSchieramento && window.faseSchieramento.minelayer;
    if (!u || !a || !F) return;
    const op = window.opzioniMinelayerDi(u) || {};
    const dom = op.domande || [];
    // Le due domande dei requisiti (il tavolo lo vede il giocatore). Quella
    // sull'area solo se l'arma ne ha una (E54: armi[i].chiedeArea).
    const risposte = {};
    if (a.chiedeArea) {
        risposte.nemiciNellArea = window.confirm((dom[0] || 'Ci sono truppe nemiche o Marker Mimetici nell\'Area d\'Innesco?') + '\n\nOK = S\u00cc, ci sono   \u00b7   Annulla = NO');
        if (risposte.nemiciNellArea) return alert('\u26d4 ' + a.nome + ' non si piazza: nell\'Area d\'Innesco non devono esserci nemici n\u00e9 Marker Mimetici.');
    }
    risposte.dentroZona = window.confirm((dom[1] || 'Il punto scelto \u00e8 dentro la tua Zona di Schieramento?') + '\n\nOK = S\u00cc   \u00b7   Annulla = NO');
    if (!risposte.dentroZona) return alert('\u26d4 ' + a.nome + ' non si piazza: il punto deve stare dove il Minelayer pu\u00f2 schierarsi.');
    const r = F.piazza(u.id, a.nome, risposte);
    if (!r || !r.token) {
        return alert('\u26d4 ' + (((r && r.errori) || []).map(x => x.messaggio).join('\n') || 'Piazzamento non riuscito.'));
    }
    // Il gettone del motore entra nel roster cosi` com'e`: si aggiungono i
    // campi che la lista dello schieramento legge, come per il percorso di
    // prima (schieraPiazzabile).
    const g = r.token;
    Object.assign(g, {
        name: g.name || g.nome,
        weapon: g.weapon || g.armi || '-',
        combatGroup: g.combatGroup || (window.roster.find(x => x && x.id === u.id) || u).combatGroup,
        imgVariant: g.imgVariant || '0',
        deployState: g.deployState || (g.isCamo ? 'CAMO' : 'NORMAL'),
        state: g.state || 'ACTIVE',
        tipo: g.tipo || 'DEPLOYABLE'
    });
    alert('\u2705 ' + (g.nome || a.nome) + ' piazzato col Minelayer.' + ((r.avvisi || []).length ? '\n\n' + r.avvisi.map(x => x.messaggio || x).join('\n') : ''));
    const i = window.roster.findIndex(x => x && x.id === u.id);
    window.apriDeployStati(i);
    if (window.renderDeployUnits) window.renderDeployUnits();
};

window.schieraPiazzabile = (index, k) => {
    const M = window.MotoreN5;
    const portatore = window.roster[index];
    const arma = (window._piazzabiliMostrati[index] || [])[k];
    if (!portatore || !arma) return;

    const e = M.creaDeployable(portatore, arma, { ordineId: 'schieramento_' + Date.now(), viaEsito: false });
    if (e.errori && e.errori.length) {
        return alert('\u26d4 ' + e.errori.map(x => x.messaggio + (x.dettaglio ? '\n   ' + x.dettaglio : '')).join('\n\n'));
    }

    // Il portatore con l'uso scalato: va tenuto, altrimenti app e motore
    // contano usi diversi e il pulsante resterebbe per sempre.
    // 6 ottobre: stesso posto unico, e anche qui SENZA INVIO (schieramento,
    // prima della conferma).
    if (typeof window.sostituisciUnita === 'function') {
        window.sostituisciUnita(portatore, e.portatoreAggiornato, 'Deployable piazzato in schieramento', { senzaInvio: true });
    } else {
        // Senza motore_core.js il cambio non si perde: come prima.
        window.roster[index] = Object.assign({}, portatore, e.portatoreAggiornato);
        console.error('\u26d4 window.sostituisciUnita manca (motore_core.js non caricato?): usi del portatore scalati a mano.');
    }

    // Il gettone del motore ha una forma sua (armi, isCamo, proprietario...):
    // qui si aggiungono solo i campi che la lista dello schieramento legge.
    // Se e` mimetico lo dice il motore (isCamo); il valore scritto e`
    // l'unico segnalino camo che esiste in N5.
    const g = e.token;
    window.roster.push(Object.assign({}, g, {
        name: g.nome,
        // Il gettone ha DUE campi vicini di nome e diversi di significato:
        // weapon e` l'arma (la torretta porta qui il Combi o il Marksman del
        // profilo), armi sulle mine e` la MUNIZIONE ("AP", "Shock"). Leggere
        // solo armi faceva comparire la munizione al posto dell'arma.
        // Il ripiego serve perche` la lista chiama weapon.split: un gettone
        // senza quel campo la farebbe esplodere.
        weapon: g.weapon || g.armi || '-',
        combatGroup: portatore.combatGroup,
        imgVariant: '0',
        deployState: g.isCamo ? 'CAMO' : 'NORMAL',
        state: 'ACTIVE',
        tipo: g.tipo || 'DEPLOYABLE'
    }));

    alert(`\u2705 ${g.nome} posizionato sul tavolo.`);
    window.apriDeployStati(index);
    if (window.renderDeployUnits) window.renderDeployUnits();
};


window.mostraMenuDeployables = (parentIndex) => {
    // Stessa lista della pagina di schieramento: una sola fonte, il motore.
    const container = document.getElementById('deploy-action-list-container');
    if (!container) return;
    const titleColor = window.isNomadsApp() ? 'var(--nomad-orange)' : '#00ccff';
    const bottoni = window.bottoniDeployables(parentIndex);
    container.innerHTML = `<p style="color:${titleColor}; text-align:center; margin-bottom:10px;">SELEZIONA COSA PIAZZARE:</p>` +
        (bottoni || `<p style="color:#888; text-align:center; margin-top:20px;">Nessun equipaggiamento piazzabile nel profilo di questa unit\u00e0.</p>`);
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
        deployState: depBase.isCamo ? "CAMO" : "NORMAL", 
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

// 27 ottobre: questa funzione NON e` quella che gira. fase_schieramento.js
// (chat MOTORE), caricato dopo, ridefinisce window.confermaSchieramento con
// faseSchieramento.concludiSchieramento. Lo Schieramento Aereo (BS-29) non ha
// quindi bisogno di states.reserve: il motore legge deployState 'AD'
// (statoBersaglio, vista pubblica, ARO). Segnalato a MOTORE.
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
    document.addEventListener("DOMContentLoaded", function () {
        window.inizializzaApp();
        if (window.mostraRipresaPartita) window.mostraRipresaPartita();
    });
} else {
    window.inizializzaApp();
    // Dopo inizializzaApp: la ripresa aspetta cloudPronto e si mostra da
    // sola quando sa se la partita esiste ancora. Sta in app.html.
    if (window.mostraRipresaPartita) window.mostraRipresaPartita();
}
// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'roster_manager.js', versione: '2026-10-28.2', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

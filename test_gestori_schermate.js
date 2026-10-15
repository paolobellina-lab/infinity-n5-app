// @versione 2026-10-06.1 | test_gestori_schermate.js | proprieta`: chat TEST
// ============================================================================
// I gestori on* delle schermate sono CODICE dentro una stringa: nessun
// controllo di sintassi li guarda, e un errore si scopre con un dito su uno
// schermo. Il banco disegna le schermate con dati veri, raccoglie l'HTML
// prodotto, estrae i gestori e li compila con new Function.
// Nasce dalla chat INTERFACCIA (23 settembre), dopo un onchange con le
// parentesi sbilanciate che non chiamava niente.
//
// RISCRITTO il 23 settembre, perché la prima versione non poteva fallire:
//   - gli script si caricavano con catch vuoto: un modulo con un errore di
//     sintassi spariva in silenzio e i conteggi non si muovevano. Provato:
//     togliendo una parentesi a ordine_attacco_bs.js restava "0 non
//     compilano". Ora ogni script che non carica è un fallimento.
//   - i conteggi si stampavano e non si asseriva niente: usciva sempre 0.
//   - il percorso era /mnt/project/ scritto in fisso: non si poteva provare
//     una correzione prima di caricarla. Ora si passa CARTELLA=.
//   - l'apostrofo era in un ALIAS di unità, che nell'HTML finisce nel testo e
//     non dentro un gestore: togliendo tutti i replace(/'/g, …) dai 15 file
//     il banco restava verde. Gli apostrofi contano in due punti veri, e ora
//     sono quelli a essere provati (sezioni 3 e 4).
//
// USO:  node test_gestori_schermate.js            (legge la propria cartella)
//       CARTELLA=/percorso/ node test_gestori_schermate.js (prova una copia)
//
// 6 OTTOBRE: la cartella predefinita era '/mnt/project/' scritta in fisso.
// Quando il progetto non e` montato la`, il banco non diventa rosso: muore
// prima della prima prova, e porta via tutte le sue. Il predefinito ora e`
// la cartella del banco stesso, che esiste sempre; CARTELLA resta lo
// scavalco. Nessuna asserzione cambia — cambia solo che si possono leggere.
// ============================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

const fs = require('fs'), vm = require('vm'), path = require('path');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
const h = fs.readFileSync(DIR + 'app.html', 'utf8');

const g = {}; g.window = g; g.globalThis = g; g.console = { log: () => {}, warn: () => {}, error: () => {} };
const el = {}; const prodotto = [];
const finto = (id) => { if (!el[id]) el[id] = { id, _h: '',
    get innerHTML() { return this._h; }, set innerHTML(v) { this._h = v; prodotto.push({ id, html: String(v) }); },
    style: {}, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} },
    setAttribute: () => {}, getAttribute: () => null, checked: false, options: [],
    cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} },
    querySelector: () => null };
    return el[id]; };
// document.write: app.html lo usa DURANTE il parsing per favicon e
// theme-color (riga 81), che e` uso legittimo — cambiarli dopo li farebbe
// lampeggiare. Il banco deve simulare il browser, non costringere l'app a
// evitare un'API: senza questa riga il caricamento falliva per colpa del
// banco. Quello che scrive si conserva, e la sezione 1 lo controlla.
const scritto = [];
const canali = {};
g.localStorage = { getItem: k => canali[k] || null, setItem: (k, v) => canali[k] = v, removeItem: k => delete canali[k] };
g.location = { search: '?fazione=nomadi', replace: () => {} };
let t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
g.document = { write: (h) => scritto.push(String(h)), writeln: (h) => scritto.push(String(h)),
    get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [],
    getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {} };
['alert', 'scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
g.setInterval = () => 0; g.setTimeout = () => 0; g.navigator = {}; g.prompt = () => null; g.confirm = () => true;
// history: un blocco in linea di app.html chiama pushState. Serve l'oggetto,
// non un catch: l'errore di un modulo vero deve restare un fallimento.
g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} };
g.firebase = { initializeApp: () => {}, database: () => ({ ref: () => ({ on: () => {}, set: () => {}, remove: () => {} }) }) };
const ctx = vm.createContext(g);

console.log('\n=== 1. Tutti gli script della pagina si caricano ===');
// Il catch vuoto della prima versione ingoiava i moduli rotti: qui ogni
// errore di caricamento è un fallimento, e i file citati nella pagina ma
// assenti dalla cartella pure.
const caricati = [], nonCaricati = [], assenti = [];
[...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
    const src = m[1];
    if (src) {
        if (/^https?:/.test(src)) return;
        const f = DIR + src.split('?')[0];
        if (!fs.existsSync(f)) { assenti.push(src); return; }
        try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx); caricati.push(src); }
        catch (e) { nonCaricati.push(src + ': ' + e.message); }
    } else {
        try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); }
    }
});
ok(caricati.length > 20, `script locali caricati: ${caricati.length}`);
ok(nonCaricati.length === 0, `nessuno script solleva caricandosi (${nonCaricati.length}${nonCaricati.length ? ' — ' + nonCaricati.slice(0, 3).join(' | ') : ''})`);
ok(assenti.length === 0, `nessuno script citato dalla pagina manca dalla cartella (${JSON.stringify(assenti)})`);
// Cosa scrive durante il parsing: solo <link> e <meta>. Un document.write con
// altro dentro, o chiamato a pagina caricata, cancellerebbe la pagina.
// Il 25 settembre INTERFACCIA ha tolto document.write da app.html: favicon e
// theme-color sono tag statici aggiornati con setAttribute. Lo stub resta —
// se rientrasse, la pagina si caricherebbe lo stesso e questa prova lo direbbe
// invece di far fallire il banco per un'API mancante.
ok(scritto.length === 0, `app.html non chiama document.write (${scritto.length} chiamate)`);

// --- dati veri per disegnare ---
const tutti = [].concat(g.DB_NOMADI || [], g.DB_PANOCEANIA || []);
const trova = (re) => tutti.find(u => re.test(u.nome));
g.roster = [
    { ...trova(/^Alguacil/), alias: "L'O'Brien", combatGroup: 1, states: {}, state: 'ACTIVE' },
    { ...trova(/^Moran/), alias: 'Moran', combatGroup: 1, deployState: 'CAMO', states: { camo: true }, state: 'ACTIVE' },
    { ...trova(/^Clockmaker \(Armed/), alias: 'Clock', combatGroup: 1, states: {}, state: 'ACTIVE' },
    { ...trova(/^Zero \(/), alias: 'Zero', combatGroup: 1, states: { unconscious: true }, state: 'ACTIVE' }
];
g.deployGroup = 1; g.currentGroup = 1; g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = [];
g.gameState = { nomads: g.roster, panoceania: [] };
canali['global_game_state'] = JSON.stringify({ nomads: g.roster,
    panoceania: [{ id: 'c9', nome: 'Cover nemica', varianteCopertura: 'VITROFERRO' }] });
g.activeStructures = [{ id: 's1', modelId: 'obj_console', alias: 'Console', tipo: 'STRUTTURA', weapon: '-' }];
g.activeTerrains = [{ id: 'TER_03', nome: 'Palude', tratti: ['Saturazione'] }];

const solleva = [];
const chiama = (nome, ...a) => { try { if (typeof g[nome] === 'function') {
    const r = g[nome](...a); if (typeof r === 'string') prodotto.push({ id: nome, html: r }); } }
    catch (e) { solleva.push(nome + ': ' + e.message); } };

console.log('\n=== 2. Le schermate si disegnano e i gestori compilano ===');
['renderRoster', 'renderStructures', 'renderTerrains', 'renderDeployUnits', 'aggiornaGraficaRoster',
 'renderReactiveRoster', 'aggiornaMenuGruppi', 'refreshSavedRostersList'].forEach(n => chiama(n));
[0, 1, 2].forEach(i => chiama('apriDeployStati', i));
chiama('bottoniDeployables', 2);
chiama('sceltaCopertura', null, 'window.setAroCopertura');
chiama('sceltaCopertura', 'VITROFERRO', 'window.setTargetCoperturaBS', 2);
chiama('procediAlleAzioni');

const gestori = (html) => { const out = []; const re = /\bon[a-z]+\s*=\s*"([^"]*)"/g; let m;
    while ((m = re.exec(html))) { const c = m[1].trim(); if (c) out.push(c); } return out; };
const compila = (lista) => lista.filter(c => { try { new Function(c); return false; } catch (e) { return true; } });
let n = 0; const rotti = [];
prodotto.forEach(p => gestori(p.html).forEach(c => { n++;
    try { new Function(c); } catch (e) { rotti.push(`${p.id}: ${e.message} — ${c.slice(0, 80)}`); } }));
ok(prodotto.length > 20, `schermate disegnate: ${prodotto.length}`);
ok(n > 100, `gestori estratti e compilati: ${n}`);
ok(rotti.length === 0, `tutti compilano (rotti: ${rotti.length}${rotti.length ? ' — ' + rotti.slice(0, 3).join(' | ') : ''})`);
ok(solleva.length === 0, `nessuna funzione di disegno solleva (${solleva.length}${solleva.length ? ' — ' + solleva.slice(0, 2).join(' | ') : ''})`);

console.log('\n=== 3. L apostrofo dentro un gestore: chiamataConValore ===');
// app.html: una stringa passata a un onchange va fra apici singoli, perché
// l'attributo usa i doppi. Qui l'apostrofo conta davvero.
if (typeof g.chiamataConValore === 'function') {
    const conApostrofo = g.chiamataConValore('window.setX', "VITRO'FERRO");
    ok(compila([conApostrofo]).length === 0, `l argomento con l apostrofo compila: ${conApostrofo}`);
    ok(/\\'/.test(conApostrofo), 'e l apostrofo è sfuggito, non lasciato crudo');
    // Controprova: senza l'escape la stessa stringa NON compila — così si
    // vede che la prova sopra misura l'escape e non la fortuna.
    ok(compila([`window.setX('VITRO'FERRO', this.value)`]).length === 1,
       'controprova: la stessa chiamata senza escape non compila');
    ok(compila([g.chiamataConValore('window.setX', 3)]).length === 0, 'e un numero resta un numero');
} else { ok(false, 'chiamataConValore non è esposta da app.html'); }

console.log('\n=== 4. L apostrofo nel nome di un arma ===');
// ordine_attacco_bs.js mette il nome dell'arma dentro onclick=
// window.declareAttackBS('...'): un apostrofo nel nome spezza l'attributo.
// Nessuna arma del database ne ha uno — la protezione è per il futuro — quindi
// il caso si costruisce qui, registrando un'arma con l'apostrofo e dandola a
// una copia di un profilo vero.
if (g.RULES_WEAPONS && typeof g.startUnitAllocationLoopBS === 'function') {
    g.RULES_WEAPONS["Fucile dell'Oste"] = { b: 3, dam: 13, ammo: 'N', bande: [{ label: '0-8', mod: 0 }], traits: '' };
    const base = trova(/^Alguacil \(Combi/);
    g.coordUnits = [{ ...base, alias: 'Prova', weapon: "Fucile dell'Oste", states: {} }];
    g.coordIndex = 0; g.currentOrder = { unit: g.coordUnits[0], action: 'ATTACCO BS' };
    const prima = prodotto.length;
    chiama('startUnitAllocationLoopBS');
    const nuovi = prodotto.slice(prima).map(p => gestori(p.html)).reduce((a, b) => a.concat(b), []);
    ok(nuovi.length > 0, `la schermata delle armi ha prodotto ${nuovi.length} gestori`);
    ok(nuovi.some(c => /Oste/.test(c)), 'e uno contiene il nome con l apostrofo');
    ok(compila(nuovi).length === 0, `compilano tutti (rotti: ${compila(nuovi).length})`);
    delete g.RULES_WEAPONS["Fucile dell'Oste"];
} else { ok(false, 'startUnitAllocationLoopBS o RULES_WEAPONS non disponibili'); }


console.log('\n=== 5. La scheda bersaglio con la copertura accesa ===');
// 🔴 Il caso che il banco non esercitava, e che al tavolo rompe DUE cose: il
// tasto copertura "che non fa niente" e la barra delle gittate "bloccata sulla
// prima fascia". Sono lo stesso difetto: renderTargetsAllocationBS solleva
// mentre ridisegna, quindi la schermata resta quella di prima.
// Il ramo si attiva solo se il bersaglio E` in copertura E window.sceltaCopertura
// esiste — che nel browser è sempre vero, perché sta in app.html. Disegnando
// senza di lei il ternario cortocircuita e il difetto non si vede: è il motivo
// per cui finora questo banco era verde.
if (typeof g.renderTargetsAllocationBS === 'function') {
    const bersaglio = (copertura) => ({ id: 't1', name: 'Fusilier (Combi Rifle)', burst: 3,
        rangeIndex: 1, rangeMod: 3, cover: copertura, terrain: 'NESSUNO', ammo: 'N' });
    const alg = trova(/^Alguacil \(Combi/);
    g.coordUnits = [{ ...alg, alias: 'Prova', states: {} }]; g.coordIndex = 0;
    g.currentOrder = { unit: g.coordUnits[0], weapon: 'Combi Rifle', action: 'ATTACCO BS' };
    let erroreSenza = null, erroreCon = null;
    g.combatTargets = [bersaglio(false)];
    try { g.renderTargetsAllocationBS(); } catch (e) { erroreSenza = e.message; }
    ok(!erroreSenza, `bersaglio senza copertura: si disegna (${erroreSenza || 'ok'})`);
    g.combatTargets = [bersaglio(true)];
    try { g.renderTargetsAllocationBS(); } catch (e) { erroreCon = e.message; }
    ok(!erroreCon, `bersaglio IN COPERTURA: si disegna (${erroreCon || 'ok'})`);
    // E la tendina "da quale copertura" deve nominare il bersaglio giusto:
    // con l'indice sbagliato il giocatore sceglierebbe per un altro.
    const ultimo = prodotto[prodotto.length - 1] || { html: '' };
    const scelte = (ultimo.html.match(/setTargetCoperturaBS\(([^,)]*)/g) || []);
    ok(scelte.length === 0 || !/undefined/.test(scelte.join('')),
       `la tendina della copertura passa un indice vero (${JSON.stringify(scelte)})`);
} else { ok(false, 'renderTargetsAllocationBS non è esposta'); }


console.log('\n=== 6. Ogni azione instradata ha una voce di menu ===');
// 🔴 A-09 al tavolo: Mary Problems (Climbing Plus) che scala consuma un
// Ordine intero. Il motore risponde giusto — ARRAMPICARSI è SHORT_SKILL per
// chi ha la skill — ma il menu offre una voce sola, "SALTO / SCALATA", che è
// il Salto: la scalata non è raggiungibile, quindi quel ramo non si usa mai.
// Un'azione che il menu non offre non arriva al motore: è la stessa forma di
// M.pulsanteCalcolo, che esisteva e non chiamava nessuno.
const M5 = g.MotoreN5;
const vociMenu = [...h.matchAll(/id:\s*'([A-Z_ ]+)'\s*,\s*nome:/g)].map(m => m[1]);
ok(vociMenu.length > 10, `voci di menu trovate in app.html: ${vociMenu.length}`);
// Il confronto passa dalla forma canonica: il menu scrive 'ATTACCO CC' dove
// il vocabolario dice 'CC_ATTACK', e sono la stessa azione. Le due voci di
// menu che coprono piu` azioni si dichiarano, invece di essere ignorate.
const canon = (x) => String(M5.azioneCanonica ? M5.azioneCanonica(x) : x).toUpperCase();
const COPERTE_DA_UNA_VOCE = { 'MEDICO_INGEGNERE': ['SUPPORTO_WIP', 'SUPPORTO_BS'] };
const daMenu = new Set(vociMenu.map(canon));
Object.entries(COPERTE_DA_UNA_VOCE).forEach(([voce, azioni]) => {
    if (vociMenu.includes(voce)) azioni.forEach(a => daMenu.add(canon(a)));
});
const instradate = Object.values(M5.AZIONI).filter(a => {
    const voce = (g.ROUTER_AZIONI || []).find(v => v.test(a));
    return !!voce && typeof g[voce.modulo] === 'function';
});
// PROTHEION resta fuori per i dati, non per il menu: nessun profilo dei due
// database ce l'ha. Dichiararlo qui e` piu` onesto che allargare il filtro.
const SOLO_ALTRE_FAZIONI = ['PROTHEION'];
const senzaVoce = instradate.filter(a => !daMenu.has(canon(a)) && !M5.azioneSenzaTiro(a)
                                    && SOLO_ALTRE_FAZIONI.indexOf(a) < 0);
ok(senzaVoce.length === 0, `ogni azione con un modulo ha una voce di menu (senza: ${JSON.stringify(senzaVoce)})`);
// E le azioni senza tiro che il modulo Movimento sa instradare devono
// comparire anch'esse: ARRAMPICARSI è quella che manca oggi.
const senzaTiroOfferte = ['MOVIMENTO', 'CAUTO', 'SALTO', 'ARRAMPICARSI'].filter(a => M5.azioneSenzaTiro(a));
const mancanti = senzaTiroOfferte.filter(a => !vociMenu.includes(a));
ok(mancanti.length === 0, `le azioni di movimento sono tutte nel menu (mancano: ${JSON.stringify(mancanti)})`);


console.log('\n=== 7. Ogni riga unità ha i gestori di pressione ===');
// 🔴 La correzione alla mia diagnosi, da INTERFACCIA: il tocco lungo NON era
// agganciato con addEventListener — erano attributi on*, che questo banco
// compilava benissimo. Sparivano perché l'attributo stava dentro un ternario
// ${ordinabile.ok ? ... : ''}: su un'unità non attivabile la riga usciva SENZA
// gestori. Un banco che compila quello che trova non vede un gestore ASSENTE.
// Quindi la prova non è "compilano", è "ci sono" — e va fatta sull'unità NON
// attivabile, l'unico caso in cui mancavano: su una sana sarebbe passata anche
// prima della correzione.
if (typeof g.aggiornaGraficaRoster === 'function') {
    const base = trova(/^Alguacil \(Combi/);
    g.roster = [
        { ...base, id: 'u1', alias: 'Sana', combatGroup: 1, states: {}, state: 'ACTIVE' },
        { ...base, id: 'u2', alias: 'Incosciente', combatGroup: 1, states: { unconscious: true }, state: 'UNCONSCIOUS' },
        { ...base, id: 'u3', alias: 'Isolata', combatGroup: 1, states: { isolated: true }, state: 'ACTIVE' }
    ];
    const prima = prodotto.length;
    g.currentGroup = 1;
    chiama('aggiornaGraficaRoster');
    // container.innerHTML += accumula: ogni riga compare in più istantanee.
    // Si guarda l'ULTIMA, che contiene il roster intero, e si conta per INDICE
    // di unità invece che per blocchi — tre unità, tre indici.
    const ultima = prodotto.slice(prima).map(p => p.html).pop() || '';
    const conAvvio = [...new Set([...ultima.matchAll(/avvioPressioneUnita\((\d+)/g)].map(m => m[1]))];
    const conFine = [...ultima.matchAll(/finePressioneUnita\((\d+),\s*(true|false)\)/g)]
        .reduce((acc, m) => (acc[m[1]] = m[2], acc), {});
    ok(conAvvio.length === 3, `tutte e tre le righe hanno l avvio della pressione (${conAvvio.length} su 3)`);
    ok(Object.keys(conFine).length === 3, `e tutte e tre la fine (${Object.keys(conFine).length})`);
    // La fine riceve se l'unità è attivabile: sull'Incosciente dev'essere false,
    // così il breve non seleziona e il lungo apre lo stesso.
    ok(conFine['1'] === 'false', `l Incosciente è marcato non attivabile (${conFine['1']})`);
    ok(conFine['0'] === 'true', `controprova: la sana è attivabile (${conFine['0']})`);
    // Controprova: il gesto non deve dipendere dallo stato. Se un domani
    // tornasse dentro un ternario, le righe con i gestori scenderebbero.
    ok(!/ordinabile\.ok \? .onpointer/.test(h), 'e nel sorgente i gestori non stanno dentro un ternario');
} else { ok(false, 'aggiornaGraficaRoster non è esposta'); }

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

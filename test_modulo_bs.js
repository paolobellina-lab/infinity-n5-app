// @versione 2026-10-12.1 | test_modulo_bs.js | proprieta`: chat TEST
// .1 (12 ott): sezione E — le armi scritte fra gli equipaggiamenti (modulo
//    ordine_attacco_bs 2026-10-10.2) e le armi ad azione dedicata (MediKit,
//    GizmoKit, Deactivator: mai un bottone dell Attacco BS). Profili veri,
//    insiemi nominati nei due versi, controprova su tutti i 765. Da 52 a 64.
// .1 (9 ott, pomeriggio): stessa correzione di test_integrazione.js sulle
//    bande del Combi — celle riespanse, e due confronti invece di uno.
// Test end-to-end del modulo BS riscritto — node test_modulo_bs.js
// Simula il minimo DOM che il modulo tocca, così si può collaudare senza browser.
global.window = global;

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}

// --- DOM finto ---
const elementi = {};
function nodo(id) {
    return elementi[id] || (elementi[id] = {
        id, innerHTML: '', innerText: '', style: {}, children: [],
        appendChild(c) { this.children.push(c); }, remove() {},
        cloneNode() { return nodo(id + '_clone'); },
        parentNode: { replaceChild() {} }
    });
}
global.document = {
    title: 'NOMADS HUB',
    getElementById: (id) => nodo(id),
    querySelector: () => nodo('btn-calcolo'),
    querySelectorAll: () => [],
    createElement: () => ({ id: '', style: { cssText: '' }, innerHTML: '', appendChild() {} })
};
let alertUltimo = null;
global.alert = (m) => { alertUltimo = m; };
let inviato = null;
global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = (s) => { global.ultimoStep = s; };
global.renderTargetButtons = () => { global.renderChiamato = true; };

const DIR_DB = (process.env.CARTELLA ? process.env.CARTELLA.replace(/\/?$/, '/') : './');
require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_bs.js');

// --- tavolo ---
const alguacil = { id: 'n1', alias: 'Alguacil Ana', nome: 'Alguacil', bs: 11,
                   weapon: 'Combi Rifle, Pistol', skills: '', states: {} };
const lince    = { id: 'n2', alias: 'Occhio di Lince', bs: 12,
                   weapon: 'MULTI Sniper Rifle', skills: 'Multispectral Visor L3', states: {} };
const multiman = { id: 'n3', alias: 'Portamulti', bs: 11,
                   weapon: 'MULTI Rifle, CC Weapon', skills: 'CC Attack (+1B)', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [alguacil, lince, multiman];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier Carlo', tipo: 'LI', arm: 1, states: {} },
    { id: 'p2', alias: 'Bolt KO', tipo: 'LI', state: 'UNCONSCIOUS', states: { unconscious: true } },
    { id: 'p3', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } },
    { id: 'p4', alias: 'Orc Morto', tipo: 'HI', state: 'DEAD', states: {} }
];

function nuovoOrdine(unita) {
    window.currentOrder = {};
    window.coordUnits = [unita];
    window.coordIndex = 0;
    window.coordPayloads = [];
    window.combatTargets = [];
    window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. La dipendenza nascosta è CHIUSA ===');
ok(typeof window.getWeaponProfile === 'undefined',
   'getWeaponProfile non esiste più: il ponte è stato rimosso');
ok(M.profiloArma('Combi Rifle').nome === 'Combi Rifle',
   'il profilo arriva dal motore, non da una funzione dentro questo modulo');

console.log('\n=== 2. Selezione arma: varianti dal database, non a mano ===');
nuovoOrdine(alguacil);
window.avviaFaseAttaccoBS('ATTACCO BS', false);
let htmlArmi = nodo('weapon-buttons-container').innerHTML;
ok(htmlArmi.includes('Combi Rifle') && htmlArmi.includes('Pistol'), 'Alguacil: Combi Rifle e Pistol offerte');
// 🔴 GIRATA IL 9 OTTOBRE (motore 2026-10-09.4, bottone di Paolo). Il bottone
// non mostra piu` la stringa "+3 / +3 / -3 / -3 / -6 / -6": le bande sono
// CELLE raggruppate dove il MOD non cambia (16" +3, 32" -3, 48" -6). La prova
// cercava quella stringa e andava rossa: il difetto era nella prova, non
// nell'app. Non si e` abbassata — si e` alzata: adesso le celle si
// RIESPANDONO in bande da 8" e si confrontano UNA PER UNA con quelle che il
// motore legge dal database. La stringa di prima controllava i sei MOD e non
// i pollici; questa controlla anche quelli, e nomina la banda che non torna.
function bandeDalBottone(html) {
    const celle = [...String(html).matchAll(/font-size:11px; padding:1px 0;">(\d+)"<\/span><span style="font-size:17px[^"]*">([+-]?\d+)</g)]
        .map(x => ({ fino: Number(x[1]), mod: Number(x[2]) }));
    const bande = []; let da = 0;
    celle.forEach(c => { for (; da < c.fino; da += 8) bande.push({ mod: c.mod, label: `${da}-${da + 8}"` }); });
    return bande;
}
const bottoneDi = (html, nome) => String(html).split('<button type="button" class="bottone-arma"')
    .find(b => b.indexOf('>' + nome + '</div>') >= 0) || '';
const unaRiga = (b) => b.map(x => `${x.mod > 0 ? '+' : ''}${x.mod} (${x.label})`).join('  ');
// `chi` nomina il secondo lato del confronto: il messaggio deve dire CONTRO
// COSA il bottone non torna, o chi legge non sa dove cercare.
function scartiBande(lette, attese, chi) {
    const n = Math.max(lette.length, attese.length), fuori = [];
    const dire = (x) => `${x.mod > 0 ? '+' : ''}${x.mod} a ${x.label}`;
    for (let i = 0; i < n; i++) {
        const x = lette[i], y = attese[i];
        if (!x) fuori.push(`banda ${i + 1} SPARITA dal bottone (${chi}: ${dire(y)})`);
        else if (!y) fuori.push(`banda ${i + 1} IN PIU sul bottone (${dire(x)}), ${chi} non la ha`);
        else if (x.mod !== y.mod || x.label !== y.label) fuori.push(`banda ${i + 1}: il bottone dice ${dire(x)}, ${chi} ${dire(y)}`);
    }
    return fuori;
}
// 🔴 DUE AFFERMAZIONI, NON UNA — e la prima versione di questa correzione
// (stamattina) ne aveva solo mezza. Avevo riespanso le celle e confrontate con
// M.profiloArma('Combi Rifle').bands: ma le celle il bottone le disegna DA QUEL
// PROFILO, quindi i due lati del confronto leggono lo stesso dato. Rompendo la
// terza banda nel database il bottone e il profilo cambiavano INSIEME e la
// prova restava verde: la tautologia di sempre, trovata rompendo. La stringa
// di prima, "+3 / +3 / -3 / -3 / -6 / -6", era inchiodata ai valori UFFICIALI
// e quel cambio lo vedeva. Quindi servono entrambe:
//   (a) il bottone mostra FEDELMENTE le bande del profilo  -> rompi il bottone
//   (b) le bande del Combi sono quelle del Weapon Chart     -> rompi il database
const BANDE_COMBI_UFFICIALI = [
    { mod:  3, label: '0-8"' },   { mod:  3, label: '8-16"' },
    { mod: -3, label: '16-24"' }, { mod: -3, label: '24-32"' },
    { mod: -6, label: '32-40"' }, { mod: -6, label: '40-48"' }
];
{
    const lette = bandeDalBottone(bottoneDi(htmlArmi, 'Combi Rifle'));
    const dalProfilo = M.profiloArma('Combi Rifle').bands.map(b => ({ mod: b.mod, label: b.label }));
    // (a) fedelta` del disegno: il bottone contro il profilo che sta disegnando
    const infedele = scartiBande(lette, dalProfilo, 'il profilo dell arma');
    ok(lette.length > 0 && infedele.length === 0,
       lette.length === 0
         ? 'il bottone del Combi mostra le bande del profilo, come celle raggruppate'
         : `il bottone del Combi mostra le bande del profilo, come celle raggruppate (${unaRiga(lette)})`,
       lette.length === 0
         ? 'NESSUNA CELLA DI GITTATA LETTA sul bottone del Combi: questa prova non sta guardando niente. Il motore ha cambiato il disegno del bottone?'
         : infedele.join('\n       '));
    // (b) i valori ufficiali, inchiodati qui: e` l unica meta` che vede un
    //     cambio nel database, perche` non lo rilegge dal database.
    const nonUfficiali = scartiBande(lette, BANDE_COMBI_UFFICIALI, 'il Weapon Chart');
    ok(lette.length > 0 && nonUfficiali.length === 0,
       'e sono quelle del Weapon Chart: +3 +3 / -3 -3 / -6 -6 su sei fasce da 8" fino a 48"',
       lette.length === 0 ? 'nessuna cella letta: vedi la prova qui sopra' : nonUfficiali.join('\n       '));
}

nuovoOrdine(lince);
window.startUnitAllocationLoopBS();
htmlArmi = nodo('weapon-buttons-container').innerHTML;
const modalita = (htmlArmi.match(/MULTI Sniper Rifle \(/g) || []).length;
ok(modalita >= 3, `MULTI Sniper espansa nelle sue modalità (${modalita} bottoni)`);

nuovoOrdine(multiman);
window.startUnitAllocationLoopBS();
htmlArmi = nodo('weapon-buttons-container').innerHTML;
ok(htmlArmi.includes('arma da Corpo a Corpo'),
   'la CC Weapon non è offerta, ma il motivo è scritto (non sparisce in silenzio)');

console.log('\n=== 3. Selezione bersaglio: gli esclusi restano visibili ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.setupTargetSelectionBS();
ok(window.validTargets.length === 2, `2 bersagli validi (trovati ${window.validTargets.length})`);
ok(window.validTargets.some(u => u.alias === 'Bolt KO'),
   'l Incosciente è bersagliabile (prima questo modulo lo escludeva)');
ok(window.targetsScartati.length === 2, 'i 2 esclusi sono elencati');
console.log('   esclusi: ' + window.targetsScartati.map(t => `${t.nome} (${t.motivo.slice(0, 40)}…)`).join(' | '));

console.log('\n=== 4. Multispectral Visor L3 apre i Marker ===');
nuovoOrdine(lince);
window.currentOrder.weapon = 'MULTI Sniper Rifle (AP Mode)';
window.setupTargetSelectionBS();
ok(window.validTargets.some(u => u.alias === 'Croc Man'),
   'con MSV L3 il Marker CAMO è bersagliabile senza Scoprire');

console.log('\n=== 5. LA SEGNALAZIONE #5: niente bersaglio fantasma ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [];
window.goToModifiersBS('ATTACCO BS');
ok(alertUltimo && alertUltimo.includes('Nessun bersaglio confermato'),
   'senza bersagli il modulo si ferma e lo dice');
ok(!window.combatTargets.some(t => t.name === 'Bersaglio Primario'),
   'nessun "Bersaglio Primario" inventato');

console.log('\n=== 6. Gittata: banda iniziale esplicita ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.combatTargets[0].rangeMod === 3 && window.combatTargets[0].rangeIndex === 0,
   'banda 0 -> +3, indice e MOD allineati',
   `mod=${window.combatTargets[0].rangeMod} idx=${window.combatTargets[0].rangeIndex}`);
window.setTargetRangeBS(0, 5);
ok(window.combatTargets[0].rangeMod === -6 && window.combatTargets[0].rangeIndex === 5,
   'banda 5 (40-48") -> -6: indice e MOD non possono disallinearsi');
window.setTargetRangeBS(0, 2);
ok(window.combatTargets[0].rangeMod === -3,
   'banda 2 (16-24") -> -3, non più -6: col vecchio db qui il tiro sbagliava di 3');

console.log('\n=== 7. Burst ===');
ok(window.totalBurst === 3, `Combi Rifle: 3 dadi (ottenuti ${window.totalBurst})`);
ok(window.combatTargets[0].burst === 3, 'tutti i dadi sul primo bersaglio');

nuovoOrdine(multiman);
window.currentOrder.weapon = 'MULTI Rifle (AP Mode)';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.totalBurst === 3,
   'il "CC Attack (+1B)" NON dà un dado in più sparando (prima lo dava)',
   `ottenuto ${window.totalBurst}`);

nuovoOrdine(alguacil);
window.coordMode = true; window.coordUnits = [lince, alguacil]; window.coordIndex = 1;
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.totalBurst === 1, 'gregario in Ordine Coordinato: Burst 1');

console.log('\n=== 8. Invio: passa solo un payload valido ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
window.eseguiCalcoloBS();
ok(inviato !== null, 'attacco valido: spedito all Hub');
ok(inviato && inviato.attacchi[0].bersagli[0].name === 'Fusilier Carlo', 'il bersaglio nel payload è quello vero');
ok(inviato && inviato.attacchi[0].azione === M.AZIONI.BS_ATTACK, 'azione dal vocabolario canonico');

nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 3, rangeIndex: 0, rangeMod: 3 }];
window.totalBurst = 3;
window.eseguiCalcoloBS();
ok(inviato === null, 'payload con fantasma: NIENTE spedito');
ok(alertUltimo && alertUltimo.includes('INVIO BLOCCATO'), 'il blocco è spiegato all utente');
ok(window.coordIndex === 0 && window.coordPayloads.length === 0,
   'lo stato è ripristinato: l ordine non è stato consumato');

console.log('\n=== 9. Burst oltre il disponibile ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
window.combatTargets[0].burst = 5;
window.eseguiCalcoloBS();
ok(inviato === null && alertUltimo.includes('5'), '5 dadi con un Combi da 3: bloccato');

console.log('\n=== 10. BS-06 del piano: il Croc Man nasce Marker ===');
// Il piano di collaudo dava BS-06 per difetto ("anello sulla scelta
// dell'arma"). Non e` un difetto: nel database il Croc Man nasce
// deployState 'CAMO', e contro un Marker l'Attacco BS non si dichiara —
// l'app avvisa e torna alla scelta dell'arma. Era lo SCENARIO a essere
// sbagliato: ci vuole un Croc Man rivelato.
// Si usano i profili VERI del database, non una copia scritta a mano: una
// copia a mano e` sempre piu` ordinata della realta`, ed e` il modo piu`
// comodo per non accorgersi di come nascono davvero le unita`.
require(DIR_DB + 'database_nomad.js'); require(DIR_DB + 'database_panoceania.js');
const TUTTI = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
const crocVero = TUTTI.find(u => /^Croc Man \(MULTI Sniper/.test(u.nome));
const algVero  = TUTTI.find(u => /^Alguacil \(Combi/.test(u.nome));
ok(crocVero && String(crocVero.deployState).toUpperCase() === 'CAMO',
   `nel database il Croc Man nasce Marker (deployState ${crocVero && crocVero.deployState})`);
const comeNasce = M.bersagliValidi(M.AZIONI.BS_ATTACK, [crocVero], { attaccante: algVero })[0];
ok(!comeNasce.ammesso && /Scoperto/.test(String(comeNasce.motivo)),
   `e come nasce l Attacco BS non si dichiara (${String(comeNasce.motivo).slice(0, 55)}…)`);

// CONTROPROVA: rivelato è un bersaglio legittimo, e i numeri del piano sono
// quelli. Senza questa metà, "rifiutato" non distingue "va Scoperto prima"
// da "questo profilo non è bersagliabile".
const crocRivelato = Object.assign(JSON.parse(JSON.stringify(crocVero)),
    { deployState: 'NORMAL', state: 'ACTIVE', states: { camo: false } });
const rivelato = M.bersagliValidi(M.AZIONI.BS_ATTACK, [crocRivelato], { attaccante: algVero })[0];
ok(rivelato.ammesso, 'rivelato (Modello) è bersagliabile');
const bs06 = M.modAttacco(algVero, crocRivelato, M.profiloArma('Combi Rifle'),
    M.AZIONI.BS_ATTACK, { rangeIndex: 1, cover: true });
ok(bs06.valore === 5,
   `BS-06: 11 +3 gittata −3 copertura −6 Mimetismo = 5 (ottenuto ${bs06.valore})`);
const sc06 = M.risolviScontro(
    { attaccante: algVero, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'),
      bersaglio: crocRivelato, burst: 1, rangeIndex: 1, cover: true },
    { difensore: crocRivelato, azione: 'NESSUNA' }, {});
ok(sc06.attivo.salvezzaInflitta && sc06.attivo.salvezzaInflitta.valoreSuccesso === 11,
   `e la salvezza è ARM VS 11 (ottenuto ${sc06.attivo.salvezzaInflitta && sc06.attivo.salvezzaInflitta.valoreSuccesso})`);


// ==================================================================
// PUNTO D — ALLEATI NELLA MISCHIA, dalla scheda dell'Attacco BS
//   Nuovo il 7 ottobre (TPL-01 al tavolo). Chi tira contro un bersaglio
//   INGAGGIATO prende -6 per OGNI suo alleato in quel Corpo a Corpo, e
//   l'app non ha la mappa: lo chiede. La domanda compare SOLO se il
//   bersaglio e` Ingaggiato, parte da 1 (il caso normale), e lo zero
//   esiste — il bersaglio e` in mischia con qualcuno che non e` mio.
//   Senza la domanda, un Fusilier rimasto Ingaggiato annullava la Sagoma
//   e non c'era modo di dire "nessun alleato".
// ==================================================================
console.log('\n=== D. Alleati nella mischia, dalla scheda BS ===');

// Un nemico Ingaggiato nel roster, accanto a quelli che c erano.
const ingaggiato = { id: 'p5', alias: 'Fusilier in mischia', tipo: 'LI', arm: 1, states: { engaged: true } };
M._rosterNemico = M._rosterNemico.concat([ingaggiato]);
const libero = M._rosterNemico.find(u => u.id === 'p1');

function schedaBS(idBersaglio, arma) {
    nuovoOrdine(alguacil);
    window.currentOrder.weapon = arma || 'Combi Rifle';
    window.combatTargets = [{ id: idBersaglio, name: 'bersaglio', burst: 3, rangeIndex: 0, cover: false }];
    return window.htmlAlleatiInMischiaBS(window.combatTargets[0], 0);
}

console.log('\n--- la domanda compare solo se serve ---');
const domanda = schedaBS('p5');
ok(/quanti/i.test(domanda) && /alleati/i.test(domanda),
   'bersaglio Ingaggiato: la scheda chiede quanti tuoi alleati sono in quella mischia');
ok(/setAlleatiInMischiaBS\(0, ?0\)/.test(domanda) && /setAlleatiInMischiaBS\(0, ?3\)/.test(domanda),
   'con i quattro tasti 0-3, che chiamano window.setAlleatiInMischiaBS');
ok(window.combatTargets[0].alleatiInMischia === 1,
   `e il valore parte da 1, il caso normale (${window.combatTargets[0].alleatiInMischia})`);
// CONTROPROVA: bersaglio NON ingaggiato, nessuna domanda. Senza questa,
// "la domanda c e`" non si distingue da "la domanda c e` sempre" — e una
// domanda che non c entra, al tavolo, si risponde a caso.
ok(schedaBS('p1') === '',
   'CONTROPROVA: bersaglio NON Ingaggiato, nessuna domanda');
ok(window.combatTargets[0].alleatiInMischia === undefined,
   'e nessun valore iniziale scritto sul bersaglio: il campo non esiste');

console.log('\n--- il tasto scrive il valore, e arriva alla busta ---');
schedaBS('p5');
window.setAlleatiInMischiaBS(0, 0);
ok(window.combatTargets[0].alleatiInMischia === 0,
   `toccando 0 il campo diventa 0, non torna a 1 (${window.combatTargets[0].alleatiInMischia})`);
window.setAlleatiInMischiaBS(0, 2);
ok(window.combatTargets[0].alleatiInMischia === 2, 'e toccando 2 diventa 2');
// E il tasto scelto si vede: senza, il giocatore non sa cosa ha risposto.
ok(/ffaa33[^<]*>2</.test(window.htmlAlleatiInMischiaBS(window.combatTargets[0], 0).replace(/\n/g, '')) ||
   /background:#553300[\s\S]{0,200}>2</.test(window.htmlAlleatiInMischiaBS(window.combatTargets[0], 0)),
   'e il tasto scelto è acceso nella scheda');

console.log('\n--- e il numero arriva al calcolo ---');
// I tre casi del contratto, letti dal motore sul bersaglio vero.
const combiD = M.profiloArma('Combi Rifle');
const fonti = (r) => ((r || {}).voci || []).map(v => v.fonte + ':' + v.valore).join(' ');
for (const [n, atteso] of [[0, 3], [1, -3], [2, -9]]) {
    const r = M.modAttacco(alguacil, ingaggiato, combiD, M.AZIONI.BS_ATTACK,
        { rangeIndex: 0, alleatiInMischia: n });
    ok(r.mod === atteso, `alleatiInMischia ${n} -> MOD ${atteso} (${r.mod}) [${fonti(r)}]`);
}
ok(!/mischia/.test(fonti(M.modAttacco(alguacil, ingaggiato, combiD, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 0 }))),
   'con zero alleati NESSUNA voce mischia: "zero" non è "non risposto"');

console.log('\n--- la Sagoma Diretta: zero vale, uno annulla ---');
const lf = M.profiloArma('Light Flamethrower');
ok(M.modAttacco(alguacil, ingaggiato, lf, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 0 }).colpoAnnullato === undefined,
   'Sagoma con zero alleati: il colpo è valido');
ok(M.modAttacco(alguacil, ingaggiato, lf, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 1 }).colpoAnnullato === true,
   'con un alleato: colpoAnnullato');
ok(M.modAttacco(alguacil, ingaggiato, lf, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 2 }).colpoAnnullato === true,
   'e con due pure');
// CONTROPROVA: bersaglio libero, la Sagoma non si annulla mai.
ok(M.modAttacco(alguacil, libero, lf, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 2 }).colpoAnnullato === undefined,
   'CONTROPROVA: bersaglio NON Ingaggiato, la Sagoma non si annulla nemmeno con due alleati dichiarati');

console.log('\n--- e le note della mischia arrivano allo SCONTRO (punto F) ---');
// Non bastano le note dell attivo: il tabellone legge anche scontro.note, e
// una nota che resta dentro l attivo non si vede senza aprire i dettagli.
// 🔴 CHI LE COPIA E` risolviPayload, NON risolviScontro. Chiamando
// risolviScontro direttamente le note di mischia NON arrivano, e la prova
// diventa rossa per il livello sbagliato invece che per il comportamento.
// Visto il 7 ottobre: tre prove rosse e il motore che faceva il suo lavoro.
const trovaBS = (n, id) => [alguacil, ingaggiato, libero].find(u =>
    (id && String(u.id) === String(id)) ||
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;
const scontroDiMischia = (arma, n, idBersaglio) => (M.risolviPayload({ attacchi: [{
        attaccante: 'Alguacil', attaccanteId: 'n1', azione: M.AZIONI.BS_ATTACK, arma: arma,
        bersagli: [{ id: idBersaglio || 'p5', name: 'bersaglio', burst: 3, rangeIndex: 0,
                     alleatiInMischia: n }] }] }, [], { trovaUnita: trovaBS }) || [])[0] || {};
const noteDello = (s) => ((s.note || []).join(' | ')).normalize('NFC');
ok(/^Mischia:/.test(noteDello(scontroDiMischia(combiD, 2))) ||
   /Mischia:/.test(noteDello(scontroDiMischia(combiD, 2))),
   `le note che cominciano per "Mischia:" arrivano in scontro.note (${noteDello(scontroDiMischia(combiD, 2)).slice(0, 55)}…)`);
ok(/SAGOMA SU UNA MISCHIA/.test(noteDello(scontroDiMischia(lf, 1))),
   'e così "SAGOMA SU UNA MISCHIA"');
ok(/Bersaglio Ingaggiato/.test(noteDello(scontroDiMischia(combiD, 0))),
   'e "Bersaglio Ingaggiato", quella del caso con zero alleati');
// CONTROPROVA: bersaglio libero, nessuna di quelle note sullo scontro.
// Senza, "le note arrivano" non si distingue da "arriva tutto sempre".
ok(noteDello(scontroDiMischia(combiD, 2, 'p1')) === '',
   `CONTROPROVA: bersaglio libero, nessuna nota di mischia sullo scontro (${JSON.stringify(noteDello(scontroDiMischia(combiD, 2, 'p1')))})`);


console.log('\n=== E. Le armi scritte fra gli equipaggiamenti (modulo 2026-10-10.2) ===');
// Segnalato da TEST il 10 ottobre, corretto da MOTORE lo stesso giorno: il
// modulo costruiva l'elenco dal solo campo `weapon`, e le pistole stanno in
// `equip`. 629 profili su 765 avevano un'arma a distanza offerta in ARO e non
// nell'Attacco BS attivo. Ora legge i due campi, come M.armiARO.
// E dal 10 ottobre (REGOLE) MediKit, GizmoKit e Deactivator non sono MAI armi
// dell'Attacco BS, ovunque stiano: si usano con la loro azione.
// Profili VERI del database, e insiemi NOMINATI nei due versi: un conteggio
// "3 bottoni" resterebbe verde se un'arma ne sostituisse un'altra.
let caricatiE = true;
try { require('./database_nomad.js'); require('./database_panoceania.js'); } catch (e) { caricatiE = false; }
ok(caricatiE && (window.DB_NOMADI || []).length > 300 && (window.DB_PANOCEANIA || []).length > 300,
   `i due database di fazione si caricano (${(window.DB_NOMADI || []).length} / ${(window.DB_PANOCEANIA || []).length})`);
const veroE = (db, nome) => {
    const p = (db || []).find(x => x.nome === nome);
    return p ? Object.assign(JSON.parse(JSON.stringify(p)), { id: 'e1', alias: 'Prova E', states: {}, deployState: 'NORMAL', state: 'ACTIVE' }) : null;
};
const schermataBS = (u) => {
    alertUltimo = null; nodo('weapon-buttons-container').innerHTML = '';
    nuovoOrdine(u); window.avviaFaseAttaccoBS('ATTACCO BS', false);
    return nodo('weapon-buttons-container').innerHTML;
};
const bottoniBS = (h) => (String(h).match(/declareAttackBS\('([^']+)'\)/g) || []).map(x => x.slice(17, -2));
const esclusiBS = (h) => (String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').match(/Non utilizzabili qui:(.*)$/) || ['', ''])[1];
const dueVersi = (visti, attesi) => ({ comparsi: visti.filter(x => attesi.indexOf(x) < 0), spariti: attesi.filter(x => visti.indexOf(x) < 0) });
const salvaRosterE = M._rosterProprio;

const morlock = veroE(window.DB_NOMADI, 'Morlock (Kobra Pistol, DA CC)');
ok(!!morlock && /Kobra Pistol/.test(morlock.equip) && !/Kobra/.test(morlock.weapon),
   `premessa: il Morlock (Kobra Pistol, DA CC) ha la Kobra Pistol in equip e non in weapon (${morlock && morlock.equip})`);
M._rosterProprio = [morlock];
let hE = schermataBS(morlock);
let dE = dueVersi(bottoniBS(hE), ['Chain Rifle', 'Smoke Grenades', 'Kobra Pistol (BS Mode)']);
ok(dE.comparsi.length === 0 && dE.spariti.length === 0,
   'Morlock: Chain Rifle, Smoke Grenades e Kobra Pistol (BS Mode), nei due versi',
   `comparsi: ${JSON.stringify(dE.comparsi)} — spariti: ${JSON.stringify(dE.spariti)}`);
ok(/Kobra Pistol \(CC Mode\) \(arma da Corpo a Corpo\)/.test(esclusiBS(hE)),
   `e la CC Mode della stessa arma e\` fra le escluse, col motivo (${esclusiBS(hE).slice(0, 90)})`);
// Dichiararla: nessun avviso, e l arma dell Ordine e\` la BS Mode con la SUA munizione.
window.declareAttackBS('Kobra Pistol (BS Mode)');
ok(alertUltimo === null && window.currentOrder.weapon === 'Kobra Pistol (BS Mode)',
   `dichiarata senza avvisi, e l Ordine porta quell arma (${JSON.stringify(window.currentOrder.weapon)}, alert ${JSON.stringify(alertUltimo)})`);
ok(M.profiloArma(window.currentOrder.weapon).ammo === 'SHOCK',
   `con la munizione della BS Mode, non quella della CC (${M.profiloArma(window.currentOrder.weapon).ammo})`);

const clock = veroE(window.DB_NOMADI, 'Clockmaker (Engineer)');
M._rosterProprio = [clock];
hE = schermataBS(clock);
dE = dueVersi(bottoniBS(hE), ['Combi Rifle', 'D-Charges (Demolition Mode)', 'Pistol']);
ok(dE.comparsi.length === 0 && dE.spariti.length === 0,
   'Clockmaker: la Pistol (da equip) c e`, il GizmoKit e il Deactivator no — nei due versi',
   `comparsi: ${JSON.stringify(dE.comparsi)} — spariti: ${JSON.stringify(dE.spariti)}`);
ok(/GizmoKit \(si usa solo con la sua azione \(SUPPORTO\)\)/.test(esclusiBS(hE)) && /Deactivator \(si usa solo con la sua azione \(DEACTIVATOR\)\)/.test(esclusiBS(hE)),
   'e GizmoKit e Deactivator sono fra le escluse, ognuno con la sua azione');

const machinist = veroE(window.DB_PANOCEANIA, 'Machinist (Combi Rifle)');
M._rosterProprio = [machinist];
hE = schermataBS(machinist);
ok(/Deployable Cover \(Cutting Foam\) \(si piazza, non si spara\)/.test(esclusiBS(hE)) && /Deployable Cover \(Vitroferro\) \(si piazza, non si spara\)/.test(esclusiBS(hE)),
   'Machinist: le due Deployable Cover escluse, "si piazza, non si spara"');
ok(bottoniBS(hE).every(n => !/Deployable Cover|GizmoKit|Deactivator|MediKit/.test(n)),
   `e nessuna fra i bottoni (${JSON.stringify(bottoniBS(hE))})`);

// CONTROPROVA, su tutti i 765: MediKit, GizmoKit e Deactivator non sono MAI
// un bottone dell Attacco BS. Senza la controprova sopra (la Pistol c e`),
// "mai" non distinguerebbe la regola da un elenco vuoto.
const tuttiE = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
let conPistolaE = 0, dedicateComparse = [];
tuttiE.forEach(p => {
    const u = Object.assign(JSON.parse(JSON.stringify(p)), { id: 'z', alias: 'Z', states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
    M._rosterProprio = [u];
    const b = bottoniBS(schermataBS(u));
    if (b.some(n => /Pistol/.test(n)) && !/Pistol/.test(String(p.weapon || ''))) conPistolaE++;
    if (b.some(n => /^(MediKit|GizmoKit|Deactivator)/.test(n))) dedicateComparse.push(p.nome);
});
ok(dedicateComparse.length === 0,
   `su tutti i ${tuttiE.length} profili, MediKit, GizmoKit e Deactivator non sono mai un bottone dell Attacco BS`,
   `comparsi su: ${JSON.stringify(dedicateComparse.slice(0, 5))} (${dedicateComparse.length})`);
ok(conPistolaE > 300,
   `CONTROPROVA: una pistola scritta SOLO in equip e\` offerta su ${conPistolaE} profili (prima del 10 ottobre: 0)`);
M._rosterProprio = salvaRosterE;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

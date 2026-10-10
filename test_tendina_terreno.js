// @versione 2026-10-09.1 | test_tendina_terreno.js | proprieta`: chat TEST
// La scelta del terreno, ora a CASELLE — CARTELLA=/percorso/ node test_tendina_terreno.js
//
// 🔴 RISCRITTO IL 9 OTTOBRE. Fino alla .2 questo banco provava UNA TENDINA
// a scelta singola, con le voci composte ("Bosco + Fumo"): sette prove
// guardavano `<select>` e `value="..."`. Quella tendina non c'e` piu` —
// richiesta di Paolo, perche` due terreni sulla stessa linea di tiro non si
// potevano dichiarare. Le sette prove erano rosse perche` misuravano una
// cosa che non esiste, non perche` qualcosa fosse rotto.
//
// IL CONTRATTO NUOVO (app.html 2026-10-09.2):
//   window.sceltaTerreno(terreno, zona, comando, argomento)
//     -> UNA RIGA CHIUSA (un <button>, non un <select>) che dice cosa e`
//        scelto; il tocco apre il riquadro delle caselle
//   window.separaTerrenoEZona(valore)
//     -> { terrain: ['TER_10', ...] | 'NESSUNO', zona: 'FUMO'|'ECLIPSE'|null }
//   window.componiTerrenoEZona(terreni, zona) -> la stringa
//   OK manda la selezione INTERA al comando; ANNULLA non manda niente.
//
// LE DUE COSE CHE QUESTO BANCO GUARDA PIU` DA VICINO
//
//  1. ANNULLA NON DEVE MANDARE NIENTE. Le caselle toccate nel riquadro sono
//     una bozza: se ANNULLA mandasse il valore, il giocatore cambierebbe la
//     busta per sbaglio solo aprendo il riquadro e guardandolo. E` la
//     famiglia di difetti del progetto al rovescio: qui il rischio e` che
//     arrivi qualcosa che nessuno ha chiesto.
//
//  2. FUMO ED ECLIPSE MAI FRA I TERRENI. Il campo `zona` ne porta uno solo,
//     e messi in `terrain` conterebbero due volte (verificato da DATABASE).
//     Si provano tutti e tre i modi di sbagliarlo: le due caselle insieme,
//     il valore composto vecchio, e il nome della zona passato come terreno.
//
// Il codice provato e` quello VERO: i blocchi si ritagliano da app.html,
// non si ricopiano qui.
// ============================================================================
const fs = require('fs'), path = require('path');
const DIR = process.env.CARTELLA || (__dirname + '/');
global.window = global;
let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); }
    catch (e) { falliti++; console.log('  ❌ la sezione e` caduta: ' + e.message + ' — ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {}, id: '' }),
    body: { appendChild() {} } };
global.alert = () => {}; global.confirm = () => true; global.scrollTo = () => {};
let risposta = null; global.inviaRispostaAro = (p) => { risposta = p; };

require(path.resolve(DIR, 'catalogo_n5.js'));
require(path.resolve(DIR, 'database_comune.js'));
const M = require(path.resolve(DIR, 'motore_regole_n5.js'));
require(path.resolve(DIR, 'logica_aro.js'));

const h = fs.readFileSync(path.resolve(DIR, 'app.html'), 'utf8');
function ritaglia(da, a) {
    const i = h.indexOf(da), j = h.indexOf(a, i);
    if (i < 0 || j < 0) throw new Error('ritaglio non trovato: ' + da);
    return h.slice(i, j);
}

const tiratore = { id: 'n1', alias: 'Alguacil', bs: 11, ph: 10, wip: 12, weapon: 'Combi Rifle, Knife', skills: '', states: {} };
global.roster = [tiratore]; M._fazione = 'NOMADI'; M._rosterProprio = global.roster;
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];
function nuovo() {
    window.currentAttackData = { attaccanti: ['Fusilier'], azione: 'ATTACCO BS' };
    window.selectedAroUnits = ['n1']; window.currentAroIndex = 0;
    window.aroReactions = []; window.aroCurrentConfig = {}; window.aroSfMode = false; risposta = null;
    window.avviaCicloAroUnita(); window.selezionaAzioneAro('BS_ATTACK');
    window.selezionaArmaAro('Combi Rifle'); window.selezionaBersaglioAro('Fusilier');
}

// ---------------------------------------------------------------------------
sezione('0. Controprova: senza la scelta condivisa il ripiego si dichiara', () => {
    // Prima di ritagliare app.html, `window.sceltaTerreno` non c e`: il
    // modulo ARO deve dirlo in console invece di disegnare una riga muta.
    // Senza questa prova, le sezioni sotto non distinguono "la scelta
    // funziona" da "il ripiego fa finta che funzioni".
    const errori = []; const veroErr = console.error;
    console.error = (...a) => errori.push(a.join(' '));
    nuovo();
    console.error = veroErr;
    ok(errori.some(e => e.includes('sceltaTerreno manca')),
       `senza la scelta condivisa lo scrive in console (${errori.length} messaggi)`);
    ok(!nodo('aro-modifiers-content').innerHTML.includes('scelta-terreno'),
       'e in quel caso la riga NON c e`: il banco sa dire di no');
});

// Da qui in poi il codice vero.
eval(ritaglia('window.chiamataConValore = (comando', 'window.coperturePresenti'));
eval(ritaglia('window.ZONE_VISIBILITA = [', 'window.separaTerrenoEZona = (valore)'));
eval(ritaglia('window.separaTerrenoEZona = (valore)', 'window.ETICHETTA_TERRENO ='));
eval(ritaglia('window.ETICHETTA_TERRENO =', '// =========================================='));

sezione('1. separaTerrenoEZona: ogni forma che puo` arrivare', () => {
    const s = window.separaTerrenoEZona;
    ok(J(s('NESSUNO')) === J({ terrain: 'NESSUNO', zona: null }),
       `'NESSUNO' -> nessun terreno e nessuna zona (${J(s('NESSUNO'))})`);
    ok(J(s('TER_10')) === J({ terrain: ['TER_10'], zona: null }),
       `un id solo diventa un ELENCO di uno (${J(s('TER_10'))})`);
    ok(J(s('TER_10,TER_15')) === J({ terrain: ['TER_10', 'TER_15'], zona: null }),
       `due terreni sulla stessa linea: l elenco li porta entrambi (${J(s('TER_10,TER_15'))})`);
    ok(J(s('TER_10,TER_15+FUMO')) === J({ terrain: ['TER_10', 'TER_15'], zona: 'FUMO' }),
       `due terreni e una zona si separano nei due campi (${J(s('TER_10,TER_15+FUMO'))})`);
    // BACK-COMPAT: il valore composto vecchio, che le schede salvate e i
    // banchi di prima portano ancora.
    ok(J(s('TER_10+FUMO')) === J({ terrain: ['TER_10'], zona: 'FUMO' }),
       `il valore VECCHIO 'TER_10+FUMO' si legge ancora (${J(s('TER_10+FUMO'))})`);
    ok(J(s('NESSUNO+ECLIPSE')) === J({ terrain: 'NESSUNO', zona: 'ECLIPSE' }),
       `e 'NESSUNO+ECLIPSE' anche: una zona senza terreni (${J(s('NESSUNO+ECLIPSE'))})`);
    // Un elenco gia` separato (chi passa il campo `terrain` della busta).
    ok(J(s(['TER_10', 'TER_15'])) === J({ terrain: ['TER_10', 'TER_15'], zona: null }),
       `accetta anche un array, non solo una stringa (${J(s(['TER_10', 'TER_15']))})`);
    // I doppioni non si contano due volte: sarebbero due volte il MOD.
    ok(J(s('TER_10,TER_10')) === J({ terrain: ['TER_10'], zona: null }),
       `lo stesso terreno due volte conta una volta (${J(s('TER_10,TER_10'))})`);
    // Vuoto, e niente: 'NESSUNO', non una stringa vuota ne` un errore.
    ok(J(s('')) === J({ terrain: 'NESSUNO', zona: null }) &&
       J(s(null)) === J({ terrain: 'NESSUNO', zona: null }) &&
       J(s(undefined)) === J({ terrain: 'NESSUNO', zona: null }),
       'vuoto, null e undefined danno NESSUNO e null, senza cadere');
    // 🔴 FUMO ED ECLIPSE MAI FRA I TERRENI, in tutti i modi di sbagliarlo.
    ok(J(s('TER_10+FUMO+ECLIPSE')) === J({ terrain: ['TER_10'], zona: 'ECLIPSE' }),
       `Fumo ED Eclipse insieme: vale l Eclipse, e il Fumo non resta da nessuna parte (${J(s('TER_10+FUMO+ECLIPSE'))})`);
    ok(J(s('FUMO')) === J({ terrain: 'NESSUNO', zona: null }),
       `e il nome di una zona passato come TERRENO non finisce fra i terreni (${J(s('FUMO'))})`);
    const conZone = s('TER_10,FUMO,ECLIPSE,TER_15');
    ok(J(conZone.terrain) === J(['TER_10', 'TER_15']),
       `nemmeno mescolato nell elenco dei terreni (${J(conZone)})`);
});

sezione('2. componiTerrenoEZona: il giro completo, e torna indietro uguale', () => {
    const c = window.componiTerrenoEZona, s = window.separaTerrenoEZona;
    ok(c(['TER_10', 'TER_15'], 'FUMO') === 'TER_10,TER_15+FUMO',
       `due terreni e una zona (${c(['TER_10', 'TER_15'], 'FUMO')})`);
    ok(c([], null) === 'NESSUNO', `niente -> 'NESSUNO' (${c([], null)})`);
    ok(c('NESSUNO', 'ECLIPSE') === 'NESSUNO+ECLIPSE', `solo la zona (${c('NESSUNO', 'ECLIPSE')})`);
    ok(c(['TER_10'], 'PIOGGIA') === 'TER_10',
       `una zona che non esiste si butta, non si scrive (${c(['TER_10'], 'PIOGGIA')})`);
    // Il giro: componi -> separa deve dare quello di partenza. E` la prova
    // che le due funzioni parlano la stessa lingua; da sole potrebbero
    // essere giuste ciascuna e non capirsi.
    [[['TER_10', 'TER_15'], 'FUMO'], [['TER_10'], null], [[], 'ECLIPSE'], [[], null]].forEach(([t, z]) => {
        const giro = s(c(t, z));
        const atteso = { terrain: t.length ? t : 'NESSUNO', zona: z };
        ok(J(giro) === J(atteso), `giro completo ${J([t, z])} -> ${c(t, z)} -> ${J(giro)}`);
    });
});

sezione('3. La riga chiusa: un tasto, non una tendina', () => {
    window.activeTerrains = [];
    const riga = window.sceltaTerreno('NESSUNO', null, 'window.setX', 0);
    ok((riga.match(/<select/g) || []).length === 0,
       `non c e` + ` nessun <select>: la tendina non esiste piu` + ` (${(riga.match(/<select/g) || []).length})`);
    ok((riga.match(/<button/g) || []).length === 1 && /class="huge-btn scelta-terreno"/.test(riga),
       'c e` UN tasto solo, con la classe scelta-terreno');
    ok(/min-height:55px/.test(riga),
       'alto come la riga delle munizioni (55px), per stare a meta` riga nella scheda del bersaglio');
    ok(/Terreno: nessuno/.test(riga),
       `e dice cosa e` + ` scelto: niente (${(/Terreno: [^<]*/.exec(riga) || [''])[0]})`);
    ok(/data-valore="NESSUNO"/.test(riga), 'col valore attuale leggibile in data-valore');
    // Con qualcosa scelto, la riga lo nomina: altrimenti il giocatore deve
    // aprire il riquadro per sapere cosa ha dichiarato.
    window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10'), window.DB_TERRENI.find(t => t.id === 'TER_15')];
    const piena = window.sceltaTerreno('TER_10,TER_15+FUMO', null, 'window.setX', 0);
    const scritta = (/Terreno: [^<]*/.exec(piena) || [''])[0];
    ok(/Bosco/.test(scritta) && /Fumo/i.test(scritta),
       `con due terreni e il Fumo la riga li nomina tutti (${scritta})`);
    ok(/data-valore="TER_10,TER_15\+FUMO"/.test(piena),
       'e data-valore porta la selezione intera');
    // CONTROPROVA: i nomi vengono dal tavolo, non inventati dall id.
    ok(window.nomeTerreno('TER_10') !== 'TER_10' && window.nomeTerreno('TER_99') === 'TER_99',
       `il nome si legge dal tavolo, e un id sconosciuto resta l id (${window.nomeTerreno('TER_10')} / ${window.nomeTerreno('TER_99')})`);
});

sezione('4. Il riquadro: le caselle, e Fumo/Eclipse che si escludono', () => {
    window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10'), window.DB_TERRENI.find(t => t.id === 'TER_15')];
    let ricevuto = null; window.setX = (a, v) => { ricevuto = { a: a, v: v }; };
    window.apriSceltaTerreno('window.setX', 0, 'NESSUNO');
    const p = window.pannelloTerreno();
    const caselle = (p.innerHTML.match(/class="voce-terreno"/g) || []).length;
    ok(caselle === 4, `due terreni sul tavolo piu` + ` Fumo ed Eclipse: quattro caselle (${caselle})`);
    ok(/id="ok-scelta-terreno"/.test(p.innerHTML) && /ANNULLA/.test(p.innerHTML),
       'col tasto OK e il tasto ANNULLA');
    // Un terreno si aggiunge e si toglie.
    window.toccaVoceTerreno('TER_10');
    ok(J(window._bozzaTerreno.terreni) === J(['TER_10']), 'un tocco aggiunge il terreno');
    window.toccaVoceTerreno('TER_10');
    ok(J(window._bozzaTerreno.terreni) === J([]), 'un altro tocco lo toglie');
    window.toccaVoceTerreno('TER_10'); window.toccaVoceTerreno('TER_15');
    ok(J(window._bozzaTerreno.terreni) === J(['TER_10', 'TER_15']),
       `e due terreni stanno insieme: e` + ` il motivo per cui la tendina e` + ` stata cambiata (${J(window._bozzaTerreno.terreni)})`);
    // 🔴 FUMO ED ECLIPSE SI ESCLUDONO: il campo `zona` ne porta uno solo.
    window.toccaVoceTerreno('FUMO');
    ok(window._bozzaTerreno.zona === 'FUMO', 'il Fumo si accende');
    window.toccaVoceTerreno('ECLIPSE');
    ok(window._bozzaTerreno.zona === 'ECLIPSE',
       `l Eclipse SPEGNE il Fumo: una casella spuntata che non conta sarebbe una bugia a schermo (${window._bozzaTerreno.zona})`);
    window.toccaVoceTerreno('ECLIPSE');
    ok(window._bozzaTerreno.zona === null, 'e un altro tocco la spegne del tutto');
    // La casella accesa si vede: aria-pressed, non solo il colore.
    window.toccaVoceTerreno('FUMO');
    const acceso = (window.pannelloTerreno().innerHTML.match(/data-voce="FUMO" aria-pressed="(\w+)"/) || [])[1];
    ok(acceso === 'true', `e lo stato si legge in aria-pressed, non solo nel colore (${acceso})`);
    window.chiudiSceltaTerreno();
});

sezione('5. OK manda tutto; ANNULLA non manda niente', () => {
    window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10'), window.DB_TERRENI.find(t => t.id === 'TER_15')];
    let ricevuto = null; window.setX = (a, v) => { ricevuto = { a: a, v: v }; };
    window.apriSceltaTerreno('window.setX', 7, 'NESSUNO');
    window.toccaVoceTerreno('TER_10'); window.toccaVoceTerreno('TER_15'); window.toccaVoceTerreno('ECLIPSE');
    ok(ricevuto === null,
       `toccando le caselle il comando NON riceve niente: e` + ` una bozza (${J(ricevuto)})`);
    window.confermaSceltaTerreno();
    ok(ricevuto && ricevuto.v === 'TER_10,TER_15+ECLIPSE',
       `con OK riceve la selezione INTERA, in una stringa sola (${J(ricevuto)})`);
    ok(ricevuto && ricevuto.a === 7,
       `e l argomento di chi ha aperto la scelta (${ricevuto && ricevuto.a})`);
    ok(window._bozzaTerreno === null, 'e la bozza si chiude');
    // 🔴 ANNULLA NON MANDA NIENTE. Senza questa prova, aprire il riquadro e
    // guardarlo cambierebbe la busta.
    ricevuto = null;
    window.apriSceltaTerreno('window.setX', 7, 'NESSUNO');
    window.toccaVoceTerreno('TER_10');
    window.chiudiSceltaTerreno();
    ok(ricevuto === null,
       `ANNULLA non manda niente, nemmeno quello che era gia` + ` scelto (${J(ricevuto)})`);
    ok(window._bozzaTerreno === null, 'e chiude la bozza');
    // Un comando che non esiste: lo dice in console e non cade.
    const errori = []; const veroErr = console.error;
    console.error = (...a) => errori.push(a.join(' '));
    window.apriSceltaTerreno('window.comandoInventato', 0, 'TER_10');
    window.confermaSceltaTerreno();
    console.error = veroErr;
    ok(errori.some(e => /comandoInventato/.test(e)),
       `un comando che non esiste lo dice in console invece di cadere (${errori.length} messaggi)`);
    // Un terreno scelto che non e` piu` sul tavolo resta e si puo` togliere.
    window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10')];
    window.apriSceltaTerreno('window.setX', 0, 'TER_10,TER_15');
    ok(/non pi/.test(window.pannelloTerreno().innerHTML),
       'un terreno non piu` sul tavolo resta nel riquadro, marcato, per poterlo togliere');
    ok(J(window._bozzaTerreno.terreni) === J(['TER_10', 'TER_15']),
       `e nella bozza c e` + ` ancora: conta nel calcolo finche` + ` non lo togli (${J(window._bozzaTerreno.terreni)})`);
    window.chiudiSceltaTerreno();
});

sezione('6. Dalla porta del giocatore: la scelta arriva nei due campi della busta', () => {
    window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10'), window.DB_TERRENI.find(t => t.id === 'TER_15')];
    nuovo();
    ok(nodo('aro-modifiers-content').innerHTML.includes('scelta-terreno'),
       'la schermata ARO disegna la riga della scelta');
    window.setAroTerreno('TER_10,TER_15+FUMO');
    ok(J(window.aroCurrentConfig.terrain) === J(['TER_10', 'TER_15']) && window.aroCurrentConfig.zona === 'FUMO',
       `due terreni e il Fumo finiscono in terrain (ELENCO) e zona (${J(window.aroCurrentConfig.terrain)} / ${window.aroCurrentConfig.zona})`);
    window.setAroTerreno('TER_10');
    ok(J(window.aroCurrentConfig.terrain) === J(['TER_10']) && window.aroCurrentConfig.zona === null,
       `solo terreno -> zona null, non stringa vuota (${window.aroCurrentConfig.zona === null ? 'null' : J(window.aroCurrentConfig.zona)})`);
    window.setAroTerreno('NESSUNO+ECLIPSE');
    ok(window.aroCurrentConfig.terrain === 'NESSUNO' && window.aroCurrentConfig.zona === 'ECLIPSE',
       `'NESSUNO+ECLIPSE' -> terrain NESSUNO, zona ECLIPSE (${J(window.aroCurrentConfig.terrain)} / ${window.aroCurrentConfig.zona})`);
    window.setAroTerreno('NESSUNO');
    ok(window.aroCurrentConfig.terrain === 'NESSUNO' && window.aroCurrentConfig.zona === null,
       'nessuno -> NESSUNO e null');
    // E la reazione confermata porta tutti e due i campi fino alla busta.
    window.setAroTerreno('TER_10,TER_15+ECLIPSE');
    global.inviaAro = global.inviaAro || function () {};
    const inviaVero = window.inviaAro; window.inviaAro = function () {};
    window.salvaAroCorrente();
    window.inviaAro = inviaVero;
    const r = window.aroReactions[window.aroReactions.length - 1] || {};
    ok(J(r.terrain) === J(['TER_10', 'TER_15']) && r.zona === 'ECLIPSE',
       'e la reazione confermata li porta tutti e due', J({ terrain: r.terrain, zona: r.zona }));
    // CONTROPROVA: la zona non si infila fra i terreni nemmeno qui.
    ok(!String(J(r.terrain)).includes('ECLIPSE') && !String(J(r.terrain)).includes('FUMO'),
       `e nel campo terrain non c e` + ` traccia della zona (${J(r.terrain)})`);
});

console.log('\n──────────────');
console.log(`${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

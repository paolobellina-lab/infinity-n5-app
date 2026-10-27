// @versione 2026-10-26.1 | test_minelayer.js | proprieta`: chat TEST
// 2026-10-26.1: sezione 7 — il roster del piano (rev 42) ha 46 righe Nomadi; DEP-01
//    nomina tredici truppe (nuovo il Gator Pilot #45, D-Charges).
// 2026-10-20.1: sezione 7 — il roster del piano (rev 34) ha 41 righe Nomadi; DEP-01
//    nomina dodici truppe (nuovo lo Switcher #40, Madtraps).
// 2026-10-19.1: sezione 7 — DEP-01 del piano (rev 33) nomina chi del roster piazza, e cosa.
//    I portatori di D-Charges sono 152 (database 2026-10-19: tolto evader_multi,
//    doppione di evader_engineer).
// 2026-10-15.1: nomi aggiornati (2).
//    Nomi dal database 2026-10-15.1 (DATABASE): Moran "Camouflage [1 Use]" col nome dell arma,
//    Helot "Camouflage [1 Use]", Triggermen "[+1SD]". Solo il campo nome e` cambiato.
// 2026-10-12.2: i portatori di D-Charges sono 153 (database .12.3: cancellato
//    l Evader MULTI TinBot).
// 2026-10-12.1: sezione 6 — cosa si piazza (motore 2026-10-12.2): D-Charges si`
//    per tutti i 154 portatori, mai col Minelayer e mai in ARO; Chest Mine e
//    Mine Dispenser no, col motivo; controprova sul motivo.
// ================================================================
// Minelayer: piazzare un Deployable in fase di schieramento.
// Fonte: REGOLE_N5_v5_1_1.txt, voce MINELAYER (p.100) — due requisiti:
//   nessun nemico ne` Marker Mimetico nell'Area d'Innesco (o nella ZdC per
//   le Perimeter), e il punto dentro l'area in cui il Minelayer puo`
//   schierarsi. L'app non ha la mappa: i requisiti li conferma il giocatore.
// Motore 2026-09-22.1: M.opzioniMinelayer, M.piazzaConMinelayer,
// M.minelayerTiroFallito, window.faseSchieramento.minelayer.
// I profili si leggono dal database.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m, d) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m + (d ? '\n     ' + d : '')); } };
const J = JSON.stringify;

global.window = global;
global.document = { title: 'NOMADS', getElementById: () => ({ style: {}, innerHTML: '' }), querySelectorAll: () => [], addEventListener(){} };
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
try { require('./fase_schieramento.js'); } catch (e) { /* verificato sotto */ }

const TUTTI = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const profilo = (n) => { const u = TUTTI.find(x => x.nome === n); if (!u) throw new Error('assente: ' + n);
                         return Object.assign(JSON.parse(J(u)), { states: {} }); };
const SI = { nemiciNellArea: false, dentroZona: true };

console.log('\n=== 0. I profili hanno quello che il test presuppone ===');
const spektr = profilo('Spektr (Minelayer)'), firefly = profilo('Firefly (Minelayer)');
ok(/\bMinelayer\b/.test(spektr.skills) && /\bMinelayer\b/.test(firefly.skills), 'Spektr e Firefly: Minelayer nel database');
const fus = profilo('Fusilier (Combi Rifle)');
ok(!/Minelayer/.test(fus.skills || ''), 'controprova: il Fusilier non ha Minelayer');

console.log('\n=== 1. opzioniMinelayer ===');
const oS = M.opzioniMinelayer(spektr), oF = M.opzioniMinelayer(firefly);
const nomi = (o) => o.armi.map(a => a.nome).sort();
ok(J(nomi(oS)) === J(['E/M Mine', 'Shock Mine']), `Spektr: E/M Mine e Shock Mine (${J(nomi(oS))})`);
ok(J(nomi(oF)) === J(['AP Mine', 'Armed Turret']), `Firefly: AP Mine e Armed Turret (${J(nomi(oF))})`);
// La torretta e` un'arma "contenitore": per alias "Armed Turret (X)" diventa X,
// che non e` Deployable. Va riconosciuta dal nome prima dell'alias.
ok(oF.armi.some(a => a.nome === 'Armed Turret'), 'la torretta del Firefly e` riconosciuta, non persa dietro l alias');
ok(oS.pezzi === 1 && oS.restanti === 1, 'un pezzo, uno da piazzare');
ok(oS.domande.length === 2 && oS.requisiti.length === 2, 'con le due domande e i due requisiti');
ok(M.opzioniMinelayer(fus).ha === false, 'controprova: senza Minelayer, nessuna opzione');

console.log('\n=== 2. piazzaConMinelayer: i requisiti si confermano, o non si piazza ===');
const codici = (r) => (r.errori || []).map(e => e.codice).sort();
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', {}))) === J(['E54', 'E55']), 'senza conferme: E54 ed E55');
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', { dentroZona: true }))) === J(['E54']),
   'nemici nell area non negati: solo E54');
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', { nemiciNellArea: false }))) === J(['E55']),
   'fuori zona non negato: solo E55');
ok(M.piazzaConMinelayer(spektr, 'E/M Mine', { nemiciNellArea: true, dentroZona: true }).token === null,
   'un nemico nell area (risposta vera): niente token');

const r = M.piazzaConMinelayer(spektr, 'E/M Mine', SI);
ok(r.token && r.errori.length === 0, `requisiti confermati: token ${r.token && r.token.nome}`);
ok(r.token && r.token.schieratoDaMinelayer === true, 'marcato come schierato dal Minelayer');
ok(r.portatoreAggiornato.minelayerUsati === 1, 'il pezzo e` speso sul portatore aggiornato');
ok(!spektr.minelayerUsati, 'e il portatore passato non e` toccato');
ok(J(codici(M.piazzaConMinelayer(r.portatoreAggiornato, 'Shock Mine', SI))) === J(['E51']),
   'secondo pezzo oltre il limite: E51');

ok(codici(M.piazzaConMinelayer(spektr, 'Combi Rifle', SI)).includes('E52'), 'arma non Deployable: E52');
ok(codici(M.piazzaConMinelayer(fus, 'AP Mine', SI)).includes('E50'), 'truppa senza Minelayer: E50');

console.log('\n=== 3. Cosa vede l avversario ===');
const mina = r.token;
const torretta = M.piazzaConMinelayer(firefly, 'Armed Turret', SI).token;
const pub = (t) => M.rosterPubblico([t])[0] || {};
ok(mina && mina.isCamo === true && M.nomeUnita(pub(mina)) === 'SEGNALINO MIMETICO' && pub(mina).tipo === 'MARKER',
   'la mina arriva come segnalino mimetico');
ok(torretta && torretta.isCamo === false && pub(torretta).tipo !== 'MARKER' && /Armed Turret/.test(M.nomeUnita(pub(torretta))),
   `la torretta arriva a vista (${M.nomeUnita(pub(torretta))})`);

console.log('\n=== 4. Tiro di Schieramento Superiore fallito ===');
const f = M.minelayerTiroFallito(spektr, 'E/M Mine');
ok(f.portatoreAggiornato.usiSpesi && f.portatoreAggiornato.usiSpesi['E/M Mine'] === 1, 'Disposable: un uso scalato');
ok(/perde E\/M Mine/.test(f.nota) && /uso scalato/.test(f.nota), 'e la nota lo dice');
ok(!spektr.usiSpesi, 'il portatore passato non e` toccato');

console.log('\n=== 5. La fase di schieramento li espone ===');
const FS = (window.faseSchieramento || {}).minelayer || {};
ok(['opzioni', 'piazza', 'tiroFallito'].every(k => typeof FS[k] === 'function'),
   `faseSchieramento.minelayer: opzioni, piazza, tiroFallito (${J(Object.keys(FS))})`);
// Il contratto della fase: lavora per id sul window.roster, e sostituisce
// la truppa col portatore aggiornato E aggiunge il token al roster — che
// preparaPayloadHub pubblica: cosi` la mina arriva all'avversario col resto
// dello schieramento, senza un canale nuovo.
window.roster = [Object.assign({}, spektr, { id: 'sp1' }), Object.assign({}, firefly, { id: 'ff1' })];
ok(J(FS.opzioni('sp1')) === J(M.opzioniMinelayer(window.roster[0])), 'opzioni(id): delega al motore, stesso risultato');
ok(FS.opzioni('nessuno') === null, 'id inesistente: null, non un errore');
const lungPrima = window.roster.length;
const fp = FS.piazza('sp1', 'E/M Mine', SI);
ok(fp && fp.token && window.roster.length === lungPrima + 1 && window.roster[lungPrima] === fp.token,
   'piazza(id): il token entra nel roster, in coda');
ok(window.roster[0].minelayerUsati === 1, 'e la truppa nel roster e` il portatore aggiornato');
const lungDopo = window.roster.length;
ok(FS.piazza('sp1', 'Shock Mine', SI).token === null && window.roster.length === lungDopo,
   'secondo pezzo rifiutato: il roster non cambia');
FS.tiroFallito('ff1', 'AP Mine');
ok(window.roster[1].usiSpesi && window.roster[1].usiSpesi['AP Mine'] === 1, 'tiroFallito(id): l uso scalato sta nel roster');


console.log('\n=== 6. Cosa si piazza: D-Charges si`, Chest Mine e Mine Dispenser no (motore 2026-10-12.2) ===');
const mancantiP = ['armiPiazzabili', 'motivoNonPiazzabile'].filter(f => typeof M[f] !== 'function');
ok(mancantiP.length === 0, 'il motore espone armiPiazzabili e motivoNonPiazzabile', `mancano: ${JSON.stringify(mancantiP)} — il banco prosegue e le prove sotto falliscono, senza schiantarsi`);
// REGOLE, 12 ottobre: le D-Charges (Demolition Mode) SI piazzano (riga 6044)
// anche senza il Tratto Deployable. Il filtro delle modalita` guardava solo il
// Tratto: era una regressione, e l hanno trovata le due prove di questo banco
// su Spektr e Firefly. Mai in ARO (riga 6045), mai col Minelayer: non lasciano
// niente sul tavolo da schierare prima della partita. Chest Mine (righe
// 6246-6247) e Mine Dispenser non si piazzano, e ora lo DICONO, col motivo.
const pronto = (n) => Object.assign(profilo(n), { deployState: 'NORMAL', state: 'ACTIVE' });
const nomiArmi = (r) => ((r && r.armi) || []).map(a => a.nome);
const dueVersiP = (visti, attesi) => ({ comparsi: visti.filter(x => attesi.indexOf(x) < 0), spariti: attesi.filter(x => visti.indexOf(x) < 0) });
const PIAZZABILI = { 'Spektr (Minelayer)': ['D-Charges (Demolition Mode)', 'E/M Mine', 'Shock Mine'],
                     'Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle)': ['D-Charges (Demolition Mode)', 'CrazyKoalas'],
                     'Puppet Masters (Minelayer)': ['Shock Mine'] };
Object.keys(PIAZZABILI).forEach(function (n) {
    const d = dueVersiP(nomiArmi((typeof M.armiPiazzabili === 'function' ? M.armiPiazzabili : () => undefined)(pronto(n))), PIAZZABILI[n]);
    ok(d.comparsi.length === 0 && d.spariti.length === 0, `${n}: si piazzano ${JSON.stringify(PIAZZABILI[n])}, nei due versi`,
       `comparsi: ${JSON.stringify(d.comparsi)} — spariti: ${JSON.stringify(d.spariti)}`);
});
// Tutti i portatori, non tre: le D-Charges si piazzano per ognuno.
const conDC = TUTTI.filter(u => /D-Charges/i.test((u.weapon || '') + ',' + (u.equip || '')));
const senzaDC = conDC.filter(u => nomiArmi((typeof M.armiPiazzabili === 'function' ? M.armiPiazzabili : () => undefined)(Object.assign(JSON.parse(J(u)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE' }))).indexOf('D-Charges (Demolition Mode)') < 0).map(u => u.nome);
// 154 -> 153 col database .12.3: l Evader (MULTI Rifle, TinBot) e` stato cancellato.
// 153 -> 152 col database 2026-10-19: tolto evader_multi (= evader_engineer), che portava le D-Charges.
ok(conDC.length === 152 && senzaDC.length === 0,
   `i ${conDC.length} portatori di D-Charges le possono piazzare tutti (senza: ${senzaDC.length})`,
   `senza: ${JSON.stringify(senzaDC.slice(0, 5))} — se 152 cambia, e\` cambiato il database: rimisura`);
// Il Minelayer NON le offre: quello che schiera prima della partita e` un
// Deployable che resta sul tavolo, e le D-Charges no.
['Spektr (Minelayer)', 'Firefly (Minelayer)', 'Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle)'].forEach(function (n) {
    const o = M.opzioniMinelayer(pronto(n));
    ok(o.ha === true && o.armi.length > 0 && o.armi.every(a => !/D-Charges/.test(a.nome)),
       `${n}: il Minelayer offre ${JSON.stringify(o.armi.map(a => a.nome))}, e mai le D-Charges`);
});
// E in ARO no, col motivo.
const aroSpektr = M.armiARO(pronto('Spektr (Minelayer)'));
ok(nomiArmi(aroSpektr).indexOf('D-Charges (Demolition Mode)') < 0 &&
   (aroSpektr.escluse || []).some(e => e.nome === 'D-Charges (Demolition Mode)' && /ARO/.test(e.motivo)),
   'in ARO le D-Charges (Demolition Mode) sono fra le escluse, "Non utilizzabile in ARO"');
// Chest Mine e Mine Dispenser: nessuna arma da piazzare, e il motivo scritto.
const kr = (typeof M.armiPiazzabili === 'function' ? M.armiPiazzabili : () => undefined)(pronto('Krakot Renegade (Boarding Shotgun)'));
ok(nomiArmi(kr).length === 0 && (kr.escluse || []).some(e => e.nome === 'Chest Mine' && /6246-6247/.test(e.motivo)),
   `Krakot Renegade: niente da piazzare, e il Chest Mine e\` escluso col motivo (${JSON.stringify((kr.escluse || []).map(e => e.motivo))})`);
const bb = (typeof M.armiPiazzabili === 'function' ? M.armiPiazzabili : () => undefined)(pronto('Bambabot-1 (Chain Rifle (ps=6))'));
ok(nomiArmi(bb).length === 0 && (bb.escluse || []).some(e => /Mine Dispenser/.test(e.nome) && /Speculativo/.test(e.motivo)),
   `Bambabot-1: niente da piazzare, e il Mine Dispenser e\` escluso col motivo (${JSON.stringify((bb.escluse || []).map(e => e.motivo))})`);
// CONTROPROVA: il motivo non c e` per chi si piazza davvero. Senza questa,
// "escluso col motivo" non distingue la regola da un motivo messo a tutti.
ok((typeof M.motivoNonPiazzabile === 'function' ? M.motivoNonPiazzabile : () => undefined)('Shock Mine') === null && (typeof M.motivoNonPiazzabile === 'function' ? M.motivoNonPiazzabile : () => undefined)('D-Charges (Demolition Mode)') === null,
   'CONTROPROVA: Shock Mine e D-Charges non hanno un motivo di esclusione');

console.log('\n=== 7. DEP-01 del piano dice chi del roster piazza, e cosa (piano rev 33) ===');
// Il piano elencava chi ha PIAZZARE EQUIPAGGIAMENTO a mano, e ne mancavano tre
// (#4 Deployable Repeater, #29 Drop Bears, #35 PARA Mine) prima ancora che il
// #8 diventasse l'Interventor col FastPanda (19 ottobre). Qui l'elenco si
// ricalcola: roster del piano -> M.armiPiazzabili -> il testo di DEP-01.
{
    const fs = require('fs');
    const PIANO = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/') + 'PIANO_COLLAUDO_N5.md';
    if (!fs.existsSync(PIANO)) ok(false, 'PIANO_COLLAUDO_N5.md non trovato accanto al banco');
    else {
        const testo = fs.readFileSync(PIANO, 'utf8');
        let fz = null; const roster = [];
        testo.split('\n').forEach(r => { const t = r.trim();
            if (/^\*\*Nomadi\*\*/.test(t)) { fz = 'N'; return; }
            if (/^\*\*PanOceania\*\*/.test(t) || /^#{1,3}\s/.test(t)) { fz = null; return; }
            const m = t.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|/);
            if (fz && m) roster.push({ n: +m[1], nome: m[2].replace(/\*\*/g, '').replace(/`/g, '') }); });
        ok(roster.length === 46, `premessa: il roster Nomadi del piano ha 46 righe (${roster.length})`);
        const chi = roster.map(r => ({ n: r.n, nome: r.nome, armi: nomiArmi(M.armiPiazzabili(pronto(r.nome))).map(a => a.split(' (')[0]) }))
                          .filter(r => r.armi.length);
        const dep = (testo.match(/\*\*DEP-01 — [\s\S]*?(?=\n\*\*DEP-02 —)/) || [''])[0];
        const atteso = (dep.match(/- \*\*Atteso:\*\*([\s\S]*?)Non compare/) || [])[1] || '';
        const nelPiano = [...atteso.matchAll(/\*\(#(\d+)\)\*/g)].map(m => +m[1]);
        ok(!!atteso, 'premessa: DEP-01 c e, con la frase di chi piazza');
        ok(J(nelPiano.slice().sort((a, b) => a - b)) === J(chi.map(r => r.n)),
           `DEP-01 nomina esattamente chi piazza, nei due versi: ${J(chi.map(r => r.n))}`, `nel piano: ${J(nelPiano)}`);
        const armiMancanti = chi.filter(r => { const pezzo = (atteso.split('*(#' + r.n + ')*')[1] || '').split(';')[0];
            return !r.armi.every(a => pezzo.indexOf(a) >= 0); }).map(r => '#' + r.n + ' ' + r.armi.join('+'));
        ok(armiMancanti.length === 0, 'e per ognuno le sue armi da piazzare', J(armiMancanti));
        const parole = ['zero','una','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','undici','dodici','tredici'];
        ok(new RegExp('\\*\\*' + parole[chi.length] + '\\*\\* truppe').test(atteso), `e dice quante sono: ${parole[chi.length]}`);
        // CONTROPROVA: l'Interventor senza FastPanda non piazza niente: e` il
        // cambio del #8 a portare la voce, non un motore diverso.
        ok(nomiArmi(M.armiPiazzabili(pronto('Interventor (Hacker Plus)'))).length === 0 &&
           J(nomiArmi(M.armiPiazzabili(pronto('Interventor (Hacker Plus, FastPanda)')))) === J(['FastPanda']),
           'CONTROPROVA: Interventor (Hacker Plus) non piazza niente, quello col FastPanda il FastPanda');
    }
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

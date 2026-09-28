// @versione 2026-09-27.1 | test_fonte_ufficiale.js | proprieta`: chat TEST
// ================================================================
// Il primo controllo che confronta i DATI con una fonte ESTERNA.
// Fino a oggi tutta la rete verificava i dati contro se stessi: un valore
// sbagliato in modo coerente passava ovunque. Dal 27 settembre 356 profili
// sono generati dal JSON ufficiale di Corvus Belli, e i due file sono nel
// progetto: 101.json (PanOceania) e 501.json (Nomadi).
//
// LA REGOLA DI CORRISPONDENZA È DICHIARATA, non dedotta: il nome del profilo
// nel database, tolto quello che sta fra parentesi, confrontato in maiuscolo
// e al singolare con il nome del profilo, dell'unità (ISC) o dell'opzione nel
// JSON. Copre la grande maggioranza; il resto si misura e si dice, invece di
// forzare accoppiamenti che potrebbero essere sbagliati.
// Un profilo accoppiato per errore direbbe una bugia con l'aria della fonte.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify, fs = require('fs');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

global.window = global;
require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');

const norm = (s) => String(s).toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/S$/, '');
function indice(file) {
    const j = JSON.parse(fs.readFileSync(DIR + file, 'utf8'));
    const idx = {};
    (j.units || []).forEach(u => (u.profileGroups || []).forEach(g => {
        (g.profiles || []).forEach(p => {
            const attr = { cc: p.cc, bs: p.bs, ph: p.ph, wip: p.wip, arm: p.arm, bts: p.bts, w: p.w, str: p.str, s: p.s };
            [p.name, u.isc, String(u.isc || '').split(',')[0]].forEach(n => { if (n && !idx[norm(n)]) idx[norm(n)] = attr; });
            (g.options || []).forEach(o => { if (o.name && !idx[norm(o.name)]) idx[norm(o.name)] = attr; });
        });
    }));
    return idx;
}

console.log('\n=== 1. La fonte è leggibile e non è vuota ===');
const idx = { NOMADI: indice('501.json'), PANOCEANIA: indice('101.json') };
ok(Object.keys(idx.NOMADI).length > 100 && Object.keys(idx.PANOCEANIA).length > 100,
   `nomi indicizzati: Nomadi ${Object.keys(idx.NOMADI).length}, PanOceania ${Object.keys(idx.PANOCEANIA).length}`);

console.log('\n=== 2. Gli attributi combaciano con la fonte ===');
// Solo gli attributi che il JSON dichiara per profilo. Le armi no: nel JSON
// sono id da decodificare, ed è la lacuna che DATABASE ha già segnalato (?219).
const ATTRIBUTI = ['cc', 'bs', 'ph', 'wip', 'arm', 'bts', 's'];
const confronta = (db, fazione) => {
    const fuori = [], senzaCorrispondenza = [];
    db.forEach(u => {
        const base = norm(String(u.nome).split(' (')[0]);
        const rif = idx[fazione][base];
        if (!rif) { senzaCorrispondenza.push(u.nome); return; }
        ATTRIBUTI.forEach(a => {
            const mio = u[a], suo = rif[a];
            if (suo === undefined || suo === null) return;          // la fonte non lo dichiara
            if (mio === '-' || mio === undefined) return;            // "non ha l attributo": caso a parte
            if (Number(mio) !== Number(suo)) fuori.push(`${u.nome} ${a}: db ${mio}, ufficiale ${suo}`);
        });
    });
    return { fuori, senzaCorrispondenza };
};
['NOMADI', 'PANOCEANIA'].forEach(f => {
    const db = f === 'NOMADI' ? window.DB_NOMADI : window.DB_PANOCEANIA;
    const r = confronta(db, f);
    const accoppiati = db.length - r.senzaCorrispondenza.length;
    ok(accoppiati / db.length > 0.9,
       `${f}: ${accoppiati} profili su ${db.length} trovati nella fonte (${Math.round(accoppiati / db.length * 100)}%)`);
    ok(r.fuori.length === 0,
       `${f}: nessun attributo diverso dall ufficiale (fuori: ${r.fuori.length}${r.fuori.length ? ' — ' + r.fuori.slice(0, 4).join(' | ') : ''})`);
});

console.log('\n=== 3. Controprova: il confronto sa accorgersi di un valore sbagliato ===');
// Senza, uno zero non distingue "tutto combacia" da "non sto confrontando".
const finto = JSON.parse(J(window.DB_NOMADI.find(u => idx.NOMADI[norm(String(u.nome).split(' (')[0])])));
const attrVero = idx.NOMADI[norm(String(finto.nome).split(' (')[0])];
const daCambiare = ATTRIBUTI.find(a => attrVero[a] !== undefined && attrVero[a] !== null && finto[a] !== '-');
finto[a_ = daCambiare] = Number(attrVero[daCambiare]) + 3;
const prova = confronta([finto], 'NOMADI');
ok(prova.fuori.length === 1, `un ${daCambiare} spostato di 3 viene visto (${J(prova.fuori)})`);

console.log('\n=== 4. Lo stesso mercenario deve essere uguale nei due file ===');
// 81 nomi stanno in entrambi i database: sono i mercenari. DATABASE ne ha
// trovati 32 diversi fra le due copie — il Fiddler è Ferite dai Nomadi e
// Struttura in PanOceania, cioè due regole di salvezza per lo stesso soldato.
const perNome = {};
window.DB_NOMADI.forEach(u => (perNome[u.nome] = perNome[u.nome] || {}).nomadi = u);
window.DB_PANOCEANIA.forEach(u => (perNome[u.nome] = perNome[u.nome] || {}).pano = u);
const doppi = Object.entries(perNome).filter(([, v]) => v.nomadi && v.pano);
ok(doppi.length > 0, `profili presenti in entrambi i file: ${doppi.length}`);
const CAMPI = ATTRIBUTI.concat(['w', 'str', 'skills', 'equip']);
const discordi = doppi.filter(([, v]) => CAMPI.some(c => J(v.nomadi[c]) !== J(v.pano[c])));
ok(discordi.length === 0,
   `nessun mercenario diverso fra i due file (discordi: ${discordi.length}${discordi.length ? ' — ' + discordi.slice(0, 4).map(d => d[0]).join(' | ') : ''})`);
// E il caso peggiore, nominato: Ferite di qua, Struttura di là.
const salvezzaDiversa = doppi.filter(([, v]) => (!!v.nomadi.str) !== (!!v.pano.str));
ok(salvezzaDiversa.length === 0,
   `nessuno cambia fra Ferite e Struttura a seconda di chi lo schiera (${salvezzaDiversa.map(d => d[0]).join(', ') || 'nessuno'})`);

console.log('\n=== 5. "Non ha l attributo" si scrive "-", non 0 ===');
// Un attributo a zero il motore lo calcola: un BS 0 diventa un tiro a 3 con
// la gittata. Il trattino invece rende l'azione impossibile, ed è la
// correzione del 27 settembre. Quindi dove la fonte non ha il valore, il
// database deve avere "-".
const aZero = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    db.forEach(u => ['cc', 'bs', 'ph', 'wip'].forEach(a => { if (u[a] === 0) aZero.push(`${f} ${u.nome} ${a}`); }));
});
ok(aZero.length === 0, `nessun attributo scritto 0 al posto di "-" (${aZero.length}${aZero.length ? ' — ' + aZero.slice(0, 4).join(' | ') : ''})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

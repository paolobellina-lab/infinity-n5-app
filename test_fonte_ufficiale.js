// @versione 2026-09-29.3 | test_fonte_ufficiale.js | proprieta`: chat TEST
// ================================================================
// Il confronto dei DATI con la fonte ESTERNA: 101.json e 501.json.
// Diviso da test_coerenza_dati.js il 29 settembre, su proposta di DATABASE:
// "il dato non combacia con l'ufficiale" e "il dato non è coerente con se
// stesso" sono due domande diverse, e un rosso indistinto fa cercare nella
// direzione sbagliata. Qui sta solo la prima.
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
//
// I PROFILI SECONDARI. Nel JSON una stessa unità può avere più righe di
// statistiche dentro la STESSA opzione — Enhanced Profile, Battle-Ravaged,
// Inactive Symbiont Armor — distinte dall'indice. Confrontare l'Enhanced col
// profilo base è l'errore che gonfiava questo banco: 58+36 differenze dove
// quasi tutte erano accoppiamenti sbagliati (lo stesso inciampo che la chat
// DATABASE aveva avuto due giorni prima, con 434 divergenze per 171 vere).
// Ora ogni riga di statistiche entra nell'indice col proprio nome, e i nomi
// dei profili secondari si riconoscono nel nome del profilo del database.
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
        (g.profiles || []).forEach((p, i) => {
            const attr = { cc: p.cc, bs: p.bs, ph: p.ph, wip: p.wip, arm: p.arm, bts: p.bts, w: p.w, str: p.str, s: p.s };
            // Il nome del profilo entra SEMPRE (è quello che distingue
            // "ENHANCED PROFILE" dal base); ISC e opzioni solo per il primo,
            // che è quello standard.
            // Un profilo secondario si indicizza con l'unità davanti:
            // "ENHANCED PROFILE" da solo appartiene a decine di unità diverse,
            // e la prima indicizzata vincerebbe su tutte le altre — un altro
            // accoppiamento sbagliato, della stessa specie di quello che
            // questo banco è nato per evitare.
            // Ogni nome tiene la LISTA delle righe ufficiali che lo portano,
            // non solo la prima. Lo stesso nome può appartenere a unità
            // diverse: "MARVIN SPECBOTS" sta sia in Vortex Spec-Ops (bs 10)
            // sia in Nomads Team-Ops (bs 11), e sono due righe vere.
            // Tenendo solo la prima, la seconda risultava sbagliata.
            const aggiungi = (n) => { if (!n) return; const k = norm(n);
                (idx[k] = idx[k] || []).push(attr); };
            aggiungi(String(u.isc || '').split(',')[0] + '|' + (p.name || ''));
            aggiungi(p.name);
            if (i === 0) {
                aggiungi(u.isc); aggiungi(String(u.isc || '').split(',')[0]);
                (g.options || []).forEach(o => aggiungi(o.name));
            }
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

// COME SI RICONOSCE UN PROFILO SECONDARIO (deciso il 29 settembre).
// Nella fonte una stessa unità può avere più righe di statistiche: FULL
// POWER e BATTLE-RAVAGED per il Triphammer e il Puppetbot, ENHANCED PROFILE,
// INACTIVE SYMBIONT ARMOR. Quelle righe DEVONO avere valori diversi, quindi
// vanno riconosciute o il controllo sui doppioni le segnala per sempre.
// Il segnale è il CAMPO `profiloSecondario`, non il nome: un nome è una
// convenzione che chiunque può rompere scrivendo, e questa settimana ci ha
// già ingannati tre volte (eMina che pescava Chest Mine, ?219 letto come
// arma mancante, "Enhanced Profile" che accoppiava unità diverse).
// Finché il campo non c'è ovunque, si legge anche il nome — il ripiego è
// dichiarato, non silenzioso.
const NOMI_SECONDARI = /Enhanced Profile|Battle[- ]Ravaged|Full Power|Inactive Symbiont/i;
function secondarioDi(u) {
    if (u.profiloSecondario === true) return String(u.nome.match(NOMI_SECONDARI) || ['secondario'])[0];
    if (u.profiloSecondario === false) return null;
    return (String(u.nome).match(NOMI_SECONDARI) || [])[0] || null;
}

const confronta = (db, fazione) => {
    const fuori = [], senzaCorrispondenza = [];
    db.forEach(u => {
        // Un profilo secondario si riconosce dal nome: "… - Enhanced Profile"
        // o "(Enhanced Profile)". In quel caso si cerca QUELLA riga, non la base.
        const nome = String(u.nome);
        // Un profilo secondario si riconosce dal CAMPO se c'è, dal nome altrimenti.
// Il campo è il segnale giusto — vedi la nota in cima a secondarioDi — e la
// lettura dal nome resta come ripiego finché DATABASE non l'ha scritto
// ovunque: così il banco non diventa rosso durante il passaggio.
const secondario = secondarioDi(u);
        const radice = norm(nome.split(/ [-(]/)[0]);
        const base = secondario ? (radice + '|' + norm(secondario)) : radice;
        const righe = idx[fazione][base];
        if (!righe || !righe.length) { senzaCorrispondenza.push(u.nome); return; }
        // Basta che il profilo combaci con UNA delle righe ufficiali che
        // portano quel nome: quale delle unità sia, dal nome non si deduce.
        const scarti = (rif) => ATTRIBUTI.filter(a => {
            const mio = u[a], suo = rif[a];
            if (suo === undefined || suo === null) return false;
            if (mio === '-' || mio === undefined) return false;
            return Number(mio) !== Number(suo);
        });
        const migliore = righe.map(scarti).sort((x, y) => x.length - y.length)[0];
        if (migliore.length) {
            const rif = righe[righe.map(scarti).findIndex(x => x.length === migliore.length)];
            migliore.forEach(a => fuori.push(`${u.nome} ${a}: db ${u[a]}, ufficiale ${rif[a]}`));
        }
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
// Si prende un profilo che la fonte conosce e gli si sposta un attributo.
const conRiferimento = window.DB_NOMADI.find(u => {
    const r = idx.NOMADI[norm(String(u.nome).split(/ [-(]/)[0])];
    return r && r.length && ATTRIBUTI.some(a => r[0][a] !== undefined && r[0][a] !== null && u[a] !== '-');
});
const rifProva = idx.NOMADI[norm(String(conRiferimento.nome).split(/ [-(]/)[0])][0];
const attrProva = ATTRIBUTI.find(a => rifProva[a] !== undefined && rifProva[a] !== null && conRiferimento[attrProva_ = a] !== '-');
const finto = Object.assign(JSON.parse(J(conRiferimento)), { [attrProva]: Number(rifProva[attrProva]) + 3 });
const prova = confronta([finto], 'NOMADI');
ok(prova.fuori.length >= 1,
   `un ${attrProva} spostato di 3 su ${finto.nome.split(' (')[0]} viene visto (${J(prova.fuori.slice(0, 1))})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

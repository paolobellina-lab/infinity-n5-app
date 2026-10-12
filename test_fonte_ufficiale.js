// @versione 2026-10-09.2 | test_fonte_ufficiale.js | proprieta`: chat TEST
// .2 (9 ott, sera): 501.json e 101.json escono dal Project. Senza di loro le 8
//    prove sono NON ESEGUITE (contate e nominate), non rosse: vedi il blocco
//    FONTI FUORI DAL PROJECT. Con i due file in cartella il banco e` quello
//    della .1: 8 passati, 0 falliti.
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
// ---------------------------------------------------------------------------
// FONTI FUORI DAL PROJECT — convenzione del 9 ottobre sera (chat TEST).
// I file della fonte (501.json, 101.json) non stanno piu` nel Project: Paolo
// li allega quando servono. Senza di loro le prove che li leggono non sono
// ROSSE (un rosso che e` lo stato normale smette di essere letto) e non sono
// VERDI (una prova che passa senza guardare niente e` peggio): sono NON
// ESEGUITE, contate a parte e nominate, una riga per prova e nel riepilogo:
//     N passati, 0 falliti, K non eseguite (fonte assente: ...)
// Tre guardie perche` "non eseguita" non diventi un posto dove nascondersi:
//  - vale SOLO per i file nominati qui, e solo se il file NON C'E`. Un file
//    presente ma illeggibile, o un altro file che manca, resta un rosso;
//  - eseguite + non eseguite deve fare PROVE_ATTESE: una prova che sparisce
//    senza essere dichiarata e` un rosso;
//  - con la fonte in cartella la riga di riepilogo e` quella di sempre.
let nonEseguite = 0; const fontiAssenti = [];
const fonteAssente = (file) => {
    const nome = String(file).split('/').pop();
    const manca = !require('fs').existsSync(file);
    if (manca && fontiAssenti.indexOf(nome) < 0) fontiAssenti.push(nome);
    return manca;
};
const nonEseguita = (m, n) => { nonEseguite += (n || 1); console.log('  ⏸ NON ESEGUITA (fonte assente: ' + fontiAssenti.join(', ') + '): ' + m); };
const rigaFinale = (attese) => {
    const viste = passati + falliti + nonEseguite;
    if (viste !== attese) { falliti++; console.log('  ❌ prove eseguite + non eseguite: ' + viste + ', attese ' + attese + ' — una prova e` sparita o ne e` nata una: se e` voluto, aggiorna PROVE_ATTESE'); }
    console.log('\n──────────────\n' + passati + ' passati, ' + falliti + ' falliti' +
        (nonEseguite ? ', ' + nonEseguite + ' non eseguite (fonte assente: ' + fontiAssenti.join(', ') + ')' : '') + '\n');
};
// ---------------------------------------------------------------------------
const PROVE_ATTESE = 8;

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
// 🔴 UN BANCO CHE MUORE NON E` UN BANCO ROSSO. Senza 501.json o 101.json
// in cartella questo banco finiva con un ENOENT di node: nessuna riga di
// riepilogo, e chi misura vedeva un file muto senza sapere perche`.
// Misurato il 9 ottobre, rompendo in una copia di servizio dove i due
// JSON non c erano. Ora la mancanza e` una prova rossa che nomina il file.
['501.json', '101.json'].forEach(f => fonteAssente(DIR + f));
if (fontiAssenti.length) {
    // Tutte e otto: senza la fonte anche le due prove 'nessun attributo fuori'
    // passavano, ma su ZERO profili accoppiati — vere per il motivo sbagliato.
    ['i due JSON ufficiali si leggono', 'i nomi indicizzati sono piu` di 100 per fazione',
     'NOMADI: piu` del 90% dei profili trovato nella fonte', 'NOMADI: nessun attributo diverso dalla fonte',
     'PANOCEANIA: piu` del 90% dei profili trovato nella fonte', 'PANOCEANIA: nessun attributo diverso dalla fonte',
     'controprova: c e` un profilo che la fonte conosce', 'controprova: un attributo spostato di 3 viene visto'
    ].forEach(m => nonEseguita(m));
    rigaFinale(PROVE_ATTESE);
    process.exit(falliti ? 1 : 0);
}
const idx = { NOMADI: {}, PANOCEANIA: {} };
const fonteMancante = [];
[['NOMADI', '501.json'], ['PANOCEANIA', '101.json']].forEach(([f, file]) => {
    try { idx[f] = indice(file); }
    catch (e) { fonteMancante.push(file + ': ' + e.message.split('\n')[0].slice(0, 60)); }
});
ok(fonteMancante.length === 0,
   `i due JSON ufficiali si leggono${fonteMancante.length ? ' — MANCA ' + fonteMancante.join(' | ') : ''}`);
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
        // 🔴 9 ottobre. UN ATTRIBUTO CHE LA FONTE CAMBIA CON UNA SKILL
        // DELL OPZIONE non e` un errore del database. Nella fonte ufficiale
        // lo Swiss Guard opz. 5 e 6 porta la skill 274 "CC=21" e lo Stempler
        // Zond opz. 4 la 278 "BS=12": il PROFILO BASE dice 15 e 11, la skill
        // dell opzione li alza. DATABASE ha scritto il valore finale, e fa
        // bene: e` quello col quale si tira.
        //
        // Questo banco confrontava col profilo base e segnava tre scarti.
        // Ora, quando il NOME del profilo dichiara "Cc=21" o "Bs=12", il
        // confronto si fa contro QUEL numero invece che contro la fonte — e
        // pretende che combacino. Non e` un salto: e` un confronto diverso,
        // piu` stretto, perche` il numero dichiarato nel nome deve essere
        // quello scritto nel profilo.
        const dichiarati = {};
        (String(u.nome).match(/\b(CC|BS|PH|WIP|ARM|BTS)\s*=\s*(\d+)\b/gi) || []).forEach(t => {
            const m = /\b(CC|BS|PH|WIP|ARM|BTS)\s*=\s*(\d+)\b/i.exec(t);
            if (m) dichiarati[m[1].toLowerCase()] = Number(m[2]);
        });
        Object.keys(dichiarati).forEach(a => {
            if (Number(u[a]) !== dichiarati[a])
                fuori.push(`${u.nome} ${a}: il nome dichiara ${dichiarati[a]}, il profilo ha ${u[a]}`);
        });
        const scarti = (rif) => ATTRIBUTI.filter(a => {
            const mio = u[a], suo = rif[a];
            if (suo === undefined || suo === null) return false;
            if (mio === '-' || mio === undefined) return false;
            // L attributo che il nome dichiara e` gia` stato confrontato
            // sopra, contro il valore dichiarato: qui non si guarda.
            if (dichiarati[a] !== undefined) return false;
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
// Senza la fonte non c e` nessun profilo di riferimento: la controprova non
// si puo` fare, e va DETTO. Prima qui il banco cadeva con un TypeError e la
// riga di riepilogo non usciva: il file diventava muto, e il conteggio non
// lo vedeva. (Misurato il 9 ottobre.)
ok(!!conRiferimento,
   `c e` + ` un profilo che la fonte conosce, su cui fare la controprova${conRiferimento ? '' : ' — senza la fonte non si puo` fare'}`);
if (conRiferimento) {
    const rifProva = idx.NOMADI[norm(String(conRiferimento.nome).split(/ [-(]/)[0])][0];
    const attrProva = ATTRIBUTI.find(a => rifProva[a] !== undefined && rifProva[a] !== null && conRiferimento[a] !== '-');
    const finto = Object.assign(JSON.parse(J(conRiferimento)), { [attrProva]: Number(rifProva[attrProva]) + 3 });
    const prova = confronta([finto], 'NOMADI');
    ok(prova.fuori.length >= 1,
       `un ${attrProva} spostato di 3 su ${finto.nome.split(' (')[0]} viene visto (${J(prova.fuori.slice(0, 1))})`);
}

rigaFinale(PROVE_ATTESE);
process.exit(falliti ? 1 : 0);

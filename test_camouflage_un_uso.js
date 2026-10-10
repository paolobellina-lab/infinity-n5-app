// @versione 2026-10-09.1 | test_camouflage_un_uso.js | proprieta`: chat TEST
// ============================================================================
//  CAMOUFLAGE (1 USE) — la FAQ F07   node test_camouflage_un_uso.js
//  ---------------------------------------------------------------------------
//  Lo Stato CAMO si usa UNA volta per partita. Non e` nel testo 5.1.1: lo dice
//  la FAQ F07 (wiki "Camouflaged State", 0.0.0). Il contatore sta sull'unita`,
//  nel campo `camoUsato`, e lo scrivono TRE punti diversi:
//     M.consumaCamo            quando la truppa entra in CAMO
//     logica_stati.js 396,406  la casella della pagina stati
//     motore_core.js 319-320   il gancio su sostituisciUnita, per CHI ESCE
//  Tre scrittori per un campo sono il genere di cosa che divergeva, quindi qui
//  si provano tutti e tre e si pretende che diano la stessa risposta.
//
//  🔴 LA COSA CHE E` FACILE SBAGLIARE: l'uso e` l'ENTRATA nello stato, non
//  l'uscita. Chi si schiera come Marker dal database nasce in CAMO senza che
//  nessuno chiami consumaCamo: per quella truppa l'uso e` gia` speso, e si
//  scopre solo quando ESCE. Per questo il gancio sta sull'uscita.
//  La conseguenza, che e` la prova piu` importante del banco: un
//  aggiornamento che la LASCIA in CAMO non deve spendere niente.
//
//  I QUATTRO CASI, misurati col motore 2026-10-09.4:
//   1  Moran schierato in CAMO e poi rivelato  -> non rientra
//   2  Moran schierato come Modello            -> ci entra una volta
//   3  Intruder, Camouflage pieno              -> sempre, e non consuma niente
//   4  un aggiornamento che la lascia in CAMO  -> non spende nulla
// ============================================================================
global.window = global;
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ❌ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}

// --- il minimo che motore_core.js tocca all'avvio ---
global.document = { title: 'NOMADS TACTICAL TERMINAL', getElementById: () => null,
    querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, createElement: () => ({ style: {} }) };
global.localStorage = { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; },
    setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
global.alert = () => {}; global.confirm = () => true;
global.setInterval = () => 0; global.setTimeout = (f) => { try { f && f(); } catch (e) {} return 0; };
global.addEventListener = () => {};
global.firebase = { initializeApp: () => ({}), database: () => ({ ref: () => ({
    on: () => {}, set: () => {}, update: () => {}, remove: () => {},
    once: () => Promise.resolve({ val: () => null }) }) }) };

require(DIR + 'catalogo_n5.js');
require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js');
require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');
// Il gancio sull'uscita sta nel core: senza, il caso 4 non si puo` provare.
let coreCaricato = true;
try { require(DIR + 'motore_core.js'); } catch (e) { coreCaricato = false; console.log('  ⚠️ motore_core.js non si carica: ' + e.message); }
window.inviaSchieramentoAllHub = () => {};

const prof = (re, db) => {
    const u = (window[db] || []).find(x => re.test(x.nome));
    if (!u) throw new Error('profilo non trovato: ' + re + ' in ' + db);
    return JSON.parse(J(u));
};
const truppa = (p, altro) => Object.assign(p, { id: 'n1', alias: 'Prova', state: 'ACTIVE',
    deployState: 'NORMAL', states: {} }, altro || {});
const inCamo = (u) => Object.assign({}, u, { deployState: 'CAMO', states: { camo: true } });

// ---------------------------------------------------------------------------
sezione('0. Il contratto', () => {
    ok(typeof M.camoUnUso === 'function', 'M.camoUnUso c e');
    ok(typeof M.puoEntrareInCamo === 'function', 'M.puoEntrareInCamo c e');
    ok(typeof M.consumaCamo === 'function', 'M.consumaCamo c e');
    ok(typeof M.puoRientrareInCamo === 'function', 'M.puoRientrareInCamo c e');
    ok(coreCaricato && typeof window.sostituisciUnita === 'function',
       'e window.sostituisciUnita del core, che e` il terzo scrittore del campo');
    // Il catalogo tiene la regola e la fonte: se spariscono, il banco lo dice.
    const RC = (window.CATALOGO_N5 || {}).RIENTRO_CAMO || {};
    ok(/1 Use/.test(String(RC.unUso || '')), `il catalogo dichiara la regola: ${J(RC.unUso)}`);
    ok(/F07/.test(String((RC.fonti || {}).unUso || '')), `e la sua fonte e la FAQ F07 (${J((RC.fonti || {}).unUso)})`);
});

// ---------------------------------------------------------------------------
sezione('1. Chi ha l uso unico e chi no, sui database veri', () => {
    const tutti = [].concat((window.DB_NOMADI || []).map(u => ['NOMADI', u]),
                            (window.DB_PANOCEANIA || []).map(u => ['PANOCEANIA', u]));
    const unUso = tutti.filter(([, u]) => M.camoUnUso(u));
    const pieno = tutti.filter(([, u]) => /CAMOUFLAGE/i.test(u.skills || '') && !M.camoUnUso(u));
    ok(unUso.length === 22, `profili con Camouflage (1 Use): 22 (${unUso.length})`);
    ok(pieno.length === 57, `profili con Camouflage pieno: 57 (${pieno.length})`);
    // Le due liste non si sovrappongono: una truppa non puo` essere nei due insiemi.
    const doppi = unUso.filter(([f, u]) => pieno.some(([f2, u2]) => f === f2 && u.nome === u2.nome));
    ok(doppi.length === 0, 'e nessun profilo sta nei due insiemi insieme', doppi.map(([f, u]) => f + ' ' + u.nome).join(', '));
    // 🔴 Chi NON ha nessun Camouflage non deve passare per "uso unico": se
    // camoUnUso rispondesse true per tutti, il blocco scatterebbe su chiunque.
    const senza = tutti.filter(([, u]) => !/CAMOUFLAGE/i.test(u.skills || ''));
    const sbagliati = senza.filter(([, u]) => M.camoUnUso(u));
    ok(senza.length > 600 && sbagliati.length === 0,
       `e nessuno dei ${senza.length} profili senza Camouflage risulta "a uso unico"`,
       sbagliati.slice(0, 5).map(([f, u]) => f + ' ' + u.nome).join(', '));
    // L'alias N4. Il catalogo lo tiene, e il motore lo legge di proposito:
    // nessun profilo lo usa, ma le due letture non devono divergere.
    ok(M.camoUnUso({ skills: 'Limited Camouflage' }) === true,
       'e "Limited Camouflage", il nome N4 che il catalogo tiene come alias, si legge ancora');
    ok(tutti.filter(([, u]) => /LIMITED CAMOUFLAGE/i.test(u.skills || '')).length === 0,
       'anche se oggi nessun profilo dei due database lo scrive cosi`');
});

// ---------------------------------------------------------------------------
sezione('2. CASO 2 — schierata come MODELLO: ci entra UNA volta', () => {
    const moran = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran' });
    ok(M.camoUnUso(moran) === true, 'il Moran ha Camouflage (1 Use)');
    const prima = M.puoEntrareInCamo(moran);
    ok(prima.puo === true, 'schierato come Modello e con l uso libero: puo` entrare in CAMO');
    ok(prima.unUso === true, 'e il risultato dichiara che e` a uso unico, cosi` chi chiama sa di doverlo consumare');
    // Si consuma, e si guarda la truppa AGGIORNATA — non quella di prima.
    const uso = M.consumaCamo(moran);
    ok(uso.unitaAggiornata.camoUsato === true, 'consumaCamo marca camoUsato');
    ok(moran.camoUsato === undefined, 'e NON tocca l originale: torna una copia, come applicaIdle');
    ok(J(uso.mutazioni) === J([{ campo: 'camoUsato', da: false, a: true }]),
       `dichiarando la mutazione, cosi l app puo dirlo al giocatore (${J(uso.mutazioni)})`);
    // E adesso non ci rientra piu`.
    const dopo = M.puoEntrareInCamo(uso.unitaAggiornata);
    ok(dopo.puo === false, 'speso l uso e uscita dal CAMO: non ci rientra');
    ok(/1 Use/.test(dopo.motivo || '') && /F07/.test(dopo.motivo || ''),
       `col motivo e la fonte: ${J(dopo.motivo)}`);
    // CONTROPROVA: consumarlo due volte non cambia niente e non si lamenta.
    const due = M.consumaCamo(uso.unitaAggiornata);
    ok(due.unitaAggiornata.camoUsato === true && J(due.mutazioni) === J([{ campo: 'camoUsato', da: true, a: true }]),
       'CONTROPROVA: consumarlo di nuovo lo lascia speso, e la mutazione dice da true a true');
});

// ---------------------------------------------------------------------------
sezione('3. CASO 1 — schierata in CAMO e poi rivelata: non rientra', () => {
    const moran = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran' });
    // 🔴 Mentre ci sta DENTRO, puoEntrareInCamo risponde `true`: non e` un
    // difetto, e` la condizione `!st.camo` del motore. Chi e` gia` Marker non
    // deve "entrare", e la domanda giusta per lui e` puoRientrareInCamo
    // (sezione 6), che risponde "e` gia` in forma di Marker".
    const dentro = M.puoEntrareInCamo(inCamo(moran));
    ok(dentro.puo === true,
       'mentre ci sta dentro il blocco non scatta: la domanda per lui e` puoRientrareInCamo (misurato, non un difetto)');
    // Rivelata, con l'uso speso: niente rientro.
    const rivelato = Object.assign({}, moran, { camoUsato: true });
    const r = M.puoEntrareInCamo(rivelato);
    ok(r.puo === false && r.unUso === true, 'rivelata e con l uso speso: non rientra');
    ok(/già stato usato|gia` stato usato/.test(r.motivo || ''), `e il motivo lo dice: ${J(r.motivo)}`);
    // CONTROPROVA: la stessa truppa con l'uso LIBERO rientra. Senza questa, un
    // blocco che scattasse sempre passerebbe per corretto.
    const libero = M.puoEntrareInCamo(Object.assign({}, moran, { camoUsato: false }));
    ok(libero.puo === true, 'CONTROPROVA: con camoUsato false rientra — il blocco guarda il campo, non la skill');
    // `camoUsato` ASSENTE non e` `camoUsato` falso: tutte e due vogliono dire
    // "non speso", e il motore le tratta uguali. E` la distinzione che in
    // questo progetto e` costata tre difetti, quindi si prova.
    ok(M.puoEntrareInCamo(Object.assign({}, moran, { camoUsato: undefined })).puo === true,
       'e camoUsato ASSENTE vale come "non speso", non come "speso"');
});

// ---------------------------------------------------------------------------
sezione('4. CASO 3 — Camouflage pieno: sempre, e non consuma niente', () => {
    const intr = truppa(prof(/^Intruder \(HMG/, 'DB_NOMADI'), { id: 'n2', alias: 'Intru' });
    ok(M.camoUnUso(intr) === false, 'l Intruder ha il Camouflage pieno, non a uso unico');
    const r = M.puoEntrareInCamo(intr);
    ok(r.puo === true && r.unUso === false, 'puo` entrare, e il risultato dice che non c e` niente da consumare');
    // 🔴 Anche con camoUsato a true: quel campo non lo riguarda. Se il blocco
    // guardasse solo il campo e non la skill, un Intruder che ha avuto il
    // campo scritto per sbaglio resterebbe fuori dal CAMO per tutta la partita.
    ok(M.puoEntrareInCamo(Object.assign({}, intr, { camoUsato: true })).puo === true,
       'e anche con camoUsato a true ci entra: il campo non lo riguarda');
    const uso = M.consumaCamo(intr);
    ok(uso.unitaAggiornata.camoUsato === undefined && uso.mutazioni.length === 0,
       'consumaCamo su di lui non scrive niente e non dichiara mutazioni');
    ok(uso.unitaAggiornata === intr, 'torna la stessa unita`, non una copia: non c e` niente da cambiare');
});

// ---------------------------------------------------------------------------
sezione('5. CASO 4 — l uso e` l ENTRATA: un aggiornamento che la lascia in CAMO non spende', () => {
    if (!coreCaricato || typeof window.sostituisciUnita !== 'function') {
        ok(false, 'window.sostituisciUnita si carica', 'motore_core.js non caricato: sezione non eseguita.');
        return;
    }
    const giro = (statoPrima, usatoPrima, aggiornata) => {
        const u = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran',
            deployState: statoPrima, states: statoPrima === 'CAMO' ? { camo: true } : {}, camoUsato: usatoPrima });
        window.roster = [u];
        window.sostituisciUnita(u, aggiornata, 'prova', { senzaInvio: true });
        return { u: u, nelRoster: window.roster[0] };
    };
    // Esce dal CAMO: l'uso e` speso, perche` ci era ENTRATA (anche se lo stato
    // gliel'ha dato lo schieramento e consumaCamo non e` stata chiamata).
    const esce = giro('CAMO', undefined, { deployState: 'NORMAL', states: {} });
    ok(esce.u.camoUsato === true, 'in CAMO e poi rivelata: l uso risulta speso');
    ok(esce.nelRoster.camoUsato === true, 'e il campo e` scritto anche sulla copia nel roster, non solo su quella in mano');

    // 🔴 LA PROVA PIU` IMPORTANTE DEL BANCO. Un AGGIORNAMENTO qualunque
    // (ferite, uno stato, una foto) passa da sostituisciUnita. Se il gancio
    // guardasse solo "era in CAMO" invece di "era in CAMO e adesso non piu`",
    // ogni aggiornamento brucerebbe l'uso di un Moran che sta tranquillo sotto
    // il suo segnalino — e nessuno se ne accorgerebbe fino al momento di
    // rientrare, a partita in corso.
    const resta = giro('CAMO', undefined, { deployState: 'CAMO', states: { camo: true }, w: 0 });
    ok(resta.u.camoUsato === undefined,
       'ma un aggiornamento che la LASCIA in CAMO non spende niente',
       `camoUsato letto: ${J(resta.u.camoUsato)} — se e true, ogni aggiornamento brucia l uso`);
    ok(resta.nelRoster.camoUsato === undefined, 'ne` sulla copia nel roster');

    // Modello che resta Modello: il gancio non c'entra (l'entrata la gestisce
    // la pagina stati con consumaCamo).
    const fuori = giro('NORMAL', undefined, { deployState: 'NORMAL', states: {} });
    ok(fuori.u.camoUsato === undefined, 'una truppa che non era in CAMO non viene toccata dal gancio');

    // Gia` speso: resta speso, e non si riscrive a vuoto.
    const gia = giro('CAMO', true, { deployState: 'NORMAL', states: {} });
    ok(gia.u.camoUsato === true, 'e chi l aveva gia` speso resta speso');

    // Camouflage PIENO: il gancio non lo tocca mai.
    const i = truppa(prof(/^Intruder \(HMG/, 'DB_NOMADI'), { id: 'n2', alias: 'Intru', deployState: 'CAMO', states: { camo: true } });
    window.roster = [i];
    window.sostituisciUnita(i, { deployState: 'NORMAL', states: {} }, 'prova', { senzaInvio: true });
    ok(i.camoUsato === undefined, 'e un Intruder che esce dal CAMO non spende niente: non e` a uso unico');
});

// ---------------------------------------------------------------------------
sezione('6. La voce del menu: puoRientrareInCamo', () => {
    const moran = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran' });
    const r = (u, opz) => M.puoRientrareInCamo(u, opz || { inAro: false });
    ok(r(moran).puo === true, 'Modello con l uso libero: la voce si offre');
    const speso = r(Object.assign({}, moran, { camoUsato: true }));
    ok(speso.puo === false, 'uso speso: la voce NON si offre');
    ok(/1 Use/.test(speso.motivo || ''), `col motivo giusto, non un generico: ${J(speso.motivo)}`);
    // Chi e` gia` Marker non rientra: e` un altro motivo, e va distinto. Se i
    // due motivi fossero lo stesso testo, il giocatore non saprebbe se gli
    // manca l uso o se e` gia` nascosto.
    const dentro = r(inCamo(moran));
    ok(dentro.puo === false, 'gia` in forma di Marker: non rientra');
    ok(!/1 Use/.test(dentro.motivo || '') && /Marker/.test(dentro.motivo || ''),
       `e il motivo e DIVERSO da quello dell uso speso: ${J(dentro.motivo)}`);
    // L'Intruder, sempre.
    const intr = truppa(prof(/^Intruder \(HMG/, 'DB_NOMADI'), { id: 'n2', alias: 'Intru' });
    ok(r(intr).puo === true, 'l Intruder col Camouflage pieno: la voce si offre sempre');
    ok(r(Object.assign({}, intr, { camoUsato: true })).puo === true, 'anche col campo scritto per sbaglio');
    // Chi non ha nessun Camouflage: la voce non c e`, e il motivo e` un terzo.
    const fante = truppa(prof(/^Alguacil \(Combi/, 'DB_NOMADI'), { id: 'n3', alias: 'Fante' });
    const niente = r(fante);
    ok(niente.puo === false && !/1 Use/.test(niente.motivo || ''),
       `e chi non ha Camouflage ha un terzo motivo, non quello dell uso: ${J(niente.motivo)}`);
});

// ---------------------------------------------------------------------------
sezione('7. I tre scrittori del campo dicono la stessa cosa', () => {
    // M.consumaCamo, il gancio del core e la pagina stati scrivono tutti
    // `camoUsato`. Qui si pretende che il VALORE sia lo stesso: un true e un
    // 1, o un true e la stringa "true", passerebbero per uguali a un `if` e
    // non a un confronto stretto — ed e` con un confronto stretto che
    // puoEntrareInCamo lo legge (`unita.camoUsato`, in un && ).
    const moran = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran' });
    const dalMotore = M.consumaCamo(moran).unitaAggiornata.camoUsato;
    ok(dalMotore === true, `M.consumaCamo scrive il booleano true (${J(dalMotore)})`);
    if (coreCaricato && typeof window.sostituisciUnita === 'function') {
        const u = truppa(prof(/^Moran/, 'DB_NOMADI'), { alias: 'Moran', deployState: 'CAMO', states: { camo: true } });
        window.roster = [u];
        window.sostituisciUnita(u, { deployState: 'NORMAL', states: {} }, 'prova', { senzaInvio: true });
        ok(u.camoUsato === true, `il gancio del core scrive lo stesso booleano (${J(u.camoUsato)})`);
        ok(typeof u.camoUsato === typeof dalMotore, 'e sono dello stesso tipo: un confronto stretto li vede uguali');
    }
    // La pagina stati (logica_stati.js 396 e 406) non si carica qui — vuole il
    // DOM. Ma NON si passa sotto silenzio: si controlla che quelle due righe
    // chiamino M.consumaCamo invece di scrivere `true` a mano. Se qualcuno le
    // riscrivesse, il campo potrebbe prendere un valore diverso da questo.
    const fs = require('fs');
    let testo = null;
    try { testo = fs.readFileSync(DIR + 'logica_stati.js', 'utf8'); } catch (e) { testo = null; }
    if (testo === null) {
        ok(false, 'logica_stati.js si legge', `non trovato in ${DIR}`);
    } else {
        const chiamate = (testo.match(/consumaCamo\(window\.unitToEdit\)\.unitaAggiornata\.camoUsato/g) || []).length;
        ok(chiamate === 2,
           `la pagina stati prende il valore da M.consumaCamo in tutti e due i punti (${chiamate})`,
           'se non sono due, uno dei due punti scrive camoUsato per conto suo: il valore puo` divergere.');
        const aMano = (testo.match(/camoUsato\s*=\s*(true|1|'true'|"true")/g) || []).length;
        ok(aMano === 0, 'e nessuno dei due lo scrive a mano', `trovati ${aMano}: ${J((testo.match(/camoUsato\s*=\s*(true|1|'true'|"true")/g) || []))}`);
    }
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

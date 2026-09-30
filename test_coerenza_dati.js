// @versione 2026-09-29.4 | test_coerenza_dati.js | proprieta`: chat TEST
// ================================================================
// La coerenza dei dati con SE STESSI — l'altra metà di
// test_fonte_ufficiale.js, separata il 29 settembre su proposta di DATABASE.
// Qui non si guarda l'ufficiale: si guarda se il database si contraddice.
// I doppioni del 28 settembre erano di questo tipo — i valori erano giusti,
// era la storia del dato a essere sbagliata: un profilo generato e uno
// scritto a mano, rinominati per distinguerli invece che riconosciuti come
// la stessa cosa.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify, fs = require('fs');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

global.window = global;
require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');
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


console.log('\n=== 4. Lo stesso mercenario deve essere uguale nei due file ===');
// 81 nomi stanno in entrambi i database: sono i mercenari. DATABASE ne ha
// trovati 32 diversi fra le due copie — il Fiddler è Ferite dai Nomadi e
// Struttura in PanOceania, cioè due regole di salvezza per lo stesso soldato.
const perNome = {};
window.DB_NOMADI.forEach(u => (perNome[u.nome] = perNome[u.nome] || {}).nomadi = u);
window.DB_PANOCEANIA.forEach(u => (perNome[u.nome] = perNome[u.nome] || {}).pano = u);
const doppi = Object.entries(perNome).filter(([, v]) => v.nomadi && v.pano);
ok(doppi.length > 0, `profili presenti in entrambi i file: ${doppi.length}`);
// Le voci si confrontano come INSIEMI, normalizzando spazi e parentesi: la
// prima stesura usava il testo e chiamava differenza l'ORDINE delle skill —
// "Engineer, Climbing Plus" contro "Climbing Plus, Engineer" — o lo spazio di
// "AP CC Weapon (PS=6)". Erano 29 discordanti, e 24 non esistevano.
// armi ed equipaggiamento si confrontano INSIEME: lo stesso oggetto sta in
// `weapon` da una parte e in `equip` dall'altra (il caso del Warcor).
const voci = (u, campi) => new Set(campi.flatMap(c => String(u[c] || '').split(','))
    .map(x => scioglieParentesi(x.trim().replace(/\s*\(/, '(').toUpperCase())).filter(Boolean));
const diverse = (a, b) => [...a].filter(x => !b.has(x));
const CAMPI = ATTRIBUTI.concat(['w', 'str']);
// Gli upgrade con parentesi annidate — "(UPGRADE: TOTAL CONTROL (+1B))"
// contro la stessa cosa senza — restano due grafie legittime nei dati, e il
// parser del motore le legge entrambe dal 28 settembre. Quindi non si
// confronta il TESTO: si confronta quello che il motore ne ricava. È la
// differenza che aveva nascosto un difetto vero — Valerya Gromoz tirava
// Total Control a B1 invece di B2 — e che nessun confronto fra stringhe
// avrebbe potuto giudicare.
const programmi = (u) => { try {
    return J((M.programmiAttacco(u).programmi || []).map(p => p.nome + ':' + p.burst).sort());
} catch (e) { return 'errore'; } };
const discordiHacking = doppi.filter(([, v]) =>
    /Hacking Device/i.test(v.nomadi.equip || '') && programmi(v.nomadi) !== programmi(v.pano));
ok(discordiHacking.length === 0,
   `gli hacker danno gli stessi programmi nei due file (${discordiHacking.map(d => d[0]).join(', ') || 'nessuno'})`);
const scioglieParentesi = (x) => x.replace(/\((UPGRADE:[^)]*)\(([^)]*)\)\)/i, '($1$2)');
const discordi = doppi.filter(([, v]) => {
    if (CAMPI.some(c => J(v.nomadi[c]) !== J(v.pano[c]))) return true;
    const oN = voci(v.nomadi, ['weapon', 'equip']), oP = voci(v.pano, ['weapon', 'equip']);
    const sN = voci(v.nomadi, ['skills']), sP = voci(v.pano, ['skills']);
    return diverse(oN, oP).length || diverse(oP, oN).length || diverse(sN, sP).length || diverse(sP, sN).length;
});
ok(discordi.length === 0,
   `nessun mercenario diverso fra i due file (discordi: ${discordi.length}${discordi.length ? ' — ' + discordi.slice(0, 4).map(d => d[0]).join(' | ') : ''})`);
// E il caso peggiore, nominato: Ferite di qua, Struttura di là.
const salvezzaDiversa = doppi.filter(([, v]) => (!!v.nomadi.str) !== (!!v.pano.str));
ok(salvezzaDiversa.length === 0,
   `nessuno cambia fra Ferite e Struttura a seconda di chi lo schiera (${salvezzaDiversa.map(d => d[0]).join(', ') || 'nessuno'})`);

console.log('\n=== 5. Come si scrive "non ha l attributo" ===');
// Tre scritture diverse per lo stesso fatto, e il motore le tratta in tre modi:
//   "-"   l'azione è impossibile (righe 688-690)
//   0     è un numero, e i MOD si sommano: un'arma a +3 tira a 3 (riga 620)
//   -1    è un numero anche lui, e tira a 2
// Lo 0 è legittimo quando la fonte dice 0 — il Bâtard ha bs 0 e lancia
// Granate sul PH — quindi non si segnala da solo. Il -1 no: non viene da
// nessuna fonte, è un residuo di conversione.
const meno1 = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    db.forEach(u => ['cc', 'bs', 'ph', 'wip', 'arm', 'bts'].forEach(a => {
        if (u[a] === -1 || u[a] === '-1') meno1.push(`${f} ${u.nome} ${a}`);
    }));
});
ok(meno1.length === 0,
   `nessun attributo scritto -1 (${meno1.length}${meno1.length ? ' — ' + meno1.slice(0, 4).join(' | ') : ''})`);
// Chiesto da DATABASE il 29 settembre, dopo il terzo inciampo in un giorno
// sui tre modi di scrivere "nessun valore": un `if v in (None, False)` nel
// loro generatore trasformava ogni ZERO in "-", perché in Python 0 == False.
// I Puppetbot danneggiati uscivano con ARM e BTS PROIBITI invece che nulli.
// La forma ammessa è una sola: un numero, oppure il trattino.
const malScritti = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    db.forEach(u => ATTRIBUTI.concat(['w', 'str']).forEach(a => {
        if (!(a in u) || u[a] === undefined || u[a] === null) return;
        const v = u[a];
        const valido = v === '-' || (typeof v === 'number' && isFinite(v) && v >= 0) ||
                       (typeof v === 'string' && /^\d+$/.test(v));
        if (!valido) malScritti.push(`${f} ${u.nome} ${a}: ${J(v)}`);
    }));
});
ok(malScritti.length === 0,
   `ogni attributo è un numero oppure "-" (${malScritti.length}${malScritti.length ? ' — ' + malScritti.slice(0, 4).join(' | ') : ''})`);
// Lo 0 contro la fonte lo guarda test_fonte_ufficiale: qui basta dire che le
// tre scritture non si mescolano dentro la stessa unità.

console.log('\n=== 6. Lo stesso profilo non deve avere due righe diverse ===');
// Quante righe di statistiche la FONTE dichiara per un nome: si legge dai
// due JSON, perché è l'unico modo di distinguere un doppione da due unità
// che portano davvero lo stesso nome.
const fonti = { NOMADI: '501.json', PANOCEANIA: '101.json' };
const attesi = {};
Object.entries(fonti).forEach(([f, file]) => {
    attesi[f] = {};
    try {
        const j = JSON.parse(fs.readFileSync(DIR + file, 'utf8'));
        (j.units || []).forEach(u => (u.profileGroups || []).forEach(g => (g.profiles || []).forEach(p => {
            const chiave = String(p.name || '').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/S$/, '');
            const set = (attesi[f][chiave] = attesi[f][chiave] || new Set());
            set.add(['cc', 'bs', 'ph', 'wip', 'arm', 'bts', 's'].map(a => p[a]).join('/'));
            (g.options || []).forEach(o => {
                const k2 = String(o.name || '').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/S$/, '');
                if (k2) (attesi[f][k2] = attesi[f][k2] || new Set()).add(['cc', 'bs', 'ph', 'wip', 'arm', 'bts', 's'].map(a => p[a]).join('/'));
            });
        })));
    } catch (e) { /* senza la fonte il controllo resta al minimo di 1 */ }
});
const quanteNellaFonte = (f, radice) => {
    const k = String(radice).toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/S$/, '');
    return (attesi[f] && attesi[f][k]) ? attesi[f][k].size : 1;
};
// Trovato scrivendo il banco: alcune radici hanno due profili con statistiche
// diverse — uno scritto a mano e uno generato, sopravvissuti insieme.
// Marvin Specbot_1 esiste come "(Heavy Flamethrower)" con BS 11 e come
// "(Heavy Flamethrower) - 8 pt" con BS 10. Il secondo è quello ufficiale.
// I profili secondari veri (Enhanced Profile e simili) sono esclusi: quelli
// DEVONO avere statistiche diverse.
const doppioni = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    const perRadice = {};
    db.forEach(u => {
        if (secondarioDi(u)) return;
        const r = String(u.nome).split(/ [-(]/)[0].trim();
        (perRadice[r] = perRadice[r] || []).push(u);
    });
    Object.entries(perRadice).forEach(([r, lista]) => {
        const chiavi = new Set(lista.map(u => ATTRIBUTI.map(a => u[a]).join('/')));
        // Due righe con lo stesso nome possono essere due unità diverse della
        // fonte: "MARVIN SPECBOTS" sta sia in Vortex Spec-Ops (BS 10) sia in
        // Nomads Team-Ops (BS 11). Il numero di righe di statistiche diverse
        // non deve superare quello che la fonte dichiara per quel nome — è il
        // confronto che distingue due varianti vere da un doppione.
        const ammesse = quanteNellaFonte(f, r);
        if (chiavi.size > Math.max(1, ammesse))
            doppioni.push(`${f} ${r}: ${chiavi.size} righe diverse, la fonte ne dichiara ${ammesse} — ${[...chiavi].join('  contro  ')}`);
    });
});
ok(doppioni.length === 0,
   `nessuna radice con due righe di statistiche diverse (${doppioni.length}${doppioni.length ? ' — ' + doppioni.slice(0, 3).join(' | ') : ''})`);


console.log('\n=== 7. Una grafia sola per gli upgrade ===');
// DATABASE le ha uniformate il 29 settembre: erano TRE forme — con le
// parentesi annidate, senza, e senza i due punti — su 33 profili. Il motore
// le legge tutte, quindi non cambia nessun calcolo; ma una forma sola toglie
// di mezzo la classe di difetti che ne era nata (il parser che si fermava
// alla prima parentesi e faceva tirare Valerya Gromoz a B1 invece di B2).
const conUpgrade = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA)
    .filter(u => /UPGRADE/i.test(u.equip || ''));
ok(conUpgrade.length > 10, `profili con un upgrade: ${conUpgrade.length}`);
const annidate = conUpgrade.filter(u => /\(UPGRADE[^)]*\([^)]*\)/i.test(u.equip || ''));
ok(annidate.length === 0, `nessuna parentesi annidata (${annidate.length}${annidate.length ? ' — ' + annidate.slice(0, 3).map(u => u.nome).join(' | ') : ''})`);
const senzaDuePunti = conUpgrade.filter(u => /\(UPGRADE\s+[A-Z]/i.test(u.equip || ''));
ok(senzaDuePunti.length === 0, `tutte con i due punti (${senzaDuePunti.length}${senzaDuePunti.length ? ' — ' + senzaDuePunti.slice(0, 3).map(u => u.nome).join(' | ') : ''})`);
// Controprova: il motore legge comunque le forme vecchie, quindi la grafia è
// una regola di ordine e non una dipendenza del calcolo. Se un domani ne
// rientra una, le prove sopra lo dicono e nessun tiro cambia.
const vecchia = Object.assign(JSON.parse(J(conUpgrade[0])), { states: {} });
vecchia.equip = String(vecchia.equip).replace(/\(UPGRADE:\s*/i, '(UPGRADE ');
const stessiProgrammi = J((M.programmiAttacco(conUpgrade[0]).programmi || []).map(p => p.nome + ':' + p.burst)) ===
                        J((M.programmiAttacco(vecchia).programmi || []).map(p => p.nome + ':' + p.burst));
ok(stessiProgrammi, 'controprova: il parser legge ancora la forma senza i due punti, stessi programmi');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

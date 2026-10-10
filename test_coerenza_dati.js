// @versione 2026-10-09.3 | test_coerenza_dati.js | proprieta`: chat TEST
// .3 (9 ott, sera): 501.json e 101.json escono dal Project. La sola prova che
//    li legge (sezione 6, le righe di statistiche per radice) senza di loro e`
//    NON ESEGUITA: prima cadeva al 'minimo di 1' e dava un rosso FALSO su
//    quattro radici (i Marvin Specbot) che nella fonte hanno due righe vere.
//    Con i due file in cartella il banco e` quello della .2: 38 passati.
// .2 (9 ott, sera): accolte le cinque spazzate del blocco SW del piano
//    (sezioni 8-12), che erano frammenti da incollare in console. Tre cose
//    trovate spostandole: i contenitori di modalita` sono 23 e non 21, il
//    Jammer non da` piu` A47, e SW-04 controllava un campo (`sconosciuta`)
//    che non esiste su nessuna notazione — una prova che non poteva fallire.
//    Le cinque rotture di controprova sono in rompi_sw.sh: A51b rinominato,
//    Armed Turret senza `armaDalProfilo` NELLA VOCE ARMA (la prima volta ho
//    colpito la voce del deployable: file diverso, risultato identico — il
//    secondo passo della disciplina delle rotture serve a questo),
//    tiroSalvezza sempre non offensiva, una notazione nuova, un deployable
//    che punta a un'arma inesistente.
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
const PROVE_ATTESE = 38;

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
const fonteRotta = [];
const attesi = {};
Object.values(fonti).forEach(file => fonteAssente(DIR + file));
Object.entries(fonti).forEach(([f, file]) => {
    attesi[f] = {};
    if (fontiAssenti.indexOf(file) >= 0) return;   // assente: la prova sotto e` NON ESEGUITA
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
    } catch (e) { fonteRotta.push(file + ': ' + String(e.message).split('\n')[0].slice(0, 60)); }
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
// 🔴 9 ottobre. UN PROFILO CHE DICHIARA NEL NOME un attributo diverso
// ("Swiss Guard (… Cc=21 …)", "Stempler Zond (Bs=12, …)") HA statistiche
// diverse dai fratelli, e deve averle: nella fonte quel numero lo alza una
// skill dell OPZIONE, non il profilo base. Contati insieme agli altri
// sembravano un doppione — i due rossi del 9 ottobre.
// Si escludono dal raggruppamento, come i profili secondari veri, e si
// controllano a parte sotto: il numero scritto nel profilo deve essere
// quello che il nome dichiara. Niente si perde nello scarto.
const RE_DICHIARATO = /\b(CC|BS|PH|WIP|ARM|BTS)\s*=\s*(\d+)\b/i;
const dichiaraAttributo = (u) => RE_DICHIARATO.test(String(u.nome));
const scartatiPerNome = [];
const disaccordi = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    db.forEach(u => {
        if (!dichiaraAttributo(u)) return;
        scartatiPerNome.push(f + ' ' + u.nome);
        (String(u.nome).match(/\b(CC|BS|PH|WIP|ARM|BTS)\s*=\s*(\d+)\b/gi) || []).forEach(t => {
            const m = RE_DICHIARATO.exec(t); if (!m) return;
            const a = m[1].toLowerCase(), n = Number(m[2]);
            if (Number(u[a]) !== n) disaccordi.push(`${f} ${u.nome}: il nome dichiara ${a}=${n}, il profilo ha ${u[a]}`);
        });
    });
});
ok(scartatiPerNome.length > 0,
   `profili che dichiarano un attributo nel nome: ${scartatiPerNome.length} (se fosse 0 lo scarto sotto non starebbe guardando niente)`);
ok(disaccordi.length === 0,
   `e in ognuno il numero scritto e\` quello dichiarato nel nome${disaccordi.length ? ' — ' + disaccordi.slice(0, 3).join(' | ') : ''}`);

const doppioni = [];
[['NOMADI', window.DB_NOMADI], ['PANOCEANIA', window.DB_PANOCEANIA]].forEach(([f, db]) => {
    const perRadice = {};
    db.forEach(u => {
        if (secondarioDi(u)) return;
        if (dichiaraAttributo(u)) return;
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
if (fontiAssenti.length) {
    nonEseguita('nessuna radice con due righe di statistiche diverse — quante righe un nome puo` avere lo dice solo la fonte');
} else {
    ok(doppioni.length === 0 && fonteRotta.length === 0,
       `nessuna radice con due righe di statistiche diverse (${doppioni.length}${doppioni.length ? ' — ' + doppioni.slice(0, 3).join(' | ') : ''}${fonteRotta.length ? ' — FONTE ILLEGGIBILE ' + fonteRotta.join(' | ') : ''})`);
}


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


// ================================================================
// SEZIONI 8-12 — le cinque spazzate del blocco SW del piano, che fino al
// 9 ottobre erano frammenti da incollare in console. Spostarle qui non e`
// un abbellimento: una spazzata che gira solo quando qualcuno se la ricorda
// misura il database del giorno in cui l'ha incollata, non quello di oggi.
// La prova e` che il piano dichiarava per SW-01 "21 contenitori" e un A47
// sul Jammer: oggi i contenitori sono 23 e il Jammer non da` piu` nessun
// avviso. Nessuno dei due e` un difetto — e` il piano che non lo sapeva.
// Dove possibile le attese sono INVARIANTI invece di numeri: "l'insieme di
// chi prende A51b e` esattamente l'insieme dei contenitori" non invecchia,
// "sono 21" invecchia in due settimane.
// ================================================================

console.log('\n=== 8. Ogni arma si risolve, e gli avvisi sono quelli previsti ===');
const NOMI_ARMI = Object.keys(window.RULES_WEAPONS);
const profili = {}; NOMI_ARMI.forEach(n => profili[n] = M.profiloArma(n));
ok(NOMI_ARMI.length > 150, `armi in RULES_WEAPONS: ${NOMI_ARMI.length}`);
const nonTrovate = NOMI_ARMI.filter(n => profili[n].nonTrovata);
ok(nonTrovate.length === 0,
   `nessuna arma del database che il motore non trova (${nonTrovate.length}${nonTrovate.length ? ' — ' + nonTrovate.slice(0, 5).join(' | ') : ''})`);

// L'invariante, non il conteggio: A51b vuol dire "questa e` un contenitore
// di modalita`, scegli il modo". Deve prenderlo ogni contenitore e nessun
// altro. Un contenitore che perde l'avviso e un'arma normale che lo prende
// sono due difetti diversi e questa prova li separa.
const conA51b = NOMI_ARMI.filter(n => (profili[n].avvisi || []).some(a => a.codice === 'A51b')).sort();
const contenitori = NOMI_ARMI.filter(n => profili[n].modalita).sort();
const a51bSenzaModi = conA51b.filter(n => contenitori.indexOf(n) < 0);
const modiSenzaA51b = contenitori.filter(n => conA51b.indexOf(n) < 0);
ok(a51bSenzaModi.length === 0 && modiSenzaA51b.length === 0,
   `A51b va a tutti i ${contenitori.length} contenitori di modalita` + '`' + ` e a nessun altro`,
   `con A51b ma senza modi: ${J(a51bSenzaModi)} — con i modi ma senza A51b: ${J(modiSenzaA51b)}`);
ok(contenitori.length >= 23,
   `i contenitori sono ${contenitori.length} (il 9 ottobre erano 23; il piano ne dichiarava 21 da giorni)`,
   'se il numero SCENDE qualcuno ha perso i suoi modi: il MULTI Rifle senza modi tira sempre col primo');

// A47 vuol dire "il modo e` dedotto, non scritto nella fonte". Qui l'insieme
// nominato serve: un A47 nuovo e` un dato che manca alla fonte, ed e` esatta-
// mente la cosa da vedere. Il Jammer era in questa lista e ne e` uscito.
const ATTESI_A47 = ['D-Charges (Demolition Mode)'];
const conA47 = NOMI_ARMI.filter(n => (profili[n].avvisi || []).some(a => a.codice === 'A47')).sort();
const a47Comparsi = conA47.filter(n => ATTESI_A47.indexOf(n) < 0);
const a47Spariti = ATTESI_A47.filter(n => conA47.indexOf(n) < 0);
ok(a47Comparsi.length === 0 && a47Spariti.length === 0,
   `A47 (modo dedotto) solo su: ${ATTESI_A47.join(', ')}`,
   `comparsi: ${J(a47Comparsi)} — spariti: ${J(a47Spariti)}. Un A47 nuovo e un modo che la fonte non dichiara.`);

// Ogni altro codice e` una segnalazione: qui si guarda che non ce ne siano.
const altriCodici = {};
NOMI_ARMI.forEach(n => (profili[n].avvisi || []).forEach(a => {
    if (a.codice === 'A51b' || a.codice === 'A47') return;
    (altriCodici[a.codice] = altriCodici[a.codice] || []).push(n);
}));
ok(Object.keys(altriCodici).length === 0,
   `nessun altro codice di avviso sui profili delle armi`,
   `codici trovati: ${J(Object.keys(altriCodici).map(c => c + ' su ' + altriCodici[c].slice(0, 4).join(', ')))}`);


console.log('\n=== 9. Nessuna arma a gittata senza bande, e i filtri servono davvero ===');
// Cinque esclusioni, non quattro. Il piano ne dichiarava quattro e la
// spazzata dava un falso positivo: `Armed Turret`, che ha `armaDalProfilo`
// — la torretta non ha un'arma propria, la prende dalla scheda di chi la
// piazza (Clockmaker (Armed Turret), Machinist (Armed Turret Combi R.)).
// Bande vuote per lei e` il dato giusto.
const aGittata = NOMI_ARMI.filter(n => { const a = profili[n];
    return !(a.isTemplate || a.isCC || a.modalita || a.senzaGittata || a.armaDalProfilo); });
ok(aGittata.length > 90, `armi a gittata da controllare: ${aGittata.length}`);
const senzaBande = aGittata.filter(n => !profili[n].bands || !profili[n].bands.length);
ok(senzaBande.length === 0,
   `nessuna arma a gittata senza bande (${senzaBande.length})`,
   `senza bande: ${J(senzaBande)} — un'arma a gittata senza bande non ha MOD a nessuna distanza`);
const tutteZero = aGittata.filter(n => profili[n].bands.length && profili[n].bands.every(b => b.mod === 0));
ok(tutteZero.length === 0,
   `nessuna arma con tutte le bande a zero (${tutteZero.length})`,
   `tutte a zero: ${J(tutteZero)} — sarebbe un'arma senza nessun MOD di distanza`);

// CONTROPROVA sui due filtri meno ovvi: devono escludere qualcosa. Un filtro
// che non esclude niente e` un filtro che non serve, e allora la prova sopra
// sta passando per il motivo sbagliato. Se un domani il motore dara` bande
// vere a queste armi, queste due righe lo dicono.
const FALSI_SENZA_GITTATA = ['CrazyKoalas', 'D-Charges (Demolition Mode)', 'Deployable Cover (Cutting Foam)',
    'Deployable Cover (Vitroferro)', 'Disco Ball', 'FastPanda', 'Jammer', 'Madtraps'];
const senzaGittata = NOMI_ARMI.filter(n => profili[n].senzaGittata &&
    !(profili[n].isTemplate || profili[n].isCC || profili[n].modalita)).sort();
const sgComparsi = senzaGittata.filter(n => FALSI_SENZA_GITTATA.indexOf(n) < 0);
const sgSpariti = FALSI_SENZA_GITTATA.filter(n => senzaGittata.indexOf(n) < 0);
ok(sgComparsi.length === 0 && sgSpariti.length === 0,
   `senza il filtro \`senzaGittata\` uscirebbero questi ${FALSI_SENZA_GITTATA.length} falsi positivi, nominati`,
   `comparsi: ${J(sgComparsi)} — spariti: ${J(sgSpariti)}`);
const dalProfilo = NOMI_ARMI.filter(n => profili[n].armaDalProfilo).sort();
ok(J(dalProfilo) === J(['Armed Turret']),
   'e senza il filtro `armaDalProfilo` uscirebbe la sola Armed Turret',
   `armi con l'arma presa dalla scheda: ${J(dalProfilo)}`);


console.log('\n=== 10. Ogni arma offensiva sa dire la sua salvezza ===');
// Il bersaglio non cambia il risultato della spazzata: serve solo un
// bersaglio valido perche` tiroSalvezza abbia ARM e BTS da cui partire.
const BERSAGLIO = window.DB_PANOCEANIA.find(u => u.nome === 'Fusilier (Combi Rifle)');
ok(!!BERSAGLIO, 'il bersaglio della spazzata esiste nel database: Fusilier (Combi Rifle)');
const ATTRIBUTI_SALV = ['ARM', 'BTS', 'ARM+BTS', 'PH', 'WIP', 'BS', 'CC'];
const NON_OFFENSIVE = ['Disco Ball', 'Eclipse Grenade Launcher', 'Eclipse Grenades',
    'FastPanda', 'Smoke Grenade Launcher', 'Smoke Grenades'];
const incomplete = [], attributoIgnoto = [], nonOffensive = [];
let offensiveViste = 0;
NOMI_ARMI.forEach(n => { const a = profili[n]; if (a.modalita) return;
    const s = M.tiroSalvezza(BERSAGLIO, { arma: a, ammo: a.ammo });
    if (s.offensivo === false) { nonOffensive.push(n); return; }
    offensiveViste++;
    if (!s.attributo || !s.tiri) incomplete.push(n + ' (attributo ' + J(s.attributo) + ', tiri ' + J(s.tiri) + ')');
    else if (ATTRIBUTI_SALV.indexOf(s.attributo) < 0) attributoIgnoto.push(n + ' -> ' + s.attributo);
});
ok(incomplete.length === 0,
   `nessuna arma offensiva senza attributo o senza dadi di salvezza (${incomplete.length})`,
   `incomplete: ${J(incomplete.slice(0, 5))}`);
// Le due righe che rendono il "nessuna" leggibile: se domani tiroSalvezza
// tornasse `offensivo: false` per tutto, "incomplete 0" resterebbe verde e
// non vorrebbe dire niente. Queste contano chi e` stato davvero esaminato.
ok(offensiveViste > 150,
   `le armi offensive davvero esaminate sono ${offensiveViste} — il "nessuna" di sopra guarda loro`,
   'se questo numero crolla, la spazzata sta passando perche` non guarda piu` niente');
ok(attributoIgnoto.length === 0,
   `ogni salvezza usa un attributo noto (${J(ATTRIBUTI_SALV)})`,
   `attributi fuori elenco: ${J(attributoIgnoto)}`);
const noComparse = nonOffensive.sort().filter(n => NON_OFFENSIVE.indexOf(n) < 0);
const noSparite = NON_OFFENSIVE.filter(n => nonOffensive.indexOf(n) < 0);
ok(noComparse.length === 0 && noSparite.length === 0,
   `le armi non offensive sono esattamente queste ${NON_OFFENSIVE.length}, nominate: fumogene, eclisse, FastPanda, Disco Ball`,
   `comparse: ${J(noComparse)} — sparite: ${J(noSparite)}. Un'arma che diventa non offensiva esce da questa spazzata senza dirlo.`);


console.log('\n=== 11. Le notazioni dei profili: nessuna che il motore non sappia leggere ===');
// ATTENZIONE, QUESTA SEZIONE E` NATA DA UN DIFETTO MIO.
// SW-04 del piano diceva: `if (x.sconosciuta) console.log(...)`. Il campo
// `sconosciuta` NON ESISTE su nessuna notazione: i campi sono etichetta,
// tipo, raw e, secondo il tipo, valore/munizione/testo/unita/attributo/voci.
// Quella spazzata non poteva stampare niente, e il suo "nessuna" era vero
// per il motivo sbagliato — una prova che non guarda. Il bucket vero di
// "non l'ho saputa tradurre in una regola" e` `tipo: 'TESTO'`.
const TUTTI = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const TIPI_NOTI = ['BURST', 'DADO_SPECIALE', 'MOD', 'MOD_ATTRIBUTO', 'MOVIMENTO',
    'MUNIZIONE', 'SALVEZZA', 'SOSTITUZIONE', 'TESTO', 'UPGRADE'];
const CON_VALORE = ['BURST', 'DADO_SPECIALE', 'MOD', 'MOD_ATTRIBUTO', 'MOVIMENTO', 'SALVEZZA', 'SOSTITUZIONE'];
// I 38 testi che il motore oggi non traduce in regola. Non sono difetti:
// sono annotazioni non meccaniche (fazioni, terreni, "1 USE", "AUTO") piu`
// alcune che una regola potrebbe diventare ("GUIDED -6", "REROLL -3").
// L'elenco serve perche` uno NUOVO e` una notazione che nessun calcolo usa.
const TESTI_NOTI = ['+1 COMMAND TOKEN', '+1 ORDER', '1', '1 USE', '2', 'ANCILLARY', 'ANTIMATERIAL',
    'AQUATIC', 'ARM', 'AUTO', 'BTS', 'CONNOLLY', 'CONTINUOUS DAMAGE', 'CONTROL', 'CRITICAL',
    'DEP. ZONE', 'DESERT', 'ENHANCED', 'ESCAPE SYSTEM -2', 'ESCAPE SYSTEM -3', 'GUIDED',
    'GUIDED -6', 'HACKING -3', 'HELOTS', 'JACKALS', 'JET PROPULSION', 'JUNGLE', 'MORLOCKS',
    'POS', 'REROLL', 'REROLL -3', 'SERVANT', 'SHAOLIN', 'SYNCHRONIZED', 'TOTAL', 'WIP',
    'ZELLENKRIEGERS', 'ZERO-G'];

let notazioniViste = 0;
const senzaCampiBase = [], tipiIgnoti = {}, senzaValore = [], testiVisti = {};
TUTTI.forEach(u => M.tutteLeNotazioni(u).forEach(x => { notazioniViste++;
    if (!x.etichetta || !x.tipo || !x.raw) senzaCampiBase.push(u.nome + ' | ' + J(x));
    if (TIPI_NOTI.indexOf(x.tipo) < 0) (tipiIgnoti[x.tipo] = tipiIgnoti[x.tipo] || []).push(u.nome + ' | ' + x.raw);
    if (CON_VALORE.indexOf(x.tipo) >= 0 && (typeof x.valore !== 'number' || !isFinite(x.valore)))
        senzaValore.push(u.nome + ' | ' + x.tipo + ' | ' + x.raw + ' | valore=' + J(x.valore));
    if (x.tipo === 'TESTO') testiVisti[x.raw] = (testiVisti[x.raw] || 0) + 1;
}));
ok(notazioniViste > 2000,
   `notazioni lette sui ${TUTTI.length} profili: ${notazioniViste}`,
   'se questo numero crolla, tutteLeNotazioni ha smesso di trovarle e tutta la sezione passa a vuoto');
ok(senzaCampiBase.length === 0,
   `ogni notazione porta etichetta, tipo e raw (${senzaCampiBase.length} senza)`,
   `senza: ${J(senzaCampiBase.slice(0, 3))}`);
ok(Object.keys(tipiIgnoti).length === 0,
   `nessun tipo di notazione fuori dai ${TIPI_NOTI.length} noti`,
   `tipi nuovi: ${J(Object.keys(tipiIgnoti).map(t => t + ' su ' + tipiIgnoti[t].slice(0, 3).join(', ')))}`);
ok(senzaValore.length === 0,
   `ogni notazione meccanica porta un valore numerico (${senzaValore.length} senza)`,
   `senza valore: ${J(senzaValore.slice(0, 4))} — una MOD senza numero non sposta nessun tiro`);

// QUESTA e` SW-04 rifatta: il confronto nominato nei due versi.
const testi = Object.keys(testiVisti).sort();
const testiNuovi = testi.filter(t => TESTI_NOTI.indexOf(t) < 0);
const testiSpariti = TESTI_NOTI.filter(t => testi.indexOf(t) < 0);
ok(testiNuovi.length === 0 && testiSpariti.length === 0,
   `le notazioni che il motore non traduce in regola sono esattamente le ${TESTI_NOTI.length} note`,
   `NUOVE: ${J(testiNuovi)} — SPARITE: ${J(testiSpariti)}. Una nuova e una notazione scritta nel profilo che nessun calcolo legge; una sparita e diventata meccanica, e va bene saperlo.`);

// Controprova, e serve a provare che la riga di sopra morde: una notazione
// inventata deve finire nel bucket TESTO e quindi comparire fra le NUOVE.
const finto = Object.assign({}, TUTTI[0], { equip: String(TUTTI[0].equip || '') + ' (ZZQQ: 9)', states: {} });
// Guarda SOLO la ZZQQ: una controprova che contasse tutte le non tradotte
// si accenderebbe anche per un'altra rottura, e direbbe la cosa sbagliata.
const inventate = M.tutteLeNotazioni(finto).filter(x => x.tipo === 'TESTO' && /ZZQQ/.test(x.raw));
ok(inventate.length === 1 && TESTI_NOTI.indexOf(inventate[0].raw) < 0,
   'controprova: una notazione inventata (ZZQQ) finisce fra le non tradotte e sarebbe segnalata',
   `trovate: ${J(inventate.map(x => x.raw))} — se e vuoto, il confronto di sopra non guarda niente`);

console.log('\n=== 12. Ogni deployable e` collegato alla sua arma ===');
const DEP = window.DB_DEPLOYABLES;
ok(DEP.length >= 17, `deployable nel database: ${DEP.length}`);
const SENZA_ARMA_VOLUTO = ['dazer', 'deployable_repeater'];
const senzaArma = DEP.filter(d => !d.chiaveArma).map(d => d.id).sort();
const saComparsi = senzaArma.filter(i => SENZA_ARMA_VOLUTO.indexOf(i) < 0);
const saSpariti = SENZA_ARMA_VOLUTO.filter(i => senzaArma.indexOf(i) < 0);
ok(saComparsi.length === 0 && saSpariti.length === 0,
   `senza arma di proposito, e solo loro: ${SENZA_ARMA_VOLUTO.join(', ')}`,
   `comparsi: ${J(saComparsi)} — spariti: ${J(saSpariti)}`);
const scollegati = DEP.filter(d => d.chiaveArma && M.profiloArma(d.chiaveArma).nonTrovata)
    .map(d => d.id + ' -> ' + d.chiaveArma);
ok(scollegati.length === 0,
   `nessun deployable che punta a un'arma inesistente (${scollegati.length})`,
   `scollegati: ${J(scollegati)} — il token nascerebbe senza profilo d'arma`);


rigaFinale(PROVE_ATTESE);
process.exit(falliti ? 1 : 0);

// @versione 2026-10-10.1 | test_bottone_arma.js | proprieta`: chat TEST
// 2026-10-10.1: motore 2026-10-09.6, il box-sizing:border-box della banda bassa
//    lo dichiara M.formaBottone. L ultima prova della sezione 4 diceva che la
//    riga dell unita` lo AGGIUNGE in coda: era la regola di prima, e col motore
//    nuovo restava verde per il motivo sbagliato (la stringa c e` comunque).
//    Sostituita da due: la banda bassa lo dichiara, una volta sola, nella forma
//    nuda e nel bottone dell arma vero. E` l altra meta` delle due prove di
//    INTERFACCIA in test_elenchi_e_tabellone.js sezione 17. Da 98 a 99 prove.
// .2 (9 ott, sera): il roster di collaudo passa da 40 a 43 righe. Il numero
//    NON si inchioda qui: lo controlla test_piano_schieramento.js.
// ============================================================================
//  IL BOTTONE DELL'ARMA E LA FORMA CHE LO DISEGNA — node test_bottone_arma.js
//  ---------------------------------------------------------------------------
//  Richiesto dalla chat MOTORE il 9 ottobre pomeriggio: col motore
//  2026-10-09.4 nascono M.formaBottone e M.bottoneArma, e sono scoperte. Sei
//  moduli d'ordine e la riga dell'unita` di INTERFACCIA passano da qui, quindi
//  un difetto in queste due funzioni si vede in tutta l'app.
//
//  COSA PROVA
//   1  formaBottone: la forma (due bande, ottagono a 15, tre pieghe) e i default
//   2  i parametri di chi chiama — e lo ZERO e` un valore, non un'assenza
//   3  una misura non numerica torna al default
//   4  gli stili di chi chiama si AGGIUNGONO in coda, non sostituiscono
//   5  UNA SORGENTE SOLA: bottoneArma passa davvero da formaBottone
//   6  armi contro programmi: contorno grigio o azzurro, immagine o icona
//   7  l'immagine dell'arma: una per TIPO (prefissi di munizione tolti)
//   8  l'elenco scritto da Paolo e la funzione del motore dicono la stessa cosa
//   9  le truppe schierate dal piano: nessun bottone resta senza immagine
//  10  le celle della gittata riespandono nelle bande dell'arma
//  11  due modalita` della stessa arma si distinguono a schermo
//
//  NON PROVA: l'aspetto vero nel browser (altezze, colori a vista, se il file
//  png esiste). Qui si guarda l'HTML prodotto, che e` tutto cio` che il motore
//  decide; il resto lo vede Paolo al tavolo.
// ============================================================================
global.window = global;
const fs = require('fs');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
// Una sezione che cade non si porta via le altre: conta come fallita e dice dove.
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ❌ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}

require(DIR + 'catalogo_n5.js');
require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js');
require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');
const CAT = window.CATALOGO_N5;

// Il testo che il giocatore LEGGE sul bottone: via i tag, via gli spazi
// vuoti. Serve in due sezioni, e scriverlo due volte vorrebbe dire due
// letture diverse della stessa cosa.
const visibile = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// Le quattro misure della forma, lette dall'HTML.
const misure = (h) => {
    const a = /min-height:66px; padding:10px (-?\d+)px 34px (-?\d+)px/.exec(h) || [];
    const m = /margin-right:(-?\d+)px; min-height:66px/.exec(h) || [];
    const b = /margin:-28px 0 0 (-?\d+)px/.exec(h) || [];
    return { spazioDestra: a[1], spazioSinistra: a[2], margineDestro: m[1], rientroBassa: b[1] };
};

// ---------------------------------------------------------------------------
sezione('0. Le due funzioni sono nel contratto', () => {
    ok(typeof M.formaBottone === 'function', 'M.formaBottone c e');
    ok(typeof M.bottoneArma === 'function', 'M.bottoneArma c e');
    ok(typeof M.gittateRaggruppate === 'function', 'M.gittateRaggruppate c e');
    ok(typeof M.nomeImmagineArma === 'function', 'M.nomeImmagineArma c e');
    ok(M.autotest().join() === 'contratto coerente', 'e il contratto resta coerente');
});

// ---------------------------------------------------------------------------
sezione('1. formaBottone: la forma, e i default quando non si chiede niente', () => {
    const h = M.formaBottone({});
    ok(/^\s*<button type="button"/.test(h) && /<\/button>\s*$/.test(h), 'e` UN <button>, aperto e chiuso');
    ok(/class="bottone-forma"/.test(h), 'senza classe e` "bottone-forma"');
    // L'ottagono: gli angoli a 15 px. E` la forma che Paolo ha approvato, e la
    // riga dell'unita` di INTERFACCIA la confronta con questa.
    ok(/clip-path:polygon\(15px 0,calc\(100% - 15px\) 0,100% 15px,100% calc\(100% - 15px\),calc\(100% - 15px\) 100%,15px 100%,0 calc\(100% - 15px\),0 15px\)/.test(h),
       'la banda alta e` un ottagono con gli angoli a 15px');
    const pieghe = (h.match(/width:15px; height:15px; background:[^;]*; clip-path:polygon/g) || []).length;
    ok(pieghe === 3, `tre pieghe negli angoli, non due e non quattro (${pieghe})`);
    ok(/margin:-28px 0 0 72px/.test(h), 'la banda bassa risale di 28px e rientra di 72px');
    ok(/border-radius:0 8px 8px 8px/.test(h), 'e ha gli angoli 0 8 8 8: quadro dove incontra l altra');
    // I colori di partenza: li legge chi NON li passa.
    ok(/border:1px solid #b4b8bf/.test(h), 'contorno di partenza grigio chiaro #b4b8bf');
    ok(/background:#2a2d33; border:1px solid/.test(h), 'banda alta grigio scuro #2a2d33');
    ok(/margin:-28px[^"]*background:#fff;/.test(h), 'banda bassa bianca');
    const d = misure(h);
    ok(J(d) === J({ spazioDestra: '16', spazioSinistra: '92', margineDestro: '20', rientroBassa: '72' }),
       `le quattro misure di partenza: 92 a sinistra, 16 a destra, 20 di margine, 72 di rientro (${J(d)})`);
    // Il contorno vale per TUTTO: bordo delle due bande e pieghe. Se le pieghe
    // prendessero un colore loro, un contorno arancio lascerebbe tre angoli grigi.
    const colorato = M.formaBottone({ contorno: '#ff9900' });
    const quanti = (colorato.match(/#ff9900/g) || []).length;
    ok(quanti === 5, `un contorno passato colora bordi e pieghe, cinque punti in tutto (${quanti})`);
    ok(!/#b4b8bf/.test(colorato), 'e del grigio di partenza non resta niente');
});

// ---------------------------------------------------------------------------
sezione('2. I parametri di chi chiama — e lo ZERO e` un valore, non un assenza', () => {
    const h = M.formaBottone({ classe: 'mia-classe', fondoAlta: '#111', fondoBassa: '#222',
                               alta: '<i>ALTA</i>', bassa: '<i>BASSA</i>', sopra: '<i>SOPRA</i>',
                               attributi: 'onclick="window.prova()" data-x="1"' });
    ok(/class="mia-classe"/.test(h), 'la classe passata sostituisce quella di partenza');
    ok(/background:#111; border:1px solid/.test(h) && /margin:-28px[^"]*background:#222;/.test(h), 'i due fondi passati arrivano');
    ok(/onclick="window\.prova\(\)" data-x="1"/.test(h), 'gli attributi passati finiscono nel tag');
    // Il contenuto nel suo posto: alta dentro la banda alta, bassa nella bassa,
    // sopra FUORI dalle bande (e` in posizione assoluta sul bottone).
    const bandaAlta = (/<div style="position:relative; margin-right[\s\S]*?<\/div>/.exec(h) || [''])[0];
    ok(bandaAlta.indexOf('<i>ALTA</i>') >= 0, 'cio` che e` per la banda alta sta nella banda alta');
    ok(/margin:-28px[^>]*>[\s\S]*<i>BASSA<\/i>/.test(h), 'e cio` che e` per la bassa nella bassa');
    ok(h.indexOf('<i>SOPRA</i>') < h.indexOf('position:relative; margin-right'), '"sopra" e` posato PRIMA delle bande, cosi` ci sta sopra');

    // 🔴 LO ZERO. `num(v, d)` accetta il valore se e` un numero finito, quindi
    // uno zero PASSA e non diventa il default. E` la stessa distinzione di
    // "assente non e` vuoto ne` falso", che in questo progetto e` costata tre
    // difetti: un bottone senza immagine chiede spazioSinistra 0, e se lo zero
    // diventasse 92 resterebbero 92 px di buco a sinistra del nome.
    const zero = misure(M.formaBottone({ spazioSinistra: 0, spazioDestra: 0, margineDestro: 0, rientroBassa: 0 }));
    ok(J(zero) === J({ spazioDestra: '0', spazioSinistra: '0', margineDestro: '0', rientroBassa: '0' }),
       `tutte e quattro a ZERO restano zero, non tornano al default (${J(zero)})`);
    // Una per una, perche` insieme uno zero sbagliato si nasconde dietro gli altri.
    [['spazioSinistra', 92], ['spazioDestra', 16], ['margineDestro', 20], ['rientroBassa', 72]].forEach(([k, def]) => {
        const una = misure(M.formaBottone({ [k]: 0 }));
        ok(una[k] === '0', `${k}: lo zero passa da solo (letto ${una[k]}, il default sarebbe ${def})`);
    });
});

// ---------------------------------------------------------------------------
sezione('3. Una misura non numerica torna al default, e non finisce nello stile', () => {
    // Quattro modi di NON essere un numero: una stringa, null, NaN, Infinity.
    // Infinity e NaN sono i due che passerebbero un "typeof v === number".
    [['una stringa', 'abc'], ['null', null], ['NaN', NaN], ['Infinity', Infinity], ['undefined', undefined]]
      .forEach(([come, v]) => {
        const d = misure(M.formaBottone({ spazioSinistra: v, spazioDestra: v, margineDestro: v, rientroBassa: v }));
        ok(J(d) === J({ spazioDestra: '16', spazioSinistra: '92', margineDestro: '20', rientroBassa: '72' }),
           `${come}: tutte e quattro tornano al default (${J(d)})`);
      });
    // E il valore sporco non deve comparire nell'HTML: "padding:10px abcpx"
    // sarebbe CSS non valido, e il browser butterebbe la riga INTERA — cioe`
    // anche gli altri valori buoni accanto.
    const sporco = M.formaBottone({ spazioSinistra: 'abc', spazioDestra: 'NaN' });
    ok(!/abcpx|NaNpx|undefinedpx|Infinitypx|nullpx/.test(sporco),
       'e il valore non numerico non finisce nell HTML come misura');
    // 📋 MISURATO, NON UN DIFETTO: un numero NEGATIVO passa, perche` `num`
    // guarda se e` un numero finito e non il segno. Un margine negativo e` CSS
    // legittimo (la banda bassa ne usa uno), quindi non si corregge: si
    // scrive qui, perche` chi legge sappia che il guardiano e` sui NON-numeri.
    ok(misure(M.formaBottone({ spazioSinistra: -5 })).spazioSinistra === '-5',
       'un negativo invece passa: il guardiano e` sui non-numeri, non sul segno (misurato, non un difetto)');
});

// ---------------------------------------------------------------------------
sezione('4. Gli stili di chi chiama si AGGIUNGONO in coda', () => {
    const h = M.formaBottone({ stile: 'opacity:.5;', stileAlta: 'z-index:9;', stileBassa: 'min-height:30px;' });
    // In coda e NON al posto: se sostituissero, la forma spariva. Si pretende
    // che ci sia ANCORA il pezzo di forma e POI l'aggiunta.
    ok(/font-family:'Teko',sans-serif; opacity:\.5;"/.test(h), 'stile: dopo quello del bottone, non al suo posto');
    ok(/0 15px\); z-index:9;"/.test(h), 'stileAlta: dopo il clip-path della banda alta');
    ok(/rgba\(0,0,0,\.4\); min-height:30px;"/.test(h), 'stileBassa: dopo l ombra della banda bassa');
    // Senza stili non deve restare uno spazio o un punto e virgola a vuoto.
    const nudo = M.formaBottone({});
    ok(/font-family:'Teko',sans-serif;"/.test(nudo), 'e senza stili la coda non lascia spazi a vuoto');
    // IL BOX-SIZING DELLA BANDA BASSA (motore 2026-10-09.6). Senza, l altezza
    // minima non conta lo spazio interno: INTERFACCIA ha misurato in Chromium
    // la banda del soprannome alta 44 invece di 30. Fino al motore .09.5 lo
    // aggiungeva chi chiamava, in coda; ora lo dichiara la forma. Si guarda lo
    // stile della SOLA banda bassa: nel bottone intero la stringa c e` anche
    // sulla banda alta, e cercarla ovunque non proverebbe niente.
    const stileBassaDi = (html) => (/<div style="(position:relative; margin:-28px[^"]*)"/.exec(html) || [])[1] || '';
    const quanti = (t) => (t.match(/box-sizing:border-box/g) || []).length;
    const bNuda = stileBassaDi(nudo), bArma = stileBassaDi(M.bottoneArma(M.profiloArma('Combi Rifle'), {}));
    ok(bNuda.length > 0 && quanti(bNuda) === 1,
       `la banda bassa della forma dichiara box-sizing:border-box, una volta sola (${quanti(bNuda)})`,
       `stile della banda bassa: ${bNuda.slice(0, 120)}`);
    ok(bArma.length > 0 && quanti(bArma) === 1 && quanti(stileBassaDi(h)) === 1,
       `e cosi anche nel bottone dell arma vero, e quando chi chiama aggiunge la sua coda (${quanti(bArma)} / ${quanti(stileBassaDi(h))})`,
       `stile della banda bassa del Combi Rifle: ${bArma.slice(0, 120)}`);
});

// ---------------------------------------------------------------------------
sezione('5. UNA SORGENTE SOLA: bottoneArma passa davvero da formaBottone', () => {
    // 🔴 La ragione per cui M.formaBottone esiste (motore 2026-10-09.4): prima
    // la forma era scritta DUE volte, qui e nella riga dell'unita` di
    // INTERFACCIA. Confrontare i due HTML non basta: due copie identiche
    // passerebbero. Si guarda il PASSAGGIO, con una spia al posto della
    // funzione: se qualcuno riscrive la forma dentro bottoneArma, la spia non
    // scatta e questa prova lo dice.
    const vero = M.formaBottone;
    let viste = [];
    M.formaBottone = function (o) { viste.push(o); return vero.call(M, o); };
    let uscita;
    try { uscita = M.bottoneArma(M.profiloArma('Combi Rifle'), { attributi: 'onclick="x()"' }); }
    finally { M.formaBottone = vero; }
    ok(viste.length === 1, `bottoneArma chiama formaBottone, una volta sola (${viste.length})`);
    const o = viste[0] || {};
    ok(o.classe === 'bottone-arma', `e le chiede la classe "bottone-arma" (${J(o.classe)})`);
    ok(o.contorno === CAT.CONTORNO_BOTTONI.ARMA, `col contorno delle armi dal catalogo (${J(o.contorno)})`);
    ok(o.attributi === 'onclick="x()"', 'e le passa gli attributi di chi ha chiamato lei');
    ok(typeof o.alta === 'string' && /Combi Rifle/.test(o.alta), 'il nome glielo da` come contenuto della banda alta');
    ok(typeof o.bassa === 'string' && o.bassa.length > 0, 'e le gittate come contenuto della bassa');
    // E l'uscita e` davvero quella della forma, non un pezzo cucito dopo.
    ok(uscita === vero.call(M, o), 'l HTML che torna e` esattamente quello di formaBottone');
});

// ---------------------------------------------------------------------------
sezione('6. Armi contro programmi: contorno e immagine', () => {
    const CB = CAT.CONTORNO_BOTTONI;
    const contorno = (h) => (/border:1px solid ([^;]*);/.exec(h) || [])[1];
    const immagine = (h) => (/<img src="([^"]*)"/.exec(h) || [])[1];

    const arma = M.bottoneArma(M.profiloArma('Combi Rifle'), {});
    ok(contorno(arma) === CB.ARMA && CB.ARMA === '#b4b8bf', `un arma ha il contorno grigio chiaro (${contorno(arma)})`);
    ok(immagine(arma) === 'img/armi/combi_rifle.png', `e l immagine del suo tipo (${immagine(arma)})`);

    // Un programma si riconosce da tipo 'ATTACCO' OPPURE da un effetto senza
    // bande: sono DUE strade, e vanno provate separate — con una sola, la
    // seconda potrebbe non funzionare senza che nessuno se ne accorga.
    const daTipo = M.bottoneArma({ nome: 'X', tipo: 'ATTACCO', effetto: 'ISOLATO', burst: 1 }, {});
    const daEffetto = M.bottoneArma({ nome: 'Y', effetto: 'ISOLATO', burst: 1 }, {});
    ok(contorno(daTipo) === CB.PROGRAMMA && CB.PROGRAMMA === '#00e5ff', `tipo ATTACCO: contorno azzurro fluo (${contorno(daTipo)})`);
    ok(contorno(daEffetto) === CB.PROGRAMMA, `un effetto senza bande: anche lui programma (${contorno(daEffetto)})`);
    // CONTROPROVA: un effetto CON le bande e` un'arma, non un programma.
    const conBande = M.bottoneArma({ nome: 'Z', effetto: 'ISOLATO', burst: 1, bands: [{ mod: 0, label: '0-8"' }] }, {});
    ok(contorno(conBande) === CB.ARMA, `CONTROPROVA: un effetto CON le bande resta un arma (${contorno(conBande)})`);

    // Ogni programma d'attacco del catalogo porta l'icona dello STATO che
    // provoca. Non si scrive qui quale: si legge dal catalogo, o la prova
    // ricopierebbe il dato che deve controllare.
    const H = CAT.HACKING, IE = CAT.ICONE_EFFETTO;
    const senzaIcona = [], sbagliate = [];
    Object.keys(H).forEach(k => {
        const p = H[k]; if (!p.effetto) return;
        const attesa = IE[String(p.effetto).toUpperCase()];
        if (!attesa) { senzaIcona.push(`${k} (effetto ${p.effetto})`); return; }
        const vista = immagine(M.bottoneArma(Object.assign({ nome: k, scelta: k }, p), {}));
        if (vista !== attesa) sbagliate.push(`${k}: il bottone mostra ${J(vista)}, il catalogo dice ${J(attesa)}`);
    });
    ok(senzaIcona.length === 0, `ogni programma con un effetto ha la sua icona a catalogo${senzaIcona.length ? ': SENZA ICONA ' + senzaIcona.join(', ') : ''}`);
    ok(sbagliate.length === 0, 'e il bottone mostra quella giusta, programma per programma', sbagliate.join('\n       '));
    // Trinity non applica uno stato ma una Ferita: e` il caso fuori schema, e
    // Paolo ha chiesto l'icona della ferita. Inchiodato, perche` e` una scelta
    // sua e non si deduce da nessuna regola.
    ok(immagine(M.bottoneArma(Object.assign({ nome: 'TRINITY' }, H.TRINITY), {})) === 'img/icon_wound.png',
       'TRINITY, che infligge una Ferita e non uno stato, porta l icona della ferita');
    // 📋 MISURATO: un effetto che il catalogo non conosce non mette NESSUNA
    // immagine, e il bottone resta senza. Non e` un difetto (l'elenco di
    // Paolo dice "se un file manca, nessuna immagine e nessun errore"), ma e`
    // il motivo per cui la prova qui sopra conta: e` muto.
    ok(immagine(M.bottoneArma({ nome: 'IGNOTO', tipo: 'ATTACCO', effetto: 'NON_ESISTE' }, {})) === undefined,
       'un effetto sconosciuto non mette immagine, in silenzio: per questo si controllano tutti');
    // L'immagine passata da chi chiama vince su tutto.
    ok(immagine(M.bottoneArma(M.profiloArma('Combi Rifle'), { immagine: 'img/mia.png' })) === 'img/mia.png',
       'e un immagine passata da chi chiama vince');
});

// ---------------------------------------------------------------------------
sezione('7. L immagine dell arma: una per TIPO, non per munizione ne` per modalita`', () => {
    // La regola che MOTORE ha scritto: i prefissi di munizione si tolgono, le
    // parentesi si tolgono, "mines" diventa "mine". Casi presi dai database.
    [['Heavy Machine Gun', 'heavy_machine_gun'],
     ['AP Heavy Machine Gun', 'heavy_machine_gun'],
     ['Combi Rifle', 'combi_rifle'],
     ['Breaker Combi Rifle', 'combi_rifle'],
     ['K1 Combi Rifle', 'combi_rifle'],
     ['Viral Sniper Rifle', 'sniper_rifle'],
     ['T2 Sniper Rifle', 'sniper_rifle'],
     ['E/M Grenades', 'grenades'],
     ['Smoke Grenade Launcher', 'grenade_launcher'],
     ['MULTI Sniper Rifle (AP Mode)', 'multi_sniper_rifle'],
     ['Plasma Carbine (Blast Mode)', 'plasma_carbine'],
     ['Shock Mines', 'mine'],
     ['Chest Mines', 'chest_mine'],
     ['PARA Mine', 'mine'],
     ['D-Charges', 'd_charges'],
     ['Trench-Hammer', 'trench_hammer'],
     ['PARA CC Weapon (-3)', 'cc_weapon']
    ].forEach(([n, atteso]) => {
        const v = M.nomeImmagineArma(n);
        ok(v === atteso, `"${n}" -> ${atteso}${v === atteso ? '' : ` (ottenuto ${v})`}`);
    });
    // 🔴 "Monofilament" NON e` un prefisso di munizione: in N5 la Monofilament
    // non e` una munizione ma un'arma con regole proprie (lo dice
    // CATALOGO_N5.MUNIZIONI_RIMOSSE). Se finisse fra i prefissi, l'arma
    // perderebbe il suo nome e prenderebbe l immagine della CC Weapon generica.
    ok(M.nomeImmagineArma('Monofilament CC Weapon') === 'monofilament_cc_weapon',
       'e "Monofilament" resta nel nome: in N5 non e` una munizione');
    ok(M.nomeImmagineArma('') === '' && M.nomeImmagineArma(null) === '' && M.nomeImmagineArma(undefined) === '',
       'un nome vuoto o assente non produce un nome di file inventato');
});

// ---------------------------------------------------------------------------
sezione('8. L elenco scritto da Paolo e la funzione del motore dicono la stessa cosa', () => {
    // 🔴 Questa e` l unica prova del banco in cui i due lati sono INDIPENDENTI:
    // a sinistra un elenco scritto a mano (elenco_immagini_armi.txt, Paolo e
    // MOTORE), a destra la funzione del motore. Tutte le altre leggono il
    // database da entrambi i lati, e quindi provano la fedelta` del disegno,
    // non i dati. Stamattina ho sbagliato proprio questo sulle bande del
    // Combi: il confronto era con se stesso.
    let testo = null;
    try { testo = fs.readFileSync(DIR + 'elenco_immagini_armi.txt', 'utf8'); }
    catch (e) { testo = null; }
    if (testo === null) {
        // Non si muore: si dice. Un banco che muore non lascia la riga di
        // riepilogo, e la misura della suite perde un file in silenzio.
        ok(false, 'elenco_immagini_armi.txt si legge nella cartella',
           `non trovato in ${DIR}: questa sezione non ha potuto controllare niente.`);
        return;
    }
    const righe = testo.split('\n')
        .map(r => /^img\/armi\/(\S+)\.png\s+<-\s+(.+)$/.exec(r.trim()))
        .filter(Boolean)
        .map(m => ({ file: m[1], armi: m[2].split(',').map(s => s.trim()).filter(Boolean) }));
    const quanteArmi = righe.reduce((s, r) => s + r.armi.length, 0);
    ok(righe.length > 60 && quanteArmi > 90,
       `l elenco si legge: ${righe.length} file d immagine per ${quanteArmi} nomi d arma`);
    const fuori = [];
    righe.forEach(r => r.armi.forEach(a => {
        const n = M.nomeImmagineArma(a);
        if (n !== r.file) fuori.push(`"${a}": il motore dice ${n}.png, l elenco dice ${r.file}.png`);
    }));
    ok(fuori.length === 0,
       `e per tutti e ${quanteArmi} il motore produce il nome di file che l elenco dichiara`,
       fuori.join('\n       '));
});

// ---------------------------------------------------------------------------
sezione('9. Le truppe schierate dal piano: nessun bottone resta senza immagine', () => {
    // Un file d'immagine che manca non da` errore: il bottone resta senza, in
    // silenzio (onerror lo nasconde). Al tavolo si vedrebbe come un buco, e
    // nessuno saprebbe se e` l immagine o il bottone. Qui si controlla che
    // ogni arma delle truppe del piano chieda un file che l elenco
    // dichiara — l unico controllo possibile senza guardare la cartella img.
    let noti = null;
    try {
        noti = new Set(fs.readFileSync(DIR + 'elenco_immagini_armi.txt', 'utf8').split('\n')
            .map(r => (/^img\/armi\/(\S+)\.png/.exec(r.trim()) || [])[1]).filter(Boolean));
    } catch (e) { noti = null; }
    let piano = null;
    try { piano = fs.readFileSync(DIR + 'PIANO_COLLAUDO_N5.md', 'utf8'); } catch (e) { piano = null; }
    if (!noti || !piano) {
        ok(false, 'l elenco delle immagini e il piano si leggono nella cartella',
           `mancante: ${!noti ? 'elenco_immagini_armi.txt ' : ''}${!piano ? 'PIANO_COLLAUDO_N5.md' : ''} — sezione non eseguita.`);
        return;
    }
    // Le 40 righe di schieramento, lette dal piano come fa test_piano_schieramento.js.
    const DB = { NOMADI: window.DB_NOMADI || [], PANOCEANIA: window.DB_PANOCEANIA || [] };
    let faz = null; const voci = [];
    piano.split('\n').forEach(r => {
        const t = r.trim();
        if (/^\*\*Nomadi\*\*/.test(t)) { faz = 'NOMADI'; return; }
        if (/^\*\*PanOceania\*\*/.test(t)) { faz = 'PANOCEANIA'; return; }
        if (/^#{1,3}\s/.test(t)) { faz = null; return; }
        const m = t.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|/);
        if (faz && m) voci.push({ faz, nome: m[2].replace(/\*\*/g, '').replace(/`/g, '').trim() });
    });
    // 🔴 Il numero NON si inchioda qui. Il roster cresce (40 -> 43 il 9 ottobre
    // sera) e quanti siano lo controlla test_piano_schieramento.js, che e` il
    // suo banco. Inchiodarlo anche qui vorrebbe dire due posti da aggiornare a
    // ogni aggiunta, e il secondo si dimentica. Qui serve solo che la lettura
    // funzioni: se la tabella cambiasse formato si leggerebbero ZERO righe e
    // tutta la sezione passerebbe a vuoto.
    ok(voci.length >= 40, `le righe di schieramento del piano si leggono: ${voci.length} (almeno 40)`);
    const nonRisolte = [], senzaImmagine = {};
    let armiViste = 0;
    voci.forEach(v => {
        const u = DB[v.faz].find(x => x.nome === v.nome);
        if (!u) { nonRisolte.push(`[${v.faz}] ${v.nome}`); return; }
        M.dividiLista(u.weapon).forEach(g => {
            let varianti = M.variantiArma(g);
            if (!varianti.length) { const p = M.profiloArma(g); if (!p.nonTrovata) varianti = [p]; }
            varianti.forEach(p => {
                if (p.isCC) return;                       // le armi CC hanno la loro immagine come le altre, ma passano da qui
                armiViste++;
                const n = M.nomeImmagineArma(p.nome);
                if (!noti.has(n)) (senzaImmagine[n] = senzaImmagine[n] || new Set()).add(p.nome);
            });
        });
    });
    ok(nonRisolte.length === 0,
       'ogni truppa schierata dal piano si trova nel suo database',
       nonRisolte.join('\n       ') + '\n       (se e` cambiata una voce del piano, aggiornare anche qui)');
    ok(armiViste > 50, `armi risolte dalle truppe schierate: ${armiViste}`);
    const buchi = Object.keys(senzaImmagine).sort();
    ok(buchi.length === 0,
       `e nessuna chiede un immagine che l elenco non dichiara (${armiViste} armi)`,
       buchi.map(k => `${k}.png non e` + `  nell elenco  <- ${[...senzaImmagine[k]].join(', ')}`).join('\n       '));
});

// ---------------------------------------------------------------------------
sezione('10. Le celle della gittata riespandono nelle bande dell arma', () => {
    // Le celle raggruppano le bande dove il MOD non cambia: sei bande del
    // Combi diventano tre celle (16" +3, 32" -3, 48" -6). Riespanderle e
    // confrontarle col profilo prova la FEDELTA` del raggruppamento — non i
    // valori, che vengono dallo stesso database (vedi la nota in sezione 8).
    const celle = (h) => [...String(h).matchAll(/font-size:11px; padding:1px 0;">(\d+)"<\/span><span style="font-size:17px[^"]*">([+-]?\d+)</g)]
        .map(x => ({ fino: Number(x[1]), mod: Number(x[2]) }));
    const riespandi = (cs) => { const b = []; let da = 0; cs.forEach(c => { for (; da < c.fino; da += 8) b.push({ mod: c.mod, label: `${da}-${da + 8}"` }); }); return b; };
    const dire = (x) => `${x.mod > 0 ? '+' : ''}${x.mod} a ${x.label}`;

    // Tre armi con tre forme diverse di raggruppamento: coppie uguali (Combi),
    // un MOD solo in mezzo (HMG, dove lo 0 NON va unito al -3), due bande sole.
    ['Combi Rifle', 'Heavy Machine Gun', 'Grenades', 'MULTI Sniper Rifle (AP Mode)'].forEach(nome => {
        const p = M.profiloArma(nome);
        const lette = riespandi(celle(M.bottoneArma(p, {})));
        const attese = p.bands.map(b => ({ mod: b.mod, label: b.label }));
        const fuori = [];
        for (let i = 0; i < Math.max(lette.length, attese.length); i++) {
            const x = lette[i], y = attese[i];
            if (!x) fuori.push(`banda ${i + 1} SPARITA dal bottone (il profilo: ${dire(y)})`);
            else if (!y) fuori.push(`banda ${i + 1} IN PIU sul bottone (${dire(x)})`);
            else if (x.mod !== y.mod || x.label !== y.label) fuori.push(`banda ${i + 1}: il bottone dice ${dire(x)}, il profilo ${dire(y)}`);
        }
        ok(lette.length > 0 && fuori.length === 0,
           `${nome}: le ${celle(M.bottoneArma(p, {})).length} celle riespandono nelle ${attese.length} bande del profilo`,
           lette.length === 0
             ? 'NESSUNA CELLA LETTA: questa prova non sta guardando niente. Il motore ha cambiato il disegno?'
             : fuori.join('\n       '));
    });
    // 🔴 Lo ZERO non si unisce al -3: sono due MOD diversi. L HMG ha
    // -3 / 0 / +3 +3 / -3 -3, cioe` QUATTRO celle, non tre.
    const hmg = celle(M.bottoneArma(M.profiloArma('Heavy Machine Gun'), {}));
    ok(hmg.length === 4 && J(hmg.map(c => c.mod)) === J([-3, 0, 3, -3]),
       `HMG: quattro celle, e lo 0 resta una cella sua (${J(hmg.map(c => c.mod))})`);
    // Un arma a Sagoma Diretta non ha bande: al loro posto la scritta.
    const fiamma = M.bottoneArma(M.profiloArma('Light Flamethrower'), {});
    ok(/SAGOMA DIRETTA/.test(visibile(fiamma)) && celle(fiamma).length === 0,
       'una Sagoma Diretta non mostra celle ma la scritta SAGOMA DIRETTA');
    // Una Sagoma Circolare a Impatto ha le bande E la scritta: serve il tiro.
    const plasma = M.bottoneArma(M.profiloArma('Plasma Carbine (Blast Mode)'), {});
    ok(celle(plasma).length > 0 && /\+ SAGOMA CIRCOLARE/.test(visibile(plasma)),
       'una Sagoma a Impatto mostra le celle E "+ SAGOMA CIRCOLARE": il tiro serve lo stesso');
    // Un arma da Corpo a Corpo: la scritta, niente celle.
    ok(/CORPO A CORPO/.test(visibile(M.bottoneArma(M.profiloArma('Monofilament CC Weapon'), {}))),
       'un arma da Corpo a Corpo lo dice, al posto delle gittate');
    // `sotto` passato da chi chiama vince su tutto: e` cosi` che i programmi
    // scrivono Burst e Tiro Salvezza.
    ok(/B2 · PS 7/.test(visibile(M.bottoneArma(M.profiloArma('Combi Rifle'), { sotto: 'B2 · PS 7' }))),
       'e un "sotto" passato da chi chiama prende il posto delle gittate');
});

// ---------------------------------------------------------------------------
sezione('11. Due modalita` della stessa arma si distinguono a schermo', () => {
    // 🔴 PERCHE` QUESTA PROVA. La banda alta mostra il nome SENZA parentesi
    // (decisione di Paolo, 9 ottobre): "MULTI Sniper Rifle (AP Mode)" si legge
    // "MULTI SNIPER RIFLE". Le tre modalita` di un MULTI diventano tre bottoni
    // con lo stesso nome, e se non le distingue nient altro il giocatore
    // scegliere a caso fra armi che si comportano in modo diverso.
    // Si guarda TUTTO il testo visibile, non i pezzi che mi aspetto: la prima
    // volta che ho misurato questa cosa la mia sonda non leggeva la riga
    // "+ SAGOMA CIRCOLARE" e stavo per segnalare un difetto che non c era.
    const W = window.RULES_WEAPONS || {};
    const contenitori = Object.keys(W).filter(k => Array.isArray(W[k].modalita));
    ok(contenitori.length > 20, `armi con piu` + ` di una modalita` + ` nel database: ${contenitori.length}`);
    const ambigue = [];
    contenitori.forEach(fam => {
        const v = M.variantiArma(fam);
        if (v.length < 2) return;
        const viste = {};
        v.forEach(p => { const t = visibile(M.bottoneArma(p, {})); (viste[t] = viste[t] || []).push(p.nome); });
        Object.entries(viste).filter(([, n]) => n.length > 1)
            .forEach(([t, n]) => ambigue.push({ fam, modi: n, testo: t }));
    });

    // 🔴 DIFETTO APERTO, SEGNALATO A MOTORE IL 9 OTTOBRE POMERIGGIO.
    // Le due varianti del Deployable Cover producono lo STESSO bottone, e la
    // differenza conta: da un Cutting Foam il nemico NON puo` reclamare
    // Copertura, da un Vitroferro si` (lo dice app.html in sceltaCopertura, e
    // il motore scrive varianteCopertura sul gettone). Il giocatore che sceglie
    // quale piazzare non ha modo di distinguerle.
    // L'elenco e` NOMINATO e il confronto va nei DUE versi: una famiglia nuova
    // che diventa ambigua si vede, e il giorno che MOTORE corregge questa la
    // prova diventa rossa e dice di togliere la voce. Un semplice conteggio
    // ("le ambigue sono 1") sarebbe rimasto verde sostituendo un difetto con
    // un altro.
    const ATTESE = ['Deployable Cover'];
    const nomi = ambigue.map(a => a.fam).sort();
    const comparse = nomi.filter(f => ATTESE.indexOf(f) < 0);
    const sparite = ATTESE.filter(f => nomi.indexOf(f) < 0);
    ok(comparse.length === 0,
       `nessuna NUOVA arma con due modalita` + ` indistinguibili a schermo (ambigue: ${nomi.length})`,
       comparse.map(f => {
           const a = ambigue.find(x => x.fam === f);
           return `COMPARSA ${f}: ${a.modi.join('  =  ')}   -> "${a.testo}"`;
       }).join('\n       '));
    ok(sparite.length === 0,
       `e il difetto aperto del Deployable Cover e` + ` ancora li` + ` (se e` + ` stato corretto va togliato da ATTESE)`,
       sparite.map(f => `SPARITA ${f}: non e` + ` piu` + ` ambigua — correzione arrivata, aggiorna questa prova`).join('\n       '));

    // Le famiglie che VANNO distinte lo sono, e si dice DA COSA: la munizione
    // per i MULTI, la scritta della Sagoma per Plasma e Missile. Se domani la
    // munizione sparisse dalla banda alta, queste tre righe lo direbbero.
    [['MULTI Sniper Rifle', 3], ['MULTI Rifle', 3], ['Plasma Carbine', 2], ['Missile Launcher', 2]].forEach(([fam, quante]) => {
        const v = M.variantiArma(fam);
        const testi = v.map(p => visibile(M.bottoneArma(p, {})));
        const unici = new Set(testi).size;
        ok(v.length === quante && unici === quante,
           `${fam}: ${quante} modalita` + `, ${quante} bottoni diversi a schermo (${unici} testi distinti su ${v.length})`,
           testi.map((t, i) => `${v[i].nome} -> "${t}"`).join('\n       '));
    });
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

// @versione 2026-10-08.1 | test_sagoma_alleati.js | proprieta`: chat TEST
// ============================================================================
//  LA SAGOMA E I TUOI ALLEATI — node test_sagoma_alleati.js
//
//  Nasce l'8 ottobre dal terzo giro di MOTORE (motore dalla .08.3 alla .08.9).
//  Quattro cose nuove del motore, misurate finora solo da sonde:
//    M.sagomaInnocua(arma)
//    M.esitoSagomaAlleati(arma, statoD, ctx) -> { applica, annullato, nota }
//    M.domandaAlleatiInMischia(bersaglio, indice, comando[, arma])
//    M.impostaAlleatiInMischia(bersaglio, n)
//
//  IL FATTO CHE CAMBIA TUTTO: con un'arma a Sagoma la domanda del
//  regolamento non e` "quanti tuoi alleati nella mischia di questo
//  bersaglio" ma "un tuo alleato sarebbe colpito dalla Sagoma?" — che vale
//  anche FUORI dalla mischia. Due domande diverse, due campi diversi:
//    alleatiInMischia    numero, arma SENZA Sagoma, solo se Ingaggiato
//    alleatoNellaSagoma  booleano, arma A SAGOMA, sempre
//
//  LE TRE COSE CHE QUESTO BANCO GUARDA PIU` DA VICINO
//
//  1. ASSENTE NON E` FALSO, per la terza volta in questo progetto.
//     ctx.alleatoNellaSagoma ha TRE stati: true (annullato), false
//     (valido), e ASSENTE (busta vecchia: vale la lettura di prima, la
//     mischia del bersaglio). Una funzione che leggesse `!ctx.alleato...`
//     confonderebbe il NO con il non-chiesto, e una busta vecchia su una
//     mischia passerebbe come colpo valido.
//
//  2. LE TRE COPPIE CHE SI ESCLUDONO, che MOTORE chiede di provare
//     INSIEME: SI` e NO sullo stesso colpo unico, Fumo e domanda, Sagoma e
//     il -6 della mischia. Provate separatamente passerebbero entrambe le
//     meta`; provate insieme si vede che non possono convivere.
//
//  3. LA DOMANDA DEL COLPO UNICO. In Speculativo, Guidato e Intuitivo il
//     Burst e` sempre 1: un colpo, una domanda, sul Principale. La
//     risposta del Principale vale per ogni bersaglio. Senza questo, un
//     secondario Ingaggiato partiva da SI` e annullava tutto (misura di
//     INTERFACCIA).
//
//  NON PROVA: l'aspetto dei tasti nel browser. Qui si guarda l'HTML
//  prodotto e i campi scritti sul bersaglio.
//
//  USO:  node test_sagoma_alleati.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
global.window = global;
require(DIR + 'catalogo_n5.js');
require(DIR + 'database_comune.js');
require(DIR + 'motore_regole_n5.js');
const M = window.MotoreN5;

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d) {
    if (c) { passati++; console.log('  ✅ ' + d); }
    else { falliti++; console.log('  ❌ ' + d); }
}
// Una sezione che cade non si porta via le altre, e non muore muta:
// l'eccezione diventa una prova rossa che la nomina.
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); }
    catch (e) {
        falliti++;
        console.log('  ❌ la sezione e` caduta: ' + e.message + ' — ' +
                    ((e.stack || '').split('\n')[1] || '').trim());
    }
}
const nfc = (x) => String(x == null ? '' : x).normalize('NFC');

const ML = M.profiloArma('Missile Launcher (Blast Mode)');   // Sagoma che fa male
const FUMO = M.profiloArma('Smoke Grenades');                 // Sagoma innocua
const ECLIPSE = M.profiloArma('Eclipse Grenades');
const HMG = M.profiloArma('Heavy Machine Gun');               // niente Sagoma
const LANCIA = M.profiloArma('Light Flamethrower(+1B)');      // Sagoma Diretta

const ingaggiato = { engaged: true };
const libero = { engaged: false };

// ---------------------------------------------------------------------------
sezione('1. M.sagomaInnocua: solo il Fumo e l Eclipse', () => {
    ok(M.sagomaInnocua(FUMO) === true, `il Fumo e` + ` una Sagoma innocua (${M.sagomaInnocua(FUMO)})`);
    ok(M.sagomaInnocua(ECLIPSE) === true, 'e l Eclipse anche');
    ok(M.sagomaInnocua(ML) === false, `il Missile Launcher NO (${M.sagomaInnocua(ML)})`);
    ok(M.sagomaInnocua(LANCIA) === false, 'e nemmeno il Lanciafiamme, che pure e` una Sagoma');
    // Non e` una Sagoma del tutto: false, non un errore.
    ok(M.sagomaInnocua(HMG) === false, `un arma senza Sagoma e` + ` false, non un errore (${M.sagomaInnocua(HMG)})`);
    ok(M.sagomaInnocua(null) === false && M.sagomaInnocua(undefined) === false,
       'e senza arma false, senza cadere');
    // Accetta anche il NOME, non solo il profilo: lo dice la prima riga.
    ok(M.sagomaInnocua('Smoke Grenades') === true && M.sagomaInnocua('Heavy Machine Gun') === false,
       'accetta il nome dell arma, non solo il profilo');
    // E il campo da cui legge: regoleTemplate().puoCoinvolgereAlleati.
    ok(M.regoleTemplate(FUMO).puoCoinvolgereAlleati === true &&
       M.regoleTemplate(ML).puoCoinvolgereAlleati === false,
       `legge puoCoinvolgereAlleati dalle regole della Sagoma (Fumo ${M.regoleTemplate(FUMO).puoCoinvolgereAlleati}, ML ${M.regoleTemplate(ML).puoCoinvolgereAlleati})`);
    // E il Fumo non si annulla mai: lo dice l altro campo.
    ok(M.regoleTemplate(FUMO).colpoAnnullatoSeAlleatiInArea === false &&
       M.regoleTemplate(ML).colpoAnnullatoSeAlleatiInArea === true,
       `e il Fumo non si annulla per gli alleati nell area (${M.regoleTemplate(FUMO).colpoAnnullatoSeAlleatiInArea})`);
});

sezione('2. M.esitoSagomaAlleati: SI`, NO, e il terzo stato', () => {
    const si = M.esitoSagomaAlleati(ML, ingaggiato, { alleatoNellaSagoma: true });
    ok(si.applica === true && si.annullato === true,
       `SI` + `: il colpo e` + ` annullato (applica ${si.applica}, annullato ${si.annullato})`);
    const no = M.esitoSagomaAlleati(ML, ingaggiato, { alleatoNellaSagoma: false });
    ok(no.applica === true && no.annullato === false,
       `NO: il colpo vale, anche col bersaglio Ingaggiato (annullato ${no.annullato})`);
    ok(/nessun tuo alleato/i.test(nfc(no.nota)),
       `e la nota lo dice (${nfc(no.nota).slice(0, 56)})`);

    // 🔴 IL TERZO STATO. Assente non e` false: con la busta vecchia vale la
    // lettura di prima — il bersaglio in mischia, con almeno un alleato.
    const assenteMischia = M.esitoSagomaAlleati(ML, ingaggiato, {});
    ok(assenteMischia.annullato === true,
       `ASSENTE su una mischia: vale la lettura di prima, annullato (${assenteMischia.annullato})`);
    ok(assenteMischia.annullato !== no.annullato,
       'e ASSENTE non da` lo stesso esito di NO: sono tre stati, non due');
    const assenteFuori = M.esitoSagomaAlleati(ML, libero, {});
    ok(assenteFuori.annullato === false && assenteFuori.nota === null,
       `ASSENTE fuori dalla mischia: il colpo vale e non c e` + ` nota (${J(assenteFuori.nota)})`);
    // alleatiInMischia 0 con la risposta assente: nessun alleato, vale.
    const assenteZero = M.esitoSagomaAlleati(ML, ingaggiato, { alleatiInMischia: 0 });
    ok(assenteZero.annullato === false,
       `ASSENTE con alleatiInMischia 0: nessun alleato, il colpo vale (${assenteZero.annullato})`);
    ok(/nessun TUO alleato/.test(nfc(assenteZero.nota)),
       `e la nota lo spiega (${nfc(assenteZero.nota).slice(0, 50)})`);

    // Un arma SENZA Sagoma: applica false. Li` vale il -6 della mischia, e
    // questa funzione non c entra.
    const senzaSagoma = M.esitoSagomaAlleati(HMG, ingaggiato, { alleatoNellaSagoma: true });
    ok(senzaSagoma.applica === false && senzaSagoma.annullato === false && senzaSagoma.nota === null,
       `un arma senza Sagoma: applica false, e il SI` + ` non la riguarda (${J(senzaSagoma)})`);
    ok(M.esitoSagomaAlleati(null, ingaggiato, {}).applica === false,
       'e senza arma applica false, senza cadere');
});

sezione('3. Le due scritte del tabellone, dentro e fuori la mischia', () => {
    const inMis = M.esitoSagomaAlleati(ML, ingaggiato, { alleatoNellaSagoma: true });
    const fuori = M.esitoSagomaAlleati(ML, libero, { alleatoNellaSagoma: true });
    ok(/^SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO/.test(nfc(inMis.nota)),
       `in mischia: "SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO" (${nfc(inMis.nota).slice(0, 44)})`);
    ok(/^UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA/.test(nfc(fuori.nota)),
       `fuori: "UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA" (${nfc(fuori.nota).slice(0, 48)})`);
    ok(inMis.nota !== fuori.nota,
       'e le due scritte sono DAVVERO diverse: una sola per due casi sarebbe sbagliata in uno dei due');
    ok(fuori.annullato === true,
       `fuori dalla mischia il colpo si annulla comunque: il SI` + ` del giocatore basta (${fuori.annullato})`);
    // E3: il motore non vede l Impersonation sotto la Sagoma, lo dichiara il
    // giocatore. La nota deve nominarlo, o il giocatore non sa che il SI`
    // vale anche per quello.
    ok(/Marker Impersonation/i.test(nfc(fuori.nota)),
       'e la nota nomina il Marker Impersonation: il motore non lo vede, lo dichiara il giocatore');
    ok(/14283-14289/.test(nfc(fuori.nota)),
       'con la riga di regolamento (14283-14289)');
    // Le due note dicono entrambe le due cose che restano vere comunque.
    [['in mischia', inMis], ['fuori', fuori]].forEach(([dove, e]) => {
        ok(/ARO restano/.test(nfc(e.nota)) && /Disposable/.test(nfc(e.nota)),
           `${dove}: la nota dice che gli ARO restano e l uso Disposable si consuma`);
    });
});

sezione('4. Fumo ed Eclipse: non si annullano mai, e niente -6', () => {
    [['Fumo', FUMO], ['Eclipse', ECLIPSE]].forEach(([nome, arma]) => {
        const mis = M.esitoSagomaAlleati(arma, ingaggiato, {});
        ok(mis.applica === true && mis.annullato === false,
           `${nome} su una mischia: NON si annulla (annullato ${mis.annullato})`);
        ok(/Targetless/.test(nfc(mis.nota)) && /3389/.test(nfc(mis.nota)),
           `${nome}: la nota dice perche` + ` niente -6 — Targetless, riga 3389`);
        // COPPIA CHE SI ESCLUDE: Fumo e il SI` del giocatore. Anche se
        // rispondesse SI`, il Fumo non si annulla. Provata insieme alla
        // riga sopra, perche` separate passerebbero entrambe.
        const conSi = M.esitoSagomaAlleati(arma, ingaggiato, { alleatoNellaSagoma: true });
        ok(conSi.annullato === false,
           `${nome}: anche col SI` + ` del giocatore NON si annulla (${conSi.annullato})`);
        ok(nfc(conSi.nota) === nfc(mis.nota),
           `${nome}: e la nota e` + ` la stessa, il SI` + ` non la cambia`);
    });
    // CONTROPROVA: la stessa forma con una Sagoma che fa male si annulla.
    // Senza, "il Fumo non si annulla" non si distingue da "niente si annulla".
    ok(M.esitoSagomaAlleati(ML, ingaggiato, { alleatoNellaSagoma: true }).annullato === true,
       'CONTROPROVA: la stessa domanda su un Missile Launcher annulla il colpo');
});

sezione('5. La domanda: due campi diversi per due domande diverse', () => {
    const CMD = 'window.rispondiMischia';
    // ARMA SENZA SAGOMA: i tasti 0, 1, 2, "3+", e solo se Ingaggiato.
    M._rosterNemico = [{ id: 'b1', alias: 'Fuciliere', states: { engaged: true } },
                       { id: 'b2', alias: 'Libero', states: {} }];
    window.currentOrder = { weapon: HMG, action: M.AZIONI.BS_ATTACK };
    const bNum = { id: 'b1', name: 'Fuciliere' };
    const hNum = M.domandaAlleatiInMischia(bNum, 0, CMD, HMG);
    ok(/quanti/i.test(hNum) && /alleati sono in quella mischia/i.test(nfc(hNum)),
       'arma senza Sagoma: la domanda chiede QUANTI alleati nella mischia');
    ok(J(M.ALLEATI_IN_MISCHIA) === J([0, 1, 2, 3]),
       `i tasti offerti sono 0, 1, 2 e "3+" (${J(M.ALLEATI_IN_MISCHIA)})`);
    ok(/>3\+</.test(hNum) && />0</.test(hNum),
       'e l HTML li porta, col "3+" scritto cosi`');
    ok(bNum.alleatiInMischia === 1,
       `parte da 1, non da 0: il bersaglio e` + ` Ingaggiato (${bNum.alleatiInMischia})`);
    ok(bNum.alleatoNellaSagoma === undefined,
       `e NON scrive alleatoNellaSagoma, che e` + ` dell altra domanda (${J(bNum.alleatoNellaSagoma)})`);
    // CONTROPROVA: un bersaglio non Ingaggiato, nessuna domanda.
    const bLib = { id: 'b2', name: 'Libero' };
    ok(M.domandaAlleatiInMischia(bLib, 0, CMD, HMG) === '',
       'CONTROPROVA: senza mischia la domanda del numero non si fa');

    // ARMA A SAGOMA: SI`/NO, e compare SEMPRE, anche fuori dalla mischia.
    const bSag = { id: 'b2', name: 'Libero' };
    const hSag = M.domandaAlleatiInMischia(bSag, 0, CMD, ML);
    ok(/prende anche un/i.test(nfc(hSag)) && /neutrale/i.test(nfc(hSag)),
       'arma a Sagoma: la domanda chiede SE la Sagoma prende un alleato');
    ok(/Marker Impersonation/i.test(nfc(hSag)),
       'e nomina il Marker Impersonation nemico');
    ok(/passato nell/i.test(nfc(hSag)),
       'e anche chi e` passato nell area durante l Ordine');
    ok(/SÌ: colpo annullato/.test(nfc(hSag)) && />NO</.test(hSag),
       'i tasti sono due: "SÌ: colpo annullato" e "NO"');
    ok(!/>3\+</.test(hSag),
       'e NON ci sono i tasti del numero: sono due domande diverse, non la stessa con altri tasti');
    ok(bSag.alleatoNellaSagoma === false,
       `fuori dalla mischia parte da NO (${bSag.alleatoNellaSagoma})`);
    ok(hSag !== '',
       'ma la domanda COMPARE anche fuori dalla mischia: la Sagoma prende chi sta vicino');
    const bSagMis = { id: 'b1', name: 'Fuciliere' };
    M.domandaAlleatiInMischia(bSagMis, 0, CMD, ML);
    ok(bSagMis.alleatoNellaSagoma === true,
       `col bersaglio Ingaggiato parte da SI` + ` (${bSagMis.alleatoNellaSagoma})`);

    // COPPIA CHE SI ESCLUDE: Fumo e domanda. Mai insieme.
    const bFumo = { id: 'b1', name: 'Fuciliere' };
    ok(M.domandaAlleatiInMischia(bFumo, 0, CMD, FUMO) === '',
       'Fumo: nessuna domanda, nemmeno su una mischia');
    ok(bFumo.alleatoNellaSagoma === undefined && bFumo.alleatiInMischia === undefined,
       `e non scrive niente sul bersaglio (${J(bFumo)})`);
    // E senza arma del tutto non cade.
    ok(M.domandaAlleatiInMischia(null, 0, CMD, ML) === '' &&
       M.domandaAlleatiInMischia('non un oggetto', 0, CMD, ML) === '',
       'senza un bersaglio vero la domanda e` vuota, non un errore');
    M._rosterNemico = null; window.currentOrder = null;
});

sezione('6. Il colpo unico: una domanda sola, sul Principale', () => {
    const CMD = 'window.rispondiMischia';
    M._rosterNemico = [{ id: 'p1', alias: 'Primo', states: { engaged: true } },
                       { id: 'p2', alias: 'Secondo', states: { engaged: true } }];
    [M.AZIONI.SPECULATIVO, M.AZIONI.GUIDATO, M.AZIONI.INTUITIVO].forEach((az) => {
        window.currentOrder = { weapon: ML, action: az };
        const b0 = { id: 'p1', name: 'Primo' }, b1 = { id: 'p2', name: 'Secondo' };
        const h0 = M.domandaAlleatiInMischia(b0, 0, CMD, ML);
        const h1 = M.domandaAlleatiInMischia(b1, 1, CMD, ML);
        ok(h0 !== '', `${az}: la domanda c e` + ` sul Principale (indice 0)`);
        ok(h1 === '', `${az}: e NON sui secondari (indice 1): un colpo, una domanda`);
        ok(!/di questo colpo/.test(nfc(h0)),
           `${az}: la domanda non dice "di questo colpo", perche` + ` il colpo e` + ` uno solo`);
        // E il secondario non si porta dietro una risposta sua, che
        // altrimenti annullerebbe tutto: era il difetto misurato da
        // INTERFACCIA.
        ok(b1.alleatoNellaSagoma === undefined,
           `${az}: e sul secondario non viene scritto niente (${J(b1.alleatoNellaSagoma)})`);
    });
    // CONTROPROVA: in un Attacco BS il Burst si divide, e ogni colpo ha la
    // sua domanda. Senza questa, "niente domanda sui secondari" non
    // distingue il colpo unico dal non-chiedere-mai.
    window.currentOrder = { weapon: ML, action: M.AZIONI.BS_ATTACK };
    const q1 = { id: 'p2', name: 'Secondo' };
    const hBs = M.domandaAlleatiInMischia(q1, 1, CMD, ML);
    ok(hBs !== '',
       'CONTROPROVA: in un Attacco BS la domanda c e` anche sul secondo bersaglio');
    ok(/di questo colpo/.test(nfc(hBs)),
       `e li` + ` dice "di questo colpo", perche` + ` i colpi sono piu` + ` di uno`);
    M._rosterNemico = null; window.currentOrder = null;
});

sezione('7. M.impostaAlleatiInMischia: scrive solo quello che la domanda offre', () => {
    const b = {};
    ok(M.impostaAlleatiInMischia(b, true) === true && b.alleatoNellaSagoma === true,
       'un booleano va su alleatoNellaSagoma');
    ok(M.impostaAlleatiInMischia(b, false) === true && b.alleatoNellaSagoma === false,
       'e il false pure: NO e` una risposta, non un non-chiesto');
    const n = {};
    ok(M.impostaAlleatiInMischia(n, 2) === true && n.alleatiInMischia === 2,
       'un numero va su alleatiInMischia');
    // A8: prima rifiutava 4, 5 e 6. Ora l elenco ammesso va fino a 6, anche
    // se i tasti sono quattro (il "3+" copre da 3 in su).
    ok(J(M.ALLEATI_IN_MISCHIA_AMMESSI) === J([0, 1, 2, 3, 4, 5, 6]),
       `i valori ammessi sono 0-6, non solo quelli dei tasti (${J(M.ALLEATI_IN_MISCHIA_AMMESSI)})`);
    [4, 5, 6].forEach(v => {
        const u = {};
        ok(M.impostaAlleatiInMischia(u, v) === true && u.alleatiInMischia === v,
           `${v} alleati si scrive (A8: prima veniva rifiutato)`);
    });
    // CONTROPROVA: fuori elenco non si scrive, e il bersaglio resta com era.
    const fuori = { alleatiInMischia: 2 };
    ok(M.impostaAlleatiInMischia(fuori, 7) === false && fuori.alleatiInMischia === 2,
       `CONTROPROVA: 7 non si scrive e il bersaglio resta com era (${fuori.alleatiInMischia})`);
    ok(M.impostaAlleatiInMischia(fuori, -1) === false && fuori.alleatiInMischia === 2,
       'e nemmeno -1');
    ok(M.impostaAlleatiInMischia(null, 1) === false,
       'senza bersaglio false, senza cadere');
    // Il booleano NON passa per l elenco dei numeri: e` l altro campo.
    const misto = {};
    M.impostaAlleatiInMischia(misto, true);
    ok(misto.alleatiInMischia === undefined,
       `e un booleano non scrive mai alleatiInMischia (${J(misto.alleatiInMischia)})`);
});

sezione('8. Il MOD della mischia si ferma a -12, e la Sagoma non lo prende', () => {
    // A6, A7, A8: con l arma SENZA Sagoma il MOD della mischia cresce coi
    // numeri, e si ferma a -12. Il massimo si misura, non si assume.
    const modDi = (n) => {
        const e = M.modAttacco(
            { id: 'a', alias: 'Tiratore', bs: 12, wip: 13, ph: 10, arm: 1, bts: 0, states: {} },
            { id: 'b', alias: 'Bersaglio', tipo: 'LI', arm: 1, bts: 0, states: { engaged: true } },
            HMG, M.AZIONI.BS_ATTACK, { alleatiInMischia: n, rangeIndex: 0 });
        return e && e.valore;
    };
    const base = M.modAttacco(
        { id: 'a', alias: 'Tiratore', bs: 12, wip: 13, ph: 10, arm: 1, bts: 0, states: {} },
        { id: 'b', alias: 'Bersaglio', tipo: 'LI', arm: 1, bts: 0, states: {} },
        HMG, M.AZIONI.BS_ATTACK, { rangeIndex: 0 });
    ok(typeof base.valore === 'number', `premessa: senza mischia il MOD si calcola (${base.valore})`);
    const m1 = modDi(1), m2 = modDi(2);
    ok(m1 < base.valore, `un alleato in mischia peggiora il tiro (${base.valore} -> ${m1})`);
    ok(m2 < m1, `due lo peggiorano di piu` + ` (${m1} -> ${m2})`);
    // 🔴 IL TETTO SI MISURA SUL MOD, NON SUL VALORE. La prima stesura di
    // questa prova guardava `valore` e passava per il motivo sbagliato: con
    // un BS 12 il valore si schiaccia a 0 gia` con due alleati, quindi "non
    // scende sotto -12" era vero anche con un MOD di -36. Il tetto sta
    // nella SOMMA DELLE VOCI, e il motore scrive la voce che lo dice.
    const esito = (n) => M.modAttacco(
        { id: 'a', alias: 'Tiratore', bs: 12, wip: 13, ph: 10, arm: 1, bts: 0, states: {} },
        { id: 'b', alias: 'Bersaglio', tipo: 'LI', arm: 1, bts: 0, states: { engaged: true } },
        HMG, M.AZIONI.BS_ATTACK, { alleatiInMischia: n, rangeIndex: 0 });
    const sommaVoci = (e) => (e.voci || []).reduce((s, x) => s + (x.valore || 0), 0);
    const vocePerAlleato = (e) => (e.voci || []).find(x => /per ognuno dei/.test(nfc(x.motivo)));
    const voceTetto = (e) => (e.voci || []).find(x => x.fonte === 'limite');
    const e2 = esito(2), e3 = esito(3), e6 = esito(6);
    ok((vocePerAlleato(e6) || {}).valore === -36,
       `la voce della mischia conta -6 per alleato, senza tetto suo: sei alleati fanno -36 (${(vocePerAlleato(e6) || {}).valore})`);
    ok(sommaVoci(e6) === -12,
       `ma il MOD TOTALE si ferma a -12 (somma delle voci: ${sommaVoci(e6)})`);
    ok(sommaVoci(e3) === -12 && sommaVoci(e2) === -12,
       `e ci sta fermo da due alleati in su (2 -> ${sommaVoci(e2)}, 3 -> ${sommaVoci(e3)})`);
    ok(/MOD minimo -12/.test(nfc((voceTetto(e6) || {}).motivo)),
       `col motore che scrive la voce del tetto, a vista (${nfc((voceTetto(e6) || {}).motivo)})`);
    // CONTROPROVA: con UN alleato il tetto non c e` ancora, e la voce del
    // limite non viene scritta. Senza, "il tetto c e`" non distingue
    // "applicato quando serve" da "applicato sempre".
    ok(voceTetto(esito(1)) === undefined && sommaVoci(esito(1)) === -9,
       `CONTROPROVA: con un alleato solo il tetto non scatta (somma ${sommaVoci(esito(1))}, voce del limite ${J(voceTetto(esito(1)))})`);
    // COPPIA CHE SI ESCLUDE: Sagoma e -6. Mai insieme. Con la Sagoma il
    // colpo si annulla, non prende un malus.
    const esitoSag = M.esitoSagomaAlleati(ML, ingaggiato, { alleatoNellaSagoma: true });
    ok(esitoSag.annullato === true && esitoSag.applica === true,
       'con la Sagoma il colpo si ANNULLA: non c e` un MOD da applicare');
    ok(M.esitoSagomaAlleati(HMG, ingaggiato, { alleatiInMischia: 1 }).applica === false,
       `e con l arma senza Sagoma applica false: li` + ` vale il MOD, non l annullamento`);
    ok(!/-6/.test(nfc(esitoSag.nota)),
       'e la nota della Sagoma non parla di -6: le due cose non convivono');
});

// ---------------------------------------------------------------------------
// Il tavolo per le due sezioni che seguono: un colpo vero fino allo scontro.
const ATT = { id: 'a', alias: 'Tiratore', bs: 12, wip: 13, ph: 10, arm: 1, bts: 0, states: {} };
const ING1 = { id: 'b1', alias: 'Primo', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: { engaged: true } };
const ING2 = { id: 'b2', alias: 'Secondo', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: { engaged: true } };
const LIB3 = { id: 'b3', alias: 'Terzo', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: {} };
const CAMPO = [ATT, ING1, ING2, LIB3];
const TROVA = (n, id) => CAMPO.find(u =>
    (id && String(u.id) === String(id)) ||
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;
const bers = (o) => Object.assign({ burst: 1, rangeIndex: 0, rangeMod: 0 }, o);
function colpo(arma, bersagli, reaz) {
    const b = { attacchi: [{ attaccante: 'Tiratore', attaccanteId: 'a',
                             azione: M.AZIONI.BS_ATTACK, arma: arma, bersagli: bersagli }] };
    return M.risolviPayload(b, reaz || [], { trovaUnita: TROVA }) || [];
}
const annull = (s) => !!((s || {}).attivo || {}).colpoAnnullato;
const dadi = (s) => (((s || {}).attivo || {}).burst);
const salvOff = (s) => !!((((s || {}).attivo || {}).salvezzaInflitta || {}).offensivo);
const tutteLeNote = (s) => nfc(((((s || {}).attivo || {}).note) || []).concat((s || {}).note || []).join(' | '));
const perNome = (lista, nome) => lista.find(s => String(((s || {}).reattivo || {}).nome || '') === nome) || {};

sezione('9. Un colpo, annullato per tutti (A1, A2, A3)', () => {
    // Il Principale dice SI`: il colpo e` uno, e cade per tutti i bersagli
    // sotto la Sagoma — anche per chi non e` in mischia con nessuno.
    const r1 = colpo(ML, [bers({ id: 'b1', name: 'Primo', alleatoNellaSagoma: true, principale: true }),
                          bers({ id: 'b3', name: 'Terzo' })]);
    ok(r1.length === 2, `due bersagli, due scontri (${r1.length})`);
    ok(annull(perNome(r1, 'Primo')) && annull(perNome(r1, 'Terzo')),
       `il colpo e` + ` annullato per TUTTI, non solo per chi ha l alleato accanto (Primo ${annull(perNome(r1, 'Primo'))}, Terzo ${annull(perNome(r1, 'Terzo'))})`);
    ok(dadi(perNome(r1, 'Terzo')) === 0,
       `e nessun dado si tira sul secondario (${dadi(perNome(r1, 'Terzo'))})`);
    ok(salvOff(perNome(r1, 'Terzo')) === false,
       `ne` + ` un Tiro Salvezza da subire: il colpo non c e` + ` stato (${salvOff(perNome(r1, 'Terzo'))})`);
    // Le due scritte restano quelle del caso di ciascuno: in mischia una,
    // fuori l altra. L annullamento e` comune, il motivo e` del bersaglio.
    ok(/SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO/.test(tutteLeNote(perNome(r1, 'Primo'))),
       'sul bersaglio in mischia la scritta e` quella della mischia');
    ok(/UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA/.test(tutteLeNote(perNome(r1, 'Terzo'))),
       'e su quello fuori dalla mischia e` l altra');

    // 🔴 IL CASO CHE HA FATTO NASCERE `rispostaColpo`. Il Principale dice
    // NO; il secondario e` Ingaggiato e arriva SENZA campo, perche` la
    // domanda si fa una volta sola. Prima, quel secondario seguiva la
    // lettura delle buste vecchie (mischia = annullato) e annullava tutto
    // ANCHE COL NO. Questa e` la prova che il NO del Principale vale per
    // tutto il colpo.
    const r2 = colpo(ML, [bers({ id: 'b3', name: 'Terzo', alleatoNellaSagoma: false, principale: true }),
                          bers({ id: 'b2', name: 'Secondo' })]);
    ok(!annull(perNome(r2, 'Terzo')) && !annull(perNome(r2, 'Secondo')),
       `il NO del Principale vale per tutto il colpo: niente annullato, nemmeno sul secondario Ingaggiato (Terzo ${annull(perNome(r2, 'Terzo'))}, Secondo ${annull(perNome(r2, 'Secondo'))})`);
    ok(dadi(perNome(r2, 'Secondo')) === 1,
       `e il secondario tira il suo dado (${dadi(perNome(r2, 'Secondo'))})`);

    // COPPIA CHE SI ESCLUDE: SI` e NO sullo stesso colpo unico. Il
    // Principale dice NO, ma un secondario porta un SI` SUO: il colpo cade
    // per tutti. Provata insieme alla riga sopra, perche` da sole le due
    // meta` passerebbero entrambe.
    const r3 = colpo(ML, [bers({ id: 'b3', name: 'Terzo', alleatoNellaSagoma: false, principale: true }),
                          bers({ id: 'b2', name: 'Secondo', alleatoNellaSagoma: true })]);
    ok(annull(perNome(r3, 'Terzo')) && annull(perNome(r3, 'Secondo')),
       `un SI` + ` su un secondario vince il NO del Principale: annullato per tutti (${annull(perNome(r3, 'Terzo'))} / ${annull(perNome(r3, 'Secondo'))})`);
    ok(/SAGOMA ANNULLATA: è lo stesso colpo che prende anche Secondo/.test(tutteLeNote(perNome(r3, 'Terzo'))),
       `e chi non aveva l alleato legge PERCHE` + `, col nome di chi lo annulla (${tutteLeNote(perNome(r3, 'Terzo')).slice(0, 58)})`);
    ok(/3584-3594/.test(tutteLeNote(perNome(r3, 'Terzo'))),
       'con la riga di regolamento (3584-3594)');
    ok(/ARO restano/.test(tutteLeNote(perNome(r3, 'Terzo'))) &&
       /Disposable/.test(tutteLeNote(perNome(r3, 'Terzo'))),
       'e la nota dice che gli ARO restano e l uso Disposable si consuma lo stesso (A2)');

    // A3: con Burst 2 o piu` le Sagome sono piu` d una, e l annullamento
    // resta PER BERSAGLIO. E` la controprova del "per tutti": senza,
    // "annullato per tutti" non si distingue da "annullato sempre".
    const r4 = colpo(ML, [bers({ id: 'b1', name: 'Primo', burst: 2, alleatoNellaSagoma: true, principale: true }),
                          bers({ id: 'b3', name: 'Terzo', burst: 2 })]);
    ok(annull(perNome(r4, 'Primo')) && !annull(perNome(r4, 'Terzo')),
       `CONTROPROVA (A3): con Burst 2 l annullamento resta per bersaglio (Primo ${annull(perNome(r4, 'Primo'))}, Terzo ${annull(perNome(r4, 'Terzo'))})`);
    ok(dadi(perNome(r4, 'Terzo')) === 2,
       `e l altro tira i suoi due dadi (${dadi(perNome(r4, 'Terzo'))})`);
    ok(!/SAGOMA ANNULLATA: è lo stesso colpo/.test(tutteLeNote(perNome(r4, 'Terzo'))),
       'e non legge la nota del colpo comune, che qui non c entra');
});

sezione('10. Le reazioni restano accoppiate quando il giro si rifa`', () => {
    // Quando un bersaglio annulla il colpo, il motore RIFA` il giro dei
    // bersagli. Qui si guarda che l ARO resti con chi l ha dichiarato, e
    // una volta sola.
    //
    // 🔴 QUELLO CHE QUESTE PROVE NON COPRONO, detto perche` non si creda
    // il contrario. Nel rifacimento il motore riporta anche le reazioni
    // usate alla lunghezza di prima (`usate.length = inizioUsate`, riga
    // 6887). Quella riga e` giusta, ma NON E` OSSERVABILE da qui: l ho
    // togliata dal motore in una copia di servizio e l uscita non cambia
    // di un carattere, in tutti i casi che ho saputo costruire — un
    // reattivo bersaglio, un reattivo non bersaglio, e due attacchi nella
    // stessa busta. Il motivo e` che ogni lettura di `usate` e` un test di
    // appartenenza (`indexOf(...) < 0`), e un doppione non cambia
    // l appartenenza. Quindi: nessun banco la fa diventare rossa. Le prove
    // qui sotto misurano l accoppiamento, che e` cosa diversa.
    const aro = [{ id: 'b3', nome: 'Terzo', difensore: LIB3, azione: 'DODGE', burst: 1 }];
    const r = colpo(ML, [bers({ id: 'b3', name: 'Terzo', alleatoNellaSagoma: false, principale: true }),
                         bers({ id: 'b2', name: 'Secondo', alleatoNellaSagoma: true })], aro);
    ok(r.length === 2, `due scontri anche col giro rifatto (${r.length})`);
    const sTerzo = perNome(r, 'Terzo');
    ok(annull(sTerzo), 'premessa: il giro e` stato rifatto, il colpo e` annullato per tutti');
    ok(String((sTerzo.reattivo || {}).azione || '').toUpperCase().indexOf('SCHIVAT') >= 0 ||
       String((sTerzo.reattivo || {}).azione || '').toUpperCase().indexOf('DODGE') >= 0,
       `e la Schivata di Terzo e` + ` ancora sul SUO scontro (${(sTerzo.reattivo || {}).azione})`);
    const conAro = r.filter(s => {
        const az = String(((s || {}).reattivo || {}).azione || '').toUpperCase();
        return az.indexOf('SCHIVAT') >= 0 || az.indexOf('DODGE') >= 0;
    });
    ok(conAro.length === 1,
       `e UNA volta sola: il giro rifatto non la conta due volte (${conAro.length})`);
    // CONTROPROVA: senza il giro rifatto (nessun annullamento) la Schivata
    // sta nello stesso posto. Senza, "accoppiata" non distingue
    // "riportata bene" da "sempre uguale per caso".
    const rNo = colpo(ML, [bers({ id: 'b3', name: 'Terzo', alleatoNellaSagoma: false, principale: true }),
                           bers({ id: 'b2', name: 'Secondo' })], aro);
    ok(!annull(perNome(rNo, 'Terzo')),
       'CONTROPROVA: senza annullamento il giro non si rifa`');
    const conAroNo = rNo.filter(s => {
        const az = String(((s || {}).reattivo || {}).azione || '').toUpperCase();
        return az.indexOf('SCHIVAT') >= 0 || az.indexOf('DODGE') >= 0;
    });
    ok(conAroNo.length === 1 && String((perNome(rNo, 'Terzo').reattivo || {}).nome) === 'Terzo',
       `e la Schivata e` + ` sempre una, sullo stesso bersaglio (${conAroNo.length})`);
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

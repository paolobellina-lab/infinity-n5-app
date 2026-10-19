// @versione 2026-10-19.1 | test_novita_18ott.js | proprieta`: chat TEST
// ============================================================================
//  Le novita` del giro del 18-19 ottobre (motore 2026-10-18.1, catalogo
//  2026-10-19.1, app e logica_aro 2026-10-19.1), viste dai tre dispositivi
//  (app Nomadi, app PanOceania, Hub) con le pagine INTERE e un server finto.
//   1. FUORI GITTATA come segmento della barra: Scoprire, Forward Observer.
//   2. Forward Observer: Burst 2 dall'arma (OSS-01).
//   3. Anti-spoiler: il Marker porta `mimetismo` (SCO-01 applica il -6);
//      la truppa visibile `state`; un Deployable `deployable` e `chiaveArma`.
//   4. Allarmi ARO con aroAtteso: Sensor, Triangulated, Supporto,
//      Soppressione (ABILITA` SENZA TIRO al tabellone), DIF-13.
//   5. SUP-02a/b, SUP-04a/b: chi tira, PH, Burst del tiro per colpire.
//   6. ST-05, ST-21 (Morto all'Hub), ST-16a/b.
//   7. Ogni schermata parte dall'alto (window.portaInCima).
//   8. Cybermask e White Noise dalla schermata Hacking (ORD-02).
//  L'harness creaTavolo e` lo stesso di test_elenchi_e_tabellone.js
//  (INTERFACCIA): copiato qui perche` ogni banco basti a se stesso.
//  USO:  CARTELLA=/percorso/ node test_novita_18ott.js
// ============================================================================
const fs=require("fs"),vm=require("vm");const J=JSON.stringify;
function creaTavolo(DIR, opz) {
  opz = opz || {};
  DIR = DIR.replace(/\/?$/, '/');
  const server = {}, dispositivi = [], problemi = [];
  function recapita(da, chiave, valore) {
    if (valore === null) delete server[chiave]; else server[chiave] = valore;
    dispositivi.forEach(d => { if (d !== da) d.riceve(chiave, valore); });
  }
  function avvia(nome, titolo, pagina, ricerca) {
    const memoria = {}, el = {}, ascolti = {}, storage = [];
    const g = { errori: [], avvisi: [], alert_: [] };
    g.console = { log: () => {}, warn: (...a) => g.avvisi.push(a.map(String).join(' ')), error: (...a) => g.errori.push(a.map(x => (x && x.stack) || String(x)).join(' ')) };
    g.window = g; g.globalThis = g;
    const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, value: '', checked: false, disabled: false, options: [],
        appendChild() {}, addEventListener() {}, remove() {}, setAttribute() {}, getAttribute() { return null; }, scrollTop: 0, scrollHeight: 0,
        classList: { add() {}, remove() {}, toggle() {} }, cloneNode() { return this; }, parentNode: { replaceChild() {}, insertBefore() {} },
        querySelector() { return null; }, querySelectorAll() { return []; } }; return el[id]; };
    let t = titolo;
    g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute() {} }, scripts: [], body: finto('body'),
        getElementById: finto, createElement: () => finto('nuovo_' + Math.random()), querySelector: (s) => finto('q:' + s), querySelectorAll: () => [],
        addEventListener() {}, write() {} };
    g.alert = (m) => g.alert_.push(String(m)); g.confirm = () => true; g.prompt = () => 'motivo di prova'; g.scrollTo = () => {};
    g._cicli = []; g.setInterval = (fn) => { g._cicli.push(fn); return g._cicli.length; };
    g.setTimeout = (fn) => { try { fn && fn(); } catch (e) { g.errori.push('setTimeout: ' + e.stack); } return 0; };
    g.addEventListener = (tipo, fn) => { if (tipo === 'storage') storage.push(fn); };
    g.Event = function (tipo) { this.type = tipo; };
    g.dispatchEvent = (ev) => storage.forEach(fn => fn(ev));
    g.history = { pushState() {}, replaceState() {}, back() {} }; g.navigator = {};
    g.location = { search: ricerca || '', replace() {}, href: '', reload() {} };
    g.localStorage = { getItem: k => (k in memoria ? memoria[k] : null), setItem: (k, v) => { memoria[k] = String(v); }, removeItem: k => { delete memoria[k]; } };
    const d = { nome, g, memoria, el: finto, elementi: el };
    d.riceve = (k, v) => {
      if (ascolti[k]) ascolti[k]({ val: () => v });
      else { if (v === null) delete memoria[k]; else memoria[k] = v; storage.forEach(fn => fn({ key: k, newValue: v })); }
    };
    g.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => ({
        on: (ev, fn) => { ascolti[k] = fn; }, set: (v) => recapita(d, k, String(v)), update() {}, remove: () => recapita(d, k, null),
        once: () => Promise.resolve({ val: () => (k in server ? server[k] : null) }) }) }) };
    const ctx = vm.createContext(g);
    const h = fs.readFileSync(DIR + pagina, 'utf8');
    [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
      const s = m[1];
      if (s) { if (/^https?:/.test(s)) return; const f = s.split('?')[0]; g.document.scripts.push({ src: f });
        if (!fs.existsSync(DIR + f)) { problemi.push(nome + ': manca ' + f); return; }
        try { vm.runInContext(fs.readFileSync(DIR + f, 'utf8'), ctx, { filename: f }); } catch (e) { problemi.push(nome + ': ' + f + ': ' + e.message); } }
      else { try { vm.runInContext(m[2], ctx, { filename: pagina + ':inline' }); } catch (e) { problemi.push(nome + ': inline: ' + e.message); } }
    });
    d.giro = () => g._cicli.forEach(fn => fn());
    dispositivi.push(d);
    return d;
  }
  const pagina = opz.pagina || 'app.html';
  const nomadi = avvia('NOMADI', 'NOMADS', pagina, '?fazione=nomadi');
  const pano = avvia('PANOCEANIA', 'PANOCEANIA', pagina, '?fazione=panoceania');
  const hub = avvia('HUB', 'HUB', 'calcolatore_hub.html', '');
  hub.g.hubPronto = true;
  const T = { server, nomadi, pano, hub, problemi };
  T.giro = (n) => { for (let i = 0; i < (n || 3); i++) { hub.giro(); nomadi.giro(); pano.giro(); } };
  // Schiera: i roster partono verso l'Hub dal mittente vero.
  T.schiera = (rN, rP, attiva) => {
    nomadi.g.roster = rN; pano.g.roster = rP;
    [nomadi, pano].forEach(d => { d.g.activeStructures = d.g.activeStructures || []; d.g.activeTerrains = d.g.activeTerrains || []; d.g.schieramentoCompletato = true; });
    nomadi.g.inviaSchieramentoAllHub('NOMADI', { roster: rN, strutture: [], terreni: nomadi.g.activeTerrains });
    pano.g.inviaSchieramentoAllHub('PANOCEANIA', { roster: rP, strutture: [], terreni: pano.g.activeTerrains });
    T.giro();
    if ((attiva || 'NOMADI') !== hub.g.gameState.activeFaction) hub.g.toggleTurn();
    else hub.g.localStorage.setItem(hub.g.MotoreN5.CANALI.HUB_TURNO, JSON.stringify({ attivo: hub.g.gameState.activeFaction }));
    T.giro();
  };
  T.profilo = (d, re) => { const tutti = [].concat(d.g.DB_NOMADI, d.g.DB_PANOCEANIA); const p = tutti.find(u => re.test(u.nome)); if (!p) throw new Error('profilo non trovato: ' + re); return JSON.parse(JSON.stringify(p)); };
  // Il giocatore sceglie l'unita` e apre il menu degli Ordini.
  T.apriMenu = (d, indice) => { const g = d.g; g.currentOrder = {}; g.spearheadUnit = g.roster[indice || 0]; g.selectedCoordinatedUnits = []; g.isCoordinated = false; g.procediAlleAzioni(); return d.el('action-list-container').innerHTML; };
  return T;
}



// ---------------------------------------------------------------------------
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
let passati = 0, falliti = 0;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ✗ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}
const tx = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const tr = (p, a) => Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 }, a);
const ris = (T) => T.hub.el('step-resolution').style.display === 'block';
const tab = (T) => tx(T.hub.el('clash-container').innerHTML);
// La busta che parte verso l'Hub: azione, Burst, regole e opzioni (aroAtteso).
const spia = (g) => { const s = { n: 0, op: {}, p: null }; const M = g.MotoreN5, o = M.inviaCalcolo;
    M.inviaCalcolo = function (p, op) { s.n++; s.p = p.map(x => ({ az: x.azione, bd: x.burstDisponibile, b: (x.bersagli || []).map(b => b.burst), reg: x.regole })); s.op = op || {}; return o.apply(this, arguments); }; return s; };
const tavolo = (rN, rP, attiva) => { const T = creaTavolo(DIR); T.schiera(rN(T), rP(T), attiva); return T; };
const P_ = (T, re) => T.profilo(T.nomadi, re);

sezione('1. FUORI GITTATA e` un segmento della barra (Scoprire, Forward Observer)', () => {
    // Scoprire: Fusilier contro un Marker CAMO.
    const T = tavolo(T => [tr(P_(T, /^Spektr \(MULTI Sniper/), { id: 'n2', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Cerca' })], 'PANOCEANIA');
    const P = T.pano.g;
    T.apriMenu(T.pano, 0); P.selectAction('SCOPRIRE', false); P.scegliBersaglioScoprire('n2'); T.giro(); T.nomadi.g.annullaAro(); T.giro();
    P.preparaModificatoriScoprire();
    const h = () => T.pano.el('targets-allocation-container').innerHTML;
    ok(/class="range-seg[^"]*"[^>]*onclick="window\.toggleFuoriGittataScoprire\(\)">FUORI</.test(h()), 'Scoprire: FUORI in coda alla barra delle bande');
    ok(!/toggleRequisitoScoprire\(0, 'gittata'\)/.test(h()) && /toggleRequisitoScoprire\(0, 'lof'\)/.test(h()), 'e fra i requisiti resta solo la Linea di Tiro, non la gittata');
    (typeof P.toggleFuoriGittataScoprire === 'function' ? P.toggleFuoriGittataScoprire : () => {})();
    ok(P.combatTargets[0].fuoriGittata === true && /IDLE/.test(T.pano.el('btn-esegui-calcolo').innerText || ''), 'toccato FUORI: fuori gittata, e il tasto diventa IDLE', T.pano.el('btn-esegui-calcolo').innerText);
    P.setRangeScoprire(1);
    ok(P.combatTargets[0].fuoriGittata === false, 'scelta una banda: torna in gittata');
    // Forward Observer.
    const T2 = tavolo(T => [tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'n1', alias: 'Fo' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T2.nomadi.g;
    T2.apriMenu(T2.nomadi, 0); N.selectAction('FORWARD OBSERVER', false); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T2.giro();
    T2.pano.g.annullaAro(); T2.giro();
    const m = T2.nomadi.el('second-half-buttons-container').innerHTML.match(/selectAction\('([^']+)', true\)/);
    if (m) N.selectAction(m[1], true);
    const h2 = T2.nomadi.el('targets-allocation-container').innerHTML;
    ok(/class="range-seg[^"]*"[^>]*onclick="window\.toggleFuoriGittataOsservazione\(\)">FUORI</.test(h2), 'Forward Observer: FUORI in coda alla barra');
    ok(!/toggleRequisitoOsservazione\(0, 'gittata'\)/.test(h2) && /toggleRequisitoOsservazione\(0, 'lof'\)/.test(h2), 'e niente tasto del requisito gittata');
});

sezione('2. Forward Observer: Burst 2 dall arma (OSS-01), non 1', () => {
    const T = tavolo(T => [tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'n1', alias: 'Fo' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T.nomadi.g, M = N.MotoreN5;
    T.apriMenu(T.nomadi, 0); N.selectAction('FORWARD OBSERVER', false); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    ok(!!T.pano.g.currentAttackData, 'premessa: dichiarati i bersagli, l allarme ARO arriva al reattivo');
    T.pano.g.annullaAro(); T.giro();
    const m = T.nomadi.el('second-half-buttons-container').innerHTML.match(/selectAction\('([^']+)', true\)/);
    if (m) N.selectAction(m[1], true);
    ok(((N.combatTargets || [])[0] || {}).burst === 2 && /Burst <b[^>]*>2</.test(T.nomadi.el('targets-allocation-container').innerHTML), 'a schermo: Burst 2', ((N.combatTargets || [])[0] || {}).burst);
    if (!(N.combatTargets || [])[0]) N.combatTargets = [{ id: 'p1', name: 'Due', burst: 1, rangeIndex: 0, rangeMod: 0 }];
    const s = spia(N); N.eseguiOsservazione(); T.giro();
    ok(!!s.p && !!s.p[0] && s.p[0].bd === 2 && J(s.p[0].b) === '[2]', 'nella busta: burstDisponibile 2 e 2 dadi sul bersaglio', s.p && s.p[0]);
    ok(ris(T) && /FORWARD OBSERVER Successo al: \d+ \(o meno\) Dadi da lanciare: 2/.test(tab(T)), 'sul tabellone: 2 dadi', tab(T).slice(0, 120));
    const fo = tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'f' }), b = tr(P_(T, /^Fusilier \(Combi/), { id: 'b' });
    ok(M.burstIniziale(fo, M.profiloArma('Forward Observer'), { azione: M.AZIONI.FORWARD_OBSERVER, coordMode: true, indiceCoord: 1 }).valore === 1, 'CONTROPROVA: un gregario in Ordine Coordinato tira 1 dado');
});

sezione('3. Anti-spoiler: il Marker porta il Mimetismo (SCO-01), la truppa visibile lo stato', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' }),
                           tr(P_(T, /^Spektr \(MULTI Sniper/), { id: 'n2', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } }),
                           tr(P_(T, /^Fusilier \(Combi/), { id: 'n4', alias: 'Senza', deployState: 'CAMO', states: { camo: true } })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Cerca' })], 'PANOCEANIA');
    const P = T.pano.g, M = P.MotoreN5;
    const mk = M.rosterNemico().find(u => u.id === 'n2'), alg = M.rosterNemico().find(u => u.id === 'n1'), senza = M.rosterNemico().find(u => u.id === 'n4');
    ok(mk && mk.nome === 'MARKER' && mk.mimetismo === -6, 'di un Marker con Mimetism (-6) l avversario riceve mimetismo -6', mk && mk.mimetismo);
    ok(mk && !('bs' in mk) && !('weapon' in mk) && !('skills' in mk) && !('equip' in mk), 'e nient altro del profilo: niente BS, armi, Abilita`, equipaggiamento', mk && Object.keys(mk));
    ok(senza && !senza.mimetismo, 'CONTROPROVA: un Marker senza Mimetism porta mimetismo 0 (o niente)', senza && senza.mimetismo);
    const e = M.regoleScoprire(P.roster[0], mk, { rangeIndex: 0 });
    ok(e.voci.some(v => v.fonte === 'mimetismo' && v.valore === -6), 'Scoprire contro quel Marker applica il -6 (SCO-01)', e.voci);
    const e2 = M.regoleScoprire(P.roster[0], senza, { rangeIndex: 0 });
    ok(!e2.voci.some(v => v.fonte === 'mimetismo'), 'CONTROPROVA: contro il Marker senza Mimetism nessun MOD di Mimetismo', e2.voci);
    ok(alg && alg.state === 'ACTIVE', 'la truppa visibile porta lo stato vitale (state)', alg && alg.state);
    // Un Deployable visibile porta deployable e chiaveArma.
    const N = T.nomadi.g, MN = N.MotoreN5;
    const zero = tr([].concat(N.DB_NOMADI).find(u => /^Zero \(E\/M Mine/.test(u.nome)), { id: 'z1', alias: 'Zero' });
    const koala = MN.creaDeployable(zero, MN.profiloArma('CrazyKoalas'), { ordineId: 'o1', viaEsito: false }).token;
    const pk = MN.filtraPerAvversario([koala])[0] || {};
    ok(pk.deployable === true && pk.chiaveArma === koala.chiaveArma && !!koala.chiaveArma, 'un CrazyKoala sul tavolo arriva all avversario con deployable e chiaveArma', { d: pk.deployable, c: pk.chiaveArma });
});

sezione('4. Allarmi ARO nuovi: l Hub aspetta la risposta (Sensor, Triangulated, Supporto, Soppressione)', () => {
    // Sensor (OSS-02)
    {
        const T = tavolo(T => [tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'n1', alias: 'Sens' })],
                         T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('SENSOR', false);
        const s = spia(N); N.eseguiOsservazione(); T.giro();
        ok(!!T.pano.g.currentAttackData && s.op.aroAtteso === true, 'Sensor: parte l allarme e la busta ha aroAtteso', s.op);
        ok(!ris(T), 'e l Hub aspetta');
        T.pano.g.annullaAro(); T.giro();
        ok(ris(T) && /SENSOR/.test(tab(T)), 'risposto il reattivo, il Sensor si risolve');
    }
    // Triangulated (OSS-03): la pagina dei bersagli e` quella dell'Attacco BS.
    {
        const T = tavolo(T => [tr(P_(T, /^Stempler Zond$/), { id: 'n1', alias: 'Zn' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('TRIANGULATED FIRE', false);
        const w = T.nomadi.el('weapon-buttons-container').innerHTML, arma = (w.match(/scegliArmaTriangulated\('([^']+)'\)/) || [])[1];
        ok(/class="bottone-arma"/.test(w) && !!arma, 'Triangulated: le armi col bottone dell Attacco BS', arma);
        N.scegliArmaTriangulated(arma);
        ok(/rup-nome/.test(T.nomadi.el('enemy-target-buttons').innerHTML), 'i bersagli con la riga con la foto');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        ok(T.pano.g.currentAttackData && T.pano.g.currentAttackData.azione === 'TRIANGULATED FIRE', 'CONFERMA BERSAGLI manda l allarme ARO del Triangulated', T.pano.g.currentAttackData && T.pano.g.currentAttackData.azione);
        T.pano.g.annullaAro(); T.giro();
        ok(/TRIANGULATED FIRE/.test(tx(T.nomadi.el('targets-allocation-container').innerHTML)), 'Ordine Intero: dopo l ARO si va da soli al tiro (niente tasto ABILITA` LUNGA)');
    }
    // Supporto (SUP-01): prima meta`.
    {
        const T = tavolo(T => [tr(P_(T, /^Clockmaker \(Engineer/), { id: 'n1', alias: 'Clock' }),
                               tr(P_(T, /^Reaktion Zond \(HMG/), { id: 'n2', alias: 'Zond', states: { unconscious: true }, state: 'UNCONSCIOUS' })],
                         T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('MEDICO_INGEGNERE', false);
        N.scegliStrumentoSupporto('INGEGNERE'); N.scegliBersaglioSupporto('n2');
        const s = spia(N); N.eseguiCalcoloSupporto(); T.giro();
        ok(!!T.pano.g.currentAttackData && s.op.aroAtteso === true && !ris(T), 'Supporto in prima meta`: allarme, aroAtteso, l Hub aspetta', s.op);
        T.pano.g.annullaAro(); T.giro();
        ok(ris(T), 'risposto il reattivo, il Supporto si risolve');
    }
    // Soppressione (DIF-10)
    {
        const T = tavolo(T => [tr(P_(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Sf' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('SOPPRESSIONE', false);
        const b = (T.nomadi.el('weapon-buttons-container').innerHTML.match(/confermaSoppressione\('([^']+)'\)/) || [])[1];
        const s = spia(N); N.confermaSoppressione(b); T.giro();
        const al = T.pano.g.currentAttackData || {};
        ok(al.azione === 'SOPPRESSIONE' && al.sfMode && al.sfMode.burst === 3 && s.op.aroAtteso === true && !ris(T), 'Soppressione: allarme con la SF Mode, aroAtteso, l Hub aspetta', { az: al.azione, op: s.op });
        T.pano.g.annullaAro(); T.giro();
        ok(ris(T) && /ABILITÀ SENZA TIRO/.test(tab(T)) && /Fuoco di Soppressione con Heavy Machine Gun \(SF Mode\)/.test(tab(T)), 'sul tabellone: ABILITA` SENZA TIRO con la nota della SF Mode', tab(T).slice(0, 160));
        ok(!/Dadi da lanciare/.test(tab(T)), 'e nessun dado', tab(T).slice(0, 160));
        ok(T.hub.g.gameState.nomads[0].states.suppressive === true, 'e l Hub ha lo stato Fuoco di Soppressione');
        // DIF-13: attivarlo con un Ordine annulla la Soppressione anche all'Hub.
        T.hub.g.chiudiRisoluzione(); T.giro(); N.tornaAlRadar(); N.currentGroup = 1; N.selezionaUnita(0); T.giro();
        ok(N.roster[0].states.suppressive === false && T.hub.g.gameState.nomads[0].states.suppressive === false, 'DIF-13: dichiarato un Ordine, la Soppressione sparisce nell app E sul tabellone',
           { app: N.roster[0].states.suppressive, hub: T.hub.g.gameState.nomads[0].states.suppressive });
    }
});

sezione('5. Supporto: MediKit e GizmoKit, in contatto e a distanza (SUP-02a/b, SUP-04a/b)', () => {
    const giro = (reIo, reB, strumento, distanza, statiB) => {
        const T = tavolo(T => [tr(P_(T, reIo), { id: 'n1', alias: 'Io' }), tr(P_(T, reB), Object.assign({ id: 'n2', alias: 'Lui' }, statiB))],
                         T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('MEDICO_INGEGNERE', false);
        N.scegliStrumentoSupporto(strumento); N.scegliBersaglioSupporto('n2');
        if (distanza) N.toggleContattoSupporto();
        const s = spia(N); N.eseguiCalcoloSupporto(); T.giro(); T.pano.g.annullaAro(); T.giro();
        return { T, reg: (s.p && s.p[0] && s.p[0].reg) || {}, t: tab(T) };
    };
    const inc = { states: { unconscious: true }, state: 'UNCONSCIOUS' };
    const a = giro(/^Alguacil \(Paramedic/, /^Morlock \(Assault/, 'MEDIKIT', false, inc);
    ok(!a.reg.tiroPerColpire && a.reg.chiTira === 'BERSAGLIO' && a.reg.valoreSuccesso === 13 && a.reg.fallimentoLetale === true,
       'SUP-02a MediKit in contatto: l Alguacil non tira, il Morlock tira su PH 13, fallendo muore', { tpc: a.reg.tiroPerColpire, chi: a.reg.chiTira, v: a.reg.valoreSuccesso, letale: a.reg.fallimentoLetale });
    const b = giro(/^Alguacil \(Paramedic/, /^Morlock \(Assault/, 'MEDIKIT', true, inc);
    ok(b.reg.tiroPerColpire && b.reg.tiroPerColpire.base === 11 && b.reg.tiroPerColpire.burst === 1 && b.reg.valoreSuccesso === 13,
       'SUP-02b MediKit a distanza: BS 11 + banda, Burst 1; poi il Morlock su PH 13', b.reg.tiroPerColpire);
    const c = giro(/^Clockmaker \(Engineer/, /^Reaktion Zond \(HMG/, 'GIZMOKIT', false, inc);
    ok(!c.reg.tiroPerColpire && c.reg.valoreSuccesso === 10 && c.reg.fallimentoLetale === false,
       'SUP-04a GizmoKit in contatto: il Clockmaker non tira, lo Zond su PH 10, fallendo 1 Ferita', { tpc: c.reg.tiroPerColpire, v: c.reg.valoreSuccesso });
    const d = giro(/^Clockmaker \(Engineer/, /^Reaktion Zond \(HMG/, 'GIZMOKIT', true, inc);
    ok(d.reg.tiroPerColpire && d.reg.tiroPerColpire.burst === 2 && d.reg.valoreSuccesso === 10, 'SUP-04b GizmoKit(+1B) a distanza: Burst 2, poi lo Zond su PH 10', d.reg.tiroPerColpire);
    ok(/GizmoKit: TIRO PER COLPIRE Successo al: \d+ \(o meno\) Dadi da lanciare: 2/.test(d.t), 'e il tabellone mostra i 2 dadi del tiro per colpire', d.t.slice(0, 200));
    // Controprova: il Machinist (GizmoKit senza +1B) tira 1 dado.
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'X' })],
                     T => [tr(P_(T, /^Machinist \(D-Charges/), { id: 'p1', alias: 'Mach' }), tr(P_(T, /^Reaktion Zond \(HMG/), Object.assign({ id: 'p2', alias: 'Zond' }, inc))], 'PANOCEANIA');
    const P = T.pano.g; T.apriMenu(T.pano, 0); P.selectAction('MEDICO_INGEGNERE', false); P.scegliStrumentoSupporto('GIZMOKIT'); P.scegliBersaglioSupporto('p2'); P.toggleContattoSupporto();
    const s = spia(P); P.eseguiCalcoloSupporto();
    ok(s.p && s.p[0].reg.tiroPerColpire && s.p[0].reg.tiroPerColpire.burst === 1, 'e il Machinist (GizmoKit senza +1B) a distanza tira 1 dado: la differenza la fa il +1B', s.p && s.p[0].reg.tiroPerColpire);
});

sezione('6. Stati: Disconnesso solo per le Periferiche (ST-05), Morto all Hub (ST-21), Stato Nullo e CAMO (ST-16)', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' }), tr(P_(T, /^Zondmate/), { id: 'n3', alias: 'Zm' }),
                           tr(P_(T, /^Intruder \(HMG/), { id: 'n4', alias: 'Intr', deployState: 'CAMO', states: { camo: true, immobilizedA: true, targeted: true } })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'PANOCEANIA');
    const N = T.nomadi.g, M = N.MotoreN5;
    N.apriPaginaStati(0);
    ok(!/id="st-disc"/.test(T.nomadi.el('states-content').innerHTML), 'ST-05: l Alguacil non ha la casella Disconnesso');
    N.apriPaginaStati(1);
    ok(/id="st-disc"/.test(T.nomadi.el('states-content').innerHTML), 'ST-05: lo Zondmate (Periferica) si`');
    // ST-21: l'Alguacil messo Morto risulta Morto sul tabellone dell'Hub.
    N.apriPaginaStati(0); T.nomadi.el('st-dead').checked = true;
    ['st-unc', 'st-engaged', 'st-imma', 'st-immb', 'st-iso', 'st-tgt', 'st-stun', 'st-supp', 'st-retreat', 'st-poss', 'st-seps'].forEach(id => { T.nomadi.el(id).checked = false; });
    T.nomadi.el('st-ft-team').value = '';
    N.salvaStatiUnita(); T.giro();
    const h = T.hub.g.gameState.nomads.find(u => u.id === 'n1');
    ok(h && h.state === 'DEAD' && /icon_dead/.test(T.hub.g.schedaTruppa(h, 'NOMADI')), 'ST-21: Alguacil messo Morto, all Hub e` Morto con l icona', h && h.state);
    const viva = T.hub.g.gameState.nomads.find(u => u.id === 'n3');
    ok(viva && !/icon_dead/.test(T.hub.g.schedaTruppa(viva, 'NOMADI')), 'CONTROPROVA: lo Zondmate vivo resta senza l icona di Morto');
    // ST-14 / ST-16a: IMM-A, Bersagliato, CAMO, in quest'ordine.
    const ordine = (u) => (M.statiPerCategoria(u) || []).reduce((a, g) => a.concat(g.stati.map(s => s.id)), []);
    ok(J(ordine(N.roster[2])) === J(['immA', 'targeted', 'camo']), 'ST-16a: Immobilizzato-A, Bersagliato, CAMO', ordine(N.roster[2]));
    // ST-16b: anche Incosciente -> lo Stato Nullo annulla il CAMO.
    const st = Object.assign({}, N.roster[2].states, { unconscious: true });
    const canc = M.cancellaStatiMarker(st);
    const dopo = Object.assign({}, N.roster[2], { states: canc.stati, deployState: canc.stati.camo ? 'CAMO' : 'NORMAL' });
    ok(canc.cancellati.indexOf('camo') >= 0 && J(ordine(dopo)) === J(['incosciente', 'immA', 'targeted']), 'ST-16b: Incosciente, Immobilizzato-A, Bersagliato (il CAMO lo annulla lo Stato Nullo)', ordine(dopo));
});

sezione('8. Cybermask e White Noise si dichiarano dalla schermata Hacking (ORD-02)', () => {
    const giro = (re) => { const T = tavolo(T => [tr(P_(T, re), { id: 'n1', alias: 'H' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const N = T.nomadi.g; const menu = T.apriMenu(T.nomadi, 0); N.selectAction('HACKING', false);
        const w = T.nomadi.el('weapon-buttons-container').innerHTML;
        return { T, N, menu, prog: (w.match(/dichiaraProgrammaSenzaTiro\('([^']+)'\)/g) || []).map(x => x.match(/'([^']+)'/)[1]) }; };
    const a = giro(/^Interventor \(Hacker Plus/);
    ok(!/selectAction\('CYBERMASK'/.test(a.menu), 'Interventor: CYBERMASK non e` piu` fra le voci del menu degli Ordini');
    ok(J(a.prog) === J(['CYBERMASK', 'WHITE NOISE']), 'nella schermata Hacking: CYBERMASK e WHITE NOISE, col bottone dei programmi', a.prog);
    const s = spia(a.N); const domande = []; a.N.confirm = (m) => { domande.push(m); return true; };
    (typeof a.N.dichiaraProgrammaSenzaTiro === 'function' ? a.N.dichiaraProgrammaSenzaTiro : () => {})('CYBERMASK'); a.T.giro();
    ok(s.p && s.p[0].az === 'CYBERMASK' && s.op.aroAtteso === true && (a.T.pano.g.currentAttackData || {}).azione === 'CYBERMASK', 'Cybermask: allarme ARO e busta senza tiro con aroAtteso', { p: s.p && s.p[0].az, op: s.op });
    ok(domande.length === 0 && a.N.roster[0].deployState === 'NORMAL', 'nessuna domanda sulla Linea di Tiro, e lo stato IMP-2 non lo mette l app (lo mette il giocatore)', { d: domande.length, dep: a.N.roster[0].deployState });
    a.T.pano.g.annullaAro(); a.T.giro();
    ok(ris(a.T) && /ABILITÀ SENZA TIRO/.test(tab(a.T)) && /CYBERMASK Nessun dado/.test(tab(a.T)), 'sul tabellone: ABILITA` SENZA TIRO, nessun dado', tab(a.T).slice(0, 120));
    const z = giro(/^Zero \(Hacker, Killer/);
    ok(J(z.prog) === J(['CYBERMASK']), 'Zero (Killer Hacking Device): solo CYBERMASK, niente White Noise', z.prog);
    const o = giro(/^Orc \(Hacker, Hacking Device/);
    ok(o.prog.length === 0, 'CONTROPROVA: l Orc (Hacking Device) non ha ne` Cybermask ne` White Noise', o.prog);
});

sezione('7. Ogni schermata parte dall alto (motore_core 2026-10-18.1, Paolo)', () => {
    const T = creaTavolo(DIR); const g = T.nomadi.g;
    ok(typeof g.portaInCima === 'function', 'c e window.portaInCima');
    const passo = { scrollTop: 300, querySelectorAll: () => [{ scrollTop: 120 }, { scrollTop: 0 }] };
    let su = null; g.scrollTo = (x, y) => { su = [x, y]; };
    (typeof g.portaInCima === 'function' ? g.portaInCima : () => {})(passo);
    ok(J(su) === '[0,0]' && passo.scrollTop === 0, 'la pagina torna a (0,0) e il passo a scrollTop 0', { su: su, passo: passo.scrollTop });
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

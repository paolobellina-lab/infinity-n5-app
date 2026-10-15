// @versione 2026-09-23.1 | test_pulsante_calcolo.js | proprieta`: chat TEST
// Il pulsante di calcolo dopo un ordine di movimento — node test_pulsante_calcolo.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) {
    if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, disabled: false,
        appendChild() {}, remove() {},
        cloneNode() { const c = Object.assign({}, this); c.style = Object.assign({}, this.style);
                      c.parentNode = this.parentNode; return c; },
        parentNode: { replaceChild(n) { el[id] = n; } } };
    return el[id];
}
global.document = { title: 'NOMADS TACTICAL TERMINAL', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn-esegui-calcolo'), querySelectorAll: () => [],
    createElement: () => nodo('tmp') };
global.alert = () => {}; global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};
global.inviaCalcoloAllHub = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

console.log('\n=== 1. Il difetto, riprodotto ===');
// Un ordine di puro movimento nasconde il pulsante; cloneNode(true) copia
// lo style inline, quindi il clone nasce già invisibile.
let btn = nodo('btn-esegui-calcolo');
btn.style.display = 'none';                      // come fa ordine_movimento
const cloneIngenuo = btn.cloneNode(true);
cloneIngenuo.innerText = 'ESEGUI CALCOLO';
ok(cloneIngenuo.style.display === 'none',
   'cloneNode(true) eredita display:none — è il difetto');
ok(cloneIngenuo.innerText === 'ESEGUI CALCOLO',
   'e l etichetta è giusta: invisibile, non rotto');

console.log('\n=== 2. M.pulsanteCalcolo lo rende esplicito ===');
el['btn-esegui-calcolo'] = undefined;
btn = nodo('btn-esegui-calcolo');
btn.style.display = 'none';
let premuto = false;
const p = M.pulsanteCalcolo({ etichetta: 'ESEGUI CALCOLO', onclick: () => { premuto = true; } });
ok(p !== null, 'restituisce il pulsante');
ok(p.style.display === '', 'display esplicitamente visibile, malgrado il none di prima');
ok(p.innerText === 'ESEGUI CALCOLO', 'con l etichetta');
p.onclick();
ok(premuto === true, 'e l onclick funziona');

console.log('\n=== 3. Anche in senso inverso ===');
el['btn-esegui-calcolo'] = undefined;
btn = nodo('btn-esegui-calcolo');
btn.style.display = '';                          // visibile
const nascosto = M.pulsanteCalcolo({ nascondi: true });
ok(nascosto.style.display === 'none',
   'chi vuole nasconderlo lo dichiara, e non eredita il visibile');

console.log('\n=== 4. Disabilitato non vuol dire invisibile ===');
el['btn-esegui-calcolo'] = undefined;
nodo('btn-esegui-calcolo');
let premutoD = false;
const dis = M.pulsanteCalcolo({ etichetta: 'RISPONDI ALLE DOMANDE', disabilitato: true,
                                onclick: () => { premutoD = true; } });
ok(dis.style.display === '', 'un pulsante disabilitato resta VISIBILE');
ok(dis.disabled === true, 'ma disabilitato');
dis.onclick();
ok(premutoD === false, 'e il click non fa niente');

console.log('\n=== 5. Tutti i moduli rendono il display esplicito ===');
// Quattordici moduli clonavano il pulsante dando per scontato lo stato
// lasciato da chi aveva usato la schermata prima.
const fs = require('fs');
const MODULI = ['ordine_attacco_bs.js', 'ordine_attacco_cc.js', 'ordine_attacco_guidato.js',
    'ordine_attacco_intuitivo.js', 'ordine_fuoco_speculativo.js', 'ordine_hacking.js',
    'ordine_difesa.js', 'ordine_scoprire.js', 'ordine_supporto.js', 'ordine_scenografia.js',
    'ordine_piazzamento.js', 'ordine_trincerarsi.js', 'ordine_osservazione.js', 'ordine_logistica.js'];
MODULI.forEach(function (f) {
    const t = fs.readFileSync('./' + f, 'utf8');
    ok(/\.style\.display = '';/.test(t), `${f}: rende il display esplicito`);
});

console.log('\n=== 6. Il movimento continua a nasconderlo, ed è giusto ===');
const mov = fs.readFileSync('./ordine_movimento.js', 'utf8');
ok(/btn\.style\.display = 'none'/.test(mov),
   'ordine_movimento lo nasconde ancora: lì non c è nulla da calcolare');
ok(!/style\.display = ''/.test(mov),
   'e NON lo ripristina: non è compito suo sapere chi userà la schermata dopo');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

// @versione 2026-09-23.1 | test_allarme.js | proprieta`: chat TEST
// Test dell'allarme ARO ripetuto — node test_allarme.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

// localStorage finto, con la stessa asimmetria di Firebase: il remoto
// risponde dopo, la copia locale resta finché non torna il null.
const store = {};
let remotoPendente = null;
global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};
const canaliCloud = ['canale_attacco_allarme'];
const originalRemoveItem = global.localStorage.removeItem;

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

// --- la versione VECCHIA di removeItem: solo il remoto ---
function removeItemVecchio(key) {
    if (canaliCloud.includes(key)) {
        remotoPendente = key;          // Firebase risponderà... fra un po'
    } else { originalRemoveItem(key); }
}
// --- la versione NUOVA: subito anche il locale ---
function removeItemNuovo(key) {
    if (canaliCloud.includes(key)) {
        originalRemoveItem(key);
        remotoPendente = key;
    } else { originalRemoveItem(key); }
}

console.log('\n=== 1. LA CAUSA: removeItem non cancellava il locale ===');
store['canale_attacco_allarme'] = '{"attaccanti":["Fusilier"]}';
removeItemVecchio('canale_attacco_allarme');
ok(localStorage.getItem('canale_attacco_allarme') !== null,
   'col vecchio removeItem la chiave resta: chi rilegge la trova ancora');

store['canale_attacco_allarme'] = '{"attaccanti":["Fusilier"]}';
removeItemNuovo('canale_attacco_allarme');
ok(localStorage.getItem('canale_attacco_allarme') === null,
   'col nuovo sparisce subito, senza attendere il giro di rete');

console.log('\n=== 2. LA SECONDA CAUSA: il banner si rimostrava ===');
// Si riproduce il ciclo del setInterval, con la finestra fra invio e null.
let scrollate = 0;
window.mostraBannerAllarme = function () { scrollate++; };
window._allarmiConsumati = [];
window.isReactiveMode = true;

function unGiro(usaMemoria) {
    const attacco = localStorage.getItem('canale_attacco_allarme');
    if (!attacco) return;
    const firma = M.impronta(attacco);
    if (usaMemoria && window._allarmiConsumati.indexOf(firma) >= 0) {
        originalRemoveItem('canale_attacco_allarme');
        return;
    }
    if (usaMemoria) window._allarmiConsumati.push(firma);
    window.currentAttackData = JSON.parse(attacco);
    removeItemNuovo('canale_attacco_allarme');
    window.mostraBannerAllarme();
}

// rete lenta: la chiave ricompare tre volte prima che il null arrivi
scrollate = 0;
for (let i = 0; i < 3; i++) {
    store['canale_attacco_allarme'] = '{"attaccanti":["Fusilier"]}';
    unGiro(false);
}
ok(scrollate === 3, `senza memoria: 3 giri, 3 banner (quindi 3 scrollTo) — ottenuto ${scrollate}`);

scrollate = 0;
window._allarmiConsumati = [];
for (let i = 0; i < 3; i++) {
    store['canale_attacco_allarme'] = '{"attaccanti":["Fusilier"]}';
    unGiro(true);
}
ok(scrollate === 1, `con la memoria: 3 giri, UN solo banner — ottenuto ${scrollate}`);

console.log('\n=== 3. Un attacco DIVERSO deve passare ===');
scrollate = 0;
window._allarmiConsumati = [];
store['canale_attacco_allarme'] = '{"attaccanti":["Fusilier"]}';
unGiro(true);
store['canale_attacco_allarme'] = '{"attaccanti":["Bolt"]}';
unGiro(true);
ok(scrollate === 2, 'due attacchi diversi: due banner');

console.log('\n=== 4. La firma è sul contenuto, non sul tempo ===');
// Due attacchi diversi nello stesso secondo avrebbero lo stesso timestamp.
ok(M.impronta('{"attaccanti":["Fusilier"]}') !== M.impronta('{"attaccanti":["Bolt"]}'),
   'contenuti diversi, firme diverse');
ok(M.impronta('{"attaccanti":["Fusilier"]}') === M.impronta('{"attaccanti":["Fusilier"]}'),
   'contenuto identico, firma identica');

console.log('\n=== 5. La coda non cresce senza fine ===');
window._allarmiConsumati = [];
for (let i = 0; i < 60; i++) {
    store['canale_attacco_allarme'] = '{"n":' + i + '}';
    unGiro(true);
    if (window._allarmiConsumati.length > 40) window._allarmiConsumati.splice(0, 20);
}
ok(window._allarmiConsumati.length <= 41, `la coda resta limitata (${window._allarmiConsumati.length})`);

console.log('\n=== 6. Un allarme illeggibile non blocca il ciclo ===');
store['canale_attacco_allarme'] = 'non sono JSON {{{';
let esploso = false;
try {
    const a = localStorage.getItem('canale_attacco_allarme');
    const f = M.impronta(a);
    try { JSON.parse(a); } catch (e) { window._allarmiConsumati.push(f); originalRemoveItem('canale_attacco_allarme'); }
} catch (e) { esploso = true; }
ok(!esploso, 'si scarta e si prosegue, invece di sollevare a ogni secondo');

console.log('\n=== 7. Il codice vero contiene le due correzioni ===');
const src = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/originalRemoveItem\.call\(localStorage, key\);\s*\n\s*db\.ref\(key\)\.remove\(\)/.test(src),
   'removeItem: locale PRIMA del remoto');
ok(/_allarmiConsumati/.test(src), 'la memoria degli allarmi consumati c è');
ok(/azzeraAllarmiConsumati/.test(src), 'e si può azzerare a fine turno reattivo');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);

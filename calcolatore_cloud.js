// @versione 2026-09-23.1 | calcolatore_cloud.js | proprieta`: chat MOTORE
// Trasporto dell'Hub: rispecchia su Firebase gli 11 canali di localStorage,
// in entrambe le direzioni. Gemello di motore_core.js per l'app giocatore.
// Misurato il 23 settembre prima di prenderlo in carico: 60 righe, zero
// chiamate al motore, zero DOM, zero aritmetica di gioco.
// ⚠️ ORDINE: legge M.CANALI al caricamento, quindi nell'Hub va caricato
// DOPO motore_regole_n5.js (e dopo gli script di Firebase).
// ==========================================
// ☁️ MODULO CLOUD MANAGER N5 (COMPAT) - calcolatore_cloud.js
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAMpF8Le_srYjxgC7vb231Ng40iXwr256o",
    authDomain: "infinityn5-database.firebaseapp.com",
    databaseURL: "https://infinityn5-database-default-rtdb.firebaseio.com",
    projectId: "infinityn5-database",
    storageBucket: "infinityn5-database.firebasestorage.app",
    messagingSenderId: "506923243459",
    appId: "1:506923243459:web:4aa5e59c84c9d8156c4f76"
};

// Inizializza Firebase Compat (Evita i blocchi CORS del browser per i file locali)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- MOTORE CLOUD INVISIBILE ---
// L'elenco dei canali viene dal MOTORE, una volta sola (M.CANALI).
// Prima era una copia qui e una in motore_core.js: due elenchi da
// tenere uguali a mano. (Chat INTERFACCIA + MOTORE, 23 settembre.)
const canaliCloud = Object.values(window.MotoreN5.CANALI);

const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

canaliCloud.forEach(canale => {
    db.ref(canale).on('value', (snapshot) => {
        const dati = snapshot.val();
        if (dati !== null) {
            originalSetItem.call(localStorage, canale, dati);
            let eventoFake = new Event('storage');
            eventoFake.key = canale;
            eventoFake.newValue = dati;
            window.dispatchEvent(eventoFake);
        } else {
            originalRemoveItem.call(localStorage, canale);
        }
    });
});

localStorage.setItem = function(key, value) {
    if (canaliCloud.includes(key)) {
        db.ref(key).set(value);
    } else {
        originalSetItem.call(localStorage, key, value);
    }
};

localStorage.removeItem = function(key) {
    if (canaliCloud.includes(key)) {
        db.ref(key).remove();
    } else {
        originalRemoveItem.call(localStorage, key);
    }
};

console.log("☁️ N5 Cloud Manager Inizializzato in modalità Compat.");
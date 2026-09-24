// ============================================================================
//  test_nomi_nella_prosa.js
//  Dalla chat INTERFACCIA, 23 settembre 2026.
//
//  COSA CONTROLLA
//  I TESTI mostrati al giocatore — note del catalogo, messaggi del motore —
//  nominano stati. Quando uno stato esce dal vocabolario, quei testi restano:
//  e' la stessa forma del campo scritto e mai letto, ma a sbagliarsi e' chi
//  legge lo schermo. Nessun altro test guarda la prosa.
//
//  COME RICONOSCE UN NOME DI STATO
//  Solo dalla forma con cui il regolamento lo scrive: "Stato X". Un elenco di
//  parole scritto a mano sarebbe un TERZO vocabolario: provato, dava nove
//  falsi allarmi — "Nullo", "Fuoco", "Marker" sono prosa, non stati.
//
//  IL VOCABOLARIO CONTRO CUI CONFRONTA
//  CATALOGO_N5.STATI + M.NOMI_STATI + CATALOGO_N5.STATI_NON_GESTITI +
//  le CATEGORIE. Servono tutti e quattro: gli stati hanno oggi DUE
//  vocabolari con chiavi diverse (13 voci inglesi nel catalogo, 20 italiane
//  nel motore), e "Stato Nullo" e' una categoria, non uno stato.
//  Quando i due vocabolari saranno unificati, questo elenco si accorcia.
//
//  USO:  node test_nomi_nella_prosa.js
//  ATTESO: 0. Al 23 settembre ne trova 2, ed e' giusto che sia rosso:
//    Camuffato  la prosa dice "stato Camuffato", il vocabolario "Mimetizzato"
//               — stesso stato, due nomi diversi mostrati al giocatore
//    Scarico    "stato Scarico" non sta in nessun vocabolario: o e' uno stato
//               non gestito da dichiarare, come il Prono, o manca
// ============================================================================

// Cerca nei TESTI mostrati al giocatore i nomi di STATO che nessun
// vocabolario conosce. Non usa un elenco di parole scritto a mano: quello
// sarebbe un terzo vocabolario, e ha prodotto nove falsi allarmi
// ("Nullo", "Fuoco", "Marker" sono prosa, non stati).
//
// Il segnale e` la forma con cui il regolamento nomina uno stato:
// "Stato X" / "stato X". Tutto il resto non viene guardato.
global.window=global; const fs=require('fs');
global.document={title:'NOMADS',getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};
global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
eval(fs.readFileSync('/mnt/project/catalogo_n5.js','utf8'));
eval(fs.readFileSync('/mnt/project/database_comune.js','utf8'));
eval(fs.readFileSync('/mnt/project/motore_regole_n5.js','utf8'));
const M=window.MotoreN5, C=window.CATALOGO_N5;

// il vocabolario: tutti i nomi che un testo puo` legittimamente citare
const conosciuti=new Set();
const aggiungi=(x)=>{ if(x) conosciuti.add(String(x).toLowerCase()); };
Object.keys(C.STATI||{}).forEach(k=>{ aggiungi(k); aggiungi((C.STATI[k]||{}).nome); });
Object.keys(M.NOMI_STATI||{}).forEach(k=>{ aggiungi(k); aggiungi((M.NOMI_STATI[k]||{}).nome); });
Object.keys(C.STATI_NON_GESTITI||{}).forEach(k=>{ aggiungi(k); aggiungi((C.STATI_NON_GESTITI[k]||{}).nome); });
// anche le CATEGORIE sono nomi che i testi citano legittimamente:
// "Stato Nullo" e` una categoria, non uno stato.
(C.CATEGORIE_STATI||[]).forEach(aggiungi);
aggiungi('Null');

const file=['catalogo_n5.js','motore_regole_n5.js','database_comune.js'];
const fuori={};
file.forEach(f=>{
  const s=fs.readFileSync('/mnt/project/'+f,'utf8');
  s.split('\n').forEach((riga,i)=>{
    if(/^\s*\/\//.test(riga)) return;               // i commenti non li legge il giocatore
    let m; const re=/\bstato\s+([A-Z][A-Za-zà-ùÀ-Ù\-]{2,})/g;
    while((m=re.exec(riga))){
      // "Impersonation-1" e "IMM-A" sono LIVELLI dello stesso stato:
      // si toglie il suffisso prima di confrontare, altrimenti ogni
      // livello risulta uno stato sconosciuto.
      const nome=m[1].replace(/[.,;:!?'`]+$/,'').replace(/-\s*[0-9A-B]$/,'').replace(/-$/,'');
      if(conosciuti.has(nome.toLowerCase())) continue;
      (fuori[nome]=fuori[nome]||[]).push(f+':'+(i+1));
    }
  });
});
console.log('vocabolario riconosciuto:', conosciuti.size, 'nomi (STATI + NOMI_STATI + STATI_NON_GESTITI)');
const nomi=Object.keys(fuori);
console.log('nomi di stato citati nei testi e sconosciuti:', nomi.length);
nomi.forEach(n=>console.log('   ', n, '->', fuori[n].slice(0,3).join(', '), fuori[n].length>3?('e altri '+(fuori[n].length-3)):''));
process.exit(nomi.length?1:0);

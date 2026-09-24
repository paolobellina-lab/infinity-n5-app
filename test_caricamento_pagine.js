// @versione 2026-09-23.1 | test_caricamento_pagine.js | proprieta`: chat TEST
// ============================================================================
//  test_caricamento_pagine.js
//  Dalla chat INTERFACCIA, 23 settembre 2026.
//
//  COSA CONTROLLA
//  Per ogni pagina: che ogni script dichiarato esista, COMPILI, e giri senza
//  sollevare. Tre esiti distinti, perche' sono guasti diversi:
//     ASSENTE DAL DISCO     il tag punta a un file che non c'e'
//     NON COMPILA           errore di sintassi: nel browser il file sparisce
//     ERRORE ESEGUENDO      compila ma esplode al caricamento
//
//  PERCHE' ESISTE
//  Tutti i nostri banchi caricavano gli script con catch(e){} vuoto. Un file
//  rotto spariva in silenzio e la verifica continuava dicendo "tutto bene":
//  e' il difetto che la chat TEST ci ha segnalato il 23 settembre. Questo
//  banco fa il contrario — nomina ogni guaio invece di ingoiarlo.
//
//  COSA HA TROVATO SUBITO
//  1. L'ultimo blocco inline di app.html si fermava a window.history.pushState,
//     perche' l'ambiente di prova non aveva history. Dopo quella riga ci sono
//     solo service worker e wake lock, quindi nessuna funzione di gioco e'
//     mai andata persa — ma nessun banco poteva dirlo, e per settimane
//     abbiamo verificato meta' di quel blocco senza saperlo.
//  2. calcolatore_hub.html dichiara calcolatore_cloud.js, che non e' nel
//     contesto di progetto: nel browser sarebbe un 404, cioe' l'Hub senza
//     sincronizzazione.
//
//  USO:  node test_caricamento_pagine.js
//  ATTESO: 0 con problemi su ogni pagina.
// ============================================================================

// Carica gli script dichiarati da una pagina e NON ingoia gli errori.
const fs=require('fs'), vm=require('vm'), path=require('path');
// La cartella si puo` passare, per provare una correzione PRIMA di
// caricarla nel progetto:  CARTELLA=/percorso/ node test_caricamento_pagine.js
const cartella=(process.env.CARTELLA || '/mnt/project/').replace(/\/?$/,'/');
function prova(pagina){
  const h=fs.readFileSync(cartella+pagina,'utf8');
  const g={}; g.window=g; g.globalThis=g; g.console={log:()=>{},warn:()=>{},error:()=>{}};
  const el={}; const finto=(id)=>{if(!el[id])el[id]={id,innerHTML:'',style:{},appendChild:()=>{},addEventListener:()=>{},value:'',classList:{add:()=>{},remove:()=>{}},setAttribute:()=>{},getAttribute:()=>null,options:[],cloneNode(){return finto(id+'_c');},parentNode:{replaceChild:()=>{},insertBefore:()=>{}},querySelector:()=>null};return el[id];};
  const canali={};
  g.localStorage={getItem:k=>canali[k]||null,setItem:(k,v)=>canali[k]=v,removeItem:k=>delete canali[k]};
  g.location={search:'?fazione=nomadi',replace:()=>{}};
  let t=(h.match(/<title>([^<]*)<\/title>/)||[])[1]||'';
  // document.write ESISTE nel browser e serve a scrivere la testa durante
  // il parsing (app.html sceglie li` manifest e icona della fazione).
  // Senza, il banco dava un falso ROSSO: "document.write is not a function".
  // Qui si raccoglie quello che viene scritto invece di eseguirlo.
  const scrittoInTesta=[];
  g.document={get title(){return t;},set title(v){t=v;},documentElement:{setAttribute:()=>{}},scripts:[],
    write:(x)=>scrittoInTesta.push(String(x)), writeln:(x)=>scrittoInTesta.push(String(x)),
    getElementById:finto,createElement:()=>finto('n'),querySelector:()=>finto('q'),querySelectorAll:()=>[],addEventListener:()=>{}};
  ['alert','scrollTo','addEventListener'].forEach(k=>g[k]=()=>{});
  g.setInterval=()=>0; g.setTimeout=()=>0; g.prompt=()=>null; g.confirm=()=>true;
  // history e navigator servono davvero: senza, l'ultimo blocco inline si
  // ferma a meta` e un catch vuoto lo nasconde.
  g.history={pushState:()=>{},replaceState:()=>{}};
  g.navigator={serviceWorker:undefined};
  g.firebase={initializeApp:()=>{},database:()=>({ref:()=>({on:()=>{},set:()=>{},remove:()=>{}})})};
  const ctx=vm.createContext(g);
  const esiti=[];
  [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{
    const src=m[1];
    if(src){
      if(/^https?:/.test(src)) return;
      const nome=src.split('?')[0], f=cartella+nome;
      if(!fs.existsSync(f)) { esiti.push([nome,'ASSENTE DAL DISCO']); return; }
      // sintassi PRIMA di eseguire: separa "non compila" da "esplode girando"
      const codice=fs.readFileSync(f,'utf8');
      try { new vm.Script(codice, {filename:nome}); }
      catch(e){ esiti.push([nome,'NON COMPILA: '+e.message]); return; }
      try { vm.runInContext(codice, ctx, {filename:nome}); esiti.push([nome,'ok']); }
      catch(e){ esiti.push([nome,'ERRORE ESEGUENDO: '+e.message]); }
    } else {
      try { new vm.Script(m[2], {filename:pagina+' inline#'+i}); }
      catch(e){ esiti.push([pagina+' inline#'+i,'NON COMPILA: '+e.message]); return; }
      try { vm.runInContext(m[2], ctx, {filename:pagina+' inline#'+i}); esiti.push([pagina+' inline#'+i,'ok']); }
      catch(e){ esiti.push([pagina+' inline#'+i,'ERRORE ESEGUENDO: '+e.message]); }
    }
  });
  return esiti;
}
// UNA PAGINA PER PROCESSO. Caricandole di seguito nello stesso processo, i
// simboli rimasti in memoria dalla prima coprono i buchi della seconda: il
// banco dava "0 problemi" sull'Hub mentre il suo calcolatore_cloud.js era
// rotto, perche` il motore caricato da app.html era ancora li`.
// (Segnalato dalla chat TEST il 23 settembre: e` la specie del catch vuoto,
//  ma piu` nascosta \u2014 li` si ingoia un errore, qui lo si impedisce.)
const PAGINE=['app.html','calcolatore_hub.html'];
if (process.argv[2]) {
  // processo figlio: una pagina sola
  const p=process.argv[2];
  const e=prova(p);
  const guai=e.filter(x=>x[1]!=='ok');
  console.log('=== '+p+': '+e.length+' script, '+guai.length+' con problemi');
  guai.forEach(x=>console.log('   ', x[0], '->', x[1].slice(0,110)));
  process.exit(guai.length ? 1 : 0);
} else {
  const {execFileSync}=require('child_process');
  let rotte=0;
  PAGINE.forEach(p=>{
    try { console.log(execFileSync(process.execPath,[__filename,p],{encoding:'utf8'}).trim()); }
    catch(err){ rotte++; console.log((err.stdout||'').trim()); }
  });
  console.log(rotte ? ('\nPAGINE CON PROBLEMI: '+rotte) : '\nTutte le pagine caricano.');
  // Riga di riepilogo nel formato degli altri banchi: senza, chi somma la
  // suite legge "?" e conta zero — un rosso qui non si vedrebbe nel totale.
  console.log(`\n──────────────\n${PAGINE.length - rotte} passati, ${rotte} falliti\n`);
  process.exit(rotte ? 1 : 0);
}

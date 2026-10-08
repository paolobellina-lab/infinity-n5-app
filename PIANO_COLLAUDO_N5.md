<!-- @versione 2026-10-08.3 | PIANO_COLLAUDO_N5.md | proprieta`: chat TEST -->

# Piano di collaudo — Calcolatore Infinity N5 (revisione 16)

La **revisione 16** aggiunge il **blocco SG** (dieci prove: la Sagoma e i
tuoi alleati — la domanda nuova, il colpo annullato per tutti, il Fumo che non
si annulla mai, il secondario che ora arriva sul tabellone).

La **revisione 15** aveva aggiunto due prove al blocco SP — **SP-10** (Scoprire +
Piazzare quando reagisce il Marker stesso) e **SP-11** (Coordinato con quattro
partecipanti).

La **revisione 14** aveva aggiunto il **blocco SP** e **corretto la
convenzione 4**, che diceva una cosa sbagliata e bloccava il tavolo.

Sostituisce la revisione 13 dell'8 ottobre. **296 prove, tutte nello stesso
format**: si eseguono dall'app, una per una, senza dover andare a
cercare un'altra prova per capire cosa fare.

**Dove guardare se un numero non torna:** prima la scheda ufficiale della
miniatura, poi il **blocco DC** in fondo — potrebbe essere una prova con un
campo da completare, non un difetto dell'app.

# 0. Quello che è cambiato dalla revisione 12

**Ogni prova è riscritta nel format dichiarato dal piano stesso**, tutte e 296, nelle stesse
cinque righe: Attivo, Con, Bersaglio, ARO, Atteso. Prima erano scritte in modi
diversi — alcune su quattro righe, altre tutto su una — e **42 ereditavano
dalla precedente** ("Come BS-01 ma l'ARO bersaglia un'altra unità"): quelle
sono sciolte, e ogni prova si legge da sola senza andare a cercarne un'altra.
Le note storiche sono via: restano solo le frasi che servono a **leggere** il
risultato.

**Le tabelle sono diventate prove.** PRE-01…09, AR-01…11, ST-01…14,
ER-01…22, MU-01…14 e TER-01…08 erano righe di tabella senza i campi: ora sono
76 prove intere come le altre.

**Quattro convenzioni nuove** (pagina 3) evitano di ripetere la stessa riga
284 volte: stato non scritto = Normale, metà dell'Ordine non scritta = una
dichiarazione sola, copertura non scritta = da decidere al tavolo,
`ARO: nessuno` = il reattivo c'è ma non dichiara niente.

**Quello che manca è dichiarato, non riempito a caso.** 118 prove hanno un
campo che il piano non dice: sono marcate **DA COMPLETARE** dentro la prova,
e l'elenco sta nel **blocco DC** in fondo. Lì ci sono anche le due prove non
eseguibili così come sono (SW-03 senza Atteso, TPL-04 senza il valore del
reattivo) e quattro contraddizioni interne da decidere.

**Una prova aveva il valore sbagliato.** SPEC-02 chiedeva **18**, cioè il −6
che salta contro un bersaglio Bersagliato: è la regola **N4**. Misurato col
motore: **12** (PH 12 +3 gittata −6 fisso +3 Bersagliato). In N5 il −6 si
applica sempre (riga 3920) e il Bersagliato è un MOD positivo (riga 14646).

**Una miniatura in più nel roster.** Il blocco F chiede le **Grenades**, e
nessuna delle 24 truppe nomadi del roster le portava: i numeri del blocco
valgono per l'`Intruder (Hacker, Killer Hacking Device)`, che è ora la voce
**25**. È lo stesso difetto del Kulak e dell'Intruder (HMG), trovato con la
stessa ricerca sul database.

**Cinque codici erano doppi.** `DIS-01…DIS-05` identificava due gruppi di
prove diversi, nel blocco J (Scoprire) e nel blocco 23-bis (Disposable):
dieci prove, cinque codici. Le cinque dello Scoprire sono ora
**SCO-01…SCO-05**. Adesso i codici sono tutti univoci: alla revisione 16 sono 296.

**Resta aperto un difetto solo**, il Burst della Soppressione in reazione
(BS-12 / D-02).

# 0-bis. Come si legge una prova

```
CODICE — titolo
  Attivo:    unità (stato) · 1ª metà → 2ª metà
  Con:       arma / programma
  Bersaglio: unità (stato) @ banda, copertura sì/no
  ARO:       unità (stato) → azione, arma, banda, contro chi
  Atteso:    quello che devi leggere
```

Senza ARO il reattivo dichiara **Nessun ARO** e il confronto deve uscire
**TIRO NORMALE**. Le bande si contano dal Weapon Chart, otto pollici l'una:
banda 0 = 0-8", banda 1 = 8-16", banda 2 = 16-24", e così via.

## Quattro convenzioni, per non ripetere la stessa riga 296 volte

Valgono per **tutte** le prove, e sono la ragione per cui i cinque campi sono
spesso più corti del format completo:

1. **Stato non scritto = Normale.** Dove una prova non dice lo stato di
   un'unità, quell'unità è in Stato Normale.
2. **Metà dell'Ordine non scritta = una dichiarazione sola.** La prova si
   esegue dichiarando l'azione indicata e basta, senza una seconda metà.
3. **Copertura non scritta = da decidere al tavolo**, e il valore atteso vale
   per la situazione che la prova descrive. Dove la copertura cambia il
   numero, la prova la dice: se non la dice e il numero non torna, prova
   **senza** copertura prima di segnalare un difetto.
4. **`ARO: nessuno`** vuol dire che il reattivo dichiara **PASSA (NESSUN
   ARO)**, non che resti zitto: il bersaglio resta in campo e deve comparire
   sul tabellone con "Nessun ARO".

   🔴 **CORRETTA L'8 OTTOBRE, e va letta prima di giocare.** Fino alla
   revisione 13 questa convenzione diceva "il reattivo non dichiara niente".
   È sbagliato e **blocca il tavolo**: dopo la prima metà di un Ordine
   l'allarme è già partito, la busta porta `aroAtteso`, e l'Hub **aspetta una
   risposta** prima di calcolare. Chi reagisce deve toccare **PASSA (NESSUN
   ARO)** — che spedisce una lista di reazioni vuota — altrimenti lo scontro
   non compare e sembra che l'app si sia piantata. Lo stesso valeva già per
   l'attivo, che senza risposta resta fermo perché lo sblocco parte solo da
   lì. Dato misurato dalla chat INTERFACCIA sui tre dispositivi.

Dove invece manca un dato che nessuna convenzione può sostituire — quale
unità usare, quale arma, quale banda — c'è scritto **DA COMPLETARE** o
**non detta**. Sono buchi veri del piano, non abbreviazioni: l'elenco
completo sta in fondo, nel **blocco DC**.

## I numeri, e da dove vengono

**I numeri delle truppe vengono dal JSON ufficiale**: 765 profili. Se una
prova dà un numero diverso da quello scritto qui, guarda prima la scheda
ufficiale — il piano invecchia insieme ai dati.

Le prove si eseguono **dall'app**. Tutto ciò che si poteva verificare col
motore è **verde**: **93 file di test, 4111 prove, 0 falliti**, nessun banco
muto, banco di confronto a zero divergenze (354 scontri identici, 294 attese,
uscita 0). La cartella è allineata su tutte e tre le chat.

🔴 **Il numero delle prove di questo piano non si cambia più a mano.**
`test_piano_schieramento.js` le conta nel testo e pretende che i cinque punti
che lo dichiarano dicano tutti lo stesso numero, che i codici siano uno per
prova e senza doppioni, e che il blocco DC dichiari quante prove hanno
davvero un campo da completare. L'8 ottobre ha trovato quattro numeri
sbagliati, fra cui un "135 prove su 277" che non era mai stato giusto.
Il conto della **suite** qui sopra resta invece una misura del momento, come
un'impronta: va riletto a ogni giro.

I valori attesi sono calcolati con `motore_regole_n5.js` **2026-10-08.9,
impronta `f55db800.690577`**, `catalogo_n5.js` **2026-10-07.3, impronta
`40d0a9f7.195688`**, `motore_core.js` **2026-10-07.1, impronta
`8e76e8a1.39346`** e `calcolatore_math.js` **2026-10-07.4, impronta
`afb03fe9.18214`**, sui profili veri. Dei file di INTERFACCIA: `app.html`
**2026-10-07.5**, `logica_aro.js` **2026-10-07.2**, `calcolatore_controller.js`
e `calcolatore_hub.html` **2026-10-07.1**. Le regole citate rimandano a
`REGOLE_N5_v5_1_1.txt` (impronta `5ea7581f.904498`, 17029 righe), con
`grep -n`.

Il conteggio dei banchi si legge così: **un file, una riga di riepilogo**, e
si somma su tutti i file `test_*.js`, `test_collaudo_suite.js` compreso.
`banco_confronto.js` non stampa quella riga e non entra nel totale.

---

# 1. Preparazione

## 1.1 Roster

**Nomadi** — Sessione A i primi dieci, Sessione B gli altri. Nessuna prova
salta fra le due.

| # | Profilo | Serve per |
|---|---|---|
| 1 | Alguacil (Combi Rifle) | BS base, gittate, contratto |
| 2 | Alguacil (HMG) | bande negative, Burst 4, Coordinato |
| 3 | Alguacil (Missile Launcher) | Sagoma a Impatto, EXP, **Guidato** |
| 4 | Alguacil (Forward Observer) | Flash Pulse, Stato Bersagliato |
| 5 | Alguacil (Paramedic) | MediKit |
| 6 | Daktari (Doctor) | Dottore |
| 7 | Clockmaker (Engineer) | Ingegnere, GizmoKit(+1B) |
| 8 | Interventor (Hacker Plus) | Carbonite, Oblivion, Spotlight, Total Control |
| 9 | Zero (Hacker, Killer Hacking Device) | Trinity, Camo, mine |
| 10 | Intruder (X Visor) | MSV L2 + X Visor, Surprise Attack |
| 11 | Grenzer (Marksmanship) | Marksmanship |
| 12 | Grenzer (Forward Observer, Sensor, NCO) | MSV L1, **le tre osservazioni** |
| 13 | Morlock (Assault Pistol) | Martial Arts L2, Chain Rifle, **No Cover** |
| 14 | Chimera | Natural Born Warrior, CC Attack (-3) |
| 15 | Reaktion Zond (HMG) | Total Reaction, REM |
| 16 | Mobile Brigada (HMG) | HI, ARM 5 |
| 17 | Puppetbot (Red Fury) | BS Attack (+1B), Dodge (+3) |
| 18 | Zondmate (REM) | PARA CC Weapon |
| 19 | **Moran (Surprise Attack, Camouflage)** | **CrazyKoalas, D-Charges** |
| 20 | **Sin-Eater (MULTI Sniper Rifle)** | **Neurocinetics** |
| 21 | **Mary Problems (Hacker)** | Pitcher, Zapper, upgrade hacking |
| 22 | **Puppet Masters (Minelayer)** | **Minelayer**, Shock Mine 3/3 |
| 23 | **Kulak (Hacker, Killer Hacking Device)** | **Disco Baller** → Disco Ball, Cybermine 3/3 |
| 24 | **Intruder (HMG)** | **BS-07**: MSV L2 annulla il Mimetismo −6, Burst 4 |
| 25 | **Intruder (Hacker, Killer Hacking Device)** | **blocco F**: è il solo del roster con le **Grenades** (Fuoco Speculativo) |

**PanOceania**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Fusilier (Combi Rifle) | bersaglio di riferimento (ARM 1, BTS 0, PH 10) |
| 2 | Fusilier (Missile Launcher) | ARO con arma pesante |
| 3 | Fusilier (Forward Observer) | Flash Pulse in ARO, Repeater |
| 4 | Orc (Hacker, Hacking Device) | hackerabile, ARM 4 / BTS 3 |
| 5 | Nisse (Heavy Machine Gun) | Mimetismo -3 + MSV L2 |
| 6 | Croc Man (MULTI Sniper Rifle) | TO Camo, Mimetismo -6, **Hidden Deployment** |
| 7 | Teutonic Knight (TinBot: Firewall) | Firewall -3, Martial Arts L2 |
| 8 | Tikbalang | TAG, **ECM (Guided -6)**, Heavy Flamethrower |
| 9 | Sierra Dronbot (Heavy Machine Gun) | Total Reaction in ARO |
| 10 | Zulu-Cobra (Triangulated Fire, Sensor) | Camo, **Triangulated Fire** |
| 11 | Aquila | MSV L3, ARM 6 |
| 12 | **Squalo Mk-II (MULTI Marksman Rifle)** | **Combat Instinct**, TAG |
| 13 | Machinist (Combi Rifle) | Ingegnere lato Pano, Deployable Cover |
| 14 | **Dr. Harper FTO** | **BS-22**: No Cover, nessun Mimetismo — i due MOD non si confondono |
| 15 | **Swiss Guard (Heavy Machine Gun, Pulzar)** | **BS-21**: Mimetismo −6 per arrivare al tetto dei MOD |

## 1.2 Terreni

In schieramento: **TER_10 Bosco**, **TER_11 Giungla**, **TER_13 Foresta
Primordiale**, **TER_17 Sala Generatori**. Senza, il menu terreni resta su
"Nessun Terreno Speciale" e il blocco R non è eseguibile.

---

# 2. Preflight — una volta, in console, su app.html

**PRE-01 — `MotoreN5.autotest()`**
- **Attivo:** `MotoreN5.autotest()`
- **Atteso:** `["contratto coerente"]`

**PRE-02 — `verificaRouter()`**
- **Attivo:** `verificaRouter()`
- **Atteso:** `["router coerente col motore"]`. Qualunque "modulo NON CARICATO" significa uno `<script>` mancante in `app.html`

**PRE-03 — `MotoreN5.verificaDati()`**
- **Attivo:** `MotoreN5.verificaDati()`
- **Atteso:** `{ok:true, mancanti:[], firme:[]}`

**PRE-04 — `MotoreN5.verificaVersioni()`**
- **Attivo:** `MotoreN5.verificaVersioni()`
- **Atteso:** nessun disallineamento

**PRE-05 — `MotoreN5.datiMancanti()`**
- **Attivo:** `MotoreN5.datiMancanti()`
- **Atteso:** array vuoto

**PRE-06 — `riepilogaOrdiniNascosti()`**
- **Attivo:** `riepilogaOrdiniNascosti()`
- **Atteso:** l'elenco degli ordini che il filtro nasconde, col motivo. Atteso oggi: vuoto o quasi

**PRE-07 — `MotoreN5.improntaProgetto()`**
- **Attivo:** `MotoreN5.improntaProgetto()`
- **Atteso:** annotala: serve per citare i file alle altre chat

**PRE-08 — ricarica e guarda la console**
- **Attivo:** ricarica e guarda la console
- **Atteso:** nessun `⛔`, nessun `modulo mancante`

**PRE-09 — guarda se ci sono errori sulle immagini**
- **Attivo:** guarda se ci sono errori sulle immagini
- **Atteso:** la cartella `img/` deve stare accanto ad `app.html`: senza, mancano i ritratti e le icone di stato, e il blocco M si legge male

Se PRE-01 o PRE-02 falliscono, fermati.

---

# 3. Blocco A — Ordini senza tiro e generazione ARO

**A-01 — Movimento semplice**
- **Attivo:** Alguacil (Combi Rifle) (Normale) · MUOVERE → MUOVERE
- **ARO:** nessuno
- **Atteso:** nessun calcolo, ordine intero consumato, **ARO generato**.

**A-02 — Movimento + attacco**
- **Attivo:** — *(il piano non dice l'unità né lo stato)* · MUOVERE → ATTACCO BS
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** la prima metà non chiede nulla, il calcolo parte sulla seconda.

**A-03 — Cauto: la domanda viene prima** *(risolto, da confermare)*
- **Attivo:** — *(il piano non dice l'unità né lo stato)* · MOVIMENTO CAUTO
- **ARO:** nessuno
- **Atteso:** **prima di rispondere non parte niente** — nessun allarme all'avversario e nessuna busta all'Hub — e a schermo ci sono due pulsanti, "fuori da LoF e ZdC" e "dentro". Rispondendo **dentro**: allarme spedito, ARO generato, una busta sola.

**A-04 — Cauto fuori da LoF e ZdC**
- **Attivo:** — *(il piano non dice l'unità né lo stato)* · MOVIMENTO CAUTO, rispondendo **fuori da LoF e ZdC**
- **ARO:** nessuno
- **Atteso:** **nessun allarme**, con il motivo completo; la busta all'Hub parte lo stesso, perché l'ordine è finito. E ogni nuovo ordine riparte senza risposta: il secondo Cauto non eredita quella del primo.

**A-05 — Cauto negato**
- **Attivo:** Reaktion Zond, Zondmate e Alguacil (**Bersagliato**) · MOVIMENTO CAUTO
- **Atteso:** il bottone non compare per REM, TAG, VH, AI Motorcycle e Bersagliati.

**A-06 — Idle** *(risolto, confermato in Node)*
- **Attivo:** Alguacil · IDLE
- **ARO:** nessuno
- **Atteso:** nessuna azione, ma **ARO generato** — regolamento p.80, "its declaration just activates the Trooper, potentially generating AROs".

**A-07 — Requisito non soddisfatto → Idle**
- **Attivo:** Moran (Surprise Attack, Camouflage) (segnalino mimetico, in copertura) · PIAZZARE EQUIPAGGIAMENTO, rispondendo **sì** alla domanda "c'è un nemico nell'Area d'Innesco?" — il requisito non è soddisfatto
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** tutte e tre: l'azione diventa **Idle**; l'**ARO viene generato lo stesso**; l'**uso del CrazyKoala è speso** e non torna indietro; e il Moran **si rivela**, col modello messo dov'era il segnalino.

**A-08 — Salto e scalata**
- **Attivo:** Morlock · SALTO
- **ARO:** nessuno
- **Atteso:** nessun calcolo, ARO generato, **ordine intero** consumato.

**A-09 — Climbing Plus** *(risolto, da confermare)*
- **Attivo:** Mary Problems (Climbing Plus) · ARRAMPICARSI; e un Alguacil · ARRAMPICARSI
- **ARO:** nessuno
- **Atteso:** con la skill l'arrampicata è **mezzo ordine** e resta la seconda metà per un'altra Abilità Breve; senza, ordine intero.

**A-10 — Ordini senza modulo**
- **Attivo:** il menu di una truppa — *(il piano non dice quale)*: si prova ogni voce, una per una. Utile anche `verificaRouter()` in console, che risponde su tutte insieme
- **Atteso:** deve dare **zero risultati**. Ogni voce apre una schermata. Se una dà **"Azione non riconosciuta"**, manca lo `<script>` di quel modulo in `app.html`.

**A-11 — Requisiti di menu**
- **Attivo:** il menu azioni dei profili elencati qui sotto: si guarda quali voci compaiono e quali no
- **Atteso:** qui si prova che una voce **manchi** dove deve mancare; vederla quasi sempre non è un difetto.
  - **SOPPRESSIONE**: ce l'hanno **462 profili su 765**, perché Combi Rifle, Rifle, HMG, Spitfire e Red Fury portano tutti il Tratto Suppressive Fire. Per provare il filtro serve una truppa **senza**: **Grenzer (Missile Launcher)**, **Grenzer (MULTI Sniper Rifle)**, **Hellcat (Boarding Shotgun)** — lì la voce NON deve comparire. Attenzione al profilo e non alla truppa: il **Morlock (Combi Rifle) la ha**, il Morlock (Assault Pistol) no.
  - **HACKING** solo a chi ha Hacker o un dispositivo. Con **due** dispositivi i programmi si sommano: **Mary Problems** vede Trinity, Carbonite, Oblivion, Spotlight e Total Control.
  - **SUPPORTO** deve comparire su **Daktari (Doctor)**, **Alguacil (Paramedic)**, **Hellcat (Paramedic)** e su chi porta un GizmoKit (i **Clockmaker**). NON su un Alguacil (Combi Rifle) qualunque.
  - **PIAZZARE EQUIPAGGIAMENTO**: 116 profili. Sì su **Moran (Surprise Attack, Camouflage)** coi CrazyKoalas, **Spektr (Minelayer)** con E/M Mine e Shock Mine, **Heckler (Hacker, Killer Hacking Device)**. NO su un Fusiliere.

**A-12 — Io muovo, tu mi spari** *(era il difetto che bloccava)*
- **Attivo:** Alguacil (Combi Rifle) · MUOVERE → MUOVERE
- **ARO:** Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, banda 1, contro l'Alguacil
- **Atteso:** **TIRO NORMALE**, un solo scontro. Il Fusiliere tira **15** con **un dado**, l'Alguacil non oppone niente e fa il Tiro Salvezza **ARM VS 8** se colpito. Sul tabellone il Fusiliere deve comparire sotto **PanOceania**, non sotto la fazione attiva: lo scontro è marcato come reazione non bersagliata.

**A-13 — Lo stesso con gli altri ordini senza tiro** *(chiuso il 7 ottobre)*
- **Attivo:** Alguacil (Combi Rifle) · tre prove, una per azione: **MOVIMENTO CAUTO** rispondendo "dentro", **SALTO**, **IDLE**
- **ARO:** Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, banda 1, contro l'Alguacil
- **Atteso:** in tutti, l'avversario riceve l'allarme e il tiro del reattivo compare.
  - 🔴 **PIAZZARE EQUIPAGGIAMENTO non va provato qui**, e il motivo è una regola, non un dettaglio: **Place Deployable è un'Abilità Breve ed è SEMPRE la seconda metà dell'Ordine** (riga 7550; combinazioni alle righe 1047-1054). Le tre forme ammesse sono **MOVIMENTO + PIAZZARE**, **SCOPRIRE + PIAZZARE**, **IDLE + PIAZZARE**. Dichiararlo per primo e poi muoversi è una combinazione **che non esiste**: chi "piazza e basta" ha dichiarato **IDLE + PIAZZARE**, e l'Ordine finisce lì.
  - Di conseguenza l'allarme parte **all'ingresso** nella schermata, con azione **IDLE**, prima delle domande — così l'avversario sceglie l'ARO mentre tu rispondi — e al PIAZZA parte **solo la busta**, mai un secondo allarme. Le prove del piazzamento stanno nel blocco DEP.

---

# 4. Blocco B — Attacco BS

**BS-01 — Gittata positiva, Faccia a Faccia**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier @ banda 0, senza copertura
- **ARO:** Fusilier → ATTACCO BS, Combi Rifle, banda 0, contro l'Alguacil
- **Atteso:** **un solo scontro**, FACCIA A FACCIA. Attivo BS 11 +3 = **14** B3. Reattivo BS 12 +3 = **15** B1. Salvezza Fusilier ARM **VS 8** ×1; salvezza Alguacil ARM **VS 8** ×1. Se ne compaiono **due**, ognuno con un Tiro Normale, è un difetto: la reazione non si è accoppiata con l'attacco.

**BS-02 — Reazione contro un altro**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier @ banda 0, senza copertura
- **ARO:** Fusilier → ATTACCO BS, Combi Rifle, banda 0, contro un'unità diversa dall'Alguacil — quale unità, **DA COMPLETARE**
- **Atteso:** **TIRO NORMALE**, "La reazione non è diretta contro l'attaccante." Stessi valori di tiro: attivo BS 11 +3 = **14** B3, reattivo BS 12 +3 = **15** B1; salvezza Fusilier ARM **VS 8** ×1.

**BS-03 — Gittata negativa e copertura, contro Schivata**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier @ banda 2, **in copertura**
- **ARO:** Fusilier → SCHIVATA
- **Atteso:** F2F. Attivo 11 −3 −3 = **5** B3. Reattivo PH **10** B1. Salvezza Fusilier ARM **VS 11**.

**BS-04 — Mimetismo senza visore**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra (Mimetismo −3) @ banda 1, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **11**.

**BS-05 — MSV L1**
- **Attivo:** Grenzer (FO, Sensor)
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra (Mimetismo −3) @ banda 1, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **16**, con la nota sul visore.

**BS-06 — Mimetismo −6 e copertura**
- **Attivo:** Alguacil
- **Con:** Combi Rifle
- **Bersaglio:** **Croc Man (MULTI Sniper Rifle)**, PanOceania, **rivelato** (Modello, non Marker), **in copertura** @ banda 1 — nel database nasce Marker (`deployState: 'CAMO'`): **Scoprilo** prima, oppure schieralo come Modello.
- **ARO:** nessuno
- **Atteso:** **5** (11 +3 gittata −3 copertura −6 Mimetismo), salvezza ARM **VS 11**. Se il bersaglio è ancora Marker l'app rifiuta l'Attacco BS e torna alla scelta dell'arma: **non è un anello, è il rifiuto che deve fare**, e l'avviso deve nominare il Marker — *«va Scoperto prima, oppure usa un Attacco Intuitivo»*. Un rifiuto senza quel motivo è un'altra cosa, e va segnalato.

**BS-07 — MSV L2 annulla il −6**
- **Attivo:** **Intruder (HMG)**, voce 24 del roster
- **Con:** Heavy Machine Gun
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) **in copertura** @ **banda 2 (16-24", +3)**
- **ARO:** nessuno
- **Atteso:** BS 13 **+3** di gittata **−3** di copertura = **13**, Burst **4**, e nel dettaglio la nota *"Multispectral Visor L2+: il Mimetismo (−6) non si applica"*. Se leggi **7** il visore non sta funzionando.

**BS-08 — X-Visor su banda negativa**
- **Attivo:** Intruder (X Visor)
- **Con:** MULTI Sniper AP
- **Bersaglio:** **DA COMPLETARE** @ **banda 0 (−3)**, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** gittata **0**, totale **13**. Se leggi 10 l'X-Visor non si applica.

**BS-09 — X-Visor non crea bonus**
- **Attivo:** Intruder (X Visor)
- **Con:** MULTI Sniper AP
- **Bersaglio:** **DA COMPLETARE** @ banda 6 (−3), copertura **non detta**
- **ARO:** nessuno
- **Atteso:** gittata **0**, mai +3.

**BS-10 — Marksmanship ignora la copertura**
- **Attivo:** Grenzer (Marksmanship)
- **Con:** MULTI Sniper AP
- **Bersaglio:** Fusilier **in copertura** @ banda 3
- **ARO:** nessuno
- **Atteso:** **16**, con la nota. Ma la salvezza resta **VS 9**: la copertura vale sull'ARM anche quando non vale sul tiro.

**BS-11 — Stato Bersagliato**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier **Bersagliato** @ banda 0, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **17**.

**BS-12 — Bersaglio in Soppressione entro 24"**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier **in Soppressione** @ banda 0, copertura **non detta**
- **ARO:** Fusilier **in Soppressione** → ATTACCO BS in SF Mode, Combi Rifle (SF Mode), banda 0, contro l'Alguacil
- **Atteso:** attivo **11** (−3 Soppressione). Reattivo col profilo **Combi Rifle (SF Mode)**: Burst **3**, bande 0/0/−3, gittata massima 24", avviso **A98**. **Il Burst 3 è la parte che conta**: se vedi **Burst 1** è un difetto. Il Burst pieno va tutto su **un solo** bersaglio: non si divide. Regola scritta (riga 14649): *"Suppressive Fire allows the affected Trooper to react in ARO with the full B3 value of the SF Mode"*.

**BS-13 — Soppressione oltre le 24"**
- **Attivo:** Alguacil (Combi Rifle)
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier **in Soppressione** @ banda 3, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** il −3 **non** si applica.

**BS-14 — Attaccante Stordito**
- **Attivo:** unità **DA COMPLETARE**, **Stordito** · apri il menu degli Ordini
- **Atteso:** ATTACCO BS **non compare** nel menu.

**BS-15 — Total Reaction**
- **Attivo:** **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** Sierra Dronbot (Total Reaction) → azione, arma, banda e bersaglio dell'ARO **DA COMPLETARE**
- **Atteso:** **Burst 3**, con la voce.

**BS-16 — ARO normale e il (+1B) che non vale in reazione**
- **Attivo:** **Puppetbot (Red Fury)** — o un altro dei 25 profili con *BS Attack (+1B)*
- **Con:** Red Fury
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** qualunque **Fusilier** → ATTACCO BS, arma, banda e bersaglio dell'ARO **DA COMPLETARE**
- **Atteso:** il Fusilier in ARO ha **Burst 1**. Il Fusiliere **non ha** il (+1B) in nessuno dei suoi dieci profili, quindi la nota si vede solo con un profilo che ha davvero *BS Attack (+1B)*: in attivo il Burst **sale**, **in ARO no**, con la nota che lo dice.

**BS-17 — BS Attack (+1B) solo in attivo**
- **Attivo:** Puppetbot
- **Con:** Red Fury
- **Bersaglio:** **DA COMPLETARE** @ banda 1, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **Burst 5**, tiro **15**. Lo stesso Puppetbot in ARO: Burst **1**.

**BS-18 — Burst su due bersagli**
- **Attivo:** Alguacil (HMG)
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (2 dadi) e Orc (2 dadi) @ banda 2, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** due scontri, somma 4. Salvezze: Fusilier ARM **VS 6**, Orc ARM **VS 9**.

**BS-19 — ARM alto**
- **Attivo:** Mobile Brigada (HMG)
- **Con:** Heavy Machine Gun
- **Bersaglio:** Orc @ banda 0, copertura **non detta**
- **ARO:** Orc → ATTACCO BS, HMG, banda **non detta**, contro la Mobile Brigada
- **Atteso:** attivo **10** B4, reattivo **11** B1, salvezza Orc **VS 9**, salvezza Brigada **VS 10**.

**BS-20 — Tiro dentro una mischia**
- **Attivo:** **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** un bersaglio **ingaggiato in mischia** con un'altra truppa — quali unità, **DA COMPLETARE** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** fra i modificatori compare la voce **−6**.

**BS-21 — Limite dei MOD**
- **Attivo:** **Alguacil (Combi Rifle)**, BS 11
- **Con:** Combi Rifle
- **Bersaglio:** **Swiss Guard (Heavy Machine Gun, Pulzar)** **in copertura** @ **banda 4 (32-40", −6)**
- **ARO:** nessuno
- **Atteso:** voce per voce nel dettaglio: gittata **−6**, copertura **−3**, Mimetismo **−6** = **−15**, più la voce **+3** che riporta il totale al tetto: **MOD −12**. Valore di Successo **11 − 12 = −1**, quindi **fallimento automatico**. Il tetto deve comparire come **voce a sé** ("MOD minimo −12"): se vedi −15 il limite non si applica, se vedi −12 senza la voce non sai perché. E l'app deve dire **fallimento automatico**, non mostrare 1. Variante più corta, se preferisci stare vicino: **banda 2 (16-24", −3)** dà gittata −3, copertura −3, Mimetismo −6 = **−12** esatti, Valore −1, fallimento automatico, **senza** la voce del tetto — serve a distinguere "sono arrivato a −12" da "sono stato fermato a −12".

**BS-22 — No Cover** *(risolto, da confermare)*
- **Attivo:** Alguacil
- **Con:** Combi Rifle
- **Bersaglio:** **Dr. Harper FTO** (PanOceania, No Cover, senza Mimetismo) **"in copertura"** @ banda 0
- **ARO:** nessuno
- **Atteso:** niente −3 all'attaccante e niente +3 all'ARM → tiro **14**, salvezza **VS 8**.

**BS-23 — Limited Cover** *(risolto, da confermare)*
- **Attivo:** Alguacil
- **Con:** Combi Rifle
- **Bersaglio:** **Teutonic Knight (Light Shotgun, Panzerfaust)** (PanOceania, Limited Cover, senza Mimetismo) in copertura @ banda 0 — **prima di cominciare, controlla che sia davvero schierato**.
- **ARO:** nessuno
- **Atteso:** cade **solo** il −3 all'attaccante, il +3 all'ARM resta (p.98) → tiro **14**, salvezza **VS 13**. Nell'elenco MOD non deve comparire la copertura; nel Tiro Salvezza sì.

**BS-24 — Combat Instinct** *(risolto, da confermare)*
- **Attivo:** Intruder **in Camo**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Squalo Mk-II @ banda — , copertura **non detta**
- **ARO:** Squalo Mk-II (Combat Instinct) → ATTACCO BS, arma e banda **non detta**, contro l'Intruder
- **Atteso:** lo Squalo **non** prende il −3 di Attacco a Sorpresa (p.88); il −3 di Mimetismo resta. Nell'elenco del reattivo devono comparire gittata e mimetismo, e nient'altro.

**BS-25 — Neurocinetics** *(risolto, da confermare)*
- **Attivo:** Sin-Eater, in attivo contro un singolo bersaglio
- **Con:** Mk12, poi MULTI Sniper, poi HMG
- **Bersaglio:** un singolo bersaglio — quale unità, **DA COMPLETARE** @ banda — , copertura **non detta**
- **ARO:** Sin-Eater → ATTACCO BS contro un singolo bersaglio, Mk12 / MULTI Sniper / HMG, banda e attaccante **DA COMPLETARE**
- **Atteso:** (regolamento p.102) Burst **1 in attivo** e **Burst pieno in reazione** — **3** col Mk12, **2** col MULTI Sniper, **4** con l'HMG. Controprova: un Alguacil con la stessa HMG resta a **1**. Se in ARO vedi 1 col Mk12, è un difetto.

---

# 5. Blocco C — Munizioni e Tiri Salvezza

Valore di Successo = ARM o BTS (dimezzato se AP, +3 se copertura) + PS
dell'arma; si tira 1d20 e serve **uguale o meno**. Bersagli: **Fusilier**
(ARM 1, BTS 0, PH 10) e **Orc** (ARM 4, BTS 3, PH 14).

**MU-01 — Combi Rifle (N)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 11 ×1**. Da controllare oltre al numero: Critico = 1 salvezza extra.

**MU-02 — AP Submachine Gun (AP)**
- **Attivo:** **DA COMPLETARE**
- **Con:** AP Submachine Gun, munizione **AP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 9 ×1**. Da controllare oltre al numero: l'ARM dell'Orc dimezzato.

**MU-03 — Missile Launcher (Blast) (EXP)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Missile Launcher, **Blast Mode**, munizione **EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 10 ×3**. Da controllare oltre al numero: tutte e 3 obbligatorie.

**MU-04 — Missile Launcher (Hit) (AP+EXP)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Missile Launcher, **Hit Mode**, munizione **AP+EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 8 ×3**. Da controllare oltre al numero: dimezza **e** 3 tiri.

**MU-05 — Red Fury (SHOCK)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Red Fury, munizione **SHOCK**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 11 ×1**. Da controllare oltre al numero: VITA 1 + Incosciente → **Morto**; annulla Dogged/NWI.

**MU-06 — DA CC Weapon (DA)**
- **Attivo:** **DA COMPLETARE**
- **Con:** DA CC Weapon, munizione **DA**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 9 ×2**; vs Orc **ARM VS 12 ×2**. Da controllare oltre al numero: entrambe obbligatorie.

**MU-07 — T2 Boarding Shotgun (T2)**
- **Attivo:** **DA COMPLETARE**
- **Con:** T2 Boarding Shotgun, munizione **T2**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×1**; vs Orc **ARM VS 10 ×1**. Da controllare oltre al numero: ogni fallimento = **2 Ferite**.

**MU-08 — E/Mitter (E/M)**
- **Attivo:** **DA COMPLETARE**
- **Con:** E/Mitter, munizione **E/M**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×2**; vs Orc **BTS VS 9 ×2**. Da controllare oltre al numero: BTS dimezzato, fallimento = Isolato.

**MU-09 — PARA CC Weapon (PARA)**
- **Attivo:** **DA COMPLETARE**
- **Con:** PARA CC Weapon, munizione **PARA**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **PH VS 4 ×1**; vs Orc **PH VS 8 ×1**. Da controllare oltre al numero: è PH−6, non ARM/BTS. Nessuna Ferita, IMM-A.

**MU-10 — Adhesive Launcher Rifle**
- **Attivo:** **DA COMPLETARE**
- **Con:** Adhesive Launcher Rifle
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **PH VS 4 ×1**; vs Orc **PH VS 8 ×1**. Da controllare oltre al numero: è PH−6, non ARM/BTS; nessuna Ferita, IMM-A; ma con gittate.

**MU-11 — Flash Pulse (STUN)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Flash Pulse, munizione **STUN**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×1**; vs Orc **BTS VS 10 ×1**. Da controllare oltre al numero: l'attributo BTS viene dall'arma.

**MU-12 — Nanopulser**
- **Attivo:** **DA COMPLETARE**
- **Con:** Nanopulser
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×1**; vs Orc **BTS VS 10 ×1**. Da controllare oltre al numero: l'arma sovrascrive la munizione.

**MU-13 — Smoke Grenades**
- **Attivo:** **DA COMPLETARE**
- **Con:** Smoke Grenades
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** **nessuna** salvezza vs Fusilier e **nessuna** vs Orc. Da controllare oltre al numero: "azione non offensiva".

**MU-14 — Panzerfaust (AP+EXP)**
- **Attivo:** **DA COMPLETARE**
- **Con:** Panzerfaust, munizione **AP+EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 8 ×3**. Da controllare oltre al numero: Disposable (2), l'uso va scalato.

**MU-15 — Copertura sulla salvezza**
- **Attivo:** **DA COMPLETARE**
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** **Fusilier** (ARM 1, BTS 0, PH 10), **in copertura**
- **ARO:** nessuno
- **Atteso:** **ARM VS 11 ×1**.

**MU-16 — Guidato e Speculativo ignorano la copertura**
- **Attivo:** **DA COMPLETARE** · dichiara **Fuoco Speculativo**
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** **Fusilier** (ARM 1, BTS 0, PH 10), **in copertura**
- **ARO:** nessuno
- **Atteso:** **ARM VS 8 ×1** — il +3 della copertura non entra nella salvezza.

**MU-17 — Munizioni N3**
- **Attivo:** **DA COMPLETARE**
- **Con:** le munizioni N3 VIRAL, BREAKER, K1, PLASMA, NANOTECH, ADHESIVE, FLASH, MONOFILAMENT, BIOWEAPON — armi non nominate **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** avviso **A50** con l'equivalente N5, e il calcolo non si ferma.

**MU-18 — Munizione sconosciuta**
- **Attivo:** **DA COMPLETARE**
- **Con:** una munizione sconosciuta — arma e munizione non nominate **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** avvisi **A51** e **A52**, nessun numero inventato.

**MU-19 — Tiro Salvezza Combinato**
- **Attivo:** **DA COMPLETARE**
- **Con:** un'arma con Tiro Salvezza Combinato **ARM+BTS** — arma non nominata **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** due salvezze con attributi diversi, descritte come tali.

**MU-20 — Contenitore di modalità**
- **Attivo:** **DA COMPLETARE**
- **Con:** MULTI Rifle oppure Missile Launcher, **senza modalità scelta**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** avviso **A51b**, nessun calcolo a caso.

**MU-21 — Kobra Pistol**
- **Attivo:** **DA COMPLETARE**
- **Con:** Kobra Pistol, in **BS Mode** e in **CC Mode**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** BS Mode **SHOCK**; CC Mode **DA con 2 salvezze** e Anti-materiel.

**MU-22 — BioWeapon condizionale** *(nuovo)*
- **Attivo:** **DA COMPLETARE**
- **Con:** Viral Rifle
- **Bersaglio:** (a) **Fusilier** (VITA 1; ARM 1, BTS 0, PH 10); (b) **Gecko** (STR)
- **ARO:** nessuno
- **Atteso:** contro il Fusilier BTS **VS 7 ×2**, con la nota "Bersaglio con VITA: si applica la combinazione DA+Shock" e l'effetto Shock; contro il Gecko BTS **VS 13 ×1**, con la nota "Bersaglio senza VITA: il BioWeapon non lo potenzia". Se passa un solo caso dei due, la condizione non è implementata. Sono sette armi: Rifle, Combi, Marksman, Sniper, Pistol, CC Weapon, Mine.

**MU-23 — ARM = 0** *(chiarito)*
- **Attivo:** **DA COMPLETARE**
- **Con:** K1 Combi Rifle; poi un Combi Rifle normale
- **Bersaglio:** un bersaglio con **ARM 3** — unità non nominata **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** K1 Combi Rifle → **ARM VS 7**; Combi normale sullo stesso bersaglio → **VS 10**. **ARM=0 non vuol dire "nessun Tiro Salvezza"**: il tiro c'è, e vale solo il PS dell'arma. Vive in `salvAttr`, non fra i Tratti condizionali: cinque armi lo portano — K1 Combi, K1 Marksman, K1 Sniper, Monofilament CC Weapon, Monofilament Mine. **Target (Attribute)** esiste solo nelle Pheroware Tohaa e **BTS = 0** su nessuna arma delle due fazioni: non sono lacune, sono fuori dalle nostre liste.

---

# 6. Blocco D — Sagome

**TPL-01 — Sagoma Diretta: colpo automatico**
- **Attivo:** Morlock · — *(il piano non dice l'azione né le metà dell'Ordine)*
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier — *(il piano non dice banda né copertura)*
- **ARO:** Fusilier → SCHIVATA, contro il Morlock
- **Atteso:** **TIRO NORMALE**, attivo **"Auto"** senza Valore di Successo, reattivo PH **10**, salvezza Fusilier ARM **VS 8**. E la nota: chi è colpito da una Sagoma **non prende il +3 di copertura**.

**TPL-02 — Continuous Damage**
- **Attivo:** — *(il piano non dice l'unità né l'azione)*
- **Con:** Light Flamethrower
- **Bersaglio:** Orc — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** colpo automatico, ARM **VS 11**, e la nota che le salvezze si ripetono fino a una riuscita.

**TPL-03 — Sagoma che colpisce il BTS**
- **Attivo:** — *(il piano non dice l'unità né l'azione)*
- **Con:** Pulzar
- **Bersaglio:** Orc — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** **BTS VS 10**.

**TPL-04 — Sagoma a Impatto: il tiro serve**
- **Attivo:** Alguacil (Missile Launcher) · — *(il piano non dice l'azione né le metà dell'Ordine)*
- **Con:** Missile Launcher in **Blast Mode**
- **Bersaglio:** Orc @ banda 3 — *(il piano non dice la copertura)*
- **ARO:** ATTACCO BS — *(il piano non dice l'unità reattiva, l'arma né la banda)*
- **Atteso:** **F2F**, attivo 11 +3 = **14** B1 — *non* "Auto". Salvezza Orc ARM **VS 10 ×3**.

**TPL-05 — Schivata senza LoF contro Sagoma**
- **Attivo:** — *(il piano non dice l'unità né l'azione)*
- **Con:** un'arma a Sagoma — *(il piano non dice quale)*
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** SCHIVATA senza LoF — *(il piano non dice l'unità reattiva)*
- **Atteso:** **nessun −3**, con la nota.

**TPL-06 — Critico**
- **Attivo:** — *(il piano non dice l'unità né l'azione)*
- **Con:** un'arma a Sagoma — *(il piano non dice quale)*
- **Bersaglio:** un Bersaglio Principale e dei bersagli secondari sotto la Sagoma — *(il piano non dice le unità, la banda né la copertura)*
- **ARO:** nessuno
- **Atteso:** vale come Critico **solo sul Bersaglio Principale**; sui secondari è un successo normale.

**TPL-07 — Bersagli secondari** *(risolto, da confermare)*
- **Attivo:** Grenzer · — *(il piano non dice l'azione né le metà dell'Ordine)*
- **Con:** Light Flamethrower (B1)
- **Bersaglio:** **due** nemici sotto l'area, il Fusiliere e l'Orc — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** ammesso. Due scontri, uno per bersaglio, entrambi **colpo automatico**, ognuno col proprio Tiro Salvezza — 8 al Fusiliere, 11 all'Orc. Controprove: due dadi su **un** bersaglio con la stessa Sagoma danno ancora **E21** (il conteggio non è sparito, ha cambiato criterio); e un Panzerfaust, B1 e non a Sagoma, su due bersagli dà **E21**, perché la raffica si divide. Sagoma a **Impatto** su due bersagli: lo stesso tiro in entrambi gli scontri. Al tavolo si tira una volta sola.

**TPL-08 — Alleati sotto la sagoma** **[NON CHIESTO]**
- **Attivo:** — *(il piano non dice l'unità né l'azione)* · una Sagoma con **alleati nell'area**
- **Con:** un'arma a Sagoma — *(il piano non dice quale)*
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** `regoleTemplate` prevede `colpoAnnullatoSeAlleatiInArea`, ma l'app non chiede nulla. Verifica se la domanda compare: oggi no.

---

# 7. Blocco E — Attacco Intuitivo

**INT-01 — Contro un Marker**
- **Attivo:** Zondnautica-A oppure Morlock · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man (in **Camo**) — *(il piano non dice banda né copertura)*
- **ARO:** Croc Man → SCHIVATA
- **Atteso:** **F2F**. Attivo **WIP nudo**, Burst **1**, con la nota "nessun MOD si applica, da nessuna fonte" — nell'elenco MOD non deve comparire niente. Reattivo: Schivata PH 12.

**INT-02 — Bersaglio visibile**
- **Attivo:** Zondnautica-A oppure Morlock · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man **visibile**, non in Camo — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** **E15** con il motivo, invio bloccato.

**INT-03 — Burst forzato**
- **Attivo:** Zondnautica-A oppure Morlock · ATTACCO INTUITIVO, forzando **2 dadi**
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man (in **Camo**) — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** avviso **A20**.

**INT-04 — Quali armi lo aprono** *(cambiato)*
- **Attivo:** Zero (Boarding Shotgun) con Shock Mine e PARA Mine, Mary Problems con Zapper, Heckler con Cybermine · si guarda se ATTACCO INTUITIVO compare nel menu
- **Atteso:** l'ordine **compare**, perché il filtro ora passa da `M.armiIntuitive` e non dai nomi.

---

# 8. Blocco F — Fuoco Speculativo

**SPEC-01 — Il −6 e il cambio di attributo**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) · dichiara **Fuoco Speculativo**
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) @ banda **0**, copertura sì
- **ARO:** nessuno
- **Atteso:** si tira su **PH** ("Grenades: Tratto BS Weapon (PH)"), PH 12 +3 −6 = **9**, B1. La copertura **non** compare fra i MOD.

**SPEC-02 — Bersaglio Bersagliato** *(valore corretto il 7 ottobre)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) · dichiara **Fuoco Speculativo**
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) (**Bersagliato**) @ banda **0**, copertura sì
- **ARO:** nessuno
- **Atteso:** PH 12 **+3** di gittata **−6** fisso **+3** di Bersagliato = **12**,
  B1, con tutte e tre le voci nel dettaglio. 🔴 Il piano diceva **18**, cioè il
  −6 che salta contro un bersaglio Bersagliato: è la regola **N4**. In N5 il
  −6 si applica **sempre** (riga 3920), e il Bersagliato dà **+3** perché è un
  MOD positivo (riga 14646) — il divieto riguarda solo i MOD negativi. Se leggi
  **18** è tornato il difetto corretto il 20 settembre; se leggi **15** il
  Bersagliato viene contato due volte.

**SPEC-03 — Burst 1**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) · dichiara **Fuoco Speculativo**
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) @ banda **0**, copertura sì
- **ARO:** nessuno
- **Atteso:** avviso **A20**.

**SPEC-04 — Armi ammesse** *(cambiato)*
- **Attivo:** Alguacil (Missile Launcher) · prova a dichiarare **Fuoco Speculativo**; poi Mary Problems · prova a dichiarare **Fuoco Speculativo**
- **Con:** Missile Launcher per l'Alguacil; **Pitcher** per Mary Problems
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** Alguacil (Missile Launcher) **non** ottiene l'ordine (il Missile Launcher non ha il Tratto), mentre Mary Problems col **Pitcher** sì.

**SPEC-05 — Tratti dedotti**
- **Attivo:** **DA COMPLETARE**
- **Con:** un'arma il cui Tratto non viene dalla scheda — arma non nominata **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** avviso **A80** o **A49** dove la provenienza non è la scheda.

---

# 9. Blocco G — Attacco Guidato *(ora eseguibile)*

**GUI-01 — L'ordine si raggiunge**
- **Attivo:** Alguacil (Missile Launcher)
- **Con:** Missile Launcher
- **Bersaglio:** un nemico **Bersagliato** in campo — unità non nominata **DA COMPLETARE**
- **Atteso:** ATTACCO GUIDATO **nella lista**. Sono 40 profili Nomadi e 68 PanOceania.

**GUI-02 — Guidato su bersaglio Bersagliato**
- **Attivo:** Alguacil (Missile Launcher) · dichiara **Attacco Guidato**
- **Con:** Missile Launcher, **Blast Mode**
- **Bersaglio:** Fusilier (**Bersagliato**) @ banda **3**, copertura sì
- **ARO:** nessuno
- **Atteso:** 11 +3 +3 = **17**, con la nota che ignora Copertura e Mimetismo. Salvezza **VS 7 ×3**.

**GUI-03 — Senza Stato Bersagliato**
- **Attivo:** Alguacil (Missile Launcher) · dichiara **Attacco Guidato**
- **Con:** Missile Launcher
- **Bersaglio:** un bersaglio **senza** lo Stato Bersagliato — unità non nominata **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** bersaglio rifiutato, col motivo. Un Marker non può essere Bersagliato.

**GUI-04 — ECM (Guided −6)** *(risolto, da confermare)*
- **Attivo:** Alguacil (Missile Launcher) · dichiara **Attacco Guidato**
- **Con:** Missile Launcher, **Blast Mode**
- **Bersaglio:** **Tikbalang** (**Bersagliato**) @ banda **3**
- **ARO:** nessuno
- **Atteso:** 11 +3 +3 **−6** = **11**, con la voce "ECM (Guided -6) del bersaglio".

**GUI-05 — Reset come difesa**
- **Attivo:** Alguacil (Missile Launcher) · dichiara **Attacco Guidato**
- **Con:** Missile Launcher
- **Bersaglio:** un nemico **Bersagliato** — unità non nominata **DA COMPLETARE**
- **ARO:** il bersaglio del Guidato — unità non nominata **DA COMPLETARE** → apre il menu ARO
- **Atteso:** contro un Guidato il menu ARO offre **RESET**, non Schivata.

---

# 10. Blocco H — Corpo a corpo

**CC-01 — Martial Arts sui due lati**
- **Attivo:** Morlock (MA L2)
- **Con:** **AP CC Weapon(PS=6)**
- **Bersaglio:** Fusilier
- **ARO:** Fusilier → ATTACCO CC, arma **DA COMPLETARE**, contro il Morlock
- **Atteso:** F2F. Attivo CC 23 **+3** = **26**. Reattivo 13 **−3** = **10**. Salvezza Fusilier ARM **VS 7** — il PS=6 del profilo, non il PS 8 del database armi. Se leggi VS 9 la notazione del PS si è persa.

**CC-02 — NBW e CC Attack (−3)**
- **Attivo:** Chimera (NBW)
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Teutonic Knight (MA L2)
- **ARO:** Teutonic Knight (MA L2) → ATTACCO CC, arma **DA COMPLETARE**, contro la Chimera
- **Atteso:** attivo CC **24 pieno** con la nota su NBW; reattivo 22 +3 −3 = **22**. Salvezza Teutonic **BTS VS 11**; salvezza Chimera ARM VS 9 ×2.

**CC-03 — Colpo di Grazia**
- **Attivo:** **DA COMPLETARE** · ATTACCO CC contro un Incosciente
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**, **Incosciente**
- **ARO:** nessuno
- **Atteso:** **nessun tiro e nessuna salvezza**, passaggio automatico a Morto.

**CC-04 — PARA CC Weapon**
- **Attivo:** Zondmate
- **Con:** PARA CC Weapon
- **Bersaglio:** Fusilier
- **ARO:** nessuno
- **Atteso:** CC **13** (il −3 è per il nemico), salvezza **PH VS 4**, Non-Lethal, IMM-A.

**CC-05 — Berserk** *(chiuso)*
- **Attivo:** **DA COMPLETARE** · BERSERK
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**
- **Atteso:** **F2F**. In N5 il Berserk non evita il Faccia a Faccia.

**CC-06 — Ingaggiato**
- **Attivo:** unità **DA COMPLETARE**, **Ingaggiato** · apri il menu degli Ordini
- **Atteso:** compaiono solo ATTACCO CC, BERSERK, SCHIVATA, RESET, IDLE.

**CC-07 — Gang-Up**
- **Attivo:** **DA COMPLETARE** · ATTACCO CC con alleati in contatto di Silhouette col bersaglio
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** **+1 Burst** per ogni alleato in contatto di Silhouette col bersaglio, **escludendo** chi è in Stato Nullo o Immobilizzato e chi ha dichiarato Schivata, Idle o Reset.

---

# 11. Blocco I — Hacking

**HK-00 — Programmi per dispositivo**
- **Attivo:** apri l'elenco dei programmi per quattro dispositivi — Interventor (HD Plus), Zero / Intruder (KHD), Alguacil (HD), Salyut (EVO)
- **Atteso:** Interventor (HD Plus): Carbonite, Oblivion, Spotlight, Total Control fra gli attacchi. Zero / Intruder (KHD): **solo Trinity**. Alguacil (HD): i quattro base. Salyut (EVO): **nessun programma d'attacco**.

**HK-01 — Carbonite**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Orc (Hacker) · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** Orc (Hacker) → RESET contro l'Interventor (il Reset non ha arma né banda)
- **Atteso:** Faccia a Faccia. Attivo WIP **15** B2, reattivo Reset WIP **12** B1. Salvezza Orc **BTS VS 10 ×2** (BTS pieno + PS 7). Nessuna gittata, nessuna copertura.

**HK-02 — Oblivion**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** OBLIVION
- **Bersaglio:** Orc (Hacker) · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** salvezza Orc **BTS VS 6 ×1** (BTS dimezzato + PS 4), effetto Isolato.

**HK-03 — Spotlight su non-hacker**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** SPOTLIGHT
- **Bersaglio:** Fusilier · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** l'ordine è ammesso, salvezza **BTS VS 5 ×1**, effetto Bersagliato.

**HK-04 — Trinity** *(risolto, da confermare)*
- **Attivo:** Zero (KHD) · HACKING
- **Con:** TRINITY
- **Bersaglio:** Orc (Hacker) · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** WIP 13 **+3** = **16**, B3, salvezza **BTS VS 9 ×1**.

**HK-05 — Filtro bersagli**
- **Attivo:** Interventor (HD Plus) per CARBONITE / OBLIVION / TOTAL CONTROL; per TRINITY serve un KHD e l'hacker è **DA COMPLETARE** · HACKING
- **Con:** CARBONITE, OBLIVION, TOTAL CONTROL, TRINITY, SPOTLIGHT, uno per uno
- **Bersaglio:** Tikbalang, Orc (Hacker), Fusilier, Croc Man (Camuffato) · tutti nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** con CARBONITE e con OBLIVION: Tikbalang e Orc ammessi; Fusilier no ("non hackerabile"); Croc Man in Camo no ("va Scoperto prima"). Con TOTAL CONTROL: **solo Tikbalang**. Con TRINITY: **solo Orc**. Con SPOTLIGHT: anche il Fusilier.

**HK-06 — Firewall**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Teutonic (TinBot: Firewall) · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** tiro attivo 15 **−3** = **12**, e salvezza del Teutonic **BTS VS 13** (BTS 3 **+3 Firewall** + PS 7).

**HK-07 — Firewall doppio**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** **DA COMPLETARE**
- **Bersaglio:** un bersaglio con due Firewall · unità, stato e fonti dei due Firewall **DA COMPLETARE** · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** dei due Firewall se ne usa **uno solo**, a scelta.

**HK-08 — Firewall disabilitato**
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Teutonic (TinBot: Firewall) in stato **Isolato** · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** Firewall **0**: niente −3 al tiro dell'hacker e niente +3 al BTS del Teutonic.

**HK-09 — ECM (Hacker −3)** *(risolto, da confermare)*
- **Attivo:** Interventor (HD Plus) · HACKING
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Meteor Zond, che porta ECM (Hacker −3) · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** **−3** al tiro dell'hacker.

**HK-10 — Dati non verificati**
- **Attivo:** Interventor (HD Plus) per TOTAL CONTROL; per TRINITY serve un KHD e l'hacker è **DA COMPLETARE** · HACKING
- **Con:** TOTAL CONTROL, poi TRINITY
- **Bersaglio:** **DA COMPLETARE** · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** con TOTAL CONTROL o con TRINITY compare l'avviso **A91**.

**HK-11 — Upgrade dai profili**
- **Attivo:** Jazz, poi Mary Problems, poi Kulak · HACKING
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** l'upgrade compare nel calcolo, oppure compare l'avviso **A94**. Mai ignorato in silenzio.

**HK-12 — Reset, non Schivata**
- **Attivo:** Interventor (HD Plus) · HACKING; poi un ATTACCO BS, con unità attiva e stato **DA COMPLETARE**
- **Con:** per l'HACKING il programma **DA COMPLETARE**; per l'ATTACCO BS l'arma **DA COMPLETARE**
- **Bersaglio:** Orc (Hacker) · per l'HACKING nell'Area di Hacking, nessuna gittata, nessuna copertura; per l'ATTACCO BS banda e copertura **non detta**
- **ARO:** Orc (Hacker) → si apre il suo menu degli ARO contro l'unità attiva
- **Atteso:** contro HACKING: Schivata assente, Reset presente. Contro ATTACCO BS: il contrario, Schivata presente e Reset assente.

---

# 12. Blocco J — Scoprire e osservazione *(blocco nuovo)*

**SCO-01 — Bande dello Scoprire**
- **Attivo:** Alguacil · SCOPRIRE
- **Bersaglio:** Croc Man (Camuffato, Marker) @ banda 0, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **WIP 13** +3 −6 = **10**, B1, **nessun Faccia a Faccia**. Chi fallisce non ritenta sullo stesso Marker fino al proprio Turno.

**SCO-02 — Banda lontana**
- **Attivo:** Alguacil · SCOPRIRE
- **Bersaglio:** Croc Man (Camuffato, Marker) @ banda 4, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **4**. Le bande dello Scoprire sono 12 e diverse da quelle del Combi.

**SCO-03 — Sensor applicato allo Scoprire**
- **Attivo:** Grenzer (Sensor) · SCOPRIRE
- **Bersaglio:** Croc Man (Camuffato, Marker) @ banda 1, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** mimetismo ridotto dal visore **+6** da Sensor = **16**.

**SCO-04 — Bersaglio non Marker**
- **Attivo:** Alguacil · SCOPRIRE
- **Bersaglio:** un bersaglio che non è un Marker · unità, stato, banda e copertura **non detta**
- **ARO:** nessuno
- **Atteso:** rifiutato, "non c'è niente da Scoprire".

**SCO-05 — Bersagliato aiuta**
- **Attivo:** Alguacil · SCOPRIRE
- **Bersaglio:** Croc Man (Camuffato, Marker) in stato **Bersagliato** @ banda **non detta**, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** **+3**.

**OSS-01 — Forward Observer** *(ordine nuovo)*
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) · FORWARD OBSERVER · Abilità Breve, oppure in ARO
- **Con:** arma "Forward Observer", Burst 2
- **Bersaglio:** Fusilier @ banda 1, copertura **non detta**
- **ARO:** nessuno
- **Atteso:** Breve/ARO su **WIP**, arma "Forward Observer" con Burst 2 e bande tutte a 0 fino a 24" (nessun MOD di gittata), **serve LoF**. **Nessun Tiro Salvezza**: impone lo Stato **Bersagliato**. Se l'app ti chiede una salvezza, segnalalo — la regola è Non-Lethal.

**OSS-02 — Sensor** *(ordine nuovo)*
- **Attivo:** Grenzer · SENSOR · Abilità Breve
- **ARO:** nessuno
- **Atteso:** Breve su **WIP +6** = **19**, **senza LoF** e **senza bersaglio**: scopre tutti i Marker nella ZdC insieme. Nessun MOD di gittata né di Mimetismo.

**OSS-03 — Triangulated Fire** *(ordine nuovo)*
- **Attivo:** Zulu-Cobra (Triangulated Fire) · TRIANGULATED FIRE · Ordine **Intero**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Croc Man @ media distanza, copertura sì
- **ARO:** nessuno
- **Atteso:** il tiro è su **BS**, **senza alcun MOD**: resta il BS pieno. I MOD ignorati vanno mostrati **barrati**. Requisito: senza l'abilità l'ordine è rifiutato con "Serve l'Abilità Triangulated Fire".

---

# 13. Blocco K — Supporto

**SUP-01 — Dottore**
- **Attivo:** Daktari · DOTTORE
- **Con:** abilità Dottore
- **Bersaglio:** un nomade **Incosciente con VITA** — quale unità, **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** tira il **Daktari** su **WIP 13**, Tiro Normale, **nessun bonus**. Fallimento: **MORTO**.

**SUP-02 — MediKit**
- **Attivo:** Alguacil (Paramedic) · MEDIKIT
- **Con:** MediKit
- **Bersaglio:** un Incosciente — quale unità, **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** **due tiri in ordine** — prima l'Alguacil colpisce (**BS 11**), poi **tira il bersaglio** su **PH 10**. Nessun Tiro Salvezza. Fallimento: **MORTO** (N5.2).

**SUP-03 — Ingegnere**
- **Attivo:** Clockmaker · INGEGNERE
- **Con:** abilità Ingegnere
- **Bersaglio:** Reaktion Zond **Incosciente**
- **ARO:** nessuno
- **Atteso:** **WIP 15**, fallimento **+1 Ferita**, non la morte.

**SUP-04 — GizmoKit(+1B)**
- **Attivo:** **DA COMPLETARE**, BS 11 · GIZMOKIT
- **Con:** GizmoKit (+1B)
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** **BS 11** per colpire, poi il bersaglio su **PH 10**; il (+1B) deve portare il Burst a **2**.

**SUP-05 — Filtro bersagli** *(risolto, da confermare)*
- **Attivo:** **DA COMPLETARE** · apri l'elenco dei bersagli di Dottore, MediKit, Ingegnere e GizmoKit
- **Bersaglio:** alleati con VITA, Incoscienti e un REM, da provare con ciascuno strumento
- **Atteso:** Dottore e MediKit accettano **solo alleati con VITA e Incoscienti**; un REM va rifiutato con "Non ha l'attributo VITA". Ingegnere e GizmoKit accettano **solo alleati con STR**.

**SUP-06 — Strumento sconosciuto**
- **Attivo:** dichiara un ordine con uno strumento sconosciuto — come, **DA COMPLETARE**
- **Atteso:** avviso **A58** con l'elenco degli id attesi.

**SUP-07 — Ri-tiri**
- **Attivo:** **DA COMPLETARE** · DOTTORE, poi INGEGNERE
- **Con:** abilità Dottore, poi abilità Ingegnere
- **Bersaglio:** un bersaglio con Cubo per il Dottore, un bersaglio con Remote Presence per l'Ingegnere — quali unità, **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** la nota sui Command Token — Cubo per il Dottore, Remote Presence per l'Ingegnere.

---

# 14. Blocco L — Difese e Soppressione

**DIF-01 — Schivata con LoF**
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE** → Schivata, **con LoF**
- **Atteso:** PH **10**, nessun MOD nell'elenco.

**DIF-02 — Schivata senza LoF**
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE** → Schivata, **senza LoF**
- **Atteso:** **7**, con la voce nell'elenco MOD.

**DIF-03 — Dodge (+3)**
- **Attivo:** **DA COMPLETARE**
- **ARO:** Puppetbot → Schivata
- **Atteso:** **13**.

**DIF-04 — Schivata da IMM-A** *(risolto)*
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**, stato **IMM-A** → Schivata
- **Atteso:** PH 10 **−6** = **4**, con la voce "Stato IMM-A".

**DIF-05 — Reset base**
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE** → Reset
- **Atteso:** WIP **13**, con la nota che il −3 senza LoF vale sulla Schivata e non sul Reset.

**DIF-06 — Reset da Bersagliato**
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**, stato **Bersagliato** → Reset
- **Atteso:** **10**.

**DIF-07 — Reset da IMM-B** *(risolto)*
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**, stato **IMM-B** → Reset
- **Atteso:** **10**.

**DIF-08 — Reset da Isolato** *(risolto)*
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**, stato **Isolato** → Reset
- **Atteso:** **4**.

**DIF-09 — Sesto Senso** *(risolto, da confermare)*
- **Attivo:** **DA COMPLETARE**
- **ARO:** un reattivo con **Sixth Sense**, **sotto Soppressione** e **senza LoF** → Schivata
- **Atteso:** **nessun MOD negativo**, salvo IMM-A (−6 PH), IMM-B (−3 WIP), Isolato (−9 WIP). Quindi PH pieno: nell'elenco MOD non deve comparire né il −3 della LoF né quello della Soppressione. Riferimento: p.109.

**DIF-10 — Dichiarare la Soppressione**
- **Attivo:** **DA COMPLETARE** · dichiara **Soppressione**
- **Con:** **DA COMPLETARE**
- **Atteso:** nessun tiro, stato visibile sul tabellone, arma che passa al profilo SF Mode.

**DIF-11 — Armi ammesse**
- **Attivo:** Alguacil · dichiara **Soppressione**; poi Morlock · dichiara **Soppressione**
- **Con:** Combi Rifle per l'Alguacil; per il Morlock tutte e tre le sue armi — non nominate **DA COMPLETARE**
- **Atteso:** Alguacil col Combi **sì**, **Morlock no**: tutte e tre le sue armi escluse col motivo.

**DIF-12 — SF Mode in ARO**
- **Attivo:** **DA COMPLETARE**
- **ARO:** **DA COMPLETARE**, in **Soppressione** → ARO con l'arma in SF Mode
- **Atteso:** arma "Combi Rifle (SF Mode)", Burst **3**, bande 0/0/−3, gittata massima 24", avviso **A98**.

**DIF-13 — Attivare cancella la Soppressione**
- **Attivo:** **DA COMPLETARE**, in **Soppressione** · spende un ordine
- **Atteso:** la Soppressione viene cancellata, anche se l'ordine viene poi speso in altro.

---

# 15. Blocco M — Stati dell'attivo

Imposta lo stato e guarda **la lista ordini**.

**ST-01 — Normale**
- **Attivo:** truppa qualunque (Normale)
- **Atteso:** lista piena

**ST-02 — Morto**
- **Attivo:** truppa qualunque (**Morto**)
- **Atteso:** nessun ordine

**ST-03 — Incosciente**
- **Attivo:** truppa qualunque (**Incosciente**)
- **Atteso:** nessun ordine

**ST-04 — Isolato**
- **Attivo:** truppa qualunque (**Isolato**)
- **Atteso:** nessun ordine dal Pool, con il motivo

**ST-05 — Disconnesso**
- **Attivo:** truppa qualunque (**Disconnesso**)
- **Atteso:** nessun ordine, né ARO

**ST-06 — IMM-A**
- **Attivo:** truppa qualunque (**IMM-A**)
- **Atteso:** **solo SCHIVATA**

**ST-07 — IMM-B**
- **Attivo:** truppa qualunque (**IMM-B**)
- **Atteso:** **solo RESET**

**ST-08 — Stordito**
- **Attivo:** truppa qualunque (**Stordito**)
- **Atteso:** tutto tranne BS, CC, BERSERK, PROTHEION, HACKING

**ST-09 — Ingaggiato**
- **Attivo:** truppa qualunque (**Ingaggiato**)
- **Atteso:** solo CC, BERSERK, SCHIVATA, RESET, IDLE

**ST-10 — In Ritirata**
- **Attivo:** truppa qualunque (**In Ritirata**)
- **Atteso:** solo MOVIMENTO, SCOPRIRE, SCHIVATA, RESET, CAUTO

**ST-11 — Foxhole**
- **Attivo:** truppa qualunque (**Foxhole**)
- **Atteso:** tutto tranne il movimento. Vedi ST-15

**ST-12 — Bersagliato**
- **Attivo:** truppa qualunque (**Bersagliato**)
- **Atteso:** tutto tranne MOVIMENTO CAUTO

**ST-13 — Soppressione**
- **Attivo:** truppa qualunque (**Soppressione**)
- **Atteso:** lista piena, ma attivare annulla lo stato

**ST-14 — IMM-A + Bersagliato + Prono**
- **Attivo:** truppa qualunque (IMM-A + Bersagliato + Prono)
- **Atteso:** tutti e tre visibili sul tabellone

**ST-15 — Foxhole** *(verificabile adesso)*
- **Attivo:** una truppa in **Foxhole** — *(il piano non dice quale)* · si confronta quello che mostra l'app con il regolamento
- **Atteso:** Regolamento p.158: Silhouette **3** (o il proprio valore se più alto), **Copertura Parziale in arco 360°**, **Mimetism (−3)** e **Courage**, posizione fissa che non consente **alcun** movimento — nemmeno quello di una Schivata riuscita. Cancellazione: andando Prono, oppure in Turno Attivo dichiarando una Skill con Label Movimento e annunciando la cancellazione, a costo zero.

**ST-16 — Gli stati arrivano al tabellone, in ordine** *(risolto, da confermare)*
- **Attivo:** unità con `immobilizedA`, `targeted`, `prone`, `camo`, `unconscious` (deployState CAMO_1) · si guarda il tabellone
- **Atteso:** sul tabellone, in quest'ordine: **Incosciente, Immobilizzato-A, Bersagliato, Prono, Mimetizzato** — cioè NULLO, IMM, INFOGUERRA, POSTURA, MARKER. I nomi li dice il motore, non una tabella dell'interfaccia.

**ST-17 — Una riga malata non svuota il tabellone**
- **Attivo:** tre unità sul tabellone, con `M.statiPerCategoria` forzato a sollevare **solo sulla seconda**
- **Atteso:** **tre righe su tre**; la seconda mostra **STATI ILLEGGIBILI**, le altre i loro stati normali; `window.ultimaEccezione` contiene il messaggio.

**ST-18 — Il segno NULL viene dal campo, non dalla categoria**
- **Attivo:** unità con `unconscious`, `retreat`, `isolated`, `disconnected`, `possessed`, `sepsitorized`, `prone` · si guarda il tabellone
- **Atteso:** **col segno** (bordo rosso e la parola NULL): Incosciente, Disconnesso, Posseduto, Sepsitorizzato. **Senza segno**: Ritirata! (sta nel gruppo NULLO ma non è Null) e Isolato (sta in INFOGUERRA accanto a Disconnesso, ma non è Null). Il Prono non è più uno stato.

---

**ST-19 — Prono e Scarico non sono più stati** *(nuovo)*
- **Attivo:** la pagina degli stati di una truppa qualunque
- **Atteso:** **nessuna casella** per il Prono e per lo Scarico; i flag impostabili sono **16**. Entrambi sono dichiarati in `CATALOGO_N5.STATI_NON_GESTITI` con la riga del regolamento, il perché, e il promemoria per il tavolo. Controprova: una partita salvata **prima** del ritiro, con `prone: true` ancora scritto, si carica senza allarmi e senza mostrare niente.

**ST-20 — Il Marker si chiama CAMO** *(nuovo)*
- **Attivo:** una truppa in **Camo** — *(il piano non dice quale)* · si guardano il tabellone e le note del calcolo
- **Atteso:** **CAMO** in tutti e due i posti. Controprova: la skill Mimetismo si chiama ancora così, e i suoi **−3** e **−6** non sono cambiati.

---

# 16. Blocco N — Stati del reattivo

**AR-01 — Normale · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (Normale) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** BS, CC, Hacking, Schivata. **Reset assente**

**AR-02 — Normale · HACKING**
- **Attivo:** truppa qualunque, dichiara HACKING · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (Normale) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** Reset presente, **Schivata assente**

**AR-03 — IMM-A · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**IMM-A**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** **solo Schivata**

**AR-04 — IMM-B · HACKING**
- **Attivo:** truppa qualunque, dichiara HACKING · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**IMM-B**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** **solo Reset**

**AR-05 — IMM-B · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**IMM-B**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** **nessuna ARO** — può solo il Reset, che contro il BS non difende. È corretto

**AR-06 — Stordito · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**Stordito**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** nessun attacco: solo Schivata

**AR-07 — Ingaggiato · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**Ingaggiato**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** solo CC, Schivata, Reset

**AR-08 — Isolato · HACKING**
- **Attivo:** truppa qualunque, dichiara HACKING · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**Isolato**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** Reset sì, Hacking no

**AR-09 — Incosciente / Morto / Disconnesso · attacco qualunque**
- **Attivo:** truppa qualunque, dichiara un attacco qualunque · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (Incosciente / Morto / Disconnesso) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** non compare fra i reattivi, e appare nell'elenco "non possono reagire" col motivo

**AR-10 — Nascosto / in Riserva · attacco qualunque**
- **Attivo:** truppa qualunque, dichiara un attacco qualunque · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**Nascosto / in Riserva**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** non compare

**AR-11 — Soppressione · ATTACCO BS**
- **Attivo:** truppa qualunque, dichiara ATTACCO BS · stato e metà d'ordine: — *(il piano non lo dice)*
- **Con:** — *(il piano non lo dice)*
- **Bersaglio:** truppa qualunque (**Soppressione**) @ banda —, copertura — *(il piano non dice banda né copertura)*
- **Atteso:** badge SF MODE, arma col profilo SF

---

# 17. Blocco O — Deployable *(blocco nuovo)*

**DEP-01 — Chi può piazzare**
- **Attivo:** le truppe del roster nomade (23): si guarda a chi compare **PIAZZARE EQUIPAGGIAMENTO** (misurato sul database con `M.armiPiazzabili`)
- **Atteso:** compare a **quattro** truppe del roster, e solo a quelle: **Moran** (CrazyKoalas 2/2), **Zero** (Shock Mine 3/3), **Puppet Masters** (Shock Mine 3/3), **Kulak** (Cybermine 3/3).
  - **Non** compare al **Puppetbot**: nessuno dei suoi sei profili ha un'arma col Tratto Deployable. Nemmeno all'**Heckler (Boarding Shotgun)**: la Cybermine la porta l'`Heckler (Hacker, Killer Hacking Device)`, che nel roster non c'è — il suo caso lo copre il Kulak, che ha la stessa arma.
  - E non compare a nessun'altra delle 23 truppe nomadi del roster.

**DEP-02 — Le due domande bloccano prima**
- **Attivo:** Moran · PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** il pulsante resta **RISPONDI ALLE DOMANDE** finché mancano risposte, e diventa **IDLE**, **giallo**, se una risposta blocca; sotto non c'è un secondo tasto giallo fisso. Premendolo si dichiara l'Idle da requisito fallito, col motivo scritto dal motore. I CrazyKoalas hanno Perimeter, quindi **due** domande: Marker mimetico nell'area d'innesco, e percorso libero. E la risposta che lascia piazzare si colora di **verde**, quella che blocca di **giallo**: lo decide il motore (`M.valutaDomanda`), non la schermata. Rispondendo "sì" al Marker: **nessun token creato**, nessun uso scalato.

**DEP-03 — Piazzamento riuscito**
- **Attivo:** Moran · PIAZZARE EQUIPAGGIAMENTO, rispondendo **"no"** alla domanda sul Marker mimetico
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** token **CrazyKoala #1** creato, categoria PERIMETER, `isCamo` false, ARM 0 BTS 0 STR 1 S 1, e uso del Moran sceso a **1/2**. La riga "il token **NON** è stato spedito all'avversario" **non c'è più**, perché il token ora viaggia col roster (nel giro di AGGIORNAMENTO). Quello che la schermata deve dire è che il gettone è **bersagliabile dal prossimo Ordine** e che in **questo** Ordine il nemico reagisce **solo contro chi lo ha piazzato**.

**DEP-04 — Terzo koala**
- **Attivo:** Moran, dopo due piazzamenti · PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** **E17 usi esauriti**, non un terzo token.

**DEP-05 — ARO contro chi piazza**
- **Attivo:** Moran · PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** Fusilier → ATTACCO BS, Combi, banda 1, contro il Moran
- **Atteso:** **TIRO NORMALE**, "L'attaccante non tira: Burst 0". Attivo **Auto**, B0. Reattivo **12** (BS 12 +3 gittata −3 Mimetismo del Moran) B1. Salvezza al Moran ARM **VS 7**. E il **token non è bersagliabile** in questo ordine (p.5532 del regolamento vecchio, riga corrispondente nel file nuovo): il nemico reagisce solo contro chi piazza.

**DEP-06 — Il Boost scatta**
- **Attivo:** un nemico — *(il piano non dice quale unità né quale azione)* · si attiva nella ZdC del koala, nel turno successivo
- **ARO:** il CrazyKoala già piazzato → si attiva per Boost, non dichiara, contro il nemico che si è attivato
- **Atteso:** il deployable compare nella schermata ARO **fuori dal percorso normale** — non dichiara, si attiva — con la domanda "è dentro la ZdC, con percorso libero?". Se scatta: **TIRO NORMALE**, attivo **Auto**, difensore che schiva a **PH 10** senza il −3 per assenza di LoF, salvezza **ARM VS 6**. Note: "Se la Schivata riesce, l'attacco è evitato del tutto" e "Dopo la detonazione l'arma è rimossa dal gioco" — **una volta sola** ciascuna.

**DEP-07 — Il Boost non scatta**
- **Attivo:** chi si attiva nella ZdC del koala, in tre varianti: un **Marker mimetico**, un altro **deployable**, e un nemico con **percorso non verificato** — *(il piano non dice le unità né le azioni)*
- **ARO:** il CrazyKoala già piazzato → Boost
- **Atteso:**
  - contro un **Marker mimetico**: "Non scatta contro Marker Mimetici o Impersonation".
  - contro un altro **deployable**: "Per il Tratto Deployable, l'arma non attiva altri Deployable".
  - con percorso non verificato: scatta, ma con la nota "Percorso non verificato: chiedere se è libero".
  - e lo **Stealth non lo protegge**: il regolamento dice che lo Stealth non è efficace contro le armi Deployable.

**DEP-08 — Il token muore**
- **Attivo:** — *(il piano non dice l'unità né l'azione)* · un colpo che passa
- **Con:** **DA COMPLETARE**
- **Bersaglio:** il token deployable — *(il piano non dice banda né copertura)*
- **ARO:** nessuno
- **Atteso:** STR 1 più il Tratto Deployable = passa **direttamente a Morto** e si rimuove. Niente Incosciente, niente Ingegnere.

**DEP-09 — Disco Ball**
- **Attivo:** Kulak · FUOCO SPECULATIVO
- **Con:** Disco Baller
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** il Disco Ball **non** compare fra le armi piazzabili: nasce dall'esito del tiro del **Disco Baller**, quindi passa dal Fuoco Speculativo. Verifica che il token nasca dopo un tiro riuscito, con la Sagoma Circolare Eclipse centrata, e che alla Fase Stati si rimuova **la sagoma e non il token**.

**DEP-10 — Minelayer in schieramento** *(implementato, da provare in app)*
- **Attivo:** Spektr (Minelayer) e Firefly (Minelayer), in fase di schieramento
- **Con:** le armi Deployable della truppa — Spektr E/M Mine e Shock Mine, Firefly AP Mine e **Armed Turret**
- **Atteso:** l'app offre **solo** le armi Deployable della truppa — Spektr E/M Mine e Shock Mine, Firefly AP Mine e **Armed Turret** — e chiede **due** conferme: nessun nemico né Marker nell'Area d'Innesco, e punto dentro la propria zona di schieramento. Senza entrambe non si piazza; rispondendo "c'è un nemico" non nasce nessun token. Piazzato: il token entra nel roster e **arriva all'avversario con lo schieramento**, senza canale nuovo. La mina si vede come **SEGNALINO MIMETICO**, la torretta **a vista**. Il pezzo si scala: un secondo piazzamento con Minelayer (1) è rifiutato. Se il Tiro di Schieramento Superiore fallisce, il Deployable si perde e l'uso si scala.

**DEP-11 — La torretta non è scenografia** *(nuovo)*
- **Attivo:** — *(il piano non dice l'unità né l'azione)* · si guardano gli elementi scenici e i bersagli disponibili con un **Armed Turret** nemico in gioco
- **Bersaglio:** l'Armed Turret nemico — *(il piano non dice banda né copertura)*
- **Atteso:** l'Armed Turret **non compare** fra gli elementi scenici, ed è bersagliabile come un Deployable nemico — BS e CC sì, Hacking no. Il Deactivator la trova perché è un dispositivo dell'avversario.

---

# 18. Blocco P — Trincerarsi e logistica *(blocco nuovo)*

**LOG-01 — Trincerarsi**
- **Attivo:** **DA COMPLETARE** · TRINCERARSI, Ordine Intero
- **ARO:** nessuno
- **Atteso:** nessun tiro; l'unità entra in Foxhole, con gli effetti di ST-15.

**LOG-02 — Ingresso in campo**
- **Attivo:** **DA COMPLETARE** · apri la schermata dell'Ingresso in campo
- **Atteso:** la schermata dice **prima del tiro** che fallire non significa "non entri": si entra nella **propria Zona di Schieramento**, a contatto col bordo, come Modello e **senza i Deployable**.

**LOG-03 — Request Speedball**
- **Attivo:** **DA COMPLETARE** · REQUEST SPEEDBALL
- **ARO:** nessuno
- **Atteso:** **non è un Ordine**, è un'Abilità Automatica, e il tiro è su **PH 14 fisso** — non il PH della truppa. Primo Token scelto, secondo tirato sulla Chart.

---

# 19. Blocco Q — Fireteam

**FT-01 — Livello = truppe della stessa Unità**
- **Attivo:** un Fireteam di 5 Alguacil · schermata del Fireteam
- **Atteso:** **LIVELLO 5 (5 membri)** e i cinque bonus.

**FT-02 — Cinque truppe diverse**
- **Attivo:** un Fireteam con Alguacil + Moderator + Grenzer + Zero + Daktari · schermata del Fireteam
- **Atteso:** **LIVELLO 1 (5 membri)**, con la nota esplicita, e **nessun bonus**.

**FT-03 — Il +1 BS nel calcolo**
- **Attivo:** un membro di un Fireteam di Livello 4 o più che dichiara un attacco · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** da Livello 4 in su il **+1 BS** compare nel calcolo, con la voce.

**FT-04 — Non vale per Scoprire né Hacking**
- **Attivo:** un membro di Fireteam che dichiara SCOPRIRE, poi HACKING · unità, stato, Livello del Fireteam **DA COMPLETARE**
- **Con:** per l'HACKING il programma **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** il bonus del Fireteam non si applica né allo Scoprire né all'Hacking, con la nota.

**FT-05 — Rotture**
- **Attivo:** un membro del Fireteam che passa a Incosciente, poi Morto, poi Isolato, poi in Soppressione, poi IMM-A, poi IMM-B · unità e Livello del Fireteam **DA COMPLETARE**
- **Atteso:** escono dal Fireteam Incoscienti, Morti, Isolati e in Soppressione. **Non** escono IMM-A e IMM-B, con la nota.

**FT-06 — Neurocinetics in Fireteam** *(nuovo)*
- **Attivo:** Sin-Eater (Neurocinetics) in un Fireteam di Livello alto, in Turno Attivo · stato, Livello esatto **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** il bonus di Burst **non** si applica in Turno Attivo. Dipende da BS-25.

---

# 20. Blocco R — Ordine Coordinato

**CO-01 — Burst della Punta di Lancia**
- **Attivo:** **DA COMPLETARE**, **Punta di Lancia** di un Ordine Coordinato
- **Con:** HMG, Burst **4**
- **Atteso:** Burst **2**, con la voce "metà arrotondata per eccesso".

**CO-02 — Gregari**
- **Attivo:** i **gregari** di un Ordine Coordinato — unità non nominate **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Atteso:** Burst **1** per tutti.

**CO-03 — Leader di Fireteam ≠ Punta di Lancia**
- **Attivo:** il **Leader di un Fireteam** che non è la Punta di Lancia dell'Ordine Coordinato — unità non nominata **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Atteso:** in Fireteam il Leader ha Burst pieno.

**CO-04 — Cinque unità**
- **Attivo:** un Ordine Coordinato con **cinque unità** — unità non nominate **DA COMPLETARE**
- **Atteso:** **E41**.

**CO-05 — Nessuna**
- **Attivo:** un Ordine Coordinato con **nessuna unità**
- **Atteso:** **E40**.

**CO-06 — Punta mancante**
- **Attivo:** un Ordine Coordinato **senza Punta di Lancia** — unità non nominate **DA COMPLETARE**
- **Atteso:** **E45**.

**CO-07 — Punta non selezionata**
- **Attivo:** un Ordine Coordinato con la **Punta di Lancia non selezionata** — unità non nominate **DA COMPLETARE**
- **Atteso:** **E46**.

**CO-08 — Unità non attivabile**
- **Attivo:** un Ordine Coordinato con un'unità **Incosciente** nel gruppo — unità non nominate **DA COMPLETARE**
- **Atteso:** **E42** col motivo.

**CO-09 — Gruppi diversi**
- **Attivo:** un Ordine Coordinato con unità di **gruppi di combattimento diversi**; poi un Ordine Coordinato con unità di **addestramento diverso** — unità non nominate **DA COMPLETARE**
- **Atteso:** **E43** per i gruppi diversi; **E44** per l'addestramento diverso.

**CO-10 — Stesso bersaglio**
- **Attivo:** le unità di un Ordine Coordinato, tutte contro lo stesso bersaglio — unità non nominate **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** lo stesso per tutte — unità non nominata **DA COMPLETARE**
- **Atteso:** chi non soddisfa i requisiti fa **Idle**, che genera comunque ARO e spende i Disposable (A-07).

**CO-11 — CC coordinato**
- **Attivo:** la **Punta di Lancia** di un Ordine Coordinato in CC, con alleati partecipanti ingaggiati — unità non nominate **DA COMPLETARE**
- **Con:** arma da CC **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**
- **Atteso:** tira solo la Punta, con **+1 Burst** e **+1 PH** per ogni alleato **partecipante** ingaggiato.

**CO-12 — ARO**
- **Attivo:** le truppe attivate da un Ordine Coordinato — unità non nominate **DA COMPLETARE**
- **ARO:** un nemico — unità non nominata **DA COMPLETARE**
- **Atteso:** un solo ARO per nemico, contro una sola delle truppe attivate.

**CO-13 — Command Token**
- **Attivo:** un Ordine Coordinato con la spesa di un **Command Token** — unità non nominate **DA COMPLETARE**
- **Atteso:** promemoria: il motore non lo scala.

---

# 21. Blocco S — Schieramento

**SCH-01 — Anti-spoiler**
- **Attivo:** PanOceania schiera: Croc Man **Nascosto**, Fusilier normale, Zulu-Cobra in **Camo**, Fusilier (ML) in **Riserva**
- **Atteso:** nel roster che arriva all'altra app: Fusilier (Combi Rifle), un **SEGNALINO MIMETICO di tipo MARKER** al posto dello Zulu-Cobra, e Fusilier (Missile Launcher). Il **Croc Man Nascosto non compare affatto**.

**SCH-02 — Hidden Deployment è anche una regola** *(risolto, da confermare)*
- **Attivo:** una truppa in **Hidden Deployment** — *(il piano non dice quale)* · si prova a bersagliarla, a Scoprirla e a colpirla con una Sagoma
- **Bersaglio:** la truppa in Hidden Deployment — *(il piano non dice banda né copertura)*
- **Atteso:** chi è in Hidden Deployment **non è sul tavolo**: non è bersagliabile, non è Scopribile, e le Sagome non lo colpiscono. Il rifiuto deve dire il motivo. La truppa che si rivela cambia stato, non roster. E il promemoria dell'Infiltrazione **compare anche per chi è nascosto** (riga 13896), con il numero: per lo Zero, "Tiro a 9 (PH 12 − 3)".

**SCH-03 — Senza motore non si spedisce**
- **Attivo:** togli lo `<script>` e schiera
- **Atteso:** **niente parte**, con un messaggio esplicito.

**SCH-04 — Bersagli solo fra gli schierati**
- **Attivo:** l'elenco dei bersagli — *(il piano non dice l'unità né l'azione)*
- **Atteso:** solo gli schierati, mai l'intero database.

**SCH-05 — Terreni**
- **Attivo:** l'elenco dei terreni — *(il piano non dice l'unità né l'azione)*
- **Atteso:** solo quelli messi in schieramento.

---

# 22. Blocco T — Terreni

Stesso attacco, cambia il terreno. Attaccante senza visore, poi MSV L1, L2/L3, poi Marksmanship.

**TER-01 — TER_10 Bosco**
- **Attivo:** lo stesso attacco nelle quattro varianti — senza visore, MSV L1, MSV L2/L3, Marksmanship · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno **TER_10 Bosco** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** senza visore **−3 BS** e −1 Burst; MSV L1 −1 Burst; MSV L2/L3 −1 Burst; Marksmanship −3 e −1 Burst.

**TER-02 — TER_11 Giungla**
- **Attivo:** lo stesso attacco nelle quattro varianti — senza visore, MSV L1, MSV L2/L3, Marksmanship · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno **TER_11 Giungla** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** senza visore **−6** e −1 Burst; MSV L1 **−3** e −1 Burst; MSV L2/L3 −1 Burst; Marksmanship −6 e −1 Burst.

**TER-03 — TER_13 Foresta**
- **Attivo:** lo stesso attacco nelle quattro varianti — senza visore, MSV L1, MSV L2/L3, Marksmanship · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno **TER_13 Foresta** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** senza visore **nessuna LoF**; MSV L1 **−6** e −1 Burst; MSV L2/L3 LoF libera e −1 Burst; Marksmanship nessuna LoF.

**TER-04 — TER_17 Sala Generatori**
- **Attivo:** lo stesso attacco nelle quattro varianti — senza visore, MSV L1, MSV L2/L3, Marksmanship · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno **TER_17 Sala Generatori** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** senza visore nessun effetto e −1 Burst; MSV L1 **−6** e −1 Burst; MSV L2/L3 LoF libera e −1 Burst; Marksmanship **nessuna LoF**.

**TER-05 — TER_15 Tempesta**
- **Attivo:** lo stesso attacco nelle quattro varianti — senza visore, MSV L1, MSV L2/L3, Marksmanship · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno **TER_15 Tempesta** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** senza visore **−3**; MSV L1 niente; MSV L2/L3 niente; Marksmanship −3.

**TER-06 — Speculativo ignora le Zone di Visibilità**
- **Attivo:** **DA COMPLETARE** · attacco Speculativo
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** · terreno in Zona di Visibilità — quale, **DA COMPLETARE** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** il MOD del terreno **non** entra nel tiro, il −1 al Burst sì.

**TER-07 — Saturazione**
- **Attivo:** **DA COMPLETARE** · attacco in Zona di Saturazione
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE** @ banda — , copertura **non detta**
- **ARO:** nessuno
- **Atteso:** il Burst scende **prima** dell'allocazione.

**TER-08 — Fumo contro MSV**
- **Attivo:** **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** **DA COMPLETARE**, dietro una Sagoma di **Smoke**, poi di **Eclipse** @ banda — , copertura **non detta**
- **ARO:** **DA COMPLETARE**
- **Atteso:** Smoke → **TIRO NORMALE** con la nota; Eclipse → **F2F**.

---

# 23. Blocco U — Contratto: quale errore deve uscire

L'invio deve essere **bloccato**. Se il calcolo parte lo stesso, è grave.

**ER-01 — azione non nel vocabolario**
- **Attivo:** forza un'azione non nel vocabolario
- **Atteso:** **E01**

**ER-02 — attaccante non nel roster**
- **Attivo:** forza un attaccante non nel roster
- **Atteso:** **E03**

**ER-03 — attacco senza arma**
- **Attivo:** forza un attacco senza arma
- **Atteso:** **E07**

**ER-04 — arma inesistente**
- **Attivo:** forza un'arma inesistente
- **Atteso:** **E08** + **A42**; **E09** se manca ogni modo di risoluzione

**ER-05 — nessun bersaglio**
- **Attivo:** forza nessun bersaglio
- **Atteso:** **E04** + **E20**

**ER-06 — avversario non schierato**
- **Attivo:** forza un avversario non schierato
- **Atteso:** **E05**

**ER-07 — bersaglio "Bersaglio Primario" / `generic1`**
- **Attivo:** forza come bersaglio "Bersaglio Primario" / `generic1`
- **Atteso:** **E06**

**ER-08 — bersaglio non schierato**
- **Attivo:** forza un bersaglio non schierato
- **Atteso:** **E06**

**ER-09 — stesso bersaglio due volte**
- **Attivo:** forza lo stesso bersaglio due volte
- **Atteso:** **E12**

**ER-10 — bersaglio non valido per l'azione**
- **Attivo:** forza un bersaglio non valido per l'azione
- **Atteso:** **E15** + motivo

**ER-11 — nessuna banda scelta**
- **Attivo:** forza nessuna banda scelta
- **Atteso:** **E13**, con l'elenco delle bande

**ER-12 — banda e MOD incoerenti**
- **Attivo:** forza banda e MOD incoerenti
- **Atteso:** **avviso A13**, MOD riallineato. Non è errore

**ER-13 — zero dadi**
- **Attivo:** forza zero dadi
- **Atteso:** **E20**

**ER-14 — più dadi del Burst**
- **Attivo:** forza più dadi del Burst
- **Atteso:** **E21**

**ER-15 — Burst oltre 6**
- **Attivo:** forza un Burst oltre 6
- **Atteso:** **E22**

**ER-16 — difesa con due segnaposto**
- **Attivo:** forza una difesa con due segnaposto
- **Atteso:** **E11**

**ER-17 — Soppressione con bersagli**
- **Attivo:** forza una Soppressione con bersagli
- **Atteso:** **avviso A10**

**ER-18 — Coordinato con 5 unità**
- **Attivo:** forza un Coordinato con 5 unità
- **Atteso:** **E31** / **E41**

**ER-19 — deployable: arma non piazzabile**
- **Attivo:** forza un deployable con un'arma non piazzabile
- **Atteso:** **E16**

**ER-20 — deployable: usi esauriti**
- **Attivo:** forza un deployable con gli usi esauriti
- **Atteso:** **E17**

**ER-21 — creaDeployable con un nome invece del profilo**
- **Attivo:** creaDeployable con un nome invece del profilo
- **Atteso:** **E18**

**ER-22 — attacco valido e completo**
- **Attivo:** un attacco valido e completo
- **Atteso:** **nessun errore, nessun avviso**, invio eseguito

**ER-23 — Come si vede il blocco**
- **Attivo:** un invio bloccato — *(il piano non dice quale azione forzare)* · si legge il messaggio a schermo
- **Atteso:** messaggio leggibile che inizia con "⛔ INVIO BLOCCATO", un punto per errore. Mai un oggetto JavaScript.

**ER-24 — Eccezione in un modulo**
- **Attivo:** si forza un'eccezione in un modulo — *(il piano non dice quale)*
- **Atteso:** l'app resta viva, dice quale modulo, e **l'ordine non è consumato**.

**ER-25 — Avvisi prima dell'invio** *(risolto, da confermare)*
- **Attivo:** un'azione che produce un avviso di gravità **azione** — *(il piano non dice quale)*; poi si annulla
- **Atteso:** gli avvisi di gravità **azione** compaiono prima del calcolo, con messaggio e dettaglio; annullando, il payload torna con `ok:false` ed errore UI01 e il modulo non spedisce. Controprova: un avviso di gravità **nota** non deve fermare niente.

---

# 23-bis. Blocco DIS — Usi Disposable e dado speciale

Fino al 27 settembre gli usi si scalavano solo piazzando un Deployable: sparare
non ne consumava nessuno. Il numero sullo schermo era giusto, era la sua storia
a non esistere — ed è il genere di difetto che al tavolo non si vede finché
qualcuno non conta i colpi.

**DIS-01 — Il Panzerfaust ha due usi, e finiscono**
- **Attivo:** Triphammer · ATTACCO BS due volte di seguito, poi un terzo tentativo
- **Con:** Panzerfaust
- **Bersaglio:** lo stesso bersaglio per tutti i tiri · unità, stato, banda e copertura **non detta**
- **ARO:** nessuno
- **Atteso:** dopo il primo colpo **1 uso**, dopo il secondo **0**, e al terzo tentativo il Burst possibile è **0**: non si può più tirare. Se dopo due colpi ne restano ancora due, è tornato il difetto.

**DIS-02 — Il (+1B) costa due usi, il (+1SD) uno**
- **Attivo:** Triphammer · ATTACCO BS
- **Con:** la stessa arma, Panzerfaust, nelle due notazioni: una volta **(+1B)**, una volta **(+1SD)**
- **Bersaglio:** **DA COMPLETARE**
- **ARO:** nessuno
- **Atteso:** col **(+1B)** si tirano due dadi e si spendono **due** usi; col **(+1SD)** si tira un dado in più ma si spende **un** uso solo — il dado speciale non consuma.

**DIS-03 — Una Schivata non consuma niente**
- **Attivo:** Triphammer · SCHIVATA
- **ARO:** nessuno
- **Atteso:** usi invariati.

**DIS-04 — Scarico è l'oggetto, non la truppa**
- **Attivo:** Zero (Boarding Shotgun), che porta Shock Mine **e** PARA Mine, con la Shock Mine esaurita
- **Con:** PARA Mine
- **ARO:** nessuno
- **Atteso:** esaurita la Shock Mine, la PARA Mine resta usabile: **3 usi** e Burst 1. Il messaggio nomina lo stato **Scarico** e dice come si toglie: Reload, Abilità Breve nella ZdC di un alleato con Baggage.

**DIS-05 — Il dado speciale si vede** *(nuovo)*
- **Attivo:** Triggermen (BS Attack [+1SD]) · ATTACCO BS; poi la controprova con un Alguacil
- **Con:** BS Attack [+1SD] · arma **DA COMPLETARE**
- **Bersaglio:** prima un bersaglio solo, poi due bersagli · unità, stato, banda e copertura **non detta**
- **ARO:** nessuno
- **Atteso:** fra i modificatori compare **"tira 1 dado in più, poi scartane 1"**, e il Burst **non** aumenta. Con due bersagli il dado va a **uno solo**: il primo con dadi assegnati, o quello che hai marcato. Controprova: un Alguacil non deve vedere quella frase.

---

# 23-ter. Blocco DET — Detonazione e Schivata

**DET-01 — La mina detona e chi ha innescato schiva**
- **Attivo:** Alguacil · MUOVERE → **SCHIVATA**
- **ARO:** una **Shock Mine** nemica → DETONAZIONE, contro l'Alguacil, banda **non detta**
- **Atteso:** a sinistra **SCHIVATA (Tiro Normale) 7** — PH 10 meno 3 — e sotto la salvezza della mina con la sua munizione.

**DET-02 — Chi non la dichiara non la riceve**
- **Attivo:** Alguacil · MUOVERE → MUOVERE
- **ARO:** una **Shock Mine** nemica → DETONAZIONE, contro l'Alguacil, banda **non detta**
- **Atteso:** **NESSUNA SCHIVATA**. L'app non presume niente: al tavolo una Schivata non dichiarata non esiste.

**DET-03 — Il −3 viene dalla Sagoma**
- **Attivo:** Alguacil · MUOVERE → **SCHIVATA**
- **ARO:** un **CrazyKoala**, poi le **MadTraps** → DETONAZIONE, contro l'Alguacil, banda **non detta**
- **Atteso:** **10** in entrambi i casi, PH pieno. Solo la mina, che è una Sagoma, toglie 3. Se vedi 7 contro il Koala, il −3 è stato dato a tutti i deployable.

**DET-04 — Le tre domande dell'innesco**
- **Attivo:** **DA COMPLETARE** · scegli DETONAZIONE per una mina
- **Atteso:** **tre domande**, ciascuna bloccante — un nemico nell'area d'innesco; solo il movimento di una Schivata o di un Guts fallito; un alleato sotto la Sagoma, anche Incosciente. Se manca **anche una sola risposta**, la detonazione **non scatta** e l'app lo dice. Il Chest Mine e il Mine Dispenser **non** ricevono la voce DETONAZIONE.

**DET-05 — Il token esce dal tavolo**
- **Attivo:** dopo l'innesco di una mina, guarda il tabellone e riapri l'app; poi passa alla Fase Stati
- **Atteso:** la mina **sparisce** dal tabellone e dalla copia locale, e non torna riaprendo l'app. Alla Fase Stati invece **non** si toglie: si toglie la Sagoma, non il token.

---

# 23-quater. Blocco RIP — Riprendere una partita

**RIP-01 — L'Hub riaperto a metà partita**
- **Attivo:** chiudi la pagina dell'Hub durante una partita e riaprila
- **Atteso:** **niente si cancella**. Finché la prima lettura dal server non è conclusa l'Hub non trasmette; poi la partita torna da sola — roster di entrambe le fazioni, fazione attiva, scenario e **ferite**.

**RIP-02 — Lettura non riuscita**
- **Attivo:** stacca la rete e riapri l'Hub
- **Atteso:** riquadro **"PARTITA NON LETTA DAL SERVER"**, nessuna trasmissione, e un nuovo tentativo ogni quattro secondi.

**RIP-03 — RIPRENDI PARTITA nell'app**
- **Attivo:** apri l'app e cerca il pulsante RIPRENDI PARTITA — con una copia locale sul dispositivo, poi dopo un reset dall'Hub, poi con un allarme ARO pendente
- **Atteso:** il pulsante compare **solo** se sul dispositivo c'è una copia locale. Dopo un reset dall'Hub **non** compare, e la copia viene dimenticata. Con un allarme ARO pendente: avvisa, e l'allarme **resta** sul server — non va cancellato, o l'avversario perde la sua reazione.

**RIP-04 — Una copia salvata prima di questo giro**
- **Attivo:** riapri l'app con una copia locale vecchia, senza il campo dei token
- **Atteso:** si carica, con zero token piazzati e **nessun errore**.

---

# 23-quinquies. Blocco ORD — Ordini che non tirano, con una domanda davanti

Tre voci con la stessa struttura: **Abilità Lunga, nessun tiro, un requisito che
l'app non può vedere** — la linea di tiro la sa solo chi guarda il tavolo — e un
effetto che cambia lo stato di chi agisce, non di un avversario. Due sono da
costruire; la terza esiste già ed è il modello.

**ORD-01 — Piazzare equipaggiamento** *(esiste)*
- **Attivo:** PIAZZARE EQUIPAGGIAMENTO · unità, stato e Abilità **DA COMPLETARE**
- **Atteso:** le domande sono bloccanti: se manca una risposta non si esegue. È il modello della famiglia. Vedi DEP-10 e DET-04.

**ORD-02 — Cybermask** *(da costruire)*
- **Attivo:** un hacker con **Hacking Device Plus**, poi uno con **Killer Hacking Device**, poi uno con Hacking Device normale · CYBERMASK · Abilità Lunga, Ordine intero — unità **DA COMPLETARE**
- **Con:** CYBERMASK
- **ARO:** nessuno
- **Atteso:** il programma compare su Hacking Device Plus e Killer Hacking Device; un Hacking Device normale NON deve mostrarlo. Abilità Lunga, **NFB**, nessun tiro. Una domanda sola — *"Nessun nemico ha LoF verso di te?"* — e tre esiti: **no** non si può dichiarare, col motivo; **sì** l'hacker diventa Marker **IMP-2** senza tirare, Ordine intero speso; **non risposto** non si esegue. In IMP-2 vale l'NFB: nessun'altra Skill o Equipaggiamento, le altre voci del menu devono sparire. Requisito di regola: l'utente dev'essere **fuori dalla LoF di Modelli e Marker nemici** (riga 5150).

**ORD-03 — Rientrare in Camuffato** *(da costruire)*
- **Attivo:** una truppa con Camouflage, e per il caso **Camouflage (1 Use)** l'Heckler · RIENTRARE IN CAMUFFATO · Abilità Lunga, Ordine intero
- **ARO:** nessuno
- **Atteso:** una domanda sola — *"Nessun nemico ha LoF verso di te?"* — e tre esiti: **no** non si può dichiarare, col motivo; **sì** la truppa rientra in Camuffato senza tirare, Ordine intero speso; **non risposto** non si esegue. In più: la truppa deve **avere Camouflage**, e con **Camouflage (1 Use)** l'uso dev'essere ancora disponibile (FAQ F07). Una truppa rivelata che **rientra** in Camuffato **non conta come lo stesso Marker**: chi aveva fallito uno Scoprire contro di lei può ritentare subito, senza aspettare il turno dopo (riga 13605). Regola (riga 13597): *"During the Active Turn, Troopers may only return to this state by spending a Long Skill, while outside the LoF of enemy Markers or Troopers."*

---

# 23-sexies. Blocco BAN — Quello che un banco già tiene

Leggi questo blocco **prima di cominciare**. Ventisei gruppi di
comportamenti che fino alla revisione 8 erano da verificare a mano adesso hanno
una prova che li misura a ogni giro, con la controprova e con la verifica che il banco sappia
andare rosso. Al tavolo non vale ripeterli: il tempo si spende meglio sulle
schermate, sul giro a tre dispositivi e sui casi del blocco V.

Per ciascuno è scritto **dove** sta la prova, così se un numero al tavolo non
torna sai subito quale banco contraddire.

**Rientro in CAMO e Cybermask** — `test_camo_cybermask.js`
Rientro dentro la LoF → `IDLE`, Ordine speso, genera ARO, non rientra, stato
invariato. Col Frenzy attivo → `VIETATO`, Ordine **non** speso. Cybermask
dentro la LoF → `IDLE`, non entra in IMP-2. Un Marker CAMO **può** usare il
Cybermask e dopo è `NORMAL`, con la nota che perde il MOD del Mimetism; un
Marker IMP-2 non può e **non viene rivelato**. Da Isolato: Cybermask no,
rientro in CAMO sì.

**Hacker, Firewall, ECM, Repeater** — `test_hacking_firewall.js`
`M.eHacker` è vero su **86 profili su 765**, e guarda la voce esatta: chi ha
solo l'`ECM (Hacking -3)` non è un Hacker. Due Firewall non si sommano: −6, mai
−9, e il motivo dice che la scelta è del giocatore del bersaglio. L'ECM **si
somma** al Firewall ma **non** dà il +3 alla salvezza. Il +3 del Firewall è
sempre **una sola voce da +3**, anche con un Firewall −6 e un Repeater insieme.
ARO di Hacking, Intruder KHD (WIP 14) con TRINITY contro
`Fusilier (Hacker, Hacking Device)`: **17** e salvezza **BTS 6** senza
Repeater, **14** e **BTS 9** con. L'avviso **A90** non scatta su nessun profilo.

**Classi d'azione, Stati, Foxhole** — `test_stati_classi_foxhole.js`
Le quattro classi per tredici azioni. In **Ritirata!** passano solo MOVIMENTO,
SCOPRIRE, IDLE, CAUTO, SCHIVATA, RESET; cadono SALTO, ARRAMPICARSI, ATTACCO BS,
e in ARO sono negati BS_ATTACK, CC_ATTACK e HACKING. L'IDLE è negato da
Immobilizzato-A e -B, permesso da Ingaggiato. Il **Foxhole non nega nessuna
azione**. I numeri: reattivo in Foxhole → l'attivo da **15 a 9**, la salvezza
del reattivo da **8 a 11**, identico con la Copertura dichiarata; attivo in
Foxhole → il reattivo da **14 a 8**, salvezza dell'attivo **11**; cancellato il
Foxhole muovendo, nessun bonus. Mimetism −6 in Foxhole resta **−6**, non −9. In
Corpo a Corpo nessuna copertura; con la Sagoma Diretta nessun +3.

**Ordini che non tirano, e l'adattatore** — `test_ordini_senza_tiro.js`,
`test_adattatore.js`
Ingresso in campo, Supporto e Speedball: `attivo.mod` è il valore della busta,
base valorizzata, burst 1. Trincerarsi, Rientrare in CAMO e Cybermask: titolo
**ABILITÀ SENZA TIRO**, burst **0**, mod null, e la nota della busta arriva al
tabellone. Chi decide è la specifica dell'azione nel motore, non la busta: una
busta che dichiara il contrario non fa tirare Trincerarsi. Sul tabellone
arrivano `coperturaNegata` (la nega il **SALTO**, non il Movimento), le note e
`reattivoNonBersagliato`; la riga della Statistica Base non viene ripetuta come
modificatore; un requisito fallito si legge **"Requisito non soddisfatto: Idle,
nessun tiro"**, diverso dal valore sotto 1.

**L'allarme e il giro** — `test_allarme_una_volta.js`,
`test_giro_aggiornamento.js`, `test_modulo_hacking.js`
Un allarme per Ordine. Il pulsante del Repeater nemico tocca un bersaglio solo
e il valore viaggia fino in busta. Il giro attivo → Hub → avversario, con i
valori del blocco V.

**Bersagli secondari sotto la Sagoma** — `test_modulo_speculativo.js` sez. 8
Arma a Sagoma Circolare: il riquadro **ANCHE SOTTO LA SAGOMA** elenca gli altri
nemici, **non** il Bersaglio Principale, e un Marker CAMO **sì** (escluso come
principale, ammesso come secondario). Toccato, entra con `ruolo 'secondario'`,
Burst **1**, gittata e munizione **del Principale**; ritoccato esce; un id non
ammesso e l'id del Principale non fanno niente. `setTargetRangeSpeculativo(1)`
porta tutti e tre a **−3**. In busta **un solo attacco** con **tre bersagli** e
i ruoli dentro. Sul tabellone **tre scontri**, `bersaglioDiSagoma`
PRINCIPALE/SECONDARIO/SECONDARIO, **MOD identico 9** (PH 12 −6 +3) e nessuna
voce di Mimetismo sul Marker, ciascuno la sua salvezza ARM 0 contro PS 7, e sul
solo Marker `cancellaMarker` con la nota della **riga 13638**. Il ruolo lo
decide la busta, non la posizione: a busta rovescia il Principale è il secondo.
Un'arma col Tratto Speculative ma **senza** Sagoma (Pitcher): nessun riquadro.

**I sei casi mai misurati** — `test_sei_casi.js`
*Total Control*: solo contro i TAG; una HI con Hacking Device e una REM sono
rifiutate col motivo, un TAG **Posseduto** è ammesso (serve a liberarlo), un TAG
in forma di Marker va Scoperto prima; il Carbonite accetta la stessa HI e la
stessa REM, lo Spotlight è il solo a passare sopra all'hackerabilità, il Trinity
rifiuta il TAG perché non è un Hacker.
*Coordinato col SALTO*: la Copertura è negata a **tutti** gli attivi, non al
primo, con la **riga 2762-2763** e `dichiarataEIgnorata`; l'Arrampicarsi è il
caso intermedio (nota, non negazione); senza SALTO il campo **non c'è**.
*Cybermask e Rientro in CAMO*: tre esiti, non due — NON RISPOSTO non spende
l'Ordine, requisito fallito **sì** (Ordine speso, ARO generato, Disposable
spesi, Marker rivelato), requisito soddisfatto entra senza tiro; e il motore
restituisce una **copia**, l'unità originale non viene toccata.
*Ingresso in campo e Trincerarsi*: due facce opposte. L'Ingresso si tira su
**PH 11**, ha cinque divieti e **VIETA** (scegli un altro punto, l'Ordine non è
perso); il Trincerarsi fa un **IDLE** (l'Ordine è perso) e richiede il Sapper.
*Schieramento Nascosto*: non è bersaglio valido **e** non lo prende la Sagoma
(due regole distinte, due funzioni che concordano), ma in ARO **può dichiarare**
Attacco BS, Corpo a Corpo e Schivata: rivelarsi è una sua scelta.
*Successo automatico*: una parola, due significati. MSV L2 contro un Marker CAMO
→ titolo **SUCCESSO AUTOMATICO**, mod **"Auto"**, Burst **0**,
`successoAutomatico: true`, `automatico: false`. Se qualcuno reagisce il titolo
torna TIRO NORMALE ma l'attivo non tira comunque. Una Sagoma diretta
(Lanciafiamme) → azione **ATTACCO A SAGOMA**, `automatico: true`,
`successoAutomatico: false`.

**I ripari del motore .16** — `test_sei_casi.js` sez. 7, `test_adattatore.js` sez. 13
Quattro firme del motore, chiamate male, rispondevano un numero **plausibile**
invece di un errore. Dalla .16 una chiamata sbagliata si **dichiara**, e
**nessuna** solleva eccezioni (la schermata ARO chiama `M.bersagliValidi` fuori
da un `try`: al tavolo un Hub che cade è peggio di un numero sbagliato).
`M.modAttacco` accetta l'azione posizionale, dentro `ctx` al quarto posto o
dentro `ctx` al quinto — tutte e tre danno **mod −3** su Hellcat con Grenades
contro un Croc Man con Mimetism (−3), voci `[gittata, speculativo]`, nessun
Mimetismo; **senza** azione da nessuna parte esce **mod 0** col Mimetismo
applicato, ma con **un** avviso che il calcolo non è affidabile.
`M.bersagliValidi` accetta `programma` come nome **o** come oggetto con
`.nome`; un oggetto senza `.nome` nega **ogni** candidato con
`chiamataSbagliata: true`, mentre `programma` **assente** resta il caso
legittimo (tutti ammessi, nessuna bandiera). `M.risolviTrincerarsi` accetta il
booleano **e** `{ spazioSufficiente }`; un oggetto senza quel campo alza
`chiamataSbagliata`, e così i due "incompleto" si distinguono da `undefined`.
E **`attaccanteNonRisolto` non è più un limite noto**: con l'adattatore .5 il
campo, la nota e l'avviso arrivano al tabellone per un attaccante assente dai
roster (mod **0** contro **11**), mentre un **bersaglio** fantasma non alza
nessuna bandiera e la sua salvezza viene calcolata su un'unità vuota — è il
buco che resta, e il banco lo dichiara.

**I sette comportamenti nuovi del 7 ottobre** — `test_novita_7ott.js`,
`test_modulo_piazzamento.js`, `test_modulo_intuitivo.js`,
`test_modulo_guidato.js`, `test_modulo_osservazione.js`,
`test_modulo_speculativo.js`
*Armi a modalità*: `MULTI Sniper Rifle (+1SD)` dà **tre** modalità, e il
`nomeRichiesto` porta modalità **e** notazione insieme
("MULTI Sniper Rifle (AP Mode) (+1SD)"); il profilo di quel nome è la
**modalità** — Burst 2, 12 bande, munizione AP, `notazioni: ["+1SD"]` — non
il contenitore. Stesso giro per `(+1B)` e `(PS=n)`.
*Tiro in mischia*: contro un bersaglio **Ingaggiato**, −6 per **ogni** tuo
alleato in quel Corpo a Corpo. `alleatiInMischia` non passato conta **1** e
lo dice; **0** non applica nulla (e "non passato" ≠ "zero": MOD −3 contro
+3); tre alleati fanno −18 **fermati al tetto −12**, con la voce del limite.
Con un'arma a **Sagoma** e almeno un alleato: **colpo annullato**, Burst 0,
**nessun** Tiro Salvezza.
*Place Deployable è un Attacco*: un Marker **CAMO o IMP** che lo dichiara si
**rivela** (da Marker a NORMAL, con la mutazione scritta); allo **Stordito**
è **vietato** — e gli è vietato anche l'ATTACCO BS, mentre il MOVIMENTO no.
*Requisiti dichiarati al tavolo*: cinque chiavi (lof, gittata, sagoma,
contatto, area). Chi manca va a **Burst 0** con i dadi persi e il motivo, e
**resta** nella busta; se mancano a **tutti** il tasto diventa **IDLE
giallo** e porta all'Idle vero col motivo del motore; se mancano ad
**alcuni** si esegue comunque, a dadi ridotti. Zero bersagli **non** è un
Idle. Misurati dalla pagina anche i quattro schermi che mancavano:
**Intuitivo** (lof + sagoma), **Speculativo** e **Guidato** (gittata, sul
**solo** Principale — un secondario fuori gittata non blocca),
**Forward Observer** (lof + gittata); il **Sensor**, che non designa
bersagli, non diventa mai IDLE.
*Il gettone piazzato*: eredita il **Gruppo di Combattimento** del portatore,
e `imgVariant` è il **nome del file** ("alguaciles_2.png"), che per un
**Marker** torna a `'0'` — la foto non deve arrivare all'avversario.
🔴 **La trappola da sapere prima di scrivere una prova nuova**: la chiave del
requisito **non è** il nome del campo, e due hanno la **polarità invertita** —
`gittata` legge `fuoriGittata` (manca se **true**), `sagoma` legge
`fuoriSagoma`, `area` legge `inArea`. Scrivere `{ gittata: false }`
intendendo "fuori gittata" dà un bersaglio **sano**: il campo non viene
nemmeno letto.

## Quattro trappole di scenario, da sapere prima di scrivere una prova nuova

Sono emerse costruendo questi banchi, e valgono anche per chi esegue a mano:
una prova che guarda il posto sbagliato sembra un difetto dell'app.

1. **Molti profili nascono Marker.** Croc Man, Intruder (Hacker, KHD), Heckler,
   Zero, Scarecrow e altri hanno `deployState: 'CAMO'` nel database. Contro un
   Marker l'Attacco BS e l'Attacco Comms **non si dichiarano**, e l'app rifiuta
   — giustamente. Se un profilo ti serve come bersaglio, **scoprilo prima**.
2. **Il nome della famiglia non basta.** "Machinist" sono tre profili con
   equipaggiamento diverso, e i numeri attesi valgono per uno solo. Nel piano i
   profili si scrivono per intero, e il banco lo pretende.
3. **Il filtro per l'avversario riscrive il nome.** Una truppa in forma di
   Marker si vede `MARKER` / `SEGNALINO MIMETICO`, e i suoi stati sono
   nascosti. Cercarla per nome sul tabellone avversario non la trova: è
   arrivata travestita, come deve.
4. **Un programma colpisce solo i bersagli che la sua regola ammette.** TRINITY
   vuole un **Hacker nemico**: contro un Fusilier normale il motore risponde
   "requisito non soddisfatto" e non c'è nessun tiro. Non è un difetto.

---

# 24. Blocco V — Difetti aperti e divergenze note

## Difetti trovati al tavolo, non ancora chiusi

**D-02 — Il Burst della Soppressione in reazione (BS-12).**
- **Attivo:** un attacco attivo contro il reattivo in Fuoco di Soppressione · unità — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** il reattivo in Fuoco di Soppressione · unità, banda e copertura **non detta**
- **ARO:** il reattivo in Fuoco di Soppressione → ARO dichiarato e arma **DA COMPLETARE**
- **Atteso:** oggi si legge questo: con un attacco attivo il reattivo in Fuoco di Soppressione scende a **Burst 1**; senza attacco resta **3**. La regola generale dell'ARO sta scavalcando la Soppressione. La regola (riga 14649) dice 3 sempre. → MOTORE

## Chiusi il 6 ottobre

**D-01 — L'anello della scelta dell'arma (BS-06). NON ERA UN DIFETTO.**
- **Attivo:** ATTACCO BS contro il Croc Man · unità attiva — unità **DA COMPLETARE**
- **Con:** **DA COMPLETARE**
- **Bersaglio:** Croc Man, prima come nasce (Marker) e poi rivelato (Modello) · banda e copertura **non detta**
- **ARO:** nessuno
- **Atteso:** oggi si legge questo: contro il Croc Man come nasce, Marker, l'Attacco BS è rifiutato con il motivo giusto — l'app torna alla scelta dell'arma perché è quello che deve fare; rivelato, dà **5** e salvezza **ARM VS 11**. Fissato in `test_modulo_bs.js` sezione 10.

**D-03 — Gli ordini senza tiro che non avvisano (A-13). CHIUSO per PIAZZARE EQUIPAGGIAMENTO.**
- **Attivo:** PIAZZARE EQUIPAGGIAMENTO; poi Allerta; poi un piazzamento bloccato; poi IDLE da solo; poi MOVIMENTO e IDLE come seconda metà; poi IDLE e IDLE — unità **DA COMPLETARE**
- **Atteso:** oggi si legge questo: l'allarme parte **una volta per Ordine, alla prima Abilità**. PIAZZARE EQUIPAGGIAMENTO chiama `M.allarmeOrdine` e manda `aroAtteso: true`; Allerta non alza l'allarme; un piazzamento bloccato non lo alza. IDLE da solo → un allarme, azione `IDLE`; MOVIMENTO poi IDLE come seconda metà → un allarme, azione `MOVIMENTO`, identificativo conservato; IDLE poi IDLE → un allarme. La busta di chiusura di un Ordine in due metà porta `aroAtteso: false`, ed è voluto: l'allarme è partito con la prima metà. Il guardiano è `ordine_movimento.js` riga 84: se qualcuno riscrive `eseguiMovimentoAutomatico`, è quella la riga da non perdere. Misurato in `test_modulo_piazzamento.js` sezione 12 e in `test_allarme_una_volta.js`.

**Il giro a tre dispositivi è coperto.** `test_giro_aggiornamento.js` esegue
attivo → Hub → avversario con tre contesti separati, e fissa i due casi che
INTERFACCIA aveva misurato a mano: un Marker CAMO che si rivela (Hub e
avversario passano da `MARKER` / `CAMO` a `Intruder (HMG)` / `NORMAL` / camo
false) e la Soppressione annullata in ARO (`suppressive` da true a false su
tutti e due). Con la controprova che conta: con `senzaInvio` il roster di chi
agisce cambia e **l'Hub resta allo stato vecchio**.

## Divergenze note, che restano aperte per una ragione

**T-01 — Le mine non sanno se detonano.**
- **Attivo:** innesco di una mina · unità, mina e stato **DA COMPLETARE**
- **Atteso:** oggi si legge questo: nel database le mine non hanno un modo di risoluzione; all'innesco il motore risponde `null` — *non lo so* — e l'app dice che la mina **resta sul tavolo**, invitando a toglierla a mano. È corretto così: un "no" sarebbe falso. → DATABASE, quando la fonte darà il dato.

**T-02 — "Un pilota, un segnalino" è una lettura, non una regola.**
- **Attivo:** il secondo segnalino di pilota sullo stesso REM · unità e schermata **DA COMPLETARE**
- **Atteso:** oggi si legge questo: "un pilota, un segnalino" è una lettura, non una regola. La wiki vieta esplicitamente solo il secondo segnalino sullo stesso REM. → REGOLE

**T-03 — Il recupero parziale non esiste.**
- **Attivo:** riapri l'app con la copia locale mancante del tutto
- **Atteso:** oggi si legge questo: il pulsante non compare. Costruirlo è possibile, ma potrebbe recuperare **solo le unità visibili**: per regola (riga 13896) un Hidden non mette il suo Ordine nel pool, e l'esistenza di quell'Ordine è informazione privata. Se si fa, deve dire "non conoscibili dall'Hub, per regola" — non zero. → INTERFACCIA

**T-04 — Due identificativi ignoti:**
- **Attivo:** apri il Monstrucker e Shona Carano
- **Atteso:** oggi si legge questo: `?219` sul Monstrucker e `?227` su Shona Carano. Le tabelle di decodifica sono ridotte per fazione e questi non stanno in nessuna delle due. → DATABASE

## Da costruire, deciso ma non fatto

**C-01 — Cybermask**
- **Attivo:** la voce di menu Cybermask · unità e schermata **DA COMPLETARE**
- **Atteso:** oggi si legge questo: da costruire. Una voce di menu con la stessa forma del piazzamento; la prova per intero sta nel blocco ORD. → MOTORE per la regola e la domanda, INTERFACCIA per il menu

**C-02 — Rientrare in Camuffato**
- **Attivo:** la voce di menu Rientrare in Camuffato · unità e schermata **DA COMPLETARE**
- **Atteso:** oggi si legge questo: da costruire. Una voce di menu con la stessa forma del piazzamento; la prova per intero sta nel blocco ORD. → MOTORE per la regola e la domanda, INTERFACCIA per il menu

**C-03 — Le due zone temporanee.**
- **Attivo:** il menu del calcolo, voci Fumo ed Eclipse
- **Atteso:** oggi si legge questo: da costruire. Fumo ed Eclipse non sono terreni dello scenario: nascono da un'azione e durano un turno. Vanno **sempre** disponibili nel menu del calcolo, indipendentemente dallo schieramento, e si dichiarano al momento del tiro come la copertura. Servono entrambe, perché un MSV L2 attraversa il Fumo ma non l'Eclipse: con una voce sola il giocatore col visore sceglierebbe quella sbagliata. → INTERFACCIA per il menu, MOTORE per il MOD

**C-04 — Le icone dei due pulsanti.**
- **Attivo:** i due pulsanti Copertura e linea di tiro
- **Atteso:** oggi si legge questo: Copertura e linea di tiro hanno ora le quattro immagini (bersaglio in copertura parziale, bersaglio non in copertura, LoF libera, LoF interrotta); vanno nella cartella `img/` accanto ad `app.html`. → INTERFACCIA

**Chiuse dalla revisione 6**, da confermare in app: l'anello dell'hacking, il
RemDriver col rifiuto nel motore, l'Albedo col valore del profilo, gli usi
Disposable, il dado speciale, la Schivata contro le mine, la ripresa di app e Hub.

# 25. Blocco W — Sweep in console

**SW-01 — Tutte le armi si risolvono**
- **Attivo:** da incollare in console:
```js
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  const av = (a.avvisi||[]).map(x=>x.codice).join(',');
  if (a.nonTrovata || av) console.log(n, '->', av || 'NON TROVATA');
});
```
- **Atteso:** solo **A51b** sui 21 contenitori di modalità e **A47** su Jammer e D-Charges (Demolition Mode), che sono modi dedotti. Ogni altro codice è una segnalazione.

**SW-02 — Bande anomale** *(corretto: va escluso anche `senzaGittata`)*
- **Attivo:** da incollare in console:
```js
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  if (a.isTemplate || a.isCC || a.modalita || a.senzaGittata) return;
  if (!a.bands || !a.bands.length) console.log('SENZA BANDE:', n);
  if (a.bands && a.bands.every(b => b.mod === 0)) console.log('TUTTE A ZERO:', n);
});
```
- **Atteso:** nessuna riga. Senza il filtro `senzaGittata` escono otto falsi positivi — i deployable, che hanno la banda finta con l'etichetta del modo.

**SW-03 — Salvezze complete**
- **Attivo:** da incollare in console:
```js
const b = DB_PANOCEANIA.find(u=>u.nome==='Fusilier (Combi Rifle)');
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  if (a.modalita) return;
  const s = MotoreN5.tiroSalvezza(b, {arma:a, ammo:a.ammo});
  if (s.offensivo !== false && (!s.attributo || !s.tiri)) console.log('INCOMPLETA:', n);
});
```
- **Atteso:** **DA COMPLETARE**

**SW-04 — Notazioni sconosciute nei profili**
- **Attivo:** da incollare in console:
```js
[...DB_NOMADI, ...DB_PANOCEANIA].forEach(u =>
  MotoreN5.tutteLeNotazioni(u).forEach(x => { if (x.sconosciuta) console.log(u.nome, x.raw); }));
```
- **Atteso:** nessuna.

**SW-05 — Deployable collegati**
- **Attivo:** da incollare in console:
```js
DB_DEPLOYABLES.forEach(d => {
  if (!d.chiaveArma) return console.log(d.id, '-> nessuna arma (voluto?)');
  const a = MotoreN5.profiloArma(d.chiaveArma);
  if (a.nonTrovata) console.log('SCOLLEGATO:', d.id, '->', d.chiaveArma);
});
```
- **Atteso:** solo `deployable_repeater` e `dazer`, che hanno `chiaveArma: null` di proposito.

---

# 27. Blocco DC — Quello che resta da completare

Non sono difetti dell'app: sono **buchi del piano**. Queste 118 prove su 296
hanno un campo che il piano non dice e che nessuna convenzione può coprire —
quale unità usare, quale arma, quale banda. Le ho lasciate marcate
**DA COMPLETARE** dentro la prova, invece di riempirle con una supposizione:
un numero inventato ti farebbe credere che l'app sia rotta quando non lo è,
oppure il contrario.

Dove il buco è il solo attaccante e la prova misura una **salvezza** o una
**difesa**, l'attaccante non cambia il risultato: usa la prima unità del
roster che porta l'arma indicata. Dove invece manca l'arma, la banda o il
bersaglio, il numero atteso **dipende** da quella scelta e va deciso prima.

| Prova | Campi da completare |
|---|---|
| **A-02** | Bersaglio, Con |
| **BS-02** | ARO |
| **BS-04** | Bersaglio |
| **BS-05** | Bersaglio |
| **BS-08** | Bersaglio |
| **BS-09** | Bersaglio |
| **BS-11** | Bersaglio |
| **BS-12** | Bersaglio |
| **BS-13** | Bersaglio |
| **BS-14** | Attivo |
| **BS-15** | ARO, Attivo, Bersaglio, Con |
| **BS-16** | ARO, Bersaglio |
| **BS-17** | Bersaglio |
| **BS-18** | Bersaglio |
| **BS-19** | ARO, Bersaglio |
| **BS-20** | Attivo, Bersaglio, Con |
| **BS-24** | ARO, Bersaglio, Con |
| **BS-25** | ARO, Bersaglio |
| **MU-01** | Attivo |
| **MU-02** | Attivo |
| **MU-03** | Attivo |
| **MU-04** | Attivo |
| **MU-05** | Attivo |
| **MU-06** | Attivo |
| **MU-07** | Attivo |
| **MU-08** | Attivo |
| **MU-09** | Attivo |
| **MU-10** | Attivo |
| **MU-11** | Attivo |
| **MU-12** | Attivo |
| **MU-13** | Attivo |
| **MU-14** | Attivo |
| **MU-15** | Attivo |
| **MU-16** | Attivo |
| **MU-17** | Attivo, Bersaglio, Con |
| **MU-18** | Attivo, Bersaglio, Con |
| **MU-19** | Attivo, Bersaglio, Con |
| **MU-20** | Attivo, Bersaglio |
| **MU-21** | Attivo, Bersaglio |
| **MU-22** | Attivo |
| **MU-23** | Attivo, Bersaglio |
| **TPL-05** | Bersaglio |
| **TPL-08** | Bersaglio |
| **SPEC-04** | Bersaglio |
| **SPEC-05** | Attivo, Bersaglio, Con |
| **GUI-01** | Bersaglio |
| **GUI-03** | Bersaglio |
| **GUI-05** | ARO, Bersaglio |
| **CC-01** | ARO |
| **CC-02** | ARO, Con |
| **CC-03** | Attivo, Bersaglio, Con |
| **CC-05** | ARO, Attivo, Bersaglio, Con |
| **CC-06** | Attivo |
| **CC-07** | Attivo, Bersaglio, Con |
| **HK-01** | Attivo |
| **HK-02** | Attivo |
| **HK-03** | Attivo |
| **HK-04** | Attivo |
| **HK-05** | Attivo |
| **HK-06** | Attivo, Con |
| **HK-07** | Attivo, Bersaglio, Con |
| **HK-08** | Attivo, Con |
| **HK-09** | Attivo, Con |
| **HK-10** | Attivo, Bersaglio |
| **HK-11** | Attivo, Bersaglio, Con |
| **HK-12** | Attivo, Bersaglio, Con |
| **SCO-01** / **DIS-01** | Attivo, Bersaglio |
| **SCO-02** / **DIS-02** | Attivo, Bersaglio |
| **SCO-03** / **DIS-03** | Attivo, Bersaglio |
| **SCO-04** / **DIS-04** | Attivo, Bersaglio |
| **SCO-05** / **DIS-05** | Attivo, Bersaglio, Con |
| **OSS-01** | Bersaglio |
| **OSS-03** | Con |
| **SUP-01** | Bersaglio |
| **SUP-02** | Bersaglio |
| **SUP-04** | Attivo, Bersaglio |
| **SUP-05** | Attivo |
| **SUP-06** | Attivo |
| **SUP-07** | Attivo, Bersaglio |
| **DIF-01** | ARO, Attivo |
| **DIF-02** | ARO, Attivo |
| **DIF-03** | Attivo |
| **DIF-04** | ARO, Attivo |
| **DIF-05** | ARO, Attivo |
| **DIF-06** | ARO, Attivo |
| **DIF-07** | ARO, Attivo |
| **DIF-08** | ARO, Attivo |
| **DIF-09** | Attivo |
| **DIF-10** | Attivo, Con |
| **DIF-11** | Con |
| **DIF-12** | ARO, Attivo |
| **DIF-13** | Attivo |
| **DEP-08** | Con |
| **DEP-09** | Bersaglio |
| **LOG-01** | Attivo |
| **LOG-02** | Attivo |
| **LOG-03** | Attivo |
| **FT-03** | Attivo, Bersaglio, Con |
| **FT-04** | Attivo, Bersaglio, Con |
| **FT-05** | Attivo |
| **FT-06** | Attivo, Bersaglio, Con |
| **CO-01** | Attivo |
| **CO-02** | Attivo, Con |
| **CO-03** | Attivo, Con |
| **CO-04** | Attivo |
| **CO-06** | Attivo |
| **CO-07** | Attivo |
| **CO-08** | Attivo |
| **CO-09** | Attivo |
| **CO-10** | Attivo, Bersaglio, Con |
| **CO-11** | Attivo, Bersaglio, Con |
| **CO-12** | ARO, Attivo |
| **CO-13** | Attivo |
| **TER-01** | Attivo, Bersaglio, Con |
| **TER-02** | Attivo, Bersaglio, Con |
| **TER-03** | Attivo, Bersaglio, Con |
| **TER-04** | Attivo, Bersaglio, Con |
| **TER-05** | Attivo, Bersaglio, Con |
| **TER-06** | Attivo, Bersaglio, Con |
| **TER-07** | Attivo, Bersaglio, Con |
| **TER-08** | ARO, Attivo, Bersaglio, Con |
| **DET-01** | ARO |
| **DET-02** | ARO |
| **DET-03** | ARO |
| **DET-04** | Attivo |
| **ORD-01** | Attivo |
| **ORD-02** | Attivo |
| **D-02** | ARO, Attivo, Bersaglio, Con |
| **D-01** | Attivo, Bersaglio, Con |
| **D-03** | Attivo |
| **T-01** | Attivo |
| **T-02** | Attivo |
| **C-01** | Attivo |
| **C-02** | Attivo |
| **SW-03** | Atteso |

**Due prove hanno un buco che le rende non eseguibili così come sono:**

- **SW-03** non dice cosa deve stampare il comando: manca l'Atteso.
- **TPL-04** dà il valore dell'attivo (14 B1) ma **nessun valore al reattivo**,
  che fa un ATTACCO BS in ARO: il Faccia a Faccia non si chiude.

**Quattro contraddizioni interne, da decidere:**

- **ST-16** attende **Mimetizzato** sul tabellone, **ST-20** attende **CAMO**
  in tutti e due i posti e dice che "Mimetizzato" era il nome vecchio.
- **ST-14** chiede IMM-A + Bersagliato + **Prono** visibili insieme, ma
  **ST-19** dichiara che dal 23 settembre il Prono non è più uno stato.
- **ER-22** sta sotto l'intestazione "l'invio deve essere **bloccato**", ed è
  l'unica riga del blocco U in cui l'invio **deve passare**.
- ~~Il codice **DIS-01…DIS-05** usato due volte~~ — **risolto**: le cinque
  prove dello Scoprire (blocco J) sono ora **SCO-01…SCO-05**; **DIS-01…DIS-05**
  resta al solo blocco 23-bis (Disposable).

**Una prova aveva il valore atteso sbagliato, ed è corretta:** SPEC-02
chiedeva 18 applicando la regola N4; il valore misurato è **12**.

---

# 28. Blocco SP — Scoprire + Piazzare, e il Coordinato con lo Scoprire

Nuovo l'8 ottobre: `ordine_piazzamento.js` **2026-10-07.7** e
`ordine_scoprire.js` **2026-10-07.6** compongono lo Scoprire con il
Piazzamento, e il motore **2026-10-08.1** scrive i due campi che il tabellone
legge. Prima della `.5` partiva solo il piazzamento e **lo Scoprire andava
perso**: queste nove prove sono la rete su quel difetto.

Serve una Puppet Masters (o altra truppa con un Deployable) e un Marker
avversario. Tutte in **Ordine singolo**, dove non detto.

**SP-01 — Dopo lo Scoprire il menu offre il Piazzare**
- **Attivo:** Puppet Masters · SCOPRIRE → *(menu della 2ª metà)*
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** nessuno
- **Atteso:** fra le seconde metà compaiono **PIAZZARE EQUIPAGGIAMENTO** e **ATTACCO BS**. Non un secondo Scoprire.

**SP-02 — In Ordine Coordinato il Piazzare NON si offre**
- **Attivo:** due Alguaciles in Ordine Coordinato · SCOPRIRE → *(menu della 2ª metà)*
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** nessuno
- **Atteso:** si offre **ATTACCO BS**, **non** PIAZZARE EQUIPAGGIAMENTO: il Piazzare è costruito solo per l'Ordine singolo. E il menu della prima metà non offre né Fuoco Speculativo né Attacco Intuitivo.

**SP-03 — Prima i modificatori dello Scoprire, poi il piazzamento**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Mina Shock
- **Bersaglio:** Marker avversario @ banda 0, copertura no
- **ARO:** nessuno
- **Atteso:** compare prima la schermata dei modificatori dello **Scoprire**, e il tasto in fondo dice **"AVANTI: PIAZZA EQUIPAGGIAMENTO"**. Solo dopo si scelgono l'arma e le domande del piazzamento, e il tasto diventa **"PIAZZA"**.

**SP-04 — Sul tabellone lo Scoprire viene prima**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Mina Shock
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** nessuno
- **Atteso:** **un solo** scontro inviato, due righe sul tabellone: **Azione: SCOPRIRE** sopra, **Azione: PIAZZARE EQUIPAGGIAMENTO** (titolo "ABILITÀ SENZA TIRO") sotto. Nessun avviso d'errore. Il segnalino finisce nel roster di chi l'ha piazzato.

**SP-05 — Marker nell'area d'innesco: il piazzamento è condizionato**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Mina Shock, e alla domanda sul Marker **nell'area d'innesco** rispondi **SÌ**
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** nessuno
- **Atteso:** compare una **seconda domanda** che non c'era, e sul tabellone si legge **a vista** (non dentro i dettagli chiusi) **"PIAZZAMENTO CONDIZIONATO"**, col nome del segnalino e del Marker, e **"tira PRIMA questo Scoprire"** sulla riga dello Scoprire. Se lo Scoprire fallisce il segnalino non si piazza: va messo in stato Morto, e l'uso dichiarato resta consumato.

**SP-06 — Senza Marker nell'area la nota NON c'è**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Mina Shock, e alla domanda sul Marker nell'area rispondi **NO**
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** nessuno
- **Atteso:** **nessuna** nota "PIAZZAMENTO CONDIZIONATO" e **nessun** "tira PRIMA". È la controprova di SP-05: senza, "la nota compare" non si distingue da "la nota c'è sempre".

**SP-07 — Coordinato con tre partecipanti: l'Ordine parte**
- **Attivo:** **tre** Alguaciles in Ordine Coordinato · SCOPRIRE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Marker avversario @ banda 1
- **ARO:** nessuno
- **Atteso:** l'Ordine **parte**. Sei voci (due per partecipante) ma **nessun errore sul numero di unità**: il limite di 4 conta le truppe, non le voci. Fino al 7 ottobre qui usciva un rifiuto che parlava di "6 unità".

**SP-08 — Coordinato con cinque partecipanti: rifiutato**
- **Attivo:** **cinque** Alguaciles in Ordine Coordinato · SCOPRIRE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Marker avversario @ banda 1
- **ARO:** nessuno
- **Atteso:** rifiutato, e il messaggio dice **"Ordine Coordinato con 5 unità: il massimo è 4"** — cinque, non dieci. È la controprova di SP-07.

**SP-09 — Dopo la prima metà il reattivo deve rispondere**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** il reattivo **non tocca niente**, poi tocca **PASSA (NESSUN ARO)**
- **Atteso:** finché il reattivo non risponde l'Hub **non calcola** e il tabellone resta vuoto — non è un blocco, è l'attesa. Appena arriva **PASSA (NESSUN ARO)** lo scontro compare. Vedi la **convenzione 4** in testa al piano: è il motivo per cui "ARO: nessuno" vuol dire *dichiarare* Nessun ARO.

**Entrambi i casi che erano aperti ora hanno un banco** (`test_scoprire_attacco.js`
sezione 11, misurato sul motore): il Coordinato con **quattro** partecipanti
(otto voci, otto scontri, Burst 2 alla Punta e 1 ai gregari) e lo
**Scoprire + Piazzare col Marker che reagisce** (tre scontri: "SCOPRIRE: NON
SI TIRA", il piazzamento condizionato, e l'ARO del Marker come Tiro Normale a
sé). Resta da guardare solo **l'aspetto nel browser vero**.

**SP-10 — Scoprire + Piazzare quando reagisce il Marker stesso**
- **Attivo:** Puppet Masters · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Mina Shock, Marker **nell'area d'innesco** (rispondi SÌ)
- **Bersaglio:** Marker avversario @ banda 0
- **ARO:** il Marker stesso → ATTACCO BS, Combi Rifle, banda 0, contro la Puppet Masters
- **Atteso:** sulla **schermata** dello Scoprire della seconda metà si legge l'intestazione col **nome vero** e il riquadro **"SCOPRIRE: NON SI TIRA"** — *"<nome> non è più un Marker: si è rivelato da solo (ha dichiarato un ARO). Lo Scoprire non si tira; l'Ordine prosegue."* — e **non** WIP, gittata, copertura o interruttori dei requisiti. Il tasto resta **"AVANTI: ..."**. Sul tabellone **tre** scontri: lo Scoprire che non si tira, il piazzamento **condizionato**, e l'ARO del Marker come **Tiro Normale a sé**. La nota *"tira PRIMA questo Scoprire"* **non** compare: non c'è più niente da tirare.

**SP-11 — Coordinato con quattro partecipanti**
- **Attivo:** **quattro** Alguaciles in Ordine Coordinato · SCOPRIRE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Marker avversario @ banda 1
- **ARO:** nessuno
- **Atteso:** l'Ordine parte senza avvisi. **Otto** scontri sul tabellone, due per partecipante. **Burst 2** alla Punta di Lancia e **1** a ciascuno dei tre gregari.

---

# 29. Blocco SG — La Sagoma e i tuoi alleati

Nuovo l'8 ottobre (motore **2026-10-08.9**). Il regolamento non chiede
"quanti tuoi alleati nella mischia di questo bersaglio" ma **"un tuo alleato
sarebbe colpito dalla Sagoma?"** — e quella domanda vale **anche fuori dalla
mischia**. Sono due domande diverse, con due tasti diversi:

| arma | domanda | tasti | quando compare |
|---|---|---|---|
| senza Sagoma | quanti tuoi alleati in quella mischia | 0, 1, 2, **3+** | solo se il bersaglio è Ingaggiato |
| a Sagoma (non Fumo) | la Sagoma prende anche un tuo alleato? | **SÌ: colpo annullato** / NO | **sempre** |
| Fumo, Eclipse | *nessuna domanda* | — | mai |

Serve un'arma a Sagoma (Missile Launcher in Blast Mode, o un Lanciafiamme),
un HMG, e Granate Fumogene.

**SG-01 — Senza Sagoma: i tasti sono quattro, e solo in mischia**
- **Attivo:** Intruder (HMG) · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier **(Ingaggiato)** @ banda 1, copertura no
- **ARO:** nessuno
- **Atteso:** compare la domanda **"quanti TUOI alleati sono in quella mischia?"** con i tasti **0, 1, 2, 3+**. Parte da **1**, non da 0. Con un bersaglio **non** Ingaggiato la domanda **non compare**.

**SG-02 — Senza Sagoma: il MOD si ferma a −12**
- **Attivo:** Intruder (HMG) · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Ingaggiato) @ banda 0, copertura no
- **ARO:** nessuno
- **Atteso:** con **1** alleato il MOD è **−6**; con **2** è **−12**; con **3+** resta **−12** e nei dettagli compare la voce **"MOD minimo −12"**. Il numero del tiro si ferma a 0, non va sotto.

**SG-03 — A Sagoma: la domanda è SÌ/NO, e compare anche fuori dalla mischia**
- **Attivo:** una truppa con Missile Launcher · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier **non Ingaggiato** @ banda 3, copertura no
- **ARO:** nessuno
- **Atteso:** la domanda **compare** anche se nessuno è in mischia, con i due tasti **"SÌ: colpo annullato"** e **"NO"**. Parte da **NO**. Nomina il **neutrale** e il **Marker Impersonation nemico**, e dice "anche passato nell'area durante l'Ordine". I tasti 0/1/2/3+ **non** ci sono.

**SG-04 — A Sagoma su una mischia: parte da SÌ**
- **Attivo:** una truppa con Missile Launcher · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier **(Ingaggiato)** @ banda 3
- **ARO:** nessuno
- **Atteso:** la stessa domanda, ma parte da **SÌ**: la Sagoma su una mischia prende tutti i coinvolti.

**SG-05 — SÌ: il colpo è annullato per TUTTI i bersagli**
- **Attivo:** una truppa con Missile Launcher · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode), e rispondi **SÌ**
- **Bersaglio:** Fusilier (Ingaggiato) come Principale @ banda 3, **più** un secondo Fusilier **non** Ingaggiato sotto la Sagoma
- **ARO:** nessuno
- **Atteso:** **nessun dado** e **nessun Tiro Salvezza** per **entrambi**. Sul bersaglio in mischia si legge **"SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO"**; sull'altro **"UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA"**. Le due scritte sono diverse. Entrambe dicono che **gli ARO restano** e che **l'uso Disposable si consuma lo stesso**.

**SG-06 — NO: il colpo vale, anche col bersaglio Ingaggiato**
- **Attivo:** una truppa con Missile Launcher · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode), e rispondi **NO**
- **Bersaglio:** Fusilier (Ingaggiato) @ banda 3
- **ARO:** nessuno
- **Atteso:** il colpo **vale**, i dadi si tirano, e nei dettagli si legge *"Bersaglio Ingaggiato, ma nessun tuo alleato né neutrale sotto la Sagoma: il colpo vale."* È la controprova di SG-05: senza, "il SÌ annulla" non si distingue da "si annulla sempre".

**SG-07 — Colpo unico: una domanda sola, sul Principale**
- **Attivo:** una truppa con Missile Launcher · FUOCO SPECULATIVO *(ripeti con ATTACCO GUIDATO e ATTACCO INTUITIVO)*
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Ingaggiato) come Principale, **più** un secondo Fusilier **(Ingaggiato)** come secondario
- **ARO:** nessuno
- **Atteso:** la domanda compare **una volta sola**, sulla scheda del **Principale**. Sul secondario **non** c'è. Rispondendo **NO** sul Principale il colpo **vale**, anche se il secondario è Ingaggiato — prima qui il colpo si annullava comunque.

**SG-08 — Fumo ed Eclipse: nessuna domanda, e non si annullano mai**
- **Attivo:** una truppa con Granate Fumogene · ATTACCO BS *(ripeti con Eclipse)*
- **Con:** Smoke Grenades
- **Bersaglio:** una zona che prende un Fusilier **(Ingaggiato)** col tuo alleato
- **ARO:** nessuno
- **Atteso:** **nessuna domanda**. Il colpo **non** si annulla, e **non** c'è il −6: nei dettagli si legge che è **Targetless** (riga 3389). È il caso in cui prima usciva **ANNULLATO**.

**SG-09 — Burst 2: l'annullamento resta per bersaglio**
- **Attivo:** una truppa con un'arma a Sagoma a **Burst 2** · ATTACCO BS
- **Con:** l'arma a Sagoma, **2 dadi** divisi fra due bersagli
- **Bersaglio:** un Fusilier (Ingaggiato) col **SÌ**, e un secondo Fusilier **non** Ingaggiato col **NO**
- **ARO:** nessuno
- **Atteso:** solo il **primo** è annullato; il secondo **tira i suoi dadi**. Con Burst 2 o più le Sagome sono più d'una, e l'app non sa quale prende chi. È la controprova di SG-05.

**SG-10 — Il secondario della Sagoma arriva sul tabellone**
- **Attivo:** una truppa con Missile Launcher · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** un Bersagliato come Primario @ banda 3, **più** un secondario sotto la Sagoma
- **ARO:** nessuno
- **Atteso:** sul tabellone ci sono **due** scontri, non uno: il Primario **e** il secondario, ciascuno col suo nome. Il Faccia a Faccia e il Critico restano del **solo** Primario; sul secondario un Critico vale come successo normale. Fino all'8 ottobre il secondario non compariva.

**Non misurato, resta per il tavolo:** l'aspetto dei tasti nel browser vero, e
un **Marker Impersonation** davvero sotto la Sagoma (il motore non lo vede: lo
dichiara il giocatore col SÌ).

---

# 26. Ordine di esecuzione

1. **Preflight**. Se PRE-01 o PRE-02 falliscono, fermati. E dopo **ogni**
   sostituzione di file, prima di qualunque altra cosa: `node
   test_caricamento_pagine.js`. È l'unico controllo che vede un file
   dichiarato dalla pagina e non presente — è già successo due volte in un
   mese, e senza di lui l'app semplicemente non parte.
2. **RIP** (ripresa): se l'Hub non riapre bene, tutto quello che viene dopo si
   gioca su una partita che potrebbe cancellarsi da sola.
3. **A, B, C** — il grosso, e i più veloci.
4. **U** (contratto): trova subito le regressioni sui bersagli e sugli errori
   bloccanti.
5. **DIS** (usi Disposable): poche prove, e sono quelle che al tavolo cambiano
   quanti colpi hai davvero.
6. **M, N** (stati): sono quelli che fanno perdere ordini.
7. **O, DEP, DET** (deployable, mine e detonazione): il blocco con più cose da
   confermare.
8. **D, E, F, G, H, I, J, K, L, P** — un blocco per sessione.
9. **Q, R, S, T** — servono uno schieramento dedicato.
10. **W** in console, una volta, alla fine.
11. **V**: conferma le quattro divergenze rimaste e le correzioni chiuse dalla
    revisione 5.

Segna ogni fallimento con: codice della prova, unità e stato, cosa hai letto,
cosa ti aspettavi. Col codice, chi riceve la segnalazione sa già quale riga di
quale file guardare.

E una cosa imparata in questi giorni, che vale anche al tavolo: quando un
numero non torna, **guarda prima il dato di prova**. In due settimane, di tutti
i rossi arrivati alle quattro chat, uno solo ha migliorato il codice — tutti
gli altri erano prove che misuravano la cosa sbagliata, o profili cercati nella
fazione sbagliata, o campi costruiti a mano più completi della realtà.

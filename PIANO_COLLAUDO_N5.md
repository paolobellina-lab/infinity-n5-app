<!-- @versione 2026-10-10.1 | PIANO_COLLAUDO_N5.md | proprieta`: chat TEST -->

# Piano di collaudo — Calcolatore Infinity N5 (revisione 25)

La **revisione 25** (10 ottobre) è una revisione di **allineamento**: non aggiunge
prove — restano **297** — e riporta il piano allo stato dell'app di oggi. Tre
cose erano diventate false senza che nessun numero cambiasse.

**Voci marcate "da costruire" che sono costruite.** ORD-02 (Cybermask), ORD-03
(Rientrare in CAMO) e C-03 (Fumo ed Eclipse) portavano ancora l'etichetta e
l'atteso di quando non esistevano. Sono riscritte sull'app vera, e due attese
erano sbagliate: alla domanda sulla Linea di Tiro, rispondere **NO non vuol
dire "non si può dichiarare"** ma **"il requisito non è soddisfatto: Idle, e
l'Ordine è speso"**; e la voce si chiama `RIENTRARE IN CAMO`, non "in Camuffato".

**Il blocco G dopo la correzione di MOTORE.** `M.haGuidato` legge ora solo la
Skill (motore 2026-10-09.5), `M.armiGuidate` senza Skill non restituisce armi
(2026-10-09.6) e il modulo non disegna bottoni (2026-10-09.2). Con questo
**GUI-02 e GUI-04 non erano più eseguibili** — usavano l'Alguacil, che la Skill
non ce l'ha — e la controprova di GUI-01 diceva il contrario di quello che
l'app fa. Rifatte sul **Vertigo Zond** (BS 12): GUI-02 dà **18**, GUI-04 **12**.

**Il roster passa da 43 a 52 righe** (Nomadi 29-37). Nove prove nominavano una
truppa che non era schierata: cinque del blocco MU lo dicevano con un ⚠️ da
un giorno, quattro erano fra le "non eseguibili". Sono aggiunte, non sostituite.
Cercando chi mettere sono uscite **due attese sbagliate del piano**, tutte mie:
- DET-04 diceva che `Chest Mines` **non è nell'armamento di nessun profilo**.
  Cercavo il plurale: al singolare, `Chest Mine`, lo portano **8** profili (i
  Krakot Renegade). Non mancava il dato, mancava la voce di roster.
- DIS-02 diceva che un'arma **Disposable con `(+1SD)` non esiste**. Cercavo
  `Panzerfaust (+1SD)`: esiste `Drop Bears (+1SD)`, sullo **Spector**, 4 profili.
Le "regole senza nessun profilo che possa invocarle" scendono così da quattro
a **due** — il Cubo di SUP-07 e `Sapper` di LOG-01 — e restano per DATABASE.

**Due difetti dell'app trovati misurando dalla pagina**, segnalati e non corretti:
- **L'Attacco BS attivo non offre le armi scritte fra gli equipaggiamenti.**
  `ordine_attacco_bs.js` legge solo il campo `weapon`; le pistole stanno in
  `equip`. Risultato: **629 profili su 765** hanno almeno un'arma a distanza che
  in ARO viene offerta (`M.armiARO` legge tutti e due i campi) e nell'Attacco BS
  attivo no. Il Morlock non può sparare con la Kobra Pistol nel suo turno
  (MU-21). → MOTORE
- **PIAZZARE EQUIPAGGIAMENTO è offerto a chi non ha niente da piazzare.** Il
  menu decide dal nome (cerca `MINE` fra le armi), il motore dai Tratti: al
  Krakot (Chest Mine) e al Bambabot (Mine Dispenser) la voce compare, la
  schermata dice *«Questa unità non ha equipaggiamento da piazzare»* — ma
  l'allarme è già partito e l'Ordine è speso (DET-04). → INTERFACCIA

**Cosa resta non eseguibile, e perché nessun roster può sanarlo:** quattro
prove, elencate nel blocco DC — metà SUP-07, LOG-01, HK-07 e CO-09 (E44). Per
tutte la regola è provata nei banchi con un soggetto costruito a mano.

La **revisione 23 allarga il roster di collaudo da 40 a 43 righe** e rende
eseguibili cinque prove che erano scritte e ferme: **CC-05** (Berserk),
**DIF-09** (Sesto Senso) e **GUI-01/03/05** (Attacco Guidato). Le tre voci
nuove sono tutte nomadi — **26 Wolfgang Amadeus**, **27 Warcor (Sixth Sense)**,
**28 Vertigo Zond (Missile Launcher)** — e sono **aggiunte, non sostituzioni**:
misurando si è visto che ognuna delle 40 voci era nominata da almeno una prova
e cinque da una sola, quindi sostituirne una avrebbe tolto il soggetto a quella
prova. Aggiungere non costa nessuna prova. La revisione corregge anche l'atteso
di **DIF-09**: il **−3 della Soppressione non è mai stato nella Schivata** di
chi è soppresso — va a **chi attacca**, e il Sesto Senso non lo tocca. Resta
non eseguibile metà di **SUP-07**: la parola `Cube` non è in nessuno dei 765
profili, e **nessuna aggiunta al roster può rimediare** — è una domanda per
DATABASE. Le prove da completare restano **25**.

La **revisione 24 chiude il blocco DC: le prove con un campo da riempire sono
0 su 297.** Riempire un campo sembrava lavoro di segreteria e non lo era — per
sapere quale truppa mettere bisogna chiedere al motore chi può farlo, e la
risposta ha trovato cose che nessuna prova guardava. **Quattro attese del piano
erano sbagliate**, tutte mie: **TPL-05** diceva «nessun −3» schivando una
Sagoma senza LoF (il −3 si applica: confondevo *concessa* con *senza malus*),
**SW-01** dichiarava 21 contenitori di modalità e un A47 sul Jammer (sono 23, e
il Jammer non dà più avvisi), **SW-02** quattro filtri invece di cinque, e
**SW-04** controllava un campo (`sconosciuta`) **che non esiste su nessuna
notazione** — una spazzata che non poteva stampare niente e il cui "nessuna" era
vero per il motivo sbagliato. **Un difetto nuovo dell'app**: `M.haGuidato` legge
l'`ECM (Guided -6)` — la **difesa** contro i Guidati — come la capacità di
farli, e 27 profili risultano capaci dove 2 lo sono; per 3 di loro l'ordine
viene **concesso**. Le cinque spazzate del blocco SW non si incollano più in
console: girano in `test_coerenza_dati.js` sezioni 8-12, +25 prove, ed è proprio
quello spostamento che ha scoperto tre delle quattro attese sbagliate. **Sette
prove hanno ora tutti i campi e restano non eseguibili**: tre per una voce di
roster che manca (LOG-02, metà DIS-02, metà DET-04), quattro perché **il dato
non c'è in nessuno dei 765 profili** — il Cubo di SUP-07, `Sapper` di LOG-01, un
Disposable `(+1SD)`, un portatore di `Chest Mines`. Stessa famiglia quattro
volte: una regola scritta nel catalogo e nel motore, con zero profili che
possano invocarla. → DATABASE.

La **revisione 22** completa **FT** (4 prove: Fireteam) e **GUI** (3: Attacco
Guidato): 7 prove, ogni valore misurato col motore **2026-10-09.4**. Ha trovato
**un difetto aperto** — il **+1 SD del Fireteam di Livello 2** è calcolato da
`M.bonusFireteam`, scritto nel banner, e **non arriva né al Burst né allo
scontro**: il meccanismo del dado speciale funziona, manca la fonte Fireteam. E
ha corretto **tre cose del piano**: la premessa di **GUI-01** (l'Alguacil non ha
la Skill `BS Attack (Guided)`, come l'Intruder non aveva l'X Visor) con i suoi
numeri (non 40 e 68 ma **107 e 87** con l'arma, **1 e 1** con la Skill),
l'atteso di **GUI-05** (contro un Guidato si difendono **Schivata E Reset**, non
il solo Reset) e quello di **GUI-03**, dove il filtro cambia col ruolo. Le prove
da completare scendono da 32 a **25**.

La **revisione 21** completa **CC** (6 prove: Arti Marziali, NBW, Colpo di Grazia,
Ingaggiato, Gang-Up) e **SUP** (6: Dottore, MediKit, GizmoKit, filtro, strumento
sconosciuto, ri-tiri): 12 prove, ogni valore misurato col motore **2026-10-09.4**.
Ha trovato **un difetto aperto** — **SUP-05**: il filtro dei bersagli del Supporto
**non distingue VITA da STR** e non cambia con lo strumento, quindi un Dottore si
vede offrire un REM, dove il suo fallimento è letale. E ha corretto **CC-02**, che
il piano aveva calcolato col **PS 8 generico** invece delle notazioni (PS=6) e
(PS=5) dei profili: cioè col difetto che CC-01 esiste per scoprire. Due prove non
sono eseguibili con questo roster e lo dicono: **CC-05** (nessuna delle 40 aveva
Berserk) e metà di **SUP-07** (la parola `Cube` non è in nessuno dei 765 profili).
Le prove da completare erano scese da 44 a **32**.

La **revisione 20** completa **BS** (8 prove), **HK** (8: Infoguerra) e
**TER** (8: terreni e visibilità): 24 prove, ogni valore misurato col motore
**2026-10-09.1**. Tre valori che il piano dichiarava erano sbagliati e sono
stati corretti: **BS-15** (il Sierra in Total Reaction reagisce col suo HMG a
Burst **4**, non 3), **BS-25** (l'HMG in ARO è **4**, non 1) e soprattutto
**TER-04** — il White Noise blocca la Linea di Tiro per **tutti e tre** i
livelli di Multispectral Visor, mentre il piano aveva copiato lo schema della
Foresta (dove L2 e L3 passano). Le prove da completare erano scese da 68 a **44**.

La **revisione 19** completa **DIF** (13 prove: Schivata, Reset, Soppressione) e
**CO** (12 prove: Ordine Coordinato). Tutti i valori che il piano già dichiarava
sono stati verificati col motore: **tutti combaciavano**, e decodificano un
reattivo con **WIP 13** — l'Alguacil #1 serve da solo per DIF-01…DIF-08, perché
è PH 10 e WIP 13. Le prove da completare erano scese da 93 a **68**.

**Due cose non sono eseguibili e lo dicono:** il Sesto Senso (DIF-09) non ce
l'aveva nessuna delle 40 truppe di allora, e **E44** (CO-09, Regolari con Irregolari) non è
innescabile perché **nessuno dei 385 profili Nomadi dichiara la Skill
`IRREGULAR`** — il controllo del motore è giusto, i dati non lo raggiungono.

**Un difetto del motore trovato scrivendo CO-03:** il Leader di un Fireteam che
è gregario di un Ordine Coordinato dovrebbe avere il **Burst pieno**, e il
commento del motore lo dichiara; il codice lo porta a 1 come ogni altro
gregario. Segnalato a MOTORE; la prova resta, perché è quella che lo prende.

La **revisione 18** completa **tutto il blocco MU** (23 prove sulle munizioni):
ogni prova ha ora l'unità che porta davvero quell'arma, il bersaglio col suo
numero di schieramento, e l'**atteso misurato** col motore 2026-10-09.1. I
valori che il piano già dichiarava sono stati **verificati uno per uno**, non
ricopiati: tutti combaciavano tranne due, corretti (vedi sotto). Le prove da
completare scendono da 116 a **93**.

**Cinque prove MU chiedono un'arma che nessuna delle 40 truppe schierate
porta** — T2, E/Mitter, Adhesive Launcher Rifle, Kobra Pistol, K1. Sono
marcate ⚠️ con il profilo esatto da aggiungere; la Kobra Pistol è una variante
del Morlock, che è già in lista.

La **revisione 17** corregge la premessa sbagliata di **BS-08** e **BS-09**
(l'X Visor non ce l'ha l'Intruder: sono rifatte su **Croc Man**, con i valori
misurati) e aggiunge **BS-26** come controprova. Il roster dice ora
**Intruder (MULTI Sniper Rifle)**, il nome vero del database.

La **revisione 16** aveva aggiunto il **blocco SG** (dieci prove: la Sagoma e i
tuoi alleati — la domanda nuova, il colpo annullato per tutti, il Fumo che non
si annulla mai, il secondario che ora arriva sul tabellone).

La **revisione 15** aveva aggiunto due prove al blocco SP — **SP-10** (Scoprire +
Piazzare quando reagisce il Marker stesso) e **SP-11** (Coordinato con quattro
partecipanti).

La **revisione 14** aveva aggiunto il **blocco SP** e **corretto la
convenzione 4**, che diceva una cosa sbagliata e bloccava il tavolo.

Sostituisce la revisione 13 dell'8 ottobre. **297 prove, tutte nello stesso
format**: si eseguono dall'app, una per una, senza dover andare a
cercare un'altra prova per capire cosa fare.

**Dove guardare se un numero non torna:** prima la scheda ufficiale della
miniatura, poi il **blocco DC** in fondo — potrebbe essere una prova con un
campo da completare, non un difetto dell'app.

# 0. Quello che è cambiato dalla revisione 12

**Ogni prova è riscritta nel format dichiarato dal piano stesso**, tutte e 297, nelle stesse
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

**Nessun campo è più lasciato in bianco, e nessuno è stato riempito a caso.**
Il 9 ottobre sera l'ultimo dei 135 campi muti è stato riempito: ogni soggetto
è una voce vera del roster, verificata nel database con il requisito che la
prova chiede, e ogni numero atteso è stato misurato sul motore di oggi. Il
**blocco DC** in fondo non elenca più i buchi — racconta cosa è venuto fuori
riempiendoli: quattro attese del piano sbagliate, un difetto nuovo dell'app, e
sette prove che hanno tutti i campi e restano non eseguibili perché il dato o
la truppa non esistono.

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
**SCO-01…SCO-05**. Adesso i codici sono tutti univoci: alla revisione 17 sono 297.

**I difetti aperti e segnalati sono dodici**, e stanno tutti insieme nel
**blocco V**, ognuno con la prova che lo mostra e con la data della misura.
Uno è stato chiuso il 9 ottobre sera (`M.haGuidato`).

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

## Quattro convenzioni, per non ripetere la stessa riga 297 volte

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

Dove un dato resta indicato come **non detta** — tipicamente la copertura o la
banda — è una delle convenzioni di sopra, non un buco: si decide al tavolo e
non cambia il numero atteso. I buchi veri, quelli dove il numero *dipendeva*
dalla scelta, sono stati chiusi uno per uno: cosa è venuto fuori a chiuderli
sta nel **blocco DC** in fondo.

## I numeri, e da dove vengono

**I numeri delle truppe vengono dal JSON ufficiale**: 765 profili. Se una
prova dà un numero diverso da quello scritto qui, guarda prima la scheda
ufficiale — il piano invecchia insieme ai dati.

Le prove si eseguono **dall'app**. Tutto ciò che si poteva verificare col
motore è **verde**: **96 file di test, 4491 prove, 0 falliti** con le fonti in
cartella; **4471 passati e 20 non eseguite** come sta oggi il Project, dove
`501.json`, `101.json` e `REGOLE_N5_v5_1_1.txt` non ci sono più (le prove che li
leggono sono contate a parte e nominate, né rosse né verdi). Nessun banco
muto, banco di confronto a zero divergenze (354 scontri identici, 294 attese,
uscita 0). Misura del 10 ottobre: sta in `CONTEGGIO_TEST_10ott.txt`.

🔴 **Il numero delle prove di questo piano non si cambia più a mano.**
`test_piano_schieramento.js` le conta nel testo e pretende che i cinque punti
che lo dichiarano dicano tutti lo stesso numero, che i codici siano uno per
prova e senza doppioni, e che il blocco DC dichiari quante prove hanno
davvero un campo da completare. L'8 ottobre ha trovato quattro numeri
sbagliati, fra cui un "135 prove su 277" che non era mai stato giusto.
Il conto della **suite** qui sopra resta invece una misura del momento, come
un'impronta: va riletto a ogni giro.

I valori attesi sono stati calcolati, blocco per blocco, col motore del giorno
in cui il blocco è stato completato (dal **2026-10-09.1** al **2026-10-09.4**:
lo dice ogni revisione, in testa). Quelli toccati dalla revisione 25 — GUI-01,
GUI-02, GUI-04, LOG-02, DIS-02, DET-04, ORD-02, ORD-03, C-03 e le cinque MU
con la truppa nuova — sono **rimisurati** con `motore_regole_n5.js`
**2026-10-09.6, impronta `a406fef4.705879`**, `catalogo_n5.js` **2026-10-09.3,
impronta `c310f11a.197821`**, `motore_core.js` **2026-10-09.1, impronta
`563a26c8.39990`** e `calcolatore_math.js` **2026-10-07.4, impronta
`afb03fe9.18214`**, sui profili veri. Gli altri **non** sono stati rimisurati
uno per uno col motore di oggi: li tiene la suite, che con questo motore è
verde. Dei file di INTERFACCIA: `app.html` **2026-10-09.6**, `logica_aro.js`
**2026-10-09.2**, `calcolatore_controller.js` e `calcolatore_hub.html`
**2026-10-07.1**. Le regole citate rimandano a `REGOLE_N5_v5_1_1.txt`
(impronta `5ea7581f.904498`, 17029 righe), con `grep -n` — il file non è più
nel Project: lo allega Paolo quando serve.

Il conteggio dei banchi si legge così: **un file, una riga di riepilogo**, e
si somma su tutti i file `test_*.js`, `test_collaudo_suite.js` compreso.
`banco_confronto.js` non stampa quella riga e non entra nel totale.

---

# 1. Preparazione

## 1.1 Roster

**Nomadi** — Sessione A i primi dieci, Sessione B gli altri. Le voci **26-28** sono
le tre aggiunte del 9 ottobre sera, le voci **29-37** le nove del 10 ottobre:
ognuna per una prova che senza di lei non era eseguibile. Nessuna prova
salta fra le due.

| # | Profilo | Serve per |
|---|---|---|
| 1 | Alguacil (Combi Rifle) | BS base, gittate, contratto |
| 2 | Alguacil (HMG) | bande negative, Burst 4, Coordinato |
| 3 | Alguacil (Missile Launcher) | Sagoma a Impatto, EXP; **controprova del Guidato** (ha l'arma, non la Skill) |
| 4 | Alguacil (Forward Observer) | Flash Pulse, Stato Bersagliato |
| 5 | Alguacil (Paramedic) | MediKit |
| 6 | Daktari (Doctor) | Dottore |
| 7 | Clockmaker (Engineer) | Ingegnere, GizmoKit(+1B) |
| 8 | Interventor (Hacker Plus) | Carbonite, Oblivion, Spotlight, Total Control |
| 9 | Zero (Hacker, Killer Hacking Device) | Trinity, Camo, mine |
| 10 | Intruder (MULTI Sniper Rifle) | MSV L2, Surprise Attack |
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
| 26 | **Wolfgang Amadeus** | **CC-05**: è il solo del roster col **Berserk** (+3). Porta anche Martial Arts L3 e Frenzy |
| 27 | **Warcor (Sixth Sense)** | **DIF-09**: è il solo del roster col **Sesto Senso**. PH 11, come il piano già dichiarava |
| 28 | **Vertigo Zond (Missile Launcher)** | **GUI-01/03/05**: è il solo nomade con la Skill **BS Attack (Guided)** (uno dei due in 765 profili) |
| 29 | **Spector (Parachutist, Combat Jump)** | **LOG-02**: Schieramento Aereo, PH 13. **DIS-02**: `Drop Bears (+1SD)`, l'unico Disposable col dado speciale |
| 30 | **Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust)** | **DIS-02**: è il solo con un `Panzerfaust (+1B)`. TAG, BS 13 |
| 31 | **Krakot Renegade (Boarding Shotgun)** | **DET-04**: porta il `Chest Mine`, che non si piazza e non detona |
| 32 | **Bambabot-1 (Chain Rifle (ps=6))** | **DET-04**: porta il `Mine Dispenser (AP)`, che non si piazza e non detona |
| 33 | **Saito Togan (T2 Boarding Shotgun)** | **MU-07**: munizione T2 |
| 34 | **Go-Pod (MULTI Rifle)** | **MU-08**: porta l'E/Mitter |
| 35 | **Racerbot Mk-I (Adhesive Launcher Rifle)** | **MU-10**: Adhesive Launcher Rifle |
| 36 | **Morlock (Kobra Pistol, DA CC)** | **MU-21**: Kobra Pistol, le due modalità |
| 37 | **Hawkwood (K1 Sniper Rifle)** | **MU-23**: ARM = 0 |

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
- **Attivo:** Alguacil (Combi Rifle) (Normale) · MUOVERE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) @ banda 2 (8-16"), **senza** copertura
- **ARO:** nessuno
- **Atteso:** la prima metà non chiede nulla, il calcolo parte sulla seconda: **BS 14** (11 + 3 di gittata, banda 8-16" del Combi) **B3**, e salvezza del Fusilier **ARM VS 8** (ARM 1 + PS 7), un dado, una Ferita. I numeri sono quelli di A-01 più l'attacco: se la prima metà chiedesse qualcosa, o il calcolo partisse sulla prima, si vede subito.

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
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda 0, senza copertura
- **ARO:** Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, banda 0, **contro Alguacil (HMG)** *(Nomadi #2)* — un'unità diversa da chi lo sta attaccando
- **Atteso:** **TIRO NORMALE**, con la nota *«La reazione non è diretta contro l'attaccante»*. I valori restano quelli: attivo BS 11 +3 = **14** B3, reattivo BS 12 +3 = **15** B1; salvezza del Fusilier **ARM VS 8 ×1**. Se esce un Faccia a Faccia, il motore sta accoppiando due tiri che non si affrontano.

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

**BS-08 — X Visor su banda negativa**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6, BS 12, porta l'X Visor)*
- **Con:** MULTI Sniper Rifle (AP Mode), Burst 2
- **Bersaglio:** Alguacil (Combi Rifle) @ **banda 0 (0-8")**, copertura **no**
- **ARO:** nessuno
- **Atteso:** la voce della **gittata non compare** e il totale è **12** (il BS pieno). Se leggi **9** l'X Visor non si sta applicando: quella banda vale −3 per tutti gli altri.

**BS-09 — L'X Visor cancella il malus, non crea un bonus**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*
- **Con:** MULTI Sniper Rifle (AP Mode), Burst 2
- **Bersaglio:** Alguacil (Combi Rifle) @ **banda 6 (48-56")**, copertura **no**
- **ARO:** nessuno
- **Atteso:** totale **12**, non 15. L'X Visor porta a zero le bande negative; **non** le trasforma in +3. Alle bande **2-5** il +3 vero resta e il totale è **15**: provale per vedere la differenza.

**BS-26 — Controprova: senza X Visor la stessa banda vale −3**
- **Attivo:** Nisse (Heavy Machine Gun) *(PanOceania #5, NON porta l'X Visor)*
- **Con:** Heavy Machine Gun
- **Bersaglio:** Alguacil (Combi Rifle) @ **banda 0 (0-8")**, copertura **no**
- **ARO:** nessuno
- **Atteso:** la voce **"Gittata: −3"** compare, e il totale è il BS **meno 3**. Senza questa prova, "l'X Visor funziona" non si distingue da "quella banda non ha malus per nessuno."

🔴 **Premessa corretta il 9 ottobre.** Fino alla revisione 16 queste due prove
dicevano *Intruder (X Visor)*. Quel profilo non esiste: nell'N5 ufficiale
l'Intruder col MULTI Sniper Rifle porta **solo** il Multispectral Visor L2, e
il motore fa bene a leggere 10 (BS 13 − 3). Nel roster l'X Visor ce l'hanno
**Croc Man (MULTI Sniper Rifle)** e **Dr. Harper FTO**, entrambi PanOceania e
già schierati: le prove sono rifatte su Croc Man. I valori sopra sono
**misurati** col motore 2026-10-09.1, non dedotti.

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
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, stato **Stordito** · apri il menu degli Ordini
- **Atteso:** **ATTACCO BS non compare** nel menu. Chiedendolo a forza, il motivo è *«Stato Stordito: ATTACCO BS non è permessa»*. Lo stesso Alguacil senza lo stato ha l'ATTACCO BS disponibile: è la controprova da fare subito prima.

**BS-15 — Total Reaction**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · dichiara **MOVIMENTO**
- **Con:** —
- **Bersaglio:** —
- **ARO:** Sierra Dronbot (Heavy Machine Gun) *(PanOceania #9, Total Reaction)* → **ATTACCO BS**, Heavy Machine Gun, banda 1, contro l'Alguacil
- **Atteso:** Burst **4** — il Burst **pieno dell'arma** — con le due voci *«In Turno Reattivo il Burst è 1»* e *«Total Reaction: Burst pieno dell'arma in ARO»*. L'HMG ha Burst 4: con un'arma a Burst 3 leggeresti 3. **Controprova:** l'Alguacil con la stessa HMG in ARO resta a **1**.

**BS-16 — ARO normale e il (+1B) che non vale in reazione**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **MOVIMENTO**
- **Con:** —
- **Bersaglio:** —
- **ARO:** Puppetbot (Red Fury) *(Nomadi #17, ha BS Attack (+1B))* → **ATTACCO BS**, Red Fury, banda 1, contro il Fusilier
- **Atteso:** in ARO il Puppetbot ha **Burst 1**, con la sola voce *«In Turno Reattivo il Burst è 1»*: il **(+1B) non compare**. Lo stesso Puppetbot in **attivo** ha Burst **5** (vedi BS-17). La differenza fra i due numeri è la prova: il (+1B) vale solo in Turno Attivo. Un Fusilier in ARO ha Burst 1 anche lui, ma per un altro motivo — non ha il (+1B) in nessuno dei suoi profili, quindi su di lui la regola non si vede.

**BS-17 — BS Attack (+1B) solo in attivo**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)*
- **Con:** Red Fury *(Burst 4)*
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda 1, copertura **no**
- **ARO:** nessuno
- **Atteso:** Burst **5** — 4 dell'arma **+1** dalla Skill, con le voci *«Burst dell'arma Red Fury»* e *«BS Attack (+1B): +1 Burst in Turno Attivo»* — e tiro **15**. Lo stesso Puppetbot in ARO: Burst **1** (BS-16).

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
- **Attivo:** Intruder (HMG) *(Nomadi #24, BS 13)*
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Ingaggiato** in mischia con **un tuo alleato** @ banda **2 (16-24")**, copertura **no**. Alla domanda «quanti TUOI alleati in quella mischia» rispondi **1**
- **ARO:** nessuno
- **Atteso:** tiro **10** = BS 13 **+3** di gittata **−6** della mischia, con le due voci *«Gittata: +3»* e *«Tiro dentro una mischia: −6»*. Con **2** alleati la voce diventa −12 e il totale si ferma a 0 (vedi SG-02).

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
- **Attivo:** Intruder (HMG) *(Nomadi #24)*, **in Camo**, con **Mimetism (−3)** e **Surprise Attack (−3)**
- **Con:** Heavy Machine Gun
- **Bersaglio:** Squalo Mk-II (MULTI Marksman Rifle) *(PanOceania #12, BS 15, Combat Instinct)* @ banda **2**, copertura **no**
- **ARO:** Squalo Mk-II → **ATTACCO BS**, MULTI Marksman Rifle (AP Mode), banda 2, contro l'Intruder
- **Atteso:** lo Squalo tira a **15** = BS 15 **+3** di gittata **−3** di Mimetismo. Nell'elenco del reattivo ci devono essere **esattamente due voci**, *«Gittata: +3»* e *«Mimetismo del bersaglio: −3»*, **e nient'altro**: il **−3 di Attacco a Sorpresa non c'è** (p.88), perché il Combat Instinct lo annulla. Il Mimetismo **resta**: Combat Instinct non è immunità a tutto. Se vedi tre voci, la Skill non si applica.

**BS-25 — Neurocinetics** *(risolto, da confermare)*
- **Attivo:** Sin-Eater (MULTI Sniper Rifle) *(Nomadi #20, Neurocinetics)*, in attivo contro un singolo bersaglio
- **Con:** Mk12, poi MULTI Sniper Rifle (AP Mode), poi Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda **2**, copertura **no**
- **ARO:** lo stesso Sin-Eater → ATTACCO BS contro un singolo bersaglio, con la stessa arma, banda 2, contro l'Alguacil (Combi Rifle) #1 che si muove
- **Atteso:** (regolamento p.102) Burst **1 in attivo** con tutte e tre le armi, e **Burst pieno in reazione** — **3** col Mk12, **2** col MULTI Sniper (AP Mode), **4** con l'HMG — con la voce *«Neurocinetics: Burst pieno dell'arma in ARO»*. **Controprova:** un Alguacil con la stessa HMG in ARO resta a **1**. Se in ARO vedi 1 col Mk12, è un difetto.

---

# 5. Blocco C — Munizioni e Tiri Salvezza

Valore di Successo = ARM o BTS (dimezzato se AP, +3 se copertura) + PS
dell'arma; si tira 1d20 e serve **uguale o meno**. Bersagli: **Fusilier**
(ARM 1, BTS 0, PH 10) e **Orc** (ARM 4, BTS 3, PH 14).

**MU-01 — Combi Rifle (N)**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 11 ×1**. Da controllare oltre al numero: Critico = 1 salvezza extra.

**MU-02 — AP Submachine Gun (AP)**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25, porta l'AP Submachine Gun)*
- **Con:** AP Submachine Gun, munizione **AP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 9 ×1**. Da controllare oltre al numero: l'ARM dell'Orc dimezzato.

**MU-03 — Missile Launcher (Blast) (EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)*
- **Con:** Missile Launcher, **Blast Mode**, munizione **EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 10 ×3**. Da controllare oltre al numero: tutte e 3 obbligatorie.

**MU-04 — Missile Launcher (Hit) (AP+EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)*
- **Con:** Missile Launcher, **Hit Mode**, munizione **AP+EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 8 ×3**. Da controllare oltre al numero: dimezza **e** 3 tiri.

**MU-05 — Red Fury (SHOCK)**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)*
- **Con:** Red Fury, munizione **SHOCK**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 8 ×1**; vs Orc **ARM VS 11 ×1**. Da controllare oltre al numero: VITA 1 + Incosciente → **Morto**; annulla Dogged/NWI.

**MU-06 — DA CC Weapon (DA)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7 — questa la tira l'avversario)*
- **Con:** DA CC Weapon, munizione **DA**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 9 ×2**; vs Orc **ARM VS 12 ×2**. Da controllare oltre al numero: entrambe obbligatorie.

**MU-07 — T2 Boarding Shotgun (T2)**
- **Attivo:** Saito Togan (T2 Boarding Shotgun) *(Nomadi #33, aggiunto il 10 ottobre)*
- **Con:** T2 Boarding Shotgun, munizione **T2**
- **Bersaglio:** (a) **Fusilier (Combi Rifle)** *(PanOceania #1,* ARM 1, BTS 0, PH 10), copertura no; (b) **Orc (Hacker, Hacking Device)** *(PanOceania #4,* ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×1**; vs Orc **ARM VS 10 ×1**. Da controllare oltre al numero: ogni fallimento = **2 Ferite**.

**MU-08 — E/Mitter (E/M)**
- **Attivo:** Go-Pod (MULTI Rifle) *(Nomadi #34, aggiunto il 10 ottobre: porta MULTI Rifle ed E/Mitter)*
- **Con:** E/Mitter, munizione **E/M**
- **Bersaglio:** (a) **Fusilier (Combi Rifle)** *(PanOceania #1)*, copertura no; (b) **Orc (Hacker, Hacking Device)** *(PanOceania #4)*, copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×2**; vs Orc **BTS VS 9 ×2**. Da controllare oltre al numero: BTS dimezzato, fallimento = Isolato.

**MU-09 — PARA CC Weapon (PARA)**
- **Attivo:** Reaktion Zond (HMG) *(Nomadi #15, porta la PARA CC Weapon)*
- **Con:** PARA CC Weapon, munizione **PARA**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **PH VS 4 ×1**; vs Orc **PH VS 8 ×1**. Da controllare oltre al numero: è PH−6, non ARM/BTS. Nessuna Ferita, IMM-A.

**MU-10 — Adhesive Launcher Rifle**
- **Attivo:** Racerbot Mk-I (Adhesive Launcher Rifle) *(Nomadi #35, aggiunto il 10 ottobre)*
- **Con:** Adhesive Launcher Rifle
- **Bersaglio:** (a) **Fusilier (Combi Rifle)** *(PanOceania #1)*, copertura no; (b) **Orc (Hacker, Hacking Device)** *(PanOceania #4)*, copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **PH VS 4 ×1**; vs Orc **PH VS 8 ×1**. Da controllare oltre al numero: è PH−6, non ARM/BTS; nessuna Ferita, IMM-A; ma con gittate.

**MU-11 — Flash Pulse (STUN)**
- **Attivo:** Alguacil (Forward Observer) *(Nomadi #4)*
- **Con:** Flash Pulse, munizione **STUN**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×1**; vs Orc **BTS VS 10 ×1**. Da controllare oltre al numero: l'attributo BTS viene dall'arma.

**MU-12 — Nanopulser**
- **Attivo:** Chimera *(Nomadi #14)*
- **Con:** Nanopulser
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **BTS VS 7 ×1**; vs Orc **BTS VS 10 ×1**. Da controllare oltre al numero: l'arma sovrascrive la munizione.

**MU-13 — Smoke Grenades**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13, porta le Smoke Grenades)*
- **Con:** Smoke Grenades
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** **nessuna** salvezza vs Fusilier e **nessuna** vs Orc. Da controllare oltre al numero: "azione non offensiva".

**MU-14 — Panzerfaust (AP+EXP)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, porta il Panzerfaust)*
- **Con:** Panzerfaust, munizione **AP+EXP**
- **Bersaglio:** (a) **Fusilier** (ARM 1, BTS 0, PH 10), copertura no; (b) **Orc** (ARM 4, BTS 3, PH 14), copertura no
- **ARO:** nessuno
- **Atteso:** vs Fusilier **ARM VS 7 ×3**; vs Orc **ARM VS 8 ×3**. Da controllare oltre al numero: Disposable (2), l'uso va scalato.

**MU-15 — Copertura sulla salvezza**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** **Fusilier** (ARM 1, BTS 0, PH 10), **in copertura**
- **ARO:** nessuno
- **Atteso:** **ARM VS 11 ×1**.

**MU-16 — Guidato e Speculativo ignorano la copertura**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · dichiara **Fuoco Speculativo**
- **Con:** Combi Rifle, munizione **N**
- **Bersaglio:** **Fusilier** (ARM 1, BTS 0, PH 10), **in copertura**
- **ARO:** nessuno
- **Atteso:** **ARM VS 8 ×1** — il +3 della copertura non entra nella salvezza.

**MU-17 — Munizioni N3**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*
- **Con:** Combi Rifle, forzando a mano ciascuna delle nove munizioni N3: **VIRAL, BREAKER, K1, PLASMA, NANOTECH, ADHESIVE, FLASH, MONOFILAMENT, BIOWEAPON**
- **Bersaglio:** **Fusilier (Combi Rifle)** *(PanOceania #1)* @ banda 1, copertura no
- **ARO:** nessuno
- **Atteso:** per **tutte e nove** l'avviso **A50** — *«Munizione "X" non esiste in N5 (era N3)»* — e **il calcolo non si ferma**: il tiro si risolve comunque. La **BREAKER** ne porta **due**, A50 più **A53** (*«"AP" dimezza ARM o BTS a seconda dell'arma: assunto ARM»*): è l'unica delle nove che richiede un'assunzione.

**MU-18 — Munizione sconosciuta**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*
- **Con:** Combi Rifle, munizione forzata a un nome che non esiste (per esempio **FUFFA**)
- **Bersaglio:** **Fusilier (Combi Rifle)** *(PanOceania #1)* @ banda 1, copertura no
- **ARO:** nessuno
- **Atteso:** **due** avvisi, **A51** (*«Componente "FUFFA" di "FUFFA" non presente nel catalogo munizioni»*) e **A52** (*«Munizione "FUFFA" sconosciuta»*), e **nessun numero inventato**. Con un nome composto (**AP+FUFFA**) escono A51 e **A53**, non A52: il pezzo noto si usa, l'ignoto si dichiara.

**MU-19 — Tiro Salvezza Combinato**
- **Attivo:** Dr. Harper FTO *(PanOceania #14, porta il Plasma Carbine)*
- **Con:** **Plasma Carbine (Blast Mode)** — va scelta la modalità, il Plasma Carbine da solo non si tira (vedi MU-20)
- **Bersaglio:** **Fusilier (Combi Rifle)** *(PanOceania #1,* ARM 1, BTS 0), copertura no
- **ARO:** nessuno
- **Atteso:** **due** salvezze con attributi **diversi**: **ARM VS 8** e **BTS VS 7**, descritte come Tiro Salvezza Combinato. In **Hit Mode** sono **ARM VS 7** e **BTS VS 6**. Un Critico aggiunge una salvezza ARM.

**MU-20 — Contenitore di modalità**
- **Attivo:** Orc (Hacker, Hacking Device) *(PanOceania #4, porta il MULTI Rifle)*
- **Con:** **MULTI Rifle** senza scegliere la modalità *(ripeti con il Missile Launcher di Alguacil #3)*
- **Bersaglio:** **Fusilier (Combi Rifle)** *(PanOceania #1)* @ banda 1, copertura no
- **ARO:** nessuno
- **Atteso:** avviso **A51b** — *«"MULTI Rifle" richiede la scelta di una modalità»* — con l'elenco delle modalità disponibili (AP Mode, Shock Mode, Anti-Materiel Mode), e **nessun calcolo a caso**: Burst e munizione restano vuoti finché non scegli.

**MU-21 — Kobra Pistol**
- **Attivo:** Morlock (Kobra Pistol, DA CC) *(Nomadi #36, aggiunto il 10 ottobre: si schiera **accanto** al Morlock #13, non al suo posto)* · **ATTACCO CC** per la CC Mode; per la BS Mode vedi sotto
- **Con:** **Kobra Pistol (BS Mode)**, poi **Kobra Pistol (CC Mode)**
- **Bersaglio:** **Fusilier (Combi Rifle)** *(PanOceania #1)* @ banda 0, copertura no
- **ARO:** nessuno
- **Atteso:** in **BS Mode** munizione **SHOCK**, Burst 2, **una** salvezza; in **CC Mode** munizione **DA**, Burst 1, **due** salvezze, e il Tratto **Anti-materiel**. È la stessa arma con due profili: se leggi la stessa munizione in entrambe le modalità, la scelta non si applica.
- 🔴 **Misurato dalla pagina il 10 ottobre: la BS Mode oggi non si può dichiarare nel Turno Attivo.** Nell'ATTACCO BS il Morlock #36 si vede offrire **Chain Rifle** e **Smoke Grenades**, non la Kobra Pistol: il modulo legge solo il campo `weapon` e la Kobra Pistol sta in `equip`. In **ARO** invece compare (`M.armiARO` → Chain Rifle, Smoke Grenades, **Kobra Pistol (BS Mode)**), e in **ATTACCO CC** compare la **CC Mode**. Quindi oggi: la CC Mode si prova da attivo, la BS Mode **solo reagendo** a un Ordine avversario. È il difetto delle armi in `equip` (629 profili su 765), segnalato a MOTORE: il giorno che è corretto, la BS Mode si prova anche da attivo e questa nota va tolta.

**MU-22 — BioWeapon condizionale** *(nuovo)*
- **Attivo:** Chimera *(Nomadi #14, porta la Viral CC Weapon(PS=6))*
- **Con:** **Viral CC Weapon(PS=6)** *(una delle sette armi BioWeapon: Rifle, Combi, Marksman, Sniper, Pistol, CC Weapon, Mine — questa è quella che il roster porta davvero)*
- **Bersaglio:** (a) **Fusilier (Combi Rifle)** *(PanOceania #1,* **con VITA**, ARM 1, BTS 0); (b) **Tikbalang** *(PanOceania #8,* **STR 3**, senza VITA)
- **ARO:** nessuno
- **Atteso:** contro il Fusilier **BTS VS 6**, con la nota *«Bersaglio con VITA: si applica la combinazione DA+Shock»* e l'effetto Shock; contro il Tikbalang **BTS VS 12**, con la nota *«Bersaglio senza VITA: il BioWeapon non lo potenzia»*. **Se passa un solo caso dei due, la condizione non è implementata.**

**MU-23 — ARM = 0** *(chiarito)*
- **Attivo:** Hawkwood (K1 Sniper Rifle) *(Nomadi #37, aggiunto il 10 ottobre)*
- **Con:** **K1 Sniper Rifle**; poi un **Combi Rifle** normale *(Alguacil #1)* sullo stesso bersaglio
- **Bersaglio:** **Nisse (Heavy Machine Gun)** *(PanOceania #5,* **ARM 3**, BTS 0), copertura no
- **ARO:** nessuno
- **Atteso:** l'arma K1 → **ARM VS 7**; il Combi normale sullo stesso bersaglio → **ARM VS 10**. **ARM=0 non vuol dire «nessun Tiro Salvezza»**: il tiro c'è, e vale solo il PS dell'arma. Vive in `salvAttr`, non fra i Tratti condizionali: cinque armi lo portano — K1 Combi, K1 Marksman, K1 Sniper, Monofilament CC Weapon, Monofilament Mine. **Target (Attribute)** esiste solo nelle Pheroware Tohaa e **BTS = 0** su nessuna arma delle due fazioni: non sono lacune, sono fuori dalle nostre liste.

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
- **Attivo:** `Morlock (Assault Pistol)` · ATTACCO BS
- **Con:** **Chain Rifle** (Direct Template, Large Teardrop)
- **Bersaglio:** `Fusilier (Combi Rifle)` (PH 10) sotto la Sagoma, **senza LoF** verso il Morlock
- **ARO:** `Fusilier (Combi Rifle)` → SCHIVATA senza LoF
- **Atteso:** *(corretto il 9 ottobre: la riga di prima era sbagliata.)* la Schivata **è sempre concessa** contro una Sagoma, anche senza LoF — questa è la nota, e il motore la dà: *«Chi e` colpito da una Sagoma puo` sempre dichiarare Schivata, anche senza LoF verso chi attacca.»* Ma il **−3 si applica**: PH 10 → **7**. Il catalogo è esplicito (`DIFESA.SCHIVATA.noteMalus`): *«-3 se non si ha LoF verso l'attaccante. **Stesso -3 schivando un'arma a Sagoma senza LoF**, o un'arma Deployable (mina).»* Il piano diceva "nessun −3": era mio, ed era una confusione fra *concessa* e *senza malus*. Due cause insieme (nessuna LoF **e** Sagoma senza LoF) non si sommano: il malus resta −3, e il motore lo dice con una nota.
- **Controprova nella stessa prova:** lo stesso Fusilier **con** LoF verso il Morlock → PH **10**, nessun malus, e la nota sulla Schivata sempre concessa resta. Il −3 compare e scompare col solo cambio della LoF.

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
- **Attivo:** `Morlock (Assault Pistol)` · ATTACCO BS · una Sagoma con **un alleato nell'area**
- **Con:** **Chain Rifle** (la Sagoma più larga che il roster offre: Large Teardrop)
- **Bersaglio:** `Fusilier (Combi Rifle)` come Principale, con un secondo **Nomade** (`Alguacil (Combi Rifle)`) sotto la stessa Sagoma
- **ARO:** nessuno
- **Atteso:** `regoleTemplate(Chain Rifle)` dichiara `colpoAnnullatoSeAlleatiInArea: true` e `puoCoinvolgereAlleati: false`, e `M.esitoSagomaAlleati` con `alleatoNellaSagoma: true` torna **`annullato: true`** con la frase intera — *«UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA: il colpo è ANNULLATO (righe 3584-3594...), per tutti i bersagli di quella Sagoma. Gli ARO restano; un uso Disposable dichiarato si consuma lo stesso.»* La regola c'è e risponde. **Quello che va verificato a mano è se la DOMANDA compare**: la risposta `alleatoNellaSagoma` deve arrivare da qualcuno, e nessun banco può vedere se la schermata la chiede. Al 9 ottobre: no.
- **Controprova:** con **Smoke Grenades** (Sagoma innocua) la domanda **non va fatta** e il colpo **non** si annulla — `M.sagomaInnocua` è la riga che li separa. Se la domanda comparisse anche per il fumo, sarebbe la stessa regola applicata a chi non la riguarda.

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
- **Bersaglio:** per l'Alguacil **nessuno** — l'ordine è rifiutato prima di arrivare alla scelta del bersaglio; per Mary Problems **un punto del tavolo**, perché il Pitcher è Targetless
- **Atteso:** Alguacil (Missile Launcher) **non** ottiene l'ordine: `M.armiSpeculative` torna **0 armi** e tre esclusioni col motivo scritto — *«Missile Launcher (Blast Mode): non ha il Tratto Speculative Attack»*, idem per la Hit Mode e per la Pistol. Mary Problems col **Pitcher** sì: **1 arma**, con le altre cinque escluse e nominate. Non è un conteggio: sono i due elenchi, e un'arma che cambia lato si vede.

**SPEC-05 — Tratti dedotti** **[NON RIPRODUCIBILE: il caso non esiste più, ed è una buona notizia]**
- **Attivo:** nessuno, e non per un buco del roster. Misurato il 9 ottobre: **0 delle 188 armi** di `RULES_WEAPONS` è senza il campo `traits` (è la condizione di **A49**), e la spazzata di `M.armiSpeculative` su tutti i **765** profili emette **0 avvisi**, né A80 né A49. Lo stesso vale per `armiIntuitive`, `armiSoppressione`, `armiCC` e `armiARO`: zero codici. L'unico codice che esce da un filtro d'armi è **A95** da `armiGuidate`, e vuol dire un'altra cosa (manca la Skill).
- **Atteso:** **che resti zero.** Da prova a mano diventa una **guardia**: `test_coerenza_dati.js` sezione 8 pretende «nessun altro codice di avviso sui profili delle armi» oltre ad A51b e A47, e la sezione 11 che ogni notazione meccanica porti un valore numerico. Il giorno che un'arma entra senza `traits`, A49 torna e la guardia lo dice — senza che nessuno debba ricordarsi di incollare niente.

---

# 9. Blocco G — Attacco Guidato *(ora eseguibile)*

**GUI-01 — L'ordine si raggiunge** *(eseguibile dal 9 ottobre sera)*
- **Attivo:** **Vertigo Zond (Missile Launcher)**, voce **28** del roster *(aggiunta per questa prova)* — **non** l'Alguacil che il piano nominava
- **Con:** **Missile Launcher (Blast Mode)**
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania, messo **Bersagliato** dall'editor degli stati
- **Atteso:** ATTACCO GUIDATO **nella lista**, e `M.armiGuidate` risponde con **`Missile Launcher (Blast Mode)`** e **zero avvisi**. L'altra modalità è esclusa col motivo: `Missile Launcher (Hit Mode)` non è una Blast Mode né ha il Tratto Impact Template. BS del Vertigo: **12**.
- 🔴 **Perché la premessa era sbagliata.** L'Attacco Guidato richiede la Skill **`BS Attack (Guided)`**. L'**Alguacil (Missile Launcher)** non la ha: `M.haGuidato` risponde `false` e `M.armiGuidate` restituisce l'avviso **A95** — *"Alguacil non ha \"BS Attack (Guided)\" nel profilo. L'Attacco Guidato richiede quella Skill."*, gravità `azione`. Stesso errore di BS-08/09 con l'X Visor: avevo nominato una truppa che non porta il requisito.
- 🔴 **E i numeri erano sbagliati.** Il piano dichiarava *"40 profili Nomadi e 68 PanOceania"*. Misurati, sono **tre numeri diversi** e il piano ne confondeva due:
  - profili con un'**arma** adatta (Blast Mode o Impact Template): **107** Nomadi e **87** PanOceania;
  - profili con la **Skill** `BS Attack (Guided)`: **1 e 1** — `Vertigo Zond (Missile Launcher)` e `Clipper Dronbot (BS Attack [Guided])`, su 765;
  - 40 e 68 non corrispondono a nessuno dei due: vengono da un commento di `app.html` che è vecchio, **da aggiornare** (segnalato a INTERFACCIA).
- **Controprova, con l'Alguacil (Missile Launcher) voce 3 come attivo:** **ATTACCO GUIDATO non compare nel menu.** L'Alguacil ha l'arma giusta (Missile Launcher, Blast Mode) ma non la Skill, e dal motore 2026-10-09.6 `M.armiGuidate` senza Skill restituisce **zero armi**: la Blast Mode finisce fra le escluse col motivo *«manca la Skill "BS Attack (Guided)"»*, accanto all'avviso **A95**. Il menu legge quella lista, quindi la voce non si offre. Fino alla revisione 24 qui c'era scritto il contrario — *"l'ordine compare comunque, è il criterio avvisa-non-bloccare"* — ed era vero per l'app di allora: il modulo scriveva l'avviso e disegnava lo stesso il bottone dell'arma, e chi non aveva la Skill poteva dichiarare. Misurato in `test_modulo_guidato.js` sezioni 12 e 13 (senza Skill: avviso e **0** bottoni; con la Skill: **1** bottone, nessun avviso).
**GUI-02 — Guidato su bersaglio Bersagliato** *(rifatta il 10 ottobre sul Vertigo Zond)*
- **Attivo:** **Vertigo Zond (Missile Launcher)**, voce **28** del roster *(BS 12)* · dichiara **Attacco Guidato**
- **Con:** **Missile Launcher (Blast Mode)**
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania (**Bersagliato**) @ banda **3** (24-32"), copertura sì
- **ARO:** nessuno
- **Atteso:** 12 +3 di gittata +3 di Bersagliato = **18**, con le due voci *«Gittata: +3»* e *«Bersaglio Bersagliato: +3 BS»* e la nota *«Attacco Guidato: ignora Copertura e Mimetismo»* — la copertura dichiarata **non** toglie niente. Salvezza **ARM VS 7 ×3** (ARM 1 + PS 6, munizione EXP).
- **Perché non più l'Alguacil:** fino alla revisione 24 la prova diceva *11 +3 +3 = 17* con l'Alguacil (Missile Launcher), BS 11. L'Alguacil non ha la Skill e oggi non può dichiarare (vedi GUI-01): il numero era giusto per una truppa che non può tirarlo.

**GUI-03 — Senza Stato Bersagliato** *(eseguibile dal 9 ottobre sera)*
- **Attivo:** **Vertigo Zond (Missile Launcher)**, voce **28** del roster · dichiara **Attacco Guidato**
- **Con:** **Missile Launcher (Blast Mode)**
- **Bersaglio:** nell'elenco ci sono **Fusilier (Combi Rifle)** voce 1 **Bersagliato**, **Fusilier (Missile Launcher)** voce 2 **senza** lo stato, e **Croc Man (MULTI Sniper Rifle)** voce 6 in **CAMO**
- **ARO:** nessuno
- **Atteso:** il piano diceva una cosa sola dove ce ne sono due — il filtro cambia col **ruolo**:
  - **primario** — ammesso **solo** il Fusilier Bersagliato. Il Fusilier senza lo stato è rifiutato: *"Non è in Stato Bersagliato: il primario dell'Attacco Guidato deve esserlo"*. Il Croc Man in CAMO: *"In forma di Marker: non può essere in Stato Bersagliato"* — un Marker **non può** essere Bersagliato, ed è un motivo diverso dal primo.
  - **secondario** — ammessi **tutti e due** i Fusilier, anche quello senza lo stato: la Sagoma prende chi le sta sotto, e lo Stato Bersagliato è requisito del **solo** Primario. Il Croc Man resta fuori con lo stesso motivo di prima.
- **Controprova:** i due motivi vanno letti **distinti**. Se fossero la stessa frase, non si saprebbe se al bersaglio manca lo stato o se è un Marker — e si correggono in modi diversi (uno con un Forward Observer, l'altro Scoprendolo).
**GUI-04 — ECM (Guided −6)** *(rifatta il 10 ottobre sul Vertigo Zond)*
- **Attivo:** **Vertigo Zond (Missile Launcher)**, voce **28** del roster *(BS 12)* · dichiara **Attacco Guidato**
- **Con:** **Missile Launcher (Blast Mode)**
- **Bersaglio:** **Tikbalang**, voce **8** di PanOceania (**Bersagliato**) @ banda **3** (24-32")
- **ARO:** nessuno
- **Atteso:** 12 +3 +3 **−6** = **12**, con la terza voce *«ECM (Guided -6) del bersaglio: -6 BS»*. Salvezza **ARM VS 12 ×3** (ARM 6 + PS 6). Da leggere insieme a GUI-02: stesso attaccante, stessa banda, e la sola differenza è l'ECM — **6 punti**.
- **L'ECM qui è del BERSAGLIO.** È lo stesso equipaggiamento che fino al motore 2026-10-09.4 veniva letto al contrario, come capacità di fare Attacchi Guidati: il Tikbalang risultava "capace" di un Guidato. Oggi `M.haGuidato` sul Tikbalang risponde `false`.

**GUI-05 — La difesa contro un Guidato** 🔴 **atteso corretto il 9 ottobre, ed eseguibile**
- **Attivo:** **Vertigo Zond (Missile Launcher)**, voce **28** del roster · dichiara **Attacco Guidato**
- **Con:** **Missile Launcher (Blast Mode)**
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania, **Bersagliato**
- **ARO:** il Fusilier apre il menu ARO
- **Atteso:** il menu offre **tutte e due** le difese — **SCHIVATA** e **RESET** — più Attacco BS e Attacco CC. Sul RESET c'è la nota `Stato Bersagliato: -3 WIP`. L'Hacking è rifiutato col motivo *"Non è un Hacker."*
- 🔴 **Il piano dichiarava "offre RESET, non Schivata": era sbagliato, e l'app ha ragione.** Il regolamento ne ammette due, e il motore lo scrive nel risultato dell'ordine: `reazioneBersaglio` = *"Schivata a PH-3 … **oppure** Reset a WIP-3"*. Sono due difese con due attributi e due malus: toglierne una avrebbe levato al giocatore una difesa che gli spetta.
- **Da provare che i due malus ci siano:** la Schivata a **PH−3** (per la Sagoma senza LoF) e il Reset a **WIP−3** (per lo Stato Bersagliato). Il menu li offre; i valori si leggono sulla schermata dei modificatori dell'ARO, non nel menu.
- **I MOD dell'attacco, misurati** sul `Missile Launcher (Blast Mode)` (bande −3 / 0 / 0 / +3 …): a 0-8" il totale è **0** (−3 di gittata +3 di Bersagliato), a 8-24" è **+3**, a 24-32" è **+6**. Burst **1**. E la gittata si misura **in linea retta**, non lungo la traiettoria: lo dice la voce `Gittata 0-8" (misurata in linea retta)`.

---

# 10. Blocco H — Corpo a corpo

**CC-01 — Martial Arts sui due lati**
- **Attivo:** Morlock (Assault Pistol), voce **13** del roster · ATTACCO CC
- **Con:** **AP CC Weapon(PS=6)** — è l'unica arma CC che il profilo gli dà
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania
- **ARO:** Fusilier → ATTACCO CC con **CC Weapon** (l'unica del suo profilo), contro il Morlock
- **Atteso:** F2F. Attivo CC 23 **+3** = **26**, una voce sola, `Martial Arts L2: +3 CC`. Reattivo 13 **−3** = **10**, una voce sola, `Martial Arts L2 del nemico: -3 al tuo CC`. Salvezza Fusilier **ARM VS 7** — il PS=6 del profilo, non il PS 8 del database armi. **Controprova:** la stessa arma scritta senza la notazione dà **ARM VS 9**; se leggi 9 qui, il PS del profilo si è perso. Salvezza del Morlock contro il CC Weapon del Fusilier: **ARM VS 9**.
**CC-02 — NBW e CC Attack (−3)**
- **Attivo:** Chimera, voce **14** del roster · ATTACCO CC
- **Con:** **Viral CC Weapon(PS=6)** — l'unica arma CC del suo profilo
- **Bersaglio:** Teutonic Knight (TinBot: Firewall), voce **7** di PanOceania (Martial Arts L2)
- **ARO:** Teutonic Knight → ATTACCO CC con **DA CC Weapon(PS=5)**, contro la Chimera
- **Atteso:** attivo CC **24 pieno**, **nessuna voce di MOD**, e la nota `Natural Born Warrior annulla il -3 delle Martial Arts L2 nemiche`. Reattivo 22 **+3 −3** = **22**, due voci: `Martial Arts L2: +3 CC` e `Il nemico ha CC Attack (-3): si applica a te nel Faccia a Faccia`. Salvezza Teutonic **BTS VS 9 ×2** (il Viral CC Weapon tira su BTS, non su ARM, e la munizione dà due tiri); salvezza Chimera **ARM VS 6 ×2**.
- 🔴 **Valori corretti alla revisione 21.** Il piano dichiarava BTS VS 11 e ARM VS 9: sono i valori che si ottengono col **PS 8 del CC Weapon generico**, ignorando le notazioni (PS=6) e (PS=5) dei due profili. Cioè il piano aveva calcolato questa prova **col difetto che CC-01 esiste per scoprire**. Misurati col motore 2026-10-09.4: 9 e 6.
**CC-03 — Colpo di Grazia**
- **Attivo:** Morlock (Assault Pistol), voce **13** del roster · ATTACCO CC contro un Incosciente
- **Con:** **AP CC Weapon(PS=6)**
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania, messo **Incosciente** dall'editor degli stati
- **ARO:** nessuno
- **Atteso:** la schermata mostra il riquadro rosso **☠️ COLPO DI GRAZIA** con `senzaTiro` e `senzaSalvezza`: **nessun tiro d'attacco e nessun Tiro Salvezza**, passaggio automatico a Morto. Il motivo a schermo è quello del catalogo: *"Senza alcun tiro, il bersaglio passa automaticamente da Incosciente a Morto, senza possibilità di Tiro Salvezza."*
- **Controprova:** sullo stesso Fusilier **non** Incosciente il riquadro non compare, e il motivo è `Il bersaglio non è Incosciente.` — così un riquadro che comparisse sempre si distingue da uno che guarda lo stato.
- **Da provare anche:** su un bersaglio con **Dogged** o **No Wound Incapacitation** il Colpo di Grazia è **bloccato** e compare il riquadro giallo `⚠️ COLPO DI GRAZIA NON APPLICABILE`. Fra le 40 schierate nessuna porta quelle due skill: serve una sostituzione nel roster.
**CC-04 — PARA CC Weapon**
- **Attivo:** Zondmate
- **Con:** PARA CC Weapon
- **Bersaglio:** Fusilier
- **ARO:** nessuno
- **Atteso:** CC **13** (il −3 è per il nemico), salvezza **PH VS 4**, Non-Lethal, IMM-A.

**CC-05 — Berserk** *(eseguibile dal 9 ottobre sera)*
- **Attivo:** **Wolfgang Amadeus**, voce **26** del roster *(aggiunta per questa prova)* · BERSERK
- **Con:** **PARA CC Weapon(-6)**, poi **DA CC Weapon(PS=4)** — le due armi CC del suo profilo, e danno due salvezze molto diverse
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania
- **ARO:** Fusilier → ATTACCO CC con **CC Weapon**
- **Atteso:** **F2F** — in N5 il Berserk non evita il Faccia a Faccia. Attivo CC **22 +3 = 25**, una voce sola, `Martial Arts L3: +3 CC` (il Berserk (+3) del profilo è un MOD al CC Attack, non al Berserk: non si somma qui). Reattivo Fusilier **13 −3 −6 = 4**, due voci — `Martial Arts L3 del nemico: -3 al tuo CC` e `PARA CC Weapon (-6) dell'avversario: -6 nel Faccia a Faccia`.
- **Le due salvezze, che è il motivo per provare entrambe le armi:**
  - con la **PARA CC Weapon(-6)** il Fusilier tira **PH VS 4**, **una** salvezza — è un tiro di PH, non di ARM, perché la PARA non fa Ferite ma Immobilizza;
  - con la **DA CC Weapon(PS=4)** tira **ARM VS 5**, **due** salvezze.
  Letto un attributo per l'altro, il numero sarebbe comunque plausibile: la coppia serve a distinguerli.
- **Salvezza di Wolfgang** contro il CC Weapon del Fusilier: **ARM VS 11**.
- **E in stato Ingaggiato:** `M.azionePermessaDaStati(Wolfgang, 'BERSERK')` risponde `permessa: true` — il Berserk è una delle cinque azioni che l'Ingaggiato ammette (vedi CC-06).
**CC-06 — Ingaggiato**
- **Attivo:** Alguacil (Combi Rifle), voce **1** del roster, messo **Ingaggiato** dall'editor degli stati · apri il menu degli Ordini
- **Atteso:** compaiono **solo** ATTACCO CC, BERSERK, SCHIVATA, RESET, IDLE. Misurato con `M.azionePermessaDaStati`: queste cinque rispondono `permessa: true`; ATTACCO BS, MOVIMENTO, HACKING, SCOPRIRE, CAUTO e SALTO rispondono `false` col motivo *"Stato Ingaggiato: permette solo ATTACCO CC, BERSERK, SCHIVATA, RESET, IDLE"*.
- **Controprova:** la stessa unità senza lo stato ha il menu intero — così un menu vuoto per altri motivi si distingue dal filtro dello stato.
**CC-07 — Gang-Up (Close Combat with Multiple Troopers)**
- **Attivo:** Morlock (Assault Pistol), voce **13** del roster · ATTACCO CC
- **Con:** **AP CC Weapon(PS=6)** (Burst 1 di base)
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania
- **ARO:** nessuno
- **Atteso:** il selettore *"Quanti TUOI alleati sono ingaggiati in questa mischia?"* porta il Burst a **1 / 2 / 3 / 4** per **0 / 1 / 2 / 3** alleati — **+1 per ognuno**, e la voce lo dice: `Close Combat with Multiple Troopers: +1B (1 alleato/i nella mischia)`. Il selettore parte da 0 e arriva a 5.
- **Nota di regola, non calcolata dall'app:** vanno **esclusi** dal conteggio gli alleati in Stato Nullo o Immobilizzato e, in ARO, chi ha dichiarato Schivata, Idle o Reset. L'app non ha la mappa e non sa chi ha dichiarato cosa: **il numero lo dichiara il giocatore**, come il Movimento Cauto. È una domanda, non un calcolo.

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
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* per CARBONITE / OBLIVION / TOTAL CONTROL / SPOTLIGHT; per **TRINITY** serve un Killer Hacking Device: usa **Zero (Hacker, Killer Hacking Device)** *(Nomadi #9)* · HACKING
- **Con:** CARBONITE, OBLIVION, TOTAL CONTROL, TRINITY, SPOTLIGHT, uno per uno
- **Bersaglio:** Tikbalang *(#8)*, Orc (Hacker, Hacking Device) *(#4)*, Fusilier (Combi Rifle) *(#1)*, Croc Man (MULTI Sniper Rifle) *(#6, **Camuffato**)* · tutti nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** con **CARBONITE** e con **OBLIVION**: Tikbalang e Orc ammessi; Fusilier **no** (*«non hackerabile»*); Croc Man in Camo **no** (*«va Scoperto prima»*). Con **TOTAL CONTROL**: **solo Tikbalang**. Con **TRINITY**: **solo Orc**. Con **SPOTLIGHT**: anche il Fusilier. I programmi che l'Interventor ha davvero sono sei — CARBONITE, CYBERMASK, OBLIVION, SPOTLIGHT, TOTAL CONTROL, WHITE NOISE: TRINITY **non è fra i suoi**, ed è per questo che serve Zero.

**HK-06 — Firewall**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8, WIP 15)* · HACKING
- **Con:** **CARBONITE**
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, BTS 3)* · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** tiro attivo **15 −3 = 12**, con la voce *«Firewall del bersaglio: −3 WIP»*; e salvezza del Teutonic **BTS VS 13** — BTS 3 **+3 del Firewall** + PS 7 — con la voce *«Firewall del bersaglio: +3 BTS (equivalente Copertura)»*. Il Firewall fa **due** cose: se ne vedi una sola, metà della regola non si applica.

**HK-07 — Firewall doppio**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* con **in più** lo stato che gli dà un secondo Firewall — ⚠️ **non eseguibile con questo schieramento**: nessuna delle 52 voci del roster può portare **due** Firewall insieme (il TinBot è uno solo e nessun programma del roster ne aggiunge un secondo). Serve una truppa con TinBot **e** un alleato che le dia un Firewall via programma
- **ARO:** nessuno
- **Atteso:** dei due Firewall se ne usa **uno solo**, a scelta: il −3 al tiro e il +3 al BTS **non si sommano**. Il motore ha la funzione (`firewallMultipli`): è il tavolo che non sa produrre il caso.

**HK-08 — Firewall disabilitato**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8, WIP 15)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* in stato **Isolato** · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** Firewall **0**: tiro attivo **15** (il −3 **non** c'è) e salvezza del Teutonic **BTS VS 10** (il +3 **non** c'è). È la controprova esatta di HK-06: gli stessi due numeri, 12/13 contro 15/10.

**HK-09 — ECM (Hacker −3)** *(risolto, da confermare)*
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8, WIP 15)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** **Aquila** *(PanOceania #11, porta ECM (Hacking −3))* · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** tiro **12** = 15 **−3**, con la voce *«ECM (Hacking −3) del bersaglio: −3 WIP»*. L'ECM **non** dà il +3 alla salvezza: quello è del Firewall. La salvezza dell'Aquila è **BTS VS 13** perché il suo BTS è 6, non per l'ECM. *(Il piano diceva «Meteor Zond», che non è schierato: l'Aquila porta lo stesso ECM ed è in lista.)*

**HK-10 — Dati non verificati**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* per TOTAL CONTROL; per TRINITY **Zero (Hacker, Killer Hacking Device)** *(Nomadi #9)* · HACKING
- **Con:** TOTAL CONTROL, poi TRINITY
- **Bersaglio:** Tikbalang *(PanOceania #8)* per TOTAL CONTROL, Orc (Hacker) *(#4)* per TRINITY · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** compare l'avviso **A91** — *«Dati di "<programma>" non verificati sulla scheda ufficiale»*. L'avviso scatta sui programmi che il catalogo marca `fonte: 'DA VERIFICARE'`: se **non** compare, o quei due programmi sono stati verificati (e allora l'avviso va togliuto dal piano), oppure il marcatore non viene letto. **Da chiarire con DATABASE prima di dare la prova per rossa.**

**HK-11 — Upgrade dai profili**
- **Attivo:** **Mary Problems (Hacker)** *(Nomadi #21, UPGRADE: Oblivion +1B)*, poi **Kulak (Hacker, Killer Hacking Device)** *(Nomadi #23, UPGRADE: Carbonite)*. Jazz (Hacker) porta *UPGRADE: Trinity SR-1* ma — ⚠️ **non è fra le 40 truppe schierate**
- **Con:** per Mary Problems **OBLIVION**; per il Kulak **CARBONITE**
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)* · nell'Area di Hacking, nessuna gittata, nessuna copertura
- **ARO:** nessuno
- **Atteso:** l'upgrade **compare nel calcolo** — l'Oblivion di Mary Problems a **+1 Burst**, il Carbonite del Kulak col suo effetto — **oppure** compare l'avviso **A94**. **Mai ignorato in silenzio:** il profilo dichiara l'upgrade fra parentesi nell'equip, e se il calcolo non lo usa e non lo dice, il giocatore tira col programma base credendo di avere quello potenziato.

**HK-12 — Reset, non Schivata**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING; poi Alguacil (Combi Rifle) *(Nomadi #1)* · **ATTACCO BS**
- **Con:** per l'HACKING **CARBONITE**; per l'ATTACCO BS il **Combi Rifle**
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)* · per l'HACKING nell'Area di Hacking, nessuna gittata, nessuna copertura; per l'ATTACCO BS @ banda 1, copertura **no**
- **ARO:** Orc (Hacker) → si apre il suo menu degli ARO contro l'unità attiva
- **Atteso:** contro **HACKING**: **Schivata assente**, **Reset presente**. Contro **ATTACCO BS**: il contrario — **Schivata presente**, **Reset assente**. Le due metà vanno fatte una dopo l'altra sullo stesso Orc: è il confronto che prova la regola, non i due menu presi da soli.

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
- **Attivo:** `Zulu-Cobra (Triangulated Fire, Sensor)` (BS **13**) · TRIANGULATED FIRE · Ordine **Intero**
- **Con:** **Combi Rifle** — le sue armi sono Combi Rifle, Jammer e Assault Pistol; il Combi è quello con le bande normali, così i MOD ignorati si vedono tutti
- **Bersaglio:** Croc Man @ media distanza (banda 3, MOD -3), copertura sì (-3), Mimetism (-3)
- **ARO:** nessuno
- **Atteso:** il tiro è su **BS 13 pieno**, `mod: 0`, **senza alcun MOD**. I tre MOD ignorati vanno mostrati **barrati** e sono nominati dal motore in `modIgnorati`: gittata −3, Copertura Parziale −3, Mimetismo −6. Il motore porta anche `valoreConMod: 1`, cioè quanto sarebbe stato il tiro senza l'Abilità: **13 contro 1**, dodici punti — nasconderli farebbe sembrare che il calcolatore se li sia dimenticati. Salvezza del Croc Man in copertura: **ARM VS 11** (ARM 1 + PS 7 + 3 di Copertura).
- **Requisito:** `Alguacil (Combi Rifle)` → rifiutato con *«Serve l'Abilità Triangulated Fire.»*
- **E il limite che resta:** oltre la Gittata Massima del Combi il tiro **non** diventa impossibile — resta 13 — ma arriva l'avviso **A74** con `oltreGittata: true`. Ignorare i MOD non è ignorare la gittata massima, e sono due cose che si confondono facilmente.
- **Attenzione alla porta d'ingresso** *(costata una falsa segnalazione il 9 ottobre)*: la regola sta in **`M.regoleTriangulated`**. Chiedere il numero a `M.modAttacco` passandogli l'azione `TRIANGULATED FIRE` dà **1**, non 13: `M.SPEC['TRIANGULATED FIRE']` non porta `ignoraTuttiIMod`, e `modAttacco` ci viene chiamato **di proposito** con `BS_ATTACK`, solo per sapere quali MOD mostrare barrati. Il flag `ignoraTuttiIMod: true` sta nel catalogo (`OSSERVAZIONE`, riga 7854) e lo legge `regoleTriangulated`. Inchiodato in `test_modulo_osservazione.js`.

---

# 13. Blocco K — Supporto

**SUP-01 — Dottore**
- **Attivo:** Daktari (Doctor), voce **6** del roster · DOTTORE
- **Con:** abilità Dottore
- **Bersaglio:** Alguacil (Combi Rifle), voce **1** del roster, messo **Incosciente** dall'editor (ha VITA: `w: 1`)
- **ARO:** nessuno
- **Atteso:** tira il **Daktari** (`chiTira: UTENTE`) su **WIP 13**, Tiro Normale, **nessun bonus** — una voce sola, `WIP di Daktari: 13`. Critico con un 13. Fallimento: **MORTO**, e il risultato lo dichiara con `fallimentoLetale: true` più la nota *"⚠️ Il bersaglio entra AUTOMATICAMENTE in Stato Morto e viene rimosso dal tavolo."*
- **Controprova:** lo stesso Daktari con l'**INGEGNERE** dà `fallimentoLetale: false` e la nota diventa *"il bersaglio riceve 1 Ferita invece di rimuoverla"*. È la differenza che conta al tavolo, e due strumenti che dessero la stessa nota non si distinguerebbero.
**SUP-02 — MediKit**
- **Attivo:** Alguacil (Paramedic), voce **5** del roster · MEDIKIT
- **Con:** MediKit
- **Bersaglio:** Alguacil (Combi Rifle), voce **1** del roster, messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** **due tiri in ordine**, e il risultato li tiene separati — prima l'Alguacil colpisce (`tiroPerColpire: BS 11`), poi **tira il bersaglio** (`chiTira: BERSAGLIO`) su **PH 10**. Nessun Tiro Salvezza (`Il bersaglio di un MediKit non esegue Tiro Salvezza`). Fallimento: **MORTO** (N5.2), `fallimentoLetale: true`.
- **Nota:** il PH è quello del **bersaglio**, non dell'utente — tutti e due gli Alguacil hanno PH 10, quindi per distinguere i due casi serve un bersaglio con PH diverso: il **Teutonic Knight** (PH 14) o la **Chimera** (PH 13) se si prova fra fazioni, o il **Morlock** (PH 13) per restare fra nomadi. Con due PH uguali la prova passerebbe anche leggendo il PH sbagliato.
**SUP-03 — Ingegnere**
- **Attivo:** Clockmaker · INGEGNERE
- **Con:** abilità Ingegnere
- **Bersaglio:** Reaktion Zond **Incosciente**
- **ARO:** nessuno
- **Atteso:** **WIP 15**, fallimento **+1 Ferita**, non la morte.

**SUP-04 — GizmoKit(+1B)**
- **Attivo:** Clockmaker (Engineer), voce **7** del roster, **BS 11** · GIZMOKIT
- **Con:** **GizmoKit(+1B)** — la notazione è nel suo equip
- **Bersaglio:** Reaktion Zond (HMG), voce **15** del roster, messo **Incosciente** (ha STR: `str: 1`)
- **ARO:** nessuno
- **Atteso:** **BS 11** per colpire (`tiroPerColpire`), poi il bersaglio su **PH 10**; il **(+1B) porta il Burst a 2**, con le due voci `Burst dell'arma GizmoKit` e `BS Attack (+1B): +1 Burst in Turno Attivo`. Fallimento: **1 Ferita**, non Morto (`fallimentoLetale: false`).
- **Controprova:** il **Machinist (Combi Rifle)**, voce **13** di PanOceania, porta un **GizmoKit senza notazione**: lì il Burst resta **1**, con una voce sola. È la coppia che distingue "legge la notazione" da "dà sempre 2".
- **Dove si legge il Burst:** non in `regoleSupporto`, che non lo restituisce, ma in **`M.burstIniziale`** con azione `SUPPORTO_BS`. Cercato nel posto sbagliato sembra un difetto: non lo è.
**SUP-05 — Filtro bersagli** 🔴 **DIFETTO APERTO, MISURATO IL 9 OTTOBRE**
- **Attivo:** Daktari (Doctor) voce **6** per Dottore e MediKit, Clockmaker (Engineer) voce **7** per Ingegnere e GizmoKit · apri l'elenco dei bersagli
- **Bersaglio:** nell'elenco ci sono **Alguacil (Combi Rifle)** voce 1 Incosciente (VITA: `w: 1`, nessuno `str`), **Reaktion Zond (HMG)** voce 15 Incosciente (STR: `str: 1`, nessun `w`) e **Alguacil (HMG)** voce 2 **sano**
- **Atteso:** la regola dice che Dottore e MediKit accettano **solo alleati con VITA** e Incoscienti — il Reaktion Zond va rifiutato con *"Non ha l'attributo VITA"*. Ingegnere e GizmoKit accettano **solo alleati con STR** — l'Alguacil va rifiutato.
- **Misurato (cosa fa davvero):** il filtro rifiuta correttamente l'Alguacil **sano** (*"il Supporto bersaglia solo gli Incoscienti"*), ma **ammette tutti e due gli Incoscienti con tutti e quattro gli strumenti**. L'opzione `strumento` passata a `M.bersagliValidi` **non cambia niente**: Dottore, MediKit, Ingegnere e GizmoKit danno lo stesso elenco. Lo stesso in `M.regoleSupporto`, che risponde `valido: true` per un Dottore su un REM.
- **Perché conta:** il fallimento del Dottore è **letale**. Offrire un REM a un Dottore offre una mossa che le regole non ammettono e che, se il giocatore la prende, può solo **uccidergli il REM** — e la nota accanto glielo dice, dopo. Al contrario, Ingegnere e GizmoKit vengono offerti su un bersaglio con VITA, dove non hanno effetto.
- **Dove sta il dato, e dove manca:** la regola è scritta nel catalogo (`SUPPORTO.DOTTORE.requisiti`: *"Il bersaglio deve avere l'attributo VITA"*; `SUPPORTO.INGEGNERE.requisiti`: *"l'attributo STR"*). Il dato è nei profili (`w` contro `str`). **Nessun filtro li incrocia**, e nel motore non esiste un `M.haVita` / `M.haStr`. Da segnalare a MOTORE insieme all'eccezione **Technorganic** (con cui vale l'uno o l'altro indifferentemente), che però nei due database **nessun profilo porta**: 0 su 765.
**SUP-06 — Strumento sconosciuto**
- **Attivo:** Daktari (Doctor), voce **6** del roster · si chiama `M.regoleSupporto(utente, bersaglio, 'SCATOLETTA')` con un id che non è fra i quattro strumenti
- **Atteso:** `valido: false` e l'avviso **A58** — `{ codice: 'A58', messaggio: 'Strumento di supporto "SCATOLETTA" sconosciuto.', gravita: 'azione' }`. La gravità `azione` è quella che fa comparire la finestra prima dell'invio (vedi il gancio su `M.creaPayload` in app.html): un `nota` resterebbe invisibile al giocatore.
- 📋 **Nota misurata:** il messaggio **non elenca gli id attesi**, al contrario di `applicaModTerreno`, che per una chiave sconosciuta stampa `attese ["msv1","msv2",...]`. Il piano dichiarava *"con l'elenco degli id attesi"*: non c'è. Non è un difetto di calcolo — l'avviso c'è, è visibile e nomina lo strumento sbagliato — ma un elenco aiuterebbe come aiuta nei terreni. Segnalato a MOTORE.
**SUP-07 — Ri-tiri col Command Token**
- **Attivo:** Daktari (Doctor) voce **6** · DOTTORE, poi Clockmaker (Engineer) voce **7** · INGEGNERE
- **Con:** abilità Dottore, poi abilità Ingegnere
- **Bersaglio:** per l'Ingegnere il **Reaktion Zond (HMG)**, voce **15**, Incosciente — ha davvero `Remote Presence`. Per il Dottore un Incosciente qualunque, per esempio l'**Alguacil (Combi Rifle)** voce 1
- **ARO:** nessuno
- **Atteso:** la nota sui Command Token, **diversa per i due strumenti** e presa dal catalogo parola per parola:
  - DOTTORE → *"Se il bersaglio ha un Cubo, si possono spendere Command Token per ripetere un tiro fallito."*
  - INGEGNERE → *"Se il bersaglio ha Remote Presence, si possono spendere Command Token per ripetere un tiro fallito."*
  Le due note vanno **confrontate fra loro**: se fossero la stessa stringa, il giocatore non saprebbe quale condizione guardare.
- 🔴 **Misurato: la nota del Dottore non è verificabile al tavolo.** La parola `Cube` **non compare in nessuno dei 765 profili** dei due database. La nota è comunque corretta e si mostra sempre (non è condizionata al campo), quindi la prova è eseguibile per come è scritta — ma la **condizione** che enuncia non si può mettere alla prova con questi dati. Quella dell'Ingegnere sì: il Reaktion Zond ha Remote Presence. Da chiarire con DATABASE se il Cubo vada nei profili o sia implicito nel tipo di truppa.

---

# 14. Blocco L — Difese e Soppressione

**DIF-01 — Schivata con LoF**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **ATTACCO BS**
- **Con:** Combi Rifle
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* @ banda 1
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* → **Schivata**, **con LoF** verso l'attaccante
- **Atteso:** PH **10**, e l'elenco dei MOD **vuoto**: nessuna voce.

**DIF-02 — Schivata senza LoF**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **ATTACCO BS**
- **Con:** Combi Rifle
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* @ banda 1
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* → **Schivata**, **senza LoF** verso l'attaccante
- **Atteso:** **7**, con la voce *«Schivata a −3: nessuna LoF verso l'attaccante»* nell'elenco dei MOD. Il numero da solo non basta: la voce deve esserci, altrimenti il giocatore non sa da dove viene il −3.

**DIF-03 — Dodge (+3)**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **ATTACCO BS**
- **Con:** Combi Rifle
- **Bersaglio:** Puppetbot (Red Fury) *(Nomadi #17, PH 10, Dodge (+3))* @ banda 1
- **ARO:** Puppetbot (Red Fury) → **Schivata**, con LoF
- **Atteso:** **13**, con la voce *«Dodge (+3)»*. È PH 10 più il +3 della Skill: se leggi 10, la Skill non si applica.

**DIF-04 — Schivata da IMM-A** *(risolto)*
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **ATTACCO BS**
- **Con:** Combi Rifle
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)*, stato **Immobilizzato-A**
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)*, stato **IMM-A** → **Schivata**, con LoF
- **Atteso:** PH 10 **−6** = **4**, con la voce *«Stato Immobilizzato-A: −6 PH»*.

**DIF-05 — Reset base**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · dichiara un **programma di Hacking**
- **Con:** Carbonite
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** Orc (Hacker, Hacking Device) *(WIP 13)* → **Reset**, senza LoF
- **Atteso:** WIP **13**, nessun MOD, e la **nota** che il −3 per assenza di LoF vale **sulla Schivata e non sul Reset**. È la nota che distingue le due reazioni: senza, i due −3 si confondono.

**DIF-06 — Reset da Bersagliato**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · dichiara un programma di Hacking
- **Con:** Carbonite
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, stato **Bersagliato**
- **ARO:** Orc (Hacker, Hacking Device) *(WIP 13)*, stato **Bersagliato** → **Reset**
- **Atteso:** **10**, con la voce *«Stato Bersagliato: −3 WIP»*.

**DIF-07 — Reset da IMM-B** *(risolto)*
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · dichiara un programma di Hacking
- **Con:** Carbonite
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, stato **Immobilizzato-B**
- **ARO:** Orc (Hacker, Hacking Device) *(WIP 13)*, stato **IMM-B** → **Reset**
- **Atteso:** **10**, con la voce *«Stato Immobilizzato-B: −3 WIP»*.

**DIF-08 — Reset da Isolato** *(risolto)*
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · dichiara un programma di Hacking
- **Con:** Carbonite
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, stato **Isolato**
- **ARO:** Orc (Hacker, Hacking Device) *(WIP 13)*, stato **Isolato** → **Reset**
- **Atteso:** **4**, con la voce *«Stato Isolato: −9 WIP»*. È il MOD più pesante del gioco: se leggi 10 si sta applicando quello dell'IMM-B.

**DIF-09 — Sesto Senso** 🔴 **atteso corretto il 9 ottobre sera, ed eseguibile**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **ATTACCO BS**
- **Con:** Combi Rifle, prima banda (0-8")
- **Bersaglio:** **Warcor (Sixth Sense)**, voce **27** del roster *(aggiunta per questa prova)*, **PH 11**
- **ARO:** il Warcor, **in Soppressione** e **senza LoF** → **SCHIVATA**
- **Atteso:** la Schivata del Warcor è **PH pieno 11**, e l'elenco dei MOD è **vuoto** — nessuna voce. Al posto del −3 della LoF c'è la **nota** *"Sesto Senso: ignorato il -3 (nessuna LoF verso l'attaccante)."*
- **Controprova, indispensabile:** un **Alguacil (Combi Rifle)** voce 1, nelle stesse condizioni, scende a **PH 10 → 7** con la voce `Schivata a -3: nessuna LoF verso l'attaccante`. Senza questa riga, un Sesto Senso che non facesse nulla e una Schivata che non applicasse mai il −3 darebbero lo stesso verde.
- 🔴 **Il piano chiedeva una nota di troppo.** Diceva: *"nell'elenco non deve comparire né il −3 della LoF né quello della Soppressione; al loro posto una nota per ognuno"*. Misurato: la nota c'è **solo** per la LoF, e non è un difetto — **il −3 della Soppressione non è mai stato nella Schivata di chi è soppresso.** Va a **CHI ATTACCA**: il Fusilier passa da **15 a 12**, con la voce `Bersaglio in Fuoco di Soppressione a 8": -3`. Il catalogo lo scrive (`STATI.suppressive.modNemiciEntro24: -3`, *"Nemici entro 0-24" hanno -3 in tutti i F2F"*). Il Sesto Senso non lo tocca, perché non è un MOD del Warcor. **Da provare dal lato dell'attaccante**, dove vive.
- **Le tre eccezioni che restano, e su quale tiro cadono** — il piano le elencava senza dirlo, e cadono su tiri diversi:
  - **IMM-A**: **−6 PH sulla Schivata** (11 → 5);
  - **IMM-B**: **−3 WIP sul Reset** (13 → 10), e la Schivata resta **11**;
  - **Isolato**: **−9 WIP sul Reset** (13 → 4), e la Schivata resta **11**.
  Cercate tutte e tre sulla Schivata, due sembrerebbero non applicate. Riferimento: p.109, e la riga 9941 del regolamento.
**DIF-10 — Dichiarare la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* · dichiara **FUOCO DI SOPPRESSIONE**
- **Con:** Combi Rifle *(ha il Tratto «Suppressive Fire»)*
- **Atteso:** **nessun tiro**: lo stato compare sul tabellone e l'arma passa al profilo **Combi Rifle (SF Mode)**. Se esce un numero da tirare, la Soppressione è trattata come un attacco.

**DIF-11 — Armi ammesse**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)* · dichiara **Soppressione**; poi Morlock (Assault Pistol) *(Nomadi #13)* · dichiara **Soppressione**
- **Con:** Combi Rifle per l'Alguacil; per il Morlock **tutte e tre** le sue armi: **Chain Rifle**, **Smoke Grenades**, **Assault Pistol**
- **Atteso:** l'Alguacil col Combi **sì**; il Morlock **no**, con tutte e tre le armi escluse e il motivo scritto per ognuna — *«non ha il Tratto "Suppressive Fire"»*. Il Morlock non può mai dichiarare Soppressione: non è un caso particolare di una, sono tutte.

**DIF-12 — SF Mode in ARO**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · dichiara **MOVIMENTO**
- **Bersaglio:** —
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)*, **in Soppressione** → ARO con l'arma in SF Mode
- **Atteso:** l'arma diventa **«Combi Rifle (SF Mode)»**, Burst **3**, bande **0 / 0 / −3**, gittata massima **24"**, e l'avviso **A98**. Il profilo SF non è il Combi normale: se vedi Burst 3 con le bande del Combi, la sostituzione non è avvenuta.

**DIF-13 — Attivare cancella la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10, WIP 13)*, **in Soppressione** · spende un Ordine per **qualunque** azione (anche un Movimento, anche un IDLE)
- **Atteso:** la Soppressione viene **cancellata**, anche se l'Ordine viene poi speso in altro. Da controllare sul tabellone e sulla riga dell'unità: lo stato deve sparire nel momento in cui l'Ordine parte, non alla fine del turno.

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
- **Attivo:** `Alguacil (Combi Rifle)` · ATTACCO BS, un colpo che passa
- **Con:** Combi Rifle
- **Bersaglio:** il token `deployable_repeater` (STR 1, ARM 0, BTS 0, Tratti Disposable (3) + Deployable) @ banda 2, senza copertura
- **ARO:** nessuno
- **Atteso:** salvezza **ARM VS 7** (ARM 0 + PS 7), **un dado**, una Ferita. Fallita: STR 1 più il Tratto Deployable = passa **direttamente a Morto** e si rimuove. Niente Incosciente, niente Ingegnere — la frase del motore è *«Un Deployable che entra in Stato Incosciente passa automaticamente a Morto, senza Ferita aggiuntiva, e si rimuove dal tavolo.»*
- **Controprova indipendente, nella stessa prova:** prova TECH RECOVERY su quel token con `Clockmaker (Engineer)`. Deve essere **rifiutata**, con *«È un Deployable: passa direttamente a Morto, non c'è nulla da riparare.»* Due schermate diverse che devono dire la stessa cosa: se una delle due concede, la regola sta in un posto solo.

**DEP-09 — Disco Ball**
- **Attivo:** `Kulak (Hacker, Killer Hacking Device)` · FUOCO SPECULATIVO
- **Con:** Disco Baller — l'unica arma speculativa che il Kulak porta (`M.armiSpeculative` torna lei sola)
- **Bersaglio:** **un punto del tavolo, non una truppa.** Il Disco Baller è Targetless: il Fuoco Speculativo si dichiara sul punto dove si vuole il token
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

**LOG-01 — Trincerarsi** **[NON ESEGUIBILE IN APP: manca il dato]**
- **Attivo:** nessuno. Misurato il 9 ottobre: l'ordine chiede l'Abilità **`Sapper (Foxhole)`** (`M.azioneSenzaTiro('TRINCERARSI')` la nomina), e **`Sapper` non compare in nessuno dei 765 profili** — né `Foxhole`, né `Trincerarsi`. Nessuna voce di roster può sanarlo: il dato non c'è in tutto il database.
- **ARO:** nessuno
- **Atteso:** *(la regola, provata nel banco; in app non c'e` chi la invochi.)* nessun tiro; l'unità entra in Foxhole, con gli effetti di ST-15. `M.foxholeAllaDichiarazione` dà già le due strade con le loro conseguenze: cancellando il Foxhole si muove con MOV e Silhouette veri e perde per tutto l'Ordine Copertura a 360°, Mimetism (-3), Courage e S3 (righe 13871-13876); restandoci non si muove, **nemmeno con una Schivata riuscita** (riga 13867). Misurato in `test_modulo_trincerarsi.js` con un'unità costruita a mano.
- **Secondo caso della stessa famiglia** (col Cubo di SUP-07): una regola scritta nel catalogo e nel motore, con **zero** profili che possano invocarla. Fino alla revisione 24 i casi dichiarati erano quattro: il Disposable `(+1SD)` e il `Chest Mine` **esistono** (li cercavo col nome sbagliato) e sono usciti dall'elenco. → **DATABASE**: `Sapper` è un'Abilità che manca ai profili, o non esiste in N5?

**LOG-02 — Ingresso in campo** *(eseguibile dal 10 ottobre)*
- **Attivo:** **Spector (Parachutist, Combat Jump)**, voce **29** del roster *(PH 13)* · INGRESSO IN CAMPO · Ordine Intero
- **ARO:** nessuno
- **Atteso:** la voce `INGRESSO IN CAMPO (AD)` è nel menu. La schermata mostra **PH 13** con la voce *«PH di <soprannome>: 13»* — il tiro è sul **PH della truppa**, non fisso — poi **una domanda bloccante** sul punto di atterraggio (*«Il punto di atterraggio rispetta tutti i divieti…?»*) con **sei divieti** elencati, l'ultimo solo per il Combat Jump (niente aree con Visibilità Bassa, Pessima o Zero, Fumo ed Eclipse compresi). Finché non rispondi, il tasto dice **RISPONDI ALLA DOMANDA**. Sotto, **prima del tiro**, il riquadro *SE IL TIRO FALLISCE*: si entra comunque, nella **propria Zona di Schieramento** a contatto col bordo, **come Modello** e **senza i Deployable**; l'Ordine non è sprecato.
- **Controprova:** `Alguacil (Combi Rifle)` voce 1 non ha la voce nel menu, e `M.regoleIngressoInCampo` gli risponde col motivo giusto — *«Serve un'Abilità di Schieramento Aereo: Combat Jump, Airborne Deployment, AD:, Parachutist.»*
- **Da leggere insieme a LOG-03:** qui il numero è il PH del profilo (13), là è **fisso a 14** qualunque sia la truppa. Se le due schermate mostrano lo stesso numero, una delle due sta leggendo il campo sbagliato.

**LOG-03 — Request Speedball**
- **Attivo:** **due truppe, scelte perché stanno ai due lati del 14**: `Alguacil (Combi Rifle)` (PH **10**) e `Squalo Mk-II (MULTI Marksman Rifle)` (PH **15**) · REQUEST SPEEDBALL
- **ARO:** nessuno
- **Atteso:** per **entrambe** lo stesso numero, **14**, con la voce *«PH fisso 14: non quello della truppa»*; `nonEUnOrdine: true` e tipo `AUTOMATIC_SKILL`. Primo Token scelto, secondo tirato sulla Chart (1-3 VITAPACK, 4-6 AUTOREPAIRS, 7-10 SWITCH ON, 11-13 JETPACK (S:2), 14-16 OVERKILL, 17-20 NANOSHIELD); servono **due** Token.
- **Perché due truppe e non una:** con una sola, un'app che leggesse per sbaglio il PH del profilo potrebbe passare per caso. Con il 10 e il 15 un errore si vede da che parte cade — 10 sarebbe un PH letto, 15 sarebbe un PH letto, e sono sbagli diversi. Il 15 è il caso cattivo: un numero **più alto** del vero fa sembrare riuscito un tiro che è fallito.

---

# 19. Blocco Q — Fireteam

**FT-01 — Livello = truppe della stessa Unità**
- **Attivo:** un Fireteam di 5 Alguacil · schermata del Fireteam
- **Atteso:** **LIVELLO 5 (5 membri)** e i cinque bonus.

**FT-02 — Cinque truppe diverse**
- **Attivo:** un Fireteam con Alguacil + Moderator + Grenzer + Zero + Daktari · schermata del Fireteam
- **Atteso:** **LIVELLO 1 (5 membri)**, con la nota esplicita, e **nessun bonus**.

**FT-03 — Il +1 BS nel calcolo** 🔴 **con un difetto aperto accanto**
- **Attivo:** Alguacil (Combi Rifle), voce **1** del roster, in un Fireteam con le voci **2, 3, 4** — tutti e quattro `Alguacil`, quindi **Livello 4** · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania, prima banda (0-8", +3)
- **ARO:** nessuno
- **Atteso:** il **+1 BS** compare dal **Livello 4**, con la voce `Fireteam di Livello 4: +1 BS`. Misurato: Livelli 1, 2, 3 danno **14** (solo `Gittata: +3`); Livelli 4 e 5 danno **15**, due voci. Lo stesso passando l'elenco dei membri invece del numero.
- **Il Livello NON è il numero di membri:** cinque unità **diverse** fanno un Fireteam di **Livello 1** e non prendono niente; quattro Alguacil più un Daktari fanno **Livello 4**. Da provare entrambi, o un conteggio sui membri passerebbe per corretto.
- **Dove si passa:** l'opzione è `livelloFireteam` (un numero) oppure `fireteam` (l'elenco dei membri), documentata sopra `M.modAttacco`. Passata con un nome inventato non fa niente e non si lamenta: cercata col nome sbagliato questa prova sembra rossa quando non lo è.
- 🔴 **DIFETTO APERTO, MISURATO IL 9 OTTOBRE — il +1 SD del Livello 2 non arriva a nessuno.** `M.bonusFireteam` restituisce `sd: 1` dal Livello 2 e il banner del Fireteam scrive `BS Attack (+1 SD)`. Ma `M.burstIniziale` risponde **`sd: 0`** con ogni forma dell'opzione — `livelloFireteam`, `fireteam`, niente — perché `M.dadiSpeciali` legge **solo le notazioni della truppa e dell'arma**, mai il Livello. E nello scontro completo del Hub non c'è **nessuna traccia** di dado speciale: cercato `sd`, `dadoSpeciale`, `specialDie` in tutto l'oggetto, zero. **Il meccanismo funziona** — una truppa con `BS Attack (+1 SD)` nel profilo dà `sd: 1`, con `(+2 SD)` dà 2 — **manca solo la fonte Fireteam**. La schermata ha già il codice per mostrarlo (`🎲 +1 Dado Speciale` se `burstDettaglio.sd > 0`): non si accende mai per un Fireteam. Dal Livello 2 un membro dovrebbe tirare un dado in più e scartarne uno, e nessuno glielo dice.
**FT-04 — Non vale per Scoprire né Hacking**
- **Attivo:** Alguacil (Combi Rifle), voce **1**, in un Fireteam di quattro Alguacil (voci **1-4**, **Livello 4**) · dichiara SCOPRIRE, poi HACKING
- **Con:** per lo SCOPRIRE nessun'arma (ha gittate proprie); per l'HACKING serve un Hacker — l'**Interventor (Hacker Plus)**, voce **8**, in un Fireteam di Livello 4 con tre Alguacil non va: il Livello conta le truppe della **stessa** Unità. Per questa metà serve un Fireteam di quattro Interventor, cioè una **sostituzione nel roster**; con le 40 di oggi si prova il solo caso a Livello 1, dove non c'è bonus da sbagliare
- **Bersaglio:** per lo SCOPRIRE il **Croc Man (MULTI Sniper Rifle)**, voce **6** di PanOceania, messo in **CAMO**; per l'HACKING l'**Orc (Hacker, Hacking Device)**, voce **4**
- **ARO:** nessuno
- **Atteso:** sullo **SCOPRIRE** si applica il **+3 Discover** del Livello 3 e **non** il +1 BS del Livello 4. Misurato: Livello 3 e Livello 4 danno **entrambi 13** — `Gittata: +3`, `Mimetismo del bersaglio: -6`, `Fireteam di Livello N: +3 Discover` — cioè il +1 BS del Livello 4 **non si aggiunge**. Sull'**HACKING** il Livello non cambia niente: **15** a Livello 3 e a Livello 4, nessuna voce di Fireteam.
- **E la nota c'è:** fra le note del bonus si legge *"I bonus \"BS Attack (+1 SD)\" e \"+1 BS\" NON si applicano a Discover."* — così la regola non resta solo nel calcolo.
- **Controprova:** sull'ATTACCO BS lo stesso Livello 4 **dà** il +1 BS (vedi FT-03). È la coppia che distingue "sa escluderlo" da "non lo applica mai".
**FT-05 — Rotture**
- **Attivo:** Alguacil (Combi Rifle), voce **1** del roster, in un Fireteam di quattro Alguacil (voci **1-4**) · si passa dall'editor degli stati, uno stato per volta
- **Atteso:** con `M.rotturaFireteam` — **escono** dal Fireteam **Incosciente** e **Morto** (causa `STATO_NULLO`), **Isolato** (`ISOLATO`) e **Fuoco di Soppressione** (`SOPPRESSIONE`): una causa ciascuno, nominata. **Non escono** **IMM-A** e **IMM-B**: nessuna causa, e la nota lo dice — *"Gli Stati Immobilizzato-A e Immobilizzato-B NON fanno uscire dal Fireteam: il regolamento li tratta come categoria distinta dagli Stati Nulli."*
- **Perché conta:** fino al 28 settembre due file del progetto si contraddicevano proprio qui — `fireteam.js` includeva la Soppressione e non gli Immobilizzati, `logica_stati.js` il contrario — e delle **dieci** cause ufficiali ne conoscevano quattro ciascuno, diverse. Ora la lista è una sola, in `CATALOGO_N5.FIRETEAM_INTEGRITA`, e questa prova la guarda da lì.
- **Le altre sei cause** non dipendono dallo stato e l'app non le vede da sola (Coerenza rotta, Ordine Irregolare, Ordine del Tenente, Impetuosa nella Fase Impetuosa, cambio di Gruppo, ARO diverso dal Fireteam): si passano a `M.rotturaFireteam` nel secondo argomento, e vanno provate una per una con quel campo.
**FT-06 — Neurocinetics in Fireteam**
- **Attivo:** Sin-Eater (MULTI Sniper Rifle), voce **20** del roster (ha **Neurocinetics**), in Turno Attivo · ATTACCO BS
- **Con:** **MULTI Sniper Rifle (AP Mode)** (Burst 2 di base)
- **Bersaglio:** Fusilier (Combi Rifle), voce **1** di PanOceania
- **ARO:** nessuno
- **Atteso:** in Turno Attivo il Burst è **1**, con la voce `Neurocinetics: Burst 1 in Turno Attivo su tutte le armi BS` — e **nessun bonus di Fireteam lo rialza**, qualunque Livello. In ARO invece `M.burstReattivo` dà **2**, con le voci `In Turno Reattivo il Burst è 1` e `Neurocinetics: Burst pieno dell'arma in ARO (B2)`.
- **La coppia che conta:** attivo **1** contro reattivo **2**, sulla stessa truppa e la stessa arma. Provata da un lato solo, una Neurocinetics che non funzionasse affatto passerebbe per corretta.
- **Attenzione al punto d'ingresso:** il Burst reattivo lo dà **`M.burstReattivo`**, non `M.burstIniziale` con `inAro: true` — quello risponde ancora 1. Collegato a **BS-25**, dove la stessa distinzione vale per la Total Reaction.

---

# 20. Blocco R — Ordine Coordinato

**CO-01 — Burst della Punta di Lancia**
- **Attivo:** Alguacil (HMG) *(Nomadi #2)*, **Punta di Lancia** di un Ordine Coordinato con Alguacil (Combi Rifle) #1 e Alguacil (Missile Launcher) #3
- **Con:** Heavy Machine Gun, Burst **4**
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda 1
- **Atteso:** Burst **2**, con le due voci *«Burst dell'arma Heavy Machine Gun»* e *«Punta di Lancia: metà del Burst arrotondata per eccesso»*. Metà di 4 è 2; con un'arma a Burst 3 sarebbe 2 anche lei (arrotondata per eccesso).

**CO-02 — Gregari**
- **Attivo:** i due **gregari** dello stesso Ordine Coordinato di CO-01 — Alguacil (Combi Rifle) *(#1)* e Alguacil (Missile Launcher) *(#3)*
- **Con:** Combi Rifle per il primo, Missile Launcher (Blast Mode) per il secondo
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda 1
- **Atteso:** Burst **1** per tutti e due, con la voce *«Gregario in Ordine Coordinato: Burst 1»*. **Qualunque sia il Burst della loro arma**: il Missile Launcher a Burst 1 e il Combi a Burst 3 danno lo stesso risultato. È la controprova di CO-01: se il gregario tira più di un dado, la metà della Punta non c'entra.

**CO-03 — Leader di Fireteam ≠ Punta di Lancia**
- **Attivo:** un Ordine Coordinato con **Alguacil (HMG) #2** come Punta di Lancia e, come gregario, il **Leader di un Fireteam** di quattro Alguaciles *(Nomadi #1, #4, #5 e un quarto Alguacil)*
- **Con:** Heavy Machine Gun per la Punta, Combi Rifle per il Leader del Fireteam
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda 1
- **Atteso:** **per regola** il Leader del Fireteam ha il **Burst pieno** — Combi Rifle **3** — anche se è gregario del Coordinato. La wiki mette i due casi in contrasto esplicito: la Punta scende a metà, il Leader **no**.
- 🔴 **Oggi leggerai 1, e non è un tuo errore.** Misurato il 9 ottobre: il motore porta a Burst 1 **ogni** gregario del Coordinato, Leader di Fireteam compreso. Il commento del motore (riga ~1961) dichiara la regola giusta — *«Il Leader del Fireteam invece ha il Burst pieno… e qui erano trattati uguali»* — ma il codice sotto non la applica: `if (ctx.indiceCoord > 0)` scende a 1 senza eccezioni. **Segnalato a MOTORE.** Questa prova resta nel piano perché è quella che lo prende: quando sarà corretta, leggerai 3.

**CO-04 — Cinque unità**
- **Attivo:** un Ordine Coordinato con **cinque** Alguaciles *(Nomadi #1-#5)*, Punta di Lancia il #1
- **Atteso:** **E41** — *«Ordine Coordinato con 5 unità: il massimo è 4»*. Il messaggio conta le **truppe**, non le voci della busta: con Scoprire + Attacco cinque truppe fanno dieci voci e il numero deve restare 5 (vedi SP-08).

**CO-05 — Nessuna**
- **Attivo:** un Ordine Coordinato con **nessuna unità**
- **Atteso:** **E40**.

**CO-06 — Punta mancante**
- **Attivo:** un Ordine Coordinato con due Alguaciles *(#1 e #2)* e **nessuna Punta di Lancia** designata
- **Atteso:** **E45** — *«Nessuna Punta di Lancia designata»*.

**CO-07 — Punta non selezionata**
- **Attivo:** un Ordine Coordinato con due Alguaciles *(#1 e #2)*, e come Punta di Lancia una **terza** truppa che non è fra le selezionate
- **Atteso:** **E46** — *«La Punta di Lancia non è fra le unità selezionate»*. È diverso da CO-06: qui la Punta c'è, ma non è nel gruppo.

**CO-08 — Unità non attivabile**
- **Attivo:** un Ordine Coordinato con Alguacil #1 e Alguacil #2, con il **#2 Incosciente**, Punta di Lancia il #1
- **Atteso:** **E42** col motivo — *«<nome>: Stato Nullo: non può dichiarare Ordini attivi»*. Il nome dell'unità deve comparire: con due gregari non si saprebbe quale.

**CO-09 — Gruppi diversi**
- **Attivo:** un Ordine Coordinato con Alguacil #1 nel **Gruppo 1** e Alguacil #2 nel **Gruppo 2**, Punta di Lancia il #1
- **Atteso:** **E43** — *«Le unità appartengono a 2 Gruppi di Combattimento diversi»*.
- ⚠️ **La seconda metà di questa prova non è eseguibile.** Chiedeva anche **E44** (Regolari con Irregolari): il motore lo controlla cercando la Skill `IRREGULAR` nelle skill della truppa, e **nessun profilo del database Nomadi la dichiara** — verificato su tutti e 385. Il controllo c'è ed è giusto, ma non è innescabile dai dati: è una lacuna del database, segnalata a DATABASE. Il Morlock è *Impetuous*, che non è la stessa cosa.

**CO-10 — Stesso bersaglio**
- **Attivo:** un Ordine Coordinato con Alguacil (HMG) #2 come Punta e Alguacil (Combi Rifle) #1 come gregario, **tutti contro lo stesso bersaglio**
- **Con:** Heavy Machine Gun per la Punta, Combi Rifle per il gregario
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* @ banda **4 (32-40")** — fuori gittata per il Combi, dentro per l'HMG
- **Atteso:** chi non soddisfa i requisiti fa **Idle**, che **genera comunque ARO** e **spende i Disposable** (A-07). L'Ordine non si blocca: una sola truppa fuori gittata non annulla il Coordinato.

**CO-11 — CC coordinato**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* come **Punta di Lancia** in CC, con **due** alleati partecipanti ingaggiati — Chimera *(#14)* e Alguacil #1
- **Con:** CC Weapon
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Ingaggiato**
- **Atteso:** tira **solo la Punta**. I due gregari hanno Burst **0** e `nonTira`, con la voce *«Gregario in Ordine Coordinato: in mischia non tira»*. La Punta ha **+1 Burst e +1 PH per ogni alleato partecipante ingaggiato**: con due alleati il Burst passa da 1 a **3**, con la voce *«Punta di Lancia: +2B per gli alleati»*. Se tirano anche i gregari, il Coordinato in CC è trattato come due attacchi separati.

**CO-12 — ARO**
- **Attivo:** un Ordine Coordinato con Alguacil #1 e Alguacil #2 · dichiarano **MOVIMENTO**
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → **ATTACCO BS**, Combi Rifle, banda 1, **contro una sola** delle due
- **Atteso:** **un solo ARO per nemico**, contro **una sola** delle truppe attivate. L'elenco dei bersagli dell'ARO deve offrire entrambe le truppe ma permetterne **una**: se ne accetta due, il nemico sta reagendo due volte allo stesso Ordine.

**CO-13 — Command Token**
- **Attivo:** un Ordine Coordinato con Alguacil #1 e Alguacil #2, dichiarando la spesa di un **Command Token**
- **Atteso:** un **promemoria** a schermo che il Command Token va scalato **a mano**: il motore non tiene il conto dei Token. Non è un difetto, è un confine dichiarato — ma il promemoria deve esserci, o il giocatore crede che l'app li conti.

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
- **Attivo:** lo stesso attacco nelle quattro varianti — **senza visore** Alguacil (Combi Rifle) *(#1)*; **MSV L1** Grenzer (Forward Observer, Sensor, NCO) *(#12)*; **MSV L2** Intruder (HMG) *(#24)*; **Marksmanship** Grenzer (Marksmanship) *(#11)*
- **Con:** l'arma di ciascuno
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_10 Bosco** *(Bassa Visibilità + Zona di Saturazione)* @ banda **1**, copertura **no**
- **ARO:** nessuno
- **Atteso:** senza visore **−3 BS e −1 Burst**; MSV L1 **solo −1 Burst**; MSV L2 **solo −1 Burst**; Marksmanship **−3 e −1 Burst**. Il −1 al Burst viene dalla Saturazione e **non** lo toglie nessun visore; il −3 lo togli già con l'MSV L1. Il Marksmanship **non** è un visore: si comporta come chi non ne ha.

**TER-02 — TER_11 Giungla**
- **Attivo:** le quattro varianti di TER-01 — Alguacil #1, Grenzer #12 (MSV L1), Intruder #24 (MSV L2), Grenzer #11 (Marksmanship)
- **Con:** l'arma di ciascuno
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_11 Giungla** *(Pessima Visibilità + Saturazione)* @ banda **1**, copertura **no**
- **ARO:** nessuno
- **Atteso:** senza visore **−6 e −1 Burst**; MSV L1 **−3 e −1 Burst** (dimezza, non annulla); MSV L2 **solo −1 Burst**; Marksmanship **−6 e −1 Burst**. È la prova che distingue i due livelli di visore: nel Bosco L1 e L2 fanno lo stesso, qui no.

**TER-03 — TER_13 Foresta Primordiale**
- **Attivo:** le quattro varianti di TER-01
- **Con:** l'arma di ciascuno
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_13 Foresta Primordiale** *(Visibilità Zero + Saturazione)* @ banda **1**
- **ARO:** nessuno
- **Atteso:** senza visore **NESSUNA LoF** — l'attacco non si può nemmeno dichiarare; MSV L1 **−6 e −1 Burst**; MSV L2 **LoF libera e solo −1 Burst**; Marksmanship **nessuna LoF**. Qui il visore non riduce un malus: apre o non apre la linea di tiro.

**TER-04 — TER_17 Sala Generatori**
- **Attivo:** le quattro varianti di TER-01
- **Con:** l'arma di ciascuno
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_17 Sala Generatori** *(Rumore Bianco + Saturazione)* @ banda **1**
- **ARO:** nessuno
- **Atteso:** **senza visore nessun effetto sul tiro e −1 Burst** — la LoF è libera; **con MSV L1, L2 o L3 NESSUNA LoF**; Marksmanship come chi non ha visore sul tiro, ma **nessuna LoF**. Il Rumore Bianco è il contrario di tutti gli altri terreni: **punisce chi ha il visore** e lascia passare chi non ce l'ha. 🔴 **Valore corretto il 9 ottobre:** il piano diceva «MSV L1 −6, MSV L2/L3 LoF libera», copiando lo schema della Foresta. Misurato col motore 2026-10-09.1: il Rumore Bianco **blocca la LoF a tutti e tre i livelli** di visore. È il senso della regola — il Rumore Bianco esiste per negare i multispettrali.

**TER-05 — TER_15 Tempesta**
- **Attivo:** le quattro varianti di TER-01
- **Con:** l'arma di ciascuno
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_15 Tempesta** *(Peggiora Visibilità di 1)* @ banda **1**
- **ARO:** nessuno
- **Atteso:** senza visore **−3**, e **nessun** −1 al Burst; MSV L1 **niente**; MSV L2 **niente**; Marksmanship **−3**. La Tempesta **non** è una Zona di Saturazione: se vedi il −1 al Burst, il motore la sta trattando come un bosco. E da sola alza la Visibilità di un livello: su un terreno che già ne ha una, i due si combinano (Bosco + Tempesta → **−6**).

**TER-06 — Speculativo ignora le Zone di Visibilità**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · dichiara **FUOCO SPECULATIVO**
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* · terreno **TER_11 Giungla** *(Pessima Visibilità, −6 per chi non ha visore)* @ banda **2**, copertura **no**
- **ARO:** nessuno
- **Atteso:** il **−6 del terreno non entra nel tiro** — lo Speculativo non guarda, tira a parabola — mentre il **−1 al Burst della Saturazione sì**. Controprova: lo stesso Alguacil con un ATTACCO BS normale sullo stesso bersaglio prende **−6 e −1** (TER-02). I due numeri a confronto sono la prova.

**TER-07 — Saturazione**
- **Attivo:** Alguacil (HMG) *(Nomadi #2)* · ATTACCO BS
- **Con:** Heavy Machine Gun *(Burst 4)*
- **Bersaglio:** **due** Fusiliers *(PanOceania #1 e #2)* · terreno **TER_10 Bosco** *(Zona di Saturazione)* @ banda **1**, copertura **no**
- **ARO:** nessuno
- **Atteso:** il Burst scende **prima** dell'allocazione: dai 4 dell'HMG a **3**, e sono **3** i dadi da dividere fra i due bersagli — non 4 divisi e poi ridotti. Se la schermata ti fa dividere 4 e poi mostra 3, l'ordine è sbagliato e un dado si perde senza che si veda dove.

**TER-08 — Fumo contro MSV**
- **Attivo:** Intruder (HMG) *(Nomadi #24, **MSV L2**)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, dietro una Sagoma di **Smoke**, poi di **Eclipse** @ banda **2**, copertura **no**
- **ARO:** Fusilier (Combi Rifle) → **Schivata**
- **Atteso:** col **Fumo** l'MSV L2 vede attraverso: esce **TIRO NORMALE** con la nota che il Fumo non lo ferma. Con l'**Eclipse** no: esce **FACCIA A FACCIA**, perché l'Eclipse ferma anche i visori. Sono le due zone che il campo `zona` distingue — e il motivo per cui Fumo ed Eclipse si escludono nella scelta del terreno (vedi il banco della tendina).

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

**DIS-02 — Il (+1B) costa due usi, il (+1SD) uno** *(eseguibile dal 10 ottobre)*
- **Attivo:** prima **Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust)**, voce **30** *(TAG, BS 13)* · ATTACCO BS; poi **Spector (Parachutist, Combat Jump)**, voce **29** *(PH 13)* · FUOCO SPECULATIVO
- **Con:** per il Triphammer **Panzerfaust (+1B)**, come sta scritto nel suo profilo; per lo Spector **Drop Bears (BS Mode) (+1SD)**
- **Bersaglio:** `Fusilier (Combi Rifle)` voce 1 @ banda **0** (0-8"), senza copertura — il bersaglio non cambia il conto degli usi, serve solo un colpo da dichiarare
- **ARO:** nessuno
- **Atteso:** **Triphammer:** la scheda del bersaglio dice *«Burst dell'arma Panzerfaust · BS Attack (+1B): +1 Burst in Turno Attivo»* e assegna **2** dadi; sul tabellone **Successo al 10** (BS 13 −3 di gittata), **Dadi da lanciare: 2**. Dopo il colpo gli usi spesi del Panzerfaust sono **2 su 2**: è Disposable (2), un solo attacco lo svuota. **Spector:** i Drop Bears a Burst **1** più **un dado speciale** (`M.burstIniziale` → `valore 1`, `sd 1`), e si spende **un uso solo** su 3 (`M.usiDaConsumare` con Burst 1 → 1). I due costi devono essere **diversi**: è tutto il senso della prova.
- **Come è misurato:** il Triphammer **dalla pagina**, fino al tabellone. Lo Spector **sul motore** (le due funzioni qui sopra) e fino alla scelta dell'arma dalla pagina — il bottone `Drop Bears` compare nel Fuoco Speculativo con *Burst 1* e le bande +3 / −3; il resto del giro in app è da fare al tavolo. `test_usi_disposable.js` confronta i due costi con la notazione costruita a mano.
- **Corretto il 10 ottobre:** fino alla revisione 24 questa prova diceva che un Disposable con `(+1SD)` *non esiste in nessuno dei 765 profili*. Cercavo `Panzerfaust (+1SD)`. Esiste `Drop Bears (+1SD)`: Spector e Spector FTO, nelle due fazioni.

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
- **Attivo:** `Intruder (MULTI Sniper Rifle)` · ATTACCO BS — porta `MULTI Sniper Rifle (+1SD)`. *(I Triggermen hanno davvero la Skill `BS Attack (+1SD)`, ma nessuno dei 4 profili è nel roster: l'Intruder arriva allo stesso dado per l'altra strada, la notazione dell'arma.)*
- **Con:** `MULTI Sniper Rifle (+1SD)`
- **Bersaglio:** prima `Fusilier (Combi Rifle)` solo, poi `Fusilier (Combi Rifle)` + `Orc (Hacker, Hacking Device)` @ banda 3, senza copertura
- **ARO:** nessuno
- **Atteso:** fra i modificatori compare **"tira 1 dado in più, poi scartane 1"**, e il Burst **resta 1** — `M.dadiSpeciali` dà 1 e `M.burstIniziale` torna `{valore: 1, sd: 1}`. Con due bersagli il dado va a **uno solo**: il primo con dadi assegnati, o quello che hai marcato.
- **Controprove, due e di peso diverso:** (1) lo **stesso** Intruder con il `MULTI Sniper Rifle` **senza** la notazione → `sd: 0`, nessuna frase: cambia solo la notazione, non la truppa né l'arma; (2) `Alguacil (Combi Rifle)` → `sd: 0` con Burst 3, cioè un Burst alto non è un dado speciale. La prima è la controprova che conta: isola la notazione da tutto il resto.
- **Terza strada, in mischia:** `Wolfgang Amadeus` con la `DA CC Weapon` ha **Martial Arts L3**, e il motore dà `sd: 1` con la nota *«Martial Arts L3: (+1 SD) — tira un dado in più e poi scartane uno. Non aumenta il Burst.»* Tre sorgenti dello stesso dado (notazione d'arma, Skill di profilo, Martial Arts) e una sola frase a schermo: se una delle tre non arriva, si vede qui.

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

**DET-04 — Le tre domande dell'innesco** *(eseguibile dal 10 ottobre, con un difetto accanto)*
- **Attivo:** `Puppet Masters (Minelayer)` voce 22 · scegli DETONAZIONE per la sua **Shock Mine**; poi **Krakot Renegade (Boarding Shotgun)** voce **31** e **Bambabot-1 (Chain Rifle (ps=6))** voce **32** · PIAZZARE EQUIPAGGIAMENTO
- **Atteso:** **tre domande**, ciascuna bloccante — un nemico nell'area d'innesco; solo il movimento di una Schivata o di un Guts fallito; un alleato sotto la Sagoma, anche Incosciente. Se manca **anche una sola risposta**, la detonazione **non scatta** e l'app lo dice. **La metà negativa:** il `Chest Mine` del Krakot e il `Mine Dispenser (AP)` del Bambabot **non si piazzano** — `M.armiPiazzabili` risponde con zero armi per entrambi, perché nessuno dei due ha il Tratto Deployable — quindi non diventano mai un segnalino e la voce DETONAZIONE non può arrivare a loro. A schermo: *«Questa unità non ha equipaggiamento da piazzare.»*, e nessun bottone d'arma.
- 🔴 **DIFETTO APERTO, MISURATO DALLA PAGINA IL 10 OTTOBRE — la voce è offerta lo stesso, e costa l'Ordine.** `PIAZZARE EQUIPAGGIAMENTO` compare nel menu del Krakot e del Bambabot, perché `puoFareAzione` in `app.html` decide dal **nome** (cerca `MINE` fra le armi) e non chiede al motore. Toccandola parte l'allarme (azione `IDLE`: Piazzare dichiarato per primo vale Idle + Piazzare), il reattivo ha il suo ARO, e sulla schermata non c'è niente da piazzare. È la famiglia dell'ordine offerto e non eseguibile, già corretta per Speculativo, Intuitivo e Guidato, che chiedono al motore con `armiPerAzione`: qui basterebbe `M.armiPiazzabili`. → **INTERFACCIA**
- **Corretto il 10 ottobre:** fino alla revisione 24 questa prova diceva che `Chest Mines` *non è nell'armamento di nessuno dei 765 profili*. Al singolare, `Chest Mine`, lo portano **8** profili: i quattro Krakot Renegade, nelle due fazioni. Il `Mine Dispenser` è in **7**.

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
effetto che cambia lo stato di chi agisce, non di un avversario. **Esistono
tutte e tre**: Cybermask e Rientrare in CAMO sono state costruite fra il 5 e il
6 ottobre, e fino alla revisione 24 il piano le dava ancora "da costruire".

**ORD-01 — Piazzare equipaggiamento** *(esiste)*
- **Attivo:** `Moran (Surprise Attack, Camouflage)` (stato Normale) · PIAZZARE EQUIPAGGIAMENTO · **CrazyKoalas**
- **Atteso:** le domande sono bloccanti: se manca una risposta non si esegue. È il modello della famiglia. Vedi DEP-10 e DET-04.

**ORD-02 — Cybermask** *(esiste; riscritta il 10 ottobre sull'app vera)*
- **Attivo:** tre hacker del roster, in quest'ordine · CYBERMASK · Abilità Lunga, Ordine intero:
  1. `Interventor (Hacker Plus)` voce 8 — **Hacking Device Plus**, 6 programmi (Carbonite, Cybermask, Oblivion, Spotlight, Total Control, White Noise)
  2. `Zero (Hacker, Killer Hacking Device)` voce 9 — **Killer Hacking Device**, 2 programmi (Cybermask, Trinity). Nasce **Marker CAMO**: la voce c'è lo stesso
  3. `Orc (Hacker, Hacking Device)` voce 4 di PanOceania — **Hacking Device** normale, 4 programmi e **nessun Cybermask**. È l'unica voce del roster che ha il dispositivo semplice **e nient'altro**: `Mary Problems (Hacker)` ne ha due (KHD + HD) e la voce ce l'ha.
  Quarta, fuori dai tre: `Alguacil (Combi Rifle)` — non è un hacker. Serve a separare "il programma non c'è" da "la schermata è vuota".
- **Con:** CYBERMASK
- **ARO:** nessuno
- **Atteso:** la voce `CYBERMASK` è nel menu di **Interventor** e **Zero**; **non** è nel menu dell'**Orc** né dell'**Alguacil**, e chiedendolo al motore il motivo è lo stesso per tutti e due: *«Serve il programma Cybermask: Hacking Device Plus o Killer Hacking Device.»* Toccandola: **una domanda sola**, bloccante — *«L'Hacker è FUORI dalla Linea di Tiro di ogni Modello e di ogni Marker nemico?»* — e tre esiti: **SÌ** → l'Hacker entra in **IMP-2** senza tirare, Ordine intero speso; **NO** → *«Il Requisito del Cybermask non è soddisfatto…: l'Hacker NON entra in IMP-2 ed esegue invece un Idle»* — **l'Ordine è speso lo stesso**; **non risposto** → non si esegue. Due casi in cui la voce sparisce a un hacker che l'avrebbe: **Isolato** (*«Stato Isolato: CYBERMASK non è permessa.»*) e **già in Impersonation** (*«È già in Impersonation.»*).
- **Corretto il 10 ottobre:** fino alla revisione 24 l'esito del NO era scritto *"non si può dichiarare"*. La regola (riga 5150) fa della Linea di Tiro un **Requisito**: chi lo dichiara e non lo soddisfa esegue un Idle. È la differenza fra un Ordine tenuto e un Ordine perso. Misurato in `test_voce_cybermask.js` e `test_camo_cybermask.js`; vedi anche C-01.

**ORD-03 — Rientrare in CAMO** *(esiste; riscritta il 10 ottobre sull'app vera)*
- **Attivo:** `Intruder (HMG)` voce 24 — Camouflage senza limite — **dopo che è stato rivelato**; poi `Moran (Surprise Attack, Camouflage)` voce 19 — **Camouflage (1 Use)**, nel roster da sempre · RIENTRARE IN CAMO · Abilità Lunga, Ordine intero
- **ARO:** nessuno
- **Atteso:** la voce si chiama **`RIENTRARE IN CAMO`**. **Intruder rivelato:** la voce c'è. Toccandola, una domanda sola e bloccante — *«La truppa è FUORI dalla Linea di Tiro di ogni Modello e di ogni Marker nemico? (Non contano i nemici Incoscienti o Disconnessi, né quelli in Schieramento Nascosto finché non si rivelano.)»* — e tre esiti: **SÌ** → torna Marker CAMO senza tirare, Ordine intero speso; **NO** → *«…la truppa NON rientra in CAMO ed esegue invece un Idle. L'Ordine è speso.»*; **non risposto** → non si esegue. **Intruder ancora Marker:** la voce **non** c'è, motivo *«È già in forma di Marker.»* **Moran:** schierato com'è nel database nasce **Marker CAMO**, e con Camouflage (1 Use) l'uso è l'**entrata** nello Stato, schieramento compreso (FAQ F07): una volta rivelato la voce **non** c'è, motivo *«Camouflage (1 Use): lo stato CAMO è già stato usato in questa partita (F07).»* I due "no" hanno **motivi diversi** e vanno letti distinti. **Alguacil (Combi Rifle):** niente voce, *«Serve l'Abilità Camouflage.»*
- **Il caso che al tavolo richiede una scelta:** per vedere il Moran **rientrare** una volta bisogna schierarlo come **Modello** (non in CAMO): allora l'uso è libero, la voce c'è, e dopo il rientro non c'è più. Misurato in `test_camouflage_un_uso.js` sezione 6.
- **Regola** (riga 13597): *"During the Active Turn, Troopers may only return to this state by spending a Long Skill, while outside the LoF of enemy Markers or Troopers."* Una truppa che **rientra** non conta come lo stesso Marker: chi aveva fallito uno Scoprire contro di lei può ritentare subito (riga 13605).
- **Corretto il 10 ottobre:** l'atteso di prima nominava l'**Heckler** per il caso (1 Use) — che nel roster non c'è, mentre il Moran sì — chiamava la voce "RIENTRARE IN CAMUFFATO" e dava il NO come *"non si può dichiarare"*.

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
- **Attivo:** `Fusilier (Combi Rifle)` · ATTACCO BS contro la Mobile Brigada in Soppressione
- **Con:** Combi Rifle
- **Bersaglio:** `Mobile Brigada (HMG)` in **Fuoco di Soppressione** @ banda 2, senza copertura
- **ARO:** la Mobile Brigada → ATTACCO BS con la **Heavy Machine Gun**
- **Atteso:** oggi si legge questo: con un attacco attivo il reattivo in Fuoco di Soppressione scende a **Burst 1**; senza attacco resta **3**. La regola generale dell'ARO sta scavalcando la Soppressione. La regola (riga 14649) dice 3 sempre. → MOTORE
- **Dove guardare, misurato il 9 ottobre sera:** il motore **sa** già dare il 3. `M.armaReattivaEffettiva(Mobile Brigada in Soppressione, 'Heavy Machine Gun')` torna `Heavy Machine Gun (SF Mode)` con `sfMode: true` e `burst: 3`, e `M.burstARO` con quel profilo dà **3** con la voce «Fuoco di Soppressione: Burst 3 col profilo SF Mode». Con il profilo d'arma **nudo** la stessa funzione dà **1**: `burstARO` alza il Burst solo se vede `arma.sfMode`. Quindi il difetto non è nella regola ma in **chi chiama**: da qualche parte passa l'arma nuda invece di quella effettiva. Non è una riga che posso indicare — i banchi non possono entrare dove l'app costruisce la chiamata — ma il punto da guardare è quello.

## Difetti aperti e segnalati, alla revisione 25

Fino alla revisione 24 l'introduzione diceva "resta aperto un difetto solo". Non
era vero da giorni: gli altri stavano scritti dentro le prove che li avevano
trovati. Qui stanno tutti insieme, e per ognuno è detto **quanto è fresca la
misura**: "inchiodato" vuol dire che un banco fissa il comportamento di oggi e
diventa rosso il giorno della correzione — con la suite verde sul motore
2026-10-09.6, quelli **ci sono ancora**. Gli altri vanno riletti prima di
contarci.

| Difetto | Dove è scritto | Stato della misura | A chi |
|---|---|---|---|
| Il Burst reattivo in Soppressione esce 1 invece di 3 | D-02 qui sopra, BS-12 | del 9 ottobre; non inchiodato (è nella chiamata, non nella regola) | MOTORE |
| L'Attacco BS attivo non offre le armi scritte in `equip` (pistole): 629 profili su 765 | MU-21 | **misurato il 10 ottobre** dalla pagina e sul motore; non ancora inchiodato | MOTORE |
| PIAZZARE EQUIPAGGIAMENTO offerto a chi non ha niente da piazzare, e costa l'Ordine | DET-04 | **misurato il 10 ottobre** dalla pagina; non ancora inchiodato | INTERFACCIA |
| Deployable Cover (Cutting Foam) e (Vitroferro) disegnano lo stesso bottone | — | **inchiodato** in `test_bottone_arma.js` sezione 11 | MOTORE |
| `M.esitoTerreni` ha due implementazioni che non danno lo stesso esito | blocco T | **inchiodato** in `test_terreni_combinati.js` sezione 8 | MOTORE |
| Con un MSV3 la nota del terreno dice ancora "MSV2" | blocco T | **inchiodato** in `test_terreni_combinati.js` | MOTORE |
| Un refuso nella chiave delle opzioni di `esitoTerreni` va in console e non negli avvisi | — | **inchiodato** in `test_terreni_combinati.js` | MOTORE |
| `profiloArma` trasforma `ammo: null` in `"N"`: la Deployable Cover ha il bottone etichettato N | — | **rimisurato il 10 ottobre** (database `null`, profilo `"N"`); non inchiodato | MOTORE |
| Il +1 SD del Fireteam di Livello 2 non arriva né al Burst né allo scontro | FT-03 | del 9 ottobre; non rimisurato in questa revisione | MOTORE |
| Il filtro dei bersagli del Supporto ignora VITA contro STR | SUP-05 | del 9 ottobre; non rimisurato in questa revisione | MOTORE |
| Il Leader di un Fireteam gregario di un Coordinato va a Burst 1 | CO-03 | della revisione 19; non rimisurato in questa revisione | MOTORE |
| A58 nomina lo strumento ignoto ma non elenca gli identificativi attesi | SUP-06 | del 9 ottobre; non rimisurato in questa revisione | MOTORE |

**Chiuso il 9 ottobre sera:** `M.haGuidato` leggeva l'`ECM (Guided -6)` — la
difesa contro i Guidati — come la capacità di farli (27 profili capaci dove
erano 2). Corretto col motore 2026-10-09.5 e 2026-10-09.6; le prove sono in
`test_modulo_guidato.js` sezioni 12 e 13, e GUI-01, GUI-02 e GUI-04 sono rifatte.

## Chiusi il 6 ottobre

**D-01 — L'anello della scelta dell'arma (BS-06). NON ERA UN DIFETTO.**
- **Attivo:** `Alguacil (Combi Rifle)` · ATTACCO BS contro il Croc Man
- **Con:** Combi Rifle
- **Bersaglio:** Croc Man, prima come nasce (Marker) e poi rivelato (Modello) · banda e copertura **non detta**
- **ARO:** nessuno
- **Atteso:** oggi si legge questo: contro il Croc Man come nasce, Marker, l'Attacco BS è rifiutato con il motivo giusto — l'app torna alla scelta dell'arma perché è quello che deve fare; rivelato, dà **5** e salvezza **ARM VS 11**. Fissato in `test_modulo_bs.js` sezione 10.

**D-03 — Gli ordini senza tiro che non avvisano (A-13). CHIUSO per PIAZZARE EQUIPAGGIAMENTO.**
- **Attivo:** `Moran (Surprise Attack, Camouflage)` — porta le CrazyKoalas, quindi ha davvero qualcosa da piazzare — · PIAZZARE EQUIPAGGIAMENTO; poi Allerta; poi un piazzamento bloccato; poi IDLE da solo; poi MOVIMENTO e IDLE come seconda metà; poi IDLE e IDLE
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
- **Attivo:** `Puppet Masters (Minelayer)` · innesco della sua **Shock Mine** (Disposable (3), Concealed, Direct Template) · stato Normale
- **Atteso:** oggi si legge questo: nel database le mine non hanno un modo di risoluzione; all'innesco il motore risponde `null` — *non lo so* — e l'app dice che la mina **resta sul tavolo**, invitando a toglierla a mano. È corretto così: un "no" sarebbe falso. → DATABASE, quando la fonte darà il dato.

**T-02 — "Un pilota, un segnalino" è una lettura, non una regola.**
- **Attivo:** `Zondmate (REM)` · il secondo segnalino di pilota sullo stesso REM · schermata degli Stati
- **Atteso:** oggi si legge questo: "un pilota, un segnalino" è una lettura, non una regola. La wiki vieta esplicitamente solo il secondo segnalino sullo stesso REM. → REGOLE

**T-03 — Il recupero parziale non esiste.**
- **Attivo:** riapri l'app con la copia locale mancante del tutto
- **Atteso:** oggi si legge questo: il pulsante non compare. Costruirlo è possibile, ma potrebbe recuperare **solo le unità visibili**: per regola (riga 13896) un Hidden non mette il suo Ordine nel pool, e l'esistenza di quell'Ordine è informazione privata. Se si fa, deve dire "non conoscibili dall'Hub, per regola" — non zero. → INTERFACCIA

**T-04 — Due identificativi ignoti:**
- **Attivo:** apri il Monstrucker e Shona Carano
- **Atteso:** oggi si legge questo: `?219` sul Monstrucker e `?227` su Shona Carano. Le tabelle di decodifica sono ridotte per fazione e questi non stanno in nessuna delle due. → DATABASE

## Costruito dopo la revisione 6: da confermare al tavolo

**C-01 — Cybermask** *(eseguibile, e misurata)*
- **Attivo:** `Intruder (Hacker, Killer Hacking Device)` — nasce **Marker CAMO** — · schermata del **menu degli Ordini** (`procediAlleAzioni`)
- **Atteso:** la voce `CYBERMASK` c'è anche da Marker CAMO. **Non** c'è per `Alguacil (Combi Rifle)` (non Hacker), **non** c'è per chi ha un Hacking Device normale, **non** c'è se l'Hacker è Isolato, e **non c'è più** quando è già in Impersonation. Toccandola: la domanda sulla LoF a schermo, poi SÌ ed ESEGUI → IMP-2 nel roster e `IMP-2` fra le icone dell'elenco truppe. Misurato in `test_voce_cybermask.js` (chat INTERFACCIA). La regola e la domanda sono in ORD-02.

**C-02 — Rientrare in Camuffato** *(eseguibile, e misurata)*
- **Attivo:** `Intruder (HMG)` dopo MOVIMENTO con **requisito dichiarato fallito** · schermata del **menu degli Ordini**
- **Atteso:** la voce esiste e si chiama **`RIENTRARE IN CAMO`** — come l'identificativo e come il catalogo, **non** "RIENTRARE IN CAMUFFATO". Il nome conta: il menu e il router si cercano per identificativo, e due grafie sono un ordine che non si instrada. Misurato in `test_voce_rientro_camo.js` (chat INTERFACCIA).

**C-03 — Le due zone temporanee** *(costruita, e misurata)*
- **Attivo:** una scheda di bersaglio dell'ATTACCO BS, e la schermata dei modificatori di un ARO · tocca la riga **Terreno**
- **Atteso:** la riga chiusa dice *«Terreno: nessuno»*; toccandola si apre il riquadro *«Cosa c'è sulla linea di tiro?»* con una casella per ogni terreno dichiarato sul tavolo e, sotto, **Fumo** ed **Eclipse** — **sempre**, anche senza nessun terreno in schieramento. Le due caselle si **escludono**: toccare l'una spegne l'altra, e la nota dice *«Fumo ed Eclipse insieme: vale l'Eclipse, scegli quella.»* **OK** applica, **ANNULLA** no. Nella busta restano due campi: `terrain` (un elenco) e `zona` (`FUMO`, `ECLIPSE` o niente). Servono tutte e due perché un MSV L2 attraversa il Fumo e non l'Eclipse. Misurato in `test_elenchi_e_tabellone.js` sezione 2 e in `test_tendina_terreno.js` (chat INTERFACCIA).

**C-04 — Le icone dei due pulsanti.**
- **Attivo:** i due pulsanti Copertura e linea di tiro
- **Atteso:** oggi si legge questo: Copertura e linea di tiro hanno ora le quattro immagini (bersaglio in copertura parziale, bersaglio non in copertura, LoF libera, LoF interrotta); vanno nella cartella `img/` accanto ad `app.html`. → INTERFACCIA

**Chiuse dalla revisione 6**, da confermare in app: l'anello dell'hacking, il
RemDriver col rifiuto nel motore, l'Albedo col valore del profilo, gli usi
Disposable, il dado speciale, la Schivata contro le mine, la ripresa di app e Hub.

# 25. Blocco W — Le cinque spazzate (ora misurate, non da incollare)

**Erano cinque frammenti da incollare in console.** Dal 9 ottobre sera girano dentro
`test_coerenza_dati.js` **sezioni 8-12**, a ogni passata del banco. Lo
spostamento non e` un abbellimento: una spazzata che gira solo quando qualcuno
se la ricorda misura il database del giorno in cui l'ha incollata. La prova e`
che tre delle cinque attese scritte qui erano **false**, e nessuno lo sapeva:

| Diceva il piano | Dice la misura del 9 ottobre |
|---|---|
| SW-01: A51b su **21** contenitori | sono **23** (il piano era fermo a giorni prima) |
| SW-01: A47 su **Jammer e D-Charges (Demolition Mode)** | solo su **D-Charges (Demolition Mode)**; il Jammer non da` piu` nessun avviso |
| SW-02: quattro filtri, **nessuna riga** | ne servono **cinque**: senza `armaDalProfilo` esce `Armed Turret` |
| SW-04: `if (x.sconosciuta)` | **il campo `sconosciuta` non esiste su nessuna notazione.** Quella spazzata non poteva stampare niente: il suo "nessuna" era vero per il motivo sbagliato |

Nessuna delle quattro era un difetto dell'app. Tutte e quattro erano difetti
**delle prove** — tre numeri invecchiati e un controllo cieco.

**SW-01 — Ogni arma si risolve, e gli avvisi sono quelli previsti** *(sezione 8)*
- **Attivo:** le 188 voci di `RULES_WEAPONS`, una per una, con `M.profiloArma`.
- **Atteso:** 0 armi che il motore non trova. **A51b va a tutti i contenitori di modalita` e a nessun altro** — l'attesa e` l'invariante, non il numero: oggi sono 23, e un numero che *scende* vuol dire che un MULTI Rifle ha perso i suoi modi e tira sempre col primo. **A47** (modo dedotto, cioe` dato che manca alla fonte) **solo su `D-Charges (Demolition Mode)`**, confronto nominato nei due versi: un A47 nuovo e` esattamente la cosa da vedere. Nessun altro codice di avviso.

**SW-02 — Nessuna arma a gittata senza bande** *(sezione 9)*
- **Attivo:** le armi a gittata, cioe` tolte **cinque** categorie: `isTemplate`, `isCC`, `modalita`, `senzaGittata`, `armaDalProfilo`. Oggi sono 101.
- **Atteso:** 0 senza bande, 0 con tutte le bande a zero. **E i due filtri meno ovvi devono escludere qualcosa**, nominato: gli 8 `senzaGittata` (CrazyKoalas, Madtraps, Jammer, D-Charges (Demolition Mode), le due Deployable Cover, FastPanda, Disco Ball) e la sola `Armed Turret` per `armaDalProfilo` — la torretta non ha un'arma propria, la prende dalla scheda di chi la piazza, quindi bande vuote e` il dato giusto. Un filtro che non esclude niente e` un filtro che non serve, e allora la prova passa per il motivo sbagliato.

**SW-03 — Ogni arma offensiva sa dire la sua salvezza** *(sezione 10)*
- **Attivo:** `M.tiroSalvezza(Fusilier (Combi Rifle), {arma, ammo})` su tutte le armi non contenitore. Il bersaglio non cambia l'esito della spazzata: serve solo perche` il calcolo abbia un ARM e un BTS da cui partire.
- **Atteso:** **0 armi offensive senza attributo o senza dadi.** E le due righe che rendono quello zero leggibile: **159 armi offensive davvero esaminate** (se il numero crolla la spazzata sta passando perche` non guarda piu` niente), e ogni salvezza su un attributo noto — oggi ARM 120, BTS 28, ARM+BTS 4, PH 7. Le **6 non offensive** sono nominate: Smoke Grenades, Eclipse Grenades, Smoke Grenade Launcher, Eclipse Grenade Launcher, FastPanda, Disco Ball. Un'arma che diventa non offensiva esce dalla spazzata senza dirlo: per questo l'elenco e` nominato nei due versi.

**SW-04 — Le notazioni dei profili** *(sezione 11, riscritta da zero)*
- **Attivo:** `M.tutteLeNotazioni` su tutti i 765 profili — 2317 notazioni.
- **Atteso:** ogni notazione porta `etichetta`, `tipo`, `raw`; nessun `tipo` fuori dai 10 noti; **ogni notazione meccanica porta un valore numerico** (una MOD senza numero non sposta nessun tiro). E al posto del campo inesistente: il bucket vero di *"non l'ho saputa tradurre in una regola"* e` **`tipo: 'TESTO'`**, e le stringhe che ci finiscono sono **esattamente 38**, elencate nel banco. Una nuova e` una notazione scritta in un profilo che nessun calcolo legge; una sparita e` diventata meccanica. **Controprova:** una notazione inventata (`ZZQQ`) deve finire fra le non tradotte — se non ci finisce, il confronto non guarda niente.

**SW-05 — Ogni deployable e` collegato alla sua arma** *(sezione 12)*
- **Attivo:** i 17 `DB_DEPLOYABLES`, uno per uno.
- **Atteso:** 0 che puntino a un'arma inesistente — un token che nasce senza profilo d'arma non si risolve. Senza arma **di proposito, e solo loro**, nominati nei due versi: `dazer` e `deployable_repeater`.

---

# 27. Blocco DC — I campi che il piano non diceva: **0 prove su 297**

**Il blocco e` chiuso.** Era nato con 135 prove che avevano un campo muto —
quale unita` usare, quale arma, quale banda — e le avevo lasciate marcate
invece di riempirle con una supposizione: un numero inventato fa credere che
l'app sia rotta quando non lo e`, oppure il contrario. Il 9 ottobre sera
l'ultima e` stata riempita. Nessuna e` stata chiusa con una scelta comoda:
ogni soggetto e` una voce vera del roster, verificata esistente nel database
con il requisito che la prova chiede, e ogni numero atteso e` stato **misurato
sul motore di oggi**, non ricordato.

## Cosa e` venuto fuori riempiendoli

Riempire un campo e` sembrato lavoro di segreteria e non lo era: per sapere
quale truppa mettere bisogna chiedere al motore chi puo` farlo, e la risposta
ha trovato cose che nessuna prova guardava.

**Quattro attese del piano erano sbagliate**, tutte mie, nessuna dell'app:

| Prova | Diceva | Dice la misura |
|---|---|---|
| **TPL-05** | «nessun −3» schivando una Sagoma senza LoF | il −3 **si applica** (PH 10 → 7). Confondevo *Schivata concessa* con *Schivata senza malus*: il catalogo dice esplicitamente «stesso -3 schivando un'arma a Sagoma senza LoF» |
| **SW-01** | A51b su **21** contenitori, A47 su **Jammer e D-Charges** | 23 contenitori; A47 **solo** su D-Charges (Demolition Mode) |
| **SW-02** | quattro filtri bastano | ne servono **cinque**: senza `armaDalProfilo` esce `Armed Turret` |
| **SW-04** | `if (x.sconosciuta)` | **il campo non esiste**: quella spazzata non poteva stampare niente |

**Un difetto dell'app trovato allora, e chiuso il 9 ottobre sera:** `M.haGuidato`
cercava la sottostringa `GUIDED` in skills + equip e prendeva per buono
l'`ECM (Guided -6)`, che è la **difesa** contro i Guidati: **27** profili
risultavano capaci di un Attacco Guidato, **2** lo sono. MOTORE l'ha corretto
in due passi (motore 2026-10-09.5: si legge solo la Skill, con le tonde o con
le quadre; 2026-10-09.6: senza Skill `armiGuidate` non restituisce armi) e ne
ha trovato un secondo verificando il primo: il modulo scriveva l'avviso A95 e
disegnava lo stesso i bottoni. Le prove sono in `test_modulo_guidato.js`
sezioni 12 e 13.

## Le prove che nessun roster può far girare

Alla revisione 24 erano sette. Tre aspettavano una voce di roster e l'hanno
avuta (LOG-02, DIS-02, DET-04); per due delle altre quattro **il dato c'era**,
cercato col nome sbagliato (vedi DIS-02 e DET-04). Ne restano **quattro**, e
per nessuna basta una riga in più:

| Prova | Cosa manca | Misura |
|---|---|---|
| **SUP-07** (metà Cubo) | un profilo con `Cube` | **0** su 765 |
| **LOG-01** | un profilo con `Sapper` / `Foxhole` | **0** su 765 |
| **HK-07** | un bersaglio con **due** Firewall insieme | il TinBot del roster è uno; `FAIRY DUST` nel catalogo è solo *"Supportware su alleati (EVO)"*, senza un Firewall che l'app possa assegnare |
| **CO-09** (E44) | un profilo con la Skill `IRREGULAR` | **0** su 765, nelle due fazioni |

Per tutte e quattro la **regola è provata nei banchi** con un soggetto
costruito a mano, perché deve valere il giorno che il dato arriva. Quello che
manca è qualcosa da cliccare in app. → **DATABASE**: sono Abilità ed
equipaggiamenti che mancano ai profili, o che N5 non prevede?

**Una prova non è riproducibile, e la notizia è buona:** **SPEC-05** cercava
un'arma con i Tratti dedotti (avvisi A80 o A49). Oggi **0 delle 188 armi** è
senza il campo `traits`, e la spazzata su tutti i 765 profili emette **0**
avvisi da `armiSpeculative`, `armiIntuitive`, `armiSoppressione`, `armiCC` e
`armiARO`. Da prova a mano è diventata una **guardia** in
`test_coerenza_dati.js`: il giorno che un'arma entra senza `traits`, A49 torna
e il banco lo dice.

**12 prove portano l'etichetta "risolto, da confermare".** Non hanno
niente da completare: il difetto che le aveva fatte nascere è corretto e
provato nei banchi, e aspettano solo di essere viste una volta in app. Si
tolgono l'etichetta al tavolo, non qui.

## Dove sono finite le cinque spazzate

Il blocco SW era cinque frammenti da incollare in console. Ora girano dentro
`test_coerenza_dati.js` sezioni 8-12 a ogni passata. Tre delle quattro attese
sbagliate della tabella di sopra sono uscite proprio da quello spostamento: una
spazzata che gira solo quando qualcuno se la ricorda misura il database del
giorno in cui l'ha incollata, non quello di oggi.

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

<!-- @versione 2026-10-28.6 | PIANO_COLLAUDO_N5.md | proprieta`: chat TEST -->

# Piano di collaudo — Calcolatore Infinity N5 (revisione 54)

Bozza scritta dalla chat MOTORE il 15 ottobre, su richiesta di Paolo, da far
adottare a TEST. Segue il motore **2026-10-15.1**, `motore_core.js`,
`ordine_attacco_bs.js`, `ordine_attacco_guidato.js`,
`ordine_attacco_intuitivo.js` e `ordine_fuoco_speculativo.js` **2026-10-15.1**,
i database **2026-10-15.1** e i file di INTERFACCIA **2026-10-15.1**.

**Revisione 31** (TEST, 19 ottobre): segue il motore **2026-10-18.1** coi
moduli d'Ordine **2026-10-18.1**, il catalogo **2026-10-19.1**, `app.html` e
`logica_aro.js` **2026-10-19.1**, `calcolatore_controller.js` **2026-10-19.2**,
`calcolatore_hub.html` **2026-10-18.1** e i database **2026-10-16.2**. Cambiano
SUP-02 e SUP-04 (divise in due), ST-16 (divisa in due), DIF-10, DIF-13, ST-04,
ST-05, ST-14, GUI-03 e ORD-02; nuove ST-21, DET-07 e DET-08.

**Revisione 32** (TEST, 19 ottobre): segue `ordine_osservazione.js`
**2026-10-19.1**. Forward Observer e Triangulated Fire hanno la scheda del
bersaglio dell'Attacco BS: cambiano OSS-01 (si dichiara la Copertura, −3) e
OSS-03 (niente tasto Copertura: tolti dall'«Atteso» il bersaglio in copertura e
il MOD barrato della Copertura, il tiro "senza Abilità" passa da 1 a 4). Le
prove restano 290.

**Revisione 33** (TEST, 19 ottobre): segue i database **2026-10-19** (Nomadi
19.1, PanOceania 19.2: 745 profili) e `app.html` **2026-10-19.2**. Il #8 del
roster è **Interventor (Hacker Plus, FastPanda)**, il profilo della lista di
Infinity Army di Paolo (sua decisione): le prove dell'Interventor non cambiano.
Nuova la nota sull'import della lista (capitolo 1.1). DEP-01 riscritta: col
FastPanda il #8 piazza, e all'elenco mancavano già #4, #29 e #35. Le prove
restano 290.

**Revisione 34** (TEST, 20 ottobre): segue il motore e il catalogo
**2026-10-20.2**, `motore_core.js`, `logica_stati.js`, `ordine_movimento.js`,
`ordine_coordinato.js` **2026-10-20.1**, i database **2026-10-20.1** (745
profili; secondo profilo, moto ed Escape System) e i file di INTERFACCIA
**2026-10-20.1**. Il #18 del roster diventa **Zondnautica-A**: lo Zondmate
(REM) non si sceglie più a mano, nasce in partita con SCENDI DALLA MOTO
(cambiano A-05, CC-04 e ST-05, che lo usano); nuovi Switcher *(#40)* e Anaconda
(Heavy Machine Gun) *(#41)*, e lo Switcher entra in DEP-01 (Madtraps). Cambiano MU-05, MU-08, MU-09,
MU-11, CC-03, LOG-02, TPL-05, FT-01 e FT-02; nuove SCH-06 (Marker numerati),
ST-22 (secondo profilo), ST-23 (Transmutation WIP), LOG-04 (moto), LOG-05
(Escape System), CO-14 (Punta di Lancia) e DIF-14 (Fumo in ARO). Ogni «Atteso»
cambiato o nuovo è stato misurato sulle pagine intere prima di scriverlo.

**Revisione 35** (TEST, 20 ottobre, sera): segue il motore **2026-10-20.3**,
`ordine_movimento.js` **2026-10-20.2** e `calcolatore_controller.js`
**2026-10-20.2**. I due difetti del capitolo 31 sono corretti e diventano prove:
TPL-10 (Sagoma Diretta in ARO) e LOG-06 (la seconda metà offre solo quello che
la truppa può fare). Cambia TPL-01: sul tabellone l'attivo con la Sagoma Diretta
si legge **COLPO AUTOMATICO**, non più «Auto».

**Revisione 36** (TEST, 20 ottobre, sera): segue il motore **2026-10-20.4**. La
Schivata di chi innesca un koala o una mina (e il Reset contro una Cybermine)
sta **dentro** lo scontro della detonazione: sul tabellone c'è uno scontro solo,
non più un «TIRO DI SUPPORTO / DIFESA» a parte. Cambiano DEP-06 e DET-01,
misurate sulle pagine intere. Le prove restano 299.

**Revisione 37** (TEST, 23 ottobre): segue il motore **2026-10-23.2**,
`calcolatore_math.js` e `ordine_attacco_bs.js` **2026-10-23.1**,
`ordine_supporto.js`, `ordine_attacco_intuitivo.js` e
`ordine_fuoco_speculativo.js` **2026-10-22.1**, e le pagine di INTERFACCIA
**2026-10-23.1**. La Sagoma d'Impatto su più bersagli è **un** tiro coi MOD del
Principale, in **un** riquadro del tabellone (nuova TPL-11, cambia TPL-06).
SPEC-06 è riscritta: col Pitcher c'è il solo **PUNTO SUL TAVOLO**. Cambiano
INT-01 (con un difetto aperto, cap. 31), OSS-03, SUP-02a, SUP-02b e DIF-14;
nuove DIF-15 (le Smoke dell'attivo sul punto) e LOG-07 (foto collegate). Ogni
«Atteso» cambiato o nuovo è stato misurato sulle pagine intere prima di
scriverlo. Le prove passano a 302.

**Revisione 38** (TEST, 23 ottobre, mattina): segue il motore **2026-10-23.3** e
`ordine_attacco_intuitivo.js` **2026-10-23.1**. Il difetto di INT-01 è
corretto: dopo la Schivata del Croc Man l'invio parte (F2F 14 contro 12,
misurato sulle pagine intere). Sul tabellone il lato del punto dice *«Punto del
tavolo: non è una truppa, non reagisce e non subisce danno.»* (SPEC-06,
DIF-15). Le prove restano 302.

**Revisione 39** (TEST, 23 ottobre, mattina): segue `calcolatore_controller.js`
**2026-10-23.2**. Sul tabellone il punto del tavolo è una cella neutra,
*«📍 PUNTO SUL TAVOLO — Non è una truppa: non reagisce e non subisce danno.»*,
senza fazione, senza reazione e senza la riga delle salvezze. Cambiano SPEC-06 e
DIF-15, misurate sulle pagine intere; si chiude la voce del cap. 31. Le prove
restano 302.

**Revisione 40** (TEST, 23 ottobre, pomeriggio): segue il motore
**2026-10-23.7**, `motore_core.js` **2026-10-23.1**, `ordine_attacco_bs.js`
**2026-10-23.3**, `logica_aro.js` e `app.html` **2026-10-23.2**. Chi è in Hidden
Deployment reagisce in ARO e si rivela (AR-10 riscritta); la Sorpresa vale anche
da Hidden e da CAMO, perché conta lo stato a inizio Ordine (nuova BS-28). Il
Coordinato attacca UN bersaglio (CO-01, E60 ed E61); un membro di un Fireteam
non partecipa (CO-03 riscritta: E49, e si chiude la voce del cap. 31); CO-09 con
una lista salvata senza `chars`; CO-10 è l'Idle del solo gregario. TER-06 e TER-07
riscritte: la seconda era sbagliata, la Saturazione si applica dopo la divisione
dei dadi. Ogni «Atteso» cambiato o nuovo è misurato sulle pagine intere. Le
prove passano a 303.

**Revisione 41** (TEST, 23 ottobre, sera): segue il motore **2026-10-23.8** e
`ordine_attacco_bs.js` **2026-10-23.4**. Nel Coordinato il bersaglio è uno già
nella scelta: il secondo tocco sostituisce il primo, e l'allarme ARO nomina solo
quello (CO-01). L'Idle del solo gregario porta l'avviso **A110**, una nota: niente
finestra *«Prima di calcolare…»* (CO-10). Misurate sulle pagine intere. Le prove
restano 303.

**Revisione 42** (TEST, 26 ottobre): segue il motore **2026-10-26.3**, il
catalogo, `motore_core.js`, `ordine_movimento.js`, `ordine_piazzamento.js`,
`ordine_difesa.js`, `logica_stati.js`, `ordine_fuoco_speculativo.js` e
`ordine_attacco_intuitivo.js` **2026-10-26.1**, `calcolatore_math.js` e
`ordine_attacco_bs.js` **2026-10-26.2**, e i file di INTERFACCIA del 26 ottobre.
Il roster dei Nomadi passa a 46: Bashi Bazouk (BS Attack (AP)) *(#42)*, Salyut
(Deactivator, Repeater) *(#43)*, Gator (TAG) *(#44)*, Gator Pilot (CC Attack
[+9]) *(#45)*, Knauf (Surprise Attack (-3), Decoy (1)) *(#46)*. Le risposte di
REGOLE entrano nelle prove: DEP-07 (la mina scatta anche contro un Marker), DEP-08
(il Repeater si piazza senza domande), DEP-09 (la Disco Ball si spara con un
Attacco BS Targetless); il pilota del Gator sta a bordo come quello della moto
(regola della casa di Paolo, LOG-08). Riscritte DEP-01 (il Gator Pilot piazza le D-Charges), DEP-02 (la domanda è doppia),
DEP-10, DEP-11 (il Deactivator vede i segnalini del roster), LOG-05 (SCENDI DAL
TAG dal menu), SCH-06 (le immagini nella cartella dell'esercito, la mina in CAMO),
DIS-02, DIS-05, SP-07, SG-07, SG-09 (le Sagome a lettere) e TPL-06. Nuove BS-29
(E62), BS-30 (le mine non si sparano), DIS-07 (Reload), DIS-08 (ricarica
dall'Hub), DIS-09 (gli usi dentro il bottone), LOG-08 (pilota di lista), ST-24
(Holoecho e HoloMask nell'editor), SCH-07 (repliche) e SCH-08 (HoloMask sul
tabellone). Tre difetti nuovi nel capitolo 31. Ogni «Atteso» cambiato o nuovo è
misurato sulle pagine intere. Le prove passano a 312.

**Revisione 43** (TEST, 27 ottobre): segue il motore e `ordine_attacco_bs.js`
**2026-10-27.1**. Chiusi tre difetti del capitolo 31: sotto il secondario di una
Sagoma d'Impatto il tabellone dice che il Critico conta come successo normale
(TPL-06); le repliche hanno un identificativo della stessa forma della vera e
non escono più con la vera sempre prima (SCH-07); il Disco Baller chiede se il
tiro è riuscito e fa nascere la Disco Ball, e il tabellone nomina la Sagoma di
Eclipse (DEP-09). Due difetti nuovi e una domanda nel capitolo 31. Il tetto
sugli usi residui in ARO non ha una prova al tavolo (nessun profilo vero ha
un'arma Disposable a Burst 2 e Total Reaction): lo tiene il banco (capitolo
30). Le prove restano 312.

**Revisione 44** (TEST, 27 ottobre, mattina): segue il motore **2026-10-27.2**.
Chiusi i due difetti della revisione 43: il numero in fondo all'identificativo
delle repliche pesca nello stesso intervallo della lista, e la vera non si
riconosce più (SCH-07); all'Hub il reattivo con l'arma esaurita porta la nota
dello Scarico (banco). Resta la domanda a REGOLE sul (+1B) dell'arma in ARO con
Total Reaction. Le prove restano 312.

**Revisione 45** (TEST, 27 ottobre, sera): segue il motore **2026-10-27.3**,
`motore_core.js` e `logica_aro.js` **2026-10-27.1**. REGOLE ha risposto: col
Total Reaction (o Neurocinetics) il (+1B) dell'**arma** vale anche in ARO
(righe 10227-10228), e il Burst pieno è **opzionale**: la pagina dell'ARO offre
*«BURST PIENO (B n)»* e *«B1»*. L'**abilità** *BS Attack (+1B)* in ARO resta
fuori. Il roster dei Nomadi passa a 47: Reaktion Zond (Thunderbolt) *(#47)*,
il solo profilo vero con Total Reaction e un'arma (+1B). Nuova BS-16b; BS-16 e
BS-17 dicono la scelta del Burst. Chiusa la domanda del capitolo 31, aperto un
difetto nuovo (a un uso residuo la scelta c'è lo stesso). Le prove passano a 313.

**Revisione 46** (TEST, 27 ottobre, sera): segue il motore **2026-10-27.4**.
Chiuso il difetto della revisione 45: il tetto degli usi vale anche per la
scelta del Burst. A un uso residuo la pagina dell'ARO non offre più *«BURST
PIENO (B2)»* e *«B1»*: c'è solo B1, con *«Burst limitato agli usi residui: 1 su
2»* (banco). Le prove restano 313.

**Revisione 47** (TEST, 27 ottobre, sera): segue il motore **2026-10-27.5** e
il catalogo **2026-10-27.1**, con `app.html` **2026-10-27.1**, `logica_aro.js`
**2026-10-27.2** e `roster_manager.js` **2026-10-27.1**. Chi è in Hidden
Deployment ha nella **propria** app, accanto al nome, l'etichetta *«HIDDEN»*
con l'icona del suo esercito (`img/<esercito>/icon_hidden.png`, poi la copia
comune, poi 🫥); senza numero. L'avversario e l'Hub continuano a non riceverlo.
SCH-01 lo dice. Le prove restano 313.

**Revisione 48** (TEST, 27 ottobre, sera): segue il motore **2026-10-27.9**,
con `roster_manager.js` **2026-10-27.3** e `app.html` **2026-10-27.2**. Tutte
le scelte di schieramento oltre a NORMALE (CAMO col MOD del Mimetismo,
IMPERSONATION, FOXHOLE, SEED, SCHIERAMENTO AEREO, HIDDEN DEPLOYMENT) le decide
il motore (`M.opzioniSchieramento`), nello stesso ordine; il Camouflage (1 Use)
già usato spegne la voce CAMO con la nota della FAQ F07. Nuova **SCH-09**. Le
prove passano a 314.

**Revisione 49** (TEST, 28 ottobre): segue il motore e i moduli d'Ordine
**2026-10-28.1**, `motore_core.js` **2026-10-28.1**, con `app.html`,
`roster_manager.js` e `scegli_fazione.html` **2026-10-28.1** e `logica_aro.js`
**2026-10-28.2**. Le spiegazioni (perché un'arma, una reazione o un bersaglio
non si possono usare, le note dei MOD, le regole) non stanno più a schermo:
stanno nella **ⓘ** della schermata, o sotto il loro tasto con l'opzione *SOTTO
I TASTI* (quarta convenzione). Le intestazioni degli Ordini non hanno più
l'icona davanti. Il bottone dell'arma ha le fasce su una **scala comune di
96"**, la barra della scheda un numero per **confine**. Col Total Reaction la
reazione è **sempre al Burst pieno**: i tasti *BURST PIENO / B1* sono tolti
(Paolo, BS-16 B). Chi è in Hidden Deployment non ha più la scritta *HIDDEN*: il
suo segnalino sta, grande, fra le icone degli stati. Riscritte BS-16, BS-16b,
BS-30, DET-06, SCH-01 e SCH-09; nuova **BS-31**. Le prove passano a 315.

**Revisione 50** (TEST, 28 ottobre): segue il motore **2026-10-28.3** e
`ordine_attacco_bs.js` **2026-10-28.2** (D07 del collaudo grafico). Con un'arma
a Sagoma che fa **due o più Sagome a lettere** la domanda *«un tuo alleato
sotto la Sagoma»* è **una sola**, in cima, con un tasto per lettera; parte
accesa sulle lettere dei bersagli Ingaggiati, e annulla solo le Sagome accese.
Nel Coordinato la risposta si azzera per il partecipante successivo. Nel
bottone dell'arma la fascia a MOD 0 è **azzurra**, le altre hanno i colori
della barra della scheda, col numero nero. Riscritti l'inizio del capitolo 29 e
**SG-09**. Le prove restano 315.

**Revisione 51** (TEST, 28 ottobre): segue lo snellimento dei moduli di MOTORE:
`ordine_attacco_bs.js` **2026-10-28.3**, gli altri `ordine_*.js`
**2026-10-28.2**, `ordine_coordinato.js` e `logica_stati.js` **2026-10-28.1**.
Nei moduli i caratteri vengono dalla scala di `app.html` (`--fs-xs` 12 …
`--fs-xxl` 42), il verde *SÌ* e il giallo *attenzione* da `M.stileColore`: a
schermo le misure possono cambiare di un px o due, i colori no. Nessun Atteso
cambia; riga nuova nel capitolo 30. Le prove restano 315.

**Revisione 52** (TEST, 28 ottobre): segue il motore **2026-10-28.5** coi
colori raggruppati (scelta di Paolo), `ordine_attacco_bs.js` **2026-10-28.4**,
gli altri `ordine_*.js` **2026-10-28.3**, `ordine_coordinato.js` e
`logica_stati.js` **2026-10-28.2**, `app.html` **2026-10-28.3** e
`logica_aro.js` **2026-10-28.5**. I colori di significato dei moduli vengono
dalla tavolozza del motore (`M.TAVOLOZZA`, 23 nomi); l'intestazione e i
riquadri di ogni Ordine hanno il colore della sua **categoria**, come nel menu
delle azioni: Movimenti **blu**, Abilità Brevi **verdi**, Ordini Interi
**rossi** (l'Attacco BS passa da azzurro a verde, il Fuoco Speculativo da
viola a rosso; il Fuoco di Soppressione è rosso). Nessun Atteso nomina quei
colori; riga nuova nel capitolo 30. Le prove restano 315.

**Revisione 53** (TEST, 28 ottobre): segue il motore **2026-10-28.6** e
`ordine_attacco_bs.js` **2026-10-28.5**. Il *SÌ: colpo annullato* ha un giallo
solo: la domanda a Sagoma singola (SG-03 … SG-07) e la lettera accesa della
domanda per lettera (SG-09) usano lo stesso stile «attenzione» della tavolozza
(`M.stileTavolozza`). Nessun Atteso cambia. Le prove restano 315.

**Revisione 54** (TEST, 28 ottobre): segue i quattro difetti del piano di
collaudo grafico (`PIANO_COLLAUDO_GRAFICO_N5.md` 2026-10-28.2) corretti da
MOTORE: undici `ordine_*.js` **2026-10-28.4** e il motore **2026-10-28.7** (gli
accenti nelle note). La schermata dei MOD di dodici Ordini apre con
l'intestazione comune (l'Attacco Guidato si chiama **ATTACCO GUIDATO**, la
Schivata e il Reset **SCHIVATA** e **RESET**); il Movimento Cauto è nel
**rosso** degli Ordini Interi; le etichette dei bersagli di Guidato e
Speculativo stanno nella fascia bassa della riga; nel Supporto l'alleato si
sceglie dalla riga con la foto. Nessun Atteso nomina i titoli vecchi; riga nuova
nel capitolo 30. Le prove restano 315.

Ogni prova dice **chi** agisce, **quale Ordine** dichiara, **con che cosa**,
**contro chi**, **a che distanza** (in pollici) e **cosa si deve leggere**. Dove
un dato non cambia il risultato è scelto comunque, così la prova si esegue senza
decidere niente al tavolo.

# 0. Come si legge una prova

```
CODICE — titolo
  Attivo:    unità (stato) · Ordine (1ª metà → 2ª metà)
  Con:       arma / programma
  Bersaglio: unità (stato), distanza, copertura sì/no
  ARO:       unità (stato) → reazione, arma, distanza, contro chi
  Atteso:    quello che devi leggere
```

**Le unità** si indicano col nome del profilo e il numero del roster
(*Nomadi #1*, *PanOceania #4*): il roster è nel capitolo 1.

**Le distanze** sono in pollici, nelle fasce del Weapon Chart: 0-8", 8-16",
16-24", 24-32", 32-40", 40-48" e così via. Sulla barra delle gittate della
schermata si tocca la casella della fascia indicata; sotto la barra c'è un
numero per **confine** (0, 8, 16…), sul cambio di colore. **FUORI** è l'ultima
casella della barra. Nel bottone dell'arma le fasce sono disegnate su una scala
comune fino a **96"**: la parte grigia in coda è fuori gittata.

**Quattro convenzioni** valgono per tutte le prove:
1. **Stato non scritto = Normale.**
2. **Ordine scritto con una sola azione** = si dichiara quella e basta. Per un
   Ordine in due metà la prova scrive tutte e due (*MUOVERE → ATTACCO BS*).
3. **`ARO: nessuno`** vuol dire che il reattivo tocca **NESSUN ARO**. Non basta
   che resti fermo: l'Hub aspetta la risposta prima di calcolare, e senza
   risposta lo scontro non compare.
4. **Una nota dell'app che a schermo non c'è sta nella ⓘ** (il tasto tondo in
   alto a destra), sotto il nome del suo tasto; con l'opzione *SOTTO I TASTI*
   (pagina della fazione, *OPZIONI DELLE NOTE*) sta invece sotto il tasto.
   Vale per i motivi delle esclusioni (*«… non utilizzabile»*, *«… non
   ammesso»*), le note dei MOD e le regole. Le note del **tabellone** dell'Hub
   restano dove sono.

**Il valore che si legge** sul tabellone è il **Valore di Successo**: attributo
più tutti i MOD. Si tira 1d20 e serve **uguale o meno**. La salvezza si scrive
**ARM VS 8 ×1**: ARM (o BTS, o PH) più il PS dell'arma, un dado.

**Il conteggio.** Il piano contiene **315 prove, tutte nello stesso formato**:
tutte e 315, nelle stesse cinque righe; le convenzioni servono a non scrivere
la stessa riga 315 volte. I codici sono uno per prova: alla revisione 49 sono 315.
Prove con un campo da completare: 0 prove su 315
Il numero lo controlla `test_piano_schieramento.js`: non si cambia a mano.

**Se un numero non torna**, guarda prima la scheda ufficiale della miniatura e
il roster di prova, poi segnala: codice della prova, unità e stato, cosa hai
letto, cosa ti aspettavi.

---

# 1. Preparazione

## 1.1 Roster

**Nomadi**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Alguacil (Combi Rifle) | BS base, gittate, reattivo di riferimento (PH 10, WIP 13) |
| 2 | Alguacil (HMG) | Burst 4, Coordinato |
| 3 | Alguacil (Missile Launcher) | Sagoma d'Impatto, EXP |
| 4 | Alguacil (Forward Observer) | Flash Pulse, Stato Bersagliato |
| 5 | Alguacil (Paramedic) | MediKit |
| 6 | Daktari (Doctor) | Dottore |
| 7 | Clockmaker (Engineer) | Ingegnere, GizmoKit(+1B) |
| 8 | Interventor (Hacker Plus, FastPanda) | Carbonite, Oblivion, Spotlight, Total Control, Cybermask, FastPanda |
| 9 | Zero (Hacker, Killer Hacking Device) | Trinity, Camo, Shock Mine |
| 10 | Intruder (MULTI Sniper Rifle) | MSV L2, `MULTI Sniper Rifle (+1SD)` |
| 11 | Grenzer (Marksmanship) | Marksmanship, MULTI Sniper Rifle |
| 12 | Grenzer (Forward Observer, Sensor, NCO) | MSV L1, Forward Observer, Sensor, Light Flamethrower(+1B) |
| 13 | Morlock (Assault Pistol) | Martial Arts L2, Chain Rifle, Smoke Grenades |
| 14 | Chimera | Natural Born Warrior, CC Attack (-3), Nanopulser |
| 15 | Reaktion Zond (HMG) | Total Reaction, REM, PARA CC Weapon |
| 16 | Mobile Brigada (HMG) | HI, ARM 5 |
| 17 | Puppetbot (Red Fury) | BS Attack (+1B), Dodge (+3) |
| 18 | Zondnautica-A | AI Motorcycle: SCENDI / RISALI. Smontata, la moto è lo **Zondmate (REM)**: PARA CC Weapon(-3), Periferica |
| 19 | Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle) | CrazyKoalas, D-Charges, Camouflage (1 Use) |
| 20 | Sin-Eater (MULTI Sniper Rifle) | Neurocinetics |
| 21 | Mary Problems (Hacker) | Pitcher, Zapper, upgrade di hacking, Climbing Plus |
| 22 | Puppet Masters (Minelayer) | Minelayer, Shock Mine |
| 23 | Kulak (Hacker, Killer Hacking Device) | Disco Baller, Cybermine |
| 24 | Intruder (HMG) | MSV L2, Camouflage, Heavy Machine Gun |
| 25 | Intruder (Hacker, Killer Hacking Device) | Grenades (Fuoco Speculativo), Pulzar(+1B), AP Submachine Gun |
| 26 | Wolfgang Amadeus | Berserk, Martial Arts L3 |
| 27 | Warcor (Sixth Sense) | Sesto Senso |
| 28 | Vertigo Zond (Missile Launcher) | BS Attack (Guided) |
| 29 | Spector (Parachutist, Combat Jump) | Schieramento Aereo, `Drop Bears (+1SD)` |
| 30 | Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust) | `Panzerfaust (+1B)` |
| 31 | Krakot Renegade (Boarding Shotgun) | Chest Mine |
| 32 | Bambabot-1 (Chain Rifle (ps=6)) | Mine Dispenser (AP) |
| 33 | Saito Togan (T2 Boarding Shotgun) | munizione T2 |
| 34 | Go-Pod (MULTI Rifle) | E/Mitter |
| 35 | Racerbot Mk-I (Adhesive Launcher Rifle) | Adhesive Launcher Rifle |
| 36 | Morlock (Kobra Pistol, DA CC) | Kobra Pistol, Irregolare |
| 37 | Hawkwood (K1 Sniper Rifle) | ARM = 0 |
| 38 | **Marspider (Grenades)** | **nuova**: Grenades senza visore (TER-06) |
| 39 | **Clockmaker (Armed Turret)** | **nuova**: Armed Turret (DEP-11) |
| 40 | **Switcher** | **nuova**: Transmutation (WIP), secondo profilo Enhanced (ST-23); Madtraps |
| 41 | **Anaconda (Heavy Machine Gun)** | **nuova**: TAG con Escape System, pilota Operator (LOG-05) |
| 42 | **Bashi Bazouk (BS Attack (AP))** | **nuova**: Holoprojector e Holomask (ST-24, SCH-07, SCH-08) |
| 43 | **Salyut (Deactivator, Repeater)** | **nuova**: Baggage (DIS-07), Deactivator (DEP-11) |
| 44 | **Gator (TAG)** | **nuova**: TAG col pilota di lista (LOG-08) |
| 45 | **Gator Pilot (CC Attack [+9])** | **nuova**: il pilota del #44, a bordo (LOG-08) |
| 46 | **Knauf (Surprise Attack (-3), Decoy (1))** | **nuova**: Decoy (1) (SCH-07) |
| 47 | **Reaktion Zond (Thunderbolt)** | **nuova**: Total Reaction con un'arma (+1B), Thunderbolt(+1B) (BS-16b) |

**PanOceania**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Fusilier (Combi Rifle) | bersaglio di riferimento (ARM 1, BTS 0, PH 10, BS 12) |
| 2 | Fusilier (Missile Launcher) | secondo bersaglio, ARO con arma pesante |
| 3 | Fusilier (Forward Observer) | Flash Pulse in ARO |
| 4 | Orc (Hacker, Hacking Device) | hackerabile, ARM 4, BTS 3, PH 14, MULTI Rifle |
| 5 | Nisse (Heavy Machine Gun) | Mimetismo -3, ARM 3 |
| 6 | Croc Man (MULTI Sniper Rifle) | Camo, Mimetismo -6, X Visor, Hidden Deployment |
| 7 | Teutonic Knight (TinBot: Firewall) | Firewall -3, Martial Arts L2, Panzerfaust |
| 8 | Tikbalang | TAG, ECM (Guided -6) |
| 9 | Sierra Dronbot (Heavy Machine Gun) | Total Reaction in ARO |
| 10 | Zulu-Cobra (Triangulated Fire, Sensor) | Camo, Mimetismo -3, Triangulated Fire |
| 11 | Aquila | MSV L3, ECM (Hacking -3) |
| 12 | Squalo Mk-II (MULTI Marksman Rifle) | Combat Instinct, TAG |
| 13 | Machinist (Combi Rifle) | Deployable Cover, GizmoKit senza notazione |
| 14 | Dr. Harper FTO | No Cover, No Wound Incapacitation, Plasma Carbine |
| 15 | Swiss Guard (Heavy Machine Gun, Pulzar) | Mimetismo -6 |
| 16 | **Laxmee (Hacker)** | **nuova**: Fairy Dust (HK-07) |

**Importare la lista.** Il roster Nomadi si può importare dal testo di
Infinity Army (*Plain Text*): è la lista di collaudo di Paolo. Tre truppe non
ci sono e vanno aggiunte a mano dopo l'import: Spector *(#29)*, Saito Togan
*(#33)* e Hawkwood *(#37)*. Una riga che corrisponde a più profili a pari
punti l'app non la sceglie da sola: compare sotto il riquadro del testo, e il
profilo lo tocca il giocatore. **Da verificare al tavolo:** con un testo vero
di Infinity Army che contenga un Drummer da 47 pt, l'import deve riconoscere
il Drummer giusto dai Drumbot elencati sotto di lui.

**La Zondnautica è UNA unità** (20 ottobre). Nella lista di Paolo la
Zondnautica-A porta sotto di sé il pilota e la moto: l'import li legge come
parte di lei e non crea Zondnaut e Zondmate a parte. Lo stesso per i TAG con
Escape System (Anaconda, Maximus): l'Operator elencato sotto il TAG non è
un'unità a parte. Pilota e moto, o pilota e TAG vuoto, nascono in partita (LOG-04,
LOG-05). **Lo Zondmate (REM) non si può aggiungere a mano**: è un profilo
secondario. Le prove che lo usano (A-05, CC-04, ST-05) partono dalla
Zondnautica-A *(#18)* con SCENDI DALLA MOTO. Switcher *(#40)* e Anaconda (Heavy
Machine Gun) *(#41)* non sono nella lista di Paolo: si aggiungono a mano, come
Spector, Saito Togan e Hawkwood; lo stesso i #42-#46. Il Gator Pilot *(#45)* è
il pilota **di lista** del Gator *(#44)*: confermato lo schieramento parte **a
bordo**, non si schiera e non riceve Ordini (LOG-08).

## 1.2 Terreni

In schieramento: **TER_10 Bosco**, **TER_11 Giungla**, **TER_13 Foresta
Primordiale**, **TER_15 Tempesta**, **TER_17 Sala Generatori**. Senza, il blocco
T non è eseguibile.

---

# 2. Preflight — una volta, in console, su app.html

**PRE-01 — Contratto del motore**
- **Attivo:** in console `MotoreN5.autotest()`
- **Atteso:** `["contratto coerente"]`

**PRE-02 — Router**
- **Attivo:** in console `verificaRouter()`
- **Atteso:** `["router coerente col motore"]`. Un *modulo NON CARICATO* vuol dire uno `<script>` mancante in `app.html`

**PRE-03 — Dati**
- **Attivo:** in console `MotoreN5.verificaDati()`
- **Atteso:** `{ok:true, mancanti:[], firme:[]}`

**PRE-04 — Versioni**
- **Attivo:** in console `MotoreN5.verificaVersioni()`
- **Atteso:** nessun disallineamento

**PRE-05 — Dati mancanti**
- **Attivo:** in console `MotoreN5.datiMancanti()`
- **Atteso:** array vuoto

**PRE-06 — Ordini nascosti**
- **Attivo:** in console `riepilogaOrdiniNascosti()`
- **Atteso:** vuoto

**PRE-07 — Impronta**
- **Attivo:** in console `MotoreN5.improntaProgetto()`
- **Atteso:** annotala: serve per citare i file alle altre chat

**PRE-08 — Console pulita**
- **Attivo:** ricarica la pagina e guarda la console
- **Atteso:** nessun `⛔`, nessun *modulo mancante*

**PRE-09 — Immagini**
- **Attivo:** guarda la console per errori sulle immagini
- **Atteso:** nessuno. Le cartelle `img/`, `img/nomadi/`, `img/panoceania/` e `img/programmi/` stanno accanto ad `app.html`

Se PRE-01 o PRE-02 falliscono, fermati.

---

# 3. Blocco A — Ordini senza tiro e generazione ARO

**A-01 — Movimento semplice**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** nessuno
- **Atteso:** nessun calcolo, Ordine intero consumato, **ARO generato**.

**A-02 — Movimento + attacco**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** la prima metà non chiede nulla; il calcolo parte sulla seconda: **BS 14** (11 +3) **B3**, salvezza del Fusilier **ARM VS 8 ×1**.

**A-03 — Cauto: la domanda viene prima**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MOVIMENTO CAUTO
- **ARO:** nessuno
- **Atteso:** prima di rispondere non parte niente: nessun allarme, nessuna busta all'Hub. A schermo due tasti, *fuori da LoF e ZdC* e *dentro*. Rispondendo **dentro**: allarme spedito, ARO generato, una busta sola.

**A-04 — Cauto fuori da LoF e ZdC**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MOVIMENTO CAUTO, rispondendo **fuori da LoF e ZdC**; poi un secondo MOVIMENTO CAUTO
- **ARO:** nessuno
- **Atteso:** **nessun allarme**, con il motivo; la busta all'Hub parte lo stesso. Il secondo Cauto **richiede di nuovo** la risposta: non eredita quella del primo.

**A-05 — Cauto negato**
- **Attivo:** apri il menu degli Ordini di Reaktion Zond (HMG) *(Nomadi #15)*, Zondnautica-A *(Nomadi #18)* in sella, lo Zondmate (REM) nato dalla Zondnautica-A con SCENDI DALLA MOTO, e Alguacil (Combi Rifle) *(Nomadi #1)* messo **Bersagliato** dall'editor degli stati
- **Atteso:** MOVIMENTO CAUTO **non compare** per nessuno dei quattro (REM; Motorcycle; AI Motorcycle; Bersagliato). Controprova: lo Zondnaut-A a piedi **lo ha**.

**A-06 — Idle**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · IDLE
- **ARO:** nessuno
- **Atteso:** nessuna azione, ma **ARO generato**.

**A-07 — Requisito non soddisfatto → Idle**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Marker CAMO · PIAZZARE EQUIPAGGIAMENTO, rispondendo **sì** a *«c'è un Marker nemico nell'Area d'Innesco?»*
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** il tasto diventa **IDLE** giallo. Premendolo: **ARO generato**, **uso del CrazyKoala speso** (1 su 2), e il Moran **si rivela** (da Marker a Modello).

**A-08 — Salto**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · SALTO
- **ARO:** nessuno
- **Atteso:** nessun calcolo, ARO generato, **Ordine intero** consumato.

**A-09 — Climbing Plus**
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21, Climbing Plus)* · ARRAMPICARSI; poi Alguacil (Combi Rifle) *(Nomadi #1)* · ARRAMPICARSI
- **ARO:** nessuno
- **Atteso:** per Mary Problems l'arrampicata è **mezzo Ordine** e resta la seconda metà; per l'Alguacil è un **Ordine intero**.

**A-10 — Nessuna voce senza modulo**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)*: apri il menu degli Ordini e tocca ogni voce, una per una, tornando indietro ogni volta
- **Atteso:** ogni voce apre la sua schermata. Nessuna risponde *«Azione non riconosciuta»*.

**A-11 — Voci che devono mancare**
- **Attivo:** apri il menu degli Ordini di queste truppe
- **Atteso:**
  - **FUOCO DI SOPPRESSIONE** non c'è su Morlock (Assault Pistol) *(#13)*; c'è su Alguacil (Combi Rifle) *(#1)*.
  - **HACKING** c'è solo sugli hacker: Interventor *(#8)* sì, Alguacil *(#1)* no. Mary Problems *(#21)*, con due dispositivi, vede Trinity, Carbonite, Oblivion, Spotlight e Total Control.
  - **SUPPORTO (MED / ING)** c'è su Daktari *(#6)*, Alguacil (Paramedic) *(#5)* e Clockmaker *(#7)*; non su Alguacil (Combi Rifle) *(#1)*.
  - **PIAZZARE EQUIPAGGIAMENTO** c'è su Moran *(#19)*, Zero *(#9)*, Puppet Masters *(#22)* e Kulak *(#23)*; non su Krakot *(#31)* né su Bambabot-1 *(#32)*.

**A-12 — Io muovo, tu mi spari**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro l'Alguacil
- **Atteso:** **TIRO NORMALE**, un solo scontro. Il Fusilier tira **15** con **un dado**, l'Alguacil non oppone niente e, se colpito, fa **ARM VS 8 ×1**. Il Fusilier compare sotto **PanOceania**.

**A-13 — Lo stesso con gli altri Ordini senza tiro**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · tre Ordini, uno alla volta: MOVIMENTO CAUTO (risposta *dentro*), SALTO, IDLE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro l'Alguacil
- **Atteso:** in tutti e tre l'avversario riceve l'allarme e il tiro del Fusilier compare (**15**, B1).

**A-14 — Ordine Intero: dopo l'ARO si va al calcolo da soli** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO; poi Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Grenades; Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8"; per l'Intuitivo Zulu-Cobra *(PanOceania #10)* in Camo
- **ARO:** nessuno
- **Atteso:** dopo la conferma dei bersagli compare *IN ATTESA DI ARO*. Appena il reattivo tocca NESSUN ARO l'app passa **da sola** alla pagina del calcolo. Il tasto *«ABILITÀ LUNGA DICHIARATA (Procedi al calcolo)»* **non compare**. Controprova: con MUOVERE → … dopo l'ARO si sceglie ancora la seconda metà.

---

# 4. Blocco B — Attacco BS

**BS-01 — Faccia a Faccia**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, a 0-8", contro l'Alguacil
- **Atteso:** **un solo scontro**, FACCIA A FACCIA. Attivo **14** B3, reattivo **15** B1. Salvezza Fusilier **ARM VS 8 ×1**; salvezza Alguacil **ARM VS 8 ×1**. Due scontri con due Tiri Normali sono un difetto.

**BS-02 — Reagisce chi non è bersaglio**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** il Fusilier #1 tocca NESSUN ARO; Fusilier (Missile Launcher) *(PanOceania #2)*, che **non** è bersaglio, → ATTACCO BS, Missile Launcher (Hit Mode), a 0-8", contro l'Alguacil
- **Atteso:** **due scontri**, tutti e due **TIRO NORMALE**. Alguacil contro Fusilier #1: **14** B3, salvezza **ARM VS 8 ×1**. Fusilier ML contro Alguacil: **9** B1 (12 −3), salvezza dell'Alguacil **ARM VS 6 ×3**, con la nota *«reagisce senza essere bersaglio dell'attacco: il suo è un Tiro Normale a sé»*.

**BS-03 — Gittata negativa e copertura, contro Schivata**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 16-24", **in copertura**
- **ARO:** Fusilier → SCHIVATA
- **Atteso:** F2F. Attivo **5** (11 −3 −3) B3, reattivo **PH 10** B1. Salvezza Fusilier **ARM VS 11 ×1**.

**BS-04 — Mimetismo senza visore**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra (Triangulated Fire, Sensor) *(PanOceania #10)*, **schierato come Modello** (non in Camo), a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** **11** (11 +3 −3 di Mimetismo).

**BS-05 — MSV L1 contro Mimetismo −3**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, MSV L1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra *(PanOceania #10)* come Modello, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** **16** (13 +3), con la nota che il visore annulla il Mimetismo.

**BS-06 — Mimetismo −6 e copertura**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*, **schierato come Modello**, a 8-16", **in copertura**
- **ARO:** nessuno
- **Atteso:** **5** (11 +3 −3 −6), salvezza **ARM VS 11 ×1**. Controprova: col Croc Man schierato come Marker CAMO l'Attacco BS è rifiutato e l'avviso dice *«va Scoperto prima, oppure usa un Attacco Intuitivo»*.

**BS-07 — MSV L2 annulla il Mimetismo −6**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Croc Man *(PanOceania #6)* come Modello, a 16-24", **in copertura**
- **ARO:** nessuno
- **Atteso:** **13** (13 +3 −3) B4, con la nota *«Multispectral Visor L2+: il Mimetismo (−6) non si applica»*.

**BS-08 — X Visor su una fascia negativa**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6, BS 12, X Visor)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione **AP** (B2)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** la voce della gittata **non compare**, totale **12**.

**BS-09 — L'X Visor toglie il malus, non crea un bonus**
- **Attivo:** Croc Man *(PanOceania #6)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 48-56", senza copertura; poi a 24-32"
- **Atteso:** a 48-56" **12**, non 15; a 24-32" **15** (+3 vero).

**BS-10 — Senza X Visor la stessa fascia vale −3**
- **Attivo:** Nisse (Heavy Machine Gun) *(PanOceania #5, BS 13)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** voce *«Gittata: −3»*, totale **10**.

**BS-11 — Marksmanship ignora la copertura**
- **Attivo:** Grenzer (Marksmanship) *(Nomadi #11)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 24-32", **in copertura**
- **ARO:** nessuno
- **Atteso:** **16** (13 +3), con la nota del Marksmanship. La salvezza resta **ARM VS 9 ×1**: la copertura vale sull'ARM.

**BS-12 — Stato Bersagliato**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Bersagliato**, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** **17** (11 +3 +3).

**BS-13 — Bersaglio in Soppressione entro 24"**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **in Soppressione**, a 0-8", senza copertura
- **ARO:** Fusilier → ATTACCO BS, Combi Rifle, a 0-8", contro l'Alguacil
- **Atteso:** attivo **11** (11 +3 −3 della Soppressione). Il Fusilier reagisce col profilo **Combi Rifle (SF Mode)**: Burst **3**, fasce 0 / 0 / −3, gittata massima 24", avviso **A98**. Burst 1 è un difetto.

**BS-14 — Soppressione oltre le 24"**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier *(PanOceania #1)*, in Soppressione, a 24-32", senza copertura
- **ARO:** nessuno
- **Atteso:** **8** (11 −3 di gittata); il −3 della Soppressione **non** c'è.

**BS-15 — Attaccante Stordito**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, **Stordito** · apri il menu degli Ordini
- **Atteso:** ATTACCO BS **non compare**. Controprova: senza lo stato compare.

**BS-16 — Total Reaction**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** Sierra Dronbot (Heavy Machine Gun) *(PanOceania #9)* → ATTACCO BS, Heavy Machine Gun, a 8-16", contro l'Alguacil
- **Atteso:** dopo la scelta dell'arma **nessun tasto del Burst**: la reazione è sempre al pieno (Paolo, 27 ottobre: il pieno è opzionale, riga 10224, ma nessuno sceglie B1). Burst **4**; nella ⓘ, alla voce *Burst*, *«In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell'arma in ARO (B4)»*; sul tabellone **4** dadi.

**BS-16b — Total Reaction col (+1B) dell'arma**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE → MUOVERE
- **ARO:** Reaktion Zond (Thunderbolt) *(Nomadi #47)* → ATTACCO BS, Thunderbolt(+1B), a 8-16", contro il Fusilier
- **Atteso:** nessun tasto del Burst: sempre al pieno, Burst **3**; nella ⓘ, alla voce *Burst*, una riga sola: *«In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell'arma in ARO (B2) · Thunderbolt (+1B): +1 Burst anche in ARO (Total Reaction, righe 10227-10228)»*; sul tabellone **3** dadi. Se leggi **2** dadi, è tornata la lettura ritirata il 27 ottobre (il (+1B) dell'arma che in ARO non entra).

**BS-17 — L'abilità BS Attack (+1B) non vale in ARO**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE → MUOVERE
- **ARO:** Puppetbot (Red Fury) *(Nomadi #17)* → ATTACCO BS, Red Fury, a 8-16", contro il Fusilier
- **Atteso:** Burst **1**, con la sola voce *«In Turno Reattivo il Burst è 1»*, e nessuna scelta del Burst (il Puppetbot non ha Total Reaction). Il (+1B) qui è un'**abilità**, non l'arma: in ARO non vale mai (BS-16b è l'altro caso).

**BS-18 — Il (+1B) vale in attivo**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)* · ATTACCO BS
- **Con:** Red Fury
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** Burst **5** (4 +1), con le voci *«Burst dell'arma Red Fury»* e *«BS Attack (+1B): +1 Burst in Turno Attivo»*. Tiro **15**.

**BS-19 — Burst su due bersagli**
- **Attivo:** Alguacil (HMG) *(Nomadi #2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* con **2** dadi e Orc (Hacker, Hacking Device) *(PanOceania #4)* con **2** dadi, tutti e due a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** due scontri, 2 + 2 dadi. Salvezze: Fusilier **ARM VS 6**, Orc **ARM VS 9**.

**BS-20 — ARM alto**
- **Attivo:** Mobile Brigada (HMG) *(Nomadi #16)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, a 0-8", senza copertura
- **ARO:** Orc → ATTACCO BS, MULTI Rifle munizione AP, a 0-8", contro la Mobile Brigada
- **Atteso:** F2F. Attivo **10** (13 −3) B4, reattivo **17** (14 +3) B1. Salvezza Orc **ARM VS 9 ×1**, salvezza Mobile Brigada **ARM VS 10 ×1**.

**BS-21 — Tiro dentro una mischia**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Ingaggiato**, a 16-24", senza copertura. Alla domanda *«quanti TUOI alleati in quella mischia»* tocca **1**
- **ARO:** nessuno
- **Atteso:** **10** (13 +3 −6), voci *«Gittata: +3»* e *«Tiro dentro una mischia: −6»*.

**BS-22 — Il tetto dei MOD**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Swiss Guard (Heavy Machine Gun, Pulzar) *(PanOceania #15)*, come Modello, a 32-40", **in copertura**
- **ARO:** nessuno
- **Atteso:** gittata −6, copertura −3, Mimetismo −6, più la voce *«MOD minimo −12»* (+3): **MOD −12**, Valore −1, **fallimento automatico**. Variante a 16-24": −3 −3 −6 = −12 esatti, fallimento automatico, **senza** la voce del tetto.

**BS-23 — No Cover**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Dr. Harper FTO *(PanOceania #14)*, a 0-8", dichiarato **in copertura**
- **ARO:** nessuno
- **Atteso:** niente −3 al tiro, niente +3 all'ARM: tiro **14**, salvezza **ARM VS 8 ×1**.

**BS-24 — Limited Cover**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, Limited Cover)*, a 0-8", **in copertura**
- **ARO:** nessuno
- **Atteso:** cade il −3 al tiro, resta il +3 all'ARM: tiro **14**, salvezza **ARM VS 13 ×1** (ARM 3 +3 +7).

**BS-25 — Combat Instinct**
- **Attivo:** Intruder (HMG) *(Nomadi #24)*, schierato come Marker CAMO · ATTACCO BS (si rivela attaccando)
- **Con:** Heavy Machine Gun
- **Bersaglio:** Squalo Mk-II (MULTI Marksman Rifle) *(PanOceania #12)*, a 16-24", senza copertura
- **ARO:** Squalo → ATTACCO BS, MULTI Marksman Rifle munizione AP, a 16-24", contro l'Intruder
- **Atteso:** lo Squalo tira **15** (15 +3 −3), con **due** voci soltanto: *«Gittata: +3»* e *«Mimetismo del bersaglio: −3»*. Il −3 dell'Attacco a Sorpresa **non** c'è.

**BS-26 — Neurocinetics**
- **Attivo:** Sin-Eater (MULTI Sniper Rifle) *(Nomadi #20)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** in attivo Burst **1**, con la voce *«Neurocinetics: Burst 1 in Turno Attivo»*. Poi a parti invertite (Fusilier #1 · MUOVERE → MUOVERE, Sin-Eater in ARO con la stessa arma a 16-24"): Burst **2**, con la voce *«Neurocinetics: Burst pieno dell'arma in ARO»*.

**BS-27 — Un bottone per arma, la modalità nella tendina** *(nuova)*
- **Attivo:** Grenzer (Marksmanship) *(Nomadi #11)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 24-32", senza copertura
- **ARO:** nessuno
- **Atteso:** nella scelta dell'arma c'è **un solo** bottone MULTI Sniper Rifle. Nella pagina della gittata la tendina accanto al bersaglio offre *«Munizioni: AP · B2»*, *«Munizioni: SHOCK · B2»* e *«Munizioni: DA · B2»*. Scegliendo DA i dadi si riassegnano e la salvezza diventa **ARM VS 6 ×2**.
- **Lo stesso per le armi a Sagoma e a gittata:** Alguacil (Missile Launcher) *(Nomadi #3)* ha **un** bottone Missile Launcher; la tendina offre *«Munizioni: EXP · B1 · Sagoma d'Impatto»* e *«Munizioni: AP+EXP · B1»*, e tutte e due hanno la barra delle gittate.

**BS-28 — Attacco a Sorpresa da Hidden e da CAMO** *(nuova)*
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* in **Hidden Deployment** · ATTACCO BS (si rivela dichiarandolo)
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 8-16", senza copertura
- **ARO:** Alguacil → ATTACCO BS, Combi Rifle, a 8-16", contro il Croc Man
- **Atteso:** **TIRO FACCIA A FACCIA**. Croc Man **12** B2. L'Alguacil tira **5** (11 +3 −6 Mimetismo −3), con la voce *«Attacco a Sorpresa: -3»*: la Sorpresa guarda lo stato a **inizio** Ordine, anche se la dichiarazione ha già rivelato la truppa (righe 10125-10128). Lo stesso con il Croc Man schierato come **Marker CAMO**: 5. Controprova: un secondo ATTACCO BS nell'Ordine dopo, col Croc Man già rivelato, dà **8** e nessuna voce di Sorpresa.

**BS-29 — Schieramento Aereo: prima l'INGRESSO IN CAMPO** *(nuova)*
- **Attivo:** Spector (Parachutist, Combat Jump) *(Nomadi #29)* in **Schieramento Aereo** · ATTACCO BS
- **Con:** Boarding Shotgun (+1B)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*
- **ARO:** nessuno
- **Atteso:** il menu offre anche INGRESSO IN CAMPO. L'ATTACCO BS si ferma all'invio: *«⛔ INVIO BLOCCATO… Spec non è ancora sul tavolo (Schieramento Aereo).»* e *«Prima dichiara INGRESSO IN CAMPO (Combat Jump / Parachutist): solo dopo può attaccare o agire.»* (E62). Prima arrivava all'Hub come *ATTACCANTE NON TROVATO*. Controprova: lo Spector già sul tavolo attacca e l'Hub risolve.

**BS-30 — Le mine non si sparano** *(nuova)*
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, rivelato · ATTACCO BS
- **Atteso:** le armi sono Combi Rifle e Pistol. La Shock Mine non è a schermo: nella ⓘ, *«SHOCK MINE NON UTILIZZABILE»*, *«si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara»*. Controprova: in PIAZZARE EQUIPAGGIAMENTO la Shock Mine c'è.

**BS-31 — Il bottone dell'arma, la barra della scheda e la ⓘ** *(nuova)*
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7)* · ATTACCO BS, si guarda la schermata delle armi e si tocca **ANNULLA ORDINE**; poi, Ordine nuovo, Alguacil (Combi Rifle) *(#1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 16-24", copertura no
- **ARO:** nessuno
- **Atteso:** l'intestazione dice **ATTACCO BS**, senza l'icona davanti. Nel bottone del Combi Rifle (del Clockmaker e poi dell'Alguacil) tre fasce, **0-16 +3**, **16-32 −3**, **32-48 −6**, larghe un sesto della scala ciascuna, e in coda la parte grigia **fuori gittata** fino a 96". Il GizmoKit e il Deactivator non sono fra le armi: nella ⓘ *«GIZMOKIT NON UTILIZZABILE — si usa solo con la sua azione (SUPPORTO)»* e *«DEACTIVATOR NON UTILIZZABILE — si usa solo con la sua azione (DEACTIVATOR)»*. Ordine nuovo con l'Alguacil: nella ⓘ della schermata delle armi non resta niente del GizmoKit (le note sono dell'Ordine). Nella scheda del bersaglio la barra ha **sei** caselle (+3 +3 −3 −3 −6 −6) e **FUORI**; sotto, i numeri **0 8 16 24 32 40 48**, uno per confine. Tocca la terza casella (16-24"): sul tabellone l'Alguacil **8** (11 −3).

---

# 5. Blocco C — Munizioni e Tiri Salvezza

Bersagli di riferimento: **Fusilier (Combi Rifle)** *(PanOceania #1: ARM 1, BTS
0, PH 10)* e **Orc (Hacker, Hacking Device)** *(PanOceania #4: ARM 4, BTS 3, PH
14)*. Per ogni prova si fa un ATTACCO BS sul Fusilier e poi uno sull'Orc, a
**0-8"**, **senza copertura**, `ARO: nessuno`, salvo dove scritto.

**MU-01 — Combi Rifle (N)**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle, munizione N
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 11 ×1**. Un Critico aggiunge una salvezza.

**MU-02 — AP Submachine Gun (AP)**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · ATTACCO BS
- **Con:** AP Submachine Gun, munizione AP
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 9 ×1** (ARM dimezzato).

**MU-03 — Missile Launcher, Sagoma d'Impatto (EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: EXP · B1 · Sagoma d'Impatto»*
- **Atteso:** Fusilier **ARM VS 7 ×3**; Orc **ARM VS 10 ×3**.

**MU-04 — Missile Launcher, colpo diretto (AP+EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: AP+EXP · B1»*
- **Atteso:** Fusilier **ARM VS 7 ×3**; Orc **ARM VS 8 ×3** (dimezza e tre tiri).

**MU-05 — Red Fury (SHOCK)**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)* · ATTACCO BS
- **Con:** Red Fury, munizione SHOCK
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 11 ×1**. Nella salvezza la nota *«SHOCK: una truppa a VITA 1 che diventa Incosciente passa direttamente a Morto (niente Dogged, No Wound Incapacitation, Shasvastii).»* Solo contro bersagli con VITA: contro un TAG (STR) la nota non c'è.

**MU-06 — DA CC Weapon (DA)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* · ATTACCO CC
- **Con:** DA CC Weapon(PS=5)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, ARM 1)*, poi Mobile Brigada (HMG) *(Nomadi #16, ARM 5)*
- **Atteso:** Alguacil **ARM VS 6 ×2**; Mobile Brigada **ARM VS 10 ×2**.

**MU-07 — T2 Boarding Shotgun (T2)**
- **Attivo:** Saito Togan (T2 Boarding Shotgun) *(Nomadi #33)* · ATTACCO BS
- **Con:** T2 Boarding Shotgun, munizione T2
- **Atteso:** Fusilier **ARM VS 7 ×1**; Orc **ARM VS 10 ×1**. Ogni salvezza fallita = **2 Ferite**.

**MU-08 — E/Mitter (E/M)**
- **Attivo:** Go-Pod (MULTI Rifle) *(Nomadi #34)* · ATTACCO BS
- **Con:** E/Mitter, munizione E/M
- **Bersaglio:** Fusilier e Orc a **8-16"** (l'E/Mitter a 0-8" ha −3)
- **Atteso:** Fusilier **BTS VS 7 ×2**; Orc **BTS VS 9 ×2**. Nella salvezza, in rosso, **«Fallimento = Isolato»**.

**MU-09 — PARA CC Weapon (PARA)**
- **Attivo:** Reaktion Zond (HMG) *(Nomadi #15)* · ATTACCO CC
- **Con:** PARA CC Weapon(-3)
- **Atteso:** Fusilier **PH VS 4 ×1**; Orc **PH VS 8 ×1** (PH −6). Nessuna Ferita: nella salvezza, in rosso, **«Fallimento = Immobilizzato-A»**.

**MU-10 — Adhesive Launcher Rifle**
- **Attivo:** Racerbot Mk-I (Adhesive Launcher Rifle) *(Nomadi #35)* · ATTACCO BS
- **Con:** Adhesive Launcher Rifle
- **Bersaglio:** Fusilier e Orc a **8-16"**
- **Atteso:** Fusilier **PH VS 4 ×1**; Orc **PH VS 8 ×1**. Nessuna Ferita: Immobilizzato-A.

**MU-11 — Flash Pulse (STUN)**
- **Attivo:** Alguacil (Forward Observer) *(Nomadi #4)* · ATTACCO BS
- **Con:** Flash Pulse
- **Bersaglio:** Fusilier e Orc a **8-16"**
- **Atteso:** tiro su **WIP** (13 +3 = 16). Fusilier **BTS VS 7 ×1**; Orc **BTS VS 10 ×1**. Nella salvezza, in rosso, **«Fallimento = Stordito»**.

**MU-12 — Nanopulser**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO BS
- **Con:** Nanopulser
- **Atteso:** colpo automatico (Sagoma Diretta). Fusilier **BTS VS 7 ×1**; Orc **BTS VS 10 ×1**: l'arma tira su BTS.

**MU-13 — Smoke Grenades**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · FUOCO SPECULATIVO
- **Con:** Smoke Grenades
- **Bersaglio:** un punto del tavolo a 0-8" vicino al Fusilier
- **Atteso:** **nessuna** salvezza, nessuna domanda sugli alleati sotto la Sagoma.

**MU-14 — Panzerfaust (AP+EXP)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* · ATTACCO BS
- **Con:** Panzerfaust
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, poi Mobile Brigada (HMG) *(Nomadi #16)*, a 8-16"
- **Atteso:** tiro **13** B1. Alguacil **ARM VS 6 ×3**; Mobile Brigada **ARM VS 9 ×3**. Uso Disposable scalato: 1 su 2.

**MU-15 — Copertura sulla salvezza**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", **in copertura**
- **Atteso:** **ARM VS 11 ×1**.

**MU-16 — Lo Speculativo non dà il +3 di copertura alla salvezza**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", **in copertura**
- **Atteso:** tiro su **PH 9** (12 +3 −6). Salvezza **ARM VS 8 ×1**: il +3 della copertura non c'è.

**MU-17 — Munizioni N3** *(in console)*
- **Attivo:** in console, `MotoreN5.tiroSalvezza` sul Fusilier #1 con il Combi Rifle e la munizione forzata, una alla volta: VIRAL, BREAKER, K1, PLASMA, NANOTECH, ADHESIVE, FLASH, MONOFILAMENT, BIOWEAPON
- **Atteso:** per tutte e nove l'avviso **A50** *(«Munizione "X" non esiste in N5 (era N3)»)* e il calcolo non si ferma. La BREAKER ne porta due: A50 e **A53**.

**MU-18 — Munizione sconosciuta** *(in console)*
- **Attivo:** come MU-17, con la munizione **FUFFA**, poi **AP+FUFFA**
- **Atteso:** FUFFA: **A51** e **A52**, nessun numero inventato. AP+FUFFA: **A51** e **A53**.

**MU-19 — Tiro Salvezza combinato**
- **Attivo:** Dr. Harper FTO *(PanOceania #14)* · ATTACCO BS
- **Con:** Plasma Carbine, nella tendina la modalità a Sagoma (Blast), poi quella senza Sagoma (Hit)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, ARM 1, BTS 0)*, a 0-8", senza copertura
- **Atteso:** Blast: **ARM VS 8** e **BTS VS 7**, descritte come Tiro Salvezza Combinato. Hit: **ARM VS 7** e **BTS VS 6**.

**MU-20 — Kobra Pistol, due modalità**
- **Attivo:** Morlock (Kobra Pistol, DA CC) *(Nomadi #36)* · ATTACCO BS, poi ATTACCO CC
- **Con:** Kobra Pistol (BS Mode); Kobra Pistol (CC Mode)
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", senza copertura (in CC: a contatto)
- **Atteso:** BS Mode: munizione **SHOCK**, Burst 2, **una** salvezza (**ARM VS 8 ×1**). CC Mode: munizione **DA**, Burst 1, **due** salvezze (**ARM VS 8 ×2**), Tratto Anti-materiel. Nell'ATTACCO BS il Morlock ha esattamente Chain Rifle, Smoke Grenades e Kobra Pistol (BS Mode); la CC Mode è fra le escluse col motivo.

**MU-21 — BioWeapon condizionale**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO CC
- **Con:** Viral CC Weapon(PS=6)
- **Bersaglio:** Fusilier *(PanOceania #1, VITA)*, poi Tikbalang *(PanOceania #8, STR)*
- **Atteso:** Fusilier **BTS VS 6** con la nota *«Bersaglio con VITA: si applica la combinazione DA+Shock»*; Tikbalang **BTS VS 12** con la nota *«Bersaglio senza VITA: il BioWeapon non lo potenzia»*.

**MU-22 — ARM = 0**
- **Attivo:** Hawkwood (K1 Sniper Rifle) *(Nomadi #37)* · ATTACCO BS; poi Alguacil (Combi Rifle) *(Nomadi #1)* sullo stesso bersaglio
- **Con:** K1 Sniper Rifle; Combi Rifle
- **Bersaglio:** Nisse (Heavy Machine Gun) *(PanOceania #5, ARM 3)*, a 16-24", senza copertura
- **Atteso:** K1 → **ARM VS 7** (vale solo il PS); Combi → **ARM VS 10**. Il tiro salvezza c'è comunque.

---

# 6. Blocco D — Sagome

**TPL-01 — Sagoma Diretta: colpo automatico**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* sotto la Sagoma, *BERSAGLIO SOTTO LA SAGOMA*
- **ARO:** Fusilier → SCHIVATA, con LoF
- **Atteso:** **TIRO NORMALE**: attivo **COLPO AUTOMATICO** (*«Sagoma Diretta: nessun tiro per colpire»*, *«Nessun dado: colpo automatico»*), reattivo **PH 10**, salvezza Fusilier **ARM VS 8 ×1**. Nota: chi è colpito da una Sagoma non prende il +3 di copertura.

**TPL-02 — Continuous Damage**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B)
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, preso da **1** Sagoma
- **ARO:** nessuno
- **Atteso:** colpo automatico, **ARM VS 11 ×1**, e la nota che le salvezze si ripetono finché una non riesce.

**TPL-03 — Sagoma che colpisce il BTS**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · ATTACCO BS
- **Con:** Pulzar(+1B)
- **Bersaglio:** Orc *(PanOceania #4)*, preso da **1** Sagoma
- **ARO:** nessuno
- **Atteso:** colpo automatico, **BTS VS 10 ×1**.

**TPL-04 — Sagoma d'Impatto: il tiro serve**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: EXP · B1 · Sagoma d'Impatto»*
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, a 24-32", senza copertura
- **ARO:** Orc → ATTACCO BS, MULTI Rifle munizione AP, a 24-32", contro l'Alguacil
- **Atteso:** **F2F**, non "Auto". Attivo **14** (11 +3) B1; reattivo **11** (14 −3) B1. Salvezza Orc **ARM VS 10 ×3**; salvezza Alguacil **ARM VS 8 ×1**.

**TPL-05 — Schivata senza LoF contro una Sagoma**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* sotto la Sagoma
- **ARO:** Fusilier → SCHIVATA **senza LoF** verso il Morlock; poi la stessa prova **con LoF**
- **Atteso:** la Schivata è **sempre concessa** contro una Sagoma, con la nota. Senza LoF **PH 7** (10 −3); con LoF **PH 10**. In più la nota *«Se la Schivata riesce, il bersaglio esce dalla Sagoma (fino a 2"): non subisce il colpo e non fa il Tiro Salvezza.»*

**TPL-06 — Critico solo sul Principale**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, Sagoma d'Impatto
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* come primo bersaglio, Fusilier (Missile Launcher) *(PanOceania #2)* come secondo, tutti e due a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** sul tabellone **un** riquadro, *«SAGOMA D'IMPATTO: UN TIRO, 2 BERSAGLI»*: l'Alguacil **11** una volta sola, poi una riga per Fusilier. Il primo porta la nota *«Questo è il Bersaglio Principale»*, il secondo *«Questo è un bersaglio secondario»*. Il Critico vale come Critico **solo** sul Principale: sotto il primo *«Nota: un Critico aggiunge 1 Tiro Salvezza extra.»*, sotto il secondo *«Nota: Bersaglio secondario: un Critico conta come successo normale, niente Tiro Salvezza extra (vale solo sul Principale).»*

**TPL-07 — Una Sagoma, due bersagli**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B) — Burst 2, cioè **2 Sagome**
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* e Orc (Hacker, Hacking Device) *(PanOceania #4)*, **1 Sagoma** ciascuno (tocca **−** sul Fusilier, che parte da 2)
- **ARO:** nessuno
- **Atteso:** in testa alla pagina *«2 SAGOME: per ogni bersaglio indica da quante Sagome è preso»*; nessun *DADI DA ASSEGNARE*. Sul tabellone **due** scontri, tutti e due colpo automatico: Fusilier **ARM VS 8**, Orc **ARM VS 11**.

**TPL-08 — Due Sagome sullo stesso bersaglio** *(nuova)*
- **Attivo:** come TPL-07
- **Bersaglio:** Fusilier con **2 Sagome**, Orc con **1**
- **Atteso:** il contatore del Fusilier arriva a **2** e non oltre; quello dell'Orc non scende sotto **1**. Sul tabellone il Fusilier ha **2** colpi (due Tiri Salvezza), l'Orc **1**, con la nota *«2 Sagome, ognuna è un colpo che vale per tutti quelli sotto la sua area»*.
- **Controprova con un'arma senza Sagoma:** Teutonic Knight *(PanOceania #7)*, Panzerfaust (B1), su Alguacil #1 e Alguacil (HMG) #2: c'è *DADI BS DA ASSEGNARE: 1* e si può dare il dado a uno solo.

**TPL-09 — Una sola Sagoma: nessun dado da assegnare** *(nuova)*
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle (B1)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* e Fusilier (Missile Launcher) *(PanOceania #2)*
- **ARO:** nessuno
- **Atteso:** in testa *«UNA SAGOMA: ogni bersaglio scelto è sotto l'area e ne subisce il colpo»*; accanto ai due nomi *«1 Sagoma»*, senza tasti − e +. Sul tabellone due scontri, ARM VS 8 per tutti e due.

**TPL-10 — Sagoma Diretta in ARO** *(nuova)*
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Morlock (Assault Pistol) *(Nomadi #13)* a 0-8"
- **ARO:** Morlock → ATTACCO BS, **Chain Rifle**, contro il Fusilier
- **Atteso:** **TIRO NORMALE** (righe 3657-3661): il Fusilier tira **15** con 3 dadi; il Morlock **COLPO AUTOMATICO**, nessun dado. Tutti e due infliggono la salvezza: **ARM VS 8 ×1** a ciascuno. Nota *«Sagoma Diretta del reattivo: colpisce senza tiro…»*. Mai *«Valore di Successo non fornito dal calcolo»*. Controprova: lo stesso ARO con l'**Assault Pistol** è un **Faccia a Faccia**.

**TPL-11 — Sagoma d'Impatto, tre Fusilier** *(nuova)*
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3, BS 11)* · ATTACCO BS
- **Con:** Missile Launcher, *«Munizioni: EXP · B1 · Sagoma d'Impatto»*
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* toccato per primo, a 8-16" **in Copertura**; poi Fusilier (Missile Launcher) *(#2)* e Fusilier (Forward Observer) *(#3)*
- **ARO:** Fusilier #2 → SCHIVATA; gli altri nessuno
- **Atteso:** nella pagina della gittata il #1 è **PRINCIPALE** con barra, Copertura e LINEA DI TIRO; il #2 e il #3 hanno la scheda ridotta **SECONDARIO** (*«Sotto la Sagoma del Principale. Lo stesso tiro vale anche per lui…»*), **senza** gittata, Copertura, LoF e munizione. Sul tabellone **un** riquadro, *«SAGOMA D'IMPATTO: UN TIRO, 3 BERSAGLI»*: l'Alguacil **8** (11 −3 Copertura del Principale) **una volta sola**, con *«UN SOLO TIRO contro 3 bersagli sotto la Sagoma»*; tre righe: #1 *PRINCIPALE · TIRO NORMALE*, #2 *SECONDARIO · TIRO FACCIA A FACCIA* con la Schivata **PH 10**, #3 *SECONDARIO · TIRO NORMALE*. Salvezza **ARM VS 7 ×3** per ognuno. Controprova: togli la Copertura al #1 → **11**, sempre una volta sola, per tutti e tre.

---

# 7. Blocco E — Attacco Intuitivo

**INT-01 — Contro un Marker**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*, schierato come **Marker CAMO**. Nella pagina dei bersagli lascia *HO LINEA DI TIRO (solo Marker bersagliabili)*
- **ARO:** Croc Man → SCHIVATA
- **Atteso:** la Schivata rivela il Croc Man, e l'Attacco **resta valido** (era un Marker quando l'hai dichiarato): l'invio parte. **F2F**. Attivo **WIP 14**, Burst 1, nessuna voce di MOD, con la nota *«nessun MOD si applica, da nessuna fonte»*. Reattivo **PH 12**. Se leggi *«INVIO BLOCCATO — … Questo è visibile»*, è tornato il difetto corretto alla revisione 38.

**INT-02 — Bersaglio visibile**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man *(PanOceania #6)* schierato come **Modello**
- **Atteso:** con *HO LINEA DI TIRO* il Croc Man **non è fra i bersagli**: con la Linea di Tiro si attaccano solo i Marker.

**INT-03 — Fuori LoF per una Zona di Visibilità Zero** *(nuova)*
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Modello, dietro il Fumo. Nella pagina dei bersagli tocca *NESSUNA LoF — Zona di Visibilità Zero*
- **ARO:** nessuno
- **Atteso:** il Fusilier compare fra i bersagli. Nella pagina dopo c'è solo *BERSAGLIO SOTTO LA SAGOMA*, **senza** il tasto LINEA DI TIRO, e il tasto in fondo è *LANCIA ATTACCO INTUITIVO*. Tiro **WIP 14**, salvezza **ARM VS 8 ×1**.

**INT-04 — Quali armi lo aprono**
- **Attivo:** apri il menu degli Ordini di Zero (Hacker, Killer Hacking Device) *(Nomadi #9, Shock Mine)*, Mary Problems *(Nomadi #21, Zapper)* e Kulak *(Nomadi #23, Cybermine)*
- **Atteso:** ATTACCO INTUITIVO compare per tutti e tre. Non compare per Alguacil (Combi Rifle) *(Nomadi #1)*.

---

# 8. Blocco F — Fuoco Speculativo

**SPEC-01 — Il −6 e il cambio di attributo**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", in copertura
- **ARO:** nessuno
- **Atteso:** tiro su **PH**, con la nota *«Grenades: Tratto BS Weapon (PH)»*: 12 +3 −6 = **9**, B1. La copertura non compare fra i MOD.

**SPEC-02 — Bersaglio Bersagliato**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier *(PanOceania #1)*, **Bersagliato**, a 0-8"
- **ARO:** nessuno
- **Atteso:** 12 +3 −6 +3 = **12**, con tutte e tre le voci.

**SPEC-03 — Armi ammesse**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)*: apri il menu; poi Mary Problems *(Nomadi #21)* · FUOCO SPECULATIVO
- **Con:** per Mary Problems il Pitcher
- **Atteso:** l'Alguacil **non** ha la voce FUOCO SPECULATIVO (il Missile Launcher non ha il Tratto Speculative Attack). Mary Problems ha **un** bottone, Pitcher, e sotto le altre armi escluse col motivo.

**SPEC-04 — FUORI nella barra delle gittate** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*
- **ARO:** nessuno
- **Atteso:** la barra ha le due fasce delle Grenades (+3 e −3) e in fondo **FUORI**. Non c'è il tasto *IN GITTATA SÌ*. Toccando FUORI il tasto in fondo diventa **IDLE** giallo; toccando 0-8" torna *LANCIA ATTACCO SPECULATIVO*.

**SPEC-05 — Principale e bersagli sotto la Sagoma, nella pagina dei bersagli** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** nella pagina dei bersagli tocca, in quest'ordine, Zulu-Cobra *(PanOceania #10, Marker CAMO)*, poi Fusilier (Combi Rifle) *(PanOceania #1)*, poi Zulu-Cobra, poi Orc *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** le righe hanno la foto, come negli altri elenchi. Il primo tocco sul Zulu-Cobra è **rifiutato**: *«non può essere il Bersaglio Principale»*. Il Fusilier diventa **[ PRINCIPALE ]**, il Zulu-Cobra e l'Orc **[ SOTTO LA SAGOMA ]**. Nella pagina della gittata non c'è più la scelta dei secondari, solo il promemoria *«ANCHE SOTTO LA SAGOMA: …»*. Sul tabellone **tre** scontri con lo stesso tiro **9** (PH 12 +3 −6); sul Zulu-Cobra nessuna voce di Mimetismo.
- **Controprova:** togliendo il Principale, diventa Principale l'Orc, non il Marker.

**SPEC-06 — Pitcher: il PUNTO SUL TAVOLO**
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21, BS 12)* · FUOCO SPECULATIVO
- **Con:** Pitcher
- **Bersaglio:** il **PUNTO SUL TAVOLO**, a 0-8" (sul tavolo ci sono Fusilier #1 e Orc #4)
- **ARO:** nessuno
- **Atteso:** nella pagina dei bersagli **solo** *«📍 PUNTO SUL TAVOLO»* (*«Arma Targetless: si lancia su un punto, non su un nemico. Se il tiro riesce, il segnalino si piazza lì.»*): il Fusilier e l'Orc **non ci sono**. Nella pagina della gittata *«TIRO SU BS 12»*, *«Fuoco Speculativo: -6 fisso»*. Sul tabellone **TIRO NORMALE**, Mary **6**; il lato del punto è una cella neutra, *«📍 PUNTO SUL TAVOLO — Non è una truppa: non reagisce e non subisce danno.»*, senza fazione e senza righe delle salvezze. Subito dopo l'invio una **finestra**: *«🎯 Pitcher: tira al tavolo. Il tiro è RIUSCITO?»*. **OK** → *«✅ Pitcher: segnalino piazzato.»*, nel roster c'è **Deployable Repeater #1** e l'Hub lo vede. Controprova: **Annulla** → *«❌ Pitcher: tiro fallito, nessun segnalino. L'uso è comunque speso.»*, nessun Ripetitore. Con un ARO del Fusilier (ATTACCO BS) il suo è un **Tiro Normale**, non un Faccia a Faccia.

---

# 9. Blocco G — Attacco Guidato

**GUI-01 — L'Ordine si raggiunge**
- **Attivo:** Vertigo Zond (Missile Launcher) *(Nomadi #28)* · apri il menu degli Ordini
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* messo **Bersagliato** dall'editor degli stati
- **Atteso:** ATTACCO GUIDATO c'è; il bottone dell'arma è Missile Launcher (Blast Mode). Controprova: Alguacil (Missile Launcher) *(Nomadi #3)*, che ha l'arma ma non la Skill, **non** ha la voce.

**GUI-02 — Bersaglio Bersagliato**
- **Attivo:** Vertigo Zond *(Nomadi #28, BS 12)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(PanOceania #1)*, Bersagliato, a 24-32", in copertura
- **ARO:** nessuno
- **Atteso:** 12 +3 +3 = **18**, voci *«Gittata: +3»* e *«Bersaglio Bersagliato: +3 BS»*, nota *«Attacco Guidato: ignora Copertura e Mimetismo»*. Salvezza **ARM VS 7 ×3**.

**GUI-03 — La lista dei bersagli** *(riscritta)*
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** sul tavolo Fusilier (Combi Rifle) #1 **Bersagliato**, Fusilier (Missile Launcher) #2 senza stato, Croc Man #6 Marker CAMO. Tocca prima il Fusilier #2, poi il #1, poi il #2
- **ARO:** nessuno
- **Atteso:** una **lista sola** con le righe con la foto, come gli altri elenchi. Il Croc Man **c'è**, con l'etichetta *«(Marker: solo sotto la Sagoma)»*: toccato per primo è rifiutato, dopo il Primario entra come preso dalla Sagoma. Il primo tocco sul #2 è rifiutato: *«non può essere il Primario»*. Poi il #1 è **[ PRIMARIO ]** e il #2 **[ PRESO DALLA SAGOMA ]**. Sul tabellone due scontri: il Faccia a Faccia e il Critico restano del solo Primario.

**GUI-04 — ECM (Guided −6)**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Tikbalang *(PanOceania #8)*, Bersagliato, a 24-32"
- **ARO:** nessuno
- **Atteso:** 12 +3 +3 −6 = **12**, con la voce *«ECM (Guided -6) del bersaglio: -6 BS»*. Salvezza **ARM VS 12 ×3**.

**GUI-05 — La difesa contro un Guidato**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Bersagliato, a 0-8"
- **ARO:** il Fusilier apre il menu ARO
- **Atteso:** sono offerte **SCHIVATA** e **RESET**, più Attacco BS e Attacco CC. Il Reset ha la nota *«Stato Bersagliato: −3 WIP»*. Nei modificatori: Schivata **PH 7** (10 −3, Sagoma senza LoF), Reset **WIP 9** (12 −3).

---

# 10. Blocco H — Corpo a corpo

**CC-01 — Martial Arts sui due lati**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** Fusilier → ATTACCO CC, CC Weapon, contro il Morlock
- **Atteso:** Faccia a Faccia. Attivo CC 23 +3 = **26**, una voce: *«Martial Arts L2: +3 CC»*. Reattivo 13 −3 = **10**, una voce: *«Martial Arts L2 del nemico: -3 al tuo CC»*. Salvezza del Fusilier **ARM VS 7 ×1**: è il PS=6 del profilo, non il PS 8 del CC Weapon generico. Salvezza del Morlock **ARM VS 9 ×1**. Se leggi ARM VS 9 sul Fusilier, il PS del profilo si è perso.

**CC-02 — NBW e CC Attack (−3)**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO CC
- **Con:** Viral CC Weapon(PS=6)
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)*, a contatto
- **ARO:** Teutonic Knight → ATTACCO CC, DA CC Weapon(PS=5), contro la Chimera
- **Atteso:** attivo CC **24**, nessuna voce di MOD, e la nota *«Natural Born Warrior annulla il -3 delle Martial Arts L2 nemiche»*. Reattivo 22 +3 −3 = **22**, due voci: *«Martial Arts L2: +3 CC»* e *«Il nemico ha CC Attack (-3): si applica a te nel Faccia a Faccia»*. Salvezza del Teutonic **BTS VS 9 ×2**; salvezza della Chimera **ARM VS 6 ×2**.

**CC-03 — Colpo di Grazia**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** (a) Fusilier (Combi Rifle) *(PanOceania #1)* messo **Incosciente**; (b) Fusilier sano; (c) Dr. Harper FTO *(PanOceania #14, No Wound Incapacitation)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** (a) riquadro rosso **☠️ COLPO DI GRAZIA**: nessun tiro d'attacco, nessun Tiro Salvezza, *«Senza alcun tiro, il bersaglio passa automaticamente da Incosciente a Morto, senza possibilità di Tiro Salvezza.»* Sul tabellone dell'Hub lo scontro si chiama **COLPO DI GRAZIA**: *Azione: COLPO DI GRAZIA*, **Nessun dado** per tutti e due, **Nessun Tiro Salvezza**. (b) nessun riquadro: *«Il bersaglio non è Incosciente.»* (c) riquadro giallo **⚠️ COLPO DI GRAZIA NON APPLICABILE**: *«Il bersaglio ha Dogged o No Wound Incapacitation: il Colpo di Grazia non si usa, il CC Attack si risolve normalmente.»*

**CC-04 — PARA CC Weapon**
- **Attivo:** Zondmate (REM) — la moto della Zondnautica-A *(Nomadi #18)* dopo SCENDI DALLA MOTO · ATTACCO CC
- **Con:** PARA CC Weapon(-3)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** nessuno
- **Atteso:** CC **13** (il −3 dell'arma va al nemico, non a chi la usa). Salvezza **PH VS 4 ×1**: nessuna Ferita, l'effetto è Immobilizzato-A.

**CC-05 — Berserk**
- **Attivo:** Wolfgang Amadeus *(Nomadi #26)* · BERSERK
- **Con:** prima PARA CC Weapon(-6), poi DA CC Weapon(PS=4)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** Fusilier → ATTACCO CC, CC Weapon, contro Wolfgang
- **Atteso:** Faccia a Faccia (in N5 il Berserk non lo evita). Attivo CC 22 +3 = **25**, una voce: *«Martial Arts L3: +3 CC»*. Reattivo 13 −3 −6 = **4** con la PARA, voci *«Martial Arts L3 del nemico: -3 al tuo CC»* e *«PARA CC Weapon (-6) dell'avversario: -6 nel Faccia a Faccia»*. Salvezza del Fusilier: con la PARA **PH VS 4 ×1**, con la DA **ARM VS 5 ×2**. Salvezza di Wolfgang **ARM VS 11 ×1**.

**CC-06 — Ingaggiato**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **Ingaggiato** · apri il menu degli Ordini
- **Atteso:** compaiono **solo** ATTACCO CC, SCHIVATA, RESET, IDLE (il BERSERK non c'è perché l'Alguacil non ha la Skill; su Wolfgang #26 Ingaggiato c'è anche BERSERK). Controprova: lo stesso Alguacil senza lo stato ha il menu intero.

**CC-07 — Gang-Up**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto. Alla domanda *«Quanti TUOI alleati sono ingaggiati in questa mischia?»* rispondi **0**, poi **1**, **2**, **3**
- **ARO:** nessuno
- **Atteso:** Burst **1 / 2 / 3 / 4**, con la voce *«Close Combat with Multiple Troopers: +1B (N alleato/i nella mischia)»*. Il numero degli alleati lo dichiara il giocatore: l'app non sa chi ha dichiarato Schivata o Idle.

---

# 11. Blocco I — Hacking

Tutte le prove di hacking: bersaglio **nell'Area di Hacking**. Gittata e
copertura non contano e la schermata non le chiede.

**HK-00 — Programmi per dispositivo**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)*, Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, Orc (Hacker, Hacking Device) *(PanOceania #4)* · HACKING, guarda l'elenco dei programmi
- **Atteso:** Interventor: Carbonite, Oblivion, Spotlight, Total Control fra gli attacchi (più Cybermask e White Noise). Zero: **solo Trinity** fra gli attacchi. Orc: i quattro programmi base, nessun Cybermask.

**HK-01 — Carbonite**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** Orc → RESET, contro l'Interventor
- **Atteso:** Faccia a Faccia. Attivo WIP **15** B2, reattivo Reset WIP **12** B1. Salvezza dell'Orc **BTS VS 10 ×2**.

**HK-02 — Oblivion**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** OBLIVION
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** WIP **15** B1. Salvezza **BTS VS 6 ×1** (BTS dimezzato + PS 4), effetto Isolato.

**HK-03 — Spotlight su un non hacker**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** SPOTLIGHT
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*
- **ARO:** nessuno
- **Atteso:** ammesso. WIP **15** B1, salvezza **BTS VS 5 ×1**, effetto Bersagliato.

**HK-04 — Trinity**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, **rivelato** (Scoprilo o schieralo come Modello) · HACKING
- **Con:** TRINITY
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** WIP 13 +3 = **16** B3, con la voce *«TRINITY: +3 WIP»*. Salvezza **BTS VS 9 ×1**.

**HK-05 — Filtro bersagli**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* per CARBONITE, OBLIVION, TOTAL CONTROL e SPOTLIGHT; Zero (Hacker, Killer Hacking Device) *(Nomadi #9)* per TRINITY · HACKING
- **Bersaglio:** sul tavolo Tikbalang *(PanOceania #8)*, Orc *(#4)*, Fusilier (Combi Rifle) *(#1)* e Croc Man (MULTI Sniper Rifle) *(#6)* come Marker CAMO
- **ARO:** nessuno
- **Atteso:** CARBONITE e OBLIVION: Tikbalang e Orc ammessi; Fusilier no (*«non hackerabile»*); Croc Man no (*«va Scoperto prima»*). TOTAL CONTROL: solo il Tikbalang. TRINITY: solo l'Orc. SPOTLIGHT: anche il Fusilier.

**HK-06 — Firewall**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8, WIP 15)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, BTS 3)*
- **ARO:** nessuno
- **Atteso:** tiro **12**, voce *«Firewall del bersaglio: −3 WIP»*. Salvezza **BTS VS 13 ×2**, voce *«Firewall del bersaglio: +3 BTS (equivalente Copertura)»*. Il Firewall fa due cose: se ne vedi una sola, metà della regola manca.

**HK-07 — Due fonti dello stesso Firewall**
- **Attivo:** prima Laxmee (Hacker) *(PanOceania #16)* · HACKING · **FAIRY DUST** sugli **HI**; poi, nel turno nomade, Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, HI)*
- **ARO:** nessuno
- **Atteso:** Firewall **−3, non −6**: tiro **12**, salvezza **BTS VS 13 ×2** con il +3 una volta sola. La nota dice che le fonti sono due — *«il suo (-3) e il Fairy Dust di … (-3)»* — e che la scelta spetta al giocatore del bersaglio. Il Repeater non compare.

**HK-08 — Firewall spento**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* messo **Isolato**
- **ARO:** nessuno
- **Atteso:** tiro **15** e salvezza **BTS VS 10 ×2**: niente −3, niente +3. È la controprova di HK-06.

**HK-09 — ECM (Hacking −3)**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Aquila *(PanOceania #11)*
- **ARO:** nessuno
- **Atteso:** tiro **12**, voce *«ECM (Hacking -3) del bersaglio: -3 WIP»*. L'ECM non dà il +3 alla salvezza: la salvezza è **BTS VS 13 ×2** perché il BTS dell'Aquila è 6.

**HK-10 — Dati da verificare**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* con TOTAL CONTROL sul Tikbalang *(PanOceania #8)*; Zero *(Nomadi #9)* con TRINITY sull'Orc *(#4)* · HACKING
- **ARO:** nessuno
- **Atteso:** l'avviso **A91** — *«Dati di "<programma>" non verificati sulla scheda ufficiale»* — compare sui programmi che il catalogo marca `fonte: 'DA VERIFICARE'`. Se non compare su nessuno dei due, chiedi a DATABASE se sono stati verificati prima di segnalarlo.

**HK-11 — Upgrade dai profili**
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21, UPGRADE: Oblivion +1B)*, poi Kulak (Hacker, Killer Hacking Device) *(Nomadi #23, UPGRADE: Carbonite)* · HACKING
- **Con:** OBLIVION per Mary Problems, CARBONITE per il Kulak
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** l'upgrade entra nel calcolo — l'Oblivion di Mary Problems a **Burst 2** — oppure compare l'avviso **A94**. Mai ignorato in silenzio.

**HK-12 — Reset contro l'hacking, Schivata contro il BS**
- **Attivo:** prima Interventor (Hacker Plus, FastPanda) *(Nomadi #8)* · HACKING · CARBONITE; poi Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS · Combi Rifle a 8-16", copertura no
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** l'Orc apre il menu degli ARO
- **Atteso:** contro l'HACKING: Reset sì, **Schivata no**. Contro l'ATTACCO BS: Schivata sì, e Reset sì anche lui (vedi AR-01). La differenza da leggere è la Schivata.

---

# 12. Blocco J — Scoprire e osservazione

Il bersaglio delle prove SCO è il **Croc Man (MULTI Sniper Rifle)**
*(PanOceania #6)* schierato come **Marker CAMO**, senza copertura.

**SCO-01 — Scoprire vicino**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, WIP 13)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 0-8"
- **ARO:** nessuno
- **Atteso:** **10** (13 +3 gittata −6 Mimetismo), B1, Tiro Normale. La nota dice che chi fallisce non ritenta sullo stesso Marker fino al proprio Turno successivo.

**SCO-02 — Scoprire lontano**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 32-40"
- **ARO:** nessuno
- **Atteso:** **4** (13 −3 −6). Le fasce dello Scoprire sono sue: +3 fino a 8", 0 fino a 32", −3 fino a 48", −6 oltre.

**SCO-03 — Sensor e visore**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, MSV L1)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 8-16"
- **ARO:** nessuno
- **Atteso:** **16**, con due voci: *«Mimetismo -6, ridotto a -3 dal Multispectral Visor L1»* e *«Sensor: +6 WIP scoprendo un Marker Mimetico»*.

**SCO-04 — Niente da Scoprire**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · SCOPRIRE
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Modello visibile
- **ARO:** nessuno
- **Atteso:** il Fusilier non è fra i bersagli ammessi: *«Non è in forma di Marker: non c'è niente da Scoprire.»*

**OSS-01 — Forward Observer**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, WIP 13)* · FORWARD OBSERVER
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 8-16"
- **ARO:** nessuno
- **Atteso:** in cima la **scheda del bersaglio** come nell'Attacco BS: il **nome del bersaglio**, **Burst 2**, la barra delle gittate (FUORI in coda), e i due tasti **NO COPERTURA** e **LINEA DI TIRO SÌ**. Nessun'altra riga di requisiti. Tiro su **WIP 13**, nessun MOD di gittata fino a 24". **Nessun Tiro Salvezza**: il bersaglio entra in Stato **Bersagliato**.
- **Poi:** tocca **COPERTURA** → il tasto dice *«IN COPERTURA»*, il tiro scende a **WIP 10** con la voce *«Bersaglio in Copertura Parziale: -3»*, e il tabellone dice *«Successo al: 10»*. Ritocca: torna 13. Tocca **LINEA DI TIRO** → *«LINEA DI TIRO NO»*, e il tasto del calcolo diventa **IDLE**.

**OSS-02 — Sensor**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · SENSOR
- **ARO:** nessuno
- **Atteso:** **WIP 13 +6 = 19**, senza bersaglio e senza Linea di Tiro: scopre tutti i Marker nella sua Zona di Controllo. Nessun MOD di gittata né di Mimetismo. La schermata non diventa mai IDLE.

**OSS-03 — Triangulated Fire**
- **Attivo:** Zulu-Cobra (Triangulated Fire, Sensor) *(PanOceania #10, BS 13)*, **rivelato** · TRIANGULATED FIRE
- **Con:** Combi Rifle
- **Bersaglio:** Intruder (HMG) *(Nomadi #24, Mimetismo −3)*, rivelato, a 32-40"
- **ARO:** nessuno
- **Atteso:** la schermata ha **un bottone per arma** (Combi Rifle, Jammer, Assault Pistol). Al tiro, in cima la **scheda del bersaglio**: il **nome del bersaglio**, **Burst 1**, la barra delle gittate e **solo** il tasto **LINEA DI TIRO**: **nessun tasto Copertura**, perché il Triangulated la ignora (riga 10340). Il tiro è su **BS 13 pieno**, MOD 0. I MOD ignorati compaiono **barrati**: *«Gittata: -6»*, *«Mimetismo del bersaglio: -3»*; con quei MOD il tiro sarebbe stato **4**. **LINEA DI TIRO NO** → IDLE. Sul tabellone *«Successo al: 13»*, con la nota *«MOD ignorati dal Triangulated Fire: Gittata: -6 (-6); Mimetismo del bersaglio: -3 (-3).»* Controprova: un ATTACCO BS normale dello stesso Zulu-Cobra contro lo stesso Intruder a 32-40" resta **4**. Alguacil (Combi Rifle) *(Nomadi #1)* non ha la voce, *«Serve l'Abilità Triangulated Fire.»*

---

# 13. Blocco K — Supporto

**SUP-01 — Dottore**
- **Attivo:** Daktari (Doctor) *(Nomadi #6, WIP 13)* · DOTTORE
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** tira il Daktari su **WIP 13**, una voce *«WIP di Daktari: 13»*, nessun bonus. Il fallimento è **letale**: *«⚠️ Il bersaglio entra AUTOMATICAMENTE in Stato Morto e viene rimosso dal tavolo.»*

**SUP-02a — MediKit in contatto**
- **Attivo:** Alguacil (Paramedic) *(Nomadi #5)* · MEDIKIT, **IN CONTATTO DI SILHOUETTE**
- **Bersaglio:** Morlock (Assault Pistol) *(Nomadi #13, PH 13)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** l'Alguacil **non tira**. Tira il **Morlock** su **PH 13** (il PH del bersaglio, non dell'utente). Sul tabellone sopra il Morlock *«🩺 BERSAGLIO NOMADI»*, nel colore dei Nomadi (non *REATTIVO*, non azzurro). Nessun Tiro Salvezza. Fallimento: Morto.

**SUP-02b — MediKit a distanza**
- **Attivo:** Alguacil (Paramedic) *(Nomadi #5, BS 11)* · MEDIKIT, **A DISTANZA**
- **Bersaglio:** Morlock (Assault Pistol) *(Nomadi #13, PH 13)* messo **Incosciente**, a 0-8"
- **ARO:** nessuno
- **Atteso:** la barra è quella **del MediKit**: **0-8" +3 · 8-16" 0 · 16-24" −6 · FUORI**, e sotto il tasto **LINEA DI TIRO SÌ**. Due tiri in ordine: l'Alguacil colpisce su **BS 11 + la banda**, **Burst 1** — sul tabellone *«MediKit: TIRO PER COLPIRE»* **14** a 0-8", **11** a 8-16", **5** a 16-24"; poi il **Morlock** tira su **PH 13**. Nessun Tiro Salvezza. Fallimento: Morto. **FUORI** → il tasto dice **IDLE** (*«fallimento automatico: fuori gittata»*); **LINEA DI TIRO NO** → **IDLE** (*«dadi persi: nessuna Linea di Tiro»*).

**SUP-03 — Ingegnere**
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7, WIP 15)* · INGEGNERE
- **Bersaglio:** Reaktion Zond (HMG) *(Nomadi #15)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** **WIP 15**; il fallimento dà **1 Ferita**, non la morte: *«il bersaglio riceve 1 Ferita invece di rimuoverla»*.

**SUP-04a — GizmoKit in contatto**
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7)* · GIZMOKIT, **IN CONTATTO DI SILHOUETTE**
- **Bersaglio:** Reaktion Zond (HMG) *(Nomadi #15, PH 10)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** il Clockmaker **non tira**. Tira il **Reaktion Zond** su **PH 10**. Fallimento: 1 Ferita.

**SUP-04b — GizmoKit(+1B) a distanza**
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7, BS 11)* · GIZMOKIT, **A DISTANZA**
- **Bersaglio:** Reaktion Zond (HMG) *(Nomadi #15, PH 10)* messo **Incosciente**, a 0-8"
- **ARO:** nessuno
- **Atteso:** **BS 11 + la banda** (a 0-8" **14**) per colpire, e sul tabellone **Dadi da lanciare: 2** (il +1B del GizmoKit); poi lo Zond su **PH 10**. Fallimento: 1 Ferita. Controprova: Machinist (Combi Rifle) *(PanOceania #13)*, GizmoKit senza notazione, **1** dado.

**SUP-05 — Filtro dei bersagli**
- **Attivo:** Daktari *(Nomadi #6)* · DOTTORE; poi Clockmaker *(Nomadi #7)* · INGEGNERE
- **Bersaglio:** sul tavolo Alguacil (Combi Rifle) *(#1)* **Incosciente** (ha VITA), Reaktion Zond (HMG) *(#15)* **Incosciente** (ha STR), Alguacil (HMG) *(#2)* sano
- **ARO:** nessuno
- **Atteso:** per regola il Dottore accetta solo l'Alguacil #1; l'Ingegnere solo il Reaktion Zond. L'Alguacil sano è rifiutato da tutti e due: *«il Supporto bersaglia solo gli Incoscienti»*. **Difetto aperto** (blocco V): oggi tutti e due gli Incoscienti sono offerti a tutti e due gli strumenti.

**SUP-06 — Strumento sconosciuto**
- **Attivo:** in console, `MotoreN5.regoleSupporto(<Daktari>, <Alguacil incosciente>, 'SCATOLETTA')`
- **Atteso:** `valido: false` e l'avviso **A58**, *«Strumento di supporto "SCATOLETTA" sconosciuto.»*, gravità `azione`.

**SUP-07 — Ri-tiri col Command Token**
- **Attivo:** Daktari *(Nomadi #6)* · DOTTORE sull'Alguacil (Combi Rifle) *(#1, ha `Cube`)* Incosciente; poi Clockmaker *(Nomadi #7)* · INGEGNERE sul Reaktion Zond *(#15, ha Remote Presence)* Incosciente
- **ARO:** nessuno
- **Atteso:** due note diverse. Dottore: *«Se il bersaglio ha un Cubo, si possono spendere Command Token per ripetere un tiro fallito.»* Ingegnere: *«Se il bersaglio ha Remote Presence, si possono spendere Command Token per ripetere un tiro fallito.»* La nota si mostra sempre: la condizione la controlla il giocatore sul profilo.

---

# 14. Blocco L — Difese e Soppressione

Nelle prove DIF-01…04 attacca il **Fusilier (Combi Rifle)** *(PanOceania #1)*
con ATTACCO BS, Combi Rifle, a 8-16", senza copertura. Nelle DIF-05…08
attacca l'**Interventor (Hacker Plus, FastPanda)** *(Nomadi #8)* con HACKING, CARBONITE.

**DIF-01 — Schivata con LoF**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10)* → SCHIVATA, **con** LoF verso il Fusilier
- **Atteso:** **10**, nessuna voce di MOD.

**DIF-02 — Schivata senza LoF**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* → SCHIVATA, **senza** LoF
- **Atteso:** **7**, con la voce *«Schivata a −3: nessuna LoF verso l'attaccante»*.

**DIF-03 — Dodge (+3)**
- **Bersaglio e ARO:** Puppetbot (Red Fury) *(Nomadi #17, PH 10)* → SCHIVATA, con LoF
- **Atteso:** **13**, con la voce *«Dodge (+3)»*.

**DIF-04 — Schivata da IMM-A**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **IMM-A** → SCHIVATA, con LoF
- **Atteso:** **4**, con la voce *«Stato Immobilizzato-A: −6 PH»*.

**DIF-05 — Reset**
- **Bersaglio e ARO:** Orc (Hacker, Hacking Device) *(PanOceania #4, WIP 12)* → RESET, senza LoF
- **Atteso:** **12**, nessun MOD, e la nota che il −3 per la LoF vale sulla Schivata e non sul Reset.

**DIF-06 — Reset da Bersagliato**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **Bersagliato** → RESET
- **Atteso:** **9**, con la voce *«Stato Bersagliato: −3 WIP»*.

**DIF-07 — Reset da IMM-B**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **IMM-B** → RESET
- **Atteso:** **9**, con la voce *«Stato Immobilizzato-B: −3 WIP»*.

**DIF-08 — Reset da Isolato**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **Isolato** → RESET
- **Atteso:** **3**, con la voce *«Stato Isolato: −9 WIP»*.

**DIF-09 — Sesto Senso**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1, BS 12)* · ATTACCO BS
- **Con:** Combi Rifle, a 0-8"
- **Bersaglio:** Warcor (Sixth Sense) *(Nomadi #27, PH 11)* messo **in Soppressione**
- **ARO:** Warcor → SCHIVATA, **senza** LoF
- **Atteso:** Schivata **11**, nessuna voce, e la nota *«Sesto Senso: ignorato il -3 (nessuna LoF verso l'attaccante).»* Il −3 della Soppressione cade sull'**attaccante**: il Fusilier passa da 15 a **12**, voce *«Bersaglio in Fuoco di Soppressione a 8": -3»*. Controprova: Alguacil (Combi Rifle) *(Nomadi #1)* nelle stesse condizioni schiva a **7**.

**DIF-10 — Dichiarare la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · FUOCO DI SOPPRESSIONE
- **Con:** Combi Rifle
- **ARO:** nessuno
- **Atteso:** l'Ordine **genera ARO**: il reattivo riceve l'allarme, e l'Hub aspetta la sua risposta. Poi, sul tabellone, **ABILITÀ SENZA TIRO**, nessun dado, con la nota *«… entra in Fuoco di Soppressione con Combi Rifle (SF Mode) (B3 in ARO, -3 a chi gli dichiara BS Attack).»* Lo stato compare nell'elenco dell'Hub.

**DIF-11 — Armi ammesse**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, poi Morlock (Assault Pistol) *(Nomadi #13)* · FUOCO DI SOPPRESSIONE
- **Atteso:** l'Alguacil sì, col Combi Rifle. Il Morlock non ha la voce nel menu: Chain Rifle, Smoke Grenades e Assault Pistol non hanno il Tratto *Suppressive Fire*.

**DIF-12 — SF Mode in ARO**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* **in Soppressione** → ATTACCO BS, Combi Rifle, a 8-16", contro il Fusilier
- **Atteso:** l'arma diventa **Combi Rifle (SF Mode)**, Burst **3**, fasce 0 / 0 / −3, gittata massima 24", avviso **A98**.

**DIF-13 — Attivarsi cancella la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* **in Soppressione** · IDLE
- **ARO:** nessuno
- **Atteso:** la Soppressione sparisce appena parte l'Ordine: dalla riga dell'unità **e anche dall'elenco dell'Hub** (l'app lo avvisa con un aggiornamento).

**DIF-14 — Fumo in ARO** *(nuova)*
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Morlock (Assault Pistol) *(Nomadi #13)* a **0-8"**
- **ARO:** Morlock → ATTACCO BS, **Smoke Grenades**, contro il Fusilier
- **Atteso:** **TIRO FACCIA A FACCIA**: Morlock **13** con 1 dado (*«Smoke Grenades: Tratto "BS Weapon (PH)" — si tira su PH, non su BS.»*), Fusilier **15** con 3 dadi. Per il Fusilier *«Nessun Tiro Salvezza: azione non offensiva.»*; il Morlock, se perde, **ARM VS 8 ×1**. Nella scheda ARO del Morlock con le Smoke: la barra delle gittate, **LINEA DI TIRO** e la nota *«Arma Targetless: si tira su un punto del tavolo…»*, **nessun** tasto Copertura: il Fumo ignora Copertura e Mimetismo, e il 13 non cambia. Controprova: con l'**Assault Pistol** il tasto Copertura c'è: il Morlock tira **14**, segnata la Copertura **11** (−3). Controprova: lo stesso ARO contro l'ATTACCO BS dell'Aquila *(PanOceania #11, Multispectral Visor L3)* dà **TIRO NORMALE** per tutti e due (righe 5810-5812: chi ha un Multispectral Visor non fa Faccia a Faccia contro il Fumo).

**DIF-15 — Smoke Grenades dell'attivo: il punto** *(nuova)*
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13, PH 13)* · ATTACCO BS
- **Con:** Smoke Grenades
- **Bersaglio:** nessuno da scegliere (sul tavolo c'è Fusilier (Combi Rifle) *(PanOceania #1)*)
- **ARO:** nessuno
- **Atteso:** scelta l'arma **non** c'è la pagina dei bersagli: all'avversario parte l'allarme ARO su **«PUNTO SUL TAVOLO»**. Nella scheda il **PUNTO SUL TAVOLO**, la barra delle gittate, **LINEA DI TIRO** e la nota *«Arma Targetless: si tira su un punto del tavolo, non su una truppa. Niente Copertura né Mimetismo…»*; **nessun** tasto Copertura. Sul tabellone **TIRO NORMALE**, Morlock **13**; il lato del punto è la cella neutra *«📍 PUNTO SUL TAVOLO — Non è una truppa…»*, senza *REATTIVO PANOCEANIA* e senza righe delle salvezze. Controprova: con l'**Assault Pistol** c'è la pagina dei bersagli, si sceglie il Fusilier e la scheda ha il tasto Copertura.

---

# 15. Blocco M — Stati dell'attivo

Per tutte: **Alguacil (Combi Rifle)** *(Nomadi #1)*, messo nello stato indicato
dall'editor degli stati; si apre il menu degli Ordini. Il menu pieno
dell'Alguacil è: MUOVERE, ATTACCO BS, ATTACCO CC, SCOPRIRE, SCHIVATA, RESET,
IDLE, CAUTO, SALTO, ARRAMPICARSI, SOPPRESSIONE, REQUEST SPEEDBALL.

**ST-01 — Normale**
- **Atteso:** il menu pieno.

**ST-02 — Morto**
- **Atteso:** nessun Ordine.

**ST-03 — Incosciente**
- **Atteso:** nessun Ordine.

**ST-04 — Isolato**
- **Atteso:** l'Isolato **si attiva col PROPRIO Ordine Irregolare**, non con uno del Pool: la riga dice **📵 ORDINE IRREGOLARE PROPRIO**, con la nota *«Isolato: niente Ordini dal Pool. Usa solo il proprio Ordine Irregolare (non trasformabile in Regolare).»* Il menu è pieno (l'Alguacil non ha Hacking). È **escluso dal Coordinato**: **E59**.

**ST-05 — Disconnesso**
- **Attivo:** Zondmate (REM) — la moto della Zondnautica-A *(Nomadi #18)* dopo SCENDI DALLA MOTO, una Periferica — messo **Disconnesso** dall'editor degli stati; poi apri l'editor dell'Alguacil #1
- **Atteso:** lo Zondmate: nessun Ordine. L'Alguacil **non ha la casella** Disconnesso: lo stato è solo delle Periferiche.

**ST-06 — IMM-A**
- **Atteso:** solo SCHIVATA.

**ST-07 — IMM-B**
- **Atteso:** solo RESET.

**ST-08 — Stordito**
- **Atteso:** tutto tranne ATTACCO BS e ATTACCO CC.

**ST-09 — Ingaggiato**
- **Atteso:** solo ATTACCO CC, SCHIVATA, RESET, IDLE.

**ST-10 — In Ritirata**
- **Atteso:** solo MUOVERE, SCOPRIRE, SCHIVATA, RESET, IDLE, CAUTO.

**ST-11 — Foxhole**
- **Atteso:** il menu pieno: il Foxhole non nega nessuna voce. Muovendosi lo si cancella (ST-15).

**ST-12 — Bersagliato**
- **Atteso:** tutto tranne CAUTO.

**ST-13 — Soppressione**
- **Atteso:** il menu pieno; dichiarare un Ordine cancella lo stato (DIF-13).

**ST-14 — Tre stati insieme**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* messo IMM-A, Bersagliato e CAMO · guarda la riga dell'unità nell'app
- **Atteso:** i tre stati, tutti visibili. Sull'elenco dell'Hub, finché è un Marker, si vede **solo CAMO**: gli altri due l'avversario non li deve sapere.

**ST-15 — Foxhole al tavolo**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* in **Foxhole** · guarda la riga dell'unità e una scheda di bersaglio nemica
- **Atteso:** Silhouette 3, Copertura Parziale a 360°, Mimetism (−3) e Courage. Nessun movimento, nemmeno dopo una Schivata riuscita. Si cancella andando Prono, o dichiarando una Skill di Movimento.

**ST-16a — L'ordine degli stati**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* messo IMM-A, Bersagliato e CAMO · in console, `MotoreN5.statiPerCategoria(<l'Intruder del roster>)`
- **Atteso:** in quest'ordine: **Immobilizzato-A, Bersagliato, CAMO**.

**ST-16b — Lo Stato Nullo annulla il CAMO**
- **Attivo:** lo stesso Intruder *(#24)*, messo anche **Incosciente** dall'editor degli stati · guarda l'elenco dell'Hub
- **Atteso:** in quest'ordine: **Incosciente, Immobilizzato-A, Bersagliato**. Il CAMO non c'è più: lo annulla lo Stato Nullo.

**ST-17 — Una riga malata non svuota il tabellone**
- **Attivo:** in console, con tre unità sul tabellone, forza `MotoreN5.statiPerCategoria` a sollevare un errore solo sulla seconda
- **Atteso:** tre righe su tre; la seconda dice **STATI ILLEGGIBILI**; `window.ultimaEccezione` contiene il messaggio.

**ST-18 — Il segno NULL**
- **Attivo:** sei unità nomadi *(#1-#6)*, ciascuna con uno stato: Incosciente, Ritirata, Isolato, Disconnesso, Posseduto, Sepsitorizzato · guarda il tabellone
- **Atteso:** col bordo rosso e la parola NULL: Incosciente, Disconnesso, Posseduto, Sepsitorizzato. Senza: Ritirata! e Isolato.

**ST-19 — Prono e Scarico non sono stati**
- **Attivo:** apri l'editor degli stati dell'Alguacil #1
- **Atteso:** nessuna casella per Prono e Scarico; le caselle sono **16**.

**ST-21 — Morto all'Hub**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **Morto** dall'editor degli stati · guarda l'elenco dell'Hub; poi il CrazyKoala del Moran *(Nomadi #19)* dopo la sua detonazione (DET-07)
- **Atteso:** l'Alguacil sull'Hub risulta **Morto**, con l'icona. Lo stesso per il CrazyKoala. Le truppe vive non hanno l'icona.

**ST-20 — Il Marker si chiama CAMO**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* schierato Marker · guarda il tabellone e le note di uno Scoprire su di lui
- **Atteso:** **CAMO** in tutti e due i posti. La Skill Mimetismo si chiama ancora così, con il suo −6.

**ST-22 — Secondo profilo a senso unico** *(nuova)*
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)* con un soprannome, messo **Bersagliato**; apri l'editor degli stati
- **Atteso:** il tasto **🔄 PASSA AL PROFILO: Puppetbot (Red Fury) - Battle Ravaged**, senza «TIRO RIUSCITO». Toccato e confermato: **BS 11, ARM 0** (prima 12 e 1); soprannome, Bersagliato, Gruppo e foto restano; l'Hub vede BS 11 e ARM 0. Riaperto l'editor, il tasto **non c'è più**: resta la scritta *«Secondo profilo in uso»*. Controprova: l'editor dell'Alguacil (Combi Rifle) *(#1)* non ha il tasto.

**ST-23 — Transmutation (WIP): avanti, indietro, e da sola al cambio turno** *(nuova)*
- **Attivo:** Switcher *(Nomadi #40)* · apri l'editor degli stati
- **Atteso:** il tasto **🔄 TIRO RIUSCITO: PASSA AL PROFILO: Switcher - Enhanced Profile**, con la spiegazione del tiro (*Tiro Normale di WIP 13* prima di dichiarare un Ordine o un ARO). Toccato: **CC 23** (prima 15), e l'Hub vede CC 23. Riaperto l'editor: **↩️ TORNA AL PRIMO PROFILO**; toccato: CC 15, anche all'Hub. Ripassa al profilo Enhanced, poi **cambia turno** dall'Hub: lo Switcher torna da solo a **CC 15**, e l'Hub lo vede (AGGIORNAMENTO). Controprova: un Puppetbot *(#17)* passato a Battle Ravaged (ST-22) al cambio turno **resta** Battle Ravaged; un secondo cambio turno non cambia niente.

**ST-24 — Holoecho e HoloMask: due caselle** *(nuova)*
- **Attivo:** Bashi Bazouk (BS Attack (AP)) *(Nomadi #42)* · apri l'editor degli stati
- **Atteso:** **due** caselle, Holoecho e HoloMask, anche se Holoprojector e Holomask stanno fra gli equipaggiamenti e non fra le abilità; le icone dalla cartella del tuo esercito (`img/nomadi/…`, poi la copia comune in `img/`, poi l'emoji). Salvando con la sola Holoecho l'HoloMask **non** si accende. Accesa in partita, l'Holoecho piazza **due** copie (*«👥 Holoecho: piazza 2 copie olografiche a contatto di Silhouette.»*); spenta, le repliche escono dal roster. Spenta l'HoloMask, si toglie anche il Modello imitato. Controprova: un Alguacil (Combi Rifle) *(#1)* non ha nessuna delle due caselle.

---

# 16. Blocco N — Stati del reattivo

Per tutte: il reattivo è l'**Orc (Hacker, Hacking Device)** *(PanOceania #4)*,
messo nello stato indicato; si apre il suo menu degli ARO. L'attivo è
**Alguacil (Combi Rifle)** *(Nomadi #1)* · ATTACCO BS, Combi Rifle a 8-16",
contro l'Orc; oppure, dove la prova dice HACKING, **Interventor (Hacker Plus, FastPanda)**
*(Nomadi #8)* · HACKING, CARBONITE, contro l'Orc.

**AR-01 — Normale, contro un ATTACCO BS**
- **Atteso:** ATTACCO BS, ATTACCO CC, HACKING, SCHIVATA e **RESET**. Il Reset si dichiara anche contro un BS: non difende dal colpo, e il tabellone mostra due Tiri Normali.

**AR-02 — Normale, contro un HACKING**
- **Atteso:** come AR-01 ma **senza SCHIVATA**.

**AR-03 — IMM-A, contro un ATTACCO BS**
- **Atteso:** solo SCHIVATA.

**AR-04 — IMM-B, contro un HACKING**
- **Atteso:** solo RESET.

**AR-05 — IMM-B, contro un ATTACCO BS**
- **Atteso:** solo RESET.

**AR-06 — Stordito, contro un ATTACCO BS**
- **Atteso:** solo SCHIVATA e RESET.

**AR-07 — Ingaggiato, contro un ATTACCO BS**
- **Atteso:** solo ATTACCO CC, SCHIVATA e RESET.

**AR-08 — Isolato, contro un HACKING**
- **Atteso:** ATTACCO BS, ATTACCO CC e RESET; **HACKING no** (e Schivata no, perché è un hacking).

**AR-09 — Incosciente**
- **Atteso:** l'Orc non compare fra i reattivi; è nell'elenco *«non possono reagire»*, col motivo. Ripeti con Morto e Disconnesso: lo stesso.

**AR-10 — Nascosto o in Riserva** *(riscritta)*
- **Attivo:** come sopra (Alguacil · ATTACCO BS, Combi Rifle a 8-16", contro l'Orc); sul tavolo anche il Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* in **Hidden Deployment** e il Fusilier (Missile Launcher) *(#2)* in **Riserva**
- **ARO:** Croc Man → ATTACCO BS, MULTI Sniper Rifle munizione AP, a 8-16", contro l'Alguacil
- **Atteso:** il Croc Man **compare** fra chi può reagire, con l'etichetta *«👁️ NASCOSTO: reagendo si rivela»* (si guarda la posizione scritta, righe 13893-13894). Il Fusilier in Riserva **non** c'è, nemmeno fra gli esclusi: non è sul tavolo. Dichiarato l'ARO, il Croc Man torna **Modello** nel suo roster e all'Hub (AGGIORNAMENTO, riga 13915). Sul tabellone l'Alguacil tira **14** sull'Orc e il Croc Man **12** sull'Alguacil, con la nota *«reagisce senza essere bersaglio dell'attacco: il suo è un Tiro Normale a sé»*. In ARO nessuna Sorpresa: vale solo nel Turno Attivo (righe 10125-10130).

**AR-11 — Soppressione, contro un ATTACCO BS**
- **Atteso:** tutte le voci di AR-01, col badge **SF MODE** e l'arma col profilo SF.

---

# 17. Blocco O — Deployable

**DEP-01 — Chi può piazzare**
- **Attivo:** le truppe nomadi del roster · apri il menu degli Ordini di ognuna
- **Atteso:** PIAZZARE EQUIPAGGIAMENTO compare a **tredici** truppe, con queste armi: Alguacil (Forward Observer) *(#4)* Deployable Repeater; Clockmaker (Engineer) *(#7)* D-Charges; Interventor *(#8)* FastPanda; Zero *(#9)* Shock Mine; Moran *(#19)* CrazyKoalas e D-Charges; Puppet Masters *(#22)* Shock Mine; Kulak *(#23)* Cybermine e D-Charges; Intruder (Hacker, Killer Hacking Device) *(#25)* D-Charges; Spector *(#29)* Drop Bears; Racerbot Mk-I *(#35)* PARA Mine; Clockmaker (Armed Turret) *(#39)* Armed Turret e D-Charges; Switcher *(#40)* Madtraps; Gator Pilot *(#45)* D-Charges (una volta sceso dal Gator, LOG-08). Non compare alle altre, fra cui il Puppetbot *(#17)*, il Krakot *(#31)* e il Bambabot-1 *(#32)*: Chest Mine e Mine Dispenser non hanno il Tratto Deployable.

**DEP-02 — Le domande bloccano prima**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** due domande (Marker nell'area d'innesco; percorso libero). Il tasto resta **RISPONDI ALLE DOMANDE** finché ne manca una. Il **sì** al Marker da solo **non** blocca: compare una terza domanda, *«C'è anche un nemico valido, NON in forma di Marker, dentro l'area d'innesco?»*, e il tasto dice ancora RISPONDI ALLE DOMANDE. Rispondendo **no** il tasto diventa **IDLE** giallo, col motivo *«Piazzamento NEGATO: un Marker mimetico nemico nell'area d'innesco, e nessun nemico valido scoperto (riga 7572).»*: premendolo nessun segnalino nasce e l'uso non si scala. Rispondendo **sì** il tasto dice **PIAZZA** e il koala nasce. La risposta che lascia piazzare è **verde**, quella che blocca **gialla**.

**DEP-03 — Piazzamento riuscito**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO, rispondendo **no** al Marker e **sì** al percorso
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** nasce **CrazyKoala #1**, categoria PERIMETER, a vista, ARM 0 BTS 0 STR 1 S 1. L'uso scende a **1/2**. La schermata dice che il segnalino è bersagliabile **dal prossimo Ordine**, e che in questo il nemico reagisce solo contro il Moran.

**DEP-04 — Terzo koala**
- **Attivo:** Moran *(Nomadi #19)*, dopo due piazzamenti · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **Atteso:** l'arma è bloccata, *«usi esauriti»* (E17). Nessun terzo segnalino.

**DEP-05 — ARO contro chi piazza**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Modello · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro il Moran
- **Atteso:** **TIRO NORMALE**, *«L'attaccante non tira: Burst 0»*. Il Fusilier tira **12** (12 +3 −3 Mimetismo del Moran) B1; salvezza del Moran **ARM VS 7 ×1**. Il segnalino appena nato non è fra i bersagli dell'ARO.

**DEP-06 — Il koala scatta**
- **Attivo:** nel turno PanOceania, Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE, e finisce nella Zona di Controllo del CrazyKoala del Moran
- **ARO:** il CrazyKoala → si attiva da solo; alla domanda *«è dentro la ZdC, con percorso libero?»* rispondi **sì**. Il Fusilier risponde con una SCHIVATA
- **Atteso:** il segnalino compare nella schermata ARO **separato** dalle truppe: non dichiara, si attiva. Sul tabellone **uno scontro solo**, *«CrazyKoala #1 detona su …»*: il koala **DETONAZIONE, Nessun dado**; il Fusilier **SCHIVATA (Tiro Normale)** a **PH 10**, senza il −3 (il koala non è una Sagoma); salvezza **SHOCK, ARM VS 6 ×1**. Nessun *«TIRO DI SUPPORTO / DIFESA»* a parte. Due note, una volta sola ciascuna: *«L'unico modo di evitarlo è una Schivata riuscita»* e *«Dopo la detonazione l'arma è rimossa dal gioco»*.

**DEP-07 — Il koala non scatta, la mina sì**
- **Attivo:** nel turno PanOceania, nella Zona di Controllo del CrazyKoala: (a) Zulu-Cobra *(PanOceania #10)* come **Marker CAMO** · MUOVERE; (b) Fusilier *(#1)* · MUOVERE, lasciando **senza risposta** la domanda sulla ZdC; (c) Zulu-Cobra come **Marker CAMO** · MUOVERE → MUOVERE nell'area d'innesco della Shock Mine di Zero *(Nomadi #9)*, e nella seconda metà si rivela
- **ARO:** il CrazyKoala; poi la Shock Mine
- **Atteso:** (a) il koala non scatta: *«Non scatta contro Marker Mimetici o Impersonation…»*. (b) non si risolve finché non rispondi: *«Percorso non verificato: chiedere se è libero prima di risolvere.»* (c) la mina chiede *«Un Modello o Marker nemico ha dichiarato o eseguito una Skill o un ARO dentro l'area di innesco…?»*: per un Marker che muove la risposta è **sì** e la mina scatta (REGOLE, 26 ottobre); la rivelazione nella seconda metà non la annulla. Il caso *«un Deployable non ne attiva un altro»* non si costruisce al tavolo (un segnalino non si attiva da solo): sta nel banco.

**DEP-08 — Il segnalino muore**
- **Attivo:** prima, nel turno PanOceania, Fusilier (Forward Observer) *(PanOceania #3)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · Deployable Repeater, **senza domande** (il Repeater non ha area d'innesco: il divieto del Marker CAMO vale solo per le armi con un'area, riga 7572; REGOLE, 26 ottobre); il tasto dice subito **PIAZZA**. Poi, nel turno nomade, Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** il Deployable Repeater, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** salvezza **ARM VS 7 ×1** (ARM 0 + PS 7). Se fallisce passa **direttamente a Morto** e si rimuove: *«Un Deployable che entra in Stato Incosciente passa automaticamente a Morto…»*. Controprova: Machinist (Combi Rifle) *(PanOceania #13)* · TECH RECOVERY sul Repeater: rifiutato, *«È un Deployable: passa direttamente a Morto, non c'è nulla da riparare.»*

**DEP-09 — Disco Ball**
- **Attivo:** Kulak (Hacker, Killer Hacking Device) *(Nomadi #23)* · ATTACCO BS
- **Con:** Disco Baller
- **Bersaglio:** un punto del tavolo: il Disco Baller è Targetless, a 8-16"
- **ARO:** nessuno
- **Atteso:** il Disco Baller è fra le armi dell'ATTACCO BS (*«Usi residui: 2 su 2»*), non più del FUOCO SPECULATIVO, e non è fra quelle di PIAZZARE EQUIPAGGIAMENTO. La scheda è **PUNTO SUL TAVOLO**, *«Arma Targetless: si tira su un punto del tavolo, non su una truppa…»*, con la voce *«Double Shot: +1 Burst (consuma tutti e 2 gli usi)»*. Sul tabellone **TIRO NORMALE**, il Kulak **13** con **2** dadi; dopo il colpo il Disco Baller è a **2 su 2**. Se il tiro riesce si mette una Sagoma Circolare di Eclipse, **senza** domande di piazzamento (REGOLE, 26 ottobre); alla Fase Stati si toglie **la Sagoma, non il segnalino**. Sul tabellone la nota *«Se il tiro RIESCE nasce il segnalino (Disco Ball) dove e` caduto il colpo. Sulla Disco Ball si appoggia una Sagoma Circolare di munizione ECLIPSE, centrata sul segnalino…»*. Dopo l'invio la finestra *«🎯 Disco Baller: tira al tavolo. Il tiro è RIUSCITO?»*. **OK**: *«✅ Disco Baller: segnalino piazzato.»*, la **Disco Ball** entra nel roster e arriva all'Hub. **Annulla**: *«❌ Disco Baller: tiro fallito, nessun segnalino. L'uso è comunque speso.»*. Controprova: lo stesso Kulak con l'AP Submachine Gun, nessuna finestra e nessuna nota.

**DEP-10 — Minelayer in schieramento**
- **Attivo:** Puppet Masters (Minelayer) *(Nomadi #22)*, nella fase di schieramento
- **Con:** Shock Mine
- **Atteso:** nella pagina degli stati **«MINELAYER: piazzati 0 su 1»**, un bottone per arma da piazzare, ognuno con i suoi usi. Due conferme: nessun nemico né Marker nell'Area d'Innesco (solo per le armi che **hanno** un'area: mine e Perimeter; senza risposta, E54) e punto dentro la propria Zona di Schieramento. Senza tutte e due non si piazza. Piazzata, la mina arriva all'avversario come **SEGNALINO MIMETICO 1**; «piazzati 1 su 1» e i bottoni spenti: un secondo piazzamento non piazza niente.

**DEP-11 — La torretta non è scenografia**
- **Attivo:** prima Clockmaker (Armed Turret) *(Nomadi #39)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · Armed Turret; Moran *(#19)* piazza un CrazyKoala; Zero *(#9)* piazza una Shock Mine. Poi, nel turno PanOceania: Fusilier (Combi Rifle) *(#1)* · ATTACCO BS; Orc (Hacker, Hacking Device) *(#4)* · HACKING; Machinist (Combi Rifle) *(#13)* · DEACTIVATOR. Poi lo stesso al contrario: Salyut (Deactivator, Repeater) *(Nomadi #43)* · DEACTIVATOR contro i segnalini di PanOceania
- **Atteso:** l'Armed Turret arriva a PanOceania **a vista**. È fra i bersagli dell'ATTACCO BS e del Deactivator, **non** fra quelli dell'HACKING, e non compare fra gli elementi scenici. Il Deactivator vede **la torretta, il koala, il Repeater e le mine già scoperte**, che stanno nel roster nemico; la mina ancora in CAMO no (arriva come MARKER), e mai i Marker.

---

# 18. Blocco P — Logistica

**LOG-02 — Ingresso in campo**
- **Attivo:** Spector (Parachutist, Combat Jump) *(Nomadi #29, PH 13)*, in Riserva: apri il suo menu degli Ordini, poi INGRESSO IN CAMPO (AD)
- **ARO:** nessuno
- **Atteso:** la schermata mostra **PH 13** con la voce *«PH di <soprannome>: 13»*, poi una domanda bloccante sul punto di atterraggio con **sei divieti** (l'ultimo, solo per il Combat Jump: niente Visibilità Bassa, Pessima o Zero, Fumo ed Eclipse compresi). Finché non rispondi il tasto dice **RISPONDI ALLA DOMANDA**. Prima del tiro il riquadro *SE IL TIRO FALLISCE*: si entra comunque dalla propria Zona di Schieramento, come Modello e senza i Deployable. Nel menu dello Spector in Riserva c'è **SOLO** «INGRESSO IN CAMPO (AD)». Controprova: lo stesso Spector schierato sul tavolo ha il menu normale, **senza** Ingresso; l'Alguacil (Combi Rifle) *(#1)* non ha la voce.

**LOG-03 — Request Speedball**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10)*, poi Squalo Mk-II (MULTI Marksman Rifle) *(PanOceania #12, PH 15)* · REQUEST SPEEDBALL
- **ARO:** nessuno
- **Atteso:** per tutti e due **14**, con la voce *«PH fisso 14: non quello della truppa»*. Servono **due** Token: il primo si sceglie, il secondo si tira sulla tabella (1-3 VITAPACK, 4-6 AUTOREPAIRS, 7-10 SWITCH ON, 11-13 JETPACK, 14-16 OVERKILL, 17-20 NANOSHIELD).

**LOG-04 — Moto: scendere e risalire** *(nuova)*
- **Attivo:** Zondnautica-A *(Nomadi #18)* · SCENDI DALLA MOTO
- **ARO:** nessuno
- **Atteso:** in sella il menu ha **SCENDI DALLA MOTO** e non RISALI. Scelta la voce: la Zondnautica-A diventa **Zondnaut-A** e nasce una seconda unità, **Zondmate (REM)** (STR 1), nello stesso Gruppo; l'Hub la vede; all'avversario parte l'**allarme ARO** e a te si offre la **seconda metà**. A piedi il menu del pilota ha **RISALI SULLA MOTO** e non SCENDI. Moto messa **Isolata** dall'editor: il pilota **non ha** RISALI. Moto sana: RISALI → torna **Zondnautica-A**, la moto esce dal roster. Controprova: l'Alguacil (Combi Rifle) *(#1)* non ha nessuna delle tre voci nel menu.

**LOG-05 — SCENDI DAL TAG: il pilota esce e risale**
- **Attivo:** Anaconda (Heavy Machine Gun) *(Nomadi #41)* · SCENDI DAL TAG dal menu degli Ordini (o, come prima, editor degli stati → **🪂 ESCAPE SYSTEM: FAI USCIRE IL PILOTA**)
- **Atteso:** *«Il pilota scende e si piazza a contatto di Silhouette col TAG (regola della casa, metà Ordine di Movimento).»* **Niente** Sagoma di Eclipse. Il TAG resta sul tavolo **vuoto**: icona TAG VUOTO sulla riga, non attivabile, e il suo menu non offre più SCENDI DAL TAG (chiamato lo stesso: *«Il pilota e` gia` uscito.»*); all'Hub la scheda dice **TAG VUOTO**. Nasce il pilota **Operator (Spitfire)** nello stesso Gruppo. In ARO il TAG vuoto non si sceglie: *«TAG vuoto: il pilota è uscito (Escape System). Non dichiara ARO finché non risale.»*; il pilota sì. Il menu del pilota ha **RISALI SUL TAG**: scelto, il pilota esce dal roster e il TAG torna attivo. Controprova: TAG messo **Morto** → RISALI negato, *«Il TAG e` distrutto (Stato Nullo): non si risale.»*

**LOG-06 — La seconda metà: solo quello che la truppa può fare** *(nuova)*
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → guarda la seconda metà; poi Zondnautica-A *(Nomadi #18)* · SCENDI DALLA MOTO → guarda la seconda metà
- **ARO:** nessuno
- **Atteso:** l'Alguacil **non** ha SCENDI DALLA MOTO, RISALI SULLA MOTO né RISALI SUL TAG, e nemmeno HACKING; ATTACCO BS sì. Il pilota appena sceso ha **RISALI SULLA MOTO**, e non SCENDI né RISALI SUL TAG.

**LOG-07 — Foto collegate: pilota, moto, Escape** *(nuova)*
- **Attivo:** in schieramento, Zondnautica-A *(Nomadi #18)* e Anaconda (Heavy Machine Gun) *(Nomadi #41)*; poi in partita Zondnautica-A · SCENDI DALLA MOTO, RISALI SULLA MOTO; Anaconda · editor degli stati → ESCAPE SYSTEM
- **Con:** le foto delle miniature, dalla galleria dello schieramento
- **Bersaglio:** nessuno
- **Atteso:** scelta la foto della Zondnautica, la galleria chiede **subito** quella del pilota (**Zondnaut-A**), poi quella della moto (**Zondmate**), senza le foto già prese; per l'Anaconda chiede il solo pilota (**Operator**). **NESSUNA FOTO** è una risposta valida. In partita: SCENDI → il pilota e la moto hanno **le loro** foto; RISALI → torna la foto della Zondnautica montata; ESCAPE SYSTEM → il pilota con la sua, il TAG vuoto tiene la sua. Senza scelta: il pilota **senza** foto, la moto con quella della montata. L'avversario vede la foto in uso, mai le scelte. Controprova: un Alguacil (Combi Rifle) *(#1)* non chiede nessuna foto collegata.

**LOG-08 — Pilota di lista: Gator** *(nuova)*
- **Attivo:** in schieramento Gator (TAG) *(Nomadi #44)* e Gator Pilot (CC Attack [+9]) *(#45)*, conferma lo schieramento; poi in partita Gator · SCENDI DAL TAG, e Gator Pilot · RISALI SUL TAG
- **ARO:** nessuno
- **Atteso:** il pilota parte **a bordo** del Gator: sulla riga *«[ A BORDO DEL GATOR: NON SI SCHIERA ]»*, non riceve Ordini (*«È a bordo del TAG: prima SCENDI DAL TAG (Ordine al TAG).»*), e PanOceania e l'Hub vedono **solo il Gator**. SCENDI DAL TAG: scende **lui**, il #45 (nessun pilota nuovo), a contatto col TAG, e ora l'avversario lo vede. RISALI SUL TAG: torna **a bordo**, resta nel roster e sparisce di nuovo dalla vista dell'avversario. Con due Gator il secondo pilota va sul TAG libero; mai su una replica (banco). Lo stesso vale per Szalamandra e Gecko (regola della casa di Paolo).

---

# 19. Blocco Q — Fireteam

**FT-01 — Livello = truppe della stessa Unità**
- **Attivo:** Alguacil *(Nomadi #1, #2, #3, #4, #5)* messi in **TEAM A** dall'editor degli stati (il #1 **Leader**), tutti nello stesso Gruppo; poi dai un Ordine all'Alguacil #1
- **Atteso:** il banner in cima alla pagina delle azioni dice **🔥 FIRETEAM A — LIVELLO 5 (5 membri) 🔥** e i cinque bonus: *BS Attack (+1 SD) | +3 Discover | +1 Schivata | +1 BS | Sesto Senso*.

**FT-02 — Cinque truppe diverse**
- **Attivo:** Alguacil *(#1)*, Grenzer (Marksmanship) *(#11)*, Zero *(#9)*, Daktari *(#6)*, Morlock (Assault Pistol) *(#13)* messi in **TEAM A** dall'editor degli stati (l'Alguacil **Leader**), tutti nello stesso Gruppo; poi dai un Ordine all'Alguacil
- **Atteso:** il banner dice **🔥 FIRETEAM A — LIVELLO 1 (5 membri) 🔥**, con la nota *«Livello 1 su 5 membri: solo 1 appartengono alla stessa Unità.»* e *Bonus: nessuno*.

**FT-03 — Il +1 BS**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, in Fireteam con gli Alguacil #2, #3, #4 (Livello 4) · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** **15**, con le voci *«Gittata: +3»* e *«Fireteam di Livello 4: +1 BS»*. Con un Fireteam di tre Alguacil (Livello 3): **14**. **Difetto aperto** (blocco V): dal Livello 2 il banner scrive *BS Attack (+1 SD)*, ma il dado speciale non arriva al Burst.

**FT-04 — Non vale per lo Scoprire**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* in Fireteam di Livello 4 (#1-#4) · SCOPRIRE
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* come Marker CAMO, a 0-8"
- **ARO:** nessuno
- **Atteso:** **13** = 13 +3 −6 +3, con la voce *«Fireteam di Livello 4: +3 Discover»*: c'è il +3 Discover e **non** il +1 BS. La nota dice *«I bonus "BS Attack (+1 SD)" e "+1 BS" NON si applicano a Discover.»* (Per l'HACKING servirebbero quattro Interventor: la prova sta nel banco.)

**FT-05 — Rotture**
- **Attivo:** Fireteam con gli Alguacil #1-#4 · metti all'Alguacil #2, uno per volta, gli stati Incosciente, Morto, Isolato, Soppressione, IMM-A, IMM-B
- **Atteso:** escono dal Fireteam con Incosciente e Morto (causa Stato Nullo), Isolato, Soppressione. **Non** escono con IMM-A e IMM-B, e la nota lo dice.

**FT-06 — Neurocinetics**
- **Attivo:** Sin-Eater (MULTI Sniper Rifle) *(Nomadi #20)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle (AP Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** Burst **1**, voce *«Neurocinetics: Burst 1 in Turno Attivo su tutte le armi BS»*. In ARO (vedi BS-25) la stessa arma ha Burst **2**.

---

# 20. Blocco R — Ordine Coordinato

Tutte le prove: truppe dello stesso Gruppo, dove non è scritto altro. Bersaglio
**Fusilier (Combi Rifle)** *(PanOceania #1)* a 8-16", copertura no.

**CO-01 — Burst della Punta di Lancia**
- **Attivo:** Coordinato con Alguacil (HMG) *(Nomadi #2)* Punta di Lancia, Alguacil (Combi Rifle) *(#1)* e Alguacil (Missile Launcher) *(#3)* · ATTACCO BS
- **Con:** Heavy Machine Gun per la Punta
- **ARO:** nessuno
- **Atteso:** la Punta ha Burst **2**: *«Burst dell'arma Heavy Machine Gun»* e *«Punta di Lancia: metà del Burst arrotondata per eccesso»*.
- **Poi** *(aggiunta)*: come Punta l'Alguacil (HMG) *(#2)* e come gregario l'Alguacil (Combi Rifle) *(#1)*; nella pagina dei bersagli la Punta tocca il Fusilier, poi l'Orc *(PanOceania #4)*, a 0-8". Il secondo tocco **sostituisce** il primo: resta scelto **solo l'Orc** (ritoccandolo la scelta si svuota). L'allarme ARO nomina solo **«Orc»**, e nessun avviso di taglio compare. Il gregario non sceglie: scelta l'arma è già sull'Orc, nella pagina dei modificatori. Sul tabellone Punta **8** con 2 dadi, gregario **14** con 1, il Fusilier non c'è. In console: due partecipanti su bersagli diversi → **E61**; una truppa con due bersagli → **E60**. Controprove: nell'Ordine singolo i due tocchi danno due bersagli; nel Coordinato con una Sagoma d'Impatto il secondario si aggiunge.

**CO-02 — Gregari**
- **Attivo:** lo stesso Coordinato di CO-01
- **Con:** Combi Rifle per il #1, Missile Launcher (Blast Mode) per il #3
- **Atteso:** tutti e due Burst **1**, *«Gregario in Ordine Coordinato: Burst 1»*.

**CO-03 — Un membro di un Fireteam non si coordina** *(riscritta)*
- **Attivo:** Fireteam con gli Alguacil #1, #3, #4, #5, Leader il #1. Coordinato con Alguacil (HMG) *(#2)* Punta di Lancia e il #1, poi CONFERMA SQUADRA
- **Atteso:** **E49**: *«⛔ ORDINE COORDINATO NON VALIDO — … fa parte del Fireteam A, non partecipa a un Ordine Coordinato.»* (riga 11552: *members of a Fireteam cannot be part of a Coordinated Order*), e il menu degli Ordini non si apre. Controprova: tolto il #1 dal Fireteam, il Coordinato parte e il #1 gregario ha **Burst 1** (*«Gregario in Ordine Coordinato: Burst 1»*): con il Combi Rifle a 0-8" **14**, un dado.

**CO-04 — Cinque unità**
- **Attivo:** Coordinato con gli Alguacil #1-#5
- **Atteso:** **E41**, *«Ordine Coordinato con 5 unità: il massimo è 4»*.

**CO-05 — Nessuna unità**
- **Attivo:** apri il Coordinato e conferma senza selezionare nessuno
- **Atteso:** **E40**.

**CO-06 — Senza Punta**
- **Attivo:** Coordinato con gli Alguacil #1 e #2, senza designare la Punta di Lancia
- **Atteso:** **E45**, *«Nessuna Punta di Lancia designata»*.

**CO-07 — Punta fuori dal gruppo**
- **Attivo:** in console, un Coordinato con #1 e #2 e come Punta l'Alguacil #3
- **Atteso:** **E46**, *«La Punta di Lancia non è fra le unità selezionate»*.

**CO-08 — Unità non attivabile**
- **Attivo:** Coordinato con #1 Punta e #2 messo **Incosciente**
- **Atteso:** **E42**, col nome dell'Alguacil #2: *«…: Stato Nullo: non può dichiarare Ordini attivi»*.

**CO-09 — Gruppi e Addestramento**
- **Attivo:** (a) #1 nel Gruppo 1 e #2 nel Gruppo 2, Punta il #1; (b) Morlock (Kobra Pistol, DA CC) *(#36, Irregolare)* e Alguacil #1, Punta l'Alguacil; (c) i due Morlock *(#13 e #36)*
- **Atteso:** (a) **E43**, *«Le unità appartengono a 2 Gruppi di Combattimento diversi»*. (b) **E44**, *«Le unità hanno Addestramento diverso: Regolari e Irregolari non possono coordinarsi.»* (c) passa: due Irregolari hanno lo stesso Addestramento.
- **Poi** *(aggiunta)*: con una **lista salvata prima** che il database avesse il campo `chars`, Morlock (Assault Pistol) *(#13)* e Mobile Brigada (HMG) *(#16)* → **E44** (Paolo l'aveva visto passare); i due Morlock *(#13 e #36)* passano.

**CO-10 — Fuori gittata in un Coordinato**
- **Attivo:** Coordinato con Alguacil (Missile Launcher) *(#3)* Punta e Alguacil (Combi Rifle) *(#1)* · ATTACCO BS
- **Bersaglio:** il Fusilier a 48-56": dentro la gittata del Missile Launcher (Hit Mode, −3), **FUORI** per il Combi Rifle, che arriva a 48"
- **ARO:** nessuno
- **Atteso:** la Punta ha ESEGUI CALCOLO; il gregario, toccato FUORI, ha il tasto **«IDLE (SOLO QUESTA TRUPPA)»**. Premuto, parte **una** busta: la Punta tira, il gregario a Burst 0 col motivo, l'Ordine non si blocca (righe 11374-11376). Sul tabellone il tiro della Punta, **8** (11 −3), e uno scontro **IDLE (REQUISITO FALLITO)** per il gregario: *«Greg: requisito non soddisfatto contro … (fallimento automatico: fuori gittata)»*. Nessuna finestra *«Prima di calcolare…»*: l'avviso dell'Idle del gregario è **A110**, una nota, e l'Ordine parte comunque. Nell'Ordine singolo, un bersaglio senza requisito mentre gli altri lo hanno dà lo stesso scontro IDLE (prima i suoi dadi sparivano senza scontro).

**CO-11 — Coordinato in CC**
- **Attivo:** Coordinato con Morlock (Assault Pistol) *(#13)* Punta, Chimera *(#14)* e Alguacil *(#1)* · ATTACCO CC
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto con tutti e tre
- **Atteso:** tira solo la Punta, Burst **3**, *«Punta di Lancia: +2B per gli alleati»*. I due gregari Burst **0**, *«Gregario in Ordine Coordinato: in mischia non tira»*.

**CO-12 — Un ARO per nemico**
- **Attivo:** Coordinato con gli Alguacil #1 e #2 · MUOVERE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16"
- **Atteso:** l'elenco dei bersagli dell'ARO offre tutti e due gli Alguacil, ma se ne sceglie **uno solo**.

**CO-13 — Command Token**
- **Attivo:** Coordinato con gli Alguacil #1 e #2
- **Atteso:** il promemoria che il Command Token si scala **a mano**.

**CO-14 — L'icona della Punta di Lancia** *(nuova)*
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* e Alguacil (HMG) *(#2)* · ORDINE COORDINATO, il #1 Punta di Lancia, poi conferma la squadra
- **Atteso:** mentre scegli la squadra la riga del #1 ha l'icona della Punta di Lancia (`img/icon_spearhead.png`; senza il file la scritta), il #2 no. Nel riquadro in alto della pagina dell'Ordine: *-- ALGUACIL --* con l'icona e **PUNTA DI LANCIA — metà Burst — B2**; per il #2 **[GREGARIO — Burst 1]**, senza icona. Controprova: in un Ordine singolo nessuna icona.

---

# 21. Blocco S — Schieramento

**SCH-01 — Anti-spoiler**
- **Attivo:** PanOceania schiera Croc Man *(#6)* **Nascosto**, Fusilier (Combi Rifle) *(#1)* normale, Zulu-Cobra *(#10)* **Marker CAMO**, Fusilier (Missile Launcher) *(#2)* in **Riserva**
- **Atteso:** l'app nomade riceve il Fusilier (Combi Rifle), un **SEGNALINO MIMETICO** al posto dello Zulu-Cobra e il Fusilier (Missile Launcher). Il Croc Man non compare, né lì né all'Hub. Nell'app di **PanOceania** la riga del Croc Man ha, **grande fra le icone degli stati** a destra, il segnalino `img/panoceania/icon_hidden.png`, **senza numero** e **senza scritta** (niente *HIDDEN*: Paolo, 27 ottobre sera); lo Zulu-Cobra (Mimetismo −3) porta *CAMO-3 1*. Rivelato il Croc Man, il segnalino sparisce.

**SCH-02 — Chi è nascosto non è sul tavolo**
- **Attivo:** con lo schieramento di SCH-01, Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS, poi SCOPRIRE; Alguacil (Missile Launcher) *(#3)* · ATTACCO BS in Blast Mode sul Fusilier #1
- **Atteso:** il Croc Man non è bersagliabile, non è Scopribile, e la Sagoma non lo prende. Il promemoria dell'Infiltrazione compare anche per lui, col numero: **Tiro a 9 (PH 12 − 3)**.

**SCH-03 — Senza motore non si spedisce**
- **Attivo:** togli lo `<script>` del motore da `app.html` e schiera
- **Atteso:** non parte niente, con un messaggio esplicito.

**SCH-04 — Bersagli solo fra gli schierati**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Atteso:** l'elenco dei bersagli ha solo le truppe PanOceania schierate.

**SCH-05 — Terreni solo fra quelli in schieramento**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS sul Fusilier #1 · tocca la riga Terreno
- **Atteso:** compaiono solo i cinque terreni del capitolo 1.2, più Fumo ed Eclipse.

**SCH-06 — Marker numerati: una serie per segnalino** *(nuova)*
- **Attivo:** in schieramento metti in CAMO Zero *(Nomadi #9)*, Intruder (HMG) *(#24)* e Saito Togan *(#33)*; metti in **IMP-1** dall'editor degli stati Interventor *(#8)* e Kulak *(#23)*; poi conferma lo schieramento
- **Atteso:** accanto al nome, nella tua app: Interventor **IMP-1 1**, Zero **CAMO-3 1**, Kulak **IMP-1 2**, Intruder (HMG) **CAMO-3 2**, Saito **CAMO-6 1**. Il segnalino lo decide il Mimetismo del profilo (−3 → CAMO-3, −6 → CAMO-6) e, per gli IMP, il livello: ogni segnalino ha la sua serie. L'avversario e l'Hub vedono *«SEGNALINO MIMETICO (-3) 1»*, *«SEGNALINO MIMETICO (-3) 2»*, *«SEGNALINO MIMETICO (-6) 1»*, *«PERSONAGGIO SCONOSCIUTO (IMP-1) 1»* e *«PERSONAGGIO SCONOSCIUTO (IMP-1) 2»*, con le immagini nella cartella dell'esercito di **chi possiede** il segnalino: `img/nomadi/camo-3_1.png`, `camo-3_2.png`, `camo-6_1.png`, `imp-1_1.png`, `imp-1_2.png` (senza il file, la copia comune in `img/`); nessun nome vero. Poi lo Zero si rivela e metti in CAMO l'Intruder (MULTI Sniper Rifle) *(#10)*: prende **CAMO-3 1**, l'Intruder (HMG) resta CAMO-3 2. Poi il Kulak passa a IMP-2 dall'editor: **IMP-2 1**, l'Interventor resta IMP-1 1. Il CAMO semplice è la mina: piazza una Shock Mine con lo Zero, che arriva come **SEGNALINO MIMETICO 1**, mimetismo 0, `img/nomadi/camo_1.png` — un CAMO **senza** mimetismo, non CAMO-3. L'undicesimo Marker di una serie (numero sì, immagine no) lo tiene `test_novita_20ott.js`.

**SCH-07 — Repliche: Holoecho e Decoy** *(nuova)*
- **Attivo:** in schieramento Bashi Bazouk (BS Attack (AP)) *(Nomadi #42)* → **CREA LE REPLICHE (Holoecho)**; Knauf *(#46)* → Decoy; poi conferma lo schieramento
- **Atteso:** il Bashi ha **due** copie, il Knauf **una** (Decoy (1)). All'avversario e all'Hub le tre del Bashi arrivano **identiche**, *«COPIA OLOGRAFICA 1 / 2 / 3»* coi numeri dati a caso, senza nessun campo che dica chi è la replica. Nella tua app la riga dice **— VERA** o **— REPLICA**. Una replica non riceve Ordini (*«È una copia olografica: si muove con l'Ordine della truppa vera…»*); quando un attacco la prende, nell'ARO del proprietario c'è la nota *«E` una REPLICA: se l'Attacco riesce non fa il Tiro Salvezza, si toglie dal tavolo…»*. Tolte tutte e due le copie, cade l'Holoecho della vera; se la vera si rivela, le repliche escono dal roster. All'avversario i tre identificativi hanno **la stessa forma**, e l'ordine è quello dei numeri dati a caso: la vera non è sempre la prima. Nemmeno il numero in fondo all'identificativo la tradisce: pesca nello stesso intervallo della lista.

**SCH-08 — HoloMask sul tabellone** *(nuova)*
- **Attivo:** Bashi Bazouk *(Nomadi #42)* in **HoloMask** che imita Alguacil (Combi Rifle) *(#1)*; nel turno PanOceania Fusilier (Combi Rifle) *(PanOceania #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** il Bashi, a 8-16", senza copertura
- **ARO:** il Bashi → SCHIVATA
- **Atteso:** fra le Truppe Imitabili **solo la stessa Silhouette**, raggruppate per Unità (circa **105** truppe, con le varianti dentro: non 290 voci). Sul tabellone il reattivo è **«Alguacil (Combi Rifle)»**, *SCHIVATA*, **10**; nessuna traccia di «Bashi», nemmeno nell'HTML; la salvezza è sull'ARM **vera** del Bashi, **ARM VS 9 ×1** (ARM 2 + PS 7: l'Alguacil ha ARM 1). Niente «Sconosciuta» nelle armi.

**SCH-09 — Gli stati di schieramento li decide il motore** *(nuova)*
- **Attivo:** in schieramento apri la pagina degli stati (tocco rapido sulla riga) di Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*, poi di Alguacil (Combi Rifle) *(Nomadi #1)*, Zero (Hacker, Killer Hacking Device) *(#9)*, Spector (Parachutist, Combat Jump) *(#29)* e Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle) *(#19)*; il Croc Man → **SEGNALINO CAMO (-6)**, lo Spector → **SCHIERAMENTO AEREO**, il Moran in CAMO → **TIRO DI INFILTRAZIONE FALLITO**, poi **NORMALE**; conferma lo schieramento
- **Atteso:** le scelte, in quest'ordine: Croc Man **NORMALE**, **SEGNALINO CAMO (-6)**, **HIDDEN DEPLOYMENT** (con l'icona `img/panoceania/icon_hidden.png` a sinistra della scritta; la nota *«Non si piazza niente: annota la posizione…»* sta nella ⓘ, sotto *HIDDEN DEPLOYMENT*); Alguacil solo **NORMALE**; Zero **NORMALE**, **SEGNALINO CAMO (-3)**; Spector **NORMALE**, **SCHIERAMENTO AEREO** (nella ⓘ *«…entra nel tuo Turno Attivo con INGRESSO IN CAMPO…»*); Moran **NORMALE**, **SEGNALINO CAMO (-3)**, e da nessuna parte *«RISERVA / AD»*. Riaprendo la pagina la scelta fatta è accesa. Dopo il tiro fallito il Moran resta in CAMO, la voce CAMO resta accesa e toccabile, il tasto del tiro sparisce; tornato **NORMALE**, la voce CAMO è **spenta** e non si tocca, con la nota *«Camouflage (1 Use): lo stato CAMO è già stato usato in questa partita (F07).»*. Confermato: l'app nomade vede il Croc Man come *«SEGNALINO MIMETICO (-6) 1»*, l'Hub come MARKER; lo Spector non arriva né all'Hub né a PanOceania.

---

# 22. Blocco T — Terreni

Tre attaccanti, uno per livello di visore: **senza visore** Alguacil (Combi
Rifle) *(Nomadi #1, BS 11)*; **MSV L1** Grenzer (Forward Observer, Sensor, NCO)
*(#12, BS 13)*, col Combi Rifle; **MSV L2** Intruder (HMG) *(#24, BS 13)*, con
la Heavy Machine Gun. Ognuno · ATTACCO BS sul **Fusilier (Combi Rifle)**
*(PanOceania #1)* a 8-16", copertura no, ARO nessuno; il terreno si sceglie
sulla riga Terreno della scheda del bersaglio. Senza terreno i tre tirano a
**14 B3**, **16 B3** e **13 B4**.

**TER-01 — Bosco (TER_10)**
- **Atteso:** Alguacil **11 B2**, con la voce *«Zona di Saturazione: -1 B. Bassa Visibilità: -3 BS.»*; Grenzer **16 B2**; Intruder **13 B3**. Il −1 al Burst lo prendono tutti: nessun visore toglie la Saturazione.

**TER-02 — Giungla (TER_11)**
- **Atteso:** Alguacil **8 B2** (Pessima Visibilità −6); Grenzer **13 B2**, voce *«Pessima Visibilità: MSV1 riduce a -3 BS.»*; Intruder **13 B3**. Qui L1 e L2 si separano.

**TER-03 — Foresta Primordiale (TER_13)**
- **Atteso:** Alguacil **nessuna LoF**: l'attacco non ha un Valore; Grenzer **10 B2**, voce *«Visibilità Zero: MSV1 permette LoF con -6 BS.»*; Intruder **13 B3**.

**TER-04 — Sala Generatori (TER_17)**
- **Atteso:** Alguacil **14 B2** (solo la Saturazione); Grenzer e Intruder **nessuna LoF**. Il Rumore Bianco punisce chi ha il visore.

**TER-05 — Tempesta (TER_15)**
- **Atteso:** Alguacil **11 B3**, voce *«Bassa Visibilità (dalla Tempesta…): -3 BS.»*, e **nessun** −1 al Burst; Grenzer **16 B3**; Intruder **13 B4**. La Tempesta non è una Zona di Saturazione.

**TER-06 — Lo Speculativo ignora la Visibilità** *(riscritta)*
- **Attivo:** Marspider (Grenades) *(Nomadi #38, PH 13, nessun visore)* · FUOCO SPECULATIVO; poi lo stesso · ATTACCO BS
- **Con:** Grenades(+1B)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 0-8", copertura no; nell'ATTACCO BS il terreno **TER_10 Bosco**
- **ARO:** nessuno
- **Atteso:** nella pagina del FUOCO SPECULATIVO la casella del terreno **non c'è**, ed è voluto: si applicano solo il −6 e la gittata (*«Other negative MODs … are not applied»*, riga 3920). Tiro **10** = 13 +3 −6, con la nota *«Fuoco Speculativo: ignora i MOD NEGATIVI di Copertura, Mimetismo e Zone di Visibilità.»* e nessuna voce di Bassa Visibilità. ATTACCO BS nel Bosco: la casella c'è, **13** = 13 +3 −3, Burst 2 → **1** dado, voce *«Zona di Saturazione: -1 B. Bassa Visibilità: -3 BS.»*.

**TER-07 — Saturazione dopo la divisione** *(riscritta)*
- **Attivo:** Alguacil (HMG) *(Nomadi #2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* e Fusilier (Missile Launcher) *(#2)*, a 8-16", tutti e due in **TER_10 Bosco**
- **ARO:** nessuno
- **Atteso:** i dadi da dividere sono **4**, non 3: la Saturazione si applica DOPO la divisione, al Burst di ogni bersaglio, mai sotto 1 (righe 12640-12644). 2+2 → **1+1**; 3+1 → **2+1**. Controprova: il #2 senza terreno, 2+2 → **1+2**. Bosco + Giungla su tutti e due: **1+1**, una sola Saturazione per bersaglio (righe 12645-12648).

**TER-08 — Fumo contro MSV**
- **Attivo:** Intruder (HMG) *(Nomadi #24, MSV L2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* a 16-24", copertura no; sulla riga Terreno scegli prima **Fumo**, poi **Eclipse**
- **ARO:** Fusilier → SCHIVATA
- **Atteso:** col Fumo **TIRO NORMALE**, e la nota che il Fumo non ferma l'MSV L2. Con l'Eclipse **FACCIA A FACCIA**: l'Eclipse ferma anche i visori.

---

# 23. Blocco U — Contratto

L'invio deve essere **bloccato**. Le ER-01…ER-21 si eseguono in console,
modificando la busta prima dell'invio: sono la rete sotto i moduli.

**ER-01 — Un'azione non nel vocabolario**
- **Atteso:** **E01**.

**ER-02 — Un attaccante non nel roster**
- **Atteso:** **E03**.

**ER-03 — Un attacco senza arma**
- **Atteso:** **E07**.

**ER-04 — Un'arma inesistente**
- **Atteso:** **E08** + **A42**; **E09** se manca ogni modo di risoluzione.

**ER-05 — Nessun bersaglio**
- **Atteso:** **E04** + **E20**.

**ER-06 — Un avversario non schierato**
- **Atteso:** **E05**.

**ER-07 — Il bersaglio `generic1` («Bersaglio Primario»)**
- **Atteso:** **E06**.

**ER-08 — Un bersaglio non schierato**
- **Atteso:** **E06**.

**ER-09 — Lo stesso bersaglio due volte**
- **Atteso:** **E12**.

**ER-10 — Un bersaglio non valido per l'azione**
- **Atteso:** **E15** col motivo.

**ER-11 — Nessuna fascia di gittata**
- **Atteso:** **E13**, con l'elenco delle fasce.

**ER-12 — Fascia e MOD incoerenti**
- **Atteso:** avviso **A13**, MOD riallineato: non è un errore.

**ER-13 — Zero dadi**
- **Atteso:** **E20**.

**ER-14 — Più dadi del Burst**
- **Atteso:** **E21**.

**ER-15 — Un Burst oltre 6**
- **Atteso:** **E22**.

**ER-16 — Una difesa con due segnaposto**
- **Atteso:** **E11**.

**ER-17 — Una Soppressione con bersagli**
- **Atteso:** avviso **A10**.

**ER-18 — Un Coordinato con 5 unità**
- **Atteso:** **E31** / **E41**.

**ER-19 — Un deployable con un'arma non piazzabile**
- **Atteso:** **E16**.

**ER-20 — Un deployable con gli usi esauriti**
- **Atteso:** **E17**.

**ER-21 — `creaDeployable` con un nome invece del profilo**
- **Atteso:** **E18**.

**ER-22 — Un attacco valido**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS · Combi Rifle sul Fusilier #1 a 8-16"
- **Atteso:** nessun errore, nessun avviso, invio eseguito.

**ER-23 — Come si legge un blocco**
- **Attivo:** il caso di ER-13 (zero dadi)
- **Atteso:** a schermo un messaggio che inizia con **⛔ INVIO BLOCCATO**, un punto per errore. Mai un oggetto JavaScript.

**ER-24 — Un'eccezione in un modulo**
- **Attivo:** in console `window.goToModifiersBS = () => { throw new Error('prova') }`, poi Alguacil (Combi Rifle) *(#1)* · ATTACCO BS fino alla scelta della gittata
- **Atteso:** l'app resta viva, dice quale modulo ha ceduto, e l'Ordine **non** è consumato.

**ER-25 — Avvisi prima del calcolo**
- **Attivo:** il caso di ER-17 (Soppressione con un bersaglio: A10 ha gravità **azione**); alla finestra *«Prima di calcolare…»* tocca **Annulla**
- **Atteso:** la finestra elenca l'avviso col suo messaggio. Annullando, il payload torna con `ok:false` ed errore **UI01**, e niente parte per l'Hub. Controprova: MU-17 con la BREAKER (A50, gravità **nota**) non apre nessuna finestra.

---

# 24. Blocco DIS — Usi Disposable e dado speciale

**DIS-01 — Il Panzerfaust ha due usi**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, BS 13)* · ATTACCO BS, in tre Ordini di seguito
- **Con:** Panzerfaust
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)* a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** **13** B1, salvezza **ARM VS 7 ×3**. Dopo il primo colpo resta **1** uso, dopo il secondo **0**; al terzo Ordine il Panzerfaust è bloccato, *«usi esauriti»*.

**DIS-02 — Il (+1B) costa due usi, il (+1SD) uno**
- **Attivo:** Triphammer *(Nomadi #30, BS 13)* · ATTACCO BS, in tre Ordini; poi Spector (Parachutist, Combat Jump) *(Nomadi #29)* · FUOCO SPECULATIVO
- **Con:** Panzerfaust (+1B) per il Triphammer; Drop Bears (+1SD) per lo Spector
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 0-8", copertura no
- **ARO:** nessuno
- **Atteso:** dentro il bottone del Panzerfaust *«Usi residui: 2 su 2»*. Triphammer: **2** dadi, voci *«Burst dell'arma Panzerfaust · BS Attack (+1B): +1 Burst in Turno Attivo»*, Successo al **10** (13 −3). Dopo il colpo il Panzerfaust è a **2 su 2** usi spesi. Al secondo e al terzo Ordine il bottone dice **«⛔ USI ESAURITI (2/2) — serve un Reload»**, è spento, e toccarlo spiega lo Scarico invece di scegliere l'arma. L'Hub calcola con gli usi spesi che la busta porta (*attacco.usiSpesiAttaccante*), non con la sua copia del roster. Spector: Burst **1** più un dado speciale, e si spende **un** uso su 3.

**DIS-03 — Una Schivata non consuma**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · ATTACCO BS sul Triphammer *(Nomadi #30)*
- **ARO:** Triphammer → SCHIVATA
- **Atteso:** gli usi del Panzerfaust non cambiano.

**DIS-04 — Scarico è l'arma, non la truppa**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, rivelato, dopo tre Shock Mine piazzate (DIS-06) · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Atteso:** la Shock Mine è bloccata, *«usi esauriti»*, e il messaggio nomina lo stato **Scarico** e come si toglie (Reload, nella ZdC di un alleato con Baggage). Le altre armi dello Zero restano usabili.

**DIS-05 — Il dado speciale si vede**
- **Attivo:** Intruder (MULTI Sniper Rifle) *(Nomadi #10)*, rivelato · ATTACCO BS
- **Con:** MULTI Sniper Rifle (AP Mode) (+1SD)
- **Bersaglio:** prima Fusilier (Combi Rifle) *(PanOceania #1)*; poi Fusilier #1 e Orc #4 insieme; a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** fra i MOD *«tira 1 dado in più, poi scartane 1»*, e il Burst dell'arma **non** cresce. Con due bersagli il dado va a **uno solo**. Controprova: Alguacil (Combi Rifle) *(#1)*: Burst 3 e nessuna frase. Terza strada: Wolfgang Amadeus *(#26)* in ATTACCO CC, nota nello scontro *«Dado Speciale (+1 SD): su QUESTO bersaglio tira 1 dado in più, poi scartane 1.»*. Fuori dalle Sagome, con due bersagli e Burst 2, i dadi partono **1 e 1**, a giro.

**DIS-06 — Tre mine, e la quarta no**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, rivelato · IDLE → PIAZZARE EQUIPAGGIAMENTO, in quattro Ordini
- **Con:** Shock Mine
- **ARO:** nessuno
- **Atteso:** tre mine piazzate, usi spesi 1, 2, 3 anche riaprendo il menu. Il terzo uso **non** è respinto all'invio. Al quarto la mina è bloccata, nessun segnalino nuovo, niente parte per l'Hub.

**DIS-07 — Reload col Baggage** *(nuova)*
- **Attivo:** Triphammer *(Nomadi #30)* col Panzerfaust esaurito (DIS-02), nella ZdC del Salyut (Deactivator, Repeater) *(#43)* · RICARICARE
- **ARO:** nessuno
- **Atteso:** la finestra *«🔄 RELOAD — … È nella Zona di Controllo di un alleato con Baggage, non in Stato Nullo?»* col nome del Salyut. **OK**: *«Tri ricarica: Panzerfaust (+2)»*, il bottone torna a **2 su 2**. **Annulla**: *«⚠️ Requisito fallito: … fa IDLE. L'Ordine è speso e l'avversario ha il suo ARO.»*, gli usi restano spesi. Senza il Salyut sul tavolo, o col Salyut **Incosciente**: *«⛔ Nessun alleato con Baggage sul tavolo in stato non Nullo (riga 10489).»*, prima della domanda.

**DIS-08 — Ricarica forzata dall'Hub** *(nuova)*
- **Attivo:** all'Hub, sulla scheda del Triphammer *(Nomadi #30)* col Panzerfaust esaurito → **🔄 RICARICA**; poi in testa all'elenco dei Nomadi **🔄 RICARICA TUTTO NOMADI**
- **Atteso:** nell'app dei Nomads *«🔄 Ricarica forzata dall'Hub: …»* e il Triphammer a 2 su 2; le altre truppe no. Lo stesso comando arrivato due volte si applica **una** volta. Con RICARICA TUTTO tutte le truppe Nomadi si ricaricano; PanOceania no. PanOceania, senza armi Disposable nel roster di prova, non ha il bottone.

**DIS-09 — Gli usi dentro il bottone, in ogni Ordine** *(nuova)*
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21)* · FUOCO SPECULATIVO; Krakot Renegade (Boarding Shotgun) *(#31)* · ATTACCO INTUITIVO; Triphammer *(#30)* · ATTACCO BS; Fusilier (Combi Rifle) *(PanOceania #1)* col Panzerfaust aggiunto, in ARO
- **Atteso:** la riga *«Usi residui: X su Y»* sta **dentro** il bottone dell'arma, una volta sola, uguale nei quattro: *«Pitcher … Usi residui: 2 su 2»*, *«Chest Mines SHOCK SAGOMA DIRETTA · SMALL TEARDROP Usi residui: 2 su 2»*, *«Panzerfaust … Usi residui: 2 su 2»*, e in ARO lo stesso testo del Panzerfaust. A usi finiti il bottone è spento e il tocco spiega lo Scarico.

---

# 25. Blocco DET — Detonazione e Schivata

Per DET-01…03: Puppet Masters (Minelayer) *(Nomadi #22)* ha una **Shock Mine**
già sul tavolo. Nel turno PanOceania si muove il **Fusilier (Combi Rifle)**
*(PanOceania #1, PH 10)* dentro l'area d'innesco.

**DET-01 — La mina detona e chi l'ha innescata schiva**
- **Attivo:** Fusilier *(PanOceania #1)* · MUOVERE → SCHIVATA
- **ARO:** la Shock Mine → DETONAZIONE, contro il Fusilier
- **Atteso:** **uno scontro solo**, *«Mina Shock #1 detona su …»*: la mina **DETONAZIONE, Nessun dado**; il Fusilier **SCHIVATA (Tiro Normale) 7** (PH 10 −3, voce *«Schivata contro la Sagoma di un Deployable: -3»*), e sotto la salvezza della mina con la sua munizione: **SHOCK, ARM VS 8 ×1**. Nessun *«TIRO DI SUPPORTO / DIFESA»* a parte.

**DET-02 — Senza Schivata dichiarata**
- **Attivo:** Fusilier *(PanOceania #1)* · MUOVERE → MUOVERE
- **ARO:** la Shock Mine → DETONAZIONE
- **Atteso:** **NESSUNA SCHIVATA**: l'app non la presume.

**DET-03 — Il −3 viene dalla Sagoma**
- **Attivo:** nel turno PanOceania, Fusilier *(#1)* · MUOVERE → SCHIVATA, nella ZdC del CrazyKoala del Moran *(Nomadi #19)*
- **ARO:** il CrazyKoala → DETONAZIONE
- **Atteso:** Schivata **10**, PH pieno: il koala non è una Sagoma. Se leggi 7, il −3 è dato a tutti i deployable.

**DET-04 — Le tre domande dell'innesco**
- **Attivo:** la Shock Mine della Puppet Masters, in DETONAZIONE contro il Fusilier #1; poi Krakot Renegade *(Nomadi #31)* e Bambabot-1 *(#32)*: apri il loro menu
- **Atteso:** tre domande bloccanti: un nemico nell'area d'innesco; solo il movimento di una Schivata o di un Guts fallito; un alleato sotto la Sagoma, anche Incosciente. Con una risposta mancante la detonazione non scatta e l'app lo dice. Krakot e Bambabot-1: niente PIAZZARE EQUIPAGGIAMENTO.

**DET-05 — Il segnalino esce dal tavolo**
- **Attivo:** dopo DET-01, guarda il tabellone e riapri l'app; poi passa alla Fase Stati
- **Atteso:** la mina sparisce dal tabellone e dalla copia locale, e non torna riaprendo.

**DET-06 — Le D-Charges detonano nello stesso Ordine**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Modello · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** D-Charges (Demolition Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* messo **IMM-A**. Un Fusilier sano non è fra i bersagli: nella ⓘ *«… NON AMMESSO»*, col motivo
- **ARO:** nessuno
- **Atteso:** detonano subito, senza tiro, e nel roster non resta nessun segnalino. Sul tabellone il lato reattivo è il Fusilier: **SUBISCE L'ESPLOSIONE**, **3 Tiri Salvezza su ARM: riesce con 7 o meno**. Nessun E16, nessun E20. La terza carica parte, la quarta è bloccata.

**DET-07 — Il CrazyKoala in ARO**
- **Attivo:** nel turno PanOceania, Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE, nella ZdC del CrazyKoala del Moran *(Nomadi #19)*
- **ARO:** il CrazyKoala: tocca la sua riga, poi **DETONAZIONE**, poi **SÌ**; poi AVANTI senza truppe scelte
- **Atteso:** il koala è una **riga con la sua foto** (*crazykoala_N.png*), come le altre unità. Toccandola si apre una pagina con **una sola azione, DETONAZIONE**; dentro, la domanda della Zona di Controllo. Risposto **SÌ**, la detonazione **parte con AVANTI** (e con NESSUN ARO) e arriva al tabellone.

**DET-08 — La mina in ARO**
- **Attivo:** nel turno PanOceania, Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE, dentro l'area d'innesco della Shock Mine della Puppet Masters *(Nomadi #22)*
- **ARO:** la Shock Mine: tocca la sua riga, poi **DETONAZIONE**
- **Atteso:** la mina è una **riga con l'immagine del suo tipo** (*mina_shock.png*). La pagina ha **una sola azione, DETONAZIONE**, e dentro **le tre domande d'innesco**, una alla volta (DET-04). Nell'elenco non ci sono più le domande.

---

# 26. Blocco RIP — Riprendere una partita

**RIP-01 — L'Hub riaperto**
- **Attivo:** a metà partita chiudi la pagina dell'Hub e riaprila
- **Atteso:** niente si cancella. L'Hub non trasmette finché non ha letto il server; poi tornano roster, fazione attiva, scenario e ferite.

**RIP-02 — Lettura non riuscita**
- **Attivo:** stacca la rete e riapri l'Hub
- **Atteso:** riquadro **PARTITA NON LETTA DAL SERVER**, nessuna trasmissione, un nuovo tentativo ogni quattro secondi.

**RIP-03 — RIPRENDI PARTITA**
- **Attivo:** apri l'app (a) con una copia locale; (b) dopo un reset dall'Hub; (c) con un allarme ARO pendente
- **Atteso:** (a) il pulsante c'è; (b) non c'è e la copia è dimenticata; (c) avvisa, e l'allarme resta sul server.

**RIP-04 — Una copia vecchia**
- **Attivo:** riapri l'app con una copia locale senza il campo dei segnalini
- **Atteso:** si carica, zero segnalini, nessun errore.

---

# 27. Blocco ORD — Ordini senza tiro con una domanda davanti

**ORD-01 — Piazzare equipaggiamento**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · CrazyKoalas
- **Atteso:** le domande sono bloccanti: senza una risposta non si esegue. È il modello della famiglia (DEP-02, DET-04).

**ORD-02 — Cybermask**
- **Attivo:** Interventor (Hacker Plus, FastPanda) *(Nomadi #8)*; Zero (Hacker, Killer Hacking Device) *(#9)*; Orc (Hacker, Hacking Device) *(PanOceania #4)* · apri il menu degli Ordini, poi HACKING
- **ARO:** nessuno
- **Atteso:** CYBERMASK **non è più fra le voci del menu degli Ordini**: sta nella schermata **HACKING**, col bottone dei programmi (*Abilità Lunga · Ordine intero · nessun tiro · genera ARO*). Interventor: CYBERMASK e WHITE NOISE. Zero: solo CYBERMASK. Orc: nessuno dei due. Toccando CYBERMASK parte l'allarme ARO, e sul tabellone **ABILITÀ SENZA TIRO**; nessuna domanda sulla Linea di Tiro, e lo stato **IMP-2 lo metti tu** dall'editor degli stati. Come seconda metà il Cybermask è bloccato: è un'Abilità Lunga.

**ORD-03 — Rientrare in CAMO**
- **Attivo:** Intruder (HMG) *(Nomadi #24)*, prima Marker, poi rivelato; Moran *(#19)*, schierato Marker e poi rivelato; Alguacil (Combi Rifle) *(#1)* · apri il menu
- **ARO:** nessuno
- **Atteso:** la voce si chiama **RIENTRARE IN CAMO**. Intruder Marker: non c'è, *«È già in forma di Marker.»* Intruder rivelato: c'è; la domanda sulla LoF ha i tre esiti di ORD-02 (SÌ torna Marker, NO Idle, senza risposta niente). Moran rivelato: non c'è, *«Camouflage (1 Use): lo stato CAMO è già stato usato in questa partita (F07).»* Alguacil: *«Serve l'Abilità Camouflage.»* Per vedere il Moran rientrare una volta, schieralo come Modello.

---

# 28. Blocco SP — Scoprire + Piazzare, e il Coordinato con lo Scoprire

Il **Marker avversario** di queste prove è lo **Zulu-Cobra (Triangulated Fire,
Sensor)** *(PanOceania #10)* schierato come Marker CAMO, a 0-8". Chi piazza è
la **Puppet Masters (Minelayer)** *(Nomadi #22)*, con la **Shock Mine**.

**SP-01 — Dopo lo Scoprire il menu offre il Piazzare**
- **Attivo:** Puppet Masters *(Nomadi #22)* · SCOPRIRE → guarda il menu della seconda metà
- **Bersaglio:** lo Zulu-Cobra (Marker)
- **ARO:** nessuno
- **Atteso:** fra le seconde metà ci sono PIAZZARE EQUIPAGGIAMENTO e ATTACCO BS; non un secondo SCOPRIRE.

**SP-02 — In un Coordinato il Piazzare non si offre**
- **Attivo:** Coordinato con gli Alguacil *(Nomadi #1 e #2)* · SCOPRIRE → guarda il menu della seconda metà
- **Bersaglio:** lo Zulu-Cobra (Marker)
- **ARO:** nessuno
- **Atteso:** c'è ATTACCO BS, non PIAZZARE EQUIPAGGIAMENTO. Nel menu della prima metà non ci sono Fuoco Speculativo né Attacco Intuitivo.

**SP-03 — Prima lo Scoprire, poi il piazzamento**
- **Attivo:** Puppet Masters *(#22)* · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Shock Mine
- **Bersaglio:** lo Zulu-Cobra (Marker), copertura no
- **ARO:** nessuno
- **Atteso:** prima la schermata dello Scoprire, col tasto **AVANTI: PIAZZA EQUIPAGGIAMENTO**; poi l'arma e le domande del piazzamento, col tasto **PIAZZA**.

**SP-04 — Sul tabellone lo Scoprire viene prima**
- **Attivo:** come SP-03, rispondendo **no** alla domanda sul Marker nell'area d'innesco
- **ARO:** nessuno
- **Atteso:** un solo invio, due righe: **SCOPRIRE** sopra, **PIAZZARE EQUIPAGGIAMENTO** (*ABILITÀ SENZA TIRO*) sotto. Nessun avviso. Il segnalino finisce nel roster nomade.

**SP-05 — Marker nell'area d'innesco: piazzamento condizionato**
- **Attivo:** come SP-03, rispondendo **sì** alla domanda sul Marker nell'area d'innesco
- **ARO:** nessuno
- **Atteso:** compare una seconda domanda. Sul tabellone, a vista, **PIAZZAMENTO CONDIZIONATO** col nome del segnalino e del Marker, e **tira PRIMA questo Scoprire** sulla riga dello Scoprire.

**SP-06 — Senza Marker nell'area la nota non c'è**
- **Attivo:** come SP-04
- **Atteso:** nessun PIAZZAMENTO CONDIZIONATO e nessun *tira PRIMA*.

**SP-07 — Coordinato con tre partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1, #2, #3)* · SCOPRIRE → ATTACCO BS
- **Con:** l'arma di ciascuno (il Missile Launcher in Hit Mode)
- **Bersaglio:** lo Zulu-Cobra (Marker), a 8-16"
- **ARO:** nessuno
- **Atteso:** **tre** pagine dello Scoprire, una per partecipante, ognuna con la **sua** gittata, copertura, terreno e LoF (prima usciva solo alla Punta). Una busta da **sei** voci, nessun errore sul numero di unità; sul tabellone **sei** scontri: tre SCOPRIRE a **10** (WIP 13 −3 Mimetismo) e i tre ATTACCO BS.

**SP-08 — Coordinato con cinque partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1-#5)* · SCOPRIRE → ATTACCO BS
- **Atteso:** rifiutato: *«Ordine Coordinato con 5 unità: il massimo è 4»* (cinque, non dieci).

**SP-09 — Il reattivo deve rispondere**
- **Attivo:** come SP-04
- **ARO:** il giocatore PanOceania prima non tocca niente, poi tocca **NESSUN ARO**
- **Atteso:** finché non risponde l'Hub non calcola e il tabellone resta vuoto; appena risponde, lo scontro compare.

**SP-10 — Reagisce il Marker stesso**
- **Attivo:** come SP-05
- **ARO:** lo Zulu-Cobra → ATTACCO BS, Combi Rifle, a 0-8", contro la Puppet Masters
- **Atteso:** sulla schermata dello Scoprire il nome vero e il riquadro **SCOPRIRE: NON SI TIRA** (*«… si è rivelato da solo (ha dichiarato un ARO)…»*). Sul tabellone tre scontri: lo Scoprire che non si tira, il piazzamento condizionato, l'ARO come Tiro Normale. Il *tira PRIMA* non c'è.

**SP-11 — Coordinato con quattro partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1-#4)*, Punta il #2 (HMG) · SCOPRIRE → ATTACCO BS
- **Bersaglio:** lo Zulu-Cobra (Marker), a 8-16"
- **ARO:** nessuno
- **Atteso:** otto scontri; Burst **2** alla Punta, **1** ai gregari.

---

# 29. Blocco SG — La Sagoma e i tuoi alleati

Per arma senza Sagoma la domanda è *«quanti tuoi alleati in quella mischia»*
(tasti 0, 1, 2, 3+) e compare solo se il bersaglio è Ingaggiato. Per arma a
Sagoma è *«la Sagoma prende anche un tuo alleato?»* (tasti **NO** verde, **SÌ**
giallo) e compare sempre. Se l'arma fa **due o più Sagome a lettere** (Burst
pieno) la domanda è **una sola**, in cima ai bersagli, con un tasto per lettera:
si accendono le Sagome che prendono un tuo alleato, e partono accese le lettere
dei bersagli Ingaggiati (SG-09). Per Fumo ed Eclipse non c'è domanda, nemmeno a
lettere.

**SG-01 — Senza Sagoma: quattro tasti, e solo in mischia**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* **Ingaggiato**, a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** la domanda con i tasti 0, 1, 2, 3+, che parte da **1**. Con il Fusilier non Ingaggiato la domanda non c'è.

**SG-02 — Senza Sagoma: il tetto a −12**
- **Attivo:** Intruder (HMG) *(Nomadi #24, BS 13)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier *(#1)* **Ingaggiato**, a 8-16" (fascia 0 dell'HMG), copertura no
- **ARO:** nessuno
- **Atteso:** con 1 alleato **7** (13 −6); con 2 **1** (13 −12); con 3+ ancora **1**, e compare la voce **MOD minimo −12**.

**SG-03 — A Sagoma: SÌ/NO, anche fuori dalla mischia**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(#1)* non Ingaggiato, a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** la domanda c'è, parte da **NO**, nomina il neutrale e il Marker Impersonation nemico, e dice *«anche passato nell'area durante l'Ordine»*. I tasti 0/1/2/3+ non ci sono.

**SG-04 — A Sagoma su una mischia: parte da SÌ**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(#1)* **Ingaggiato**, a 24-32"
- **ARO:** nessuno
- **Atteso:** la stessa domanda, che parte da **SÌ**.

**SG-05 — SÌ: annullato per tutti**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode); rispondi **SÌ**
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato** come Principale, a 24-32"; Fusilier (Missile Launcher) *(#2)* non Ingaggiato sotto la stessa Sagoma
- **ARO:** nessuno
- **Atteso:** nessun dado e nessun Tiro Salvezza per tutti e due. Sul #1 *«SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO»*, sul #2 *«UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA»*. Tutte e due dicono che gli ARO restano e che l'uso Disposable si consuma.

**SG-06 — NO: il colpo vale**
- **Attivo:** come SG-04, rispondendo **NO**
- **Atteso:** il colpo vale, e nei dettagli *«Bersaglio Ingaggiato, ma nessun tuo alleato né neutrale sotto la Sagoma: il colpo vale.»*

**SG-07 — Colpo unico: una domanda sola**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)*, rivelato · FUOCO SPECULATIVO; poi Vertigo Zond *(#28)* · ATTACCO GUIDATO
- **Con:** Grenades per l'Intruder; Missile Launcher (Blast Mode) per il Vertigo
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato** e **Bersagliato** come Principale; Fusilier (Missile Launcher) *(#2)* **Ingaggiato** sotto la Sagoma; a 8-16"
- **ARO:** nessuno
- **Atteso:** la domanda compare una volta, sulla scheda del Principale. Rispondendo **NO** il colpo vale per tutti e due. Lo stesso nell'ATTACCO BS con **una** Sagoma: Alguacil (Missile Launcher) *(#3)* col Missile Launcher (Blast Mode) sugli stessi due, la domanda solo sul #1, e la risposta vale per tutti.

**SG-08 — Fumo: nessuna domanda**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Smoke Grenades
- **Bersaglio:** il Fusilier *(#1)* **Ingaggiato**, a 8-16"
- **ARO:** nessuno
- **Atteso:** nessuna domanda, nessun annullamento, nessun −6. Nei dettagli: l'arma è **Targetless**.

**SG-09 — Due Sagome: ognuna vale per sé**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B): Burst 2, cioè **2 Sagome**, A e B
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato**; Fusilier (Missile Launcher) *(#2)* non Ingaggiato
- **ARO:** nessuno
- **Atteso:** in testa *«2 SAGOME: per ogni bersaglio accendi le lettere delle Sagome che lo prendono.»* e *«Sagoma A: F1 · Sagoma B: F2»*: le lettere partono a giro (un bersaglio solo le prende tutte e due). Sopra i bersagli c'è **una** domanda *«un tuo alleato sotto la Sagoma»*, con i tasti **A** e **B**; parte con la **A** accesa (la lettera del #1, Ingaggiato), e sulle schede non c'è domanda. Il #1 è annullato; il #2 è colpito da B, senza tiro (Sagoma Diretta), un Tiro Salvezza: *«Sagome B: 1 Tiro/i Salvezza.»*. Accendi anche la **A** sul #2: resta un Tiro Salvezza, *«Sagome A (annullata: prende F1 con un tuo alleato). Restano B: 1 Tiro/i Salvezza.»*. Con il #1 non Ingaggiato la domanda parte spenta; col #2 sotto A e B: tutti e due colpiti, il #2 con **due** Tiri Salvezza, *«Sotto le Sagome A, B: 2 Tiro/i Salvezza.»*. Un bersaglio senza lettere blocca l'invio: *«⚠️ … nessuna Sagoma accesa…»*.

**SG-10 — Il secondario arriva sul tabellone**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Bersagliato** come Primario, a 24-32"; Fusilier (Missile Launcher) *(#2)* sotto la Sagoma
- **ARO:** nessuno
- **Atteso:** due scontri sul tabellone, ognuno col suo nome. Il Faccia a Faccia e il Critico restano del solo Primario.

---

# 30. Quello che i banchi già tengono

Questi comportamenti hanno un banco che li misura a ogni giro: al tavolo non
serve ripeterli. Se un numero al tavolo li contraddice, il banco da guardare è
quello indicato.

| Area | Banco |
|---|---|
| Rientro in CAMO e Cybermask: i tre esiti, Frenzy, Isolato | `test_camo_cybermask.js` |
| Hacker, Firewall, ECM, Repeater, Fairy Dust | `test_hacking_firewall.js`, `test_modulo_hacking.js` |
| Classi d'azione, Stati, Foxhole | `test_stati_classi_foxhole.js` |
| Ordini senza tiro e adattatore del tabellone | `test_ordini_senza_tiro.js`, `test_adattatore.js` |
| Un allarme per Ordine, il giro a tre dispositivi | `test_allarme_una_volta.js`, `test_giro_aggiornamento.js` |
| Bersagli dello Speculativo e del Guidato | `test_modulo_speculativo.js`, `test_modulo_guidato.js` |
| Total Control, Coordinato col SALTO, Schieramento Nascosto, successo automatico | `test_sei_casi.js` |
| Requisiti dichiarati al tavolo (lof, gittata, sagoma, contatto, area) | `test_novita_7ott.js` e i banchi dei moduli |
| Le cinque spazzate sul database (armi, bande, salvezze, notazioni, deployable) | `test_coerenza_dati.js` sezioni 8-12 |
| Il conteggio di questo piano e le unità del roster | `test_piano_schieramento.js` |
| Le novità del 18-19 ottobre: FUORI GITTATA come segmento, Burst 2 del FO, Marker col Mimetismo, allarmi ARO di Sensor, Triangulated, Supporto e Soppressione, MediKit e GizmoKit, Cybermask dall'Hacking | `test_novita_18ott.js` |
| La scheda del bersaglio di Forward Observer e Triangulated Fire: COPERTURA −3 nel FO, nessun tasto Copertura nel Triangulated, LINEA DI TIRO NO → IDLE, OSS-03 coi suoi numeri | `test_scheda_osservazione.js` |
| La pagina DETONAZIONE di koala e mine, e la busta che parte con AVANTI e NESSUN ARO | `test_innesco_schermata.js` |
| Le novità del 20 ottobre: profili collegati nel database, secondo profilo e Transmutation (WIP) dall'editor e al cambio turno, moto ed Escape System (chi non può risalire), Marker numerati per segnalino, MOVIMENTO senza tiro, nomi delle armi in ARO, Fumo in ARO fino al tabellone; la Sagoma Diretta in ARO e la seconda metà filtrata (sez. 10); la Schivata contro koala e mina, e il Reset contro la Cybermine, dentro lo scontro della detonazione (sez. 11) | `test_novita_20ott.js` |
| Le otto correzioni del 23 ottobre fino al tabellone: Sagoma d'Impatto un tiro coi MOD del Principale anche con una busta diversa sul secondario, Combi Rifle e Sagoma Diretta a due bersagli invariati; eraMarker nel motore; Pitcher sul punto, finestra e Ripetitore all'Hub, Grenades sul punto E15; Fumo 13 con la Copertura nella busta e Smoke dell'attivo sul punto; Triangulated 13 sul tabellone; fasce del MediKit e IDLE dal tasto; foto collegate nel motore e filtraPerAvversario; INT-01 dalla porta del giocatore (sez. 2b) e la nota del punto; dal pomeriggio (sez. 8-14) la Sorpresa da Hidden e da CAMO, Hidden in ARO, il Coordinato contro un bersaglio (E60, E61), E49, E44 con una lista senza `chars`, l'Idle del solo gregario (A110), TER-06 e TER-07 | `test_novita_23ott.js` |
| La Schivata contro Sagoma senza LoF (PH−3) | `test_orchestratore.js` |
| La consegna del 26 ottobre fino al tabellone: usi Disposable (Panzerfaust su tre Ordini, la busta e la risposta ARO con gli usi, il bottone uguale in BS, ARO, Speculativo e Intuitivo, Reload col Baggage, ricarica dall'Hub una volta sola), E62, Coordinato SCOPRIRE + ATTACCO a tre (sei scontri), Dado Speciale in CC, le mine fuori dall'Attacco BS, il Deactivator sul roster nemico, Minelayer ed E54, SCENDI DAL TAG e il pilota di lista, M.tagDelPilota, le Sagome a lettere e la domanda sul Principale, senzaCritico, repliche e HoloMask, icone per esercito, la mina in CAMO | `test_novita_26ott.js` |
| La domanda doppia del piazzamento e i Deployable senza area d'innesco (Repeater, FastPanda, Deployable Cover, Disco Ball) | `test_modulo_piazzamento.js` sez. 4, 11-bis e 14 |
| Le correzioni del 27 ottobre: la nota del secondario sul tabellone, identificativi e ordine delle repliche (200 giri), il Disco Baller fino alla Disco Ball, la nota del segnalino anche col Pitcher dello Speculativo, le icone fra eserciti, il tetto sugli usi residui in ARO (`M.burstReattivo` e l'Hub, con la controprova senza `r.usiSpesi`) | `test_novita_26ott.js` I3, J1, J1b, M, N, O |
| L'Hidden Deployment nella propria app (27 ottobre, sera, e 28; SCH-01): senza scritta, il segnalino fra le icone; `M.etichettaMarker` *«HIDDEN»*, `M.segnalinoSenzaNumero` con la cartella dell'esercito e la copia comune, nessun numero; sulla riga vera dei Nomads e di PanOceania l'etichetta e l'icona, l'avversario, l'Hub e i canali del server senza traccia; controprove: a vista null, CAMO numerato invariato, `M.rosterPubblico` senza l'HIDDEN, rivelato l'etichetta sparisce | `test_novita_26ott.js` P, P2, P3 |
| Gli stati di schieramento dal motore (27 ottobre, sera; SCH-09): `M.opzioniSchieramento` coi casi di MOTORE (Spektr e Croc Man [CAMO, HIDDEN], Spector [AD], Alguacil []), il Marker senza skill, `acceso` coi deployState vecchi, il Camouflage (1 Use) già usato (F07), l'ordine delle sei voci, la regola sui 745 profili; la pagina vera fino all'Hub | `test_novita_26ott.js` Q, Q2, Q3 |
| Il (+1B) dell'arma col Total Reaction in ARO (27 ottobre, sera; dal 28 sempre al pieno): Panzerfaust (+1B) aggiunto al Salyut sulla pagina dell'ARO vera, nessun tasto del Burst, `r.burstPieno` true nella risposta, all'Hub B2 e due usi spesi; a un uso B1 con *«Burst limitato agli usi residui: 1 su 2»* nella ⓘ; a zero il bottone spento con la nota dello Scarico; il Fusilier senza Total Reaction B1; il Thunderbolt B3 e il Combi (+1B) B4, l'abilità *BS Attack (+1B)* fuori | `test_novita_26ott.js` O, O2; `test_casi_regole.js` 1; `test_correzioni_regole.js` |
| La consegna di MOTORE del 28 ottobre (BS-31): intestazioni degli Ordini senza icona su sette Ordini; le note dell'Ordine azzerate dall'Ordine nuovo e non dalla seconda metà, i tipi spenti nelle opzioni delle note; il bottone dell'arma su scala di 96" (celle contigue, larghezza, FUORI fino a 96) e `M.barraGittata` (un segmento per banda, FUORI, n+1 confini) su 117 armi; `M.nota` e `M.azzeraNote` con e senza `app.html` | `test_novita_28ott.js` R1-R5 |
| La D07 di MOTORE (28 ottobre, motore 28.3; SG-09): la domanda dell'alleato per lettera, una sola in cima (`toggleSagomaAlleatoBS`), la partenza dalle lettere degli Ingaggiati, `sagomeConAlleato` sui bersagli e `alleatoNellaSagoma` solo sull'Ingaggiato con tutte le lettere accese; alleato sotto A con un bersaglio sotto A+B colpito dalla B (1 TS), A e B accese tutti annullati; Fumo ed Eclipse a lettere senza domanda; nel Coordinato la risposta azzerata per il partecipante successivo; le celle del bottone coi colori di `.seg-1..4` e il MOD 0 azzurro #03A9F4 su 146 armi; `M.rigaAttesaAro`; SG-09 sulla pagina intera | `test_novita_28ott.js` S1-S6; `test_novita_26ott.js` I2 |
| Lo snellimento dei moduli (28 ottobre, giro 16): nei 17 `ordine_*.js` e in `logica_stati.js` nessun *font-size* in px, 259 punti tutti su `var(--fs-…)` della scala, ognuna definita su `:root` di `app.html` (12 14 16 22 32 42); `M.stileColore('si' / 'attenzione')` uguale alle stringhe di prima e usato negli 11 punti, nessuno scritto a mano; il tasto della Sagoma Diretta verde, col FUORI giallo | `test_novita_28ott.js` T1-T2 |
| I colori raggruppati (28 ottobre, giro 17): `M.TAVOLOZZA` coi 23 nomi, `M.colore` (*var(--mn-<nome>,<colore>)*, il nome sconosciuto #ff00ff con l'errore), `M.applicaTavolozza` (un solo `<style id="tavolozza-motore">` su `:root`, niente senza head), i 459 `var(--mn-…)` dei moduli col ripiego uguale alla tavolozza, `app.html` senza `--mn-*`; `M.CATEGORIE_ORDINE` (blu, verde, rosso, cinque tinte), `M.COLORI_ORDINE` per ogni valore di `M.AZIONI` più BS_ATTACK e DODGE, `M.coloreOrdine` (casa, maiuscole, ricolorare una voce), `M.colOrdine` (getter, `--mn-ordine-*`); sulla pagina le intestazioni nel colore della categoria e la Soppressione rossa; il riquadro del tiro dell'Osservazione dalla classe `riquadro-tiro`; dal motore 28.6 `M.stileTavolozza` e lo stesso giallo «attenzione» sul SÌ della Sagoma singola e sulla lettera accesa | `test_novita_28ott.js` U1-U6, S1; `test_scheda_osservazione.js` |
| I quattro difetti del piano grafico (28 ottobre, giro 19): i titoli dei MOD di dodici Ordini da `M.intestazioneOrdine`, niente *LANCIO MISSILI GUIDATI* né *MODIFICATORI …*, `<h2>` solo sulle conferme, sulla pagina *SCHIVATA* e *RESET*; il Movimento Cauto rosso (intestazione e riquadro nelle tinte dell'Ordine Intero, SÌ e NO invariati); le etichette dei bersagli di Guidato e Speculativo in `opz.etichette` (nel nome solo il [tipo]); il Supporto con `rigaUnitaConFoto` e *🩺 Incosciente* nella fascia bassa | `test_novita_28ott.js` V1-V4 |
| Le note nella ⓘ dei moduli d'Ordine (28 ottobre): le armi escluse (CC Weapon, CC Mode, GizmoKit, Deactivator, Deployable Cover, Tratto mancante per Soppressione, Speculativo, Guidato), i bersagli non ammessi delle D-Charges, i Supportware dell'EVO, il Dado Speciale, le regole dell'Intuitivo, la nota di `armiARO` e il vincolo del bersaglio solo in Soppressione; le celle del bottone (`data-da`, `data-fino`, `data-mod`) | `test_modulo_bs.js`, `test_modulo_cc.js`, `test_modulo_difesa.js`, `test_modulo_speculativo.js`, `test_modulo_guidato.js`, `test_dcharges_percorso.js`, `test_modulo_hacking.js`, `test_modulo_intuitivo.js`, `test_modulo_aro.js`, `test_correzioni_regole.js`, `test_bottone_arma.js` sez. 10, `test_integrazione.js`, `test_novita_23ott.js` sez. 10 e 12 |

Una trappola da sapere scrivendo una prova nuova: la chiave di un requisito non
è il nome del campo. `gittata` legge `fuoriGittata` (manca se **true**),
`sagoma` legge `fuoriSagoma`, `area` legge `inArea`.

---

# 31. Difetti aperti

| Difetto | Prova | A chi |
|---|---|---|
| Il Burst reattivo in Soppressione esce 1 invece di 3 quando il reattivo è bersaglio di un attacco | BS-12 | MOTORE |
| Il +1 SD del Fireteam di Livello 2 non arriva al Burst | FT-03 | MOTORE |
| Il filtro del Supporto non distingue VITA da STR | SUP-05 | MOTORE |
| A58 non elenca gli strumenti attesi | SUP-06 | MOTORE |
| Deployable Cover (Cutting Foam) e (Vitroferro) disegnano lo stesso bottone | — (`test_bottone_arma.js` sez. 11) | MOTORE |
| `M.esitoTerreni` ha due implementazioni che non danno lo stesso esito | — (`test_terreni_combinati.js` sez. 8) | MOTORE |
| Con un MSV3 la nota del terreno dice "MSV2" | — (`test_terreni_combinati.js`) | MOTORE |
| `profiloArma` scrive munizione N dove il database ha `null` (Deployable Cover) | — | MOTORE |
| La gittata del Missile Launcher in TPL-04: da confermare con la foto della schermata | TPL-04 | Paolo |

**Divergenze che restano per una ragione:** le mine non sanno se detonano (il
motore risponde *non lo so* e l'app chiede di toglierle a mano: → DATABASE);
*un pilota, un segnalino* è una lettura e non una regola (→ REGOLE); il
recupero parziale di una partita senza copia locale non esiste, e potrebbe
recuperare solo le unità visibili (→ INTERFACCIA); due identificativi ignoti,
`?219` sul Monstrucker e `?227` su Shona Carano (→ DATABASE).

---

# 32. Ordine di esecuzione

1. **Preflight.** Se PRE-01 o PRE-02 falliscono, fermati. Dopo ogni
   sostituzione di file, prima di tutto: `node test_caricamento_pagine.js`.
2. **RIP**: se l'Hub non riapre bene, il resto si gioca su una partita che può
   cancellarsi.
3. **A, B, C**.
4. **U** (contratto).
5. **DIS**.
6. **M, N** (stati).
7. **O, DET** (deployable e detonazione).
8. **D, E, F, G, H, I, J, K, L, P, ORD**, un blocco per sessione.
9. **Q, R, S, T, SP, SG**: servono uno schieramento dedicato.
10. Il capitolo 31: riconferma i difetti aperti.

Segna ogni fallimento con: codice, unità e stato, cosa hai letto, cosa ti
aspettavi. Quando un numero non torna, guarda prima il dato di prova.

<!-- @versione 2026-10-28.2 | PIANO_COLLAUDO_GRAFICO_N5.md | proprieta`: chat MOTORE (bozza da far adottare a TEST) -->

# Piano di collaudo grafico — Calcolatore Infinity N5

Bozza scritta dalla chat MOTORE il 28 ottobre, su richiesta di Paolo: *«una serie di test, strutturati come quelli dell’altro piano di collaudo, pensati per mostrarmi tutte le pagine e tutte le note che escono, sia sulle app giocatore che sull’app calcolatore»*. Il **Piano di collaudo** dice se i **numeri** sono giusti; questo dice se le **schermate** sono giuste: cosa c’è a schermo, dove, e cosa c’è nella ⓘ.

Misurato coi file del Progetto del 28 ottobre: `motore_regole_n5.js` **2026-10-28.7**, `motore_core.js` **2026-10-28.1**, `ordine_attacco_bs.js` **2026-10-28.5**, `altri ordine_*.js` **2026-10-28.3 e .4**, `ordine_coordinato.js` **2026-10-28.2**, `logica_stati.js` **2026-10-28.2**, `app.html` **2026-10-28.3**, `logica_aro.js` **2026-10-28.5**, `roster_manager.js` **2026-10-28.2**, `scegli_fazione.html` **2026-10-28.1**, `calcolatore_hub.html` **2026-10-27.2**, `calcolatore_controller.js` **2026-10-26.1**, `catalogo_n5.js` **2026-10-27.1**, `database_nomad.js e database_panoceania.js` **2026-10-20.1**.

Ogni prova ha la **foto** della schermata (e della ⓘ aperta, quando ha voci) nell’artifact **«Collaudo grafico»**, sotto lo stesso codice. Le voci della ⓘ scritte qui **non** sono ricopiate a mano: le ha registrate il giro fotografico, prova per prova, dalla pagina vera.

# 0. Come si legge una prova

```
GR-D05 — titolo
  App:       quale app, a che larghezza
  Passi:     come si arriva alla schermata (truppe col numero del roster)
  Schermata: quale pagina dell’app
  Guarda:    cosa controllare a schermo
  ⓘ:         il tasto c’è / non c’è; le voci, col tipo e il tasto a cui appartengono
```

**Le truppe** sono quelle del capitolo 1 del Piano di collaudo, col loro numero (*Nomadi #12*, *PanOceania #1*).

**Il tavolo grafico.** Dove la prova non dice altro, i Nomadi hanno: Gruppo 1 Alguacil (Combi Rifle) *#1*, Grenzer (Forward Observer, Sensor, NCO) *#12*, Intruder (HMG) *#24* in **CAMO**, Interventor (Hacker Plus, FastPanda) *#8*, Morlock (Assault Pistol) *#13*, Daktari *#6*; Gruppo 2 Puppet Masters (Minelayer) *#22*, Vertigo Zond *#28*, Kulak (Hacker, Killer Hacking Device) *#23*, Reaktion Zond (HMG) *#15*, Intruder (Hacker, Killer Hacking Device) *#25*, Alguacil (Missile Launcher) *#3*. PanOceania ha Fusilier (Combi Rifle) *#1*, Fusilier (Missile Launcher) *#2*, Orc *#4*, Nisse *#5*, Croc Man *#6* in **CAMO**, Teutonic Knight *#7*. Terreno sul tavolo: Bosco.

**I colori degli Ordini** (dal 28 ottobre, motore 28.5): **Movimenti blu**, **Abilità Brevi verdi**, **Ordini Interi rossi**: nel menu, nell’intestazione e nei riquadri dell’Ordine, nelle reazioni dell’ARO.

**La ⓘ.** Il tasto tondo in alto a destra c’è solo se la schermata ha qualcosa da spiegare; toccato apre il foglio dal basso. Con l’opzione **SOTTO I TASTI** (menu iniziale, *OPZIONI DELLE NOTE*) la ⓘ non c’è e ogni nota sta sotto il suo tasto (GR-B13). Una voce *«sotto il tasto X»* con l’opzione SOTTO I TASTI si legge sotto X; le altre in un riquadro in cima.

**Se una schermata non torna**, segna: codice della prova, cosa vedi, cosa ti aspettavi, e se la foto dell’artifact è uguale alla tua schermata.

---

# 1. A. Menu iniziale e lista

**GR-A01 — Menu iniziale**
- **App:** Menu iniziale (telefono)
- **Passi:** apri l’app
- **Schermata:** menu iniziale
- **Guarda:** QUALE FAZIONE?, i tasti NOMADS, PANOCEANIA, HUB — REGISTA e OPZIONI DELLE NOTE
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-A02 — Composizione lista vuota**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** NOMADI dal menu iniziale
- **Schermata:** Composizione lista
- **Guarda:** titolo NOMAD DATANET, riquadro dell’import, tendine TRUPPA e Gruppo («Gruppo 1»), sotto il MENU spazio libero
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-A03 — Composizione lista piena**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** aggiungi le 12 truppe del tavolo grafico (cap. 1), i terreni Bosco e Tempesta e un elemento scenico
- **Schermata:** Composizione lista
- **Guarda:** righe della lista con matita e X da 44 px, terreni ed elementi scenici elencati
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-A04 — Composizione lista PanOceania**
- **App:** PanOceania (telefono, 390 px)
- **Passi:** PANOCEANIA dal menu iniziale, aggiungi le 6 truppe
- **Schermata:** Composizione lista
- **Guarda:** tema azzurro/blu della fazione, fascia in alto azzurra
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-A05 — Import con righe ambigue**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** incolla una lista di Infinity Army con un Alguacil a pari punti
- **Schermata:** Composizione lista
- **Guarda:** sotto il riquadro del testo le scelte grigie (non rosse), NESSUNO tratteggiato
- **ⓘ:** nessuna voce, il tasto **non c’è**.

---

# 2. B. Schieramento

**GR-B01 — Dispiegamento: i Gruppi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** VAI ALLO SCHIERAMENTO
- **Schermata:** Dispiegamento (Gruppi)
- **Guarda:** titolo DISPIEGAMENTO intero, Gruppi alti quanto il contenuto, CONCLUDI SCHIERAMENTO verde, INDIETRO
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B02 — Unità del Gruppo 1**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** GRUPPO 1
- **Schermata:** Unità da schierare
- **Guarda:** in cima TIRI DA FARE; righe con la foto (riga comune), nota di schieramento nella fascia bassa, nessuna immagine rotta; l’Intruder con [ SEGNALINO CAMO (-3) ]
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B03 — Unità del Gruppo 2**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** GRUPPO 2
- **Schermata:** Unità da schierare
- **Guarda:** righe del Gruppo 2
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B04 — Stati di schieramento: truppa senza scelte**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Gruppo 1 → Alguacil (Combi Rifle) *(#1)*
- **Schermata:** Stati di schieramento
- **Guarda:** solo NORMALE
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B05 — Stati di schieramento: CAMO e piazzabili (Moran)**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Moran *(#19)*
- **Schermata:** Stati di schieramento
- **Guarda:** NORMALE, SEGNALINO CAMO (-3) con l’icona, TIRO DI INFILTRAZIONE FALLITO; sotto EQUIPAGGIAMENTO DA PIAZZARE: CRAZYKOALAS con gli usi residui
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B06 — Stati di schieramento: CAMO e Hidden (Croc Man)**
- **App:** PanOceania (telefono, 390 px)
- **Passi:** app PanOceania, Croc Man *(PanOceania #6)*
- **Schermata:** Stati di schieramento
- **Guarda:** NORMALE, SEGNALINO CAMO (-6), HIDDEN DEPLOYMENT con l’icona; nella ⓘ la nota dell’Hidden
- **ⓘ:** il tasto c’è, 2 voci:
  - *HIDDEN DEPLOYMENT* (regole e promemoria): «Non si piazza niente: annota la posizione. Si rivela dichiarando un Ordine o un ARO, o se viene Scoperto.»
  - *Shock Mine* (regole e promemoria): «Intuitive Attack, Concealed, Disposable (3), Direct Template (Small Teardrop), Deployable»

**GR-B07 — Stati di schieramento: Schieramento Aereo (Spector)**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Spector *(#29)*
- **Schermata:** Stati di schieramento
- **Guarda:** NORMALE, SCHIERAMENTO AEREO; DROP BEARS (DEPLOYABLE MODE) da piazzare; nella ⓘ la nota dell’AD e i Tratti dei Drop Bears
- **ⓘ:** il tasto c’è, 2 voci:
  - *SCHIERAMENTO AEREO* (regole e promemoria): «Resta fuori dal tavolo: entra nel tuo Turno Attivo con INGRESSO IN CAMPO, usando il suo Ordine. Finché è fuori non aggiunge il suo Ordine al Pool.»
  - *Drop Bears (Deployable Mode)* (regole e promemoria): «Intuitive Attack, Disposable (3), Direct Template (Small Teardrop), Deployable»

**GR-B08 — Stati di schieramento: repliche e HoloMask (Bashi Bazouk)**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Bashi Bazouk *(#42)*
- **Schermata:** Stati di schieramento
- **Guarda:** NORMALE, SCHIERAMENTO AEREO, HOLOMASK: SCEGLI IL MODELLO DA IMITARE, HOLOECHO: 2 COPIE OLOGRAFICHE
- **ⓘ:** il tasto c’è, 1 voce:
  - *SCHIERAMENTO AEREO* (regole e promemoria): «Resta fuori dal tavolo: entra nel tuo Turno Attivo con INGRESSO IN CAMPO, usando il suo Ordine. Finché è fuori non aggiunge il suo Ordine al Pool.»

**GR-B09 — HoloMask: scelta del Modello**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Bashi Bazouk → HOLOMASK: SCEGLI IL MODELLO
- **Schermata:** Stati di schieramento
- **Guarda:** ricerca e tasti per iniziale, un solo INDIETRO, pagina corta
- **ⓘ:** il tasto c’è, 1 voce:
  - *SCHIERAMENTO AEREO* (regole e promemoria): «Resta fuori dal tavolo: entra nel tuo Turno Attivo con INGRESSO IN CAMPO, usando il suo Ordine. Finché è fuori non aggiunge il suo Ordine al Pool.»

**GR-B10 — Stati di schieramento: Minelayer**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Puppet Masters (Minelayer) *(#22)*
- **Schermata:** Stati di schieramento
- **Guarda:** «MINELAYER: piazzati 0 su 1», SHOCK MINE a tutta larghezza
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B11 — Galleria delle foto**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Gruppo 1 → tocca la foto dell’Alguacil
- **Schermata:** Unità da schierare
- **Guarda:** miniature della cartella dei Nomadi, NESSUNA FOTO
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B12 — Squadra inviata**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** CONCLUDI SCHIERAMENTO
- **Schermata:** Connessione stabilita
- **Guarda:** CONNESSIONE STABILITA nel colore della fazione
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-B13 — Stati di schieramento con le note SOTTO I TASTI**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** nel menu iniziale OPZIONI DELLE NOTE → SOTTO I TASTI; poi come GR-B07
- **Schermata:** Stati di schieramento
- **Guarda:** niente tasto ⓘ; ogni nota sta sotto il suo tasto, stesso fondo e bordo, come un tasto solo
- **ⓘ:** le voci stanno sotto i tasti (opzione SOTTO I TASTI), 2 voci:
  - *SCHIERAMENTO AEREO* (regole e promemoria): «Resta fuori dal tavolo: entra nel tuo Turno Attivo con INGRESSO IN CAMPO, usando il suo Ordine. Finché è fuori non aggiunge il suo Ordine al Pool.»
  - *Drop Bears (Deployable Mode)* (regole e promemoria): «Intuitive Attack, Disposable (3), Direct Template (Small Teardrop), Deployable»

---

# 3. C. Turno attivo

**GR-C01 — Radar: i Gruppi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** schieramento confermato, è il tuo turno
- **Schermata:** Radar (Gruppi)
- **Guarda:** riga «(Tocco rapido…)» intera, GRUPPO 1 e GRUPPO 2 alti 80 px
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C02 — Truppe del Gruppo 1**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** GRUPPO 1 (Morlock *(#13)* Ingaggiato, Daktari *(#6)* Incosciente)
- **Schermata:** Truppe del Gruppo
- **Guarda:** icone degli stati a destra; Daktari scuro con «[Incosciente — NON ATTIVABILE]» nella fascia bassa; l’Intruder in CAMO con CAMO-3 1
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C03 — Truppe del Gruppo 2**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** GRUPPO 2 (Reaktion Zond *(#15)* in Soppressione)
- **Schermata:** Truppe del Gruppo
- **Guarda:** «⚠️ ATTIVARLA ANNULLA LA SOPPRESSIONE» nella fascia bassa, intero
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C04 — Menu degli Ordini**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer (Forward Observer, Sensor, NCO) *(#12)*
- **Schermata:** Menu degli Ordini (1ª metà)
- **Guarda:** Movimenti in BLU, Abilità Brevi in VERDE, Ordini Interi in ROSSO
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C05 — Menu degli Ordini di un Hacker**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Interventor *(#8)*
- **Schermata:** Menu degli Ordini (1ª metà)
- **Guarda:** HACKING fra le Abilità Brevi (verde)
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C06 — Ordine Coordinato: la squadra**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** tocco prolungato su GRUPPO 1, scegli Alguacil *(#1)* e Grenzer *(#12)*
- **Schermata:** Truppe del Gruppo
- **Guarda:** icona della Punta di Lancia sul primo, contorno arancio sugli scelti, CONFERMA SQUADRA E PROCEDI verde
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-C07 — Seconda metà dopo un Movimento**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Alguacil *(#1)* · MUOVERE; l’avversario tocca NESSUN ARO
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** «Reazione Dichiarata! Completa l’ordine:», i tasti della seconda metà coi colori del menu
- **ⓘ:** nessuna voce, il tasto **non c’è**.

---

# 4. D. Attacco BS

**GR-D01 — Armi dell’Attacco BS**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · ATTACCO BS
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione ATTACCO BS verde, senza icona; bottoni delle armi con la barra su scala di 96" e la fascia grigia FUORI; nella ⓘ le armi escluse
- **ⓘ:** il tasto c’è, 1 voce:
  - *CC Weapon non utilizzabile* (perché non si può): «arma da Corpo a Corpo»

**GR-D02 — Bersagli dell’Attacco BS**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Alguacil *(#1)* · ATTACCO BS · Combi Rifle
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** righe dei bersagli nel colore di PanOceania, Fusilier *(#1)* scelto; nella ⓘ il Croc Man in CAMO non bersagliabile
- **ⓘ:** il tasto c’è, 1 voce:
  - *SEGNALINO MIMETICO non bersagliabile* (perché non si può): «Marker CAMO: va Scoperto prima (oppure usa un Attacco Intuitivo).»

**GR-D03 — In attesa dell’ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-D02, CONFERMA BERSAGLI
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** IN ATTESA DI ARO…, sotto «Bersaglio: Fante · Combi Rifle»
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-D04 — Modificatori: un bersaglio**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-D03; l’avversario tocca NESSUN ARO
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** scheda del bersaglio: barra a bande uguali coi numeri sui confini e FUORI, NO COPERTURA, LINEA DI TIRO SÌ, tendina munizioni a tutta riga, Terreno; ESEGUI CALCOLO
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-D05 — Modificatori: Copertura e Fumo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-D04, poi tocca NO COPERTURA e nel Terreno scegli Fumo
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** IN COPERTURA arancio, «Terreno: Fumo»; nella ⓘ la Copertura (sotto il suo tasto) e il Fumo
- **ⓘ:** il tasto c’è, 2 voci:
  - *Copertura* (spiegazione dei MOD · sotto il tasto `copertura-0`): «-3 al tuo tiro, +3 alla sua ARM.»
  - *Fumo* (spiegazione dei MOD): «Zona di Visibilità Zero. Un MSV L2 o L3 la attraversa. Se sulla stessa linea c'è anche Eclipse, tocca Eclipse: vale quella.»

**GR-D06 — Modificatori: Burst diviso su due bersagli**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Reaktion Zond (HMG) *(#15)* · ATTACCO BS · Heavy Machine Gun su Fusilier *(#1)* e Orc *(#4)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** DADI BS DA ASSEGNARE, due schede coi tasti − e +
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-D07 — Modificatori: Sagome a lettere**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · ATTACCO BS · Light Flamethrower(+1B) su Fusilier *(#1, Ingaggiato)* e Fusilier ML *(#2)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** in cima ATTACCO A SAGOMA una volta, la domanda per lettera con la A accesa (gialla); per ogni bersaglio i tasti A e B, SOTTO LA SAGOMA, copertura e LoF; nella ⓘ la regola e «Sagome annullate»
- **ⓘ:** il tasto c’è, 3 voci:
  - *Sagoma su un alleato* (regole e promemoria): «Accendi la lettera se quella Sagoma prende anche un tuo alleato, un neutrale o un Marker Impersonation nemico (anche in mischia col bersaglio, o pass…»
  - *Sagome annullate* (cambio di stato): «Sagoma A: colpo annullato per chi ci sta sotto.»
  - *Burst* (regole e promemoria): «Burst dell'arma Light Flamethrower · BS Attack (+1B): +1 Burst in Turno Attivo»

**GR-D08 — Modificatori: una Sagoma su una mischia**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Alguacil (Missile Launcher) *(#3)* · ATTACCO BS · Missile Launcher (Blast Mode) sul Fusilier *(#1)* Ingaggiato
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** la domanda «La Sagoma prende anche un TUO alleato…» con SÌ giallo acceso, NO spento
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-D09 — Modificatori: Dado Speciale**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Intruder (MULTI Sniper Rifle) *(#10)* · ATTACCO BS · MULTI Sniper Rifle (+1SD) sul Fusilier *(#1)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** nella ⓘ il Dado Speciale
- **ⓘ:** il tasto c’è, 2 voci:
  - *Intruder: Marker CAMO → Modello sul tavolo (ATTACCO BS)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»
  - *Dado Speciale* (regole e promemoria): «+1: tira 1 dado in più su UN bersaglio (il primo), poi scartane 1. Non è un dado di Burst.»

**GR-D10 — Targetless: il punto del tavolo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Morlock (Assault Pistol) *(#13)* · ATTACCO BS · Smoke Grenades
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** scheda PUNTO SUL TAVOLO, barra, LINEA DI TIRO, nessun tasto Copertura; nella ⓘ «Arma Targetless»
- **ⓘ:** il tasto c’è, 1 voce:
  - *Arma Targetless* (spiegazione dei MOD): «Si tira su un punto del tavolo, non su una truppa. Niente Copertura né Mimetismo; la gittata è quella fino al punto, e serve la Linea di Tiro verso i…»

**GR-D11 — Targetless: in attesa dell’ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-D10, prima che l’avversario risponda
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** «Bersaglio: un punto del tavolo (nessuna truppa) · Smoke Grenades»
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-D12 — Riquadro del terreno**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-D04, tocca la riga Terreno
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** le caselle dei terreni del tavolo, Fumo ed Eclipse, ANNULLA e OK
- **ⓘ:** nessuna voce, il tasto **non c’è**.

---

# 5. E. Altri Ordini

**GR-E01 — Attacco CC: armi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Morlock *(#13)* · ATTACCO CC
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione ATTACCO IN MISCHIA verde
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E02 — Attacco CC: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Morlock *(#13)* · ATTACCO CC · AP CC Weapon sul Fusilier *(#1)*, a contatto
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** scheda del bersaglio, la domanda degli alleati in mischia; nella ⓘ Burst e note del Corpo a Corpo
- **ⓘ:** il tasto c’è, 2 voci:
  - *Burst* (regole e promemoria): «Burst dell'arma AP CC Weapon»
  - *Corpo a Corpo* (spiegazione dei MOD): «In Corpo a Corpo non si applicano gittata, copertura né mimetismo.»

**GR-E03 — Attacco CC: Dado Speciale (Wolfgang)**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Wolfgang Amadeus *(#26)* · ATTACCO CC sul Fusilier *(#1)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** nella ⓘ il Dado Speciale
- **ⓘ:** il tasto c’è, 3 voci:
  - *Burst* (regole e promemoria): «Burst dell'arma PARA CC Weapon»
  - *Dado Speciale* (regole e promemoria): «+1 SD: tira un dado in più e poi scartane uno. Non conta nel Burst.»
  - *Corpo a Corpo* (spiegazione dei MOD): «In Corpo a Corpo non si applicano gittata, copertura né mimetismo.»

**GR-E04 — Infoguerra: programmi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Interventor *(#8)* · HACKING
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione INFOGUERRA verde, bottoni dei programmi con l’icona; CYBERMASK e WHITE NOISE in fondo
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E05 — Infoguerra: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Interventor *(#8)* · HACKING · CARBONITE sull’Orc *(#4)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** scheda del bersaglio; nella ⓘ l’Area di Hacking
- **ⓘ:** il tasto c’è, 1 voce:
  - *Area di Hacking* (spiegazione dei MOD): «Niente LoF, gittata, copertura né mimetismo. Solo truppe in forma di Modello sono bersagliabili: i Marker vanno Scoperti prima.»

**GR-E06 — Infoguerra: programmi che non si lanciano da qui**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Salyut (EVO Hacking Device) · HACKING
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** «Nessun programma d’attacco disponibile con questo dispositivo», il bottone FAIRY DUST; nella ⓘ i programmi «non gestito da questa schermata»
- **ⓘ:** il tasto c’è, 3 voci:
  - *ASSISTED FIRE: non gestito da questa schermata* (perché non si può): «Supportware su alleati (EVO).»
  - *CONTROLLED JUMP: non gestito da questa schermata* (perché non si può): «Supportware su alleati (EVO).»
  - *ENHANCED REACTION: non gestito da questa schermata* (perché non si può): «Dà B2 in ARO a un REM alleato (EVO).»

**GR-E07 — Fuoco Speculativo: armi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Intruder (Hacker, Killer Hacking Device) *(#25)* · FUOCO SPECULATIVO
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione FUOCO SPECULATIVO rossa (Ordine Intero)
- **ⓘ:** il tasto c’è, 7 voci:
  - *Intruder Hacker: Marker CAMO → Modello sul tavolo (FUOCO SPECULATIVO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»
  - *AP Submachine Gun non utilizzabile per il Fuoco Speculativo* (perché non si può): «non ha il Tratto Speculative Attack»
  - *Pulzar non utilizzabile per il Fuoco Speculativo* (perché non si può): «non ha il Tratto Speculative Attack»
  - *D-Charges (Demolition Mode) non utilizzabile per il Fuoco Speculativo* (perché non si può): «non ha il Tratto Speculative Attack»
  - *Heavy Pistol non utilizzabile per il Fuoco Speculativo* (perché non si può): «non ha il Tratto Speculative Attack»
  - *Killer Hacking Device non utilizzabile per il Fuoco Speculativo* (perché non si può): «non presente nel database armi»
  - *Multispectral Visor L2 non utilizzabile per il Fuoco Speculativo* (perché non si può): «non presente nel database armi»

**GR-E08 — Fuoco Speculativo: bersagli**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E07 · Grenades
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** BERSAGLI DEL FUOCO SPECULATIVO (rosso), righe con la foto, il Marker
- **ⓘ:** il tasto c’è, 1 voce:
  - *Intruder Hacker: Marker CAMO → Modello sul tavolo (FUOCO SPECULATIVO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»

**GR-E09 — Fuoco Speculativo: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E08 sul Fusilier *(#1)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** titolo FUOCO SPECULATIVO, TIRO SU PH 12 coi MOD, scheda del Fusilier con la barra e FUORI, domanda della Sagoma; nella ⓘ cosa non si applica e la Sagoma Circolare
- **ⓘ:** il tasto c’è, 4 voci:
  - *Intruder Hacker: Marker CAMO → Modello sul tavolo (FUOCO SPECULATIVO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»
  - *Cosa NON si applica a questo tiro* (spiegazione dei MOD): «Mimetismo del bersaglio: ignorato. Copertura: ignorata (né il -6 al tiro, né il +3 alla salvezza del bersaglio). LoF: non serve, bersaglio e punto d'…»
  - *Si applica invece* (spiegazione dei MOD): «La gittata, che nell'Attacco Intuitivo non conta.»
  - *Sagoma Circolare* (regole e promemoria): «Con un'arma dal Tratto Impact Template (Circular), lo Speculativo permette di piazzare il centro della Sagoma altrove che sul Bersaglio Principale —…»

**GR-E10 — Attacco Intuitivo: armi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Morlock *(#13)* · ATTACCO INTUITIVO
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione rossa; nome dell’arma a capo fra le parole
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E11 — Attacco Intuitivo: bersagli**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E10 · Chain Rifle
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** BERSAGLIO PRINCIPALE — UNO SOLO, HO LINEA DI TIRO (SOLO MARKER BERSAGLIABILI), il Marker; nella ⓘ i Modelli non bersagliabili con l’Intuitivo
- **ⓘ:** il tasto c’è, 5 voci:
  - *Fante non bersagliabile con l'Intuitivo* (perché non si può): «L'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.»
  - *Bazooka non bersagliabile con l'Intuitivo* (perché non si può): «L'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.»
  - *Orc non bersagliabile con l'Intuitivo* (perché non si può): «L'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.»
  - *Nisse non bersagliabile con l'Intuitivo* (perché non si può): «L'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.»
  - *Teutone non bersagliabile con l'Intuitivo* (perché non si può): «L'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.»

**GR-E12 — Attacco Intuitivo: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E11 sul Croc Man *(#6)* in CAMO
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** tiro su WIP; nella ⓘ Critico, Copertura, Reazione e «Se il tiro fallisce»
- **ⓘ:** il tasto c’è, 4 voci:
  - *Critico* (regole e promemoria): «Vale solo sul Bersaglio Principale; sui secondari colpiti dalla Sagoma è un successo normale.»
  - *Copertura* (spiegazione dei MOD): «Chi è colpito NON ha il +3 al Tiro Salvezza per Copertura Parziale.»
  - *Reazione del bersaglio* (regole e promemoria): «Un Faccia a Faccia contro questo tiro WIP.»
  - *Se il tiro fallisce* (regole e promemoria): «Questa unità non può ritentare un Attacco Intuitivo contro lo stesso bersaglio fino al prossimo Turno Attivo.»

**GR-E13 — Attacco Guidato: armi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Vertigo Zond *(#28)* · ATTACCO GUIDATO (Fusilier #1 Bersagliato)
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione rossa
- **ⓘ:** il tasto c’è, 1 voce:
  - *Missile Launcher (Hit Mode) non utilizzabile per il Guidato* (perché non si può): «non è una Blast Mode né ha il Tratto Impact Template»

**GR-E14 — Attacco Guidato: nessun Bersagliato**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E13 senza nessun Bersagliato
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** «Nessun bersaglio in Stato Bersagliato sul tavolo»; le righe con la foto, il perché nella fascia bassa (non nel nome); nella ⓘ perché
- **ⓘ:** il tasto c’è, 6 voci:
  - *Fante non bersagliabile* (perché non si può): «Non è in Stato Bersagliato: il primario dell'Attacco Guidato dev'essere designato.»
  - *Bazooka non bersagliabile* (perché non si può): «Non è in Stato Bersagliato: il primario dell'Attacco Guidato dev'essere designato.»
  - *Orc non bersagliabile* (perché non si può): «Non è in Stato Bersagliato: il primario dell'Attacco Guidato dev'essere designato.»
  - *Nisse non bersagliabile* (perché non si può): «Non è in Stato Bersagliato: il primario dell'Attacco Guidato dev'essere designato.»
  - *SEGNALINO MIMETICO non bersagliabile* (perché non si può): «In forma di Marker: non può essere in Stato Bersagliato.»
  - *Teutone non bersagliabile* (perché non si può): «Non è in Stato Bersagliato: il primario dell'Attacco Guidato dev'essere designato.»

**GR-E15 — Attacco Guidato: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E13, Primario il Fusilier *(#1)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** intestazione ATTACCO GUIDATO (rossa), TIRO SU BS 12, [PRIMARIO] Fante con la barra, la domanda della Sagoma; nella ⓘ «Cosa NON si applica» e «Si applica invece»
- **ⓘ:** il tasto c’è, 2 voci:
  - *Cosa NON si applica* (spiegazione dei MOD): «Mimetismo del bersaglio: ignorato. Copertura: ignorata, e chi è colpito dalla Sagoma non ha il +3 al Tiro Salvezza. LoF: non serve.»
  - *Si applica invece* (spiegazione dei MOD): «La gittata, misurata in linea retta fino al bersaglio.»

**GR-E16 — Scoprire: bersagli**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · SCOPRIRE
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** solo i Marker, sigla «?»; nella ⓘ i Modelli: niente da Scoprire
- **ⓘ:** il tasto c’è, 5 voci:
  - *Fante non scopribile* (perché non si può): «Non è in forma di Marker: non c'è niente da Scoprire.»
  - *Bazooka non scopribile* (perché non si può): «Non è in forma di Marker: non c'è niente da Scoprire.»
  - *Orc non scopribile* (perché non si può): «Non è in forma di Marker: non c'è niente da Scoprire.»
  - *Nisse non scopribile* (perché non si può): «Non è in forma di Marker: non c'è niente da Scoprire.»
  - *Teutone non scopribile* (perché non si può): «Non è in forma di Marker: non c'è niente da Scoprire.»

**GR-E17 — Scoprire: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E16 sul Croc Man *(#6)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** barra delle fasce dello Scoprire; nella ⓘ le note dello Scoprire
- **ⓘ:** il tasto c’è, 3 voci:
  - *Scoprire* (regole e promemoria): «Attributo dell'azione SCOPRIRE.»
  - *Scoprire* (regole e promemoria): «Tiro Normale su WIP con gli STESSI MOD di un BS Attack: Copertura, gittata, Mimetismo e così via.»
  - *Scoprire* (regole e promemoria): «Chi fallisce non può ritentare sullo STESSO Marker fino al proprio Turno successivo. Può invece tentare su un Marker diverso.»

**GR-E18 — Supporto: strumenti**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Daktari *(#6)* · SUPPORTO (Morlock #13 Incosciente)
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** DOCTOR e MEDIKIT alti quanto il contenuto
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E19 — Supporto: bersagli**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E18 · DOCTOR
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** Doctor — SCEGLI L’ALLEATO; il Morlock come riga con la foto, «🩺 Incosciente» nella fascia bassa; nella ⓘ i non soccorribili
- **ⓘ:** il tasto c’è, 11 voci:
  - *Alguacil non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Grenzer non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Intruder non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Interventor non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Daktari non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Puppet Masters non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Vertigo Zond non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Kulak non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Reaktion Zond non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Intruder Hacker non soccorribile* (perché non si può): «Non è in Stato Incosciente.»
  - *Alguacil ML non soccorribile* (perché non si può): «Non è in Stato Incosciente.»

**GR-E20 — Supporto: modificatori**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E19 sul Morlock
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** tiro su WIP; nella ⓘ le note del Doctor
- **ⓘ:** il tasto c’è, 4 voci:
  - *Doctor* (regole e promemoria): «Annulla lo Stato Incosciente rimuovendo 1 Ferita.»
  - *Doctor* (regole e promemoria): «⚠️ Il bersaglio entra AUTOMATICAMENTE in Stato Morto e viene rimosso dal tavolo.»
  - *Doctor* (regole e promemoria): «Al tavolo: annullare lo Stato Incosciente annulla anche lo Stato Prono. Se il segnalino è a terra, toglilo — l'app non traccia il Prono.»
  - *Doctor* (regole e promemoria): «Se il bersaglio ha un Cubo, si possono spendere Command Token per ripetere un tiro fallito.»

**GR-E21 — Supporto: MediKit a distanza**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Alguacil (Paramedic) *(#5)* · MEDIKIT, A DISTANZA
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** barra del MediKit con FUORI, LINEA DI TIRO SÌ
- **ⓘ:** il tasto c’è, 5 voci:
  - *MediKit* (regole e promemoria): «A distanza il MediKit/GizmoKit è un BS Attack: prima si colpisce, poi il bersaglio tira.»
  - *MediKit* (regole e promemoria): «Il bersaglio rimuove 1 Ferita e annulla lo Stato Incosciente.»
  - *MediKit* (regole e promemoria): «⚠️ Il bersaglio entra AUTOMATICAMENTE in Stato Morto.»
  - *MediKit* (regole e promemoria): «Il bersaglio di un MediKit non esegue Tiro Salvezza.»
  - *MediKit* (regole e promemoria): «Al tavolo: annullare lo Stato Incosciente annulla anche lo Stato Prono. Se il segnalino è a terra, toglilo — l'app non traccia il Prono.»

**GR-E22 — Schivata**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · SCHIVATA
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** intestazione SCHIVATA verde, PH 11 → 11, HO LINEA DI TIRO VERSO CHI ATTACCA
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E23 — Reset**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Interventor *(#8)* · RESET
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** intestazione RESET verde, WIP 15 → 15; nella ⓘ le note del Reset
- **ⓘ:** il tasto c’è, 1 voce:
  - *Interventor: Reset* (regole e promemoria): «Il malus di -3 per assenza di LoF vale sulla Schivata, non sul Reset.»

**GR-E24 — Fuoco di Soppressione**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Reaktion Zond *(#15)* · FUOCO DI SOPPRESSIONE
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione ROSSA, riquadro HEAVY MACHINE GUN rosso; nella ⓘ le armi senza il Tratto
- **ⓘ:** il tasto c’è, 1 voce:
  - *360 Visor non utilizzabile* (perché non si può): «non presente nel database armi»

**GR-E25 — Piazzare: equipaggiamenti**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Puppet Masters *(#22)* · PIAZZARE EQUIPAGGIAMENTO
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** intestazione verde, SHOCK MINE alto quanto il contenuto, usi residui
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E25b — Piazzare: un equipaggiamento finito**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Moran *(#19)* con i due CrazyKoala già piazzati · PIAZZARE EQUIPAGGIAMENTO
- **Schermata:** Armi / strumenti dell’Ordine
- **Guarda:** le D-Charges; i CrazyKoalas non ci sono: nella ⓘ «… non piazzabile» (usi esauriti)
- **ⓘ:** il tasto c’è, 2 voci:
  - *Moran: Marker CAMO → Modello sul tavolo (PIAZZARE EQUIPAGGIAMENTO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»
  - *CrazyKoalas non piazzabile* (perché non si può): «CrazyKoalas: usi esauriti — l'oggetto (CrazyKoalas) è Scarico: le altre armi Disposable restano usabili. Si toglie con Reload: Abilità Breve senza ti…»

**GR-E26 — Piazzare: le domande**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Moran *(#19)* · PIAZZARE · CrazyKoalas
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** le due domande, RISPONDI ALLE DOMANDE finché ne manca una
- **ⓘ:** il tasto c’è, 1 voce:
  - *Moran: Marker CAMO → Modello sul tavolo (PIAZZARE EQUIPAGGIAMENTO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»

**GR-E27 — Piazzare: D-Charges, bersagli non ammessi**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Moran *(#19)* · PIAZZARE · D-Charges (Demolition Mode)
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** «Nessun bersaglio ammesso da quest’arma»; nella ⓘ «… non ammesso» col motivo
- **ⓘ:** il tasto c’è, 7 voci:
  - *Moran: Marker CAMO → Modello sul tavolo (PIAZZARE EQUIPAGGIAMENTO)* (cambio di stato): «Stato CAMO cancellato: si sostituisce il Marker col modello.»
  - *Fante non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»
  - *Bazooka non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»
  - *Orc non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»
  - *Nisse non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»
  - *SEGNALINO MIMETICO non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»
  - *Teutone non ammesso* (perché non si può): «L'arma colpisce solo: STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO, NEMICO_NULL.»

**GR-E28 — Forward Observer**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · FORWARD OBSERVER
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** righe dei bersagli; nella ⓘ i Marker non bersagliabili
- **ⓘ:** il tasto c’è, 1 voce:
  - *SEGNALINO MIMETICO non bersagliabile* (perché non si può): «Marker CAMO: va Scoperto prima (oppure usa un Attacco Intuitivo).»

**GR-E29 — Forward Observer: scheda**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-E28 sul Fusilier *(#1)*
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** scheda del bersaglio come nell’Attacco BS (Burst 2, barra, COPERTURA, LINEA DI TIRO)
- **ⓘ:** il tasto c’è, 3 voci:
  - *FORWARD OBSERVER* (regole e promemoria): «Attributo dell'azione FORWARD OBSERVER.»
  - *FORWARD OBSERVER* (regole e promemoria): «È un Attacco con un'arma BS col Tratto BS Weapon (WIP). Invece di costringere il bersaglio a un Tiro Salvezza, lo fa entrare in Stato Bersagliato.»
  - *FORWARD OBSERVER* (regole e promemoria): «Si piazza un Token TARGETED accanto al bersaglio colpito.»

**GR-E30 — Sensor**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · SENSOR
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** WIP 13 → 19, ESEGUI TIRO 60 px
- **ⓘ:** il tasto c’è, 3 voci:
  - *SENSOR* (regole e promemoria): «Nessun MOD di gittata né di Mimetismo: il regolamento li esclude.»
  - *SENSOR* (regole e promemoria): «Zona di Controllo dell'utente. Non serve la LoF, e non si designa alcun bersaglio.»
  - *SENSOR* (regole e promemoria): «I nemici con Camouflage NON possono rientrare in Stato CAMO dentro la ZdC dell'utente.»

**GR-E31 — Rientrare in CAMO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Intruder (HMG) *(#24)* rivelato · RIENTRARE IN CAMO
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** intestazione ROSSA, SÌ / NO, RISPONDI ALLE DOMANDE
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E32 — Movimento**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · MUOVERE
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** IN ATTESA DI ARO…
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E33 — Movimento Cauto: la domanda**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · MOVIMENTO CAUTO
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** intestazione MOVIMENTO CAUTO rossa (Ordine Intero), la domanda, SÌ, FUORI DA LOF E ZDC (verde) e NO, DENTRO LOF O ZDC (giallo)
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E34 — Salto**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · SALTO
- **Schermata:** Radar (Gruppi)
- **Guarda:** l’Ordine parte subito (Ordine Intero senza seconda metà) e l’app torna al radar
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E35 — Idle**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Grenzer *(#12)* · IDLE
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** IN ATTESA DI ARO…
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E36 — Interagire con un Obiettivo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** una Console sul tavolo; Grenzer *(#12)* · INTERAGIRE (OBIETTIVO)
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** la Console come riquadro normale; nella ⓘ le note della Scenografia
- **ⓘ:** il tasto c’è, 2 voci:
  - *Scenografia* (regole e promemoria): «Richiede il contatto di Silhouette col bersaglio.»
  - *Scenografia* (regole e promemoria): «Il tiro e le condizioni li detta la Regola di Scenario in vigore: il calcolatore non la conosce.»

**GR-E37 — Deactivator**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Salyut (Deactivator, Repeater) *(#43)* · DEACTIVATOR, senza dispositivi nemici sul tavolo
- **Schermata:** Bersagli dell’Ordine
- **Guarda:** «Nessun dispositivo nemico da disattivare» e l’avviso giallo; intestazione DEACTIVATOR verde
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-E38 — Ingresso in campo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Spector *(#29)* in Schieramento Aereo · INGRESSO IN CAMPO (AD)
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** PH 13, la domanda del punto d’atterraggio; nella ⓘ le note dell’Ingresso
- **ⓘ:** il tasto c’è, 3 voci:
  - *Ingresso in campo* (regole e promemoria): «La truppa non si schiera nella Fase di Schieramento e resta fuori tavolo. Mentre è fuori NON aggiunge il proprio Ordine al Pool, ma può entrare usand…»
  - *Ingresso in campo* (regole e promemoria): «Durante l'Ordine in cui si usa questa Abilità, la truppa NON può beneficiare della Copertura Parziale.»
  - *Ingresso in campo* (regole e promemoria): «In entrambi i casi il Giocatore Reattivo dichiara tutti i propri ARO.»

**GR-E39 — Request Speedball**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Alguacil *(#1)* · REQUEST SPEEDBALL
- **Schermata:** Scheda e modificatori dell’Ordine
- **Guarda:** PH fisso 14, i Token; nella ⓘ le note dello Speedball
- **ⓘ:** il tasto c’è, 7 voci:
  - *Speedball* (regole e promemoria): «Il tiro è un PH 14 fisso: non dipende dal PH di chi lo richiede.»
  - *Speedball* (regole e promemoria): «Nel proprio Turno Attivo. NON si può fare a metà della Sequenza di Spesa dell'Ordine.»
  - *Speedball* (regole e promemoria): «Servono DUE Speedball Token (uso strategico dei Command Token).»
  - *Speedball* (regole e promemoria): «Primo Token: Il giocatore SCEGLIE l'oggetto dalla Speedball Chart.»
  - *Speedball* (regole e promemoria): «Secondo Token: Il giocatore TIRA sulla Chart.»
  - *Speedball* (regole e promemoria): «Gli Speedball Token sono State Token: non bloccano il movimento nemico e NON sono bersaglio dei Deactivator.»
  - *Speedball* (regole e promemoria): «Una truppa non può avere più di un Speedball Item Token alla volta.»

**GR-E40 — Ricaricare**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Kulak *(#23)* con la Cybermine spesa · RICARICARE
- **Schermata:** Attesa dell’ARO / 2ª metà
- **Guarda:** la finestra RELOAD (Baggage); confermata, IN ATTESA DI ARO
- **ⓘ:** nessuna voce, il tasto **non c’è**.
- **Finestre:** «✅ Kulak ricarica: Cybermine (+1) Gli equipaggiamenti gia` piazzati sul tavolo restano dov…»

---

# 6. F. Stati di una truppa

**GR-F01 — Pagina degli stati**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** tocco prolungato sull’Alguacil *(#1)*
- **Schermata:** Stati della truppa
- **Guarda:** le 16 icone, Fireteam NESSUNO, CONFERMA E SALVA verde, ANNULLA
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-F02 — Stati: truppa in CAMO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** tocco prolungato sull’Intruder *(#24)*
- **Schermata:** Stati della truppa
- **Guarda:** la casella CAMO accesa
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-F03 — Stati: secondo profilo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** tocco prolungato sul Puppetbot (Red Fury) *(#17)*
- **Schermata:** Stati della truppa
- **Guarda:** 🔄 PASSA AL PROFILO …
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-F04 — Stati: Escape System**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** tocco prolungato sull’Anaconda *(#41)*
- **Schermata:** Stati della truppa
- **Guarda:** 🪂 ESCAPE SYSTEM: FAI USCIRE IL PILOTA (viola)
- **ⓘ:** nessuna voce, il tasto **non c’è**.

---

# 7. G. Turno reattivo (ARO)

**GR-G01 — Turno avversario con l’allarme**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** il Fusilier *(PanOceania #1)* dichiara ATTACCO BS sull’Alguacil
- **Schermata:** Turno avversario
- **Guarda:** TURNO AVVERSARIO rosso, il riquadro dell’allarme con GESTISCI ARO e NESSUN ARO
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-G02 — Chi reagisce**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** GESTISCI ARO, tocca l’Alguacil
- **Schermata:** ARO: chi reagisce
- **Guarda:** righe con la foto; nella ⓘ chi non può reagire (Daktari Incosciente)
- **ⓘ:** il tasto c’è, 1 voce:
  - *Daktari non può reagire* (perché non si può): «Stato Nullo: non può dichiarare ARO.»

**GR-G03 — Le reazioni**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-G02, AVANTI
- **Schermata:** ARO: la reazione
- **Guarda:** ATTACCO BS, ATTACCO IN CORPO A CORPO, SCHIVATA, RESET, tutte verdi (Abilità Brevi); nella ⓘ le note delle reazioni e quelle non disponibili
- **ⓘ:** il tasto c’è, 3 voci:
  - *Attacco in Corpo a Corpo* (regole e promemoria · sotto il tasto `reazione-CC_ATTACK`): «Richiede il contatto di Silhouette col nemico.»
  - *Reset* (regole e promemoria · sotto il tasto `reazione-RESET`): «Contro questo attacco il Reset non si oppone: due Tiri Normali. Serve solo a cancellare gli stati che il Reset cancella.»
  - *Hacking non disponibile* (perché non si può): «Non è un Hacker.»

**GR-G04 — Le reazioni in Foxhole**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-G03 con l’Alguacil in Foxhole
- **Schermata:** ARO: la reazione
- **Guarda:** nella ⓘ la nota del Foxhole
- **ⓘ:** il tasto c’è, 4 voci:
  - *Attacco in Corpo a Corpo* (regole e promemoria · sotto il tasto `reazione-CC_ATTACK`): «Richiede il contatto di Silhouette col nemico.»
  - *Reset* (regole e promemoria · sotto il tasto `reazione-RESET`): «Contro questo attacco il Reset non si oppone: due Tiri Normali. Serve solo a cancellare gli stati che il Reset cancella.»
  - *Foxhole* (regole e promemoria): «In ARO il Foxhole non si cancella e non cade: la truppa reagisce tenendo Copertura a 360 gradi e Mimetism (-3), ma una Schivata riuscita non la fa mu…»
  - *Hacking non disponibile* (perché non si può): «Non è un Hacker.»

**GR-G05 — Arma dell’ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** ATTACCO BS
- **Schermata:** ARO: l’arma
- **Guarda:** bottoni delle armi; nella ⓘ le escluse
- **ⓘ:** il tasto c’è, 1 voce:
  - *CC Weapon non utilizzabile* (perché non si può): «arma da Corpo a Corpo»

**GR-G06 — Arma dell’ARO in Soppressione**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Reaktion Zond *(#15)* in Soppressione · ATTACCO BS
- **Schermata:** ARO: l’arma
- **Guarda:** profilo SF Mode; nella ⓘ il Fuoco di Soppressione
- **ⓘ:** il tasto c’è, 4 voci:
  - *Fuoco di Soppressione* (regole e promemoria): «Profilo SF Mode: gittata e Burst sostituiti, PS e munizioni invariati. Il Burst pieno va tutto su un bersaglio solo.»
  - *Soppressione* (regole e promemoria): «In Soppressione puoi rispondere col profilo SF Mode, e restare in Soppressione, oppure in modo normale — Burst pieno e gittate dell'arma — ma la Sopp…»
  - *360 Visor non utilizzabile* (perché non si può): «non presente nel database armi»
  - *PARA CC Weapon non utilizzabile* (perché non si può): «arma da Corpo a Corpo»

**GR-G07 — Bersaglio dell’ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Combi Rifle
- **Schermata:** ARO: il bersaglio
- **Guarda:** le righe dei possibili bersagli
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-G08 — Modificatori dell’ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** sul Fusilier
- **Schermata:** ARO: modificatori
- **Guarda:** barra della gittata, COPERTURA, LINEA DI TIRO, munizioni, terreno, CONFERMA E PROCEDI; nella ⓘ il Burst
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-G09 — Modificatori dell’ARO: Copertura e Fumo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-G08, IN COPERTURA e Fumo
- **Schermata:** ARO: modificatori
- **Guarda:** nella ⓘ Copertura e Fumo
- **ⓘ:** il tasto c’è, 2 voci:
  - *Copertura* (spiegazione dei MOD · sotto il tasto `copertura`): «-3 al tuo tiro, +3 alla sua ARM.»
  - *Fumo* (spiegazione dei MOD): «Zona di Visibilità Zero. Un MSV L2 o L3 la attraversa. Se sulla stessa linea c'è anche Eclipse, tocca Eclipse: vale quella.»

**GR-G10 — Modificatori dell’ARO: Smoke Grenades**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Morlock *(#13)* · ATTACCO BS · Smoke Grenades
- **Schermata:** ARO: modificatori
- **Guarda:** riquadro ATTACCO A SAGOMA, barra, LINEA DI TIRO, munizione SMOKE, nessun tasto Copertura; nella ⓘ «Arma Targetless»
- **ⓘ:** il tasto c’è, 1 voce:
  - *Arma Targetless* (spiegazione dei MOD): «Si tira su un punto del tavolo. Niente Copertura né Mimetismo; restano la gittata e la Linea di Tiro verso l'attivo.»

**GR-G11 — Schivata in ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** SCHIVATA
- **Schermata:** ARO: modificatori
- **Guarda:** LINEA DI TIRO, CONFERMA E PROCEDI; nella ⓘ le note della Schivata
- **ⓘ:** nessuna voce, il tasto **non c’è**.

**GR-G12 — Reset in ARO**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** l’Orc dichiara HACKING; Interventor *(#8)* · RESET
- **Schermata:** ARO: modificatori
- **Guarda:** nella ⓘ le note del Reset
- **ⓘ:** il tasto c’è, 1 voce:
  - *Reset* (regole e promemoria): «Il malus di -3 per assenza di LoF vale sulla Schivata, non sul Reset.»

**GR-G13 — Total Reaction**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** Reaktion Zond *(#15)* · ATTACCO BS · Heavy Machine Gun
- **Schermata:** ARO: modificatori
- **Guarda:** nessun tasto del Burst; nella ⓘ il Burst pieno
- **ⓘ:** il tasto c’è, 1 voce:
  - *Burst* (regole e promemoria): «In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell'arma in ARO (B4)»

**GR-G14 — Un CrazyKoala sul tavolo**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** il Moran *(#19)* ha un CrazyKoala sul tavolo; GESTISCI ARO
- **Schermata:** ARO: chi reagisce
- **Guarda:** il koala come riga con la sua foto, separato dalle truppe
- **ⓘ:** il tasto c’è, 1 voce:
  - *CrazyKoala #1 non può reagire* (perché non si può): «È un Deployable: reagisce solo col proprio innesco, non dichiara ARO.»

**GR-G15 — DETONAZIONE di una mina**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** la Puppet Masters *(#22)* ha una Shock Mine sul tavolo; GESTISCI ARO, tocca la mina
- **Schermata:** ARO: la reazione
- **Guarda:** una sola azione, DETONAZIONE, e le tre domande d’innesco; nella ⓘ «Non lo sceglie la mina…»
- **ⓘ:** il tasto c’è, 1 voce:
  - *DETONAZIONE* (regole e promemoria · sotto il tasto `detonazione`): «Non lo sceglie la mina: dichiara cosa è successo al tavolo.»

**GR-G16 — DETONAZIONE del CrazyKoala (pagina)**
- **App:** Nomadi (telefono, 390 px)
- **Passi:** come GR-G14, tocca la riga del koala
- **Schermata:** ARO: la reazione
- **Guarda:** una sola azione, DETONAZIONE, con la domanda della Zona di Controllo; nella ⓘ «Si attiva per Zona di Controllo…»
- **ⓘ:** il tasto c’è, 1 voce:
  - *DETONAZIONE* (regole e promemoria · sotto il tasto `detonazione`): «Si attiva per Zona di Controllo: la Linea di Tiro non serve.»

---

# 8. H. Hub (calcolatore)

**GR-H01 — Hub: il tabellone**
- **App:** Hub, 1280 px
- **Passi:** apri l’Hub a metà partita
- **Schermata:** tabellone dell’Hub
- **Guarda:** le due fazioni, fazione attiva, stati e ferite di ogni truppa; il Marker come SEGNALINO MIMETICO
- **ⓘ:** l’Hub non ha la ⓘ: le note stanno nel tabellone.

**GR-H02 — Hub: Faccia a Faccia**
- **App:** Hub, 1280 px
- **Passi:** Alguacil *(#1)* · ATTACCO BS sul Fusilier *(#1)*, che risponde con ATTACCO BS
- **Schermata:** tabellone dell’Hub
- **Guarda:** TIRO FACCIA A FACCIA, i due Valori di Successo, i dadi, le salvezze ARM VS 8 ×1
- **ⓘ:** l’Hub non ha la ⓘ: le note stanno nel tabellone.

**GR-H03 — Hub: Tiro Normale**
- **App:** Hub, 1280 px
- **Passi:** come GR-H02, il Fusilier in Copertura tocca NESSUN ARO
- **Schermata:** tabellone dell’Hub
- **Guarda:** TIRO NORMALE, la Copertura fra i MOD, salvezza ARM VS 11 ×1
- **ⓘ:** l’Hub non ha la ⓘ: le note stanno nel tabellone.

**GR-H04 — Hub: Sagoma d’Impatto su due bersagli**
- **App:** Hub, 1280 px
- **Passi:** Alguacil (Missile Launcher) *(#3)* · ATTACCO BS, Sagoma d’Impatto su Fusilier *(#1)* e *(#2)*
- **Schermata:** tabellone dell’Hub
- **Guarda:** un riquadro «SAGOMA D’IMPATTO: UN TIRO, 2 BERSAGLI», PRINCIPALE e SECONDARIO
- **ⓘ:** l’Hub non ha la ⓘ: le note stanno nel tabellone.

**GR-H05 — Hub su tablet**
- **App:** Hub, 820 px
- **Passi:** l’Hub su un tablet in verticale
- **Schermata:** tabellone dell’Hub
- **Guarda:** le due fazioni una sotto l’altra, caratteri leggibili
- **ⓘ:** l’Hub non ha la ⓘ: le note stanno nel tabellone.

---

# 9. Tutte le note dell’app, e chi le mostra

Ogni riga è un punto del codice che deposita una nota nella ⓘ (tramite `M.nota`). Il giro ha registrato quali prove la fanno comparire. Una riga senza prova è una nota che questo piano ancora non mostra.

| Dove | Esempio di titolo | Schermata | Prove |
|---|---|---|---|
| `ordine_attacco_bs.js:242` | CC Weapon non utilizzabile | Armi / strumenti dell’Ordine | GR-D01, GR-D02, GR-D03, GR-D04, GR-D05, GR-D06, GR-D07, GR-D08, GR-D09, GR-D10, GR-D11, GR-D12 |
| `ordine_attacco_bs.js:368` | SEGNALINO MIMETICO non bersagliabile | Bersagli dell’Ordine | GR-D02, GR-D03, GR-D04, GR-D05, GR-D06, GR-D07, GR-D08, GR-D09, GR-D12 |
| `ordine_attacco_bs.js:539` | Sagoma su un alleato | Scheda e modificatori dell’Ordine | GR-D07 |
| `ordine_attacco_bs.js:540` | Sagome annullate | Scheda e modificatori dell’Ordine | GR-D07 |
| `ordine_attacco_bs.js:547` | Burst | Scheda e modificatori dell’Ordine | GR-D07 |
| `ordine_attacco_bs.js:554` | Dado Speciale | Scheda e modificatori dell’Ordine | GR-D09 |
| `ordine_attacco_bs.js:650` | Arma Targetless | Scheda e modificatori dell’Ordine | GR-D10 |
| `ordine_attacco_bs.js:651` | Copertura | Scheda e modificatori dell’Ordine | GR-D05 |
| `ordine_attacco_bs.js:652` | Fumo | Scheda e modificatori dell’Ordine | GR-D05 |
| `ordine_attacco_cc.js:225` | Burst | Scheda e modificatori dell’Ordine | GR-E02, GR-E03 |
| `ordine_attacco_cc.js:227` | Dado Speciale | Scheda e modificatori dell’Ordine | GR-E03 |
| `ordine_attacco_cc.js:297` | Corpo a Corpo | Scheda e modificatori dell’Ordine | GR-E02, GR-E03 |
| `ordine_attacco_guidato.js:132` | Missile Launcher (Hit Mode) non utilizzabile per il Guidato | Armi / strumenti dell’Ordine | GR-E13, GR-E14, GR-E15 |
| `ordine_attacco_guidato.js:207` | Fante non bersagliabile | Bersagli dell’Ordine | GR-E14 |
| `ordine_attacco_guidato.js:378` | Cosa NON si applica | Scheda e modificatori dell’Ordine | GR-E15 |
| `ordine_attacco_guidato.js:379` | Si applica invece | Scheda e modificatori dell’Ordine | GR-E15 |
| `ordine_attacco_intuitivo.js:196` | Fante non bersagliabile con l'Intuitivo | Bersagli dell’Ordine | GR-E11, GR-E12 |
| `ordine_attacco_intuitivo.js:287` | Critico | Scheda e modificatori dell’Ordine | GR-E12 |
| `ordine_attacco_intuitivo.js:288` | Copertura | Scheda e modificatori dell’Ordine | GR-E12 |
| `ordine_attacco_intuitivo.js:289` | Reazione del bersaglio | Scheda e modificatori dell’Ordine | GR-E12 |
| `ordine_attacco_intuitivo.js:290` | Se il tiro fallisce | Scheda e modificatori dell’Ordine | GR-E12 |
| `ordine_difesa.js:147` | Interventor: Reset | Scheda e modificatori dell’Ordine | GR-E23 |
| `ordine_difesa.js:248` | 360 Visor non utilizzabile | Armi / strumenti dell’Ordine | GR-E24 |
| `ordine_fuoco_speculativo.js:119` | AP Submachine Gun non utilizzabile per il Fuoco Speculativo | Armi / strumenti dell’Ordine | GR-E07, GR-E08, GR-E09 |
| `ordine_fuoco_speculativo.js:331` | Cosa NON si applica a questo tiro | Scheda e modificatori dell’Ordine | GR-E09 |
| `ordine_fuoco_speculativo.js:332` | Si applica invece | Scheda e modificatori dell’Ordine | GR-E09 |
| `ordine_fuoco_speculativo.js:333` | Sagoma Circolare | Scheda e modificatori dell’Ordine | GR-E09 |
| `ordine_hacking.js:145` | ASSISTED FIRE: non gestito da questa schermata | Armi / strumenti dell’Ordine | GR-E06 |
| `ordine_hacking.js:377` | Area di Hacking | Scheda e modificatori dell’Ordine | GR-E05 |
| `ordine_logistica.js:127` | Ingresso in campo | Scheda e modificatori dell’Ordine | GR-E38 |
| `ordine_logistica.js:205` | Speedball | Scheda e modificatori dell’Ordine | GR-E39 |
| `ordine_osservazione.js:153` | SEGNALINO MIMETICO non bersagliabile | Bersagli dell’Ordine | GR-E28, GR-E29 |
| `ordine_osservazione.js:168` | — | — | non si vede nell’app: è il ramo per quando `app.html` manca (banchi); nell’app le stesse note escono da `:153` (GR-E28) |
| `ordine_osservazione.js:290` | FORWARD OBSERVER | Scheda e modificatori dell’Ordine | GR-E29, GR-E30 |
| `ordine_piazzamento.js:136` | CrazyKoalas non piazzabile | Armi / strumenti dell’Ordine | GR-E25b |
| `ordine_piazzamento.js:177` | Fante non ammesso | Bersagli dell’Ordine | GR-E27 |
| `ordine_scenografia.js:127` | — | — | non costruita al tavolo grafico: i bersagli del Deactivator li tengono i banchi (`test_novita_26ott.js`, `test_modulo_scenografia.js`; DEP-11 del Piano di collaudo) |
| `ordine_scenografia.js:236` | Scenografia | Scheda e modificatori dell’Ordine | GR-E36 |
| `ordine_scoprire.js:122` | Fante non scopribile | Bersagli dell’Ordine | GR-E16, GR-E17 |
| `ordine_scoprire.js:251` | Scoprire | Scheda e modificatori dell’Ordine | GR-E17 |
| `ordine_supporto.js:152` | Alguacil non soccorribile | Bersagli dell’Ordine | GR-E19, GR-E20, GR-E21 |
| `ordine_supporto.js:241` | Doctor | Scheda e modificatori dell’Ordine | GR-E20, GR-E21 |
| `logica_aro.js:422` | Daktari non puo` reagire | ARO: chi reagisce | GR-G02, GR-G14, GR-G16 |
| `logica_aro.js:442` | DETONAZIONE | ARO: la reazione | GR-G15, GR-G16 |
| `logica_aro.js:760` | Attacco in Corpo a Corpo | ARO: la reazione | GR-G03, GR-G04, GR-G05, GR-G06, GR-G07, GR-G08, GR-G09, GR-G10, GR-G11, GR-G12, GR-G13 |
| `logica_aro.js:772` | Foxhole | ARO: la reazione | GR-G04 |
| `logica_aro.js:778` | Hacking non disponibile | ARO: la reazione | GR-G03, GR-G04, GR-G05, GR-G06, GR-G07, GR-G08, GR-G09, GR-G10, GR-G11, GR-G12, GR-G13 |
| `logica_aro.js:856` | Fuoco di Soppressione | ARO: l’arma | GR-G06 |
| `logica_aro.js:857` | Soppressione | ARO: l’arma | GR-G06 |
| `logica_aro.js:949` | CC Weapon non utilizzabile | ARO: l’arma | GR-G05, GR-G06, GR-G07, GR-G08, GR-G09, GR-G10, GR-G13 |
| `logica_aro.js:1114` | Reset | ARO: modificatori | GR-G12 |
| `logica_aro.js:1309` | Burst | ARO: modificatori | GR-G13 |
| `logica_aro.js:1310` | — | — | non costruita al tavolo grafico: il Burst limitato agli usi residui in ARO lo tiene il banco (`test_novita_26ott.js` O2) |
| `logica_aro.js:1311` | Copertura | ARO: modificatori | GR-G09 |
| `logica_aro.js:1312` | Arma Targetless | ARO: modificatori | GR-G10 |
| `logica_aro.js:1313` | Fumo | ARO: modificatori | GR-G09 |
| `roster_manager.js:1499` | HIDDEN DEPLOYMENT | Stati di schieramento | GR-B06, GR-B07, GR-B08, GR-B09, GR-B13 |
| `roster_manager.js:1803` | Shock Mine | Stati di schieramento | GR-B06, GR-B07, GR-B13 |

Coperte: **55 su 58**.

# 10. Tutte le schermate, e chi le mostra

| Schermata | Prove |
|---|---|
| Menu iniziale | GR-A01 |
| Composizione lista | GR-A02, GR-A03, GR-A04, GR-A05 |
| Dispiegamento (Gruppi) | GR-B01 |
| Unità da schierare | GR-B02, GR-B03, GR-B11 |
| Stati di schieramento | GR-B04, GR-B05, GR-B06, GR-B07, GR-B08, GR-B09, GR-B10, GR-B13 |
| Azioni di dispiegamento | **nessuna** |
| Connessione stabilita | GR-B12 |
| Radar (Gruppi) | GR-C01, GR-E34 |
| Truppe del Gruppo | GR-C02, GR-C03, GR-C06 |
| Menu degli Ordini (1ª metà) | GR-C04, GR-C05 |
| Armi / strumenti dell’Ordine | GR-D01, GR-E01, GR-E04, GR-E06, GR-E07, GR-E10, GR-E13, GR-E18, GR-E24, GR-E25, GR-E25b |
| Bersagli dell’Ordine | GR-D02, GR-E08, GR-E11, GR-E14, GR-E16, GR-E19, GR-E27, GR-E28, GR-E37 |
| Attesa dell’ARO / 2ª metà | GR-C07, GR-D03, GR-D11, GR-E32, GR-E35, GR-E40 |
| Scheda e modificatori dell’Ordine | GR-D04, GR-D05, GR-D06, GR-D07, GR-D08, GR-D09, GR-D10, GR-D12, GR-E02, GR-E03, GR-E05, GR-E09, GR-E12, GR-E15, GR-E17, GR-E20, GR-E21, GR-E22, GR-E23, GR-E26, GR-E29, GR-E30, GR-E31, GR-E33, GR-E36, GR-E38, GR-E39 |
| Stati della truppa | GR-F01, GR-F02, GR-F03, GR-F04 |
| Turno avversario | GR-G01 |
| ARO: chi reagisce | GR-G02, GR-G14 |
| ARO: la reazione | GR-G03, GR-G04, GR-G15, GR-G16 |
| ARO: l’arma | GR-G05, GR-G06 |
| ARO: il bersaglio | GR-G07 |
| ARO: modificatori | GR-G08, GR-G09, GR-G10, GR-G11, GR-G12, GR-G13 |
| Hub | GR-H01, GR-H02, GR-H03, GR-H04, GR-H05 |

# 11. Difetti aperti trovati dal giro

| Difetto | Prove | A chi |
|---|---|---|
| Il tasto ⓘ copre l’angolo destro dell’intestazione o del titolo quando il testo è lungo («BERSAGLI DEL FUOCO SPECULATI…», «INTERAGIRE CON OBIETTIVO»). | GR-E08, GR-E11, GR-E25, GR-E25b, GR-E26, GR-E36 | INTERFACCIA |

# 12. Ordine di esecuzione

1. Le prove si fanno nell’ordine dei capitoli: ogni capitolo parte dal tavolo grafico.
2. Per ogni prova si confronta la schermata con la foto dell’artifact; la ⓘ si apre e si leggono le voci.
3. Alla fine si ripete **GR-B13** con l’opzione SOTTO I TASTI su due schermate a scelta, e si torna a NELLA ⓘ.

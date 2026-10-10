<!-- @versione 2026-10-10.3 | PRONTUARIO_ORDINI_N5.md | proprieta`: chat REGOLE -->

# PRONTUARIO ORDINI N5 — richiamo rapido durante la partita

> **A cosa serve.** Dichiari un ordine nell'app e vuoi sapere *come si calcola*:
> quali MOD entrano nel tiro, quali NON entrano, chi tira, quante salvezze.
> Una scheda per ordine, nello stesso ordine dei moduli del calcolatore.
>
> **Fonti.** `REGOLE_N5_v5_1_1.txt` (PDF ufficiale, 24 aprile 2025) + wiki
> `infinitythewiki.com` aggiornata a **N5.3** (settembre 2026) + FAQ v0.1 +
> Weapon Chart N5.3. Dove le due fonti divergono, vince la wiki: il .txt del
> progetto è fermo a 5.1.1 (vedi §9 e §10).
>
> **Legenda affidabilità.** ✅ verificato su regolamento o wiki · ⚠️ da verificare
> · 🔴 divergenza trovata fra app e regolamento (dettagli in §10).

## INDICE

| § | Contenuto |
|---|---|
| 0 | Motore di base: SV, MOD, critici, Faccia a Faccia, Burst |
| 1 | **Le schede ordine** — 1.1 BS · 1.2 CC · 1.3 Intuitivo · 1.4 Speculativo · 1.5 Guidato · 1.6 Hacking · 1.7 Scoprire · 1.8 Supporto · 1.9 Difesa · 1.10 Soppressione · 1.11 Movimento · 1.12 Coordinato · 1.13 Osservazione · 1.14 Piazzamento · 1.15 Trincerarsi · 1.16 Scenografia · 1.17 Logistica · 1.18 Entrare in forma di Marker |
| 2 | Matrice MOD × ordine |
| 3 | Armi: tipi, profili, tratti, notazioni |
| 4 | Munizioni e Tiri Salvezza |
| 5 | Skill che toccano il calcolo |
| 6 | Equipaggiamento che tocca il calcolo |
| 7 | Stati · **7.1 che cosa si può dichiarare, stato per stato** |
| 8 | Fireteam e Ordine Coordinato |
| 9 | Cosa è cambiato in 5.2 e 5.3 |
| 10 | Esito della verifica: cosa correggere |

---

# 0. MOTORE DI BASE

Vale per ogni ordine, sempre.

- **SV (Valore di Successo)** = Attributo + somma di tutti i MOD applicabili. Si tira
  1d20: risultato **≤ SV** = successo. ✅
- **Tetto MOD: ±12.** Somme oltre vengono troncate a +12 / −12. ✅
- **SV < 1** → fallimento automatico, non si tira. **SV > 20** → l'eccedenza allarga
  il range di Critico (SV 23 → critico su 20, 1, 2, 3). ✅
- **Arrotondamento: sempre per eccesso.** Metà di 5 = 3. ✅
- **Critico** = dado uguale al SV esatto. Nel Faccia a Faccia il critico vince
  sempre; doppio critico = pareggio e falliscono entrambi. Ogni critico in attacco
  = **+1 Tiro Salvezza** per il bersaglio (salvo Immunity Critical). La salvezza
  extra conserva attributo e Tratti dell'arma. ✅
- **Tiro Normale o Faccia a Faccia?** Faccia a Faccia **solo se la skill dichiarata
  dal bersaglio influenza l'esito dell'attacco**. Altrimenti l'attaccante fa un Tiro
  Normale. ✅
- **Burst.** In Turno Attivo si usa il **Burst pieno**, MOD inclusi. Eccezione: i MOD
  con etichetta **Optional** (per esempio il Bonus Burst di Fireteam) sono facoltativi
  in entrambi i turni. In **ARO il Burst è sempre 1**, salvo regole che lo modificano
  (Total Reaction, Neurocinetics, Fuoco di Soppressione, Enhanced Reaction). ✅
- **Burst massimo assoluto: 6.** I dadi da `+1 SD` non contano verso questo tetto,
  perché non aumentano il Burst. ✅
- **Sequenza dell'Ordine:** 1. Attivazione (spesa ordine + 1ª Skill) → 2. ARO check →
  3. 2ª Skill → 4. ARO check e dichiarazione ARO → 5. **Risoluzione** (qui si
  verificano i Requisiti, si misurano le gittate, si applicano i MOD, si tira) →
  5.1 Effetti (salvezze, movimento della Schivata) → 5.2 Conclusione (Guts Roll,
  Alert!). Eccezioni che si verificano alla *dichiarazione*: Alert!, Basic Short
  Skill, Jump, Climb. ✅
- **🔴 Requisito non soddisfatto = sempre Idle.** Righe 1244–1247: «the action is
  cancelled and the Trooper instead performs an Idle. Additionally, any declared uses
  of Disposable items are expended and lost». Vale in **entrambi** i momenti di
  verifica: anche per Jump, che si verifica alla dichiarazione, l'esempio del
  regolamento (righe 2862–2864) finisce con «he performs an Idle instead». Quindi
  l'Ordine **è speso**, gli usi Disposable **si consumano**, e un Marker si **rivela**
  (righe 7462–7463). Non esiste un requisito fallito che restituisca l'Ordine. ✅
- **🔴 Un Idle da requisito fallito NON riapre gli ARO.** La dichiarazione degli ARO è il
  passo 4, la verifica dei Requisiti il passo 5 (righe 1196–1217): quando il requisito cade,
  la finestra degli ARO è già chiusa. E ogni nemico ha **un solo ARO per Ordine**, righe
  **1097–1101**: «each eligible enemy Trooper gets **one single ARO**, regardless of the number
  of Skills the Active Player declares during that Order». Gli ARO già dichiarati restano e si
  risolvono. ⚠️ Ma **cambiano tipo di tiro**: se l'attivo non fa più niente, l'ARO non ha più
  nulla da contrastare, quindi non è più un Faccia a Faccia ma un **Tiro Normale** (righe
  2068–2070: «For actions to be resolved with a Face to Face Roll, both Troopers' actions must
  affect each other directly»). L'unica riapertura prevista è un'altra cosa: se la **seconda**
  metà dell'Ordine dà l'ARO a nemici che non l'avevano contro la prima, quelli dichiarano
  (righe 1092–1095).
- **Quando invece l'Ordine NON è speso** (il giocatore sceglie altro): solo se la regola
  non è un *Requisito* ma un **vincolo di piazzamento**, cioè un divieto scritto come
  «the player cannot place…» / «is not permitted». L'unico caso nell'app è il
  **Combat Jump** (righe 8049–8053), che non ha affatto un blocco REQUIREMENTS: il
  punto d'atterraggio non è ammesso e se ne sceglie un altro. ✅
- **Regola generale:** quando più skill si applicano insieme, vince l'opzione più
  restrittiva. ✅

**MOD "fra parentesi tonde" nel profilo** — vale per skill, armi ed equip: ✅

| Notazione | Significato |
|---|---|
| `(+N)` | +N all'**utente**, solo con quella skill/arma |
| `(-N)` | −N al **nemico**. Se la skill è Automatica (Mimetism, Surprise Attack, ECM) si applica sempre come dice la sua regola; negli altri casi (`Dodge (-3)`, `CC Attack (-3)`) **solo nei Faccia a Faccia** |
| `(+1B)` | +1 Burst all'utente, **solo in Turno Attivo** |
| `(+1 SD)` | 1 dado extra, poi se ne scarta uno. **Non** aumenta il Burst (né il tetto di 6), **non** consuma usi Disposable, **non** si applica alle Long Skill né a chi non tira (Sagome Dirette) — righe **1957–1959**. Vale in **Attivo e in Reattivo**. Col Burst diviso, il dado extra va a **un solo** bersaglio e lo scarto avviene su quel tiro. Nel F2F si scarta dopo che entrambi hanno tirato; sceglie prima l'attivo. **Un'arma a due modalità lo usa solo nella modalità che tira**: vedi il caso Drop Bears in §3.3 |
| `(+1B)` in ARO | **mai**, nemmeno col Total Reaction: il testo lo esclude esplicitamente nel Turno Reattivo (righe 6646–6648) |
| `(ReRoll)` **nudo** | Ritira **un dado** del tiro, solo quando si usa quella skill/arma. ✅ **Invariato a N5.3**: verificato l'8 ottobre sulla wiki *Template:Modifiers-explained* (oldid 4027, marcata «PDF 5.3, September 2026»), che dice ancora «will allow the user to reroll **one die** from the Roll, only when using that Skill, Weapon, or Equipment» — identico alle righe 1939–1941 del nostro .txt, e **senza** limite per Ordine. Riguarda `Booty (ReRoll)` 16 profili, `MetaChemistry (ReRoll)` 8, `Deactivator (ReRoll)` 8, `Discover (ReRoll)` 2: tutti tiri a **un dado solo**, quindi "un dado" e "il tiro" coincidono e non c'è ambiguità da sciogliere |
| `(ReRoll …)` **con un valore**, solo Dottore e Ingegnere | ⚠️ **È un'altra notazione, non la stessa con un numero in più**: ha un limite per Ordine e ritira *il tiro*, non un dado. ✅ **Chiuso l'8 ottobre sulla wiki** (pagina *Doctor*, oldid 3979, che mostra le due forme affiancate): `(ReRoll −X)` è la forma **pre-N5.2** — «any failed Roll with this Skill may be rerolled, but with a negative MOD (−X) to the WIP Attribute»; in **N5.2** è diventata `(ReRoll WIP=X)` — «rerolled, but **applying the WIP Attribute indicated between brackets**». Non sono la stessa cosa: la prima è un malus, la seconda **sostituisce** il WIP. Vale per Dottore e Ingegnere. 🔴 **Nei dati ufficiali vive ancora la forma vecchia, e non esiste un numero per convertirla** — vedi il riquadro sotto |
| `(SR-1)` / `(SR-2)` | I **bersagli** applicano −1/−2 al proprio Tiro Salvezza. Non è gittata |
| `(PS=X)` | Fissa il PS dell'arma a X **in tutte le modalità**, e **sovrascrive** i PS diversi che la Weapon Chart dà alle singole modalità. Righe **6659–6660**, dove l'esempio del regolamento è proprio il nostro caso: «**Heavy Rocket Launcher (PS=5)** means that the PS of this Weapon is 5 in all usage Modes, **regardless of the different PS values listed in the Weapons Chart for its Modes**». In chart l'HRL ha Blast Mode **PS 6** (riga 16022) e Hit Mode **PS 5** (riga 16025): con la notazione il Blast scende a 5, cioè diventa **più letale** (PS basso = più letale) |
| `(PH=X)` / `(WIP=X)` | Usa X al posto dell'attributo del profilo per quel tiro |
| `(ARM+N)` / `(BTS+N)` | +N al proprio ARM/BTS se il tiro fallisce. ⚠️ **La fonte scrive lo spazio**: l'extra ufficiale è `ARM +3`, e così sta nei dati su 9 profili Coyote (misurato da DATABASE, 8 ottobre). Da oggi questo file segue la fonte: `Dodge (ARM +3)` |
| `(AP)`, `(Shock)`, `(Continuous Damage)` | L'utente aggiunge quella munizione o tratto a tutti i suoi attacchi. 🔴 **Non "correggere" la grafia verso l'ufficiale**: la fonte scrive *«Continous Damage»*, senza la u. Il progetto usa la grafia corretta **da entrambi i lati** (catalogo e database), e per questo `M.haTratto` trova 9 armi su 9. Allineare un lato solo spegne il tratto in silenzio su Lanciafiamme Pesante e Leggero, Lanciarazzi Pesante e Leggero nelle due modalità, Vulkan Shotgun e Flammenspeer nelle due (misurato da DATABASE, 8 ottobre) |
| `(2W)` | Il bersaglio recupera 2 Ferite invece di 1 |

> **NFB (Negative Feedback).** Una skill, equip o programma con l'etichetta NFB è
> incompatibile con qualunque altro che abbia la stessa etichetta o lo stesso Tratto.
>
> **Da dove si dichiara.** Una skill si può dichiarare solo da una posizione in cui la truppa
> è già stata, o che ha attraversato, **durante l'Ordine in corso**: mai da un punto non ancora
> raggiunto.
>
> ⚠️ **Il livello non sta fra parentesi.** `Martial Arts L3`, `MSV L2`, `Fatality L1`:
> il numero fa parte del **nome**. Fra parentesi c'è sempre un MOD, mai un livello.

> 🔴 **IL CASO BIPANDRA: una notazione orfana, e perché si lascia com'è.**
> Censito da DATABASE l'8 ottobre su `database_panoceania.js 4a97dcf6.152854` e sulla fonte
> ARMY `7.26246.158`:
> - nei dati esistono tre forme di Doctor: `Doctor` nuda (5 profili), `Doctor (+3)` (2) e
>   **`Doctor (ReRoll -3)` (2: `bipandra` e `bipandra_ta`)**. Nessun `Doctor (2W)`, nessun
>   `Doctor (ReRoll WIP=…)`;
> - la fonte ufficiale **porta ancora la forma vecchia**, e la prova è a livello di tabella, non
>   di profilo: la `filters.extras` di PanOceania ha la voce `{"id": 366, "name": "ReRoll -3"}`,
>   ed è quella che l'opzione Bipandra attacca alla skill. In nessuna delle due fazioni esiste
>   un extra `WIP=…`, su 85 extra distinti controllati.
>
> **Non esiste una fonte per X**, e l'ho cercata l'8 ottobre: l'aggiornamento ufficiale del
> 15 ottobre 2025 (*Army Update October 2025, Part 2*) dice soltanto «Revised wording in the
> following Special Skills» ed elenca il Doctor, **senza** rinotare nessun profilo; e
> l'aggiornamento N5.3 del 1 settembre 2026 non nomina né il Doctor né le notazioni `ReRoll`.
> Quindi è il caso che DATABASE aveva previsto: **la skill è cambiata, quel profilo no.**
>
> **Che cosa ne fa il motore** — ⚠️ LETTURA: legge `-3` **con la regola vecchia**, cioè ritira a
> **WIP − 3**. Bipandra ha WIP 13 in entrambi i profili, quindi ritira a **10**. Le altre due
> strade sono peggiori: leggerlo come `WIP=3` farebbe ritirare un Dottore a 3, che nessuno ha
> mai inteso; ignorare il numero sarebbe un potenziamento senza fonte. Tenere la lettura vecchia
> conserva il significato che quel numero ha sempre avuto e non fa regredire niente.
> **Non si inventa X**, ed è la decisione giusta: da `-3` non si ricava, e la wiki dice
> espressamente che in `WIP=X` la X può essere più alta o più bassa del WIP della truppa.

> 🔴 **I nomi del regolamento si contengono a vicenda: non si cercano per sottostringa.**
> Non è una cautela astratta, sono coppie che esistono nel testo, e in ciascuna le due voci
> hanno regole diverse:
>
> | Cercando | Si prende anche | Perché è un errore |
> |---|---|---|
> | `Hacker` | `ECM (Hacker −3)`, la forma dell'app ARMY | l'ECM non rende Hacker (§1.6): cambiava bersaglio lecito e Idle sul Ripetitore nemico. 35 profili sporcati, misurato da DATABASE il 6 ottobre |
> | `Jump` | `Super-Jump` (10062), `Combat Jump` (8040), `Controlled Jump` (5130) | il Jump verifica i Requisiti **alla dichiarazione** (2748), gli altri tre no |
> | `Climb` | `Climbing Plus` (7946) | il Climb è una Long Skill con Requisiti (2881), Climbing Plus è Automatic e cambia il Movimento |
> | `Repeater` | `Deployable Repeater` (4795), e il Repeater dentro il FastPanda (10759) | le righe 4794–4798 le nominano separatamente |
> | `Hacking Device` | `Killer`, `Plus`, `EVO` e le 17 forme con `UPGRADE:` | programmi diversi per tipo di Dispositivo (§1.6) |
>
> La forma giusta del confronto è sulla **voce esatta**: separare sulle virgole **fuori
> parentesi** e confrontare per uguaglianza. Un nome reso per la lettura non è un campo:
> se una decisione di regola dipende da come è scritta una stringa, la decisione è fragile.
>
> ⚠️ **E la spaziatura non è uniforme nemmeno dentro i nostri dati.** Censito da DATABASE
> l'8 ottobre: `PARA CC Weapon(-3)` su **49** profili contro `PARA CC Weapon (-3)` su **29**,
> e per il `(-6)` 23 contro 27. Al motore non importa, perché taglia sulla parentesi — ma una
> regola agganciata alla stringa esatta inciampa lì, ed è lo stesso difetto della sottostringa
> `HACKER`, visto dall'altro lato: non un nome che contiene un altro nome, ma lo **stesso** nome
> scritto in due modi.

> 🧠 **Il malus fra parentesi non è tuo.** La Chimera ha `CC 24` e `CC Attack (-3)`:
> tira sul **24 pieno**, è l'avversario ad applicare −3 al proprio CC nel Faccia a Faccia.

---

# 1. LE SCHEDE ORDINE

> **Ogni scheda è autosufficiente.** Le regole comuni (somma degli stati, Sesto Senso, tabelle
> di Schivata e Reset) sono **ripetute** dentro ogni scheda, con i valori giusti per quell'ordine,
> così per controllare un calcolo dell'app non serve saltare altrove.
>
> **Struttura fissa:** A. Identità · B. Requisiti · C. Formula · D. Attaccante voce per voce ·
> E. Reazioni del bersaglio voce per voce · F. Chi può reagire come · G. Salvezza ·
> H. Trappole · I. **Controllo dell'app** (le voci che `dati.voci` deve mostrare, e i difetti noti).

---

## 1.1 ATTACCO BS
### A. Identità
`ordine_attacco_bs.js` · azione `'ATTACCO BS'` · **Abilità Breve / ARO** · etichetta *Attack* ·
attributo **BS** (o PH/WIP se l'arma ha il Tratto BS Weapon (PH)/(WIP)) · **serve LoF** ·
Burst **pieno** in Attivo (MOD inclusi, tetto 6), **1** in ARO.

### B. Requisiti
I Requisiti dell'Attacco BS sono **due soli**, righe **3320–3323**:
1. «Be using a **BS Weapon**, or a Skill or piece of Equipment capable of making a BS Attack.»
2. «Be able to draw **Line of Fire (LoF)** from the position of your Attack to the position of
   the target, unless the BS Weapon, Skill or piece of Equipment used doesn't require LoF.»

🔴 **La gittata NON è un Requisito.** Non è in quell'elenco. Fuori dalla gittata massima
l'attacco **fallisce automaticamente**: righe **3512–3514**, «If the target is beyond the
maximum Range… then the BS Attack automatically fails (the Order is spent, Disposable weapons
lose a use, etc.)». È una cosa diversa da un requisito mancante, e serve al punto sotto.

- Bersaglio in Copertura **Totale** = non attaccabile con armi che richiedono LoF (righe
  3451–3452): è il caso "nessuna LoF", cioè il Requisito 2 che cade
- Burst diviso fra più bersagli: **tutti i colpi dallo stesso punto** (righe 3331 e 3362–3363);
  una sola munizione per tutto il Burst (riga 3332)

> 🔴 **BURST DIVISO E REQUISITO MANCANTE: si perdono solo quei dadi.** REGOLA SCRITTA, righe
> **3111–3114**:
>
> «If, during the **Resolution of the Order**, it is verified that **some of the dice of the
> Burst (B) assigned to a target do not meet the necessary Requirements, then those dice will be
> lost. The rest of the dice of the B that do meet the Requirements will be resolved
> normally.**»
>
> È l'**eccezione espressa** alla regola generale delle righe 1244–1247 (requisito mancante →
> l'intera azione si annulla e si fa un Idle). Quella vale quando il requisito cade per
> l'Abilità; questa quando cade **per una parte dei dadi**. Quindi:
>
> | Caso | Esito |
> |---|---|
> | Burst 3 diviso 2+1, il bersaglio del dado singolo è senza LoF | si perde **quel dado**; i due sull'altro bersaglio si tirano normalmente |
> | **Tutti** i dadi perdono il requisito (unico bersaglio senza LoF, o entrambi i bersagli senza LoF) | non resta nessun dado da tirare: si ricade sulla regola generale, **Idle**, Ordine speso |
> | Uso **Disposable** dichiarato | **si consuma comunque**, in tutti e due i casi: righe 1246–1247 («any declared uses of Disposable items are expended and lost») e, per la gittata, riga 3513 («Disposable weapons lose a use») |
>
> **La riga parla di "dice of the Burst assigned to a target"**, non di armi BS: vale per
> qualunque attacco col Burst diviso, quindi anche CC Attack con più bersagli e i programmi di
> Hacking a B2 divisa.
>
> **Gittata contro LoF: base giuridica diversa, esito identico.**
> - *Nessuna LoF* = Requisito 2 che cade (3322–3323) → **il dado si perde**, non si tira.
> - *Fuori gittata* = non è un requisito → **l'attacco si fa e fallisce** (3512–3514). Il dado
>   esiste e produce un fallimento.
> - Per il risultato non cambia nulla: un dado perso e un dado che fallisce producono entrambi
>   zero successi contro quel bersaglio, e consumano entrambi l'uso Disposable. ⚠️ Che la riga
>   3512 si applichi **per bersaglio** quando il Burst è diviso è una **LETTURA**: quel testo è
>   scritto al singolare, per il caso a bersaglio unico. Ma le gittate si misurano bersaglio per
>   bersaglio, quindi è l'unica lettura coerente.
>
> **L'ARO di quel bersaglio diventa un Tiro NORMALE.** Righe **2068–2070**: «For actions to be
> resolved with a Face to Face Roll, both Troopers' actions must affect each other directly.
> **If either action does not affect the outcome of the other, use Normal Rolls instead**».
> Un dado perso non arriva al bersaglio, e un dado fuori gittata non può colpirlo: in nessuno
> dei due casi l'azione dell'attivo influenza l'esito del reattivo. L'ARO resta valido — era
> stato dichiarato al passo 4 e non si riapre — ma si risolve come Tiro Normale. Una Schivata
> Normale riuscita dà comunque il movimento (righe 7271–7273).
> ⚠️ Per il caso *fuori gittata* questa è una LETTURA: il regolamento lo chiama fallimento, non
> non-azione. L'esito però è lo stesso, perché un attacco che non può avere successi non
> cancella nulla nel confronto.
- Bersaglio **in forma di Modello**: un Marker CAMO/Impersonation va prima Scoperto (o si usa l'Intuitivo). Eccezione: MSV L3 ⚠️
- Fuori gittata massima = fallimento automatico (ordine speso, Disposable perde un uso)
**L'attivo può dichiararlo?** IMM-A ❌ · IMM-B ❌ · Stordito ❌ (vietati gli Attacchi) ·
Retreat! ❌ · Engaged ❌ (in Engaged solo Berserk/CC/Schivata/Idle/Reset) ·
Isolato ✅ ma non riceve ordini dal Pool (usa il proprio Irregolare) ·
Bersagliato ✅

### C. Formula
`SV = BS + Gittata − Copertura − Mimetismo − Visibilità + Bersagliato + Fireteam L4 ± skill/equip ± stati propri` → tetto ±12 → SV<1 fallisce

### D. Attaccante voce per voce
| Voce | MOD | Si applica? |
|---|---|---|
| Gittata dell'arma | Weapon Chart (X-Visor: −3→0, −6→−3) | ✅ |
| Copertura Parziale del bersaglio | **−3** (e +3 alla sua salvezza) | ✅ (❌ con Marksmanship; ❌ se il bersaglio ha No Cover / Limited Cover — vedi §5) |
| Mimetismo del bersaglio | −3 / −6 dal profilo | ✅ (MSV L1: −3→0, −6→−3 · MSV L2/L3: 0) · Marksmanship **non** lo toglie |
| Nanoscreen del bersaglio | **−3** (e +3 alla sua salvezza) | ✅ (❌ con Marksmanship) |
| Zone di Visibilità | Bassa −3 · Pessima −6 · Zero = niente LoF | ✅ (MSV riduce/annulla) |
| Bersaglio in Stato Bersagliato | **+3** | ✅ |
| Bersaglio in Engaged con **tuoi** alleati | **−6 per ogni alleato** nel CC | ✅ si somma a gittata, copertura e mimetismo, poi tronca a −12 — righe **3389–3391**, «in addition to any MODs for Range, Cover, Mimetism… for the target». Dettaglio sotto |
| Bersaglio in Fuoco di Soppressione, entro 24" | **−3** | ✅ **solo se c'è Faccia a Faccia** |
| Fireteam Livello 4 | **+1** | ✅ |
| Fireteam Livello 2 | `+1 SD` | ✅ (non su Sagoma Diretta) |
| `BS Attack (+N)` del profilo | +N | ✅ |
| `BS Attack (+1B)` / arma `(+1B)` | +1 Burst | ✅ solo in Attivo |
| Stordito (attivo) | −3 | — lo Stordito non può attaccare |
| Martial Arts, `CC Attack (±N)` | — | ❌ sono del CC |

> 🔴 **SPARARE DENTRO UN CORPO A CORPO — righe 3389–3396.**
>
> «If a BS Attack is declared against an enemy Trooper that is engaged in CC Combat a **−6 MOD
> must be applied for each Allied Trooper engaged in the CC** (in addition to any MODs for
> Range, Cover, Mimetism… for the target). Every failed BS Attack Roll **will hit the Allied
> Trooper**, forcing them to perform a Saving Roll. If there are several Allied Troopers locked
> in that Close Combat, then the **Trooper's player chooses** which one of them receives each
> hit.»
>
> - **"Allied" = alleato di chi SPARA.** Lo dimostra la frase dopo: ogni tiro fallito *colpisce
>   l'alleato*, e il giocatore *di chi spara* sceglie chi lo prende. È fuoco amico, quindi sono
>   i propri.
> - **Si conta per alleato, non per nemico.** Due tuoi alleati in quel CC = **−12**. Nessun tuo
>   alleato in quel CC — il bersaglio è Ingaggiato con un neutrale, o per una regola di
>   scenario — = **nessun MOD**. Il default 1 va bene nel caso normale, ma lo zero esiste.
> - **Quanti possono essere.** Righe **4422–4425**: al massimo **4** Modelli in contatto di
>   Silhouette con un Modello su base da 25 mm, **6** su base da 40 mm o più. Quindi il conteggio
>   degli alleati va da **0 a 4** (o a 6 contro un TAG), non da 0 a 3. In pratica però **da 2 in
>   su il risultato è sempre −12**, perché −6×2 tocca già il tetto: gli esiti distinti sono tre,
>   0 · 1 · 2-o-più.
> - **Si somma a tutto il resto** (gittata, copertura, mimetismo, zone) e poi vale il tetto di
>   −12, come ogni altra somma di MOD.
> - **La Copertura Parziale del bersaglio ingaggiato resta**, sia il −3 al tiro (la riga 3391 la
>   nomina esplicitamente) sia il **+3 alla sua salvezza** (righe 3453–3455: niente nelle righe
>   3389–3396 la toglie).
> - **Il prezzo del fallimento:** ogni tiro fallito diventa un colpo sull'alleato, che fa un
>   Tiro Salvezza. Con Burst 3 e due fallimenti, l'alleato salva due volte.
> - ⚠️ **Con un'arma a Sagoma il colpo non si penalizza: si annulla.** Righe **3622–3626**, le
>   Sagome su un gruppo in Corpo a Corpo «will always affect **every** Trooper involved»; e
>   righe **3586–3594**, se un Alleato è nell'area quel colpo **è annullato** (l'uso Disposable
>   si consuma comunque, e i reattivi nell'area possono ancora dichiarare ARO). Quindi il −6
>   vale per le armi a tiro singolo, non per Sagome e Lanciafiamme. Per il che-cosa-si-annulla
>   esattamente, vedi il riquadro qui sotto.

> 🔴 **L'UNITÀ DELL'ANNULLAMENTO È IL COLPO, NON IL BERSAGLIO.** Testo intero, righe
> **3584–3594**:
>
> «Declaring Attacks against Allied or Neutral Troopers is not allowed, nor is it allowed to
> perform Attacks that may affect them, unless the Template lacks a PS Attribute value and does
> not inflict States. Therefore, if when declaring an Attack with a Template Weapon, an Allied or
> Neutral Trooper would be affected by the Template, **that shot is cancelled** (but not other
> **shots of that same Burst** that have no Allies or Neutrals within their Area of Effect). Any
> reactive Troopers within the Area of Effect of the cancelled shot **can still declare AROs**.
> In this case of a cancelled shot, if a Weapon with the Disposable Trait was used, the initially
> declared use **is still consumed**.»
>
> **Un colpo = una Sagoma = un tiro.** Righe **3746–3757**: la Sagoma Circolare fa **un** tiro,
> confrontato separatamente contro ciascuno degli affetti; il Bersaglio Principale serve solo a
> determinare i MOD, gli altri sono «Secondary Targets». E righe **3772–3775**: «To Dodge an
> Attack with **several Impact Templates in the same Order**…» — più Sagome esistono solo con
> Burst maggiore di 1.
>
> | Burst | Quante Sagome | Che cosa annulla un alleato nell'area |
> |---|---|---|
> | **1** — Speculativo (3909–3910), Guidato (3340–3341), Intuitivo (4027–4028): B **sempre** 1 | **una** | **tutto**: nessun tiro, nessun Tiro Salvezza per nessuno, né Principale né secondari. La parentesi «but not other shots of that same Burst» è vuota per costruzione: di colpi ce n'è uno |
> | **2 o più** — p.es. Missile Launcher Blast Mode B2 (riga 16022) dichiarato come Attacco BS | **una per colpo** | **solo quel colpo**. Gli altri colpi dello stesso Burst che non hanno alleati nella *loro* area si risolvono |
>
> ⚠️ **Dove "per bersaglio" e "per colpo" non coincidono.** Con Burst diviso 1+1 su due bersagli
> le due letture danno lo stesso esito quasi sempre, ma divergono in un caso reale: **un alleato
> può stare sotto la Sagoma di un colpo diretto a un altro bersaglio.** Se il tuo alleato è nella
> mischia del bersaglio B e la Sagoma del colpo su A arriva a toccare quella mischia, allora **va
> annullato anche il colpo su A** — perché un alleato è nell'area *di quel colpo*. Un controllo
> fatto per bersaglio annullerebbe solo il colpo su B. È lo stesso principio che il regolamento
> scrive a chiare lettere per i Marker Impersonation (righe 14285–14289: il colpo è annullato
> «even if another Enemy Trooper was designated as the Main Target»).
>
> **Due cose che il Fumo cambia** (righe 3586 e 3601–3602): una Sagoma **senza PS e che non
> infligge Stati** può colpire gli alleati. Quindi il Fumo non si annulla mai per un alleato
> nell'area. Tutto il resto — Granate, Missili, Lanciafiamme — ha un PS e si annulla.
>
> **In Coordinato o in Fireteam** la Sagoma «affects every Trooper that was in Silhouette contact
> with its Area of Effect **at any time during that Order**» (righe 3603–3606), perché tutto è
> simultaneo: basta che un alleato ci sia passato.

### E. Reazioni del bersaglio voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

**SCHIVATA (tiro PH)** — evita **tutti** gli attacchi dell'ordine, qualunque sia il Burst

| Voce | MOD al PH | Si somma? |
|---|---|---|
| Senza LoF verso l'attaccante · Sagoma senza LoF · Sagoma di un'arma **Deployable** · in ARO, attivo dentro la ZdC e fuori LoF | **−3** | ✅ ma **uno solo**: anche se più circostanze valgono insieme, il MOD resta −3 (righe 7294–7299) |
| Immobilizzato-A | **−6** | ✅ (e l'IMM-A può fare **solo** questo) |
| Stordito | **−3** (ogni tiro tranne le salvezze) | ✅ |
| Surprise Attack dell'attaccante (partiva da Marker/Hidden) | −3 / −6 dal profilo | ✅ **solo nel Faccia a Faccia** (N5.2, adottata); se `(CC-6)` solo sul CC, non sulla Schivata |
| Alleato allertato da **Look Out!** | Schivata a **PH−3** | ✅ |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del proprio profilo | +N | ✅ |
| `Dodge (-N)` del proprio profilo | −N **all'attaccante** nel F2F | ✅ (lato attaccante) |
| `Dodge (+1")` | movimento extra | ❌ non tocca il tiro |
| `Dodge (ARM +3)` | +3 ARM alla salvezza **se fallisci** | ❌ non tocca il tiro |
| Immobilizzato-B | — | ❌ **non può Schivare** |
| Bersagliato | — | ❌ il suo −3 vale sul Reset, non qui |
| Isolato | — | ❌ il suo −9 vale sul Reset, non qui |
| Copertura, gittata, Mimetismo | — | ❌ non esistono sul tiro di Schivata |

Riuscita: movimento fino a **2"** nella fase Effetti (non genera ARO, non attiva Deployable,
può entrare in Engaged). Una Schivata riuscita **cancella anche l'IMM-A**.

**ATTACCO IN ARO contro l'attaccante** (BS, CC se in contatto, Comms) → Faccia a Faccia.
Il reattivo tira con **i propri** MOD, calcolati come in un suo attacco:

| Voce (sul tiro del reattivo) | MOD | Si applica? |
|---|---|---|
| Gittata della propria arma verso l'attivo | Weapon Chart | ✅ |
| Copertura Parziale **dell'attivo** | −3 | ✅ |
| Mimetismo **dell'attivo** | −3 / −6 | ✅ |
| Zone di Visibilità | −3 / −6 | ✅ |
| Attivo in Stato Bersagliato | +3 | ✅ |
| Surprise Attack dell'attivo | −3 / −6 | ✅ |
| Stordito (reattivo) | −3 | ✅ ma lo Stordito **non può dichiarare Attacchi** |
| Fireteam L4 (+1 BS) / L2 (+1 SD) | +1 / +1 dado | ✅ se in Fireteam |
| Burst | **1** | salvo Total Reaction, Neurocinetics, Fuoco di Soppressione (B3), Enhanced Reaction (B2) |
| `(+1B)` del profilo | — | ❌ i MOD al Burst valgono solo in Turno Attivo |

Non possono attaccare in ARO: IMM-A, IMM-B, Stordito, Retreat!, qualsiasi stato Null. Engaged:
solo CC. Isolato: può sparare, ma **non** hackerare.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro Attacchi Comms e Attacchi Guidati: **contro un Attacco BS normale non serve**. Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Chi può reagire come
| Stato del reattivo | Schivata | ARO d'attacco | Reset utile? |
|---|---|---|---|
| Normale | ✅ | ✅ | ❌ Tiro Normale, non evita |
| Bersagliato | ✅ | ✅ | ❌ (però cancella il Bersagliato se riesce) |
| IMM-A | ✅ −6 | ❌ | ❌ |
| IMM-B | ❌ | ❌ | ❌ (solo Reset −3, che non evita lo sparo) |
| Isolato | ✅ | ✅ (non Comms) | ❌ |
| Stordito | ✅ −3 | ❌ | ❌ |
| Engaged | ✅ | solo CC | ❌ |
| Retreat! | ✅ | ❌ | ❌ |
| Null (Incosciente…) | ❌ | ❌ | ❌ → Tiro Normale dell'attivo |

Nessuna reazione che influenzi l'esito → **Tiro Normale** dell'attivo.

### G. Salvezza
Dal Weapon Chart dell'arma (attributo e numero di tiri hanno la **precedenza** sulla munizione
generica). **Copertura Parziale +3**, **Nanoscreen +3**, `(SR-N)` dell'attaccante −N, Critico = +1
salvezza. ARM dimezzato con AP, BTS dimezzato con E/M. Tabella munizioni in §4.

### H. Trappole
- Sagoma Diretta: **nessun tiro d'attacco**, il bersaglio schiva (PH Normale) oppure fa la salvezza; niente `+1 SD`.
- Marksmanship toglie Copertura e Nanoscreen, **non** il Mimetismo.
- Il −3 del Fuoco di Soppressione pesa sull'attivo solo nel F2F contro la truppa in Soppressione.

### I. Controllo dell'app
Voci attese in `dati.voci`: `gittata`, `copertura`, `mimetismo`, `visibilita`, `bersagliato`,
`fireteam`, `soppressione` (solo F2F), `mischia` (−6×n). Reazione: `modSchivata` / `modReset`.
🔴 Schivata e Reset portano un SV<1 a **1** invece di farlo fallire (§10).
🔴 `M.modReset` non tronca a −12 (§10).

---

## 1.2 ATTACCO CC · BERSERK · PROTHEION
### A. Identità
`ordine_attacco_cc.js` · azioni `'CC_ATTACK'`, `'BERSERK'`, `'PROTHEION'` · attributo **CC** ·
CC Attack = **Abilità Breve / ARO**; Berserk e Protheion = **Long Skill** (solo Attivo) ·
nessuna gittata · Burst dell'arma CC (+1 per alleato in contatto, vedi sotto), **1** in ARO.

### B. Requisiti
- **Contatto di Silhouette** col bersaglio (si può entrare in contatto col Move della stessa ordine)
- Bersaglio in forma di Modello: **non** si entra in contatto con un Marker CAMO o Impersonation
- Max in contatto: **4** su base 25 mm, **6** su base 40 mm o più
**L'attivo può dichiararlo?** IMM-A ❌ · IMM-B ❌ · Stordito ❌ (vietati gli Attacchi) ·
Retreat! ❌ · Engaged ✅ solo se è CC ·
Isolato ✅ ma non riceve ordini dal Pool (usa il proprio Irregolare) ·
Bersagliato ✅

### C. Formula
`SV = CC + Attack MOD proprio (Martial Arts, CC Attack (+N), Berserk (+N)) + Opponent MOD del nemico (Martial Arts, CC Attack (−N), PARA CCW (−X)) ± stati` → ±12

### D. Attaccante voce per voce
| Voce | MOD | Si applica? |
|---|---|---|
| Martial Arts propria (Attack MOD) | L1 0 · L2–L5 **+3** | ✅ |
| Martial Arts **del nemico** (Opponent MOD) | **−3** (tutti i livelli) | ✅ **solo nel F2F** |
| `CC Attack (+N)` proprio | +N | ✅ |
| `CC Attack (−N)` / `PARA CCW (−X)` **del nemico** | −N / −X al tuo CC, **letto dal suo profilo** (esistono −3, −6, −9) | ✅ **solo nel F2F** |
| `Berserk (+N)` | +N | ✅ solo col Berserk |
| Surprise Attack proprio (arrivavi da Marker) | −3/−6 **al nemico** | ✅ (`(CC-6)`: solo sul suo CC) |
| Alleati in contatto col bersaglio (non Null/IMM) | **+1 Burst ciascuno** | ✅ in Attivo. 🔴 **N5.3: basta avere 2 o più truppe in contatto** (prima "più di 2") |
| Martial Arts L3/L5 `+1 SD`, L4/L5 `+1 B` | dado/Burst | ✅ (+1 B solo in Attivo) |
| Fireteam L2 `+1 SD`, L4 `+1 BS` | — | ❌ sono bonus del **BS** Attack |
| Gittata | — | ❌ non esiste nel CC |
| Copertura Parziale | — | ❌ |
| Mimetismo | — | ❌ (vale solo su BS con LoF e Discover) |
| Nanoscreen | — | ❌ |
| Zone di Visibilità | — | ❌ ⚠️ (nessun MOD di visibilità previsto per il CC) |
| Bersagliato | — | ❌ il +3 vale per BS Attack, Comms e Discover |

**Martial Arts, tabella completa:** L1 att 0/opp −3 · L2 +3/−3 · L3 +3/−3/+1 SD · L4 +3/−3/+1 B · L5 +3/−3/+1 B e +1 SD.

### E. Reazioni del bersaglio voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

**SCHIVATA (tiro PH)** — evita **tutti** gli attacchi dell'ordine, qualunque sia il Burst

| Voce | MOD al PH | Si somma? |
|---|---|---|
| Senza LoF verso l'attaccante (attacco alle spalle) | **−3** | ✅ |
| Immobilizzato-A | **−6** | ✅ (e l'IMM-A può fare **solo** questo) |
| Stordito | **−3** (ogni tiro tranne le salvezze) | ✅ |
| Surprise Attack dell'attaccante (partiva da Marker/Hidden) | −3 / −6 dal profilo | ✅ **solo nel Faccia a Faccia** (N5.2, adottata); se `(CC-6)` solo sul CC, non sulla Schivata |
| Alleato allertato da **Look Out!** | Schivata a **PH−3** | ✅ |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del proprio profilo | +N | ✅ |
| `Dodge (-N)` del proprio profilo | −N **all'attaccante** nel F2F | ✅ (lato attaccante) |
| `Dodge (+1")` | movimento extra | ❌ non tocca il tiro |
| `Dodge (ARM +3)` | +3 ARM alla salvezza **se fallisci** | ❌ non tocca il tiro |
| Immobilizzato-B | — | ❌ **non può Schivare** |
| Bersagliato | — | ❌ il suo −3 vale sul Reset, non qui |
| Isolato | — | ❌ il suo −9 vale sul Reset, non qui |
| Copertura, gittata, Mimetismo | — | ❌ non esistono sul tiro di Schivata |

Riuscita: movimento fino a **2"** nella fase Effetti (non genera ARO, non attiva Deployable,
può entrare in Engaged). Una Schivata riuscita **cancella anche l'IMM-A**.

**CC ATTACK IN ARO** → Faccia a Faccia CC contro CC. Il reattivo applica: la propria Martial Arts
(Attack MOD), l'Opponent MOD dell'attivo, i propri `CC Attack (+N)`, Stordito ❌ (non attacca),
+1 B per ogni suo alleato in contatto che **non** abbia dichiarato Schivata/Idle/Reset (in ARO si
sceglie **una sola** truppa che attacca). Burst 1 salvo quei bonus. Surprise Attack dell'attivo
si somma al suo tiro.

**BERSERK dell'attivo:** chi lo usa **rinuncia al F2F**: entrambi fanno un Tiro Normale.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro Attacchi Comms e Guidati: **contro il CC non serve**. Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Chi può reagire come
| Stato del reattivo | Schivata | CC Attack in ARO |
|---|---|---|
| Normale / Engaged | ✅ | ✅ |
| IMM-A | ✅ −6 | ❌ |
| IMM-B | ❌ | ❌ |
| Stordito | ✅ −3 | ❌ |
| Incosciente | ❌ | ❌ → **Colpo di Grazia** |


### G. Salvezza
Arma CC del profilo (`CC Weapon (PS=X)` fissa il PS). **Nessun** bonus di Copertura. Contro un
**Incosciente**: Colpo di Grazia = **Morto automatico, nessuna salvezza** (salvo Dogged/NWI attivi).
PARA: salvezza speciale **PH−6**, effetto IMM-A.

### H. Trappole
- I MOD "fra parentesi negativi" (`CC Attack (−3)`, `PARA CCW (−3/−6/−9)`) **non** li prende chi li ha: li prende l'avversario, e solo nel F2F.
- Sagome su un gruppo in Engaged colpiscono **sempre tutti** i partecipanti.

### I. Controllo dell'app
Voci attese: `martialArts` (att), `martialArtsNemico` (opp), `ccAttack`, `burstAlleati`.
🔴 Conteggio alleati: verificare che con **2** truppe in contatto scatti già il +1 B (N5.3).
✅ PARA CCW: il valore fra parentesi è **per profilo** (negli elenchi ufficiali convivono −3 ×54, −6 ×23, −9 ×1). Il motore deve leggerlo dal profilo, mai assumerlo.

---

## 1.3 ATTACCO INTUITIVO
### A. Identità
`ordine_attacco_intuitivo.js` · azione `'ATTACCO INTUITIVO'` · **LONG SKILL** (solo Attivo) ·
etichetta *BS Attack* · attributo **WIP non modificato** · Burst **sempre 1**.

### B. Requisiti
- Arma con il **Tratto Intuitive Attack** (non basta che sia una Sagoma)
- Bersaglio (o Bersaglio Principale della Sagoma) **fuori LoF per Zona di Visibilità Zero**, oppure
  in uno stato che richiederebbe di Scoprirlo prima (Camuffato, ecc.)
- Più nemici coinvolti: se ne sceglie **uno solo** come Principale
**L'attivo può dichiararlo?** IMM-A ❌ · IMM-B ❌ · Stordito ❌ (vietati gli Attacchi) ·
Retreat! ❌ · Engaged ❌ (in Engaged solo Berserk/CC/Schivata/Idle/Reset) ·
Isolato ✅ ma non riceve ordini dal Pool (usa il proprio Irregolare) ·
Bersagliato ✅

### C. Formula
`SV = WIP` — **nient'altro**.

### D. Attaccante voce per voce
| Voce | Si applica? |
|---|---|
| Gittata | ❌ |
| Copertura Parziale | ❌ |
| Mimetismo | ❌ |
| Zone di Visibilità | ❌ |
| Bersagliato | ❌ |
| Fireteam (+1 BS, +1 SD) | ❌ (e il +1 SD non va mai sulle Long Skill) |
| Surprise Attack | ❌ sul tuo tiro (nessun MOD "da qualsiasi fonte") |
| Stordito | — non puoi attaccare |
| MOD di **danno** (`BS Attack (SR-1)`, `(AP)`, `(Shock)`) | ✅ **sì**: toccano la salvezza, non il tiro (FAQ N5) |

> Testo ufficiale, righe **4029–4031**: *"the user must pass an unmodified WIP Roll. MODs from
> Partial Cover, Special Skills, pieces of Equipment **or any other source** do not apply to
> this Roll."* «Any other source» chiude la lista: nessun MOD, mai, da niente.

> 🔴 **INTUITIVO SU UNA MISCHIA.** Due cose opposte, e vanno insieme.
>
> **Il −6 per alleato NON si applica.** La regola dello sparare nel corpo a corpo (righe
> 3389–3391) impone «a −6 MOD… for each Allied Trooper engaged in the CC», ma è un MOD, e
> l'Intuitivo non ne accetta nessuno (righe 4029–4031). Il tiro resta **WIP nudo**.
>
> **Il colpo però si ANNULLA**, se l'arma ha una Sagoma. Righe **3584–3590**: «Declaring Attacks
> against Allied or Neutral Troopers is not allowed, nor is it allowed to perform Attacks that
> may affect them, unless the Template lacks a PS Attribute value and does not inflict States.
> Therefore, if when declaring an Attack with a Template Weapon, an Allied or Neutral Trooper
> would be affected by the Template, **that shot is cancelled**». E righe **3622–3626**: una
> Sagoma su un gruppo in Corpo a Corpo «will always affect **every** Trooper involved». Quindi
> con un tuo alleato nella mischia l'alleato è sempre colpito, e il colpo cade.
> L'uso **Disposable si consuma comunque** e i reattivi nell'area **possono ancora dichiarare
> ARO** (righe 3593–3594). Con **zero** tuoi alleati nella mischia il colpo vale normalmente.
> Eccezione della riga 3586: una Sagoma **senza PS e che non infligge Stati** (il Fumo) può
> colpire gli alleati — ma il Fumo è Targetless e non c'entra con l'Intuitivo.
>
> **Attenzione a quando il caso è davvero raggiungibile.** Un bersaglio in **Engaged** non può
> essere un Marker: non si entra in contatto di Silhouette con un Marker CAMO (riga 13608) né
> IMP (riga 14206), e un Marker che entra in contatto perde lo stato (righe 13636 e 14240).
> Quindi dei due rami del requisito (righe 4017–4022) resta **solo** quello della **Zona di
> Visibilità Zero**: il bersaglio è in mischia *e* fuori dalla tua LoF per il Fumo o l'Eclipse.
> Il caso esiste, ma solo così.

### F. Con che armi si può dichiarare, davvero
Il requisito è il **Tratto Intuitive Attack** (riga 4016). Spogliando tutte le chart del
regolamento, **ogni** arma che lo porta è una **Sagoma Diretta** — Lanciafiamme (15329, 15335),
Mine di ogni tipo (15595, 15625–15663), Chest Mine (15605), Drop Bear (6177), WildParrot (15665),
Cybermine, Sepsitor (16443–16451), E/Mitter (16297, 16465) — **con una sola eccezione**:

| L'unica senza Sagoma | Righe **16401–16405** |
|---|---|
| **Jammer** | `BS Weapon (WIP)`, **Comms Attack**, Intuitive Attack, Disposable (2), State: Isolated, Non-Lethal, No LoF, Zone of Control · PS 7 · salvezza su **BTS** |

> ⚠️ **Non sono tutte Disposable, e la differenza conta** quando il colpo si annulla (sopra: «l'uso
> Disposable si consuma comunque», righe 3593–3594). Fra le armi Intuitive, **i Lanciafiamme NON
> hanno il Tratto Disposable** — chart righe **15321–15339**, dove i due profili sono solo
> *Intuitive Attack, Continuous Damage, Direct Template*:
>
> | Arma | PS | Sagoma | Disposable |
> |---|---|---|---|
> | Lanciafiamme **Pesante** (riga 15331) | 6 | Large Teardrop | **no** |
> | Lanciafiamme **Leggero** (riga 15337) | 7 | Small Teardrop | **no** |
> | **Drop Bear** (righe 6165–6167) | 7 | Small Teardrop | **sì, (3)** condivisa fra le due modalità |
> | Mine, WildParrot, Chest Mine, Cybermine, Sepsitor | — | Teardrop | **sì** |
>
> Il contrasto è leggibile nella chart stessa: le voci appena sopra i Lanciafiamme (righe
> 15303–15319) dichiarano `DISPOSABLE (2)` per esteso. Dove non c'è, non c'è.
> *(Correzione del 6 ottobre, misurata da MOTORE sul database e verificata in chart.)*

Conseguenza pratica: **il ramo "Intuitivo senza Sagoma" esiste solo per il Jammer**, e lì non
serve niente della regola della mischia, perché il Jammer è un **Attacco Comms** — la riga 3389
parla di «a **BS Attack**… against an enemy Trooper that is engaged in CC Combat», e la difesa
del Jammer è il **Reset**, non la Schivata. Quindi né il −6 né il fuoco amico della riga 3393.

### E. Reazioni del bersaglio voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

Il Marker può **non dichiarare nulla** (resta nascosto finché non viene colpito) oppure reagire:
se dichiara Attacco o Schivata, la reazione è simultanea e si fa un **Faccia a Faccia** contro il
tuo WIP.

**SCHIVATA (tiro PH)** — evita **tutti** gli attacchi dell'ordine, qualunque sia il Burst

| Voce | MOD al PH | Si somma? |
|---|---|---|
| Sagoma senza LoF verso l'attaccante (tipico: sei nel fumo/Visibilità Zero) | **−3** | ✅ |
| Immobilizzato-A | **−6** | ✅ (e l'IMM-A può fare **solo** questo) |
| Stordito | **−3** (ogni tiro tranne le salvezze) | ✅ |
| Surprise Attack dell'attaccante (partiva da Marker/Hidden) | −3 / −6 dal profilo | ✅ **solo nel Faccia a Faccia** (N5.2, adottata); se `(CC-6)` solo sul CC, non sulla Schivata |
| Alleato allertato da **Look Out!** | Schivata a **PH−3** | ✅ |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del proprio profilo | +N | ✅ |
| `Dodge (-N)` del proprio profilo | −N **all'attaccante** nel F2F | ✅ (lato attaccante) |
| `Dodge (+1")` | movimento extra | ❌ non tocca il tiro |
| `Dodge (ARM +3)` | +3 ARM alla salvezza **se fallisci** | ❌ non tocca il tiro |
| Immobilizzato-B | — | ❌ **non può Schivare** |
| Bersagliato | — | ❌ il suo −3 vale sul Reset, non qui |
| Isolato | — | ❌ il suo −9 vale sul Reset, non qui |
| Copertura, gittata, Mimetismo | — | ❌ non esistono sul tiro di Schivata |

Riuscita: movimento fino a **2"** nella fase Effetti (non genera ARO, non attiva Deployable,
può entrare in Engaged). Una Schivata riuscita **cancella anche l'IMM-A**.

**ATTACCO IN ARO contro l'attaccante** (BS, CC se in contatto, Comms) → Faccia a Faccia.
Il reattivo tira con **i propri** MOD, calcolati come in un suo attacco:

| Voce (sul tiro del reattivo) | MOD | Si applica? |
|---|---|---|
| Gittata della propria arma verso l'attivo | Weapon Chart | ✅ |
| Copertura Parziale **dell'attivo** | −3 | ✅ |
| Mimetismo **dell'attivo** | −3 / −6 | ✅ |
| Zone di Visibilità | −3 / −6 | ✅ |
| Attivo in Stato Bersagliato | +3 | ✅ |
| Surprise Attack dell'attivo | −3 / −6 | ✅ |
| Stordito (reattivo) | −3 | ✅ ma lo Stordito **non può dichiarare Attacchi** |
| Fireteam L4 (+1 BS) / L2 (+1 SD) | +1 / +1 dado | ✅ se in Fireteam |
| Burst | **1** | salvo Total Reaction, Neurocinetics, Fuoco di Soppressione (B3), Enhanced Reaction (B2) |
| `(+1B)` del profilo | — | ❌ i MOD al Burst valgono solo in Turno Attivo |

Non possono attaccare in ARO: IMM-A, IMM-B, Stordito, Retreat!, qualsiasi stato Null. Engaged:
solo CC. Isolato: può sparare, ma **non** hackerare.
Nota: se il reattivo spara all'attivo **attraverso una Visibilità Zero** senza MSV, non ha LoF e
non può farlo.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro Attacchi Comms e Guidati: **contro l'Intuitivo non serve**. Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Chi può reagire come
Come nell'Attacco BS: Normale/Bersagliato/Isolato → Schivata o Attacco; IMM-A → solo Schivata −6;
IMM-B → niente di utile; Stordito → solo Schivata −3; Null → Tiro Normale dell'attivo.

### G. Salvezza
Quella dell'arma. **Critico sul WIP**: vale come Critico **solo sul Bersaglio Principale**; sugli
altri sotto la sagoma è un successo normale.

### H. Trappole
- Fallito → **niente secondo tentativo sullo stesso bersaglio** fino al prossimo Turno Attivo.
- Serve un Intuitivo per **piazzare un Deployable** se c'è un Marker CAMO nemico nella sua Trigger
  Area (niente Modelli validi dentro); fallendo, non si piazza e il Disposable perde un uso.

### I. Controllo dell'app
Voci attese: **nessuna** oltre al WIP base.
🔴 `M.armiDisponibili` sceglie le armi con `isTemplate`, non col Tratto *Intuitive Attack* che è già nei dati (§10).

---

## 1.4 FUOCO SPECULATIVO
### A. Identità
`ordine_fuoco_speculativo.js` · azione `'FUOCO SPECULATIVO'` · **LONG SKILL** (solo Attivo) ·
etichetta *BS Attack* · attributo **BS** (PH per le granate: BS Weapon (PH)) · **nessuna LoF** ·
Burst **sempre 1**.

### B. Requisiti
- Arma con il **Tratto Speculative Attack**
- Una traiettoria tracciabile fino al punto d'impatto
- Sagoma Circolare: centro anche lontano dal bersaglio, purché il **Principale resti dentro**; sagoma
  sul tavolo o orizzontale su un terreno, **mai** verticale o a mezz'aria
- 🔴 **Il Bersaglio Principale non può essere un Marker** — né CAMO né IMP-1 né IMP-2.
  Lo Speculativo ha etichetta *BS Attack*, quindi è un Attacco, e gli Attacchi contro i
  Marker sono vietati: righe **13609–13610** (CAMO, «unless otherwise specified by a rule
  or Skill») e **14207–14208** (IMP, senza clausola di eccezione). Lo Speculativo **non**
  è una di quelle eccezioni: le sole due scritte sono l'**Attacco Intuitivo** (righe
  4017–4022: il bersaglio deve essere «in a State that would normally prevent Attacks…
  such as the Camouflaged State») e il **MSV L3** (righe 11011–11015: *BS Attack* su un
  Marker CAMO **in LoF**, applicando il Mimetismo — e lo Speculativo è una Skill diversa
  dal BS Attack, righe 11399–11401). Contro un Marker si usa l'Intuitivo (§1.3).
- ✅ **Resta ammesso**: piazzare il **punto d'impatto** dove si vuole (righe 3916–3919) con
  un Principale lecito altrove; oppure un'arma **Targetless** (Fumo), che non richiede alcun
  Principale (righe 3763–3766). Se il Marker CAMO è costretto a un Tiro Salvezza, il CAMO
  cade (riga 13638); l'Impersonation **no**, non ha quella clausola (righe 14236–14242).
- 🔴 **Il Marker come bersaglio secondario sotto la sagoma: dipende da quale Marker.**
  ⚠️ *Correzione del 7 ottobre: il 6 ottobre avevo scritto che era ammesso in generale. È
  vero solo per il CAMO.*
  - **Marker CAMO**: ammesso. È un nemico, e la cancellazione della sagoma delle righe
    3586–3594 riguarda solo Alleati e Neutrali.
  - **Marker IMPERSONATION: il colpo è annullato.** Righe **14283–14289**: «Impersonation
    Markers are considered **Allied** Troopers, so Attacks cannot be declared against them.
    **Any shot with a Template Weapon that affects an Impersonation Marker is canceled, even
    if another Enemy Trooper was designated as the Main Target**». Il Marker IMP non è un
    bersaglio secondario: è un alleato finto, e la sua presenza nell'area annulla il colpo.
  - Regola generale della cancellazione, righe **3586–3594**: se un Alleato o un Neutrale
    sarebbe colpito, **quel colpo** è annullato — non gli altri colpi dello stesso Burst che
    non hanno alleati nella loro area; i reattivi nell'area del colpo annullato **possono
    comunque dichiarare ARO**; e un uso **Disposable già dichiarato si consuma** comunque.
**L'attivo può dichiararlo?** IMM-A ❌ · IMM-B ❌ · Stordito ❌ (vietati gli Attacchi) ·
Retreat! ❌ · Engaged ❌ (in Engaged solo Berserk/CC/Schivata/Idle/Reset) ·
Isolato ✅ ma non riceve ordini dal Pool (usa il proprio Irregolare) ·
Bersagliato ✅

### C. Formula
`SV = BS − 6 + Gittata (misurata al punto d'impatto) + 3 se il Principale è Bersagliato` → ±12

### D. Attaccante voce per voce
| Voce | MOD | Si applica? |
|---|---|---|
| Fuoco Speculativo | **−6** | ✅ **sempre** |
| Gittata al punto d'impatto | Weapon Chart | ✅ |
| Bersaglio in Stato Bersagliato | **+3** | ✅ (il Bersagliato premia chi dichiara BS Attack; lo Speculativo ha quell'etichetta) 🔴 |
| `BS Attack (+N)` del profilo | +N | ✅ ⚠️ (MOD positivo di una skill con etichetta BS Attack) |
| Fireteam L4 +1 | +1 | ✅ ⚠️ (bonus "when declaring BS Attack") |
| Fireteam L2 `+1 SD` | — | ❌ Long Skill |
| Mimetismo | — | ❌ |
| Copertura Parziale | — | ❌ |
| Zone di Visibilità | — | ❌ (esplicito: solo il −6) |
| Nanoscreen | — | ❌ (è un MOD negativo) |
| Surprise Attack proprio | −3/−6 al nemico | ✅ se venivi da Marker |

### E. Reazioni del bersaglio voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

Ordine delle operazioni: designa il Principale → piazza la sagoma → **poi** si vede chi altro è
coinvolto e tutti dichiarano gli ARO → si misura → si tira.

**SCHIVATA (tiro PH)** — evita **tutti** gli attacchi dell'ordine, qualunque sia il Burst

| Voce | MOD al PH | Si somma? |
|---|---|---|
| Sagoma senza LoF verso l'attaccante (quasi sempre, lo Speculativo non la usa) | **−3** | ✅ |
| Immobilizzato-A | **−6** | ✅ (e l'IMM-A può fare **solo** questo) |
| Stordito | **−3** (ogni tiro tranne le salvezze) | ✅ |
| Surprise Attack dell'attaccante (partiva da Marker/Hidden) | −3 / −6 dal profilo | ✅ **solo nel Faccia a Faccia** (N5.2, adottata); se `(CC-6)` solo sul CC, non sulla Schivata |
| Alleato allertato da **Look Out!** | Schivata a **PH−3** | ✅ |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del proprio profilo | +N | ✅ |
| `Dodge (-N)` del proprio profilo | −N **all'attaccante** nel F2F | ✅ (lato attaccante) |
| `Dodge (+1")` | movimento extra | ❌ non tocca il tiro |
| `Dodge (ARM +3)` | +3 ARM alla salvezza **se fallisci** | ❌ non tocca il tiro |
| Immobilizzato-B | — | ❌ **non può Schivare** |
| Bersagliato | — | ❌ il suo −3 vale sul Reset, non qui |
| Isolato | — | ❌ il suo −9 vale sul Reset, non qui |
| Copertura, gittata, Mimetismo | — | ❌ non esistono sul tiro di Schivata |

Riuscita: movimento fino a **2"** nella fase Effetti (non genera ARO, non attiva Deployable,
può entrare in Engaged). Una Schivata riuscita **cancella anche l'IMM-A**.

**ATTACCO IN ARO contro l'attaccante** (BS, CC se in contatto, Comms) → Faccia a Faccia.
Il reattivo tira con **i propri** MOD, calcolati come in un suo attacco:

| Voce (sul tiro del reattivo) | MOD | Si applica? |
|---|---|---|
| Gittata della propria arma verso l'attivo | Weapon Chart | ✅ |
| Copertura Parziale **dell'attivo** | −3 | ✅ |
| Mimetismo **dell'attivo** | −3 / −6 | ✅ |
| Zone di Visibilità | −3 / −6 | ✅ |
| Attivo in Stato Bersagliato | +3 | ✅ |
| Surprise Attack dell'attivo | −3 / −6 | ✅ |
| Stordito (reattivo) | −3 | ✅ ma lo Stordito **non può dichiarare Attacchi** |
| Fireteam L4 (+1 BS) / L2 (+1 SD) | +1 / +1 dado | ✅ se in Fireteam |
| Burst | **1** | salvo Total Reaction, Neurocinetics, Fuoco di Soppressione (B3), Enhanced Reaction (B2) |
| `(+1B)` del profilo | — | ❌ i MOD al Burst valgono solo in Turno Attivo |

Non possono attaccare in ARO: IMM-A, IMM-B, Stordito, Retreat!, qualsiasi stato Null. Engaged:
solo CC. Isolato: può sparare, ma **non** hackerare.
Senza LoF verso l'attivo (lo Speculativo spesso arriva da dietro un muro) si può solo Schivare,
salvo Sesto Senso.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro Attacchi Comms e Guidati: **contro lo Speculativo non serve**. Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Chi può reagire come
Normale/Bersagliato/Isolato → Schivata (di solito −3) o Attacco se ha LoF · IMM-A → solo Schivata
(−3 −6 = **−9**) · IMM-B → nulla di utile · Stordito → Schivata (−3 −3 = **−6**) · Null → Tiro Normale.

### G. Salvezza
Quella dell'arma (spesso Sagoma Circolare, colpisce tutti dentro). Nessun bonus di Copertura
sul tiro d'attacco; il +3 di Copertura sulla salvezza ⚠️ non è escluso esplicitamente.

### I. Controllo dell'app
Voci attese: `speculativo −6`, `gittata`, `bersagliato +3`.
🔴 Oggi il motore, se il bersaglio è Bersagliato, **toglie il −6 e non dà il +3** (regola N4): esce 0 invece di **−3**. `motore_regole_n5.js` ~riga 4188 (§10).
🔴 Il filtro armi usa "ha bande" invece del Tratto *Speculative Attack* (§10).

---

## 1.5 ATTACCO GUIDATO  ⭐
`ordine_attacco_guidato.js` · azione `'ATTACCO GUIDATO'` · attributo **BS**

**Tipo:** è la skill `BS Attack (Guided)` scritta nel profilo, non un'arma. Solo **Turno Attivo**.

**Requisiti:**
- Bersaglio principale in **Stato Bersagliato** (Targeted)
- **Non serve la LoF**
- Si usa la **Blast Mode** dell'arma, o una modalità con Tratto *Impact Template (Circular)*.
  **N5.2**: se l'arma non ha modalità circolare, se ne sceglie una qualsiasi ma si applica
  comunque la Sagoma Circolare **centrata sul bersaglio** ✅
- Distanza ≤ **gittata massima** dell'arma
- **Vietato** con armi BS Weapon (PH) o BS Weapon (WIP)
- Il bersaglio non può stare in una stanza chiusa: deve esistere una traiettoria
- **Limite: 5 Attacchi Guidati per turno** per il giocatore attivo

**Burst:** sempre **1**, qualunque MOD al B. ✅

### Lato ATTACCANTE — voce per voce

| Voce | MOD | Si applica? |
|---|---|---|
| Stato Bersagliato del bersaglio | **+3** | ✅ sempre (è un requisito, quindi c'è sempre) |
| Gittata, misurata **in linea retta** | da Weapon Chart | ✅ |
| ECM (Guided −X) / TinBot: Guided del bersaglio | −3 / −6 dal profilo | ✅ (leggere il valore, non assumerlo) |
| Fireteam Livello 4 | +1 BS | ✅ (bonus su BS Attack) |
| `BS Attack (+N)` del profilo dell'attaccante | +N | ✅ (MOD positivo dell'utente) |
| Stordito (Stunned) sull'attaccante | −3 | ✅ ma uno Stordito **non può dichiarare Attacchi**: di fatto non spara |
| Mimetismo del bersaglio | — | ❌ ignorato |
| Copertura Parziale | — | ❌ ignorata (anche il +3 alla salvezza? vedi sotto) |
| Zone di Visibilità | — | ❌ ignorate |
| Fuoco di Soppressione del bersaglio (−3) | — | ❌ è un MOD negativo che non dichiara di valere contro il Guidato |
| Nanoscreen | — | ❌ (vale contro BS Attack con LoF; non dichiara il Guidato) ⚠️ |
| Stati del bersaglio (IMM-A, IMM-B, Isolato, Prono…) | — | ❌ **non danno bonus all'attaccante**: pesano solo sul tiro del difensore |
| `+1 SD` Fireteam L2 | — | ⚠️ tecnicamente applicabile (non è Long Skill), ma è inutile: col F2F a Burst 1 aggiunge un dado da scartare — ammesso |

> Regola che decide la tabella: *"Other negative MODs (Mimetism, Partial Cover, Visibility Zones…)
> are not applied unless they specify that they work against BS Attack (Guided)."* I MOD
> **positivi** dell'attaccante restano; i **negativi** cadono, salvo ECM (Guided). ✅

**Copertura sulla salvezza:** il testo toglie i MOD negativi *al tiro d'attacco*. Il +3 alla
salvezza è un effetto della Copertura sul bersaglio; il regolamento non lo esclude
esplicitamente per il Guidato. ⚠️ da confermare — nell'esempio ufficiale la Copertura non è citata.

### Lato DIFENSORE — le due uniche reazioni, voce per voce

**Principio che rende tutto sommabile:** *"If a Trooper is in several States that affect the
same Attribute, their effects are cumulative"* (riga 1921 / 13594 del .txt). ✅
Gli stati **si sommano** fra loro. Poi si applica il tetto **−12**.

Ma prima di sommare, **uno stato può vietare la reazione**: guardare sempre la colonna "può dichiararla?".

#### RESET (tiro **WIP**) — evita il Guidato **e** cancella il Bersagliato

| Voce | MOD al WIP | Può dichiarare Reset? |
|---|---|---|
| Bersagliato | **−3** | ✅ (c'è sempre, è il requisito del Guidato) |
| Immobilizzato-B | **−3** | ✅ è l'**unica** cosa che può fare |
| Isolato | **−9** | ✅ |
| Stordito | **−3** (a ogni tiro tranne le salvezze) | ✅ (non può Attaccare, ma il Reset non è un attacco) |
| Immobilizzato-A | — | ❌ **non può dichiarare Reset**: l'IMM-A consente **solo la Schivata** |
| Surprise Attack dell'attaccante | −3/−6 (solo se l'attaccante partiva da Marker) | ✅ solo nel Faccia a Faccia (N5.2, adottata) |
| Firewall del difensore | — | ❌ il Firewall penalizza chi *attacca* via Comms, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus Fireteam al Reset |

**Sesto Senso** (anche via Fireteam Livello 5): se dichiari Reset **non applichi nessun MOD
negativo, TRANNE** IMM-A −6 PH, IMM-B −3 WIP, Isolato −9 WIP. Quindi col Sesto Senso **il −3
del Bersagliato sparisce** (e anche Stordito e Surprise Attack), ma IMM-B e Isolato restano. ✅

**Esempi di somma:**
- Solo Bersagliato: **WIP −3**
- Bersagliato + IMM-B: **−3 −3 = WIP −6**
- Bersagliato + Isolato: **−3 −9 = WIP −12**
- Bersagliato + IMM-B + Isolato: −15 → **troncato a −12**
- Bersagliato + IMM-B + Isolato + Stordito: −18 → **−12**
- Bersagliato + IMM-B con **Sesto Senso**: il −3 Bersagliato cade → **WIP −3**
- Bersagliato + **IMM-A**: **niente Reset**, può solo Schivare (sotto)

#### SCHIVATA (tiro **PH**) — evita il Guidato ma **non** cancella il Bersagliato

| Voce | MOD al PH | Può dichiarare Schivata? |
|---|---|---|
| Sagoma senza LoF verso l'attaccante (nel Guidato c'è quasi sempre) | **−3** | ✅ |
| Immobilizzato-A | **−6** | ✅ è l'**unica** cosa che può fare |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3/−6 | ✅ solo nel Faccia a Faccia (N5.2, adottata) |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del profilo | +N | ✅ (`Dodge (+1")` è movimento, non va al tiro; `Dodge (ARM +3)` va alla salvezza se fallisci) |
| Immobilizzato-B | — | ❌ **non può Schivare**: l'IMM-B consente **solo il Reset** |
| Bersagliato | — | ❌ il −3 del Bersagliato è **sul Reset**, non sulla Schivata |
| Isolato | — | ❌ il −9 è **sul Reset**, non sulla Schivata |

**Sesto Senso** sulla Schivata: cade il −3 senza LoF, lo Stordito, il Surprise Attack; resta **solo** il −6 dell'IMM-A.

**Esempi di somma:**
- Bersaglio normale, senza LoF: **PH −3**
- Bersagliato + IMM-A, senza LoF: **−3 −6 = PH −9**
- Bersagliato + IMM-A + Stordito, senza LoF: **−12**
- Bersagliato + IMM-A con **Sesto Senso**: **PH −6**
- Bersagliato + Isolato: meglio **Schivare a PH −3** che Resettare a WIP −12

#### Tabellina: chi può fare cosa

| Stato del bersaglio | Reset | Schivata |
|---|---|---|
| Solo Bersagliato | ✅ | ✅ |
| + IMM-A | ❌ | ✅ (−6) |
| + IMM-B | ✅ (−3) | ❌ |
| + Isolato | ✅ (−9) | ✅ |
| + Stordito | ✅ (−3) | ✅ (−3) |
| + Incosciente / Morto / qualsiasi stato Null | ❌ | ❌ → Tiro Normale dell'attaccante |

**Nessuna reazione valida → Tiro Normale** dell'attaccante (`BS +3 + gittata − ECM`).

**Secondari sotto la sagoma:** possono **Schivare** (PH, −3 senza LoF, più i loro stati),
in Faccia a Faccia. **Non** possono usare il Reset: il Reset evita un attacco solo quando
l'utente ne è il **bersaglio** (righe 7746–7752: chi non è bersaglio fa un Tiro Normale, che
non evita nulla), e il bersaglio designato del Guidato è uno solo, quello Bersagliato.
Il +3 dello Stato Bersagliato vale solo verso di lui.

**Esempio ufficiale (wiki N5.3):** REM con Missile Launcher contro bersaglio con Mimetism (−6)
in Stato Bersagliato → attaccante **+3 gittata, +3 Bersagliato** (Mimetismo e Copertura
ignorati), Blast Mode EXP, 3 salvezze ARM. Difensore: **Schivata PH−3** o **Reset WIP−3**. ✅

> **Sesto Senso** (anche da Fireteam Livello 5): su Schivata e Reset cadono **tutti** i MOD negativi
> tranne IMM-A −6 PH, IMM-B −3 WIP, Isolato −9 WIP. Dopo la somma, tetto **−12**; SV sotto 1 = fallimento automatico.

### Controllo dell'app
Voci attese lato attaccante: `bersagliato +3`, `gittata` (linea retta), `ecm` (se c'è), `fireteam +1` (L4).
**Nessuna** voce di Copertura, Mimetismo, Visibilità, Soppressione.
Lato difensore: Reset → `bersagliato −3` + una voce per stato (IMM-B −3, Isolato −9, Stordito −3); Schivata → `senza LoF −3` + IMM-A −6 / Stordito −3 / FT L3 +1.
🔴 Secondari "solo salvezza, niente F2F" · 🔴 SV<1 portato a 1 · 🔴 Reset senza tetto −12 (§10).

---


## 1.6 HACKING (Attacco Comms)
### A. Identità
`ordine_hacking.js` · azione `'HACKING'` · programmi d'attacco = **Abilità Breve / ARO** ·
etichetta *Comms Attack* · attributo **WIP** · **nessuna LoF** · Burst del **programma** in Attivo,
**1** in ARO (salvo il programma dica altro).

### B. Requisiti
- Un Hacking Device che contenga il programma (tabella sotto)
- Bersaglio nella propria **Hacking Area** = ZdC propria + ZdC dei Ripetitori propri/alleati; se sei
  nella ZdC di un **Ripetitore nemico**, la tua Hacking Area comprende **tutti** i nemici sul tavolo
  (righe 4794–4799)
- Bersaglio **in forma di Modello** (riga 4785: «Only Troopers in Model form may be targeted by
  Hacking Programs») e del **tipo ammesso dal programma** — colonna TARGET della chart,
  righe 5005–5045
- 🔴 **La colonna TARGET è un Requisito**, non un filtro di comodo. Lo dice la skill
  **Non-Hackable**, righe **9415–9417**: «cannot be the target of Hacking Attacks whose
  **Requirements** require the target have a specific Unit Type (HI, REM, TAG, etc.)». Quindi
  un Trinity su chi non è Hacker, o un Total Control su chi non è TAG, è un **requisito
  fallito → Idle** (righe 1244–1247): niente tiro, Ordine o ARO speso, e un Marker si rivela
  (righe 7462–7463). Non è "non dichiarabile": si dichiara e si risolve in Idle

> 🔴 **Hackerare attraverso un Ripetitore NEMICO: le quattro cose da sapere.**
>
> | Cosa | Regola |
> |---|---|
> | Solo contro **Hacker** | Righe **4799–4802**: «if the Enemy Trooper is not a Hacker, any ARO or Hacking Program using the Enemy Repeater will **fail its Requirements, and instead an Idle** will be performed». Non è un divieto: è un requisito, quindi Ordine speso (righe 1244–1247) |
> | Sempre **−3 Firewall** | Righe **4850–4852**: «may use it to apply Hacking Programs against any enemy Hacker, but applying **Firewall MODs (−3)**». Esempio alle righe 4941 e 4944–4945. Vale anche se il bersaglio non ha alcun Firewall sul profilo: la via del Ripetitore nemico **è** un Firewall (righe 4837–4839, che citano proprio «if attacking through an enemy Repeater») |
> | **+3 alla salvezza** del bersaglio | Righe 4841–4842. Fisso a +3 qualunque sia il Firewall (righe 4771–4774) |
> | Nessuna reazione contro il Ripetitore | Righe **4853–4854**: «There can be no reaction against a Repeater that is being used by an enemy Hacker, only against the Hacker, if possible» |
>
> **Due casi di HoloMask, entrambi Idle nella Risoluzione, entrambi rivelano qualcosa:**
> - Righe **4818–4825** — il *bersaglio* è in HoloMask e sul profilo vero **non ha la skill Hacker**:
>   Idle, e si scopre che non è un Hacker.
> - Righe **4827–4833** — il *Ripetitore* è finto, cioè il nemico è in HoloMask e sul profilo vero
>   **non ha un Repeater**: Idle, e si scopre che non ha il Ripetitore.
**L'attivo può dichiararlo?** IMM-A ❌ · IMM-B ❌ · Stordito ❌ (vietati gli Attacchi) ·
Retreat! ❌ · Engaged ❌ (in Engaged solo Berserk/CC/Schivata/Idle/Reset) ·
Isolato ❌ (Programmi disabilitati) ·
Bersagliato ✅

### C. Formula
`SV = WIP + Attack MOD del programma + 3 (se Bersagliato) − Firewall del bersaglio − ECM (Hacking) del bersaglio + Opponent MOD avversario ± stati` → ±12

### D. Attaccante voce per voce
**Programmi d'attacco** (Hacking Programs Chart ufficiale, riga 5000 del .txt):

| Programma | Att. MOD | Opp. MOD | PS | B | Bersaglio | Effetto |
|---|---|---|---|---|---|---|
| Carbonite | 0 | 0 | 7 | 2 | TAG, HI, REM, VH, Hacker | DA → **2 salvezze BTS pieno**, Non-Lethal, IMM-B |
| Oblivion | 0 | 0 | 4 | 2 | TAG, HI, REM, VH, Hacker | AP → **BTS dimezzato**, Non-Lethal, Isolato |
| Spotlight | 0 | 0 | 5 | 2 | chiunque (in forma di Modello) | AP → BTS dimezzato, Non-Lethal, Bersagliato |
| Total Control | 0 | 0 | 4 | 1 | **solo TAG** | DA, Non-Lethal, Posseduto |
| Trinity | **+3** | 0 | 6 | 3 | **solo Hacker** | 1 Ferita per salvezza fallita (letale) |
| Zero Pain | 0 | **−3** | — | 2 | — | annulla l'Attacco Comms, B2 in ARO |

Dispositivi: `Hacking Device` = Carbonite, Spotlight, Total Control, Oblivion · `Plus` = + White
Noise, Cybermask · `Killer` = Trinity, Cybermask · `EVO` = Assisted Fire, Enhanced Reaction, Fairy
Dust, Controlled Jump (supporto).

#### Chi è un bersaglio valido — `Hackable`, `Hacker`, `Non Hackable`

**`Hackable` è una Caratteristica, righe 598–605.** «This Characteristic identifies those
Troopers technologically advanced enough to suffer attacks from or be aided by infowar and
hacking systems… **HI, REM, TAG, and VH** Troopers are Hackable **unless otherwise stated**.
**Hackers, regardless of Troop Type, are also Hackable**» (righe 604–605). Quindi ci sono
**due vie indipendenti** per essere Hackable: il **Tipo di Truppa** e la **skill Hacker**.
Una MI, una LI, una TAG-less qualunque: se ha `Hacker`, è Hackable.

**`Non Hackable` non è una Caratteristica: è una Special Skill, righe 9404–9418.** `AUTOMATIC
SKILL`, `Obligatory`, e ha **un solo** effetto operativo (righe 9415–9417):

> «The user of this Special Skill cannot be the target of Hacking Attacks **whose Requirements
> require the target have a specific Unit Type (HI, REM, TAG, etc.)**.»

Più «This Special Skill remains active even when its owner is in a **Null State**» (righe
9418–9419).

⚠️ **È una protezione mirata, non un'immunità.** Non dice "non può essere hackerato": dice che
non può essere bersaglio degli attacchi **il cui requisito chiede un Tipo di Truppa**. Ogni
altro requisito passa. Quindi:

| Programma | REQUIREMENTS | Chiede un Tipo di Truppa? | `Non Hackable` lo blocca? | Righe |
|---|---|---|---|---|
| **Carbonite** | «enemy Trooper with the Hackable Characteristic (HI, REM, TAG, VH…) **or an enemy Hacker**» | la **prima** via sì, la **seconda no** | **no**, se il bersaglio è Hacker: passa dalla via "Hacker" | 5093–5094 |
| **Oblivion** | identico a Carbonite | idem | **no**, se il bersaglio è Hacker | 5235–5236 |
| **Trinity** | «The target must be an enemy **Hacker**» | **no** | **no** | 5310 |
| **Total Control** | «an enemy **TAG**, or a TAG in Possessed State» | **sì** | **sì** | 5286 |
| **Spotlight** | nessun REQUIREMENTS; IMPORTANT: «The target of this Hacking Program **does not need** to have the Hackable Characteristic» | **no** | **no** | 5269–5271 |
| **Zero Pain** | solo chi lo usa (attivo, o ARO lecito) | **no** | n/a: è difensivo | 5361–5364 |
| **White Noise** | solo «the Hacker must be the Active Trooper» | **no** | n/a: colpisce una zona | 5332–5334 |
| **Controlled Jump** | — ; IMPORTANT: «This Program **affects Troopers even if they don't have the Hackable Characteristic**» | **no** | **no** | 5144–5145 |
| **Assisted Fire / Enhanced Reaction** | «must be a **REM**…» | sì | n/a: **Supportware su alleato**, non un Hacking **Attack** | 5074–5076 · 5183–5185 |
| **Fairy Dust** | «HI, REM, TAG, or VH…» | sì | n/a: Supportware su alleato | 5198–5200 |

**La regola che vince.** `Non Hackable` interviene **sul requisito**, non sul bersaglio. Se il
programma offre una via d'ingresso che **non** nomina un Tipo di Truppa — «or an enemy Hacker»,
«must be an enemy Hacker», oppure nessun requisito affatto — quella via resta **aperta** e
l'attacco è legale. Quindi un Trooper con `Non Hackable` **e** la skill `Hacker` **è un
bersaglio valido** per Carbonite, Oblivion, Trinity e Spotlight. Vince la **Skill Hacker**.

> **Perché allora `Non Hackable` compare su profili MI (Coyotes, Vigilantes)?** Perché serve
> altrove, non sui programmi. La MI **non è** nella lista HI/REM/TAG/VH, quindi di suo non
> sarebbe mai Hackable per Tipo; l'etichetta lavora sul **Movimento Cauto**, righe **2703–2712**:
> un Trooper **Hackable** in forma di Modello genera AROs se il Movimento Cauto comincia o
> finisce dentro l'Hacking Area di un Hacker nemico, mentre «If a **non-Hackable** Trooper is in
> Model form and its Cautious Movement begins or ends inside the Hacking Area of any enemy
> Hackers, this **does not** cause the Trooper to generate AROs». Lì la distinzione pesa davvero.
> ⚠️ Ma sui 5 profili Hacker la cosa si incrocia: sono Hackable **per la skill** (righe 604–605),
> e il `Non Hackable` tocca solo i requisiti con Tipo di Truppa — non la Caratteristica in sé.
> **LETTURA**: per il Movimento Cauto li tratterei come **Hackable** (la skill Hacker dà la
> Caratteristica; il `Non Hackable` non la toglie, limita solo i bersagliamenti per Tipo). È il
> punto meno scritto di tutta la risposta: segnalato come LETTURA, non come regola.

> **Il `Cube` non c'entra con l'hacking.** È `AUTOMATIC EQUIPMENT` (righe 10555–10566) e serve a
> due cose: ri-tiro del WIP del Dottore spendendo Command Token, e recupero fra partite. Rende
> però bersaglio valido del **Sepsitor**, che richiede «a Trooper with a Cube» (righe 6411–6413)
> — un Attacco BS a Sagoma Diretta, non un Attacco Comms. Nessun legame con `Hackable`.

> **Cybermine (righe 6239–6243).** Non è un requisito di bersagliamento: la Cybermine colpisce
> chi finisce sotto la Sagoma, e quelle righe decidono soltanto **quale stato** si subisce.
> «Any Troopers with the Hackable Characteristic (HI, REM, TAG, VH…) **and Hackers** who fail
> either Saving Roll enter **Immobilized-B** State instead of **Stunned** State». Quindi un
> Hacker con `Non Hackable` prende **IMM-B**, non Stordito: la clausola nomina i Hacker a parte,
> e `Non Hackable` non si applica perché qui non c'è alcun requisito di Tipo di Truppa.

**Resta valido il filtro generale** (riga **4785**): «Only Troopers in **Model form** may be
targeted by Hacking Programs». Un Marker non è bersaglio, qualunque sia la sua Caratteristica.

| Voce | MOD | Si applica? |
|---|---|---|
| Attack MOD del programma | vedi tabella | ✅ |
| Bersaglio in Stato Bersagliato | **+3** | ✅ (vale anche per gli Attacchi Comms) |
| Firewall del bersaglio (−3 / −6) | −3 / −6 | ✅ **uno solo**, e lo **sceglie il giocatore del bersaglio**, non l'app: righe 4761–4763 «If a Trooper can benefit from more than one Firewall, **their player will decide which one to apply**». In pratica sceglierà il più alto, ma è una scelta, non un massimo automatico. **Quattro fonti, un solo MOD applicato**: il `Firewall (−X)` del profilo, il `TinBot: Firewall (−X)`, la via del **Ripetitore nemico** (−3, righe 4837–4839) e il **Fairy Dust** (−3 a un intero tipo di truppa — §1.6 H). Non si sommano mai fra loro |
| ECM (Hacking −N) del bersaglio | −N | ✅ e **si somma** al Firewall: l'ECM è *Automatic Equipment* a sé (riga 10730), **non** un Firewall, quindi la regola «uno solo» non lo tocca. Notazione corretta: `ECM (Hacking −3)` — riga 6655 e wiki *Template:Modifiers-explained* (PDF 5.3, set 2026). Fra parentesi c'è il **tipo di attacco**, non una skill. Non dà alcun +3 alla salvezza |
| `TinBot: Firewall (−X)` del bersaglio | −X | ✅ **ma è un Firewall**: righe 11162–11164, «the Enemy applies a −3 **Firewall** MOD». Quindi entra nella regola «uno solo» insieme al Firewall del profilo e a quello della via del Ripetitore nemico. Quattro fonti (col Fairy Dust, §1.6 H), un solo MOD applicato |
| `TinBot: Guided (−X)` del bersaglio | — | ❌ sull'Hacking: le righe 11166–11169 lo legano al **Guided Attack**, non all'Attacco Comms. E non è un Firewall: dà solo «a −6 MOD», senza il +3 alla salvezza |
| Opponent MOD del programma avversario (Zero Pain) | −3 | ✅ solo nel F2F |
| Surprise Attack proprio | −3/−6 al nemico | ✅ se venivi da Marker |
| Stordito (attivo) | — | non puoi attaccare |
| Gittata | — | ❌ non esiste |
| Copertura / Mimetismo / Visibilità | — | ❌ |
| Fireteam +1 BS (L4), +1 SD (L2) | — | ❌ valgono per BS Attack e armi BS Weapon (PH)/(WIP), **non** per i Programmi |

### E. Reazioni del bersaglio voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro gli Attacchi Comms (è **l'unica** difesa: la Schivata non evita l'hacking). Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

**CONTRO-HACKING in ARO** (se il bersaglio è un Hacker con l'attivo nella sua Hacking Area) → F2F
WIP contro WIP: il reattivo applica Attack MOD del proprio programma, +3 se l'attivo è Bersagliato,
Firewall/ECM dell'attivo, Burst 1. Isolato ❌ (programmi disabilitati).

**ATTACCO BS/CC in ARO contro l'hacker** → F2F col tiro del reattivo calcolato come un suo attacco
(gittata, Copertura e Mimetismo dell'hacker, ecc.).

**SCHIVATA** → ❌ non evita gli Attacchi Comms: al massimo è un Tiro Normale PH che non cambia nulla.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Chi può reagire come
| Stato del reattivo | Reset | Contro-hack | Attacco BS/CC |
|---|---|---|---|
| Normale | ✅ | ✅ se Hacker | ✅ |
| Bersagliato | ✅ −3 | ✅ | ✅ |
| IMM-A | ❌ | ❌ | ❌ |
| IMM-B | ✅ −3 | ❌ | ❌ |
| Isolato | ✅ −9 | ❌ | ✅ |
| Stordito | ✅ −3 | ❌ | ❌ |
| Bersagliato+IMM-B+Isolato | ✅ −15 → **−12** | ❌ | ❌ |


### G. Salvezza
Su **BTS**, col PS del programma. **Firewall: +3** alla salvezza contro Attacchi Comms —
**sempre +3**, mai scalato sul valore fra parentesi e mai sommato se i Firewall sono due
(righe 4759–4763 e 4771–4774: «the MOD to the Saving Roll is always fixed (+3)»). Nel
regolamento lo stesso effetto compare anche scritto al rovescio, come MOD al PS del programma
(righe 4944–4945): è la stessa cosa, perché SV salvezza = BTS − PS. L'**ECM non dà nulla** alla
salvezza. **AP dimezza il BTS, DA no** (DA = due salvezze contro BTS pieno). Critico = +1
salvezza (con AP, ancora dimezzato). Immunity: non vale contro Comms, tranne Immunity (State).

### H. SUPPORTWARE (Fairy Dust · Enhanced Reaction · Assisted Fire · Controlled Jump)

Sono programmi a **durata estesa** che non attaccano nessuno: danno bonus agli alleati.
Righe **4721–4726**. Tutti e quattro sono **LONG SKILL** (chart riga 16629 per Fairy Dust,
colonna LONG SKILLS) e **No Roll**: non c'è tiro, non c'è F2F, non c'è salvezza. Essendo
Long Skill valgono **solo in Turno Attivo** (riga 6732) e **non sono AROs** (non compaiono
nella colonna AROS, righe 16635–16661).

**Le quattro regole di struttura — righe 4728–4738.** Valgono per tutti i Supportware:

| Regola | Testo | Riga |
|---|---|---|
| Uno per truppa | «A Trooper can benefit from the effects of **only one** Program with the Supportware Label at a time» | 4729–4730 |
| Uno per hacker | «Each Hacker can only sustain **one** active Supportware Program at a time» | 4731–4732 |
| Cancellazione volontaria | l'hacker lo cancella dichiarandone un altro e spendendo l'Ordine o l'ARO | 4733–4734 |
| Cancellazione automatica | se il **bersaglio** è bersagliato da un **nuovo** Supportware, **oppure** se **l'hacker** che lo sostiene entra in **Isolato** o in **qualsiasi stato Null** | 4735–4738 · ripetuto a 5223–5225 |

#### FAIRY DUST — righe 5192–5209

`LONG SKILL` · `Supportware, No roll`.

- **REQUIREMENTS** (righe 5198–5200): «Only **HIs, REMs, TAGs, or VHs** from the same Army
  List as the user may be chosen as targets». Nessun requisito di Hacking Area — a
  differenza di Enhanced Reaction, che invece pretende «inside the user's Hacking Area»
  (righe 5183–5185).
- **EFFETTO** (righe 5203–5206): «Fairy Dust allows the Player to choose a **single Troop
  Type** (HI, REM, TAG, or VH) that will benefit from **Firewall (-3)**. **Every Trooper**
  of the Hacker's Army List that belongs to the chosen Troop Type applies the corresponding
  MODs every time they suffer a Comms Attack».
- **Token** (righe 5207–5208): `SUP: FAIRYDUST` accanto **all'hacker**, non ai beneficiari.
- **Portata** (riga 5209): «This Program's range covers the **entire game table**».

Quindi: **non è un Firewall al singolo alleato, è un Firewall (−3) a un'intera categoria di
truppe della propria lista, su tutto il tavolo, senza tiro.** Si sceglie il **tipo** (HI, REM,
TAG o VH), non il modello.

**Cosa dà esattamente al beneficiario.** `Firewall (-3)`, e il Firewall è una regola a sé
(righe 4749–4763), quindi il beneficiario prende **entrambi** gli effetti del Firewall:
- **−3** al WIP di chi gli dichiara un Attacco Comms (righe 4755–4758);
- **+3 alla propria salvezza** contro Attacchi Comms (righe 4759–4760), e il +3 è **fisso**,
  non scalato sul −3 (righe 4771–4774).

**Chi può portarlo.** Di base è un programma da **EVO Hacking Device** (riga 5062). Compare
anche su un `Hacking Device Plus` quando il profilo lo elenca come **UPGRADE** fra parentesi —
righe **4714–4718**: «Custom-made software… If available, they will be listed in the Unit
Profile, in round brackets next to the name of the Hacker or the Device». Quindi
`Hacking Device Plus (UPGRADE: Fairy Dust)` è legittimo: l'UPGRADE **aggiunge** il programma a
quel dispositivo, non sostituisce il tipo di dispositivo.

#### Il punto che rompe tutto: NON si somma, si SCEGLIE

Righe **4761–4763**: «Troopers can only benefit from **one Firewall at a time**. If a Trooper
can benefit from more than one Firewall, **their player will decide which one to apply**».
Ripetuto nel REMEMBER a righe **4844–4846**: «Only the MODs of a **single** Firewall can be
applied, even if the Trooper benefits from more than one».

| Il beneficiario ha… | Risultato |
|---|---|
| solo Fairy Dust | **−3** (e +3 alla sua salvezza) |
| Fairy Dust **+** `Firewall (-6)` sul profilo | **uno solo**, scelto dal giocatore del bersaglio → in pratica −6. **Non −9** |
| Fairy Dust **+** `TinBot: Firewall (-3)` | **−3**, uno solo. Il TinBot è un Firewall: righe **11162–11164**, «the Enemy applies a −3 **Firewall** MOD» |
| Fairy Dust **+** via del **Ripetitore nemico** (−3) | **−3**, uno solo: anche quella via è un Firewall (righe 4837–4839) |
| Fairy Dust **+** `ECM (Hacking -3)` | **−6**: l'ECM **si somma**, perché non è un Firewall ma *Automatic Equipment* a sé (riga 10730). E l'ECM non dà il +3 alla salvezza |

Quindi la risposta alla domanda «è un secondo Firewall?» è **no**: è **un'altra fonte dello
stesso, unico Firewall**. Nel calcolo entra come **una voce sola** in concorrenza con le
altre fonti di Firewall, mai in somma con esse. L'unica cosa che si somma al Firewall resta
l'ECM.

#### Cosa lo annulla

| Causa | Effetto | Riga |
|---|---|---|
| **L'hacker** entra in **Isolato** | il programma è cancellato (il token va via) | 4735–4738 · 5223–5225 · più riga 14413: «all their Hacking Programs are disabled» |
| **L'hacker** entra in **qualsiasi stato Null** (Incosciente, Morto, Sepsitorizzato, Posseduto…) | cancellato | 4735–4738 · 5223–5225 |
| **L'hacker** dichiara un **altro** Supportware | cancellato: un hacker ne sostiene **uno** alla volta | 4731–4734 |
| **Un beneficiario** riceve un **nuovo** Supportware | ⚠️ cancella **l'intero** Fairy Dust, non solo su quel modello — vedi il box qui sotto | 4735–4737 · esempio 5211–5220 |
| Il beneficiario entra in Isolato o Null | ❌ **non** cancella il programma: l'elenco delle cancellazioni (4735–4738) è **chiuso** e parla solo dell'**hacker**. Il modello Null semplicemente non viene più attaccato; se torna in piedi, il Firewall c'è ancora | — |

> ⚠️ **La trappola dell'esempio ufficiale (righe 5211–5220).** Fairy Dust su REM; poi un
> secondo hacker EVO dichiara **Enhanced Reaction** su **un** REM che stava beneficiando del
> Fairy Dust. Testo: «By designating a REM that was already benefitting from Fairy Dust, the
> new Supportware Program **deactivates the Fairy Dust Program** and the corresponding Token
> **is removed from the table**». Non si perde il Fairy Dust solo su quel REM: **cade tutto il
> programma**, per tutti i REM della lista. È la regola 4735–4737 applicata a un programma il
> cui "bersaglio" è una **categoria**.

> **Differenza da tenere a mente con il Firewall del Dispositivo di Hacking.** La FAQ **F01**
> (0.1, set 2026, wiki *Firewall*) dice che il Firewall **del dispositivo** non vale se il
> dispositivo è disabilitato, «for example by being in Isolated State or any Null State» — e lì
> conta lo stato **del portatore**. Per il Fairy Dust conta invece lo stato **dell'hacker che
> lo sostiene**: il beneficiario può essere Isolato e conservare il −3, perché quel Firewall
> non viene da un suo dispositivo. Due regole diverse, due soggetti diversi. Lo stesso vale
> per il `TinBot: Firewall`, che cade con **l'Isolato o il Null del proprio portatore** (righe
> 11130–11131).

**Wiki.** Pagine *Fairy Dust* (oldid 4005, nessuna marca di versione: **non toccata** da N5.2
né N5.3), *Template:Supportware* (oldid 3701, nessuna marca di versione) e *Firewall* (PDF 5.3,
set 2026 + FAQ 0.1): il testo coincide parola per parola con il .txt su tutti i punti sopra.
L'unica novità N5.3 sul Firewall è che diventa **Automatic Equipment** (prima: Equipment) — vedi
§3.1 e §9 — e questo **non** cambia la regola «uno solo».

### I. Controllo dell'app
Voci attese: `programma`, `bersagliato +3`, `firewall`, `ecm`.
✅ I valori del catalogo per Total Control e Trinity coincidono con la chart ufficiale: si può togliere "DA VERIFICARE" (§10).

---

## 1.7 SCOPRIRE (Discover)
### A. Identità
`ordine_scoprire.js` · azione `'SCOPRIRE'` · **Basic Short Skill / ARO** (si combina con un'altra
Short Skill: il classico *Discover + Attack*) · attributo **WIP** · **serve LoF** · Tiro **Normale**.

### B. Requisiti
- LoF verso il Marker
- Non due volte **sullo stesso bersaglio nello stesso Ordine**
- Solo Marker (CAMO, Impersonation, Hidden rivelabile, Deployable camuffati…)
- Attivo: Retreat! ✅ (è Basic Short Skill) · IMM-A/IMM-B ❌ · Stordito ✅ −3 · Engaged ❌

### C. Formula
`SV = WIP + Gittata del Discover − Copertura − Mimetismo − Visibilità + 3 Bersagliato + 3 Fireteam L3 + TinBot/Sensor` → ±12

**Gittate proprie del Discover** (non quelle dell'arma):

| 0–8" | 8–32" | 32–48" | 48–96" |
|---|---|---|---|
| **+3** | **0** | **−3** | **−6** |

### D. Voce per voce
| Voce | MOD | Si applica? |
|---|---|---|
| Gittata del Discover | tabella sopra (X-Visor: −3→0, −6→−3) | ✅ |
| Copertura Parziale del Marker | **−3** | ✅ ("gli stessi MOD di un BS Attack") |
| Mimetismo del Marker | −3 / −6 | ✅ (MSV lo riduce) |
| Zone di Visibilità | −3 / −6 | ✅ |
| Bersagliato | **+3** | ✅ (in pratica raro su un Marker) |
| Fireteam Livello 3 | **+3** | ✅ |
| `TinBot: Discover (+3)` | +3 | ✅ |
| Sensor posseduto | **+6** contro Marker CAMO | ✅ automatico |
| Stordito | −3 | ✅ |
| Fireteam L4 +1 BS, L2 +1 SD | — | ❌ sono bonus del BS Attack |
| Marksmanship | — | ❌ vale solo su BS Attack |

### E. Reazioni
Nessun Faccia a Faccia: il Discover non è un attacco. Sesto Senso: non c'entra.

### F. 🔴 LA MANOVRA *DISCOVER + ATTACK*, passo per passo
È la manovra citata come eccezione dalle righe 13609–13610 (CAMO) e 14291–14293 (IMP-2), e il
regolamento la descrive per esteso in un IMPORTANT, **righe 6817–6829**:

> «A common combination in an Order is Discover + Attack. This tactical maneuver allows you to
> declare an Attack against a Camouflaged enemy, which cannot normally be done.
> • If the Camouflaged target declares an ARO, revealing themselves, **there is no need to
> perform the Discover Roll** before resolving the Attack.
> • If the Camouflaged target does not declare an ARO, the Trooper will need to **pass the
> Discover Roll before resolving any Attack** against that target.
> • Remember that the Active Trooper **may Discover one target and Attack a different target**
> if they choose to do so.»

**Struttura dell'Ordine.** Lo Scoprire è Basic Short, l'Attacco è Short: è la combinazione
`Basic Short + Short` delle righe 1047–1054, e le due metà vanno **nell'ordine mostrato**
(riga 1049, «always declared in the order shown»). Quindi lo Scoprire è **sempre la prima
metà**, l'Attacco la seconda. Non esiste Attacco + Scoprire.

**La sequenza.**
1. **Dichiarazione.** Si dichiara lo Scoprire, e l'Attacco **si dichiara contro il Marker**,
   con tutte le scelte già fissate — arma, modo, munizione, Burst, punto di tiro (righe
   1226–1233: «All details and choices… must be specified when it is declared»). È proprio
   questo che la manovra autorizza: senza di essa l'Attacco contro un Marker è vietato
   (13609–13610). L'esito dello Scoprire **non si conosce ancora**.
   ⚠️ **Un'eccezione, dalla FAQ F18** (0.1, set 2026 — pagine wiki *Order Expenditure Sequence*,
   *Ballistic Skills*, *White Noise*): sì a tutti i dettagli, **tranne la posizione del
   bersaglio**, che si sceglie **nella Risoluzione**, prima di misurare le gittate; e se conta
   chi dichiara prima, sceglie il giocatore attivo. Riguarda il *punto* — dove va la sagoma di
   White Noise, dove si misura sul bersaglio — non *quale* bersaglio né *con che arma*. Per
   l'app non cambia niente, perché non ha mappa e non misura: la segnalo perché è l'unica
   eccezione scritta alla riga 1226, e perché va tenuta d'occhio accanto alla procedura in 4
   passi del Fuoco Speculativo (righe 3930–3944), che la sagoma la piazza **prima** del
   controllo degli ARO.
2. **ARO.** Il reattivo dichiara. Un Marker ha solo quattro ARO possibili (riga 13621:
   Discover, Schivata, Look Out!, Reset) **più** l'Attacco, che però gli cancella il CAMO
   (riga 13634). Nota: *qualunque* ARO rivela un Marker CAMO, perché tutti e quattro
   richiedono un tiro e la riga 13634 cancella lo stato per «any Skill that requires a Roll».
3. **Risoluzione, due rami:**

| | Il Marker **reagisce** | Il Marker **non reagisce** |
|---|---|---|
| Scoprire | **non si tira** (6822–6823) | si tira **per primo** (6824–6826) |
| Attacco | si risolve contro il Modello rivelato | si risolve **solo se lo Scoprire riesce** |
| Tipo di tiro | **Faccia a Faccia** se l'ARO influenza l'attacco (Attacco o Schivata); **Normale** se non lo influenza (Reset, Look Out!) — riga 2068–2070. L'esempio del regolamento lo dice: «…no longer necessary and the corresponding **Face to Face Rolls** are performed» (riga 6949) | Tiro **Normale** |
| Scoprire fallito | — | l'Attacco **è perso**, l'Ordine è speso, un uso Disposable dichiarato **si consuma** (righe 1244–1247). E non si può ritentare lo Scoprire su quel Marker fino al Turno di Giocatore successivo (6845–6846) |

**Scoprire un bersaglio e attaccarne un altro** (righe 6828–6829): ammesso, e in quel caso
l'Attacco **si risolve comunque**, indipendentemente dall'esito dello Scoprire — perché il
secondo bersaglio è un bersaglio lecito di suo, non ha bisogno di essere scoperto. Lo Scoprire
riuscito o fallito sul primo non tocca il secondo.

**Quali Attacchi come seconda metà.** Solo quelli che sono **Short Skill** (§7.1):

| Ammessi | Esclusi, e perché |
|---|---|
| **BS Attack** — il caso normale, e il solo nominato per l'IMP-2 (riga 14291) | **Attacco Intuitivo** e **Fuoco Speculativo**: sono **Long Skill** (chart 16630 e 16634), occupano l'Ordine intero. L'Intuitivo è la manovra *alternativa* contro un Marker, mai combinabile con lo Scoprire |
| **CC Attack** — in teoria, ma contro un Marker **mai**: non si può entrare in contatto di Silhouette con un Marker CAMO (riga 13608) né IMP (riga 14206), quindi il bersaglio non è raggiungibile | **Soppressione**, **Triangulated Fire**, **Berserk**: Long Skill |
| **Programmi di Hacking** (Carbonite, Oblivion, Spotlight, Total Control, Trinity, Zero Pain) — ⚠️ **LETTURA**: sono Short Skill, ma la riga **4785** chiede il bersaglio «in Model form». Dopo uno Scoprire riuscito lo è; al momento della dichiarazione no. Il regolamento non tratta il caso: per l'IMP-2 nomina **solo** il BS Attack (riga 14291) | **White Noise**, **Deactivator**, **Sensor**: Short Skill ma non Attacchi, e il Deactivator non colpisce Marker (§1.16) |
| **Place Deployable** — ha l'etichetta *Attack* (riga 7551). Ma la riga 7572 vieta già di piazzare un Deployable con un Marker CAMO nella Trigger Area, salvo Attacco Intuitivo | |

**Contro quali Marker funziona:**
- **CAMO**: sì, è il caso per cui la manovra esiste (13609–13610).
- **IMP-2**: sì, e **solo con BS Attack** — righe 14291–14293, «The only exception is declaring
  Discover + BS Attack against a Marker (IMP-2) and passing a Discover Roll if the Marker does
  not reveal itself with an ARO».
- **IMP-1**: **no**. Riga 14207 vieta gli Attacchi contro IMP-1 senza alcuna eccezione, e uno
  Scoprire riuscito su IMP-1 non rivela il Modello: lo porta a **IMP-2** (righe 14227–14229).
  Servono due Ordini.

### G. La manovra in ORDINE COORDINATO
Fino a 4 truppe dichiarano Scoprire + Attacco BS, e per la riga **11357–11359** tutte sullo
**stesso** Marker e poi sullo **stesso** bersaglio. In Coordinato è anche l'**unica** via per
colpire un Marker, perché le righe **11399–11401** vietano Speculativo e Intuitivo dentro un
Coordinato.

**Basta UNO Scoprire riuscito.** Tre righe che convergono:
- **11427–11429**: «If the participants of a Coordinated Order declare the use of a Skill or
  Equipment **such as** Doctor, MediKit or Engineer **on a common target, any successful Roll
  means that the Skill was successful**». «Such as» è una categoria aperta, non un elenco di tre.
- **6842–6843**: uno Scoprire riuscito *rimuove il Marker dal tavolo* e lo sostituisce col
  Modello. Lo stato sta sul Marker, che è un oggetto unico: non esiste in Infinity una
  conoscenza per singola truppa.
- **1058–1059** e **3603–3606**: tutto quanto avviene in un Ordine è **simultaneo**, «since
  everything happens simultaneously during the Order». Non c'è un ordine in cui il successo di
  una truppa "arrivi prima" dell'attacco di un'altra.

⚠️ **LETTURA**, perché la riga 11427 nomina Doctor, MediKit ed Engineer e non lo Scoprire, e la
riga **6824–6826** della manovra è scritta al singolare («**the Trooper** will need to pass the
Discover Roll»). È però la sola lettura compatibile con le tre righe sopra, ed è anche l'unica
che non richiede uno stato di conoscenza per truppa, che il regolamento non ha. Resta il tipo di
punto da girare a una FAQ: con quattro truppe diventa un tiro su quattro per quattro attacchi.

**Il Burst.** Lo Scoprire **non ha Burst**: la sua voce (righe 6832–6855) non ne dichiara
nessuno, quindi è **un tiro per ciascuno** e il dimezzamento dello Spearhead non ha nulla su cui
agire. Ma attenzione: la riga **11366–11370** parla di «their weapon, Equipment or **Special
Skill**», e si applica in pieno alla **seconda metà**: nell'Attacco BS lo Spearhead usa **metà
del Burst arrotondata per eccesso**, tutti gli altri **1**. È lì che il calcolo cambia, non nello
Scoprire.

**Se il Marker reagisce** (riga 11371–11373: sceglie **uno** solo degli attivi come bersaglio):
- **si rivela per tutti**, perché la cancellazione è sul Marker, e *qualunque* ARO la innesca —
  tutti e quattro gli ARO ammessi contro un Marker richiedono un tiro, e la riga **13634**
  cancella il CAMO per «any Skill that requires a Roll»;
- **nessuno tira lo Scoprire** (righe 6822–6823);
- il tipo di tiro dei quattro Attacchi dipende da **che cosa** ha dichiarato, non da chi ha
  scelto: vedi la tabella in **§1.12 lettera E**. In breve: con una **Schivata** è un solo
  Faccia a Faccia contro tutti e quattro (righe 7258–7263); con un **BS Attack** è Faccia a
  Faccia col solo bersagliato e Normale per gli altri tre.

**Chi fallisce resta fuori.** Riga **6845–6846**: ogni truppa che fallisce il tiro non può
ritentare **quel** Marker fino al Turno di Giocatore successivo. In un Coordinato a 4 tirano
tutte e quattro, quindi un Marker sopravvissuto brucia il tentativo a tutte e quattro per il
turno. È il prezzo della manovra.

**Chi non ha i requisiti fa Idle da solo.** Riga **11374–11376**: «If any of the Troopers does
not meet the Requirements of a Skill declared during the Coordinated Order, they perform an Idle
instead, **while the others may act normally**». Una partecipante senza LoF al Marker fa Idle e
non trascina le altre.

### H. Trappole
- Fallito: niente nuovo tentativo **di quella truppa su quel Marker** fino al prossimo Turno di
  Giocatore; un'altra truppa può provarci, e tu puoi provare su un altro Marker.
- Una truppa rivelata che **rientra** in Camuffato conta come Marker **nuovo**.

### I. Controllo dell'app
Voci attese: `gittata` (bande SCOPRIRE `[3,0,0,0,-3,-3,-6…]` ✅ corrette nel DB), `copertura`,
`mimetismo`, `fireteam +3`, `tinbot`.

---

## 1.8 SUPPORTO (Dottore · Ingegnere · MediKit · GizmoKit)
### A. Identità
`ordine_supporto.js` · azioni `'SUPPORTO_WIP'` (Dottore, Ingegnere) e `'SUPPORTO_BS'` (MediKit,
GizmoKit a distanza) · tutte **Abilità Brevi** · bersagli **alleati** · **nessuna salvezza** per il
bersaglio. Il punto da controllare subito: **chi tira** cambia da uno strumento all'altro.

| Strumento | Chi tira | Su cosa | Bersaglio | Se il tiro fallisce |
|---|---|---|---|---|
| **Dottore** | il Dottore | WIP, Tiro Normale | alleato **VITA** in Incosciente, a contatto | il bersaglio entra in **MORTO** |
| **Ingegnere** (ferite) | l'Ingegnere | WIP, Tiro Normale | alleato **STR**, a contatto | il bersaglio **riceve 1 Ferita** |
| **Ingegnere** (stati) | l'Ingegnere | WIP, Tiro Normale | alleato a contatto: cancella **tutti** gli stati cancellabili tranne Incosciente (IMM-A/B, Bersagliato, Isolato…) | **nessuna conseguenza**, si riprova |
| **MediKit a distanza** | 1) l'utente: tiro **BS**, 2) il bersaglio: tiro **PH** | BS poi PH | alleato VITA Incosciente, **LoF** | BS fallito: niente · PH fallito: **MORTO** |
| **MediKit a contatto** | solo il bersaglio: **PH** | PH | idem, a contatto | PH fallito: **MORTO** |
| **GizmoKit a distanza** | 1) utente **BS**, 2) bersaglio **PH** | BS poi PH | alleato **STR**, LoF | PH fallito: **riceve 1 Ferita** |
| **GizmoKit a contatto** | solo il bersaglio: **PH** | PH | alleato STR, a contatto | PH fallito: **1 Ferita** |

### B. Requisiti
- Dottore/Ingegnere/Kit a contatto: **contatto di Silhouette**
- Kit a distanza: **LoF** ed entro gittata (bande **+3 a 0–8" · 0 a 8–16" · −6 a 16–24"**)
- **Vietato** curare un alleato in contatto con un nemico (Engaged): lì si possono dichiarare solo CC Attack, Schivata e skill da CC
- Attivo: IMM-A/IMM-B ❌ · Stordito ✅ con −3 · Isolato ✅ (non sono skill Comms) · Retreat! ❌ (non sono Basic Short Skill)

> ⚠️ **MediKit e GizmoKit non sono armi d'attacco e non sono AROs.** Il bersaglio
> **alleato** è un REQUIREMENTS (righe **10896–10897** per il MediKit, **10795–10796** per il
> GizmoKit): puntarli su un nemico non è un Attacco BS a MOD peggiori, è un'azione illegale
> (§0, righe 1236–1247 → **Idle**, Ordine speso). E nel chart ufficiale stanno nella colonna
> **SHORT SKILLS** (16650 e 16649), **non** in **AROS**: solo Turno Attivo. Che il catalogo le
> metta in `weapon` anziché in `equip` non cambia nulla. Stessa famiglia del **Deactivator**
> (§1.16 e §7.1): vedi la tabella «Equipaggiamenti che SONO armi BS ma hanno il bersaglio
> vincolato» in **§7.1**.

### C. Formule
- Dottore / Ingegnere: `SV = WIP ± stati propri (Stordito −3)`
- MediKit/GizmoKit a distanza, **tiro 1**: `SV = BS + Gittata − Copertura del bersaglio + Fireteam L4 +1 (+1 SD da L2)`
- MediKit/GizmoKit, **tiro 2** (del bersaglio): `SV = PH del bersaglio` (GizmoKit: se il profilo del bersaglio dice `GizmoKit (PH=X)`, usa **X**)

### D. Voce per voce
| Voce | Dottore/Ing. (WIP) | Kit, tiro BS | Kit, tiro PH del bersaglio |
|---|---|---|---|
| Gittata | ❌ | ✅ bande del Kit | ❌ |
| Copertura Parziale del bersaglio | ❌ | ✅ −3 | ❌ |
| Mimetismo del bersaglio | ❌ | ⚠️ è alleato: non si applica in pratica | ❌ |
| Fireteam L4 +1, L2 +1 SD | ❌ | ✅ (esplicito: "vale per MediKit e GizmoKit usati come BS Weapon") | ❌ |
| Stordito di chi tira | ✅ −3 | ✅ −3 | ✅ −3 se il bersaglio è Stordito |
| `Doctor (ReRoll −X)` / `Engineer (ReRoll −X)` | ✅ un ritiro per ordine con −X | ❌ | ❌ |
| `Doctor (2W)` | toglie 2 Ferite | ❌ | ❌ |
| Surprise Attack / Bersagliato | ❌ | ❌ | ❌ |

### E. Reazioni
Nessun Faccia a Faccia sul tiro di cura. Il nemico reagisce **contro chi cura**, con i normali ARO
(vedi scheda dell'attacco che dichiara). Se il curante muore o va in stato Null prima della
risoluzione, la cura non avviene.

### H. Trappole
- Più colpi di MediKit/GizmoKit nello stesso ordine: basta **un** PH riuscito, ma si toglie
  comunque **una sola** Ferita.
- Presenza Remota: Ingegnere/GizmoKit riuscito toglie tutte le Ferite necessarie a uscire
  dall'Incosciente, qualunque livello.
- Il ritiro con Command Token (uso operativo) **non** applica il −X del ReRoll.

### I. Controllo dell'app
L'app deve dire **prima del tiro** chi tira (README: già previsto).
🔴 `MAPPA_REGOLE_N5.md` dice che il Dottore fallito dà "1 Ferita" e il MediKit fallito "riceve 1 Ferita": il regolamento dice **Morto** in entrambi i casi (la Ferita vale per Ingegnere e GizmoKit). Controllare che il modulo segua il regolamento e non la MAPPA.

---

## 1.9 DIFESA (Schivata · Reset dichiarati come ordine)
### A. Identità
`ordine_difesa.js` · azioni `'SCHIVATA'` (PH) e `'RESET'` (WIP) · **Abilità Brevi / ARO**,
qui usate dall'**attivo** · Burst non conta: un tiro evita tutti gli attacchi dell'ordine.

### B. Quando si usano da attivo
- **Schivata**: per muoversi di 2" in sicurezza, per uscire dall'Engaged, o per difendersi dagli
  ARO nemici durante l'ordine. **È l'unica cosa che può fare un IMM-A**, e una Schivata riuscita (Normale o F2F, a PH−6)
  **cancella l'IMM-A**.
- **Reset**: per **cancellare Bersagliato e IMM-B** con un Tiro Normale, o per difendersi da
  hacking/Guidato in ARO. **È l'unica cosa che può fare un IMM-B.**

### C. Formula
Schivata: `SV = PH + MOD sotto` · Reset: `SV = WIP + MOD sotto` → ±12 → SV<1 fallisce.
**Tiro Normale** se nessun ARO nemico la contrasta; **Faccia a Faccia** se un reattivo attacca
l'attivo con qualcosa che quella difesa può evitare (Schivata: BS/CC/Sagome; Reset: Comms e Guidato).

### D–E. Voce per voce
> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

**SCHIVATA (tiro PH)** — evita **tutti** gli attacchi dell'ordine, qualunque sia il Burst

| Voce | MOD al PH | Si somma? |
|---|---|---|
| Senza LoF verso l'attaccante · Sagoma senza LoF · Sagoma di un'arma **Deployable** · in ARO, attivo dentro la ZdC e fuori LoF | **−3** | ✅ ma **uno solo**: anche se più circostanze valgono insieme, il MOD resta −3 (righe 7294–7299) |
| Immobilizzato-A | **−6** | ✅ (e l'IMM-A può fare **solo** questo) |
| Stordito | **−3** (ogni tiro tranne le salvezze) | ✅ |
| Surprise Attack dell'attaccante (partiva da Marker/Hidden) | −3 / −6 dal profilo | ✅ **solo nel Faccia a Faccia** (N5.2, adottata); se `(CC-6)` solo sul CC, non sulla Schivata |
| Alleato allertato da **Look Out!** | Schivata a **PH−3** | ✅ |
| Fireteam Livello 3 | **+1** | ✅ |
| `Dodge (+N)` / `Dodge (PH+N)` del proprio profilo | +N | ✅ |
| `Dodge (-N)` del proprio profilo | −N **all'attaccante** nel F2F | ✅ (lato attaccante) |
| `Dodge (+1")` | movimento extra | ❌ non tocca il tiro |
| `Dodge (ARM +3)` | +3 ARM alla salvezza **se fallisci** | ❌ non tocca il tiro |
| Immobilizzato-B | — | ❌ **non può Schivare** |
| Bersagliato | — | ❌ il suo −3 vale sul Reset, non qui |
| Isolato | — | ❌ il suo −9 vale sul Reset, non qui |
| Copertura, gittata, Mimetismo | — | ❌ non esistono sul tiro di Schivata |

Riuscita: movimento fino a **2"** nella fase Effetti (non genera ARO, non attiva Deployable,
può entrare in Engaged). Una Schivata riuscita **cancella anche l'IMM-A**.

**RESET (tiro WIP)** — Faccia a Faccia **solo** contro un Attacco Comms o un BS Attack (Guided). Contro qualsiasi
altro attacco è un Tiro Normale che **non** evita nulla (serve a cancellare Bersagliato/IMM-B).

| Voce | MOD al WIP | Si somma? |
|---|---|---|
| Bersagliato | **−3** | ✅ se il reattivo è Bersagliato |
| Immobilizzato-B | **−3** | ✅ (e l'IMM-B può fare **solo** questo) |
| Isolato | **−9** | ✅ |
| Stordito | **−3** | ✅ |
| Surprise Attack dell'attaccante | −3 / −6 | ✅ **solo nel Faccia a Faccia** (N5.2, adottata) |
| Immobilizzato-A | — | ❌ **non può Resettare** |
| Firewall proprio | — | ❌ penalizza chi hackera, non aiuta il tuo Reset |
| Fireteam | — | ❌ nessun bonus al Reset |
| Senza LoF verso l'attaccante | — | ❌ il −3 senza LoF è della Schivata, non del Reset |

Un Reset riuscito (Normale o F2F) **cancella Bersagliato e IMM-B**.

> **Sesto Senso** (anche quello dato dal Fireteam di Livello 5): se il reattivo dichiara
> **Schivata o Reset** non applica **nessun MOD negativo**, tranne tre: **IMM-A −6 PH**,
> **IMM-B −3 WIP**, **Isolato −9 WIP**. Permette anche di reagire ad attacchi da fuori LoF
> (arco 360°) e ignora il −6 della Pessima Visibilità se gli si spara attraverso una Zona di
> Visibilità Zero. Sugli **attacchi in ARO** del Sesto Senso i MOD negativi restano.

### F. Esempi di somma (attivo che si difende)
- Bersagliato che Resetta per togliersi il Bersagliato: **WIP −3**
- IMM-B che Resetta: **WIP −3**; IMM-B + Bersagliato: **−6**; + Isolato: −15 → **−12**
- IMM-A che Schiva un ARO che gli spara dal fianco senza LoF: **PH −3 −6 = −9**
- Stordito che Schiva: **PH −3**; Stordito + IMM-A: **−9**
- Con Sesto Senso: restano solo IMM-A −6 / IMM-B −3 / Isolato −9

### I. Controllo dell'app
Voci attese: `stato` (una voce per ogni stato), `fireteam +1` (Schivata, Livello 3), `profilo` (Dodge +N).
🔴 SV<1 portato a 1 invece di fallire · 🔴 `M.modReset` senza tetto −12 (§10).

---

## 1.10 FUOCO DI SOPPRESSIONE
### A. Identità
`ordine_*` (azione `'SOPPRESSIONE'`) · **Long Skill** · etichetta *Attack* · **nessun tiro alla
dichiarazione**: la truppa entra nello **Stato Fuoco di Soppressione** con l'arma scelta.

### B. Requisiti
Arma con **Tratto Suppressive Fire**. Attivo: IMM ❌, Stordito ❌, Engaged ❌, Isolato ✅, Retreat! ❌.

### C. Cosa cambia finché dura lo stato
**Profilo SF Mode** (sostituisce quello dell'arma, cambia **solo** gittata e Burst):

| 0–16" | 16–24" | oltre | Burst | PS, munizione, salvezze |
|---|---|---|---|---|
| **0** | **−3** | fuori gittata ⚠️ | **3 anche in ARO** | quelli dell'arma originale |

- In ARO spara **B3 pieno**, tutto contro **un solo** bersaglio (anche contro un Coordinato: non si divide).
- **Ogni nemico entro 0–24"** applica **−3** in **tutti i Faccia a Faccia** contro la truppa in Soppressione.

### D. Quando la truppa in Soppressione spara in ARO — voce per voce
| Voce | MOD | Si applica? |
|---|---|---|
| Gittata SF Mode | 0 / −3 | ✅ (non quella dell'arma) |
| Copertura, Mimetismo, Visibilità dell'attivo | −3 / −3/−6 / … | ✅ |
| Attivo Bersagliato | +3 | ✅ |
| Fireteam | — | ❌ entrare in Fireteam **cancella** lo stato |
| **Il nemico attivo entro 24"** | **−3 sul suo tiro** | ✅ solo nel F2F |

### E. Quando si cancella da solo
Dichiara un ordine · dichiara un ARO diverso da BS Attack in SF Mode · usa un'arma senza il Tratto ·
fallisce un Guts · entra in Engaged, Isolato, Retreat!, qualsiasi Null o Immobilizzato · Perdita del
Tenente · entra in un Fireteam.

### I. Controllo dell'app
Voci attese sul tiro dell'attivo che affronta la truppa in Soppressione: `soppressione −3` **solo se
F2F e entro 24"**. Sul tiro della truppa in Soppressione: gittata SF Mode, Burst 3.

---

## 1.11 MOVIMENTO (Move · Movimento Cauto · Climb · Jump)
### A. Identità
`ordine_movimento.js` · **nessun tiro** · genera ARO.

| Skill | Tipo | Tiro | Genera ARO | Note |
|---|---|---|---|---|
| Move | Basic Short Skill | no | sì, in qualunque punto del percorso | MOV 1° valore, 2° valore col secondo Move |
| Movimento Cauto | Basic Short Skill | no | no, se inizia e finisce fuori da LoF/ZdC nemiche (e fuori dalle Hacking Area, se Hackerabile) | **vietato** a TAG, REM, VH, Motociclette, Aerial, **Bersagliati** |
| Climb | Long Skill | no | sì | 1° MOV + 2" su superfici verticali |
| Jump | Short Skill | no ⚠️ | sì | cancella il Prono |

- **Retreat!** consente Basic Short Skill e Movimento Cauto: il Move sì.
- **IMM-A / IMM-B**: non si muove. **Engaged**: il Move non basta per uscire, serve una Schivata riuscita.
- **Foxhole**: posizione fissa, va cancellato all'inizio del movimento (torna MOV e Silhouette).
- **N5.3**: finito il movimento, la truppa può voltarsi in qualsiasi direzione; basta metà base sulla superficie.
- Una volta dichiarato, il movimento **arriva sempre a destinazione** anche se la truppa entra in Null/IMM lungo la strada.

### I. Controllo dell'app
Nessun calcolo: l'app deve solo generare la finestra ARO e rispettare i divieti di stato (Bersagliato → niente Cauto).

---

## 1.12 ORDINE COORDINATO
### A. Identità
`ordine_coordinato.js` · costa **un Ordine Regolare per partecipante + un Command Token** · fino a
**4** truppe, stesso Training (Regolare/Irregolare) e stesso Gruppo di Combattimento · una è lo **Spearhead**.

### B. Requisiti
- Tutti dichiarano **la stessa sequenza di skill**; se c'è un bersaglio, **lo stesso bersaglio**
- Chi non soddisfa i requisiti fa **Idle**, gli altri agiscono
- **Non ammessi**: Attacco Speculativo e Intuitivo, Periferiche e Controller, membri di un Fireteam, Isolati, Decoy

### C. Burst — la parte che l'app deve calcolare
| Chi | Burst in BS Attack |
|---|---|
| Spearhead | **metà del Burst, arrotondata per eccesso**, bonus inclusi (B3 → 2, B4 → 2, B5 → 3) |
| Tutti gli altri | **1** |

CC Attack coordinato: attacca **solo lo Spearhead**, con **+1 B per ogni alleato** in contatto col
bersaglio (N5.3: la regola vale già con 2 truppe in contatto).

### D. Voce per voce (ogni partecipante tira **con i propri** MOD)
| Voce | Si applica? |
|---|---|
| Gittata, Copertura, Mimetismo, Visibilità — **misurati da ciascuno** | ✅ individuali |
| Bersagliato +3 | ✅ per tutti |
| Fireteam (L2 +1 SD, L4 +1 BS) | ❌ nessuno è in Fireteam |
| `(+1B)` del profilo | ✅ prima del dimezzamento dello Spearhead ⚠️ ("inclusi i bonus") |

### E. Reazioni
Ogni reattivo sceglie **un solo** bersaglio fra le truppe attivate, e non sono obbligati a scegliere
lo stesso (righe **11371–11373**). Le tabelle di Schivata/Reset/ARO sono quelle dell'ordine
coordinato dichiarato (BS: §1.1). La truppa in Fuoco di Soppressione spara B3 tutto su **uno**
degli attivi.

> 🔴 **"Un solo bersaglio" NON vuol dire "un solo Faccia a Faccia".** Dipende da che cosa
> dichiara il reattivo, e la Schivata è il caso che rompe la regola:
>
> | ARO del reattivo | Com'è il tiro dei 4 attaccanti |
> |---|---|
> | **Schivata** | **un solo tiro PH in Faccia a Faccia contro TUTTI e quattro gli attacchi.** Righe **7258–7263**: «Allows the user to make a Face to Face Roll to evade **all enemy Attacks during an Order or ARO, regardless of the Burst (B) value** (for example, Dodging every strike in Close Combat, **or shots from several opponents**)». «Shots from several opponents» è esattamente l'Ordine Coordinato. Confermato dalla riga **11405–11406**: «his Roll is Face to Face against attacking **Rolls** as appropriate», al plurale. Nessun Tiro Normale |
> | **BS Attack / CC Attack** | sceglie **uno** degli attivi (11371–11373): contro quello è Faccia a Faccia, gli altri tre tirano **Normale** |
> | **Reset** | il Reset evita solo gli Attacchi Comms (riga 7269). Contro attacchi BS non li influenza → i quattro tirano **Normale**. È il senso di «as appropriate» alla riga 11406 |
> | **Scoprire / Look Out!** | non influenzano l'attacco → tutti e quattro **Normale** (righe 2068–2070) |
>
> La differenza non è di stile: con una Schivata il difensore ha **un** tiro contro quattro, e i
> suoi successi si confrontano con tutti; con un BS Attack in ARO tre attaccanti su quattro
> tirano senza opposizione.

### F. Una truppa, un successo: il principio del bersaglio comune
Riga **11357–11359**: «If one of the Skills of the Coordinated Order demands a Trooper, a
Marker, or a mission objective as a target, **all Troopers must act against the same single
target**».

E quando il bersaglio è comune e l'effetto è binario, vale la riga **11427–11429**, sezione
*COORDINATED ORDER: SUCCESS + FAILURE*:

> «If the participants of a Coordinated Order declare the use of a Skill or Equipment **such as**
> Doctor, MediKit or Engineer **on a common target, any successful Roll means that the Skill was
> successful**.»

«Such as» apre la categoria: non è un elenco chiuso di tre voci, è il principio del bersaglio
comune. Serve per lo **Scoprire coordinato**, §1.7 lettera F.

> **Come si sommano gli stati (vale per ogni tiro di questa scheda).**
> Stati che toccano lo stesso attributo **si sommano** (regolamento, righe 1921 e 13594
> del .txt). Poi il totale dei MOD si **tronca a ±12**. Se il SV finale è **sotto 1 è
> fallimento automatico**, non si tira. Prima di sommare, controlla che lo stato **consenta**
> la reazione: IMM-A consente solo la Schivata, IMM-B solo il Reset, lo Stordito vieta gli
> Attacchi, l'Engaged consente solo Berserk/CC Attack/Schivata/Idle/Reset.

### I. Controllo dell'app
Verificare il Burst dello Spearhead (metà per eccesso) e B1 per gli altri. Command Token e Coerenza
non sono verificabili dall'app: `M.validaCoordinato()` li restituisce come promemoria.

---

## 1.13 OSSERVAZIONE (Forward Observer · Sensor · Triangulated Fire)
Tre skill diverse in tutto: tipo, attributo, LoF, MOD.

### 1.13.a FORWARD OBSERVER
**Abilità Breve / ARO** · etichetta *BS Attack* · è un attacco con arma **BS Weapon (WIP)** · **serve LoF** ·
Burst **2** in Attivo, **1** in ARO · niente salvezza: il bersaglio colpito entra in **Bersagliato**.

Gittata: **0 a 0–24" · −3 a 24–48" · −6 a 48–96"** (dal DB; la terza banda non è leggibile nel .txt ⚠️).

`SV = WIP + Gittata − Copertura − Mimetismo − Visibilità + Fireteam L4 (+1) [+1 SD L2]` → ±12

| Voce | Si applica? |
|---|---|
| Gittata, Copertura, Mimetismo, Visibilità | ✅ (le armi BS Weapon (WIP) prendono **tutti** i MOD del BS Attack sul WIP) |
| Fireteam L4 +1 | ✅ (esplicito per armi BS Weapon (WIP)) |
| Fireteam L2 +1 SD | ✅ (FAQ: le skill con etichetta BS Attack contano come BS Attack) |
| Bersagliato +3 | ✅ se il bersaglio lo è già (caso raro) |
| Stordito | lo Stordito non può attaccare |

Reazioni: come l'Attacco BS (§1.1) — Schivata (PH, −3 senza LoF, IMM-A −6, Stordito −3, FT L3 +1),
Attacco in ARO. **Il Reset non lo evita** (non è Comms né Guidato).

### 1.13.b SENSOR
**Abilità Breve** · etichetta *Attack, Zone of Control* · **nessuna LoF, nessun bersaglio designato** ·
Tiro **Normale WIP+6** che Scopre **tutti** i Marker CAMO e Hidden Deployment nella propria ZdC.

| Voce | Si applica? |
|---|---|
| +6 fisso | ✅ |
| Gittata | ❌ |
| Mimetismo | ❌ (esplicito) |
| Copertura / Visibilità | ❌ (non c'è LoF) |
| Stordito | ✅ −3 |
| Fireteam L3 +3 Discover | ⚠️ non è una dichiarazione di Discover: di norma ❌ |

Bonus passivo: chi ha Sensor ha **+6 al WIP quando dichiara Discover** contro Marker CAMO, e i nemici
non possono tornare Camuffati nella sua ZdC.

Chi viene Scoperto dal Sensor è **rivelato**: il Marker CAMO è sostituito dal Modello, e chi era in
Hidden Deployment esce dallo stato e va sul tavolo **come Modello** (la lista che permette di restare
Marker riguarda solo ciò che la truppa *dichiara*, righe 13914–13921).

### 1.13.c TRIANGULATED FIRE
**Ordine Intero (Long Skill)** · etichetta *Attack* · **serve LoF** · BS Attack **senza nessun MOD al tiro**.

| Voce | Si applica? |
|---|---|
| Gittata, Copertura, Mimetismo, Visibilità, Bersagliato, Fireteam +1 | ❌ **nessuno** |
| MOD al **Burst** | ✅ unica eccezione |
| `+1 SD` | ❌ Long Skill |
| Gittata massima dell'arma | ✅ come **limite**: oltre non si colpisce |

Reazioni del bersaglio: normali (Schivata/Attacco, §1.1) e **il bersaglio applica i propri MOD** al suo tiro.

### I. Controllo dell'app
FO: voci come un BS Attack sul WIP. Sensor: solo `+6`. Triangulated: **zero** voci al tiro.

---

## 1.14 PIAZZARE EQUIPAGGIAMENTO (Place Deployable)
`ordine_piazzamento.js` · azione `'PIAZZARE EQUIPAGGIAMENTO'` · **SHORT SKILL / ARO**
(riga 7550) con etichetta *Attack* (riga 7551) · **nessun tiro**, nessun bersaglio.

- 🔴 **È una Short Skill, quindi è sempre la SECONDA metà dell'Ordine**, mai la prima. Le sole
  combinazioni esistenti sono `Basic Short + Basic Short`, `Basic Short + Short` e `Long`, e
  vanno dichiarate **nell'ordine mostrato** (righe **1047–1054**, «always declared in the order
  shown»). Le tre combinazioni possibili sono quindi:
  **Movimento + Piazzare**, **Scoprire + Piazzare**, **Idle + Piazzare**.
  Una truppa che "piazza e basta" sta dichiarando *Idle + Piazzare*: chi non agisce con una
  delle due metà «is considered to declare Idle» (righe 7454–7456). Non esiste `Piazzare +
  qualcosa`, perché `Short + Basic Short` non è fra le combinazioni.
- L'etichetta *Attack* ha due conseguenze che non riguardano il piazzamento in sé: lo
  **Stordito** non può dichiararlo (riga 14614, vietati gli Attacchi), e un **Marker CAMO** che
  lo dichiara **si rivela** (riga 13634, «declares an Attack»).
- Attivo: il token si piazza a contatto di Silhouette, o in qualunque punto del percorso se si è mosso.
  Reattivo: **serve LoF verso l'attivo** e si piazza a contatto.
- Il token compare nella **Conclusione** dell'ordine: il nemico reagisce **a chi piazza**, mai al deployable.
- **Vietato** piazzare un'arma Deployable con un Marker CAMO nemico nella sua Trigger Area → serve un
  **Attacco Intuitivo** (tiro WIP non modificato, §1.3); fallendo non si piazza e il Disposable perde un uso
  (righe 7572–7573 e 4044–4053).
- Il Disco Ball nasce dall'esito del tiro del Disco Baller (Fuoco Speculativo), non da qui.

> 🔴 **SCOPRIRE + PIAZZARE: due abilità indipendenti, con un unico punto di contatto.**
>
> Lo Scoprire è Basic Short, il Piazzamento è Short: è la combinazione `Basic Short + Short`
> (righe 1047–1054), e le due metà **non si condizionano**. Il Piazzamento non è un Attacco
> *contro* il Marker, quindi non c'è la dipendenza della manovra *Discover + Attack*
> (§1.7 lettera F): lo Scoprire si tira come se fosse da solo, e il token si piazza comunque.
>
> **L'unico punto di contatto è la Trigger Area, e qui il tempo conta.** Due righe:
> - riga **7563**: «The Token… is placed **at the Conclusion of the Order**».
> - riga **7572**: «A Deployable Weapon **cannot be placed** if there is an enemy Camouflage
>   Marker inside its Trigger Area. **This restriction does not apply if there is a valid,
>   non-camouflaged enemy inside the Trigger Area**, or an Intuitive Attack was made.»
>
> Lo Scoprire si risolve al passo **5 (Risoluzione)**, il piazzamento alla **Conclusione**, che
> è il passo **5.2** (righe 1219–1223). Quindi lo Scoprire arriva **prima**. Conseguenza:
>
> | Lo Scoprire riesce sul Marker che era nella Trigger Area | Il Marker è già stato sostituito dal Modello (righe 6842–6844): nella Trigger Area c'è ora «a valid, non-camouflaged enemy», e la restrizione della riga 7572 **non si applica più**. Il token **si piazza** |
> |---|---|
> | Lo Scoprire **fallisce** | alla Conclusione il Marker CAMO è ancora lì: il token **non si piazza**. L'Ordine è speso, e un uso Disposable dichiarato si consuma (⚠️ LETTURA per questa via: la riga 4051–4053 lo scrive per la via dell'Intuitivo, non per questa) |
> | Il Marker nella Trigger Area è un **altro** Marker, diverso da quello scoperto | lo Scoprire non c'entra: la restrizione resta, e serve l'Intuitivo |
>
> ⚠️ **LETTURA**, e il gancio testuale è il verbo: la riga 7572 dice «cannot be **placed**», e il
> piazzamento avviene alla Conclusione (7563). La lettura contraria — la restrizione si valuta
> alla **dichiarazione**, quando il giocatore indica il punto — è difendibile, perché la riga non
> dice quando si controlla, e perché i vincoli di piazzamento di solito agiscono sulla scelta del
> punto (è il criterio del Combat Jump, §0). Ma qui il giocatore alla dichiarazione **non può
> sapere** l'esito dello Scoprire, quindi valutare allora significherebbe vietare sempre una
> combinazione che il regolamento non vieta.
- **Minelayer**: piazza allo schieramento una sua arma o equip Deployable nella propria ZdC, scalando un uso Disposable. Requisito: **niente truppe né Marker nemici** nella Trigger Area dell'oggetto, **o nella ZdC se è un'arma Perimeter**. Se l'utente si schiera con una skill Superior Deployment e **fallisce** il tiro (Infiltration, Combat Jump), **perde anche il Deployable**, e l'uso resta speso.

### I. Controllo dell'app
Nessun calcolo, salvo il caso CAMO nella Trigger Area → deve passare dall'Intuitivo.

---

## 1.15 TRINCERARSI (Sapper → Stato Foxhole)
`ordine_trincerarsi.js` · azione `'TRINCERARSI'` · **Long Skill** · **nessun tiro**.

- Requisito verificabile solo al tavolo: lo spazio deve essere alto e largo almeno quanto la Silhouette
  del Foxhole (S3). Se non c'è, la truppa fa **Idle**: l'ordine è speso comunque.
- **Effetti del Foxhole, che cambiano i calcoli di chi gli spara:**

| Effetto | Conseguenza sul calcolo |
|---|---|
| Copertura Parziale a 360° | chi gli spara **−3**; lui **+3** alla salvezza (valgono le eccezioni di Marksmanship) |
| Mimetism (−3) | chi gli spara con LoF o lo Scopre: **−3** (MSV L1 lo annulla) |
| Courage | passa automaticamente i Guts |
| Silhouette 3 | — |
| Posizione fissa | nessun movimento; per muoversi o Schivare va cancellato all'inizio del movimento ⚠️ |

Si cancella entrando in Prono (riga 13870) o annunciandolo **alla dichiarazione** di una skill
con etichetta Movimento, o all'inizio di una Schivata, **solo in Turno Attivo** (righe
13871–13874). Il Foxhole **non vieta nessuna dichiarazione**: vieta di *muoversi* (riga 13867).
Da Trincerato si spara, si hackera e si schiva senza cancellare niente; per muoversi si
cancella e si perde tutto quello che dava. Dettaglio completo e lista per stato in **§7.1**.

---

## 1.16 SCENOGRAFIA (Interagire con un Obiettivo · Deactivator)
`ordine_scenografia.js`

| | Interagire Obiettivo | Deactivator |
|---|---|---|
| Tipo | secondo la Regola di Scenario | **Abilità Breve**, etichetta *Attack* |
| Attributo | **WIP**, Tiro Normale | **WIP**, Tiro Normale (arma BS Weapon (WIP)) |
| Contatto / LoF | **contatto di Silhouette** | bersaglio in **LoF o nella ZdC**: niente contatto |
| Gittata | nessuna | **+6 a 0–8" · +3 a 8–16" · −6 a 16–24"** |
| Bersagli | scenografia con Tratto Objective | **solo Deployable nemici** già piazzati (mine, Repeater, **Armed Turret**…), **mai** Marker CAMO |
| Nota | — | passare il tiro **non impedisce** al Deployable di scattare nell'Ordine in corso: lo rimuove dopo (wiki *Deactivator*, N5.3) |
| MOD | quelli dello scenario (spesso bonus agli Specialisti) | **solo gittata** (il testo esclude i MOD di skill e il resto) |
| Reazioni | normali contro chi agisce | normali contro chi agisce |

---

## 1.17 LOGISTICA (Ingresso in campo · Request Speedball)
`ordine_logistica.js`

| | Ingresso in campo (Combat Jump, Infiltration…) | Request Speedball |
|---|---|---|
| Tiro | **PH**, Tiro Normale | **PH 14 fisso** per ciascun token (non il PH della truppa) |
| MOD | Infiltration nella metà nemica: **PH−3**; `Combat Jump (PH=X)`, `Infiltration (PH=X)`: usa X | nessuno |
| Fallito | **entri lo stesso**: nella tua Zona di Schieramento a contatto col bordo, come Modello, **senza** i Deployable | il token si piazza come per un Combat Jump fallito ⚠️ |
| Restrizione | nell'ordine del Combat Jump **niente Copertura Parziale** | servono 2 token Speedball |
| Combat Jump (Explosion) | Sagoma Circolare centrata sulla base, **PS 8, munizione N, ARM** | — |

Contenuti Speedball: VitaPack (cancella Incosciente VITA), AutoRepairS (idem STR), Switch On (cancella
IMM-A/B, Isolato, Stordito), Jetpack, Overkill… uso singolo, uno per truppa.

---

## 1.18 ENTRARE IN FORMA DI MARKER (Rientro CAMO · Cybermask · Rientro Impersonation)
`ordine_rientro_camo.js` · azioni `'RIENTRARE IN CAMO'` e `'CYBERMASK'` ·
tutte **Long Skill**, **nessun tiro**, **nessun bersaglio**.

### A. Identità
| | Rientro CAMO | Cybermask | Rientro Impersonation |
|---|---|---|---|
| Fonte | riga **13603** (Camouflaged State, ACTIVATION) | righe **5150–5171** (programma di Hacking) | riga **14202** (Impersonation State, ACTIVATION) |
| Chi | chi ha la skill **Camouflage** ed è stato rivelato | un **Hacker** con Hacking Device o Killer (riga 5058) | chi ha la skill **Impersonation** |
| Esito | Marker **CAMO** | Marker **IMP-2** (riga 5159) | Marker **IMP-1** o **IMP-2**, vedi D |
| Etichette | — | **NFB**, No Roll (riga 5153) | — |

### B. Requisito — è lo stesso per tutte tre
> «**outside the LoF of enemy Markers or Troopers**» (13603 · 5156 · 14202).

Tre cose che il testo dice e che si sbagliano facilmente:
- Conta la LoF dei **Marker** nemici, non solo dei Modelli. Un Marker CAMO nemico che ti
  vede blocca il rientro.
- **Hidden Deployment non conta**: non è né Modello né Marker (riga 14307). Ma se si
  rivela come ARO, il requisito cade nella Risoluzione → vedi C.
- Non c'è nessun limite di distanza né di copertura: solo la LoF.

### C. 🔴 Requisito fallito = **IDLE**, l'Ordine è speso
Regola generale, righe **1240–1247**: solo Alert!, le Basic Short Skill, Jump e Climb
verificano i requisiti alla dichiarazione; **tutte le altre skill alla Risoluzione**, e
«the action is cancelled and the Trooper instead performs an **Idle**». Queste tre sono
Long Skill, quindi cadono nel secondo gruppo.

Il regolamento lo mostra in chiaro nell'esempio di pagina 164 (righe **14298–14316**):
un nemico in Hidden Deployment si rivela come ARO, l'Ordine «cannot be carried out if it
fails to comply with its **Requirements**» e l'attivo «**lose his Order** as it becomes
illegal». Due conseguenze:
1. La condizione di LoF del 13603/14202 **è un Requisito**, anche se è stampata sotto
   ACTIVATION e non sotto REQUIREMENTS. La distinzione tipografica non regge.
2. L'Ordine **è speso**. Non si torna indietro a dichiarare altro.

⚠️ **Correzione**: questo capovolge quanto la chat REGOLE aveva scritto il 5 ottobre
(«rientro CAMO = VIETA perché è una condizione di attivazione, non un requisito»).
Sbagliato: è un requisito, e fa Idle come il Cybermask.

### D. Cybermask dichiarato da un Marker CAMO — ammesso
Nessuna regola lo vieta, ma il prezzo è che **ti riveli**:
1. Si dichiara il Cybermask (Long Skill).
2. Il CAMO cade subito, riga **13635** («declares a Long Skill of any kind, other than
   Cautious Movement»), e la cancellazione vale per **tutto l'Ordine** anche se la skill
   è l'ultima (righe 13645–13648). Il Marker è sostituito dal Modello e si dà
   l'Informazione Pubblica completa (righe 13640–13641).
3. Gli ARO si dichiarano **contro un Modello**: BS Attack, CC, Hacking, tutto, non le sole
   quattro reazioni ammesse contro un Marker (riga 13621).
4. Nella Risoluzione l'Hacker entra in **IMP-2** (righe 5159–5161).

Cosa si guadagna e cosa si perde: in IMP-2 il nemico non può dichiarargli un **Attacco
Intuitivo** (riga 14210) — il CAMO sì —; ma per **NFB** (righe 5167–5171 · 6677–6679) il
Marker IMP-2 **non porta il Mimetismo**, quindi niente −3 su Scoprire e sugli attacchi.
Il Marker CAMO invece lo mostra (riga 13607).

### E. A che livello si rientra in Impersonation
Lo decide la **notazione del profilo**, non lo Stato:
| Notazione nel profilo | Schieramento | Rientro in Turno Attivo |
|---|---|---|
| `Impersonation` | IMP-1 (riga 8667) | **IMP-1** |
| `Impersonation (IMP-2)` | IMP-2 | **IMP-2** |

La riga **8669** scrive «may only deploy **and activate** the Impersonation-2 (IMP-2)
State»: «activate» è proprio il rientro in partita, non solo lo schieramento. E l'esempio
delle righe 14301–14305 fa rientrare un Modello con la skill `Impersonation` nel «**Impersonation-1**
Marker State». Il **Cybermask** è un caso a parte: dà sempre IMP-2 (riga 5159), anche a chi
non ha affatto la skill Impersonation.

> ⚠️ **In partita, oggi, questa riga non serve.** Censimento DATABASE `2026-10-06.1`
> (765 profili, `database_nomad.js 15cb7716.154798` + `database_panoceania.js 4a97dcf6.152854`,
> controllato sulla fonte ARMY): **zero** truppe con `Impersonation` fra Nomadi e PanOceania,
> in nessuna delle due notazioni. La skill esiste in `metadata.json` (id 249) ma non compare
> su nessun profilo delle due fazioni. Il rientro in Impersonation vale come regola e serve
> per leggere i Marker IMP-1/IMP-2 **nemici** (che il Cybermask può creare da entrambe le
> parti), ma il primo profilo che lo userà arriverà con un'altra fazione (Combined Army,
> Haqqislam/Hassassin, Tohaa, Druze). Il **Cybermask** invece è già in uso: è lui a mettere
> IMP-2 sul tavolo, e non chiede la skill Impersonation.

### F. Chi non può dichiararle
| Blocco | Fonte |
|---|---|
| **In ARO** — sono Long Skill | Long Skill solo in Turno Attivo |
| **Impetuous / Frenzy già scattato** | riga **13639** (CAMO) · **14242** (IMP): chi è o diventa Impetuoso non tiene lo stato. LETTURA: l'Ordine non è speso, perché non c'è un requisito che fallisce ma uno stato incompatibile |
| **Retreat!** | stesse righe |
| **Engaged** | in Engaged solo Berserk/CC/Schivata/Idle/Reset |
| **Isolato — solo il Cybermask** | righe **14412–14413**: in Isolato tutti i programmi di Hacking sono disabilitati. Il rientro CAMO/IMP **resta** possibile (è una skill Automatica, riga 14413–14414) |
| **Morto / Incosciente / Disconnesso** | stati Null |
| **`Camouflage (1 Use)` già consumato** | FAQ **F07**, e vedi il riquadro sotto: **schierarsi come Marker È già l'uso** |
| **Già in forma di Marker** | per il rientro nello *stesso* stato: non c'è nulla in cui rientrare |

> 🔴 **`Camouflage (1 Use)`: che cosa conta come uso.** La FAQ **F07** (0.0.0, ott 2025, pagina
> wiki *Camouflaged State*, riletta l'8 ottobre) copre due casi su tre:
> - schierato come **Modello** → «Yes, the Trooper can **enter Camouflaged State later in the
>   game**»: l'uso è intatto;
> - tentato lo schieramento **come Marker** e **fallita** l'Infiltrazione → «**it has already
>   used its Camouflaged State** and cannot enter it later in the game»: l'uso è bruciato,
>   anche se la truppa non è mai stata un Marker (finisce Modello nella propria Zona).
>
> Il terzo caso — schieramento come Marker **riuscito** — la FAQ non lo nomina. ⚠️ **LETTURA, ma
> a senso unico: è l'uso.** Se un tentativo *fallito* consuma l'uso, uno *riuscito* non può
> costare meno, e la frase della FAQ dice che quello che si consuma è l'**entrata nello stato**,
> non il suo esito. La lettura contraria produce una scala incoerente:
>
> | Schieramento | Lettura contraria | Lettura nostra |
> |---|---|---|
> | come Modello | 1 CAMO (più tardi) | 1 CAMO |
> | come Marker, Infiltrazione **fallita** | **0** CAMO | 0 CAMO |
> | come Marker, Infiltrazione **riuscita** | **2** CAMO (lo schieramento + un rientro) | 1 CAMO |
>
> Riuscire darebbe il doppio di chi non ha nemmeno provato, e il quadruplo di chi ha fallito.
> Quindi: `(1 Use)` conta le **entrate in stato Camuffato**, e lo schieramento in quello stato è
> un'entrata. **Una sola, comunque la si spenda.**
> ⚠️ Conseguenza sul motore: un **Moran** schierato in CAMO e poi rivelato **non può rientrare**.

### G. Reazioni
Il Marker protegge **dall'Ordine dopo**, non da questo. Alla dichiarazione la truppa è
ancora un **Modello** (o si rivela, caso D), quindi chi reagisce non ha le restrizioni
degli ARO contro un Marker. Lo stato si applica in Risoluzione, dopo gli ARO.

### H. Trappole
- Una truppa rivelata che rientra conta come Marker **nuovo**: chi aveva fallito lo
  Scoprire può ritentarlo subito (righe 13613–13614 · 14211–14212).
- Il rientro **non** cancella il Bersagliato né gli altri stati: solo la forma cambia.
- Non c'è nessun tiro: il Cybermask è «No Roll» (riga 5153), il rientro non ne ha mai avuto.

### I. Controllo dell'app
| Cosa | Atteso |
|---|---|
| Domanda sulla LoF, risposta NO | **IDLE** per tutte tre (non VIETATO), Ordine speso |
| Domanda non risposta | non esegue, nessuna busta |
| Frenzy attivo | VIETATO, Ordine non speso (LETTURA) |
| Cybermask da Marker CAMO | ammesso, con nota «il CAMO cade alla dichiarazione, gli ARO sono contro un Modello» |
| Cybermask in Isolato | non disponibile |
| Marker risultante | CAMO col MOD di Mimetismo · IMP-2 **senza** MOD · IMP-1/IMP-2 secondo il profilo |

---

# 2. MATRICE MOD × ORDINE

La tabella da guardare al volo. **Lato attaccante** nelle prime righe, **lato reattivo**
nelle ultime. ✅ si applica · ❌ non si applica · — non pertinente. Per il dettaglio di ogni
casella vale la scheda dell'ordine (§1).

| MOD | BS | CC | Intuit. | Specul. | Guidato | Hacking | Scoprire | FO | Triang. | Kit (BS) |
|---|---|---|---|---|---|---|---|---|---|---|
| Gittata | ✅ arma | ❌ | ❌ | ✅ al punto d'impatto | ✅ in linea retta | ❌ | ✅ bande proprie | ✅ | ❌ (solo limite max) | ✅ bande Kit |
| Copertura Parziale −3 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Mimetismo −3/−6 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | — |
| Zone di Visibilità | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Nanoscreen −3 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ❌ | — |
| Bersagliato +3 | ✅ | ❌ | ❌ | ✅ | ✅ sempre | ✅ | ✅ | ✅ | ❌ | ❌ |
| −6 Speculativo | — | — | — | ✅ | — | — | — | — | — | — |
| ECM (Guided) | — | — | — | — | ✅ | — | — | — | — | — |
| Firewall / ECM (Hacking) | — | — | — | — | — | ✅ | — | — | — | — |
| Martial Arts / CC Attack (±N) / PARA (−X) | — | ✅ | — | — | — | — | — | — | — | — |
| Bersaglio in Soppressione −3 (solo F2F, entro 24") | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | — | ✅ | ❌ | — |
| Fireteam L4 +1 | ✅ | ❌ | ❌ | ⚠️ ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Fireteam L2 +1 SD | ✅ | ❌ | ❌ | ❌ Long | ✅ | ❌ | ❌ | ✅ | ❌ Long | ✅ |
| Fireteam L3 +3 | — | — | — | — | — | — | ✅ | — | — | — |
| Stordito −3 (chi tira) | vietato | vietato | vietato | vietato | vietato | vietato | ✅ | vietato | vietato | ✅ |
| Burst | pieno (max 6) | pieno +1/alleato | **1** | **1** | **1** | programma | — | 2 | pieno | 1 |

**Lato reattivo** (chi risponde all'ordine):

| MOD sul tiro del reattivo | Schivata (PH) | Reset (WIP) | Attacco in ARO |
|---|---|---|---|
| Senza LoF verso l'attaccante / Sagoma senza LoF | −3 | ❌ | — |
| Bersagliato | ❌ | −3 | ❌ (anzi: +3 a chi gli spara) |
| IMM-A | −6 (unica azione) | vietato | vietato |
| IMM-B | vietata | −3 (unica azione) | vietato |
| Isolato | ❌ | −9 | ✅ (non Comms) |
| Stordito | −3 | −3 | vietato |
| Surprise Attack dell'attivo | ✅ solo F2F | ✅ solo F2F | ✅ (è F2F) |
| Look Out! (alleato allertato) | Schivata a −3 | — | — |
| Fireteam L3 | +1 | ❌ | — |
| `Dodge (+N)` del profilo | +N | — | — |
| Sesto Senso | annulla i negativi tranne IMM-A −6 / IMM-B −3 / Isolato −9 | idem | ❌ (restano) |

> Sempre: stati sullo stesso attributo **si sommano** (righe 1921, 13594), totale troncato a
> **±12**, SV **sotto 1 = fallimento automatico**.

**Zone di Visibilità** (wiki "Visibility Conditions"):

| Zona | Chi attacca attraverso la zona | Il **bersaglio** che risponde all'attaccante |
|---|---|---|
| Bassa | −3 (MSV L1+: 0) | idem |
| Pessima | −6 (MSV L1: −3; L2+: 0) | idem |
| **Zero** | niente LoF (MSV L1: −6; L2+: 0) | **solo se è bersaglio di un BS Attack** che attraversa la zona: la tratta come **Pessima** → −6, LoF consentita. MSV L1: resta **−6** (solo per la FAQ F17; senza, sarebbe −3). Sesto Senso, anche senza visore: **0**. Se non è bersaglio di un BS Attack: niente LoF |
| **Rumore Bianco** | **nessun effetto**, salvo per chi ha **MSV di qualsiasi livello o Marksmanship**: per loro è Zona Zero, niente LoF | con MSV o Marksmanship: la tratta come Pessima, −6 **non riducibile dall'MSV**. Col **Sesto Senso** il −6 cade (il divieto riguarda solo l'MSV) |

- La **Schivata** non subisce MOD di visibilità.
- I MOD di visibilità **non si sommano** fra loro: si applica solo il più restrittivo.
- Il Fuoco Speculativo non ne subisce nessuno (solo il suo −6).
- **Fumo** ed **Eclipse** sono Zone Zero create in partita da una Sagoma Circolare, ad altezza
  infinita, che restano fino all'inizio della Fase Stati. Non servono bersagli: si lanciano su un
  punto. Chi attacca con quella munizione ottiene un **Faccia a Faccia contro tutti** gli attacchi
  nemici che richiedono tiro e LoF e la cui LoF attraversa la zona, e deve vincerli tutti.
- **Eclipse**: Zona Zero che blocca gli MSV **di ogni livello**; il bersaglio con MSV resta a −6
  perché il testo (righe 5617–5620) vieta la riduzione **al visore**.
- **Sesto Senso**: annulla quel −6 in tutti e tre i casi — Zona Zero, Rumore Bianco, Eclipse —
  perché i divieti nominano solo il visore. ⚠️ Per Rumore Bianco ed Eclipse è una lettura, non una riga.
- Più zone, o zona più terreno: vale **solo il MOD più restrittivo**, mai la somma.

## 2.1 🔴 PIÙ TERRENI SULLA STESSA LINEA DI TIRO

La domanda "si sommano o vale il peggiore?" ha una risposta che dipende dal **tipo** di MOD, e il
regolamento la dà due volte, in due righe simmetriche.

**Dentro lo stesso tipo: solo il più restrittivo.** Righe **12688–12695** (IMPORTANT):
> «Visibility Zone MODs **never stack** with other Visibility Zone MODs. If any Roll would be
> affected by **two or more Visibility Zones of whatever type**, players will apply **only one
> MOD, that must be always the most restrictive one**. For example, if a BS Attack's LoF passes
> through a Low Visibility Zone (−3 MOD) and a Poor Visibility Zone (−6 MOD), apply only one
> single −6 MOD.»

E la stessa cosa per la Saturazione, righe **12645–12648**:
> «The Burst MODs for Saturation Zones **never stack with MODs for other Saturation Zones**. For
> example, if the LoF of a BS Attack is drawn through several Saturation Zones, the player will
> apply **only a −1 Burst MOD**.»

**Fra tipi diversi: si sommano.** Righe **12667–12669**:
> «This MOD for Visibility **stacks** with other MODs for Special Skills, Equipment, Partial
> Cover, Range… but **never with other Zone of Visibility MODs**.»

Quindi la regola in una riga: **Visibilità contro Visibilità → il peggiore. Saturazione contro
Saturazione → una sola. Visibilità contro Saturazione → entrambe**, perché una tocca
l'**attributo** e l'altra il **Burst**, e non si incontrano mai.

### Un terreno non è un MOD: è un pacchetto di zone
È il punto che cambia la forma del campo. Nelle regole non esistono "Bosco" e "Giungla" come
modificatori: esistono **cinque Tipi di Terreno** (Aquatic, Desert, Mountain, Jungle, Zero-G —
riga 10214) e, separatamente, **tre proprietà** che un'area può avere: Terreno Difficile,
Condizione di Visibilità, Zona di Saturazione. La tabella ufficiale delle righe **12703–12785**,
riverificata l'8 ottobre sulla wiki *Special Terrain* (oldid 4062, N5.3) **riga per riga**:

| Esempio | Tipo | Terreno Difficile | Visibilità | Saturazione |
|---|---|---|---|---|
| Spiaggia | Aquatic | sì | — | no |
| Mare aperto | Aquatic | sì | — | no |
| Palude | Aquatic | sì | — | **sì** |
| Terreno roccioso | Desert | opzionale | — | **sì** |
| Dune di sabbia | Desert | sì | — | no |
| Bassa montagna o colline ripide | Mountain | — | — | no |
| Piane artiche | Mountain | opzionale | — | no |
| Media montagna | Mountain | sì | **Bassa** | no |
| Alta montagna | Mountain | sì | **Bassa** | **sì** |
| **Bosco** | **Jungle** | opzionale | **Bassa** | **sì** |
| **Giungla** | **Jungle** | sì | **Pessima** | **sì** |
| Giungla densa | Jungle | sì | **Pessima** | **sì** |
| Foresta primordiale | Jungle | sì | **Zero** | **sì** |
| Zero-G | Zero-G | sì | — | no |
| **Tempesta** | tutti tranne Zero-G | — | **alza di un livello** la Visibilità presente | — |
| Sala macchine | Zero-G opz. | sì se Zero-G | **Bassa** | **sì** |
| Sala generatori | Zero-G opz. | sì se Zero-G | **Rumore Bianco** | **sì** |
| Sala del nucleo | Zero-G opz. | sì se Zero-G | **Bassa + Rumore Bianco** | — |

Tre cose che questa tabella dice e che la domanda non prevedeva:
1. **Bosco e Giungla sono lo stesso Tipo** (Jungle). Non sono due terreni: sono due aree dello
   stesso Tipo con proprietà diverse.
2. La **Tempesta** non è una zona: **alza di un livello** la Visibilità già presente. Bosco +
   Tempesta = Bassa → Pessima. Non è un MOD da sommare né da confrontare: trasforma.
3. La **Sala del nucleo** porta **due** Condizioni di Visibilità da sola (Bassa + Rumore Bianco):
   la regola del "più restrittivo" va risolta anche **dentro** un singolo terreno.

### Il caso che ha chiesto Paolo, risolto
**Bosco + Giungla sulla stessa LoF**, bersaglio senza visore:

| Voce | Bosco | Giungla | Che cosa si applica |
|---|---|---|---|
| Visibilità | Bassa (−3) | Pessima (−6) | **−6**, uno solo, il peggiore (12688–12695) |
| Saturazione | sì | sì | **−1 al Burst**, una sola volta (12645–12648), dopo la divisione del Burst e con pavimento a 1 (12642–12644) |
| Terreno Difficile | opz. | sì | solo **movimento**: non tocca il tiro |

Totale sull'attacco: **−6 all'attributo e −1 al Burst**. Non −9, e non solo −6.

### Fumo ed Eclipse insieme a un terreno
Il Fumo **è** una Zona Zero (riga 5784, che rimanda proprio a *Special Terrain, Visibility
Conditions*), e l'Eclipse è «exactly the same way as Smoke» (riga 5612). Quindi **non sono una
categoria a parte**: entrano nel confronto delle Visibilità e, essendo Zero, **vincono sempre**
sul terreno.
🔴 **Ma portano solo una Visibilità, non una Saturazione.** Se il terreno sotto ha la Saturazione,
il Fumo **non la cancella**: il −1 al Burst resta. ⚠️ È la conseguenza che il campo combinato
"terreno + Fumo" nascondeva: applicando "solo il più restrittivo" fra un terreno e una zona si
perdeva la Saturazione del terreno. Separare le voci non è solo più comodo, **corregge**.

### Chi ignora che cosa
| Skill | Che cosa ignora davvero |
|---|---|
| **Terrain (Tipo)** righe 10198–10214 | **solo il movimento**: +1" al primo valore di MOV dentro l'area, e passa senza le restrizioni di movimento di quel Tipo. **Non tocca né Visibilità né Saturazione.** Se il profilo elenca più Tipi fra parentesi, se ne sceglie uno **al piazzamento**. `Terrain (Total)` vale per tutti e cinque i Tipi, e ignora anche il **Dazer** (riga 10584) |
| **MSV** | riduce i MOD **di Visibilità** (e il Mimetismo). Ma dopo le righe 12688–12695 di MOD di Visibilità ne resta **uno solo**: la domanda "ne ignora uno o tutti" non si pone, ce n'è uno. **Non tocca la Saturazione.** Eccezioni: l'**Eclipse** lo blocca a ogni livello (5613–5615), e in **Rumore Bianco** l'area è Zona Zero per lui (12680–12683) e il −6 risultante **non è riducibile** (12684–12686) |

Quindi la quarta domanda si scioglie: **con due terreni la skill Terrain non "ignora" nessuno dei
due ai fini del tiro**, perché non ha mai agito sul tiro; e il visore agisce sull'unico MOD di
Visibilità sopravvissuto, qualunque terreno l'abbia generato. E nel caso Bosco + Giungla
`Terrain (Jungle)` copre **entrambi**, perché sono lo stesso Tipo.

> ⚠️ **Una regola collegata che non avevamo** — righe **12755–12758**: «You cannot use **Combat
> Jump** inside of, or in contact with, an area with Low, Poor, or Zero Visibility Conditions».
> Vale per la scheda §1.17: un Ingresso in campo non si può dichiarare dentro o a contatto di
> un'area con una Condizione di Visibilità, Fumo ed Eclipse compresi.

---

# 3. ARMI

## 3.1 Come si legge una riga del Weapon Chart

| Colonna | Significato | Trappola |
|---|---|---|
| 8" 16" 24" 32" 40" 48" 96" | MOD di gittata per banda; "--" = fuori gittata | oltre l'ultima banda: fallimento automatico, ordine speso |
| PS | Possibilità di Sopravvivenza: si **somma** all'attributo della salvezza (più è basso, più l'arma è letale) | `CC Weapon (PS=X)` nel profilo la fissa; armi come la PARA non hanno PS ma un tiro fisso (PH−6) |
| B | Burst in Turno Attivo | in ARO è 1 salvo regole |
| Ammo | munizione (§4) | una sola per tutto il Burst |
| Save Attr. | attributo della salvezza: ARM, BTS, PH−6, **ARM/2**, **ARM=0** | `ARM=0` in questa colonna = il bersaglio salva con ARM azzerata. **Non** confonderlo con gli attributi dei Deployable (`ARM=0 \| BTS=0 \| STR=1`), che sono il profilo del token |
| Save Rolls | numero di salvezze per colpo | ha la **precedenza** sulla munizione generica |
| Traits | tratti (§3.2) | — |

## 3.2 Tratti che cambiano il calcolo

| Tratto | Effetto sul calcolo | Scheda |
|---|---|---|
| **BS Weapon (PH) / (WIP)** | si tira su PH / WIP con **tutti** i MOD di un BS Attack; il Fireteam L4 +1 vale; **non** usabile col Guidato. Con `BS Weapon (WIP)` non si può usare la skill `BS Attack (Shock)` | 1.1, 1.13 |
| **Speculative Attack** | abilita il Fuoco Speculativo (−6, Burst 1, niente LoF) | 1.4 |
| **Intuitive Attack** | abilita l'Attacco Intuitivo (WIP non modificato, Burst 1) | 1.3 |
| **Direct Template** (Teardrop) | nessun tiro d'attacco: il bersaglio salva o Schiva; niente `+1 SD` | 1.1 |
| **Impact Template (Circular)** | un tiro solo; i MOD si prendono dal Bersaglio Principale; gli altri sotto la sagoma salvano separatamente | 1.1, 1.4, 1.5 |
| **Suppressive Fire** | abilita lo stato Fuoco di Soppressione (profilo SF Mode) | 1.10 |
| **Comms Attack** | è un Attacco Comms: si difende col **Reset**, vale il Firewall | 1.6 |
| **Non-Lethal** | non causa Ferite dirette | — |
| **Disposable (X)** | X usi; un requisito fallito o un Idle forzato consuma l'uso. **Ogni +1 di Burst da un MOD consuma un uso**, e i MOD al Burst **non possono superare gli usi rimasti**. Modalità diverse della stessa arma **condividono** gli usi. Finiti gli usi: stato **Scarico** (la truppa se ha una sola arma Disposable, l'oggetto se ne ha più d'una) | 1.14 |
| **Non-Reloadable** | lo Scarico di quell'arma **non si cancella** e gli usi non tornano: il Reload non serve | 1.14 |
| **Double Shot** | in Turno Attivo +1 al Burst; con `Disposable (2)` si può usare **solo** se entrambi gli usi sono liberi, e li consuma entrambi → Scarico | 1.1 |
| **Silent (X)** | attaccando dentro la ZdC del bersaglio e fuori dalla sua LoF, il bersaglio applica il MOD fra parentesi alla Schivata in F2F. **Questo sì è cumulativo** con gli altri MOD di Schivata | reazioni |
| **Targetless** | nessun bersaglio designato, Tiro Normale; in Turno Reattivo serve comunque la **LoF** verso l'attivo | — |
| **Concealed** | il Marker CAMO che nasconde un'arma ha **Silhouette 2** | 1.14 |
| **Deployable** | si piazza con Place Deployable; ha profilo e attributi propri e si può bersagliare. Se entra in **Incosciente passa subito a Morto**, senza Ferita extra. Non attiva altri Deployable | 1.14 |
| **Targetless** | nessun bersaglio: Tiro **Normale** (es. Disco Baller) | — |
| **Anti-materiel** | effetti contro strutture e scenografia | 1.16 |
| **Continuous Damage** | ripete il danno | — |
| **Improvised** | **−6 all'attributo corrispondente dell'utente** (CC per un'arma da CC, BS per una BS) | 1.2 |
| **Concealed** | il Deployable è un Marker CAMO | — |
| **Target (Attributo)** | l'arma ha effetto **solo** su chi ha l'attributo indicato (VITA o STR); chi non ce l'ha **non fa nemmeno il Tiro Salvezza**. Le due armi con `Target (VITA)` sono **PT: Endgame** (PS7 · B1 · AP · BTS÷2 · 1 · Double Shot, No LoF, ZoC) e **PT: Eraser** (PS6 · B2 · DA · BTS · 2 · Isolato, No LoF, ZoC), della sezione **Pheroware Tactics** | — |
| **Reflective** | blocca MSV e Marksmanship (5.2) | — |

## 3.3 Armi "speciali" già verificate

| Arma | Profilo essenziale | Fonte |
|---|---|---|
| Jammer | PS7 · B1 · N · BTS · 1 salvezza · Comms Attack, Intuitive Attack, No LoF, ZoC, Isolato | Weapon Chart, riga 16403 |
| MadTraps | PARA · PH−6 · B1 · Disposable (2) · Boost · Perimeter · Deployable | Weapon Chart, riga successiva al Jammer |
| D-Charges (Demolition) | PS6 · B1 · AP+EXP · ARM/2 · 3 salvezze · senza tiro · solo Strutture/Edifici o nemici IMM/Null (non Posseduti/Sepsitorizzati) · non in ARO · Disposable (3) condiviso col modo CC | righe 6027–6070 |
| Mine | Direct Template Small Teardrop · Schivata a PH−3 · CAMO(−3) | wiki "Mines" |
| Cybermine | Attacco Comms · si evita **solo con Reset a WIP−3** · 2 salvezze BTS, PS5 · Stordito (IMM-B se hackerabile o Hacker) | wiki "Mines" |
| Disco Baller | Tiro Normale BS (Targetless) · Eclipse circolare · Activate Disco Ball: WIP+3 con le gittate del Deactivator | wiki "Disco Baller" |
| Jammer, l'unica arma con Intuitive Attack **senza Sagoma** | vedi sopra. Essendo Comms Attack, **niente** regola della mischia (il −6 e il fuoco amico delle righe 3389–3396 valgono per i BS Attack) | righe 16401–16405 |
| Heavy Rocket Launcher | Blast Mode **PS 6** + Impact Template (Circular) · Hit Mode **PS 5**, senza sagoma · entrambe Continuous Damage, B2, ARM, 1 salvezza | righe 16021–16025, gittate 15954–15962 |
| Mine Dispenser | B1 · nessun PS, nessuna munizione propria · *Speculative Attack, **Double Shot**, Disposable (2), Targetless* · «uses the same rules as **Drop Bears in BS Mode**», e le Mine che contiene sono elencate fra parentesi dopo il nome nel profilo | wiki *Mine Dispenser*, oldid 4099 (letta l'8 ottobre) |

### Drop Bears: due modalità, e il `(+1 SD)` ne tocca una sola
Il Drop Bear è un'arma con **due profili distinti** e `Disposable (3)` **condiviso** fra i due
(righe 6165–6167):

| Modalità | Profilo | Tira? |
|---|---|---|
| **Deployable Mode** (riga 6177) | PS7 · B1 · SHOCK · ARM · 1 salvezza · *Intuitive Attack, Disposable (3), **Direct Template (Small Teardrop)**, Deployable* | **no**: Sagoma Diretta |
| **BS Mode** (righe 6192–6194) | nessun PS, nessuna munizione propria · B1 · *BS Weapon (PH), **Speculative Attack**, Disposable (3), Targetless* · gittate +3 a 8", −3 a 16" | **sì**, su **PH** |

Il token piazzato è un **Mine Token [MINE (−3)]** con profilo proprio (ARM 0, BTS 0, STR 1, S 0 —
righe 6182–6183) e funziona «just like a Mine» (righe 6143–6146). Non può detonare nell'Ordine in
cui è stato lanciato (righe 6156–6157).

**Dove vale il `(+1 SD)` del profilo** (regola alle righe 1957–1959: mai sulle **Long Skill**, mai
su ciò che **non tira**):

| Azione | `(+1 SD)` | Perché |
|---|---|---|
| Lancio in **BS Mode** come **BS Attack** | ✅ **sì** | è un tiro di PH, Abilità Breve |
| Lancio in **BS Mode** come **Fuoco Speculativo** | ❌ no | lo Speculativo è una **Long Skill** (chart riga 16634) |
| Piazzamento in **Deployable Mode** (Place Deployable) | ❌ no | nessun tiro |
| Piazzamento via **Attacco Intuitivo** (serve col Marker CAMO nella Trigger Area, riga 6144) | ❌ no | l'Intuitivo è una **Long Skill** |
| **Detonazione** del token piazzato | ❌ no | **Sagoma Diretta**: nessun tiro d'attacco, il bersaglio salva o Schiva a PH−3 (riga 6232). E il token è un elemento di gioco a sé, non la truppa che porta la notazione |

Promemoria della Mina che vale anche qui: riga **6227**, «A Mine **never triggers** if the Small
Teardrop Template would affect an ally, even if that ally is Unconscious».

---

# 4. MUNIZIONI E TIRI SALVEZZA

| Munizione | Salvezze | Attributo | Dimezza? | Effetto del fallimento |
|---|---|---|---|---|
| **N** | 1 | ARM | no | 1 Ferita |
| **AP** | 1 | ARM o BTS | **sì** | 1 Ferita |
| **DA** | 2 | ARM | no | 1 Ferita ciascuna; la 2ª è obbligatoria |
| **EXP** | 3 | ARM | no | 1 Ferita ciascuna; tutte obbligatorie |
| **T2** | 1 | ARM | no | **2 Ferite**; la salvezza extra da Critico ne infligge 1 |
| **Shock** | 1 | ARM | no | 1 Ferita; con VITA 1 va direttamente a **Morto** (annulla Dogged, NWI) |
| **E/M** | 2 | BTS | **sì** | Isolato; HI/TAG/REM/VH anche IMM-B |
| **PARA** | 1 | **PH−6 fisso** | — | IMM-A. Il `(−X)` della PARA CC Weapon nel profilo **non** tocca la salvezza: è un MOD al F2F avversario |
| **Stun** | 1 | ARM | no | Stordito + Guts fallito (salvo Courage) |
| **Smoke** | — | — | — | Zona di Visibilità Zero (MSV la attraversa) |
| **Eclipse** | — | — | — | Zona Zero che blocca **anche** gli MSV |

**Formula della salvezza** (righe 3209–3230): `SV = ARM o BTS (dimezzato se AP/E-M) + PS + 3 Copertura ± altri MOD` → d20 **≤ SV** = salvo. Le armi senza PS (PARA) usano un Tiro Normale sull'attributo indicato (PH−6).

**Regole comuni:**
- **Critico** = +1 salvezza con lo stesso attributo e gli stessi Tratti (salvo Immunity Critical).
- **Munizioni combinate** (`AP+DA`, `AP+EXP`, `N+E/M`…): sommano gli effetti. AP+EXP = 3 salvezze dimezzate.
- **Salvezza combinata** (`ARM+BTS`, es. Plasma): una salvezza per attributo; il Critico aggiunge una salvezza su ARM.
- **Bonus alla salvezza** del bersaglio: Copertura Parziale **+3** (contro BS), Nanoscreen **+3** (contro BS), Firewall **+3** (contro Comms), `Dodge (ARM +3)` se la Schivata fallisce.
- **Malus alla salvezza**: `(SR-1)` / `(SR-2)` dell'attaccante.
- **Il Weapon Chart vince sulla munizione generica** per attributo e numero di salvezze.

---

# 5. SKILL CHE TOCCANO IL CALCOLO

| Skill | Effetto | Dove pesa |
|---|---|---|
| **Journalist** | ⚠️ **non è nel .txt 5.1.1**: skill nuova di N5.2 (wiki, oldid 4086, «New rule added PDF 5.2»). Automatic, Optional. Truppe nella ZdC di un Journalist **alleato**: **+3 al Guts Roll**. Nella ZdC di uno **nemico**: **−3**. In campagna, a fine scenario e solo se il Journalist è sul tavolo in stato non Null: +3 a CUBEVAC e +3 al tiro di Promozione, **non cumulabili** fra più Journalist | **Guts**, che l'app oggi non tira. 3 profili PanOceania |
| **Mimetism (−X)** | −X a chi dichiara BS Attack con LoF o Discover contro l'utente; non vale in CC | BS, Scoprire, FO |
| **Camouflage** | stato Camuffato: serve Scoprire prima di attaccare | 1.7 |
| **Surprise Attack (−X)** | solo in Attivo, partendo da Marker/Hidden. **N5.2 (adottata):** il −X vale **solo sui Faccia a Faccia** dei **bersagli** in ARO. `(CC−X)` solo su quell'attributo; non cumulabile con un altro Surprise Attack; più truppe con Sorpresa sullo stesso bersaglio: **non si sommano** (F02) | reazioni |
| **Combat Instinct** | ignora i MOD di Surprise Attack e rende inefficace lo Stealth | reazioni |
| **Sixth Sense** | reagisce fuori LoF; su Schivata/Reset niente MOD negativi tranne IMM-A −6, IMM-B −3, Isolato −9; con MSV L1 ignora il −6 della Zona Zero quando è bersaglio (F17). **Non** annulla la Sorpresa sugli attacchi in ARO | reazioni |
| **Natural Born Warrior** | se bersaglio di CC Attack **e** dichiara CC Attack: ignora tutti i MOD negativi del nemico nel F2F (Martial Arts, CC Attack (−N), PARA (−X), Sorpresa) | 1.2 |
| **Martial Arts L1–L5** | Attack MOD 0/+3/+3/+3/+3; Opponent −3 a tutti i livelli; L3 +1 SD, L4 +1 B, L5 +1 B e +1 SD | 1.2 |
| **Berserk (+N)** | Long Skill; niente F2F (entrambi Tiro Normale); +N al CC | 1.2 |
| **Marksmanship** | ignora Copertura Parziale e Nanoscreen, **non** il Mimetismo; subisce White Noise, Reflective, Albedo (5.2) | 1.1 |
| **No Cover** | nessun MOD di Copertura: né −3 all'attaccante né +3 alla salvezza | 1.1 |
| **Limited Cover** | solo il −3 all'attaccante; il +3 alla salvezza resta | 1.1 |
| **Total Reaction** | Burst pieno in ARO su BS Attack | reazioni |
| **Neurocinetics** | Burst 1 in Attivo; pieno in ARO contro un solo bersaglio; MOD al Burst solo in ARO | 1.1 |
| **Doctor / Engineer** | WIP Normale; fallimento: Dottore → **Morto**, Ingegnere → 1 Ferita; `(ReRoll −X)`, `(2W)` | 1.8 |
| **Forward Observer** | BS Weapon (WIP), B2, bersaglio → Bersagliato | 1.13 |
| **Sensor** | WIP+6 Normale, niente gittata e Mimetismo; +6 al Discover contro CAMO | 1.13 |
| **Triangulated Fire** | Long Skill, nessun MOD al tiro tranne al Burst | 1.13 |
| **Immunity (…)** | tratta la munizione indicata come N; non vale contro Comms (salvo Immunity (State)) né contro Non-Lethal e Stun | §4 |
| **Dogged / NWI** | resta attivo da Incosciente; un'altra Ferita = Morto; Shock = Morto diretto | §4 |
| **Courage** | passa i Guts; non entra in Ritirata | — |
| **Sapper** | Long Skill → stato Foxhole | 1.15 |
| **Tech-Recovery** (N5.2) | riguarda il **bersaglio** del GizmoKit: colpito da un GizmoKit alleato, con un **Tiro Normale di PH** (o il PH di `GizmoKit (PH=X)`) cancella **tutti** i propri stati cancellabili dall'Ingegnere (IMM-A, IMM-B, Isolato, Bersagliato…). **Mai** l'Incosciente. Fallire non ha conseguenze. Attiva anche in stato Null | 1.8 |
| **RemDriver** (N5.2) | skill di schieramento: si piazza un segnalino REMDRIVER accanto a un REM già schierato, che guadagna i MOD scritti fra parentesi nel profilo dell'utente. Un REM un solo segnalino; il segnalino si toglie a fine dell'Ordine in cui l'utente entra in uno stato Null | — |
| **Warhorse** | `BS Attack (−X)` dell'avversario non ha effetto su di lui | 1.1 |

---

# 6. EQUIPAGGIAMENTO CHE TOCCA IL CALCOLO

| Equip | Tipo | Effetto | Stati che lo spengono |
|---|---|---|---|
| **MSV L1** | Automatic | Mimetismo −3→0, −6→−3; Bassa Vis. 0, Pessima −3; attraverso Zona Zero **−6** a ogni skill con LoF; niente F2F contro Smoke | Disconnesso |
| **MSV L2** | Automatic | Mimetismo e Visibilità a 0 | Disconnesso |
| **MSV L3** | Automatic | come L2 + Discover automatico contro CAMO + BS Attack su CAMO senza Scoprire (applicando il Mimetismo) + **ignora la Sorpresa** se ha LoF, sempre in CC | Disconnesso |
| **X-Visor** | — | gittata −3→0, −6→−3 (anche Discover e SF Mode) | ⚠️ |
| **Biometric Visor** | — | ignora il −3 di Impersonation-1; **ignora la Sorpresa** di attaccanti in Impersonation/Holoecho se ha LoF, sempre in CC | ⚠️ |
| **Nanoscreen** | — | −3 a chi gli spara (BS) e +3 alla salvezza; non contro Comms né CC | ⚠️ |
| **Firewall (−X)** | **Automatic (5.3)** | −X a chi lo hackera, +3 alla salvezza contro Comms; uno solo | Isolato e Null se viene dal **Dispositivo di Hacking** (F01); Disconnesso sempre |
| **ECM (Tipo −X)** | Automatic, **senza** etichetta Comms (confermato su wiki) | −X a chi lo attacca col tipo indicato (Guided, Hacking) | Disconnesso, Morto, Incosciente — **non** l'Isolato |
| **TinBot: …** | **Automatic, Comms Equipment** | dà il MOD indicato (Firewall, Guided, Discover +3) al portatore e al Fireteam | **qualsiasi stato Null e l'Isolato**: il TinBot non dà nulla (righe 11130–11131) |
| **Hacking Device (tutti)** | **Automatic, Comms Equipment (5.3)** | abilitano i programmi (1.6) | Isolato, Null |
| **Fairy Dust** (Supportware) | **LONG SKILL**, No Roll, mai ARO | `Firewall (−3)` a **tutte** le truppe di **un tipo** (HI/REM/TAG/VH) della propria lista, su tutto il tavolo. È una **fonte** del Firewall, non un Firewall in più: non si somma alle altre (§1.6 H) | Isolato o qualsiasi Null **dell'hacker**; un altro Supportware su un beneficiario; un altro Supportware dichiarato dallo stesso hacker (righe 4729–4738, 5223–5225) |
| **MediKit / GizmoKit** | BS Weapon Non-Lethal | vedi 1.8 (Kit: +3 / 0 / −6 a 8/16/24") | — |
| **Deactivator** | BS Weapon (WIP) | +6 / +3 / −6 a 8/16/24"; solo Deployable nemici | — |
| **Repeater** | Comms Equipment | estende l'Hacking Area | Isolato |

---

# 7. STATI

| Stato | Null? | Cosa può fare | MOD ai propri tiri | Effetto su chi lo attacca | Si cancella con |
|---|---|---|---|---|---|
| **Bersagliato** | no | tutto tranne Movimento Cauto e Stealth | Reset −3 | **+3** a BS Attack, Comms, Discover | Reset riuscito, Ingegnere |
| **IMM-A** | no | solo Schivata; **continua a dare Ordini** | Schivata −6 | — | Schivata riuscita (anche F2F), Ingegnere |
| **IMM-B** | no | solo Reset; **continua a dare Ordini** | Reset −3 | — | Reset riuscito, Ingegnere |
| **Isolato** | no | agisce con il proprio Irregolare; niente Comms, Fireteam, Coordinato | Reset −9 | — | Reset riuscito, Ingegnere |
| **Stordito** | no | niente Attacchi; gli Automatici continuano a funzionare | −3 a ogni tiro tranne le salvezze | — | Dottore (VITA) / Ingegnere (STR), **e da solo** all'inizio della Fase Stati del Turno di Giocatore in cui è stato causato |
| **Engaged** | no | solo Berserk, CC, Schivata, Idle, Reset | — | BS Attack nel CC: −6 per alleato coinvolto | uscire dal contatto (Schivata riuscita) |
| **Fuoco di Soppressione** | no | ARO solo BS in SF Mode (B3) | — | −3 nei F2F entro 24" | vedi 1.10 |
| **Ritirata!** | **no** | solo Basic Short Skill, Cauto, Schivata, Reset → **niente Salto, Arrampicarsi, BS Attack** (§7.1) | — | — | inizio turno, Command Token |
| **Foxhole** | no | **tutto**, tranne muoversi; per muoversi si cancella (§7.1) | — | Copertura 360°, Mimetismo −3 | Prono, o cancellato all'inizio di un movimento |
| **Disconnesso** | **sì** | niente (Periferica) | — | Automatici spenti | ritorno del Controller, Ingegnere, Coerenza |
| **Posseduto** | **sì** | agisce per l'avversario | — | Automatici **attivi** | Command Token, Total Control del proprietario |
| **Sepsitorizzato** | **sì** | agisce per l'avversario | — | Automatici attivi | — |
| **Incosciente** | **sì** | niente | — | CC Attack = Colpo di Grazia | Dottore / MediKit / Ingegnere / GizmoKit |
| **Morto** | **sì** | — | — | — | — |

> **"Null"** (riga 14910) significa soltanto: niente Ordini né Punti Vittoria. Posseduto e
> Sepsitorizzato sono Null ma **agiscono**. Nel motore: `M.eNullo` per le regole che dicono
> "Null State"; la lista "può agire" per ARO e Foxhole.

## 7.1 Che cosa si può dichiarare, stato per stato

Le liste chiuse degli stati nominano **categorie** (Basic Short Skill, Long Skill, ARO), non
nomi di abilità. Quindi prima serve la classificazione, e il regolamento ne ha una ufficiale:
la **Orders and AROs Reference Chart**, righe **16619–16661**. È la tabella da cui partire
ogni volta, perché smentisce tre cose che "sembrano" vere.

**Le Basic Short Skill sono TRE, e sono queste** (righe 16620–16624):

| Basic Short Skill | Riga |
|---|---|
| **Discover** (Scoprire) | 16622 |
| **Idle** | 16623 |
| **Move** (Movimento) | 16624 |

Tutto il resto è Short Skill, Long Skill o ARO. Le tre sorprese che contano:

- **Movimento Cauto è una LONG SKILL** (riga 16624, p.32). Non è una Basic Short Skill.
- **Salto e Arrampicarsi sono LONG SKILL** (righe 16631 e 16627). Non sono Movimenti brevi.
- **Schivata e Reset sono SHORT SKILL** (righe 16646 e 16655), non Basic Short.

E due righe generali che si applicano sopra ogni lista di stato:
- **Le Long Skill esistono solo in Turno Attivo** (riga 6732: «These Skills can only be
  declared in the Active Turn»). Quindi in ARO cadono da sole, senza che lo stato le vieti.
- **L'Idle non è un ARO**: non compare nella colonna AROS (righe 16639–16654). Nel Turno
  Reattivo non si "dichiara Idle": si rinuncia all'ARO (righe 1209–1211).

**La classificazione completa, dalla stessa chart** (righe 16620–16661). Serve per leggere
le liste chiuse degli stati, che nominano categorie e non nomi:

| Classe | Voci |
|---|---|
| **BASIC SHORT** | Discover · Idle · Move |
| **SHORT** | Activate Disco Ball · BS Attack · Carbonite · CC Attack · Controlled Jump · Deactivator · Doctor · Dodge · Engineer · Forward Observer · GizmoKit · MediKit · Morpho-Scan · Oblivion · Place Deployable · Reload · Reset · Sensor · Spotlight · Total Control · Trinity · White Noise · Zero Pain |
| **LONG** | Assisted Fire · Berserk · Cautious Movement · Climb · Combat Jump · Cybermask · Enhanced Reaction · Fairy Dust · Intuitive Attack · Jump · Parachutist · Sapper · Speculative Attack · Suppressive Fire · Triangulated Fire |
| **ARO** | BS Attack · Carbonite · CC Attack · Controlled Jump · Discover · Dodge · Forward Observer · Look Out! · Oblivion · Place Deployable · Reload · Reset · Spotlight · Total Control · Trinity · Zero Pain |

Si leggono incrociando le colonne. Le cose da ricordare:
- **SHORT ma NON ARO**, cioè solo in Turno Attivo: tutto il **Supporto** (Doctor, Engineer,
  MediKit, GizmoKit), **Sensor**, **Deactivator**, **Morpho-Scan**, **Activate Disco Ball**,
  **White Noise**.
- **Solo ARO**: **Look Out!**.
- **ARO ma non SHORT**: solo Discover (che è Basic Short) e Look Out!. Tutti gli altri ARO
  sono anche Short Skill.
- La **Schivata** è una Short Skill *oltre* che un ARO (righe 16646 e 16644): in Turno Attivo
  si dichiara come Breve, non è solo una reazione.
- **Fuori chart: la classe AUTOMATIC.** `Alert!` non è nella tabella perché è una
  **Automatic Skill** (righe 6774–6776), non consuma né Ordine né ARO e agisce nella
  Conclusione (riga 6785). Per lo stesso motivo non ci sono Mimetism, ECM, Firewall, Courage.
  Se il catalogo ha un campo di classe, serve una voce `AUTOMATIC` per queste, altrimenti
  cercare `Alert!` nella chart dà nulla e sembra un buco.
- **Fuori chart ma Long Skill per il testo dello stato**: `RIENTRARE IN CAMO` (riga 13603,
  «by spending a Long Skill») e il rientro in Impersonation (riga 14202). Vedi §1.18.

### Equipaggiamenti che SONO armi BS ma hanno il bersaglio vincolato

C'è una famiglia di equipaggiamenti che nel chart delle armi compare con tutti i connotati
di un'arma a distanza — Burst, fasce di tiro, MOD di Portata — e che però **non può essere
usata per un Attacco BS contro un nemico**, perché il REQUIREMENTS della sua Skill fissa chi
può essere il bersaglio. Sono tre, e vanno tenute fuori da due liste: quella delle armi
offerte per l'Attacco BS in Turno Attivo e quella delle armi offerte per la reazione BS in
ARO.

| Equip. | Classe | Bersaglio IMPOSTO dal REQUIREMENTS | Nel chart ARO? | Righe |
|---|---|---|---|---|
| **MediKit** | SHORT SKILL | «must be an **Allied Model with the VITA Attribute and in Unconscious State**» | **no** (16650 è in SHORT SKILLS) | 10886–10919 · 4249–4257 |
| **GizmoKit** | SHORT SKILL | «must be an **Allied Model with the STR Attribute**» | **no** (16649) | 10790–10831 |
| **Deactivator** | SHORT SKILL, etichetta Attacco | «can only target **enemy Deployable Weapons and Deployable pieces of Equipment that have been deployed** on the game table, **but never Camouflage Markers**» | **no** (16644) | 10603–10648 |

**Perché sembrano armi.** MediKit e GizmoKit, usati a distanza, lo sono davvero nella
*forma* del tiro: riga **10907** «Used remotely, a MediKit **is a Non-Lethal BS Weapon**. If
the user passes a **BS Attack Roll**, applying the corresponding MODs (for Range, Cover,
etc.), the target performs a single PH Roll». Il Deactivator è ancora più esplicito: nel suo
chart (righe 10641–10648) è `BS WEAPON (WIP) [***]`, B1, fasce **+6 / +3 / −6**. Quindi il
tiro c'è, i MOD ci sono, e l'app fa bene a calcolarli — ma il bersaglio **non è mai un
nemico vivo**.

**Perché non sono un Attacco BS.** Il REQUIREMENTS è un Requisito a tutti gli effetti
(§0, righe 1236–1247): se il bersaglio non è quello prescritto l'azione **non si può
dichiarare come quella Skill**, e se viene dichiarata e il requisito cade al momento della
Risoluzione si risolve in **Idle** con l'Ordine speso. Non esiste una versione "offensiva"
di MediKit o GizmoKit: puntarli su un nemico non è un Attacco BS a MOD peggiori, è
un'azione illegale. Il Deactivator, allo stesso modo, non spara a una miniatura: fa un
**Tiro Normale di WIP** contro un Deployable nemico già schierato, e riga **10625** limita
i MOD a quelli di **Portata** («The WIP Roll **only applies MODs for Range**, but not those
from Special Skills (for example Mimetism), or Cover»).

**Perché non sono AROs.** Il chart ufficiale (righe 16619–16661) le mette tutte e tre nella
colonna **SHORT SKILLS** — Deactivator a 16644, GizmoKit a 16649, MediKit a 16650 — e
**nessuna** compare nella colonna **AROS**, che si chiude a Zero Pain (riga 16654). Sono
quindi nel gruppo «SHORT ma NON ARO» del punto precedente: **solo Turno Attivo**.

**Regola operativa per l'app.** Un equipaggiamento che espone fasce di tiro non è per questo
candidato all'Attacco BS: il filtro giusto è la Skill che lo usa. Se la Skill ha un
REQUIREMENTS che impone la natura del bersaglio (alleato, Deployable, stato specifico),
l'equipaggiamento appartiene **solo** alla sua azione dedicata — Supporto per MediKit e
GizmoKit, azione su WIP per il Deactivator — e non va mai elencato né fra le armi dell'
Attacco BS né fra quelle della reazione BS in ARO. Il fatto che stia nel campo `weapon`
anziché in `equip` non cambia nulla: è un dato di catalogazione, non una regola.

### Etichetta Movimento — quali abilità ce l'hanno
Righe **12620–12621** («a Skill with the Movement Label such as Move, Cautious Movement,
Climb, Jump, or the Berserk Special Skill») più le righe 12154 e 12164–12170 che aggiungono
la **Schivata**. Quindi: **Movimento, Movimento Cauto, Arrampicarsi, Salto, Berserk,
Schivata**. Tutte e sei.

### Stato per stato

| Stato | In Turno Attivo | In ARO | Fonte |
|---|---|---|---|
| **Foxhole** | **tutto**: nessuna restrizione sulle dichiarazioni. Per **muoversi** va cancellato, annunciandolo **nella dichiarazione** | tutto ciò che potrebbe dichiarare normalmente, **ma la Schivata non dà movimento** e il Foxhole **non cade** | 13863–13875 |
| **Ritirata!** | Movimento, Scoprire, Idle (le tre Basic Short) + **Movimento Cauto**, Schivata, Reset. **Niente** Salto, Arrampicarsi, BS Attack, CC Attack, Hacking, Supporto | **solo** Scoprire, Schivata, Reset | 14557–14558, confermato dalla chart riassuntiva riga 16940 |
| **IMM-A** | **solo Schivata** (PH−6) | **solo Schivata** | 14130–14131 |
| **IMM-B** | **solo Reset** (WIP−3) | **solo Reset** | 14176–14177 |
| **Engaged** | Berserk, CC Attack, Schivata, **Idle**, Reset + skill che dicono di valere in CC | CC Attack, Schivata, Reset | 13804–13806 |
| **Stordito** | tutto **tranne gli Attacchi**, con −3 ai tiri | idem | 14614 |

### Il Foxhole: i tre effetti che toccano il calcolo

**Copertura Parziale a 360°** (riga 13865). Si applica **sempre e da sé**: riga **3453–3455**,
«If the target is in Partial Cover, the attacker **will apply** a −3 MOD to their BS Attack
Roll, and the target of the BS Attack applies a **+3** MOD to its Saving Roll (SR), if
necessary». "Will apply" — non è una scelta dell'attaccante, non si dichiara. Però:
- **Non vale nel Corpo a Corpo.** I MOD del CC sono una lista chiusa di due voci, righe
  **4384–4388**: «The MODs are: » Close Combat against several enemies. » Special Skills,
  Weapons and Equipment». La Copertura non c'è.
- **Niente +3 alla salvezza contro le Sagome**, righe **3619–3621**: «Troopers affected by a
  Template Weapon do not benefit from the +3 MOD to the Saving Roll (SR) for Partial Cover».
- Restano tutte le regole che la togliano: Marksmanship (righe 8876), Jump (2762–2763), Climb
  (2925–2926), Combat Jump (8059), Parachutist (9474–9475), Speculativo e Intuitivo che non
  applicano i MOD negativi (3922 e 4030–4031).

**Mimetism (−3)** (riga 13866). Il Foxhole **dà la skill**, non un MOD a parte, e la skill
Mimetism è **NFB** (riga **9109**: «NFB, Obligatory»). Quindi:
- 🔴 **non si somma** con il Mimetism di profilo. REGOLA SCRITTA: righe **6677–6680** e
  **14897–14899**, «a Trooper will only be allowed to have **one active** piece of Equipment,
  Hacking Program, or Special Skill with the Negative Feedback Trait». Mimetism (−6) in
  Foxhole fa **−6, non −9**.
- ⚠️ **quale dei due valga, il regolamento non lo dice.** Né il PDF né la wiki (pagine
  *Foxhole State* e *Mimetism* rilette il 6 ottobre). Le due letture possibili:
  **−6**, perché l'effetto del Mimetism rimanda al profilo («as shown in round brackets **in
  the Unit Profile**», righe 9114–9115) e perché nella stessa lista di effetti il Foxhole
  risolve già un conflitto analogo tenendo il valore del profilo quando è più alto (la
  Silhouette, riga 13864);
  **−3**, perché il glossario dell'NFB dice che l'ultimo attivato «cancel and override» gli
  altri (righe 14891–14896), e l'ultimo attivato è quello del Foxhole.
  Teniamo **−6**, l'analogia della Silhouette è nello stesso paragrafo. È una LETTURA: va
  marcata come tale nel codice, perché è una riga da girare se Corvus Belli chiarisce.
- Il Mimetism del Foxhole **è** soggetto all'NFB come quello di profilo, perché **è** quella
  skill. Conseguenza: se la truppa attiva un'altra voce NFB — Albedo, Holoprojector, il
  **Cybermask** (righe 5167–5171) — il Mimetism del Foxhole **cade**, e con esso il −3. Resta
  la Copertura 360°, che non è una skill e non ha l'NFB.

**Courage** (riga 13866) e **Silhouette 3** (riga 13864). Courage è Automatic, Optional, senza
NFB (righe 8081–8083): passa automaticamente i Guts. La Silhouette diventa 3, **ma se il
profilo ne ha una più alta si tiene quella** (riga 13864) — attenzione, la regola è "il valore
più alto", non "il migliore": un S2 in Foxhole diventa S3, cioè un bersaglio più grande.

### Il Foxhole: come funziona la cancellazione
Riga **13867**: «Foxhole State is a fixed position which **doesn't allow its user to perform
any type of movement, including movement granted by a successful Dodge Roll**». È un divieto
di **muoversi**, non di dichiarare.

Righe **13871–13874**: «A Trooper in Foxhole State **in the Active Turn** may automatically
cancel this state at the beginning of their movement by declaring a Skill with the Movement
Label. **The player must announce he is Canceling Foxhole State when declaring the Skill.**
By doing so, the state is canceled at no cost… In the same way, in the Active Turn, the
Trooper may automatically cancel this state at the beginning of a Dodge move.»

Quindi, nell'ordine:
1. Movimento, Movimento Cauto, Salto e Arrampicarsi **sono tutti dichiarabili** da
   Trincerato: hanno tutti e quattro l'etichetta Movimento (righe 12620–12621).
2. La cancellazione **non è obbligatoria**, ma senza di essa la truppa si muove di **zero**
   (riga 13867). Dichiarare un Movimento senza cancellare è legale e inutile.
3. L'annuncio va fatto **alla dichiarazione**, non dopo: «must announce… when declaring».
   Per l'app è un interruttore nella schermata del movimento, non una domanda a posteriori.
4. Cancellando si perde **tutto** quello che il Foxhole dava — Copertura 360°, Mimetismo −3,
   Courage, S3 — e si recuperano MOV e Silhouette veri (righe 13875–13876).
5. La cancellazione in Schivata vale **solo in Turno Attivo** (riga 13873). In ARO il
   Trincerato schiva normalmente ma **non si sposta** (riga 13867), e resta Trincerato: la
   lista di cancellazione (righe 13869–13875) ha solo il Prono e i due casi del Turno Attivo.
   Un Trincerato è quindi un'ottima piattaforma d'ARO: spara, tiene la Copertura 360° e il
   Mimetismo, e non si rivela.

### L'Idle: è una Skill, e questo decide tre caselle
Riga **16623**: IDLE, Basic Short Skill, Common, p.80. Riga **7444**: «Common Skill that
allows the user to execute no action at all». **L'Idle è una Skill.** Quindi:

- **IMM-A** (riga 14130, «cannot declare any Skill or ARO, **except Dodge**») e **IMM-B**
  (riga 14176, «any Skill, Attack or ARO, **except Reset**»): l'Idle **non è dichiarabile**.
- **Engaged** (righe 13804–13806): lo **nomina**, quindi sì. È la controprova che il
  regolamento considera l'Idle una Skill da autorizzare esplicitamente.
- **Ritirata!** (riga 14557): è una Basic Short Skill, quindi **sì**, è compreso.

> 🔴 **E allora cosa dichiara un Immobilizzato che non vuole Schivare?** Niente, e il
> regolamento chiama *quel niente* un Idle: righe **7454–7456**, «Whenever a Trooper that
> received an Order in the Active Turn **chooses not to perform an action** with one of the
> two Short Skills of that Order, that Trooper **is considered to declare Idle**».
> Non è una dichiarazione del giocatore: è il nome che le regole danno all'inazione. Le due
> righe non si contraddicono — la 14130 vieta di **dichiarare** l'Idle, la 7454 descrive cosa
> **è** il non dichiarare nulla. Per l'app: l'Idle non va offerto nel menù di IMM-A e IMM-B,
> e l'ordine che si chiude senza dichiarazioni si risolve come Idle da solo.

---

# 8. FIRETEAM E ORDINE COORDINATO

## 8.1 Fireteam

| Livello | Bonus (cumulativi) |
|---|---|
| 1 | un Ordine Regolare attiva tutti i membri |
| 2 | `BS Attack (+1 SD)` — non su Long Skill né Sagome Dirette; vale per MediKit/GizmoKit |
| 3 | +3 Discover, +1 Schivata |
| 4 | +1 BS su BS Attack (anche BS Weapon (PH)/(WIP)); **non** sui Programmi di Hacking |
| 5 | Sixth Sense a tutti |

- Il **livello** dipende da quanti membri sono della stessa unità, non dal totale.
- Il Bonus Burst di Fireteam ha etichetta **Optional**.
- Esce dal Fireteam chi entra in **Isolato o qualsiasi stato Null**, in Soppressione, in forma Marker, o diventa **Controller di una Periferica** (5.3).
- Il Fireteam si cancella se il **Leader** entra in Isolato o Null.
- Perdere una truppa "obbligatoria" non cancella il Fireteam (F13); il **tipo** non cambia perdendo membri (F14).
- In CC con più membri ingaggiati tira solo il Leader (o un membro ingaggiato, in Reattivo).

## 8.2 Ordine Coordinato

| | |
|---|---|
| Costo | 1 Command Token + 1 Ordine Regolare |
| Partecipanti | fino a 4, stesso Training e Gruppo di Combattimento |
| Burst | Spearhead: **metà per eccesso**, bonus inclusi · altri: **1** |
| `+1 SD` | **vale** (F04: non cambia il Burst) |
| CC | attacca solo lo Spearhead, +1 B per alleato in contatto |
| Esclusi | Speculativo e Intuitivo, Periferiche e Controller, membri di Fireteam, Isolati |
| Reazioni | ogni reattivo sceglie **un** bersaglio fra gli attivati; Schivata e Reset sono F2F |
| Sorpresa | se più partecipanti hanno Surprise Attack sullo stesso bersaglio, **non si sommano** (F02) |

---

# 9. COSA È CAMBIATO IN 5.2 E 5.3 (rispetto al .txt v5.1.1 del progetto)

| Versione | Regola | Effetto sul calcolo | Scheda |
|---|---|---|---|
| **5.3** (set 2026) | CC con più truppe: basta **2 o più** in contatto (prima "più di 2") | +1 B per alleato scatta prima | 1.2, 1.12 |
| **5.3** | Aggiunto fra gli esempi di notazione `PARA CCW (−6)` (*chiarimento* su come si legge il MOD, come `Dodge (ARM +3)`) | **nessuno**: non cambia il valore delle armi, che resta per profilo | 1.2 |
| **5.3** | Movimento: rotazione libera a fine movimento, metà base sulla superficie | nessuno | 1.11 |
| **5.2** (ott 2025) | Guidato senza modalità circolare: si applica comunque la Sagoma Circolare centrata sul bersaglio | quale modalità/munizione | 1.5 |
| **5.2** | `Dodge (-3)` = −3 agli avversari nel F2F quando si Schiva | lato attaccante | tutte |
| **5.2** | Surprise Attack: il MOD vale sui **Faccia a Faccia** dei bersagli in ARO (5.1.1, riga 10116: "any Skill Roll") | un Reset/Schivata **Normale** non lo subirebbe. ✅ **Adottata** (decisione di Paolo: vale la wiki); ⏳ da applicare nel motore | tutte |
| Mazebreaker (mag 2026) | `Dodge (ARM +3)` | +3 ARM se la Schivata fallisce | tutte |
| FAQ N5 | Le skill con etichetta BS Attack (Intuitivo, Speculativo, FO…) contano come BS Attack per `(SR-1)`, `(AP)`, `(+1 SD)`; il `+1 SD` mai su Long Skill | salvezze | 1.3, 1.4, 1.13 |
| Regola generale | I MOD con etichetta **Optional** (es. Bonus Burst di Fireteam) sono facoltativi | Burst | tutte |
| **5.2** | `Doctor (ReRoll −X)` e `Engineer (ReRoll −X)` diventano `(ReRoll WIP=X)`: si ritira **usando** il WIP fra parentesi invece di applicare un malus | cambia il SV del ritiro | §0 |
| **5.2** | **Journalist**: skill *nuova*, aggiunta in 5.2 — per questo non è nel nostro .txt 5.1.1. Automatic, Optional. Truppe nella ZdC di un Journalist **alleato**: **+3 al Guts Roll**; nella ZdC di uno **nemico**: **−3**. In campagna anche +3 a CUBEVAC e Promozione, non cumulabili fra più Journalist | nessuno **finché l'app non tira i Guts**. 3 profili PanOceania | §5 |
| **5.2** | **FT Master**: Automatic, Obligatory. Nel Conteggio Ordini rende **Regolari** tutti i membri del suo Fireteam; se lo sono già, **+2"** alla ZdC del Leader per i controlli di Coerenza; e il Fireteam si annulla se il FT Master lo lascia | **nessuno**: non tocca tiri, MOD né Burst | — |

> ⚠️ **Trappola della wiki, da sapere prima di citarla.** Le pagine aggiornate mostrano **due
> versioni affiancate**: una casella marcata *Update PDF 5.2/5.3* e una marcata ***Original***.
> La casella **Original NON è la regola corrente**: è il testo precedente. Esempio verificato
> l'8 ottobre sulla pagina *Ballistic Skills*: l'Original dice «A Trooper who is **on** a
> vertical surface cannot benefit from Partial Cover MODs» (N5.2), l'Update N5.3 dice «A Trooper
> who is **performing a Climb Skill or holding onto** a vertical surface…». Il nostro .txt 5.1.1
> (righe 2925–2926) dice già quest'ultima: **nessuna correzione da fare**, ma chi legge la
> casella sbagliata si ritrova con la regola di due versioni fa.


---

# 10. ESITO DELLA VERIFICA — stato al 2026-09-21

Motore (primo giro) `2026-09-21.3 · d904c200.403019`, catalogo `2026-09-21.1 · 00f2248b.149543`.

| # | Punto | Stato |
|---|---|---|
| 1 | Speculativo contro Bersagliato: −6 sempre, +3 dal ramo generale | ✅ corretto |
| 2 | Filtro armi Intuitivo/Speculativo sui Tratti | ✅ corretto (riga 1044) |
| 3 | SV sotto 1 = fallimento automatico (anche due clamp nel Tiro Salvezza) | ✅ corretto |
| 4 | Tetto ±12 su Reset e Schivata, con voce `limite` | ✅ corretto |
| 5 | Niente +1 WIP di Fireteam ai Programmi | ✅ corretto |
| 6 | Secondari del Guidato possono Schivare | ✅ corretto |
| 7 | Total Control e Trinity verificati sulla chart | ✅ |
| 8 | CC con 2 o più truppe (5.3) | ✅ già conforme |
| 10 | Total Control su proprio TAG Posseduto (riga 5286) | ✅ |
| 11 | Jammer: profilo nel Weapon Chart, riga dati **16403** (Tratti 16401–16405) | ✅ A47 tolto |
| 12 | MadTraps | ✅ già funzionante |
| — | PARA CC Weapon: salvezza sempre PH−6, (−X) del profilo sul F2F dell'avversario | ✅ corretto · ⚠️ vedi sotto |
| — | T2 / RULES_AMMO rimossa | ✅ (DATABASE `189863f4.47569`) |
| — | Surprise Attack 5.2 (solo F2F, solo bersagli) + Reset Normale contro BS/CC | ✅ MOTORE 2026-09-21.13 |
| — | MSV L3 e Biometric Visor ignorano la Sorpresa | ✅ MOTORE 2026-09-21.10 / .13 |
| — | Saturazione: −1 per bersaglio, minimo 1, anche per il reattivo | ✅ MOTORE 2026-09-21.14 |
| — | F17 (MSV L1 + Sesto Senso attraverso Zona Zero) | ✅ MOTORE 2026-09-21.14 |
| — | Total Reaction / Neurocinetics: Burst pieno dell'arma in ARO | ✅ MOTORE 2026-09-21.16 (in SF Mode resta B3) · ℹ️ in Soppressione l'ARO in modo normale non è offerto: solo nota |
| — | Rumore Bianco, bersaglio che risponde attraverso Zona Zero, non cumulo dei MOD di visibilità | ✅ DATABASE `997b877e.49987` + MOTORE `009a8172.424958` · ⏳ "bersaglio" da limitare a chi è davvero bersaglio di un BS Attack |
| — | D-Charges: bersagli espliciti, Disposable (3) condiviso, piazzate via Place Deployable, vietate in ARO | ✅ DATABASE `f037b285.48291` + MOTORE `417c5d35.410226` (chiamata a riga 7204, test dal modulo) |
| — | Stati Null (5): Morto, Incosciente, Disconnesso, Posseduto, Sepsitorizzato — righe 13734, 13820, 14500, 14580, 14691. "Null" = niente Ordini né PV (14910), **non** "non agisce" | ✅ MOTORE `519a9ce2.412650`: `M.eNullo` su Soppressione, Fireteam (×2), D-Charges; lista "può agire" su ARO e Foxhole |
| — | Firewall del **Dispositivo di Hacking** disattivato se la truppa è Isolata o in qualsiasi stato Null — FAQ 0.1 (set 2026), wiki pagina *Firewall*. In N5.3 il Firewall diventa *Automatic Equipment* | ✅ fonte trovata · ⏳ MOTORE: estendere a `M.eNullo`, limitare al Firewall da Hacking Device |

**Natural Born Warrior, Sesto Senso e Sorpresa** (motore `2026-09-21.5 · d9958336.407923`):

| Caso | Regola | Stato |
|---|---|---|
| NBW che dichiara CC Attack: ignora Martial Arts, PARA (−X), CC Attack (−N) e Sorpresa del nemico | righe 9266–9267 (requisito doppio), 9270–9271, esempio 9275–9282 | ✅ tutte e quattro le fonti |
| NBW che **schiva** un attacco con PARA: il (−X) resta | requisito doppio | ✅ |
| Sesto Senso: annulla la Sorpresa **solo** su Schivata e Reset | riga 9941 | ✅ |
| Sorpresa letta dal profilo: (−6) dà −6, (CC−6) solo nel CC | righe 10134–10144 | ✅ |
| Anteprima CC = risultato (funzione unica `M.modProfiloAvversario`) | — | ✅ |

---

**Entrare in forma di Marker — verifica del 6 ottobre 2026** (scheda §1.18). Metrica:
`REGOLE_N5_v5.1.1.txt`, impronta `5ea7581f.904498`, 17029 righe. Wiki riletta: *Camouflaged
State* (PDF 5.3, set 2026), *Impersonation State* (PDF 5.2, ott 2025), *Order Expenditure
Sequence* (PDF 5.2, ott 2025) — tutte tre confermano il testo del PDF alla lettera.

| Caso | Regola | Esito della verifica |
|---|---|---|
| Cybermask in LoF nemica → **IDLE** | 5155–5156 (REQUIREMENTS) + 1240–1247 | ✅ **confermato** |
| Rientro CAMO in LoF nemica → **IDLE**, non VIETA | 13603 + 1240–1247 + esempio 14298–14316 («lose his Order») | ⚠️ **correzione**: la chat REGOLE il 5 ottobre aveva detto VIETA. Era sbagliato: il regolamento chiama *Requirement* la condizione del 14202, identica a quella del 13603 |
| Rientro Impersonation in LoF nemica → **IDLE** | 14202, stessa clausola | ✅ |
| Combat Jump / Ingresso in campo → **VIETA** | 8049–8053, nessun blocco REQUIREMENTS: vincolo di piazzamento | ✅ **resta VIETA** |
| Trincerarsi (Sapper) → **IDLE** | **9841–9847**, testuale: «will perform an Idle instead» | ✅ confermato, ma le righe citate nel commento del motore (7415–7431) sono quelle di un esempio di Schivata: da correggere |
| Speculativo contro IMP-1 / IMP-2 come Principale → **vietato** | 14207–14208, nessuna clausola di eccezione; 14210 per l'Intuitivo | ✅ **confermato** |
| Speculativo contro Marker CAMO come Principale → **vietato** | 13609–13610 + le sole due eccezioni scritte: Intuitivo 4017–4022, MSV L3 11011–11015; 11399–11401 distingue BS Attack e Speculativo | ⚠️ **correzione**: oggi l'app lo ammette. LETTURA, non regola scritta: la pagina wiki *Speculative Attack* non è stata riletta |
| Marker CAMO che dichiara Cybermask → **ammesso** | 13635 (il CAMO cade) + 13645–13648 + 5159–5161 | ✅ va permesso, con la nota sulla rivelazione |
| Livello di rientro in Impersonation | 8667 · **8669** («deploy **and activate**») · esempio 14301–14305 | ✅ `Impersonation` → IMP-1 · `Impersonation (IMP-2)` → IMP-2 · Cybermask → sempre IMP-2 (5159) |
| Cybermask in Isolato → non disponibile | 14412–14413 (programmi di Hacking disabilitati) | ✅ |

---

**Hacking attraverso un Ripetitore nemico — verifica del 6 ottobre 2026** (scheda §1.6).
Metrica: `REGOLE_N5_v5.1.1.txt`, impronta `5ea7581f.904498`. Wiki riletta: *Hacking Area*
(PDF 5.2, ott 2025), *Firewall* (PDF 5.3, set 2026), *Speculative Attack* (oldid 3548,
allineata a N5.3) — tutte e tre confermano il testo del PDF alla lettera.

| Caso | Regola | Esito |
|---|---|---|
| −3 al WIP e +3 alla salvezza | 4837–4842 · 4850–4852 · 4941 · 4944–4945 | ✅ **confermato** |
| Bersaglio non Hacker → Idle | 4799–4802 | ✅ **confermato**, è un Requisito: Ordine speso |
| Due Firewall → **scelta del giocatore del bersaglio**, non massimo automatico | 4761–4763 · 4844–4846 | ⚠️ esito uguale, meccanica diversa. E il +3 alla salvezza è **fisso**, non scalato (4771–4774) |
| «Hacker» = **skill Hacker**, non il Dispositivo | 4698–4701 (Automatic Skill, Obligatory) · 4704 (il Dispositivo è equip che l'Hacker *può* avere) · **4823** («the Hacker Special Skill on their real Unit Profile») | ⚠️ la lettura «skill **o** Dispositivo» è troppo larga: il test è la skill. Censimento a DATABASE |
| `ECM (Hacking −3)` non rende Hacker | 10729–10743 (Automatic Equipment) · 6655 (fra parentesi c'è il tipo d'attacco) | ✅ confermato. E l'ECM **si somma** al Firewall, perché non è un Firewall; non dà +3 alla salvezza |
| HoloMask: bersaglio finto Hacker | **4818–4825** | ⛔ non modellato, e non era in elenco: è il caso gemello di quello sotto |
| HoloMask: Ripetitore finto | 4827–4833 | ⛔ non modellato |
| Nessuna reazione contro il Ripetitore usato | 4853–4854 | da verificare nel modulo ARO |
| Speculativo contro Marker CAMO come Principale: vietato | 13609–13610 + assenza di eccezione verificata su **PDF e wiki** | ✅ promosso da LETTURA a **ricerca esauriente**: la pagina wiki *Speculative Attack* non nomina mai Marker né Stati |

---

**Risposte di DATABASE `2026-10-06.1` e cosa chiudono** (765 profili;
`database_nomad.js 15cb7716.154798`, `database_panoceania.js 4a97dcf6.152854`,
`database_comune.js 1323de62.58651` invariato; fonte ARMY 7.26246.158).

| Punto | Esito |
|---|---|
| **Hacker senza Dispositivo**: 0 profili | ✅ e la regola li **ammette**: righe 4707–4708, l'Hacker può «make direct use of certain Programs **without requiring a device**». Il regolamento però non dice **quali** programmi: nessun'altra occorrenza in 17029 righe. Quindi un Hacker senza Dispositivo è legale ma non implementabile — niente elenco nella fonte, nessun profilo nei dati. L'avviso A90 non vada trattato come errore di dato |
| **Dispositivo senza la skill Hacker**: 0 profili | ✅ nelle due fazioni i due test coincidono. Il test resta però la **skill** (riga 4823), non il Dispositivo: è la condizione scritta, e regge quando arriverà una fazione nuova |
| **Notazione `ECM (Hacking −X)`** | ✅ **confermata dalla fonte che prevale**: wiki *Template:Modifiers-explained*, PDF 5.3 set 2026, scrive `ECM (Hacking -3)` alla lettera, accanto a `Mimetism (-3)`, `Combat Jump (PH=10)` e `Immunity (POS)`. Non è solo il PDF del progetto: è la wiki a N5.3. L'app ARMY scrive `ECM: Hacker`, ma per la **notazione** vale la wiki |
| **`Guided` non è una skill** | ✅ la controprova interna di DATABASE tiene: il regolamento scrive `BS Attack (Guided)` (riga 3333) e «Guided Attack» (riga 11168). È un tipo d'attacco, mai il nome di una skill. Coerente coi REQUIREMENTS dell'ECM (righe 10732–10736: «the **Attack type** listed in round brackets») |
| **Impersonation**: 0 profili | ✅ nota aggiunta in §1.18. La regola resta scritta e serve a leggere i Marker IMP nemici, che il **Cybermask** mette sul tavolo già oggi senza la skill |
| **Sottostringa `HACKER`** | ⚠️ non è un caso singolo: cinque coppie di nomi che si contengono esistono nel regolamento, elencate in §0. Rinominare l'ECM chiude il caso, non la classe |

---

**Dichiarazioni per stato — verifica del 6 ottobre 2026** (nuova §7.1). Nata da tre
divergenze fra il menù di `app.html` e le liste chiuse del catalogo.

| Caso | Chi aveva ragione | Regola |
|---|---|---|
| Foxhole: Movimento / Cauto / Salto / Arrampicarsi **dichiarabili** | **MOTORE** | 13867 vieta di *muoversi*, non di dichiarare; 13871–13874 danno la cancellazione. Tutte e quattro hanno l'etichetta Movimento (12620–12621) |
| Foxhole: la cancellazione va **annunciata alla dichiarazione** | — | 13872, «must announce… when declaring». Nessuno dei due la chiedeva |
| Ritirata!: **Salto vietato** | **INTERFACCIA** | il Salto è una **Long Skill** (chart riga 16631) e la riga 14557 ammette solo le Basic Short, il Cauto, la Schivata e il Reset |
| Ritirata!: **Arrampicarsi vietato** | nessuno dei due | stessa ragione, chart riga 16627 |
| Ritirata!: **Idle ammesso** | **INTERFACCIA** | l'Idle **è** una Basic Short Skill (chart riga 16623), quindi è compreso nella 14557. La lista chiusa del motore lo omette |
| Ritirata!: **niente BS Attack in ARO** | — | il BS Attack è una Short Skill/ARO e la 14557 non lo nomina. Da verificare nel modulo ARO |
| IMM-A e IMM-B: **Idle non dichiarabile** | **MOTORE** | l'Idle è una Skill (16623 + 7444) e le righe 14130 / 14176 vietano «any Skill… except Dodge / except Reset». L'inazione resta possibile ed **è** l'Idle (7454–7456) |
| Engaged: **Idle dichiarabile** | **MOTORE** | 13805 lo nomina per esteso |
| ARO: **non** vale la stessa lista del Turno Attivo | — | va intersecata con la colonna AROS della chart (16639–16654) e con la riga 6732 (le Long Skill solo in Attivo). IMM-A e IMM-B sono le uniche due che dicono già «or ARO» |

---

**Programmi, Foxhole e classi d'azione — verifica del 6 ottobre 2026, secondo giro.**
Wiki riletta: *Foxhole State* (PDF 5.2, ott 2025) e *Mimetism* (oldid 3102) — nessuna delle
due chiarisce il doppio Mimetism.

| Caso | Esito |
|---|---|
| Programma contro un bersaglio del tipo sbagliato → **Idle** | ✅ **confermato**, e la prova è la skill **Non-Hackable**, righe **9415–9417**: chiama *Requirements* la colonna TARGET. Quindi 1244–1247: Ordine/ARO speso, Marker rivelato (7462–7463) |
| Copertura 360° del Foxhole applicata **sempre**, senza dichiararla | ✅ righe 3453–3455, «the attacker **will apply**» |
| Copertura **non** nel Corpo a Corpo | ✅ righe 4384–4388, lista chiusa di due MOD: la Copertura non c'è |
| Niente **+3 alla salvezza** contro le Sagome | ⚠️ non era nell'elenco: righe 3619–3621 |
| Mimetism del Foxhole: **non si somma** | ✅ **confermato**, NFB: 9109 + 6677–6680 + 14897–14899 |
| Mimetism del Foxhole: **quale valore** | ⚠️ **non scritto da nessuna parte**. Teniamo −6 (9114–9115 rimanda al profilo; e la riga 13864 risolve così il conflitto gemello della Silhouette), ma è una **LETTURA**, non "il più negativo" come regola. La lettura contraria (−3, righe 14891–14896) è plausibile |
| Mimetism del Foxhole soggetto a NFB | ✅ sì, **è** quella skill. Cade se la truppa attiva Albedo, Holoprojector o il Cybermask (5167–5171) |
| CLASSI_AZIONE, tutte le voci dichiarate da MOTORE | ✅ **tutte corrette**, nessuna da cambiare. Movimento non è ARO, Scoprire sì (16624 e 16643) |
| CLASSI_AZIONE: manca la classe **AUTOMATIC** | ⚠️ `Alert!` è una Automatic Skill (6774–6776) e per questo non è nella chart. Non consuma Ordine né ARO |
| Silhouette del Foxhole | ℹ️ S3, **ma il profilo vince se è più alto** (13864): è "il più alto", non "il migliore" |

---

**Sparare nel CC, piazzamento, Idle dopo gli ARO e la manovra Discover + Attack —
verifica del 7 ottobre 2026.** Metrica `5ea7581f.904498` (il caricamento
`REGOLE_N5_v5_1_1.txt` del 6 ottobre è **identico** byte per byte a quello su cui citiamo da
sempre: verificato con `cmp`).

| Caso | Esito |
|---|---|
| **BS Attack nel CC**: "Allied" = alleato di **chi spara** | ✅ righe 3393–3396: il tiro fallito «will hit the **Allied** Trooper» e «the **Trooper's player** chooses which one». È fuoco amico |
| −6 **per ogni alleato**, e si somma a gittata/copertura/mimetismo, poi −12 | ✅ riga 3391, «in addition to any MODs for Range, Cover, Mimetism…» |
| Con **zero** alleati nel CC: **nessun MOD** | ⚠️ il default 1 va bene nel caso normale, ma il conteggio è sugli alleati: se non ce n'è, il −6 non si applica |
| Copertura del bersaglio ingaggiato: vale su tiro **e** salvezza | ✅ 3391 e 3453–3455 |
| Armi a **Sagoma** nel CC: il colpo si **annulla**, non si penalizza | ⚠️ non era in elenco: 3622–3626 + 3586–3594 |
| **Place Deployable è SHORT, quindi sempre la SECONDA metà** | ⛔ **lettura MOTORE sbagliata e invertita**: riga 7550 (SHORT SKILL / ARO) + righe 1047–1054 (solo `BasicShort+BasicShort`, `BasicShort+Short`, `Long`, «in the order shown»). Combinazioni: Movimento/Scoprire/Idle **+** Piazzare |
| Token alla **Conclusione**, nemico reagisce solo a chi piazza | ✅ righe 7563–7565 |
| Etichetta *Attack* del Place Deployable | ⚠️ conseguenze: lo Stordito non può dichiararlo (14614) e un Marker CAMO si rivela (13634) |
| **Idle da requisito fallito non riapre gli ARO** | ✅ **confermato**: passo 4 contro passo 5 (1196–1217) e un solo ARO per Ordine (1097–1101) |
| …ma l'ARO già dichiarato diventa un **Tiro Normale** | ⚠️ non era in elenco: righe 2068–2070, senza azione dell'attivo non c'è Faccia a Faccia |
| **Discover + Attack**: sequenza completa | ✅ tutto scritto nell'IMPORTANT delle righe **6817–6829**, più l'esempio alle righe 6860–6949. Nuova §1.7 lettera F |
| Discover + **Intuitivo** o + **Speculativo**: impossibile | ⚠️ sono Long Skill (chart 16630, 16634). L'Intuitivo è la manovra alternativa, non combinabile |
| Discover + Attack contro **IMP-1**: vietato | ⚠️ 14207 senza eccezioni; e scoprire IMP-1 porta a IMP-2 (14227–14229), non al Modello. Servono due Ordini |
| Discover + Attack contro **IMP-2**: solo **BS Attack** | ⚠️ righe 14291–14293, «The only exception is declaring Discover + **BS Attack**» |
| Marker **IMP** sotto una sagoma: il colpo è **annullato** | ⛔ **correzione mia del 6 ottobre**: avevo scritto che un Marker poteva essere bersaglio secondario. Vale per il CAMO, **non** per l'IMP: righe 14283–14289, «Any shot with a Template Weapon that affects an Impersonation Marker is **canceled**, even if another Enemy Trooper was designated as the Main Target» |

---

**Burst diviso e requisito mancante — verifica del 7 ottobre 2026.** Metrica `5ea7581f.904498`.

| Caso | Esito |
|---|---|
| Si perdono **solo i dadi** del bersaglio senza requisito | ✅ **REGOLA SCRITTA**, righe **3111–3114**. Non è una lettura: è l'eccezione espressa alla regola generale delle righe 1244–1247 |
| Se **tutti** i dadi perdono il requisito | ⚠️ non resta niente da tirare: si ricade sulla 1244–1247, **Idle**. È il caso del bersaglio unico senza LoF |
| ARO di quel bersaglio → **Tiro Normale** | ✅ righe 2068–2070. L'ARO non si riapre e non si annulla: cambia solo tipo di tiro. Schivata Normale riuscita = movimento comunque (7271–7273) |
| Uso **Disposable**: si consuma | ✅ in entrambi i rami: righe 1246–1247 e, per la gittata, riga 3513 |
| **Gittata** e **LoF** non sono la stessa cosa | ⚠️ i Requisiti dell'Attacco BS sono due (righe 3320–3323) e **la gittata non c'è**. Fuori gittata l'attacco «automatically fails» (3512–3514): il dado si tira-e-fallisce invece di perdersi. Esito identico, base diversa |
| La regola vale oltre l'Attacco BS | ⚠️ la riga 3112 dice «dice of the Burst (B) assigned to a target»: vale per ogni attacco col Burst diviso, CC e programmi di Hacking compresi |

---

**Scoprire in Coordinato e Scoprire + Piazzare — verifica del 7 ottobre 2026, pomeriggio.**
Metrica `5ea7581f.904498`. ⚠️ La pagina wiki *Coordinated Order* **non** è stata riletta (la
richiesta di accesso è scaduta due volte): queste risposte poggiano sul PDF.

| Caso | Esito |
|---|---|
| **A1** — basta **uno** Scoprire riuscito | ✅ lettura confermata, e più solida di quanto sembrasse: righe **11427–11429** («on a common target, **any successful Roll** means that the Skill was successful», con «such as» che apre la categoria) + 6842–6843 (il Marker è rimosso dal tavolo) + 1058–1059 e 3603–3606 (simultaneità). Resta **LETTURA** perché la 11427 non nomina lo Scoprire e la 6824–6826 è al singolare |
| **A2** — Burst dello Scoprire: 1 per tutti | ✅ ma per un'altra ragione: lo Scoprire **non ha Burst** (righe 6832–6855), quindi non c'è nulla da dimezzare. ⚠️ Il dimezzamento dello Spearhead vale in pieno sulla **seconda metà**, l'Attacco BS (righe 11366–11370): è lì che il calcolo cambia |
| **A3** — si rivela per tutti, nessuno tira lo Scoprire | ✅ righe 13634 (ogni ARO ammesso contro un Marker richiede un tiro) + 6822–6823 |
| **A3** — «uno in F2F, gli altri Normali» | ⛔ **vero solo se l'ARO è un Attacco.** Se il Marker **Schiva**, è **un** tiro PH in Faccia a Faccia contro **tutti e quattro** gli attacchi: righe **7258–7263**, «to evade all enemy Attacks during an Order or ARO… **or shots from several opponents**», e 11405–11406 al plurale. Tabella completa in §1.12 lettera E |
| **A-extra** — chi fallisce lo Scoprire brucia il tentativo | ⚠️ riga 6845–6846: in un Coordinato a 4 tirano tutte e quattro, e tutte e quattro restano fuori da quel Marker per il turno |
| **A-extra** — in Coordinato è l'unica via contro un Marker | ⚠️ righe 11399–11401: Speculativo e Intuitivo sono vietati dentro un Coordinato |
| **B** — Scoprire e Piazzare sono indipendenti | ✅ confermato: il Piazzamento non è un Attacco contro il Marker, quindi non c'è la dipendenza della manovra *Discover + Attack* |
| **B** — la Trigger Area si valuta alla **Conclusione**, non alla dichiarazione | ⚠️ riga **7572** dice «cannot be **placed**» e il token si piazza alla Conclusione (riga 7563), che è il passo 5.2 (1219–1223): lo Scoprire si risolve prima. Se riesce, nella Trigger Area c'è «a valid, non-camouflaged enemy» e la restrizione **non si applica** (7573). **LETTURA**, con la lettura contraria indicata in §1.14 |
| **B** — e se il Marker nella Trigger Area è un **altro** | ⚠️ lo Scoprire non aiuta: la restrizione resta e serve l'Intuitivo. La domanda unica di oggi non distingue i due casi |

---

**Intuitivo sulla mischia, PS=X e Drop Bears +1SD — verifica dell'8 ottobre 2026.**
Metrica `5ea7581f.904498`.

| Caso | Esito |
|---|---|
| **1a** — Intuitivo con Sagoma su una mischia con un proprio alleato: colpo **annullato** | ✅ **confermato**: righe **3584–3590** (l'alleato nell'area annulla il colpo) + **3622–3626** (la Sagoma nel CC prende tutti i coinvolti). L'uso Disposable si consuma e gli ARO restano (3593–3594) |
| **1a** — il **−6** per alleato **non** si applica | ✅ **confermato**: righe 4029–4031, «an unmodified WIP Roll… **or any other source** do not apply» |
| **1a-extra** — quando il caso è raggiungibile | ⚠️ un Engaged non può essere un Marker (13608, 14206, 13636, 14240): resta **solo** il ramo della Zona di Visibilità Zero del requisito (4017–4022) |
| **1b** — esistono armi Intuitive Attack **senza** Sagoma? | ⚠️ **una sola: il Jammer** (righe 16401–16405). Tutte le altre, in tutte le chart, sono Sagome Dirette |
| **1b** — il fuoco amico della riga 3393 vale per il Jammer? | ❌ **no**, e quindi la nota non serve: il Jammer è un **Comms Attack**, e la riga 3389 parla di «a **BS Attack**… engaged in CC Combat». Né −6 né fuoco amico |
| **2** — `Heavy Rocket Launcher (PS=5)` sovrascrive il PS 6 del Blast Mode | ✅ **sì, REGOLA SCRITTA**, e l'esempio del regolamento è letteralmente quest'arma: righe **6659–6660**, «the PS of this Weapon is 5 in all usage Modes, **regardless of the different PS values listed in the Weapons Chart for its Modes**». Chart: Blast PS 6 (16022), Hit PS 5 (16025) |
| **3** — `Drop Bears (+1SD)` vale alla detonazione? | ❌ **no**. Il Deployable Mode è **Direct Template** (riga 6177) e la riga **1958–1959** esclude il +1SD da «Skills, Weapons, or Equipment that do not require a Roll, for example, Direct Template Weapons» |
| **3** — dove vale allora | ⚠️ **solo** nel lancio in **BS Mode dichiarato come BS Attack**. Non come Fuoco Speculativo né via Attacco Intuitivo: sono **Long Skill**, e la riga **1957** le esclude |

| Lanciafiamme **non** Disposable | ⚠️ **correzione**: nel messaggio dell'8 ottobre avevo scritto che fra le armi Intuitive «il Drop Bear e il Lanciafiamme sono Disposable». Il Drop Bear sì (6165–6167), i **Lanciafiamme no**: chart righe **15321–15339**, solo *Intuitive Attack, Continuous Damage, Direct Template*. Segnalato da MOTORE, misurato sul database e verificato in chart. Il prontuario non conteneva l'errore; ora contiene i due profili (§1.3 lettera F) |

**Annullamento della Sagoma per alleato: colpo o bersaglio? — verifica dell'8 ottobre, sera.**

| Caso | Esito |
|---|---|
| Burst 1 su più bersagli sotto una Sagoma, un alleato nella mischia di uno: **annullato per tutti** | ✅ **confermato**. L'unità è il **colpo** (righe 3584–3590, «that shot is cancelled»), e con Burst 1 il colpo è uno: righe 3746–3757, una Sagoma Circolare fa un tiro solo, e il Principale serve solo per i MOD. La vecchia resa (Principale annullato, secondario colpito) trattava il bersaglio come unità ed era sbagliata |
| La parentesi «but not other shots of that same Burst» | ⚠️ è la prova a contrario: esiste perché un Burst può contenere più colpi. Con Burst 1 è vuota |
| Burst 2+: annullamento **per colpo** | ✅ corretto, ma l'unità giusta della domanda è il **colpo**, non il bersaglio. Le due coincidono col Burst diviso 1+1 **tranne** quando la Sagoma di un colpo arriva a coprire la mischia di un altro bersaglio: lì va annullato anche quel colpo (stesso principio delle righe 14285–14289 per i Marker IMP) |
| Serve una domanda nuova al giocatore? | ⚠️ non una in più: una **riformulata**. «C'è un alleato o un neutrale nell'area di *questo colpo*?» è letteralmente il test della riga 3587, si risponde guardando il tavolo, e degenera in una sola domanda col Burst 1. Chiedere «questa Sagoma prende anche quel bersaglio?» costa una domanda per ogni coppia colpo×bersaglio per la stessa informazione |
| Il **Fumo** non si annulla mai | ⚠️ righe 3586 e 3601–3602: una Sagoma senza PS e che non infligge Stati può colpire gli alleati |
| In Coordinato/Fireteam basta che l'alleato ci sia **passato** | ⚠️ righe 3603–3606, «at any time during that Order» |

| Quanti alleati possono stare nella mischia | ⚠️ righe **4422–4425**: max **4** in contatto su base 25 mm, **6** su 40 mm o più. Il conteggio va da 0 a 4 (o 6), **non** da 0 a 3. Esiti distinti però solo tre: 0 · 1 · 2-o-più (da 2 il tetto −12 è già raggiunto) |
| Fumo ed Eclipse: niente annullamento **e** niente −6 | ✅ l'annullamento non li tocca (3586, 3601–3602, nessun PS e nessuno Stato) e il −6 non si applica perché sono **Targetless**: la riga 3389 chiede «a BS Attack… declared **against an enemy Trooper**», e con un'arma Targetless non si dichiara nessun bersaglio nemico (righe 3763–3766) |
| Domanda preimpostata a SÌ quando il bersaglio è Ingaggiato | ✅ ben fondata in **entrambi** i casi: se il bersaglio è Ingaggiato, chi lo tiene impegnato è un tuo alleato **o un neutrale**, e la riga 3584 annulla il colpo per gli uni e per gli altri |

---

**Giro di chiusura delle letture di wiki in sospeso — 8 ottobre, sera.** Sei pagine mai aperte
o lette in versione vecchia, tutte chiuse. Wiki a **N5.3 + FAQ 0.1**.

| Pagina | Esito |
|---|---|
| *Coordinated Order* (oldid 4108) — mai aperta | ✅ **testo identico al PDF**, parola per parola: Requirements, Effects, Coordinating Skills, Dodge and Reset, States, Hacking Programs, **Success + Failure**. Le prove F8–F12 reggono. Le sue tre FAQ erano già **F02** (Sorpresa non si somma), **F03** (ARO contro chi usa Stealth) e **F04** (+1 SD nel Coordinato): nessuna nuova |
| *Ballistic Skills* (oldid 4094) | ✅ «BS Attack into a Close Combat» identico al PDF (3389–3396). La casella *Update N5.3* riguarda la copertura su superficie verticale, e il nostro 5.1.1 **già coincide** con N5.3 (righe 2925–2926): la casella *Original* è il testo N5.2, più stretto. Trappola annotata in §9 |
| *White Noise* (oldid 4091) | ✅ testo di regola ottenuto: NFB, Sagoma Circolare ad altezza infinita, **tutta** dentro l'Hacking Area, piazzata a fine Ordine su WIP Normale, dura **fino all'inizio della Fase Stati**, Reflective. La sua FAQ era già **F18** |
| *Mine Dispenser* (oldid 4099) — mai aperta | ✅ le due FAQ erano già **F10** e **F11**. Nuovo: il profilo dell'arma, aggiunto in §3.3 |
| *ITS FAQ* (oldid 4119) — mai aperta | ✅ dieci FAQ: nove sono materia di torneo e scenario (HVT neutrali, Obiettivi Classificati, Akial Interference, Crossing Lines…), la decima era già **F16**. **Niente** che tocchi un tiro, un MOD o un profilo d'arma nel perimetro dell'app |
| *Shasvastii* (oldid 3976) | ⚠️ **correzione a una mia scheda**: l'Embryo **non è uno stato a sé**. È l'**Incosciente** di una Shasvastii con il token sostituito, da annunciare quando entra in Incosciente; conta per i Punti Vittoria della Ritirata! **durante** la partita e non a fine partita; e **le munizioni Shock lo mandano diritto a Morto**. Non c'è nessun "resto degli effetti" da implementare, come diceva la scheda gruppoB |
| *FT Master* (oldid 4114) | ✅ Automatic, Obligatory. Rende **Regolari** i membri del Fireteam nel Conteggio Ordini; se già Regolari, **+2"** alla ZdC del Leader per la Coerenza; annulla il Fireteam se il FT Master lo lascia. **Non tocca tiri, MOD né Burst**: niente da implementare nel calcolatore. La sua FAQ era già **F13** |
| *Journalist* (oldid 4086) | ⚠️ **skill nuova di N5.2**, ecco perché manca dal nostro .txt. **Tocca un tiro**: ±3 ai Guts Roll nella ZdC (vedi §5 e §9). Nessun effetto finché l'app non tira i Guts |
| *Doctor* (oldid 3979) | ✅ **chiude la nota aperta dal 21 settembre**: `(ReRoll −X)` è la forma **pre-N5.2**, sostituita in N5.2 da `(ReRoll WIP=X)`, che **non è equivalente** (sostituisce il WIP invece di penalizzarlo). Dettaglio in §0. Confermato anche che un WIP **fallito** del Dottore manda il bersaglio a **Morto** |
| **F18 mai applicata** | ⚠️ era nell'indice FAQ dal 28 settembre e **non era mai entrata in questo file**: ora è in §1.7 lettera F. È l'unica eccezione scritta alla riga 1226 |

---

**Censimento delle notazioni di DATABASE `2026-10-08` e risposte di REGOLE.** Letto su
`database_nomad.js 15cb7716.154798`, `database_panoceania.js 4a97dcf6.152854`,
`database_comune.js 1323de62.58651`; fonte ARMY `7.26246.158`. Metodo loro: ogni contenuto fra
parentesi del campo `skills` di tutti i 765 profili, confrontato **byte per byte** con gli 85
extra ufficiali — 61 notazioni distinte, 53 combaciano, 8 spiegate, **nessun terzo caso** di
stringa vecchia oltre a ECM e Doctor.

| Punto | Esito |
|---|---|
| `Doctor (ReRoll -3)` su Bipandra: esiste un X? | ❌ **nessuna fonte lo dice**, cercato l'8 ottobre su entrambi gli annunci ufficiali. Si tiene la stringa e si legge col vecchio significato: **ritira a WIP − 3**, cioè 10. Riquadro in §0. La scelta di DATABASE di non inventare il numero è quella giusta |
| `(ReRoll)` **nudo**: N5.2 ne ha cambiato il senso? | ❌ **no**, invariato a N5.3 (wiki *Template:Modifiers-explained*, oldid 4027): «reroll **one die** from the Roll». I 34 profili (Booty 16, MetaChemistry 8, Deactivator 8, Discover 2) **non sono in gioco**, e in più sono tutti tiri a un dado solo, quindi l'ambiguità "un dado o il tiro" non li tocca nemmeno in teoria |
| `(ReRoll …)` con valore è un'**altra** notazione | ⚠️ ha un limite **per Ordine** e ritira *il tiro*; il nudo ritira *un dado* e non ha limite scritto. Due famiglie, non una con un numero in più. §0 ora le separa |
| **Engineer**: una sola forma, nuda, 39 profili | ✅ niente da convertire. La forma `(ReRoll WIP=X)` conta quando arriverà una fazione che la usa |
| `Dodge (ARM +3)`: la fonte ha lo **spazio** | ⚠️ **avevo io la grafia sbagliata**: l'extra ufficiale è `ARM +3` e i dati lo seguono su 9 profili Coyote. Corrette tutte e 10 le occorrenze in questo file |
| `Dodge (-3)` su 5 profili | ✅ la stringa è l'extra ufficiale e il **significato nuovo di 5.2 è già in §9** (−3 agli avversari nel F2F quando si Schiva). Dato corretto, regola registrata: niente da fare |
| `PARA`: nessuna forma `PARA (-X)` nuda, e spaziatura non uniforme | ✅ coerente con la ritrattazione del 23 settembre (i valori −3/−6/−9 sono per profilo, non per versione). ⚠️ La spaziatura disuniforme è ora annotata in §0: è il difetto della sottostringa `HACKER` visto dall'altro lato |
| `Combat Jump (PH=11)` e `Infiltration` nuda | ✅ già nella forma nuova, nessuna conversione |
| **«Continous Damage»** senza la u nella fonte | 🔴 **avviso accolto e scritto in §0.** Il progetto usa la grafia corretta da entrambi i lati e `M.haTratto` trova 9 armi su 9; allinearne uno solo all'ufficiale spegne il tratto in silenzio su 9 armi. **Non va toccato.** Il punto è di MOTORE (`catalogo_n5.js`), che DATABASE ha già messo in c.c. |

---

**Terreni multipli e `Camouflage (1 Use)` — verifica dell'8 ottobre, sera.** Wiki riletta:
*Special Terrain* (oldid 4062, N5.3), *Camouflaged State*, *Camouflage* (oldid 3062),
*Terrain* (oldid 3146).

| Caso | Esito |
|---|---|
| Due o più **Zone di Visibilità**: si sommano? | ❌ **no, solo il più restrittivo**, righe **12688–12695**, «two or more Visibility Zones **of whatever type**… only one MOD, that must be always the most restrictive one» |
| Due o più **Saturazioni** | ❌ **una sola**, righe 12645–12648: «never stack with MODs for other Saturation Zones… only a −1 Burst MOD» |
| **Saturazione + Visibilità** | ✅ **si sommano**, perché non sono dello stesso tipo: righe 12667–12669, la Visibilità «stacks with other MODs… **but never with other Zone of Visibility** MODs». Una tocca l'attributo, l'altra il Burst |
| **Fumo/Eclipse + terreno** | ✅ resta "il più restrittivo", **ma per la ragione giusta**: il Fumo *è* una Zona Zero (riga 5784) e l'Eclipse è identico (5612), quindi entrano nel confronto delle Visibilità e vincono. 🔴 **Non cancellano la Saturazione del terreno**: il −1 al Burst resta. Era quello che il campo combinato perdeva |
| **Terrain (Tipo)** con due terreni | ⚠️ la domanda si scioglie: la skill Terrain agisce **solo sul movimento** (righe 10198–10214), non ha mai toccato il tiro. E nel caso Bosco + Giungla ne copre **due su due**, perché sono **lo stesso Tipo** (Jungle) |
| **MSV** con due terreni | ⚠️ idem: di MOD di Visibilità ne sopravvive **uno**, quindi riduce quello. Non tocca la Saturazione. Eccezioni: Eclipse lo blocca (5613–5615), Rumore Bianco lo porta a −6 non riducibile (12684–12686) |
| **Bosco e Giungla sono due terreni?** | ⚠️ **no, sono lo stesso Tipo di Terreno** (Jungle), con proprietà diverse: tabella in §2.1, verificata riga per riga sulla wiki |
| **Tempesta** | ⚠️ non è una zona: **alza di un livello** la Visibilità presente. Non si somma e non si confronta: trasforma |
| Un solo terreno con **due** Visibilità | ⚠️ esiste (Sala del nucleo: Bassa + Rumore Bianco): il "più restrittivo" va risolto anche dentro un terreno |
| **Combat Jump** e Visibilità | ⚠️ regola nuova per noi, righe **12755–12758**: non si può usare **dentro o a contatto** di un'area con Visibilità Bassa, Pessima o Zero. Va in §1.17 |
| `Camouflage (1 Use)`: lo schieramento come Marker è l'uso? | ✅ **sì**. La FAQ F07 non lo dice di quel caso, ma dice che un tentativo **fallito** «has already used its Camouflaged State». Un riuscito non può costare meno. **LETTURA**, con la tabella dell'incoerenza in §1.18. ⚠️ Un Moran schierato in CAMO e rivelato **non rientra** |

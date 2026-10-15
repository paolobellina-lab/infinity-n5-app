<!-- @versione 2026-09-10.1 | README_MOTORE.md | proprieta`: chat MOTORE -->

# Motore regole N5 — nota di consegna

Per la chat DATABASE e la chat INTERFACCIA. Cosa è cambiato, come si usa,
e cosa resta da fare.

---

## Il principio, in una frase

**Niente default silenziosi.** Se un dato manca, se un'arma non si trova, se
un bersaglio non è sul tavolo, se una regola non è verificata — il motore lo
dice. Non inventa un numero e non ripiega su un valore plausibile.

Prima del motore, un'arma sconosciuta diventava un profilo generico con
gittata 0, un bersaglio inesistente diventava statistiche inventate, un
Attacco Intuitivo diventava un ordine di movimento. Tutto in silenzio.

---

## Ordine di caricamento

L'ordine conta. Il motore ha bisogno del catalogo e dei database; i moduli
hanno bisogno del motore.

```html
<script src="catalogo_n5.js"></script>
<script src="database_comune.js"></script>
<script src="database_panoceania.js"></script>   <!-- o database_nomad.js -->

<script src="motore_regole_n5.js"></script>      <!-- DEVE venire dopo i dati -->

<script src="motore_core.js"></script>
<script src="calcolatore_math.js"></script>
<script src="logica_stati.js"></script>
<script src="fireteam.js"></script>
<script src="fase_schieramento.js"></script>
<script src="logica_aro.js"></script>

<script src="ordine_coordinato.js"></script>
<script src="ordine_movimento.js"></script>
<script src="ordine_attacco_bs.js"></script>
<script src="ordine_attacco_cc.js"></script>
<script src="ordine_attacco_intuitivo.js"></script>
<script src="ordine_fuoco_speculativo.js"></script>
<script src="ordine_attacco_guidato.js"></script>
<script src="ordine_hacking.js"></script>
<script src="ordine_scoprire.js"></script>
<script src="ordine_supporto.js"></script>
<script src="ordine_difesa.js"></script>
```

Se il motore manca, ogni modulo lo dice e si ferma. `fase_schieramento.js` in
particolare **non spedisce niente**: spedire senza filtro rivelerebbe
all'avversario le truppe nascoste.

### Due controlli da fare in console

```js
MotoreN5.autotest()      // il vocabolario azioni è coerente col catalogo?
verificaRouter()         // ogni azione ha un modulo, e ogni modulo è caricato?
```

---

## Dove stanno le regole

**Nel catalogo, non nel codice.** `catalogo_n5.js` ha 24 sezioni, e ogni voce
porta la propria fonte:

- `fonte: 'wiki'` — letta dalla pagina o dal Weapon Chart
- `fonte: 'dedotto'` — ricavata, **da verificare**
- `fonte: 'DA VERIFICARE'` — non confermata

Il motore preferisce sempre il dato del database a quello del catalogo: il
catalogo è il tappabuchi per ciò che il database non porta ancora.

---

## Per la chat INTERFACCIA

### L'HTML non è più precotto

`generaRisoluzioneDaDati` restituisce la stessa forma di prima —
`titolo`, `attivo`, `reattivo`, con `dettagliMod` e `salvezza` in HTML — quindi
**non serve cambiare niente per far funzionare l'app**.

Ma accanto c'è il campo `dati`, con l'esito grezzo:

```js
const scontri = generaRisoluzioneDaDati(payload, reazioni);
const s = scontri[0];

s.attivo.mod                       // 5
s.attivo.dati.voci                 // [{fonte, valore, motivo}, ...]
s.attivo.dati.critici              // {valori: [5], testo: "Critico con un 5."}
s.attivo.dati.salvezzaInflitta     // {attributo, valoreSuccesso, tiri, voci, ...}
s.motivoConfronto                  // "Schivata contro l'attacco: Faccia a Faccia."
s.avvisi                           // problemi da mostrare al giocatore
```

Ogni numero è risalibile: nessuna voce senza `fonte` e `motivo`.

### Gli avvisi non li mostra ancora nessuno

È la cosa che manca di più. Il motore produce avvisi — arma ambigua, modalità
da scegliere, dato non verificato, Fireteam calcolato male — che arrivano fino
al payload e lì si fermano. Sono la parte che spiega *perché* un numero è
quello.

### Le reazioni si possono passare

```js
generaRisoluzioneDaDati(payload, reazioni)   // meglio
generaRisoluzioneDaDati(payload)             // ripiega su window.latestAroData
```

### Cose nuove che l'interfaccia può mostrare

- **Bersagli esclusi col motivo.** `window.targetsScartati` è
  `[{nome, motivo}]`. I moduli lo riempiono; alcuni lo disegnano già in coda
  alla lista, ma sta all'interfaccia decidere come.
- **Livello del Fireteam.** Il banner ora dice `LIVELLO 3 (5 membri)` e spiega
  quando i due numeri divergono.
- **Chi tira nel Supporto.** Col Dottore tiri tu, col MediKit tira il
  bersaglio: la schermata lo dice prima del tiro.
- **Critici.** Ogni tiro porta `critici.testo`, e sopra il 20 sono più d'uno.

---

## Per la chat DATABASE

### Tre correzioni da fare

**`PARA CC Weapon` è passata da (-3) a (-6) in N5.3.** La scrivono ancora
`(-3)` **54 profili**: 26 in PanOceania e 28 nei Nomadi. Il motore legge il
valore dal profilo, quindi applica quello che trova — è la correzione più
diffusa delle tre.

**`Kobra Pistol` è cambiata in entrambe le modalità:**

| | database | Weapon Chart N5.3 |
|---|---|---|
| BS Mode | ammo `N` | ammo **`SHOCK`** |
| CC Mode | `SHOCK`, 1 salvezza | **`DA`, 2 salvezze**, Anti-materiel |

**Cinque deployable senza dati di risoluzione**: `Crazykoala`, `CrazyKoalas`,
`Madtraps`, `Jammer`, `D-Charges (Demolition Mode)` non hanno né `bande` né i
flag `isTemplate`/`isCC`. Il motore le segnala (avviso A45) e non inventa
niente, ma non sa come risolverle.

### Due grafie che convivono

I profili scrivono `Multispectral Visor L2` per esteso, il codice storico
cercava la sigla `MSV`. Il motore accetta entrambe — ma è la grafia che ha
reso invisibili 35 visori al vecchio calcolatore.

Stessa cosa per il Firewall: valore fra parentesi tonde nei profili, quadre
nel codice vecchio. Anche qui il motore accetta entrambe.

### Il formato delle gittate

Una voce per colonna da 8" del Weapon Chart, `null` per `--`:

```js
'Combi Rifle': { bande: [3, 3, -3, -3, -6, -6] }   // 0-8, 8-16 ... 40-48
```

Regge due bande con lo stesso MOD, distingue "fuori gittata" da "ultima
banda", e si verifica confrontandola a vista con la riga del chart.

Il vecchio formato a chiavi (`{p3: 16, m3: 32}`) è ancora accettato, per
migrare con calma.

---

## Il banco di confronto

`banco_confronto.js` fa girare il monolite originale dell'Hub e il motore
sugli stessi scenari — oltre seimila — e confronta quattro cose: tipo di
confronto, MOD d'attacco, Tiri Salvezza, scontro completo.

```
node banco_confronto.js
```

Ogni divergenza finisce in una di tre categorie:

- **attesa** — il vecchio sbagliava, il motore corregge. Il file spiega perché.
- **da guardare** — nessuno dei due è chiaramente giusto: serve il regolamento.
- **errore** — qualcosa è andato in eccezione.

Finché "da guardare" ed "errori" restano a zero, si può cambiare il motore in
sicurezza. `calcolatore_math_ORIGINALE.js` va tenuto: è il termine di paragone.

---

## I test

```
node test_motore.js          # il contratto: vocabolario azioni e payload
node test_armi.js            # profiloArma, gittate, varianti, alias
node test_munizioni.js       # le 11 munizioni N5 e le combinate
node test_bersagli.js        # chi si può bersagliare, e perché no
node test_template.js        # Sagome Dirette e a Impatto
node test_notazioni.js       # il parser dei profili, sui due database
node test_confronto.js       # F2F o Tiro Normale
node test_salvezza.js        # Tiri Salvezza
node test_mod_attacco.js     # i MOD del tiro
node test_reazione.js        # il turno reattivo
node test_orchestratore.js   # lo scontro completo
node test_adattatore.js      # la compatibilità con l'interfaccia
node test_coordinato.js      # Ordine Coordinato e livello Fireteam
node test_stati.js           # integrità del Fireteam, stati Marker
node test_schieramento.js    # il filtro anti-spoiler
node test_router.js          # ogni azione ha un modulo
node test_modulo_*.js        # un file per modulo, end-to-end con DOM finto
```

1064 test in 29 file. Girano con `node`, senza browser.

I test dei moduli usano un DOM finto: si può collaudare l'intera catena —
scelta arma, bersagli, modificatori, invio — senza aprire l'app.

---

## Cosa il motore non sa

Due cose richiedono le posizioni sul tavolo, che l'app non ha:

- il **Command Token** speso per l'Ordine Coordinato
- la **Coerenza** del Fireteam col Leader

`M.validaCoordinato()` le restituisce come promemoria invece di ignorarle.

E c'è una regola marcata `DA VERIFICARE` nel catalogo: i dati di
**Total Control** e **Trinity** non sono stati riletti dalla scheda ufficiale.

---

## Un avvertimento

Il motore emette avvisi. Sui dati attuali sono pochi e tutti veri: voci di
collaudo, contenitori di modalità da scegliere, deployable incompleti.

Se un giorno un avviso comincia a scattare su dati corretti, **va corretto
l'avviso, non ignorato**. È già successo una volta: un avviso scattava 45
volte su armi perfettamente a posto, e un avviso che grida sempre nessuno lo
legge più.

// @versione 2026-09-23.5 | catalogo_n5.js | proprieta`: chat MOTORE (con contributi DATABASE)
// ==========================================
// --- catalogo_n5.js ---
// CATALOGO NORMALIZZATO DELLE REGOLE INFINITY N5 (aggiornato a N5.2)
// Fonte di verità per il motore di regole centralizzato (motore_regole_n5.js).
// Costruito da MAPPA_REGOLE_N5.md, verificata dal PDF ufficiale 5.1.1 + wiki N5.2.
//
// Ogni voce ha un NOME CANONICO (chiave) e una struttura dati che dice al motore
// COSA fa e QUANDO si applica, senza che i moduli debbano interpretare stringhe libere.
// ==========================================

window.CATALOGO_N5 = window.CATALOGO_N5 || {};

// ------------------------------------------------------------------
// MECCANICHE DI BASE (costanti che il motore usa ovunque)
// ------------------------------------------------------------------
// ⚠️ DISALLINEAMENTO DI VERSIONE, da tenere presente nella scomposizione
// dell'Hub: RULES_WEAPONS e` trascritta dal Weapon Chart N5.3, mentre
// MAPPA_REGOLE_N5.md e le regole di questo catalogo vengono dal PDF 5.1.1
// piu` il delta N5.2. I dati armi sono quindi UNA VERSIONE AVANTI rispetto
// alle regole. Nessuna contraddizione trovata finora: se una regola sulle
// munizioni sembra in disaccordo coi dati, l'origine e` questa.
window.CATALOGO_N5.MECCANICHE = {
    MOD_MAX: 12,            // MOD cumulativo massimo (±12)
    MOD_MIN: -12,
    SV_MIN: 1,             // sotto 1 = fallimento automatico
    BURST_MAX: 6,          // il Burst non supera mai 6
    arrotondamento: 'ceil', // sempre per eccesso
    // REGOLA FONDAMENTALE sui MOD tra parentesi nel profilo:
    //  - MOD POSITIVI (+N): si applicano SOLO all'UTENTE quando usa quella skill/arma/equip.
    //  - MOD NEGATIVI (-N): si applicano SOLO ai NEMICI.
    //      * per Skill/Equip AUTOMATICI (Mimetism, Surprise Attack, ECM...): il nemico li applica SEMPRE come da regola della skill.
    //      * per altri (Dodge (-3), CC Attack (-3)...): il nemico li applica SOLO durante i Tiri Faccia a Faccia.
    regolaMOD: 'positivo=utente; negativo=nemico (automatici sempre, altri solo in F2F)'
};

// ------------------------------------------------------------------
// MUNIZIONI — tabella completa per il calcolo dei Tiri Salvezza
// Campi:
//   salvezze:   numero di Tiri Salvezza (numero) o 0 se non-offensiva
//   attributo:  'ARM' | 'BTS' | 'PH' | 'ARM+BTS' | 'nessuno'
//   dimezza:    true = attributo diviso 2 (arr. ecc., min... vedi motore); false = pieno
//   tiroSpeciale: per PARA (PH-6) — il motore lo gestisce a parte
//   dannoPerFallimento: Ferite inflitte per ogni salvezza fallita (default 1)
//   statoFallimento: stato applicato al bersaglio se fallisce (o null)
//   critExtra:  quante salvezze aggiuntive dà un Critico (default 1); per T2 nota speciale
//   note:       promemoria per il motore / UI
// ------------------------------------------------------------------
window.CATALOGO_N5.MUNIZIONI = {
    'N':      { salvezze: 1, attributo: 'ARM', dimezza: false, dannoPerFallimento: 1, statoFallimento: null, critExtra: 1 },
    'NORMALE':{ alias: 'N' },
    'AP':     { salvezze: 1, attributo: 'ARM|BTS', dimezza: true,  dannoPerFallimento: 1, statoFallimento: null, critExtra: 1, note: 'ATTRIBUTO DIPENDENTE DALL\'ARMA: AP dimezza ARM o BTS a seconda di cosa usa l\'arma. Il motore eredita l\'attributo dall\'arma, AP applica solo il dimezzamento (arr. ecc.).' },
    'DA':     { salvezze: 2, attributo: 'ARM', dimezza: false, dannoPerFallimento: 1, statoFallimento: null, critExtra: 1, note: 'Entrambe le salvezze obbligatorie. Critico -> 3 salvezze.' },
    'EXP':    { salvezze: 3, attributo: 'ARM', dimezza: false, dannoPerFallimento: 1, statoFallimento: null, critExtra: 1, note: 'Tutte e 3 obbligatorie. Critico -> 4 salvezze.' },
    'SHOCK':  { salvezze: 1, attributo: 'ARM', dimezza: false, dannoPerFallimento: 1, statoFallimento: null, critExtra: 1, note: 'Se bersaglio ha VITA=1 e va Incosciente -> MORTO diretto. Annulla Dogged/NWI/Shasvastii.' },
    'E/M':    { salvezze: 2, attributo: 'BTS', dimezza: true,  dannoPerFallimento: 0, statoFallimento: 'ISOLATO', critExtra: 1, note: 'Fallimento = Isolato; se HI/TAG/REM/VH anche IMM-B. Critico -> 3 salvezze.' },
    'T2':     { salvezze: 1, attributo: 'ARM', dimezza: false, dannoPerFallimento: 2, statoFallimento: null, critExtra: 1, critExtraDanno: 1, note: 'Ogni fallimento = 2 Ferite. La salvezza extra da Critico infligge solo 1 Ferita.' },
    'PARA':   { salvezze: 1, attributo: 'PH',  dimezza: false, tiroSpeciale: 'PH-6', dannoPerFallimento: 0, statoFallimento: 'IMM-A', critExtra: 1, note: 'Non ARM/BTS: e` un tiro PH-6. Nessun effetto su bersagli senza PH.' },
    'STUN':   { salvezze: 1, attributo: 'ARM', dimezza: false, dannoPerFallimento: 0, statoFallimento: 'STORDITO', critExtra: 1, note: 'Fallimento = Stordito + fallisce automaticamente il Guts Roll successivo.' },
    'SMOKE':  { salvezze: 0, attributo: 'nessuno', nonOffensiva: true, note: 'Genera Zona Visibilita` Zero (Template Circolare) fino alla Fase Stati.' },
    'ECLIPSE':{ salvezze: 0, attributo: 'nessuno', nonOffensiva: true, note: 'Come Smoke ma blocca anche i Multispectral Visor. Tratto Reflective.' }
};

// ------------------------------------------------------------------
// MUNIZIONI COMBINATE (segnate col '+', es. AP+DA)
//
// REGOLA UFFICIALE N5 (wiki, Combined Ammunition): una munizione combinata
// funziona come UNA SOLA munizione che somma gli effetti delle basi.
// NON esiste una tabella chiusa: qualsiasi combinazione col '+' e` legale e
// va COMPOSTA dalle basi. Il motore lo fa in MotoreN5.risolviMunizione().
//
// Le voci qui sotto NON sono la fonte della regola: sono i casi che la wiki
// documenta esplicitamente, tenuti come banco di prova della composizione.
// Se il motore compone AP+DA e non ottiene questi valori, il motore sbaglia.
//
// ATTENZIONE: 'ARM+BTS' non appartiene a questa famiglia. E` un
// Tiro Salvezza Combinato (Combined Saving Roll): attributi diversi, non
// munizioni diverse. Regola distinta, tenuta qui sotto separata.
window.CATALOGO_N5.MUNIZIONI_COMBINATE = {
    'AP+DA':   { basi: ['AP','DA'], salvezze: 2, attributo: 'ARM', dimezza: true,  note: '2 salvezze con attributo dimezzato. Critico -> 3.' },
    'AP+EXP':  { basi: ['AP','EXP'], salvezze: 3, attributo: 'ARM', dimezza: true, note: '3 salvezze dimezzate. Critico -> 4.' },
    'N+E/M':   { basi: ['N','E/M'], salvezze: 2, attributo: 'BTS', dimezza: true,  note: '2 salvezze BTS dimezzato; ogni fallita 1 Ferita + Isolato (IMM-B se HI/TAG/REM/VH).' },
    'AP+SHOCK':{ basi: ['AP','SHOCK'], salvezze: 1, attributo: 'ARM', dimezza: true, applicaShock: true,
                 note: '1 salvezza con ARM dimezzato; se fallita si applica anche l\'effetto Shock (Incosciente -> Morto). Usata da Silenced Pistol, Uragan MRL, AP+Shock CC Weapon. (Weapon Chart ufficiale)' },
    'AP+T2':   { basi: ['AP','T2'], salvezze: 1, attributo: 'ARM', dimezza: true, ferriteExtra: 1,
                 note: '1 salvezza con ARM dimezzato; ogni fallita infligge il danno T2 (1 Ferita extra). Usata da AP+T2 CC Weapon. (Weapon Chart ufficiale)' },
    'ARM+BTS': { combinato: true, salvezze: 2, attributi: ['ARM','BTS'], note: 'Tiro salvezza combinato (es. Plasma): 1 ARM + 1 BTS. Critico -> +1 salvezza ARM.' }
};

// ------------------------------------------------------------------
// MUNIZIONI NON ESISTENTI IN N5 (residui di N3/Human Sphere)
//
// VERIFICATO sulla wiki N5.2: i tipi di munizione in N5 sono ESATTAMENTE
// undici — N, AP, DA, Eclipse, E/M, EXP, PARA, Shock, Smoke, Stun, T2 —
// piu` le combinate e il Tiro Salvezza Combinato. Tutto il resto e` N3.
//
// Questa sezione NON aggiunge munizioni: serve al motore per dare un
// messaggio preciso ("era N3, in N5 non esiste") invece del generico
// "non presente nel catalogo", e per intercettare i residui rimasti nei
// database e in calcolatore_math.js.
// ------------------------------------------------------------------
// ⚠️ TRAPPOLA: due di questi nomi sopravvivono come NOMI D'ARMA pur non
// essendo piu` munizioni. "K1 Combi Rifle" spara munizione N, le Breaker
// sparano AP. Il calcolo NON deve dedurre la munizione dal nome dell'arma:
// va letta dai campi ammo / salvAttr / salvTiri del profilo.
//   K1 Combi Rifle        ammo N   salvAttr ARM=0
//   Breaker Combi Rifle   ammo AP  salvAttr BTS/2
//   Monofilament CC Weapon ammo N  salvAttr ARM=0
//   Viral Sniper Rifle    ammo N   salvAttr BTS
// Togliendo i rami morti da calcolatore_math.js, controllare che il flusso
// del Tiro Salvezza passi da M.parametriSalvezza() e non dal nome.
window.CATALOGO_N5.MUNIZIONI_RIMOSSE = {
    'VIRAL':        { edizione: 'N3', sostituto: null,  note: 'Era 2 salvezze BTS. In N5 non esiste: le armi Viral vanno riprofilate.' },
    'BREAKER':      { edizione: 'N3', sostituto: 'AP',  note: 'Dimezzava BTS. In N5 il ruolo e` coperto da AP (che dimezza ARM o BTS secondo l\'arma).' },
    'NANOTECH':     { edizione: 'N3', sostituto: null,  note: 'Non esiste in N5.' },
    'PLASMA':       { edizione: 'N3', sostituto: 'ARM+BTS', note: 'In N5 e` un Tiro Salvezza Combinato ARM+BTS, non un tipo di munizione.' },
    'ADHESIVE':     { edizione: 'N3', sostituto: 'PARA', note: 'Applicava IMM-A come PARA. In N5 usare PARA.' },
    'K1':           { edizione: 'N3', sostituto: null,  note: 'Danno fisso 12 che ignorava ARM. Non esiste in N5.' },
    'BIOWEAPON':    { edizione: 'N3', sostituto: null,  note: 'Non esiste in N5.' },
    'FLASH':        { edizione: 'N3', sostituto: 'STUN', note: 'Applicava Stordito. In N5 usare STUN.' },
    'MONOFILAMENT': { edizione: 'N3', sostituto: null,  note: 'In N5 non e` una munizione: la Monofilament CC Weapon ha regole proprie come arma.' },
    'CONTINUOUS':   { edizione: 'N3', sostituto: null,  note: 'Non e` una munizione ma un TRATTO d\'arma: vedi TRATTI["Continuous Damage"].' }
};

// ------------------------------------------------------------------
// ARMI A SAGOMA (TEMPLATE) — regole complete
//
// VERIFICATO sulla wiki N5.2 (Template Weapons and Equipment,
// Direct Template Weapons, Impact Template Weapons).
// Finora avevamo solo i due Tratti nel glossario, non le regole.
// ------------------------------------------------------------------
window.CATALOGO_N5.TEMPLATE = {

    // I due tipi si comportano in modo MOLTO diverso: il Diretto non tira
    // per colpire, l'Impatto sì. Confonderli è l'errore piu` facile.
    TIPI: {
        'DIRETTO': {
            nome: 'Direct Template',
            tiroPerColpire: false,
            note: 'La Sagoma si piazza a contatto della Silhouette dell\'attaccante (o centrata su di lui, se Circolare). Nessun tiro BS: il colpo e` automatico.',
            reazione: 'TIRO_NORMALE',
            noteReazione: 'Chi e` colpito e reagisce con un Attacco NON fa un Faccia a Faccia: fa un Tiro Normale. Vale per qualsiasi attacco di reazione, non solo per la Schivata.',
            burstMultiplo: 'Con B maggiore di 1 la Sagoma si puo` piazzare tante volte per Ordine quanto il valore di B.',
            aroMainTarget: 'In ARO, ogni truppa Attiva nell\'Area d\'Effetto conta come Bersaglio Principale ai fini dell\'annullamento della Sagoma.',
            faqAngoli: 'NON si puo` sparare "dietro l\'angolo" per colpire bersagli secondari fuori LoF (FAQ 0.0.0, ott. 2025).'
        },
        'IMPATTO': {
            nome: 'Impact Template',
            tiroPerColpire: true,
            note: 'La Sagoma si piazza sul punto d\'impatto. Richiede un tiro d\'attacco su BS, PH o l\'attributo indicato dall\'arma.',
            reazione: 'FACCIA_A_FACCIA',
            noteReazione: 'Richiedendo un tiro, ogni nemico colpito puo` fare il proprio Faccia a Faccia separato.',
            bersaglioPrincipale: 'Obbligatorio dichiarare un Bersaglio Principale valido e in LoF. Il centro della Sagoma Circolare (Blast Focus) va sul centro della sua base.',
            schivataMultipla: 'Per schivare piu` Sagome nello stesso Ordine si fa un Faccia a Faccia separato per ognuna, ma contro UN SOLO tiro PH del bersaglio: un tiro solo le schiva tutte.',
            targetless: 'Con il Tratto Targetless (es. munizioni Smoke) non serve dichiarare un nemico come Bersaglio Principale: si puo` bersagliare un punto del tavolo.'
        }
    },

    // Regole comuni a tutte le Sagome.
    REGOLE: {

        // 🔴 Questa e` la regola che incide sul calcolo delle salvezze.
        coperturaParzialeAnnullata: {
            testo: 'Chi e` colpito da un\'arma a Sagoma NON beneficia del +3 al Tiro Salvezza per Copertura Parziale.',
            effetto: 'SR_NO_COVER',
            note: 'Riguarda SOLO il +3 al Tiro Salvezza. Il -3 BS all\'attaccante per bersaglio in Copertura non e` toccato da questa regola: con una Sagoma a Impatto, che un tiro lo richiede, quel -3 resta.'
        },

        bersaglioPrincipaleFuoriArea: {
            testo: 'Se il Bersaglio Principale finisce fuori dall\'Area d\'Effetto, l\'attacco e` automaticamente fallito e NESSUN elemento viene colpito.',
            effetto: 'ATTACCO_FALLITO_TOTALE'
        },

        modCalcolatiUnaVolta: {
            testo: 'I MOD dell\'attaccante si determinano UNA VOLTA SOLA, sul Bersaglio Principale. Quel singolo tiro viene poi opposto separatamente, uno per uno, da ogni altro nemico colpito.',
            effetto: 'MOD_DAL_PRINCIPALE',
            note: 'Gli esiti dei Faccia a Faccia secondari sono indipendenti fra loro: uno vinto o perso non influenza gli altri.'
        },

        criticoSoloSulPrincipale: {
            testo: 'Un Critico con arma a Sagoma vale come Critico SOLO contro il Bersaglio Principale. Sui Secondari conta come successo normale.',
            effetto: 'CRIT_SOLO_PRINCIPALE',
            note: 'Regola generale di tutte le Sagome, non solo dell\'Attacco Intuitivo.'
        },

        schivataSenzaLoF: {
            testo: 'Chiunque sia colpito da una Sagoma puo` dichiarare Schivata come seconda Abilita` Breve o come ARO, ANCHE senza LoF verso chi attacca.',
            effetto: 'DODGE_SEMPRE_CONCESSA',
            tiroBase: 'PH',
            tiroRidotto: 'PH-3',
            quandoRidotto: [
                'Il bersaglio non ha LoF verso l\'attaccante.',
                'L\'attacco viene da un\'Arma Deployable (es. una Mina).'
            ]
        },

        alleatiENeutrali: {
            testo: 'Non e` permesso dichiarare attacchi che possano colpire truppe Alleate o Neutrali. Se una Sagoma ne coinvolgerebbe una, QUEL colpo e` annullato.',
            effetto: 'COLPO_ANNULLATO',
            note: 'Gli altri colpi dello stesso Burst che non coinvolgono alleati restano validi. I reattivi nell\'area del colpo annullato possono comunque dichiarare ARO.',
            disposable: 'Se l\'arma ha il Tratto Disposable, l\'uso dichiarato viene consumato lo stesso.',
            eccezione: 'Una Sagoma senza valore PS e che non infligge Stati (es. Smoke) PUO` coinvolgere alleati.'
        },

        corpoACorpo: {
            testo: 'Una Sagoma piazzata su un gruppo impegnato in Corpo a Corpo colpisce SEMPRE tutti i partecipanti, anche quelli non toccati fisicamente dalla Sagoma.',
            effetto: 'CC_TUTTI_COINVOLTI',
            note: 'Da tenere presente: non si possono attaccare truppe Alleate, quindi una Sagoma su una mischia che coinvolge un tuo alleato e` vietata.'
        },

        blastFocusETotalCover: {
            testo: 'Per essere colpito da una Sagoma dev\'essere possibile tracciare una LoF dal Blast Focus al bersaglio, senza che sia bloccata da Copertura Totale.',
            effetto: 'LOF_DAL_BLAST_FOCUS',
            blastFocus: 'Centro della Sagoma Circolare; punta stretta delle Sagome a Goccia.',
            note: 'La LoF dal Blast Focus si traccia solo DENTRO l\'Area d\'Effetto della Sagoma stessa.'
        },

        attivazioniSimultanee: {
            testo: 'Con piu` truppe attivate insieme (Ordine Coordinato, Fireteam) la Sagoma colpisce ogni truppa che sia stata in contatto con la sua Area d\'Effetto in QUALSIASI momento dell\'Ordine, perche` tutto avviene simultaneamente.',
            effetto: 'CONTATTO_IN_QUALSIASI_MOMENTO'
        },

        altezza: {
            testo: 'L\'altezza di una Sagoma e` pari al suo raggio, o a meta` della sua larghezza, salvo Tratti delle munizioni che dicano altro.'
        }
    },

    // Le tre Sagome del regolamento.
    FORME: {
        'Circolare':        { blastFocus: 'centro' },
        'Goccia Grande':    { blastFocus: 'punta stretta' },
        'Goccia Piccola':   { blastFocus: 'punta stretta' }
    }
};

// ------------------------------------------------------------------
// ATTACCHI SPECIALI — regole complete
// VERIFICATO sulla wiki N5.2 (Intuitive Attack, Speculative Attack).
// ------------------------------------------------------------------
window.CATALOGO_N5.ATTACCHI = {

    'ATTACCO INTUITIVO': {
        tipo: 'LONG_SKILL',
        etichetta: 'BS Attack',
        attributo: 'WIP',

        requisitoArma: 'Tratto "Intuitive Attack" sull\'arma BS.',
        noteRequisitoArma: '⚠️ NON e` "arma a Sagoma": sono due cose diverse. Il database armi non ha ancora il campo traits, quindi il motore ripiega sulle Sagome ed emette un avviso.',

        requisitoBersaglio: 'Il bersaglio (o il Bersaglio Principale, se si usa una Sagoma) deve essere fuori LoF per una Zona di Visibilita` Zero, oppure in uno Stato che normalmente impedirebbe di attaccarlo senza averlo Scoperto (es. CAMO).',

        // 🔴 Il tiro e` NUDO. Non e` "ignora Mimetismo e Copertura": ignora TUTTO.
        tiroNonModificato: true,
        noteTiro: 'Tiro WIP non modificato. NESSUN MOD si applica: ne` Copertura Parziale, ne` Abilita` Speciali, ne` Equipaggiamento, ne` gittata, ne` qualsiasi altra fonte.',

        burst: 1,
        noteBurst: 'Burst sempre 1, qualunque sia il B dell\'arma e qualunque MOD al B.',

        bersaglioPrincipaleUnico: true,
        noteBersaglio: 'Se piu` nemici sarebbero coinvolti, il tiratore ne deve scegliere UNO SOLO come Bersaglio Principale.',

        reazione: 'FACCIA_A_FACCIA',
        noteReazione: 'Se il bersaglio reagisce con un Attacco o una Schivata, la reazione e` simultanea e si risolve con un Faccia a Faccia. Vale ANCHE con una Sagoma Diretta: siccome l\'Intuitivo richiede un tiro, la regola del Tiro Normale delle Sagome Dirette non si applica.',

        criticoSoloSulPrincipale: true,

        fallimento: 'Se il tiro WIP fallisce, l\'utente non puo` tentare un altro Attacco Intuitivo contro lo STESSO bersaglio fino al proprio Turno Attivo successivo.',

        deployable: 'Va dichiarato un Attacco Intuitivo per piazzare un\'Arma Deployable se c\'e` un Marker Mimetico nemico dentro la sua Area d\'Innesco. Se il tiro WIP fallisce l\'arma non viene piazzata e, se Disposable, un uso e` comunque consumato.',

        // FAQ 0.0.0 (ott. 2025)
        contaComeBsAttack: true,
        noteFaq: 'Conta come BS Attack per i MOD di profilo: "BS Attack (SR-1)", "BS Attack (AP)" ecc. si applicano. Il "+1 SD" NO, perche` non si applica alle Long Skill — e l\'Intuitivo e` una Long Skill.'
    },

    'ATTACCO GUIDATO': {
        tipo: 'SHORT_SKILL',
        etichetta: 'BS Attack',
        attributo: 'BS',
        soloTurnoAttivo: true,
        noteTurno: 'BS Attack (Guided) si usa SOLO in Turno Attivo.',

        requisitoProfilo: 'Skill "BS Attack (Guided)" nel profilo dell\'unita`.',
        requisitoBersaglio: 'Il bersaglio dev\'essere in Stato Bersagliato (Targeted).',
        richiedeLoF: false,

        // 🔴 Vincolo sull'arma che il modulo precedente ignorava del tutto.
        requisitoArma: 'L\'attacco DEVE essere portato con la Blast Mode dell\'arma, se ne ha una, oppure con una modalita` che abbia il Tratto Impact Template.',

        // MOD: gittata SI, mimetismo e copertura NO.
        modApplicati: ['GITTATA', 'BERSAGLIATO'],
        modIgnorati: ['MIMETISMO', 'COPERTURA'],
        noteGittata: 'Per il MOD di gittata si misura la distanza fra attaccante e bersaglio IN LINEA RETTA. Altre possibili traiettorie del colpo non si considerano.',
        bonusBersagliato: 3,
        noteBersagliato: 'Lo Stato Bersagliato da` +3 a qualsiasi BS Attack contro quella truppa.',

        reazioneBersaglio: 'Schivata a PH-3 (si schiva un\'arma a Sagoma senza LoF verso l\'attaccante) oppure Reset a WIP-3 (per lo Stato Bersagliato).',
        criticoSoloSulPrincipale: true,
        noteSecondari: 'Solo il Bersaglio Principale fa il Tiro Faccia a Faccia. I Secondari presi dalla Sagoma fanno solo il proprio Tiro Salvezza.'
    },

    'SCOPRIRE': {
        tipo: 'BASIC_SHORT',
        attributo: 'WIP',
        etichetta: 'Discover',

        requisiti: [
            'L\'utente deve poter tracciare la LoF al bersaglio.',
            'Non si puo` usare due volte contro lo STESSO bersaglio nello stesso Ordine.'
        ],

        // 🔴 Non e` un tiro nudo: applica gli stessi MOD di un BS Attack.
        tiro: 'Tiro NORMALE su WIP, applicando gli stessi MOD di un BS Attack: Copertura, gittata, Mimetismo…',
        gittataPropria: 'Lo Scoprire ha bande di gittata PROPRIE, come se fosse un\'arma BS. Stanno in RULES_WEAPONS sotto la voce "SCOPRIRE".',

        fallimento: 'Chi fallisce un tiro WIP per Scoprire un Marker non puo` ritentare sullo STESSO Marker fino al proprio Turno di Giocatore successivo. Puo` invece tentare su un Marker diverso.',
        noteMarkerDiverso: 'Una truppa rivelata che rientra in Stato CAMO o Impersonation NON conta come lo stesso Marker.',

        successo: 'Il Marker viene rimosso e sostituito con il Modello, l\'Arma o l\'Equipaggiamento che rappresenta. Il giocatore lo orienta come vuole.',

        modSpeciali: {
            'Sensor':                 '+6 WIP quando si dichiara Scoprire contro Marker Mimetici. Automatico, senza tiri ne` Ordini.',
            'Multispectral Visor L2': 'Lo Scoprire contro un bersaglio in Stato CAMO riesce AUTOMATICAMENTE.',
            'Multispectral Visor L3': 'Come L2.',
            'Impersonation-1':        'Il Marker IMP-1 impone -3 WIP a chi tenta di Scoprirlo.',
            'Biometric Visor':        'Ignora il -3 imposto dallo Stato Impersonation-1.'
        },

        // FAQ 0.0.0
        noBonusFireteam: 'I bonus Fireteam "BS Attack (+1 SD)" e "+1 BS" NON si applicano allo Scoprire. Il "+3 Discover" del Livello 3 invece si`.',

        combinazione: 'Scoprire e` un\'Abilita` Breve Base: si combina con qualunque altra Abilita` Breve. "Scoprire + Attacco" e` la manovra che permette di attaccare un nemico CAMO.'
    },

    'SCOPRIRE': {
        tipo: 'BASIC_SHORT',
        etichetta: 'Discover',
        attributo: 'WIP',
        scopo: 'Individua i nemici nascosti in forma di Marker, costringendoli a rivelare la truppa, l\'arma o l\'equipaggiamento che il Marker rappresenta.',

        requisiti: [
            'L\'utente deve poter tracciare la LoF al bersaglio.',
            'Non si puo` usare due volte contro lo STESSO bersaglio nello stesso Ordine.'
        ],

        // 🔴 Non e` un tiro nudo: si applicano gli stessi MOD di un BS Attack.
        tiro: 'Tiro NORMALE su WIP, applicando gli STESSI MOD di un BS Attack: Copertura, gittata, Mimetismo...',
        modApplicati: ['GITTATA', 'COPERTURA', 'MIMETISMO'],
        noteGittata: 'Scoprire ha gittate PROPRIE, come se fosse un\'arma BS: sono nel database armi alla voce SCOPRIRE.',

        successo: 'Il Marker viene rimosso e sostituito col Modello della truppa, o col Segnalino dell\'arma o equipaggiamento.',
        fallimento: 'Chi fallisce non puo` ritentare di Scoprire lo STESSO Marker fino al Turno di Gioco successivo. Puo` invece tentare su un Marker diverso.',
        noteRitentare: 'Una truppa rivelata che rientra in Stato CAMO o Impersonation NON conta come lo stesso Marker.',

        aroSimultanei: 'Gli ARO sono simultanei: non si puo` dichiarare Scoprire con una truppa e BS Attack con le altre aspettando l\'esito del tiro.',
        nonServeSeAro: 'Se il Marker dichiara un ARO rivelandosi, non serve il tiro di Scoprire prima di risolvere l\'attacco.',

        combinazione: 'E` un\'Abilita` Breve Base: si combina con un\'altra Abilita` Breve. Scoprire + Attacco e` la combinazione tipica, e permette di attaccare un nemico CAMO, cosa altrimenti impossibile.',

        // FAQ 0.0.0
        bonusFireteam: 'Il Fireteam di Livello 3 da` +3 a Scoprire. I bonus "+1 SD" e "+1 BS" NON si applicano a Scoprire.',
        nonOffensivo: true
    },

    'SCOPRIRE': {
        tipo: 'BASIC_SHORT',
        attributo: 'WIP',
        etichetta: 'Discover',

        requisiti: [
            'L\'utente deve poter tracciare una LoF al bersaglio.',
            'Non si puo` usare contro lo STESSO bersaglio due volte nello stesso Ordine.'
        ],

        // 🔴 Scoprire NON e` un tiro nudo: prende gli stessi MOD di un BS Attack.
        modComeBsAttack: true,
        noteTiro: 'Tiro Normale su WIP con gli STESSI MOD di un BS Attack: Copertura, gittata, Mimetismo e cosi` via.',
        gittataPropria: 'Scoprire ha MOD di gittata propri, come se fosse un\'arma BS: la riga "SCOPRIRE" del Weapon Chart.',

        fallimento: 'Chi fallisce non puo` ritentare sullo STESSO Marker fino al proprio Turno successivo. Puo` invece tentare su un Marker diverso.',
        noteFallimento: 'Una truppa rivelata che rientra in Stato CAMO o Impersonation NON conta come lo stesso Marker.',

        successo: 'Il Marker viene rimosso e sostituito col Modello, con l\'orientamento scelto dal suo giocatore.',

        automatico: {
            'Multispectral Visor L2': 'Scoprire contro un bersaglio in Stato CAMO riesce AUTOMATICAMENTE.',
            'Multispectral Visor L3': 'Scoprire contro un bersaglio in Stato CAMO riesce AUTOMATICAMENTE.'
        },
        bonus: {
            'Sensor': '+6 WIP dichiarando Scoprire contro Marker Mimetici.',
            'Fireteam Livello 3': '+3 Discover.'
        },
        // FAQ 0.0.0
        senzaBonusFireteam: 'I bonus "BS Attack (+1 SD)" e "+1 BS" del Fireteam NON si applicano a Scoprire.',

        combinazione: 'E` un\'Abilita` Breve Base: si combina con un\'altra Abilita` Breve. "Scoprire + Attacco" e` la combinazione che permette di attaccare un nemico CAMO, cosa altrimenti impossibile.'
    },

    'FUOCO SPECULATIVO': {
        tipo: 'LONG_SKILL',
        etichetta: 'BS Attack',
        attributo: 'BS',
        noteAttributo: 'BS, o l\'attributo indicato dal Tratto dell\'arma: le Granate hanno "BS Weapon (PH)" e tirano su PH.',
        malusFisso: -6,
        requisitoArma: 'Tratto "Speculative Attack" sull\'arma BS.',
        requisitoTraiettoria: 'Dev\'essere possibile tracciare una traiettoria fra la truppa e il punto d\'impatto.',

        // MOD: solo -6 fisso e gittata. Niente altro.
        modApplicati: ['MALUS_SPECULATIVO', 'GITTATA'],
        modIgnorati: ['MIMETISMO', 'COPERTURA'],
        noteTiro: 'Tiro parabolico: non richiede LoF, il bersaglio puo` stare fuori LoF. Si applicano il -6 fisso E i MOD di gittata. NON si applicano Mimetismo ne` Copertura (a differenza di un BS Attack normale, e a differenza dell\'Intuitivo dove non si applica proprio nulla).',

        sagomaCircolare: 'Con un\'arma dal Tratto Impact Template (Circular), lo Speculativo permette di piazzare il centro della Sagoma altrove che sul Bersaglio Principale — ma il Principale deve restare dentro l\'Area d\'Effetto. Sia il bersaglio sia il punto d\'impatto si scelgono senza bisogno di LoF. La Sagoma va posata sul tavolo o orizzontalmente su un elemento di scenario: mai su una superficie verticale o a mezz\'aria.',
        burst: 1,
        noteBurst: 'Burst sempre 1, qualunque sia il B dell\'arma e qualunque MOD al B.',
        contaComeBsAttack: true,
        noteFaq: 'Come l\'Intuitivo: conta come BS Attack per i MOD di profilo, ma il "+1 SD" non si applica (Long Skill).'
    }
};

// ------------------------------------------------------------------
// TRATTI D'ARMA NOTI
//
// RULES_WEAPONS non ha un campo "traits", ma alcuni Tratti decidono cose
// che il calcolatore DEVE sapere: quale attributo si tira e quali attacchi
// speciali un'arma consente. Finche` il database non li porta, stanno qui.
//
// ⚠️ Ogni voce e` marcata con la sua provenienza:
//    fonte: 'wiki'      -> letta testualmente dalla scheda dell'arma
//    fonte: 'dedotto'   -> ricavata dal tipo di arma, DA VERIFICARE in collaudo
// ------------------------------------------------------------------
window.CATALOGO_N5.TRATTI_ARMA = {

    // --- verificate sulla wiki (tabella Weapon Chart) ---
    'Grenades':        { fonte: 'wiki', traits: ['Speculative Attack', 'BS Weapon (PH)', 'Impact Template (Circular)'] },
    'Smoke Grenades':  { fonte: 'wiki', traits: ['Speculative Attack', 'BS Weapon (PH)', 'Impact Template (Circular)', 'Targetless'] },

    // --- Deployable col Tratto Intuitive Attack (Categoria wiki, 4 voci) ---
    // Queste sono le UNICHE armi che la wiki elenca esplicitamente col Tratto
    // Intuitive Attack. Sono tutte Deployable, non Sagome portate a mano.
    'Mines':          { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template', 'Deployable'] },
    'Chest Mines':    { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template', 'Deployable'] },
    'Drop Bears':     { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template', 'Deployable'] },
    'WildParrot':     { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template', 'Deployable'] },

    // --- Sagome Dirette: VERIFICATE sul Weapon Chart del wiki (N5.3) ---
    // La colonna Tratti del chart conferma l'Intuitive Attack su tutte e
    // sette. La deduzione era corretta, ma ora e` letta dalla fonte.
    'Chain Rifle':         { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Large Teardrop)'] },
    'Chain-colt':          { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Small Teardrop)'] },
    'Light Flamethrower':  { fonte: 'wiki', traits: ['Intuitive Attack', 'Continuous Damage', 'Direct Template (Small Teardrop)'] },
    'Heavy Flamethrower':  { fonte: 'wiki', traits: ['Intuitive Attack', 'Continuous Damage', 'Direct Template (Large Teardrop)'] },
    'Nanopulser':          { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Small Teardrop)'] },
    'Pulzar':              { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Large Teardrop)'] },
    'E/Marat':             { fonte: 'wiki', traits: ['Intuitive Attack', 'Non-Lethal', 'Direct Template (Large Teardrop)'] },

    // --- altre armi col Tratto Intuitive Attack, dallo stesso chart.
    //     Non sono Sagome portate a mano: mancavano tutte. ---
    'Zapper':                       { fonte: 'wiki', traits: ['Intuitive Attack', 'Non-Lethal', 'Direct Template (Small Teardrop)'] },
    'Boarding Pistol (Blast Mode)': { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Small Teardrop)'] },
    'Heavy Riotstopper':            { fonte: 'wiki', traits: ['Intuitive Attack', 'Non-Lethal', 'Direct Template (Large Teardrop)'] },
    'Light Riotstopper':            { fonte: 'wiki', traits: ['Intuitive Attack', 'Non-Lethal', 'Direct Template (Small Teardrop)'] },
    'Sepsitor':                     { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Large Teardrop)'] },
    'Sepsitor Plus':                { fonte: 'wiki', traits: ['Intuitive Attack', 'Direct Template (Large Teardrop)'] },
    'Jammer':                       { fonte: 'wiki', traits: ['Intuitive Attack', 'Comms Attack', 'BS Weapon (WIP)', 'Non-Lethal'] },

    // --- NON hanno il Tratto Speculative Attack, malgrado "Launcher" nel nome ---
    // Sono elencate apposta: l'euristica precedente (nome contiene LAUNCHER)
    // le offriva per il Fuoco Speculativo, e non e` legale.
    'Missile Launcher (Blast)':      { fonte: 'wiki', traits: ['Impact Template (Circular)'], nonSpeculative: true },
    'Missile Launcher (Hit)':        { fonte: 'wiki', traits: [], nonSpeculative: true },
    'Heavy Rocket Launcher (Blast)': { fonte: 'wiki', traits: ['Impact Template (Circular)'], nonSpeculative: true },
    'Adhesive Launcher Rifle':       { fonte: 'wiki', traits: [], nonSpeculative: true }
};

// ------------------------------------------------------------------
// CORPO A CORPO — regole complete
// VERIFICATO sulla wiki N5.2 (CC Attack, Martial Arts, Fireteam Examples).
// ------------------------------------------------------------------
window.CATALOGO_N5.CORPO_A_CORPO = {

    attributo: 'CC',
    tipo: 'SHORT_SKILL',   // Breve o ARO. Berserk e` invece un Ordine Intero.

    requisiti: [
        'Contatto di Silhouette con un Modello o Bersaglio nemico.',
        'Usare un\'arma col Tratto CC, o una Skill/Equip che consenta il CC Attack.'
    ],

    // In CC non esistono ne` gittata ne` copertura: sono MOD del tiro a distanza.
    modNonApplicabili: ['GITTATA', 'COPERTURA', 'MIMETISMO'],
    noteMod: 'Il Mimetismo si applica a chi dichiara BS Attack o Discover, NON al CC.',

    burstDiviso: 'Con piu` bersagli e B superiore a 1, il giocatore deve dichiarare come divide il Burst al momento della dichiarazione.',

    // Il "Gang-Up" di N3. In N5 si chiama cosi`.
    multipliTruppe: {
        nome: 'Close Combat with Multiple Troopers',
        effetto: '+1 B per OGNI alleato ingaggiato nel medesimo Corpo a Corpo.',
        note: 'Vale per entrambi i lati: anche il difensore lo riceve se ha alleati nella mischia (es. un Dottore con la sua Periferica).',
        // 🔴 N5.3 ha cambiato la soglia: "2 or more Troopers" in contatto, prima
        // "more than 2". L'implementazione da` gia` +1 B per alleato senza
        // soglie, quindi e` conforme — cambia solo la nota.
        // Fonte: N5.3, RIPORTATA dalla chat REGOLE (giro del 20 settembre):
        // non verificabile sul testo v5.1.1 del progetto.
        sogliaN53: 'Dalla N5.3 si applica con 2 o piu` truppe in contatto (prima: piu` di 2).',
        // Chi conta come alleato ai fini del +1 B:
        contanoSolo: 'Contano solo gli alleati NON in stato Nullo ne` Immobilizzato. In ARO non contano nemmeno quelli che hanno dichiarato Schivata, Idle o Reset.',
        fonteSoglia: 'N5.3 (riportata, non verificata sul testo del progetto)',
        input: 'MANUALE: il numero di alleati ingaggiati non e` deducibile dai dati, deve dirlo il giocatore.'
    },

    colpoDiGrazia: {
        nome: 'Coup de Grace',
        condizione: 'Bersaglio nemico in Stato Incosciente (incluso il Segnalino Shasvastii-Embryo).',
        effetto: 'Senza alcun tiro, il bersaglio passa automaticamente da Incosciente a Morto, senza possibilita` di Tiro Salvezza.',
        eccezione: 'NON utilizzabile contro chi ha attivato Dogged o No Wound Incapacitation: in quel caso il CC Attack si risolve normalmente.'
    },

    // Notazioni di profilo specifiche del CC.
    notazioni: {
        'CC Attack (+3)':   'MOD positivo al CC dell\'utente.',
        'CC Attack (-3)':   'I BERSAGLI dell\'utente applicano -3 ai propri Tiri Faccia a Faccia. NON e` un malus che l\'utente si da` da solo.',
        'CC Attack (SR-1)': 'I bersaglii applicano -1 ai propri Tiri Salvezza contro i colpi dell\'utente.',
        'CC Attack (Shock)': 'L\'utente aggiunge munizioni Shock a tutti i propri CC Attack.',
        'CC Attack (Continuous Damage)': 'L\'utente applica il Tratto Continuous Damage a tutti i propri CC Attack.',
        'CC Attack (+1B)':  '+1 al Burst dell\'arma CC, solo in Turno Attivo.',
        // 🔴 Questa riga aveva DUE errori: dava il -3 come valore dell'arma,
        // e diceva che il MOD va sul Faccia a Faccia. Va sul TIRO SALVEZZA.
        // Il regolamento (Melee Weapon Profile): "la colonna Attributo del
        // Tiro Salvezza puo` mostrare l'attributo con dei MOD, di solito
        // negativi (-3, -6), oppure direttamente il valore (ARM=0)".
        // Quindi "PARA CC Weapon (-6)" significa Tiro Salvezza su PH-6.
        'PARA CC Weapon (-N)': 'MOD al TIRO SALVEZZA del bersaglio, non al Faccia a Faccia: la salvezza si fa su PH-N. Il valore e` per profilo — nei database convivono -3, -6 e -9 — e sovrascrive il PH-6 del Weapon Chart.'
    }
};

// ------------------------------------------------------------------
// MARTIAL ARTS — tabella ufficiale N5
//
// Il LIVELLO sta nel NOME (Martial Arts L1..L5), non fra parentesi:
// il numero fra parentesi in un profilo e` sempre un valore-MOD.
//
// I MOD si applicano SIA in Turno Attivo SIA in Turno Reattivo.
// ------------------------------------------------------------------
window.CATALOGO_N5.MARTIAL_ARTS = {
    livelli: {
        1: { attaccoMod: 0,  avversarioMod: -3, burstMod: 0, sd: 0 },
        2: { attaccoMod: 3,  avversarioMod: -3, burstMod: 0, sd: 0 },
        3: { attaccoMod: 3,  avversarioMod: -3, burstMod: 0, sd: 1 },
        4: { attaccoMod: 3,  avversarioMod: -3, burstMod: 1, sd: 0 },
        5: { attaccoMod: 3,  avversarioMod: -3, burstMod: 1, sd: 1 }
    },
    legenda: {
        attaccoMod:    'MOD al CC dell\'utente quando dichiara un CC Attack.',
        avversarioMod: 'MOD applicato all\'attributo del NEMICO nei Tiri Faccia a Faccia.',
        burstMod:      'MOD al valore B dell\'arma CC dell\'utente.',
        sd:            '(+1 SD): un dado extra che si tira e poi si scarta scegliendo. NON aumenta il Burst e non consuma usi Disposable.'
    },
    noteSD: 'Nel Faccia a Faccia il dado si scarta DOPO che entrambi hanno tirato. Se entrambi devono scartare, sceglie prima il Giocatore Attivo. Con B1 e (+1 SD) il dado extra non puo` essere assegnato a un altro bersaglio.',
    noteApplicazione: 'Attivo E Reattivo. Se una truppa ha piu` CC Special Skill (es. Berserk + Martial Arts) le usa tutte e ne combina i MOD.',

    naturalBornWarrior: {
        effetto: 'Annulla i MOD NEGATIVI al proprio CC (tipicamente l\'avversarioMod delle Martial Arts nemiche).',
        note: 'In N5 NON annulla i MOD positivi del nemico: quelli restano.'
    },

    // ⚠️ In N4 le Martial Arts concedevano anche Surprise Attack, Stealth e
    // V: Courage. La pagina N5.2 NON lo dice piu`: non darlo per scontato.
    attenzioneN4: 'La concessione automatica di Surprise Attack/Stealth/V:Courage era una regola N4 e non compare nella pagina N5.2.'
};

// ------------------------------------------------------------------
// DIFESE E FUOCO DI SOPPRESSIONE
// VERIFICATO sulla wiki N5.2 (Dodge, Reset, Suppressive Fire).
// ------------------------------------------------------------------
window.CATALOGO_N5.DIFESA = {

    'SCHIVATA': {
        nome: 'Dodge', attributo: 'PH', tipo: 'SHORT_SKILL',
        malusSenzaLoF: -3,
        noteMalus: '-3 se non si ha LoF verso l\'attaccante. Stesso -3 schivando un\'arma a Sagoma senza LoF, o un\'arma Deployable (mina).',
        concessaSenzaLoF: 'Chi e` colpito da una Sagoma puo` sempre dichiarare Schivata, anche senza LoF verso chi attacca.',
        notazioni: {
            'Dodge (+3)':    'MOD positivo al PH dell\'utente quando schiva.',
            'Dodge (-3)':    'I nemici applicano -3 ai propri Tiri Faccia a Faccia contro l\'utente.',
            'Dodge (ARM+3)': 'Se l\'utente FALLISCE il tiro PH di Schivata, somma +3 al PROPRIO valore ARM per il Tiro Salvezza.'
        },
        bonusFireteam: '+1 con Fireteam da 3 o piu` membri.'
    },

    'RESET': {
        nome: 'Reset', attributo: 'WIP', tipo: 'SHORT_SKILL',
        malusBersagliato: -3,
        noteMalus: 'Lo Stato Bersagliato da` -3 ai Tiri Reset.',
        note: 'Il malus di LoF NON si applica al Reset: e` una regola della Schivata.'
    },

    'SOPPRESSIONE': {
        nome: 'Suppressive Fire',
        tipo: 'ENTIRE_ORDER',
        requisitoArma: 'Arma col Tratto "Suppressive Fire".',
        effetto: 'L\'utente entra nello Stato Fuoco di Soppressione con l\'arma scelta.',

        // Il profilo SF sostituisce SOLO gittata e Burst.
        sfModeAltera: ['GITTATA', 'BURST'],
        sfModeNonAltera: ['PS', 'MUNIZIONI', 'TRATTI'],
        noteSfMode: 'Il profilo SF Mode cambia SOLO i valori di gittata e di Burst dell\'arma usata. PS, munizioni e Tratti restano quelli originali.',

        burstARO: 3,
        noteBurst: 'In ARO si reagisce col Burst pieno della SF Mode: B3. Il Burst pieno va SEMPRE contro un bersaglio solo e non si puo` dividere fra piu` nemici attivi (per esempio reagendo a un Ordine Coordinato).',

        malusAiNemici: -3,
        noteMalusNemici: 'Chi dichiara BS Attack contro una truppa in Fuoco di Soppressione applica -3.',

        cancellazione: [
            'La truppa dichiara un Ordine.',
            'La truppa dichiara un ARO diverso da un BS Attack con la SF Mode.',
            'La truppa usa un\'arma non utilizzabile per la Soppressione.',
            'La truppa entra in Stato Nullo, o in Accecato, Ingaggiato, Immobilizzato, Isolato, Ritirata!'
        ],
        fireteam: 'Attivare il Fuoco di Soppressione fa uscire automaticamente dal Fireteam.',
        automatiche: 'Non interferisce con Abilita` Speciali ed Equipaggiamenti Automatici, che continuano a funzionare.'
    }
};

// ------------------------------------------------------------------
// PROFILO SF MODE
//
// ⚠️ I VALORI DI MOD NON SONO STATI VERIFICATI su una fonte ufficiale in
// questa sessione. La struttura delle bande (fino a 16", 24", 96") viene
// dagli appunti di progetto; i MOD sono una ricostruzione.
// Il motore li usa MA emette un avviso, e la schermata lo mostra.
// Da confermare sulla tabella armi ufficiale prima di fidarsene.
// ------------------------------------------------------------------
window.CATALOGO_N5.SF_MODE = {
    fonte: 'wiki — Weapon Chart, riga "Suppressive Fire Mode": 0 | 0 | -3 | -- | -- | -- | -- , B3. VERIFICATO direttamente',
    profiloUnico: true,   // e` UN SOLO profilo per tutte le armi, NON uno per arma
    burst: 3,
    // Bande ufficiali, formato a fasce da 8": 0 (0-8"), 0 (8-16"), -3 (16-24").
    // L'array finisce qui: oltre 24" l'arma in Soppressione NON ha gittata.
    bande: [0, 0, -3],
    ranges: { 'p0': 16, 'm3': 24 },   // stesso dato nel vecchio formato, per retrocompatibilita`
    gittataMassima: 24,
    ereditaDallArmaOriginale: ['PS', 'munizione', 'attributoSalvezza', 'numeroSalvezze', 'tratti'],
    trattoRichiesto: 'Suppressive Fire',   // solo le armi con questo Tratto possono entrare in SF
    note: 'UN SOLO profilo valido per qualunque arma: sostituisce SOLO Gittata e Burst. PS, munizione, attributo e numero di Tiri Salvezza e Tratti restano quelli dell\'arma originale. ATTENZIONE: la gittata massima in SF e` 24" anche per armi che normalmente arrivano molto oltre — un HMG in Soppressione NON puo` sparare a 40". Quali armi possano entrare in SF e` invece un dato PER ARMA: sta nel campo `traits` di RULES_WEAPONS in database_comune.js.'
};

// ------------------------------------------------------------------
// MOVIMENTO E ABILITA` SENZA TIRO
// VERIFICATO sulla wiki N5.2 (Move, Cautious Movement, Climb, Jump, Idle,
// General Movement Rules, Order Expenditure Sequence).
//
// Serve al modulo movimento per sapere quali azioni NON richiedono un
// calcolo, invece della lista scritta a mano che c'era prima.
// ------------------------------------------------------------------
window.CATALOGO_N5.MOVIMENTO = {

    // Abilita` che non producono alcun tiro: l'ordine si chiude senza calcolo.
    senzaTiro: {
        'MOVIMENTO':        { nome: 'Move',              tipo: 'BASIC_SHORT', generaAro: true },
        'CAUTO':            { nome: 'Cautious Movement', tipo: 'ENTIRE_ORDER', generaAro: 'CONDIZIONALE' },
        'ARRAMPICARSI':     { nome: 'Climb',             tipo: 'LONG_SKILL',  generaAro: true,
                              note: 'Diventa Abilita` Breve Base con Climbing Plus. Chi arrampica NON beneficia della Copertura Parziale.' },
        'SALTO':            { nome: 'Jump',              tipo: 'LONG_SKILL',  generaAro: true },
        // 🔴 L'Idle GENERA ARO. Il regolamento e` esplicito: "A Trooper that
        // declares Idle performs no action. As such, its declaration just
        // activates the Trooper, potentially generating AROs."
        // Qui c'era generaAro: false, ed era l'unica azione di movimento a
        // non generarne. La conseguenza e` reale: l'Idle e` cio` che si
        // dichiara quando NON si soddisfano i requisiti di un'Abilita` —
        // Trincerarsi senza spazio, un gregario in Coordinato — quindi chi
        // falliva un requisito non generava l'ARO che spetta all'avversario.
        'IDLE':             { nome: 'Idle',              tipo: 'BASIC_SHORT', generaAro: true,
                              note: 'Non compie alcuna azione, ma ATTIVA la truppa: puo` generare ARO.',
                              quandoSiDichiara: [
                                  'Quando chi ha ricevuto un Ordine sceglie di non agire con una delle due Abilita` Brevi.',
                                  'Nel Passo di Risoluzione, se i Requisiti di un\'Abilita` dichiarata non risultano soddisfatti.'
                              ],
                              // Due conseguenze che il regolamento elenca e che l'app deve ricordare.
                              seDaRequisitoFallito: [
                                  'Le munizioni delle armi o degli Equipaggiamenti Disposable sono comunque SPESE.',
                                  'Se la truppa e` in forma di Marker, viene RIVELATA e sostituita col Modello.'
                              ],
                              fonte: 'regolamento, p.80' },
        'RICARICARE':       { nome: 'Reload',            tipo: 'SHORT_SKILL', generaAro: true },
        'ALLERTA':          { nome: 'Alert',             tipo: 'ARO',         generaAro: false },
        'GUARDA_FUORI':     { nome: 'Look Out',          tipo: 'SHORT_SKILL', generaAro: true },
        // 🔴 La chiave dev'essere la stringa CANONICA, la stessa che usano
        // M.AZIONI, le SPEC e il router. Con 'PIAZZA_DEPLOYABLE' la voce
        // c'era ma azioneSenzaTiro('PIAZZARE EQUIPAGGIAMENTO') non la
        // trovava: un dato presente e irraggiungibile.
        'TRINCERARSI': { nome: 'Sapper (Foxhole)', tipo: 'LONG_SKILL', generaAro: true,
                              note: 'Ordine Intero, nessun tiro. Se lo spazio non basta, la truppa esegue un Idle.' },
        'PIAZZARE EQUIPAGGIAMENTO': { nome: 'Place Deployable', tipo: 'SHORT_SKILL', generaAro: true,
                              note: 'Se c\'e` un Marker Mimetico nemico nell\'Area d\'Innesco, va invece dichiarato un Attacco Intuitivo.' }
    },

    // 🔴 Regola che il modulo precedente non aveva.
    movimentoCauto: {
        testo: 'Il Movimento Cauto non genera ARO SOLO se inizia e finisce in due punti del tavolo che stanno fuori dalla LoF E dalla ZdC di TUTTI i Modelli e Marker nemici.',
        seDentro: 'Se inizia o finisce dentro la LoF o la ZdC di un qualsiasi nemico (in forma di Modello) o Marker, gli ARO si generano come al solito.',
        note: 'La condizione non e` deducibile dai dati: la deve dichiarare il giocatore.',
        distanzaZdC: 8
    },

    requisitiAllaDichiarazione: {
        testo: 'I Requisiti si controllano al momento della DICHIARAZIONE per: Allerta, qualsiasi Abilita` Breve Base, e le Abilita` Lunghe Salto e Arrampicarsi. Per tutte le altre si controllano nella Risoluzione.',
        fallimento: 'Se i Requisiti non sono soddisfatti l\'azione e` annullata e la truppa esegue un Idle. Gli usi Disposable dichiarati vengono comunque consumati.'
    },

    proneEMovimento: 'Con un\'Abilita` col Tratto Movimento (tranne Salto e Berserk) si puo` entrare o uscire da Prono all\'inizio o alla fine del movimento, senza costo.',
    idleDaFallimento: 'Se la truppa non riesce a raggiungere una nuova posizione con Move, Salto o Arrampicarsi, il movimento non avviene e si esegue un Idle.'
};

// ------------------------------------------------------------------
// ORDINE COORDINATO
// VERIFICATO sulla wiki N5.2/N5.3 (Coordinated Orders, Fireteam Bonuses).
// ------------------------------------------------------------------
window.CATALOGO_N5.ORDINE_COORDINATO = {

    massimoTruppe: 4,
    costo: '1 Command Token PIU` 1 Ordine Regolare dal Pool del Gruppo di Combattimento dei partecipanti.',
    quando: 'Solo durante la Fase Ordini del proprio Turno Attivo.',

    requisitiPartecipanti: [
        'Stesso Addestramento: Regolari con Regolari, Irregolari con Irregolari.',
        'Stesso Gruppo di Combattimento.'
    ],

    // 🔴 LA REGOLA CHE IL CALCOLATORE SBAGLIAVA.
    burst: {
        puntaDiLancia: 'META` del Burst indicato dall\'arma, Equipaggiamento o Abilita` Speciale, bonus COMPRESI, arrotondata per ECCESSO.',
        gregari: 'Burst ridotto a 1, qualunque sia l\'arma, l\'Equipaggiamento o l\'Abilita` Speciale.',
        attenzione: 'NON confondere con il Fireteam: il Leader del Fireteam ha il Burst PIENO. La wiki mette i due casi in contrasto esplicito.'
    },

    stessaSequenza: 'Tutti i partecipanti devono dichiarare ed eseguire la STESSA identica sequenza di Abilita`.',
    stessoBersaglio: 'Se una delle Abilita` richiede un bersaglio — truppa, Marker o obiettivo — tutti devono agire contro LO STESSO singolo bersaglio.',

    requisitiNonSoddisfatti: 'Chi non soddisfa i Requisiti di un\'Abilita` esegue un Idle, mentre gli altri agiscono normalmente. Ai fini della generazione degli ARO conta comunque come se avesse dichiarato tutto.',

    corpoACorpo: {
        soloLaPunta: 'Dichiarando un CC Attack, SOLO la Punta di Lancia esegue il tiro.',
        bonus: '+1 al Burst e +1 al PH per il danno per OGNI alleato partecipante all\'Ordine ingaggiato con l\'avversario.',
        note: 'Gli alleati ingaggiati che NON partecipano all\'Ordine non danno alcun bonus. Da non confondere con "Close Combat with Multiple Troopers", che vale in generale.'
    },

    aro: {
        unoSolo: 'Il gruppo provoca UN SOLO ARO a ciascun nemico in LoF o ZdC.',
        bersaglioReattivo: 'Ogni truppa reattiva deve scegliere UNA SOLA delle truppe attivate come proprio bersaglio, ma non e` obbligata a scegliere la stessa delle altre.'
    },

    fine: 'A Ordine concluso il Segnalino Punta di Lancia si rimuove dal tavolo.'
};

// ------------------------------------------------------------------
// ATTIVAZIONE DI UNA TRUPPA
// Quali Stati impediscono di ricevere un Ordine dal Pool.
// Erano scritti due volte dentro ordine_coordinato.js e in nessun altro
// posto: qui diventano una regola sola.
// ------------------------------------------------------------------
window.CATALOGO_N5.ATTIVAZIONE = {
    impedita: {
        morto:        'Stato Nullo: non puo` essere attivato.',
        incosciente:  'Stato Nullo: non puo` dichiarare Ordini attivi.',
        isolato:      'Non puo` ricevere Ordini dal Pool Ordini: puo` usare solo il proprio Ordine Irregolare.',
        disconnesso:  'Non puo` essere attivato ne` dichiarare Ordini o ARO.',
        // VERIFICATO wiki: entrambe le pagine dicono la stessa frase —
        // "cannot be activated or receive Orders from their player's Order Pool".
        // La truppa e` considerata NEMICA dai propri compagni e alleata da chi
        // ha causato lo stato.
        posseduto:      'Posseduto: non puo` essere attivato ne` ricevere Ordini dal proprio Pool. Passa sotto controllo avversario.',
        sepsitorizzato: 'Sepsitorizzato: non puo` essere attivato ne` ricevere Ordini dal proprio Pool. Esce automaticamente dal Gruppo di Combattimento e dal Fireteam.'
    },

    cancellaSoppressione: 'Attivare una miniatura in Fuoco di Soppressione ANNULLA lo stato, anche se poi l\'Ordine viene speso in altro modo.'
};

// ------------------------------------------------------------------
// FIRETEAM — livelli e bonus
// VERIFICATO sulla wiki N5.3 (Fireteam Bonuses).
//
// 🔴 IL LIVELLO NON E` IL NUMERO DI MEMBRI. E` il numero di truppe della
// STESSA UNITA`. Un Fireteam di cinque truppe di Unita` diverse e` di
// Livello 1: nessun bonus oltre l'attivazione con un Ordine solo.
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// FIRETEAM INTEGRITY — cosa fa uscire dal Fireteam
// VERIFICATO sulla wiki N5.2/N5.3 (Fireteam Integrity).
//
// I due file del progetto si contraddicevano:
//   fireteam.js       includeva la Soppressione, NON gli Immobilizzati
//   logica_stati.js   includeva gli Immobilizzati, NON la Soppressione
// La lista ufficiale da` ragione a fireteam.js su entrambi i punti, ma
// nessuno dei due aveva le altre sei cause.
// ------------------------------------------------------------------
window.CATALOGO_N5.FIRETEAM_INTEGRITA = {

    cause: {
        'ISOLATO':        { auto: true,  testo: 'La truppa entra o e` in Stato Isolato.' },
        'STATO_NULLO':    { auto: true,  testo: 'La truppa entra o e` in uno Stato Nullo (Incosciente, Morto).' },
        'FORMA_MARKER':   { auto: true,  testo: 'La truppa entra o e` in uno stato che permette la sostituzione con un Marker (CAMO, Impersonation, Holoecho, Decoy...), salvo diversa indicazione di Skill, Equipaggiamento o Regola di Scenario.' },
        'SOPPRESSIONE':   { auto: true,  testo: 'La truppa entra in Fuoco di Soppressione.' },
        'COERENZA':       { auto: false, testo: 'La truppa rompe la Coerenza col Leader del Fireteam.' },
        'ORDINE_IRREGOLARE': { auto: false, testo: 'La truppa e` Irregolare e usa il proprio Ordine Irregolare.' },
        'ORDINE_TENENTE': { auto: false, testo: 'La truppa e` il Tenente e spende l\'Ordine Speciale di Tenente.' },
        'IMPETUOSO':      { auto: false, testo: 'La truppa e` Impetuosa ed e` attivata nella Fase Impetuosa.' },
        'CAMBIO_GRUPPO':  { auto: false, testo: 'La truppa viene spostata in un Gruppo di Combattimento diverso.' },
        'ARO_DIVERSO':    { auto: false, testo: 'Nel Turno Reattivo, la truppa dichiara un ARO diverso da quello del Fireteam.' }
    },

    // 🔴 NON e` una causa di rottura, malgrado logica_stati.js lo dicesse.
    immobilizzatoNonRompe: 'Gli Stati Immobilizzato-A e Immobilizzato-B NON fanno uscire dal Fireteam: il regolamento li tratta come categoria distinta dagli Stati Nulli.',

    quando: 'La truppa esce dal Fireteam nel momento in cui l\'Ordine o l\'ARO viene dichiarato. Nel Turno Attivo non viene attivata dall\'Ordine del Fireteam, quindi ai fini degli ARO conta come inattiva.',

    rientro: 'Se il Fireteam non e` stato annullato, chi ne e` uscito puo` rientrarvi automaticamente quando torna in Coerenza col Leader, durante la Fase Conteggio Ordini del proprio Turno Attivo successivo.',

    aroDelFireteam: 'Nel Turno Reattivo l\'ARO del Fireteam e` quello dichiarato dalla maggioranza dei membri. Senza maggioranza sceglie il giocatore, e gli altri escono dal Fireteam.',

    nonPossonoEntrare: [
        'Periferiche e i loro Controllori.',
        'Truppe in forma di Marker.',
        'Truppe con l\'Abilita` Infiltrazione.',
        'Truppe con Abilita` che portano l\'etichetta Schieramento Aereo.',
        'Truppe che attivano o sono in Fuoco di Soppressione.',
        'Truppe schierate in Stato Decoy.',
        'Truppe in Stato Isolato o in qualunque Stato Nullo.'
    ],
    noCoordinato: 'I membri di un Fireteam NON possono partecipare a un Ordine Coordinato.',
    soppressioneAnnullata: 'Entrando in un Fireteam, lo Stato Fuoco di Soppressione viene automaticamente annullato.'
};

window.CATALOGO_N5.FIRETEAM = {

    calcoloLivello: 'Il Livello e` pari al numero di truppe del Fireteam che appartengono alla STESSA Unita`. Due truppe appartengono alla stessa Unita` se hanno lo stesso nome di Unita`, oppure se la Fireteams Chart del Settoriale le elenca con lo stesso termine fra parentesi.',
    quandoRicalcolare: 'Alla creazione del Fireteam, e dopo OGNI Ordine o ARO dichiarato.',

    livelli: {
        1: { requisito: 'Le truppe possono appartenere tutte a Unita` diverse.',
             bonus: [], attivazione: 'I membri si attivano con un solo Ordine Regolare.' },
        2: { requisito: 'Almeno 2 truppe della stessa Unita`.',
             sd: 1,
             note: 'BS Attack (+1 SD). Vale anche nel Turno Reattivo per TUTTI i membri. Cumulabile con altri (+1 SD) del profilo. NON si applica alle Long Skill ne` a cio` che non richiede un tiro (Sagome Dirette). Vale su MediKit e GizmoKit usati come armi BS.' },
        3: { requisito: 'Almeno 3 truppe della stessa Unita`.',
             discover: 3, dodge: 1,
             note: 'In Attivo E in Reattivo, per tutti i membri.' },
        4: { requisito: 'Almeno 4 truppe della stessa Unita`.',
             bs: 1,
             note: 'Dichiarando BS Attack. Il +1 vale ANCHE per le armi coi Tratti "BS Weapon (PH)" e "BS Weapon (WIP)": quindi anche le Granate, che tirano su PH.' },
        5: { requisito: 'Tutte e 5 le truppe della stessa Unita`.',
             sestoSenso: true }
    },

    cumulabili: 'Salvo diversa indicazione i bonus del Fireteam sono cumulabili fra loro e con MOD di altre regole, Abilita` Speciali, Equipaggiamenti o Programmi di Hacking.',

    // FAQ 0.0.0, ott. 2025
    nonSuDiscover: 'I bonus "BS Attack (+1 SD)" e "+1 BS" NON si applicano a Discover.',

    leaderBurstPieno: 'A differenza della Punta di Lancia dell\'Ordine Coordinato, nel Turno Attivo il Leader del Fireteam ha il Burst PIENO della propria arma, piu` i bonus applicabili.',

    composizione: {
        haris: 'Un Fireteam Haris, quando creato, deve contenere tre truppe.',
        core: 'Un Fireteam Core, quando creato, deve contenerne da tre a cinque.'
    }
};

// ------------------------------------------------------------------
// SCHIERAMENTO — cosa l'avversario puo` vedere
//
// Il filtro anti-spoiler funzionava per SOTTRAZIONE: copiava l'unita`
// intera e cambiava il nome. Statistiche, armi e Abilita` di un Marker
// arrivavano comunque all'avversario.
// Qui si elenca cosa si PUO` mandare: quel che non e` in lista non parte.
// ------------------------------------------------------------------
window.CATALOGO_N5.SCHIERAMENTO = {

    // Non esistono ancora per l'avversario: non vanno spedite affatto.
    invisibili: ['HIDDEN', 'RESERVE', 'AD'],
    noteInvisibili: 'Schieramento Nascosto, Riserva e Schieramento Aereo: la truppa non e` sul tavolo, l\'avversario non deve nemmeno sapere che esiste.',

    // Di un Marker si vede il segnalino e nient\'altro.
    campiMarker: ['id', 'alias', 'name', 'tipo', 'deployState', 'imgVariant', 'states', 'x', 'y'],
    noteMarker: 'Di un Marker Mimetico o Impersonation l\'avversario vede solo il segnalino: niente statistiche, armi, Abilita` o Equipaggiamento. Nemmeno il nome dell\'Unita`.',

    // Di una truppa visibile si vede tutto: e` sul tavolo a faccia in su.
    campiVisibili: ['id', 'nome', 'alias', 'name', 'tipo', 'deployState', 'imgVariant',
                    'states', 'combatGroup', 'cc', 'bs', 'ph', 'wip', 'arm', 'bts', 'w', 's',
                    'mov', 'weapon', 'equip', 'skills', 'x', 'y'],

    etichette: {
        'CAMO': 'SEGNALINO MIMETICO',
        'IMP':  'PERSONAGGIO SCONOSCIUTO',
        'HOLOECHO': 'COPIA OLOGRAFICA',
        'DECOY': 'BERSAGLIO DECOY',
        'SEED': 'SEED-EMBRYO'
    },

    holomask: 'Con HoloMask l\'avversario vede il nome FINTO e non le armi reali: il resto del profilo resta nascosto.',
    foxhole: 'Foxhole e` pubblico: l\'avversario lo vede.',

    promemoriaPostSchieramento: {
        'BOOTY':         'Ricorda di tirare sulla tabella Booty.',
        'METACHEMISTRY': 'Ricorda di tirare sulla tabella Metachemistry.',
        // Il PH fra parentesi nel profilo, se c'e`, sostituisce il PH-3.
        'INFILTRATION':  'Se ti sei schierato nella meta` avversaria, hai fatto il Tiro di Infiltrazione (PH-3, o il PH fra parentesi del profilo)?'
    }
};

// ------------------------------------------------------------------
// SUPPORTO — Dottore, Ingegnere, MediKit, GizmoKit
// VERIFICATO sulla wiki N5.2/N5.3.
//
// 🔴 ASIMMETRIA DA NON CONFONDERE:
//    Dottore e Ingegnere  -> tira L'UTENTE, su WIP
//    MediKit e GizmoKit   -> tira IL BERSAGLIO, su PH
// ------------------------------------------------------------------
window.CATALOGO_N5.SUPPORTO = {

    'DOTTORE': {
        nome: 'Doctor', tipo: 'SHORT_SKILL',
        chiTira: 'UTENTE', attributo: 'WIP',
        requisiti: ['Contatto di Silhouette col bersaglio.', 'Il bersaglio deve avere l\'attributo VITA ed essere in Stato Incosciente.'],
        successo: 'Annulla lo Stato Incosciente rimuovendo 1 Ferita.',
        // 🔴 Il fallimento e` letale.
        fallimento: 'Il bersaglio entra AUTOMATICAMENTE in Stato Morto e viene rimosso dal tavolo.',
        fallimentoLetale: true,
        ritentabile: 'Si puo` recuperare la stessa truppa quante volte serve, finche` il Dottore passa il tiro.',
        suSeStesso: 'Il Dottore puo` usarla su se stesso, ma NON se e` in uno Stato Nullo.',
        riTiro: 'Se il bersaglio ha un Cubo, si possono spendere Command Token per ripetere un tiro fallito.'
    },

    'INGEGNERE': {
        nome: 'Engineer', tipo: 'SHORT_SKILL',
        chiTira: 'UTENTE', attributo: 'WIP',
        requisiti: ['Contatto di Silhouette col bersaglio.', 'Il bersaglio deve avere l\'attributo STR.'],
        successo: 'Rimuove 1 Ferita, annullando lo Stato Incosciente se presente. Ripetibile quante volte serve.',
        // Meno brutale del Dottore, ma comunque dannoso.
        fallimento: 'Il bersaglio riceve 1 Ferita invece di rimuoverla, entrando in Incosciente o Morto se il caso.',
        fallimentoLetale: false,
        modalitaStati: 'In alternativa, superando il tiro WIP, annulla TUTTI gli Stati del bersaglio annullabili dall\'Ingegnere TRANNE l\'Incosciente: Immobilizzato-A, Immobilizzato-B, Bersagliato e cosi` via.',
        riTiro: 'Se il bersaglio ha Remote Presence, si possono spendere Command Token per ripetere un tiro fallito.'
    },

    'MEDIKIT': {
        nome: 'MediKit', tipo: 'EQUIPAGGIAMENTO',
        // 🔴 Tira il BERSAGLIO, non l'utente.
        chiTira: 'BERSAGLIO', attributo: 'PH',
        bersaglio: 'Modello ALLEATO con attributo VITA, in Stato Incosciente.',
        modalita: {
            remota: 'A distanza: serve la LoF al bersaglio, ed e` un BS Attack.',
            contatto: 'In contatto di Silhouette: l\'utente spende un\'Abilita` Breve senza tirare.'
        },
        successo: 'Il bersaglio rimuove 1 Ferita e annulla lo Stato Incosciente.',
        fallimento: 'Il bersaglio entra AUTOMATICAMENTE in Stato Morto.',
        fallimentoLetale: true,
        senzaSalvezza: 'Il bersaglio di un MediKit non esegue Tiro Salvezza.',
        phDiProfilo: 'Se il profilo scrive "MediKit (PH=X)", il bersaglio usa QUEL valore di PH, non il proprio.',
        colpiMultipli: 'Con piu` colpi o usi nello stesso Ordine basta un tiro riuscito per rimuovere la Ferita, e comunque se ne rimuove UNA SOLA.',
        suSeStesso: 'Utilizzabile su se stessi, ma non in Stato Nullo.'
    },

    'GIZMOKIT': {
        nome: 'GizmoKit', tipo: 'EQUIPAGGIAMENTO',
        chiTira: 'BERSAGLIO', attributo: 'PH',
        bersaglio: 'Modello ALLEATO con attributo STR.',
        modalita: {
            remota: 'A distanza: serve la LoF al bersaglio, ed e` un BS Attack.',
            contatto: 'In contatto di Silhouette: l\'utente spende un\'Abilita` Breve senza tirare.'
        },
        successo: 'Il bersaglio rimuove 1 Ferita, annullando lo Stato Incosciente se presente. Con un solo tiro riuscito rimuove tutte le Ferite necessarie ad annullare l\'Incosciente.',
        fallimento: 'Il bersaglio riceve 1 Ferita invece di rimuoverla.',
        fallimentoLetale: false,
        senzaSalvezza: 'Il bersaglio di un GizmoKit non esegue Tiro Salvezza.',
        phDiProfilo: 'Se il profilo scrive "GizmoKit (PH=X)", il bersaglio usa QUEL valore.',
        statiIngegnere: 'Il bersaglio deve essere in uno Stato annullabile dall\'Abilita` Ingegnere.'
    },

    // Regole comuni
    technorganic: 'Con l\'Abilita` Technorganic lo Stato Incosciente si annulla con Dottore O Ingegnere, MediKit O GizmoKit, indipendentemente dall\'avere VITA o STR.',
    // Promemoria DI TAVOLO: il Prono esiste nel regolamento, ma l'app non lo
    // gestisce. La nota diceva "annulla automaticamente", come se l'app lo
    // facesse: ora lo dice lei stessa. (Chat TEST, 23 settembre.)
    proneAnnullato: 'Al tavolo: annullare lo Stato Incosciente annulla anche lo Stato Prono. Se il segnalino è a terra, toglilo — l\'app non traccia il Prono.',
    ordineEffetti: 'Se nello stesso Ordine una truppa riceve e rimuove Ferite o Stati, si applica PRIMA l\'effetto positivo e POI quello negativo.'
};

// ------------------------------------------------------------------
// SCENOGRAFIA — torrette, console, antenne, porte
//
// La scenografia e` NEUTRA: non appartiene a nessuno dei due giocatori,
// quindi non si filtra per fazione. Entrambi possono agirci.
//
// 🔴 La validita` come bersaglio NON dipende dall'essere una struttura, ma
// dai suoi TRATTI e dall'azione dichiarata. Una Console e` bersaglio di
// Hacking ma non di un Combi Rifle; una Porta Bulkhead si abbatte solo con
// armi Anti-materiel; il Tech-Coffin non si abbatte affatto.
// Offrire tutto a tutti significherebbe dare per buono un bersaglio che le
// regole non ammettono.
// ------------------------------------------------------------------
// Qui c'era un PRIMO blocco window.CATALOGO_N5.SCENOGRAFIA (tipi,
// campoNeutrale, torrettaEModello, ordiniScenografia, noteStati), sempre
// sovrascritto da quello sotto: morto, e nessuno ne leggeva le chiavi.
// Descriveva ancora la torretta come un Modello bersagliabile come truppa,
// mentre la Armed Turret e` un'arma Deployable. Tolto. (Chat REGOLE.)

// ------------------------------------------------------------------
// SCENOGRAFIA — torrette, console, antenne, porte
//
// 🔴 Due decisioni di regole, non di interfaccia:
//
// 1. LA SCENOGRAFIA E` NEUTRA. Non appartiene a nessun giocatore, quindi
//    NON si filtra per fazione: entrambi possono agirci. Il roster nemico
//    si filtra, la scenografia no.
//
// 2. LA VALIDITA` DIPENDE DALL'AZIONE E DAI TRATTI, non dall'essere una
//    struttura. Una Console e` bersaglio di Hacking ma non di un Combi
//    Rifle; una Porta Bulkhead si abbatte solo con Anti-materiel; il
//    Tech-Coffin non si abbatte affatto. Offrire tutto a tutti darebbe per
//    buono un bersaglio che le regole non ammettono.
// ------------------------------------------------------------------
window.CATALOGO_N5.SCENOGRAFIA = {

    neutra: 'La scenografia non appartiene a nessun giocatore: entrambi possono agirci. Si riconosce da `neutrale: true` oppure dal tipo STRUTTURA.',

    // Cosa ciascun Tratto permette e cosa vieta.
    tratti: {
        'Hackable': {
            ammette: ['HACKING'],
            nota: 'Bersaglio di Attacchi Comms. NON di armi BS o CC: non c\'e` niente da abbattere, c\'e` un sistema da violare.'
        },
        'Repeater': {
            ammette: ['HACKING'],
            nota: 'Oltre a essere bersaglio, estende la Zona di Hacking di chi la controlla: un Hacker puo` agire attraverso di essa.',
            estendeZonaHacking: true
        },
        'Destructible': {
            ammette: ['ATTACCO BS', 'ATTACCO CC', 'FUOCO SPECULATIVO', 'ATTACCO GUIDATO', 'ATTACCO INTUITIVO'],
            nota: 'Si abbatte con le armi. Il Tiro Salvezza usa ARM o BTS come una truppa.'
        },
        'Anti-Materiel Only': {
            richiedeMunizione: ['AM', 'ANTI-MATERIEL'],
            richiedeTratto: ['Anti-materiel'],
            nota: 'Si abbatte SOLO con armi o munizioni Anti-materiel. Ogni altro attacco non le fa nulla.'
        },
        'Indestructible': {
            vieta: ['ATTACCO BS', 'ATTACCO CC', 'FUOCO SPECULATIVO', 'ATTACCO GUIDATO', 'ATTACCO INTUITIVO', 'HACKING'],
            nota: 'Non si abbatte e non si viola. Resta bersaglio delle sole azioni di interazione.'
        },
        'Objective': {
            ammette: ['INTERAGIRE OBIETTIVO'],
            nota: 'Bersaglio dell\'azione Interagire con Obiettivo, secondo la Regola di Scenario in vigore.'
        },
        'Automated': {
            nota: 'Agisce da sola secondo le proprie regole: non riceve Ordini dal Pool. Come BERSAGLIO si comporta come una truppa.',
            riceveOrdini: false
        },
        '360 Visor': {
            nota: 'Nessun arco di tiro: non concede il MOD di Attacco a Sorpresa da dietro.'
        }
    },

    // Una TORRETTA senza Tratti di struttura si comporta come una truppa:
    // ha arma, ARM, BTS e STR, quindi e` bersagliabile come tale.
    // RISCRITTA: niente torrette neutrali (decisione di Paolo). La Armed Turret
    // e` un Deployable del PROPRIETARIO. Chiave tenuta per compatibilita`.
    torrettaComeTruppa: 'La Armed Turret e` un Deployable di chi la schiera (DB_DEPLOYABLES), non scenografia. E` bersaglio di attacchi come una truppa — ARM 2, BTS 3, STR 1 — e del Deactivator nemico; si rimuove a Ferite >= STR (riga 6505). Reagisce solo agli Ordini dei nemici del proprietario, mai contro un Marker (riga 6497).',

    // Le azioni che agiscono SOLO sulla scenografia.
    azioniScenografia: {
        'INTERAGIRE OBIETTIVO': 'Richiede il Tratto Objective sul bersaglio, contatto di Silhouette e in genere un tiro WIP secondo la Regola di Scenario.',
        // 🔴 Qui c'era scritto "contatto di Silhouette": e` sbagliato.
        'DEACTIVATOR': 'Tiro NORMALE su WIP. Il bersaglio deve essere nella LoF O nella ZdC dell\'utente — NON serve il contatto di Silhouette.'
    },

    // ------------------------------------------------------------------
    // DEACTIVATOR — VERIFICATO sulla wiki N5.2
    // ------------------------------------------------------------------
    deactivator: {
        tipo: 'EQUIPAGGIAMENTO',
        attributo: 'WIP',
        requisiti: [
            'Il bersaglio deve essere nella LoF OPPURE nella ZdC dell\'utente: il contatto di Silhouette non serve.',
            'Solo Armi ed Equipaggiamenti Deployable NEMICI, e solo se GIA` SCHIERATI sul tavolo.'
        ],
        // 🔴 Non serve nemmeno la LoF, basta la ZdC: e` la novita` N5, ed e`
        // cio` che rende utile spegnere un Ripetitore al coperto.
        bastaLaZdC: true,
        maiCamo: 'NON puo` bersagliare i Marker Mimetici. E siccome le mine si schierano come CAMO(-3), va prima Scoperta: finche` e` un Marker il Deactivator non la vede.',
        gittate: 'Ha MOD di gittata propri, la riga "Deactivator" del Weapon Chart: +6 a 0-8", +3 a 8-16", -6 a 16-24".',
        successo: 'Il dispositivo nemico viene disattivato e rimosso dal gioco.',
        bersagliTipici: 'Mine, FastPanda, WildParrot, Deployable Cover, Deployable Repeater, Armed Turret, Dazer, CrazyKoala, MadTraps, Drop Bear.',
        // Disco Baller: la stessa attrezzatura riaccende una Disco Ball ALLEATA.
        discoBall: 'Con l\'Abilita` Disco Baller la stessa attrezzatura riattiva una Disco Ball ALLEATA, con un tiro WIP+3 e gli stessi MOD di gittata. Mai una Disco Ball nemica.'
    }
};

// ------------------------------------------------------------------
// MODI DI RISOLUZIONE DELLE ARMI SENZA GITTATA
//
// Cinque armi del database non hanno bande, ne` isTemplate ne` isCC: si
// risolvono in un altro modo, dichiarato nel campo `risoluzione`.
// Senza questa tabella erano INUTILIZZABILI — creaAttacco le respingeva
// con E09 — e 84 profili fra i due database ne portano almeno una.
// ------------------------------------------------------------------
window.CATALOGO_N5.RISOLUZIONI = {

    // 🔴 LETTO dal regolamento, PARTE_1 righe 4700-4716.
    // Il Boost NON e` un Faccia a Faccia: il deployable non tira niente, e
    // la vittima fa una Schivata come TIRO NORMALE. Se passa evita tutto.
    BOOST_ZOC: {
        tiroPerColpire: false, gittata: false, innesco: 'ZDC',
        difesa: 'SCHIVATA_NORMALE', rimuoviDopo: true,
        etichetta: 'Attivazione in Zona di Controllo',
        fonte: 'regolamento', riga: 4700
    },

    // Dedotti da DATABASE sui Tratti: il Jammer non compare in PARTE_1 e
    // PARTE_2 e` un archivio di immagini, quindi non verificabile.
    // Non piu` dedotto. Il modo e` confermato dai Tratti del Jammer nel
    // database, presi dal Weapon Chart: BS Weapon (WIP), Comms Attack,
    // Zone of Control, No LoF. E` un Attacco Comms: Reset e Firewall si
    // applicano. (Segnalato dalla chat REGOLE, 21 settembre; la citazione
    // per posizione nel blocco Uncategorized non e` stata usata come prova.)
    ZOC_WIP: {
        tiroPerColpire: true, attributo: 'WIP', gittata: false,
        innesco: 'ZDC', etichetta: 'Zona di Controllo (WIP)',
        attaccoComms: true,
        fonte: 'Weapon Chart, via i Tratti del database'
    },
    CONTATTO_STRUTTURA: {
        tiroPerColpire: false, gittata: false, bersaglio: 'STRUTTURA',
        etichetta: 'Contatto con struttura', fonte: 'dedotto'
    },
    CC: {
        comeCC: true, etichetta: 'Corpo a corpo', fonte: 'dedotto'
    },

    // LETTO dal regolamento, righe 5566-5570. Non attacca e non ha salvezze:
    // il suo effetto e` estendere l'Area di Hacking del proprietario.
    RIPETITORE: {
        tiroPerColpire: false, gittata: false, attacca: false,
        effetto: 'estende l\'Area di Hacking del proprietario',
        etichetta: 'Ripetitore piazzato',
        fonte: 'regolamento', riga: 5566
    },

    // LETTO dal regolamento, righe 4522-4536.
    //
    // 🔴 Ha un ciclo di vita che nessun altro modo ha, e due punti in cui e`
    // facile sbagliare:
    //
    // 1. Il token NASCE DALL'ESITO DEL TIRO, non dall'equipaggiamento.
    //    Nessun profilo porta il "Disco Ball": i portatori hanno il "Disco
    //    Baller". Quindi creaDeployable va innescata dal risultato dell'arma,
    //    non scorrendo la lista equipaggiamento.
    //
    // 2. Alla Fase Stati si rimuove LA SAGOMA, NON IL TOKEN. Il token resta
    //    fino a fine partita o finche` non viene distrutto, ed e`
    //    bersagliabile (ARM 0, BTS 0, STR 1, S 1). Rimuoverlo farebbe sparire
    //    un bersaglio legittimo senza che nessuno se ne accorga, finche`
    //    qualcuno non prova a spararci.
    // Non risolve un attacco: CREA Copertura. E` il modo del Deployable Cover
    // (regolamento righe 10650-10689), che si piazza con Place Deployable
    // come le mine e non fa tiri. Le due varianti (Cutting Foam, Vitroferro)
    // sono modalita` dell'arma e le legge il motore. (Chat DATABASE, 22 sett.)
    COPERTURA: {
        tiroPerColpire: false, attributo: null, gittata: false,
        innesco: null, etichetta: 'Crea Copertura Parziale (Silhouette 3)',
        senzaTiro: true,
        fonte: 'regolamento righe 10650-10689'
    },
    PIAZZATO: {
        tiroPerColpire: false, gittata: false,
        nasceDa: 'esito arma',
        sagoma: { tipo: 'Circolare', munizione: 'ECLIPSE', centrata: true },
        disattivaA: 'inizio Fase Stati',
        cosaSiRimuove: 'SAGOMA',
        cosaResta: 'TOKEN',
        noteDisattivazione: 'Alla Fase Stati si rimuove la Sagoma Circolare, NON il token.',
        riattivabileCon: 'Activate Disco Ball',
        permanenza: 'fino a fine partita o distruzione',
        bersagliabile: true,
        etichetta: 'Piazzato con sagoma',
        fonte: 'regolamento', riga: 4522
    }
};

// ------------------------------------------------------------------
// DEPLOYABLE — innesco e piazzamento
// LETTO dal regolamento: PARTE_1 righe 4700-4716 e 5517-5549.
// ------------------------------------------------------------------
window.CATALOGO_N5.REGOLE_DEPLOYABLE = {

    boost: {
        innesco: 'Scatta quando un Modello nemico dichiara o esegue un Ordine o un ARO nella sua Zona di Controllo. L\'arma si muove fino al contatto di Silhouette e detona.',
        esclusi: ['CAMO', 'IMP-1', 'IMP-2'],
        noteEsclusi: 'Non scatta contro Marker Mimetici o Impersonation, ne` contro i Marker che lo dichiarano nella propria descrizione.',
        noSePercorsoBloccato: 'Non scatta se il percorso fino al nemico e` bloccato: un muro, una porta chiusa, o un varco troppo stretto per la Silhouette dell\'arma.',
        nonInnescaAltriDeployable: 'Per il Tratto Deployable, l\'arma non attiva altri Deployable.',
        difesa: 'L\'unica difesa e` una Schivata riuscita come TIRO NORMALE. Non e` un Faccia a Faccia: il deployable non tira.',
        rimozione: 'Dopo la detonazione l\'arma e` rimossa dal gioco.',
        fonte: 'regolamento', riga: 4700
    },

    piazzamento: {
        tipo: 'SHORT_SKILL', ancheInARO: true, tiro: false,
        attivo: 'A contatto di Silhouette, o lungo il percorso di movimento.',
        reattivo: 'A contatto di Silhouette, e serve la LoF.',
        perimeter: 'Col Tratto Perimeter si piazza ovunque dentro la ZdC del portatore.',
        entrataInGioco: 'Il token entra in gioco alla Conclusione dell\'Ordine.',
        reazioneNemica: 'Il nemico puo` reagire SOLO contro chi piazza, mai contro il deployable.',
        vietatoSe: 'Vietato se c\'e` un Marker mimetico nemico nella Trigger Area, salvo che dentro ci sia anche un nemico valido scoperto, o sia gia` stato fatto un Attacco Intuitivo.',
        fonte: 'regolamento', riga: 5517
    },

    bersagliabili: 'I deployable hanno profili propri e SONO bersagliabili come le truppe. (riga 5549)',

    // Activate Disco Ball: Abilita` Breve, richiede il Deactivator e il
    // Disco Ball in LoF o ZdC. Solo su Disco Ball ALLEATI.
    riattivaDiscoBall: {
        tipo: 'SHORT_SKILL',
        richiede: 'l\'Equipaggiamento Deactivator',
        portata: 'il Disco Ball dev\'essere nella LoF o nella ZdC',
        soloAlleati: 'Solo su Disco Ball ALLEATI, mai nemici.',
        effetto: 'Rimette la Sagoma Circolare Eclipse centrata sul token.',
        fonte: 'regolamento', riga: 4532
    },

    // 🔴 VINCOLO PER creaDeployable, dal regolamento riga 5532.
    // Nell'Ordine in cui viene piazzato il token NON e` bersagliabile: il
    // nemico puo` reagire SOLO contro chi piazza. Diventa bersaglio
    // dall'Ordine successivo.
    // Senza questo, l'interfaccia lo offrirebbe subito fra i bersagli.
    nonBersagliabileSubito: {
        regola: 'Nell\'Ordine del piazzamento il deployable NON e` bersagliabile. Il nemico reagisce solo contro chi lo sta piazzando.',
        campo: 'ordineDiPiazzamento',
        comeVerificare: 'creaDeployable marca il token con l\'Ordine in cui e` entrato; bersagliValidi lo esclude finche` l\'Ordine corrente e` quello.',
        fonte: 'regolamento', riga: 5532
    },

    // Le tre cose che l'app non puo` sapere da sola: non ha la mappa.
    // Stessa forma della domanda LoF/ZdC che il Movimento Cauto gia` fa.
    domande: {
        piazzamento: 'C\'e` un Marker mimetico nemico nell\'area d\'innesco?',
        perimeter: 'Il percorso dal portatore al punto scelto e` libero?',
        attivazione: 'Il nemico che si attiva e` dentro la ZdC del deployable, con percorso libero?'
    }
};

// ------------------------------------------------------------------
// TRATTI CONDIZIONALI
//
// Alcuni Tratti d'arma cambiano effetto A SECONDA DEL BERSAGLIO, quindi si
// risolvono al momento del Tiro Salvezza, quando il bersaglio e` noto — non
// in profiloArma, dove il bersaglio non c'e` ancora.
//
// ⚠️ NON confondere con TRATTI_ARMA, che e` la mappa arma -> Tratti: dice
// QUALI Tratti ha un'arma, non cosa fanno.
//
// Tre esiti diversi, non due. Il terzo lo abbiamo trovato leggendo la
// pagina Traits: un Tratto puo` anche annullare il Tiro Salvezza del tutto.
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// TRATTI CHE TOCCANO IL BURST E GLI USI
// VERIFICATO sulla wiki N5, pagina Traits.
// ------------------------------------------------------------------
window.CATALOGO_N5.TRATTI_BURST = {

    'Double Shot': {
        burstMod: +1,
        soloTurnoAttivo: true,
        // 🔴 Con Disposable (2) il MOD si applica SOLO se entrambi gli usi
        // sono liberi, e applicarlo LI CONSUMA ENTRAMBI, lasciando il
        // portatore in Stato Scarico.
        richiedeUsiLiberi: 'tutti',
        consumaUsi: 'tutti',
        lasciaScarico: true,
        note: 'Nel Turno Attivo l\'arma puo` applicare +1 al Burst. Con Disposable (2) serve che entrambi gli usi siano liberi, e applicarlo li consuma entrambi.',
        fonte: 'wiki N5, pagina Traits'
    },

    // "Burst (B) MODs cannot raise the B value higher than the remaining
    //  available uses." Il tetto e` sugli usi RESIDUI, quindi si ricalcola
    //  a ogni uso speso: con un uso solo rimasto il Burst non puo` superare 1.
    tettoSugliUsi: {
        regola: 'I MOD al Burst non possono alzare il Burst oltre gli usi RESIDUI.',
        siRicalcola: true,
        note: 'Con un uso gia` speso su Disposable (2), il tetto scende a 1: non resta 2.',
        fonte: 'wiki N5, pagina Traits'
    },

    // "those weapons possessing the Disposable Trait and different Modes
    //  share the number of uses provided by Disposable between all Modes."
    disposableCondiviso: {
        regola: 'Un\'arma con Disposable e piu` modalita` condivide gli usi FRA TUTTE le modalita`.',
        esempio: 'Le D-Charges hanno tre modalita` e Disposable (3): gli usi sono tre IN TOTALE, non tre per modalita`.',
        idle: 'Anche un Idle li spende.',
        fonte: 'wiki N5, pagina Traits'
    }
};

window.CATALOGO_N5.TRATTI_CONDIZIONALI = {

    // VERIFICATO verbatim, wiki N5 pagina Traits / Category:BioWeapon:
    // "This weapon applies the combination of DA+Shock Special Ammunition
    //  to targets with the Vitality (VITA) Attribute."
    //
    // 🔴 La condizione E` PARTE DELLA REGOLA. Mettere ammo DA+SHOCK e
    // salvTiri 2 fissi nel database avrebbe prodotto due salvezze
    // obbligatorie anche contro STR, che la regola esclude.
    'BioWeapon': {
        condizione: { attributoBersaglio: 'VITA' },
        seVero: { munizione: 'DA+SHOCK' },
        seFalso: { nessunCambio: true },
        noteVero: 'Bersaglio con VITA: si applica la combinazione DA+Shock.',
        noteFalso: 'Bersaglio senza VITA: il BioWeapon non lo potenzia, resta la munizione di base.',
        fonte: 'wiki N5, pagina Traits'
    },

    // "This weapon or piece of Equipment is only effective against targets
    //  with the Attribute indicated between brackets, either VITA or STR.
    //  If the target does not have the indicated Attribute, they do not
    //  need to make the Saving Roll."
    //
    // Esito DIVERSO dal BioWeapon: qui il Tiro Salvezza non si fa affatto.
    'Vs': {
        aliasTesto: ['vs vita', 'vs str'],
        condizione: { attributoBersaglio: 'DA_PARENTESI' },
        seVero: { nessunCambio: true },
        seFalso: { nessunEffetto: true },
        noteFalso: 'Il bersaglio non ha l\'Attributo indicato: nessun Tiro Salvezza, l\'arma non ha effetto su di lui.',
        fonte: 'wiki N5, pagina Traits'
    },

    // 🔴 ARM=0 NON sta qui: e` gia` un `salvAttr` nel database, e funziona.
    // Il regolamento lo elenca fra i Tratti, il Weapon Chart lo mette nella
    // colonna "Saving Roll Attribute": sono due letture della stessa riga.
    // Il dato vive in salvAttr, che ha gia` la precedenza sulla munizione —
    // lo stesso meccanismo delle Breaker su BTS/2.
    // Cinque armi: K1 Combi/Marksman/Sniper Rifle, Monofilament CC Weapon,
    // Monofilament Mine. Un K1 contro ARM 3 da` VS 7, non VS 10.
    // Duplicarlo qui avrebbe creato due fonti per lo stesso dato.
    'ARM=0': 'VEDI salvAttr NEL DATABASE ARMI — non duplicare qui',

    // Albedo: la stessa forma, ma la condizione guarda le SKILL del nemico.
    // DA VERIFICARE: la voce esatta non e` stata riletta dalla scheda.
    'Albedo': {
        condizione: { skillAttaccante: ['MULTISPECTRAL VISOR', 'MARKSMANSHIP'] },
        seVero: { modAttaccante: -6 },
        seFalso: { nessunCambio: true },
        note: 'Il MOD si applica solo contro nemici con Multispectral Visor o Marksmanship.',
        fonte: 'DA VERIFICARE'
    }
};

// ------------------------------------------------------------------
// TRINCERARSI (SAPPER) — LETTO dal regolamento, PARTE_1 righe 7415-7431
// ------------------------------------------------------------------
window.CATALOGO_N5.TRINCERARSI = {

    skillRichiesta: 'Sapper',
    tipo: 'LONG_SKILL',
    etichette: ['Deployment Skill', 'Long Skill'],
    opzionale: true,
    tiro: false,
    bersagli: 'nessuno',

    // 🔴 Il requisito che l'app NON puo` verificare: non ha la mappa.
    requisito: 'Lo spazio in cui si attiva lo Stato Foxhole deve avere altezza e larghezza uguali o maggiori della Silhouette dello Stato.',
    seRequisitoFallisce: 'La truppa NON entra in Stato Foxhole ed esegue invece un Idle.',
    domanda: 'Lo spazio ha altezza e larghezza sufficienti per la Silhouette dello Stato Foxhole?',

    effetti: {
        schieramento: 'Nella Fase di Schieramento si puo` schierare gia` in Stato Foxhole, piazzando il Token accanto alla truppa.',
        turnoAttivo: 'Nel Turno Attivo questa Long Skill fa entrare in Stato Foxhole e piazza il Token accanto alla truppa.'
    },

    fonte: 'regolamento', riga: 7415,

    // ⚠️ Gli effetti dello STATO Foxhole stanno a pagina 158, che e` nel
    // PARTE_2 — un archivio di immagini, non leggibile. Quello che segue
    // viene dal codice dell'app e dalla voce Sapper del catalogo, NON e`
    // stato riletto dalla scheda: va verificato.
    // Non piu` DA VERIFICARE: letto da p.158.
    statoFoxhole: {
        attivazione: 'Automatica in schieramento; in Turno Attivo ci si rientra solo con una Long Skill.',
        silhouette: 'Silhouette 3, o il proprio valore se piu` alto.',
        copertura: 'Copertura Parziale in arco 360 gradi.',
        concede: ['Mimetism (-3)', 'Courage'],
        // 🔴 Nessun movimento, NEMMENO quello di una Schivata riuscita.
        bloccaMovimento: 'Posizione fissa: non consente alcun movimento, compreso quello concesso da una Schivata riuscita.',
        cancellazione: 'Entrando in Prono, oppure in Turno Attivo dichiarando una Skill con Label Movimento e ANNUNCIANDO la cancellazione: a costo zero, recuperando MOV e Silhouette.',
        // Letto sulla fonte completa: vale anche all'inizio di un movimento
        // di Schivata, non solo su una Skill con Label Movimento.
        cancellazioneSuSchivata: 'Nel Turno Attivo la si puo` annullare anche all\'inizio di un movimento di Schivata.',
        perdeTutto: 'Annullandolo si perdono TUTTI i vantaggi, il Token si rimuove e si recuperano MOV e Silhouette.',
        // Lo stesso requisito della skill, ripetuto nel REMEMBER dello Stato.
        requisitoSpazio: 'Lo spazio deve avere altezza e larghezza pari o maggiori della Silhouette dello Stato.',
        fonte: 'regolamento, p.158 (fonte completa)'
    }
};

// ------------------------------------------------------------------
// OSSERVAZIONE — tre skill che si somigliano solo nel nome
// TUTTE E TRE LETTE dal regolamento, PARTE_1.
//
// 🔴 Non condividono quasi nulla: tipo di ordine, attributo, bersagli,
// MOD applicati e perfino la necessita` della LoF sono diversi in tutte
// e tre. Trattarle insieme avrebbe prodotto un modulo sbagliato per due.
// ------------------------------------------------------------------
window.CATALOGO_N5.OSSERVAZIONE = {

    'FORWARD OBSERVER': {
        tipo: 'SHORT_SKILL', ancheInARO: true,
        etichette: ['BS Attack', 'Optional'],
        attributo: 'WIP',                 // Tratto BS Weapon (WIP)
        richiedeLoF: true,
        bersagli: 'obbligatori',
        arma: 'Forward Observer',         // ha una riga propria nel Weapon Chart
        // 🔴 Invece del Tiro Salvezza impone lo Stato Bersagliato.
        invecheDelDanno: 'targeted',
        effetto: 'E` un Attacco con un\'arma BS col Tratto BS Weapon (WIP). Invece di costringere il bersaglio a un Tiro Salvezza, lo fa entrare in Stato Bersagliato.',
        token: 'Si piazza un Token TARGETED accanto al bersaglio colpito.',
        fonte: 'regolamento', riga: 6190
    },

    'SENSOR': {
        tipo: 'SHORT_SKILL',
        etichette: ['Attack', 'Optional', 'Zone of Control'],
        attributo: 'WIP',
        modFisso: +6,
        // 🔴 NIENTE MOD di gittata ne` di Mimetismo. E nessuna LoF.
        ignoraMod: ['GITTATA', 'MIMETISMO'],
        richiedeLoF: false,
        bersagli: 'nessuno',              // non si designa un bersaglio
        effetto: 'Tiro Normale WIP+6, senza applicare MOD di gittata o Mimetismo, per Scoprire SIMULTANEAMENTE tutti i nemici in Schieramento Nascosto o in CAMO dentro la propria Zona di Controllo.',
        portata: 'Zona di Controllo dell\'utente. Non serve la LoF, e non si designa alcun bersaglio.',
        effettoContinuo: 'I nemici con Camouflage NON possono rientrare in Stato CAMO dentro la ZdC dell\'utente.',
        bonusPassivo: 'Concede inoltre, in automatico e senza tiri ne` Ordini, +6 WIP quando si dichiara Scoprire contro Marker Mimetici.',
        fonte: 'regolamento', riga: 7432
    },

    'TRIANGULATED FIRE': {
        tipo: 'LONG_SKILL',
        etichette: ['Attack', 'Optional'],
        attributo: 'BS',
        richiedeLoF: true,
        bersagli: 'obbligatori',
        // 🔴 NESSUN MOD al tiro. Ne` gittata, ne` Copertura, ne` Mimetismo.
        // Le uniche eccezioni sono i MOD al BURST, che si applicano normalmente.
        ignoraTuttiIMod: true,
        eccezione: 'BURST',
        effetto: 'Permette di dichiarare un BS Attack senza applicare ALCUN MOD al tiro: gittata, Copertura, Abilita` come il Mimetismo. Le uniche eccezioni sono i MOD che toccano il Burst, che si applicano normalmente.',
        // 🔴 Non permette di colpire oltre la gittata MASSIMA dell'arma.
        limiteGittata: 'NON permette di colpire un bersaglio piu` lontano della Gittata Massima dell\'arma. Un Combi Rifle non colpisce mai oltre 48".',
        fonte: 'regolamento', riga: 7854
    }
};

// ------------------------------------------------------------------
// INGRESSO IN CAMPO (COMBAT JUMP) — LETTO, PARTE_1 riga 5941
// ------------------------------------------------------------------
window.CATALOGO_N5.INGRESSO_IN_CAMPO = {

    skillRichieste: ['Combat Jump', 'Airborne Deployment', 'AD:', 'Parachutist'],
    tipo: 'LONG_SKILL',
    etichette: ['Airborne Deployment (AD)', 'Private Information', 'Optional'],
    attributo: 'PH',
    tiro: true,
    bersagli: 'nessuno',

    fuoriTavolo: 'La truppa non si schiera nella Fase di Schieramento e resta fuori tavolo. Mentre e` fuori NON aggiunge il proprio Ordine al Pool, ma puo` entrare usando il PROPRIO Ordine.',

    // Le cose che l'app non puo` verificare: non ha la mappa.
    divieti: [
        'Non si puo` entrare in Stato Prono.',
        'Non a contatto di Silhouette con Modelli, Marker o Token nemici e neutrali.',
        'Non a contatto con un obiettivo di scenario.',
        'Solo su una superficie orizzontale grande almeno quanto la base della truppa.',
        'Vietato dentro edifici o pezzi di scenografia chiusi, anche col tetto o le porte aperte.'
    ],
    domanda: 'Il punto di atterraggio rispetta tutti i divieti (niente contatto con nemici, obiettivi o interni di edifici)?',

    // 🔴 Fallire NON significa "non entra": entra lo stesso, ma nella
    // propria Zona di Schieramento, a contatto col bordo del tavolo.
    seFallisce: {
        entra: true,
        dove: 'Nella propria Zona di Schieramento, sempre a contatto col bordo del tavolo.',
        perdeMarker: 'Perde l\'opzione di entrare in Stato Marker o come Decoy: entra sempre come Modello.',
        deployableRimossi: 'Le Armi e gli Equipaggiamenti Deployable schierati con lui vengono rimossi dal tavolo.'
    },
    dopoIlTiro: 'In entrambi i casi il Giocatore Reattivo dichiara tutti i propri ARO.',

    // 🔴 Vale in ogni caso, riuscito o fallito.
    restrizione: 'Durante l\'Ordine in cui si usa questa Abilita`, la truppa NON puo` beneficiare della Copertura Parziale.',

    notazionePH: 'Il profilo puo` scrivere "Combat Jump (PH=10)": quel valore sostituisce il PH.',
    fonte: 'regolamento', riga: 5941
};

// ------------------------------------------------------------------
// REQUEST SPEEDBALL — LETTO, PARTE_1 riga 5610
// ------------------------------------------------------------------
window.CATALOGO_N5.SPEEDBALL = {

    // 🔴 NON e` un Ordine: e` un'Abilita` Automatica.
    tipo: 'AUTOMATIC_SKILL',
    etichette: ['Optional'],
    requisito: 'Servono DUE Speedball Token (uso strategico dei Command Token).',
    quando: 'Nel proprio Turno Attivo. NON si puo` fare a meta` della Sequenza di Spesa dell\'Ordine.',

    // Due token, e si tira per ciascuno.
    token: 2,
    dimensione: '55 mm',
    piazzamento: 'Si applicano le regole del Combat Jump.',
    attributo: 'PH',
    // 🔴 PH FISSO a 14, non quello della truppa.
    phFisso: 14,
    notePH: 'Il tiro e` un PH 14 fisso: non dipende dal PH di chi lo richiede.',

    // Il primo si sceglie, il secondo si tira.
    primoToken: 'Il giocatore SCEGLIE l\'oggetto dalla Speedball Chart.',
    secondoToken: 'Il giocatore TIRA sulla Chart.',

    divieti: ['I Token non si piazzano a contatto di Silhouette con Modelli, Marker, Token o obiettivi di scenario.'],

    raccolta: 'Qualunque truppa alleata in stato non Nullo che entra in contatto di Silhouette raccoglie automaticamente l\'oggetto. La raccolta ANNULLA qualunque Stato Marker della truppa.',
    unoAllaVolta: 'Una truppa non puo` avere piu` di un Speedball Item Token alla volta.',
    monouso: 'Gli oggetti sono monouso e non trasferibili; il Token si rimuove dopo l\'uso. Si usano in Turno Attivo e Reattivo a volonta`, salvo indicazione diversa.',
    noDeactivator: 'Gli Speedball Token sono State Token: non bloccano il movimento nemico e NON sono bersaglio dei Deactivator.',

    chart: [
        { da: 1,  a: 3,  oggetto: 'VITAPACK' },
        { da: 4,  a: 6,  oggetto: 'AUTOREPAIRS' },
        { da: 7,  a: 10, oggetto: 'SWITCH ON' },
        { da: 11, a: 13, oggetto: 'JETPACK (S:2)' },
        { da: 14, a: 16, oggetto: 'OVERKILL' },
        { da: 17, a: 20, oggetto: 'NANOSHIELD' }
    ],

    oggetti: {
        'VITAPACK':    'Annulla lo Stato Incosciente di un alleato con VITA, rimuovendo UNA Ferita. Si applica con un\'Abilita` Breve a contatto di Silhouette.',
        'AUTOREPAIRS': 'Annulla lo Stato Incosciente di un alleato con STR, rimuovendo una o due Ferite. Si applica con un\'Abilita` Breve a contatto di Silhouette.',
        'SWITCH ON':   'Annulla gli Stati Immobilizzato-A e -B, Isolato e Stordito di un alleato. Abilita` Breve a contatto di Silhouette.',
        'JETPACK (S:2)': 'Il portatore usa Super-Jump (Jet Propulsion) per UN solo Ordine. Riservato alle truppe con Silhouette 2.',
        'OVERKILL':    'Due modi: annullare lo Stato Scarico e recuperare tutti gli usi dei Disposable alla Conclusione dell\'Ordine, OPPURE ottenere BS Attack (SR-1) per un solo Ordine.',
        'NANOSHIELD':  'Se la truppa deve fare Tiri Salvezza, applica in automatico +2 a TUTTI i propri Tiri Salvezza nella Fase di Risoluzione di quell\'Ordine.'
    },

    fonte: 'regolamento', riga: 5610
};

// ------------------------------------------------------------------
// COPERTURA — due skill che sembrano la stessa e non lo sono
// VERIFICATE alla lettera sul regolamento.
// ------------------------------------------------------------------
window.CATALOGO_N5.COPERTURA_SKILL = {

    // "Troopers with this Special Skill do not benefit from Partial Cover MODs."
    // 🔴 MODs al PLURALE: cadono ENTRAMBI, il -3 al tiro nemico E il +3 ARM.
    'No Cover': {
        cadeMODTiro: true,
        cadeMODSalvezza: true,
        nota: 'Non beneficia di ALCUN MOD di Copertura Parziale: né il -3 al tiro nemico, né il +3 ARM al Tiro Salvezza.',
        fonte: 'regolamento, p.102 (verificato sulla fonte completa)'
    },

    // "Attacks against this Trooper do not apply the -3 BS MOD for Partial Cover."
    // 🔴 Solo il -3. Il +3 ARM RESTA: e` esattamente la differenza con No Cover.
    'Limited Cover': {
        cadeMODTiro: true,
        cadeMODSalvezza: false,
        nota: 'Gli attacchi contro di lui non applicano il -3 BS di Copertura Parziale. Il +3 ARM al Tiro Salvezza RESTA.',
        fonte: 'regolamento, p.98 (verificato sulla fonte completa)'
    },

    piuSevera: 'Con entrambe vince No Cover.'
};

// ------------------------------------------------------------------
// STEALTH — contro chi NON funziona
// "Stealth is not effective against Troopers with the Combat Instinct or
//  Sixth Sense Special Skills, or against Deployable Weapons or pieces
//  of Equipment."
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// MINELAYER — Deployment Skill, DUE requisiti che l'app non puo` sapere
// LETTO sulla fonte completa.
// ------------------------------------------------------------------
window.CATALOGO_N5.MINELAYER = {
    tipo: 'DEPLOYMENT_SKILL',
    requisiti: [
        'Nessuna truppa nemica ne` Marker Mimetico dentro l\'Area d\'Innesco del Deployable al momento del piazzamento — o dentro la ZdC per le armi Perimeter.',
        'Il piazzamento deve seguire le condizioni generali di Schieramento e stare sempre dentro l\'area in cui il Minelayer puo` schierarsi.'
    ],
    domande: [
        'Ci sono truppe nemiche o Marker Mimetici nell\'Area d\'Innesco (o nella ZdC per le Perimeter)?',
        'Il punto scelto è dentro la tua Zona di Schieramento?'
    ],
    effetto: 'Piazza il Deployable al momento dello Schieramento, dentro la propria ZdC.',
    // creaDeployable c'e` gia`: serve il richiamo da fase_schieramento.js.
    // FATTO (22 settembre): M.opzioniMinelayer / piazzaConMinelayer /
    // minelayerTiroFallito, e window.faseSchieramento.minelayer. Il token
    // entra nel roster prima della conferma e viaggia con lo schieramento.
    collegato: true,
    fonte: 'regolamento, p.100 (fonte completa)'
};

window.CATALOGO_N5.STEALTH_INEFFICACE = {
    skill: ['Combat Instinct', 'Sixth Sense'],
    controDeployable: true,
    nota: 'Lo Stealth non impedisce a un Deployable di scattare.',
    fonte: 'regolamento, p.109 e p.88'
};

// ------------------------------------------------------------------
// SKILL — catalogo normalizzato
// Campi comuni:
//   nomeCanonico:   chiave usata dal motore e dai database unita`
//   aliasTesto:     varianti di scrittura che i database potrebbero usare (per il parsing)
//   haValore:       true se legge un numero tra parentesi nel profilo (es. Mimetism (-6))
//   applica:        contesto in cui il MOD/effetto si applica: 'BS' | 'CC' | 'HACKING' | 'DODGE' | 'DISCOVER' | 'SALVEZZA' | 'GATING' | 'INFO'
//   suChi:          'attaccanteNemico' (MOD al nemico che attacca l'utente) | 'utente' (bonus a se`) | 'bersaglio'
//   effetto:        descrizione strutturata di cosa fa (letta dal motore)
// ------------------------------------------------------------------
window.CATALOGO_N5.SKILL = {

    // --- SKILL CON MOD DIRETTO SUL CALCOLO DEI TIRI ---
    'Mimetism': {
        aliasTesto: ['mimetism', 'mimetismo'],
        haValore: true, valoreDefault: -3,           // -3 o -6 dal profilo
        applica: ['BS', 'DISCOVER'], suChi: 'attaccanteNemico',
        note: 'MOD negativo a chi dichiara BS Attack (che richiede LoF) o Discover contro l\'utente. NON su CC. Ridotto da MSV.'
    },
    'Surprise Attack': {
        aliasTesto: ['surprise attack', 'attacco a sorpresa'],
        haValore: true, valoreDefault: -3,           // -3 o -6; puo` specificare attributo (CC-6)
        applica: ['BS', 'CC', 'ARO'], suChi: 'bersaglio',
        note: 'Utente in forma Marker/Hidden a inizio ordine. MOD negativo a TUTTI i tiri che i bersagli fanno in ARO. Non cumulabile con altro Surprise Attack.'
    },
    'Marksmanship': {
        aliasTesto: ['marksmanship'],
        haValore: false, applica: ['BS'], suChi: 'utente',
        effetto: { ignora: ['COPERTURA_PARZIALE', 'NANOSCREEN'] },
        note: 'Ignora i MOD negativi da Copertura Parziale e Nanoscreen. NON ignora Mimetism. Affetto da White Noise/Reflective/Albedo.'
    },
    'Martial Arts': {
        aliasTesto: ['martial arts', 'arti marziali'],
        haValore: false,                             // il livello NON è tra parentesi: è nel nome, es. "Martial Arts L3"
        livelloNelNome: true,                        // il motore estrae il livello dal suffisso L1..L5
        applica: ['CC'], suChi: 'utenteEBersaglio',
        // I valori dei cinque livelli stanno in CATALOGO_N5.MARTIAL_ARTS.livelli,
        // unica fonte. Qui c'era una seconda tabella con le stesse cifre e nomi
        // di chiave diversi: due copie che alla prima modifica divergono.
        tabellaIn: 'MARTIAL_ARTS.livelli',
        note: 'Solo CC. Livello scritto nel nome (Martial Arts L1..L5), NON tra parentesi. I MOD dei due combattenti si combinano nel Faccia a Faccia. Valori: vedi MARTIAL_ARTS.livelli.'
    },
    'Sixth Sense': {
        aliasTesto: ['sixth sense', 'sesto senso'],
        haValore: false, applica: ['DODGE', 'RESET', 'BS'], suChi: 'utente',
        effetto: { ignoraMalusDodgeReset: true, ignoraVisZeroPoor: true, arco360: true,
                   // Riga 9941: -6 PH IMM-A, -3 WIP IMM-B, -9 WIP Isolato. Nessun'altra
                   // eccezione esiste (confermato dalla chat REGOLE, 23 settembre).
                   eccezioni: ['immA', 'immB', 'isolato'] },
        note: 'Reagisce fuori LoF (360°). Ignora -6 da Zona Vis. Zero. Su Dodge/Reset non applica MOD negativi TRANNE IMM-A(-6)/IMM-B(-3)/Isolato(-9).'
    },
    'Combat Instinct': {
        aliasTesto: ['combat instinct', 'istinto di combattimento'],
        haValore: false, applica: ['BS', 'CC', 'ARO', 'GATING'], suChi: 'utente',
        effetto: { ignoraSurpriseAttack: true, stealthNonEfficace: true },
        note: 'Automatica/Opzionale. Chi la possiede IGNORA i MOD di Surprise Attack degli attaccanti (il -3/-6 non si applica ai suoi tiri). Inoltre lo Stealth nemico NON e` efficace: chi si muove in Stealth nella sua ZoC gli genera comunque ARO. In N4 faceva parte di Sixth Sense, in N5 e` skill separata. (CONFERMATO wiki)'
    },
    'No Cover': {
        aliasTesto: ['no cover'],
        haValore: false, applica: ['BS'], suChi: 'utente',
        effetto: { mai: 'COPERTURA_PARZIALE' },
        note: 'L\'utente non beneficia MAI della Copertura Parziale (malus per se`).'
    },
    'Total Reaction': {
        aliasTesto: ['total reaction'],
        haValore: false, applica: ['BS', 'ARO'], suChi: 'utente',
        effetto: { burstPienoInARO: true },
        note: 'In ARO su BS Attack usa il Burst PIENO dell\'arma. Deve bersagliare un\'unita` attivata dall\'ordine.'
    },
    'Neurocinetics': {
        aliasTesto: ['neurocinetics'],
        haValore: false, applica: ['BS', 'ARO'], suChi: 'utente',
        effetto: { burstPienoInARO: true, burstUnoInAttivo: true },
        note: 'Attivo: Burst BS ridotto a 1. Reattivo (ARO): Burst pieno contro un singolo bersaglio.'
    },

    // --- SKILL DIFENSIVE / FERITE-STATI (SALVEZZA) ---
    'Dogged': {
        aliasTesto: ['dogged'],
        haValore: false, applica: ['SALVEZZA'], suChi: 'utente',
        effetto: { ignoraIncosciente: true, curabile: false, mortePerShock: true },
        note: 'Ignora Incosciente fino a fine turno, poi Morto. Non curabile. Shock -> Morto diretto.'
    },
    'No Wound Incapacitation': {
        aliasTesto: ['no wound incapacitation', 'nwi'],
        haValore: false, applica: ['SALVEZZA'], suChi: 'utente',
        effetto: { ignoraIncosciente: true, curabile: true, mortePerShock: true },
        note: 'Come Dogged ma curabile. Shock -> Morto diretto.'
    },
    'Exrah': {
        aliasTesto: ['exrah'],
        haValore: false, applica: ['SALVEZZA'], suChi: 'utente',
        effetto: { incoscienteDiventaMorto: true, feritaExtra: false, curabile: false, attivoInStatoNull: true },
        note: 'Automatica/Obbligatoria (tratto razziale). Entrando in Incosciente passa AUTOMATICAMENTE a Morto, SENZA subire una Ferita extra, e va rimosso dal tavolo. Non curabile in alcun modo (Doctor, MediKit, Regeneration...). Resta attiva anche in stato Null. NOTA MOTORE: escludere queste unita` dai bersagli validi di Doctor/Paramedic/Engineer. (CONFERMATO wiki)'
    },
    'Shasvastii': {
        aliasTesto: ['shasvastii'],
        haValore: false, applica: ['SALVEZZA'], suChi: 'utente',
        effetto: { incoscienteSpeciale: 'SHASVASTII_EMBRYO', mortePerShock: true, dichiarazioneRichiesta: true },
        note: 'Automatica/Obbligatoria (tratto razziale). Entrando in Incosciente il giocatore puo` dichiarare Shasvastii: si piazza un segnalino Shasvastii-Embryo invece di Incosciente. Durante la partita la truppa conta comunque per i Punti Vittoria, Retreat! e le condizioni di scenario; a fine partita non conta piu`. Le munizioni Shock annullano questo Incosciente -> Morto diretto. (CONFERMATO wiki)'
    },
    'Regeneration': {
        aliasTesto: ['regeneration'],
        // I profili scrivono "Regeneration (PH=13)": senza haValore il numero
        // veniva scartato e si tirava sul PH di profilo.
        haValore: true, applica: ['INFO'], suChi: 'utente',
        interpretaParentesi: {
            'PH=N': { effetto: 'sostituisceAttributo', attributo: 'PH', suChi: 'utente' }
        },
        note: 'Fase Stati: Tiro Normale PH -> toglie 1 Ferita. FALLENDO il tiro la truppa riceve 1 Ferita IN PIU`. Con "Regeneration (PH=N)" si tira su quel valore, non sul PH di profilo.'
    },
    'Immunity': {
        aliasTesto: ['immunity', 'immunita'],
        haValore: true, valoreDefault: null,          // il tipo: ARM/BTS/Enhanced/Shock/State/POS/Critical...
        applica: ['SALVEZZA'], suChi: 'utente',
        varianti: {
            'ARM': 'munizioni con tiro su ARM trattate come Normali; immune a Tratti che causano Stati/Ferite/riduzione ARM',
            'BTS': 'idem per BTS',
            'Enhanced': 'sia ARM che BTS',
            'Ammunition': 'la munizione indicata trattata come N',
            'State': 'immune allo Stato indicato da Comms Attack/regole',
            'Critical': 'NON fa il tiro salvezza aggiuntivo da Critico',
            'POS': 'non entra in Posseduto'
        },
        note: 'NON contro Comms Attack (eccetto Immunity State), ne` contro Non-Lethal / State: Stunned.'
    },
    'Courage': {
        aliasTesto: ['courage'],
        haValore: false, applica: ['INFO'], suChi: 'utente',
        effetto: { passaGuts: true, noRetreat: true },
        note: 'Passa automaticamente i Guts Roll. Non entra in Retreat!.'
    },

    // --- SUPPORTO ---
    'Doctor': {
        aliasTesto: ['doctor', 'dottore'],
        haValore: true, applica: ['SUPPORTO'], suChi: 'utente',
        // 🔴 IL FALLIMENTO DEL DOTTORE E` LETALE, non e` una Ferita.
        // Qui c'era '1_FERITA', copiato dall'Engineer. La differenza e` fra
        // recuperare l'unita` e perderla: col Dottore che sbaglia il
        // bersaglio va rimosso dal tavolo.
        // La regola completa sta in CATALOGO_N5.SUPPORTO.DOTTORE.
        effetto: { chiTira: 'UTENTE', tiro: 'WIP', bonus: 0, bersaglio: 'INCOSCIENTE_VITA', fallimento: 'MORTO' },
        interpretaParentesi: {
            'ReRoll -N': { effetto: 'ritiroConMod', suChi: 'utente' },      // es. Doctor (ReRoll -3): ritira il tiro con -3 al WIP
            'ReRoll WIP=N': { effetto: 'ritiroConWipFisso', suChi: 'utente' },
            '2W': { effetto: 'ferriteRecuperate', valore: 2, suChi: 'bersaglio' }  // il bersaglio recupera 2 Ferite invece di 1
        },
        note: 'Tiro Normale WIP (nessun bonus). Bersaglio Incosciente con VITA. FALLIMENTO: il bersaglio entra automaticamente in Stato MORTO e viene rimosso dal tavolo — a differenza dell\'Engineer, che infligge 1 Ferita. Valori tra parentesi: (ReRoll -N) ritiro col MOD indicato, (ReRoll WIP=N) ritiro con WIP fisso, (2W) il bersaglio recupera 2 Ferite.'
    },
    'Engineer': {
        aliasTesto: ['engineer', 'ingegnere'],
        haValore: true, applica: ['SUPPORTO'], suChi: 'utente',
        effetto: { chiTira: 'UTENTE', tiro: 'WIP', bonus: 0, bersaglio: 'STR_o_STATI', fallimento: '1_FERITA_se_ripara',
                   rimuoveStati: ['IMM-A','IMM-B','ISOLATO','BERSAGLIATO'] },
        interpretaParentesi: {
            'ReRoll -N': { effetto: 'ritiroConMod', suChi: 'utente' }
        },
        note: 'Tiro Normale WIP (nessun bonus). Ripara 1 Ferita STR (Incosciente) o rimuove stati (non Incosciente). Rimuovere stati, se fallisce, non ha conseguenze negative. Engineer (ReRoll -N) = un ritiro col MOD indicato.'
    },
    'Paramedic': {
        aliasTesto: ['paramedic', 'paramedico'],
        haValore: false, applica: ['SUPPORTO'], suChi: 'utente',
        effetto: { tiro: 'WIP', bonus: 0, bersaglio: 'INCOSCIENTE_VITA', fallimento: '1_FERITA', usaMediKit: true },
        note: 'Come Doctor ma usa un MediKit.'
    },

    // --- MOVIMENTO / DEPLOYMENT / DICHIARABILITA` (GATING) ---
    'Camouflage':      { aliasTesto:['camouflage','camo'], applica:['GATING','INFO'], note:'Schieramento/stato CAMO -> forma Marker.' },
    // 'TO Camouflage' RITIRATA: non esiste in N5. Il Marker Mimetico e` UNO
    // solo e mostra il Mimetism (-N) del profilo, se la truppa ce l'ha (Stato
    // CAMO, riga 13607). Non esistono "livelli" di segnalino. Nessun
    // profilo del database la portava: era un dato morto di una skill N4.
    // (Chat REGOLE, 21 settembre.) NON reintrodurla.
    'Climbing Plus':   { aliasTesto:['climbing plus'], applica:['INFO'], note:'Scala facendo altre Short Skill; no Copertura su verticale.' },
    'Super-Jump':      { aliasTesto:['super-jump','super jump'], haValore:true, unitaValore:'pollici_o_testo', applica:['INFO'],
                         note:'Jump come Basic Short; no Copertura in traiettoria. Tra parentesi puo` esserci una DISTANZA in pollici (es. Super-Jump (3 pollici)) oppure un testo qualificatore (es. Super-Jump (Jet Propulsion)). In nessuno dei due casi e` un MOD al tiro. Un profilo puo` averne due, una per forma (vedi Redeye).' },
    'Terrain':         { aliasTesto:['terrain','terreno'], haValore:true, applica:['MOVIMENTO'], note:'+1" MOV nel tipo di terreno indicato; Terrain (Total)=tutti.' },
    'Aerial':          { aliasTesto:['aerial'], applica:['GATING'], note:'Volo; no contatto Silhouette; no Cauto/Prono/Engaged.' },
    'Berserk':         { aliasTesto:['berserk'], haValore:true, applica:['CC'], suChi:'utente', note:'Long Skill: Move+CC. Il MOD tra parentesi va al CC Attack.' },
    'Infiltration':    { aliasTesto:['infiltration'], applica:['GATING'], note:'Schieramento avanzato; non entra in Fireteam.' },
    'Hidden Deployment':{ aliasTesto:['hidden deployment'], applica:['GATING'], note:'Schierato senza segnalino; annullato da Sensor/ordine/ARO.' },

    // --- INFO / SCENARIO / COMANDO (fuori dal calcolo tiri diretto) ---
    'Hacker':          { aliasTesto:['hacker'], applica:['INFO'], note:'Puo` dichiarare programmi Hacking (dipende dal device).' },
    'Sensor':          { aliasTesto:['sensor','sensore'], applica:['DISCOVER'], suChi:'utente',
                         effetto:{ discoverBonus:6, ignoraMimetismo:true },
                         note:'Discover WIP+6 (senza MOD Gittata/Mimetismo) su tutta la ZoC; +6 WIP su Discover vs Marker Camo. (CONFERMATO wiki N5.2)' },
    'Forward Observer':{ aliasTesto:['forward observer','fo'], applica:['INFO'], note:'Applica stato Bersagliato (Spotlight-like) con un WIP Roll (usa le gittate del Discover).' },

    // --- COMANDO / ORDINI (fuori scope calcolo tiri, ma servono per gating/riconoscimento) ---
    'Lieutenant':       { aliasTesto:['lieutenant','tenente'], applica:['INFO'], note:'Genera un Ordine speciale del Tenente. Fuori scope calcolo tiri.' },
    'NCO':              { aliasTesto:['nco'], applica:['INFO'], note:'Puo` usare l\'Ordine speciale del Tenente. Fuori scope.' },
    'Chain of Command': { aliasTesto:['chain of command'], applica:['INFO'], note:'Diventa Tenente in caso di Loss of Lieutenant. Fuori scope.' },
    'Strategos': {
        aliasTesto: ['strategos'],
        haValore: false,                             // il livello NON e` tra parentesi: e` nel nome, es. "Strategos L1"
        livelloNelNome: true,                        // il motore estrae il livello dal suffisso L1..L2 (stesso pattern di Martial Arts)
        applica: ['INFO'],
        richiedeTenente: true,                       // i benefici valgono SOLO se chi la possiede e` il Tenente dell armata
        // NB: una struttura SOLA. Il vecchio blocco `tabella` e` stato rimosso perche`
        // duplicava questi dati con altri nomi di chiave e senza `includePeripheral`:
        // due copie della stessa cosa divergono alla prima modifica.
        // La forma `livelli` e` la stessa di CATALOGO_N5.MARTIAL_ARTS.livelli,
        // che il motore sa gia` leggere (schedaMA).
        // AGGIORNATO N5.3: la novita` sono i PERIPHERAL, aggiunti sia alla
        // riserva sia allo spostamento. La differenza fra L1 e L2 RESTA:
        // "allineare L2 a L1" significa solo che L2 ora elenca esplicitamente
        // anche i due effetti di L1, che prima erano impliciti.
        livelli: {
            1: {
                riservaDueTruppe: true,
                includePeripheral: true,
                ordiniTenenteDiventanoRegolari: true,
                spostaTruppaSenzaToken: false
            },
            2: {
                riservaDueTruppe: true,
                includePeripheral: true,
                ordiniTenenteDiventanoRegolari: true,
                spostaTruppaSenzaToken: true   // esclusivo di L2
            }
        },
        note: 'Automatica/Opzionale, livello scritto nel NOME (Strategos L1/L2), non fra parentesi. Vale solo se la truppa e` il Tenente.\n' +
              'L1: schiera DUE truppe in riserva invece di una, PIU` i loro Peripheral; a inizio Turno Attivo gli Ordini speciali del Tenente diventano Ordini Regolari nel pool del suo Combat Group.\n' +
              'L2: tutto quanto sopra, PIU` sposta una truppa E I SUOI PERIPHERAL su un altro Combat Group senza spendere un Command Token.\n' +
              'Fuori dallo scope del calcolo dei tiri: nessun effetto sui MOD. (CONFERMATO wiki N5.3)'
    },
    'Tactical Awareness':{ aliasTesto:['tactical awareness'], applica:['INFO'], note:'Fornisce un Ordine extra usabile solo dall\'unita`. Fuori scope.' },
    'Inspiring Leadership':{ aliasTesto:['inspiring leadership'], applica:['INFO'], note:'Il gruppo ignora Retreat!. Fuori scope.' },
    'FT Master':        { aliasTesto:['ft master'], applica:['INFO'], note:'Puo` essere Fireteam Leader di piu` tipi di Fireteam. Fuori scope.' },
    'Number 2':         { aliasTesto:['number 2'], applica:['INFO'], note:'Puo` essere Tenente/NCO nascosto. Fuori scope.' },
    'Executive Order':  { aliasTesto:['executive order'], applica:['INFO'], note:'Diventa automaticamente Tenente allo schieramento. Fuori scope.' },
    'Advanced Command': { aliasTesto:['advanced command'], applica:['INFO'], note:'+1 Command Token. Fuori scope.' },

    // --- MOVIMENTO / DEPLOYMENT (gating: dichiarabilita` e stato iniziale) ---
    'Combat Jump':      { aliasTesto:['combat jump'], haValore:true, applica:['GATING'], note:'Entra in gioco via Aviolancio (PH Roll col valore tra parentesi, es. Combat Jump (+3)).' },
    'Parachutist':      { aliasTesto:['parachutist'], applica:['GATING'], note:'Schieramento avanzato / rientro dal bordo tavolo. Fuori scope tiri.' },
    'Airborne Deployment':{ aliasTesto:['airborne deployment','ad'], haValore:true, applica:['GATING'], note:'Schieramento aviotrasportato (livelli). Non entra in Fireteam.' },
    'Forward Deployment':{ aliasTesto:['forward deployment'], haValore:true, applica:['GATING'],
                         unitaValore:'pollici',   // il numero tra parentesi e` una DISTANZA, non un MOD al tiro
                         note:'Schieramento piu` avanzato di +X pollici (es. Forward Deployment (+8 pollici)). Il valore e` una distanza di schieramento: NON entra mai nel calcolo dei tiri. Fuori scope calcolo MOD.' },
    'Mechanized Deployment':{ aliasTesto:['mechanized deployment'], applica:['GATING'], note:'Schieramento avanzato per truppe meccanizzate.' },
    'Impetuous':        { aliasTesto:['impetuous','impetuoso'], applica:['GATING'], note:'Ordine Impetuoso obbligatorio in Fase Impetuosa. Esce dal Fireteam se attivato in quella fase.' },
    'Frenzy':           { aliasTesto:['frenzy','frenesia'], applica:['GATING'], note:'Diventa Impetuoso dopo aver causato la prima Ferita/Incosciente.' },
    // 'Limited Camouflage' era il nome N4. In N5 e` "Camouflage (1 Use)" (FAQ
    // F07): lo stato CAMO si usa UNA volta per partita. Contatore:
    // M.consumaCamo / campo camoUsato. (Chat REGOLE, 21 settembre.)
    'Camouflage (1 Use)':{ aliasTesto:['camouflage (1 use)','limited camouflage'], applica:['GATING'], note:'Stato CAMO una sola volta per partita (F07).' },
    'Minelayer':        { aliasTesto:['minelayer'], applica:['GATING'], note:'Piazza mine/deployable in schieramento entro la ZoC.' },
    'Sapper':           { aliasTesto:['sapper'], applica:['GATING','SALVEZZA'], note:'In Foxhole: +3 Copertura e altri bonus difensivi in trincea.' },
    'Kinematika':       { aliasTesto:['kinematika'], haValore:true, applica:['DODGE'], suChi:'utente', note:'+X" al movimento di Dodge/Engage in ARO per livello.' },
    'Limited Cover':    { aliasTesto:['limited cover'], applica:['INFO'], note:'Beneficia della Copertura solo in circostanze limitate. Fuori scope base.' },

    // --- MOVIMENTO SPECIALE / TERRENO ---
    'Climb':            { aliasTesto:['climb'], haValore:true, unitaValore:'pollici', applica:['MOVIMENTO'],
                         note:'Scala superfici verticali (Common Skill). Il valore tra parentesi e` una DISTANZA in pollici (es. Climb (3 pollici)), non un MOD al tiro.' },
    'Jump':             { aliasTesto:['jump'], haValore:true, unitaValore:'pollici', applica:['MOVIMENTO'],
                         note:'Salto. Con Super-Jump diventa Basic Short Skill. Il valore tra parentesi e` una DISTANZA in pollici (es. Jump (3 pollici)), non un MOD al tiro.' },
    'Multiterrain':     { aliasTesto:['multiterrain'], applica:['MOVIMENTO'], note:'Muove senza restrizioni in piu` tipi di terreno.' },

    // --- INFO / SCENARIO / VARIE ---
    'Counterintelligence':{ aliasTesto:['counterintelligence'], applica:['INFO'], note:'Contrasta info-guerra nemica / scenario. Fuori scope tiri.' },
    'Triangulated Fire':{ aliasTesto:['triangulated fire'], applica:['BS'], suChi:'utente', note:'Bonus BS contro bersagli Bersagliati/segnalati. Da verificare valore se serve al calcolo.' },
    'Remote Presence':  { aliasTesto:['remote presence'], applica:['INFO'], note:'REM: se va Incosciente, resta recuperabile; non Morto diretto.' },
    'Peripheral':       { aliasTesto:['peripheral','peripheral (control)','peripheral (servant)','peripheral (synchronized)','peripheral (ancillary)'], applica:['INFO'], note:'Periferica: legata a un Controller. Non entra in Fireteam/Coordinato.' },
    'Transmutation':    { aliasTesto:['transmutation'], applica:['INFO'], note:'Cambia profilo/forma in determinate condizioni (doppio profilo).' },
    'MetaChemistry':    { aliasTesto:['metachemistry'], applica:['INFO'], note:'Tira su tabella MetaChemistry a inizio partita (bonus casuale).' },
    'Booty':            { aliasTesto:['booty'], applica:['INFO'], note:'Tira su tabella Booty a inizio partita (equip casuale).' },
    'Natural Born Warrior':{ aliasTesto:['natural born warrior','nbw'], applica:['CC'], suChi:'utente', effetto:{ ignoraMartialArtsNemico:true }, note:'Il nemico non applica i MOD della propria Martial Arts/G:Movimento nel CC contro l\'utente.' },
    'Protheion':        { aliasTesto:['protheion'], haValore:true, applica:['CC'], suChi:'utente', note:'CC che assorbe VITA/STR dal bersaglio (Long Skill). Il MOD tra parentesi va al CC.' },
    'Fatality':         { aliasTesto:['fatality'], haValore:true, applica:['BS','CC'], suChi:'utente', note:'+1 Danno per livello su Critico (L1) o sempre (L2).' },
    'Guard':            { aliasTesto:['guard'], applica:['CC'], note:'Puo` dichiarare CC Attack come ARO contro chi entra in contatto.' },
    'Religious Troop':  { aliasTesto:['religious troop','religious'], applica:['INFO'], note:'Non entra in Retreat!. Passa i Guts Roll come Courage.' },
    'Warhorse':         { aliasTesto:['warhorse'], applica:['INFO'], note:'Regola di fazione (Nomad). Fuori scope calcolo tiri.' },
    'Journalist':       { aliasTesto:['journalist','journalist l1'], applica:['INFO'], note:'Warcor: abilita` di scenario/civili. Fuori scope.' },
    'Explode':          { aliasTesto:['explode'], applica:['INFO'], note:'Esplode quando distrutto (danno ad area). Fuori scope tiri attivi.' },
    'Specialist Operative':{ aliasTesto:['specialist operative'], applica:['INFO'], note:'Puo` completare obiettivi da Specialista. Fuori scope tiri.' },
    'Holoprojector':    { aliasTesto:['holoprojector'], haValore:true, applica:['GATING'], note:'Crea Holoecho (copie). Forma Marker.' },
    'Holomask':         { aliasTesto:['holomask'], applica:['GATING'], note:'Si maschera da un\'altra unita` allo schieramento.' },
    'Decoy':            { aliasTesto:['decoy'], haValore:true, applica:['GATING'], note:'Crea segnalini Decoy identici. Forma Marker.' },
    'Impersonation':    { aliasTesto:['impersonation'], haValore:true, applica:['GATING'], note:'Segnalino Impersonation (infiltrazione). Forma Marker; da` Surprise Attack.' },

    // --- COMMON SKILL nel profilo col valore tra parentesi ---
    // REGOLA UFFICIALE (verificata wiki): "Positive MODs only apply to the user. Negative MODs only apply to enemies."
    // Per BS/CC Attack e Dodge con MOD NON-automatico: i MOD NEGATIVI si applicano SOLO durante i Tiri Faccia a Faccia,
    // e li applica il NEMICO (non l'utente). I MOD POSITIVI si applicano all'utente quando usa quella skill.
    // Contenuti possibili tra parentesi e come il motore deve trattarli:
    //   (+N)  numero positivo  -> +N al tiro dell'UTENTE quando dichiara quella skill
    //   (-N)  numero negativo  -> -N al tiro del NEMICO nel Faccia a Faccia contro l'utente (NON all'utente!)
    //   (+NB) es. +1B          -> +1 al Burst dell'utente (solo Turno Attivo, non in ARO)
    //   (Shock)/(AP)/...       -> munizione aggiunta agli attacchi dell'utente
    //   (Continuous Damage)    -> tratto aggiunto agli attacchi dell'utente
    //   (SR-N)                 -> i BERSAGLI colpiti applicano -N al proprio TIRO SALVEZZA (Saving Roll)
    //   (PH=N)/(WIP=N)         -> fissa il valore dell'attributo usato per quel tiro (sovrascrive il profilo)
    //   (ARM+N)/(BTS+N)        -> es. Dodge (ARM+3): +N all'attributo se il tiro di Dodge fallisce
    'BS Attack': {
        aliasTesto: ['bs attack'],
        haValore: true, applica: ['BS'],
        interpretaParentesi: {
            numeroPositivo: { effetto: 'modTiro', suChi: 'utente' },
            numeroNegativo: { effetto: 'modTiroF2F', suChi: 'nemico' },     // -N al nemico, solo in F2F
            '+NB': { effetto: 'modBurst', suChi: 'utente', soloTurnoAttivo: true },
            'Shock': { effetto: 'munizioneAggiunta', suChi: 'utente' },
            'AP': { effetto: 'munizioneAggiunta', suChi: 'utente' },
            'Continuous Damage': { effetto: 'trattoAggiunto', suChi: 'utente' },
            'SR-N': { effetto: 'malusSalvezzaBersaglio', suChi: 'bersaglio' },  // -N al Tiro Salvezza del bersaglio
            'PH=N/WIP=N': { effetto: 'attributoFisso' }
        },
        note: 'SR-N = i bersagli subiscono -N al Tiro Salvezza. Numeri negativi = MOD al NEMICO in F2F, non all\'utente.'
    },
    'CC Attack': {
        aliasTesto: ['cc attack'],
        haValore: true, applica: ['CC'],
        interpretaParentesi: {
            numeroPositivo: { effetto: 'modTiro', suChi: 'utente' },
            numeroNegativo: { effetto: 'modTiroF2F', suChi: 'nemico' },     // es. CC Attack (-3): -3 al NEMICO nel F2F CC
            '+NB': { effetto: 'modBurst', suChi: 'utente' },
            'SR-N': { effetto: 'malusSalvezzaBersaglio', suChi: 'bersaglio' }
        },
        note: 'CC Attack (-3) = il NEMICO applica -3 al proprio CC nel Faccia a Faccia contro l\'utente (NON l\'utente a se stesso). Es. Chimera: tira sul suo CC pieno, e` chi la affronta a subire il -3.'
    },
    'Dodge': {
        aliasTesto: ['dodge'],
        haValore: true, applica: ['DODGE'], suChi: 'utente',
        interpretaParentesi: {
            numeroPositivo: { effetto: 'modTiro', suChi: 'utente' },        // es. (+3): +3 al Dodge dell'utente
            '+N pollici': { effetto: 'bonusMovimentoDodge', suChi: 'utente', unita: 'pollici' },  // es. Dodge (+1"): +1" di movimento dopo una Schivata riuscita. NON e` un MOD al tiro!
            numeroNegativo: { effetto: 'modTiroF2F', suChi: 'nemico' },
            'PH=N': { effetto: 'attributoFisso' },                          // es. (PH=11): usa PH 11 (tipico TAG)
            'ARM+N/BTS+N': { effetto: 'bonusAttributoSeFallisce', suChi: 'utente' }  // es. Dodge (ARM+3): l'utente somma +3 al PROPRIO valore ARM per il Tiro Salvezza, se fallisce il tiro di Dodge
        },
        note: 'ATTENZIONE ALL\'UNITA` DI MISURA: (+N) senza virgolette e` un MOD al tiro; (+N pollici, scritto col simbolo del pollice) sono POLLICI di movimento extra dopo una Schivata riuscita, e NON vanno sommati al tiro. Un profilo puo` avere entrambi (es. Teutonic Knight: Dodge (+3) e Dodge (+1 pollice)) e NON e` un doppione. (PH=N) fissa il PH. (ARM+3) = l\'utente usa il proprio ARM +3 per la salvezza se manca la schivata. (-N) va al nemico nel F2F.'
    },
    'Discover': {
        aliasTesto: ['discover', 'scoprire'],
        haValore: true, applica: ['DISCOVER'], suChi: 'utente',
        tiro: 'WIP', tipoTiro: 'NORMALE', durata: 'BASIC_SHORT_SKILL',
        richiedeLoF: true,
        usaModDiBSAttack: true,      // stessi MOD di un BS Attack: Copertura, Gittata, Mimetism...
        gittateProprie: true,        // il Discover ha gittate proprie, come se fosse un arma BS
        interpretaParentesi: {
            numeroPositivo: { effetto: 'modTiro', suChi: 'utente' },   // es. Discover (+3): +3 al WIP di chi lo dichiara
            numeroNegativo: { effetto: 'modTiroF2F', suChi: 'nemico' }
        },
        note: 'Common Skill (Basic Short Skill), distinta da Sensor: Tiro Normale su WIP con gli STESSI MOD di un BS Attack (Copertura, Gittata, Mimetism) e gittate proprie come se fosse un arma BS. Serve LoF al bersaglio. Non usabile due volte contro lo stesso bersaglio nello stesso Ordine; se fallisce non puo` ritentare su quel Marker fino al Turno di Giocatore successivo, ma puo` tentare su un Marker diverso. Discover (+3) = +3 al tiro di chi lo dichiara. Vedi anche Sensor, che ha regole proprie piu` favorevoli. (CONFERMATO wiki)'
    },
    'Gizmokit': {
        aliasTesto: ['gizmokit skill'],
        haValore: true, applica: ['SUPPORTO'], suChi: 'utente',
        interpretaParentesi: { 'PH=N': { effetto: 'attributoFisso' } },
        note: 'Skill Gizmokit sui TAG col PH fisso tra parentesi (es. (PH=11)). Vedi anche equip GizmoKit.'
    },
    'Commlink':         { aliasTesto:['commlink'], haValore:true, applica:['INFO'],
                         note:'Special Skill di Infinity Reinforcements: la Sezione Principale della lista deve includere una truppa con Commlink. Il valore tra parentesi (es. Commlink (+1)) e` un bonus di lista, non un MOD ai tiri. Fuori scope calcolo tiri. (CONFERMATO wiki)' },
    'TAGCom':           { aliasTesto:['tagcom'], haValore:true, applica:['INFO'],
                         note:'Skill dei piloti di TAG. Tra parentesi elenca i valori che il pilota usa per certe azioni, es. TAGCom (Dodge (PH+3), GizmoKit (PH+1)): sul Dodge somma +3 al PROPRIO PH, col GizmoKit +1. NOTA MOTORE: le parentesi contengono una LISTA di coppie skill/valore, non un singolo MOD — va scomposta prima di essere letta.' },
    'Stealth':          { aliasTesto:['stealth'], applica:['GATING'], suChi:'utente', note:'Muovendosi nella ZoC nemica fuori LoF non genera ARO. NON puo` essere dichiarato in stato Bersagliato.' },
    'Strategic Deployment':{ aliasTesto:['strategic deployment'], applica:['GATING'], note:'Schieramento vantaggioso (posizione/tempistica). Fuori scope calcolo tiri.' }
};

// ------------------------------------------------------------------
// EQUIPAGGIAMENTI — catalogo normalizzato
// ------------------------------------------------------------------
window.CATALOGO_N5.EQUIP = {
    'Baggage': {
        aliasTesto: ['baggage'],
        applica: ['INFO'], suChi: 'utente',
        effetto: { ricaricaAlleati: true, raggio: 'ZoC', recuperaDisposable: true, unoPerOrdine: true },
        note: 'Automatico/Obbligatorio, nessun tiro. Un alleato non-Null nella ZoC di chi lo porta puo` dichiarare Reload per cancellare lo stato Scarico o recuperare tutti gli usi delle armi/equip Disposable (uno solo per Ordine). Nella Fase Stati ogni alleato nella ZoC lo fa automaticamente. Non recupera cio` che e` gia` stato schierato sul tavolo, ne` gli oggetti Non-Reloadable. Fuori scope calcolo tiri. (CONFERMATO wiki)'
    },
    'AI Motorcycle': {
        aliasTesto: ['ai motorcycle', 'motocicletta ai', 'moto ai'],
        applica: ['GATING', 'MOVIMENTO'], suChi: 'utente',
        effetto: { comeMotorcycleDaMontato: true, dueProfili: true, transmutationAuto: true,
                   diventaPeripheralSincronizzato: true },
        note: 'Motocicletta che, quando il pilota scende, diventa un Remote Peripheral (Synchronized). Chi la porta ha DUE profili e passa dall uno all altro con le regole di Transmutation (Auto): col profilo Montato valgono tutte le restrizioni dell equip Motorcycle (niente Prono, Climb, scale, Cautious Movement, salto verso l alto). NOTA MOTORE: il database puo` contenere due voci per la stessa unita` (es. Zondnautica montata / Zondnaut appiedato) e non e` un duplicato. (CONFERMATO wiki)'
    },
    'Bangbomb': {
        aliasTesto: ['bangbomb', 'bang bomb'],
        haValore: true, valoreDefault: 4,            // unico caso nel gioco con +4
        applica: ['DODGE'], suChi: 'utente',
        interpretaParentesi: { numeroPositivo: { effetto: 'modTiro', suChi: 'utente' } },
        effetto: { soloVsAttaccantiInLoFoZoC: true, nonVsSagome: true },
        note: 'MOD ai tiri di Schivata di chi lo porta, indicato tra parentesi nel profilo (es. Bangbomb (+4)). RESTRIZIONI: vale solo contro Attacchi dichiarati da nemici dentro la LoF o la ZoC di chi schiva, e NON vale contro le armi Sagoma. Diverso da Dodge (+N), che non ha queste restrizioni: il motore deve tenerli separati. (CONFERMATO wiki)'
    },
    'Biometric Visor': {
        aliasTesto: ['biometric visor', 'visore biometrico'],
        applica: ['BS', 'CC', 'DISCOVER'], suChi: 'utente',
        effetto: { ignoraMalusImpersonation1: true, ignoraSurpriseAttackDaImpersonationEHoloecho: true,
                   discoverCancellaImpersonation: true },
        note: 'Automatico/Obbligatorio. Ignora il MOD WIP-3 imposto dallo stato Impersonation-1. Se supera un Discover contro una truppa in Impersonation-1, ne annulla lo stato e il Marker IMP-1 e` sostituito dalla miniatura. Ignora i MOD di Surprise Attack di attaccanti in stato Impersonation o Holoecho se ha LoF; nel CC li ignora anche SENZA LoF. Nel database e` scritto senza livello. (CONFERMATO wiki)'
    },
    'Motorcycle': {
        aliasTesto: ['motorcycle', 'motocicletta', 'moto'],
        applica: ['GATING', 'MOVIMENTO'], suChi: 'utente',
        effetto: { vietaProne: true, vietaClimb: true, vietaScale: true, vietaCautiousMovement: true,
                   jumpSoloOrizzontaleOInGiu: true, nonEUnVeicolo: true },
        note: 'Automatico. NON rende la truppa un Veicolo (VH). Restrizioni: non puo` entrare in stato Prono, non puo` dichiarare Climb ne` usare scale a pioli, non puo` dichiarare Cautious Movement, e puo` saltare solo in orizzontale o verso il basso (mai verso l alto). Puo` percorrere rampe e gradinate. NOTA MOTORE: sono tutti divieti di dichiarabilita`, vanno in puoFareAzione. (CONFERMATO wiki)'
    },
    'Multispectral Visor L1': {
        aliasTesto: ['multispectral visor l1','multispectral visor level 1','msv1','msv l1'],
        applica: ['BS','DISCOVER'], suChi: 'utente',
        effetto: { mimetism3: 0, mimetism6: -3, bassaVis: 0, pessimaVis: -3, lofInVisZero: -6 },
        note: 'Riduce Mimetism(-3)->0 e Bassa Vis->0; Mimetism(-6)->-3 e Pessima Vis->-3; LoF in Vis Zero con -6.'
    },
    'Multispectral Visor L2': {
        aliasTesto: ['multispectral visor l2','multispectral visor level 2','msv2','msv l2'],
        applica: ['BS','DISCOVER'], suChi: 'utente',
        effetto: { mimetismAll: 0, visibilitaAll: 0 },
        note: 'Azzera TUTTI i Mimetism e TUTTE le Zone di Visibilita`.'
    },
    'Multispectral Visor L3': {
        aliasTesto: ['multispectral visor l3','msv3','msv l3'],
        applica: ['BS','DISCOVER'], suChi: 'utente',
        effetto: { mimetismAll: 0, visibilitaAll: 0 },
        note: 'Come L2 (dettagli aggiuntivi non critici per il calcolo MOD base).'
    },
    'X-Visor': {
        aliasTesto: ['x-visor','x visor'],
        applica: ['BS','DISCOVER'], suChi: 'utente',
        effetto: { gittata_meno3_a_0: true, gittata_meno6_a_meno3: true },
        note: 'Migliora i Range MOD: -3 diventa 0, -6 diventa -3. Vale anche per Discover e Suppressive Fire. SOSPETTO per il bug "range Alguacil sempre zero".'
    },
    '360 Visor': {
        aliasTesto: ['360 visor','360° visor','360º visor'],
        applica: ['ARO'], suChi: 'utente',
        effetto: { arco360: true },
        note: 'Arco LoF 360° (nessun MOD ai tiri).'
    },
    'Firewall': {
        aliasTesto: ['firewall','tinbot: firewall','tinbot firewall'],
        haValore: true, valoreDefault: -3,           // -3 o -6
        applica: ['HACKING'], suChi: 'attaccanteNemico',
        effetto: { modAttaccante: true, bonusSalvezza: 3 },
        note: 'Equivalente Copertura per Hacking: -3/-6 WIP a chi attacca via Comms + 3 alla salvezza BTS del bersaglio. Uno solo alla volta.'
    },
    'Nanoscreen': {
        aliasTesto: ['nanoscreen'],
        applica: ['BS'], suChi: 'attaccanteNemico',
        effetto: { modAttaccante: -3, bonusSalvezza: 3, soloContro: 'BS' },
        note: 'Come Copertura ma cumulabile: -3 BS all\'attaccante + 3 alla salvezza. Non su Comms/CC. Marksmanship lo ignora.'
    },
    'Albedo': {
        aliasTesto: ['albedo'],
        haValore: true, valoreDefault: -6,           // il profilo scrive Albedo (-3) o Albedo (-6)
        applica: ['GATING', 'BS', 'DISCOVER'], suChi: 'attaccanteNemico',
        interpretaParentesi: {
            numeroNegativo: { effetto: 'modTiro', suChi: 'attaccanteNemico' }
        },
        soloControNemicoCon: ['Multispectral Visor', 'Marksmanship'],
        siApplicaA: ['BS_ATTACK_CON_LOF', 'DISCOVER'],
        note: 'Obbligatorio, NFB. Un nemico che abbia un Multispectral Visor (qualunque livello) o la skill Marksmanship, e che dichiari un BS Attack con LoF oppure un Discover contro chi porta l Albedo, applica al PROPRIO attributo il MOD scritto fra parentesi nel profilo: Albedo (-3) o Albedo (-6). NOTA MOTORE: il valore e` PER PROFILO, non fisso, e il MOD va all ATTACCANTE — non e` un MOD alla salvezza, al contrario di PARA CC Weapon (-N). Contro nemici SENZA visore o Marksmanship non si applica nulla. (CONFERMATO wiki)'
    },
    'SymbioMate': {
        aliasTesto: ['symbiomate'],
        applica: ['SALVEZZA'], suChi: 'utente',
        effetto: { armBts9: true, immunityEnhanced: true, usoSingolo: true },
        note: 'Uso singolo: ARM/BTS diventano 9 + Immunity Enhanced quando forzato a salvezza. (Comms: senza Immunity Enhanced.)'
    },
    'MediKit': {
        aliasTesto: ['medikit'],
        haValore: true, valoreDefault: null,          // PH tra parentesi se presente
        applica: ['SUPPORTO'], suChi: 'bersaglio',
        // Stessa forma di SUPPORTO.MEDIKIT: chi tira e su quale attributo.
        // C'era solo `tiroTarget`, mentre Doctor/Engineer usano `tiro`: chi
        // leggeva `effetto.tiro` sul MediKit trovava undefined e, ragionando
        // per analogia con le voci vicine, prendeva WIP. Il MediKit si lancia
        // su PH — su un profilo con PH 10 e WIP 13 sono tre punti a ogni cura.
        effetto: { tipo: 'BS_Non-Lethal', chiTira: 'BERSAGLIO', tiro: 'PH', tiroTarget: 'PH',
                   bersaglio: 'INCOSCIENTE_VITA',
                   fallimento: 'MORTO', gittate: {p3:8, z0:16, m6:24}, noSalvezza: true },
        note: 'N5.2: PH fallito = MORTO diretto (prima era +1 Ferita!). Il bersaglio fa un tiro PH, non una salvezza. Usabile su se`.'
    },
    'GizmoKit': {
        aliasTesto: ['gizmokit'],
        haValore: true, valoreDefault: null,          // PH tra parentesi (+1B ecc.)
        applica: ['SUPPORTO'], suChi: 'bersaglio',
        effetto: { tipo: 'BS_Non-Lethal', chiTira: 'BERSAGLIO', tiro: 'PH', tiroTarget: 'PH',
                   bersaglio: 'STR',
                   fallimento: '1_FERITA', gittate: {p3:8, z0:16, m6:24}, noSalvezza: true },
        note: 'PH fallito = +1 Ferita (DIVERSO dal MediKit N5.2 che fa Morto). Il bersaglio fa un tiro PH. Usabile su se`.'
    },
    'ECM': {
        aliasTesto: ['ecm'],
        haValore: true, valoreDefault: -3,            // es. ECM (Hacking -3) o (Guided -6)
        applica: ['HACKING'], suChi: 'attaccanteNemico',
        note: 'MOD negativo a chi dichiara Hacking/Guided contro l\'utente.'
    },
    // I programmi di ogni dispositivo stanno in CATALOGO_N5.DISPOSITIVI_HACKING,
    // unica fonte: qui erano duplicati identici, e il motore legge solo quella.
    'Hacking Device':      { aliasTesto:['hacking device'], applica:['INFO'], programmiIn:'DISPOSITIVI_HACKING' },
    'Hacking Device Plus': { aliasTesto:['hacking device plus'], applica:['INFO'], programmiIn:'DISPOSITIVI_HACKING' },
    'Killer Hacking Device':{ aliasTesto:['killer hacking device'], applica:['INFO'], programmiIn:'DISPOSITIVI_HACKING' },
    'EVO Hacking Device':  { aliasTesto:['evo hacking device'], applica:['INFO'], programmiIn:'DISPOSITIVI_HACKING' },
    'Deactivator':         { aliasTesto:['deactivator'], applica:['INFO'], note:'Rimuove deployable/mine/ripetitori nemici.' },
    'Repeater':            { aliasTesto:['repeater','deployable repeater'], applica:['INFO'], note:'Estende l\'area di Hacking.' },
    'FastPanda':           { aliasTesto:['fastpanda'], applica:['INFO'], note:'Repeater deployable -> doppio profilo (equip + marker sul tavolo).' }
};

// ------------------------------------------------------------------
// PROGRAMMI HACKING — valori per il calcolo (PS, munizione, bersaglio, effetto)
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// PROGRAMMI DI HACKING
//
// ATTENZIONE: quali programmi una truppa puo` usare NON dipende
// dall'essere Hacker, ma dal DISPOSITIVO che porta (vedi
// DISPOSITIVI_HACKING piu` sotto). Un Hacker con Hacking Device
// standard NON puo` usare Trinity.
//
// Caratteristiche comuni (wiki N5.2, pagina Hacking Device):
//  - agiscono nell'Area di Hacking dell'utente;
//  - NON richiedono LoF, salvo diversa indicazione del programma;
//  - solo truppe in forma di MODELLO sono bersagliabili (niente Marker);
//  - beneficiano dello Stato Bersagliato del bersaglio (+3).
// ------------------------------------------------------------------
window.CATALOGO_N5.HACKING = {
    // --- programmi d'attacco verificati sulla wiki N5.2 ---
    'SPOTLIGHT':      { fonte: 'wiki', tipo: 'ATTACCO', burst: 2, ammo: 'AP', ps: 5, dimezzaBTS: true,  salvezze: 1, bersaglio: 'chiunque',        effetto: 'BERSAGLIATO', salvezza: true,
                        note: 'Critico: il bersaglio fa un Tiro Salvezza aggiuntivo col BTS dimezzato.' },
    'CARBONITE':      { fonte: 'wiki', tipo: 'ATTACCO', burst: 2, ammo: 'DA', ps: 7, dimezzaBTS: false, salvezze: 2, bersaglio: 'hackable/hacker', effetto: 'IMM-B',       salvezza: true,
                        note: 'DA: DUE Tiri Salvezza contro BTS PIENO, non dimezzato.' },
    'OBLIVION':       { fonte: 'wiki', tipo: 'ATTACCO', burst: 2, ammo: 'AP', ps: 4, dimezzaBTS: true,  salvezze: 1, bersaglio: 'hackable/hacker', effetto: 'ISOLATO',     salvezza: true,
                        note: 'Critico: Tiro Salvezza aggiuntivo col BTS dimezzato.' },

    // --- dati NON riletti dalla scheda ufficiale: da verificare ---
    // Verificato campo per campo sulla Hacking Programs Chart, REGOLE_N5_v5_1_1.txt
    // riga 5030: 0 / 0 / PS 4 / B 1 / TAG / DA, Non-Lethal, State: POS.
    // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
    'TOTAL CONTROL':  { fonte: 'regolamento p.58', tipo: 'ATTACCO', burst: 1, ammo: 'DA', ps: 4, dimezzaBTS: false, salvezze: 2, bersaglio: 'soloTAG',          effetto: 'POSSEDUTO', salvezza: true,
                        note: 'B1 in Attivo E in Reattivo. DA: due Tiri Salvezza contro BTS PIENO.',
                        bersaglioAlleatoSePosseduto: true,
                        noteBersaglio: 'Il bersaglio dev\'essere un TAG nemico, OPPURE un TAG in Stato Posseduto — anche proprio: usarlo su un proprio TAG Posseduto annulla lo stato e lo riporta a Normale. Il motore oggi filtra solo i TAG nemici: il caso del recupero non e` gestito.' },
    // Verificato sulla stessa tabella, riga 5034: +3 / 0 / PS 6 / B 3 / HACKER.
    'TRINITY':        { fonte: 'regolamento p.58', tipo: 'ATTACCO', burst: 3, ammo: 'N',  ps: 6, dimezzaBTS: false, salvezze: 1, bersaglio: 'soloHackerNemico', effetto: '1_FERITA',  salvezza: true, modAttacco: 3,
                        note: 'B3, +3 WIP all\'attacco, Tiro Salvezza contro BTS PIENO con PS 6, 1 Ferita per salvezza fallita. Un Critico impone un Tiro Salvezza aggiuntivo. E` l\'unico programma letale.' },

    // --- esistono in N5 ma non sono attacchi: questo modulo non li gestisce ---
    'CYBERMASK':         { fonte: 'wiki', tipo: 'NON_ATTACCO',  note: 'Programma di occultamento.' },
    'WHITE NOISE':       { fonte: 'wiki', tipo: 'NON_ATTACCO',  note: 'Zona di rumore bianco.' },
    'ZERO PAIN':         { fonte: 'wiki', tipo: 'NON_ATTACCO',  note: 'Non gestito dal modulo attacco.' },
    'ASSISTED FIRE':     { fonte: 'wiki', tipo: 'SUPPORTWARE', bersaglioAlleato: true, note: 'Supportware su alleati (EVO).' },
    'ENHANCED REACTION': { fonte: 'wiki', tipo: 'SUPPORTWARE', bersaglioAlleato: true, note: 'Da` B2 in ARO a un REM alleato (EVO).' },
    'FAIRY DUST':        { fonte: 'wiki', tipo: 'SUPPORTWARE', bersaglioAlleato: true, note: 'Supportware su alleati (EVO).' },
    'CONTROLLED JUMP':   { fonte: 'wiki', tipo: 'SUPPORTWARE', bersaglioAlleato: true, note: 'Supportware su alleati (EVO).' }
};

// ------------------------------------------------------------------
// DISPOSITIVI DI HACKING — quale dispositivo abilita quali programmi.
// VERIFICATO sulla wiki N5.2 (tabella della pagina Hacking Device).
// ------------------------------------------------------------------
window.CATALOGO_N5.DISPOSITIVI_HACKING = {
    'Hacking Device':        { programmi: ['CARBONITE', 'OBLIVION', 'SPOTLIGHT', 'TOTAL CONTROL'] },
    'Hacking Device Plus':   { programmi: ['CARBONITE', 'CYBERMASK', 'OBLIVION', 'SPOTLIGHT', 'TOTAL CONTROL', 'WHITE NOISE'] },
    'Killer Hacking Device': { programmi: ['CYBERMASK', 'TRINITY'] },
    'EVO Hacking Device':    { programmi: ['ASSISTED FIRE', 'CONTROLLED JUMP', 'ENHANCED REACTION', 'FAIRY DUST'] }
};

// ------------------------------------------------------------------
// STATI — restrizioni e MOD (per gating e calcolo)
// ------------------------------------------------------------------
// 🔴 `nome` e `categoria` stanno QUI, accanto allo stato.
// Vivevano solo in M.NOMI_STATI dentro il motore: chi voleva raggruppare
// le etichette per categoria doveva dipendere da una struttura interna
// che non e` un contratto. Ora sono un dato del catalogo, come `fonte` e
// `riga` per le regole.
// Le categorie, nell'ordine in cui vanno mostrate:
//   NULLO · IMM · INFOGUERRA · ALTERAZIONE · POSTURA · MARKER
// 🔴 STATI CHE IL REGOLAMENTO HA E L'APP NON GESTISCE — dichiarati UNA volta.
// Il Prono resta citato nei testi del catalogo come regola di tavolo (il
// Tratto Aerial, la motocicletta, la cancellazione del CAMO, due
// restrizioni): sono regole vere, e cancellarle toglierebbe regolamento per
// una decisione che riguarda solo cosa l'app tiene in memoria. Qui si dice
// che l'app non lo traccia, invece di riscrivere sette prose.
// Per un controllo sul vocabolario della prosa: un nome di stato citato in
// un testo deve stare in STATI oppure QUI. (Proposta della chat INTERFACCIA.)
window.CATALOGO_N5.STATI_NON_GESTITI = {
    prono: {
        nome: 'Prono',
        regolamento: 'Prone State — REGOLE_N5_v5_1_1.txt righe 14456-14475: Silhouette pari alla base, movimento dimezzato; chi entra in Incosciente va Prono (salvo Motociclette, VH e TAG). Nessun MOD ai tiri.',
        perche: 'Decisione di Paolo (23 settembre): nessun MOD al calcolo; si gestisce al tavolo.',
        promemoria: 'Il Prono esiste al tavolo ma l\'app non lo traccia: segna tu il segnalino.'
    },
    scarico: {
        nome: 'Scarico',
        regolamento: 'Unloaded State — REGOLE_N5_v5_1_1.txt righe 14720-14740: arma inutilizzabile finche` non si fa Reload, senza tiro, nella ZdC di un alleato con Baggage in stato non Null. Nessun MOD ai tiri.',
        perche: 'Decisione di Paolo (23 settembre): non da` MOD, impedisce solo di usare l\'arma esaurita — e gli usi Disposable il motore li conta gia`.',
        promemoria: 'Lo Scarico esiste al tavolo: un\'arma Disposable esaurita non si usa finche` non si ricarica (Reload, Baggage).'
    }
};

window.CATALOGO_N5.CATEGORIE_STATI = ['NULLO', 'IMM', 'INFOGUERRA', 'ALTERAZIONE', 'POSTURA', 'MARKER'];

// 🔴 UN SOLO VOCABOLARIO DEGLI STATI (23 settembre, decisione di Paolo).
// La chiave di ogni voce e` l'ID CANONICO — lo stesso che M.statiAttivi
// restituisce e che il tabellone usa: immA, isolato, targeted, morto...
// Prima gli stati avevano DUE vocabolari: qui chiavi maiuscole (IMM-A,
// ISOLATO) per 13 stati, e M.NOMI_STATI nel motore con gli id per 20. Stessi
// stati, nomi diversi, sette da una parte sola. Ora c'e` questo, e
// M.NOMI_STATI ne e` una LETTURA. Tre campi, tre fatti diversi:
//   chiave         il flag in unit.states (immobilizedA, isolated...)
//   nome           cio` che legge il giocatore
//   vecchiaChiave  SOLO per leggere salvataggi vecchi (unit.state = 'IMM-A')
window.CATALOGO_N5.STATI = {
    immA:       { vecchiaChiave: 'IMM-A', chiave: 'immobilizedA', nome: 'Immobilizzato-A', categoria: 'IMM', azioniPermesse: ['SCHIVATA'], mod: { SCHIVATA: -6, attributo:'PH' }, cancella: ['SCHIVATA','ENGINEER'] },
    immB:       { vecchiaChiave: 'IMM-B', chiave: 'immobilizedB', nome: 'Immobilizzato-B', categoria: 'IMM', azioniPermesse: ['RESET'],    mod: { RESET: -3, attributo:'WIP' },   cancella: ['RESET','ENGINEER'] },
    isolato:     { vecchiaChiave: 'ISOLATO', chiave: 'isolated', nome: 'Isolato', categoria: 'INFOGUERRA', nonAttivabile: true, mod: { RESET: -9, attributo:'WIP' }, cancella: ['RESET','ENGINEER'], note:'Disabilita skill/equip Comms; no Fireteam/Coordinato.' },
    targeted: { vecchiaChiave: 'BERSAGLIATO', chiave: 'targeted', nome: 'Bersagliato', categoria: 'INFOGUERRA', vietaAzioni: ['CAUTO','STEALTH'], modAttaccante: 3, mod: { RESET: -3, attributo:'WIP' }, cancella: ['RESET','ENGINEER'], note:'+3 a chi attacca l\'utente (BS/Comms/Discover).' },
    stordito:    { vecchiaChiave: 'STORDITO', chiave: 'stunned', nome: 'Stordito', categoria: 'ALTERAZIONE', vietaAzioni: ['ATTACCO BS','ATTACCO CC','BERSERK','PROTHEION','HACKING'], note:'Fallisce automaticamente il Guts Roll successivo.' },
    suppressive:{ vecchiaChiave: 'SOPPRESSIONE', chiave: 'suppressive', nome: 'Fuoco di Soppressione', categoria: 'POSTURA', modNemiciEntro24: -3, aroSoloBS_SF: true, sfMode: { gittate:{z0:16, m3:24, x96:96}, burst:3 }, note:'Nemici entro 0-24" hanno -3 in tutti i F2F. In ARO usa SF Mode Weapon.' },
    engaged:     { vecchiaChiave: 'ENGAGED', chiave: 'engaged', nome: 'Ingaggiato', categoria: 'POSTURA', azioniPermesse: ['ATTACCO CC','BERSERK','SCHIVATA','RESET','IDLE'] },
    retreat:     { vecchiaChiave: 'RETREAT', chiave: 'retreat', nome: 'Ritirata!', categoria: 'NULLO', azioniPermesse: ['MOVIMENTO','CAUTO','SALTO','SCHIVATA','RESET','SCOPRIRE'] },
    disconnesso: { vecchiaChiave: 'DISCONNESSO', chiave: 'disconnected', statoNullo: true, nome: 'Disconnesso', categoria: 'INFOGUERRA', nonAttivabile: true, note:'Periferiche: no ordini/ARO.' },
    // 🔴 Posseduto e Sepsitorizzato NON erano voci del catalogo: vivevano solo
    // come flag dell'unita` (states.possessed / states.sepsitorized). Per
    // leggere la nullita` DAL FLAG servono qui. Sono stati Null (righe 14500,
    // 14580), ma "Null" (riga 14910) vuol dire solo: niente Ordini ne` Punti
    // Vittoria al proprio giocatore. NON "non agisce": entrambi agiscono per
    // l'avversario (righe 14504-14509, 14584-14589). Nessuna azioniPermesse:
    // non vanno bloccati. (Chat REGOLE, 21 settembre.)
    // ⚠️ categoria di visualizzazione scelta qui, non dal regolamento.
    posseduto:      { vecchiaChiave: 'POSSEDUTO', chiave: 'possessed',   nome: 'Posseduto',      categoria: 'INFOGUERRA', statoNullo: true },
    sepsitorizzato: { vecchiaChiave: 'SEPSITORIZZATO', chiave: 'sepsitorized', nome: 'Sepsitorizzato', categoria: 'INFOGUERRA', statoNullo: true },
    incosciente: { vecchiaChiave: 'INCOSCIENTE', chiave: 'unconscious', nome: 'Incosciente', categoria: 'NULLO', nonAttivabile: true, statoNullo: true },
    morto:       { vecchiaChiave: 'MORTO', chiave: 'dead', nome: 'Morto', categoria: 'NULLO', nonAttivabile: true, statoNullo: true },
    // Gli stati MARKER — erano solo in M.NOMI_STATI. Nessun effetto di regola
    // qui (niente azioniPermesse ne` statoNullo): servono al vocabolario.
    camo:     { chiave: 'camo',          nome: 'CAMO',                  categoria: 'MARKER' },
    imp:      { chiave: 'impersonation', nome: 'Impersonation',         categoria: 'MARKER' },
    holoecho: { chiave: 'holoecho',      nome: 'Holoecho',              categoria: 'MARKER' },
    holomask: { chiave: 'holomask',      nome: 'HoloMask',              categoria: 'MARKER' },
    decoy:    { chiave: 'decoy',         nome: 'Decoy',                 categoria: 'MARKER' },
    hidden:   { chiave: 'hidden',        nome: 'Schieramento Nascosto', categoria: 'MARKER' },
    foxhole:  { chiave: 'foxhole',       nome: 'Foxhole',               categoria: 'POSTURA' }
};

// ------------------------------------------------------------------
// TRATTI ARMA — quelli con effetto sul calcolo
// ------------------------------------------------------------------
window.CATALOGO_N5.TRATTI = {
    'Continuous Damage': { effetto: 'salvezzeRipetuteFinoASuccesso', note:'Critico dà 1 salvezza extra che NON applica Continuous Damage.' },
    'Non-Lethal':        { effetto: 'nessunaSalvezza', note:'Non infligge Ferite / non richiede salvezza. Precedenza assoluta.' },
    'Direct Template':   { effetto: 'nessunTiroBS_bersaglioFaPH', note:'Chi lo subisce fa Tiro Normale PH (o PH-3), non Faccia a Faccia.' },
    'Impact Template':   { effetto: 'templateSuImpatto' },
    'BS Weapon (PH)':    { effetto: 'usaPH', note:'Usa PH al posto di BS; tutti i MOD BS vanno su PH.' },
    'BS Weapon (WIP)':   { effetto: 'usaWIP', note:'Usa WIP al posto di BS; no BS Attack (Shock).' },
    'Improvised':        { effetto: 'mod-6', note:'-6 all\'attributo dell\'utente.' },
    'Silent':            { haValore:true, effetto:'malusDodgeBersaglio', note:'Se attacchi in ZoC fuori LoF, il bersaglio applica il MOD al proprio Dodge F2F.' },
    'Speculative Attack':{ effetto: 'abilitaSpeculativo', note:'L\'arma puo` fare Speculative Attack (leggere QUESTO, non il nome).' },
    'Intuitive Attack':  { effetto: 'abilitaIntuitivo', note:'L\'arma puo` fare Intuitive Attack (leggere QUESTO, non il nome).' },
    'Suppressive Fire':  { effetto: 'abilitaSoppressione' },
    'Target':            { haValore:true, effetto:'soloControAttributo', note:'Efficace solo contro bersagli con l\'attributo (VITA/STR).' },
    'Burst: Single Target':{ effetto:'burstUnBersaglio' },
    'Double Shot':       { effetto:'piuUnoBurstInAttivo' }
};

console.log('✅ catalogo_n5.js caricato: munizioni, skill, equip, hacking, stati, tratti (N5.2).');

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'catalogo_n5.js', versione: '2026-09-23.5', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

// @versione 2026-09-23.2 | logica_aro.js | proprieta`: chat INTERFACCIA
//
// PASSATO ALLA CHAT INTERFACCIA il 23 settembre 2026, su proposta della
// chat MOTORE e decisione di Paolo. Il criterio e` quello di sempre: le
// schermate e le dichiarazioni del giocatore stanno qui, le regole nel
// motore. Misurato prima di prenderlo: 30 chiamate a 15 funzioni del
// motore, e nessuna aritmetica sui valori di gioco — i numeri che si
// leggono nel file sono etichette a schermo ("-3 a te, +3 ARM") e classi
// di colore delle fasce di gittata.
//
// Chi lo modifica tenga la regola: qui si CHIEDE al motore e si DISEGNA.
// Se ti accorgi di star scrivendo un numero di regolamento, e` il segno
// che quel pezzo va nel motore, non qui.
//
// ==========================================
// 🚨 TURNO REATTIVO (ARO) N5 - logica_aro.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Ultimo file a usare window.getWeaponProfile:
// con questo il ponte M.installaCompatibilita() non serve più.
//
// Correzioni:
//
//  1. CRASH SU SCHIVATA E RESET. renderAroModifiersUI chiamava
//     getWeaponProfile("NESSUNA") e poi leggeva bands[0].mod comunque, anche
//     per le azioni difensive che un'arma non ce l'hanno. Col vecchio
//     profilo di ripiego (che aveva una banda finta a 0) passava inosservato;
//     col motore, che non inventa più bande, sarebbe stato un TypeError.
//
//  2. LA SOPPRESSIONE NON ESISTEVA IN ARO. Una truppa in Fuoco di
//     Soppressione reagisce col profilo SF Mode a Burst 3, tutto su un
//     bersaglio solo. Qui il Burst era sempre 1 e il profilo quello normale.
//
//  3. ESPANSIONE ARMI SCRITTA A MANO (quinta copia nel progetto): cinque
//     casi hardcoded per MULTI/Plasma/Missile. Ora dal database.
//
//  4. TRE PROGRAMMI DI HACKING FISSI, uguali per ogni hacker. Dipendono dal
//     dispositivo: un Killer Hacking Device non ha Spotlight né Carbonite.
//
//  5. SPLIT MUNIZIONI /[\/,]/ che spezzava "E/M" in "E" e "M".
//
//  6. I MOD NON ERANO CALCOLATI: la Schivata mostrava un interruttore LoF
//     ma spediva solo il flag, senza valore.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: gli ARO non possono funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    window.selectedAroUnits = [];
    window.currentAroIndex = 0;
    window.aroReactions = [];
    window.aroCurrentConfig = {};

    const isNomads = () => document.title.includes('NOMADS');
    const accento = () => (isNomads() ? '#00ffff' : '#00ccff');

    // ==============================================================
    // ALLARME
    // ==============================================================
    window.mostraBannerAllarme = function () {
        const banner = document.getElementById('aro-alert-banner');
        if (!banner) return;
        banner.style.display = 'block';
        const d = window.currentAttackData || {};
        const chi = d.attaccanti ? d.attaccanti.join(' e ') : 'Nemico';
        const txt = document.getElementById('aro-alert-text');
        if (txt) {
            txt.innerHTML = `⚠️ IL NEMICO AGISCE: <br><span style="color:#ffcc00; font-size:24px;">${chi}</span>` +
                (d.azione ? `<br><span style="color:#aaa; font-size:15px;">${d.azione}</span>` : '');
        }
        window.scrollTo(0, 0);
    };

    // ==============================================================
    // 1. SELEZIONE UNITÀ CHE REAGISCONO
    // ==============================================================
    window.apriSelezioneAro = function () {
        const M = motore(); if (!M) return;
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const step = document.getElementById('step-aro-selection');
        if (step) step.style.display = 'flex';

        const container = document.getElementById('aro-selection-list');
        if (!container) return;
        container.innerHTML = '';
        window.selectedAroUnits = [];

        const inArrivo = (window.currentAttackData && window.currentAttackData.azione) || null;
        const bg = isNomads() ? '#1a0000' : '#001122';
        const bordo = isNomads() ? '#550000' : '#003366';

        const escluse = [];
        (window.roster || []).forEach(function (u) {
            const st = M.statoBersaglio(u);
            if (st.hidden) return;   // non è sul tavolo: nemmeno da mostrare

            const possibili = M.azioniAroPossibili(u, inArrivo);
            const ammesse = possibili.filter(a => a.ammesso);

            if (ammesse.length === 0) {
                const motivo = (possibili.find(a => a.motivo) || {}).motivo || 'nessun ARO disponibile';
                escluse.push({ nome: M.nomeUnita(u), motivo: motivo });
                return;
            }

            const sopp = st.suppressive ? ` <span style="color:#ff6600; font-size:14px;">🔥 SF MODE</span>` : '';
            container.innerHTML += `
                <button id="aro-btn-${u.id}" class="huge-btn" style="background:${bg}; border-color:${bordo}; min-height:70px; margin-bottom:10px; display:flex; flex-direction:row; align-items:center; text-align:left; width:100%;"
                    onclick="window.toggleAroUnit('${String(u.id).replace(/'/g, "\\'")}')">
                    <div style="font-size:22px; line-height:1; color:#fff; font-weight:bold; margin-left:10px;">
                        🛡️ ${M.nomeUnita(u)}${sopp}
                    </div>
                </button>`;
        });

        // ==============================================================
        // 🔴 I DEPLOYABLE: innesco da ZONA DI CONTROLLO, senza LoF
        // --------------------------------------------------------------
        // Tutta la generazione ARO qui sopra presuppone la Linea di Tiro.
        // Il Boost scatta sulla ZdC e la LoF non c'entra: un CrazyKoala
        // non "reagisce", si attiva. Senza questo blocco un koala sul
        // tavolo non compariva mai, e il giocatore reattivo non aveva modo
        // di farlo detonare.
        //
        // Non passa da azioniAroPossibili, che per un Deployable restituisce
        // giustamente zero azioni: non dichiara ARO, ha solo il proprio
        // innesco.
        // ==============================================================
        window.deployableInnescabili = [];
        const attivo = (window.currentAttackData && window.currentAttackData.attaccante) || null;
        const ordineCorrente = (window.currentAttackData && window.currentAttackData.ordineId) || null;

        (window.roster || []).forEach(function (u) {
            if (!u || !u.deployable) return;

            // Riga 5532: nell'Ordine in cui e` stato piazzato non reagisce.
            if (u.ordineDiPiazzamento != null && ordineCorrente != null &&
                String(u.ordineDiPiazzamento) === String(ordineCorrente)) {
                escluse.push({ nome: M.nomeUnita(u),
                               motivo: 'Appena piazzato: in questo Ordine non reagisce.' });
                return;
            }

            const arma = u.chiaveArma ? M.profiloArma(u.chiaveArma) : null;
            if (!arma || arma.nonTrovata) {
                escluse.push({ nome: M.nomeUnita(u), motivo: 'Arma del deployable non risolta.' });
                return;
            }

            const nemico = attivo ? { alias: attivo, states: (window.currentAttackData.statiAttaccante || {}) }
                                  : { alias: 'attaccante', states: {} };
            const pre = M.innescoDeployable(arma, nemico, {});
            if (!pre.scatta) {
                escluse.push({ nome: M.nomeUnita(u), motivo: pre.motivo });
                return;
            }

            window.deployableInnescabili.push({ unita: u, arma: arma, nemico: nemico });
            const dom = M.domandeDeployable('ATTIVAZIONE')[0];
            container.innerHTML += `
                <div id="dep-${u.id}" style="background:#2a1a33; border:1px solid #cc88ff; border-radius:5px; padding:12px; margin-bottom:10px;">
                    <div style="color:#fff; font-size:20px; font-weight:bold;">📦 ${M.nomeUnita(u)}</div>
                    <div style="color:#cc88ff; font-size:13px; margin:4px 0 10px;">
                        Si attiva per Zona di Controllo: la Linea di Tiro non serve.</div>
                    <div style="color:#ccc; font-size:14px; margin-bottom:8px;">${dom ? dom.testo : ''}</div>
                    <div style="display:flex; gap:8px;">
                        <button class="huge-btn" style="flex:1; min-height:46px; background:#111;"
                            onclick="window.attivaDeployable('${String(u.id).replace(/'/g, "\\'")}', true)">SÌ, DETONA</button>
                        <button class="huge-btn" style="flex:1; min-height:46px; background:#111;"
                            onclick="window.attivaDeployable('${String(u.id).replace(/'/g, "\\'")}', false)">NO</button>
                    </div>
                </div>`;
        });

        if (escluse.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non possono reagire:</b><br>` +
                escluse.map(x => `• <b>${x.nome}</b> — ${x.motivo}`).join('<br>') + `</div>`;
        }
    };

    // Il giocatore ha risposto alla domanda sulla ZdC.
    window.attivaDeployable = function (id, dentroZdC) {
        const M = motore(); if (!M) return;
        const voce = (window.deployableInnescabili || []).find(x => String(x.unita.id) === String(id));
        if (!voce) return;

        const e = M.innescoDeployable(voce.arma, voce.nemico, {
            percorsoLibero: dentroZdC, dentroZdC: dentroZdC
        });

        const div = document.getElementById('dep-' + id);
        if (!e.scatta) {
            if (div) div.innerHTML = `<div style="color:#888; font-size:14px;">
                📦 ${M.nomeUnita(voce.unita)} — non si attiva: ${e.motivo}</div>`;
            return;
        }

        // Il deployable non tira: si muove fino al contatto e detona.
        // L'unica difesa e` una Schivata come TIRO NORMALE.
        window.aroReactions = window.aroReactions || [];
        window.aroReactions.push({
            nome: M.nomeUnita(voce.unita),
            azione: 'DEPLOYABLE_BOOST',
            arma: voce.arma,
            deployable: true,
            senzaTiro: true,
            note: [e.difesa, e.rimozione].filter(Boolean)
        });

        if (div) {
            div.style.borderColor = '#00ff00';
            div.innerHTML = `<div style="color:#00ff00; font-size:18px; font-weight:bold;">
                📦 ${M.nomeUnita(voce.unita)} DETONA</div>
                <div style="color:#ccc; font-size:13px; margin-top:6px;">${e.difesa}</div>
                <div style="color:#cc9955; font-size:12px; margin-top:4px;">${e.rimozione || ''}</div>`;
        }
    };

    window.toggleAroUnit = function (id) {
        const i = window.selectedAroUnits.indexOf(id);
        const btn = document.getElementById(`aro-btn-${id}`);
        if (i > -1) {
            window.selectedAroUnits.splice(i, 1);
            if (btn) { btn.style.background = isNomads() ? '#1a0000' : '#001122'; btn.style.borderColor = isNomads() ? '#550000' : '#003366'; }
        } else {
            window.selectedAroUnits.push(id);
            if (btn) { btn.style.background = isNomads() ? '#8b0000' : '#003366'; btn.style.borderColor = isNomads() ? '#ff0000' : '#00ccff'; }
        }
    };

    window.goToAroStep = function (stepId) {
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const el = document.getElementById(stepId);
        if (el) el.style.display = 'flex';
    };

    window.aggiornaTitoliAro = function (nome) {
        const t = `-- ${String(nome).toUpperCase()} (ARO) --`;
        ['aro-header-action', 'aro-header-weapon', 'aro-header-target', 'aro-header-mods']
            .forEach(id => { const e = document.getElementById(id); if (e) e.innerHTML = t; });
    };

    window.confermaSelezioneAro = function () {
        if (window.selectedAroUnits.length === 0) return alert('Seleziona almeno un\'unità per reagire.');
        window.currentAroIndex = 0;
        window.aroReactions = [];
        window.avviaCicloAroUnita();
    };

    // ==============================================================
    // 2. AZIONE ARO
    // ==============================================================
    window.avviaCicloAroUnita = function () {
        const M = motore(); if (!M) return;
        const u = (window.roster || []).find(x => String(x.id) === String(window.selectedAroUnits[window.currentAroIndex]));
        if (!u) return;

        window.aroCurrentConfig = {
            id: u.id, nome: M.nomeUnita(u), azione: null, arma: null, bersaglio: null,
            rangeIndex: 0, rangeMod: 0, cover: false, copertura: null, terrain: 'NESSUNO', ammo: null, hasLoF: true
        };
        window.aggiornaTitoliAro(window.aroCurrentConfig.nome);

        const inArrivo = (window.currentAttackData && window.currentAttackData.azione) || null;
        const possibili = M.azioniAroPossibili(u, inArrivo);
        const container = document.getElementById('aro-action-list');
        if (!container) return;
        container.innerHTML = '';

        const colori = {
            BS_ATTACK: ['#002244', accento()], HACKING: ['#002244', accento()],
            CC_ATTACK: ['#002244', accento()], DODGE: ['#003300', '#00ff00'], RESET: ['#003300', '#00ff00']
        };

        possibili.filter(a => a.ammesso).forEach(function (a) {
            // puoFareAzione lavora sugli ID del turno attivo: la traduzione la fa il motore.
            const equivalente = M.aroAdAzione(a.id);
            if (window.puoFareAzione && equivalente && !window.puoFareAzione(u, equivalente)) return;
            const nota = a.note.length ? `<br><span style="font-size:12px; color:#ff9900;">${a.note[0]}</span>` : '';
            const c = colori[a.id] || ['#111', '#888'];
            container.innerHTML += `<button class="huge-btn" style="background:${c[0]}; border-color:${c[1]};"
                onclick="window.selezionaAzioneAro('${a.id}')">${a.nome.toUpperCase()}${nota}</button>`;
        });

        const negate = possibili.filter(a => !a.ammesso);
        if (negate.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non disponibili:</b><br>` +
                negate.map(a => `• <b>${a.nome}</b> — ${a.motivo}`).join('<br>') + `</div>`;
        }

        window.goToAroStep('step-aro-action');
    };

    // ==============================================================
    // 3. ARMA
    // ==============================================================
    window.selezionaAzioneAro = function (act) {
        const M = motore(); if (!M) return;
        act = String(act).replace(/['"]+/g, '').split(',')[0].trim();
        window.aroCurrentConfig.azione = act;

        const u = (window.roster || []).find(x => String(x.id) === String(window.aroCurrentConfig.id));

        if (act === 'DODGE' || act === 'RESET') {
            // Nessuna arma: qui il vecchio codice chiamava comunque
            // getWeaponProfile("NESSUNA") e leggeva bands[0].
            window.aroCurrentConfig.arma = null;
            window.aroCurrentConfig.bersaglio = 'TUTTI / NESSUNO';
            window.renderAroModifiersUI();
            return window.goToAroStep('step-aro-modifiers');
        }

        const esito = M.armiARO(u, act);
        window.aroSfMode = !!esito.sfMode;

        const container = document.getElementById('aro-weapon-list');
        if (!container) return;
        container.innerHTML = '';

        if (esito.sfMode) {
            container.innerHTML += `<div style="background:#331100; border:1px solid #ff6600; padding:10px; margin-bottom:15px; text-align:center; color:#ffaa66; border-radius:5px;">
                🔥 <b>FUOCO DI SOPPRESSIONE</b><br>
                <span style="font-size:13px;">Profilo SF Mode: gittata e Burst sostituiti, PS e munizioni invariati.<br>
                Il Burst pieno va tutto su un bersaglio solo.</span></div>`;
            // Le note che armiARO restituisce: prima il riquadro era fisso e
            // la nota non si vedeva. (Chat REGOLE, 21 settembre.)
            (esito.note || []).forEach(function (n) {
                container.innerHTML += `<div style="margin:-5px 0 12px; padding:8px 10px; color:#ffcc99; font-size:13px;">${n}</div>`;
            });
        }

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">❌ Nessuna arma utilizzabile per questo ARO.</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const gittata = p.isTemplate ? `Sagoma ${p.template || ''}`.trim()
                              : p.isCC ? 'Corpo a Corpo'
                              : (p.bands || []).map(b => `${b.mod > 0 ? '+' : ''}${b.mod}`).join(' / ');
                const nomeEsc = p.nome.replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${accento()};" onclick="window.selezionaArmaAro('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${accento()}; font-size:14px;">B${p.burst} | ${(p.ammoOpzioni || [p.ammo]).join('/')} | ${gittata}</span></button>`;
            });
        }

        // 🔴 Il modo normale in Soppressione: stessa arma, profilo normale, e
        // la Soppressione si annulla. Stesso avviso arancione dell'attivo.
        (esito.armiModoNormale || []).forEach(function (p) {
            const gittata = (p.bands || []).map(b => `${b.mod > 0 ? '+' : ''}${b.mod}`).join(' / ');
            const nomeEsc = p.nome.replace(/'/g, "\\'");
            container.innerHTML += `<button class="huge-btn" style="border-color:#ff8800; background:#221100;"
                onclick="window.selezionaArmaAro('${nomeEsc}', true)">
                ${p.nome} — MODO NORMALE<br>
                <span style="color:#ff8800; font-size:13px;">⚠️ ATTIVARLA ANNULLA LA SOPPRESSIONE — gittate ${gittata}</span></button>`;
        });

        if (esito.escluse.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non utilizzabili:</b><br>` +
                esito.escluse.map(x => `• <b>${x.nome}</b> — ${x.motivo}`).join('<br>') + `</div>`;
        }
        esito.avvisi.forEach(function (a) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">⚠️ ${a.messaggio}</div>`;
        });

        window.goToAroStep('step-aro-weapon');
    };

    window.selezionaArmaAro = function (nomeArma, annullaSoppressione) {
        window.aroCurrentConfig.arma = nomeArma;
        window.aroCurrentConfig.annullaSoppressione = !!annullaSoppressione;
        // Modo normale in Soppressione: lo stato si annulla. Il motore dà
        // l'unita` aggiornata, qui la si sostituisce nel roster.
        if (annullaSoppressione) {
            const M = motore();
            const id = window.aroCurrentConfig.id;
            const i = (window.roster || []).findIndex(function (x) { return x && String(x.id) === String(id); });
            if (M && i >= 0) {
                const e = M.annullaSoppressione(window.roster[i]);
                window.roster[i] = e.unitaAggiornata;
            }
            window.aroSfMode = false;
        }
        const container = document.getElementById('aro-target-list');
        if (!container) return;
        container.innerHTML = '';
        const nemici = (window.currentAttackData && window.currentAttackData.attaccanti) || ['Nemico'];

        if (window.aroSfMode && nemici.length > 1) {
            container.innerHTML += `<div style="background:#331100; border:1px solid #ff6600; padding:10px; margin-bottom:12px; text-align:center; color:#ffaa66; border-radius:5px; font-size:13px;">
                🔥 In Soppressione il Burst pieno va su <b>UN SOLO</b> bersaglio: scegli quale.</div>`;
        }

        nemici.forEach(function (n) {
            container.innerHTML += `<button class="huge-btn" style="background:#111; border:2px solid var(--nomad-red); min-height:70px; font-size:24px;"
                onclick="window.selezionaBersaglioAro('${String(n).replace(/'/g, "\\'")}')">[BERSAGLIO] ${n}</button>`;
        });
        window.goToAroStep('step-aro-target');
    };

    window.selezionaBersaglioAro = function (tgt) {
        window.aroCurrentConfig.bersaglio = tgt;
        window.renderAroModifiersUI();
        window.goToAroStep('step-aro-modifiers');
    };

    // ==============================================================
    // 4. MODIFICATORI
    // ==============================================================
    window.renderAroModifiersUI = function () {
        const M = motore(); if (!M) return;
        const container = document.getElementById('aro-modifiers-content');
        if (!container) return;

        const cfg = window.aroCurrentConfig;
        const u = (window.roster || []).find(x => String(x.id) === String(cfg.id)) || {};
        const difensivo = (cfg.azione === 'DODGE' || cfg.azione === 'RESET');

        // 🚨 Con un'azione difensiva NON si tocca il profilo arma.
        const arma = difensivo ? null : M.profiloArma(cfg.arma);
        if (arma && window.aroSfMode) Object.assign(arma, M.profiloSF(arma));

        let corpo = '';
        let esito = null;

        if (difensivo) {
            esito = (cfg.azione === 'DODGE')
                ? M.modSchivata(u, { haLoFVersoAttaccante: cfg.hasLoF })
                : M.modReset(u, {});
            cfg.valoreSuccesso = esito.valore;
            cfg.attributo = esito.attributo;

            const dettaglio = esito.voci.length
                ? esito.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:#aaa;">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:#888; text-align:center;">Nessun modificatore</div>`;

            corpo = `<div style="background:#001a1a; border:1px solid #005555; padding:10px; border-radius:5px; margin-bottom:12px; font-size:14px;">
                    <div style="text-align:center; color:#fff; margin-bottom:6px;">
                        ${esito.attributo} ${esito.base} → <b style="color:#00ff00; font-size:22px;">${esito.valore}</b></div>
                    <div style="border-top:1px solid #004455; padding-top:6px;">${dettaglio}</div>
                 </div>`;

            if (cfg.azione === 'DODGE') {
                const stile = cfg.hasLoF ? 'background:#004400; color:#00ff00; border-color:#00ff00;'
                                         : 'background:#440000; color:#ff5555; border-color:#ff0000;';
                corpo += `<button type="button" class="huge-btn" style="width:100%; margin-top:10px; min-height:60px; font-size:17px; ${stile}"
                    onclick="window.toggleAroLoF()">${cfg.hasLoF ? '👁️ HO LINEA DI TIRO' : '🚫 NESSUNA LINEA DI TIRO (-3 PH)'}</button>`;
            }
            if (esito.note.length) {
                corpo += `<div style="margin-top:10px; color:#888; font-size:12px; line-height:1.6;">` +
                    esito.note.map(n => `• ${n}`).join('<br>') + `</div>`;
            }
        } else {
            // Gittata: banda esplicita, mai uno zero implicito.
            if (arma.bands && arma.bands.length > 0) {
                if (typeof cfg.rangeIndex !== 'number' || cfg.rangeIndex < 0 || cfg.rangeIndex >= arma.bands.length) cfg.rangeIndex = 0;
                cfg.rangeMod = arma.bands[cfg.rangeIndex].mod;
            } else {
                cfg.rangeIndex = 0; cfg.rangeMod = 0;
            }
            if (!cfg.ammo || (arma.ammoOpzioni || []).indexOf(cfg.ammo) < 0) cfg.ammo = (arma.ammoOpzioni || ['N'])[0];

            if (arma.isTemplate) {
                corpo = `<div style="margin-bottom:15px; text-align:center; padding:10px; background:#002255; border:1px solid #ff0000; color:#ff9900; font-weight:bold; border-radius:5px;">
                    🔥 ATTACCO A SAGOMA<br><span style="font-size:12px; color:#fff;">${M.tipoTemplate(arma).tipo === 'DIRETTO' ? 'Sagoma Diretta: nessun tiro per colpire' : 'Sagoma a Impatto: richiede il tiro'}</span></div>`;
            } else if (arma.isCC) {
                corpo = `<div style="margin-bottom:15px; text-align:center; padding:10px; background:#002244; border:1px solid ${accento()}; color:${accento()}; font-weight:bold; border-radius:5px;">
                    ⚔️ CORPO A CORPO<br><span style="font-size:12px; color:#fff;">Si tira su CC. Niente gittata né copertura.</span></div>`;
            } else if (arma.isHacking) {
                corpo = `<div style="margin-bottom:15px; text-align:center; padding:10px; background:#002244; border:1px solid ${accento()}; color:${accento()}; font-weight:bold; border-radius:5px;">
                    💻 ZONA HACKING<br><span style="font-size:12px; color:#fff;">PS ${arma.ps} · ${arma.dimezzaBTS ? 'BTS dimezzato' : 'BTS pieno'} · ${arma.effetto || ''}</span></div>`;
            } else {
                let seg = '', lab = '';
                arma.bands.forEach(function (b, i) {
                    let cls = 'seg-2';
                    if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
                    seg += `<div class="range-seg ${cls} ${cfg.rangeIndex === i ? 'active' : ''}" onclick="window.setAroRange(${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
                    lab += `<span>${b.label}</span>`;
                });
                corpo = `<div style="margin-bottom:15px;"><div class="range-bar">${seg}</div>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${lab}</div></div>`;
            }

            const ammoOpts = (arma.ammoOpzioni || ['N'])
                .map(o => `<option value="${o}" ${o === cfg.ammo ? 'selected' : ''}>Munizioni: ${o}</option>`).join('');
            corpo += `<select class="huge-btn" style="width:100%; margin-top:15px; min-height:55px; font-size:16px; background:#002233; color:#fff; border-color:${accento()}; text-align:center; padding:0 10px;"
                onchange="window.setAroAmmo(this.value)">${ammoOpts}</select>`;
        }

        const burst = arma ? M.burstARO(u, arma) : { valore: 1, voci: [], note: [] };
        cfg.burst = burst.valore;

        container.innerHTML = `
            <div class="target-card" style="border-left:4px solid var(--nomad-red); background:rgba(255,255,255,0.03); padding:15px; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <b style="color:var(--nomad-orange); font-size:24px;">VS: ${cfg.bersaglio}</b>
                    <div class="burst-ctrl"><span style="font-size:22px; font-weight:bold; color:#00ff00;">${burst.valore} B</span></div>
                </div>
                ${burst.voci.length > 1 ? `<div style="color:#888; font-size:12px; margin-bottom:12px;">` + burst.voci.map(v => v.motivo).join(' · ') + `</div>` : ''}
                ${corpo}
                ${burst.note.length ? `<div style="margin-top:10px; color:#ff9900; font-size:12px;">• ` + burst.note.join('<br>• ') + `</div>` : ''}
                ${(cfg.azione === 'BS_ATTACK')
                    ? `<button type="button" class="huge-btn" style="width:100%; margin-top:14px; min-height:55px; font-size:16px; ${cfg.cover ? 'background:#003300; color:#00ff00; border-color:#00ff00;' : 'background:#111; color:#aaa; border-color:#555;'}"
                        onclick="window.toggleAroCover()">${cfg.cover ? '🛡️ BERSAGLIO IN COPERTURA (-3 a te, +3 alla sua ARM)' : '⬜ BERSAGLIO NON IN COPERTURA'}</button>
                       ${cfg.cover ? window.sceltaCopertura(cfg.copertura, 'window.setAroCopertura') : ''}`
                    : ''}
                <div style="display:flex; margin-top:20px; margin-bottom:5px;">
                    <select class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; background:#111; color:#fff; border-color:#888; text-align:center; padding:0 10px;"
                        onchange="window.setAroTerrain(this.value)">
                        ${window.generaOpzioniTerreni ? window.generaOpzioniTerreni(cfg.terrain) : '<option value="NESSUNO">Nessun Terreno</option>'}
                    </select>
                </div>
            </div>`;
    };

    window.setAroRange = function (idx) {
        const M = motore(); if (!M) return;
        const cfg = window.aroCurrentConfig;
        let arma = M.profiloArma(cfg.arma);
        if (window.aroSfMode) arma = M.profiloSF(arma);
        cfg.rangeIndex = idx;
        cfg.rangeMod = (arma.bands && arma.bands[idx]) ? arma.bands[idx].mod : 0;
        window.renderAroModifiersUI();
    };
    // 🔴 In ARO il reattivo spara: la Copertura del suo bersaglio la dichiara
    // lui. Il campo cover nasceva a false e nessuno lo cambiava, quindi ogni
    // tiro reattivo partiva senza il -3 e senza il +3 ARM del bersaglio, e il
    // giocatore non poteva correggerlo. risolviScontro legge reazione.cover
    // gia` da sempre: mancava solo il comando. (Chat INTERFACCIA, 23 sett.)
    window.toggleAroCover = function () {
        window.aroCurrentConfig.cover = !window.aroCurrentConfig.cover;
        window.renderAroModifiersUI();
    };

    window.toggleAroLoF = function () { window.aroCurrentConfig.hasLoF = !window.aroCurrentConfig.hasLoF; window.renderAroModifiersUI(); };
    window.setAroCopertura = function (v) { window.aroCurrentConfig.copertura = v || null; window.renderAroModifiersUI(); };
    window.setAroTerrain = function (v) { window.aroCurrentConfig.terrain = v; window.renderAroModifiersUI(); };
    window.setAroAmmo = function (v) { window.aroCurrentConfig.ammo = v; window.renderAroModifiersUI(); };

    // ==============================================================
    // 5. INVIO
    // ==============================================================
    window.salvaAroCorrente = function () {
        const M = motore(); if (!M) return;
        const cfg = window.aroCurrentConfig;
        // Vocabolario ARO per l'Hub, più quello attivo per chiarezza.
        cfg.azioneAttiva = M.aroAdAzione(cfg.azione);
        cfg.sfMode = !!window.aroSfMode;
        window.aroReactions.push(JSON.parse(JSON.stringify(cfg)));
        window.aroSfMode = false;

        if (window.currentAroIndex < window.selectedAroUnits.length - 1) {
            window.currentAroIndex++;
            window.avviaCicloAroUnita();
        } else {
            window.inviaAro();
        }
    };

    function spedisci(reazioni) {
        const fazione = isNomads() ? 'NOMADI' : 'PANOCEANIA';
        const payload = {
            status: 'ARO_DONE', fazione: fazione, reazioni: reazioni,
            motoreVersione: window.MotoreN5 ? window.MotoreN5.VERSIONE : null,
            timestamp: Date.now()
        };
        if (window.inviaRispostaAro) window.inviaRispostaAro(payload, fazione);

        const banner = document.getElementById('aro-alert-banner');
        if (banner) banner.style.display = 'none';
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const step = document.getElementById('step-reactive-turn');
        if (step) step.style.display = 'flex';

        window.selectedAroUnits = [];
        window.aroReactions = [];
        window.aroCurrentConfig = {};
        window.aroSfMode = false;
    }

    window.inviaAro = function () { spedisci(window.aroReactions); };

    window.annullaAro = function () {
        if (confirm('Passare l\'ARO? Il nemico agirà indisturbato!')) spedisci([]);
    };

    console.log('🚨 logica_aro.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'logica_aro.js', versione: '2026-09-23.2', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

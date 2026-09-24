// @versione 2026-09-23.1 | calcolatore_math.js | proprieta`: chat MOTORE
// ==========================================
// 🧮 CALCOLATORE N5 — adattatore sopra MotoreN5
// ------------------------------------------
// Questo file ERA 492 righe: calcolaSalvezza (10-134) e
// generaRisoluzioneDaDati (135-492), dove ogni regola viveva dentro
// l'HTML che la descriveva. Ora è un adattatore: legge lo stato di
// gioco, chiama il motore, e trasforma i dati in HTML.
//
// Cosa è sparito con le 358 righe:
//
//  - I NOVE RAMI MORTI delle munizioni N3. VIRAL, BREAKER, NANOTECH,
//    PLASMA, ADHESIVE, K1, BIOWEAPON, FLASH, MONOFILAMENT non sono più
//    munizioni in N5. Restano come NOMI D'ARMA — "K1 Combi Rifle" spara
//    munizione N — e il motore legge ammo/salvAttr/salvTiri dal Weapon
//    Chart, mai dal nome.
//
//  - LA RIGA 282, che trattava OGNI Sagoma come colpo automatico che
//    ignora Mimetismo e Copertura. Giusto per le Dirette, sbagliato per
//    quelle a Impatto, che il tiro lo richiedono.
//
//  - IL -99 come segnaposto di "nessuna Linea di Tiro".
//
//  - IL NOME DEL PROGRAMMA di hacking preso da window.currentOrder, che
//    sull'Hub non è mai impostato: tutte le salvezze da hacking cadevano
//    sul messaggio generico. Ora il programma viaggia nel payload.
//
//  - LA RICERCA DEI VISORI per sigla "MSV", mentre i profili scrivono
//    "Multispectral Visor Lx": nessun visore veniva riconosciuto.
//
// Il banco (banco_confronto.js) confronta questa versione con l'originale
// su 5280+ scenari: ogni divergenza è classificata e spiegata.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            console.error('⛔ motore_regole_n5.js non caricato: il calcolatore non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // ------------------------------------------------------------------
    // Stato di gioco
    // ------------------------------------------------------------------
    function rosterDi(fazione) {
        const gs = window.gameState || {};
        return (fazione === 'NOMADI' ? gs.nomads : gs.panoceania) || [];
    }

    function cercaIn(roster, nome) {
        const M = motore();
        const n = String(nome || '').toUpperCase();
        return roster.find(u => M.nomeUnita(u).toUpperCase() === n) || null;
    }

    // Membri attivi del Fireteam di un'unità.
    function membriFireteam(unita, roster) {
        if (!unita || !unita.states || !unita.states.fireteam) return [];
        return roster.filter(u =>
            u.combatGroup === unita.combatGroup &&
            u.states && u.states.fireteam === unita.states.fireteam &&
            u.state !== 'DEAD'
        );
    }

    // 🔴 Il LIVELLO, non il numero di membri: e` il numero di truppe della
    // stessa Unita`. Passare il conteggio significava dare tutti i bonus a
    // qualunque Fireteam di 4-5 miniature, anche tutte di Unita` diverse.
    function livelloFireteam(unita, roster) {
        const M = motore(); if (!M) return 0;
        const membri = membriFireteam(unita, roster);
        return membri.length ? M.livelloFireteam(membri).livello : 0;
    }

    // ------------------------------------------------------------------
    // Da dati a HTML
    // ------------------------------------------------------------------
    function colore(v) { return v >= 0 ? '#00ff00' : '#ff3333'; }

    function rendiVoci(esito) {
        if (!esito) return '';
        let html = '';
        if (esito.attributo && esito.base != null) {
            html += `Statistica Base (${esito.attributo}): ${esito.base}<br>`;
        }
        (esito.voci || []).forEach(function (v) {
            const seg = v.valore > 0 ? '+' + v.valore : v.valore;
            html += `<span style="color:${colore(v.valore)}">${v.motivo} (${seg})</span><br>`;
        });
        (esito.note || []).forEach(function (n) {
            html += `<span style="color:#888; font-size:12px;">${n}</span><br>`;
        });
        if (esito.automatico) html += `<span style="color:#ff9900">🔥 Sagoma Diretta: colpo automatico</span><br>`;
        if (esito.lofBloccata) html += `<span style="color:#ff0000">⚠️ Nessuna Linea di Tiro</span><br>`;
        if (esito.impossibile) html += `<span style="color:#ff0000">⚠️ Valore di Successo sotto 1: il tiro fallisce automaticamente</span><br>`;
        // Critici: il dado pari al Valore di Successo. Sopra il 20 se ne
        // aggiungono di più, ed è un'informazione che il giocatore vuole.
        if (esito.critici && !esito.critici.nessunTiro) {
            const c = esito.critici;
            html += `<span style="color:${c.riesceSempre ? '#00ff00' : '#ffcc00'}; font-size:12px;">🎯 ${c.testo}</span><br>`;
        }
        return html;
    }

    function rendiSalvezza(s) {
        const M = motore();
        if (!s || !s.offensivo) {
            return `<span style="color:#555;">${(s && s.note && s.note[0]) || 'Nessun danno'}</span>`;
        }
        const rami = s.combinato ? s.rami : [{ attributo: s.attributo, valoreAttributo: s.valoreAttributo,
                                               ps: s.ps, valoreSuccesso: s.valoreSuccesso, voci: s.voci }];
        let html = `<span style="color:#00ccff; font-weight:bold;">Munizione: ${s.munizione}</span><br>`;
        if (s.combinato) html += `<span style="color:#ff9900; font-size:12px;">Tiro Salvezza Combinato</span><br>`;

        rami.forEach(function (r) {
            const dadi = s.combinato ? 1 : s.tiri;
            html += `Tira <b style="color:#ff3333;">${dadi} ${dadi === 1 ? 'Dado' : 'Dadi'}</b> su <b style="color:#00ffff;">${r.attributo}</b>.<br>`;
            html += `<span style="color:#00ff00; font-size:22px; font-weight:bold;">${r.valoreSuccesso} o MENO</span>`;
            if (r.ps != null) html += ` <span style="font-size:12px; color:#888;">(${r.attributo} ${r.valoreAttributo} + PS ${r.ps})</span>`;
            html += '<br>';
            if (r.critici && !r.critici.nessunTiro) {
                html += `<span style="color:#ffcc00; font-size:11px;">${r.critici.testo}</span><br>`;
            }
        });

        const eff = [];
        (s.statiFallimento || []).forEach(x => eff.push(`Fallimento = ${x}`));
        if (s.dannoPerFallimento > 1) eff.push(`<b style="color:#ff3333;">${s.dannoPerFallimento} Ferite per ogni fallimento</b>`);
        (s.note || []).forEach(n => eff.push(n));
        if (eff.length) html += `<span style="font-size:12px; color:#aaa;">${eff.join(' | ')}</span><br>`;
        html += `<span style="font-size:11px; color:#888;">Nota: un Critico aggiunge ${s.critExtra || 1} Tiro Salvezza extra.</span>`;
        return html;
    }

    // ------------------------------------------------------------------
    // calcolaSalvezza: firma invariata, calcolo dal motore
    // ------------------------------------------------------------------
    window.calcolaSalvezza = function (ammo, danno, armBase, btsBase, phBase, cover, targetObj, isHacking, hackingProgram) {
        const M = motore(); if (!M) return '';
        const bersaglio = Object.assign({}, targetObj || {}, {
            arm: parseInt(armBase, 10) || 0,
            bts: parseInt(btsBase, 10) || 0,
            ph: parseInt(phBase, 10) || 0
        });

        let arma;
        if (isHacking && hackingProgram) {
            arma = M.armaDaProgramma(hackingProgram);
        } else {
            arma = { nome: 'colpo', ammo: ammo || 'N', ammoOpzioni: [ammo || 'N'], dam: parseInt(danno, 10),
                     bands: [], isTemplate: false, isCC: false, notazioni: [] };
        }
        const firewall = (typeof cover === 'number' && cover < 0) ? cover : 0;
        const inCopertura = (cover === true);

        return rendiSalvezza(M.tiroSalvezza(bersaglio, {
            arma: arma, ammo: arma.ammo, cover: inCopertura, firewall: firewall
        }));
    };

    // ------------------------------------------------------------------
    // generaRisoluzioneDaDati: firma invariata, calcolo dal motore
    // ------------------------------------------------------------------
    // Le reazioni si possono passare come secondo argomento. Il ripiego su
    // window.latestAroData resta per non rompere i chiamanti esistenti, ma
    // una variabile globale letta di nascosto rende il calcolo impossibile
    // da provare: chi puo`, la passi.
    window.generaRisoluzioneDaDati = function (dati, reazioniEsplicite) {
        const M = motore(); if (!M) return [];
        const attacchi = (dati && dati.attacchi) || [];
        const reazioni = reazioniEsplicite || (dati && dati.reazioni) || window.latestAroData || [];

        const fazAttiva = (window.gameState && window.gameState.activeFaction) || 'NOMADI';
        const fazReattiva = fazAttiva === 'NOMADI' ? 'PANOCEANIA' : 'NOMADI';
        const rosterAtt = rosterDi(fazAttiva);
        const rosterDif = rosterDi(fazReattiva);

        // Si cerca prima per ID: due unità omonime sono la norma in un
        // roster, e cercare per nome trova sempre la prima.
        function cercaPerId(roster, id) {
            return id ? (roster.find(u => String(u.id) === String(id)) || null) : null;
        }
        const ctx = {
            trovaUnita: function (nome, id) {
                return cercaPerId(rosterAtt, id) || cercaPerId(rosterDif, id) ||
                       cercaIn(rosterAtt, nome) || cercaIn(rosterDif, nome) || { alias: nome };
            }
        };

        const scontri = M.risolviPayload({ attacchi: attacchi }, reazioni.map(function (r) {
            return Object.assign({}, r, { difensore: cercaIn(rosterDif, r.nome) });
        }), Object.assign(ctx, {
            // I bonus di Fireteam ora arrivano al calcolo.
            livelloFireteamAtt: (function () {
                const a = attacchi[0] ? ctx.trovaUnita(attacchi[0].attaccante) : null;
                return livelloFireteam(a, rosterAtt);
            })(),
            livelloFireteamDif: (function () {
                const r = reazioni[0] ? cercaIn(rosterDif, reazioni[0].nome) : null;
                return livelloFireteam(r, rosterDif);
            })()
        }));

        // --- traduzione nella forma che l'interfaccia già legge ---
        return scontri.map(function (s) {
            const out = {
                titolo: s.titolo,
                tipo: s.tipo,
                motivoConfronto: s.motivoConfronto,
                attivo: {
                    nome: s.attivo.nome,
                    // 🔴 Nel ramo "reagisce senza essere bersaglio" — e in "io
                    // muovo, tu mi spari" — nello slot attivo c'e` il REATTIVO:
                    // la fazione fissa lo metteva sotto la parte sbagliata del
                    // tabellone. (Chat TEST, 23 settembre.)
                    fazione: s.reattivoNonBersagliato ? fazReattiva : fazAttiva,
                    azione: s.attivo.azione,
                    mod: s.attivo.mod,
                    burst: s.attivo.burst,
                    dettagliMod: rendiVoci(s.attivo),
                    // 🔴 Sotto la truppa attiva va la salvezza che LEI deve
                    // superare se perde il confronto, non quella che infligge.
                    // Erano invertite: il giocatore leggeva sotto il proprio
                    // nome il numero dell'avversario.
                    salvezza: rendiSalvezza(s.attivo.salvezzaSubita || s.attivo.salvezzaInflitta),
                    salvezzaInflitta: rendiSalvezza(s.attivo.salvezzaInflitta),
                    // dati grezzi, per chi vuole costruirsi la propria vista
                    dati: s.attivo
                },
                reattivo: s.reattivo ? {
                    nome: s.reattivo.nome,
                    fazione: fazReattiva,
                    azione: s.reattivo.azione,
                    mod: s.reattivo.mod,
                    burst: s.reattivo.burst,
                    dettagliMod: rendiVoci(s.reattivo),
                    salvezza: rendiSalvezza(s.reattivo.salvezzaSubita || s.reattivo.salvezzaInflitta),
                    salvezzaInflitta: rendiSalvezza(s.reattivo.salvezzaInflitta),
                    dati: s.reattivo
                } : {
                    nome: '-', fazione: fazReattiva, azione: 'Nessuna Reazione',
                    mod: '-', burst: 0, dettagliMod: '', salvezza: '<span style="color:#555;">Nessun danno</span>'
                }
            };
            // Gli avvisi del motore non si perdono: l'interfaccia può mostrarli.
            if (s.avvisi && s.avvisi.length) out.avvisi = s.avvisi;
            return out;
        });
    };

    console.log('🧮 calcolatore_math.js: adattatore su MotoreN5 (le 358 righe del monolite sono state rimosse).');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'calcolatore_math.js', versione: '2026-09-23.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

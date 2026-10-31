// @versione 2026-10-31.1 | ordine_fuoco_speculativo.js | proprieta`: chat MOTORE
// ==========================================
// ☄️ FUOCO SPECULATIVO (N5) - ordine_fuoco_speculativo.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Tre errori della versione precedente (verificati sulla wiki N5.2):
//
//  1. FILTRO ARMI SBAGLIATO. Cercava GRENADE o LAUNCHER nel nome, e così
//     offriva Missile Launcher, Heavy Rocket Launcher e Adhesive Launcher
//     Rifle — nessuno dei quali ha il Tratto "Speculative Attack". Il
//     requisito è il Tratto, non la parola nel nome.
//
//  2. LE GRANATE TIRANO SU PH, NON SU BS. Hanno il Tratto "BS Weapon (PH)".
//     Il modulo mandava tutto all'Hub come tiro BS.
//
//  3. IL -6 NON È L'UNICA COSA CHE CAMBIA. Lo Speculativo ignora anche
//     Mimetismo e Copertura, cosa che né la schermata né il payload dicevano.
//     Ma i MOD di gittata SI applicano — ed è la differenza chiave con
//     l'Attacco Intuitivo, dove invece non si applica nulla.
//
// Limite noto: i Tratti d'arma stanno in catalogo_n5.js perché
// RULES_WEAPONS non ha un campo traits. Le voci dedotte sono segnalate.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il Fuoco Speculativo non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'FUOCO SPECULATIVO' e` quello di casa. Prima: { bordo: '#cc00ff', sfondo: '#330033' };.
    const COL = (function () {
        const ripiego = { bordo: '#cc00ff', sfondo: '#330033', riquadro: '#330033', tenue: '#cc00ff', testo: '#cc00ff' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('FUOCO SPECULATIVO')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseSpeculativo = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        window.currentOrder.isLongSkill = true;   // Long Skill: Ordine Intero
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        // 🔴 NON si ramifica su `isSecondHalf`: la seconda metà salta la
        // scelta dell'arma e dei bersagli solo se la prima metà era essa
        // stessa un attacco dello stesso tipo. Partendo da un Movimento —
        // il caso più comune al tavolo — arma e bersagli non ci sono, e si
        // arrivava ai modificatori con weapon undefined.
        const _M = window.MotoreN5;
        const ripresa = _M
            ? _M.riprendiOrdineDaFinestra(actionId, isSecondHalf)
            : { riprende: false, motivo: 'motore non caricato' };
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.pendingTargets = [];
            window.startUnitSpeculativoLoop();
        } else {
            window.preparaModificatoriSpeculativo();
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA
    // ==============================================================
    window.startUnitSpeculativoLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const container = document.getElementById('weapon-buttons-container');

        window.MotoreN5.azzeraNote('step-weapon');
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `FUOCO SPECULATIVO`, nota: `Ordine Intero · Non richiede LoF · -6 fisso · Burst 1` })}`;

        const esito = M.armiSpeculative(unita);

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">❌ Nessuna arma col Tratto "Speculative Attack".</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const attr = M.attributoArma(p, M.AZIONI.SPECULATIVO);
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                // 9 ottobre: il bottone e` quello approvato da Paolo (M.bottoneArma).
                // 26 ottobre: gli usi Disposable dentro il bottone (M.bottoneArma, opzione usi).
                // A usi finiti il tocco spiega e non sceglie l'arma.
                const usiP = M.usiResidui ? M.usiResidui(unita, p) : null;
                const esaurita = !!(usiP && usiP.residui <= 0);
                container.innerHTML += M.bottoneArma(p, { usi: usiP, attributi: esaurita
                    ? `onclick="alert(window.MotoreN5.messaggioScarico(window.coordUnits[window.coordIndex], window.MotoreN5.profiloArma('${nomeEsc}')))"`
                    : `onclick="window.declareSpeculativoAttack('${nomeEsc}')"` });
            });
        }

        // Le armi escluse col motivo: prima sparivano o, peggio, comparivano a torto.
        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        esito.escluse.forEach(x => window.MotoreN5.nota('step-weapon', x.nome + ' non utilizzabile per il Fuoco Speculativo', x.motivo, { tipo: 'nonpuo' }));
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">
                ⚠️ ${esito.avvisi[0].messaggio}</div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareSpeculativoAttack = function (nomeArma) {
        const M0 = window.MotoreN5, u0 = window.coordUnits && window.coordUnits[window.coordIndex];
        const usi0 = (M0 && M0.usiResidui && u0) ? M0.usiResidui(u0, M0.profiloArma(nomeArma)) : null;
        if (usi0 && usi0.residui <= 0) return alert('⛔ ' + M0.messaggioScarico(u0, M0.profiloArma(nomeArma)));
        window.currentOrder.weapon = nomeArma;
        window.setupTargetSelectionSpeculativo();
    };

    // ==============================================================
    // 2. BERSAGLIO PRINCIPALE
    // ==============================================================
    window.setupTargetSelectionSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];

        const nemici = M.rosterNemico();
        // 22 ottobre (Paolo, SPEC-06): un'arma TARGETLESS si lancia su un
        // PUNTO del tavolo. Per Pitcher, Disco Baller e Drop Bear in modo BS
        // il punto e` l'unica scelta (lasciano un segnalino dove cadono); per
        // le altre Targetless (Smoke) il punto si aggiunge ai nemici.
        const armaT = M.profiloArma(window.currentOrder.weapon);
        const targetless = !!(M.eTargetless && M.eTargetless(armaT));
        if (nemici.length === 0 && !targetless) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        // Lo Speculativo non richiede LoF: i Marker sono bersagli validi,
        // ed è proprio uno degli usi tipici (evita Mimetismo e Copertura).
        const giudizi = M.bersagliValidi(M.AZIONI.SPECULATIVO, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        if (window.validTargets.length === 0 && !targetless) {
            alert('❌ Nessun bersaglio valido.\n\n' + window.targetsScartati.map(t => `• ${t.nome}: ${t.motivo}`).join('\n'));
            return window.goToStep('step-weapon');
        }

        // 15 ottobre (Paolo): TUTTI i bersagli si scelgono QUI, il Principale
        // e quelli sotto la Sagoma. Prima i secondari stavano in un riquadro
        // della pagina della gittata. Il primo toccato e` il Principale.
        window.renderBersagliSpeculativo();
        window.goToStep('step-wait-aro');
    };

    // Chi si puo` toccare: i Principali ammessi, piu` (solo con una Sagoma
    // Circolare) chi e` ammesso soltanto come secondario, per esempio un
    // Marker (righe 13609-13610, 14207-14208).
    function giudiziSpeculativo(M) {
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const tpl = arma ? M.regoleTemplate(arma) : null;
        const sagoma = !!(tpl && tpl.forma === 'Circular');
        const prin = M.bersagliValidi(M.AZIONI.SPECULATIVO, M.rosterNemico(), { attaccante: unita });
        const sec = sagoma ? M.bersagliValidi(M.AZIONI.SPECULATIVO, M.rosterNemico(), { attaccante: unita, ruolo: 'secondario' }) : [];
        const targetless = !!(M.eTargetless && M.eTargetless(arma));
        const soloPunto = targetless && !!(M.lancioConSegnalino && M.lancioConSegnalino(arma));
        const voci = [];
        if (soloPunto) return { voci: voci, sagoma: false, targetless: true, soloPunto: true };
        prin.forEach(function (g) {
            if (!g.unita) return;
            const s = sec.find(function (x) { return x.unita && String(x.unita.id) === String(g.unita.id); });
            if (g.ammesso || (s && s.ammesso)) voci.push({ unita: g.unita, principale: !!g.ammesso, secondario: !!(sagoma && s && s.ammesso), motivo: g.motivo });
        });
        return { voci: voci, sagoma: sagoma, targetless: targetless, soloPunto: false };
    }

    window.renderBersagliSpeculativo = function () {
        const M = motore(); if (!M) return;
        const c = document.getElementById('enemy-target-buttons'); if (!c) return;
        window.MotoreN5.azzeraNote('step-wait-aro');
        const G = giudiziSpeculativo(M);
        window.pendingTargets = window.pendingTargets || [];
        const scelti = window.pendingTargets.map(function (t) { return String(t.id); });
        let html = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `BERSAGLI DEL FUOCO SPECULATIVO`, nota: `${G.sagoma ? 'Il primo che tocchi è il <b>Bersaglio Principale</b>. Poi tocca chi altro sta sotto la Sagoma: un Marker è ammesso, ma non come Principale.' : 'Un solo bersaglio: quest\'arma non ha una Sagoma Circolare.'}` })}`;
        // Il PUNTO del tavolo, per le armi Targetless.
        if (G.targetless) {
            const preso = scelti.indexOf('punto') === 0;
            html += `<button type="button" class="huge-btn bersaglio-punto" style="width:100%; min-height:70px; margin-bottom:10px; background:${preso ? 'var(--mn-attenzione-fondo,#554400)' : 'var(--mn-fondo-tasto,#111111)'}; border-color:${COL.bordo}; color:var(--mn-testo,#ffffff);" onclick="window.toccaBersaglioSpeculativo('punto')">
                📍 PUNTO SUL TAVOLO${preso ? ' <span style="color:var(--mn-ordine-testo,#ff66ff); font-size:var(--fs-m);">[ SCELTO ]</span>' : ''}
                <span class="desc-tasto">${G.soloPunto ? 'Arma Targetless: si lancia su un punto, non su un nemico. Se il tiro riesce, il segnalino si piazza lì.' : 'Arma Targetless: puoi lanciarla su un punto invece che su un nemico.'}</span></button>`;
        }
        G.voci.forEach(function (v) {
            const k = scelti.indexOf(String(v.unita.id));
            const etichetta = k === 0 ? ' <span style="color:var(--mn-ordine-testo,#ff66ff); font-size:var(--fs-m);">[ PRINCIPALE ]</span>'
                            : (k > 0 ? ' <span style="color:var(--mn-ordine-testo,#cc99cc); font-size:var(--fs-m);">[ SOTTO LA SAGOMA ]</span>'
                            : (!v.principale ? ' <span style="color:var(--mn-spento,#888888); font-size:var(--fs-s);">(solo sotto la Sagoma)</span>' : ''));
            const id = String(v.unita.id).replace(/'/g, "\\'");
            if (typeof window.rigaUnitaConFoto === 'function') {
                html += window.rigaUnitaConFoto(v.unita, { fazione: 'NEMICA', scelta: k >= 0, opacita: '1',
                    dopoNome: ` <span style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s); font-weight:normal;">[${v.unita.tipo || 'LI'}]</span>`,
                    // 28 ottobre (GR-E14): l'etichetta nella fascia bassa, non nel nome (si troncava).
                    etichette: etichetta,
                    attributi: `onclick="window.toccaBersaglioSpeculativo('${id}')"` });
            } else {
                html += `<button type="button" class="huge-btn" style="width:100%; ${k >= 0 ? 'background:var(--mn-attenzione-fondo,#554400);' : ''}" onclick="window.toccaBersaglioSpeculativo('${id}')">${M.nomeUnita(v.unita)}${etichetta}</button>`;
            }
        });
        c.innerHTML = html;
    };

    window.toccaBersaglioSpeculativo = function (id) {
        const M = motore(); if (!M) return;
        const G = giudiziSpeculativo(M);
        window.pendingTargets = window.pendingTargets || [];
        if (String(id) === 'punto') {
            if (!G.targetless) return;
            const giaPreso = window.pendingTargets.length && window.pendingTargets[0].punto;
            window.pendingTargets = giaPreso ? [] : [M.bersaglioPunto()];
            return window.renderBersagliSpeculativo();
        }
        // Un nemico dopo il punto: il punto esce (il lancio e` uno).
        if (window.pendingTargets.length && window.pendingTargets[0].punto) window.pendingTargets = [];
        const v = G.voci.find(function (x) { return String(x.unita.id) === String(id); });
        if (!v) return;
        const k = window.pendingTargets.findIndex(function (t) { return String(t.id) === String(id); });
        if (k >= 0) {
            window.pendingTargets.splice(k, 1);
            // Tolto il Principale: diventa Principale il primo rimasto che
            // puo` esserlo. Se nessuno puo`, la scelta riparte da capo.
            if (k === 0 && window.pendingTargets.length) {
                const j = window.pendingTargets.findIndex(function (t) {
                    const w = G.voci.find(function (x) { return String(x.unita.id) === String(t.id); });
                    return w && w.principale;
                });
                if (j < 0) {
                    alert('⚠️ Nessuno dei bersagli rimasti può essere il Bersaglio Principale (' +
                          window.pendingTargets.map(function (t) { return M.nomeUnita(t); }).join(', ') + '). Scegli di nuovo, dal Principale.');
                    window.pendingTargets = [];
                } else if (j > 0) {
                    window.pendingTargets.unshift(window.pendingTargets.splice(j, 1)[0]);
                }
            }
        } else if (!window.pendingTargets.length) {
            if (!v.principale) {
                alert('⛔ ' + M.nomeUnita(v.unita) + ' non può essere il Bersaglio Principale' + (v.motivo ? ':\n' + v.motivo : '.') +
                      '\n\nScegli prima il Principale; poi potrai toccarlo come bersaglio sotto la Sagoma.');
                return;
            }
            window.pendingTargets.push(v.unita);
        } else if (!G.sagoma) {
            window.pendingTargets = [v.unita];                // un solo bersaglio: si sostituisce
        } else if (!v.secondario) {
            alert('⛔ ' + M.nomeUnita(v.unita) + ' non può stare sotto la Sagoma come bersaglio secondario.');
            return;
        } else {
            window.pendingTargets.push(v.unita);
        }
        window.renderBersagliSpeculativo();
    };

    // ==============================================================
    // 3. MODIFICATORI (solo la gittata: il resto è fisso)
    // ==============================================================
    window.preparaModificatoriSpeculativo = function () {
        const M = motore(); if (!M) return;
        // Si entra nella schermata: le domande del Drop Bear ripartono da
        // NON RISPOSTO. Un punto nuovo e` una domanda nuova.
        window.dropBearRisposte = {};
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nIl Fuoco Speculativo richiede comunque un Bersaglio Principale valido.');
            return window.setupTargetSelectionSpeculativo();
        }

        const arma = M.profiloArma(window.currentOrder.weapon);
        // Il punto del tavolo passa per confirmMultiAro, che tiene solo id e
        // nome: qui torna il segno `punto`, e niente secondari.
        if (String(window.combatTargets[0].id) === 'punto' && M.bersaglioPunto) {
            window.combatTargets = [Object.assign(window.combatTargets[0], M.bersaglioPunto())];
        }

        // Burst 1 per regolamento, e un solo Bersaglio Principale: il primo.
        // Gli altri sono i secondari sotto la Sagoma, scelti nella pagina dei
        // bersagli: gittata, munizione e dado sono quelli del Principale.
        const tgt = window.combatTargets[0];
        tgt.burst = 1;
        tgt.cover = false;
        if (typeof tgt.rangeIndex !== 'number' || tgt.rangeIndex < 0 || tgt.rangeIndex >= arma.bands.length) tgt.rangeIndex = 0;
        tgt.rangeMod = arma.bands.length ? arma.bands[tgt.rangeIndex].mod : 0;
        if (!tgt.ammo || arma.ammoOpzioni.indexOf(tgt.ammo) < 0) tgt.ammo = arma.ammoOpzioni[0];
        const multi = window.combatTargets.length > 1;
        if (multi) tgt.ruolo = 'principale';
        window.combatTargets.slice(1).forEach(function (t) {
            t.burst = 1; t.cover = false; t.ruolo = 'secondario';
            t.rangeIndex = tgt.rangeIndex; t.rangeMod = tgt.rangeMod; t.ammo = tgt.ammo;
            if (!t.terrain) t.terrain = tgt.terrain || 'NESSUNO';
        });

        window.renderSpeculativo();
        window.goToStep('step-modifiers');
    };

    window.renderSpeculativo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const tgt = window.combatTargets[0];
        const regole = M.regoleSpeculativo(arma, { rangeIndex: tgt.rangeIndex });
        // 28 ottobre (Paolo): le spiegazioni nella ⓘ (o sotto il tasto), non a schermo.
        M.azzeraNote('step-modifiers');
        M.nota('step-modifiers', 'Cosa NON si applica a questo tiro', 'Mimetismo del bersaglio: ignorato. Copertura: ignorata (né il -6 al tiro, né il +3 alla salvezza del bersaglio). LoF: non serve, bersaglio e punto d\'impatto si scelgono senza vederli.', { tipo: 'mod' });
        M.nota('step-modifiers', 'Si applica invece', 'La gittata, che nell\'Attacco Intuitivo non conta.', { tipo: 'mod' });
        if (regole.noteSagoma) M.nota('step-modifiers', 'Sagoma Circolare', regole.noteSagoma, { tipo: 'regole' });

        const valoreBase = unita[String(regole.attributo).toLowerCase()] || 0;
        const domDB = window.statoDomandeDropBear();

        // 28 ottobre (Paolo): la barra e` del motore (M.barraGittata), coi
        // numeri sui confini; il FUORI GITTATA e` il segmento in coda.
        const barra = M.barraGittata(arma.bands, { indice: tgt.rangeIndex, tocco: (i) => `window.setTargetRangeSpeculativo(${i})`,
            fuori: 'window.toggleFuoriGittataSpeculativo()', fuoriAttivo: !!tgt.fuoriGittata, stile: '' });

        const dettaglio = regole.voci.map(v =>
            `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b>
             </div>`).join('');

        document.getElementById('targets-allocation-container').innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `FUOCO SPECULATIVO` })}

            <div style="background:var(--mn-ordine-riquadro,#220022); border:1px solid ${COL.bordo}; padding:15px; border-radius:5px; margin-bottom:20px;">
                <div style="text-align:center; margin-bottom:12px;">
                    <b style="color:var(--mn-ordine-testo,#ff33ff); font-size:var(--fs-m);">TIRO SU ${regole.attributo} ${valoreBase}</b>
                    ${regole.noteAttributo ? `<br><span style="color:var(--mn-ordine-testo,#cc99cc); font-size:var(--fs-xs);">${regole.noteAttributo}</span>` : ''}
                </div>
                <div style="border-top:1px solid var(--mn-ordine-tenue,#553355); padding-top:10px; font-size:var(--fs-s);">
                    ${dettaglio}
                    <div style="display:flex; justify-content:space-between; border-top:1px solid var(--mn-ordine-tenue,#553355); margin-top:8px; padding-top:8px;">
                        <b style="color:var(--mn-testo,#ffffff);">MOD totale</b>
                        <b style="color:${regole.modTotale >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'}; font-size:var(--fs-m);">${regole.modTotale > 0 ? '+' + regole.modTotale : regole.modTotale}</b>
                    </div>
                </div>
            </div>

            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:15px; background:rgba(204,0,255,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:var(--mn-testo,#ffffff); font-size:var(--fs-l);">🎯 ${tgt.name}</b>
                    <div style="font-size:var(--fs-l); font-weight:bold; color:${COL.bordo};">1 B</div>
                </div>
                <div style="text-align:center; color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin-bottom:5px;">Seleziona la gittata (in linea retta fino al punto d'impatto):</div>
                ${barra}
                ${M.domandaAlleatiInMischia ? M.domandaAlleatiInMischia(tgt, 0, 'window.setAlleatiInMischiaSpeculativo') : ''}
            </div>

            ${window.htmlSecondariSpeculativo()}

            ${domDB ? `<div style="margin-top:14px;">
                <div style="color:var(--mn-ordine-testo,#cc99cc); font-size:var(--fs-s); margin-bottom:8px;">Drop Bear: il punto d'impatto rispetta la restrizione di piazzamento. Il calcolatore non ha la mappa.</div>` +
                domDB.domande.map(function (d) {
                    const r = (window.dropBearRisposte || {})[d.id];
                    return `<div style="background:var(--mn-ordine-riquadro,#1a1020); border:1px solid var(--mn-ordine-tenue,#442255); padding:14px; border-radius:5px; margin-bottom:10px;">
                        <div style="color:var(--mn-testo,#ffffff); font-size:var(--fs-m); margin-bottom:10px;">${d.testo}</div>
                        <div style="display:flex; gap:8px;">
                            <button class="huge-btn" style="flex:1; min-height:48px; ${r === true ? 'background:var(--mn-attenzione-fondo,#554400); border-color:var(--mn-acceso,#ffaa33);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                                onclick="window.rispondiDropBear('${d.id}', true)">SÌ</button>
                            <button class="huge-btn" style="flex:1; min-height:48px; ${r === false ? 'background:var(--mn-attenzione-fondo,#554400); border-color:var(--mn-acceso,#ffaa33);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                                onclick="window.rispondiDropBear('${d.id}', false)">NO</button>
                        </div>
                    </div>`;
                }).join('') +
                (domDB.esito === 'BLOCCATA' ? `<div style="padding:10px; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); border-radius:4px; color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">⛔ ${domDB.motivo} Scegli un altro punto.</div>` : '') +
            `</div>` : ''}`;

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            // Il tasto diventa IDLE se il Principale e` fuori gittata.
            M.tastoConRequisiti(nuovo, M.requisitiDichiarati([tgt], ['gittata']),
                (domDB && domDB.esito === 'NON_RISPOSTO') ? 'RISPONDI ALLE DOMANDE'
                    : (domDB && domDB.esito === 'BLOCCATA') ? 'PUNTO NON AMMESSO'
                    : 'LANCIA ATTACCO SPECULATIVO',
                function () { window.eseguiCalcoloSpeculativo(); });
        }
    };

    // Le domande del Drop Bear in modo BS, valutate dal motore. null se
    // l'arma non e` un Drop Bear in modo BS: nessuna domanda.
    window.eDropBearBSCorrente = function () {
        const M = motore(); if (!M || !window.currentOrder) return false;
        const arma = M.profiloArma(window.currentOrder.weapon);
        return /DROP BEARS \(BS MODE\)/i.test(String((arma && arma.nome) || ''));
    };
    window.statoDomandeDropBear = function () {
        const M = motore(); if (!M || !window.eDropBearBSCorrente()) return null;
        const R = window.dropBearRisposte || {};
        const domande = M.domandeDropBearBS(R);
        return Object.assign({ domande: domande }, M.valutaDomande(domande, R));
    };
    window.rispondiDropBear = function (id, valore) {
        window.dropBearRisposte = window.dropBearRisposte || {};
        window.dropBearRisposte[id] = valore;
        // Cambiare la prima risposta riapre la seconda.
        if (id === 'markerNellArea') delete window.dropBearRisposte.nemicoScopertoNellArea;
        window.renderSpeculativo();
    };

    window.setTargetRangeSpeculativo = function (rangeIdx) {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.currentOrder.weapon);
        // La gittata del Principale vale per tutti: la Sagoma e` una sola.
        window.combatTargets.forEach(function (t) {
            t.rangeIndex = rangeIdx;
            t.rangeMod = arma.bands[rangeIdx] ? arma.bands[rangeIdx].mod : 0;
            t.fuoriGittata = false;                       // scelta una banda: in gittata
        });
        window.renderSpeculativo();
    };
    // FUORI: lo stesso requisito 'gittata' di prima (M.invertiRequisito sul
    // Principale), toccato dalla barra.
    window.toggleFuoriGittataSpeculativo = function () { window.toggleRequisitoSpeculativo(0, 'gittata'); };

    // ==============================================================
    // 3-BIS. BERSAGLI SECONDARI SOTTO LA SAGOMA
    // --------------------------------------------------------------
    // Con un'arma a Sagoma Circolare il centro si puo` mettere altrove,
    // purche` il Principale stia dentro l'area (righe 3914-3919): chi
    // altro sta sotto la Sagoma e` un bersaglio SECONDARIO. Un Marker non
    // puo` essere il Principale (righe 13609-13610, 14207-14208) ma come
    // secondario SI`. Fino alla 2026-10-06.4 la schermata teneva un solo
    // bersaglio: il motore ammetteva il secondario e non c'era modo di
    // dichiararlo. Chi e` ammesso lo decide M.bersagliValidi col ruolo
    // 'secondario'; l'app non ha la mappa, quindi chi sta sotto la Sagoma
    // lo dice il giocatore.
    // ==============================================================
    function candidatiSecondari(M) {
        const arma = M.profiloArma(window.currentOrder.weapon);
        const tpl = arma ? M.regoleTemplate(arma) : null;
        if (!tpl || tpl.forma !== 'Circular') return null;      // null: l'arma non ha una Sagoma Circolare
        const unita = window.coordUnits[window.coordIndex];
        const primo = window.combatTargets[0];
        return M.bersagliValidi(M.AZIONI.SPECULATIVO, M.rosterNemico(), { attaccante: unita, ruolo: 'secondario' })
            .filter(function (g) { return g.ammesso && g.unita && String(g.unita.id) !== String(primo.id); });
    }

    // 15 ottobre (Paolo): i secondari si scelgono nella pagina dei bersagli.
    // Qui resta solo il promemoria di chi c'e` sotto la Sagoma. La vecchia
    // scelta (htmlSceltaSecondariSpeculativo) resta per chi la chiama.
    window.htmlSecondariSpeculativo = function () {
        const M = motore(); if (!M) return '';
        const sec = (window.combatTargets || []).slice(1);
        if (!sec.length) return '';
        return `<div style="background:var(--mn-ordine-riquadro,#1a1020); border:1px solid var(--mn-ordine-tenue,#553355); padding:10px 12px; border-radius:5px; margin-bottom:15px; color:var(--mn-ordine-testo,#cc99cc); font-size:var(--fs-s);">
            <b>ANCHE SOTTO LA SAGOMA:</b> ${sec.map(function (t) { return t.name || M.nomeUnita(t); }).join(', ')}
            <div style="color:var(--mn-spento,#888888); font-size:var(--fs-xs); margin-top:4px;">Si cambiano dalla pagina dei bersagli. Fanno solo il proprio Tiro Salvezza.</div></div>`;
    };

    window.htmlSceltaSecondariSpeculativo = function () {
        const M = motore(); if (!M) return '';
        const cand = candidatiSecondari(M);
        if (cand === null || cand.length === 0) return '';
        const scelti = window.combatTargets.slice(1).map(function (t) { return String(t.id); });
        return `<div style="background:var(--mn-ordine-riquadro,#1a1020); border:1px solid var(--mn-ordine-tenue,#553355); padding:12px; border-radius:5px; margin-bottom:15px;">
            <div style="color:var(--mn-ordine-testo,#cc99cc); font-size:var(--fs-s); margin-bottom:8px;"><b>ANCHE SOTTO LA SAGOMA</b> — bersagli secondari.
                Il calcolatore non ha la mappa: tocca chi sta dentro l'area. Un Marker qui è ammesso.</div>` +
            cand.map(function (g) {
                const si = scelti.indexOf(String(g.unita.id)) >= 0;
                // La riga con la foto la disegna la pagina (window.rigaUnitaConFoto);
                // dove non c'e` resta il bottone semplice.
                // Un secondario scelto e Ingaggiato ha la sua domanda sulla
                // mischia: la Sagoma e` una, ma la mischia e` di ciascuno.
                const k = window.combatTargets.findIndex(function (t, j) { return j > 0 && String(t.id) === String(g.unita.id); });
                const mischia = (si && k > 0 && M.domandaAlleatiInMischia) ? M.domandaAlleatiInMischia(window.combatTargets[k], k, 'window.setAlleatiInMischiaSpeculativo') : '';
                if (typeof window.rigaUnitaConFoto === 'function') {
                    return window.rigaUnitaConFoto(g.unita, { attributi: `onclick="window.toggleSecondarioSpeculativo('${g.unita.id}')"`,
                        fazione: 'NEMICA', scelta: si, dopoNome: si ? ' ☑' : ' ☐' }) + mischia;
                }
                return `<button type="button" onclick="window.toggleSecondarioSpeculativo('${g.unita.id}')"
                    style="width:100%; padding:10px; margin-bottom:6px; font-size:var(--fs-s); font-weight:bold; border-radius:5px; cursor:pointer; text-align:left;
                           background:${si ? 'var(--mn-attenzione-fondo,#554400)' : 'var(--mn-fondo-tasto,#111111)'}; color:${si ? 'var(--mn-acceso,#ffaa33)' : 'var(--mn-spento,#888888)'}; border:2px solid ${si ? 'var(--mn-acceso,#ffaa33)' : 'var(--mn-bordo-spento,#555555)'};">
                    ${si ? '☑' : '☐'} ${M.nomeUnita(g.unita)}</button>` + mischia;
            }).join('') + `</div>`;
    };

    window.setAlleatiInMischiaSpeculativo = function (i, n) {
        const M = motore(); if (!M) return;
        if (M.impostaAlleatiInMischia(window.combatTargets && window.combatTargets[i], n)) window.renderSpeculativo();
    };

    window.toggleSecondarioSpeculativo = function (id) {
        const M = motore(); if (!M) return;
        const cand = candidatiSecondari(M) || [];
        const i = window.combatTargets.findIndex(function (t, k) { return k > 0 && String(t.id) === String(id); });
        if (i > 0) window.combatTargets.splice(i, 1);
        else {
            const g = cand.find(function (x) { return String(x.unita.id) === String(id); });
            if (!g) return;                                   // non ammesso: non si aggiunge
            const primo = window.combatTargets[0];
            // Gittata, munizione e dado sono quelli del Principale: la
            // Sagoma e` una sola.
            window.combatTargets.push({ id: g.unita.id, name: M.nomeUnita(g.unita), burst: 1, cover: false,
                rangeIndex: primo.rangeIndex, rangeMod: primo.rangeMod, ammo: primo.ammo,
                terrain: primo.terrain || 'NESSUNO', ruolo: 'secondario' });
        }
        window.combatTargets[0].ruolo = 'principale';
        window.renderSpeculativo();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    window.toggleRequisitoSpeculativo = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.renderSpeculativo();
    };

    window.eseguiCalcoloSpeculativo = function () {
        const M = motore(); if (!M) return;
        const req = M.requisitiDichiarati([window.combatTargets[0]], ['gittata']);
        if (req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];
        const arma = Object.assign({}, M.profiloArma(window.currentOrder.weapon), { burst: 1 });

        // DROP BEAR IN MODO BS: il PUNTO va scelto rispettando la domanda di
        // piazzamento — prima del tiro, non dopo (wiki "Drop Bears", N5.3).
        // Le domande stanno a schermo (renderSpeculativo) e le valuta il
        // motore: tre esiti, NON RISPOSTO non esegue. Prima erano due
        // window.confirm, dove chiudere la finestra valeva "no".
        const dom = window.statoDomandeDropBear();
        if (dom && dom.esito === 'NON_RISPOSTO') {
            return alert('⚠️ Rispondi alle domande sul punto d\'impatto del Drop Bear prima di lanciare.');
        }
        if (dom && dom.esito === 'BLOCCATA') {
            return alert('⛔ Punto non ammesso per il Drop Bear.\n\n' + (dom.motivo || '') + '\n\nScegli un altro punto.');
        }
        const regole = M.regoleSpeculativo(arma, { rangeIndex: window.combatTargets[0].rangeIndex });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.SPECULATIVO,
            arma: arma,
            bersagli: window.combatTargets,
            burstDisponibile: 1,
            // Esplicitiamo all'Hub cosa vale e cosa no, invece del solo flag -6.
            regole: {
                attributo: regole.attributo,
                malusFisso: regole.malusFisso,
                modGittata: regole.modGittata,
                modTotale: regole.modTotale,
                ignoraMimetismo: true,
                ignoraCopertura: true,
                coperturaAnnullaSalvezza: regole.coperturaAnnullaSalvezza,
                criticoSoloSulPrincipale: regole.criticoSoloSulPrincipale
            }
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.startUnitSpeculativoLoop();
        }

        // Copia PRIMA dell'invio: l'uscita dopo l'invio (app.html) azzera
        // coordPayloads e currentOrder.
        const inviati = window.coordPayloads.slice();
        const ordineIdInviato = window.currentOrder && window.currentOrder.id;
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) {
            window.coordIndex--;
            window.coordPayloads.pop();
            return;
        }

        // DROP BEAR IN MODO BS: il Mine Token e` l'effetto del SUCCESSO del
        // tiro, non del lancio (wiki "Drop Bears": "If you pass the Roll..." —
        // chat REGOLE, 28 settembre). I dadi si tirano al tavolo: dopo l'invio
        // il giocatore dice com'e` andata. L'uso resta speso in ogni caso
        // (riga 14999): un lancio fallito costa un uso e non lascia niente.
        // Vale per tutta la famiglia dei lanci con segnalino: Drop Bear in modo
        // BS, Pitcher (Ripetitore), Disco Baller (Disco Ball).
        const lanciati = inviati.filter(p => M.lancioConSegnalino(p.arma));
        window._dropBearInSospeso = lanciati.length
            ? { lanci: lanciati.map(p => ({ unita: p.attaccante, arma: p.arma })), ordineId: ordineIdInviato,
                nomeArma: String(lanciati[0].arma.nome).replace(/ \(BS Mode\)/i, '') }
            : null;

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(204,0,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">ATTACCO INVIATO ALL'HUB</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">Calcolo Speculativo in corso...</p>
                </div>` + (window._dropBearInSospeso ? `
                <div id="dropbear-esito" style="text-align:center; margin-top:12px; padding:14px; border:1px dashed ${COL.bordo};">
                    <p style="margin:0 0 10px;">🎯 Il tiro del ${window._dropBearInSospeso.nomeArma} è <b>riuscito</b>?</p>
                    <button onclick="window.esitoDropBearBS(true)" style="padding:10px 18px; margin:4px;">SÌ, RIUSCITO — piazza il segnalino</button>
                    <button onclick="window.esitoDropBearBS(false)" style="padding:10px 18px; margin:4px;">NO, FALLITO</button>
                </div>` : '');
            calcDiv.style.display = 'block';
        }
        // 22 ottobre (SPEC-06): nell'app il riquadro qui sopra non si vedeva.
        // Subito dopo l'invio l'app torna al radar e svuota calc-result
        // (app.html, agganciaUscitaDopoInvio), quindi la domanda spariva e il
        // Ripetitore del Pitcher (o il Drop Bear, la Disco Ball) non nasceva
        // mai. Ora la domanda si fa con una finestra, che aspetta il tiro al
        // tavolo. Il riquadro resta per chi carica il modulo da solo.
        if (window._dropBearInSospeso && typeof window.confirm === 'function') {
            const sosp = window._dropBearInSospeso;
            // 30 ottobre (P5): la domanda nel riquadro dell'app (M.chiediSiNo), non nella
            // finestra del browser. Con una prova al posto del confirm risponde lei, subito.
            const dopoDropBear = function (si) {
                const esito = window.esitoDropBearBS(!!si);
                if (typeof window.alert === 'function') {
                    window.alert(si ? ('✅ ' + sosp.nomeArma + ': segnalino piazzato' + (esito && esito.piazzati ? '' : ' (nessun segnalino creato: controlla il roster)') + '.')
                                    : ('❌ ' + sosp.nomeArma + ': tiro fallito, nessun segnalino. L\'uso è comunque speso.'));
                }
            };
            const domandaDB = 'Tira al tavolo.\n\nIl tiro è RIUSCITO?\n\nSÌ = piazza il segnalino dove è caduto.\nNO = fallito (l\'uso è comunque speso).';
            if (typeof M.chiediSiNo === 'function') M.chiediSiNo(domandaDB, { titolo: '🎯 ' + sosp.nomeArma }, dopoDropBear);
            else dopoDropBear(window.confirm('🎯 ' + sosp.nomeArma + ': ' + domandaDB));
        }
    };

    // L'esito del tiro del Drop Bear in modo BS, detto dal giocatore.
    //   riuscito -> il Mine Token nasce nel roster (senza un secondo uso) e
    //               l'Hub lo riceve; non detona in questo stesso Ordine.
    //   fallito  -> nessun segnalino; l'uso resta speso, e lo si dice.
    window.esitoDropBearBS = function (riuscito) {
        const M = motore(); const sosp = window._dropBearInSospeso;
        if (!M || !sosp) return;
        window._dropBearInSospeso = null;
        const box = document.getElementById('dropbear-esito');
        if (!riuscito) {
            if (box) box.innerHTML = '<p style="margin:0;">Tiro fallito: <b>nessun segnalino</b>. L\'uso del ' + sosp.nomeArma + ' è comunque speso (riga 14999).</p>';
            return { piazzati: 0 };
        }
        const nomi = [], note = [];
        sosp.lanci.forEach(function (l) {
            const e = M.segnalinoDaLancio(l.unita, l.arma, { ordineId: sosp.ordineId });
            if (e.token && Array.isArray(window.roster)) { window.roster.push(e.token); nomi.push(e.token.nome); note.push.apply(note, (e.note || []).slice(1)); }
        });
        if (nomi.length && typeof window.inviaSchieramentoAllHub === 'function') {
            window.inviaSchieramentoAllHub(document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA', {
                roster: window.roster, strutture: window.activeStructures || [],
                terreni: window.activeTerrains || [], motivo: 'AGGIORNAMENTO'
            });
        }
        if (box) box.innerHTML = '<p style="margin:0;">✅ ' + nomi.join(', ') + ' piazzato.</p>' +
            note.filter((x, i) => note.indexOf(x) === i).map(x => '<p style="margin:6px 0 0; font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">' + x + '</p>').join('');
        return { piazzati: nomi.length };
    };

    console.log('☄️ ordine_fuoco_speculativo.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_fuoco_speculativo.js', versione: '2026-10-31.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();

/* =====================================================================
   eps-sifflet.js — coup de sifflet + vibration pour les chronos des applis élèves (v1.0, 22/11/2026)
   ORIGINAL : mon-EPS/atelier/applis-eleves/eps-sifflet.js — ne pas modifier une copie,
   modifier ici puis lancer synchroniser.py.

   Règle commune à toutes les applis :
     - départ d'un effort (course, série, fraction)  : 1 coup de sifflet + 1 vibration ;
     - mi-course (efforts à durée fixe)               : 1 coup + 1 vibration ;
     - fin d'un exercice chronométré                  : 3 coups + vibration longue ;
     - fin d'une récupération (on repart)             : 1 coup + 1 vibration.
   Au premier chrono, l'appareil demande : « Voulez-vous utiliser le son du sifflet pour démarrer
   et finir les exercices ? ». Réponse gardée sur l'appareil (clé eps_sifflet, commune à toutes
   les applis), modifiable à tout moment avec le bouton « 🔔 Sifflet ».
   Si la réponse est « non », chaque appli garde ses bips habituels.
   Le réglage commun eps_sound_mode est respecté : « muet » = rien, « vibreur » = vibration seule.
   Le son est fabriqué par l'appli (aucun fichier à télécharger) : il marche hors ligne.
   Limites : pas de vibration sur iPhone / iPad (bloquée par Apple), ni sur la plupart des tablettes ;
   sur iPhone, le bouton silencieux coupe aussi le son.

   API : EPSSifflet.depart() .mi() .fin() .reprise()  → true si le sifflet a joué (sinon l'appli bipe comme avant)
         EPSSifflet.actif()  EPSSifflet.demander(suite)  EPSSifflet.bouton()  EPSSifflet.regler('oui'|'non')
   ===================================================================== */
(function(root){
'use strict';
const CLE = 'eps_sifflet';
let ac = null;
function lire(){try{const v = localStorage.getItem(CLE);return v === 'oui' || v === 'non' ? v : null}catch(e){return null}}
function regler(v){try{localStorage.setItem(CLE, v)}catch(e){}majBoutons()}
function mode(){try{return localStorage.getItem('eps_sound_mode') || 'sound'}catch(e){return 'sound'}}
function contexte(){try{ac = ac || new (root.AudioContext || root.webkitAudioContext)();if(ac.state === 'suspended')ac.resume()}catch(e){ac = null}return ac}
/* un coup de sifflet « à roulette » : son aigu (≈ 2,9 kHz) qui roule (≈ 28 Hz) + un peu de souffle */
function coup(t0, dur){
  const c = contexte();if(!c)return;
  const t = c.currentTime + t0, o = c.createOscillator(), lfo = c.createOscillator(), prof = c.createGain(), g = c.createGain();
  o.type = 'sine';o.frequency.value = 2900;lfo.type = 'sine';lfo.frequency.value = 28;prof.gain.value = 180;
  lfo.connect(prof);prof.connect(o.frequency);o.connect(g);g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, t);g.gain.exponentialRampToValueAtTime(0.45, t + 0.015);g.gain.setValueAtTime(0.45, t + dur - 0.05);g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);lfo.start(t);o.stop(t + dur + 0.02);lfo.stop(t + dur + 0.02);
  try{const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);for(let i = 0;i < n;i++)d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), gn = c.createGain();s.buffer = b;f.type = 'bandpass';f.frequency.value = 3000;f.Q.value = 1.2;
    gn.gain.setValueAtTime(0.0001, t);gn.gain.exponentialRampToValueAtTime(0.06, t + 0.02);gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f);f.connect(gn);gn.connect(c.destination);s.start(t);s.stop(t + dur)}catch(e){}
}
function vibrer(p){try{root.navigator.vibrate && root.navigator.vibrate(p)}catch(e){}}
function jouer(coups, vib){
  if(lire() !== 'oui')return false;
  const m = mode();if(m === 'silent')return true;
  vibrer(vib);if(m === 'vibrate')return true;
  let t = 0;coups.forEach(d => {coup(t, d);t += d + 0.18});return true;
}
const depart = () => jouer([0.45], 300);
const mi = () => jouer([0.45], 300);
const reprise = () => jouer([0.45], 300);
const fin = () => jouer([0.32, 0.32, 0.75], [400, 150, 400, 150, 700]);

/* question posée une seule fois par appareil, au premier chrono */
function demander(suite){
  if(lire() !== null){contexte();suite && suite();return}
  const v = document.createElement('div');v.className = 'eps-sifflet-voile';v.setAttribute('role', 'dialog');v.setAttribute('aria-modal', 'true');
  v.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px';
  v.innerHTML = `<div style="background:#fff;color:#1c2128;border-radius:16px;max-width:420px;width:100%;padding:20px;font:18px/1.35 'Atkinson Hyperlegible',system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.3)">
    <p style="font-size:40px;margin:0;text-align:center">🔔</p>
    <p style="font-weight:800;font-size:20px;margin:6px 0 10px;text-align:center">Voulez-vous utiliser le son du sifflet pour démarrer et finir les exercices ?</p>
    <p style="font-size:16px;color:#5b6470;margin:0 0 14px">1 coup au départ et à mi-course, 3 coups à la fin, avec vibration (téléphones Android). Vous pourrez changer d'avis avec le bouton « 🔔 Sifflet ».</p>
    <button type="button" data-rep="oui" style="width:100%;min-height:56px;border-radius:14px;border:0;background:#15803d;color:#fff;font:800 19px system-ui,sans-serif;margin-bottom:8px">🔔 Oui, le sifflet</button>
    <button type="button" data-rep="non" style="width:100%;min-height:56px;border-radius:14px;border:2px solid #dde2e8;background:#fff;color:#1c2128;font:700 18px system-ui,sans-serif">Non, les bips habituels</button></div>`;
  v.addEventListener('click', ev => {const b = ev.target.closest('[data-rep]');if(!b)return;regler(b.dataset.rep);contexte();v.remove();if(b.dataset.rep === 'oui')depart();suite && suite()});
  document.body.appendChild(v);
}
/* bouton à placer dans un écran de chrono : il bascule oui / non sans recharger l'écran */
const txt = () => lire() === 'oui' ? '🔔 Sifflet : oui' : '🔕 Sifflet : non';
function bouton(){return `<button type="button" class="eps-sifflet-bt" data-eps-sifflet aria-pressed="${lire() === 'oui'}" style="min-height:48px;padding:0 14px;border-radius:24px;border:2px solid currentColor;background:transparent;color:inherit;font:700 16px system-ui,sans-serif;cursor:pointer">${txt()}</button>`}
function majBoutons(){document.querySelectorAll('[data-eps-sifflet]').forEach(b => {b.textContent = txt();b.setAttribute('aria-pressed', String(lire() === 'oui'))})}
document.addEventListener('click', ev => {const b = ev.target.closest && ev.target.closest('[data-eps-sifflet]');if(!b)return;ev.preventDefault();ev.stopPropagation();
  regler(lire() === 'oui' ? 'non' : 'oui');contexte();if(lire() === 'oui')depart()}, true);
/* iPhone : le son n'est autorisé qu'après un premier toucher */
document.addEventListener('pointerdown', function deb(){contexte();document.removeEventListener('pointerdown', deb, true)}, true);

root.EPSSifflet = {depart, mi, fin, reprise, actif:() => lire() === 'oui', choix:lire, regler, demander, bouton};
})(window);

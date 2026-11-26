/* =====================================================================
   eps-seances.js — sélecteur de séance des carnets élèves : bouton compact « piste » (v1, 26/11/2026)
   Une piste ovale stylisée ; un point jaune (le coureur) placé selon la séance choisie :
     position = rang de la séance / nombre de séances (S1 en haut à gauche, sens des aiguilles d'une montre).
   La position ne dépend QUE de la séance choisie et du nombre total : jamais du nombre d'appuis.
   Changement de séance : le point glisse le long de la piste (en avant ou en arrière), sans couper.
   « Réduire les animations » du téléphone : le point est placé directement.

   API :
     EPSSeances.bouton(el, {cle, rang, total, texte})   remplit le bouton (rang : 0 = S1)
     EPSSeances.piste({rang, seances:[{id, n, etat}], centre, attr})   grande piste (fenêtre « Changer de séance »)
       → chaque séance est un repère cliquable (par défaut data-sess="id" ; attr(s) donne d'autres attributs,
         ex. s => `data-act="seance" data-v="${s.n}"`), la séance choisie porte le coureur.
       etat : sent / fait (vert), wip / resend (ambre)
   ===================================================================== */
(function(root){
'use strict';
if(root.EPSSeances)return;
const ETAT = new Map();   // cle → {t affiché, cible, raf}
const bouge = () => !(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* piste « stade » dans une boîte W × H : deux lignes droites et deux virages */
function stade(W, H, m){
  const r = H / 2 - m, x0 = m + r, L = W - 2 * m - 2 * r, haut = m, bas = H - m, cy = H / 2, P = 2 * L + 2 * Math.PI * r;
  function pt(t){   // t ∈ [0, 1[ ; 0 = début de la ligne droite du haut, à gauche
    let s = ((t % 1) + 1) % 1 * P;
    if(s < L)return [x0 + s, haut];
    s -= L;if(s < Math.PI * r){const a = -Math.PI / 2 + s / r;return [x0 + L + r * Math.cos(a), cy + r * Math.sin(a)]}
    s -= Math.PI * r;if(s < L)return [x0 + L - s, bas];
    s -= L;const a = Math.PI / 2 + s / r;return [x0 + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  const d = `M${x0},${haut}H${x0 + L}A${r},${r} 0 0 1 ${x0 + L},${bas}H${x0}A${r},${r} 0 0 1 ${x0},${haut}Z`;
  return {pt, d};
}
const pos = (rang, total) => total > 0 ? Math.max(0, Math.min(rang, total - 1)) / total : 0;
const f1 = v => Math.round(v * 10) / 10;

/* ---------- bouton compact ---------- */
const BW = 34, BH = 20, BM = 3, BS = stade(BW, BH, BM);
function peindre(el, t){
  const c = el.querySelector('.eps-se-pt'), a = el.querySelector('.eps-se-fait');if(!c)return;
  const [x, y] = BS.pt(t);c.setAttribute('cx', f1(x));c.setAttribute('cy', f1(y));
  if(a)a.setAttribute('stroke-dasharray', `${t.toFixed(4)} 1`);
}
function bouton(el, o){
  if(!el)return;
  const cle = o.cle || el.id || 'seance', cible = pos(o.rang, o.total);
  let E = ETAT.get(cle);
  el.innerHTML = `<svg class="eps-se-mini" viewBox="0 0 ${BW} ${BH}" width="${BW}" height="${BH}" aria-hidden="true">`
    + `<path d="${BS.d}" class="eps-se-voie" pathLength="1"/><path d="${BS.d}" class="eps-se-fait" pathLength="1" stroke-dasharray="0 1"/>`
    + `<circle class="eps-se-pt" r="3.6" cx="0" cy="0"/></svg><span class="eps-se-txt">${o.texte}</span>`;
  el.classList.add('eps-se');
  if(!E || !bouge()){
    if(E && E.raf)cancelAnimationFrame(E.raf);
    ETAT.set(cle, {t:cible, cible, raf:0});peindre(el, cible);return;
  }
  E.cible = cible;
  if(E.raf)cancelAnimationFrame(E.raf);
  if(Math.abs(E.t - cible) < 1e-6){peindre(el, cible);E.raf = 0;return}
  const t0 = E.t, d = cible - t0, debut = performance.now(), duree = Math.min(650, 300 + Math.abs(d) * 600);
  const pas = now => {
    const k = Math.min(1, (now - debut) / duree), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    E.t = k >= 1 ? cible : t0 + d * e;
    const b = document.getElementById(el.id) || el;   // le bouton peut avoir été redessiné entre-temps
    peindre(b, E.t);
    E.raf = k < 1 ? requestAnimationFrame(pas) : 0;
  };
  E.raf = requestAnimationFrame(pas);
}

/* ---------- grande piste (liste des séances) ---------- */
function piste(o){
  const W = 320, H = 132, M = 18, S = stade(W, H, M), n = o.seances.length, t = pos(o.rang, n);
  const reps = o.seances.map((s, k) => {const [x, y] = S.pt(pos(k, n));
    return `<g class="eps-se-rep ${s.etat || ''} ${k === o.rang ? 'ici' : ''}" ${o.attr ? o.attr(s) : `data-sess="${s.id}"`} role="button" tabindex="0" aria-label="Séance ${s.n}">`
      + `<circle cx="${f1(x)}" cy="${f1(y)}" r="13"/><text x="${f1(x)}" y="${f1(y + 4.2)}" text-anchor="middle">${String(s.n).replace(/^S/, '')}</text></g>`}).join('');
  /* le coureur se tient juste à l'extérieur du repère de la séance choisie */
  const [qx, qy] = S.pt(t), vx = qx - W / 2, vy = (qy - H / 2) * (W / H), nv = Math.hypot(vx, vy) || 1, px = qx + vx / nv * 18, py = qy + vy / nv * 18;
  return `<div class="eps-se-grande"><svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Piste des séances">`
    + `<path d="${S.d}" class="eps-se-voie" pathLength="1"/><path d="${S.d}" class="eps-se-fait" pathLength="1" stroke-dasharray="${t.toFixed(4)} 1"/>`
    + `<text x="${W / 2}" y="${H / 2 + 6}" text-anchor="middle" class="eps-se-centre">${o.centre || ''}</text>`
    + reps + `<circle class="eps-se-pt" cx="${f1(px)}" cy="${f1(py)}" r="6"/></svg></div>`;
}

/* ---------- styles (préfixe eps-se-) ---------- */
function css(){
  if(document.getElementById('eps-se-style'))return;
  const s = document.createElement('style');s.id = 'eps-se-style';
  s.textContent = '.eps-se{display:inline-flex;align-items:center;gap:5px}'
    + '.eps-se-mini{flex:none;display:block;overflow:visible}'
    + '.eps-se-voie{fill:none;stroke:currentColor;stroke-opacity:.25;stroke-width:2.8}'
    + '.eps-se-fait{fill:none;stroke:currentColor;stroke-width:2.8;stroke-linecap:round}'
    + '.eps-se-pt{fill:#facc15;stroke:#1c2128;stroke-width:1.6}'
    + '.eps-se-txt{white-space:nowrap}'
    + '.eps-se-grande{margin:4px 0 10px;color:var(--acc,var(--ligne,var(--tartan,#b91c1c)))}.eps-se-grande svg{display:block;width:100%;max-width:420px;height:auto;margin:0 auto;overflow:visible}'
    + '.eps-se-grande .eps-se-voie,.eps-se-grande .eps-se-fait{stroke-width:7}'
    + '.eps-se-centre{font:800 15px/1 system-ui,sans-serif;fill:currentColor;opacity:.8}'
    + '.eps-se-rep{cursor:pointer}.eps-se-rep circle{fill:#fff;stroke:currentColor;stroke-width:2.5}'
    + '.eps-se-rep text{font:900 12px/1 system-ui,sans-serif;fill:#1c2128;pointer-events:none}'
    + '.eps-se-rep.sent circle,.eps-se-rep.fait circle{fill:#dcfce7;stroke:#15803d}.eps-se-rep.wip circle,.eps-se-rep.resend circle{fill:#fef3c7;stroke:#d97706}'
    + '.eps-se-rep.ici circle{fill:#1c2128;stroke:#1c2128}.eps-se-rep.ici text{fill:#fff}'
    + '.eps-se-rep:focus-visible circle{stroke-width:4;stroke:#facc15}'
    + '.eps-se-grande .eps-se-pt{stroke-width:2}';
  (document.head || document.documentElement).appendChild(s);
}
if(document.head)css();else document.addEventListener('DOMContentLoaded', css);

root.EPSSeances = {bouton, piste, _pos:pos, _stade:stade, _mini:[BW, BH, BM]};
})(window);

/* =====================================================================
   eps-aide.js — module commun aux applis EPS de Y. Dartois (Lycée G. Pompidou)
   · bouton « ? » qui ouvre le MODE D'EMPLOI de l'appli (un onglet par public : élève, prof…)
   · option « Lecture facilitée » (dyslexie) : Atkinson Hyperlegible partout, lettres et lignes espacées, mémorisée pour
     TOUTES les applis du site (même adresse yannickdartois-hue.github.io).
   Contenu : window.EPS_AIDE = {appli, publics:[{id,titre,chapitres:[{t,html}]}], bouton:true|false, bas:'16px'}
   À charger APRÈS le fichier aide.js de l'appli. Ouvrir par code : EPSAide.ouvrir('prof').
   Fichiers à copier avec lui : polices/atkinson-400.woff2, polices/atkinson-700.woff2
   ===================================================================== */
(function(){
'use strict';
const A=window.EPS_AIDE||{appli:document.title,publics:[]};
const scr=document.currentScript;const base=scr&&scr.src?scr.src.replace(/[^/]*$/,''):'';
const CLE='eps-lisible';
const lire=()=>{try{return localStorage.getItem(CLE)==='1'}catch(e){return false}};
const ecrire=v=>{try{localStorage.setItem(CLE,v?'1':'0')}catch(e){}};
const css=`
@font-face{font-family:"Atkinson Hyperlegible";src:url(${base}polices/atkinson-400.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Atkinson Hyperlegible";src:url(${base}polices/atkinson-700.woff2) format("woff2");font-weight:700 900;font-display:swap}
html.epsa-lisible body,html.epsa-lisible body *:not(i):not(svg):not(svg *):not([class*="fa-"]):not(.epsa-garde){font-family:"Atkinson","Atkinson Hyperlegible",Verdana,Arial,sans-serif!important;letter-spacing:.03em;word-spacing:.12em;font-style:normal}
html.epsa-lisible body p,html.epsa-lisible body li{line-height:1.6}
.epsa-btn{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:calc(var(--epsa-bas,16px) + env(safe-area-inset-bottom));z-index:9000;width:46px;height:46px;border-radius:50%;border:2px solid #fff;background:#1c2128;color:#fff;font:900 22px/1 system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer;display:grid;place-items:center}
.epsa-btn:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
@media print{.epsa-btn,.epsa-voile{display:none!important}}
.epsa-voile{position:fixed;inset:0;z-index:9001;background:rgba(8,20,22,.6);display:flex;align-items:center;justify-content:center;padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom))}
.epsa-fen{background:#fff;color:#1c2128;border-radius:20px;width:100%;max-width:820px;max-height:100%;display:flex;flex-direction:column;overflow:hidden;font:17px/1.5 "Atkinson",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)}
.epsa-tete{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #dde2e8;flex-wrap:wrap}
.epsa-tete h2{margin:0;font-size:20px;flex:1 1 200px;line-height:1.2}.epsa-tete h2 small{display:block;font-size:15px;font-weight:600;color:#5b6470}
.epsa-tete button,.epsa-onglets button{font:inherit;font-weight:800;border-radius:999px;cursor:pointer}
.epsa-fermer{border:0;background:#1c2128;color:#fff;padding:8px 16px;min-height:44px}
.epsa-lis{display:flex!important;flex-direction:row!important;margin:0!important;align-items:center;gap:8px;font-size:15px;font-weight:700;padding:4px 0;cursor:pointer}.epsa-lis input{width:22px;height:22px;accent-color:var(--acc,#334155)}
.epsa-onglets{display:flex;gap:6px;padding:10px 16px;border-bottom:1px solid #dde2e8;flex-wrap:wrap}
.epsa-onglets[hidden]{display:none}
.epsa-onglets button{border:1.5px solid #dde2e8;background:#fff;color:#1c2128;padding:6px 16px;min-height:42px}
.epsa-onglets button.on{background:var(--acc,#334155);border-color:var(--acc,#334155);color:#fff}
.epsa-corps{overflow:auto;padding:8px 16px 24px;-webkit-overflow-scrolling:touch}
.epsa-corps details{border:1px solid #dde2e8;border-radius:14px;margin:10px 0;background:#f3f5f8}
.epsa-corps summary{cursor:pointer;font-weight:800;padding:12px 14px;min-height:44px;list-style:none;display:flex;align-items:center;gap:10px}
.epsa-corps summary::-webkit-details-marker{display:none}
.epsa-corps summary::before{content:"›";font-size:22px;line-height:1;transition:transform .15s;color:var(--acc,#334155)}
.epsa-corps details[open] summary::before{transform:rotate(90deg)}
.epsa-corps details>div{padding:0 16px 14px}
.epsa-corps ol,.epsa-corps ul{padding-left:22px;margin:6px 0}.epsa-corps li{margin:4px 0}
.epsa-corps .astuce{background:#f3f5f8;border-left:4px solid var(--acc,#334155);border-radius:8px;padding:8px 12px;margin:8px 0}
.epsa-corps .attention{background:#fef3c7;border-left:4px solid #d97706;border-radius:8px;padding:8px 12px;margin:8px 0}
.epsa-corps kbd,.epsa-corps .bouton{display:inline-block;border:1.5px solid #9fb3b0;border-radius:8px;padding:0 6px;font-size:.92em;font-weight:700;background:#fff;white-space:nowrap}
.epsa-pied{font-size:15px;color:#5b6470;padding:10px 16px;border-top:1px solid #dde2e8}
:root[data-theme="dark"] .epsa-fen{background:#161b22;color:#e6edf3}:root[data-theme="dark"] .epsa-corps details{background:#0d1117;border-color:#2a313b}:root[data-theme="dark"] .epsa-onglets button{background:#161b22;color:#e6edf3}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const appliquer=v=>document.documentElement.classList.toggle('epsa-lisible',!!v);
appliquer(lire());
let pub=null;
function fermer(){const v=document.querySelector('.epsa-voile');if(v)v.remove();document.removeEventListener('keydown',echap)}
function echap(e){if(e.key==='Escape')fermer()}
function rendre(v){
  const P=A.publics||[];if(!pub||!P.some(p=>p.id===pub))pub=(P[0]||{}).id;const p=P.find(x=>x.id===pub)||{chapitres:[]};
  v.querySelector('.epsa-onglets').innerHTML=P.length>1?P.map(x=>`<button type="button" data-epsa-pub="${x.id}" class="${x.id===pub?'on':''}">${x.titre}</button>`).join(''):'';
  v.querySelector('.epsa-onglets').hidden=P.length<2;
  v.querySelector('.epsa-corps').innerHTML=(p.intro?`<p>${p.intro}</p>`:'')+p.chapitres.map((c,i)=>`<details${i===0?' open':''}><summary>${c.t}</summary><div>${c.html}</div></details>`).join('');
}
function ouvrir(publicId){
  fermer();if(publicId)pub=publicId;
  const v=document.createElement('div');v.className='epsa-voile';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-label','Mode d’emploi');
  v.innerHTML=`<div class="epsa-fen"><div class="epsa-tete"><h2>Mode d’emploi<small>${A.appli||''}</small></h2>
    <label class="epsa-lis"><input type="checkbox" ${lire()?'checked':''} data-epsa-lis> Lecture facilitée (dyslexie)</label>
    <button type="button" class="epsa-fermer" data-epsa-fermer>Fermer</button></div>
    <div class="epsa-onglets"></div><div class="epsa-corps"></div>
    <div class="epsa-pied">${A.pied||'Les données restent sur l’appareil. Une question, une idée : parlez-en à votre professeur d’EPS.'}<br><span data-epsa-stock></span></div></div>`;
  document.body.appendChild(v);rendre(v);etatStockage(v);
  v.addEventListener('click',e=>{const t=e.target;
    if(t===v||t.closest('[data-epsa-fermer]'))return fermer();
    const b=t.closest('[data-epsa-pub]');if(b){pub=b.dataset.epsaPub;rendre(v);v.querySelector('.epsa-corps').scrollTop=0}});
  v.querySelector('[data-epsa-lis]').addEventListener('change',e=>{ecrire(e.target.checked);appliquer(e.target.checked)});
  document.addEventListener('keydown',echap);
  const f=v.querySelector('.epsa-fermer');if(f)f.focus();
}
/* Stockage protégé : demande au navigateur de ne jamais effacer les données des applis EPS
   (Chrome les efface quand la place manque, Safari après 7 jours sans ouverture d'un site non installé).
   La protection vaut pour tout le site yannickdartois-hue.github.io, donc pour toutes les applis.
   Chrome et Safari l'accordent sans question, surtout pour une appli installée sur l'écran d'accueil. */
let protege=null;
async function proteger(){
  try{if(!navigator.storage||!navigator.storage.persist)return protege=null;
    if(await navigator.storage.persisted())return protege=true;
    return protege=await navigator.storage.persist()}catch(e){return protege=null}}
const pret=proteger();
async function etatStockage(v){const el=v.querySelector('[data-epsa-stock]');if(!el)return;await pret;
  if(protege==null&&navigator.storage&&navigator.storage.persisted)try{protege=await navigator.storage.persisted()}catch(e){}
  el.innerHTML=protege===true?'🔒 Données protégées sur cet appareil : le navigateur ne les effacera pas.'
    :protege===false?'⚠ Données non protégées : installez l’appli sur l’écran d’accueil (menu du navigateur → « Ajouter à l’écran d’accueil »), puis rouvrez-la.'
    :'Protection des données non disponible sur ce navigateur : faites des sauvegardes régulières.'}
window.EPSAide={ouvrir,fermer,lisible:v=>{ecrire(v);appliquer(v)},stockage:()=>pret.then(()=>protege),proteger};
function bouton(){if(A.bouton===false||document.querySelector('.epsa-btn'))return;
  const b=document.createElement('button');b.type='button';b.className='epsa-btn';b.textContent='?';b.title='Mode d’emploi';b.setAttribute('aria-label','Mode d’emploi');
  if(A.bas)document.documentElement.style.setProperty('--epsa-bas',A.bas);
  b.onclick=()=>ouvrir();document.body.appendChild(b)}
if(document.body)bouton();else document.addEventListener('DOMContentLoaded',bouton);
})();

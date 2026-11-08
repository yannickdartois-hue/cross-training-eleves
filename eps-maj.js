/* =====================================================================
   eps-maj.js — commun à TOUTES les applis EPS (Lycée Georges Pompidou)
   Source : mon-eps/atelier/ecran-de-cours/commun/eps-maj.js (recopié tel quel).

   Problème réglé : un onglet resté ouvert, ou une tablette qui ne recharge
   jamais la page, gardait l'ancienne version de l'appli.
   - À l'ouverture, à chaque retour sur l'appli et toutes les 30 min, on
     demande s'il existe une nouvelle version (sw.js modifié).
   - Quand elle est installée, un bandeau propose « Mettre à jour ».
     Avant de recharger, l'évènement « eps-avant-maj » permet à l'appli
     d'enregistrer ce qui est en cours (les données restent sur l'appareil).
   Ne fait rien sans service worker ni sans réseau.
   Une appli qui a déjà son propre bandeau charge ce fichier avec
   data-bandeau="non" : il ne fait alors que les vérifications.
   ===================================================================== */
(function(){
  'use strict';
  if(!('serviceWorker' in navigator)||window.__epsMaj)return;
  window.__epsMaj=true;
  var sc=document.currentScript,sansBandeau=!!(sc&&sc.getAttribute('data-bandeau')==='non');
  var avait=!!navigator.serviceWorker.controller,affiche=false;
  function bandeau(){
    if(affiche||!document.body)return;affiche=true;
    if(!document.getElementById('eps-maj-style')){
      var s=document.createElement('style');s.id='eps-maj-style';
      s.textContent='.eps-maj{position:fixed;left:12px;right:12px;bottom:max(84px,calc(env(safe-area-inset-bottom) + 84px));z-index:2147483000;display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap;padding:12px 14px;border-radius:14px;background:#fff3c4;border:2px solid #c99a00;color:#5c4300;font:700 17px/1.3 "Atkinson","Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.2)}'+
        '.eps-maj button{min-height:48px;padding:0 18px;border-radius:12px;border:0;background:#1c2128;color:#fff;font:inherit;cursor:pointer}'+
        '.eps-maj .eps-maj-x{background:transparent;color:#5c4300;padding:0 10px;min-height:44px}'+
        '@media print{.eps-maj{display:none}}';
      document.head.appendChild(s);
    }
    var d=document.createElement('div');d.className='eps-maj';d.setAttribute('role','status');
    d.innerHTML='<span>🔄 Nouvelle version de l’appli disponible.</span><span><button type="button" class="eps-maj-x" aria-label="Plus tard">Plus tard</button><button type="button" class="eps-maj-ok">Mettre à jour</button></span>';
    d.querySelector('.eps-maj-x').onclick=function(){d.remove();affiche=false};
    d.querySelector('.eps-maj-ok').onclick=function(){
      try{window.dispatchEvent(new Event('eps-avant-maj'))}catch(e){}
      setTimeout(function(){location.reload()},400);
    };
    document.body.appendChild(d);
  }
  if(!sansBandeau)navigator.serviceWorker.addEventListener('controllerchange',function(){if(avait)bandeau();avait=true});
  navigator.serviceWorker.ready.then(function(reg){
    function verifier(){if(navigator.onLine!==false)reg.update().catch(function(){})}
    verifier();
    document.addEventListener('visibilitychange',function(){if(!document.hidden)verifier()});
    setInterval(verifier,30*60*1000);
  }).catch(function(){});
})();

/* ---------------------------------------------------------------------
   Numéro de version, discret, en haut à droite (ex. « v26 »).
   Version réellement installée = nom du cache de l'appli (marche hors
   ligne) ; à défaut, version lue dans sw.js. Masqué à l'impression,
   ne gêne aucun bouton (aucun clic).
   --------------------------------------------------------------------- */
(function(){
  'use strict';
  if(window.__epsVersion)return;window.__epsVersion=true;
  var cle='eps-version:'+location.pathname.replace(/[^\/]*$/,'');
  function montrer(v){
    if(!v)return;
    if(!document.body){setTimeout(function(){montrer(v)},200);return}
    var e=document.getElementById('eps-version');
    if(!e){
      e=document.createElement('div');e.id='eps-version';e.setAttribute('aria-hidden','true');
      e.style.cssText='position:fixed;top:max(1px,env(safe-area-inset-top));right:3px;z-index:2147482000;font:600 10px/1.2 system-ui,Arial,sans-serif;color:#000;opacity:.32;pointer-events:none';
      var st=document.createElement('style');st.textContent='@media print{#eps-version{display:none}}';document.head.appendChild(st);
      document.body.appendChild(e);
    }
    e.textContent=v;
  }
  function lire(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function ecrire(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function depuisCache(prefixe){
    if(!prefixe||!window.caches)return Promise.resolve(null);
    return caches.keys().then(function(ks){
      var best=null;
      ks.forEach(function(k){if(k.indexOf(prefixe)===0){var m=k.slice(prefixe.length).match(/^v?(\d+)/);if(m&&(best===null||+m[1]>best))best=+m[1]}});
      return best===null?null:'v'+best;
    }).catch(function(){return null});
  }
  var memo=lire(cle);if(memo)montrer(memo.split('|')[1]);
  depuisCache(memo&&memo.split('|')[0]).then(function(v){if(v)montrer(v)});
  fetch('sw.js',{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(function(t){
    var m=t&&t.match(/['"]([A-Za-z0-9_.\-]*?)(v\d+)['"]/);if(!m)return;
    depuisCache(m[1]).then(function(v){v=v||m[2];ecrire(cle,m[1]+'|'+v);montrer(v)});
  }).catch(function(){});
})();

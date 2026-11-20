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
   Il pose aussi le lien « Confidentialité » en bas de page (voir plus bas).
   ===================================================================== */
/* Lien « Confidentialité » en bas de chaque appli (20/11/2026).
   Ajouté à la fin de la page ; décalé au-dessus d'une barre fixée en bas de l'écran.
   Une appli peut s'en passer avec data-confidentialite="non" sur la balise de ce script. */
(function(){
  var sc=document.currentScript;
  if(sc&&sc.getAttribute('data-confidentialite')==='non')return;
  var URL_CONF='https://yannickdartois-hue.github.io/mon-EPS/confidentialite.html';
  function poser(){
    if(document.getElementById('eps-conf')||!document.body)return;
    var st=document.createElement('style');st.id='eps-conf-style';
    st.textContent='#eps-conf{text-align:center;padding:18px 12px 22px;font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;clear:both}'+
      '#eps-conf a{color:#5b6470;text-decoration:underline;text-underline-offset:2px;display:inline-block;padding:8px 6px}'+
      '@media print{#eps-conf{display:none}}';
    document.head.appendChild(st);
    var d=document.createElement('div');d.id='eps-conf';
    d.innerHTML='<a href="'+URL_CONF+'" target="_blank" rel="noopener">Confidentialité</a>';
    document.body.appendChild(d);
    d.style.display='none';   /* invisible tant qu'on n'a pas choisi sa place */
    addEventListener('resize',caler);setTimeout(function(){d.style.display='';placer()},1200);
  }
  /* appli « plein écran » (la page ne défile pas, une zone intérieure défile) : le lien va au bout de cette zone,
     et revient s'il est effacé quand l'appli redessine son écran */
  var zone=null;
  function placer(){
    var d=document.getElementById('eps-conf');if(!d)return;
    var se=document.scrollingElement||document.documentElement,lim=innerHeight+4;
    /* on mesure la page SANS le lien : il ne doit jamais rendre défilante une page qui ne l'était pas */
    d.style.display='none';var defile=se.scrollHeight>lim;d.style.display='';
    if(defile){caler();return;}
    if(se.scrollHeight<=lim)return;          /* le lien tient sous le contenu sans faire défiler */
    /* écran « plein écran » : le lien va au bout de la zone intérieure qui défile (le corps de page compris) */
    var best=null,aire=0;
    [document.body].concat([].slice.call(document.body.querySelectorAll('*'))).forEach(function(e){
      if(e===d||d.contains(e))return;
      if(e!==document.body&&e.offsetParent===null&&getComputedStyle(e).position!=='fixed')return;
      var c=getComputedStyle(e);if(!/(auto|scroll)/.test(c.overflowY))return;
      var r=e.getBoundingClientRect();var a=r.width*r.height;if(r.width>innerWidth*0.6&&r.height>innerHeight*0.4&&a>aire){aire=a;best=e;}
    });
    if(!best||best===document.body&&getComputedStyle(document.body).overflowY==='visible'){d.parentNode&&d.parentNode.removeChild(d);return;}   /* pas de place : pas de lien */
    zone=best;if(zone!==document.body)zone.appendChild(d);d.style.paddingBottom='22px';
    new MutationObserver(function(){if(!zone.contains(d))zone.appendChild(d);else if(zone.lastElementChild!==d)zone.appendChild(d);}).observe(zone,{childList:true});
  }
  /* si une barre est fixée en bas (navigation, boutons), on laisse sa hauteur sous le lien */
  function caler(){
    var d=document.getElementById('eps-conf');if(!d)return;var h=0;
    [].forEach.call(document.body.querySelectorAll('nav,footer,header,div,section'),function(e){
      if(e===d||e.contains(d))return;var c=getComputedStyle(e);if(c.position!=='fixed'&&c.position!=='sticky')return;
      var r=e.getBoundingClientRect();if(r.height>0&&r.height<innerHeight/2&&Math.abs(r.bottom-innerHeight)<4&&c.position==='fixed')h=Math.max(h,r.height);
    });
    d.style.paddingBottom=(22+h)+'px';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',poser);else poser();
})();

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
   Numéro de version, lisible, en haut à droite, 8 px sous le bord (21/11/2026 : collé au bord, Safari sur iPad
   le prenait pour la barre du haut et brouillait toute la bande supérieure) (ex. « v1.2 ») : 13 px sur une pastille claire (13/11/2026 : l'ancien 10 px gris était illisible).
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
      e.style.cssText='position:fixed;top:calc(env(safe-area-inset-top, 0px) + 8px);right:6px;z-index:2147482000;font:700 13px/1.2 system-ui,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.25);border-radius:7px;padding:1px 6px;pointer-events:none';
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
      // « v1.10 » est plus récent que « v1.9 » : on compare majeur puis mineur
      ks.forEach(function(k){if(k.indexOf(prefixe)===0){var m=k.slice(prefixe.length).match(/^v?(\d+)(?:\.(\d+))?$/);if(!m)return;var n=[+m[1],m[2]==null?-1:+m[2],m[1]+(m[2]!=null?'.'+m[2]:'')];
        if(best===null||n[0]>best[0]||(n[0]===best[0]&&n[1]>best[1]))best=n}});
      return best===null?null:'v'+best[2];
    }).catch(function(){return null});
  }
  var memo=lire(cle);if(memo)montrer(memo.split('|')[1]);
  depuisCache(memo&&memo.split('|')[0]).then(function(v){if(v)montrer(v)});
  fetch('sw.js',{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(function(t){
    var m=t&&t.match(/['"]([A-Za-z0-9_.\-]*?)(v\d+(?:\.\d+)?)['"]/);if(!m)return;
    depuisCache(m[1]).then(function(v){v=v||m[2];ecrire(cle,m[1]+'|'+v);montrer(v)});
  }).catch(function(){});
})();

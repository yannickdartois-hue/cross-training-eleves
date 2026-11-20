/* =====================================================================
   eps-demo.js — commun à TOUTES les applis EPS qui ont un mode démo (Lycée Georges Pompidou)
   Source : mon-EPS/atelier/ecran-de-cours/commun/eps-demo.js (recopié tel quel, voir synchroniser.py).

   Affiche, tant que l'appli est en démo, la même barre violette en bas à gauche :
       🎭 DÉMO · rien n'est enregistré · [actions de l'appli] · Quitter
   Rien n'est modifié dans l'appli : le module regarde seulement si elle est en démo.
   Le bandeau jaune .demo-bandeau de l'appli est alors masqué (pas de doublon, demande du 20/11/2026) :
   ses boutons et liens (« Voir l'outil prof »…) sont repris dans la barre violette, son « Quitter » sert au bouton Quitter.

   Détection automatique (aucun code à ajouter dans l'appli) :
     - variable DEMO de l'appli vraie (let DEMO=… dans la plupart des applis),
     - ou bandeau jaune .demo-bandeau présent dans la page.
   En sortant de la démo, « ?demo » est retiré de l'adresse (un rechargement ne relance pas la démo).
   Bouton « Quitter » : clique le bouton « Quitter la démo » du bandeau jaune s'il existe,
     sinon appelle la fonction donnée par data-quitter="nomDeFonction",
     sinon quitterDemo() puis rendre(), sinon recharge la page sans « ?demo ».
   Si l'appli a une barre fixée en bas (onglets), la barre DÉMO se place automatiquement au-dessus.
   Options de la balise : <script src="eps-demo.js" data-quitter="maFonction" data-bas="80px"></script>
     data-bas : hauteur imposée au-dessus du bas de l'écran (remplace le placement automatique).
   Pour une appli qui pilote elle-même sa démo :
     EPSDemo.montrer({quitter:fn, actions:[{texte:'⏱ Simuler', fn:maFonction}]})  /  EPSDemo.cacher()
   ===================================================================== */
(function(){
  'use strict';
  if(window.EPSDemo)return;
  var sc=document.currentScript;
  var OPT={quitter:sc&&sc.getAttribute('data-quitter'),bas:sc&&sc.getAttribute('data-bas')};
  var manuel=null; /* réglages donnés par EPSDemo.montrer() */
  var barre=null,cle='';

  function css(){
    if(document.getElementById('eps-demo-style'))return;
    var s=document.createElement('style');s.id='eps-demo-style';
    s.textContent='.eps-demo{position:fixed;left:max(10px,env(safe-area-inset-left));bottom:calc(var(--eps-demo-bas,10px) + env(safe-area-inset-bottom,0px));z-index:2147481000;display:flex;align-items:center;gap:8px;flex-wrap:wrap;max-width:min(560px,calc(100% - 20px));padding:8px 10px;border-radius:14px;background:#6d28d9;color:#fff;font:700 15px/1.25 "Atkinson","Atkinson Hyperlegible","Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.3)}'+
      '.eps-demo b{font-weight:800;letter-spacing:.02em}.eps-demo .eps-demo-txt{font-weight:600;opacity:.92}'+
      '.eps-demo button{min-height:44px;padding:0 12px;border:0;border-radius:10px;background:#fff;color:#1c2128;font-weight:800;font-size:15px;line-height:1;font-family:inherit;cursor:pointer}'+
      '.eps-demo button.eps-demo-q{background:#1c2128;color:#fff}'+
      '.eps-demo button:focus-visible{outline:3px solid #fde047;outline-offset:2px}'+
      'body.eps-demo-cache .eps-demo{display:none}'+
      'body.eps-demo-actif .demo-bandeau{display:none!important}'+
      '.eps-demo a.eps-demo-lien{text-decoration:none}'+
      '@media print{.eps-demo{display:none!important}}';
    (document.head||document.documentElement).appendChild(s);
  }
  function enDemo(){
    if(manuel)return true;
    try{if(typeof DEMO!=='undefined'&&DEMO)return true;}catch(e){}
    return !!document.querySelector('.demo-bandeau');
  }
  /* démo terminée : on retire « ?demo » de l'adresse, sinon un rechargement de la page relancerait la démo */
  function nettoyerAdresse(){
    try{
      if(!/[?&]demo\b/.test(location.search))return;
      var q=location.search.replace(/([?&])demo(=[^&]*)?(&|$)/,'$1').replace(/[?&]$/,'');
      history.replaceState(history.state,'',location.pathname+q+location.hash);
    }catch(e){}
  }
  function quitter(){
    if(manuel&&typeof manuel.quitter==='function')return manuel.quitter();
    var jaune=document.querySelectorAll('.demo-bandeau button, .demo-bandeau a');
    for(var i=0;i<jaune.length;i++){if(/quitter|sortir|terminer/i.test(jaune[i].textContent)){jaune[i].click();return verifier(true);}}
    var f=OPT.quitter&&window[OPT.quitter];
    if(typeof f==='function'){f();return verifier(true);}
    try{if(typeof quitterDemo==='function'){quitterDemo();if(typeof rendre==='function')rendre();return verifier(true);}}catch(e){}
    var u=location.pathname+location.search.replace(/([?&])demo(=[^&]*)?&?/,'$1').replace(/[?&]$/,'')+location.hash;
    location.replace(u);
  }
  /* boutons et liens du bandeau jaune de l'appli, sauf « Quitter » : repris dans la barre violette */
  function relais(){
    var r=[],vus={};
    document.querySelectorAll('.demo-bandeau button, .demo-bandeau a').forEach(function(el){
      var t=(el.textContent||'').trim();
      if(!t||vus[t]||/quitter|sortir|terminer/i.test(t))return;vus[t]=1;
      r.push({texte:t,fn:function(){
        var cible=null;document.querySelectorAll('.demo-bandeau button, .demo-bandeau a').forEach(function(x){if(!cible&&(x.textContent||'').trim()===t)cible=x;});
        if(cible)cible.click();
      }});
    });
    return r;
  }
  function construire(){
    css();
    var acts=((manuel&&manuel.actions)||[]).concat(relais());
    var k=acts.map(function(a){return a.texte;}).join('|');
    if(barre&&k===cle)return;
    if(barre)barre.remove();
    cle=k;
    barre=document.createElement('div');barre.className='eps-demo';barre.setAttribute('role','status');
    barre.innerHTML='<b>🎭 DÉMO</b><span class="eps-demo-txt">rien n’est enregistré</span>';
    acts.forEach(function(a){var b=document.createElement('button');b.type='button';b.textContent=a.texte;b.onclick=function(){a.fn();};barre.appendChild(b);});
    var q=document.createElement('button');q.type='button';q.className='eps-demo-q';q.textContent='Quitter';q.onclick=quitter;barre.appendChild(q);
    if(OPT.bas)document.documentElement.style.setProperty('--eps-demo-bas',OPT.bas);
    document.body.appendChild(barre);
  }
  /* l'appli a une barre fixée en bas (onglets…) ? on se place juste au-dessus */
  function placer(){
    if(!barre||OPT.bas)return;
    var vis=barre.style.visibility;barre.style.visibility='hidden';
    var h=window.innerHeight,haut=h,xs=[24,Math.round(window.innerWidth/2)];
    xs.forEach(function(x){
      var el=document.elementFromPoint(x,h-4);
      while(el&&el!==document.body&&el!==document.documentElement){
        var cs=getComputedStyle(el);
        if(cs.position==='fixed'||cs.position==='sticky'){var r=el.getBoundingClientRect();if(r.bottom>=h-2&&r.height<h*0.4)haut=Math.min(haut,r.top);break;}
        el=el.parentElement;
      }
    });
    barre.style.visibility=vis;
    var bas=Math.max(10,Math.round(h-haut)+8)+'px';
    if(document.documentElement.style.getPropertyValue('--eps-demo-bas')!==bas)document.documentElement.style.setProperty('--eps-demo-bas',bas);
  }
  function verifier(){
    if(!document.body)return;
    if(enDemo()){construire();placer();document.body.classList.add('eps-demo-actif');}
    else{document.body.classList.remove('eps-demo-actif');if(barre){barre.remove();barre=null;cle='';nettoyerAdresse();}}
  }
  window.EPSDemo={
    montrer:function(o){manuel=o||{};cle='-';verifier();},
    cacher:function(){manuel=null;verifier();},
    actif:enDemo,
    verifier:verifier
  };
  function demarrer(){
    verifier();
    try{new MutationObserver(function(){clearTimeout(demarrer.t);demarrer.t=setTimeout(verifier,60);}).observe(document.body,{childList:true,subtree:true});}catch(e){}
    setInterval(verifier,800); /* filet : variable DEMO changée sans modifier la page */
  }
  if(document.body)demarrer();else document.addEventListener('DOMContentLoaded',demarrer);
})();

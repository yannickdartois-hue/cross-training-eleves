/* =====================================================================
   eps-demo.js — commun à TOUTES les applis EPS qui ont un mode démo (Lycée Georges Pompidou)
   Source : mon-EPS/atelier/ecran-de-cours/commun/eps-demo.js (recopié tel quel, voir synchroniser.py).

   Affiche, tant que l'appli est en démo, le même bandeau violet horizontal, sur toute la largeur, EN HAUT de la page :
       🎭 DÉMO · rien n'est enregistré · [actions de l'appli] · Quitter
   26/11/2026 : bandeau dans le flux de la page (comme l'ancien bandeau jaune) au lieu d'une barre flottante en bas à gauche,
   qui cachait du contenu dans toutes les applis. Il pousse la page vers le bas : il ne recouvre plus jamais rien.
   Pas de z-index : les fenêtres et voiles de l'appli (position fixe) passent au-dessus du bandeau.
   Rien n'est modifié dans l'appli : le module regarde seulement si elle est en démo.
   Le bandeau jaune .demo-bandeau de l'appli est alors masqué (pas de doublon, demande du 20/11/2026) :
   ses boutons et liens (« Voir l'outil prof »…) sont repris dans la barre violette, son « Quitter » sert au bouton Quitter.

   Détection automatique (aucun code à ajouter dans l'appli) :
     - variable DEMO de l'appli vraie (let DEMO=… dans la plupart des applis),
     - ou bandeau jaune .demo-bandeau présent dans la page.
   En sortant de la démo, « ?demo » est retiré de l'adresse (un rechargement ne relance pas la démo).
   Téléphone (moins de 600 px) : une seule ligne « 🎭 DÉMO · ⋯ · Quitter » ; ⋯ déplie les autres boutons (20/11/2026).
   Bouton « Quitter » : clique le bouton « Quitter la démo » du bandeau jaune s'il existe,
     sinon appelle la fonction donnée par data-quitter="nomDeFonction",
     sinon quitterDemo() puis rendre(), sinon recharge la page sans « ?demo ».
   Options de la balise : <script src="eps-demo.js" data-quitter="maFonction" data-dans=".pages"></script>
     data-dans : conteneur où placer le bandeau (en tête). Sans cette option : en tête de la page (avant l'en-tête de l'appli).
       À utiliser quand l'appli a un en-tête FIXÉ (position:fixed) qui cacherait le haut de la page (800 m, Marche 30').
     data-bas : ancienne option (barre flottante), ignorée.
   Pour une appli qui pilote elle-même sa démo :
     EPSDemo.montrer({quitter:fn, actions:[{texte:'⏱ Simuler', fn:maFonction}]})  /  EPSDemo.cacher()
   ===================================================================== */
(function(){
  'use strict';
  if(window.EPSDemo)return;
  var sc=document.currentScript;
  var OPT={quitter:sc&&sc.getAttribute('data-quitter'),dans:sc&&sc.getAttribute('data-dans')};
  var manuel=null; /* réglages donnés par EPSDemo.montrer() */
  var barre=null,cle='';

  function css(){
    if(document.getElementById('eps-demo-style'))return;
    var s=document.createElement('style');s.id='eps-demo-style';
    s.textContent='.eps-demo{box-sizing:border-box;width:100%;margin:0;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 12px;'+
      'padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right));background:#6d28d9;color:#fff;'+
      'font:700 15px/1.25 "Atkinson","Atkinson Hyperlegible","Segoe UI",Roboto,Arial,sans-serif;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)}'+
      /* en tête de page : sous l'encoche des téléphones (appli installée en plein écran) */
      'body>.eps-demo:first-child{padding-top:max(6px,env(safe-area-inset-top))}'+
      '.eps-demo b{font-weight:800;letter-spacing:.02em;flex:none}.eps-demo .eps-demo-txt{font-weight:600;opacity:.92;flex:1 1 auto;min-width:0}'+
      '.eps-demo button{min-height:44px;padding:0 12px;border:0;border-radius:10px;background:#fff;color:#1c2128;font-weight:800;font-size:15px;line-height:1;font-family:inherit;cursor:pointer;flex:none;width:auto;margin:0}'+
      '.eps-demo button.eps-demo-q{background:#1c2128;color:#fff}'+
      '.eps-demo button:focus-visible{outline:3px solid #fde047;outline-offset:2px}'+
      'body.eps-demo-cache .eps-demo{display:none}'+
      'body.eps-demo-actif .demo-bandeau{display:none!important}'+
      '.eps-demo a.eps-demo-lien{text-decoration:none}'+
      '.eps-demo button.eps-demo-plus{display:none}'+
      /* téléphone : une ligne « 🎭 DÉMO · rien n’est enregistré · ⋯ · Quitter » ; ⋯ ouvre les autres boutons sur une 2e ligne */
      '@media (max-width:600px){.eps-demo{gap:6px;padding-top:5px;padding-bottom:5px}.eps-demo .eps-demo-txt{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '.eps-demo button{min-height:40px;padding:0 10px}.eps-demo button.eps-demo-plus{display:inline-block;font-size:20px;letter-spacing:1px}'+
      '.eps-demo button.eps-demo-act{display:none}.eps-demo.ouvert button.eps-demo-act{display:inline-block}'+
      '.eps-demo.ouvert{row-gap:6px}}'+
      '@media (max-width:340px){.eps-demo .eps-demo-txt{display:none}}'+
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
    if(barre&&k===cle&&barre.isConnected)return;
    if(barre)barre.remove();
    cle=k;
    barre=document.createElement('div');barre.className='eps-demo';barre.setAttribute('role','status');
    barre.innerHTML='<b>🎭 DÉMO</b><span class="eps-demo-txt">rien n’est enregistré</span>';
    if(acts.length){var pl=document.createElement('button');pl.type='button';pl.className='eps-demo-plus';pl.textContent='⋯';pl.setAttribute('aria-label','Autres actions de la démo');
      pl.onclick=function(){var o=barre.classList.toggle('ouvert');pl.textContent=o?'✕':'⋯';};barre.appendChild(pl);}
    acts.forEach(function(a){var b=document.createElement('button');b.type='button';b.className='eps-demo-act';b.textContent=a.texte;b.onclick=function(){barre.classList.remove('ouvert');a.fn();};barre.appendChild(b);});
    var q=document.createElement('button');q.type='button';q.className='eps-demo-q';q.textContent='Quitter';q.onclick=quitter;barre.appendChild(q);
    var dans=OPT.dans&&document.querySelector(OPT.dans);
    (dans||document.body).insertBefore(barre,(dans||document.body).firstChild);
  }
  function verifier(){
    if(!document.body)return;
    if(enDemo()){construire();document.body.classList.add('eps-demo-actif');}
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

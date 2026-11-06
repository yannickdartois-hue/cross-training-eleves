/* =====================================================================
   eps-avatars.js — le prof en personnage dans les applis EPS (élèves et prof)
   Source : mon-eps/atelier/applis-eleves/eps-avatars.js (recopié tel quel),
   images : mon-eps/atelier/applis-eleves/avatars/*.webp → img/avatars/ du dépôt.
   Si la page n'est pas à la racine du dépôt : <script src="../eps-avatars.js" data-base="../img/avatars/">

   EPSAvatar('bravo','Séance envoyée !') → vignette + bulle (décorative, alt vide)
   EPSAvatar.mini('envoyer')            → petite image à glisser dans un bandeau

   Règle validée (06/11/2026) : 2 avatars au plus par séance pour un élève
   (rappel téléphone à l'ouverture, bravo après l'envoi), plus des avatars de
   situation seulement quand quelque chose sort de l'ordinaire (séance non
   envoyée, élève dispensé). Jamais pendant la saisie, jamais à l'impression.
   ===================================================================== */
(function(){
  var cs=document.currentScript,BASE=(cs&&cs.getAttribute('data-base'))||'img/avatars/';
  var st=document.createElement('style');
  st.textContent='.eps-av{display:flex;align-items:flex-end;gap:10px;margin:0 0 10px}'+
    '.eps-av img{width:auto;height:var(--av-h,110px);flex:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.12))}'+
    '.eps-av .eps-bulle{position:relative;align-self:center;background:var(--card,#fff);color:var(--fg,#1c2128);border:2px solid var(--acc,var(--act,#334155));border-radius:16px;padding:10px 14px;font-weight:700;font-size:max(15px,var(--fs-min,15px));line-height:1.3;max-width:300px}'+
    '.eps-av .eps-bulle:before{content:"";position:absolute;left:-10px;bottom:14px;border:8px solid transparent;border-right-color:var(--acc,var(--act,#334155));border-left:0}'+
    '.eps-av-ligne{display:flex!important;align-items:center;gap:12px}.eps-av-mini{height:var(--av-mini,96px);width:auto;flex:none}'+
    '@media print{.eps-av,.eps-av-mini{display:none!important}}';
  document.head.appendChild(st);
  function img(nom,cls){return '<img class="'+(cls||'')+'" src="'+BASE+nom+'.webp" alt="" aria-hidden="true" decoding="async">'}
  window.EPSAvatar=function(nom,bulle,cls){
    return '<figure class="eps-av '+(cls||'')+'" aria-hidden="true">'+img(nom)+(bulle?'<figcaption class="eps-bulle">'+bulle+'</figcaption>':'')+'</figure>';
  };
  window.EPSAvatar.mini=function(nom){return img(nom,'eps-av-mini')};
})();

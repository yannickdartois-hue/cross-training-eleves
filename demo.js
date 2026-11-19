/* =====================================================================
   demo.js — vrai mode démo de l'appli élève cross training (20/11/2026)
   Avant : « Ouvrir la démo » créait une vraie classe DEMO et un carnet (code 0000) enregistrés sur la tablette.
   Maintenant : le binôme fictif « Alice · Bruno » vit seulement en mémoire. Les vrais carnets de la tablette
   sont mis de côté et reviennent tels quels en quittant. Rien n'est enregistré pendant la démo.
   Barre violette commune : eps-demo.js. Ouverture : bouton « Ouvrir la démo » ou adresse …/?demo
   Nettoyage : une ancienne classe « DEMO » et son carnet restés sur la tablette sont retirés au chargement.
   ===================================================================== */
let DEMO=false,ROOT_REEL=null;
(function(){
  /* 1. pendant la démo, rien n'est écrit sur la tablette */
  const ecrireReel=ecrireRoot;
  ecrireRoot=function(){if(DEMO)return;return ecrireReel.apply(this,arguments)};
  const enCoursReel=enCours;
  enCours=function(o){if(DEMO)return;return enCoursReel.apply(this,arguments)};

  /* 2. ancienne démo enregistrée (versions précédentes) : retirée, elle ne contient que du fictif */
  try{
    const C=ROOT.classes&&ROOT.classes.DEMO;
    if(C&&Array.isArray(C.eleves)&&C.eleves.every(n=>/DÉMO$/.test(n))){
      delete ROOT.classes.DEMO;
      Object.keys(ROOT.groupes||{}).forEach(id=>{if(ROOT.groupes[id].classe==='DEMO')delete ROOT.groupes[id]});
      ecrireReel();
      if(!S)rendre();
    }
  }catch(e){}

  /* 3. ouverture de la démo (bouton « Ouvrir la démo » : on prend la main avant l'appli) */
  async function ouvrirDemo(){
    if(DEMO)return;
    ROOT_REEL=ROOT;
    ROOT={v:1,groupes:{},classes:{DEMO:{classe:'DEMO',eleves:['Alice DÉMO','Bruno DÉMO'],lien:'',niv:'p',dem:'p'}}};
    DEMO=true;
    try{
      await nouveauGroupe('DEMO','0000');
      S.eleves=[{id:uid(),nom:'Alice DÉMO'},{id:uid(),nom:'Bruno DÉMO'}];S.tab='seance';
      await enregistrer();
    }catch(e){toast('Démo : '+e.message);quitterDemo();return}
    fermer();rendre();window.scrollTo(0,0);
    toast('🎭 Démo : binôme fictif Alice · Bruno');
  }
  document.addEventListener('click',ev=>{
    const b=ev.target.closest&&ev.target.closest('[data-act="demo"]');if(!b)return;
    ev.preventDefault();ev.stopImmediatePropagation();ouvrirDemo();
  },true);
  window.ouvrirDemo=ouvrirDemo;

  /* 4. ouverture par l'adresse …/?demo */
  if(/[?&]demo\b/.test(location.search))ouvrirDemo();
})();
function quitterDemo(){
  if(!DEMO)return;
  clearTimeout(tSauve);
  S=null;ACTIF=null;CLEF=null;
  ROOT=ROOT_REEL||charger();ROOT_REEL=null;
  DEMO=false;
  try{if(/[?&]demo\b/.test(location.search))history.replaceState(null,'',location.pathname)}catch(e){}
  fermer();rendre();window.scrollTo(0,0);
}

/* =====================================================================
   chrono.js — chrono plein écran des WOD (TABATA, EMOM, EMOM+1, AMRAP, FOR TIME)
   Le partenaire tient la tablette : il compte les répétitions (+1), les « no rep »,
   note le temps restant à l'EMOM et la régulation (− / +) décidée avec l'athlète.
   ===================================================================== */
(function(root){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ac=null,lock=null;
function son(f,d,v){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.frequency.value=f;g.gain.setValueAtTime(v||.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const bipCourt=()=>son(880,.12),bipGo=()=>son(1320,.45,.4),bipFin=()=>{son(660,.3,.4);setTimeout(()=>son(440,.5,.4),320)};
async function eveil(on){try{if(on&&navigator.wakeLock)lock=await navigator.wakeLock.request('screen');else if(lock){lock.release();lock=null}}catch(e){}}
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};

/* W : {f,p,ordre,ex:[{m,v,reps}]}, opts : {athlete, mv:id→mouvement, visuel:m→html, onFin(resultat), onAnnule()} */
function lancer(W,opts){
  const PREP=10,p=W.p||{},ex=W.ex||[];
  const R={rounds:[],restants:[],tours:0,plus:0,temps:null,derniere:0,norep:0,regul:0,versions:ex.map(e=>e.v||0)};
  let t0=null,pauseA=null,pauseMs=0,fini=false,tick=null,dernierS=-1,phaseVue='',minuteFaite=-1,arret=false;
  // plan des phases [type, durée s, index] ; prep compris
  const plan=[['prep',PREP]];
  if(W.f==='tabata'){for(let i=0;i<p.n;i++){plan.push(['eff',p.e,i]);if(i<p.n-1)plan.push(['rep',p.r,i])}}
  else if(W.f==='emom'||W.f==='emom1'){for(let i=0;i<p.min;i++)plan.push(['min',60,i])}
  else if(W.f==='amrap')plan.push(['amrap',p.min*60,0]);
  else if(W.f==='fortime')plan.push(['ft',(p.cap||6)*60,0]);
  const total=plan.reduce((a,x)=>a+x[1],0);
  const v=document.createElement('div');v.className='chrono-voile';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');
  document.body.appendChild(v);document.documentElement.classList.add('chrono-ouvert');
  const ecoule=()=>t0==null?0:((pauseA||Date.now())-t0-pauseMs)/1000;
  function ou(t){let a=0;for(let k=0;k<plan.length;k++){if(t<a+plan[k][1])return {k,ph:plan[k],dans:t-a,reste:a+plan[k][1]-t};a+=plan[k][1]}return null}
  const exo=i=>{const e=ex[i];return e?(opts.mv(e.m)||{nom:e.m}):null};
  const verLib=x=>x<0?'version −':x>0?'version +':'version normale';
  function exoHTML(i,petit){const e=ex[i],m=exo(i);if(!m)return '';
    return `<div class="ch-exo${petit?' petit':''}"><div class="ch-img">${opts.visuel(m)}</div><div><b>${esc(m.nom)}</b>${W.f==='emom'||W.f==='fortime'||W.f==='amrap'?`<span>${e.reps||''} rép.</span>`:''}<span class="ch-ver">${verLib(R.versions[i])}</span>
      <div class="ch-reg"><button type="button" data-ch="moins" data-i="${i}" aria-label="Version plus facile">−</button><button type="button" data-ch="plusv" data-i="${i}" aria-label="Version plus difficile">+</button></div></div></div>`}
  function peindre(){
    if(fini)return;
    const t=ecoule(),o=ou(t);
    if(!o){terminer();return}
    const [typ,dur,i]=o.ph;
    // bips : 3, 2, 1 avant chaque départ d'effort et chaque nouvelle minute
    const s=Math.ceil(o.reste);
    if(s!==dernierS){dernierS=s;
      const prochain=plan[o.k+1];
      if(s<=3&&s>=1&&(typ==='prep'||typ==='rep'||(prochain&&prochain[0]==='min')))bipCourt();
      if((typ==='eff'||typ==='amrap'||typ==='ft')&&s<=3&&s>=1)bipCourt()}
    const cle=o.k+'';if(cle!==phaseVue){phaseVue=cle;
      if(typ==='eff'||typ==='min'||typ==='amrap'||typ==='ft')bipGo();
      if(typ==='rep')son(520,.35,.35);
      if(typ==='min'&&i>0&&minuteFaite<i-1){/* minute précédente non terminée */R.restants[i-1]=0;
        if(W.f==='emom1'){R.derniere=i-1;terminer();return}}
    }
    let couleur='prep',titre='Prépare-toi',corps='',grand=mmss(o.reste),sous='';
    if(typ==='prep'){const e0=W.f==='tabata'?exoDuRound(0):0;corps=exoHTML(e0);sous=esc(opts.titreWod||'');}
    else if(typ==='eff'){couleur='eff';titre='EFFORT';sous='Round '+(i+1)+' / '+p.n;const k=exoDuRound(i);corps=exoHTML(k)+compteur(R.rounds[i]||0,'rép. ce round');}
    else if(typ==='rep'){couleur='rep';titre='REPOS';sous='Round '+(i+1)+' : '+(R.rounds[i]||0)+' rép. · ensuite :';corps=exoHTML(exoDuRound(i+1),true);}
    else if(typ==='min'){couleur=minuteFaite>=i?'rep':'eff';titre='Minute '+(i+1)+' / '+p.min;
      const n=W.f==='emom1'?(p.dep||3)+i:null;
      sous=minuteFaite>=i?'Repos : '+(R.restants[i]||0)+' s restantes':(W.f==='emom1'?n+' répétitions':'Enchaîne : '+ex.map((e,j)=>(e.reps||'')+' '+((exo(j)||{}).nom||'')).join(' · '));
      corps=(minuteFaite>=i?'':`<button type="button" class="ch-gros ch-fini" data-ch="fini" data-i="${i}">Fini !<small>touche dès que la dernière répétition est faite</small></button>`)+`<div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true)).join('')}</div>`;}
    else if(typ==='amrap'){couleur='eff';titre='AMRAP';sous=R.tours+' tours + '+R.plus+' rép.';
      corps=`<div class="ch-boutons"><button type="button" class="ch-gros" data-ch="tour">+1 tour</button><button type="button" class="ch-moyen" data-ch="rep">+1 rép.</button></div><div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true)).join('')}</div>`;}
    else if(typ==='ft'){couleur='eff';titre='FOR TIME';grand=mmss(o.dans);sous='Tour '+Math.min(R.tours+1,p.tours||3)+' / '+(p.tours||3)+' · limite '+(p.cap||6)+' min';
      corps=`<div class="ch-boutons"><button type="button" class="ch-gros" data-ch="tourft">Tour terminé</button></div><div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true)).join('')}</div>`;}
    const fin=Math.max(0,total-t);
    v.innerHTML=`<div class="chr ${couleur}${pauseA?' pause':''}"><div class="ch-haut"><span>${esc(opts.athlete||'')}</span><span>${esc(opts.titreWod||'')}</span><span>reste ${mmss(fin)}</span></div>
      <p class="ch-titre">${titre}</p><p class="ch-temps">${grand}</p><p class="ch-sous">${sous}</p>
      <div class="ch-corps">${corps}</div>
      <div class="ch-bas"><button type="button" class="ch-norep" data-ch="norep">No rep <b>${R.norep}</b></button><button type="button" data-ch="pause">${pauseA?'Reprendre':'Pause'}</button><button type="button" data-ch="stop" class="${arret?'confirme':''}">${arret?'Sûr ? Retoucher':'Arrêter'}</button></div></div>`;
  }
  function exoDuRound(i){return root.CTL.exoDuRound(W,i)}
  const compteur=(n,l)=>`<button type="button" class="ch-gros ch-plus" data-ch="plus">+1<small>${n} ${l}</small></button><button type="button" class="ch-moins1" data-ch="moins1">− 1</button>`;
  function terminer(){if(fini)return;fini=true;clearInterval(tick);eveil(false);bipFin();
    const t=ecoule();
    if(W.f==='fortime'&&R.temps==null)R.temps=Math.round(Math.min(t-PREP,(p.cap||6)*60));
    if(W.f==='emom1'&&!R.derniere)R.derniere=minuteFaite+1;
    if(W.f==='emom')for(let i=0;i<p.min;i++)if(R.restants[i]==null)R.restants[i]=0;
    if(W.f==='tabata'){const fait=Math.min(p.n,Math.ceil(Math.max(0,t-PREP)/(p.e+p.r)));for(let i=0;i<fait;i++)if(R.rounds[i]==null)R.rounds[i]=0}
    v.innerHTML=`<div class="chr fin"><p class="ch-titre">Terminé</p><p class="ch-sous">${esc(opts.athlete||'')} · ${esc(opts.titreWod||'')}</p>
      <div class="ch-form"><label for="ch-fc">Fréquence cardiaque (pouls 15 s × 4, tout de suite)</label><input id="ch-fc" type="number" inputmode="numeric" min="40" max="230" placeholder="ex. 152">
      <p class="ch-lab">Note d’exécution (le partenaire) : 1 mal fait · 3 bien mais se dégrade · 5 parfait jusqu’au bout</p>
      <div class="ch-notes">${ex.map((e,j)=>`<div class="ch-note"><span>${esc((opts.mv(e.m)||{nom:e.m}).nom)}</span><span class="ch-n5">${[1,2,3,4,5].map(x=>`<button type="button" data-ch="note" data-i="${j}" data-v="${x}">${x}</button>`).join('')}</span></div>`).join('')}</div>
      <p class="ch-lab">Ressenti</p><div class="ch-res">${[[1,'Facile'],[2,'Moyen'],[3,'Difficile'],[4,'Très difficile']].map(x=>`<button type="button" data-ch="res" data-v="${x[0]}"><b>${x[0]}</b>${x[1]}</button>`).join('')}</div>
      <div class="ch-bas"><button type="button" data-ch="annuler">Ne pas enregistrer</button><button type="button" class="ch-ok" data-ch="enreg">Enregistrer</button></div></div></div>`;
    setTimeout(()=>{const i=v.querySelector('#ch-fc');if(i)i.focus()},100);
  }
  let ressenti=0;const notes=ex.map(()=>null);
  function fermer(){clearInterval(tick);eveil(false);v.remove();document.documentElement.classList.remove('chrono-ouvert')}
  v.addEventListener('click',e=>{const b=e.target.closest('[data-ch]');if(!b)return;const a=b.dataset.ch,t=ecoule(),o=ou(t);
    if(a!=='stop')arret=false;
    if(a==='plus'&&o&&o.ph[0]==='eff'){const i=o.ph[2];R.rounds[i]=(R.rounds[i]||0)+1;try{navigator.vibrate&&navigator.vibrate(25)}catch(x){}}
    else if(a==='moins1'&&o&&o.ph[0]==='eff'){const i=o.ph[2];R.rounds[i]=Math.max(0,(R.rounds[i]||0)-1)}
    else if(a==='norep')R.norep++;
    else if(a==='moins'||a==='plusv'){const i=+b.dataset.i,nv=Math.max(-1,Math.min(1,R.versions[i]+(a==='moins'?-1:1)));if(nv!==R.versions[i]){R.versions[i]=nv;R.regul++}}
    else if(a==='fini'&&o&&o.ph[0]==='min'){const i=+b.dataset.i;if(minuteFaite<i){minuteFaite=i;R.restants[i]=Math.round(o.reste);if(W.f==='emom1')R.derniere=i+1}}
    else if(a==='tour')R.tours++,R.plus=0;
    else if(a==='rep')R.plus++;
    else if(a==='tourft'){R.tours++;if(R.tours>=(p.tours||3)){R.temps=Math.round(t-PREP);terminer();return}}
    else if(a==='pause'){if(pauseA){pauseMs+=Date.now()-pauseA;pauseA=null}else pauseA=Date.now()}
    else if(a==='stop'){if(!arret){arret=true}else{if(W.f==='amrap'||W.f==='tabata'||W.f==='emom'||W.f==='emom1'){R.arrete=Math.round(Math.max(0,t-PREP))}terminer();return}}
    else if(a==='note'){const i=+b.dataset.i;notes[i]=+b.dataset.v;v.querySelectorAll(`[data-ch="note"][data-i="${i}"]`).forEach(x=>x.classList.toggle('on',x===b));return}
    else if(a==='res'){ressenti=+b.dataset.v;v.querySelectorAll('[data-ch="res"]').forEach(x=>x.classList.toggle('on',x===b));return}
    else if(a==='annuler'){fermer();opts.onAnnule&&opts.onAnnule();return}
    else if(a==='enreg'){const fc=+(v.querySelector('#ch-fc').value||0)||null;fermer();
      const res={rounds:R.rounds,restants:R.restants,tours:R.tours,plus:R.plus,temps:R.temps,derniere:R.derniere,arrete:R.arrete||null};
      opts.onFin({res,fc,ressenti:ressenti||null,regulations:R.regul,noRep:R.norep,versions:R.versions,notes});return}
    peindre()});
  // départ : un toucher (autorise le son sur iPad)
  v.innerHTML=`<div class="chr prep"><div class="ch-haut"><span>${esc(opts.athlete||'')}</span><span>${esc(opts.titreWod||'')}</span><span>${mmss(total-PREP)}</span></div>
    <p class="ch-titre">Prêts ?</p><p class="ch-sous">L’athlète se place. Le partenaire tient la tablette : il compte (+1), note les no rep et le temps restant.</p>
    <div class="ch-corps"><div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true)).join('')}</div></div>
    <div class="ch-bas"><button type="button" data-ch2="annuler">Annuler</button><button type="button" class="ch-ok" data-ch2="go">Départ (10 s)</button></div></div>`;
  v.querySelector('[data-ch2="go"]').onclick=()=>{son(1,.01,.001);t0=Date.now();eveil(true);tick=setInterval(peindre,200);peindre()};
  v.querySelector('[data-ch2="annuler"]').onclick=()=>{fermer();opts.onAnnule&&opts.onAnnule()};
  return {fermer};
}
root.CHRONO={lancer};
})(window);

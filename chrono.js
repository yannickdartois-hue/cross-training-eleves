/* =====================================================================
   chrono.js — chrono plein écran des WOD (TABATA, EMOM, EMOM+1, AMRAP, FOR TIME)
   Mécaniques reprises de l'appli « Cross Training Pompidou » (Yannick Dartois) :
   décompte 3 s, validation exercice par exercice (AMRAP, FOR TIME, EMOM+1), temps par tour
   et par palier, plancher du Tabata, note d'exécution sur 4 demandée après chaque exercice,
   son / vibreur / muet, couleurs de la minute. Ajouts : 3 critères observables par exercice (note /4 calculée),
   effort perçu 1 à 10, décision de régulation, coach et conseil, saisie légère ou complète (réglée par le prof),
   reprise après mise en veille ou rechargement (état transmis à l'appli par opts.onEtat).
   ===================================================================== */
(function(root){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ac=null,lock=null;
// Son / vibreur / muet : même réglage (et même clé) que l'appli d'origine
const MODES=[['sound','🔊 Son'],['vibrate','📳 Vibreur'],['silent','🔇 Muet']];
function mode(){try{return localStorage.getItem('eps_sound_mode')||'sound'}catch(e){return 'sound'}}
function modeSuivant(){const i=MODES.findIndex(x=>x[0]===mode()),n=MODES[(i+1)%MODES.length][0];try{localStorage.setItem('eps_sound_mode',n)}catch(e){}return n}
const libMode=()=>(MODES.find(x=>x[0]===mode())||MODES[0])[1];
function son(f,d,v){const m=mode();if(m==='silent')return;if(m==='vibrate'){try{navigator.vibrate&&navigator.vibrate(Math.round(Math.min(d,.5)*400)+40)}catch(e){}return}
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.frequency.value=f;g.gain.setValueAtTime(v||.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const bipCourt=()=>son(880,.12),bipGo=()=>son(1320,.45,.4);
const fanfare=()=>{[[523,0],[659,120],[784,240],[1047,380]].forEach(([f,d])=>setTimeout(()=>son(f,d===380?.4:.1,.45),d))};
async function eveil(on){try{if(on&&navigator.wakeLock)lock=await navigator.wakeLock.request('screen');else if(lock){lock.release();lock=null}}catch(e){}}
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const sec=s=>Math.round(s)+' s';

// Échelles de l'appli d'origine
const NOTES=[[1,'Insuffisant'],[2,'À améliorer'],[3,'Bien'],[4,'Très bien']];
const RESS=[[1,'😩','Épuisé'],[2,'😓','Très fatigué'],[3,'😐','Moyen'],[4,'🙂','Légèrement fatigué'],[5,'😄','Pas fatigué']];
// Effort perçu de 1 à 10 (échelle de Borg CR10) et critères observables de chaque mouvement
const RPE=['','Très très facile','Facile','Modéré','Un peu dur','Dur','Dur +','Très dur','Très dur +','Très très dur','Maximal'];
const CRIT=['Placement','Respiration','Amplitude'];
const REGLES=[['baisse','Je baisse','une version ou un niveau de moins'],['garde','Je garde','même travail'],['monte','Je monte','une version ou un niveau de plus'],['recup','J’allonge la récup','plus de repos entre les efforts']];
root.CT_NOTES=NOTES;root.CT_RESS=RESS;root.CT_RPE=RPE;root.CT_CRIT=CRIT;root.CT_REGLES=REGLES;
// note sur 4 calculée à partir des 3 critères : 0 réussi = 1, 1 = 2, 2 = 3, 3 = 4
const noteCrit=c=>c&&c.every(x=>x===0||x===1)?1+c.reduce((a,b)=>a+b,0):null;
root.CT_noteCrit=noteCrit;

/* W : {f,p,ordre,ex:[{m,v,reps,kg}]}
   opts : {athlete, titreWod, mv:id→mouvement, visuel:m→html, onFin(resultat), onAnnule(), onEtat(etat|null), reprise:etat} */
function lancer(W,opts){
  const PREP=3,p=W.p||{},ex=W.ex||[],N=Math.max(1,ex.length),snap=opts.reprise||null;
  const R=snap?snap.R:{rounds:[],restants:[],minutes:[],tours:0,amIdx:0,tourT:[],ftPal:0,ftEx:0,splits:[],temps:null,arrete:null,
    norep:0,regul:0,versions:ex.map(e=>e.v||0),notesLog:[],critLog:[],seq:0,echec:null,minuteFaite:-1};
  if(!R.critLog)R.critLog=[];
  const COMPLET=!!opts.complet; // saisie complète : critères demandés après chaque exercice, ressentis détaillés, commentaire et conseil obligatoires
  let dernierHtml='';
  let t0=null,pauseA=null,pauseMs=0,fini=false,tick=null,dernierS=-1,phaseVue=snap?snap.phaseVue||'':'',arret=false,dernierEtat=0;
  let file=[]; // exercices dont la note d'exécution est demandée (index)
  const repsE1=(j,i)=>W.f==='emom'?((ex[j]&&ex[j].reps)||7):((ex[j]&&ex[j].reps)||p.dep||6)+i;
  const SEQ=W.f==='emom'||W.f==='emom1'; // EMOM et EMOM+1 : exercices validés un par un (appli d'origine)
  const NBFT=p.pal?p.pal.length:(p.tours||3),sansCap=W.f==='fortime'&&p.pal&&!p.cap;
  const repsFT=j=>p.pal?p.pal[Math.min(R.ftPal,NBFT-1)]:((ex[j]&&ex[j].reps)||10);
  // plan des phases [type, durée s, index] ; décompte compris
  const plan=[['prep',PREP]];
  if(W.f==='tabata'){for(let i=0;i<p.n;i++){plan.push(['eff',p.e,i]);if(i<p.n-1)plan.push(['rep',p.r,i])}}
  else if(W.f==='emom'||W.f==='emom1'){for(let i=0;i<p.min;i++)plan.push(['min',60,i])}
  else if(W.f==='amrap')plan.push(['amrap',p.min*60,0]);
  else if(W.f==='fortime')plan.push(['ft',p.pal?(p.cap?p.cap*60:3600):(p.cap||6)*60,0]);
  const total=plan.reduce((a,x)=>a+x[1],0);
  const v=document.createElement('div');v.className='chrono-voile';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');
  document.body.appendChild(v);document.documentElement.classList.add('chrono-ouvert');
  const ecoule=()=>t0==null?0:((pauseA||Date.now())-t0-pauseMs)/1000;
  const effort=()=>Math.max(0,ecoule()-PREP);
  function ou(t){let a=0;for(let k=0;k<plan.length;k++){if(t<a+plan[k][1])return {k,ph:plan[k],dans:t-a,reste:a+plan[k][1]-t};a+=plan[k][1]}return null}
  const exo=i=>{const e=ex[i];return e?(opts.mv(e.m)||{nom:e.m}):null};
  const nomEx=i=>esc((exo(i)||{}).nom||'');
  const kg=i=>ex[i]&&ex[i].kg?' · '+ex[i].kg+' kg':'';
  const verLib=x=>x<0?'version −':x>0?'version +':'version normale';
  const video=e=>window.aVideo&&aVideo(e.m);
  function exoHTML(i,petit,reps,sansReg){const e=ex[i],m=exo(i);if(!m)return '';
    return `<div class="ch-exo${petit?' petit':''}"><div class="ch-img"${video(e)?` data-video="${e.m}" title="Voir la vidéo"`:''}>${opts.visuel(m)}${video(e)?'<span class="bt-video mini" aria-hidden="true">▶</span>':''}</div><div><b>${esc(m.nom)}</b>${reps!=null?`<span class="ch-reps">${reps}<small> rép.${kg(i)}</small></span>`:kg(i)?`<span>${kg(i).slice(3)}</span>`:''}<span class="ch-ver">${verLib(R.versions[i])}</span>
      ${sansReg?'':`<div class="ch-reg"><button type="button" data-ch="moins" data-i="${i}" aria-label="Version plus facile">−</button><button type="button" data-ch="plusv" data-i="${i}" aria-label="Version plus difficile">+</button></div>`}</div></div>`}
  // Objectif annoncé avant le WOD, comparé au résultat (connaissance de soi)
  function viseLib(){return W.f==='tabata'?['un plancher de','40','répétitions au round le plus faible']:W.f==='amrap'?['','30','tours complets']
    :W.f==='emom'||W.f==='emom1'?['',String(p.min),'minutes validées sur '+p.min]:W.f==='fortime'?['',String(NBFT),(p.pal?'paliers':'tours')+' terminés sur '+NBFT]:null}
  function realise(){if(W.f==='tabata'){const C=R.rounds.filter(x=>x!=null);return C.length?Math.min(...C):null}
    if(W.f==='amrap')return R.tours;if(W.f==='fortime')return R.ftPal;
    if(W.f==='emom1')return R.minutes.filter(m=>m&&m.ok).length;if(W.f==='emom')return R.restants.filter(x=>x>0).length;return null}
  const avenir=(j,txt)=>`<p class="ch-avenir">→ ${txt||'À venir'} : <b>${nomEx(j)}</b></p>`;
  const zone=r=>r>20?'z1':r>10?'z2':'z3'; // couleur de la minute : > 20 s, 10 à 20 s, < 10 s
  // saisie complète seulement : les critères sont demandés au partenaire après chaque exercice validé
  let nepC=[1,1,1];
  // 2 observations par exercice suffisent (critère retenu s'il est réussi au moins une fois sur deux) :
  // au-delà, la fenêtre couperait le WOD à chaque exercice (AMRAP, EMOM).
  const demanderNotes=L=>{if(!COMPLET)return;L.forEach(j=>{if(ex[j]&&!file.includes(j)&&R.critLog.filter(x=>x.j===j).length<2)file.push(j)})};
  function etat(force){if(!opts.onEtat)return;const t=Date.now();if(!force&&t-dernierEtat<1000)return;dernierEtat=t;
    try{opts.onEtat({v:1,R,ecoule:ecoule(),marche:!pauseA,phaseVue,fini,ts:t})}catch(e){}}

  function peindre(){
    if(fini)return;
    const t=ecoule(),o=ou(t);
    if(!o){terminer();return}
    const [typ,dur,i]=o.ph;
    const s=Math.ceil(o.reste);
    if(s!==dernierS){dernierS=s;
      const prochain=plan[o.k+1];
      if(s<=3&&s>=1&&(typ==='prep'||typ==='rep'||(prochain&&prochain[0]==='min')))bipCourt();
      if((typ==='eff'||typ==='amrap')&&s<=3&&s>=1)bipCourt()}
    const cle=o.k+'';if(cle!==phaseVue){const avant=phaseVue;phaseVue=cle;
      if(typ==='eff'||typ==='min'||typ==='amrap'||typ==='ft'){bipGo();file=[]}
      if(typ==='rep'){son(440,.18,.5);setTimeout(()=>son(440,.18,.5),250);demanderNotes([exoDuRound(i)])}
      if(typ==='min'&&SEQ){if(i>0&&R.restants[i-1]==null)R.restants[i-1]=0;if(i>0&&!R.minutes[i-1])R.minutes[i-1]={ok:0,stop:R.echec?R.echec.j:Math.min(R.seq,ex.length-1),partiel:R.echec?R.echec.n:0,auto:1};R.seq=0;R.echec=null}
      if(avant==='')file=[];
    }
    let couleur='prep',titre='Prêt ?',corps='',grand=mmss(o.reste),sous='';
    if(typ==='prep'){titre='Prêt ?';grand=String(Math.ceil(o.reste));const e0=W.f==='tabata'?exoDuRound(0):0;corps=exoHTML(e0,false,null);sous=esc(opts.titreWod||'');}
    else if(typ==='eff'){couleur='eff';titre='EFFORT';sous='Round '+(i+1)+' / '+p.n;const k=exoDuRound(i);
      const av=R.rounds.slice(0,i).filter(x=>x!=null),pre=i>0?R.rounds[i-1]:null,pl=av.length?Math.min(...av):null;
      const k2=i+1<p.n?exoDuRound(i+1):null;
      corps=exoHTML(k,false,null,true)+compteur(R.rounds[i]||0,'rép. ce round')
        +(i>0?`<p class="ch-repere">Round précédent : <b>${pre==null?'non compté':pre}</b>${pl!=null?' · ton plancher : <b>'+pl+'</b>':''}</p>`:'')
        +(k2!=null&&k2!==k?`<p class="ch-avenir">Ensuite : <b>${nomEx(k2)}</b></p>`:'');}
    else if(typ==='rep'){couleur='rep';titre='REPOS';const k=exoDuRound(i+1);sous='Round '+(i+1)+' : '+(R.rounds[i]==null?'non compté':R.rounds[i]+' rép.');
      if(R.rounds[i]==null)corps=`<div class="ch-rattrape"><b>Round ${i+1} non compté</b><span>Combien de répétitions ?</span><div class="fin-ligne"><select id="ch-rc" aria-label="Répétitions du round ${i+1}">${Array.from({length:41},(_,x)=>`<option value="${x}">${x}</option>`).join('')}</select><button type="button" class="ch-moyen" data-ch="rcok" data-i="${i}">Valider</button></div></div>`;else corps='';corps+=(k!==exoDuRound(i)?avenir(k,'À venir'):'<p class="ch-avenir">Même exercice au prochain round</p>')+exoHTML(k,true,null);}
    else if(typ==='min'&&SEQ){const M=R.minutes[i];couleur=M?'rep':zone(o.reste);titre='Minute '+(i+1)+' / '+p.min;
      sous=ex.map((e,j)=>repsE1(j,i)+' '+nomEx(j)).join(' · ');
      if(M&&M.ok)corps=`<div class="ch-bilan-min"><b>✓ Séquence terminée</b><span>${M.t} s d’effort · ${M.repos} s de repos</span></div>`;
      else if(M)corps=`<div class="ch-bilan-min ko"><b>✗ Non terminé</b><span>${M.partiel} / ${repsE1(M.stop,i)} rép. sur ${nomEx(M.stop)}</span></div>`;
      else if(R.echec)corps=partielHTML(nomEx(R.echec.j),repsE1(R.echec.j,i));
      else{const j=Math.min(R.seq,ex.length-1);
        corps=`<p class="ch-lab">Exercice ${j+1} / ${ex.length}</p>${exoHTML(j,false,repsE1(j,i))}
        <div class="ch-boutons"><button type="button" class="ch-gros ch-fini" data-ch="seqok">✓ Validé</button><button type="button" class="ch-moyen ch-ko" data-ch="seqko">✗ Non terminé</button>${R.seq>0?'<button type="button" class="ch-moyen" data-ch="sequndo">↩ Annuler</button>':''}</div>
        ${j+1<ex.length?avenir(j+1)+'<p class="ch-avenir">'+repsE1(j+1,i)+' rép.</p>':''}`}
      corps+=points(p.min,k=>R.minutes[k]?(R.minutes[k].ok?'ok':'ko'):k===i?'enc':'');
      if(M&&o.reste<=10&&i+1<p.min)corps=`<p class="ch-avenir">→ Minute ${i+2} : <b>${nomEx(0)}</b> · ${repsE1(0,i+1)} rép.</p>`+corps;}
    else if(typ==='min'){couleur=R.minuteFaite>=i?'rep':zone(o.reste);titre='Minute '+(i+1)+' / '+p.min;
      sous=R.minuteFaite>=i?'Repos : '+(R.restants[i]||0)+' s restantes':'Enchaîne : '+ex.map((e,j)=>(e.reps||'')+' '+nomEx(j)).join(' · ');
      corps=(R.minuteFaite>=i?'':`<button type="button" class="ch-gros ch-fini" data-ch="fini" data-i="${i}">Fini !<small>touche dès que la dernière répétition est faite</small></button>`)+`<div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true,e.reps||null)).join('')}</div>`
        +points(p.min,k=>k<i||R.minuteFaite>=k?(R.restants[k]>0?'ok':'ko'):k===i?'enc':'');
      if(o.reste<=10&&i+1<p.min&&R.minuteFaite>=i)corps=avenir(0,'Minute '+(i+2))+corps;}
    else if(typ==='amrap'){couleur='eff am'+(R.tours%4);titre='AMRAP · tour '+(R.tours+1);const j=R.amIdx;
      sous=R.tours+' tour'+(R.tours>1?'s':'')+' complet'+(R.tours>1?'s':'')+(j?' + '+j+'/'+ex.length+' exercice'+(j>1?'s':''):'');
      corps=`<p class="ch-lab">Exercice ${j+1} / ${ex.length} · tour ${R.tours+1}</p>${exoHTML(j,false,(ex[j]||{}).reps||null)}
        <div class="ch-boutons"><button type="button" class="ch-gros ch-fini" data-ch="amok">✓ Validé</button>${R.tours||j?'<button type="button" class="ch-moyen" data-ch="amundo">↩ Annuler</button>':''}</div>
        ${avenir(j+1<ex.length?j+1:0,j+1<ex.length?'À venir':'Tour suivant')}`;}
    else if(typ==='ft'){couleur='eff';titre='FOR TIME';grand=mmss(o.dans);const k=Math.min(R.ftPal,NBFT-1),j=R.ftEx;
      sous=(p.pal?'Palier '+(k+1)+' / '+NBFT+' : '+p.pal[k]+' rép. de chaque exercice':'Tour '+(k+1)+' / '+NBFT)+(p.pal&&!p.cap?' · sans limite de temps':' · limite '+(p.cap||6)+' min');
      corps=`<p class="ch-lab">Exercice ${j+1} / ${ex.length}</p>${exoHTML(j,false,repsFT(j))}
        <div class="ch-boutons"><button type="button" class="ch-gros ch-fini" data-ch="ftok">✓ Validé</button>${R.ftPal||j?'<button type="button" class="ch-moyen" data-ch="ftundo">↩ Annuler</button>':''}</div>
        ${j+1<ex.length?avenir(j+1):k+1<NBFT?`<p class="ch-avenir">→ ${p.pal?'Palier '+(k+2)+' : '+p.pal[k+1]+' rép.':'Tour '+(k+2)} · <b>${nomEx(0)}</b></p>`:'<p class="ch-avenir">Dernier exercice !</p>'}
        ${points(NBFT,x=>x<R.ftPal?'ok':x===R.ftPal?'enc':'',x=>p.pal?p.pal[x]:x+1)}`;}
    const fin=Math.max(0,total-t);
    const mc=file.length?(exo(file[0])||{}).c||[]:[];
    const nep=file.length?`<div class="ch-nep" role="dialog" aria-label="Critères d’exécution"><p>Exécution · le coach regarde</p><b>${nomEx(file[0])}</b>
      <div class="ch-crit">${CRIT.map((c,k)=>`<button type="button" class="${nepC[k]?'ok':'ko'}" data-ch="nepc" data-k="${k}"><b>${nepC[k]?'✓':'✗'} ${c}</b><small>${esc(mc[k]||'')}</small></button>`).join('')}</div>
      <p class="ch-lab">Touche un critère pour le passer en ✗ · note ${noteCrit(nepC)}/4 ${esc(NOTES[noteCrit(nepC)-1][1])}</p>
      <div class="ch-boutons"><button type="button" class="ch-nep-p" data-ch="nepskip">Passer</button><button type="button" class="ch-gros ch-fini" data-ch="nepok">Valider</button></div></div>`:'';
    // L'écran n'est reconstruit que s'il change : sinon les boutons seraient remplacés 5 fois par seconde
    // (un appui « +1 » pourrait se perdre, la page ne pourrait pas défiler). Les temps sont mis à jour à part.
    const html=`<div class="chr ${couleur}${pauseA?' pause':''}"><div class="ch-haut"><span>${esc(opts.athlete||'')}</span><span>${esc(opts.titreWod||'')}</span></div>
      <p class="ch-titre">${titre}</p><p class="ch-temps"></p>${sansCap?'':'<p class="ch-reste-l">Temps total restant <span class="ch-reste"></span></p>'}<p class="ch-sous">${sous}</p>
      <div class="ch-corps">${corps}</div>
      <div class="ch-bas"><button type="button" class="ch-norep" data-ch="norep"${pauseA||typ==='rep'||typ==='prep'?' disabled':''}>No rep <b>${R.norep}</b></button><button type="button" data-ch="pause">${pauseA?'Reprendre':'Pause'}</button><button type="button" data-ch="sonmode">${libMode()}</button><button type="button" data-ch="stop" class="${arret?'confirme':''}">${arret?'Sûr ? Retoucher':'Arrêter'}</button></div>${nep}</div>`;
    if(html!==dernierHtml){const c=v.querySelector('.chr'),y=c?c.scrollTop:0,av=[...v.querySelectorAll('.ch-img')];v.innerHTML=html;dernierHtml=html;
      // l'image d'un exercice déjà affichée est remise telle quelle (sinon elle scintille à chaque « +1 »)
      v.querySelectorAll('.ch-img').forEach((n,k)=>{const o=av.find(x=>x.innerHTML===n.innerHTML);if(o){av.splice(av.indexOf(o),1);n.replaceWith(o)}});
      const n=v.querySelector('.chr');if(n&&y)n.scrollTop=y}
    v.querySelector('.ch-temps').textContent=grand;const rs=v.querySelector('.ch-reste');if(rs)rs.textContent=mmss(fin);
    etat();
  }
  function exoDuRound(i){return root.CTL.exoDuRound(W,i)}
  const points=(nb,cl,lab)=>`<div class="ch-pts">${Array.from({length:nb},(_,k)=>`<span class="${cl(k)}">${lab?lab(k):k+1}</span>`).join('')}</div>`;
  const compteur=(n,l)=>`<button type="button" class="ch-gros ch-plus" data-ch="plus">+1<small>${n} ${l}</small></button><button type="button" class="ch-moins1" data-ch="moins1">− 1</button>`;
  const partielHTML=(nom,cible)=>`<div class="ch-bilan-min ko"><b>✗ Non terminé · ${nom}</b><span>Répétitions faites sur ${cible} :</span>
        <div class="ch-part"><button type="button" data-ch="partm" aria-label="Une de moins">−</button><output>${R.echec.n}</output><button type="button" data-ch="partp" aria-label="Une de plus">+</button></div>
        <div class="ch-boutons"><button type="button" class="ch-moyen" data-ch="partann">← Annuler</button><button type="button" class="ch-gros ch-ko" data-ch="partok">Confirmer</button></div></div>`;

  /* ---------- Bilan détaillé (comme les bilans de l'appli d'origine) ---------- */
  const barres=(L,lab,col,txt)=>{const mx=Math.max(1,...L);return `<div class="ch-barres">${L.map((x,k)=>`<div><small>${txt&&txt(k)!=null?txt(k):x}</small><i style="height:${Math.max(4,Math.round(x/mx*70))}px;background:${col(x,k)}"></i><small>${lab(k)}</small></div>`).join('')}</div>`};
  function viseHTML(){if(R.vise==null)return '';const r=realise();if(r==null)return '';const d=r-R.vise;
    return `<p class="ch-visee ${d===0?'juste':Math.abs(d)<=1?'proche':'loin'}">🎯 Visé : <b>${R.vise}</b> · réalisé : <b>${r}</b> ${d===0?'· pile !':d>0?'· +'+d+' : tu peux viser plus haut':'· '+d+' : objectif trop ambitieux aujourd’hui'}</p>`}
  function bilanHTML(){return viseHTML()+bilanHTML0()}
  function bilanHTML0(){
    const sumReps=k=>ex.slice(0,k).reduce((a,e)=>a+(+e.reps||0),0);
    if(W.f==='tabata'){const L=R.rounds.map(x=>x==null?null:x);if(!L.length)return '';const C=L.filter(x=>x!=null),nc=L.length-C.length;
      if(!C.length)return `<div class="ch-bil"><p><b>Aucun round compté</b> : pas de score pour ce Tabata.</p></div>`;
      const mn=Math.min(...C),mx=Math.max(...C),tot=C.reduce((a,b)=>a+b,0);
      return `<div class="ch-bil"><p><b>Score plancher : ${mn} rép.</b> · total ${tot} rép.</p>${barres(L.map(x=>x||0),k=>'C'+(k+1),(x,k)=>L[k]==null?'#cbd5e1':x===mn?'#fca5a5':x===mx?'#86efac':'#fed7aa',k=>L[k]==null?'–':null)}<p class="ch-legende">Rouge = le round le plus faible (plancher) · vert = le meilleur${nc?` · gris = non compté (${nc}), hors du score`:''}</p></div>`}
    if(W.f==='amrap'){const T=R.tourT.map((x,k)=>Math.round(x-(k?R.tourT[k-1]:0)));const tot=R.tours*sumReps(N)+sumReps(R.amIdx);
      let h=`<div class="ch-bil"><p><b>${R.tours} tour${R.tours>1?'s':''} complet${R.tours>1?'s':''}</b>${R.amIdx?' + '+R.amIdx+'/'+ex.length+' exercice'+(R.amIdx>1?'s':''):''} · ${tot} rép. au total</p>`;
      if(T.length){const moy=Math.round(T.reduce((a,b)=>a+b,0)/T.length);h+=`<p>Temps moyen par tour : <b>${moy} s</b> · meilleur ${Math.min(...T)} s · moins bon ${Math.max(...T)} s</p>`;
        if(T.length>1)h+=barres(T,k=>'T'+(k+1),x=>x<=moy?'#86efac':'#fca5a5')+'<p class="ch-lab">Vert : sous la moyenne. Rouge : au-dessus.</p>'}
      return h+'</div>'}
    if(SEQ){const ok=R.minutes.filter(m=>m&&m.ok),tm=ok.length?Math.round(ok.reduce((a,m)=>a+m.t,0)/ok.length):0;
      return `<div class="ch-bil"><p><b>${ok.length} / ${p.min} minutes validées</b>${tm?' · séquence moyenne '+tm+' s · meilleure '+Math.min(...ok.map(m=>m.t))+' s':''}</p><ul>${R.minutes.map((m,k)=>m?`<li>Minute ${k+1} : ${m.ok?'✓ '+m.t+' s · repos '+m.repos+' s':'✗ '+(m.auto&&!m.partiel?'pas terminé':m.partiel+' / '+repsE1(m.stop,k)+' rép. sur '+nomEx(m.stop))}</li>`:'').join('')}</ul></div>`}
    if(W.f==='fortime'){const ok=R.ftPal>=NBFT;
      return `<div class="ch-bil"><p><b>${ok?'✓ Terminé en '+mmss(R.temps):'✗ '+(p.cap&&R.temps?'Temps limite atteint':'Arrêté')+' · '+R.ftPal+' / '+NBFT+(p.pal?' paliers':' tours')}</b></p>
        ${R.splits.length?`<ul>${R.splits.map((x,k)=>`<li>${p.pal?'Palier '+(k+1)+' ('+p.pal[k]+' rép.)':'Tour '+(k+1)} : ${mmss(x)} (+${mmss(x-(k?R.splits[k-1]:0))})</li>`).join('')}</ul>`:''}</div>`}
    return '';
  }

  function terminer(){if(fini)return;fini=true;clearInterval(tick);eveil(false);fanfare();file=[];
    const t=ecoule(),te=Math.max(0,t-PREP);
    if(W.f==='fortime'){R.tours=R.ftPal;if(R.temps==null){if(p.pal&&!p.cap)R.arrete=Math.round(te);else R.temps=Math.round(Math.min(te,(p.pal?p.cap:(p.cap||6))*60))}}
    if(SEQ){const o=ou(Math.min(t,total-.01)),k=o&&o.ph[0]==='min'?o.ph[2]:(t>=total?p.min-1:-1);for(let m=0;m<=k;m++)if(!R.minutes[m])R.minutes[m]={ok:0,stop:m===k?Math.min(R.seq,ex.length-1):0,partiel:m===k&&R.echec?R.echec.n:0,auto:1}}
    if(W.f==='emom')R.minutes.forEach((m,i)=>{if(m&&R.restants[i]==null)R.restants[i]=m.ok?m.repos:0});
    if(W.f==='tabata'){const fait=Math.min(p.n,Math.ceil(te/(p.e+p.r)));for(let i=0;i<fait;i++)if(R.rounds[i]==null)R.rounds[i]=null} // non compté : reste vide, hors du score
    // note proposée = moyenne des notes données pendant le WOD
    // critères proposés : réussis au moins une fois sur deux pendant le WOD
    ex.forEach((e,j)=>{const L=R.critLog.filter(x=>x.j===j);crit[j]=L.length?[0,1,2].map(k=>L.filter(x=>x.c[k]).length*2>=L.length?1:0):[1,1,1];vu[j]=!!L.length});
    peindreFin();etat(true);
  }
  const fourch=opts.fourchette||null;
  function regleConseillee(){const f=+fc||0;if(fourch&&f&&f>fourch[1]||rpe>=9)return 'baisse';if(fourch&&f&&f<fourch[0]||rpe&&rpe<=3)return 'monte';return rpe||f?'garde':''}
  const manque=()=>{const L=[];if(String(fc).trim()&&(isNaN(+fc)||+fc<40||+fc>230))L.push('une FC possible (entre 40 et 230)');if(!rpe)L.push('l’effort perçu');if(!regle)L.push('ta décision pour le prochain WOD');if(COMPLET&&com.trim().length<3)L.push('le commentaire');if(COMPLET&&conseil.trim().length<3)L.push('le conseil du coach');return L};
  /* ---------- Prise du pouls assistée : 15 s comptées, battements × 4 ---------- */
  const PL={etat:'',debut:0,n:'',rec:false};let poulsT=null,fcRec='',pourquoi='';
  const POURQUOI=['Fatigue','Manque de sommeil','Exercice mal maîtrisé','Stress','Peu motivé(e)','Je ne sais pas'];
  const CONS_GEN=['Ralentis pour bien te placer','Souffle à l’effort, inspire au retour','Va au bout du mouvement, quitte à faire moins de répétitions'];
  const alerte=()=>+fc>200||(rpe===10&&opts.rpeAvant===10);
  const contradiction=()=>{const e=fcEtat(fc);return !!(fc&&rpe&&((e==='dans'||e==='bas')&&rpe>=8||e==='haut'&&rpe<=3))};
  const ICO={baisse:'↓',garde:'=',monte:'↑',recup:'⏱'};
  const ECG='M0 20H28L33 17L38 20H44L47 25L51 3L55 34L59 20H68Q74 13 80 20H100';
  const ecgPath=()=>[0,100,200,300].map(x=>`<path d="${ECG}" transform="translate(${x} 0)"/>`).join('');
  function fcEtat(v){v=+v;if(!fourch||!v)return '';return v<fourch[0]?'bas':v>fourch[1]?'haut':'dans'}
  function fcTexte(v){const e=fcEtat(v);return e==='dans'?'dans ta fourchette':e==='bas'?'sous ta fourchette':e==='haut'?'au-dessus de ta fourchette':''}
  function poulsHTML(){
    if(PL.etat==='attente'){const r=Math.max(0,60-Math.floor((Date.now()-PL.debut)/1000));
      return `<div class="pl-boite rec"><p class="pl-c"><b>Récupère, reste debout et marche doucement.</b></p><div class="pl-t">${r}</div><p class="pl-c">Au bip, pose tes doigts et compte 15 s.</p><button type="button" class="fin-lien" data-ch="poulsx">Annuler</button></div>`}
    if(PL.etat==='compte'){const r=Math.max(0,15-Math.floor((Date.now()-PL.debut)/1000));
      return `<div class="pl-boite"><div class="pl-coeur" aria-hidden="true"><svg viewBox="0 0 32 29"><path d="M16 29 2.6 15.4A8 8 0 0 1 14 4.2L16 6.2l2-2A8 8 0 0 1 29.4 15.4Z"/></svg></div>
        <div class="pl-t" aria-live="polite">${r}</div><p class="pl-c">Compte tes battements… le bip te dira d’arrêter.</p>
        <svg class="pl-ecg" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><g class="pl-defile">${ecgPath()}</g></svg>
        <button type="button" class="fin-lien" data-ch="poulsx">Annuler</button></div>`}
    if(PL.etat==='saisie'){const n=+PL.n,ok=n>=10&&n<=58,b=n*4;
      return `<div class="pl-boite"><label for="ch-batt" class="pl-c"><b>${PL.rec?'Récupération : c':'C'}ombien de battements as-tu comptés ?</b></label>
        <input id="ch-batt" type="number" inputmode="numeric" min="5" max="60" placeholder="ex. 38" value="${esc(PL.n)}">
        <p class="pl-res ${ok?fcEtat(b):''}">${ok?`${n} × 4 = <b>${b} pulsations/min</b>${fcTexte(b)?' · '+fcTexte(b):''}`:'Tape le nombre compté : l’appli le multiplie par 4.'}</p>
        <div class="fin-ligne"><button type="button" class="fin-bt" data-ch="poulsre">Recommencer</button><button type="button" class="fin-bt plein" data-ch="poulsok"${ok?'':' disabled'}>Valider ${ok?b:''}</button></div></div>`}
    const fv=+fc,rv=+fcRec;
    if(fv>=40&&fv<=230)return (rv?`<p class="pl-recup">Récupération : <b>${fv} → ${rv}</b> · <b>−${Math.max(0,fv-rv)}</b> pulsations en 1 min${fv-rv>=30?' : très bonne récupération':fv-rv>=20?' : bonne récupération':' : récupération lente'}</p>`:
      `<button type="button" class="pl-go rec" data-ch="poulsrec"><span class="pl-mini" aria-hidden="true">⏱</span><span><b>FC de récupération</b><small>Reprends ton pouls dans 1 min : on mesure combien il a baissé</small></span></button>`);
    return `<button type="button" class="pl-go" data-ch="pouls"><span class="pl-mini" aria-hidden="true">❤</span><span><b>Prendre mon pouls</b><small>Deux doigts sur le cou ou le poignet, puis touche : 15 s</small></span></button>`}
  function poulsTick(){if(PL.etat==='attente'){const r=60-(Date.now()-PL.debut)/1000,t=v.querySelector('.pl-t');
      if(r<=0){PL.etat='compte';PL.debut=Date.now();son(880,.15,.5);try{navigator.vibrate&&navigator.vibrate(120)}catch(x){}lireChamps();peindreFin()}else if(t)t.textContent=Math.ceil(r);return}
    if(PL.etat!=='compte'){clearInterval(poulsT);poulsT=null;return}
    const r=15-(Date.now()-PL.debut)/1000,t=v.querySelector('.pl-t');
    if(r<=0){clearInterval(poulsT);poulsT=null;PL.etat='saisie';son(660,.3,.6);setTimeout(()=>son(660,.3,.6),350);try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(x){}
      lireChamps();peindreFin();const i=v.querySelector('#ch-batt');if(i)i.focus();return}
    if(t)t.textContent=Math.ceil(r)}
  const etapes=()=>{const fv=String(fc).trim();return {pouls:!!fv&&+fv>=40&&+fv<=230,exe:ex.every((e,j)=>vu[j]),effort:!!rpe,decision:!!regle,
    coach:COMPLET?com.trim().length>=3&&conseil.trim().length>=3:!!(coach||conseil.trim()||com.trim())}};
  function majFin(){const E=etapes();Object.keys(E).forEach(k=>{const el=v.querySelector(`[data-et="${k}"]`);if(el)el.classList.toggle('faite',E[k])});
    const ok=!manque().length,b=v.querySelector('[data-ch="enreg"]'),h=v.querySelector('.ch-indic');if(b)b.disabled=!ok;if(h){h.textContent=ok?'✓ Prêt à enregistrer':'Il manque : '+manque().join(', ');h.classList.toggle('pret',ok)}
    const c=v.querySelector('.fin-fc');if(c){const e=fcEtat(fc);c.className='fin-fc '+e;c.textContent=fourch?`Fourchette de ton mobile : ${fourch[0]} à ${fourch[1]}${e?' · '+fcTexte(fc):''}`:''}}
  function peindreFin(){
    const pret=!manque().length,rc=regleConseillee(),coachs=opts.coachs||[],E=etapes();
    const et=(k,n,titre,sous,corps)=>`<section class="fin-et${E[k]?' faite':''}" data-et="${k}"><h4><span class="fin-n" aria-hidden="true"><i>${n}</i></span>${titre}${sous?` <small>${sous}</small>`:''}</h4>${corps}</section>`;
    v.innerHTML=`<div class="chr fin"><p class="ch-titre">Terminé</p><p class="ch-sous">${esc(opts.athlete||'')} · ${esc(opts.titreWod||'')}</p>
      <div class="ch-form">
      ${et('pouls',1,'Mon pouls','tout de suite après l’effort',`${poulsHTML()}
        <label for="ch-fc" class="fin-petit">Ma fréquence cardiaque (calculée, ou lue sur une montre)</label><input id="ch-fc" type="number" inputmode="numeric" min="40" max="230" placeholder="ex. 152" value="${fc||''}">
        ${fourch?`<p class="fin-fc ${fcEtat(fc)}">Fourchette de ton mobile : ${fourch[0]} à ${fourch[1]}${fcEtat(fc)?' · '+fcTexte(fc):''}</p>`:''}`)}
      ${bilanHTML()}
      ${et('exe',2,'L’exécution','tout est proposé réussi : le coach touche ce qui est raté, puis « J’ai regardé »'+(R.critLog.length?' · proposé d’après le WOD':''),`<div class="ch-notes">${ex.map((e,j)=>{const n=noteCrit(crit[j]);return `<div class="ch-note${vu[j]?'':' a-voir'}"><span>${nomEx(j)}${n&&vu[j]?` <small>· ${n}/4 ${esc(NOTES[n-1][1])}</small>`:''}</span><span class="ch-c3">${CRIT.map((c,k)=>`<button type="button" class="${crit[j][k]===1?'ok':crit[j][k]===0?'ko':''}" data-ch="crit" data-i="${j}" data-k="${k}">${crit[j][k]===1?'✓ '+c:crit[j][k]===0?'✗ '+c:c+' ?'}</button>`).join('')}${vu[j]?'':`<button type="button" class="vu" data-ch="vu" data-i="${j}">J’ai regardé</button>`}</span></div>`}).join('')}</div>`)}
      ${et('effort',3,'Mon effort','de 1 (très facile) à 10 (maximal) · obligatoire',`<div class="ch-rpe">${RPE.slice(1).map((l,k)=>`<button type="button" class="r${k+1}${rpe===k+1?' on':''}" data-ch="rpe" data-v="${k+1}"><b>${k+1}</b>${l}</button>`).join('')}</div>
        ${COMPLET?`<p class="ch-lab">Où l’as-tu senti ? (1 = rien, 5 = au maximum)</p><div class="ch-dims">${[['mu','Muscles'],['so','Souffle'],['te','Tête']].map(([d,l])=>`<div><span>${l}</span>${[1,2,3,4,5].map(x=>`<button type="button" class="${dims[d]===x?'on':''}" data-ch="dim" data-d="${d}" data-v="${x}">${x}</button>`).join('')}</div>`).join('')}</div>`:''}`)}
      ${alerte()?`<div class="fin-alerte" role="alert">⚠ <b>Préviens ton professeur</b> ${+fc>200?'(FC au-dessus de 200)':'(effort maximal deux WOD de suite)'} avant de continuer.</div>`:''}
      ${et('decision',4,'Ma décision pour le prochain WOD','obligatoire',`${contradiction()?`<div class="fin-pourquoi"><p><b>Ton ressenti et ta FC ne disent pas la même chose.</b> ${fcEtat(fc)==='haut'?'Ta FC est haute mais tu as trouvé ça facile':'Ta FC est dans ta fourchette ou en dessous, mais tu as trouvé ça très dur'}. Pourquoi, d’après toi ?</p><div class="fin-chips">${POURQUOI.map(x=>`<button type="button" class="${pourquoi===x?'on':''}" data-ch="pourquoi" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`:''}${rc?`<p class="fin-conseil">Conseillé d’après ta FC et ton effort : <b>${esc(REGLES.find(x=>x[0]===rc)[1])}</b></p>`:''}
        <div class="ch-regle">${REGLES.map(([k,l,d])=>`<button type="button" class="${regle===k?'on':''}${rc===k?' conseil':''}" data-ch="regle" data-v="${k}"><i aria-hidden="true">${ICO[k]}</i><span><b>${l}</b>${d}</span></button>`).join('')}</div>`)}
      ${et('coach',5,'Coach et commentaires',COMPLET?'obligatoire':'facultatif',`${coachs.length?`<label for="ch-coach" class="ch-lab">Coach (celui qui a regardé et compté)</label><select id="ch-coach">${coachs.map(n=>`<option${n===coach?' selected':''}>${esc(n)}</option>`).join('')}<option value=""${coach?'':' selected'}>Personne (seul)</option></select>`:''}
        ${(()=>{const L=[];ex.forEach((e,j)=>{if(!vu[j])return;const m=exo(j)||{};(crit[j]||[]).forEach((c,k)=>{if(c===0)L.push([nomEx(j)+' · '+CRIT[k].toLowerCase(),((m.c||[])[k]||CONS_GEN[k]).replace(/\.$/,'')])})});
          return L.length?`<p class="ch-lab">Conseils proposés (critères ratés) : touche pour l’ajouter</p><div class="fin-chips cons">${L.map(([t,c])=>`<button type="button" data-ch="cons" data-v="${esc(t.replace(/<[^>]+>/g,'')+' : '+c+'.')}"><small>${t}</small>${esc(c)}</button>`).join('')}</div>`:''})()}
        <label for="ch-cons" class="ch-lab">Conseil du coach pour la suite</label><textarea id="ch-cons" rows="2" placeholder="ex. descends plus bas au squat, garde le dos droit">${esc(conseil)}</textarea>
        <label for="ch-com" class="ch-lab">Décris ce WOD : ce qui était difficile, ce que tu as réussi</label><textarea id="ch-com" rows="2">${esc(com)}</textarea>`)}
      </div>
      <div class="fin-pied"><p class="ch-lab ch-indic${pret?' pret':''}">${pret?'✓ Prêt à enregistrer':'Il manque : '+manque().join(', ')}</p>
      <div class="ch-bas"><button type="button" data-ch="annuler" class="${jeter?'confirme':''}">${jeter?'Sûr ? Le WOD sera perdu':'Ne pas enregistrer'}</button><button type="button" class="ch-ok" data-ch="enreg"${pret?'':' disabled'}>Enregistrer</button></div></div></div>`;
  }
  let ressenti=0,com='',fc='',jeter=false,rpe=0,regle='',conseil='',coach=opts.coach||'';const notes=ex.map(()=>null),crit=ex.map(()=>[null,null,null]),vu=ex.map(()=>false),dims={};
  const lireChamps=()=>{const g=id=>v.querySelector(id);if(g('#ch-com'))com=g('#ch-com').value;if(g('#ch-cons'))conseil=g('#ch-cons').value;if(g('#ch-fc'))fc=g('#ch-fc').value;if(g('#ch-coach'))coach=g('#ch-coach').value};
  function fermer(){clearInterval(tick);clearInterval(poulsT);eveil(false);v.remove();document.documentElement.classList.remove('chrono-ouvert');document.removeEventListener('visibilitychange',vis)}
  const vis=()=>{if(document.visibilityState==='hidden')etat(true)};
  document.addEventListener('visibilitychange',vis);
  v.addEventListener('input',e=>{if(!fini)return;
    if(e.target.id==='ch-batt'){PL.n=e.target.value;const n=+PL.n,ok=n>=10&&n<=58,b=n*4,r=v.querySelector('.pl-res'),bt=v.querySelector('[data-ch="poulsok"]');
      if(r){r.className='pl-res '+(ok?fcEtat(b):'');r.innerHTML=ok?`${n} × 4 = <b>${b} pulsations/min</b>${fcTexte(b)?' · '+fcTexte(b):''}`:'Tape le nombre compté : l’appli le multiplie par 4.'}
      if(bt){bt.disabled=!ok;bt.textContent='Valider '+(ok?b:'')}return}
    lireChamps();majFin()});
  v.addEventListener('change',e=>{if(fini&&e.target.id==='ch-coach')coach=e.target.value});
  v.addEventListener('click',e=>{const b=e.target.closest('[data-ch]');if(!b)return;const a=b.dataset.ch,t=ecoule(),o=ou(t),te=Math.max(0,t-PREP);
    if(a!=='stop')arret=false;
    if(a==='nepc'){const k=+b.dataset.k;nepC[k]=nepC[k]?0:1;peindre();return}
    if(a==='nepok'||a==='nepskip'){const j=file.shift();if(a==='nepok'&&j!=null)R.critLog.push({j,c:nepC.slice()});nepC=[1,1,1];peindre();return}
    if(a==='plus'&&o&&o.ph[0]==='eff'){const i=o.ph[2];R.rounds[i]=(R.rounds[i]||0)+1;try{navigator.vibrate&&navigator.vibrate(25)}catch(x){}}
    else if(a==='moins1'&&o&&o.ph[0]==='eff'){const i=o.ph[2];R.rounds[i]=Math.max(0,(R.rounds[i]||0)-1)}
    else if(a==='norep')R.norep++;
    else if(a==='rcok'){const i=+b.dataset.i,se=v.querySelector('#ch-rc');if(se)R.rounds[i]=+se.value}
    else if(a==='moins'||a==='plusv'){const i=+b.dataset.i,nv=Math.max(-1,Math.min(1,R.versions[i]+(a==='moins'?-1:1)));if(nv!==R.versions[i]){R.versions[i]=nv;R.regul++}}
    // EMOM
    else if(a==='fini'&&o&&o.ph[0]==='min'){const i=+b.dataset.i;if(R.minuteFaite<i){R.minuteFaite=i;R.restants[i]=Math.round(o.reste);son(660,.1,.4);demanderNotes(ex.map((_,j)=>j))}}
    // EMOM+1
    else if(a==='seqok'&&o&&o.ph[0]==='min'&&!R.minutes[o.ph[2]]){const i=o.ph[2];son(880,.07,.3);R.seq++;
      if(R.seq>=ex.length){R.minutes[i]={ok:1,t:Math.max(1,Math.round(o.dans)),repos:Math.max(0,Math.round(o.reste))};R.restants[i]=R.minutes[i].repos;R.minuteFaite=i;son(660,.1,.4);setTimeout(()=>son(880,.15,.5),150);demanderNotes(ex.map((_,j)=>j))}}
    else if(a==='sequndo'&&R.seq>0)R.seq--;
    else if(a==='seqko'&&o&&o.ph[0]==='min')R.echec={j:Math.min(R.seq,ex.length-1),n:0};
    else if(a==='partm'&&R.echec)R.echec.n=Math.max(0,R.echec.n-1);
    else if(a==='partp'&&R.echec)R.echec.n++;
    else if(a==='partann')R.echec=null;
    else if(a==='partok'&&R.echec&&o&&o.ph[0]==='min'){R.minutes[o.ph[2]]={ok:0,stop:R.echec.j,partiel:R.echec.n};R.restants[o.ph[2]]=0;R.echec=null}
    // AMRAP exercice par exercice
    else if(a==='amok'&&o&&o.ph[0]==='amrap'){const j=R.amIdx;demanderNotes([j]);R.amIdx++;
      if(R.amIdx>=ex.length){R.amIdx=0;R.tours++;R.tourT.push(Math.round(te));son(660,.15,.4);setTimeout(()=>son(880,.15,.4),180)}else son(880,.08,.3)}
    else if(a==='amundo'){if(R.amIdx>0)R.amIdx--;else if(R.tours>0){R.tours--;R.amIdx=ex.length-1;R.tourT.pop()}}
    // FOR TIME exercice par exercice, temps de chaque palier
    else if(a==='ftok'&&o&&o.ph[0]==='ft'){const j=R.ftEx;demanderNotes([j]);R.ftEx++;son(880,.07,.3);
      if(R.ftEx>=ex.length){R.ftEx=0;R.splits.push(Math.round(te));R.ftPal++;son(660,.1,.4);
        if(R.ftPal>=NBFT){R.temps=Math.round(te);file=[];terminer();return}}}
    else if(a==='ftundo'){if(R.ftEx>0)R.ftEx--;else if(R.ftPal>0){R.ftPal--;R.ftEx=ex.length-1;R.splits.pop()}}
    else if(a==='sonmode'){modeSuivant();if(mode()==='vibrate')try{navigator.vibrate&&navigator.vibrate(60)}catch(x){}}
    else if(a==='pause'){if(pauseA){pauseMs+=Date.now()-pauseA;pauseA=null}else pauseA=Date.now();etat(true)}
    else if(a==='stop'){if(!arret){arret=true}else{if(W.f!=='fortime')R.arrete=Math.round(te);terminer();return}}
    else if(a==='pouls'){lireChamps();PL.rec=false;PL.etat='compte';PL.debut=Date.now();PL.n='';son(880,.15,.5);try{navigator.vibrate&&navigator.vibrate(80)}catch(x){}peindreFin();clearInterval(poulsT);poulsT=setInterval(poulsTick,200);return}
    else if(a==='poulsre'){lireChamps();PL.etat='';PL.n='';if(PL.rec){PL.etat='compte';PL.debut=Date.now();son(880,.15,.5);clearInterval(poulsT);poulsT=setInterval(poulsTick,200)}peindreFin();return}
    else if(a==='poulsx'){lireChamps();clearInterval(poulsT);poulsT=null;PL.etat='';PL.rec=false;peindreFin();return}
    else if(a==='poulsok'){lireChamps();const n=+PL.n;if(n>=10&&n<=58){if(PL.rec)fcRec=String(n*4);else fc=String(n*4);PL.etat='';PL.n='';PL.rec=false;jeter=false;peindreFin()}return}
    else if(a==='poulsrec'){lireChamps();PL.etat='attente';PL.rec=true;PL.debut=Date.now();PL.n='';peindreFin();clearInterval(poulsT);poulsT=setInterval(poulsTick,200);return}
    else if(a==='pourquoi'){lireChamps();pourquoi=pourquoi===b.dataset.v?'':b.dataset.v;peindreFin();return}
    else if(a==='cons'){lireChamps();const t=b.dataset.v;conseil=(conseil.trim()?conseil.trim()+' ':'')+t;peindreFin();return}
    else if(a==='crit'){lireChamps();const i=+b.dataset.i,k=+b.dataset.k;crit[i][k]=crit[i][k]===1?0:1;vu[i]=true;jeter=false;peindreFin();return}
    else if(a==='vu'){lireChamps();vu[+b.dataset.i]=true;peindreFin();return}
    else if(a==='rpe'){lireChamps();rpe=+b.dataset.v;jeter=false;peindreFin();return}
    else if(a==='dim'){lireChamps();dims[b.dataset.d]=+b.dataset.v;peindreFin();return}
    else if(a==='regle'){lireChamps();regle=b.dataset.v;jeter=false;peindreFin();return}
    else if(a==='annuler'&&!jeter){lireChamps();jeter=true;peindreFin();return}
    else if(a==='annuler'){fermer();opts.onEtat&&opts.onEtat(null);opts.onAnnule&&opts.onAnnule();return}
    else if(a==='enreg'){lireChamps();const fcv=+fc||null;if(manque().length)return;fermer();ex.forEach((e,j)=>{if(!vu[j])crit[j]=[null,null,null];notes[j]=noteCrit(crit[j])});
      const res={rounds:R.rounds,restants:R.restants,tours:R.tours,amIdx:R.amIdx,tourT:R.tourT,splits:R.splits,temps:R.temps,arrete:R.arrete};if(SEQ)res.minutes=R.minutes;
      opts.onEtat&&opts.onEtat(null);
      opts.onFin({res,fc:fcv,fcRec:+fcRec||null,vise:R.vise!=null?R.vise:null,realise:R.vise!=null?realise():null,pourquoi:contradiction()?pourquoi:'',alerte:alerte(),rpe,dims:COMPLET&&Object.keys(dims).length?Object.assign({},dims):null,commentaire:com.trim(),regle,coach:coach||'',conseil:conseil.trim(),regulations:R.regul,noRep:R.norep,versions:R.versions,notes,crit:crit.map(c=>c.slice())});return}
    if(!fini)peindre()});
  function demarrer(){son(1,.01,.001);if(t0==null)t0=Date.now();eveil(true);tick=setInterval(peindre,200);peindre()}
  if(snap){ // reprise : le temps passé tablette en veille ou page fermée est compté
    const absent=snap.marche&&!snap.fini?Math.max(0,(Date.now()-snap.ts)/1000):0;
    t0=Date.now()-(snap.ecoule+absent)*1000;if(!snap.marche)pauseA=Date.now();
    if(snap.fini){fini=false;terminer()}else demarrer();
    return {fermer};
  }
  // départ : un toucher (autorise le son sur iPad), puis décompte 3-2-1
  const iosVeille=!('wakeLock' in navigator);
  const visL=viseLib();
  v.innerHTML=`<div class="chr prep"><div class="ch-haut"><span>${esc(opts.athlete||'')}</span><span>${esc(opts.titreWod||'')}</span><span>${sansCap?'sans limite':mmss(total-PREP)}</span></div>
    <p class="ch-titre">Prêts ?</p><p class="ch-sous">L’athlète se place. Le partenaire tient la tablette : il valide chaque exercice, compte, note les no rep et l’exécution.</p>
    ${opts.rappel?`<p class="ch-rappel">🔁 Au dernier WOD de ce format, tu as décidé : <b>${esc(opts.rappel)}</b></p>`:''}
    ${visL?`<div class="ch-vise"><label for="ch-vise">🎯 Je vise ${esc(visL[0])}</label><select id="ch-vise"><option value="">— pas d’objectif —</option>${Array.from({length:+visL[1]+1},(_,x)=>`<option value="${x}"${R.vise===x?' selected':''}>${x}</option>`).join('')}</select><small>${esc(visL[2])}</small></div>`:''}
    ${iosVeille?'<p class="ch-lab">⚠ Cette tablette peut se mettre en veille : garde l’écran allumé (touche-le de temps en temps). Le WOD reprend s’il se coupe.</p>':''}
    <div class="ch-corps"><div class="ch-liste">${ex.map((e,j)=>exoHTML(j,true,W.f==='tabata'?null:W.f==='emom1'?repsE1(j,0):W.f==='fortime'?repsFT(j):e.reps||null)).join('')}</div></div>
    <div class="ch-bas"><button type="button" data-ch2="annuler">Annuler</button><button type="button" data-ch2="son">${libMode()}</button><button type="button" class="ch-ok" data-ch2="go">Départ (3 s)</button></div></div>`;
  v.querySelector('[data-ch2="son"]').onclick=e=>{modeSuivant();e.currentTarget.textContent=libMode()};
  v.querySelector('[data-ch2="go"]').onclick=()=>{const s=v.querySelector('#ch-vise');R.vise=s&&s.value!==''?+s.value:null;demarrer()};
  v.querySelector('[data-ch2="annuler"]').onclick=()=>{fermer();opts.onAnnule&&opts.onAnnule()};
  return {fermer};
}
root.CHRONO={lancer};
})(window);

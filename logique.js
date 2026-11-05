/* =====================================================================
   logique.js — calculs sans affichage (WOD, analyse, fichiers, QR)
   Cross training · appli élève et outil prof · Lycée Georges Pompidou
   Fichier COMMUN : garder la même version dans cross-training-eleves et cross-training-prof.
   ===================================================================== */
(function(root){
'use strict';
const VERSION_DONNEES=1;

/* Parcours du cycle (cross-training-donnees.js) selon le niveau de la classe et la démarche choisie par le prof */
function parcours(niv,dem){return niv==='t'?(dem==='g'?'h':'t'):(dem==='g'?'g':'p')}
const NOM_NIV={p:'Première',t:'Terminale'},NOM_DEM={p:'progressive',g:'GAREEPS'};

/* ---------- Formats et réglages tout prêts (référentiel du lycée) ---------- */
// f : tabata | emom | amrap | fortime | emom1 ; p : paramètres ; nb : nombre d'exercices conseillé ; mob : mobile ; ep : format de l'épreuve
const PRESETS=[
 {id:'tm1',nom:'TABATA modéré N1',f:'tabata',p:{e:30,r:30,n:8},nb:4,ordre:'v',mob:'mod',ep:1,aide:'4 exercices, 2 tours (3 N2 + 1 N1) · 8 min'},
 {id:'tm2',nom:'TABATA modéré N2',f:'tabata',p:{e:30,r:20,n:10},nb:5,ordre:'v',mob:'mod',ep:1,aide:'5 exercices, 2 tours (3 N2 + 2 N1) · 8 min 20'},
 {id:'tm3',nom:'TABATA modéré N3',f:'tabata',p:{e:25,r:15,n:12},nb:4,ordre:'v',mob:'mod',ep:1,aide:'4 exercices, 3 tours (3 N2 + 1 N1) · 8 min'},
 {id:'em8',nom:'EMOM modéré 8 min',f:'emom',p:{min:8},nb:3,max:4,mob:'mod',ep:1,aide:'3 à 4 exercices enchaînés, 7 répétitions minimum'},
 {id:'te1',nom:'TABATA élevé N1',f:'tabata',p:{e:20,r:20,n:8},nb:4,ordre:'v',mob:'elev',ep:1,aide:'4 exercices, 2 tours · 5 min 20'},
 {id:'te2',nom:'TABATA élevé N2',f:'tabata',p:{e:25,r:15,n:8},nb:2,ordre:'v',mob:'elev',ep:1,aide:'2 exercices, 4 tours · 5 min 20'},
 {id:'te3',nom:'TABATA élevé N3',f:'tabata',p:{e:20,r:10,n:10},nb:5,ordre:'v',mob:'elev',ep:1,aide:'5 exercices, 2 tours · 5 min'},
 {id:'ts',nom:'TABATA spécial (une zone)',f:'tabata',p:{e:20,r:10,n:10},nb:5,ordre:'v',mob:'elev',ep:1,special:1,aide:'une seule zone : INF, SUP, TRONC ou CARDIO'},
 {id:'em5',nom:'EMOM élevé 5 min',f:'emom',p:{min:5},nb:3,max:4,mob:'elev',ep:1,aide:'3 à 4 exercices de niveau 3'},
 {id:'t0',nom:'TABATA découverte 20/10 × 8',f:'tabata',p:{e:20,r:10,n:8},nb:2,ordre:'v',libre:1,aide:'le Tabata d’origine · 4 min'},
 {id:'tl',nom:'TABATA à régler',f:'tabata',p:{e:30,r:10,n:8},nb:4,ordre:'v',libre:1,aide:'effort/repos au choix (20/10, 30/10, 40/20, 45/15…) et 1 à 40 cycles'},
 {id:'t20',nom:'TABATA 20/20 × 8',f:'tabata',p:{e:20,r:20,n:8},nb:4,ordre:'v',libre:1,aide:'5 min 20'},
 {id:'em6',nom:'EMOM 6 min',f:'emom',p:{min:6},nb:2,aide:'au top de chaque minute'},
 {id:'am6',nom:'AMRAP 6 min',f:'amrap',p:{min:6},nb:3,aide:'le plus de tours possible'},
 {id:'am8',nom:'AMRAP 8 min',f:'amrap',p:{min:8},nb:3,aide:'le plus de tours possible'},
 {id:'fp1',nom:'FOR TIME paliers N1 (6 → 1)',f:'fortime',p:{pal:[6,5,4,3,2,1],cap:0},nb:3,aide:'6 rép. de chaque exercice, puis 5, 4… jusqu’à 1 · 21 rép. par exercice'},
 {id:'fp2',nom:'FOR TIME paliers N2 (8 → 1)',f:'fortime',p:{pal:[8,7,6,5,4,3,2,1],cap:0},nb:3,aide:'8, 7, 6… jusqu’à 1 · 36 rép. par exercice'},
 {id:'fp3',nom:'FOR TIME paliers N3 (10 → 1)',f:'fortime',p:{pal:[10,9,8,7,6,5,4,3,2,1],cap:0},nb:3,aide:'10, 9, 8… jusqu’à 1 · 55 rép. par exercice'},
 {id:'ft',nom:'FOR TIME 3 tours',f:'fortime',p:{tours:3,cap:6},nb:3,aide:'le plus vite possible, 6 min maximum'},
 {id:'e1',nom:'EMOM+1',f:'emom1',p:{min:6,dep:6},nb:3,aide:'tous les exercices chaque minute, validés un par un ; une répétition de plus à chaque minute'}
];
/* Formats proposés en premier à chaque séance, d'après les fiches du cycle (parcours p, g, t, h ; séances 1 à 9).
   EP = formats de l'épreuve du mobile de l'élève · EP_T = son Tabata d'épreuve · EP_E = son EMOM d'épreuve.
   Les autres formats restent accessibles sous « Autres formats ». Pour changer une séance, modifier sa liste ici. */
const DU_JOUR={
 p:[['t0','t20'],['t20','tm1','tm2','tm3'],['em6','em8'],['t0','EP_T'],['EP'],['EP_E'],['EP'],['EP'],['EP']],
 g:[['t0','t20'],['EP'],['em6','EP'],['t0','EP'],['EP'],['EP'],['EP'],['EP'],['EP']],
 t:[['am6'],['em6','EP_T'],['e1','fp1','fp2','fp3','ft'],['t0','EP_T'],['EP'],['EP_E'],['EP','am6'],['EP'],['EP']],
 h:[['am6'],['EP'],['em6','EP'],['t0','EP'],['EP'],['EP'],['EP','am6'],['EP'],['EP']]};
function presetsDuJour(pk,n,mob){
  const L=(DU_JOUR[pk]||[])[n-1];if(!L)return null;
  const ep=p=>p.ep&&(!mob||p.mob===mob),out=[];
  L.forEach(id=>{const sel=id==='EP'?PRESETS.filter(ep):id==='EP_T'?PRESETS.filter(p=>ep(p)&&p.f==='tabata'):id==='EP_E'?PRESETS.filter(p=>ep(p)&&p.f==='emom'):PRESETS.filter(p=>p.id===id);
    sel.forEach(p=>{if(!out.includes(p))out.push(p)})});
  return out.length?out:null}
/* Un seul bouton par format : il s'ouvre sur la version prévue par la séance du jour, que l'élève peut changer */
const FORMATS_UI=[['tabata','TABATA'],['emom','EMOM'],['amrap','AMRAP'],['fortime','FOR TIME'],['emom1','EMOM+1']];
const DEFAUT_F={tabata:'t0',emom:'em6',amrap:'am6',fortime:'fp1',emom1:'e1'};
function presetDefaut(f,pk,n,mob){const p=(presetsDuJour(pk,n,mob)||[]).find(x=>x.f===f);return p||PRESETS.find(x=>x.id===DEFAUT_F[f])}
// Versions proposées dans l'éditeur : formats de l'épreuve (du mobile) + une version d'entraînement réglable
function variantes(W,mob){const f=W.f,cur=PRESETS.find(p=>p.id===W.preset)||{};
  const ep=PRESETS.filter(p=>p.f===f&&p.ep&&(!mob||p.mob===mob));
  const ent=f==='tabata'?[cur.f==='tabata'&&!cur.ep?cur:PRESETS.find(p=>p.id==='t0')]
    :f==='emom'?[PRESETS.find(p=>p.id==='em6')]
    :f==='fortime'?[cur.f==='fortime'&&cur.p&&cur.p.pal?cur:PRESETS.find(p=>p.id==='fp1'),PRESETS.find(p=>p.id==='ft')]:[];
  const L=ep.concat(ent.filter(Boolean));return L.length>1?L:[]}
// Réglages repris de l'appli chrono « cross-training-pompidou »
const NIV_REPS=[4,6,8,10,12]; // N0 à N4 : répétitions par exercice (AMRAP, EMOM) ou au départ (EMOM+1)
const TABATA_REGLAGES=[[20,10],[30,10],[20,20],[40,20],[30,30],[45,15]];
const somme=a=>(a||[]).reduce((x,y)=>x+y,0);
// Note d'exécution sur 4 et ressenti sur 5 (échelles de l'appli d'origine)
const NOTE4=['','Insuffisant','À améliorer','Bien','Très bien'];
const RESS5=['','Épuisé','Très fatigué','Moyen','Légèrement fatigué','Pas fatigué'];
const ETOILES=['','Séance difficile','Pas terrible','Correct','Bonne séance','Excellente séance'];
const FATIGUE=['','Épuisé','Fatigué','Moyen','Légèrement fatigué','En forme'];
// libellé du ressenti d'un WOD (ancien : 1 à 4, de facile à très difficile ; nouveau : 1 à 5, d'épuisé à pas fatigué)
const RPE10=['','Très très facile','Facile','Modéré','Un peu dur','Dur','Dur +','Très dur','Très dur +','Très très dur','Maximal'];
const REGLE={baisse:'baisser d’une version ou d’un niveau',garde:'garder le même travail',monte:'monter d’une version ou d’un niveau',recup:'allonger la récupération'};
const CRIT3=['placement','respiration','amplitude'];
function ressentiTxt(n,ech){if(!n)return '—';return ech===10?'effort '+n+'/10 '+RPE10[n]:ech===5?n+'/5 '+RESS5[n]:n+'/4 (ancienne échelle)'}
// critères codés en un nombre pour le QR : 27 + 9×placement + 3×respiration + amplitude, chaque critère valant
// 1 réussi, 0 raté, 2 non observé (un critère non observé ne doit pas devenir « raté » chez le prof).
// Ancien codage (8 à 15, sans « non observé ») toujours lu.
const c3=x=>x===1?1:x===0?0:2;
const critCode=c=>c&&c.some(x=>x===0||x===1)?27+9*c3(c[0])+3*c3(c[1])+c3(c[2]):0;
const critDecode=n=>{if(n>=27&&n<54){n-=27;return [Math.floor(n/9),Math.floor(n/3)%3,n%3].map(x=>x===2?null:x)}return n>=8&&n<16?[n&4?1:0,n&2?1:0,n&1?1:0]:null};
// Nombre maximum d'exercices d'un WOD : format de l'épreuve = ce que fixe le référentiel ; sinon 8
// (Tabata : pas plus d'exercices que de rounds).
const MAX_EX=8;
function maxExercices(W){const ps=PRESETS.find(x=>x.id===W.preset)||{};if(ps.ep)return ps.max||ps.nb||MAX_EX;
  return W.f==='tabata'?Math.max(1,Math.min(MAX_EX,(W.p&&W.p.n)||MAX_EX)):MAX_EX}
const NOM_F={tabata:'TABATA',emom:'EMOM',amrap:'AMRAP',fortime:'FOR TIME',emom1:'EMOM+1'};
function dureeS(W){const p=W.p||{};
  if(W.f==='tabata')return p.n*(p.e+p.r);
  if(W.f==='emom'||W.f==='emom1'||W.f==='amrap')return p.min*60;
  if(W.f==='fortime')return p.pal?(p.cap||0)*60:(p.cap||6)*60;
  return 0}
const mmss=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+' min'+(s%60?' '+String(s%60).padStart(2,'0'):'')};
function titreWod(W){const p=W.p||{};
  if(W.f==='tabata')return 'TABATA '+p.e+'/'+p.r+' × '+p.n;
  if(W.f==='emom')return 'EMOM '+p.min+' min';
  if(W.f==='emom1')return 'EMOM+1 '+p.min+' min';
  if(W.f==='amrap')return 'AMRAP '+p.min+' min';
  if(W.f==='fortime')return p.pal?'FOR TIME '+p.pal[0]+' → '+p.pal[p.pal.length-1]+(p.cap?' (cap '+p.cap+' min)':''):'FOR TIME '+(p.tours||3)+' tours';
  return W.f}
// Exercice du round i d'un Tabata (vertical : 1,2,3,4,1,2… ; horizontal : 1,1,2,2…)
function exoDuRound(W,i){const k=(W.ex||[]).length||1;
  if(W.ordre==='h'){const par=Math.max(1,Math.round((W.p.n||8)/k));return Math.min(k-1,Math.floor(i/par))}
  return i%k}

/* ---------- Analyse d'un WOD ---------- */
const FOURCHETTE={mod:[140,160],elev:[160,180]};
function fcDans(fc,mob){if(!fc||!FOURCHETTE[mob])return null;const [a,b]=FOURCHETTE[mob];return fc<a?-1:fc>b?1:0}
// EMOM : niveau lu sur le temps restant moyen (N1 > 30 s, N2 20-30 s, N3 10-20 s ; < 10 s = trop dur)
function niveauEmom(rest){const L=(rest||[]).filter(x=>x!=null);if(!L.length)return null;
  const m=L.reduce((a,b)=>a+b,0)/L.length;return {moy:Math.round(m),niv:m>30?1:m>=20?2:m>=10?3:0,rate:L.filter(x=>x<=0).length}}
// Tabata : régularité des rounds (écart entre le meilleur et le moins bon)
function regularite(rounds){const L=(rounds||[]).filter(x=>x!=null);if(L.length<2)return null;return {min:Math.min(...L),max:Math.max(...L),ecart:Math.max(...L)-Math.min(...L),total:L.reduce((a,b)=>a+b,0)}}
function score(W){const r=W.res||{};
  if(W.f==='tabata'){const g=regularite(r.rounds);return g?'plancher '+g.min+' rép. · total '+g.total+' (meilleur round '+g.max+')':''}
  if(W.f==='emom'){const n=niveauEmom(r.restants),v=r.minutes?r.minutes.filter(m=>m&&m.ok).length+' / '+((W.p&&W.p.min)||r.minutes.length)+' min validées · ':'';return n?v+'repos moyen '+n.moy+' s'+(n.niv?' (N'+n.niv+')':' (trop dur)'):''}
  if(W.f==='emom1'&&r.minutes){const L=r.minutes.filter(Boolean),ok=L.filter(m=>m.ok),tm=ok.length?Math.round(ok.reduce((a,m)=>a+m.t,0)/ok.length):0;
    return L.length?ok.length+' / '+(W.p.min||L.length)+' min validées ('+r.minutes.map(m=>m?(m.ok?'V':'F'):'·').join('')+')'+(tm?' · séquence moy. '+tm+' s':''):''}
  if(W.f==='emom1')return r.derniere?'dernière minute réussie : '+r.derniere+' ('+((W.p.dep||3)+r.derniere-1)+' rép.)':'';
  if(W.f==='amrap'){if(r.tours==null)return '';const n=(W.ex||W.exercices||[]).length;
    if(r.amIdx!=null){const T=(r.tourT||[]).map((x,k)=>x-(k?r.tourT[k-1]:0)),moy=T.length?Math.round(T.reduce((a,b)=>a+b,0)/T.length):0;
      return r.tours+' tour'+(r.tours>1?'s':'')+(r.amIdx?' + '+r.amIdx+'/'+n+' exercice'+(r.amIdx>1?'s':''):'')+(moy?' · '+moy+' s par tour':'')}
    return r.tours+' tours + '+(r.plus||0)}
  if(W.f==='fortime'){const nb=W.p&&W.p.pal?W.p.pal.length:(W.p&&W.p.tours)||3;
    if(r.temps&&(r.tours==null||r.tours>=nb))return mmss(r.temps)+(r.norep?' + '+r.norep*5+' s de no rep':'')+((r.splits||[]).length?' · '+(W.p&&W.p.pal?'paliers':'tours')+' : '+r.splits.map(mmss).join(', '):'');
    if(r.tours!=null)return (W.p&&W.p.pal?'paliers':'tours')+' faits : '+r.tours+' / '+nb+(W.p&&W.p.cap&&r.temps?' (cap atteint)':'');
    return ''}
  return ''}

// Répétitions réellement faites, exercice par exercice (pour le tonnage : charge × répétitions)
function repsFaites(W){const ex=W.ex||[],r=W.res||{},n=ex.length,R=ex.map(()=>0);if(!n||!W.fait)return R;
  if(W.f==='tabata')(r.rounds||[]).forEach((x,i)=>{R[exoDuRound(W,i)]+=x||0});
  else if(W.f==='amrap'&&r.tours!=null)ex.forEach((e,k)=>{R[k]=(e.reps||0)*r.tours+(r.amIdx&&k<r.amIdx?(e.reps||0):0)});
  else if((W.f==='emom'||W.f==='emom1')&&r.minutes)r.minutes.forEach((m,i)=>{if(!m)return;ex.forEach((e,k)=>{const rp=(e.reps||(W.p&&W.p.dep)||0)+(W.f==='emom1'?i:0);
    R[k]+=m.ok?rp:k<(m.stop||0)?rp:k===(m.stop||0)?(m.partiel||0):0})});
  else if(W.f==='fortime'){const pal=W.p&&W.p.pal,nb=pal?pal.length:(W.p&&W.p.tours)||3,f=r.temps&&(r.tours==null||r.tours>=nb)?nb:(r.tours||0);
    ex.forEach((e,k)=>{R[k]=pal?pal.slice(0,f).reduce((a,x)=>a+x,0):(e.reps||0)*f})}
  return R}
const tonnage=W=>repsFaites(W).reduce((a,x,k)=>a+x*((W.ex[k]&&W.ex[k].kg)||0),0);
// Valeur numérique d'un AMRAP (tours + fraction de tour) pour comparer deux tests
function valeurAmrap(W){const r=W&&W.res;if(!r||r.tours==null)return null;const n=(W.ex||[]).length||1;return r.tours+(r.amIdx||0)/n}

/* ---------- Contrôle du projet de l'épreuve (référentiel) ---------- */
function controleEpreuve(wods,mob,MOUV){
  const W=(wods||[]).filter(w=>w.ex&&w.ex.length),L=[],ids=new Set(),zones=new Set();
  W.forEach(w=>w.ex.forEach(e=>{ids.add(e.m);const m=MOUV.find(x=>x.id===e.m);if(m)zones.add(m.z)}));
  const ta=W.filter(w=>w.f==='tabata'),em=W.filter(w=>w.f==='emom');
  if(mob==='mod'){
    L.push([ta.length===1&&em.length===1,'1 TABATA et 1 EMOM ('+ta.length+' TABATA, '+em.length+' EMOM)']);
    L.push([ids.size>=6&&ids.size<=8,'6 à 8 exercices différents ('+ids.size+')']);
    L.push([zones.size===4,'les 4 zones : INF, SUP, TRONC, CARDIO ('+[...zones].join(', ')+')']);
    L.push([em.every(w=>w.ex.every(e=>(e.reps||0)>=7)),'EMOM : 7 répétitions minimum']);
  }else if(mob==='elev'){
    L.push([ta.length===2&&em.length===1,'2 TABATA et 1 EMOM ('+ta.length+' TABATA, '+em.length+' EMOM)']);
    L.push([ta.some(w=>w.special),'un des TABATA est « le spécial » (une seule zone)']);
    L.push([ids.size>=8&&ids.size<=10,'8 à 10 exercices différents ('+ids.size+')']);
    const n3=W.reduce((a,w)=>a+w.ex.filter(e=>{const m=MOUV.find(x=>x.id===e.m);return m&&m.n===3}).length,0);
    L.push([n3>=4,'exercices de niveau 3 ('+n3+')']);
  }else L.push([false,'choisis d’abord ton mobile']);
  const sp=ta.find(w=>w.special);
  if(sp){const z=new Set(sp.ex.map(e=>{const m=MOUV.find(x=>x.id===e.m);return m&&m.z}));L.push([z.size===1,'le spécial n’a qu’une zone ('+[...z].join(', ')+')'])}
  return L;
}

// Règles du référentiel vérifiées pendant la construction d'un WOD (éditeur) : [ok (true/false/null = info), texte]
function controleWod(W,autres,mob,MOUV){
  const mv=id=>MOUV.find(x=>x.id===id)||{},ex=W.ex||[],n=ex.length,L=[],ZN=['INF','SUP','TRONC','CARDIO'];
  if(!mob){L.push([null,'Choisis ton mobile (Mon tableau) pour voir les règles de l’épreuve.']);}
  const niv=ex.map(e=>mv(e.m).n||0),zs=new Set(ex.map(e=>mv(e.m).z).filter(Boolean)),ps=PRESETS.find(x=>x.id===W.preset)||{};
  if(mob&&!ps.ep&&(W.f==='emom'||W.f==='tabata'))L.push([null,'WOD d’entraînement : les règles de l’épreuve ne s’appliquent qu’aux formats de l’épreuve.']);
  mob=ps.ep?mob:'';
  if(mob&&W.f==='emom'){
    L.push([n>=3&&n<=4,'EMOM : 3 à 4 exercices ('+n+')']);
    const v=mob==='mod'?2:3,bas=niv.filter(x=>x<v).length;L.push([n>0&&bas===0,'EMOM '+(mob==='mod'?'modéré':'élevé')+' : exercices de niveau '+v+(mob==='mod'?' (ou plus)':'')+(bas?' · '+bas+' en dessous':'')]);
    if(mob==='mod')L.push([n>0&&ex.every(e=>(e.reps||0)>=7),'EMOM modéré : 7 répétitions minimum par exercice']);
  }
  if(mob&&W.f==='tabata'){
    if(mob==='mod')L.push([n>=4&&n<=5,'TABATA modéré : 4 à 5 exercices ('+n+')']);
    else{const b3=niv.filter(x=>x<3).length;L.push([n>0&&b3<=1,'Intensité élevée : il faut du niveau 3'+(b3?' ('+b3+' exercice'+(b3>1?'s':'')+' en dessous, 1 N2 toléré)':'')])}
    if(W.special)L.push([zs.size===1,'Le spécial : une seule zone ('+([...zs].join(', ')||'aucune')+')']);
  }
  if(n&&!(W.f==='tabata'&&W.special)){
    const tous=new Set();(autres||[]).concat([W]).forEach(w=>(w.ex||[]).forEach(e=>{const z=mv(e.m).z;if(z)tous.add(z)}));
    const manq=ZN.filter(z=>!tous.has(z));
    if(n)L.push([manq.length?null:true,manq.length?'Zones de la séance : il manque '+manq.join(', '):'Les 4 zones sont couvertes dans la séance']);
  }
  if(mob&&n){const ids=new Set();(autres||[]).concat([W]).forEach(w=>(w.ex||[]).forEach(e=>ids.add(e.m)));const [a,b]=mob==='mod'?[6,8]:[8,10];
    L.push([ids.size>=a&&ids.size<=b?true:null,'Exercices différents dans la séance : '+ids.size+' (épreuve : '+a+' à '+b+')'])}
  return L;
}

// La décision prise au WOD précédent a-t-elle été appliquée au WOD suivant ? 'oui' | 'non' | null (pas comparable)
function niveauMoyen(W,MOUV){const ex=W.ex||[];if(!ex.length)return null;return ex.reduce((a,e)=>a+((MOUV.find(x=>x.id===e.m)||{}).n||2)+(e.v||0),0)/ex.length}
function repsMoyen(W){const ex=(W.ex||[]).filter(e=>e.reps);return ex.length?ex.reduce((a,e)=>a+e.reps,0)/ex.length:null}
function decisionAppliquee(prev,cur,MOUV){
  if(!prev||!cur||!prev.regle)return null;
  const dn=niveauMoyen(cur,MOUV)-niveauMoyen(prev,MOUV),meme=prev.f===cur.f,dr=meme&&repsMoyen(prev)!=null&&repsMoyen(cur)!=null?repsMoyen(cur)-repsMoyen(prev):0;
  const pr=prev.p||{},cp=cur.p||{};
  if(isNaN(dn))return null;
  switch(prev.regle){
    case 'baisse':return dn<-0.01||dr<-0.5||(meme&&cur.f==='tabata'&&((cp.e||0)<(pr.e||0)||(cp.r||0)>(pr.r||0)))?'oui':'non';
    case 'monte':return dn>0.01||dr>0.5||(meme&&cur.f==='tabata'&&((cp.e||0)>(pr.e||0)||(cp.r||0)<(pr.r||0)))?'oui':'non';
    case 'garde':return Math.abs(dn)<0.01&&Math.abs(dr)<=1?'oui':'non';
    case 'recup':if(meme&&cur.f==='tabata')return (cp.r||0)>(pr.r||0)||(cp.e||0)<(pr.e||0)?'oui':'non';
      if(meme&&(cur.f==='emom'||cur.f==='emom1'))return dr<-0.5||dn<-0.01?'oui':'non';
      return null;
  }
  return null;
}

/* ---------- Noms de fichiers ---------- */
function slug(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'').slice(0,24)}
function nomFichier(classe,eleve,seance){
  const parts=String(eleve||'').trim().split(/\s+/),prenom=parts[0]||'',nom=parts.slice(1).join(' ');
  // nom + prénom complet : « Léa MARTIN » et « Louis MARTIN » ne doivent pas donner le même fichier (dépôt dans le Nuage)
  const who=slug(nom?nom:prenom)+(nom?'_'+slug(prenom):'');
  return 'CT_'+(slug(classe)||'Classe')+'_'+(who||'Eleve')+'_S'+seance+'.json';
}

/* ---------- QR : version compacte d'un fichier de séance ---------- */
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
const FCODE={tabata:'t',emom:'e',amrap:'a',fortime:'f',emom1:'p'},FDECODE={t:'tabata',e:'emom',a:'amrap',f:'fortime',p:'emom1'};
function versQR(o){
  const q={a:'CTE',v:1,c:o.classe,e:o.eleve,s:o.seance,d:o.date,ts:Math.round(Date.now()/1000),k:o.parcours||''};
  if(o.mobile)q.m=o.mobile;if(o.dispense)q.dp=1;
  q.w=(o.wods||[]).map(w=>[FCODE[w.format]||w.format,w.p,w.ordre==='h'?1:0,(w.exercices||[]).map(e=>[e.id,e.version||0,e.reps||0,e.noteExecution||0,e.charge||0,critCode(e.criteres&&[e.criteres.placement,e.criteres.respiration,e.criteres.amplitude])]),w.fait?1:0,w.res||0,w.fc||0,w.ressenti||0,w.regulations||0,w.noRep||0,w.special?1:0,w.preset||'',w.echelleRessenti||0,cut(w.commentaire,80),w.dimensions?[w.dimensions.mu||0,w.dimensions.so||0,w.dimensions.te||0]:0,w.regulation||'',cut(w.coach,40),cut(w.conseil,80),w.suiviDecision?[w.suiviDecision.decision,w.suiviDecision.resultat==='oui'?1:w.suiviDecision.resultat==='non'?2:3]:0,w.fcRecup||0,w.vise!=null?[w.vise,w.realise!=null?w.realise:-1]:0,cut(w.ecartRessenti,30),w.alerte?1:0]);
  if(o.preuvesRoles&&o.preuvesRoles.wods)q.pr=[o.preuvesRoles.wods,(o.preuvesRoles.conseils||[]).slice(-2).map(x=>cut(x,50))];
  if(o.ressentiSeance)q.rs=[o.ressentiSeance.etoiles||0,o.ressentiSeance.fatigue||0];
  if(o.etoile)q.et=[o.etoile.conception||0,o.etoile.production||0,o.etoile.analyse||0];
  if(o.axePrioritaire)q.ax=o.axePrioritaire;
  if(o.bilan)q.b=cut(o.bilan,160);if(o.suite)q.su=cut(o.suite,160);
  if(o.etirements)q.st=1;
  if(o.roles)q.r=[o.roles.supporter?1:0,o.roles.assistant?1:0,o.roles.coach?1:0];
  if(o.tableau){const t=o.tableau;q.tp=[t.age||0,t.fcRepos||0,t.mobile||'',cut(t.pourquoi,80),t.charges||0,t.amrap||0]}
  if(o.jourJ){const j=o.jourJ;q.jj=[j.repartition||'',(j.echauffement||[]).map(x=>cut(x,60))]}
  if(o.groupe&&o.groupe.length>1)q.gr=o.groupe.map(n=>cut(n,40));
  return q;
}
// Objet compact du QR → même forme que le fichier (pour l'outil prof)
function depuisQR(q){
  const o={app:'cross-training-eleves',classe:q.c,eleve:q.e,seance:q.s,date:q.d,ts:q.ts,parcours:q.k||'',mobile:q.m||'',dispense:!!q.dp,source:'qr',
    wods:(q.w||[]).map(a=>({format:FDECODE[a[0]]||a[0],p:a[1],ordre:a[2]?'h':'v',exercices:(a[3]||[]).map(e=>{const c=critDecode(e[5]||0);return {id:e[0],version:e[1],reps:e[2],noteExecution:e[3]||null,charge:e[4]||null,criteres:c?{placement:c[0],respiration:c[1],amplitude:c[2]}:null}}),fait:!!a[4],res:a[5]||null,fc:a[6]||null,ressenti:a[7]||null,regulations:a[8]||0,noRep:a[9]||0,special:!!a[10],preset:a[11]||'',echelleRessenti:a[12]||(a[7]?4:0),echelleNote:(a[12]===5||a[12]===10||!a[7])?4:5,commentaire:a[13]||'',dimensions:a[14]?{mu:a[14][0]||null,so:a[14][1]||null,te:a[14][2]||null}:null,regulation:a[15]||'',coach:a[16]||'',conseil:a[17]||'',suiviDecision:a[18]?{decision:a[18][0],resultat:a[18][1]===1?'oui':a[18][1]===2?'non':null}:null,fcRecup:a[19]||null,vise:a[20]?a[20][0]:null,realise:a[20]&&a[20][1]>=0?a[20][1]:null,ecartRessenti:a[21]||'',alerte:!!a[22]})),
    preuvesRoles:q.pr?{wods:q.pr[0],conseils:q.pr[1]||[]}:null,
    ressentiSeance:q.rs?{etoiles:q.rs[0]||null,fatigue:q.rs[1]||null}:null,
    etoile:q.et?{conception:q.et[0],production:q.et[1],analyse:q.et[2]}:null,axePrioritaire:q.ax||'',bilan:q.b||'',suite:q.su||'',etirements:!!q.st,
    roles:q.r?{supporter:!!q.r[0],assistant:!!q.r[1],coach:!!q.r[2]}:null,
    tableau:q.tp?{age:q.tp[0]||null,fcRepos:q.tp[1]||null,mobile:q.tp[2]||'',pourquoi:q.tp[3]||'',charges:q.tp[4]||null,amrap:q.tp[5]||null}:null,
    jourJ:q.jj?{repartition:q.jj[0]||'',echauffement:q.jj[1]||[]}:null,groupe:q.gr||[]};
  return o;
}
function b64url(bytes){let s='';for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function chaineQR(q){
  const raw=new TextEncoder().encode(JSON.stringify(q));
  try{if(typeof CompressionStream==='function'){const buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return 'CTE1:'+b64url(new Uint8Array(buf))}}catch(e){}
  return 'CTE0:'+b64url(raw);
}

// QR trop chargé : découpé en plusieurs QR (« partie 1/2 »…), recollés par l'outil prof.
// La 1re partie porte toute la séance sauf une partie des WOD ; les suivantes, l'en-tête minimal et les autres WOD.
const SEUIL_QR=700; // ≈ version 18 du QR (89 modules) : testé lisible dès 320 px de large, flou compris
async function partiesQR(q){
  const t=await chaineQR(q);if(t.length<=SEUIL_QR||!(q.w&&q.w.length>1))return [t];
  const W=q.w,tete={a:q.a,v:q.v,c:q.c,e:q.e,s:q.s,d:q.d,ts:q.ts},P=[];let i=0;
  while(i<W.length){const base=P.length?Object.assign({},tete):Object.assign({},q);base.w=[W[i]];i++;
    while(i<W.length){const essai=Object.assign({},base,{w:base.w.concat([W[i]]),pt:[0,9]});if((await chaineQR(essai)).length>SEUIL_QR)break;base.w.push(W[i]);i++}
    P.push(base)}
  if(P.length===1)return [t];
  return Promise.all(P.map((x,k)=>chaineQR(Object.assign(x,{pt:[k+1,P.length]}))));
}
// Recolle les parties (même élève, même séance, même ts) ; renvoie l'objet complet ou null s'il en manque
function recollerQR(parts){const n=parts[0].pt[1],L=[];parts.forEach(p=>L[p.pt[0]-1]=p);
  if(L.filter(Boolean).length<n)return null;const q=Object.assign({},L[0]);delete q.pt;q.w=[].concat(...L.map(p=>p.w||[]));return q}

function decrireWod(w,MOUV){
  const W={f:w.format||w.f,p:w.p||{}},ps=PRESETS.find(x=>x.id===w.preset);
  const ex=(w.exercices||[]).map(e=>{const m=MOUV.find(x=>x.id===e.id)||{};return {nom:e.nom||m.nom||e.id,zone:e.zone||m.z||'',niveau:e.niveau||m.n||null,version:e.version||0,reps:e.reps||0,note:e.noteExecution||null,charge:e.charge||null}});
  return {titre:titreWod(W),format:ps?ps.nom:'',duree:dureeS(W),ex};
}
root.CTL={presetsDuJour,DU_JOUR,FORMATS_UI,presetDefaut,variantes,repsFaites,tonnage,valeurAmrap,decisionAppliquee,controleWod,SEUIL_QR,partiesQR,recollerQR,RPE10,REGLE,CRIT3,critCode,critDecode,maxExercices,NOTE4,RESS5,ETOILES,FATIGUE,ressentiTxt,NIV_REPS,TABATA_REGLAGES,somme,decrireWod,VERSION_DONNEES,parcours,NOM_NIV,NOM_DEM,PRESETS,NOM_F,dureeS,mmss,titreWod,exoDuRound,FOURCHETTE,fcDans,niveauEmom,regularite,score,controleEpreuve,slug,nomFichier,versQR,depuisQR,chaineQR};
})(typeof window!=='undefined'?window:globalThis);

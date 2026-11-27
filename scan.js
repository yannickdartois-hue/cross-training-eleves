/* =====================================================================
   scan.js — lecture des QR codes « CTE » avec la caméra (jsQR)
   Commun à l'appli élève (transfert d'un élève) et à l'outil prof.
   ===================================================================== */
(function(root){
'use strict';
function b64urlToBytes(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
// Texte d'un QR « CTE1:… » (compressé) ou « CTE0:… » → objet
async function decoder(txt){
  txt=String(txt||'').trim();
  const m=/^CTE([01]):([A-Za-z0-9_-]+)$/.exec(txt);if(!m)throw new Error('Ce QR code ne vient pas de l’appli cross training.');
  let bytes=b64urlToBytes(m[2]);
  if(m[1]==='1'){
    if(typeof DecompressionStream!=='function')throw new Error('Ce navigateur ne sait pas lire ce QR : mets à jour l’iPad (iOS 16.4 ou plus).');
    const buf=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
    bytes=new Uint8Array(buf);
  }
  const o=JSON.parse(new TextDecoder().decode(bytes));
  if(!o||o.a!=="CTE")throw new Error('QR code non reconnu.');
  return o;
}
/* Ouvre la caméra dans une fenêtre et appelle onCode(texte) à chaque QR lu.
   opts.continu : reste ouvert (outil prof) ; sinon se ferme au premier QR.
   opts.reste : fonction → HTML « Encore N élèves à scanner » (outil prof), recalculé après chaque QR lu (comme l'outil gym).
   opts.titre, opts.aide : textes. Renvoie une fonction pour fermer. */
function scanner(onCode,opts){
  opts=opts||{};
  const v=document.createElement('div');
  v.className='scan-voile';
  v.innerHTML=`<div class="scan-fen" role="dialog" aria-modal="true"><h3>${opts.titre||'Scanner un QR code'}</h3>
    <div class="scan-cadre"><video playsinline muted></video><div class="scan-viseur"></div></div>
    <p class="scan-msg">${opts.aide||'Place le QR code dans le cadre.'}</p>
    <div class="scan-manque" style="margin:4px 0;max-height:24vh;overflow:auto">${opts.reste?opts.reste():''}</div>
    <div class="scan-bas"><span class="scan-compte"></span><button type="button" class="bt noir scan-fin">${opts.continu?'Terminé':'Annuler'}</button></div></div>`;
  document.body.appendChild(v);
  const video=v.querySelector('video'),msg=v.querySelector('.scan-msg'),cpt=v.querySelector('.scan-compte');
  const cv=document.createElement('canvas'),ctx=cv.getContext('2d',{willReadFrequently:true});
  let stream=null,fini=false,dernier='',dernierT=0,n=0,timer=null;
  const PQ={};   /* QR en plusieurs morceaux « QRP|tag|i/n|… » : recollés ici, dans n’importe quel ordre */
  function fermer(){fini=true;clearTimeout(timer);if(stream)stream.getTracks().forEach(t=>t.stop());v.remove();if(opts.onClose)opts.onClose(n)}
  v.querySelector('.scan-fin').onclick=fermer;
  function message(t,ok){msg.textContent=t;msg.className='scan-msg'+(ok===true?' ok':ok===false?' err':'')}
  async function tic(){
    if(fini)return;
    if(video.readyState>=2&&video.videoWidth){
      const w=video.videoWidth,h=video.videoHeight,k=Math.min(1,1280/Math.max(w,h)); // 1280 px : un QR dense (séance chargée) reste lisible même petit dans l’image
      cv.width=Math.round(w*k);cv.height=Math.round(h*k);ctx.drawImage(video,0,0,cv.width,cv.height);
      const img=ctx.getImageData(0,0,cv.width,cv.height),r=root.jsQR(img.data,cv.width,cv.height,{inversionAttempts:'dontInvert'});
      if(r&&r.data&&(r.data!==dernier||Date.now()-dernierT>4000)){
        dernier=r.data;dernierT=Date.now();
        try{
          let txt=r.data;const pm=/^QRP\|(\w+)\|(\d+)\/(\d+)\|/.exec(txt);
          if(pm){const P=PQ[pm[1]]=PQ[pm[1]]||{n:+pm[3],p:{}};P.p[pm[2]]=txt.slice(pm[0].length);const got=Object.keys(P.p).length;
            if(got<P.n){txt=null;message(got+' / '+P.n+' morceaux lus… continue de viser.');try{navigator.vibrate&&navigator.vibrate(25)}catch(e){}}
            else{txt='';for(let i=1;i<=P.n;i++)txt+=P.p[i];delete PQ[pm[1]]}}
          if(txt!==null){
          const res=await onCode(txt);
          n++;cpt.textContent=n+' lu'+(n>1?'s':'');
          message(res||'QR code lu.',true);
          if(opts.reste){const z=v.querySelector('.scan-manque');if(z)z.innerHTML=opts.reste()}
          try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}
          if(!opts.continu){fermer();return}}
        }catch(e){message(e.message||String(e),false)}
      }
    }
    timer=setTimeout(tic,160);
  }
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){message('La caméra n’est pas disponible sur cet appareil.',false);return fermer}
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false}).then(s=>{
    if(fini){s.getTracks().forEach(t=>t.stop());return}
    stream=s;video.srcObject=s;video.play().catch(()=>{});tic();
  }).catch(()=>message('Autorise l’accès à la caméra (réglages du navigateur), puis réessaie.',false));
  return fermer;
}
// Objet → texte de QR compressé (même format que l'appli élève)
async function encoder(o){
  const raw=new TextEncoder().encode(JSON.stringify(o));
  const b=u=>{let s='';u.forEach(c=>s+=String.fromCharCode(c));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
  try{if(typeof CompressionStream==='function'){const buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return 'CTE1:'+b(new Uint8Array(buf))}}catch(e){}
  return 'CTE0:'+b(raw);
}
function svgQR(txt){
  const q=qrcode(0,'L');q.addData(txt,'Byte');q.make();
  const c=q.getModuleCount(),m=4;let p='';
  for(let y=0;y<c;y++)for(let x=0;x<c;x++)if(q.isDark(y,x))p+=`M${x+m} ${y+m}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c+2*m} ${c+2*m}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="100%" height="100%" fill="#fff"/><path d="${p}" fill="#000"/></svg>`;
}
/* v1.8 : un QR trop dense (> 750 caractères) ne se lit pas sur certaines tablettes → morceaux de taille égale
   qui défilent tout seuls ; le lecteur ci-dessus les recolle. */
const QR_MORCEAU=750;
function morceaux(txt){txt=String(txt);if(txt.length<=QR_MORCEAU)return [txt];
  const tag=Math.random().toString(36).slice(2,6),n=Math.ceil(txt.length/QR_MORCEAU),t=Math.ceil(txt.length/n),out=[];
  for(let i=0;i<n;i++)out.push('QRP|'+tag+'|'+(i+1)+'/'+n+'|'+txt.slice(i*t,(i+1)*t));return out}
let H=null;
function anime(z,parts,info){clearInterval(H);H=null;if(!z)return;let i=0;
  const peindre=()=>{try{z.innerHTML=svgQR(parts[i])}catch(e){z.innerHTML='<p class="avert">Trop de données pour un QR : utilise l’envoi en ligne.</p>'}
    if(info)info.textContent=parts.length>1?(i+1)+' / '+parts.length+' · laisse le prof viser jusqu’au bout':''};
  peindre();if(parts.length>1)H=setInterval(()=>{if(!z.isConnected){clearInterval(H);H=null;return}i=(i+1)%parts.length;peindre()},1100)}
root.TTQR={decoder,scanner,encoder,svgQR,morceaux,anime};
})(window);

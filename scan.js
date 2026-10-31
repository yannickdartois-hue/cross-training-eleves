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
   opts.titre, opts.aide : textes. Renvoie une fonction pour fermer. */
function scanner(onCode,opts){
  opts=opts||{};
  const v=document.createElement('div');
  v.className='scan-voile';
  v.innerHTML=`<div class="scan-fen" role="dialog" aria-modal="true"><h3>${opts.titre||'Scanner un QR code'}</h3>
    <div class="scan-cadre"><video playsinline muted></video><div class="scan-viseur"></div></div>
    <p class="scan-msg">${opts.aide||'Place le QR code dans le cadre.'}</p>
    <div class="scan-bas"><span class="scan-compte"></span><button type="button" class="bt noir scan-fin">${opts.continu?'Terminé':'Annuler'}</button></div></div>`;
  document.body.appendChild(v);
  const video=v.querySelector('video'),msg=v.querySelector('.scan-msg'),cpt=v.querySelector('.scan-compte');
  const cv=document.createElement('canvas'),ctx=cv.getContext('2d',{willReadFrequently:true});
  let stream=null,fini=false,dernier='',dernierT=0,n=0,timer=null;
  function fermer(){fini=true;clearTimeout(timer);if(stream)stream.getTracks().forEach(t=>t.stop());v.remove();if(opts.onClose)opts.onClose(n)}
  v.querySelector('.scan-fin').onclick=fermer;
  function message(t,ok){msg.textContent=t;msg.className='scan-msg'+(ok===true?' ok':ok===false?' err':'')}
  async function tic(){
    if(fini)return;
    if(video.readyState>=2&&video.videoWidth){
      const w=video.videoWidth,h=video.videoHeight,k=Math.min(1,720/Math.max(w,h));
      cv.width=Math.round(w*k);cv.height=Math.round(h*k);ctx.drawImage(video,0,0,cv.width,cv.height);
      const img=ctx.getImageData(0,0,cv.width,cv.height),r=root.jsQR(img.data,cv.width,cv.height,{inversionAttempts:'dontInvert'});
      if(r&&r.data&&(r.data!==dernier||Date.now()-dernierT>4000)){
        dernier=r.data;dernierT=Date.now();
        try{
          const res=await onCode(r.data);
          n++;cpt.textContent=n+' lu'+(n>1?'s':'');
          message(res||'QR code lu.',true);
          try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}
          if(!opts.continu){fermer();return}
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
root.TTQR={decoder,scanner,encoder,svgQR};
})(window);

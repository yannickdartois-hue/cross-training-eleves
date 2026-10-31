/* Lecteur des vidéos de démonstration (VIDEOS, dans videos.js).
   Tout élément portant data-video="<id du mouvement>" ouvre la vidéo par-dessus l'écran en cours
   (éditeur de WOD, chrono…) sans le fermer. Lecture via youtube-nocookie ; internet nécessaire. */
(function(){
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const V=()=>(typeof VIDEOS!=='undefined'&&VIDEOS)||{};
  window.aVideo=id=>!!V()[id];
  window.boutonVideo=(id,cl)=>V()[id]?`<button type="button" class="bt-video ${cl||''}" data-video="${esc(id)}" aria-label="Voir la vidéo de démonstration" title="Voir la vidéo">▶</button>`:'';
  let ouvert=null;
  function fermer(){if(ouvert){ouvert.remove();ouvert=null}}
  window.ouvrirVideo=function(id){
    const v=V()[id];if(!v)return;fermer();
    const m=(typeof window.mvById==='function'&&window.mvById(id))||{nom:v.t};
    const lien='https://www.youtube.com/watch?v='+encodeURIComponent(v.y);
    const d=document.createElement('div');d.className='vid-voile';
    d.innerHTML=`<div class="vid-fen" role="dialog" aria-modal="true" aria-label="Vidéo : ${esc(m.nom)}">
      <div class="vid-tete"><b>${esc(m.nom)}</b><button type="button" class="vid-x" data-vid="x" aria-label="Fermer la vidéo">✕</button></div>
      ${navigator.onLine===false
        ?'<p class="vid-hors">Pas de connexion internet : la vidéo ne peut pas s’ouvrir. Suis l’image et les consignes de la fiche.</p>'
        :`<div class="vid-cadre"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.y)}?autoplay=1&rel=0&playsinline=1" title="${esc(m.nom)}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`}
      <p class="vid-src">${esc(v.t)} · chaîne ${esc(v.c)} · ${esc(v.d)}${v.a?'<br><i>Vidéo proche du mouvement : en cas de différence, la fiche de l’appli fait foi.</i>':''}</p>
      <div class="vid-pied"><a href="${lien}" target="_blank" rel="noopener">Ouvrir sur YouTube</a><button type="button" class="vid-ok" data-vid="x">Fermer</button></div>
    </div>`;
    d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-vid="x"]'))fermer()});
    document.body.appendChild(d);ouvert=d;
    const x=d.querySelector('.vid-x');if(x)x.focus();
  };
  // capture : passe avant les autres gestionnaires (éditeur, chrono) pour ne pas déclencher leur action
  document.addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(!b||!V()[b.dataset.video])return;
    e.preventDefault();e.stopPropagation();window.ouvrirVideo(b.dataset.video)},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ouvert){e.stopPropagation();fermer()}},true);
  const css=`.bt-video{display:inline-grid;place-items:center;width:30px;height:30px;min-width:30px;border-radius:50%;border:0;background:#c2410c;color:#fff;font-size:13px;line-height:1;padding:0 0 0 2px;cursor:pointer;vertical-align:middle;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.bt-video:focus-visible{outline:3px solid #1d4ed8;outline-offset:2px}
.bt-video.sur-img{position:absolute;top:6px;right:6px;z-index:1}
.bt-video.mini{width:24px;height:24px;min-width:24px;font-size:10px;margin-left:4px}
[data-video].ch-img{position:relative;cursor:pointer}
.ch-img .bt-video{position:absolute;top:4px;right:4px;border:2px solid #fff}
.vid-voile{position:fixed;inset:0;z-index:200;background:rgba(10,15,25,.8);display:flex;align-items:center;justify-content:center;padding:12px}
.vid-fen{background:#fff;color:#111827;border-radius:16px;width:min(560px,100%);max-height:100%;overflow:auto;padding:12px}
.vid-tete{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.vid-tete b{font-size:1.05rem}
.vid-x{width:40px;height:40px;border-radius:50%;border:1px solid #d1d5db;background:#fff;font-size:18px;cursor:pointer}
.vid-cadre{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:10px;overflow:hidden}
.vid-cadre iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.vid-hors{background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:10px}
.vid-src{font-size:.82rem;color:#4b5563;margin:8px 0}
.vid-pied{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.vid-pied a{color:#c2410c;font-weight:700}
.vid-ok{min-height:44px;padding:0 18px;border-radius:12px;border:0;background:#111827;color:#fff;font-weight:700;cursor:pointer}`;
  const st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
})();

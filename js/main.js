// Titre : chaque lettre tombe l'une après l'autre
(function(){
  const h=document.getElementById('name'),t=h.textContent;let i=0;h.textContent='';
  t.split(' ').forEach((w,wi,arr)=>{
    const s=document.createElement('span');s.style.whiteSpace='nowrap';s.setAttribute('aria-hidden','true');
    [...w].forEach(c=>{const e=document.createElement('span');e.className='ch';e.style.setProperty('--i',i++);e.textContent=c;s.appendChild(e)});
    h.appendChild(s);if(wi<arr.length-1){h.appendChild(document.createTextNode(' '));i++}
  });
})();

// Réseau de points qui réagit à la souris
(function(){
  const c=document.getElementById('net'),x=c.getContext('2d');
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let w,h,pts=[],m={x:-999,y:-999};
  function size(){
    const r=c.getBoundingClientRect(),d=devicePixelRatio||1;
    w=r.width;h=r.height;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);
    const n=Math.min(90,Math.floor(w*h/14000));
    pts=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));
  }
  const col=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function draw(){
    x.clearRect(0,0,w,h);
    const a=col('--accent'),s=col('--spark');
    pts.forEach(p=>{
      if(!still){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
        const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);
        if(d<120){p.x+=dx/d*2;p.y+=dy/d*2}
      }
    });
    for(let i=0;i<pts.length;i++){
      const p=pts[i];
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<130){x.strokeStyle=a;x.globalAlpha=(1-d/130)*.35;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}
      }
      const near=Math.hypot(p.x-m.x,p.y-m.y)<150;
      x.globalAlpha=near?1:.6;x.fillStyle=near?s:a;
      x.beginPath();x.arc(p.x,p.y,near?3.5:2.2,0,7);x.fill();
    }
    x.globalAlpha=1;
    if(!still)requestAnimationFrame(draw);
  }
  const hero=c.parentElement;
  hero.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  hero.addEventListener('pointerleave',()=>{m.x=m.y=-999});
  addEventListener('resize',()=>{size();if(still)draw()});
  size();draw();
})();

// Barre de progression de lecture
const bar=document.getElementById('bar');
addEventListener('scroll',()=>{
  const d=document.documentElement;
  bar.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight)*100||0)+'%';
},{passive:true});

// Réalisations : un tap ouvre la carte (mobile)
document.querySelectorAll('.proj').forEach(p=>p.addEventListener('click',()=>{
  document.querySelectorAll('.proj').forEach(o=>o!==p&&o.classList.remove('on'));p.classList.toggle('on');
}));

// Thème clair / sombre
document.getElementById('theme').addEventListener('click',()=>{
  const r=document.documentElement,dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const cur=r.dataset.theme||(dark?'dark':'light');
  r.dataset.theme=cur==='dark'?'light':'dark';
});

// Copier l'e-mail
document.getElementById('copy').addEventListener('click',e=>{
  const b=e.currentTarget,t=b.textContent;
  const done=()=>{b.textContent='E‑mail copié';setTimeout(()=>b.textContent=t,2000)};
  try{navigator.clipboard.writeText('edmondbokoto38@gmail.com').then(done,done)}catch(_){done()}
});

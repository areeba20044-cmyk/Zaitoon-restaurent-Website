/* ===================== ZAITOON WEBSITE (public site) ===================== */
const NAV=[["about","About"],["menu","Menu"],["dine","Dine-in & Reserve"],["gallery","Gallery"],["rewards","Rewards"],["faq","FAQ"],["contact","Contact"]];
function isOpen(){const h=new Date().getHours()+new Date().getMinutes()/60;return h>=11.5}
function cartCount(){return DEV.cart.reduce((a,c)=>a+c.qty,0)}
function siteNav(solid){return `<header class="nav ${solid?"scrolled":""}" id="nav"><div class="wrap">
  <a class="logo" href="#home">${LOGO}</a>
  <nav class="nav-links" id="navl">${NAV.map(([id,n])=>`<a href="#home" data-s="${id}">${n}</a>`).join("")}</nav>
  <div class="row" style="gap:10px"><button class="btn btn-line btn-sm cart-btn" onclick="openSiteCart()">🛒 <span id="cartN">${cartCount()}</span></button><a class="btn btn-gold btn-sm hide-sm" href="#home" data-s="dine" data-tab="reserve">Reserve a table</a><button class="burger" onclick="$('#navl').classList.toggle('open')">☰</button></div>
</div></header>`}

function renderSite(){
  const sig=["karahi-karahi-chicken","thai-chinese-szechuan","steaks-beef-steak","continental-stuffed-chicken-and-cheese","burgers-smokehouse-beef-burger","thai-chinese-cashew-nut","karahi-mutton-karahi","thai-chinese-chicken-chow-mein","bbq-chicken-tikka-boti","mocktails-mint-margarita"].map(item);
  const fbs=S.feedback,avg=fbs.length?(fbs.reduce((a,f)=>a+(f.food+f.service+f.ambience)/3,0)/fbs.length).toFixed(1):"5.0";
  $("#app").innerHTML=siteNav()+`
  <section class="hero3d" id="top">
    <canvas id="embers"></canvas>
    <div class="wrap hero3d-grid">
      <div class="hero-copy">
        <div class="row" style="gap:10px"><span class="chip ${isOpen()?"ol":"gr"}">● ${isOpen()?"Open now · until 12:00 midnight":"Opens at 11:30 AM"}</span><span class="chip gr">Wah Cantt</span></div>
        <h1 class="h3d"><span class="ln"><span>Welcome</span></span><span class="ln"><span>to <em>Zaitoon</em></span></span></h1>
        <p class="lead">Fired freshness, family-style. Thai, Chinese, Continental and Desi cooking — served in our warm Family Hall and on an open-air rooftop under the stars.</p>
        <div class="row"><a class="btn btn-gold" href="#home" data-s="menu">Explore the menu</a><a class="btn btn-line" href="#home" data-s="dine" data-tab="reserve">Reserve a table</a></div>
        <div class="hero-meta"><div><b>${MENU.length}</b><span>dishes</span></div><div><b>${CATS.length}</b><span>categories</span></div><div><b>${avg}★</b><span>guest rating</span></div></div>
      </div>
      <div class="plate-stage" id="plateStage">
        <div class="plate-3d" id="plate3d">
          <div class="orbit3d"><div class="orb-ring"></div>${["thai-chinese-szechuan","mocktails-mint-margarita","steaks-beef-steak","burgers-smokehouse-beef-burger"].map((id,i)=>`<div class="orb-sat" style="--a:${i*90}deg"><img src="${item(id).img}" alt=""></div>`).join("")}</div>
          <div class="plate-shadow"></div>
          <img class="plate-img" src="img/hd/karahi-cut.webp" alt="Zaitoon karahi chicken">
          <div class="steam s1"></div><div class="steam s2"></div><div class="steam s3"></div>
        </div>
        <div class="price-tag"><span class="tiny muted">Chef's favourite</span><b>Karahi Chicken</b><span class="gold">from ${rs(1300)}</span><button class="btn btn-gold btn-xs" onclick="openItem('karahi-karahi-chicken')">Add to order</button></div>
      </div>
    </div>
    <div class="scroll-cue">Scroll</div>
  </section>

  <section class="sec" id="signature"><div class="wrap">
    <div class="sec-head center rv"><div class="eyebrow">Signature dishes</div><h2 class="h3d-sm">The plates our guests <em>come back for</em></h2><p>Drag to spin. Tap a dish to add it to your order.</p></div>
    <div class="ring-stage rv" id="ringStage"><div class="ring" id="ring">${sig.map((it,i)=>`<div class="ring-card" style="--i:${i}" data-id="${it.id}"><div class="rc-img"><img src="${it.img}" alt="${esc(it.name)}" draggable="false"></div><div class="rc-body"><b>${esc(it.name)}</b><span class="gold">${it.variants.length?"from ":""}${rs(fromPrice(it))}</span></div></div>`).join("")}</div></div>
    <div class="row" style="justify-content:center;margin-top:24px"><button class="btn btn-line btn-sm" onclick="ringStep(-1)">←</button><button class="btn btn-gold btn-sm" id="ringAdd" onclick="ringAddFront()">Add to order</button><button class="btn btn-line btn-sm" onclick="ringStep(1)">→</button></div>
  </div></section>

  <section class="sec" id="about" style="background:var(--bg2)"><div class="wrap about3d">
    <div class="rv">
      <div class="eyebrow">About us</div>
      <h2 class="h3d-sm" style="font-size:clamp(40px,5vw,66px);margin:14px 0 18px">A place for delicious food <em>& quality time</em></h2>
      <p class="muted" style="font-size:16.5px">Zaitoon Family Restaurant sits on Main G.T. Road in Wah Cantt — a full-service dining and events venue built for gathering around the table. Our kitchen brings together four cuisines: wok-tossed Thai and Chinese, creamy Continental plates, sizzling steaks, and Pakistani karahi, handi and BBQ cooked to order.</p>
      <p class="muted" style="font-size:16.5px;margin-top:14px">Every dish is made fresh from the morning's ingredients. Ask for your karahi in desi ghee or butter, choose your spice level, and enjoy it in the Family Hall or under string lights on the rooftop.</p>
      <div class="about-stats"><div><b>4</b><span>cuisines under one roof</span></div><div><b>2</b><span>spaces · Family Hall & Rooftop</span></div><div><b>12h</b><span>open daily, 11:30 AM – midnight</span></div></div>
      <div class="row" style="margin-top:26px"><a class="btn btn-gold" href="#home" data-s="menu">See the menu</a><a class="btn btn-line" href="#home" data-s="contact">Find us</a></div>
    </div>
    <div class="stack3d rv d2" id="stack3d">
      <figure class="st st1"><img src="img/hd/rooftop-night.jpg" alt="Zaitoon rooftop at night"><figcaption>The rooftop at night</figcaption></figure>
      <figure class="st st2"><img src="img/hd/dining-hall.jpg" alt="Zaitoon Family Hall dining"><figcaption>The Family Hall</figcaption></figure>
      <figure class="st st3"><img src="img/hd/steak-board.jpg" alt="Zaitoon beef steak board"><figcaption>Our signature steak board</figcaption></figure>
    </div>
  </div></section>

  <div class="marquee"><div class="marquee-track">${[0,1].map(()=>`<span>Karahi Chicken</span><span>Szechuan</span><span>Beef Steak</span><span>BBQ Mix Platter</span><span>Smokehouse Burger</span><span>Mint Margarita</span><span>19 B Special Soup</span><span>Amritsaria Handi</span>`).join("")}</div></div>

  <section class="sec" id="menu"><div class="wrap">
    <div class="row between rv" style="align-items:flex-end;margin-bottom:26px"><div class="sec-head" style="margin:0"><div class="eyebrow">Our menu</div><h2 class="h3d-sm">Order <em>anything you love</em></h2><p>Dine-in from your table or takeaway — every order goes straight to our kitchen.</p></div><input id="mSearch" placeholder="Search ${MENU.length} dishes…" style="max-width:300px"></div>
    <div class="mcats" id="mcats"></div>
    <div class="mgrid" id="mgrid"></div>
  </div></section>

  <section class="sec" id="dine" style="background:var(--bg2)"><div class="wrap">
    <div class="sec-head center rv"><div class="eyebrow">Dine-in & Reservations</div><h2 class="h3d-sm">Dine <em>with us</em></h2><p>Book your table ahead, then order straight from it when you arrive — one smooth evening from booking to bill.</p></div>
    <div class="journey rv">${[["📅","Reserve"],["📶","Arrive & tap your table"],["🍽","Order from your seat"],["📍","Follow your food live"],["🧾","Bill & rate"]].map((j,i)=>`<div><span>${j[0]}</span><b>${j[1]}</b></div>${i<4?'<i></i>':''}`).join("")}</div>
    <div class="row rv" style="justify-content:center;margin:28px 0 34px"><div class="tabs dine-tabs"><button data-dt="reserve" onclick="dineTab='reserve';drawDine()">📅 Reserve a table</button><button data-dt="table" onclick="dineTab='table';drawDine()">📱 Order from your table</button></div></div>
    <div id="dinePanel"></div>
  </div></section>

  <section class="sec" id="gallery" style="background:var(--bg2)"><div class="wrap">
    <div class="sec-head rv"><div class="eyebrow">Gallery</div><h2 class="h3d-sm">A look <em>inside Zaitoon</em></h2></div>
    <div class="gal">${GALLERY.map((g,i)=>`<figure class="g${i%6} rv d${i%4} tilt" onclick="lightbox(${i})"><img src="${g[0]}" alt="${esc(g[1])}" loading="lazy"><figcaption>${esc(g[1])}</figcaption></figure>`).join("")}</div>
  </div></section>

  <section class="sec" id="reviews"><div class="wrap">
    <div class="row between rv" style="align-items:flex-end;margin-bottom:26px"><div class="sec-head" style="margin:0"><div class="eyebrow">Guest reviews</div><h2 class="h3d-sm"><span class="gold">${avg}</span> out of 5, <em>from our guests</em></h2></div><button class="btn btn-line" onclick="reviewForm()">Write a review</button></div>
    <div class="revs" id="revs">${reviewsHtml()}</div>
  </div></section>

  <section class="sec" id="rewards" style="background:var(--bg2)"><div class="wrap rewards">
    <div class="rv"><div class="eyebrow">Zaitoon Rewards</div><h2 class="h3d-sm" style="font-size:clamp(40px,5vw,60px);margin:14px 0 12px">Every visit <em>counts</em></h2><p class="muted">Order or reserve with your phone number and your visits, spend and points are saved automatically. Earn 1 point for every Rs 100.</p>
      <div class="row" style="margin-top:20px"><input id="rwPhone" placeholder="Your phone number (03xx…)" style="max-width:280px"><button class="btn btn-gold" onclick="rewardsLookup()">Check my rewards</button></div>
      <div id="rwOut" style="margin-top:20px"></div></div>
    <div class="card3d rv d2" id="card3d"><div class="rcard"><div class="row between">${LOGO}<span class="tiny" style="letter-spacing:.2em">REWARDS</span></div><div class="rc-chip"></div><div class="tiny muted">MEMBER</div><b class="serif" style="font-size:32px" id="rcName">Your name</b><div class="row between" style="margin-top:12px"><span class="small" id="rcTier">Gold tier</span><b class="gold" id="rcPts">0 pts</b></div></div></div>
  </div></section>

  <section class="sec faq" id="faq"><div class="wrap" style="max-width:900px">
    <div class="sec-head rv"><div class="eyebrow">FAQ</div><h2 class="h3d-sm">Good to <em>know</em></h2></div>
    ${FAQ.map(([q,a])=>`<details class="rv"><summary>${q}</summary><p>${a}</p></details>`).join("")}
  </div></section>

  <section class="sec" id="contact" style="background:var(--bg2)"><div class="wrap contact">
    <div class="rv"><div class="eyebrow">Contact</div><h2 class="h3d-sm" style="font-size:clamp(40px,5vw,60px);margin:14px 0 22px">Visit <em>Zaitoon</em></h2>
      <div class="cinfo"><div><span>📍</span><div><b>Address</b><p class="muted">${RESTAURANT.address}</p><a class="gold small" href="https://www.google.com/maps/search/?api=1&query=Zaitoon+Family+Restaurant+Wah+Cantt">Get directions →</a></div></div>
      <div><span>📞</span><div><b>Reservations</b><p class="muted">${RESTAURANT.phone}<br>${RESTAURANT.phone2}</p></div></div>
      <div><span>🕰</span><div><b>Hours</b><p class="muted">Open daily<br>11:30 AM – 12:00 midnight</p></div></div></div></div>
    <div class="card rv d1" style="padding:26px"><h3 class="serif" style="font-size:30px;margin-bottom:14px">Send us a message</h3><div id="msgBox">${msgForm()}</div></div>
  </div></section>

  <section class="cta"><img src="img/hd/rooftop-night.jpg" alt=""><div class="wrap"><div class="eyebrow rv">Tonight at Zaitoon</div><h2 class="rv d1" style="margin:16px 0 26px">Your table <em class="gold" style="font-style:italic">is waiting.</em></h2><div class="row rv d2" style="justify-content:center"><a class="btn btn-gold" href="#home" data-s="dine" data-tab="reserve">Reserve a table</a><a class="btn btn-line" href="#home" data-s="menu">Order now</a></div></div></section>

  <footer><div class="wrap foot">
    <div><a class="logo" href="#home">${LOGO}</a><p style="margin-top:12px;max-width:340px">Fired freshness, family-style. Thai · Chinese · Continental · Desi, in the heart of Wah Cantt.</p></div>
    <div><b>Explore</b>${NAV.slice(0,5).map(([id,n])=>`<a href="#home" data-s="${id}">${n}</a>`).join("")}</div>
    <div><b>Guests</b><a href="#home" data-s="rewards">Rewards</a><a href="#home" data-s="reviews">Reviews</a><a href="#home" data-s="faq">FAQ</a><a href="#home" onclick="trackPrompt();return false">Track an order</a></div>
    <div><b>Visit</b><p>${RESTAURANT.address}</p><p>${RESTAURANT.phone} · ${RESTAURANT.phone2}</p></div>
  </div><div class="wrap row between" style="margin-top:34px;padding-top:20px;border-top:1px solid var(--line)"><span>© ${new Date().getFullYear()} Zaitoon Family Restaurant</span><span>Zara Plaza, Main G.T. Road, Wah Cantt</span></div></footer>
  ${cartCount()?`<button class="float-cart" onclick="openSiteCart()">🛒 ${cartCount()} · ${rs(DEV.cart.reduce((a,c)=>a+c.total,0))}</button>`:""}`;
  bindSite();
}

/* ---------- dine-in & reserve (one module) ---------- */
let dineTab="reserve";
function drawDine(){const el=$("#dinePanel");if(!el)return;document.querySelectorAll(".dine-tabs button").forEach(b=>b.classList.toggle("on",b.dataset.dt===dineTab));
  if(dineTab==="reserve"){const r=myRes&&(S.reservations||[]).find(x=>x.id===myRes);el.innerHTML=`<div class="reserve"><div class="res-img"><img src="img/hd/rooftop-night.jpg" alt="Zaitoon rooftop at night"><div class="res-badge"><b>Rooftop & Family Hall</b><span>16 tables · open till midnight</span></div></div><div><h3 class="serif" style="font-size:40px;margin-bottom:8px">Book your <em class="gold">table</em></h3><p class="muted" style="margin-bottom:18px">Birthdays, family dinners or a quiet evening on the rooftop — reserve in seconds. When you arrive, tap your table to order.</p><div id="resBox">${r?resStatus(r):resForm()}</div></div></div>`}
  else el.innerHTML=`<div class="dine"><div><h3 class="serif" style="font-size:40px;margin-bottom:8px">Tap your table. <em class="gold">We'll take it from there.</em></h3><p class="muted">Every table has a QR code and an NFC tag. Tap or scan and our menu opens on your phone — no app to install.</p>
      <div class="dsteps">${[["📶","Connect instantly","Free guest Wi-Fi details appear the moment you tap."],["🍽","Order from your seat","Choose dishes, sizes and add-ons; your order reaches the kitchen in seconds."],["📍","Follow your food","Received → Preparing → Ready → On its way — with a notification at each step."],["🔔","One-tap service","Call your waiter or ask for the bill without waving."],["⭐","Tell us how it was","Rate the food, service and ambience after your meal."]].map(s=>`<div class="dstep"><span>${s[0]}</span><div><b>${s[1]}</b><p class="small muted">${s[2]}</p></div></div>`).join("")}</div>
      <div class="card" style="padding:18px;margin-top:22px"><label class="lbl">At Zaitoon right now? Open your table</label><div class="row"><select id="dineT" style="max-width:260px">${TABLES.map(t=>`<option value="${t.n}">Table ${t.n} · ${t.zone}</option>`).join("")}</select><button class="btn btn-gold" onclick="location.hash='table-'+$('#dineT').value">Open my table →</button></div></div></div>
    <div class="phone3d" id="phone3d"><div class="ph-screen"><div class="ph-top">${LOGO}<span class="chip">T7</span></div><div class="ph-wifi"><span class="tiny muted">FREE GUEST WI-FI</span><b>${esc(S.settings.wifi.ssid)}</b><span class="tiny">Password · ${esc(S.settings.wifi.password)}</span></div><div class="ph-item"><img src="img/dishes/szechuan.jpg" alt=""><div><b>Szechuan</b><span class="tiny muted">Chicken · Spicy</span><span class="gold small">${rs(1450)}</span></div></div><div class="ph-item"><img src="img/dishes/mint-margarita.jpg" alt=""><div><b>Mint Margarita</b><span class="tiny muted">× 2</span><span class="gold small">${rs(700)}</span></div></div><div class="ph-track"><div class="row between"><b class="small">Order #231</b><span class="tag st-preparing">Preparing</span></div><div class="ph-bar"><i></i></div><div class="row between tiny dim"><span>Received</span><span>Preparing</span><span>Ready</span><span>Served</span></div></div><div class="ph-btns"><span>🔔 Call waiter</span><span>🧾 Bill</span></div></div><div class="ph-notif"><img src="img/logo.png" alt=""><div><b>Your order is ready</b><br><span>It's coming out of the kitchen now.</span></div></div></div></div>`;
  initTilt();
}
/* ---------- interactions ---------- */
let mCat="popular",mQ="";
function bindSite(){
  document.querySelectorAll("[data-s]").forEach(a=>a.onclick=e=>{e.preventDefault();$("#navl").classList.remove("open");if(a.dataset.tab){dineTab=a.dataset.tab;drawDine()}const el=document.getElementById(a.dataset.s);el&&el.scrollIntoView({behavior:"smooth"})});
  const ms=$("#mSearch");ms.value=mQ;ms.oninput=()=>{mQ=ms.value;drawMenu()};
  drawMenu();drawDine();setupReveal();requestAnimationFrame(()=>$(".hero3d").classList.add("go"));
  initEmbers();initPlate();initRing();initTilt();
}
function updateSite(){const n=$("#cartN");if(n)n.textContent=cartCount();const r=$("#revs");if(r)r.innerHTML=reviewsHtml();refreshResStatus()}
function drawMenu(){
  $("#mcats").innerHTML=[["popular","★ Popular"],...CATS.map(c=>[c[0],c[1]])].map(([id,n])=>`<button class="${mCat===id&&!mQ?"on":""}" onclick="mCat='${id}';mQ='';$('#mSearch').value='';drawMenu()">${esc(n)}</button>`).join("");
  const q=mQ.toLowerCase();let list=q?MENU.filter(m=>(m.name+" "+m.desc).toLowerCase().includes(q)):mCat==="popular"?MENU.filter(m=>m.img).slice(0,24):MENU.filter(m=>m.cat===mCat);
  const cat=CATS.find(c=>c[0]===mCat);
  $("#mgrid").innerHTML=(cat&&!q&&cat[2]?`<p class="muted small" style="grid-column:1/-1">${esc(cat[2])}</p>`:"")+(list.length?list.map(m=>{const it=item(m.id);return `<div class="mcard tilt ${it.soldOut?"out":""}">${it.img?`<div class="mc-img"><img src="${it.img}" alt="${esc(it.name)}" loading="lazy">${it.popular?`<span class="chip mc-tag">Popular</span>`:""}</div>`:`<div class="mc-img mono"><span class="mono-l">${esc(it.name[0])}</span><span class="mono-c">${esc(CATS.find(c=>c[0]===it.cat)[1])}</span>${it.popular?`<span class="chip mc-tag">Popular</span>`:""}</div>`}<div class="mc-body"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start"><h4>${esc(it.name)} ${it.spicy?"🌶️":""}</h4><b class="gold" style="white-space:nowrap">${it.variants.length?"from ":""}${rs(fromPrice(it))}</b></div><p>${esc(it.desc||CATS.find(c=>c[0]===it.cat)[1])}</p><div class="row between">${it.unit?`<span class="tiny dim">${esc(it.unit)}</span>`:"<span></span>"}${it.soldOut?`<span class="sold">Sold out today</span>`:`<button class="btn btn-gold btn-xs" onclick="openItem('${it.id}')">Add +</button>`}</div></div></div>`}).join(""):`<div class="empty" style="grid-column:1/-1">No dishes match “${esc(mQ)}”.</div>`);
  initTilt();
}

/* ---------- 3D: embers (canvas perspective particles) ---------- */
let emberRAF;
function initEmbers(){
  const c=$("#embers");if(!c)return;const ctx=c.getContext("2d");cancelAnimationFrame(emberRAF);
  const P=Array.from({length:110},()=>({x:(Math.random()-.5)*1600,y:(Math.random()-.5)*1000,z:Math.random()*1000+100,s:Math.random()*1.6+.4,v:Math.random()*.6+.25}));
  let mx=0,my=0;window.onmousemove=e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)};
  const draw=()=>{if(!document.body.contains(c))return;const w=c.width=c.offsetWidth,h=c.height=c.offsetHeight;ctx.clearRect(0,0,w,h);
    P.forEach(p=>{p.y-=p.v;p.z-=.6;if(p.z<60||p.y<-600){p.z=1100;p.y=500+Math.random()*200;p.x=(Math.random()-.5)*1600}
      const k=500/p.z,X=w/2+(p.x+mx*p.z*.25)*k,Y=h/2+(p.y+my*p.z*.15)*k,r=p.s*k*1.6,a=Math.min(1,(1100-p.z)/600)*.85;
      const g=ctx.createRadialGradient(X,Y,0,X,Y,r*3);g.addColorStop(0,`rgba(255,206,120,${a})`);g.addColorStop(1,"rgba(255,160,60,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,Y,r*3,0,7);ctx.fill()});
    emberRAF=requestAnimationFrame(draw)};
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches)draw();
}
/* ---------- 3D: plate tilt + scroll ---------- */
function initPlate(){
  const st=$("#plateStage"),pl=$("#plate3d");if(!st)return;let tx=0,ty=0,cx=0,cy=0;
  st.onmousemove=e=>{const r=st.getBoundingClientRect();tx=((e.clientY-r.top)/r.height-.5)*-22;ty=((e.clientX-r.left)/r.width-.5)*28};
  st.onmouseleave=()=>{tx=0;ty=0};
  const loop=()=>{if(!document.body.contains(pl))return;cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;const sc=Math.min(1,scrollY/700);pl.style.transform=`rotateX(${18+cx+sc*25}deg) rotateY(${cy+sc*-20}deg) translateZ(${-sc*120}px)`;requestAnimationFrame(loop)};loop();
}
/* ---------- 3D: ring carousel ---------- */
let ringA=0,ringV=0,ringDrag=false,ringN=10;
function initRing(){
  const ring=$("#ring"),stage=$("#ringStage");if(!ring)return;ringN=ring.children.length;
  let lx=0,moved=0;
  stage.onpointerdown=e=>{ringDrag=true;lx=e.clientX;moved=0;stage.setPointerCapture(e.pointerId)};
  stage.onpointermove=e=>{if(!ringDrag)return;const d=e.clientX-lx;lx=e.clientX;moved+=Math.abs(d);ringA+=d*.3;ringV=d*.3};
  stage.onpointerup=e=>{ringDrag=false;if(moved<6){const card=document.elementFromPoint(e.clientX,e.clientY)?.closest(".ring-card");if(card)openItem(card.dataset.id)}};
  const loop=()=>{if(!document.body.contains(ring))return;if(!ringDrag){ringV*=.94;ringA+=ringV+(Math.abs(ringV)<.05?-.12:0)}ring.style.transform=`translateZ(-560px) rotateY(${ringA}deg)`;
    const step=360/ringN;[...ring.children].forEach((c,i)=>{let d=((i*step+ringA)%360+540)%360-180;c.classList.toggle("front",Math.abs(d)<step/2)});requestAnimationFrame(loop)};loop();
}
function ringStep(d){ringA-=d*(360/ringN);ringV=0}
function ringAddFront(){const f=$(".ring-card.front");if(f)openItem(f.dataset.id)}
/* ---------- 3D: tilt on hover ---------- */
function initTilt(){document.querySelectorAll(".tilt,#stack3d,#phone3d,#card3d").forEach(el=>{if(el._t)return;el._t=1;el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty("--rx",(-y*12)+"deg");el.style.setProperty("--ry",(x*14)+"deg")});el.addEventListener("mouseleave",()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")})})}

/* ---------- cart & ordering ---------- */
let orderType="dine";
function openSiteCart(){
  if(!DEV.cart.length){modal(`<h2 style="font-size:34px">Your order is empty</h2><p class="muted" style="margin:8px 0 18px">Browse the menu and tap “Add +” on any dish.</p><button class="btn btn-gold" onclick="closeModal();document.getElementById('menu').scrollIntoView({behavior:'smooth'})">Open the menu</button>`);return}
  const sub=DEV.cart.reduce((a,c)=>a+c.total,0),g=guestRec();
  modal(`<div class="row between"><h2 style="font-size:36px">Your order</h2><button onclick="closeModal()" style="font-size:24px">×</button></div>
   <div style="margin:12px 0;max-height:34vh;overflow:auto">${DEV.cart.map((c,i)=>`<div class="row between" style="padding:11px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap;align-items:flex-start"><div style="min-width:0"><b>${esc(c.name)}</b>${lineMods(c)}<div class="small gold">${rs(c.unit)}</div></div><span class="qty"><button onclick="siteCartQ(${i},-1)">−</button><span>${c.qty}</span><button onclick="siteCartQ(${i},1)">+</button></span></div>`).join("")}</div>
   <div class="row between" style="font-size:20px;margin:6px 0 16px"><b>Total</b><b class="gold">${rs(sub)}</b></div>
   <div class="tabs" style="width:max-content;margin-bottom:14px"><button class="${orderType==="dine"?"on":""}" onclick="orderType='dine';openSiteCart()">🍽 Dine-in</button><button class="${orderType==="take"?"on":""}" onclick="orderType='take';openSiteCart()">🥡 Takeaway</button></div>
   <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
     <div><label class="lbl">Name</label><input id="coName" value="${esc(g?g.name:DEV.name)}" placeholder="Your name"></div>
     <div><label class="lbl">Phone</label><input id="coPhone" value="${esc(g&&g.phone||DEV.phone||"")}" placeholder="03xx xxxxxxx"></div>
     ${orderType==="dine"?`<div style="grid-column:1/-1"><label class="lbl">Your table</label><select id="coTable">${TABLES.map(t=>`<option value="${t.n}" ${DEV.table===t.n?"selected":""}>Table ${t.n} · ${t.zone}</option>`).join("")}</select></div>`:`<div style="grid-column:1/-1"><label class="lbl">Pickup</label><select id="coPick"><option>As soon as possible (~25 min)</option><option>In 45 minutes</option><option>In 1 hour</option><option>In 2 hours</option></select></div>`}
     <div style="grid-column:1/-1"><label class="row small" style="gap:8px"><input type="checkbox" id="coOffers" ${DEV.consent?"checked":""}> Send me Zaitoon's offers and special nights</label></div>
   </div>
   <button class="btn btn-gold" style="width:100%;margin-top:16px" onclick="siteCheckout()">Place order · ${rs(sub)}</button><p class="tiny dim" style="text-align:center;margin-top:8px">${orderType==="dine"?"Pay at your table when you're done.":"Pay at the counter when you collect."}</p>`);
}
function siteCartQ(i,d){const c=DEV.cart[i];c.qty+=d;if(c.qty<=0)DEV.cart.splice(i,1);else c.total=c.unit*c.qty;saveDev();updateSite();refreshFloat();if(DEV.cart.length)openSiteCart();else closeModal()}
function refreshFloat(){const f=$(".float-cart");if(route!=="home")return;if(f)f.remove();if(cartCount()){const b=document.createElement("button");b.className="float-cart";b.onclick=openSiteCart;b.textContent=`🛒 ${cartCount()} · ${rs(DEV.cart.reduce((a,c)=>a+c.total,0))}`;$("#app").appendChild(b)}const n=$("#cartN");if(n)n.textContent=cartCount()}
function guestByPhone(phone,name,consent){
  const p=(phone||"").replace(/\D/g,"");if(!p)return null;
  let g=Object.values(S.guests).find(x=>x.phone===p);
  if(!g){const id="g"+uid();g=S.guests[id]={id,name:name||"Guest",phone:p,consent:!!consent,visits:0,spend:0,last:now(),first:now()}}
  if(name)g.name=name;if(consent!==undefined)g.consent=!!consent;g.last=now();DEV.gid=g.id;DEV.phone=p;DEV.name=g.name;DEV.consent=g.consent;return g;
}
function siteCheckout(){
  const name=$("#coName").value.trim(),phone=$("#coPhone").value.trim();
  if(!name){toast("Please add your name");return}
  if(orderType==="take"&&phone.replace(/\D/g,"").length<10){toast("Please add a valid phone number for pickup");return}
  if(!S.settings.ordering){toast("Online ordering is paused right now — please call us");return}
  const g=guestByPhone(phone,name,$("#coOffers").checked)||{id:"",name};
  const table=orderType==="dine"?+$("#coTable").value:0;
  if(table){DEV.table=table;DEV.scanAt=now()}
  const o=placeOrder(table,DEV.cart.map(c=>({...c})),orderType==="dine"?"qr":"online",{id:g.id,name:g.name},null,orderType==="take"?{pickup:$("#coPick").value,phone:g.phone||phone}:null);
  DEV.seen[o.id]="received";DEV.cart=[];saveDev();closeModal();location.hash="track-"+o.no;
}

/* ---------- order tracking page ---------- */
function trackPrompt(){modal(`<h2 style="font-size:34px">Track your order</h2><p class="muted small" style="margin:6px 0 14px">Enter the order number from your confirmation.</p><input id="tpNo" placeholder="e.g. 215"><div class="row" style="margin-top:14px"><button class="btn btn-gold" onclick="closeModal();location.hash='track-'+($('#tpNo').value||'').replace(/\\D/g,'')">Track</button><button class="btn btn-line" onclick="closeModal()">Cancel</button></div>`)}
function renderTrack(){
  const o=S.orders.find(x=>x.no===+param);
  const take=o&&!o.table;
  const stages=take?[["received","Received"],["preparing","Preparing"],["ready","Ready for pickup"],["served","Collected"]]:STAGES;
  let body;
  if(!o)body=`<div class="card" style="padding:40px;text-align:center"><h2 style="font-size:36px">Order not found</h2><p class="muted" style="margin:10px 0 20px">Check the number and try again.</p><a class="btn btn-gold" href="#home">Back to Zaitoon</a></div>`;
  else{const idx=stages.findIndex(s=>s[0]===o.status||(take&&o.status==="picked_up"&&s[0]==="served"));const msg={received:"We've got your order — the kitchen will start shortly.",preparing:"Our chefs are cooking your food right now.",ready:take?"Your order is ready at the counter.":"Your food is ready and leaving the kitchen.",picked_up:"Your waiter is bringing it to your table.",served:take?"Collected — enjoy your meal!":"Served — enjoy your meal!"}[o.status];
    body=`<div class="track-card card"><div class="row between"><div><div class="eyebrow">${take?"Takeaway":"Table "+o.table+" · "+o.zone}</div><h2 style="font-size:46px">Order #${o.no}</h2></div><span class="tag st-${o.status}" style="font-size:13px;padding:6px 12px">${stageName(o.status)}</span></div>
     <p class="muted" style="margin:6px 0 4px">${msg}</p>${take&&o.pickup?`<p class="small gold">Pickup: ${esc(o.pickup)}</p>`:""}
     <div class="trk big"><div class="fill" style="width:${Math.max(0,idx)/(stages.length-1)*80}%"></div>${stages.map((s,i)=>`<div class="s ${i<idx||o.status==="served"?"done":i===idx?"now":""}"><i>${i<idx||o.status==="served"?"✓":i+1}</i>${s[1]}${o.times[s[0]]?`<div class="tiny dim">${clock(o.times[s[0]])}</div>`:""}</div>`).join("")}</div>
     <div style="margin-top:18px">${o.lines.map(l=>`<div class="row between" style="padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span>${l.qty} × ${esc(l.name)}${lineMods(l)}</span><span class="muted">${rs(l.total)}</span></div>`).join("")}</div>
     <div class="row between" style="font-size:20px;margin-top:12px"><b>Total</b><b class="gold">${rs(o.total)}</b></div>
     <div class="row" style="margin-top:22px">${o.table?`<a class="btn btn-gold" href="#table-${o.table}">Open my table</a>`:""}<a class="btn btn-line" href="#home">Back to Zaitoon</a></div>
     <div class="row" style="margin-top:14px;align-items:center"><p class="tiny dim">This page updates live — keep it open.</p>${notifyBtn()}</div></div>`}
  $("#app").innerHTML=siteNav(true)+`<section class="sec" style="padding-top:60px;min-height:80vh"><div class="wrap" style="max-width:820px">${body}</div></section>`;
}

/* ---------- reservations ---------- */
let myRes=null;
function resForm(){const d=new Date();const today=d.toISOString().slice(0,10);
  return `<div class="card" style="padding:24px"><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
   <div><label class="lbl">Name</label><input id="rN" placeholder="Your name"></div><div><label class="lbl">Phone</label><input id="rP" placeholder="03xx xxxxxxx"></div>
   <div><label class="lbl">Date</label><input id="rD" type="date" min="${today}" value="${today}"></div><div><label class="lbl">Time</label><select id="rT">${["12:30","13:30","14:30","17:00","19:00","20:00","21:00","22:00","23:00"].map(t=>`<option ${t==="20:00"?"selected":""}>${t}</option>`).join("")}</select></div>
   <div><label class="lbl">Guests</label><select id="rG">${[1,2,3,4,5,6,7,8,10,12,15,20].map(n=>`<option ${n===4?"selected":""}>${n}</option>`).join("")}</select></div><div><label class="lbl">Seating</label><select id="rA"><option>Rooftop</option><option>Family Hall</option><option>No preference</option></select></div>
   <div style="grid-column:1/-1"><label class="lbl">Occasion / notes</label><input id="rO" placeholder="Birthday, anniversary, high chair…"></div></div>
   <button class="btn btn-gold" style="width:100%;margin-top:16px" onclick="reserve()">Request reservation</button></div>`}
function reserve(){
  const n=$("#rN").value.trim(),p=$("#rP").value.trim();if(!n||p.replace(/\D/g,"").length<10){toast("Please add your name and a valid phone number");return}
  const g=guestByPhone(p,n);const r={id:uid(),ref:"ZR"+(1000+((S.reservations||[]).length+1)*7),name:n,phone:p.replace(/\D/g,""),date:$("#rD").value,time:$("#rT").value,guests:+$("#rG").value,area:$("#rA").value,note:$("#rO").value.trim(),status:"pending",t:now(),gid:g&&g.id};
  (S.reservations=S.reservations||[]).push(r);save();saveDev();myRes=r.id;$("#resBox").innerHTML=resStatus(r);toast("Reservation request sent");
}
function resStatus(r){const st={pending:["Request received","Our team will confirm your table shortly.","st-preparing"],confirmed:["Confirmed","Your table is booked. See you soon!","st-ready"],seated:["Welcome!","You've been seated — enjoy your evening.","st-ready"],cancelled:["Not available","Sorry, we couldn't hold that time. Please call us to find another slot.","st-received"]}[r.status];
  return `<div class="card" style="padding:26px"><div class="row between"><div><div class="eyebrow">Reservation ${r.ref}</div><h3 class="serif" style="font-size:34px;margin-top:6px">${st[0]}</h3></div><span class="tag ${st[2]}" style="font-size:12.5px;padding:6px 12px">${r.status}</span></div><p class="muted" style="margin:8px 0 16px">${st[1]}</p>
   <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px"><div><label class="lbl">Date</label>${new Date(r.date+"T00:00").toLocaleDateString([], {weekday:"short",day:"numeric",month:"short"})}</div><div><label class="lbl">Time</label>${r.time}</div><div><label class="lbl">Guests</label>${r.guests} · ${r.area}</div></div>
   <button class="btn btn-line btn-sm" style="margin-top:18px" onclick="myRes=null;$('#resBox').innerHTML=resForm()">Make another booking</button></div>`}
function refreshResStatus(){if(!myRes||dineTab!=="reserve")return;const r=(S.reservations||[]).find(x=>x.id===myRes);const b=$("#resBox");if(r&&b)b.innerHTML=resStatus(r)}

/* ---------- reviews ---------- */
function reviewsHtml(){return S.feedback.slice().reverse().slice(0,6).map(f=>`<div class="rev card tilt"><div class="gold" style="font-size:18px;letter-spacing:2px">${"★".repeat(Math.round((f.food+f.service+f.ambience)/3))}<span class="dim">${"★".repeat(5-Math.round((f.food+f.service+f.ambience)/3))}</span></div><p style="margin:12px 0 16px;font-size:15.5px">“${esc(f.text||"Lovely evening at Zaitoon.")}”</p><div class="row between"><b>${esc(f.name)}</b><span class="tiny dim">${ago(f.t)}</span></div></div>`).join("")}
let rv={food:0,service:0,ambience:0};
function reviewForm(){modal(`<div class="row between"><h2 style="font-size:34px">Write a review</h2><button onclick="closeModal()" style="font-size:24px">×</button></div>
  <label class="lbl" style="margin-top:14px">Your name</label><input id="rvN" value="${esc(DEV.name)}">
  ${["food","service","ambience"].map(k=>`<div class="row between" style="margin-top:14px"><span style="text-transform:capitalize">${k}</span><div class="stars">${[1,2,3,4,5].map(n=>`<button class="${rv[k]>=n?"on":""}" onclick="rv.${k}=${n};reviewForm();$('#rvN').value='${esc(DEV.name)}'">★</button>`).join("")}</div></div>`).join("")}
  <label class="lbl" style="margin-top:14px">Your review</label><textarea id="rvT" rows="3" placeholder="Tell us about your visit"></textarea>
  <button class="btn btn-gold" style="margin-top:16px;width:100%" onclick="sendReview()">Post review</button>`)}
function sendReview(){const n=$("#rvN").value.trim();if(!n||!rv.food||!rv.service||!rv.ambience){toast("Please add your name and all three ratings");return}S.feedback.push({id:uid(),table:0,name:n,...rv,text:$("#rvT").value.trim(),t:now()});save();DEV.name=n;saveDev();rv={food:0,service:0,ambience:0};closeModal();updateSite();toast("Thank you for your review!")}

/* ---------- rewards ---------- */
function rewardsLookup(){const p=($("#rwPhone").value||"").replace(/\D/g,"");const g=Object.values(S.guests).find(x=>x.phone===p);
  if(!g){$("#rwOut").innerHTML=`<div class="card" style="padding:18px"><b>No rewards profile yet</b><p class="small muted">Place an order or reserve a table with this number and you'll join automatically.</p></div>`;return}
  const pts=Math.floor(g.spend/100),tier=g.visits>=5?"Gold":g.visits>=3?"Silver":"Member";const os=S.orders.filter(o=>o.guestId===g.id).slice(-4).reverse();
  $("#rcName").textContent=g.name;$("#rcTier").textContent=tier+" tier";$("#rcPts").textContent=pts.toLocaleString()+" pts";
  $("#rwOut").innerHTML=`<div class="card" style="padding:20px"><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px;text-align:center"><div><b class="serif gold" style="font-size:34px">${g.visits}</b><div class="tiny muted">visits</div></div><div><b class="serif gold" style="font-size:34px">${pts}</b><div class="tiny muted">points</div></div><div><b class="serif gold" style="font-size:34px">${tier}</b><div class="tiny muted">tier</div></div></div>
   ${os.length?`<div style="margin-top:14px">${os.map(o=>`<div class="row between small" style="padding:6px 0;border-top:1px solid var(--line)"><span>#${o.no} · ${o.lines.map(l=>esc(l.name)).slice(0,2).join(", ")}</span><a class="gold" href="#track-${o.no}">${stageName(o.status)} →</a></div>`).join("")}</div>`:""}
   <p class="tiny dim" style="margin-top:10px">${g.consent?"You're subscribed to offers.":"You're not subscribed to offers."} Points update when your bill is settled.</p></div>`}

/* ---------- contact ---------- */
function msgForm(){return `<div class="grid" style="gap:12px"><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><input id="cN" placeholder="Name"><input id="cP" placeholder="Phone or email"></div><select id="cS"><option>General question</option><option>Event or birthday booking</option><option>Feedback</option><option>Catering</option></select><textarea id="cM" rows="4" placeholder="How can we help?"></textarea><button class="btn btn-gold" onclick="sendMsg()">Send message</button></div>`}
function sendMsg(){const n=$("#cN").value.trim(),m=$("#cM").value.trim();if(!n||!m){toast("Please add your name and message");return}(S.messages=S.messages||[]).push({id:uid(),name:n,contact:$("#cP").value.trim(),subject:$("#cS").value,text:m,t:now(),read:false});save();$("#msgBox").innerHTML=`<div style="padding:10px 0"><h3 class="serif" style="font-size:28px">Thank you, ${esc(n)}!</h3><p class="muted" style="margin:6px 0 14px">Your message has reached our team. We'll get back to you soon.</p><button class="btn btn-line btn-sm" onclick="$('#msgBox').innerHTML=msgForm()">Send another</button></div>`}

/* ---------- lightbox ---------- */
function lightbox(i){const g=GALLERY[i];$("#modalRoot").innerHTML=`<div class="modal-bg lb" onclick="if(event.target===this)closeModal()"><button class="lb-x" onclick="closeModal()">×</button><button class="lb-nav l" onclick="lightbox(${(i+GALLERY.length-1)%GALLERY.length})">‹</button><figure><img src="${g[0]}" alt="${esc(g[1])}"><figcaption>${esc(g[1])}</figcaption></figure><button class="lb-nav r" onclick="lightbox(${(i+1)%GALLERY.length})">›</button></div>`}

/* ---------- boot ---------- */
if(location.search.includes('pane='))document.documentElement.classList.add('inframe');
load();if(seeded)save();parse();if(route==="table"&&param)scanTable(param);render(true);

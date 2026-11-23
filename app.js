/* Zaitoon Family Restaurant — website & smart dining system (by SaleForgers)
   One shared state drives the website, table ordering, kitchen display,
   waiter app and admin panel. Changes in one screen appear in the others. */

/* ===================== utils ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rs=n=>"Rs "+Math.round(n||0).toLocaleString("en-PK");
const now=()=>Date.now(),MIN=60000,HR=3600000,DAY=86400000;
const ago=t=>{const m=Math.floor((now()-t)/MIN);if(m<1)return"just now";if(m<60)return m+" min ago";const h=Math.floor(m/60);if(h<24)return h+" h ago";return Math.floor(h/24)+" d ago"};
const mmss=ms=>{const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const clock=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const uid=()=>Math.random().toString(36).slice(2,10);
const stageName=s=>(STAGES.find(x=>x[0]===s)||[,s])[1];
const tableOf=n=>TABLES.find(t=>t.n===+n);
function toast(m){const d=document.createElement("div");d.className="toast";d.textContent=m;$("#toasts").appendChild(d);setTimeout(()=>d.remove(),3200)}
function canSys(){try{return "Notification" in window&&Notification.permission==="granted"}catch(e){return false}}
function sysNote(title,body){if(!canSys())return;try{const n=new Notification(title,{body,icon:"img/logo.png",tag:title});n.onclick=()=>{window.focus();n.close()}}catch(e){}}
function askNotify(after){try{if(!("Notification" in window)){toast("This browser doesn't support notifications");return}Notification.requestPermission().then(p=>{toast(p==="granted"?"Notifications on 🔔":"Notifications blocked — you'll still see alerts on this page");if(p==="granted")sysNote("Zaitoon notifications are on","We'll let you know at every step.");render(true);after&&after()})}catch(e){toast("Notifications aren't available here")}}
function notifyBtn(){let st="default";try{st="Notification" in window?Notification.permission:"unsupported"}catch(e){st="unsupported"}if(st==="granted")return `<span class="chip gr">🔔 Notifications on</span>`;if(st==="denied"||st==="unsupported")return "";return `<button class="btn btn-line btn-sm" onclick="askNotify()">🔔 Turn on notifications</button>`}
function pushNote(title,body){if(document.hidden)sysNote(title,body);const d=document.createElement("div");d.className="lnotif";d.innerHTML=`<img src="img/logo.png" alt=""><div style="flex:1"><div class="row between"><b>${esc(title)}</b><span class="tiny" style="color:#6b6458">now</span></div><div>${esc(body)}</div></div>`;d.onclick=()=>d.remove();$("#push").prepend(d);setTimeout(()=>d.remove(),5200)}
function modal(html,wide){$("#modalRoot").innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal ${wide?"wide":""}">${html}</div></div>`}
function sheet(html){$("#modalRoot").innerHTML=`<div class="sheet-bg" onclick="if(event.target===this)closeModal()"><div class="sheet">${html}</div></div>`}
function closeModal(){$("#modalRoot").innerHTML=""}
const LOGO=`<img src="img/logo.png" alt="Zaitoon Family Restaurant">`;

/* ===================== state ===================== */
const KEY="zaitoon_proto_v1",DKEY="zaitoon_device_v1",PKEY="zaitoon_staff_ok";
let S,DEV;
function seed(){
  const t=now(),mk=(no,table,lines,status,agoMin,guest,source,extra)=>{
    const L=lines.map(([id,qty,variant,choices])=>{const it=MENU.find(m=>m.id===id);const v=variant?it.variants.find(x=>x.n===variant):null;const unit=v?v.p:it.price;return{id,name:it.name,qty,variant:variant||"",choices:choices||[],extras:[],note:"",unit,total:unit*qty}});
    const sub=L.reduce((a,l)=>a+l.total,0),c=t-agoMin*MIN,times={received:c};
    const idx=STAGES.findIndex(s=>s[0]===status);STAGES.slice(1,idx+1).forEach((s,i)=>times[s[0]]=c+(i+1)*4*MIN);
    return Object.assign({id:uid(),no,table,zone:tableOf(table).zone,lines:L,subtotal:sub,total:sub,status,times,created:c,source:source||"qr",guestId:guest?guest[0]:"",guestName:guest?guest[1]:"Table guest",waiter:WAITERS[tableOf(table).zone],visitId:"v"+table+"-seed",kot:true},extra||{});
  };
  const g={g1:["g1","Talha"],g2:["g2","Ezza"],g3:["g3","Fatima"],g4:["g4","Usman"],g5:["g5","Ayesha"]};
  const orders=[
    mk(201,5,[["karahi-karahi-chicken",1,"Full",["Medium"]],["naan-garlic-naan",4],["mocktails-mint-margarita",3]],"served",260,g.g4),
    mk(202,9,[["bbq-bbq-mix-platter-serves-4",1],["naan-roghani-naan",6],["drinks-coke",4]],"served",220,g.g2),
    mk(203,3,[["thai-chinese-szechuan",1,"Chicken"],["soups-chicken-corn-soup",2]],"served",190,g.g1),
    mk(204,14,[["steaks-beef-steak",2,null,["Mushroom","Mashed potato"]],["shakes-oreo-shake",2]],"served",150,g.g5),
    mk(205,7,[["burgers-smokehouse-beef-burger",3],["starters-loaded-fries",1]],"served",110,g.g3,"waiter"),
    mk(211,4,[["thai-chinese-chicken-chow-mein",1],["naan-garlic-naan",2],["mocktails-mint-margarita",2]],"preparing",11,g.g1),
    mk(212,10,[["steaks-beef-steak",1,null,["Mushroom","Jacket potato"]],["continental-stuffed-chicken-and-cheese",1]],"received",4,g.g2),
    mk(213,2,[["burgers-smokehouse-beef-burger",2],["starters-loaded-fries",1]],"ready",16,null,"waiter"),
    mk(214,12,[["karahi-karahi-chicken",1,"Half",["Spicy"]],["naan-garlic-naan",3]],"received",2,g.g5),
  ];
  const visits={};[2,4,10,12].forEach(n=>visits[n]={id:"v"+n+"-seed",openedAt:t-25*MIN,guests:[]});
  visits[4].guests=["Talha"];visits[10].guests=["Ezza"];visits[12].guests=["Ayesha"];
  return{seq:214,settings:{wifi:{ssid:"Zaitoon Guest",password:"zaitoon2026"},ordering:true},over:{},orders,visits,calls:[{id:uid(),table:12,type:"waiter",status:"open",created:t-1*MIN,guestName:"Ayesha"}],
    guests:{g1:{id:"g1",name:"Talha",phone:"03001112233",consent:true,visits:3,spend:14800,last:t-3*HR,first:t-40*DAY},g2:{id:"g2",name:"Ezza",phone:"03214445566",consent:true,visits:6,spend:31250,last:t-4*HR,first:t-90*DAY},g3:{id:"g3",name:"Fatima",phone:"03337778899",consent:false,visits:1,spend:3200,last:t-2*HR,first:t-2*HR},g4:{id:"g4",name:"Usman",phone:"03451234567",consent:true,visits:2,spend:9150,last:t-5*HR,first:t-20*DAY},g5:{id:"g5",name:"Ayesha",phone:"03009876543",consent:true,visits:4,spend:18900,last:t-2.5*HR,first:t-60*DAY}},
    feedback:[{id:uid(),table:5,name:"Usman",food:5,service:4,ambience:5,text:"Karahi was excellent. Rooftop at night is beautiful.",t:t-3*HR},{id:uid(),table:9,name:"Ezza",food:4,service:5,ambience:5,text:"Ordering from the phone was so easy.",t:t-2.6*HR},{id:uid(),table:7,name:"Fatima",food:4,service:3,ambience:4,text:"Burger great, fries a bit cold.",t:t-1.2*HR}],
    campaigns:[],
    reservations:[{id:uid(),ref:"ZR1007",name:"Hassan Ali",phone:"03125550101",date:new Date(t+DAY).toISOString().slice(0,10),time:"20:00",guests:6,area:"Rooftop",note:"Birthday dinner",status:"pending",t:t-40*MIN},{id:uid(),ref:"ZR1014",name:"Sara Khan",phone:"03215550202",date:new Date(t).toISOString().slice(0,10),time:"21:00",guests:4,area:"Family Hall",note:"",status:"confirmed",t:t-3*HR}],
    kmsg:[{id:uid(),from:"Bilal",to:"kitchen",no:211,text:"Guest at Table 4 asking for an update",t:t-3*MIN,replied:false},{id:uid(),from:"kitchen",to:"Sana",no:212,text:"Steak needs 5 more minutes",t:t-2*MIN,replied:false}],
    messages:[{id:uid(),name:"Bilal Ahmed",contact:"0300 5550303",subject:"Event or birthday booking",text:"Do you have space on the rooftop for 25 people next Saturday?",t:t-90*MIN,read:false}]};
}
let seeded=false;
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}if(!S||!S.orders){S=seed();seeded=true}migrate();try{DEV=JSON.parse(localStorage.getItem(DKEY))}catch(e){DEV=null}DEV=Object.assign({gid:"",name:"",consent:false,table:0,scanAt:0,welcomed:"",cart:[],seen:{},pushSeen:[],fb:[]},DEV||{})}
function migrate(){if(!S.waiters)S.waiters=[{name:"Bilal",status:"on"},{name:"Sana",status:"on"},{name:"Ali",status:"on"}];if(!S.assign){S.assign={};TABLES.forEach(t=>S.assign[t.n]=t.zone==="Family Hall"?(t.n<=4?"Bilal":"Ali"):"Sana")}if(!S.kmsg)S.kmsg=[];if(!S.reservations)S.reservations=[];if(!S.messages)S.messages=[]}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function saveDev(){try{localStorage.setItem(DKEY,JSON.stringify(DEV))}catch(e){}}
window.addEventListener("storage",e=>{if(e.key===KEY||e.key===DKEY){const prev=S;load();onChange(prev)}});

/* ===================== menu helpers ===================== */
const item=id=>{const m=MENU.find(x=>x.id===id);if(!m)return null;const o=S.over[id]||{};return Object.assign({},m,{price:o.price??m.price,soldOut:!!o.soldOut})};
const fromPrice=it=>it.variants.length?Math.min(...it.variants.map(v=>v.p)):it.price;

/* ===================== core actions ===================== */
function ensureVisit(table,name){let v=S.visits[table];if(!v){v=S.visits[table]={id:"v"+table+"-"+uid(),openedAt:now(),guests:[]}}if(name&&!v.guests.includes(name))v.guests.push(name);return v}
function placeOrder(table,lines,source,guest,waiter,extra){
  const v=table?ensureVisit(table,guest&&guest.name):{id:"ta-"+uid()};
  const sub=lines.reduce((a,l)=>a+l.total,0),no=++S.seq;
  const zone=table?tableOf(table).zone:"Takeaway";
  const o=Object.assign({id:uid(),no,table,zone,lines,subtotal:sub,total:sub,status:"received",times:{received:now()},created:now(),source,guestId:guest?guest.id:"",guestName:guest?guest.name:"Table guest",waiter:waiter||waiterFor(table),visitId:v.id,kot:true},extra||{});
  S.orders.push(o);save();return o;
}
function setStatus(id,st){const o=S.orders.find(x=>x.id===id);if(!o)return;o.status=st;o.times[st]=now();save();render();toast(`#${o.no} → ${stageName(st)}`)}
function addCall(table,type,name){if(S.calls.find(c=>c.table===table&&c.type===type&&c.status==="open")){toast(type==="bill"?"Bill already requested":"Your waiter is already on the way");return false}S.calls.push({id:uid(),table,type,status:"open",created:now(),guestName:name||"Guest"});save();return true}
function ackCall(id){const c=S.calls.find(x=>x.id===id);if(c){c.status="ack";c.ackAt=now();save();render()}}
function settleTable(table){
  const v=S.visits[table];if(!v)return;const os=S.orders.filter(o=>o.visitId===v.id);
  const per={};os.forEach(o=>{if(o.guestId)per[o.guestId]=(per[o.guestId]||0)+o.total});
  Object.entries(per).forEach(([gid,amt])=>{const g=S.guests[gid];if(g){g.visits++;g.spend+=amt;g.last=now()}});
  os.forEach(o=>{if(o.status!=="served"){o.status="served";o.times.served=now()}});
  S.calls.filter(c=>c.table===table&&c.status==="open").forEach(c=>{c.status="ack";c.ackAt=now()});
  v.closedAt=now();v.total=os.reduce((a,o)=>a+o.total,0);(S.closed=S.closed||[]).push(v);delete S.visits[table];save();render();toast(`Table ${table} settled · ${rs(v.total)}`);
}
function visitOrders(table){const v=S.visits[table];return v?S.orders.filter(o=>o.visitId===v.id):[]}

/* ===================== router ===================== */
let route="home",param=null,adminTab="dashboard",waiterFilter="all";
function parse(){const h=location.hash.slice(1)||"home";let m=h.match(/^(?:table-|guest-t)(\d+)$/);if(m){route="table";param=+m[1];return}m=h.match(/^track-(\d+)$/);if(m){route="track";param=+m[1];return}route=["home","table","kitchen","waiter","admin"].includes(h)?h:"home";param=null}
window.addEventListener("hashchange",()=>{const prev=route;parse();if(route==="table"&&param)scanTable(param);closeModal();render(true);if(!(prev==="home"&&route==="home"))window.scrollTo(0,0)});
function go(r){location.hash=r}

/* ===================== render dispatch ===================== */
let landingBuilt=false;
function render(full){
  document.body.dataset.route=route;
  if(route==="home"){if(!landingBuilt||full){renderSite();landingBuilt=true}else{updateSite();refreshFloat()}return}
  landingBuilt=false;
  const a=document.activeElement;if(!full&&a&&["INPUT","TEXTAREA","SELECT"].includes(a.tagName)&&$("#app").contains(a))return;
  if(["kitchen","waiter","admin"].includes(route)&&!staffOk()){renderPin();return}
  ({table:renderGuest,track:renderTrack,kitchen:renderKitchen,waiter:renderWaiter,admin:renderAdmin}[route])();
}
function onChange(prev){
  // staff alerts
  if(route==="track"){guestPushes();render();return}
  if(prev){const newOrders=S.orders.filter(o=>!prev.orders.find(p=>p.id===o.id));
    if(route==="kitchen")newOrders.forEach(o=>{const m=`🔔 New order #${o.no} · ${o.table?"Table "+o.table:"Takeaway"}`;toast(m);if(document.hidden)sysNote(m,o.lines.map(l=>l.qty+"× "+l.name).join(", "));if(DEV.autoKOT)printKOT(o.id)});
    if(route==="waiter"){S.orders.forEach(o=>{const p=prev.orders.find(x=>x.id===o.id);if(p&&p.status!=="ready"&&o.status==="ready"){const m=`✅ #${o.no} ready · ${o.table?"Table "+o.table:"Takeaway"}`;toast(m);if(document.hidden)sysNote(m,"Pick it up from the kitchen pass")}});S.calls.filter(c=>!prev.calls.find(p=>p.id===c.id)).forEach(c=>{const m=`🔔 Table ${c.table}: ${c.type==="bill"?"bill requested":"calling waiter"}`;toast(m);if(document.hidden)sysNote(m,c.guestName||"")})}}
  if(prev&&prev.kmsg)S.kmsg.filter(m=>!prev.kmsg.find(p=>p.id===m.id)).forEach(m=>{if(route==="kitchen"&&m.to==="kitchen")toast(`💬 ${m.from}: ${m.text}`);if(route==="waiter"&&m.to!=="kitchen"&&(waiterFilter==="all"||waiterFilter===m.to))toast(`💬 Kitchen → ${m.to}: ${m.text}`)});
  guestPushes();render();
}
function guestPushes(){
  if(!["table","track"].includes(route)||!DEV.gid)return;
  const msg={preparing:["Your order is being prepared","The kitchen has started on your food."],ready:["Your order is ready","It's coming out of the kitchen now."],picked_up:["On its way to your table","Your waiter is bringing your order."],served:["Enjoy your meal!","Tap to rate your food and service."]};
  S.orders.filter(o=>o.guestId&&o.guestId===DEV.gid).forEach(o=>{const last=DEV.seen[o.id];if(last&&last!==o.status&&msg[o.status])pushNote(msg[o.status][0]+` · #${o.no}`,msg[o.status][1]);DEV.seen[o.id]=o.status});
  if(DEV.consent)S.campaigns.forEach(c=>{if(!DEV.pushSeen.includes(c.id)&&c.t>DEV.scanAt-DAY){pushNote(c.title,c.body);DEV.pushSeen.push(c.id)}});
  saveDev();
}

/* ===================== shared site helpers ===================== */
let io;
function setupReveal(){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(".rv").forEach(el=>io.observe(el));
}
window.addEventListener("scroll",()=>{const n=$("#nav");if(n&&route==="home")n.classList.toggle("scrolled",scrollY>20)},{passive:true});
function guestUrl(n){return location.href.split("#")[0].split("?")[0]+"#table-"+n}
function copyGuestLink(n){const u=guestUrl(n);(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast("Table link copied")).catch(()=>modal(`<h3 style="font-size:26px">Table ${n} link</h3><input readonly value="${esc(u)}" onclick="this.select()" style="margin-top:12px"><div style="margin-top:14px"><button class="btn btn-line" onclick="closeModal()">Close</button></div>`))}
function drawQR(elId,n,size){const el=document.getElementById(elId);if(!el)return;el.innerHTML="";if(window.QRCode){const box=document.createElement("div");box.className="qrbox";el.appendChild(box);new QRCode(box,{text:guestUrl(n),width:size,height:size,colorDark:"#13110e",colorLight:"#ffffff"})}else el.innerHTML=`<span class="small dim">QR code loads with an internet connection</span>`}

/* ===================== STAFF PIN ===================== */
function staffOk(){try{return +localStorage.getItem(PKEY)>now()}catch(e){return true}}
let pinBuf="";
function shellTop(active){
  const k=S.orders.filter(o=>o.status==="received").length+S.kmsg.filter(m=>m.to==="kitchen"&&!m.replied).length,w=S.calls.filter(c=>c.status==="open").length+S.orders.filter(o=>o.status==="ready").length+S.kmsg.filter(m=>m.to!=="kitchen"&&!m.replied).length,a=(S.reservations||[]).filter(r=>r.status==="pending").length+(S.messages||[]).filter(m=>!m.read).length;
  return `<div class="shell-top"><div class="wrap"><a class="logo" href="#home">${LOGO}</a>
  <div class="tabs"><a href="#kitchen" class="${active==="kitchen"?"on":""}">Kitchen${k?`<span class="bdg">${k}</span>`:""}</a><a href="#waiter" class="${active==="waiter"?"on":""}">Waiter${w?`<span class="bdg">${w}</span>`:""}</a><a href="#admin" class="${active==="admin"?"on":""}">Admin${a?`<span class="bdg">${a}</span>`:""}</a><a href="#home">Website ↗</a></div>
  <span class="chip ol" style="white-space:nowrap">● Live</span><button class="btn btn-dark btn-xs" onclick="try{localStorage.removeItem(PKEY)}catch(e){};location.hash='home'">Log out</button></div></div>`;
}
function renderPin(){
  $("#app").innerHTML=shellTop(route)+`<div class="pin-wrap"><div class="pin"><div class="eyebrow">Staff only</div><h2 style="font-size:40px;margin:8px 0">Enter your PIN</h2><p class="small muted">Kitchen, waiter and admin screens need a staff PIN.</p><div class="pin-dots" id="pinDots">${[0,1,2,3].map(i=>`<i class="${i<pinBuf.length?"f":""}"></i>`).join("")}</div><div class="pad">${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(k=>k===""?"<span></span>":`<button onclick="pinKey('${k}')">${k}</button>`).join("")}</div></div></div>`;
}
function pinKey(k){if(k==="⌫")pinBuf=pinBuf.slice(0,-1);else if(pinBuf.length<4)pinBuf+=k;if(pinBuf.length===4){if(STAFF.some(s=>s.pin===pinBuf)){try{localStorage.setItem(PKEY,now()+12*HR)}catch(e){}pinBuf="";toast("Welcome");render(true);return}pinBuf="";renderPin();$(".pin").classList.add("shake");toast("Wrong PIN");return}renderPin()}
document.addEventListener("keydown",e=>{if($(".pin")&&/^[0-9]$/.test(e.key))pinKey(e.key);if($(".pin")&&e.key==="Backspace")pinKey("⌫")});

/* ===================== GUEST ===================== */
let gTab="menu",gCat="popular",gSearch="";
function scanTable(n){if(DEV.table!==n){DEV.welcomed=""}DEV.table=n;DEV.scanAt=now();saveDev()}
function guestRec(){return DEV.gid?S.guests[DEV.gid]:null}
function renderGuest(){
  const t=DEV.table&&tableOf(DEV.table);
  const fresh=t&&now()-DEV.scanAt<4*HR;
  let body;
  if(!fresh)body=guestScan();
  else if(DEV.welcomed!==DEV.table+":"+(S.visits[DEV.table]?S.visits[DEV.table].id:"new"))body=guestWelcome(t);
  else body=gTab==="orders"?guestOrders(t):guestMenu(t);
  $("#app").innerHTML=`<div class="phone-page"><div class="phone" id="phone">${body}</div></div>`;
  if(gTab==="menu"&&fresh){const s=$("#gSearch");if(s){s.oninput=()=>{gSearch=s.value;const l=$("#gList");if(l)l.innerHTML=guestList()}}}
}
function guestScan(){return `<div style="padding:40px 22px;text-align:center">${LOGO.replace("<img","<img style='height:60px;mix-blend-mode:lighten'")}
  <h2 style="font-size:40px;margin:26px 0 8px">Scan your table</h2><p class="muted">Point your camera at the QR code on your table, or tap your phone on the Zaitoon NFC tag.</p>
  <div class="card" style="padding:20px;margin:26px 0;text-align:left"><label class="lbl">Choose the table you're sitting at</label><select id="scanT">${TABLES.map(t=>`<option value="${t.n}">Table ${t.n} · ${t.zone}</option>`).join("")}</select>
  <div class="row" style="margin-top:14px"><button class="btn btn-gold" style="flex:1" onclick="location.hash='table-'+$('#scanT').value">📷 Scan QR</button><button class="btn btn-line" style="flex:1" onclick="location.hash='table-'+$('#scanT').value">📶 Tap NFC</button></div></div>
  <p class="small dim">For safety, ordering only works from a phone that scanned the table's code in the last few hours.</p><p style="margin-top:20px"><a class="small gold" href="#home">← Back to zaitoonfamilyrestaurant.com</a></p></div>`}
function guestWelcome(t){
  const g=guestRec(),w=S.settings.wifi;
  return `<div style="padding:28px 20px">
   <div class="center" style="text-align:center">${LOGO.replace("<img","<img style='height:54px;mix-blend-mode:lighten'")}<div class="eyebrow" style="margin-top:22px">Welcome to</div><h2 style="font-size:52px;margin:6px 0 2px">Table ${t.n}</h2><div class="muted">${t.zone}</div></div>
   <div class="wifi" style="margin:26px 0"><div class="row between"><span class="eyebrow">Free guest Wi-Fi</span><span>📶</span></div><div style="margin-top:10px"><div class="tiny muted">Network</div><b style="font-size:17px">${esc(w.ssid)}</b></div><div class="row between" style="margin-top:8px"><div><div class="tiny muted">Password</div><b style="font-size:17px;letter-spacing:.04em">${esc(w.password)}</b></div><button class="btn btn-dark btn-sm" onclick="copyText('${esc(w.password)}')">Copy</button></div></div>
   ${g?`<h3 style="font-size:30px">Welcome back, <span class="gold">${esc(g.name)}</span> 👋</h3><p class="small muted" style="margin:6px 0 14px">Good to see you again${g.visits?` — visit #${g.visits+1}`:""}.</p><input id="gName" value="${esc(g.name)}" style="display:none">`
     :`<label class="lbl">What should we call you?</label><input id="gName" placeholder="Your name" maxlength="30"><p class="tiny dim" style="margin:6px 0 14px">Just once. Your phone will remember you next time.</p>`}
   <label class="row" style="gap:10px;font-size:14px;margin-bottom:20px"><input type="checkbox" id="gConsent" ${DEV.consent?"checked":""}> Send me Zaitoon's offers and special nights</label>
   <button class="btn btn-gold" style="width:100%" onclick="guestEnter()">Continue to the menu →</button>
   <p class="tiny dim" style="text-align:center;margin-top:16px">No app to install. Order, follow your food and call your waiter from this page.</p></div>`;
}
function copyText(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("Copied")).catch(()=>toast(t))}
function guestEnter(){
  const name=($("#gName").value||"").trim();if(!name){toast("Please enter your name");$("#gName").focus();return}
  let g=guestRec();if(!g){const id="g"+uid();g=S.guests[id]={id,name,consent:false,visits:0,spend:0,last:now(),first:now()};DEV.gid=id}
  g.name=name;g.consent=$("#gConsent").checked;g.last=now();DEV.name=name;DEV.consent=g.consent;
  const v=ensureVisit(DEV.table,name);DEV.welcomed=DEV.table+":"+v.id;save();saveDev();gTab="menu";render(true);
}
function guestHead(t){const n=DEV.cart.reduce((a,c)=>a+c.qty,0),act=visitOrders(t.n).filter(o=>o.status!=="served").length;
  return `<div class="g-head"><a href="#home">${LOGO}</a><div class="tabs" style="padding:3px"><button class="${gTab==="menu"?"on":""}" onclick="gTab='menu';render(true)">Menu</button><button class="${gTab==="orders"?"on":""}" onclick="gTab='orders';render(true)">Orders${act?`<span class="bdg">${act}</span>`:""}</button></div><span class="chip">T${t.n}</span></div>`}
function guestMenu(t){
  const pops=MENU.filter(m=>m.popular&&m.img).map(m=>item(m.id));
  return guestHead(t)+`<div style="padding:16px 16px 6px"><div class="tiny muted">Hi ${esc(DEV.name||"there")} · ${t.zone}</div><h2 style="font-size:34px">What are you craving?</h2><input id="gSearch" placeholder="Search ${MENU.length} dishes…" value="${esc(gSearch)}" style="margin-top:12px"></div>
  <div class="g-cats">${[["popular","★ Popular"],...CATS.map(c=>[c[0],c[1]])].map(([id,n])=>`<button class="${gCat===id?"on":""}" onclick="gCat='${id}';gSearch='';render(true)">${esc(n)}</button>`).join("")}</div>
  ${gCat==="popular"&&!gSearch?`<div style="padding:16px 16px 6px" class="eyebrow">Guest favourites</div><div class="pop-strip">${pops.map(p=>`<div class="pop" onclick="openItem('${p.id}')"><div class="im"><img src="${p.img}" alt="${esc(p.name)}"></div><b>${esc(p.name)}</b><span class="small gold">${p.variants.length?"from ":""}${rs(fromPrice(p))}</span></div>`).join("")}</div>`:""}
  <div id="gList">${guestList()}</div>
  ${DEV.cart.length?`<div class="g-bottom"><button class="btn btn-gold" onclick="openCart()">View order · ${DEV.cart.reduce((a,c)=>a+c.qty,0)} items · ${rs(DEV.cart.reduce((a,c)=>a+c.total,0))}</button></div>`:`<div class="g-bottom"><button class="btn btn-dark" onclick="guestCall('waiter')">🔔 Call waiter</button><button class="btn btn-dark" onclick="guestCall('bill')">🧾 Request bill</button></div>`}`;
}
function guestList(){
  const q=gSearch.toLowerCase();let list;
  if(q)list=MENU.filter(m=>(m.name+" "+m.desc).toLowerCase().includes(q));
  else if(gCat==="popular")list=MENU.filter(m=>m.popular);
  else list=MENU.filter(m=>m.cat===gCat);
  const cat=CATS.find(c=>c[0]===gCat);
  return (cat&&!q&&cat[2]?`<p class="small muted" style="padding:12px 16px 0">${esc(cat[2])}</p>`:"")+(list.length?list.map(m=>{const it=item(m.id);return `<div class="g-item ${it.soldOut?"out":""}" onclick="${it.soldOut?"toast('Sorry, sold out today')":`openItem('${it.id}')`}"><div style="flex:1;min-width:0"><h4>${esc(it.name)} ${it.spicy?"🌶️":""}</h4><p>${esc(it.desc||it.unit||CATS.find(c=>c[0]===it.cat)[1])}</p><div class="row" style="gap:8px">${it.soldOut?`<span class="sold">Sold out</span>`:`<b class="gold">${it.variants.length?"from ":""}${rs(fromPrice(it))}</b>`}${it.unit?`<span class="tiny dim">${esc(it.unit)}</span>`:""}${it.popular?`<span class="tag st-picked_up">Popular</span>`:""}</div></div><div class="im">${it.img?`<img src="${it.img}" alt="${esc(it.name)}" loading="lazy">`:esc(it.name[0])}</div></div>`}).join(""):`<div class="empty">No dishes match “${esc(gSearch)}”.</div>`);
}
let sel=null;
function openItem(id){const it=item(id);sel={id,v:0,c:{},e:[],note:"",qty:1};it.choices.forEach(c=>sel.c[c.n]=c.o[0]);drawItem()}
function selPrice(it){const base=it.variants.length?it.variants[sel.v].p:it.price;return base+sel.e.reduce((a,i)=>a+it.extras[i].p,0)}
function drawItem(){const it=item(sel.id);
  sheet(`${it.img?`<div class="hero-im"><img src="${it.img}" alt="${esc(it.name)}"></div>`:""}<div style="padding:22px">
   <div class="row between"><h2 style="font-size:32px">${esc(it.name)}</h2><button onclick="closeModal()" style="font-size:24px">×</button></div>
   <p class="muted small" style="margin:6px 0 16px">${esc(it.desc)} ${it.unit?`· ${esc(it.unit)}`:""}</p>
   ${it.variants.length?`<label class="lbl">Choose</label>${it.variants.map((v,i)=>`<div class="opt ${sel.v===i?"on":""}" onclick="sel.v=${i};drawItem()"><span>${esc(v.n)}</span><b>${rs(v.p)}</b></div>`).join("")}`:""}
   ${it.choices.map(c=>`<label class="lbl" style="margin-top:14px">${esc(c.n)}</label><div class="row" style="gap:8px">${c.o.map(o=>`<button class="chip ${sel.c[c.n]===o?"":"gr"}" onclick="sel.c['${c.n}']='${o}';drawItem()">${esc(o)}</button>`).join("")}</div>`).join("")}
   ${it.extras.length?`<label class="lbl" style="margin-top:16px">Add-ons</label>${it.extras.map((x,i)=>`<div class="opt ${sel.e.includes(i)?"on":""}" onclick="sel.e.includes(${i})?sel.e=sel.e.filter(z=>z!==${i}):sel.e.push(${i});drawItem()"><span>${sel.e.includes(i)?"☑":"☐"} ${esc(x.n)}</span><span class="muted">+ ${rs(x.p)}</span></div>`).join("")}`:""}
   <label class="lbl" style="margin-top:16px">Note for the kitchen</label><input id="selNote" placeholder="e.g. less oil, no onions" value="${esc(sel.note)}" oninput="sel.note=this.value">
   <div class="row between" style="margin-top:20px"><span class="qty"><button onclick="sel.qty=Math.max(1,sel.qty-1);drawItem()">−</button><span>${sel.qty}</span><button onclick="sel.qty++;drawItem()">+</button></span><button class="btn btn-gold" style="flex:1" onclick="addToCart()">Add · ${rs(selPrice(it)*sel.qty)}</button></div></div>`)}
function addToCart(){const it=item(sel.id),unit=selPrice(it);
  DEV.cart.push({id:it.id,name:it.name,qty:sel.qty,variant:it.variants.length?it.variants[sel.v].n:"",choices:Object.values(sel.c),extras:sel.e.map(i=>it.extras[i].n),note:(sel.note||"").trim(),unit,total:unit*sel.qty});
  saveDev();closeModal();toast(`Added ${it.name}`);if(route==="home")refreshFloat();else render(true)}
function openCart(){
  if(!DEV.cart.length){closeModal();render(true);return}
  const sub=DEV.cart.reduce((a,c)=>a+c.total,0);
  sheet(`<div style="padding:22px"><div class="row between"><h2 style="font-size:32px">Your order</h2><button onclick="closeModal()" style="font-size:24px">×</button></div><p class="small muted">Table ${DEV.table} · ${esc(DEV.name)}</p>
   <div style="margin:14px 0">${DEV.cart.map((c,i)=>`<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line);align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0"><b>${esc(c.name)}</b>${lineMods(c)}<div class="small gold">${rs(c.unit)}</div></div><span class="qty"><button onclick="cartQ(${i},-1)">−</button><span>${c.qty}</span><button onclick="cartQ(${i},1)">+</button></span></div>`).join("")}</div>
   <div class="row between"><span class="muted">Subtotal</span><b>${rs(sub)}</b></div><div class="row between small dim" style="margin-top:4px"><span>Service & tax</span><span>${S.settings.servicePct?S.settings.servicePct+"%":"Included"}</span></div>
   <div class="row between" style="margin-top:10px;font-size:20px"><b>Total</b><b class="gold">${rs(sub)}</b></div>
   <button class="btn btn-gold" style="width:100%;margin-top:18px" onclick="sendOrder()">Send to kitchen →</button><p class="tiny dim" style="text-align:center;margin-top:10px">Pay at the end — your waiter brings the bill.</p></div>`)}
function lineMods(l){const m=[l.variant,...(l.choices||[]),...(l.extras||[]).map(x=>"+ "+x)].filter(Boolean).join(" · ");return (m?`<span class="mods-txt">${esc(m)}</span>`:"")+(l.note?`<span class="mods-txt" style="color:var(--gold2)">“${esc(l.note)}”</span>`:"")}
function cartQ(i,d){const c=DEV.cart[i];c.qty+=d;if(c.qty<=0)DEV.cart.splice(i,1);else c.total=c.unit*c.qty;saveDev();openCart();if(!DEV.cart.length)render(true)}
function sendOrder(){
  if(!S.settings.ordering){toast("Ordering is paused — please ask your waiter");return}
  if(now()-DEV.scanAt>4*HR){toast("Please scan your table code again");return}
  const g=guestRec();const o=placeOrder(DEV.table,DEV.cart.map(c=>({...c})),"qr",g?{id:g.id,name:g.name}:{id:"",name:DEV.name||"Guest"});
  DEV.seen[o.id]="received";DEV.cart=[];saveDev();closeModal();gTab="orders";render(true);pushNote(`Order #${o.no} received`,"The kitchen has your order. We'll update you at every step.");
}
function guestCall(type){if(!DEV.table)return;if(addCall(DEV.table,type,DEV.name)){toast(type==="bill"?"Bill requested — your waiter is coming":"Your waiter has been notified");render(true)}}
let fb={food:0,service:0,ambience:0};
function guestOrders(t){
  const os=visitOrders(t.n).slice().reverse(),total=os.reduce((a,o)=>a+o.total,0);
  const anyServed=os.some(o=>o.status==="served"),vid=S.visits[t.n]?S.visits[t.n].id:"",gave=DEV.fb.includes(vid);
  const openCalls=S.calls.filter(c=>c.table===t.n&&c.status==="open");
  return guestHead(t)+`<div style="padding:18px 16px"><h2 style="font-size:34px">Your table's orders</h2><p class="small muted">Live — updates the moment the kitchen or your waiter does something.</p><div style="margin-top:10px">${notifyBtn()}</div></div>
  ${os.length?os.map(o=>{const idx=STAGES.findIndex(s=>s[0]===o.status);return `<div class="card" style="margin:0 16px 14px;padding:16px"><div class="row between"><b>Order #${o.no}</b><span class="tag st-${o.status}">${stageName(o.status)}</span></div><div class="tiny dim">${o.guestId===DEV.gid?"You":esc(o.guestName)} · ${clock(o.created)} · ${o.source==="waiter"?"by waiter":"from phone"}</div>
   <div class="trk"><div class="fill" style="width:${idx/(STAGES.length-1)*80}%"></div>${STAGES.map((s,i)=>`<div class="s ${i<idx||o.status==="served"?"done":i===idx?"now":""}"><i>${i<idx||o.status==="served"?"✓":i+1}</i>${s[1]}</div>`).join("")}</div>
   <div style="margin-top:8px">${o.lines.map(l=>`<div class="row between small" style="padding:4px 0;flex-wrap:nowrap"><span>${l.qty} × ${esc(l.name)}${lineMods(l)}</span><span class="muted">${rs(l.total)}</span></div>`).join("")}</div></div>`}).join(""):`<div class="empty">No orders yet. <a class="gold" href="#" onclick="gTab='menu';render(true);return false">Open the menu →</a></div>`}
  ${os.length?`<div class="card" style="margin:0 16px 14px;padding:16px"><div class="row between"><span class="muted">Table total so far</span><b class="gold" style="font-size:20px">${rs(total)}</b></div></div>`:""}
  ${anyServed&&!gave?`<div class="card" style="margin:0 16px 14px;padding:18px;border-color:rgba(214,168,78,.4)"><div class="eyebrow">How was everything?</div>${["food","service","ambience"].map(k=>`<div class="row between" style="margin-top:12px"><span style="text-transform:capitalize">${k}</span><div class="stars">${[1,2,3,4,5].map(n=>`<button class="${fb[k]>=n?"on":""}" onclick="fb.${k}=${n};render(true)">★</button>`).join("")}</div></div>`).join("")}<textarea id="fbText" rows="2" placeholder="Anything we should know? (optional)" style="margin-top:12px"></textarea><button class="btn btn-gold" style="width:100%;margin-top:12px" onclick="sendFeedback()">Send feedback</button></div>`:gave?`<p class="small gold" style="padding:0 16px 14px">Thank you for your feedback 🌿</p>`:""}
  <div class="g-bottom"><button class="btn ${openCalls.some(c=>c.type==="waiter")?"btn-dark":"btn-line"}" onclick="guestCall('waiter')">🔔 ${openCalls.some(c=>c.type==="waiter")?"Waiter coming":"Call waiter"}</button><button class="btn ${openCalls.some(c=>c.type==="bill")?"btn-dark":"btn-gold"}" onclick="guestCall('bill')">🧾 ${openCalls.some(c=>c.type==="bill")?"Bill requested":"Request bill"}</button></div>`;
}
function sendFeedback(){if(!fb.food||!fb.service||!fb.ambience){toast("Please rate all three");return}
  const vid=S.visits[DEV.table]?S.visits[DEV.table].id:"";S.feedback.push({id:uid(),table:DEV.table,gid:DEV.gid,name:DEV.name||"Guest",...fb,text:($("#fbText").value||"").trim(),t:now()});DEV.fb.push(vid);fb={food:0,service:0,ambience:0};save();saveDev();toast("Thank you!");render(true)}

/* ===================== STAFF: waiters, assignment & kitchen messaging ===================== */
const QUICK_K=["On it 👍","5 more minutes","Out of stock — please suggest an alternative","Ready now — please pick up"];
const QUICK_W=["Rush please — guest is waiting","Guest asking for an update","Allergy: no nuts","Make it less spicy","Guest added an extra naan"];
function assigned(t){return (S.assign&&S.assign[t])||WAITERS[tableOf(t).zone]}
function onDuty(){return S.waiters.filter(w=>w.status==="on")}
function waiterLoad(n){return S.orders.filter(o=>o.waiter===n&&["received","preparing","ready","picked_up"].includes(o.status)).length}
function waiterFor(t){if(!t)return"Counter";const a=assigned(t),w=S.waiters.find(x=>x.name===a);if(w&&w.status==="on")return a;const d=onDuty();return d.length?d.slice().sort((x,y)=>waiterLoad(x.name)-waiterLoad(y.name))[0].name:a}
function sendK(from,to,no,text){S.kmsg.push({id:uid(),from,to,no:no||"",text,t:now(),replied:false});save()}
function replyK(id,text){const m=S.kmsg.find(x=>x.id===id);if(!m)return;m.replied=true;sendK(m.to,m.from,m.no,text);toast("Reply sent");render(true)}
function reassign(oid,w){const o=S.orders.find(x=>x.id===oid);if(!o)return;const old=o.waiter;o.waiter=w;save();sendK("kitchen",w,o.no,`Order #${o.no} (${o.table?"Table "+o.table:"Takeaway"}) is now assigned to you${old&&old!==w?" (was "+old+")":""}.`);toast(`#${o.no} assigned to ${w}`);render(true)}
function callPickup(oid){const o=S.orders.find(x=>x.id===oid);sendK("kitchen",o.waiter,o.no,`Order #${o.no} for ${o.table?"Table "+o.table:"takeaway"} is ready — please pick up.`);toast(`${o.waiter} notified`)}
function msgModal(from,to,no,quick){modal(`<div class="row between"><h2 style="font-size:30px">${from==="kitchen"?"Message "+esc(to):"Message the kitchen"}</h2><button onclick="closeModal()" style="font-size:24px">×</button></div>
  ${from!=="kitchen"?`<label class="lbl" style="margin-top:12px">About order</label><select id="mkNo"><option value="">General</option>${S.orders.filter(o=>o.waiter===from&&["received","preparing","ready"].includes(o.status)).map(o=>`<option value="${o.no}" ${+no===o.no?"selected":""}>#${o.no} · ${o.table?"Table "+o.table:"Takeaway"}</option>`).join("")}</select>`:`<p class="small muted">About order #${no}</p>`}
  <label class="lbl" style="margin-top:12px">Quick message</label><div class="row" style="gap:8px">${quick.map(q=>`<button class="chip gr" onclick="$('#mkT').value=this.textContent">${esc(q)}</button>`).join("")}</div>
  <textarea id="mkT" rows="2" style="margin-top:12px" placeholder="Type a message"></textarea>
  <button class="btn btn-gold" style="margin-top:14px" onclick="const t=$('#mkT').value.trim();if(!t){toast('Write a message');return}sendK('${from}','${to}',${from==="kitchen"?`'${no}'`:"$('#mkNo').value"},t);closeModal();toast('Message sent');render(true)">Send</button>`)}
function msgList(me,quick){const ms=S.kmsg.filter(m=>m.to===me||(me==="all"&&m.to!=="kitchen")).slice(-8).reverse();
  return ms.length?ms.map(m=>`<div class="alert ${m.replied?"":"hot"}" style="align-items:flex-start"><div style="flex:1"><b>💬 ${m.from==="kitchen"?"Kitchen":esc(m.from)}</b>${m.to!=="kitchen"&&me==="all"?` <span class="tiny dim">→ ${esc(m.to)}</span>`:""}${m.no?` <span class="chip gr">#${m.no}</span>`:""}<div class="small" style="margin-top:4px">${esc(m.text)}</div><div class="tiny dim">${ago(m.t)}</div>${!m.replied&&me!=="all"?`<div class="row" style="gap:6px;margin-top:8px">${quick.map(q=>`<button class="chip gr" onclick="replyK('${m.id}','${esc(q).replace(/'/g,"&#39;")}')">${esc(q)}</button>`).join("")}</div>`:""}</div></div>`).join(""):`<div class="empty">No messages</div>`}

/* ===================== KITCHEN ===================== */
function renderKitchen(){
  const col=st=>S.orders.filter(o=>o.status===st).sort((a,b)=>a.created-b.created);
  const done=S.orders.filter(o=>["picked_up","served"].includes(o.status)&&now()-o.created<DAY).length;
  const inbox=S.kmsg.filter(m=>m.to==="kitchen"&&!m.replied);
  $("#app").innerHTML=shellTop("kitchen")+`<div class="shell"><div class="row between" style="margin-bottom:18px"><div><div class="eyebrow">Kitchen display</div><h2 style="font-size:40px">Tickets</h2></div><div class="row"><span class="chip gr">${done} sent out today</span><span class="chip gr">On duty: ${onDuty().map(w=>esc(w.name)).join(", ")||"—"}</span><span class="chip gr" id="kClock">${clock(now())}</span><button class="btn btn-${DEV.autoKOT?"gold":"line"} btn-sm" onclick="toggleAutoKOT()">🖨 Auto-print KOT: ${DEV.autoKOT?"On":"Off"}</button>${notifyBtn()}</div></div>
  ${inbox.length?`<div class="card" style="padding:14px 16px;margin-bottom:16px;border-color:rgba(224,112,90,.45)"><div class="eyebrow" style="margin-bottom:8px">Messages from waiters · ${inbox.length}</div>${msgList("kitchen",QUICK_K)}</div>`:""}
  <div class="kds">${[["received","Received"],["preparing","Preparing"],["ready","Ready — waiting for waiter"]].map(([st,n])=>{const os=col(st);return `<div class="kcol"><h3><span>${n}</span><span>${os.length}</span></h3>${os.length?os.map(o=>{const late=now()-o.created>20*MIN&&st!=="ready";return `<div class="ticket ${st} ${late?"late":""}"><div class="row between"><b style="font-size:16px">#${o.no} · ${o.table?"Table "+o.table:"🥡 Takeaway"}</b><span class="timer" data-t="${o.created}" style="color:${late?"var(--red)":"var(--muted)"}">${mmss(now()-o.created)}</span></div><div class="row" style="gap:6px;margin-top:4px"><span class="tag ${o.source==="waiter"?"st-picked_up":"st-received"}">${srcName(o)}</span><span class="tiny dim">${o.zone} · ${esc(o.guestName)}${o.pickup?" · "+esc(o.pickup):""}</span></div>
   <ul class="lines">${o.lines.map(l=>`<li><b>${l.qty}×</b> ${esc(l.name)}${lineMods(l)}</li>`).join("")}</ul>
   <div class="row between" style="margin-bottom:10px;gap:6px"><span class="tiny muted">👤 Waiter</span>${o.table?`<select class="wsel" onchange="reassign('${o.id}',this.value)">${S.waiters.map(w=>`<option ${o.waiter===w.name?"selected":""} value="${esc(w.name)}">${esc(w.name)}${w.status!=="on"?" (break)":""}</option>`).join("")}</select>`:`<span class="tiny">Counter</span>`}</div>
   <div class="row between"><div class="row" style="gap:6px"><button class="btn btn-dark btn-xs" onclick="showKOT('${o.id}')">🖨 KOT${o.kotPrinted?" ✓":""}</button>${o.table?`<button class="btn btn-dark btn-xs" onclick="msgModal('kitchen','${esc(o.waiter)}','${o.no}',QUICK_K)">💬</button>`:""}</div>${st==="received"?`<button class="btn btn-gold btn-sm" onclick="setStatus('${o.id}','preparing')">Start preparing</button>`:st==="preparing"?`<button class="btn btn-gold btn-sm" onclick="setStatus('${o.id}','ready')">Mark ready</button>`:o.table?`<button class="btn btn-line btn-sm" onclick="callPickup('${o.id}')">🔔 Call ${esc(o.waiter)}</button>`:`<span class="small" style="color:var(--green)">At counter</span>`}</div></div>`}).join(""):`<div class="empty">No tickets</div>`}</div>`}).join("")}</div></div>`;
}
function srcName(o){return o.source==="waiter"?"Waiter":o.source==="online"?"Online":"Table QR"}
function kotHtml(o){return `<div class="kot"><div style="text-align:center"><b>ZAITOON FAMILY RESTAURANT</b><br>KITCHEN ORDER TICKET</div><hr><div><b>KOT #${o.no}</b>&nbsp;&nbsp;&nbsp;<b>${o.table?"TABLE "+o.table:"TAKEAWAY"}</b></div><div>${o.zone.toUpperCase()} · ${srcName(o).toUpperCase()}</div><div>WAITER: ${esc((o.waiter||"Counter").toUpperCase())}</div><div>${new Date(o.created).toLocaleString()}</div><hr>${o.lines.map(l=>`<div><b>${l.qty} x ${esc(l.name)}</b></div>${[l.variant,...(l.choices||[]),...(l.extras||[]).map(x=>"+"+x)].filter(Boolean).map(m=>`<div>&nbsp;&nbsp;- ${esc(m)}</div>`).join("")}${l.note?`<div>&nbsp;&nbsp;** ${esc(l.note)}</div>`:""}`).join("")}<hr><div style="text-align:center">Guest: ${esc(o.guestName)}</div><div style="text-align:center">Items: ${o.lines.reduce((a,l)=>a+l.qty,0)}</div></div>`}
function showKOT(id){const o=S.orders.find(x=>x.id===id);modal(kotHtml(o)+`<p class="tiny dim" style="text-align:center;margin-top:10px">Sized for 80 mm thermal printers</p><div class="row" style="justify-content:center;margin-top:10px"><button class="btn btn-gold btn-sm" onclick="closeModal();printKOT('${o.id}')">🖨 Print</button><button class="btn btn-line btn-sm" onclick="closeModal()">Close</button></div>`)}
function printKOT(id){const o=S.orders.find(x=>x.id===id);if(!o)return;let a=document.getElementById("printArea");if(!a){a=document.createElement("div");a.id="printArea";document.body.appendChild(a)}a.innerHTML=kotHtml(o);o.kotPrinted=(o.kotPrinted||0)+1;save();setTimeout(()=>{try{window.print()}catch(e){toast("Printing isn't available in this window")}},50)}
function toggleAutoKOT(){DEV.autoKOT=!DEV.autoKOT;saveDev();toast(DEV.autoKOT?"New tickets will print automatically":"Auto-print off");render(true)}

/* ===================== WAITER ===================== */
function tableState(n){
  const os=visitOrders(n),calls=S.calls.filter(c=>c.table===n&&c.status==="open");
  if(calls.length)return["call",calls.some(c=>c.type==="bill")?"🧾 Bill requested":"🔔 Calling"];
  if(os.some(o=>o.status==="ready"))return["ready","✅ Food ready"];
  if(os.some(o=>["received","preparing"].includes(o.status)))return["cooking","🔥 In kitchen"];
  if(S.visits[n])return["seated",os.length?"Dining":"Seated"];
  return["","Free"];
}
function renderWaiter(){
  const me=waiterFilter,all=me==="all",W=S.waiters.find(w=>w.name===me);
  const mineT=t=>all||assigned(t)===me,mineO=o=>all||o.waiter===me;
  const ready=S.orders.filter(o=>o.status==="ready"&&mineO(o)),out=S.orders.filter(o=>o.status==="picked_up"&&mineO(o)),calls=S.calls.filter(c=>c.status==="open"&&mineT(c.table));
  const inK=S.orders.filter(o=>["received","preparing"].includes(o.status)&&mineO(o)&&o.table);
  $("#app").innerHTML=shellTop("waiter")+`<div class="shell"><div class="row between" style="margin-bottom:18px"><div><div class="eyebrow">Waiter app</div><h2 style="font-size:40px">${all?"Floor":esc(me)+"'s tables"}</h2></div>
   <div class="row"><div class="tabs">${[{name:"all"},...S.waiters].map(w=>`<button class="${me===w.name?"on":""}" onclick="waiterFilter='${esc(w.name)}';render(true)">${w.name==="all"?"All":esc(w.name)}${w.status&&w.status!=="on"?" ☕":""}</button>`).join("")}</div>
   ${W?`<button class="btn ${W.status==="on"?"btn-line":"btn-gold"} btn-sm" onclick="toggleDuty('${esc(W.name)}')">${W.status==="on"?"Go on break":"Back on duty"}</button><button class="btn btn-gold btn-sm" onclick="msgModal('${esc(W.name)}','kitchen','',QUICK_W)">💬 Message kitchen</button>`:""}${notifyBtn()}</div></div>
  <div class="wgrid"><div>${["Family Hall","Rooftop"].map(z=>`<div class="zone"><h4>${z}</h4><div class="tmap">${TABLES.filter(t=>t.zone===z).map(t=>{const[s,l]=tableState(t.n);const tot=visitOrders(t.n).reduce((a,o)=>a+o.total,0);return `<div class="tbl ${s}" style="${mineT(t.n)?"":"opacity:.3"}" onclick="tableModal(${t.n})"><b>${t.n}</b><div class="s">${l}</div><div class="tiny dim" style="margin-top:4px">👤 ${esc(assigned(t.n))}</div>${tot?`<div class="tiny gold">${rs(tot)}</div>`:""}</div>`}).join("")}</div></div>`).join("")}</div>
  <div><h3 class="serif" style="font-size:28px;margin-bottom:12px">Alerts</h3>
   ${calls.map(c=>`<div class="alert hot"><div><b>Table ${c.table}</b> · ${c.type==="bill"?"🧾 Bill requested":"🔔 Calling waiter"}<div class="tiny dim">${esc(c.guestName)} · ${ago(c.created)} · 👤 ${esc(assigned(c.table))}</div></div>${c.type==="bill"?`<button class="btn btn-gold btn-sm" onclick="tableModal(${c.table})">Settle</button>`:`<button class="btn btn-gold btn-sm" onclick="ackCall('${c.id}')">On my way</button>`}</div>`).join("")}
   ${ready.map(o=>o.table?`<div class="alert ok"><div><b>#${o.no} · Table ${o.table}</b> · ✅ Ready<div class="tiny dim">${o.lines.map(l=>l.qty+"× "+esc(l.name)).join(", ")} · 👤 ${esc(o.waiter)}</div></div><button class="btn btn-gold btn-sm" onclick="setStatus('${o.id}','picked_up')">Pick up</button></div>`:`<div class="alert ok"><div><b>#${o.no} · 🥡 Takeaway</b> · Ready at counter<div class="tiny dim">${esc(o.guestName)} · ${esc(o.phone||"")}</div></div><button class="btn btn-gold btn-sm" onclick="setStatus('${o.id}','served')">Handed over</button></div>`).join("")}
   ${out.map(o=>`<div class="alert"><div><b>#${o.no} · Table ${o.table}</b> · On its way<div class="tiny dim">Picked up ${ago(o.times.picked_up)} · 👤 ${esc(o.waiter)}</div></div><button class="btn btn-line btn-sm" onclick="setStatus('${o.id}','served')">Served</button></div>`).join("")}
   ${!calls.length&&!ready.length&&!out.length?`<div class="empty card">All quiet. Calls and ready orders appear here instantly.</div>`:""}
   <h3 class="serif" style="font-size:24px;margin:22px 0 10px">Kitchen messages</h3>${msgList(all?"all":me,["Coming 👍","Will tell the guest","Guest is fine with that"])}
   <h3 class="serif" style="font-size:24px;margin:22px 0 10px">In the kitchen</h3>${inK.length?inK.map(o=>`<div class="alert"><div><b>#${o.no} · Table ${o.table}</b> <span class="tag st-${o.status}">${stageName(o.status)}</span><div class="tiny dim">${mmss(now()-o.created)} min · 👤 ${esc(o.waiter)}</div></div>${!all?`<button class="btn btn-dark btn-xs" onclick="msgModal('${esc(me)}','kitchen','${o.no}',QUICK_W)">💬</button>`:""}</div>`).join(""):`<div class="empty">Nothing cooking</div>`}
  </div></div></div>`;
}
function toggleDuty(n){const w=S.waiters.find(x=>x.name===n);w.status=w.status==="on"?"break":"on";save();toast(w.status==="on"?`${n} is back on duty`:`${n} is on break — new orders go to the least busy waiter`);render(true)}
let wCart=[];
function tableModal(n){
  const t=tableOf(n),os=visitOrders(n),tot=os.reduce((a,o)=>a+o.total,0),v=S.visits[n];
  modal(`<div class="row between"><div><div class="eyebrow">${t.zone}</div><h2 style="font-size:40px">Table ${n}</h2></div><button onclick="closeModal()" style="font-size:24px">×</button></div>
   <div class="row" style="margin:6px 0 4px"><span class="small muted">Assigned waiter</span><select style="max-width:180px;padding:7px 10px" onchange="S.assign[${n}]=this.value;save();toast('Table ${n} assigned to '+this.value);render(true);tableModal(${n})">${S.waiters.map(w=>`<option ${assigned(n)===w.name?"selected":""}>${esc(w.name)}</option>`).join("")}</select></div>
   ${v?`<p class="small muted">Seated ${ago(v.openedAt)}${v.guests.length?" · "+v.guests.map(esc).join(", "):""}</p>`:`<p class="small muted">Table is free.</p>`}
   <div style="margin:16px 0">${os.length?os.map(o=>`<div class="row between" style="padding:10px 0;border-bottom:1px solid var(--line)"><div><b>#${o.no}</b> <span class="tag st-${o.status}">${stageName(o.status)}</span><div class="tiny dim">${o.lines.map(l=>l.qty+"× "+esc(l.name)).join(", ")} · 👤 ${esc(o.waiter)}</div></div><span>${rs(o.total)}</span></div>`).join(""):`<div class="empty">No orders on this table yet.</div>`}</div>
   ${os.length?`<div class="row between" style="font-size:20px"><b>Bill</b><b class="gold">${rs(tot)}</b></div>`:""}
   <div class="row" style="margin-top:18px"><button class="btn btn-gold" onclick="waiterOrder(${n})">＋ Take order</button>${v?`<button class="btn btn-line" onclick="closeModal();settleTable(${n})">Settle bill & close table</button>`:""}</div>`,true);
}
function waiterOrder(n){wCart=[];drawWaiterOrder(n,"")}
function drawWaiterOrder(n,q){
  const list=MENU.filter(m=>!q||m.name.toLowerCase().includes(q.toLowerCase())).slice(0,q?40:24).map(m=>item(m.id));
  modal(`<div class="row between"><h2 style="font-size:32px">Order for Table ${n}</h2><button onclick="closeModal()" style="font-size:24px">×</button></div><p class="small muted">Sent straight to the kitchen display, assigned to ${esc(waiterFor(n))}.</p>
   <input id="wq" placeholder="Search dish…" value="${esc(q)}" style="margin:12px 0" oninput="drawWaiterOrder(${n},this.value);setTimeout(()=>{const e=$('#wq');e.focus();e.setSelectionRange(e.value.length,e.value.length)},0)">
   <div style="max-height:280px;overflow:auto">${list.map(it=>`<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span class="small">${esc(it.name)} ${it.soldOut?`<span class="sold">sold out</span>`:""}<span class="dim"> · ${rs(it.variants.length?it.variants[0].p:it.price)}${it.variants.length?" ("+esc(it.variants[0].n)+")":""}</span></span><button class="btn btn-dark btn-xs" ${it.soldOut?"disabled":""} onclick="wAdd('${it.id}',${n})">Add</button></div>`).join("")}</div>
   <div style="margin-top:14px">${wCart.length?wCart.map((c,i)=>`<div class="row between small" style="padding:4px 0"><span>${c.qty} × ${esc(c.name)} ${c.variant?`(${esc(c.variant)})`:""}</span><span>${rs(c.total)} <button onclick="wCart.splice(${i},1);drawWaiterOrder(${n},$('#wq').value)" class="dim">✕</button></span></div>`).join(""):`<p class="small dim">Nothing added yet.</p>`}</div>
   <input id="wNote" placeholder="Note for the kitchen (e.g. allergy, rush)" style="margin-top:10px">
   <div class="row" style="margin-top:14px"><button class="btn btn-gold" ${wCart.length?"":"disabled"} onclick="wSend(${n})">Send to kitchen · ${rs(wCart.reduce((a,c)=>a+c.total,0))}</button><button class="btn btn-line" onclick="tableModal(${n})">Back</button></div>`,true);
}
function wAdd(id,n){const it=item(id),v=it.variants[0],unit=v?v.p:it.price,ex=wCart.find(c=>c.id===id);if(ex){ex.qty++;ex.total=ex.unit*ex.qty}else wCart.push({id,name:it.name,qty:1,variant:v?v.n:"",choices:it.choices.map(c=>c.o[0]),extras:[],note:"",unit,total:unit});drawWaiterOrder(n,$("#wq").value)}
function wSend(n){const note=($("#wNote")||{}).value||"";const w=waiterFilter!=="all"?waiterFilter:waiterFor(n);const o=placeOrder(n,wCart,"waiter",null,w);if(note.trim())sendK(w,"kitchen",o.no,note.trim());wCart=[];closeModal();render(true);toast(`#${o.no} sent to the kitchen`)}

/* ===================== ADMIN ===================== */
const ADMIN_TABS=[["dashboard","📊 Dashboard"],["orders","🧾 Live orders"],["menu","🍽 Menu & prices"],["tables","🔳 Tables & QR"],["wifi","📶 Guest Wi-Fi"],["guests","👥 Guests"],["push","🔔 Push campaigns"],["waiters","🧑‍💼 Waiters & tables"],["reservations","📅 Reservations"],["messages","✉️ Messages"],["feedback","⭐ Feedback"],["staff","🔐 Staff & settings"]];
let admCat="all",admQ="",admAud="all";
function renderAdmin(){
  $("#app").innerHTML=shellTop("admin")+`<div class="shell"><div class="adm"><div class="side">${ADMIN_TABS.map(([id,n])=>`<button class="${adminTab===id?"on":""}" onclick="adminTab='${id}';render(true)">${n}</button>`).join("")}</div><div id="admBody">${({dashboard:admDash,orders:admOrders,menu:admMenu,tables:admTables,wifi:admWifi,guests:admGuests,push:admPush,feedback:admFeedback,staff:admStaff,reservations:admRes,waiters:admWaiters,messages:admMsgs}[adminTab])()}</div></div></div>`;
  if(adminTab==="tables")TABLES.forEach(t=>drawQR("qr"+t.n,t.n,96));
}
const today=o=>now()-o.created<DAY;
function admDash(){
  const os=S.orders.filter(today),sales=os.reduce((a,o)=>a+o.total,0),fbs=S.feedback,avg=k=>fbs.length?(fbs.reduce((a,f)=>a+f[k],0)/fbs.length).toFixed(1):"–";
  const cnt={};os.forEach(o=>o.lines.forEach(l=>cnt[l.name]=(cnt[l.name]||0)+l.qty));const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,7),mx=top.length?top[0][1]:1;
  const hrs={};for(let h=0;h<12;h++)hrs[h]=0;os.forEach(o=>{const d=Math.floor((now()-o.created)/HR);if(d<12)hrs[11-d]+=o.total});const hm=Math.max(1,...Object.values(hrs));
  return `<div class="row between" style="margin-bottom:16px"><div><div class="eyebrow">Admin panel</div><h2 style="font-size:40px">Today at Zaitoon</h2></div><span class="chip ol">● Updating live</span></div>
  <div class="kpis"><div class="card kpi"><b>${rs(sales)}</b><span>Sales today</span></div><div class="card kpi"><b>${os.length}</b><span>Orders today</span></div><div class="card kpi"><b>${rs(os.length?sales/os.length:0)}</b><span>Average ticket</span></div><div class="card kpi"><b>${Object.keys(S.visits).length}/16</b><span>Tables seated</span></div><div class="card kpi"><b>${avg("food")} ★</b><span>Food rating</span></div><div class="card kpi"><b>${S.orders.filter(o=>["received","preparing","ready"].includes(o.status)).length}</b><span>In the kitchen now</span></div></div>
  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:18px"><div class="card" style="padding:22px"><h3 class="serif" style="font-size:26px">Top dishes today</h3>${top.map(([n,q])=>`<div class="bar"><span style="width:180px;flex:none" class="small">${esc(n)}</span><i style="width:${q/mx*55}%"></i><b>${q}</b></div>`).join("")||`<div class="empty">No orders yet</div>`}</div>
  <div class="card" style="padding:22px"><h3 class="serif" style="font-size:26px">Sales · last 12 hours</h3><div class="hbars">${Object.entries(hrs).map(([h,v])=>`<div style="height:${v/hm*100}%" title="${rs(v)}"><span>${h==11?"now":"-"+(11-h)+"h"}</span></div>`).join("")}</div><div style="height:20px"></div></div></div>
  <div class="card" style="padding:22px;margin-top:18px"><h3 class="serif" style="font-size:26px;margin-bottom:8px">Latest orders</h3>${ordersTable(S.orders.slice().reverse().slice(0,8))}</div>`;
}
function ordersTable(os){return `<div class="tscroll"><table class="t"><tr><th>#</th><th>Table</th><th>Guest</th><th>Items</th><th>Source</th><th>Status</th><th>Total</th><th>Time</th></tr>${os.map(o=>`<tr><td><b>${o.no}</b></td><td>${o.table||"🥡"} <span class="tiny dim">${o.zone}</span></td><td>${esc(o.guestName)}</td><td class="small">${o.lines.map(l=>l.qty+"× "+esc(l.name)).join(", ")}</td><td><span class="tag ${o.source==="waiter"?"st-picked_up":"st-received"}">${srcName(o)}</span></td><td><span class="tag st-${o.status}">${stageName(o.status)}</span></td><td>${rs(o.total)}</td><td class="small dim">${clock(o.created)}</td></tr>`).join("")}</table></div>`}
function admOrders(){return `<div class="eyebrow">Live orders</div><h2 style="font-size:40px;margin-bottom:16px">Every order, every stage</h2><div class="card" style="padding:16px">${ordersTable(S.orders.slice().reverse())}</div>`}
function admMenu(){
  const list=MENU.filter(m=>(admCat==="all"||m.cat===admCat)&&(!admQ||m.name.toLowerCase().includes(admQ.toLowerCase()))).map(m=>item(m.id));
  return `<div class="eyebrow">Menu & prices</div><h2 style="font-size:40px">${MENU.length} dishes · ${CATS.length} categories</h2><p class="small muted" style="margin:6px 0 16px">Change a price or mark a dish sold out — open the guest view and it updates instantly.</p>
  <div class="row" style="margin-bottom:14px"><select style="max-width:240px" onchange="admCat=this.value;render(true)"><option value="all">All categories</option>${CATS.map(c=>`<option value="${c[0]}" ${admCat===c[0]?"selected":""}>${esc(c[1])}</option>`).join("")}</select><input style="max-width:260px" placeholder="Search…" value="${esc(admQ)}" onchange="admQ=this.value;render(true)"></div>
  <div class="card" style="padding:8px 16px"><div class="tscroll"><table class="t"><tr><th></th><th>Dish</th><th>Category</th><th>Price (Rs)</th><th>Available</th></tr>${list.map(it=>`<tr><td style="width:56px">${it.img?`<img src="${it.img}" style="width:44px;height:44px;border-radius:10px;object-fit:cover">`:""}</td><td><b>${esc(it.name)}</b>${it.variants.length?`<div class="tiny dim">${it.variants.map(v=>esc(v.n)+" "+rs(v.p)).join(" · ")}</div>`:""}</td><td class="small muted">${esc(CATS.find(c=>c[0]===it.cat)[1])}</td><td>${it.variants.length?`<span class="small dim">by size</span>`:`<input type="number" value="${it.price}" style="width:110px;padding:7px 10px" onchange="setOver('${it.id}','price',+this.value)">`}</td><td><button class="toggle ${it.soldOut?"":"on"}" onclick="setOver('${it.id}','soldOut',${!it.soldOut})" aria-label="Toggle availability"></button></td></tr>`).join("")}</table></div></div>`;
}
function setOver(id,k,v){S.over[id]=S.over[id]||{};S.over[id][k]=v;save();toast(k==="soldOut"?(v?"Marked sold out":"Back on the menu"):"Price updated");render(true)}
function admTables(){return `<div class="eyebrow">Tables & QR codes</div><h2 style="font-size:40px;margin-bottom:6px">16 tables · 2 zones</h2><p class="small muted" style="margin-bottom:16px">Each table has its own code. Print the QR on the table stand and write the same link to the NFC tag.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${TABLES.map(t=>{const[s,l]=tableState(t.n);return `<div class="card" style="padding:16px;text-align:center"><div class="row between"><b class="serif" style="font-size:26px">T${t.n}</b><span class="tiny dim">${t.zone}</span></div><div id="qr${t.n}" style="margin:10px 0"></div><div class="tiny muted">${l}</div><div class="row" style="justify-content:center;margin-top:10px;gap:6px"><a class="btn btn-dark btn-xs" href="#table-${t.n}">Open</a><button class="btn btn-dark btn-xs" onclick="copyGuestLink(${t.n})">Copy link</button></div></div>`}).join("")}</div>`}
function admWifi(){const w=S.settings.wifi;return `<div class="eyebrow">Guest Wi-Fi</div><h2 style="font-size:40px;margin-bottom:16px">Shown on every table</h2><div class="card" style="padding:24px;max-width:520px"><label class="lbl">Network name</label><input id="wS" value="${esc(w.ssid)}"><label class="lbl" style="margin-top:14px">Password</label><input id="wP" value="${esc(w.password)}"><label class="row" style="margin-top:16px;gap:10px"><input type="checkbox" id="ordOn" ${S.settings.ordering?"checked":""}> Ordering from tables is on</label><button class="btn btn-gold" style="margin-top:18px" onclick="S.settings.wifi={ssid:$('#wS').value,password:$('#wP').value};S.settings.ordering=$('#ordOn').checked;save();toast('Saved — guests see it now');render(true)">Save</button></div>`}
function audience(a){const gs=Object.values(S.guests);return a==="recent"?gs.filter(g=>now()-g.last<7*DAY):a==="loyal"?gs.filter(g=>g.visits>=3):gs}
function admGuests(){const gs=audience(admAud).sort((a,b)=>b.spend-a.spend);const rating=g=>{const f=S.feedback.filter(x=>x.name===g.name);return f.length?(f.reduce((a,x)=>a+(x.food+x.service+x.ambience)/3,0)/f.length).toFixed(1)+" ★":"—"};
  return `<div class="eyebrow">Guest CRM</div><h2 style="font-size:40px;margin-bottom:12px">Know your regulars</h2><div class="tabs" style="width:max-content;margin-bottom:14px">${[["all","All"],["recent","Recent (7 days)"],["loyal","Loyal (3+ visits)"]].map(([k,n])=>`<button class="${admAud===k?"on":""}" onclick="admAud='${k}';render(true)">${n} · ${audience(k).length}</button>`).join("")}</div>
  <div class="card" style="padding:8px 16px"><div class="tscroll"><table class="t"><tr><th>Guest</th><th>Visits</th><th>Spend</th><th>Last visit</th><th>Rating</th><th>Offers</th></tr>${gs.map(g=>`<tr><td><b>${esc(g.name)}</b><div class="tiny dim">since ${new Date(g.first).toLocaleDateString()}</div></td><td>${g.visits}</td><td>${rs(g.spend)}</td><td class="small">${ago(g.last)}</td><td>${rating(g)}</td><td>${g.consent?'<span class="chip ol">Opted in</span>':'<span class="chip gr">No</span>'}</td></tr>`).join("")}</table></div></div><p class="small dim" style="margin-top:10px">Visits and spend update when a waiter settles the table.</p>`}
function admPush(){const opted=Object.values(S.guests).filter(g=>g.consent);return `<div class="eyebrow">Push campaigns</div><h2 style="font-size:40px;margin-bottom:12px">Offers to opted-in guests</h2>
  <div class="grid" style="grid-template-columns:1fr 1fr"><div class="card" style="padding:22px"><label class="lbl">Title</label><input id="pT" value="Rooftop BBQ Night 🔥"><label class="lbl" style="margin-top:12px">Message</label><textarea id="pB" rows="3">This Friday: 15% off BBQ Mix Platters on the rooftop. Show this at your table.</textarea><label class="lbl" style="margin-top:12px">Audience</label><select id="pA"><option value="all">All opted-in (${opted.length})</option><option value="recent">Recent</option><option value="loyal">Loyal</option></select><button class="btn btn-gold" style="margin-top:16px" onclick="sendCampaign()">Send push</button><p class="tiny dim" style="margin-top:10px">Only guests who ticked “Send me offers” receive it. Open a guest view with offers on to see it arrive.</p></div>
  <div class="card" style="padding:22px"><h3 class="serif" style="font-size:24px;margin-bottom:10px">Sent</h3>${S.campaigns.length?S.campaigns.slice().reverse().map(c=>`<div class="alert"><div><b>${esc(c.title)}</b><div class="tiny dim">${esc(c.body)}</div></div><span class="tiny muted">${c.count} · ${ago(c.t)}</span></div>`).join(""):`<div class="empty">No campaigns yet</div>`}</div></div>`}
function sendCampaign(){const a=$("#pA").value,n=audience(a).filter(g=>g.consent).length;S.campaigns.push({id:uid(),title:$("#pT").value,body:$("#pB").value,aud:a,count:n,t:now()});save();toast(`Push sent to ${n} opted-in guests`);render(true)}
function admWaiters(){
  return `<div class="eyebrow">Waiters & tables</div><h2 style="font-size:40px;margin-bottom:6px">Who looks after which table</h2><p class="small muted" style="margin-bottom:16px">New orders go to the table's waiter. If they're on break, the least busy waiter on duty gets it automatically. The kitchen can reassign any ticket.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-bottom:18px">${S.waiters.map(w=>{const tables=TABLES.filter(t=>assigned(t.n)===w.name).map(t=>t.n);return `<div class="card" style="padding:18px"><div class="row between"><b class="serif" style="font-size:26px">${esc(w.name)}</b><button class="toggle ${w.status==="on"?"on":""}" onclick="toggleDuty('${esc(w.name)}')" aria-label="On duty"></button></div><div class="tiny ${w.status==="on"?"gold":"dim"}">${w.status==="on"?"On duty":"On break"}</div><div class="small muted" style="margin-top:10px">Tables: ${tables.join(", ")||"—"}</div><div class="small muted">Active orders: ${waiterLoad(w.name)}</div></div>`}).join("")}
  <div class="card" style="padding:18px"><label class="lbl">Add a waiter</label><input id="nwW" placeholder="Name"><button class="btn btn-gold btn-sm" style="margin-top:10px" onclick="const n=$('#nwW').value.trim();if(n&&!S.waiters.find(w=>w.name===n)){S.waiters.push({name:n,status:'on'});save();toast(n+' added');render(true)}">Add</button></div></div>
  <div class="card" style="padding:18px"><div class="row between" style="margin-bottom:12px"><h3 class="serif" style="font-size:24px">Table assignment</h3><button class="btn btn-line btn-sm" onclick="autoBalance()">Auto-balance tables</button></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${TABLES.map(t=>`<div style="padding:10px;border:1px solid var(--line);border-radius:12px"><div class="row between"><b>T${t.n}</b><span class="tiny dim">${t.zone==="Rooftop"?"Roof":"Hall"}</span></div><select style="margin-top:6px;padding:6px 8px" onchange="S.assign[${t.n}]=this.value;save();toast('Table ${t.n} → '+this.value);render(true)">${S.waiters.map(w=>`<option ${assigned(t.n)===w.name?"selected":""}>${esc(w.name)}</option>`).join("")}</select></div>`).join("")}</div></div>
  <div class="card" style="padding:18px;margin-top:18px"><h3 class="serif" style="font-size:24px;margin-bottom:10px">Kitchen ↔ waiter messages</h3>${msgList("all",[])}</div>`}
function autoBalance(){const d=onDuty();if(!d.length){toast("No waiters on duty");return}["Family Hall","Rooftop"].forEach(z=>{});TABLES.forEach((t,i)=>S.assign[t.n]=d[Math.floor(i/Math.ceil(TABLES.length/d.length))%d.length].name);save();toast("Tables shared evenly between "+d.map(w=>w.name).join(", "));render(true)}
function admRes(){const rs_=(S.reservations||[]).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  return `<div class="eyebrow">Reservations</div><h2 style="font-size:40px;margin-bottom:14px">Table bookings</h2><div class="kpis" style="margin-bottom:16px"><div class="card kpi"><b>${rs_.filter(r=>r.status==="pending").length}</b><span>Waiting for confirmation</span></div><div class="card kpi"><b>${rs_.filter(r=>r.status==="confirmed").length}</b><span>Confirmed</span></div><div class="card kpi"><b>${rs_.reduce((a,r)=>a+(r.status!=="cancelled"?r.guests:0),0)}</b><span>Guests expected</span></div></div>
  <div class="card" style="padding:8px 16px"><div class="tscroll"><table class="t"><tr><th>Ref</th><th>Guest</th><th>When</th><th>Party</th><th>Notes</th><th>Status</th><th></th></tr>${rs_.map(r=>`<tr><td><b>${r.ref}</b></td><td>${esc(r.name)}<div class="tiny dim">${esc(r.phone)}</div></td><td>${new Date(r.date+"T00:00").toLocaleDateString([], {day:"numeric",month:"short"})} · ${r.time}</td><td>${r.guests} · ${r.area}</td><td class="small muted">${esc(r.note||"—")}</td><td><span class="tag ${r.status==="pending"?"st-preparing":r.status==="cancelled"?"st-served":"st-ready"}">${r.status}</span></td><td style="white-space:nowrap">${r.status==="pending"?`<button class="btn btn-gold btn-xs" onclick="setRes('${r.id}','confirmed')">Confirm</button> <button class="btn btn-dark btn-xs" onclick="setRes('${r.id}','cancelled')">Decline</button>`:r.status==="confirmed"?`<button class="btn btn-dark btn-xs" onclick="seatRes('${r.id}')">Seat</button>`:""}</td></tr>`).join("")||`<tr><td colspan="7" class="empty">No reservations yet</td></tr>`}</table></div></div>`}
function setRes(id,st){const r=S.reservations.find(x=>x.id===id);r.status=st;save();toast(st==="confirmed"?"Reservation confirmed — guest sees it now":"Reservation declined");render(true)}
function seatRes(id){const r=S.reservations.find(x=>x.id===id);const free=TABLES.filter(t=>!S.visits[t.n]&&(r.area==="No preference"||t.zone===r.area));if(!free.length){toast("No free table in "+r.area);return}const t=free[0].n;ensureVisit(t,r.name);r.status="seated";r.table=t;save();toast(`${r.name} seated at Table ${t}`);render(true)}
function admMsgs(){const ms=(S.messages||[]).slice().reverse();ms.forEach(m=>m.read=true);save();return `<div class="eyebrow">Messages</div><h2 style="font-size:40px;margin-bottom:14px">From the website</h2>${ms.map(m=>`<div class="card" style="padding:16px;margin-bottom:10px"><div class="row between"><b>${esc(m.name)} <span class="tiny dim">· ${esc(m.contact||"")}</span></b><span class="tiny dim">${ago(m.t)}</span></div><span class="chip gr" style="margin:8px 0">${esc(m.subject)}</span><p class="muted small">${esc(m.text)}</p></div>`).join("")||`<div class="empty card">No messages yet</div>`}`}
function admFeedback(){const fbs=S.feedback.slice().reverse(),avg=k=>fbs.length?(fbs.reduce((a,f)=>a+f[k],0)/fbs.length).toFixed(1):"–";S.feedback.forEach(f=>f.seen=true);save();
  return `<div class="eyebrow">Feedback</div><h2 style="font-size:40px;margin-bottom:14px">What guests say</h2><div class="kpis" style="margin-bottom:16px"><div class="card kpi"><b>${avg("food")} ★</b><span>Food</span></div><div class="card kpi"><b>${avg("service")} ★</b><span>Service</span></div><div class="card kpi"><b>${avg("ambience")} ★</b><span>Ambience</span></div><div class="card kpi"><b>${fbs.length}</b><span>Reviews</span></div></div>
  ${fbs.map(f=>`<div class="card" style="padding:16px;margin-bottom:10px"><div class="row between"><b>${esc(f.name)} <span class="tiny dim">· Table ${f.table}</span></b><span class="tiny dim">${ago(f.t)}</span></div><div class="small" style="margin:6px 0">Food <span class="gold">${"★".repeat(f.food)}</span> · Service <span class="gold">${"★".repeat(f.service)}</span> · Ambience <span class="gold">${"★".repeat(f.ambience)}</span></div>${f.text?`<p class="muted small">“${esc(f.text)}”</p>`:""}</div>`).join("")}`}
function admStaff(){return `<div class="eyebrow">Staff & settings</div><h2 style="font-size:40px;margin-bottom:14px">Staff PINs</h2><div class="card" style="padding:8px 16px;max-width:620px"><table class="t"><tr><th>Name</th><th>Screen</th><th>PIN</th></tr>${STAFF.map(s=>`<tr><td><b>${s.name}</b></td><td class="small muted">${s.role}</td><td>•••• <button class="btn btn-dark btn-xs" onclick="toast('PIN: ${s.pin}')">Show</button></td></tr>`).join("")}</table></div>
  <div class="card" style="padding:22px;margin-top:18px;max-width:620px"><h3 class="serif" style="font-size:24px">Data</h3><p class="small muted" style="margin:6px 0 14px">Clear today's orders, reservations and messages and start fresh.</p><div class="row"><button class="btn btn-line" onclick="resetDemo()">Reset data</button><button class="btn btn-line" onclick="try{localStorage.removeItem(PKEY)}catch(e){};render(true)">Lock staff screens</button></div></div>`}
function resetDemo(){modal(`<h2 style="font-size:32px">Reset all data?</h2><p class="muted" style="margin:8px 0 18px">Orders, guests, reservations, feedback and menu changes go back to the starting data on every screen.</p><div class="row"><button class="btn btn-gold" onclick="S=seed();save();DEV.cart=[];DEV.welcomed='';DEV.seen={};DEV.fb=[];saveDev();closeModal();render(true);toast('Data reset')">Reset</button><button class="btn btn-line" onclick="closeModal()">Cancel</button></div>`)}

/* ===================== tick & boot ===================== */
window.onQR=()=>{if(route==='admin'&&adminTab==='tables')TABLES.forEach(t=>drawQR('qr'+t.n,t.n,96))};
setInterval(()=>{document.querySelectorAll(".timer[data-t]").forEach(e=>e.textContent=mmss(now()-+e.dataset.t));const c=$("#kClock");if(c)c.textContent=clock(now())},1000);
setInterval(()=>{if(["waiter","admin"].includes(route)&&!$("#modalRoot").innerHTML)render()},15000);

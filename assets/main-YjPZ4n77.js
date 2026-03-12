import{s as h}from"./stones-CzU1rKxK.js";const C="8149591957:AAHXf76-EEPoqWB6tIfW8B7xjmE3o9fKvB8",I="1093264285";let i="ru";function X(e){i=e,document.querySelectorAll("[data-ru][data-uz]").forEach(n=>{const r=n.getAttribute(`data-${e}`);if(r){if(n.children.length===0)n.textContent=r;else if(n.tagName==="A"||n.tagName==="BUTTON"){const l=n.querySelector("span[data-ru]");if(l)l.textContent=l.getAttribute(`data-${e}`);else for(const c of n.childNodes)if(c.nodeType===Node.TEXT_NODE&&c.textContent.trim()){c.textContent=r;break}}}});const o=e==="ru"?"UZ":"RU",t=document.getElementById("langToggle"),s=document.getElementById("langToggleMobile");t&&(t.textContent=o),s&&(s.textContent=o),document.getElementById("stoneGrid")&&z()}const a=e=>document.querySelector(e),L=e=>document.querySelectorAll(e);window.addEventListener("load",()=>{setTimeout(()=>{a("#preloader").classList.add("hidden"),document.body.style.overflow="",F(),K()},1500)});const u=a("#cursor");let E=!1;if(window.innerWidth>768){document.addEventListener("mousemove",o=>{E||(u.style.opacity="1",E=!0),u.style.left=o.clientX+"px",u.style.top=o.clientY+"px"}),document.addEventListener("mouseleave",()=>{u.style.opacity="0",E=!1});const e="a, button, .stone-card, .filter-btn, .form-input, .search-input";document.addEventListener("mouseover",o=>{o.target.closest(e)&&u.classList.add("hover")}),document.addEventListener("mouseout",o=>{o.target.closest(e)&&u.classList.remove("hover")})}else u.style.display="none";const q=a("#navbar");window.addEventListener("scroll",()=>{const e=window.scrollY;e>80?q.classList.add("scrolled"):q.classList.remove("scrolled");const o=a("#backToTop");e>500?o.classList.add("visible"):o.classList.remove("visible")});a("#backToTop").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const M=a("#hamburger"),S=a("#mobileMenu");M.addEventListener("click",()=>{M.classList.toggle("active"),S.classList.toggle("active"),document.body.style.overflow=S.classList.contains("active")?"hidden":""});L(".mobile-nav-link").forEach(e=>{e.addEventListener("click",()=>{M.classList.remove("active"),S.classList.remove("active"),document.body.style.overflow=""})});function _(){const e=a("#particles"),o=window.innerWidth>768?30:15;for(let t=0;t<o;t++){const s=document.createElement("div");s.classList.add("particle"),s.style.left=Math.random()*100+"%",s.style.setProperty("--duration",8+Math.random()*15+"s"),s.style.animationDelay=Math.random()*10+"s",s.style.width=2+Math.random()*3+"px",s.style.height=s.style.width,e.appendChild(s)}}_();function F(){const e=L(".reveal, .reveal-left, .reveal-right, .reveal-scale"),o=new IntersectionObserver(t=>{t.forEach(s=>{if(s.isIntersecting){const n=s.target.style.transitionDelay||"0s";setTimeout(()=>{s.target.classList.add("active")},parseFloat(n)*1e3)}})},{threshold:.15,rootMargin:"0px 0px -50px 0px"});e.forEach(t=>o.observe(t))}function K(){const e=L(".stat-number[data-count]"),o=new IntersectionObserver(t=>{t.forEach(s=>{if(s.isIntersecting){let f=function(d){const m=d-c,v=Math.min(m/l,1),k=1-Math.pow(1-v,3),P=n.dataset.suffix||"+";n.textContent=Math.floor(r*k)+P,v<1&&requestAnimationFrame(f)};const n=s.target,r=parseInt(n.dataset.count),l=2e3,c=performance.now();requestAnimationFrame(f),o.unobserve(n)}})},{threshold:.5});e.forEach(t=>o.observe(t))}L('a[href^="#"]').forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();const t=document.querySelector(e.getAttribute("href"));if(t){const n=t.getBoundingClientRect().top+window.scrollY-80;window.scrollTo({top:n,behavior:"smooth"})}})});const p=a("#stoneGrid"),R=!window.location.pathname.includes("catalog");function G(e,o){const t=document.createElement("div");t.className="stone-card reveal",t.style.transitionDelay=`${o*.1}s`,t.dataset.type=e.type,t.dataset.id=e.id;const s=i==="ru"?"Подробнее":"Batafsil ko'rish",n=i==="ru"?"Подробнее":"Batafsil",r=i==="ru"?"коллекция":"kolleksiya";return t.innerHTML=`
    <div class="relative overflow-hidden">
      <img src="${e.thumbnail}" alt="${e.name}" class="stone-card-image" loading="lazy" />
      <div class="stone-card-badge">${e.category}</div>
      <div class="stone-card-overlay">
        <button class="btn-outline text-xs py-2 px-4 view-details-btn" data-id="${e.id}">
          ${s}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
    <div class="stone-card-info">
      <div class="stone-card-type">${e.category} ${r}</div>
      <h3 class="stone-card-name">${e.name}</h3>
      <p class="stone-card-desc">${e.description}</p>
      <button class="stone-card-btn view-details-btn" data-id="${e.id}">
        ${n}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  `,t.addEventListener("click",l=>{l.target.closest(".view-details-btn")||H(e)}),t.querySelectorAll(".view-details-btn").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation(),H(e)})}),t}function z(){if(!p)return;p.innerHTML="",(R?h.slice(0,9):h).forEach((t,s)=>{p.appendChild(G(t,s))});const o=new IntersectionObserver(t=>{t.forEach(s=>{s.isIntersecting&&s.target.classList.add("active")})},{threshold:.1});p.querySelectorAll(".reveal").forEach(t=>o.observe(t))}z();const A=document.getElementById("langToggle"),D=document.getElementById("langToggleMobile");function j(){X(i==="ru"?"uz":"ru")}A&&A.addEventListener("click",j);D&&D.addEventListener("click",j);const y=a("#stoneModal"),b=a("#modalBody");function H(e){const o=i==="ru"?"Заказать":"Buyurtma berish",t=i==="ru"?"Характеристики":"Xususiyatlari",s=i==="ru"?"Применение":"Qo'llanilishi",n=i==="ru"?"Размер":"O'lcham",r=i==="ru"?"Толщина":"Qalinlik",l=i==="ru"?"Обработка":"Ishlov turi",c=i==="ru"?"Происхождение":"Kelib chiqishi",f=e.type==="akril"?i==="ru"?"Акрил":"Akril":i==="ru"?"Кварц":"Kvarts";b.innerHTML=`
    <div class="modal-image-container">
      <img src="${e.images[0]}" alt="${e.name}" class="modal-image" id="modalMainImage" />
      ${e.images.length>1?`
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          ${e.images.map((d,m)=>`
            <img src="${d}" alt="" class="gallery-thumb ${m===0?"active":""}" data-index="${m}" />
          `).join("")}
        </div>
      `:""}
    </div>
    
    <div class="modal-body">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(200,164,92,0.1)] text-[#c8a45c] border border-[rgba(200,164,92,0.2)]">
          ${f}
        </span>
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(255,255,255,0.05)] text-[#8a8578]">
          ${e.category}
        </span>
      </div>

      <h2 class="font-heading text-3xl md:text-4xl font-bold text-white mb-4">${e.name}</h2>
      <p class="text-[#a8a8a8] leading-relaxed mb-8">${e.description}</p>

      <div class="grid sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${t}
          </h4>
          <div class="flex flex-wrap gap-2">
            ${e.features.map(d=>`
              <span class="modal-feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                ${d}
              </span>
            `).join("")}
          </div>
        </div>
        
        <div>
          <h4 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            ${s}
          </h4>
          <div class="flex flex-wrap gap-2">
            ${e.applications.map(d=>`
              <span class="inline-block px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] text-[#a8a8a8] border border-white/5">${d}</span>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 py-6 border-y border-white/5">
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${n}</div>
          <div class="text-white text-sm font-medium">${e.size||"—"}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${r}</div>
          <div class="text-white text-sm font-medium">${e.thickness.join(", ")}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${l}</div>
          <div class="text-white text-sm font-medium">${e.finish.join(", ")}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${c}</div>
          <div class="text-white text-sm font-medium">${e.origin}</div>
        </div>
      </div>

      <button class="btn-primary w-full sm:w-auto justify-center order-stone-btn" data-id="${e.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        ${o}
      </button>
    </div>
  `,b.querySelectorAll(".gallery-thumb").forEach(d=>{d.addEventListener("click",()=>{const m=parseInt(d.dataset.index),v=a("#modalMainImage");v.style.opacity="0",setTimeout(()=>{v.src=e.images[m],v.style.opacity="1"},200),b.querySelectorAll(".gallery-thumb").forEach(k=>k.classList.remove("active")),d.classList.add("active")})}),b.querySelector(".order-stone-btn").addEventListener("click",()=>{T(),setTimeout(()=>W(e),300)}),y.classList.add("active"),document.body.style.overflow="hidden"}function T(){y.classList.remove("active"),document.body.style.overflow=""}a("#modalClose").addEventListener("click",T);y.addEventListener("click",e=>{e.target===y&&T()});const w=a("#orderModal");let g=null;function U(){const e=a("#orderStoneType");if(!e)return;const o=[...new Set(h.map(s=>s.type))],t={akril:{ru:"Акриловый камень",uz:"Akril tosh"},kvars:{ru:"Кварцевый камень",uz:"Kvarts tosh"}};e.innerHTML=`<option value="">${i==="ru"?"Выберите тип...":"Turni tanlang..."}</option>`,o.forEach(s=>{const n=t[s]?t[s][i]:s;e.innerHTML+=`<option value="${s}">${n}</option>`})}function B(e){const o=a("#orderDecor");if(!o)return;if(!e){o.innerHTML=`<option value="">${i==="ru"?"Сначала выберите тип...":"Avval turni tanlang..."}</option>`;return}const t=h.filter(s=>s.type===e);o.innerHTML=`<option value="">${i==="ru"?"Выберите декор...":"Dekorni tanlang..."}</option>`,t.forEach(s=>{o.innerHTML+=`<option value="${s.id}">${s.name} (${s.category})</option>`})}const O=a("#orderStoneType");O&&O.addEventListener("change",e=>{B(e.target.value)});const N=a("#orderDecor");N&&N.addEventListener("change",e=>{const o=e.target.value;if(o&&(g=h.find(t=>t.id===o)||null,g)){a("#orderStoneId").value=g.id;const t=i==="ru"?"Выбранный камень":"Tanlangan tosh";a("#orderStoneName").textContent=`${t}: ${g.name}`}});function W(e){g=e,U();const o=i==="ru"?"Выбранный камень":"Tanlangan tosh";if(a("#orderStoneName").textContent=`${o}: ${e?e.name:"—"}`,a("#orderStoneId").value=e?e.id:"",e){const t=a("#orderStoneType");if(t){t.value=e.type,B(e.type);const s=a("#orderDecor");s&&(s.value=e.id)}}else B("");w.classList.add("active"),document.body.style.overflow="hidden"}function $(){w.classList.remove("active"),document.body.style.overflow="",g=null}a("#orderModalClose").addEventListener("click",$);w.addEventListener("click",e=>{e.target===w&&$()});async function Y(e){const{name:o,phone:t,message:s,stone:n}=e;let r=`🏗 *YANGI BUYURTMA!*

`;r+=`👤 *Ism:* ${o}
`,r+=`📱 *Telefon:* ${t}
`,n&&(r+=`
🪨 *Tanlangan tosh:*
`,r+=`   • Nomi: ${n.name}
`,r+=`   • Turi: ${n.type}
`,r+=`   • Kategoriya: ${n.category}
`,r+=`   • Kelib chiqishi: ${n.origin}
`),s&&(r+=`
💬 *Xabar:* ${s}
`),r+=`
📅 *Sana:* ${new Date().toLocaleString("uz-UZ")}`;try{return await fetch(`https://api.telegram.org/bot${C}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:I,text:r,parse_mode:"Markdown"})}),n&&n.thumbnail&&await fetch(`https://api.telegram.org/bot${C}/sendPhoto`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:I,photo:n.thumbnail,caption:`🪨 ${n.name} (${n.category})`})}),!0}catch(l){return console.error("Telegram xatosi:",l),!1}}a("#orderForm").addEventListener("submit",async e=>{e.preventDefault();const o=new FormData(e.target),t={name:o.get("name"),phone:o.get("phone"),message:o.get("message"),stone:g},s=e.target.querySelector('button[type="submit"]'),n=s.innerHTML;s.innerHTML=`
    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    Yuborilmoqda...
  `,s.disabled=!0,await Y(t)?(x(i==="ru"?"Ваш заказ принят! Мы скоро свяжемся.":"Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz.","success"),e.target.reset(),$()):x(i==="ru"?"Ошибка. Попробуйте ещё раз.":"Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.","error"),s.innerHTML=n,s.disabled=!1});a("#contactForm").addEventListener("submit",async e=>{e.preventDefault();const o=new FormData(e.target),t={name:o.get("name"),phone:o.get("phone"),message:o.get("message"),stone:null},s=o.get("stoneType");s&&(t.message=`[Tosh turi: ${s}] ${t.message||""}`);const n=e.target.querySelector('button[type="submit"]'),r=n.innerHTML;n.innerHTML=`
    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    Yuborilmoqda...
  `,n.disabled=!0,await Y(t)?(x(i==="ru"?"Сообщение отправлено! Спасибо!":"Xabaringiz yuborildi! Rahmat!","success"),e.target.reset()):x(i==="ru"?"Ошибка. Попробуйте ещё раз.":"Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.","error"),n.innerHTML=r,n.disabled=!1});function x(e,o="success"){const t=a("#toast"),s=a("#toastMessage");s.textContent=e,t.className="toast",t.classList.add(`toast-${o}`);const n=t.querySelector("svg");o==="success"?n.setAttribute("stroke","#22c55e"):n.setAttribute("stroke","#ef4444"),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>{t.classList.remove("show")},4e3)}document.addEventListener("keydown",e=>{e.key==="Escape"&&(T(),$())});p.style.transition="opacity 0.3s ease, transform 0.3s ease";window.innerWidth>768&&window.addEventListener("scroll",()=>{const e=window.scrollY,o=document.querySelector(".hero-bg");o&&e<window.innerHeight&&(o.style.transform=`scale(1.1) translateY(${e*.3}px)`)});

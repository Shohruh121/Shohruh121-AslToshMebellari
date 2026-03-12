import{s as m}from"./stones-CzU1rKxK.js";const M="8149591957:AAHXf76-EEPoqWB6tIfW8B7xjmE3o9fKvB8",C="1093264285";let n="ru";function _(e){n=e,document.querySelectorAll("[data-ru][data-uz]").forEach(r=>{const c=r.getAttribute(`data-${e}`);if(c){if(r.children.length===0)r.textContent=c;else if(r.tagName==="A"||r.tagName==="BUTTON"){const d=r.querySelector("span[data-ru]");if(d)d.textContent=d.getAttribute(`data-${e}`);else for(const l of r.childNodes)if(l.nodeType===Node.TEXT_NODE&&l.textContent.trim()){l.textContent=c;break}}}});const i=e==="ru"?"UZ":"RU",t=document.getElementById("langToggle"),a=document.getElementById("langToggleMobile");t&&(t.textContent=i),a&&(a.textContent=i);const s=document.getElementById("searchInput");s&&(s.placeholder=e==="ru"?"Поиск по названию...":"Tosh nomini qidiring..."),x()}const o=e=>document.querySelector(e),$=e=>document.querySelectorAll(e),k=o("#hamburger"),E=o("#mobileMenu");k.addEventListener("click",()=>{k.classList.toggle("active"),E.classList.toggle("active"),document.body.style.overflow=E.classList.contains("active")?"hidden":""});$(".mobile-nav-link").forEach(e=>{e.addEventListener("click",()=>{k.classList.remove("active"),E.classList.remove("active"),document.body.style.overflow=""})});window.addEventListener("scroll",()=>{const e=o("#backToTop");window.scrollY>500?e.classList.add("visible"):e.classList.remove("visible")});o("#backToTop").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const u=o("#stoneGrid"),B=o("#noResults"),K=o("#resultsCount");let f="all",v="";function R(e,i){const t=document.createElement("div");t.className="stone-card reveal active",t.dataset.type=e.type,t.dataset.id=e.id;const a=n==="ru"?"Подробнее":"Batafsil ko'rish",s=n==="ru"?"Подробнее":"Batafsil",r=n==="ru"?"коллекция":"kolleksiya";return t.innerHTML=`
    <div class="relative overflow-hidden">
      <img src="${e.thumbnail}" alt="${e.name}" class="stone-card-image" loading="lazy" />
      <div class="stone-card-badge">${e.category}</div>
      <div class="stone-card-overlay">
        <button class="btn-outline text-xs py-2 px-4 view-details-btn" data-id="${e.id}">
          ${a}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
    <div class="stone-card-info">
      <div class="stone-card-type">${e.category} ${r}</div>
      <h3 class="stone-card-name">${e.name}</h3>
      <p class="stone-card-desc">${e.description}</p>
      <button class="stone-card-btn view-details-btn" data-id="${e.id}">
        ${s}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  `,t.addEventListener("click",c=>{c.target.closest(".view-details-btn")||N(e)}),t.querySelectorAll(".view-details-btn").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),N(e)})}),t}function x(){u.innerHTML="";const e=m.filter(t=>{const a=f==="all"||t.category===f||t.type===f,s=t.name.toLowerCase().includes(v.toLowerCase())||t.description.toLowerCase().includes(v.toLowerCase())||t.type.toLowerCase().includes(v.toLowerCase())||t.category.toLowerCase().includes(v.toLowerCase());return a&&s}),i=n==="ru"?`Показано ${e.length} из ${m.length} декоров`:`${e.length} / ${m.length} ta dekor ko'rsatilmoqda`;if(K.textContent=i,e.length===0){B.classList.remove("hidden");return}B.classList.add("hidden"),e.forEach((t,a)=>{u.appendChild(R(t))})}x();$(".filter-btn").forEach(e=>{e.addEventListener("click",()=>{$(".filter-btn").forEach(i=>i.classList.remove("active")),e.classList.add("active"),f=e.dataset.filter,u.style.opacity="0",u.style.transform="translateY(20px)",setTimeout(()=>{x(),u.style.opacity="1",u.style.transform="translateY(0)"},300)})});let I;o("#searchInput").addEventListener("input",e=>{clearTimeout(I),I=setTimeout(()=>{v=e.target.value,x()},300)});const A=document.getElementById("langToggle"),q=document.getElementById("langToggleMobile");function D(){_(n==="ru"?"uz":"ru")}A&&A.addEventListener("click",D);q&&q.addEventListener("click",D);const y=o("#stoneModal"),h=o("#modalBody");function N(e){const i=n==="ru"?"Заказать":"Buyurtma berish",t=n==="ru"?"Характеристики":"Xususiyatlari",a=n==="ru"?"Применение":"Qo'llanilishi",s=n==="ru"?"Размер":"O'lcham",r=n==="ru"?"Толщина":"Qalinlik",c=n==="ru"?"Обработка":"Ishlov turi",d=n==="ru"?"Происхождение":"Kelib chiqishi";h.innerHTML=`
    <div class="modal-image-container">
      <img src="${e.images[0]}" alt="${e.name}" class="modal-image" id="modalMainImage" />
      ${e.images.length>1?`
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          ${e.images.map((l,p)=>`
            <img src="${l}" alt="" class="gallery-thumb ${p===0?"active":""}" data-index="${p}" />
          `).join("")}
        </div>
      `:""}
    </div>
    
    <div class="modal-body">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(200,164,92,0.1)] text-[#c8a45c] border border-[rgba(200,164,92,0.2)]">
          ${e.type==="akril"?n==="ru"?"Акрил":"Akril":n==="ru"?"Кварц":"Kvarts"}
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
            ${e.features.map(l=>`
              <span class="modal-feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                ${l}
              </span>
            `).join("")}
          </div>
        </div>
        
        <div>
          <h4 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            ${a}
          </h4>
          <div class="flex flex-wrap gap-2">
            ${e.applications.map(l=>`
              <span class="inline-block px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] text-[#a8a8a8] border border-white/5">${l}</span>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 py-6 border-y border-white/5">
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${s}</div>
          <div class="text-white text-sm font-medium">${e.size||"—"}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${r}</div>
          <div class="text-white text-sm font-medium">${e.thickness.join(", ")}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${c}</div>
          <div class="text-white text-sm font-medium">${e.finish.join(", ")}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${d}</div>
          <div class="text-white text-sm font-medium">${e.origin}</div>
        </div>
      </div>

      <button class="btn-primary w-full sm:w-auto justify-center order-stone-btn" data-id="${e.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        ${i}
      </button>
    </div>
  `,h.querySelectorAll(".gallery-thumb").forEach(l=>{l.addEventListener("click",()=>{const p=parseInt(l.dataset.index),L=o("#modalMainImage");L.style.opacity="0",setTimeout(()=>{L.src=e.images[p],L.style.opacity="1"},200),h.querySelectorAll(".gallery-thumb").forEach(j=>j.classList.remove("active")),l.classList.add("active")})}),h.querySelector(".order-stone-btn").addEventListener("click",()=>{w(),setTimeout(()=>Y(e),300)}),y.classList.add("active"),document.body.style.overflow="hidden"}function w(){y.classList.remove("active"),document.body.style.overflow=""}o("#modalClose").addEventListener("click",w);y.addEventListener("click",e=>{e.target===y&&w()});const b=o("#orderModal");let g=null;function U(){const e=o("#orderStoneType");if(!e)return;const i=[...new Set(m.map(a=>a.type))],t={akril:{ru:"Акриловый камень",uz:"Akril tosh"},kvars:{ru:"Кварцевый камень",uz:"Kvarts tosh"}};e.innerHTML=`<option value="">${n==="ru"?"Выберите тип...":"Turni tanlang..."}</option>`,i.forEach(a=>{const s=t[a]?t[a][n]:a;e.innerHTML+=`<option value="${a}">${s}</option>`})}function S(e){const i=o("#orderDecor");if(!i)return;if(!e){i.innerHTML=`<option value="">${n==="ru"?"Сначала выберите тип...":"Avval turni tanlang..."}</option>`;return}const t=m.filter(a=>a.type===e);i.innerHTML=`<option value="">${n==="ru"?"Выберите декор...":"Dekorni tanlang..."}</option>`,t.forEach(a=>{i.innerHTML+=`<option value="${a.id}">${a.name} (${a.category})</option>`})}const H=o("#orderStoneType");H&&H.addEventListener("change",e=>{S(e.target.value)});const O=o("#orderDecor");O&&O.addEventListener("change",e=>{const i=e.target.value;if(i&&(g=m.find(t=>t.id===i)||null,g)){o("#orderStoneId").value=g.id;const t=n==="ru"?"Выбранный камень":"Tanlangan tosh";o("#orderStoneName").textContent=`${t}: ${g.name}`}});function Y(e){g=e,U();const i=n==="ru"?"Выбранный камень":"Tanlangan tosh";if(o("#orderStoneName").textContent=`${i}: ${e?e.name:"—"}`,o("#orderStoneId").value=e?e.id:"",e){const t=o("#orderStoneType");if(t){t.value=e.type,S(e.type);const a=o("#orderDecor");a&&(a.value=e.id)}}else S("");b.classList.add("active"),document.body.style.overflow="hidden"}function T(){b.classList.remove("active"),document.body.style.overflow="",g=null}o("#orderModalClose").addEventListener("click",T);b.addEventListener("click",e=>{e.target===b&&T()});async function G(e){const{name:i,phone:t,message:a,stone:s}=e;let r=`🏗 *YANGI BUYURTMA!*

`;r+=`👤 *Ism:* ${i}
`,r+=`📱 *Telefon:* ${t}
`,s&&(r+=`
🪨 *Tanlangan tosh:*
`,r+=`   • Nomi: ${s.name}
`,r+=`   • Turi: ${s.type}
`,r+=`   • Kategoriya: ${s.category}
`),a&&(r+=`
💬 *Xabar:* ${a}
`),r+=`
📅 *Sana:* ${new Date().toLocaleString("uz-UZ")}`;try{return await fetch(`https://api.telegram.org/bot${M}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:C,text:r,parse_mode:"Markdown"})}),s&&s.thumbnail&&await fetch(`https://api.telegram.org/bot${M}/sendPhoto`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:C,photo:s.thumbnail,caption:`🪨 ${s.name} (${s.category})`})}),!0}catch(c){return console.error("Telegram error:",c),!1}}o("#orderForm").addEventListener("submit",async e=>{e.preventDefault();const i=new FormData(e.target),t={name:i.get("name"),phone:i.get("phone"),message:i.get("message"),stone:g},a=e.target.querySelector('button[type="submit"]'),s=a.innerHTML,r=n==="ru"?"Отправка...":"Yuborilmoqda...";a.innerHTML=`
    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    ${r}
  `,a.disabled=!0,await G(t)?(z(n==="ru"?"Ваш заказ принят! Мы скоро свяжемся.":"Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz.","success"),e.target.reset(),T()):z(n==="ru"?"Ошибка. Попробуйте ещё раз.":"Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.","error"),a.innerHTML=s,a.disabled=!1});function z(e,i="success"){const t=o("#toast"),a=o("#toastMessage");a.textContent=e,t.className="toast",t.classList.add(`toast-${i}`);const s=t.querySelector("svg");i==="success"?s.setAttribute("stroke","#22c55e"):s.setAttribute("stroke","#ef4444"),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>{t.classList.remove("show")},4e3)}document.addEventListener("keydown",e=>{e.key==="Escape"&&(w(),T())});u.style.transition="opacity 0.3s ease, transform 0.3s ease";

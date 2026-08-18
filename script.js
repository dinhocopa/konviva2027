(function(){
  "use strict";

  /* ---------- Router ----------
     Não depende de location.hash: iframes com sandbox podem bloquear
     a mudança de hash. O hash é apenas espelhado quando permitido. */
  var routes = document.querySelectorAll("[data-route]");
  function navigate(name){
    var found = false;
    Array.prototype.forEach.call(routes, function(r){
      var on = r.dataset.route === name;
      r.dataset.active = on ? "true" : "false";
      if(on) found = true;
    });
    if(!found) routes[0].dataset.active = "true";
    try{ if(location.hash !== "#/" + name) location.hash = "#/" + name; }catch(err){}
    window.scrollTo(0,0);
  }
  window.addEventListener("hashchange", function(){
    navigate((location.hash || "#/login").replace("#/",""));
  });
  navigate((location.hash || "#/login").replace("#/",""));

  document.addEventListener("click", function(e){
    var link = e.target.closest('a[href^="#/"]');
    if(!link || link.hasAttribute("data-stub")) return;
    e.preventDefault();
    navigate(link.getAttribute("href").replace("#/",""));
  });

  window.KV = { navigate: navigate };

  /* ---------- Stubs (telas ainda não fornecidas) ---------- */
  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-stub]");
    if(!el) return;
    if(el.hasAttribute("data-page-link")) return;  /* navega em vez de logar */
    e.preventDefault();
    console.info("[protótipo] Tela não implementada: " + el.dataset.stub);
  });

  /* ---------- Campo de senha ---------- */
  var pwd = document.getElementById("senha");
  var toggle = document.getElementById("togglePassword");
  var eye = document.getElementById("eyeIcon");
  var EYE_ON  = "M600.5-379.5Q650-429 650-500t-49.5-120.5Q551-670 480-670t-120.5 49.5Q310-571 310-500t49.5 120.5Q409-330 480-330t120.5-49.5Zm-200-41Q368-453 368-500t32.5-79.5Q433-612 480-612t79.5 32.5Q592-547 592-500t-32.5 79.5Q527-388 480-388t-79.5-32.5ZM216-283Q98-366 40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83q-146 0-264-83Zm264-217Zm222.5 174.5Q804-391 857-500q-53-109-154.5-174.5T480-740q-121 0-222.5 65.5T102-500q54 109 155.5 174.5T480-260q121 0 222.5-65.5Z";
  var EYE_OFF = "m629-419-44-44q26-71-27-118t-115-24l-44-44q17-11 38-16t43-5q71 0 120.5 49.5T650-500q0 22-5.5 43.5T629-419Zm129 129-40-40q49-36 85.5-80.5T857-500q-50-111-150-175.5T490-740q-42 0-86 8t-69 19l-46-47q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93Zm58 226L648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM223-654q-37 27-71.5 71T102-500q51 111 153.5 175.5T488-260q33 0 65-4t48-12l-64-64q-11 5-27 7.5t-30 2.5q-70 0-120-49t-50-121q0-15 2.5-30t7.5-27l-97-97Zm305 142Zm-116 58Z";
  toggle.addEventListener("click", function(){
    var show = pwd.type === "password";
    pwd.type = show ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(show));
    toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    eye.querySelector("path").setAttribute("d", show ? EYE_OFF : EYE_ON);
    pwd.focus();
  });

  /* ---------- Submit + loading ---------- */
  var loginEl = document.getElementById("login");
  var form = document.getElementById("loginForm");
  var btn = document.getElementById("submitBtn");
  var label = document.getElementById("submitLabel");
  var status = document.getElementById("loginStatus");
  var user = document.getElementById("usuario");

  function resetLogin(){
    loginEl.dataset.loading = "false";
    btn.disabled = false;
    btn.removeAttribute("aria-busy");
    btn.dataset.busy = "false";
    btn.classList.remove("btn--loading");
    btn.classList.add("btn--primary");
    btn.innerHTML = '<span id="submitLabel">Entrar</span>';
    status.textContent = "";
    form.reset();
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!user.value.trim()){ user.focus(); return; }
    if(!pwd.value.trim()){ pwd.focus(); return; }

    if(btn.dataset.busy === "true") return;
    btn.dataset.busy = "true";

    loginEl.dataset.loading = "true";
    btn.disabled = true;
    btn.setAttribute("aria-busy","true");
    btn.classList.remove("btn--primary");
    btn.classList.add("btn--loading");
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span id="submitLabel">Carregando...</span>';
    status.textContent = "Autenticando";

    setTimeout(function(){
      navigate("home");
      resetLogin();
    }, 1600);
  });

  /* ---------- Dropdown de idioma ---------- */
  var LANGS = [
    { code:"pt-BR", label:"Português-BR", flag:flagBR },
    { code:"en-US", label:"Inglês-US",    flag:flagUS },
    { code:"es-ES", label:"Espanhol-ES",  flag:flagES },
    { code:"es-CO", label:"Espanhol-COL", flag:flagCO },
    { code:"zh-CN", label:"Mandarim-ZN",  flag:flagCN }
  ];
  var CHECK = '<svg class="menu__check" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>';

  function flagBR(){return '<svg class="flag" width="34" height="34" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#009B3A"/><path d="M20 8 L34 20 L20 32 L6 20 Z" fill="#FEDF00"/><circle cx="20" cy="20" r="6.5" fill="#002776"/></svg>';}
  function flagUS(){return '<svg class="flag" width="34" height="34" viewBox="0 0 40 40"><defs><clipPath id="cUS"><circle cx="20" cy="20" r="20"/></clipPath></defs><g clip-path="url(#cUS)"><rect width="40" height="40" fill="#fff"/><g fill="#B22234"><rect y="0" width="40" height="3.1"/><rect y="6.2" width="40" height="3.1"/><rect y="12.4" width="40" height="3.1"/><rect y="18.6" width="40" height="3.1"/><rect y="24.8" width="40" height="3.1"/><rect y="31" width="40" height="3.1"/><rect y="37.2" width="40" height="2.8"/></g><rect width="18" height="18" fill="#3C3B6E"/></g></svg>';}
  function flagES(){return '<svg class="flag" width="34" height="34" viewBox="0 0 40 40"><defs><clipPath id="cES"><circle cx="20" cy="20" r="20"/></clipPath></defs><g clip-path="url(#cES)"><rect width="40" height="40" fill="#AA151B"/><rect y="10" width="40" height="20" fill="#F1BF00"/></g></svg>';}
  function flagCO(){return '<svg class="flag" width="34" height="34" viewBox="0 0 40 40"><defs><clipPath id="cCO"><circle cx="20" cy="20" r="20"/></clipPath></defs><g clip-path="url(#cCO)"><rect width="40" height="20" fill="#FCD116"/><rect y="20" width="40" height="10" fill="#003893"/><rect y="30" width="40" height="10" fill="#CE1126"/></g></svg>';}
  function flagCN(){return '<svg class="flag" width="34" height="34" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#DE2910"/><path d="M12 10 l1.8 5.4 -4.6-3.4 5.6 0 -4.6 3.4z" fill="#FFDE00"/><circle cx="21" cy="9" r="1.5" fill="#FFDE00"/><circle cx="25" cy="13" r="1.5" fill="#FFDE00"/><circle cx="25" cy="19" r="1.5" fill="#FFDE00"/><circle cx="21" cy="23" r="1.5" fill="#FFDE00"/></svg>';}

  var menu = document.getElementById("langMenu");
  var trigger = document.getElementById("langTrigger");
  var current = document.getElementById("langCurrent");
  var selected = 0;

  function buildMenu(){
    menu.innerHTML = LANGS.map(function(l,i){
      return '<li role="none"><button type="button" role="option" class="menu__item" data-index="'+i+'" '+
             'aria-selected="'+(i===selected)+'" tabindex="-1">'+l.flag()+
             '<span class="menu__label">'+l.label+'</span>'+CHECK+'</button></li>';
    }).join("");
  }
  buildMenu();

  function openMenu(){
    menu.dataset.open = "true";
    trigger.setAttribute("aria-expanded","true");
    var items = menu.querySelectorAll(".menu__item");
    items[selected].focus();
  }
  function closeMenu(focusTrigger){
    menu.dataset.open = "false";
    trigger.setAttribute("aria-expanded","false");
    if(focusTrigger) trigger.focus();
  }
  trigger.addEventListener("click", function(){
    menu.dataset.open === "true" ? closeMenu(true) : openMenu();
  });
  menu.addEventListener("click", function(e){
    var item = e.target.closest(".menu__item");
    if(!item) return;
    selected = Number(item.dataset.index);
    current.textContent = LANGS[selected].label;
    buildMenu();
    closeMenu(true);
  });
  menu.addEventListener("keydown", function(e){
    var items = Array.prototype.slice.call(menu.querySelectorAll(".menu__item"));
    var i = items.indexOf(document.activeElement);
    if(e.key === "ArrowDown"){ e.preventDefault(); items[(i+1)%items.length].focus(); }
    if(e.key === "ArrowUp"){ e.preventDefault(); items[(i-1+items.length)%items.length].focus(); }
    if(e.key === "Home"){ e.preventDefault(); items[0].focus(); }
    if(e.key === "End"){ e.preventDefault(); items[items.length-1].focus(); }
    if(e.key === "Escape"){ e.preventDefault(); closeMenu(true); }
  });
  document.addEventListener("click", function(e){
    if(menu.dataset.open === "true" && !e.target.closest(".lang")) closeMenu(false);
  });

  /* ---------- Modal ---------- */
  var scrim = document.getElementById("scrim");
  var modal = document.getElementById("modal");
  var infoBtn = document.getElementById("infoBtn");
  var lastFocus = null;
  var FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function openModal(){
    lastFocus = document.activeElement;
    scrim.dataset.open = "true";
    modal.querySelector(FOCUSABLE).focus();
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    scrim.dataset.open = "false";
    document.body.style.overflow = "";
    if(lastFocus) lastFocus.focus();
  }
  infoBtn.addEventListener("click", openModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalCloseText").addEventListener("click", closeModal);
  scrim.addEventListener("mousedown", function(e){ if(e.target === scrim) closeModal(); });
  document.addEventListener("keydown", function(e){
    if(scrim.dataset.open !== "true") return;
    if(e.key === "Escape"){ closeModal(); return; }
    if(e.key !== "Tab") return;
    var f = Array.prototype.slice.call(modal.querySelectorAll(FOCUSABLE));
    var first = f[0], last = f[f.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   AMBIENTE DO ALUNO — carrosséis e slots de imagem
   ============================================================ */
(function(){
  "use strict";

  /* ---------- Slots de imagem ----------
     Preencha com as URLs (ou data URIs) dos assets reais.
     Ex.: ASSETS["hero"] = "img/hero-formacao.jpg";
     Slots disponíveis: hero, destaque-1..4, curso-1..5,
     trilha-1..5, post-video, desafio-1..15 */
    /* Slots com variante clara: no tema claro usa "<slot>-light".
     Reaplicado a cada troca de tema. */
  function pintarSlots(){
    var claro = document.documentElement.getAttribute("data-theme") === "light";
    document.querySelectorAll("[data-slot]").forEach(function(el){
      var slot = el.dataset.slot;
      var url = (claro && ASSETS[slot + "-light"]) ? ASSETS[slot + "-light"] : ASSETS[slot];
      if(!url) return;
      if(el.tagName === "IMG"){ el.src = url; }
      else { el.style.backgroundImage = 'url("' + url + '")'; }
      el.dataset.filled = "true";
    });
  }
  pintarSlots();
  window.KV = window.KV || {};
  window.KV.pintarSlots = pintarSlots;

  /* ---------- Carrosséis (translateX, sem overflow, hover expande livre) ---------- */
  document.querySelectorAll(".carousel").forEach(function(carousel){
    var track = carousel.querySelector(".carousel__track");
    var prev = carousel.querySelector('[data-dir="prev"]');
    var next = carousel.querySelector('[data-dir="next"]');
    if(!track) return;

    var offset = 0;

    function step(){
      var first = track.firstElementChild;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      return first ? first.getBoundingClientRect().width + gap : track.clientWidth * .8;
    }
    function maxOffset(){
      return Math.max(0, track.scrollWidth - carousel.clientWidth);
    }
    function apply(){
      offset = Math.max(0, Math.min(offset, maxOffset()));
      track.style.transform = "translateX(" + (-offset) + "px)";
      if(prev) prev.hidden = offset <= 2;
      if(next) next.hidden = offset >= maxOffset() - 2;
    }
    if(prev) prev.addEventListener("click", function(){ offset -= step(); apply(); });
    if(next) next.addEventListener("click", function(){ offset += step(); apply(); });
    window.addEventListener("resize", apply);
    apply();
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   SHELL DO ALUNO — drawer, menu do usuário, páginas internas
   ============================================================ */
(function(){
  "use strict";

  var PAGES = {
    "inicio":"Início",
    "meu-aprendizado":"Meu aprendizado",
    "cursos-concluidos":"Cursos concluídos",
    "trilhas":"Trilhas",
    "catalogo":"Catálogo",
    "biblioteca":"Biblioteca",
    "gamificacao":"Gamificação",
    "post":"Post",
    "correio":"Correio",
    "fale-conosco":"Fale conosco",
    "notificacoes":"Notificações",
    "perfil":"Meu perfil",
    "login-mobile":"Login mobile",
    "privacidade":"Política de privacidade",
    "tour":"Tour"
  };

  var content   = document.getElementById("conteudoAluno");
  var stub      = content.querySelector('[data-page="__stub"]');
  var stubTitle = document.getElementById("stubTitle");
  var inicio    = content.querySelector('[data-page="inicio"]');

  var drawer      = document.getElementById("drawer");
  var drawerScrim = document.getElementById("drawerScrim");
  var drawerOpen  = document.getElementById("drawerToggle");
  var drawerClose = document.getElementById("drawerClose");

  var userTrigger = document.getElementById("userTrigger");
  var userMenu    = document.getElementById("userMenu");
  var langToggle  = document.getElementById("langToggle");
  var langBox     = document.getElementById("usermenuLangs");

  /* ---------------- Páginas ---------------- */
  function goPage(name){
    content.querySelectorAll("[data-page]").forEach(function(s){ s.hidden = true; });

    var alvo = content.querySelector('[data-page="' + name + '"]');
    if(alvo){
      alvo.hidden = false;
    }else{
      stub.hidden = false;
      stubTitle.textContent = Object.prototype.hasOwnProperty.call(PAGES, name) ? PAGES[name] : name;
    }

    document.querySelectorAll(".drawer__item").forEach(function(el){
      var on = el.dataset.pageLink === name;
      el.classList.toggle("drawer__item--active", on);
      if(on) el.setAttribute("aria-current","page");
      else el.removeAttribute("aria-current");
    });

    /* o classroom é uma visão full-bleed: esconde topbar e footer da plataforma */
    document.querySelector(".student").dataset.mode = (name === "classroom") ? "classroom" : "app";

    closeDrawer(false);
    closeUserMenu(false);
    window.scrollTo(0,0);
  }

  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-page-link]");
    if(!el) return;
    e.preventDefault();
    goPage(el.dataset.pageLink);
  });

  /* ---------------- Drawer ---------------- */
  var FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function openDrawer(){
    drawer.dataset.open = "true";
    drawerScrim.hidden = false;
    drawerOpen.setAttribute("aria-expanded","true");
    drawerClose.focus();
  }
  function closeDrawer(focusBack){
    if(drawer.dataset.open !== "true") return;
    drawer.dataset.open = "false";
    drawerScrim.hidden = true;
    drawerOpen.setAttribute("aria-expanded","false");
    if(focusBack) drawerOpen.focus();
  }
  drawerOpen.addEventListener("click", function(){
    drawer.dataset.open === "true" ? closeDrawer(true) : openDrawer();
  });
  drawerClose.addEventListener("click", function(){ closeDrawer(true); });
  drawerScrim.addEventListener("click", function(){ closeDrawer(true); });

  drawer.addEventListener("keydown", function(e){
    if(e.key === "Escape"){ closeDrawer(true); return; }
    if(e.key !== "Tab") return;
    var f = Array.prototype.slice.call(drawer.querySelectorAll(FOCUSABLE));
    if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  /* ---------------- Menu do usuário ---------------- */
  var LANGS = ["Português-BR","Inglês-US","Espanhol-ES","Espanhol-COL","Mandarim-ZN"];
  var CHECK = '<svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
            + '<path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>';
  var langSelected = 0;

  function renderLangs(){
    langBox.innerHTML = LANGS.map(function(l,i){
      return '<button type="button" class="usermenu__lang" role="menuitemradio" '
           + 'aria-checked="' + (i === langSelected) + '" data-lang="' + i + '">'
           + '<span>' + l + '</span>' + CHECK + '</button>';
    }).join("");
  }
  renderLangs();

  langBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-lang]");
    if(!b) return;
    langSelected = Number(b.dataset.lang);
    renderLangs();
  });

  langToggle.addEventListener("click", function(){
    var open = langToggle.getAttribute("aria-expanded") === "true";
    langToggle.setAttribute("aria-expanded", String(!open));
    langBox.hidden = open;
  });

  function openUserMenu(){
    userMenu.dataset.open = "true";
    userTrigger.setAttribute("aria-expanded","true");
  }
  function closeUserMenu(focusBack){
    if(userMenu.dataset.open !== "true") return;
    userMenu.dataset.open = "false";
    userTrigger.setAttribute("aria-expanded","false");
    langToggle.setAttribute("aria-expanded","false");
    langBox.hidden = true;
    if(focusBack) userTrigger.focus();
  }
  userTrigger.addEventListener("click", function(e){
    e.stopPropagation();
    userMenu.dataset.open === "true" ? closeUserMenu(true) : openUserMenu();
  });
  document.addEventListener("click", function(e){
    if(!e.target.closest(".usermenu")) closeUserMenu(false);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeUserMenu(true);
  });

  /* Sair volta para o login */
  document.getElementById("logoutBtn").addEventListener("click", function(){
    closeUserMenu(false);
    goPage("inicio");
    if(window.KV && window.KV.navigate) window.KV.navigate("login");
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   IA CHAT
   ============================================================ */
(function(){
  "use strict";

  var panel  = document.getElementById("iaChat");
  var thread = document.getElementById("iaThread");
  var empty  = document.getElementById("iaEmpty");
  var form   = document.getElementById("iaForm");
  var input  = document.getElementById("iaInput");
  var closeB = document.getElementById("iaChatClose");
  var trigger = document.querySelector(".ai-btn");

  /* Resposta única: entregue para qualquer tag clicada ou texto digitado. */
  var RESPOSTA =
      '<p>Você está matriculado nos seguintes cursos obrigatórios definidos para o seu perfil ou unidade. '
      + 'Esses cursos fazem parte das exigências atuais da sua trilha de desenvolvimento ou das diretrizes da empresa:</p>'
      + '<ul>'
      + '<li><a href="#" data-stub="Curso: Lei anticorrupção">Lei anticorrupção (02h 25m)</a></li>'
      + '<li><a href="#" data-stub="Curso: LGPD - Proteção de dados">LGPD - Proteção de dados (01h 00m)</a></li>'
      + '<li><a href="#" data-stub="Curso: Compliance e ética empresarial">Compliance e ética empresarial (00h 45m)</a></li>'
      + '</ul>'
      + '<p>Quer acessar algum agora?</p>';

  var THUMB_UP = '<svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
    + '<path d="M716-120H272v-512l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.84q0 7.16 1.5 14.66T915-461L789-171q-8.88 21.25-29.59 36.12Q738.69-120 716-120Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79v-512h193Z"/></svg>';
  var THUMB_DOWN = '<svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
    + '<path d="M242-840h444v512L408-40l-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.84q0-7.16-1.5-14.66T43-499l126-290q8.88-21.25 29.59-36.13Q219.31-840 242-840Zm384 60H229L103-481v93h373l-53 249 203-214v-427Zm0 427v-427 427Zm60 25v-60h133v-392H686v-60h193v512H686Z"/></svg>';

  function hhmm(d){
    return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
  }
  function el(html){
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function scroll(){ thread.scrollTop = thread.scrollHeight; }

  var ROBOT = "";
  function avatars(){
    var r = document.querySelector('[data-slot="ia-robot"]');
    ROBOT = r ? r.getAttribute("src") || "" : "";

  }

  function addUser(text){
    if(empty) empty.hidden = true;
    thread.appendChild(el('<div class="msg msg--user"><div class="msg__bubble"></div>'
      + '<span class="avatar msg__avatar" aria-hidden="true">FL</span></div>'));
    thread.lastElementChild.querySelector(".msg__bubble").textContent = text;
    thread.appendChild(el('<div class="msg__meta msg__meta--right">' + hhmm(new Date()) + '</div>'));
    scroll();
  }

  function addThinking(){
    var node = el('<div class="msg msg--bot"><img class="msg__avatar msg__avatar--bot" src="' + ROBOT
      + '" alt="" aria-hidden="true"><div class="msg__bubble"><span class="msg__thinking">Pensando...</span></div></div>');
    thread.appendChild(node);
    scroll();
    return node;
  }

  function addAnswer(node, html, seconds){
    node.querySelector(".msg__bubble").innerHTML = html;
    var meta = el('<div class="msg__meta">' + hhmm(new Date()) + ' - ' + seconds.toFixed(1) + 's'
      + '<button type="button" class="msg__vote" aria-label="Resposta útil" aria-pressed="false">' + THUMB_UP + '</button>'
      + '<button type="button" class="msg__vote" aria-label="Resposta não útil" aria-pressed="false">' + THUMB_DOWN + '</button>'
      + '</div>');
    node.insertAdjacentElement("afterend", meta);
    meta.addEventListener("click", function(e){
      var b = e.target.closest(".msg__vote");
      if(!b) return;
      var on = b.getAttribute("aria-pressed") === "true";
      meta.querySelectorAll(".msg__vote").forEach(function(v){ v.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed", String(!on));
    });
    scroll();
  }

  function ask(text){
    addUser(text);
    var node = addThinking();
    var delay = 1400 + Math.random() * 900;
    setTimeout(function(){
      addAnswer(node, RESPOSTA, delay / 1000);
    }, delay);
  }

  document.addEventListener("click", function(e){
    var chip = e.target.closest(".iachat__chip");
    if(!chip) return;
    ask(chip.textContent.trim());
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var v = input.value.trim();
    if(!v) return;
    input.value = "";
    ask(v);
  });

  function open(){
    avatars();
    panel.dataset.open = "true";
    panel.setAttribute("aria-hidden","false");
    trigger.setAttribute("aria-expanded","true");
    input.focus();
  }
  function close(focusBack){
    panel.dataset.open = "false";
    panel.setAttribute("aria-hidden","true");
    trigger.setAttribute("aria-expanded","false");
    if(focusBack) trigger.focus();
  }
  trigger.setAttribute("aria-expanded","false");
  trigger.setAttribute("aria-controls","iaChat");
  trigger.removeAttribute("data-stub");
  trigger.addEventListener("click", function(){
    panel.dataset.open === "true" ? close(true) : open();
  });
  closeB.addEventListener("click", function(){ close(true); });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && panel.dataset.open === "true") close(true);
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   FAB — voltar ao topo
   ============================================================ */
(function(){
  "use strict";
  var fab = document.getElementById("fabTop");
  if(!fab) return;

  var LIMIAR = 160;              // distância de um primeiro gesto de rolagem
  var ticking = false;

  function sync(){
    fab.dataset.visible = window.scrollY > LIMIAR ? "true" : "false";
    ticking = false;
  }
  window.addEventListener("scroll", function(){
    if(ticking) return;
    ticking = true;
    window.requestAnimationFrame(sync);
  }, { passive:true });
  sync();

  fab.addEventListener("click", function(){
    var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top:0, behavior: reduz ? "auto" : "smooth" });
    fab.dataset.visible = "false";
    // devolve o foco ao início da página, senão quem usa teclado fica perdido
    var primeiro = document.getElementById("drawerToggle");
    if(primeiro) primeiro.focus({ preventScroll:true });
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   CATÁLOGO — árvore de categorias
   ============================================================ */
(function(){
  "use strict";
  document.addEventListener("click", function(e){
    var b = e.target.closest(".cat--group");
    if(!b) return;
    var box = document.getElementById(b.getAttribute("aria-controls"));
    if(!box) return;
    var aberto = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!aberto));
    box.hidden = aberto;
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Fechar avisos dispensáveis
   ============================================================ */
(function(){
  "use strict";
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-dismiss]");
    if(!b) return;
    var alvo = b.closest(".alertbar");
    if(alvo) alvo.hidden = true;
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Fale conosco — envio simulado
   ============================================================ */
(function(){
  "use strict";
  var form = document.getElementById("formFaleConosco");
  if(!form) return;
  var status = document.getElementById("faleStatus");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var assunto = document.getElementById("faleA");
    var msg = document.getElementById("faleM");
    if(!assunto.value.trim()){ assunto.focus(); return; }
    if(!msg.value.trim()){ msg.focus(); return; }
    status.textContent = "Mensagem enviada.";
    form.reset();
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Correio — selecionar todas
   ============================================================ */
(function(){
  "use strict";
  var todas = document.getElementById("msgAll");
  if(!todas) return;
  todas.addEventListener("change", function(){
    var tabela = todas.closest("table");
    tabela.querySelectorAll("tbody .chk").forEach(function(c){ c.checked = todas.checked; });
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Gamificação — navegação entre abas internas
   ============================================================ */
(function(){
  "use strict";
  var pagina = document.querySelector('[data-page="gamificacao"]');
  if(!pagina) return;

  function abrir(id){
    pagina.querySelectorAll("[data-gtab]").forEach(function(p){ p.hidden = p.dataset.gtab !== id; });
    pagina.querySelectorAll("[data-gtab-link]").forEach(function(b){
      var on = b.dataset.gtabLink === id;
      b.classList.toggle("tab--on", on);
      b.setAttribute("aria-selected", String(on));
    });
    pagina.querySelectorAll("[data-gtab-only]").forEach(function(b){
      b.hidden = b.dataset.gtabOnly !== id;
    });
  }

  pagina.addEventListener("click", function(e){
    var b = e.target.closest("[data-gtab-link]");
    if(!b) return;
    abrir(b.dataset.gtabLink);
  });

  /* setas navegam entre abas, como manda o padrão de tablist */
  pagina.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-gtab-link]");
    if(!b) return;
    if(e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    var abas = Array.prototype.slice.call(pagina.querySelectorAll("[data-gtab-link]"));
    var i = abas.indexOf(b);
    var alvo = abas[(i + (e.key === "ArrowRight" ? 1 : -1) + abas.length) % abas.length];
    alvo.focus();
    abrir(alvo.dataset.gtabLink);
  });

  abrir("extrato");
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Alternância de tema — claro / escuro
   ============================================================ */
(function(){
  "use strict";
  var botao = document.getElementById("themeToggle");
  if(!botao) return;
  var rotulo = document.getElementById("themeLabel");
  var icone = document.getElementById("themeIcon");
  var raiz = document.documentElement;

  var SOL = document.getElementById("themeIcon").innerHTML;
  var LUA = '<svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
    + '<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q8 0 17 .5t23 1.5q-36 32-56 79t-20 99q0 90 63 153t153 63q52 0 99-18.5t79-51.5q1 12 1.5 19.5t.5 14.5q0 150-105 255T480-120Zm0-60q109 0 190-67.5T771-406q-25 11-53.67 16.5Q688.67-384 660-384q-114.69 0-195.34-80.66Q384-545.31 384-660q0-24 5-51.5t18-62.5q-98 27-162.5 109.5T180-480q0 125 87.5 212.5T480-180Zm-4-297Z"/></svg>';

  function aplicar(tema){
    var claro = tema === "light";
    raiz.setAttribute("data-theme", claro ? "light" : "dark");
    /* o rótulo nomeia o modo de destino, não o atual */
    rotulo.textContent = claro ? "Modo escuro" : "Modo claro";
    icone.innerHTML = claro ? LUA : SOL;
    botao.setAttribute("aria-label", claro ? "Ativar modo escuro" : "Ativar modo claro");
    /* o gradiente vem embutido na imagem: repinta os slots ao trocar o tema */
    if(window.KV && window.KV.pintarSlots) window.KV.pintarSlots();
  }

  /* Sempre inicia no escuro: a preferência não persiste entre sessões,
     para que cada visitante do estande encontre a demo no estado padrão. */
  aplicar("dark");

  botao.removeAttribute("data-stub");
  botao.addEventListener("click", function(){
    aplicar(raiz.getAttribute("data-theme") === "light" ? "dark" : "light");
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Landing page — abas internas
   ============================================================ */
(function(){
  "use strict";
  var lp = document.querySelector('[data-page="curso"]');
  if(!lp) return;
  lp.addEventListener("click", function(e){
    var b = e.target.closest("[data-lptab-link]");
    if(!b) return;
    var id = b.dataset.lptabLink;
    lp.querySelectorAll("[data-lptab]").forEach(function(t){ t.hidden = t.dataset.lptab !== id; });
    lp.querySelectorAll("[data-lptab-link]").forEach(function(x){
      var on = x.dataset.lptabLink === id;
      x.classList.toggle("tab--on", on);
      x.setAttribute("aria-selected", String(on));
    });
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Landing — recolher painel de turmas
   ============================================================ */
(function(){
  "use strict";
  var btn = document.getElementById("turmasToggle");
  if(!btn) return;
  var body = document.getElementById("turmasBody");
  var lpBody = document.querySelector(".lp__body");
  btn.addEventListener("click", function(){
    var aberto = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!aberto));
    body.hidden = aberto;
    if(lpBody) lpBody.classList.toggle("is-collapsed", aberto);
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Classroom — tela cheia, recolher menu (fiel ao Figma)
   ============================================================ */
(function(){
  "use strict";
  var sala = document.querySelector('[data-page="classroom"]');
  if(!sala) return;
  var grid = document.getElementById("clGrid");
  var full = document.getElementById("clFull");
  var close = document.getElementById("clClose");
  var collapseBtns = [document.getElementById("clCollapse"), document.getElementById("clExpand")];

  var ON = full.innerHTML;
  var OFF = '<svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
    + '<path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/></svg>';

  full.addEventListener("click", function(){
    var on = sala.getAttribute("data-fullscreen") === "true";
    sala.setAttribute("data-fullscreen", String(!on));
    full.innerHTML = on ? ON : OFF;
    full.setAttribute("aria-label", on ? "Tela cheia" : "Sair da tela cheia");
  });

  function toggleMenu(){
    var col = grid.getAttribute("data-collapsed") === "true";
    grid.setAttribute("data-collapsed", String(!col));
  }
  collapseBtns.forEach(function(b){ if(b) b.addEventListener("click", toggleMenu); });

  if(close) close.addEventListener("click", function(){
    sala.setAttribute("data-fullscreen","false");
    grid.setAttribute("data-collapsed","false");
    full.innerHTML = ON;
  });
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Dropdown de notificações
   ============================================================ */
(function(){
  "use strict";
  var btn=document.getElementById("notifBtn");
  if(!btn) return;
  var panel=document.getElementById("notifPanel");
  function abrir(){panel.hidden=false;btn.setAttribute("aria-expanded","true");}
  function fechar(){panel.hidden=true;btn.setAttribute("aria-expanded","false");}
  btn.addEventListener("click",function(e){
    e.stopPropagation();
    panel.hidden?abrir():fechar();
  });
  document.addEventListener("click",function(e){
    if(!panel.hidden && !panel.contains(e.target) && e.target!==btn) fechar();
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!panel.hidden)fechar();});
})();

/* ==================== próximo bloco ==================== */

/* ============================================================
   Menu "mais ações" — Cursos concluídos
   ============================================================ */
(function(){
  "use strict";
  var abertos=[...document.querySelectorAll(".cc-more")];
  if(!abertos.length) return;
  function fecharTodos(exceto){
    abertos.forEach(function(w){
      if(w===exceto) return;
      var m=w.querySelector(".cc-menu"), b=w.querySelector(".cc-act");
      m.hidden=true; b.setAttribute("aria-expanded","false");
    });
  }
  abertos.forEach(function(w){
    var btn=w.querySelector(".cc-act"), menu=w.querySelector(".cc-menu");
    btn.addEventListener("click",function(e){
      e.stopPropagation();
      var abrir=menu.hidden;
      fecharTodos(w);
      menu.hidden=!abrir;
      btn.setAttribute("aria-expanded",String(abrir));
    });
  });
  document.addEventListener("click",function(){fecharTodos(null);});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")fecharTodos(null);});
})();

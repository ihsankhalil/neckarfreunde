/* neckarfreunde — site scripts */
(function(){
  "use strict";

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.getElementById("main-navigation");
  if(toggle && links){
    toggle.addEventListener("click", function(){
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Schließen" : "Menü";
    });
    links.addEventListener("click", function(e){
      if(e.target.closest("a")){
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
        toggle.textContent = "Menü";
      }
    });
  }

  /* ---- Hero strike animation ---- */
  var strike = document.querySelector(".strike");
  if(strike){ setTimeout(function(){ strike.classList.add("drawn"); }, 150); }

  /* ---- Reveal on scroll ---- */
  var revs = document.querySelectorAll(".reveal");
  if(revs.length){
    if(!("IntersectionObserver" in window)){
      revs.forEach(function(e){ e.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, {threshold:0.12, rootMargin:"0px 0px -8% 0px"});
      revs.forEach(function(e){ io.observe(e); });
    }
  }

  /* ---- Contact form (mailto prototype) ---- */
  var form = document.getElementById("leadForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var el = form.elements;
      var name = el["name"].value.trim(),
          mail = el["email"].value.trim(),
          msg  = el["message"] ? el["message"].value.trim() : "";
      var err = document.getElementById("formErr");
      if(!name || !mail){ err.textContent = "Bitte Name und E-Mail ausfüllen."; return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){ err.textContent = "Bitte eine gültige E-Mail-Adresse angeben."; return; }
      if(el["website"] && el["website"].value){ return; }
      if(el["consent"] && !el["consent"].checked){ err.textContent = "Bitte stimmen Sie der Datenschutzerklärung zu."; return; }
      err.textContent = "";
      var anlass = el["anlass"] ? el["anlass"].value : "";
      var company = el["company"] ? el["company"].value : "";
      var phone = el["phone"] ? el["phone"].value : "";
      var body =
        "Name: " + encodeURIComponent(name) + "%0D%0A" +
        "Unternehmen: " + encodeURIComponent(company) + "%0D%0A" +
        "E-Mail: " + encodeURIComponent(mail) + "%0D%0A" +
        "Telefon: " + encodeURIComponent(phone) + "%0D%0A" +
        "Anlass: " + encodeURIComponent(anlass) + "%0D%0A%0D%0A" +
        encodeURIComponent(msg);
      var ok = document.getElementById("formOk");
      if(ok){ ok.classList.add("show"); }
      window.location.href = "mailto:hallo@neckarfreunde.de?subject=" +
        encodeURIComponent("Erstgespräch-Anfrage: " + name) + "&body=" + body;
    });
  }
})();

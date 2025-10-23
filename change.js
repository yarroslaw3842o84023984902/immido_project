function initLanguageDropdown() {
    const selector = document.querySelector(".language-selector");
    const btn = document.getElementById("language-button");
    const list = document.getElementById("language-list");
  
    if (!selector || !btn || !list) {
      console.warn("⚠️ Language dropdown not found yet — waiting for HTMX load...");
      return;
    }
  
    // --- відкриття / закриття ---
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selector.classList.toggle("open");
      btn.classList.toggle("open");
    });
  
    // --- закриття при кліку поза ---
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".language-selector")) {
        selector.classList.remove("open");
        btn.classList.remove("open");
      }
    });
  
    // --- перемикання мови ---
    window.setLanguage = function (lang) {
      selector.classList.remove("open");
      btn.classList.remove("open");
  
      // 🔹 прапор
      const img = btn.querySelector("img");
      if (img) {
        img.src = lang === "en" ? "img/ENiconBut.png" : "img/UAiconBut.png";
        img.alt = lang === "en" ? "English flag" : "Ukrainian flag";
      }
  
      // 🔹 зберігаємо
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
  
      // 🔹 перезавантажуємо partial-и
      document.querySelectorAll("[data-hx-get]").forEach((el) => {
        const currentSrc = el.getAttribute("data-hx-get");
        if (!currentSrc) return;
  
        const newSrc =
          lang === "en"
            ? currentSrc.replace(".partial.html", ".partial.en.html")
            : currentSrc.replace(".partial.en.html", ".partial.html");
  
        if (newSrc !== currentSrc) {
          el.setAttribute("data-hx-get", newSrc);
          console.log("🔄 Reloading:", newSrc);
  
          // ⚡️ Викликаємо HTMX-запит вручну
          htmx.ajax("GET", newSrc, { target: el, swap: "outerHTML" });
        }
      });
  
      console.log(`🌍 Language switched to: ${lang}`);
    };
  
    // --- прапор при старті ---
    const saved = localStorage.getItem("lang");
    if (saved === "en") {
      const img = btn.querySelector("img");
      if (img) {
        img.src = "img/ENiconBut.png";
        img.alt = "English flag";
      }
    }
  
    console.log("✅ Language dropdown initialized");
  }
  
  // --- HTMX події ---
  document.body.addEventListener("htmx:afterSwap", (e) => {
    if (e.detail.target.matches("nav")) {
      initLanguageDropdown();
    }
  });
  
  // --- коли HTMX повністю підвантажив partial-и ---
  document.body.addEventListener("htmx:afterOnLoad", () => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "en") {
      console.log("🔁 Applying saved language EN after HTMX load...");
      setTimeout(() => window.setLanguage("en"), 300);
    }
  });
  
  // --- DOM готовий ---
  document.addEventListener("DOMContentLoaded", initLanguageDropdown);
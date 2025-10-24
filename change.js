function initLanguageDropdown() {
  const selector = document.querySelector(".language-selector");
  const btn = document.getElementById("language-button");

  if (!selector || !btn) {
    console.warn("⚠️ Language dropdown not found yet — waiting for HTMX load...");
    return;
  }

  // --- відкриття / закриття ---
  if (!btn.dataset.listenerAttached) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selector.classList.toggle("open");
      btn.classList.toggle("open");
    });
    btn.dataset.listenerAttached = "true";
  }

  document.removeEventListener("click", closeDropdownOnClick);
  document.addEventListener("click", closeDropdownOnClick);

  function closeDropdownOnClick(e) {
    if (!e.target.closest(".language-selector")) {
      selector.classList.remove("open");
      btn.classList.remove("open");
    }
  }

  // --- перемикання мови ---
  window.setLanguage = async function (lang) {
    selector.classList.remove("open");
    btn.classList.remove("open");

    // зміна прапора
    const img = btn.querySelector("img");
    if (img) {
      img.src = lang === "en" ? "img/ENiconBut.png" : "img/UAiconBut.png";
      img.alt = lang === "en" ? "English flag" : "Ukrainian flag";
    }

    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;

    // оновлення partial-ів
    const sections = Array.from(document.querySelectorAll("[data-hx-get]"));
    for (const el of sections) {
      const currentSrc = el.getAttribute("data-hx-get");
      if (!currentSrc) continue;

      const newSrc =
        lang === "en"
          ? currentSrc.replace(".partial.html", ".partial.en.html")
          : currentSrc.replace(".partial.en.html", ".partial.html");

      if (newSrc !== currentSrc) {
        el.setAttribute("data-hx-get", newSrc);
        console.log("🔄 Reloading via HTMX:", newSrc);
        htmx.ajax("GET", newSrc, { target: el, swap: "outerHTML" });
      }
    }

    console.log(`🌍 Language switched to: ${lang}`);
  };

  // --- слухачі для кнопок мов ---
  const list = document.getElementById("language-list");
  if (list && !list.dataset.listenerAttached) {
    list.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.textContent.trim().toLowerCase(); // "UA" → "ua"
        window.setLanguage(lang);
      });
    });
    list.dataset.listenerAttached = "true";
  }

  // --- прапор при старті ---
  const saved = localStorage.getItem("lang");
  if (saved === "en") {
    const img = btn.querySelector("img");
    if (img) {
      img.src = "img/ENiconBut.png";
      img.alt = "English flag";
    }

    setTimeout(() => window.setLanguage("en"), 600);
  }

  console.log("✅ Language dropdown initialized");
}

// --- HTMX події ---
document.body.addEventListener("htmx:afterSwap", () => {
  initLanguageDropdown();
});

document.body.addEventListener("htmx:afterOnLoad", () => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang === "en") {
    console.log("🔁 Applying saved language EN after HTMX load...");
    setTimeout(() => window.setLanguage("en"), 300);
  }
});

document.addEventListener("DOMContentLoaded", initLanguageDropdown);

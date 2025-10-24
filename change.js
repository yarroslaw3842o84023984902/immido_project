function initLanguageDropdown() {
  const selector = document.querySelector(".language-selector");
  const btn = document.getElementById("language-button");
  const list = document.getElementById("language-list");

  if (!selector || !btn || !list) {
    console.warn("⚠️ Language dropdown not found — waiting for HTMX...");
    return;
  }

  // --- відкриття/закриття меню ---
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    selector.classList.toggle("open");
    btn.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".language-selector")) {
      selector.classList.remove("open");
      btn.classList.remove("open");
    }
  });

  // --- перемикання мови ---
  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      console.log(`🌍 Switching to: ${lang}`);
      setLanguage(lang);
    });
  });

  console.log("✅ Language dropdown initialized");
}

function setLanguage(lang) {
  const btn = document.getElementById("language-button");
  const img = btn?.querySelector("img");

  if (img) {
    img.src = lang === "en" ? "img/ENiconBut.png" : "img/UAiconBut.png";
    img.alt = lang === "en" ? "English flag" : "Ukrainian flag";
  }

  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const current = window.location.pathname;
  const isEnglish = current.includes("index.en.html");
  const isUkrainian = current.includes("index.html") || current === "/" || current === "/index.html";

  let target = null;

  if (lang === "en" && !isEnglish) {
    target = "index.en.html";
  } else if (lang === "uk" && !isUkrainian) {
    target = "index.html";
  }

  if (target) {
    console.log(`🔁 Redirecting to: ${target}`);
    window.location.replace(target); // 🔄 без створення історії переходів
  } else {
    console.log("✅ Already correct page — no redirect");
  }
}

// --- подія при старті ---
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uk";
  const path = window.location.pathname.toLowerCase();

  const isEnglishPage = path.includes("index.en");
  const isUkrainianPage = path === "/" || path.includes("index") && !path.includes("index.en");

  // 🚫 не створюємо петлі
  if (savedLang === "en" && !isEnglishPage) {
    console.log("🔁 Redirecting to English version");
    window.location.replace("index.en.html");
    return;
  }

  if (savedLang === "uk" && !isUkrainianPage) {
    console.log("🔁 Redirecting to Ukrainian version");
    window.location.replace("index.html");
    return;
  }

  // оновлюємо прапорець
  const btn = document.getElementById("language-button");
  const img = btn?.querySelector("img");
  if (img) {
    img.src = savedLang === "en" ? "img/ENiconBut.png" : "img/UAiconBut.png";
    img.alt = savedLang === "en" ? "English flag" : "Ukrainian flag";
  }

  initLanguageDropdown();
});


// --- повторне підключення після HTMX-заміни ---
document.body.addEventListener("htmx:afterSwap", (e) => {
  if (e.target.matches("nav") || e.target.closest("nav")) {
    console.log("♻️ Reinitializing dropdown after HTMX swap");
    initLanguageDropdown();
  }
});

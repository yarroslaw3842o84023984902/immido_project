// 🔹 окремо — функція для оновлення прапорця
function updateFlagIcon(lang = localStorage.getItem("lang") || "uk") {
  const img = document.querySelector("#language-button img");
  if (!img) return;

  if (lang === "en") {
    img.src = "/img/ENiconBut.png";  // ← FIXED
    img.alt = "English flag";
  } else {
    img.src = "/img/UAiconBut.png";  // ← FIXED
    img.alt = "Ukrainian flag";
  }
}

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

  // 🔧 оновлюємо прапорець при ініціалізації
  updateFlagIcon();

  console.log("✅ Language dropdown initialized");
}

function setLanguage(lang) {
  // 🔧 оновлення прапорця
  updateFlagIcon(lang);

  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const current = window.location.pathname;

  let target = null;

  // --- НОВА логіка переходів ---
  if (lang === "en") {
    target = "/en/";
  } else if (lang === "uk") {
    target = "/";
  }

  // якщо вже правильно — нічого не робимо
  if (current === target) {
    console.log("✅ Already correct page — no redirect");
    return;
  }

  console.log(`🔁 Redirecting to: ${target}`);
  window.location.replace(target);
}

// --- подія при старті ---
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uk";
  const path = window.location.pathname.toLowerCase();

  const isEnglishPage = path.startsWith("/en/");
  const isUkrainianPage = path === "/" || path === "/index.html";

  // 🚫 не створюємо петлі
  if (savedLang === "en" && !isEnglishPage) {
    console.log("🔁 Redirecting to English version");
    window.location.replace("/en/");
    return;
  }

  if (savedLang === "uk" && !isUkrainianPage) {
    console.log("🔁 Redirecting to Ukrainian version");
    window.location.replace("/");
    return;
  }

  // 🔧 оновлюємо прапорець при завантаженні
  updateFlagIcon(savedLang);

  initLanguageDropdown();
});

// --- повторне підключення після HTMX-заміни ---
document.body.addEventListener("htmx:afterSwap", (e) => {
  if (e.target.matches("nav") || e.target.closest("nav")) {
    console.log("♻️ Reinitializing dropdown after HTMX swap");
    initLanguageDropdown();
    updateFlagIcon();
  }
});
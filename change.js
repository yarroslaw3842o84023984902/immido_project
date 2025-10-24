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

  // --- визначаємо сторінку ---
  const current = window.location.pathname;
  let target;

  if (lang === "en" && !current.includes("index.en.html")) {
    target = "index.en.html";
  } else if (lang === "uk" && current.includes("index.en.html")) {
    target = "index.html";
  }

  if (target) {
    console.log(`🔁 Redirecting to: ${target}`);
    window.location.href = target;
  } else {
    console.log("✅ Already correct page — no redirect");
  }
}

// --- подія при старті ---
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uk";
  const current = window.location.pathname;

  const isMain = current === "/" || current.endsWith("index.html");
  const isEnglish = current.endsWith("index.en.html");

  // 🚫 не створюємо петлі
  if (savedLang === "en" && !isEnglish) {
    window.location.href = "index.en.html";
    return;
  }
  if (savedLang === "uk" && !isMain) {
    window.location.href = "index.html";
    return;
  }

  // оновлюємо прапорець
  const btn = document.getElementById("language-button");
  const img = btn?.querySelector("img");
  if (img) {
    img.src = savedLang === "en" ? "img/ENiconBut.png" : "img/UAiconBut.png";
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
// Ініціалізація модалки після завантаження DOM або після HTMX
document.addEventListener('DOMContentLoaded', initCasesModal);
document.addEventListener('htmx:afterSwap', (e) => {
  if (e.detail.target && e.detail.target.id === 'cases') {
    initCasesModal();
  }
});

function initCasesModal() {
  const modal = document.getElementById('caseModal');
  const frame = document.getElementById('caseFrame');
  const closeBtn = document.querySelector('.case-modal__close');
  const caseElements = document.querySelectorAll('.case');

  if (!modal || !frame || !caseElements.length) return;

  // 🟡 Визначаємо мову з LocalStorage
  const lang = localStorage.getItem("lang") === "en" ? "en" : "ua";

  // 💾 Шляхи до файлів (UA та EN)
  const links = {
    case1: lang === 'en' ? 'cases/SpribeEN.pdf'   : 'cases/Spribe.pdf',
    case2: lang === 'en' ? 'cases/PayoneerEN.pdf' : 'cases/Payoneer.pdf',
    case3: lang === 'en' ? 'cases/IrysEN.pdf'     : 'cases/Irys.pdf',
    case4: lang === 'en' ? 'cases/GameDevEN.pdf'  : 'cases/GameDev.pdf',
    case5: lang === 'en' ? 'cases/BrizzolEN.pdf'  : 'cases/Brizzol.pdf',
    case6: lang === 'en' ? 'cases/BelatraEN.pdf'  : 'cases/Belatra.pdf',
  };

  caseElements.forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.dataset.case;
      const pdfPath = links[key];
      if (!pdfPath) return;

      const base = window.location.origin || '';
      const fullUrl = `${base}/${pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

      frame.src = fullUrl;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal, frame));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal, frame);
    }
  });
}

function closeModal(modal, frame) {
  modal.classList.remove('active');
  frame.src = '';
}
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

  // 💾 Шляхи до файлів (однакові для UA та EN)
  const links = {
    case1: 'cases/Spribe.pdf',
    case2: 'cases/Payoneer.pdf',
    case3: 'cases/Irys.pdf',
    case4: 'cases/GameDev.pdf',
    case5: 'cases/Brizzol.pdf',
    case6: 'cases/Belatra.pdf',
  };

  // Клік по логотипах
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

  // Закриття по кнопці
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal, frame));
  }

  // Закриття по кліку на фон
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal, frame);
    }
  });
}

function closeModal(modal, frame) {
  modal.classList.remove('active');
  frame.src = ''; // очищення iframe
}
// 1) Після того як HTMX підмінить секцію з кейсами – ініціалізуємо модалку
document.addEventListener('htmx:afterSwap', (e) => {
  if (e.detail.target && e.detail.target.id === 'cases') {
    initCasesModal();
  }
});

function initCasesModal() {
  const modal = document.getElementById('caseModal');
  if (!modal) return;

  const frame   = document.getElementById('caseFrame');
  const closeBtn = modal.querySelector('.case-modal__close');

  // 💾 Шляхи до файлів
  const links = {
    case1: 'cases/Spribe.pdf',
    case2: 'cases/case2.pdf',
    case3: 'cases/case3.pdf',
    case4: 'cases/case4.pdf'
  };

  // Клік по логотипах
  document.querySelectorAll('.case').forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.dataset.case;
      const pdfPath = links[key];
      if (!pdfPath) return;

      // 🔹 Ховаємо тулбар/навігацію PDF-viewer’а
      const base = window.location.origin || '';
      const fullUrl = `${base}/${pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

      frame.src = fullUrl;
      modal.classList.add('active');
    });
  });

  // Закриття по кнопці
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal(modal, frame);
    });
  }

  // Закриття по кліку на фон
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal, frame);
    }
  });
}

// Допоміжна функція закриття
function closeModal(modal, frame) {
  modal.classList.remove('active');
  frame.src = ''; // очищаємо, щоб при наступному відкритті не було бага
}
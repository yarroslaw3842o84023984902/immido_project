
  // === СТАН ===
  const slider = document.getElementById('services-slider');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.slider__control--prev');
  const nextBtn = slider.querySelector('.slider__control--next');
  let currentIndex = 0;

  // === РЕНДЕР ===
  function render() {
    // TODO: показувати лише slides[currentIndex] (клас active)
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === currentIndex);
    });
  }

  // === НАВІГАЦІЯ СТРІЛКАМИ ===
  function go(delta) {
    // TODO: змінити currentIndex з циклом (0..slides.length-1)
    currentIndex = (currentIndex + delta + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));

  // === КЛІКИ ПО МЕНЮ ВСЕРЕДИНІ СЛАЙДА ===
  slider.addEventListener('click', (e) => {
    const btn = e.target.closest('.slide__menu-item');
    if (!btn) return;
    const targetIndex = Number(btn.dataset.go);
    if (!Number.isNaN(targetIndex)) {
      currentIndex = targetIndex;
      render();
    }
  });

  // Перший рендер
  render();

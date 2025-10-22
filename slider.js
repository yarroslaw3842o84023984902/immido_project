// === СТАН ===
const slider = document.getElementById('services-slider');
const slides = Array.from(slider.querySelectorAll('.slide'));
const prevBtn = slider.querySelector('.slider__control--prev');
const nextBtn = slider.querySelector('.slider__control--next');

// === ІНДИКАТОР ===
const indicator = slider.querySelector('.slider__indicator');
const currentEl = indicator?.querySelector('.current');
const totalEl = indicator?.querySelector('.total');

let currentSlideIndex = 0;

// показуємо загальну кількість слайдів (якщо індикатор існує)
if (totalEl) totalEl.textContent = slides.length;

// === ФУНКЦІЯ РЕНДЕРУ КАРТОК ===
function renderSlides() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlideIndex);
  });

  // оновлюємо цифру поточного слайду
  if (currentEl) currentEl.textContent = currentSlideIndex + 1;
}

// === ПЕРЕХІД МІЖ КАРТКАМИ СТРІЛКАМИ ===
function goSlide(delta) {
  currentSlideIndex = (currentSlideIndex + delta + slides.length) % slides.length;
  renderSlides();
}

// === КЛІКИ ПО МЕНЮ ВСЕРЕДИНІ КАРТКИ ===
slider.addEventListener('click', (e) => {
  const btn = e.target.closest('.slide__menu-item');
  if (!btn) return;

  const slide = btn.closest('.slide');
  if (!slide) return;

  // знімаємо активність з усіх пунктів у цій картці
  slide.querySelectorAll('.slide__menu-item').forEach(el => el.classList.remove('is-active'));
  btn.classList.add('is-active');

  const targetIndex = Number(btn.dataset.go);
  const contents = slide.querySelectorAll('.slide__content');

  // показуємо лише потрібний контент усередині цієї картки
  contents.forEach((content, i) => {
    content.style.display = (i === targetIndex) ? 'flex' : 'none';
  });
});

// === ОБРОБНИКИ КНОПОК ===
prevBtn.addEventListener('click', () => goSlide(-1));
nextBtn.addEventListener('click', () => goSlide(1));

// === ІНІЦІАЛІЗАЦІЯ ===
renderSlides();
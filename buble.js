const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0;

const canvas = document.getElementById('bubbleCanvas');
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;

const render = Render.create({
  canvas,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: 'transparent',
    pixelRatio: window.devicePixelRatio,
  },
});

// 🔹 Повністю вимикаємо будь-які рамки
render.context.strokeStyle = 'transparent';
render.options.showBounds = false;
render.options.showDebug = false;
render.options.wireframes = false;

Render.run(render);
Runner.run(Runner.create(), engine);

// 🔸 Дані для бульбашок
const labels = [
  { text: 'Рітейл', color: '#FFC20E' },
  { text: 'Логістика', color: '#2F2B63' },
  { text: 'Маркетинг', color: '#2F2B63' },
  { text: 'Туризм', color: '#FFC20E' },
  { text: 'HoReCa', color: '#2F2B63' },
  { text: 'Фінанси', color: '#2F2B63' },
  { text: 'iGaming', color: '#FFC20E' },
  { text: 'IT', color: '#2F2B63' },
  { text: 'E-commerce', color: '#2F2B63' },
  { text: 'Транспорт', color: '#FFC20E' },
];

// 🔹 Створюємо бульбашки з ефектом скла
const bubbles = labels.map((item) => {
  const radius = Math.random() * 30 + 115; //збільшує бульбашку
  const bubble = Bodies.circle(Math.random() * width, Math.random() * height, radius, {
    restitution: 0.9,
    frictionAir: 0.02,
    render: {
      fillStyle: 'rgba(255,255,255,0.75)',//мутність бульбашки
      strokeStyle: 'transparent',
      lineWidth: 0
    },
    label: item.text
  });
  bubble.customColor = item.color;
  return bubble;
});

Composite.add(world, bubbles);

// 🔹 Невидимі межі
const borders = [
  Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true, render: { visible: false } }),
];
Composite.add(world, borders);

// 🔸 Керування мишкою
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2, render: { visible: false } }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// ✅ Додаємо обробку, щоб скрол не блокувався
render.canvas.addEventListener('wheel', (e) => {
  e.stopPropagation();
}, { passive: true });

render.canvas.addEventListener('touchmove', (e) => {
  if (e.targetTouches.length > 1) return;
  e.stopPropagation();
}, { passive: true });

// 🔹 Малюємо текст після рендеру
Events.on(render, 'afterRender', function() {
  const ctx = render.context;
  ctx.save();
  ctx.font = '700 30px "Crimson Pro"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255,255,255,0.3)';
  ctx.shadowBlur = 5;

  bubbles.forEach(b => {
    ctx.fillStyle = b.customColor;
    ctx.fillText(b.label, b.position.x, b.position.y);
  });
  ctx.restore();
});
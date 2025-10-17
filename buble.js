// === М’які інтерактивні “liquid glass” бульбашки ===
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

// 1. Створюємо фізичний світ
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0; // без падіння вниз

// 2. Отримуємо canvas
const canvas = document.getElementById('bubbleCanvas');
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;

// 3. Створюємо рендер
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: 'transparent',
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// 4. Масив назв бульбашок
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

// 5. Створюємо круглі бульбашки
const bubbles = labels.map((item, i) => {
  const radius = Math.random() * 40 + 70;
  const bubble = Bodies.circle(
    Math.random() * width,
    Math.random() * height,
    radius,
    {
      restitution: 0.9, // відскакують
      frictionAir: 0.02,
      render: {
        fillStyle: 'rgba(255,255,255,0.25)',
        strokeStyle: 'rgba(255,255,255,0.5)',
        lineWidth: 2,
      },
      label: item.text,
    }
  );
  bubble.customColor = item.color;
  return bubble;
});

Composite.add(world, bubbles);

// 6. Межі (щоб не вилітали)
const borders = [
  Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true }),
  Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true }),
  Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true }),
  Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true }),
];
Composite.add(world, borders);

// 7. Додаємо керування мишкою
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: { stiffness: 0.2, render: { visible: false } },
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// 8. Малюємо текст всередині
(function drawText() {
  const ctx = render.context;
  requestAnimationFrame(drawText);

  ctx.clearRect(0, 0, width, height);
  Render.world(render);

  ctx.font = 'bold 22px "Crimson Pro"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  bubbles.forEach(b => {
    ctx.fillStyle = b.customColor;
    ctx.fillText(b.label, b.position.x, b.position.y);
  });
})();
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0;

const canvas = document.getElementById("bubbleCanvas");
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;

const render = Render.create({
  canvas,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: "transparent",
    pixelRatio: window.devicePixelRatio,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

const labels = [
  { text: "Рітейл", color: "#FFC20E" },
  { text: "Логістика", color: "#2F2B63" },
  { text: "Маркетинг", color: "#2F2B63" },
  { text: "Туризм", color: "#FFC20E" },
  { text: "HoReCa", color: "#2F2B63" },
  { text: "Фінанси", color: "#2F2B63" },
  { text: "iGaming", color: "#FFC20E" }, // 👈 це буде центральна
  { text: "IT", color: "#2F2B63" },
  { text: "E-commerce", color: "#2F2B63" },
  { text: "Транспорт", color: "#FFC20E" },
];

// === Бульбашки ===
const bubbles = labels.map((item, i) => {
  const radius = Math.random() * 30 + 80;
  const solidColor = item.color === "#FFC20E" ? "#2F2B63" : "#FFC20E";

  let targetX, targetY;

  // 🔸 Центрова бульбашка (iGaming)
  if (item.text === "iGaming") {
    targetX = width / 2;
    targetY = height / 2;
  } else {
    // 🔹 Інші — по колу навколо центру
    const angle = (i / labels.length) * Math.PI * 2;
    targetX = width / 2 + Math.cos(angle) * 300;
    targetY = height / 2 + Math.sin(angle) * 200;
  }

  const bubble = Bodies.circle(
    Math.random() * width,
    Math.random() * height,
    radius,
    {
      restitution: 0.8,
      frictionAir: 0.05,
      render: {
        fillStyle: solidColor,
        strokeStyle: "rgba(255,255,255,0.25)",
        lineWidth: 2,
      },
      label: item.text,
    }
  );

  bubble.customColor = item.color;
  bubble.solidColor = solidColor;
  bubble.target = { x: targetX, y: targetY };
  return bubble;
});

Composite.add(world, bubbles);

// === Межі ===
const borders = [
  Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true, render: { visible: false } }),
  Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true, render: { visible: false } }),
];
Composite.add(world, borders);

// === Мишка ===
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2, render: { visible: false } },
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// === Малювання МАТОВИХ бульбашок ===
Events.on(render, "afterRender", function () {
  const ctx = render.context;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  bubbles.forEach((b) => {
    const x = b.position.x;
    const y = b.position.y;
    const r = b.circleRadius;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = b.solidColor;
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.font = `700 ${r / 3}px "Crimson Pro"`;
    ctx.fillStyle = b.customColor;
    ctx.fillText(b.label, x, y);
  });

  ctx.restore();
});

// === 💫 Притягуємо кожну до своєї точки ===
setInterval(() => {
  bubbles.forEach((b) => {
    const dx = b.target.x - b.position.x;
    const dy = b.target.y - b.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force =
      b.label === "iGaming" ? 0.000009 * distance : 0.000003 * distance; // 👈 центр сильніше тримається

    Body.applyForce(b, b.position, {
      x: dx * force,
      y: dy * force,
    });
  });
}, 60);
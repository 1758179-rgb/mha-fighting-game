const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ui = {
  p1Health: document.getElementById('p1-health'),
  p2Health: document.getElementById('p2-health'),
  p1Mode: document.getElementById('p1-mode'),
  p1Quirks: document.getElementById('p1-quirks'),
  p2Power: document.getElementById('p2-power'),
  p2Vestiges: document.getElementById('p2-vestiges'),
  status: document.getElementById('status')
};

const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

const keys = {};
const effects = [];
let started = false;

const p1 = new AllForOne(180, 420);
const p2 = new OneForAll(940, 420);

function resetBattle() {
  p1.health = 100;
  p1.maxHealth = 100;
  p1.mode = 'Normal';
  p1.speed = 5;
  p1.x = 180;
  p1.y = 420;

  p2.health = 100;
  p2.maxHealth = 100;
  p2.power = 100;
  p2.x = 940;
  p2.y = 420;

  ui.status.textContent = 'FIGHT!';
  updateHud();
}

function spawnEffect(x, y, color, radius = 20, type = 'burst') {
  effects.push({ x, y, color, radius, type, life: 28 });
}

function updateHud() {
  ui.p1Health.style.width = `${(p1.health / p1.maxHealth) * 100}%`;
  ui.p2Health.style.width = `${(p2.health / p2.maxHealth) * 100}%`;
  ui.p1Mode.textContent = p1.mode;
  ui.p1Quirks.textContent = p1.quirkCount;
  ui.p2Power.textContent = `${p2.power}%`;
  ui.p2Vestiges.textContent = p2.vestiges.length;
}

function handleInput() {
  if (!started) return;

  if (keys['a']) p1.x = Math.max(40, p1.x - p1.speed);
  if (keys['d']) p1.x = Math.min(canvas.width / 2 - 120, p1.x + p1.speed);
  if (keys['w']) p1.y = Math.max(260, p1.y - 8);
  if (keys['s']) p1.y = Math.min(470, p1.y + 8);

  if (keys['ArrowLeft']) p2.x = Math.max(canvas.width / 2 + 50, p2.x - p2.speed);
  if (keys['ArrowRight']) p2.x = Math.min(canvas.width - 120, p2.x + p2.speed);
  if (keys['ArrowUp']) p2.y = Math.max(260, p2.y - 8);
  if (keys['ArrowDown']) p2.y = Math.min(470, p2.y + 8);

  if (keys['e']) {
    p2.health = Math.max(0, p2.health - 15);
    p1.mode = 'Air Blast';
    ui.status.textContent = 'AIR BLAST!';
    spawnEffect(p1.x + 90, p1.y + 50, '#7dd3fc', 30, 'burst');
  }

  if (keys['r']) {
    p2.health = Math.max(0, p2.health - 18);
    p1.mode = 'Super Strength';
    ui.status.textContent = 'SUPER STRENGTH!';
    spawnEffect(p1.x + 90, p1.y + 50, '#f97316', 28, 'burst');
  }

  if (keys['t']) {
    p1.speed = 8;
    p1.mode = 'Super Speed';
    ui.status.textContent = 'SUPER SPEED!';
    spawnEffect(p1.x + 80, p1.y + 50, '#a78bfa', 20, 'burst');
  } else {
    p1.speed = 5;
  }

  if (keys['y']) {
    p1.takeOverMode();
    p2.health = Math.max(0, p2.health - 25);
    p1.mode = 'Take Over';
    ui.status.textContent = 'TAKE OVER MODE!';
    spawnEffect(p1.x + 90, p1.y + 50, '#c084fc', 40, 'burst');
  }

  if (keys['q']) {
    ui.status.textContent = 'QUIRK STORAGE: ' + p1.quirkStorage.slice(0, 10).join(', ');
  }

  if (keys['1']) { p2.health = Math.max(0, p2.health - 12); ui.status.textContent = 'ONE FOR ALL SMASH'; }
  if (keys['2']) { p2.health = Math.max(0, p2.health - 14); ui.status.textContent = 'AIR BURST'; }
  if (keys['3']) { p2.health = Math.max(0, p2.health - 17); ui.status.textContent = 'VESTIGE BREAKER'; }
  if (keys['4']) { p2.health = Math.max(0, p2.health - 19); ui.status.textContent = 'LIGHTNING RUSH'; }
  if (keys['5']) { p2.health = Math.max(0, p2.health - 22); ui.status.textContent = 'SPIRITUAL BURST'; }

  if (keys['u']) {
    ui.status.textContent = p2.spiritualAdvice();
  }

  if (keys['i']) {
    const damage = p2.vestigeCombo(p1);
    ui.status.textContent = `VESTIGE COMBO! ${damage} damage`;
    spawnEffect(p2.x - 40, p2.y + 50, '#00f5d4', 32, 'burst');
  }
}

function drawArena() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#0f172a');
  sky.addColorStop(0.5, '#12283d');
  sky.addColorStop(1, '#1f334b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const arenaCenterX = canvas.width / 2;
  const arenaCenterY = 300;
  const outerR = 270;
  const innerR = 170;

  ctx.fillStyle = '#2ca54c';
  ctx.beginPath();
  ctx.arc(arenaCenterX, arenaCenterY, innerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5a4f9f';
  ctx.beginPath();
  ctx.arc(arenaCenterX, arenaCenterY, outerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2c2c2c';
  for (let i = 0; i < 52; i++) {
    const angle = (Math.PI * 2 * i) / 52;
    const r = outerR - 20;
    const sx = arenaCenterX + Math.cos(angle) * r;
    const sy = arenaCenterY + Math.sin(angle) * r;
    const ex = arenaCenterX + Math.cos(angle) * (outerR + 34);
    const ey = arenaCenterY + Math.sin(angle) * (outerR + 34);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.fillStyle = '#2d2d2d';
  ctx.beginPath();
  ctx.arc(arenaCenterX, arenaCenterY, outerR + 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22313f';
  ctx.fillRect(0, 500, canvas.width, 120);

  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(canvas.width, 500);
  ctx.stroke();

  ctx.fillStyle = '#0b1220';
  ctx.beginPath();
  ctx.arc(arenaCenterX, arenaCenterY, innerR - 22, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 200; i++) {
    const angle = (Math.PI * 2 * i) / 200;
    const dist = 160 + (i % 3) * 16;
    const x = arenaCenterX + Math.cos(angle) * dist;
    const y = arenaCenterY + Math.sin(angle) * dist;
    ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#f59e0b';
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  }
}

function drawCharacter(ch, accent, faceColor = '#f4d29d') {
  ctx.save();
  ctx.translate(ch.x, ch.y);

  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(-10, 0, ch.w + 20, ch.h + 20);

  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.arc(ch.w / 2, 30, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = ch.color;
  ctx.fillRect(ch.w * 0.28, 52, ch.w * 0.44, 52);

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(ch.w * 0.25, 58);
  ctx.lineTo(0, 100);
  ctx.lineTo(5, ch.h);
  ctx.lineTo(ch.w * 0.35, ch.h);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(ch.w * 0.75, 58);
  ctx.lineTo(ch.w, 100);
  ctx.lineTo(ch.w - 5, ch.h);
  ctx.lineTo(ch.w * 0.65, ch.h);
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.fillRect(ch.w * 0.38, 23, 8, 8);
  ctx.fillRect(ch.w * 0.54, 23, 8, 8);

  ctx.restore();
}

function drawEffects() {
  const arr = effects.slice();
  for (let i = arr.length - 1; i >= 0; i--) {
    const e = arr[i];
    e.life -= 1;
    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.globalAlpha = Math.max(0, e.life / 28);
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    if (e.life <= 0) effects.splice(effects.indexOf(e), 1);
  }
  ctx.globalAlpha = 1;
}

function loop() {
  handleInput();
  drawArena();
  if (started) {
    drawCharacter(p1, '#a855f7', '#f5d0fe');
    drawCharacter(p2, '#34d399', '#d1fae5');
    drawEffects();

    if (p1.health <= 0) {
      ui.status.textContent = 'ONE FOR ALL WINS!';
      started = false;
      menu.classList.remove('hidden');
    }
    if (p2.health <= 0) {
      ui.status.textContent = 'ALL FOR ONE WINS!';
      started = false;
      menu.classList.remove('hidden');
    }
  }

  updateHud();
  requestAnimationFrame(loop);
}

function startGame() {
  started = true;
  resetBattle();
  menu.classList.add('hidden');
}

function showMenu() {
  started = false;
  menu.classList.remove('hidden');
  resetBattle();
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', showMenu);

document.addEventListener('keydown', (e) => {
  if (!started && e.key === 'Enter') {
    startGame();
    return;
  }
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

updateHud();
loop();

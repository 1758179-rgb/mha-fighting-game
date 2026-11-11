const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ui = {
  p1Health: document.getElementById('p1-health'),
  p2Health: document.getElementById('p2-health'),
  p1Mode: document.getElementById('p1-mode'),
  p1Quirks: document.getElementById('p1-quirks'),
  p2Power: document.getElementById('p2-power'),
  p2Vestiges: document.getElementById('p2-vestiges'),
  status: document.getElementById('status'),
  p1HealthText: document.getElementById('p1-health-text'),
  p2HealthText: document.getElementById('p2-health-text')
};

const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

const keys = {};
const effects = [];
let started = false;

const p1 = new AllForOne(180, 420);
const p2 = new OneForAll(940, 420);

function setStatus(message) {
  ui.status.textContent = message;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetBattle() {
  p1.health = 100;
  p1.maxHealth = 100;
  p1.mode = 'Normal';
  p1.speed = 5;
  p1.x = 180;
  p1.y = 420;
  p1.spriteSheet = new SpriteSheet('allforone');

  p2.health = 100;
  p2.maxHealth = 100;
  p2.power = 100;
  p2.x = 940;
  p2.y = 420;
  p2.spriteSheet = new SpriteSheet('oneforall');

  setStatus('FIGHT!');
  updateHud();
}

function spawnEffect(x, y, color, radius = 20, type = 'burst') {
  effects.push({ x, y, color, radius, type, life: 28, maxLife: 28 });
}

function updateHud() {
  ui.p1Health.style.width = `${clamp((p1.health / p1.maxHealth) * 100, 0, 100)}%`;
  ui.p2Health.style.width = `${clamp((p2.health / p2.maxHealth) * 100, 0, 100)}%`;

  ui.p1Mode.textContent = p1.mode;
  ui.p1Quirks.textContent = p1.quirkCount;
  ui.p2Power.textContent = `${p2.power}%`;
  ui.p2Vestiges.textContent = p2.vestiges.length;

  ui.p1HealthText.textContent = `${Math.round(p1.health)}`;
  ui.p2HealthText.textContent = `${Math.round(p2.health)}`;
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
    p1.attack(p2, 15, '#7dd3fc');
    p1.mode = 'Air Blast';
    setStatus('AIR BLAST!');
  }
  if (keys['r']) {
    p1.attack(p2, 18, '#f97316');
    p1.mode = 'Super Strength';
    setStatus('SUPER STRENGTH!');
  }
  if (keys['t']) {
    p1.speed = 8;
    p1.mode = 'Super Speed';
    setStatus('SUPER SPEED!');
    spawnEffect(p1.x + 80, p1.y + 50, '#a78bfa', 20, 'burst');
  } else {
    p1.speed = 5;
  }
  if (keys['y']) {
    p1.takeOverMode();
    p2.health = Math.max(0, p2.health - 25);
    p1.mode = 'Take Over';
    setStatus('TAKE OVER MODE!');
    spawnEffect(p1.x + 90, p1.y + 50, '#c084fc', 40, 'burst');
  }
  if (keys['q']) {
    setStatus('QUIRK STORAGE: ' + p1.quirkStorage.slice(0, 10).join(', '));
  }
  if (keys['1']) { p2.attack(p1, 12, '#7ef9a9'); setStatus('ONE FOR ALL SMASH'); }
  if (keys['2']) { p2.attack(p1, 14, '#00f5d4'); setStatus('AIR BURST'); }
  if (keys['3']) { p2.attack(p1, 17, '#90f1ef'); setStatus('VESTIGE BREAKER'); }
  if (keys['4']) { p2.attack(p1, 19, '#60a5fa'); setStatus('LIGHTNING RUSH'); }
  if (keys['5']) { p2.attack(p1, 22, '#7ef9a9'); setStatus('SPIRITUAL BURST'); }
  if (keys['u']) setStatus(p2.spiritualAdvice());
  if (keys['i']) {
    const damage = p2.vestigeCombo(p1);
    setStatus(`VESTIGE COMBO! ${Math.round(damage)} damage`);
    spawnEffect(p2.x - 40, p2.y + 50, '#00f5d4', 32, 'burst');
  }
}

function drawArena() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#081421');
  sky.addColorStop(0.5, '#11314e');
  sky.addColorStop(1, '#1b3d5d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = 290;
  const outerRing = 260;
  const innerRing = 170;

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRing + 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5d4bc1';
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRing, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f1d2b';
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRing, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22313f';
  ctx.fillRect(0, 500, canvas.width, 120);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 80; i++) {
    const angle = (Math.PI * 2 * i) / 80;
    const r = outerRing - 12;
    const sx = centerX + Math.cos(angle) * r;
    const sy = centerY + Math.sin(angle) * r;
    const ex = centerX + Math.cos(angle) * (outerRing + 32);
    const ey = centerY + Math.sin(angle) * (outerRing + 32);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (let i = 0; i < 180; i++) {
    const angle = (Math.PI * 2 * i) / 180;
    const dist = 150 + (i % 5) * 12;
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;
    ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#fcae4e';
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(canvas.width, 500);
  ctx.stroke();

  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(0, 0, canvas.width, 100);
}

function drawCharacter(ch, isFacingRight = true) {
  ctx.save();
  ctx.translate(ch.x, ch.y);

  if (!isFacingRight) {
    ctx.scale(-1, 1);
    ctx.translate(-ch.w, 0);
  }

  ctx.fillStyle = ch.glow;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(ch.w / 2, ch.h / 2, ch.w / 1.6, 0, Math.PI * 2);
  ctx.fill();

  const frame = ch.spriteSheet.getCurrentFrame();
  if (frame) {
    ctx.fillStyle = ch.color;
    ctx.globalAlpha = 0.95;
    ctx.fillRect(5, 10, ch.w - 10, ch.h - 20);
  }

  ctx.fillStyle = '#f4d29d';
  ctx.beginPath();
  ctx.arc(ch.w / 2, 24, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.fillRect(ch.w * 0.34, 19, 6, 6);
  ctx.fillRect(ch.w * 0.6, 19, 6, 6);

  ctx.restore();
}

function drawEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    e.life -= 1;

    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.globalAlpha = Math.max(0, e.life / e.maxLife);
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();

    if (e.life <= 0) effects.splice(i, 1);
  }
  ctx.globalAlpha = 1;
}

function loop() {
  handleInput();
  drawArena();

  if (started) {
    p1.updateAnimation();
    p2.updateAnimation();

    drawCharacter(p1, true);
    drawCharacter(p2, false);
    drawEffects();

    if (p1.health <= 0) {
      setStatus('ONE FOR ALL WINS!');
      started = false;
      menu.classList.remove('hidden');
    }
    if (p2.health <= 0) {
      setStatus('ALL FOR ONE WINS!');
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

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ui = {
  p1Health: document.getElementById('player1Health'),
  p2Health: document.getElementById('player2Health'),
  p1Mode: document.getElementById('mode1'),
  p1Quirks: document.getElementById('quirksCount1'),
  p2Power: document.getElementById('ofa-power'),
  p2Vestiges: document.getElementById('vestiges'),
  status: document.getElementById('statusText')
};

const keys = {};
const effects = [];

const p1 = new AllForOne(180, 420);
const p2 = new OneForAll(940, 420);

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
  if (keys['a']) p1.x = Math.max(40, p1.x - p1.speed);
  if (keys['d']) p1.x = Math.min(canvas.width / 2 - 120, p1.x + p1.speed);
  if (keys['w']) p1.y = Math.max(260, p1.y - 8);
  if (keys['s']) p1.y = Math.min(470, p1.y + 8);

  if (keys['ArrowLeft']) p2.x = Math.max(canvas.width / 2 + 50, p2.x - p2.speed);
  if (keys['ArrowRight']) p2.x = Math.min(canvas.width - 120, p2.x + p2.speed);
  if (keys['ArrowUp']) p2.y = Math.max(260, p2.y - 8);
  if (keys['ArrowDown']) p2.y = Math.min(470, p2.y + 8);

  if (keys['e']) {
    p1.useQuirk('airblast');
    p2.health = Math.max(0, p2.health - 15);
    ui.status.textContent = 'AIR BLAST!';
    spawnEffect(p1.x + 90, p1.y + 50, '#7dd3fc', 30, 'burst');
  }

  if (keys['r']) {
    p1.useQuirk('strength');
    p2.health = Math.max(0, p2.health - 18);
    ui.status.textContent = 'SUPER STRENGTH!';
    spawnEffect(p1.x + 90, p1.y + 50, '#f97316', 28, 'burst');
  }

  if (keys['t']) {
    p1.useQuirk('speed');
    p1.speed = 8;
    ui.status.textContent = 'SUPER SPEED!';
    spawnEffect(p1.x + 80, p1.y + 50, '#a78bfa', 20, 'burst');
  } else {
    p1.speed = 5;
  }

  if (keys['y']) {
    p1.takeOverMode();
    p2.health = Math.max(0, p2.health - 25);
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
  sky.addColorStop(1, '#1b2a3b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 500, canvas.width, 120);

  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1a2d44' : '#20344a';
    ctx.fillRect(i * 60, 500, 50, 120);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect((i * 31) % canvas.width, (i * 17) % 250, 2, 2);
  }
}

function drawCharacter(ch, accent) {
  ctx.save();
  ctx.translate(ch.x, ch.y);

  // glow
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(-10, 0, ch.w + 20, ch.h + 20);

  // face
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f4d29d';
  ctx.beginPath();
  ctx.arc(ch.w / 2, 30, 18, 0, Math.PI * 2);
  ctx.fill();

  // body
  ctx.fillStyle = ch.color;
  ctx.fillRect(ch.w * 0.28, 52, ch.w * 0.44, 52);

  // cape / energy trail
  ctx.fillStyle = ch.name === 'All For One' ? '#7c3aed' : '#10b981';
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

  // eyes
  ctx.fillStyle = '#111827';
  ctx.fillRect(ch.w * 0.38, 23, 8, 8);
  ctx.fillRect(ch.w * 0.54, 23, 8, 8);

  ctx.restore();
}

function drawEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    e.radius += 2;
    e.life -= 1;

    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.globalAlpha = Math.max(0, e.life / 28);
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();

    if (e.life <= 0) effects.splice(i, 1);
  }

  ctx.globalAlpha = 1;
}

function loop() {
  handleInput();
  drawArena();
  drawCharacter(p1, '#c084fc');
  drawCharacter(p2, '#34d399');
  drawEffects();

  if (p1.health <= 0) {
    ui.status.textContent = 'ONE FOR ALL WINS!';
  }
  if (p2.health <= 0) {
    ui.status.textContent = 'ALL FOR ONE WINS!';
  }

  updateHud();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

updateHud();
loop();

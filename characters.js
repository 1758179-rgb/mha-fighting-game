class Vestige {
  constructor(name, bonus) {
    this.name = name;
    this.bonus = bonus;
  }
}

class CharacterBase {
  constructor(name, x, y, color, glow) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 120;
    this.color = color;
    this.glow = glow;
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 5;
    this.spriteSheet = new SpriteSheet(name === 'All For One' ? 'allforone' : 'oneforall');
  }

  attack(target, amount, effectColor = '#ffffff') {
    target.health = Math.max(0, target.health - amount);
    this.spriteSheet.playAttack();
    spawnEffect(target.x + target.w / 2, target.y + target.h / 2, effectColor, 24, 'burst');
    return target.health;
  }

  playSpecialAttack() {
    this.spriteSheet.playSpecial();
  }

  updateAnimation() {
    if (this.spriteSheet.isAnimating) {
      this.spriteSheet.updateAttack();
    } else {
      this.spriteSheet.updateIdle();
    }
  }
}

class AllForOne extends CharacterBase {
  constructor(x, y) {
    super('All For One', x, y, '#7c3aed', '#a855f7');
    this.mode = 'Normal';
    this.quirkStorage = [];
    this.quirkCount = 25;
    for (let i = 0; i < 25; i++) {
      this.quirkStorage.push(QUIRK_KEYS[i % QUIRK_KEYS.length]);
    }
  }

  useQuirk(quirkId) {
    const q = getQuirkData(quirkId);
    this.mode = q.name;
    return q;
  }

  takeOverMode() {
    this.mode = 'Take Over';
    this.playSpecialAttack();
    this.health = Math.min(this.maxHealth, this.health + 15);
    this.quirkCount = 100;
  }
}

class OneForAll extends CharacterBase {
  constructor(x, y) {
    super('One For All', x, y, '#10b981', '#34d399');
    this.power = 100;
    this.vestiges = [
      new Vestige('En', 10),
      new Vestige('Banjo', 12),
      new Vestige('Kaato', 14),
      new Vestige('Hikage', 13),
      new Vestige('Daigoro', 11),
      new Vestige('Nedzu', 9),
      new Vestige('Tomura', 15),
      new Vestige('All Might', 20)
    ];
    this.moves = ['One For All Smash', 'Air Burst', 'Vestige Breaker', 'Lightning Rush', 'Spiritual Burst'];
  }

  spiritualAdvice() {
    const advice = [
      'Your heart is your strongest weapon.',
      'Move with intention, not panic.',
      'The vestiges are not a burden—they are power.',
      'Trust your connection to the user.'
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  }

  vestigeCombo(target) {
    const total = this.vestiges.reduce((sum, v) => sum + v.bonus, 0);
    this.playSpecialAttack();
    target.health = Math.max(0, target.health - (10 + total / 4));
    this.power = Math.min(200, this.power + 5);
    return total;
  }
}

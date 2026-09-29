// Sprite sheet animation system
class SpriteSheet {
  constructor(characterType) {
    this.characterType = characterType;
    this.currentFrame = 0;
    this.frameIndex = 0;
    this.animationSpeed = 6;
    this.isAnimating = false;
  }

  // All For One frames
  static ALLFORONE_IDLE = [
    { x: 0, y: 0, w: 60, h: 80 },
    { x: 65, y: 0, w: 60, h: 80 },
    { x: 130, y: 0, w: 60, h: 80 }
  ];

  // All For One attack frames
  static ALLFORONE_ATTACK = [
    { x: 0, y: 90, w: 70, h: 85 },
    { x: 75, y: 90, w: 70, h: 85 },
    { x: 150, y: 90, w: 75, h: 85 },
    { x: 230, y: 90, w: 70, h: 85 }
  ];

  // All For One special move
  static ALLFORONE_SPECIAL = [
    { x: 0, y: 190, w: 80, h: 90 },
    { x: 90, y: 190, w: 80, h: 90 },
    { x: 180, y: 190, w: 85, h: 95 },
    { x: 275, y: 190, w: 85, h: 95 }
  ];

  // One For All idle frames
  static ONEFORALL_IDLE = [
    { x: 0, y: 0, w: 60, h: 75 },
    { x: 65, y: 0, w: 60, h: 75 },
    { x: 130, y: 0, w: 60, h: 75 }
  ];

  // One For All attack frames
  static ONEFORALL_ATTACK = [
    { x: 0, y: 85, w: 70, h: 80 },
    { x: 75, y: 85, w: 70, h: 80 },
    { x: 150, y: 85, w: 75, h: 85 },
    { x: 230, y: 85, w: 70, h: 85 }
  ];

  // One For All ultimate
  static ONEFORALL_ULTIMATE = [
    { x: 0, y: 185, w: 85, h: 95 },
    { x: 95, y: 185, w: 85, h: 95 },
    { x: 190, y: 185, w: 90, h: 100 },
    { x: 290, y: 185, w: 90, h: 100 },
    { x: 0, y: 305, w: 95, h: 100 }
  ];

  getIdleFrames() {
    return this.characterType === 'allforone' 
      ? SpriteSheet.ALLFORONE_IDLE 
      : SpriteSheet.ONEFORALL_IDLE;
  }

  getAttackFrames() {
    return this.characterType === 'allforone' 
      ? SpriteSheet.ALLFORONE_ATTACK 
      : SpriteSheet.ONEFORALL_ATTACK;
  }

  getSpecialFrames() {
    return this.characterType === 'allforone' 
      ? SpriteSheet.ALLFORONE_SPECIAL 
      : SpriteSheet.ONEFORALL_ULTIMATE;
  }

  updateIdle() {
    this.frameIndex++;
    if (this.frameIndex >= this.animationSpeed) {
      this.frameIndex = 0;
      this.currentFrame = (this.currentFrame + 1) % this.getIdleFrames().length;
    }
  }

  playAttack() {
    this.isAnimating = true;
    this.currentFrame = 0;
    this.frameIndex = 0;
  }

  updateAttack() {
    if (!this.isAnimating) return;
    this.frameIndex++;
    if (this.frameIndex >= this.animationSpeed / 1.5) {
      this.frameIndex = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.getAttackFrames().length) {
        this.isAnimating = false;
        this.currentFrame = 0;
      }
    }
  }

  playSpecial() {
    this.isAnimating = true;
    this.currentFrame = 0;
    this.frameIndex = 0;
  }

  updateSpecial() {
    if (!this.isAnimating) return;
    this.frameIndex++;
    if (this.frameIndex >= this.animationSpeed / 2) {
      this.frameIndex = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.getSpecialFrames().length) {
        this.isAnimating = false;
        this.currentFrame = 0;
      }
    }
  }

  getCurrentFrame() {
    if (this.isAnimating) {
      return this.getAttackFrames()[this.currentFrame];
    }
    return this.getIdleFrames()[this.currentFrame];
  }
}

// Draw sprite-based character
function drawSpriteCharacter(ctx, ch, spriteSheet, isFacingRight = true) {
  const frame = spriteSheet.getCurrentFrame();
  if (!frame) return;

  ctx.save();
  ctx.translate(ch.x, ch.y);

  if (!isFacingRight) {
    ctx.scale(-1, 1);
    ctx.translate(-ch.w, 0);
  }

  // Draw glow effect
  ctx.fillStyle = ch.glow;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(-8, -5, ch.w + 16, ch.h + 20);
  ctx.globalAlpha = 1;

  // Draw character sprite box
  ctx.fillStyle = ch.color;
  ctx.globalAlpha = 0.95;
  ctx.fillRect(0, 0, frame.w, frame.h);
  ctx.globalAlpha = 1;

  ctx.restore();
}

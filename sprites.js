// Sprite System for Drawing Characters and Effects

class Sprite {
    constructor(x, y, width, height, color, type = 'character') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.animationFrame = 0;
        this.scale = 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        switch(this.type) {
            case 'allforone':
                this.drawAllForOne(ctx);
                break;
            case 'oneforall':
                this.drawOneForAll(ctx);
                break;
            case 'airblast':
                this.drawAirBlast(ctx);
                break;
            case 'quirk_storage':
                this.drawQuirkStorage(ctx);
                break;
            case 'energy':
                this.drawEnergy(ctx);
                break;
            default:
                this.drawBasic(ctx);
        }

        ctx.restore();
    }

    drawBasic(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    drawAllForOne(ctx) {
        // Head
        ctx.fillStyle = '#f0e68c';
        ctx.beginPath();
        ctx.arc(this.width / 2, 30, 20, 0, Math.PI * 2);
        ctx.fill();

        // Body - dark suit
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.width / 2 - 20, 50, 40, 50);

        // Purple cape effect
        ctx.fillStyle = '#9370db';
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 20, 60);
        ctx.lineTo(0, 80);
        ctx.lineTo(5, this.height);
        ctx.lineTo(this.width / 2 - 15, this.height - 10);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 + 20, 60);
        ctx.lineTo(this.width, 80);
        ctx.lineTo(this.width - 5, this.height);
        ctx.lineTo(this.width / 2 + 15, this.height - 10);
        ctx.fill();

        // Eyes - glowing red
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.width / 2 - 8, 25, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.width / 2 + 8, 25, 4, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.width / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawOneForAll(ctx) {
        // Head
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.arc(this.width / 2, 30, 20, 0, Math.PI * 2);
        ctx.fill();

        // Body - hero suit (green)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.width / 2 - 18, 50, 36, 50);

        // Red inner suit
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(this.width / 2 - 14, 52, 28, 46);

        // Blonde hair highlight
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.width / 2, 15, 8, 0, Math.PI * 2);
        ctx.fill();

        // Eyes - blue
        ctx.fillStyle = '#0000FF';
        ctx.beginPath();
        ctx.arc(this.width / 2 - 8, 25, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.width / 2 + 8, 25, 4, 0, Math.PI * 2);
        ctx.fill();

        // Green glow
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawAirBlast(ctx) {
        // Spiral air current effect
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(this.width / 2, this.height / 2, 10 + i * 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Center energy
        ctx.fillStyle = 'rgba(150, 220, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawQuirkStorage(ctx) {
        // Purple floating cube with symbols
        ctx.fillStyle = 'rgba(147, 112, 219, 0.8)';
        ctx.fillRect(0, 0, this.width, this.height);

        // Border glow
        ctx.strokeStyle = 'rgba(200, 150, 255, 1)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.width, this.height);

        // Quirk symbols (small circles inside)
        ctx.fillStyle = 'rgba(255, 255, 100, 0.7)';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                ctx.beginPath();
                ctx.arc(10 + i * 10, 10 + j * 10, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawEnergy(ctx) {
        // Glowing energy effect
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.animationFrame++;
        if (this.animationFrame > 30) this.animationFrame = 0;
    }
}

class ParticleEffect {
    constructor(x, y, type = 'spark') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.particles = [];
        this.duration = 0;
        this.maxDuration = 30;
        this.generateParticles();
    }

    generateParticles() {
        const count = this.type === 'explosion' ? 20 : 10;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: this.type === 'spark' ? '#FFD700' : '#FF6347'
            });
        }
    }

    update() {
        this.duration++;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 1 / this.maxDuration;
        });
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    isDone() {
        return this.duration > this.maxDuration;
    }
}
const Player = require('./Player');

class AIPlayer extends Player {
    constructor(id, x, y, name) {
        super(id, x, y, name);
        this.type = 'ai';
        this.targetPosition = null;
        this.moveInterval = 1000; // 1초마다 이동
        this.lastMoveTime = Date.now();
    }

    move() {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveInterval) return;

        // 랜덤 이동
        const angle = Math.random() * Math.PI * 2;
        const newX = this.x + Math.cos(angle) * this.speed;
        const newY = this.y + Math.sin(angle) * this.speed;

        this.x = newX;
        this.y = newY;
        this.lastMoveTime = now;
    }

    setTarget(position) {
        this.targetPosition = position;
    }
}

module.exports = AIPlayer; 
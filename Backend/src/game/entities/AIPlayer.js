const Player = require('./Player');

class AIPlayer extends Player {
    constructor(id, x, y, name) {
        super(id, x, y, name);
        this.type = 'ai';
        this.targetX = x;
        this.targetY = y;
        this.targetUpdateInterval = 3000;  // 3초마다 새로운 목표 지점 설정
        this.lastTargetUpdate = Date.now();
    }

    move() {
        const now = Date.now();
        
        // 새로운 목표 지점 설정
        if (now - this.lastTargetUpdate >= this.targetUpdateInterval) {
            this.targetX = Math.random() * this.mapSize.width;
            this.targetY = Math.random() * this.mapSize.height;
            this.lastTargetUpdate = now;
        }

        // 현재 위치에서 목표 지점까지의 방향 계산
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 목표 지점에 충분히 가까우면 이동 중단
        if (distance < this.speed) {
            return;
        }

        // 정규화된 방향으로 이동
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
    }

    setTarget(position) {
        this.targetX = position.x;
        this.targetY = position.y;
    }
}

module.exports = AIPlayer; 
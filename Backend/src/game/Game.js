const AIPlayer = require('./entities/AIPlayer');

class Game {
    constructor() {
        this.players = new Map();
        this.mapSize = {
            width: 1000,
            height: 1000
        };
        this.isRunning = false;
        this.nextAISpawn = 0;  // 다음 AI 스폰 시간
        this.aiSpawnInterval = 10;  // 10초마다
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    spawnAIPlayer() {
        const id = `AI-${Date.now()}`;
        const x = Math.random() * this.mapSize.width;
        const y = Math.random() * this.mapSize.height;
        const name = `${id}`;

        const aiPlayer = new AIPlayer(id, x, y, name);
        aiPlayer.mapSize = this.mapSize;  // 맵 크기 전달
        this.players.set(id, aiPlayer);
        
        return aiPlayer;
    }

    getAllPlayers() {
        return Array.from(this.players.values());
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    update() {
        const currentTime = Math.floor(Date.now() / 1000);  // 현재 시간(초)
        
        // AI 스폰 체크 (더 간단하게)
        if (currentTime >= this.nextAISpawn) {
            this.spawnAIPlayer();
            this.nextAISpawn = currentTime + this.aiSpawnInterval;
        }

        // AI 플레이어들 업데이트
        this.players.forEach(player => {
            if (player.type === 'ai') {
                player.move();
            }
        });
    }
}

module.exports = Game; 
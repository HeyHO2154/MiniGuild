const AIPlayer = require('./entities/AIPlayer');

class Game {
    constructor() {
        this.players = new Map();
        this.mapSize = {
            width: 1000,
            height: 1000
        };
        this.isRunning = false;
        this.aiSpawnIntervalId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        // this.startAISpawning();
    }

    stop() {
        this.isRunning = false;
        if (this.aiSpawnIntervalId) {
            clearInterval(this.aiSpawnIntervalId);
        }
    }

    startAISpawning() {
        this.aiSpawnIntervalId = setInterval(() => {
            this.spawnAIPlayer();
        }, 10000); // 10초
    }

    spawnAIPlayer() {
        const id = `ai-${Date.now()}`;
        const x = Math.random() * this.mapSize.width;
        const y = Math.random() * this.mapSize.height;
        const name = `AI-${id}`;

        const aiPlayer = new AIPlayer(id, x, y, name);
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
        // AI 플레이어들의 움직임 업데이트
        for (const [id, player] of this.players) {
            if (player instanceof AIPlayer) {
                player.move();
            }
        }
    }
}

module.exports = Game; 
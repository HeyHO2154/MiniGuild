// NetworkManager.js - 웹소켓 통신 처리 담당
const WebSocket = require('ws');
const HumanPlayer = require('./entities/HumanPlayer');

class NetworkManager {
    constructor(game) {
        this.game = game;
        this.server = new WebSocket.Server({ port: 5000 });
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.server.on('connection', (ws) => {
            const playerId = Date.now().toString();
            
            ws.on('message', (message) => {
                const data = JSON.parse(message);
                this.handleMessage(ws, playerId, data);
            });

            ws.on('close', () => {
                this.game.removePlayer(playerId);
                this.broadcastGameState();
            });
        });
    }

    handleMessage(ws, playerId, data) {
        switch(data.type) {
            case 'join':
                const humanPlayer = new HumanPlayer(
                    playerId,
                    Math.random() * this.game.mapSize.width,
                    Math.random() * this.game.mapSize.height,
                    data.nickname
                );
                this.game.players.set(playerId, humanPlayer);

                ws.send(JSON.stringify({
                    type: 'init',
                    id: playerId,
                    mapSize: this.game.mapSize,
                    gameState: {
                        players: this.game.getAllPlayers()
                    }
                }));
                break;

            case 'move':
                const player = this.game.players.get(playerId);
                if (player) {
                    player.move(data);
                }
                break;
        }
    }

    broadcastGameState() {
        const gameStateMessage = {
            type: 'gameState',
            players: this.game.getAllPlayers()
        };
        
        this.server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameStateMessage));
            }
        });
    }

    startBroadcastLoop() {
        // 게임 상태 브로드캐스트 (60fps)
        const TICK_RATE = 60;
        setInterval(() => {
            this.game.update();  // AI 업데이트
            this.broadcastGameState();  // 상태 브로드캐스트
        }, 1000 / TICK_RATE);
    }
}

module.exports = NetworkManager;

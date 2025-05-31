const WebSocket = require('ws');
const Game = require('./game/Game');
const HumanPlayer = require('./game/entities/HumanPlayer');

const server = new WebSocket.Server({ port: 5000 });
const game = new Game();

// 게임 시작
game.start();

// 메인 게임 루프
const TICK_RATE = 60;
setInterval(() => {
    game.update();  // AI 업데이트
    broadcastGameState();  // 상태 브로드캐스트
}, 1000 / TICK_RATE);  // 60fps

// 게임 상태 브로드캐스트 함수
function broadcastGameState() {
    const gameStateMessage = {
        type: 'gameState',
        players: game.getAllPlayers()
    };
    
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameStateMessage));
        }
    });
}

server.on('connection', (ws) => {
    const playerId = Date.now().toString();
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'join':
                // 새로운 HumanPlayer 생성
                const humanPlayer = new HumanPlayer(
                    playerId,
                    Math.random() * game.mapSize.width, // 랜덤 위치 x
                    Math.random() * game.mapSize.height, // 랜덤 위치 y
                    data.nickname
                );
                game.players.set(playerId, humanPlayer);

                // 초기 게임 상태 전송
                ws.send(JSON.stringify({
                    type: 'init',
                    id: playerId,
                    mapSize: game.mapSize,
                    gameState: {
                        players: game.getAllPlayers()
                    }
                }));
                break;

            case 'move':
                const player = game.players.get(data.id);
                if (player) {
                    player.move(data);
                }
                break;
        }
    });

    ws.on('close', () => {
        game.removePlayer(playerId);
        broadcastGameState();  // 플레이어 퇴장 시에도 상태 브로드캐스트
    });
}); 
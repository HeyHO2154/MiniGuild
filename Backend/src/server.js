const WebSocket = require('ws');
const Game = require('./game/Game');
const HumanPlayer = require('./game/entities/HumanPlayer');

const server = new WebSocket.Server({ port: 8080 });
const game = new Game();

// 게임 시작
game.start();

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

// 주기적으로 게임 상태 브로드캐스트
setInterval(broadcastGameState, 1000 / 60);  // 60fps

server.on('connection', (ws) => {
    const playerId = Date.now().toString();
    console.log('플레이어 연결:', playerId);
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'join':
                // 새로운 HumanPlayer 생성
                const humanPlayer = new HumanPlayer(
                    playerId,
                    game.mapSize.width / 2,  // 중앙 x
                    game.mapSize.height / 2, // 중앙 y
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
        console.log('플레이어 연결 종료:', playerId);  // 로그 추가
        broadcastGameState();  // 플레이어 퇴장 시에도 상태 브로드캐스트
    });
}); 
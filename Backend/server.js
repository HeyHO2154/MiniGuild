const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

// 게임 상태 관리
const gameState = {
    players: new Map(),
    mapSize: {
        width: 1000,
        height: 1000
    },
    playerSize: 20,
    moveSpeed: 5
};

function validatePosition(x, y) {
    return {
        x: Math.max(gameState.playerSize, 
           Math.min(gameState.mapSize.width - gameState.playerSize, x)),
        y: Math.max(gameState.playerSize, 
           Math.min(gameState.mapSize.height - gameState.playerSize, y))
    };
}

server.on('connection', (ws) => {
    const playerId = Date.now().toString();
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'join':
                // 새 플레이어 생성 (맵 중앙에서 시작)
                const playerData = {
                    id: playerId,
                    x: gameState.mapSize.width / 2,
                    y: gameState.mapSize.height / 2,
                    name: data.nickname,
                    color: '#ff0000'
                };
                gameState.players.set(playerId, playerData);

                // 초기 게임 상태 전송
                ws.send(JSON.stringify({
                    type: 'init',
                    id: playerId,
                    mapSize: gameState.mapSize,
                    playerSize: gameState.playerSize,
                    moveSpeed: gameState.moveSpeed,
                    gameState: {
                        players: Array.from(gameState.players.values())
                    }
                }));
                break;

            case 'move':
                const player = gameState.players.get(playerId);
                if (player) {
                    // 이동 거리 검증
                    const dx = data.x - player.x;
                    const dy = data.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // 최대 허용 이동 거리 체크
                    if (distance <= gameState.moveSpeed * 1.5) {  // 약간의 여유
                        const validPos = validatePosition(data.x, data.y);
                        player.x = validPos.x;
                        player.y = validPos.y;
                    }
                }
                break;
        }

        // 모든 클라이언트에게 게임 상태 브로드캐스트
        const gameStateMessage = {
            type: 'gameState',
            players: Array.from(gameState.players.values())
        };
        
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameStateMessage));
            }
        });
    });

    ws.on('close', () => {
        gameState.players.delete(playerId);
    });
}); 
export class NetworkManager {
    constructor(handleInit, handleGameState) {
        this.handleInit = handleInit;
        this.handleGameState = handleGameState;
        this.ws = null;
    }

    connect(nickname) {
        this.ws = new WebSocket('ws://localhost:8080');
        
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                type: 'join',
                nickname: nickname
            }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'init':
                    this.playerId = data.id;
                    this.handleInit(data);
                    break;
                    
                case 'gameState':
                    this.handleGameState(data);
                    break;
            }
        };
    }

    sendMove(position) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                id: this.playerId,
                type: 'move',
                x: position.x,
                y: position.y
            }));
        }
    }
} 
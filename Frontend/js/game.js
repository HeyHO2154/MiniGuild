class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 서버에서 받을 값들
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.playerSize = 0;
        this.moveSpeed = 0;
        
        this.camera = {
            x: 0,
            y: 0
        };

        this.players = new Map();
        this.playerId = null;
        
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        this.setupNicknameModal();
        this.setupControls();

        // 화면 리사이즈 처리
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupNicknameModal() {
        const modal = document.getElementById('nicknameModal');
        const input = document.getElementById('nicknameInput');
        const button = document.getElementById('startButton');

        button.onclick = () => {
            const nickname = input.value.trim();
            if (nickname) {
                modal.style.display = 'none';
                this.connectToServer(nickname);
            }
        };
    }

    connectToServer(nickname) {
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
                    this.mapWidth = data.mapSize.width;
                    this.mapHeight = data.mapSize.height;
                    this.playerSize = data.playerSize;
                    this.moveSpeed = data.moveSpeed;
                    this.updatePlayers(data.gameState.players);
                    this.gameLoop();
                    break;
                    
                case 'gameState':
                    this.updatePlayers(data.players);
                    break;
            }
        };
    }

    setupControls() {
        // 키를 누를 때
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': this.movement.up = true; break;
                case 's': this.movement.down = true; break;
                case 'a': this.movement.left = true; break;
                case 'd': this.movement.right = true; break;
            }
        });

        // 키를 뗄 때
        document.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': this.movement.up = false; break;
                case 's': this.movement.down = false; break;
                case 'a': this.movement.left = false; break;
                case 'd': this.movement.right = false; break;
            }
        });
    }

    updatePlayers(playerList) {
        this.players.clear();
        playerList.forEach(player => {
            this.players.set(player.id, player);
        });
    }

    updateCamera() {
        const player = this.players.get(this.playerId);
        if (!player) return;

        // 플레이어를 화면 중앙에 고정
        this.camera.x = player.x - this.canvas.width / 2;
        this.camera.y = player.y - this.canvas.height / 2;
    }

    drawMap() {
        // 맵 배경 (움직일 수 있는 영역)
        this.ctx.fillStyle = '#1a1a1a';  // 어두운 회색
        const mapX = -this.camera.x;
        const mapY = -this.camera.y;
        this.ctx.fillRect(mapX, mapY, this.mapWidth, this.mapHeight);

        // 맵 격자 그리기
        this.ctx.strokeStyle = '#2a2a2a';  // 약간 밝은 회색
        this.ctx.lineWidth = 1;
        
        // 세로선
        for (let x = 0; x <= this.mapWidth; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX + x, mapY);
            this.ctx.lineTo(mapX + x, mapY + this.mapHeight);
            this.ctx.stroke();
        }
        
        // 가로선
        for (let y = 0; y <= this.mapHeight; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX, mapY + y);
            this.ctx.lineTo(mapX + this.mapWidth, mapY + y);
            this.ctx.stroke();
        }

        // 맵 경계선
        this.ctx.strokeStyle = '#3498db';  // 파란색
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(mapX, mapY, this.mapWidth, this.mapHeight);
    }

    drawPlayer(player) {
        const screenX = player.x - this.camera.x;
        const screenY = player.y - this.camera.y;

        // 플레이어 원 그리기
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = player.color;
        this.ctx.fill();
        this.ctx.closePath();

        // 닉네임 그리기
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, screenX, screenY - 30);
    }

    updatePlayerPosition() {
        const player = this.players.get(this.playerId);
        if (!player) return;

        let dx = 0;
        let dy = 0;

        if (this.movement.up) dy -= 1;
        if (this.movement.down) dy += 1;
        if (this.movement.left) dx -= 1;
        if (this.movement.right) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = dx / length;
            dy = dy / length;
        }

        // 새로운 위치 계산 (서버에서 검증됨)
        const newX = player.x + dx * this.moveSpeed;
        const newY = player.y + dy * this.moveSpeed;

        // 서버에 위치 전송
        if (dx !== 0 || dy !== 0) {
            this.ws?.send(JSON.stringify({
                type: 'move',
                x: newX,
                y: newY
            }));
        }
    }

    gameLoop() {
        // 화면 클리어 (검은 배경)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 플레이어 위치 업데이트
        this.updatePlayerPosition();
        
        // 카메라 업데이트
        this.updateCamera();

        // 맵 그리기
        this.drawMap();

        // 모든 플레이어 그리기
        this.players.forEach(player => {
            this.drawPlayer(player);
        });

        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 
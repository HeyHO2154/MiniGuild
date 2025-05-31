export class PlayerController {
    constructor(game) {
        this.game = game;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.moveSpeed = 5;
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': this.movement.up = true; break;
                case 's': this.movement.down = true; break;
                case 'a': this.movement.left = true; break;
                case 'd': this.movement.right = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': this.movement.up = false; break;
                case 's': this.movement.down = false; break;
                case 'a': this.movement.left = false; break;
                case 'd': this.movement.right = false; break;
            }
        });
    }

    update() {
        const player = this.game.players.get(this.game.playerId);
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

        if (dx !== 0 || dy !== 0) {
            // 새로운 위치 계산
            const newX = player.x + dx * this.moveSpeed;
            const newY = player.y + dy * this.moveSpeed;

            // 맵 경계 체크 (플레이어 크기 20 고려)
            const mapSize = this.game.mapSize;
            const boundedX = Math.max(20, Math.min(mapSize.width - 20, newX));
            const boundedY = Math.max(20, Math.min(mapSize.height - 20, newY));

            // 로컬 업데이트
            player.x = boundedX;
            player.y = boundedY;

            // 서버에 전송 (경계 내의 위치만)
            this.game.networkManager.sendMove({
                x: boundedX,
                y: boundedY
            });
        }
    }

    // 위치 전송을 제한하는 메서드 추가
    sendPositionToServer(x, y) {
        if (!this.lastSentTime || Date.now() - this.lastSentTime >= 50) {  // 50ms 마다 전송
            this.game.networkManager.sendMove({
                x: x,
                y: y
            });
            this.lastSentTime = Date.now();
        }
    }
} 
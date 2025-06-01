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
            const myPlayer = this.game.players.get(this.game.playerId);
            if (!myPlayer) return;

            // 새로운 위치 계산
            const newX = myPlayer.x + dx * this.moveSpeed;
            const newY = myPlayer.y + dy * this.moveSpeed;

            // 맵 경계 체크
            if (newX >= 0 && newX <= this.game.mapSize.width &&
                newY >= 0 && newY <= this.game.mapSize.height) {
                // 서버에 새 위치 전송
                this.sendPositionToServer(newX, newY);
            }
        }
    }

    sendPositionToServer(x, y) {
        if (!this.lastSentTime || Date.now() - this.lastSentTime >= 16) {
            this.game.networkManager.sendMove({ x, y });
            this.lastSentTime = Date.now();
        }
    }
} 
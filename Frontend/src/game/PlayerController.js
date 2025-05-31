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
            // 새로운 카메라 위치 계산
            const newCameraX = this.game.camera.x + dx * this.moveSpeed;
            const newCameraY = this.game.camera.y + dy * this.moveSpeed;

            // 플레이어의 새로운 월드 좌표 계산
            const newPlayerX = newCameraX + window.innerWidth / 2;
            const newPlayerY = newCameraY + window.innerHeight / 2;

            // 플레이어가 맵 경계 내에 있는지 확인
            const isValidX = newPlayerX >= 0 && newPlayerX <= this.game.mapSize.width;
            const isValidY = newPlayerY >= 0 && newPlayerY <= this.game.mapSize.height;

            // 유효한 방향으로만 이동
            if (isValidX) this.game.camera.x = newCameraX;
            if (isValidY) this.game.camera.y = newCameraY;

            // 최종 플레이어 위치 계산
            const playerWorldX = this.game.camera.x + window.innerWidth / 2;
            const playerWorldY = this.game.camera.y + window.innerHeight / 2;

            // 서버에 실제 월드 좌표 전송
            this.game.networkManager.sendMove({
                x: playerWorldX,
                y: playerWorldY
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
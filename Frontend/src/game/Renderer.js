export class Renderer {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = camera;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const widthDiff = window.innerWidth - this.canvas.width;
            const heightDiff = window.innerHeight - this.canvas.height;
            
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            this.camera.x -= widthDiff / 2;
            this.camera.y -= heightDiff / 2;
        });
    }

    drawMap(camera, mapSize) {
        if (!mapSize || !mapSize.width || !mapSize.height) return;  // 맵 크기가 없으면 그리지 않음

        // 맵 배경 (움직일 수 있는 영역)
        this.ctx.fillStyle = '#1a1a1a';  // 어두운 회색
        const mapX = -camera.x;
        const mapY = -camera.y;
        this.ctx.fillRect(mapX, mapY, mapSize.width, mapSize.height);

        // 맵 격자 그리기
        this.ctx.strokeStyle = '#2a2a2a';  // 약간 밝은 회색
        this.ctx.lineWidth = 1;
        
        // 세로선
        for (let x = 0; x <= mapSize.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX + x, mapY);
            this.ctx.lineTo(mapX + x, mapY + mapSize.height);
            this.ctx.stroke();
        }
        
        // 가로선
        for (let y = 0; y <= mapSize.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX, mapY + y);
            this.ctx.lineTo(mapX + mapSize.width, mapY + y);
            this.ctx.stroke();
        }

        // 맵 경계선
        this.ctx.strokeStyle = '#3498db';  // 파란색
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(mapX, mapY, mapSize.width, mapSize.height);
    }

    drawPlayer(player, camera) {
        const screenX = player.x - camera.x;
        const screenY = player.y - camera.y;

        // 플레이어 원 그리기
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = player.color || '#ff0000';
        this.ctx.fill();
        this.ctx.closePath();

        // 닉네임 그리기
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, screenX, screenY - 30);
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 
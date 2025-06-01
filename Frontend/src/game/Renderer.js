export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;  // 초기 scale 값은 1
        this.setupCanvas();
        this.setupZoom();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupZoom() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // scale 값 변경 (0.5 ~ 2.0)
            const delta = -e.deltaY * 0.001;
            this.scale = Math.min(Math.max(0.5, this.scale + delta), 2.0);
        });
    }

    drawMap(mapSize, myPlayer) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);

        // 맵의 상대 위치 계산
        const mapX = (0 - myPlayer.x) * this.scale + centerX;
        const mapY = (0 - myPlayer.y) * this.scale + centerY;

        // 맵 그리기
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(mapX / this.scale, mapY / this.scale, mapSize.width, mapSize.height);

        // 격자 그리기
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= mapSize.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX / this.scale + x, mapY / this.scale);
            this.ctx.lineTo(mapX / this.scale + x, mapY / this.scale + mapSize.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= mapSize.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(mapX / this.scale, mapY / this.scale + y);
            this.ctx.lineTo(mapX / this.scale + mapSize.width, mapY / this.scale + y);
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(mapX / this.scale, mapY / this.scale, mapSize.width, mapSize.height);
        
        this.ctx.restore();
    }

    drawPlayer(player, myPlayer) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 플레이어의 상대 위치 계산
        const screenX = (player.x - myPlayer.x) * this.scale + centerX;
        const screenY = (player.y - myPlayer.y) * this.scale + centerY;

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);

        // 플레이어 그리기
        this.ctx.beginPath();
        this.ctx.arc(screenX / this.scale, screenY / this.scale, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = player.color || '#ff0000';
        this.ctx.fill();
        this.ctx.closePath();

        // 닉네임 그리기
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, screenX / this.scale, screenY / this.scale - 30);
        
        this.ctx.restore();
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 
import { NetworkManager } from './NetworkManager.js';
import { Renderer } from './Renderer.js';
import { LoginModal } from '../components/LoginModal.js';
import { PlayerController } from './PlayerController.js';

export class Game {
    constructor() {
        this.camera = { x: 0, y: 0 };
        this.renderer = new Renderer(document.getElementById('gameCanvas'), this.camera);
        this.networkManager = new NetworkManager(
            this.handleInit.bind(this),
            this.handleGameState.bind(this)
        );
        
        this.loginModal = new LoginModal(this.handleLogin.bind(this));
        document.body.appendChild(this.loginModal.element);

        this.players = new Map();
        this.playerId = null;
        this.mapSize = { width: 0, height: 0 };
        
        this.playerController = new PlayerController(this);
    }

    handleInit(data) {
        this.playerId = data.id;
        this.mapSize = data.mapSize;
        
        // 플레이어 초기화
        const myPlayerData = data.gameState.players.find(p => p.id === this.playerId);
        if (myPlayerData) {
            // 카메라 초기 위치 설정
            this.camera.x = myPlayerData.x - window.innerWidth / 2;
            this.camera.y = myPlayerData.y - window.innerHeight / 2;
        }
        
        this.updatePlayers(data.gameState.players);
        this.startGameLoop();
    }

    handleGameState(data) {
        // 다른 플레이어들 정보 업데이트
        this.updatePlayers(data.players);
    }

    handleLogin(nickname) {
        this.networkManager.connect(nickname);
    }

    updatePlayers(playerList) {
        this.players.clear();
        playerList.forEach(player => {
            this.players.set(player.id, player);
        });
    }

    startGameLoop() {
        const gameLoop = () => {
            this.playerController.update();
            this.renderer.clear();
            
            this.renderer.drawMap(this.camera, this.mapSize);
            
            const myPlayer = this.players.get(this.playerId);
            if (myPlayer) {
                myPlayer.x = this.camera.x + window.innerWidth / 2;
                myPlayer.y = this.camera.y + window.innerHeight / 2;
            }
            
            this.players.forEach(player => {
                this.renderer.drawPlayer(player, this.camera);
            });

            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }
} 
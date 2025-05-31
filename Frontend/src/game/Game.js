import { NetworkManager } from './NetworkManager.js';
import { Renderer } from './Renderer.js';
import { LoginModal } from '../components/LoginModal.js';
import { PlayerController } from './PlayerController.js';

export class Game {
    constructor() {
        this.renderer = new Renderer(document.getElementById('gameCanvas'));
        this.networkManager = new NetworkManager(
            this.handleInit.bind(this),
            this.handleGameState.bind(this)
        );
        
        this.loginModal = new LoginModal(this.handleLogin.bind(this));
        document.body.appendChild(this.loginModal.element);

        this.players = new Map();
        this.playerId = null;
        this.camera = { x: 0, y: 0 };
        this.mapSize = { width: 0, height: 0 };
        
        this.playerController = new PlayerController(this);
    }

    handleInit(data) {
        this.playerId = data.id;
        this.mapSize = data.mapSize;
        this.players = new Map();
        this.updatePlayers(data.gameState.players);
        this.startGameLoop();
    }

    handleGameState(data) {
        // 다른 플레이어들 정보 업데이트
        data.players.forEach(playerData => {
            if (playerData.id !== this.playerId) {  // 내 플레이어는 업데이트하지 않음
                this.players.set(playerData.id, playerData);
            }
        });
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
            
            this.players.forEach(player => {
                this.renderer.drawPlayer(player, this.camera);
            });

            const player = this.players.get(this.playerId);
            if (player) {
                this.camera.x = player.x - window.innerWidth / 2;
                this.camera.y = player.y - window.innerHeight / 2;
            }

            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }
} 
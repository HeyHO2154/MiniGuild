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
        this.mapSize = { width: 0, height: 0 };
        
        this.playerController = new PlayerController(this);
    }

    handleInit(data) {
        this.playerId = data.id;
        this.mapSize = data.mapSize;
        this.updatePlayers(data.gameState.players);
        this.startGameLoop();
    }

    handleGameState(data) {
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
            
            const myPlayer = this.players.get(this.playerId);
            if (myPlayer) {
                this.renderer.drawMap(this.mapSize, myPlayer);
                this.players.forEach(player => {
                    this.renderer.drawPlayer(player, myPlayer);
                });
            }

            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }
} 
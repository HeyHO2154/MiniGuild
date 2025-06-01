const Game = require('./game/Game');
const NetworkManager = require('./game/NetworkManager');

const game = new Game();
const networkManager = new NetworkManager(game);

// 게임 시작
game.start();
networkManager.startBroadcastLoop(); 
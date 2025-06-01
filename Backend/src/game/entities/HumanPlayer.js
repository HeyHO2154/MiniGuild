const Player = require('./Player');

class HumanPlayer extends Player {
    constructor(id, x, y, name) {
        super(id, x, y, name);
        this.type = 'human';
        this.color = 'orange';
    }

    move(data) {
        this.x = data.x;
        this.y = data.y;
    }
}

module.exports = HumanPlayer; 
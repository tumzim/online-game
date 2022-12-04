import Phaser from 'phaser';
import scenes from './scenes/scenes';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene:
        scenes,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.start('Game')
    }
}

window.onload = () => {
    window.game = new Game(config);
};

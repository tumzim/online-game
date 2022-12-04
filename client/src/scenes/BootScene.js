import * as Phaser from 'phaser';


export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //load images
        this.loadImages();
    }

    loadImages() {
        this.load.image("ship", 'assets/spaceShips_001.png')
        this.load.image('otherPlayer', 'assets/enemyBlack5.png');
    }

    create() {
     
        this.scene.start('Game')
    }


}


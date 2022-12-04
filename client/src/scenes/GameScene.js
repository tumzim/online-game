import * as Phaser from 'phaser';
import io from 'socket.io-client'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    init() {

    }


    create() {
        this.socket = io("http://localhost:3000");
        this.otherPlayers = this.physics.add.group();

        //only new player sees this
        this.socket.on('currentPlayers', (players) => {
            //console.log("current players: ", players)
            Object.keys(players).forEach((id) => {
                // console.log("************socket", this.socket.id)
                if (players[id].playerId === this.socket.id) {
                    this.addPlayer(players[id])
                } else {
                    this.addOtherPlayers(players[id]);
                }
            })
        })

        //only shown to everyone else in lobby except for the players
        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayers(playerInfo);
        });

        //all players receive 
        this.socket.on('playerDisconnect', (playerId) => {
            //console.log("disconnect", playerId)
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        //displays other info 
        this.socket.on('playerMoved', (playerInfo) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setRotation(playerInfo.rotation);
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.ship) {
            if (this.cursors.left.isDown) {
                this.ship.setAngularVelocity(-150);
            } else if (this.cursors.right.isDown) {
                this.ship.setAngularVelocity(150);
            } else {
                this.ship.setAngularVelocity(0);
            }

            if (this.cursors.up.isDown) {
                this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
            } else {
                this.ship.setAcceleration(0);
            }


            this.physics.world.wrap(this.ship, 5);

            // emit player movement
            var x = this.ship.x;
            var y = this.ship.y;
            var r = this.ship.rotation;
            
            // save old position data
            this.ship.oldPosition = {
                x: this.ship.x,
                y: this.ship.y,
                rotation: this.ship.rotation
            };
            this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
            //console.log("POSITIONS**********", this.ship.oldPosition)
            // if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
            //     console.log("is this being accessed?")
            //     this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
            // }
        }

    }

    addPlayer(playerInfo) {
        this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
        if (playerInfo.team === 'blue') {
            this.ship.setTint(0x0000ff);
        } else {
            this.ship.setTint(0xff0000);
        }
        this.ship.setDrag(100);
        this.ship.setAngularDrag(100);
        this.ship.setMaxVelocity(200);
    }


    addOtherPlayers(playerInfo) {
        const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
        if (playerInfo.team === 'blue') {
            otherPlayer.setTint(0x0000ff);
        } else {
            otherPlayer.setTint(0xff0000);
        }
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers.add(otherPlayer);
        //console.log("other Players", this.otherPlayers)
    }




}


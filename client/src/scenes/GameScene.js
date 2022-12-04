import * as Phaser from 'phaser';
import io from 'socket.io-client'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    init() {
        this.socket = io("http://localhost:3000");
        this.socketEvents();
    }

    socketEvents() {
        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                // console.log("************socket", this.socket.id)
                // console.log('*******playerID', id)
                // console.log(players[id])
                if (players[id].playerId === this.socket.id) {
                    this.addPlayer(players[id])
                } else {
                    this.addOtherPlayers(players[id]);
                }
            })
        })

        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayers(playerInfo);
        });

        this.socket.on('playerDisconnect',  (playerId) => {
            this.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });
    }

    create() {
        //add static group for other players
        this.otherPlayers = this.physics.add.group();
    }

    update() {

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

    }




}


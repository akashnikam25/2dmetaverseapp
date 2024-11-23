import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor(){
        super('Preloader')
    }

    preload(){
        this.load.image('star', 'assets/star.png')
    }

    create(){
        this.scene.start('room');
    }

}
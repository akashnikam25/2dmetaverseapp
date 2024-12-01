import { Scene } from "phaser";
import nancy from '../../assets/nancy.png'

export class Preloader extends Scene {
    constructor(){
        super('Preloader')
    }

    preload(){
        this.load.spritesheet('nancy', nancy, {frameWidth: 32, frameHeight: 48})
    }

    create(){
        this.scene.start('Room');
    }

}
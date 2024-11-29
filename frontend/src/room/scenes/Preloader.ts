import { Scene } from "phaser";
import star from '../../assets/star.png'

export class Preloader extends Scene {
    constructor(){
        super('Preloader')
    }

    preload(){
        this.load.image('star', star)
    }

    create(){
        this.scene.start('Room');
    }

}
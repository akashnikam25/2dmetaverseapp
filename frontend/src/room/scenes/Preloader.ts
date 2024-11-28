import { Scene } from "phaser";
import star from './star.png'

export class Preloader extends Scene {
    constructor(){
        super('Preloader')
    }

    // init(){
    //     this.add.image(512, 384, 'background');
    //     this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    // }

    preload(){
        this.load.image('star', star)
    }


    create(){
        this.scene.start('Room');
    }

}
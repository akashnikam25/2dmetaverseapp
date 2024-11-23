import { GameObjects, Scene } from "phaser";

export class Room extends Scene {

    background!: GameObjects.Image;

    constructor(){
        super('Room')
    }

    create(){
        this.background = this.add.image(512, 384, 'background')
    }

}
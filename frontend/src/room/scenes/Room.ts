import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Room extends Scene {
    public handleMoveSprite?: (x: number, y: number, id: string) => void;
    background!: GameObjects.Image;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    public playerSprite?: GameObjects.Sprite;


    constructor(){
        super('Room')
    }

    create(){
        this.background = this.add.image(512, 384, 'background')     
        this.cursors = this.input.keyboard?.createCursorKeys();
        EventBus.emit('current-scene-ready', this);
    }
    update() {
        if (!this.cursors || !this.playerSprite) return;

        const speed = 5;
        let moved = false;

        let newX = this.playerSprite.x;
        let newY = this.playerSprite.y;

        if (this.cursors.up.isDown && newY > 2) {
            newY -= speed;
            moved = true;
        } else if (this.cursors.down.isDown && (newY+ speed <= 768)&&newY < 768 ) {
            newY += speed;
            moved = true;
        }

        if (this.cursors.left.isDown && newX > 2) {
            newX -= speed;
            moved = true;
        } else if (this.cursors.right.isDown && newX < 1024) {
            newX += speed;
            moved = true;
        }

        if (moved) {
            console.log("x ", newX, " y", newY)
            this.playerSprite.setPosition(newX, newY);
            if (this.handleMoveSprite) {
                this.handleMoveSprite(newX, newY, this.playerSprite.getData("id"));
            }
        }
    }


}
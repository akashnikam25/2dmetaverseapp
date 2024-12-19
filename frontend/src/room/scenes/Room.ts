import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { createAnimation } from "../CreateAnimation";



export class Room extends Scene {
    private background!: GameObjects.Image;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    public playerSprite?: GameObjects.Sprite;
    public sprites:Map<string, {x:number, y:number}>= new Map()
    private graphics!: Phaser.GameObjects.Graphics;
    public handleMoveSprite?: (x: number, y: number, id: string, anims:string) => void;
    
    constructor(){
        super('Room')
    }

    create(){
        this.background = this.add.image(512, 384, 'background')     
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } })
        EventBus.emit('current-scene-ready', this);
        if (this.playerSprite)
        createAnimation(this.playerSprite)
    }

    update() {
        if (!this.cursors || !this.playerSprite) return;
        this.graphics.clear()

        const speed = 5;
        let moved = false;
        const proximityRadius = 50;

        let newX = this.playerSprite.x;
        let newY = this.playerSprite.y;
        let anims = ""

        if (this.cursors.up.isDown && newY > 2) {
            newY -= speed;
            moved = true;
            anims = "nancy_idle_up"
            this.playerSprite.anims.play('nancy_idle_up', true)
        } else if (this.cursors.down.isDown && (newY+ speed <= 768)&&newY < 768 ) {
            newY += speed;
            moved = true;
            anims = "nancy_idle_down"
            this.playerSprite.anims.play('nancy_idle_down', true)
        }

        if (this.cursors.left.isDown && newX > 2) {
            newX -= speed;
            moved = true;
            anims = "nancy_idle_left"
            this.playerSprite.anims.play('nancy_idle_left', true)
            
        } else if (this.cursors.right.isDown && newX < 1024) {
            newX += speed;
            moved = true;
            anims = "nancy_idle_right"
            this.playerSprite.anims.play('nancy_idle_right', true)
        }
        if (moved ) {
            const collision = Array.from(this.sprites.entries()).some(([id, position]) => {
                if (id === this.playerSprite?.getData("id")) return false;
                    return (
                    Phaser.Math.Distance.Between(newX, newY, position.x, position.y) < 30 
                );
            });

       

            if (!collision && this.handleMoveSprite) {
                this.sprites.set(this.playerSprite.getData("id"),{"x":newX, "y":newY})
                this.playerSprite.setPosition(newX, newY);
                this.handleMoveSprite(newX, newY, this.playerSprite.getData("id"), anims);
            }
        }
    }
}
import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";



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

        const animsFrameRate = 15

        this.playerSprite?.anims.create({
            key: 'nancy_idle_right',
            frames: this.playerSprite.anims.generateFrameNames('nancy', {
            start: 0,
            end: 5,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_idle_up',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 6,
            end: 11,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_idle_left',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 12,
            end: 17,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_idle_down',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 18,
            end: 23,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_run_right',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 24,
            end: 29,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_run_up',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 30,
            end: 35,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_run_left',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 36,
            end: 41,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_run_down',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 42,
            end: 47,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_sit_down',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 48,
            end: 48,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_sit_left',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 49,
            end: 49,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_sit_right',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 50,
            end: 50,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        this.playerSprite?.anims.create({
            key: 'nancy_sit_up',
            frames: this.playerSprite?.anims.generateFrameNames('nancy', {
            start: 51,
            end: 51,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })
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
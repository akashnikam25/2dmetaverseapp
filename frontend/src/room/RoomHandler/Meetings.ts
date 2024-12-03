import { GameObjects} from "phaser";

export class Meeting {
    private id:string ;
    private participants:Map<string, GameObjects.Sprite>

    constructor(meetingId:string){
        this.id = meetingId
        this.participants = new Map()
    }

    getMeetingId(){
        return this.id;
    }

    addParticipants(sprite:GameObjects.Sprite){
        const spritId = sprite.getData("id")
        this.participants.set(spritId, sprite)
    }

    removeParticipants(sprite:GameObjects.Sprite){
        const spritId = sprite.getData("id")
        this.participants.delete(spritId)
    }

    hasParticipant(spriteId:string):boolean{
        return this.participants.has(spriteId)
    }
    
    getParticipant():GameObjects.Sprite []{
        return Array.from(this.participants.values())
    }

    isEmpty():boolean{
        return this.participants.size === 0
    }

}


export class Meeting {
    private id:string ;
    private participants:Set<string>

    constructor(meetingId:string){
        this.id = meetingId
        this.participants = new Set()
    }

    getMeetingId(){
        return this.id;
    }

    addParticipants(participantId:string){
        this.participants.add(participantId)
    }

    removeParticipants(participantId:string){
        this.participants.delete(participantId)
    }

    hasParticipant(spriteId:string):boolean{
        return this.participants.has(spriteId)
    }
    
    getParticipant():string[]{
        return Array.from(this.participants.values())
    }

    isEmpty():boolean{
        return this.participants.size === 1
    }

}


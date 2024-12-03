import { GameObjects } from "phaser";
import { Meeting } from "./Meetings";
import { v4 as uuidv4 } from 'uuid';

export class Lobby{
    meetings:Map<string,Meeting>
    participantMeetingMap:Map<string, string>

    constructor(){
        this.meetings = new Map()
        this.participantMeetingMap = new Map()
    }

    createMeeting(participant1:GameObjects.Sprite, participant2:GameObjects.Sprite){
        const meetingId = uuidv4()
        let meeting = new Meeting(meetingId)
        meeting.addParticipants(participant1)
        meeting.addParticipants(participant2)

        this.meetings.set(meetingId,meeting)
        this.participantMeetingMap.set(participant1.getData("id"), meetingId)
        this.participantMeetingMap.set(participant2.getData("id"), meetingId)
    }

    addPlayerToMeeting(sprite: GameObjects.Sprite) {
        const meetingId = this.participantMeetingMap.get(sprite.getData("id"))
        if (meetingId){
            const meeting = this.meetings.get(meetingId)
            if (meeting) {
                meeting.addParticipants(sprite)
                this.participantMeetingMap.set(sprite.getData("id"), meetingId)
            }
        }
       
    }
    removePlayerFromMeeting(sprite: GameObjects.Sprite) {
        const meetingId = this.participantMeetingMap.get(sprite.getData("id"))
        if (meetingId) {
            const meeting = this.meetings.get(meetingId)
            if (meeting) {
                meeting.removeParticipants(sprite)
                if (meeting.isEmpty()) {
                    this.meetings.delete(meetingId)
                }
            }
            this.participantMeetingMap.delete(sprite.getData("id"));
        }
    }

    isParticipantInMeeting(participantId: string): boolean {
        return this.participantMeetingMap.has(participantId);
    }
    
}
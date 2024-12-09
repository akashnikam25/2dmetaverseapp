import { Meeting } from "./Meetings";
import { v4 as uuidv4 } from 'uuid';

export class Lobby{
    private meetings:Map<string,Meeting>
    private participantMeetingMap:Map<string, string>

    constructor(){
        this.meetings = new Map()
        this.participantMeetingMap = new Map()
    }

    createMeeting(participant1:string, participant2:string, meetingId:string):string{
        if (meetingId === ""){
            meetingId = uuidv4()
        }
        let meeting = new Meeting(meetingId)
        meeting.addParticipants(participant1)
        meeting.addParticipants(participant2)

        this.meetings.set(meetingId,meeting)
        this.participantMeetingMap.set(participant1, meetingId)
        this.participantMeetingMap.set(participant2, meetingId)
        console.log("create player ",this.participantMeetingMap)
        return meetingId
    }

    addPlayerToMeeting(existingParticipant:string, participantId:string) {
        const meetingId = this.participantMeetingMap.get(existingParticipant)
        if (meetingId){
            const meeting = this.meetings.get(meetingId)
            console.log("addplayer to meetomg ", meeting)
            if (meeting) {
                meeting.addParticipants(participantId)
                this.participantMeetingMap.set(participantId, meetingId)
            }
        }
        console.log("participantMeetingMap add player ", this.participantMeetingMap)
    }

    removePlayerFromMeeting(participantId:string) {
        const meetingId = this.participantMeetingMap.get(participantId)
    
        if (meetingId) {
            const meeting = this.meetings.get(meetingId)
            if (meeting) {
                meeting.removeParticipants(participantId)
                console.log("Meeting    ", meeting)
                if (meeting.isEmpty()) {
                    console.log("inside empty")
                    this.meetings.delete(meetingId)
                    this.participantMeetingMap.delete(meeting.getParticipant()[0]);
                }
            }
            console.log("participantMeetingMap remove player ", this.participantMeetingMap)
            this.participantMeetingMap.delete(participantId);
        }
    }

    isParticipantInMeeting(participantId: string): boolean {
        return this.participantMeetingMap.has(participantId);
    }

    getMeetingId(participantId: string):string | undefined{
        return this.participantMeetingMap.get(participantId)
    }

    getMeeting(meetingId:string):Meeting | undefined{
        return this.meetings.get(meetingId)
    }

    getAllMeetingParticipant(participantId: string):string[]|undefined{
        if (participantId){
            const meetingId = this.participantMeetingMap.get(participantId)
            if(meetingId){
                const meeting = this.meetings.get(meetingId)
                return meeting?.getParticipant()
            }
        }
        return []
    }
    
}
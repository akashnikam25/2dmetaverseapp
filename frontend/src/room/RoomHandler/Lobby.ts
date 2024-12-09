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
        console.log("getall meeting participant ",meeting.getParticipant())
        console.log("participantmeeting map",this.participantMeetingMap)
        return meetingId
    }

    addPlayerToMeeting(existingParticipant:string, participantId:string) {
        const meetingId = this.participantMeetingMap.get(existingParticipant)
        if (meetingId){
            const meeting = this.meetings.get(meetingId)
            if (meeting) {
                meeting.addParticipants(participantId)
                this.participantMeetingMap.set(participantId, meetingId)
            }
        }
    }

    removePlayerFromMeeting(participantId:string) {
        const meetingId = this.participantMeetingMap.get(participantId)
    
        if (meetingId) {
            const meeting = this.meetings.get(meetingId)
            if (meeting) {
                meeting.removeParticipants(participantId)
                if (meeting.isEmpty()) {
                    console.log("meeting are empty")
                    this.meetings.delete(meetingId)
                    this.participantMeetingMap.delete(meeting.getParticipant()[0]);
                }
            }
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
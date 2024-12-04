import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { IRefPhaserGame, PhaseGame } from "../room/PhaserGame"
import { v4 as uuidv4 } from 'uuid';
import { Room } from "../room/scenes/room";

export function RoomComp(){
 const [socket, setSocket] = useState<WebSocket| null>(null)
 const locator = useLocation()
 const phaserRef = useRef<IRefPhaserGame | null>(null);

  useEffect(()=>{
    if (socket== null){
      const socket = new WebSocket("ws://localhost:8000/publiclobby?name="+locator.state.name)
      socket.onopen = ()=>{
        console.log("wesocket connection eastablised")
      }
      setSocket(socket)
    }
    return()=>{
      socket?.close()
    }
    
  },[socket])

  if (socket != null) {
    socket.onmessage = (event)=>{
      const message = JSON.parse(event.data)
      const sc = phaserRef.current?.scene as Room
      sc.sprites.set(message.id,{"x":message.x, "y":message.y})

      
      if (message.type === "add"){
        const sprite = sc?.add.sprite(message.x, message.y, 'nancy', 20).setData("id", message.id)
        const animsFrameRate = 15
        sprite?.anims.create({
            key: 'nancy_idle_right',
            frames: sprite.anims.generateFrameNames('nancy', {
            start: 0,
            end: 5,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })
        sprite?.anims.create({
            key: 'nancy_idle_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 6,
            end: 11,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_idle_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 12,
            end: 17,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_idle_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 18,
            end: 23,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_run_right',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 24,
            end: 29,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 30,
            end: 35,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 36,
            end: 41,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 42,
            end: 47,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 48,
            end: 48,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 49,
            end: 49,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_right',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 50,
            end: 50,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 51,
            end: 51,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

      }else if (message.type === "remove"){
       sc?.children.each((child)=>{
        if (child instanceof Phaser.GameObjects.Sprite){
          if (child.getData("id") === message.id){
            child.destroy()
          }
        }
       })
      }else if (message.type === "move"){
        sc?.children.each((child)=>{
          if (child instanceof Phaser.GameObjects.Sprite){
            if(child.getData("id") === message.id){
              child.setPosition(message.x, message.y)
              child.anims.play(message.anims, true)
            }else{
              child.anims.stop()
            }
          }
        })
      }else if (message.type === "createMeeting"){
        sc.lobby.createMeeting(message.participant[0], message.participant[1]);
      }else if(message.type === "AddParticipantInMeeting"){
        sc.lobby.addPlayerToMeeting(message.participant[0], message.participant[1])
      }else if (message.type === "RemoveParticipantFromMeeting"){
        sc.lobby.removePlayerFromMeeting(message.participant[0])
      }
    }
  }
  

  function handleAddSprite(x: number, y: number, id:string){
    if (socket){
      const addSprite = JSON.stringify({"type":"add","x":x,"y":y, "id":id})
      socket.send(addSprite)
    }
  }

  function handleMoveSprite(x:number, y:number, id:string, anims:string){
    if(socket){
      const moveSprite = JSON.stringify({"type":"move","x":x,"y":y, "id":id, "anims":anims})
      socket.send(moveSprite)
    }
  }

  function handleMeetingOperation(type:string, allParticipants: string []){
    if (socket){
      const meetingMsg = JSON.stringify({"type":type, allParticipants:allParticipants})
      socket.send(meetingMsg)
    }
  }

  const currentScene = (scene: Phaser.Scene) => {
        if (scene){
          const uuid = uuidv4()
          const x = Phaser.Math.Between(64, scene.scale.width - 64);
          const y = Phaser.Math.Between(64, scene.scale.height - 64);
          const sprite = scene.add.sprite(x, y, 'nancy', 20).setData("id", uuid);
          handleAddSprite(x, y, uuid);

          (scene as Room).handleMoveSprite = handleMoveSprite;
          (scene as Room).handleMeetingOperation = handleMeetingOperation;
          (scene as Room).playerSprite = sprite;
          (scene as Room).sprites.set(uuid, {"x": x, "y":y});
        }
  }

  return (
    <>
      <div className="bg-black-500">
        <PhaseGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </>
  )
}
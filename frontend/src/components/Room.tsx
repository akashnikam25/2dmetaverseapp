import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { IRefPhaserGame, PhaseGame } from "../room/PhaserGame"
import { v4 as uuidv4 } from 'uuid';
import { Room } from "../room/scenes/room";
import { createAnimation } from "../room/CreateAnimation";
import Chat from "./Chat";

type Player  = {
  type: string;
  x: number;
  y: number;
  id: string;
  anims: string;
};

export function RoomComp(){
 const [socket, setSocket] = useState<WebSocket| null>(null)
 const locator = useLocation()
 const phaserRef = useRef<IRefPhaserGame | null>(null);
 const [isChatOpen, setIsChatOpen] = useState(false)
 const [meetingId, setMeetingId] = useState<string>("");

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
      const message = JSON.parse(event.data) ;
      const sc = phaserRef.current?.scene as Room
      sc.sprites.set(message.id,{"x":message.x, "y":message.y})

      if (message.type === "add"){
        const sprite = sc?.add.sprite(message.x, message.y, 'nancy', 20).setData("id", message.id)
        createAnimation(sprite)
        sprite.anims.play(message.anims, true)

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
      }
      else if (message.type === "meeting_update"){
        const playerId = sc.playerSprite?.getData("id")
        const meetingId = message.participants[playerId]
        console.log("meetingId  : ", meetingId)
        setMeetingId(meetingId)
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

  const currentScene = (scene: Phaser.Scene) => {
        if (scene){
          const uuid = uuidv4()
          const x = Phaser.Math.Between(64, scene.scale.width - 64);
          const y = Phaser.Math.Between(64, scene.scale.height - 64);
          const sprite  = scene.add.sprite(x, y, 'nancy', 20)
          sprite.setData("id", uuid)
          handleAddSprite(x, y, uuid);

          (scene as Room).handleMoveSprite = handleMoveSprite;
          (scene as Room).playerSprite = sprite;
          (scene as Room).sprites.set(uuid, {"x": x, "y":y});
        }
  }

  return (
    <>
      <div className="bg-black-500">
        <PhaseGame ref={phaserRef} currentActiveScene={currentScene} />
        <button onClick={()=>{          
          setIsChatOpen(!isChatOpen) 
          } }>Chat</button>
        {isChatOpen ? <Chat meetingId={meetingId}  /> : ""}
      </div>
    </>
  )
}

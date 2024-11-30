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
      console.log("WebSocket Message:", message);
      const sc = phaserRef.current?.scene
      if (message.type === "add"){
        sc?.add.sprite(message.x, message.y, 'star').setData("id", message.id)
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
              
            }
          }
        })
      }
    }
  }
  

  function handleAddSprite(x: number, y: number, id:string){
    if (socket){
      const addSprite = JSON.stringify({"type":"add","x":x,"y":y, "id":id})
      socket.send(addSprite)
    }
  }

  function handleMoveSprite(x:number, y:number, id:string){
    if(socket){
      const moveSprite = JSON.stringify({"type":"move","x":x,"y":y, "id":id})
      socket.send(moveSprite)
    }
  }

  const currentScene = (scene: Phaser.Scene) => {
        if (scene){
          const uuid = uuidv4()
          const x = Phaser.Math.Between(64, scene.scale.width - 64);
          const y = Phaser.Math.Between(64, scene.scale.height - 64);
          const sprite = scene.add.sprite(x, y, 'star').setData("id", uuid);
          handleAddSprite(x, y, uuid);

          (scene as Room).handleMoveSprite = handleMoveSprite;
          (scene as Room).playerSprite = sprite
   
        }
  }

  return (
    <>
      <div>
        <PhaseGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </>
  )
}
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { IRefPhaserGame, PhaseGame } from "../room/PhaserGame"

export function Room(){
 const [socket, setSocket] = useState<WebSocket| null>(null)
 const [sc, setScene] = useState<Phaser.Scene | null>(null)
 const [sprite, setSprite] = useState<Phaser.GameObjects.Sprite| null>(null)
 const locator = useLocation()


  const phaserRef = useRef<IRefPhaserGame | null>(null);

  useEffect(()=>{
    if (socket== null){
      const socket = new WebSocket("ws://localhost:8000/publiclobby?name="+locator.state.name)
      socket.onopen = (e)=>{
        console.log("wesocket connection eastablised")
      }
      setSocket(socket)
    }
    
  },[])

  if (socket != null) {
    socket.onmessage = (event)=>{
      const message = JSON.parse(event.data)
      console.log(message)
      if (message.type === "add"){
        sc?.add.sprite(message.x, message.y, 'star')
      }
      if (message.type === "remove"){
       sc?.children.each((child)=>{
        console.log(child)
        if (child instanceof Phaser.GameObjects.Sprite){
          if (message.x === child.x && message.y=== child.y){
            child.destroy()
          }
        }
       })
      }
    }
  }
  

  function handleAddSprite(x: number, y: number){
    if (socket != null){
      const addSprite = JSON.stringify({"type":"add","x":x,"y":y})
      socket.send(addSprite)
    }
  }

  const currentScene = (scene: Phaser.Scene) => {
        if (scene){
          setScene(scene)
          const x = Phaser.Math.Between(64, scene.scale.width - 64);
          const y = Phaser.Math.Between(64, scene.scale.height - 64);
          scene.add.sprite(x, y, 'star');
          handleAddSprite(x, y)
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
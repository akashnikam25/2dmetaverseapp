import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { IRefPhaserGame, PhaseGame } from "../room/PhaserGame"

export function Room(){
 const [socket, setSocket] = useState<WebSocket| null>(null)
 const [inp, setInp] = useState("")
 const [rsp, setRsp] = useState<string[]>([])
 const locator = useLocation()
  //const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
   // const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

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
    socket.onmessage = (e)=>{
      setRsp((prevRsp)=>[...prevRsp, e.data])
    }
  }
  

  function handlePublicLobby(){
    if (socket != null)
      socket.send(inp)
    setInp("")
  }

  const currentScene = (scene: Phaser.Scene) => {
        // if (scene){
        //   const x = Phaser.Math.Between(64, scene.scale.width - 64);
        //   const y = Phaser.Math.Between(64, scene.scale.height - 64);
        //    scene.add.sprite(x, y, 'star');
        // }
  }

  return (
    <>
      {/* <div className="card">
        <input type="text" placeholder="enter your message" value={inp} onChange={(e)=>{
          setInp(e.target.value) 
        }} />
        <button onClick={handlePublicLobby}>
          Send Message 
        </button>
        <div>
        {rsp.map((message, index) => (
          <div key={index}>
            <span>{message}</span>
          </div>
        ))}
      </div>
      </div> */}

      <div>
        <PhaseGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </>
  )
}
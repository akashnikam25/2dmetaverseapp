import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export function Room(){
 const [socket, setSocket] = useState<WebSocket| null>(null)
 const [inp, setInp] = useState("")
 const [rsp, setRsp] = useState<string[]>([])
 const locator = useLocation()

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

  return (
    <>
      <div className="card">
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
      </div>
    </>
  )
}
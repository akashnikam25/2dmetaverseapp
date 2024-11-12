import { useEffect, useState } from "react"

function App() {

    const [rsp, setRsp] = useState<string>("")
    const [inp, setInp] = useState<string>("")
    const socket = new WebSocket("ws://localhost:8000/publiclobby")
    useEffect(()=>{
      socket.onopen = (e)=>{
        console.log("WebSocket connection opened")
      }
    },[])

    socket.onmessage = (e) =>{
      setRsp(e.data)
    }

   function handlePublicLobby(){
    socket.send(inp)
    setInp("")
  }

  return (
    <>
      <div className="card">
        <input type="text" value={inp} onChange={(e)=>{
          setInp(e.target.value) 
        }} />
        <button onClick={handlePublicLobby}>
          Send Message 
        </button>
        {rsp != ""?<div><span>{rsp}</span></div>:""}
      </div>
    </>
  )
}

export default App

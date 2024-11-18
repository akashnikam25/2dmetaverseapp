import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export function Room(){
    const [rsp, setRsp] = useState<string>("")
    const [inp, setInp] = useState<string>("")
    const [messages, setMessages] = useState<string[]>([]); 
    const location = useLocation()
    
    const socket = new WebSocket("ws://localhost:8000/publiclobby?name="+location.state.name)
    useEffect(()=>{
      socket.onopen = (e)=>{
        console.log("WebSocket connection opened")
      }
      console.log("location state:- ",location.state.name)
    },[])

    socket.onmessage = (e) =>{
      console.log(e.data)
      setRsp(e.data)
    }

   function handlePublicLobby(){
   if (inp.trim() !== "") {
      // Add the new message to the messages array
      socket.send(inp)
      setMessages((prevMessages) => [...prevMessages, inp]);
      setInp(""); // Clear the input field
    }
  }

  return (
    <>
      <div className="card">
        {/* <input type="text" placeholder="enter your name" value={inp} onChange={(e)=>{
          setInp(e.target.value) 
        }} /> */}
        <input type="text" placeholder="enter your message" value={inp} onChange={(e)=>{
          setInp(e.target.value) 
        }} />
        <button onClick={handlePublicLobby}>
          Send Message 
        </button>
        <div>
        {messages.map((message, index) => (
          <div key={index}>
            <span>{message}</span>
          </div>
        ))}
      </div>
      </div>
    </>
  )
}
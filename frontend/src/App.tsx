import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Room } from "./components/Room";
import { LandingPage } from "./components/LandingPage"



// function App() {
//  const [socket, setSocket] = useState<WebSocket| null>(null)
//  const [inp, setInp] = useState("")
//  const [rsp, setRsp] = useState<string[]>([])

//   useEffect(()=>{
//     const socket = new WebSocket("ws://localhost:8000/publiclobby")
//     socket.onopen = (e)=>{
//       console.log("wesocket connection eastablised")
//     }
//     setSocket(socket)
//   },[])

//   if (socket != null) {
//     socket.onmessage = (e)=>{
//       setRsp((prevRsp)=>[...prevRsp, e.data])
//     }
//   }
  

//   function handlePublicLobby(){
//     console.log("hi from handlepublicloby")
//     if (socket != null)
//       socket.send(inp)
//     setInp("")
//   }

//   return (
//     <>
//       <div className="card">
       
//         <input type="text" placeholder="enter your message" value={inp} onChange={(e)=>{
//           setInp(e.target.value) 
//         }} />
//         <button onClick={handlePublicLobby}>
//           Send Message 
//         </button>
//         {rsp.map((message, index) => (
//           <div key={index}>
//             <span>{message}</span>
//           </div>
//         ))}
//       </div>
//     </>
//   )
// }

function App(){
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/room" element={<Room/>}></Route>
      </Routes>
    </BrowserRouter>
  </>
}

export default App

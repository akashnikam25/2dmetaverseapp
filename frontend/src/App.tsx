import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Room } from "./components/Room";
import { LandingPage } from "./components/LandingPage"

// function App() {

//     const [rsp, setRsp] = useState<string>("")
//     const [inp, setInp] = useState<string>("")
//     const [name, setName] = useState<string>("")
//     const socket = new WebSocket("ws://localhost:8000/publiclobby")
//     useEffect(()=>{
//       socket.onopen = (e)=>{
//         console.log("WebSocket connection opened")
//       }
//     },[])

//     socket.onmessage = (e) =>{
//       setRsp(e.data)
//     }

//    function handlePublicLobby(){
//     socket.send(inp)
//     setInp("")
//   }

//   return (
//     <>
//       <div className="card">
//         {/* <input type="text" placeholder="enter your name" value={inp} onChange={(e)=>{
//           setInp(e.target.value) 
//         }} /> */}
//         <input type="text" placeholder="enter your message" value={inp} onChange={(e)=>{
//           setInp(e.target.value) 
//         }} />
//         <button onClick={handlePublicLobby}>
//           Send Message 
//         </button>
//         {rsp != ""?<div><span>{rsp}</span></div>:""}
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

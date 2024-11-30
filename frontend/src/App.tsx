import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoomComp } from "./components/Room";
import { LandingPage } from "./components/LandingPage"

function App(){
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/room" element={<RoomComp/>}></Route>
      </Routes>
    </BrowserRouter>
  </>
}

export default App

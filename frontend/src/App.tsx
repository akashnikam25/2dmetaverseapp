import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Room } from "./components/Room";
import { LandingPage } from "./components/LandingPage"

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

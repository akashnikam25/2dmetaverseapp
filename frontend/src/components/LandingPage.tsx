import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const LandingPage = ()=>{
    const[name, setName] = useState<string>("default")
    const navigate = useNavigate()

    const handleJoin = async ()=>{
        console.log("handle join")
        var res = await axios.get("http://localhost:8000/room?name="+name ,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        console.log("token ", res.data.token)
        localStorage.setItem("token", res.data.token)
        navigate("/room", {state:{name:name}})
    }

    return <>
       <div className="flex flex-col justify-center items-center min-h-screen  bg-gray-100 border ">
        <div className="w-80 p-4 bg-white rounded-lg shadow-lg text-black " style={{ height: '200px' }} >
            <div  className="flex flex-col items-center justify-center p-2">
                <h1 className="text-xl font-bold">Chat Room</h1>
            </div>
            <div className="flex flex-col items-center p-2">
                <input type="text" placeholder="Enter Your Name" className=" p-2 border border-gray-300 rounded text-center" onChange={(e)=>{setName(e.target.value)}} /> 
            </div>
            <div className="flex flex-col items-center">
                <button  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded " onClick={handleJoin}>Join Room</button>
            </div>
        </div>
       </div>
    </>
}
import { AUTO, Game, } from "phaser";
import { Boot } from "./scenes/boot";
import { Preloader } from "./scenes/Preloader";
import { Room } from "./scenes/room";



const config : Phaser.Types.Core.GameConfig = {
    type:AUTO,
    width:1024,
    height:768,
    parent:'room-container',
    backgroundColor: '#028af8',
    scene:[
        Boot,
        Preloader,
        Room
    ]
}

const CreateRoom = (parent:string)=>{
    return new Game({...config, parent})
}

export default CreateRoom
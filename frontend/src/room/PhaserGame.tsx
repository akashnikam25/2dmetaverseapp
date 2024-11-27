import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import CreateRoom from "./main";
import { Room } from "./scenes/room";
import { EventBus } from "./EventBus";


export interface IRefPhaserGame{
    game:Phaser.Game | null;
    scene:Phaser.Scene | null;
}
interface IProps {
    currentActiveScene?:(scene_instane:Phaser.Scene)=>void
}

export const PhaseGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref){
    const game = useRef<Phaser.Game | null>(null!);
    useLayoutEffect(() =>
    {
        console.log("inside phaser game useLayoutEffect")
        if (game.current === null)
        {

            game.current = CreateRoom("room-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            console.log("inside phaser game return ")
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        console.log("inside phaser game useEffect ")
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            console.log("inside eventbus")
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {
                console.log("inside eventbut key ",scene_instance.scene.key)
                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);
   
    return (
        <div id="room-container"></div>
    );

})
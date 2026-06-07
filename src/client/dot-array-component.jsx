import {useEffect, useRef} from "react";
import dotComponent from "./dot-component.jsx";

export default function dotArrayComponent(width, height, values){
    let array=useRef(null)
    let radius=50

    useEffect(() => {
        if(array.current===null){
            array.current = Array.from({ length: height }, () => Array(width).fill(0))
            for(let i=0;i<array.current.length;i++){
                for(let j=0;j<array.current[0].length;j++){
                    array.current[i][j]=dotComponent(i*2*radius+radius, j*2*radius+radius,radius, values[i][j], document.getElementById("canvas"));
                }
            }
        }
    },[])

    useEffect(()=>{
        console.log(array.current)
        if(array.current === null){
            return;
        }

        for(let i=0;i<array.current.length;i++){
            for(let j=0;j<array.current[0].length;j++){
                array.current[i][j].setColor(values[i][j])
            }
        }
    }, [values])

    return(
        <div>
            <div>
                <canvas id="canvas" width={radius*2*width} height={radius*2*height}>
                </canvas>
            </div>


        </div>
    )
}

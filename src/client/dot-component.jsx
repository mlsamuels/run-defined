import {useRef, useEffect} from "react";


export default function dotComponent(x, y, color, c){
    const curColor= useRef("#FFFFFF");
    const toColor= useRef("#FFFFFF");
    const requestColor = useRef("#FFFFFF")
    const isChanging= useRef(false)


    useEffect(()=>{
        requestColor.current= color
        check()
    })

    const check = ()=>{
        console.log("ToColor: "+ toColor.current+", CurColor: "+ curColor.current+", color: "+ requestColor.current)
        if(requestColor.current===curColor.current || isChanging.current){
            return
        }
        toColor.current=requestColor.current
        isChanging.current=true;
        update(0)
    }

    const update = (t)=> {

        const ctx = document.getElementById("canvas").getContext("2d");

        ctx.clearRect(x - 100, y - 100, 200, 200);

        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.fillStyle = toColor.current;
        ctx.strokeStyle = toColor.current;
        ctx.ellipse(x, y, 100, 100, 0, 3 * Math.PI / 2, Math.PI / 2);
        ctx.fill();


        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.fillStyle = curColor.current;
        ctx.strokeStyle = curColor.current;
        ctx.ellipse(x, y, 100, 100, 0, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();


        if (t < 1) {
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.fillStyle = curColor.current;
            ctx.strokeStyle = curColor.current;
            ctx.ellipse(x, y, Math.cos(t * Math.PI / 2) * 100, 100, 0, 3 * Math.PI / 2, Math.PI / 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.fillStyle = toColor.current;
            ctx.strokeStyle = toColor.current;
            ctx.ellipse(x, y, -Math.cos(t * Math.PI / 2) * 100, 100, 0, Math.PI / 2, 3 * Math.PI / 2);
            ctx.fill();
        }
        ctx.stroke();

        t += 0.1
        if (t >= 2) {
            curColor.current=toColor.current
            isChanging.current=false
            check()
        } else {
            setTimeout(update, 1, t)
        }
    }
}
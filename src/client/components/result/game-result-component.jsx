import DotArrayComponent from "../dots/dot-array-component.jsx";
import {useState} from "react";

export default function gameResultComponent(data){
    console.log(data[0])

    const [pageNum, setPageNum] = useState(0)
    const [gameNum, setGameNum] = useState(0)

    if(data.length===0){
        return <div></div>;
    }

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const buttonClick = (left, gameChange)=>{
        if(gameChange) {
            setGameNum(clamp(gameNum + (left?-1:1),0,data.length-1))
            setPageNum(0)
        }
        else{
            setPageNum(clamp(pageNum+(left?-1:1),0,data[gameNum][0].length-1))
        }

    }

    const representationToColors = (representation)=>{
        return representation.map((row)=>(row.map((value)=>(value==="0"?"#FFFFFF":"#000000"))))
    }

    return (
        <div>
            <div>game: {gameNum+1}/{data.length}</div>
            <div>{data[gameNum][3]===0?"*":""}{data[gameNum][1]} vs. {data[gameNum][3]===1?"*":""}{data[gameNum][2]}</div>
            <div>page: {pageNum+1}/{data[gameNum][0].length}</div>
            <DotArrayComponent
                width={data[0][0][0][0].length}
                height={data[0][0][0].length}
                values={representationToColors(data[gameNum][0][pageNum])}
                />
            <button onClick={()=>{buttonClick(true,false)}}>Turn Left</button>
            <button onClick={()=>{buttonClick(false,false)}}>Turn Right</button>
            <button onClick={()=>{buttonClick(true,true)}}>Game Left</button>
            <button onClick={()=>{buttonClick(false,true)}}>Game Right</button>
        </div>
    );
}
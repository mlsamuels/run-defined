import DotArrayComponent from "../dots/dot-array-component.jsx";
import {useState} from "react";

export default function GameResultComponent(props){

    const [pageNum, setPageNum] = useState(0)
    const [gameNum, setGameNum] = useState(0)

    const data=props.data;

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
        const dict = {"0":"#FFFFFF", "1":"#000000", "P0":"#0000FF", "P1":"#FF0000", "BU":"#BBBBBB", "BD":"#999999", "BL":"#777777","BR":"#555555"}
        return representation.map((row)=>(row.map((value)=>(dict[value]))))
    }

    return (
        <div className="game-result">
            {data.length!==1&&<div>game: {gameNum+1}/{data.length}</div>}
            <div>{data[gameNum][3]===0?"*":""}{data[gameNum][1]} vs. {data[gameNum][3]===1?"*":""}{data[gameNum][2]}</div>
            <div>page: {pageNum+1}/{data[gameNum][0].length}</div>
            <DotArrayComponent className="game-result"
                width={data[0][0][0][0].length}
                height={data[0][0][0].length}
                values={representationToColors(data[gameNum][0][pageNum])}
                />
            <br></br>
            <button onClick={()=>{buttonClick(true,false)}}>Prev Turn</button>
            <button onClick={()=>{buttonClick(false,false)}}>Next Turn</button>
            <br></br>
            {data.length!==1&& <button onClick={()=>{buttonClick(true,true)}}>Prev Game</button>}
            {data.length!==1&&<button onClick={()=>{buttonClick(false,true)}}>Next Game</button>}
        </div>
    );
}
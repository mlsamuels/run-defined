import DotArrayComponent from "../dots/dot-array-component.jsx"
import {useEffect, useState} from "react";

export default function ThrobberComponent(props){

    const enabled = props.enabled

    const arrays=[[["#FFFFFF","#FFFFFF","#FFFFFF"],["#000000","#000000","#000000"],["#FFFFFF","#FFFFFF","#FFFFFF"]],[["#FFFFFF","#000000","#FFFFFF"],["#FFFFFF","#000000","#FFFFFF"],["#FFFFFF","#000000","#FFFFFF"]]]

    const [state, setState] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setState((prevState)=>1-prevState)
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    if(!enabled){
        return (<div></div>)
    }
    return(<div className="throbber-dots">
        <DotArrayComponent width={3} height={3} values={arrays[state]}/>
    </div>)
}
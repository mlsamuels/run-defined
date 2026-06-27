import DotArrayComponent from "./dot-array-component.jsx"
import {useEffect, useState} from "react";

export default function homePageDots(dotRules){

    const [array, setArray] = useState(()=>dotRules.defaultArray(32,45));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setArray((prevArray)=>dotRules.update(prevArray))
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return(<DotArrayComponent width={45} height={32} values={array}/>)
}
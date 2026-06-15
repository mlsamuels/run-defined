import dotArrayComponent from "./dot-array-component.jsx"
import {useEffect, useState} from "react";

export default function homePageDots(dotRules){

    const [array, setArray] = useState(()=>dotRules.defaultArray(32,45));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setArray((prevArray)=>dotRules.update(prevArray))
            console.log(array)
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return(dotArrayComponent(45,32,array))
}
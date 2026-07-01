import {useState} from "react";
import runResultComponent from "../run-result-component.jsx";

export default function testResultComponent(tests, testResults){
    const [pageNum, setPageNum] = useState(0)

    if(testResults.length < 1){
        return (<div></div>)
    }

    return(
        <div>
            {tests.map((item,i)=>(<button onClick={()=>{setPageNum(i)}}>({item})</button>))}
            {runResultComponent(testResults[pageNum][0], "stdout", false)}
            {runResultComponent(testResults[pageNum][1], "stderr", true)}
        </div>
    )

}
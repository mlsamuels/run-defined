import {useState} from "react";
import runResultComponent from "../run-result-component.jsx";
import ThrobberComponent from "../throbber/throbber-component.jsx";

export default function testResultComponent(tests, testResults, loading){
    const [pageNum, setPageNum] = useState(0)

    if(loading){
        return (
            <div className="test-result-component">
                <ThrobberComponent enabled={loading}/>
            </div>
        )
    }

    if(testResults.length < 1){
        return (
            <div className="test-result-component">
                <div>{tests.map((item,i)=>(<button onClick={()=>{setPageNum(i)}}>({item})</button>))}</div>
                <div><p>Test your code to see test results.</p></div>
            </div>
        )
    }

    return(
        <div className="test-result-component">
            <div>{tests.map((item,i)=>(<button onClick={()=>{setPageNum(i)}}>({item})</button>))}</div>
            {runResultComponent(testResults[pageNum][0], "stdout", false)}
            {runResultComponent(testResults[pageNum][1], "stderr", true)}
        </div>
    )

}
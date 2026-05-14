import {useState, useEffect, useRef} from "react";
import "./App.css";
import editorComponent from "./editor-component.jsx"
import runResultComponent from "./run-result-component.jsx"


function App() {
    const [outText, setOutText] = useState("");
    const [errText, setErrText] = useState("");

    const [gameName, setGameName] = useState("");
    const [gameNum, setGameNum] = useState(0);
    const [descriptionText, setDescriptionText] = useState("");

    const [defaultCode, setDefaultCode] = useState("");
    const realCode = useRef({code: ""});


    //initialization code
    useEffect( () => {
        changeGame(0)
    }, []);

    const testPress = async () => {
        setOutText("");
        setErrText("");
        try {
            const response = await fetch('/testfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": realCode.current.code
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setOutText(JSON.parse(result["stdout"]))
            setErrText(JSON.parse(result["stderr"]))
        } catch (err) {
            console.log(err);
        }

    }

    const submitPress = async () => {
        setOutText("");
        setErrText("");
        console.log("Submission Real Code: "+realCode.current.code)
        try {
            const response = await fetch('/submitfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": realCode.current.code,
                    "name": localStorage.getItem("name"),
                    "game": gameNum
                }),
            });

            if (!response.ok) {
                console.log((await response.json())["error"])
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setOutText(JSON.parse(result["stdout"]))
            setErrText(JSON.parse(result["stderr"]))
        } catch (err) {
            console.log(err);
        }

    }

    const changeGame = async (num) => {
        setGameNum(Number(num))
        try {
            const response = await fetch(`/gameinfo/${num}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                console.log((await response.json())["error"])
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setDefaultCode(result.defaultCode)
            realCode.current.code=result.defaultCode
            console.log("real Code: "+realCode.current.code)
            setGameName(result.name);
            setDescriptionText(result.description);
        } catch (err) {
            console.log(err);
        }
    }


    //Callback function for code editor
    const onChange = (newText) => {
        realCode.current.code=newText;
    }

    return (
        <div className="App">
            <h1>RunDefined</h1>
            <div className="card">
                <div>
                    <h2>Game:</h2>
                    <select onChange={(event)=>changeGame(event.target.value)}>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                    </select>
                    <h3>
                        {gameName}
                    </h3>
                </div>
                <div>
                    <h2>Description:</h2>
                    <h3>
                        {descriptionText}
                    </h3>
                </div>

                <div>
                    <h2>Name:</h2>
                    <div>
                        <input onChange={(event)=>{localStorage.setItem("name", event.target.value)}} />
                    </div>
                </div>
                <div>
                    <h2>Code:</h2>
                    <div id="editor-div">
                        {editorComponent(defaultCode, onChange)}
                    </div>
                </div>
                <br/>
                <button className="button" onClick={testPress}>
                    Test
                </button>
                <button className="button" onClick={submitPress}>
                    Submit
                </button>
                {runResultComponent(outText, "stdout", false)}
                {runResultComponent(errText, "stderr", true)}



            </div>
        </div>
    );
}


export default App;

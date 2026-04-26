import {useState} from "react";
import "./App.css";
import editorComponent from "./editor-component.jsx"
import runResultComponent from "./run-result-component.jsx"


function App() {
    const [outText, setOutText] = useState("");
    const [errText, setErrText] = useState("");

    const testPress = async () => {
        setOutText("");
        setErrText("");
        try {
            const response = await fetch('/testfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": localStorage.getItem("code")
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
        try {
            const response = await fetch('/submitfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": localStorage.getItem("code"),
                    "name": localStorage.getItem("name")
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


    //Callback function for code editor
    const onChange = (newText) => {
        localStorage.setItem("code", newText);
    }

    return (
        <div className="App">
            <h1>RunDefined</h1>
            <div className="card">
                <div>
                    <h2>Name:</h2>
                    <div>
                        <input onChange={(event)=>{localStorage.setItem("name", event.target.value)}} />
                    </div>
                </div>
                <div>
                    <h2>Code:</h2>
                    <div id="editor-div">
                        {editorComponent(localStorage.getItem("code"), onChange)}
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

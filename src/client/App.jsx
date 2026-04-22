import {useState} from "react";
import "./App.css";
import editorComponent from "./editor-component.jsx"
import runResultComponent from "./run-result-component.jsx"


function App() {
    const [outText, setOutText] = useState("");
    const [errText, setErrText] = useState("");

    const buttonPress = async () => {
        setOutText("");
        setErrText("");
        try {
            const response = await fetch('/testsubmit', {
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

    //Callback function for code editor
    const onChange = (newText) => {
        localStorage.setItem("code", newText);
    }

    return (
        <div className="App">
            <h1>RunDefined</h1>
            <div className="card">
                <div id="editor-div">
                    {editorComponent(localStorage.getItem("code"), onChange)}
                </div>
                <br/>
                <button className="button" onClick={buttonPress}>
                    Submit
                </button>
                {runResultComponent(outText, "stdout", false)}
                {runResultComponent(errText, "stderr", true)}



            </div>
        </div>
    );
}


export default App;

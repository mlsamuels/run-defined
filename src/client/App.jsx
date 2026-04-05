import {useState} from "react";
import "./App.css";
import editorComponent from "./editor-component.jsx"


function App() {
    const [resultText, setResultText] = useState("");

    const buttonPress = async () => {
        setResultText("");
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

            setResultText(JSON.parse(result["run-result"]))
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
                <div>
                    {resultText}
                </div>

            </div>
        </div>
    );
}


export default App;

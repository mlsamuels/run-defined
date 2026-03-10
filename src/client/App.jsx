import {useState} from "react";
import "./App.css";

function App() {
    const [text, setText] = useState("");
    const [resultText, setResultText] = useState("");

    const buttonPress = async () => {
        try {
            const response = await fetch('/testsubmit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": text
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setResultText(result["run-result"])
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className="App">
            <h1>RunDefined</h1>
            <div className="card">
                <div>
                    <textarea cols={50} rows={30} onChange={(e) => {
                        setText(e.target.value)
                    }}/>
                </div>

                <button onClick={buttonPress}>
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

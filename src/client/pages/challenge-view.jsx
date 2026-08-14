import {useState, useEffect} from "react";
import editorComponent from "../components/editor/editor-component.jsx"
import {Link,useLocation} from "react-router-dom";
import leaderboardComponent from "../components/leaderboard/leaderboard-component.jsx";
import GameResultComponent from "../components/result/game-result-component.jsx";
import testResultComponent from "../components/tests/test-result-component.jsx";
import ThrobberComponent from "../components/throbber/throbber-component.jsx";
import challengeTabComponent from "../components/challenge-tab-component.jsx";

export default function ChallengeView(){
    const location = useLocation();
    const gameNum = Number(location.pathname.split("challenge/")[1])

    //Text for the stdout section
    const [testResultData, setTestResultData] = useState([]);

    const [gameName, setGameName] = useState("");
    //Text for the description of the current game
    const [descriptionText, setDescriptionText] = useState("");

    //The default code in the code editor
    const [defaultCode, setDefaultCode] = useState("");

    //Test Cases
    const [testCases, setTestCases] = useState([]);

    const [userError, setUserError] = useState("Submit your code to see results!");

    //LeaderBoard
    const [leaderBoardData, setLeaderBoardData] = useState("");

    const [visualization, setVisualization] =  useState([])

    const [throbbing, setThrobbing] =  useState(false)

    //Tabs
    const [tab, setTab] =  useState(0);

    //initialization code
    useEffect( () => {
        changeGame(gameNum)

    }, []);

    //Pressing the test button
    const testPress = async () => {
        setUserError("")
        setThrobbing(true)
        setTestResultData([]);
        try {
            const response = await fetch('/testfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": localStorage.getItem("code"+gameNum),
                    "tests": testCases,
                    "game": gameNum
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setTestResultData(JSON.parse(result["data"]))

        } catch (err) {
            console.log(err);
        }
        setThrobbing(false)

    }

    //Pressing the submit button
    const submitPress = async () => {
        setTab(2)

        setUserError("")
        setTestResultData([])
        setThrobbing(true)
        try {
            setVisualization([]);
            const response = await fetch('/submitfunction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "code": localStorage.getItem("code"+gameNum)??"",
                    "name": localStorage.getItem("name"+gameNum)??"",
                    "game": gameNum
                }),
            });
            console.log(response)
            if (!response.ok) {
                setUserError((await response.json())["error"])
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            const leaderBoard = result["leaderBoard"];

            setLeaderBoardData(JSON.parse(leaderBoard))
            setVisualization(JSON.parse(result["visualizations"]))
        } catch (err) {
            console.log(err);
        }
        setThrobbing(false)
    }

    //Switching the gameNum to a different game, gets information and updates code editor
    const changeGame = async (num) => {
        try {
            const response = await fetch(`/gameinfo/${num}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setTestCases(result.defaultTests)

            const prevCode = localStorage.getItem("code"+gameNum)
            if(prevCode ===undefined ||prevCode===null || prevCode===""){
                localStorage.setItem("code"+gameNum, result.defaultCode)
            }
            setDefaultCode(localStorage.getItem("code"+gameNum))

            setGameName(result.name);
            setDescriptionText(result.description);
            setLeaderBoardData(result["leaderBoard"])
        } catch (err) {
            console.log(err);
        }
    }

    //Callback function for code editor
    const onCodeChange = (newText) => {
        localStorage.setItem("code"+gameNum,newText);
    }

    return (
        <div className="App">
            <div className="top-bar">
                <Link to={"/"}><img className="home-tab-image" src={"/RD.svg"} alt={"hello?"} height={100}></img></Link>

                <div>
                    <button className="button" onClick={testPress}>
                        <b>Test</b>
                    </button>

                    <button className="button" onClick={submitPress}>
                        <b>Submit</b>
                    </button>
                </div>

                <div className="challenge-name">
                    <h2>Name:</h2>
                    <div>
                        <input defaultValue={localStorage.getItem("name"+gameNum)} onChange={(event)=>{localStorage.setItem("name"+gameNum, event.target.value)}} />
                    </div>
                </div>
            </div>

            <div className = "left-side">

                <div className="challenge-tabs">
                    {challengeTabComponent("Info",tab===0,  ()=>{setTab(0)})}
                    {challengeTabComponent("Leaderboard",tab===1,  ()=>{setTab(1)})}
                    {challengeTabComponent("Results",tab===2,  ()=>{setTab(2)})}
                    {challengeTabComponent("Simulate",tab===3,  ()=>{setTab(3)})}
                </div>

                {tab===0&&<div className = "card">
                    <h2>Game {gameNum}: {gameName}</h2>

                    <h2>Description:</h2>
                    <p>
                        {descriptionText}
                    </p>
                </div>}

                {tab===1&&leaderboardComponent(leaderBoardData)}

                {tab===2&&
                <div className = "card">
                    <div>
                        {userError}
                    </div>
                    <ThrobberComponent enabled={throbbing}/>
                    <GameResultComponent data={visualization}/>
                </div>}

            </div>

            <div className="right-side">

                <div id="editor-div">
                    {editorComponent(defaultCode, onCodeChange)}
                </div>


                {testResultComponent(testCases, testResultData)}
            </div>

        </div>
    );
}
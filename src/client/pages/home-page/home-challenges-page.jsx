import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function HomeChallengesPage(){

    const [gameList, setGameList] = useState([]);

    useEffect( () => {
        updateGameList()

    }, []);

    const updateGameList = async ()=>{
        try {
            const response = await fetch(`/gamelist`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setGameList(result)

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className = "home-page-card">
            <h2>Challenge List</h2>
            <div>{gameList.map((value, index)=>(<div key={index} className="challenge-list-element"><Link to={"/challenge/"+index}><p className="challenge-list-text">{index+". "+value}</p></Link></div>))}</div>
        </div>
    )
}
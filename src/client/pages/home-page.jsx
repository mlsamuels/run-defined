
import homePageDots from "../components/dots/home-page-dots.jsx";
import {conwayRule} from "../components/dots/conway-rule.js";
import homeTabComponent from "../components/home/home-tab-component.jsx";
import {Link, Outlet, useLocation} from 'react-router-dom'
import {useEffect, useState} from "react";

export default function HomePage(){

    const [gameList, setGameList] = useState([]);

    const path =  useLocation().pathname
    const tabSelected = (path)=>{
        if(path.includes("/challenges")){
            return 2;
        }
        if(path.includes("/about")){
            return 3;
        }
        if(path.includes("/more")){
            return 4;
        }
        return 1;
    }

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

        <div className="App">
            {homePageDots(conwayRule)}

            <div className="home-tabs-container">
                <div className="home-tabs">
                    {homeTabComponent("/home","","/public/RD.svg",tabSelected(path)===1)}
                    {homeTabComponent("/home/challenges","Challenges","",tabSelected(path)===2)}
                    {homeTabComponent("/home/about","About","",tabSelected(path)===3)}
                    {homeTabComponent("/home/more","More","",tabSelected(path)===4)}
                </div>
            </div>


            <div className="overlay-container">
                <div className="overlay"></div>
            </div>

            <Outlet/>

            {gameList.map((value, index)=>(<div><Link to={"/challenge/"+index}>{index+". "+value}</Link><br/></div>))}

        </div>
    );
}
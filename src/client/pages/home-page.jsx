
import homePageDots from "../components/dots/home-page-dots.jsx";
import {conwayRule} from "../components/dots/conway-rule.js";
import homeTabComponent from "../components/home/home-tab-component.jsx";
import {Link, Outlet} from 'react-router-dom'
import {useEffect, useState} from "react";

export default function HomePage(){

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

        <div className="App">
            {homePageDots(conwayRule)}

            <div className="home-tabs-container">
                <div className="home-tabs">
                    {homeTabComponent("","public/RDlogo.png",true)}
                    {homeTabComponent("Tab2","",false)}
                    {homeTabComponent("Tab3","",false)}
                    {homeTabComponent("Tab4","",false)}
                </div>
            </div>
            <Link to={"/home"}>Hello</Link>



            <div className="overlay-container">
                <div className="overlay"></div>
            </div>

            <Outlet/>

            {gameList.map((value, index)=>(<div><Link to={"/challenge/"+index}>{index+". "+value}</Link><br/></div>))}

        </div>
    );
}
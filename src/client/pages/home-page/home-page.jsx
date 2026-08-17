
import homePageDots from "../../components/dots/home-page-dots.jsx";
import {conwayRule} from "../../components/dots/conway-rule.js";
import homeTabComponent from "../../components/home/home-tab-component.jsx";
import {Outlet, useLocation} from 'react-router-dom'

export default function HomePage(){

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


    return (
        <div className="home-page">
            {homePageDots(conwayRule)}

            <div className="home-tabs-container">
                <div className="home-tabs">
                    {homeTabComponent("/","",true,tabSelected(path)===1)}
                    {homeTabComponent("/challenges","Challenges",false,tabSelected(path)===2)}
                    {homeTabComponent("/about","About",false,tabSelected(path)===3)}
                    {homeTabComponent("/more","More",false,tabSelected(path)===4)}
                </div>
            </div>


            <div className="overlay-container">
                <div className="overlay">

                </div>


            </div>

            <div className="home-card-container">
                <Outlet/>
            </div>
        </div>
    );
}
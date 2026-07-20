
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
                    {homeTabComponent("/home","","/public/RD.svg",tabSelected(path)===1)}
                    {homeTabComponent("/home/challenges","Challenges","",tabSelected(path)===2)}
                    {homeTabComponent("/home/about","About","",tabSelected(path)===3)}
                    {homeTabComponent("/home/more","More","",tabSelected(path)===4)}
                </div>
            </div>


            <div className="overlay-container">
                <div className="overlay"></div>
            </div>

            <div className="home-card-container">
                <Outlet/>
            </div>



        </div>
    );
}
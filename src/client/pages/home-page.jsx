
import homePageDots from "../components/dots/home-page-dots.jsx";
import {conwayRule} from "../components/dots/conway-rule.js";

import {Link} from 'react-router-dom'

export default function HomePage(){


    return (

        <div className="App">
            {homePageDots(conwayRule)}

            <div className="overlay-container">
                <div className="overlay"></div>
            </div>

            <Link to="/challenge/0">Challenge 0</Link><br/>
            <Link to="/challenge/1">Challenge 1</Link>
        </div>
    );
}
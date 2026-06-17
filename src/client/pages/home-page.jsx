
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

            <Link to="/challenge">Challenge 0</Link>
        </div>
    );
}
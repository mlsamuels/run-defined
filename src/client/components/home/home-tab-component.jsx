import {Link} from "react-router-dom";


export default function homeTabComponent(link,text, image, isSelected){

    return(
        <Link to={link} className={isSelected ? "home-tab home-tab-selected" : "home-tab"}>
            <p className="home-tab-text">{text}</p>
            {image!==""?(<img className="home-tab-image" src={image} alt={"hello?"}></img>):(<div></div>)}
        </Link>
    )
}
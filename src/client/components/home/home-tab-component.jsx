import {Link} from "react-router-dom";


export default function homeTabComponent(link,text, image, isSelected){

    return(
        <Link to={link} className={isSelected ? "home-tab home-tab-selected" : "home-tab"}>
            <p className="home-tab-text">{text}</p>
            {image&&
                <picture>
                    <source className="home-tab-image" srcSet="/RDWhite.svg" media="(prefers-color-scheme: dark)"/>
                    <img className="home-tab-image" src="/RD.svg" alt={"logo_image"} height={100}></img>
                </picture>}
        </Link>
    )
}
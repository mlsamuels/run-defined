


export default function homeTabComponent(text, image, isSelected){

    return(
        <div className={isSelected ? "home-tab home-tab-selected" : "home-tab"}>
            <p>{text}</p>
            <img className="home-tab-image" src={image} alt={""}></img>
        </div>
    )
}
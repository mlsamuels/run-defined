

export default function challengeTabComponent(text, isSelected ,pressFunction) {
    return(
        <div onClick={()=>pressFunction()} className={isSelected ? "home-tab home-tab-selected" : "home-tab"}>
            <p className="home-tab-text">{text}</p>
        </div>
    )
}
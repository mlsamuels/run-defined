

export default function runResultComponent(text, title, isError) {

    if(text.length===0){
        return <div></div>
    }

    return(
    <div style={isError ? {background:'pink', borderRadius:'10px',padding:'10px', paddingTop: '0px'} : {border: '1px solid black' , background:'white', borderRadius:'10px',padding:'10px', paddingTop: '0px'}}>
        <h2>
            {title}:
        </h2>
        <pre>
            {text}
        </pre>
    </div>
    )
}
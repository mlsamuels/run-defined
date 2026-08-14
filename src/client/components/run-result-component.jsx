

export default function runResultComponent(text, title, isError) {

    if(text.length===0){
        return <div></div>
    }

    return(
    <div className={isError ? "run-result-component run-result-error" : "run-result-component run-result-normal"}>
        <h2>
            {title}:
        </h2>
        <pre>
            {text}
        </pre>
    </div>
    )
}

export default function leaderboardComponent(data){

    if(data.length===0){
        return <table><thead><tr><th>Name</th><th>Elo</th></tr></thead></table>;

    }

    const dataToHTML=()=>{

        console.log(JSON.parse(data).map((entry)=>(<tr><th>{entry.name}</th><th>{entry.elo}</th></tr>)))
        return (<table>
            <thead><tr><th>Name</th><th>Elo</th></tr></thead>
            <tbody>
            {JSON.parse(data).map((entry)=>(<tr><th>{entry.name}</th><th>{(parseInt(entry.elo))}</th></tr>))}
            </tbody>
            </table>)

    }

    return (
        <div>{dataToHTML(data)}</div>
    );
}
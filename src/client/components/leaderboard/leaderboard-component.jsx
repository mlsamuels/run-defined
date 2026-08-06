
export default function leaderboardComponent(data){

    if(data.length===0){
        return<></>
    }

    const dataToHTML=()=>{
        return (<table>
            <thead><tr><th>Name</th><th>Elo</th></tr></thead>
            <tbody>
            {data.map((entry)=>(<tr><td>{entry.name}</td><td>{(parseInt(entry.elo))}</td></tr>))}
            </tbody>
            </table>)

    }

    return (
        <div className="leaderboard-container">{dataToHTML(data)}</div>
    );
}
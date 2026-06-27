
export default function leaderboardComponent(data){

    if(data.length===0){
        return <table><thead><tr><th>Name</th><th>Elo</th></tr></thead></table>;

    }

    const dataToHTML=()=>{
        console.log(data[0])
        return (<table>
            <thead><tr><th>Name</th><th>Elo</th></tr></thead>
            <tbody>
            {data.map((entry)=>(<tr><th>{entry.name}</th><th>{(parseInt(entry.elo))}</th></tr>))}
            </tbody>
            </table>)

    }

    return (
        <div>{dataToHTML(data)}</div>
    );
}
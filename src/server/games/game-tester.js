import readline from 'readline'


import gameList from "./game-list.js";

const games= gameList();

// Create an interface for input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const printVis = (vis)=>{
    for(let i=0; i<vis.length; i++){
        for(let j=0; j<vis[i].length; j++){
            process.stdout.write(vis[i][j]+" ")
        }
        console.log()
    }
}

// Main async function
const main = async () => {
    // Get user input using await
    const gameNum = await askQuestion('What game? ');

    const gameClass = games[Number(gameNum)]
    console.log(`Game is ${gameClass.getInfo()["name"]}`);

    const player0 = async(info)=>{
        console.log(`Player0, You have been given: ${info}`)
        return await askQuestion("What will you do?")
    }
    const player1 = async(info)=>{
        console.log(`Player1, You have been given: ${info}`)
        return await askQuestion("What will you do?")
    }

    let gameObject  = new gameClass([player0, player1]);
    while(!gameObject.isEnded()){
        printVis(gameObject.viewGame())
        console.log()
        await gameObject.nextTurn()
    }
    printVis(gameObject.viewGame())
    console.log("Player "+(gameObject.getResults()[1])+" Wins!")

    // Close the readline interface
    rl.close();
};

// Call the main async function
await main();
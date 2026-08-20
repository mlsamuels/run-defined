import express from "express";
import ViteExpress from "vite-express";

import DatabaseConnection from "./database-connection.js"
import gameList from "./games/game-list.js";
import runCode from "./python-runner.js"

const app = express();

//Database connection
const db = new DatabaseConnection()
db.connect()

app.use(express.json());

//get the info for a specific game to display instructions
app.get("/gameinfo/:game", async (req, res) => {
  const game = req.params.game;
  if(game<gameList().length){
    let info = gameList()[game].getInfo()
    info.leaderBoard= await getLeaderBoard(Number(game))
    res.send(JSON.stringify(info))
  }
  else{
    res.status(400).json({"error":"Game not found"});
  }
});

//get list of all games
app.get("/gamelist", (req, res) => {
  res.send(JSON.stringify(gameList().map((game) => game.getInfo()["name"])))
})

app.post("/simulategame", async (req, res) => {
  const game = req.body.game;
  const p0name = req.body.p0;
  const p1name = req.body.p1;

  const p0= await db.findOne({name: p0name, game:game});
  const p1 = await db.findOne({name: p1name, game:game});

  if(!p0||!p1){
    res.status(400).json({"error":"Submission name not found"});
    return;
  }

  const visualization = [await playGame(p0,p1)]

  res.send({"visualization": JSON.stringify(visualization)});

});

//post for testing code
app.post("/testfunction", async (req, res) => {
  const code = req.body.code;
  const tests = req.body.tests;
  const game = req.body.game;

  const testResults=[]
  for(let i =0; i<tests.length;i++){
    const t = tests[i];

    const result= await runCode(code, gameList()[game].getCode(), t)
    testResults.push(result)
  }

  res.send({"data":JSON.stringify(testResults)});
});

//post for submitting code and adding to leaderboard
app.post("/submitfunction", async (req, res) => {
  const code = req.body.code;
  const name = req.body.name;
  const game = req.body.game;

  //check if name in use
  if(name===""){
    res.status(400).json({"error":"Must have name"});
    return
  }
  const existing = await db.findOne({name: name, game:game})
  if(existing){
    res.status(409).json({"error":"Name in use"});
    return
  }

  const testResult = await runCode(code, gameList()[game].getCode(), gameList()[game].getInfo()["defaultTests"][0])
  if(testResult[1]!==""){
    res.status(400).json({"error":"Errors in code run, please test your code first"});
    return
  }

  console.log(name +" has been entered!")

  //add to database
  const insert_result = await db.insertOne({name: name, code: code, elo: 1500, game:game})
  const id = insert_result.insertedId;

  const visualizations=await playGames(id, 5)

  const leaderBoard = await getLeaderBoard(game)
  res.send({"leaderBoard":JSON.stringify(leaderBoard), "visualizations": JSON.stringify(visualizations)});
});

// ViteExpress.listen(app, 3000, () =>
//   console.log("Server is listening on port 3000..."),
// );
const PORT=3000
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express listening on LAN at port ${PORT}`);
});
ViteExpress.bind(app,server)


//Returns the full ordered leaderboard for a given game (Name, elo)
async function getLeaderBoard(game){
  return db.aggregate([
    { $match: { game: game}},
    { $sort: { elo: -1 } },
    {$project: {
        _id: 0,
        name: 1,
        elo: 1
      }}
  ]);
}

//plays a number of games with the submission of id, updates elo accordingly
async function playGames(id, count){
  let p0 = await db.findOne({_id: id})
  const visualizations=[]
  const modifierInfluence = 50
  let modifier=0;
  for (let i = 0; i < count; i++) {
    //Find matches nearby
    const searchResult= await db.aggregate([
      {
        $addFields: {
          diff: { $abs: { $subtract: ["$elo", p0.elo+modifier*modifierInfluence] } }
        }
      },
      { $match: { _id: { $ne: id}, game: p0.game}},
      { $sort: { diff: 1 } },
      { $limit: 1 }
    ]);
    if(searchResult.length === 0){
      break
    }
    //Closest match
    const p1= searchResult[0];
    visualizations.push(Math.random()>0.5?await playGame(p0,p1):await playGame(p1,p0))
    const oldElo = p0.elo
    p0 = await db.findOne({_id: id})
    const newElo = p0.elo
    modifier+= Math.sign(newElo-oldElo)
  }
  return visualizations;
}

//plays a number of games between random opponents
async function playRand(game, count){
  const searchResult= await db.aggregate([
    { $match: {game: game}},
    { $sample: { size: 2 } }
  ]);
  if(searchResult.length<2){
    return;
  }
  await playGame(searchResult[0], searchResult[1]);

  if(count>1){
    await playRand(game, count-1);
  }
}

//plays one game between p0 and p1, updates elo
async function playGame(p0, p1){
  const game = p0.game;

  //Todo more than 2 players
  const id0= p0._id;
  const id1= p1._id;


  //make player functions
  const  player0Function=makePlayerFunction(p0.code, gameList()[game].getCode())
  const  player1Function=makePlayerFunction(p1.code, gameList()[game].getCode())

  const gameInstance = new (gameList()[game])([player0Function,player1Function]);
  const visualization = await gameInstance.playAll()


  //compute elo change
  const result = gameInstance.getResults()[1]
  const eloChange=eloUpdate(p0.elo,p1.elo,result);

  //update elos
  await db.updateOne({_id:id0},{$set:{elo:p0.elo+eloChange*(1.0-result)-eloChange*result}})
  await db.updateOne({_id:id1},{$set:{elo:p1.elo+eloChange*result-eloChange*(1.0-result)}})

  console.log(p0.name+" vs. "+p1.name)
  return [visualization,p0.name,p1.name,result];

}

//Produces a player function that represents "what a player does" given a situation
//This function will be given to the game so it can play out
function makePlayerFunction(playerCode, gameCode){
  return async (args)=>{

    //Run python file and get output
    const output= await runCode(playerCode, gameCode, args)
    //Error in run
    if(output[0].length===0 || output[1].length>0){
      return null
    }

    return output[0].split(/\r?\n/).at(-2);
  }
}

//Given two elos and the winner, give elo change
function eloUpdate(elo0, elo1, winner){
  const p0=(1.0/(1.0+10**((elo1-elo0)/100)))
  const p1=1.0-p0
  const K=200
  return winner*K*p0 + (1.0-winner)*K*p1
}
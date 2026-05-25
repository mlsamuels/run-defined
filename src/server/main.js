import express from "express";
import ViteExpress from "vite-express";
import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

import mongoose from "mongoose"
import dotenv from "dotenv";
import {BiggerNumber} from "./games/bigger-number.js";
import {TwentyOne} from "./games/twenty-one.js";

dotenv.config();

const app = express();


//Database connection
await mongoose.connect(process.env.MONGODB_URI, {});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
const gameZeroSubmissions = db.collection("gameZeroSubmissions");


app.use(express.json());

//get the info for a specific game to display instructions
app.get("/gameinfo/:game", (req, res) => {
  const game = req.params.game;
  if(game<games.length){
    req.ok=true;
    res.send(games[game].getInfo())
  }
  else{
    req.ok=false;
    res.send({"error": "Game not found"});
  }
});

//post for testing code
app.post("/testfunction", async (req, res) => {
  res.ok=true;
  const code = req.body.code;
  const tests = req.body.tests;
  const game = req.body.game;

  //write to script.py


  //const player = makePlayerFunction(code, games[game].getCode())

  const testResults=[]
  for(let i =0; i<tests.length;i++){
    const t = tests[i];

    const gameCodeArgs = stringReplace(games[game].getCode(), t)
    try {
      fs.writeFileSync("python_scripts/script.py", code);
      fs.writeFileSync("python_scripts/main.py", gameCodeArgs);
    } catch (err) {
      console.error('Error writing file:', err);
    }

    const result=await startContainer()
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
  const existing = await gameZeroSubmissions.findOne({name: name})
  if(existing){
    req.ok =false;
    res.send({"error": "Name in use"});
    return
  }

  //TODO Make sure code works before adding to database

  //add to database
  const insert_result = await gameZeroSubmissions.insertOne({name: name, code: code, elo: 1500, game:game})
  const id = insert_result.insertedId;

  const viss=await playGames(id, 5)
  await playRand(game, 5)

  const leaderBoard = await getLeaderBoard(game)
  console.log(viss)
  res.ok=true;
  res.send({"leaderBoard":JSON.stringify(leaderBoard), "viss": JSON.stringify(viss)});
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

//List of all games, index represents which number game it is
const games=[BiggerNumber, TwentyOne]

async function getLeaderBoard(game){
  const leaderBoard = await gameZeroSubmissions.aggregate([
    { $match: { game: game}},
    { $sort: { elo: -1 } },
    {$project: {
        _id: 0,
        name: 1,
        elo: 1
      }}
  ])
  return leaderBoard.toArray();
}

//plays a number of games with the submission of id, updates elo accordingly
async function playGames(id, count){
  let p0 = await gameZeroSubmissions.findOne({_id: id})
  const viss=[]
  for (let i = 0; i < count; i++) {
    const searchResult= await gameZeroSubmissions.aggregate([
      {
        $addFields: {
          diff: { $abs: { $subtract: ["$elo", p0.elo] } }
        }
      },
      { $match: { _id: { $ne: id}, game: p0.game}},
      { $sort: { diff: 1 } },
      { $limit: 1 }
    ]).toArray();
    if(searchResult.length ===0){
      break
    }
    const p1= searchResult[0];
    viss.push(await playGame(p0,p1))
    p0 = await gameZeroSubmissions.findOne({_id: id})
  }
  return viss
}



//plays a number of games between random opponents
async function playRand(game, count){
  const searchResult= await gameZeroSubmissions.aggregate([
    { $match: {game: game}},
    { $sample: { size: 2 } }
  ]).toArray();
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
  const  player0Function=makePlayerFunction(p0.code, games[game].getCode())
  const  player1Function=makePlayerFunction(p1.code, games[game].getCode())

  const gameInstance = new games[game]([player0Function,player1Function]);
  const vis = await gameInstance.playAll()


  //compute elo change
  const result = gameInstance.getResults()[1]
  const eloChange=eloUpdate(p0.elo,p1.elo,result);

  //update elos
  await gameZeroSubmissions.updateOne({_id:id0},{$set:{elo:p0.elo+eloChange*(1.0-result)-eloChange*result}})
  await gameZeroSubmissions.updateOne({_id:id1},{$set:{elo:p1.elo+eloChange*result-eloChange*(1.0-result)}})

  return [vis,p0.name,p1.name,result];

}

//Produces a player function that represents "what a player does" given a situation
//This function will be given to the game so it can play out
function makePlayerFunction(playerCode, gameCode){
  return async (args)=>{
    const gameCodeArgs = stringReplace(gameCode, args)

    try {
      fs.writeFileSync("python_scripts/script.py", playerCode);
      fs.writeFileSync("python_scripts/main.py", gameCodeArgs);
    } catch (err) {
      console.error('Error writing file:', err);
    }

    //Run python file and get output
    const output0=await startContainer()
    return output0[0].split(/\r?\n/).at(-2);
  }
}

//Replaces instances of {0}, {1} ... in a string with the elements of replacements
function stringReplace(string, replacements){
  for (let i= 0; i< replacements.length; i++){
    const regex= new RegExp("\\{"+i+"\\}");
    string = string.replace(regex, replacements[i]);
  }
  return string;
}

//Run python code and get results
//Uses whatever code is in main.py and script.py
async function startContainer() {
  try {
    // Create container
    const container = await docker.createContainer({
      Image: 'python:3.12-slim',
      Cmd: ['python','-u' ,'/app/main.py'],
      HostConfig: {
        Binds: [`${process.cwd()}/python_scripts/script.py:/app/script.py`,
                `${process.cwd()}/python_scripts/main.py:/app/main.py`],
        AutoRemove: false,
        Tty: true
      }
    });

    //Get python code results
    await container.start();
    await container.wait();

    const logs = await container.logs({
      stdout: true,
      stderr: true
    });
    await container.remove();

    let offset = 0;
    let stdout = '';
    let stderr = '';

    //Parse buffer
    while (offset < logs.length) {
      // byte 0 = stream type (1=stdout, 2=stderr)
      // bytes 1-3 = unused
      // bytes 4-7 = length
      const type = logs.readUInt8(offset)
      const length = logs.readUInt32BE(offset + 4);

      //extract log
      const start = offset + 8;
      const end = start + length;

      if (end > logs.length) break; // safety guard

      const chunk = logs.slice(start, end);
      if(type===1) {
        stdout += chunk.toString();
      }
      else{
        stderr += chunk.toString();
      }

      offset += 8 + length;
    }

    return [stdout,stderr];

  } catch (err) {
    console.error('Failed to start container:', err);
  }
}

//Given two elos and the winner, give elo change
function eloUpdate(elo0, elo1, winner){
  const p0=(1.0/(1.0+10**((elo1-elo0)/400)))
  const p1=1.0-p0
  const K=30
  return winner*K*p0 + (1.0-winner)*K*p1
}
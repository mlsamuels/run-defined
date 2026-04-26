import express from "express";
import ViteExpress from "vite-express";
import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const app = express();

//Database connection
await mongoose.connect(process.env.MONGODB_URI, {});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
const gameZeroSubmissions = db.collection("gameZeroSubmissions");


app.use(express.json());

app.post("/testfunction", async (req, res) => {
  res.ok=true;
  const code = req.body.code;

  //write to script.py
  try {
    fs.writeFileSync("python_scripts/script.py", code); // Specify encoding
  } catch (err) {
    console.error('Error writing file:', err);
  }

  //Run python file and get output
  const output=await startContainer()
  res.send({"stdout":JSON.stringify(output[0]), "stderr":JSON.stringify(output[1])});
});

app.post("/submitfunction", async (req, res) => {

  const code = req.body.code;
  const name = req.body.name;

  //check if name in use
  const existing = await gameZeroSubmissions.findOne({name: name})
  if(existing){
    req.ok =false;
    res.send({"error": "Name in use"});
  }

  //TODO Make sure code works before adding to database

  //add to database
  const insert_result = await gameZeroSubmissions.insertOne({name: name, code: code, elo: 1500})
  const id = insert_result.insertedId;

  await playGames(id, 5)

  res.ok=true;

  res.send({});
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

async function playGames(id, count){

  const opponents = await gameZeroSubmissions.find({ _id: { $ne: id } }).toArray()
  const real_count =opponents.length
  count = Math.min(count,real_count)

  const final_opponents = opponents.sort(() => Math.random() - 0.5).slice(0,count)
  for (let i = 0; i < final_opponents.length; i++) {
    const id2 = final_opponents[i]._id
    await playGame(id,id2)
  }
}

async function playGame(id1, id2){
  const p1=await gameZeroSubmissions.findOne({_id: id1})
  const p2=await gameZeroSubmissions.findOne({_id: id2})

  //TODO encapsulate this code
  //write to script.py player 1
  try {
    fs.writeFileSync("python_scripts/script.py", p1.code); // Specify encoding
  } catch (err) {
    console.error('Error writing file:', err);
  }

  //Run python file and get output
  const output1=await startContainer()
  const p1_score = parseInt(output1[0].split(/\r?\n/).at(-2));

  //write to script.py player 2
  try {
    fs.writeFileSync("python_scripts/script.py", p2.code); // Specify encoding
  } catch (err) {
    console.error('Error writing file:', err);
  }

  //Run python file and get output
  const output2=await startContainer()
  const p2_score = parseInt(output2[0].split(/\r?\n/).at(-2));

  //compute elo change
  const result = p1_score>p2_score?0:1;
  const eloChange=eloUpdate(p1.elo,p2.elo,result);

  //update elos
  await gameZeroSubmissions.updateOne({_id:id1},{$set:{elo:p1.elo+eloChange*(1.0-result)-eloChange*result}})
  await gameZeroSubmissions.updateOne({_id:id2},{$set:{elo:p2.elo+eloChange*result-eloChange*(1.0-result)}})
}

//Run python code and get results
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

function eloUpdate(elo0, elo1, winner){
  const p0=(1.0/(1.0+10**((elo1-elo0)/400)))
  const p1=1.0-p0
  const K=30
  return winner*K*p0 + (1.0-winner)*K*p1
}
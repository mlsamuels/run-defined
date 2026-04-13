import express from "express";
import ViteExpress from "vite-express";
import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

import PassThrough  from 'stream';



const app = express();

app.use(express.json());

app.post("/testsubmit", async (req, res) => {
  res.ok=true;
  const code = req.body.code;

  //write to script.py
  try {
    fs.writeFileSync("python_scripts/script.py", code); // Specify encoding
  } catch (err) {
    console.error('Error writing file:', err);
  }

  //Run python file and get output
  const output=await startContainer("python", "pythonContainer", 8000,9000)
  res.send({"run-result":JSON.stringify(output)});
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);


async function startContainer() {
  try {
    // Create container
    const container = await docker.createContainer({
      Image: 'python:3.12-slim',
      Cmd: ['python', '/app/script.py'],
      HostConfig: {
        Binds: [`${process.cwd()}/python_scripts/script.py:/app/script.py`],
        AutoRemove: true,
        Tty: true
      }
    });

    //Setup stream
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      log: true
    });

    let output=""

    //Create stream callback function, define how chunks are added to outpu
    stream.on('data', (chunk) => {
      // [0] = stream type (1=stdout, 2=stderr)
      // [1-3] = unused
      // [4-7] = payload length
      const type = chunk[0];
      const length = chunk.readUInt32BE(4);
      const content = chunk.slice(8, 8 + length).toString();

      if (type === 1) {
        output += content; // stdout
      } else if (type === 2) {
        output += content; // stderr
      }
    });

    await container.start();
    await container.wait();

    return output;

  } catch (err) {
    console.error('Failed to start container:', err);
  }
}
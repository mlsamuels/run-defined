import express from "express";
import ViteExpress from "vite-express";
import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

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
  res.send({"stdout":JSON.stringify(output[0]), "stderr":JSON.stringify(output[1])});
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

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

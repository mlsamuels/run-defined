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

  //run python file and get output
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
        AutoRemove: true
      }
    });

    await container.start();

    await container.wait();

    const logs = await container.logs({ stdout: true, stderr: true });
    const outputString = logs.toString().trim().replace(/(?!\s)\p{Cc}/gu, "");;

    console.log(outputString);
    return outputString;

  } catch (err) {
    console.error('Failed to start container:', err);
  }
}
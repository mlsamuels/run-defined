import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

//Replaces maincode with replacements and runs code, returning results
export default async function runCode(scriptCode, mainCode,replacements){
    const mainCodeArgs = stringReplace(mainCode, replacements)
    try {
        fs.writeFileSync("python_scripts/script.py", scriptCode);
        fs.writeFileSync("python_scripts/main.py", mainCodeArgs);
    } catch (err) {
        console.error('Error writing file:', err);
    }

    return await Promise.race([startContainer(), timeOutFunction()])
}

async function timeOutFunction(){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(["","Error, time limit exceeded"])
        },5000)
    })
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
                Tty: false
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

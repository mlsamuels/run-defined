import fs from "fs";
import Docker from "dockerode";
const docker = new Docker();

//Replaces maincode with replacements and runs code, returning results
export default async function runCode(scriptCode, mainCode,replacements){
    const mainCodeArgs = stringReplace(mainCode, replacements)
    const uniqueHash=Math.floor(Math.random() * 0x100000000)
    try {
        fs.writeFileSync("python_scripts/script"+uniqueHash+".py", scriptCode);
        fs.writeFileSync("python_scripts/main"+uniqueHash+".py", mainCodeArgs);
    } catch (err) {
        console.error('Error writing file:', err);
    }

    const returnVal= await Promise.race([startContainer(uniqueHash), timeOutFunction()]);

    try {
        fs.unlinkSync("python_scripts/script"+uniqueHash+".py");
        fs.unlinkSync("python_scripts/main"+uniqueHash+".py");
    } catch (err) {
        console.error('Error writing file:', err);
    }

    return returnVal;
}

//Function to race against for timeout, returns error if timeout wins
async function timeOutFunction(){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(["","Error, time limit exceeded"])
        },20000)
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
//Uses whatever code is in the uniqueHash variants of main.py and script.py
async function startContainer(uniqueHash) {
    try {
        // Create container
        const container = await docker.createContainer({
            Image: 'python:3.12-slim',
            Cmd: ['python','-u' ,'/app/main.py'],
            HostConfig: {
                Binds: [`${process.cwd()}/python_scripts/script${uniqueHash}.py:/app/script.py`,
                    `${process.cwd()}/python_scripts/main${uniqueHash}.py:/app/main.py`],
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

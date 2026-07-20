import {Game} from "./game.js";


//Game Class for Pythons game
export class Dodgeball extends Game{

    //constrictor lol
    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("Dodgeball must have 2 players")
        }
        this.size = [8,8]
        this.turn=0;
        this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill("0"));

        this.pLocs=[[Math.floor(this.size[0]/2-1),Math.floor(this.size[1]/4-1)],[Math.floor(this.size[0]/2),Math.floor(this.size[1]*3/4)]]
        this.board[this.pLocs[0][0]][this.pLocs[0][1]]="P0"
        this.board[this.pLocs[1][0]][this.pLocs[1][1]]="P1"

    }

    isEnded(){
        return this.pLocs[0]===null||this.pLocs[1]===null
    }

    getResults(){
        if(this.pLocs[0]===null && this.pLocs[1]===null){
            return [0.5,0.5]
        }
        const p0Win = this.pLocs[1]===null
        return [p0Win,1-p0Win]
    }

    static boardToPyArray(board, player){
        let pyString="[["
        for(let i=0;i<board.length;i++){
            for(let j=0;j<board[i].length;j++){
                if(board[i][j]==="P0"){
                    pyString+="\"P"+(player)+"\""
                }
                else if(board[i][j]==="P1"){
                    pyString+="\"P"+(1-player)+"\""
                }
                else {
                    pyString += "\"" + board[i][j] + "\""
                }
                if(j!==board[i].length-1){
                    pyString+=","
                }
            }
            pyString+="]"
            if(i!==board.length-1){
                pyString+=", ["
            }
        }
        pyString+="]"

        return pyString
    }
    static pLocsToPyArray(pLocs, player){
        return "[["+pLocs[player][0]+","+pLocs[player][1]+"],["+pLocs[1-player][0]+","+pLocs[1-player][1]+"]]"
    }

    async nextTurn(){
        const playerNum = this.turn%3

        const dict={"U":[-1,0],"D":[1,0],"L":[0,-1],"R":[0,1]}
        const swap={"U":"D", "D":"U", "L":"R", "R":"L"}

        //Dodgeballs moving
        if(playerNum===2){
            //Iterate over board updating balls
            for(let oldY=0;oldY<this.size[0];oldY++){
                for(let oldX=0;oldX<this.size[1];oldX++){
                    //There is no dodgeball here
                    if(this.board[oldY][oldX].charAt(0)!=='B'||this.board[oldY][oldX].charAt(1)==="M"){
                        continue;
                    }
                    const letter = this.board[oldY][oldX].charAt(1)
                    const change = dict[letter]
                    const newCoord = [oldY+change[0],oldX+change[1]]

                    //Change Direction at edge
                    if(newCoord[0]<0||newCoord[0]>=this.size[0]||newCoord[1]<0||newCoord[1]>=this.size[1]){
                        this.board[oldY][oldX]="B"+swap[letter]
                        oldX--;
                        continue;
                    }

                    const newElement = this.board[newCoord[0]][newCoord[1]]
                    //Collision with ball
                    if(newElement.charAt(0)==='B'){
                        this.board[newCoord[0]][newCoord[1]]="0"
                        this.board[oldY][oldX]="0"
                        continue
                    }
                    //Collision with player
                    if(newElement.charAt(0)==='P'){
                        const pNum = Number(newElement.charAt(1))
                        this.pLocs[pNum]=null
                        this.board[newCoord[0]][newCoord[1]]="0"
                        this.board[oldY][oldX]="0"
                        continue
                    }

                    //Normal
                    this.board[newCoord[0]][newCoord[1]]="BM"+letter
                    this.board[oldY][oldX]="0"
                }
            }

            //Unmark balls as moved
            for(let y=0;y<this.size[0];y++) {
                for (let x = 0; x < this.size[1]; x++) {
                    if(this.board[y][x].charAt(1)==='M'){
                        this.board[y][x]="B"+this.board[y][x].charAt(2)
                    }
                }
            }
            this.turn++;
            return
        }

        //Players moving
        const curPlayer = this.players[playerNum]
        const result = await curPlayer([Dodgeball.boardToPyArray(this.board,playerNum),Dodgeball.pLocsToPyArray(this.pLocs,playerNum)])

        //error or invalid choice, other player wins
        if(result===null || result.length!==2 || (result.charAt(0)!=='T' && result.charAt(0)!=='M') || !(result.charAt(1) in dict)){
            this.board[this.pLocs[playerNum][0]][this.pLocs[playerNum][1]]="0"
            this.pLocs[playerNum]=null
        }
        //moving
        else if(result.charAt(0)==='M'){
            const direction = dict[result.charAt(1)]
            const oldCoord = this.pLocs[playerNum]
            const newCoord = [this.pLocs[playerNum][0]+direction[0],this.pLocs[playerNum][1]+direction[1]]
            this.board[oldCoord[0]][oldCoord[1]]="0"

            //moved into edge or player
            if(newCoord[0]>=this.size[0]||newCoord[0]<0||newCoord[1]>=this.size[1]||newCoord[1]<0||this.board[newCoord[0]][newCoord[1]].charAt(0)==='P'){
                this.pLocs[playerNum]=null
            }
            //moved into ball
            if(this.board[newCoord[0]][newCoord[1]].charAt(0)==='B'){
                this.pLocs[playerNum]=null
                this.board[newCoord[0]][newCoord[1]]="0"
            }
            else{
                this.board[newCoord[0]][newCoord[1]]=("P"+playerNum)
                this.pLocs[playerNum]=newCoord
            }
        }
        //throwing
        else{
            const direction = dict[result.charAt(1)]
            const oldCoord = this.pLocs[playerNum]
            const newCoord = [this.pLocs[playerNum][0]+direction[0],this.pLocs[playerNum][1]+direction[1]]
            //Thrown at edge, die
            if(newCoord[0]<0||newCoord[0]>=this.size[0]||newCoord[1]<0||newCoord[1]>=this.size[1]){
                this.board[oldCoord[0]][oldCoord[1]]="0"
                this.pLocs[playerNum]=null
            }
            //Point Blank Player
            else if(this.board[newCoord[0]][newCoord[1]].charAt(0)==='P'){
                this.board[newCoord[0]][newCoord[1]]="0"
                this.pLocs[1-playerNum]=null
            }
            //Regular Throw
            else{
                this.board[newCoord[0]][newCoord[1]]="B"+result.charAt(1)
            }
        }
        this.turn++
    }

    viewGame(){
        return structuredClone(this.board);
    }

    static numPlayers(){
        return 2;
    }

    static getCode(){
        return pythonCode;
    }

    static getInfo(){
        return {"name":"Dodgeball",
            "description":"In this game, two agents will",
            "defaultCode": defaultCode,
            "defaultTests": [["[[\"0\",\"0\",\"0\",\"0\"],[\"P0\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"P1\"],[\"0\",\"0\",\"0\",\"0\"]]","[[1,0],[2,3]]"],
                ["[[\"0\",\"0\",\"0\",\"0\"],[\"BU\",\"P1\",\"0\",\"0\"],[\"0\",\"0\",\"P0\",\"BL\"],[\"0\",\"0\",\"0\",\"0\"]]","[[2,2],[1,1]]"]]}

    }

}


const pythonCode= `import script
result = script.function({0},{1})
print(result)`

const defaultCode= `def function(board, coords):
  return "MU"`
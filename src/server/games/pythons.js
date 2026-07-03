import {Game} from "./game.js";

//Game Class for Pythons game
export class Pythons extends Game{

    //constrictor lol
    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("Pythons must have 2 players")
        }
        this.size = [20,20]
        this.turn=0;
        this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill("0"));

        this.pLocs=[[this.size[0]/2-1,this.size[1]/4-1],[this.size[0]/2,this.size[1]*3/4]]
        this.board[this.pLocs[0][0]][this.pLocs[0][1]]="P0"
        this.board[this.pLocs[1][0]][this.pLocs[1][1]]="P1"

    }

    isEnded(){
        return this.pLocs[0]===null||this.pLocs[1]===null
    }


    getResults(){
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
        const playerNum = this.turn%2
        const curPlayer = this.players[playerNum]
        const result = await curPlayer([Pythons.boardToPyArray(this.board,playerNum),Pythons.pLocsToPyArray(this.pLocs,playerNum)])
        const dict={"U":[-1,0],"D":[1,0],"L":[0,-1],"R":[0,1]}

        //error or invalid choice, other player wins
        if(result===null || !(result in dict)){
            this.board[this.pLocs[playerNum][0]][this.pLocs[playerNum][1]]="1"
            this.pLocs[playerNum]=null
        }
        else{
            const direction = dict[result]
            const oldCoord = this.pLocs[playerNum]
            const newCoord = [this.pLocs[playerNum][0]+direction[0],this.pLocs[playerNum][1]+direction[1]]
            this.board[oldCoord[0]][oldCoord[1]]="1"
            if(newCoord[0]>=this.size[0]||newCoord[0]<0||newCoord[1]>=this.size[1]||newCoord[1]<0||this.board[newCoord[0]][newCoord[1]]!=="0"){
                this.pLocs[playerNum]=null
            }
            else{
                this.board[newCoord[0]][newCoord[1]]=("P"+playerNum)
                this.pLocs[playerNum]=newCoord
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
        return {"name":"Pythons",
            "description":"In this game, two agents will take choosing which direction to move their snake. The snake grows from where they move. If you run into your tail, your opponents tail, or a wall, you lose. Input is a 2D list showing a board.\"0\" is empty, \"1\" is the tail of a snake, and \"P0\" is your player and \"P1\"is the opposing player. Return \"U\",\"D\",\"L\",\"R\" for which direction your python should move. (0,0) is the top-left of the board.",
            "defaultCode": defaultCode,
            "defaultTests": [["[[\"0\",\"0\",\"0\",\"0\"],[\"P0\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"P1\"],[\"0\",\"0\",\"0\",\"0\"]]","[[1,0],[2,3]]"],
                ["[[\"0\",\"0\",\"0\",\"0\"],[\"1\",\"P1\",\"0\",\"0\"],[\"0\",\"0\",\"P0\",\"1\"],[\"0\",\"0\",\"0\",\"0\"]]","[[2,2],[1,1]]"],
            ["[[\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"1\",\"P0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"1\",\"1\",\"1\",\"1\",\"1\",\"P1\",\"0\",\"0\",\"0\",\"0\",\"1\",\"1\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"1\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"]]","[[8,15],[9,9]]"]]}
    }

}

const pythonCode= `import script
result = script.function({0},{1})
print(result)`

const defaultCode= `def function(boards, coords):
  return "U"`
import {Game} from "./game.js";

//Game Class for Pythons game
export class Othello extends Game{

    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("Othello must have 2 players")
        }
        this.size = [8,8]
        this.turn=0;
        this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill("0"));


        this.board[3][4]="B"
        this.board[4][3]="B"
        this.board[3][3]="W"
        this.board[4][4]="W"

    }

    //Todo
    isEnded(){
        return false
    }


    //Todo
    getResults(){
        const p0Win = this.pLocs[1]===null
        return [p0Win,1-p0Win]
    }

    //todo
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


    //Todo
    async nextTurn(){
        const playerNum = this.turn%2
        const curPlayer = this.players[playerNum]

        //Insert logic for skipping turn

        const result = await curPlayer([Othello.boardToPyArray(this.board,playerNum)])

        //error or invalid choice, other player wins
        let coords
        try{
            coords = json.parse(result)
        }
        catch(e){
            //bad move code
        }
        if(coords.length!==2 || coords[0]<0||coords[0]>=this.size[0]||coords[1]<0||coords[1]>=this.size[1]){
            //Bad move code
        }
        else{

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

    //Todo
    viewGame(){
        return structuredClone(this.board);
    }

    static numPlayers(){
        return 2;
    }

    static getCode(){
        return pythonCode;
    }

    //Todo
    static getInfo(){
        return {"name":"Pythons",
            "description":"In this game, two players will take turns choosing which direction to move their snake. The snake grows from where they move. If you run into your tail, your opponents tail, or a wall, you lose. Input is a 2D list showing a board.\"0\" is empty, \"1\" is the tail of a snake, \"P0\" is your player and \"P1\"is the opposing player. Return \"U\",\"D\",\"L\",\"R\" for which direction your python should move. (0,0) is the top-left of the board. coords[0] has your coordinates, coords[1] has your opponents coordinates.",
            "defaultCode": defaultCode,
            "defaultTests": [["[[\"0\",\"0\",\"0\",\"0\"],[\"P0\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"P1\"],[\"0\",\"0\",\"0\",\"0\"]]","[[1,0],[2,3]]"],
                ["[[\"0\",\"0\",\"0\",\"0\"],[\"1\",\"P1\",\"0\",\"0\"],[\"0\",\"0\",\"P0\",\"1\"],[\"0\",\"0\",\"0\",\"0\"]]","[[2,2],[1,1]]"]]}
    }

}

//Todo
const pythonCode= `import script
result = script.function({0},{1})
print(result)`

//Todo
const defaultCode= `def function(board, coords):
  return "U"`
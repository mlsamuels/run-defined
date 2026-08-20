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
        this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill("G"));
        this.skips=0;
        this.ended=false;

        this.board[3][4]="0"
        this.board[4][3]="0"
        this.board[3][3]="1"
        this.board[4][4]="1"
    }

    isEnded(){
        return this.ended;
    }

    getResults(){
        const counts=[0,0]
        for(let y=0;y<this.size[0];y++){
            for(let x=0;x<this.size[1];x++){
                if(this.board[y][x]==="0"){
                    counts[0]++;
                }
                if(this.board[y][x]==="1"){
                    counts[1]++;
                }
            }
        }
        if(counts[0]===counts[1]){
            return [0.5,0.5]
        }
        const p0Win = counts[0]>counts[1]?1:0
        return [p0Win,1-p0Win]
    }

    static boardToPyArray(board, player){
        let pyString="[["
        for(let i=0;i<board.length;i++){
            for(let j=0;j<board[i].length;j++){
                if(board[i][j]==="0"){
                    pyString+="\""+(player)+"\""
                }
                else if(board[i][j]==="1"){
                    pyString+="\""+(1-player)+"\""
                }
                else {
                    pyString += "\"E\""
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

    validMoves(){
        const valid=[]
        for(let y=0;y<this.size[0];y++){
            for(let x=0;x<this.size[1];x++){
                if(this.isValidMove([y,x])){
                    valid.push([y,x])
                }
            }
        }
        return valid
    }

    isValidMove(move){
        if(move[0]<0||move[1]<0||move[0]>=this.size[0]||move[1]>=this.size[1] || this.board[move[0]][move[1]]!=="G"){
            return false;
        }

        const player=""+this.turn%2

        let failure=[0,0,0,0,0,0,0,0]
        let directions=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]
        for(let dist=1;dist<Math.max(this.size[0],this.size[1]);dist++){
            for(let i=0;i<8;i++){
                if(failure[i]===1){
                    continue;
                }
                const coord=[move[0]+directions[i][0]*dist,move[1]+directions[i][1]*dist]
                if(coord[0]<0||coord[1]<0||coord[0]>=this.size[0]||coord[1]>=this.size[1]){
                    failure[i]=1;
                    continue;
                }
                if(this.board[coord[0]][coord[1]]==="G"){
                    failure[i]=1;
                    continue;
                }
                if(this.board[coord[0]][coord[1]]===player){
                    if(dist===1){
                        failure[i]=1;
                    }
                    else{
                        return true
                    }
                }
            }
        }
    }

    makeMove(move){

        const player=""+this.turn%2

        let failure=[0,0,0,0,0,0,0,0]
        let directions=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]
        for(let dist=1;dist<Math.max(this.size[0],this.size[1]);dist++){
            for(let i=0;i<8;i++){
                if(failure[i]===1){
                    continue;
                }
                const coord=[move[0]+directions[i][0]*dist,move[1]+directions[i][1]*dist]
                if(coord[0]<0||coord[1]<0||coord[0]>=this.size[0]||coord[1]>=this.size[1]){
                    failure[i]=1;
                    continue;
                }
                if(this.board[coord[0]][coord[1]]==="G"){
                    failure[i]=1;
                    continue;
                }
                if(this.board[coord[0]][coord[1]]===player){
                    if(dist===1){
                        failure[i]=1;
                    }
                    else{
                        let chaserCoord=structuredClone(move);
                        while(chaserCoord[0]!==coord[0] || chaserCoord[1]!==coord[1]){
                            this.board[chaserCoord[0]][chaserCoord[1]]=player;
                            chaserCoord[0]+=directions[i][0]
                            chaserCoord[1]+=directions[i][1]
                        }
                        failure[i]=1;
                    }
                }
            }
        }
    }

    async nextTurn(){
        const playerNum = this.turn%2
        const curPlayer = this.players[playerNum]

        //Insert logic for skipping turn
        const validMoves = this.validMoves()
        if(validMoves.length===0 ){
            this.skips++;
            if(this.skips===2){
                this.ended=true;
            }
            this.turn++;
            return;
        }
        this.skips=0;
        const result = await curPlayer([Othello.boardToPyArray(this.board,playerNum),JSON.stringify(validMoves)])
        //error or invalid choice, other player wins
        let coords
        try{
            coords = JSON.parse(result)
        }
        catch(e){
            this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill((1-playerNum)+""));
        }
        const isValidMove = validMoves.some(row =>
            row.length === coords.length && row.every((val, i) => val === coords[i])
        );
        if(!isValidMove){
            this.board=Array.from({ length: this.size[0] }, () => Array(this.size[0]).fill((1-playerNum)+""));
        }
        else{
            this.makeMove(coords);
        }
        this.turn++
    }


    viewGame(){
        return this.board.map(row =>
            row.map(value =>
                (new Map([["0", "1"],["1", "0"],["G","G"]])).get(value)
            )
        );
    }

    static numPlayers(){
        return 2;
    }

    static getCode(){
        return pythonCode;
    }

    static getInfo(){
        return {
            "name": "Othello",
            "description": "In this game, two players will take turns placing pieces on a board. board is a 2D list of pieces, \"0\" are your pieces, \"1\" are your opponents pieces, \"E\" are empty spaces. Return a length 2 list indicating the coordinates you want to place a piece at. [0,0] is the top left. In Othello, you capture opponents pieces by outflanking them. When you place a piece, any of the opponents pieces that are sandwiched between the placed piece and another of your pieces along a row, column, or diagonal switch to being your pieces. Your move must outflank at least one enemy piece. If you cannot make a move your turn is skipped. The game ends when neither player can move, whoever has the most pieces wins. validMoves contains a list of valid moves for convenience.",
            "defaultCode": defaultCode,
            "defaultTests": [["[[\"E\",\"E\",\"E\",\"E\"],[\"E\",\"1\",\"0\",\"E\"],[\"E\",\"0\",\"1\",\"E\"],[\"E\",\"E\",\"E\",\"E\"]]", "[[0,1],[1,0],[2,3],[3,2]]"],
                    ],
            "playerColors": ["#555555", "#AAAAAA"]
        }
    }

}

const pythonCode= `import script
result = script.function({0},{1})
print(result)`


const defaultCode= `def function(board, validMoves):
  return validMoves[0]`
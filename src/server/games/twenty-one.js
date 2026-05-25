import {Game} from "./game.js";

//Game Class for "Think of a bigger number" game
export class TwentyOne extends Game{
    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("TwentyOne must have 2 players")
        }
        this.turn=0;
        this.numbers=[21]
    }

    isEnded(){
        return this.numbers.at(-1)===0;
    }

    getResults(){
        const p0Win = (this.numbers.length+1)%2
        return [p0Win,1-p0Win]
    }

    async nextTurn(){
        const curNumber = this.numbers.at(-1);
        const curPlayer = this.players[(this.numbers.length+1)%2];
        const choice = Number(await curPlayer([""+curNumber]));
        if(choice>3 || choice<1 || choice>curNumber){
            throw new Error("Invalid choice")
        }
        this.numbers.push(curNumber-choice)
    }

    viewGame(){
        const board= new Array(45).fill(null).map(() => new Array(45).fill("0"));

        for(let i = 0;i<this.numbers.at(-1);i++){
            for(let j =1; j < 44;j++){
                board[j][2*i+2]="1"
            }
        }
        return board;
    }

    static numPlayers(){
        return 2;
    }

    static getCode(){
        return pythonCode;
    }

    static getInfo(){
        return {"name":"Twenty One Game",
            "description":"In this game, two agents will take turns taking 1, 2, or 3 sticks, whoever takes the final stick wins.",
            "defaultCode": defaultCode,
            "defaultTests": [["21"],["1"],["2"]]}
    }

}

const pythonCode= `import script
result = script.function({0})
print(result)`

const defaultCode= `def function(input):
  return 1`
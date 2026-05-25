import {Game} from "./game.js";

//Game Class for "Think of a bigger number" game
export class BiggerNumber extends Game{
    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("BiggerNumber must have 2 players");
        }
        this.turn=0;
        this.scores=[0,0];
    }

    isEnded(){
        return this.turn===2;
    }

    getResults(){
        const p0Win = this.scores[0]>this.scores[1]?1:0;
        return [p0Win,1-p0Win];
    }

    async nextTurn(){
        if(this.turn < 2){
            const runResult = await this.players[this.turn]([])
            if(runResult === null){
                this.scores[this.turn]=0;
            }
            else {
                this.scores[this.turn] = Number(runResult);
            }
            this.turn++;
        }
    }

    viewGame(){
        let board= new Array(13).fill(null).map(() => new Array(21).fill("0"));
        if(this.turn > 0){
            board=BiggerNumber.applyArray(BiggerNumber.numberToArray(this.scores[0]),board,[1,1]);
        }
        if(this.turn > 1){
            board=BiggerNumber.applyArray(BiggerNumber.numberToArray(this.scores[1]),board,[7,1]);
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
        return {"name":"Bigger Number",
                "description":"In this game, two agents will try and think of a bigger number. Return the bigger number to win.",
                "defaultCode": defaultCode,
                "defaultTests": [[]]}
    }

    static applyArray(smaller, bigger, offset){
        for (let i = 0; i < smaller.length; i++) {
            for (let j = 0; j < smaller[i].length; j++) {
                bigger[i+offset[0]][j+offset[1]]=smaller[i][j]
            }
        }
        return bigger
    }

    static numberToArray(num){
        num=Math.floor(Math.max(num,0))
        //small
        if((num+"").length<=5){
            if((num+"").length===1){
                return this.digitToArray(num)
            }
            else{
                return this.combineArrayLeftRight(this.combineArrayLeftRight(this.numberToArray(Math.floor(num/10)),[["0"],["0"],["0"],["0"],["0"]]),this.digitToArray(num%10));
            }
        }
        //scientific
        if(Math.log10(num)<=999){
            let toReturn = this.combineArrayLeftRight(this.digitToArray(parseInt((num+"")[0])),[["0","1","1","1","0"],["0","1","0","0","0"],["0","1","1","1","0"],["0","1","0","0","0"],["0","1","1","1","0"]]);
            toReturn = this.combineArrayLeftRight(toReturn, this.numberToArray(Math.log10(num)));
            return toReturn;
        }
        //infinite
        return [["0","1","1","1","0","0","0","1","1","1","0"],
                ["1","0","0","0","1","0","1","0","0","0","1"],
                ["1","0","0","0","0","1","0","0","0","0","1"],
                ["1","0","0","0","1","0","1","0","0","0","1"],
                ["0","1","1","1","0","0","0","1","1","1","0"]]

    }

    static combineArrayLeftRight(left, right){
        if(right.length!==left.length){
            throw new Error("Array heights must be same size to combine")
        }
        const newArray = []
        for(let i = 0; i < left.length; i++){
            newArray.push(left[i].concat(right[i]))
        }
        return newArray;
    }

    static digitToArray(digit){
        switch(digit){
            case 0: return [["1","1","1"],["1","0","1"],["1","0","1"],["1","0","1"],["1","1","1"]]
            case 1: return [["0","0","1"],["0","0","1"],["0","0","1"],["0","0","1"],["0","0","1"]]
            case 2: return [["1","1","1"],["0","0","1"],["1","1","1"],["1","0","0"],["1","1","1"]]
            case 3: return [["1","1","1"],["0","0","1"],["0","1","1"],["0","0","1"],["1","1","1"]]
            case 4: return [["1","0","1"],["1","0","1"],["1","1","1"],["0","0","1"],["0","0","1"]]
            case 5: return [["1","1","1"],["1","0","0"],["1","1","1"],["0","0","1"],["1","1","1"]]
            case 6: return [["1","1","1"],["1","0","0"],["1","1","1"],["1","0","1"],["1","1","1"]]
            case 7: return [["1","1","1"],["0","0","1"],["0","0","1"],["0","0","1"],["0","0","1"]]
            case 8: return [["1","1","1"],["1","0","1"],["1","1","1"],["1","0","1"],["1","1","1"]]
            case 9: return [["1","1","1"],["1","0","1"],["1","1","1"],["0","0","1"],["1","1","1"]]
            default: return -1
        }
    }

}

const pythonCode= `import script
result = script.function()
print(result)`

const defaultCode= `def function():
  return 0`
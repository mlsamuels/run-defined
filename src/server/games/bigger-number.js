import {Game} from "./game.js";


//Game Class for "Think of a bigger number" game
export class BiggerNumber extends Game{
    constructor(players) {
        super(players);
        if(players.length !==2){
            throw new Error("BiggerNumber must have 2 players")
        }
        this.turn=0;
        this.scores=[0,0]
    }

    isEnded(){
        return this.turn===2;
    }

    getResults(){
        const p0Win = this.scores[0]>this.scores[1]?1:0
        return [p0Win,1-p0Win]
    }

    async nextTurn(){
        if(this.turn < 2){
            this.scores[this.turn] = Number(await this.players[this.turn]())
            this.turn++;
        }
    }

    viewGame(){
        throw new Error("Method 'viewGame()' must be implemented.");
    }

    static numPlayers(){
        return 2;
    }

    static getCode(){
        return pythonCode;
    }

}

const pythonCode= `import script
result = script.function()
print(result)`

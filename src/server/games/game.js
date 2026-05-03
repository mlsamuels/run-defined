export class Game {
    players;

    constructor(players){
        if(this.constructor === Game) {
            throw new Error("Abstract classes cannot be instantiated.");
        }
        this.players=players;
    }

    //Don't override this one
    async playAll(){
        while(!this.isEnded()){
            await this.nextTurn()
        }
    }

    isEnded(){
        throw new Error("Method 'isEnded()' must be implemented.");
    }

    async nextTurn(){
        throw new Error("Method 'nextTurn()' must be implemented.");
    }

    viewGame(){
        throw new Error("Method 'viewGame()' must be implemented.");
    }

    getResults(){
        throw new Error("Method 'getResults()' must be implemented.");
    }

    static numPlayers(){
        throw new Error("Method 'numPlayers()' must be implemented.");
    }

    static getCode(){
        throw new Error("Method 'getCode()' must be implemented.");
    }
}


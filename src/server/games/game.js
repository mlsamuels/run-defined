export class Game {
    players;
    visualization=[];
    constructor(players){
        if(this.constructor === Game) {
            throw new Error("Abstract classes cannot be instantiated.");
        }
        this.players=players;
    }

    //Don't override this one
    async playAll(){
        this.visualization.push(this.viewGame())
        while(!this.isEnded()){
            await this.nextTurn()
            this.visualization.push(this.viewGame())
        }
        return this.visualization;
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

    static getInfo(){
        throw new Error("Method 'getInfo()' must be implemented.");
    }
}


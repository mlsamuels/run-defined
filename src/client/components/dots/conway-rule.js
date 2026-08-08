export class conwayRule{

    static universes = [
        [[2,3],[3],0.375,"Conway"],
        [[1,2,3,4],[3],0.1,"Mazectric"],
        [[1,2,3,4,5],[3],0.1,"Maze"],
        [[1,2,3,4],[3,7],0.1, "Mazectric with Mice"],
        [[1,2,3,4,5],[3,7],0.1, "Maze with Mice"],
        [[2,3,4],[3],0.2, "Ant Colony"],
        [[2,3],[3,6],0.2, "High Life"],
        [[3,4,6,7,8],[3,6,7,8],0.5, "Day and Night"],
        [[0,1,2,3,4,5,6,7,8],[3],0.04, "Life without Death"],
        [[4,5,6,7,8],[3],0.5, "Coral"],
        [[0,1,2,3,4,5,6,7,8],[1],0.002, "H-Trees"],
        [[1,2],[3],0.2, "Flock"],
        [[4,5,6,7],[3,4,5],0.4, "Assimilation"],
        [[2,3,4,5,6,7],[3,5],0.2, "Land Rish"],
        [[1,3,5,6,7,8],[3,6,7,8],0.3, "Castles"],
        [[2,3,5,6,7,8],[3,6,7,8],0.2, "Stains"],
        [[2,3,4,5,6,7,8],[5,6,7,8],0.4, "Smoothers"],
        [[8,7,6,5,4],[8,7,6,5],0.6, "Vote"],
        [[0,1,2,3,4,5,6,7].sort(()=>Math.random()-0.5).slice(0,1+Math.random()*5),[1,2,3,4,5,6,7].sort(()=>Math.random()-0.5).slice(0,1+Math.random()*5),Math.random()*0.5+0.05, "Random"]
    ]
    static u = conwayRule.universes[Math.trunc(Math.random()*conwayRule.universes.length)];
    static s= conwayRule.u[0]
    static b=conwayRule.u[1]
    static r=conwayRule.u[2]



    static defaultArray(height, width){
        console.log(conwayRule.u[3]);
        const newArray = Array.from({ length: height }, () =>
            Array(width).fill(null));
        for (let i = 0; i<newArray.length; i++) {
            for (let j = 0; j < newArray[0].length; j++) {
                newArray[i][j]=Math.random()>this.r?"#FFFFFF":"#000000";
            }
        }
        return newArray;
    }

    static update(array){
        const newArray = Array.from({ length: array.length }, () =>
            Array(array[0].length).fill(null));
        for (let i = 0; i<newArray.length; i++){
            for (let j = 0; j<newArray[0].length; j++){
                const count = this.neighborCount(array,i,j)
                if((array[i][j]==="#000000" && conwayRule.s.includes(count-1) || (array[i][j]==="#ffffff" && conwayRule.b.includes(count)))){
                    newArray[i][j]="#000000"
                }
                else{
                    newArray[i][j]="#ffffff"
                }
            }
        }
        return newArray;
    }
    static neighborCount(array, y, x){
        let count=0;
        for(let i=0;i<3;i++){
            for (let j = 0; j<3; j++){
                if(array[(y+i-1+array.length)%array.length][(x+j-1+array[0].length)%array[0].length]==="#000000"){
                    count++;
                }
            }
        }
        return count;
    }
}
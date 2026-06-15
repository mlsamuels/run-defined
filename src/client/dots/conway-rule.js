export class conwayRule{
    static defaultArray(height, width){
        const newArray = Array.from({ length: height }, () =>
            Array(width).fill(null));
        for (let i = 0; i<newArray.length; i++) {
            for (let j = 0; j < newArray[0].length; j++) {
                newArray[i][j]=Math.random()>0.375?"#FFFFFF":"#000000";
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
                if(count===3||(array[i][j]==="#000000" && count===4)){
                    newArray[i][j]="#000000"
                }
                else{
                    newArray[i][j]="#FFFFFF"
                }
            }
        }
        return newArray;
    }
    static neighborCount(array, y, x){
        let count=0;
        for(let i=0;i<3;i++){
            for (let j = 0; j<3; j++){
                if(y+i-1<0||y+i>array.length||x+j-1<0||x+j>array[0].length){
                    continue;
                }
                if(array[y+i-1][x+j-1]==="#000000"){
                    count++;
                }
            }
        }
        return count;
    }
}
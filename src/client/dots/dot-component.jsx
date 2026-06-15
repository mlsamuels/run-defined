
export default function dotComponent(x, y,radius, color, c){
    let curColor= color;
    let toColor= color;
    let requestColor = color;
    let isChanging= false;
    let isDisplayed = false;


    //See if color has changed, animate if it has
    const check = ()=>{
        if(y===81*radius){
            console.log("uo")
        }
        if(isDisplayed&&(requestColor===curColor || isChanging)){
            return
        }

        isDisplayed=true
        toColor=requestColor
        isChanging=true;
        update(0)
    }

    const update = (t)=> {


        const ctx = c.getContext("2d");
        ctx.clearRect(x - radius, y - radius, 2*radius, 2*radius);

        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.fillStyle = toColor;
        ctx.strokeStyle = toColor;
        ctx.ellipse(x, y, radius, radius, 0, 3 * Math.PI / 2, Math.PI / 2);
        ctx.fill();


        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.fillStyle = curColor;
        ctx.strokeStyle = curColor;
        ctx.ellipse(x, y, radius, radius, 0, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();



        if (t < 1) {
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.fillStyle = curColor;
            ctx.strokeStyle = curColor;
            ctx.ellipse(x, y, Math.cos(t * Math.PI / 2) * radius, radius, 0, 3 * Math.PI / 2, Math.PI / 2);
            ctx.fill();

        }
        else{
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.fillStyle = toColor;
            ctx.strokeStyle = toColor;
            ctx.ellipse(x, y, -Math.cos(t * Math.PI / 2) * radius, radius, 0, Math.PI / 2, 3 * Math.PI / 2);
            ctx.fill();
        }


        t += 0.1
        if (t >= 2) {
            ctx.clearRect(x - radius, y - radius, 2*radius, 2*radius);
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.fillStyle = toColor;
            ctx.strokeStyle = toColor;
            ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI *2);
            ctx.fill();

            curColor=toColor
            isChanging=false
            check()
        } else {
            setTimeout(update, 10, t)
        }
    }

    return {
        setColor(color) {
            requestColor = color;
            check();
        }
    };
}
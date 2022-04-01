const gravity = 1;
const line = (x0,y0,x1,y1) => {ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}
class Bird{
    constructor(baseWeights){
        this.x = 100;
        this.r = 18;
        this.velocity = 0;
        this.y = canvas.height / 2;
        this.score = 0;
        if(baseWeights){
            this.weights = [];
            for(let i = 0; i < baseWeights.length; i++){
            this.weights.push(baseWeights[i] + random(-0.15,0.15));
            }
        } else {
            this.weights = [];
            for(let i = 0; i < NUMBER_OF_INPUTS; i++){
                this.weights.push(random(-1,1))
            }
        }
    }
    show(){
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        line(this.x,this.y-this.r/2,this.x,this.y+this.r/2);
        line(this.x-this.r/2,this.y,this.x,this.y+(this.velocity > 0 ? 1 : -1)*this.r/2);
        line(this.x+this.r/2,this.y,this.x,this.y+(this.velocity > 0 ? 1 : -1)*this.r/2);
    }
    up(){
        this.velocity -= 14;
    }
    guess(inputs){
        let sum = inputs.reduce((total,vl,i)=>total+vl*this.weights[i],0);
        // Sigmoid
        // return 1/(1+Math.E**-sum)
        // ReLu
        return sum >= 0 ? sum : 0;
    }
    update(c){
        // Constrain velocity
        if(this.velocity < -14)
        this.velocity = -14;
        else if(this.velocity > 14)
        this.velocity = 14

        // update velocity and position
        this.velocity += gravity;
        this.y += this.velocity;
        // if(this.y+this.r > canvas.height){
        //   this.velocity = 0;
        //   this.y = canvas.height-this.r;
        // } else if (this.y-this.r < 0){
        //   this.velocity = gravity;
        //   this.y = this.r;
        // }
        this.score++;
        let input = [this.y, pipes[c].y-this.y, this.y-(pipes[c].y+pipes[c].spacingY), pipes[c].x-this.x];
        if(this.guess(input) > 1){
        this.up();
        }
    }
}
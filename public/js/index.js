const POP_LIMIT = 2500;
const GENERATION_LIMIT = 3;
const NUMBER_OF_INPUTS = 4;
const $ = (id) => document.getElementById(id);
const map = (vl,mn,mx,nmn,nmx)=>(vl-mn)/(mx-mn)*(nmx-nmn)+nmn;
const random = (mn,mx)=>Math.random()*(mx-mn)+mn;
let vScore = 0;
let birds = [];
let pipes = [];
let generation = 1;
let pipeSettings = {spacingY: 150, spacingX: 200, width: 75, speed: 5}

function nextGeneration(bestBirds){
    console.log(`Generation: ${++generation}`);
    // console.log("Previous generation's score "+vScore);
    birds = bestBirds.slice();
    let bestWeights = [];
    for(let i = 0; i < bestBirds[0].weights.length; i++){
        bestWeights.push(0);
    }
    for(let i = 0; i < bestBirds.length; i++)
        for(let b = 0; b < bestBirds[i].weights.length; b++)
            bestWeights[b] += bestBirds[i].weights[b] / bestBirds.length;
    console.log(...bestWeights);
    for(let i = 0; i < POP_LIMIT-bestBirds.length; i++){
        birds.push(new Bird(bestWeights))
    }
    console.log(birds.length);
    clearInterval(itr);
    //Kill all and reset
    pipes = [];
    // $("weights").innerHTML = "<ul>";
    // bestWeights.forEach((vl, i) => {
    //   $("weights").innerHTML += `<li>${vl}</li>`;
    // });
    // $("weights").innerHTML += "</ul>";
    $("weights").textContent = bestWeights.map(vl=>map(vl,-1,1,0,255).toString(16).split(".").join("")).join("X");
    setTimeout(init,50);
}
function start(){
    $("btndiv").setAttribute('hidden','');
    document.body.removeAttribute("style");
    document.body.style.backgroundColor = "#00101f";
    $("ediv").removeAttribute('hidden');
    window.canvas = $("canvas");
    window.ctx = canvas.getContext("2d");
    for(let i = 0; i < POP_LIMIT; i++){
        birds.push(new Bird());
    }
    init();
}
function init(){
    $("gen").textContent = generation;
    $("score").textContent = 0;
    let temp = false;
    pipes.push(new Pipe());
    window.itr = window.setInterval(function(){
        // Reset canvas
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // Update the pipes
        for(let i = 0; i < pipes.length; i++){
            pipes[i].show();
            pipes[i].update();
        }
        // Update the birds
        for(let i = 0; i < birds.length; i++){
            let c = 0; // closest index
            let cD = Infinity; // closest distance
            for(let j = 0; j < pipes.length; j++){
                if(pipes[j].x - birds[i].x < cD && (pipes[j].x + pipes[j].width) > (birds[i].x + birds[i].r)){
                    cD = pipes[j].x - birds[i].x;
                    c = j;
                }
            }
            birds[i].update(c);
            birds[i].show();
            // Collision detection to kill birds
            if( (birds[i].x + birds[i].r >= pipes[c].x && (birds[i].y + birds[i].r >= pipes[c].y + pipes[c].spacingY || birds[i].y - birds[i].r <= pipes[c].y)) || (birds[i].y < 0) || (birds[i].y > canvas.height) )
                birds.splice(i, 1);
            $("birds").textContent = birds.length;
        }
        // Remove and add pipes 
        if(pipes.length > 0){
            if(pipes[pipes.length-1].x+pipes[pipes.length-1].width <= canvas.width-pipes[pipes.length-1].spacingX){
                pipes.push(new Pipe());
            }
            if(pipes[0].x + pipes[0].width < 0){
                pipes.splice(0,1);
                $("score").textContent++;
            }
        }
        if(birds.length <= GENERATION_LIMIT)
            nextGeneration(birds);
    }, 2);
}

function parseQuery(){
    if(this.location.href.split("").includes("?")){
        this.location.href.split("?")[1].split("&").map(vl=>vl.split("=")).forEach((item, i) => {
        if(item[1] != ""){
            if(Object.keys(item[0]).contains(item[0])){
            pipeSettings[item[0]] = item[1];
            }
        }
        });
    }
}
window.addEventListener("load", parseQuery);

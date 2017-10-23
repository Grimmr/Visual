//=========================IGNORE======================+
var fft,            // Allow us to analyze the song    |
    numBars = 8192, // Power of 2 from 16 to 1024      |
    song;           // The p5 sound object             |
//=========================IGNORE======================+

//Custom frequency bands. 9 boundaries -> 8 channels
//(Would be able to have overlapping channels in the circuit)
let bands = [64,200,2000,20000]

//=======================Load the song================================+
document.getElementById("audiofile").onchange = function(event) {   //|
    if(event.target.files[0]) {                                     //|
        // Catch already playing songs                              //|
        if(typeof song != "undefined") {                            //|
            song.disconnect()                                       //|
            song.stop()                                             //|
        }                                                           //|
        // Load our new song                                        //|
        song = loadSound(URL.createObjectURL(event.target.files[0]))//|
    }                                                               //|
}                                                                   //|
//====================================================================+


var canvas
var started = false
function setup() { // Setup p5.js
    canvas = createCanvas(600,600)
}

let oldPhase = 0

var values = []

//Runs every animation frame (60 fps)
function draw() {
	//Deal with playing song & do fft
    if(typeof song != "undefined" && song.isLoaded() && !started) { 
        started = true
        song.play()
        song.setVolume(0.5)
        fft = new p5.FFT()
        fft.waveform(numBars)
    }
    
    //Drawing settings
    background(200)
    stroke(51)
    strokeWeight(1)

    //If the song is playing
    if(typeof song != "undefined" && started){
        //Get the fft data
        var spectrum = fft.analyze()
        
		//For each virtaul band
		var total = 0 //sum total of energy
		var bandEnergy = [0,0,0]  //band energy levels
		let upperEnergyBound = [100, 200, 100];
        for(let i=0; i<3; i++){
            //Get the value for that band
            let h = fft.getEnergy(bands[i],bands[i+1])
			bandEnergy[i] = h;
			if(h > upperEnergyBound)
			{
				console.log("Upper energy band exceeded")
			}
        }
		fill(255*(bandEnergy[0]/upperEnergyBound[0]), 255*(bandEnergy[1]/upperEnergyBound[1]), 255*(bandEnergy[2]/upperEnergyBound[2]))
		
		//seires of ifs to find phase location
		console.log(bandEnergy[2])

		
		rect(0,0,600,595)
    }
	
	
}

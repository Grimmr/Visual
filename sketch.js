//=========================IGNORE======================+
var fft,            // Allow us to analyze the song    |
    numBars = 1024, // Power of 2 from 16 to 1024      |
    song;           // The p5 sound object             |
//=========================IGNORE======================+

//Custom frequency bands. 9 boundaries -> 8 channels
//(Would be able to have overlapping channels in the circuit)
let bands = [64,125,250,500,1000,2000,4000,8000,20000]

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

var upperPercentLimit = 0.0
var lowerPercentLimit = 1.0

var values = []

//Runs every animation frame (60 fps)
function draw() {
	//
	upperPercentLimit -= (upperPercentLimit-lowerPercentLimit)/600
	lowerPercentLimit += (upperPercentLimit-lowerPercentLimit)/600
	
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
		var bandTotals = 0  //band energy levels
        for(let i=0; i<8; i++){
            //Get the value for that band
            let h = fft.getEnergy(bands[i],bands[i+1])
			total += h
			bandTotals += (bands[i]+bands[i+1]/2)*h //linear interpolation to find bands center (should maybe be exp) multiplied by energy
        }
		//find average freq
		var targetFreq = bandTotals/total
		//select color
		var phase = log(targetFreq - 64)
		var upperLimit = log(15000-64)
		var rawPercentPhase = phase/upperLimit - .25

		
		if(rawPercentPhase + .1 > upperPercentLimit)
		{
			upperPercentLimit = rawPercentPhase + .1
		}
		if(rawPercentPhase < lowerPercentLimit)
		{
			lowerPercentLimit = rawPercentPhase
		}
		
		var percentPhase = ((rawPercentPhase - lowerPercentLimit)/(upperPercentLimit - lowerPercentLimit))
		
		//seires of ifs to find phase location
		console.log(rawPercentPhase)
		if(percentPhase <= 1/5)
		{
			fill(256, 0, 256*(percentPhase/(1/5)))
		}
		else if(percentPhase <= 2/5)
		{
			fill(256-(256*((percentPhase-(1/5))/(1/5))), 0, 256)
		}
		else if(percentPhase <= 3/5)
		{
			fill(0, 256*(percentPhase-(2/5))/(1/5), 256)
		}
		else if(percentPhase <= 4/5)
		{
			fill(0, 256, 256-(256*((percentPhase-(4/5))/(1/5))))
		}
		else if (percentPhase <= 5/5)
		{
			fill(256*(percentPhase-(4/5))/(1/5), 256, 0)
		}
		
		rect(0,0,600,595)
		fill(255,0,0)
		rect(600*lowerPercentLimit-3,595,6,5)
		fill(0,255,0)
		rect(600*upperPercentLimit-3,595,6,5)
		fill(0,0,255)
		rect(600*rawPercentPhase,595,6,5)
    }
	
	
}

var menuDiv = document.querySelector('.menuDiv');
var handle = document.querySelector('.handle');
var bpmDisplay = document.querySelector('.bpm');
var ul = document.querySelector('.tracks');
var selections = document.querySelectorAll('select'); //*


///////////////////////////////////////////////
// Setting global vars to 0
//////////////////////////////////////////////
var startTime = null;
var beats = 0;
var bpm = 0;
var style, mood, dance, energy; //*
var hiBpm = 0;
var loBpm = 0;


///////////////////////////////////////////////
// FEWD AJAX request object
//////////////////////////////////////////////
var fewd = {

	getJSON: function(url, success) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.response);
				success(json);
			}
		}
		xhr.open("GET", url);
		xhr.send();
	},

};

///////////////////////////////////////////////
// Constructs URL & Makes request for the JSON feed
//////////////////////////////////////////////
document.addEventListener('submit', getTracks);

function getTracks() {
	console.log('getting tracks');
	var url = 'http://developer.echonest.com/api/v4/song/search?api_key=UZB3M6VGO1LKIAZKW&format=json&results=20&style='+style+'&mood='+mood+'&max_danceability='+dance+'&max_energy='+energy+'&max_tempo='+hiBpm+'&min_tempo='+loBpm;
	fewd.getJSON(url, unpackTracks); // pass url and call unpackTracks to the external fewd. js object. getJSON takes two params, the url and the callback

	console.log('http://developer.echonest.com/api/v4/song/search?api_key=UZB3M6VGO1LKIAZKW&format=json&results=20&style='+style+'&mood='+mood+'&max_danceability='+dance+'&max_energy='+energy+'&max_tempo='+hiBpm+'&min_tempo='+loBpm);
}

///////////////////////////////////////////////
// Unpack Tracks
//////////////////////////////////////////////
function unpackTracks(json) {
	//unpack
	console.log('unpacking tracks');
	var tracks = json['response'];
	for (var i = 0; i < tracks.songs.length; i++) {
			createPlaylist(tracks.songs[i].title, tracks.songs[i].artist_name); // calls createtrack to display the titles
		};

		console.log(tracks);
	}

///////////////////////////////////////////////
// Create the playlist
//////////////////////////////////////////////
function createPlaylist(title, artist_name) {
	var li = document.createElement('li'); // assigns a new li element to a var
	li.textContent = title +'-'+ artist_name; // Dynamically writes the title and wraps it in <li>track title</li>
	ul.appendChild(li); // creates a new <li> under the <ul>

	console.log('playlist written');
}


//////////////////////////////////////////////////////////
// CSS Transition for menu expand
/////////////////////////////////////////////////////////
handle.addEventListener('click', addClass);

function addClass() {
	menuDiv.classList.toggle("menuDivExpand");

}

////////////////////////////////////////////////
// Grab menu selections
///////////////////////////////////////////////
function gatherSelections() {	
	style = selections[0].value;
	mood = selections[1].value;
	dance = selections[2].value;
	energy = selections[3].value;
}

///////////////////////////////////////////////
// Calculate BPM +/-
//////////////////////////////////////////////
function calcBpm() { //function calcBpm(bpm) {
	hiBpm = Math.round(bpm * 1.05);
	loBpm = Math.round(bpm / 1.05);

	getTracks(); // 	getTracks(hiBpm, loBpm);
}



///////////////////////////////////////////////
// Listen for the spacebar
//////////////////////////////////////////////
document.addEventListener('keydown', counter);

function counter(e) {
	e.preventDefault();

	bpmDisplay.value = 0;

	if (e.keyCode == '32') {
		if (beats == 0) {
			startTime = new Date();
		} 
		beats++
		displayBpm();
	}
}

///////////////////////////////////////////////
// Calculate and display the BPM
//////////////////////////////////////////////
function displayBpm() {
	bpmDisplay.value = 0;
	var currentTime = new Date();
	var mSec = currentTime.getTime() - startTime.getTime();
	var mins = mSec / 60000;
	bpmDisplay.value = Math.round((beats -1) / mins);
	bpm = bpmDisplay.value;
	console.log(bpm);
	console.log(mSec);

	////////////////////////////////////////////////////////
	// If no tap for 5 secs, reset and make call for tracks
	///////////////////////////////////////////////////////
	if ( mSec > 5000) {
		console.log('reset');
		//getTracks();
		bpmDisplay.value = 'OK';
		calcBpm(); // calcBpm(bpm);
		reset();
	}
}

function reset() {
	startTime = null;
	beats = 0;
}




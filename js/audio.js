/*var sounds={'shot1':{play:getSecs(true)},
		'shot1E':{play:getSecs(true)},
		'shot2':{play:getSecs(true)},
		'shot2E':{play:getSecs(true)},
		'shotBig':{play:getSecs(true)},
		'shotBigP':{play:getSecs(true)},
		'starUp':{play:getSecs(true)},
		'kill':{play:getSecs(true)}
};*/
var path="/sounds/";
var lib=
	{
		"explode5":new Audio(path+"explode5.wav"),
		"explode4":new Audio(path+"explode4.wav"),
		"explode3":new Audio(path+"explode3.wav"),
		"starUp":new Audio(path+"starUp.wav")
	};

function playSound(name,vol){
	
	lib[name].volume=vol;
	lib[name].play();

}
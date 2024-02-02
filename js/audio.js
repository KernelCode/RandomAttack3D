/*
	define path of sounds and sound lib to play with volume 

 */
var path = "/sounds/";
var lib = {
  explode5: new Audio(path + "explode5.wav"),
  explode4: new Audio(path + "explode4.wav"),
  explode3: new Audio(path + "explode3.wav"),
  starUp: new Audio(path + "starUp.wav"),
};

function playSound(name, vol) {
  lib[name].volume = vol;
  lib[name].play();
}

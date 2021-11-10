import * as T from "three";


let Sound = function () {

	const listener = new T.AudioListener(),
		cache = {};

	return Sound = function ( audio, volume=1, loop=false ) {

		if( cache[audio.Name] ) {

			if( cache[audio.Name].isPlaying ) cache[ audio.Name ].stop();
		}
		else {

			cache[ audio.Name ] = new T.Audio( listener );
			cache[ audio.Name ].setBuffer( audio );
			cache[ audio.Name ].setVolume( volume );
			cache[ audio.Name ].setLoop( loop );
		}

		return cache[ audio.Name ].play();
	};

};


export { Sound };

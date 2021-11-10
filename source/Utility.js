import * as T from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";


function Once( callback ) {

	let called = false;

	return function ( ...values ) {

		if( !called ) {

			called = true;

			return callback( ...values );
		}
	};

}

const Times = ( number, callback ) => [ ...Array(number) ].map( callback );


function Random( from, to=undefined ) {

	if( to === undefined ) {

		to = from;
		from = 0;
	}

	return Math.floor( Math.random() * (to - from) + from );

}


const Font = ( function () {

	const loader = new T.FontLoader();

	return ( name ) => new Promise( (font) => loader.load(`build/assets/${name}.json`, font) );

} )();

const Texture = ( function () {

	const loader = new T.TextureLoader();

	return ( name ) => new Promise( (texture) => loader.load(`build/assets/${name}.jpg`, texture) );

} )();

const Model = ( function () {

	const loader = new ColladaLoader();

	return ( name ) => new Promise( (model) => loader.load(`build/assets/${name}/${name}.dae`, model) );

} )();

const Audio = ( function () {

	const loader = new T.AudioLoader();

	return ( name ) => new Promise( (audio) => loader.load(`build/assets/${name}.mp3`, audio) );

} )();


export { Once, Times, Random, Font, Texture, Model, Audio };

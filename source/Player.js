import * as T from "three";
import { Scene, Camera, Did } from "Game";


const Player = new T.Group();

Scene.add(
	Player.add(
		Camera,
		new T.PointLight( "pink", 10, 15, 2 )
	)
);

Player.position.set( 0, 5, 0 );


Player.HitPoints = 100;


Player.UpdateVisible = () => Scene.traverse( function (e) {

	if( e.Cull ) {

		if( Player.position.distanceTo(e.position) < 250 ) e.visible = true;
		else e.visible = false;
	}
} );


Player.Look = ( function () {

	const THRESHOLD = 0.005,
		LIMIT = 30 * Math.PI / 180,

		euler = new T.Euler( 0, 0, 0, "YXZ" );

	let xOut = 0,
		yOut = 0;

	return function ( xIn=undefined, yIn=undefined ) {

		if( (xIn !== undefined) && (yIn !== undefined) ) {

			xOut = ( Math.abs(xIn) > THRESHOLD ) ? xIn : 0;
			yOut = ( Math.abs(yIn) > THRESHOLD/2 ) ? yIn : 0;
		}
		else {

			euler.setFromQuaternion( Player.quaternion );

			euler.y -= xOut;
			euler.x = Math.max( -LIMIT, Math.min(LIMIT, euler.x-=yOut) );

			Player.quaternion.setFromEuler( euler );

			euler.setFromQuaternion( Camera.quaternion );

			euler.y = Math.max( -LIMIT, Math.min(LIMIT, euler.y-=xOut) );
			euler.x = Math.max( -LIMIT, Math.min(LIMIT, euler.x-=yOut) );

			Camera.quaternion.setFromEuler( euler );
		}
	};

} )();

Player.Go = ( function () {

	const SPEED = 8,
		SWAY = 5,
		DAMP = 37.5,

		vector = new T.Vector3();

	let where = "NOWHERE";

	return function ( value=undefined ) {

		if( typeof(value) === "object" ) {

			const time = value;

			vector.setFromMatrixColumn( Player.matrix, 0 );
			switch( where ) {

				case "FORWARD":

					Player.position.addScaledVector( vector.crossVectors(Player.up, vector), SPEED*time.delta );
				break;
				case "BACKWARD":

					Player.position.addScaledVector( vector.crossVectors(Player.up, vector), -SPEED*time.delta );
				break;
				case "LEFT":

					Player.position.addScaledVector( vector, -SPEED*time.delta );
				break;
				case "RIGHT":

					Player.position.addScaledVector( vector, SPEED*time.delta );
				break;
			}

			if( where !== "NOWHERE" ) {

				Player.position.x += Math.sin( time.elapsed * SWAY ) / DAMP;
				Player.position.y += Math.sin( time.elapsed * SWAY*2 ) / DAMP;
			}
		}
		else if( typeof(value) === "string" ) {

			const direction = value;

			where = ( where === direction ) ? "NOWHERE" : direction;
		}
	};

} )();


Player.GetHit = () => Player.HitPoints -= 0.25;

Player.Score = ( function () {

	let score = 0;

	return () => score += ( Did() === "BEGIN" ) ? 1 : 0;

} )();


export { Player };

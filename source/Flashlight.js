import * as T from "three";
import * as P from "popmotion";
import { Shader } from "Shader";
import { Player } from "Player";
import { Sound } from "Sound";


const SCALE = 0.15,
	UNIFORMS = 0.05,
	SIZE = 0.25,
	COMPLEXITY = 5,
	SHADOW = 128,
	Y = 2.5,
	OFFSET = 5000,
	THRESHOLD = 0.005,
	LIMIT = 15 * Math.PI / 180;


let Flashlight = function ( model, audio ) {

	const mesh = model.scene.children[ 0 ];

	const body = new T.Mesh(
		mesh.geometry.scale( SCALE, SCALE, SCALE ),
		Shader.Set(
			new T.MeshPhongMaterial({
				depthWrite: false,
				transparent: true,
				opacity: 0,
				flatShading: true,
				color: "black"
			}),
			{
				u_Intensity: UNIFORMS,
				u_Speed: UNIFORMS
			},
			"FLASHLIGHT_BODY"
		)
	);

	mesh.material.dispose();


	const cone = new T.Mesh(
		new T.SphereBufferGeometry( SIZE, COMPLEXITY, COMPLEXITY )
			.translate( 0, SIZE, -SIZE*2 ),
		Shader.Set(
			new T.MeshBasicMaterial({
				depthWrite: false,
				transparent: true,
				opacity: 0,
				blending: T.AdditiveBlending,
				color: "pink"
			}),
			{
				u_Intensity: UNIFORMS,
				u_Speed: UNIFORMS
			},
			"FLASHLIGHT_CONE"
		)
	);


	const light = new T.SpotLight( "pink", 0, 1000, 30*Math.PI/180, 1, 1 );

	light.castShadow = true;
	light.shadow.mapSize.set( SHADOW, SHADOW );

	light.position.set( 0, Y, 0 );
	light.target.position.set( 0, Y, -1 );


	Player.add(
		Flashlight = new T.Group()
	);
	Flashlight.add( body, cone, light, light.target );

	Flashlight.position.set( window.innerWidth/OFFSET, -0.5, -1 );


	Flashlight.Visible = false;


	let togglingVisible = false;
	Flashlight.ToggleVisible = function () {

		if( !togglingVisible ) {

			togglingVisible = true;

			const uniforms = [
				body.material.Shader.uniforms,
				cone.material.Shader.uniforms
			];

			P.animate({
				from: UNIFORMS,
				to: UNIFORMS * 5,
				onUpdate: ( value ) => uniforms.map( function (e) {

					e.u_Intensity.value = value;
					e.u_Speed.value = value;
				} ),
				onComplete() {

					togglingVisible = false;

					if( Flashlight.Visible ) {

						body.material.depthWrite = false;
						body.material.opacity = 0;

						cone.material.opacity = 0;

						light.intensity = 0;
					}

					Flashlight.Visible = !Flashlight.Visible;
				},
				duration: 150,
				repeat: 1,
				repeatType: "reverse",
				ease: P.easeOut
			});

			if( !Flashlight.Visible ) {

				body.material.depthWrite = true;
				body.material.opacity = 1;

				cone.material.opacity = 0.05;

				light.intensity = 10;
			}

			Sound( audio, 0.5 );
		}
	};

	Flashlight.Aim = ( function () {

		const euler = new T.Euler( 0, 0, 0, "YXZ" );

		let xOut = 0,
			yOut = 0;

		return function ( xIn=undefined, yIn=undefined ) {

			if( (xIn !== undefined) && (yIn !== undefined) ) {

				xOut = ( Math.abs(xIn) > THRESHOLD ) ? xIn : 0;
				yOut = ( Math.abs(yIn) > THRESHOLD/2 ) ? yIn : 0;
			}
			else {

				euler.setFromQuaternion( Flashlight.quaternion );

				euler.y = Math.max( -LIMIT, Math.min(LIMIT, euler.y-=xOut) );
				euler.x = Math.max( -LIMIT, Math.min(LIMIT, euler.x-=yOut) );

				Flashlight.quaternion.setFromEuler( euler );
			}
		};
	} )();


	Flashlight.Reposition = () => Flashlight.position.x = window.innerWidth / OFFSET;

	Flashlight.Animate = ( time ) => Flashlight.position.y += Math.sin( time.elapsed * 2.5 ) / 1000;


	return Flashlight;

};


export { Flashlight };

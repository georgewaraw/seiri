import * as T from "three";
import * as P from "popmotion";
import { Shader } from "Shader";
import { Scene, Camera } from "Game";
import { Player } from "Player";
import { Sound } from "Sound";


const SCALE = 0.1,
	UNIFORMS = 0.05,
	OFFSET = 5000,
	SHADOW = 128,
	Y = 5,
	DURATION = 150,
	THRESHOLD = 0.005,
	LIMIT = 15 * Math.PI / 180;


let Gun = function ( model, audio ) {

	const mesh = model.scene.children[ 0 ];

	Player.add(
		Gun = new T.Mesh(
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
				"GUN"
			)
		)
	);
	Gun.position.set( window.innerWidth/OFFSET, -0.25, -1 );

	mesh.material.dispose();


	const light = new T.SpotLight( "pink", 0, 100, 75*Math.PI/180, 1, 1 );

	light.castShadow = true;
	light.shadow.mapSize.set( SHADOW, SHADOW );

	light.position.set( 0, Y, 0 );
	light.target.position.set( 0, Y, -1 );

	Gun.add( light, light.target );


	Gun.Visible = false;


	let togglingVisible = false,
		firing = false;

	Gun.ToggleVisible = function () {

		if( !togglingVisible ) {

			togglingVisible = true;

			const uniforms = Gun.material.Shader.uniforms;

			P.animate({
				from: UNIFORMS,
				to: UNIFORMS * 5,
				onUpdate( value ) {

					uniforms.u_Intensity.value = value;
					uniforms.u_Speed.value = value;
				},
				onComplete() {

					togglingVisible = false;

					if( Gun.Visible ) {

						Gun.material.depthWrite = false;
						Gun.material.opacity = 0;
					}

					Gun.Visible = !Gun.Visible;
				},
				duration: DURATION,
				repeat: 1,
				repeatType: "reverse",
				ease: P.easeOut
			});

			if( !Gun.Visible ) {

				Gun.material.depthWrite = true;
				Gun.material.opacity = 1;
			}
		}
	};

	Gun.Aim = ( function () {

		const euler = new T.Euler( 0, 0, 0, "YXZ" );

		let xOut = 0,
			yOut = 0;

		return function ( xIn=undefined, yIn=undefined ) {

			if( (xIn !== undefined) && (yIn !== undefined) ) {

				xOut = ( Math.abs(xIn) > THRESHOLD ) ? xIn : 0;
				yOut = ( Math.abs(yIn) > THRESHOLD/2 ) ? yIn : 0;
			}
			else {

				euler.setFromQuaternion( Gun.quaternion );

				euler.y = Math.max( -LIMIT, Math.min(LIMIT, euler.y-=xOut) );
				euler.x = Math.max( -LIMIT, Math.min(LIMIT, euler.x-=yOut) );

				Gun.quaternion.setFromEuler( euler );
			}
		};
	} )();

	Gun.Fire = ( function () {

		const raycaster = new T.Raycaster(),
			vector = new T.Vector2();

		return function ( x, y ) {

			if( Gun.Visible && !togglingVisible && !firing ) {

				firing = true;

				const uniforms = Gun.material.Shader.uniforms;
				P.animate({
					from: UNIFORMS,
					to: UNIFORMS * 2,
					onUpdate( value ) {

						uniforms.u_Intensity.value = value;
						uniforms.u_Speed.value = value;
					},
					duration: DURATION,
					repeat: 1,
					repeatType: "reverse",
					ease: P.easeOut
				});
				P.animate({
					from: Gun.position.y,
					to: Gun.position.y + 0.25,
					onUpdate: ( value ) => Gun.position.y = value,
					onComplete: () => firing = false,
					duration: DURATION,
					repeat: 1,
					repeatType: "reverse",
					ease: P.easeIn
				});
				P.animate({
					from: light.intensity,
					to: light.intensity + 10,
					onUpdate: ( value ) => light.intensity = value,
					duration: DURATION / 3,
					repeat: 1,
					repeatType: "reverse",
					ease: P.easeInOut
				});

				raycaster.setFromCamera( vector.set(x, y), Camera );
				const intersection = raycaster
					.intersectObjects( Scene.children, true )
					.find( (e) => e.object.isSkinnedMesh );
				if( intersection ) intersection.object.parent.GetHit();

				Sound( audio, 0.5 );
			}
		};
	} )();


	Gun.Reposition = () => Gun.position.x = window.innerWidth / OFFSET;

	Gun.Animate = ( time ) => Gun.position.y += Math.sin( time.elapsed * 2.5 ) / 1000;


	return Gun;

};


export { Gun };

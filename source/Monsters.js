import * as T from "three";
import * as P from "popmotion";
import { Random } from "Utility";
import { Shader } from "Shader";
import { Scene, Did } from "Game";
import { Player } from "Player";


const BRIGHTNESS = 0.05,
	UNIFORMS = 1000,
	SCALE = 0.001,
	DISTANCE = 75,
	RANGE = 5,
	SPEED = 5;


let Monsters = function ( models ) {

	const color = new T.Color( BRIGHTNESS, BRIGHTNESS, BRIGHTNESS );

	Scene.add(
		...Monsters = models.map( function (e, i) {

			e = e.scene;

			let j = -1;
			e.traverse( function (e) {

				if( e.isSkinnedMesh ) {

					Shader.Set(
						e.material,
						{
							u_Intensity: UNIFORMS,
							u_Speed: UNIFORMS
						},
						`MONSTER_${ i }_${ j += 1 }`
					);
					e.material.flatShading = true;
					e.material.color = color;

					e.castShadow = true;
				}
			} );

			e.scale.x *= SCALE;
			e.scale.y *= -SCALE;
			e.scale.z *= -SCALE;

			switch( i ) {

				case 0: // NE

					e.position.set( DISTANCE, 0, -DISTANCE );
					break;
				case 1: // SE

					e.position.set( DISTANCE, 0, DISTANCE );
					break;
				case 2: // SW

					e.position.set( -DISTANCE, 0, DISTANCE );
					break;
				case 3: // NW

					e.position.set( -DISTANCE, 0, -DISTANCE );
					break;
			}


			e.Cull = true; // !


			let gettingHit = false,
				hitPoints = 3;

			e.GetHit = function () { // !

				if( !gettingHit ) {

					gettingHit = true;

					hitPoints -= 1;

					e.traverse( function (f) {

						if( f.isSkinnedMesh ) {

							const uniforms = f.material.Shader.uniforms;

							P.animate({
								from: UNIFORMS,
								to: UNIFORMS - 5000,
								onUpdate( value ) {

									uniforms.u_Intensity.value = value;
									uniforms.u_Speed.value = value;
								},
								onComplete() {

									gettingHit = false;

									if( !hitPoints ) {

										hitPoints = 3;

										switch( i ) {

											case 0: // NE

												e.position.set(
													Player.position.x + Random( DISTANCE, DISTANCE*2 ),
													0,
													Player.position.z - Random( DISTANCE, DISTANCE*2 )
												);
												break;
											case 1: // SE

												e.position.set(
													Player.position.x + Random( DISTANCE, DISTANCE*2 ),
													0,
													Player.position.z + Random( DISTANCE, DISTANCE*2 )
												);
												break;
											case 2: // SW

												e.position.set(
													Player.position.x - Random( DISTANCE, DISTANCE*2 ),
													0,
													Player.position.z + Random( DISTANCE, DISTANCE*2 )
												);
												break;
											case 3: // NW

												e.position.set(
													Player.position.x - Random( DISTANCE, DISTANCE*2 ),
													0,
													Player.position.z - Random( DISTANCE, DISTANCE*2 )
												);
												break;
										}

										Player.Score();
									}
								},
								duration: 225,
								repeat: 1,
								repeatType: "reverse",
								ease: P.easeOut
							});
						}
					} );
				}
			};


			const mixer = new T.AnimationMixer( e );

			mixer.clipAction( e.animations[0] ).play();
			e.Animate = ( delta ) => mixer.update( delta ); // !


			return e;
		} )
	);


	Monsters.Follow = ( time ) => Monsters.map( function (e) {

		if( Did() === "BEGIN" ) {

			e.lookAt( Player.position );

			if( e.position.x < Player.position.x-RANGE ) e.position.x += SPEED * time.delta;
			else if( e.position.x > Player.position.x+RANGE ) e.position.x -= SPEED * time.delta;
			if( e.position.z < Player.position.z-RANGE ) e.position.z += SPEED * time.delta;
			else if( e.position.z > Player.position.z+RANGE ) e.position.z -= SPEED * time.delta;

			if( e.position.distanceTo(Player.position) < 10 ) Player.GetHit();
		}
	} );


	Monsters.Animate = ( time ) => Monsters.map( (e) => e.Animate(time.delta / 4) );


	return Monsters;

};


export { Monsters };

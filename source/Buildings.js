import * as T from "three";
import { Random } from "Utility";
import { Shader } from "Shader";
import { Scene, Map } from "Game";
import { Player } from "Player";


const SIZE = 50,
	THRESHOLD = SIZE * 75 / 100;


let Buildings = function ( textures ) {

	const geometry = ( function () {

		const object = {};
		for( let i=1; i<=9; i+=2 ) object[ i ] = new T.BoxBufferGeometry( SIZE, SIZE*2*i, SIZE );

		return object;
	} )();

	const materials = textures.map( function (e, i) {

		e = e.clone();
		e.needsUpdate = true;

		e.repeat.set( 1, 3 );

		return Shader.Set(
			new T.MeshPhongMaterial({ map: e }),
			{
				u_Intensity: 5,
				u_Speed: 10
			},
			`BUILDINGS_${ i }`
		);
	} );

	Scene.add(
		...Buildings = Map.map( (eR, iR) =>
			[ ...eR ].map( (eC, iC) => {

				if( eC !== "0" ) {

					const mesh = new T.Mesh( geometry[eC], materials[Random(materials.length)] );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					mesh.position.set(
						iC * Map.Spacing - (eR.length * Map.Spacing) / 2 - Map.Spacing / 2,
						0,
						iR * Map.Spacing - (Map.length * Map.Spacing) / 2 - Map.Spacing / 2
					); // ! use position

					mesh.Cull = true; // !

					return mesh;
				}
			} )
		)
			.flat()
			.filter( (e) => e )
	);


	Buildings.UpdateVisible = () => Buildings.map( function (e) {

		if( e.visible && (Player.position.distanceTo(e.position) < THRESHOLD) ) e.visible = false;
	} );


	return Buildings;

};


export { Buildings };

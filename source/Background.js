import * as T from "three";
import { Shader } from "Shader";
import { Scene } from "Game";


const SIZE = 10000,
	HEIGHT = SIZE / 2,
	OPACITY = 0.25;


let Background = function ( textures ) {

	Scene.add(
		Background = new T.Mesh(
			new T.BoxGeometry( SIZE, HEIGHT, SIZE )
				.translate( 0, HEIGHT/2, 0 ),
			textures.map( function (e, i) {

				e = e.clone();
				e.needsUpdate = true;

				const material = Shader.Set(
					new T.MeshPhongMaterial({
						side: T.BackSide,
						transparent: true,
						map: e
					}),
					{
						u_Intensity: 0.01 + (2 - i) * 10,
						u_Speed: 100
					},
					`BACKGROUND_${ i }`
				);
				switch( i ) {

					case 0:

						material.opacity = OPACITY;
						e.repeat.set( 3, 1 );
						break;
					case 1:

						material.opacity = OPACITY;
						e.repeat.set( 3, 3 );
						break;
					case 2:

						material.opacity = OPACITY * 2;
						e.repeat.set( SIZE/2, SIZE/2 );
						break;
				}

				return material;
			} )
		)
	);

	Background.geometry.faces.map( function (e, i) {

		switch( i ) {

			case 0: case 1: case 2: case 3: case 8: case 9: case 10: case 11: // sides: right, left, back, front

				e.materialIndex = 0;
				break;
			case 4: case 5: // top

				e.materialIndex = 1;
				break;
			case 6: case 7: // bottom

				e.materialIndex = 2;
				break;
		}
	} );

	Background.receiveShadow = true;


	return Background;

};


export { Background };

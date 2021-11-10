import * as T from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Shader } from "Shader";
import { Scene, Map } from "Game";


const HEIGHT = 90,
	COMPLEXITY = 4;


let Lampposts = function () {

	const geometry = {
		post: ( function () {

			const geometry = new T.PlaneBufferGeometry( 1, HEIGHT );

			return BufferGeometryUtils.mergeBufferGeometries([
				geometry,
				geometry
					.clone()
					.rotateY( 90 * Math.PI / 180 )
			]);
		} )(),

		lamp: new T.SphereBufferGeometry( 10, COMPLEXITY, COMPLEXITY )
			.translate( 0, HEIGHT/2, 0 )
	};

	const material = {
		post: Shader.Set(
			new T.MeshPhongMaterial({
				side: T.DoubleSide,
				color: "black"
			}),
			{
				u_Intensity: 2,
				u_Speed: 2
			},
			"POSTS"
		),

		lamp: Shader.Set(
			new T.MeshBasicMaterial({
				depthWrite: false,
				transparent: true,
				opacity: 0.05,
				blending: T.AdditiveBlending,
				color: "pink"
			}),
			{
				u_Intensity: 1.2,
				u_Speed: 0.8
			},
			"LAMPS"
		)
	};

	Scene.add(
		...Lampposts = Map.map( (eR, iR) =>
			[ ...eR ].map( (eC, iC) => {

				if( eC === "0" ) {

					const group = new T.Group();
					group.add(
						new T.Mesh( geometry.post, material.post ),
						new T.Mesh( geometry.lamp, material.lamp )
					);

					group.children.map( function (e) {

						e.castShadow = true;
						e.receiveShadow = true;
					} );

					group.position.set(
						iC * Map.Spacing - (eR.length * Map.Spacing) / 2 - Map.Spacing / 2,
						0,
						iR * Map.Spacing - (Map.length * Map.Spacing) / 2 - Map.Spacing / 2
					); // ! use position

					group.Cull = true; // !

					if( group.position.x || group.position.z ) return group;
				}
			} )
		)
			.flat()
			.filter( (e) => e )
	);


	return Lampposts;

};


export { Lampposts };

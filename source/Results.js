import * as T from "three";
import { Shader } from "Shader";
import { Camera } from "Game";
import { Player } from "Player";


const SIZE = 0.15;


let Results = function ( font ) {

	Camera.add(
		Results = new T.Mesh(
			new T.TextBufferGeometry(
				`${ ("0000" + Player.Score()).slice(-4) }\nქულა`,
				{
					font,
					size: SIZE,
					height: SIZE / 10
				}
			)
				.center()
				.translate( 0, 0, -1 ),
			Shader.Set(
				new T.MeshPhongMaterial({ color: "pink" }),
				{
					u_Intensity: 0.05,
					u_Speed: 0.025
				},
				"RESULTS"
			)
		)
	);


	return Results;

};


export { Results };

import * as T from "three";
import { Once } from "Utility";
import { Shader } from "Shader";
import { Player } from "Player";


const SIZE = 0.15;


let Title = function ( font ) {

	Player.add(
		Title = new T.Mesh(
			new T.TextBufferGeometry(
				"სეირი",
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
				"TITLE"
			)
		)
	);


	Title.Remove = Once( function () {

		Player.remove( Title );

		Title.geometry.dispose();
		Title.material.dispose();
	} );


	return Title;

};


export { Title };

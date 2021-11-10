import * as T from "three";
import { Once, Font, Texture, Model, Audio } from "Utility";
import { Shader } from "Shader";
import { Loadscreen, Canvas, Progress, Did, Resize, Render } from "Game";
import { Player } from "Player";
import { Title } from "Title";
import { Flashlight } from "Flashlight";
import { Gun } from "Gun";
import { Background } from "Background";
import { Buildings } from "Buildings";
import { Lampposts } from "Lampposts";
import { Monsters } from "Monsters";
import { Results } from "Results";
import { Sound } from "Sound";


Font( "bpg_extrasquare_mtavruli" ).then( (f_BPG_EXTRASQUARE_MTAVRULI) => Progress() &&
Texture( "building_0" ).then( (t_BUILDING_0) => Progress() &&
Texture( "building_1" ).then( (t_BUILDING_1) => Progress() &&
Texture( "building_2" ).then( (t_BUILDING_2) => Progress() &&
Texture( "building_3" ).then( (t_BUILDING_3) => Progress() &&
Texture( "building_4" ).then( (t_BUILDING_4) => Progress() &&
Texture( "mountain" ).then( (t_MOUNTAIN) => Progress() &&
Texture( "sky" ).then( (t_SKY) => Progress() &&
Texture( "tiles" ).then( (t_TILES) => Progress() &&
Model( "enemy_0" ).then( (m_ENEMY_0) => Progress() &&
Model( "enemy_1" ).then( (m_ENEMY_1) => Progress() &&
Model( "enemy_2" ).then( (m_ENEMY_2) => Progress() &&
Model( "enemy_3" ).then( (m_ENEMY_3) => Progress() &&
Model( "flashlight" ).then( (m_FLASHLIGHT) => Progress() &&
Model( "gun" ).then( (m_GUN) => Progress() &&
Audio( "gunshot" ).then( (a_GUNSHOT) => Progress() &&
Audio( "music" ).then( (a_MUSIC) => Progress() &&
Audio( "toggle" ).then( function (a_TOGGLE) {

	a_GUNSHOT.Name = "GUNSHOT"; // !
	a_MUSIC.Name = "MUSIC"; // !
	a_TOGGLE.Name = "TOGGLE"; // !


	const textures = [ t_BUILDING_0, t_BUILDING_1, t_BUILDING_2, t_BUILDING_3, t_BUILDING_4, t_MOUNTAIN, t_SKY, t_TILES ];

	textures.map( function (e) {

		e.wrapS = T.MirroredRepeatWrapping;
		e.wrapT = T.MirroredRepeatWrapping;

		e.magFilter = T.NearestFilter;
		e.minFilter = T.NearestFilter;
	} );

	Title( f_BPG_EXTRASQUARE_MTAVRULI );
	Flashlight( m_FLASHLIGHT, a_TOGGLE );
	Gun( m_GUN, a_GUNSHOT );
	Background([ t_MOUNTAIN, t_SKY, t_TILES ]);
	Buildings([ t_BUILDING_0, t_BUILDING_1, t_BUILDING_2, t_BUILDING_3, t_BUILDING_4 ]);
	Lampposts();
	Monsters([ m_ENEMY_0, m_ENEMY_1, m_ENEMY_2, m_ENEMY_3 ]);

	textures.map( (e) => e.dispose() );


	Loadscreen.remove();

	Canvas.addEventListener( "touchstart", (e) => e.preventDefault() );


	function resize() {

		Resize();

		Flashlight.Reposition();
		Gun.Reposition();
	}

	const begin = Once( function () {

		Sound();
		Sound( a_MUSIC, 1, true );

		Flashlight.ToggleVisible();
		Title.Remove();

		Did( "BEGIN" );
	} );
	function end() {

		if( (Did() === "BEGIN") && (Player.HitPoints < 0) ) {

			Did( "END" );

			Player.Look( 0, 0 );
			Player.Go( "NOWHERE" );

			if( Flashlight.Visible ) Flashlight.ToggleVisible();
			if( Gun.Visible ) Gun.ToggleVisible();
			Results( f_BPG_EXTRASQUARE_MTAVRULI );
		}
	}
	let i = 0;
	function restart() {

		if( (Did() === "END") && ((i+=1) > 1) ) window.location.reload();
	}

	function toggleEquipment() {

		Flashlight.ToggleVisible();
		Gun.ToggleVisible();
	}

	const TIME = 200,
		THRESHOLD = 0.1,
		DAMP = 40;

	let then = 0,
		touches = 0,
		xStart = 0,
		yStart = 0;
	window.addEventListener( "touchstart", function (e) {

		then = Date.now();

		touches = e.targetTouches.length;

		xStart = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
		yStart = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;
	} );
	window.addEventListener( "touchend", function (e) {

		if( (Date.now()-then < TIME) && (Did() === "BEGIN") ) {

			if( touches < 2 ) {

				const xEnd = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1,
					yEnd = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;

				if( (Math.abs(xStart-xEnd) < THRESHOLD) && (Math.abs(yStart-yEnd) < THRESHOLD) ) Gun.Fire( xEnd, yEnd ); // TAP
				else if( (Math.abs(xStart-xEnd) < THRESHOLD*2) && (Math.abs(yStart-yEnd) > THRESHOLD) ) {

					if( yStart-yEnd < 0 ) Player.Go( "FORWARD" ); // UP SWIPE
					else Player.Go( "BACKWARD" ); // DOWN SWIPE
				}
				else if( (Math.abs(xStart-xEnd) > THRESHOLD) && (Math.abs(yStart-yEnd) < THRESHOLD*2) ) {

					if( xStart-xEnd > 0 ) Player.Go( "LEFT" ); // LEFT SWIPE
					else Player.Go( "RIGHT" ); // RIGHT SWIPE
				}
			}
			else toggleEquipment();
		}

		Player.Look( 0, 0 );
		Flashlight.Aim( 0, 0 );
		Gun.Aim( 0, 0 );

		begin();
		restart();
	} );

	window.addEventListener( "pointermove", function (e) {

		if( (Date.now()-then > TIME) && (Did() === "BEGIN") ) {

			const x = e.clientX / window.innerWidth * 2 - 1,
				y = e.clientY / window.innerHeight * -2 + 1;

			Player.Look( x/DAMP, -y/(DAMP*2) );
			Flashlight.Aim( x/DAMP, -y/(DAMP*2) );
			Gun.Aim( x/DAMP, -y/(DAMP*2) );
		}
	} );

	window.addEventListener( "mousedown", function (e) {

		const x = e.clientX / window.innerWidth * 2 - 1,
			y = e.clientY / window.innerHeight * -2 + 1;

		if( Did() === "BEGIN" ) Gun.Fire( x, y );

		begin();
		restart();
	} );
	window.addEventListener( "keydown", function (e) {

		switch( e.code ) {

			case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":

				e.preventDefault();
			break;
		}
	} );
	window.addEventListener( "keyup", function (e) {

		if( Did() === "BEGIN" ) {

			switch( e.code ) {

				case "ArrowUp": case "KeyW":

					Player.Go( "FORWARD" );
				break;
				case "ArrowDown": case "KeyS":

					Player.Go( "BACKWARD" );
				break;
				case "ArrowLeft": case "KeyA":

					Player.Go( "LEFT" );
				break;
				case "ArrowRight": case "KeyD":

					Player.Go( "RIGHT" );
				break;
				case "KeyQ": case "KeyE":

					toggleEquipment();
				break;
			}
		}
	} );

	window.addEventListener( "resize", resize );
	window.addEventListener( "orientationchange", resize );


	Render([
		Shader.Update,

		Player.UpdateVisible,
		Player.Look,
		Player.Go,

		Flashlight.Aim,
		Flashlight.Animate,

		Gun.Aim,
		Gun.Animate,

		Buildings.UpdateVisible,

		Monsters.Follow,
		Monsters.Animate,

		end
	]);

} ))))))))))))))))));

import * as T from "three";
import { Once } from "Utility";


const Loadscreen = document.querySelector( "div" );

const Canvas = document.querySelector( "canvas" );


const Renderer = ( function () {

	const renderer = new T.WebGL1Renderer({ canvas: Canvas });

	renderer.toneMapping = T.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.25;

	renderer.setPixelRatio( 0.2 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = T.BasicShadowMap;

	return renderer;

} )();

const Scene = ( function () {

	const scene = new T.Scene();

	scene.background = new T.Color( "black" );
	scene.fog = new T.FogExp2( "black", 0.00025 );

	scene.add(
		new T.HemisphereLight( "black", "pink", 1.25 )
	);

	return scene;

} )();

const Camera = new T.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, Number.MAX_SAFE_INTEGER );


const Map = ( function () {

	let map = `
903070509030705010507030905070309
307050103070501090105070301050703
705010907050109030901050709010507
501090305010903070309010503090105
109030701090307050703090107030901
501090305010903070309010503090105
705010907050109030901050709010507
307050103070501090105070301050703
903070509030705010507030905070309
307050103070501090105070301050703
705010907050109030901050709010507
501090305010903070309010503090105
109030701090307050703090107030901
501090305010903070309010503090105
705010907050109030901050709010507
307050103070501090105070301050703
903070509030705010507030905070309
307050103070501090105070301050703
705010907050109030901050709010507
501090305010903070309010503090105
109030701090307050703090107030901
501090305010903070309010503090105
705010907050109030901050709010507
307050103070501090105070301050703
903070509030705010507030905070309
307050103070501090105070301050703
705010907050109030901050709010507
501090305010903070309010503090105
109030701090307050703090107030901
501090305010903070309010503090105
705010907050109030901050709010507
307050103070501090105070301050703
903070509030705010507030905070309
	`;
	map = map.split( "\n" );
	map = map.slice( 1, map.length-1 ); // ! use separate statement

	map.Spacing = 75; // !

	return map;

} )();


const Progress = ( function () {

	let i = 0;

	return () => Loadscreen.innerHTML = `ჩაიტვირთა ${ ("00" + ((i+=1)*100/18).toPrecision(2)).slice(-2) }%`; // ! load 18 files

} )();

const Did = ( function () {

	let did = "NOT BEGIN"; // or "BEGIN" or "END"

	return ( what=undefined ) => did = what || did;

} )();


function Resize() {

	Renderer.setSize( window.innerWidth, window.innerHeight );

	Camera.aspect = window.innerWidth / window.innerHeight;
	Camera.updateProjectionMatrix();

}

const Render = Once( function (callbacks=[]) {

	const time = {
		delta: 0,
		elapsed: 0
	},
		clock = new T.Clock();

	Renderer.compile( Scene, Camera );
	Renderer.setAnimationLoop( function () {

		time.delta = clock.getDelta();
		time.elapsed += time.delta;
		callbacks.map( (e) => e(time) );

		Renderer.render( Scene, Camera );
	} );

} );


export { Loadscreen, Canvas, Renderer, Scene, Camera, Map, Progress, Did, Resize, Render };

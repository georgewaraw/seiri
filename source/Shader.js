const shaders = [];


const Shader = Object.freeze({

	Get: ( function () {

		const cache = {};

		return function ( name=undefined ) {

			if( name === undefined ) return shaders;
			else return cache[ name ] = cache[ name ] || shaders.find( (e) => e.Name === name );
		};
	} )(),

	Set: ( function () {

		const uniforms = `
			uniform float u_Intensity, u_Speed, u_Time;
		`,
			vertexShader = `
			float transform = fract( sin( dot( position.xy + u_Time * u_Speed * 0.000001, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ) * u_Intensity;

			vec3 transformed = position;
			transformed.yz += transform;
		`;

		return function ( material, values, name=undefined ) {

			material.onBeforeCompile = function ( shader ) {

				values.u_Time = 0;
				Object.keys( values ).map( (e) => shader.uniforms[e] = { value: values[e] } );

				shader.vertexShader = uniforms + shader.vertexShader;
				shader.vertexShader = shader.vertexShader.replace( "#include <begin_vertex>", vertexShader );

				shader.Name = name; // !
				material.Shader = shader; // !

				shaders.unshift( shader );
			};

			return material;
		};
	} )(),

	Update: ( time ) => shaders.map( (e) => e.uniforms.u_Time.value = time.elapsed )

});


export { Shader };

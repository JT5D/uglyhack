var renderer, scene, camera, texture, video, mesh;
var startTime = new Date().getTime();
var uniforms;
var params = { invert: false,
			   sat: true,
			   satStrength: 0.2,
			   noise: true,
			   noiseStrength: 0.2,
			   lines: true,
			   lineSize: 550.0,
			   lineStrength: 0.3,
			   lineTilt: 0.5};

$(document).ready(function() {

	if ( !Detector.webgl ) {
		Detector.addGetWebGLMessage({ parent: document.body});
		return;
	}

	var container = $('#scene');
	
	renderer = new THREE.WebGLRenderer();
	container.append( renderer.domElement );
	renderer.setSize(window.innerWidth, window.innerHeight)
	
	camera = new THREE.OrthoCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0, 10 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 1;
	
	scene = new THREE.Scene();

	video = document.getElementById('video');
	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	
	uniforms = {
            video: { 
			type: "t", 
			value: 0, 
			texture: texture
		},
		resolution: { 
			type: "v2", 
			value: new THREE.Vector2( window.innerWidth, window.innerHeight )
		},
		time: {
			type: "f",
			value: 0.0
		},
		invert: {
			type: "i",
			value: params.invert ? 1 : 0
		},
		sat: {
			type: "i",
			value: params.sat ? 1 : 0
		},
		satStrength: {
			type: "f",
			value: params.satStrength
		},
		noise: {
			type: "i",
			value: params.noise ? 1 : 0
		},
		noiseStrength: {
			type: "f",
			value: params.noiseStrength
		},
		lines: {
			type: "i",
			value: params.lines ? 1 : 0
		},
		lineSize: {
			type: "f",
			value: params.lineSize
		},
		lineStrength: {
			type: "f",
			value: params.lineStrength
		},
		lineTilt: {
			type: "f",
			value: params.lineTilt
		}
	};
	
	var shaderMaterial = new THREE.MeshShaderMaterial({
	    vertexShader:   $('#vertexshader').text(),
	    fragmentShader: fragmentshader,
	    uniforms: uniforms
	}); 

    mesh = new THREE.Mesh( new THREE.PlaneGeometry(window.innerWidth,window.innerHeight,1,1), shaderMaterial );
    scene.addObject( mesh );
    
	var gui = new DAT.GUI({
		height : 9 * 32 - 1
	}); 
	gui.add(params, 'invert').onChange(function(newValue) {
		uniforms.invert.value = newValue ? 1 : 0;
	});
	gui.add(params, 'sat').onChange(function(newValue) {
		uniforms.sat.value = newValue ? 1 : 0;
	});
	gui.add(params, 'satStrength').min(0).max(4).step(0.05).onChange(function(newValue) {
		uniforms.satStrength.value = newValue;
	});
	gui.add(params, 'noise').onChange(function(newValue) {
		uniforms.noise.value = newValue ? 1 : 0;
	});
	gui.add(params, 'noiseStrength').min(0).max(4).step(0.05).onChange(function(newValue) {
		uniforms.noiseStrength.value = newValue;
	});
	gui.add(params, 'lines').onChange(function(newValue) {
		uniforms.lines.value = newValue ? 1 : 0;
	});
	gui.add(params, 'lineSize').min(10).max(1000).step(10).onChange(function(newValue) {
		uniforms.lineSize.value = newValue;
	});
	gui.add(params, 'lineStrength').min(0).max(1).step(0.05).onChange(function(newValue) {
		uniforms.lineStrength.value = newValue;
	});
	gui.add(params, 'lineTilt').min(0).max(1).step(0.05).onChange(function(newValue) {
		uniforms.lineTilt.value = newValue;
	});
    
    
	animate();
});

function animate() {
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		if ( texture ) texture.needsUpdate = true;
	}
	uniforms.time.value = (new Date().getTime() - startTime) / 1000.0;
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
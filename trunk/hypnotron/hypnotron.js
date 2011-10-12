var renderer, scene, camera, video;
var texture = new Array();
var startTime = new Date().getTime();
var uniforms;

$(document).ready(function() {

	if ( !Detector.webgl ) {
		Detector.addGetWebGLMessage({ parent: document.body });
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
	
	uniforms = {
        video0: { 
			type: "t", 
			value: 0, 
			texture: texture[0]
		},
		resolution: { 
			type: "v2", 
			value: new THREE.Vector2( window.innerWidth, window.innerHeight )
		},
		time: {
			type: "f",
			value: 0.0
		}
	};
	
	var shaderMaterial = new THREE.MeshShaderMaterial({
	    vertexShader:   $('#vertexshader').text(),
	    fragmentShader: fragmentshader,
	    uniforms: uniforms
	});
	
    var mesh = new THREE.Mesh( new THREE.PlaneGeometry(window.innerWidth,window.innerHeight,1,1), shaderMaterial );
    scene.addObject( mesh );

	animate();
});

function animate() {
	uniforms.time.value = (new Date().getTime() - startTime) / 1000.0;
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
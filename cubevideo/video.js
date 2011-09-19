var renderer, scene, camera, texture, video, mesh;

$(document).ready(function() {

	if ( !Detector.webgl ) {
		Detector.addGetWebGLMessage({ parent: document.body});
		return;
	}

	var container = document.createElement('div');
	document.body.appendChild( container );
	
	renderer = new THREE.WebGLRenderer();
	container.appendChild( renderer.domElement );
	renderer.setSize(window.innerWidth, window.innerHeight)
	
	camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.x = 150;
	camera.position.y = 0;
	camera.position.z = 150;
	
	scene = new THREE.Scene();
	
	var pointLight = new THREE.PointLight( 0xFFFFFF );

	pointLight.position.x = 500;
	pointLight.position.y = 0;
	pointLight.position.z = 1500;

	scene.addLight(pointLight);
	
	var pointLight2 = new THREE.PointLight( 0xFFFFFF );

	pointLight2.position.x = -500;
	pointLight2.position.y = 0;
	pointLight2.position.z = -1500;

	scene.addLight(pointLight2); 
	
	var pointLight3 = new THREE.PointLight( 0xFFFFFF );

	pointLight3.position.x = 0;
	pointLight3.position.y = 1000;
	pointLight3.position.z = -500;

	scene.addLight(pointLight3); 

	video = document.getElementById('video');
	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	
	var path = "textures/skybox/";
	var format = '.jpg';
	var urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];
	var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
	
	var material = new THREE.MeshLambertMaterial( { map: texture, envMap: reflectionCube} );

    mesh = new THREE.Mesh( new THREE.CubeGeometry(50,50,50,1,1,1), material );
    scene.addObject( mesh );
    
    var shader = THREE.ShaderUtils.lib["cube"];
    shader.uniforms["tCube"].texture = reflectionCube; // textureCube has been init before
    var cubeMaterial = new THREE.MeshShaderMaterial({
	    fragmentShader : shader.fragmentShader,
	    vertexShader : shader.vertexShader,
	    uniforms : shader.uniforms
    }); 
    
    var skyboxMesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), cubeMaterial );
    scene.addObject( skyboxMesh ); 
    
	animate();
});

function animate() {
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

		if ( texture ) texture.needsUpdate = true;

	}
	mesh.rotation.y -= 0.01;
	mesh.rotation.x -= 0.005;
	
	var timer = - new Date().getTime() * 0.0002; 
	camera.position.x = 150 * Math.cos( timer );
	camera.position.y = 50 * Math.sin( timer );
	camera.position.z = 150 * Math.sin( timer );
	
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
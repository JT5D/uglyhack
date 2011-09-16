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
	
	camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 250;
	camera.position.z = 150;
	camera.position.x = 50;
	
	scene = new THREE.Scene();
	
	var plane = new THREE.CubeGeometry(50,50,50,1,1,1);
	
	video = document.getElementById('video');
	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	
	var material = new THREE.MeshBasicMaterial( { map: texture } );

    mesh = new THREE.Mesh( plane, material );
    mesh.doubleSided = true;
    scene.addObject( mesh );
    
	animate();
});

function animate() {
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

		if ( texture ) texture.needsUpdate = true;

	}
	mesh.rotation.y += 0.01;
	mesh.rotation.x += 0.005;
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
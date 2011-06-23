var renderer, scene, camera;
var nodes = new Array();

var cubeMaterial = new THREE.MeshFaceMaterial();
var textMaterial;
var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );

var v = new THREE.Vector3();

var repulsiveForce = 0.2;
var attractiveForce = 0.00001;

function initTwitterGraph() {

	if ( !Detector.webgl ) {
		Detector.addGetWebGLMessage({ parent: document.getElementById('scene')});
		return;
	}

	var $scene = $('#scene');
	var $container = $('#sceneContainer');
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize($container.width(),$container.height());
	$scene.append(renderer.domElement);
	
	camera = new THREE.TrackballCamera({

		fov: 45, 
		aspect: window.innerWidth / window.innerHeight,
		near: 0.1,
		far: 10000,

		rotateSpeed: 1.0,
		zoomSpeed: 1.2,
		panSpeed: 0.2,

		noZoom: false,
		noPan: false,

		staticMoving: false,
		dynamicDampingFactor: 0.3,

		minDistance: 50,
		maxDistance: 10000,

		domElement: renderer.domElement

	});

	camera.position.z = 350;
	camera.position.x = 100;
	
	var path = "skybox/";
	var format = '.jpg';
	var urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];
	var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
	
	textMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
	
	initScene();
	
	animate();
}

function initScene() {
	scene = new THREE.Scene();
	
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 1030;
	scene.addLight(pointLight);
	
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 500;
	pointLight.position.y = 500;
	pointLight.position.z = -500;
	scene.addLight(pointLight);
	
	nodes = new Array();
}

function getRootNode(_screenName) {
	createNode(_screenName);
	
	theViewport.setLoading(true);
	$.ajax({
		url: 'http://api.twitter.com/1/statuses/friends/' + _screenName + '.json',
		dataType: 'jsonp',
		timeout: 6000,
		success: function(data) {
			theViewport.setLoading(false);
			$.each(data, function(i) {
				createNode(this.screen_name, 0);
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			theViewport.setLoading(false);
			Ext.Msg.alert('Error', 'Could not get user ' + _screenName + ' from Twitter.');
		}
	});
	
	getTwitterRate();

}

function getTwitterData(_screenName) {
	var nodeIndex = getNodeIndexByScreenName(_screenName);
	if(nodeIndex != -1) {
		theViewport.setLoading(true);
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/friends/' + _screenName + '.json',
			dataType: 'jsonp',
			timeout: 6000,
			success: function(data) {
				theViewport.setLoading(false);
				$.each(data, function(i) {
					var newNodeIndex = getNodeIndexByScreenName(this.screen_name);
					if(newNodeIndex == -1) {
						createNode(this.screen_name, nodeIndex);
					} else {
						createFollow(nodes[newNodeIndex], nodeIndex);
					}
				});
				getTwitterRate();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				theViewport.setLoading(false);
				Ext.Msg.alert('Error', 'Could not get user ' + _screenName + ' from Twitter.');
			}
		});
	} else {
		Ext.Msg.alert('Warning', 'A user with name ' + _screenName + ' does not exist in your graph.');
	}
}

function getTwitterRate() {
	$.getJSON(
		'http://api.twitter.com/1/account/rate_limit_status.json?callback=?',
		function(data) {
			var percent = (data.remaining_hits / data.hourly_limit) * 100;
			var $statusText = $('#statusText').html(' ' + percent.toFixed(1) + '% of Twitter API calls remaing. Quota will be reset at ' + data.reset_time);
			if(data.remaining_hits == 0) {
				Ext.Msg.alert('Warning', 'There is currently no more Twitter API calls remaining for you. Your quota will be reset at ' + data.reset_time);
			}
		}
	);
	
}

function animate() {

	//calculate speed for every node
	for(var i = 0; i < nodes.length; i++) {
		//repulsion beetwen all nodes
		for(var j = 0; j < nodes.length; j++) {
			if(i != j) {
				doRepulsion(nodes[i], nodes[j]);
			}
		}
		
		//attraction between followed nodes
		var follows = nodes[i].follows;
		if(follows.length > 0) {
			for(var j = 0; j < follows.length; j++) {
				doAttraction(nodes[i], nodes[follows[j].index]);
			}
		}
		
		//attraction between following nodes
		var followers = nodes[i].followers;
		if(followers.length > 0) {
			for(var j = 0; j < followers.length; j++) {
				doAttraction(nodes[i], nodes[followers[j]]);
			}
		}
		
	}
	
	//update position for every node
	for(var i = 0; i < nodes.length; i++) {
		nodes[i].speed.multiplyScalar(0.95);
		nodes[i].object.position.addSelf(nodes[i].speed);
		var follows = nodes[i].follows;
		if(follows.length > 0) {
			for(var j = 0; j < follows.length; j++) {
				follows[j].line.geometry.__dirtyVertices = true;
			}
		}
		
	}
	
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

function createNode(screenName, followsIndex) {
	var text = new THREE.Mesh(new THREE.TextGeometry(screenName, {size: 5, height: 2, curveSegments: 1}), textMaterial);
	text.position.x = (Math.random()-0.5)*60;
	text.position.y = (Math.random()-0.5)*60;
	text.position.z = (Math.random()-0.5)*60;
	
	var node = {
		id: nodes.length,
		screenName: screenName,
		object: text,
		speed: new THREE.Vector3(),
		follows: [],
		followers: [],
	};

	if(followsIndex != null) {
		createFollow(node, followsIndex);
		text.position.addSelf(nodes[followsIndex].object.position);
	}
	scene.addChild(text);
	nodes.push(node);
}

function createFollow(node, followsIndex) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vertex( nodes[followsIndex].object.position ) );
	geometry.vertices.push( new THREE.Vertex(node.object.position ) );
	
	var line = new THREE.Line(geometry, lineMaterial);
	scene.addChild(line);
	
	node.follows.push({
		index: followsIndex,
		line: line
	});
	nodes[followsIndex].followers.push(node.id);
}

function getNodeIndexByScreenName(screenName) {
	for(var i = 0; i < nodes.length; i++) {
		if(screenName == nodes[i].screenName) {
			return i;
		}
	}
	return -1;
}

function doRepulsion(nodeMe, nodeOther) {
	v.sub(nodeOther.object.position, nodeMe.object.position);
	
	if(!v.isZero()) {
		//divide by its own length to make strength fade with distance
		var len = v.length();
		v = v.divideScalar(len*len);
		
		//apply repulsiveForce
		v = v.multiplyScalar(repulsiveForce);
		
		nodeMe.speed.subSelf(v);
	}
}

function doAttraction(nodeMe, nodeOther) {
	v.sub(nodeOther.object.position, nodeMe.object.position);
	
	if(!v.isZero()) {
		//multiply by its own length to make strength grow with distance
		v = v.multiplyScalar(v.length());
		
		//apply attractiveForce
		v = v.multiplyScalar(attractiveForce);
		
		nodeMe.speed.addSelf(v);
	}
}
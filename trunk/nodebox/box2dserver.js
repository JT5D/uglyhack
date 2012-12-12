var Box2D = require('./box2d.js');

// Keep a reference to the Box2D World
var world;

// The scale between Box2D units and pixels
var SCALE = 30;

//Create the ground
var size = 50;
var w = 1000; 
var h = 3000;

var fps = 30;

// 360 degrees in radians.
var PI2 = Math.PI * 2;

//Cache the canvas DOM reference
var canvas;

//Are we debug drawing
var debug = false;

// Shorthand "imports"
var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2AABB = Box2D.Collision.b2AABB,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
	b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;



function createObjects(x, y, width, height, circle) {
	var domObj = {id:'foo'};
	var domPos = {left:x, top:y};
	
    var x = (domPos.left) + width;
    var y = (domPos.top) + height;
    var body = createBox(x,y,width,height, false, circle);
	body.m_userData = {domObj:domObj, width:width, height:height, circle: circle ? true : false, setup: true};
}

function createBox(x,y,width,height, static, circle) {
	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	bodyDef.position.x = x / SCALE;
	bodyDef.position.y = y / SCALE

	var fixDef = new b2FixtureDef;
 	fixDef.density = 1.5;
 	fixDef.friction = 0.3;
 	fixDef.restitution = 0.65;

 	if (circle) {
 		var circleShape = new b2CircleShape;
		circleShape.m_radius = width / SCALE;

		fixDef.shape = circleShape;
 	} else {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
 	}
	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function getDrawData() {
	var ret = [];

	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var f = b.m_fixtureList; f; f = f.m_next) {
			if (f.m_userData) {
				ret.push({
					x: (f.m_body.m_xf.position.x * SCALE) -  f.m_userData.width,
					y: (f.m_body.m_xf.position.y * SCALE) - f.m_userData.height,
					r: (f.m_body.m_sweep.a + PI2) % PI2,
					c: f.m_userData.circle,
					w: f.m_userData.width * 2,
					h: f.m_userData.height * 2
				});
			}
		}
	}
	return ret;
};

function dragBodyAtMouse(ss, socket) {
	var aabb = new b2AABB();
	aabb.lowerBound.Set(ss.x/SCALE - 0.01, ss.y/SCALE - 0.01);
	aabb.upperBound.Set(ss.x/SCALE + 0.01, ss.y/SCALE + 0.01);

	var selectedBody = null;

	world.QueryAABB(function(fixture) {
		if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
			selectedBody = fixture.GetBody();
			return false;
		}
		return true;
        }, aabb);

	if(selectedBody) {
		var md = new b2MouseJointDef();
		md.bodyA = world.GetGroundBody();
		md.bodyB = selectedBody;
		md.target.Set(ss.x/SCALE, ss.y/SCALE);
		md.collideConnected = true;
		md.maxForce = 700.0;
		var mouseJoint = world.CreateJoint(md);
		selectedBody.SetAwake(true);

		socket.set('mousejoint'+ss.i, mouseJoint);
	}
}

function allBodiesSleeping() {

	for (var b = world.m_bodyList; b; b = b.m_next) {
		if(b.GetType() != b2Body.b2_staticBody && b.IsAwake()) {
			return false;
		}
	}
	return true;
}

//Method for animating
function update(connections) {
	world.Step(
	1 / fps //frame-rate
	, 10 //velocity iterations
	, 10 //position iterations
	);

	io.sockets.volatile.emit('draw', getDrawData());
	world.ClearForces();

	if(!allBodiesSleeping()) {
		setTimeout(function() {update(connections)},1000/fps);
	} else {
		console.log('all bodies are sleeping. stop simulation');
	}
}

function init(connections) {

	//Create the Box2D World with horisontal and vertical gravity (10 is close enough to 9.8)
	world = new b2World(
	new b2Vec2(0, 10) //gravity
	, true //allow sleep
	);

		//Create DOB OBjects
	for(var i = 0; i < 25; i++) {
		createObjects(Math.random()* (w-size),
				 h - Math.random() * (h/3) - size,
				 (Math.random()*size)+5,
				(Math.random()*size)+5,
				 false);//Math.random() > .5);
	}

	createBox(0, 0 , w, 10, true);
	createBox(0, h , w, 1, true);
	createBox(0,0,1,h, true);
	createBox(w,0,1,h, true);

	update(connections)
}

var connections = [];

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

io.set('log level', 1);
var pport = process.env.PORT || 80;
server.listen(pport);

io.sockets.on('connection', function (socket) {
	connections.push(socket);
	console.log('client connected ' + connections.length); 	

	if(allBodiesSleeping()) {
		console.log('client connected and simulation stopped, simulate once');
		update(connections);
	}
	
	socket.on('disconnect', function () {
		var index = connections.indexOf(socket);
		connections.splice(index,1);
		console.log('user disconnected ' + connections.length);

	});

	socket.on('mousedown', function(data) {
		if(allBodiesSleeping()) {
			console.log('got user input, start simulation');
			setTimeout(function() {update(connections)},1000/fps);
		}
		dragBodyAtMouse(data, socket);
	});

	socket.on('mouseup', function(data) {
		socket.get('mousejoint'+data.i, function (err, mouseJoint) {
			if(mouseJoint) {
				world.DestroyJoint(mouseJoint);
				socket.set('mousejoint'+data.i, null);
			}
		});
	});

	socket.on('mousemove', function(data) {
		socket.get('mousejoint'+data.i, function (err, mouseJoint) {
			if(mouseJoint) {
				mouseJoint.SetTarget(new b2Vec2(data.x/SCALE, data.y/SCALE));
			}
		});
	});

});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/img/gray_jean.png', function (req, res) {
  res.sendfile(__dirname + '/img/gray_jean.png');
});




init(connections);
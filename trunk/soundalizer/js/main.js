/* 
navigator.webkitGetUserMedia('audio', function (stream) {
	var objectUrl = window.webkitURL.createObjectURL(stream);
	var audioTag = document.getElementById('audioTag');
	audioTag.src = objectUrl;
	var sourceNode = context.createMediaElementSource(audioTag);
});
*/

var nodes = new Array();
var context = null;

function doConnect() {
	var from = document.getElementById('fromNode').value;
	var to = document.getElementById('toNode').value;
	nodes[from].connectTo(nodes[to]); 
}

function doDisconnect() {
	var from = document.getElementById('fromNode').value;
	var to = document.getElementById('toNode').value;
	nodes[from].disconnectFrom(nodes[to]);
}

function onClickCreate() {
	doCreate(document.getElementById('createSelect').value);
}

function doCreate(name) {
	var node = null;
	switch(name) {
		case "source":
			node = new SourceNode(nodes.length);
			break;
		case "biquadFilter":
			node = new BiquadFilterNode(nodes.length);
			break;
		case "gain":
			node = new GainNode(nodes.length);
			break;
		case "convolver":
			node = new ConvolverNode(nodes.length);
			break;
		case "delay":
			node = new DelayNode(nodes.length);
			break;
		case "dynamicscompressor":
			node = new DynamicsCompressorNode(nodes.length);
			break;
		case "script":
			node = new ScriptNode(nodes.length);
			break;
			
	}
	if(node != null) {
		nodes.push(node);
	}
	var from = document.getElementById('fromNode');
	from.innerHTML = "";
	for(var i in nodes) {
		if(!(nodes[i] instanceof DestinationNode)) {
			var optionEl = document.createElement('option');
			optionEl.innerHTML = nodes[i].name;
			optionEl.setAttribute('value', nodes[i].idx);
			from.appendChild(optionEl);
		}
	}
	
	var to = document.getElementById('toNode');
	to.innerHTML = "";
	for(var i in nodes) {
		if(!(nodes[i] instanceof SourceNode)) {
			var optionEl = document.createElement('option');
			optionEl.innerHTML = nodes[i].name;
			optionEl.setAttribute('value', nodes[i].idx);
			to.appendChild(optionEl);
		}
	}
}

$(function() {
	context = new (window.AudioContext || window.webkitAudioContext)();
	
	//some kind fo bug makes audio analyze not kick in if creating destination node directly
	setTimeout(function() {
		nodes[0] = new DestinationNode(0);
		doCreate("source");
	}, 1000);
	
}); 
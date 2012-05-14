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
		case "dyncompr":
			node = new DynamicsCompressorNode(nodes.length);
			break;
		case "script":
			node = new ScriptNode(nodes.length);
			break;
			
	}
	if(node != null) {
		nodes.push(node);
	}
}

$(function() {
	context = new (window.AudioContext || window.webkitAudioContext)();
	
	//some kind fo bug makes audio analyze not kick in if creating destination node directly
	setTimeout(function() {
		nodes[0] = new DestinationNode(0);
		nodes[1] = new SourceNode(1);
		nodes[0].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-100});
		nodes[1].el.offset({left: 30, top: window.innerHeight/2-100});
	}, 1000);
}); 
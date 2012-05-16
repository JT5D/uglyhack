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

$(function() {
	
	$('body').css('height', window.innerHeight - 40);
	$('.itemCreator').draggable({
		containment: 'parent'
	})
	try {
		context = new (window.AudioContext || window.webkitAudioContext)();
	} catch(e) {
		context = null;
	}
	
	if(context == null) {
		$('#noWebAudioBox').modal();
	} else {
		//some kind fo bug makes audio analyze not kick in if creating destination node directly
		setTimeout(function() {
			nodes[0] = new DestinationNode(0);
			nodes[1] = new SourceNode(1);
			nodes[0].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-150});
			nodes[1].el.offset({left: 230, top: window.innerHeight/2-100});
		}, 1000);
	}
}); 
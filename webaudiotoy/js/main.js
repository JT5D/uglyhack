/* 
navigator.webkitGetUserMedia('audio', function (stream) {
	var objectUrl = window.webkitURL.createObjectURL(stream);
	var audioTag = document.getElementById('audioTag');
	audioTag.src = objectUrl;
	var sourceNode = context.createMediaElementSource(audioTag);
});
*/


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var nodes = new Array();
var context = null;

$(function() {

	$('body').css('height', window.innerHeight - 40);
	$('.itemCreator').draggable({
		containment: 'parent'
	})
	$('a.brand').tooltip({placement: 'bottom'});
	$('#firstTimeChk').on('change', function() {
		if(this.checked) {
			localStorage["beenherebefore"] = 'yes';
		} else {
			localStorage.removeItem("beenherebefore");
		}
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
			nodes[0] = new SourceNode(0);
			nodes[1] = new DestinationNode(1);
			
			nodes[0].el.offset({left: 230, top: window.innerHeight/2-100});
			nodes[1].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-150});
		}, 1000);

		if(!localStorage["beenherebefore"]) {
			localStorage["beenherebefore"] = 'yes';
			$('#firstTimeBox').modal();
		}
	}
}); 

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
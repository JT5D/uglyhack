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
			
			nodes[0].el.offset({left: 250, top: window.innerHeight/2-100});
			nodes[1].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-150});
		}, 1000);

		if(!localStorage["beenherebefore"]) {
			localStorage["beenherebefore"] = 'yes';
			$('#firstTimeBox').modal();
		}

		$('#saveOkBtn').on('click', function() {

			var save = {
				name: $('#saveTxt').val(),
				nodes: []
			};

			for(var i in nodes) {
				var n = nodes[i];
				if(!n.deleted) {
					var conns = new Array();
					for(var j in n.myConnections) {
						if(!n.myConnections[j].deleted) {
							conns.push(n.myConnections[j].idx);
						}
					}

					save.nodes.push({
						i: n.idx,
						sn: n.shortName,
						p: n.el.offset(),
						c: conns
					});
				}
			}

			localStorage["save"] = window.btoa(JSON.stringify(save));

			$('#saveBox').modal('hide');
		});

		$('#loadBtn').on('click', function() {
			var data = localStorage["save"];
			if(data) {
				//load data
				var save = JSON.parse(window.atob(data));

				//clean up old nodes
				for(var i in nodes) {
					for(var j in nodes[i].myConnections) {
						nodes[i].disconnectFrom(nodes[i].myConnections[j]);
					}
					nodes[i].shutdown();
					nodes[i].el.remove();
				}
				nodes = new Array();

				//create saved nodes
				for(var i in save.nodes) {
					var n = save.nodes[i];
					var node = null;
					switch(n.sn) {
						case 'mn': node = new MicrophoneNode(n.i);	break;
						case 'gn': node = new GainNode(n.i);	break;
						case 'scn': node = new ScriptNode(n.i);	break;
						case 'son': node = new SourceNode(n.i);	break;
						case 'bfn': node = new BiquadFilterNode(n.i);	break;
						case 'cn': node = new ConvolverNode(n.i);	break;
						case 'deln': node = new DelayNode(n.i);	break;
						case 'dstn': node = new DestinationNode(n.i);	break;
						case 'dcn': node = new DynamicsCompressorNode(n.i);	break;
						case 'wsn': node = new WaveShaperNode(n.i);	break;
						case 'on': node = new OscillatorNode(n.i);	break;
					}
					node.el.offset(n.p);
					nodes[n.i] = node;
				}

				//connect saved nodes
				for(var i in save.nodes) {
					var n = save.nodes[i];
					if(n.c.length > 0) {
						for(var j in n.c) {
							var connectTo = n.c[j];
							nodes[n.i].connectTo(nodes[connectTo]);
						}
					}
				}

				//create connection lines
				for(var i in nodes) {
					var fromN = nodes[i];
					if(fromN) {
						for(var j in fromN.myConnections) {
							var toN = fromN.myConnections[j];
							fromN.createConnectionLine(fromN.el,toN.el,fromN.idx,toN.idx, false);
						}
						fromN.updateConnectionLines();
					}
				}

			} else {
				alert('nothing saved');
			}
		});
	}
}); 

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
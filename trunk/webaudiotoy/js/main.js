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
	
	var populateLoadSelect = function() {
		var loadSelect = $('#loadSelect');
		var loadNothing = $('#loadNothing');
		var loadOkBtn = $('#loadOkBtn');
		loadSelect.empty();
		
		var saves = new SaveHandler().getAllSavesInLocalStorage();
		for(var i in saves) {
			loadSelect.append($('<option>').html(saves[i]));
		}
		if(saves.length === 0) {
			loadSelect.hide();
			loadNothing.show();
			loadOkBtn.addClass('disabled');
		} else {
			loadSelect.show();
			loadNothing.hide();
			loadOkBtn.removeClass('disabled');
		}
	}

	$('body').css('height', window.innerHeight - 40);
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

	document.onkeydown = function(e) {
		for(var i in nodes) {
			if(nodes[i] && nodes[i] instanceof PianoNode) {
				nodes[i].onkeydown(e);
			}
		}
	};

	document.onkeyup = function(e) {
		for(var i in nodes) {
			if(nodes[i] && nodes[i] instanceof PianoNode) {
				nodes[i].onkeyup(e);
			}
		}
	};
	
	if(context == null) {
		$('#noWebAudioBox').modal();
	} else {
		//some kind fo bug makes audio analyze not kick in if creating destination node directly
		setTimeout(function() {
			var p = getUrlParams();
			if(p.data) {
				new SaveHandler().loadSaveData(p.data);
			} else {
				nodes[0] = new SourceNode(0);
				nodes[1] = new DestinationNode(1);
				
				nodes[0].el.offset({left: 250, top: window.innerHeight/2-100});
				nodes[1].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-150});
			}
		}, 1000);

		if(!localStorage["beenherebefore"]) {
			localStorage["beenherebefore"] = 'yes';
			$('#firstTimeBox').modal();
		}

		$('#saveOkBtn').on('click', function() {
			var saveName = $('#saveTxt').val();
			if(saveName.length > 0) {
				new SaveHandler().saveToLocalStorage(saveName);
				populateLoadSelect();
				$('#saveBox').modal('hide');
			}
		});
		
		$('#saveTxt').on('keyup', function() {
			if($(this).val().length == 0) {
				$('#saveOkBtn').addClass('disabled');
			} else {
				$('#saveOkBtn').removeClass('disabled');
			}
		});

		$('#loadOkBtn').on('click', function() {
			var saveName = $('#loadSelect').val();
			new SaveHandler().loadFromLocalStorage(saveName);
			$('#saveTxt').val(saveName);
			$('#saveOkBtn').removeClass('disabled');
			$('#loadBox').modal('hide');
		});
		
		$('#shareBtn').on('click', function() {
			var shareUrl = window.location.origin + window.location.pathname + "?data=" + new SaveHandler().createSaveData();
			$('#shareLink').attr("href", shareUrl).html(shareUrl);
			$('#shareBox').modal();
		})
		populateLoadSelect();
	}
}); 

function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    params[key] = value;
  });
 
  return params;
}
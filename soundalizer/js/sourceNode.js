var SourceNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createBufferSource();
		this.thingy.loop = true;
		this.name = "source" + this.idx;
	    
		var bufferSource = this.thingy;
		var thisNode = this;

		var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var startEl = document.createElement('input');
    	startEl.setAttribute('value', 'start');
    	startEl.setAttribute('type', 'button');
    	startEl.setAttribute('disabled', 'true');
    	startEl.setAttribute('onclick', 'nodes[' + this.idx + '].doStart();');
		el.appendChild(startEl);
		
		var stopEl = document.createElement('input');
		stopEl.setAttribute('value', 'stop');
		stopEl.setAttribute('type', 'button');
		stopEl.setAttribute('disabled', 'true');
		stopEl.setAttribute('onclick', 'nodes[' + this.idx + '].doStop();');
		el.appendChild(stopEl);
		
		var infoEl = document.createElement('div');
		infoEl.innerHTML = "Drag and drop a sound file to me..";
		el.appendChild(infoEl);
		
		var info2El = this.info2El = document.createElement('div');
		this.info2El.innerHTML = "Now connect me to something..";
		this.info2El.style.display = "none";
		el.appendChild(this.info2El);
		
		el.addEventListener('drop', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();

		    var reader = new FileReader();
		    reader.onload = function(e) {
		    	if(context.decodeAudioData) {
			        context.decodeAudioData(e.target.result, function(buffer) {
			        	bufferSource.buffer = buffer;
			        }, function(e) {
			            console.log(e);
			            return;
			        });
			    } else {
			    	bufferSource.buffer = context.createBuffer(e.target.result, false /*mixToMono*/);
			    }
	        	bufferSource.noteOn(0);
	        	stopEl.removeAttribute('disabled');
	        	if(thisNode.myConnections.length == 0) {
	        		info2El.style.display = 'block';
	        	}
	        	infoEl.style.display = 'none';
		    }
		    reader.readAsArrayBuffer(evt.dataTransfer.files[0]);		    
		}, false);
		
		el.addEventListener('dragover', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();
		    return false;
		}, false);
  	},
  	connectTo: function(node) {
	  	this._super(node);
		this.info2El.style.display = "none";
  	},
  	getConnections: function() {
		return new Array();
	},
	doStart: function() {
		stopEl.removeAttribute('disabled');
		startEl.setAttribute('disabled', 'true');
		this.thingy.gain.value = 1;
	},
	doStop: function() {
		startEl.removeAttribute('disabled');
		stopEl.setAttribute('disabled', 'true');
		this.thingy.gain.value = 0;
	}
});
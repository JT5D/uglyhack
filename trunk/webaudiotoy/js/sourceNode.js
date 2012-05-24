var SourceNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.shortName = "son";
		this.thingy = context.createBufferSource();
		this.thingy.loop = true;
		this.name = "File";
		this.icon = "icon-file";
		this.tooltip = "Plays an audio file dragged from the filesystem"
	    
		var bufferSource = this.thingy;
		var thisNode = this;
		
		var el = this.createMainEl(true, false, true, 175);
		
		var btnGroupEl = $('<div>');
		btnGroupEl.addClass('btn-group');
		btnGroupEl.css('width', '100%');
		
		var startEl = $('<input>');
		startEl.attr({
			type: 'button',
			value: 'start',
			disabled: 'true',
		});
		startEl.addClass('btn');
		startEl.addClass('btn-primary');
		startEl.css('width', '50%');
		startEl.click(function() {
			stopEl.removeAttr('disabled');
			startEl.attr('disabled', 'true');
			bufferSource.gain.value = 1;
		});
		btnGroupEl.append(startEl);
		
		var stopEl = $('<input>');
		stopEl.attr({
			type: 'button',
			value: 'stop',
			disabled: 'true',
		});
		stopEl.addClass('btn');
		stopEl.addClass('btn-primary');
		stopEl.css('width', '50%');
		stopEl.click(function() {
			startEl.removeAttr('disabled');
			stopEl.attr('disabled', 'true');
			bufferSource.gain.value = 0;
		});
		btnGroupEl.append(stopEl);
		el.append(btnGroupEl);

		
		var setPlaybackRateFnc = function(el, v) {
			bufferSource.playbackRate.value = v.value;
			rateLabel.html('Rate ' + v.value);
		} 
		
		var rateRange = $('<div>');
		var rateLabel = $('<a href="#" rel="tooltip" title="Set playback rate multiplier">').tooltip();
		rateRange.slider({
			min: 0.1,
			max: 3,
			value: 1,
			step: 0.05,
			slide: setPlaybackRateFnc
		});
		el.append('<br/>');
		el.append(rateLabel);
		el.append(rateRange);
		el.append('<br/>');
		setPlaybackRateFnc(null, {value: 1});
		
		var infoEl = $('<div>');
		infoEl.html("Drag and drop a sound file to me..");
		el.append(infoEl);
		
		var info2El = this.info2El = $('<div>');
		info2El.html("Now connect me to something..");
		info2El.hide();
		el.append(info2El);
		
		el.parent()[0].addEventListener('drop', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();
		    thisNode.loader.fadeIn('fast');
		    
		    var reader = new FileReader();
		    reader.onload = function(e) {
		    	if(context.decodeAudioData) {
			        context.decodeAudioData(e.target.result, function(buffer) {
			        	bufferSource.buffer = buffer;
			        }, function(e) {
			        	alert('could not play that audio');
			            console.log(e);
			            return;
			        });
			    } else {
			    	bufferSource.buffer = context.createBuffer(e.target.result, false /*mixToMono*/);
			    }
	        	bufferSource.noteOn(0);
	        	stopEl.removeAttr('disabled');
	        	if(thisNode.myConnections.length == 0) {
	        		info2El.show('fast');
	        	}
	        	infoEl.hide('fast');
	        	thisNode.loader.fadeOut('fast');
		    }
		    reader.readAsArrayBuffer(evt.dataTransfer.files[0]);		    
		}, false);
		
		el.parent()[0].addEventListener('dragover', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();
		    return false;
		}, false);
  	},
  	connectTo: function(node) {
	  	var ret = this._super(node);
		this.info2El.hide('fast');
		return ret;
  	},
  	getConnections: function() {
		return new Array();
	},
	shutdown: function() {
		this.thingy.noteOff(0);
	}
});
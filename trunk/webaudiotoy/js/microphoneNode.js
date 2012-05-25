var MicrophoneNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.shortName = "mn";
		this.name = "Microphone";
		this.icon = " icon-user";
		this.tooltip = "Gets audio input from a microphone";
		var thisNode = this;
		var el = this.createMainEl(true, false, true);

		var audioTag = $('<audio autoplay >');
		el.append(audioTag);

		var status = $('<p>');
		el.append(status);

		try {
			var successFnc = function (stream) {
				audioTag[0].src = window.webkitURL.createObjectURL(stream)
				thisNode.thingy = context.createMediaElementSource(audioTag[0]);
				status.html('Recording...');
			};

			var errorFnc = function(e) {
				status.html('Failed to start recording')
				console.log(e);
			};

			if(navigator.getUserMedia) {
				navigator.getUserMedia({audio: true, video: false}, successFnc, errorFnc);
			} else if (navigator.webkitGetUserMedia) {
				navigator.webkitGetUserMedia({audio: true, video: false}, successFnc, errorFnc);
			} else {
				status.html('Not yet supported in your browser. It will hopefully come soon in Chrome Canary.');	
			}
		 } catch(e) {
		 	status.html('Not yet supported in your browser. It will hopefully come soon in Chrome Canary.');
		 }
	},
	shutdown: function() {
		this.thingy.stop();
	}
});
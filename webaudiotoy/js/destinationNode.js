var DestinationNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = context.createAnalyser();
  		this.icon = "icon-volume-up";
  		this.name = "Output";
  		var el = this.createMainEl(false, true, false);
  		el.css('margin', 0);
		
		var analyzer = this.thingy;
		var processor = context.createJavaScriptNode(2048, 1, 1);
		this.thingy.connect(processor);
	    processor.connect(context.destination);
	    
	    var visMode = false;
	    var soundVisualizer = new SoundVisualizer(el, 150, 120);
	    soundVisualizer.canvas.on('click', function() {
	    	visMode = !visMode;
	    })

	    processor.onaudioprocess = function(e) {
		    var data = new Uint8Array(analyzer.frequencyBinCount);
		    if(visMode) {
			    analyzer.getByteFrequencyData(data);
			    soundVisualizer.visualizeFrequencyData(data);
		    } else {
			    analyzer.getByteTimeDomainData(data);
			    soundVisualizer.visualizeTimeDomainData(data);
		    }
		};
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = context.destination;
		arr[1] = this.thingy;
		return arr;
	}
});
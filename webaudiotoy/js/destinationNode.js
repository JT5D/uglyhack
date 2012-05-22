var DestinationNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = context.createAnalyser();
  		this.icon = "icon-volume-up";
  		this.name = "Output";
  		this.tooltip = "Represents the final audio destination and is what the user will ultimately hear";
  		var el = this.createMainEl(false, true, false);
  		el.css('margin', 0);
		
		var analyzer = this.thingy;
		this.thingy.connect(context.destination);
	    
	    var visMode = 0;

	    var ctooltip = $('<a href="#" rel="tooltip" title="Click to change visualization">').tooltip({placement: 'bottom'});
	    el.append(ctooltip);
	    var soundVisualizer = new SoundVisualizer(ctooltip, 150, 120);
	    soundVisualizer.canvas.on('click', function() {
	    	visMode++;
	    	if(visMode == 2) {
	    		soundVisualizer.clear();
	    	} else if(visMode == 3) {
	    		visMode = 0;
	    		window.requestAnimationFrame(onaudioprocess);
	    	}
	    })

	    var data = null; 
	    var onaudioprocess = function() {
		    if(data == null) {
		    	data = new Uint8Array(analyzer.frequencyBinCount);
		    }
		    if(visMode == 0) {
		    	analyzer.getByteTimeDomainData(data);
			    soundVisualizer.visualizeTimeDomainData(data);
			    window.requestAnimationFrame(onaudioprocess);
		    } else if(visMode == 1) {
		    	analyzer.getByteFrequencyData(data);
			    soundVisualizer.visualizeFrequencyData(data);
		    	window.requestAnimationFrame(onaudioprocess);
		    }
		};
		
		window.requestAnimationFrame(onaudioprocess);
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = context.destination;
		arr[1] = this.thingy;
		return arr;
	}
});
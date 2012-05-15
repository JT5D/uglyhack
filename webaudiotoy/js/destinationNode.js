var DestinationNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = null;//context.createAnalyser();
  		//this.thingy.minDecibels = -70;
  		this.name = "destination";
  		this.createMainEl(false, true, false);
		
		//var analyzer = this.thingy;
		//var processor = context.createJavaScriptNode(2048, 1, 1);
		//this.thingy.connect(processor);
	    //processor.connect(context.destination);

	    //processor.onaudioprocess = function(e) {
//		    var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
//		    analyzer.getByteFrequencyData(freqByteData);
		//};
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = context.destination;
		//arr[1] = this.thingy;
		return arr;
	}
});
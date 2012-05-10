var DestinationNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = context.createAnalyser();
  		this.thingy.minDecibels = -70;
  		this.name = "destination" + this.idx;
  		
  		var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var freqDataTags = new Array();
		var analyzer = this.thingy;
		var processor = context.createJavaScriptNode(2048 /*bufferSize*/, 1 /*num inputs*/, 1 /*numoutputs*/);
		this.thingy.connect(processor);
	    processor.connect(context.destination);

	    processor.onaudioprocess = function(e) {
	    	
		    var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
		    analyzer.getByteFrequencyData(freqByteData);
		    for(var i = 0; i < 50; i++) {
		    	var f = i*10;
		    	var divHeight = ((freqByteData[f]/255.0)*100.0)+1;
 				freqDataTags[i].style.height = divHeight + '%';

 				var col = 255-freqByteData[f];
 				freqDataTags[i].style.background = 
 					'rgb(' + col + ',' + col + ',' + col + ')';
			}
		};
		
		for(var i = 0; i < 50; i++) {
			var dd = 2 * i;

    		var el = document.createElement('div');
     		el.style.background = 'rgb(255,255,255)';
     		el.style.width = '2%';
     		el.style.height = '1px';
     		el.style.position = 'absolute';
     		el.style.left =  dd + '%';
			el.style.bottom =  '0px';
     		el.innerHTML = '&nbsp;';
     		document.body.appendChild(el);
     		freqDataTags[i] = el;
    	}
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = context.destination;
		arr[1] = this.thingy;
		return arr;
	},
	toString: function() {
		return this.name;
	}
});
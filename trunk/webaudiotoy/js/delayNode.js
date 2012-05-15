var DelayNode = BaseNode.extend({
  	init: function(index){
	    this._super(index);
		this.thingy = context.createDelayNode();
		this.name = "delay";
		var el = this.createMainEl(true, true, true, 90);
		var delayN = this.thingy;
		
		var setDelayFnc = function(el, v) { 
			delayN.delayTime.value = v.value;
			delayLabel.html('Delay ' + v.value + ' s');
		}; 
		
		var delayRange = $('<div>');
		var delayLabel = $('<p>');
		delayRange.slider({
			min: 0,
			max: 0.99,
			step: 0.01,
			value: 0.8,
			slide: setDelayFnc
		});
		el.append(delayLabel);
		el.append(delayRange);
		setDelayFnc(null, {value:0.8});
	}
	
});
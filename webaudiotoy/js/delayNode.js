var DelayNode = BaseNode.extend({
  	init: function(index){
	    this._super(index);
		this.thingy = context.createDelayNode();
		this.name = "Delay";
		this.icon = "icon-pause";
		this.tooltip = "Delays the incoming audio signal by a certain amount";
		var el = this.createMainEl(true, true, true, 90);
		var delayN = this.thingy;
		
		var setDelayFnc = function(el, v) { 
			delayN.delayTime.value = v.value;
			delayLabel.html('Delay ' + v.value + ' s');
		}; 
		
		var delayRange = $('<div>');
		var delayLabel = $('<a href="#" rel="tooltip" title="Delay time in seconds">').tooltip();
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
var DelayNode = BaseNode.extend({
  	init: function(index){
	    this._super(index);
		this.thingy = context.createDelayNode();
		this.name = "delay" + this.idx;
		var el = this.createMainEl(true, true);
		var delayN = this.thingy;
		
		var setDelayFnc = function(v) { delayN.delayTime.value = v; }; 
		
		var delayRange = $('<input>');
		delayRange.attr({
			type: 'range',
			min: '0',
			max: '0.99',
			step: '0.01',
			value: '0.99'
		});
		delayRange.on('change', function() {
			setDelayFnc(this.value)
		});
		el.append(delayRange);
		setDelayFnc(delayRange.val());
	}
	
});
var SoundVisualizer = Class.extend({
	init: function(el, width, height){
		this.canvas = $('<canvas width="' + width + '" height="' + height + '">');
		this.w = width;
		this.h = height;
		el.append(this.canvas);
		this.ctx = this.canvas[0].getContext("2d");
	},
	visualizeFrequencyData: function(data) {
		this.ctx.fillStyle = "rgba(255,255,255,0.1)";
		this.ctx.fillRect(0,0,this.w,this.h);
		this.ctx.fillStyle = "rgba(200,0,0,0.2)";
		
		var h = Math.floor((data.length*0.33) / this.w);
		var v = 0;
		var s = 0;
		for(var i = 0; i < this.w; i++) {
			v = data[i*h];
			s = (v/255)*this.h;
			this.ctx.fillRect(i, (this.h-s), 1, s);
		}
	},
	visualizeTimeDomainData: function(data) {
		this.ctx.fillStyle = "rgba(255,255,255,0.1)";
		this.ctx.fillRect(0,0,this.w,this.h);
		this.ctx.fillStyle = "rgba(200,0,0,0.5)";
		
		var h = Math.floor(data.length / this.w);
		var v = 0;
		var s = 0;
		for(var i = 0; i < this.w; i++) {
			v = data[i*h];
			s = (v/255)*this.h;
			this.ctx.fillRect(i, s, 1, 1);
		}
	}
});
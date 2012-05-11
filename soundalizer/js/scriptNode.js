var ScriptNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.thingy.onaudioprocess = function(event) {	};
		this.name = "script" + this.idx;
	    var javaScriptNode = this.thingy;
		
	    var el = this.createMainEl(true, true);
	    el.addClass('nodebig');
	    
	    var scriptBox = $('<textarea>');
	    var compileButton = $('<input>');
	    var errorMsg = this.thingy.errorMsg = $('<div>');
	    
	    var compileFnc = function(code) {
			var fnc = null;
			try {
				fnc = new Function("ev", "this.errorMsg.innerHTML = ''; try { var inp = ev.inputBuffer.getChannelData(0); var out = ev.outputBuffer.getChannelData(0);" + code + "} catch(e) { this.errorMsg.innerHTML = e.message; }");
			} catch(e) {
				errorMsg.html(e.message);
				fnc = function(event) {};
			}
			javaScriptNode.onaudioprocess = fnc;
			return this;
		};
	    
		
		scriptBox.attr('cols', '30');
		scriptBox.attr('rows', '12');
		scriptBox.val("for (var i = 0; i < inp.length; i++) { out[i] = inp[i];}");
		
		compileButton.attr({
			type: 'button',
			value: 'compile'
		});
		compileButton.on("click", function() {
			compileFnc(scriptBox.val());
		});
		
		el.append(scriptBox);
		el.append(compileButton);
		el.append(errorMsg);
		
		compileFnc(scriptBox.val());
	}  
});
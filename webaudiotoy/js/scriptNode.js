var ScriptNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.thingy.onaudioprocess = function(event) {	};
		this.name = "script";
	    var javaScriptNode = this.thingy;
		
	    var el = this.createMainEl(true, true, true, 321, 241);
	    el.css('width', '221px');
	    
	    var scriptBox = $('<textarea>');
	    var compileButton = $('<input>');
	    var errorMsg = this.thingy.errorMsg = $('<div>');
	    errorMsg.css({
	    	float: 'right',
	    	width: '159px',
	    	height:	'36px',
	    	'overflow-y': 'auto',
	    	'overflow-x': 'hidden'
	    });
	    
	    var compileFnc = function(code) {
			var fnc = null;
			errorMsg.html("");
			try {
				fnc = new Function("ev", "this.errorMsg.innerHTML = ''; try { var inp = ev.inputBuffer.getChannelData(0); var out = ev.outputBuffer.getChannelData(0);" + code + "} catch(e) { this.errorMsg.html(e.message); }");
			} catch(e) {
				errorMsg.html(e.message);
				fnc = function(event) {};
			}
			javaScriptNode.onaudioprocess = fnc;
			return this;
		};
	    
		
		scriptBox.attr('cols', '30');
		scriptBox.attr('rows', '12');
		scriptBox.val("for (var i = 0; i < inp.length; i++) {\n out[i] = inp[i];\n}");
		
		compileButton.attr({
			type: 'button',
			value: 'compile'
		});
		compileButton.on("click", function() {
			compileFnc(scriptBox.val());
		});
		
		el.append(scriptBox);
		el.append($('<br/>'));
		el.append(compileButton);
		el.append(errorMsg);
		
		compileFnc(scriptBox.val());
	}  
});
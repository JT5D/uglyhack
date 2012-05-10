var ScriptNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.thingy.onaudioprocess = function(event) {	};
		this.name = "script" + this.idx;
	    

	    var el = document.createElement('div');
				el.setAttribute('class', 'nodebig');
				el.innerHTML = this.name;
				document.body.appendChild(el);
				
				var errorMsg = document.createElement('div');
				this.thingy.errorMsg = errorMsg;
				
				var scriptBox = document.createElement('textarea');
				scriptBox.setAttribute('cols', '30');
				scriptBox.setAttribute('rows', '12');
				scriptBox.setAttribute('onkeyup', 'nodes[' + this.idx + '].setScript(this);');
				scriptBox.setAttribute('onchange', 'nodes[' + this.idx + '].setScript(this);');
				scriptBox.value = "for (var i = 0; i < inp.length; i++) { out[i] = inp[i];}";
				this.setScript(scriptBox);
				el.appendChild(scriptBox);
				el.appendChild(errorMsg);
	},
	setScript: function(input) {
		var fnc = null;
		try {
			fnc = new Function("ev", "this.errorMsg.innerHTML = ''; try { var inp = ev.inputBuffer.getChannelData(0); var out = ev.outputBuffer.getChannelData(0);" + input.value + "} catch(e) { this.errorMsg.innerHTML = e.message; }");
		} catch(e) {
			this.thingy.errorMsg.innerHTML = e.message;
			fnc = function(event) {};
		}
		this.thingy.onaudioprocess = fnc;
		return this;
	} 
});
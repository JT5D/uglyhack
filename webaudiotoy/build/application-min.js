(function(){var a=false,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(g){var f=this.prototype;a=true;var e=new this();a=false;for(var d in g){e[d]=typeof g[d]=="function"&&typeof f[d]=="function"&&b.test(g[d])?(function(h,i){return function(){var k=this._super;this._super=f[h];var j=i.apply(this,arguments);this._super=k;return j}})(d,g[d]):g[d]}function c(){if(!a&&this.init){this.init.apply(this,arguments)}}c.prototype=e;c.prototype.constructor=c;c.extend=arguments.callee;return c}})();var SoundVisualizer=Class.extend({init:function(c,b,a){this.canvas=$('<canvas width="'+b+'" height="'+a+'">');this.w=b;this.h=a;c.append(this.canvas);this.ctx=this.canvas[0].getContext("2d")},visualizeFrequencyData:function(e){this.ctx.fillStyle="rgba(255,255,255,0.2)";this.ctx.fillRect(0,0,this.w,this.h);this.ctx.fillStyle="rgba(200,0,0,0.5)";var d=Math.floor((e.length*0.33)/this.w);var a=0;var c=0;for(var b=0;b<this.w;b++){a=e[b*d];c=(a/255)*this.h;this.ctx.fillRect(b,(this.h-c),1,c)}},visualizeTimeDomainData:function(e){this.ctx.fillStyle="rgba(255,255,255,0.2)";this.ctx.fillRect(0,0,this.w,this.h);this.ctx.strokeStyle="rgba(200,0,0,0.5)";var d=Math.floor(e.length/this.w);var a=0;var c=0;this.ctx.beginPath();this.ctx.moveTo(0,(e[0]/255)*this.h);for(var b=1;b<this.w;b++){a=e[b*d];c=(a/255)*this.h;this.ctx.lineTo(b,c)}this.ctx.stroke()},clear:function(){this.ctx.fillStyle="rgba(255,255,255,1)";this.ctx.fillRect(0,0,this.w,this.h)}});var BaseNode=Class.extend({init:function(b,a){this.idx=b;this.myConnections=new Array();this.c=a},createMainEl:function(a,k,m,g,l){var d=this;var c=this.el=$("<div>");$("body").append(c);c.addClass("node");if(g!=undefined){c.css("height",g)}if(l!=undefined){c.css("width",l)}c.draggable({stack:"div.node",containment:"parent",drag:function(){d.updateConnectionLines()},});var n=$("<img>").attr("src","img/ajax-loader.gif").addClass("loaderImg");this.loader=$("<div>").addClass("loaderOverlay");this.loader.append(n);c.append(this.loader);this.loader.hide();var f=$("<div>");f.addClass("nodeheader");f.append($('<i class="'+this.icon+'">'));f.append($('<a href="#" rel="tooltip" title="'+this.tooltip+'">').html("&nbsp;"+this.name).tooltip());c.append(f);if(m){var i=$("<div>");i.addClass("close");i.html("x");i.on("click",function(){$(".line").each(function(){var o=$(this);var q=o.attr("data-fromIdx");var p=o.attr("data-toIdx");if(q==d.idx||p==d.idx){o.fadeOut(700,function(){o.remove()})}});c.fadeOut(700,function(){for(var p in d.myConnections){d.disconnectFrom(d.myConnections[p])}d.shutdown();var o=d.el.height()+2;d.el.remove();d.deleted=true;for(var p=d.idx+1;p<nodes.length;p++){nodes[p].el.offset({top:nodes[p].el.offset().top+o})}})})}f.append(i);var j=null;if(a){var b=$("<div>");b.draggable({revert:true,snap:".nodedrop",start:function(){j=d.createConnectionLine(d.el,b,null,null,true)},drag:function(){var o=d.getLinePosData(d.el,b,true);d.updateConnectionLine(j,o)},stop:function(){j.parent().remove()}});b.droppable({accept:".nodedrop",drop:function(q,r){var p=$(r.draggable[0]);var o=p.attr("data-nodeIndex");var t=nodes[d.idx];var s=nodes[o];$(".templine").remove();if(t.connectTo(s)){s.createConnectionLine(t.el,s.el,t.idx,s.idx,false);s.updateConnectionLines()}}});b.addClass("nodedrag");b.addClass("nodehandle");b.attr("data-nodeIndex",this.idx);b.offset({top:c.height()/2-39,left:c.width()+8});c.append(b)}if(k){var e=$("<div>");e.addClass("nodedrop");e.addClass("nodehandle");e.attr("data-nodeIndex",this.idx);e.offset({top:c.height()/2-(a?61:39),left:-28});e.draggable({revert:true,snap:".nodedrag",start:function(){j=d.createConnectionLine(d.el,e,null,null,true)},drag:function(){var o=d.getLinePosData(d.el,e,true,true);d.updateConnectionLine(j,o,true)},stop:function(){j.parent().remove()}});e.droppable({accept:".nodedrag",drop:function(q,r){var p=$(r.draggable[0]);var o=p.attr("data-nodeIndex");var t=nodes[o];var s=nodes[d.idx];$(".templine").remove();if(t.connectTo(s)){s.createConnectionLine(t.el,s.el,t.idx,s.idx,false);s.updateConnectionLines()}}});c.append(e)}var h=$("<div>");h.addClass("nodebody");c.append(h);c.offset({top:200,left:200});c.hide();c.fadeIn(700);return h},connectTo:function(c){if(this.myConnections.indexOf(c)!=-1){return false}var a=c.getConnections();for(var b in a){this.thingy.connect(a[b])}this.myConnections.push(c);return true},disconnectFrom:function(d){var b=d.getConnections();for(var c in b){this.thingy.disconnect(b[c])}var a=this.myConnections.indexOf(d);if(a!=-1){this.myConnections.splice(a,1)}},getConnections:function(){var a=new Array();a[0]=this.thingy;return a},createConnectionLine:function(h,f,d,e,b){var g=this.getLinePosData(h,f,b);var c=$("<div>").appendTo("body").addClass("linecont").css({position:"absolute","webkit-transform":g.transform,"-moz-transform":g.transform,transform:g.transform}).width(g.length);c.offset({left:g.left,top:g.top-connLineWidth/2});var a=$("<div>").addClass("line").attr({"data-fromIdx":d,"data-toIdx":e}).width(g.length);if(b){c.addClass("templine")}else{c.on("click",function(){var j=nodes[a.attr("data-fromIdx")];var i=nodes[a.attr("data-toIdx")];c.fadeOut(700,function(){j.disconnectFrom(i);$(this).remove()})})}c.append(a);return a},updateConnectionLines:function(){var a=this;$(".line").each(function(){var b=$(this);var e=nodes[b.attr("data-fromIdx")].el;var c=nodes[b.attr("data-toIdx")].el;var d=a.getLinePosData(e,c,false);a.updateConnectionLine(b,d)})},updateConnectionLine:function(a,b){a.parent().css({"webkit-transform":b.transform,"-moz-transform":b.transform,transform:b.transform}).width(b.length).offset({left:b.left,top:b.top-connLineWidth/2});a.width(b.length)},getLinePosData:function(i,g,q,l){var b=i.offset();var k=g.offset();var f=i.width();var j=i.height();var p=g.height();var e=b.left+(l?2:f);var o=b.top+j/2;var d=k.left;var m=k.top+p/2;if(q){d+=10}else{e+=25;d-=15}var n=Math.atan2(m-o,d-e);var h=n*180/Math.PI;var c=Math.abs(Math.sin(n)*connLineWidth/2);return{length:Math.sqrt((e-d)*(e-d)+(o-m)*(o-m)),transform:"rotate("+h+"deg)",top:o<m?o+c:o-(o-m)+c,left:e<d?e-c:e-(e-d)-c}},shutdown:function(){}});var BiquadFilterNode=BaseNode.extend({init:function(j,d){this._super(j,d);this.shortName="bfn";this.thingy=context.createBiquadFilter();this.name="Pass";this.icon="icon-signal";this.tooltip="Lets different frequencies of the audio input through";var b=this.createMainEl(true,true,true,200);var i=this.thingy;var g=this;if(!d){this.c={type:"lowpass",freq:0.8,q:0.2}}var f=function(n){g.c.type=n;switch(n){case"highpass":i.type=i.HIGHPASS;break;case"lowpass":i.type=i.LOWPASS;break;case"bandpass":i.type=i.BANDPASS;break}};var k=function(p,n){g.c.freq=n.value;var q=30;var r=context.sampleRate/2;var o=Math.log(r/q)/Math.LN2;var s=Math.pow(2,o*(n.value-1));i.frequency.value=r*s;h.html("Frequency "+Math.floor(i.frequency.value)+" Hz")};var l=function(o,n){g.c.q=n.value;i.Q.value=n.value*30;c.html("Quality "+Math.floor(i.Q.value))};var a=$("<select>");a.append($("<option>").html("lowpass"));a.append($("<option>").html("highpass"));a.append($("<option>").html("bandpass"));a.val(this.c.type);a.on("change",function(){f(this.value)});b.append($('<a href="#" rel="tooltip" title="Type of pass effect">').tooltip().html("Type"));b.append(a);b.append($("<br/>"));b.append($("<br/>"));f(this.c.type);var e=$("<div>");var h=$('<a href="#" rel="tooltip" title="The cutoff frequency">').tooltip();e.slider({min:0,max:1,step:0.01,value:this.c.freq,slide:k});b.append(h);b.append(e);b.append($("<br/>"));k(null,{value:this.c.freq});var m=$("<div>");var c=$('<a href="#" rel="tooltip" title="Controls how peaked the response will be at the cutoff frequency">').tooltip();m.slider({min:0,max:1,step:0.01,value:this.c.q,slide:l});b.append(c);b.append(m);l(null,{value:this.c.q})}});var ConvolverNode=BaseNode.extend({init:function(h,c){this._super(h,c);this.shortName="cn";this.thingy=context.createConvolver();this.name="Convolver";this.icon="icon-random";this.tooltip="Applies a linear convolution effect given an impulse response";var a=this.createMainEl(true,true,true,115);var j=this.thingy;var f=this;if(!c){this.c={conv:"cardiod-rear-levelled",norm:true}}var i=function(k){f.c.conv=k;f.loader.fadeIn("fast");var l=new XMLHttpRequest();l.open("GET","conv/"+k+".wav",true);l.responseType="arraybuffer";l.onload=function(){j.buffer=context.createBuffer(l.response,false);f.loader.fadeOut("fast")};l.send()};var e=function(){f.c.norm=this.checked;j.normalize.value=this.checked};var d=$("<select>");d.on("change",function(){i(this.value)});d.append($("<option>").html("cardiod-rear-levelled"));d.append($("<option>").html("comb-saw1"));d.append($("<option>").html("comb-saw2"));d.append($("<option>").html("cosmic-ping-long"));d.append($("<option>").html("diffusor3"));d.append($("<option>").html("dining-far-kitchen"));d.append($("<option>").html("dining-living-true-stereo"));d.append($("<option>").html("feedback-spring"));d.append($("<option>").html("filter-lopass160"));d.append($("<option>").html("filter-rhythm1"));d.append($("<option>").html("filter-rhythm3"));d.append($("<option>").html("filter-telephone"));d.append($("<option>").html("impulse-rhythm2"));d.append($("<option>").html("kitchen"));d.append($("<option>").html("kitchen-true-stereo"));d.append($("<option>").html("living-bedroom-leveled"));d.append($("<option>").html("matrix6-backwards"));d.append($("<option>").html("matrix-reverb2"));d.append($("<option>").html("matrix-reverb3"));d.append($("<option>").html("s2_r4_bd"));d.append($("<option>").html("spatialized4"));d.append($("<option>").html("spatialized5"));d.append($("<option>").html("spreader50-65ms"));d.append($("<option>").html("wildecho"));d.val(this.c.conv);a.append($('<a href="#" rel="tooltip" title="Impulse response used by the convolver">').tooltip().html("Impulse response"));a.append(d);i(this.c.conv);var g=$("<input>").attr({type:"checkbox",checked:this.c.norm});var b=$('<a href="#" rel="tooltip" title="Controls whether the impulse response will be scaled by an equal-power normalization">').tooltip().html("Normalize");a.append($("<label>").addClass("checkbox").append(g).append(b));g.on("change",e)}});var DelayNode=BaseNode.extend({init:function(c,b){this._super(c,b);this.shortName="deln";this.thingy=context.createDelayNode();this.name="Delay";this.icon="icon-pause";this.tooltip="Delays the incoming audio signal by a certain amount";var h=this.createMainEl(true,true,true,78);var a=this.thingy;var e=this;if(!b){this.c={d:0.8}}var g=function(j,i){e.c.d=i.value;a.delayTime.value=i.value;f.html("Delay "+i.value+" s")};var d=$("<div>");var f=$('<a href="#" rel="tooltip" title="Delay time in seconds">').tooltip();d.slider({min:0,max:0.99,step:0.01,value:this.c.d,slide:g});h.append(f);h.append(d);g(null,{value:this.c.d})}});var DestinationNode=BaseNode.extend({init:function(h,d){this._super(h,d);this.shortName="dstn";this.thingy=context.createAnalyser();this.icon="icon-volume-up";this.name="Output";this.tooltip="Represents the final audio destination and is what the user will ultimately hear";var c=this.createMainEl(false,true,false);c.css("margin",0);var g=this.thingy;this.thingy.connect(context.destination);var e=this;if(!d){this.c={vm:0}}var b=$('<a href="#" rel="tooltip" title="Click to change visualization">').tooltip({placement:"bottom"});c.append(b);var a=new SoundVisualizer(b,150,120);a.canvas.on("click",function(){e.c.vm++;if(e.c.vm==2){a.clear()}else{if(e.c.vm==3){e.c.vm=0;window.requestAnimationFrame(i)}}});var f=null;var i=function(){if(f==null){f=new Uint8Array(g.frequencyBinCount)}if(e.c.vm==0){g.getByteTimeDomainData(f);a.visualizeTimeDomainData(f);window.requestAnimationFrame(i)}else{if(e.c.vm==1){g.getByteFrequencyData(f);a.visualizeFrequencyData(f);window.requestAnimationFrame(i)}}};window.requestAnimationFrame(i)},getConnections:function(){var a=new Array();a[0]=context.destination;a[1]=this.thingy;return a}});var DynamicsCompressorNode=BaseNode.extend({init:function(e,t){this._super(e,t);this.shortName="dcn";this.thingy=context.createDynamicsCompressor();this.name="Dynamic Compr";this.icon="icon-bullhorn";this.tooltip="Dynamics compression is very commonly used in musical production and game audio. It lowers the volume of the loudest parts of the signal and raises the volume of the softest parts";var b=this.createMainEl(true,true,true,305);var h=this.thingy;var g=this;if(!t){this.c={t:h.threshold.defaultValue,k:h.knee.defaultValue,rat:h.ratio.defaultValue,a:0.1,rel:0.25}}var j=function(x,w){g.c.t=w.value;h.threshold.value=w.value;i.html("Threshold "+w.value+" dB")};var c=function(x,w){g.c.k=w.value;h.knee.value=w.value;o.html("Knee "+w.value+" dB")};var s=function(x,w){g.c.rat=w.value;h.ratio.value=w.value;k.html("Ratio "+w.value)};var d=function(x,w){g.c.a=w.value;h.attack.value=w.value;m.html("Attack "+w.value+" s")};var f=function(x,w){g.c.rel=w.value;h.release.value=w.value;l.html("Release "+w.value+" s")};if(h.threshold==undefined||h.attack==undefined||h.release==undefined){b.append($("<p>").html("Not supported by your browser"));return}var n=$("<div>");var i=$('<a href="#" rel="tooltip" title="The decibel value above which the compression will start taking effect">').tooltip();n.slider({min:h.threshold.minValue,max:h.threshold.maxValue,value:this.c.t,slide:j});b.append(i);b.append(n);b.append($("<br/>"));j(null,{value:this.c.t});var a=$("<div>");var o=$('<a href="#" rel="tooltip" title="A decibel value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion">').tooltip();a.slider({min:h.knee.minValue,max:h.knee.maxValue,value:this.c.k,slide:c});b.append(o);b.append(a);b.append($("<br/>"));c(null,{value:this.c.k});var p=$("<div>");var k=$('<a href="#" rel="tooltip" title="The ratio of compression">').tooltip();p.slider({min:h.ratio.minValue,max:h.ratio.maxValue,value:this.c.rat,slide:s});b.append(k);b.append(p);b.append($("<br/>"));s(null,{value:this.c.rat});var u=$("<div>");var m=$('<a href="#" rel="tooltip" title="The amount of time to increase the gain by 10dB.">').tooltip();u.slider({min:h.attack.minValue,max:h.attack.maxValue,step:0.01,value:this.c.a,slide:d});b.append(m);b.append(u);b.append($("<br/>"));d(null,{value:this.c.a});var r=$("<div>");var l=$('<a href="#" rel="tooltip" title="The amount of time to reduce the gain by 10dB">').tooltip();r.slider({min:h.release.minValue,max:h.release.maxValue,step:0.01,value:this.c.rel,slide:f});b.append(l);b.append(r);b.append($("<br/>"));f(null,{value:this.c.rel});var q=$("<p>");setInterval(function(){q.html("Reduction "+Math.min(h.reduction.value.toPrecision(2),-0.1)+" dB")},100);b.append($('<a href="#" rel="tooltip" title="Current amount of gain reduction">').tooltip().append(q))}});var GainNode=BaseNode.extend({init:function(d,c){this._super(d,c);this.shortName="gn";this.thingy=context.createGainNode();this.name="Gain";this.icon="icon-plus";this.tooltip="Changes the gain of (scales) the incoming audio signal by a certain amount";var g=this.createMainEl(true,true,true,78);var f=this.thingy;var e=this;if(!c){this.c={v:1}}var h=function(j,i){e.c.v=i.value;f.gain.value=i.value*i.value;b.html("Volume "+i.value)};var a=$("<div>");var b=$('<a href="#" rel="tooltip" title="Set gain multiplier">').tooltip();a.slider({min:0,max:3,value:this.c.v,step:0.01,slide:h});g.append(b);g.append(a);h(null,{value:this.c.v})}});var ScriptNode=BaseNode.extend({init:function(e,b){this._super(e,b);this.shortName="scn";this.thingy=context.createJavaScriptNode(4096,1,1);this.thingy.onaudioprocess=function(j){};this.name="Javascript";this.icon="icon-filter";this.tooltip="Can generate or process audio directly using JavaScript. Has inputBuffer inp, outputBuffer out and AudioProcessingEvent ev defined";var g=this.thingy;var c=this;if(!b){this.c={c:"for (var i = 0; i < inp.length; i++) {\n out[i] = inp[i];\n}"}}var a=this.createMainEl(true,true,true,308,241);a.css("width","221px");var f=$("<textarea>");var i=$("<input>");var d=this.thingy.errorMsg=$("<div>");d.css({"float":"right",width:"159px",height:"36px","overflow-y":"auto","overflow-x":"hidden"});var h=function(j){c.c.c=j;var l=null;d.html("");try{l=new Function("ev","this.errorMsg.innerHTML = ''; try { var inp = ev.inputBuffer.getChannelData(0); var out = ev.outputBuffer.getChannelData(0);"+j+"} catch(e) { this.errorMsg.html(e.message); }")}catch(k){d.html(k.message);l=function(m){}}g.onaudioprocess=l;return this};f.attr("cols","30");f.attr("rows","12");f.val(this.c.c);i.attr({type:"button",value:"compile"});i.on("click",function(){h(f.val())});a.append(f);a.append($("<br/>"));a.append(i);a.append(d);h(this.c.c)}});var SourceNode=BaseNode.extend({init:function(j,e){this._super(j,e);this.shortName="son";this.thingy=context.createBufferSource();this.thingy.loop=true;this.name="File";this.icon="icon-file";this.tooltip="Plays an audio file dragged from the filesystem";var d=this.thingy;var f=this;if(!e){this.c={pr:1}}var c=this.createMainEl(true,false,true,175);var k=$("<div>");k.addClass("btn-group");k.css("width","100%");var g=$("<input>");g.attr({type:"button",value:"start",disabled:"true",});g.addClass("btn");g.addClass("btn-primary");g.css("width","50%");g.click(function(){l.removeAttr("disabled");g.attr("disabled","true");d.gain.value=1});k.append(g);var l=$("<input>");l.attr({type:"button",value:"stop",disabled:"true",});l.addClass("btn");l.addClass("btn-primary");l.css("width","50%");l.click(function(){g.removeAttr("disabled");l.attr("disabled","true");d.gain.value=0});k.append(l);c.append(k);var a=function(o,n){f.c.pr=n.value;d.playbackRate.value=n.value;i.html("Rate "+n.value)};var b=$("<div>");var i=$('<a href="#" rel="tooltip" title="Set playback rate multiplier">').tooltip();b.slider({min:0.1,max:3,value:this.c.pr,step:0.05,slide:a});c.append("<br/>");c.append(i);c.append(b);c.append("<br/>");a(null,{value:this.c.pr});var h=$("<div>");h.html("Drag and drop a sound file to me..");c.append(h);var m=this.info2El=$("<div>");m.html("Now connect me to something..");m.hide();c.append(m);c.parent()[0].addEventListener("drop",function(o){o.stopPropagation();o.preventDefault();f.loader.fadeIn("fast");var n=new FileReader();n.onload=function(p){if(context.decodeAudioData){context.decodeAudioData(p.target.result,function(q){d.buffer=q},function(q){alert("could not play that audio");console.log(q);return})}else{d.buffer=context.createBuffer(p.target.result,false)}d.noteOn(0);l.removeAttr("disabled");if(f.myConnections.length==0){m.show("fast")}h.hide("fast");f.loader.fadeOut("fast")};n.readAsArrayBuffer(o.dataTransfer.files[0])},false);c.parent()[0].addEventListener("dragover",function(n){n.stopPropagation();n.preventDefault();return false},false)},connectTo:function(b){var a=this._super(b);this.info2El.hide("fast");return a},getConnections:function(){return new Array()},shutdown:function(){this.thingy.noteOff(0)}});var WaveShaperNode=BaseNode.extend({init:function(d,c){this._super(d,c);this.shortName="wsn";this.thingy=context.createWaveShaper();this.name="WaveShaper";this.icon="icon-tasks";this.tooltip="Implements non-linear distortion effects";var h=this.createMainEl(true,true,true,166,155);var g=this.thingy;var f=this;if(!c){this.c={cu:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45]}}var a=function(j,k){var m=new Float32Array(10);var i=0;$(h).find(".curveRange").each(function(){var l=$(this).slider("value");f.c.cu[i]=l;m[i++]=l});g.curve=m};h.append($('<a href="#" rel="tooltip" title="The shaping curve used for the waveshaping effect">').tooltip().html("Curve"));h.append($("<br/>"));for(var e=0;e<10;e++){var b=$("<div>");b.slider({orientation:"vertical",min:-1,max:1,step:0.01,value:this.c.cu[e],slide:a});b.addClass("curveRange");h.append(b)}a(null,null)}});var OscillatorNode=BaseNode.extend({init:function(k,d){this._super(k,d);this.shortName="on";this.name="Oscillator";this.icon=" icon-chevron-up";this.tooltip="Oscillator represents an audio source generating a periodic waveform";var b=this.createMainEl(true,false,true,183);try{this.thingy=context.createOscillator()}catch(l){b.append($("<p>").html("Not supported by your browser. You probably need to go Chrome Canary."));return}var c=this.thingy;var h=this;if(!d){this.c={t:"sine",f:0.1,d:0}}var g=function(e){h.c.t=e;switch(e){case"sine":c.type=c.SINE;break;case"square":c.type=c.SQUARE;break;case"sawtooth":c.type=c.SAWTOOTH;break;case"triangle":c.type=c.TRIANGLE;break}};var m=function(q,e){h.c.f=e.value;var r=30;var s=context.sampleRate/2;var p=Math.log(s/r)/Math.LN2;var t=Math.pow(2,p*(e.value-1));c.frequency.value=s*t;j.html("Frequency "+Math.floor(c.frequency.value)+" Hz")};var o=function(p,e){h.c.d=e.value;c.detune.value=e.value;n.html("Detune "+e.value+" Cents")};var a=$("<select>");a.append($("<option>").html("sine"));a.append($("<option>").html("square"));a.append($("<option>").html("sawtooth"));a.append($("<option>").html("triangle"));a.val(this.c.t);a.on("change",function(){g(this.value)});b.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html("Type"));b.append(a);b.append($("<br/>"));g(this.c.t);var f=$("<div>");var j=$('<a href="#" rel="tooltip" title="The frequency of the periodic waveform.">').tooltip();f.slider({min:0,max:1,step:0.01,value:this.c.f,slide:m});b.append(j);b.append(f);b.append($("<br/>"));m(null,{value:this.c.f});var i=$("<div>");var n=$('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();i.slider({min:-100,max:100,step:1,value:this.c.d,slide:o});b.append(n);b.append(i);o(null,{value:this.c.d});c.noteOn(0)},shutdown:function(){this.thingy.noteOff(0)}});var MicrophoneNode=BaseNode.extend({init:function(c){this._super(c);this.shortName="mn";this.name="Microphone";this.icon=" icon-user";this.tooltip="Gets audio input from a microphone";var d=this;this.myLazyConnections=new Array();var f=this.createMainEl(true,false,true,128);var b=$("<p>");f.append(b);try{var a=function(m){d.thingy=context.createMediaStreamSource(m);for(var k in d.myLazyConnections){d.connectTo(d.myLazyConnections[k])}for(var e in d.myConnections){var l=d.myConnections[e];d.createConnectionLine(d.el,l.el,d.idx,l.idx,false)}d.updateConnectionLines();d.myLazyConnections=new Array();b.html("Recording...")};var g=function(i){b.html("Failed to start recording");console.log(i)};if(navigator.getUserMedia){navigator.getUserMedia({audio:true,video:false},a,g)}else{if(navigator.webkitGetUserMedia){navigator.webkitGetUserMedia({audio:true,video:false},a,g)}else{b.html("Not yet supported in your browser. Try Chrome Canary with Web Audio Input flag set.")}}}catch(h){b.html("Not yet supported in your browser. Try Chrome Canary with Web Audio Input flag set.")}},lazyConnectTo:function(a){this.myLazyConnections.push(a)}});var AnalyzerNode=BaseNode.extend({init:function(h,d){this._super(h,d);this.shortName="an";this.thingy=context.createAnalyser();this.icon="icon-eye-open";this.name="Analyzer";this.tooltip="Provides real-time frequency and time-domain analysis information. The audio stream will be passed un-processed from input to output.";var c=this.createMainEl(true,true,true);c.css("margin",0);var g=this.thingy;var e=this;if(!d){this.c={vm:0}}var b=$('<a href="#" rel="tooltip" title="Click to change visualization">').tooltip({placement:"bottom"});c.append(b);var a=new SoundVisualizer(b,150,120);a.canvas.on("click",function(){e.c.vm++;if(e.c.vm==2){a.clear()}else{if(e.c.vm==3){e.c.vm=0;window.requestAnimationFrame(i)}}});var f=null;var i=function(){if(f==null){f=new Uint8Array(g.frequencyBinCount)}if(e.c.vm==0){g.getByteTimeDomainData(f);a.visualizeTimeDomainData(f);window.requestAnimationFrame(i)}else{if(e.c.vm==1){g.getByteFrequencyData(f);a.visualizeFrequencyData(f);window.requestAnimationFrame(i)}}};window.requestAnimationFrame(i)}});var TextToSpeechNode=BaseNode.extend({init:function(j,e){this._super(j,e);this.shortName="tts";this.thingy=context.createBufferSource();this.name="Text To Speech";this.icon="icon-font";this.tooltip="Uses the brilliant speak.js to speak the text";var h=this;if(!e){this.c={t:"All your bases are belong to us!",p:50,s:150,g:0}}var k=function(r,q){h.c.p=q.value;m.html("Pitch "+q.value)};var b=function(r,q){h.c.s=q.value;l.html("Speed "+q.value+" word / minute")};var d=function(r,q){h.c.g=q.value;a.html("Word Gap "+q.value+" ms")};var c=this.createMainEl(true,false,true,313,241);c.css("width","221px");var g=$("<div>");var m=$('<a href="#" rel="tooltip" title="The voice pitch">').tooltip();g.slider({min:10,max:100,value:this.c.p,step:1,slide:k});c.append(m);c.append(g);k(null,{value:this.c.p});var f=$("<div>");var l=$('<a href="#" rel="tooltip" title="The speed at which to talk">').tooltip();f.slider({min:10,max:300,value:this.c.s,step:1,slide:b});c.append(l);c.append(f);b(null,{value:this.c.s});var o=$("<div>");var a=$('<a href="#" rel="tooltip" title="Additional gap between words">').tooltip();o.slider({min:0,max:200,value:this.c.g,step:10,slide:d});c.append(a);c.append(o);d(null,{value:this.c.g});var n=$("<textarea>");var p=$("<input>");var i=function(r){h.c.t=r;h.loader.fadeIn("fast");p.attr("disabled","true");var q=new Worker("js/speakWorker.js");q.onmessage=function(s){h.thingy=context.createBufferSource();context.decodeAudioData(s.data.buffer,function(t){h.thingy.buffer=t;for(var v in h.myConnections){var w=h.myConnections[v];var u=w.getConnections();for(var v in u){h.thingy.connect(u[v])}}h.thingy.noteOn(0);setTimeout(function(){h.thingy.noteOff(0);for(var y in h.myConnections){var z=h.myConnections[y];var x=z.getConnections();for(var y in x){h.thingy.disconnect(x[y])}}p.removeAttr("disabled")},t.duration*1000);h.loader.fadeOut("fast")})};q.postMessage({text:r,args:{pitch:h.c.p,speed:h.c.s,wordgap:h.c.g/10}})};n.attr("cols","30");n.attr("rows","6");n.val(this.c.t);p.attr({type:"button",value:"Speak"});p.on("click",function(){i(n.val())});c.append($("<br/>"));c.append(n);c.append($("<br/>"));c.append(p)}});var PianoNode=BaseNode.extend({init:function(i,B){this._super(i,B);this.shortName="pn";this.name="Piano";this.icon=" icon-play";this.tooltip="Play piano on your keyboard. ";this.deleted=false;var c=this.createMainEl(true,false,true,290);try{this.thingy=context.createOscillator();if(typeof this.thingy.noteOn!="function"){throw new Exception()}}catch(x){c.append($("<p>").html("Not supported by your browser. You probably need to go Chrome Canary."));return}var o=this;if(!B){this.c={t:"sine",d:0,o:2,at:0.3,de:0.3,su:0.8,re:0.3}}var a=this.pianoNotes={};var m=this.shutupFnc=function(e){if(!e){return}e.gain.gain.linearRampToValueAtTime(0,context.currentTime+o.c.re);setTimeout(function(){e.osc.noteOff(0);e.osc.disconnect(e.gain);for(var F in o.myConnections){var G=o.myConnections[F];var E=G.getConnections();for(var F in E){e.gain.disconnect(E[F])}}},o.c.re*1000+50)};var p=function(){var F={};F.osc=context.createOscillator();F.gain=context.createGainNode();F.osc.connect(F.gain);for(var E in o.myConnections){var G=o.myConnections[E];var e=G.getConnections();for(var E in e){F.gain.connect(e[E])}}F.osc.noteOn(0);F.gain.gain.linearRampToValueAtTime(0,context.currentTime);F.gain.gain.linearRampToValueAtTime(1,context.currentTime+o.c.at);setTimeout(function(){if(F.gain.gain.value==1){F.gain.gain.linearRampToValueAtTime(o.c.su,context.currentTime+o.c.de)}},o.c.at*1000);return F};var g=function(e){o.c.t=e;var F=null;switch(e){case"sine":F=o.thingy.SINE;break;case"square":F=o.thingy.SQUARE;break;case"sawtooth":F=o.thingy.SAWTOOTH;break;case"triangle":F=o.thingy.TRIANGLE;break}if(F){for(var E in a){if(a[E]){a[E].osc.type=F}}}};var y=function(E,e){o.c.o=e.value;l.html("Octave "+e.value)};var s=function(F,e){o.c.d=e.value;for(var E in a){if(a[E]){a[E].osc.detune.value=e.value}}d.html("Detune "+e.value+" Cents")};var h=function(E,e){o.c.at=e.value;w.html("Attack "+e.value+" s")};var b=function(E,e){o.c.de=e.value;f.html("Decay "+e.value+" s")};var v=function(E,e){o.c.su=e.value;t.html("Sustain level "+e.value)};var n=function(E,e){o.c.re=e.value;u.html("Release "+e.value+" s")};var D={Z:65.406,S:69.296,X:73.416,D:77.782,C:82.407,V:87.307,G:92.499,B:97.999,H:103.826,N:110,J:116.541,M:123.471,Q:65.406*2,"2":69.296*2,W:73.416*2,"3":77.782*2,E:82.407*2,R:87.307*2,"5":92.499*2,T:97.999*2,"6":103.826*2,Y:110*2,"7":116.541*2,U:123.471*2};this.onkeydown=function(F){if(o.deleted){return}var E=String.fromCharCode(F.keyCode);if(!a[E]){if(D[E]){a[E]=p();a[E].osc.frequency.value=D[E]*o.c.o;g(o.c.t);s(null,{value:o.c.d})}}};this.onkeyup=function(F){if(o.deleted){return}var E=String.fromCharCode(F.keyCode);m(a[E]);a[E]=null};var r=$("<select>");r.append($("<option>").html("sine"));r.append($("<option>").html("square"));r.append($("<option>").html("sawtooth"));r.append($("<option>").html("triangle"));r.val(this.c.t);r.on("change",function(){g(this.value)});c.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html("Type"));c.append(r);c.append($("<br/>"));g(this.c.t);var q=$("<div>");var l=$('<a href="#" rel="tooltip" title="Select the octave of the piano">').tooltip();q.slider({min:1,max:6,step:1,value:this.c.o,slide:y});c.append(l);c.append(q);y(null,{value:this.c.o});var j=$("<div>");var d=$('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();j.slider({min:-100,max:100,step:1,value:this.c.d,slide:s});c.append(d);c.append(j);s(null,{value:this.c.d});var C=$("<div>");var w=$('<a href="#" rel="tooltip" title="Attack time is the time taken for initial run-up of level from nil to peak">').tooltip();C.slider({min:0,max:1,step:0.01,value:this.c.at,slide:h});c.append(w);c.append(C);h(null,{value:this.c.at});var k=$("<div>");var f=$('<a href="#" rel="tooltip" title="Decay time is the time taken for the subsequent run down from the attack level to the designated sustain level.">').tooltip();k.slider({min:0,max:1,step:0.01,value:this.c.de,slide:b});c.append(f);c.append(k);b(null,{value:this.c.de});var z=$("<div>");var t=$('<a href="#" rel="tooltip" title="Sustain level is the level during the main sequence of the sound\'s duration, until the key is released.">').tooltip();z.slider({min:0,max:1,step:0.01,value:this.c.su,slide:v});c.append(t);c.append(z);v(null,{value:this.c.su});var A=$("<div>");var u=$('<a href="#" rel="tooltip" title="Release time is the time taken for the level to decay from the sustain level to zero after the key is released.">').tooltip();A.slider({min:0,max:1,step:0.01,value:this.c.re,slide:n});c.append(u);c.append(A);n(null,{value:this.c.re});if(!localStorage.shownPianoInfo){localStorage.shownPianoInfo="yes";$("#pianoInfoBox").modal()}},shutdown:function(){for(var a in this.pianoNotes){this.shutupFnc(this.pianoNotes[a])}this.deleted=true}});var NoiseNode=BaseNode.extend({init:function(d,c){this._super(d,c);this.shortName="nn";this.thingy=context.createJavaScriptNode(4096,1,1);this.name="Noise";this.icon="icon-question-sign";this.tooltip="Amplifies each sample in the signal with random amount";var g=this.createMainEl(true,true,true,78);var e=this;if(!c){this.c={v:0.5}}var f=function(i,h){e.c.v=h.value;b.html("Amount "+h.value)};var a=$("<div>");var b=$('<a href="#" rel="tooltip" title="Set noise amount">').tooltip();a.slider({min:0,max:3,value:this.c.v,step:0.01,slide:f});g.append(b);g.append(a);f(null,{value:this.c.v});this.thingy.onaudioprocess=function(l){var k=l.inputBuffer.getChannelData(0);var h=l.outputBuffer.getChannelData(0);for(var j=0;j<k.length;j++){h[j]=k[j]*(1+(Math.random()*e.c.v)-e.c.v*0.5)}}}});var VibratoNode=BaseNode.extend({init:function(h,c){this._super(h,c);this.shortName="vn";this.thingy=context.createJavaScriptNode(4096,1,1);this.name="Vibrato";this.icon="icon-leaf";this.tooltip="Adds a vibrato effect to the signal";var b=this.createMainEl(true,true,true,110);var g=this;if(!c){this.c={v:0.5,s:1}}var j=function(m,l){g.c.v=l.value;e.html("Amount "+l.value)};var a=function(m,l){g.c.s=l.value;i.html("Speed "+l.value)};var k=$("<div>");var e=$('<a href="#" rel="tooltip" title="Set vibrato amount">').tooltip();k.slider({min:0,max:3,value:this.c.v,step:0.01,slide:j});b.append(e);b.append(k);j(null,{value:this.c.v});var f=$("<div>");var i=$('<a href="#" rel="tooltip" title="Set vibrato speed">').tooltip();f.slider({min:0,max:3,value:this.c.v,step:0.01,slide:a});b.append(i);b.append(f);a(null,{value:this.c.s});var d=0;this.thingy.onaudioprocess=function(o){var n=o.inputBuffer.getChannelData(0);var l=o.outputBuffer.getChannelData(0);for(var m=0;m<n.length;m++){l[m]=n[m]*(1+Math.sin(d*g.c.s*0.001)*g.c.v);d++}}}});var PitchNode=BaseNode.extend({init:function(d,c){this._super(d,c);this.shortName="ptn";this.thingy=context.createJavaScriptNode(8192,1,1);this.name="Pitch";this.icon="icon-resize-full";this.tooltip="A simple artifact introducing pitch changer";var g=this.createMainEl(true,true,true,78);var e=this;if(!c){this.c={v:1}}var f=function(i,h){e.c.v=h.value;b.html("Amount "+h.value)};var a=$("<div>");var b=$('<a href="#" rel="tooltip" title="Set pitch amount">').tooltip();a.slider({min:0,max:3,value:this.c.v,step:0.01,slide:f});g.append(b);g.append(a);f(null,{value:this.c.v});this.thingy.onaudioprocess=function(p){var o=p.inputBuffer.getChannelData(0);var k=p.outputBuffer.getChannelData(0);var j;var n;var h=o.length;for(var m=0;m<h;m++){j=Math.floor(m*e.c.v);if(j>=h){j=h-(j-h)-1}n=o[j];k[m]=n}}}});var SaveHandler=Class.extend({init:function(){this.localStorageSavePrefix="save_"},createSaveData:function(){var d={nodes:[]};for(var c in nodes){var e=nodes[c];if(!e.deleted){var a=new Array();for(var b in e.myConnections){if(!e.myConnections[b].deleted){a.push(e.myConnections[b].idx)}}d.nodes.push({i:e.idx,sn:e.shortName,d:e.c,p:e.el.offset(),c:a})}}return window.btoa(JSON.stringify(d))},loadSaveData:function(f){var h=JSON.parse(window.atob(f));for(var g in nodes){for(var e in nodes[g].myConnections){nodes[g].disconnectFrom(nodes[g].myConnections[e])}nodes[g].shutdown();nodes[g].el.remove()}$(".line").remove();nodes=new Array();for(var g in h.nodes){var c=h.nodes[g];var d=this.createNodeFromString(c);d.el.offset(c.p);nodes[c.i]=d}for(var g in h.nodes){var c=h.nodes[g];if(c.c.length>0){for(var e in c.c){var l=c.c[e];var k=nodes[c.i];if(k instanceof MicrophoneNode){k.lazyConnectTo(nodes[l])}else{k.connectTo(nodes[l])}}}}for(var g in nodes){var b=nodes[g];if(b){for(var e in b.myConnections){var a=b.myConnections[e];b.createConnectionLine(b.el,a.el,b.idx,a.idx,false)}b.updateConnectionLines()}}},createNodeFromString:function(b){var a=null;switch(b.sn){case"mn":a=new MicrophoneNode(b.i,b.d);break;case"gn":a=new GainNode(b.i,b.d);break;case"scn":a=new ScriptNode(b.i,b.d);break;case"son":a=new SourceNode(b.i,b.d);break;case"bfn":a=new BiquadFilterNode(b.i,b.d);break;case"cn":a=new ConvolverNode(b.i,b.d);break;case"deln":a=new DelayNode(b.i,b.d);break;case"dstn":a=new DestinationNode(b.i,b.d);break;case"dcn":a=new DynamicsCompressorNode(b.i,b.d);break;case"wsn":a=new WaveShaperNode(b.i,b.d);break;case"on":a=new OscillatorNode(b.i,b.d);break;case"an":a=new AnalyzerNode(b.i,b.d);break;case"tts":a=new TextToSpeechNode(b.i,b.d);break;case"pn":a=new PianoNode(b.i,b.d);break;case"nn":a=new NoiseNode(b.i,b.d);break;case"vn":a=new VibratoNode(b.i,b.d);break;case"ptn":a=new PitchNode(b.i,b.d);break}return a},saveToLocalStorage:function(b){var a=this.createSaveData();localStorage[this.localStorageSavePrefix+b]=a},loadFromLocalStorage:function(b){var a=localStorage[this.localStorageSavePrefix+b];this.loadSaveData(a)},getAllSavesInLocalStorage:function(){var a=new Array();for(var c=0;c<localStorage.length;c++){var b=localStorage.key(c);if(b.substr(0,5)===this.localStorageSavePrefix){a.push(b.substr(5))}}return a}});(function(){var b=0;var c=["ms","moz","webkit","o"];for(var a=0;a<c.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[c[a]+"CancelAnimationFrame"]||window[c[a]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(h,e){var d=new Date().getTime();var f=Math.max(0,16-(d-b));var g=window.setTimeout(function(){h(d+f)},f);b=d+f;return g}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)}}}());var nodes=new Array();var context=null;var connLineWidth=30;$(function(){var c=function(){var e=$("#loadSelect");var h=$("#loadNothing");var g=$("#loadOkBtn");e.empty();var d=new SaveHandler().getAllSavesInLocalStorage();for(var f in d){e.append($("<option>").html(d[f]))}if(d.length===0){e.hide();h.show();g.addClass("disabled")}else{e.show();h.hide();g.removeClass("disabled")}};$("body").css("height",window.innerHeight-40);$("a.brand").tooltip({placement:"bottom"});$("#firstTimeChk").on("change",function(){if(this.checked){localStorage.beenherebefore="yes"}else{localStorage.removeItem("beenherebefore")}});$("#pianoInfoChk").on("change",function(){if(this.checked){localStorage.shownPianoInfo="yes"}else{localStorage.removeItem("shownPianoInfo")}});var a=function(e){var d=new SaveHandler();var f=d.createNodeFromString({sn:e,i:nodes.length});nodes.push(f);return f};$("ul.nodeslist > li > a").draggable({revert:true});$("body").droppable({accept:"ul.nodeslist > li > a",drop:function(e,f){var d=$(f.draggable[0]).attr("data-nodetype");var g=a(d);g.el.offset({left:e.clientX,top:e.clientY})}});$("ul.nodeslist > li > a").on("click",function(){var d=$(this).attr("data-nodetype");a(d)});try{context=new (window.AudioContext||window.webkitAudioContext)()}catch(b){context=null}document.onkeydown=function(f){for(var d in nodes){if(nodes[d]&&nodes[d] instanceof PianoNode){nodes[d].onkeydown(f)}}};document.onkeyup=function(f){for(var d in nodes){if(nodes[d]&&nodes[d] instanceof PianoNode){nodes[d].onkeyup(f)}}};if(context==null){$("#noWebAudioBox").modal()}else{setTimeout(function(){var d=getUrlParams();if(d.data){new SaveHandler().loadSaveData(d.data)}else{nodes[0]=new SourceNode(0);nodes[1]=new DestinationNode(1);nodes[0].el.offset({left:250,top:window.innerHeight/2-100});nodes[1].el.offset({left:window.innerWidth-200,top:window.innerHeight/2-150})}if(!localStorage.beenherebefore&&!d.data){localStorage.beenherebefore="yes";$("#firstTimeBox").modal()}},700);$("#saveOkBtn").on("click",function(){var d=$("#saveTxt").val();if(d.length>0){new SaveHandler().saveToLocalStorage(d);c();$("#saveBox").modal("hide")}});$("#saveTxt").on("keyup",function(){if($(this).val().length==0){$("#saveOkBtn").addClass("disabled")}else{$("#saveOkBtn").removeClass("disabled")}});$("#loadOkBtn").on("click",function(){var d=$("#loadSelect").val();new SaveHandler().loadFromLocalStorage(d);$("#saveTxt").val(d);$("#saveOkBtn").removeClass("disabled");$("#loadBox").modal("hide")});$("#shareBtn").on("click",function(){var d=window.location.origin+window.location.pathname+"?data="+new SaveHandler().createSaveData();$("#shareLink").attr("href",d).html(d);$("#shareBox").modal()});c();$(document.body).on("keypress","select",function(d){d.preventDefault()})}});function getUrlParams(){var a={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(d,b,c){a[b]=c});return a};
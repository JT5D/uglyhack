/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();// Web Audio API Simulator
// Copyright (c) 2013 g200kg
// http://www.g200kg.com/
//         Released under the MIT-License
//         http://opensource.org/licenses/MIT
//
//  Great thanks :
//  FFT algo for AnalyserNode and Convolver is based on Takuya OOURA's explanation.
//   http://www.kurims.kyoto-u.ac.jp/~ooura/fftman/index.html

if(typeof(waapisimLogEnable)==="undefined")
	var waapisimLogEnable=0;

// Support Float32Array&Uint8Array if unavailable (for IE9)
if(typeof(Float32Array)==="undefined") {
	Float32Array=function(n) {
		if(n instanceof Array)
			return n;
		var a=new Array(n);
		a.subarray=function(x,y) {return this.slice(x,y);};
		a.set=function(x,off) {for(var i=0;i<x.length;++i) a[off+i]=x[i];};
		return a;
	};
}
if(typeof(Uint8Array)==="undefined") {
	Uint8Array=function(n) {
		if(n instanceof Array)
			return n;
		var a=new Array(n);
		a.subarray=function(x,y) {return this.slice(x,y);};
		a.set=function(x,off) {for(var i=0;i<x.length;++i) a[off+i]=x[i];};
		return a;
	};
}

if(typeof(waapisimLogEnable)!=="undefined"&&waapisimLogEnable)
	waapisimDebug=console.log;
else
	waapisimDebug=function(){};

if(typeof(webkitAudioContext)!=="undefined") {
	if(typeof(webkitAudioContext.prototype.createGain)==="undefined") {
		webkitAudioContext.prototype.createScriptProcessor=webkitAudioContext.prototype.createJavaScriptNode;
		webkitAudioContext.prototype.createGain=(function(){
			var o=webkitAudioContext.prototype.createGainNode.call(this);
			o._gain=o.gain; o.gain=o._gain;
			o.gain.setTargetAtTime=o._gain.setTargetValueAtTime;
			return o;
		});
		webkitAudioContext.prototype.createDelay=(function(){
			var o=webkitAudioContext.prototype.createDelayNode.call(this);
			o._delayTime=o.delayTime; o.delayTime=o._delayTime;
			o.delayTime.setTargetAtTime=o._delayTime.setTargetValueAtTime;
			return o;
		});
		webkitAudioContext.prototype._createOscillator=webkitAudioContext.prototype.createOscillator;
		webkitAudioContext.prototype.createOscillator=(function() {
			var o=webkitAudioContext.prototype._createOscillator.call(this);
			o._frequency=o.frequency; o.frequency=o._frequency;
			o.frequency.setTargetAtTime=o._frequency.setTargetValueAtTime;
			o._detune=o.detune; o.detune=o._detune;
			o.detune.setTargetAtTime=o._detune.setTargetValueAtTime;
			o.start=o.noteOn;
			o.stop=o.noteOff;
			return o;
		});
		webkitAudioContext.prototype._createBufferSource=webkitAudioContext.prototype.createBufferSource;
		webkitAudioContext.prototype.createBufferSource=(function() {
			var o=webkitAudioContext.prototype._createBufferSource.call(this);
			o._playbackRate=o.playbackRate; o.playbackRate=o._playbackRate;
			o.playbackRate.setTargetAtTime=o._playbackRate.setTargetValueAtTime;
			o.start=function(w,off,dur) {
				if(off===undefined)
					o.noteOn(w);
				else
					o.noteGrainOn(w,off,dur);
			};
			o.stop=o.noteOff;
			return o;
		});
		webkitAudioContext.prototype._createBiquadFilter=webkitAudioContext.prototype.createBiquadFilter;
		webkitAudioContext.prototype.createBiquadFilter=(function() {
			var o=webkitAudioContext.prototype._createBiquadFilter.call(this);
			o._frequency=o.frequency; o.frequency=o._frequency;
			o.frequency.setTargetAtTime=o._frequency.setTargetValueAtTime;
			o._Q=o.Q; o.Q=o._Q;
			o.Q.setTargetAtTime=o._Q.setTargetValueAtTime;
			o._gain=o.gain; o.gain=o._gain;
			o.gain.setTargetAtTime=o._gain.setTargetValueAtTime;
			return o;
		});
		webkitAudioContext.prototype._createDynamicsCompressor=webkitAudioContext.prototype.createDynamicsCompressor;
		webkitAudioContext.prototype.createDynamicsCompressor=(function() {
			var o=webkitAudioContext.prototype._createDynamicsCompressor.call(this);
			o._threshold=o.threshold; o.threshold=o._threshold;
			o.threshold.setTargetAtTime=o._threshold.setTargetValueAtTime;
			o._knee=o.knee; o.knee=o._knee;
			o.knee.setTargetAtTime=o._knee.setTargetValueAtTime;
			o._ratio=o.ratio; o.ratio=o._ratio;
			o.ratio.setTargetAtTime=o._ratio.setTargetValueAtTime;
			o._attack=o.attack; o.attack=o._attack;
			o.attack.setTargetAtTime=o._attack.setTargetValueAtTime;
			return o;
		});
	}
}

if(typeof(webkitAudioContext)==="undefined" && typeof(AudioContext)==="undefined") {
	waapisimSampleRate=44100;
	waapisimAudioIf=0;
	waapisimBufSize=1024;
	waapisimFlashBufSize=1024*3;
	if(typeof(Audio)!=="undefined") {
		waapisimAudio=new Audio();
		if(typeof(waapisimAudio.mozSetup)!=="undefined")
			waapisimAudioIf=1;
	}
	if(waapisimAudioIf===0) {
		waapisimOutBufSize=waapisimFlashBufSize;
		waapisimOutBuf=new Array(waapisimOutBufSize*2);
	}
	else {
		waapisimOutBufSize=waapisimBufSize;
		waapisimOutBuf=new Float32Array(waapisimOutBufSize*2);
		waapisimAudio.mozSetup(2,waapisimSampleRate);
	}
	for(var l=waapisimOutBuf.length,i=0;i<l;++i)
		waapisimOutBuf[i]=0;
	waapisimWrittenpos=0;
	waapisimNodeId=0;
	waapisimContexts=[];
	waapisimAudioBuffer=function(ch,len,rate) {
		var i,j;
		if(typeof(ch)=="number") {
			this.sampleRate=rate;
			this.length=len;
			this.duration=len/this.sampleRate;
			this.numberOfChannels=ch;
			this.buf=[];
			for(i=0;i<2;++i) {
				this.buf[i]=new Float32Array(len);
				for(j=0;j<len;++j)
					this.buf[i][j]=0;
			}
		}
		else {
			var inbuf;
			this.sampleRate=44100;
			this.buf=[];
			this.buf[0]=new Float32Array(0);
			this.buf[1]=new Float32Array(0);
			this.Get4BStr=function(b,n) {
				return String.fromCharCode(b[n],b[n+1],b[n+2],b[n+3]);
			};
			this.GetDw=function(b,n) {
				return b[n]+(b[n+1]<<8)+(b[n+2]<<16)+(b[n+3]<<24);
			};
			this.GetWd=function(b,n) {
				return b[n]+(b[n+1]<<8);
			};
			inbuf=new Uint8Array(ch);
			var mixtomono=len;
			var riff=this.Get4BStr(inbuf,0);
			if(riff=="RIFF") {
				var filesize=this.GetDw(inbuf,4)+8;
				var wave=this.Get4BStr(inbuf,8);
				var fmtid=0;
				var wavch=1;
				var wavbits=16;
				if(wave=="WAVE") {
					var idx=12;
					while(idx<filesize) {
						var chunk=this.Get4BStr(inbuf,idx);
						var chunksz=this.GetDw(inbuf,idx+4);
						if(chunk=="fmt ") {
							fmtid=this.GetWd(inbuf,idx+8);
							wavch=this.GetWd(inbuf,idx+10);
							this.sampleRate=this.GetDw(inbuf,idx+12);
							wavbits=this.GetWd(inbuf,idx+22);
						}
						if(chunk=="data") {
							this.length=(chunksz/wavch/(wavbits/8))|0;
							this.buf[0]=new Float32Array(this.length);
							this.buf[1]=new Float32Array(this.length);
							this.numberOfChannels=wavch;
							this.duration=this.length/this.sampleRate;
							var v0,v1;
							for(i=0,j=0;i<this.length;++i) {
								if(wavbits==16) {
									if(wavch==2) {
										v0=inbuf[idx+j+8]+(inbuf[idx+j+9]<<8);
										v1=inbuf[idx+j+10]+(inbuf[idx+j+11]<<8);
										if(v0>=32768) v0=v0-65536;
										if(v1>=32768) v1=v1-65536;
										if(mixtomono===true)
											v0=v1=(v0+v1)*0.5;
										this.buf[0][i]=v0/32768;
										this.buf[1][i]=v1/32768;
										j+=4;
									}
									else {
										v=inbuf[idx+j+8]+(inbuf[idx+j+9]<<8);
										if(v>=32768) v=v-65536;
										this.buf[0][i]=this.buf[1][i]=v/32768;
										j+=2;
									}
								}
								else {
									if(wavch==2) {
										v0=inbuf[idx+j+8]/128-1;
										v1=inbuf[idx+j+9]/128-1;
										if(mixtomono===true)
											v0=v1=(v0+v1)*0.5;
										this.buf[0][i]=v0;
										this.buf[1][i]=v1;
										j+=2;
									}
									else {
										this.buf[0][i]=this.buf[1][i]=inbuf[idx+j+8]/128-1;
										j++;
									}
								}
							}
						}
						idx+=(chunksz+8);
					}
				}
			}
		}
		this.getChannelData=function(i) {
			return this.buf[i];
		};
	};
	waapisimDummybuf=new waapisimAudioBuffer(2,waapisimBufSize,waapisimSampleRate);
	waapisimSetupOutBuf=function(offset) {
		var numctx=waapisimContexts.length;
		var l,i,j,k,n,node;
		for(l=(offset+waapisimBufSize)*2,i=offset*2;i<l;i+=2)
			waapisimOutBuf[i]=waapisimOutBuf[i+1]=0;
		for(n=0;n<numctx;++n) {
			var ctx=waapisimContexts[n];
			for(;;) {
				for(l=ctx._Nodes.length,i=0;i<l;++i) {
					node=ctx._Nodes[i];
					if(node.playbackState==3) {
						node.disconnect();
						ctx._UnregisterNode(node);
						break;
					}
				}
				if(i==l)
					break;
			}
			for(l=ctx._Nodes.length,i=0;i<l;++i)
				ctx._Nodes[i]._Process();
			node=ctx.destination;
			if(node._nodein[0].from.length>0) {
				var buf=node._nodein[0].inbuf.buf;
				for(i=0;i<waapisimBufSize;++i) {
					waapisimOutBuf[(i+offset)*2]+=buf[0][i];
					waapisimOutBuf[(i+offset)*2+1]+=buf[1][i];
				}
			}
			node._nodein[0].NodeClear();
		}
	};
	waapisimUpdateCurrentTime=function(t) {
		for(var i=waapisimContexts.length;i--;)
			waapisimContexts[i].currentTime=t;
	};
	waapisimInterval=function() {
		var curpos=waapisimAudio.mozCurrentSampleOffset();
		var buffered=waapisimWrittenpos-curpos;
		var vl,vr;
		waapisimUpdateCurrentTime(curpos/(waapisimSampleRate*2));
		if(buffered<16384) {
			waapisimSetupOutBuf(0);
			waapisimWrittenpos+=waapisimAudio.mozWriteAudio(waapisimOutBuf);
		}
	};
	waapisimGetSwfPath=function() {
		var scr=document.getElementsByTagName("SCRIPT");
		if(scr&&scr.length>0) {
			for(var i in scr) {
				if(scr[i].src && scr[i].src.match(/waapisim\.js$/)) {
					var s=scr[i].src;
					return s.substring(0,s.length-2)+"swf";
				}
			}
		}
		return "";
	};
	waapisimAddFlashObj=function() {
		var div=document.createElement("DIV");
		div.setAttribute("id","WAAPISIMFLASHOBJ");
		div.setAttribute("style","background:#ff00ff;positoin:static;");
		var body=document.getElementsByTagName("BODY");
		body[0].appendChild(div);
		document.getElementById("WAAPISIMFLASHOBJ").innerHTML="<div style='position:fixed;right:0px;bottom:0px'> <object id='waapisim_swf' CLASSID='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' CODEBASE='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,0,0' width=150 height=20><param name=movie value='"+waapisimSwfPath+"'><PARAM NAME=bgcolor VALUE=#FFFFFF><PARAM NAME=LOOP VALUE=false><PARAM NAME=quality VALUE=high><param name='allowScriptAccess' value='always'><embed src='"+waapisimSwfPath+"' width=150 height=20 bgcolor=#FFFFFF loop=false quality=high pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' allowScriptAccess='always'></embed></object></div>";
	};
	waapisimFlashOffset=function(pos) {
		waapisimUpdateCurrentTime(pos/1000);
	};
	waapisimFlashGetData=function() {
		var s="";
		var l;
		for(l=waapisimOutBufSize/waapisimBufSize,i=0;i<l;++i) {
			waapisimSetupOutBuf(waapisimBufSize*i);
		}
		waapisimWrittenpos+=waapisimOutBufSize*2;
		for(l=waapisimOutBufSize*2,i=0;i<l;++i) {
			var v=((waapisimOutBuf[i]+1)*32768)|0;
			if(isNaN(v)) v=32768;
			if(v>65525) v=65525;
			if(v<1) v=1;
			s+=String.fromCharCode(v);
		}
		return s;
	};
	switch(waapisimAudioIf) {
	case 0:
		waapisimSwfPath=waapisimGetSwfPath();
		window.addEventListener("load",waapisimAddFlashObj,false);
		break;
	case 1:
		setInterval(waapisimInterval,10);
		break;
	}
	AudioContext=webkitAudioContext=function() {
		waapisimContexts.push(this);
		this._Nodes=[];
		this.destination=new waapisimAudioDestinationNode(this);
		this.sampleRate=44100;
		this.currentTime=0;
		this.activeSourceCount=0;
		this.listener=new waapisimAudioListener();
		this.createBuffer=function(ch,len,rate) {
			return new waapisimAudioBuffer(ch,len,rate);
		};
		this.createBufferSource=function() {
			return new waapisimAudioBufferSource(this);
		};
		this.createScriptProcessor=this.createJavaScriptNode=function(bufsize,inch,outch) {
			return new waapisimScriptProcessor(this,bufsize,inch,outch);
		};
		this.createBiquadFilter=function() {
			return new waapisimBiquadFilter(this);
		};
		this.createGain=this.createGainNode=function() {
			return new waapisimGain(this);
		};
		this.createDelay=this.createDelayNode=function() {
			return new waapisimDelay(this);
		};
		this.createOscillator=function() {
			return new waapisimOscillator(this);
		};
		this.createAnalyser=function() {
			return new waapisimAnalyser(this);
		};
		this.createConvolver=function() {
			return new waapisimConvolver(this);
		};
		this.createDynamicsCompressor=function() {
			return new waapisimDynamicsCompressor(this);
		};
		this.createPanner=function() {
			return new waapisimPanner(this);
		};
		this.createChannelSplitter=function(ch) {
			return new waapisimChannelSplitter(this,ch);
		};
		this.createChannelMerger=function(ch) {
			return new waapisimChannelMerger(this,ch);
		};
		this.createWaveShaper=function() {
			return new waapisimWaveShaper(this);
		};
		this.decodeAudioData=function(audioData,successCallback,errorCallback) {
			var buf=new waapisimAudioBuffer(audioData,false);
			successCallback(buf);
		};
		this.createWaveTable=function(real,imag) {
			return new waapisimWaveTable(real,imag);
		};
		this._SortNode=function() {
			var i,j,k,n;
			for(i=0;i<this._Nodes.length;++i) {
				n=this._Nodes[i];
				if(n._order>0) {
					for(j=0;j<n._nodein.length;++j) {
						for(k=0;k<n._nodein[j].from.length;++k) {
							var o=n._nodein[j].from[k].node._order;
							if(n._order<o+1)
								n._order=o+1;
						}
					}
				}
			}
			this._Nodes.sort(function(a,b){return b._order-a._order;});
		}
		this._RegisterNode=function(node) {
			for(var i=this._Nodes.length;i--;) {
				if(this._Nodes[i]===node) {
					return false;
				}
			}
			this._Nodes.push(node);
			this._SortNode();
			return true;
		};
		this._UnregisterNode=function(node) {
			for(var i=this._Nodes.length;i--;) {
				if(this._Nodes[i]==node) {
					this._Nodes.splice(i,1);
				}
			}
		};
	};
	waapisimAudioListener=function() {
		this.px=0; this.py=0; this.pz=0;
		this.ox=0; this.oy=0; this.oz=-1;
		this.ux=0; this.uy=1; this.uz=0;
		this.dopplerFactor=1;
		this.speedOfSound=343.3;
		this.setPosition=function(x,y,z) {this.px=x;this.py=y;this.pz=z;};
		this.setOrientation=function(x,y,z,ux,uy,uz) {this.ox=x;this.oy=y;this.oz=z;this.ux=ux;this.uy=uy;this.uz=uz;};
		this.setVelocity=function(x,y,z) {};
	};
	waapisimWaveTable=function(real,imag) {
		var n=4096;
		var ar=new Array(n);
		var ai=new Array(n);
		this.buf=new Float32Array(n);
		var m, mh, i, j, k;
		var wr, wi, xr, xi;
		for(i=0;i<n;++i)
			ar[i]=ai[i]=0;
		i=j=0;
		do {
			ar[i]=real[j];
			ai[i]=-imag[j];
			for(var k=n>>1;k>(i^=k);k>>=1)
				;
		} while(++j<real.length);
		var theta=2*Math.PI;
		for(mh=1;(m=mh<<1)<=n;mh=m) {
			theta *= 0.5;
			for(i=0;i<mh;i++) {
				wr=Math.cos(theta*i);
				wi=Math.sin(theta*i);
				for(j=i;j<n;j+=m) {
					k=j+mh;
					xr=wr*ar[k]-wi*ai[k];
					xi=wr*ai[k]+wi*ar[k];
					ar[k]=ar[j]-xr;
					ai[k]=ai[j]-xi;
					ar[j]+=xr;
					ai[j]+=xi;
				}
			}
		}
		var max=0;
		for(i=0;i<n;++i) {
			var v=Math.abs(ar[i]);
			if(v>max)
				max=v;
		}
		if(max==0) {
			for(i=0;i<n;++i)
				this.buf[i]=0;
		}
		else {
			for(i=0;i<n;++i)
				this.buf[i]=ar[i]/max;
		}
	};
	waapisimAudioNode=function(size,numin,numout) {
		this.numberOfInputs=numin;
		this.numberOfOutputs=numout;
		this._nodeId=waapisimNodeId;
		this._order=1;
		++waapisimNodeId;
		this._targettype=1;
		this.context=null;
		this.bufsize=size;
		this._nodein=[];
		this._nodeout=[];
		var i;
		for(i=0;i<numin;++i)
			this._nodein[i]=new waapisimAudioNodeIn(this,size);
		for(i=0;i<numout;++i)
			this._nodeout[i]=new waapisimAudioNodeOut(this,size);
		this.connect=function(next,output,input) {
			if(typeof(output)==="undefined")
				output=0;
			if(typeof(input)==="undefined")
				input=0;
			if(this._nodeout[output]) {
				if(next._targettype!==0)
					this._nodeout[output].connect(next._nodein[input]);
				else
					this._nodeout[output].connect(next);
			}
		};
		this.disconnect=function(output) {
			if(typeof(this._nodeout[output])==="undefined")
				output=0;
			this._nodeout[output].disconnect();
		};
	};
	waapisimAudioNodeIn=function(node,size) {
		this.node=node;
		this.from=[];
		this.inbuf=new waapisimAudioBuffer(2,size,waapisimSampleRate);
		this.NodeClear=function() {
			for(var i=0;i<waapisimBufSize;++i)
				this.inbuf.buf[0][i]=this.inbuf.buf[1][i]=0;
		};
	};
	waapisimAudioNodeOut=function(node,size) {
		this.node=node;
		this.to=[];

		this.connect=function(next) {
			waapisimDebug("connect "+this.node._nodetype+this.node._nodeId+"=>"+next.node._nodetype+next.node._nodeId);
			if(next===undefined)
				return;
			if(next.from.indexOf(this)!=-1)
				return;
			next.from.push(this);
			if(this.to.indexOf(next)==-1)
				this.to.push(next);
			if(next.node._targettype!==0) {
				if(this.node.context._RegisterNode(next.node)) {
					for(var i=0;i<next.node._nodeout.length;++i) {
						for(var ii=0;ii<next.node._nodeout[i].to.length;++ii) {
							next.node._nodeout[i].connect(next.node._nodeout[i].to[ii]);
						}
					}
				}
			}
		};
		this.disconnectTemp=function() {
			var i,j,k,l,n,ii,jj,ll,node,node2;
			waapisimDebug("disconnect "+this.node._nodetype+this.node._nodeId);
			var nodes=this.node.context._Nodes;
			for(l=nodes.length,i=0;i<l;++i) {
				for(ll=nodes[i]._nodein.length,ii=0;ii<ll;++ii) {
					j=nodes[i]._nodein[ii].from.indexOf(this);
					if(j>=0) {
						waapisimDebug("  :"+this.node._nodeId+"=>"+nodes[i]._nodeId);
						nodes[i]._nodein[ii].from.splice(j,1);
					}
				}
			}
			for(i=0;i<nodes.length;++i) {
				node=nodes[i];
				if(node._targettype==1) {
					n=0;
					for(ii=0;ii<node._nodein.length;++ii)
						n+=node._nodein[ii].from.length;
					if(n===0) {
						this.node.context._UnregisterNode(node);
						for(ii=0;ii<node._nodeout.length;++ii)
							node._nodeout[ii].disconnectTemp();
						break;
					}
				}
			}
		};
		this.disconnect=function() {
			this.disconnectTemp();
			this.to.length=0;
		};
		this.NodeEmit=function(idx,v1,v2) {
			for(var l=this.to.length,i=0;i<l;++i) {
				var buf=this.to[i].inbuf.buf;
				buf[0][idx]+=v1;
				buf[1][idx]+=v2;
			}
		};
		this.NodeEmitBuf=function() {
			for(var l=this.to.length,i=0;i<l;++i) {
				var b0=this.to[i].inbuf.buf[0];
				var b1=this.to[i].inbuf.buf[1];
				for(var j=0;j<waapisimBufSize;++j) {
					b0[j]+=this.outbuf.buf[0][j];
					b1[j]+=this.outbuf.buf[1][j];
				}
			}
		};
		this.outbuf=new waapisimAudioBuffer(2,size,waapisimSampleRate);
	};
	waapisimAudioProcessingEvent=function() {
	};
	waapisimAudioDestinationNode=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,0);
		this._nodetype="Destination";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this._targettype=2;
		this.context=ctx;
		this.playbackState=0;
		this.maxNumberOfChannels=2;
		this.numberOfChannels=2;
		this._Process=function() {};
		ctx._Nodes.push(this);
	};
	
	waapisimAudioBufferSource=webkitAudioBufferSourceNode=AudioBufferSourceNode=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,0,1);
		this._nodetype="BufSrc";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this._targettype=3;
		this._order=0;
		this.context=ctx;
		this.playbackState=0;
		this.buffer=null;
		this.playbackRate=new waapisimAudioParam(ctx,this,0,10,1);
		this.loop=false;
		this.loopStart=0;
		this.loopEnd=0;
		this._bufferindex=0;
		this._whenstart=0;
		this._whenstop=Number.MAX_VALUE;
		this._endindex=0;
		this._actualLoopStart=0;
		this._actualLoopEnd=0;
		this.start=this.noteOn=this.noteGrainOn=function(w,off,dur) {
			this.playbackState=1;
			this._whenstart=w;
			if(off>0)
				this._bufferindex=off*waapisimSampleRate;
			this._endindex=this.buffer.length;
			if(dur>0)
				this._endindex=Math.min(this.buffer.length,(dur+off)*waapisimSampleRate);
			if(this.loop) {
				if((this.loopStart||this.loopEnd)&&this.loopStart>=0&&this.loopEnd>0&&this.loopStart<this.loopEnd) {
					this._actualLoopStart=this.loopStart;
					this._actualLoopEnd=Math.min(this.loopEnd,this.buffer.length);
				}
				else {
					this._actualLoopStart=0;
					this._actualLoopEnd=this.buffer.length;
				}
			}
			this.context._RegisterNode(this);
		};
		this.stop=this.noteOff=function(w) {
			this._whenstop=w;
		};
		this._Process=function() {
			this.playbackRate._Process();
			if(this.buffer!==null && this._bufferindex>=this._endindex) {
				if(this.playbackState==2)
					--this.context.activeSourceCount;
				this.playbackState=3;
			}
			if(this.playbackState==1 && this.context.currentTime>=this._whenstart) {
				this.playbackState=2;
				++this.context.activeSourceCount;
			}
			if(this.playbackState==2 && this.context.currentTime>=this._whenstop) {
				this.playbackState=3;
				--this.context.activeSourceCount;
			}
			if(this.playbackState!=2)
				return;
			var b0=this.buffer.getChannelData(0);
			var b1=this.buffer.getChannelData(1);
			var rate=44100/this.buffer.sampleRate;
			if(this._nodeout[0].to.length>0) {
				for(var i=0;i<waapisimBufSize;++i) {
					if(this._bufferindex<this._endindex) {
						var idx=this._bufferindex|0;
						this._nodeout[0].outbuf.buf[0][i]=b0[idx];
						this._nodeout[0].outbuf.buf[1][i]=b1[idx];
					}
					this._bufferindex+=rate*this.playbackRate.Get(i);
					if(this.loop) {
						if(this._bufferindex>=this._actualLoopEnd)
							this._bufferindex=this._actualLoopStart;
					}
				}
				this._nodeout[0].NodeEmitBuf();
				this.playbackRate.Clear(true);
			}
		};
	};
	waapisimAudioBufferSource.UNSCHEDULED_STATE=waapisimAudioBufferSource.prototype.UNSCHEDULED_STATE=0;
	waapisimAudioBufferSource.SCHEDULED_STATE=waapisimAudioBufferSource.prototype.SCHEDULED_STATE=1;
	waapisimAudioBufferSource.PLAYING_STATE=waapisimAudioBufferSource.prototype.PLAYING_STATE=2;
	waapisimAudioBufferSource.FINISHED_STATE=waapisimAudioBufferSource.prototype.FINISHED_STATE=3;
	
	waapisimScriptProcessor=function(ctx,bufsize,inch,outch) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="ScrProc";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this._targettype=2;
		this.context=ctx;
		this.playbackState=0;
		if(typeof(bufsize)!=="number")
			throw(new TypeError("ScriptProcessor:bufferSize"));
		if(typeof(inch)==="undefined")
			inch=2;
		if(typeof(outch)==="undefined")
			outch=2;
		this.bufferSize=bufsize;
		this._scrinbuf=new waapisimAudioBuffer(inch,bufsize,waapisimSampleRate);
		this._scroutbuf=new waapisimAudioBuffer(outch,bufsize,waapisimSampleRate);
		this._index=bufsize;
		this.onaudioprocess=null;
		this._Process=function() {
			var inb=this._nodein[0].inbuf;
			if(inb===null)
				inb=waapisimDummybuf;
			for(var i=0;i<waapisimBufSize;++i) {
				if(this._index>=this.bufferSize) {
					if(this.onaudioprocess) {
						var ev=new waapisimAudioProcessingEvent();
						ev.node=this;
						ev.inputBuffer=this._scrinbuf;
						ev.outputBuffer=this._scroutbuf;
						this.onaudioprocess(ev);
					}
					this._index=0;
				}
				this._scrinbuf.buf[0][this._index]=inb.buf[0][i];
				if(this._scrinbuf.numberOfChannels>=2)
					this._scrinbuf.buf[1][this._index]=inb.buf[1][i];
				if(this._scroutbuf.numberOfChannels>=2)
					this._nodeout[0].NodeEmit(i,this._scroutbuf.buf[0][this._index],this._scroutbuf.buf[1][this._index]);
				else
					this._nodeout[0].NodeEmit(i,this._scroutbuf.buf[0][this._index],this._scroutbuf.buf[0][this._index]);
				this._index++;
			}
			this._nodein[0].NodeClear();
		};
		ctx._RegisterNode(this);
	};
	waapisimBiquadFilter=webkitBiquadFilterNode=BiquadFilterNode=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Filter";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.type=0;
		this.frequency=new waapisimAudioParam(ctx,this,10,24000,350);
		this.detune=new waapisimAudioParam(ctx,this,-1200,1200,0);
		this.Q=new waapisimAudioParam(ctx,this,0.0001,1000,1);
		this.gain=new waapisimAudioParam(ctx,this,-40,40,0);
		this._a1=this._a2=0;
		this._b0=this._b1=this._b2=0;
		this._x1l=this._x1r=this._x2l=this._x2r=0;
		this._y1l=this._y1r=this._y2l=this._y2r=0;
		this._nodein[0].NodeClear();
		this._Setup=function(fil) {
			var f=fil.frequency.Get(0)*Math.pow(2,fil.detune.Get(0)/1200);
			var q=Math.max(0.001,fil.Q.Get(0));
			var alpha,ra0,g;
			var w0=2*Math.PI*f/fil.context.sampleRate;
			var cos=Math.cos(w0);
			switch(fil.type) {
			case "lowpass":
			case 0:
				q=Math.pow(10,q/20);
				alpha=Math.sin(w0)/(2*q);
				ra0=1/(1+alpha);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha)*ra0;
				fil._b0=fil._b2=(1-cos)/2*ra0;
				fil._b1=(1-cos)*ra0;
				break;
			case "highpass":
			case 1:
				q=Math.pow(10,q/20);
				alpha=Math.sin(w0)/(2*q);
				ra0=1/(1+alpha);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha)*ra0;
				fil._b0=fil._b2=(1+cos)/2*ra0;
				fil._b1=-(1+cos)*ra0;
				break;
			case "bandpass":
			case 2:
				alpha=Math.sin(w0)/(2*q);
				ra0=1/(1+alpha);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha)*ra0;
				fil._b0=alpha;
				fil._b1=0;
				fil._b2=-alpha;
				break;
			case "lowshelf":
			case 3:
				alpha=Math.sin(w0)/2*Math.sqrt(2);
				g=Math.pow(10,fil.gain.Get(0)/40);
				ra0=1/((g+1)+(g-1)*cos+2*Math.sqrt(g)*alpha);
				fil._a1=-2*((g-1)+(g+1)*cos)*ra0;
				fil._a2=((g+1)+(g-1)*cos-2*Math.sqrt(g)*alpha)*ra0;
				fil._b0=g*((g+1)-(g-1)*cos+2*Math.sqrt(g)*alpha)*ra0;
				fil._b1=2*g*((g-1)-(g+1)*cos)*ra0;
				fil._b2=g*((g+1)-(g-1)*cos-2*Math.sqrt(g)*alpha)*ra0;
				break;
			case "highshelf":
			case 4:
				alpha=Math.sin(w0)/2*Math.sqrt(2);
				g=Math.pow(10,fil.gain.Get(0)/40);
				ra0=1/((g+1)-(g-1)*cos+2*Math.sqrt(g)*alpha);
				fil._a1=2*((g-1)-(g+1)*cos)*ra0;
				fil._a2=((g+1)-(g-1)*cos-2*Math.sqrt(g)*alpha)*ra0;
				fil._b0=g*((g+1)+(g-1)*cos+2*Math.sqrt(g)*alpha)*ra0;
				fil._b1=-2*g*((g-1)+(g+1)*cos)*ra0;
				fil._b2=g*((g+1)+(g-1)*cos-2*Math.sqrt(g)*alpha)*ra0;
				break;
			case "peaking":
			case 5:
				alpha=Math.sin(w0)/(2*q);
				g=Math.pow(10,fil.gain.Get(0)/40);
				ra0=1/(1+alpha/g);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha/g)*ra0;
				fil._b0=(1+alpha*g)*ra0;
				fil._b1=-2*cos*ra0;
				fil._b2=(1-alpha*g)*ra0;
				break;
			case "notch":
			case 6:
				alpha=Math.sin(w0)/(2*q);
				ra0=1/(1+alpha);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha)*ra0;
				fil._b0=fil._b2=ra0;
				fil._b1=-2*cos*ra0;
				break;
			case "allpass":
			case 7:
				alpha=Math.sin(w0)/(2*q);
				ra0=1/(1+alpha);
				fil._a1=-2*cos*ra0;
				fil._a2=(1-alpha)*ra0;
				fil._b0=(1-alpha)*ra0;
				fil._b1=-2*cos*ra0;
				fil._b2=(1+alpha)*ra0;
				break;
			}
		};
		this._Process=function() {
			var xl,xr,yl,yr;
			this.frequency._Process();
			this.detune._Process();
			this.Q._Process();
			this.gain._Process();
			this._Setup(this);
			var inbuf=this._nodein[0].inbuf.buf;
			var outbuf=this._nodeout[0].outbuf.buf;
			for(var i=0;i<waapisimBufSize;++i) {
				xl=inbuf[0][i];
				xr=inbuf[1][i];
				yl=this._b0*xl+this._b1*this._x1l+this._b2*this._x2l-this._a1*this._y1l-this._a2*this._y2l;
				yr=this._b0*xr+this._b1*this._x1r+this._b2*this._x2r-this._a1*this._y1r-this._a2*this._y2r;
				this._x2l=this._x1l; this._x2r=this._x1r;
				this._x1l=xl; this._x1r=xr;
				this._y2l=this._y1l; this._y2r=this._y1r;
				this._y1l=yl; this._y1r=yr;
				outbuf[0][i]=yl;
				outbuf[1][i]=yr;
			}
			this._nodeout[0].NodeEmitBuf();
			this._nodein[0].NodeClear();
			this.frequency.Clear(false);
			this.detune.Clear(false);
			this.Q.Clear(false);
			this.gain.Clear(false);
		};
	};
	waapisimBiquadFilter.LOWPASS=waapisimBiquadFilter.prototype.LOWPASS=0;
	waapisimBiquadFilter.HIGHPASS=waapisimBiquadFilter.prototype.HIGHPASS=1;
	waapisimBiquadFilter.BANDPASS=waapisimBiquadFilter.prototype.BANDPASS=2;
	waapisimBiquadFilter.LOWSHELF=waapisimBiquadFilter.prototype.LOWSHELF=3;
	waapisimBiquadFilter.HIGHSHELF=waapisimBiquadFilter.prototype.HIGHSHELF=4;
	waapisimBiquadFilter.PEAKING=waapisimBiquadFilter.prototype.PEAKING=5;
	waapisimBiquadFilter.NOTCH=waapisimBiquadFilter.prototype.NOTCH=6;
	waapisimBiquadFilter.ALLPASS=waapisimBiquadFilter.prototype.ALLPASS=7;

	waapisimGain=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Gain";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.gain=new waapisimAudioParam(ctx,this,0,1,1);
		this._nodein[0].NodeClear();
		this._Process=function() {
			var i;
			this.gain._Process();
			var inbuf=this._nodein[0].inbuf.buf;
			switch(this._nodeout[0].to.length) {
			case 0:
				break;
			case 1:
				var b=this._nodeout[0].to[0].inbuf.buf;
				for(i=0;i<waapisimBufSize;++i) {
					var g=this.gain.Get(i);
					b[0][i]+=inbuf[0][i]*g;
					b[1][i]+=inbuf[1][i]*g;
				}
				break;
			default:
				for(i=0;i<waapisimBufSize;++i)
					this._nodeout[0].NodeEmit(i,inbuf[0][i]*this.gain.Get(i),inbuf[1][i]*this.gain.Get(i));
				break;
			}
			this._nodein[0].NodeClear();
			this.gain.Clear(true);
		};
	};

	waapisimDelay=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Delay";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.delayTime=new waapisimAudioParam(ctx,this,0,1,0);
		this._bufl=new Float32Array(waapisimSampleRate);
		this._bufr=new Float32Array(waapisimSampleRate);
		for(var i=0;i<waapisimSampleRate;++i)
			this._bufl[i]=this._bufr[i]=0;
		this._index=0;
		this._offscur=0;
		this._Process=function() {
			this.delayTime._Process();
			var inbuf=this._nodein[0].inbuf.buf;
			var outbuf=this._nodeout[0].outbuf.buf;
			var offs=Math.floor(this.delayTime.Get(0)*this.context.sampleRate);
			if(offs<0)
				offs=0;
			if(offs>=this.context.sampleRate)
				offs=this.context.sampleRate-1;
			var deltaoff=(offs-this._offscur)/waapisimBufSize;
			for(var i=0;i<waapisimBufSize;++i) {
				var idxr=this._index-(this._offscur|0);
				if(idxr<0)
					idxr+=waapisimSampleRate;
				this._bufl[this._index]=inbuf[0][i];
				this._bufr[this._index]=inbuf[1][i];
				outbuf[0][i]=this._bufl[idxr];
				outbuf[1][i]=this._bufr[idxr];
				if(++this._index>=waapisimSampleRate)
					this._index=0;
				this._offscur+=deltaoff;
			}
			this._nodeout[0].NodeEmitBuf();
			this._nodein[0].NodeClear();
			this.delayTime.Clear(false);
		};
	};
	waapisimOscillator=webkitOscillatorNode=OscillatorNode=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,0,1);
		this._nodetype="Osc";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this._targettype=3;
		this._order=0;
		this.context=ctx;
		this.type=0;
		this._wavtable=null;
		this.frequency=new waapisimAudioParam(ctx,this,1,20000,440);
		this.detune=new waapisimAudioParam(ctx,this,-1200,1200,0);
		this.playbackState=0;
		this._phase=0;
		this._whenstart=0;
		this._whenstop=Number.MAX_VALUE;
		this.start=this.noteOn=function(w) {
			this._whenstart=w;
			this.playbackState=1;
			this.context._RegisterNode(this);
		};
		this.stop=this.noteOff=function(w) {
			this._whenstop=w;
		};
		this.setWaveTable=function(tab) {
			this.type=4;
			this._wavtable=tab;
		};
		this._Process=function() {
			var i;
			this.frequency._Process();
			this.detune._Process();
			if(this.playbackState==1 && this.context.currentTime>=this._whenstart)
				this.playbackState=2;
			if(this.playbackState==2 && this.context.currentTime>=this._whenstop)
				this.playbackState=3;
			if(this.playbackState!=2) {
				for(i=0;i<waapisimBufSize;++i)
					this._nodeout[0].outbuf.buf[0][i]=this._nodeout[0].outbuf.buf[1][i]=0;
				return;
			}
			var t,x1,x2,y,z;
			var obuf=this._nodeout[0].outbuf.buf;
			var ph=this._phase;
			var r=1/this.context.sampleRate;
			var freq=this.frequency;
			var detu=this.detune;
			switch(this.type) {
			case "sine":
			case 0:
				x1=0.25; x2=1; y=2*Math.PI; z=1/6.78;
				break;
			case "square":
			case 1:
				x1=0.25; x2=1; y=100000; z=0;
				break;
			case "sawtooth":
			case 2:
				x1=0.5; x2=2; y=2; z=0;
				break;
			case "triangle":
			case 3:
				x1=0.25; x2=1; y=4; z=0;
				break;
			case "custom":
			case 4:
				for(i=0;i<waapisimBufSize;++i) {
					var f=freq.Get(i)*Math.pow(2,detu.Get(i)/1200);
					ph+=f*r;
					ph=ph-Math.floor(ph);
					var out=0;
					if(this._wavtable)
						out=this._wavtable.buf[(4096*ph)|0];
					obuf[0][i]=obuf[1][i]=out;
				}
				this._phase=ph;
				this._nodeout[0].NodeEmitBuf();
				this.frequency.Clear(true);
				this.detune.Clear(true);
				return;
			}
			for(i=0;i<waapisimBufSize;++i) {
				var f=freq.Get(i)*Math.pow(2,detu.Get(i)/1200);
				ph+=f*r;
				ph=ph-Math.floor(ph);
				if(x2-ph<ph)
					t=(x2-ph-x1)*y;
				else
					t=(ph-x1)*y;
				var out=t-t*t*t*z;
				if(out>1) out=1;
				if(out<-1) out=-1;
				obuf[0][i]=obuf[1][i]=out;
			}
			this._phase=ph;
			this._nodeout[0].NodeEmitBuf();
			this.frequency.Clear(true);
			this.detune.Clear(true);
		};
	};
	waapisimOscillator.SINE=waapisimOscillator.prototype.SINE=0;
	waapisimOscillator.SQUARE=waapisimOscillator.prototype.SQUARE=1;
	waapisimOscillator.SAWTOOTH=waapisimOscillator.prototype.SAWTOOTH=2;
	waapisimOscillator.TRIANGLE=waapisimOscillator.prototype.TRIANGLE=3;
	waapisimOscillator.CUSTOM=waapisimOscillator.prototype.CUSTOM=4;
	waapisimOscillator.UNSCHEDULED_STATE=waapisimOscillator.prototype.UNSCHEDULED_STATE=0;
	waapisimOscillator.SCHEDULED_STATE=waapisimOscillator.prototype.SCHEDULED_STATE=1;
	waapisimOscillator.PLAYING_STATE=waapisimOscillator.prototype.PLAYING_STATE=2;
	waapisimOscillator.FINISHED_STATE=waapisimOscillator.prototype.FINISHED_STATE=3;
	
	waapisimAnalyser=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Analyser";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.fftSize=2048;
		this.frequencyBinCount=1024;
		this.minDecibels=-100;
		this.maxDecibels=-30;
		this.smoothingTimeConstant=0;
		this._fftInData=new Array(2048);
		this._fftOutData=new Array(2048);
		this._timeData=new Array(2048);
		this._fftIndex=0;
		this._fftCurrentSize=0;
		this._fftrev=new Array(256);
		this._fft=function(n,data,mag) {
			var nh=n>>1;
			var t=-2*Math.PI;
			var m,mh,mq,i,j,jr,ji,kr,ki,xr,xi;
			for(mh=1;(m=mh<<1)<=n;mh=m) {
				mq=mh>>1;
				t*=0.5;
				for(jr=0;jr<n;jr+=m) {
					kr=jr+mh;
					xr=data[kr];
					data[kr]=data[jr]-xr;
					data[jr]+=xr;
				}
				for(i=1;i<mq;++i) {
					var wr=Math.cos(t*i);
					var wi=Math.sin(t*i);
					for(j=0;j<n;j+=m) {
						jr=j+i;
						ji=j+mh-i;
						kr=j+mh+i;
						ki=j+m-i;
						xr=wr*data[kr]+wi*data[ki];
						xi=wr*data[ki]-wi*data[kr];
						data[kr]=-data[ji]+xi;
						data[ki]=data[ji]+xi;
						data[ji]=data[jr]-xr;
						data[jr]=data[jr]+xr;
					}
				}
			}
			data[0]=Math.min(1e-100,Math.abs(data[0]/n));
			var stc=Math.min(1,Math.max(0,this.smoothingTimeConstant));
			mag[0]=mag[0]*stc+(1-stc)*data[0];
			for(i=0;i<nh;++i) {
				var v=Math.sqrt(data[i]*data[i]+data[n-i]*data[n-i])/n;
				if(v<1e-100)
					v=1e-100;
				mag[i]=mag[i]*stc+(1-stc)*v;
			}
		};
		this.getByteFrequencyData=function(array) {
			var range=this.maxDecibels-this.minDecibels;
			for(var l=Math.min(array.length,this.frequencyBinCount),i=0;i<l;++i) {
				var v=20*Math.LOG10E*Math.log(this._fftOutData[i]);
				array[i]=((Math.min(this.maxDecibels,Math.max(this.minDecibels,v))-this.minDecibels)*255/range)|0;
			}
		};
		this.getFloatFrequencyData=function(array) {
			for(var l=Math.min(array.length,this.frequencyBinCount),i=0;i<l;++i)
				array[i]=20*Math.LOG10E*Math.log(this._fftOutData[i]);
		};
		this.getByteTimeDomainData=function(array) {
			for(var l=Math.min(this.frequencyBinCount,array.length),i=0;i<l;++i) {
				var v=Math.min(1,Math.max(-1,this._timeData[i]));
				array[i]=v*127+128;
			}
		};
		this._Process=function() {
			var i,j,k;
			var inbuf=this._nodein[0].inbuf.buf;
			if(this.fftSize!=this._fftCurrentSize) {
				var n=this.fftSize;
				for(i=0;i<n;++i)
					this._fftInData[i]=this._fftOutData[i]=0;
				this._fftCurrentSize=n;
				this.frequencyBinCount=n*0.5;
				this._fftIndex=0;
				this._fftrev[0]=0;
				this._fftrev[n-1]=n-1;
				for(i=0,j=1;j<n-1;++j) {
					for(k=n>>1;k>(i^=k);k>>=1)
						;
					this._fftrev[j]=i;
				}
			}
			for(i=0;i<waapisimBufSize;++i) {
				var xl=inbuf[0][i];
				var xr=inbuf[1][i];
				this._nodeout[0].NodeEmit(i,xl,xr);
				var v=this._timeData[this._fftIndex]=(xl+xr)*0.5;
				var t=2*Math.PI*this._fftIndex/this._fftCurrentSize;
//				this._fftInData[this._fftrev[this._fftIndex]]=v*(0.42-0.5*Math.cos(t)+0.08*Math.cos(t*2));
				this._fftInData[this._fftrev[this._fftIndex]]=v*(0.5-0.5*Math.cos(t));
				if(++this._fftIndex>=this._fftCurrentSize) {
					this._fftIndex=0;
					this._fft(this._fftCurrentSize,this._fftInData,this._fftOutData);
				}
			}
			this._nodein[0].NodeClear();
		};
	};
	waapisimConvolver=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Convolver";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.buffer=null;
		this.normalize=true;
		this._scale=1;
		this._analyzed=null;
		this._dlybufsize=waapisimSampleRate*5;
		this._dlybuf=new waapisimAudioBuffer(2,this._dlybufsize,44100);
		this._dlyidx=0;
		this._tapsize=20;
		this._tap=[];
		this._kernel=null;
		this._sum=[];
		this._sum[0]=[];
		this._sum[1]=[];
		this._bitrev=[];
		this._bitrev[0]=0;
		this._bitrev[waapisimBufSize-1]=waapisimBufSize-1;
		var i,j,k;
		for(i=0,j=1;j<waapisimBufSize-1;++j) {
			for(k=waapisimBufSize>>1;k>(i^=k);k>>=1)
				;
			this._bitrev[j]=i;
		}
		for(i=0;i<2;++i)
			for(j=0;j<2;++j)
				this._sum[i][j]=new Float32Array(waapisimSampleRate);
		this._Normalize=function(buffer) {
			var GainCalibration=0.00125;
			var GainCalibrationSampleRate=44100;
			var MinPower=0.000125;
			var numberOfChannels=2;
			var length=buffer.length;
			var power=0;
			for(var i=0;i<numberOfChannels;++i) {
				var sourceP=0;
				var channelPower=0;
				var n=length;
				while(n--) {
					var sample=buffer.buf[i][sourceP++];
					channelPower+=sample*sample;
				}
				power+=channelPower;
			}
			power=Math.sqrt(power/(numberOfChannels*length));
			if(isFinite(power)===false||isNaN(power)||power<MinPower)
				power=MinPower;
			var scale=1/power;
			scale*=GainCalibration;
			return scale;
		};
		this._Fft=function(n,a) {
			var m,mh,mq,i,j,k,jr,ji,kr,ki;
			var theta, wr, wi, xr, xi;
			i=0;
			for(j=1;j<n-1;j++) {
				for(k=n>>1;k>(i^=k);k>>=1)
					;
				if(j<i) {
					xr=a[j];
					a[j]=a[i];
					a[i]=xr;
				}
			}
			theta=-2*Math.PI;
			for(mh=1;(m=mh<<1)<=n;mh=m) {
				mq=mh>>1;
				theta*=0.5;
				for(jr=0;jr<n;jr+=m) {
					kr=jr+mh;
					xr=a[kr];
					a[kr]=a[jr]-xr;
					a[jr]+=xr;
				}
				for(i=1;i<mq;i++) {
					wr=Math.cos(theta*i);
					wi=Math.sin(theta*i);
					for(j=0;j<n;j+=m) {
						jr=j+i;
						ji=j+mh-i;
						kr=j+mh+i;
						ki=j+m-i;
						xr=wr*a[kr]+wi*a[ki];
						xi=wr*a[ki]-wi*a[kr];
						a[kr]=-a[ji]+xi;
						a[ki]=a[ji]+xi;
						a[ji]=a[jr]-xr;
						a[jr]=a[jr]+xr;
					}
				}
			}
		};
		this._Fft2=function(n,ar,ai) {
			var m, mh, i, j, k;
			var wr, wi, xr, xi;
			var theta=2*Math.PI;
			i=0;
			for(j=1;j<n-1;j++) {
				for(k=n>>1;k>(i^=k);k>>=1)
					;
				if(j<i) {
					xr=ar[j];
					xi=ai[j];
					ar[j]=ar[i];
					ai[j]=ai[i];
					ar[i]=xr;
					ai[i]=xi;
				}
			}
			for(mh=1;(m=mh<<1)<=n;mh=m) {
				theta *= 0.5;
				for(i=0;i<mh;i++) {
					wr=Math.cos(theta*i);
					wi=Math.sin(theta*i);
					for(j=i;j<n;j+=m) {
						k=j+mh;
						xr=wr*ar[k]-wi*ai[k];
						xi=wr*ai[k]+wi*ar[k];
						ar[k]=ar[j]-xr;
						ai[k]=ai[j]-xi;
						ar[j]+=xr;
						ai[j]+=xi;
					}
				}
			}
			for(i=0;i<n;++i)
				ar[i]=ar[i]/n;
		};
		this._Process=function() {
			var inbuf=this._nodein[0].inbuf.buf;
			var nh=(waapisimBufSize*0.5)|0;
			var i,j,k,l,px,v0,v1;
			if(this.buffer!==null) {
				var kbuf=[];
				for(i=0;i<4;++i)
					kbuf[i]=new waapisimAudioBuffer(2,waapisimBufSize,44100);
				if(this.buffer!=this._analyzed) {
					this._scale=1;
					if(this.normalize)
						this._scale=this._Normalize(this.buffer);
					var len=this.buffer.length;
					for(i=0,px=0;i<this._tapsize;++i) {
						var x=(i*len/this._tapsize)|0;
						var sz=x-px;
						v0=0;
						v1=0;
						if(sz>0) {
							while(px<x) {
								v0+=this.buffer.buf[0][px]*this.buffer.buf[0][px];
								v1+=this.buffer.buf[1][px]*this.buffer.buf[1][px];
								++px;
							}
							v0=Math.sqrt(v0)*this._scale*0.5;
							v1=Math.sqrt(v1)*this._scale*0.5;
						}
						this._tap[i]=[x,v0,v1];
					}
					this._kernel=new waapisimAudioBuffer(2,waapisimBufSize,44100);
					var p=0,maxp=0;
					for(l=Math.min(this.buffer.length,waapisimBufSize*4),i=0,j=0,k=0;i<l;++i) {
						v0=this.buffer.buf[0][i];
						v1=this.buffer.buf[1][i];
						kbuf[k].buf[0][j]=v0;
						kbuf[k].buf[1][j]=v1;
						p+=(v0*v0+v1*v1);
						if(++j>=waapisimBufSize) {
							if(p>maxp) {
								this._kernel=kbuf[k];
								maxp=p;
							}
							j=0;
							p=0;
							++k;
						}
					}
					if(p>maxp||this._kernel===null)
						this._kernel=kbuf[k];
					this._Fft(waapisimBufSize,this._kernel.buf[0]);
					this._Fft(waapisimBufSize,this._kernel.buf[1]);
					this._analyzed=this.buffer;
				}
				
				this._Fft(waapisimBufSize,inbuf[0]);
				this._Fft(waapisimBufSize,inbuf[1]);
				this._sum[0][0][0]=this._sum[1][0][0]=this._sum[0][1][0]=this._sum[1][1][0]=0;
				for(i=1,j=waapisimBufSize-1;i<nh;++i,--j) {
					var real0=inbuf[0][i]*this._kernel.buf[0][i]-inbuf[0][j]*this._kernel.buf[0][j];
					var imag0=inbuf[0][i]*this._kernel.buf[0][j]+inbuf[0][j]*this._kernel.buf[0][i];
					this._sum[0][0][i]=real0;
					this._sum[0][0][j]=real0;
					this._sum[0][1][i]=-imag0;
					this._sum[0][1][j]=imag0;
					var real1=inbuf[1][i]*this._kernel.buf[1][i]-inbuf[1][j]*this._kernel.buf[1][j];
					var imag1=inbuf[1][i]*this._kernel.buf[1][j]+inbuf[1][j]*this._kernel.buf[1][i];
					this._sum[1][0][i]=real1;
					this._sum[1][0][j]=real1;
					this._sum[1][1][i]=-imag1;
					this._sum[1][1][j]=imag1;
				}

				this._Fft2(waapisimBufSize,this._sum[0][0],this._sum[0][1]);
				this._Fft2(waapisimBufSize,this._sum[1][0],this._sum[1][1]);

				for(i=0;i<waapisimBufSize;++i) {
					var v=(nh-Math.abs(i-nh))/nh;
					this._dlybuf.buf[0][this._dlyidx]=this._sum[0][0][i]*v;
					this._dlybuf.buf[1][this._dlyidx]=this._sum[1][0][i]*v;
					v0=0; v1=0;
					for(l=this._tap.length,j=0;j<l;++j) {
						var idx=this._dlyidx-this._tap[j][0];
						if(idx<0)
							idx+=this._dlybufsize;
						v0+=this._dlybuf.buf[0][idx]*this._tap[j][1];
						v1+=this._dlybuf.buf[1][idx]*this._tap[j][2];
					}
					this._nodeout[0].NodeEmit(i,v0,v1);
					if(++this._dlyidx>=this._dlybufsize)
						this._dlyidx=0;
				}

			}
			this._nodein[0].NodeClear();
		};
	};
	waapisimDynamicsCompressor=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="DynComp";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.threshold=new waapisimAudioParam(ctx,this,-100,0,-24);
		this.knee=new waapisimAudioParam(ctx,this,0,40,30);
		this.ratio=new waapisimAudioParam(ctx,this,1,20,12);
		this.reduction=new waapisimAudioParam(ctx,this,-20,0,0);//ReadOnly
		this.attack=new waapisimAudioParam(ctx,this,0,1,0.003);
		this.release=new waapisimAudioParam(ctx,this,0,1,0.25);
		this._maxl=0;
		this._maxr=0;
		this._gain=1;
		this._Process=function() {
			this.threshold._Process();
			this.knee._Process();
			this.ratio._Process();
			this.attack._Process();
			this.release._Process();
			var inbuf=this._nodein[0].inbuf.buf;
			var relratio=this.release.Get(0)*waapisimSampleRate;
			relratio=Math.pow(1/3.16,1/relratio);
			var atkratio=this.attack.Get(0)*waapisimSampleRate;
			atkratio=Math.pow(1/3.16,1/atkratio);
			var reduc=this.reduction.value;
			var thresh=Math.pow(10,this.threshold.Get(0)/20);
			var knee=Math.pow(10,this.knee.Get(0)/20*0.5);
			var makeup=1/Math.sqrt(thresh)/Math.pow(10,this.knee.Get(0)/80);
			var maxratio=0.99105;
			var ratio=this.ratio.Get(0);
			if(ratio<=1)
				ratio=1;
			for(var i=0;i<waapisimBufSize;++i) {
				this._maxl=maxratio*this._maxl+(1-maxratio)*inbuf[0][i]*inbuf[0][i];
				this._maxr=maxratio*this._maxr+(1-maxratio)*inbuf[1][i]*inbuf[1][i];
				var maxc=Math.sqrt(Math.max(this._maxl,this._maxr))*1.414;
				if(maxc>thresh) {
					var v=Math.pow(thresh*Math.min(knee,maxc/thresh)/maxc,1-1/ratio);
					this._gain=v+(this._gain-v)*atkratio;
				}
				var g=this._gain*makeup;
				this._nodeout[0].NodeEmit(i,inbuf[0][i]*g,inbuf[1][i]*g);
				this._gain=1+(this._gain-1)*relratio;
			}
			this.reduction.value=this.reduction.computedValue=reduc;
			this._nodein[0].NodeClear();
			this.threshold.Clear(false);
			this.knee.Clear(false);
			this.ratio.Clear(false);
			this.reduction.Clear(false);
			this.attack.Clear(false);
			this.release.Clear(false);
		};
	};
	waapisimPanner=webkitAudioPannerNode=AudioPannerNode=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Panner";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.panningModel=0;
		this.distanceModel=1;
		this.refDistance=1;
		this.maxDistance=10000;
		this.rolloffFactor=1;
		this.coneInnerAngle=360;
		this.coneOuterAngle=360;
		this.coneOuterGain=0;
		this.px=0;
		this.py=0;
		this.pz=0;
		this.setPosition=function(x,y,z) {this.px=x;this.py=y;this.pz=z;};
		this.setOrientation=function(x,y,z) {};
		this.setVelocity=function(x,y,z) {};
		this._Process=function() {
			var inbuf=this._nodein[0].inbuf.buf;
			var listener=this.context.listener;
			var dx=this.px-listener.px;
			var dy=this.py-listener.py;
			var dz=this.pz-listener.pz;
			var d=Math.max(1,Math.sqrt(dx*dx+dy*dy+dz*dz));
			var rgain=dx-dz;
			var lgain=-dx-dz;
			var rl=Math.sqrt(rgain*rgain+lgain*lgain);
			var dgain;
			switch(this.distanceModel) {
			case "linear":
			case 0:
				dgain=1-this.rolloffFactor*(d-this.refDistance)/(this.maxDistance-this.refDistance);
				break;
			case "inverse":
			case 1:
				dgain=this.refDistance/(this.refDistance+this.rolloffFactor*(d-this.refDistance));
				break;
			case "exponential":
			case 2:
				dgain=Math.pow(d/this.refDistance,-this.rolloffFactor);
				break;
			}
			if(rl===0)
				rgain=lgain=Math.sqrt(2)*dgain;
			else {
				rgain=rgain/rl;
				lgain=lgain/rl;
				var a=Math.sqrt(rgain*rgain+lgain*lgain);
				rgain=rgain/a*2*dgain; lgain=lgain/a*2*dgain;
			}
			for(var i=0;i<waapisimBufSize;++i)
				this._nodeout[0].NodeEmit(i,inbuf[0][i]*lgain,inbuf[1][i]*rgain);
			this._nodein[0].NodeClear();
		};
	};
	waapisimPanner.EQUALPOWER=waapisimPanner.prototype.EQUALPOWER=0;
	waapisimPanner.HRTF=waapisimPanner.prototype.HRTF=1;
	waapisimPanner.SOUNDFIELD=waapisimPanner.prototype.SOUNDFIELD=2;
	waapisimPanner.LINEAR_DISTANCE=waapisimPanner.prototype.LINEAR_DISTANCE=0;
	waapisimPanner.INVERSE_DISTANCE=waapisimPanner.prototype.INVERSE_DISTANCE=1;
	waapisimPanner.EXPONENTIAL_DISTANCE=waapisimPanner.prototype.EXPONENTIAL_DISTANCE=2;
	
	waapisimChannelSplitter=function(ctx,ch) {
		this._nodetype="ChSplit";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		if(typeof(ch)==="undefined")
			ch=6;
		waapisimAudioNode.call(this,waapisimBufSize,1,ch);
		this.context=ctx;
		this.playbackState=0;
		this._Process=function() {
			var inbuf=this._nodein[0].inbuf.buf;
			for(var i=0;i<waapisimBufSize;++i) {
				this._nodeout[0].NodeEmit(i,inbuf[0][i],inbuf[0][i]);
				this._nodeout[1].NodeEmit(i,inbuf[1][i],inbuf[1][i]);
			}
			this._nodein[0].NodeClear();
		};
	};
	waapisimChannelMerger=function(ctx,ch) {
		this._nodetype="ChMerge";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		if(typeof(ch)==="undefined")
			ch=6;
		waapisimAudioNode.call(this,waapisimBufSize,ch,1);
		this.context=ctx;
		this.playbackState=0;
		this._Process=function() {
			var inbuf0=this._nodein[0].inbuf.buf;
			var inbuf1=this._nodein[1].inbuf.buf;
			for(var i=0;i<waapisimBufSize;++i)
				this._nodeout[0].NodeEmit(i,(inbuf0[0][i]+inbuf0[1][i])*0.5,(inbuf1[0][i]+inbuf1[1][i])*0.5);
			this._nodein[0].NodeClear();
			this._nodein[1].NodeClear();
		};
	};
	waapisimWaveShaper=function(ctx) {
		waapisimAudioNode.call(this,waapisimBufSize,1,1);
		this._nodetype="Shaper";
		waapisimDebug("create "+this._nodetype+this._nodeId);
		this.context=ctx;
		this.playbackState=0;
		this.curve=null;
		var i;
		this._Process=function() {
			var inbuf=this._nodein[0].inbuf.buf;
			var curve=this.curve;
			if(curve!==null) {
				var len=curve.length-1;
				if(len>=0) {
					for(i=0;i<waapisimBufSize;++i) {
						var xl=Math.max(-1,Math.min(1,inbuf[0][i]));
						var xr=Math.max(-1,Math.min(1,inbuf[1][i]));
						xl=curve[((xl+1)*0.5*len+0.5)|0];
						xr=curve[((xr+1)*0.5*len+0.5)|0];
						this._nodeout[0].NodeEmit(i,xl,xr);
					}
					this._nodein[0].NodeClear();
					return;
				}
			}
			for(i=0;i<waapisimBufSize;++i)
				this._nodeout[0].NodeEmit(i,inbuf[0][i],inbuf[1][i]);
			this._nodein[0].NodeClear();
		};
	};
	waapisimAudioParam=function(ctx,node,min,max,def) {
		this.context=ctx;
		this._targettype=0;
		this.node=node;
		this.value=def;
		this.computedValue=def;
		this.minValue=min;
		this.maxValue=max;
		this.defaultValue=def;
		this.from=[];
		this.inbuf={};
		this.inbuf.buf=[];
		this.inbuf.buf[0]=new Float32Array(waapisimBufSize);
		this.inbuf.buf[1]=new Float32Array(waapisimBufSize);
		this.automation=[];
		this.deltaAdd=0;
		this.deltaMul=1;
		this.deltaTarget=0;
		this.currentEvent=null;
		for(var i=0;i<waapisimBufSize;++i)
			this.inbuf.buf[0][i]=this.inbuf.buf[1][i]=0;
		this.AddEvent=function(ev) {
			var t=ev[0];
			for(var l=this.automation.length,i=0;i<l;++i) {
				if(this.automation[i][0]>t)
					break;
			}
			this.automation.splice(i,0,ev);
		};
		this.setValueAtTime=function(v,t) {
			this.AddEvent([t,0,v]);
		};
		this.linearRampToValueAtTime=function(v,t) {
			this.AddEvent([t,1,v]);
		};
		this.exponentialRampToValueAtTime=function(v,t) {
			this.AddEvent([t,2,v]);
		};
		this.setTargetAtTime=this.setTargetValueAtTime=function(v,t,c) {
			this.AddEvent([t,3,v,c]);
		};
		this.setValueCurveAtTime=function(values,t,d) {
			this.AddEvent([t,4,values,d]);
		};
		this.cancelScheduledValues=function(t) {
			for(var l=this.automation.length,i=0;i<l;++i) {
				if(this.automation[i][0]>=t) {
					this.automation.length=i;
					return;
				}
			}
		};
		this._Process=function() {
			this.value+=this.deltaAdd;
			this.value=(this.value-this.deltaTarget)*this.deltaMul+this.deltaTarget;
			if(this.currentEvent!==null) {
				if(this.currentEvent[1]==4) {
					var i=(this.currentEvent[2].length-1)*(this.context.currentTime-this.currentEvent[0])/this.currentEvent[3];
					this.value=this.currentEvent[2][Math.min(this.currentEvent[2].length-1,i)|0];
				}
			}
			if(this.automation.length>0) {
				if(this.context.currentTime>=this.automation[0][0]) {
					this.deltaAdd=0;
					this.deltaMul=1;
					this.deltaTarget=0;
					this.currentEvent=this.automation.shift();
					switch(this.currentEvent[1]) {
					case 0:
					case 1:
					case 2:
						this.value=this.currentEvent[2];
						break;
					case 3:
						this.deltaMul=Math.pow(0.367879,1/(waapisimSampleRate/waapisimBufSize*this.currentEvent[3]));
						this.deltaTarget=this.currentEvent[2];
						break;
					}
					if(this.automation.length>0) {
						var n=waapisimSampleRate/waapisimBufSize*(this.automation[0][0]-this.context.currentTime);
						switch(this.automation[0][1]) {
						case 1:
							this.deltaAdd=(this.automation[0][2]-this.value)/n;
							break;
						case 2:
							this.deltaMul=Math.pow(this.automation[0][2]/this.value,1/n);
							break;
						}
					}
				}
			}
		};
		this.Get=function(n) {
			this.computedValue=this.value+(this.inbuf.buf[0][n]+this.inbuf.buf[1][n])*0.5;
			return this.computedValue;
		};
		this.Clear=function(arate) {
			if(arate) {
				for(var i=0;i<waapisimBufSize;++i)
					this.inbuf.buf[0][i]=this.inbuf.buf[1][i]=0;
			}
			else
				this.inbuf.buf[0][0]=this.inbuf.buf[1][0]=0;
		};
	};
}
var SoundVisualizer = Class.extend({
	init: function(el, width, height){
		this.canvas = $('<canvas width="' + width + '" height="' + height + '">');
		this.w = width;
		this.h = height;
		el.append(this.canvas);
		this.ctx = this.canvas[0].getContext("2d");
	},
	visualizeFrequencyData: function(data) {
		this.ctx.fillStyle = "rgba(255,255,255,0.2)";
		this.ctx.fillRect(0,0,this.w,this.h);
		this.ctx.fillStyle = "rgba(200,0,0,0.5)";
		
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
		this.ctx.fillStyle = "rgba(255,255,255,0.2)";
		this.ctx.fillRect(0,0,this.w,this.h);
		this.ctx.strokeStyle = "rgba(200,0,0,0.5)";
		
		var h = Math.floor(data.length / this.w);
		var v = 0;
		var s = 0;
		this.ctx.beginPath();
		this.ctx.moveTo(0,(data[0]/255)*this.h);
		for(var i = 1; i < this.w; i++) {
			v = data[i*h];
			s = (v/255)*this.h;
			this.ctx.lineTo(i, s);
		}
		this.ctx.stroke();
	},
	clear: function() {
		this.ctx.fillStyle = "rgba(255,255,255,1)";
		this.ctx.fillRect(0,0,this.w,this.h);
	}
});var BaseNode = Class.extend({
	init: function(index, config){
		this.idx = index;
    	this.myConnections = new Array();
		this.c = config;
  	},
  	createMainEl: function(createDrag, createDrop, createclose, elHeight, elWidth) {
  		var thisNode = this;
  		var el = this.el = $('<div>');
  		
		el.addClass('node');
		if(elHeight != undefined) {
			el.css('height', elHeight)
		} 
		if(elWidth != undefined) {
			el.css('width', elWidth)
		} 

		$('body').append(el);
		
		el.draggable({
			stack: 'div.node',
			containment: 'parent',
			drag: function() {
				thisNode.updateConnectionLines();
			},
		});

		el.css('position', 'absolute');

		
		//create loader
		var loaderImg = $('<img>').attr('src', 'img/ajax-loader.gif').addClass('loaderImg');;
		this.loader = $('<div>').addClass('loaderOverlay');
		this.loader.append(loaderImg);
		el.append(this.loader);
		this.loader.hide();
		
		//create header
		var header = $('<div>');
		header.addClass('nodeheader');
		header.append($('<i class="' + this.icon + '">'));
		header.append($('<a href="#" rel="tooltip" title="' + this.tooltip + '">').html('&nbsp;' + this.name).tooltip());
		el.append(header);
		if(createclose) {
			var closeBtn = $('<div>');
			closeBtn.addClass('close');
			closeBtn.html('x');
			closeBtn.on('click', function() {
				$('.line').each(function() {
					var line = $(this);
					var lineFromIdx = line.attr('data-fromIdx');
					var lineToIdx = line.attr('data-toIdx');
					if(lineFromIdx == thisNode.idx || lineToIdx == thisNode.idx) {
						line.fadeOut(700, function() {
							line.remove();
						});
					}
				});
				el.fadeOut(700, function() {
					for(var i in thisNode.myConnections) {
						thisNode.disconnectFrom(thisNode.myConnections[i]);
					}
					thisNode.shutdown();
					var nH = thisNode.el.height()+2;
					thisNode.el.remove();
					thisNode.deleted = true;
					//move following nodes down the same amount as removed element was high since position is relative
					for(var i = thisNode.idx + 1; i < nodes.length; i++) {
						nodes[i].el.offset({top: nodes[i].el.offset().top + nH});
					}
				});
			});
		}
		header.append(closeBtn);
		
		var tempConnectionLine = null;
		if(createDrag) {
			var dragEl = $('<div>');
			dragEl.draggable({
				revert: true,
				snap: '.nodedrop',
				start: function() {
					tempConnectionLine = thisNode.createConnectionLine(thisNode.el, dragEl, null, null, true)
				},
				drag: function() {
					var linePosData = thisNode.getLinePosData(thisNode.el, dragEl, true);
					thisNode.updateConnectionLine(tempConnectionLine, linePosData);
				},
				stop: function() {
					tempConnectionLine.parent().remove();
				}
			});
			dragEl.droppable({
				accept: ".nodedrop",
				drop: function( event, ui ) {
					var dEl = $(ui.draggable[0]);
					var dragFromIndex = dEl.attr('data-nodeIndex');
					var fromN = nodes[thisNode.idx];
					var toN = nodes[dragFromIndex];

					$('.templine').remove();
					if(fromN.connectTo(toN)) {
						toN.createConnectionLine(fromN.el,toN.el,fromN.idx,toN.idx, false);
						toN.updateConnectionLines();
					}
				}
			});
			dragEl.addClass('nodedrag');
			dragEl.addClass('nodehandle');
			dragEl.attr('data-nodeIndex', this.idx);
			dragEl.css({
				position: 'absolute',
				top: el.height()/2-12 + 'px',	
				left: el.width()+8 + 'px'
			});

			el.append(dragEl);
			

		}

		if(createDrop) {
			
			var dropEl = $('<div>');
			dropEl.addClass('nodedrop');
			dropEl.addClass('nodehandle');
			dropEl.attr('data-nodeIndex', this.idx);
			dropEl.draggable({
				revert: true,
				snap: '.nodedrag',
				start: function() {
					tempConnectionLine = thisNode.createConnectionLine(thisNode.el, dropEl, null, null, true)
				},
				drag: function() {
					var linePosData = thisNode.getLinePosData(thisNode.el, dropEl, true, true);
					thisNode.updateConnectionLine(tempConnectionLine, linePosData, true);
				},
				stop: function() {
					tempConnectionLine.parent().remove();
				}
			});
			dropEl.droppable({
				accept: ".nodedrag",
				drop: function( event, ui ) {
					var dEl = $(ui.draggable[0]);
					var dragFromIndex = dEl.attr('data-nodeIndex');
					var fromN = nodes[dragFromIndex];
					var toN = nodes[thisNode.idx];

					$('.templine').remove();
					if(fromN.connectTo(toN)) {
						toN.createConnectionLine(fromN.el,toN.el,fromN.idx,toN.idx, false);
						toN.updateConnectionLines();
					}
				}
			});
			dropEl.css({
				position: 'absolute',
				top: el.height()/2-12 + 'px',	
				left: -28 + 'px'
			});

			el.append(dropEl);

		}

		var body = $('<div>');
		body.addClass('nodebody');
		el.append(body);
		
		el.offset({top: 200, left: 200});
		el.hide();
		el.fadeIn(700);
		return body;
  	},
  	connectTo: function(node) {
  		if(this.myConnections.indexOf(node) != -1) {
  			return false;
  		}

		var conns = node.getConnections();
		for(var i in conns) {
			this.thingy.connect(conns[i]);
		}
		this.myConnections.push(node);
		return true;
	},
  	disconnectFrom: function(node) {
		var conns = node.getConnections();
		for(var i in conns) {
			this.thingy.disconnect(conns[i]);
		}
		var idx = this.myConnections.indexOf(node);
		if(idx!=-1) this.myConnections.splice(idx, 1);
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = this.thingy;
		return arr;
	},
	createConnectionLine: function(fromEl, toEl, fromIdx, toIdx, temp) {
		var linePosData = this.getLinePosData(fromEl, toEl, temp);

		var lineCont = $('<div>')
			.appendTo('body')
			.addClass('linecont')
	        .css({
	          'position': 'absolute',
	          'webkit-transform': linePosData.transform,
	          '-moz-transform': linePosData.transform,
	          'transform': linePosData.transform
	        })
	        .width(linePosData.length);
		lineCont.offset({left: linePosData.left, top: linePosData.top-connLineWidth/2});
		
	    var line = $('<div>')
	        .addClass('line')
	        .attr({
	        	'data-fromIdx': fromIdx,
	        	'data-toIdx': toIdx
	        })
	        .width(linePosData.length);
	    if(temp) {
	    	lineCont.addClass('templine');
	    } else {
	    	lineCont.on('click', function() {
	    		var fromN = nodes[line.attr('data-fromIdx')];
				var toN = nodes[line.attr('data-toIdx')];
				lineCont.fadeOut(700, function() {
					fromN.disconnectFrom(toN);
					$(this).remove();
				});
				
	    	})
	    }
	    
	    lineCont.append(line);

	    return line;
	},
	updateConnectionLines: function() {
		var thisNode = this;
		$('.line').each(function() {
			var line = $(this);
			var fromEl = nodes[line.attr('data-fromIdx')].el;
			var toEl = nodes[line.attr('data-toIdx')].el;
			var linePosData = thisNode.getLinePosData(fromEl, toEl, false);

			thisNode.updateConnectionLine(line, linePosData);
		});
	},
	updateConnectionLine: function(line, linePosData) {
		line.parent().css({
          'webkit-transform': linePosData.transform,
          '-moz-transform': linePosData.transform,
          'transform': linePosData.transform
        })
        .width(linePosData.length)
        .offset({left: linePosData.left, top: linePosData.top-connLineWidth/2});
		
		line.width(linePosData.length);
	},
	getLinePosData: function(fromEl, toEl, temp, reverse) {
		var fromElPos = fromEl.offset();
		var toElPos = toEl.offset();

		var fromElWidth = fromEl.width();
		var fromElHeight = fromEl.height();
		var toElHeight = toEl.height();

		var x1 = fromElPos.left+(reverse?2:fromElWidth);
		var y1 = fromElPos.top+fromElHeight/2;
		var x2 = toElPos.left;
		var y2 = toElPos.top+toElHeight/2;

		if(temp) {
			x2 += 10;
		} else {
			x1 += 25;
			x2 -= 15;
		}

		var a = Math.atan2(y2 - y1, x2 - x1);
		var angle  = a * 180 / Math.PI;	
		var ld = Math.abs(Math.sin(a)*connLineWidth/2);
		return {
			length: Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)),
	  		transform: 'rotate('+angle+'deg)',
	  		top: y1 < y2 ? y1 + ld : y1 - (y1-y2) + ld,
	  		left: x1 < x2 ? x1 - ld : x1 - (x1-x2) - ld
		}
	},
	shutdown: function() {}
});var BiquadFilterNode = BaseNode.extend({
  	init: function(index, config){
  		this._super(index, config);
		this.shortName = "bfn";
		this.thingy = context.createBiquadFilter();
		this.name = "Pass";
		this.icon = "icon-signal";
		this.tooltip = "Lets different frequencies of the audio input through";
		var el = this.createMainEl(true, true, true, 200);
  		var biqN = this.thingy;
  		var thisNode = this;
  		
  		if(!config) {
  			this.c = {
  				type: "lowpass",
  				freq: 0.8,
  				q: 0.2
  			};
  		}
  		
  		var setTypeFnc = function(v) {
  			thisNode.c.type = v;
  			switch(v) {
  				case "highpass":
  					biqN.type = biqN.HIGHPASS;
  				break;
  				case "lowpass":
  					biqN.type = biqN.LOWPASS;
  				break;
  				case "bandpass":
  					biqN.type = biqN.BANDPASS;
  				break;
  			}
  		};
  		
  		var setFrequencyFnc = function(el, v) {
  			thisNode.c.freq = v.value;
  			var minValue = 30;
  			var maxValue = context.sampleRate / 2;
  			// Logarithm (base 2) to compute how many octaves fall in the range.
  			var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  			// Compute a multiplier from 0 to 1 based on an exponential scale.
  			var multiplier = Math.pow(2, numberOfOctaves * (v.value - 1.0));
  			// Get back to the frequency value between min and max.
  			biqN.frequency.value = maxValue * multiplier;
  			freqLabel.html('Frequency ' + Math.floor(biqN.frequency.value) + ' Hz');
  		};
  		
  		var setQFnc = function(el, v) { 
  			thisNode.c.q = v.value;
  			biqN.Q.value = v.value * 30; 
  			qLabel.html('Quality ' + Math.floor(biqN.Q.value));
  		};
	    		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("lowpass"));
		selectEl.append($('<option>').html("highpass"));
		selectEl.append($('<option>').html("bandpass"));
		selectEl.val(this.c.type);
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="Type of pass effect">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		el.append($('<br/>'));
		setTypeFnc(this.c.type);
		
		var freqRange = $('<div>');
		var freqLabel = $('<a href="#" rel="tooltip" title="The cutoff frequency">').tooltip();
		freqRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.freq,
			slide: setFrequencyFnc
		});
		el.append(freqLabel);
		el.append(freqRange);
		el.append($('<br/>'));
		setFrequencyFnc(null, {value:this.c.freq});
		
		var qRange = $('<div>');
		var qLabel = $('<a href="#" rel="tooltip" title="Controls how peaked the response will be at the cutoff frequency">').tooltip();
		qRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.q,
			slide: setQFnc
		});
		el.append(qLabel);
		el.append(qRange);
		setQFnc(null, {value:this.c.q});
	}
});var ConvolverNode = BaseNode.extend({
  	init: function(index, config){
  		this._super(index, config);
  		this.shortName = "cn";
  		this.thingy = context.createConvolver();
  		this.name = "Convolver";
  		this.icon = "icon-random";
  		this.tooltip = "Applies a linear convolution effect given an impulse response";
  		var el = this.createMainEl(true, true, true, 115);
  		var convN = this.thingy;
  		var thisNode = this;
  		
  		if(!config) {
  			this.c = {
  				conv: "cardiod-rear-levelled",
  				norm: true
  			};
  		}
  		
  		var setConvFnc = function(v) {
  			thisNode.c.conv = v;
  			thisNode.loader.fadeIn('fast');
  			var request = new XMLHttpRequest();
  		    request.open("GET", "conv/" + v + ".wav", true);
  		    request.responseType = "arraybuffer";
  		    
  		    request.onload = function() {
  		    	convN.buffer = context.createBuffer(request.response, false);
  		    	thisNode.loader.fadeOut('fast');
  		    }
  		    request.send();
  		};

  		var setNormalizeFnc = function() {
  			thisNode.c.norm = this.checked;
  			convN.normalize.value = this.checked;
  		};
  		
		var sEl = $('<select>');
		sEl.on('change', function() {
			setConvFnc(this.value);
		});
		sEl.append($('<option>').html("cardiod-rear-levelled"));
		sEl.append($('<option>').html("comb-saw1"));
		sEl.append($('<option>').html("comb-saw2"));
		sEl.append($('<option>').html("cosmic-ping-long"));
		sEl.append($('<option>').html("diffusor3"));
		sEl.append($('<option>').html("dining-far-kitchen"));
		sEl.append($('<option>').html("dining-living-true-stereo"));
		sEl.append($('<option>').html("feedback-spring"));
		sEl.append($('<option>').html("filter-lopass160"));
		sEl.append($('<option>').html("filter-rhythm1"));
		sEl.append($('<option>').html("filter-rhythm3"));
		sEl.append($('<option>').html("filter-telephone"));
		sEl.append($('<option>').html("impulse-rhythm2"));
		sEl.append($('<option>').html("kitchen"));
		sEl.append($('<option>').html("kitchen-true-stereo"));
		sEl.append($('<option>').html("living-bedroom-leveled"));
		sEl.append($('<option>').html("matrix6-backwards"));
		sEl.append($('<option>').html("matrix-reverb2"));
		sEl.append($('<option>').html("matrix-reverb3"));
		sEl.append($('<option>').html("s2_r4_bd"));
		sEl.append($('<option>').html("spatialized4"));
		sEl.append($('<option>').html("spatialized5"));
		sEl.append($('<option>').html("spreader50-65ms"));
		sEl.append($('<option>').html("wildecho"));
		sEl.val(this.c.conv);

		el.append($('<a href="#" rel="tooltip" title="Impulse response used by the convolver">').tooltip().html('Impulse response'));
		el.append(sEl);
		setConvFnc(this.c.conv);

		var normalizeChk = $('<input>').attr({
			type: 'checkbox',
			checked: this.c.norm
		});
		var normalizeLabel = $('<a href="#" rel="tooltip" title="Controls whether the impulse response will be scaled by an equal-power normalization">').tooltip().html('Normalize');
		el.append($('<label>').addClass('checkbox').append(normalizeChk).append(normalizeLabel));
		normalizeChk.on('change', setNormalizeFnc);
  	}
  	
});var DelayNode = BaseNode.extend({
  	init: function(index, config){
	    this._super(index, config);
	    this.shortName = "deln";
		this.thingy = context.createDelayNode();
		this.name = "Delay";
		this.icon = "icon-pause";
		this.tooltip = "Delays the incoming audio signal by a certain amount";
		var el = this.createMainEl(true, true, true, 78);
		var delayN = this.thingy;
		var thisNode = this;
		
		if(!config) {
			this.c = {
				d: 0.8
			};
		}
		
		var setDelayFnc = function(el, v) { 
			thisNode.c.d = v.value;
			delayN.delayTime.value = v.value;
			delayLabel.html('Delay ' + v.value + ' s');
		}; 
		
		var delayRange = $('<div>');
		var delayLabel = $('<a href="#" rel="tooltip" title="Delay time in seconds">').tooltip();
		delayRange.slider({
			min: 0,
			max: 0.99,
			step: 0.01,
			value: this.c.d,
			slide: setDelayFnc
		});
		el.append(delayLabel);
		el.append(delayRange);
		setDelayFnc(null, {value:this.c.d});
	}
	
});var DestinationNode = BaseNode.extend({
  	init: function(index, config){
  		this._super(index, config);
  		this.shortName = "dstn";
  		this.thingy = context.createAnalyser();
  		this.icon = "icon-volume-up";
  		this.name = "Output";
  		this.tooltip = "Represents the final audio destination and is what the user will ultimately hear";
  		var el = this.createMainEl(false, true, false);
  		el.css('margin', 0);
		
		var analyzer = this.thingy;
		this.thingy.connect(context.destination);
		var thisNode = this;
	    if(!config) {
	    	this.c = {
	    		vm: 0
	    	};
	    }

	    var ctooltip = $('<a href="#" rel="tooltip" title="Click to change visualization">').tooltip({placement: 'bottom'});
	    el.append(ctooltip);
	    var soundVisualizer = new SoundVisualizer(ctooltip, 150, 120);
	    soundVisualizer.canvas.on('click', function() {
	    	thisNode.c.vm++;
	    	if(thisNode.c.vm == 2) {
	    		soundVisualizer.clear();
	    	} else if(thisNode.c.vm == 3) {
	    		thisNode.c.vm = 0;
	    		window.requestAnimationFrame(onaudioprocess);
	    	}
	    })

	    var data = null; 
	    var onaudioprocess = function() {
		    if(data == null) {
		    	data = new Uint8Array(analyzer.frequencyBinCount);
		    }
		    if(thisNode.c.vm == 0) {
		    	analyzer.getByteTimeDomainData(data);
			    soundVisualizer.visualizeTimeDomainData(data);
			    window.requestAnimationFrame(onaudioprocess);
		    } else if(thisNode.c.vm == 1) {
		    	analyzer.getByteFrequencyData(data);
			    soundVisualizer.visualizeFrequencyData(data);
		    	window.requestAnimationFrame(onaudioprocess);
		    }
		};
		
		window.requestAnimationFrame(onaudioprocess);
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = context.destination;
		arr[1] = this.thingy;
		return arr;
	}
});var DynamicsCompressorNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "dcn";
		this.thingy = context.createDynamicsCompressor();
		this.name = "Dynamic Compr";
		this.icon = "icon-bullhorn";
		this.tooltip = "Dynamics compression is very commonly used in musical production and game audio. It lowers the volume of the loudest parts of the signal and raises the volume of the softest parts";
		var el = this.createMainEl(true, true, true, 305);
		var dynCmpN = this.thingy;
		var thisNode = this;

		if(!config) {
			this.c = {
				t: dynCmpN.threshold.defaultValue,
				k: dynCmpN.knee.defaultValue,
				rat: dynCmpN.ratio.defaultValue,
				a: 0.1,
				rel: 0.25
			};
		}
		
		var setThresholdFnc = function(el, v) {
			thisNode.c.t = v.value;
			dynCmpN.threshold.value = v.value;
			thresLabel.html('Threshold ' + v.value + ' dB');
		};
		var setKneeFnc = function(el, v) {
			thisNode.c.k = v.value;
			dynCmpN.knee.value = v.value;
			kneeLabel.html('Knee ' + v.value + ' dB');
		};
		var setRatioFnc = function(el, v) { 
			thisNode.c.rat = v.value;
			dynCmpN.ratio.value = v.value;
			ratioLabel.html('Ratio ' + v.value);
		};
		var setAttackFnc = function(el, v) { 
			thisNode.c.a = v.value;
			dynCmpN.attack.value = v.value;
			attackLabel.html('Attack ' + v.value + ' s');
		};
		var setReleaseFnc = function(el, v) { 
			thisNode.c.rel = v.value;
			dynCmpN.release.value = v.value;
			releaseLabel.html('Release ' + v.value + ' s');
		};

		if(dynCmpN.threshold == undefined || dynCmpN.attack == undefined || dynCmpN.release == undefined) {
			el.append($('<p>').html('Not supported by your browser'));
			return;
		}
		
		var thresRange = $('<div>');
		var thresLabel = $('<a href="#" rel="tooltip" title="The decibel value above which the compression will start taking effect">').tooltip();
		thresRange.slider({
			min: dynCmpN.threshold.minValue,
			max: dynCmpN.threshold.maxValue,
			value: this.c.t,
			slide: setThresholdFnc
			
		});
		el.append(thresLabel);
		el.append(thresRange);
		el.append($('<br/>'));
		setThresholdFnc(null, { value: this.c.t});

		var kneeRange = $('<div>');
		var kneeLabel = $('<a href="#" rel="tooltip" title="A decibel value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion">').tooltip();
		kneeRange.slider({
			min: dynCmpN.knee.minValue,
			max: dynCmpN.knee.maxValue,
			value: this.c.k,
			slide: setKneeFnc
			
		});
		el.append(kneeLabel);
		el.append(kneeRange);
		el.append($('<br/>'));
		setKneeFnc(null, { value: this.c.k});

		var ratioRange = $('<div>');
		var ratioLabel = $('<a href="#" rel="tooltip" title="The ratio of compression">').tooltip();
		ratioRange.slider({
			min: dynCmpN.ratio.minValue,
			max: dynCmpN.ratio.maxValue,
			value: this.c.rat,
			slide: setRatioFnc
			
		});
		el.append(ratioLabel);
		el.append(ratioRange);
		el.append($('<br/>'));
		setRatioFnc(null, { value: this.c.rat});

		
		var attackRange = $('<div>');
		var attackLabel = $('<a href="#" rel="tooltip" title="The amount of time to increase the gain by 10dB.">').tooltip();
		attackRange.slider({
			min: dynCmpN.attack.minValue,
			max: dynCmpN.attack.maxValue,
			step: 0.01,
			value: this.c.a,
			slide: setAttackFnc
		});
		el.append(attackLabel);
		el.append(attackRange);
		el.append($('<br/>'));
		setAttackFnc(null, { value: this.c.a});
		
		var releaseRange = $('<div>');
		var releaseLabel = $('<a href="#" rel="tooltip" title="The amount of time to reduce the gain by 10dB">').tooltip();
		releaseRange.slider({
			min: dynCmpN.release.minValue,
			max: dynCmpN.release.maxValue,
			step: 0.01,
			value: this.c.rel,
			slide: setReleaseFnc
		});
		el.append(releaseLabel);
		el.append(releaseRange);
		el.append($('<br/>'));
		setReleaseFnc(null, { value: this.c.rel});

		var reductionLabel = $('<p>')
		setInterval(function() {
			reductionLabel.html('Reduction ' + Math.min(dynCmpN.reduction.value.toPrecision(2), -0.1) + ' dB');
		},100);
		el.append($('<a href="#" rel="tooltip" title="Current amount of gain reduction">').tooltip().append(reductionLabel));
	}
});var GainNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "gn";
		this.thingy = context.createGainNode();
		this.name = "Gain";
		this.icon = "icon-plus";
		this.tooltip = "Changes the gain of (scales) the incoming audio signal by a certain amount";
	    var el = this.createMainEl(true, true, true, 78);
	    var gainN = this.thingy;
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		v: 1
	    	};
	    }
	    
	    var setVolumeFnc = function(el, v) {
	    	thisNode.c.v = v.value;
			gainN.gain.value = v.value * v.value;
			gainLabel.html('Volume ' + v.value);
		} 
		
		var gainRange = $('<div>');
		var gainLabel = $('<a href="#" rel="tooltip" title="Set gain multiplier">').tooltip();
		gainRange.slider({
			min: 0,
			max: 3,
			value: this.c.v,
			step: 0.01,
			slide: setVolumeFnc
		});
		el.append(gainLabel);
		el.append(gainRange);
		setVolumeFnc(null, {value: this.c.v});
	}
});var ScriptNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "scn";
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.thingy.onaudioprocess = function(event) {	};
		this.name = "Javascript";
		this.icon = "icon-filter";
		this.tooltip = "Can generate or process audio directly using JavaScript. Has inputBuffer inp, outputBuffer out and AudioProcessingEvent ev defined";
	    var javaScriptNode = this.thingy;
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		c: "for (var i = 0; i < inp.length; i++) {\n out[i] = inp[i];\n}"
	    	};
	    }
		
	    var el = this.createMainEl(true, true, true, 308, 241);
	    el.css('width', '221px');
	    
	    var scriptBox = $('<textarea>');
	    var compileButton = $('<input>');
	    var errorMsg = this.thingy.errorMsg = $('<div>');
	    errorMsg.css({ 'float': 'right', 
	    	'width': '159px',
	    	'height': '36px',
	    	'overflow-y': 'auto',
	    	'overflow-x': 'hidden'
	    });
	    
	    var compileFnc = function(code) {
	    	thisNode.c.c = code;
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
		scriptBox.val(this.c.c);
		
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
		
		compileFnc(this.c.c);
	}  
});var SourceNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "son";
		this.thingy = context.createBufferSource();
		this.thingy.loop = true;
		this.name = "File";
		this.icon = "icon-file";
		this.tooltip = "Plays an audio file dragged from the filesystem"
	    
		var bufferSource = this.thingy;
		var thisNode = this;

		if(!config) {
			this.c = {
				pr: 1
			};
		}
		
		var el = this.createMainEl(true, false, true, 175);
		
		var btnGroupEl = $('<div>');
		btnGroupEl.addClass('btn-group');
		btnGroupEl.css('width', '100%');
		
		var startEl = $('<input>');
		startEl.attr({
			type: 'button',
			value: 'start',
			disabled: 'true',
		});
		startEl.addClass('btn');
		startEl.addClass('btn-primary');
		startEl.css('width', '50%');
		startEl.click(function() {
			stopEl.removeAttr('disabled');
			startEl.attr('disabled', 'true');
			bufferSource.gain.value = 1;
		});
		btnGroupEl.append(startEl);
		
		var stopEl = $('<input>');
		stopEl.attr({
			type: 'button',
			value: 'stop',
			disabled: 'true',
		});
		stopEl.addClass('btn');
		stopEl.addClass('btn-primary');
		stopEl.css('width', '50%');
		stopEl.click(function() {
			startEl.removeAttr('disabled');
			stopEl.attr('disabled', 'true');
			bufferSource.gain.value = 0;
		});
		btnGroupEl.append(stopEl);
		el.append(btnGroupEl);

		
		var setPlaybackRateFnc = function(el, v) {
			thisNode.c.pr = v.value;
			bufferSource.playbackRate.value = v.value;
			rateLabel.html('Rate ' + v.value);
		} 
		
		var rateRange = $('<div>');
		var rateLabel = $('<a href="#" rel="tooltip" title="Set playback rate multiplier">').tooltip();
		rateRange.slider({
			min: 0.1,
			max: 3,
			value: this.c.pr,
			step: 0.05,
			slide: setPlaybackRateFnc
		});
		el.append('<br/>');
		el.append(rateLabel);
		el.append(rateRange);
		el.append('<br/>');
		setPlaybackRateFnc(null, {value: this.c.pr});
		
		var infoEl = $('<div>');
		infoEl.html("Drag and drop a sound file to me..");
		el.append(infoEl);
		
		var info2El = this.info2El = $('<div>');
		info2El.html("Now connect me to something..");
		info2El.hide();
		el.append(info2El);
		
		el.parent()[0].addEventListener('drop', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();
		    thisNode.loader.fadeIn('fast');
		    
		    var reader = new FileReader();
		    reader.onload = function(e) {
		    	if(context.decodeAudioData) {
			        context.decodeAudioData(e.target.result, function(buffer) {
			        	bufferSource.buffer = buffer;
			        }, function(e) {
			        	alert('could not play that audio');
			            console.log(e);
			            return;
			        });
			    } else {
			    	bufferSource.buffer = context.createBuffer(e.target.result, false /*mixToMono*/);
			    }
	        	bufferSource.noteOn(0);
	        	stopEl.removeAttr('disabled');
	        	if(thisNode.myConnections.length == 0) {
	        		info2El.show('fast');
	        	}
	        	infoEl.hide('fast');
	        	thisNode.loader.fadeOut('fast');
		    }
		    reader.readAsArrayBuffer(evt.dataTransfer.files[0]);		    
		}, false);
		
		el.parent()[0].addEventListener('dragover', function (evt) {
		    evt.stopPropagation();
		    evt.preventDefault();
		    return false;
		}, false);
  	},
  	connectTo: function(node) {
	  	var ret = this._super(node);
		this.info2El.hide('fast');
		return ret;
  	},
  	getConnections: function() {
		return new Array();
	},
	shutdown: function() {
		this.thingy.noteOff(0);
	}
});var WaveShaperNode = BaseNode.extend({
  	init: function(index, config){
	    this._super(index, config);
	    this.shortName = "wsn";
		this.thingy = context.createWaveShaper();
		this.name = "WaveShaper";
		this.icon = "icon-tasks";
		this.tooltip = "Implements non-linear distortion effects";
		var el = this.createMainEl(true, true, true, 166, 155);
		var shaperN = this.thingy;
		var thisNode = this;

		if(!config) {
			this.c = {
				cu: [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45]
			};
		}
		
		var setCurveFnc = function(l, v) { 
			var curve = new Float32Array(10);
			var idx = 0;
			$(el).find('.curveRange').each(function() {
				var cVal = $(this).slider("value");
				thisNode.c.cu[idx] = cVal;
				curve[idx++] = cVal;
			});
			shaperN.curve = curve;
		}; 
		
		el.append($('<a href="#" rel="tooltip" title="The shaping curve used for the waveshaping effect">').tooltip().html('Curve'));
		el.append($('<br/>'));

		for(var i = 0; i < 10; i++) {
			var curveRange = $('<div>');
			curveRange.slider({
				orientation: "vertical",
				min: -1,
				max: 1,
				step: 0.01,
				value: this.c.cu[i],
				slide: setCurveFnc
			});
			curveRange.addClass('curveRange');
			el.append(curveRange);
		}

		setCurveFnc(null, null);
	}
	
});var OscillatorNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "on";
		this.name = "Oscillator";
		this.icon = " icon-chevron-up";
		this.tooltip = "Oscillator represents an audio source generating a periodic waveform";
		var el = this.createMainEl(true, false, true, 183);
		try {
			this.thingy = context.createOscillator();
		} catch(e) {
			el.append($('<p>').html('Not supported by your browser. You probably need to go Chrome Canary.'));
			return;
		}
  		var oscN = this.thingy;
  		var thisNode = this;

  		if(!config) {
  			this.c = {
  				t: "sine",
  				f: 0.1,
  				d: 0
  			};
  		}
  		
  		var setTypeFnc = function(v) {
  			thisNode.c.t = v;
  			switch(v) {
  				case "sine":
  					oscN.type = oscN.SINE;
  				break;
  				case "square":
  					oscN.type = oscN.SQUARE;
  				break;
  				case "sawtooth":
  					oscN.type = oscN.SAWTOOTH;
  				break;
  				case "triangle":
  					oscN.type = oscN.TRIANGLE;
  				break;
  			}
  		};
  		
  		var setFrequencyFnc = function(el, v) {
  			thisNode.c.f = v.value;
  			var minValue = 30;
  			var maxValue = context.sampleRate / 2;
  			// Logarithm (base 2) to compute how many octaves fall in the range.
  			var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  			// Compute a multiplier from 0 to 1 based on an exponential scale.
  			var multiplier = Math.pow(2, numberOfOctaves * (v.value - 1.0));
  			// Get back to the frequency value between min and max.
  			oscN.frequency.value = maxValue * multiplier;
  			freqLabel.html('Frequency ' + Math.floor(oscN.frequency.value) + ' Hz');
  		};
  		
  		var setDetuneFnc = function(el, v) {
  			thisNode.c.d = v.value;
  			oscN.detune.value = v.value;
			detuneLabel.html('Detune ' + v.value + ' Cents');
  		}
  		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("sine"));
		selectEl.append($('<option>').html("square"));
		selectEl.append($('<option>').html("sawtooth"));
		selectEl.append($('<option>').html("triangle"));
		selectEl.val(this.c.t)
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		setTypeFnc(this.c.t);
		
		var freqRange = $('<div>');
		var freqLabel = $('<a href="#" rel="tooltip" title="The frequency of the periodic waveform.">').tooltip();
		freqRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.f,
			slide: setFrequencyFnc
		});
		el.append(freqLabel);
		el.append(freqRange);
		el.append($('<br/>'));
		setFrequencyFnc(null, {value:this.c.f});
		
		var detuneRange = $('<div>');
		var detuneLabel = $('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();
		detuneRange.slider({
			min: -100,
			max: 100,
			step: 1,
			value: this.c.d,
			slide: setDetuneFnc
		});
		el.append(detuneLabel);
		el.append(detuneRange);
		setDetuneFnc(null, {value:this.c.d});

		oscN.noteOn(0);
	},
	shutdown: function() {
		this.thingy.noteOff(0);
	}
});var MicrophoneNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.shortName = "mn";
		this.name = "Microphone";
		this.icon = " icon-user";
		this.tooltip = "Gets audio input from a microphone";
		var thisNode = this;
		this.myLazyConnections = new Array();
		var el = this.createMainEl(true, false, true, 128);

		var status = $('<p>');
		el.append(status);

		try {
			var successFnc = function (stream) {
				thisNode.thingy = context.createMediaStreamSource(stream);

				for(var i in thisNode.myLazyConnections) {
					thisNode.connectTo(thisNode.myLazyConnections[i]);
				}
				for(var j in thisNode.myConnections) {
					var toN = thisNode.myConnections[j];
					thisNode.createConnectionLine(thisNode.el,toN.el,thisNode.idx,toN.idx, false);
				}
				thisNode.updateConnectionLines();
				thisNode.myLazyConnections = new Array();

				status.html('Recording...');
			};

			var errorFnc = function(e) {
				status.html('Failed to start recording');
				console.log(e);
			};

			if(navigator.getUserMedia) {
				navigator.getUserMedia({audio: true, video: false}, successFnc, errorFnc);
			} else if (navigator.webkitGetUserMedia) {
				navigator.webkitGetUserMedia({audio: true, video: false}, successFnc, errorFnc);
			} else {
				status.html('Not yet supported in your browser. Try Chrome Canary with Web Audio Input flag set.');	
			}
		 } catch(e) {
		 	status.html('Not yet supported in your browser. Try Chrome Canary with Web Audio Input flag set.');
		 }
	},

	lazyConnectTo: function(node) {
		this.myLazyConnections.push(node);
	}
});var AnalyzerNode = BaseNode.extend({
  	init: function(index, config){
  		this._super(index, config);
  		this.shortName = "an";
  		this.thingy = context.createAnalyser();
  		this.icon = "icon-eye-open";
  		this.name = "Analyzer";
  		this.tooltip = "Provides real-time frequency and time-domain analysis information. The audio stream will be passed un-processed from input to output.";
  		var el = this.createMainEl(true, true, true);
  		el.css('margin', 0);
		
		var analyzer = this.thingy;
	    var thisNode = this;
	    if(!config) {
	    	this.c = {
	    		vm: 0
	    	};
	    }

	    var ctooltip = $('<a href="#" rel="tooltip" title="Click to change visualization">').tooltip({placement: 'bottom'});
	    el.append(ctooltip);
	    var soundVisualizer = new SoundVisualizer(ctooltip, 150, 120);
	    soundVisualizer.canvas.on('click', function() {
	    	thisNode.c.vm++;
	    	if(thisNode.c.vm == 2) {
	    		soundVisualizer.clear();
	    	} else if(thisNode.c.vm == 3) {
	    		thisNode.c.vm = 0;
	    		window.requestAnimationFrame(onaudioprocess);
	    	}
	    })

	    var data = null; 
	    var onaudioprocess = function() {
		    if(data == null) {
		    	data = new Uint8Array(analyzer.frequencyBinCount);
		    }
		    if(thisNode.c.vm == 0) {
		    	analyzer.getByteTimeDomainData(data);
			    soundVisualizer.visualizeTimeDomainData(data);
			    window.requestAnimationFrame(onaudioprocess);
		    } else if(thisNode.c.vm == 1) {
		    	analyzer.getByteFrequencyData(data);
			    soundVisualizer.visualizeFrequencyData(data);
		    	window.requestAnimationFrame(onaudioprocess);
		    }
		};
		
		window.requestAnimationFrame(onaudioprocess);
  	}
});var TextToSpeechNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "tts";
		this.thingy = context.createBufferSource();
		this.name = "Text To Speech";
		this.icon = "icon-font";
		this.tooltip = "Uses the brilliant speak.js to speak the text";
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		t: "All your bases are belong to us!",
	    		p: 50,
	    		s: 150,
	    		g: 0
	    	};
	    }
	    
	    var setPitchFnc = function(el, v) { thisNode.c.p = v.value; pitchLabel.html('Pitch ' + v.value); } 
	    var setSpeedFnc = function(el, v) { thisNode.c.s = v.value; speedLabel.html('Speed ' + v.value + ' word / minute'); }
	    var setWordGapFnc = function(el, v) { thisNode.c.g = v.value; wordGapLabel.html('Word Gap ' + v.value + ' ms'); }
		
	    var el = this.createMainEl(true, false, true, 313, 241);
	    el.css('width', '221px');
	    
	    var pitchRange = $('<div>');
		var pitchLabel = $('<a href="#" rel="tooltip" title="The voice pitch">').tooltip();
		pitchRange.slider({
			min: 10,
			max: 100,
			value: this.c.p,
			step: 1,
			slide: setPitchFnc
		});
		el.append(pitchLabel);
		el.append(pitchRange);
		setPitchFnc(null, {value: this.c.p});
		
		var speedRange = $('<div>');
		var speedLabel = $('<a href="#" rel="tooltip" title="The speed at which to talk">').tooltip();
		speedRange.slider({
			min: 10,
			max: 300,
			value: this.c.s,
			step: 1,
			slide: setSpeedFnc
		});
		el.append(speedLabel);
		el.append(speedRange);
		setSpeedFnc(null, {value: this.c.s});
		
		var wordGapRange = $('<div>');
		var wordGapLabel = $('<a href="#" rel="tooltip" title="Additional gap between words">').tooltip();
		wordGapRange.slider({
			min: 0,
			max: 200,
			value: this.c.g,
			step: 10,
			slide: setWordGapFnc
		});
		el.append(wordGapLabel);
		el.append(wordGapRange);
		setWordGapFnc(null, {value: this.c.g});
	    
	    var textBox = $('<textarea>');
	    var speakButton = $('<input>');
	    
	    var speakFnc = function(text) {
	    	thisNode.c.t = text;
	    	thisNode.loader.fadeIn('fast');
	    	speakButton.attr('disabled', 'true');
	    	
	    	var speakWorker = new Worker('js/speakWorker.js');

	    	speakWorker.onmessage = function(event) {
    			thisNode.thingy = context.createBufferSource();
	    		context.decodeAudioData(event.data.buffer, function(buffer) {
	    			thisNode.thingy.buffer = buffer;
	    			for(var i in thisNode.myConnections) {
	    				var node = thisNode.myConnections[i];
	    				var conns = node.getConnections();
	    				for(var i in conns) {
	    					thisNode.thingy.connect(conns[i]);
	    				}
					}
	    			thisNode.thingy.noteOn(0);
	    			
	    			setTimeout(function() {
	    				thisNode.thingy.noteOff(0);
	    				for(var i in thisNode.myConnections) {
		    				var node = thisNode.myConnections[i];
		    				var conns = node.getConnections();
		    				for(var i in conns) {
		    					thisNode.thingy.disconnect(conns[i]);
		    				}
						}
	    				speakButton.removeAttr('disabled');
	    			}, buffer.duration * 1000)
	    			
	    			thisNode.loader.fadeOut('fast');
	    		});
	    	};

	    	speakWorker.postMessage({
	    		text : text,
	    		args : {
	    			pitch: thisNode.c.p,
	    			speed: thisNode.c.s,
	    			wordgap: thisNode.c.g/10
	    		}
	    	});
		};
		
		textBox.attr('cols', '30');
		textBox.attr('rows', '6');
		textBox.val(this.c.t);
		
		speakButton.attr({
			type: 'button',
			value: 'Speak'
		});
		speakButton.on("click", function() {
			speakFnc(textBox.val());
		});
		
		el.append($('<br/>'));
		el.append(textBox);
		el.append($('<br/>'));
		el.append(speakButton);
	}  
});var PianoNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "pn";
		this.name = "Piano";
		this.icon = " icon-play";
		this.tooltip = "Play piano on your keyboard. ";
		this.deleted = false;
		var el = this.createMainEl(true, false, true, 290);
		try {
			this.thingy = context.createOscillator();
			if(typeof this.thingy.noteOn != 'function') { 
				throw new Exception();
			}	

		} catch(e) {
			el.append($('<p>').html('Not supported by your browser. You probably need to go Chrome Canary.'));
			return;
		}
  		var thisNode = this;

  		if(!config) {
  			this.c = {
  				t: "sine",
  				d: 0,
  				o: 2,
  				at: 0.3,
  				de: 0.3,
  				su: 0.8,
  				re: 0.3
  			};
  		}

  		var pianoNotes = this.pianoNotes = {};

  		var shutupFnc = this.shutupFnc = function(note) {
  			if(!note) return;
  			//note.gain.gain.cancelScheduledValues(context.currentTime);
  			note.gain.gain.linearRampToValueAtTime(0.0, context.currentTime + thisNode.c.re);
  			setTimeout(function() {
	  			note.osc.noteOff(0);
	  			note.osc.disconnect(note.gain);
				for(var i in thisNode.myConnections) {
					var n = thisNode.myConnections[i];
					var conns = n.getConnections();
					for(var i in conns) {
						note.gain.disconnect(conns[i]);
					}
				}
  			}, thisNode.c.re * 1000 + 50);
  		}

  		var soundFnc = function() {
  			var note = {};
  			note.osc = context.createOscillator();
  			note.gain = context.createGainNode();
  			note.osc.connect(note.gain);
  			for(var i in thisNode.myConnections) {
				var n = thisNode.myConnections[i];
				var conns = n.getConnections();
				for(var i in conns) {
					note.gain.connect(conns[i]);
				}
			}
			note.osc.noteOn(0);
			note.gain.gain.linearRampToValueAtTime(0.0, context.currentTime);
			note.gain.gain.linearRampToValueAtTime(1.0, context.currentTime + thisNode.c.at);
			setTimeout(function() {
				if(note.gain.gain.value == 1.0) {
					note.gain.gain.linearRampToValueAtTime(thisNode.c.su, context.currentTime + thisNode.c.de);
				}
			},thisNode.c.at * 1000);
			return note;
  		}
  		
  		var setTypeFnc = function(v) {
  			thisNode.c.t = v;
  			var t = null;
  			switch(v) {
  				case "sine":
  					t = thisNode.thingy.SINE;
  				break;
  				case "square":
  					t = thisNode.thingy.SQUARE;
  				break;
  				case "sawtooth":
  					t = thisNode.thingy.SAWTOOTH;
  				break;
  				case "triangle":
  					t = thisNode.thingy.TRIANGLE;
  				break;
  			}
  			if(t) {
	  			for(var i in pianoNotes) {
	  				if(pianoNotes[i]) pianoNotes[i].osc.type = t;
	  			}
	  		}
  		};

  		var setOctaveFnc = function(el, v) {
  			thisNode.c.o = v.value;
  			octaveLabel.html('Octave ' + v.value);
  		}
  		
  		var setDetuneFnc = function(el, v) {
  			thisNode.c.d = v.value;
  			for(var i in pianoNotes) {
  				if(pianoNotes[i]) pianoNotes[i].osc.detune.value = v.value;
  			}
			detuneLabel.html('Detune ' + v.value + ' Cents');
  		}
  		
  		var setAttackFnc = function(el, v) {
  			thisNode.c.at = v.value;
  			attackLabel.html('Attack ' + v.value + ' s');
  		}
  		
  		var setDecayFnc = function(el, v) {
  			thisNode.c.de = v.value;
  			decayLabel.html('Decay ' + v.value + ' s');
  		}
  		
  		var setSustainFnc = function(el, v) {
  			thisNode.c.su = v.value;
  			sustainLabel.html('Sustain level ' + v.value);
  		}
  		
  		var setReleaseFnc = function(el, v) {
  			thisNode.c.re = v.value;
  			releaseLabel.html('Release ' + v.value + ' s');
  		}
  		
		var pf =  {
			Z: 65.406,
			S: 69.296,
			X: 73.416,
			D: 77.782,
			C: 82.407,
			V: 87.307,
			G: 92.499,
			B: 97.999,
			H: 103.826,
			N: 110.000,
			J: 116.541,
			M: 123.471,
			Q: 65.406*2,
			'2': 69.296*2,
			W: 73.416*2,
			'3': 77.782*2,
			E: 82.407*2,
			R: 87.307*2,
			'5': 92.499*2,
			T: 97.999*2,
			'6': 103.826*2,
			Y: 110.000*2,
			'7': 116.541*2,
			U: 123.471*2 
		};

		this.onkeydown = function(e) {
			if(thisNode.deleted) return;

			var note = String.fromCharCode(e.keyCode);
			if(!pianoNotes[note]) {
				if(pf[note]) {
					pianoNotes[note] = soundFnc();
					pianoNotes[note].osc.frequency.value = pf[note] * thisNode.c.o;
					setTypeFnc(thisNode.c.t);
					setDetuneFnc(null, {value:thisNode.c.d});
				}
			}
		};

		this.onkeyup = function(e) {
			if(thisNode.deleted) return;

			var note = String.fromCharCode(e.keyCode);
			shutupFnc(pianoNotes[note]);
			pianoNotes[note] = null;
		};
  		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("sine"));
		selectEl.append($('<option>').html("square"));
		selectEl.append($('<option>').html("sawtooth"));
		selectEl.append($('<option>').html("triangle"));
		selectEl.val(this.c.t)
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		setTypeFnc(this.c.t);

		var octaveRange = $('<div>');
		var octaveLabel = $('<a href="#" rel="tooltip" title="Select the octave of the piano">').tooltip();
		octaveRange.slider({
			min: 1,
			max: 6,
			step: 1,
			value: this.c.o,
			slide: setOctaveFnc
		});
		el.append(octaveLabel);
		el.append(octaveRange);
		setOctaveFnc(null, {value:this.c.o});
		
		var detuneRange = $('<div>');
		var detuneLabel = $('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();
		detuneRange.slider({
			min: -100,
			max: 100,
			step: 1,
			value: this.c.d,
			slide: setDetuneFnc
		});
		el.append(detuneLabel);
		el.append(detuneRange);
		setDetuneFnc(null, {value:this.c.d});
		
		var attackRange = $('<div>');
		var attackLabel = $('<a href="#" rel="tooltip" title="Attack time is the time taken for initial run-up of level from nil to peak">').tooltip();
		attackRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.at,
			slide: setAttackFnc
		});
		el.append(attackLabel);
		el.append(attackRange);
		setAttackFnc(null, {value:this.c.at});
		
		var decayRange = $('<div>');
		var decayLabel = $('<a href="#" rel="tooltip" title="Decay time is the time taken for the subsequent run down from the attack level to the designated sustain level.">').tooltip();
		decayRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.de,
			slide: setDecayFnc
		});
		el.append(decayLabel);
		el.append(decayRange);
		setDecayFnc(null, {value:this.c.de});
		
		var sustainRange = $('<div>');
		var sustainLabel = $('<a href="#" rel="tooltip" title="Sustain level is the level during the main sequence of the sound\'s duration, until the key is released.">').tooltip();
		sustainRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.su,
			slide: setSustainFnc
		});
		el.append(sustainLabel);
		el.append(sustainRange);
		setSustainFnc(null, {value:this.c.su});
		
		var releaseRange = $('<div>');
		var releaseLabel = $('<a href="#" rel="tooltip" title="Release time is the time taken for the level to decay from the sustain level to zero after the key is released.">').tooltip();
		releaseRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: this.c.re,
			slide: setReleaseFnc
		});
		el.append(releaseLabel);
		el.append(releaseRange);
		setReleaseFnc(null, {value:this.c.re});
		
		if(!localStorage["shownPianoInfo"]) {
			localStorage["shownPianoInfo"] = 'yes';
			$('#pianoInfoBox').modal();
		}

	},
	shutdown: function() {
		for(var i in this.pianoNotes) {
			this.shutupFnc(this.pianoNotes[i]);
		}
		this.deleted = true;
	}
});var NoiseNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "nn";
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.name = "Noise";
		this.icon = "icon-question-sign";
		this.tooltip = "Amplifies each sample in the signal with random amount";
	    var el = this.createMainEl(true, true, true, 78);
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		v: 0.5
	    	};
	    }
	    
	    var setAmountFnc = function(el, v) {
	    	thisNode.c.v = v.value;
			amountLabel.html('Amount ' + v.value);
		} 
		
		var amountRange = $('<div>');
		var amountLabel = $('<a href="#" rel="tooltip" title="Set noise amount">').tooltip();
		amountRange.slider({
			min: 0,
			max: 3,
			value: this.c.v,
			step: 0.01,
			slide: setAmountFnc
		});
		el.append(amountLabel);
		el.append(amountRange);
		setAmountFnc(null, {value: this.c.v});
		
		this.thingy.onaudioprocess = function(ev) {
			var inp = ev.inputBuffer.getChannelData(0); 
			var out = ev.outputBuffer.getChannelData(0);
			for (var i = 0; i < inp.length; i++) {
				out[i] = inp[i] * (1+(Math.random()*thisNode.c.v)-thisNode.c.v*0.5);
			}
		}
	}
});var VibratoNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "vn";
		this.thingy = context.createJavaScriptNode(4096, 1, 1);
		this.name = "Vibrato";
		this.icon = "icon-leaf";
		this.tooltip = "Adds a vibrato effect to the signal";
	    var el = this.createMainEl(true, true, true, 110);
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		v: 0.5,
	    		s: 1.0
	    	};
	    }
	    
	    var setAmountFnc = function(el, v) {
	    	thisNode.c.v = v.value;
			amountLabel.html('Amount ' + v.value);
		} 
	    var setSpeedFnc = function(el, v) {
	    	thisNode.c.s = v.value;
			speedLabel.html('Speed ' + v.value);
		}
		
		var amountRange = $('<div>');
		var amountLabel = $('<a href="#" rel="tooltip" title="Set vibrato amount">').tooltip();
		amountRange.slider({
			min: 0,
			max: 3,
			value: this.c.v,
			step: 0.01,
			slide: setAmountFnc
		});
		el.append(amountLabel);
		el.append(amountRange);
		setAmountFnc(null, {value: this.c.v});
		
		var speedRange = $('<div>');
		var speedLabel = $('<a href="#" rel="tooltip" title="Set vibrato speed">').tooltip();
		speedRange.slider({
			min: 0,
			max: 3,
			value: this.c.v,
			step: 0.01,
			slide: setSpeedFnc
		});
		el.append(speedLabel);
		el.append(speedRange);
		setSpeedFnc(null, {value: this.c.s});
		
		var cc = 0;
		this.thingy.onaudioprocess = function(ev) {
			var inp = ev.inputBuffer.getChannelData(0); 
			var out = ev.outputBuffer.getChannelData(0);
			for (var i = 0; i < inp.length; i++) {
				out[i] = inp[i] * (1+Math.sin(cc*thisNode.c.s*0.001)*thisNode.c.v);
				cc++;
			}
		}
	}
});var PitchNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "ptn";
		this.thingy = context.createJavaScriptNode(8192, 1, 1);
		this.name = "Pitch";
		this.icon = "icon-resize-full";
		this.tooltip = "A simple artifact introducing pitch changer";
	    var el = this.createMainEl(true, true, true, 78);
	    var thisNode = this;

	    if(!config) {
	    	this.c = {
	    		v: 1.0
	    	};
	    }
	    
	    var setAmountFnc = function(el, v) {
	    	thisNode.c.v = v.value;
			amountLabel.html('Amount ' + v.value);
		} 
		
		var amountRange = $('<div>');
		var amountLabel = $('<a href="#" rel="tooltip" title="Set pitch amount">').tooltip();
		amountRange.slider({
			min: 0,
			max: 3,
			value: this.c.v,
			step: 0.01,
			slide: setAmountFnc
		});
		el.append(amountLabel);
		el.append(amountRange);
		setAmountFnc(null, {value: this.c.v});
		
		this.thingy.onaudioprocess = function(ev) {
			var inp = ev.inputBuffer.getChannelData(0); 
			var out = ev.outputBuffer.getChannelData(0);
			var a;
			var s;
			var l = inp.length;
			for (var i = 0; i < l; i++) {
				a = Math.floor(i*thisNode.c.v);
				if(a >= l) {
					a = l-(a-l)-1;
				}
				s = inp[a];
				out[i] = s;
			}
		}
	}
});var SaveHandler = Class.extend({
	init: function(){
		this.localStorageSavePrefix = "save_";
	},
	createSaveData: function() {
		var save = {
			nodes: []
		};

		for(var i in nodes) {
			var n = nodes[i];
			if(!n.deleted) {
				var conns = new Array();
				for(var j in n.myConnections) {
					if(!n.myConnections[j].deleted) {
						conns.push(n.myConnections[j].idx);
					}
				}

				save.nodes.push({
					i: n.idx,
					sn: n.shortName,
					d: n.c,
					p: n.el.offset(),
					c: conns
				});
			}
		}

		return window.btoa(JSON.stringify(save));
	},
	loadSaveData: function(data) {
		//parse data
		var save = JSON.parse(window.atob(data));

		//clean up old nodes
		for(var i in nodes) {
			for(var j in nodes[i].myConnections) {
				nodes[i].disconnectFrom(nodes[i].myConnections[j]);
			}
			nodes[i].shutdown();
			nodes[i].el.remove();
		}
		$('.line').remove();
		nodes = new Array();

		//create saved nodes
		for(var i in save.nodes) {
			var n = save.nodes[i];
			var node = this.createNodeFromString(n);
			node.el.offset(n.p);
			nodes[n.i] = node;
		}

		//connect saved nodes
		for(var i in save.nodes) {
			var n = save.nodes[i];
			if(n.c.length > 0) {
				for(var j in n.c) {
					var connectTo = n.c[j];
					var connectFrom = nodes[n.i];
					if(connectFrom instanceof MicrophoneNode) {
						connectFrom.lazyConnectTo(nodes[connectTo]);
					} else {
						connectFrom.connectTo(nodes[connectTo]);
					}
				}
			}
		}

		//create connection lines
		for(var i in nodes) {
			var fromN = nodes[i];
			if(fromN) {
				for(var j in fromN.myConnections) {
					var toN = fromN.myConnections[j];
					fromN.createConnectionLine(fromN.el,toN.el,fromN.idx,toN.idx, false);
				}
				fromN.updateConnectionLines();
			}
		}
	},
	createNodeFromString: function(n) {
		var node = null;
		switch(n.sn) {
			case 'mn': node = new MicrophoneNode(n.i, n.d); break;
			case 'gn': node = new GainNode(n.i, n.d); break;
			case 'scn': node = new ScriptNode(n.i, n.d); break;
			case 'son': node = new SourceNode(n.i, n.d); break;
			case 'bfn': node = new BiquadFilterNode(n.i, n.d); break;
			case 'cn': node = new ConvolverNode(n.i, n.d); break;
			case 'deln': node = new DelayNode(n.i, n.d); break;
			case 'dstn': node = new DestinationNode(n.i, n.d); break;
			case 'dcn': node = new DynamicsCompressorNode(n.i, n.d); break;
			case 'wsn': node = new WaveShaperNode(n.i, n.d); break;
			case 'on': node = new OscillatorNode(n.i, n.d);	 break;
			case 'an': node = new AnalyzerNode(n.i, n.d); break;
			case 'tts': node = new TextToSpeechNode(n.i, n.d); break;
			case 'pn': node = new PianoNode(n.i, n.d); break;
			case 'nn': node = new NoiseNode(n.i, n.d); break;
			case 'vn': node = new VibratoNode(n.i, n.d); break;
			case 'ptn': node = new PitchNode(n.i, n.d); break;
		}
		return node;
	},
	saveToLocalStorage: function(saveName) {
		var data = this.createSaveData();
		localStorage[this.localStorageSavePrefix + saveName] = data;
	}, 
	loadFromLocalStorage: function(saveName) {
		var data = localStorage[this.localStorageSavePrefix + saveName];
		this.loadSaveData(data);
	},
	getAllSavesInLocalStorage: function() {
		var saves = new Array();
		for (var i = 0; i < localStorage.length; i++) {  
	        var key = localStorage.key(i);
	        if(key.substr(0,5) === this.localStorageSavePrefix) {
	        	saves.push(key.substr(5));
	        }
	    }
		return saves;
	}
	 
});(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var nodes = new Array();
var context = null;
var connLineWidth = 30;

$(function() {
	
	var populateLoadSelect = function() {
		var loadSelect = $('#loadSelect');
		var loadNothing = $('#loadNothing');
		var loadOkBtn = $('#loadOkBtn');
		loadSelect.empty();
		
		var saves = new SaveHandler().getAllSavesInLocalStorage();
		for(var i in saves) {
			loadSelect.append($('<option>').html(saves[i]));
		}
		if(saves.length === 0) {
			loadSelect.hide();
			loadNothing.show();
			loadOkBtn.addClass('disabled');
		} else {
			loadSelect.show();
			loadNothing.hide();
			loadOkBtn.removeClass('disabled');
		}
	}

	$('body').css('height', window.innerHeight - 40);
	$('a.brand').tooltip({placement: 'bottom'});
	$('#firstTimeChk').on('change', function() {
		if(this.checked) {
			localStorage["beenherebefore"] = 'yes';
		} else {
			localStorage.removeItem("beenherebefore");
		}
	});
	$('#pianoInfoChk').on('change', function() {
		if(this.checked) {
			localStorage["shownPianoInfo"] = 'yes';
		} else {
			localStorage.removeItem("shownPianoInfo");
		}
	});

	var addNodeFnc = function(str) {
		var sh = new SaveHandler();
		var n = sh.createNodeFromString({sn: str, i: nodes.length});
		nodes.push(n);
		return n;
	};
	
	$('ul.nodeslist > li > a').draggable({
		revert: true
	});

	$('body').droppable({
		accept: "ul.nodeslist > li > a",
		drop: function( event, ui ) {
			var t = $(ui.draggable[0]).attr('data-nodetype');
			var n = addNodeFnc(t);		
			n.el.offset({ left: event.clientX, top: event.clientY });
		}
	});

	$('ul.nodeslist > li > a').on('click', function() {
		var t = $(this).attr('data-nodetype');
		addNodeFnc(t);
	});

	try {
		context = new (window.AudioContext || window.webkitAudioContext)();
	} catch(e) {
		context = null;
	}

	document.onkeydown = function(e) {
		for(var i in nodes) {
			if(nodes[i] && nodes[i] instanceof PianoNode) {
				nodes[i].onkeydown(e);
			}
		}
	};

	document.onkeyup = function(e) {
		for(var i in nodes) {
			if(nodes[i] && nodes[i] instanceof PianoNode) {
				nodes[i].onkeyup(e);
			}
		}
	};
	
	if(context == null) {
		$('#noWebAudioBox').modal();
	} else {
		//some kind fo bug makes audio analyze not kick in if creating destination node directly
		setTimeout(function() {
			var p = getUrlParams();
			if(p.data) {
				new SaveHandler().loadSaveData(p.data);
			} else {
				nodes[0] = new SourceNode(0);
				nodes[1] = new DestinationNode(1);
				
				nodes[0].el.offset({left: 250, top: window.innerHeight/2-100});
				nodes[1].el.offset({left: window.innerWidth - 200, top: window.innerHeight/2-150});
			}
			
			if(!localStorage["beenherebefore"] && !p.data) {
				localStorage["beenherebefore"] = 'yes';
				$('#firstTimeBox').modal();
			}
			
		}, 700);

		$('#saveOkBtn').on('click', function() {
			var saveName = $('#saveTxt').val();
			if(saveName.length > 0) {
				new SaveHandler().saveToLocalStorage(saveName);
				populateLoadSelect();
				$('#saveBox').modal('hide');
			}
		});
		
		$('#saveTxt').on('keyup', function() {
			if($(this).val().length == 0) {
				$('#saveOkBtn').addClass('disabled');
			} else {
				$('#saveOkBtn').removeClass('disabled');
			}
		});

		$('#loadOkBtn').on('click', function() {
			var saveName = $('#loadSelect').val();
			new SaveHandler().loadFromLocalStorage(saveName);
			$('#saveTxt').val(saveName);
			$('#saveOkBtn').removeClass('disabled');
			$('#loadBox').modal('hide');
		});
		
		$('#shareBtn').on('click', function() {
			var shareUrl = window.location.origin + window.location.pathname + "?data=" + new SaveHandler().createSaveData();
			$('#shareLink').attr("href", shareUrl).html(shareUrl);
			$('#shareBox').modal();
		})
		populateLoadSelect();

		$(document.body).on("keypress", "select", function(event) {
			event.preventDefault();
		});
	}
}); 

function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    params[key] = value;
  });
 
  return params;
}
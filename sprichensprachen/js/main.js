$(function() {
	
	var sr = null;
	if(typeof (SpeechRecognition) === 'function') {
		sr = new SpeechRecognition();
	} else if(typeof (webkitSpeechRecognition) === 'function') {
		sr = new webkitSpeechRecognition();
	} else if(typeof (mozSpeechRecognition) === 'function') {
		sr = new mozSpeechRecognition();
	}

	if(sr != null) {	
		sr.continuous = true;
	    sr.onresult = function(event) {
	      var con = event.result[0].confidence;
	      console.log(con);
	      if(con > 0.1) {
		      var sp = $('#speakP');
		      
		      var tr = event.result[0].transcript;
		      
		      var span = $('<span>').html(tr).css('font-size', ((con+1.0)*100) + '%');
		      
		      sp.append(span);
		  } 
	    };
	    
	    sr.onend = function(event) { 
	    	sr.start();
	    };

	    sr.onstart = function(event) {
	    	console.log('start');
	    };
 	    
		sr.start();
	} else {
		$('#speakP').append($('<span>').html('You do not seem to have any Javascript Speech API enabled. Try using Chrome Canary and enable Speech JavaScript API in chrome://flags'))
	}
}); 
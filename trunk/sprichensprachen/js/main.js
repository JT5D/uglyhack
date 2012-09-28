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
	      console.log('onresult');
	      console.log(event);
	      var sp = $('#speakP');
	      
	      var tr = event.result[0].transcript;
	      var con = event.result[0].confidence;
	      var span = $('<span>').html(tr).css('font-size', ((con+1.0)*100) + '%');
	      
	      sp.append(span);
	    };
	    
	    sr.onend = function(event) { 
	    	console.log('onend'); 
	    	sr.start();
	    };
	    
		sr.start();
	} else {
		$('#speakP').append($('<span>').html('You do not seem to have any Javascript Speech API enabled. Try using Chrome Canary and enable Speech JavaScript API in chrome://flags'))
	}
}); 
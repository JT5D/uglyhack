$(function() {

	var targetLang = 'fr';

	$('#langselect').change(function() {
		console.log($('#langselect').val());
		targetLang = $('#langselect').val();
	})
	
	$('#browserLang').html('Your browser language is ' + navigator.language);
	
	var translateAndSpeak = function(speakStr, con) {
		$('#speakP').html($('<span>').html(speakStr).css('font-size', ((con+1.0)*100) + '%'));

      	$.getJSON('https://www.googleapis.com/language/translate/v2?key=AIzaSyBFbIbIAybTBKW_HWtLWtS6IDSPf-gK5Uk&source=' + 
			navigator.language.substr(0,2) + '&target=' + targetLang + '&q=' + encodeURIComponent(speakStr) + '&callback=?', function(data) {

			var transText = $("<div/>").html(data.data.translations[0].translatedText).text();
			$('#transP').html($('<span>').html(transText));

			var ifrm = document.createElement("IFRAME"); 
		    ifrm.setAttribute("src", "http://translate.google.com/translate_tts?tl=" + targetLang + "&q=" + transText.replace(/ /g, '+')); 
		    ifrm.style.width = 0+"px"; 
		    ifrm.style.height = 0 +"px"; 
		    document.body.appendChild(ifrm); 

			}).error(function() {
				var span = $('<span>').html('Could not translate ' + tr);
		  	span.css('color', 'red');
		  	$('#speakP').html(span);
		});
	} ;
	
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
		    $('#transP').html('');

		    if(con > 0.2) {
		      	var tr = event.result[0].transcript;
		      	translateAndSpeak(tr, con);

		    } else {
		   		var span = $('<span>').html('I didn\'t get that.. Confidence was ' + Math.floor(con*100) + '%');
			  	span.css('color', 'red');
			  	$('#speakP').html(span);
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
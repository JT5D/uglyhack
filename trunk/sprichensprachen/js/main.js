$(function() {

	var targetLang = 'en';

	$('#langselect').change(function() {
		console.log($('#langselect').val());
		targetLang = $('#langselect').val();
	})

	$('#browserLang').html('Your browser language is ' + navigator.language);

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
		    var sp = $('#speakP');
		    var tp = $('#transP').html('');

		    if(con > 0.2) {
			      
		      	var tr = event.result[0].transcript;
		      	sp.html($('<span>').html(tr).css('font-size', ((con+1.0)*100) + '%'));

		      	$.getJSON('https://www.googleapis.com/language/translate/v2?key=AIzaSyBFbIbIAybTBKW_HWtLWtS6IDSPf-gK5Uk&source=' + 
					navigator.language + '&target=' + targetLang + '&q=' + encodeURIComponent(tr) + '&callback=?', function(data) {

					var transText = $("<div/>").html(data.data.translations[0].translatedText).text();
					console.log(transText);
					tp.html($('<span>').html(transText));

					var as = document.getElementById("audioSrc");
					as.src = 'http://translate.google.com/translate_tts?tl=' + targetLang + '&q=' + transText.replace(/ /g, '+');
					as.load();
					as.play();

	  			}).error(function() {
	  				var span = $('<span>').html('Could not translate ' + tr);
				  	span.css('color', 'red');
				    sp.html(span);
	  			});

		    } else {
		   		var span = $('<span>').html('I didn\'t get that.. Confidence was ' + Math.floor(con*100) + '%');
			  	span.css('color', 'red');
			    sp.html(span);
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
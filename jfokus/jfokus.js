var JFokus = {
	selEventId: null,	
	speakersListLoaded: false,
	getTemplate: function(templateName) {
		if(!JFokus._compiledTemplates[templateName]) {
			JFokus._initHelpers();
			JFokus._compiledTemplates[templateName] = Handlebars.compile($(templateName).html());
		}
		return JFokus._compiledTemplates[templateName];
	},
	_initHelpers: function() {
		if(!JFokus._initedTemplates) {
			Handlebars.registerHelper('substr', function(start, end, context) {
			  return context.substring(start, end);
			});
			JFokus._initedTemplates = true;
		}
	},
	_compiledTemplates: {},
	_initedTemplates: false
}

$('#mainPage').live('pageinit', function(){
	$("#mainUl").delegate(".listUlItem", "click", function() {
		JFokus.selEventId = this.id;
		$('#daynavbar li a').removeClass('ui-btn-active');
		$('#daynavbar li:eq(0) a').addClass('ui-btn-active');
		
		getScheduleList(1, this.id);
	});
	
	getDataForTemplate({
		url: 'http://www.jfokus.se/rest/v1/events',
		ul: '#mainUl',
		template: JFokus.getTemplate('#event-template'),
	});
});

$('#schedulePage').live('pageinit', function(){
	$("#daynavbar").delegate("li", "click", function() {
		getScheduleList(this.nodeIndex, JFokus.selEventId);
	});
	
	$("#scheduleUl").delegate(".listUlItem", "click", function() {
		var presUri = $(this).find('.hiddenPresUri').html();
		if(presUri.length > 0) {
			getPresentationDetails(presUri, '#schedulePage');
		}
	});
	
	$('#speakersButton').bind('click', function() {
		if(!JFokus.speakersListLoaded) {
			getDataForTemplate({
				url: 'http://www.jfokus.se/rest/v1/events/' + JFokus.selEventId + '/speakers',
				ul: '#speakersUl',
				template: JFokus.getTemplate('#speakers-template'),
				postFnc: function(config, data) {
					$.mobile.changePage( $('#speakersPage'));
					JFokus.speakersListLoaded = true;
				},
				dataProcessFnc: function(data) {
					data.items.sort(function(a, b) {
						var diff = a.firstName.localeCompare(b.firstName);
						if(diff == 0) {
							diff = a.lastName.localeCompare(b.lastName);
						}
						return diff;
					});
				}
			});
		} else {
			$.mobile.changePage( $('#speakersPage'));
		}
	});
	
	if(JFokus.selEventId == null) {
		$.mobile.changePage( $('#mainPage'));
	}
});

$('#presentationDetailsPage').live('pageinit', function(){
	if(JFokus.selEventId == null) {
		$.mobile.changePage( $('#mainPage'));
	}
});

$('#speakersPage').live('pageinit', function(){
	if(JFokus.selEventId == null) {
		$.mobile.changePage( $('#mainPage'));
	} 
	
	$("#speakersUl").delegate(".listUlItem", "click", function() {
		getDataForTemplate({
			url: 'http://www.jfokus.se/rest/v1/events/speakers/' + this.id,
			ul: '#speakerDetailsUl',
			template: JFokus.getTemplate('#speakerDetails-template'),
			postFnc: function(config, data) {
				$.mobile.changePage( $('#speakerDetailsPage'));
			}
		});
	});
});

$('#speakerDetailsPage').live('pageinit', function(){
	if(JFokus.selEventId == null) {
		$.mobile.changePage( $('#mainPage'));
	} 
	
	$("#speakerDetailsUl").delegate(".speakerTalkLink", "click", function() {
		var presUri = $(this).find('.hiddenPresUri').html();
		getPresentationDetails(presUri, '#speakerDetailsPage');
	});
});

function getPresentationDetails(presUri, backUri) {
	getDataForTemplate({
		url: presUri,
		ul: '#presentationDetailsUl',
		template: JFokus.getTemplate('#presentationDetails-template'),
		dataProcessFnc: function(data) {
			if(data.items.tags && data.items.tags.length > 0) {
				data.items.tags[data.items.tags.length - 1].last = true;
			}
		},
		postFnc: function(config, data) {
			$.mobile.changePage( $('#presentationDetailsPage'));
			$('#presentationDetailsBackButton').attr("href", backUri)
			for(var ii in data.items.speakers) {
				getDataForTemplate({
					url: data.items.speakers[ii].speakerUri,
					ul: '#presentationSpeakerDetail',
					emptyContainer: false,
					template: JFokus.getTemplate('#presentationSpeaker-template'),
				});
			}
		}
	});
}

function getScheduleList(day, eventId) {
	getDataForTemplate({
		url: 'http://www.jfokus.se/rest/v1/events/' + eventId + '/schedule/day/' + day,
		ul: '#scheduleUl',
		template: JFokus.getTemplate('#schedule-template'),
		postFnc: function(config, data) {
			$.mobile.changePage( $('#schedulePage'));
		},
		dataProcessFnc: function(data) {
			data.items.sort(function(a, b) {
				var diff = a.fromTime.localeCompare(b.fromTime);
				if(diff == 0) {
					diff = a.room.localeCompare(b.room);
				}
				return diff;
			});
			
			for(var i = 1; i < data.items.length; i++) {
				var it = data.items[i];
				var prevIt = data.items[i-1];
				
				if(it.fromTime != prevIt.fromTime && 
				   (it.type == "CONFERENCE" || it.type == "QUICKIE") && 
				   (prevIt.type == "CONFERENCE" || prevIt.type == "QUICKIE")) {
					data.items.splice(i, 0, {
						code: 'Break'
					});
				}
			}
		}
	});
}

function getDataForTemplate(config) {
	$.mobile.showPageLoadingMsg();
	$.getJSON(getYql(config.url), function(response) { 
		if(response.query.results == null) {
			alert('Something went wrong with your request. Maybe you reached your api quota limit. It is reset every hour.');
		}
			
		var data = { items: jQuery.parseJSON(response.query.results.body.p) };
		
		if(config.dataProcessFnc != undefined) {
			config.dataProcessFnc(data);
		}
		
		var ulul = $(config.ul);
		
		if(config.emptyContainer !== false) {
			ulul.empty();
		}
		
		
		ulul.append(config.template(data));
		
		try {
			ulul.listview("refresh");
		} catch(e) {}
		
		if(config.postFnc != undefined) {
			config.postFnc(config, data);
		}
		
	}).complete(function() { 
		$.mobile.hidePageLoadingMsg(); 
	});
}

function getYql(site) {
	return 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=json&callback=?';
}


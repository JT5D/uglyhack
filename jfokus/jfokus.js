var JFokus = {
	selEventId: null,
	selDay: null,
	getSpeakerTemplate: function() {
		if(!JFokus._speakerTemplate) {
			JFokus._speakerTemplate = Handlebars.compile($('#speaker-template').html());
		}
		return JFokus._speakerTemplate;
	},
	getDetailsTemplate: function() {
		if(!JFokus._detailsTemplate) {
			JFokus._detailsTemplate = Handlebars.compile($('#details-template').html());
		}
		return JFokus._detailsTemplate;
	},
	getEventTemplate: function() {
		if(!JFokus._eventTemplate) {
			JFokus._eventTemplate = Handlebars.compile($('#event-template').html());
		}
		return JFokus._eventTemplate;
	},
	getScheduleTemplate: function() {
		if(!JFokus._scheduleTemplate) {
			Handlebars.registerHelper('substr', function(start, end, context) {
			  return context.substring(start, end);
			});
			JFokus._scheduleTemplate = Handlebars.compile($('#schedule-template').html());
		}
		return JFokus._scheduleTemplate;
	},
	_speakerTemplate: null,
	_detailsTemplate: null,
	_scheduleTemplate: null,
	_eventTemplate: null
}

$(document).ready(function() {
	JFokus.selEventId = $.jStorage.get('selEventId');
	JFokus.selDay = $.jStorage.get('selDay');

	if(!JFokus.selDay) {
		JFokus.selDay = 1;
	}
	
	var day = $('#daynavbar li:eq(' + (JFokus.selDay - 1) + ') a');
	day.addClass('ui-btn-active');

	if(JFokus.selEventId) {
		$.mobile.changePage( $('#schedulePage'));
		getScheduleList(JFokus.selDay, JFokus.selEventId);
	}
	
});

$('#mainPage').live('pageinit', function(){
	$("#mainUl").delegate(".listUlItem", "click", function() {
		$.jStorage.set('selEventId', this.id);
		JFokus.selEventId = this.id;
		
		getScheduleList(JFokus.selDay, JFokus.selEventId);
	});
	
	getDataForTemplate({
		url: 'http://www.jfokus.se/rest/v1/events',
		ul: '#mainUl',
		template: JFokus.getEventTemplate(),
	});
});

$('#schedulePage').live('pageinit', function(){
	$("#daynavbar").delegate("li", "click", function() {
		$.jStorage.set('selDay', this.nodeIndex);
		JFokus.selDay = this.nodeIndex;
		
		getScheduleList(JFokus.selDay, JFokus.selEventId);
	});
	
	$("#scheduleUl").delegate(".listUlItem", "click", function() {
		var presUri = $('#' + this.id + ' .hiddenPresUri').html();
		if(presUri.length > 0) {
			getDataForTemplate({
				url: presUri,
				ul: '#detailsUl',
				template: JFokus.getDetailsTemplate(),
				postFnc: function(config, data) {
					$.mobile.changePage( $('#detailsPage'));
					getDataForTemplate({
						url: data.items.speakerUri,
						ul: '#speakerDetail',
						template: JFokus.getSpeakerTemplate(),
					});
				}
			});
		}
	});
});

function getScheduleList(day, eventId) {
	getDataForTemplate({
		url: 'http://www.jfokus.se/rest/v1/events/' + eventId + '/schedule/day/' + day,
		ul: '#scheduleUl',
		template: JFokus.getScheduleTemplate(),
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
		}
	});
}

function getDataForTemplate(config) {
	$.mobile.showPageLoadingMsg();
	console.log(getYql(config.url));
	$.getJSON(getYql(config.url), function(response) {
		var data = { items: jQuery.parseJSON(response.query.results.body.p) };
		
		if(config.dataProcessFnc != undefined) {
			config.dataProcessFnc(data);
		}
		
		var ulul = $(config.ul);
		ulul.empty();
		
		
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


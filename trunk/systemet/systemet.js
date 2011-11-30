var articleId;

$( '#listPage' ).live( 'pageshow',function(){
	$('#listUl').listview("refresh");
});

$( '#firstPage' ).live( 'pageinit',function(){
	$.mobile.showPageLoadingMsg();
	$.getJSON("http://www.systemetapi.se/types.jsonp?callback=?", function(response) {
		var items = [];

		var sType = $('#sType');
		
		$.each(response, function(key, val) {
			items.push('<option value="' + val.type + '">' + val.type + '</option>');
		});
		
		sType.append(items.join(''));
	}).complete(function() { 
		$.mobile.hidePageLoadingMsg(); 
	});
});

$( '#searchPage' ).live( 'pageinit',function(){
	$('#doSearchButton').bind("click", function() {
		var searchString = '';
		var n = $("#sName").val();
		var t = $("#sType").val();
		var mp = $("#sMaxPrice").val();
		var mv = $("#sMaxVolume").val();
		var ob = $("#sOrderBy").val();
		var o = $("#sOrder").val();
		
		searchString += n.length > 0 ? 'name=' + n + '&' : '';
		searchString += t.length > 0 ? 'type=' + t + '&' : '';
		searchString += mp.length > 0 ? 'max_price=' + mp + '&' : '';
		searchString += mv.length > 0 ? 'max_volume=' + mv + '&' : '';
		searchString += ob.length > 0 ? 'order_by=' + ob + '&' : '';
		searchString += o.length > 0 ? 'order=' + o + '&' : '';
		
		
		$.mobile.showPageLoadingMsg();
		$.getJSON("http://www.systemetapi.se/product.jsonp?" + searchString + "callback=?", function(response) {
			var items = [];

			var listUl = $('#listUl');
			
			listUl.empty();
			
			$.each(response, function(key, val) {
				var name = val.name;
				var name2 = val.name_2;
				if(name2.length > 0) {
					name = name + ', ' + name2;
				}
				items.push('<li class="listUlItem" id=' + val.article_id + '><a>' + name + '<p>' + val.article_id + ', ' + val.price + ' kr, ' + val.alcohol_percent + ', ' + val.volume + '</p><div class="ui-li-aside"></div></a></li>');
			});
			
			listUl.append(items.join(''));

			
			
			$('.listUlItem').bind("click", function() {
				articleId = this.id;
				$.mobile.showPageLoadingMsg();
				$.getJSON("http://www.systemetapi.se/product/" + articleId + ".jsonp?callback=?", function(response) {
					var name = response[0].name;
					var name2 = response[0].name_2;
					if(name2.length > 0) {
						name = name + ', ' + name2;
					}
					
					$("#detName").val(name);
					$("#detPrice").val(response[0].price + ' kr');
					$("#detVolume").val(response[0].volume + ' liter');
					$("#detPricePerLiter").val(response[0].price_per_liter + ' kr');
					$("#detType").val(response[0].type);
					$("#detOrigin").val(response[0].origin);
					$("#detProducer").val(response[0].producer);
					$("#detYear").val(response[0].year);
					$("#detAlcoholPercent").val(response[0].alcohol_percent);
					$("#detApk").val(response[0].apk + ' ml/kr');
					$("#detEcological").val(response[0].ecological == 0 ? 'Nej' : 'Ja');
					$("#detKoscher").val(response[0].koscher == 0 ? 'Nej' : 'Ja');
					
					$.mobile.changePage( $('#detailPage') );
				}).complete(function() { 
					$.mobile.hidePageLoadingMsg(); 
				});
			});
			
			$.mobile.changePage( $('#listPage') );
			
		}).complete(function() { 
			$.mobile.hidePageLoadingMsg(); 
		});
	});
	
});

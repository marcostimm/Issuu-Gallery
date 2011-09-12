$.fn.IssuuGallery = function(options) {
	var defaults = {
		user: '',
		size: 'small',
		showDate: true,
		showTitle: true,
		textOn: 'published in ',
		dateFormat: 'm/d/y',
		colorBox: true,
		loading: 'Loading publications...',
		proxyPath: '/issuuGallery/'
	}
	var options = $.extend(defaults, options);
	var rss = 'http://search.issuu.com/'+options.user+'/docs/recent.rss';
	var obj = $(this);

	obj.html('<p class="issuu-gallery-loading">'+options.loading+'</p>');
	
	$.ajax({
		type: 'GET',
		url: options.proxyPath + '/proxy.php?url='+rss,
		dataType: 'xml',
		success: function(xml) {
			obj.html('');
			var ul = document.createElement("ul");
			ul.setAttribute('id', 'issuu-gallery');
			
			$(xml).find('item').each(function(){
				var id = $(this).find('[name="documentId"]').attr('value');
				var src = 'http://image.issuu.com/'+id+'/jpg/page_1_thumb_'+options.size+'.jpg'
				var link = $(this).find('link').text();
				
				var li = document.createElement('li');
				
				var a = document.createElement('a');
				a.setAttribute('href',link);
				a.setAttribute('class','colorbox');
				a.setAttribute('ref',id);
				a.setAttribute('title',$(this).find('description').text());

				var div = document.createElement('div');
				div.setAttribute('class','issuu-gallery-info');

				var title = document.createTextNode($(this).find('title').text()); 
				var p = document.createElement('p');
				p.appendChild(title);
				if(options.showTitle)
					div.appendChild(p);

				var d = new Date($(this).find('pubDate').text());
				if('d/m/y' == options.dateFormat)
					var date = document.createTextNode(options.textOn + d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()); 
				else
					var date = document.createTextNode(options.textOn + d.getMonth()+'/'+d.getDate()+'/'+d.getFullYear()); 

				var p2 = document.createElement('p');
				p2.setAttribute('class','issuu-gallery-date');
				p2.appendChild(date);
				if(options.showDate)
					div.appendChild(p2);

				if(options.showDate || options.showTitle)
					a.appendChild(div);

				var thumb = document.createElement('img');
				thumb.setAttribute('src', src);
				thumb.setAttribute('alt',$(this).find('title').text());

				a.appendChild(thumb);
				li.appendChild(a);
				ul.appendChild(li);

			});
			obj.append(ul);

			if(options.colorBox){
				$('.colorbox').colorbox({transition: 'none', width:"90%",height:"90%", html: function() {
						var id = $(this).attr('ref');
						return '<div style="height: 100%; width: 100%; margin: 0 auto;"><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" style="width:95%;height:95%; margin: 0 auto; text-align: center;" id="'+id+'" ><param name="movie" value="http://static.issuu.com/webembed/viewers/style1/v2/IssuuReader.swf?mode=mini&amp;shareMenuEnabled=false&amp;printButtonEnabled=false&amp;backgroundColor=%23ffffff&amp;documentId='+id+'" /><param name="allowfullscreen" value="true"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><embed src="http://static.issuu.com/webembed/viewers/style1/v2/IssuuReader.swf" type="application/x-shockwave-flash" style="width:95%;height:95%" flashvars="mode=mini&amp;shareMenuEnabled=false&amp;printButtonEnabled=false&amp;backgroundColor=%23222222&amp;documentId='+id+'" allowfullscreen="true" menu="false" wmode="transparent" /></object></div>';
					}
				});
			}
		}
	});

};
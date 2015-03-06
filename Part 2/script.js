$(document).on('ready', function() {

	var panels = $('.singleday');

	var updateView = function(state, city) {
		Weather.getForecast(state, city, function(error, data) {
			if(error) {
				return
			}
			panels.each(function(index) {
				var day = data[index];
				var ele = $(this);
				ele.find('.temperature').html(day.high.fahrenheit + "&deg;F");
				ele.find('.dayname').html(day.date.weekday);
				ele.find('.date').html(day.date.monthname + ' ' + day.date.day);
				ele.find('.conditions-img').css('background-image', 'url(http://icons.wxug.com/i/c/j/' + day.icon + '.gif)');
				ele.find('.conditions-text').html(day.conditions);
			});
		});
	};

	$(document).on('click', '.location > span', function() {
		if($(this).data('active')) {
			console.log("active");
			return;
		}
		$(this).data('active', true);
		var input = $("<input/>", {
			type : 'text',
			class: $(this).attr('class')
		})
		var value = $(this).html();
		$(this).html(input);
		input.focus().val(value).select().on('keydown', function(e) {
			if(e.which === 13) {
				$(this).blur()
			}
		});
	});

	$(document).on('blur', '.location > span > input', function() {
		$(this).parent().html($(this).val()).data('active', false);
		updateView($('.state').html(), $('.city').html());
	});
	
	// Initialize the application for the first time
	updateView($('.state').html(), $('.city').html());
});

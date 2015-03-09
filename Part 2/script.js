$(document).on('ready', function() {

	var panels = $('.singleday');
	// selects all elements with class singleday, so that panel references an array of HTML elements.

	// updateView is a wrapper function for a wrapper function for an API.
	var updateView = function(state, city) {
		Weather.getForecast(state, city, function(error, data) {
			if(error) {
				// TODO: Error handling (notify user)
				return; 
			}
			panels.each(function(index) {
				var day = data[index];
				var ele = $(this);
				/* this refers to html block:
				<div class="singleday">
	                <p class="dayname"></p>
	                <div class="date"></div>
	                <div class="conditions-img"></div>
	                <p class="conditions-text"></p>
	                <p class="temperature"></p>
            	</div>
				 */
				ele.find('.temperature').html(day.high.fahrenheit + "&deg;F");
				ele.find('.dayname').html(day.date.weekday);
				ele.find('.date').html(day.date.monthname + ' ' + day.date.day);
				ele.find('.conditions-img').css('background-image', 'url(http://icons.wxug.com/i/c/j/' + day.icon + '.gif)');
				ele.find('.conditions-text').html(day.conditions);
			});
		});
	};

	// this is where all the fancy styling happens when you click the city/state.
	$(document).on('click', '.location > span', function() {
		if($(this).data('active')) {
			console.log("active");
			return;
		}
		$(this).data('active', true);
		var input = $("<input/>", {
			type : 'text',
			class: $(this).attr('class')
		});
		var value = $(this).html();
		$(this).html(input);

		// listens for keypress "enter"
		input.focus().val(value).select().on('keydown', function(e) {
			if(e.which === 13) {
				$(this).blur();
			}
		});
	});

	// when "enter" is pressed, updateView is called --> new data fetched.
	$(document).on('blur', '.location > span > input', function() {
		$(this).parent().html($(this).val()).data('active', false);
		updateView($('.state').html(), $('.city').html());
	});
	
	// Initialize the application for the first time
	updateView($('.state').html(), $('.city').html());
});

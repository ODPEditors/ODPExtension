var toolbar, toolbar_position
	add('onLoad', function () {
		toolbar = $('.toolbar')
		toolbar_position = toolbar.offset().top
	});
$(window).scroll(function () {
	if (pageYOffset > (toolbar_position - 15)) {
		if (!toolbar.hasClass('sticky')) {
			$('body').css('paddingTop', toolbar.height())
			toolbar.addClass('sticky');
		}
	} else {
		if (toolbar.hasClass('sticky')) {
			$('body').css('paddingTop', '0')
			toolbar.removeClass('sticky');
		}
	}
});
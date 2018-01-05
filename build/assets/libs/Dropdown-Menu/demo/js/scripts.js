//animate.css jQuery plagin
$.fn.extend({
	animateCss: function (animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass('animated ' + animationName).one(animationEnd, function () {
			$(this).removeClass('animated ' + animationName);
			if (callback) {
				callback();
			}
		});
		return this;
	}
});


$('.snakeMenu').snakeMenu({
	menuCont: '.snakeMenu',
	menuItem: '.snakeMenuItem',
	menuItemData: 'menuitem',
	boxCont: '.snakeBox',
	boxItem: '.snakeBoxItem',
	boxItemData: 'boxitem',
	cssMenuItemActive: 'snm-item-active',
	destroySnakeRes: 767,
	mouseDelay: 300,
	boxOffsetTop: 0,
	boxOffsetBottom: 0,
	boxOffsetLeft: 0,
	boxOffsetRight: 0,
	noActiveMenuItem: 'no-active-sample',
	animOpen: function () {
		$('.snakeBox').slideDown(350);
	},
	animClose: function () {
		$('.snakeBox').slideUp(250);
	}
});


$('.snakeMenu2').snakeMenu({
	menuCont: '.snakeMenu2',
	mouseDelay: 250,
	noActiveMenuItem: 'no-active-sample-2',
	animOpen: function () {
		//animate.css plagin to animate menu
		$('.snakeBox').show().animateCss('slideInDown');
	},
	animClose: function () {
		//animate.css plagin to animate menu
		$('.snakeBox').animateCss('slideOutUp', function () {
			$('.snakeBox').hide();
		});
	}
});


//Approach to make menu on small devices with bootstrap menu
$('.dropdown').each(function () {
	var self = this;
	$(self).find('.dropdown-btn').on('click', function () {
		if ($(window).width() < 768) {
			$(self).toggleClass('open');
		}
	});
});

$(window).resize(function () {
	if ($(window).width() > 768) {
		$('.dropdown').each(function () {
			$('.dropdown').removeClass('open');
		});
	}
});

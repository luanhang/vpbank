
var CLASS = {
	_active: 'js-active',
	_show: 'js-show',
	_hide: 'js-hide'
};

var BODY = jQuery('body'),
	DOCUMENT = jQuery(document),
	WINDOW = jQuery(window),
	DOC_WIDTH = DOCUMENT.width(),
	DOC_HEIGHT = DOCUMENT.height(),
	WIN_WIDTH = WINDOW.width(),
	WIN_HEIGHT = WINDOW.height();

var FE = {
	init: function () {
		FE.detectDevice();
		FE.resize(FE.detectDevice);
		VP.init();
	},

	detectDevice: function () {
		function init() {
			BODY.removeClass('mobile tablet landscape desktop');
			
			navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && $('body').addClass('firefox');

			if (isLandscape()) {
				BODY.addClass('landscape');
			}
			if (isMobile()) {
				BODY.addClass('mobile');
			} else if (isTablet()) {
				BODY.addClass('tablet');
			} else {
				BODY.addClass('desktop');
			}
		}

		function isMobile() {
			if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i)) return true;
			else return false;
		}

		function isTablet() {
			if (navigator.userAgent.match(/Tablet|iPad/i)) return true;
			else return false;
		}

		function isLandscape() {
			FE.getResize();
			if (WIN_HEIGHT < WIN_WIDTH) return true;
			else return false;
		}

		init();
	},

	getResize: function () {
		WIN_WIDTH = WINDOW.width();
		WIN_HEIGHT = WINDOW.height();
		DOC_WIDTH = DOCUMENT.width();
		DOC_HEIGHT = DOCUMENT.height();
	},

	getScrollTop: function () {
		return WINDOW.scrollTop();
	},

	setScrollTop: function (posY, callback) {

		var callback = callback || function () {};

		TweenMax.to(WINDOW, 1, {
			scrollTo: {
				y: posY,
				autoKill: false
			},
			ease: Power1.easeOut,
			overwrite: 5,
			onComplete: function () {
				callback();
			}
		});
	},

	resize: function (name, timer) {
		var resizeTimer = 0;

		if (timer === undefined) {
			timer = 300;
		}

		WINDOW.on('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(name, timer);
		});
	},

	waypoint: function (options) {

		var options = jQuery.extend({
			offset: '90%',
			delay: '0s',
			animateClass: '.way-animate',
			animateGroupClass: '.way-animate-group'
		}, options);

		var initAnimate = function (items, container) {
			var containerOffset = container ? container.data('animate-offset') || options.offset : null;
			items.each(function () {
				var element = jQuery(this),
					animateClass = element.data('animate'),
					animateDelay = element.data('animate-delay') || options.delay,
					animateOffset = element.data('animate-offset') || options.offset;

				TweenMax.set(element, {
					animationDelay: animateDelay,
					alpha: 0
				});

				var trigger = container ? container : element;
				trigger.waypoint(function (direction) {
					if (direction === 'down') {
						TweenMax.set(element, {
							alpha: 1
						});
						element
							.addClass('animated')
							.addClass(animateClass);
					} else {
						TweenMax.to(element, 0.45, {
							alpha: 0,
							ease: Power0.easeOut
						});
						element
							.removeClass('animated')
							.removeClass(animateClass);
					}

				}, {
					triggerOnce: true,
					offset: containerOffset || animateOffset
				});
			});
		}

		jQuery(options.animateGroupClass).each(function (index, group) {
			var container = jQuery(group);
			var items = jQuery(group).find(options.animateClass);
			initAnimate(items, container);
		});

		jQuery(options.animateClass)
			.filter(function (index, element) {
				return jQuery(element).parents(options.animateGroupClass).length === 0;
			})
			.each(function (index, element) {
				initAnimate(jQuery(element), null);
			});
	},

	parallax: function (element) {
		var elm = jQuery(element),
			offset = elm.offset();

		jQuery(window).scroll(function () {
			var scroll = FE.getScrollTop(),
				posTop = offset.top;

			if (scroll < window.innerHeight + posTop + elm.outerHeight() || scroll > posTop) {
				var dy = (scroll / 5);
				elm.css({
					'background-position': 'center ' + dy + 'px'
				})
			}
		})
	},

	countNumber: function() {
		jQuery('.count').each(function() {
			jQuery(this).prop('Counter', 0).animate({
				Counter: jQuery(this).text()
			}, {
				duration: 800,
				easing: 'linear',
				step: function(now) {
					jQuery(this).text(Math.ceil(now).valueOf());
				}
			})
		})
	},
	
	deepLinking: function() {
		let target = window.location.hash,
			url = target.substring(1, target.length);

		if(target === '') return;

		if(url.length !== 0 && document.querySelector(target) !== null ) {
			jQuery("body, html").animate({
				scrollTop: jQuery(target).offset().top - 50
			}, 600);
		}
	},

	backToTop: function() {
		
		jQuery(window).scroll(function () {
			let elm = jQuery('#back-to-top'),
				scroll = FE.getScrollTop();
			if (scroll > WIN_HEIGHT) {
				elm.fadeIn();
			} else {
				elm.fadeOut();
			}
		})


	},
};

var VP = {
	_isFlag: true,

	init: function () {

		VP.pluginSlick();

		FE.deepLinking();

		BODY.on('mouseup touchstart', function () {
			let currentAlert = jQuery.jAlert('current');
			if(currentAlert != '') currentAlert.closeAlert();

		});
	},
	plugins: function () {
		jQuery('select').selectric({
			disableOnMobile: false,
			nativeOnMobile: false
		});
		
	},
	pluginSlick: function () {

		function init() {
			homepage();
		}

		function homepage() {
			let crs = jQuery('.crs-banner');

			jQuery(crs).not('.slick-initialized').slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				// autoplay: true,
				// autoplaySpeed: 5000,
				dots: false,
				arrows: true,
			});
			
		}

		

		init();
	},
	
};

jQuery(document).ready(function () {
	// jQuery('#loading').show();
	// BODY.addClass('no-scroll');
	// jQuery('#header, #main, #footer').addClass('opa-hide');
	FE.init();
	
});
 
jQuery(window).on('load', function() {
	// jQuery('#loading .loading-absolute').fadeOut(function() {
	// 	BODY.removeClass('no-scroll');
    //     jQuery('#header, #main, #footer').removeClass('opa-hide');
    //     jQuery('#loading').fadeOut();
	// });
	FE.deepLinking();
})
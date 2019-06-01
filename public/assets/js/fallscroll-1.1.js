'use strict';

/*!
 * nexon fallscroll v1.1.js
 * twoshlove@nexon.co.kr, Licensed MIT.
 * Copyright 2017, SUNG-HOON CHOI. All rights reserved.
 */
(function ($) {
	'use strict';

	var plugin_name = 'fallScroll';

	var Fallscroll = function Fallscroll(stage, options) {
		this.init(stage, options);
	};
	Fallscroll.fn = Fallscroll.prototype = {
		init: function init(stage, options) {
			var t, animationObject;
			function setPolyfill() {
				if (!Array.isArray) {
					Array.isArray = function (arg) {
						return Object.prototype.toString.call(arg) === '[object Array]';
					};
				}
			}
			function setSpeed() {
				var speed, html;

				speed = t.options.panelChageSpeed / 1000;
				html = '<style> #fall-scroll .fall-section.hide-prev, #fall-scroll .fall-section.hide-next, #fall-scroll .fall-section.show-prev, #fall-scroll .fall-section.show-next {transition: all ' + speed + 's; -webkit-transition: all ' + speed + 's; } </style>';
				$('head').append(html);
			}
			function setScrollStatus() {
				t.config.windowHeight = $(window).height();
				t.element.panelContents.each(function (panelIndex) {
					var panelHeight;

					panelHeight = $(this).height();
					if (t.config.windowHeight < panelHeight - 50) {
						$(t.element.panelScroll[panelIndex]).removeClass('fake-hide-scroll');
						t.config.isExistVerticalScroll[panelIndex] = true;
					} else {
						$(t.element.panelScroll[panelIndex]).addClass('fake-hide-scroll');
						t.config.isExistVerticalScroll[panelIndex] = false;
					}
				});
			}
			function setWheelEvent() {
				var isEventEnter, config;

				isEventEnter = false;
				$('body').mousewheel(function (event, delta) {

					if (isEventEnter) return false;
					isEventEnter = true;
					setTimeout(function () {
						isEventEnter = false;
					}, 300);

					config = $.extend({}, t.config, { delta: delta });
					var progress = t.options.onSectionChangeBefore(config);
					// if(progress === false) return false; // false return �� �뱀뀡 �꾪솚 以묐떒

					if (progress !== false) {
						var panelIndex = t.config.currentIndex;
						var $self = $(t.element.panelScroll[panelIndex]);
						var panelHeight, scrollEnd, scrollTop, scrollDistance, scrollTarget;

						if (!t.validate()) return false;
						if (t.config.isLockWheel) return false;
						if (!t.config.isExistVerticalScroll[panelIndex]) {
							if (delta < 0) t.gotoNext();else if (delta > 0) t.gotoPrev();
							return false;
						} else if (t.config.isExistVerticalScroll[panelIndex]) {
							if (!t.config.preventScroll) {
								t.config.preventScroll = true;
								panelHeight = $(t.element.panelContents[panelIndex]).height();
								scrollEnd = Math.floor((panelHeight - t.config.windowHeight) * 0.9999999);
								scrollTop = Math.floor($self.scrollTop());
								scrollDistance = Math.floor(t.config.windowHeight * 0.5);
								if (delta < 0) {
									if (t.config.scrollDownDelay) return false;
									scrollTarget = scrollTop + scrollDistance;
									if (Math.abs(scrollTop - scrollEnd) < 2) {
										setTimeout(function () {
											t.config.preventScroll = false;
										}, 100);
										t.gotoNext();
										return false;
									} else if (scrollTarget + scrollDistance / 2 >= scrollEnd || panelHeight / 2 < t.config.windowHeight) {
										scrollTarget = scrollEnd;
									}
								} else if (delta > 0) {
									if (t.config.scrollUpDelay) return false;
									scrollTarget = scrollTop - scrollDistance;
									if (scrollTop <= 1) {
										setTimeout(function () {
											t.config.preventScroll = false;
										}, 100);
										t.gotoPrev();
										return false;
									} else if (scrollTarget - scrollDistance / 2 <= 1 || panelHeight / 2 < t.config.windowHeight) {
										scrollTarget = 1;
									}
								}
								$self.stop(true).animate({ 'scrollTop': scrollTarget + 'px' }, 100, function () {
									if (scrollTarget == scrollEnd) {
										t.config.scrollDownDelay = true;
										setTimeout(function () {
											t.config.scrollDownDelay = false;t.config.preventScroll = false;
										}, 300);
									} else if (scrollTarget == 1) {
										t.config.scrollUpDelay = true;
										setTimeout(function () {
											t.config.scrollUpDelay = false;t.config.preventScroll = false;
										}, 300);
									}
									setTimeout(function () {
										t.config.preventScroll = false;
									}, 100);
								});
								return false;
							}
							return false;
						}
					}
				});
			}
			function setNavEvent() {
				t.element.navButtons.on('click', function (event) {
					var $self, index;

					event.preventDefault();
					$self = $(this);
					index = t.element.navButtons.index($self);
					t.goto(index);
				});
			}
			function setLayout() {
				var stageWidth, windowHeight;

				stageWidth = t.element.stage.width();
				windowHeight = $(window).height();
				t.element.stage.addClass(t.options.effect);
				t.element.fakeBoxContents.width(stageWidth + 50);
				t.element.panelContainer.each(function (panelIndex) {
					var panelInnerHeight;
					panelInnerHeight = $(t.element.panelInner[panelIndex]).find('.inner').outerHeight(true);
					panelInnerHeight = panelInnerHeight < windowHeight ? windowHeight : panelInnerHeight;

					$(this).css('height', panelInnerHeight + 'px');
				});
			}
			function setCurrentView() {
				if (t.options.hashURL) {
					var hash, i, len;

					hash = t.parseHash();
					if (Array.isArray(hash)) hash = hash[0].replace('#', '');else if (typeof hash === 'string') hash = hash.replace('#', '');else hash = t.config.hash[0];
					for (i = 0, len = t.config.hash.length; i < len; i++) {
						if (t.config.hash[i] === hash) {
							t.shortcut(i);
							return false;
						}
					}
				}
				t.shortcut(t.options.defaultIndex);
			}
			function detectTransitionEvent() {
				var e = document.createElement('detect');
				var transitions = {
					'transition': 'transitionend',
					'OTransition': 'otransitionend',
					'MSTransition': 'msTransitionEnd',
					'WebkitTransition': 'webkitTransitionEnd'
				};
				for (var k in transitions) {
					if (transitions.hasOwnProperty(k) && e.style[k] !== undefined) {
						return transitions[k];
					}
				}
				return false;
			}
			t = this;
			t.options = $.extend({}, $.fn[plugin_name].defaults, options);
			t.element = {};
			t.element.body = $('html, body');
			t.element.stage = stage;
			t.element.panel = stage.find(t.options.panel);
			t.element.panelScroll = stage.find('.fall-section-scroll');
			t.element.panelContainer = stage.find('.fall-container');
			t.element.panelContents = stage.find('.fall-contents');
			t.element.panelInner = stage.find('.fall-inner');
			t.element.panelLength = t.element.panel.length;
			t.element.nav = $('#fall-nav');
			t.element.navContents = t.element.nav.find('.fall-nav-contents');
			t.element.navButtons = t.element.nav.find('.fall-nav-group a');
			t.element.fakeBox = $('.fake-box');
			t.element.fakeBoxContents = $('.fake-box-contents');
			t.config = {};
			t.config.currentIndex = -1;
			t.config.isAnimating = false;
			t.config.preventScroll = false;
			t.config.hash = [];
			t.config.isExistVerticalScroll = [];
			t.config.scrollUpDelay = false;
			t.config.scrollDownDelay = false;
			t.element.panel.each(function (index) {
				t.config.hash[index] = this.id;
			});
			animationObject = detectTransitionEvent();
			if (animationObject) {
				t.element.body.addClass('fall-scale');
				t.animation = function (info) {
					var panels, index, direction, callback;

					panels = info.panels;
					index = info.index;
					direction = info.direction;
					callback = info.callback;
					function startAnimate() {
						var config;

						panels[0].addClass('hide-' + direction);
						panels[1].addClass('active show-' + direction);
						config = $.extend({}, t.config, { nextIndex: index });
						t.options.onSectionChangeStart(config);
						t.config.preventScroll = false;
					}
					// panels[1].one(animationObject, function(){
					// 	if(typeof callback === 'function') callback();
					// });

					setTimeout(function () {
						if (typeof callback === 'function') callback();
					}, t.options.panelChageSpeed);
					setTimeout(startAnimate, 20);
				};
			} else {
				t.element.body.removeClass('fall-scale');
				t.animation = animationLegacy || function () {
					if (typeof callback === 'function') callback();
				};
			}
			t.element.panelScroll.addClass('hide-scroll');
			setPolyfill();
			setSpeed();
			setLayout();
			setScrollStatus();
			setWheelEvent();
			setCurrentView();
			setNavEvent();
			$(window).on({
				'resize': function resize() {
					setLayout();
					setScrollStatus();
					t.element.fakeBox.css('width', $(t.element.panelContainer[t.config.currentIndex]).width() + 'px');
				},
				'hashchange': function hashchange() {
					if (!t.config.isAnimating && t.options.hashURL) setCurrentView();
				}
			});
		},
		validate: function validate(index) {
			var t;

			t = this;
			if (t.config.currentIndex === index || t.config.isAnimating) return false;
			return true;
		},
		parseHash: function parseHash() {
			var hash, i, len;

			hash = window.location.hash;
			if (hash.indexOf('?') > -1) hash = hash.split('?');
			return hash;
		},
		chageHash: function chageHash(index) {
			var t, hash;

			t = this;
			hash = t.parseHash();
			if (Array.isArray(hash)) hash = '#' + t.config.hash[index] + '?' + hash[1];else hash = '#' + t.config.hash[index];
			window.location.hash = hash;
		},
		lockWheelEvent: function lockWheelEvent() {
			var t;

			t = this;
			t.config.isLockWheel = true;
		},
		unlockWheelEvent: function unlockWheelEvent() {
			var t;

			t = this;
			t.config.isLockWheel = false;
		},
		shortcut: function shortcut(index) {
			var t, beforePanel, afterPanel, config;

			t = this;
			if (index < 0) index = 0;else if (index > t.element.panelLength - 1) index = t.element.panelLength - 1;
			if (!t.validate(index)) return false;

			t.config.currentIndex = t.config.currentIndex < 0 ? 0 : t.config.currentIndex;

			beforePanel = $(t.element.panel[t.config.currentIndex]);
			afterPanel = $(t.element.panel[index]);
			$(t.element.panelScroll[t.config.currentIndex]).animate({ 'scrollTop': 0 }, 10).addClass('hide-scroll');
			$(t.element.navButtons[t.config.currentIndex]).removeClass('active');
			$(t.element.navButtons[index]).addClass('active');
			if (t.options.hashURL) t.chageHash(index);
			t.config.isAnimating = true;
			beforePanel.removeClass('active current');
			afterPanel.addClass('active current');

			$(t.element.panelScroll[index]).removeClass('hide-scroll');
			t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');

			config = $.extend({}, t.config, { nextIndex: index });
			t.options.onInit(config);

			t.config.currentIndex = index;
			t.config.isAnimating = false;
		},
		goto: function goto(index, dir) {
			var t, direction, beforeClass, afterClass, beforePanel, afterPanel, panels, callback, config;

			t = this;
			if (index < 0) index = 0;else if (index > t.element.panelLength - 1) index = t.element.panelLength - 1;
			if (!t.validate(index)) return false;
			if (dir) direction = dir;else direction = index > t.config.currentIndex ? 'next' : 'prev';
			beforeClass = ['active', 'current', 'hide-prev', 'hide-next'];
			afterClass = ['prepare-prev', 'prepare-next', 'show-prev', 'show-next'];
			beforePanel = $(t.element.panel[t.config.currentIndex]);
			afterPanel = $(t.element.panel[index]);
			t.config.isAnimating = true;
			afterPanel.addClass('prepare-' + direction);
			$(t.element.panelScroll[t.config.currentIndex]).addClass('hide-scroll');
			t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');
			config = $.extend({}, t.config, { nextIndex: index });
			t.options.onScrollBarChangeStart(config);
			$(t.element.navButtons[t.config.currentIndex]).removeClass('active');
			$(t.element.navButtons[index]).addClass('active');
			panels = [beforePanel, afterPanel];
			callback = function callback() {
				var config;

				beforePanel.removeClass(beforeClass.join(' '));
				afterPanel.addClass('current').removeClass(afterClass.join(' '));
				$(t.element.panelScroll[t.config.currentIndex]).animate({ 'scrollTop': 0 }, 10);
				t.config.currentIndex = index;
				$(t.element.panelScroll[index]).removeClass('hide-scroll');
				t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');
				t.options.onScrollBarChangeEnd(t.config);
				if (t.options.hashURL) t.chageHash(index);
				setTimeout(function () {
					t.config.isAnimating = false;
					config = $.extend({}, t.config);
					t.options.onSectionChangeEnd(config);
				}, t.options.panelChageDelay);
			};
			t.animation({
				t: t,
				panels: panels,
				index: index,
				direction: direction,
				callback: callback
			});
		},
		gotoPrev: function gotoPrev() {
			var t, count, index;

			t = this;
			count = t.config.currentIndex - 1;
			if (t.options.loop || count >= 0) {
				index = (count + t.element.panelLength) % t.element.panelLength;
				t.goto(index, 'prev');
			}
		},
		gotoNext: function gotoNext() {
			var t, count, index;

			t = this;
			count = t.config.currentIndex + 1;
			if (t.options.loop || count < t.element.panelLength) {
				index = (count + t.element.panelLength) % t.element.panelLength;
				t.goto(index, 'next');
			}
		}
	};
	if (!$.fn[plugin_name]) {
		$.fn[plugin_name] = function (options) {
			var fs, e, o;
			fs = new Fallscroll(this, options, options.panelChageSpeed);
			return fs;
		};
		$.fn[plugin_name].defaults = {
			effect: 'slide-horizontal',
			panel: '.fall-section',
			panelChageSpeed: 500,
			panelChageDelay: 200,
			loop: true,
			hashURL: true,
			defaultIndex: 0,
			onInit: function onInit(fs) {},
			onSectionChangeBefore: function onSectionChangeBefore(fs) {},
			onSectionChangeStart: function onSectionChangeStart(fs) {},
			onSectionChangeEnd: function onSectionChangeEnd(fs) {},
			onScrollBarChangeStart: function onScrollBarChangeStart(fs) {},
			onScrollBarChangeEnd: function onScrollBarChangeEnd(fs) {}
		};
	}
})(window.jQuery);

/*! lightslider - v1.1.3 - 2015-07-18
* https://github.com/sachinchoolur/lightslider
* Copyright (c) 2015 Sachin N; Licensed MIT */
!function (a, b) {
	"use strict";
	var c = { item: 3, autoWidth: !1, slideMove: 1, slideMargin: 10, addClass: "", mode: "slide", useCSS: !0, cssEasing: "ease", easing: "linear", speed: 400, auto: !1, loop: !1, slideEndAnimation: !0, pause: 2e3, keyPress: !1, controls: !0, prevHtml: "", nextHtml: "", rtl: !1, adaptiveHeight: !1, vertical: !1, verticalHeight: 500, vThumbWidth: 100, thumbItem: 10, pager: !0, gallery: !1, galleryMargin: 5, thumbMargin: 5, currentPagerPosition: "middle", enableTouch: !0, enableDrag: !0, freeMove: !0, swipeThreshold: 40, responsive: [], onBeforeStart: function onBeforeStart(a) {}, onSliderLoad: function onSliderLoad(a) {}, onBeforeSlide: function onBeforeSlide(a, b) {}, onAfterSlide: function onAfterSlide(a, b) {}, onBeforeNextSlide: function onBeforeNextSlide(a, b) {}, onBeforePrevSlide: function onBeforePrevSlide(a, b) {} };a.fn.lightSlider = function (b) {
		if (0 === this.length) return this;if (this.length > 1) return this.each(function () {
			a(this).lightSlider(b);
		}), this;var d = {},
		    e = a.extend(!0, {}, c, b),
		    f = {},
		    g = this;d.$el = this, "fade" === e.mode && (e.vertical = !1);var h = g.children(),
		    i = a(window).width(),
		    j = null,
		    k = null,
		    l = 0,
		    m = 0,
		    n = !1,
		    o = 0,
		    p = "",
		    q = 0,
		    r = e.vertical === !0 ? "height" : "width",
		    s = e.vertical === !0 ? "margin-bottom" : "margin-right",
		    t = 0,
		    u = 0,
		    v = 0,
		    w = 0,
		    x = null,
		    y = "ontouchstart" in document.documentElement,
		    z = {};return z.chbreakpoint = function () {
			if (i = a(window).width(), e.responsive.length) {
				var b;if (e.autoWidth === !1 && (b = e.item), i < e.responsive[0].breakpoint) for (var c = 0; c < e.responsive.length; c++) {
					i < e.responsive[c].breakpoint && (j = e.responsive[c].breakpoint, k = e.responsive[c]);
				}if ("undefined" != typeof k && null !== k) for (var d in k.settings) {
					k.settings.hasOwnProperty(d) && (("undefined" == typeof f[d] || null === f[d]) && (f[d] = e[d]), e[d] = k.settings[d]);
				}if (!a.isEmptyObject(f) && i > e.responsive[0].breakpoint) for (var g in f) {
					f.hasOwnProperty(g) && (e[g] = f[g]);
				}e.autoWidth === !1 && t > 0 && v > 0 && b !== e.item && (q = Math.round(t / ((v + e.slideMargin) * e.slideMove)));
			}
		}, z.calSW = function () {
			e.autoWidth === !1 && (v = (o - (e.item * e.slideMargin - e.slideMargin)) / e.item);
		}, z.calWidth = function (a) {
			var b = a === !0 ? p.find(".lslide").length : h.length;if (e.autoWidth === !1) m = b * (v + e.slideMargin);else {
				m = 0;for (var c = 0; b > c; c++) {
					m += parseInt(h.eq(c).width()) + e.slideMargin;
				}
			}return m;
		}, d = { doCss: function doCss() {
				var a = function a() {
					for (var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"], b = document.documentElement, c = 0; c < a.length; c++) {
						if (a[c] in b.style) return !0;
					}
				};return e.useCSS && a() ? !0 : !1;
			}, keyPress: function keyPress() {
				e.keyPress && a(document).on("keyup.lightslider", function (b) {
					a(":focus").is("input, textarea") || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, 37 === b.keyCode ? (g.goToPrevSlide(), clearInterval(x)) : 39 === b.keyCode && (g.goToNextSlide(), clearInterval(x)));
				});
			}, controls: function controls() {
				e.controls && (g.after('<div class="lSAction"><a class="lSPrev">' + e.prevHtml + '</a><a class="lSNext">' + e.nextHtml + "</a></div>"), e.autoWidth ? z.calWidth(!1) < o && p.find(".lSAction").hide() : l <= e.item && p.find(".lSAction").hide(), p.find(".lSAction a").on("click", function (b) {
					return b.preventDefault ? b.preventDefault() : b.returnValue = !1, "lSPrev" === a(this).attr("class") ? g.goToPrevSlide() : g.goToNextSlide(), clearInterval(x), !1;
				}));
			}, initialStyle: function initialStyle() {
				var a = this;"fade" === e.mode && (e.autoWidth = !1, e.slideEndAnimation = !1), e.auto && (e.slideEndAnimation = !1), e.autoWidth && (e.slideMove = 1, e.item = 1), e.loop && (e.slideMove = 1, e.freeMove = !1), e.onBeforeStart.call(this, g), z.chbreakpoint(), g.addClass("lightSlider").wrap('<div class="lSSlideOuter ' + e.addClass + '"><div class="lSSlideWrapper"></div></div>'), p = g.parent(".lSSlideWrapper"), e.rtl === !0 && p.parent().addClass("lSrtl"), e.vertical ? (p.parent().addClass("vertical"), o = e.verticalHeight, p.css("height", o + "px")) : o = g.outerWidth(), h.addClass("lslide"), e.loop === !0 && "slide" === e.mode && (z.calSW(), z.clone = function () {
					if (z.calWidth(!0) > o) {
						for (var b = 0, c = 0, d = 0; d < h.length && (b += parseInt(g.find(".lslide").eq(d).width()) + e.slideMargin, c++, !(b >= o + e.slideMargin)); d++) {}var f = e.autoWidth === !0 ? c : e.item;if (f < g.find(".clone.left").length) for (var i = 0; i < g.find(".clone.left").length - f; i++) {
							h.eq(i).remove();
						}if (f < g.find(".clone.right").length) for (var j = h.length - 1; j > h.length - 1 - g.find(".clone.right").length; j--) {
							q--, h.eq(j).remove();
						}for (var k = g.find(".clone.right").length; f > k; k++) {
							g.find(".lslide").eq(k).clone().removeClass("lslide").addClass("clone right").appendTo(g), q++;
						}for (var l = g.find(".lslide").length - g.find(".clone.left").length; l > g.find(".lslide").length - f; l--) {
							g.find(".lslide").eq(l - 1).clone().removeClass("lslide").addClass("clone left").prependTo(g);
						}h = g.children();
					} else h.hasClass("clone") && (g.find(".clone").remove(), a.move(g, 0));
				}, z.clone()), z.sSW = function () {
					l = h.length, e.rtl === !0 && e.vertical === !1 && (s = "margin-left"), e.autoWidth === !1 && h.css(r, v + "px"), h.css(s, e.slideMargin + "px"), m = z.calWidth(!1), g.css(r, m + "px"), e.loop === !0 && "slide" === e.mode && n === !1 && (q = g.find(".clone.left").length);
				}, z.calL = function () {
					h = g.children(), l = h.length;
				}, this.doCss() && p.addClass("usingCss"), z.calL(), "slide" === e.mode ? (z.calSW(), z.sSW(), e.loop === !0 && (t = a.slideValue(), this.move(g, t)), e.vertical === !1 && this.setHeight(g, !1)) : (this.setHeight(g, !0), g.addClass("lSFade"), this.doCss() || (h.fadeOut(0), h.eq(q).fadeIn(0))), e.loop === !0 && "slide" === e.mode ? h.eq(q).addClass("active") : h.first().addClass("active");
			}, pager: function pager() {
				var a = this;if (z.createPager = function () {
					w = (o - (e.thumbItem * e.thumbMargin - e.thumbMargin)) / e.thumbItem;var b = p.find(".lslide"),
					    c = p.find(".lslide").length,
					    d = 0,
					    f = "",
					    h = 0;for (d = 0; c > d; d++) {
						"slide" === e.mode && (e.autoWidth ? h += (parseInt(b.eq(d).width()) + e.slideMargin) * e.slideMove : h = d * (v + e.slideMargin) * e.slideMove);var i = b.eq(d * e.slideMove).attr("data-thumb");if (f += e.gallery === !0 ? '<li style="width:100%;' + r + ":" + w + "px;" + s + ":" + e.thumbMargin + 'px"><a href="#"><img src="' + i + '" /></a></li>' : '<li><a href="#">' + (d + 1) + "</a></li>", "slide" === e.mode && h >= m - o - e.slideMargin) {
							d += 1;var j = 2;e.autoWidth && (f += '<li><a href="#">' + (d + 1) + "</a></li>", j = 1), j > d ? (f = null, p.parent().addClass("noPager")) : p.parent().removeClass("noPager");break;
						}
					}var k = p.parent();k.find(".lSPager").html(f), e.gallery === !0 && (e.vertical === !0 && k.find(".lSPager").css("width", e.vThumbWidth + "px"), u = d * (e.thumbMargin + w) + .5, k.find(".lSPager").css({ property: u + "px", "transition-duration": e.speed + "ms" }), e.vertical === !0 && p.parent().css("padding-right", e.vThumbWidth + e.galleryMargin + "px"), k.find(".lSPager").css(r, u + "px"));var l = k.find(".lSPager").find("li");l.first().addClass("active"), l.on("click", function () {
						return e.loop === !0 && "slide" === e.mode ? q += l.index(this) - k.find(".lSPager").find("li.active").index() : q = l.index(this), g.mode(!1), e.gallery === !0 && a.slideThumb(), clearInterval(x), !1;
					});
				}, e.pager) {
					var b = "lSpg";e.gallery && (b = "lSGallery"), p.after('<ul class="lSPager ' + b + '"></ul>');var c = e.vertical ? "margin-left" : "margin-top";p.parent().find(".lSPager").css(c, e.galleryMargin + "px"), z.createPager();
				}setTimeout(function () {
					z.init();
				}, 0);
			}, setHeight: function setHeight(a, b) {
				var c = null,
				    d = this;c = e.loop ? a.children(".lslide ").first() : a.children().first();var f = function f() {
					var d = c.outerHeight(),
					    e = 0,
					    f = d;b && (d = 0, e = 100 * f / o), a.css({ height: d + "px", "padding-bottom": e + "%" });
				};f(), c.find("img").length ? c.find("img")[0].complete ? (f(), x || d.auto()) : c.find("img").load(function () {
					setTimeout(function () {
						f(), x || d.auto();
					}, 100);
				}) : x || d.auto();
			}, active: function active(a, b) {
				this.doCss() && "fade" === e.mode && p.addClass("on");var c = 0;if (q * e.slideMove < l) {
					a.removeClass("active"), this.doCss() || "fade" !== e.mode || b !== !1 || a.fadeOut(e.speed), c = b === !0 ? q : q * e.slideMove;var d, f;b === !0 && (d = a.length, f = d - 1, c + 1 >= d && (c = f)), e.loop === !0 && "slide" === e.mode && (c = b === !0 ? q - g.find(".clone.left").length : q * e.slideMove, b === !0 && (d = a.length, f = d - 1, c + 1 === d ? c = f : c + 1 > d && (c = 0))), this.doCss() || "fade" !== e.mode || b !== !1 || a.eq(c).fadeIn(e.speed), a.eq(c).addClass("active");
				} else a.removeClass("active"), a.eq(a.length - 1).addClass("active"), this.doCss() || "fade" !== e.mode || b !== !1 || (a.fadeOut(e.speed), a.eq(c).fadeIn(e.speed));
			}, move: function move(a, b) {
				e.rtl === !0 && (b = -b), this.doCss() ? a.css(e.vertical === !0 ? { transform: "translate3d(0px, " + -b + "px, 0px)", "-webkit-transform": "translate3d(0px, " + -b + "px, 0px)" } : { transform: "translate3d(" + -b + "px, 0px, 0px)", "-webkit-transform": "translate3d(" + -b + "px, 0px, 0px)" }) : e.vertical === !0 ? a.css("position", "relative").animate({ top: -b + "px" }, e.speed, e.easing) : a.css("position", "relative").animate({ left: -b + "px" }, e.speed, e.easing);var c = p.parent().find(".lSPager").find("li");this.active(c, !0);
			}, fade: function fade() {
				this.active(h, !1);var a = p.parent().find(".lSPager").find("li");this.active(a, !0);
			}, slide: function slide() {
				var a = this;z.calSlide = function () {
					m > o && (t = a.slideValue(), a.active(h, !1), t > m - o - e.slideMargin ? t = m - o - e.slideMargin : 0 > t && (t = 0), a.move(g, t), e.loop === !0 && "slide" === e.mode && (q >= l - g.find(".clone.left").length / e.slideMove && a.resetSlide(g.find(".clone.left").length), 0 === q && a.resetSlide(p.find(".lslide").length)));
				}, z.calSlide();
			}, resetSlide: function resetSlide(a) {
				var b = this;p.find(".lSAction a").addClass("disabled"), setTimeout(function () {
					q = a, p.css("transition-duration", "0ms"), t = b.slideValue(), b.active(h, !1), d.move(g, t), setTimeout(function () {
						p.css("transition-duration", e.speed + "ms"), p.find(".lSAction a").removeClass("disabled");
					}, 50);
				}, e.speed + 100);
			}, slideValue: function slideValue() {
				var a = 0;if (e.autoWidth === !1) a = q * (v + e.slideMargin) * e.slideMove;else {
					a = 0;for (var b = 0; q > b; b++) {
						a += parseInt(h.eq(b).width()) + e.slideMargin;
					}
				}return a;
			}, slideThumb: function slideThumb() {
				var a;switch (e.currentPagerPosition) {case "left":
						a = 0;break;case "middle":
						a = o / 2 - w / 2;break;case "right":
						a = o - w;}var b = q - g.find(".clone.left").length,
				    c = p.parent().find(".lSPager");"slide" === e.mode && e.loop === !0 && (b >= c.children().length ? b = 0 : 0 > b && (b = c.children().length));var d = b * (w + e.thumbMargin) - a;d + o > u && (d = u - o - e.thumbMargin), 0 > d && (d = 0), this.move(c, d);
			}, auto: function auto() {
				e.auto && (x = setInterval(function () {
					g.goToNextSlide();
				}, e.pause));
			}, touchMove: function touchMove(a, b) {
				if (p.css("transition-duration", "0ms"), "slide" === e.mode) {
					var c = a - b,
					    d = t - c;if (d >= m - o - e.slideMargin) {
						if (e.freeMove === !1) d = m - o - e.slideMargin;else {
							var f = m - o - e.slideMargin;d = f + (d - f) / 5;
						}
					} else 0 > d && (e.freeMove === !1 ? d = 0 : d /= 5);this.move(g, d);
				}
			}, touchEnd: function touchEnd(a) {
				if (p.css("transition-duration", e.speed + "ms"), clearInterval(x), "slide" === e.mode) {
					var b = !1,
					    c = !0;t -= a, t > m - o - e.slideMargin ? (t = m - o - e.slideMargin, e.autoWidth === !1 && (b = !0)) : 0 > t && (t = 0);var d = function d(a) {
						var c = 0;if (b || a && (c = 1), e.autoWidth) for (var d = 0, f = 0; f < h.length && (d += parseInt(h.eq(f).width()) + e.slideMargin, q = f + c, !(d >= t)); f++) {} else {
							var g = t / ((v + e.slideMargin) * e.slideMove);q = parseInt(g) + c, t >= m - o - e.slideMargin && g % 1 !== 0 && q++;
						}
					};a >= e.swipeThreshold ? (d(!1), c = !1) : a <= -e.swipeThreshold && (d(!0), c = !1), g.mode(c), this.slideThumb();
				} else a >= e.swipeThreshold ? g.goToPrevSlide() : a <= -e.swipeThreshold && g.goToNextSlide();
			}, enableDrag: function enableDrag() {
				var b = this;if (!y) {
					var c = 0,
					    d = 0,
					    f = !1;p.find(".lightSlider").addClass("lsGrab"), p.on("mousedown", function (b) {
						return o > m && 0 !== m ? !1 : void ("lSPrev" !== a(b.target).attr("class") && "lSNext" !== a(b.target).attr("class") && (c = e.vertical === !0 ? b.pageY : b.pageX, f = !0, b.preventDefault ? b.preventDefault() : b.returnValue = !1, p.scrollLeft += 1, p.scrollLeft -= 1, p.find(".lightSlider").removeClass("lsGrab").addClass("lsGrabbing"), clearInterval(x)));
					}), a(window).on("mousemove", function (a) {
						f && (d = e.vertical === !0 ? a.pageY : a.pageX, b.touchMove(d, c));
					}), a(window).on("mouseup", function (g) {
						if (f) {
							p.find(".lightSlider").removeClass("lsGrabbing").addClass("lsGrab"), f = !1, d = e.vertical === !0 ? g.pageY : g.pageX;var h = d - c;Math.abs(h) >= e.swipeThreshold && a(window).on("click.ls", function (b) {
								b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopImmediatePropagation(), b.stopPropagation(), a(window).off("click.ls");
							}), b.touchEnd(h);
						}
					});
				}
			}, enableTouch: function enableTouch() {
				var a = this;if (y) {
					var b = {},
					    c = {};p.on("touchstart", function (a) {
						c = a.originalEvent.targetTouches[0], b.pageX = a.originalEvent.targetTouches[0].pageX, b.pageY = a.originalEvent.targetTouches[0].pageY, clearInterval(x);
					}), p.on("touchmove", function (d) {
						if (o > m && 0 !== m) return !1;var f = d.originalEvent;c = f.targetTouches[0];var g = Math.abs(c.pageX - b.pageX),
						    h = Math.abs(c.pageY - b.pageY);e.vertical === !0 ? (3 * h > g && d.preventDefault(), a.touchMove(c.pageY, b.pageY)) : (3 * g > h && d.preventDefault(), a.touchMove(c.pageX, b.pageX));
					}), p.on("touchend", function () {
						if (o > m && 0 !== m) return !1;var d;d = e.vertical === !0 ? c.pageY - b.pageY : c.pageX - b.pageX, a.touchEnd(d);
					});
				}
			}, build: function build() {
				var a = this;a.initialStyle(), this.doCss() && (e.enableTouch === !0 && a.enableTouch(), e.enableDrag === !0 && a.enableDrag()), a.pager(), a.controls(), a.keyPress();
			} }, d.build(), z.init = function () {
			z.chbreakpoint(), e.vertical === !0 ? (o = e.item > 1 ? e.verticalHeight : h.outerHeight(), p.css("height", o + "px")) : o = p.outerWidth(), e.loop === !0 && "slide" === e.mode && z.clone(), z.calL(), "slide" === e.mode && g.removeClass("lSSlide"), "slide" === e.mode && (z.calSW(), z.sSW()), setTimeout(function () {
				"slide" === e.mode && g.addClass("lSSlide");
			}, 1e3), e.pager && z.createPager(), e.adaptiveHeight === !0 && e.vertical === !1 && g.css("height", h.eq(q).outerHeight(!0)), e.adaptiveHeight === !1 && ("slide" === e.mode ? e.vertical === !1 ? d.setHeight(g, !1) : d.auto() : d.setHeight(g, !0)), e.gallery === !0 && d.slideThumb(), "slide" === e.mode && d.slide(), e.autoWidth === !1 ? h.length <= e.item ? p.find(".lSAction").hide() : p.find(".lSAction").show() : z.calWidth(!1) < o && 0 !== m ? p.find(".lSAction").hide() : p.find(".lSAction").show();
		}, g.goToPrevSlide = function () {
			if (q > 0) e.onBeforePrevSlide.call(this, g, q), q--, g.mode(!1), e.gallery === !0 && d.slideThumb();else if (e.loop === !0) {
				if (e.onBeforePrevSlide.call(this, g, q), "fade" === e.mode) {
					var a = l - 1;q = parseInt(a / e.slideMove);
				}g.mode(!1), e.gallery === !0 && d.slideThumb();
			} else e.slideEndAnimation === !0 && (g.addClass("leftEnd"), setTimeout(function () {
				g.removeClass("leftEnd");
			}, 400));
		}, g.goToNextSlide = function () {
			var a = !0;if ("slide" === e.mode) {
				var b = d.slideValue();a = b < m - o - e.slideMargin;
			}q * e.slideMove < l - e.slideMove && a ? (e.onBeforeNextSlide.call(this, g, q), q++, g.mode(!1), e.gallery === !0 && d.slideThumb()) : e.loop === !0 ? (e.onBeforeNextSlide.call(this, g, q), q = 0, g.mode(!1), e.gallery === !0 && d.slideThumb()) : e.slideEndAnimation === !0 && (g.addClass("rightEnd"), setTimeout(function () {
				g.removeClass("rightEnd");
			}, 400));
		}, g.mode = function (a) {
			e.adaptiveHeight === !0 && e.vertical === !1 && g.css("height", h.eq(q).outerHeight(!0)), n === !1 && ("slide" === e.mode ? d.doCss() && (g.addClass("lSSlide"), "" !== e.speed && p.css("transition-duration", e.speed + "ms"), "" !== e.cssEasing && p.css("transition-timing-function", e.cssEasing)) : d.doCss() && ("" !== e.speed && g.css("transition-duration", e.speed + "ms"), "" !== e.cssEasing && g.css("transition-timing-function", e.cssEasing))), a || e.onBeforeSlide.call(this, g, q), "slide" === e.mode ? d.slide() : d.fade(), setTimeout(function () {
				a || e.onAfterSlide.call(this, g, q);
			}, e.speed), n = !0;
		}, g.play = function () {
			clearInterval(x), g.goToNextSlide(), x = setInterval(function () {
				g.goToNextSlide();
			}, e.pause);
		}, g.pause = function () {
			clearInterval(x);
		}, g.refresh = function () {
			z.init();
		}, g.getCurrentSlideCount = function () {
			var a = q;if (e.loop) {
				var b = p.find(".lslide").length,
				    c = g.find(".clone.left").length;a = c - 1 >= q ? b + (q - c) : q >= b + c ? q - b - c : q - c;
			}return a + 1;
		}, g.getTotalSlideCount = function () {
			return p.find(".lslide").length;
		}, g.goToSlide = function (a) {
			q = e.loop ? a + g.find(".clone.left").length - 1 : a, g.mode(!1), e.gallery === !0 && d.slideThumb();
		}, setTimeout(function () {
			e.onSliderLoad.call(this, g);
		}, 10), a(window).on("resize orientationchange", function (a) {
			setTimeout(function () {
				a.preventDefault ? a.preventDefault() : a.returnValue = !1, z.init();
			}, 200);
		}), this;
	};
}(jQuery);
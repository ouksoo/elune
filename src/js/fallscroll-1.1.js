/*!
 * nexon fallscroll v1.1.js
 * twoshlove@nexon.co.kr, Licensed MIT.
 * Copyright 2017, SUNG-HOON CHOI. All rights reserved.
 */
(function($){
	'use strict';

	var plugin_name = 'fallScroll';

	var Fallscroll = function(stage, options){
		this.init(stage, options);
	};
	Fallscroll.fn = Fallscroll.prototype = {
		init : function(stage, options){
			var t, animationObject;
			function setPolyfill(){
				if(!Array.isArray){
					Array.isArray = function(arg){
						return Object.prototype.toString.call(arg) === '[object Array]';
					}
				}
			}
			function setSpeed(){
				var speed, html;

				speed = t.options.panelChageSpeed / 1000;
				html = '<style> #fall-scroll .fall-section.hide-prev, #fall-scroll .fall-section.hide-next, #fall-scroll .fall-section.show-prev, #fall-scroll .fall-section.show-next {transition: all ' + speed + 's; -webkit-transition: all ' + speed + 's; } </style>';
				$('head').append(html);
			}
			function setScrollStatus(){
				t.config.windowHeight = $(window).height();
				t.element.panelContents.each(function(panelIndex){
					var panelHeight;

					panelHeight = $(this).height();
					if(t.config.windowHeight < panelHeight - 50){
						$(t.element.panelScroll[panelIndex]).removeClass('fake-hide-scroll');
						t.config.isExistVerticalScroll[panelIndex] = true;
					}else{
						$(t.element.panelScroll[panelIndex]).addClass('fake-hide-scroll');
						t.config.isExistVerticalScroll[panelIndex] = false;
					}
				});
			}
			function setWheelEvent(){
				var isEventEnter, config;

				isEventEnter = false;
				$('body').mousewheel(function(event, delta){

					if(isEventEnter) return false;
					isEventEnter = true;
					setTimeout(function(){isEventEnter = false;}, 300);

					config = $.extend({}, t.config, {delta : delta});
					var progress = t.options.onSectionChangeBefore(config);
					// if(progress === false) return false; // false return �� �뱀뀡 �꾪솚 以묐떒

					if(progress !== false){
						var panelIndex = t.config.currentIndex;
						var $self = $(t.element.panelScroll[panelIndex]);
						var panelHeight, scrollEnd, scrollTop, scrollDistance, scrollTarget;

						if(!t.validate()) return false;
						if(t.config.isLockWheel) return false;
						if(!t.config.isExistVerticalScroll[panelIndex]){
							if(delta < 0) t.gotoNext();
							else if(delta > 0) t.gotoPrev();
							return false;
						}else if(t.config.isExistVerticalScroll[panelIndex]){
							if(!t.config.preventScroll){
								t.config.preventScroll = true;
								panelHeight = $(t.element.panelContents[panelIndex]).height();
								scrollEnd = Math.floor((panelHeight - t.config.windowHeight) * 0.9999999);
								scrollTop = Math.floor($self.scrollTop());
								scrollDistance =  Math.floor(t.config.windowHeight * 0.5);
								if(delta < 0){
									if(t.config.scrollDownDelay) return false;
									scrollTarget = scrollTop + scrollDistance;
									if(Math.abs(scrollTop - scrollEnd) < 2){
										setTimeout(function(){t.config.preventScroll = false;}, 100);
										t.gotoNext();
										return false;
									}else if(scrollTarget + scrollDistance / 2 >= scrollEnd || panelHeight / 2 < t.config.windowHeight){
										scrollTarget = scrollEnd;
									}
								}else if(delta > 0){
									if(t.config.scrollUpDelay) return false;
									scrollTarget = scrollTop - scrollDistance;
									if(scrollTop <= 1){
										setTimeout(function(){t.config.preventScroll = false;}, 100);
										t.gotoPrev();
										return false;
									}else if(scrollTarget - scrollDistance / 2 <= 1 || panelHeight / 2 < t.config.windowHeight){
										scrollTarget = 1;
									}
								}
								$self.stop(true).animate({ 'scrollTop': scrollTarget + 'px' }, 100, function(){
									if(scrollTarget == scrollEnd){
										t.config.scrollDownDelay = true;
										setTimeout(function(){t.config.scrollDownDelay = false;t.config.preventScroll = false;}, 300);
									}else if(scrollTarget == 1){
										t.config.scrollUpDelay = true;
										setTimeout(function(){t.config.scrollUpDelay = false;t.config.preventScroll = false;}, 300);
									}
									setTimeout(function(){t.config.preventScroll = false;}, 100);
								});
								return false;
							}
							return false;
						}
					}
				});
			}
			function setNavEvent(){
				t.element.navButtons.on('click', function(event){
					var $self, index;

					event.preventDefault();
					$self = $(this);
					index = t.element.navButtons.index($self);
					t.goto(index);
				});
			}
			function setLayout(){
				var stageWidth, windowHeight;

				stageWidth = t.element.stage.width();
				windowHeight = $(window).height();
				t.element.stage.addClass(t.options.effect);
				t.element.fakeBoxContents.width(stageWidth + 50);
				t.element.panelContainer.each(function(panelIndex){
					var panelInnerHeight;
					panelInnerHeight = $(t.element.panelInner[panelIndex]).find('.inner').outerHeight(true);
                    panelInnerHeight = panelInnerHeight < windowHeight ? windowHeight : panelInnerHeight;

					$(this).css('height', panelInnerHeight + 'px');
				});
			}
			function setCurrentView(){
				if(t.options.hashURL){
					var hash,
						i, len;

					hash = t.parseHash();
					if(Array.isArray(hash)) hash = hash[0].replace('#', '');
					else if(typeof hash === 'string') hash = hash.replace('#', '');
					else hash = t.config.hash[0];
					for(i = 0, len = t.config.hash.length; i < len; i++){
						if(t.config.hash[i] === hash){
							t.shortcut(i);
							return false;
						}
					}
				}
				t.shortcut(t.options.defaultIndex);
			}
			function detectTransitionEvent(){
				var e = document.createElement('detect');
				var transitions = {
					'transition' : 'transitionend',
					'OTransition' : 'otransitionend',
					'MSTransition' : 'msTransitionEnd',
					'WebkitTransition' : 'webkitTransitionEnd'
				};
				for(var k in transitions){
					if(transitions.hasOwnProperty(k) && e.style[k] !== undefined){
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
			t.element.panel.each(function(index){
				t.config.hash[index] = this.id;
			});
			animationObject = detectTransitionEvent();
			if(animationObject){
				t.element.body.addClass('fall-scale');
				t.animation = function(info){
					var panels, index, direction, callback;

					panels = info.panels;
					index = info.index;
					direction = info.direction;
					callback = info.callback;
					function startAnimate(){
						var config;

						panels[0].addClass('hide-' + direction);
						panels[1].addClass('active show-' + direction);
						config = $.extend({}, t.config, {nextIndex : index});
						t.options.onSectionChangeStart(config);
						t.config.preventScroll = false;
					}
					// panels[1].one(animationObject, function(){
					// 	if(typeof callback === 'function') callback();
					// });

					setTimeout(function(){
						if(typeof callback === 'function') callback();
					}, t.options.panelChageSpeed);
					setTimeout(startAnimate, 20);
				};
			}else{
				t.element.body.removeClass('fall-scale');
				t.animation = animationLegacy || function(){
					if(typeof callback === 'function') callback();
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
				'resize' : function(){
					setLayout();
					setScrollStatus();
					t.element.fakeBox.css('width', $(t.element.panelContainer[t.config.currentIndex]).width() + 'px');
				},
				'hashchange' : function(){
					if(!t.config.isAnimating && t.options.hashURL) setCurrentView();
				}
			});
		},
		validate : function(index){
			var t;

			t = this;
			if(t.config.currentIndex === index || t.config.isAnimating) return false;
			return true;
		},
		parseHash : function(){
			var hash,
				i, len;

			hash = window.location.hash;
			if(hash.indexOf('?') > -1) hash = hash.split('?');
			return hash;
		},
		chageHash : function(index){
			var t, hash;

			t = this;
			hash = t.parseHash();
			if(Array.isArray(hash)) hash = '#' + t.config.hash[index] + '?' + hash[1];
			else hash = '#' + t.config.hash[index];
			window.location.hash = hash;
		},
		lockWheelEvent : function(){
			var t;

			t = this;
			t.config.isLockWheel = true;
		},
		unlockWheelEvent : function(){
			var t;

			t = this;
			t.config.isLockWheel = false;
		},
		shortcut : function(index){
			var t,
				beforePanel, afterPanel,
				config;

			t = this;
			if(index < 0) index = 0;
			else if(index > t.element.panelLength - 1) index = t.element.panelLength - 1;
			if(!t.validate(index)) return false;

			t.config.currentIndex = t.config.currentIndex < 0 ? 0 : t.config.currentIndex;

			beforePanel = $(t.element.panel[t.config.currentIndex]);
			afterPanel = $(t.element.panel[index]);
			$(t.element.panelScroll[t.config.currentIndex]).animate({'scrollTop' : 0}, 10).addClass('hide-scroll');
			$(t.element.navButtons[t.config.currentIndex]).removeClass('active');
			$(t.element.navButtons[index]).addClass('active');
			if(t.options.hashURL) t.chageHash(index);
			t.config.isAnimating = true;
			beforePanel.removeClass('active current');
			afterPanel.addClass('active current');

			$(t.element.panelScroll[index]).removeClass('hide-scroll');
			t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');

			config = $.extend({}, t.config, {nextIndex : index});
			t.options.onInit(config);

			t.config.currentIndex = index;
			t.config.isAnimating = false;
		},
		goto : function(index, dir){
			var t, direction,
				beforeClass, afterClass,
				beforePanel, afterPanel,
				panels, callback,
				config;

			t = this;
			if(index < 0) index = 0;
			else if(index > t.element.panelLength - 1) index = t.element.panelLength - 1;
			if(!t.validate(index)) return false;
			if(dir) direction = dir;
			else direction = index > t.config.currentIndex ? 'next' : 'prev';
			beforeClass = ['active', 'current', 'hide-prev', 'hide-next'];
			afterClass = ['prepare-prev', 'prepare-next', 'show-prev', 'show-next'];
			beforePanel = $(t.element.panel[t.config.currentIndex]);
			afterPanel = $(t.element.panel[index]);
			t.config.isAnimating = true;
			afterPanel.addClass('prepare-' + direction);
			$(t.element.panelScroll[t.config.currentIndex]).addClass('hide-scroll');
			t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');
			config = $.extend({}, t.config, {nextIndex : index});
			t.options.onScrollBarChangeStart(config);
			$(t.element.navButtons[t.config.currentIndex]).removeClass('active');
			$(t.element.navButtons[index]).addClass('active');
			panels = [beforePanel, afterPanel];
			callback = function(){
				var config;

				beforePanel.removeClass(beforeClass.join(' '));
				afterPanel.addClass('current').removeClass(afterClass.join(' '));
				$(t.element.panelScroll[t.config.currentIndex]).animate({'scrollTop' : 0}, 10);
				t.config.currentIndex = index;
				$(t.element.panelScroll[index]).removeClass('hide-scroll');
				t.element.fakeBox.css('width', $(t.element.panelContainer[index]).width() + 'px');
				t.options.onScrollBarChangeEnd(t.config);
				if(t.options.hashURL) t.chageHash(index);
				setTimeout(function(){
					t.config.isAnimating = false;
					config = $.extend({}, t.config);
					t.options.onSectionChangeEnd(config);
				}, t.options.panelChageDelay);
			};
			t.animation({
				t : t,
				panels : panels,
				index : index,
				direction : direction,
				callback : callback
			});
		},
		gotoPrev : function(){
			var t, count, index;

			t = this;
			count = t.config.currentIndex - 1;
			if(t.options.loop || count >= 0){
				index = (count + t.element.panelLength) % t.element.panelLength;
				t.goto(index, 'prev');
			}
		},
		gotoNext : function(){
			var t, count, index;

			t = this;
			count = t.config.currentIndex + 1;
			if(t.options.loop || count < t.element.panelLength){
				index = (count + t.element.panelLength) % t.element.panelLength;
				t.goto(index, 'next');
			}
		}
	};
	if(!$.fn[plugin_name]){
		$.fn[plugin_name] = function(options){
			var fs, e, o;
			fs = new Fallscroll(this, options, options.panelChageSpeed);
			return fs;
		};
		$.fn[plugin_name].defaults = {
			effect : 'slide-horizontal',
			panel : '.fall-section',
			panelChageSpeed : 500,
			panelChageDelay : 200,
			loop : true,
			hashURL : true,
			defaultIndex : 0,
			onInit : function(fs){

			},
			onSectionChangeBefore : function(fs){

			},
			onSectionChangeStart : function(fs){

			},
			onSectionChangeEnd : function(fs){

			},
			onScrollBarChangeStart :function(fs){

			},
			onScrollBarChangeEnd :function(fs){

			}
		};
	}
})(window.jQuery);
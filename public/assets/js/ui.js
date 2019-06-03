'use strict';

jQuery.fn.center = function (w, h) {
	var top, left;

	if (config.isSoundPlay && $(this).hasClass('pop_sound')) {
		config.stopSoundForPop = true;
		$('.btn_sound_controll').trigger('click');
	}

	if (w) {
		top = ($(window).height() - h) / 2 + $(window).scrollTop();
		left = ($(window).width() - w) / 2 + $(window).scrollLeft();
		this.css('position', 'absolute');
		this.css('top', top + 'px');
		this.css('left', left + 'px');
		return this;
	} else {
		top = ($(window).height() - $(this).outerHeight()) / 2 + $(window).scrollTop();
		left = ($(window).width() - $(this).outerWidth()) / 2 + $(window).scrollLeft();
	}

	this.css('position', 'absolute');
	if ($(this).hasClass('pop')) {
		fallscroll.lockWheelEvent();
		this.css('top', top + 'px');
	}
	this.css('left', left + 'px');
	return this;
};

function checkBrowser() {
	var deviceAgent = {
		version: navigator.userAgent.toLowerCase()
	};
	if (window.navigator.userAgent.search(/trident/i) != -1) {
		// ie
		if (parseInt(deviceAgent.version.match(/trident\/(\d.\d)/i)[1], 10) <= 5 || deviceAgent.version.indexOf('msie 9.0') != -1) {
			// ie8 ~ ie9
			$('#ie_guide').show();
		}
	} else {}
	// else if(deviceAgent.version.indexOf('chrome') != -1){ //chrome

	// }
}

var config;
(function ($, $win, $doc, undefined) {
	var fn;
	config = {
		baseUrl: 'https://nxm-mt.akamaized.net/Contents/overhit.nexon.com/brand/assets/images/',
		isSoundPlay: false,
		stopSoundForPop: false
	};

	var radialObj;
	function bar() {
		fallscroll.lockWheelEvent();

		var c = 0,
		    p = $('#preload_wrap'),
		    b = p.find('.bg'),
		    t = p.find('.txt_percent'),
		    l = p.find('.bar i.on');

		function randomRange(n1, n2) {
			return Math.floor(Math.random() * (n2 - n1 + 1) + n1);
		}
		function callback(s) {
			setTimeout(function () {
				if (config.percent < c) c = config.percent; // 濡쒕뵫 吏��곗씪 寃쎌슦
				if (++c > 100) {
					$('.temp').remove();
					p.addClass('end');
					fn.setPlayer();
					// $('.btn_sound_controll').trigger('click');
					$('body').addClass('intro');
					setTimeout(function () {
						p.hide();
						fallscroll.unlockWheelEvent();
					}, 2500);

					// setTimeout(function(){
					// 	p.addClass('delay');
					// 	setTimeout(function(){
					// 		p.hide();
					// 	}, 3000);
					// }, 990);
					return;
				}
				// b.css('opacity', c / 50);
				l.css('width', c + '%');
				radialObj.value(c);
				// t.html(c + '%');
				// if(c < 8) callback(randomRange(10, 400));
				if (c < 8) callback(randomRange(10, 100));else callback(randomRange(10, 80));
			}, s - c);
		}
		callback(randomRange(1, 150));
	}
	function preload() {
		var tempEle = [];
		var tempImg = ['bg_section1.jpg'];
		var i, j, len;
		for (i = 0, len = tempImg.length; i < len; i++) {
			tempEle.push('<li><img src="' + config.baseUrl + tempImg[i] + '"></li>');
		}
		tempEle = tempEle.join('');
		$('#preload_wrap .temp').html(tempEle);
		$('body').DEPreLoad({
			OnStep: function OnStep(percent) {
				if (!config.percent) bar();
				config.percent = percent;
			},
			OnComplete: function OnComplete() {}
		});
	}
	fn = {
		checkPopDisplay: function checkPopDisplay() {
			var result;

			result = false;
			$('.pop').each(function () {
				if ($(this).css('display') == 'block') result = true;
			});
			return result;
		},
		setPlayer: function setPlayer() {
			var winH, winW, h, w;

			winH = $win.height();
			winW = $win.width();

			// winH = winH < 800 ? 800 : winH;
			winW = winW < 1500 ? 1500 : winW;

			h = winH;
			w = 16 * h / 9;

			if (w < winW) {
				w = winW;
				h = 9 * w / 16;
			}

			$('#player').css({
				'width': w,
				'height': h
			});

			if (winW <= 1000) return;
			$('#player').each(function () {
				$(this).center();
			});
		},
		setCenterPop: function setCenterPop() {
			$('.pop').each(function () {
				if ($(this).css('display') == 'block') $(this).center();
			});
		},
		setHalfPixel: function setHalfPixel(obj) {
			if ($win.width() % 2) {
				obj.css('left', '0');
			} else {
				obj.css('left', '0.5px');
			}
		},
		setResolution: function setResolution() {
			var winH;

			winH = $win.height();
			if (winH < 700) $('body').addClass('low_resolution');else $('body').removeClass('low_resolution');
		}
	};
	$doc.ready(function () {
		var body;
	});
})(jQuery, jQuery(window), jQuery(document));

var fallscroll;
(function ($) {
	var body, scrollbarWidth, navInner, navWidth, html, paging, pagingBtn, pagingTab;
	body = $('body');
	function changeBodyClass(status) {
		if (status) body.addClass('vertical_scroll');else body.removeClass('vertical_scroll');
	}
	function getScrollbarWidth() {
		var result;
		body.append('<div class="test"><div class="test_parent" style="height: 200px;overflow-y: auto;"><div class="test_child" style="height: 300px;"></div></div></div>');
		result = $('.test_parent').width() - $('.test_child').width();
		$('.test').remove();
		return result;
	}
	scrollbarWidth = getScrollbarWidth();
	navInner = $('#fall-nav .inner');
	navWidth = navInner.width() - scrollbarWidth;
	html = '<style>.vertical_scroll #fall-nav .inner {width: ' + navWidth + 'px;}</style>';
	$('head').append(html);
	paging = $('#paging');
	pagingBtn = paging.find('ul li a');
	pagingTab = $('#paging .inner .tab button');
	function checkPopDisplay() {
		var result;
		result = false;
		$('.pop').each(function () {
			if ($(this).css('display') == 'block') result = true;
		});
		return result;
	}
	function init(index) {
		pagingBtn.removeClass('active');
		$(pagingBtn[index]).addClass('active');
		body.addClass('black');
		if (index) {
			body.addClass('black');
		} else {
			body.removeClass('black');
		}
	}
	fallscroll = $('#fall-scroll').fallScroll({
		effect: 'fade-scale', /* 'slide-horizontal', 'slide-vertical', 'fade-scale', */
		panel: '.fall-section', /* section들 */
		panelChageSpeed: 700, /* section전환 속도 */
		panelChageDelay: 500, /* section전환 완료 후 다음 전환 이벤트 입력 딜레이, 최소 200ms */
		loop: false, /* section 순환 여부 */
		hashURL: true, /* hash 사용 여부 */
		defaultIndex: 0, /* 첫 페이지 설정 */
		onInit: function onInit(fs) {
			/* 플러그인 세팅 완료될 때 */
			init(fs.nextIndex);
		},
		onSectionChangeBefore: function onSectionChangeBefore(fs) {
			/* console.log(fs); */
		},
		onSectionChangeStart: function onSectionChangeStart(fs) {
			/* 섹션 전환이 시작될 때 */
			init(fs.nextIndex);

			$('header a, header div.games').removeClass('active');
			console.log(fs.nextIndex);
			if (fs.nextIndex === 1) {
				//사전예약
				$('header a.hm-1').addClass('active');
			}

			if (fs.nextIndex === 2) {
				//세계관
				$('header div.games').addClass('active');
				$('header a.hm-2').addClass('active');
				$('#section2 div.bg').addClass('on');
			} else {
				$('#section2 div.bg').removeClass('on');
			}

			if (fs.nextIndex === 3) {
				//캐릭터
				$('header div.games').addClass('active');
				$('header a.hm-3').addClass('active');
				$('#section3 div.bg').addClass('on');
			} else {
				$('#section3 div.bg').removeClass('on');
			}

			if (fs.nextIndex === 4) {
				//컨텐츠
				$('header div.games').addClass('active');
				$('header a.hm-4').addClass('active');
				$('#section4 div.bg').addClass('on');
			} else {
				$('#section4 div.bg').removeClass('on');
			}

			if (fs.nextIndex === 5) {
				//이벤트
				$('header a.hm-5').addClass('active');
				$('#section5 div.bg').addClass('on');
			} else {
				$('#section5 div.bg').removeClass('on');
			}
		},
		onSectionChangeEnd: function onSectionChangeEnd(fs) {
			/* 섹션 전환이 완료될 때 */

			if (fs.currentIndex === 0) {}
			if (fs.currentIndex === 1) {}
			if (fs.currentIndex === 2) {}
			if (fs.currentIndex === 3) {}
			if (fs.currentIndex === 4) {}
			if (fs.currentIndex === 5) {}
		},
		onScrollBarChangeStart: function onScrollBarChangeStart(fs) {
			/* 스크롤바가 섹션에 맞게 상태 변화 시작될 때 */
			body.removeClass('vertical_scroll');
		},
		onScrollBarChangeEnd: function onScrollBarChangeEnd(fs) {
			/* 스크롤바가 섹션에 맞게 상태 변화 완료될 때 */
			changeBodyClass(fs.isExistVerticalScroll[fs.currentIndex]);
		}
		/*				
  callback event 발생 순서				
  1. onScrollBarChangeStart();				
  2. onSectionChangeStart();				
  3. onScrollBarChangeEnd();				
  4. onSectionChangeEnd();			
  */
	});
	changeBodyClass(fallscroll.config.isExistVerticalScroll[fallscroll.config.currentIndex]);
})(jQuery);
'use strict';

var ELUNE = {
    init: function init() {
        this.setLnbPaging();
        this.setHeaderLink();
        this.utils();
    },
    setPlayer: function setPlayer() {
        var winH, winW, h, w;
        winH = $(window).height();
        winW = $(window).width();
        // winH = winH < 800 ? 800 : winH;
        winW = winW < 1500 ? 1500 : winW;
        h = winH;
        w = 16 * h / 9;
        if (w < winW) {
            w = winW;
            h = 9 * w / 16;
        }
        $('#player').css({ 'width': w, 'height': h });
        if (winW <= 1000) return;
        $('#player').each(function () {
            $(this).center();
        });
    },
    setLnbPaging: function setLnbPaging() {
        var pagingBtn = $('#paging ul li a');
        pagingBtn.on('click', function (e) {
            var $self, idx;
            e.preventDefault();
            $self = $(this);
            if (fallscroll.config.isAnimating) return false;
            if (fallscroll.config.isLockWheel) return false;
            if ($self.hasClass('active')) return false;else {
                idx = pagingBtn.index($self);
                pagingBtn.removeClass('active');
                $self.addClass('active');
                fallscroll.goto(idx);
            }
            $('header a').removeClass('active');
        });
    },
    setHeaderLink: function setHeaderLink() {
        var pagingBtn = $('header a');
        pagingBtn.on('click', function (e) {
            var $self, idx;
            $self = $(this);
            if (fallscroll.config.isAnimating) return false;
            if (fallscroll.config.isLockWheel) return false;
            if ($self.hasClass('active')) return false;else {
                idx = pagingBtn.index($self);
                if (idx != 6) {
                    // 공식카페 링크
                    e.preventDefault();
                    pagingBtn.removeClass('active');
                    $self.addClass('active');
                    fallscroll.goto(idx);
                }
            }
        });
    },
    utils: function utils() {
        $('header div.games, header div.submenus').on('mouseover', function () {
            $('header div.submenus').stop().fadeIn(100);
        }), $('header div.games, header div.submenus').on('mouseout', function () {
            $('header div.submenus').stop().fadeOut(100);
        }),
        // moive global
        $('a#movieplay').on('click', function () {
            var thisMovie = $(this).data('movie');
            var movieAddress = void 0;
            if (thisMovie == 'intro') {
                movieAddress = '<iframe width="960" height="539" src="https://www.youtube.com/embed/w8D7lLpO4nU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }

            var mov = setTimeout(function () {
                $('div.inner-movie').html(movieAddress);
                $('div.youtube-wrap').fadeIn(10, function () {
                    $('div.youtube-wrap').addClass('on');
                });

                $('div.youtube-wrap a.movie-close').on('click', function () {
                    $('div.youtube-wrap').removeClass('on');
                });
            }, 500);
        });

        // Can also be used with $(document).ready()
        $('.flexslider').flexslider({
            animation: "slide",
            controlNav: "thumbnails"
        });

        $('.wowslider').flexslider({
            animation: "slide",
            controlNav: "thumbnails"
        });
    }

    // after loaded execute
};$(document).ready(function () {
    ELUNE.init();
    ELUNE.setPlayer();
});

$(window).on('resize', function () {
    ELUNE.setPlayer();
});
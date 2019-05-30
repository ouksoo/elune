'use strict';

var ELUNE = {
    init: function init() {
        this.setLnbPaging();
        this.setHeaderLink();
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
    }

    // after loaded execute
};$(document).ready(function () {
    ELUNE.init();
    ELUNE.setPlayer();
});

$(window).on('resize', function () {
    ELUNE.setPlayer();
});
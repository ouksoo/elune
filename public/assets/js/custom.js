'use strict';

var ELUNE = {
    init: function init() {},
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
    }

    // after loaded execute
};$(document).ready(function () {
    ELUNE.setPlayer();
});

$(window).on('resize', function () {
    ELUNE.setPlayer();
});
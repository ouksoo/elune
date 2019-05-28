'use strict';

var LIM = {
    init: function init() {
        console.log('lim init mobile');
    }

    // after loaded execute
};window.onload = function () {
    LIM.init();

    // apply AOS plugin
    AOS.init({
        easing: 'ease-out-back',
        duration: 1000
    });
};
let ELUNE = {
    init: function() {
        this.setLnbPaging();
        this.setHeaderLink();
        this.utils();
    },
    setPlayer: function() {
        var winH, winW, h, w;
        winH = $(window).height();
        winW = $(window).width();
        // winH = winH < 800 ? 800 : winH;
        winW = winW < 1500 ? 1500 : winW;
        h = winH;
        w = 16 * h / 9;
        if(w < winW){
            w = winW;
            h = 9 * w / 16;
        }
        $('#player').css({'width' : w, 'height' : h});
        if(winW <= 1000) return;
        $('#player').each(function(){
            $(this).center();
        });
    },
    setLnbPaging: function() {
        var pagingBtn = $('#paging ul li a');
		pagingBtn.on('click', function(e){
            var $self, idx;
			e.preventDefault();
			$self = $(this);
			if(fallscroll.config.isAnimating) return false;
			if(fallscroll.config.isLockWheel) return false;
			if($self.hasClass('active')) {
                return false;
            }
			else {
                idx = pagingBtn.index($self);
				pagingBtn.removeClass('active');
				$self.addClass('active');
				fallscroll.goto(idx);
            }
            // $('header a').removeClass('active');
		});  
    },
    setHeaderLink: function() {
        var pagingBtn = $('header a');
		pagingBtn.on('click', function(e){
            var $self, idx;
			$self = $(this);
			if(fallscroll.config.isAnimating) return false;
			if(fallscroll.config.isLockWheel) return false;
			if($self.hasClass('active')) {
                return false;
            }
			else {
                idx = pagingBtn.index($self);
                if(idx != 6) { // 공식카페 링크
                    e.preventDefault();
                    pagingBtn.removeClass('active');
                    $self.addClass('active');
                    fallscroll.goto(idx);
                }
			}
		});  
    },
    utils: function() {

        $('header div.games, header div.submenus').on('mouseover', function() {
            $('header div.submenus').stop().fadeIn(100);
        });
        $('header div.games, header div.submenus').on('mouseout', function() {
            $('header div.submenus').stop().fadeOut(100);
        });

        // 개인정보 수집 및 이용동의
        $('a.private-view').on('click', function(e) {
            $('div.movie-dimmed, div#privateAgreement').fadeIn('fast');
            fallscroll.lockWheelEvent();
            e.preventDefault();
        });

        // 개인정보 처리 위탁동의
        $('a.private-agree').on('click', function(e) {
            
            fallscroll.lockWheelEvent();
            e.preventDefault();
        });

        // 게임빌 게임 출시 및 업데이트, 각종 이벤트 광고 알림 수신 동의
        $('a.gamevil-update').on('click', function(e) {
            $('div.movie-dimmed, div#gameUpateEvent').fadeIn('fast');
            fallscroll.lockWheelEvent();
            e.preventDefault();
        });

        // popup 닫기 공통
        $('a.popup-close').on('click', function(e) {
            $('div.movie-dimmed, div.popup').fadeOut('fast');
            fallscroll.unlockWheelEvent();
            e.preventDefault();
        });

        // 사전예약 버튼 
        $('a.advance-reserve').on('click', function(e) {
            fallscroll.goto(1);
            e.preventDefault();
        });

        // moive global
        $('a.movieplay').on('click', function(e) {
            let thisMovie = $(this).data('movie');
            let movieAddress;

            console.log(thisMovie);
            if(thisMovie == 'intro') {
                movieAddress = 'https://www.youtube.com/embed/1yvVH1pE7IA?autoplay=1&autohide=1&nohtml5=1&controls=1&loop=1&rel=0&fs=1&wmode=transparent&showinfo=0&modestbranding=1&iv_load_policy=1&start=0&theme=dark&vq=hd1080&color=red&enablejsapi=1';
            }
            if(thisMovie == 'multi-1') {
                movieAddress = 'https://www.youtube.com/embed/DeOF5mHskDc?autoplay=1&autohide=1&nohtml5=1&controls=1&loop=1&rel=0&fs=1&wmode=transparent&showinfo=0&modestbranding=1&iv_load_policy=1&start=0&theme=dark&vq=hd1080&color=red&enablejsapi=1';
            }
            if(thisMovie == '1') {
                movieAddress = 'https://www.youtube.com/embed/DeOF5mHskDc?autoplay=1&autohide=1&nohtml5=1&controls=1&loop=1&rel=0&fs=1&wmode=transparent&showinfo=0&modestbranding=1&iv_load_policy=1&start=0&theme=dark&vq=hd1080&color=red&enablejsapi=1';
            }

            $('div.inner-movie iframe').attr('src', movieAddress);
            $('div.movie-dimmed, div.youtube-wrap').fadeIn(function() {
                fallscroll.lockWheelEvent();
            });

            $('div.youtube-wrap a.movie-close').on('click', function(evt) {
                $('div.movie-dimmed, div.youtube-wrap').fadeOut(function(){
                    $('div.inner-movie iframe').attr('src', '');
                });
                fallscroll.unlockWheelEvent();
                evt.preventDefault();
            });

            e.preventDefault();

            // const mov = setTimeout(function() {
            //     $('div.inner-movie').html(movieAddress);
            //     $('div.youtube-wrap').fadeIn(10, function() {
            //         $('div.youtube-wrap').addClass('on');
            //     });
    
            //     $('div.youtube-wrap a.movie-close').on('click', function() {
            //         $('div.inner-movie').empty();
            //         $('div.youtube-wrap').removeClass('on');
            //     });
            // }, 500);
        });

        // Can also be used with $(document).ready()
        $('#contentGallery-1').lightSlider({
            gallery: true,
            item: 1,
            loop:true,
            slideMargin: 0,
            thumbItem: 4,
            thumbMargin: 10,
            enableTouch:false,
            enableDrag:false,
            freeMove:false,
            swipeThreshold: 40,
        });
        $('#contentGallery-2').lightSlider({
            gallery: true,
            item: 1,
            loop:true,
            slideMargin: 0,
            thumbItem: 4,
            thumbMargin: 10,
            enableTouch:false,
            enableDrag:false,
            freeMove:false,
            swipeThreshold: 40,
        });

        //character tab
        $('div.character-wrap .man-tab a, div.character-wrap .thumb a').on('click', function(e) {
            let thisNum = $(this).data('num');
            let thisKind = $(this).data('kind');
            if(thisKind) {
                $('div.character-wrap .man-tab a').each(function() {
                    $(this).removeClass('on');
                });
                $(this).addClass('on');
            }
            $('.character-image img').css('display','none');
            $('.character-image img.img-cha-' + thisNum).css('display','block');
            $('.character-wrap .ch-info').css('display','none');
            $('#characterInfo-' + thisNum).css('display','block');
            e.preventDefault();
        });

        //multimeida content tab
        $('.multimedia-tab a').on('click', function(e) {
            let thisNum = $(this).data('num');
            $('.multimedia-tab a').each(function() {
                $(this).removeClass('on');
            });
            $(this).addClass('on');
            $('.content-wrap .gallery-wrap').css('display','none');
            $('#multimediaContent-' + thisNum).css('display','block');
            e.preventDefault();
        });

    },
}

// after loaded execute
$(document).ready(function() {
    ELUNE.init();
    ELUNE.setPlayer();
});

$(window).on('resize', function() {
    ELUNE.setPlayer();    
});

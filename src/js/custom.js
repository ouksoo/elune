let ELUNE = {
    init: function() {
        
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

        $('#player').css({
            'width' : w,
            'height' : h
        });

        if(winW <= 1000) return;
        $('#player').each(function(){
            $(this).center();
        });
    }

}

var fallscroll;	
(function($){		
    var body, scrollbarWidth, navInner, navWidth, html,	paging, pagingBtn, pagingTab;		
    body = $('body');		
    function changeBodyClass(status){			
        if(status) body.addClass('vertical_scroll');			
        else body.removeClass('vertical_scroll');		
    }		
    function getScrollbarWidth(){			
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
    pagingBtn = paging.find('ol li a');		
    pagingTab = $('#paging .inner .tab button');		
    function checkPopDisplay(){			
        var result;			
        result = false;			
        $('.pop').each(function(){				
            if($(this).css('display') == 'block') result = true;			
        });			
        return result;		
    }		
    function init(index){			
        pagingBtn.removeClass('active');
        $(pagingBtn[index]).addClass('active');			
        body.addClass('black');			
        if(index){				
            body.addClass('black');			
        }else{				
            body.removeClass('black');			
        }		
    }		
    fallscroll = $('#fall-scroll').fallScroll({			
        effect : 'fade-scale', /* 'slide-horizontal', 'slide-vertical', 'fade-scale', */			
        panel : '.fall-section', /* section들 */			
        panelChageSpeed : 700, /* section전환 속도 */			
        panelChageDelay : 250, /* section전환 완료 후 다음 전환 이벤트 입력 딜레이, 최소 200ms */			
        loop : false, /* section 순환 여부 */			
        hashURL : true, /* hash 사용 여부 */			
        defaultIndex : 0, /* 첫 페이지 설정 */			
        onInit : function(fs){ /* 플러그인 세팅 완료될 때 */				
            init(fs.nextIndex);			
        },			
        onSectionChangeBefore : function(fs){				
            /* console.log(fs); */			
        },			
        onSectionChangeStart : function(fs){ /* 섹션 전환이 시작될 때 */				
            init(fs.nextIndex);				
            if(fs.nextIndex === 3 || fs.nextIndex === 4){					
                nx.initSwiper(fs.nextIndex);				
            }				
            if(fs.nextIndex === 4){					
                $('#section4 .desc .tab button.tab0').trigger('click');				
            }			
        },			
        onSectionChangeEnd : function(fs){ /* 섹션 전환이 완료될 때 */			

        },			
        onScrollBarChangeStart :function(fs){ /* 스크롤바가 섹션에 맞게 상태 변화 시작될 때 */				
            body.removeClass('vertical_scroll');			
        },			
        onScrollBarChangeEnd :function(fs){ /* 스크롤바가 섹션에 맞게 상태 변화 완료될 때 */				
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

// after loaded execute
$(document).ready(function() {
    ELUNE.setPlayer();
});

$(window).on('resize', function() {
    ELUNE.setPlayer();    
});

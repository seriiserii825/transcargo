$(function(){

    /* parralax
    ====================================================*/
    $.stellar();

    /*
        https://www.jqueryscript.net/animation/Smooth-Mouse-Wheel-Scrolling-Plugin-With-jQuery-easeScroll.html
        ===========================*/
    $("html").easeScroll({
        frameRate: 60,
        animationTime: 1000,
        stepSize: 90,
        pulseAlgorithm: 1,
        pulseScale: 8,
        pulseNormalize: 1,
        accelerationDelta: 20,
        accelerationMax: 1,
        keyboardSupport: true,
        arrowScroll: 50,
        touchpadSupport: true,
        fixedBackground: true
    });

    /* animate home
    ====================================================*/
    let wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       250,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );
    wow.init();

    /*----------  Toggle header- menu  ----------*/
    $('#js-navbar-button').on('click', function(e){
        e.preventDefault();

        $('#js-header-menu').slideToggle();
    });

    /*----------  slick  ----------*/
    $('#js-home-slider').slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1500,
        cssEase: 'ease',
        autoplay: false
    });

    /* fleets-gallery slider
    ====================================================*/
    $('#js-fleets-gallery').slick({
        dots: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1500,
        cssEase: 'ease',
        slidesToShow: 4,
        slidesToScroll: 2,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    });

    /* js-why-us-slider
    ====================================================*/
    $('#js-why-us-slider').slick({
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 1000
    });

    /* why-us__accordeon
    ====================================================*/
    $(".js-accordeon-title").on("click", function(e) {

        e.preventDefault();
        let $this = $(this),
            attr = $this.attr("href");

        if( $this.hasClass("active") ) {
            $(".js-accordeon-content").slideUp();
            $(".js-accordeon-title").removeClass("active");
            $(attr).slideUp();
            $this.find('.fa').removeClass('fa-minus').addClass('fa-plus');
        }else{
            $this.addClass("active");
            $(".js-accordeon-content").slideUp();
            $(".js-accordeon-title").find('.fa').removeClass('fa-minus').addClass('fa-plus');
            $(attr).slideDown();
            $this.find('.fa').removeClass('fa-plus').addClass('fa-minus');
        }
    })

    /* scroll to top
    ====================================================*/
    $('#js-up').on('click', function(){
        $('html, body').animate({
            scrollTop: 0
        }, 3000);
    });

});
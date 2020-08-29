    "use strict";

// Javascript String constants for hover_mobile
jQuery(document).ready(function() {
    "use strict";
	hover_mobile();
});

// Javascript String constants for toTop
jQuery(document).ready(function() {
	if (jQuery().UItoTop) {
        jQuery().UItoTop({ easingType: 'easeOutQuart' });
    }
});

// Javascript String constants for preloader
jQuery(window).load(function(){
	jQuery(".preloaderimg").fadeOut();
	jQuery(".preloader").delay(200).fadeOut("slow").delay(200, function(){
		jQuery(this).remove();
	});
});

// Javascript String constants for Hover effects on mobile (for portfolio skin)
function hover_mobile() {
    if (jQuery(".portfolio").length > 0) {
        $('.hover_wrap.taphover').on("touchstart", function(e) {
            var link = $(this); 
            if (link.hasClass('hover')) {
                $('.hover_wrap.taphover').not(this).removeClass("hover");
                return true;
            } else {
                link.addClass("hover");
                $('.hover_wrap.taphover').not(this).removeClass("hover");
                e.preventDefault();
                return false; 
            }
        });
    }
    if (jQuery(".sc_services_content").length > 0) {
        $('.sc_services_bg.taphover').on("touchstart", function(e) {
            var link = $(this); 
            if (link.hasClass('hover')) {
                $('.sc_services_bg.taphover').not(this).removeClass("hover");
                return true;
            } else {
                link.addClass("hover");
                $('.sc_services_bg.taphover').not(this).removeClass("hover");
                e.preventDefault();
                return false; 
            }
        });
    }
}
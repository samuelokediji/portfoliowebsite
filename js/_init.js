/* global jQuery:false */
/* global CINDY_J_STORAGE:false */

jQuery(document).ready(function() {
	"use strict";
	CINDY_J_STORAGE['template_init_counter'] = 0;
	cindy_j_init_actions();
});


// Template init actions
function cindy_j_init_actions() {
	"use strict";

	if (CINDY_J_STORAGE['vc_edit_mode'] && jQuery('.vc_empty-placeholder').length==0 && CINDY_J_STORAGE['template_init_counter']++ < 30) {
		setTimeout(cindy_j_init_actions, 200);
		return;
	}
	
	cindy_j_ready_actions();
	cindy_j_resize_actions();
	cindy_j_scroll_actions();

	// Resize handlers
	jQuery(window).resize(function() {
		"use strict";
		cindy_j_resize_actions();
	});

	// Scroll handlers
	jQuery(window).scroll(function() {
		"use strict";
		cindy_j_scroll_actions();
	});
}



// Template first load actions
//==============================================
function cindy_j_ready_actions() {
	"use strict";

	// Modify html classes
	document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'js');
	if (document.documentElement.className.indexOf(CINDY_J_STORAGE['site_scheme'])==-1)
		document.documentElement.className += ' ' + CINDY_J_STORAGE['site_scheme'];

	// Menu
    //----------------------------------------------

	// Add arrows in mobile menu and WooCommerce categories on homepages
	jQuery('.menu_mobile .menu-item-has-children > a, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories .has_children > a').prepend('<span class="open_child_menu"></span>');

	// Mobile menu open/close
	jQuery('.menu_mobile_button').on('click', function(e){
		"use strict";
		jQuery('.menu_mobile_overlay').fadeIn();
		jQuery('.menu_mobile').addClass('opened');
		e.preventDefault();
		return false;
	});
	jQuery('.menu_mobile_overlay').on('click', function(e){
		"use strict";
		jQuery('.menu_mobile_overlay').fadeOut();
		jQuery('.menu_mobile').removeClass('opened');
		e.preventDefault();
		return false;
	});

	// Open/Close submenu in the mobile menu
	jQuery('.menu_mobile, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories').on('click', 'li a,li a .open_child_menu, ul.product-categories.plain li a .open_child_menu', function(e) {
		"use strict";
		var is_menu_main = jQuery(this).parents('.menu_mobile').length > 0;
		var $a = jQuery(this).hasClass('open_child_menu') ? jQuery(this).parent() : jQuery(this);
		if ($a.parent().hasClass('menu-item-has-children') || $a.parent().hasClass('has_children')) {
			if ($a.siblings('ul:visible').length > 0)
				$a.siblings('ul').slideUp().parent().removeClass('opened');
			else {
				jQuery(this).parents('li').siblings('li').find('ul:visible').slideUp().parent().removeClass('opened');
				$a.siblings('ul').slideDown().parent().addClass('opened');
			}
		}
		// Ignore link for parent menu items
//		if ($a.attr('href')=='#' || $a.parent().hasClass('menu-item-has-children') || $a.parent().hasClass('has_children')) {
		if (jQuery(this).hasClass('open_child_menu') || $a.attr('href')=='#') {
			e.preventDefault();
			return false;
		}
	});
	
	// Init superfish menus
	cindy_j_init_sfmenu('ul#menu_main');
	if (jQuery('ul#menu_main').hasClass('inited')) jQuery('.menu_main_nav_area').addClass('menu_show');
	
	// Store height of the top panel
	CINDY_J_STORAGE['top_panel_height'] = 0;	//Math.max(0, jQuery('.top_panel_wrap').height());



	// Search form
    //----------------------------------------------
	if (jQuery('.search_wrap:not(.inited)').length > 0) {
		jQuery('.search_wrap:not(.inited)').each(function() {
			"use strict";
			jQuery(this).addClass('inited');
			jQuery(this).find('.search_field').on('keyup', function(e) {
				"use strict";
				if (jQuery(this).parents('.top_panel_wrap').length > 0) {
					if (jQuery(this).val() != '') {
						if (!jQuery(this).siblings('.search_submit').hasClass('icon-search'))
							jQuery(this).siblings('.search_submit').removeClass('icon-cancel').addClass('icon-search');
					} else {
						if (!jQuery(this).siblings('.search_submit').hasClass('icon-cancel'))
							jQuery(this).siblings('.search_submit').removeClass('icon-search').addClass('icon-cancel');
					}
				}
			});
			// Click "Search submit"
			jQuery(this).find('.search_submit').on('click', function(e) {
				"use strict";
				var search_wrap = jQuery(this).parents('.search_wrap');
				if (search_wrap.find('.search_field').val() != '' && (jQuery(this).parents('.top_panel_wrap').length == 0 || (jQuery(this).parents('.top_panel_wrap').hasClass('search_opened') && jQuery(this).hasClass('icon-search'))))
					search_wrap.find('form').get(0).submit();
				else if (jQuery(this).parents('.top_panel_wrap').length > 0) {
					if (jQuery(this).parents('.top_panel_wrap').hasClass('search_opened')) {
						jQuery(this).parents('.top_panel_wrap').removeClass('search_opened');
						if (search_wrap.find('.search_submit').hasClass('icon-cancel'))
							search_wrap.find('.search_submit').removeClass('icon-cancel').addClass('icon-search');
					} else {
						jQuery(this).parents('.top_panel_wrap').addClass('search_opened');
						search_wrap.find('.search_field').get(0).focus();
						search_wrap.find('.search_submit').removeClass('icon-search').addClass('icon-cancel');
					}
				}
				e.preventDefault();
				return false;
			});
			// Click "Close search results"
			jQuery(this).find('.search_results_close').on('click', function(e) {
				"use strict";
				jQuery(this).parent().fadeOut();
				e.preventDefault();
				return false;
			});
			// Click "More results"
			jQuery(this).on('click', '.search_more', function(e) {
				"use strict";
				if (jQuery(this).parents('.search_wrap').find('.search_field').val() != '')
					jQuery(this).parents('.search_wrap').find('form').get(0).submit();
				e.preventDefault();
				return false;
			});
			// AJAX search
			if (jQuery(this).hasClass('search_ajax')) {
				var ajax_timer = null;
				jQuery(this).find('.search_field').keyup(function(e) {
					"use strict";
					var search_field = jQuery(this);
					var s = search_field.val();
					if (ajax_timer) {
						clearTimeout(ajax_timer);
						ajax_timer = null;
					}
					if (s.length >= 4) {
						ajax_timer = setTimeout(function() {
							jQuery.post(CINDY_J_STORAGE['ajax_url'], {
								action: 'ajax_search',
								nonce: CINDY_J_STORAGE['ajax_nonce'],
								text: s
							}).done(function(response) {
								"use strict";
								clearTimeout(ajax_timer);
								ajax_timer = null;
								var rez = {};
								try {
									rez = JSON.parse(response);
								} catch (e) {
									rez = { error: CINDY_J_STORAGE['search_error'] };
									console.log(response);
								}
								var msg = rez.error === '' ? rez.data : rez.error;
								search_field.parents('.search_ajax').find('.search_results_content').empty().append(rez.data);
								search_field.parents('.search_ajax').find('.search_results').fadeIn();
							});
						}, 500);
					}
				});
			}
		});
	}
	


	// Widgets decoration
    //----------------------------------------------

	// Decorate nested lists in widgets and side panels
	jQuery('.widget ul > li').each(function() {
		"use strict";
		if (jQuery(this).find('ul').length > 0) {
			jQuery(this).addClass('has_children');
		}
	});

	// Archive widget decoration
	jQuery('.widget_archive a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span>' + val[val.length-1] + '</span>';
			jQuery(this).html(val.join(' '))
		}
	});


	// Forms validation
    //----------------------------------------------

	jQuery("select:visible").wrap('<div class="select_container"></div>');

	// Comment form
	jQuery("form#commentform").submit(function(e) {
		"use strict";
		var rez = cindy_j_comments_validate(jQuery(this));
		if (!rez)
			e.preventDefault();
		return rez;
	});

	jQuery("form").on('keypress', '.error_field', function() {
		if (jQuery(this).val() != '')
			jQuery(this).removeClass('error_field');
	});

	// WooCommerce
    //----------------------------------------------

	// Change display mode
	jQuery('.woocommerce,.woocommerce-page').on('click', '.cindy_j_shop_mode_buttons a', function(e) {
		"use strict";
		var mode = jQuery(this).hasClass('woocommerce_thumbs') ? 'thumbs' : 'list';
		jQuery.cookie('cindy_j_shop_mode', mode, {expires: 365, path: '/'});
		jQuery(this).siblings('input').val(mode).parents('form').get(0).submit();
		e.preventDefault();
		return false;
	});
	// Add buttons to quantity
	jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').append('<span class="q_inc"></span><span class="q_dec"></span>');
	jQuery('.woocommerce div.quantity').on('click', '>span', function(e) {
		"use strict";
		var f = jQuery(this).siblings('input');
		if (jQuery(this).hasClass('q_inc')) {
			f.val(Math.max(0, parseInt(f.val()))+1);
		} else {
			f.val(Math.max(1, Math.max(0, parseInt(f.val()))-1));
		}
		e.preventDefault();
		return false;
	});
	// Add stretch behaviour to WooC tabs area
	jQuery('.single-product .woocommerce-tabs').wrap('<div class="trx-stretch-width scheme_light"></div>');
	jQuery('.trx-stretch-width').after('<div class="trx-stretch-width-original"></div>');
	cindy_j_stretch_width();
		

	// Other settings
    //------------------------------------

	// Init post format specific scripts
	cindy_j_init_post_formats();

	// Init hidden elements (if exists)
	if (window.cindy_j_init_hidden_elements) cindy_j_init_hidden_elements(jQuery('body').eq(0));
	
} //end ready




// Scroll actions
//==============================================

// Do actions when page scrolled
function cindy_j_scroll_actions() {
	"use strict";

	var scroll_offset = jQuery(window).scrollTop();
	var adminbar_height = Math.max(0, jQuery('#wpadminbar').height());

	if (CINDY_J_STORAGE['top_panel_height'] == 0)	CINDY_J_STORAGE['top_panel_height'] = jQuery('.top_panel_wrap').outerHeight();

	// Call skin specific action (if exists)
    //----------------------------------------------
	if (window.cindy_j_skin_scroll_actions) cindy_j_skin_scroll_actions();

	// Fix/unfix top panel
	if (!jQuery('body').hasClass('mobile_layout')) {
		var slider_height = 0;
		var logo_height = 0;
		if (jQuery('.top_panel_logo').length > 0) {
			logo_height = jQuery('.top_panel_logo').height();
		}
		if (scroll_offset <= logo_height + slider_height + CINDY_J_STORAGE['top_panel_height']) {
			if (jQuery('body').hasClass('top_panel_fixed')) {
				jQuery('body').removeClass('top_panel_fixed');
			}
		} else if (scroll_offset > logo_height + slider_height + CINDY_J_STORAGE['top_panel_height']) {
			if (!jQuery('body').hasClass('top_panel_fixed') && jQuery(document).height() > jQuery(window).height()*1.5) {
				jQuery('.top_panel_fixed_wrap').height(CINDY_J_STORAGE['top_panel_height']);
				jQuery('.top_panel_wrap').css('marginTop', '-150px').animate({'marginTop': 0}, 500);
				jQuery('body').addClass('top_panel_fixed');
			}
		}
	}
	
	// Fix/unfix sidebar
	cindy_j_fix_sidebar();
	
	// Scroll actions for animated elements
	jQuery('[data-animation^="animated"]:not(.animated)').each(function() {
		"use strict";
		if (jQuery(this).offset().top < jQuery(window).scrollTop() + jQuery(window).height())
			jQuery(this).addClass(jQuery(this).data('animation'));
	});
}



// Resize actions
//==============================================

// Do actions when page scrolled
function cindy_j_resize_actions() {
	"use strict";
	cindy_j_check_layout();
	cindy_j_video_dimensions();
	cindy_j_fix_sidebar();
	cindy_j_stretch_width();
}


// Check for mobile layout
function cindy_j_check_layout() {
	if (jQuery('body').hasClass('no_layout'))
		jQuery('body').removeClass('no_layout')
	var w = window.innerWidth;
	if (w == undefined) 
		w = jQuery(window).width()+(jQuery(window).height() < jQuery(document).height() || jQuery(window).scrollTop() > 0 ? 16 : 0);
	if (CINDY_J_STORAGE['mobile_layout_width'] >= w) {
		if (!jQuery('body').hasClass('mobile_layout')) {
			jQuery('body').removeClass('top_panel_fixed desktop_layout').addClass('mobile_layout');
		}
	} else {
		if (!jQuery('body').hasClass('desktop_layout')) {
			jQuery('body').removeClass('mobile_layout').addClass('desktop_layout');
			jQuery('.menu_mobile').removeClass('opened');
			jQuery('.menu_mobile_overlay').hide();
		}
	}
	// Switch popup menu / hierarchical list on product categories list placed in sidebar
	var cat_menu = jQuery('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
	var sb = cat_menu.parents('.widget_area');
	if (sb.length > 0 && cat_menu.length > 0) {
		if (sb.width() == sb.parents('.content_wrap').width()) {
			if (cat_menu.hasClass('inited')) {
				cat_menu.removeClass('inited').addClass('plain').superfish('destroy');
				cat_menu.find('ul.animated').removeClass('animated').addClass('no_animated');
			}
		} else {
			if (!cat_menu.hasClass('inited')) {
				cat_menu.removeClass('plain').addClass('inited');
				cat_menu.find('ul.no_animated').removeClass('no_animated').addClass('animated');
				cindy_j_init_sfmenu('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
			}
		}
	}
}

// Stretch area to full window width
function cindy_j_stretch_width() {
	jQuery('.trx-stretch-width').each(function() {
		var $el = jQuery(this);
		var $el_cont = $el.parents('.page_wrap');
		var $el_cont_offset = 0;
		if ($el_cont.length == 0) 
			$el_cont = jQuery(window);
		else
			$el_cont_offset = $el_cont.offset().left;
		var $el_full = $el.next('.trx-stretch-width-original');
		var el_margin_left = parseInt( $el.css( 'margin-left' ), 10 );
		var el_margin_right = parseInt( $el.css( 'margin-right' ), 10 );
		var offset = $el_cont_offset - $el_full.offset().left - el_margin_left;
		var width = $el_cont.width();
		if (!$el.hasClass('inited')) {
			$el.addClass('inited invisible');
			$el.css({
				'position': 'relative',
				'box-sizing': 'border-box'
			});
		}
		$el.css({
			'left': offset,
			'width': $el_cont.width()
		});
		if ( !$el.hasClass('trx-stretch-content') ) {
			var padding = Math.max(0, -1*offset);
			var paddingRight = Math.max(0, width - padding - $el_full.width() + el_margin_left + el_margin_right);
			$el.css( { 'padding-left': padding + 'px', 'padding-right': paddingRight + 'px' } );
		}
		$el.removeClass('invisible');
	});
}


// Fix/unfix sidebar
function cindy_j_fix_sidebar() {
	"use strict";
	var sb = jQuery('.sidebar');
	if (sb.length > 0) {

		// Unfix when sidebar is under content
		if (jQuery('.page_content_wrap .content_wrap .content').css('float') == 'none') {
			if (sb.css('position')=='fixed') {
				sb.css({
					'float': sb.hasClass('right') ? 'right' : 'left',
					'position': 'static'
				});
			}

		} else {

			var sb_height = sb.outerHeight();
			var content_height = sb.siblings('.content').outerHeight();
			var scroll_offset = jQuery(window).scrollTop();
			var logo_height = jQuery('.top_panel_logo').length > 0 ? jQuery('.top_panel_logo').height() : 0;
			var slider_height = jQuery('.header_wrap .slider_wrap').length > 0 ? jQuery('.header_wrap .slider_wrap').height() : 0;
			var menu_height = jQuery('.top_panel_wrap').length > 0 ? jQuery('.top_panel_wrap').height() : 0;
			var widgets_above_page_height = jQuery('.widgets_above_page_wrap').length > 0 ? jQuery('.widgets_above_page_wrap').height() : 0;
			var page_padding = parseInt(jQuery('.page_content_wrap').css('paddingTop'));
			if (isNaN(page_padding)) page_padding = 0;

			if (sb_height < content_height && 
				(sb_height >= jQuery(window).height() && scroll_offset + jQuery(window).height() > sb_height+logo_height+menu_height+slider_height+widgets_above_page_height+page_padding
				||
				sb_height < jQuery(window).height() && scroll_offset > logo_height+slider_height+widgets_above_page_height+page_padding )
				) {
				
				// Fix when sidebar bottom appear
				if (sb.css('position')!=='fixed') {
					sb.css({
						'float': 'none',
						'position': 'fixed',
						'top': Math.min(0, jQuery(window).height() - sb_height) + 'px'
					});
				}
				
				// Detect horizontal position when resize
				var pos = jQuery('.page_content_wrap .content_wrap').position();
				pos = pos.left + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('paddingLeft'))) + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('marginLeft')));
				if (sb.hasClass('right'))
					sb.css({ 'right': pos });
				else
					sb.css({ 'left': pos });
				
				// Shift to top when footer appear
				var footer_top = 0;
				var footer_pos = jQuery('.footer_wrap').position();
				var widgets_below_page_pos = jQuery('.widgets_below_page_wrap').position();
				var copyright_pos = jQuery('.copyright_wrap').position();
				if (widgets_below_page_pos)
					footer_top = widgets_below_page_pos.top;
				else if (footer_pos)
					footer_top = footer_pos.top;
				else if (copyright_pos)
					footer_top = copyright_pos.top;
				if (footer_top > 0 && scroll_offset + jQuery(window).height() > footer_top)
					sb.css({
						'top': Math.min(menu_height+page_padding, jQuery(window).height() - sb_height - (scroll_offset + jQuery(window).height() - footer_top + 30)) + 'px'
					});
				else
					sb.css({
						'top': Math.min(menu_height+page_padding, jQuery(window).height() - sb_height) + 'px'
					});
				

			} else {

				// Unfix when page scrolling to top
				if (sb.css('position')=='fixed') {
					sb.css({
						'float': sb.hasClass('right') ? 'right' : 'left',
						'position': 'static',
						'top': 'auto',
						'left': 'auto',
						'right': 'auto'
					});
				}

			}
		}
	}
}


// Fit video frames to document width
function cindy_j_video_dimensions() {
	jQuery('video').each(function() {
		"use strict";
		var video = jQuery(this).eq(0);
		var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var mejs_cont = video.parents('.mejs-video');
		var w_attr = video.data('width');
		var h_attr = video.data('height');
		if (!w_attr || !h_attr) {
			w_attr = video.attr('width');
			h_attr = video.attr('height');
			if (!w_attr || !h_attr) return;
			video.data({'width': w_attr, 'height': h_attr});
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = Math.round(mejs_cont.length > 0 ? Math.min(percent ? 10000 : w_attr, mejs_cont.parents('div,article').width()) : video.width()),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(video.attr('data-last-width'))==w_real) return;
		if (mejs_cont.length > 0 && mejs) {
			cindy_j_set_mejs_player_dimensions(video, w_real, h_real);
		}
		if (percent) {
			video.height(h_real);
		} else {
			video.attr({'width': w_real, 'height': h_real}).css({'width': w_real+'px', 'height': h_real+'px'});
		}
		video.attr('data-last-width', w_real);
	});
	jQuery('.post_featured iframe').each(function() {
		"use strict";
		var iframe = jQuery(this).eq(0);
		if (iframe.attr('src').indexOf('soundcloud')>0) return;
		var ratio = (iframe.data('ratio')!=undefined ? iframe.data('ratio').split(':') : (iframe.find('[data-ratio]').length>0 ? iframe.find('[data-ratio]').data('ratio').split(':') : [16,9]));
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var w_attr = iframe.attr('width');
		var h_attr = iframe.attr('height');
		if (!w_attr || !h_attr) {
			return;
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = iframe.parent().width(),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(iframe.attr('data-last-width'))==w_real) return;
		iframe.css({'width': w_real+'px', 'height': h_real+'px'});
		iframe.attr('data-last-width', w_real);
	});
}


// Set Media Elements player dimensions
function cindy_j_set_mejs_player_dimensions(video, w, h) {
	"use strict";
	if (mejs) {
		for (var pl in mejs.players) {
			if (mejs.players[pl].media.src == video.attr('src')) {
				if (mejs.players[pl].media.setVideoSize) {
					mejs.players[pl].media.setVideoSize(w, h);
				}
				mejs.players[pl].setPlayerSize(w, h);
				mejs.players[pl].setControlsSize();
			}
		}
	}
}





// Navigation
//==============================================

// Init Superfish menu
function cindy_j_init_sfmenu(selector) {
	"use strict";
	jQuery(selector).show().each(function() {
		"use strict";
		jQuery(this).addClass('inited').superfish({
			delay: 500,
			animation: {
				opacity: 'show'
			},
			animationOut: {
				opacity: 'hide'
			},
			speed: 		CINDY_J_STORAGE['css_animation'] ? 500 : 200,
			speedOut:	CINDY_J_STORAGE['css_animation'] ? 500 : 200,
			autoArrows: false,
			dropShadows: false,
			onBeforeShow: function(ul) {
				"use strict";
				if (jQuery(this).parents("ul").length > 1){
					var w = jQuery(window).width();  
					var par_offset = jQuery(this).parents("ul").offset().left;
					var par_width  = jQuery(this).parents("ul").outerWidth();
					var ul_width   = jQuery(this).outerWidth();
					if (par_offset+par_width+ul_width > w-20 && par_offset-ul_width > 0)
						jQuery(this).addClass('submenu_left');
					else
						jQuery(this).removeClass('submenu_left');
				}
				if (CINDY_J_STORAGE['css_animation']) {
					jQuery(this).removeClass('animated fast '+CINDY_J_STORAGE['menu_animation_out']);
					jQuery(this).addClass('animated fast '+CINDY_J_STORAGE['menu_animation_in']);
				}
			},
			onBeforeHide: function(ul) {
				"use strict";
				if (CINDY_J_STORAGE['css_animation']) {
					jQuery(this).removeClass('animated fast '+CINDY_J_STORAGE['menu_animation_in']);
					jQuery(this).addClass('animated fast '+CINDY_J_STORAGE['menu_animation_out']);
				}
			}
		});
	});
}





// Post formats init
//=====================================================

function cindy_j_init_post_formats() {
	"use strict";

	// MediaElement init
	cindy_j_init_media_elements(jQuery('body'));
}


function cindy_j_init_media_elements(cont) {
	"use strict";
	if (CINDY_J_STORAGE['use_mediaelements'] && cont.find('audio,video').length > 0) {
		if (window.mejs) {
			window.mejs.MepDefaults.enableAutosize = true;
			window.mejs.MediaElementDefaults.enableAutosize = true;
			cont.find('audio:not(.wp-audio-shortcode),video:not(.wp-video-shortcode)').each(function() {
				"use strict";
				if (jQuery(this).parents('.mejs-mediaelement').length == 0 && !jQuery(this).parent().hasClass('wp-playlist')) {
					var media_tag = jQuery(this);
					var settings = {
						enableAutosize: true,
						videoWidth: -1,		// if set, overrides <video width>
						videoHeight: -1,	// if set, overrides <video height>
						audioWidth: '100%',	// width of audio player
						audioHeight: 30,	// height of audio player
						success: function(mejs) {
							var autoplay, loop;
							if ( 'flash' === mejs.pluginType ) {
								autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
								loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
								autoplay && mejs.addEventListener( 'canplay', function () {
									mejs.play();
								}, false );
								loop && mejs.addEventListener( 'ended', function () {
									mejs.play();
								}, false );
							}
						}
					};
					jQuery(this).mediaelementplayer(settings);
				}
			});
		} else
			setTimeout(function() { cindy_j_init_media_elements(cont); }, 400);
	}
}



// Forms validation
//-------------------------------------------------------

// Comments form
function cindy_j_comments_validate(form) {
	"use strict";
	form.find('input').removeClass('error_field');
	var comments_args = {
		error_message_text: CINDY_J_STORAGE['strings']['error_global'],	// Global error message text (if don't write in checked field)
		error_message_show: true,									// Display or not error message
		error_message_time: 4000,									// Error message display time
		error_message_class: 'cindy_j_messagebox cindy_j_messagebox_style_error',	// Class appended to error message block
		error_fields_class: 'error_field',							// Class appended to error fields
		exit_after_first_error: false,								// Cancel validation and exit after first error
		rules: [
			{
				field: 'comment',
				min_length: { value: 1, message: CINDY_J_STORAGE['strings']['text_empty'] },
				max_length: { value: CINDY_J_STORAGE['message_maxlength'], message: CINDY_J_STORAGE['strings']['text_long']}
			}
		]
	};
	if (form.find('.comments_author input[aria-required="true"]').length > 0) {
		comments_args.rules.push(
			{
				field: 'author',
				min_length: { value: 1, message: CINDY_J_STORAGE['strings']['name_empty']},
				max_length: { value: 60, message: CINDY_J_STORAGE['strings']['name_long']}
			}
		);
	}
	if (form.find('.comments_email input[aria-required="true"]').length > 0) {
		comments_args.rules.push(
			{
				field: 'email',
				min_length: { value: 7, message: CINDY_J_STORAGE['strings']['email_empty']},
				max_length: { value: 60, message: CINDY_J_STORAGE['strings']['email_long']},
				mask: { value: CINDY_J_STORAGE['email_mask'], message: CINDY_J_STORAGE['strings']['email_not_valid']}
			}
		);
	}
	var error = cindy_j_form_validate(form, comments_args);
	return !error;
}

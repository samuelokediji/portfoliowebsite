/* Template globals */
"use strict";
    if (typeof TRX_ADDONS_STORAGE == 'undefined') var TRX_ADDONS_STORAGE  = {};
    CINDY_J_STORAGE['ajax_url'] = '#';
    CINDY_J_STORAGE['ajax_nonce'] = '96cdd856d1';
    CINDY_J_STORAGE['site_url'] = 'http:\/\/blog-cv-html.axiomthemes.com';
    CINDY_J_STORAGE['user_logged_in'] = '';
    CINDY_J_STORAGE['mobile_layout_width'] = 960;      
    CINDY_J_STORAGE['menu_animation_in'] = 'none';
    CINDY_J_STORAGE['menu_animation_out'] = 'none'; 
    CINDY_J_STORAGE['use_mediaelements'] = 1;
    CINDY_J_STORAGE['menu_slider'] = true;
    CINDY_J_STORAGE['media_elements_enabled'] = true;
    CINDY_J_STORAGE['css_animation'] = true;
    CINDY_J_STORAGE['popup_engine'] = 'magnific';
    CINDY_J_STORAGE['email_mask'] = '^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$';
    CINDY_J_STORAGE['isotope_resize_delta'] = 0.3;
    CINDY_J_STORAGE['error_message_box'] = null;
    CINDY_J_STORAGE['top_panel_height'] = 0;
    CINDY_J_STORAGE['message_maxlength'] = 1000;
    CINDY_J_STORAGE['site_scheme'] = 'scheme_grey';
    CINDY_J_STORAGE['admin_mode'] = '';

// Javascript String constants for translation */
CINDY_J_STORAGE["strings"] = {
    ajax_error:         "Invalid server answer!",      
    error_global:       "Error data validation!",    
    name_empty:         "The name can&#039;t be empty",  
    name_long:          "Too long name",               
    email_empty:        "Too short (or empty) email address", 
    email_long:         "Too long email address",      
    email_not_valid:    "Invalid email address",  
    text_empty:         "The message text can&#039;t be empty", 
    text_long:          "Too long message text",       
    search_error:       "Search error! Try again later.", 
    send_complete:      "Send message complete!",
    send_error:         "Transmit failed!"       
};

// Javascript String constants 
(function(html) {
    "use strict";
    html.className = html.className.replace(/\bno-js\b/, 'js')
})(document.documentElement);

 // instagram parameters */
var sb_instagram_js_options = {
    "sb_instagram_at": "1960223991.3a81a9f.07f71ea44b414d85b30947571a7a8e52"
};

// Atach Event Data */
(function() {
    function addEventListener(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, handler);
        }
    }
})();

// Subscribe Data */
(function() {
    if (!window.mc4wp) {
        window.mc4wp = {
            listeners: [],
            forms: {
                on: function(event, callback) {
                    window.mc4wp.listeners.push({
                        event: event,
                        callback: callback
                    });
                }
            }
        }
    }
})();
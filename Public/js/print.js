// Open popup 'Print' after 1 sec.
if (location.href.indexOf('cv_download') < 0)
    setTimeout(function() {
        window.print();
    }, 1000);   

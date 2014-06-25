(function ($)
{
    var contentTop = [],
        content = [],
        lastScrollTop = 0,
        scrollDir = 'down',
        itemClass = '',
        itemHover = '',

        menuSize = null,
        stickyHeight = 0,
        stickyMarginB = 0,
        currentMarginT = 0,
        topMargin = 0,
        vartop = null,

        menuClass = "stuckMenu",
        menuClassSelector = "." + menuClass,
        $menu = null,
        $menuItems = null,

        fixedClass = "isStuck",
        fixedClassSelector = "." + fixedClass,

        $window = $(window),
        $document = $(document),
        scrolling = false;

    $.fn.stickUp = function (options)
    {
        // adding a class to users div
        $(this).addClass(menuClass);

        //getting options
        var objn = 0, part;
        if (options !== null)
        {
            for (part in options.parts)
            {
                if (options.parts.hasOwnProperty(part))
                {
                    content[objn] = options.parts[objn];
                    objn++;
                }
            }

            if (objn === 0)
            {
                console.error('Must provide parts to sync menu items with.');
            }

            itemClass = options.itemClass;
            itemHover = options.itemHover;

            if (options.topMargin)
            {
                if (options.topMargin === 'auto')
                {
                    topMargin = parseInt($(menuClassSelector).css('margin-top'), 10);
                }
                else
                {
                    topMargin = parseInt(options.topMargin, 10);

                    if (isNaN(topMargin) && options.topMargin.indexOf("px") > 0)
                    {
                        topMargin = parseInt(options.topMargin.replace("px", ""), 10);
                    }

                    if (isNaN(topMargin))
                    {
                        console.warn("Ignored topMargin option. Value must be number or 'auto'");
                        topMargin = 0;
                    }
                }
            }

            $menu = $(menuClassSelector);
            $menuItems = $("." + itemClass);

            menuSize = $('.' + itemClass).size();
        }

        stickyHeight    = parseInt($(this).height(), 10);
        stickyMarginB   = parseInt($(this).css('margin-bottom'), 10);
        currentMarginT  = parseInt($(this).next().closest('div').css('margin-top'), 10);
        vartop          = parseInt($(this).offset().top, 10);

        updateStickyNav();
        return this;
    };

    function bottomView(i, docScrollTop)
    {
        var contentView = $('#' + content[i] + '').height() * 0.8,
            testView = contentTop[i] + contentView;

        if (docScrollTop <= testView)
        {
            $menuItems.removeClass(itemHover);
            $menuItems.eq(i).addClass(itemHover);
        }
    }

    function updateStickyNav()
    {
        var docScrollTop = $document.scrollTop(), i;
        if (menuSize !== null)
        {
            if (scrollDir === 'down') {
                for (i = 0; i < menuSize; i++)
                {
                    contentTop[i] = $('#' + content[i] + '').offset().top;
                    if ((contentTop[i] - $menu.offset().top) < 100)
                    {
                        $menuItems.removeClass(itemHover);
                        $menuItems.eq(i).addClass(itemHover);
                    }
                }
            }
            else if (scrollDir === 'up')
            {
                for (i = menuSize-1; i > -1; i--)
                {
                    contentTop[i] = $('#' + content[i] + '').offset().top;
                    bottomView(i, docScrollTop);
                }
            }
        }

        if (docScrollTop + topMargin > vartop)
        {
            $menu.addClass(fixedClass);
            $menu.next().closest('div').css({
                'margin-top': (stickyHeight + stickyMarginB + currentMarginT).toString() + 'px'
            });
            $menu.css("position", "fixed");
            $(fixedClassSelector).css({top: 0});
        }
        else
        {
            $menu.removeClass(fixedClass);
            $menu.next().closest('div').css({
                'margin-top': currentMarginT.toString() + 'px'
            });
            $menu.css({"position": "relative", top: 0});
        }

        scrollDir = docScrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = docScrollTop;

    }

    $window.on('scroll', function () {
        updateStickyNav();
        scrolling = false; // For mobile devices
    });

    $window.on('resize', updateStickyNav);
    $window.on('orientationchange', updateStickyNav);

    function iosUpdate() {
        updateStickyNav();
        if (scrolling) {
            window.requestAnimationFrame(iosUpdate);
        }
    }

    $window.on("touchmove", function () {
        scrolling = true;
        iosUpdate();
    });

})(jQuery);

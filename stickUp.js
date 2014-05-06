(function ($)
{
    var contentTop = [],
        content = [],
        lastScrollTop = 0,
        scrollDir = '',
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

        fixedClass = "isStuck",
        fixedClassSelector = "." + fixedClass,
        $window = $(window);

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
                console.error('A parts object is required.');
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

            menuSize = $('.' + itemClass).size();
        }

        stickyHeight    = parseInt($(this).height(), 10);
        stickyMarginB   = parseInt($(this).css('margin-bottom'), 10);
        currentMarginT  = parseInt($(this).next().closest('div').css('margin-top'), 10);
        vartop          = parseInt($(this).offset().top, 10);

        return this;
    };

    function bottomView(items, i, varscroll)
    {
        var contentView = $('#' + content[i] + '').height() * 0.4,
            testView = contentTop[i] - contentView;

        if (varscroll > testView)
        {
            items.removeClass(itemHover);
            items.eq(i).addClass(itemHover);
        }
        else if (varscroll < 50)
        {
            items.removeClass(itemHover);
            items.eq(0).addClass(itemHover);
        }
    }

    $window.on('scroll', function ()
    {
        var varscroll = parseInt($(document).scrollTop(), 10),
            $menu = $(menuClassSelector),
            scrollTop, i, items;

        if (menuSize !== null)
        {
            items = $("." + itemClass);
            for (i = 0; i < menuSize; i++)
            {
                contentTop[i] = $('#' + content[i] + '').offset().top;

                if (scrollDir === 'down' &&
                    varscroll > contentTop[i] - 50 &&
                    varscroll < contentTop[i] + 50)
                {
                    items.removeClass(itemHover);
                    items.eq(i).addClass(itemHover);
                }

                if (scrollDir === 'up')
                {
                    bottomView(items, i, varscroll);
                }
            }
        }

        if (vartop < varscroll + topMargin)
        {
            $menu.addClass(fixedClass);
            $menu.next().closest('div').css({
                'margin-top': (stickyHeight + stickyMarginB + currentMarginT).toString() + 'px'
            }, 10);

            $menu.css("position", "fixed");
            $(fixedClassSelector).css({top: 0}, 10);
        }

        if (varscroll + topMargin < vartop)
        {
            $menu.removeClass(fixedClass);
            $menu.next().closest('div').css({
                'margin-top': currentMarginT.toString() + 'px'
            }, 10);
            $menu.css("position", "relative");
        }

        scrollTop = $(this).scrollTop();
        scrollDir = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;
    });

})(jQuery);

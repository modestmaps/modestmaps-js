    // Make inheritance bearable: clone one level of properties
    MM.extend = function(child, parent) {
        for (var property in parent.prototype) {
            if (typeof child.prototype[property] == "undefined") {
                child.prototype[property] = parent.prototype[property];
            }
        }
        return child;
    };

    MM.getFrame = function () {
        // native animation frames
        // http://webstuff.nfshost.com/anim-timing/Overview.html
        // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        // can't apply these directly to MM because Chrome needs window
        // to own webkitRequestAnimationFrame (for example)
        // perhaps we should namespace an alias onto window instead? 
        // e.g. window.mmRequestAnimationFrame?
        return function(callback) {
            (window.requestAnimationFrame  ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(function () {
                    callback(+new Date());
                }, 10);
            })(callback);
        };
    }();

    // Inspired by LeafletJS
    MM.transformProperty = (function(props) {
        if (!this.document) return; // node.js safety
        var style = document.documentElement.style;
        for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    })(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

    MM.matrixString = function(point) {
        // Make the result of point.scale * point.width a whole number.
        if (point.scale * point.width % 1) {
            point.scale += (1 - point.scale * point.width % 1) / point.width;
        }

        var scale = point.scale || 1;
        if (MM._browser.webkit3d) {
            return  'translate3d(' +
                point.x.toFixed(0) + 'px,' + point.y.toFixed(0) + 'px, 0px)' +
                'scale3d(' + scale + ',' + scale + ', 1)';
        } else {
            return  'translate(' +
                point.x.toFixed(6) + 'px,' + point.y.toFixed(6) + 'px)' +
                'scale(' + scale + ',' + scale + ')';
        }
    };

    MM._browser = (function(window) {
        /*
         * Copy code from Leaflet's L.Browser, handles different browser and feature detections for internal Leaflet use.
         */

        var ie = !!window.ActiveXObject,
            ie6 = ie && !window.XMLHttpRequest,
            ie7 = ie && !document.querySelector,

            // terrible browser detection to work around Safari / iOS / Android browser bugs
            ua = navigator.userAgent.toLowerCase(),
            webkit = ('WebKitCSSMatrix' in window), //ua.indexOf('webkit') !== -1,
            chrome = ua.indexOf('chrome') !== -1,
            android = ua.indexOf('android') !== -1,
            android23 = ua.search('android [23]') !== -1,

            mobile = typeof orientation !== undefined + '',
            msTouch = window.navigator && window.navigator.msPointerEnabled &&
                      window.navigator.msMaxTouchPoints,
            retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
                     ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
                      window.matchMedia('(min-resolution:144dpi)').matches),

            doc = document.documentElement,
            ie3d = ie && ('transition' in doc.style),
            webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),
            gecko3d = 'MozPerspective' in doc.style,
            opera3d = 'OTransition' in doc.style,
            any3d = (ie3d || webkit3d || gecko3d || opera3d);

        var touch = (function () {

            var startName = 'ontouchstart';

            // IE10+ (We simulate these into touch* events in L.DomEvent and L.DomEvent.MsTouch) or WebKit, etc.
            if (msTouch || (startName in doc)) {
                return true;
            }

            // Firefox/Gecko
            var div = document.createElement('div'),
                supported = false;

            if (!div.setAttribute) {
                return false;
            }
            div.setAttribute(startName, 'return;');

            if (typeof div[startName] === 'function') {
                supported = true;
            }

            div.removeAttribute(startName);
            div = null;

            return supported;
        }());


        return {
            ie: ie,
            ie6: ie6,
            ie7: ie7,
            webkit: webkit,

            android: android,
            android23: android23,

            chrome: chrome,

            ie3d: ie3d,
            webkit3d: webkit3d,
            gecko3d: gecko3d,
            opera3d: opera3d,
            any3d: any3d,

            mobile: mobile,
            mobileWebkit: mobile && webkit,
            mobileWebkit3d: mobile && webkit3d,
            mobileOpera: mobile && window.opera,

            touch: touch,
            msTouch: msTouch,

            retina: retina
        };

    })(this); // use this for node.js global

    MM.moveElement = function(el, point) {
        if (MM.transformProperty) {
            // Optimize for identity transforms, where you don't actually
            // need to change this element's string. Browsers can optimize for
            // the .style.left case but not for this CSS case.
            if (!point.scale) point.scale = 1;
            if (!point.width) point.width = 0;
            if (!point.height) point.height = 0;
            var ms = MM.matrixString(point);
            if (el[MM.transformProperty] !== ms) {
                el.style[MM.transformProperty] =
                    el[MM.transformProperty] = ms;
            }
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
            // Don't set width unless asked to: this is performance-intensive
            // and not always necessary
            if (point.width && point.height && point.scale) {
                el.style.width =  Math.ceil(point.width  * point.scale) + 'px';
                el.style.height = Math.ceil(point.height * point.scale) + 'px';
            }
        }
    };

    // Events
    // Cancel an event: prevent it from bubbling
    MM.cancelEvent = function(e) {
        // there's more than one way to skin this cat
        e.cancelBubble = true;
        e.cancel = true;
        e.returnValue = false;
        if (e.stopPropagation) { e.stopPropagation(); }
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    };

    MM.coerceLayer = function(layerish) {
        if (typeof layerish == 'string') {
            // Probably a template string
            return new MM.Layer(new MM.TemplatedLayer(layerish));
        } else if ('draw' in layerish && typeof layerish.draw == 'function') {
            // good enough, though we should probably enforce .parent and .destroy() too
            return layerish;
        } else {
            // probably a MapProvider
            return new MM.Layer(layerish);
        }
    };

    // see http://ejohn.org/apps/jselect/event.html for the originals
    MM.addEvent = function(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            if (type == 'mousewheel') {
                obj.addEventListener('DOMMouseScroll', fn, false);
            }
        } else if (obj.attachEvent) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){ obj['e'+type+fn](window.event); };
            obj.attachEvent('on'+type, obj[type+fn]);
        }
    };

    MM.removeEvent = function( obj, type, fn ) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, fn, false);
            if (type == 'mousewheel') {
                obj.removeEventListener('DOMMouseScroll', fn, false);
            }
        } else if (obj.detachEvent) {
            obj.detachEvent('on'+type, obj[type+fn]);
            obj[type+fn] = null;
        }
    };

    // Cross-browser function to get current element style property
    MM.getStyle = function(el,styleProp) {
        if (el.currentStyle)
            return el.currentStyle[styleProp];
        else if (window.getComputedStyle)
            return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
    };

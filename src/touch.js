    MM.MSGestureInitialized = false;

    MM.TouchHandler = function() {
        var handler = { id: 'TouchHandler' },
            map,
            maxTapTime = 250,
            maxTapDistance = 30,
            maxDoubleTapDelay = 350,
            locations = {},
            taps = [],
            snapToZoom = true,
            wasPinching = false,
            lastPinchCenter = null,
            msTapOldTime = new Date(),
            shiftKey = false;

        function isTouchable () {
             var el = document.createElement('div');
             el.setAttribute('ongesturestart', 'return;');
             return (typeof el.ongesturestart === 'function' || MM.supportGesture());
        }

        function updateTouches(e) {
            //Check MSGesture supoort
            if(!MM.supportGesture()){
                for (var i = 0; i < e.touches.length; i += 1) {
                    var t = e.touches[i];
                    if (t.identifier in locations) {
                        var l = locations[t.identifier];
                        l.x = t.clientX;
                        l.y = t.clientY;
                        l.scale = e.scale;
                    }
                    else {
                        locations[t.identifier] = {
                            scale: e.scale,
                            startPos: { x: t.clientX, y: t.clientY },
                            x: t.clientX,
                            y: t.clientY,
                            time: new Date().getTime()
                        };
                    }
                }
            }
        }

        // Test whether touches are from the same source -
        // whether this is the same touchmove event.
        function sameTouch (event, touch) {
            return (event && event.touch) &&
                (touch.identifier == event.touch.identifier);
        }

        function touchStart(e) {
            //Check MSGesture supoort
            if(MM.supportGesture()){
                e.currentTarget._gesture.addPointer(e.pointerId);
                e.touches = new Array(1);
                e.touches[0] = e.currentTarget;
                shiftKey = e.shiftKey;
            }
            updateTouches(e);
        }

        function touchMove(e) {
            //Check MSGesture supoort
            if(!MM.supportGesture()){
                switch (e.touches.length) {
                    case 1:
                        onPanning(e.touches[0]);
                        break;
                    case 2:
                        onPinching(e);
                        break;
                }
            }else{
                onPanning(e);
                onPinching(e);
                e.touches = new Array(1);
                e.touches[0] = e.currentTarget;
                map.parent.style.cursor = 'move';
            }
            updateTouches(e);
            return MM.cancelEvent(e);
        }

        function touchEnd(e) {
            var now = new Date().getTime();
            // round zoom if we're done pinching
            if (e.touches.length === 0 && wasPinching) {
                onPinched(lastPinchCenter);
            }

            // Look at each changed touch in turn.
            for (var i = 0; i < e.changedTouches.length; i += 1) {
                var t = e.changedTouches[i],
                    loc = locations[t.identifier];
                // if we didn't see this one (bug?)
                // or if it was consumed by pinching already
                // just skip to the next one
                if (!loc || loc.wasPinch) {
                    continue;
                }

                // we now know we have an event object and a
                // matching touch that's just ended. Let's see
                // what kind of event it is based on how long it
                // lasted and how far it moved.
                var pos = { x: t.clientX, y: t.clientY },
                    time = now - loc.time,
                    travel = MM.Point.distance(pos, loc.startPos);
                if (travel > maxTapDistance) {
                    // we will to assume that the drag has been handled separately
                } else if (time > maxTapTime) {
                    // close in space, but not in time: a hold
                    pos.end = now;
                    pos.duration = time;
                    onHold(pos);
                } else {
                    // close in both time and space: a tap
                    pos.time = now;
                    onTap(pos);
                }
            }

            // Weird, sometimes an end event doesn't get thrown
            // for a touch that nevertheless has disappeared.
            // Still, this will eventually catch those ids:

            var validTouchIds = {};
            for (var j = 0; j < e.touches.length; j++) {
                validTouchIds[e.touches[j].identifier] = true;
            }
            for (var id in locations) {
                if (!(id in validTouchIds)) {
                    delete validTouchIds[id];
                }
            }

            return MM.cancelEvent(e);
        }

        // Handle the end of gesture event.
        function onMSGestureEnd(){
            map.parent.style.cursor = '';
        }

        function onHold (hold) {
            // TODO
        }

        // Handle a tap event - mainly watch for a doubleTap
        function onTap(tap) {
            if (taps.length &&
                (tap.time - taps[0].time) < maxDoubleTapDelay) {
                onDoubleTap(tap);
                taps = [];
                return;
            }
            taps = [tap];
        }

        // Handle a tap event for MSGesture
        function onMSTap(e){
            var now = new Date();

            if(now - msTapOldTime < maxDoubleTapDelay){
                map.zoomByAbout(shiftKey ? -1 : 1, new MM.Point(e.offsetX, e.offsetY));
            }
            msTapOldTime = now;
        }

        // Handle a double tap by zooming in a single zoom level to a
        // round zoom.
        function onDoubleTap(tap) {
            var z = map.getZoom(), // current zoom
                tz = Math.round(z) + 1, // target zoom
                dz = tz - z;            // desired delate

            // zoom in to a round number
            var p = new MM.Point(tap.x, tap.y);
            map.zoomByAbout(dz, p);
        }

        // Re-transform the actual map parent's CSS transformation
        function onPanning (touch) {
            var pos,
                prev;
            if(MM.supportGesture()){
               map.panBy(touch.translationX, touch.translationY);
            }else{
                pos = { x: touch.clientX, y: touch.clientY };
                prev = locations[touch.identifier];
                map.panBy(pos.x - prev.x, pos.y - prev.y);
            }
        }

        function onPinching(e) {
            if(!MM.supportGesture()){
                // use the first two touches and their previous positions
                var t0 = e.touches[0],
                    t1 = e.touches[1],
                    p0 = new MM.Point(t0.clientX, t0.clientY),
                    p1 = new MM.Point(t1.clientX, t1.clientY),
                    l0 = locations[t0.identifier],
                    l1 = locations[t1.identifier];

                // mark these touches so they aren't used as taps/holds
                l0.wasPinch = true;
                l1.wasPinch = true;

                // scale about the center of these touches
                var center = MM.Point.interpolate(p0, p1, 0.5);

                map.zoomByAbout(
                    Math.log(e.scale) / Math.LN2 -
                    Math.log(l0.scale) / Math.LN2,
                    center );

                // pan from the previous center of these touches
                var prevCenter = MM.Point.interpolate(l0, l1, 0.5);

                map.panBy(center.x - prevCenter.x,
                    center.y - prevCenter.y);
            }else{
                map.zoomByAbout(
                    e.scale - 1,
                    new MM.Point(e.offsetX, e.offsetY) );
            }

            wasPinching = true;
            lastPinchCenter = center;
        }

        // When a pinch event ends, round the zoom of the map.
        function onPinched(p) {
            // TODO: easing
            if (snapToZoom) {
                var z = map.getZoom(), // current zoom
                    tz =Math.round(z);     // target zoom
                map.zoomByAbout(tz - z, p);
            }
            wasPinching = false;
        }

        handler.init = function(x) {
            map = x;

            // Fail early if this isn't a touch device.
            if (!isTouchable()) return handler;

            if(!MM.supportGesture()){
                MM.addEvent(map.parent, 'touchstart', touchStart);
                MM.addEvent(map.parent, 'touchmove', touchMove);
                MM.addEvent(map.parent, 'touchend', touchEnd);
            }else{
                map.parent.style.msTouchAction = "none";
                MM.MSGestureInitialized = true;
                map.parent._gesture = new MSGesture();
                map.parent._gesture.target = map.parent;
                MM.addEvent(map.parent, 'MSPointerDown', touchStart);
                MM.addEvent(window, 'MSGestureChange', touchMove);
                MM.addEvent(window, 'MSGestureTap', onMSTap);
                MM.addEvent(window, 'MSGestureEnd', onMSGestureEnd);
            }
            return handler;
        };

        handler.remove = function() {
            // Fail early if this isn't a touch device.
            if (!isTouchable()) return handler;
            if(!MM.supportGesture()){
                MM.removeEvent(map.parent, 'touchstart', touchStart);
                MM.removeEvent(map.parent, 'touchmove', touchMove);
                MM.removeEvent(map.parent, 'touchend', touchEnd);
            }else{
                MM.removeEvent(map.parent, 'MSPointerDown', touchStart);
                MM.removeEvent(map.parent, 'MSGestureChange', touchMove);
            }
            return handler;
        };

        return handler;
    };

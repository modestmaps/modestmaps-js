describe('MouseWheelHandler', function() {
    var map;

    beforeEach(function() {
        div = document.createElement('div');
        div.id = +new Date();
        div.style.width = 500;
        div.style.height = 500;

        var template = 'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png';
        var subdomains = [ '', 'a.', 'b.', 'c.' ];
        var provider = new MM.TemplatedLayer(template, subdomains);

        map = new MM.Map(div, provider, [
            new MM.MouseWheelHandler()
        ]);
        map.setCenterZoom(new MM.Location(0, 0), 0);
    });

    it('zooms in the map', function() {
        runs(function() {
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -100
            });
        });

        waits(300);

        runs(function() {
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -200
            });
            expect(map.getZoom()).toEqual(1);
        });
    });

    it('can be disabled and enabled', function () {
        runs(function () {
            expect(map.getZoom()).toEqual(0);
            map.disableHandler('MouseWheelHandler');
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -100
            });
            
        });

        waits(300);

        runs(function() {
            map.enableHandler('MouseWheelHandler');
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -100
            });
        });

        waits(300);

        runs(function() {
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -200
            });
            expect(map.getZoom()).toEqual(1);
        });
    });

    it('can be removed and added back', function () {
        runs(function () {
            map.removeHandler('MouseWheelHandler');
            expect(map.getZoom()).toEqual(0);
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -100
            });           
        });

        waits(300);

        runs(function() {
            map.addHandler(new MM.MouseWheelHandler(map));
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -100
            });
        });

        waits(300);

        runs(function() {          
            happen.once(map.parent, {
                type: 'mousewheel',
                detail: -200
            });            
            expect(map.getZoom()).toEqual(1);
        });        
    });
});

describe('MouseWheelHandler', function() {
    var map;

    beforeEach(function() {
        var div = document.createElement('div');
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

    it('zooms in the map', function(done) {
        happen.once(map.parent, {
            type: 'mousewheel',
            clicks: -100
        });

        window.setTimeout(function() {
            happen.once(map.parent, {
                type: 'mousewheel',
                clicks: -200
            });
            expect(map.getZoom()).to.eql(1);
            done();
        }, 300);
    });
});

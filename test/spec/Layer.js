describe('Layer', function() {
    // Currently not testing subdomain-based templatedmapprovider, since
    // the implementation should be kind of undefined.
    it('layer can be created and destroyed', function() {
        var p = new MM.TemplatedLayer(
            'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
        var l = new MM.Layer(p);

        l.destroy();
        expect(l.map).to.eql(null);
    });

    // Currently not testing subdomain-based templatedmapprovider, since
    // the implementation should be kind of undefined.
    it('causes the map to throw requesterror when things are not accessible', function(done) {
        var fourohfour = 'http://fffffffffffffffffffffffffffffffff.org/404.png';
        var p = new MM.TemplatedLayer(fourohfour);
        p.requestManager.addCallback('requesterror', function(manager, message, c) {
            expect(manager).to.eql(p.requestManager);
            // expect(jasmine.isDomNode(message.element)).toBeTruthy();
            expect(message.url).to.eql(fourohfour);
            expect(message.url).to.eql('http://fffffffffffffffffffffffffffffffff.org/404.png');
            done();
        });
        var m = new MM.Map(document.createElement('div'), p, { x: 500, y: 500 });
        m.setCenter({ lat: 0, lon: 0 }).setZoom(5);
    });
});

describe('Location', function() {
    it('creates a location', function() {
        var p = new MM.Location(0, 1);
        expect(p.lon).to.eql(1);
        expect(p.lat).to.eql(0);
    });
    it('produces a nice string', function() {
        var p = new MM.Location(0, 1);
        expect(p.toString()).to.eql('(0.000, 1.000)');
    });
    it('can be copied', function() {
        var p = new MM.Location(0, 1);
        expect(p.lon).to.eql(1);
        expect(p.lat).to.eql(0);
        var cp = p.copy();
        expect(cp.lon).to.eql(1);
        expect(cp.lat).to.eql(0);
    });

    it('can calculate distance to another location', function() {
        var a = new MM.Location(0, 1);
        var b = new MM.Location(0, 10);

        expect(MM.Location.distance(a, b)).to.be.within(1001852, 1001854);
    });

    it('can interpolate a new location', function() {
        var a = new MM.Location(0, 1);
        var b = new MM.Location(0, 10);

        expect(MM.Location.interpolate(a, b, 0.5).lat).to.be.within(0, 10);
        expect(MM.Location.interpolate(a, b, 0.5).lon).to.be.within(5.5, 10);
    });

    it('can produce a bearing between points', function() {
        var a = new MM.Location(0, 1);
        var b = new MM.Location(0, 10);
        expect(MM.Location.bearing(a, b)).to.eql(90);
    });
});

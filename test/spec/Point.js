describe('Point', function() {
    it('creates a point', function() {
        var p = new MM.Point(0, 1);
        expect(p.x).to.eql(0);
        expect(p.y).to.eql(1);
    });

    it('provides a nice string representation of itself', function() {
        var p = new MM.Point(0, 0);
        expect(p.toString()).to.eql('(0.000, 0.000)');
    });

    it('can yield a copy', function() {
        var p = new MM.Point(0, 0);
        expect(p.copy()).to.eql(p);
    });

    it('correctly computes distance to another point', function() {
        var p = new MM.Point(0, 0);
        var q = new MM.Point(0, 10);
        expect(MM.Point.distance(p, q)).to.eql(10);

        var p1 = new MM.Point(0, 0);
        var q1 = new MM.Point(5, 2);
        expect(MM.Point.distance(p1, q1)).to.be.within(5.3851, 10);
    });

    it('correctly interpolates positions', function() {
        var p = new MM.Point(0, 0);
        var q = new MM.Point(0, 10);
        expect(MM.Point.interpolate(p, q, 0.5).y).to.eql(5);
    });

});

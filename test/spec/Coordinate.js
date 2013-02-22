describe('Coordinate', function() {
  var coordinate;

  beforeEach(function() {
    coordinate = new MM.Coordinate(0, 0, 2);
  });

  it('provides a nice string', function() {
      expect(coordinate.toString()).to.eql('(0.000, 0.000 @2.000)');
  });

  it('generates a key', function() {
      expect(typeof coordinate.toKey()).to.eql('string');
  });

  it('can be copied', function() {
      expect(coordinate.copy()).to.eql(coordinate);
  });

  it('can give its container', function() {
      var a = new MM.Coordinate(0.1, 0.1, 0);
      var b = a.container();
      expect(b.column).to.eql(0);
      expect(b.row).to.eql(0);
  });

  it('can be zoomed to a new zoom level', function() {
      var a = new MM.Coordinate(0, 0, 2);
      expect(a.zoom).to.eql(2);
      var b = a.zoomTo(4);
      expect(a.zoom).to.eql(2);
      expect(b.zoom).to.eql(4);
  });

  it('can provide a zoomed-in coordinate', function() {
      expect((coordinate.zoomBy(1)).zoom).to.eql(3);
  });

  it('can provide a zoomed-out coordinate', function() {
      expect((coordinate.zoomBy(-1)).zoom).to.eql(1);
  });

  it('can move up, left, right, and down', function() {
      var a = new MM.Coordinate(0, 0, 2);
      expect(a.column).to.eql(0);
      var b = a.right();
      expect(b.column).to.eql(1);
      expect(b.row).to.eql(0);
      var c = b.down();
      expect(c.row).to.eql(1);
      var d = c.up();
      expect(d.row).to.eql(0);
      var e = d.left();
      expect(e.column).to.eql(0);
  });

  it('will yield a container', function() {
      var oc = coordinate.copy();
      coordinate.right(0.1);
      expect(coordinate.container().column).to.eql(oc.column);
  });

});

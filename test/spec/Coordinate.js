describe('Coordinate', function() {
  var coordinate;

  beforeEach(function() {
    coordinate = new MM.Coordinate(0, 0, 2);
  });

  it('provides a nice string', function() {
      expect(coordinate.toString()).toEqual('(0.000, 0.000 @2.000)');
  });

  it('generates a key', function() {
      expect(typeof coordinate.toKey()).toEqual('string');
  });

  it('can be copied', function() {
      expect(coordinate.copy()).toEqual(coordinate);
  });

  it('can give its container', function() {
      var a = new MM.Coordinate(0.1, 0.1, 0);
      var b = a.container();
      expect(b.column).toEqual(0);
      expect(b.row).toEqual(0);
  });

  it('can be zoomed to a new zoom level', function() {
      var a = new MM.Coordinate(0, 0, 2);
      expect(a.zoom).toEqual(2);
      var b = a.zoomTo(4);
      expect(a.zoom).toEqual(2);
      expect(b.zoom).toEqual(4);
  });

  it('can provide a zoomed-in coordinate', function() {
      expect((coordinate.zoomBy(1)).zoom).toEqual(3);
  });

  it('can provide a zoomed-out coordinate', function() {
      expect((coordinate.zoomBy(-1)).zoom).toEqual(1);
  });

  it('can move up, left, right, and down', function() {
      var a = new MM.Coordinate(0, 0, 2);
      expect(a.column).toEqual(0);
      var b = a.right();
      expect(b.column).toEqual(1);
      expect(b.row).toEqual(0);
      var c = b.down();
      expect(c.row).toEqual(1);
      var d = c.up();
      expect(d.row).toEqual(0);
      var e = d.left();
      expect(e.column).toEqual(0);
  });

  it('will yield a container', function() {
      var oc = coordinate.copy();
      coordinate.right(0.1);
      expect(coordinate.container().column).toEqual(oc.column);
  });

});

describe('Extent', function() {
  var ext;

  function Receiver() { }
  Receiver.prototype.receive = function() { };

  beforeEach(function() {
    ext = new MM.Extent(-10, -10, 10, 10);

  });

  it('properly initializes its sides', function() {
      expect(ext.west).to.eql(-10);
      expect(ext.south).to.eql(-10);
      expect(ext.north).to.eql(10);
      expect(ext.east).to.eql(10);
  });

  it('expands to fit a location', function() {
      ext.encloseLocation(new MM.Location(-40, -40));
      expect(ext.west).to.eql(-40);
      expect(ext.south).to.eql(-40);
  });

  it('expands to fit locations', function() {
      ext.encloseLocations([
        new MM.Location(-40, -40),
        new MM.Location(40, 40)
      ]);
      expect(ext.west).to.eql(-40);
      expect(ext.east).to.eql(40);
      expect(ext.south).to.eql(-40);
      expect(ext.north).to.eql(40);
  });

  it('knows when it contains a location', function() {
      expect(ext.containsLocation(new MM.Location(0, 0))).to.eql(true);
      expect(ext.containsLocation(new MM.Location(0, 90))).to.eql(false);
  });

});

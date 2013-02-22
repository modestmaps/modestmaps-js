describe('Map', function() {
  var map, div, sink;

  function Receiver() { }
  Receiver.prototype.receive = function() { };

  beforeEach(function() {
    sink = new Receiver();
    div = document.createElement('div');
    div.id = +new Date();
    div.style.width = 500;
    div.style.height = 500;

    var template = 'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png';
    var subdomains = [ '', 'a.', 'b.', 'c.' ];
    var provider = new MM.TemplatedLayer(template, subdomains);

    map = new MM.Map(div, provider, new MM.Point(400, 400));
    map.setCenterZoom(new MM.Location(0, 0), 0);
  });

  it('attaches itself to a parent div', function() {
      expect(map.parent).to.eql(div);
  });

  it('can be initialized without a layer', function() {
      expect(function() {
          map = new MM.Map(document.createElement('div'));
      }).not.throwException();
  });

  describe('zoom restrictions and ranges', function() {

    it('has set a proper zoom level', function() {
        expect(map.getZoom()).to.eql(0);
    });

    it('can restrict its zoomlevel', function() {
        map.setZoomRange(5, 6);
        map.setZoom(7);
        expect(map.getZoom()).to.eql(6);
    });

    it('returns itself from chainable functions', function() {
        expect(map.setZoomRange(5, 6)).to.eql(map);
        expect(map.setZoom(7)).to.eql(map);
        expect(map.setCenter({ lat: 5, lon: 5 })).to.eql(map);
        expect(map.getZoom()).to.eql(6);
    });

  });

  it('has a center coordinate', function() {
      expect(typeof map.coordinate.row).to.eql('number');
      expect(typeof map.coordinate.column).to.eql('number');
      expect(typeof map.coordinate.zoom).to.eql('number');
  });

  it('enforces limits when setting an extent', function() {
      map.dimensions = { x: 800, y: 800 };
      map.zoom(2).center({ lat: 54.5259614, lon:15.2551187 });
      expect(map.locationPoint({ lat: 40.7143528, lon: -74.0059731 }).y)
        .to.be.within(384.9985102776103, 385);
  });

  describe('Navigation', function() {
      it('binds and calls drawn', function(done) {
          map.addCallback('drawn', function(_) {
              expect(_).to.eql(map);
              done();
          });
      });

      it('binds and calls zoomed', function(done) {
          map.addCallback('zoomed', function(_, z) {
              expect(z).to.eql(1);
              expect(_).to.eql(map);
              done();
          });

          map.zoomIn();
      });

      it('binds and calls panned', function(done) {
          map.addCallback('panned', function(x, y) {
              expect(x).to.eql(map);
              expect(y).to.eql([2,2]);
              done();
          });

          map.panBy(2, 2);
      });
  });

  describe('Layer Interface', function() {
      it('Can set a new layer at 0', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          map.setLayerAt(0, l);

          expect(map.getLayerAt(0)).to.eql(l);
      });

      it('Sets that layers parent to the first', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          map.setLayerAt(0, l);
          expect(map.parent.firstChild).to.eql(l.parent);
      });

      function checkOrder() {
          var layers = map.getLayers();
          for (var i = 0; i < layers.length; i++) {
              expect(map.parent.childNodes[i]).to.eql(layers[i].parent);
          }
      }

      it('Can insert a new layer at 1 and it will go after the first', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          expect(map.insertLayerAt(1, l)).to.eql(map);
          expect(map.getLayerAt(1)).to.eql(l);
          expect(map.getLayers().length).to.eql(2);
          checkOrder();
      });

      it('Can insert a new layer at 0', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          expect(map.insertLayerAt(0, l)).to.eql(map);
          expect(map.getLayerAt(0)).to.eql(l);
          expect(map.getLayers().length).to.eql(2);
          checkOrder();
      });

      it('Can remove a new layer at 0', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          expect(map.insertLayerAt(0, l)).to.eql(map);

          expect(map.getLayerAt(0)).to.eql(l);
          expect(map.getLayers().length).to.eql(2);
          checkOrder();

          expect(map.removeLayerAt(0)).to.eql(map);
          expect(map.getLayers().length).to.eql(1);
          checkOrder();
      });

      it('Can swap a new layer at 0', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          var l1 = map.getLayerAt(0);

          expect(map.insertLayerAt(1, l)).to.eql(map);
          expect(map.swapLayersAt(0, 1)).to.eql(map);

          expect(map.getLayerAt(0)).to.eql(l);
          expect(map.getLayerAt(1)).to.eql(l1);
          expect(map.getLayers().length).to.eql(2);
          checkOrder();
      });

      it('Can set layers below the highest index', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          var l2 = new MM.TemplatedLayer(
              'http://a.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);


          expect(map.insertLayerAt(1, l)).to.eql(map);
          expect(map.setLayerAt(0, l2)).to.eql(map);

          expect(map.getLayers().length).to.eql(2);
          checkOrder();
      });

      it('Can set layers at the highest index', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          var l2 = new MM.TemplatedLayer(
              'http://a.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);


          expect(map.insertLayerAt(1, l)).to.eql(map);
          expect(map.setLayerAt(1, l2)).to.eql(map);

          expect(map.getLayers().length).to.eql(2);
          checkOrder();
      });

      it('Can set layers in the middle', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          var l2 = new MM.TemplatedLayer(
              'http://a.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);
          var l3 = new MM.TemplatedLayer(
              'http://a.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          expect(map.addLayer(l)).to.eql(map);
          expect(map.addLayer(l2)).to.eql(map);
          expect(map.setLayerAt(1, l3)).to.eql(map);
          expect(map.getLayers().length).to.eql(3);
          checkOrder();
      });

      it('Can remove a specific layer', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a']);

          expect(map.insertLayerAt(1, l)).to.eql(map);
          expect(map.removeLayer(l)).to.eql(map);

          expect(map.getLayers().length).to.eql(1);
      });

      it('Can set and get a named layer', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a'], 'name');
          map.addLayer(l);
          expect(map.getLayer('name')).to.eql(l);
      });

      it('Can remove a named layer', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a'], 'name');
          map.addLayer(l);
          var numLayers = map.getLayers().length;
          expect(map.removeLayer('name').getLayers().length).to.eql(numLayers - 1);
      });

      it('Can disable and enable a layer by index', function() {
          map.disableLayerAt(0);
          expect(map.getLayerAt(0).enabled).to.eql(false);
          expect(map.getLayerAt(0).parent.style.display).to.eql('none');
          map.enableLayerAt(0);
          expect(map.getLayerAt(0).enabled).to.eql(true);
          expect(map.getLayerAt(0).parent.style.display).not.to.eql('none');
      });

      it('Can disable and enable a layer by name', function() {
          var l = new MM.TemplatedLayer(
              'http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a'], 'name');
          map.addLayer(l).disableLayer('name');
          expect(map.getLayer('name').enabled).to.eql(false);
          expect(map.getLayer('name').parent.style.display).to.eql('none');
          map.enableLayerAt(1);
          expect(map.getLayer('name').enabled).to.eql(true);
          expect(map.getLayer('name').parent.style.display).not.to.eql('none');
      });
  });

  it('can transform an extent into a coord', function() {
      expect(map.extentCoordinate([
        { lat: -10, lon: -10 },
        { lat: 10, lon: 10 }])).to.eql(new MM.Coordinate(8, 8, 4));
  });

  it('binds and calls resized', function(done) {
      map.addCallback('resized', function(map, size) {
        expect(map).to.eql(map);
        expect(size).to.eql(new MM.Point(200, 300));
        done();
      });

      map.setSize({
          x: 200, y: 300
      });
  });

  it('can be cleanly destroyed', function() {
      map.destroy();
      expect(map.layers.length).to.eql(0);
  });
});

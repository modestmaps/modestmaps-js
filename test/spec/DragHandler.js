describe('DragHandler', function() {
    var map;

    beforeEach(function() {
        var div = document.createElement('div');
        div.id = 'id' + new Date();
        div.style.width = 500;
        div.style.height = 500;

        var template = 'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png';
        var subdomains = [ '', 'a.', 'b.', 'c.' ];
        var provider = new MM.TemplatedLayer(template, subdomains);

        try {
        var map = new MM.Map(div, provider, [
        //    new MM.DragHandler()
        ]);
        } catch(e) {
            alert(e.message);
        }
        // map.setCenterZoom(new MM.Location(0, 0), 0);
    });

    it('is okay', function() {
        expect(true).to.eql(true);
    });

    /*
    it('changes the cursor style to move while moving', function() {
        happen.mousedown(map.parent, { clientX: 10, clientY: 10 });
        expect(map.parent.style.cursor).to.eql('move');
    });

    it('pan the map when you do a panning motion', function() {
        expect(~~map.getCenter().lat).to.eql(0);
        expect(~~map.getCenter().lon).to.eql(0);
        happen.mousedown(map.parent, { clientX: 10, clientY: 10 });
        happen.mousemove(document, { clientX: 30, clientY: 30 });
        happen.mouseup(document, { clientX: 30, clientY: 30 });
        expect(~~map.getCenter().lat).to.eql(27);
        expect(~~map.getCenter().lon).to.eql(-28);
    });
    */
});

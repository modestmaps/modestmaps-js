function Receiver() { }
Receiver.prototype.receive = function() { };

describe('Util', function() {
    it('can extend an object', function() {
        function bob() {}
        bob.prototype.hello = function() {
            return 'hello world';
        };
        function alice() {}
        var a = MM.extend(alice, bob);
        var alice_instance = new a();
        var bob_instance = new bob();
        expect(alice_instance.hello()).to.eql('hello world');
        expect(bob_instance.hello()).to.eql('hello world');
    });

    it('can get a frame', function(done) {
        MM.getFrame(function() {
            done();
        });
    });

    it('can cancel events', function() {
        if (document.createEvent) {
            var d = document.createElement('div');
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window,
              0, 0, 0, 0, 0, false, false, false, false, 0, null);
            var evt_two = document.createEvent("MouseEvents");
            evt_two.initMouseEvent("click", true, true, window,
              0, 0, 0, 0, 0, false, false, false, false, 0, null);
            MM.cancelEvent(evt);
            expect(d.dispatchEvent(evt)).to.eql(false);
            expect(d.dispatchEvent(evt_two)).to.eql(true);
        }
    });

    it('coerces strings into layers', function() {
        expect(MM.coerceLayer('http://openstreetmap.org/{Z}/{X}/{Y}.png') instanceof MM.Layer).to.eql(true);
    });

    it('coerces providers into layers', function() {
        expect(MM.coerceLayer(new MM.Template('http://openstreetmap.org/{Z}/{X}/{Y}.png')) instanceof MM.Layer).to.eql(true);
    });

    it('can get style properties', function() {
        var d = document.createElement('div');
        d.style.display = 'block';
        document.body.appendChild(d);
        expect(MM.getStyle(d, 'display')).to.eql('block');
        document.body.removeChild(d);
        expect(MM.getStyle(d, 'display')).to.eql('');
    });
});

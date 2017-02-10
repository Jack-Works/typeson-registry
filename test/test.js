var assert = require('chai').assert,
    expect = require('chai').expect,
    Typeson = require('typeson'),
    arrayFrom = require('../utils/array-from-iterator');

describe('Built-in', function() {
  describe('Date', function () {
    it('should get back a real Date instance with the original time milliseconds', function () {
        var typeson = new Typeson().register(require('../types/date'));
        var json = typeson.stringify(new Date(1234567));
        var obj = typeson.parse(json);
        expect(obj).to.be.an.instanceOf(Date);
        expect(obj.getTime()).to.equal(1234567);
    });
  });

  describe('Error', function () {
    it('should get back real Error instances corresponding to their types and with the original name and message', function () {
        var typeson = new Typeson().register([require('../types/error'), require('../types/errors.js')]);
        var json = typeson.stringify({
            e1: new Error("Error1"),
            e2: new TypeError("Error2"),
            e3: new RangeError("Error3"),
            e4: new SyntaxError("Error4"),
            e5: new ReferenceError("Error5")
        });
        var obj = typeson.parse(json);
        expect(obj.e1).to.be.an.instanceOf(Error);
        expect(obj.e1.name).to.equal("Error");
        expect(obj.e2).to.be.an.instanceOf(TypeError);
        expect(obj.e2.name).to.equal("TypeError");
        expect(obj.e3).to.be.an.instanceOf(RangeError);
        expect(obj.e3.name).to.equal("RangeError");
        expect(obj.e4).to.be.an.instanceOf(SyntaxError);
        expect(obj.e4.name).to.equal("SyntaxError");
        expect(obj.e5).to.be.an.instanceOf(ReferenceError);
        expect(obj.e5.name).to.equal("ReferenceError");
    });
  });

  describe('Map', function () {
    it('should get back a real Map instance with the original data and use complex types also in contained items', function () {
        var typeson = new Typeson().register(require('../presets/builtin'));
        var map = new Map();
        var error = new Error("Error here"),
            date = new Date(10000);

        map.set(error, date);
        var json = typeson.stringify({m: map});
        var obj = typeson.parse(json);
        expect(obj.m).to.be.an.instanceOf(Map);
        expect(arrayFrom(obj.m.keys())[0]).to.be.an.instanceOf(Error);
        expect(arrayFrom(obj.m.values())[0]).to.be.an.instanceOf(Date);
    });
  });

  describe('Set', function () {
    it('should get back a real Set instance with the original data and use complex types also in contained items', function () {
        var typeson = new Typeson().register(require('../presets/builtin'));
        var set = new Set();
        var error = new Error("Error here"),
            date = new Date(10000),
            str = "",
            o = {
                a: error
            };

        set.add(o);
        set.add(date);
        set.add(str);

        var json = typeson.stringify({s: set});
        var obj = typeson.parse(json);

        expect(obj.s).to.be.an.instanceOf(Set);

        var a = arrayFrom(obj.s.values());
        expect(a[0].a).to.be.an.instanceOf(Error);
        expect(a[1]).to.be.an.instanceOf(Date);
        expect(a[2]).to.be.a('string');
    });
  });

  describe('TypedArrays', function(){
    describe('Float64Array', function() {
        it('should get back real Float64Array instance with original array content', function () {
            var typeson = new Typeson().register([
                require('../types/arraybuffer'),
                require('../types/typed-arrays')
            ]);
            var a = new Float64Array(3);
            a[0] = 23.8;
            a[1] = -15;
            a[2] = 99;
            var json = typeson.stringify({a: a});
            var obj = typeson.parse(json);
            expect(obj.a).to.be.an.instanceOf(Float64Array);
            expect(obj.a.length).to.equal(3);
            expect(obj.a[0]).to.equal(23.8);
            expect(obj.a[1]).to.equal(-15);
            expect(obj.a[2]).to.equal(99);
        });
    });

    describe('Uint16 arrays over invalid unicode range', function() {
       it('should work to use any 16-bit number no matter whether it is invalid unicode or not', function(){
            var typeson = new Typeson().register([
                require('../types/arraybuffer'),
                require('../types/typed-arrays')
            ]);
            var a = new Uint16Array(0x0900),
                i = a.length;
            while (i--) a[i] = i + 0xd780;
            var json = typeson.stringify({a: a});
            //console.log(json);

            // Emulate a textencoder that eliminates invalid UTF chars
            i = json.length;
            var copy = new Uint16Array(i);
            while (i--) {
                var ch = json.charCodeAt(i);
                copy[i] = ch >= 0xd800 && ch < 0xe000 ? 0xfffd : ch;
            }
            json = String.fromCharCode.apply(null, copy);

            var obj = typeson.parse(json);
            expect(obj.a).to.be.an.instanceOf(Uint16Array);
            expect(obj.a.length).to.equal(a.length);
            obj.a.forEach(function (x, i) {
                expect(x).to.equal(i + 0xd780);
            });
       });
    });

    describe("Int8 arrays with odd length", function () {
        it('should be possible to use an odd length of an Int8Array', function() {
            var typeson = new Typeson().register([
                require('../types/arraybuffer'),
                require('../types/typed-arrays')
            ]);
            var a = new Int8Array(3);
            a[0] = 0;
            a[1] = 1;
            a[2] = 2;
            var json = typeson.stringify(a);
            console.log(json);
            var a2 = typeson.parse(json);
            expect(a2.length).to.equal(3);
            expect(a2[0]).to.equal(0);
            expect(a2[1]).to.equal(1);
            expect(a2[2]).to.equal(2);
        });
    });
  });
  describe("undefined type", function () {
      it('should be possible to restore `undefined` values', function() {
          var typeson = new Typeson().register([
              require('../types/undefined')
          ]);
          var a = [undefined, {b: undefined, c: [3, null, , undefined]}];
          var json = typeson.stringify(a);
          var a2 = typeson.parse(json);
          expect(a2.length).to.equal(2);
          expect(a2[0]).to.equal(undefined);
          expect(a2[1].b).to.equal(undefined);
          expect(a2[1].c[1]).to.not.equal(undefined);
          expect(a2[1].c[2]).to.equal(undefined);
          expect(a2[1].c[3]).to.equal(undefined);

          expect('0' in a2).to.be.true;
          expect('b' in a2[1]).to.be.true;
          expect('1' in a2[1].c).to.be.true;
          expect('2' in a2[1].c).to.be.false;
          expect('3' in a2[1].c).to.be.true;
      });
  });
});

describe('Structured cloning', function () {
    it('should work with Structured cloning with throwing', function () {
        var typeson = new Typeson().register([require('../presets/structured-cloning-throwing')]);
        var caught = false;
        global.ImageData = function ImageData () {}; // Shim for Node
        try {
            typeson.stringify(new Error('test'));
        } catch (err) {
            caught = true;
        }
        assert(caught, 'Caught error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"Date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
    });
    it('should work with Structured cloning without throwing', function () {
        var typeson = new Typeson().register([require('../presets/structured-cloning')]);
        var caught = false;
        global.ImageData = function ImageData () {}; // Shim for Node
        try {
            typeson.stringify(new Error('test'));
        } catch (err) {
            console.log(err);
            caught = true;
        }
        assert(!caught, 'Did not catch error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"Date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
    });
});
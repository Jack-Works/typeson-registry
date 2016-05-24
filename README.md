# typeson-registry
Official registry of typeson types and their encapsulation definitions.

* Types listed under `types`
* Presets listed under `presets`

# Usage

```js
var Typeson = require ('typeson');
var TSON = new Typeson().register([
    require('../types/date'),
    require('../types/error'),
    require('../types/regexp'),
    require('../types/arraybuffer')
]);

var tson = TSON.stringify({
    Hello: "world",
    date: new Date(),
    error: new Error(),
    inner: {
        x: /foo/ig,
        bin: new Uint8Array(64)
    }
}, null, 2);

console.log(tson);        
/* Output:

{
  "Hello": "world",
  "date": 1464049031538,
  "error": {
    "name": "Error",
    "message": ""
  },
  "inner": {
    "x": {
      "source": "foo",
      "flags": "gi"
    },
    "bin": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
  },
  "$types": {
    "date": "Date",
    "error": "Error",
    "inner.x": "RegExp",
    "inner.bin": "Uint8Array"
  }
}
*/

var parsedBack = TSON.parse(tson);

assert(parsedBack.date instanceof Date);
assert(parsedBack.binary instanceof Uint8Array);

```

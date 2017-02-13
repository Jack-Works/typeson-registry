/** ImageData is browser / DOM specific.
 * Requires arraybuffer.js in order for the returned Uint8ClampedArray to be encapsulated as well,
 * or if use with socket.io, socket.io will take care of that.
*/
var Typeson = require('typeson');
exports.ImageData = [
    function (x) { return Typeson.toStringTag(x) === 'ImageData'; },
    function (d) { return {array: d.data, width: d.width, height: d.height}; },
    function (o) { return new ImageData(o.array, o.width, o.height); }
];

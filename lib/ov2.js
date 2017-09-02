var Readable = require('stream').Readable;
var diacritics = require('diacritics');

exports = module.exports = ov2;
exports.contentType = 'application/octet-stream';
exports.extension = 'ov2';

/*
OV2 file format

Coordinates are stored as 4−byte integers representing a WGS84 longitude or latitude, multiplied by
100,000 and rounded to the nearest integer.

SIMPLE POI RECORD:
1 byte      T: type (always 2)
4 bytes     L: length of this record in bytes (including the T and L fields)
4 bytes     X: longitude coordinate of the POI
4 bytes     Y: latitude coordinate of the POI
L−13 bytes  Name: zero−terminated ASCII string specifying the name of the POI

http://www.poieditor.com/poi_convert/
*/

function toCoord(f) {
  return Math.round(f * 100000);
}

function step2record(step) {
  var name = diacritics.remove(step.name || ''),
    len = 14 + name.length, // 13 fixed prefix - 1 + 4 + 4 + 4 and 1 byte suffix - 0
    b = new Buffer(len),
    pos = 0;

  b.writeUInt8(2, pos);
  pos += 1;

  b.writeUInt32LE(len, pos);
  pos += 4;

  b.writeInt32LE(toCoord(step.coordinates.lon), pos);
  pos += 4;

  b.writeInt32LE(toCoord(step.coordinates.lat), pos);
  pos += 4;

  b.write(name, pos, name.length, 'ascii');
  pos += name.length;

  b.writeUInt8(0, pos);

  return b;
}

function isValid(step) {
  return step.coordinates;
}

function ov2(out, options) {
  var steps = options.routes[0].points;

  var currentLine = 0;

  var stream = new Readable({
    read: function read() {
      var step;
      while (currentLine < steps.length) {
        step = steps[currentLine++];
        if (!isValid(step)) {
          continue;
        }
        if (!this.push(step2record(step))) {
          break;
        }
      }
      if (currentLine >= steps.length) {
        this.push(null);
      }
    }
  });

  stream.pipe(out);
}

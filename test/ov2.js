var fs = require('fs');
var path = require('path');
var ov2 = require('../');

function loadFile(file) {
  var filename = path.resolve(__dirname, file);
  return fs.readFileSync(filename);
}

/**
 * Compare buffers
 */
function compareOV2(actual, expected) {
  var i;
  actual.should.have.length(expected.length);
  for(i = 0; i < actual.length; i += 1) {
    actual.readUInt8(i).should.eql(expected.readUInt8(i));
  }
}

describe('furkot-tomtom-ov2 node module', function () {
  it('simple trip', function() {
    var t = require('./fixtures/simple-trip.json'),
      generated = ov2(t),
      expected = loadFile('./fixtures/simple.ov2');

    compareOV2(generated, expected);
  });

  it('multi trip', function() {
    var t = require('./fixtures/multi-trip.json'),
      generated = ov2(t),
      expected = loadFile('./fixtures/multi.ov2');

    compareOV2(generated, expected);
  });
});

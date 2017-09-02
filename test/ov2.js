var fs = require('fs');
var path = require('path');

var WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

var ov2 = require('../');

function loadFile(file) {
  var filename = path.resolve(__dirname, file);
  return fs.readFileSync(filename);
}

function generateOV2(t, fn) {
  var ostream = new WritableStreamBuffer();
  ov2(ostream, t);
  ostream
  .on('error', fn)
  .on('finish', function () {
    fn(null, ostream.getContents());
  });
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

describe('furkot-tomtom-ov2 node module', function (done) {
  it('simple trip', function() {
    var t = require('./fixtures/simple-trip.json'),
      expected = loadFile('./fixtures/simple.ov2');

    generateOV2(t, function(err, generated) {
      compareOV2(generated, expected);
      done(err);
    });

  });

  it('multi trip', function (done) {
    var t = require('./fixtures/multi-trip.json'),
      expected = loadFile('./fixtures/multi.ov2');

    generateOV2(t, function(err, generated) {
      compareOV2(generated, expected);
      done(err);
    });

  });
});

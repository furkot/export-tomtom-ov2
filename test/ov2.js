const { readFileSync } = require('fs');
const path = require('path');

const ov2 = require('../');

function loadFile(file) {
  const filename = path.resolve(__dirname, file);
  return readFileSync(filename);
}

function generateOV2(t) {
  let result = new Uint16Array(0);
  for (const buffer of ov2(t)) {
    let b = new Uint8Array(buffer);
    let len = result.length + b.length;
    let r = new Uint8Array(len);
    r.set(result, 0);
    r.set(b, result.length);
    result = r;
  }
  return result;
}

/**
 * Compare buffers
 */
function compareOV2(actual, expected) {
  actual.should.have.length(expected.length);
  for (let i = 0; i < actual.length; i += 1) {
    actual[i].should.eql(expected.readUInt8(i), `byte at ${i}`);
  }
}

describe('furkot-tomtom-ov2 node module', function () {
  it('simple trip', function () {
    const t = require('./fixtures/simple-trip.json');

    const expected = loadFile('./fixtures/simple.ov2');
    const generated = generateOV2(t);

    compareOV2(generated, expected);
  });

  it('multi trip', function () {
    const t = require('./fixtures/multi-trip.json');

    const expected = loadFile('./fixtures/multi.ov2');
    const generated = generateOV2(t);

    compareOV2(generated, expected);
  });
});

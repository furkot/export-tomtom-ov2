import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ov2 from '../lib/ov2.js';

function loadFile(file) {
  const filename = path.resolve(import.meta.dirname, file);
  return readFileSync(filename);
}

function loadJSON(file) {
  return JSON.parse(loadFile(file));
}

function generateOV2(t) {
  let result = new Uint16Array(0);
  for (const buffer of ov2(t)) {
    const b = new Uint8Array(buffer);
    const len = result.length + b.length;
    const r = new Uint8Array(len);
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
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i += 1) {
    assert.equal(actual[i], expected.readUInt8(i), `byte at ${i}`);
  }
}

test('simple trip', () => {
  const data = loadJSON('./fixtures/simple-trip.json');
  const expected = loadFile('./fixtures/simple.ov2');

  const generated = generateOV2(data);
  compareOV2(generated, expected);
});

test('multi trip', () => {
  const data = loadJSON('./fixtures/multi-trip.json');
  const expected = loadFile('./fixtures/multi.ov2');

  const generated = generateOV2(data);
  compareOV2(generated, expected);
});

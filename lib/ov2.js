import diacritics from 'diacritics';

ov2.contentType = 'application/octet-stream';
ov2.extension = 'ov2';

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

const HEADER_LEN = 13; // 1 + 4 + 4 + 4

function step2record(step) {
  const name = diacritics.remove(step.name || '');

  // 13 fixed prefix + name + and 1 byte suffix '0'
  const len = HEADER_LEN + name.length + 1;

  const b = new ArrayBuffer(len);
  const dv = new DataView(b, 0);

  dv.setUint8(0, 2);
  dv.setUint32(1, len, true);
  dv.setInt32(5, toCoord(step.coordinates.lon), true);
  dv.setInt32(9, toCoord(step.coordinates.lat), true);
  for (let i = 0; i < name.length; i++) {
    dv.setUint8(i + HEADER_LEN, name.charCodeAt(i));
  }
  dv.setUint8(len - 1, 0);

  return b;
}

function isValid({ coordinates }) {
  return coordinates && (coordinates.lat != null) & (coordinates.lon != null);
}

export default function* ov2({ routes }) {
  const steps = routes[0].points;

  for (const step of steps) {
    if (isValid(step)) {
      yield step2record(step);
    }
  }
}

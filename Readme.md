[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# furkot-tomtom-ov2

Generate TomTom OV2 files from [Furkot] trip data.

## Install

```sh
$ npm install --save furkot-tomtom-ov2
```

## Usage

```js
const ov2 = require('furkot-tomtom-ov2');

for(const buffer of ov2(trip)) {
  // buffer is ArrayBuffer to be streamed/processed
}
```

## License

MIT © [code42day](https://code42day.com)

[Furkot]: https://trips.furkot.com

[npm-image]: https://img.shields.io/npm/v/furkot-tomtom-ov2.svg
[npm-url]: https://npmjs.org/package/furkot-tomtom-ov2

[build-image]: https://img.shields.io/github/workflow/status/furkot/furkot-driving-log/check
[build-url]: https://github.com/furkot/furkot-driving-log/actions/workflows/check.yaml

[deps-image]: https://img.shields.io/librariesio/github/furkot/furkot-driving-log
[deps-url]: https://libraries.io/npm/furkot-driving-log

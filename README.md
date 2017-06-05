# StreamTitle
Simple library to retrieve song title from SHOUTcast v1 or v2 and Icecast server.

[![Build Status](https://travis-ci.org/fabioricali/StreamTitle.svg?branch=master)](https://travis-ci.org/fabioricali/StreamTitle) [![Coverage Status](https://coveralls.io/repos/github/fabioricali/StreamTitle/badge.svg?branch=master)](https://coveralls.io/github/fabioricali/StreamTitle?branch=master)

## Installation

```javascript
npm install stream-title --save
```

## Example
### SHOUTcast v1
```javascript
var streamTitle = require('stream-title');

streamTitle({
    url: 'http://shoutcastserver:port',
    type: 'shoutcast'
}).then(function (title) {
    console.log(title);
}).catch(function (err) {
    console.log(err);
});
```

### SHOUTcast v2
```javascript
var streamTitle = require('stream-title');

streamTitle({
    url: 'http://shoutcastserver:port',
    type: 'shoutcast2',
    sid: 1
}).then(function (title) {
    console.log(title);
}).catch(function (err) {
    console.log(err);
});
```

### Icecast v2.4.x
```javascript
var streamTitle = require('stream-title');

streamTitle({
    url: 'http://icecastserver:port',
    type: 'icecast',
    mount: 'mymount'
}).then(function (title) {
    console.log(title);
}).catch(function (err) {
    console.log(err);
});
```

### Options

Name | Type | Description
-|-|-
type | string | required, server type that can be "shoutcast", "shoutcast2" or "icecast"
url | string | required, server url
sid | integer | required for shoutcast2, stream id
mount | string | required for incecast, mount name

## License
StreamTitle is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

## Author
[Fabio Ricali](http://rica.li)
# s3Urls

From bucket/key to URL and the other way around

## Usage

```javascript
var s3urls = require('s3urls');
var assert = require('assert');

var url = s3urls.toUrl('my-bucket', 'some/key');
assert.deepEqual(url, {
  's3': 's3://my-bucket/some/key',
  'bucket-in-path': 'https://s3.amazonaws.com/my-bucket/some/key',
  'bucket-in-host': 'https://my-bucket.s3.amazonaws.com/some/key'
});

var result = s3urls.fromUrl('https://s3.amazonaws.com/my-bucket/some/key');
assert.deepEqual(result, {
  Bucket: 'my-bucket',
  Key: 'some/key'
});
```

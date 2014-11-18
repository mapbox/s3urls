var test = require('tape').test;
var s3Urls = require('..');

test('toUrl', function(t) {
  var result = s3Urls.toUrl('bucket', 'key');
  t.equal(result.s3, 's3://bucket/key', 'expected s3 url');
  t.equal(result['bucket-in-path'], 'https://s3.amazonaws.com/bucket/key', 'expected bucket-in-path url');
  t.equal(result['bucket-in-host'], 'https://bucket.s3.amazonaws.com/key', 'expected bucket-in-host url');
  t.end();
});

test('fromUrl: unrecognized url', function(t) {
  var result = s3Urls.fromUrl('http://www.google.com');
  t.notOk(result.Bucket, 'no bucket');
  t.notOk(result.Key, 'no key');
  t.end();
});

test('fromUrl: s3 style', function(t) {
  var result = s3Urls.fromUrl('s3://bucket/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-path style', function(t) {
  var result = s3Urls.fromUrl('https://s3.amazonaws.com/bucket/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host style', function(t) {
  var result = s3Urls.fromUrl('https://bucket.s3.amazonaws.com/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

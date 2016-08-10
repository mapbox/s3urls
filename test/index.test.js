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

test('fromUrl: bucket-in-path style in cn-north-1', function(t) {
  var result = s3Urls.fromUrl('https://s3.cn-north-1.amazonaws.com.cn/bucket/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-path style in ap-southeast-1', function(t) {
  var result = s3Urls.fromUrl('https://s3.ap-southeast-1.amazonaws.com/bucket/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-path dashed in cn-north-1', function(t) {
  var result = s3Urls.fromUrl('https://s3-cn-north-1.amazonaws.com.cn/bucket/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-path dashed in ap-southeast-1', function(t) {
  var result = s3Urls.fromUrl('https://s3-ap-southeast-1.amazonaws.com/bucket/the/whole/key');
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

test('fromUrl: bucket-in-host style in cn-north-1', function(t) {
  var result = s3Urls.fromUrl('https://bucket.s3.cn-north-1.amazonaws.com.cn/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host style in ap-southeast-1', function(t) {
  var result = s3Urls.fromUrl('https://bucket.s3.ap-southeast-1.amazonaws.com/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host dashed in cn-north-1', function(t) {
  var result = s3Urls.fromUrl('https://bucket.s3-cn-north-1.amazonaws.com.cn/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host dashed in ap-southeast-1', function(t) {
  var result = s3Urls.fromUrl('https://bucket.s3-ap-southeast-1.amazonaws.com/the/whole/key');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('convert: in-path to s3', function(t) {
  var result = s3Urls.convert('https://s3.amazonaws.com/bucket/the/whole/key', 's3');
  t.equal(result, 's3://bucket/the/whole/key');
  t.end();
});

test('convert: tileset templates', function(t) {
  t.equal(s3Urls.convert('https://s3.amazonaws.com/bucket/{z}/{x}/{y}', 's3'), 's3://bucket/{z}/{x}/{y}');
  t.end();
});

test('valid', function(t) {
  t.notOk(s3Urls.valid('http://www.google.com'), 'not on s3');
  t.ok(s3Urls.valid('https://s3.amazonaws.com/bucket/the/whole/key'), 'bucket in path');
  t.ok(s3Urls.valid('https://bucket.s3.amazonaws.com/the/whole/key'), 'bucket in host');
  t.ok(s3Urls.valid('http://bucket.s3.amazonaws.com/the/whole/key'), 'http');
  t.ok(s3Urls.valid('s3://bucket/the/whole/key'), 's3');
  t.end();
});

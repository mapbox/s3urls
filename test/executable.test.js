var test = require('tape').test;
var exec = require('child_process').exec;
var path = require('path');
var cmd = path.resolve(__dirname, '..', 'bin', 's3urls.js');

test('bad command', function(t) {
  exec(cmd + ' ham', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Invalid command\n', 'expected message');
    t.end();
  });
});

test('toUrl: bad args', function(t) {
  exec(cmd + ' to-url', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Must specify bucket and key\n', 'expected message');
    t.end();
  });
});

test('toUrl: all types', function(t) {
  expected = [
    's3://bucket/key',
    'https://s3.amazonaws.com/bucket/key',
    'https://bucket.s3.amazonaws.com/key'
  ];

  exec(cmd + ' to-url bucket key', function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    stdout.trim().split('\n').forEach(function(url) {
      t.ok(expected.indexOf(url) > -1, 'expected url');
    });
    t.end();
  });
});

test('toUrl: s3 type', function(t) {
  expected = 's3://bucket/key';

  exec(cmd + ' to-url bucket key --type s3', function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    t.equal(stdout, expected + '\n', 'expected url');
    t.end();
  });
});

test('toUrl: bucket-in-path type', function(t) {
  expected = 'https://s3.amazonaws.com/bucket/key';

  exec(cmd + ' to-url bucket key --type bucket-in-path', function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    t.equal(stdout, expected + '\n', 'expected url');
    t.end();
  });
});

test('toUrl: bucket-in-host type', function(t) {
  expected = 'https://bucket.s3.amazonaws.com/key';

  exec(cmd + ' to-url bucket key --type bucket-in-host', function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    t.equal(stdout, expected + '\n', 'expected url');
    t.end();
  });
});

test('fromUrl: no url', function(t) {
  exec(cmd + ' from-url', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: No url given\n', 'expected message');
    t.end();
  });
});

test('fromUrl: unrecognized url', function(t) {
  exec(cmd + ' from-url http://www.google.com', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Unrecognizable S3 url\n', 'expected message');
    t.end();
  });
});

test('fromUrl: success', function(t) {
  exec(cmd + ' from-url s3://bucket/key', function(err, stdout, stderr) {
    t.equal(stdout, JSON.stringify({
      Bucket: 'bucket',
      Key: 'key'
    }) + '\n', 'expected result');
    t.end();
  });
});

test('convert: no url', function(t) {
  exec(cmd + ' convert', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: No url given\n', 'expected message');
    t.end();
  });
});

test('convert: unrecognized url', function(t) {
  exec(cmd + ' convert http://www.google.com', function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Unrecognizable S3 url\n', 'expected message');
    t.end();
  });
});

test('convert: default success', function(t) {
  exec(cmd + ' convert s3://bucket/key', function(err, stdout, stderr) {
    t.equal(stdout, 'https://bucket.s3.amazonaws.com/key\n', 'expected result');
    t.end();
  });
});

test('convert: typed success', function(t) {
  exec(cmd + ' convert s3://bucket/key --type bucket-in-path', function(err, stdout, stderr) {
    t.equal(stdout, 'https://s3.amazonaws.com/bucket/key\n', 'expected result');
    t.end();
  });
});

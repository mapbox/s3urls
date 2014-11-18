#!/usr/bin/env node

var s3urls = require('..');
var argv = require('minimist')(process.argv.slice(2));

function usage() {
  console.log('s3urls from-url <url>');
  console.log('s3urls to-url <bucket> <key> [--type=[s3|bucket-in-path|bucket-in-host]]');
}

function fail(msg) {
  console.error(msg);
  usage();
  process.exit(1);
}

var command = argv._[0];
if (command !== 'to-url' && command !== 'from-url')
  return fail('ERROR: Invalid command');

if (command === 'from-url') {
  var url = argv._[1];
  if (!url) return fail('ERROR: No url given');

  var result = s3urls.fromUrl(url);
  if (!result.Bucket || !result.Key) return fail('ERROR: unrecognizable S3 url');

  return console.log(JSON.stringify(result));
}

if (command === 'to-url') {
  var bucket = argv._[1];
  var key = argv._[2];

  if (!bucket || !key) return fail('ERROR: Must specify bucket and key');

  var result = s3urls.toUrl(bucket, key);
  if (argv.type) return console.log(result[argv.type]);

  for (var k in result) {
    console.log(result[k]);
  }
}

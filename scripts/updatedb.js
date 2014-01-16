
var Batch = require('batch');
var http = require('http');
var path = require('path');
var fs = require('fs');

var data = path.join(__dirname, '..', 'data');

var files = [
	'geoip-city-names.dat',
	'geoip-city.dat',
	'geoip-city6.dat',
	'geoip-country.dat',
	'geoip-country6.dat'
];

var batch = new Batch;

console.log('fetching geoip data');
files.forEach(function(file){
	batch.push(function(done){
		var url = 'http://geoip.segment.io/' + file;
		var req = http.get(url);

		req.on('response', function(res){
			var dst = __dirname + '/../data/' + file;
			console.log('GET %s (%s) -> %s', url, res.statusCode, dst);
			var out = fs.createWriteStream(dst);
			res.pipe(out);
			res.on('end', done);
		});
	});
});

batch.end(function(err){
	if (err) throw err;
	console.log('done!');
});
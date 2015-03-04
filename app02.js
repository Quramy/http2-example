var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var url = require('url');

// We cache one file to be able to do simple performance tests without waiting for the disk
var cachedFile = fs.readFileSync(path.join(__dirname, './app02.js'));
//var cachedUrl = '/server.js';
var cachedUrl = '/app02.js';

var staticDir = '/static';

// The callback to handle requests
function onRequest(request, response) {
  var parsed = url.parse(request.url);
  var filename = path.join(__dirname, staticDir, parsed.pathname);
  var matched = parsed.query && parsed.query.match(/seq=([^=\&\?]+)/), seq = matched && matched[1];
  console.log(new Date(), request.url);

  var matched;


  // Serving server.js from cache. Useful for microbenchmarks.
  if (request.url === cachedUrl) {
    response.end(cachedFile);
  }

  // API
  else if (request.url === '/task' || request.url === '/task/') {
    var id = (~~(Math.random() * 0xFFFFFF)).toString(16);
    response.writeHead(200, {'Content-Type': 'application/json'});
    if (response.push) {
      var push = response.push('/task/' + id + '/result');
      setTimeout(function () {
        console.log(new Date(), 'Task done: ', id);
        push.writeHead(200, {'Content-Type': 'application/json'});
        push.end(JSON.stringify({id: id, result: 'RESULT!'}));
      }, 2000);
    }
    response.end(JSON.stringify({status: 'OK', code: 0, id: id}));
  } else if(matched=request.url.match(/task\/([a-f0-9]+)\/result/)) {
    console.log(new Date(), 'Task done: ', matched[1]);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({id: matched[1], result: 'RESULT!'}));
  }


  // Reading file from disk if it exists and is safe.
  else if ((filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    response.writeHead('200');

    // If they download the certificate, push the private key too, they might need it.
    if (response.push && request.url === '/localhost.crt') {
      var push = response.push('/localhost.key');
      push.writeHead(200);
      fs.createReadStream(path.join(__dirname, 'node_modules/http2/example/localhost.key')).pipe(push);
    }

    /*
    if (response.push && request.url === '/pushTest.html') {
      var push = response.push('/assets/images/http2.png');
      setTimeout(function () {
        console.log(new Date(), 'Push done');
        push.writeHead(200);
        fs.createReadStream(path.join(__dirname, staticDir, 'assets/images/ok.png')).pipe(push);
      }, 800);
    }
       if(!seq || parseInt(seq) % 3 !== 0 ) {
       fs.createReadStream(filename).pipe(response);
       } else {
       setTimeout(function () {
       fs.createReadStream(filename).pipe(response);
       }, 500);
       }
       */

    if(parsed.pathname.match('ng.png')){
      setTimeout(function () {
        fs.createReadStream(filename).pipe(response);
      }, 500);
    } else {
      fs.createReadStream(filename).pipe(response);
    }
  }

  // Otherwise responding with 404.
  else {
    response.writeHead('404');
    response.end();
  }
}

// Creating a bunyan logger (optional)
var log = require('http2/test/util').createLogger('server');

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({
    log: log,
    plain: true
  }, onRequest);
} else {
  server = http2.createServer({
    log: log,
    key: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.crt'))
  }, onRequest);
}
server.listen(process.env.HTTP2_PORT || 8080);

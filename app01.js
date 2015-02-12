var fs = require('fs');
var path = require('path');

var options = {
  key: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.crt'))
};

require('http2').createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);

var static = require('node-static');

var fileServer = new static.Server('./dist');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        console.log('serve: ' + request);
        fileServer.serve(request, response);
    }).resume();
}).listen(80);
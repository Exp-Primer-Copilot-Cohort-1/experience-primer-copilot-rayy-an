// Create a web server
// To start the server: $ node comments.js
// To test: http://localhost:3000/comments

var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');

var messages = [
  { name: 'Jim', message: 'Hi there!'},
  { name: 'Sue', message: 'Hello!'},
];

function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain'});
      res.end('500 - Internal Error');
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType});
      res.end(data);
    }
  });
}

http.createServer(function(req, res) {
  var url = req.url.split('?');
  var params = qs.parse(url[1]);
  var path = url[0].toLowerCase();

  switch(path) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/plain'});
      res.end('Home page');
      break;
    case '/about':
      serveStaticFile(res, '/public/about.html', 'text/html');
      break;
    case '/img/logo.jpg':
      serveStaticFile(res, '/public/img/logo.jpg', 'image/jpeg');
      break;
    case '/img/sunset.jpg':
      serveStaticFile(res, '/public/img/sunset.jpg', 'image/jpeg');
      break;
    case '/public/css/base.css':
      serveStaticFile(res, '/public/css/base.css', 'text/css');
      break;
    case '/public/js/base.js':
      serveStaticFile(res, '/public/js/base.js', 'text/javascript');
      break;
    case '/comments':
      switch(req.method) {
        case 'GET':
          var comment = messages.map(function(item) {
            return item.name + ': ' + item.message;
          }).join('\n');
          res.writeHead(200, { 'Content-Type': 'text/plain'});
          res.end(comment);
          break;
        case 'POST':
          var message = '';
          req.on('data', function(chunk) {
            message += chunk;
          });
          req.on('end', function() {
            message = qs.parse(message);
            messages.push(message);
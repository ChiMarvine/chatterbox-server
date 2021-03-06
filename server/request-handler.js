/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var fs = require('fs');
var path = require('path');
var messages;
try {
  var storedMessages = require('./storedMessages.json');
  messages = storedMessages.results;
} 
catch(e) {
  messages = [];
  console.log(messages);
}
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  // The outgoing status.
  var statusCode;
  var headers = defaultCorsHeaders;
  var contentType;
  var parsedURL = url.parse(request.url);
  var filePath = '../client';


  if(request.method === 'GET'){
    statusCode = 200;
    
    if (!request.headers['content-type']){
      if(parsedURL.pathname === '/'){
        filePath += '/index.html';
      } else {
        filePath += parsedURL.pathname;
      }
      contentType = 'text/html';
      if (path.extname(filePath) === '.js'){
        contentType = 'text/javascript';
      } else if (path.extname(filePath) === '.css'){
        contentType = 'text/css';
      } else if (path.extname(filePath) === '.gif'){
        contentType = 'image/gif';
      }
      fs.exists(filePath, function(exists){
        if (exists){

          fs.readFile(filePath, function(error, content){

            if (error){
              
              response.writeHead(500);
              response.end();
            } else {
              console.log(filePath);
              headers['Content-Type'] = contentType;

              response.writeHead(statusCode, headers)
              response.end(content, 'utf-8');
            }

          });
        } else {
          response.writeHead(404);
          response.end();
        }

      });
    } else if ( parsedURL.pathname === '/classes/messages/'){
      headers['Content-Type'] = "application/JSON";
      response.writeHead(statusCode, headers);
      var outgoingData = {results: messages};
      fs.writeFile('storedMessages.json', JSON.stringify(outgoingData), "utf-8");
      response.end(JSON.stringify(outgoingData));
    } else if ( parsedURL.pathname === '/log/'){
      headers['Content-Type'] = "application/JSON";
      response.writeHead(statusCode, headers);
      var outgoingData = {results: messages};
      fs.writeFile('storedMessages.json', JSON.stringify(outgoingData), "utf-8");
      response.end(JSON.stringify(outgoingData));
    } else if ( parsedURL.pathname === '/classes/room1/'){
      headers['Content-Type'] = "application/JSON";
      response.writeHead(statusCode, headers);
      var outgoingData = {results: messages};
      fs.writeFile('storedMessages.json', JSON.stringify(outgoingData), "utf-8");
      response.end(JSON.stringify(outgoingData));
    } else {
      statusCode = 404;
    }

  } else if (request.method === 'POST'){
    statusCode = 201;
    if (parsedURL.pathname === '/classes/messages/'){
      request.on('data', function(data){
        var inputData = JSON.parse(data.toString());
        messages.push(inputData);
        response.end();
      })
    } else if (parsedURL.pathname = '/classes/room1/') {
      request.on('data', function(data){
        var inputData = JSON.parse(data.toString());
        messages.push(inputData);
        response.end();
      })
    } 

  } else if (request.method === 'OPTIONS'){
    statusCode = 200;
  }


  // var sendMessages = function(){
  //   headers['Content-Type'] = "application/JSON";
  //   response.writeHead(statusCode, headers);
  //   var outgoingData = {results: messages}
  //   response.end(JSON.stringify(outgoingData));
  // }

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

exports.requestHandler = requestHandler;
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


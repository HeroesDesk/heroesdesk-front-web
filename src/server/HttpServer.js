"use strict";

var express = require('express');

function HttpServer(port, staticServedPath, logRequest) {
  this.port = port;
  this.staticServedPath = staticServedPath;
  this.logRequest = (typeof logRequest === "undefined") ? true : logRequest;
}

HttpServer.prototype.start = function(fn) {
  console.log("Starting server");

  var self = this;
  var app = express();
  self.app = app;

  if(self.logRequest) {
    app.use(function (req, res, next) {
      console.log(req.method, req.url);
      next();
    });
  }

  app.use('/', express.static(self.staticServedPath));

  self.server  = app.listen(self.port, function () {
    console.log("Server started on port", self.port);
    if (fn !== undefined) fn();
  });
};

HttpServer.prototype.stop = function() {
  console.log("Stopping server");

  var self = this;
  self.server.close();
};

module.exports = HttpServer;
"use strict";

var fs = require("fs");
var babelify = require("babelify");
var browserify = require("browserify");

module.exports.init = function (srcRelPath, webAppRelPath, errorCb, endCb) {
  var srcPath = fs.realpathSync(srcRelPath);
  var webAppPath = fs.realpathSync(webAppRelPath);

  console.log("Building web app from " + srcPath + " to " + webAppPath);
  var b = browserify({cache: {}, packageCache: {}, debug: true})
    .transform(babelify.configure())
    .add(srcPath + "/main.js");
  return {
    build: function () {
      b.bundle()
        .on("error", function (err) {
          if (errorCb !== undefined) {
            errorCb(err);
          }
        }).on('end', function () {
          if(endCb !== undefined) {
            endCb();
          }
        }).pipe(fs.createWriteStream(webAppPath + "/bundle.js"));
    },
    browserify: b
  };
};
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("../../webpack.config.dev.js");

var express = require("express");
var webpackMiddleware = require("webpack-dev-middleware");

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");

var app = express();
var bundleStart = 0;

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	stats: { colors: true }
}));

app.use(webpackHotMiddleware(compiler, {
	log: console.log
}));

// We give notice in the terminal when it starts bundling and
// set the time it started
compiler.plugin("compile", function() {
	console.log("Bundling ...");
	bundleStart = Date.now();
});

// We also give notice when it is done compiling, including the
// time it took. Nice to have
compiler.plugin("done", function() {
	console.log("Bundled in " + (Date.now() - bundleStart) + "ms!");
});

/**
 * Start HeroesDesk backend server
 */
require("./heroesDeskServer").start(app);

app.listen(8080, function (err) {
		if (err) {
		console.log(err);
	}

	console.log("Listening at localhost:8080");
});
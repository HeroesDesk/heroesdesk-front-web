"use strict";

const HttpServer = require("../../server/HttpServer");
const params = require("../../server/params");

const Browser = require('zombie');

describe('Desk page', function () {

  Browser.localhost('localhost', params.UI_TEST_PORT);
  Browser.userAgent = "Khrome";

  const server = new HttpServer(params.UI_TEST_PORT, params.WEB_APP_PATH, false);
  const browser = new Browser();

  before(function (done) {
    server.start(function () {
      browser.visit('/#/desk', done);
    });
  });

  it('is accessible through /#/desk', function () {
    browser.assert.text('.active', 'Desk');
  });

/*  TODO
it('has a mean to add new issue', function () {
    browser.assert.element('#addButton');
  });*/

  after(function (){
    server.stop();
  });

});
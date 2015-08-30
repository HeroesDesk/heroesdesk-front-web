"use strict";

const HttpServer = require("../../server/HttpServer");
const params = require("../../server/params");

const Browser = require('zombie');

describe('User visits i18n', function () {

    Browser.localhost('localhost', params.UI_TEST_PORT);
    Browser.userAgent = "Khrome";

    const server = new HttpServer(params.UI_TEST_PORT, params.WEB_APP_TEST_PATH, false);
    const browser = new Browser();

    before(function (done) {
        server.start(function () {
            browser.visit('/#/i18n', done);
        });
    });
/*
issues due iojs/node, check if they're fixed once fusion done

    describe('check default english', function() {
        it('check english', function() {
            browser.assert.text('#test', 'english');
        });
    });

    describe('check french', function() {
        before(function(done) {
            browser.select('selector','Français');
            setTimeout(done, 1000);
        });

        it('check french langage', function() {
            browser.assert.text('#test', 'français');
        });
    });

    Following test commented : it seems that the selected options of a dropdown list remains selected whith zombie and
     the unselect method do not work for a non multiple selection dropdown list.
    describe('check english', function() {
       before(function(done) {
            browser.select('selector','English');
            setTimeout(done, 1000);
        });

        it('check english langage', function() {
            browser.assert.text('#test', 'english');
        });
    });
*/
    after(function () {
        server.stop();
    });

});


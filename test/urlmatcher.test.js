"use strict";

var assert = require('assert')

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var suite = lab.suite;
var test = lab.test;
var before = lab.before;
var after = lab.after;

var util = require('./util.js')

suite('register-login-logout suite tests ', function() {
  before({}, function(done){
    util.init(function(err, agentData){
      done()
    })
  })

  test('match test', function(done) {
    done()
  })
})




'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var suite = lab.suite
var test = lab.test

var Code = require('code')
var expect = Code.expect

suite('urlmatcher suite tests', function () {
  test('simple matcher', function (done) {
    var si = require('seneca')()

    si.use(require('..'))
    si.act('role: auth, cmd: urlmatcher', {spec: '/api'}, function (err, result) {
      expect(err).to.not.exist()
      expect(result).to.be.array()
      expect(result).to.have.length(1)
      expect(result[0]).to.be.function()

      done()
    })
  })
  test('array matcher', function (done) {
    var si = require('seneca')()

    si.use(require('..'))
    si.act('role: auth, cmd: urlmatcher', {spec: ['/api', '/api2']}, function (err, result) {
      expect(err).to.not.exist()
      expect(result).to.be.array()
      expect(result).to.have.length(2)
      expect(result[0]).to.be.function()
      expect(result[1]).to.be.function()

      done()
    })
  })
  test('function matcher', function (done) {
    var si = require('seneca')()

    si.use(require('..'))
    si.act('role: auth, cmd: urlmatcher', {spec: function () {}}, function (err, result) {
      expect(err).to.not.exist()
      expect(result).to.be.array()
      expect(result).to.have.length(1)
      expect(result[0]).to.be.function()

      done()
    })
  })
})

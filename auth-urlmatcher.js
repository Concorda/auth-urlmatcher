'use strict'

// external modules
var _ = require('lodash')
var Gex = require('gex')

module.exports = function (options) {
  var seneca = this

  function urlmatcher (args, done) {
    var spec = args.spec
    spec = _.isArray(spec) ? spec : [spec]
    var checks = []
    _.each(spec, function (path) {
      if (_.isFunction(path)) {
        checks.push(path)
        return
      }

      if (_.isRegExp(path)) {
        checks.push(function (req) {
          return path.test(req.url)
        })

        return
      }
      if (!_.isString(path)) return done()

      path = ~path.indexOf(':') ? path : 'prefix:' + path
      var parts = path.split(':')
      var kind = parts[0]
      var spec = parts.slice(1)

      function regex () {
        var pat = spec
        var mod = ''
        var re
        var m = /^\/(.*)\/([^\/]*)$/.exec(spec)
        if (m) {
          pat = m[1]
          mod = m[2]
          re = new RegExp(pat, mod)
          return function (req) {
            return re.test(req.url)
          }
        }
        else {
          return function () {
            return false
          }
        }
      }

      var pass = {
        prefix: function (req) {
          return Gex(spec + '*').on(req.url)
        },
        suffix: function (req) {
          return Gex('*' + spec).on(req.url)
        },
        contains: function (req) {
          return Gex('*' + spec + '*').on(req.url)
        },
        gex: function (req) {
          return Gex(spec).on(req.url)
        },
        exact: function (req) {
          return spec === req.url
        },
        regex: regex()
      }
      pass.re = pass.regexp = pass.regex
      checks.push(pass[kind])
    })

    return done(null, checks)
  }

  seneca.add({role: 'auth', cmd: 'urlmatcher'}, urlmatcher)
}

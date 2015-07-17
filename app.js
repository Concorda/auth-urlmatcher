"use strict";
var _ = require('lodash')
var gex = require('gex')


module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-urlmatcher'

  function urlmatcher( args, cb ) {
    var spec = args.spec
    spec = _.isArray(spec) ? spec : [spec]
    var checks = []

    _.each(spec,function(path){
      if( _.isFunction(path) ) return cb(null, checks.push(path));
      if( _.isRegExp(path) ) return cb(null, checks.push( function(req) { return path.test(req.url) } ));
      if( !_.isString(path) ) return cb();

      path = ~path.indexOf(':') ? path : 'prefix:'+path
      var parts = path.split(':')
      var kind  = parts[0]
      var spec  = parts.slice(1)

      function regex() {
        var pat = spec, mod = '', re
        var m = /^\/(.*)\/([^\/]*)$/.exec(spec)
        if(m) {
          pat = m[1]
          mod = m[2]
          re = new RegExp(pat,mod)
          return function(req){return re.test(req.url)}
        }
        else return function(){return false};
      }

      var pass = {
        prefix:   function(req) { return gex(spec+'*').on(req.url) },
        suffix:   function(req) { return gex('*'+spec).on(req.url) },
        contains: function(req) { return gex('*'+spec+'*').on(req.url) },
        gex:      function(req) { return gex(spec).on(req.url) },
        exact:    function(req) { return spec === req.url },
        regex:    regex()
      }
      pass.re = pass.regexp = pass.regex
      checks.push(pass[kind])
    })

    return cb(null, checks)
  }


  seneca.add({role: 'auth', cmd: 'urlmatcher'}, urlmatcher)

  return {
    name:plugin
  }
}

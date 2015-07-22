var assert = require('assert')

exports.init = function(cb){
  var si = require('seneca')(/*{log: 'print'}*/)

  si.use( require('..'), {secure:true, restrict: '/api'} )

  si.ready(function(err){
    if( err ) return process.exit( !console.error(err) );

    cb()
  })
}

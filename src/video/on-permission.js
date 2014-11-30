oo.video._hasPermission = false;
oo.video._listenerQueue = [];

oo.video.onPermission = function(listener) {
  if ( oo.video._hasPermission ) {
      listener.call();
  } else {
      oo.video._listenerQueue.push( listener );
  }
}

oo.video.gotPermission = function() {
  oo.video._hasPermission = true;
  if ( oo.video._listenerQueue ) {
    var fn, i = 0;
    while ( (fn = oo.video._listenerQueue[ i++ ]) ) {
      fn.call();
    }
    oo.video._listenerQueue = null;
  }
}

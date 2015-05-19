function Clock() {
}

Clock.prototype.getTimeUntilNextMillis = function(everyMs) {
  var ms = this.getMillis();
  var div = Math.ceil( ms / everyMs );
  var msNext = div * everyMs;
  return msNext - ms;
};

Clock.prototype.getMillis = function() {
  return new Date().valueOf();
};

Clock.prototype.isReady = function() {
  return true;
}

function DelayClock() {
  this.delay = 0;
}
DelayClock.prototype = new Clock();

DelayClock.prototype.getMillis = function() {
  return new Date().valueOf() + this.delay;
};

DelayClock.prototype.setDelay = function(delay) {
  this.delay = delay;
};


function FirebaseClock() {
  this.syncPeriod = 10000;
  // Periodically re-sync with the server.
  setInterval(this.resync.bind(this), this.syncPeriod);
  this.resync();

  this.serverTime = null;
}
FirebaseClock.prototype = new Clock();

FirebaseClock.prototype.getMillis = function() {
  var deltaMs = performance.now() - this.localTimeAtServerSnapshot;
  return this.serverTime + deltaMs;
};

FirebaseClock.prototype.resync = function() {
  var offsetRef = new Firebase('http://boiling-heat-5202.firebaseIO.com/.info/serverTimeOffset');
  offsetRef.on('value', function(snap) {
    var offset = snap.val();
    console.log('Server offset is %f ms', offset);
    var estimatedServerTimeMs = new Date().getTime() + offset;
    if (this.serverTime) {
      var delta = (this.serverTime - estimatedServerTimeMs) +
          (performance.now() - this.localTimeAtServerSnapshot);
      console.log('Resynced clock. Adjustment: %f ms', delta);
    } else {
      console.log('Synced clock');
    }

    // Save the server time estimate as the starting point.
    this.serverTime = estimatedServerTimeMs;
    this.localTimeAtServerSnapshot = performance.now();

    // Cycle the connection in order to get a new server time estimate next time.
    offsetRef.off();
    Firebase.goOffline();
    Firebase.goOnline();
  }.bind(this));
};

FirebaseClock.prototype.isReady = function() {
  return this.serverTime != null;
};

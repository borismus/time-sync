/**
 * Playback a sound file at a fixed period.
 */
function PeriodicPlayer(clock, opt_params) {
  var params = opt_params || {};

  this.clock = clock;
  this.periodSec = params.periodSec || 60;
  this.src = params.src || 'snd/ding_short.mp3';

  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  this.context = new AudioContext();

  this.load(this.src, function(buffer) {
    this.buffer = buffer;
  }.bind(this));

}

PeriodicPlayer.prototype.start = function() {
  if (this.source || !this.buffer || !this.clock.isReady()) {
    return;
  }
  // Create the buffer.
  source = this.context.createBufferSource();
  source.buffer = this.buffer;
  source.loop = false;

  source.connect(this.context.destination);

  // How long to the next minute.
  var delayMillis = this.clock.getTimeUntilNextMillis(this.periodSec * 1000);
  var delaySec = delayMillis / 1000;
  console.log('Starting delayed by %d ms.', delayMillis);
  source.start(this.context.currentTime + delaySec);

  this.source = source;

  setTimeout(function() {
    this.source = null;
  }.bind(this), (delaySec + this.buffer.duration) * 1000);
};

PeriodicPlayer.prototype.stop = function() {
  if (!this.source) {
    return;
  }
  this.source.stop();
  this.source = null;
};

PeriodicPlayer.prototype.load = function(src, callback, opt_progressCallback) {
  var context = this.context;
  var request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously.
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      callback(buffer);
    }, function(e) {
      console.error(e);
    });
  };
  if (opt_progressCallback) {
    request.onprogress = function(e) {
      var percent = e.loaded / e.total;
      opt_progressCallback(percent);
    };
  }

  request.send();
};

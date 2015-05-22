function DelayPlayer(ctx, buffer) {
  // Make a gain node, a delay node, and pipe them through to destination.
  var delay = ctx.createDelay();
  var gain = ctx.createGain();

  gain.connect(delay);
  delay.connect(ctx.destination);

  // Save for later.
  this.buffer = buffer;
  this.ctx = ctx;
  this.delay = delay;
  this.gain = gain;
};

DelayPlayer.prototype.setDelay = function(delay) {
  this.delay.delayTime.value = delay;
};

DelayPlayer.prototype.setGain = function(gain) {
  this.gain.gain.value = gain;
};

DelayPlayer.prototype.start = function() {
  this.stop();

  // Create a source node.
  var source = this.ctx.createBufferSource();
  source.buffer = this.buffer;
  source.loop = false;

  source.connect(this.gain);
  source.start(0);

  this.source = source;
};

DelayPlayer.prototype.stop = function() {
  if (this.source) {
    this.source.stop(0);
    this.source = null;
  }
};

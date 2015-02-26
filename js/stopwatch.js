var Stopwatch = (function() {

  // module data - private
  var startTime,
      stopTime,
      totalTime = 0;

  // methods - private
  var started = function() {
    return !!(startTime);
  };

  var stopped = function() {
    return !!(stopTime);
  };

  var reset = function() {
    startTime = null;
    stopTime = null;
    totalTime = 0;
  };

  // methods - public
  var start = function() {
    if(!started()) {
      stopTime = null;
      startTime = Date.now();
    }
  };

  var stop = function() {
    if(started()) {
      stopTime = Date.now();
      totalTime += (stopTime - startTime);
      startTime = null;
    }
  };

  var time = function() {
    return stopped() ? totalTime : (started() ? (totalTime + (Date.now() - startTime)) : 0);
  };

  var displayTime = function() {
    var totalTime = time() || 0,
        milliseconds = parseInt(totalTime % 1000),
        seconds = parseInt(((totalTime - milliseconds) / 1000) % 60),
        minutes = parseInt(((((totalTime - milliseconds) / 1000) - seconds) / 60) % 60),
        hours = parseInt(((((((totalTime - milliseconds) / 1000) - seconds) / 60) - minutes) / 60) % 24),
        times = [hours, minutes, seconds, milliseconds];
    return (times[0] < 10 ? "0" + times[0] : times[0]) + ":" +
      (times[1] < 10 ? "0" + times[1] : times[1]) + ":" +
      (times[2] < 10 ? "0" + times[2] : times[2]) + ":" +
      (times[3] < 10 ? "00" + times[3] : (times[3] < 100 ? "0" + times[3] : times[3]));
  };
  
  // module API
  var StopwatchAPI = {
    start: start,
    stop: stop,
    started: started,
    stopped: stopped,
    reset: reset,
    displayTime: displayTime
  };

  return StopwatchAPI;
})();
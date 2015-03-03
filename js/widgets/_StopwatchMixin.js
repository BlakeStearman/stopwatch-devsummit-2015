define(["dojo/_base/declare"], function (declare) {

  // module data - private
  var _startTime = 0,
      _stopTime = 0,
      _running = false;

  // methods - private
  function isRunning () {
    return _running;
  }

  function reset () {
    _startTime = 0;
    _stopTime = 0;
  }

  // methods - public
  function start () {
    if (!_running) {
      _running = true;

      if (_startTime === 0) {
        _startTime = Date.now();
      }
    }
  }

  function stop () {
    if (_running) {
      _running = false;
      _stopTime = Date.now();
    }
  }

  function time () {
    var finalTime = _running ? Date.now() : _stopTime;

    return finalTime - _startTime;
  }

  function displayTime () {
    var totalTime = time(),
        milliseconds = totalTime % 1000,
        seconds = ((totalTime - milliseconds) / 1000) % 60,
        minutes = ((((totalTime - milliseconds) / 1000) - seconds) / 60) % 60,
        hours = ((((((totalTime - milliseconds) / 1000) - seconds) / 60) - minutes) / 60) % 24;

    return _padWithZeros(hours, 2) + ":" +
           _padWithZeros(minutes, 2) + ":" +
           _padWithZeros(seconds, 2) + ":" +
           _padWithZeros(milliseconds, 3);
  }

  function _padWithZeros (number, upTo) {
    var numberText = number.toString(),
        totalChars = numberText.length,
        zerosNeeded;

    if (totalChars >= upTo) {
      return numberText;
    }

    zerosNeeded = upTo - totalChars;

    for (var i = 0; i < zerosNeeded; i++) {
      numberText = "0" + numberText;
    }

    return numberText;
  }

  // module API
  var StopwatchAPI = {

    declaredClass: "widgets._StopwatchMixin",

    isRunning: isRunning,
    start: start,
    stop: stop,
    reset: reset,
    displayTime: displayTime,
    rawTime: time
  };

  return declare(null, StopwatchAPI);
});

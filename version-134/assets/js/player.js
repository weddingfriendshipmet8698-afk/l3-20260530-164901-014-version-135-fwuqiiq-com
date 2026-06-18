(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    document.querySelectorAll('.player-shell').forEach(function (shell) {
      var video = shell.querySelector('video');
      var startButton = shell.querySelector('.player-start');
      var stream = shell.getAttribute('data-stream');
      var isBound = false;
      var hls = null;

      function bindStream() {
        if (!video || !stream || isBound) {
          return;
        }
        isBound = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function playVideo() {
        bindStream();
        if (startButton) {
          startButton.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            if (startButton) {
              startButton.classList.remove('is-hidden');
            }
          });
        }
      }

      if (startButton) {
        startButton.addEventListener('click', function (event) {
          event.preventDefault();
          playVideo();
        });
      }

      if (video) {
        video.addEventListener('play', function () {
          if (startButton) {
            startButton.classList.add('is-hidden');
          }
        });
        video.addEventListener('pause', function () {
          if (!video.currentTime && startButton) {
            startButton.classList.remove('is-hidden');
          }
        });
        video.addEventListener('ended', function () {
          if (startButton) {
            startButton.classList.remove('is-hidden');
          }
        });
      }

      window.addEventListener('pagehide', function () {
        if (hls && hls.destroy) {
          hls.destroy();
        }
      });
    });
  });
})();

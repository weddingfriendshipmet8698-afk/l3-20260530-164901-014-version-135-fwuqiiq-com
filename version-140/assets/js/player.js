(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function(player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.play-overlay');
      var stream = video ? video.getAttribute('data-stream') : '';
      var hls = null;
      var loaded = false;

      function loadStream() {
        if (!video || !stream || loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function start() {
        loadStream();
        if (button) {
          button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function() {
            if (button) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }

      if (button) {
        button.addEventListener('click', function(event) {
          event.preventDefault();
          start();
        });
      }

      if (video) {
        video.addEventListener('click', function() {
          if (video.paused) {
            start();
          }
        });
        video.addEventListener('play', function() {
          if (button) {
            button.classList.add('is-hidden');
          }
        });
        video.addEventListener('pause', function() {
          if (button && video.currentTime === 0) {
            button.classList.remove('is-hidden');
          }
        });
      }

      window.addEventListener('beforeunload', function() {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  });
})();

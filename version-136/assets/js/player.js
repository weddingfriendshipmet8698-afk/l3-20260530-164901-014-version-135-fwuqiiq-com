(function () {
  window.initMoviePlayer = function (streamUrl) {
    var video = document.querySelector('[data-player]');
    var cover = document.querySelector('[data-player-cover]');
    var attached = false;
    var hls = null;

    if (!video || !streamUrl) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (cover) {
        cover.setAttribute('aria-label', '暂时无法播放');
      }
    }

    function startPlayback() {
      attachStream();
      if (cover) {
        cover.classList.add('hidden');
      }
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (cover) {
            cover.classList.remove('hidden');
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();

(function() {
  function startPlayer(root) {
    var video = root.querySelector('video');
    var streamUrl = root.getAttribute('data-stream');

    if (!video || !streamUrl) {
      return;
    }

    root.classList.add('is-playing');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', streamUrl);
      }
      video.play().catch(function() {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsInstance) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      }
      video.play().catch(function() {});
      return;
    }

    if (!video.getAttribute('src')) {
      video.setAttribute('src', streamUrl);
    }
    video.play().catch(function() {});
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function(root) {
    var button = root.querySelector('[data-play-button]');
    var video = root.querySelector('video');

    if (button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        startPlayer(root);
      });
    }

    if (video) {
      video.addEventListener('play', function() {
        root.classList.add('is-playing');
      });
    }
  });
})();

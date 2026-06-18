(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function getSearchTargets() {
    return Array.from(document.querySelectorAll(".movie-card, .rank-row"));
  }

  function applySearch(query) {
    var value = normalize(query);
    var targets = getSearchTargets();
    var visible = 0;

    targets.forEach(function (item) {
      var text = normalize(item.getAttribute("data-search") + " " + item.textContent);
      var matched = value === "" || text.indexOf(value) !== -1;
      item.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    document.querySelectorAll("[data-empty-state]").forEach(function (empty) {
      empty.classList.toggle("is-visible", targets.length > 0 && visible === 0);
    });
  }

  function bindSearch() {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      var input = form.querySelector("input[name='q']");
      if (!input) {
        return;
      }

      if (initialQuery) {
        input.value = initialQuery;
      }

      input.addEventListener("input", function () {
        applySearch(input.value);
      });

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var targets = getSearchTargets();
        if (targets.length === 0) {
          var prefix = location.pathname.indexOf("/movies/") !== -1 || location.pathname.indexOf("/category/") !== -1 ? "../" : "./";
          location.href = prefix + "index.html?q=" + encodeURIComponent(input.value);
          return;
        }
        applySearch(input.value);
      });
    });

    if (initialQuery) {
      applySearch(initialQuery);
    }
  }

  function bindMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function bindCarousel() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      var slides = Array.from(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.from(carousel.querySelectorAll("[data-slide-to]"));
      var prev = carousel.querySelector("[data-prev]");
      var next = carousel.querySelector("[data-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(parseInt(dot.getAttribute("data-slide-to"), 10) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      show(0);
      start();
    });
  }

  function bindPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".play-overlay");
      var stream = video ? video.getAttribute("data-stream") : "";
      var hls = null;
      var ready = false;

      if (!video || !overlay || !stream) {
        return;
      }

      function loadVideo() {
        if (ready) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          ready = true;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (_, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
          ready = true;
        }
      }

      function play() {
        loadVideo();
        overlay.classList.add("is-hidden");
        video.controls = true;
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            overlay.classList.remove("is-hidden");
          });
        }
      }

      overlay.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("pause", function () {
        if (!video.ended) {
          overlay.classList.remove("is-hidden");
        }
      });
      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindMenu();
    bindSearch();
    bindCarousel();
    bindPlayers();
  });
})();

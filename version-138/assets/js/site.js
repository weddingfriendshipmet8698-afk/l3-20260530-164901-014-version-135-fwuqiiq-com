(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showHero(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showHero(current + 1);
      }, 5200);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll(".local-filter"));
    var yearFilters = Array.prototype.slice.call(document.querySelectorAll(".year-filter"));

    function runFilter(targetId) {
      var grid = document.getElementById(targetId);
      if (!grid) {
        return;
      }
      var textInput = document.querySelector('.local-filter[data-filter-target="' + targetId + '"]');
      var yearSelect = document.querySelector('.year-filter[data-filter-target="' + targetId + '"]');
      var keyword = textInput ? textInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .rank-item"));
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [card.getAttribute("data-title"), card.getAttribute("data-tags"), card.getAttribute("data-year")].join(" ").toLowerCase();
        var yearMatch = !year || card.getAttribute("data-year") === year;
        var textMatch = !keyword || haystack.indexOf(keyword) !== -1;
        var isVisible = yearMatch && textMatch;
        card.classList.toggle("hidden-card", !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      var empty = grid.querySelector(".empty-message");
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "empty-message";
        empty.textContent = "没有找到相关影片";
        grid.appendChild(empty);
      }
      empty.style.display = visible ? "none" : "block";
    }

    filterInputs.forEach(function (input) {
      input.addEventListener("input", function () {
        runFilter(input.getAttribute("data-filter-target"));
      });
    });

    yearFilters.forEach(function (select) {
      select.addEventListener("change", function () {
        runFilter(select.getAttribute("data-filter-target"));
      });
    });

    if (document.getElementById("searchResults") && window.MOVIE_SEARCH_INDEX) {
      renderSearchResults();
    }
  });

  function createCard(movie) {
    var article = document.createElement("article");
    article.className = "movie-card";
    article.setAttribute("data-title", movie.title);
    article.setAttribute("data-year", movie.year);
    article.setAttribute("data-tags", movie.tags.join(" ") + " " + movie.genre);
    article.innerHTML = [
      '<a class="poster-link" href="./' + movie.file + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="poster-badge category-badge">' + escapeHtml(movie.category) + '</span>',
      '<span class="poster-badge year-badge">' + movie.year + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.description) + '</p>',
      '<div class="card-meta">',
      '<span>' + escapeHtml(movie.region) + '</span>',
      '<span>' + escapeHtml(movie.type) + '</span>',
      '<span>' + escapeHtml(movie.genre) + '</span>',
      '</div>',
      '</div>'
    ].join("");
    return article;
  }

  function renderSearchResults() {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.getElementById("searchPageInput");
    var title = document.getElementById("searchTitle");
    var hint = document.getElementById("searchHint");
    var box = document.getElementById("searchResults");

    if (input) {
      input.value = query;
    }
    if (!box) {
      return;
    }

    if (!query) {
      var starter = window.MOVIE_SEARCH_INDEX.slice(0, 24);
      starter.forEach(function (movie) {
        box.appendChild(createCard(movie));
      });
      return;
    }

    var lowered = query.toLowerCase();
    var results = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
      return [movie.title, movie.description, movie.region, movie.type, movie.genre, movie.category, movie.year, movie.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .indexOf(lowered) !== -1;
    });

    if (title) {
      title.textContent = "搜索：" + query;
    }
    if (hint) {
      hint.textContent = results.length ? "已为你匹配相关影片" : "没有找到相关影片";
    }

    results.slice(0, 120).forEach(function (movie) {
      box.appendChild(createCard(movie));
    });

    if (!results.length) {
      var empty = document.createElement("div");
      empty.className = "empty-message";
      empty.textContent = "没有找到相关影片";
      box.appendChild(empty);
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.initializePlayer = function (streamUrl) {
    var video = document.getElementById("moviePlayer");
    var overlay = document.getElementById("playOverlay");
    var hasBound = false;

    if (!video || !streamUrl) {
      return;
    }

    function bindStream() {
      if (hasBound) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        hasBound = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsController = hls;
        hasBound = true;
        return;
      }
      video.src = streamUrl;
      hasBound = true;
    }

    function startPlayback() {
      bindStream();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
  };
})();

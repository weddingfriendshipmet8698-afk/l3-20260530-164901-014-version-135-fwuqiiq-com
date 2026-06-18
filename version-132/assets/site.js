(function() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");
    var form = document.querySelector(".header-inner > .search-form");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function() {
      nav.classList.toggle("open");

      if (form) {
        form.classList.toggle("open");
      }
    });
  }

  function setupSearchForms() {
    document.querySelectorAll(".site-search-form").forEach(function(form) {
      form.addEventListener("submit", function(event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";

        if (!value) {
          event.preventDefault();
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector(".hero");
    var slides = document.querySelectorAll(".hero-slide-data");
    var dots = document.querySelectorAll(".hero-dot");
    var panelImage = document.querySelector(".hero-poster img");
    var panelTitle = document.querySelector(".hero-panel-title");
    var panelText = document.querySelector(".hero-panel-text");
    var panelLink = document.querySelector(".hero-panel-link");
    var title = document.querySelector(".hero-title");
    var lead = document.querySelector(".hero-lead");

    if (!hero || slides.length === 0) {
      return;
    }

    var index = 0;

    function setSlide(nextIndex) {
      index = nextIndex % slides.length;
      var slide = slides[index];
      var image = slide.getAttribute("data-cover");
      var href = slide.getAttribute("data-href");
      var movieTitle = slide.getAttribute("data-title");
      var text = slide.getAttribute("data-text");

      hero.style.setProperty("--hero-image", "url('" + image + "')");

      if (panelImage) {
        panelImage.src = image;
        panelImage.alt = movieTitle;
      }

      if (panelTitle) {
        panelTitle.textContent = movieTitle;
      }

      if (panelText) {
        panelText.textContent = text;
      }

      if (panelLink) {
        panelLink.href = href;
      }

      if (title) {
        title.textContent = movieTitle;
      }

      if (lead) {
        lead.textContent = text;
      }

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener("click", function() {
        setSlide(dotIndex);
      });
    });

    setSlide(0);

    setInterval(function() {
      setSlide(index + 1);
    }, 5200);
  }

  function setupLocalFilter() {
    var input = document.querySelector("[data-local-filter]");
    var yearSelect = document.querySelector("[data-year-filter]");
    var typeSelect = document.querySelector("[data-type-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

    if (!input && !yearSelect && !typeSelect) {
      return;
    }

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function apply() {
      var keyword = normalize(input ? input.value : "");
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";

      cards.forEach(function(card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-tags")
        ].join(" "));

        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesYear = !year || card.getAttribute("data-year") === year;
        var matchesType = !type || card.getAttribute("data-type") === type;

        card.style.display = matchesKeyword && matchesYear && matchesType ? "" : "none";
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", apply);
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", apply);
    }
  }

  ready(function() {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupLocalFilter();
  });
})();

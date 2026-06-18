(function() {
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var title = document.querySelector("[data-search-title]");

  if (!input || !results || typeof SEARCH_MOVIES === "undefined") {
    return;
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function render(query) {
    var keyword = normalize(query);

    if (title) {
      title.textContent = keyword ? "搜索：" + query : "影片搜索";
    }

    if (!keyword) {
      results.innerHTML = '<div class="empty-state">输入片名、地区、题材或标签即可查找内容。</div>';
      return;
    }

    var matched = SEARCH_MOVIES.filter(function(movie) {
      return normalize([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags,
        movie.category
      ].join(" ")).indexOf(keyword) !== -1;
    }).slice(0, 180);

    if (matched.length === 0) {
      results.innerHTML = '<div class="empty-state">没有找到匹配内容。</div>';
      return;
    }

    results.innerHTML = matched.map(function(movie, index) {
      return [
        '<article class="rank-row">',
        '<span class="rank-num">' + (index + 1) + '</span>',
        '<a class="rank-thumb" href="' + movie.href + '"><img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy"></a>',
        '<div class="rank-info">',
        '<h3><a href="' + movie.href + '">' + movie.title + '</a></h3>',
        '<p>' + movie.year + ' · ' + movie.region + ' · ' + movie.type + ' · ' + movie.genre + '</p>',
        '</div>',
        '<a class="rank-link" href="' + movie.href + '">查看</a>',
        '</article>'
      ].join("");
    }).join("");
  }

  var params = new URLSearchParams(location.search);
  var initial = params.get("q") || "";
  input.value = initial;
  render(initial);

  input.addEventListener("input", function() {
    render(input.value);
  });
})();

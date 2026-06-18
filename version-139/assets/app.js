
(function(){
  const onReady = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();

  function setupMenu(){
    const btn = document.querySelector('[data-menu-btn]');
    const panel = document.querySelector('[data-mobile-nav]');
    if(!btn || !panel) return;
    btn.addEventListener('click', () => panel.classList.toggle('open'));
  }

  function setupFilters(){
    document.querySelectorAll('[data-filter-input]').forEach(input => {
      const selectors = (input.dataset.filterTarget || '').split(',').map(s => s.trim()).filter(Boolean);
      const targets = selectors.map(sel => document.querySelector(sel)).filter(Boolean);
      if(!targets.length) return;
      const apply = () => {
        const q = input.value.trim().toLowerCase();
        targets.forEach(target => {
          let visible = 0;
          target.querySelectorAll('[data-filter-item]').forEach(item => {
            const txt = (item.dataset.filterText || item.textContent || '').toLowerCase();
            const show = !q || txt.includes(q);
            item.style.display = show ? '' : 'none';
            if(show) visible++;
          });
          const panel = target.closest('.panel') || target.parentElement;
          const empty = panel ? panel.querySelector('[data-empty]') : null;
          if(empty) empty.style.display = visible ? 'none' : 'block';
        });
      };
      input.addEventListener('input', apply);
      apply();
    });
  }

  function setupPlayer(){
    const video = document.querySelector('[data-player-video]');
    if(!video) return;
    const buttons = Array.from(document.querySelectorAll('[data-video-src]'));
    const setActive = (btn) => buttons.forEach(b => b.classList.toggle('active', b === btn));
    const loadSource = (src, btn) => {
      if(!src) return;
      setActive(btn);
      if(src.endsWith('.m3u8') && window.Hls && Hls.isSupported()){
        if(video._hls){ try{ video._hls.destroy(); }catch(e){} }
        const hls = new Hls();
        video._hls = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        if(video._hls){ try{ video._hls.destroy(); }catch(e){} video._hls = null; }
        video.src = src;
      }
      video.play().catch(()=>{});
    };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => loadSource(btn.dataset.videoSrc, btn));
    });
    if(buttons[0]) loadSource(buttons[0].dataset.videoSrc, buttons[0]);
    document.querySelectorAll('[data-play-now]').forEach(btn => {
      btn.addEventListener('click', () => {
        const player = document.querySelector('[data-player-wrap]');
        if(player) player.scrollIntoView({behavior:'smooth', block:'start'});
        video.play().catch(()=>{});
      });
    });
  }

  function setupToTop(){
    const btn = document.querySelector('[data-to-top]');
    if(!btn) return;
    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 600 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 600 ? 'auto' : 'none';
    });
    btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  onReady(() => { setupMenu(); setupFilters(); setupPlayer(); setupToTop(); });
})();

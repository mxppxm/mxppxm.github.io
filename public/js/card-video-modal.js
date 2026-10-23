/* ============================================================
   CARD VIDEO MODAL —— 卡片上的「▶ 看宣传片」按钮
   点一下 → 居中浅色小窗播放，带声音、带浏览器控制条。
   用法：给任意元素加 data-promo-video（+ data-promo-poster / data-promo-title）
        全站共用同一个弹窗节点（懒创建，没人点就零开销）。
   关闭：视频框右上角 ✕ / Esc / 点窗外空白。
   注意：按钮通常在卡片的 <a> 里面，所以一律 preventDefault，绝不跳外链。
   2026-10-22 首用于第 02 号「帮你 P 图」宣传片；
   2026-10-23 精简：浅色遮罩、去标题条、去转圈、✕ 贴到视频框上。
   ============================================================ */
(function () {
  "use strict";

  var SEL = "[data-promo-video]";
  var opened = false;
  var wrap = null;       // .card-video-modal
  var stage = null;      // .card-video-modal-stage
  var frame = null;      // .card-video-modal-box
  var video = null;
  var closeBtn = null;
  var lastFocus = null;
  var closeTimer = null;

  function build() {
    if (wrap) return;

    wrap = document.createElement("div");
    wrap.className = "card-video-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "宣传片播放");
    wrap.setAttribute("aria-hidden", "true");

    stage = document.createElement("div");
    stage.className = "card-video-modal-stage";

    frame = document.createElement("div");
    frame.className = "card-video-modal-box";

    video = document.createElement("video");
    video.setAttribute("playsinline", "");        // iOS 不劫持全屏
    video.setAttribute("preload", "metadata");
    video.setAttribute("controls", "");
    video.controls = true;

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "card-video-modal-close";
    closeBtn.setAttribute("aria-label", "关闭");
    closeBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M5 5l14 14M19 5L5 19"/></svg>';
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    // 片子挂了别炸：只在控制台留个记号
    video.addEventListener("error", function () {
      console.warn("[card-video-modal] 视频加载失败:", video.currentSrc || video.src);
    });
    // 点视频本身不算点窗外
    video.addEventListener("click", function (e) { e.stopPropagation(); });

    frame.appendChild(video);
    frame.appendChild(closeBtn);
    stage.appendChild(frame);
    wrap.appendChild(stage);
    document.body.appendChild(wrap);

    function outside(e) {
      if (e.target === wrap || e.target === stage) {
        e.preventDefault();
        close();
      }
    }
    wrap.addEventListener("mousedown", outside);
    wrap.addEventListener("click", outside);
  }

  function open(el) {
    build();

    var src = el.getAttribute("data-promo-video");
    if (!src) return;
    var poster = el.getAttribute("data-promo-poster") || "";
    var title = el.getAttribute("data-promo-title") || "";

    if (video.getAttribute("src") !== src) {
      video.setAttribute("src", src);
      if (poster) video.setAttribute("poster", poster);
      else video.removeAttribute("poster");
    }
    wrap.setAttribute("aria-label", title ? title + " · 宣传片" : "宣传片播放");

    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    lastFocus = document.activeElement;
    opened = true;

    wrap.classList.add("is-open");
    wrap.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("cvm-lock");

    video.muted = false;   // 要出声
    video.volume = 1;
    try {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}

    requestAnimationFrame(function () { wrap.classList.add("is-visible"); });
    if (closeBtn && closeBtn.focus) {
      try { closeBtn.focus({ preventScroll: true }); } catch (e) { closeBtn.focus(); }
    }
  }

  function close() {
    if (!wrap) return;
    opened = false;

    wrap.classList.remove("is-visible");
    document.documentElement.classList.remove("cvm-lock");

    try { video.pause(); } catch (e) {}
    try { video.currentTime = 0; } catch (e) {}
    video.muted = true;    // 免得残留音频

    wrap.setAttribute("aria-hidden", "true");
    closeTimer = setTimeout(function () {
      if (!opened) wrap.classList.remove("is-open");
      closeTimer = null;
    }, 200);

    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  /* ── 事件：一律走捕获阶段，抢在 <a> 的默认跳转之前 ── */
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!el) return;
    e.preventDefault();       // 关键：卡片是 <a>，不拦住就会跳到站外
    e.stopPropagation();
    open(el);
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      if (opened) { e.preventDefault(); close(); }
      return;
    }
    var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!el) return;
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();     // 空格也会滚页面，一起拦掉
      e.stopPropagation();
      open(el);
    }
  }, true);
})();
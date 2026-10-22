/* ============================================================
   CARD VIDEO MODAL —— 卡片上的「▶ 看宣传片」按钮
   点一下 → 居中弹窗播放，带声音、带控制条。
   用法：给任意元素加上 data-promo-video（+ data-promo-poster / data-promo-title）
        属性即可，全站共用同一个弹窗节点（懒创建，没人点就零开销）。
   关闭方式：右上角按钮 / Esc / 点遮罩。
   注意：按钮通常在卡片的 <a> 里面，所以一律 preventDefault，绝不跳外链。
   2026-10-22 首用于第 02 号「帮你 P 图」宣传片。
   ============================================================ */
(function () {
  "use strict";

  var SEL = "[data-promo-video]";
  var opened = false;
  var wrap = null;      // .card-video-modal
  var frame = null;     // .card-video-modal-box
  var video = null;
  var captionEl = null;
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

    var stage = document.createElement("div");
    stage.className = "card-video-modal-stage";

    frame = document.createElement("div");
    frame.className = "card-video-modal-box";

    video = document.createElement("video");
    video.setAttribute("playsinline", "");        // iOS 不劫持全屏
    video.setAttribute("preload", "metadata");
    video.setAttribute("controls", "");           // 进度条 / 音量 / 全屏交给浏览器
    video.controls = true;
    video.muted = false;                          // 要出声
    video.volume = 1;
    video.setAttribute("aria-label", "宣传片");

    var spinner = document.createElement("div");
    spinner.className = "card-video-modal-spinner";
    spinner.setAttribute("aria-hidden", "true");

    frame.appendChild(video);
    frame.appendChild(spinner);

    captionEl = document.createElement("div");
    captionEl.className = "card-video-modal-caption";

    stage.appendChild(frame);
    stage.appendChild(captionEl);

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "card-video-modal-close";
    closeBtn.setAttribute("aria-label", "关闭宣传片");
    closeBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

    wrap.appendChild(stage);
    wrap.appendChild(closeBtn);
    document.body.appendChild(wrap);

    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      close();
    });
    // 点遮罩关掉；点视频框本身（含控制条）不关
    wrap.addEventListener("mousedown", function (e) {
      if (e.target === wrap) close();
    });
    wrap.addEventListener("click", function (e) {
      if (e.target === wrap) close();
    });
    // 视频右键/界面上的点击别冒到 <a> 上去（弹窗在 body 下，其实不会，保险）
    wrap.addEventListener("click", function (e) { e.stopPropagation(); });

    video.addEventListener("playing", function () {
      wrap.classList.remove("is-loading");
    });
    video.addEventListener("loadeddata", function () {
      wrap.classList.remove("is-loading");
    });
    video.addEventListener("error", function () {
      wrap.classList.remove("is-loading");
      captionEl.textContent = "片子加载失败了，网络顺手再看一眼？";
    });
  }

  function open(trigger) {
    build();

    var src = trigger.getAttribute("data-promo-video");
    var poster = trigger.getAttribute("data-promo-poster") || "";
    var title = trigger.getAttribute("data-promo-title") || "";

    captionEl.textContent = title ? title + " · 宣传片" : "宣传片";

    if (video.getAttribute("src") !== src) {
      video.setAttribute("src", src);
      video.load();
    }
    if (poster) video.setAttribute("poster", poster);
    else video.removeAttribute("poster");

    lastFocus = trigger;
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

    wrap.classList.add("is-open", "is-loading");
    wrap.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("cvm-lock");

    video.muted = false;
    video.volume = 1;
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        // 极少数情况下浏览器仍拦自动播放：控制条还在，用户点一下就好
        wrap.classList.remove("is-loading");
      });
    }

    requestAnimationFrame(function () {
      wrap.classList.add("is-visible");
    });

    opened = true;
    if (closeBtn && closeBtn.focus) {
      try { closeBtn.focus({ preventScroll: true }); } catch (e) { closeBtn.focus(); }
    }
  }

  function close() {
    if (!wrap || !opened) return;
    opened = false;

    wrap.classList.remove("is-visible", "is-loading");
    document.documentElement.classList.remove("cvm-lock");

    try { video.pause(); } catch (e) {}
    try { video.currentTime = 0; } catch (e) {}
    video.muted = true; // 关掉声音，免得残留音频

    wrap.setAttribute("aria-hidden", "true");
    closeTimer = setTimeout(function () {
      if (!opened) wrap.classList.remove("is-open");
      closeTimer = null;
    }, 240);

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
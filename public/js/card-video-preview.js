/* ============================================================
   CARD VIDEO PREVIEW —— 卡片悬停弹出「宣传片浮窗」
   ------------------------------------------------------------
   2026-10-22 上线（第 02 号「帮你 P 图」宣传片）

   用法：给任意元素加三个属性即可，无需改 JS：
     data-preview-video="https://.../xxx.mp4"
     data-preview-poster="https://.../xxx.jpg"   （可省，强烈建议有）
     data-preview-label="帮你 P 图 · 宣传片"      （可省）

   行为：鼠标移到卡片上 → 停 320ms → 浮窗从卡片旁边淡入、静音循环播放；
        移开 180ms 后收起。首次悬停就开始预下载，所以弹出时基本已能播。
        手机 / 触屏（没有 hover）整段逻辑不启动；视频永远静音，不会出声吓人。
   实现：零依赖 IIFE，浮窗节点全站唯一、pointer-events:none（不挡鼠标）。
   ============================================================ */
(function () {
  "use strict";

  var cards = document.querySelectorAll("[data-preview-video]");
  if (!cards.length || !document.body) return;

  // 只在「有 hover 能力的精细指针」设备上启用（手机、平板不触发）
  var canHover =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  var SHOW_DELAY = 320; // 悬停多久才弹（毫秒）
  var HIDE_DELAY = 180; // 移开后多久收起（毫秒）
  var GAP = 14; // 浮窗与卡片之间的间距
  var EDGE = 12; // 距视窗边缘的最小留白

  var panel = null;
  var box = null;
  var video = null;
  var labelEl = null;
  var current = null;
  var showTimer = null;
  var hideTimer = null;
  var scrollBound = false;

  function build() {
    if (panel) return;
    panel = document.createElement("div");
    panel.className = "card-video-pop";
    panel.setAttribute("aria-hidden", "true");

    box = document.createElement("div");
    box.className = "card-video-pop-box";

    labelEl = document.createElement("span");
    labelEl.className = "card-video-pop-label";

    video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("preload", "none");
    video.setAttribute("disablepictureinpicture", "");
    video.addEventListener("error", hide);

    box.appendChild(labelEl);
    box.appendChild(video);
    panel.appendChild(box);
    document.body.appendChild(panel);
  }

  // 预加载：把 src 挂上去让浏览器提前拉流（此刻浮窗还没露脸）
  function warm(card) {
    if (!video) build();
    var src = card.getAttribute("data-preview-video");
    if (!src || video.getAttribute("src") === src) return;
    var poster = card.getAttribute("data-preview-poster");
    if (poster) video.setAttribute("poster", poster);
    else video.removeAttribute("poster");
    video.setAttribute("src", src);
    video.load();
  }

  // 定位：优先卡片右侧 → 左侧 → 卡片正下方居中；纵向居中并夹在视窗内
  function place(card) {
    var r = card.getBoundingClientRect();
    var pw = panel.offsetWidth;
    var ph = panel.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var left;
    var top;

    if (r.right + GAP + pw + EDGE <= vw) {
      left = r.right + GAP;
    } else if (r.left - GAP - pw >= EDGE) {
      left = r.left - GAP - pw;
    } else {
      left = r.left + r.width / 2 - pw / 2;
      top = r.bottom + GAP;
    }
    if (left > vw - pw - EDGE) left = vw - pw - EDGE;
    if (left < EDGE) left = EDGE;

    if (typeof top !== "number") top = r.top + r.height / 2 - ph / 2;
    if (top > vh - ph - EDGE) top = vh - ph - EDGE;
    if (top < EDGE) top = EDGE;

    panel.style.transform =
      "translate3d(" + Math.round(left) + "px," + Math.round(top) + "px,0)";
  }

  function visible(card) {
    var r = card.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  function show(card) {
    if (!panel) build();
    clearTimeout(hideTimer);
    hideTimer = null;
    current = card;

    warm(card);
    labelEl.textContent = card.getAttribute("data-preview-label") || "宣传片";

    // 先量尺寸（此时 opacity 仍是 0，但已经参与布局），再摆位置、再淡入
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    place(card);

    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});

    if (!scrollBound) {
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onResize);
      scrollBound = true;
    }
  }

  function hide() {
    clearTimeout(showTimer);
    showTimer = null;
    clearTimeout(hideTimer);
    hideTimer = null;
    current = null;
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    if (video && !video.paused) video.pause();
    if (scrollBound) {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      scrollBound = false;
    }
  }

  function onScroll() {
    if (!current) return;
    if (!visible(current)) hide();
    else place(current);
  }

  function onResize() {
    if (!current) return;
    if (!visible(current)) hide();
    else place(current);
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      clearTimeout(hideTimer);
      hideTimer = null;
      if (current === card) return;
      showTimer = setTimeout(function () {
        show(card);
      }, SHOW_DELAY);
      warm(card);
    });

    card.addEventListener("mouseleave", function () {
      clearTimeout(showTimer);
      showTimer = null;
      hideTimer = setTimeout(hide, HIDE_DELAY);
    });

    // 键盘 / 读屏用户：聚焦也算「移到上面」
    card.addEventListener("focus", function () {
      show(card);
    });
    card.addEventListener("blur", function () {
      hide();
    });
  });

  // 切走标签页时别在后台偷偷播
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) hide();
  });
})();
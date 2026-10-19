/* ═══════════════════════════════════════════════════════════
   九日 Blog — 图片灯箱 (Lightbox)
   点击正文图片 → 全屏预览；支持左右切换 / Esc 关闭 / 双击放大。
   适用页面：所有包含 .article-content 的页面（文章、漫画、日报等）。
   ═══════════════════════════════════════════════════════════ */
(function () {
  if (window.__jiuriLightbox) return;
  window.__jiuriLightbox = true;

  var IMG_SELECTOR = ".article-content img, .post-content img, .lightbox-scope img";
  var MIN_SIZE = 120; // 小于这个尺寸的图（icon 等）不作为可预览项

  var overlay = null;
  var imgEl, capEl, counterEl, prevBtn, nextBtn;
  var items = [];
  var current = 0;
  var isZoomed = false;
  var panX = 0, panY = 0;
  var dragging = false, startX = 0, startY = 0, startPanX = 0;
  var reduceMotion = false;

  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  /* ── 采集页面里可预览的图片 ── */
  function collect() {
    items = [];
    var nodes = document.querySelectorAll(IMG_SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      var img = nodes[i];
      if (img.tagName !== "IMG") continue;
      if (img.closest("a")) continue; // 图片本身是链接 → 保留原链接行为
      if (img.closest(".lightbox")) continue;
      if (img.classList.contains("no-lightbox")) continue;
      if (img.naturalWidth && img.naturalWidth < MIN_SIZE) continue;
      items.push(img);
    }

    for (var j = 0; j < items.length; j++) {
      (function (img, idx) {
        img.dataset.lbox = String(idx);
        img.classList.add("lightboxable");
        if (img.dataset.lboxBound) return;
        img.dataset.lboxBound = "1";
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");
        if (!img.hasAttribute("aria-label")) {
          img.setAttribute("aria-label", (img.alt || "图片") + "，点击查看大图");
        }
        img.addEventListener("click", function () {
          open(parseInt(img.dataset.lbox, 10) || 0);
        });
        img.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            open(parseInt(img.dataset.lbox, 10) || 0);
          }
        });
      })(items[j], j);
    }
  }

  /* ── 构建灯箱 DOM（首次打开时创建）── */
  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片预览");
    overlay.innerHTML =
      '<button class="lightbox-btn lightbox-close" type="button" aria-label="关闭预览">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<button class="lightbox-btn lightbox-arrow lightbox-prev" type="button" aria-label="上一张">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>' +
      "</button>" +
      '<button class="lightbox-btn lightbox-arrow lightbox-next" type="button" aria-label="下一张">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>' +
      "</button>" +
      '<div class="lightbox-stage">' +
        '<img class="lightbox-img" alt="" draggable="false" />' +
        '<div class="lightbox-spinner" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="lightbox-bar">' +
        '<span class="lightbox-caption"></span>' +
        '<span class="lightbox-counter"></span>' +
      "</div>";

    document.body.appendChild(overlay);

    imgEl = overlay.querySelector(".lightbox-img");
    capEl = overlay.querySelector(".lightbox-caption");
    counterEl = overlay.querySelector(".lightbox-counter");
    prevBtn = overlay.querySelector(".lightbox-prev");
    nextBtn = overlay.querySelector(".lightbox-next");
    var stage = overlay.querySelector(".lightbox-stage");

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    prevBtn.addEventListener("click", function () { go(-1); });
    nextBtn.addEventListener("click", function () { go(1); });

    // 点击背景（不是图片本身）关闭
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target === stage) close();
    });

    // 点击图片：切换 适应屏幕 / 原始尺寸
    imgEl.addEventListener("click", function (e) {
      e.stopPropagation();
      if (Math.abs(panX) > 4 || Math.abs(panY) > 4) return; // 刚拖动过，忽略
      toggleZoom();
    });

    // 拖动平移（放大后可用）
    imgEl.addEventListener("pointerdown", function (e) {
      if (!isZoomed) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startPanX = panX; startPanY = panY;
      imgEl.classList.add("is-dragging");
      imgEl.setPointerCapture && imgEl.setPointerCapture(e.pointerId);
    });
    imgEl.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panX = startPanX + (e.clientX - startX);
      panY = startPanY + (e.clientY - startY);
      applyPan();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      imgEl.classList.remove("is-dragging");
    }
    imgEl.addEventListener("pointerup", endDrag);
    imgEl.addEventListener("pointercancel", endDrag);
    imgEl.addEventListener("pointerleave", endDrag);

    // 触屏左右滑动切换
    var tX = 0, tY = 0, tracking = false;
    stage.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      tracking = true;
      tX = e.touches[0].clientX;
      tY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - tX;
      var dy = t.clientY - tY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    }, { passive: true });

    // 点击空白条区域关闭
    overlay.querySelector(".lightbox-bar").addEventListener("click", function (e) {
      e.stopPropagation();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "0") { resetZoom(); }
  }

  /* ── 打开 / 关闭 ── */
  var lastFocus = null;

  function open(index) {
    if (!items.length) collect();
    if (!items.length) return;
    if (!overlay) build();

    lastFocus = document.activeElement;
    document.documentElement.classList.add("lightbox-open");
    overlay.classList.add("is-open");
    if (!reduceMotion) {
      // 强制重排，让进场动画生效
      void overlay.offsetWidth;
    }
    overlay.classList.add("is-visible");
    show(index);
    overlay.querySelector(".lightbox-close").focus({ preventScroll: true });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    var done = function () {
      overlay.classList.remove("is-open");
      imgEl.removeAttribute("src");
      resetZoom();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (reduceMotion) done();
    else setTimeout(done, 180);
    document.documentElement.classList.remove("lightbox-open");
  }

  function show(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    current = index;

    var src = items[index].currentSrc || items[index].src;
    resetZoom();
    imgEl.classList.remove("is-loaded");
    imgEl.alt = items[index].alt || "";
    imgEl.src = src;

    var fig = items[index].closest("figure");
    var capNode = fig ? fig.querySelector("figcaption") : null;
    var cap = capNode ? capNode.textContent.replace(/\s+/g, " ").trim() : (items[index].alt || "");
    capEl.textContent = cap;
    capEl.style.display = cap ? "" : "none";

    var multi = items.length > 1;
    counterEl.textContent = multi ? (current + 1) + " / " + items.length : "";
    counterEl.style.display = multi ? "" : "none";
    prevBtn.style.display = multi ? "" : "none";
    nextBtn.style.display = multi ? "" : "none";

    // 预载相邻图片
    if (multi) {
      [items[(current + 1) % items.length], items[(current - 1 + items.length) % items.length]].forEach(function (im) {
        var s = im.currentSrc || im.src;
        if (s) { var p = new Image(); p.src = s; }
      });
    }
  }

  function go(step) {
    if (items.length < 2) return;
    show(current + step);
  }

  /* ── 缩放 ── */
  function toggleZoom() {
    if (isZoomed) resetZoom();
    else {
      isZoomed = true;
      imgEl.classList.add("is-zoomed");
      panX = panY = 0;
      applyPan();
    }
  }

  function resetZoom() {
    isZoomed = false;
    panX = panY = 0;
    if (imgEl) {
      imgEl.classList.remove("is-zoomed", "is-dragging");
      applyPan();
    }
  }

  function applyPan() {
    imgEl.style.transform = panX || panY ? "translate(" + panX + "px," + panY + "px)" : "";
  }

  /* ── 图片加载完成 ── */
  function bindImgEvents() {
    // 用事件委托，一次搞定
    document.addEventListener("load", function (e) {
      if (e.target && e.target.classList && e.target.classList.contains("lightbox-img")) {
        e.target.classList.add("is-loaded");
      }
    }, true);
    document.addEventListener("error", function (e) {
      if (e.target && e.target.classList && e.target.classList.contains("lightbox-img")) {
        e.target.classList.add("is-loaded");
      }
    }, true);
  }

  function init() {
    collect();
    bindImgEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("astro:page-load", function () {
    if (overlay) { overlay.classList.remove("is-visible", "is-open"); }
    document.documentElement.classList.remove("lightbox-open");
    collect();
  });
})();
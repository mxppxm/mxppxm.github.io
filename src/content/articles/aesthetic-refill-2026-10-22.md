---
title: "审美补给站 #003：滚动不是时间，但可以当时间轴用"
description: "animation-timeline 把「滚了多远」直接接成动画时间轴，一行 JS 都不用。可抄的参数表：位移 24px、range 用 entry 10% cover 40%、曲线给 linear，再加一句 prefers-reduced-motion 兜底。"
date: 2026-10-22
tags:
  - "🎨 审美补给站"
---

**TL;DR**

1. **滚动可以当时间轴，这不是比喻。** `animation-timeline: view()` 把动画进度绑定到元素在视口里的可见进度，`animation-range` 决定从哪一点起、到哪一点止——CSS 声明式完成，无 JavaScript。
2. **支持度已过线。** caniuse 全球覆盖率 **87.84%**：Chrome / Edge 115+、Safari 26（2025-09-15 发布）原生支持；Firefox 已实现但仍在 flag 后，polyfill 可兜底。
3. **克制写在参数里。** 位移只给 **24px**、节奏交给滚动（用 `linear`）、只动 `transform` 与 `opacity`，再补一句 `prefers-reduced-motion` 兜底。这几行写对，比多加五种动效值钱。

---

## 01 把滚动距离当时间轴：三行 CSS 加一张参数表

先说清它解决的是什么旧问题。此前的「滚动出现」效果，做法是 `IntersectionObserver` 监听元素进入视口 → 加一个 class → 触发 CSS transition。这套能跑，但有两个死穴：动画只认「进入」这一个瞬间，滚动中途回退它不跟随；而且一旦用户快速滚动、或者页面高度是动态的，回调的时序和过渡时长就会打架。

新的 `animation-timeline` 换了个模型：**不给动画一个毫秒时长，而是给它一段滚动距离**。同样一句 keyframes，套上 `view()` 之后，元素的可见进度就是动画进度——滚到哪，动画就在哪，来回都跟手。所以旧的 `animation: rise 600ms ease-out` 里的「600ms」必须删掉，改成一句 `animation-timeline` 挂上去。

下面这套是可直接抄的最小可用写法（参数都是可调的，不是唯一解）：

```css
@keyframes rise { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:none } }
.card {
  animation: rise linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 40%;
}
```

> **参数表 · 一份可抄的基线**
>
> **栅格**：容器 max-width `1120px`、12 栏、gutter `24px`，纵向走 8pt 基线。
> **字体**：拉丁 Inter（或 Inter Display）配中文思源黑体；标题 `letter-spacing:-0.02em`，正文回到 `0`，别全局负字距。
> **色值**：底 `#FAF8F4` / 文字 `#17150F` / 单一 accent `#0F7B5C`，正文对比度压在 7:1 以上。
> **曲线**：滚动本身就是节奏，用 `linear`；只有需要时间型兜底时才上 `cubic-bezier(0.22,1,0.36,1)`（easeOutQuint）。
> **位移**：`translateY(24px)`，不要 100px。动效只允许落在 `transform` 和 `opacity` 上，别去动 `height` / `top`。
> **兜底**：`@media (prefers-reduced-motion: reduce){ *{animation-timeline:none} }`。

### 三个词先分清：时间轴 / 区间 / 填充

**时间轴**有两种。写 `animation-timeline: view()`，进度来自**这个元素自己在滚动容器里的可见程度**——它刚露头是 0%，完全显现是 100%，这是做「元素入场」的；写 `animation-timeline: scroll()`，进度来自**整个滚动容器滚了多远**，那是做进度条、视差这一类「全页」效果的。别混用。

**区间**由 `animation-range` 决定，它把 0%–100% 重新锚定到几个有名有姓的节点：`cover`（元素从开始露头到完全离开，也就是 view() 的默认值）、`contain`（元素完整落在视口内的那一段）、`entry` / `exit`（进入 / 离开）、以及 `entry-crossing` / `exit-crossing`（跨过上下边界）。上面那句 `entry 10% cover 40%`，意思是「从进入阶段的 10% 开始，到覆盖阶段的 40% 结束」——**动画在元素还没完全进场时就基本走完**，读起来才不拖沓。

**填充**用 `animation-fill-mode: both`（上面简写里的 `both`）。不加它，元素在区间外会瞬间弹回初始态，滚动里就是一次跳帧。

为什么反复强调「24px 而不是 100px」？因为滚动驱动的动画，位移是**随手指变化的连续量**，幅度越大，同一段视觉里变化的斜率越陡，眩晕感和「廉价感」都来自这里。克制到 24–32px、再加一点透明度，是绝大多数内容型页面的安全区。

## 02 作品 pick

### ① Neutomni · 编辑式排版 × 滚动动画

**好在哪：** [Neutomni](https://neutomni.com/) 是波兰 Wrocław 的一家数字设计与 Webflow 工作室官网，拿下 Awwwards 2026-10-13 的 Site of the Day（7.38 / 10）。它把「编辑式排版」当骨架：大字号标题、明确的分割线、成块推进的段落，滚动动效只出现在**章节切换的那一下**，正文内部不做逐行或逐字的动画。Awwwards 给它的元素标签里，第一项就是 Scroll Animation——但它没让动效抢戏。

**你能偷什么：** 把滚动动画的触发点**收敛到章节级**，一个 section 只给一个入场（标题 + 首段），剩下全部静态。这会让页面在长滚动里始终有节拍，却不会让眼睛一直处于待机状态。另一条更实用：正文颜色只保留黑与一个强调色，节奏交给字号与字重的层级差。

[Awwwards 项目页](https://www.awwwards.com/sites/neutomni) · 署名：Neutomni（工作室）· 仅作评述引用，不转载素材。

### ② Ascension — Pegassi® · 两色 + 主动效的预算分配

**好在哪：** [Ascension](https://ascension.pegassi.be/) 是比利时电子音乐人 Pegassi（本名 Sam Huybrecht）首张 EP 的发布站点，Awwwards 2026-10-21 的 Site of the Day（7.51 / 10），设计与开发署名为 Jesper Landberg 与 Gil Huybrecht。它的取舍很干脆：**Awwwards 标注的配色只有两种颜色**，视觉预算全砸在排版和动效上；页面还塞了一个可交互的 sequencer（音序器）和 tracklist，让「听音乐」这件事在网页里可操作，而不是又一层视差滚动。

**你能偷什么：** 两件事。一是**先把配色砍到两色**（背景 + 前景），层级靠尺寸、字重、位置去撑，再决定要不要第三色——这比先选五个品牌色再回头删要省事得多。二是给内容配一个**可操作的入口**而非装饰性动效：能点、能听、能切换，用户才有理由滚动下去。

[Awwwards 项目页](https://www.awwwards.com/sites/ascension-pegassi-r) · 署名：Pegassi® / Jesper Landberg / Gil Huybrecht · 仅作评述引用，不转载素材。

## 03 工具与素材

### ① Motion · `scroll()` 与 `inView()`

纯 CSS 能覆盖绝大多数入场动画，但有两种情况还是得回到 JS：需要精确回调（比如动画结束后再拉数据）、或者要兼容还没跟上的浏览器。[Motion](https://motion.dev/)（前身 Framer Motion）把这件事压到了很小的体积：它的 `scroll()` 官方标称 **3.8kb**，用于把数值绑到滚动进度；`inView()` 则基于 IntersectionObserver，负责「进 / 出视口」的回调。它的 changelog 显示 14.1.0 版发布于 2026-10-09，仍在活跃维护。**怎么用**：CSS 能做的交给 CSS，只有需要「读进度做逻辑判断」的那一小块才引它，别整站套一个动效库。

### ② scroll-timeline polyfill

给尚未默认开启的浏览器兜底（目前主要是 Firefox，已实现但仍在 flag 后）：[flackr/scroll-timeline](https://github.com/flackr/scroll-timeline)，Apache-2.0，npm 上的包名是 `scroll-timeline-polyfill`，引入一行 import 即可让不支持的浏览器按同一套 CSS 语义跑起来。**注意**：作者与 Josh Comeau 都提到它**对较高级特性（如 linked timelines）支持不全**——所以 progressive enhancement 的思路是：基础入场动画可以被 polyfill 兜住，花哨的部分就直接不做降级。

## 04 🎯 今天动手 · 10 分钟

挑一个你手边**列表页**（卡片、文章列表、商品网格都行），给其中 6 个卡片加上入场动画，然后只用加减两行来调手感：把 `animation-range` 从 `entry 10% cover 40%` 改成 `entry 0% cover 20%`，看「更早走完」是不是更利索；再把位移从 24px 加到 64px，感受一下斜率的差别。目标是让你亲手确认一件事——**滚动动画的「高级感」不来自加了什么，而来自幅度和区间定在哪**。验收标准：滚到底再滚回顶部，卡片不残留偏移；系统开启「减弱动态效果」后，卡片直接静态显示、不闪。

### 🎯 今天可以试的一件事

1. **复制那三行 CSS** —— `animation: rise linear both; animation-timeline: view(); animation-range: entry 10% cover 40%;`，贴到你任意一个重复出现的卡片类上。
2. **补上兜底** —— 末尾加 `@media (prefers-reduced-motion: reduce){ *{animation-timeline:none} }`，这一步不要省。
3. **只调两个数** —— 位移 24px → 试 48px；区间 `cover 40%` → 试 `cover 20%`，二选一留下更顺手的那组。

---

**参考来源**

1. [MDN · CSS scroll-driven animations（指南）](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
2. [MDN · animation-timeline（属性参考）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
3. [Josh W. Comeau · Scroll-Driven Animations（2026-04-28，2026-06-19 更新）](https://www.joshwcomeau.com/animation/scroll-driven-animations/)
4. [Can I use · Scroll-driven animations（全球覆盖率 87.84%）](https://caniuse.com/wf-scroll-driven-animations)
5. [Apple Developer · Safari 26.0 Release Notes（2025-09-15）](https://developer.apple.com/documentation/safari-release-notes/safari-26-release-notes)
6. [GitHub · flackr/scroll-timeline（Apache-2.0，polyfill）](https://github.com/flackr/scroll-timeline)
7. [Motion · scroll()（官方文档）](https://motion.dev/docs/scroll)
8. [Motion · inView()（官方文档）](https://motion.dev/docs/inview)
9. [Awwwards · Neutomni（Site of the Day 2026-10-13，7.38/10）](https://www.awwwards.com/sites/neutomni)
10. [Awwwards · Ascension — Pegassi®（Site of the Day 2026-10-21，7.51/10）](https://www.awwwards.com/sites/ascension-pegassi-r)

---

*关于本期：本期为手法类选题。文中参数（24px 位移、`animation-range` 取值、支持度与版本号）均来自 MDN、caniuse、Josh W. Comeau 文章与 Apple Safari 26 发布说明，未做推测性外推；浏览器实现状态随版本变化，落地前请以目标浏览器实测为准。作品仅作评述引用并署名，不转载素材。第 #003 期 · 2026-10-22 · 审美补给站日报 · 由 clacky 自动整理。*
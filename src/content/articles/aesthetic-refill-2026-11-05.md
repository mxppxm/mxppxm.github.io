---
title: "审美补给站 #017：瀑布流的容差，是给阅读顺序买的保险"
description: "Safari 26.4 把 masonry 变成 display: grid-lanes，顺手交出一个 CSS 史上罕见的属性 flow-tolerance。它不改视觉，只改一件事：你按 Tab 时焦点会不会跳。附 0px / 1em / 10em 三档参数、用 lh 而不用 em 的理由，以及 The Session 与 Field Guide 两个用对容差的作品。"
date: 2026-11-05
tags:
  - "🎨 审美补给站"
  - "布局"
  - "CSS"
  - "Grid Lanes"
---

**TL;DR**

- **四行 CSS 出瀑布流** —— `display: grid-lanes` + `repeat(auto-fill, minmax(280px, 1fr))` + `gap`，不用再等 JS 算完高度。
- **重点是那个 1em** —— `flow-tolerance` 初始值 `normal`＝1em：高度差在 1em 内的列算「并列」，项目按源码顺序填；写 0px 就严格挑最矮的列，视觉更紧凑、Tab 更容易跳。
- **先别上生产** —— Safari 26.4 首发（2026 年 3 月），Chrome / Edge 140+ 与 Firefox 都还在 flag 后面，MDN 标 *Limited availability*。

---

## 01 · 手法：瀑布流的新东西不是瀑布流，是那 1em

先把定义说清楚。按 MDN 的说法，grid lanes 是「一个轴用严格的网格，另一个轴用堆叠算法」：你定义列，浏览器把每个项目丢进**当前最空的那一条 lane**，于是行高不再受约束，卡片可以不等高。

但真正值得盯的是第二件事：**内容流向和你看到的版式是垂直的**。你定义列，内容就横向来回填 —— 第 1 项在左，第 2 项在中间，第 3 项在右，第 4 项回到左。视觉上像一堵砖墙，DOM 顺序却是一条蛇。所以键盘 Tab 一遍，焦点是在版面上左右横跳着往下走的。

### flow-tolerance：把「差不多高」写成参数

W3C 的 CSS Grid Level 3 里，这个属性的定义是 `flow-tolerance: normal | <length-percentage> | infinite`，初始值 `normal`，在 grid lanes 里换算成 **1em**（其它布局模式里换算成 0）。它规定的是**「两条 lane 差多少以内算并列」**：只要差值落在这个阈值里，算法就按源码顺序填，而不是去挑那条真的矮 2px 的列。

这三档基本覆盖所有场景：

- **0px（或 0.28em 这种极小值）** —— 取消容差，永远挑最矮的 lane。适合图片墙：最大那张图落在哪儿是有意义的，紧凑优先。
- **1em（默认）** —— 高度差在一行字以内不算差。绝大多数卡片列表用这个就行。
- **10em ～ 50vh** —— 内容都是高度相仿的文字卡片时，宁可牺牲一点紧凑度，换稳定的阅读顺序。规范原文给的建议是：*if the initial value (1em) is too small, consider a larger value (such as 10em or 50vh) instead of infinite*。

> **不要写 infinite。** 规范里 `infinite` 的意思是「完全按源码顺序排，根本不看 lane 多长」。听起来很正义，但规范自己加了警告：这会让相邻两项在堆叠轴上落在差别极大的位置。另外 `dense` 关键字在 grid lanes 里的回溯也有限制 —— 只有当空槽的轨道尺寸和项目原本的轨道尺寸完全吻合时才能回填，因为算法不允许把同一个项目排两次。

### 单位选 lh，不选 em

WebKit 的 Field Guide 给 `flow-tolerance` 提供了 em / rem / lh / ch / px 五种单位切换。我的建议是**用 lh**：卡片高度基本由行数决定，「一行文字的误差」才是最贴切的容差尺度；em 跟着字号走，字号一改这个阈值就漂了；ch 只在宽度敏感的排版里才有意义。

---

## 02 · 作品 pick：两个把容差用对的地方

### ① The Session 的照片区：轮播退场，瀑布流上限

Jeremy Keith 在 thesession.org 的 session / event 页面做了一次很干净的替换。默认态是**可滑动轮播**：`display: flex` 加 `scroll-snap-type: inline mandatory`、`overflow-inline: auto`。然后在 `@supports (display: grid-lanes)` 里再嵌一层 `@media (min-width: 56em)`，换成 `display: grid-lanes`、`repeat(auto-fill, minmax(280px, 1fr))`、`gap: 0.5em`，子项补一句 `inline-size: 100%`，再用 `all: initial` 暴力清掉轮播的所有属性。

**好在哪：**断点不是设备断点，而是「单列瀑布流没有意义」的那一点；退化态也不是残废版 —— 轮播在小屏本来就更合理。**你能偷的：**① `@supports` 套 `@media` 的顺序，能力优先、尺寸其次；② 280px 这个下限，接近「缩略图里还能认出人」的临界；③ gap 用 0.5em 而不是 1rem，因为照片自己带白边。**代价：**`all: initial` 会把 gap 一起清掉，必须重写。

→ [原文与完整 CSS（Adactio，2026-06-16）](https://adactio.com/tags/gridlanes)

### ② Field Guide to Grid Lanes：把不可见的 Tab 顺序做成能播的

WebKit 团队 2026 年 6 月上线 [gridlanes.webkit.org](https://gridlanes.webkit.org/)，八个布局方向预设（Waterfall / Brick / Responsive equal / Responsive alternating / Fixed + responsive / 4 equal / Narrow–wide–narrow / Sidebar + main），一个实时改 `flow-tolerance` 的量条，还有一颗 **Play tab order** 的播放键。

**好在哪：**它把 CSS 里最难被看见的东西 —— 焦点顺序 —— 变成了动画。同一套卡片，容差 0px 时焦点在版面上跳，1em 时变得可预测，这两张截图放一起，比任何解释都省字。**你能偷的：**选方向之前先跑一遍「播放 Tab」，再决定要不要非对称；预设里 *Narrow–wide–narrow* 与 *Sidebar + main* 这两个非等宽方案，在中文内容站点上比等宽四列好使得多。

---

## 03 · 工具与素材：今天就能用

**1）Safari 26.4 的 Grid Inspector → Order Numbers。** Web Inspector 的网格面板里现在能直接给每个项目标序号，网格线、轨道尺寸、线名、区域名照旧。它同时支持 CSS Grid、Subgrid 和 Grid Lanes —— 换句话说，你可以把旧项目里的 Flexbox `order` 也一起查了。开关一开，流向对不对是一眼的事，不用再猜。

**2）一段可以直接抄的渐进增强骨架。** 把轮播当退化态，把 grid lanes 当增强态，中间用能力查询隔开：

```css
.gallery{
  display: flex;
  overflow-inline: auto;
  scroll-snap-type: inline mandatory;
}

@supports (display: grid-lanes) {
  @media (min-width: 56em) {
    .gallery{
      all: initial;
      display: grid-lanes;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: .5em;
      flow-tolerance: 1lh;
    }
    .gallery > *{ inline-size: 100%; }
  }
}
```

---

## 🎯 今天动手

**拿你项目里任意一个卡片列表** —— 把上面那段粘进去，Safari 26.4 打开，Grid Inspector 勾上 Order Numbers，然后只改一个数：`flow-tolerance` 依次设 0px → 1em → 10em，各截一张图。三张摆一起，你就能看见「紧凑」和「好读」之间那条线到底在哪。十分钟够了。

---

## 参考来源

1. [W3C · CSS Grid Layout Module Level 3（§4.2 Placement Precision: the flow-tolerance property）](https://www.w3.org/TR/css-grid-3/)
2. [MDN · Grid lanes layout（标注 Limited availability / Experimental）](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_lanes)
3. [Jen Simmons · When will CSS Grid Lanes arrive? · WebKit · 2026-01-22](https://webkit.org/blog/17758/when-will-css-grid-lanes-arrive-how-long-until-we-can-use-it)
4. [Jen Simmons & Brandon Stewart · New Safari developer tools provide insight into CSS Grid Lanes · WebKit · 2026-01-14](https://webkit.org/blog/17746/new-safari-developer-tools-provide-insight-into-css-grid-lanes)
5. [Jen Simmons · Introducing the Field Guide to Grid Lanes · WebKit · 2026-06-10](https://webkit.org/blog/18098/introducing-the-field-guide-to-grid-lanes)
6. [WebKit · WebKit Features for Safari 26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4)
7. [WebKit · The Field Guide to Grid Lanes（八个预设 + Tab 顺序回放）](https://gridlanes.webkit.org/)
8. [Jeremy Keith · Enhancing with CSS Grid Lanes · Adactio · 2026-06-16](https://adactio.com/tags/gridlanes)
9. [Saleh Mubashar · Native masonry layouts with CSS grid lanes · Piccalilli · 2026-10-22](https://piccalil.li/blog/native-masonry-layouts-with-css-grid-lanes/)
10. [Sunkanmi Fafowora · Masonry Layout is Now grid-lanes · CSS-Tricks · 2025-12-19](https://css-tricks.com/masonry-layout-is-now-grid-lanes)
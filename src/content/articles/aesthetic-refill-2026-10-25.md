---
title: "审美补给站 #006：滚动位置，第一次变成了排版参数"
description: "Tokopedia 用 CSS 的 scroll() 替掉自定义 JS 之后，代码行数最多减了 80%、滚动时平均 CPU 占用从 50% 掉到 2%。这期讲的不是「滚动时做点动画」，而是滚动进度第一次变成一个可以参与排版决策的连续量：scroll() 与 view() 两条时间轴、animation-range 的四个区间名，以及三家电商各自把「滚到哪儿」当成版面预算花掉的具体参数。"
date: 2026-10-25
tags:
  - "🎨 审美补给站"
  - "滚动驱动动画"
  - "CSS"
  - "交互设计"
---

## TL;DR

- **浏览器这一侧已经齐了，但还不到「当地基用」的程度** —— Chrome / Edge 115+（2023 年 8 月）与 Safari 26 默认支持，`view()` 全球覆盖率约 87.8%；Firefox 到 155（2026-09-01）仍然挂在 `layout.css.scroll-driven-animations.enabled` 这个实验开关后面。所以正确写法是「渐进增强」。
- **两个时间轴各管一段，`animation-range` 才是那个排版旋钮** —— `scroll()` 跟容器的滚动进度走（进度条、吸顶栏），`view()` 跟元素穿过视口的过程走（卡片显影）；而动画到底落在滚动的哪一段，由 `entry / cover / exit / contain` 这几个区间名决定。
- **真正省下来的是主线程** —— 这类动画不参与 JS 的 scroll 回调，跑在合成器线程上；Tokopedia 的实测收益是代码最多少 80%、滚动时平均 CPU 50% → 2%。

## 01 两个时间轴，加一个 animation-range

滚动驱动的动画不是新想法，老做法是监听 `scroll` 事件、在主线程里改 `transform`。问题是滚动事件是异步派发的，回调永远慢半拍，滚动一快就掉帧。**CSS 的解法很粗暴：把「时间」本身换掉** —— 动画不再沿时间轴前进，而是沿滚动进度前进 [1]。合成器线程负责插值，主线程被占住也不影响这一层。

落到代码上只有两个函数：

- `animation-timeline: scroll()` —— **匿名滚动进度时间轴**，认最近的祖先滚动容器（或 root）。容器从顶滚到底，进度 0 → 100%。适合进度条、吸顶栏的收起与展开、阅读指示器。
- `animation-timeline: view()` —— **视图进度时间轴**，认「这个元素相对视口的位置」。元素从刚碰到视口边缘到彻底离开，进度 0 → 100%。适合卡片显影、图片揭示、章节标题的进退。

可以带参数：`scroll(nearest block)` 指定容器与轴向，`view(block 200px auto)` 给两端加内缩。名字也可以自己起 —— `scroll-timeline-name` / `view-timeline-name` 定义一条命名时间轴，让一组元素共享同一条轴 [3]。

> 一句话区分：`scroll()` 的进度属于**容器**，跟你页面上有哪个元素无关；`view()` 的进度属于**某一个元素**，它进视口到出视口才算走完一轮。

### animation-range 才是真正的旋钮

默认情况下动画铺满整个 `cover` 区间。四个关键字来自规范 [5]：**cover** 从元素边缘第一次碰到视口边缘，到元素完全离开；**contain** 是元素完整待在视口里的那一段；**entry** 是 cover 起点到 contain 起点（入场），**exit** 是 contain 终点到 cover 终点（离场）。WebKit 那篇速查表给的判据很直白：**想让动画从「图片的第一个像素进入视口」时就开始，用 cover；想等它完全就位再收尾，用 entry** [7]。

组合写法是 `animation-range: <起点> <终点>`，例如 `entry 25% cover 50%`。注意那个百分比是**区间名内部的百分比，不是整页的百分比** —— 这是最容易算错的一处；同一个 `25%` 写在 `cover` 前和写在 `entry` 前，落到页面上的位置完全不同。

<div style="margin:18px 0;padding:14px 16px;border:1px solid #E6E0D6;border-radius:10px;background:#FFF;font-size:13.5px;color:#544F49;line-height:1.8"><b>兜底三条 · 少一条就翻车</b><br>① 整套包进 <code>@supports (animation-timeline: scroll())</code>；② 把动画的终态当默认态 —— 别让内容默认 <code>opacity: 0</code>，否则在不支持的浏览器上整段内容会直接消失；③ 尊重 <code>prefers-reduced-motion</code>（Firefox 155 的 DevTools 这次新增了这个模拟按钮 [9]）。另外，<code>animation</code> 简写会把 <code>animation-timeline</code> 重置回 <code>auto</code> —— <b>简写写在前面，时间轴写在后面</b>。</div>

## 02 作品 pick · 两个把滚动位置写进样式的产品页

### 1 · redBus 活动页相册：用 clip-path 做「显影」

redBus 在活动着陆页（转化漏斗最前面那一屏）给移动端和桌面端各做了一套滚动动画：移动端是照片画廊的图片显影，桌面端是 Cover Flow，两套都用 CSS 换掉了原来的自定义 JS。移动端那几行值得整段抄 [1]：

```css
img{
  view-timeline-name: --revealing-image;
  view-timeline-axis: block;
  animation: linear reveal both;          /* 简写在前面 */
  animation-timeline: --revealing-image;  /* 时间轴写在后面 */
  animation-range: entry 25% cover 50%;
}
@keyframes reveal{
  from{ opacity:0; clip-path: inset(45% 20% 45% 20%); }
  to  { opacity:1; clip-path: inset(0%   0%   0%   0% ); }
}
```

**好在哪：**它没有淡入了事。`clip-path: inset(45% 20% 45% 20%)` 让图片先缩成一条横向窄缝，再张开到全幅 —— 位移、裁剪、透明度三个量一起走，才有「揭幕」的手感，单纯 `opacity` 只会显得虚。

**你能偷什么：**① `inset()` 四值顺序是**上右下左**，起手值别对称成正方形，横向缝（上下收得多、左右收得少）比整体缩放更像摄影里的「拉幕」；② 命名时间轴让一组卡片共享同一条轴，排着队进场不必各写一条；③ `entry 25%` 意味着元素进视口四分之一之后才开始动，**前面那 25% 的静止正是它不抢戏的原因**。

### 2 · Policybazaar 方案对比表：滚动成了「压缩信息」的机制

保险比价表的信息密度极高。Policybazaar 的做法是：用户一开始滚动，就把标题栏往上推并淡出、把左侧的产品名缩到 `1.5rem`，把视口让给数字 [1]。参数干脆得像一句声明：

```css
@supports (animation-timeline: scroll()){
  .plan-comparison .inner-header{
    animation: move-and-fade-header linear both;
    animation-timeline: scroll();
    animation-range: 0 150px;
  }
  .plan-comparison .left-side{
    animation: shrink-name linear both;
    animation-timeline: scroll();
    animation-range: 0 150px;
  }
}
@keyframes move-and-fade-header{ to{ translate: 0% -5%; top: 103px; } }
@keyframes shrink-name{ to{ font-size: 1.5rem; } }
```

**好在哪：**`animation-range: 0 150px` 把「前 150px 滚动距离」当成一笔固定预算 —— 动画在这 150px 内走完并停在终态，之后的滚动完全干净。这是把滚动距离当版面预算花掉，而不是当触发器用。该部门设计主管 Rishabh Mehrotra 的说法是：这样能最大限度利用视口，让用户专注于比较本身。

**你能偷什么：**① 这类 UI 收缩动画用**像素**而不用百分比来限区间，行为可预测，页面变长也不用重算；② 整套包在 `@supports` 里，不支持的浏览器保持原样，而不是「动画没跑、版面却乱了」；③ **先决定砍谁，再决定怎么动** —— 收缩的目标永远是低优先级元素（表头、行首），不是正文。

| 数字 | 出处 |
| --- | --- |
| ≤80% | Tokopedia 用 CSS 时间轴替换自定义 JS 后减少的代码行数 |
| 50% → 2% | Tokopedia 滚动时的平均 CPU 占用 |
| 150px | Policybazaar 标题收缩动画走完的滚动预算 |

顺带提一句同批案例里的第三种用法：Tokopedia 的顶部吸附栏按滚动位置显示 / 隐藏，参数是 `animation-range: 20px 70px`、高度 `0 → 48px` —— 起止都留了 20px 与 70px 的余量，所以栏子在吸顶 / 展开的临界点上不会来回抖 [1]。

## 03 工具 · 一个能看见区间的站点，加一层兜底

**① scroll-driven-animations.style（Bramus Van Damme）** —— Bramus 是 Chrome DevTools 团队的 DevRel 工程师，这个站不只是 demo 集，它有 Demos、Tools、免费视频课、DevTools 扩展四块内容 [10]。最实用的是 Range 工具：拖滑块调 `animation-range`，页面上实时高亮当前落在 `cover / contain / entry / exit` 的哪一段，并直接给出可复制代码 —— 上面那几段参数里的百分比到底落在哪儿，用它比在编辑器里改了看快了不止一倍。配套的 10 集免费课程《Unleash the Power of Scroll-Driven Animations》也在这个站上。

**② Scroll-timeline polyfill（flackr/scroll-timeline）** —— 给不支持 `animation-timeline` 的浏览器补一层 JS 实现，源码在 github.com/flackr/scroll-timeline。但别无声无息地挂上去：Chrome 的案例研究明确提醒，用了 polyfill 就要多做一轮测试，确认它能跟你的框架协同、不会出现动画失败或卡顿 [1]。**能靠 `@supports` 优雅降级时，优先降级而不是打补丁。**

**③ 顺手记两个调试位**：Chrome DevTools 的 Animations 面板从 Chrome 124 起把滚动驱动动画与普通时间动画分开显示（滚动驱动那个带滚动图标）；Firefox 155 的 DevTools 新增了 `prefers-reduced-motion` 模拟按钮 [9]。检查「关掉动效之后还剩什么」，现在有按钮了。

## 🎯 今天动手 · 给一列卡片加「有区间的」显影（10 分钟）

1. **先贴这段，不改 HTML** —— 给任意一列卡片（比如文章列表、产品网格）挂上：

```css
@supports (animation-timeline: view()){
  .card{
    animation: reveal linear both;      /* 简写在前 */
    animation-timeline: view();         /* 时间轴在后 */
    animation-range: entry 0% entry 60%;
  }
}
@keyframes reveal{
  from{ opacity:0; translate: 0 12px; clip-path: inset(12% 8% 12% 8%); }
  to  { opacity:1; translate: 0 0;    clip-path: inset(0% 0% 0% 0%); }
}
@media (prefers-reduced-motion: reduce){ .card{ animation: none; } }
```

2. **先去 DevTools 确认它「挂上了」** —— 打开 Animations 面板再滚动页面，能看到一条**带滚动图标**的动画组就对了。如果什么都没有，先检查 `animation` 简写是不是写在 `animation-timeline` 后面（简写会把它重置回 `auto`）—— 这是这套 API 里最常见的坑。
3. **然后只调一个值** —— 把 `entry 60%` 换成 `cover 50%`，前后各滚一遍，比一比「还没就位就开始动」和「就位后才动完」哪个更像你要的节奏。往后再试一步：把 `clip-path` 那两行删掉、只留透明度与位移，你会立刻感觉到差别在哪。

## 参考来源

1. [Swetha Gopalakrishnan / Saurabh Rajpal · Scroll-driven animations case studies（Tokopedia / redBus / Policybazaar，含代码与实测数字） · Chrome for Developers](https://developer.chrome.com/blog/css-ui-ecommerce-sda)
2. [Chrome for Developers · Animate elements on scroll with Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
3. [MDN · CSS scroll-driven animations（指南）](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
4. [W3C · Scroll-driven Animations Module Level 1（区间名称与 animation-range 语法）](https://www.w3.org/TR/scroll-animations-1/)
5. [MDN · animation-range](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range)
6. [WebKit · A guide to Scroll-driven Animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css)
7. [WebKit · So many ranges, so little time: A cheatsheet of animation-ranges](https://webkit.org/blog/17184/so-many-ranges-so-little-time-a-cheatsheet-of-animation-ranges-for-your-next-scroll-driven-animation)
8. [WebKit · WebKit Features for Safari 26.4（threaded scroll-driven animations 走合成器线程）](https://webkit.org/blog/17862/webkit-features-for-safari-26-4)
9. [MDN · Firefox 155 release notes for developers（scroll-driven animations 仍在 layout.css.scroll-driven-animations.enabled 实验开关后；DevTools 新增 prefers-reduced-motion 模拟）· 2026-09-01](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/155)
10. [Bramus Van Damme · Scroll-driven Animations（demos / range 工具 / 免费课程 / DevTools 扩展）](https://scroll-driven-animations.style/)

---

*参数均来自可查的规范、官方文档与公开案例研究；引用他人作品仅作评述用途，配图为本期自制示意图，未使用任何受版权保护的素材。*
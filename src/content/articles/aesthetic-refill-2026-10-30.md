---
title: "审美补给站 #011：颗粒不是质感，是抖动"
description: "Firefox 用一个补了十五年的 bug 收走了噪点的第一份工作。这期给一套能抄的三段参数：feTurbulence 0.65/3 octaves/stitch、contrast(170%) brightness(1000%)、20fps + 视口 1.1 倍 + position:fixed；另附 Analogue 与 Risotto 两个 pick。"
date: 2026-10-30
tags:
  - "🎨 审美补给站"
---

你在大屏上看到的那层"高级颗粒"，一直在偷偷干两件事。**第一件是遮丑**：8 位的 framebuffer 把平滑渐变切成一条条硬边色带，撒点噪声把那几级台阶打散，人眼就看不出来了。这是电影和印刷用了一百年的老办法，叫 dithering。**第二件才是表态**：告诉人这不是纯数字生成的面，它有纸张、有胶片、有滚筒压过的痕迹。

十月中旬起，第一份工作被浏览器自己接走了。Mozilla 的 Bugzilla 627771 开了十五年，标题就是"给渐变过渡加 dithering 以解决 24 位真彩下的色带"，现在状态 **RESOLVED FIXED**，里程碑 **145**。Firefox 从 145 起会自己抖渐变。

结论很锋利：**如果你的颗粒只在遮色带，那它就是技术债；只有当它开始承担第二份工作时，才值得留在代码里。** 而留下来的时候，参数得重估。

## 01 · 三段参数：写在哪儿、多密、多快

**写在哪儿。** SVG 端用 `<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch">`，外层 200×200 的 viewBox 就够。`baseFrequency` 决定颗粒直径，0.65 大约是 1.5px 一个噪点单元，Pura 组件的默认值更细一点，给到 0.8；`stitchTiles="stitch"` 是唯一能让这张图平铺时接缝不露馅的开关，别省。`numOctaves` 给 3，超过 4 只是在浪费 GPU。

**多密。** CSS-Tricks 那套写法的精髓是 `filter: contrast(170%) brightness(1000%)`——先用亮度把噪声推到接近全白，只留下极少数亮点，再用对比度把这点亮斑抠实，于是噪点从"一层灰雾"变成"稀疏的闪光"。Analogue 的做法相反但同样有效：canvas 里四个通道全填 `Math.random()*255`（连 alpha 一起随机），出来的是天然半透明的噪声，再补一句 `opacity:.2; filter:grayscale(1)`。

**多快。** Analogue 把重绘锁在 **20fps**（`fpsInterval = 1000/20`），并且把 canvas 分辨率设成视口尺寸的 **1.1 倍**。1.1 这个数字是整段的灵魂：正好让颗粒被插值放大 10%，避开 1:1 像素对齐产生的"数字斑点"。层本身是 `position:fixed; 100vw/100vh; pointer-events:none; z-index:0`——**颗粒必须活在屏幕空间里**，跟着内容滚的那种一秒就露馅，因为它从胶片变成了壁纸。

> **别忘了一句兜底。** 动态颗粒本质是全屏高频闪烁。`@media (prefers-reduced-motion: reduce)` 里把它换成静态帧（Pura 的 `static` 属性就是干这个的）。这不是政治正确，是癫痫风险。

## 02 · 两个 pick：一个屏幕空间，四个版层

### Pick 1 · Analogue — 噪声是底，不是面

[madebyanalogue.co.uk](https://madebyanalogue.co.uk/)，Awwwards 2025 年 1 月 5 日的 Site of the Day。多数人把噪声做成叠在最上面的蒙版，Analogue 反过来：canvas 插在容器的**第一个子节点**，`z-index:0`，内容全在它之上。所以 `opacity:.2` 这么大的浓度也没糊掉一个字——颗粒是背景的质地，不是压在正文上的滤镜。

**你能偷的：** ① 噪声做容器底层，永远别做 body 顶层蒙版；② 每帧只刷 20fps，粒子的"抖"是低速的，接近胶片而非电视雪花；③ 字体侧它用 Adobe Fonts 的 amador / lores-12 / tt-commons-pro 三款，配 Google Fonts 的 DM Mono 做小字，衬线大字 + 等宽小字的组合本身就是"印刷感"的一半来源。

### Pick 2 · Risotto 的 Riso Club — 四层版，一百期

格拉斯哥的 Risotto 从 2012 年做到现在，主理人 Gabriella Marcella。Riso Club 是一个每月寄一张艺术家卡片、做了十年的订阅计划，今年到了第 **100 期**，累计 **400 张**，四月在 The Glue Factory Galleries 办了个把全部印张一次摊开的展（Riso Club 100，2026 年 4 月 11–19 日）。Risograph 的孔版印刷有个硬约束：一张画最多分几个版，每个版一种专色。

**你能偷的：** 页面上的颗粒应该按"版层"来分布，而不是全图铺一张。分别在图片、纯色块、文字底上各调浓度（图片 6%、纯色 3%、文字底 1.5%），颗粒就变成了分版逻辑，而不是一层均匀的脏。

## 03 · 能立刻装的工具

**① Pura 的 `<pura-noise>`**——零 JS 的颗粒层。原理是把一张 feTurbulence 切片编成 data URI 塞进背景，再用 `steps()` 关键帧推 `background-position`，于是"动画"完全不占用主线程，SSR 阶段就能先画出静态纹理，reduced motion 下自动静止。默认值可以直接照抄：`opacity 0.08`、`size 256`（px，越小越细）、`frequency 0.8`，另有 `fps`、`blend`、`static` 三个属性。

**② CSS-Tricks 那张 `noise.svg` + grainy-gradients 的交互 playground**——不想装组件的时候，把官方那张 200×200 的 SVG 存下来当素材用，配套的 playground 能实时拖 `baseFrequency` 和 octaves，拖到满意直接抄参数。

## 🎯 今天动手：给你的 hero 做一次减法

1. **存一张 noise.svg** —— 把上面那行 `<feTurbulence>` 连同 200×200 的 rect 存成文件，10 秒的事。
2. **贴一层 3%** —— `position:fixed; inset:0; background:url(noise.svg); background-size:200px; opacity:.03; filter:grayscale(1) contrast(170%); pointer-events:none`。
3. **截图比一次** —— 关掉、打开各截一张，把 opacity 从 .03 往上推，到"色带刚好消失但没有灰雾"停手，把那个数值记进 design token。这个数比任何"高级感"的描述都有用。

## 参考来源

1. [MDN · `<feTurbulence>`（baseFrequency / numOctaves / stitchTiles，默认 linearRGB）](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
2. [Mozilla · Bug 627771 渐变 dithering，RESOLVED FIXED / milestone 145](https://bugzilla.mozilla.org/show_bug.cgi?id=627771)
3. [Jimmy Chion · Grainy Gradients · CSS-Tricks 2021-09-13](https://css-tricks.com/grainy-gradients/)
4. [Awwwards · Analogue，Site of the Day 2025-01-05](https://www.awwwards.com/sites/analogue)
5. [Analogue · 站点本体（canvas 噪声层，1.1× / 20fps / opacity .2）](https://madebyanalogue.co.uk/)
6. [Pura · Noise / Film Grain 组件文档](https://andreahlert.github.io/pura/docs/noise)
7. [Ellis Tree · Risotto: 400 printed postcards / Riso Club 100 · It's Nice That 2026-04-09](https://www.itsnicethat.com/features/risotto-riso-club-graphic-design-spotlight-080426)
8. [Frost Kiwi · How to (and how not to) fix color banding](https://blog.frost.kiwi/GLSL-noise-and-radial-gradient)
9. [Temani Afif · Making Static Noise From a Weird CSS Gradient Bug · CSS-Tricks 2022-11-18](https://css-tricks.com/making-static-noise-from-a-weird-css-gradient-bug)
10. [CodeFronts · Anti-Banding Grainy CSS Gradient · 2025-08-29](https://codefronts.com/design-styles/css-grain-texture/anti-banding-grainy-css-gradient)

---

*作品版权归原作者所有（© Analogue / © Risotto），仅作评述引用。第 #011 期 · 2026-10-30 · 由 clacky 自动整理。*
---
title: "审美补给站 #034：每行字落在哪条线上，浏览器今年才学会算"
description: "印刷厂拿基线网格管了一百年，网页一直做不到——因为浏览器对齐的是盒子，不是字。今年八月 Firefox 154 补上最后一个缺口，text-box-trim + round() + cap 单位凑齐，一行 mixin 就能让标题、注脚、表格、按钮的第一条基线全压到 8px 的格点上。附完整算式（cap 11.4px → 补 4.6px）、两个自带网格开关的站，和一条十分钟能做完的改法。"
date: 2026-11-22
tags:
  - "🎨 审美补给站"
  - "排版"
  - "CSS"
  - "网格系统"
  - "基线网格"
---

Figma 里量好 24px 的间距，搬到浏览器里看着就是大一点。这不是错觉：24 是**行盒**的高度，浏览器在行盒上下各补了半个半行距（half-leading），于是第一行字的顶端离上一块就多出了两份隐形空气。同一个 16/24 的正文，左右两栏并排时，两边的字会在不同高度上开始——眼睛在你叫得出名字之前就发现了。

![印刷刊物、浏览器窗口、手机屏三者的文字行底边落在同一条基线上](https://mxppxm.github.io/images/aesthetic-refill-2026-11-22.jpg)

**TL;DR**

- **三件套：`text-box: trim-both cap alphabetic` + `round(up, 1cap, 8px)` + `cap` 单位。** 第一个把块裁到「大写字母顶 → 基线」，后两个把这条基线推到 8px 的格点上。Safari 18.2 / Chrome 133 / Firefox 154，2026 年 8 月起 Baseline。
- **前提是行高必须是节距的整数倍。** 8px 模块配 16 / 24 / 32 的行高、16 / 24 / 32 的间距。有一处不是倍数，下面全歪，而且歪得很隐蔽。
- **两个站把这件手艺做成了可以当场验证的东西。** nasedk.in 右上角有「基线网格」开关，bernat.ch 敲 `← ← g` 就叠出网格，降级方案还能直接抄。

## 01 · 8px 基线网格的三件套，和两个必须还的账

印刷不是这样。铅字时代每一行都压在同一把看不见的尺上；Müller-Brockmann 的网格里，模块高度必须是正文行数的整数倍。网页做不到，原因有三：浏览器对齐盒子不对齐字；基线在行盒里的位置由字体文件的 ascender / descender 决定，换字体就换位置；CSS 从来没有 InDesign 那个勾选框——`line-grid` / `line-snap` 从 2014 年挂在工作草案里，没有浏览器实现过。

### 三个值，缺一不可

`text-box: trim-both cap alphabetic` 让一个块从大写字母的顶开始、到最后一行基线结束，等于把 InDesign 的文本框搬进 CSS。它不能独干：裁掉多余空气不等于落格，因为 cap height 几乎从不是 8 的整数倍。`cap` 单位取的是「实际加载的那个字体」的大写字母高，`round()` 负责向上取整到 8 的倍数，多出来的那几像素塞进 `padding-top`。

```css
@mixin on-baseline($top: 0px) {
  padding-top: $top;
  @supports (text-box: trim-both cap alphabetic) {
    text-box: trim-both cap alphabetic;
    padding-top: calc(#{$top} + round(up, 1cap, 8px) - 1cap);
  }
}
```

算一遍：cap 高 11.4px → 向上取到 16px → 补 **4.6px** 的 padding，第一条基线正好落在格点上；块底被裁到基线，下一块从格点开始，节奏就接上了。换成 Capsize 那类方案得硬写一张字体度量表，这个跟着实际字体算，字体回退也不会飘。

![文本框顶部补齐 4.6px 后基线压到 8px 网格线上](https://mxppxm.github.io/images/aesthetic-refill-2026-11-22-fig2.jpg)

### 账本第二条：行高必须是节距的倍数

第一条基线落格之后，剩下的全靠这条：**行高必须是 8 的整数倍**。注脚 16px、正文 24px、行标题 32px；间距 16 / 24 / 32；页头高 64。这不是洁癖，是唯一能让「下一个块」自动接上的充要条件。流体字号也能用同一招：`font-size: clamp(2rem, 4.5vw, 4rem)` 配 `line-height: round(1.08em, 8px)`——字号随便缩放，行距只在 8 的刻度上跳。

### 两个必须还的账

一是**分隔线**。一条 1px 的横线会把下面的一切推下去 1px，所以这 1px 得从邻近的内边距里扣：表格行写成 `padding: calc(1rem - 1px) 0 1rem`，线占了空气的位置，节奏不动。

二是**图片**。`height: auto` 会给出任意高度，下面所有字跟着漂。做法是把容器设成尺寸容器，再按宽高比算高度并取整：`height: round(calc(100cqw * var(--media-ratio)), 8px)`。比例会因为取整漂零点几个像素，那是可以换的代价。

做不到的地方作者也列了：`text-box-trim` 只对 block 容器生效，flex / grid 里直接失效（带箭头的链接得把文字 span 单独 trim）；Markdown 里 `<strong>` 后面那段裸文本没有自己的盒子，没东西可裁。

> **一句判断：8px 模块是给系统用的，不是给美学用的。** 产品界面、设计系统、16 / 20 / 24 的图标要对得上，用 8px 模块；长文章用 `lh` / `rlh` 做单位更划算——单位不是像素，是「一行」，字号一改整套节奏跟着走，不用重算表。壳子用 8px，正文用 1lh，不冲突。

降级线是 `lh` / `rlh`：`1lh` 等于当前元素一个算好的行高，2023 年全浏览器支持，2026 年 5 月起 Widely Available。不想追绝对格点、只要「每行同一单位」的节奏，用这两个就够了。

## 02 · 两个作品：把不可见的秩序做成可开关的

### Ben Nasedkin · nasedk.in

**好在哪**：标题、注脚、表格、按钮，整站每条基线都落在 8px 的步长上，正文用 Graphik。最狠的一点是页面右上角挂了个 **Baseline grid** 开关——读者一点，整页的网格就浮出来，前面那篇文章说的每句话都能当场验。底色从它自己的主题变量里能读到：浅色 `#ECEAE5`，深色 `#1a1a1a`。

**你能偷**：那个开关本身就是说服工具——把「看不见的秩序」做成可切换的，比写十段说明管用；以及 mixin 外面那层 `@supports (text-box: trim-both cap alphabetic)`，老浏览器直接走原样，不报错也不掉版。

[Setting the Web on a Baseline Grid（2026-10-28）](https://nasedk.in/blog/baseline-grid)

### Vincent Bernat · vincent.bernat.ch

**好在哪**：他没追 8px，走的是「一行就是一个单位」。`html` 上给 `font-size: 112.5%`（18px）配 `line-height: 1.5`，一个单位就是 27px；之后所有间距写成 `2rlh` / `1rlh`，`h1` 的 line-height 直接设 `2rlh`。页面里连敲 `← ← g` 会叠出一层横线网格，自己检查有没有掉拍——这篇讲的就是「插入图片和表格之后怎么再把节奏接回来」。

**你能偷**：单位可以不是像素，而是「一行」；以及那个自检 overlay 的写法——固定定位的 `::after`，一条 `linear-gradient` 画 1px 线，`background-size: 100% 1rlh`，零依赖，随时开关。

[CSS & vertical rhythm for text, images, and tables（2026-04-22）](https://vincent.bernat.ch/en/blog/2026-css-vertical-rhythm)

![左：两组文字行底边错开半行；右：同一组文字压进 8px 节距的网格](https://mxppxm.github.io/images/aesthetic-refill-2026-11-22-fig3.jpg)

## 03 · 工具与素材：两张节奏表生成器

**Gridlover**（gridlover.net）：三个滑块——基准字号、行高倍数、字号比例——右边实时给出 line-height 和 margin 的 px 清单。它输出的是老派的 px 值，正好拿来当 8px 倍数表打底：先让它算节奏，再把每个数字往上凑到 8 的倍数。

**Utopia**（utopia.fyi）：流体字号和间距阶梯，直接导出 `clamp()` 的 CSS 变量。把它的间距尺度对齐到 8 的倍数之后，桌面和手机不用维护两套节奏表——这也是「8px 壳 + 流体内容」最省事的组合方式。

## 🎯 今天动手（10 分钟）

1. **先把尺子铺上去。** DevTools 里粘这段，24px 一条红线，只看不动版：

```css
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;
background:linear-gradient(#D8472B33 1px,transparent 1px);background-size:100% 24px}
```

2. **抓第一处错位。** 找一个「标题 + 一段正文」的组合，看标题底边和正文第一条基线是不是都在红线上。多半是个半行距的差。
3. **改一个数。** 把正文 `line-height` 换成 `round(1.5em, 8px)`（或者干脆写 24px），再把 `margin` 都凑成 8 的倍数。
4. **再开一次尺子。** 对上就留着；这层 overlay 抄进书签栏，以后每次改版都能十秒钟复查。

## 参考与作品链接

1. [Ben Nasedkin · Setting the Web on a Baseline Grid（2026-10-28）](https://nasedk.in/blog/baseline-grid)
2. [Ben Nasedkin · 个人站（右上角自带 Baseline grid 开关）](https://nasedk.in)
3. [Vincent Bernat · CSS & vertical rhythm for text, images, and tables（2026-04-22）](https://vincent.bernat.ch/en/blog/2026-css-vertical-rhythm)
4. [MDN · text-box-trim（标注 Baseline 2026，2026 年 8 月起可用）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim)
5. [Chrome for Developers · CSS text-box-trim（Adam Argyle，2025-01-14）](https://developer.chrome.com/blog/css-text-box-trim)
6. [WebKit · Polishing your typography with line height units（lh / rlh）](https://webkit.org/blog/16831/line-height-units)
7. [Web Platform DX · lh unit（2026-05-21 起 Widely available）](https://web-platform-dx.github.io/web-features-explorer/features/lh/)
8. [Gridlover · 垂直节奏表生成器](https://gridlover.net)
9. [Utopia · 流体字号与间距阶梯，导出 clamp 变量](https://utopia.fyi)
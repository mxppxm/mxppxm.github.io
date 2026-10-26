---
title: "审美补给站 #007：首字下沉回来了，这次它带了一把尺子"
description: "initial-letter 只管把首字母按行高沉下去，让它第一次真的对齐栅格的是 text-box: trim-both cap alphabetic；顺带拆 Fraunces 与 Newsreader 两款开源可变衬线，附支持度实测表。"
date: 2026-10-26
tags:
  - "🎨 审美补给站"
---

> **TL;DR**
> 1. **`initial-letter: 3` 取代了 float + 手调负 margin。** 数字就是下沉行数，写第二个值 `3 2` 就变成「跨 3 行、只沉 2 行」的上升大写；Chrome/Edge 110+，Safari 要 `-webkit-` 前缀，Firefox 至今不认，降级成普通首字母。
> 2. **`text-box: trim-both cap alphabetic` 才是那把尺子。** 按大写高度线与基线切掉文字块上下的字形空隙，标题第一次能和图片严丝合缝对齐；Chrome/Edge 133+、Safari 18.2+、Firefox 154+，2026-08-18 起 Baseline Newly available。
> 3. **配字要配轴。** Fraunces 与 Newsreader 都能在首字母放大时自动换成 display 档笔画，`font-optical-sizing: auto` 让浏览器替你拨这根轴。

---

## 01 · 首字下沉，终于不用手调负 margin

首字下沉（drop cap）是最容易做、也最容易做丑的一个动作。以前的标准做法是 `float: left`，配一个靠眼睛试出来的 `font-size: 3.2em`，再加两三个 `margin-top: -8px` 微调。丑不丑是次要问题，真正的麻烦是**它只在一个字号、一种字体下成立**——行高一改、字一换，那几个负 margin 全部作废。

现在有真版本了，两行就够：

```css
.article > p:first-of-type::first-letter {
  -webkit-initial-letter: 3;   /* Safari */
  initial-letter: 3;           /* Chrome / Edge 110+ */
  margin-inline-end: .5rem;
}
.plate { text-box: trim-both cap alphabetic; }
```

`initial-letter` 的值就是**下沉行数**：写 `3`，首字母跨 3 行、沉 3 行，底部正落在第三条基线上；写两个值 `3 2`，就是「跨 3 行、只沉 2 行」的**上升大写（raised cap）**，字顶探出段落之上。首字母该放大到什么字号不用你算——它按行高推算，行高变了它跟着变。这是它和 `font-size: 3.2em` 的本质区别：后者只是把第一行撑大，前者才是在排版。文字会自己绕着它走，不需要 float，也不需要任何魔数。

但只写这一行还差一口气。任何字体都在字形上下留了一层空气（大写字母顶点到行盒顶、基线下到行盒底），所以「首字母下沉 + 标题贴着图片」看着总差那么几像素。切掉这层空气的是第二句：**`text-box: trim-both cap alphabetic`**。`trim-both` 说切上下两边，`cap alphabetic` 说切在哪——上切到大写高度线，下切到基线。切完之后盒子边缘就等于字形边缘，标题与图片才第一次真的对齐。同一句话也是按钮文字「看起来居中」的正解：与其反复调 `line-height` 去蒙，不如 `trim-both cap alphabetic` 配你自己写的 padding。

**顺手要记住的两个参数：**

- `font-optical-sizing: auto` —— 首字母放大之后，让浏览器自动把可变字体的 opsz 轴推到 display 档：笔画变细、字口变开。不写这句，你看到的可能只是「被放大的正文」，放大后呆板、笔画粗黑。
- `text-wrap: pretty` —— 治落单的孤字。它和 `balance` 是两件事：`balance` 把标题的行长拉匀（Chromium 限制在六行以内，所以只适合标题、引文、图注），`pretty` 逐行重新评估段落末尾的断行。以前手动插 `&nbsp;` 的地方，一改栏宽就全错；`pretty` 会一直重算。

**值得注意 · 支持度实测表**（Chrome / Firefox / Safari 最低版本，据 Carmen Ansio 2026-07 汇总与 Web Platform DX 基线数据）：`clamp()` 79 / 75 / 13.1；`text-wrap: balance` 114 / 121 / 17.5；`text-wrap: pretty` 117 / 待确认 / 17.5；`initial-letter` 110 / 不支持 / 9（需 `-webkit-`）；`font-optical-sizing` 79 / 62 / 11；`hanging-punctuation` 不支持 / 不支持 / 10（Safari 17.4 起完整）。读法：**前四个可以放心上**；`hanging-punctuation`（悬标点，让开引号挂到版心之外）目前只有 Safari 认，Chrome 和 Firefox 会直接忽略——它适合当装饰层，别当地基。所有降级都是无害的：不支持时只是一段普通排版的文字。

## 02 · 两个能立刻用的可变衬线：一个会歪，一个能读

首字母下沉想做得漂亮，字体得能「变大不变呆」。下面两个开源可变衬线刚好覆盖两种取向：一个负责表演，一个负责长文。

- **4** —— Fraunces 的轴数：opsz / wght / SOFT / WONK
- **9** —— Newsreader 压进两根可变轴里的母版数
- **455 KB** —— Newsreader 正体 + 斜体两套 WOFF2 合计体积

### ① Fraunces（Undercase Type）· 会歪的那个

好在哪：四个轴不是摆设。**opsz 9–144** 负责尺寸档，**wght 100–900** 负责字重，**SOFT 0–100** 控制「墨量／软度」（越高越湿润油墨感），**WONK 0–1** 是手动替换成「歪字」——把 h、n、m 的竖笔画改成有倾斜的异体。它的 specimen 站（[fraunces.undercase.xyz](https://fraunces.undercase.xyz/)）把滑块直接摆在正文里，拖一下就知道每根轴在干什么。设计者是 Phaedra Charles 与 Flavia Zimbardi。

你能偷什么：**首字母用 opsz 144 + WONK 1 + SOFT 100** 拿到一个「手写感、对不上格」的大写字母，正文却保持 **opsz 14 + WONK 0** 规规矩矩。同一个字体文件里切换，不用加载两套字重、也不用找第二款字体来当「装饰字」。源码：[undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)。

### ② Newsreader（Production Type · Hugues Gentile）· 能读的那个

好在哪：它是 Google Fonts 委托、为「屏幕上长时间阅读」做的过渡衬线，轴只有两根——**opsz 6–72** 与 **wght 200–800**，正体与斜体各一套。据 [Dan Cătălin Burzo 的实测](https://danburzo.ro/variable-fonts)，它把九个母版（Caption 6pt 到 Display 24pt+ 的手工切档）压进这两根轴，正斜两套 WOFF2 合计约 **455 KB**。换句话说：一套文件，干完了九个母版的活。

你能偷什么：正文 16px 让它自动吃 opsz 16，标题和首字母下沉时靠 `font-optical-sizing: auto` 推到 72——笔画自然变细、字距变开，你不会看到「放大后变呆」的那种字。这是把 display 档和 text 档真正分开、又不用付两份下载成本的省事解法。[Google Fonts · Newsreader](https://fonts.google.com/specimen/Newsreader)

## 03 · 工具与素材：Capsize + 一句 text-box-trim

**① [Capsize](https://github.com/seek-oss/capsize)**（seek-oss/capsize，开源）：输入你的网页字体与 fallback 字体，它吐出可直接贴进 `@font-face` 的 `size-adjust`、`ascent-override`、`descent-override`、`line-gap-override` 四个数字。**你不会想手工试这四个值**——它的作用是让 fallback 字体占的版面空间和网页字体几乎一致，网页字体到达时不再整页跳动（也就是把 CLS 压下去）。同一件事还有 `@nuxtjs/fontaine` 与 Next.js 的 `next/font` 帮你自动做。

**② [modern.css 的 `text-box-trim` 片段](https://modern-css.com/changelog/)**：一行声明，裁掉 CJK 全角标点与引号周围的字形空隙——它替代的是以前「按元素写负 margin 和 `text-indent`」的土办法。配套可以看 [Typ.io 那篇 2026 版清单](https://typ.io/guides/css-typography-features-2026)，七个属性都带能直接跑的 live demo，支持信息更新到 2026 年 9 月。

## 🎯 今天动手（10 分钟）

1. **给文章第一段加一个真首字下沉** —— 在你任意一篇文章页写 `p:first-of-type::first-letter{ initial-letter: 3; margin-inline-end: .5rem; font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto }`。
2. **给正文容器加那把尺子** —— 同一条规则里加上 `text-box: trim-both cap alphabetic`，然后去看标题和正文块的上下边距，通常能立刻收掉肉眼可见的几像素虚位。
3. **收尾两个小值** —— 给第一段加 `text-wrap: pretty` 治孤字，最后把窗口拉到 360px 宽再看一眼：下沉行数是按行高算的，窄屏最容易露馅。

---

**参考与作品链接**

1. [Typ.io · 7 CSS Typography Features You Didn't Know Existed（2026，含 live demo 与支持版本）](https://typ.io/guides/css-typography-features-2026)
2. [Carmen Ansio · Editorial Typography in CSS: text-wrap and initial-letter（2026-07-11，支持度汇总表出处）](https://www.carmenansio.com/articles/editorial-typography-css)
3. [MDN · initial-letter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/initial-letter)
4. [MDN · text-box-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim)
5. [Web Platform DX · Text Box 特性基线（Chrome/Edge 133、Safari 18.2、Firefox 154；Baseline 2026-08-18）](https://web-platform-dx.github.io/web-features-explorer/features/text-box.json)
6. [Chrome for Developers · CSS text-box-trim（Adam Argyle，2025-01-14）](https://developer.chrome.com/blog/css-text-box-trim)
7. [W3C · CSS Inline Layout Module Level 3（initial-letter 与 text-box 规范）](https://drafts.csswg.org/css-inline-3/)
8. [Undercase Type · Fraunces（specimen 与 opsz / wght / SOFT / WONK 四轴说明）](https://fraunces.undercase.xyz/) ／ 源码 [undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)
9. [Google Fonts · Newsreader（Production Type / Hugues Gentile）](https://fonts.google.com/specimen/Newsreader) ／ 九母版与 455 KB 实测 [Dan Cătălin Burzo · This website uses a variable font](https://danburzo.ro/variable-fonts)
10. [Capsize（seek-oss/capsize，fallback 字体度量覆盖）](https://github.com/seek-oss/capsize) ／ [modern.css · text-box-trim 片段与更新日志](https://modern-css.com/changelog/)

---

*第 #007 期 · 2026-10-26 · 审美补给站 · 由 clacky 自动整理 · 每日 09:45 更新。参数均来自可查的规范、官方文档与公开案例研究；引用他人作品与字体仅作评述用途，配图为本期自制示意图，未使用任何受版权保护的素材。*
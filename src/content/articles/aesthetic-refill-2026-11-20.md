---
title: "审美补给站 #032：手敲的那个空格，比浏览器自动加的大 2.7 倍"
description: "text-autospace 终于三家都上了，中文和拉丁字母之间那道缝可以交给引擎 —— 但三家的初始值都被改成了默认关，你不写就一行都不插。我在本机 Chrome 157 里量了同一串日期：自动插缝 0.125em/道，手敲空格 0.333em/道，差 2.67 倍；而 Chrome 只认两个关键字，其余四个静默失效。附三个实测数字、两个把中英混排当正事做的站，和一条十分钟能做完的改动。"
date: 2026-11-20
tags:
  - "🎨 审美补给站"
  - "CSS"
  - "text-autospace"
  - "中文排版"
---

中文和拉丁字母挨在一起的时候，规范要求中间留一道很小的缝。这道理不新鲜，十年来的解法是 `pangu.js`：渲染前把字符串拆开，往中英之间塞一个空格字符。代价是文本被改脏了 —— 复制出来带空格，搜索匹配不上，朗读会多停半拍。

现在这件事终于下沉到排版引擎了。Chrome 140、Safari 18.4、Firefox 145（2025 年 11 月 11 日发布）都实现了 `text-autospace`，改动方式是一行声明，不动内容。MDN 上写着 Baseline 2025 newly available，看起来是「可以用了」。

但这里有个坑，而且是三家一起踩的：规范说初始值应该是 `normal`（默认开），三家实现全部把它设成了 `no-autospace`（默认关），理由写在 CSSWG 的 issue #12386 里 —— 突然给全世界的网页加宽一行字，风险太大。**所以你什么都不写，就什么都没有。**

![一个汉字宽 = 1em，中间那道缝只占它的八分之一](https://mxppxm.github.io/images/aesthetic-refill-2026-11-20.jpg)

**TL;DR**

- **三家都实现了，但默认全关。** Chrome 140 / Safari 18.4 / Firefox 145 都支持 `text-autospace`，初始值却统一被改成 `no-autospace`，不写就没缝。
- **引擎给的缝是 0.125em，你手敲的空格是 0.333em。** 实测同一串「2026年11月20日」，自动插缝 +0.625em，手敲 +1.665em，差 2.7 倍。
- **Chrome 只认两个值。** `ideograph-alpha`、`punctuation`、`replace` 在 Chrome 里静默失效 —— 不报错，也不生效。

## 01 · 那 1/8 em 的缝

### 三个数，量一遍

我在本机 Chrome 157 里量了同一串字符，只改 CSS，字号 60px，字体 PingFang SC：

- `text-autospace: no-autospace` → **444.1px**（基准，五个边界全贴着）
- `text-autospace: normal` → **481.6px**，多 37.5px，正好 **+0.625em**，五个边界平摊即 **0.125em/道**
- 手敲空格（`2026 年 11 月 20 日`）→ **544px**，多 99.9px，即 **+1.665em**，一个空格 **0.333em**

0.125em 这个数不是随便定的。CSS Text 4 里有一项 `text-autospace-size`，单位是 `ic`（一个汉字的字宽），默认值 0.125；规范的注释解释了为什么：1/4ic 在过去活字时代更常见，1/6ic 在比例排版里更常见，而默认取最保守的 1/8，是为了「尽量少打扰」。换句话说，**引擎给你的是最克制的那一档，而中文印刷传统偏向 0.25em**。

![三种宽度按一个汉字=1em 的比例自绘](https://mxppxm.github.io/images/aesthetic-refill-2026-11-20-fig2.jpg)

### 边界上已经有空格，引擎就不再加了

还有一个更隐蔽的行为：**边界上已经有空格字符时，引擎不再插自己的缝。** 我验证过 —— 给「2026 年 11 月 20 日」同时加上 `normal`，宽度还是 544px，跟只敲空格一模一样。这意味着从 pangu.js 迁过来时，存量内容里那些空格会继续挡路。想统一成 1/8 需要 `replace`，而 Chrome 恰好没实现它。所以迁移不是加一行 CSS，是**先清空内容里的空格**。

另外别拿 `letter-spacing` 去补这道缝。规范写明 `text-autospace` 与 `letter-spacing`、`word-spacing` 是**叠加**关系，你加的那 0.125em 会均匀撒到每个字上，中文段落立刻松散 —— 那不是混排，是字距坏了。

想调成 1/4 呢？暂时不行。`text-autospace-size` 目前没有任何浏览器实现 —— 我在 Chrome 157 里 `CSS.supports('text-autospace-size','0.25')` 返回 `false`，写了也不生效。所以今天你只有两个合法选项：接受 1/8，或者继续忍受手敲空格的 1/3。

![同一串日期的三种宽度实测](https://mxppxm.github.io/images/aesthetic-refill-2026-11-20-fig3.jpg)

### 值得注意：最难查的一种失效

Chrome 目前**只实现了 `normal` 和 `no-autospace`**。`ideograph-alpha`、`ideograph-numeric`、`punctuation`、`insert`、`replace`、`auto` 全部标记为未支持（见 MDN 兼容表）。

我实测确认过：写 `text-autospace: ideograph-alpha` 与 `no-autospace` 的宽度**完全一致**，一点没多。它不报错、不警告、DevTools 里也不划删除线 —— 你以为开了，其实没开。

顺手还有一件事值得一起做：全角标点挤压。`text-spacing-trim: normal` 会吃掉「他说：「好。」」里重复的内部间距 —— 7 个全角字，实测从 700px 掉到 600px，**整整省下 1em**。代价是兼容性更窄：只有 Chrome 123+，Safari 和 Firefox 都没有，只能当增强用，别拿它做版式基准。

## 02 · 作品 pick：两个把中英混排当正事做的站

同一个问题，两种解法：一个用**字体分层**把西文和中文各归各处，一个用**成套规范**把中文排版当成一个需要完整实现的系统。前者教你取舍，后者教你清单。

### The Type（类型森林）

中英双语的设计评论站 · thetype.com

我翻了它的生产 CSS，字体栈只有一行：`--font: "ABC Diatype", system-ui, sans-serif`。**西文是一个商用无衬线字体，中文完全没指定** —— 直接落到 `system-ui`，在 macOS 上就是苹方。

关键在于它的 `@font-face` 给 ABC Diatype 写了 `unicode-range: U+0-2CC, U+2CE-2D7 …`，把这款字体的作用范围**死死钉在拉丁区段**。同一段文字里，英文走 webfont，汉字自动穿过去用系统字体，两种字形互不污染，也不用为中文下载几 MB 字体。正文行高 1.7，标题另有 .02em 字距。

**你能偷什么：** 别指望「一套字体解决中英混排」。用 `unicode-range` 给西文字体划地盘，中文交给系统，是今天最省流量、观感最稳的做法 —— 中文 webfont 哪怕子集化也在几 MB 量级，网页正文根本付不起。

### 赫蹏 Hetí

中文排版样式增强库 · 6.8k stars · github.com/sivan/heti

它基本上是把 CLREQ（W3C《中文排版需求》）翻译成了一套 CSS：贴合网格的排版、古文与诗词样式、行间注、多栏、竖排、简繁支持、暗色适配。你看它的预览页会觉得「中文原来可以长这样」。

有意思的是它的实现选择：README 里明确写着，**中西文混排美化和全角标点挤压这两项「基于 JavaScript 脚本」**。这正是 CSS 原语缺席那几年的产物 —— 引擎不给，只能靠脚本往 DOM 里塞。而今天 `text-autospace` 和 `text-spacing-trim` 已经把这两件事接了过去（前者三家，后者仅 Chrome）。

**你能偷什么：** 它的分层方式值得抄 —— 网格、竖排、行间注这些「真需要布局代码」的部分留着，混排和标点挤压那两层可以撤掉，交给引擎。副作用是文本终于干净了，复制、搜索、朗读都不会再被塞进去的空格干扰。顺带一提，它把「行间注」这种中日古籍式的双行小注做成了组件，这在西文排版库里几乎找不到同类实现。

## 03 · 工具：查「哪个值没实现」的地方

**web-features explorer**（web-platform-dx.github.io）—— Baseline 官方数据的图形界面，比 Can I use 细一档：同一特性会拆到关键字级别，逐个告诉你哪家实现了哪个值。我今天就是靠它确认 Chrome 没实现 `ideograph-alpha` 的：主特性标着 Chrome 140，展开后那两个子项写着 Not supported。

第二个是「该退役的工具」：**pangu.js** 和它背后那份《中文文案排版指北》。规则没过时 —— 中英文之间确实该有缝；过期的是执行方式。运行时往内容里塞空格，今天该换成在 CSS 里声明一次；脚本只留一个用途：批量清洗历史存量。

```css
/* 正文容器，一行搞定 */
.prose, article :lang(zh) {
  text-autospace: normal;
  text-spacing-trim: normal; /* 增强项：仅 Chrome 123+ */
}
```

要兼容还在路上的浏览器，用 `@supports` 包一层即可 —— 特性检测可靠，不支持的引擎整段跳过，不会留下半生效状态。真正危险的是关键字级别的不支持（前面那个 `ideograph-alpha`），那类检测不出来，只能自己记住。

**三个数记住就够：0.125em 是引擎给的，0.333em 是你手敲的，2.67 倍是两者之差。**

## 🎯 今天动手（10 分钟内）

1. **挑一个你手边的中文正文页，给容器加上 `text-autospace: normal`。** —— 然后在 DevTools 里选中一行含数字的标题（比如「2026年11月20日」），量它的 `getBoundingClientRect().width`；取消勾选这条声明再量一次，差值应该约等于 `字符数边界 × 0.125em`。
2. **把 pangu 相关脚本从渲染路径上摘掉，再刷一次。** —— 如果变丑了，说明你的字体栈还依赖那个空格撑着；如果几乎没差，就可以永久删掉。这一条比第一条更值钱。

## 参考来源

1. [MDN · text-autospace CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-autospace)（含 Baseline 2025 与浏览器兼容表）
2. [MDN · text-spacing-trim CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-spacing-trim)（Limited availability）
3. [W3C · CSS Text Module Level 4：text-autospace / text-autospace-size](https://www.w3.org/TR/css-text-4/#text-autospace-property)（0.125ic 默认值及注释）
4. [Web Platform DX · web-features explorer：text-autospace](https://web-platform-dx.github.io/web-features-explorer/features/text-autospace/)（逐关键字支持状态）
5. [Can I use · css-text-autospace](https://caniuse.com/css-text-autospace)
6. [CSSWG · csswg-drafts issue #12386](https://github.com/w3c/csswg-drafts/issues/12386)（初始值为何是 no-autospace）
7. [Chromium · Issue 429178779](https://issues.chromium.org/issues/429178779)（auto 关键字尚未实现）
8. [Chrome for Developers · Introducing four new international features in CSS](https://developer.chrome.com/blog/ic-features)（2023-12）
9. [The Type · 类型森林](https://www.thetype.com/)（生产 CSS 与 unicode-range 实测）
10. [sivan/heti · 赫蹏：中文排版样式增强](https://github.com/sivan/heti)

---

*文中所有宽度数字均为本期在本机 Chrome 157 + PingFang SC 下的实测结果，可复现；规范与兼容性结论均附原始链接，未作推断性表述。*

*第 #032 期 · 2026-11-20 ·《审美补给站》· 由 clacky 自动整理 · 每日更新。*
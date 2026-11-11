---
title: "审美补给站 #023：中文和英文之间那道缝，规范只给了 1/8 em"
description: "手打的那个空格比排版规范宽一倍多。text-autospace 已是 Baseline 2025，一行 CSS 就能把缝交还引擎；附 1/8、1/6、1/4 em 三个规范数字、三条例外、以及两个把混排当骨架的站点实测。"
date: 2026-11-11
tags:
  - "🎨 审美补给站"
  - "排版"
  - "中文设计"
  - "CSS"
---

中文里夹进 Figma、2026、iOS 这类拉丁串，多数人的处理是手打一个空格。这动作看起来很「懂排版」，其实是错的工具：W3C 的国际化文章写得很直白 —— **空格字符带来的间隙太大**，正确做法是让排版引擎去插一个尺寸刚好的缝，而不是在内容里塞一个字符。

## 01 那道缝该有多宽，规范写死了三个数

这个缝该多宽，规范给了三个数：CSS Text Level 4 里 `text-autospace: normal` 的默认值是 **1/8 em**；中文排版需求 CLREQ 说可以到 **最多 1/4 em**；日文 JLREQ 建议 1/4 em，某些场合甚至只要 **1/6 em**。而一个常见拉丁无衬线体的空格 advance 在 **0.25 em** 上下 —— 你手打的那一下，直接顶在 CLREQ 的上限，等于规范默认值的两倍。16px 正文里，这一下的差别是 2px 和 4px，但一屏几十处叠起来，整块文字的呼吸节奏就塌了。

用 CSS 做这件事只需要一行，而且它**不改文本**：复制出去是干净的，搜索能命中，读屏软件也不会念出一串空格。

```css
/* 只补中文↔拉丁，不动别的 */
body { text-autospace: normal; }

/* 只要字母、不要数字粘着汉字 */
h2 { text-autospace: ideograph-alpha; }
```

可选值不止 `normal`：`no-autospace` 关掉、`ideograph-alpha` 只管汉字与字母、`ideograph-numeric` 只管汉字与数字、`punctuation` 管标点、`insert` / `replace` 决定是「额外插」还是「把已有空格替换成小缝」。最后这个 `replace` 别碰 —— W3C 明确说它尚未实现，且写上之后会连带破坏其他行为。

### 三条例外，写死在规范里

这条缝**不会**出现在三个位置上：行首和行尾不加；紧邻已有内置空白的标点时（比如全角括号、句号）不加；它和 `letter-spacing` 是**叠加**的，你给标题打了 `letter-spacing: .04em`，混排缝会在那个基础上再加。

第二刀是标点。`text-spacing-trim` 处理全角标点自带的半格空白 —— 连续两个标点时，两边的半格会拼成整整一格，视觉上像多打了一个字。目前实现到的值是 `normal` / `space-all` / `space-first` / `trim-start`；`trim-both`、`trim-all`、`auto` 在 MDN 上还是「无浏览器实现」。

> **值得注意 · 引擎差异**：Blink 在**默认状态**下就会折叠相邻标点之间多余的空白，Gecko 和 WebKit 不会。所以同一段文字，Chrome 里像有人调过，Safari 里就是散的 —— 你要的「标点挤压」，在非 Blink 内核上目前没有可靠解法，别把它写进设计交付的硬指标。

最后是时机：`text-autospace` 在 MDN 上标的是 **Baseline 2025**，「自 2025 年 11 月起在最新浏览器可用」。这个能力转正刚好一年 —— 它不是实验特性，是新基线，今天加它不算冒险。

## 02 两个把混排当骨架的站

**① The Type（thetype.com）** —— 中文排版媒体，导航条是它最值得抄的一处。

它的主导航写成「书籍 · 物件 · 字体 · 阅读 · 新闻 · 活动 · 研究 · 服务」，**用中点分隔，不用竖线**。竖线在中文语境里是个「视觉重音」，八项并列就是八记重音；中点只有 0.5 em 的呼吸，八项读下来是一句话而不是一张表。卡片区也用同一套逻辑：大色块底（深蓝 / 亮绿 / 橙红）+ 圆形裁切图片 + 白色中文标题，圆形与方角文字块形成软硬对照，色块饱和度压得住白色小字，不需要投影。

**你能偷的：**中文站点的并列分隔符换成 `·` 并在两侧留 0.5 em；卡片用「纯色块 + 圆形图 + 白字」三件套，色块自己承担分区，别再加边框和阴影。

原站 → [thetype.com](https://www.thetype.com/)

**② justfont（justfont.com）** —— 台湾字型公司，它的 font stack 是「中文字族该不该自建」的现成答案。

实测它页面的 `font-family`：正文走 `genyogothictw`（源柔黑體），标题走 `jf-jinxuan`（金萱），衬线场景换 `jf-lanyangming`（蘭陽明體）。三套自建中文族按**用途**分工，不是一个族打天下。更值得看的是兜底顺序：拉丁部分全部交给 `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial`，最后才挂 emoji 栈 `Apple Color Emoji, Segoe UI Emoji…`。

**你能偷的：**中文族写在拉丁之后 —— 拉丁字符先被系统字体接住，剩下的汉字才落到中文字体，不会出现「英文被中文字体的半角字形画丑」；emoji 族一定排最末，否则它会抢走数字和符号。

原站 → [justfont.com](https://justfont.com/)

## 03 两个能立刻用的工具

**pangu.js** —— 4,861 star，一句话定位：「偏执地插空格」。它是 `text-autospace` 之前那一代的解法：用 JS 扫 DOM，在汉字与拉丁之间塞空格字符。现在看它有点多余，但它解决一个 CSS 解决不了的问题 —— **你改不了那份 HTML**：老 CMS、第三方评论、别人发来的富文本。用法就是渐进增强：能改 CSS 的正文走 `text-autospace`，改不了的容器再挂 pangu。[github.com/vinta/pangu.js](https://github.com/vinta/pangu.js)

**Modern Font Stacks** —— 系统字体栈的现成清单，按「几何 / 人文 / 老式 / 单宽 / 工业」分类，每一类给出可直接粘的跨平台 fallback。它就是上面 justfont 那条「拉丁交给系统栈」策略的速查表，省掉你自己拼 `-apple-system` 那一长串。[modernfontstacks.com](https://modernfontstacks.com/)

顺手记一份规则清单：**中文文案排版指北**（sparanoid）把「中英之间加空格、数字与单位之间加空格、用全角标点」这些人工规则列全了。它的价值不在照做，而在对照 —— 规则里那十几条「加空格」，今天有六成可以交给两行 CSS。[github.com/sparanoid/chinese-copywriting-guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)

## 🎯 今天动手

给你手上任意一个中文页面加两行 —— `body{text-autospace:normal}` 和 `p{text-spacing-trim:trim-start}`，然后把手打过的空格全部删掉，对着原文比一遍。十分钟内能做完，做完你会立刻看见「缝变窄了、但没变紧」。

## 参考来源

1. [MDN · text-autospace（Baseline 2025，含全部取值）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-autospace)
2. [MDN · text-spacing-trim（未 Baseline；trim-both / trim-all / auto 无实现）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-spacing-trim)
3. [W3C i18n · Managing inline spaces in Chinese & Japanese](https://www.w3.org/International/articles/styling/inline-space)
4. [W3C · Requirements for Chinese Text Layout（CLREQ）](https://www.w3.org/TR/clreq/)
5. [Chrome for Developers · CSS 新增的四个国际化特性（2023）](https://developer.chrome.com/blog/css-i18n-features)
6. [The Type · 文字设计与视觉文化（作品来源）](https://www.thetype.com/)
7. [justfont · 字型公司官网（font stack 实测来源）](https://justfont.com/)
8. [vinta · pangu.js（4,861 stars，实测于 2026-11-11）](https://github.com/vinta/pangu.js)
9. [Modern Font Stacks · 系统字体栈速查](https://modernfontstacks.com/)
10. [sparanoid · 中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines)

---

*所有参数与浏览器状态均标注来源；字体栈为 2026-11-11 实测抓取，`text-autospace` 的基线状态以 MDN 为准。*
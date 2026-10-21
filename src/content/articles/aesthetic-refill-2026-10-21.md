---
title: "审美补给站 #002：中西混排那道缝，现在有数字了"
description: "中文和拉丁字母之间该空多少？CLReq 说最多 ¼em，CSS 规范默认 ⅛em。这期把 text-autospace / text-spacing-trim 的参数、三家浏览器的实现现状和能立刻上的兜底写法一次摊开，另附两个作品 pick 与两个能马上用的工具。"
date: 2026-10-21
tags:
  - "🎨 审美补给站"
---

> 本期要点：中西文之间的间隙是有出处的数值——《中文排版需求》（CLReq，最新草稿 2026-10-07）建议最大 ¼em，日文 JLReq 同为 ¼em、有时 ⅙em，CSS 规范默认建议 ⅛em。标准到位、实现只到位一半：`text-autospace` 已是 Baseline 2025，但只有 `normal` 关键字三家行为接近；`text-spacing-trim` 仍是 limited availability，且 Safari 只补前半边。今天就能改一行。

## 01 那道缝该由 CSS 给，不该由空格给

先看一个你八成写过的句子：

```
设计 design 的间距
设计 design 的间距   ← 哪一个？
```

大部分人的答案是第二种：**手敲一个空格**。麻烦在于，这个空格的宽度由字体决定，通常是拉丁空格的字宽（不同字体在 0.25–0.33em 之间浮动），跟中文排版要的那道缝根本不是一回事；更糟的是它在行首行尾**不会消失**——当拉丁词被挤到下一行，那个空格就留在上一行行尾撑着，或者跑到下一行行首，把段首缩进顶歪。

规范其实早就给出了数字。**《中文排版需求》（CLReq，W3C 最新草稿 2026-10-07）建议中西文之间的间隙最大可到 ¼em**；日文 JLReq 同样建议 ¼em，有时也用 ⅙em；而 CSS 规范自己给出的默认值建议是**一个表意字宽度的 ⅛**——偏小的一档。[W3C 的 i18n 文章《Managing inline spaces in Chinese & Japanese》](https://www.w3.org/International/articles/styling/inline-space.en)把这件事讲得很直白：**要缝就用 CSS 给，不要用空格字符。**

**正确写法只有一行：**

```css
body { text-autospace: normal; }
```

为什么不是听起来更精确的 `text-autospace: ideograph-alpha ideograph-numeric`？W3C 逐个测过：**Chrome 对这两个关键字不产生任何间隙**（Blink 尚未支持），**Firefox 单独用一个可以、两个一起用就失效**，**Safari 只在拉丁文字前面补缝、后面不补**。而 `normal` 在 Chrome / Firefox / Safari 上都能在拉丁串两侧造出间隙，只是 Safari 同样偏袒前半边。所以：能用 `normal` 就别用关键词组合。

**标点那一半：挤压、缩进、悬挂。**

混排之外还有第二个坑——连续标点累积出的大缝。全角标点的墨迹只占一个字身方格的一部分，剩下的空白是「自带」的；两个全角括号挨在一起时，两份空白会叠加成一条刺眼的沟。CSS 的解法是 `text-spacing-trim`，把多余的那半个字宽压掉。

现状同样参差：**Blink（Chrome / Edge）默认就会压，并且支持 `trim-start`**（`trim-both` 尚未支持）；**Gecko 与 WebKit 完全不压**。想要「行首括号贴齐、行尾括号可收窄」，规范里对应的是 `trim-both`，但现实里先别指望它。

另外两条顺手记下：`text-indent: 1em` 做段首缩进是**三大引擎都可靠**的；而行首标点悬挂 `hanging-punctuation: first` **目前只有 WebKit（Safari）支持**，Chrome 和 Firefox 都不认。最后一条例外别忘：**当文本严格排在字格网格上时，以上挤压一律不做。**

## 02 作品 pick

手法要有地方落地，看两个最近被 Awwwards 拎出来的站。

### ① Cartier - Le Chœur des Pierres · makemepulse

**好在哪：**这是 Cartier 高级珠宝的沉浸式数字化项目，项目页给的标签是 *Design* + *Real-Time 3D*，自述的立意是「让每颗宝石引出珠宝背后的故事」，Awwwards 给的是 2026-10-20 的 Site of the Day（7.51/10）。值得学的不是三维本身，而是它的**导航逻辑**：宝石既是内容，也是入口——用户沿着同一种「材质/主体物」走完全站，而不是被一条顶部导航条横切。

**你能偷什么：**做产品页时，把「同一类主体物」抽象成导航单元。比如把四个功能做成四张主视觉卡片，卡片既是入口也是正文首屏，去掉一层「首页 + 详情页」的往返。顺带一条：奢侈品类站点的信息密度可以极低，但**每个视觉单元必须承担一个明确导航职责**，否则就退化成图片轮播。

原链接：[Awwwards 项目页](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres) · [makemepulse 案例页](https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres)（署名：makemepulse / alexandre-saad / Alexis Demachy，仅作评述引用，不转载素材）

### ② FORMAT · Obys × DES

**好在哪：**Obys 是 2018 年由 Olha Olianishyna 与 Viacheslav Olianishyn 创立的概念驱动型设计工作室，这是他们与 DES 的合作企划，项目自述只有一句话：**把「格式」本身当作设计工具**（format as a design tool），拿下 2026-10-19 的 Site of the Day。它的价值不在某个花哨动效，而在选题姿态——不画界面，去画「界面凭什么长这样」的那套约束：容器、比例、栅格。

**你能偷什么：**给一件作品配一句「主题句」，并且让那句主题句真的是可执行的设计规则。比如你正在做配色系统，主题句可以是「全站只有一档高对比 accent，其余全走同一色相的明度阶梯」——然后把这句写进设计说明，任何新页面进来都要能用这句话裁决。概念不是文案，是判决标准。

原链接：[Awwwards 项目页](https://www.awwwards.com/sites/format) · 署名：Obys（Viacheslav Olianishyn）· 仅作评述引用

## 03 工具与素材

**① BudouX** —— 如果你写过「设计design的间距」这种没有空格的混排文本，就一定见过它在窄屏上被从中间硬拆开，或者把整个拉丁词挤到下一行、留出一个巨大的空洞。BudouX 是 Google 出的轻量断行器，**连模型一起约 20KB，支持日文与中文（简繁），不依赖任何第三方 API**，可以直接打包进前端 JS。用法上你只需把它插在合适位置生成断行点，剩下的交给 CSS。仓库：<https://github.com/google/budoux>（Apache-2.0）

**② 中文文案排版指北（sparanoid/chinese-copywriting-guidelines）** —— 一份能进团队文档的规范清单：中英文之间要不要空格、数字与单位之间怎么空、标点用什么。它的正确用法不是「读完记住」，而是**当成 lint 依据/交接文档**——口头说「注意一下排版」几乎必然失效，一份可引用的清单才有约束力。仓库：<https://github.com/sparanoid/chinese-copywriting-guidelines>

再补一个**可以直接打开对照的素材**：W3C 那篇 i18n 文章自带「在你的浏览器里试试」的实时 demo（含 `text-autospace` 与 `text-spacing-trim` 各取值的逐项断言和实际结果），比自己拼页面测快得多。

## 🎯 今天动手 · 10 分钟

**给手边的项目换掉那道缝** —— 打开任一有中英混排的页面，DevTools 里给 `body` 加一行 `text-autospace: normal;`，然后把正文里「中英之间手打的空格」删掉，前后各截一张图对比（重点看行尾和段首缩进有没有变干净）。满意就把这行和 `text-indent: 1em` 一起写进你的 base.css，并给改了的地方留一句注释：**「缝隙由 CSS 给，不用空格字符」**。

## 参考来源

1. [W3C · Requirements for Chinese Text Layout（中文排版需求）· Draft Note · 2026-10-07](https://www.w3.org/TR/clreq/)
2. [W3C i18n · Managing inline spaces in Chinese & Japanese（含逐项实测与在线 demo）](https://www.w3.org/International/articles/styling/inline-space.en)
3. [MDN · text-autospace CSS property · Baseline 2025](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-autospace)
4. [MDN · text-spacing-trim CSS property（Limited availability）](https://developer.mozilla.org/en-US/docs/Web/CSS/text-spacing-trim)
5. [Chrome for Developers · Introducing four new international features in CSS](https://developer.chrome.com/blog/css-i18n-features)
6. [Awwwards · Cartier - Le Chœur des Pierres（makemepulse）· Site of the Day 2026-10-20](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres)
7. [makemepulse · Cartier Le Chœur des Pierres — Case Study](https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres)
8. [Awwwards · FORMAT（Obys × DES）· Site of the Day 2026-10-19](https://www.awwwards.com/sites/format)
9. [GitHub · google/budoux（Apache-2.0）](https://github.com/google/budoux)
10. [GitHub · sparanoid/chinese-copywriting-guidelines 中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines)

---

*第 #002 期 · 2026-10-21 · 审美补给站日报 · 由 clacky 自动整理 · 每天 09:45 更新。文中参数均来自 W3C CLReq、W3C i18n 实测文章与 MDN，未做推测性外推；浏览器实现状态随版本变化，落地前请以最新目标浏览器实测为准。作品仅作评述引用并署名，不转载素材。*
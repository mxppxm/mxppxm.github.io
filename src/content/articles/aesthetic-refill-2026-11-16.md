---
title: "审美补给站 #028：越大越窄，越小越宽"
description: "版面灰度的第三个旋钮叫字宽：字号管谁更重要，字重管多重，宽度管多密。附规范里那九档百分比、五行可直接抄的参数表，以及一个实测发现 —— Google Fonts 的默认 URL 会把宽度轴冻在 100%，你得显式请求才拿到 62%–125%。文末还有一个更少人用的 GRAD 轴，专治深色模式里字发胀。"
date: 2026-11-16
tags:
  - "🎨 审美补给站"
---

排版里决定"这一页看起来多重"的，从来不是字号，是单位面积里的墨量。字号负责放大内容，字重负责加粗笔画，而**字宽负责改掉每个字母占的地盘**：同字号、同字重，把宽度从 112.5% 收到 87.5%，一行字的横向占位直接少了 25 个百分点 —— 字一个没换，那一页却变轻了。

## 01 · 反着绑：越大越窄，越小越宽

这不是新发明，是老排版的分级。Wikipedia 在讲光学尺寸（optical size）时给出的描述很干脆：设计字号越小，笔画越粗、字距越宽（原文以 Leipziger Antiqua 为例）。反过来，大字号那一端要更细、更紧。

可变字体把"一款字要买五个字号版本"的成本压成了一个文件。宽度轴在 CSS 里原本叫 `font-stretch`，规范现在改叫 `font-width`，`font-stretch` 退成 legacy alias，两者共用一套写死在规范里的百分比：

| 关键字 | 百分比 | 我放在哪一档 |
|---|---|---|
| ultra-condensed | 50% | 超过 200px 的巨字才用 |
| extra-condensed | 62.5% | 海报级 hero，96–160px |
| condensed | 75% | 大标题，40–64px |
| semi-condensed | 87.5% | 小标题，22–28px |
| normal | 100% | 正文，16–18px |
| semi-expanded | 112.5% | 图注与元数据，11–13px |

这是配方，不是规范。配它的时候守两条约束：**大字别超过 700 的字重**（大字本来笔画就粗，再加重量会糊成一块）；**11–13px 的字别低于 400 字重、同时往 semi-expanded 推**，让小尺寸还有字怀可以呼吸。两边一起收放，整页才是一张均匀的灰面，而不是"上面很淡、下面很浓"的两段。

**必踩的坑。** Google Fonts 的默认 URL 会把宽度轴冻在 100%。今天对着同一个家族拉了三次 CSS：`family=Archivo` 返回的是 `font-stretch: 100%`（单值，等于没有轴）；写成 `family=Archivo:wdth,wght@62..125,100..900` 才返回 `font-stretch: 62% 125%`。你不显式请求轴范围，后面每一行 `font-stretch` 都在空转。另外 `font-width` 目前还不是 Baseline，生产里写两行，后者覆盖前者：`font-stretch:87.5%; font-width:87.5%;`

## 02 · 两个 pick：把宽度当层级用

### ① Archivo · Omnibus-Type 的宽度跨度

Google Fonts 对它的介绍第一句就说明了用途：一款为"突出显示与标题"而设计的 grotesque 无衬线（originally designed for highlights and headlines）。它的宽度轴从 62% 走到 125%，字重 100 到 900，全在一个文件里。这意味着你能做出一种很少见的版式：**整页只用一款字，靠宽度分级别**。标题压到 62%，正文留在 100%，图注放到 112.5% —— 三个层级，零个新字族，字体文件也不会因为"再加一个 Display 家族"而翻倍。

**你能偷的：** 把宽度当作 zoom。同一句话先在 100% 下排一遍，再对着 62% 看一眼 —— 如果收窄之后信息层级没变（还是那句话最重要），说明这行字本来就没在承载层级，它只是被放大了。这是原版式的快速体检法。
[fonts.google.com/specimen/Archivo](https://fonts.google.com/specimen/Archivo/about)

### ② Anek · 一个宽度轴，十种书写系统

Ek Type 做的这套字覆盖 9 种印度文字加拉丁，共 10 个书写系统，实测 CSS 下发的是 `font-weight: 100 800` 与 `font-stretch: 75% 125%`。它背后是 12 位设计师、分处印度 8 座城市、用三种语言开会协作的产物，拿了 TDC Certificate of Typographic Excellence 与 D&AD Graphite Pencil。**真正值得抄的不是字形，是那个思路：不同文字的字面大小天生不等，天城文的正文字看起来就是比拉丁文小一号；要让两种文字在同一行里音量相同，字重和宽度就是两个可调的推子。**

**你能偷的：** 做多语言界面时，不要给每种语言单独写一套字号；给每套文字一套宽度/字重补偿值，让"灰度"对齐而不是让"磅值"对齐。中文、日文的字框是满格方形，天然比拉丁文更黑 —— 混排时把拉丁那半往 105–110% 推，或者把中文那半降一档字重，比调字号更不容易破坏网格。
[design.google/library/anek-multiscript](https://design.google/library/anek-multiscript)

## 03 · 两个能立刻用的工具

**① Wakamai Fondue** —— 把任意字体文件拖进浏览器，它列出这个文件里真实存在的所有轴、每条轴的取值范围，以及可用的 OpenType 特性。写 `font-stretch` 之前先跑一遍：很多"可变字体"其实只有 `wght` 一条轴，你写了宽度也只会被静默忽略。
[wakamaifondue.com](https://wakamaifondue.com/)

**② Axis Praxis** —— 在线拉轴的老牌 playground，可以上传自己的字体，两栏并排同一个词、各用各的参数。判断"收窄 12.5% 到底有没有用"最快的办法，就是并排看，而不是在脑子里算。
[axis-praxis.org](https://www.axis-praxis.org/)

**顺手记一笔：** 宽度之外还有一个更少人用的轴 —— `GRAD`（grade）。它只改笔画的墨水浓度，不改字宽和字重，所以换档时行宽一个字都不会动。Google 的 Adam Argyle 在 web.dev 上的那个 demo 给的数值可以直接抄：深色模式 `GRAD -25`（浅字压在深底上会"胀"，减 25 抵消）；`prefers-contrast: more` 时 `wght` 从 400 提到 700，`less` 时降到 200。

## 🎯 今天动手（10 分钟）

1. **先确认有没有轴。** 把手上那款字扔进 Wakamai Fondue，看有没有 `wdth`。没有就换 Archivo 或 Anek Latin，别硬调。
2. **给 h1 收 12.5%。** DevTools 里加 `font-stretch: 87.5%`，再用方向键上下微调，找到"再窄就开始挤"的那个点 —— 通常就在 87.5% 附近。
3. **给图注放 12.5%。** 11–12px 的那类文字加 `font-stretch: 112.5%` 并截图。
4. **并排验收。** 把改动前后两张截图叠在一起看一眼：标题和正文的"灰"应该更接近了，而不是标题更黑、正文更白。收工。

---

### 参考来源

1. [MDN · font-width](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-width)（含关键字与百分比对照表）
2. [MDN · font-stretch](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-stretch)（标注为 font-width 的 legacy alias）
3. [MDN · @font-face 的 font-width 描述符](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-width)（仍标为实验性）
4. [Wikipedia · Typeface anatomy § Optical size](https://en.wikipedia.org/wiki/Typeface_anatomy#Optical_size)
5. [Google Fonts · Archivo](https://fonts.google.com/specimen/Archivo/about)
6. [Google Design · Design for Many — Anek](https://design.google/library/anek-multiscript)
7. [web.dev · Adapting typography to user preferences with CSS](https://web.dev/articles/adapting-typography-to-user-preferences-with-css)
8. [web.dev · Introduction to variable fonts on the web](https://web.dev/articles/variable-fonts)
9. [Wakamai Fondue](https://wakamaifondue.com/)
10. [Axis Praxis](https://www.axis-praxis.org/)

> 本期关于 Google Fonts 下发内容的三条结论（Archivo 默认 100%、显式请求得 62%–125%、Noto Sans SC 无宽度轴）均为 2026-11-16 当天的实测结果，接口随时可能变。参数表是推荐配方，不是规范值。
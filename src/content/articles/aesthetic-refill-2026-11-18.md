---
title: "审美补给站 #030：首行上面那半个行距，终于可以切了"
description: "8 月起 text-box-trim 进入 Baseline，一行声明替掉你写了十年的负 margin（Safari 18.2 / Chrome 133 / Firefox 154，全球可用率约 88%）。它只切第一行上方和最后一行下方那两块半行距，不改行间距；三段生产 CSS 是我今天直接抓的——Stripe 的按钮原子类和 Vercel 的 Tailwind 任意值类里都有它，其中一个大概率写错了元素。附三处静默失效的原因和一条十分钟能做完的改动。"
date: 2026-11-18
tags:
  - "🎨 审美补给站"
  - "排版"
  - "CSS"
  - "text-box-trim"
---

一个行盒的高度，不等于你看到的那行字。字体里 ascent + descent 撑出一个块高，浏览器再把 **line-height 与之的差值劈成上下两半** —— half-leading。所以一个 `font-size: 48px; line-height: 1` 的 h1，盒子通常比字母实高多出十几到三十几像素，具体多少全看字体：同字号下 PingFang 和 Inter 能差一倍。

负 margin 是这个缺口的民间偏方。它只对准一款字体 —— 换字体、换系统回退字体就全歪，这也是「设计稿里正好、上线差 4px」永远修不干净的原因。

**TL;DR**

- `text-box: trim-both cap alphabetic` 是唯一值得背的一行，按钮、徽章、大标题通用。
- 它会静默失效且不报错：flex / grid / table 容器不参与，同一元素自己带 padding 或 border 不参与，空元素没有行可切。
- 两个真站点（Stripe / Vercel）的生产 CSS 里已经出现这条声明，其中一个大概率写错了位置。

## 01 · 半行距：你一直在用负 margin 修的那个东西

text-box 把这个看不见的缺口变成可以切的东西。三行就够：

```css
h1 { text-box: trim-both cap alphabetic; }
```

长手写：**text-box-trim** 切哪两头（`none` / `trim-start` / `trim-end` / `trim-both`），**text-box-edge** 切到哪条线（`cap` / `ex` / `text` / `ideographic` 配 `alphabetic`）。实际只要记两个组合：

- **cap alphabetic** —— 上切到大写字母顶、下切到基线。标题、按钮、badge 通用，就是口语里的「对齐到字」。
- **ex alphabetic** —— 切到小写 x 的高度，比 cap 松一档。适合全小写短标签，或嫌 cap 削得太狠时。

语法坑两条。**cap 只能在上边、alphabetic 只能在下边**，两个关键字都得写全 —— 只写 `trim-both cap` 时规范有两种读法，结果天差地别；另外省掉 trim 关键字**不会退回 none**，`text-box: cap alphabetic` 等价于 `trim-both`。

它不改行间距，只动第一行上方与最后一行下方那两块，所以正文段落别乱加。它只做一件事：**让 padding 和 gap 开始量到字母，而不是量到那个虚拟的盒子**。

时间线：Safari 18.2（2024-12）→ Chrome 133（2025-02）→ **Firefox 154（2026-08-18）**，8 月起 Baseline；caniuse 全球可用率约 88%。回落很温和：没切的浏览器只是多出那半个行距，别把固定高度压在它身上就行。

## 02 · 作品 pick：两个真站点已经在用它

以下两段 CSS 是我在 2026-11-18 直接抓的生产文件，不是推测；链接在文末，会随对方发版变化。

### Pick 1 · Stripe 官网主按钮（stripe.com）

```css
background-color: var(--hds-color-button-primary-bg);
display: inline-flex;
align-items: center;
text-box: trim-both cap alphabetic;
border-radius: var(--hds-space-core-radius…)
```

**好在哪**：trim 和 design token 收在同一条按钮原子类里，不是某个页面里打补丁。直接收益是内边距终于能写真值 —— 不用再 `padding-block: 5px` 配 `padding-inline: 10px` 去骗视觉居中。

**但这条大概率是死的。** 声明挂在 `display: inline-flex` 上，而规范写明 text-box-trim 不适用于、也不透过 flex / grid / table 格式化上下文传播（和 `::first-line` 一个待遇）。标签很可能压根没被切，别照抄，DevTools 里自己验一次。

**你能偷什么**：trim 要写在**真正包住文字的块级元素**上。结构是 `button > span` 的，就给 span，父级只管居中与间距。

### Pick 2 · Vercel 官网（vercel.com）

它的样式里直接生成了一条 Tailwind 任意值工具类：

```css
.[text-box\:trim-both_cap_alphabetic]{ text-box: trim-both cap alphabetic }
```

**好在哪**：Tailwind 官方插件还没出（讨论 #17634 还挂着），Vercel 没等，用 arbitrary property 语法把这条能力塞进工具类体系，零配置：

```html
<h1 class="[text-box:trim-both_cap_alphabetic] mt-6">…</h1>
```

**你能偷什么**：这是今天最快的落地路径 —— 不装插件、不等版本。它顺带回答了「声明该写在哪」：写在使用它的语义元素上，因为任意值类没法靠继承穿透。

**两者的分野值得单独说**：同一个能力，Stripe 交给设计系统的原子类，Vercel 交给工具类的即时表达。前者更能保证一致，但基类一旦选错元素，错误会复制到全站每个按钮 —— 这就是上面那条 flex 陷阱的代价。

## 03 · 两个能立刻用的

**① Figma 的 Vertical trim（文字图层 → 排版设置）**

设计稿先对齐，代码用 `cap alphabetic` 复刻，两边 metric 一致才不会「设计稿里正好、上线差 4px」。注意 Figma 的 trim 是给眼睛看的，不替你算网页那层 half-leading 补偿，所以必须跟开发对齐用的是 cap 还是 text。LogRocket 2024 年那篇《Why you shouldn't use vertical trim in Figma (yet)》指出的口径不一致问题，今天依然成立。

**② caniuse + MDN 长手写文档**

上线前两分钟能做完的检查：caniuse 看可用率（约 88%，还差 12%），MDN 看 `text-box-edge` 的合法取值。做中英竖排的话，edge 支持 `ideographic` 与 `ideographic-ink` —— 这是 cap / alphabetic 覆盖不到的那一档，ICS MEDIA 有 writing-mode 下的实测对比。

**还有：三处静默失效。** 这三条不报错、不掉控制台，你就是看不到变化。

- **flex / grid / table 容器** —— 不适用，也不透过子级传播。给 flex 下的文字加 trim 等于没写。
- **同一元素带 padding 或 border** —— 规范原话是存在「intervening non-zero padding or borders」就没有效果。卡片留 padding，trim 给里面的文字元素。
- **没有行可切** —— 空元素，或唯一子元素本身是个块，trim-start / trim-end 找不到首行与末行。

## 🎯 今天动手（10 分钟）

挑一个你用负 margin 顶着的大标题。注释掉 `margin-top: -8px`，加 `text-box: trim-both cap alphabetic`，再把 margin-top 改成你真正想要的视觉间距（比如 24px）。上下各截一张图叠起来看高度差，通常能省 10–20px。

如果一点变化都没有，往上找一层：父级是不是 flex / grid，或这个元素自己带着 padding。改到里面那个包文字的 span 上再试。

---

**参考来源**

1. [MDN · text-box-trim（Baseline 2026，含 text-box-edge 合法取值）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim)
2. [Adam Argyle · CSS text-box-trim · Chrome for Developers（2025-01-14）](https://developer.chrome.com/blog/css-text-box-trim)
3. [Kishan Sharma · Text that sits flush in its box: text-box-trim in every engine（2026-09-15）](https://www.kishan.design/read/text-box-trim)
4. [Can I use · CSS Text Box（全球可用率约 88%）](https://caniuse.com/css-text-box-trim)
5. [Tailwind Labs · Add support for text-box / text-box-trim · Discussion #17634](https://github.com/tailwindlabs/tailwindcss/discussions/17634)
6. [SAWADA Naomi · Using CSS text-box-trim and text-box-edge for vertical text spacing · ICS MEDIA](https://ics.media/en/entry/250319)
7. [Figma · Explore text properties（Vertical trim 控件）](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties)
8. [Daniel Schwarz · Why you shouldn't use vertical trim in Figma (yet) · LogRocket（2024-05-13）](https://blog.logrocket.com/ux-design/vertical-trim-figma)
9. [Stripe · 官网生产 CSS（2026-11-18 抓取）](https://b.stripecdn.com/mkt-ssr-statics/assets/_next/static/css/70d739dff01e0964.css)
10. [Vercel · 官网生产 CSS（2026-11-18 抓取）](https://vercel.com/vc-ap-vercel-marketing/_next/static/immutable/chunks/26y0_67kdx4ul.css)
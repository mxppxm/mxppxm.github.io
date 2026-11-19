---
title: "审美补给站 #031：圆角终于不止一种，但半径得跟着改"
description: "corner-shape 把圆角从一种形状变成一族曲线，背景、描边、阴影全都跟着弯 —— 这是 clip-path 一辈子做不到的事。但我今天在自己机器上量了一件事：同一个 40% 半径换成 squircle，顶边直段从 30% 涨到 55%，观感直接方掉一档。想保住原来的圆润度，半径得乘 1.6–1.8。附实测换算表、两个能直接抄的实现，和一条十分钟能做完的改动。"
date: 2026-11-19
tags:
  - "🎨 审美补给站"
  - "CSS"
  - "corner-shape"
  - "squircle"
---

我们写了十几年的 `border-radius` 只有一个形状：圆。想要斜切就得 `clip-path`，想要凹口就得 SVG 蒙版，想要 App 图标那种 squircle 就得一张调了很久的 SVG。这些方案有一个共同的病根 —— **它们只切背景，不切边框和阴影**。所以你会看到描边被一刀切断、阴影整块消失，padding 改一个值整个形状就崩。

**TL;DR**

- `corner-shape` 是 `border-radius` 的伴侣属性：radius 决定「从角上切掉多大一块」，shape 决定「这一块用什么曲线填」，背景、描边、outline、阴影全都跟着曲线走。
- 换形状必须同时放大半径。同一个 40% 半径，普通圆角顶边直段只剩 30%，squircle 还留着 55%（实测），想保住原观感半径要乘 1.6–1.8。
- 它是渐进增强的模范生：`@supports (corner-shape: bevel)` 一行包住升级层，老浏览器看到的就是干净的老圆角。

## 01 · 圆角从一种形状变成一族曲线，以及被忽略的半径换算

`corner-shape` 的分工很清楚：`border-radius` 决定「从角上切掉多大一块面积」，`corner-shape` 决定「这一块里面用什么曲线填」。因为曲线是交给绘制引擎算的，**背景、border、outline、box-shadow 会一起跟着弯**。这是它唯一但决定性的理由：你终于可以有一个带 1px 描边、还带投影的斜切标签，而不用写 polygon。

六个关键字其实是一条数轴，从「方」走到「更方」再翻到凹面：`square` → `squircle` → `round` → `bevel` → `scoop` → `notch`；自定义用 `superellipse(k)`，正值凸、负值凹。

**第一个坑：k 不是数学课本里的 n。** MDN 给出的对应关系是 `round = superellipse(1)`、`squircle = superellipse(2)`、`bevel = superellipse(0)`、`scoop = superellipse(-1)`、`square = superellipse(∞)`。也就是说 k 是归一化过的刻度，不是 Lamé 公式 |x|ⁿ+|y|ⁿ=1 里的那个 n。把论文里的 n=4、iOS 那条五次曲线直接填进 `superellipse(5)`，你会得到一个几乎是方的罐头盒 —— 我试了 `superellipse(3)`，顶边直段已经占到 78%。

**第二个问题没人提过：换形状会改变观感重量，而大部分人只改了形状、没改半径。** 我用 400px 的正方形在 Chrome 157（macOS 26.6）里量了两组，取「顶边仍是直线的像素占宽」和「对角线上从尖角到曲线的内缩距离」两个指标：

| 半径 | shape | 顶边直段占宽 | 对角内缩 |
|---|---|---|---|
| 20% | round | 68% | 23px |
| 20% | squircle | 81% | 13px |
| 40% | round | 30% | 47px |
| 40% | squircle | 55% | 25px |
| 40% | superellipse(1.6) | 44% | 33px |
| 40% | superellipse(3) | 78% | 13px |

换算结论很朴素：**squircle 的视觉圆润度大约只有同半径圆角的 0.55–0.6 倍，想让样子不变，半径得放大到 1.6–1.8 倍。** 反过来，如果你直接换个关键字不调半径，整个界面会在一夜之间「变方」—— 那种说不清哪儿不对的感觉，通常就是这个。

支持情况（caniuse 2026 年 10 月数据）：Chrome / Edge 139+（2025 年 8 月 5 日发布）、Safari 27.3+、Firefox 163+、Samsung Internet 30+，**全球可用率约 72.56%**。顺带一句：MDN 页面上还挂着「Limited availability」，和 caniuse 的绿标对不上 —— 跨引擎新特性两边更新常差一两个月，别只看一边。我这台机器的 Safari 是 26.6，按表还不认；上面所有实测都在 Chrome 157 里跑的。

写进项目就这么两行：

```css
.card { border-radius: 16px; }

@supports (corner-shape: squircle) {
  .card { border-radius: 28px; corner-shape: squircle; }
}
```

28 ≈ 16 × 1.75。三条边界：radius 为 0 时 corner-shape 完全不生效；四个角可以给四个不同形状（顺时针 左上 右上 右下 左下），丝带和票根全靠这一条；小于 8px 的圆角别用 squircle，差异在 1px 以内，纯属浪费。

## 02 · 作品 pick：两个能直接抄的实现

### Pick 1 · Preethi Sam：把 corner-shape 从按钮挪到图案上

**好在哪**：大多数人只想到「按钮圆角换成 squircle」，她直接把它做成**整块背景纹理** —— 重复的小方块用 scoop 凹角加负值 `superellipse()`，排出来是邮票齿边、票根缺口、科幻面板的切角。关键是：这些形状是能带 1px 描边的真盒子，不是贴上去的一张图，所以描边粗细、颜色、圆角半径全都能用变量控制。

**你能偷什么**：做装饰纹理时别急着导 SVG。底层一层 `repeating-linear-gradient` 或点阵，上层放一层 `corner-shape: scoop` 的伪元素网格，就能拿到带描边的复古票券边；改 padding 不会像 clip-path 那样错位。

原链接：<https://frontendmasters.com/blog/background-patterns-with-css-corner-radius>

### Pick 2 · Brecht De Ruyte：用四个角拼出一条丝带

**好在哪**：产品卡左上角那个「NEW / SALE」斜角标签，以前要么 `clip-path: polygon()`，要么转一个伪元素。他的做法是 `border-radius: 0 16px 16px 0` 配 `corner-shape: round bevel bevel round` —— 贴卡片那一侧是圆的，尖头那一侧是两个斜切，**四个角四种形状，一句话说完**。而且边框和阴影是跟着走的，那个 1px 描边在斜角处不会断。

**你能偷什么**：所有「标签 / 胶囊 / 丝带 / 票根」本质上都是四角形状的组合题，先想角，再想颜色。写法上他用了 `@layer base, presentation, demo` 三层：base 层就是普通 badge（完全没有 corner-shape），`@layer demo { @supports (corner-shape: bevel) { … } }` 里才升级。**没有降级横幅，只有「好」和「更好」两档。**

原链接：<https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/>

## 03 · 工具：调参与兜底

**1 · squircle.js** —— 精确复刻 iOS 图标的曲线：按它的说法，半径约等于图标宽度的 22.37%、配 60% 的曲率平滑，就能逼近苹果那个形状；输出 SVG path 或 CSS。为什么 CSS 的 `squircle` 还不够？因为那个关键字只是同族近似，苹果那条曲线底层是调过的贝塞尔，不是纯超椭圆。要做像素级对位的图标、或者要兼容不支持的老浏览器，还得用它。

<https://squircle.js.org/blog/math-behind-squircles>

**2 · MDN 的 corner-shape-value 示例页** —— 一个下拉选关键字、一个滑块调 radius，改完直接看结果，不用装任何东西。我今天是先在这个页面上滚一遍，记住「哪个 k 值配哪个半径」的观感，再回自己项目里量像素的。

<https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape-value>

## 🎯 今天动手 · 10 分钟

1. **挑一张圆角最大的卡片** —— 通常是 16–24px 的那张，DevTools 里把它 `border-radius` 改成 1.7 倍，再加 `corner-shape: squircle`。
2. **并排截两张图** —— 改前改后各一张，同为 400px 宽。判断标准：直边明显变长、但整体轮廓没变成「方罐头」，就对了。
3. **太方就再加 4px** —— 如果看着像被削平了，半径继续往上加；如果看不出任何区别，说明你的半径本来就太小（低于 12%），这条特性在这个尺寸上不值得用。

## 参考来源

1. [Saleh Mubashar · corner-shape（CSS Almanac）· CSS-Tricks 2025-11-26](https://css-tricks.com/almanac/properties/c/corner-shape)
2. [MDN · &lt;corner-shape-value&gt;（含关键字与 superellipse() 对应关系）](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape-value)
3. [Noam Rosenthal · The corner cases of implementing CSS corner-shape in Blink · Chrome for Developers 2026-02-19](https://developer.chrome.com/blog/implementing-corner-shape)
4. [Can I use · CSS property: corner-shape（全球可用率 72.56%，2026-10 数据）](https://caniuse.com/mdn-css_properties_corner-shape)
5. [Preethi Sam · Background Patterns with CSS corner-shape · Frontend Masters Blog 2026-02-09](https://frontendmasters.com/blog/background-patterns-with-css-corner-radius)
6. [Brecht De Ruyte · Beyond border-radius: What The CSS corner-shape Property Unlocks For Everyday UI · Smashing Magazine 2026-03-12](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/)
7. [Squircle.js · The Squircle Formula: Superellipse Math Explained（22.37% 半径 + 0.6 平滑）2026-03-14](https://squircle.js.org/blog/math-behind-squircles)
8. [Amit Sheen · Understanding CSS corner-shape and the Power of the Superellipse · Frontend Masters Blog 2025-06-23](https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse)
9. [Chrome for Developers · Chrome 139 release notes（2025-08-05）](https://developer.chrome.com/release-notes/139)

---

文中所有数值都是 2026-11-19 在 Chrome 157 / macOS 26.6 上实测的（400px 正方形，取顶边直段像素占宽与对角线内缩量），浏览器实现不同可能有 1–2px 出入；外部结论均标注来源，作品与文章链接指向原作者。
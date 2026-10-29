---
title: "审美补给站 #010：圆角不是圆弧，它是一个指数"
description: "border-radius 只告诉你圆有多大，corner-shape 才第一次让你说出弯是哪种弯。六个关键字全是 superellipse() 的预设，苹果图标那个角其实是 n≈5、CSS 里要写 2.5；支持度 70.46%，Safari 还不认，配 @supports 兜底。"
date: 2026-10-29
tags:
  - "🎨 审美补给站"
  - "排版"
  - "CSS"
---

> **TL;DR**
> 1. **角是一个数，不是一种形状。** `corner-shape` 的六个关键字全部是 `superellipse()` 的预设值，圆角第一次变成可以连续调的参数。
> 2. **苹果图标的角不是 squircle。** 数学上的 squircle 是 n=4，iOS 图标是 n≈5，CSS 里要写 `superellipse(2.5)`，写 `squircle` 差一档。
> 3. **能上的范围：** Chrome / Edge 139+、Opera 123+、Firefox 161+ 已支持，Safari 27.1–27.2 还不支持，全球覆盖 70.46%——用 `@supports` 渐进增强，别用 JS 画路径。

---

## 01 · 把「圆角」换成「超椭圆指数」

过去十年我们描述角的唯一参数是半径。`border-radius: 20px` 的意思是：在角上切掉一块 20×20 的正方形，用四分之一圆补上。问题出在补上的那一刻——直边的曲率是 0，圆弧的曲率是 1/20，两者在交界处硬碰硬地接在一起。这条曲率不连续的分界线叫 **G1 断点**。单个图标上看不出来，但当一屏排了二十个卡片、二十个头像，二十次「硬碰硬」叠在一起，眼睛读到的是「有点糙」。

超椭圆（Lamé 曲线）给的解法是换一个指数：**|x/a|ⁿ + |y/b|ⁿ = 1**。n 走到哪儿，形状就跟到哪儿。曲率不再在边上突然开始，而是一路缓缓变化。

CSS 这边的写法比想象中简单：`corner-shape` 与 `border-radius` 配套使用，前者决定「角是哪一种角」，后者决定「这块角有多大」。两者必须同时存在——**border-radius 为 0 时，corner-shape 完全无效**。关键字与数值的对应关系（来自 MDN 与 CSS Borders Level 4）：

| 关键字 | 等价写法 | 说明 |
| --- | --- | --- |
| `round` | `superellipse(1)` = n=2 | 普通圆弧，默认值 |
| `squircle` | `superellipse(2)` = n=4 | 数学上的 squircle |
| `bevel` | `superellipse(0)` | 一条直线斜切 |
| `scoop` | `superellipse(-1)` | 向内凹的圆弧 |
| `notch` | `superellipse(-∞)` | 90° 内凹方角 |
| `square` | `superellipse(∞)` | 直角 |

这里有个必须记住的换算：CSS 的 `superellipse(k)` 里，公式指数 **n = 2k**。Chrome 团队在实现说明里写得很清楚，参数表示的是 2K。所以苹果图标那种 n≈5，落到 CSS 里是 `superellipse(2.5)`，而不是 `squircle`。想要「苹果感」就写 2.5，想要「数学 squircle」写 2——这两个值在 20px 半径下的差别，就是「看着高级」和「看着对了」的差别。

```css
.card{
  border: 1px solid #D5CEC2;
  border-radius: 20px;               /* 必须非 0，否则下一行无效 */
  corner-shape: superellipse(2.5);   /* n = 5，苹果图标那一档 */
  transition: border-radius .2s, corner-shape .2s;
}
.card:hover{
  corner-shape: superellipse(4);     /* 值可以平滑插值，不需要换图 */
}
@supports not (corner-shape: squircle){
  .card{ box-shadow: inset 0 0 0 1px rgba(58,52,46,.06); } /* 退回圆弧，别用 JS */
}
```

半径该给多少？图标语境有个被反复测量的数字：**约等于边长的 22.37%**，再配 60% 的平滑度，就是 iOS 图标的标准形。网页卡片别照抄这个比例——22.37% 在窄卡片上会让四角连成一片。经验值：短边的 8%–12%，落在 12–20px 区间，圆弧与超椭圆的区别肉眼可辨，但不至于让版面塌成药丸。

> **三个会咬人的坑**
> ① `border-radius: 0` 时 `corner-shape` 无效，没有半径就没有角可改。
> ② 对角两个半径之和超过边长时，浏览器会强行缩值避免重叠——你以为写了 80%，实际渲染未必是。
> ③ 一旦设置了 `border-shape`，`corner-shape` 直接失效，两者不兼容。

## 02 · 两个作品：一个标准，一个实现

### ① Apple · App icons（Human Interface Guidelines）

这份规范里最有价值的不是图标本身，而是**它不让你自己画角**：图标是方的，系统统一施加遮罩，生成与其它圆角界面元素吻合的曲率，你只需把内容放进去、别让主体被裁。

**好在哪**：把「形状」从每个设计师手里收回到系统层——一整屏二十几个图标共享同一条曲线，格子才会退到背景里。
**你能偷什么**：如果你的产品里有超过 10 个同质容器（头像、卡片、标签），把那句 `corner-shape` 收进一个 `--radius-shape` 自定义属性，由设计 token 统一下发，而不是散在 200 个 CSS 文件里。
[原链接：Apple HIG › App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

### ② squircle.js（bring-shrubbery，开源）

它解决的是兼容问题：CSS 早就能表达超椭圆，只是浏览器不一定认。

**好在哪**：用 Figma 反向工程出来的 **figma-squircle** 算法算 SVG path，交给 `clip-path`，ResizeObserver 跟住尺寸——设计稿上的 60% 平滑，网页上能像素级对上。
**你能偷什么**：把「形状」写成组件的一个 prop（cornerRadius + cornerSmoothing），而不是一层 CSS 类；以及一个清醒的取舍——`clip-path` 会把边框和阴影一起裁掉，所以它只适合做背景层，不适合带描边的卡片。
[原链接：squircle.js.org](https://squircle.js.org/)

## 03 · 两个能立刻用的东西

**MDN 的 corner-shape 交互示例**——一个下拉框选六个关键字、一个滑块调 `border-radius`，改一下看一眼，比读三篇规范快。顺手把[属性页](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)存书签，它的兼容表和约束说明是目前最全的。

**Figma 的 Corner smoothing**——圆角输入框旁边那个小图标，勾上出现 0–100% 的滑块，**60% 就是 iOS 预设**（和上面 22.37% 半径是同一套数字）。设计端先用它定形，交付时别再截一张图让开发「照着做」——直接在标注里写 `border-radius: 20px / corner-shape: superellipse(2.5)`，这两行才是可执行的形状。

## 🎯 今天动手（10 分钟）

1. **开 DevTools 敲两行**：`border-radius: 20px; corner-shape: superellipse(2.5)`，再切回 `round`，盯住「弧和直边交界」那 2px 看三遍。
2. **加兜底**：给 `.card` 包一层 `@supports not (corner-shape: squircle)`，里面只留一行注释「Safari 走圆弧」，别引入 JS 路径库。
3. **统一下发**：收成 token（`--radius: 20px; --corner: superellipse(2.5)`），让下一张新卡片天然是对的角。

---

## 参考来源

1. [MDN · corner-shape CSS property（含交互示例与约束说明）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)
2. [MDN · superellipse() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/superellipse)
3. [MDN · <corner-shape-value>：六个关键字与 superellipse() 的等价关系](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/corner-shape-value)
4. [Noam Rosenthal · The corner cases of implementing CSS corner-shape in Blink · Chrome for Developers 2026-02-19](https://developer.chrome.com/blog/implementing-corner-shape)
5. [Can I use · CSS property: corner-shape（全球覆盖 70.46%，数据 2026-09）](https://caniuse.com/mdn-css_properties_corner-shape)
6. [Amit Sheen · Understanding CSS corner-shape and the Power of the Superellipse · Frontend Masters 2025-06-23](https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse)
7. [Grida · Superellipse Mathematical Reference（n=1/2/4/5/∞ 的形状谱）](https://grida.co/docs/math/superellipse)
8. [Squircle.js · How Apple Uses Squircles in iOS Design（22.37% 半径 / 60% 平滑）· 2026-03-17](https://squircle.js.org/blog/squircles-in-apple-design)
9. [Squircle.js · Figma Corner Smoothing on the Web · 2026-03-08](https://squircle.js.org/blog/figma-corner-smoothing-on-the-web)
10. [Figma Learn · Adjust corner radius and smoothing](https://help.figma.com/hc/en-us/articles/360050986854-Adjust-corner-radius-and-smoothing)

---

*所有参数、兼容性与数值均标注来源；22.37% 与 60% 来自 Squircle.js 对 iOS 图标的测量与复述，苹果官方规范未公布这两项数值。浏览器支持以 2026 年 10 月 caniuse 数据为准，Safari 仍不支持，请务必配 @supports 兜底。*
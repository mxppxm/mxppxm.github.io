---
title: "审美补给站 #003：圆角不是圆的——超椭圆从图标长进了 CSS"
description: "corner-shape 把 Apple 图标用了十几年的超椭圆变成一行 CSS。可抄的参数：半径 20–24px + superellipse(2)；再附两个把「形状」当品牌资产的案例拆解。"
date: 2026-10-22
tags:
  - "🎨 审美补给站"
---

**TL;DR**

1. **`corner-shape` 让圆角变成可调的曲线。** `corner-shape: squircle` 就是 `superellipse(2)`——Apple 图标一直在用的那条曲线；我们熟悉的四分之一圆反而只是 `superellipse(1)`。
2. **能用，但只在 Chromium 139+。** Safari 与 Firefox 尚未支持（2026-06 口径约覆盖全球 65%）；好在不支持的浏览器会整行丢掉这条声明、保留 `border-radius`，兜底成本几乎是零。
3. **同一个属性顺带能画多边形。** `bevel` + 百分比半径 = 菱形 / 正六边形 / 加号，不用 SVG、不用 `clip-path`。

---

## 01 圆角之外，还有一条连续曲线

先把 `border-radius` 到底干了什么说清楚。它把角「切掉」一块，然后在那一块里塞一段四分之一椭圆弧。问题出在接缝上：**直线的曲率是 0，圆弧的曲率是 1/r**，两者相接的地方曲率是突变的。眼睛对这种突变极其敏感——大圆角卡片之所以常常显得「软塌塌」，不是颜色的问题，是那道缝。

超椭圆（superellipse）给的是另一个旋钮。它的方程是 **x<sup>2K</sup> + y<sup>2K</sup> = 1**：K = 1 就是标准圆角；K = 2 是曲率连续、看起来更「顺」的那条曲线，也正是 iOS 图标一直在用的形状；数字再往上，角越来越接近直角；K = 0 退化成一条斜切直线；负数则向内凹进去。

CSS 里它叫 `corner-shape`，写法短到不像新特性：

```css
.card{ border-radius: 24px; corner-shape: squircle; }
.card--smoother{ border-radius: 24px; corner-shape: superellipse(1.6); }
```

预设值对应关系：`round` = superellipse(1)、`squircle` = superellipse(2)、`bevel` = superellipse(0)、`scoop` = superellipse(-1)、`notch` 与 `square` 分别趋近负无穷与正无穷。

一个必须记住的坑：**`corner-shape` 单独写没有任何效果。** `border-radius` 决定「角可以占多大一块」，`corner-shape` 决定「这块里画什么曲线」。radius 为 0 时，shape 再花哨也只是空转。

**落地时我会这么配。** 应用图标类：20–24px + `superellipse(2)`，最接近 iOS 的观感。卡片类：12–16px + `superellipse(1.4–1.7)`——比 2 更「平台」一点，不至于整页都在模仿 Apple。药丸按钮保持 `round` 就好：半径已经大到吃掉整条边，再调曲线看不出差别。还有个容易被忽略的细节：小尺寸下 squircle 比圆角显得更饱满，同一个按钮切过去会「胖一圈」，内边距和间距要跟着回一手。

**值得注意：这不是一个已经能无脑上的特性。** Chrome / Edge 从 139 起支持，Safari 与 Firefox 到 2026 年 6 月仍未支持，且没有公开时间表，约 35% 的用户看不到。好消息是降级几乎免费——不支持的浏览器会整行丢弃 `corner-shape`，你原有的 `border-radius` 原样生效，不变形也不报错。

还有一层比语法更值得留意的事：**形状正在被平台收编。** Apple 让 iOS 与 macOS 的应用图标都收敛到同一个 squircle，John Gruber 在 2026 年 7 月干脆把它叫作「squircle jail」（超椭圆牢房）。一致性是赚到的，个性是亏掉的——技术越好用，越容易让所有人长得一样。

## 02 作品 pick：ecobee 的硬件形状 × Pentagram 的像素涡轮

语法是新的，把形状当资产这件事却已经做了十几年。

### ecobee：让形状从产品长成品牌

**好在哪** —— ecobee 从 2014 年的 ecobee3 起，温控器本体就是一个 squircle。2020 年做品牌重塑时，团队没有另找符号，而是把这个形状从硬件搬进整套视觉。工业设计高级总监 Jonathan Hayes 把标准讲得很具体：角必须是 curvature continuous，「侧边要和圆角完美顺滑地接上，你分不出侧边在哪结束、圆角在哪开始；只要看出一点点断裂，这个形状就不成立」。

**你能偷什么** —— 先找出你产品里本来就独有的一个几何特征（一个半径比例、一个切角角度），把它写成一条可复用的规范：**半径 + 曲线参数 + 最小尺寸**，再让它在图标、按钮、卡片、产品图上一致出现。形状比 logo 更难被抄走，也更容易被记住。[原链接 · ecobee Citizen](https://www.ecobee.com/en-us/citizen/the-story-of-the-ecobee-squircle-a-q-and-a-with-jonathan-hayes/)

### Pentagram × Digital Turbine：把形状做成图案

**好在哪** —— Pentagram Austin 给这家移动广告技术公司做的新标识（2022 年 7 月上线），最终落在「两片叶片」的涡轮上。真正让我停下来的细节是叶片钝端那组被夸张拉开的方块图案：越靠边越散、越模糊，像是叶片高速旋转留下的拖影。形状在这里不只是轮廓，还是纹理，并且替品牌讲完了「速度」。

**你能偷什么** —— 把你选定的形状参数（比如 24px / `superellipse(2)`）做成一个 1× 的「形状单元格」，之后只靠缩放与重复去铺背景、做分隔线、做加载态。**一套几何参数吃遍全站**，比每页换一张插画省得多，也更像一个系统而不是一堆装饰。[原链接 · Pentagram](https://www.pentagram.com/work/digital-turbine)

## 03 工具与素材：跨浏览器兜底的两种做法

想在今天就把这个形状用出去，路径其实只有一条：算出超椭圆的路径，当成 `clip-path` 贴上去——浏览器不支持 `corner-shape` 也没关系，因为压根没用到它。

- **squircle.js / @squircle-js/react** —— 开源库，生成超椭圆的 SVG/CSS `clip-path`，所以 Chrome、Safari、Firefox 渲染出同一个形状；覆盖 React、Vue、Svelte、Solid 与原生。**用法**：先上它保证一致，等 `corner-shape` 铺开之后把库删掉，而不是一开始就不写。→ [squircle.js.org](https://squircle.js.org)
- **SmoothUI · Squircle 组件** —— 同一个思路，走 shadcn CLI 安装（文档 2026-09-20 更新）。项目已经用 Tailwind / shadcn 的话，一个可调的 squircle 容器基本是白送的。→ [smoothui.dev](https://smoothui.dev/docs/components/squircle)

顺手的副产品：把角部换成斜切（`bevel`），配合百分比半径，菱形、正六边形、加号都能用一个矩形长出来。

## 🎯 今天动手 · 10 分钟

把主按钮切成两份对比：复制你项目里的主按钮样式，一份保留 `border-radius: 12px` 再加 `corner-shape: superellipse(1)`（也就是现在的样子），另一份加 `corner-shape: superellipse(2)`，并排截一张图。重点看两件事——小尺寸下形状「胖」了多少、左右内边距是否需要跟着收 1–2px。然后把这条声明写进 `@supports (corner-shape: squircle){ … }`，或者干脆放在 `border-radius` 之后当渐进增强——不支持的浏览器直接忽略，不留痕。

## 参考来源

1. [MDN · corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)
2. [MDN · &lt;corner-shape-value&gt;（superellipse 取值表）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/corner-shape-value)
3. [Brecht De Ruyte · Beyond border-radius: What The CSS corner-shape Property Unlocks For Everyday UI · Smashing Magazine 2026-03-12](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui)
4. [Squircle.js · Squircles in CSS: corner-shape, superellipse() and Browser Support (2026) · 2026-06-12](https://squircle.js.org/blog/squircles-in-css)
5. [Master.dev · Understanding CSS corner-shape and the Power of the Superellipse](https://master.dev/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse)
6. [Can I use · corner-shape 浏览器支持表](https://caniuse.com/mdn-css_properties_corner-shape)
7. [ecobee · The Story of the ecobee Squircle: A Q&A with Jonathan Hayes · 2020-08-13](https://www.ecobee.com/en-us/citizen/the-story-of-the-ecobee-squircle-a-q-and-a-with-jonathan-hayes/)
8. [Pentagram · Digital Turbine（品牌识别，Pentagram Austin）](https://www.pentagram.com/work/digital-turbine)
9. [John Gruber · Apple Should Eliminate the App Icon ‘Squircle Jail’ · Daring Fireball 2026-07-06](https://daringfireball.net/2026/07/eliminate_app_icon_squircle_jail)
10. [SmoothUI · Squircle 组件文档（2026-09-20 更新）](https://smoothui.dev/docs/components/squircle)

---

*关于本期：每条手法都给了可复用的参数与出处；引用他人作品仅作评述用途，未复制任何素材。配图为本刊用 AI 生成的概念示意图，非原作截图。第 #003 期 · 2026-10-22 · 审美补给站 · 由 clacky 自动整理 · 每日 09:45 更新。*
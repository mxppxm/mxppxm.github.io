---
title: "审美补给站 #018：一根色相，拉出九级纵深"
description: "你最调不出来的那九级灰，其实是一个能抄的公式：色相锁死、L 从 0.98 走到 0.16、彩度在亮端和暗端都收窄、相邻级差至少 0.06。附两套可直接抄的系统（Radix 的 12 步角色阶梯、Tailwind v4 的 P3 色板）、一个边界检查工具，以及一条反直觉的插值规则。"
date: 2026-11-06
tags:
  - "🎨 审美补给站"
  - "配色"
  - "OKLCH"
  - "设计系统"
---

**TL;DR**

- **HSL 的 L 不是明度，是数学值** —— 同一个 `L=50%`，纯黄和纯蓝在屏幕上的感知亮度差一大截，所以手工拉的灰阶总是一脚深一脚浅。`oklch()` 的 L 才是感知明度（0–1），「等距」这个词才有意义。
- **九级梯只有三个常数** —— 色相锁死；L 走 `0.98 → 0.16`；彩度在亮端和暗端都要收窄；相邻级差至少 `0.06`。
- **整页只准有一个高彩度值** —— 其余全部压在 `C ≤ 0.03`。这一条守不住，九级还是二十级都只是噪音。

---

## 01 · 灰阶为什么会「糊」：九级梯的配方

单色系翻车的地方从来不是选色，是中间那几级。你把品牌色丢进 Sass 的 `darken()`，得到一排色块，看上去像根梯子，实际上每级踏步的高度都不一样 —— 因为 **`hsl()` 里的 L 是数学亮度，不是眼睛亮度**。同一个 `L=50%`，纯黄和纯蓝落在屏幕上，感知亮度差一大截。Evil Martians 讲 OKLCH 的那篇文章说得最省事：HSL 的亮度不可预测，所以 `darken()` 的结果经常出人意料。

换成 `oklch(L C H)`，L 才是感知明度。这时候「等距」才有意义：L 从 0.70 到 0.60 的落差，和从 0.40 到 0.30 是一样的。有了这个前提，阶梯才能写成公式，而不是靠眼睛一级级试。

### 九级梯的具体数值

下面这段可以直接粘进 `:root`。色相锁在 250（冷灰蓝）只是个例子，换成你的品牌色相即可，其余结构不动。

```
--ink-1: oklch(0.980 0.006 250);  /* 背景 */
--ink-2: oklch(0.950 0.008 250);  /* 卡片 */
--ink-3: oklch(0.900 0.010 250);  /* 分隔线 */
--ink-4: oklch(0.800 0.012 250);  /* 弱边框 */
--ink-5: oklch(0.680 0.014 250);  /* 次级文字上限 */
--ink-6: oklch(0.550 0.016 250);  /* 次级正文 */
--ink-7: oklch(0.420 0.018 250);  /* 正文 */
--ink-8: oklch(0.280 0.020 250);  /* 标题 */
--ink-9: oklch(0.160 0.022 250);  /* 主文字 */
--accent: oklch(0.620 0.170 28);  /* 唯一的强调色 */
```

比数值更重要的是三条规则：

- **H 不准漂。** 九级的色相角全部是 250，冷暖只从明度来。H 一漂，阶梯就会从「发蓝」滑到「发紫」，读者说不清哪里怪，就是不干净。
- **C 要反向补偿。** 亮端只给 `0.006–0.012`，暗端也只给 `0.020–0.022`。同一个彩度在暗部看起来更艳，那点艳会让深色区发出荧光感。
- **相邻级差至少 0.06。** 差 0.03 的两级在浅底上不是层次，是脏。真需要更细的梯度时，去加深色模式，而不是往浅色模式里塞第十级。

> **比调色板更重要的一条**：整页只允许一个 `C ≥ 0.15` 的值，其余全部压在 0.03 以下。这一条守住了，色板随便改都好看；守不住，再多的级数也只是噪音。

### 深色模式不用重画一套

用 `light-dark()` 加相对颜色语法，一套 token 管两套主题：

```css
--ink-7: light-dark(oklch(0.420 0.018 250), oklch(0.780 0.016 250));
```

注意深色不是把浅色反相，而是 **L 取镜像（1−L）、C 乘 0.8、H 不动**。web.dev 那篇色彩主题的演示就是这么搭的，它的基色是 `oklch(43.7% 0.075 224)`，两侧主题共用同一套变量。

还有一点容易踩：**oklch 的 L 差不等于 WCAG 对比度**。别拿「差 0.06」当合规依据，要么实测，要么用 APCA 的 `Lc` 值 —— 下面 Radix 那条就是按 Lc 定的。

---

## 02 · 作品 pick：两个可抄的系统

今天不挑单页作品，挑两个把这套逻辑做成了基础设施的系统。一个教你「级数怎么分配职责」，一个教你「色板怎么存」。

### Radix Colors：把色阶改造成角色阶梯

**好在哪。** 每套 12 级，每一级都绑死一个使用场景：1 应用背景、3 元素背景、4 hover、5 选中、6 细分隔、7 可交互边框、8 更强的边框与 focus ring、9 纯色底、11 低对比文字、12 高对比文字。两个细节值得记：**9 号是全阶彩度最高的一步**，也就是最纯的那格；**11 和 12 在 2 号背景上分别保证 APCA 的 `Lc 60` 与 `Lc 90`**。

**你能偷什么。** 命名。团队里不会再有「这里该用 300 还是 400」的争论，因为 token 叫 `hover-bg`，不叫 `blue-400`。纵深不是靠级数多，是靠每一级都被指派了职责：9 级够用，12 级更好，20 级没人记得住。

原链接：[radix-ui.com/colors](https://www.radix-ui.com/colors)

### Tailwind CSS v4：色板是数据，不是十六进制

**好在哪。** v4 把整套色板重做成 **P3 广色域**，每个色族 11 级（50→950），值全部写成 `oklch()`，并通过 `@theme` 暴露成原生 CSS 变量，配置从 JS 搬回了 CSS。你在 DevTools 里改一个 L，整族颜色跟着动，不用去查十六进制。

**你能偷什么。** 让色板以「数据」形态存在 CSS 里，组件只引用语义变量。副作用也要认：P3 色在 sRGB 屏上会被浏览器自动收敛，同一个值在两块屏幕上不会像素级一致 —— 这是色彩管理，不是 bug。

原链接：[tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)

**三个数字**：12 级（Radix 每套色阶，每级一个职责）· 11 级（Tailwind v4 每色族，50→950）· 35%（sRGB 能覆盖的人眼可见色彩比例）。

最后那个 35% 是理解 P3 的钥匙：sRGB 只画得出人眼可见色彩的三分之一多一点，新屏幕多给出约 30% 的额外色彩范围。所以同一套 oklch 值，在广色域屏上更饱和不是「渲染错误」，是它本来就该长这样。

---

## 03 · 工具与素材：两个能立刻用的东西

**1 · [oklch.com](https://oklch.com)（Evil Martians）**

粘 hex 进去，直接给出 oklch、P3 版本，以及一行 `closest fallback`（按彩度收敛）—— 告诉你这个颜色在 sRGB 屏上会被挤成什么样。拉九级梯时它的真正用处是**验边界**：不是所有 L/C/H 组合都落在显示器能显示的范围里，浏览器会替你找一个最近的，而那个「最近的」往往就是你不想看到的颜色。

**2 · `color-mix()` 和一条插值警告**

中间色不用手写第十个 hex：

```css
background: color-mix(in oklab, var(--brand) 12%, var(--bg));
```

但插值空间要挑对 —— 记住八个字：**分级用 oklch，插值用 oklab**。跨色相在 oklch 里插值，中间段会出现跳色（品红到黄会直接「翻过去」），WebKit 的记录里修法就是回到 oklab 当默认插值空间。分级要的是感知等距，插值要的是两点之间走直线，这是两件不同的事。

---

## 🎯 今天动手：十分钟拉一版

1. **把上面那十行粘进 DevTools 的 `:root`** —— 只改 H（换成你的品牌色相），C 和 L 全部照抄。十行变量，不用装任何东西。
2. **摆一排色块看一眼** —— 在页面上临时插一段十个色块的容器，用这十个变量填色，截图。
3. **眯眼找「黏在一起」的两级** —— 看到哪两级糊成一团，就把那一级的 L 再拉开 0.04，直到每级都踩得住。

---

## 参考来源

1. Andrey Sitnik / Travis Turner · [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) · Evil Martians 2025-09-17
2. Evil Martians · [OKLCH Color Picker & Converter（oklch.com）](https://oklch.com)
3. David A. Herron · [Color themes with Baseline CSS features](https://web.dev/articles/baseline-in-action-color-theme) · web.dev 2025-12-11
4. MDN · [color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
5. Radix · [Understanding the scale（12 步使用场景）](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
6. Adam Wathan · [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) · Tailwind Blog 2025-01-22
7. WebKit Bugzilla [#297835 · Make oklab the default interpolation space for color-mix()](https://bugs.webkit.org/show_bug.cgi?id=297835)
8. W3C · [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
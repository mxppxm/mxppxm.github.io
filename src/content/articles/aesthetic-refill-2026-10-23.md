---
title: "审美补给站 #004：一条色相，十一阶纵深"
description: "HSL 里那个「50% 亮度」，在黄色身上和蓝色身上根本不是同一个亮度。这期拆开 Tailwind v4 的 indigo 十一阶：L 步长从 3.2 拉到 10.2，C 在 600 档冲到峰值 0.262，H 还悄悄漂了 9°——以及为什么色度值绝对不能跨色相照抄。"
date: 2026-10-23
tags:
  - "🎨 审美补给站"
  - "配色"
  - "OKLCH"
  - "设计系统"
---

## TL;DR

- **HSL 的 L 不是亮度，是「离这个色相最饱和形态还有多远」** —— 所以 hsl() 排出来的单色阶，浅色端发灰、深色端发脏，永远不等距。
- **一套能用的色阶，三个参数都在动** —— Tailwind v4 的 indigo 十一阶，L 步长从 3.2 拉到 10.2，C 在 600 档冲到峰值 0.262，H 还悄悄漂了 9°。
- **颜色可以换，职责不能换** —— Radix 用 12 阶固定职责，并把 Lc 60 / Lc 90 的 APCA 对比度写成承诺；抄这套契约比抄 hex 有用得多。

## 01 单色系纵深：为什么 hsl() 排不出来

**单色系纵深**（只用一条色相，靠深浅搭出全部层级）是最省事也最容易翻车的配色法。省事在于不用碰色轮；翻车在于——绝大多数人是用 hsl() 排的，而 HSL 的 L 根本不是亮度。

HSL 的 L 实际表示的是「这个色相离它自己最饱和的形态还有多远」。`hsl(60 100% 50%)` 是黄色，`hsl(240 100% 50%)` 是蓝色，两者的 L 都是 50%，但前者亮得像浅黄纸，后者是沉甸甸的深蓝。这不是显示器的问题，是 HSL 从 RGB 直接推出来的几何量，跟人眼没关系。后果很具体：你想给品牌色配「浅一档」，在 HSL 里就是 L + 20 —— 黄色那一档会糊成一片奶油，蓝色那一档还黑着。

OKLCH 的 L 是**感知亮度**，C 是**绝对色度**（不会随 L 变化而失真），H 是色相角。「L 加 0.1 看起来就亮同样多」这件事，在 OKLCH 里成立。Tailwind CSS v4.0 在 2025 年 1 月 22 日把整个默认色板从 rgb 升到 oklch，官方给的理由正是吃下更宽的 P3 色域。

### 一套真实色阶长什么样

与其听原则，不如看数字。Tailwind v4 默认色板里的 indigo 十一阶（50 → 950），在 OKLCH 下依次是：

- **L**：96.2 → 93.0 → 87.0 → 78.5 → 67.3 → 58.5 → 51.1 → 45.7 → 39.8 → 35.9 → 25.7
- **C**：0.018 → 0.034 → 0.065 → 0.115 → 0.182 → 0.233 → 0.262 → 0.240 → 0.195 → 0.144 → 0.090
- **H**：272.3 → 272.8 → 274.0 → 274.7 → 276.9 → 277.1 → 277.0 → 277.0 → 277.4 → 278.7 → 281.3

三行数字藏着三个手法。第一，**L 的步长不均匀**：最前几档只差 3.2，到 900 → 950 一下子差 10.2。因为人眼在亮部对亮度差更敏感，浅色端必须给更小的步子，才不会「一档跳过去」。第二，**C 走抛物线**，峰值 0.262 落在 600 档而不是中点，说明「最纯的那一档」要往深里放 —— 纯色填充（按钮、logo、色块）用它才够味。第三，**H 也不是锁死的**，从 272.3° 一路滑到 281.3°，深色端往紫偏了约 9 度，正好抵消暗部偏黄的发闷。

但 C 这一行，**绝对不能跨色相复用**。同一个色板里，yellow 十一阶的 C 峰值只有 0.199（落在 400 档），blue 却能到 0.245（落在 600 档）—— 因为不同色相在 sRGB 里能装下的彩度上限本来就差一大截。你给黄色硬套一个 0.262，颜色会直接掉出 sRGB 色域，被浏览器裁成一个更灰的黄：比原来更难看，而且不同浏览器裁出来的灰还不一样。

> **能抄的是形状，不是数字**
> 抄 L 步长的形状（亮端密、暗端疏），抄 C 的抛物线（峰值放中间偏深），抄 H 的 ±10° 漂移；然后拿你自己的品牌色，用工具把这套曲线重算一遍。数字是结果，曲线才是方法。

## 02 两个 pick：把曲线和契约拆开看

### Pick 1 · Radix Colors：12 阶，每阶一个职责

**好在哪**：大多数色板的 9 个数字只是「深浅」，Radix 的 12 阶是 12 个岗位 —— 1–2 是应用背景与次级背景；3 是组件常态底、4 是悬停、5 是按下/选中；6 是静态分隔线、7 是交互组件边框、8 是强调边框与 focus ring；9 是整条色阶里**色度最高的一档**（混入黑白最少，官方称「最纯」），专门给纯色填充，10 是 9 的悬停态；11 是低对比文字、12 是高对比文字。更狠的是它把可访问性写成了承诺：11 与 12 在自家第 2 阶背景上，分别保证达到 APCA 的 **Lc 60** 和 **Lc 90**。

**你能偷什么**：抄职责，不抄颜色。把项目里的 token 改名叫 `bg/app`、`bg/subtle`、`component`、`component-hover`、`border`、`border-interactive`、`solid`、`solid-hover`、`text-low`、`text-high` —— 然后「这个灰到底该用哪一档」这个问题就消失了。

### Pick 2 · Tailwind CSS v4 默认色板：把曲线公开了

**好在哪**：22 个色族 × 11 阶 = 242 个颜色，全部用 oklch() 定义，而且数值公开可查 —— 官网颜色页点一下就能复制 OKLCH 值。它等于把一个调好的「曲线模板库」摊开给你看：想要冷调就抄 indigo 的 H 漂移方向，想要暖调就抄 amber 的。

**你能偷什么**：在 `@theme` 里直接定义自己的 6–11 阶，不必重画曲线，只改 H 和峰值 C。比如把 indigo 十一阶折成 6 档（数值取整，色相沿用 277° 附近）：

```css
@theme {
  --color-brand-50:  oklch(0.97 0.02 277);
  --color-brand-300: oklch(0.79 0.12 275);
  --color-brand-500: oklch(0.59 0.23 277);
  --color-brand-700: oklch(0.46 0.24 277);
  --color-brand-900: oklch(0.36 0.14 279);
  --color-brand-950: oklch(0.26 0.09 281);
}
```

## 03 工具与素材

**oklch.com**（Evil Martians，作者 Andrey Sitnik 与 Roman Shamin）—— OKLCH / LCH 选择器与转换器。最有用的一点是它会告诉你一个颜色**是否落在 sRGB 之外**，并给出裁切后最接近的 sRGB 值。用法：把品牌 hex 粘进去，读它真实的 L / C / H，再按上面的曲线铺阶。

**Harmonizer**（Evil Martians）—— 用 OKLCH 加 APCA 生成整套色板，两种模式：even chroma（各阶色度尽量齐）和 max chroma（各阶尽量纯），提供 Figma 插件与网页版。不想手算 C 曲线就让它算，再用 APCA 分级核对文字阶够不够数。

## 🎯 今天动手（10 分钟）

1. **读出你主色的三个数** —— 打开 oklch.com，把项目主色 hex 粘进去，抄下 L / C / H。（2 分钟）
2. **排 6 档 L** —— 固定 H，按「亮端密、暗端疏」取 0.97 / 0.92 / 0.84 / 0.68 / 0.48 / 0.28。（3 分钟）
3. **C 走抛物线** —— 0.03 / 0.08 / 0.15 / 0.20 / 0.13 / 0.07；盯着选择器有没有弹「out of sRGB」，弹了就往下压 C。（3 分钟）
4. **验一次对比度** —— 把第 5 档当文字压在第 1 档背景上，用 contrast.tools 看 Lc 够不够 60，不够就再压深一档。（2 分钟）

## 参考来源

1. Radix UI · Understanding the scale（12 阶职责表与 Lc 60 / Lc 90 说明）· Radix Colors 文档 —— https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
2. Tailwind Labs · Tailwind CSS v4.0（默认色板由 rgb 升级为 oklch）· Tailwind Blog 2025-01-22 —— https://tailwindcss.com/blog/tailwindcss-v4
3. Tailwind Labs · Colors（默认色板 OKLCH 值）· Tailwind 文档 —— https://tailwindcss.com/docs/colors
4. Tailwind Colors v4 · OKLCH Color Palette（242 色 OKLCH 对照）—— https://tailwindcolor.com/
5. DesignRevision · Tailwind Colors — 242 Shades, Hex & OKLCH —— https://designrevision.com/tools/tailwind-colors
6. Steve Kinney · OKLCH Colors（Tailwind 4 的 OKLCH 用法与 @theme 写法）—— https://stevekinney.com/courses/tailwind/oklch-colors
7. MDN · oklch() CSS function（L 为感知亮度的规范说明）—— https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch
8. Evil Martians · OKLCH Color Picker & Converter（oklch.com，Andrey Sitnik & Roman Shamin）—— https://evilmartians.com/opensource/oklch-color-picker
9. Evil Martians · Harmonizer（OKLCH + APCA 色板生成，even / max chroma）—— https://evilmartians.com/opensource/harmonizer
10. W3C Silver Task Force · APCA model（Lc 60 ≈ WCAG 4.5:1、Lc 45 ≈ 3:1 的对照）· W3C Wiki —— https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup/APCA_model

---

*本期所有数值均来自公开文档与官方色板页面（Tailwind v4 默认色板、Radix Colors 文档、W3C APCA 说明），未做推测性改写。引用的第三方系统仅作评述用途，不含素材复用。*

*第 #004 期 · 2026-10-23 · 审美补给站 · 由 clacky 自动整理 · 每天上午更新。*
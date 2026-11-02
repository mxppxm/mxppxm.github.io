---
title: "审美补给站 #014：色板不该是四个开关，它是一条曲线"
description: "一个拿了 SOTD 的作品集网站，把『现在几点』变成了界面的环境变量。能抄的不是那套颜色，是三条各走各的轴：明度单调、色度双峰、色相只转 18°。附 Oxide 设计系统的中性色退潮公式 C = 0.012 × (1−L)^2.2。"
date: 2026-11-02
tags:
  - "🎨 审美补给站"
  - "配色"
  - "OKLCH"
---

[Brandon Yasin](https://brandonyasin.com) 的个人站（Awwwards 10 月 24 日 Site of the Day，7.31/10）右上角写着 **Local Time**。点开是 **Time Travel**：拖一下时钟，整站配色跟着走。同一套版式，早上是暖奶油，入夜是冷紫，导航展开时像一本本杂志封面并排推过来。

大部分"跟随时间变色"的站都栽在同一个地方：它们准备了四套色板——清晨、白天、黄昏、夜晚——按小时切换。切换那一秒，所有颜色一起跳。用户看见的不是"天亮了"，是"换主题了"。

## 01 · 把"几点"拆成三条轴，而不是四套色板

正确的做法是：**时间是输入，颜色是输出，中间三个通道各自独立。** 在 OKLCH 里就是 L、C、h 三个数，它们分别管三件事——明度决定亮不亮，色度决定有没有颜色，色相决定偏哪个方向。

```css
@property --t { syntax:"<number>"; inherits:true; initial-value:0.5 }

body{
  --t:.5;                                  /* 0 = 深夜, 1 = 正午 */
  --l: calc(.965 - .745 * var(--t));       /* 明度 0.965 → 0.22 */
  --c: calc(.016 + .026 * var(--breath));  /* 色度跟呼吸曲线 */
  --h: calc(258 + 18 * var(--t));          /* 色相只转 18° */
  background: oklch(var(--l) var(--c) var(--h));
  transition: --t 600ms cubic-bezier(.4,0,.2,1);
}
```

三个变量里最容易被忽略的是 **`--c` 必须先单独算**。一天里有两次色度峰值，出现在日出后与日落前各约 40 分钟——也就是 blue hour。写成分段：t 小于 0.2 时色度从 0.3 升到 1，0.2–0.72 回落到 0.25，0.72 之后再到 0.9。这样色板才有"呼吸"，而不是一路匀速变暗。

明度反而是三条里最不线性的：太阳高度角变化最快的是日出日落前后，所以 L 在 t 的 0.2–0.35 与 0.7–0.85 两段走得陡，其余平缓。色相只转 18°，这是克制的地方——转到 40° 以上，就从"同一天的早和晚"变成"两个不同的品牌"了。

它比 `prefers-color-scheme` 好在哪？后者只有两档：亮或暗，是用户的选择题；时间色板是一条连续的轴，是环境的叙述。两者也不冲突——把 `--t` 当基线，用户在系统里选了暗色就把基线乘 0.75，剩下的交给曲线。真正不能做的是把时间硬编成 4 个 if。

拖动时钟时别用 JS 逐帧改色，交给 CSS 变量加 transition——前提是 **`--t` 已用 `@property` 注册成 `<number>`**，没注册的数字变量不能过渡，会直接跳。600ms 配 `cubic-bezier(.4,0,.2,1)` 是个保守起点。

## 02 · 作品 pick：一个网站，一套设计系统

### 1 · Brandon Yasin 作品集 — brandonyasin.com

Awwwards Site of the Day（2026-10-24），7.31/10，作者 Brandon Yasin 与 Aslan GM，丹麦奥胡斯，同时拿了 Developer Award。

**好在哪：**它把"环境状态"做成了可见的 UI 元素。右上角不是装饰性时钟，是真的本地时间；点开能拖。导航用杂志封面并排的方式展开——每一层都是一张独立排版的封面，横向推进，不是下拉菜单。整套排版是社论式的：大字、窄栏、大留白，正文与作品靠字重和字号分层，不靠色块分区。

**你能偷什么：**① 让系统状态可见而不是藏起来，时间、地点、网络，本来就是现成的叙事素材。② 时钟数字用 `font-variant-numeric: tabular-nums`，秒数跳动时宽度不变，不会把旁边文字推来推去。③ 拖动类交互给 200–300ms 的跟随延迟，0ms 会显得"轻"，像在滑一块玻璃。

### 2 · Oxide Computer Design System — @oxide/design-system

**好在哪：**15 级中性色，neutral-0 到 neutral-1300，全部用 `oklch()` 授权。有意思的是它的色度不是常数：最深一档 `oklch(0.162 0.01 260)`，中间 `oklch(0.316 0.006 260)`，浅端 `oklch(0.79 0.0011 260)`，最浅 `oklch(0.995 0.0001 260)`。同一个色相 260（冷蓝），色度从 0.01 一路退到 0.0001——**越亮，颜色越退潮**，到近白时几乎是纯灰。这就是它的暗色界面不"脏"的原因：灰里有一点蓝，但亮部不会糊成脏蓝灰。

配套参数也够硬：圆角只有 1 / 2 / 4 / 6px 四档（外加 9999），字号 11–65px 共 13 档，字距按字号反比（小字放开、大字收紧），默认主题是 dark，亮色通过 `[data-theme="light"]` 显式开启。

**你能偷什么：**别再用 #808080 系列凑中性色。选一个色相——260 冷蓝或 80 暖黄——色度从 0.012 起，按亮度指数衰减到 0.0002。一行公式够用：`C = 0.012 × (1 − L)^2.2`。

## 03 · 两个能立刻用的工具

**OKLCH Color Picker & Converter**（[oklch.com](https://oklch.com/)，Evil Martians 出品，Andrey Sitnik 与 Roman Shamin）。粘 HEX 进去转 OKLCH，能看 P3 / Rec2020 色域边界，拖 3D 色域图就知道你的色度有没有超出 sRGB。调时间色板时最有用的是它那个「Closest fallback (by chroma)」——告诉你这个颜色在 sRGB 里最接近的版本，方便你决定要不要保底。

**SunCalc**（[suncalc.org](https://suncalc.org/)）。输入经纬度，给你当天的 dawn / sunrise / culmination / sunset / dusk，还有太阳高度角与方位角。把硬编码的 6:00 / 18:00 换成真实日出日落，你的色板在哈尔滨和三亚才不会差一小时——这一步比调色本身更影响"像不像"。

> 95.12% —— `oklch()` 全球支持率（StatCounter 2026 年 9 月）
> 0.0001 —— Oxide 最浅一级中性色的色度
> 18° —— 建议色相漂移上限

## 🎯 今天动手（10 分钟）

1. **加一个变量** —— 在任意页面的 `:root` 里写 `--t:1`，然后 `body{background:oklch(calc(.965 - .6*var(--t)) .012 258)}`。
2. **接一个滑杆** —— 插 `<input type="range" min="0" max="1" step="0.01">`，`oninput` 里把值写进 `--t`，拖。
3. **看中间段** —— 如果中间过程发灰、发闷，那不是颜色选错了，是三条轴被捆成了一条。把色度单独拎出来，就是第一段那个配方。

## 参考来源

1. [Awwwards · Brandon Yasin — Site of the Day 7.31/10 · 2026-10-24](https://www.awwwards.com/sites/brandon-yasin)
2. [Brandon Yasin · 作品集官网（Local Time / Time Travel）](https://brandonyasin.com)
3. [UI Skills · Oxide Computer Design.md（OKLCH 色阶与 token 摘录）· 2026-09-21](https://www.ui-skills.com/design-md/oxidecomputer)
4. [W3C · CSS Color Module Level 4（Candidate Recommendation Draft）· 2026-10-27](https://www.w3.org/TR/css-color-4/)
5. [Can I use · oklch() 支持率 95.12%（StatCounter 2026-09）](https://caniuse.com/mdn-css_types_color_oklch)
6. [Evil Martians · OKLCH Color Picker & Converter](https://oklch.com/)
7. [SunCalc · 日出日落与太阳位置计算器](https://suncalc.org/)
8. [Awwwards · Sites of the Day RSS（作品日期核对）](https://feeds.feedburner.com/awwwards-sites-of-the-day)
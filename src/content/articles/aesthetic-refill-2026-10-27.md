---
title: "审美补给站 #008：弹簧，现在是一条字符串"
description: "linear() 今年 6 月进入 Widely Available，覆盖 93.99%——纯 CSS 做弹簧不再是问题。但 11 个折点画不像、40 点才像，而真正的分水岭在被打断的那一秒。"
date: 2026-10-27
tags:
  - "🎨 审美补给站"
  - "动效"
  - "CSS"
---

> **TL;DR**
> 1. **这件事已经过期了。** `linear()` 于 2026-06-11 进入 Widely Available，Can I use 上覆盖 93.99%，"能不能用纯 CSS 做弹簧"不再是问题，现在该问"做成什么样"。
> 2. **难点是折点数量。** Josh Comeau 手画的 11 点版本像机器人在跳格，补到 50 点才顺；而他实测 100+ 点的性能与 `linear(0, 1)` 无差别——成本只体现在 CSS 体积上。
> 3. **真正的取舍在中断。** Vaul 用 500ms 曲线 + 拖拽进度，Sonner 用 400ms ease 而不是弹簧——两个最会做动效的组件，都没把物理引擎塞进去。

---

## 01 · 把一条阻尼曲线写成折点

2026 年 6 月 11 日，`linear()` 在 web-features explorer 上从「新特性」被划进 **Widely Available**。Can I use 上现在写着 **93.99%**。也就是说，「纯 CSS 能不能做弹簧」这个问题，今年夏天已经正式过期了——现在该问的是"做成什么样"。

做法本身粗糙得可爱：给它一串 0 到 1 之间的数字，点与点之间用直线连起来。数字可以越过 1 —— **1.25** 就是冲过终点 25%。点还能带时间：`linear(0, 0.25 75%, 1)` 表示 0.25 这个值出现在 75% 的时间点；写成 `0.25 25% 75%`，表示它从 25% 一直保持到 75%。

所谓 `linear()`，就是把一条光滑的阻尼曲线切成若干段直线，只在折点上取样。难点不在语法，在**折点数量**。Josh Comeau 手画过一个 11 点的弹簧：

```
linear(0, 1.25, 1, 0.9, 1.04, 0.99, 1.005, 0.996, 1.001, 0.999, 1)
```

看着像，动起来是机器人在几个离散位置之间"啪、啪、啪"地跳。他把采样点补到 **50 个**才顺；他自述常用弹簧都在 **40 点以上**，用 Easing Wizard 拉高精度能到 **75 点**。11 点不够、40 点起步，这是能直接抄进规范的第一个数字。

那 100 个点会不会卡？他测过：`linear(0, 1)` 与一条超过 100 个值的字符串，在低端硬件上跑，帧率测不出差别。真实成本只有 CSS 体积——所以正确姿势是把它当设计 token：在 `:root` 里存三五条曲线变量，组件只引用变量名，而不是在每个 class 里贴一条八百字符的字符串。

> **参数怎么定（能直接抄）**
> 点击触发的弹层／抽屉：**duration 380–520ms**；界面控件 bounce **0–15%**；带物理隐喻的东西（卡片翻面、抽屉甩出）**20–30%**。
> Apple 的官方口径同源：`spring(duration:bounce:)` 默认 duration **0.5**、bounce **0.0**，文档里那句"**15% 左右的弹跳已经不算弹**"，可以直接搬进设计规范。

还有三条边界必须写在文档里：它**仍然是时间驱动**的（CSS transition 必须给 duration，而物理弹簧是给参数、让时长自己长出来）；它**不保速度**（中途被打断时，CSS 从当前值按新曲线重放，JS 弹簧会带着速度继续）；字符串**很长**。

## 02 · 两个 pick：曲线和打断，分开选

把"要不要弹簧"和"要不要 JS"拆成两个问题，答案会清晰很多。下面两个组件，恰好给出了两种相反的解法。

### Vaul · 抽屉：500ms 的曲线，加上按进度走的拖拽

好在哪：抽屉的入场是 **500ms**，曲线取自 **Ionic Framework**，作者 Emil Kowalski 说得很直白——选它是为了贴近 iOS Sheet 的手感，而 500ms 也是为了"像 iOS"（[原文](https://emilkowal.ski/ui/building-a-drawer-component)）。更关键的是拖动阶段：位移直接跟手指进度走，**不是时间轴**；松手时用速度决定是完成还是回弹。

你能偷什么：把"点击触发"和"拖拽中"当成两种状态分别写，前者给 500ms 曲线，后者给 progress 映射，不要指望一个 transition 通吃两者。

### Sonner · toast：把 keyframes 换成 transition，因为要能被打断

好在哪：入场最初用 CSS **keyframes**，作者发现它不可中断——快速连加几条，旧的会"跳"到新位置而不是滑过去。改成 `transition: transform 400ms ease` 加 data 属性切换后，就能被重定向；堆叠靠变量算：每条按 `--toasts-before * 0.05` 缩小、按 **14px** 逐层抬升（[原文](https://emilkowal.ski/ui/building-a-toast-component)）。

你能偷什么：入场动效要假定自己会被下一条打断；层级位移用 CSS 变量算，别写十条 nth-child 规则。注意它用的是 **400ms ease**，不是弹簧——可中断性比"像不像弹簧"更重要。

| 指标 | 数值 | 含义 |
| --- | --- | --- |
| 93.99% | linear() 全球覆盖 | Can I use 当前数据 |
| 40–75 | 一条可信弹簧的折点数量 | Josh Comeau / Easing Wizard |
| 500 / 400 | Vaul 与 Sonner 的时长（ms） | 两个真实组件 |

## 03 · 工具：两个十分钟能上手的

**Easing Wizard · easingwizard.com** —— 作者 Matthias Martin，支持 Bézier、spring、bounce、wiggle、overshoot 五类曲线，调完直接导出 `linear()` 字符串，可以控制采样精度。用法就一句：把 **duration** 和 **bounce** 拉到你要的位置，复制字符串，存成 token，别存进组件。它比手算快一个数量级。

**Chrome DevTools 的 linear() 编辑器** —— Chrome **114+** 起，在 Styles 面板点曲线图标就能展开一个可拖拽的折点编辑器。它的价值不在生成，而在**验收**：把同事给的那条 800 字符串拖两下，立刻能看出它是"真的在衰减"还是"抄了前三个点剩下乱填"。

## 🎯 今天动手

**给项目加一条弹簧 token。** 在 Easing Wizard 里生成 `500ms / bounce 15%` 的曲线，导出字符串、命名为 `--ease-spring-soft` 存进 `:root`，套到抽屉或弹层的 `transform` 上；然后在 DevTools 里**连点两次**触发它——如果元素"跳"而不是"滑"，说明这个组件需要的是可中断方案（transition + 变量），而不是更漂亮的曲线。十分钟够做完。

---

**参考来源**

1. [Bramus · Create complex animation curves in CSS with the linear() easing function · Chrome for Developers · 2023-05-25](https://developer.chrome.com/docs/css-ui/css-linear-easing-function)
2. [MDN · linear() · CSS easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear)
3. [web-features explorer · linear() easing · Widely Available since 2026-06-11](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing)
4. [Can I use · easing-function: linear() · 全球覆盖 93.99%](https://caniuse.com/mdn-css_types_easing-function_linear-function)
5. [Josh W. Comeau · Springs and Bounces in Native CSS · 2025-10-28（2026-05-05 更新）](https://www.joshwcomeau.com/animation/linear-timing-function/)
6. [Josh W. Comeau · A Friendly Introduction to Spring Physics Animation](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics)
7. [Apple Developer · Animation.spring(duration:bounce:blendDuration:)](https://developer.apple.com/documentation/swiftui/animation/spring(duration:bounce:blendduration:))
8. [WWDCNotes · Animate with springs（WWDC23 · 10158）](https://wwdcnotes.com/documentation/wwdc23-10158-animate-with-springs)
9. [Emil Kowalski · Building a drawer component（Vaul）](https://emilkowalski.ski/ui/building-a-drawer-component)
10. [Emil Kowalski · Building a toast component（Sonner）](https://emilkowalski.ski/ui/building-a-toast-component)

*第 #008 期 · 2026-10-27 · 审美补给站 · 由 clacky 自动整理 · 每日 09:45 更新。*
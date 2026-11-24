---
title: "审美补给站 #036：曲线是画出来的，弹簧是算出来的"
description: "Google 今年把 Material 整套缓动参数换成了两个物理量——刚度与阻尼比。阻尼 0.6 过冲 9.5%，0.8 是 1.5%，0.9 只有 0.15%；Standard 档收敛 164ms，Expressive 档 251ms，那 87 毫秒就是表达力的账单。附 Sonner 的层叠参数与 Family 的托盘约束，以及今天就能换上手的 CSS。"
date: 2026-11-24
tags:
  - "🎨 审美补给站"
  - "动效"
  - "交互设计"
  - "Material Design"
  - "CSS"
---

旧的 Material 动效体系是四件套：一条 easing 曲线配一个 duration。你要记住 `emphasized-decelerate` 是 `cubic-bezier(0.05, 0.7, 0.1, 1.0)` 配 500ms 这种组合，然后在几十个组件里保持一致。今年 M3 Expressive 换了模型：不再描述"曲线长什么样"，而描述"这个东西有多重、多弹"——只有两个参数，**stiffness**（刚度）和 **damping ratio**（阻尼比）。

这么换不只是写法优雅。弹簧天生**可中断**：用户在一半的位置再点一次，弹簧从当前位置接着算，不会像固定时长的曲线那样要么跳帧、要么从头再来一遍。这也是下面 Sonner 那个例子的底层原因——它宁可放弃 keyframes 也要保住中断能力。

![一条平滑贝塞尔曲线贴住目标线，另一条绿色弹簧曲线冲过目标线再回弹收敛](https://mxppxm.github.io/images/aesthetic-refill-2026-11-24.jpg)

两种思路的差别不在形状，在定义方式：灰线是被人画出来的（给起点、给终点、给控制点），绿线是被算出来的（给刚度、给阻尼，轨迹自己长出来）。

| Token | 阻尼比 ζ | 刚度 k | 过冲 | 2% 收敛 |
| --- | --- | --- | --- | --- |
| Expressive · spatial fast | 0.6 | 800 | **9.5%** | 约 230ms |
| Expressive · spatial default | 0.8 | 380 | 1.5% | 约 251ms |
| Expressive · spatial slow | 0.8 | 200 | 1.5% | 约 346ms |
| Standard · spatial default | 0.9 | 700 | 0.15% | 约 164ms |
| Expressive · effects | 1.0 | 1600 | 0% | 约 165ms |

数值取自 AndroidX 的 `ExpressiveMotionTokens.kt` 与 `StandardMotionTokens.kt`；过冲按 exp(−πζ/√(1−ζ²)) 算，收敛时间按包络衰减到 2% 估算（质量归一为 1）。

## 三个数，各管一件事

**过冲量只由阻尼比决定**，跟刚度无关。ζ=0.6 冲过目标 9.5%，0.8 只冲 1.5%，0.9 基本贴线（0.15%）——这 0.1 的差距，就是"弹了一下"和"抖了一下"的区别。**快慢由阻尼比乘刚度决定**：ω=√k，收敛时间约 3.9/(ζω)。所以"更弹"和"更快"是两个独立旋钮，这正是贝塞尔给不了你的：想加过冲得手画控制点，一改时长形状又跟着变形。

顺手比一下就有意思了：Standard 的默认档（ζ0.9 / k700）收敛在 164ms，比 Expressive 默认档的 251ms **快 87 毫秒**。也就是说，Expressive 那点"表达力"，账单是 87 毫秒——这是为什么工具类产品该留在 Standard，而营销页、开屏、彩蛋才值得付这笔钱。

> **别对颜色用 spatial。** 位置过冲叫"弹"，透明度或颜色过冲叫"闪一下"。M3 把 effects 那套的阻尼固定成 1.0（零过冲）、刚度拉到 1600，就是为了让颜色永远单调逼近终点。你抄参数时，`opacity`、`background-color` 一律走 effects 档，别复用位移的曲线。

![三条不同阻尼比的弹簧曲线对比，分别标注过冲 9.5%、1.5%、0.15%](https://mxppxm.github.io/images/aesthetic-refill-2026-11-24-fig2.jpg)

阻尼比 0.6 / 0.8 / 0.9 三条轨迹，纵轴是进度、横轴是时间。注意最上面那条要回弹三四次才停住——单次动画可能觉得"活泼"，放进一个连点五次才保存成功的表单里，就是灾难。

网页端现在也能算。CSS 的 `linear()` 从 2023 年 12 月起跨浏览器可用（MDN 记为 Baseline widely available）：它不吃公式，只吃停靠点——把弹簧采样成 20 到 30 个 progress/time 对，浏览器在点之间线性插值。经验值：小于 15 个点肉眼能看出折线感，30 个点以上基本看不出是插值。懒得配生成器，可以先退一步用 **easeOutBack**：`cubic-bezier(0.34, 1.56, 0.64, 1)`，过冲约 10%，手感接近 ζ0.6 那一档。

## 两个作品：同一件事的两种做法

一个在网页，一个在 iOS；一个靠 transition，一个靠托盘。共同点是：动效在这里不是装饰，而是"它从哪来、还能不能反悔"的信息。

三个数字先记住：**0.11 px/ms** 是 Sonner 滑动关闭的速度阈值，**0.05** 是层叠时每层递减的缩放，**−14px** 是每层上移的位移。

### Sonner · 把 keyframes 换成可中断的 transition

Emil Kowalski 写 Sonner 时先用的是 `@keyframes`，很快撞上问题：keyframes 不可中断。用户快速连加三个 toast，老的那些会**跳**到新位置而不是滑过去。改成 `transition` + `data-mounted` 属性后，动画可以在一半被改写目标值。层叠本身是纯算术：每层上移 14px、缩放递减 0.05（第二层 0.95、第三层 0.9），于是"叠了几层"变成了看得见的事。滑动关闭用**速度阈值 0.11 px/ms** 而不是距离阈值——快速一甩就走，慢慢拖则必须拖过距离线。

**你能偷：** 所有列表、抽屉、提示条的进场都换成 `transition` + 数据属性，别用 keyframes（顺手可以考虑 `@starting-style`）；把"拖过半屏才关"改成"速度够快就关"，短距离快滑也能走，手感立刻不是一个档次。

→ [原文：Building a toast component · emilkowal.ski](https://emilkowal.ski/ui/building-a-toast-component)

### Family · 用高度差当"你在第几层"

Benji Taylor 给加密钱包 Family 定的三条原则是 simplicity / fluidity / delight，落到实处的是一套**动态托盘**：确认单、风险警告、教程都不占满屏，而是从触发它的那个按钮里长出来，一层套一层。约束很硬——**每往下一层，托盘的高度必须和上一层不同**，用户靠高度差就知道自己在第几层、还能不能返回，不需要额外的进度点。为了满足这条，他们甚至会去重写托盘里的文案来凑高度差。

**你能偷：** 层叠容器别做成等高等高，每层给 8–12% 的尺寸差；进场动画的 `transform-origin` 对齐真正的触发元素，而不是画布中心。空间连续感就是这么来的。

→ [原文：Family Values · benji.org](https://benji.org/family-values) · [逐帧拆解](https://60fps.design/apps/family)

![三张白色卡片层叠示意，标注第 1 层位移 0 缩放 1.00、第 2 层 −14px 缩放 0.95、第 3 层 −28px 缩放 0.90](https://mxppxm.github.io/images/aesthetic-refill-2026-11-24-fig3.jpg)

层叠的三组数字（来自 Sonner 的实现）。位移负责"往上叠"，缩放负责"往后退"——两者一起才产生深度；只改其中一个，看起来像被压扁了。

## 两个工具，今天就能上手

**[linear() easing generator](https://github.com/jakearchibald/linear-easing-generator)**（Jake Archibald）——拖滑杆调出 spring 或 bounce，实时预览，直接导出可粘贴的 `linear()` 字符串。它存在的理由很朴素：手写 30 个停靠点不现实。你要是已经用 Motion 之类带 spring 的库，同样参数（stiffness / damping）可以直接搬。

**[Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function)**（Josh W. Comeau）——可交互的一篇长文，改阻尼比和刚度能立刻看到曲线变化和真实动画，附可直接复制的写法。适合先在这里把"手感"调对，再去项目里替换 token。

两个都是零安装、浏览器打开即用。想确认兼容边界，查 [`linear()` 的 MDN 页面](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear) 比查 caniuse 更直接。

## 🎯 今天动手（10 分钟）

挑项目里最常被点的那颗按钮，把 `transition: 300ms ease` 改成：

```css
transition: transform 270ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

（约 ζ0.6 的手感，过冲 10%）。紧接着补一行：

```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 1ms !important; }
}
```

把位移关掉、只留颜色变化。两行代码，手感从"平"变"弹"，还顺手做了无障碍。

## 参考与作品链接

1. [Material Design 3 · Easing and duration · Tokens & specs](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
2. [Material Design 3 · Motion physics system · How it works](https://m3.material.io/styles/motion/overview/how-it-works)
3. [AndroidX · ExpressiveMotionTokens.kt（弹簧 token 原始数值）](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
4. [AndroidX · StandardMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt)
5. [Emil Kowalski · Building a toast component](https://emilkowal.ski/ui/building-a-toast-component)
6. [Emil Kowalski · Sonner 源码（层叠与滑动关闭实现）](https://github.com/emilkowalski/sonner)
7. [Benji Taylor · Family Values · 2024 年 7 月 8 日](https://benji.org/family-values)
8. [60fps.design · Family 交互逐帧拆解](https://60fps.design/apps/family)
9. [Jake Archibald · linear() easing generator](https://github.com/jakearchibald/linear-easing-generator)
10. [Josh W. Comeau · Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function)
11. [MDN · linear() easing function（Baseline 2023 年 12 月）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear)
12. [Rauno Freiberg · Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
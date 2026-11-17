---
title: "审美补给站 #029：空状态的那张图，本质是信号灯"
description: "一个空屏最值钱的不是插画，是灰、黄、红、绿这四个颜色分别代表什么。PatternFly 把图标和场景绑成了一张映射表（灰 #8A8D90 / 红 #C9190B / 绿 #486B00），文案区只有 350 / 400 / 600px 三档宽度；Carbon 允许三种 CTA 放法，最狠的一种是拿指示线指回界面上的那个按钮；Atlassian 干脆禁止缩小插画。附两个能立刻用的工具，和一条十分钟能做完的改动。"
date: 2026-11-17
tags:
  - "🎨 审美补给站"
  - "设计手法"
  - "空状态"
---

界面上最容易被糊弄的一屏，是空的那一屏。常见做法是把同一张灰插图复制到所有空状态上，标题写「暂无数据」，然后就走人。NN/g 的 Kate Kaplan 在 2021 年那篇指南里把代价说得很直接：一个完全没有反馈的空容器，用户没法判断是「真的没有」「还在加载」还是「出错了」，只能反复刷新。她还点了一个更糟的例子 —— 加载过程中先显示 `No records`，几秒后再换成真实内容；这么干之后，用户会学会不信任这个界面。

## 01 · 颜色是状态通道，不是装饰

Red Hat 的 PatternFly 给出的解不是「画得更好」，而是把**图标、颜色、场景**做成一张映射表：

| 场景 | 颜色 | 图标 |
|---|---|---|
| 首次使用 / 搜索无结果 / 需要配置 / 无权限 / 需要新建 | 暖灰 `#8A8D90` | rocket / search / wrench / lock / plus |
| 取不到数据、后端失败、出错 | 红 `#C9190B` | exclamation-circle |
| 任务或流程完成 | 绿 `#486B00` | check-circle |

它的 CSS 也是同一套逻辑：图标默认色走 subtle 灰，只有 `--m-danger` / `--m-warning` / `--m-success` / `--m-info` 这几个修饰类才改色。换句话说，**图形可以省掉，颜色不能省** —— 它承担的不是气氛，是一个判断：这里到底是空的，还是坏的。

尺度那一半同样不该凭手感。PatternFly 的空状态只做四档，对应文案区最大宽度 **350px / 400px / 600px**（源码里写作 `21.875rem / 25rem / 37.5rem`）；图标字号默认取 2xl，只有最大一档才升到 3xl，图标下方的间距同时从 lg 提到 xl。Atlassian 那边更硬：这个组件只针对 spot 插画优化，明写**不许把 spot hero 或任何更大的插画缩下来去填小空间**。平时看到「同一个产品里插画忽大忽小、每页都不一样」，基本就是没人定这几档、每次都现场缩图的结果。

> **值得注意**：别把「没有数据」和「取不到数据」做成同一个灰。前者要教用户怎么开始，后者要给一条重试路径。颜色一样，这两句话就变成了一句，用户只能靠猜。

## 02 · 两个团队怎么解这道题

### ① Carbon（IBM）· Empty states

Carbon 把空状态分成三类基本场景：首次使用还没有数据、用户操作后的确认、以及错误处理。首用那一类它额外给了三条替代路线 —— 行内说明、引导流程、直接塞一批 starter content 让界面先别空着。

真正值得抄的是它对 CTA 的处理：它允许三种放法 —— 文案下方放主按钮、把主动作写成文案里的行内链接、或者**用指示线直接指向界面上那个元素**。第三种最省事也最有效，因为它顺手教会了用户「以后东西从哪进来」。文案上它还给了一句很实用的取舍：「Start by adding data assets」比「You don't have any data assets」更像人话。

另一条常被忽略的是对齐：空状态的所有元素应该**作为一个块左对齐**，唯一的例外是小 tile —— 这种情况下图居中，文字和按钮仍然左对齐。所有东西一律居中，正是很多后台「空得发慌」的直接原因。

**你能偷的**：把「创建」按钮换成一根指向工具栏加号的箭头。少一个按钮，多一次教学。

### ② Atlassian Design · Empty state

Atlassian 把空状态的**语气**也分了档：第一次打开一个空白看板，用激励或教学的语气；把任务全部清完，用庆祝的语气；搜索无结果，用中性语气但依然给下一步。插画上它只做 spot（小而具体的单场景），并额外提醒一句：隐喻可能过不了跨文化这一关 —— 一张「打开的金库」换一种语言可能什么都不是。无障碍要求也很干脆：插画如果承载信息就给 alt，纯装饰就不给 alt，或者干脆别放。

**你能偷的**：按「第一次 / 清完了 / 搜不到」写三版文案，别共用一句「暂无数据」。这三句话的差别，比换三张插图有用得多。

## 03 · 两个能立刻用的

**PatternFly EmptyState（v6）** —— 开源组件，React、HTML、CSS 变量三套都有。它的价值在于那张现成的映射表：七种场景用哪个图标、什么颜色、文案区多宽，全都写在源码和文档里。不用照抄视觉，直接把 `21.875rem / 25rem / 37.5rem` 和那四个状态色搬进你自己的 token 就够了。

**Who Can Use** —— 输入前景色和背景色，它给出在不同色觉类型下这组配色的对比度与可辨识度分布。拿 `#C9190B` 和 `#486B00` 跑一遍：如果结果显示「错误」和「成功」只靠颜色在区分，那就必须在图形或文案上再加一个冗余通道 —— 颜色永远不该是唯一的信息载体。

## 🎯 今天动手（10 分钟）

截下产品里三个空屏排成一行，逐个判断它属于「还没做」还是「坏了」。**凡是标「坏了」的那个**，把图标色从灰改成 `#C9190B`，标题从「暂无数据」改成能说清原因的句子（比如「这批日志查不到，可能是时间范围选错了」），下面留一个「重试」。

十分钟够用。如果改到标题那一步你说不出原因，那说明后端的错误路径根本没把话说清楚 —— 那才是这个空屏真正的问题，跟插画无关。

---

### 参考来源

1. [NN/g · Kate Kaplan · Designing Empty States in Complex Applications: 3 Guidelines](https://www.nngroup.com/articles/empty-state-interface-design)（2021-09-19）
2. [Carbon Design System（IBM）· Empty states](https://carbondesignsystem.com/building-blocks/core/patterns/empty-states)（含三类场景、三选一 CTA、左对齐规则；更新于 2026-08-11）
3. [Atlassian Design System · Empty state — Usage](https://atlassian.design/components/empty-state/usage)（spot 插画禁止缩放、语气分档、alt 规则）
4. [Atlassian Design System · Illustrations 总览](https://atlassian.design/foundations/illustrations)
5. [PatternFly（Release 6.7.0）· Empty state — Design guidelines](https://www.patternfly.org/components/empty-state/design-guidelines)（Icon / Color 映射表、四档尺寸、文案宽度建议）
6. [PatternFly · empty-state.css](https://cdn.jsdelivr.net/npm/@patternfly/patternfly@6.7.0/components/EmptyState/empty-state.css)（`--MaxWidth` 21.875rem / 25rem / 37.5rem；icon 字号 2xl → 3xl）
7. [Who Can Use · 不同色觉类型下的配色对比度与可辨识度检测](https://www.whocanuse.com/)

> 文中 `#8A8D90` / `#C9190B` / `#486B00` 三个色值取自 PatternFly 设计文档的图标配色说明；其 v6 实现已改为 design token，实际取值以 token 为准，请勿直接把文档页的十六进制当作最终值。350 / 400 / 600px 三档为源码中 `--MaxWidth` 的换算值（1rem = 16px）。本期不复制任何设计系统的插画素材，仅作评述引用。
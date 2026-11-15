---
title: "审美补给站 #027：bento 不是风格，是四个数字"
description: "bento 的辨识度不来自「大小不一」，而来自三个同时成立的条件：20–28px 大圆角、全局唯一 gutter、180px 固定行高。而真正被抄走一半的是 grid-auto-flow: dense —— 它补上洞，也把源码顺序和视觉顺序拆开了。附 Apple 的动效配额规则、Amie 的 span 优先级、两个能立刻上手的工具，和十分钟做完的验收动作。"
date: 2026-11-15
tags:
  - "🎨 审美补给站"
  - "布局"
  - "CSS Grid"
---

先把 bento 从"日本便当盒"这个比喻里拽出来。它在 CSS 里其实只有四行有效声明。Superdesign 给出的可复制配方是 **grid-template-columns: repeat(4, minmax(0, 1fr))**、**grid-auto-rows: 180px**、**gap: 16px**、**border-radius: 24px**，再补一条 **grid-auto-flow: dense**。四个数字各管一件事，缺一个效果就散。

## 01 · 四个常数，一个开关

**4 轨**是最少的"够用"数：2×1 和 1×1 两种跨度能拼出足够多的组合，又不会碎成 8 栏那样必须逐格规划。**180px 行高**是硬常数 —— 跨度只有在行高固定时才成立；如果行高是 auto，2×2 的格子会随内容高低各自撑开，同一行两个格子高度对不齐，"托盘感"当场消失。**16px 缝**必须是全局唯一值：一旦同时出现 16 / 24 / 32 三种间距，它就不再是便当盒，只是排得比较密的卡片区。

圆角这条最反直觉：**20–28px 是它的签名**，低于 16px 视觉上会退回普普通通的卡片墙。所以 bento 的辨识度从来不是"大小不一"，而是"大圆角 + 均匀缝 + 固定行高"这三件同时成立。

那个 **minmax(0, 1fr)** 里的 0 也不是装饰。裸写 1fr 时，轨道的最小尺寸是 auto，一条超长 URL 或一段不换行的代码就能把某一轨撑爆，整块布局横向溢出。写成 minmax(0, ·) 等于给轨道装了个泄压阀。

### 真正被抄走一半的，是那个 dense

**grid-auto-flow: dense** 的工作是把跨格留下的洞，用后面尺寸更小的格子填上。不填，2×2 旁边就挂着一块难看的空白。但它填洞的方式是**重排**：格子的视觉位置不再由 DOM 顺序决定。于是会出现一种很典型的故障 —— 鼠标点过去的位置是对的，Tab 键却走出一条交叉折返的路线。

W3C 有一条技术叫 [C27：让 DOM 顺序与视觉顺序一致](https://www.w3.org/WAI/WCAG22/Techniques/css/C27)，它对应的正是 1.3.2（有意义的顺序）和 2.4.3（焦点顺序）这两条 A 级标准。dense 不是不能用，用法是两条：① DOM 顺序先按你要的视觉顺序写，dense 只当兜底填空；② 或者干脆用 grid-template-areas 显式命名，把顺序写死，让"画出来的格子"和"读到的顺序"是同一份东西。

> **值得注意**：180px 固定行高遇上每个格子的 overflow: hidden（为了裁切贴边的圆角图片），手机上会变成一个静默的坑 —— 单列时任何需要更高内容的格子都被裁掉，而且没有任何报错。480px 以下把 grid-auto-rows 放回 auto、所有 span 归零，是这份配方里唯一不能省的 media query。

## 02 · 两个 pick：动效配额与 span 优先级

bento 在 2026 年不是热点，是沉淀。Superdesign 统计了他们自家 1–6 月的 **20.8 万次**真实生成：提到 bento 的提示词占比从 1 月的 1.55% 掉到 6 月的 0.91%（6 月为当月截至），涉及 **1,711 个**独立项目、2,867 次提及。泡沫退了，剩下的页面是真的需要它。（该数据来自工具自家样本，属弱证据级的趋势参考。）

### ① Apple · MacBook Air「Get the highlights」

五块混合尺寸的圆角格，每格只说一件事，格子数量被压在 5 个 —— 而不是把十二个卖点塞成十二格。真正值得抄的是**动效配额**：只有 hero 格（那块大格）在滚动时有轻推动作，1×1 的格子一律静止。这是把动效当成稀缺预算来分配，跟 span 挂钩，而不是给每个格子都加一个 hover 抬起。

**你能偷的：** 定一条规则 —— 只有 span ≥ 2 的格子允许动，其余全部静止。这一条比任何"微交互指南"都更能让一屏看起来是被人设计过的。
[apple.com/macbook-air](https://www.apple.com/macbook-air/)

### ② Amie · 格子尺寸就是优先级

Amie 的顺序是反过来的：先排功能优先级，再让 span 去跟随。日历拿大格，聊天的动作收成小格。所以它的不对称读起来像一句判断，而不是一次排版练习。

**你能偷的：** 把功能列成一张清单，按"用户一周点几次"排序；只有前 20% 配 2×2，其余一律 1×1，排不进前三档的直接不放进这一区。这就是 uxskill 那篇批评里说的**删除测试**：抽掉任意一格，如果这一区读起来完全没变，那尺寸从来没在承载信息，它只是装饰。
[amie.so](https://www.amie.so/)

> **反常识**：各种"bento 案例"榜单里点名最多的 Linear、Vercel、Cursor、Notion、Framer，Superdesign 逐一实机核对后指出：它们目前的首页都不是 bento。真正在用的是 Apple、Raycast、Amie、GitHub Copilot —— 参考对象和转发量从来不是同一批。

## 03 · 两个能立刻上手的工具

**① Layoutit Grid**（[grid.layoutit.com](https://grid.layoutit.com/)）—— 拖格子直接生成 grid-template-areas 和对应 CSS。它的好处恰好对着今天的议题：你画出来的位置就是源码里的顺序，天然绕开 dense 那个坑。适合把一张已经画好的 bento 稿，快速落成可读的 CSS。

**② DevTools 的 Grid 徽章**（不用装东西）—— Elements 面板里给 grid 容器点亮 grid 徽章，Layout 面板勾上 Show track sizes 和 Show line numbers，轨道尺寸与线号会直接叠在页面上；核对"4 轨 / 180px 行"到底有没有生效，比读代码快十倍。再顺手按 Tab 从第一格走到最后一格，焦点顺序和视觉顺序是不是同一条线，几秒钟就能看出来。

## 🎯 今天动手（10 分钟）

1. **做一次删除测试** —— 打开手上任意一个卡片区，抽掉你认为最不重要的那一格。如果这一区读起来完全没变，说明尺寸没在承载信息，先把尺寸种类从 5 种砍到 2 种。
2. **换上四个常数** —— gap 统一 16px、radius 统一 24px、grid-auto-rows 固定 180px、列宽用 minmax(0, 1fr)。截一张图对比改前改后，看"托盘感"有没有出现。
3. **拿掉 dense，按 Tab 走一遍** —— 记下焦点顺序。如果它和视觉顺序不一致，改 DOM，不要改 CSS —— 这就是 C27 那条标准在真实项目里的样子。

---

**参考来源与作品链接**

1. [Superdesign · Bento Grid: CSS and Tailwind Recipe, Real Examples and Limits](https://superdesign.dev/styles/bento-grid)
2. [W3C WAI · C27: Making the DOM order match the visual order](https://www.w3.org/WAI/WCAG22/Techniques/css/C27)
3. [W3C WAI · Understanding SC 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
4. [MDN · grid-auto-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)
5. [MDN · CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
6. [Apple · MacBook Air 产品页「Get the highlights」](https://www.apple.com/macbook-air/)
7. [Amie · amie.so](https://www.amie.so/)
8. [Raycast · raycast.com](https://www.raycast.com/)
9. [uxskill · Why every AI UI reaches for the bento grid（2026-05-29）](https://uxskill.laithjunaidy.com/blog/ai-bento-grid-overused.html)
10. [Layoutit Grid](https://grid.layoutit.com/)

*作品仅作评述引用，素材版权归原作者。*
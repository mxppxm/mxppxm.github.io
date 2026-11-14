---
title: "审美补给站 #026：滚动时间轴上，duration 已经不管用了"
description: "10 月 27 日 Firefox 159 默认打开滚动驱动动画，当天成为 Baseline。但在滚动时间轴上 animation-duration 彻底失效，真正决定手感的是 animation-range 里那两个百分比 —— 同一组 keyframes 能读出「一露头就播完」和「用掉旅程前 1/4」两种性格。附 NRK 逐字标题的 30–70% 窗口、Karl Koch 把 20px 收到 12px 的原因、两个可视化工具，和十分钟能做完的验收动作。"
date: 2026-11-14
tags:
  - "🎨 审美补给站"
  - "CSS"
  - "动效"
  - "滚动驱动动画"
---

**TL;DR**

- **没有新语法，只有一个旋钮失效。** 同样的 `@keyframes`，只把驱动源从毫秒换成滚动距离；`animation-duration` 从此不控制快慢。
- **手感全在 `animation-range`。** `entry 100% exit 100%` 是「一露头就播完」，`cover 0% cover 25%` 是「用掉旅程前 1/4 就停」，同一组 keyframes 读出两种性格。
- **位移必须缩水。** Karl Koch 的 JS 版 reveal 用 20px，换成 CSS 滚动版只留 12px。

## 01 · 换的不是动画，是时钟

滚动驱动动画**没有新语法**：原来的 `@keyframes`、`animation` 简写、`fill-mode` 全部照用，只把驱动源从「过了多少毫秒」换成「滚了多远」—— `animation-timeline: scroll()` 挂在滚动容器的进度上，`view()` 挂在元素自己在视口里的那段旅程上。[1] 2026 年 10 月 27 日，Firefox 159 默认打开了它，当天就成了 **Baseline**；Can I use 上 `view()` 的全球覆盖率是 89.12%。[8]

### duration 断电了，谁来接？

普通动画里，`animation-duration` 和一条 `cubic-bezier` 是两个手感旋钮。到了滚动时间轴，第一个**直接断电**：进度只由滚动位置决定，写 1s 还是 10s 都一样。但 Firefox 仍要求一个非零值才应用动画，所以社区写 `1ms`，或直接 `animation-duration: auto`，让时长铺满 timeline 的范围。[5]

接替它的是 `animation-range`。规范给了四个命名区间：`cover` 是进入视口到完全离开的全程，`contain` 是完全可见那段，`entry` 是进场，`exit` 是出场。写法是「区间名 + 百分比」，比如 `cover 0% cover 25%`。[2]

| 区间 | 写法 | 含义 |
|---|---|---|
| `cover` | `cover 0% cover 100%` | 全程，最长的映射 |
| `contain` | `contain 0% contain 100%` | 只在完全可见时动 |
| `entry` | `entry 0% entry 100%` | 摊满整个进场过程 |
| `exit` | `exit 0% exit 100%` | 出场，常用于视差与遮挡 |

三个真实取值，档位差别有多大一目了然：**NRK 的 `entry 100% exit 100%`** 把起止钉在同一点，区间趋近于零，元素一露头就播完，读起来像「瞬间出现」；**Karl Koch 的 `cover 0% cover 25%`** 只用掉旅程的前 1/4，剩下 3/4 完全静止；**通用写法 `entry 0% entry 100%`** 把进场铺满，最温柔也最容易显慢。[4]

### 两个会静默失效的坑

一是 `animation` 简写会把 `animation-timeline` 重置成 `auto`，却又设置不了它 —— 所以必须写在简写**后面**，否则静默失效，动画照旧按真实时间跑。[3] 二是滚动时间轴**双向**，往回滚就倒放，IntersectionObserver 时代「只播一次」的直觉要扔掉。

> **可以抄走的一套参数**
>
> ```css
> .reveal {
>   animation: reveal linear both;
>   animation-duration: auto;
>   animation-timeline: view();
>   animation-range: cover 0% cover 25%;
> }
> @keyframes reveal {
>   from { opacity: 0; transform: translateY(12px) }
>   to   { opacity: 1; transform: none }
> }
> ```
>
> `linear` 不是偷懒：滚动本身已经带加速度，再叠一条曲线就是双重缓动。

## 02 · 作品 pick：一个做戏剧，一个做克制

两个案例的取值几乎相反，判断却是同一条：**把动画预算压在元素完全站定的中段**。

### ① NRK《Sjukt sjuke》：让标题逐字变形

**好在哪。** 挪威广播公司 NRK 的视觉故事团队把滚动动画做进了内容系统 —— Sanity CMS 里集成工具，设计师用「起止位置的视觉提示 + 实时预览」就能做。落到《Sjukt sjuke》这篇讲病休率的报道，标题被拆成每字母一个 `<span>`，用 `new ViewTimeline({ subject: heading })` 建轴，每字母一份不同的 `scale` / `rotate` 数组，`rangeStart: "contain 30%"`、`rangeEnd: "contain 70%"`，缓动 `ease-out`。[4]

**你能偷什么。** 第一，**30%–70% 这个窗口**：只在完全可见的中间 40% 里让字母动，头和尾静止 —— 元素刚露头、快离开时注意力根本不在那儿，动作放那里等于白烧。第二，**逐字母参数数组**：成本比调十次 easing 低，读起来却像活的。另外那段代码第一行是守卫 `if (window.matchMedia('print, (prefers-reduced-motion: reduce)').matches) return;` —— 动效是装饰，不是信息。

### ② karlkoch.me：全站 reveal 只用两个属性

**好在哪。** Karl Koch 自己站点的段落入场只有五行 CSS，动的只有 `opacity` 0→1 和 `translateY` 12px→0。范围 `cover 0% cover 25%`，理由他写得很直白：**结束得够早，才不挡路**。缓动写 `linear` 而非 ease-out —— 加另一条曲线会改变效果跟随输入的紧密程度。[5]

**你能偷什么。** 那个位移值。他原来的 JS 版（IntersectionObserver + transition 0.6s）用 **20px**，换成 CSS 滚动版只留 **12px**。这不是审美偏好而是机制差异：滚动版是**连续映射**，位移会被拉长成一段持续可见的滑动；JS 版一次性触发，20px 在 600ms 里一闪就过去。同一句「上浮一点点」，两种时钟要两个数字。

## 03 · 两个能立刻用的工具

**① View Timeline Ranges Visualizer** —— Google Chrome 的 Bramus 做的演示站 [scroll-driven-animations.style](https://scroll-driven-animations.style/) 上有三个可视化工具（Scroll Timeline Progress、View Timeline Progress、View Timeline Ranges）。用第三个最省事：改一改 range 字符串，看色块覆盖的区间当场变形，比在脑子里算百分比快十倍。站上还有 10 集免费视频课和一份 polyfill。[6]

**② Scroll-Driven Animations Debugger** —— Chrome DevTools 扩展，商店里 5.0 分、约 2000 名用户。[7] 专治「我写了，但什么都没发生」：把时间轴和元素的可视进度画在 DevTools 里，一眼判断是 range 写空了、还是 `animation-timeline` 被简写重置了。

## 🎯 今天动手：把 12px 改成 24px，再滚两遍

1. **挑一屏有内容的 section** —— 不是 hero，是正文段落块，给它加 `.reveal` 类名。
2. **贴进上面那五行 CSS** —— `cover 0% cover 25%`、`translateY(12px)`，先确认它真的动了。
3. **在 DevTools 里改成 24px** —— 来回滚两遍，再开手机模拟器快速 swipe。通常 24px 会糊成拖影：这就是连续映射在收你的税。

---

**参考来源**

1. [MDN · animation-timeline（Baseline 2026）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
2. [MDN · animation-range（cover / contain / entry / exit）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range)
3. [richi.codes · Scroll-driven animations are Baseline at last · 2026-11-04](https://richi.codes/article/2026-11-04-scroll-driven-animations-are-baseline-at-last)
4. [Johannes Odland & Harry Theodoulou · How NRK uses scroll-driven animations · Chrome for Developers 2025-02-26](https://developer.chrome.com/blog/nrk-casestudy)
5. [Karl Koch · On scroll-driven reveals · karlkoch.me 2026-04-13](https://karlkoch.me/writing/on-scroll-driven-animations)
6. [Bramus · Scroll-driven Animations（demos + 三个可视化工具 + 10 集视频课）](https://scroll-driven-animations.style/)
7. [Bramus · Scroll-Driven Animations Debugger · Chrome Web Store](https://chromewebstore.google.com/detail/scroll-driven-animations/ojihehfngalmpghicjgbfdmloiifhoce)
8. [Can I use · animation-timeline: view()（全球使用率 89.12%）](https://caniuse.com/mdn-css_properties_animation-timeline_view)
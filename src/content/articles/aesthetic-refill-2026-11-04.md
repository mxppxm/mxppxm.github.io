---
title: "审美补给站 #016：三十年里唯一没人设计过的那块屏幕"
description: "Safari 27 在 9 月 14 日补上 appearance: base-select，原生下拉菜单第一次交出它的四个零件。附两条声明、三条 HTML 硬边界、一组动效参数（180ms / cubic-bezier(.2,.9,.3,1) / scale .96→1），以及为什么它离 Baseline 还很远。"
date: 2026-11-04
tags:
  - "🎨 审美补给站"
  - "交互设计"
  - "CSS"
---

过去十几年，前端对付 `<select>` 只有两条路：`appearance: none` 把按钮的皮扒掉，然后祈祷弹层别太丑；或者用 div 从零重造一个下拉框，再把键盘导航、屏幕阅读器播报、iOS 上的原生滚轮全部重写一遍。弹层不归 CSS 管，是这件事的根。

9 月 14 日，Safari 27 发布，补上了 `appearance: base-select` 和 `<selectedcontent>` 元素——Chrome 与 Edge 从 135 起就有。这是第一次，「系统画的那一块」交到设计师手里。

## 01 · 四个零件、三条硬边界、一组动效参数

**两条声明，少一条就白干。** opt-in 不是一行。CSS Form Control Styling Level 1 写得很直接：`::picker()` 要被渲染，它和它的 originating element 的计算 `appearance` 都必须是 basic appearance。

```css
select,
select::picker(select){ appearance: base-select; }
```

只写第一个的结果是——按钮完全听你的，弹层还是那个 2007 年的灰盒子，半像你的产品，半像 Windows。

之后你手上只有四个东西：

| 选择器 | 是什么 |
|---|---|
| `select` | 闭合态的按钮本身 |
| `select::picker(select)` | 弹层容器 |
| `select::picker-icon` | 那个箭头，`::after` 之后的生成元素，内容由 `content` 控制 |
| `option:checked::checkmark` | 勾 |

想删箭头用 `content: none`，别用 `display: none`。

**三条硬边界，全在 HTML 标准里，不是浏览器 bug。**

一，`option` 里禁止交互内容。不能放 `a`、`button`、`input`，也不能有带 `tabindex` 的后代。带文字的 `<div>` 是允许的——这就是做「头像 + 姓名 + 邮箱」两行选项的合法出口：`div` 加 `img`，不是 `button`。

二，`label` 属性不会被 `<selectedcontent>` 反射。`<option label="Australia">` 在弹层里显示 Australia，在按钮里显示空白。

三，`selectedcontent` 是 DOM 复制。弹层打开时，每个选项里的头像都被渲染了两次；写 `selectedcontent img { display: none }` 就能让闭合态瘦下来。

还有一条隐形的：这是可样式化的 select，不是 combobox——没有过滤、没有自由输入、没有多选面板，要搜索还是得靠库。

**动效参数。** 弹层走的是 popover 机制、进 top layer，所以 `display` 从 `none` 到 `block` 这种离散切换得靠 `@starting-style` 加 `transition-behavior: allow-discrete`（2024 年 8 月起 Baseline）。

```css
/* 推荐值 */
.picker{ transition: opacity 180ms cubic-bezier(.2,.9,.3,1),
                     scale 180ms cubic-bezier(.2,.9,.3,1),
                     display 180ms allow-discrete; }
@starting-style{ .picker{ opacity:0; scale:.96 } }
```

`180ms` · `cubic-bezier(.2,.9,.3,1)` · `scale .96 → 1` · `opacity 0 → 1` · 位移不超过 **4px**。弹层贴着触发元素，位移一大，放大那一刻就会「飞」出锚点。

**覆盖率，别自欺。** Chrome / Edge 135、Safari 27、Firefox 149 需要打开 `dom.select.customizable_select.enabled` 与 `layout.css.appearance-base.enabled` 两个 pref，而且 `selectedcontent`、`::picker(select)`、`::checkmark`、`::picker-icon` 一个都没实现。写法只有一个：所有样式塞进 `@supports (appearance: base-select)`，`<button>` 与 `<selectedcontent>` 留在 HTML 里（不认的浏览器直接忽略），并且绝不能让「邮箱」这种信息只存在于富选项内部。另外，草案里标准化的名字是通用的 `appearance: base`，`base-select` 是过渡名——把它写在一个地方，别撒进组件库。

## 02 · 作品 pick

先看一组趋势计数，来自 EXHIBITA 对获奖作品的逐年统计（11 月 3 日更新）：缩略图网格从 **14% 掉到 5%**，「真正的页脚」从 **6% 涨到 12%**，巨型标题从 **25% 掉到 15%**。三个方向同一个意思：大而无当的东西在退潮，有结构的细节在回来。

### Grids — Obys（DES Season 03）

[Awwwards](https://www.awwwards.com/sites/grids-1) 11 月 2 日 Site of the Day，7.63/10。原站：[grids03.obys.agency](https://grids03.obys.agency/)

它是一个「讲栅格的教学产品」的着陆页：17 讲、4 小时以上，2021 年第一版至今累计 60 万+ 设计师看过，现在做成第三季。**好在哪：** 它没把「构成」「视觉张力」写成段落，而是用视觉实验演示；页面本身就是论据，你滚动的时候规矩在发生，而不是在被解释。**你能偷：** 把版本号做成季——「Season 03」这种命名让一次更新变成可期待的仪式，也让旧作品不必下架；以及，任何一页「讲方法」的内容，都值得塞一个可操作的实验块。

### Unbelievably Crap — Liubomyr Ulytskyi

Awwwards 10 月 29 日 Site of the Day；CSS Design Awards 2026 年 9 月 9 日提名，UI 7.72 / UX 7.90，标签是 animated、scroll、WebGL。原站：[unbelievablycrap.com](https://www.unbelievablycrap.com/)

**好在哪：** 首屏就把评价权抢回去了——「design is dead / who killed it? / you did」。自我介绍不叫 About，叫 `CASE FILE: THE MAN BEHIND THE IMAGE`，用第三人称过去时讲自己，像在读一份案卷。源码里单词中间还夹着数字（`0looking`、`ob9vious`、`3was`）——不管是有意的视觉噪音还是防爬的字符陷阱，结果都是让你读慢半拍。**你能偷：** 用档案体代替形容词，写「他想要有脉搏的东西」比写「注重细节」有力十倍；破坏要落在字符级——一个数字、一个替换字母，那是笔迹，铺一整层纹理，那只是滤镜。

## 03 · 两个能立刻用的东西

**Twista Sans — Viktor Nübel 的 uniwidth 无衬线。** 9 月 9 日发布，是展示体 Twista 的无衬线搭档。它不是等宽（monospace）：字符依然按比例排列，但所有字形共享同一水平宽度——所以你把 `font-weight` 从 400 拉到 700，文字不会重排一个字。这对交互是白送的好处：hover、press、选中切换时改字重，按钮不会抖、标签不会跳、导航不会横向位移。[viktornuebel.com](https://viktornuebel.com/) 上有 specimen。

**modern.css 的 base-select 教程。** 一篇把按钮、弹层、勾选、降级四件事写完整的中级教程，代码可以直接抄骨架再改变量。[modern-css.com/articles/build-a-styled-select-dropdown](https://modern-css.com/articles/build-a-styled-select-dropdown/)。读完它再去翻 tempertemper 那篇 10 月 25 日的[无障碍复盘](https://www.tempertemper.net/blog/fully-customise-your-select-elements)，你会知道哪几行是「能看」，哪几行是「能用」。

## 🎯 今天动手

改一个筛选器，只改一个。打开手上任何项目，找到第一个 `<select>`，在样式表最底部加：

```css
@supports (appearance: base-select){
  select, select::picker(select){ appearance: base-select }
  select::picker(select){ border:1px solid #D5CEC2; border-radius:12px; padding:4px }
  select::picker-icon{ content:none }
}
```

然后只用键盘走一遍：Tab 进去、方向键上下、Esc 关掉。你要回答的只有一句——焦点框还在不在？规范的原话是 basic appearance 不阻止你写出不可访问的东西，所以这一步不能省。

最后把 `@supports` 那行删掉再看一眼。如果页面没有变丑，说明你写的东西本来就是原生就有的；如果变丑了，那段 CSS 就值得留在代码库里。

---

**参考来源**

1. [Kishan Sharma · Customizable select: appearance: base-select explained · 2026-09-15](https://www.kishan.design/read/customizable-select)
2. [OpenReplay · Styling a Select Dropdown With base-select · 2026-10-14](https://blog.openreplay.com/style-select-dropdown-base-select)
3. [Apple Developer · Rediscover the HTML select element（WWDC26 Session 315）](https://developer.apple.com/videos/play/wwdc2026/315)
4. [tempertemper · Fully customise your select elements · 2026-10-25](https://www.tempertemper.net/blog/fully-customise-your-select-elements)
5. [Chrome for Developers · Animate Elements To and From Top Layer](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/animate-to-from-top-layer)
6. [web.dev · Now in Baseline: animating entry effects](https://web.dev/blog/baseline-entry-animations)
7. [Awwwards · Grids — Obys，Site of the Day 2026-11-02](https://www.awwwards.com/sites/grids-1)
8. [Awwwards · Unbelievably Crap — Liubomyr Ulytskyi，Site of the Day 2026-10-29](https://www.awwwards.com/sites/unbelievably-crap)
9. [Creative Boom · The best new typefaces for October 2026 · 2026-10-27](https://www.creativeboom.com/type-drop/the-best-new-typefaces-for-october-2026/)
10. [EXHIBITA · What's hot / Trends（更新于 2026-11-03）](https://exhibita.design/)

> 所有参数、版本号、占比均来自上述链接；浏览器支持以 Browser Compat Data 与各篇原文为准。引用作品仅作评述，素材版权归原作者。
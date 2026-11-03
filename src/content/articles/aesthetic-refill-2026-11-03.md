---
title: "审美补给站 #015：满行不是对齐，是容差"
description: "Chrome 150 把「每行撑满」压成一行声明：text-fit: grow per-line-all 300%。但它只给数学等宽——真正的锁版里，右端还差着 10% 的肉眼校准。附四个参数坑、H&Co 与 Grilli Type 的两种行末收法。"
date: 2026-11-03
tags:
  - "🎨 审美补给站"
  - "字体排版"
  - "CSS"
---

把一个多行标题的每一行都撑到容器内宽，行数不变、每行字号不同，远看就是一个方正的灰块——平面设计里管这个叫 **lockup**。以前它只活在 Illustrator 里：设计师一个一个改字号。搬到浏览器就得 JS 量宽度、算缩放系数、写回 inline style；字体加载完、视口一拖、文案一改，全得重算。

Chrome 150（2026 年 6 月 30 日进稳定版）给了个原生答案：`text-fit`。它不动布局结构，只在布局阶段把文本节点**渲染出来**的字号放大或缩小到刚好贴住包含块的内宽。

## 01 · 让浏览器去算那一行

能抄的配方是这样，行距交给 grid 而不是 `line-height`：

```css
.lockup{display:grid;gap:.02em;line-height:.92}
.lockup span{display:block;white-space:nowrap;text-fit:grow per-line-all 300%}
```

HTML 侧每行包一个 `<span>`，段内不用 `<br>`。想让上下两行贴得更死，再给标题加 `text-box:trim-both cap alphabetic`，把字面上下的行距一起裁掉。

四个参数各有各的坑，按踩到的顺序记：

**一、`per-line` 和 `per-line-all` 差一个字，差一个功能。** `per-line` 会给每行算自己的缩放，但跳过最后一行、以及任何以强制断行结尾的行。如果你的每行就是一个 `span`，那它一行都不缩放，页面看起来像什么都没发生。

**二、`grow` 和 `shrink` 不能同时要。** 没理由用 `shrink` 的时候，就把基础 `font-size` 设成最小值、让 `grow` 往上顶；Chrome 的官方指南也这么建议。结尾的百分比是护栏——`grow` 只能 ≥100%，写 300% 的意思是「最多放三倍」，没有护栏时，两个字的短行会被撑到荒谬。

**三、容器必须有确定的内宽。** `text-fit` 不改变固有尺寸，所以对 `max-content`、`fit-content` 宽度和内容尺寸的 flex / grid 子项完全无效。

**四、`em` 不会跟着缩放。** 计算出的 `font-size` 不变，缩放只发生在渲染层，`em` 算出的间距一个像素都不动。同理，字一变大视觉字重就变粗，眼下没有可计算的单位能把它抵回来。

三个数先记住：**66.69%**（caniuse 记录的全球使用率，仅 Chrome / Edge 150+，Firefox 至今不认）、**300%**（grow 的护栏上限，也是我建议的默认值）、**0.92**（两行锁版能用的 line-height 上限）。

讲完参数你会发现一件事：`text-fit` 解决的是**数学**——右端像素级齐。可手艺人要的从来不是像素齐。标点悬挂（`hanging-punctuation`）让引号跑到版心外面，就是为了让「看起来」齐。齐不齐是眼睛判断的，不是 `getBoundingClientRect` 判断的。

## 02 · 作品 pick：行末的三种收法

同一天（11 月 3 日）抓了两个字体厂的首页，同一个问题——一堆长度不齐的字，右端怎么办——给了两种完全相反的回答。

### 1 · H&Co / typography.com —— 不收，让它出血

一整条 **#FFB645** 的橙带横贯视口，上面压着五行巨型窄体无衬线，字色 **#454E60**——偏冷的炭蓝灰，不是纯黑。关键在行末：五行字左右两端都跑出屏幕，被容器直接切掉，最上面那行第一个字母只剩半个。

它没打算收满。那几行是「hovercar atomized teleporter solid carbon」这类长度差不多的科幻词串，硬撑满会让每行字号差得太夸张；于是干脆全部同一个字号，用 `overflow:clip` + `white-space:nowrap` 把溢出裁掉，切出来的锯齿反而成了版面的纹理。**能偷的**：文案长短极不齐、又必须保持一个字号时，别去算，让它出血——前提是裁切线落在字中间也好看。橙带上没有任何蒙版或描边，字和橙硬碰，靠的是 `#454E60` 与 `#FFB645` 约 5:1 的明度差在撑对比度。

### 2 · Grilli Type —— 不齐就不齐，靠左端和巨图稳住

同一天的首页是另一套逻辑：左侧一列索引标签（「GT Mechanik Ministe」/「Grilli Kiosk」/「GT in Use」），在 1200px 视口里占约 245px，也就是 20%；剩下 1fr 全是图，一句正文都没有。

「Grilli Kiosk」那个两行锁版值得抠一下像素：把截图放大后量，「Grilli」行宽 225px，「Kiosk」250px，差 10%。它不是等宽锁版——两行同一字号、左端硬对齐、右端自然参差。之所以不显得散，是因为右边一整块满幅照片在兜底，而且两行的**上缘**和下缘都贴着同一套水平基准。

**能偷的**：右端参差没关系，但左端、上缘、基线必须硬。做锁版时先钉三条线，再决定要不要用 `text-fit` 抹掉右端的差；如果版心里已经有一块满幅图或满幅色块在压场，那 10% 的参差反而是好事——它让字块和图片之间有了呼吸。反过来，字块孤零零浮在空白里时，才必须靠等宽把它焊成一个方块。

## 03 · 两个能立刻用的工具

**1 · [Utopia](https://utopia.fyi)** —— `text-fit` 只管大标题。正文、行距、间距的连续缩放还得靠 `clamp()` 阶梯，而手算那堆值很烦。Utopia 让你先定两个视口（比如 320 / 1440）、两套字号比例（小屏 1.2、大屏 1.25），它直接吐出 `--step-0` 到 `--step-6` 的 CSS 变量和对应的 `clamp()`。我的用法是：**大标题交给 `text-fit`，正文和间距交给 Utopia 的阶梯**，两者不混——混着用会出现「标题在第 3 档字号上突然撑爆」的怪象。

**2 · [Chrome 的 Modern Web Guidance 指南库](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/equal-width-text-lines)** —— 写法是为 AI 编码代理准备的（语气有点机械，但正是这一点好用）。跟本期直接相关的两条：Equal-Width Text Lines（`text-fit` + `text-wrap` + `text-box` 的完整组合）和 Precise Text Alignment（`text-box:trim-both cap alphabetic` 怎么裁行距）。整段复制进 Cursor 或 Claude Code 当上下文，它写出来的 CSS 基本能一次过。

## 🎯 今天动手

1. **十分钟改一个标题。** 挑一个两行以上的标题，每行包进 `<span>`，容器写 `display:grid; line-height:.92; gap:.02em`，每行加 `text-fit:grow per-line-all 300%`。
2. **量一下，差是不是在 10% 以内。** 用 DevTools 量两个 `span` 的渲染宽度。超过 10% 说明两行字数差太多——这时候别调参数，回去改文案，把长的那行砍短。
3. **如果最窄那行被放大了 250% 以上**，同样说明文案失衡，删掉那行或者把它提到上一行。参数是护栏，不是万能药。

---

**参考来源**

1. [Chrome for Developers · New in Chrome 150 · Rachel Andrew · 2026-06-30](https://developer.chrome.com/blog/new-in-chrome-150/)
2. [Chrome for Developers · Chrome 150 Release notes](https://developer.chrome.com/release-notes/150)
3. [MDN · text-fit（CSS 属性参考，标注 Limited availability）](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-fit)
4. [Chrome for Developers · Modern Web Guidance: Equal-Width Text Lines](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/equal-width-text-lines)
5. [Chrome for Developers · Modern Web Guidance: Improve Text Layout and Legibility](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/improve-text-layout-and-legibility)
6. [Can I use · CSS property: text-fit（全球使用率 66.69%）](https://caniuse.com/mdn-css_properties_text-fit)
7. [CSS-Tricks · Fit width text in 1 line of CSS · Geoff Graham · 2025-12-09（当时的名字还是 text-grow）](https://css-tricks.com/fit-width-text-in-1-line-of-css/)
8. [H&Co · typography.com 首页（2026-11-03 截图）](https://www.typography.com)
9. [Grilli Type · 首页与 Grilli Kiosk 锁版（2026-11-03 截图，行宽为 1200px 视口下实测）](https://www.grillitype.com)
10. [Utopia · Fluid Responsive Design](https://utopia.fyi)
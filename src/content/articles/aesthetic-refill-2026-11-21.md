---
title: "审美补给站 #033：颗粒感不是滤镜，是印刷留下的错位"
description: "把 baseFrequency 从 0.8 拖到 0.6，画面上什么都没变 —— 波长只从 1.25px 走到 1.67px，真正的砂纸感在 0.1 那一头。我实拍了三档频率做对比，量清了 1÷ƒ 这条公式，也踩到那个最容易被漏掉的 isolation 陷阱：少了它，同一张卡片换个位置就变色。附两个把『印坏了』做成系统的 Riso 实践者，和一条十分钟能做完的改法。"
date: 2026-11-21
tags:
  - "🎨 审美补给站"
  - "CSS"
  - "feTurbulence"
  - "颗粒质感"
  - "Risograph"
---

「加颗粒」这件事在网上被讲坏了 —— 大多数教程就是让你叠一张 PNG。问题是 PNG 是死的：它不随元素缩放变化，不跟底色发生关系，而且一模一样地铺满，眼睛三秒就能认出这是贴图而不是材料。真正的做法只有一条路：用 `feTurbulence` 现场生成噪点，再让它跟你这个表面发生混合。

![颗粒不是盖在最上面的一层灰，而是表面 + 油墨 + 错位三者共同的结果](https://mxppxm.github.io/images/aesthetic-refill-2026-11-21.jpg)

**TL;DR**

- **波长 = 1 ÷ baseFrequency。** 0.8 是 1.25px（胶片银盐），0.08 是 12.5px（纸浆斑）；中间那一大段几乎是死区，拖了没反应。
- **8% + overlay + isolate 三个数定成败。** 少写 `isolation`，颗粒会跟页面底色串味，同一张卡片换个位置就变色。
- **两个 Riso 实践者把「印坏了」做成了系统。** 套准偏移、可见网点、裁切碎边，本来该被修掉的，被提到了版面上。

## 01 · 颗粒的三个真参数，以及一个必须加的隔离层

### 参数一：baseFrequency 是频率，不是强度

很多人把它当「颗粒粗细的强度条」拖，其实它是**空间频率**：波长 = 1 ÷ baseFrequency，单位是像素。所以 0.8 对应 1.25px 的颗粒，接近胶片银盐；0.55 对应 1.8px —— 和 1.25px 在屏幕上几乎没有区别，这就是你拖动滑块觉得「没反应」的原因。想真的变粗，得往 0.08–0.2 走，波长 5–12.5px，那才是纸浆斑、水彩纸的那种感觉。

![同一段 feTurbulence，只改 baseFrequency 的三档实拍对比](https://mxppxm.github.io/images/aesthetic-refill-2026-11-21-fig2.jpg)

三档分别是 `0.08`（纸浆斑，波长 12.5px）、`0.80`（胶片颗粒，1.25px）、`1.60`（数字噪点，0.6px），其余参数全部固定：numOctaves 3、stitchTiles=stitch、混合 multiply 30%、底 #F7F2EA。可以看出左侧是「材料」，中间是「胶片」，右侧已经开始像压缩噪点了。

### 参数二与三：8%，以及 overlay

参考站 Craft 的 Noise 条目给的两个默认值可以直接抄：**不透明度 0.08**、**mix-blend-mode: overlay**。8% 是「像纸」和「像脏屏幕」的分界线，超过 12% 在深色底上就开始糊。混合模式里 overlay 最稳 —— 中性灰不动、只推对比；soft-light 在浅底上几乎看不见；multiply 只会往下压，浅色会发浑。

最容易被漏掉的一行是 **`isolation: isolate`**。不加它，overlay 会把颗粒跟你页面背景一起混 —— 同一张卡片放在浅底上是一种颜色，挪到深色区域就变成另一种。加了它，颗粒只跟自己所属的那个表面混合。

### 性能那笔账：别在全屏容器上开滤镜

feTurbulence 是逐像素算的，元素一重绘就重算。几百像素的卡片你永远感觉不到，但铺满整屏的 hero、尤其是跟着滚动动画一起动的，在手机上能掉到个位数帧率。解法是把噪声**栅格化一次再平铺**：200×200 的 SVG 塞进 data URI，`background-repeat` 铺开，浏览器第一次画完就再也不算了。代价是 baseFrequency 被烘焙进贴图、不能实时调 —— 静态颗粒无所谓。

## 02 · 两个作品：把印刷的瑕疵当资产

如果颗粒只是「质感」，那它是装饰。但如果颗粒来自工艺的**不可控**，它就变成了系统的一部分。下面两个人都在这条线上工作。

### ① Gülnara Safina — Risoisoclub 视觉系统（莫斯科）

**好在哪。** 她把 Risograph、蓝晒、拼贴这三种「一定会出错」的工艺，压在一套很硬的编辑网格上。研究的题目本身就是错误、偶然与材料的不可预测性 —— 所以她的版面里，套准标记、裁切碎边、色块残片这些通常被裁掉的东西，被直接提到了台面上当系统元素用。《It's Nice That》2026 年度 Ones to Watch 入选者，作品为 Riso 与模拟印刷俱乐部的识别系统。

![套准标记本来是给印刷机对位用的十字靶，错位就是废品](https://mxppxm.github.io/images/aesthetic-refill-2026-11-21-fig3.jpg)

**你能偷什么。** 把你的设计系统里**被隐去的那一层**翻出来：网格线、基线、色标条、裁切线。做法上给三条约束：全案色值 ≤ 4（含 100% 黑）；装饰层的叠印不超过 3 层；装饰元素与正文共用同一套栅格，错位量控制在「看得出但读不出」的程度（印刷里套准误差常在零点几毫米，换算到屏幕约 1–2px）。

### ② Valeria Homayden — Field Notes for Wonder（2026 年 7 月）

**好在哪。** 两部分：一组逐帧的 Riso 动画，加一本口袋大小的田野指南。她没修掉印刷的套准偏移和可见网点 —— 那些瑕疵反而成了「这是印出来的」的证据。她自己的说法更狠：亮色把图像抽象掉了，所以你**先看到形状和图案，才认出物体**。书是一跨页只放一个想法，翻页本身就是节奏。

**你能偷什么。** 两条。一是**颗粒要动**：真实的胶片颗粒每帧都在跳，静态噪点图层永远差一口气，实现上不需要 JS —— 用 `steps()` 每秒跳 8 次左右，位移 1–2px，就足够像了。二是**一跨页一个想法**：屏幕上等价于「同一时刻只允许一个视觉焦点」，其余全部降级成背景。

## 03 · 工具与素材：两个能立刻复制的生成器

1. **Craft · Noise**（craft.gustavofior.com/noise）。一个可拖动的实时预览：opacity 与 baseFrequency 两根滑块，下面直接给 React、Tailwind、纯 CSS 三份代码。它的价值不在于好看，而在于正文里那两条注释（为何必须 isolate、为何全屏要改成平铺）—— 大多数教程不提。免费、免登录。
2. **we.inc Noise Texture Generator**（we.inc/tools/noise-texture-generator）。可以调 type、frequency、octaves、seed 四个参数，输出几百字节的 SVG 代码，全程在浏览器本地跑、不上传。需要平铺 PNG 而不是代码时，Beryldesign 那 8 张无缝颗粒更省事（注册免费，商用看授权）。

三个值得先记下的数：**8%** 是颗粒不透明度的起点，12% 是上限；**1/ƒ** 是波长公式，单位 px；**200px** 是全屏场景的平铺贴图边长。

## 04 · 今天动手：给一张卡片加 8% 颗粒

十分钟，四步，不需要装任何东西。顺序别跳：**先能看出差别，再谈调参**。同一张卡片、同一段文字，一个底下是纯色、一个是柔和的纸黄，8% 的颗粒在两者上的存在感完全不同 —— 浅底上它读起来像「印得干净的老纸」，深底上它才变成「没打匀的墨」。所以第四步的 A/B 不是形式主义：它决定了你以后在深色主题里要不要把 opacity 往下压到 5%。

还有一条反向经验：**如果同事说不出哪里有区别，就说明你做对了**。颗粒的第一个正确反馈是「这页好像不那么假了」，而不是「哇这有颗粒」。一旦有人指着屏幕说「你加了噪点吧」，通常意味着 opacity 已经越过 12% 那条线。

1. **先把滤镜藏进页面。** 复制一段 `<svg width="0" height="0">` 里包着的 filter：feTurbulence（fractalNoise / 0.8 / 3 / stitch）+ feColorMatrix（saturate 0）。
2. **卡片开隔离。** 给容器加 `position:relative; isolation:isolate; overflow:hidden`。这一步是防止串味的开关。
3. **铺一层 8%。** 用 `::after` 撑满 `inset:0`，写 `filter:url(#grain); opacity:.08; mix-blend-mode:overlay; pointer-events:none`。
4. **做 A/B 验证。** 把卡片同时放到浅底和深底区域，确认两边颜色没有被「串味」；再把 baseFrequency 改到 0.15，看它从胶片变成砂纸。

## 参考来源

1. [Gustavo Fior · Noise（Craft 条目，含 opacity 8% / baseFrequency 0.80 / isolate / 平铺性能说明）](https://craft.gustavofior.com/noise)
2. [MDN · baseFrequency（SVG 属性参考，频率以用户坐标系为单位）](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/baseFrequency)
3. [Codrops · SVG Filter Effects: Creating Texture with feTurbulence（Manuel Matuzović，2019-02-19）](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence)
4. [It's Nice That · Ones to Watch 2026: Gülnara Safina（Riso / 蓝晒 / 拼贴与编辑系统）](https://www.itsnicethat.com/ones-to-watch-2026-showcase/gulnara-safina)
5. [It's Nice That · Valeria Homayden: Field Notes for Wonder（Ellis Tree，2026-07-27）](https://www.itsnicethat.com/articles/valeria-homayden-field-notes-for-wonder-graphic-design-project-270726)
6. [we.inc · Noise Texture Generator（frequency / octaves / seed 可调，本地运行）](https://we.inc/tools/noise-texture-generator)
7. [CodeFronts · Grain & Noise Texture Overlay（steps() 每秒 8 次的动态颗粒实现）](https://codefronts.com/motion/css-background-animations/grain-and-noise-texture-overlay/)
8. [Beryldesign · Seamless grain textures（8 张无缝颗粒贴图）](https://www.beryldesign.fr/en/resource/seamless-grain-textures)
9. [Awwwards · Texture 网站合集（材质类站点参考）](https://www.awwwards.com/websites/texture)

---

*文中参数均来自可查来源或本机实测；示意图为自绘，不复制任何他人作品素材。引用作品仅作评述用途，版权归原作者。*

*第 #033 期 · 2026-11-21 ·《审美补给站》· 由 clacky 自动整理 · 每日更新。*
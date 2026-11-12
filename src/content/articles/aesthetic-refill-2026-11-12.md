---
title: "审美补给站 #024：颗粒的两档剂量，一档修 bug，一档做材质"
description: "2–6% 是给 8-bit 屏幕打的补丁，你看不见它；10–25% 才是能摸到的纸，中间那档最尴尬。附 feTurbulence 的四个参数、两个会让人查半天的层叠上下文坑、Sigri 那个诚实的 6% canvas，以及一个把颗粒算进油墨覆盖率里的 riso 引擎。"
date: 2026-11-12
tags:
  - "🎨 审美补给站"
  - "质感"
  - "CSS"
  - "印刷"
---

**TL;DR**

- **颗粒只有两档是对的剂量。** 2–6% 治渐变断层，标准是"你调出来看不见"；0.1–0.25（10–25%）才是材质。中间地带是赌运气。
- **别把 `feTurbulence` 挂在 `filter` 上。** 用伪元素 + 一个几百字节的 SVG data URI，只留 `opacity` 一个旋钮；顺手记得 `numOctaves` 超过 4 是白烧。
- **颗粒要挂在文档上，不是视口上。** `position: fixed` 会让它读成一层屏幕滤镜；`absolute` 挂在内容里才读成纸。

## 01 · 颗粒的两档剂量，和那条分界线

先说清楚颗粒为什么有用。渐变的"断层"（banding）不是浏览器的 bug，是 8-bit 色彩管线在坦白自己的家底：每个通道 256 级，一条跨 30 个色阶、铺满 1200px 的渐变，平均**每 40 像素才允许差一级**。人眼对边缘极度敏感，于是每一级台阶都被看成一条线。加噪点的作用叫抖动（dithering）：让落在台阶边界上的像素随机往两边掉一级，边界被打散成过渡，也就没有边可看了。

### 剂量表：两个数字，一条缝

- **2–6% 的 `opacity`：抗断层。** 唯一验收标准是"你关了它才看得出差别"。这一档的颗粒是功能件，不是审美件。看到噪点，就是加过头了。
- **0.1–0.25（即 10–25%）：材质。** 这一档你本来就该看见它，它承担的是"这不是一块纯色塑料"的叙事。

6% 到 10% 之间那段是雷区：浓到会在深色背景上显脏、在浅色背景上像屏幕脏了，又淡到不足以被读成"质感"。要么藏起来，要么摊开，别在中间赌。

### 实现：一个伪元素，一段 data URI

网上流传最广的做法是给元素加 `filter: url(#grain)`。这是错的工具：live filter 会在**每次重绘**时重算整张图，而且作用于元素的全部子内容——你的正文文字也会被一起噪化。正确做法是把噪声当一张图片：SVG 写成 data URI，挂到伪元素的 `background-image` 上，一次栅格化、之后缓存、重绘免费，只有几百字节。

**四个参数就够：**

- `type='fractalNoise'` —— 别用 `turbulence`：它取各层绝对值相加，值堆在零附近、翻出处带锐脊，画出来是大理石纹，不是砂。
- `baseFrequency='0.65'` 附近是像素级砂，`0.6–0.9` 都可以，`0.02` 就变成缓慢的云。
- `numOctaves='3'` —— 到 4 还是有机的，再往上每层都要全图跑一遍，而增量已经低于可见阈值。
- `<feColorMatrix type="saturate" values="0"/>` —— `feTurbulence` 连 alpha 通道一起噪，不脱色出来的是彩色纸屑。

为什么不用 PNG 贴图？因为它不便宜也不一定更准：PNG 靠"邻域可预测"来压缩，而随机噪声按定义没有可预测的邻域，一张 512×512 的灰度噪声 PNG 能到几百 KB，SVG 版是几百字节。更要命的是高 DPI —— 一张 1× 的噪声图在 2× 屏上被拉成 2×2 的方块，颗粒立刻变粗变糊；SVG 没有这个问题。

还有两个会让人查半天的坑。第一，`mix-blend-mode` 是与**最近层叠上下文**的背景混合，父级只要有 `opacity`、`transform`、`filter` 或 `isolation: isolate`，颗粒就会混到"空"上去、瞬间塌成一片灰；渐变和噪点在同一元素上时，用 `background-blend-mode` 可以绕开。第二，混合模式改的是**性格**不是**剂量**：`overlay` 保留中灰、把亮暗推开但不动色相，`soft-light` 是它温和版，`multiply` 只压暗、颗粒沉进阴影里像印在纸上，`screen` 只提亮、颗粒浮在高光里像胶片灰。剂量的事，永远先调 `opacity`。

## 02 · 作品 pick：一个诚实的 6%，和一个被算出来的 18%

### ① Sigri —— 6% 的 canvas，和一次体面的技术撤退

设计师 Aditya Jain 给自己的站 [origin.sigri.com](https://origin.sigri.com/) 写了一篇技术笔记，把底牌全摊了：整站底色是 `#ffb700` 的实心黄，噪点是一整块随文档高度的 canvas，每个像素填随机灰度、alpha 给到 `15/255` —— 也就是他自己说的 **约 6%**，正好落在"抗断层"那一档。第一版他用 GLSL 写：一个 `hash()` 把坐标搅成 0–1 的值，塞进 RGB 三通道，`alpha 0.06`，配 regl 大约四十行。

然后他发现自己干了什么：这张噪点只在挂载和 resize 时各画一次，整个页面生命周期里 shader 只跑两次。为一个静态效果付一个 WebGL context、一次着色器编译、约 38KB 的 regl 运行时，是"用 CNC 铣床裁一张纸"。换成 Canvas 2D 的 `putImageData`，二十行，3000 万像素的页面首次绘制约 100ms，之后零开销。

两个细节最值钱：**用 `absolute` 挂在文档里而不是 `fixed` 挂视口** —— 后者让噪点随页面滚动纹丝不动，读起来像一层屏幕滤镜；以及**按 1× DPR 渲染**，噪声是高频信息，翻倍分辨率看不出差别，长页面却能顶破 100MB。文末 2026 年的更新很诚实：「算了，我直接用一张静态图了。」

**你能偷什么：** 6% 这个数字；"静态效果别租 GPU"这条判断；以及 `absolute` 与 `fixed` 之间那个语义差别 —— 它决定你的颗粒是纸还是脏。

### ② devanshu.in —— 颗粒不是叠上去的，是算出来的

Devanshu Singhai 把整个作品集的每一帧都交给一个约 140 行的 riso 引擎渲染（[riso.js](https://devanshu.in/blog/riso-print-webgl)）：三块 Canvas2D 当三个印版（荧光粉、蓝、黄），一个 fragment shader 负责"印刷"。网点是旋转的 halftone，三个版分别用 **0° / 15° / 75°** —— 同角度必出摩尔纹，错开才有 rosette；网点半径取 `sqrt(tone)`，因为印刷的网点**面积**随色调走，不是半径。

然后是他真正的答案：颗粒不铺在画面上，铺在**油墨覆盖率**上。三层噪声 —— 点径抖动 `±0.18`、墨量不均 `0.82 + 0.18 × vnoise(fc × 0.006)`、孤立斑点 `0.08 × step(0.94, hash(...))`；纸色 `#f4efe4` 再叠 2.5% 噪点。叠印不靠算颜色，靠 `multiply`，粉压蓝自然出紫。套印偏移默认偏 1px，必要时可以让某一版临时多偏出去，踩在节奏上 —— 那个"不完美"是可信度的来源，不是 bug。

**你能偷什么：** 把噪点挂在"覆盖率"而不是"图层"上，这是假印刷和真质感的分界；1px 的套印误差；以及 `#f4efe4` 这种带一点脏的纸色，比纯白更像"印出来的"。

## 03 · 工具与素材

**fffuel · nnnoise** —— 一个纯浏览器里的 SVG 噪声生成器，参数就是上面那套：fractal / turbulence、frequency、opacity、desaturate，还能调光源方向给噪声加一点体积感（做纸纤维时有用，做纯砂粒时关掉）。输出直接是 SVG 或 CSS background，几十字节到几百字节。它最大的价值不是"好看"，是**省掉你手改 data URI 时被 `#` 和单双引号坑死的那二十分钟** —— `#` 必须写成 `%23`，SVG 内部一律用单引号外面包双引号，否则 `url(#n)` 的引用第一个断。

**[CSS-Tricks 那篇 Grainy Gradients](https://css-tricks.com/grainy-gradients)** —— 2021 年的老文至今是最好的底本，核心就一个 SVG filter：`fractalNoise`、`baseFrequency='0.65'`、`numOctaves='3'`、`stitchTiles='stitch'`。它的 playground 可以拖参数实时看，比读文字快十倍。想做"材质档"而不是"抗断层档"，把伪元素的 `opacity` 从 `.04` 拉到 `.18`，再把 `background-size` 固定在 200–240px 之间 —— 尺寸决定颗粒读起来是"砂"还是"电视雪花"。

顺带一句：想看一眼颗粒在印刷里到底长什么样，Risotto 的 Riso Club 今年 4 月在格拉斯哥 Glue Factory 把 100 期、400 张手工孔版印刷明信片全铺开了（[It's Nice That 报道](https://www.itsnicethat.com/features/risotto-riso-club-graphic-design-spotlight-080426)）。孔版印刷的"噪"是物理的：纸纤维、墨量、每一版手工对位。屏幕上的那 6%，本质上是在模仿这个。

## 🎯 今天动手：给你的 hero 加 4%，然后关掉它

1. **挑一块纯色或渐变的 hero。** 别挑图片背景，图片自带噪声，看不出差别。
2. **加一个 `::after`：** `content:""; position:absolute; inset:0; pointer-events:none; opacity:.04;`，背景用 nnnoise 导出的 SVG，`background-size: 220px 220px`。
3. **截两张图对比：** 一张 `opacity:.04`，一张 `0`。如果第一张你说不清"加了什么"，但觉得更沉、边缘更软 —— 剂量对了。如果一眼看见噪点，降到 `.02` 再试。

---

**参考来源**

1. [Kyungju Lee · Grainy gradients and noise texture: how to actually build them · ArtboardLab 2026-08-20](https://artboardlab.com/guides/grainy-gradients-and-noise-texture)
2. [Jimmy Chion · Grainy Gradients · CSS-Tricks 2021-09-13](https://css-tricks.com/grainy-gradients)
3. [Aditya Jain · The Noise Overlay · Sigri（含 2026 年更新）](https://origin.sigri.com/blog/noise-overlay)
4. [Devanshu Singhai · How to fake risograph print in WebGL · 2026-10-10](https://devanshu.in/blog/riso-print-webgl)
5. [fffuel · nnnoise — SVG noise texture generator](https://www.fffuel.co/nnnoise)
6. [The Gradients · Grainy Gradients（纯 CSS 颗粒渐变库）](https://thegradients.com/grainy-gradients/)
7. [Ellis Tree · The joy and power of Risograph: Risotto showcases 400 printed postcards · It's Nice That 2026-04-09](https://www.itsnicethat.com/features/risotto-riso-club-graphic-design-spotlight-080426)
8. [Noise & Gradient · 在线噪点 + 渐变叠加工具](https://www.noiseandgradient.com/)

*参数与数字均来自上列一手文章与作者自述的技术笔记，未做二次演绎。*
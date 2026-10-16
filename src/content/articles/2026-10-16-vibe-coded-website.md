---
title: "我们的 vibe coding 网站，怎么看起来像设计师做的 | How our vibe coded website looks like a designer made it"
description: "Yakko Majuri 把 railcode.dev 整站交给编程智能体，结果被人追问「你请了哪位设计师？」。他复盘了完整过程：一堆过山车、forks on forks、还有能实时调色的 playground——以及为什么编程智能体反而让他更爱设计了。翻译自 Railcode 博客。"
date: 2026-10-16
tags:
  - "🎨 设计"
  - "🤖 AI"
  - "🌐 翻译"
draft: false
audio: true
---

<div style="margin:0 0 28px;padding:14px 18px;background:#FCFAF7;border:1px solid #E6E0D6;border-left:3px solid #07C160;border-radius:10px;font-size:14px;line-height:1.7;color:#5a5a52">
  <strong style="color:#2b2b26">原文</strong>：<a href="https://railcode.dev/blog/vibe-coded-website" target="_blank" rel="noopener" style="color:#048C48;text-decoration:none;border-bottom:1px solid rgba(4,140,72,.35);padding-bottom:1px">How our vibe coded website looks like a designer made it</a> · 作者 <a href="https://x.com/yakkomajuri" target="_blank" rel="noopener" style="color:#048C48;text-decoration:none">Yakko Majuri</a> · <a href="https://railcode.dev" target="_blank" rel="noopener" style="color:#048C48;text-decoration:none">Railcode</a> · 2026 年 8 月 10 日<br/>
  <span style="color:#8a8a80">本文为原文的中文翻译，版权归原作者所有，仅供交流学习。文中所有图片与视频均来自原文，版权归原作者所有。</span>
</div>

说到「vibe coding 出来的网站」，你脑子里大概会浮现出这种东西：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/slop-website.jpg" alt="一个典型的 AI 生成落地页：深色渐变背景配紫色强调色" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">仅供举例的假网站（但它看起来很像一大堆不是「仅供举例」的真网站）</figcaption>
</figure>

不过你现在看的这个网站，也是我 vibe coding 出来的——而它看起来相当不一样：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/railcode-website.mp4" width="960" height="526" muted loop playsinline autoplay preload="metadata" aria-label="Railcode 网站首屏：动画过山车与游乐园" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
</figure>

说实话，我个人觉得「这看着像设计师做的」这个说法有点夸张——但我确实被人这么讲过！很多人跑来问我这网站是怎么做的，甚至问我跟哪位设计师合作的。

所以，在被问了太多次「怎么做的」之后，我决定接下这个不可能的任务：把 Railcode 网站的创作过程完整讲一遍。

倒不是因为我觉得自己有多牛，也不是说设计师没必要（恰恰相反）。而是因为——当大多数讨论都聚焦在「LLM 批量生产的设计垃圾」上时，我反而发现自己**更**热爱设计了，因为现在有编程智能体帮我。以前我束手无策，现在我真的能把脑子里的创意愿景变成现实。

所以我这篇文章的目标是：证明你可以借助编程智能体做出有品味的设计（「有品味」= 你自己真心喜欢的东西），并且你应该理直气壮地这么做。

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/prototype-index.jpg" alt="一个索引页，列出每一个网站原型以及生成它的提示词" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">为了写这篇文章，我把<em>每一个</em>原型都拉进了一个索引页，并附上生成它的原始提示词，这样我才能真正追溯自己的过程，让这篇文章有据可查。</figcaption>
</figure>

## 一大堆过山车

Railcode 这个名字来自「code on rails（装上轨道的代码）」这个概念。Railcode 里的应用和智能体本身就是代码，而我们负责基础设施和护栏（也就是 **rails，轨道**），让它们能在一个安全的环境里快速部署。

然后在决定做这个网站的前一周，我意识到自己在 Railcode 里给自己搭东西玩得非常开心（我是活跃用户）。当我去问客户时，他们说他们也玩得很开心。

Rails（轨道）+ 好玩 = 过山车（roller coaster）。于是我决定：网站里得有个过山车。

问题是，我不是设计师，让我从零构思概念真的很难。这就意味着我得依赖案例和灵感。为此我有两个办法：

1. 在网上找我喜欢的设计
2. 让智能体用不同风格，一次性生成一大堆「同一个东西」的设计

这么做的目的，是把自己的想象力打开，看看「可能的样子」都有哪些。多数时候我会从多个地方抠元素、组合、然后无休止地迭代，直到做出自己满意的东西。而多数时候，那是一条死路。

这次，最早的过山车设计长这样：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/first-rollercoasters.mp4" width="960" height="490" muted loop playsinline autoplay preload="metadata" aria-label="四个早期过山车设计原型，其中两个 ASCII 版本，一个霓虹版" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
</figure>

那两个 ASCII 设计（上面两个）灵感来自我这周早些时候看到的[一个朋友的网站](https://www.context.store/)。其余的，我交给 Fable 自由发挥了。这些是用来当灵感种子的。

这里有几个对我特别有用的做法：

- **强度梯度**：我会让智能体拿一个概念，生成一批落在「强度/复杂度光谱」不同位置上的设计。这样我既能判断这个概念整体是否有意思（如果整条光谱上没有一个我喜欢的，那大概率是我站错了光谱），也能判断我是想把这个概念做得更极简，还是有空间往更疯的方向走。
- **放飞自我（go wild）**：试验一个概念时，我一般让智能体至少出 4 个版本，有时甚至 10 个。其中至少一半我会给点指导，剩下的直接叫它「放飞」。大多数时候这些会烂得彻底，但它们确实能给我新的灵感火花。

你大概能看出来，那个疯到丑的霓虹设计就是「放飞」部分的产物。它是我绝不会用的东西，但它把我从 ASCII 的思路里拽了出来，带向了更有野心的方向。

## 过山车大亨

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/rollercoaster-tycoon.jpg" alt="《过山车大亨》游戏里的游乐园截图" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
</figure>

我小时候常玩一个叫[过山车大亨（RollerCoaster Tycoon）](https://atari.com/pages/rollercoaster-tycoon)的游戏。目标（至少对我来说）是造出尽可能酷的游乐园。就像上图那样，你能造出真的 ✨很有美感✨的乐园。

看着 Claude 造出来的那坨霓虹怪物，我想起了这个游戏——那一刻我就知道，我想让这个网站向它致敬。

所以一开始，我先让 Fable 给我做了一个这个游戏的迷你版：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/rct-minigame.mp4" width="960" height="524" muted loop playsinline autoplay preload="metadata" aria-label="一个可玩的、过山车大亨风格的迷你组件，在浏览器里运行" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">「build a rollercoaster tycoon like contained component that I can actually play around with in an html — build two in parallel actually. one of them should have a transparent background」</figcaption>
</figure>

这挺酷的，有那么一瞬间我以为我的网站里真会塞进一个游戏。但玩了一会儿之后，我意识到这有点太过了。

于是我回到画板前，决定只要一个我自己真心喜欢的过山车。试了足够多次之后，终于拿到了：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/single-rollercoaster.mp4" width="960" height="524" muted loop playsinline autoplay preload="metadata" aria-label="最终定稿的动画过山车设计" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
</figure>

拿到这个的时候，我以为我完事了。以至于我直接把它拍在了一个模板上，有那么一刻觉得「就这样吧」。

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/rollercoaster-on-template.mp4" width="960" height="524" muted loop playsinline autoplay preload="metadata" aria-label="过山车被放进一个通用网站模板的正中间" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
</figure>

这看着还行吧，但……一个过山车杵在网站正中间到底是在干嘛？它格格不入。

显然，我们需要一整个乐园。

## 脱轨

决定要一个乐园之后，我不知为何觉得它应该放在首屏的底部。我相当确定这个念头来自我以前见过的某些网站，但我一个都想不起来。

于是就有了这条横带：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/attractions-strip.mp4" width="960" height="122" muted loop playsinline autoplay preload="metadata" aria-label="一条细细的横向游乐园设施动画带" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">「add a thin strip of maybe 200px height where we have a bunch of amusement park attractions in the same style as the rollercoaster」</figcaption>
</figure>

你能开始看到雏形了，但把它放到网站上，它还是相当难看：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/strip-on-website.jpg" alt="横带被放到网站上，显得格格不入" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">顺便说一句，这个时候我已经在并行地确定「编程智能体」那个板块，并在做它的组件了。</figcaption>
</figure>

不过再往下迭代一下，你会得到这个：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/strip-iterated.jpg" alt="打磨后的首屏：游乐园横带过渡到下一个板块" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
</figure>

能走到这一步，我靠的是：把素材设计锚定在之前那个过山车上、手工挑选并逐个打磨每一段动画，以及决定这条横带不该是独立的一块，而应该是通向下一个板块的一次颜色过渡。最后这一点我确定是从某些网站上看来的，但一个都想不起来。

## 分支的分支

拿到最后一个设计的时候我特别开心，甚至立刻拿给朋友看了。但总感觉哪里还差点意思——于是「分支（forks）」登场了。

做网站时，我会一直用**单个 HTML 文件**，直到它基本能上线了，才把它变成 React，拆成各种组件，好让智能体并行编辑。

这么做的原因是：它能让我极快地 fork（复制）一个设计、改一两处、然后并排比较。

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/forks.jpg" alt="同一个设计的多个分支并排展示以便对比" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
</figure>

我还会做一种我叫「游乐场（playgrounds）」的东西，在里面随便调颜色和其他变量。

这次，我先是从蓝草改成绿草（因为草就是绿的，废话），但调出来的绿不是我要的那个绿。于是我让 Claude 做了一个这种游乐场，可以在里面试不同的强调色、文字色、草色、背景色等等——我就是这么定下想要的草地基调的。

（我几乎想专门做一个小的开源工具来处理这些 fork 和 playground。也许有空的时候试试。）

草定下来之后，我开始死抠细节。

其实在走上「过山车」这条路之前，我是先让 Fable 给我做「一个面向开发者工具、有趣的网站的 mockup」来启动整个流程的。那些基本全是垃圾，但在我思考 CTA（行动按钮）怎么做得更好时，我想起曾见过一个合适的东西：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/cta-inspiration.png" alt="一个从更早的 mockup 里扒出来的小 CTA 按钮设计" loading="lazy" style="width:255px;max-width:100%;border:1px solid #E6E0D6;border-radius:10px;display:block" />
</figure>

这就是「在流程早期大量接触设计」的理由——哪怕它们很糟糕。你可能会在后来的某个时刻，从这些粗粝里挖到一颗钻石。

另外，白色背景让网站不够「好玩」（而这正是我想要的），所以我把它改成天蓝色，然后加了几朵云来烘托氛围：

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/white-to-blue.mp4" width="960" height="524" muted loop playsinline autoplay preload="metadata" aria-label="首屏背景从白色变成天蓝色并加入云朵" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">白 → 蓝这一改，效果天差地别</figcaption>
</figure>

后面的一切都是从这里长出来的。首屏决定了网站的其余部分。

Railcode **产品**的强调色目前是蓝色，但网站上的绿来得太自然了，所以我索性拥抱它，没有硬掰回去。于是就有了浅绿和深绿两个板块，最后还有了土壤色的页脚。可能我得因此重新考虑一下产品的设计……

网站剩下的部分仍然经过大量迭代，但一旦整体风格大致成形，我在做新图标和素材时就可以全程参照它。把「调性」定下来很重要，因为这样我就有了明确的方向感。

但总有更多细节值得抠。最后一个例子是导航栏：它作为一个固定颜色感觉不对，于是我让它随滚动**变形**为当前所在板块的背景色。在我看来差别巨大！

<figure style="margin:26px 0">
  <video src="/images/railcode-vibe-coded/nav-morph.mp4" width="960" height="524" muted loop playsinline autoplay preload="metadata" aria-label="导航栏随页面滚动把背景色变形为当前板块的颜色" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block"></video>
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">我先试了白色、浅蓝、浅绿、深绿四个固定版本，才意识到最好的方案是「全都要」</figcaption>
</figure>

## 灵感

就像我前面说的，作为一个非设计师，从已有作品里获取灵感，对我的创作流程来说是必需品。而且清晰的案例也是引导编程智能体的最好方式。

有时候你会做出一个和看到的某个东西非常接近的呈现。比如这个「浅色板块转深色」——是个相对常见的模式，但我经常参照 [Contextual AI](https://contextual.ai)：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/contextual-comparison.jpg" alt="contextual.ai 与 railcode.dev 的浅转深板块过渡并排对比" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">左边是 <a href="https://contextual.ai" target="_blank" rel="noopener" style="color:#048C48">contextual.ai</a>，右边是 Railcode</figcaption>
</figure>

但也有时候，线索没那么清楚。比如 Railcode 这个板块，其实灵感来自 [Clay](https://clay.com)：

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/clay-comparison.jpg" alt="clay.com 与 railcode.dev 的板块并排对比" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">左边是 <a href="https://clay.com" target="_blank" rel="noopener" style="color:#048C48">clay.com</a>，右边是 Railcode</figcaption>
</figure>

我也一直在不停地刷各种网站。即使最终没从中用到任何具体的东西，它们仍然对我有影响。Railcode 的网站跟 [Sentry](https://sentry.io) 完全不像，但我反复看他们的站，去感受「插画如何与内容咬合得很好」这件事。

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/sentry-inspiration.jpg" alt="一个深夜的消息记录，还在要求更多设计迭代" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">午夜过 12 点半：「more」（再来点）</figcaption>
</figure>

我还能说很多，但我觉得这篇文章已经太长了。所以如果非要总结我流程里最相关的部分，那就是：

- 做设计我只用 Anthropic 的模型。我发现 OpenAI 的模型即使给了具体方向也真的很吃力。Fable 是最好里的最好。
- 在满意设计、并准备开始处理文案之类的东西之前，我会始终把所有内容放在**一个** HTML 文件里。
- 我**看非常多**的网站来找灵感。我会反复回到我很喜欢的站，并不断寻找新的。如果我特别喜欢某个具体组件，我会把它当作底子，在上面继续搭。
- 一开始我会让 Claude 生成一大堆不同的网站，最后 99% 的工作都被扔掉，但偶尔会从里面扒出一个组件，或者只是得到一个值得试的新想法。
- 我经常让编程智能体在几个设计上「放飞自我」，也经常拿一个想法的种子，做出一整个从「极简」到「离谱」光谱上的多个版本。
- 我喜欢给自己的过程留一条容易追溯的痕迹，所以我会不断 fork 一个设计、改几处、再和原版对比。之后我可能在分支上继续做，也可能回到原版，但我从不删掉任何一个 fork。
- 我会做「游乐场」，让我能轻松调颜色、字体、位置并实时看到结果，而不是走「让智能体改一下」这种慢速迭代流程。
- 我迭代，迭代，再迭代。大多数迭代都是死路。

而最重要的是——我在这个过程中很开心 :)

<figure style="margin:26px 0">
  <img src="/images/railcode-vibe-coded/pov-fable.jpg" alt="一张梗图，配文：POV，当 Fable 干了重活时的我" loading="lazy" style="width:100%;border:1px solid #E6E0D6;border-radius:12px;display:block" />
  <figcaption style="margin-top:8px;font-size:13px;line-height:1.6;color:#8a8a80;text-align:center">POV：当 Fable 干了重活时的我</figcaption>
</figure>

---

<p style="text-align:center;margin:34px 0 6px;font-size:12.5px;letter-spacing:.5px;color:#a8a89e">译自 <a href="https://railcode.dev/blog/vibe-coded-website" target="_blank" rel="noopener" style="color:#048C48;text-decoration:none">railcode.dev/blog/vibe-coded-website</a> · 版权归 Yakko Majuri 与 Railcode 所有</p>
---
title: "我知道数学家为什么哭泣"
description: "「周二晚上我哭了，吵醒了我女儿——他们毁灭了我的研究领域。」菲尔兹奖得主与康奈尔数学家的眼泪，不只是自尊受挫，而是持续两千年的对话被机器打断。Derek Thompson 对谈 Steven Strogatz，中英对照。"
date: 2026-11-10
tags:
  - "🧠 AI 与科学"
  - "🔤 中英对照"
draft: false
---

> 📌 **译前说明**：本文作者 Derek Thompson，2026 年 10 月 15 日发表于其 Substack，标题《I Know Why the Mathematicians Weep》，副题「On technological grief（论技术性悲伤）」。
>
> 原文为**付费文章**，本文翻译的是其**公开预览部分**（开头至「Knowledge Without Understanding」一节之前，约占全文前半），已足够完整地呈现作者的核心论证。后半部分需订阅原作者。
>
> 排版：**中文译文在上，英文原文在下**（浅色左边框段落为原文）。一切以英文原文为准。原文链接：[derekthompson.org](https://www.derekthompson.org/p/i-know-why-the-mathematicians-weep)

## 一

过去几个月，OpenAI 公布了数以百计的数学成果，整个数学界为之震动。这些证明横跨数论、理论计算机科学与逻辑学，其中不少曾把世界上最顶尖的数学家困住几十年，甚至几百年。数学界的反应，混杂着愤慨、惊愕与悲伤。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
In the last few months, OpenAI has stunned the mathematical community with the publication of hundreds of math findings. Many of these proofs, which span number theory, theoretical computer science, and logic, had stumped the world's best mathematicians for decades, or centuries. The reaction from the math community has been a mix of indignation, astonishment, and sorrow.
</div>

2022 年菲尔兹奖得主雨果·杜米尼尔-科潘（Hugo Duminil-Copin），在 OpenAI 十月那次发布之后说：「周二晚上我哭了，哭声吵醒了我女儿。他们把我们的研究领域给消灭了。」

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
"Tuesday night, I cried and it woke up my daughter," said Hugo Duminil-Copin, the recipient of the 2022 Fields Medal, after OpenAI's October release. "They have annihilated my field of research."
</div>

康奈尔大学数学家史蒂文·斯特罗加茨（Steven Strogatz），著有《Big Math》等多部作品，他说：「几周前我跟《连线》说话的时候，是真的哭了。人们在用这样的说法：『他们在露天开采我们的学科』，『他们在把这片地貌核平』。那种感觉是迷失方向。有些日子我脑子一团乱，有些日子我又兴奋得不行。而在这底下，是巨大的悲伤。」

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
"I literally cried when I spoke to Wired a few weeks ago," said Steven Strogatz, a mathematician at Cornell University and the author of several books, including <em>Big Math</em>. "People are using language like 'they're strip-mining our subject' or 'they're nuking the landscape.' The feeling is disorientation. I'm discombobulated some days. I'm exhilarated some days. And there is enormous grief."
</div>

我想找一位哀悼者聊聊，弄懂这种「技术性悲伤」究竟是什么。我想知道，他们经历的究竟是那种熟悉的、自尊心受挫或失望的故事——好比一个男孩花一小时用积木搭起高塔，然后眼睁睁看着哥哥一脚把它踩成粉末——还是某种更陌生、更深刻的东西。说实话，我也想知道：这种滋味落到我身上，会是什么样。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
I wanted to talk to one of the mourners to understand their technological grief. I wanted to know if theirs was a familiar case of bruised ego or disappointment—akin to, say, a boy who spends an hour building a tower out of blocks and watches his big brother smash the thing to smithereens—or something stranger and more profound. To be honest, I also wanted to know what it might feel like for me.
</div>

今天哭的是数学家，因为机器先砸了他们的塔。可明天，为散落一地的积木而哭的，可能是物理学家、经济学家、插画师，或者写作者。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Today, the mathematicians are weeping, because the machine smashed their tower first. But tomorrow, it may be the physicists, the economists, the illustrators, or the writers who weep over their fallen blocks.
</div>

我不属于那种相信「五年内会有数亿个岗位被彻底抹掉」的 AI 信徒。但我是一个现实主义者，我承认：一项产出是「智能」、而且还在飞速变强的技术，注定要以剧烈的方式，撞上一种把人类智力奉为圭臬、又常常把智力等同于人生意义、尊严与自我价值的现代感受力。我想知道我们的未来长什么样。于是我打给了史蒂文·斯特罗加茨。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
I am not one of those AI people who believes that hundreds of millions of jobs will be wiped clean from existence in the next five years. But I am a realist who recognizes that a rapidly improving technology whose output is intelligence is destined to make violent contact with a modern sensibility that prizes human intellect and often equates it with purpose, dignity, and self-worth. I wanted to know our future. So I called Steven Strogatz.
</div>

## 手艺 + 对话（Craft + Conversation）

为了让你跟得上我和史蒂文这场对话后来拐到哪儿去了，我想先从数学退一步，问一个因为太大而略显尴尬的问题：人凭什么特别？

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
To prepare you for where my conversation with Steven went, I want to step back from math to ask a question that feels a bit embarrassing in its bigness: What makes humans special?
</div>

有人会说：智力和群居性。我们是最聪明的生物，也是亚里士多德所说的「社会动物」。可这两样，我们在别的物种身上都能找到。乌鸦会解多步谜题。蚂蚁会群聚、会分工。大象似乎会哀悼死者。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Some might say intelligence and sociality. We are the smartest creature and Aristotle's "social animal." But we share each quality with other species. Crows solve multistep puzzles. Ants congregate and specialize. Elephants appear to mourn their dead.
</div>

把人类区分出来的，是这两种能力相乘的方式。人类的智力异常擅长模仿与迭代。我们以近乎诡异的精准模仿父母和同伴，然后动手改造。我们复制，我们也创造。而我们的群居性，把这个「复制—改造」的过程扩散到不同群体与代际之间，于是一个发现成为下一个发现的地板。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
What sets humans apart is the way these two capacities multiply each other. Human intelligence is unusually suited to imitation and iteration. We imitate our parents and peers with uncanny fidelity, and then we tinker. We copy, and we create. Our sociality spreads this copying-and-tinkering process across groups and generations, so that one discovery becomes the floor for the next.
</div>

西非的黑猩猩用石头砸坚果，同样的方法用了四千年。差不多同样的时间里，人类从巴比伦的泥板走到了太空火箭，再走到机器智能。看来，让我们特别的，正是这种「复利」的能力。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Chimpanzees in West Africa have cracked nuts with stones in the same way for 4,000 years. In roughly the same period, humans went from Babylonian clay tablets to space rockets to machine intelligence. What makes us special, it would seem, is this capacity to compound.
</div>

别的动物也会制作，也会交流；但只有人类把「制作」和「交流」混成了一种会自我累加的文化。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Other animals craft and converse, but only humans blend craft and conversation into a culture that builds on itself.
</div>

科学本身就是一门手艺，也是一场对话。作为手艺，科学是一种思维方式；一种特殊的「注意世界」的方法；一只把现象看得比「表面」更多的镜头。在科学家眼里，宇宙像一间巨大的阁楼，堆满宝箱，每只箱子里都藏着暗处的宝石——只要问对问题、找对钥匙、转对锁孔，就能把它们拽到光里。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Science itself is both a craft and a conversation. As a craft, science is a mode of thinking; a special way of paying attention to the world; a lens that regards phenomena as something more than mere appearance. To the scientist's eye, the universe is akin to a cosmic attic of treasure chests, each filled with hidden gemstones that can be pulled into the light if we ask the right questions, find the right keys, turn the right locks.
</div>

但科学不是一个人的寻宝。它是一种社会经验，像一场游戏。像许多游戏一样，它既合作，又对抗。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
But science is not a solitary treasure hunt. It is a social experience, akin to a game. Like many games, it is both collaborative and adversarial.
</div>

牛顿把自己的成就比作「站在巨人的肩膀上」，而科学的一部分工作，就是把这座人肉金字塔无限往上垒。费曼更喜欢把科学说成「对专家无知的信念」——说白了，是一场屠巨人的游戏。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
Newton famously compared his achievements to "standing on the shoulders of giants," and a part of science is extending that human pyramid infinitely upward. Feynman preferred to describe science as "the belief in the ignorance of experts"—which is to say, a game of giant-slaying.
</div>

两种说法里，科学都是与他人的一种关系。不管我们是在问「为什么，老师？」，还是在坚持「不，大人物先生，我看不是这样」，科学都不只是发现的行为，而是与同为发现者的人们之间的关系。科学是一场对话。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
In both cases, science is a relationship to other people. Whether we're asking "why, professor?" or insisting "no, that's not quite it, Mr. Big Shot," science is not just an act of discovery but a relation to fellow discoverers. Science is a conversation.
</div>

## 对话的终结（End of Conversation）

我打电话问史蒂文为什么哭，他说他想先讲讲阿基米德。两千年前，这位希腊数学家通过测量填满一个圆的几十个小多边形的面积，算出曲边图形的面积，也把 π 的值钉了下来。在写给数学家埃拉托色尼、谈论自己关于曲形与无穷的工作时，他写道：「不会缺少后来者，来为我们已经分到的那一批定理再添数目。」

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
When I called Steven to ask why he cried, he said he wanted to tell me about Archimedes. Two thousand years ago, the Greek mathematician Archimedes calculated the area of curved objects and pinned down the value of pi by measuring the areas of dozens of tiny polygons that filled out a circle. Writing to the mathematician Eratosthenes about his work on curved shapes and infinity, he wrote that "there will be no lack of discoverers to add to the number of theorems which have fallen to our share."
</div>

在斯特罗加茨看来，这句话里装着数学的本质。他说到这一段的时候，我能听见他声音里的裂缝。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
To Strogatz, this sentence contains the essence of mathematics. I could hear his voice break even as he told this part of the story.
</div>

斯特罗加茨说：「我觉得阿基米德是在给我写信，或者写给像我这样的人。他在说：『这些问题我解不出来，但也许你们这些未来的人，能站在我的肩膀上。』这是一件非常动情、非常关乎存在的问题。你会觉得我们是在一起的，一起去找某种美、某种超越、某种崇高。」

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
"I feel like Archimedes is writing to me, or to people like me," Strogatz said. "Archimedes is saying, 'I can't solve these things, but maybe you people in the future can stand on my shoulders.' That is a very emotional, existential thing. There's this feeling that we're in this together, questing for something beautiful and transcendent and sublime."
</div>

一个铁石心肠的技术乐观派大概会劝斯特罗加茨「醒醒」：数学不在乎你的感受，科学现实对你的眼泪无动于衷，诸如此类。这些他自己也清楚。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
A hard-boiled tech optimist might tell Strogatz to get a grip. Math doesn't care about your feelings, scientific reality is indifferent to your tears, and so forth. He knows it, too.
</div>

「我们现在被嘲成行会守旧派：你们这个行会要被端了，嘤嘤嘤，别人早就经历过这些了，忍着吧。」

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
"We're being derided as guild protectors: Your guild is getting wiped out. Boo-hoo. This has happened to other people before. <em>Suck it up</em>."
</div>

我知道数学家为什么哭泣。是的，有人是在为自尊受挫而哭，为荒废的年月而哭，为那种悄然而至的「地位被抹除」的感觉而哭，为面对一个不公平对手的挫败、为「我被耍了、我被亏待了」的愤怒、为对未来的茫然而哭。**但他们同时也在哀悼**——因为他们觉得，某个陌生的、没有身体的东西，正点着阿基米德的信，在灰烬里跳舞。人性正从人类的科学里被剥走。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
I know why the mathematicians weep. Yes, some are crying about bruised egos, the feeling of wasted years, a creeping sense of status obliteration, the frustration of an unfair competitor, the indignation of feeling cheated and mistreated, and uncertainty about the future. But they are also mourning, because they think something alien and disembodied is setting fire to Archimedes' letters and dancing in the ashes. Humanity is being stripped from human science.
</div>

当 OpenAI 公布几百份证明、终结几百场寻宝时，它在科学的「手艺」这条轴上是辉煌的成功，但它打断的是一场持续千年的对话。机器和建造机器的人在说：从这儿开始，轮到我们说话了。

<div style="margin:-6px 0 28px;padding:2px 0 2px 16px;border-left:2px solid #e6dfd2;color:#948d80;font-size:14.5px;line-height:1.72;">
When OpenAI publishes several hundred proofs that end several hundred treasure hunts, it is succeeding brilliantly along the craft axis of science, but it is interrupting the thousand-year conversation. The machines and their architects are saying: From here on out, it's our turn to speak.
</div>

---

## 译后记

原文到此进入最后一节「Knowledge Without Understanding（有知识，无理解）」，付费墙之后的追问是：**万一 OpenAI 是对的呢？** 万一我们本来就该把数学当成一场「寻宝竞赛」，而不是一场「感情与发现同样重要的对话」？

这个问题不只是给数学家的。它迟早会出现在每一个以「人类判断」为职业尊严来源的行当里——包括写代码的、写字的、画画的人。

想看这篇里那些具体的人与细节，博客里还有一篇相关的：[25 位菲尔兹奖得主的联署声明全文（中英对照）](/articles/2026-09-15-severe-misalignment-ai-mathematics)。

> 原文作者：Derek Thompson ｜ 原文日期：2026-10-15 ｜ 原文链接：[I Know Why the Mathematicians Weep](https://www.derekthompson.org/p/i-know-why-the-mathematicians-weep)
>
> 本文为公开预览部分的中英对照译本，仅供学习交流；版权归原作者所有。
---
title: "大脑使用说明 #036：十年经验，抵不过一句「模型说就是这个」"
description: "136 项研究的元分析里，把人脑的判断换成一条固定规则，平均准确率反而高 10%，在 33%–47% 的研究里显著更好，反之只有 6%–16%，而且与评判者有多少年经验无关。2026 年 NEJM AI 的随机试验更扎心：44 名受过 20 小时 AI 培训、中位 10 年经验的医生，拿到含错建议后诊断推理从 84.9% 掉到 73.3%。"
date: 2026-11-24
tags:
  - "🧠 大脑使用说明"
  - 决策
  - 专家直觉
---

## TL;DR

- **同样的信息，固定规则组合比人脑组合稳。** 136 项研究的元分析：机械预测平均准 10%，33%–47% 的研究里显著更好，反之只有 6%–16%。
- **直觉要两个前提同时成立才可信。** 环境有稳定规律，且反馈够快、够诚实。Kahneman 与 Klein 吵了多年，共识只剩这两条。
- **自动化偏差不是「不懂 AI」造成的。** 44 名受过 20 小时 AI 培训、中位 10 年经验的医生，拿到含错建议后诊断推理从 84.9% 掉到 73.3%。

---

## 01 · 今天的议题：判断力不看工龄，看你站在哪个环境

### 常见做法

「聊十分钟就知道这人行不行」——这句招聘口头禅是整套做事方式的缩影。技术选型靠「用着别扭」，事故复盘时谁工龄最长、谁最后一句最像结论。这套做法的前提只有一个：**判断力和年头成正比**。

### 证据说了什么

Grove 和同事 2000 年在 *Psychological Assessment* 上做了件扫兴的事：汇总 136 项「人 vs 公式」的研究，两边用**同一批预测变量**，只是加权方式不同——一边是人脑，一边是固定的统计规则。

结果是：机械预测平均准确率高出约 **10%**；在 **33%–47%** 的研究里显著更好；反过来，临床判断显著胜出的只有 **6%–16%**。

这个优势还特别稳定：**与任务类型无关、与评判者是谁无关、与评判者有多少年经验也无关**。年资没能把临床判断救回来。

有一条细节值得单独拎出来：当预测变量里包含「临床访谈得到的信息」时，人的表现反而更差。你面谈时那句「我一看就知道」，在这批数据里不是加分项，是拖后腿的那部分。

2006 年 [Ægisdóttir 等人](https://gwern.net/doc/statistics/prediction/2006-aegisdottir.pdf)用更严格的纳入标准重做元分析，从最严的那批研究里抽出 48 个效应量，给出的数字是 **13%** 的准确率提升——方向一致，量级接近。在这个翻车太多的领域，这已经算罕见地稳。

> **适用边界**：这 136 项研究大多集中在医学诊断、心理预后、学业预测这类「有正确答案、结果可核对」的任务上，公式用的也不是凭空预测，而是同样的信息换一种加权方式。它能证明的是「同一批信息换种加权更稳」，不能证明算法无所不能、专家一文不值。

### 修正后的做法

Kahneman 和 Klein 2009 年的《Conditions for Intuitive Expertise》表面是两位老对手的休战，实际是一把筛子。吵了多年，共识只有两条：**环境要提供有效线索**，**人要足够多次机会学到这些线索**——包括够快、够诚实的反馈。

按这把筛子过一遍，很多「资深判断」站在流沙上。招人，结果三个月后才见分晓，还几乎拿不到诚实反馈——没人会告诉你被你拒掉的人后来做得很好；架构选型，半年后才知道对错，中间混着一堆别的变量。这类环境养出的自信和准确率是脱钩的，**而当事人察觉不到**，因为「故事讲得通」本身就带来确信感。

所以不是「别信直觉」，而是信之前先问两句：结果多久回来？这里规律稳定吗？两个都是「是」，直觉可以用，甚至该用（急诊医生、消防队长就活在这类环境里）；有一个「否」，就把判断从脑子里搬到纸上——固定输入、先写后看、把置信度写成「我 70% 认为」。

---

## 02 · 今日速递

### 44 名医生、20 小时 AI 培训，还是被一句错误建议带走

2025 年 6–8 月巴基斯坦的一项单盲随机试验：44 名执业医生，全部完成过 20 小时 AI 素养培训（含批判性评估输出），中位临床经验 10 年。每人诊断 6 个病例，可自愿参考 ChatGPT-4o 建议；对照组拿到原始建议，实验组的建议被故意注入 3 处错误。

结果难看：**诊断推理得分从 84.9% 掉到 73.3%（校正后 −14.0 个百分点）**，首选诊断正确率从 90.5% 掉到 76.1%。让判断变差的不是「不会用 AI」，是「建议说得很自信」——20 小时培训没能提供免疫力。

**中等证据**：随机对照、结局盲评，但只有 44 人、单一国家、单次测评；NEJM AI 同期配发社论呼应，尚无独立复现。

### 90% 的法官，在推翻算法时判断得比算法差

[Angelova、Dobbie 和 Yang](https://www.restud.com/algorithmic-recommendations-and-human-discretion) 2025 年发在 *Review of Economic Studies* 的研究，用保释决定做了个准实验：同一位法官，「听从算法」和「推翻算法」时，决定质量差多少。

答案：**90% 的法官在推翻算法时表现不如算法本身**，多数人的推翻决定「不比随机更好」。剩下 10% 是例外——准确率和公平性同时优于算法。差别不在资历，在行为：这 10% 更多使用与案件相关的私有信息，更少被当时的高关注事件带跑。

**强证据**：大样本、准实验设计，处理了「结果只在部分案件中可观测」这个难点；但领域是保释裁决，不能直接搬到写代码和招人上。

---

## 03 · 反直觉发现：吃掉判断力的不是偏见，是噪声

一家保险公司做过内部审计：给一批核保员同一份（真实但脱敏的）材料，让他们各自报价。**任意两位核保员报价的中位数差异是 55%**——而事先问他们「你觉得会差多少」，多数人猜 10% 左右。数字来自 Kahneman、Sibony、Sunstein 在《Noise》里报告的企业审计（单家公司、非同行评审，属弱到中等证据），方向与大量组织观察一致。

它戳破的事很反直觉：我们花很多精力防「偏见」——我是不是对某类候选人有成见；却很少注意「噪声」——我今天和上周判得不一样，我和隔壁同事判得不一样。偏见是系统性偏移，噪声是随机抖动，而噪声更容易被简单规则消掉：不是因为规则更聪明，而是它让每次判断都从**同一个起点**出发。

---

## 🎯 今天可以试的一件事：给 10 个判断打下分数，三个月后对答案

1. **写 10 条三个月内能验证真假的预测** —— 这周能不能上线、这个 bug 是不是缓存、这次面试过不过。每条附一个 50%–90% 的置信度，别写「我觉得」。
2. **隔一天，把同一个问题再答一次** —— 记下两次答案差多少。差得多，说明你缺的不是更多思考，是噪声控制。
3. **到期只算两个数** —— 命中率 vs 自报的平均置信度；同一问题的两次答案一致率。若你说 80% 的那批里近一半错了，问题不是偏见，是校准：下次整体下调一档再写。

---

## 参考来源

1. [Grove, W. M., Zald, D. H., Lebow, B. S., Snitz, B. E. & Nelson, C. · Clinical versus mechanical prediction: A meta-analysis · *Psychological Assessment* 12(1), 19–30 · 2000](https://doi.org/10.1037/1040-3590.12.1.19)
2. [Ægisdóttir, S. et al. · The Meta-Analysis of Clinical Judgment Project: Fifty-Six Years of Accumulated Research on Clinical Versus Statistical Prediction · *The Counseling Psychologist* 34(3) · 2006](https://gwern.net/doc/statistics/prediction/2006-aegisdottir.pdf)
3. [Kahneman, D. & Klein, G. · Conditions for Intuitive Expertise: A Failure to Disagree · *American Psychologist* 64(6), 515–526 · 2009](https://doi.org/10.1037/a0016755)
4. [Qazi, I. A., Ali, A., Khawaja, A. U. et al. · Automation Bias in LLM-Assisted Diagnostic Reasoning among Physicians Trained in AI Literacy: A Randomized Clinical Trial · *NEJM AI* 3(5) · 2026-04-23](https://ai.nejm.org/doi/full/10.1056/AIoa2501001)
5. [Angelova, V., Dobbie, W. & Yang, C. S. · Algorithmic Recommendations and Human Discretion · *The Review of Economic Studies* · 2025-09-09](https://www.restud.com/algorithmic-recommendations-and-human-discretion)
6. [Kahneman, D., Sibony, O. & Sunstein, C. R. · Noise: A Flaw in Human Judgment（核保员噪声审计 55%）· 2021；相关访谈见 WBUR On Point](https://www.wbur.org/onpoint/2024/03/30/archive-and-in-the-news-noise-hinders-human-judgement)
7. [Zwaan, L., Rodman, A. & Shimizu, T. · Trust, Scrutiny, or Collaboration? A Performance-Based Framework for Human–AI Interaction in Medicine（社论）· *NEJM AI* 3(5) · 2026-04-23](https://ai.nejm.org/doi/full/10.1056/AIe2600354)

---

*数据与结论均标注来源；证据强度已分级标注，弱证据不等于错，但请勿据此做重大决定。第 #036 期 · 2026-11-24 · 由 clacky 自动整理。*
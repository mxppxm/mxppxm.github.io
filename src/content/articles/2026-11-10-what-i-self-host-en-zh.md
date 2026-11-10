---
title: "What I Self-Host, What I Don't, and Why"
description: "English-first bilingual: a homelab tour of 17 native services + 11 Podman services on a EUR 180 mini PC — Jellyfin, Immich, Frigate, Vaultwarden, Snapcast — plus everything the author refuses to run, like the *arr stack and self-hosted email. 英文正文 + 中文注释译文。"
date: 2026-11-10
tags:
  - "🛠️ 自托管"
  - "🔤 中英对照"
draft: false
---

> 📌 **About this translation / 关于本译文**
>
> Original: [What I Self-Host](https://viceconsole.fyi/blog/2026/10/10/what-i-self-host/) by *viceconsole.fyi*, published 2026-10-10. Translated in full.
>
> Layout / 排版：**English is the main text** — the Chinese translation sits underneath each paragraph in a small grey note, so you can read the original straight through and only glance down when you need it. 英文为主，中文为旁注译文；只读英文可顺畅滑过，卡住时低头看灰字。
>
> 原文链接：[viceconsole.fyi/blog/2026/10/10/what-i-self-host](https://viceconsole.fyi/blog/2026/10/10/what-i-self-host/)

---

I've always had a foot in the self-hosting world, long before it was called that. My freshman year of university, I ran a website from a Linux box underneath my bed. There was some downtime when my roommate got tired of the fan noise and turned it off.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我一直算半个自托管圈的人，远早于这个说法流行之前。大学一年级，我用床底下一台 Linux 机器跑了个网站。中间有过一次停机——室友嫌风扇太吵，把它关了。
</div>

For several years I ran MythTV, then XBMC (later known as Kodi). Recently, I lived for a few years in India, where streaming services are extremely inexpensive by western standards. We had Netflix, Disney Plus (Hotstar in India), and Spotify. After leaving India, I was unwilling to pay western prices for these services.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我跑过好几年 MythTV，后来是 XBMC（也就是后来的 Kodi）。前些年我在印度住过几年，那里的流媒体按西方标准极其便宜。我们有 Netflix、Disney Plus（印度叫 Hotstar）和 Spotify。离开印度之后，我不愿意再按西方的价格付这些服务的钱。
</div>

But I had also become fed up with the engagement treadmill, particularly for my son. We wanted to limit his viewing choices to certain programming, but the constant "recommended for you" and "up next" caused conflict. While there are ways to limit content to specific titles, or disable auto-play, doing this for each service and keeping track of when client applications change and need to be reconfigured is too much work.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：但我也受够了那台"参与度跑步机"，尤其是我儿子那摊。我们想把他能看的内容限制在特定节目上，可没完没了的"为你推荐""接下来播放"总在制造冲突。虽然可以靠限制片单、或关掉自动连播来解决，但要一家一家服务去设置、还要盯着客户端什么时候改版了得重新配一遍——工作量太大了。
</div>

So, I "cut the cord" in a different sense, ditching streaming services for self-hosted [Jellyfin](https://jellyfin.org). Over the course of the next year and a half, Jellyfin opened the door to self-hosting many other services, reducing my dependence on cloud service providers, and providing a welcome stability. No longer am I constantly confronted with unnecessary site redesigns, new features of questionable value, and a barrage of e-mails about terms-of-service updates, binding arbitration, data breaches, etc. I read the release notes of new versions of the software I host and decide if and when I want to upgrade.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：于是我用另一种意义上的"剪断线缆"，把这些流媒体服务换成了自托管的 Jellyfin。接下来一年半里，Jellyfin 打开了一扇门，让我陆续自托管了很多别的服务，减少了对云服务商的依赖，也换来了一种很受用的稳定感。我不再天天面对没必要的网站改版、价值可疑的新功能，以及一大串关于服务条款更新、强制仲裁、数据泄露之类的邮件。我自己去读所托管软件新版本的更新日志，再决定要不要升级、什么时候升。
</div>

## Rules

I have a few ground rules. With the exception of VPN servers that run on my router, I do not expose any services directly to the public internet. I don't care how convenient it would be, or how secure an application is. Especially with AI-assisted hacking, I simply don't think it's wise.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我有几条铁律。除了跑在路由器上的 VPN 服务，我**不把任何服务直接暴露到公网**。方便也好、应用本身多安全也好，我都不管。尤其现在有 AI 辅助的攻击，我觉得那单纯不智。
</div>

My ISP also uses CGNAT for its IPv4 addresses, so my home network is not directly reachable from the public internet via IPv4. My VPN servers are only publicly routable on IPv6, a limitation that has some downsides but is workable for my use cases, and likely helps limit unfriendly attempted connections. The biggest downside is that my VPN will almost never function on a public Wifi network, since these rarely offer IPv6. When using my phone, I can disable Wi-Fi and connect over mobile data… if there is service.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我的运营商 IPv4 走的是 CGNAT，所以家庭网络无法被公网通过 IPv4 直接访问。我的 VPN 服务只在 IPv6 上可公网路由——这有限制，也有好处，至少能挡掉不少不友好的连接尝试。最大的毛病是：公共 Wi-Fi 几乎不提供 IPv6，所以 VPN 在公共 Wi-Fi 上基本用不了。用手机时，我可以关掉 Wi-Fi 走移动数据……前提是有信号。
</div>

I prefer running services natively when possible, but will containerize complex services or those with many dependencies. Love: a service that's a single Go binary. A service that only comes as a Docker compose file and wants to run MySQL, Redis, and three other containers? I'm already looking for an alternative.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：能原生跑，我优先原生跑；复杂的、依赖多的服务才容器化。真爱是那种"单个 Go 二进制"的服务。至于只以 Docker compose 形式发布、一上来就要 MySQL、Redis 外加三个容器的家伙？我已经在找替代品了。
</div>

If the dependencies aren't overwhelming, native is better, faster, and more efficient. I can use the same management tools and commands across multiple services. There's no mental overhead of having to get into this container to run some command, finding out this container is missing curl, that one runs busybox so all the arguments are different, or dealing with a virtual network and host port mapping.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：只要依赖不夸张，原生就是更好、更快、更省。所有服务能用同一套工具、同一套命令来管。也没有那种心智负担：钻进某个容器里执行命令，结果发现这容器没装 curl，那个跑的是 busybox 所以参数全不一样，还得操虚拟网络和宿主机端口映射。
</div>

Related, I don't do Docker anymore. It's not really a principled position, but I grew tired of having to manage a completely separate service control system on my server. I'm already using systemd, and at this point Podman's integration with systemd is excellent.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：顺带一提：我不再用 Docker 了。这算不上什么原则立场，只是我厌倦了在服务器上还要额外维护一套完全独立的服务控制系统。我本来就在用 systemd，而现在 Podman 与 systemd 的集成已经非常好。
</div>

## Hardware

Last year I bought a Beelink Mini PC, specifically an S12 Pro with an Intel N100 processor, 16 GB RAM, and a 512 GB internal SSD. It was before the rampocalypse, so I paid EUR 180. The same listing on Amazon is currently EUR 359. Ouch! Attached to the server is a 6 TB hard drive for media storage.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：去年我买了一台零刻（Beelink）迷你主机，具体型号 S12 Pro：Intel N100、16 GB 内存、512 GB 内置 SSD。那是在"内存末日"之前，花了我 180 欧。同一个商品链接现在在亚马逊要 359 欧。心疼！服务器上还挂了一块 6 TB 硬盘存媒体文件。
</div>

My comment on Hacker News about what I self-host prompted some questions about how all of this could run on 16 GB RAM. As I describe below, there are some choices I've made that reduce resource demand on my server, but ultimately it turns out you don't need much hardware to run a lot of stuff. Obviously I'm not running any local inference on this hardware, but for everything non-AI, it has just worked out of the box, or with some simple configuration tweaks.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我在 Hacker News 上那条讲自托管的评论引来了不少疑问：这些东西怎么可能全靠 16 GB 内存跑起来？下面我会讲到一些我为降低服务器资源占用所做的取舍，但归根结底——你不需要多强的硬件就能跑很多东西。当然，我不会在这台机器上跑任何本地推理；但除了 AI 以外的一切，它要么开箱即用，要么稍微调点配置就好。
</div>

## Services

*In alphabetical order.*

### Actual Budget

Budgeting software with desktop clients and a web application, custom reports, and rules-based categorization. I only use this for budgeting and checking/savings/credit accounts. For tracking investment accounts, I use a cloud service. Some day I'll try to move away from the latter…

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：记账软件，有桌面客户端和网页版，支持自定义报表和基于规则的自动分类。我只用它做预算和活期/储蓄/信用卡账户。投资账户的追踪还在用云服务，总有一天要搬走……
</div>

While Actual Budget supports automatic transaction import from various banks, I don't use this feature. Instead, after each month end, I download the prior month's transactions (OFX format preferred, CSV if no other option) and import them manually. This works for me because I primarily use Actual Budget for expense tracking, not… actual… budgeting.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：它支持从各家银行自动导入流水，但我不用这功能。我是在每月月底把上个月的流水下载下来（优先 OFX 格式，实在没有就 CSV）手动导入。这样对我来说没问题，因为我主要拿它记支出，而不是真的在做……预算。
</div>

<div class="runmode">Podman 容器</div>

### Audiobookshelf

Add, download and store audiobooks and podcasts on your server, listen to them on your phone. I haven't used the audiobook feature much, I set it up more for my kids, but it has very nice chapter handling. In the past for podcasts I used PlayerFM, then Pocket Casts, but now unless I'm out of the house without VPN connectivity, I use Audiobookshelf.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：有声书与播客服务器——在服务器上添加、下载、存放，在手机上收听。有声书功能我用得不多，主要是给孩子搭的，但它的章节处理做得非常好。播客我以前用 PlayerFM，后来用 Pocket Casts；现在除非出门在外又没有 VPN，我都用 Audiobookshelf。
</div>

<div class="runmode">Native 原生</div>

### Automatic Ripping Machine (ARM)

ARM automates ripping and transcoding DVDs (and Blu-rays, but I don't do those). Yes, it's 2026 and I still rip DVDs. Remember, we cut the cord, so not only is this a conduit for new-to-us content, but it's also a way for us to get bilingual content (English and French).

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：ARM 自动抓取并转码 DVD（也能处理蓝光，但我不弄蓝光）。是的，2026 年了，我还在抓 DVD。别忘了我们"剪了线缆"——所以这既是获取"对我们而言的新内容"的渠道，也是拿到双语（英/法）内容的手段。
</div>

<div class="runmode">Podman 容器</div>

### Backrest

Web UI for Restic backup software. Backups are important! Especially for Immich (photos). Restic does a good job deduplicating and compressing backed up data, and Backrest makes it easy to manage the storage retention policies. Notifications in case of failure go to Gotify.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Restic 备份软件的 Web 界面。备份很重要！尤其是 Immich 里的照片。Restic 对备份数据的去重和压缩做得很好，Backrest 让存储保留策略的管理变简单。失败通知发到 Gotify。
</div>

<div class="runmode">Native 原生</div>

### Beszel

Beszel is a simple monitoring dashboard that collects basic stats from agents (in the old-fashioned sense of a small background service) to display CPU load, memory and disk usage, temperature, battery, etc. Helps me keep an eye on various other hosts I have around the house (several Raspberry Pis and a Proxmox cluster that may be the subject of a future post).

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：一个简洁的监控面板，靠 agent（此处是"小后台服务"的老派含义）采集基础指标，展示 CPU 负载、内存与磁盘占用、温度、电池等。帮我盯着家里其他几台主机（几块树莓派，还有一个 Proxmox 集群，也许以后单独写一篇）。
</div>

<div class="runmode">Native 原生</div>

### Caddy

Caddy is a web server and reverse proxy. Early on I didn't understand the value of a reverse proxy, and I thought I would be fine accessing my services with a local DNS name, or even IP address, and port number. But then I started adding more and more services, and some required HTTPS. So I got a domain name (not this one) and set up Caddy to automatically obtain LetsEncrypt SSL certificates, and now nearly all of my services are accessible on my LAN (or over VPN) with HTTPS and friendly subdomain names. Adding a new service is a quick edit to the Caddyfile.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Web 服务器兼反向代理。早期我并不理解反代的价值，觉得用内网 DNS 名、甚至 IP 加端口访问也够了。但服务越加越多，有些必须要 HTTPS。于是我买了个域名（不是这个站），用 Caddy 自动申请 Let's Encrypt 证书，现在几乎所有服务都能通过内网（或 VPN）以 HTTPS 加好记的子域名访问。加一个新服务就是改一下 Caddyfile。
</div>

<div class="runmode">Native 原生</div>

### Cockpit

Cockpit is a web-based admin console for the server. It uses normal system authentication methods. For me, it's mainly useful for spotting failed services when no notifications are set up for them.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：服务器的 Web 管理控制台，走系统自带的认证。对我来说，它最大的用处是：那些没配通知的服务挂了，我能在这儿一眼看出来。
</div>

<div class="runmode">Native 原生</div>

### Forgejo

Forgejo is a fork of Gitea, and deploys as a single binary. Github's uptime is the butt of a lot of jokes these days, but I also appreciate the speed of having my own git remote. Eventually I'll set up CI/CD and runners, if only to deploy this blog.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Gitea 的分支，单二进制部署。这年头 GitHub 的可用性常被拿来当笑话，但我也很享受自己有个 git remote 的那种速度感。以后会配 CI/CD 和 runner——哪怕只是为了部署这个博客。
</div>

<div class="runmode">Native 原生</div>

### FreshRSS

Web-based [RSS reader](https://freshrss.org). These days I basically visit two websites, though, so I've not been using it much. I do subscribe to the Github releases of some of the services I self-host so I can check out the features and bugfixes in new versions.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：网页版 RSS 阅读器。不过如今我基本上只逛两个网站，所以用得不多。我确实订阅了一些自托管服务的 GitHub release 源，好用来看新版本加了什么功能、修了什么 bug。
</div>

<div class="runmode">Native 原生</div>

### Frigate

Network video recorder (NVR). I first started with Zoneminder because I'm of a certain age. But it became clear that Zoneminder is past its prime. Frigate has been fantastic. I run it with 8 IP cameras. It provides alerts for people and cars entering the driveway, integrates with Home Assistant to power various automations (e.g., when a person is detected in the backyard, turn on the camera floodlight). I may write a future post with some details about my IP camera adventures.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：网络录像机（NVR）。我最早用的是 Zoneminder——毕竟我这把年纪了。但很明显 Zoneminder 已经过了它的黄金期。Frigate 则非常棒：我接 8 路 IP 摄像头，它会对进入车道的行人和车辆告警，还能接入 Home Assistant 驱动各种自动化（比如后院检测到人就打开摄像头补光灯）。以后也许单独写一篇聊聊我折腾 IP 摄像头的经历。
</div>

I run all of my cameras at lower resolutions than they support, primarily to avoid Wi-Fi network congestion. Most cameras also support an even lower-resolution RTSP substream, which is what Frigate uses for motion and object detection. Keeping the camera resolutions low avoids excessive CPU and memory from video processing, and excessive disk usage from recordings. They are good enough to identify faces, and privacy laws in my country prohibit filming public rights of way, so my cameras are not aimed at distant points.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我所有摄像头的分辨率都调得比它们支持的更低，主要是为了避免 Wi-Fi 拥塞。多数摄像头还支持更低分辨率的 RTSP 子码流，Frigate 用子码流做移动侦测和目标识别。压住分辨率，就避免了视频处理吃掉过多 CPU 和内存，也避免了录像占满硬盘。这个清晰度足够认人脸了；而且我国隐私法禁止拍摄公共通道，所以我的摄像头本来也不朝远处看。
</div>

<div class="runmode">Podman 容器</div>

### Gonic

Subsonic-compatible server written in Go. I purchased a perpetual Subsonic license a long time ago, but the original project is ancient and the modern alternatives are better. I run two separate instances of Gonic, one serves kid music, the other serves adult music.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Go 写的、兼容 Subsonic 协议的服务器。我很多年前买过 Subsonic 的永久授权，但那个原项目太老了，现代替代品更好。我跑了两套 Gonic 实例：一套放儿童音乐，一套放大人音乐。
</div>

<div class="runmode">Native 原生</div>

### Gotify

Simple notification service written in Go. Many self-hosted services directly support Gotify notifications, or can send them via a custom HTTP POST. In conjunction with Uptime Kuma, I use Gotify to get notifications about any services or devices that are down, what my kids are watching on Jellyfin, when a new podcast episode is available in Audiobookshelf, etc.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Go 写的简易通知服务。很多自托管服务原生支持 Gotify 通知，或者可以发一条自定义 HTTP POST 过来。配合 Uptime Kuma，我用它接收这些提醒：哪些服务或设备挂了、孩子正在 Jellyfin 上看什么、Audiobookshelf 里有没有新的播客单集，等等。
</div>

<div class="runmode">Native 原生</div>

### Home Assistant

Home Assistant probably deserves its own post. It's fantastic, and I cannot imagine trying to accomplish the same things within a proprietary ecosystem like Google Home, Amazon Alexa, or Apple Home. Things are better now that device manufacturers are standardizing on protocols like Matter, but the control and flexibility you get with Home Assistant is hard to beat.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Home Assistant 大概值得单独写一篇。它太棒了，我无法想象在 Google Home、Amazon Alexa 或 Apple Home 那种封闭生态里实现同样的事。如今设备厂商在 Matter 这类协议上标准化，情况比过去好，但 Home Assistant 给你的控制力和灵活性依然很难被超越。
</div>

It has a steep learning curve, though, and I need to think about realistic ways to handle potential server failure without compromising the functionality of my home.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：不过它的学习曲线很陡。而且我得认真想想：万一这台服务器挂了，怎么在不牺牲全屋功能的前提下兜住这个风险。
</div>

<div class="runmode">Podman 容器</div>

### Homepage

At some point I realized I was running so many services, I needed another service just to keep track of them all. Homepage was a good solution. It has widgets for almost all the services I run, so I can get a quick overview of what's going on, or just a quick link to the subdomain of a service.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：某天我意识到自己跑的服务多到需要再跑一个服务来管它们。Homepage 是个好方案：几乎我为每个服务都配了 widget，既能快速扫一眼当前状况，也能一键跳到某个服务的子域名。
</div>

<div class="runmode">Podman 容器</div>

### Immich

Google Photos alternative. I was tired of Google constantly promoting paid storage plans in their apps. I was able to manage my storage space, but my wife was always about to run out of room. We moved to Immich last year, just after version 2 was released. It's much faster to load pages full of photos when all the network activity is within your house. I've come up with a solution for sharing albums with family, as well.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Google Photos 的替代品。我受够了 Google 在自家 App 里不停地推销付费存储方案。我自己还能管住空间，但我太太的额度永远快用完了。去年 Immich 2.0 刚发布，我们就搬了过去。当所有网络流量都在自家屋里跑，加载满屏照片快得多。我还想了个办法跟家人共享相册。
</div>

Still a lot of work to do with Immich - I have many duplicates, and now that storage isn't a concern, I've been less disciplined about culling photos and videos.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Immich 这边还有不少活要干——重复照片一大堆，而且存储不再是问题之后，我删照片和视频就越来越不自律了。
</div>

<div class="runmode">Podman 容器</div>

### Jellyfin

As I mentioned in the introduction, I've self-hosted media for a long time, going all the way back to MythTV twenty-some years ago. Jellyfin is opinionated about its media organization, but it generally works well. I only use it for movies, TV, and home videos, so I can't speak to its other features (e-books, music, photos, etc.).

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：前面提过，我自托管媒体很久了，一路能追到二十多年前的 MythTV。Jellyfin 对媒体文件的组织方式有它自己的坚持，但总体很好用。我只用它放电影、剧集和家庭录像，所以它的其他功能（电子书、音乐、照片等）我没资格评价。
</div>

While my son still remembers Netflix, he is satisfied with Jellyfin. I appreciate the lack of auto-play, never seeing recommendations, and not having to scroll past a bunch of garbage to find what I want to watch. One of my ways of managing resource demand is by generally preferring 720p media over 1080p or higher.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我儿子虽然还记得 Netflix，但对 Jellyfin 是满意的。我很享受这些：没有自动连播、永远看不到"推荐"、也不必滑过一堆垃圾才找到想看的。我控制资源消耗的办法之一，就是整体上偏好 720p 而不是 1080p 或更高。
</div>

And obviously when ripping DVDs, it's either 576p or 480p. I do have a 4k TV, but it's not extremely large, and while I can tell the difference in resolution between SD and HD, for almost everything, 720p seems to be good enough for me.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：当然，抓 DVD 那就是 576p 或 480p 了。我确实有台 4K 电视，但尺寸不算特别大；SD 和 HD 的清晰度差异我看得出来，可对几乎所有内容来说，720p 对我就够好了。
</div>

<div class="runmode">Podman 容器</div>

### Music Player Daemon (MPD)

Sometimes there are solutions that just work, and don't really need to change. I think MPD is one of these. It's been around for 23 years. While Gonic is great for listening to music on my phone, even streaming music from home to my phone while I'm away via VPN, MPD is how I play music through Snapcast to the whole house audio system. I run two instances of MPD, one for music, and one for podcasts.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：有些方案就是好用，根本不需要改，MPD 我觉得就是其中之一——它已经存在 23 年了。在手机上听歌（甚至在外通过 VPN 从家里串流到手机）靠 Gonic 很好用；而通过 Snapcast 把音乐推到全屋音响，靠的是 MPD。我跑两套 MPD 实例：一套放音乐，一套放播客。
</div>

<div class="runmode">Native 原生</div>

### PocketBase

I used to keep track of transactions and receipts for special accounts (HSA, 529, etc.) in a SQLite file I accessed directly with SQL Workbench/J. But things became more complicated as I moved between countries, currencies, and different insurance systems, and also wanted to offer my wife the ability to enter transactions.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：以前我用 SQL Workbench/J 直接打开一个 SQLite 文件，记录特殊账户（HSA、529 之类）的流水和票据。但后来事情复杂起来：我在不同国家、不同货币、不同保险体系之间辗转，还希望让我太太也能录入流水。
</div>

I migrated to PocketBase, which is ultimately still just a SQLite file, but with a nice web-based management frontend that I abuse as a generic CRUD frontend. It's simple enough for my wife to use as well, and I can still run arbitrary queries against the underlying database file.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：于是迁到了 PocketBase——它本质上还是一个 SQLite 文件，只是配了个好用的 Web 管理界面，被我当成通用 CRUD 前端在使。简单到我太太也能上手，同时我依然可以直接对底层数据库文件跑任意查询。
</div>

<div class="runmode">Native 原生</div>

### Readeck

Readeck lets me tag and archive copies of stuff I read. I was a heavy Zotero user in graduate school, but I've not needed to write a bibliography in years. However, I still read things that I want to ensure I can access later. I tried Wallabag first, but it had trouble archiving things that were paywalled, even when I was logged in on my phone. In contrast, Readeck will archive what my phone is seeing and store it on my server.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Readeck 让我给读过的内容打标签、存存档。研究生时代我是 Zotero 重度用户，但已经好几年不需要写参考文献了。不过我还是会读一些希望日后能确保访问得到的东西。我先试了 Wallabag，但它处理付费墙内容很吃力——哪怕我手机上已经登录了。相比之下，Readeck 会把我手机屏幕上看到的内容存下来，放在我的服务器上。
</div>

<div class="runmode">Native 原生</div>

### Samba

Samba provides shared network storage, making it easy to copy files to and from the server, or share important documents with my wife. It's funny how a file sharing protocol first developed in the 1980s and most associated with Windows remains the best option for cross-platform file sharing on a LAN.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Samba 提供网络共享存储，往服务器拷文件、或者跟太太共享重要文档都很方便。挺有意思的：一个上世纪 80 年代开发出来、最与 Windows 绑定的文件共享协议，至今仍是局域网跨平台共享的最佳选择。
</div>

<div class="runmode">Native 原生</div>

### slskd

IYKYK.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：懂的都懂。（Soulseek 的现代化 Web 前端，用于 P2P 分享音乐。）
</div>

<div class="runmode">Native 原生</div>

### Snapcast

Snapcast provides whole-house synchronized audio. Think Sonos, but without the expensive vendor lock-in and planned obsolescence. This also deserves its own post. It's complicated to set up, but it works really well. I eventually plan to purchase some additional devices primarily for use as Snapcast receivers.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Snapcast 提供全屋同步音频。可以理解成 Sonos，但没有昂贵的厂商锁定和计划性淘汰。这也值得单独写一篇。配置挺复杂，但效果非常好。我最终打算再买几台设备，主要就是当 Snapcast 接收端用。
</div>

<div class="runmode">Native 原生</div>

### Syncthing

Syncthing is part of a backup strategy for my photos in Immich. I've set up a one-way sync (receive only) on my Macbook, so that a copy of all the photos in Immich eventually make their way to my Macbook's external drive.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Syncthing 是我 Immich 照片备份策略的一环。我在 MacBook 上设了单向同步（receive only），这样 Immich 里所有照片的副本最终都会落到 MacBook 的外接硬盘上。
</div>

<div class="runmode">Native 原生</div>

### Transmission Daemon

This one is also [self-explanatory](https://transmissionbt.com).

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：这个也不言自明（BitTorrent 客户端，常驻后台）。
</div>

<div class="runmode">Native 原生</div>

### Uptime Kuma

After a few instances of my wife saying "X isn't working" and needing to restart a service manually, I realized I needed a way to keep track of what services were running, or not. Uptime Kuma is simple but has a useful set of features.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：在太太几次说"X 用不了了"、而我得手动重启服务之后，我意识到得有个办法掌握哪些服务在跑、哪些没跑。Uptime Kuma 很简洁，但功能挺实用。
</div>

I can ping devices to ensure they're online, check the status of Podman containers, look for HTTP 2XX response codes from various services, or even parse a JSON payload and extract some details for the health check. If something goes down, I can send a Gotify notification (after a few retries, of course).

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我可以 ping 设备确认在线、检查 Podman 容器状态、看各个服务是否返回 HTTP 2XX，甚至解析 JSON 载荷、从中抽字段做健康检查。一旦有东西挂了，就发一条 Gotify 通知（当然，先重试几次）。
</div>

<div class="runmode">Podman 容器</div>

### Vaultwarden

Self-hosted version of Bitwarden. For years, I used [KeePass](https://keepass.info), but never had a good syncing solution, so just avoided logging into things on my phone. Meanwhile, my wife used LastPass, which had various breaches and incidents, besides autofill just not working very well.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：自托管的 Bitwarden。我用了好几年 KeePass，但一直没找到好用的同步方案，索性就不在手机上登录任何账号。而我太太在用 LastPass——它出过好多次泄露和事故，自动填充也不太好使。
</div>

Migrating her to KeePass was not practical, and I settled on VaultWarden, which is an open-source API-compatible reimplementation of BitWarden that works with the official BitWarden clients. I'm not a huge fan of the BitWarden browser extension, but it's mostly fine.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：让她迁移到 KeePass 不现实，于是我选定了 Vaultwarden——它是 Bitwarden 的开源、API 兼容的重实现，可以配合官方客户端使用。我不是 Bitwarden 浏览器扩展的粉丝，但基本够用。
</div>

The Android application is good enough, and syncs seamlessly and automatically when I'm connected to my LAN; otherwise, I can connect via VPN and manually trigger a sync if needed. I am a little concerned that Bitwarden may eventually become hostile to VaultWarden and break the client compatibility. At this point, the only other major Bitwarden compatible client I'm aware of is Keyguard, which does not have an open source license and uses a freemium model.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：安卓应用够用，连着内网时会无缝自动同步；否则就走 VPN，需要时手动触发同步。我有点担心 Bitwarden 将来会对 Vaultwarden 不友好、破坏客户端兼容性。就我所知，目前另一个主要的 Bitwarden 兼容客户端是 Keyguard，但它是**闭源**的，而且是免费增值模式。
</div>

<div class="runmode">Podman 容器</div>

### Vikunja

I've been a Trello user for about a decade. But after Trello's disastrous multi-day outage earlier this year, I decided to find a self-hosted alternative. I ruled out anything that involved spinning up a PostgreSQL or MySQL database for a service that will serve two users. Vikunja uses SQLite by default, though it can be configured to use other database backends.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我做 Trello 用户大约十年了。但今年年初 Trello 那次灾难性的多日宕机之后，我决定另找一个自托管替代品。凡是"只服务两个用户却要拉起 PostgreSQL 或 MySQL"的方案，我一概排除。Vikunja 默认用 SQLite，也可以配置成别的数据库后端。
</div>

It's not perfect, and the Android application has some missing features, but it's good enough for me. Single binary deployment? Yes, please.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：它不完美，安卓应用也缺一些功能，但对我够用。单二进制部署？求之不得。
</div>

<div class="runmode">Podman 容器</div>

### Yubal

Simple web application to download YouTube Music playlists. I normally use yt-dlp for downloading YouTube videos, or NewPipe for watching on my phone, but Yubal will properly name, organize, and tag music downloaded from YouTube Music.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：用来下载 YouTube Music 播放列表的简易 Web 应用。我平常下 YouTube 视频用 yt-dlp，手机上观看用 NewPipe；但 Yubal 能把从 YouTube Music 下来的音乐正确命名、整理并写入标签。
</div>

<div class="runmode">Podman 容器</div>

## Non-Services

*Here are a few things I don't self-host, tried but decided against, or am unlikely to try.*

### The *arr Stack

Sonarr, Lidarr, Radarr, etc. Every time I read about setting it up, it just sounds like a resource-intensive mess that's fundamentally prone to frequent breakage. That's the opposite of what I'm looking for when choosing self-hosted services.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：Sonarr、Lidarr、Radarr 这一套。每次读到它们的配置教程，听起来都像一团吃资源、而且天生容易三天两头坏掉的东西。这跟我选自托管服务的标准正好相反。
</div>

### Collabora Online

While it would be nice to completely part ways with Google, it's hard to beat Google Docs as a highly convenient and easily accessible way to store and share information. Still, I choose LibreOffice Writer and Calc unless I have a specific reason why the document needs to be in the cloud.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：能彻底跟 Google 分家当然好，但作为"极方便、随处可取"的信息存储与共享方式，Google Docs 真的很难被超越。不过我平时还是用 LibreOffice 的 Writer 和 Calc——除非有明确理由需要文档待在云上。
</div>

Since I already have a shared network drive, it seems pointless to run a service like Collabora Online (a web-based office suite) instead of just using LibreOffice locally.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：既然我已有共享网络盘，再跑一个 Collabora Online（网页版办公套件）而不用本地 LibreOffice，就显得毫无意义。
</div>

### Firefly III

I tried Firefly III before Actual Budget, thinking I needed built-in support for multiple currencies. It was a complex setup, involving multiple containers, including a container just for importing data. Actual Budget was much simpler to set up and use.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：在 Actual Budget 之前我试过 Firefly III，以为自己需要原生多币种支持。结果配置很复杂，要跑好几个容器，其中一个还专门负责导入数据。Actual Budget 的搭建和使用都简单得多。
</div>

For my foreign currency accounts, I have my own simple script to handle exchange rate conversion, so everything in Actual Budget stays in USD.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：外币账户我用自己写的一个小脚本处理汇率换算，这样 Actual Budget 里的一切都保持美元计价。
</div>

### Owntracks

I like Google Maps Timeline, but after Google limited the location data to the individual device, I hoped to find a self-hosted version. But I could never get the OwnTracks Android application to consistently report my position, no matter how many battery or location settings I tried.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：我喜欢 Google Maps 的时间轴，但 Google 把位置数据限制在单台设备上之后，我就想找个自托管版本。可不管我怎么调电池和定位设置，OwnTracks 的安卓应用就是没法稳定上报我的位置。
</div>

Dawarich is another option in this space, but it wants to run "at least" four containers (PostgreSQL, Redis, Sidekiq, web application). For me, that's not a compelling trade of resources required versus value I'm likely to obtain.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：这个方向上还有个选择叫 Dawarich，但它要跑"至少"四个容器（PostgreSQL、Redis、Sidekiq、Web 应用）。对我来说，拿这么多资源换这点价值，不划算。
</div>

### Music Assistant

Music Assistant might work better for you if you don't already have a music setup you like. In my case, I already had Gonic, Snapcast, and MPD working well. Music Assistant felt like it wanted to "own" everything; for example, it seemed to continually rearrange my Snapcast device groups.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：如果你手上还没有一套自己满意的音乐方案，Music Assistant 对你也许更合适。但在我这儿，Gonic、Snapcast 和 MPD 已经运转良好。Music Assistant 给人的感觉是它想"占有"一切——比如它总在重排我的 Snapcast 设备分组。
</div>

### E-mail

Self-hosting e-mail seems like a lot of work for very little benefit. I cannot risk not being able to send or receive e-mails. Eventually I would like to transition away from Gmail to a paid provider.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：自托管邮件看起来是工作量巨大、收益极小。我不能冒"收发不了邮件"的险。以后我想从 Gmail 迁到一个付费服务商。
</div>

## Conclusion

That's 17 native services and 11 Podman services, all managed by systemd. htop currently shows about 7.5 GB of memory in use, and CPUs fluctuating between 30% and 40%. It turns out this Mini PC can run a lot!

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：这样算下来是 17 个原生服务加 11 个 Podman 服务，全部由 systemd 管理。htop 现在显示内存占用约 7.5 GB，CPU 在 30%–40% 之间波动。看来这台迷你主机能跑的东西真不少！
</div>

Given how expensive computer hardware has become due to the AI crunch, I hope we'll continue to see self-hostable projects that prioritize simplicity and efficiency.

<div class="tr" style="margin:-10px 0 26px;padding:2px 0 2px 14px;border-left:2px solid #e6dfd2;color:#8d8577;font-size:14px;line-height:1.75;">
译文：考虑到 AI 热潮把电脑硬件价格推得这么高，我希望继续看到那些把"简洁"和"高效"放在第一位的自托管项目。
</div>

---

> **Original / 原文**：[What I Self-Host](https://viceconsole.fyi/blog/2026/10/10/what-i-self-host/) · *viceconsole.fyi* · 2026-10-10
>
> 英文正文版权归原作者所有；中文译文为学习交流用途。译文力求准确，术语尽量保留原文（Podman / native / CGNAT / NVR 等），便于对照阅读。

<style>
.runmode{
  display:inline-block;
  font-size:11.5px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:#8c8375;
  background:#f7f3ea;
  border-radius:999px;
  padding:3px 12px;
  margin:-14px 0 34px;
}
.runmode::before{content:"▸ ";color:#b9ae99;}
@media (max-width:640px){
  div[class="tr"]{margin:-8px 0 22px !important;font-size:13.5px !important;}
  .runmode{margin:-12px 0 26px;font-size:11px;}
}
</style>

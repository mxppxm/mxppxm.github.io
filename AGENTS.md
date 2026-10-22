# 配图规范（blog）

> 本文件是本站文章配图的**强制规范**。新增／修改文章配图时请对照执行。
> 覆盖范围：`src/content/articles/*.md`（正文图、封面图）。

## 1. 硬性要求

1. **所有配图都可点击预览大图（灯箱）** —— 正文图与文章封面图一视同仁。
2. **正文图用裸 HTML `<figure>` + `<figcaption>`**，图注必填（灯箱底部展示的就是它）：
   ```html
   <figure>
     <img src="/images/<slug>/01-xxx.jpg" alt="一句话描述画面内容" loading="lazy" />
     <figcaption>图注：这张图在讲什么</figcaption>
   </figure>
   ```
3. **禁止用链接包裹图片**：`<a href="..."><img …></a>` 或 markdown `[![](img)](url)`
   —— 灯箱会自动跳过链接内的图片（保留原链接行为），等于这张图没预览。
4. **图片必须本地化**，放在 `public/images/<slug>/`，正文引用 `/images/<slug>/xxx.jpg`。
   不要外链 CDN / 不要热链第三方图床（外链挂了文章就残）。
5. **`alt` 必填且描述画面**：图注缺失时灯箱回退显示 alt。
6. **宽度 < 120px 的小图／图标不要塞进正文图位**，灯箱会跳过它（避免把 logo、装饰小图也弹成大图）。
7. **超长图（条漫、长截图）直接放原图**，不用切图、不用加特殊标签：
   灯箱检测到「按屏幕高度适配后宽度不足屏幕 45%」时，会自动改为**按宽度铺满 + 纵向滚动**查看。
8. 文件名建议英文／拼音 + 连字符（如 `01-night-city.jpg`）；已上线的历史文件不要改名。
9. 封面图走 frontmatter `image:` 字段，同样支持点击预览，无需额外处理。

## 2. 灯箱行为速查（用户视角，用于验收）

| 操作 | 结果 |
| --- | --- |
| 点击正文图 / 封面图 | 打开预览，遮罩毛玻璃、图片缩放淡入 |
| `←` `→` / 左右圆钮 / 触屏左右滑动 | 上一张 / 下一张 |
| 点击图片本身 | 适应屏幕 ↔ 原始尺寸（原始尺寸下可滚轮／触摸滚动看细节） |
| `Esc` / 点击图片外的空白 | 关闭（并清空 src、解锁页面滚动） |
| 底部胶囊条 | 左：图注（`figcaption`，缺失回退 `alt`）；右：`当前 / 总数` |
| 单图页面 | 不显示序号与左右按钮 |

无预览的情况（设计如此）：图片被 `<a>` 包裹、带 `.no-lightbox`、在 `.lightbox` 内部、原始宽度 < 120px。

## 3. 实现位置（改功能请改这里，别另造一套）

- `public/js/lightbox.js` —— 零依赖 IIFE，全站引入；采集选择器：
  `.article-content img, .post-content img, .lightbox-scope img, .article-hero-image img`
- `public/css/style.css` —— 末尾 `LIGHTBOX` 段（`z-index: 100000`，高于站点噪点覆盖层）
- `src/layouts/BaseLayout.astro` —— `<script is:inline src="/js/lightbox.js" defer></script>`
- 需要给别的容器开预览：把容器加进 JS 的选择器列表，或给容器加 `lightbox-scope` 类。

## 4. 发布前自查清单

```bash
# 1) 找出用链接包裹的图（应为 0）
grep -rnoE '\[!\[[^]]*\]\([^)]*\)\]\([^)]*\)|<a [^>]*>\s*<img' src/content/articles/ | head

# 2) 找出外链图片（应为 0，除历史遗留外逐步迁移）
grep -rnoE 'src="https?://[^"]+\.(jpg|jpeg|png|webp|gif)' src/content/articles/ | head

# 3) 找出没有图注的裸 HTML 图
grep -rlE '<img [^>]*>' src/content/articles/ | xargs grep -LE '<figcaption>' | head

# 4) 构建 + 本地验收
npm run build && (cd dist && python3 -m http.server 4399)
```

浏览器验收：打开文章 → 点正文图与封面图 → 确认能开、能切换、图注正确、超长图能滚动。

---

## 5. 卡片宣传片（AI 100 产品卡，2026-10-22 起）

产品卡上可以挂一段「宣传片」，点按钮 → 居中弹窗播放（**带声音**，浏览器原生控制条）。

| 项 | 约定 |
| --- | --- |
| 媒体存放 | R2（`r2-blog:mxppxm-blog-images/images/videos/`），禁止放 `public/images` |
| 片源要求 | **必须带音轨**（弹窗要出声），720p / CRF27 / aac 96k / `+faststart`，单条控制在 3MB 内 |
| 封面 | 同目录 `*-poster.jpg`，`promoPoster` 必填，避免开窗闪白 |
| 数据字段 | `src/data/ai-products.ts`：`promoVideo` / `promoPoster` / `promoLabel` |
| 卡片结构 | 底部 `.ai100-actions`（左标签、右按钮），按钮 `.ai100-play-btn` 带 `data-promo-*` |
| 逻辑 | `public/js/card-video-modal.js`（零依赖 IIFE，全站一个弹窗节点，懒创建） |
| 样式 | `public/css/style.css` 末尾 `CARD VIDEO MODAL` 段（`z-index: 100000`，与灯箱同级） |

**踩过的坑，别再踩：**
1. 按钮在卡片的 `<a>` 里 → 事件必须走**捕获阶段** + `preventDefault()`，否则一点就跳站外。
2. 卡片内的类名别用 `.ai100-foot`／`.ai100-foot-note`，那是页面级页脚行占用的（卡片内用 `.ai100-actions`）。
3. 手机端没有 hover，交互一律用「点击」，不要做悬停触发。

给别的卡加片：转好 mp4 传 R2 → 在该产品的字段里填 `promoVideo` / `promoPoster`，不用改代码。
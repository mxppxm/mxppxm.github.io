/**
 * 九日的 100 个 AI 产品 —— 数据源
 *
 * 以后新增产品：往 aiProducts 数组里追加一条即可（编号 no 顺延）。
 * 首页模块与 /ai-products/ 专区页都会自动读取这里，无需改任何页面代码。
 *
 * 字段说明：
 *   no          序号（1-100），也是卡片上显示的大数字
 *   name        产品名
 *   tagline     一句话卖点（卡片标题下方的小字）
 *   desc        2-3 句介绍，讲清楚"它能干什么"
 *   url         链接：站内写 "/xxx/"；站外写完整 https 地址
 *   external    站外链接填 true（会新开窗口）
 *   icon        图标：emoji 字符串，或图片路径（此时 iconImage: true）
 *   iconImage   图标是图片时填 true
 *   tags        标签，2-4 个
 *   addedAt     收录日期 YYYY-MM-DD
 *   status      "live" 已上线 / "beta" 测试中
 */

export const AI_PRODUCT_TOTAL = 100;

export type AiProduct = {
  no: number;
  name: string;
  tagline: string;
  desc: string;
  url: string;
  external?: boolean;
  icon: string;
  iconImage?: boolean;
  tags: string[];
  addedAt: string;
  status?: "live" | "beta";
};

export const aiProducts: AiProduct[] = [
  {
    no: 1,
    name: "皮肤检测器",
    tagline: "拍张照，AI 给你的皮肤做一次全面体检",
    desc:
      "上传自拍或当场拍摄，AI 自动定位面部，给出水分、油脂、敏感、衰老、痘痘、色素六个维度的评分与雷达图，再配一套早晚护肤流程和个性化建议。报告可保存、可分享，不用注册。",
    url: "https://skin-doctor.netlify.app/",
    external: true,
    icon: "/logo.png",
    iconImage: true,
    tags: ["React", "TypeScript", "多模型 AI", "Netlify"],
    addedAt: "2026-10-20",
    status: "live",
  },
  {
    no: 2,
    name: "帮你 P 图",
    tagline: "选几张照片，AI 看一眼就知道该怎么修",
    desc:
      "PixForge 出品。把照片丢进去，AI 先看一眼判断该怎么修，然后直接修给你——不用调参数，也不用写提示词。免注册就能免费试用 3 次，登录后继续用。",
    url: "https://pix.ziqianyijia.cn/",
    external: true,
    icon: "/images/ai-products/pixforge.svg",
    iconImage: true,
    tags: ["Next.js", "AI 修图", "免注册试用"],
    addedAt: "2026-10-20",
    status: "live",
  },
  {
    no: 3,
    name: "四级搭子",
    tagline: "四级单词，找个搭子一起背",
    desc:
      "按考试倒计时自动排好每天该背多少，从历年真题高频词背起，每天十几分钟就能完成当天的量。可以和朋友互相当搭子，互相监督、PK 进度，也能用邀请码拉人组队，一个人背不下去的时候有人盯着。",
    url: "https://cet4.ziqianyijia.cn/",
    external: true,
    icon: "/images/ai-products/cet4-dazi.svg",
    iconImage: true,
    tags: ["英语四级", "背单词", "学习搭子"],
    addedAt: "2026-10-22",
    status: "live",
  },
];

/** 已上线的产品，按编号升序 */
export const liveProducts = [...aiProducts].sort((a, b) => a.no - b.no);

/** 已收录数量 */
export const liveCount = liveProducts.length;

/** 下一个空位编号（用于占位卡片） */
export const nextSlot = liveCount + 1;
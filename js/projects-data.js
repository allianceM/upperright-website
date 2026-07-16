/* UPPERRIGHT — project detail pages data
   media item types: {vimeo:"id"} {youtube:"id"} {mp4:"path"} {img:"path"}
   ratio: "16x9"(default) | "9x16" | "3x4" */
window.PROJECTS = {

  "popmart": {
    brand: "POP MART", title: "Let's POP Cheers!",
    tags: "AI × FILM · CAMPAIGN · 2025",
    client: "POP MART", year: "2025",
    services: ["Creative Planning", "AI Art Direction", "AI × Live-action Production", "Post & VFX"],
    desc_en: "An AI felt-wool universe built from scratch and fused with live-action — a theme film for POP MART's anniversary campaign. Every character, texture and world was designed and generated through our AI-native pipeline, then composited with filmed footage into one continuous toast.",
    desc_zh: "为泡泡玛特周年营销打造的主题影片:一个从零构建的 AI 毛毡宇宙,与实拍画面无缝融合。每一个角色、材质与世界观都经由我们的 AI 原生管线设计生成,再与实拍镜头合成为一场连续的举杯。",
    cover: "assets/img/popmart-cheers.jpg",
    media: [{ mp4: "assets/video/popmart-cheers.mp4", ratio: "3x4" }],
    next: "lenovo-days"
  },

  "lenovo-days": {
    brand: "LENOVO", title: "Days at Lenovo",
    tags: "EMPLOYER BRAND · GLOBAL · FILM",
    client: "Lenovo HR", year: "2025",
    services: ["Creative Planning", "TVC Production", "Global Localization"],
    desc_en: "What does it really mean to work at a global company? A globally-distributed employer-brand film for Lenovo HR, following one question across offices, time zones and lives — shot with an international cast and released on Lenovo's global channels.",
    desc_zh: "在一家全球化公司工作,究竟意味着什么?为联想 HR 打造的全球雇主品牌影片,让一个问题穿越办公室、时区与生活。国际班底拍摄,于联想全球官方渠道发布。",
    cover: "assets/img/days-at-lenovo.jpg",
    media: [{ youtube: "Vyz01CYM9jc" }],
    next: "lenovo-tech-world"
  },

  "lenovo-tech-world": {
    brand: "LENOVO", title: "Tech World",
    tags: "TVC · LAUNCH",
    client: "Lenovo", year: "2023",
    services: ["Creative Planning", "TVC Production"],
    desc_en: "The opening film for Lenovo Tech World — turning a keynote into a story. We compressed Lenovo's technology narrative into a launch film that sets the tone before a single word is spoken on stage.",
    desc_zh: "联想 Tech World 大会主题影片——把一场发布会开场变成一个故事。我们将联想的技术叙事浓缩成开场影片,在演讲开始之前,先为整场大会定下基调。",
    cover: "assets/img/lenovo-tech-world.jpg",
    media: [{ vimeo: "1210537099" }],
    next: "lenovo-40th"
  },

  "lenovo-40th": {
    brand: "LENOVO", title: "40th Anniversary",
    tags: "EMPLOYER BRAND · 40TH",
    client: "Lenovo", year: "2024",
    services: ["Creative Planning", "Documentary Production", "Interview"],
    desc_en: "Forty years, told by the people who lived them. An anniversary film built on first-person interviews and archival footage — eighteen individuals as a microcosm of four decades of making.",
    desc_zh: "四十年,由亲历者讲述。以第一人称访谈与历史影像构筑的联想 40 周年影片——十八个人,浓缩四十年的造物历程。",
    cover: "assets/img/lenovo-40th.jpg",
    media: [{ vimeo: "1210537098" }],
    next: "lenovo-womens-day"
  },

  "lenovo-womens-day": {
    brand: "LENOVO", title: "The Answer Is Nearby",
    tags: "INTERVIEW · WOMEN'S DAY",
    client: "Lenovo", year: "2024",
    services: ["Creative Planning", "Interview Production"],
    desc_en: "A Women's Day special for Lenovo — conversations that look for answers close to home. Quiet framing, honest voices, and the courage found in the everyday.",
    desc_zh: "联想三八妇女节特别企划——答案就在不远处。克制的镜头语言与真诚的讲述,在日常之中找到力量。",
    cover: "assets/img/lenovo-womens-day.jpg",
    media: [{ youtube: "iQ97ZQ2wW9M" }],
    next: "roborock-ces"
  },

  "roborock-ces": {
    brand: "ROBOROCK", title: "CES 2024",
    tags: "KV · GLOBAL SHOW · FILM",
    client: "Roborock", year: "2024",
    services: ["Creative Planning", "KV Design", "Show Visuals", "Film Production"],
    desc_en: "\"Rocking Life With You\" — Roborock's full visual system for CES 2024, Las Vegas. Key visual, booth graphics and two launch films, carried from concept to the show floor at LVCC Booth #9029.",
    desc_zh: "\"Rocking Life With You\"——石头科技 CES 2024 拉斯维加斯参展的完整视觉系统。主视觉、展位物料与两支发布影片,从概念一路落地到 LVCC #9029 展位现场。",
    cover: "assets/img/roborock-ces.jpg",
    media: [
      { vimeo: "1210538198" },
      { vimeo: "1210545000" },
      { img: "assets/img/rr-ces-02.jpg" }, { img: "assets/img/rr-ces-01.jpg" },
      { img: "assets/img/rr-ces-04.jpg" }, { img: "assets/img/rr-ces-05.jpg" },
      { img: "assets/img/rr-ces-03.jpg" }, { img: "assets/img/rr-ces-06.jpg" },
      { img: "assets/img/rr-ces-07.jpg" }
    ],
    next: "roborock-qrevo"
  },

  "roborock-qrevo": {
    brand: "ROBOROCK", title: "QREVO Launch KV",
    tags: "KV · CGI · LAUNCH",
    client: "Roborock", year: "2024",
    services: ["KV Design", "CGI", "Global Campaign Scenes"],
    desc_en: "Global launch key visuals for the Roborock QREVO series — CGI-built home scenes where the product lives naturally: pet corners, pollen season, lunch hours and everyday clutter, rendered in one warm, believable light.",
    desc_zh: "石头 QREVO 系列全球上市主视觉——以 CGI 构建产品真实栖身的家庭场景:宠物角落、花粉季、午餐时刻与日常一隅,统一在温暖可信的光线之下。",
    cover: "assets/img/rr-qrevo-01.jpg",
    media: [
      { img: "assets/img/rr-qrevo-01.jpg" }, { img: "assets/img/rr-qrevo-02.jpg" },
      { img: "assets/img/rr-qrevo-03.jpg" }, { img: "assets/img/rr-qrevo-04.jpg" },
      { img: "assets/img/rr-qrevo-05.jpg" }, { img: "assets/img/rr-qrevo-06.jpg" },
      { img: "assets/img/rr-qrevo-07.jpg" }
    ],
    next: "roborock-curv"
  },

  "roborock-curv": {
    brand: "ROBOROCK", title: "Qrevo Curv Series",
    tags: "KV · GLOBAL CAMPAIGN",
    client: "Roborock", year: "2024",
    services: ["KV Design", "CGI", "Global Campaign Scenes"],
    desc_en: "Global communication scenes for the Qrevo Curv — a full library of lifestyle imagery built for worldwide markets, from hero shots to living scenarios, consistent across every region and channel.",
    desc_zh: "Qrevo Curv 全球传播场景图——为全球市场构建的整套生活方式影像库,从产品主视觉到生活场景,在每个地区与渠道保持统一质感。",
    cover: "assets/img/rr-curv-01.jpg",
    media: [
      { img: "assets/img/rr-curv-01.jpg" }, { img: "assets/img/rr-curv-02.jpg" },
      { img: "assets/img/rr-curv-03.jpg" }, { img: "assets/img/rr-curv-04.jpg" },
      { img: "assets/img/rr-curv-05.jpg" }, { img: "assets/img/rr-curv-06.jpg" },
      { img: "assets/img/rr-curv-07.jpg" }, { img: "assets/img/rr-curv-08.jpg" },
      { img: "assets/img/rr-curv-09.jpg" }, { img: "assets/img/rr-curv-10.jpg" },
      { img: "assets/img/rr-curv-11.jpg" }, { img: "assets/img/rr-curv-12.jpg" },
      { img: "assets/img/rr-curv-13.jpg" }, { img: "assets/img/rr-curv-14.jpg" },
      { img: "assets/img/rr-curv-15.jpg" }, { img: "assets/img/rr-curv-16.jpg" }
    ],
    next: "roborock-custom"
  },

  "roborock-custom": {
    brand: "ROBOROCK", title: "Customized Design",
    tags: "KV · CUSTOM SCENES",
    client: "Roborock", year: "2024",
    services: ["KV Design", "CGI", "Customized Scenes"],
    desc_en: "Customized scene design for Roborock's global lineup — tailor-made environments for regional campaigns and retail, each scene art-directed around how real homes actually live.",
    desc_zh: "石头科技全球产品线的定制化场景设计——为区域营销与零售终端量身打造的环境视觉,每个场景都围绕真实家庭的生活方式进行美术设定。",
    cover: "assets/img/rr-custom-01.jpg",
    media: [
      { img: "assets/img/rr-custom-01.jpg" }, { img: "assets/img/rr-custom-02.jpg" },
      { img: "assets/img/rr-custom-03.jpg" }, { img: "assets/img/rr-custom-04.jpg" },
      { img: "assets/img/rr-custom-05.jpg" }, { img: "assets/img/rr-custom-06.jpg" },
      { img: "assets/img/rr-custom-07.jpg" }, { img: "assets/img/rr-custom-08.jpg" }
    ],
    next: "lexus-aranya"
  },

  "lexus-aranya": {
    brand: "LEXUS", title: "Aranya Series",
    tags: "INTERVIEW · FILM · CULTURE",
    client: "Lexus China", year: "2023",
    services: ["Creative Planning", "Interview Production", "Brand Collaboration Films"],
    desc_en: "A three-part culture series for Lexus LS — conversations with the minds behind Aranya, To Summer and SMFK. Architecture, scent and fashion as three answers to the same question: what does considered living look like?",
    desc_zh: "雷克萨斯 LS 三部曲文化系列——与阿那亚创始人马寅、观夏与 SMFK 主理人的对话。建筑、气味与时装,是对同一个问题的三种回答:何为讲究的生活。",
    cover: "assets/img/lexus-aranya.jpg",
    media: [
      { vimeo: "1210537100" },
      { youtube: "y_mjbCcxV0A" },
      { youtube: "SEqQkbeQz1s" }
    ],
    next: "montblanc-explorer"
  },

  "montblanc-explorer": {
    brand: "MONTBLANC", title: "Explorer",
    tags: "TVC · LUXURY · FRAGRANCE",
    client: "Montblanc", year: "2023",
    services: ["TVC Production", "Art Direction"],
    desc_en: "A fragrance film for Montblanc Explorer — compass, leather and wood grain; the scent of setting out. Shot in a warm, tactile register that lets the product speak at the pace of luxury.",
    desc_zh: "万宝龙 Explorer 探寻者香水影片——罗盘、皮革与木纹,启程的气味。以温暖而有触感的影像质地,让产品以奢侈品应有的节奏开口说话。",
    cover: "assets/img/montblanc-explorer.jpg",
    media: [{ vimeo: "1210537737" }],
    next: "luzhou-1573"
  },

  "luzhou-1573": {
    brand: "LUZHOU LAOJIAO 1573", title: "Ice·JOYS × Wang Qianyuan",
    tags: "TVC · CELEBRITY",
    client: "Luzhou Laojiao × Esquire", year: "2022",
    services: ["Creative Planning", "Celebrity Film Production"],
    desc_en: "Part of the \"Ice·JOYS\" gentleman-fantasy series with Esquire China — Wang Qianyuan leads a night patrol through neon and steam, where a centuries-old baijiu meets contemporary noir.",
    desc_zh: "与《时尚先生》联合出品的「冰·JOYS 先生狂想」系列——王千源领衔的先生夜巡记,霓虹与蒸汽之间,让百年国窖与当代黑色美学相遇。",
    cover: "assets/img/luzhou-1573.jpg",
    media: [{ vimeo: "1210537101" }],
    next: "volvo-s90"
  },

  "volvo-s90": {
    brand: "VOLVO", title: "S90 · Love & Life",
    tags: "TVC · AUTO",
    client: "Volvo", year: "2022",
    services: ["Creative Planning", "Series Film Production"],
    desc_en: "\"Nothing matters more than love and life\" — a short-film series for the Volvo S90 that trades horsepower talk for human stories, built for social-first vertical viewing.",
    desc_zh: "「唯爱与生命不可辜负」——沃尔沃 S90 系列短片,不谈马力谈人生。为社交媒体竖屏观看而生的系列叙事。",
    cover: "assets/img/volvo-s90.jpg",
    media: [{ vimeo: "1210539050", ratio: "9x16" }],
    next: "popmart"
  }
};

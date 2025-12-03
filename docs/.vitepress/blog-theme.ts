// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

// 开启RSS支持（RSS配置）
// import type { Theme } from '@sugarat/theme'

// const baseUrl = 'https://your-domain.com'
// const RSS: Theme.RSSOptions = {
//   title: 'moluoxixi Blog',
//   baseUrl,
//   copyright: 'Copyright (c) 2024-present, moluoxixi',
//   description: 'moluoxixi 的个人博客',
//   language: 'zh-cn',
//   image: '',
//   favicon: '',
// }

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 开启RSS支持
  // RSS,

  // 搜索
  // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
  // search: false,

  // 默认关闭 markdown 图表支持（开启会增加一定的构建耗时）
  // mermaid: false

  // 页脚
  footer: {
    // message 字段支持配置为HTML内容，配置多条可以配置为数组
    // message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
    copyright: 'MIT License | moluoxixi',
    // icpRecord: {
    //   name: '蜀ICP备19011724号',
    //   link: 'https://beian.miit.gov.cn/'
    // },
    // securityRecord: {
    //   name: '公网安备xxxxx',
    //   link: 'https://www.beian.gov.cn/portal/index.do'
    // },
  },

  // 主题色修改
  themeColor: 'el-blue',

  // 文章默认作者
  author: 'moluoxixi',

  // 友链
  friend: [
    {
      nickname: '旧博客',
      des: '不依赖任何主题的老博客，首个博客，有很多问题，暂无时间优化',
      avatar: 'https://moluoxixi.github.io/blog/vitepress/avator1.png',
      url: 'https://moluoxixi.github.io/blog/vitepress/',
    },
  ],

  // 公告
  popover: {
    title: '公告',
    // body: [
    //   { type: 'text', content: '👇公众号👇---👇 微信 👇' },
    //   {
    //     type: 'image',
    //     src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
    //   },
    //   {
    //     type: 'text',
    //     content: '欢迎大家加群&私信交流'
    //   },
    //   {
    //     type: 'button',
    //     content: '加群交流',
    //     props: {
    //       type: 'success'
    //     },
    //     link: 'https://theme.sugarat.top/group.html',
    //   }
    // ],
    // duration: 0
  },
})

export { blogTheme }

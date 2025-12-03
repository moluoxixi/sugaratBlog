import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

// 导入主题的配置
import { blogTheme } from './blog-theme'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '..')

// 动态获取 hidden: true 的文件并排除
const findHiddenFiles = (dir: string, baseDir: string = dir): string[] => {
  const hiddenFiles: string[] = []
  if (!fs.existsSync(dir)) return hiddenFiles

  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (file === '.vitepress' || file === 'node_modules' || file === '.git') continue
      hiddenFiles.push(...findHiddenFiles(filePath, baseDir))
    } else if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const frontmatterMatch = content.match(/^---([\s\S]*?)---/)
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1]
          if (/\n\s*hidden:\s*true\s*(\n|$)/.test(frontmatter)) {
            const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/')
            hiddenFiles.push(relativePath)
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return hiddenFiles
}

const hiddenFiles = findHiddenFiles(docsDir)

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  base: '/',
  lang: 'zh-cn',
  title: 'moluoxixi Blog',
  description: 'moluoxixi 的博客，基于 vitepress 实现',
  // 忽略死链接检查
  ignoreDeadLinks: true,
  // 排除不需要构建的文件
  srcExclude: [
    '**/*.excalidraw.*',
    '**/excalidraw/**',
    '**/templates/**',
    '**/node_modules/**',
    ...hiddenFiles
  ],
  // lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.png',
    // editLink: {
    //   pattern:
    //     'https://github.com/moluoxixi/sugaratBlog/tree/main/docs/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      { text: '首页', link: '/' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/moluoxixi'
      }
    ]
  }
})

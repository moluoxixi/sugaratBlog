<h1 align="center"> VitePress @sugarat/theme </h1>

<p align="center">
简约风的 <a href="https://theme.sugarat.top"  target="_blank"target="_blank">VitePress 博客主题</a> 示例运行项目。
</p>

<p align="center">
    <a href="https://atqq.github.io/vitepress-blog-sugar-template/" target="_blank">GitHub Pages Demo</a>
</p>

## Usage

先安装 `pnpm`

```sh
npm i -g pnpm
```

安装依赖

```sh
pnpm install
```

开发启动

```sh
pnpm dev
```

构建

```sh
pnpm build
```

预览产物

```sh
pnpm serve
```

## Github Pages 部署

① Github Pages 开启 Git Actions 部署支持

![](https://img.cdn.sugarat.top/mdImg/sugar/8a2454c628d0e2abcc7a0451ddd7d2dc)

② 复制文件 `.github/workflows/deploy.yml` 到自己的项目相同目录下

示例项目已包含，可以直接进行下一步

③ 修改 `docs/.vitepress/config.mts` 里的构建配置

**如果项目名已经为 name.github.io 域名，则不需要修改，保持默认值 `/` 即可**

`base` 改为 `"/仓库名/"` 即可

```ts
// 省略无关代码
const base = '/vitepress-blog-sugar-template/'
export default defineConfig({
  base,
})
```

④ 推送 `main` 分支即可

需要进一步修改部署和构建配置，详见`deploy.yml` 文件。

## 子模块同步

本项目使用 Git 子模块来管理 `docs/note` 目录。提供了自动化脚本来同步子模块并推送。

### 快速使用

**同步子模块并自动提交推送：**
```sh
pnpm sync:commit
```

**仅同步子模块（不自动提交）：**
```sh
pnpm sync:submodule
```

### 使用 Husky 自动同步（可选）

如果想在每次推送前自动同步子模块：

1. 安装 husky：
```sh
pnpm add -D husky
pnpm exec husky install
```

2. 创建 pre-push 钩子：
```sh
pnpm exec husky add .husky/pre-push "pnpm sync:submodule"
```

或者直接使用已创建的 `.husky/pre-push` 文件。

详细说明请查看 [`scripts/README.md`](./scripts/README.md)

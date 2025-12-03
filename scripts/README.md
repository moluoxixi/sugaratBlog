# 子模块同步脚本说明

本项目提供了自动化脚本来同步子模块并推送更改。

## 可用命令

### 1. `pnpm sync:submodule`
同步子模块但不自动提交
- 更新子模块到最新状态
- 检查并推送子模块的未推送提交
- 将子模块更改添加到主仓库暂存区
- **不会自动提交和推送主仓库**

### 2. `pnpm sync:commit` 或 `pnpm sync:publish`
同步子模块并自动提交推送
- 执行所有同步操作
- 自动提交主仓库的更改
- 自动推送到远程仓库

**用法：**
```bash
# 使用默认提交信息
pnpm sync:commit

# 使用自定义提交信息
tsx scripts/sync-and-publish.ts "自定义提交信息"
```

> 注意：脚本使用 TypeScript 编写，运行时会自动通过 `tsx` 处理。

## Husky 钩子（可选）

如果你想在每次推送前自动同步子模块，可以设置 husky pre-push 钩子：

### 安装 husky
```bash
pnpm add -D husky
pnpm exec husky install
```

### 创建 pre-push 钩子
```bash
pnpm exec husky add .husky/pre-push "pnpm sync:submodule"
```

或者手动创建 `.husky/pre-push` 文件：
```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

# 同步子模块
pnpm sync:submodule

# 如果有错误，阻止推送
if [ $? -ne 0 ]; then
  echo "❌ 子模块同步失败，推送已取消"
  exit 1
fi
```

## 使用场景

### 场景 1: 手动同步
当你更新了子模块后，想要手动控制提交：
```bash
pnpm sync:submodule
git status  # 检查更改
git commit -m "更新子模块"  # 手动提交
git push  # 手动推送
```

### 场景 2: 自动同步并发布
当你想要一键完成所有操作：
```bash
pnpm sync:commit
```

### 场景 3: 自动化（使用 Husky）
安装 husky 后，每次执行 `git push` 前会自动同步子模块。

## 注意事项

1. 确保子模块远程仓库有推送权限
2. 确保主仓库有推送权限
3. 如果有未提交的其他更改，脚本会提示但不会自动提交
4. 如果子模块同步失败，推送会被阻止（使用 husky 时）


#!/usr/bin/env node

/**
 * 同步子模块并推送脚本
 * 功能：
 * 1. 更新子模块到最新状态
 * 2. 检查子模块是否有未推送的提交，如果有则推送
 * 3. 更新主仓库中的子模块引用
 * 4. 提交并推送主仓库的更改（如果主仓库有更改）
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBMODULE_PATH = 'docs/note';
const ROOT_DIR = path.resolve(__dirname, '..');

interface ExecOptions {
  cwd?: string;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  encoding?: BufferEncoding;
}

// 执行命令并输出结果
function exec(command: string, options: ExecOptions = {}): boolean {
  const defaultOptions: ExecOptions = {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    encoding: 'utf-8',
  };
  
  try {
    execSync(command, { ...defaultOptions, ...options });
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`错误: 执行命令失败: ${command}`);
    console.error(errorMessage);
    return false;
  }
}

// 执行命令并获取输出
function execGetOutput(command: string, options: ExecOptions = {}): string | null {
  const defaultOptions: ExecOptions = {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
  };
  
  try {
    const output = execSync(command, { 
      ...defaultOptions, 
      ...options,
      stdio: 'pipe',
    });
    return output.toString().trim();
  } catch (error) {
    return null;
  }
}

// 检查是否有未推送的提交
function hasUnpushedCommits(dir: string): boolean {
  const status = execGetOutput('git status --porcelain', { cwd: dir });
  if (status) return true;
  
  const log = execGetOutput('git log origin/main..HEAD --oneline', { cwd: dir });
  return log !== null && log.length > 0;
}

console.log('🚀 开始同步子模块...\n');

// 1. 更新子模块到最新状态
console.log('📥 步骤 1: 更新子模块到最新状态...');
if (!exec(`git submodule update --remote ${SUBMODULE_PATH}`)) {
  console.error('❌ 更新子模块失败');
  process.exit(1);
}
console.log('✅ 子模块已更新\n');

// 2. 检查子模块状态并推送
const submoduleDir = path.join(ROOT_DIR, SUBMODULE_PATH);
console.log('📤 步骤 2: 检查子模块是否有未推送的提交...');

const unpushedCommits = execGetOutput('git log origin/main..HEAD --oneline', {
  cwd: submoduleDir,
});

if (unpushedCommits && unpushedCommits.length > 0) {
  console.log('发现未推送的提交，正在推送子模块...');
  console.log('未推送的提交：');
  console.log(unpushedCommits);
  
  if (!exec('git push', { cwd: submoduleDir })) {
    console.error('❌ 推送子模块失败');
    process.exit(1);
  }
  console.log('✅ 子模块已推送\n');
} else {
  console.log('✅ 子模块已是最新状态，无需推送\n');
}

// 3. 检查主仓库中是否有子模块的更改需要提交
console.log('📝 步骤 3: 检查主仓库中的子模块引用...');
const mainStatus = execGetOutput('git status --porcelain docs/note');
const stagedChanges = execGetOutput('git diff --cached --name-only docs/note');

if (mainStatus || stagedChanges) {
  console.log('发现子模块引用有更新，正在添加到主仓库...');
  
  // 添加子模块更改
  if (!exec('git add docs/note')) {
    console.error('❌ 添加子模块更改失败');
    process.exit(1);
  }
  
  // 检查是否已经有暂存的更改（可能是其他文件的更改）
  const allStaged = execGetOutput('git diff --cached --name-only');
  const hasNoteStaged = allStaged !== null && allStaged.includes('docs/note');
  
  if (hasNoteStaged) {
    // 如果子模块是唯一的变化，或者用户想要提交，我们就提交
    console.log('\n💡 提示: 子模块更改已添加到暂存区');
    console.log('💡 你可以运行 "git commit" 来提交这些更改，或者运行 "pnpm sync:commit" 自动提交\n');
  }
} else {
  console.log('✅ 主仓库中的子模块引用已是最新\n');
}

console.log('✨ 子模块同步完成！');
console.log('\n📋 后续步骤：');
console.log('   1. 检查更改: git status');
console.log('   2. 提交更改: git commit -m "更新子模块"');
console.log('   3. 推送更改: git push');
console.log('   或者运行: pnpm sync:commit 自动提交并推送\n');


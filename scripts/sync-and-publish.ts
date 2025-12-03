#!/usr/bin/env node

/**
 * 同步子模块并自动提交推送脚本
 * 功能：
 * 1. 同步子模块并推送
 * 2. 自动提交主仓库的更改
 * 3. 自动推送主仓库
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('🚀 开始同步子模块并发布...\n');

// 1. 先运行同步脚本
console.log('📥 步骤 1: 同步子模块...');
if (!exec('tsx scripts/sync-submodule.ts')) {
  console.error('❌ 同步子模块失败');
  process.exit(1);
}

// 2. 检查是否有需要提交的更改
console.log('\n📝 步骤 2: 检查是否有需要提交的更改...');
const status = execGetOutput('git status --porcelain');
const staged = execGetOutput('git diff --cached --name-only');

if (!status && !staged) {
  console.log('✅ 没有需要提交的更改\n');
  console.log('✨ 所有内容已同步！');
  process.exit(0);
}

// 3. 添加所有更改
console.log('📦 步骤 3: 添加更改到暂存区...');
if (!exec('git add docs/note .gitmodules')) {
  console.error('❌ 添加更改失败');
  process.exit(1);
}

// 4. 检查是否有未暂存的其他更改
const unstaged = execGetOutput('git status --porcelain');
if (unstaged) {
  console.log('\n⚠️  警告: 检测到未暂存的其他更改:');
  console.log(unstaged);
  console.log('\n💡 这些更改不会被自动提交。');
  console.log('💡 如果需要提交，请先手动添加: git add <文件>');
  console.log('💡 然后重新运行此命令。\n');
}

// 5. 提交更改
const commitMessage = process.argv[2] || '更新子模块 docs/note';
console.log(`\n💾 步骤 4: 提交更改 (${commitMessage})...`);
if (!exec(`git commit -m "${commitMessage}"`)) {
  console.error('❌ 提交失败');
  process.exit(1);
}

// 6. 推送更改
console.log('\n📤 步骤 5: 推送更改到远程...');
if (!exec('git push')) {
  console.error('❌ 推送失败');
  process.exit(1);
}

console.log('\n✨ 完成！子模块已同步并发布！\n');


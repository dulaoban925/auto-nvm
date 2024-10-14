/**
 * 工具函数
 */
import * as vscode from "vscode";

/**
 * 终端 t 发送 nvm use
 */
function sendNvmUseText(t: vscode.Terminal, version: string | null = "") {
  t.sendText(`nvm use ${version}`);
}

/**
 * 为 vscode 每个打开的终端执行 “nvm use”，切换 node 版本
 */
export function executeNvmUse(version?: string) {
  // 获取打开的终端列表
  const terminals = vscode.window.terminals;
  if (terminals.length) {
    terminals.forEach((t) => sendNvmUseText(t, version));
  }
}

/**
 * 插件 active 时初始执行
 */
export function initNvmUse(context: vscode.ExtensionContext) {
  // 为 vscode 每个打开的终端执行 “nvm use”
  executeNvmUse();
  // 监听终端创建事件，创建终端后首先切换 node 版本
  context.subscriptions.push(vscode.window.onDidOpenTerminal(sendNvmUseText));
}

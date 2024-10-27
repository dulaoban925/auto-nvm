/**
 * 工具函数
 */
import * as vscode from "vscode";
import { exec } from "node:child_process";
import { join } from "node:path";
import { showMessage } from "./common";
import {
  getLastPickedVersion,
  hasNvmrc,
  setLastPickedVersion,
} from "./functionality";

/**
 * 终端 t 发送 nvm use
 */
function sendNvmUseText(t: vscode.Terminal, version: string | null = "") {
  t.sendText(`nvm use ${version}`);
}

/**
 * 为 vscode 每个打开的终端执行 “nvm use”，切换 node 版本
 */
export async function executeNvmUse(version?: string) {
  // 是否通过 nvm 安装过 node
  const versions = await getNodeVersionsInstalled();
  if (!versions.length) {
    showMessage("warn", "Please install Node.js versions by nvm");
    return;
  }
  // 获取打开的终端列表
  const terminals = vscode.window.terminals;
  if (terminals.length) {
    terminals.forEach((t) => sendNvmUseText(t, version));
  }
}

/**
 * 插件 active 时初始执行
 */
export async function initNvmUse(ctx: vscode.ExtensionContext) {
  // 插件激活时重置 lastPickedVersion
  setLastPickedVersion(ctx, "");
  const existNvmrc = await hasNvmrc();
  if (existNvmrc) {
    // 为 vscode 每个打开的终端执行 “nvm use”
    executeNvmUse();
  } else {
    // 若不存在.nvmrc，则提示
    showMessage("warn", ".nvmrc not found.");
  }
  // 监听终端创建事件，创建终端后首先切换 node 版本
  ctx.subscriptions.push(
    vscode.window.onDidOpenTerminal(async (t) => {
      // 若终端是有 Task 调起的，不执行 `nvm use`
      if (t.creationOptions?.name?.includes("Task")) return;
      const lastPickedVersion = getLastPickedVersion(ctx);
      const existNvmrc = await hasNvmrc();
      // 仅在存在 .nvmrc 或用户手动选择切换版本时执行 `nvm use`
      if (existNvmrc || lastPickedVersion) {
        sendNvmUseText(t, lastPickedVersion);
      }
    })
  );
}

/**
 * 获取已安装的 node 版本列表
 */
export function getNodeVersionsInstalled(): Promise<string[]> {
  return new Promise((resolve) => {
    exec(`ls ${join("$NVM_DIR", "versions/node")}`, (err, stdout, stderr) => {
      resolve(err || stderr ? [] : stdout.split("\n").filter((v) => !!v));
    });
  });
}

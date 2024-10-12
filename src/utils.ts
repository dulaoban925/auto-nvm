/**
 * 工具函数
 */
import * as vscode from "vscode";

// 匹配 nvm use 可用的 node 版本写法
const nvmNodeVersionRegexp = /^(v)?(0|[1-9]\d{0,1})(\.(0|[1-9]\d*)){0,2}$/;

/**
 * 终端 t 发送 nvm use
 */
function sendNvmUseText(t: vscode.Terminal, version: string | null = "") {
  t.sendText(`nvm use ${version}`);
}

/**
 * 为 vscode 每个打开的终端执行 “nvm use”，切换 node 版本
 */
function executeNvmUse(version?: string) {
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

/**
 * 注册 use 命令
 */
export function registerUseCommand(context: vscode.ExtensionContext) {
  const commandId = "auto-nvm.use-version";
  const commandHandler = () => {
    // 显示输入框
    vscode.window
      .showInputBox({
        prompt: "enter the node version", // 输入框的提示信息
        placeHolder: "eg. 20, v20, 20.11.0, v20.11.0", // 输入框的占位符
        validateInput: (version) => {
          // 验证输入的函数
          if (!nvmNodeVersionRegexp.test(version)) {
            return "invalid version";
          }
          return null;
        },
      })
      .then((version) => {
        if (version) {
          executeNvmUse(version);
          vscode.window.showInformationMessage(
            `"nvm use ${version}" command has been sent, please check terminals`
          );
        }
      });
  };
  context.subscriptions.push(
    vscode.commands.registerCommand(commandId, commandHandler)
  );
}

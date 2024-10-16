/**
 * 注册命令函数
 */
import * as vscode from "vscode";
import { executeNvmUse } from "./nvm";

// 匹配 nvm use 可用的 node 版本写法
const nvmNodeVersionRegexp = /^(v)?(0|[1-9]\d{0,1})(\.(0|[1-9]\d*)){0,2}$/;
/**
 * 注册 use-version 命令
 */
export function registerUseVersionCommand(context: vscode.ExtensionContext) {
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

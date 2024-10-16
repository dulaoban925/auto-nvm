/**
 * 注册命令函数
 */
import * as vscode from "vscode";
import {
  executeNvmUse,
  getNodeVersionsInstalled,
  getNodeVersionsNotInstalled,
} from "./nvm";
import { setLatestPickedVersion } from "./utils";

// 安装其他版本的选项
const installOthersOption = "Install Others";
/**
 * 注册 use-version 命令
 */
export function registerUseVersionCommand(ctx: vscode.ExtensionContext) {
  const commandId = "auto-nvm.use-version";
  const commandHandler = async () => {
    const versionsInstalled = await getNodeVersionsInstalled();
    // 显示输入框
    const pickedVersion = await vscode.window.showQuickPick(
      versionsInstalled.concat(installOthersOption),
      {
        title: "Pick specified version",
      }
    );
    pickedVersion && useVersionHandler(ctx, pickedVersion);
  };
  ctx.subscriptions.push(
    vscode.commands.registerCommand(commandId, commandHandler)
  );
}

/**
 * 切换版本处理函数
 * @param version
 */
function useVersionHandler(ctx: vscode.ExtensionContext, version: string) {
  if (version === installOthersOption) {
    console.log(installOthersOption);
    showNotInstalledNodeVersions(ctx);
    return;
  }
  executeNvmUse(version);
  setLatestPickedVersion(ctx, version);
  vscode.window.showInformationMessage(`Node version switched to ${version}`);
}

async function showNotInstalledNodeVersions(ctx: vscode.ExtensionContext) {
  const versions = await getNodeVersionsNotInstalled();
  console.log(versions);
  const pickedVersion = await vscode.window.showQuickPick(versions, {
    title: "Install and use specified version",
  });
  if (!pickedVersion) {
    return;
  }
  setLatestPickedVersion(ctx, pickedVersion);
  const terminals = vscode.window.terminals;
  if (terminals.length) {
    terminals.forEach((t) => t.sendText(`nvm install ${pickedVersion}`));
  }
}

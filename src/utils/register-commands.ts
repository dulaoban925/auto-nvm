/**
 * 注册命令函数
 */
import * as vscode from "vscode";
import { executeNvmUse, getNodeVersionsInstalled } from "./nvm";
import {
  setLatestPickedVersion,
  sortPickedVersions,
  getRemoteNodeVersions,
  executeCommandTask,
} from "./functionality";
import { showMessage } from "./common";

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
      sortPickedVersions(ctx, versionsInstalled).concat(installOthersOption),
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
    showRemoteNodeVersions();
    return;
  }
  executeNvmUse(version);
  setLatestPickedVersion(ctx, version);
  showMessage("info", `"nvm use ${version}" command executed successfully.`);
}

/**
 * 展示完整 node 版本列表，并选择安装
 */
async function showRemoteNodeVersions() {
  const versions = await getRemoteNodeVersions();
  const pickedVersion = await vscode.window.showQuickPick(versions, {
    title: "Install and use specified version",
  });
  pickedVersion && executeCommandTask(`nvm install ${pickedVersion}`);
}

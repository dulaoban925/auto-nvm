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
  getLatestPickedVersion,
} from "./functionality";
import { showMessage } from "./common";
import { version } from "os";

// 安装其他版本的选项
const INSTALL_OTHERS_OPTION = "Install Others";
/**
 * 注册 use-version 命令
 */
export function registerUseVersionCommand(ctx: vscode.ExtensionContext) {
  const commandId = "auto-nvm.use-version";
  const commandHandler = async () => {
    const versionsInstalled = await getNodeVersionsInstalled();
    const items = formatQuickPickItems(ctx, versionsInstalled);
    console.log("🚀 ~ commandHandler ~ items:", items);
    // 显示输入框
    const pickedItem = await vscode.window.showQuickPick(items, {
      title: "Pick specified version",
    });
    const pickedVersion = pickedItem?.description;
    pickedVersion && useVersionHandler(ctx, pickedVersion);
  };
  ctx.subscriptions.push(
    vscode.commands.registerCommand(commandId, commandHandler)
  );
}

function formatQuickPickItems(
  ctx: vscode.ExtensionContext,
  versions: string[]
): vscode.QuickPickItem[] {
  const lastPickedVersion = getLatestPickedVersion(ctx);
  return [...sortPickedVersions(ctx, versions), INSTALL_OTHERS_OPTION].map(
    (v) => ({
      description: v,
      label: lastPickedVersion && lastPickedVersion === v ? "※" : "",
    })
  ) as vscode.QuickPickItem[];
}

/**
 * 切换版本处理函数
 * @param version
 */
function useVersionHandler(ctx: vscode.ExtensionContext, version: string) {
  if (version === INSTALL_OTHERS_OPTION) {
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

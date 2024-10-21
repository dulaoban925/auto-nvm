/**
 * 注册命令函数
 */
import * as vscode from "vscode";
import { executeNvmUse, getNodeVersionsInstalled } from "./nvm";
import {
  setLastPickedVersion,
  sortPickedVersions,
  getRemoteNodeVersions,
  executeCommandTask,
  getLastPickedVersion,
} from "./functionality";
import { showMessage } from "./common";

// 安装其他版本的选项
const INSTALL_OTHERS_OPTION = "Install Others";
/**
 * 注册 use-version 命令
 */
export function registerUseVersionCommand(ctx: vscode.ExtensionContext) {
  const commandId = "auto-nvm.use-version";
  const commandHandler = async () => {
    showNodeVersionsQuickPick(ctx);
  };
  ctx.subscriptions.push(
    vscode.commands.registerCommand(commandId, commandHandler)
  );
}

/**
 * node 版本选择窗
 */
async function showNodeVersionsQuickPick(ctx: vscode.ExtensionContext) {
  const versionsInstalled = await getNodeVersionsInstalled();
  const items = formatQuickPickItems(ctx, versionsInstalled);
  const quickPick = vscode.window.createQuickPick();
  quickPick.title = "Pick specified version";
  quickPick.items = items;
  quickPick.buttons = [
    {
      iconPath: new vscode.ThemeIcon("remove-close"),
      tooltip: "uninstall",
    },
  ];
  quickPick.show();
  quickPick.onDidChangeSelection((selected) => {
    if (selected[0]) {
      const pickedVersion = selected[0].description;
      useVersionHandler(ctx, pickedVersion!);
      quickPick.dispose();
    }
  });
  quickPick.onDidTriggerItemButton(
    ({
      button,
      item,
    }: vscode.QuickPickItemButtonEvent<vscode.QuickPickItem>) => {
      if (button.tooltip === "uninstall") {
        const uninstallCommand = `nvm uninstall ${item.description}`;
        executeCommandTask(uninstallCommand);
        showMessage(
          "info",
          `"${uninstallCommand}" command executed successfully.`
        );
        quickPick.dispose();
      }
    }
  );
}

function formatQuickPickItems(
  ctx: vscode.ExtensionContext,
  versions: string[]
): vscode.QuickPickItem[] {
  const lastPickedVersion = getLastPickedVersion(ctx);
  return [...sortPickedVersions(ctx, versions), INSTALL_OTHERS_OPTION].map(
    (v) => ({
      description: v,
      label: lastPickedVersion && lastPickedVersion === v ? "※" : "",
      buttons: [
        {
          iconPath: new vscode.ThemeIcon("remove-close"),
          tooltip: "uninstall",
        },
      ] as vscode.QuickInputButton[],
    })
  );
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
  setLastPickedVersion(ctx, version);
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

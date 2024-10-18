import * as vscode from "vscode";
import https from "node:https";
import { showMessage } from "./common";

// 工作空间暂存上次选择的 node 版本 key
const WORKSPACE_STATE_LAST_PICKED_VERSION_KEY = `last_picked_node_version`;

/**
 * 暂存上次选择的 node 版本
 * @param ctx
 * @param version
 */
export function setLastPickedVersion(
  ctx: vscode.ExtensionContext,
  version: string
) {
  ctx.workspaceState.update(WORKSPACE_STATE_LAST_PICKED_VERSION_KEY, version);
}

/**
 * 获取暂存的 node 版本
 * @param ctx
 * @returns
 */
export function getLastPickedVersion(
  ctx: vscode.ExtensionContext
): string | undefined {
  return ctx.workspaceState.get(WORKSPACE_STATE_LAST_PICKED_VERSION_KEY);
}

/**
 * 排序供选择的 node 版本
 * @param ctx
 * @param versions
 * @returns
 */
export function sortPickedVersions(
  ctx: vscode.ExtensionContext,
  versions: string[]
): string[] {
  const latestPickedVersion = getLastPickedVersion(ctx);
  return latestPickedVersion && versions.includes(latestPickedVersion)
    ? [
        latestPickedVersion,
        ...versions.filter((v) => v !== latestPickedVersion),
      ]
    : versions;
}

/**
 * 获取远程 node 版本
 */
export function getRemoteNodeVersions(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    https
      .get("https://nodejs.org/dist/index.json", (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(rawData)?.map((r: any) => r.version) ?? []);
        });
      })
      .on("error", (e) => {
        showMessage("error", e.message);
        reject(e);
      });
  });
}

/**
 * 执行命令任务
 */
export async function executeCommandTask(command: string) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

  const task = new vscode.Task(
    { type: "shell" },
    vscode.TaskScope.Workspace,
    "Auto-nvm Command",
    "auto-nvm",
    new vscode.ShellExecution(command, {
      cwd: rootPath,
    }),
    []
  );

  vscode.tasks.executeTask(task).then(
    () => {
      showMessage("info", `"${command}" command executed successfully.`);
    },
    (error) => {
      showMessage("error", `Error executing command: ${error}`);
    }
  );
}

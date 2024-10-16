import * as vscode from "vscode";

// 工作空间暂存上次选择的 node 版本 key
const WORKSPACE_STATE_LATEST_PICKED_VERSION_KEY = `latest_picked_node_version`;

/**
 * 暂存上次选择的 node 版本
 * @param ctx
 * @param version
 */
export function setLatestPickedVersion(
  ctx: vscode.ExtensionContext,
  version: string
) {
  ctx.workspaceState.update(WORKSPACE_STATE_LATEST_PICKED_VERSION_KEY, version);
}

/**
 * 获取暂存的 node 版本
 * @param ctx
 * @returns
 */
export function getLatestPickedVersion(
  ctx: vscode.ExtensionContext
): string | undefined {
  return ctx.workspaceState.get(WORKSPACE_STATE_LATEST_PICKED_VERSION_KEY);
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
  const latestPickedVersion = getLatestPickedVersion(ctx);
  return latestPickedVersion
    ? [
        latestPickedVersion,
        ...versions.filter((v) => v !== latestPickedVersion),
      ]
    : versions;
}

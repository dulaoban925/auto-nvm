/**
 * 提示信息
 */
import * as vscode from "vscode";

// 消息类型
type MessageType = "info" | "warn" | "error";

// 消息类型与 vscode api 映射关系
const MESSAGE_TYPE_VSC_API_MAP: Record<
  MessageType,
  <T extends string>(
    message: string,
    options?: vscode.MessageOptions,
    ...items: T[]
  ) => Thenable<T | undefined>
> = {
  info: vscode.window.showInformationMessage,
  warn: vscode.window.showWarningMessage,
  error: vscode.window.showErrorMessage,
};

/**
 * 显示提示信息
 * @param type
 * @param text
 * @param options
 * @param items
 */
export function showMessage<T extends string>(
  type: MessageType,
  text: string,
  options?: vscode.MessageOptions,
  ...items: T[]
) {
  MESSAGE_TYPE_VSC_API_MAP[type](text, options, ...items);
}

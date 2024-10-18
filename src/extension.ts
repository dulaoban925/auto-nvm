import * as vscode from "vscode";
import { initNvmUse } from "./utils/nvm";
import { registerUseVersionCommand } from "./utils/register-commands";

export function activate(ctx: vscode.ExtensionContext) {
  console.log("auto-nvm is now active!");
  initNvmUse(ctx);
  registerUseVersionCommand(ctx);
}

export function deactivate(ctx: vscode.ExtensionContext) {
  console.log("auto-nvm is now deactivate!");
}

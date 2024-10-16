import * as vscode from "vscode";
import { initNvmUse } from "./utils/nvm";
import { registerUseVersionCommand } from "./utils/register-commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("auto-nvm is now active!");
  initNvmUse(context);
  registerUseVersionCommand(context);
}

export function deactivate() {}

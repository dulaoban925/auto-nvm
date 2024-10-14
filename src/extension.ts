import * as vscode from "vscode";
import { initNvmUse } from "./utils";
import { registerUseVersionCommand } from "./register-commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("auto-nvm is now active!");
  initNvmUse(context);
  registerUseVersionCommand(context);
}

export function deactivate() {}

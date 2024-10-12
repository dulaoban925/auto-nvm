import * as vscode from "vscode";
import { initNvmUse, registerUseCommand } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  console.log("auto-nvm is now active!");
  initNvmUse(context);
  registerUseCommand(context);
}

export function deactivate() {}

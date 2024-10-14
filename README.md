# auto-nvm README

A vscode extension that simplifies node version management.

## Features

- [x] Automatically switch node version according to .nvmrc.
- [x] Use use-version command to manually switch node versions.

## Requirements

- To be able to pick different node versions, you must have installed **nvm** and used it to manage the node environment.
- to take **nvm use** command effect on terminal startup, you must have a **.nvmrc** file in the project.

## Usage

### Automatically switch node version

As long as the requirements are met, **nvm use** command will be automatically executed when the terminal is created and switch to the node version configured in **.nvmrc**.

### use-version

- Open the command palette (`Ctrl+Shift+P` on Windows and Linux, `Cmd+Shift+P` on OS X) and search for `use-version`.
- Enter the specified node version in the input box.
- the extension will be automatically execute **nvm use** command in terminals.

**Enjoy!**

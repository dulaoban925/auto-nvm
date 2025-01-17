# Change Log

All notable changes to the "auto-nvm" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- [Added] Add a sidebar view panel to conveniently manage Node.js versions.

## [0.0.1]

### Added

- Automatically switch Node.js version according to **.nvmrc** after opening the project.
- Use **Use Node Version** command to manually switch Node.js versions.

## [0.0.2]

### Fixed

- Fixed the extension entry file error issue.

## [1.0.0]

### Added

- Verify the nvm tool is installed locally.
- show a list of Node.js versions installed for selection by the **Use Node Version** command.
- The **Use Node Version** command provides an "install others" option and show all Node.js versions when picked.

## [1.1.0]

### Added

- add `Use Node Version` command to switch Node.js version.

### Removed

- remove `Use Node Version` command and use `Use Node Version` instead.

### Change

- Optimize remote Node.js versions acquisition method.
- Change the installation method of Node.js version.
- Improve experience of picking Node.js version.

## [1.1.1]

### Added

- Added verification of whether **.nvmrc** exists and prompts if not exist.

### Change

- Adjust activationEvents to **onStartupFinished**.

## [1.1.2]

### Added

- Add "uninstall" button to uninstall specified Node.js version.
- don't execute "nvm use" in terminals started by Task.

## [1.1.3]

### Fixed

- Fixed the problem of the extension not working when not exist .nvmrc.

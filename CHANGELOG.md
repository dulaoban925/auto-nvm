# Change Log

All notable changes to the "auto-nvm" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Verify the nvm tool is installed locally.
- Get a list of node versions installed by nvm for selection by the **use-version** command.
- The **use-version** command provides an "install other version" option.

## [0.0.1]

### Added

- Automatically switch node version according to **.nvmrc** after opening the project.
- Use **use-version** command to manually switch node versions.

## [0.0.2]

### Fixed

- Fixed the extension entry file error issue.

## [0.0.3]

### Changed

- Adjust The extension activation timing to the workspace containing the .nvmrc file.

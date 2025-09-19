# Change Log

## [0.1.0] - 2025-09-19

### Added
- **Cross-platform support**: Extension now works on macOS and Linux with native ExifTool fallback
- **JPEG file support**: Added support for .jpeg file extension
- **Enhanced error handling**: Improved error messages and user notifications
- **Platform detection**: Better debugging with platform and version information
- **Marketplace metadata**: Added keywords, license, and publisher information for VS Code Marketplace
- **Packaging support**: Added vsce scripts for marketplace publishing

### Changed
- **Improved initialization**: Better ExifTool initialization with fallback mechanisms
- **Enhanced logging**: More detailed output messages for troubleshooting
- **Updated dependencies**: Cross-platform compatible dependency configuration
- **Professional documentation**: Comprehensive README and installation instructions

### Fixed
- **Launch configuration**: Fixed VS Code development environment setup
- **Extension activation**: Improved extension loading and error recovery
- **Cross-platform compatibility**: Resolved Windows-only limitation
- **Node.js compatibility**: Updated packaging for modern Node.js versions

## [0.0.5] - 2023-11-13

### Added
- New logging feature: Debug and informational messages are now logged to the VS Code Output console for better troubleshooting.

### Changed
- Enhanced `.gitignore` and `.vscodeignore` to keep the repository and `.vsix` package clean from development-specific files.

## [0.0.4] - 2023-10-01

### Added
- Support for JPG and WEBP files.

## [0.0.3] - 2023-09-15

### Added
- Initial release of Image Metadata Display.
# Change Log

## [0.1.0] - 2025-09-19

### Added
- **Enhanced cross-platform support**: Improved compatibility for macOS and Linux with native ExifTool fallback
- **JPEG file support**: Added support for .jpeg file extension
- **Better error handling**: Clear error messages and platform-specific guidance
- **Platform detection**: Detailed debugging information showing platform and version details
- **Marketplace metadata**: Added keywords, license, and publisher information for VS Code Marketplace
- **Packaging support**: Added vsce scripts for marketplace publishing

### Changed
- **Improved initialization**: Better ExifTool initialization with graceful fallback mechanisms
- **Enhanced logging**: More detailed output messages for troubleshooting cross-platform issues
- **Updated dependencies**: Cross-platform compatible dependency configuration
- **Professional documentation**: Comprehensive README and installation instructions

### Fixed
- **Launch configuration**: Fixed VS Code development environment setup
- **Extension activation**: Improved extension loading and error recovery
- **Windows-only limitation**: Added fallback support for other platforms (testing needed)
- **Node.js compatibility**: Updated packaging for modern Node.js versions

### Notes
- Cross-platform improvements are in place but need community testing on macOS/Linux
- Please report any issues on non-Windows platforms via GitHub Issues

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
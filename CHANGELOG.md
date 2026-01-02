# Changelog

All notable changes to the "Image Metadata Inspector" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2026-01-01

### Changed
- **Performance:** Reduced package size by excluding unnecessary files from dependencies
- Removed README, LICENSE, CHANGELOG, and TypeScript .d.ts files from node_modules
- Excluded .claude/ directory and CLAUDE.md from extension package
- Package reduced from 1,243 to 1,105 files (138 fewer files)
- All runtime code and ExifTool binaries remain intact

## [0.1.5] - 2026-01-01

### Fixed
- **Security:** Fixed qs DoS vulnerability (GHSA-6rw7-vpxm-498p) by upgrading from 6.14.0 to 6.14.1
- Updated dependency chain: @vscode/vsce → typed-rest-client → qs

## [0.1.4] - 2025-12-17

### Fixed
- Fixed Windows installation failing with "Cannot find module 'exiftool-vendored.exe'" error (Issue #5)
- Extension now properly bundles platform-specific ExifTool binaries for Windows, macOS, and Linux
- Windows binary (exiftool.exe) is now included in the packaged extension

### Changed
- Added exiftool-vendored.exe and exiftool-vendored.pl as explicit dependencies to ensure proper bundling
- Improved packaging configuration to include platform-specific binaries in all extension distributions

## [0.1.3] - 2025-12-04

### Fixed
- **Security:** Fixed auth0/node-jws HMAC signature verification vulnerability (GHSA-869p-cjfg-cm3x) by upgrading jws from 3.2.2 to 3.2.3
- **Security:** Updated jwa dependency from 1.4.1 to 1.4.2 as part of the security fix

### Changed
- Updated jws dependency to version 3.2.3 to address timing attack vulnerability in HMAC signature verification
- Enhanced README with corrected Linux package names and improved troubleshooting section for non-Windows platforms
- This upgrade patches the HMAC signature timing attack vulnerability in the jws library

## [0.1.2] - 2025-11-17

### Fixed
- Fixed race condition causing "No ExifTool available" error on the first image opened after VS Code reload (Issue #3)
- Fixed cached error results preventing the first image from working even after reopening it
- Improved async initialization handling to ensure ExifTool is ready before processing metadata requests

### Changed
- Replaced boolean initialization flag with Promise-based state management for better async control
- Enhanced initialization retry logic to properly clear errors after successful initialization

## [0.1.1] - 2025-10-31

### Fixed
- Fixed macOS/Linux compatibility issue where extension would fail to activate due to missing `exiftool-vendored.pl` binary
- Extension now properly falls back to system-installed ExifTool on macOS/Linux when bundled binary is unavailable

### Changed
- Changed ExifTool loading to use dynamic imports to prevent activation failures on unsupported platforms
- Updated README with clearer installation instructions for macOS/Linux users

## [0.1.0] - 2024-09-19

### Added
- Initial cross-platform support attempt
- Fallback mechanism to use native ExifTool when vendored version unavailable

### Changed
- Improved error handling and logging
- Enhanced output console messages for debugging

## [0.0.5] - 2024-11-13

### Added
- Output console logging for better debugging
- Platform detection and information display

## [0.0.4] - 2024-04-03

### Added
- Support for WebP image format
- Support for JPG/JPEG image formats

## [0.0.3] - 2024-03-XX

### Added
- Initial release
- PNG metadata inspection
- ComfyUI workflow metadata support
- Right-click context menu integration
- Command palette support
- JSON prettification for metadata display

[0.1.6]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.0.5...v0.1.0
[0.0.5]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/Gerkinfeltser/image-metadata-display/releases/tag/v0.0.4

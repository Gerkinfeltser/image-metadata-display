# Changelog

All notable changes to the "Image Metadata Inspector" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.1]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.0.5...v0.1.0
[0.0.5]: https://github.com/Gerkinfeltser/image-metadata-display/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/Gerkinfeltser/image-metadata-display/releases/tag/v0.0.4

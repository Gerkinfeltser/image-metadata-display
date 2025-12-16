# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Compilation
- `npm run compile` - Compile TypeScript to JavaScript in `out/` directory
- `npm run watch` - Watch mode compilation with auto-rebuild on changes
- `npm run build` - Alias for compile

### Testing
- `npm test` - Run VS Code extension tests using vscode-test runner
- Tests are located in `src/test/extension.test.ts`

### Packaging and Publishing
- `npm run package` - Package extension into `.vsix` file using `vsce`
- `npm run publish` - Publish extension to VS Code Marketplace
- `npm run vscode:prepublish` - Pre-publish compilation (runs automatically)

### Debugging
- Press `F5` in VS Code to launch a new Extension Development Host window
- Use the "Run Extension" debug configuration (includes pre-launch compile)
- Use "Run Extension (No Compile)" for faster iterations when no TS changes needed

## Architecture Overview

### Core Components

**Main Extension (`src/extension.ts`)**:
- `activate()` - Entry point that sets up commands and providers
- `showMetadata()` - Handles displaying metadata in side-by-side view
- `MetadataProvider` class - Core metadata extraction and formatting logic

**MetadataProvider Class**:
- Implements `vscode.TextDocumentContentProvider` for custom document scheme `image-metadata://`
- Lazy-loads ExifTool with fallback to native system installation
- Handles both vendored (Windows-bundled) and native ExifTool execution paths
- Formats metadata with JSON prettification for embedded workflows

### ExifTool Integration Strategy

The extension uses a sophisticated fallback system for cross-platform compatibility:

1. **Primary**: Vendored ExifTool (`exiftool-vendored`) - Works on Windows
2. **Fallback**: Native system ExifTool - For macOS/Linux development environments

Key implementation details:
- Lazy loading to prevent import failures from crashing extension
- Platform detection and error handling with user-friendly notifications
- Output channel logging for debugging initialization issues

### File Extension Support
- Supported: `.jpg`, `.jpeg`, `.png`, `.webp`
- Configured via `package.json` contribution points for context menus

### VS Code Integration Points

**Command Registration**:
- `extension.inspectImageMetadata` - Main command accessible via:
  - Explorer context menu (right-click on image files)
  - Editor title context menu (right-click on open image tabs)
  - Command palette search

**Document Provider**:
- Custom scheme: `image-metadata://`
- Provides formatted metadata content as virtual documents
- Opens in second column for side-by-side viewing

## Development Workflow

### Making Changes
1. Modify TypeScript source in `src/`
2. Run `npm run compile` or wait for watch mode
3. Press F5 to test in Extension Development Host
4. Check Output panel ("Image Metadata Extension") for debug logs

### Testing ExifTool Issues
- Windows: Vendored ExifTool should work out of the box
- macOS/Linux: Ensure ExifTool is installed (`brew install exiftool` or `sudo apt install libimage-exiftool-perl`)
- Check platform info in extension output for troubleshooting

### Package.json Contributions
Key contribution points that affect behavior:
- `commands` - Registers the main inspect command
- `menus.explorer/context` - Right-click context in file explorer
- `menus.editor/title/context` - Right-click context on open image tabs
- `menus.commandPalette` - Command palette availability

## Important Implementation Details

### Error Handling Strategy
- Graceful degradation from vendored to native ExifTool
- User-friendly error messages with platform-specific installation instructions
- Comprehensive logging to output channel for debugging

### Metadata Processing
- JSON prettification for embedded workflow data (especially ComfyUI)
- Platform information included in metadata output
- All metadata fields displayed in key-value format

### Cross-Platform Considerations
- Windows paths use backslashes, handled in filename extraction
- Native ExifTool execution via child_process for macOS/Linux
- Platform detection drives initialization and error messaging

## Testing Tips

1. Test with various image formats (JPG, PNG, WebP)
2. Verify metadata display includes JSON prettification for ComfyUI images
3. Test both file explorer and command palette invocation methods
4. Verify cross-platform behavior (especially ExifTool fallbacks)
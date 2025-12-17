# VS Code Image Metadata Extension

⚠️ **CRITICAL**: DO NOT ITERATE VERSION NUMBER UNTIL EXPRESSLY TOLD SO

## Quick Commands

```bash
npm run compile    # Build TypeScript → out/
npm run watch      # Auto-rebuild on changes
npm test          # Run extension tests
npm run package   # Create .vsix file
```

**Debug**: Press `F5` to launch Extension Development Host

## Architecture

- **Extension Entry**: `src/extension.ts` - Main extension logic with ExifTool initialization
- **ExifTool Loading**: Lazy-loaded with fallback to system-installed ExifTool
- **Cross-Platform Binaries**: Bundled in `node_modules/exiftool-vendored.exe` (Windows) and `node_modules/exiftool-vendored.pl` (macOS/Linux)

## Future Improvements

### Performance Optimization
- [ ] **Bundle extension with webpack/esbuild** to reduce file count (currently 1245 files, 21MB)
  - Challenge: Complex with native ExifTool binaries - requires careful configuration
  - Research best approach for bundling with platform-specific native executables
  - See: https://aka.ms/vscode-bundle-extension
  - Note: Current size is acceptable but could improve load performance

### Additional Features
- [ ] Workflow JSON extraction to separate files (for ComfyUI workflows)
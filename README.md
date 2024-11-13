# Image Metadata Display Extension for VSCode

This extension for Visual Studio Code allows users to view metadata of PNG, JPG, and WEBP images directly within the editor. With a simple command, you can inspect the embedded metadata of any image file in your workspace (and beyond via command palette). It was originally created for easily inspecting [ComfyUI](https://github.com/comfyanonymous/ComfyUI) images' metadata from within VSCode. Special thanks to ChatGPT for all the assistance.

!["Inspect JPG, PNG & WEBP Metadata via explorer right-click"](images/explorer_example.png)

## Features

- **Inspect JPG, PNG & WEBP Metadata** - Opens a read-only document next to the image that displays the image file's metadata.
- **Prettified JSON Metadata** - If the metadata contains JSON strings, they are displayed in a prettified format for better readability.
- **Output Console Messages** - Debug and informational messages are logged to the VS Code Output console for better troubleshooting and visibility.

## Installation from VSIX

To manually install:
1. Download the `.vsix` file from the latest [release](https://github.com/Gerkinfeltser/image-metadata-display/releases).
2. In VS Code, go to **Extensions** > **...** > **Install from VSIX...**, and select the downloaded file.

## Usage

To view the metadata of an image file, you have several options:

1. **Right-click on an image file within the Explorer pane**:
   - Right-click on the image file and select "Inspect Image Metadata".
2. **Right-click on the title bar of an open image preview**:
   - Right-click on the title bar of the open image preview and select "Inspect Image Metadata".
3. **Use the "Inspect Image Metadata" command from the Command Palette**:
   - Open the Command Palette by pressing `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
   - Type "Inspect Image Metadata" and select it.
   - A dialogue box will open to select the image you'd like to inspect.

## Viewing Output Console Messages

To view the debug and informational messages logged by the extension:

1. Open the Output panel in VS Code by selecting `View` > `Output` or using the shortcut `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (macOS).
2. Select the `Image Metadata Extension` channel from the dropdown menu.
3. Run your extension and perform actions to trigger the debug messages.

## Requirements

- Visual Studio Code version 1.87.0 or higher.

## Extension Settings

This extension contributes the following command:
- `extension.inspectImageMetadata`: Inspect Image Metadata

## Known Issues/Future Work

- Extracting the workflow JSON portion to its own JSON file does not seem to create a working workflow in Comfyui. Maybe *someday*...
- So far this has only been tested on Windows (10) VS Code. Your mileage on other platforms may vary.

## Contributing

We welcome contributions to the Image Metadata Display extension. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Open a pull request to the main repository.

### Build Instructions

To build the extension, follow these steps:

1. **Clone the repository**:
   - Clone the repository to your local machine.
2. **Install dependencies**:
   - Run `npm install` to install the necessary dependencies.
3. **Build the extension**:
   - Run `npm run build` to build the extension. This will generate the contents of the `\out` directory.

## Acknowledgments

- [ExifTool](https://exiftool.org/) - Used for reading image metadata.
- [vscode](https://code.visualstudio.com/) - Visual Studio Code editor.
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) - Node based Image/Everything Generator

## Changelog

For detailed release notes, please see the [CHANGELOG.md](CHANGELOG.md) file.

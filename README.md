# Image Metadata Display Extension for VSCode

This extension for Visual Studio Code allows users to view metadata of PNG, JPG, and WEBP images directly within the editor. With a simple command, you can inspect the embedded metadata of any image file in your workspace (and beyond via command palette). It was originally created for easily inspecting [ComfyUI](https://github.com/comfyanonymous/ComfyUI) images' metadata from within VSCode. Special thanks to ChatGPT for all the assistance.

!["Inspect JPG, PNG & WEBP Metadata via explorer right-click"](images/explorer_example.png)

## Features

- **Inspect JPG, PNG & WEBP Metadata** - Opens a read-only document next to the image that displays the image file's metadata.

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

## Installation

To install the extension, follow these steps:

1. **Download the `.vsix` file**:
   - Go to the [releases page](https://github.com/Gerkinfeltser/image-metadata-display/releases) and download the latest `.vsix.zip` file.
   - Unzip the file to a location of your choice.
2. **Open Visual Studio Code**:
   - Launch Visual Studio Code.
3. **Install the extension**:
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
   - Click on `...` at the top of the Extensions view, and select "Install from VSIX...".
   - Locate the `.vsix` file you downloaded and select it.

The extension will be installed and ready for use.

## Requirements

- Visual Studio Code version 1.87.2 or higher.

## Extension Settings

This extension contributes the following command:
- `extension.inspectImageMetadata`: Inspect Image Metadata

## Troubleshooting

- **Metadata document is overtaken by another**:
  - Pin the document via the titlebar right-click "Pin" menu entry.
- **Extracting the workflow JSON portion to its own JSON file does not work**:
  - This is a known issue. We are working on a solution.
- **Extension size is large**:
  - The extension is currently 10 megabytes, which seems large. We are investigating ways to reduce the size.

## Known Issues/Future Work

- Extracting the workflow JSON portion to its own JSON file does not seem to create a working workflow in Comfyui. Maybe *someday*...
- Figure out a way to make this extension smaller. It seems crazy that this extension is 10 megabytes, am-I-right?

## Release Notes

### 0.0.4
Added support for JPG & WEBP files.

### 0.0.3
Initial release of Image Metadata Display.

## Contributing

We welcome contributions to the Image Metadata Display extension. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Open a pull request to the main repository.

## License

This extension is released under the [MIT License](LICENSE).

## Acknowledgments

- [ExifTool](https://exiftool.org/) - Used for reading image metadata.
- [vscode](https://code.visualstudio.com/) - Visual Studio Code editor.
